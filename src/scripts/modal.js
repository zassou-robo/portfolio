// シンプルなモーダル制御（focus trapは簡易実装）
(function(){
  const openButtons = document.querySelectorAll('.skill_modal_open');
  const body = document.body;
  let activeModal = null;
  let lastFocused = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden','false');
    body.style.overflow = 'hidden'; // 背景スクロール防止
    activeModal = modal;
    // 最初のフォーカス可能要素へ移動
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
    document.addEventListener('keydown', onKeyDown);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden','true');
    body.style.overflow = '';
    activeModal = null;
    document.removeEventListener('keydown', onKeyDown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
    // 簡易フォーカストラップ（Tab の循環）
    if (e.key === 'Tab' && activeModal) {
      const focusable = Array.from(activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled'));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.modalTarget);
      openModal(target);
    });
  });

  // Close buttons and overlay
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal__close')) {
      const modal = e.target.closest('.modal');
      closeModal(modal);
    }
    if (e.target.matches('[data-modal-overlay]')) {
      const modal = e.target.closest('.modal');
      closeModal(modal);
    }
  });

  // 任意：close all on load / 保険
  window.closeAllModals = function() {
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m => closeModal(m));
  };
})();
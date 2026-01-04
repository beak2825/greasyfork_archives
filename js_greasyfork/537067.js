// ==UserScript==
// @name         Faster ChatGPT Delete
// @namespace    https://chat.openai.com/
// @version      1.0
// @description  Hover to reveal a trash‑can icon and click to auto‑delete the conversation (there is no confirmation popup).
// @match        https://chat.openai.com/*
// @include      https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537067/Faster%20ChatGPT%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/537067/Faster%20ChatGPT%20Delete.meta.js
// ==/UserScript==

(() => {
  const waitFor = (pred, ms = 4000, step = 70) =>
    new Promise(res => {
      const end = Date.now() + ms;
      (function loop() {
        const el = pred();
        if (el) return res(el);
        if (Date.now() > end) return res(null);
        setTimeout(loop, step);
      })();
    });

  const fire = (el, type) =>
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, composed: true }));

  async function deleteConversation(anchor) {
    const href = anchor.getAttribute('href');
    const stay = href && location.pathname !== href;

    const dots = anchor.querySelector('button[data-testid$="-options"]');
    if (!dots) return;
    ['pointerdown', 'pointerup', 'click'].forEach(t => fire(dots, t));

    const del = await waitFor(() =>
      [...document.querySelectorAll('[role="menuitem"], button')].find(el =>
        /^delete$/i.test(el.textContent.trim()) && !el.closest('.quick‑delete')
      )
    );
    if (!del) return;
    ['pointerdown', 'pointerup', 'click'].forEach(t => fire(del, t));

    const confirm = await waitFor(() =>
      document.querySelector('button[data-testid="delete-conversation-confirm-button"], .btn-danger')
    );
    if (!confirm) return;
    ['pointerdown', 'pointerup', 'click'].forEach(t => fire(confirm, t));

    if (stay) setTimeout(() => history.replaceState(null, '', location.pathname), 80);

    anchor.style.transition = 'opacity .25s';
    anchor.style.opacity = '0';
    setTimeout(() => (anchor.style.display = 'none'), 280);
  }

  const ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6
             m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

  function decorate(anchor) {
    if (anchor.querySelector('.quick‑delete')) return;

    anchor.style.position = 'relative';

    const icon = Object.assign(document.createElement('span'), {
      className: 'quick‑delete',
      innerHTML: ICON
    });

    const bg1 = 'var(--sidebar-surface-secondary, #4b5563)';
    const bg2 = 'var(--sidebar-surface-tertiary , #6b7280)';

    Object.assign(icon.style, {
      position: 'absolute',
      left: '4px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      pointerEvents: 'auto',
      zIndex: 5,
      padding: '2px',
      borderRadius: '4px',
      background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
      color: 'var(--token-text-primary)',
      opacity: 0,
      transition: 'opacity 100ms'
    });

    anchor.addEventListener('mouseenter', () => {
      icon.style.opacity = '.85';
      anchor.style.transition = 'padding-left 100ms';
      anchor.style.paddingLeft = '28px';
    });
    anchor.addEventListener('mouseleave', () => {
      icon.style.opacity = '0';
      anchor.style.paddingLeft = '';
    });

    icon.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      deleteConversation(anchor);
    });

    anchor.prepend(icon);
  }

  const itemSelector = 'a.__menu-item';

  function handleMutation(records) {
    for (const rec of records) {
      rec.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches(itemSelector)) decorate(node);
        else if (node.nodeType === 1) node.querySelectorAll?.(itemSelector).forEach(decorate);
      });
    }
  }

  function decorateInBatches(nodes) {
    const batch = nodes.splice(0, 50);
    batch.forEach(decorate);
    if (nodes.length) requestIdleCallback(() => decorateInBatches(nodes));
  }

  function init() {
    const container = document.querySelector('nav') || document.body;
    new MutationObserver(handleMutation)
      .observe(container, { childList: true, subtree: true });
    const startNodes = [...container.querySelectorAll(itemSelector)];
    if (startNodes.length) requestIdleCallback(() => decorateInBatches(startNodes));
  }

  const ready = setInterval(() => {
    if (document.querySelector('nav')) {
      clearInterval(ready);
      init();
    }
  }, 200);
})();
// ==UserScript==
// @name         GPT Message Top Scroll
// @namespace    https://greasyfork.org/users/your-id-or-homepage
// @version      1.3
// @description  The “↑” button next to Copy/Edit scrolls only large messages (>=700 characters) to their top, aligned per message; supports both user and assistant.
// @author       Madhuvrata
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542281/GPT%20Message%20Top%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/542281/GPT%20Message%20Top%20Scroll.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // CSS
  const style = document.createElement('style');
  style.textContent = `
    .tm-scroll-top-btn {
      width: 32px!important;
      height: 32px!important;
      margin: 0 4px!important;
      background: rgba(0,0,0,0.05)!important;
      border: 1px solid rgba(0,0,0,0.1)!important;
      border-radius: 6px!important;
      display: inline-flex!important;
      align-items: center!important;
      justify-content: center!important;
      cursor: pointer!important;
      opacity: .7!important;
      transition: opacity .2s, background .2s;
      pointer-events: auto!important;
    }
    .tm-scroll-top-btn:hover { opacity: 1!important; background: rgba(0,0,0,0.1)!important; }
    .tm-force-panel {
      opacity: 1!important;
      pointer-events: auto!important;
      mask-image: none!important;
      -webkit-mask-image: none!important;
    }
  `;
  document.head.appendChild(style);

  const svgArrow = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 4l-6 6h4v6h4v-6h4l-6-6z"/>
    </svg>`;

  // панель кнопок для user и assistant
  const PANEL_SELECTOR = `
    article[data-testid^="conversation-turn-"] .flex.justify-end,
    article[data-testid^="conversation-turn-"] .flex.justify-start
  `.trim().replace(/\s+/g,' ');

  function injectButtons() {
    document.querySelectorAll(PANEL_SELECTOR).forEach(panel => {
      panel.classList.add('tm-force-panel');
      const inner = panel.querySelector(':scope > div');
      if (!inner || inner.querySelector('.tm-scroll-top-btn')) return;
      inner.classList.add('tm-force-panel');

      // найдём связанный article и контейнер markdown
      const article = panel.closest('article[data-testid^="conversation-turn-"]');
      if (!article) return;
      const md = article.querySelector('.markdown') || article;

      // длина текста
      const txtLen = (md.innerText || '').length;

      // создаём кнопку
      const btn = document.createElement('button');
      btn.className = 'tm-scroll-top-btn';
      btn.innerHTML = svgArrow;
      btn.title = 'Scroll message to top';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        // если короткое сообщение — игнорируем
        if (txtLen < 700) return;
        article.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      inner.appendChild(btn);
    });
  }

  injectButtons();
  new MutationObserver(injectButtons)
    .observe(document.body, { childList: true, subtree: true });
})();

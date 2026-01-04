// ==UserScript==
// @name         T3Chat Up-Arrow Edit
// @version      0.1.1
// @description  Press ↑ in an empty compose box to edit your last message
// @match        https://t3.chat/*
// @match        https://*.t3.chat/*
// @run-at       document-idle
// @grant        none
// @namespace    wearifulpoet.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538059/T3Chat%20Up-Arrow%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/538059/T3Chat%20Up-Arrow%20Edit.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const INPUT_SELECTORS = [
    '#chat-input',
    'textarea[aria-describedby="chat-input-description"]',
    'textarea[placeholder*="message"]',
    'textarea[data-testid="chat-input"]',
  ];

  const MESSAGE_CONTAINER_SELECTOR = '[role="article"]';
  const MESSAGE_CONTENT_SELECTOR = '.prose';
  const EDIT_BUTTON_SELECTOR = 'button[aria-label="Edit message"]';

  const findChatInput = () =>
    INPUT_SELECTORS.map((s) => document.querySelector(s)).find(
      (el) => el && el.tagName === 'TEXTAREA',
    ) || null;

  const findLastUserMessage = () => {
    const containers = [...document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR)];
    for (let i = containers.length - 1; i >= 0; i--) {
      const c = containers[i];
      const btn = c.querySelector(EDIT_BUTTON_SELECTOR);
      const txt = c.querySelector(MESSAGE_CONTENT_SELECTOR);
      if (btn && txt?.textContent.trim()) return { container: c, editButton: btn };
    }
    return null;
  };

  const scrollToMessage = (el) => {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    } catch {
      el.scrollIntoView(true);
    }
  };

  const handleUpArrow = (e) => {
    if (e.key !== 'ArrowUp' || e.isComposing) return;
    const input = e.currentTarget;
    if (input.value.trim() || input.selectionStart !== 0 || input.selectionEnd !== 0) return;

    const last = findLastUserMessage();
    if (!last) return;

    e.preventDefault();
    last.editButton.click();
    setTimeout(() => scrollToMessage(last.container), 150);
  };

  const attach = (input) => {
    if (input.dataset.arrowEditBound === '1') return;
    input.addEventListener('keydown', handleUpArrow);
    input.dataset.arrowEditBound = '1';
  };

  const bind = () => {
    const input = findChatInput();
    if (input) attach(input);
  };

  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      for (const node of mut.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (
          INPUT_SELECTORS.some(
            (s) => node.matches?.(s) || node.querySelector?.(s),
          )
        ) {
          setTimeout(bind, 100);
          return;
        }
      }
    }
  });

  const init = () => {
    bind();
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else init();
})();

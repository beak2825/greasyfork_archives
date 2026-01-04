// ==UserScript==
// @name         ChatGPT Easy Delete Chat
// @namespace    nisc
// @version      2025.06.08-B
// @description  Delete ChatGPT chat with only Cmd/Ctrl+Shift+Delete, auto-confirms popup.
// @homepageURL  https://github.com/nisc/chatgpt-userscripts/
// @author       nisc
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538670/ChatGPT%20Easy%20Delete%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/538670/ChatGPT%20Easy%20Delete%20Chat.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Check if user is on macOS using modern userAgentData API, falling back to userAgent string
  const IS_MAC = navigator.userAgentData?.platform === 'macOS' || /Mac/i.test(navigator.userAgent);
  const META = IS_MAC ? 'metaKey' : 'ctrlKey';

  /**
   * Find a button element by matching its text content against a regex
   * @param {RegExp} regex - Regular expression to match button text
   * @returns {HTMLButtonElement|undefined} The found button or undefined
   */
  const findButtonByText = (regex) =>
    Array.from(document.querySelectorAll('button')).find(b => regex.test(b.textContent || ''));

  /**
   * Check if we're on a chat page (not settings or home)
   * @returns {boolean} True if on an active chat page
   */
  const isChatPage = () =>
    window.location.pathname.startsWith('/c/') && !window.location.hash.startsWith('#settings');

  // Listen for the keyboard shortcut
  document.addEventListener('keydown', e => {
    if (!isChatPage()) return;

    // Ignore if we're in a text input
    const tgt = document.activeElement;
    if (['INPUT', 'TEXTAREA'].includes(tgt.tagName) || tgt.isContentEditable) return;

    // Check for Cmd/Ctrl+Shift+Delete
    if (e.key === 'Delete' && e[META] && e.shiftKey && !e.altKey) {
      e.preventDefault();
      const btn = findButtonByText(/delete chat/i);
      if (btn) btn.click();
      else console.warn('[ChatGPT Delete] button not found');
    }
  });

  // Auto-confirm the delete popup when it appears
  new MutationObserver(() => {
    if (!isChatPage()) return;
    const confirmBtn = findButtonByText(/^delete$/i);
    if (confirmBtn) confirmBtn.click();
  }).observe(document.body, { childList: true, subtree: true });
})();
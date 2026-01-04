// ==UserScript==
// @license MIT
// @name         EnterToLogin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press Enter to trigger a login-related button if no input is focused.
// @author       aceitw
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531598/EnterToLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/531598/EnterToLogin.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Utility: normalize text for matching (e.g. "Sign In" -> "signin")
  function normalize(text) {
    return text.toLowerCase().replace(/\s+/g, '');
  }

  // Utility: is element visible?
  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
  }

  // Utility: is likely a login button based on text
  function isLoginText(text) {
    const normalized = normalize(text);
    return /^(log(in)?|sign(in)?)$/.test(normalized);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;

    const active = document.activeElement;
    const isTyping = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );
    if (isTyping) return;

    const candidates = Array.from(document.querySelectorAll('button, input[type="submit"], a'));
    const loginBtn = candidates.find(el => {
      const text = el.innerText || el.value || '';
      return isVisible(el) && isLoginText(text);
    });

    if (loginBtn) {
      loginBtn.click();
      e.preventDefault();
    }
  });
})();

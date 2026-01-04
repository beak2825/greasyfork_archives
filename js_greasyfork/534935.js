// ==UserScript==
// @name         Underscore & Dash Cleaner (Lite)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add a “Clean” button to your Title field; strips underscores & all but the first/last dash.
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534935/Underscore%20%20Dash%20Cleaner%20%28Lite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534935/Underscore%20%20Dash%20Cleaner%20%28Lite%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 1) CSS for the button
  GM_addStyle(`
    .tm-clean-btn {
      position: absolute;
      top: 50%;
      right: 0.75rem;
      transform: translateY(-50%);
      padding: 0.3rem 0.7rem;
      font-size: 0.9rem;
      line-height: 1;
      font-family: inherit;
      background: #444;
      border: 1px solid #555;
      border-radius: 4px;
      color: #eee;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      z-index: 10;
    }
    .tm-clean-btn:hover { background: #555; border-color: #666; }
    .tm-clean-btn:active { background: #333; border-color: #444; }
  `);

  // 2) Fast cleaner: underscores -> spaces; keep first/last dash only
  function cleanText(s) {
    s = s.replace(/_/g, ' ');
    const first = s.indexOf('-');
    const last  = s.lastIndexOf('-');
    if (first < 0 || first === last) return s;
    const prefix = s.slice(0, first + 1);           // include first dash
    const middle = s.slice(first + 1, last).replace(/-/g, ' ');
    const suffix = s.slice(last);                   // keep last dash + rest
    return prefix + middle + suffix;
  }

  // 3) Inject button if #name exists (runs once)
  function inject() {
    const input = document.getElementById('name');
    if (!input || input.dataset.cleanInjected) return;
    input.dataset.cleanInjected = '1';

    // position container
    const group = input.closest('.form__group') || input.parentElement;
    if (!group) return;
    group.style.position = 'relative';
    input.style.paddingRight = '4rem';

    // make button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Clean';
    btn.className = 'tm-clean-btn';
    group.appendChild(btn);

    btn.addEventListener('click', () => {
      // slight delay to yield to browser
      setTimeout(() => {
        input.value = cleanText(input.value);
        input.focus();
      }, 0);
    });
  }

  // run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

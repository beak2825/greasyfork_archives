// ==UserScript==
// @name         DeepSeek Smart Focus Manager
// @description  Autografts typing into the DeepSeek chat input on keypress, but blocks all other programmatic autofocus.
// @match        https://chat.deepseek.com/*
// @run-at       document-start
// @version 0.0.1.20250512102624
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535767/DeepSeek%20Smart%20Focus%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/535767/DeepSeek%20Smart%20Focus%20Manager.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //
  // 1) PREVENT all programmatic .focus() calls on TEXTAREA,
  //    *unless* the textarea has a special allowFocus flag.
  //
  const originalFocus = HTMLElement.prototype.focus;
  Object.defineProperty(HTMLElement.prototype, 'focus', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function(...args) {
      if (this.tagName === 'TEXTAREA') {
        // only allow if we've explicitly marked it
        if (this._allowDeepSeekFocus) {
          // consume the flag and focus
          delete this._allowDeepSeekFocus;
          return originalFocus.apply(this, args);
        }
        // otherwise swallow the focus()
        return;
      }
      // not a textarea => no change
      return originalFocus.apply(this, args);
    }
  });


  //
  // 2) AUTO-FOCUS & INJECT TEXT when you type anywhere on the page.
  //
  document.addEventListener('keydown', e => {
    // only letters/digits, not in an input already
    const active = document.activeElement;
    if (
      e.key.length === 1 &&
      /^[\w]$/i.test(e.key) &&
      !e.ctrlKey && !e.metaKey &&
      !(active && /^textarea|input$/i.test(active.tagName))
    ) {
      const textarea = document.getElementById('chat-input');
      if (!textarea) return;

      // prevent default so the page doesn’t try anything else
      e.preventDefault();

      // mark that *we* are allowed to focus it now
      textarea._allowDeepSeekFocus = true;
      textarea.focus();

      // insert the character where the cursor would go
      const start = textarea.selectionStart;
      const end   = textarea.selectionEnd;
      textarea.setRangeText(e.key, start, end, 'end');

      // notify React/MUI/etc.
      textarea.dispatchEvent(new Event('input',  { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
})();

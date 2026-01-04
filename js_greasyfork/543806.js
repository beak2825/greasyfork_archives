// ==UserScript==
// @name         Hide ChatGPT Popover and Shortcut Hints
// @namespace    https://chat.openai.com/
// @version      1.2
// @description  Removes keyboard shortcut popover and inline kbd hints on ChatGPT
// @author       ChiaraStellata & ChatGPT
// @match        *://chatgpt.com/*
// @grant        none
// @license      CC0 / public domain
// @downloadURL https://update.greasyfork.org/scripts/543806/Hide%20ChatGPT%20Popover%20and%20Shortcut%20Hints.user.js
// @updateURL https://update.greasyfork.org/scripts/543806/Hide%20ChatGPT%20Popover%20and%20Shortcut%20Hints.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.textContent = `
    /* Hide inline shortcut hints */
    kbd { display: none !important; }

    /* Hide ONLY the bottom-left shortcuts popover (no role="menu") */
    .popover.start-3.bottom-3:not([role="menu"]) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
})();

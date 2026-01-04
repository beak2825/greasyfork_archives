// ==UserScript==
// @name        enable-copy-telegram
// @namespace   Violentmonkey Scripts
// @match       https://web.telegram.org/*
// @grant       none
// @version     1.0
// @run-at      document-end
// @author      maanimis
// @description Enable copying text on Telegram Web
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527824/enable-copy-telegram.user.js
// @updateURL https://update.greasyfork.org/scripts/527824/enable-copy-telegram.meta.js
// ==/UserScript==

(function () {
  function preventCopyOverride(e) {
    if (e.ctrlKey && e.keyCode === 67) {
      e.preventDefault();
      e.stopImmediatePropagation();

      const selection = window.getSelection().toString();
      if (selection) {
        navigator.clipboard.writeText(selection).catch((err) => {
          console.error("Failed to copy text: ", err);
        });
      }
    }
  }

  document.addEventListener("keydown", preventCopyOverride, true);
})();

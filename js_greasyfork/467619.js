// ==UserScript==
// @name        Instagram Next/Prev Shortcut
// @namespace   https://github.com/gslin/instagram-next-prev-shortcut-userscript
// @match       https://www.instagram.com/*
// @grant       none
// @version     0.20230608.0
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Add shortcuts for Instagram Next/Prev buttons
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/467619/Instagram%20NextPrev%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/467619/Instagram%20NextPrev%20Shortcut.meta.js
// ==/UserScript==

(() => {
  document.addEventListener('keyup', function(event) {
    if ('input' === document.activeElement.tagName.toLowerCase()) {
      return;
    }

    if ('<' === event.key) {
      const el = document.querySelector('div[role="dialog"] button[aria-label="Go Back"]');
      el?.click();
      return;
    }

    if ('>' === event.key) {
      const el = document.querySelector('div[role="dialog"] button[aria-label="Next"]');
      el?.click();
      return;
    }
  });
})();

// ==UserScript==
// @name        Use keyboard to change pagination
// @namespace   https://github.com/gslin/use-keyboard-to-change-linkedin-pagination
// @match       https://www.linkedin.com/*
// @grant       none
// @version     0.20240109.0
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Use '<' and '>' to change LinkedIn's pagination
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/485187/Use%20keyboard%20to%20change%20pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/485187/Use%20keyboard%20to%20change%20pagination.meta.js
// ==/UserScript==

(() => {
  'use strict';

  document.addEventListener('keyup', function(ev) {
    const ae = document.activeElement.tagName.toLowerCase();
    if ('input' === ae || 'textarea' === ae) {
      return;
    }
    if ('<' === ev.key) {
      document.querySelector('button[aria-label="Previous"]')?.click();
      return;
    }
    if ('>' === ev.key) {
      document.querySelector('button[aria-label="Next"]')?.click();
      return;
    }
  });
})();

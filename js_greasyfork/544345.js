// ==UserScript==
// @name         Automatically solve number captcha
// @namespace    hhttp://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks captcha numbers in the correct order.
// @author       Rubystance
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544345/Automatically%20solve%20number%20captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/544345/Automatically%20solve%20number%20captcha.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('load', () => {

    setTimeout(() => {

      const numberButtons = Array.from(document.querySelectorAll('a[rel]'))
        .filter(el => /^\d+$/.test(el.getAttribute('rel')));

      if (numberButtons.length === 0) {
        console.log('[AutoCaptcha] No buttons found with numeric rel attribute.');
        return;
      }

      numberButtons.sort((a, b) => {
        return parseInt(a.getAttribute('rel')) - parseInt(b.getAttribute('rel'));
      });

      console.log(`[AutoCaptcha] Solving captcha with ${numberButtons.length} buttons.`);

      numberButtons.forEach((btn, index) => {
        setTimeout(() => {
          console.log(`[AutoCaptcha] Clicking button: ${btn.getAttribute('rel')}`);
          btn.click();
        }, index * 600);
      });

    }, 1500);
  });

})();

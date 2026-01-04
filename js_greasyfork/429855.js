// ==UserScript==
// @name         FaucetPay Bypass
// @namespace    https://greasyfork.org/zh-CN/users/193133-pana
// @version      1.2.0
// @description  bypass
// @author       pana
// @match        *://faucetpay.io/*
// @license      GNU General Public License v3.0 or later
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429855/FaucetPay%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/429855/FaucetPay%20Bypass.meta.js
// ==/UserScript==

(function () {
  'user strict';

  /* global timerTick, startPTC:writable */

  if (typeof startPTC === 'function') {
    startPTC = () => {
      console.log('exec startPTC');
      if (window.started_ptc == 0) {
        window.in_focus = 1;
        window.started_ptc = 1;
        timerTick();
      }
    };
  }

  window.onblur = () => {
    console.log('onblur');
    window.in_focus = 1;
  };

  window.in_focus = 1;
})();

// ==UserScript==
// @name         Open GitHub URL for Gmail
// @namespace    http://kyanny.me/
// @version      0.1
// @description  Open `view it on GitHub` link of notification email on Gmail.
// @author       Kensuke Nagae
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34099/Open%20GitHub%20URL%20for%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/34099/Open%20GitHub%20URL%20for%20Gmail.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener('keyup', function(e) {
    if (e.key === "v" || e.key === "V") {
      Array.prototype.slice.call(
        document.querySelectorAll('a')
      ).some(function(el) {
        if (el.textContent.match(/^View it on GitHub$/i)) {
          el.click();
          return true;
        }
      });
    }
  });
})();
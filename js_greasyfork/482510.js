// ==UserScript==
// @name         Speed up Google Captcha
// @version      1.1
// @match        *://*/recaptcha/*
// @grant        none
// @namespace https://greasyfork.org/en/users/85671-jcunews
// @description Makes Google Captcha work faster by removing slow visual transitions and unnecessary delays.
// @downloadURL https://update.greasyfork.org/scripts/482510/Speed%20up%20Google%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/482510/Speed%20up%20Google%20Captcha.meta.js
// ==/UserScript==
(function() {
  const originalSetTimeout = setTimeout;
  setTimeout = function(fn, dur) {
    if (dur in { 4000: 0, 50: 0 }) {
      dur = 0; // Object literal for faster lookup
    }
    return originalSetTimeout.apply(this, arguments);
  };

  // Use a safer and cleaner approach to disable transitions
  const style = document.createElement("style");
  style.innerText = `
    * {
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
})();
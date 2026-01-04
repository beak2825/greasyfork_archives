// ==UserScript==
// @name         Speed up Google Captcha
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.2
// @license      AGLPv3
// @author       jcunews
// @description  Makes Google Captcha works faster by removing slow visual transitions and unnecessary delays.
// @match        https://www.google.com/recaptcha/api2/bframe*
// @match        https://www.google.com/recaptcha/enterprise/bframe*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382039/Speed%20up%20Google%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/382039/Speed%20up%20Google%20Captcha.meta.js
// ==/UserScript==

(st => {
  st = setTimeout;
  setTimeout = function(fn, dur) {
    if ([4000,50].includes(dur)) dur = 0;
    return st.apply(this, arguments);
  };
  document.head.appendChild(document.createElement("STYLE")).innerHTML = '*{transition:none!important}'
})()
// ==UserScript==
// @name        reCaptcha Autoclicker
// @match       https://www.google.com/recaptcha/api2/anchor*
// @grant       none
// @version     1.0
// @author      ReznorsRevenge
// @description Automatically clicks the checkbox for Google's reCaptcha v2 (does NOT solve it for you).
// @namespace https://greasyfork.org/users/1473128
// @downloadURL https://update.greasyfork.org/scripts/536745/reCaptcha%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/536745/reCaptcha%20Autoclicker.meta.js
// ==/UserScript==
document.querySelector("#recaptcha-anchor").click();
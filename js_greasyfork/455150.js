// ==UserScript==
// @name        Redirect Gmail to HTML Version
// @namespace   Violentmonkey Scripts
// @match       https://mail.google.com/mail/u/0/
// @grant       none
// @version     1.0
// @author      -
// @description Redirects gmail links to html
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455150/Redirect%20Gmail%20to%20HTML%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/455150/Redirect%20Gmail%20to%20HTML%20Version.meta.js
// ==/UserScript==

(function () {
  window.location.href = 'https://mail.google.com/mail/u/0/h' + location.pathname;
})();
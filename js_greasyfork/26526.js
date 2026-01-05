
// ==UserScript==
// @name           noGoogleRedirect
// @namespace      maoanran@gmail.com
// @description    fuck google search page redirection
// @include        http://www.google.*/search*
// @include        https://www.google.*/search*
// @include        http://encrypted.google.*/search*
// @include        https://encrypted.google.*/search*
// @grant          none
// @version        1.0.0
// @downloadURL https://update.greasyfork.org/scripts/26526/noGoogleRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/26526/noGoogleRedirect.meta.js
// ==/UserScript==
(function () {
  window.addEventListener('load', function () {
    document.querySelectorAll && Array.prototype.forEach.call(document.querySelectorAll('h3.r > a'), function (elem) {
      elem.href = elem.href.replace(/.*\/interstitial\?url=/, '');
      elem.onmousedown = function () {};
    });
  });
}) ();

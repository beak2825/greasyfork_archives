// ==UserScript==
// @name        onmeda adblock notice remover
// @description:en removes the adblocker notice from the website
// @namespace   ps
// @include     *onmeda.de*
// @version     1
// @grant       none
// @description removes the adblocker notice from the website
// @downloadURL https://update.greasyfork.org/scripts/18738/onmeda%20adblock%20notice%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/18738/onmeda%20adblock%20notice%20remover.meta.js
// ==/UserScript==
$(function () {
  window.setTimeout(function () {
    var bc = $('body').children();
    bc[bc.length - 1].setAttribute('style', 'visibility:hidden;')
  }, 2000);
});

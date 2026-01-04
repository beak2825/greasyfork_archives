// ==UserScript==
// @name         Scroll and click Next chapter timeless leaf with right button keyboard
// @namespace    https://greasyfork.org/en/users/158832
// @version      0.5
// @description  try to make your life easier!
// @author       Riztard
// @include      https://timelessleaf.com*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390852/Scroll%20and%20click%20Next%20chapter%20timeless%20leaf%20with%20right%20button%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/390852/Scroll%20and%20click%20Next%20chapter%20timeless%20leaf%20with%20right%20button%20keyboard.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.onkeydown = function (event) {
    if (event.keyCode === 39) {

      var el = document.getElementById('gallery-1');
      el.scrollIntoView(false);
      window.scrollBy(0, 200)
      window.location.href = document.getElementsByClassName("entry-content")[0].getElementsByTagName("a")[0].getAttribute("href");
    }
  };
})();

// ==UserScript==
// @name         (Instagram) Allow Right-Click Image Downloading
// @namespace    http://tampermonkey.net/
// @version      2024-05-16
// @description  yeah
// @author       cupofdirtfordinner
// @match        https://www.instagram.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant       unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495178/%28Instagram%29%20Allow%20Right-Click%20Image%20Downloading.user.js
// @updateURL https://update.greasyfork.org/scripts/495178/%28Instagram%29%20Allow%20Right-Click%20Image%20Downloading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('gay')
    //"_aagw" is the class name for divs that are placed over IMG elements to prevent downloading them. see for yourself by right-clicking and inspecting any image!

    function DeleteAAGWs() {
      var aagw = document.querySelectorAll('._aagw')
      for (let i = 0; i < aagw.length; i++) {
        aagw[i].parentNode.removeChild(aagw[i])
      }
    }
    setInterval(DeleteAAGWs, 60)
})();
// ==UserScript==
// @name         ZYB001
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  testScript!
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460861/ZYB001.user.js
// @updateURL https://update.greasyfork.org/scripts/460861/ZYB001.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function shaixuan() {
      $(".extend-product-item").each(function (index, element) {
        let collect1 = $(this).find(".collect").text();
        if (collect1.replace(/[^\d]/g, "") < 20) {
          $(this).remove();
        }
      });
    }
    window.setInterval(function () {
      shaixuan();
    }, 500);
})();
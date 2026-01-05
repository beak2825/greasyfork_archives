// ==UserScript==
// @namespace    https://github.com/troyliu0105/reimuhelper
// @name         灵梦御所的老司机
// @version      0.0.1
// @description  开车注意安全!!!
// @author       troyliu0105
// @include      *://blog.reimu.net/archives/*
// @icon         https://blog.reimu.net/wp-content/uploads/2016/02/cropped-logo-192x192.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21450/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E7%9A%84%E8%80%81%E5%8F%B8%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/21450/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E7%9A%84%E8%80%81%E5%8F%B8%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
    var pres = document.getElementsByTagName("pre");
      for (var i = 0; i< pres.length; i++) {
        pres[i].style.display = 'block';
      }
})();

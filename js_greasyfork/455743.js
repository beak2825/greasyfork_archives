// ==UserScript==
// @name         移除搜狐灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1
// @author       mmi
// @match        https://www.sohu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sohu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455743/%E7%A7%BB%E9%99%A4%E6%90%9C%E7%8B%90%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455743/%E7%A7%BB%E9%99%A4%E6%90%9C%E7%8B%90%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector("html").style.filter="grayscale(0)"
    // Your code here...
})();
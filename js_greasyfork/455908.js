// ==UserScript==
// @name         复彩
// @namespace    None
// @version      1.0.0.1
// @description  一个简单的脚本，强行去除页面上所有元素的灰度滤镜。
// @author       Anonymous
// @match        *
// @include      *
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455908/%E5%A4%8D%E5%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/455908/%E5%A4%8D%E5%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        all[i].style.filter = "grayscale(0)";
    }
})();
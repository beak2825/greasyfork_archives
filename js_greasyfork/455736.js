// ==UserScript==
// @name         移除百度贴吧灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove tieba gray filter
// @author       mmi
// @match        *.tieba.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455736/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455736/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector("html").classList.remove("tb-allpage-filter")
    // Your code here...
})();

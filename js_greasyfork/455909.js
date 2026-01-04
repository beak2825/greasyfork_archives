// ==UserScript==
// @name         fu*k黑白滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉网站的黑白滤镜！
// @author       You
// @match        *://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455909/fu%2Ak%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455909/fu%2Ak%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeGreyscale() {
        document.getElementsByTagName('html')[0].style.filter = "grayscale(0)"
        document.getElementsByTagName('html')[0].style.filter = "grayscale(0)"
        document.getElementsByTagName('body')[0].style.webkitfilter = "grayscale(0)"
        document.getElementsByTagName('body')[0].style.webkitfilter = "grayscale(0)"
    }

    setTimeout(removeGreyscale, 500)
})();


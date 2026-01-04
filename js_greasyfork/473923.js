// ==UserScript==
// @name         禁用移动端浏览器下拉刷新
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁用移动端浏览器下拉刷新（Kiwi浏览器等）
// @author       Ymmzy
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473923/%E7%A6%81%E7%94%A8%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/473923/%E7%A6%81%E7%94%A8%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8B%E6%8B%89%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastY = 0;
    window.addEventListener('touchmove', function (e) {
        var scrolly = window.pageYOffset || window.scrollTop || 0;
        var direction = e.changedTouches[0].pageY > lastY ? 1 : -1;
        if (direction > 0 && scrolly === 0) {
            e.preventDefault();
        }
        lastY = e.changedTouches[0].pageY;
    }, {passive: false});
})();
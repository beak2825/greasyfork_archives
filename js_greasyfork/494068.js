// ==UserScript==
// @name         b站直播马赛克删除
// @namespace    http://your.namespace/here
// @version      0.1
// @description  Remove the specified div element from the webpage
// @author       Your Name
// @match        https://live.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494068/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/494068/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        var element = document.getElementById('web-player-module-area-mask-panel');
        if (element) {
            element.remove();
        }
    });
})();

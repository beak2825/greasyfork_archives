// ==UserScript==
// @name         哔哩哔哩直播间马赛克遮挡层去除
// @description  将哔哩哔哩直播间右上右下的马赛克遮挡层去除
// @author       星小韵
// @match        https://live.bilibili.com/*
// @grant        none
// @icon         https://www.bilibili.com/favicon.ico
// @version      0.2
// @license      MIT
// @namespace https://greasyfork.org/users/1312316
// @downloadURL https://update.greasyfork.org/scripts/497026/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E6%8C%A1%E5%B1%82%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/497026/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E6%8C%A1%E5%B1%82%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        var elements = document.getElementsByClassName("web-player-module-area-mask");
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }, 5000);
})();
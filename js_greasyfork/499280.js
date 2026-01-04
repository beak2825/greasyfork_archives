// ==UserScript==
// @name         删除 Bilibili 直播页面遮罩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除 Bilibili 直播页面加载完成后的遮罩元素
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499280/%E5%88%A0%E9%99%A4%20Bilibili%20%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/499280/%E5%88%A0%E9%99%A4%20Bilibili%20%E7%9B%B4%E6%92%AD%E9%A1%B5%E9%9D%A2%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 等待5秒钟再执行删除操作
        setTimeout(function() {
            // 查找并删除遮罩元素
            var maskElement = document.querySelector('.web-player-module-area-mask');
            if (maskElement) {
                maskElement.remove();
                console.log('已删除遮罩元素');
            } else {
                console.log('未找到遮罩元素');
            }
        }, 3000); // 5000毫秒即5秒钟
    });
})();

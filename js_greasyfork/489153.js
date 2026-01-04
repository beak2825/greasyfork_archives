// ==UserScript==
// @name         B站（守望先锋）直播间遮罩层自动删除脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动删除B站（守望先锋）直播间的遮罩层DIV元素
// @author       你的名字
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489153/B%E7%AB%99%EF%BC%88%E5%AE%88%E6%9C%9B%E5%85%88%E9%94%8B%EF%BC%89%E7%9B%B4%E6%92%AD%E9%97%B4%E9%81%AE%E7%BD%A9%E5%B1%82%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/489153/B%E7%AB%99%EF%BC%88%E5%AE%88%E6%9C%9B%E5%85%88%E9%94%8B%EF%BC%89%E7%9B%B4%E6%92%AD%E9%97%B4%E9%81%AE%E7%BD%A9%E5%B1%82%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面和DOM完全加载
    window.addEventListener('load', function() {
        // 延迟3秒再执行代码
        setTimeout(function() {
            // 查询特定的div元素
            var maskDiv = document.querySelector('div.web-player-module-area-mask');

            // 如果找到这个元素，则删除它
            if (maskDiv) {
                maskDiv.parentNode.removeChild(maskDiv);
                console.log('遮罩层已删除');
            }
        }, 3000); // 3000 毫秒 = 3 秒
    });
})();

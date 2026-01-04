// ==UserScript==
// @name         B站直播增强
// @namespace    Violentmonkey Scripts
// @match        https://live.bilibili.com/*
// @grant        none
// @version      0.1.1
// @author       Suye
// @license      MIT
// @description 自动网页全屏，隐藏侧边弹幕栏
// @downloadURL https://update.greasyfork.org/scripts/468620/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/468620/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 指定要应用的样式
    var style = 'supportWebp player-full-win over-hidden hide-asida-area hide-aside-area';

    // 延时时间
    var delayTime = 2000;

    // 等待页面加载完成后再执行操作
    setTimeout(function() {
        // 获取body元素
        var bodyElement = document.querySelector('body');

        if (bodyElement) {
            // 应用样式
            bodyElement.className = style;
        }
    }, delayTime);
})();
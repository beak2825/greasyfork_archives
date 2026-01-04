// ==UserScript==
// @name         下头B站
// @author       RealSeek
// @license      MIT
// @namespace    https://github.com/RealSeek
// @version      1.0
// @description  去掉B站直播区网页全屏底下下的那一栏礼物
// @match      https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462335/%E4%B8%8B%E5%A4%B4B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/462335/%E4%B8%8B%E5%A4%B4B%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待 1 秒钟以确保元素已加载完成
    setTimeout(function() {
        // 获取要删除的元素
        const elementToRemove = document.getElementById('web-player__bottom-bar__container');

        if (elementToRemove) {
            // 删除元素
            elementToRemove.remove();
        }
    }, 1000);
})();
// ==UserScript==
// @name         Bilibili合集列表高度调整
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  调整B站合集列表高度
// @author       vertexz
// @match        https://www.bilibili.com/video/*
// @icon         https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @grant        none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/439896/Bilibili%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/439896/Bilibili%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var targetNode = document.getElementsByClassName("video-sections-content-list")[0];
    // 没有合集列表不需要设置
    if (!targetNode) return;
    // 合集列表有两种，带视频封面的列表不需要设置高度
    var smallMode = targetNode.getElementsByClassName('video-sections-item small-mode');
    if (smallMode.length > 0) {
        console.log('合集列表高度不需要设置');
        return;
    }
    // 自定义高度
    var height = '220px';
    targetNode.style.height = height;
    targetNode.style.maxHeight = '100%';
    // 第一次设置高度后，等页面刷新完会被重置成原来的高度，所以需要再次设置
    var timer = setInterval(function () {
        console.log('合集列表高度设置' + height);
        if (targetNode.style.height != height) {
            targetNode.style.height = height;
            clearInterval(timer);
        }
    }, 500);
    // 防止定时器未能及时清除，3秒后清除定时器
    setTimeout(function () {
        clearInterval(timer);
    }, 3000)
})();
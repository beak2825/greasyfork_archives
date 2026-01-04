// ==UserScript==
// @name         b站直播全屏的时候删除下面的刷礼物栏
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.1
// @description  烦死了好恶心
// @author       小废物
// @match        https://live.bilibili.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462919/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E7%9A%84%E6%97%B6%E5%80%99%E5%88%A0%E9%99%A4%E4%B8%8B%E9%9D%A2%E7%9A%84%E5%88%B7%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462919/b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E7%9A%84%E6%97%B6%E5%80%99%E5%88%A0%E9%99%A4%E4%B8%8B%E9%9D%A2%E7%9A%84%E5%88%B7%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 直接把刷礼物显示的标签删除，它是鼠标移下去就显示移开屏幕就隐藏
    setTimeout(() => {
        let element = document.getElementById("full-screen-interactive-wrap");
        if (element) {
            element.parentNode.removeChild(element);
        }
        document.querySelector('fullscreen-danmaku').style.bottom = '10px'
    }, 3000)
})();


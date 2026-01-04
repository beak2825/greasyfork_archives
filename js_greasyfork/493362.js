// ==UserScript==
// @name         隐藏B站MC直播间马赛克
// @namespace    Qishao
// @version      1.03
// @description  一个非常简单隐藏B站MC直播间马赛克的脚本
// @author       Qishao
// @match        *://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493362/%E9%9A%90%E8%97%8FB%E7%AB%99MC%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493362/%E9%9A%90%E8%97%8FB%E7%AB%99MC%E7%9B%B4%E6%92%AD%E9%97%B4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==
(function() {
    var count = 0;
    var intervalId = setInterval(() => {
        const element = document.getElementsByClassName("mask")[0];
        if (element && document.contains(element)) {
            setTimeout(() => {
                element.remove();
                console.log('已删除马赛克');
                clearInterval(intervalId);
            }, 1000);
            return;
        }
        if (++count >= 30) {
            clearInterval(intervalId);
        }
    }, 1000);
})();
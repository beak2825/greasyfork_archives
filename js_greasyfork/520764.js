// ==UserScript==
// @name         Kimi自动关闭菜单
// @namespace    http://tampermonkey.net/
// @version      2024-1-22
// @description  用于自动关闭KIMI菜单
// @author       You
// @match        https://kimi.moonshot.cn/*
// @icon         https://statics.moonshot.cn/kimi-chat/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520764/Kimi%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520764/Kimi%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tryCloseMenu() {
        let closebtn = document.querySelector(".sidebar-action");
        if (closebtn) {
            console.log("找到并点击关闭按钮");
            closebtn.click();
            clearInterval(intervalId); // 找到元素后清除定时器
        } else {
            console.log("未找到关闭按钮，继续等待...");
        }
    }

    // 每500毫秒检查一次
    let intervalId = setInterval(tryCloseMenu, 500);

    // 设置一个最大等待时间，例如10秒后停止尝试
    setTimeout(() => {
        clearInterval(intervalId);
        console.log("达到最大等待时间，停止尝试");
    }, 10000);

})();
// ==UserScript==
// @name         Frenpet PC
// @namespace    https://frenpet.xyz
// @version      0.1
// @description  Frenpet 
// @author       https://twitter.com/0x_cola
// @match        https://frenpet.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=frenpet.xyz
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480450/Frenpet%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/480450/Frenpet%20PC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置为iPhone的用户代理
    Object.defineProperty(navigator, 'userAgent', {
        get: function () { return 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'; }
    });

     // 定时任务：每3秒执行一次
    // 定时任务：每3秒执行一次
    var intervalId = setInterval(function() {
        // 检查指定元素是否存在
        var modal = document.querySelector("body > div.MuiModal-root");
        console.log('pending...')
        if (modal) {
            // 如果存在，则删除该元素
            modal.remove();
        } else {
            // 如果不存在，则取消定时任务
            console.log('success')
           clearInterval(intervalId);
        }
    }, 3000); // 3秒

     // 定时任务1：每3秒执行一次，检查是否进入 leaderboard 页面
    var intervalId1 = setInterval(function() {
        if (window.location.href === "https://frenpet.xyz/leaderboard") {
            // 给指定元素添加样式
            var leaderboard = document.querySelector("body > div.flex.flex-col > div:nth-child(1) > div > div > div:nth-child(3)");
            if (leaderboard && leaderboard.scrollHeight <= leaderboard.clientHeight) {
                console.log('设置滚动条')
                var maxHeight = window.innerHeight - leaderboard.getBoundingClientRect().top - 10; // 假设底部距离为20像素
                leaderboard.setAttribute("style", "overflow:auto;max-height:" + maxHeight + "px;");
                // 取消定时任务1
                // clearInterval(intervalId1);
            }
        }
    }, 3000); // 3秒

})();
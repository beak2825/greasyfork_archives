// ==UserScript==
// @name         FSM快进投票
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  FSM快进到下一页投票
// @author       Hema
// @match        https://fsm.name/Votes/details?voteId=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491427/FSM%E5%BF%AB%E8%BF%9B%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/491427/FSM%E5%BF%AB%E8%BF%9B%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保页面完全加载
    window.addEventListener('load', function() {
        // 创建按钮
        var button = document.createElement("button");
        button.innerHTML = "投下一个";
        // 设置按钮样式（可根据需要自行调整）
        button.style.position = "fixed";
        button.style.top = "80%";
        button.style.right = "60%";
        button.style.zIndex = "1000";
        button.style.padding = "10px";
        button.style.fontSize = "16px";
        button.style.backgroundColor = "#FFFF00"; // 增加背景颜色以提高可见性


        // 鼠标悬停时变红
        button.onmouseover = function() {
            this.style.backgroundColor = "#f44336"; // 红色
        };

        // 鼠标移开时恢复原色
        button.onmouseout = function() {
            this.style.backgroundColor = "#FFFF00"; // 原始颜色
        };


        // 添加按钮点击事件
        button.onclick = function() {
            // 获取当前URL的voteId值
            var currentUrl = window.location.href;
            var voteIdMatch = currentUrl.match(/voteId=(\d+)/);
            if (voteIdMatch && voteIdMatch[1]) {
                var currentVoteId = parseInt(voteIdMatch[1], 10);
                // 生成新的voteId
                var newVoteId = currentVoteId + 1;
                // 生成新的URL
                var newUrl = currentUrl.replace(/voteId=\d+/, "voteId=" + newVoteId);
                // 跳转到新的URL
                window.location.href = newUrl;
            }
        };

        // 将按钮添加到页面上
        document.body.appendChild(button);
    });
})();

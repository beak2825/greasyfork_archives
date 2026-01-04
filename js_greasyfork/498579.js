// ==UserScript==
// @name         欢迎用户进入抖音直播间
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动发送欢迎消息给进入直播间的用户
// @author       You
// @match        https://live.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498579/%E6%AC%A2%E8%BF%8E%E7%94%A8%E6%88%B7%E8%BF%9B%E5%85%A5%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/498579/%E6%AC%A2%E8%BF%8E%E7%94%A8%E6%88%B7%E8%BF%9B%E5%85%A5%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本已加载');

    // 替换成你希望发送的欢迎消息
    var welcomeMessage = '欢迎来到我的直播间！感谢支持！';

    // 监听用户进入直播间
    document.addEventListener('DOMNodeInserted', function(event) {
        var target = event.target;
        if (target && target.tagName && target.tagName.toLowerCase() === 'li') {
            // 发送欢迎消息
            sendMessage(target);
        }
    });

    // 发送欢迎消息函数
    function sendMessage(userElement) {
        var userNameElement = userElement.querySelector('.nickname');
        if (userNameElement) {
            var userName = userNameElement.textContent.trim();
            console.log('欢迎消息发送给用户: ' + userName);

            // 模拟发送消息的动作，你可以根据实际情况修改
            // 这里使用了控制台输出来模拟发送消息
            console.log(welcomeMessage);
        }
    }
})();
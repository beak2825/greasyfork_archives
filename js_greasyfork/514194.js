// ==UserScript==
// @name         DeepSeek Chat 快捷停止
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto send message on Enter key press, but not on Shift + Enter
// @author       tianyw0
// @license      MIT
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514194/DeepSeek%20Chat%20%E5%BF%AB%E6%8D%B7%E5%81%9C%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/514194/DeepSeek%20Chat%20%E5%BF%AB%E6%8D%B7%E5%81%9C%E6%AD%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取输入框元素
    const chatInput = document.getElementById('chat-input');

    // 监听输入框的 keydown 事件
    chatInput.addEventListener('keydown', function(event) {
        // 检查是否按下了 Enter 键且没有按下 Shift 键
        if (event.key === 'Enter' && !event.shiftKey) {
            // 检查输入框内容是否为空
            if (chatInput.value.trim() !== '') {
                // 重新获取发送按钮元素
                const sendButtons = Array.from(document.querySelectorAll('div[role="button"]'))
                    .filter(button => button.classList[0] && button.classList[0].startsWith('_'));

                // 如果有符合条件的按钮，模拟点击第一个按钮
                if (sendButtons.length > 0) {
                    sendButtons[0].click();
                }
            }
        }
    });
})();
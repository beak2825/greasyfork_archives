// ==UserScript==
// @name         洛谷聊天Enter发送
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  使用Enter键发送洛谷聊天消息，而不是Ctrl+Enter。
// @author       yan_wang(chatgpt)
// @match        https://www.luogu.com.cn/chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504811/%E6%B4%9B%E8%B0%B7%E8%81%8A%E5%A4%A9Enter%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/504811/%E6%B4%9B%E8%B0%B7%E8%81%8A%E5%A4%A9Enter%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 监听整个页面的keydown事件
        document.addEventListener('keydown', function(event) {
            // 检查是否在聊天输入框中按下了Enter键，并且没有按下Ctrl或Shift键
            if (event.target.tagName.toLowerCase() === 'textarea' && event.key === 'Enter' && !event.ctrlKey && !event.shiftKey) {
                event.preventDefault();  // 阻止默认的Enter行为
                
                // 找到并点击发送按钮
                const sendButton = document.querySelector('button.lfe-form-sz-middle');
                if (sendButton) {
                    sendButton.click();
                }
            }
        });
    }, false);
})();
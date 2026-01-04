// ==UserScript==
// @name         Chatgpt中错误加粗字体的去除(chatgpt编写)
// @namespace    https://example.com/
// @version      1.0
// @description  去除Chat OpenAI中的""字符
// @author       chatgpt
// @match        https://chat.openai.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471583/Chatgpt%E4%B8%AD%E9%94%99%E8%AF%AF%E5%8A%A0%E7%B2%97%E5%AD%97%E4%BD%93%E7%9A%84%E5%8E%BB%E9%99%A4%28chatgpt%E7%BC%96%E5%86%99%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471583/Chatgpt%E4%B8%AD%E9%94%99%E8%AF%AF%E5%8A%A0%E7%B2%97%E5%AD%97%E4%BD%93%E7%9A%84%E5%8E%BB%E9%99%A4%28chatgpt%E7%BC%96%E5%86%99%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeXxxScaeskXxx() {
        const chatMessages = document.querySelectorAll(".message-content");
        chatMessages.forEach(message => {
            message.innerText = message.innerText.replace(/"/g, "");
        });
    }

    // 监听聊天消息的变化，有新消息时触发去除处理
    const chatContainer = document.querySelector(".chat-container");
    const observer = new MutationObserver(removeXxxScaeskXxx);
    const observerConfig = { childList: true, subtree: true };
    observer.observe(chatContainer, observerConfig);

    // 页面加载完成后立即处理一次已有的聊天消息
    window.addEventListener("load", removeXxxScaeskXxx);
})();

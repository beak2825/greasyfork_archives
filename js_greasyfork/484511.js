// ==UserScript==
// @name         OpenAI Token Counter for LibreChat
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically count tokens of chat content on chat.redwind.top
// @author       ChatGPT 4
// @match        *://chat.redwind.top/*
// @grant        none
// @require      https://unpkg.com/gpt-tokenizer/dist/cl100k_base.js
// @downloadURL https://update.greasyfork.org/scripts/484511/OpenAI%20Token%20Counter%20for%20LibreChat.user.js
// @updateURL https://update.greasyfork.org/scripts/484511/OpenAI%20Token%20Counter%20for%20LibreChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建持续显示的弹窗
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.right = '20px';
    popup.style.bottom = '80px';
    popup.style.backgroundColor = '#333';
    popup.style.color = '#fff';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1001';
    document.body.appendChild(popup);

    // 更新弹窗中的token计数
    function updateTokenCount() {
        // 选择 .whitespace-pre-wrap 类的元素
        const preWrapElements = document.querySelectorAll('.whitespace-pre-wrap');
        // 选择所有 <code> 标签的元素
        const codeElements = document.querySelectorAll('code');
        let totalTokens = 0;

        // 计算 .whitespace-pre-wrap 类的元素的 token 数量
        preWrapElements.forEach(element => {
            const text = element.textContent;
            const tokens = GPTTokenizer_cl100k_base.encode(text);
            totalTokens += tokens.length;
        });

        // 计算所有 <code> 标签的元素的 token 数量
        codeElements.forEach(element => {
            const text = element.textContent;
            const tokens = GPTTokenizer_cl100k_base.encode(text);
            totalTokens += tokens.length;
        });

        // 更新弹窗中的 token 计数
        popup.textContent = `Total Tokens: ${totalTokens}`;
    }

    // 创建一个MutationObserver来观察DOM的变化
    function observeDOMChanges() {
        const observer = new MutationObserver(updateTokenCount);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 主逻辑
    updateTokenCount();
    observeDOMChanges();

})();
// ==UserScript==
// @name         OpenAI Token Counter for Selected Text
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically count tokens of selected text
// @author       ChatGPT 4
// @match        *://*/*
// @grant        none
// @require      https://unpkg.com/gpt-tokenizer/dist/cl100k_base.js
// @downloadURL https://update.greasyfork.org/scripts/484043/OpenAI%20Token%20Counter%20for%20Selected%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/484043/OpenAI%20Token%20Counter%20for%20Selected%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建弹窗
    const popup = document.createElement('div');
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.right = '20px';
    popup.style.bottom = '300px';
    popup.style.backgroundColor = '#333';
    popup.style.color = '#fff';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.zIndex = '1001';
    document.body.appendChild(popup);

    // 显示token计数结果的函数
    function showTokenCount(tokens) {
        popup.textContent = `Token count: ${tokens.length}`;
        popup.style.display = 'block';
    }

    // 计算并显示选中文本的token数量
    function countAndShowTokens() {
        const text = window.getSelection().toString();
        if (text) {
            const tokens = GPTTokenizer_cl100k_base.encode(text);
            showTokenCount(tokens);
            checkSelection(); // 检查文本是否仍被选中
        } else {
            popup.style.display = 'none'; // 如果没有选中文本，则不显示弹窗
        }
    }

    // 检查是否还有文本被选中
    function checkSelection() {
        const checkInterval = 500; // 每500ms检查一次
        const interval = setInterval(() => {
            const currentSelection = window.getSelection().toString();
            if (!currentSelection) {
                popup.style.display = 'none';
                clearInterval(interval); // 停止检查
            }
        }, checkInterval);
    }

    // 为文档添加事件监听器以检测文本选择
    document.addEventListener('selectionchange', function() {
        countAndShowTokens(); // 当文本被选中时调用该函数
    });
})();

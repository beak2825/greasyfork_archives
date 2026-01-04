// ==UserScript==
// @name         DeepSeek Chat Ctrl+Enter to Send
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ctrl+Enter 或 Cmd+Enter 发送消息，Enter 仅换行（适用于 chat.deepseek.com）
// @author       ChatGPT
// @match        https://chat.deepseek.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531902/DeepSeek%20Chat%20Ctrl%2BEnter%20to%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/531902/DeepSeek%20Chat%20Ctrl%2BEnter%20to%20Send.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (e) {
        const activeElement = document.activeElement;

        if (activeElement && activeElement.tagName === 'TEXTAREA') {
            if (e.key === 'Enter') {
                if (e.ctrlKey || e.metaKey) {
                    // Ctrl+Enter 或 Cmd+Enter → 发送
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const sendBtn = document.querySelector('div[role="button"][aria-disabled="false"]');
                    if (sendBtn) {
                        sendBtn.click();
                    } else {
                        console.warn('[Tampermonkey] ❌ 未找到发送按钮');
                    }
                } else {
                    // 仅 Enter → 插入换行（阻止默认发送）
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const textarea = activeElement;
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const value = textarea.value;

                    // 插入换行符
                    textarea.value = value.slice(0, start) + '\n' + value.slice(end);
                    textarea.selectionStart = textarea.selectionEnd = start + 1;

                    // 触发 input 事件更新状态
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }
    }, true);
})();

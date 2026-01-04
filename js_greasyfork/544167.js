// ==UserScript==
// @name         给Kimi添加查询参数 (纯键盘事件精简版)
// @namespace    KimiSearchQ
// @version      2025.07.31.6
// @description  直接使用完整键盘事件链发送消息
// @author       anny
// @match        https://www.kimi.com/*
// @match        https://kimi.moonshot.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kimi.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544167/%E7%BB%99Kimi%E6%B7%BB%E5%8A%A0%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0%20%28%E7%BA%AF%E9%94%AE%E7%9B%98%E4%BA%8B%E4%BB%B6%E7%B2%BE%E7%AE%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544167/%E7%BB%99Kimi%E6%B7%BB%E5%8A%A0%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0%20%28%E7%BA%AF%E9%94%AE%E7%9B%98%E4%BA%8B%E4%BB%B6%E7%B2%BE%E7%AE%80%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (msg, ...args) => console.log(`[Kimi Fix] ${msg}`, ...args);
    const error = (msg, ...args) => console.error(`[Kimi ERROR] ${msg}`, ...args);

    function getQueryParam() {
        return new URLSearchParams(window.location.search).get('q');
    }

    function waitForElement(selector, timeout = 15000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const check = () => {
                const elem = document.querySelector(selector);
                if (elem) {
                    log(`元素已找到 (${Date.now()-startTime}ms): ${selector}`);
                    return resolve(elem);
                }
                if (Date.now() - startTime < timeout) {
                    setTimeout(check, 100);
                } else {
                    reject(new Error(`元素未找到: ${selector}`));
                }
            };
            check();
        });
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    async function autoFillQuery() {
        const query = getQueryParam();
        if (!query) {
            log("未检测到查询参数 q");
            return;
        }

        try {
            log(`开始处理查询: "${query}"`);

            // 1. 获取Lexical编辑器
            const editorSelector = '.chat-input-editor[contenteditable="true"][data-lexical-editor]';
            const editor = await waitForElement(editorSelector);

            // 2. 确保焦点
            editor.focus();
            await delay(200);

            // 3. 清空内容
            editor.textContent = '';
            editor.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                inputType: 'deleteContentBackward'
            }));
            await delay(100);

            // 4. 设置新内容
            editor.innerHTML = `<p dir="ltr"><span data-lexical-text="true">${query}</span></p>`;

            // 5. 触发Lexical更新事件链
            editor.dispatchEvent(new InputEvent('input', {
                bubbles: true,
                inputType: 'insertText',
                data: query
            }));

            editor.dispatchEvent(new Event('compositionend', {
                bubbles: true,
                composed: true
            }));

            // 6. 等待Lexical完成内部状态更新
            log("等待Lexical编辑器更新 (1000ms)...");
            await delay(1000);

            // 7. 验证内容
            const currentContent = editor.textContent.trim();
            if (currentContent !== query.trim()) {
                error(`内容验证失败! 期望: "${query}", 实际: "${currentContent}"`);
                return;
            }
            log(`内容验证成功: "${currentContent}"`);

            // 8. 直接使用完整键盘事件链发送
            log("尝试使用完整键盘事件链发送消息");

            // 派发完整的键盘事件序列
            const keyEvents = ['keydown', 'keypress', 'keyup'];
            keyEvents.forEach(type => {
                editor.dispatchEvent(new KeyboardEvent(type, {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                    shiftKey: false,
                    ctrlKey: false,
                    altKey: false,
                    metaKey: false,
                    isComposing: false,
                    location: 0,
                    repeat: false
                }));
            });

            log("✅ 已尝试完整键盘事件链发送");
            log("消息应已成功发送!");

        } catch (err) {
            error("自动发送失败:", err);
        }
    }

    // 执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoFillQuery);
    } else {
        autoFillQuery();
    }

})();
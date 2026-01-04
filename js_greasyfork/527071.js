// ==UserScript==
// @name         DeepSeek 网页版 URL 增加 query 搜索
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  为 DeepSeek 网页版增加 query string 的搜索功能，q 是 keyword , r=true 是否开启深度思考
// @author       阿依帝 with DeepSeek R1 (https://space.bilibili.com/103021226)
// @match        https://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527071/DeepSeek%20%E7%BD%91%E9%A1%B5%E7%89%88%20URL%20%E5%A2%9E%E5%8A%A0%20query%20%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527071/DeepSeek%20%E7%BD%91%E9%A1%B5%E7%89%88%20URL%20%E5%A2%9E%E5%8A%A0%20query%20%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析URL参数
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    // 查找包含指定文本的按钮
    function findButtonByText(text) {
        const xpath = `//div[@role='button']//span[contains(text(), '${text}')]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue?.closest('div[role="button"]');
    }

    // 检查按钮是否激活
    function isButtonActive(button) {
        return getComputedStyle(button).getPropertyValue('--ds-button-color').includes('77, 107, 254');
    }

    // 触发React的输入事件
    function setReactInputValue(element, value) {
        const inputEvent = new Event('input', { bubbles: true, composed: true });
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(element, value);
        element.dispatchEvent(inputEvent);
    }

    // 处理模式切换
    async function toggleMode(button, shouldEnable) {
        if (!button) return;
        const isActive = isButtonActive(button);
        if (shouldEnable && !isActive) {
            button.click();
            await new Promise(r => setTimeout(r, 200));
        }
        if (!shouldEnable && isActive) {
            button.click();
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 主处理函数
    async function processQueryParams() {
        // 获取参数（已修复括号问题）
        const qParam = getQueryParam('q');
        const query = qParam ? decodeURIComponent(qParam) : '';
        const needDeepThinking = getQueryParam('r') === 'true';

        if (!query) return;

        // 等待必要元素加载
        const maxWaitTime = 5000;
        const startTime = Date.now();

        // 等待输入框加载
        let textarea;
        while (!(textarea = document.getElementById('chat-input')) && Date.now() - startTime < maxWaitTime) {
            await new Promise(r => setTimeout(r, 100));
        }

        if (!textarea) {
            console.error('找不到输入框');
            return;
        }

        // 填充查询内容
        setReactInputValue(textarea, query);

        // 强制开启联网搜索
        const webSearchBtn = findButtonByText('联网搜索');
        await toggleMode(webSearchBtn, true);

        // 处理深度思考模式
        const deepThinkBtn = findButtonByText('深度思考');
        await toggleMode(deepThinkBtn, needDeepThinking);

        // 点击发送按钮
        const sendBtn = document.querySelector('div[role="button"][aria-disabled="false"]');
        if (sendBtn) {
            sendBtn.click();
        } else {
            const observer = new MutationObserver(() => {
                const activeSendBtn = document.querySelector('div[role="button"][aria-disabled="false"]');
                if (activeSendBtn) {
                    observer.disconnect();
                    activeSendBtn.click();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        setTimeout(processQueryParams, 1000);
    });
})();
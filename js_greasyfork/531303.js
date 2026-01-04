// ==UserScript==
// @name         LLM Search
// @namespace    http://tampermonkey.net/
// @version      1.4.3
// @description  为 LLM 网页版增加 query string 的搜索功能，q 是 keyword , r=true 是否开启深度思考, o=true 是否开启联网搜索
// @author       Ckopoer
// @license      MIT
// @match        *://gemini.google.com/*
// @match        *://chat.qwen.ai/*
// @match        *://chat.deepseek.com/*
// @match        *://www.tongyi.com/*
// @match        *://idealab.alibaba-inc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531303/LLM%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/531303/LLM%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析URL参数
    function getQueryParam(name) {
        const params = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash);
        return params.get(name) || hashParams.get(name);
    }

    // 查找包含指定文本的按钮
    function findButtonByText(text) {
        const xpath = `//div[@role='button']//span[contains(text(), '${text}')]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue?.closest('div[role="button"]');
    }

    // 触发默认的输入事件
    function setInputValue(element, value) {
        const inputEvent = new Event('input', { bubbles: true});
        element.value = value;
        element.dispatchEvent(inputEvent);
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
    async function toggleMode(button, shouldClick) {
        if (button && shouldClick) {
            button.click();
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 通用的填充和提交函数
    async function fillAndSubmit(queryParam, inputSelectors, buttonSelectors, siteName) {

    }

    // Gemini特定处理函数
    async function handleGemini(query, needDeepThinking, onlineMode) {

        // 等待必要元素加载
        const maxWaitTime = 5000;
        const startTime = Date.now();

        // 等待输入框加载
        let textarea;
        while (!(textarea = document.querySelector("rich-textarea > * > p")) && Date.now() - startTime < maxWaitTime) {
            await new Promise(r => setTimeout(r, 100));
        }

        if (!textarea) {
            console.error('找不到输入框');
            return;
        }

        // 填充查询内容
        textarea.textContent = query;

        // // 强制开启联网搜索
        // const webSearchBtn = findButtonByText('搜索');
        // const isOnlineActive = getComputedStyle(webSearchBtn).getPropertyValue('--ds-button-color').includes('#DBEAFE');
        // await toggleMode(webSearchBtn, isActive ^ onlineMode);

        // // 处理深度思考模式
        // const deepThinkBtn = findButtonByText('深度思考');
        // const isDeepThinkActive = getComputedStyle(deepThinkBtn).getPropertyValue('--ds-button-color').includes('#DBEAFE');
        // await toggleMode(deepThinkBtn, isDeepThinkActive ^ needDeepThinking);

        // 点击发送按钮
        setTimeout(function() {
            const sendBtn = document.querySelector('button[class*="send-button"]');
            if (sendBtn) {
                sendBtn.click();
            } else {
                const observer = new MutationObserver(() => {
                    const activeSendBtn = document.querySelector('button[class*="send-button"]');
                    if (activeSendBtn) {
                        observer.disconnect();
                        activeSendBtn.click();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }, 50);
    }

    // Qwen特定处理函数
    async function handleQwen(query, needDeepThinking, onlineMode) {
        // 等待必要元素加载
        const maxWaitTime = 5000;
        const startTime = Date.now();

        // 等待输入框加载
        let textarea;
        while (!(textarea = document.querySelector('textarea[id="chat-input"]')) && Date.now() - startTime < maxWaitTime) {
            await new Promise(r => setTimeout(r, 100));
        }

        if (!textarea) {
            console.error('找不到输入框');
            return;
        }

        setTimeout(function() {
            setReactInputValue(textarea, query);
        }, 2000);

        // 强制开启联网搜索
        const webSearchBtnxpath = "//button[span[contains(text(), '搜索')]]";
        const webSearchBtn = document.evaluate(webSearchBtnxpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const isOnlineActive = webSearchBtn.classList.contains('bg-[#E0DFFF]');
        await toggleMode(webSearchBtn, isOnlineActive ^ onlineMode);

        // 处理深度思考模式
        const deepThinkBtnxpath = "//button[span[contains(text(), '思考')]]";
        const deepThinkBtn = document.evaluate(deepThinkBtnxpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const isDeepThinkActive = deepThinkBtn.classList.contains('bg-[#E0DFFF]');
        await toggleMode(deepThinkBtn, isDeepThinkActive ^ needDeepThinking);


        // 点击发送按钮
        const sendBtn = document.querySelector('button[id="send-message-button"]');
        if (sendBtn) {
            sendBtn.click();
        } else {
            const observer = new MutationObserver(() => {
                const activeSendBtn = document.querySelector('button[id="send-message-button"]');
                if (activeSendBtn) {
                    observer.disconnect();
                    activeSendBtn.click();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 通义特定处理函数
    async function handleTongyi(query, needDeepThinking, onlineMode) {
        // 等待必要元素加载
        const maxWaitTime = 5000;
        const startTime = Date.now();

        // 等待输入框加载
        let textarea;
        while (!(textarea = document.querySelector('textarea')) && Date.now() - startTime < maxWaitTime) {
            await new Promise(r => setTimeout(r, 100));
        }

        if (!textarea) {
            console.error('找不到输入框');
            return;
        }

        setTimeout(function() {
            setReactInputValue(textarea, query);
        }, 500);

        // // 强制开启联网搜索
        const webSearchBtnxpath = "//div[text()='联网搜索']";
        const webSearchBtn = document.evaluate(webSearchBtnxpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const isOnlineActive = webSearchBtn.classList.contains('bg-[#E0DFFF]');
        await toggleMode(webSearchBtn, isOnlineActive ^ onlineMode);

        // 处理深度思考模式
        // const deepThinkBtnxpath = "//div[text()='深度思考']";
        // const deepThinkBtn = document.evaluate(deepThinkBtnxpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // const isDeepThinkActive = false;
        // await toggleMode(deepThinkBtn, isDeepThinkActive ^ needDeepThinking);


        // 点击发送按钮
        const sendBtn = document.querySelector('div[class^="operateBtn"]');
        if (sendBtn) {
            sendBtn.click();
        } else {
            const observer = new MutationObserver(() => {
                const activeSendBtn = document.querySelector('div[class^="operateBtn"]');
                if (activeSendBtn) {
                    observer.disconnect();
                    activeSendBtn.click();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // DeepSeek特定处理函数
    async function handleDeepseek(query, needDeepThinking, onlineMode) {
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
        const webSearchBtn = findButtonByText('搜索');
        const isOnlineActive = getComputedStyle(webSearchBtn).getPropertyValue('--ds-button-color').includes('#DBEAFE');
        await toggleMode(webSearchBtn, isOnlineActive ^ onlineMode);

        // 处理深度思考模式
        const deepThinkBtn = findButtonByText('思考');
        const isDeepThinkActive = getComputedStyle(deepThinkBtn).getPropertyValue('--ds-button-color').includes('#DBEAFE');
        await toggleMode(deepThinkBtn, isDeepThinkActive ^ needDeepThinking);

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

    // Idealab特定处理函数
    async function handleIdealab(query, needDeepThinking, onlineMode) {

        // 等待必要元素加载
        const maxWaitTime = 5000;
        const startTime = Date.now();

        // 等待输入框加载
        let textarea;
        while (!(textarea = document.querySelector('textarea')) && Date.now() - startTime < maxWaitTime) {
            await new Promise(r => setTimeout(r, 100));
        }

        if (!textarea) {
            console.error('找不到输入框');
            return;
        }

        // 填充查询内容
        setReactInputValue(textarea, query);
        // textarea.textContent = query;

        // // 强制开启联网搜索
        // const webSearchBtn = findButtonByText('搜索');
        // const isOnlineActive = getComputedStyle(webSearchBtn).getPropertyValue('--ds-button-color').includes('#DBEAFE');
        // await toggleMode(webSearchBtn, isActive ^ onlineMode);

        // // 处理深度思考模式
        // const deepThinkBtn = findButtonByText('深度思考');
        // const isDeepThinkActive = getComputedStyle(deepThinkBtn).getPropertyValue('--ds-button-color').includes('#DBEAFE');
        // await toggleMode(deepThinkBtn, isDeepThinkActive ^ needDeepThinking);

        // 点击发送按钮
        setTimeout(function() {
            const sendBtn = document.querySelector('img[class*="input-run-image"]');
            if (sendBtn) {
                sendBtn.click();
            } else {
                const observer = new MutationObserver(() => {
                    const activeSendBtn = document.querySelector('img[class*="input-run-image"]');
                    if (activeSendBtn) {
                        observer.disconnect();
                        activeSendBtn.click();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }, 50);
    }

    // 默认处理函数
    function handleDefault(query, needDeepThinking, onlineMode) {
        console.warn('未找到匹配的处理函数，当前域名:', window.location.hostname);
        console.log('查询内容:', query);
        console.log('深度思考模式:', needDeepThinking);
        console.log('联网搜索模式:', onlineMode);
    }



    // 域名与处理函数的映射
    const domainHandlers = {
        'gemini.google.com': handleGemini,
        'chat.qwen.ai': handleQwen,
        'chat.deepseek.com': handleDeepseek,
        'www.tongyi.com': handleTongyi,
        'idealab.alibaba-inc.com': handleIdealab,
    };

    // 主函数
    async function main() {
        // 获取参数（已修复括号问题）
        const qParam = getQueryParam('q');
        const query = qParam ? decodeURIComponent(qParam) : '';
        const needDeepThinking = getQueryParam('r') === 'true';
        const onlineMode = getQueryParam('o') === 'true';

        if (!query) return;

        const url = new URL(window.location.href);
        // 获取当前域名
        const domain = url.hostname;
        console.log('当前处理域名: ', domain)

        // 选择并执行对应的处理函数
        const handler = domainHandlers[domain] || handleDefault;
        handler(query, needDeepThinking, onlineMode);
    }

    // 页面加载完成后执行
    window.addEventListener('load', () => {
        setTimeout(main, 500);
    });
})();
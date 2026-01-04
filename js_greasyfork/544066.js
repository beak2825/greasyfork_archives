// ==UserScript==
// @name         Gemini - Middle-click to open in new tab (Multi-language)
// @name:zh-CN   Gemini - 中键点击在新标签页打开 (多语言支持)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Allows middle-clicking on conversation history, "New Chat", and "Explore Gems" in Gemini to open them in a new background tab. Works across different UI languages.
// @description:zh-CN  允许在 Gemini 的对话历史、"发起新对话"和"探索 Gem"上使用鼠标中键点击，从而在新的后台标签页中打开它们。此版本支持不同的界面语言。
// @author       Gemini & contributors
// @match        https://gemini.google.com/app*
// @match        https://gemini.google.com/gems*
// @match        https://gemini.google.com/gem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544066/Gemini%20-%20Middle-click%20to%20open%20in%20new%20tab%20%28Multi-language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544066/Gemini%20-%20Middle-click%20to%20open%20in%20new%20tab%20%28Multi-language%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预先移除所有"发起新对话"按钮的disabled状态
    function enableNewChatButtons() {
        const newChatButtons = document.querySelectorAll('button:has(mat-icon[fonticon="edit_square"])');
        newChatButtons.forEach(button => {
            if (button.disabled || button.hasAttribute('disabled')) {
                button.disabled = false;
                button.removeAttribute('disabled');
                console.log('已启用"发起新对话"按钮:', button);
            }
        });
    }

    // 等待页面完全加载完毕后执行
    window.addEventListener('load', function() {
        // 给Gemini的JS一点时间完成初始化，然后再修改按钮状态
        setTimeout(enableNewChatButtons, 1000);
    });

    // 监听DOM变化，处理动态加载的按钮
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                enableNewChatButtons();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousedown', function(event) {
        // event.button === 1 代表鼠标中键点击
        if (event.button !== 1) {
            return;
        }

        // 【重大更新】使用不依赖于语言的图标选择器
        // :has() 选择器可以找到包含特定子元素的父元素，非常适合此场景
        const newChatButton = event.target.closest('button:has(mat-icon[fonticon="edit_square"])');
        const exploreGemsButton = event.target.closest('button:has(mat-icon[fonticon="gem_spark"])');
        const conversationElement = event.target.closest('[data-test-id="conversation"]');
        // 处理单个Gem页面的按钮（情况3）
        const gemChatButton = event.target.closest('button.bot-new-conversation-button');
        

        let url = null;
        let logMessage = '';

        // 处理"发起新对话"按钮
        if (newChatButton) {
            url = 'https://gemini.google.com/app';
            logMessage = 'Opening New Chat in new background tab:';
        }
        // 处理"探索 Gem"按钮
        else if (exploreGemsButton) {
            url = 'https://gemini.google.com/gems/view';
            logMessage = 'Opening Explore Gems in new background tab:';
        }
        // 处理Gem聊天按钮（情况3和情况4）
        else if (gemChatButton) {
            let gemId = null;
            
            // 方法1：从当前URL提取gem ID（适用于 /gem/xxx 页面）
            const currentUrl = window.location.href;
            const gemMatch = currentUrl.match(/\/gem\/([a-f0-9]{12})/);
            if (gemMatch && gemMatch[1]) {
                gemId = gemMatch[1];
            } else {
                // 方法2：从DOM元素的jslog属性中提取gem ID（适用于 /app 页面等）
                // 先查找包含BardVeMetadataKey的父元素
                let botItem = gemChatButton.closest('[jslog*="BardVeMetadataKey"]');
                
                // 如果没找到，查找任何包含jslog的父元素
                if (!botItem) {
                    botItem = gemChatButton.closest('[jslog]');
                }
                
                // 从按钮本身的jslog中查找
                if (!botItem && gemChatButton.hasAttribute('jslog')) {
                    botItem = gemChatButton;
                }
                
                if (botItem) {
                    const jslog = botItem.getAttribute('jslog');
                    // 尝试多种格式提取gem ID
                    const match = jslog.match(/&quot;([a-f0-9]{12})&quot;/) || 
                                 jslog.match(/"([a-f0-9]{12})"/) ||
                                 jslog.match(/([a-f0-9]{12})/);
                    if (match && match[1]) {
                        gemId = match[1];
                    }
                }
            }
            
            if (gemId) {
                url = `https://gemini.google.com/gem/${gemId}`;
                logMessage = 'Opening Gem conversation in new background tab:';
            }
        }
        // 处理对话历史记录
        else if (conversationElement) {
            const jslog = conversationElement.getAttribute('jslog');
            if (jslog) {
                // 正则表达式匹配16位以上的十六进制字符作为ID
                const match = jslog.match(/([a-f0-9]{16,})/);
                if (match && match[1]) {
                    const conversationId = match[1];
                    url = `https://gemini.google.com/app/${conversationId}`;
                    logMessage = 'Opening Gemini conversation in new background tab:';
                }
            }
        }

        // 如果成功获取了URL，则阻止默认行为并在后台新标签页中打开
        if (url) {
            event.preventDefault();
            event.stopPropagation();
            console.log(logMessage, url);
            // 将 active 设置为 false，实现在后台打开新标签页
            GM_openInTab(url, { active: false });
        }

    }, { capture: true, passive: false }); // 使用捕获阶段，禁用passive模式以允许preventDefault

})();

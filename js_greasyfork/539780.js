// ==UserScript==
// @name         Discord Auto Translator (Ctrl+Enter)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  Discord 自动翻译脚本 - Ctrl+Enter 翻译成英文后发送
// @author       You
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      openrouter.ai
// @downloadURL https://update.greasyfork.org/scripts/539780/Discord%20Auto%20Translator%20%28Ctrl%2BEnter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539780/Discord%20Auto%20Translator%20%28Ctrl%2BEnter%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Discord Translator] 脚本已加载');

    // ========== 配置部分 ==========
    // 翻译提示词 - 可以根据需要修改
    const TRANSLATION_PROMPT = `You are a professional translator. Translate the following text to English.
Keep the original format, including markdown syntax, mentions (@username), and special Discord formatting.
Only return the translated text without any explanation or additional content.
If the text is already in English, return it as is.`;

    // OpenRouter 配置
    const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
    const MODEL = 'google/gemini-2.5-flash-preview-05-20';

    // ========== API Key 管理 ==========
    let apiKey = GM_getValue('openrouter_api_key', '');

    if (!apiKey) {
        apiKey = prompt('[Discord Translator] 请输入您的 OpenRouter API Key:');
        if (apiKey) {
            GM_setValue('openrouter_api_key', apiKey);
            console.log('[Discord Translator] API Key 已保存');
        } else {
            console.error('[Discord Translator] 未提供 API Key，脚本将无法工作');
            alert('未提供 API Key，翻译功能将无法使用！');
        }
    }

    // ========== 状态管理 ==========
    let isTranslating = false;
    let translatedContent = null;
    let shouldTranslate = false;
    let isProgrammaticEnter = false; // 新增：标记是否是程序触发的 Enter

    // ========== 工具函数 ==========

    function parseSlateNode(node) {
        // 1. 如果是文本节点，直接返回其内容
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        // 2. 如果不是元素节点，则忽略
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }

        const element = node;

        // 3. 明确忽略 Slate.js 内部使用的 "噪音" 节点
        if (element.hasAttribute('data-slate-zero-width') || element.hasAttribute('data-slate-spacer')) {
            return '';
        }

        // 4. 特殊处理表情符号 (标准和自定义)
        if (element.tagName === 'IMG' && element.classList.contains('emoji') && element.alt) {
            // alt 属性包含了我们需要的文本代码，例如 ":rage:" 或 ":Sydney:"
            return element.alt;
        }

        // 5. 特殊处理剧透 (Spoiler)
        // Discord 使用一个带有 'spoilerText' 类名的 span 来包裹剧透内容
        if (element.matches('[class*="spoilerText"]')) {
            let spoilerContent = '';
            for (const child of element.childNodes) {
                spoilerContent += parseSlateNode(child);
            }
            return `||${spoilerContent}||`;
        }

        // 6. 默认行为：递归处理所有子节点
        // 这会正确处理普通文本、加粗、斜体、以及提及(@user)等容器元素
        let content = '';
        for (const child of element.childNodes) {
            content += parseSlateNode(child);
        }
        return content;
    }

    function extractTextFromDiscordInput() {
        console.log('[Discord Translator] 开始提取输入框内容 (Slate.js 精确版)...');

        // 定位到 Discord 的 Slate 编辑器
        const editor = document.querySelector('.textArea__74017.textAreaSlate__74017 [role="textbox"][data-slate-editor="true"]');
        if (!editor) {
            console.error('[Discord Translator] 找不到 Slate 编辑器');
            return '';
        }

        let result = '';
        // 编辑器中的每一行都是一个直接子元素
        const lines = Array.from(editor.children);

        lines.forEach((lineElement, index) => {
            // 对每一行应用我们精确的解析函数
            result += parseSlateNode(lineElement);

            // 在行与行之间添加换行符，但最后一行后面不加
            if (index < lines.length - 1) {
                result += '\n';
            }
        });

        console.log('[Discord Translator] 提取的内容:', result);
        return result;
    }

    // 调用 OpenRouter API 进行翻译
    async function translateText(text) {
        console.log('[Discord Translator] 开始翻译文本:', text);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST', url: OPENROUTER_BASE_URL, headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://discord.com',
                    'X-Title': 'Discord Auto Translator'
                }, data: JSON.stringify({
                    model: MODEL, messages: [{
                        role: 'system', content: TRANSLATION_PROMPT
                    }, {
                        role: 'user', content: text
                    }], temperature: 0.3, max_tokens: 4096
                }), onload: function (response) {
                    console.log('[Discord Translator] API 响应状态:', response.status);
                    console.log('[Discord Translator] API 响应内容:', response.responseText);

                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const translatedText = data.choices[0].message.content;
                            console.log('[Discord Translator] 翻译结果:', translatedText);
                            resolve(translatedText);
                        } catch (error) {
                            console.error('[Discord Translator] 解析响应失败:', error);
                            reject(error);
                        }
                    } else {
                        console.error('[Discord Translator] API 请求失败:', response.status, response.responseText);
                        reject(new Error(`API request failed: ${response.status}`));
                    }
                }, onerror: function (error) {
                    console.error('[Discord Translator] 网络请求失败:', error);
                    reject(error);
                }
            });
        });
    }

    // ========== 请求拦截 ==========

    // 保存原始的 XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    const originalOpen = originalXHR.prototype.open;
    const originalSend = originalXHR.prototype.send;

    // 拦截 open 方法
    originalXHR.prototype.open = function (method, url, ...args) {
        this._method = method;
        this._url = url;
        console.log('[Discord Translator] XHR Open:', method, url);
        return originalOpen.apply(this, [method, url, ...args]);
    };

    // 拦截 send 方法
    originalXHR.prototype.send = function (data) {
        console.log('[Discord Translator] XHR Send 被调用, URL:', this._url);

        // 检查是否是发送消息的请求
        if (this._method === 'POST' && this._url && this._url.includes('/api/v9/channels/') && this._url.includes('/messages')) {
            console.log('[Discord Translator] 检测到发送消息请求');
            console.log('[Discord Translator] 原始请求数据:', data);
            console.log('[Discord Translator] shouldTranslate:', shouldTranslate);
            console.log('[Discord Translator] translatedContent:', translatedContent);

            if (shouldTranslate && translatedContent) {
                try {
                    // 解析原始请求数据
                    const requestData = JSON.parse(data);
                    console.log('[Discord Translator] 解析的请求数据:', requestData);

                    // 替换内容为翻译后的内容
                    requestData.content = translatedContent;
                    data = JSON.stringify(requestData);

                    console.log('[Discord Translator] 修改后的请求数据:', data);
                    console.log('[Discord Translator] 成功替换为翻译内容！');

                    // 重置状态 - 在成功发送后才重置
                    shouldTranslate = false;
                    translatedContent = null;
                } catch (error) {
                    console.error('[Discord Translator] 修改请求数据失败:', error);
                }
            }
        }

        return originalSend.apply(this, [data]);
    };

    // ========== 键盘事件处理 ==========

    document.addEventListener('keydown', async function (event) {
        // 检查是否在输入框中
        const target = event.target;
        const isInTextbox = target && target.getAttribute('role') === 'textbox' && target.classList.contains('editor__1b31f');

        if (!isInTextbox) {
            return;
        }

        console.log('[Discord Translator] 键盘事件:', event.key, 'Ctrl:', event.ctrlKey, 'isProgrammatic:', isProgrammaticEnter);

        // Enter 键被按下
        if (event.key === 'Enter') {
            if (event.ctrlKey) {
                // Ctrl+Enter: 翻译后发送
                console.log('[Discord Translator] 检测到 Ctrl+Enter');

                if (!apiKey) {
                    alert('请先设置 API Key！');
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }

                if (isTranslating) {
                    console.log('[Discord Translator] 正在翻译中，请稍候...');
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }

                // 提取输入框内容
                const content = extractTextFromDiscordInput();
                if (!content.trim()) {
                    console.log('[Discord Translator] 输入框为空，不进行翻译');
                    return;
                }

                // 阻止默认发送
                event.preventDefault();
                event.stopPropagation();

                // 开始翻译
                isTranslating = true;
                shouldTranslate = true;

                try {
                    console.log('[Discord Translator] 开始翻译过程...');
                    translatedContent = await translateText(content);
                    console.log('[Discord Translator] 翻译完成，准备发送');

                    // 标记下一个 Enter 是程序触发的
                    isProgrammaticEnter = true;

                    // 模拟正常的 Enter 按键来触发发送
                    setTimeout(() => {
                        const newEvent = new KeyboardEvent('keydown', {
                            key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true
                        });
                        target.dispatchEvent(newEvent);

                        // 重置标记
                        setTimeout(() => {
                            isProgrammaticEnter = false;
                        }, 100);
                    }, 100);

                } catch (error) {
                    console.error('[Discord Translator] 翻译失败:', error);
                    alert('翻译失败: ' + error.message);
                    shouldTranslate = false;
                    translatedContent = null;
                } finally {
                    isTranslating = false;
                }

            } else {
                // 仅 Enter: 检查是否是程序触发的
                if (isProgrammaticEnter) {
                    console.log('[Discord Translator] 检测到程序触发的 Enter，保持翻译状态');
                    // 不要重置状态
                } else {
                    console.log('[Discord Translator] 检测到用户按下 Enter（无 Ctrl），正常发送');
                    shouldTranslate = false;
                    translatedContent = null;
                }
            }
        }
    }, true); // 使用捕获阶段

    // ========== 清理 API Key 功能 ==========
    window.clearTranslatorAPIKey = function () {
        GM_setValue('openrouter_api_key', '');
        console.log('[Discord Translator] API Key 已清除');
        alert('API Key 已清除，刷新页面后需要重新输入');
    };

    console.log('[Discord Translator] 脚本初始化完成');
    console.log('[Discord Translator] 提示：在控制台输入 clearTranslatorAPIKey() 可以清除保存的 API Key');
})();

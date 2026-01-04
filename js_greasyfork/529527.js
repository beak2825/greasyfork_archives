// ==UserScript==
// @name         网页内容摘要
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用OpenAI或Google Gemini API快速总结网页内容
// @author       Your Name
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @exclude      *://www.perplexity.ai/*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/marked@4.0.18/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/529527/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%91%98%E8%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/529527/%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%91%98%E8%A6%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否在iframe中
    if (window.self !== window.top) {
        // 在iframe中，不执行脚本
        return;
    }

    // 常量定义
    const DEFAULT_OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    const DEFAULT_GEMINI_URL = "https://generativelanguage.googleapis.com";
    const DEFAULT_HOTKEY = "s";
    const HOTKEY_MODIFIER = "alt";
    const DEFAULT_WIDTH = 500; // 默认宽度
    const DEFAULT_HEIGHT = 600; // 默认高度
    const MIN_WIDTH = 300; // 最小宽度
    const MIN_HEIGHT = 200; // 最小高度
    const MOBILE_BREAKPOINT = 768; // 移动设备断点

    // 检测是否为移动设备
    function isMobileDevice() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // 默认配置
    const DEFAULT_CONFIGS = {
        apis: [
            {
                id: "openai-default",
                name: "OpenAI默认",
                type: "openai",
                baseUrl: DEFAULT_OPENAI_URL,
                apiKey: "",
                models: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo"]
            },
            {
                id: "gemini-default",
                name: "Gemini默认",
                type: "gemini",
                baseUrl: DEFAULT_GEMINI_URL,
                apiKey: "",
                models: ["gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash"]
            }
        ],
        prompts: [
            {
                id: "summary-default",
                name: "一般摘要",
                content: "请用中文总结以下网页内容的要点，用简洁的语言描述主要信息。请使用Markdown格式输出，以提高可读性。",
                apiType: "openai",
                apiId: "openai-default",
                model: "gpt-3.5-turbo"
            },
            {
                id: "detailed-summary",
                name: "详细摘要",
                content: "请详细分析以下网页内容，提供全面的中文摘要，包括主要观点、关键数据和结论。使用Markdown格式输出，合理使用标题、列表、引用等元素增强可读性。",
                apiType: "openai",
                apiId: "openai-default",
                model: "gpt-3.5-turbo"
            },
            {
                id: "structured-summary",
                name: "结构化摘要",
                content: "请以结构化的方式分析并总结以下网页内容。使用Markdown语法，创建包含以下部分的摘要：\n\n1. **主要内容**: 用1-2段话概述主要内容\n2. **关键点**: 使用项目符号列出3-5个最重要的观点\n3. **细节与数据**: 提取文章中的重要数据和具体细节\n4. **结论**: 总结文章的结论或观点\n\n确保使用合适的Markdown标题、列表、强调和引用格式。",
                apiType: "openai",
                apiId: "openai-default",
                model: "gpt-3.5-turbo"
            },
            {
                id: "gemini-summary",
                name: "Gemini摘要",
                content: "请用中文总结以下网页内容的要点，用简洁的语言描述主要信息。请使用Markdown格式输出，以提高可读性。",
                apiType: "gemini",
                apiId: "gemini-default",
                model: "gemini-pro"
            }
        ],
        settings: {
            hotkey: DEFAULT_HOTKEY,
            autoExpand: false,
            lastUsedPromptId: "summary-default" // 记录上次使用的提示词ID
        },
        position: null,
        size: {
            width: DEFAULT_WIDTH
        }
    };

    // 状态变量
    let configs = GM_getValue("summarizer_configs", DEFAULT_CONFIGS);
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let summarizer = null;
    let isProcessing = false;
    let currentRequest = null; // 保存当前请求的引用

    // 添加CSS样式
    function addStyles() {
        GM_addStyle(`
            #web-summarizer {
                position: fixed;
                top: 0;
                right: 0 !important; /* 保证始终固定在右边缘 */
                width: ${DEFAULT_WIDTH}px;
                height: 100vh;
                background-color: #fff;
                border-left: 1px solid #ccc;
                font-family: Arial, sans-serif;
                z-index: 10000;
                display: none;
                overflow: hidden;
                transition: none;
                display: flex;
                flex-direction: column;
                min-width: ${MIN_WIDTH}px;
                resize: none;
                box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
            }

            #summarizer-header {
                padding: 8px 10px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                flex-shrink: 0;
            }

            #summarizer-resize-handle {
                position: absolute;
                top: 0;
                left: 0;
                width: 5px;
                height: 100%;
                cursor: ew-resize;
                background-color: transparent;
                z-index: 10002;
            }

            #summarizer-resize-handle:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }

            .resizing #summarizer-resize-handle {
                background-color: rgba(66, 133, 244, 0.2);
            }

            #summarizer-title {
                font-weight: bold;
                font-size: 14px;
                margin: 0;
            }

            #summarizer-close {
                background: none;
                border: none;
                font-size: 16px;
                cursor: pointer;
                padding: 0 5px;
            }

            #summarizer-body {
                padding: 15px;
                overflow-y: auto;
                flex-grow: 1;
            }

            #summarizer-controls {
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
            }

            #prompt-select {
                width: 100%;
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .summarizer-btn {
                padding: 8px 12px;
                background-color: #4285f4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 8px;
                font-size: 13px;
            }

            .button-group {
                display: flex;
                gap: 8px;
            }

            .summarizer-btn:hover {
                background-color: #3367d6;
            }

            .summarizer-btn:disabled {
                background-color: #b3cefb;
                cursor: not-allowed;
            }

            #summarizer-result {
                flex: 1;
                overflow-y: auto;
                border-top: 1px solid #ddd;
                display: none;
                padding: 12px 15px;
                line-height: 1.4;
                background-color: #f9f9f9;
                font-size: 14px;
                word-wrap: break-word;
                word-break: normal;
                color: #333;
                overflow-x: hidden;
            }

            /* 流式输出样式 */
            .stream-content {
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-wrap: break-word;
                word-break: normal;
                font-size: 14px;
                line-height: 1.5;
                color: #333;
            }

            /* 当前正在输出的行样式 */
            .current-line {
                position: relative;
                animation: typing-cursor 0.8s infinite;
                color: #000;
                padding-right: 2px;
            }

            /* 光标闪烁动画 */
            @keyframes typing-cursor {
                0% { border-right: 2px solid transparent; }
                50% { border-right: 2px solid #555; }
                100% { border-right: 2px solid transparent; }
            }

            /* 已完成行的淡入效果 */
            @keyframes fadeIn {
                from { opacity: 0.7; }
                to { opacity: 1; }
            }

            /* 流式输出时的简单格式化 */
            .stream-content strong {
                font-weight: bold;
            }

            .stream-content em {
                font-style: italic;
                color: #333; /* 添加较深的颜色确保可见性 */
            }

            /* 改善滚动体验 */
            #summarizer-result::-webkit-scrollbar {
                width: 8px;
            }

            #summarizer-result::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            #summarizer-result::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 10px;
            }

            #summarizer-result::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            /* 确保Markdown渲染后的斜体文本可见 */
            #summarizer-result em {
                font-style: italic;
                color: #333;
            }

            #summarizer-result h1,
            #summarizer-result h2,
            #summarizer-result h3,
            #summarizer-result h4,
            #summarizer-result h5,
            #summarizer-result h6 {
                margin-top: 1.2em;
                margin-bottom: 0.5em;
                line-height: 1.2;
                font-weight: 600;
                color: #24292e;
            }

            #summarizer-result h1 {
                font-size: 1.8em;
                border-bottom: 1px solid #eaecef;
                padding-bottom: 0.3em;
            }

            #summarizer-result h2 {
                font-size: 1.5em;
                border-bottom: 1px solid #eaecef;
                padding-bottom: 0.3em;
            }

            #summarizer-result h3 {
                font-size: 1.3em;
            }

            #summarizer-result h4 {
                font-size: 1.1em;
            }

            #summarizer-result p {
                margin-top: 0.4em;
                margin-bottom: 0.6em;
                line-height: 1.4;
            }

            #summarizer-result ul,
            #summarizer-result ol {
                margin-top: 0.5em;
                margin-bottom: 0.5em;
                padding-left: 2em;
                list-style-position: outside;
            }

            #summarizer-result li {
                margin: 0.2em 0;
                line-height: 1.4;
                position: relative;
            }

            /* 美化列表项样式 */
            #summarizer-result ul li {
                list-style-type: disc;
                padding-left: 0.2em;
            }

            #summarizer-result ul li li {
                list-style-type: circle;
            }

            #summarizer-result ol li {
                list-style-type: decimal;
                padding-left: 0.2em;
            }

            /* 修复列表滑动和显示问题 */
            #summarizer-result ol {
                counter-reset: item;
            }

            #summarizer-result ol > li {
                display: block;
            }

            #summarizer-result ol > li:before {
                content: counters(item, ".") ". ";
                counter-increment: item;
                position: absolute;
                left: -1.5em;
            }

            #summarizer-result code {
                background-color: rgba(27, 31, 35, 0.05);
                border-radius: 3px;
                font-family: monospace;
                padding: 0.2em 0.4em;
                font-size: 0.9em;
            }

            #summarizer-result pre {
                background-color: #f6f8fa;
                border-radius: 3px;
                padding: 1em;
                overflow: auto;
                margin: 1em 0;
            }

            #summarizer-result pre code {
                background-color: transparent;
                padding: 0;
                white-space: pre;
            }

            #summarizer-result blockquote {
                margin: 1em 0;
                padding: 0 1em;
                color: #6a737d;
                border-left: 0.25em solid #dfe2e5;
            }

            #summarizer-result table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
            }

            #summarizer-result table th,
            #summarizer-result table td {
                padding: 6px 13px;
                border: 1px solid #dfe2e5;
            }

            #summarizer-result table tr {
                background-color: #fff;
                border-top: 1px solid #c6cbd1;
            }

            #summarizer-result table tr:nth-child(2n) {
                background-color: #f6f8fa;
            }

            #summarizer-result img {
                max-width: 100%;
            }

            #summarizer-result a {
                color: #0366d6;
                text-decoration: none;
            }

            #summarizer-result a:hover {
                text-decoration: underline;
            }

            #summarizer-result hr {
                height: 0.25em;
                padding: 0;
                margin: 24px 0;
                background-color: #e1e4e8;
                border: 0;
            }

            /* 模态设置窗口样式 */
            #settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: none;
                justify-content: center;
                align-items: center;
            }

            #settings-container {
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
                width: 500px;
                max-width: 90%;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            #settings-header {
                padding: 10px 15px;
                background-color: #f5f5f5;
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #settings-title {
                font-weight: bold;
                font-size: 16px;
                margin: 0;
            }

            #settings-close {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 0 5px;
            }

            #settings-body {
                padding: 15px;
                overflow-y: auto;
                max-height: 70vh;
                flex-grow: 1;
            }

            #settings-footer {
                padding: 10px 15px;
                background-color: #f5f5f5;
                border-top: 1px solid #ddd;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            .settings-tabs {
                display: flex;
                border-bottom: 1px solid #ddd;
                margin-bottom: 15px;
            }

            .settings-tab {
                padding: 8px 12px;
                cursor: pointer;
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                border-bottom: none;
                margin-right: 5px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }

            .settings-tab.active {
                background-color: #fff;
                border-bottom: 1px solid #fff;
                margin-bottom: -1px;
            }

            .settings-panel {
                display: none;
                max-height: 350px;
                overflow-y: auto;
            }

            .settings-panel.active {
                display: block;
            }

            .config-item {
                margin-bottom: 15px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }

            .config-header {
                background-color: #f5f5f5;
                padding: 8px 10px;
                cursor: pointer;
                border-bottom: 1px solid #ddd;
            }

            .config-body {
                padding: 10px;
                display: none;
            }

            .config-body.expanded {
                display: block;
            }

            .dragging {
                opacity: 0.9;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .form-group {
                margin-bottom: 10px;
            }

            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .form-group input, .form-group textarea, .form-group select {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .form-group textarea {
                min-height: 80px;
                resize: vertical;
            }

            #add-api-btn, #add-prompt-btn {
                margin-bottom: 15px;
            }

            .model-list {
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 5px;
                max-height: 100px;
                overflow-y: auto;
                margin-top: 5px;
            }

            .model-item {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }

            .delete-btn {
                background-color: #f44336;
                color: white;
            }

            .delete-btn:hover {
                background-color: #d32f2f;
            }

            .spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: #4285f4;
                animation: spin 1s ease infinite;
                margin-right: 10px;
                vertical-align: middle;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            #stop-btn {
                background-color: #f44336;
            }

            #stop-btn:hover {
                background-color: #d32f2f;
            }

            /* 添加悬浮按钮样式 */
            #summarizer-float-btn {
                position: fixed;
                right: 15px;
                bottom: 15px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: #4285f4;
                color: white;
                border: none;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                z-index: 9999;
                display: none; /* 默认隐藏 */
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: all 0.3s ease;
                opacity: 0.9;
            }

            #summarizer-float-btn:hover {
                background-color: #3367d6;
                transform: scale(1.1);
                opacity: 1;
            }

            #summarizer-float-btn:active {
                transform: scale(0.95);
            }

            /* 移动端适配 - 只在移动设备上显示按钮 */
            @media (max-width: 768px) {
                #summarizer-float-btn {
                    display: flex;
                }

                #web-summarizer {
                    width: 100% !important;
                    max-width: 100% !important;
                }
            }
        `);
    }

    // 创建UI界面
    function createUI() {
        try {
            // 创建主容器
            summarizer = document.createElement('div');
            summarizer.id = 'web-summarizer';

            // 创建悬浮按钮 - 只在移动设备上创建
            const floatBtn = document.createElement('button');
            floatBtn.id = 'summarizer-float-btn';
            floatBtn.innerHTML = '📝';
            floatBtn.title = '打开摘要器';
            // 将按钮添加到页面
            document.body.appendChild(floatBtn);

            // 设置初始状态为隐藏
            summarizer.style.display = 'none';

            // 如果有保存的大小，应用它
            if (configs.size && configs.size.width) {
                summarizer.style.width = configs.size.width + 'px';
            }

            // 创建调整大小的手柄
            const resizeHandle = document.createElement('div');
            resizeHandle.id = 'summarizer-resize-handle';

            // 创建头部
            const header = document.createElement('div');
            header.id = 'summarizer-header';
            header.innerHTML = `
                <div id="summarizer-title">网页内容摘要器</div>
                <button id="summarizer-close">×</button>
            `;

            // 创建主体内容
            const body = document.createElement('div');
            body.id = 'summarizer-body';

            // 创建控制区域
            const controls = document.createElement('div');
            controls.id = 'summarizer-controls';

            // 创建提示词选择下拉框
            const promptSelect = document.createElement('select');
            promptSelect.id = 'prompt-select';
            configs.prompts.forEach(prompt => {
                const option = document.createElement('option');
                option.value = prompt.id;
                option.textContent = prompt.name;
                // 如果是上次使用的提示词，则默认选中
                if (prompt.id === configs.settings.lastUsedPromptId) {
                    option.selected = true;
                }
                promptSelect.appendChild(option);
            });

            // 创建按钮
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
            buttonGroup.innerHTML = `
                <button id="summarize-btn" class="summarizer-btn">摘要</button>
                <button id="settings-btn" class="summarizer-btn">设置</button>
            `;

            controls.appendChild(promptSelect);
            controls.appendChild(buttonGroup);

            // 创建结果区域
            const result = document.createElement('div');
            result.id = 'summarizer-result';

            // 组装主界面
            body.appendChild(controls);
            body.appendChild(result);
            summarizer.appendChild(resizeHandle);
            summarizer.appendChild(header);
            summarizer.appendChild(body);

            // 创建设置模态窗口
            const settingsModal = document.createElement('div');
            settingsModal.id = 'settings-modal';

            const settingsContainer = document.createElement('div');
            settingsContainer.id = 'settings-container';

            const settingsHeader = document.createElement('div');
            settingsHeader.id = 'settings-header';
            settingsHeader.innerHTML = `
                <div id="settings-title">设置</div>
                <button id="settings-close">×</button>
            `;

            const settingsBody = document.createElement('div');
            settingsBody.id = 'settings-body';
            settingsBody.innerHTML = `
                <div class="settings-tabs">
                    <div class="settings-tab active" data-tab="api-settings">API配置</div>
                    <div class="settings-tab" data-tab="prompt-settings">提示词配置</div>
                </div>

                <div id="api-settings" class="settings-panel active">
                    <div id="api-list"></div>
                    <button id="add-api-btn" class="summarizer-btn">添加新API配置</button>
                </div>

                <div id="prompt-settings" class="settings-panel">
                    <div id="prompt-list"></div>
                    <button id="add-prompt-btn" class="summarizer-btn">添加新提示词</button>
                </div>
            `;

            const settingsFooter = document.createElement('div');
            settingsFooter.id = 'settings-footer';
            settingsFooter.innerHTML = `
                <button id="save-settings-btn" class="summarizer-btn">保存设置</button>
                <button id="cancel-settings-btn" class="summarizer-btn">取消</button>
            `;

            // 组装设置模态窗口
            settingsContainer.appendChild(settingsHeader);
            settingsContainer.appendChild(settingsBody);
            settingsContainer.appendChild(settingsFooter);
            settingsModal.appendChild(settingsContainer);

            // 添加到页面
            document.body.appendChild(summarizer);
            document.body.appendChild(settingsModal);

            // 初始化API和提示词列表
            updateApiList();
            updatePromptList();

            // 绑定事件
            bindAllEvents();

            console.log("[网页内容摘要器] UI创建完成");
        } catch (error) {
            console.error("[网页内容摘要器] 创建UI失败:", error);
        }
    }

    // 更新API配置列表
    function updateApiList() {
        const apiList = document.getElementById('api-list');
        if (!apiList) return;

        apiList.innerHTML = '';

        configs.apis.forEach(api => {
            const apiItem = document.createElement('div');
            apiItem.className = 'config-item';
            apiItem.innerHTML = `
                <div class="config-header" data-id="${api.id}">
                    ${api.name} (${api.type === 'openai' ? 'OpenAI兼容' : 'Gemini'})
                </div>
                <div class="config-body" id="api-${api.id}">
                    <div class="form-group">
                        <label>API名称:</label>
                        <input type="text" class="api-name" value="${api.name}">
                    </div>
                    <div class="form-group">
                        <label>API类型:</label>
                        <select class="api-type">
                            <option value="openai" ${api.type === 'openai' ? 'selected' : ''}>OpenAI兼容</option>
                            <option value="gemini" ${api.type === 'gemini' ? 'selected' : ''}>Gemini</option>
                        </select>
                    </div>
                    <div class="form-group base-url-group" ${api.type === 'gemini' ? 'style="display: none;"' : ''}>
                        <label>基础URL:</label>
                        <input type="text" class="api-base-url" value="${api.baseUrl}" ${api.type === 'gemini' ? 'readonly' : ''}>
                        <small>例如: https://api.openai.com/v1/chat/completions</small>
                    </div>
                    <div class="form-group">
                        <label>API密钥:</label>
                        <input type="password" class="api-key" value="${api.apiKey}">
                    </div>
                    <div class="form-group">
                        <label>可用模型:</label>
                        <small>每行输入一个模型名称</small>
                        <textarea class="api-models">${api.models.join('\n')}</textarea>
                    </div>
                    <div class="button-group">
                        <button class="summarizer-btn test-api-btn">测试API连通性</button>
                        <button class="summarizer-btn delete-btn delete-api-btn">删除</button>
                    </div>
                </div>
            `;
            apiList.appendChild(apiItem);
        });

        // 重新绑定配置项展开/折叠事件
        bindConfigHeaderEvents();
    }

    // 更新提示词列表
    function updatePromptList() {
        const promptList = document.getElementById('prompt-list');
        if (!promptList) return;

        promptList.innerHTML = '';

        configs.prompts.forEach(prompt => {
            const promptItem = document.createElement('div');
            promptItem.className = 'config-item';

            // 获取关联的API
            const api = configs.apis.find(a => a.id === prompt.apiId);

            promptItem.innerHTML = `
                <div class="config-header" data-id="${prompt.id}">
                    ${prompt.name} (${prompt.apiType === 'openai' ? 'OpenAI' : 'Gemini'})
                </div>
                <div class="config-body" id="prompt-${prompt.id}">
                    <div class="form-group">
                        <label>提示词名称:</label>
                        <input type="text" class="prompt-name" value="${prompt.name}">
                    </div>
                    <div class="form-group">
                        <label>提示词内容:</label>
                        <textarea class="prompt-content">${prompt.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label>API类型:</label>
                        <select class="prompt-api-type">
                            <option value="openai" ${prompt.apiType === 'openai' ? 'selected' : ''}>OpenAI兼容</option>
                            <option value="gemini" ${prompt.apiType === 'gemini' ? 'selected' : ''}>Gemini</option>
                        </select>
                    </div>
                    <div class="form-group prompt-api-select-group">
                        <label>选择API配置:</label>
                        <select class="prompt-api-id">
                            ${getApiOptionsHtml(prompt.apiType, prompt.apiId)}
                        </select>
                    </div>
                    <div class="form-group prompt-model-select-group">
                        <label>选择模型:</label>
                        <select class="prompt-model">
                            ${getModelOptionsHtml(prompt.apiId, prompt.model)}
                        </select>
                    </div>
                    <div class="button-group">
                        <button class="summarizer-btn delete-btn delete-prompt-btn">删除</button>
                    </div>
                </div>
            `;
            promptList.appendChild(promptItem);
        });

        // 重新绑定配置项展开/折叠事件
        bindConfigHeaderEvents();
    }

    // 生成API选项HTML
    function getApiOptionsHtml(apiType, selectedApiId) {
        return configs.apis
            .filter(api => api.type === apiType)
            .map(api => `<option value="${api.id}" ${api.id === selectedApiId ? 'selected' : ''}>${api.name}</option>`)
            .join('');
    }

    // 生成模型选项HTML
    function getModelOptionsHtml(apiId, selectedModel) {
        const api = configs.apis.find(a => a.id === apiId);
        if (!api) return '';

        return api.models
            .map(model => `<option value="${model}" ${model === selectedModel ? 'selected' : ''}>${model}</option>`)
            .join('');
    }

    // 绑定事件
    function bindAllEvents() {
        try {
            // 移除可能的旧事件监听器
            const elementsToRebind = [
                'summarizer-close', 'summarizer-header', 'summarize-btn',
                'settings-btn', 'add-api-btn', 'add-prompt-btn',
                'save-settings-btn', 'cancel-settings-btn'
            ];

            elementsToRebind.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const newEl = el.cloneNode(true);
                    el.parentNode.replaceChild(newEl, el);
                }
            });

            // 解绑旧的全局事件
            document.removeEventListener('change', handleDynamicChangeEvents);
            document.removeEventListener('click', handleDynamicClickEvents);
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);

            // 重新绑定所有事件
            bindEvents();
        } catch (error) {
            console.error("[网页内容摘要器] 重新绑定事件失败:", error);
        }
    }

    // 绑定事件
    function bindEvents() {
        try {
            // 关闭按钮
            const closeBtn = document.getElementById('summarizer-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    summarizer.style.display = 'none';
                    // 在移动端显示悬浮按钮
                    const floatBtn = document.getElementById('summarizer-float-btn');
                    if (floatBtn && isMobileDevice()) {
                        floatBtn.style.display = 'flex';
                    }
                });
            }

            // 悬浮按钮点击事件
            const floatBtn = document.getElementById('summarizer-float-btn');
            if (floatBtn) {
                floatBtn.addEventListener('click', () => {
                    toggleSummarizer();
                    // 隐藏悬浮按钮
                    floatBtn.style.display = 'none';
                });
            }

            // 拖拽功能
            const header = document.getElementById('summarizer-header');
            if (header) {
                header.addEventListener('mousedown', startDrag);
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
            }

            // 调整大小功能
            const resizeHandle = document.getElementById('summarizer-resize-handle');
            if (resizeHandle) {
                resizeHandle.addEventListener('mousedown', startResize);
                // 监听器在startResize中动态添加
            }

            // 摘要按钮
            const summarizeBtn = document.getElementById('summarize-btn');
            if (summarizeBtn) {
                summarizeBtn.addEventListener('click', generateSummary);
            }

            // 设置按钮
            const settingsBtn = document.getElementById('settings-btn');
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    const settingsModal = document.getElementById('settings-modal');
                    if (settingsModal) {
                        settingsModal.style.display = 'flex';
                    }
                });
            }

            // 设置模态窗口关闭按钮
            const settingsCloseBtn = document.getElementById('settings-close');
            if (settingsCloseBtn) {
                settingsCloseBtn.addEventListener('click', () => {
                    const settingsModal = document.getElementById('settings-modal');
                    if (settingsModal) {
                        settingsModal.style.display = 'none';
                    }
                });
            }

            // 点击模态窗口背景关闭
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) {
                settingsModal.addEventListener('click', (e) => {
                    if (e.target === settingsModal) {
                        settingsModal.style.display = 'none';
                    }
                });
            }

            // 设置页签切换
            document.querySelectorAll('.settings-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    // 激活选中的标签
                    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');

                    // 显示对应的面板
                    const tabId = this.getAttribute('data-tab');
                    const targetPanel = document.getElementById(tabId);
                    if (targetPanel) {
                        document.querySelectorAll('.settings-panel').forEach(panel => {
                            panel.classList.remove('active');
                        });
                        targetPanel.classList.add('active');
                    }
                });
            });

            // 绑定配置项展开/折叠事件
            bindConfigHeaderEvents();

            // 添加新API按钮
            const addApiBtn = document.getElementById('add-api-btn');
            if (addApiBtn) {
                addApiBtn.addEventListener('click', addNewApiConfig);
            }

            // 添加新提示词按钮
            const addPromptBtn = document.getElementById('add-prompt-btn');
            if (addPromptBtn) {
                addPromptBtn.addEventListener('click', addNewPrompt);
            }

            // 保存设置按钮
            const saveSettingsBtn = document.getElementById('save-settings-btn');
            if (saveSettingsBtn) {
                saveSettingsBtn.addEventListener('click', saveSettings);
            }

            // 取消按钮
            const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
            if (cancelSettingsBtn) {
                cancelSettingsBtn.addEventListener('click', () => {
                    const settingsModal = document.getElementById('settings-modal');
                    if (settingsModal) {
                        settingsModal.style.display = 'none';
                        updateApiList();
                        updatePromptList();
                    }
                });
            }

            // 使用事件委托处理动态元素的事件
            document.addEventListener('change', handleDynamicChangeEvents);
            document.addEventListener('click', handleDynamicClickEvents);

            console.log("[网页内容摘要器] 事件绑定完成");
        } catch (error) {
            console.error("[网页内容摘要器] 绑定事件失败:", error);
        }
    }

    // 处理动态元素的change事件
    function handleDynamicChangeEvents(e) {
        try {
            if (e.target && e.target.classList.contains('api-type')) {
                const type = e.target.value;
                const container = e.target.closest('.config-body');
                const baseUrlGroup = container.querySelector('.base-url-group');
                const baseUrlInput = container.querySelector('.api-base-url');

                if (type === 'gemini') {
                    baseUrlGroup.style.display = 'none';
                    baseUrlInput.value = DEFAULT_GEMINI_URL;
                    baseUrlInput.setAttribute('readonly', 'readonly');
                } else {
                    baseUrlGroup.style.display = 'block';
                    baseUrlInput.removeAttribute('readonly');
                }
            }

            if (e.target && e.target.classList.contains('prompt-api-type')) {
                const type = e.target.value;
                const container = e.target.closest('.config-body');
                const apiSelect = container.querySelector('.prompt-api-id');

                apiSelect.innerHTML = getApiOptionsHtml(type, '');
                updateModelOptions(apiSelect);
            }

            if (e.target && e.target.classList.contains('prompt-api-id')) {
                updateModelOptions(e.target);
            }
        } catch (error) {
            console.error("[网页内容摘要器] 处理动态change事件失败:", error);
        }
    }

    // 处理动态元素的click事件
    function handleDynamicClickEvents(e) {
        try {
            if (e.target && e.target.classList.contains('delete-api-btn')) {
                const container = e.target.closest('.config-item');
                const id = container.querySelector('.config-header').getAttribute('data-id');

                if (confirm('确定要删除这个API配置吗？这可能会影响依赖它的提示词。')) {
                    deleteApiConfig(id);
                }
            }

            if (e.target && e.target.classList.contains('delete-prompt-btn')) {
                const container = e.target.closest('.config-item');
                const id = container.querySelector('.config-header').getAttribute('data-id');

                if (confirm('确定要删除这个提示词吗？')) {
                    deletePrompt(id);
                }
            }

            if (e.target && e.target.classList.contains('test-api-btn')) {
                const container = e.target.closest('.config-body');
                const apiType = container.querySelector('.api-type').value;
                const baseUrl = container.querySelector('.api-base-url').value;
                const apiKey = container.querySelector('.api-key').value;
                const models = container.querySelector('.api-models').value.split('\n').filter(m => m.trim());

                testApiConnection(apiType, baseUrl, apiKey, models[0] || (apiType === 'openai' ? 'gpt-3.5-turbo' : 'gemini-pro'));
            }
        } catch (error) {
            console.error("[网页内容摘要器] 处理动态click事件失败:", error);
        }
    }

    // 开始拖拽
    function startDrag(e) {
        if (e.target.id === 'summarizer-header' || e.target.id === 'summarizer-title') {
            isDragging = true;
            dragOffsetX = e.clientX - summarizer.getBoundingClientRect().left;
            dragOffsetY = e.clientY - summarizer.getBoundingClientRect().top;
            e.preventDefault();

            // 添加拖拽中的样式
            summarizer.classList.add('dragging');
            document.body.style.userSelect = 'none';
        }
    }

    // 拖拽中
    function drag(e) {
        if (isDragging) {
            const newLeft = e.clientX - dragOffsetX;
            const newTop = e.clientY - dragOffsetY;

            // 限制在视窗范围内
            const maxLeft = window.innerWidth - summarizer.offsetWidth;
            const maxTop = window.innerHeight - summarizer.offsetHeight;

            const limitedLeft = Math.max(0, Math.min(newLeft, maxLeft));
            const limitedTop = Math.max(0, Math.min(newTop, maxTop));

            // 只改变top，不改变left/right，保持右侧固定
            summarizer.style.top = limitedTop + 'px';
            // 不更新left，保持右边固定
            // summarizer.style.left = limitedLeft + 'px';
            // summarizer.style.right = 'auto';

            e.preventDefault();
        }
    }

    // 停止拖拽
    function stopDrag() {
        if (isDragging) {
            isDragging = false;

            // 移除拖拽中的样式
            summarizer.classList.remove('dragging');
            document.body.style.userSelect = '';

            // 保存位置到配置中 (只保存top)
            configs.position = {
                top: summarizer.style.top
            };

            GM_setValue("summarizer_configs", configs);
        }
    }

    // 更新模型选项
    function updateModelOptions(apiSelect) {
        const apiId = apiSelect.value;
        const container = apiSelect.closest('.config-body');
        const modelSelect = container.querySelector('.prompt-model');

        modelSelect.innerHTML = getModelOptionsHtml(apiId, '');
    }

    // 添加新API配置
    function addNewApiConfig() {
        const newId = 'api-' + Date.now();
        const newApi = {
            id: newId,
            name: "新API配置",
            type: "openai",
            baseUrl: DEFAULT_OPENAI_URL,
            apiKey: "",
            models: ["gpt-3.5-turbo"]
        };

        configs.apis.push(newApi);
        updateApiList();

        // 重新绑定所有事件
        bindAllEvents();

        // 展开新创建的配置项
        setTimeout(() => {
            const newHeader = document.querySelector(`.config-header[data-id="${newId}"]`);
            if (newHeader) {
                newHeader.click();
            }
        }, 100);
    }

    // 添加新提示词
    function addNewPrompt() {
        const newId = 'prompt-' + Date.now();
        const defaultApi = configs.apis.find(a => a.type === 'openai') || configs.apis[0];
        const newPrompt = {
            id: newId,
            name: "新提示词",
            content: "请总结以下网页内容：",
            apiType: defaultApi ? defaultApi.type : "openai",
            apiId: defaultApi ? defaultApi.id : "",
            model: defaultApi && defaultApi.models.length > 0 ? defaultApi.models[0] : ""
        };

        configs.prompts.push(newPrompt);
        updatePromptList();
        updatePromptSelect();

        // 重新绑定所有事件
        bindAllEvents();

        // 展开新创建的配置项
        setTimeout(() => {
            const newHeader = document.querySelector(`.config-header[data-id="${newId}"]`);
            if (newHeader) {
                newHeader.click();
            }
        }, 100);
    }

    // 删除API配置
    function deleteApiConfig(id) {
        configs.apis = configs.apis.filter(api => api.id !== id);

        // 更新依赖此API的提示词
        configs.prompts.forEach(prompt => {
            if (prompt.apiId === id) {
                const newApi = configs.apis.find(a => a.type === prompt.apiType);
                if (newApi) {
                    prompt.apiId = newApi.id;
                    prompt.model = newApi.models.length > 0 ? newApi.models[0] : "";
                }
            }
        });

        updateApiList();
        updatePromptList();
        updatePromptSelect();

        // 重新绑定所有事件
        bindAllEvents();
    }

    // 删除提示词
    function deletePrompt(id) {
        configs.prompts = configs.prompts.filter(prompt => prompt.id !== id);

        updatePromptList();
        updatePromptSelect();

        // 重新绑定所有事件
        bindAllEvents();
    }

    // 保存设置
    function saveSettings() {
        try {
            // 保存API配置
            const newApis = [];
            document.querySelectorAll('#api-list .config-item').forEach(item => {
                const header = item.querySelector('.config-header');
                const body = item.querySelector('.config-body');
                const id = header.getAttribute('data-id');

                newApis.push({
                    id: id,
                    name: body.querySelector('.api-name').value,
                    type: body.querySelector('.api-type').value,
                    baseUrl: body.querySelector('.api-base-url').value,
                    apiKey: body.querySelector('.api-key').value,
                    models: body.querySelector('.api-models').value.split('\n').filter(m => m.trim())
                });
            });

            // 保存提示词配置
            const newPrompts = [];
            document.querySelectorAll('#prompt-list .config-item').forEach(item => {
                const header = item.querySelector('.config-header');
                const body = item.querySelector('.config-body');
                const id = header.getAttribute('data-id');

                newPrompts.push({
                    id: id,
                    name: body.querySelector('.prompt-name').value,
                    content: body.querySelector('.prompt-content').value,
                    apiType: body.querySelector('.prompt-api-type').value,
                    apiId: body.querySelector('.prompt-api-id').value,
                    model: body.querySelector('.prompt-model').value
                });
            });

            // 保存位置信息
            const position = configs.position;

            // 更新配置
            configs.apis = newApis;
            configs.prompts = newPrompts;
            configs.settings.lastUsedPromptId = document.getElementById('prompt-select').value || configs.settings.lastUsedPromptId;
            configs.position = position;

            // 保存到GM存储
            GM_setValue("summarizer_configs", configs);

            // 不再自动关闭设置窗口
            // const settingsModal = document.getElementById('settings-modal');
            // if (settingsModal) {
            //     settingsModal.style.display = 'none';
            // }

            // 更新UI元素
            updateApiList();
            updatePromptList();

            // 更新选择框
            updatePromptSelect();

            // 更新热键监听
            document.removeEventListener('keydown', hotkeyHandler);
            addHotkeyListener();

            // 重新绑定所有事件
            bindAllEvents();
        } catch (error) {
            console.error("[网页内容摘要器] 保存设置失败:", error);
            alert('保存设置失败: ' + error.message);
        }
    }

    // 更新提示词选择下拉框
    function updatePromptSelect() {
        const promptSelect = document.getElementById('prompt-select');
        if (!promptSelect) return;

        // 保存当前选中的提示词ID
        const selectedPromptId = promptSelect.value || configs.settings.lastUsedPromptId;

        promptSelect.innerHTML = '';
        configs.prompts.forEach(prompt => {
            const option = document.createElement('option');
            option.value = prompt.id;
            option.textContent = prompt.name;
            // 恢复选中状态
            if (prompt.id === selectedPromptId) {
                option.selected = true;
            }
            promptSelect.appendChild(option);
        });
    }

    // 测试API连接
    function testApiConnection(apiType, baseUrl, apiKey, model) {
        if (!apiKey) {
            alert('请先输入API密钥');
            return;
        }

        if (apiType === 'openai') {
            // 测试OpenAI兼容API
            GM_xmlhttpRequest({
                method: 'POST',
                url: baseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'user',
                            content: 'Hello, this is a test message. Please respond with "API connection successful".'
                        }
                    ],
                    max_tokens: 50
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices.length > 0) {
                            alert('API连接成功！');
                        } else {
                            alert('API响应格式不正确: ' + response.responseText);
                        }
                    } catch (e) {
                        alert('API响应解析失败: ' + e.message);
                    }
                },
                onerror: function(response) {
                    alert('API连接失败: ' + response.statusText);
                }
            });
        } else if (apiType === 'gemini') {
            // 测试Gemini API
            const url = `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`;
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: 'Hello, this is a test message. Please respond with "API connection successful".'
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 50
                    }
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.candidates && data.candidates.length > 0) {
                            alert('API连接成功！');
                        } else {
                            alert('API响应格式不正确: ' + response.responseText);
                        }
                    } catch (e) {
                        alert('API响应解析失败: ' + e.message);
                    }
                },
                onerror: function(response) {
                    alert('API连接失败: ' + response.statusText);
                }
            });
        }
    }

    // 修复列表渲染问题
    function fixListRendering(html) {
        // 修复列表项可能存在的格式问题
        let container = document.createElement('div');
        container.innerHTML = html;

        // 处理可能存在的基于数字的列表项
        const numberListRegex = /^(\d+)\.\s+/;

        // 查找所有没有正确渲染为列表的文本
        let paragraphs = container.querySelectorAll('p');

        // 处理连续的数字列表
        let consecutiveNumberList = [];
        let currentNumber = 0;

        // 第一次处理收集连续数字列表
        for (let i = 0; i < paragraphs.length; i++) {
            let p = paragraphs[i];
            let text = p.textContent.trim();
            let numberMatch = text.match(numberListRegex);

            // 如果是数字列表项
            if (numberMatch) {
                let num = parseInt(numberMatch[1]);
                let content = text.replace(numberListRegex, '');

                // 如果是顺序的(或者是第一个)且内容不为空
                if ((consecutiveNumberList.length === 0 || num === currentNumber + 1) && content.trim()) {
                    consecutiveNumberList.push({
                        element: p,
                        content: content,
                        num: num
                    });
                    currentNumber = num;

                    // 给这个元素标记，稍后要处理
                    p.setAttribute('data-list-item', 'number');
                }
            } else if (consecutiveNumberList.length > 0) {
                // 结束当前列表，并转换为有序列表
                createNumberedList(consecutiveNumberList, container);
                consecutiveNumberList = [];
                currentNumber = 0;
            }
        }

        // 如果还有未处理的连续列表
        if (consecutiveNumberList.length > 0) {
            createNumberedList(consecutiveNumberList, container);
        }

        // 处理基于特殊符号的列表项
        for (let p of paragraphs) {
            // 跳过已处理的数字列表项
            if (p.getAttribute('data-list-item') === 'number') {
                continue;
            }

            // 检查段落是否以列表项标记开始
            if (p.textContent.trim().match(/^[•\-*]\s+/)) {
                // 转换为正确的列表项
                let listContent = p.textContent.trim().replace(/^[•\-*]\s+/, '');
                let ul = document.createElement('ul');
                let li = document.createElement('li');
                li.textContent = listContent;
                ul.appendChild(li);
                p.parentNode.replaceChild(ul, p);
            }
        }

        return container.innerHTML;
    }

    // 创建编号列表
    function createNumberedList(items, container) {
        if (items.length === 0) return;

        const ol = document.createElement('ol');
        // 设置起始编号
        ol.setAttribute('start', items[0].num);

        for (let item of items) {
            const li = document.createElement('li');
            li.textContent = item.content;
            ol.appendChild(li);

            // 如果原元素仍在DOM中，则替换它
            if (item.element.parentNode) {
                item.element.parentNode.replaceChild(document.createTextNode(''), item.element);
            }
        }

        // 找到第一个列表项的位置并插入列表
        if (items[0].element.parentNode) {
            items[0].element.parentNode.insertBefore(ol, items[0].element);
        }
    }

    // 生成摘要
    function generateSummary() {
        // 如果当前正在处理，则表示这是停止操作
        if (isProcessing) {
            stopSummary();
            return;
        }

        // 获取选中的提示词
        const promptId = document.getElementById('prompt-select').value;
        const prompt = configs.prompts.find(p => p.id === promptId);

        if (!prompt) {
            alert('请先选择或创建一个提示词');
            return;
        }

        // 保存当前使用的提示词ID
        configs.settings.lastUsedPromptId = promptId;
        GM_setValue("summarizer_configs", configs);

        // 获取关联的API配置
        const api = configs.apis.find(a => a.id === prompt.apiId);

        if (!api) {
            alert('提示词关联的API配置不存在，请检查设置');
            return;
        }

        if (!api.apiKey) {
            alert('请先设置API密钥');
            return;
        }

        // 获取网页内容
        const pageContent = getPageContent();
        if (!pageContent) {
            alert('无法提取页面内容');
            return;
        }

        // 显示处理中状态
        const summarizeBtn = document.getElementById('summarize-btn');
        const resultDiv = document.getElementById('summarizer-result');

        // 将摘要按钮改为停止按钮
        summarizeBtn.disabled = false;
        summarizeBtn.id = 'stop-btn';
        summarizeBtn.innerHTML = '<span class="spinner"></span>停止摘要';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><span class="spinner"></span> 正在生成摘要，请稍候...</div>';

        isProcessing = true;

        // 模拟流式输出的函数
        function simulateStreamOutput(text) {
            // 清空结果区域
            resultDiv.innerHTML = '';

            // 创建一个用于实时显示内容的元素
            const streamContainer = document.createElement('div');
            streamContainer.className = 'stream-content';
            resultDiv.appendChild(streamContainer);

            // 将文本按行分割
            const lines = text.split('\n');
            let currentLineIndex = 0;
            let currentCharIndex = 0;

            // 当前已显示的完整行
            let completedLines = [];
            // 当前正在输出的行
            let currentLineOutput = '';

            // 使用markdown临时存储以便最终渲染
            let markdownText = '';

            // 使用定时器模拟流式输出
            const streamInterval = setInterval(() => {
                // 如果已经停止处理，清除定时器
                if (!isProcessing) {
                    clearInterval(streamInterval);
                    return;
                }

                // 如果已经输出完所有行，清除定时器并标记完成
                if (currentLineIndex >= lines.length) {
                    clearInterval(streamInterval);
                    // 最终渲染完整的markdown
                    let renderedHtml = renderMarkdown(markdownText);

                    // 额外处理，修复可能的列表渲染问题
                    renderedHtml = fixListRendering(renderedHtml);

                    resultDiv.innerHTML = renderedHtml;
                    // 确保显示完整内容
                    setTimeout(() => {
                        resultDiv.scrollTop = 0;
                    }, 100);
                    resetSummaryButton();
                    return;
                }

                // 获取当前要处理的行
                const currentLine = lines[currentLineIndex];

                // 如果当前行为空（即空行），直接添加并移到下一行
                if (currentLine.trim() === '') {
                    completedLines.push('');
                    markdownText += '\n';
                    currentLineIndex++;
                    currentCharIndex = 0;
                    currentLineOutput = '';
                }
                // 如果已经完成当前行的所有字符输出
                else if (currentCharIndex >= currentLine.length) {
                    // 添加当前完成的行到已完成行列表
                    completedLines.push(currentLineOutput);
                    // 添加换行符到markdown文本
                    markdownText += currentLine + '\n';
                    // 移动到下一行
                    currentLineIndex++;
                    currentCharIndex = 0;
                    currentLineOutput = '';
                }
                // 正在处理当前行
                else {
                    // 确定本次要添加的字符数量 (每次输出3-8个字符)
                    let charsToAdd = Math.floor(Math.random() * 5) + 3;
                    // 确保不超出当前行的长度
                    if (currentCharIndex + charsToAdd > currentLine.length) {
                        charsToAdd = currentLine.length - currentCharIndex;
                    }

                    // 获取并添加下一块字符
                    const nextChunk = currentLine.substring(currentCharIndex, currentCharIndex + charsToAdd);
                    currentCharIndex += charsToAdd;
                    currentLineOutput += nextChunk;
                }

                // 构建用于显示的HTML
                let displayHtml = '';

                // 添加所有已完成的行
                for (let i = 0; i < completedLines.length; i++) {
                    displayHtml += completedLines[i] + '<br>';
                }

                // 添加当前正在处理的行（带有光标效果）
                if (currentLineOutput) {
                    displayHtml += '<span class="current-line">' + currentLineOutput + '</span>';
                }

                // 应用简单的格式化并显示
                streamContainer.innerHTML = displayHtml
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');

                // 自动滚动到底部
                resultDiv.scrollTop = resultDiv.scrollHeight;
            }, 20); // 更快的更新频率，提供更流畅的输出效果
        }

        // A根据API类型发送请求
        if (prompt.apiType === 'openai') {
            // 调用OpenAI兼容API
            currentRequest = GM_xmlhttpRequest({
                method: 'POST',
                url: api.baseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.apiKey}`
                },
                data: JSON.stringify({
                    model: prompt.model,
                    messages: [
                        {
                            role: 'user',
                            content: `${prompt.content}\n\n${pageContent}`
                        }
                    ],
                    max_tokens: 2000  // 增加token数量，确保返回完整内容
                }),
                onload: function(response) {
                    try {
                        // 检查请求是否已经被中止
                        if (this.readyState === 4 && this.status === 0) {
                            resultDiv.innerHTML = '<div style="padding: 15px;">摘要已取消</div>';
                            resetSummaryButton();
                            return;
                        }

                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices.length > 0) {
                            const summaryText = data.choices[0].message.content;
                            // 使用流式输出模拟
                            simulateStreamOutput(summaryText);
                        } else {
                            resultDiv.innerHTML = '<div style="color: red; padding: 15px;">生成摘要失败: API响应格式不正确</div>';
                            console.error('API响应:', data);
                            resetSummaryButton();
                        }
                    } catch (e) {
                        resultDiv.innerHTML = `<div style="color: red; padding: 15px;">生成摘要失败: ${e.message}</div>`;
                        console.error('API响应解析失败:', e, response.responseText);
                        resetSummaryButton();
                    }
                },
                onerror: function(response) {
                    resultDiv.innerHTML = `<div style="color: red; padding: 15px;">生成摘要失败: ${response.statusText || '请求错误'}</div>`;
                    resetSummaryButton();
                }
            });
        } else if (prompt.apiType === 'gemini') {
            // 调用Gemini API
            const url = `${api.baseUrl}/v1beta/models/${prompt.model}:generateContent?key=${api.apiKey}`;
            currentRequest = GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `${prompt.content}\n\n${pageContent}`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        maxOutputTokens: 2000  // 增加token数量，确保返回完整内容
                    }
                }),
                onload: function(response) {
                    try {
                        // 检查请求是否已经被中止
                        if (this.readyState === 4 && this.status === 0) {
                            resultDiv.innerHTML = '<div style="padding: 15px;">摘要已取消</div>';
                            resetSummaryButton();
                            return;
                        }

                        const data = JSON.parse(response.responseText);
                        if (data.candidates && data.candidates.length > 0) {
                            const summaryText = data.candidates[0].content.parts[0].text;
                            // 使用流式输出模拟
                            simulateStreamOutput(summaryText);
                        } else {
                            resultDiv.innerHTML = '<div style="color: red; padding: 15px;">生成摘要失败: API响应格式不正确</div>';
                            console.error('API响应:', data);
                            resetSummaryButton();
                        }
                    } catch (e) {
                        resultDiv.innerHTML = `<div style="color: red; padding: 15px;">生成摘要失败: ${e.message}</div>`;
                        console.error('API响应解析失败:', e, response.responseText);
                        resetSummaryButton();
                    }
                },
                onerror: function(response) {
                    resultDiv.innerHTML = `<div style="color: red; padding: 15px;">生成摘要失败: ${response.statusText || '请求错误'}</div>`;
                    resetSummaryButton();
                }
            });
        }
    }

    // 停止摘要
    function stopSummary() {
        if (currentRequest && typeof currentRequest.abort === 'function') {
            currentRequest.abort();
        }

        // 重置按钮和状态
        resetSummaryButton();

        console.log("[网页内容摘要器] 摘要已停止");
    }

    // 重置摘要按钮
    function resetSummaryButton() {
        const stopBtn = document.getElementById('stop-btn');
        if (stopBtn) {
            stopBtn.id = 'summarize-btn';
            stopBtn.textContent = '摘要';
            stopBtn.disabled = false;
        }
        isProcessing = false;
        currentRequest = null;
    }

    // 获取页面内容
    function getPageContent() {
        try {
            // 获取主要内容
            let content = '';

            // 尝试获取文章内容区
            const articleElements = document.querySelectorAll('article, .article, .post, .content, main');
            if (articleElements.length > 0) {
                // 使用最大的内容区
                let maxTextElement = null;
                let maxTextLength = 0;

                articleElements.forEach(el => {
                    const textLength = el.textContent.trim().length;
                    if (textLength > maxTextLength) {
                        maxTextLength = textLength;
                        maxTextElement = el;
                    }
                });

                if (maxTextElement) {
                    content = maxTextElement.textContent;
                }
            }

            // 如果没有找到明确的内容区，尝试从段落获取
            if (!content || content.length < 100) {
                const paragraphs = document.querySelectorAll('p');
                const paragraphTexts = [];

                paragraphs.forEach(p => {
                    // 过滤掉短段落和导航/页脚/侧边栏等区域的段落
                    const text = p.textContent.trim();
                    if (text.length > 20 && !isElementInNavOrFooter(p)) {
                        paragraphTexts.push(text);
                    }
                });

                content = paragraphTexts.join('\n\n');
            }

            // 确保内容不为空
            if (!content || content.length < 50) {
                // 退化方案：获取所有可见文本
                content = document.body.innerText;
            }

            // 添加页面标题
            const pageTitle = document.title;
            content = `标题: ${pageTitle}\n\n${content}`;

            // 过滤内容
            content = content
                .replace(/\s+/g, ' ')  // 替换多个空白字符为单个空格
                .replace(/\n{3,}/g, '\n\n')  // 替换多个换行为两个换行
                .trim();

            // 限制内容长度
            const maxLength = 6000;  // 设置合理的长度限制
            if (content.length > maxLength) {
                content = content.substring(0, maxLength) + "\n\n... (内容已截断)";
            }

            return content;
        } catch (e) {
            console.error('获取页面内容失败:', e);
            return document.title + '\n\n' + document.body.innerText.substring(0, 6000);
        }
    }

    // 判断元素是否在导航或页脚中
    function isElementInNavOrFooter(element) {
        let current = element;
        while (current && current !== document.body) {
            const tagName = current.tagName.toLowerCase();
            const className = (current.className || '').toLowerCase();
            const id = (current.id || '').toLowerCase();

            if (
                tagName === 'nav' ||
                tagName === 'footer' ||
                tagName === 'header' ||
                className.includes('nav') ||
                className.includes('menu') ||
                className.includes('footer') ||
                className.includes('sidebar') ||
                id.includes('nav') ||
                id.includes('menu') ||
                id.includes('footer') ||
                id.includes('sidebar')
            ) {
                return true;
            }

            current = current.parentElement;
        }

        return false;
    }

    // 渲染Markdown内容
    function renderMarkdown(text) {
        try {
            // 确保marked库已加载
            if (typeof marked === 'undefined') {
                console.error('[网页内容摘要器] Marked库未加载');
                return text;
            }

            // 预处理文本，优化列表项
            // 统一列表标记并确保正确的间距
            text = text
                // 统一列表符号
                .replace(/^[•\-*]\s+/gm, '* ')
                // 确保数字列表的正确格式
                .replace(/^(\d+)\.\s*/gm, '$1. ')
                // 确保列表项之间有空行，但避免连续多个空行
                .replace(/\n{3,}/g, '\n\n')
                // 如果列表项之间没有空行，需要确保相邻行的连接性
                .replace(/(\n[*\-] [^\n]+)(\n[*\-] )/g, '$1\n$2');

            // 配置marked选项
            marked.setOptions({
                breaks: true, // 支持换行
                gfm: true, // 支持GitHub风格的Markdown
                headerIds: false,
                mangle: false,
                sanitize: false,
                smartLists: true, // 智能列表
                smartypants: true, // 智能标点
                xhtml: false
            });

            // 渲染Markdown
            return marked.parse(text);
        } catch (error) {
            console.error('[网页内容摘要器] Markdown渲染失败:', error);
            return text;
        }
    }

    // 初始化
    function initialize() {
        try {
            // 添加CSS样式
            addStyles();

            // 创建UI界面
            createUI();

            // 注册油猴菜单命令
            GM_registerMenuCommand("打开/关闭摘要器", toggleSummarizer);

            // 添加热键监听
            addHotkeyListener();

            // 设置悬浮按钮初始状态
            const floatBtn = document.getElementById('summarizer-float-btn');
            if (floatBtn) {
                floatBtn.style.display = isMobileDevice() ? 'flex' : 'none';
            }

            console.log("[网页内容摘要器] 初始化完成，按Alt+" + configs.settings.hotkey.toUpperCase() + "打开摘要器");
        } catch (error) {
            console.error("[网页内容摘要器] 初始化失败:", error);
            // 尝试重新初始化
            setTimeout(() => {
                try {
                    console.log("[网页内容摘要器] 尝试重新初始化...");
                    // 清理之前的UI（如果有）
                    const oldSummarizer = document.getElementById('web-summarizer');
                    if (oldSummarizer) {
                        oldSummarizer.remove();
                    }

                    // 重新创建UI
                    createUI();
                    console.log("[网页内容摘要器] 重新初始化完成");
                } catch (e) {
                    console.error("[网页内容摘要器] 重新初始化失败:", e);
                }
            }, 2000);
        }
    }

    // 切换摘要器显示状态
    function toggleSummarizer() {
        try {
            if (!summarizer) {
                console.log("[网页内容摘要器] 摘要器未初始化，尝试重新初始化");
                initialize();
                return;
            }

            if (summarizer.style.display === 'none' || summarizer.style.display === '') {
                summarizer.style.display = 'flex';
                // 在移动端隐藏悬浮按钮
                const floatBtn = document.getElementById('summarizer-float-btn');
                if (floatBtn) {
                    floatBtn.style.display = 'none';
                }
            } else {
                summarizer.style.display = 'none';
                // 在移动端显示悬浮按钮
                const floatBtn = document.getElementById('summarizer-float-btn');
                if (floatBtn && isMobileDevice()) {
                    floatBtn.style.display = 'flex';
                }
            }
        } catch (error) {
            console.error("[网页内容摘要器] 切换显示状态失败:", error);
        }
    }

    // 添加热键监听
    function addHotkeyListener() {
        try {
            // 先移除旧的事件监听（如果有）以避免重复
            document.removeEventListener('keydown', hotkeyHandler);

            // 添加新的事件监听
            document.addEventListener('keydown', hotkeyHandler);
        } catch (error) {
            console.error("[网页内容摘要器] 添加热键监听失败:", error);
        }
    }

    // 热键处理函数
    function hotkeyHandler(e) {
        if (e.altKey && e.key.toLowerCase() === configs.settings.hotkey.toLowerCase()) {
            e.preventDefault();
            toggleSummarizer();
        }
    }

    // 绑定配置项展开/折叠事件
    function bindConfigHeaderEvents() {
        document.querySelectorAll('.config-header').forEach(header => {
            // 移除旧事件以避免重复绑定
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            newHeader.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const body = this.nextElementSibling;

                if (body.classList.contains('expanded')) {
                    body.classList.remove('expanded');
                } else {
                    if (!configs.settings.autoExpand) {
                        document.querySelectorAll('.config-body').forEach(b => b.classList.remove('expanded'));
                    }
                    body.classList.add('expanded');
                }
            });
        });
    }

    // 开始调整大小
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    function startResize(e) {
        // 防止事件传播
        e.stopPropagation();
        e.preventDefault();

        isResizing = true;
        startX = e.clientX;
        startWidth = summarizer.offsetWidth;

        // 添加调整大小时的事件监听
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);

        // 添加调整大小时的样式
        document.body.style.userSelect = 'none';
        summarizer.classList.add('resizing');
    }

    // 调整大小中
    function resize(e) {
        if (!isResizing) return;

        // 计算新宽度 - 向左拖动增加宽度 (因为是从右侧固定的)
        const newWidth = startWidth + (startX - e.clientX);

        // 限制宽度在合理范围内
        if (newWidth >= MIN_WIDTH && newWidth <= window.innerWidth * 0.9) {
            summarizer.style.width = newWidth + 'px';
        }
    }

    // 停止调整大小
    function stopResize() {
        if (!isResizing) return;

        isResizing = false;

        // 移除事件监听
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);

        // 移除样式
        document.body.style.userSelect = '';
        summarizer.classList.remove('resizing');

        // 保存大小到配置
        configs.size = {
            width: summarizer.offsetWidth
        };

        GM_setValue("summarizer_configs", configs);
    }

    // 主函数
    // 等待DOM完全加载后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
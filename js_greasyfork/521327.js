// ==UserScript==
// @name         OpenAI API 测试工具
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  测试 OpenAI API 可用性和额度，支持模型对话
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/521327/OpenAI%20API%20%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521327/OpenAI%20API%20%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 全局变量声明
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = -25;
    let yOffset = 160;
    let hideTimeout;
    let lastPosition = { x: xOffset, y: yOffset };
    let selectedModelSet = new Set();
    let allModels = [];
    let availableModels = new Set();
    let chatHistories = {};
    let defaultMemoryMode = GM_getValue('defaultMemoryMode', '0');
    let defaultStreamMode = GM_getValue('defaultStreamMode', false);
    let lastSearchTerm = '';
    let isInSearchMode = false;
    // URL处理函数
    function processApiUrl(url, operation = '') {
    url = url.trim().replace(/\/+$/, '');
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    
    // 检查是否包含版本号
    const versionPattern = /\/v(\d+)(?:\/|$)/;
    const match = url.match(versionPattern);
    let baseUrl;
    // 如果是聊天操作，保留用户的自定义后缀
    if (operation === 'chat') {
        // 如果URL中已经包含了聊天后缀，直接使用原URL
        if (url.includes('/chat/') || url.includes('/completions')) {
            return url.replace(/\/+/g, '/');
        }
        // 否则使用默认的聊天后缀
        if (match) {
            baseUrl = `${url.replace(versionPattern, '')}/v${match[1]}`;
        } else {
            baseUrl = `${url}/v1`;
        }
        return `${baseUrl}/chat/completions`.replace(/\/+/g, '/');
    } 
    // 对于其他操作（获取模型和余额检测），使用标准后缀
    else {
        // 移除所有已知的API后缀
        url = url.replace(/\/v\d+\/+(?:chat\/+completions|models|dashboard\/+billing\/+subscription|dashboard\/+billing\/+usage).*$/, '');
        
        if (match) {
            baseUrl = `${url.replace(versionPattern, '')}/v${match[1]}`;
        } else {
            baseUrl = `${url}/v1`;
        }
        // 根据操作类型添加不同的后缀
        switch(operation) {
            case 'models':
                return `${baseUrl}/models`.replace(/\/+/g, '/');
            case 'subscription':
                return `${baseUrl}/dashboard/billing/subscription`.replace(/\/+/g, '/');
            case 'usage':
                return `${baseUrl}/dashboard/billing/usage`.replace(/\/+/g, '/');
            default:
                return baseUrl.replace(/\/+/g, '/');
        }
    }
}
// 创建样式
    const style = document.createElement('style');
    style.textContent = `
    .panel-header {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    .close-button {
        font-size: 20px;
        color: #666;
        cursor: pointer;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
        line-height: 1;
        border: 1px solid #ddd;
        padding: 0;
        margin-bottom: 5px;
    }
    .close-button:hover {
        color: #333;
        background-color: rgba(0, 0, 0, 0.1);
        border-color: #999;
    }
    #openai-api-tester {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background: rgba(255, 255, 255, 0.95);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        width: 90%;
        max-width: 400px;
        font-family: Arial, sans-serif;
        display: none;
        font-size: 14px;
        color: #000;
        max-height: 90vh;
        overflow-y: auto;
    }
    #floating-button {
        position: fixed;
        z-index: 10000;
        width: 45px;
        height: 45px;
        border-radius: 23px;
        background: #1a73e8;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: move;
        user-select: none;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.3s ease;
        touch-action: none;
    }
    #floating-button:hover {
        background: #1557b0;
    }
    #openai-api-tester .input-group {
        margin-bottom: 10px;
        position: relative;
    }
    #openai-api-tester .input-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 14px;
        background: white;
        color: #000;
    }
    #openai-api-tester .button-group {
        margin-top: 10px;
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }
    #openai-api-tester .button-group button {
        flex: 1;
        padding: 8px 10px;
        border: none;
        border-radius: 4px;
        background: #1a73e8;
        color: white;
        cursor: pointer;
        font-size: 12px;
        white-space: nowrap;
        min-width: 80px;
        transition: background-color 0.2s ease;
    }
    #openai-api-tester .button-group button:hover {
        background: #1557b0;
    }
    #openai-api-tester .button-group button:active,
    #openai-api-tester .add-custom-button:active,
    #openai-api-tester .search-container button:active,
    #openai-api-tester .refresh-button:active,
    #openai-api-tester .clear-models-button,
    #openai-api-tester .copy-button {
        padding: 4px 8px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background-color 0.2s ease;
    }
    #openai-api-tester .clear-models-button:hover,
    #openai-api-tester .copy-button:hover {
        background: #1557b0;
    }
    #openai-api-tester .button-group button:focus,
    #openai-api-tester .add-custom-button:focus,
    #openai-api-tester .search-container button:focus,
    #openai-api-tester .refresh-button:focus,
    #openai-api-tester .clear-models-button:focus,
    #openai-api-tester .copy-button:focus {
        outline: none;
    }
    #openai-api-tester .search-container {
        display: flex;
        gap: 5px;
        margin-bottom: 10px;
    }
    #openai-api-tester .search-container input {
        flex: 1;
    }
    #openai-api-tester .search-container button {
        padding: 4px 8px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    #openai-api-tester .search-refresh-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;
        padding: 5px;
        background: rgba(240, 245, 255, 0.9);
        border-radius: 4px;
    }
    #openai-api-tester .select-all-container {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    #openai-api-tester .select-all-label {
        display: flex;
        align-items: center;
        gap: 5px;
    }

#openai-api-tester .select-all-label {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    #openai-api-tester .refresh-button {
        padding: 4px 8px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin-left: 10px;
    }
    #openai-api-tester .refresh-button:hover {
        background: #1557b0;
    }
    #openai-api-tester .custom-models-group {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    #openai-api-tester .custom-models-group input {
        flex: 1;
        white-space: nowrap;
        overflow-x: auto;
        max-width: calc(100% - 70px);
    }
    #openai-api-tester .add-custom-button {
        padding: 8px 12px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.2s ease;
    }
    #openai-api-tester .add-custom-button:hover {
        background: #1557b0;
    }
    #openai-api-tester .selected-models {
        padding: 5px;
        margin: 5px 0;
        background: rgba(240, 245, 255, 0.3);
        border-radius: 4px;
        max-height: 100px;
        overflow-y: auto;
    }
    #openai-api-tester .selected-models-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    #openai-api-tester .section-title {
        font-weight: bold;
        margin: 10px 0 5px 0;
        color: #333;
    }
    #openai-api-tester .selected-model-item {
        display: inline-flex;
        align-items: center;
        padding: 2px 4px;
        margin: 2px;
        background: rgba(26, 115, 232, 0.1);
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
    }
    #openai-api-tester .model-list {
        margin-top: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 10px;
        border-radius: 4px;
        max-height: 150px;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        scrollbar-width: thin;
    }
    #openai-api-tester .copy-dropdown {
        position: relative;
        display: inline-block;
    }
    #openai-api-tester .copy-menu {
        display: none;
        position: absolute;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        z-index: 10002;
    }
    #openai-api-tester .copy-option {
        padding: 8px 12px;
        cursor: pointer;
        white-space: nowrap;
    }
    #openai-api-tester .copy-option:hover {
        background: #f5f5f5;
    }
    #openai-api-tester .model-item {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    #openai-api-tester .model-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
    #openai-api-tester .result-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }
    #openai-api-tester .circular-progress {
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #1a73e8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

#openai-api-tester .circular-progress {
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #1a73e8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    #openai-api-tester .quota-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 10px;
    }
    #openai-api-tester .quota-card {
        background: white;
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
    }
    #openai-api-tester .quota-title {
        font-size: 14px;
        color: #666;
        margin-bottom: 8px;
    }
    #openai-api-tester .quota-value {
        font-size: 16px;
        font-weight: bold;
        color: #1a73e8;
    }
    .openai-chat-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 600px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10001;
        display: flex;
        flex-direction: column;
        height: 80vh;
        color: #000000;
    }
    .openai-chat-dialog .chat-header {
        padding: 10px 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #000000;
        font-weight: bold;
        background: #f8f9fa;
        border-radius: 8px 8px 0 0;
    }
    .openai-chat-dialog .model-title {
        flex: 0 0 auto;
        margin-right: 20px;
    }
    .openai-chat-dialog .controls {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-left: auto;
    }
    .openai-chat-dialog .memory-menu,
    .openai-chat-dialog .stream-mode-menu {
        position: relative;
        display: inline-block;
    }
    .openai-chat-dialog .memory-button,
    .openai-chat-dialog .stream-mode-button,
    .openai-chat-dialog .clear-chat-button {
        padding: 4px 8px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
    }
    .openai-chat-dialog .memory-button:hover,
    .openai-chat-dialog .stream-mode-button:hover,
    .openai-chat-dialog .clear-chat-button:hover {
        background: #1557b0;
    }
    .openai-chat-dialog .memory-options,
    .openai-chat-dialog .stream-mode-options {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 10003;
        min-width: 120px;
        margin-top: 4px;
    }
    .openai-chat-dialog .memory-option,
    .openai-chat-dialog .stream-mode-option {
        padding: 8px 12px;
        cursor: pointer;
        color: #333;
        transition: background-color 0.2s ease;
    }
    .openai-chat-dialog .memory-option:hover,
    .openai-chat-dialog .stream-mode-option:hover {
        background: #f0f0f0;
    }
    .openai-chat-dialog .close-chat {
        margin-left: 15px;
        cursor: pointer;
        font-size: 20px;
        color: #666;
        transition: color 0.2s ease;
    }
    .openai-chat-dialog .close-chat:hover {
        color: #333;
    }

.openai-chat-dialog .close-chat:hover {
        color: #333;
    }
    .openai-chat-dialog .chat-content {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        min-height: 200px;
        scrollbar-width: thin;
        background: #fff;
    }
    .openai-chat-dialog .chat-input-area {
        padding: 10px;
        border-top: 1px solid #eee;
        background: #f8f9fa;
        border-radius: 0 0 8px 8px;
    }
    .openai-chat-dialog .chat-input-area textarea {
        width: 100%;
        height: 80px;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: none;
        margin-bottom: 10px;
        font-family: inherit;
        font-size: 14px;
        line-height: 1.5;
    }
    .openai-chat-dialog .chat-input-area textarea:focus {
        outline: none;
        border-color: #1a73e8;
        box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
    }
    .openai-chat-dialog .chat-input-area .send-button {
        width: 100%;
        padding: 8px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    .openai-chat-dialog .chat-input-area .send-button:hover {
        background: #1557b0;
    }
    .openai-chat-dialog .message {
        margin-bottom: 10px;
        padding: 8px 12px;
        border-radius: 8px;
        max-width: 85%;
        white-space: pre-wrap;
        color: #000000;
        line-height: 1.5;
        position: relative;
    }
    .openai-chat-dialog .user-message {
        background: #e3f2fd;
        margin-left: auto;
        border-bottom-right-radius: 4px;
    }
    .openai-chat-dialog .bot-message {
        background: #f5f5f5;
        margin-right: auto;
        border-bottom-left-radius: 4px;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    document.head.appendChild(style);
// 创建主容器
    const container = document.createElement('div');
    container.id = 'openai-api-tester';
    container.innerHTML = `
        <div class="panel-header">
            <span id="closePanel" class="close-button">×</span>
        </div>
        <div class="input-group">
            <input type="text" id="apiUrl" placeholder="API Base URL (例如: https://api.openai.com)">
        </div>
        <div class="input-group">
            <input type="text" id="apiKey" placeholder="API Key (可选)">
        </div>
        <div class="button-group">
            <button id="fetchModelsButton">获取模型列表</button>
            <button id="checkQuotaButton">查询额度</button>
            <button id="testModelsButton" style="display: none;">测试所选模型</button>
        </div>
        <div class="input-group custom-models-group">
            <input type="text" id="customModels" placeholder="输入自定义模型（以逗号分隔）" style="max-width: 100%; overflow-x: auto;">
            <button id="addCustomModels" class="add-custom-button">添加</button>
        </div>
        <div class="input-group" id="searchBox" style="display: none;">
            <div class="search-container">
                <input type="text" id="modelSearch" placeholder="搜索模型...">
                <button id="searchButton">搜索</button>
                <button id="resetSearch">返回</button>
            </div>
        </div>

<div class="search-refresh-container" style="display: none;">
            <div class="select-all-container">
                <label class="select-all-label">
                    <input type="checkbox" id="selectAllModels">
                    <span>全选/取消全选</span>
                </label>
                <button class="refresh-button" id="refreshPanel" title="刷新面板">↻</button>
            </div>
        </div>
        <div id="selectedModels" class="selected-models" style="display: none;">
            <div class="selected-models-header">
                <div class="section-title">已选模型:</div>
                <div class="buttons-container">
                    <button class="clear-models-button">清空模型</button>
                    <div class="copy-dropdown">
                        <button class="copy-button">复制模型 ▼</button>
                        <div class="copy-menu">
                            <div class="copy-option" id="copyAvailable">复制可用模型</div>
                            <div class="copy-option" id="copySelected">复制已选模型</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="selected-models-list"></div>
        </div>
        <div id="modelList" class="model-list"></div>
        <div id="testResults"></div>
    `;
// 创建浮动按钮
const floatingButton = document.createElement('div');
floatingButton.id = 'floating-button';
floatingButton.innerHTML = 'API';
floatingButton.style.left = '-25px';
floatingButton.style.top = '160px';
document.body.appendChild(container);
document.body.appendChild(floatingButton);
// 主要功能函数
function adjustMenuPosition(menu, button) {
    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (buttonRect.bottom + menuRect.height > windowHeight) {
        menu.style.top = 'auto';
        menu.style.bottom = '100%';
    } else {
        menu.style.top = '100%';
        menu.style.bottom = 'auto';
    }
}
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
function setupCopyFunctions() {
    const copyButton = document.querySelector('.copy-button');
    const copyMenu = document.querySelector('.copy-menu');
    const clearButton = document.querySelector('.clear-models-button');
    
    clearButton.onclick = () => {
        selectedModelSet.clear();
        availableModels.clear();
        const checkboxes = document.querySelectorAll('.model-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        updateSelectedModelsDisplay();
        updateSelectAllCheckbox();
        renderModels(allModels);
    };
    
    copyButton.onclick = () => {
        copyMenu.style.display = copyMenu.style.display === 'block' ? 'none' : 'block';
    };
    
    document.getElementById('copyAvailable').onclick = () => {
        const models = Array.from(availableModels).sort().join(',');
        if (models) {
            copyToClipboard(models);
            copyMenu.style.display = 'none';
        }
    };
    
    document.getElementById('copySelected').onclick = () => {
        const selectedModels = Array.from(selectedModelSet).sort().join(',');
        if (selectedModels) {
            copyToClipboard(selectedModels);
            copyMenu.style.display = 'none';
        }
    };
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.copy-dropdown')) {
            copyMenu.style.display = 'none';
        }
    });
}

function createChatDialog(model, apiUrl) {
    const dialog = document.createElement('div');
    dialog.className = 'openai-chat-dialog';
    dialog.innerHTML = `
        <div class="chat-header">
            <div class="model-title-container">
                <span class="model-title">${model}</span>
            </div>
            <div class="controls">
                <div class="memory-menu">
                    <button class="memory-button">记忆模式</button>
                    <div class="memory-options">
                        <div class="memory-option" data-mode="0">零次记忆</div>
                        <div class="memory-option" data-mode="5">5次记忆</div>
                        <div class="memory-option" data-mode="10">10次记忆</div>
                        <div class="memory-option" data-mode="20">20次记忆</div>
                        <div class="memory-option" data-mode="50">50次记忆</div>
                        <div class="memory-option" data-mode="100">100次记忆</div>
                        <div class="memory-option" data-mode="unlimited">无限记忆</div>
                    </div>
                </div>
                <div class="stream-mode-menu">
                    <button class="stream-mode-button">模式</button>
                    <div class="stream-mode-options">
                        <div class="stream-mode-option" data-mode="standard">标准模式</div>
                        <div class="stream-mode-option" data-mode="stream">流式模式</div>
                    </div>
                </div>
                <button class="clear-chat-button">清除对话</button>
                <span class="close-chat">×</span>
            </div>
        </div>
        <div class="chat-content"></div>
        <div class="chat-input-area">
            <textarea placeholder="输入消息..."></textarea>
            <button class="send-button">发送</button>
        </div>
    `;
    document.body.appendChild(dialog);
    const closeButton = dialog.querySelector('.close-chat');
    const sendButton = dialog.querySelector('.send-button');
    const textarea = dialog.querySelector('textarea');
    const chatContent = dialog.querySelector('.chat-content');
    const memoryButton = dialog.querySelector('.memory-button');
    const memoryOptions = dialog.querySelector('.memory-options');
    const streamModeButton = dialog.querySelector('.stream-mode-button');
    const streamModeOptions = dialog.querySelector('.stream-mode-options');
    const clearChatButton = dialog.querySelector('.clear-chat-button');
    let isStreaming = GM_getValue(`streamMode_${apiUrl}_${model}`, defaultStreamMode);
    let memoryMode = GM_getValue(`memoryMode_${apiUrl}_${model}`, defaultMemoryMode);
    let chatHistory = chatHistories[`${apiUrl}_${model}`] || [];
    function toggleMemoryOptions(show) {
        memoryOptions.style.display = show ? 'block' : 'none';
        streamModeOptions.style.display = 'none';
        if (show) {
            adjustMenuPosition(memoryOptions, memoryButton);
        }
    }
    function toggleStreamModeOptions(show) {
        streamModeOptions.style.display = show ? 'block' : 'none';
        memoryOptions.style.display = 'none';
        if (show) {
            adjustMenuPosition(streamModeOptions, streamModeButton);
        }
    }
    function closeAllMenus() {
        toggleMemoryOptions(false);
        toggleStreamModeOptions(false);
    }
    function updateMemoryOptionsText() {
        dialog.querySelectorAll('.memory-option').forEach(option => {
            let text = option.textContent.replace(' (默认)', '').replace(' ✓', '');
            if (option.dataset.mode === defaultMemoryMode) {
                text += ' (默认)';
            }
            if (option.dataset.mode === memoryMode) {
                text += ' ✓';
            }
            option.textContent = text;
        });
    }
    function updateStreamModeOptionsText() {
        dialog.querySelectorAll('.stream-mode-option').forEach(option => {
            let text = option.textContent.replace(' (默认)', '').replace(' ✓', '');
            if ((option.dataset.mode === 'stream') === defaultStreamMode) {
                text += ' (默认)';
            }
            if ((option.dataset.mode === 'stream') === isStreaming) {
                text += ' ✓';
            }
            option.textContent = text;
        });
    }
    function updateMemoryButtonText() {
        memoryButton.textContent = getMemoryButtonText(memoryMode);
    }
    function updateStreamModeButtonText() {
        streamModeButton.textContent = isStreaming ? '流式模式' : '标准模式';
    }

updateMemoryOptionsText();
    updateStreamModeOptionsText();
    updateMemoryButtonText();
    updateStreamModeButtonText();
    // 初始状态下不展开选项
    toggleMemoryOptions(false);
    toggleStreamModeOptions(false);
    memoryButton.onclick = (e) => {
        e.stopPropagation();
        const isOpen = memoryOptions.style.display === 'block';
        closeAllMenus();
        if (!isOpen) {
            toggleMemoryOptions(true);
            adjustMenuPosition(memoryOptions, memoryButton);
        }
    };
    streamModeButton.onclick = (e) => {
        e.stopPropagation();
        const isOpen = streamModeOptions.style.display === 'block';
        closeAllMenus();
        if (!isOpen) {
            toggleStreamModeOptions(true);
            adjustMenuPosition(streamModeOptions, streamModeButton);
        }
    };
    // 点击任何地方都关闭菜单，除非点击的是按钮或菜单本身
    const closeMenusOnClick = (e) => {
        if (!e.target.closest('.memory-button') && 
            !e.target.closest('.memory-options') && 
            !e.target.closest('.stream-mode-button') && 
            !e.target.closest('.stream-mode-options')) {
            closeAllMenus();
        }
    };
    // 为对话框添加点击事件
    dialog.addEventListener('click', closeMenusOnClick);
    // 为整个文档添加点击事件
    document.addEventListener('click', closeMenusOnClick);
    closeButton.onclick = () => {
        // 移除所有相关的事件监听器
        dialog.removeEventListener('click', closeMenusOnClick);
        document.removeEventListener('click', closeMenusOnClick);
        chatHistories[`${apiUrl}_${model}`] = chatHistory;
        localStorage.setItem(`chatHistory_${apiUrl}_${model}`, JSON.stringify(chatHistory));
        dialog.remove();
    };
    clearChatButton.onclick = () => {
        chatContent.innerHTML = '';
        chatHistory = [];
        chatHistories[`${apiUrl}_${model}`] = [];
        localStorage.removeItem(`chatHistory_${apiUrl}_${model}`);
        updateStreamModeButtonText();
        updateMemoryButtonText();
        updateMemoryOptionsText();
        updateStreamModeOptionsText();
    };
    dialog.querySelectorAll('.memory-option').forEach(option => {
        let clickTimer = null;
        option.onclick = (e) => {
            e.stopPropagation();
            if (clickTimer === null) {
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    // 单击操作
                    memoryMode = option.dataset.mode;
                    GM_setValue(`memoryMode_${apiUrl}_${model}`, memoryMode);
                    updateMemoryButtonText();
                    updateMemoryOptionsText();
                    toggleMemoryOptions(false);
                    
                    if (memoryMode !== 'unlimited') {
                        const maxMemory = parseInt(memoryMode) * 2;
                        if (chatHistory.length > maxMemory) {
                            chatHistory = chatHistory.slice(-maxMemory);
                            chatHistories[`${apiUrl}_${model}`] = chatHistory;
                            localStorage.setItem(`chatHistory_${apiUrl}_${model}`, JSON.stringify(chatHistory));
                        }
                    }
                }, 300);
            } else {
                clearTimeout(clickTimer);
                clickTimer = null;
                // 双击操作
                defaultMemoryMode = option.dataset.mode;
                GM_setValue('defaultMemoryMode', defaultMemoryMode);
                memoryMode = defaultMemoryMode;
                GM_setValue(`memoryMode_${apiUrl}_${model}`, memoryMode);
                updateMemoryButtonText();
                updateMemoryOptionsText();
                toggleMemoryOptions(false);
            }
        };
    });
    dialog.querySelectorAll('.stream-mode-option').forEach(option => {
        let clickTimer = null;
        option.onclick = (e) => {
            e.stopPropagation();
            if (clickTimer === null) {
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    // 单击操作
                    isStreaming = option.dataset.mode === 'stream';
                    GM_setValue(`streamMode_${apiUrl}_${model}`, isStreaming);
                    updateStreamModeButtonText();
                    updateStreamModeOptionsText();
                    toggleStreamModeOptions(false);
                }, 300);
            } else {
                clearTimeout(clickTimer);
                clickTimer = null;
                // 双击操作
                defaultStreamMode = option.dataset.mode === 'stream';
                GM_setValue('defaultStreamMode', defaultStreamMode);
                isStreaming = defaultStreamMode;
                GM_setValue(`streamMode_${apiUrl}_${model}`, isStreaming);
                updateStreamModeButtonText();
                updateStreamModeOptionsText();
                toggleStreamModeOptions(false);
            }
        };
    });
    function getMemoryButtonText(mode) {
        switch (mode) {
            case '0': return '零次记忆';
            case '5': return '5次记忆';
            case '10': return '10次记忆';
            case '20': return '20次记忆';
            case '50': return '50次记忆';
            case '100': return '100次记忆';
            case 'unlimited': return '无限记忆';
            default: return '记忆模式';
        }
    }

async function sendMessage() {
        const message = textarea.value.trim();
        if (!message) return;
        const apiKey = document.getElementById('apiKey').value.trim();
        if (!apiUrl) {
            alert('请先设置 API URL');
            return;
        }
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.textContent = message;
        chatContent.appendChild(userMessageElement);
        chatContent.scrollTop = chatContent.scrollHeight;
        textarea.value = '';
        if (memoryMode === 'unlimited') {
            chatHistory.push({ role: 'user', content: message });
        } else {
            const maxMemory = parseInt(memoryMode) * 2;
            chatHistory.push({ role: 'user', content: message });
            if (chatHistory.length > maxMemory) {
                chatHistory = chatHistory.slice(-maxMemory);
            }
        }
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'message bot-message';
        chatContent.appendChild(botMessageElement);
        const chatUrl = processApiUrl(apiUrl, 'chat');
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: chatUrl,
                    headers: {
                        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        model: model,
                        messages: chatHistory,
                        stream: isStreaming
                    }),
                    onload: (response) => {
                        if (!isStreaming) {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.choices && data.choices[0] && data.choices[0].message) {
                                    const botResponse = data.choices[0].message.content;
                                    botMessageElement.textContent = botResponse;
                                    chatContent.scrollTop = chatContent.scrollHeight;
                                    
                                    if (memoryMode === 'unlimited') {
                                        chatHistory.push({ role: 'assistant', content: botResponse });
                                    } else {
                                        const maxMemory = parseInt(memoryMode) * 2;
                                        chatHistory.push({ role: 'assistant', content: botResponse });
                                        if (chatHistory.length > maxMemory) {
                                            chatHistory = chatHistory.slice(-maxMemory);
                                        }
                                    }
                                    chatHistories[`${apiUrl}_${model}`] = chatHistory;
                                    localStorage.setItem(`chatHistory_${apiUrl}_${model}`, JSON.stringify(chatHistory));
                                }
                            } catch (e) {
                                botMessageElement.textContent = `解析响应失败: ${e.message}`;
                            }
                        }
                        resolve(response);
                    },
                    onerror: reject,
                    onprogress: (event) => {
                        if (isStreaming) {
                            const data = event.responseText.split('\n').filter(line => line.trim() !== '');
                            let botResponse = '';
                            data.forEach(line => {
                                if (line.startsWith('data: ')) {
                                    const jsonData = line.slice(5).trim();
                                    if (jsonData === '[DONE]') {
                                        if (memoryMode === 'unlimited') {
                                            chatHistory.push({ role: 'assistant', content: botResponse });
                                        } else {
                                            const maxMemory = parseInt(memoryMode) * 2;
                                            chatHistory.push({ role: 'assistant', content: botResponse });
                                            if (chatHistory.length > maxMemory) {
                                                chatHistory = chatHistory.slice(-maxMemory);
                                            }
                                        }
                                        chatHistories[`${apiUrl}_${model}`] = chatHistory;
                                        localStorage.setItem(`chatHistory_${apiUrl}_${model}`, JSON.stringify(chatHistory));
                                        return;
                                    }
                                    if (jsonData) {
                                        try {
                                            const parsedData = JSON.parse(jsonData);
                                            if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta && parsedData.choices[0].delta.content) {
                                                botResponse += parsedData.choices[0].delta.content;
                                                botMessageElement.textContent = botResponse;
                                                chatContent.scrollTop = chatContent.scrollHeight;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误，继续处理下一行
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            });
        } catch (error) {
            botMessageElement.textContent = `Error: ${error.message}`;
        }
        chatContent.scrollTop = chatContent.scrollHeight;
    }
    sendButton.onclick = sendMessage;
    textarea.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    dialog.onclick = (e) => {
        e.stopPropagation();
    };
    // 加载历史对话
    const savedHistory = localStorage.getItem(`chatHistory_${apiUrl}_${model}`);
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        chatHistories[`${apiUrl}_${model}`] = chatHistory;
        chatHistory.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`;
            messageElement.textContent = msg.content;
            chatContent.appendChild(messageElement);
        });
        chatContent.scrollTop = chatContent.scrollHeight;
    }
}

async function checkQuota() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const testResults = document.getElementById('testResults');
    
    if (!apiUrl) {
        alert('请输入API地址');
        return;
    }
    
    testResults.innerHTML = '<div class="loader"></div>正在查询额度...';
    
    try {
        const subscriptionUrl = processApiUrl(apiUrl, 'subscription');
        const usageUrl = processApiUrl(apiUrl, 'usage');
        
        // 并行请求订阅信息和使用量
        const [subscriptionResponse, usageResponse] = await Promise.all([
            new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: subscriptionUrl,
                    headers: {
                        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                        'Content-Type': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject
                });
            }),
            new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: usageUrl,
                    headers: {
                        'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                        'Content-Type': 'application/json'
                    },
                    onload: resolve,
                    onerror: reject
                });
            })
        ]);
        const subscriptionData = JSON.parse(subscriptionResponse.responseText);
        const usageData = JSON.parse(usageResponse.responseText);
        
        const totalQuota = subscriptionData.hard_limit_usd || 0;
        const usedQuota = (usageData.total_usage / 100) || 0; // 转换为美元
        const remainingQuota = totalQuota - usedQuota;
        testResults.innerHTML = `
            <div class="quota-summary">
                <div class="quota-card">
                    <div class="quota-title">全部额度</div>
                    <div class="quota-value">$${totalQuota.toFixed(2)}</div>
                </div>
                <div class="quota-card">
                    <div class="quota-title">已用额度</div>
                    <div class="quota-value">$${usedQuota.toFixed(2)}</div>
                </div>
                <div class="quota-card">
                    <div class="quota-title">剩余额度</div>
                    <div class="quota-value">$${remainingQuota.toFixed(2)}</div>
                </div>
            </div>
        `;
    } catch (error) {
        testResults.innerHTML = `<div class="error">查询额度失败: ${error.message}</div>`;
    }
}
async function fetchModels() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const modelList = document.getElementById('modelList');
    const testModelsButton = document.getElementById('testModelsButton');
    
    if (!apiUrl) {
        alert('请输入API地址');
        return;
    }
    // 清除之前的所有模型
    allModels = [];
    selectedModelSet.clear();
    availableModels.clear();
    
    const modelsUrl = processApiUrl(apiUrl, 'models');
    modelList.innerHTML = '<div class="loader"></div>正在获取模型列表...';
    
    try {
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: modelsUrl,
                headers: {
                    'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error('解析响应数据失败'));
                        }
                    } else {
                        reject(new Error(`HTTP错误: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                }
            });
        });
        
        allModels = response.data || [];
        if (allModels.length === 0) {
            modelList.innerHTML = '<div class="error">未找到可用模型</div>';
            return;
        }
        
        allModels.sort((a, b) => a.id.localeCompare(b.id));
        
        document.getElementById('searchBox').style.display = 'block';
        document.querySelector('.search-refresh-container').style.display = 'block';
        renderModels(allModels);
        testModelsButton.style.display = 'block';
        setupSearchHandlers();
        setupCopyFunctions();
    } catch (error) {
        modelList.innerHTML = `<div class="error">获取模型列表失败: ${error.message}</div>`;
        allModels = [];
        selectedModelSet.clear();
        availableModels.clear();
    }
}

async function testModels() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiUrl) {
        alert('请输入API地址');
        return;
    }
    if (selectedModelSet.size === 0) {
        alert('请选择要测试的模型');
        return;
    }
    const testMessage = "Hello";
    const chatUrl = processApiUrl(apiUrl, 'chat');
    
    availableModels.clear();
    const testPromises = Array.from(selectedModelSet).map(async model => {
        const modelElement = document.querySelector(`.selected-model-item[data-model="${model}"]`);
        if (!modelElement) return;
        const resultIcon = modelElement.querySelector('.result-icon');
        resultIcon.innerHTML = '<div class="circular-progress"></div>';
        try {
            const response = await Promise.race([
                new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: chatUrl,
                        headers: {
                            'Authorization': apiKey ? `Bearer ${apiKey}` : '',
                            'Content-Type': 'application/json',
                            'Accept': 'text/event-stream' 
                        },
                        data: JSON.stringify({
                            model: model,
                            messages: [{ role: "user", content: testMessage }],
                        }),
                        onload: resolve,
                        onerror: reject
                    });
                }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('请求超时')), 8000)
                )
            ]);
            if (response.status === 200) {
                try {
                    JSON.parse(response.responseText);
                    resultIcon.innerHTML = '✅';
                    modelElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    availableModels.add(model);
                } catch (e) {
                    resultIcon.innerHTML = '❌';
                    modelElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                }
            } else {
                resultIcon.innerHTML = '❌';
                modelElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            }
        } catch (error) {
            resultIcon.innerHTML = error.message === '请求超时' ? '⏱️' : '❌';
            modelElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        }
    });
    await Promise.all(testPromises);
}
function renderModels(models, isSearchResult = false) {
    const modelList = document.getElementById('modelList');
    
    // 如果在搜索模式且不是搜索结果渲染请求
    if (isInSearchMode && !isSearchResult) {
        // 重新执行搜索
        const filteredModels = models.filter(model => 
            model.id.toLowerCase().includes(lastSearchTerm)
        );
        models = filteredModels;
    }
    
    // 将选中的模型放在前面
    const selectedModels = models.filter(model => selectedModelSet.has(model.id));
    const unselectedModels = models.filter(model => !selectedModelSet.has(model.id));
    
    const sortedModels = [...selectedModels, ...unselectedModels];
    
    const uniqueModels = Array.from(new Set(sortedModels.map(model => model.id)))
        .map(id => ({ id }));
    
    const fragment = document.createDocumentFragment();
    
    uniqueModels.forEach(model => {
        const div = document.createElement('div');
        div.className = 'model-item';
        div.dataset.model = model.id;
        div.innerHTML = `
            <input type="checkbox" class="model-checkbox" value="${model.id}"
                ${selectedModelSet.has(model.id) ? 'checked' : ''}>
            <span>${model.id}</span>
        `;
        
        const checkbox = div.querySelector('.model-checkbox');
        let clickTimer = null;
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止事件冒泡到 div
        });
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedModelSet.add(e.target.value);
            } else {
                selectedModelSet.delete(e.target.value);
            }
            updateSelectedModelsDisplay();
            updateSelectAllCheckbox();
            if (isSearchResult) {
                renderModels(models, true); // 如果是搜索结果，保持在当前搜索结果页面
            } else {
                renderModels(allModels); // 如果不是搜索结果，重新渲染所有模型
            }
        });
        
        div.addEventListener('click', (e) => {
            if (clickTimer !== null) {
                clearTimeout(clickTimer);
                clickTimer = null;
                // 双击事件处理
                const apiUrl = document.getElementById('apiUrl').value.trim();
                if (typeof createChatDialog === 'function') {
                    createChatDialog(model.id, apiUrl);
                }
            } else {
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                    // 单击事件处理
                    checkbox.click(); // 触发 checkbox 的点击事件
                }, 300); // 300毫秒的延迟来区分单击和双击
            }
        });
        
        fragment.appendChild(div);
    });
    
    modelList.innerHTML = '';
    modelList.appendChild(fragment);
    
    updateSelectedModelsDisplay();
}

function updateSelectedModelsDisplay() {
    const selectedModelsContainer = document.getElementById('selectedModels');
    const selectedModelsList = selectedModelsContainer.querySelector('.selected-models-list');
    
    if (selectedModelSet.size > 0) {
        selectedModelsContainer.style.display = 'block';
        const sortedSelectedModels = Array.from(selectedModelSet).sort((a, b) => a.localeCompare(b));
        
        // 使用 DocumentFragment 来减少 DOM 操作
        const fragment = document.createDocumentFragment();
        
        sortedSelectedModels.forEach(model => {
            const div = document.createElement('div');
            div.className = 'selected-model-item';
            div.dataset.model = model;
            div.innerHTML = `
                <span>${model}</span>
                <span class="result-icon"></span>
            `;
            
            let clickTimer = null;
            div.addEventListener('click', (e) => {
                if (clickTimer !== null) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    // 双击事件处理
                    const apiUrl = document.getElementById('apiUrl').value.trim();
                    if (typeof createChatDialog === 'function') {
                        createChatDialog(model, apiUrl);
                    }
                } else {
                    clickTimer = setTimeout(() => {
                        clickTimer = null;
                        // 单击事件处理
                        selectedModelSet.delete(model);
                        const checkbox = document.querySelector(`.model-checkbox[value="${model}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                        }
                        updateSelectedModelsDisplay();
                        updateSelectAllCheckbox();
                        renderModels(allModels);
                    }, 300);
                }
            });
            
            fragment.appendChild(div);
        });
        
        selectedModelsList.innerHTML = '';
        selectedModelsList.appendChild(fragment);
    } else {
        selectedModelsContainer.style.display = 'none';
    }
}
function addCustomModels() {
    const customModelsInput = document.getElementById('customModels');
    const models = customModelsInput.value.split(/[,，]/)
        .map(model => model.trim())
        .filter(model => model);
            
    if (models.length === 0) {
        alert('请输入至少一个模型名称');
        return;
    }
    // 记住当前选中状态
    const previouslySelected = new Set(selectedModelSet);
    // 添加新的自定义模型到现有模型列表
    const customModels = models.map(id => ({ id }));
    // 合并现有模型和新添加的模型，而不是清除现有模型
    allModels = [...allModels, ...customModels];
    // 去重，避免重复模型
    allModels = Array.from(new Set(allModels.map(model => model.id)))
        .map(id => ({ id }));
    // 恢复之前的选中状态，并添加新模型到选中集合
    selectedModelSet = new Set([...previouslySelected, ...models]);
    
    document.getElementById('searchBox').style.display = 'block';
    document.querySelector('.search-refresh-container').style.display = 'block';
    document.getElementById('testModelsButton').style.display = 'block';
    document.getElementById('selectedModels').style.display = 'block';
    
    renderModels(allModels);
    updateSelectedModelsDisplay();
    updateSelectAllCheckbox();
    setupSearchHandlers();
    setupCopyFunctions();
    customModelsInput.value = '';
}
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAllModels');
    const allCheckboxes = document.querySelectorAll('.model-checkbox');
    selectAllCheckbox.checked = allCheckboxes.length > 0 && 
        Array.from(allCheckboxes).every(cb => cb.checked);
}
function setupSelectAllHandler() {
    const selectAllCheckbox = document.getElementById('selectAllModels');
    
    selectAllCheckbox.addEventListener('change', (e) => {
        const modelList = document.getElementById('modelList');
        const checkboxes = modelList.querySelectorAll('.model-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
            if (e.target.checked) {
                selectedModelSet.add(checkbox.value);
            } else {
                selectedModelSet.delete(checkbox.value);
            }
        });
        
        updateSelectedModelsDisplay();
        renderModels(allModels);
    });
}
function setupSearchHandlers() {
    const searchInput = document.getElementById('modelSearch');
    const searchButton = document.getElementById('searchButton');
    const resetButton = document.getElementById('resetSearch');
    
    searchButton.addEventListener('click', performSearch);
    
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        lastSearchTerm = '';
        isInSearchMode = false;
        renderModels(allModels);
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}
function performSearch() {
    const searchInput = document.getElementById('modelSearch');
    const searchTerm = searchInput.value.toLowerCase();
    lastSearchTerm = searchTerm;
    isInSearchMode = true;
    
    if (allModels && allModels.length > 0) {
        const filteredModels = allModels.filter(model => 
            model.id.toLowerCase().includes(searchTerm)
        );
        renderModels(filteredModels, true);
    }
}

// 拖拽相关函数
function dragStart(e) {
    if (e.type === "touchstart") {
        const touch = e.touches[0];
        initialX = touch.clientX;
        initialY = touch.clientY;
        const rect = floatingButton.getBoundingClientRect();
        xOffset = rect.left;
        yOffset = rect.top;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    if (e.target === floatingButton) {
        isDragging = true;
        floatingButton.style.transition = 'none';
    }
    clearTimeout(hideTimeout);
}
function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const rect = floatingButton.getBoundingClientRect();
    lastPosition = { 
        x: rect.left,
        y: rect.top
    };
    
    floatingButton.style.transition = 'all 0.3s ease';
    hideTimeout = setTimeout(() => {
        const windowWidth = window.innerWidth;
        if (rect.left < windowWidth / 2) {
            floatingButton.style.left = '-25px';
        } else {
            floatingButton.style.right = '-25px';
            floatingButton.style.left = 'auto';
        }
    }, 2000);
}
function drag(e) {
    if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        let currentX, currentY;
        if (e.type === "touchmove") {
            const touch = e.touches[0];
            currentX = xOffset + (touch.clientX - initialX);
            currentY = yOffset + (touch.clientY - initialY);
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        const maxX = window.innerWidth - floatingButton.offsetWidth;
        const maxY = window.innerHeight - floatingButton.offsetHeight;
        currentX = Math.min(Math.max(0, currentX), maxX);
        currentY = Math.min(Math.max(0, currentY), maxY);
        floatingButton.style.left = `${currentX}px`;
        floatingButton.style.top = `${currentY}px`;
    }
}
// 事件监听器设置
document.addEventListener('mousemove', drag, { passive: false });
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchmove', drag, { passive: false });
document.addEventListener('touchend', dragEnd);
floatingButton.addEventListener('mousedown', dragStart);
floatingButton.addEventListener('touchstart', dragStart, { passive: false });
floatingButton.addEventListener('touchmove', function(e) {
    if (isDragging) {
        e.preventDefault();
    }
}, { passive: false });
floatingButton.addEventListener('click', function(e) {
    if (!isDragging) {
        const rect = floatingButton.getBoundingClientRect();
        if (rect.right < 0 || rect.left > window.innerWidth) {
            if (rect.right < 0) {
                floatingButton.style.left = '0';
                floatingButton.style.right = 'auto';
            } else {
                floatingButton.style.right = '0';
                floatingButton.style.left = 'auto';
            }
        }
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
});
// 按钮事件监听
document.getElementById('fetchModelsButton').addEventListener('click', fetchModels);
document.getElementById('checkQuotaButton').addEventListener('click', checkQuota);
document.getElementById('testModelsButton').addEventListener('click', testModels);
document.getElementById('addCustomModels').addEventListener('click', addCustomModels);
setupSelectAllHandler();
document.getElementById('closePanel').addEventListener('click', function() {
    container.style.display = 'none';
});
// 刷新按钮事件
document.getElementById('refreshPanel').addEventListener('click', function() {
    document.getElementById('apiUrl').value = '';
    document.getElementById('apiKey').value = '';
    document.getElementById('customModels').value = '';
    document.getElementById('modelSearch').value = '';
    
    allModels = [];
    selectedModelSet.clear();
    availableModels.clear();
    
    document.getElementById('searchBox').style.display = 'none';
    document.querySelector('.search-refresh-container').style.display = 'none';
    document.getElementById('modelList').innerHTML = '';
    document.getElementById('selectedModels').style.display = 'none';
    document.getElementById('testModelsButton').style.display = 'none';
    document.getElementById('testResults').innerHTML = '';
    
    setupSearchHandlers();
    setupCopyFunctions();
});
// 保存和恢复位置
window.addEventListener('beforeunload', function() {
    localStorage.setItem('floatingButtonPosition', JSON.stringify({
        x: xOffset,
        y: yOffset
    }));
});
const savedPosition = localStorage.getItem('floatingButtonPosition');
if (savedPosition) {
    const position = JSON.parse(savedPosition);
    xOffset = position.x;
    yOffset = position.y;
    setTranslate(xOffset, yOffset, floatingButton);
}
function setTranslate(xPos, yPos, el) {
    el.style.left = xPos + 'px';
    el.style.top = yPos + 'px';
}
// 初始化默认值
if (!GM_getValue('defaultMemoryMode')) {
    GM_setValue('defaultMemoryMode', '0');
}
if (GM_getValue('defaultStreamMode') === undefined) {
    GM_setValue('defaultStreamMode', false);
}
})();
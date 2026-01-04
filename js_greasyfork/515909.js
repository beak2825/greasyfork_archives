// ==UserScript==
// @name         AI网页内容总结
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用AI总结网页内容的油猴脚本
// @author       bizhanrensheng
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js
// @license MIT
// @homepageURL  https://xr.imyaigc.com
// @downloadURL https://update.greasyfork.org/scripts/515909/AI%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/515909/AI%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
   // Replace DEFAULT_CONFIG with the new API settings
const DEFAULT_CONFIG = {
    API_URL: 'https://api.x.ai/v1/chat/completions',
    API_KEY: 'xai-bizhan(这里用你注册获得的API）',
    MAX_TOKENS: 10000,
    SHORTCUT: 'Alt+S',
    PROMPT: 'Please summarize the following webpage content in Markdown format, covering main points, key information, and details. Make it thorough, accurate, and organized.',
    MODEL: 'grok-beta'
};

// Then, update the `summarizeContent` function to match the API format you need
async function summarizeContent(content) {
    return new Promise(async (resolve, reject) => {
        const contentContainer = document.querySelector('.ai-summary-content');
        contentContainer.innerHTML = '<div class="ai-loading">Generating summary<span class="ai-loading-dots"></span></div>';

        let summary = '';
        const md = createMarkdownRenderer();

        // Set a timeout to handle potential request delays
        const timeout = setTimeout(() => {
            reject(new Error('Request timed out. Please check API URL, API Key, and network connection.'));
        }, 20000);

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.API_KEY}`
                },
                body: JSON.stringify({
                    model: CONFIG.MODEL,
                    messages: [
                        { role: 'system', content: CONFIG.PROMPT },
                        { role: 'user', content: content }
                    ],
                    max_tokens: CONFIG.MAX_TOKENS,
                    temperature: 0,
                    stream: false
                })
            });

            // Check if the response is OK
            if (!response.ok) {
                clearTimeout(timeout);
                throw new Error(`API request failed (${response.status}): Please check API URL and Key`);
            }

            const result = await response.json();
            clearTimeout(timeout);

            if (result && result.choices && result.choices[0] && result.choices[0].message) {
                summary = result.choices[0].message.content;
                contentContainer.innerHTML = md.render(summary);
                resolve(summary);
            } else {
                throw new Error("Unexpected API response format.");
            }

        } catch (error) {
            clearTimeout(timeout);
            reject(error);
        }
    });
}


    // 获取配置
    let CONFIG = {};
    function loadConfig() {
        CONFIG = {
            API_URL: GM_getValue('API_URL', DEFAULT_CONFIG.API_URL),
            API_KEY: GM_getValue('API_KEY', DEFAULT_CONFIG.API_KEY),
            MAX_TOKENS: GM_getValue('MAX_TOKENS', DEFAULT_CONFIG.MAX_TOKENS),
            SHORTCUT: GM_getValue('SHORTCUT', DEFAULT_CONFIG.SHORTCUT),
            PROMPT: GM_getValue('PROMPT', DEFAULT_CONFIG.PROMPT),
            MODEL: GM_getValue('MODEL', DEFAULT_CONFIG.MODEL)
        };
        return CONFIG;
    }

    // 保存配置
    function saveConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            GM_setValue(key, newConfig[key]);
        });
        CONFIG = { ...CONFIG, ...newConfig };
    }

    // 添加样式
    GM_addStyle(` #ai-summary-root .ai-summary-container{position:fixed;bottom:20px;right:20px;display:flex;align-items:center;z-index:99998;user-select:none;align-items:stretch;box-shadow:0 2px 5px rgba(0,0,0,.2);height:30px}#ai-summary-root .ai-settings-panel,#ai-summary-root .ai-summary-modal{position:fixed;transform:translate(-50%,-50%);box-shadow:0 4px 20px rgba(0,0,0,.15)}#ai-summary-root .ai-summary-container .ai-drag-handle{width:15px;height:100%;background-color:rgba(75,85,99,.8);border-radius:5px 0 0 5px;cursor:move;margin-right:1px;display:flex;align-items:center;justify-content:center}#ai-summary-root .ai-summary-container .ai-drag-handle::before{content:"⋮";color:#f3f4f6;font-size:16px;transform:rotate(90deg)}#ai-summary-root .ai-summary-container .ai-summary-btn{padding:5px 15px;background-color:rgba(75,85,99,.8);color:#f3f4f6;border:none;border-radius:0 4px 4px 0;cursor:pointer;font-size:12px;transition:.3s;height:100%;line-height:1;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}#ai-summary-root .ai-summary-container .ai-summary-btn:hover{background-color:rgba(75,85,99,.9)}#ai-summary-root .ai-summary-modal{display:none;top:50%;left:50%;width:80%;max-width:800px;max-height:80vh;background:#f8f9fa;border-radius:8px;z-index:99999;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}#ai-summary-root .ai-summary-modal *{box-sizing:border-box}#ai-summary-root .ai-summary-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:99998}#ai-summary-root .ai-summary-modal .ai-summary-header{padding:15px 20px;background:#f1f3f5;border-bottom:1px solid #dee2e6;display:flex;justify-content:space-between;align-items:center}#ai-summary-root .ai-summary-modal .ai-summary-header h3{color:#495057;margin:0;padding:0;font-size:16px;font-weight:600;line-height:1.4;font-family:inherit}#ai-summary-root .ai-summary-modal .ai-summary-close{background:0 0;border:none;font-size:20px;cursor:pointer;color:#6c757d;padding:0 5px;line-height:1;font-family:inherit}#ai-summary-root .ai-summary-modal .ai-summary-close:hover{color:#495057}#ai-summary-root .ai-summary-modal .ai-summary-content{padding:20px;overflow-y:auto;max-height:calc(80vh - 130px);line-height:1.6;color:#374151;font-size:15px;font-family:inherit}#ai-summary-root .ai-summary-modal .ai-summary-content h1{font-size:1.8em;margin:1.5em 0 .8em;padding-bottom:.3em;border-bottom:2px solid #e5e7eb;font-weight:600;line-height:1.3;color:#1f2937}#ai-summary-root .ai-summary-modal .ai-summary-content h2{font-size:1.5em;margin:1.3em 0 .7em;padding-bottom:.2em;border-bottom:1px solid #e5e7eb;font-weight:600;line-height:1.3;color:#1f2937}#ai-summary-root .ai-summary-modal .ai-summary-content h3{font-size:1.3em;margin:1.2em 0 .6em;font-weight:600;line-height:1.3;color:#1f2937}#ai-summary-root .ai-summary-modal .ai-summary-content p{margin:1em 0;line-height:1.8;color:inherit}#ai-summary-root .ai-summary-modal .ai-summary-content ol,#ai-summary-root .ai-summary-modal .ai-summary-content ul{margin:1em 0;padding-left:2em;line-height:1.6}#ai-summary-root .ai-summary-modal .ai-summary-content li{margin:.5em 0;line-height:inherit;color:inherit}#ai-summary-root .ai-summary-modal .ai-summary-content blockquote{margin:1em 0;padding:.5em 1em;border-left:4px solid #60a5fa;background:#f3f4f6;color:#4b5563;font-style:normal}#ai-summary-root .ai-summary-modal .ai-summary-content code{background:#f3f4f6;padding:.2em .4em;border-radius:3px;font-family:Consolas,Monaco,"Courier New",monospace;font-size:.9em;color:#d946ef;white-space:pre-wrap}#ai-summary-root .ai-summary-modal .ai-summary-content pre{background:#1f2937;color:#e5e7eb;padding:1em;border-radius:6px;overflow-x:auto;margin:1em 0;white-space:pre;word-wrap:normal}#ai-summary-root .ai-summary-modal .ai-summary-content pre code{background:0 0;color:inherit;padding:0;border-radius:0;font-size:inherit;white-space:pre}#ai-summary-root .ai-summary-modal .ai-summary-content table{border-collapse:collapse;width:100%;margin:1em 0;font-size:inherit}#ai-summary-root .ai-summary-modal .ai-summary-content td,#ai-summary-root .ai-summary-modal .ai-summary-content th{border:1px solid #d1d5db;padding:.5em;text-align:left;color:inherit;background:0 0}#ai-summary-root .ai-summary-modal .ai-summary-content th{background:#f9fafb;font-weight:600}#ai-summary-root .ai-summary-modal .ai-summary-footer{padding:15px 20px;border-top:1px solid #dee2e6;display:flex;justify-content:flex-end;gap:10px;background:#f8f9fa}#ai-summary-root .ai-settings-btn,#ai-summary-root .ai-summary-modal .ai-retry-btn{padding:8px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background .3s;width:36px;height:36px;min-width:36px;line-height:1}#ai-summary-root .ai-settings-btn:hover,#ai-summary-root .ai-settings-panel .cancel-btn:hover,#ai-summary-root .ai-settings-panel .save-btn:hover,#ai-summary-root .ai-summary-modal .ai-copy-btn:hover,#ai-summary-root .ai-summary-modal .ai-retry-btn:hover{background:#5a6268}#ai-summary-root .ai-summary-modal .ai-retry-btn svg{width:20px;height:20px}#ai-summary-root .ai-summary-modal .ai-copy-btn{padding:8px 16px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:background .3s;font-size:14px;line-height:1;font-family:inherit}#ai-summary-root .ai-summary-modal .ai-loading{text-align:center;padding:20px;color:#6c757d;font-family:inherit}#ai-summary-root .ai-summary-modal .ai-loading-dots:after{content:'.';animation:1.5s steps(5,end) infinite dots}@keyframes dots{0%,20%{content:'.'}40%{content:'..'}60%{content:'...'}100%,80%{content:''}}#ai-summary-root .ai-settings-panel{display:none;top:50%;left:50%;width:90%;max-width:500px;background:#fff;padding:20px;border-radius:8px;z-index:100000}#ai-summary-root .ai-settings-panel textarea{resize:vertical;max-width:100%;height:100px;resize:vertical}#ai-summary-root .ai-settings-panel h3{margin:0 0 20px;padding-bottom:10px;border-bottom:1px solid #dee2e6;color:#495057;font-size:18px}#ai-summary-root .ai-settings-panel .form-group{margin-bottom:15px}#ai-summary-root .ai-settings-panel label{display:block;margin-bottom:5px;color:#495057;font-weight:500}#ai-summary-root .ai-settings-panel input,#ai-summary-root .ai-settings-panel textarea{max-width:100%;box-sizing:border-box;width:100%;padding:8px 12px;border:1px solid #ced4da;border-radius:4px;font-size:14px;line-height:1.5}#ai-summary-root .ai-settings-panel button{padding:8px 16px;border:none;border-radius:4px;cursor:pointer;font-size:14px;transition:.3s}#ai-summary-root .ai-settings-panel .cancel-btn,#ai-summary-root .ai-settings-panel .save-btn{background:#6c757d;color:#fff}#ai-summary-root .ai-settings-panel .clear-cache-btn{padding:8px 16px;background:#dc3545;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;transition:.3s;margin-right:auto}#ai-summary-root .ai-settings-panel .clear-cache-btn:hover{background:#c82333}#ai-summary-root .ai-settings-panel .buttons{display:flex;justify-content:flex-end;gap:10px;margin-top:20px} `);

    // 创建设置面板
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'ai-settings-panel';
        panel.innerHTML = `
            <h3>设置</h3>
            <div class="form-group">
                <label for="api-url">API URL</label>
                <input type="text" id="api-url" value="${CONFIG.API_URL}">
            </div>
            <div class="form-group">
                <label for="api-key">API Key</label>
                <input type="text" id="api-key" value="${CONFIG.API_KEY}">
            </div>
            <div class="form-group">
                <label for="model">模型</label>
                <input type="text" id="model" value="${CONFIG.MODEL}">
            </div>
            <div class="form-group">
                <label for="max-tokens">最大Token数</label>
                <input type="number" id="max-tokens" value="${CONFIG.MAX_TOKENS}">
            </div>
            <div class="form-group">
                <label for="shortcut">快捷键</label>
                <input type="text" id="shortcut" value="${CONFIG.SHORTCUT}">
            </div>
            <div class="form-group">
                <label for="prompt">总结提示词</label>
                <textarea id="prompt">${CONFIG.PROMPT}</textarea>
            </div>
            <div class="buttons">
                <button class="clear-cache-btn">清除缓存</button>
                <button class="cancel-btn">取消</button>
                <button class="save-btn">保存</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'ai-summary-overlay';

        // 事件监听
        panel.querySelector('.save-btn').addEventListener('click', () => {
            const newConfig = {
                API_URL: panel.querySelector('#api-url').value,
                API_KEY: panel.querySelector('#api-key').value,
                MAX_TOKENS: parseInt(panel.querySelector('#max-tokens').value),
                SHORTCUT: panel.querySelector('#shortcut').value,
                PROMPT: panel.querySelector('#prompt').value,
                MODEL: panel.querySelector('#model').value
            };
            saveConfig(newConfig);
            panel.style.display = 'none';
            document.querySelector('.ai-summary-overlay').style.display = 'none';
        });

        panel.querySelector('.cancel-btn').addEventListener('click', () => {
            panel.style.display = 'none';
            document.querySelector('.ai-summary-overlay').style.display = 'none';
        });

        // 清除缓存按钮事件
        panel.querySelector('.clear-cache-btn').addEventListener('click', () => {
            const keys = ['API_URL', 'API_KEY', 'MAX_TOKENS', 'SHORTCUT', 'PROMPT', 'MODEL'];
            keys.forEach(key => GM_setValue(key, undefined)); // 设置为undefined模拟删除

            // 重置为默认配置
            CONFIG = { ...DEFAULT_CONFIG };

            // 更新输入框的值
            panel.querySelector('#api-url').value = CONFIG.API_URL;
            panel.querySelector('#api-key').value = CONFIG.API_KEY;
            panel.querySelector('#max-tokens').value = CONFIG.MAX_TOKENS;
            panel.querySelector('#shortcut').value = CONFIG.SHORTCUT;
            panel.querySelector('#prompt').value = CONFIG.PROMPT;
            panel.querySelector('#model').value = CONFIG.MODEL;

            alert('缓存已清除，已恢复默认设置');
        });

        return panel;
    }

    // 创建DOM元素
    function createElements() {
        // 创建根容器，并添加唯一ID
        const rootContainer = document.createElement('div');
        rootContainer.id = 'ai-summary-root';

        // 创建容器和拖动把手
        const container = document.createElement('div');
        container.className = 'ai-summary-container';

        const dragHandle = document.createElement('div');
        dragHandle.className = 'ai-drag-handle';

        const button = document.createElement('button');
        button.className = 'ai-summary-btn';
        button.textContent = '总结网页';

        // 在footer中添加设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'ai-settings-btn';
        settingsBtn.title = '设置';
        settingsBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        `;

        container.appendChild(dragHandle);
        container.appendChild(button);
        document.body.appendChild(container);

        // 创建模态框和遮罩层
        const modal = document.createElement('div');
        modal.className = 'ai-summary-modal';
        modal.innerHTML = `
            <div class="ai-summary-header">
                <h3 style="margin: 0;">网页内容总结</h3>
                <button class="ai-summary-close">×</button>
            </div>
            <div class="ai-summary-content"></div>
            <div class="ai-summary-footer">
                <button class="ai-retry-btn" title="重新生成">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-2.3-6M21 3v6h-6"></path>
                    </svg>
                </button>
                <button class="ai-copy-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    复制内容
                </button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'ai-summary-overlay';

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        modal.querySelector('.ai-summary-footer').insertBefore(
            settingsBtn,
            modal.querySelector('.ai-retry-btn')
        );

        const settingsPanel = createSettingsPanel();

        // 将容器添加到根容器
        rootContainer.appendChild(container);
        rootContainer.appendChild(overlay);
        rootContainer.appendChild(modal);
        rootContainer.appendChild(settingsPanel);

        document.body.appendChild(rootContainer); // 将根容器添加到body

        return { container, button, modal, overlay, dragHandle, settingsBtn, settingsPanel, rootContainer };
    }


    // 获取网页内容
    function getPageContent() {
        const title = document.title;
        const content = document.body.innerText;
        return { title, content };
    }

    // 显示错误信息
    function showError(container, error, details = '') {
        container.innerHTML = `
            <div class="ai-summary-error">
                <strong>错误：</strong> ${error}
            </div>
            ${details ? `<div class="ai-summary-debug">${details}</div>` : ''}
        `;
    }

    // 调用API进行总结
    async function summarizeContent(content) {
        return new Promise(async (resolve, reject) => {
            const contentContainer = document.querySelector('.ai-summary-content');
            contentContainer.innerHTML = '<div class="ai-loading">正在生成总结<span class="ai-loading-dots"></span></div>';

            let summary = '';
            const md = createMarkdownRenderer();

            // 添加超时检查
            const timeout = setTimeout(() => {
                reject(new Error('请求超时，请检查API URL、API Key和网络连接'));
            }, 20000);

            try {
                const response = await fetch(CONFIG.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.API_KEY}`
                    },
                    body: JSON.stringify({
                        model: CONFIG.MODEL,
                        messages: [
                            { role: 'system', content: CONFIG.PROMPT },
                            { role: 'user', content: content }
                        ],
                        max_tokens: CONFIG.MAX_TOKENS,
                        temperature: 0.7,
                        stream: true
                    })
                });

                // 检查响应状态
                if (!response.ok) {
                    clearTimeout(timeout);
                    throw new Error(`API请求失败 (${response.status}): 请检查API URL和Key是否正确`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.trim() === '' || line.trim() === 'data: [DONE]') continue;

                        const jsonLine = line.replace(/^data: /, '');
                        try {
                            const parsedData = JSON.parse(jsonLine);
                            if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta) {
                                if (parsedData.choices[0].delta.content) {
                                    summary += parsedData.choices[0].delta.content;
                                    contentContainer.innerHTML = md.render(summary);
                                }
                            }
                        } catch (e) {
                            console.warn('忽略无法解析的行:', line);
                            continue;
                        }
                    }
                }

                clearTimeout(timeout);
                resolve(summary);

            } catch (error) {
                clearTimeout(timeout);
                reject(error);
            }
        });
    }

    // 初始化拖动功能
    function initializeDrag(container, dragHandle) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - container.offsetLeft;
            initialY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // 确保不会拖出屏幕
                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;
                currentX = Math.max(0, Math.min(currentX, maxX));
                currentY = Math.max(0, Math.min(currentY, maxY));

                container.style.left = currentX + 'px';
                container.style.top = currentY + 'px';
                container.style.right = 'auto';
                container.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 初始化事件监听
    function initializeEvents(elements) {
        const { container, button, modal, overlay, dragHandle, settingsBtn, settingsPanel, rootContainer } = elements;

        // 初始化拖动功能
        initializeDrag(container, dragHandle);

        // 点击按钮显示模态框
        button.addEventListener('click', async () => {
            // 检查是否是第一次点击且未配置API
            if (!CONFIG.API_KEY || CONFIG.API_KEY === '' || CONFIG.API_KEY === 'YOUR_API_KEY') {
                settingsPanel.style.display = 'block';
                overlay.style.display = 'block';
                return;
            }

            showModal(modal, overlay);
            const contentContainer = modal.querySelector('.ai-summary-content');

            try {
                if (!CONFIG.API_URL || CONFIG.API_URL === 'YOUR_API_URL') {
                    throw new Error('请先配置API URL');
                }
                if (!CONFIG.API_KEY || CONFIG.API_KEY === 'YOUR_API_KEY') {
                    throw new Error('请先配置API Key');
                }

                const { content } = getPageContent();
                const summary = await summarizeContent(content);
                if (summary) {
                    contentContainer.innerHTML = window.markdownit().render(summary);
                }
            } catch (error) {
                console.error('Summary Error:', error);
                showError(contentContainer, error.message);
            }
        });

        // 关闭模态框
        modal.querySelector('.ai-summary-close').addEventListener('click', () => {
            hideModal(modal, overlay);
        });

        overlay.addEventListener('click', () => {
            hideModal(modal, overlay);
            settingsPanel.style.display = 'none';
        });

        // 复制按钮功能
        modal.querySelector('.ai-copy-btn').addEventListener('click', () => {
            const content = modal.querySelector('.ai-summary-content').textContent;
            navigator.clipboard.writeText(content).then(() => {
                const copyBtn = modal.querySelector('.ai-copy-btn');
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '已复制！';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            });
        });

        // 添加快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key.toLowerCase() === 's') {
                button.click();
            }
            if (e.key === 'Escape' && modal.style.display === 'block') {
                hideModal(modal, overlay);
            }
        });

        // 添加重试按钮事件处理
        modal.querySelector('.ai-retry-btn').addEventListener('click', async () => {
            const contentContainer = modal.querySelector('.ai-summary-content');
            try {
                const { content } = getPageContent();
                const summary = await summarizeContent(content);
                if (summary) {
                    const md = window.markdownit({
                        html: true,
                        linkify: true,
                        typographer: true,
                        breaks: true
                    });
                    contentContainer.innerHTML = md.render(summary);
                }
            } catch (error) {
                console.error('Retry Error:', error);
                showError(contentContainer, error.message);
            }
        });

        const allSettingsButtons = rootContainer.querySelectorAll('.ai-settings-btn');
        allSettingsButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // 更新设置面板中的值
                settingsPanel.querySelector('#api-url').value = CONFIG.API_URL;
                settingsPanel.querySelector('#api-key').value = CONFIG.API_KEY;
                settingsPanel.querySelector('#max-tokens').value = CONFIG.MAX_TOKENS;
                settingsPanel.querySelector('#shortcut').value = CONFIG.SHORTCUT;
                settingsPanel.querySelector('#prompt').value = CONFIG.PROMPT;
                settingsPanel.querySelector('#model').value = CONFIG.MODEL;

                settingsPanel.style.display = 'block';
                overlay.style.display = 'block';
            });
        });
    }

    // 增强markdown-it配置
    function createMarkdownRenderer() {
        return window.markdownit({
            html: true,
            linkify: true,
            typographer: true,
            breaks: true
        });
    }

    // 显示模态框
    function showModal(modal, overlay) {
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // 隐藏模态框
    function hideModal(modal, overlay) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }

    // 初始化时加载配置
    loadConfig();

    // 初始化脚本
    const elements = createElements();
    initializeEvents(elements);
})();
// ==UserScript==
// @name         Universal DeepSeek Text Selection
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  通用型选中文本翻译/解释工具，支持复杂动态网页
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.deepseek.com
// @connect      api.deepseek.ai
// @connect      *
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523257/Universal%20DeepSeek%20Text%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/523257/Universal%20DeepSeek%20Text%20Selection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        API_KEY: '',
        API_URL: 'https://api.deepseek.com/v1/chat/completions',
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        RETRY_BACKOFF_FACTOR: 1.5,
        DEBOUNCE_DELAY: 200,
        SHORTCUTS: {
            translate: 'Alt+T',
            explain: 'Alt+E',
            summarize: 'Alt+S'
        },
        MAX_TEXT_LENGTH: 5000,
        MIN_TEXT_LENGTH: 1,
        ERROR_DISPLAY_TIME: 3000,
        ANIMATION_DURATION: 200,
        MENU_FADE_DELAY: 150,
        CACHE_DURATION: 3600000, // 1小时
        MAX_CACHE_ITEMS: 50,
        LOADING_MESSAGES: [
            '正在思考中...',
            '处理中，请稍候...',
            '马上就好...',
            '正在分析文本...'
        ],
        LOADING_INTERVAL: 2000,
        MAX_RESULT_HEIGHT: 400,
        SCROLLBAR_WIDTH: 15,
    };

    // 样式注入
    GM_addStyle(`
        #ai-floating-menu {
            all: initial;
            position: fixed;
            z-index: 2147483647;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 5px;
            opacity: 1;
            visibility: visible;
            transition: opacity ${CONFIG.ANIMATION_DURATION}ms ease,
                        visibility ${CONFIG.ANIMATION_DURATION}ms ease;
            font-family: system-ui, -apple-system, sans-serif;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }

        #ai-floating-menu.hiding {
            opacity: 0;
            visibility: hidden;
        }

        #ai-floating-menu button {
            all: initial;
            display: block;
            width: 120px;
            margin: 3px;
            padding: 8px 12px;
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            text-align: center;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }

        #ai-floating-menu button:hover {
            background: #34495e;
            transform: translateY(-1px);
        }

        #ai-floating-menu button:active {
            transform: translateY(1px);
        }

        #ai-floating-menu button.processing {
            pointer-events: none;
            opacity: 0.7;
        }

        #ai-floating-menu button.processing::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            width: 100%;
            background: linear-gradient(to right, #3498db, #2ecc71);
            animation: loading-bar 2s infinite linear;
        }

        #ai-floating-menu .shortcut {
            float: right;
            font-size: 12px;
            opacity: 0.7;
        }

        #ai-result-box {
            all: initial;
            position: fixed;
            z-index: 2147483648;
            background: white;
            border-radius: 8px;
            box-shadow: 0 3px 15px rgba(0,0,0,0.2);
            padding: 15px;
            min-width: 200px;
            max-width: 500px;
            max-height: ${CONFIG.MAX_RESULT_HEIGHT}px;
            opacity: 1;
            visibility: visible;
            transition: opacity ${CONFIG.ANIMATION_DURATION}ms ease,
                        visibility ${CONFIG.ANIMATION_DURATION}ms ease,
                        transform 0.2s ease;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            overflow: auto;
            transform: translateY(0);
            animation: fadeIn 0.3s ease;
            cursor: grab;
            user-select: none;
        }

        #ai-result-box .content {
            cursor: default;
            user-select: text;
        }

        #ai-result-box.hiding {
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
        }

        #ai-result-box .close-btn {
            all: initial;
            position: absolute;
            top: 8px;
            right: 8px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: #f0f0f0;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-family: inherit;
            font-size: 14px;
            color: #666;
            transition: all 0.2s;
        }

        #ai-result-box .close-btn:hover {
            background: #e0e0e0;
            transform: rotate(90deg);
        }

        #ai-result-box .content {
            margin-top: 5px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.6;
            font-size: 14px;
            color: #2c3e50;
        }

        #ai-result-box .error {
            color: #e74c3c;
            background: #fde8e7;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
            animation: shake 0.5s ease-in-out;
        }

        #ai-result-box .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-align: center;
        }

        .loading-spinner {
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 10px;
        }

        .loading-text {
            color: #666;
            font-size: 14px;
            margin-top: 10px;
            min-height: 20px;
            transition: opacity 0.3s;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        @media (prefers-color-scheme: dark) {
            #ai-floating-menu,
            #ai-result-box {
                background: #2c3e50;
                color: #ecf0f1;
            }

            #ai-result-box .content {
                color: #ecf0f1;
            }

            #ai-result-box .error {
                background: #4a1c17;
            }

            .loading-text {
                color: #ecf0f1;
            }
        }
    `);
    // 工具函数
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        async retry(fn, retries = CONFIG.MAX_RETRIES, delay = CONFIG.RETRY_DELAY) {
            try {
                return await fn();
            } catch (error) {
                if (retries === 0) throw error;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retry(fn, retries - 1, delay * CONFIG.RETRY_BACKOFF_FACTOR);
            }
        },

        createLoadingSpinner() {
            return `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">${CONFIG.LOADING_MESSAGES[0]}</div>
                </div>
            `;
        },

        isValidText(text) {
            return text &&
                text.length >= CONFIG.MIN_TEXT_LENGTH &&
                text.length <= CONFIG.MAX_TEXT_LENGTH;
        },

        rotateLoadingMessage() {
            const loadingText = document.querySelector('.loading-text');
            if (!loadingText) return;

            let currentIndex = 0;
            return setInterval(() => {
                currentIndex = (currentIndex + 1) % CONFIG.LOADING_MESSAGES.length;
                loadingText.style.opacity = '0';
                setTimeout(() => {
                    loadingText.textContent = CONFIG.LOADING_MESSAGES[currentIndex];
                    loadingText.style.opacity = '1';
                }, 300);
            }, CONFIG.LOADING_INTERVAL);
        }
    };

    // 缓存管理类
    class CacheManager {
        static getKey(text, action) {
            return `${action}_${text}`;
        }

        static async get(text, action) {
            const key = this.getKey(text, action);
            const cached = GM_getValue(key);
            if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
                return cached.data;
            }
            return null;
        }

        static async set(text, action, data) {
            const key = this.getKey(text, action);
            const cache = {
                data,
                timestamp: Date.now()
            };

            const keys = Object.keys(GM_getValue('cache_keys', {}));
            if (keys.length >= CONFIG.MAX_CACHE_ITEMS) {
                const oldestKey = keys[0];
                GM_deleteValue(oldestKey);
                keys.shift();
            }

            keys.push(key);
            GM_setValue('cache_keys', keys);
            GM_setValue(key, cache);
        }
    }

    // API调用类
    class APIClient {
        static async call(text, action) {
            const cached = await CacheManager.get(text, action);
            if (cached) return cached;

            if (!utils.isValidText(text)) {
                throw new Error(`文本长度应在${CONFIG.MIN_TEXT_LENGTH}至${CONFIG.MAX_TEXT_LENGTH}字符之间`);
            }

            const prompts = {
                translate: '将以下内容翻译成中文，保持专业性和准确性：',
                explain: '请详细解释以下内容，如果包含专业术语请着重说明：',
                summarize: '请提炼以下内容的关键要点，以简洁的要点形式列出：'
            };

            let retryCount = 0;
            const maxRetries = CONFIG.MAX_RETRIES;

            while (retryCount < maxRetries) {
                try {
                    const response = await this.makeRequest(text, prompts[action]);
                    const result = this.processResponse(response);
                    await CacheManager.set(text, action, result);
                    return result;
                } catch (error) {
                    retryCount++;
                    if (retryCount === maxRetries) throw error;

                    await new Promise(resolve =>
                        setTimeout(resolve, CONFIG.RETRY_DELAY * Math.pow(CONFIG.RETRY_BACKOFF_FACTOR, retryCount))
                    );
                }
            }
        }

        static async makeRequest(text, prompt) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: CONFIG.API_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.API_KEY}`
                    },
                    data: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [{
                            role: 'user',
                            content: `${prompt}\n\n${text}`
                        }],
                        temperature: 0.7,
                        max_tokens: 2000,
                        presence_penalty: 0.6,
                        frequency_penalty: 0.5
                    }),
                    timeout: 30000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: () => reject(new Error('请求超时'))
                });
            });
        }

        static processResponse(res) {
            if (res.status !== 200) {
                throw new Error(`API错误: ${res.status}`);
            }

            try {
                const data = JSON.parse(res.responseText);
                if (!data.choices?.[0]?.message?.content) {
                    throw new Error('API返回格式错误');
                }
                return data.choices[0].message.content;
            } catch (e) {
                throw new Error('解析响应失败');
            }
        }

        static getErrorMessage(error) {
            const errorMessages = {
                'Network Error': '网络连接失败',
                'Timeout': '请求超时',
                'API错误: 429': '请求过于频繁，请稍后再试',
                'API错误: 401': 'API密钥无效',
                'API错误: 403': '没有访问权限'
            };
            return errorMessages[error.message] || error.message;
        }
    }
    // UI管理类
    class UIManager {
        static ensureElementsExist() {
            if (!document.getElementById('ai-floating-menu')) {
                const menu = document.createElement('div');
                menu.id = 'ai-floating-menu';
                menu.style.display = 'none';
                menu.innerHTML = `
                    <button data-action="translate">翻译为中文 <span class="shortcut">Alt+T</span></button>
                    <button data-action="explain">解释内容 <span class="shortcut">Alt+E</span></button>
                    <button data-action="summarize">总结要点 <span class="shortcut">Alt+S</span></button>
                `;
                document.body.appendChild(menu);
            }

            if (!document.getElementById('ai-result-box')) {
                const resultBox = document.createElement('div');
                resultBox.id = 'ai-result-box';
                resultBox.style.display = 'none';
                resultBox.innerHTML = `
                    <button class="close-btn">×</button>
                    <div class="content"></div>
                `;
                document.body.appendChild(resultBox);
            }
        }

        static async showMenu(x, y) {
            this.ensureElementsExist();
            await this.hideAll();

            const menu = document.getElementById('ai-floating-menu');
            const { left, top } = this.calculateOptimalPosition(x, y, menu);

            menu.style.left = `${left}px`;
            menu.style.top = `${top}px`;
            menu.style.display = 'block';
            menu.offsetHeight; // 触发重排
            menu.classList.remove('hiding');
        }

        static async showResult(content, x, y) {
            this.ensureElementsExist();
            await this.hideMenu();

            const resultBox = document.getElementById('ai-result-box');
            const contentDiv = resultBox.querySelector('.content');

            if (content.startsWith('错误:')) {
                contentDiv.classList.add('error');
                setTimeout(() => {
                    this.hideAll();
                    contentDiv.classList.remove('error');
                }, CONFIG.ERROR_DISPLAY_TIME);
            } else {
                contentDiv.classList.remove('error');
            }

            contentDiv.innerHTML = content;

            const { left, top } = this.calculateResultPosition(x, y, resultBox);
            resultBox.style.left = `${left}px`;
            resultBox.style.top = `${top}px`;
            resultBox.style.display = 'block';
            resultBox.offsetHeight; // 触发重排
            resultBox.classList.remove('hiding');

            return content.includes('loading-container') ? utils.rotateLoadingMessage() : null;
        }

        static calculateOptimalPosition(x, y, element) {
            const margin = 10;
            const maxWidth = Math.min(500, window.innerWidth - 2 * margin);
            element.style.maxWidth = `${maxWidth}px`;

            let left = Math.max(margin, Math.min(x, window.innerWidth - element.offsetWidth - margin));
            let top = Math.max(margin, Math.min(y, window.innerHeight - element.offsetHeight - margin));

            return { left, top };
        }

        static calculateResultPosition(x, y, element) {
            const margin = 20;
            const maxWidth = Math.min(500, window.innerWidth - 2 * margin);
            element.style.maxWidth = `${maxWidth}px`;

            const selection = window.getSelection();
            let selectionRect = null;
            if (selection.rangeCount > 0) {
                selectionRect = selection.getRangeAt(0).getBoundingClientRect();
            }

            let left, top;

            if (selectionRect) {
                // 优先显示在选区下方
                left = selectionRect.left;
                top = selectionRect.bottom + margin;

                // 如果底部空间不足，则显示在选区上方
                if (top + element.offsetHeight > window.innerHeight - margin) {
                    top = Math.max(margin, selectionRect.top - element.offsetHeight - margin);
                }

                // 如果水平方向超出屏幕，进行调整
                if (left + maxWidth > window.innerWidth - margin) {
                    left = Math.max(margin, window.innerWidth - maxWidth - margin);
                }
            } else {
                // 如果没有选区，则根据鼠标位置
                left = Math.max(margin, Math.min(x, window.innerWidth - maxWidth - margin));
                top = Math.max(margin, Math.min(y, window.innerHeight - element.offsetHeight - margin));
            }

            return { left, top };
        }

        static async hideMenu() {
            const menu = document.getElementById('ai-floating-menu');
            if (menu && menu.style.display !== 'none') {
                menu.classList.add('hiding');
                await new Promise(resolve => setTimeout(resolve, CONFIG.ANIMATION_DURATION));
                menu.style.display = 'none';
            }
        }

        static async hideAll() {
            const menu = document.getElementById('ai-floating-menu');
            const resultBox = document.getElementById('ai-result-box');

            const promises = [];

            if (menu && menu.style.display !== 'none') {
                menu.classList.add('hiding');
                promises.push(new Promise(resolve => setTimeout(resolve, CONFIG.ANIMATION_DURATION)));
            }

            if (resultBox && resultBox.style.display !== 'none') {
                resultBox.classList.add('hiding');
                promises.push(new Promise(resolve => setTimeout(resolve, CONFIG.ANIMATION_DURATION)));
            }

            await Promise.all(promises);

            if (menu) menu.style.display = 'none';
            if (resultBox) resultBox.style.display = 'none';
        }
    }

    // 文本选择管理类
    class SelectionManager {
        static getSelectedText() {
            let text = '';
            let range = null;

            const selection = window.getSelection();
            text = selection.toString().trim();
            if (text && selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
                return { text, range };
            }

            try {
                const iframes = document.getElementsByTagName('iframe');
                for (const iframe of iframes) {
                    try {
                        const iframeSelection = iframe.contentWindow.getSelection();
                        const iframeText = iframeSelection.toString().trim();
                        if (iframeText) {
                            return {
                                text: iframeText,
                                range: iframeSelection.rangeCount > 0 ? iframeSelection.getRangeAt(0) : null
                            };
                        }
                    } catch (e) {
                        console.debug('无法访问iframe内容:', e);
                    }
                }
            } catch (e) {
                console.debug('处理iframe时出错:', e);
            }

            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                const start = activeElement.selectionStart;
                const end = activeElement.selectionEnd;
                if (start !== end) {
                    text = activeElement.value.substring(start, end).trim();
                    return { text, range: null };
                }
            }

            return { text: '', range: null };
        }
    }

    // 事件处理类
    class EventHandler {
        static init() {
            UIManager.ensureElementsExist();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.setupResizeObserver();
            this.setupDraggable();
        }

        static setupEventListeners() {
            const menu = document.getElementById('ai-floating-menu');
            const resultBox = document.getElementById('ai-result-box');

            // 使用事件委托处理按钮点击
            document.addEventListener('click', async (e) => {
                const button = e.target.closest('#ai-floating-menu button');
                if (!button) return;

                const action = button.dataset.action;
                const { text } = SelectionManager.getSelectedText();
                if (!text) return;

                button.classList.add('processing');
                await this.handleAction(action, text, e.clientX, e.clientY);
                button.classList.remove('processing');
            });

            // 关闭按钮
            resultBox.querySelector('.close-btn').addEventListener('click', () => {
                UIManager.hideAll();
            });

            // 点击外部隐藏菜单和结果框
            document.addEventListener('mousedown', (e) => {
                if (!menu.contains(e.target) && !resultBox.contains(e.target)) {
                    UIManager.hideAll();
                }
            }, true);

            // 快捷键支持
            document.addEventListener('keydown', (e) => {
                for (const [action, shortcut] of Object.entries(CONFIG.SHORTCUTS)) {
                    const [modifier, key] = shortcut.split('+');
                    if (e[`${modifier.toLowerCase()}Key`] && e.key.toUpperCase() === key) {
                        e.preventDefault();
                        const { text } = SelectionManager.getSelectedText();
                        if (text) {
                            this.handleAction(action, text, e.clientX, e.clientY);
                        }
                    }
                }
            });

            // 文本选择监听
            this.addSelectionListeners();

            // 触摸屏支持
            document.addEventListener('touchend', (e) => {
                const { text } = SelectionManager.getSelectedText();
                if (text) {
                    const touch = e.changedTouches[0];
                    UIManager.showMenu(touch.clientX, touch.clientY);
                }
            });
        }

        static setupDraggable() {
            const resultBox = document.getElementById('ai-result-box');
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            resultBox.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('close-btn') ||
                    e.target.closest('.content')) return;

                isDragging = true;
                initialX = e.clientX - resultBox.offsetLeft;
                initialY = e.clientY - resultBox.offsetTop;

                resultBox.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // 限制在可视区域内
                currentX = Math.max(0, Math.min(currentX, window.innerWidth - resultBox.offsetWidth));
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - resultBox.offsetHeight));

                resultBox.style.left = `${currentX}px`;
                resultBox.style.top = `${currentY}px`;
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                resultBox.style.cursor = 'grab';
            });
        }

        static addSelectionListeners(target = document) {
            const handleSelection = utils.debounce(async (e) => {
                const { text, range } = SelectionManager.getSelectedText();
                if (!text) {
                    await UIManager.hideAll();
                    return;
                }

                let x = e?.clientX || 0;
                let y = e?.clientY || 0;

                if (range) {
                    try {
                        const rect = range.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            x = rect.right;
                            y = rect.bottom + 5;
                        }
                    } catch (e) {
                        console.debug('获取选区位置失败:', e);
                    }
                }

                await UIManager.showMenu(x, y);
            }, CONFIG.DEBOUNCE_DELAY);

            target.addEventListener('mouseup', handleSelection);
            target.addEventListener('keyup', handleSelection);
            target.addEventListener('selectionchange', handleSelection);
        }

        static setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        UIManager.hideAll();
                    }
                });
            });

            const menu = document.getElementById('ai-floating-menu');
            const resultBox = document.getElementById('ai-result-box');
            observer.observe(menu);
            observer.observe(resultBox);
        }

        static setupResizeObserver() {
            const observer = new ResizeObserver(utils.debounce(() => {
                const menu = document.getElementById('ai-floating-menu');
                const resultBox = document.getElementById('ai-result-box');
                if (menu.style.display === 'block' || resultBox.style.display === 'block') {
                    UIManager.hideAll();
                }
            }, 100));

            observer.observe(document.body);
        }

        static async handleAction(action, text, x, y) {
            let loadingMessageInterval;
            try {
                await UIManager.hideAll();
                loadingMessageInterval = await UIManager.showResult(utils.createLoadingSpinner(), x, y);

                const response = await APIClient.call(text, action);
                clearInterval(loadingMessageInterval);
                UIManager.showResult(response, x, y);
            } catch (error) {
                if (loadingMessageInterval) clearInterval(loadingMessageInterval);
                UIManager.showResult(`错误: ${error.message}`, x, y);
            }
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => EventHandler.init());
    } else {
        EventHandler.init();
    }
})();

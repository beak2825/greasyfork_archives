// ==UserScript==
// @name         智能划词翻译工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持自动语言检测的划词翻译工具，带可视化界面，适配移动端居中显示
// @author       Ling
// @match        *://*/*
// @connect      fanyi.baidu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @description 2025/04/01 19:41:00
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531492/%E6%99%BA%E8%83%BD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/531492/%E6%99%BA%E8%83%BD%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式注入（优化移动端居中显示）
    GM_addStyle(`
        .translation-box {
            position: fixed;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            padding: 16px;
            max-width: 90vw;
            width: 320px;
            z-index: 2147483647;
            font-family: 'Segoe UI', system-ui, sans-serif;
            transition: opacity 0.3s;
            box-sizing: border-box;
        }
        .translation-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }
        .translation-title {
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
        }
        .translation-close {
            cursor: pointer;
            color: #718096;
            font-size: 18px;
            line-height: 1;
            padding: 4px;
        }
        .translation-content {
            line-height: 1.6;
            color: #4a5568;
            font-size: 14px;
            max-height: 50vh;
            overflow-y: auto;
            word-break: break-word;
        }
        .loading-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e2e8f0;
            border-top-color: #4299e1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
            .translation-box {
                width: 85vw;
                padding: 12px;
                font-size: 13px;
                left: 50%;
                transform: translateX(-50%);
                top: 20%; /* 移动端固定顶部20%位置 */
            }
            .translation-content {
                font-size: 13px;
                max-height: 40vh;
            }
        }
    `);

    // 翻译核心模块（保持不变）
    const TranslationCore = {
        async detectLanguage(text) {
            try {
                const response = await this._request({
                    url: 'https://fanyi.baidu.com/langdetect',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: `query=${encodeURIComponent(text)}`
                });
                if (response.error === 0 && response.lan) {
                    return response.lan.toLowerCase();
                }
                throw new Error(response.msg || '检测失败');
            } catch (error) {
                console.warn('语言检测失败:', error);
                return 'auto';
            }
        },

        async translate(text, from = 'auto', to = 'zh') {
            try {
                if (from === 'auto') {
                    from = await this.detectLanguage(text) || 'en';
                }
                if (from === 'zh' && to === 'auto') to = 'en';
                if (from !== 'zh' && to === 'auto') to = 'zh';

                const response = await this._request({
                    url: 'https://fanyi.baidu.com/ait/text/translate',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        query: text,
                        from: from,
                        to: to,
                        milliTimestamp: Date.now(),
                        domain: "common",
                        needPhonetic: false
                    })
                });
                return this._parseSSE(response);
            } catch (error) {
                console.error('翻译失败:', error);
                throw error;
            }
        },

        _parseSSE(rawData) {
            const events = rawData.split('\n\n').filter(Boolean);
            const results = [];
            for (const event of events) {
                const lines = event.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        try {
                            const data = JSON.parse(line.slice(5).trim());
                            if (data?.data?.event === 'Translating') {
                                const valid = data.data.list
                                    .filter(item => item.dst?.trim())
                                    .map(item => item.dst);
                                results.push(...valid);
                            }
                        } catch (e) {
                            console.warn('SSE解析错误:', e);
                        }
                    }
                }
            }
            return results.length > 0 ? results.join('\n') : '未获取到有效翻译结果';
        },

        _request(options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    ...options,
                    onload: (resp) => {
                        try {
                            resolve(JSON.parse(resp.responseText));
                        } catch {
                            resolve(resp.responseText);
                        }
                    },
                    onerror: (err) => reject(err)
                });
            });
        }
    };

    // 用户界面控制器（调整定位逻辑）
    class TranslationUI {
        constructor() {
            this.isMobile = window.matchMedia('(max-width: 768px)').matches;
            this.initDOM();
            this.bindEvents();
        }

        initDOM() {
            this.container = document.createElement('div');
            this.container.className = 'translation-box';
            this.container.style.display = 'none';
            this.container.innerHTML = `
                <div class="translation-header">
                    <span class="translation-title">智能翻译</span>
                    <span class="translation-close">×</span>
                </div>
                <div class="translation-content"></div>
            `;
            document.body.appendChild(this.container);
            this.content = this.container.querySelector('.translation-content');
            this.closeButton = this.container.querySelector('.translation-close');
        }

        bindEvents() {
            this.closeButton.onclick = () => this.hide();
            document.addEventListener('mousedown', (e) => {
                if (!this.container.contains(e.target)) this.hide();
            });
            document.addEventListener('touchstart', (e) => {
                if (!this.container.contains(e.target)) this.hide();
            });
        }

        showLoading() {
            this.content.innerHTML = `
                <div class="loading-indicator">
                    <div class="loading-spinner"></div>
                    <span>翻译中...</span>
                </div>`;
            this.container.style.display = 'block';
        }

        showResult(text) {
            this.content.innerHTML = text;
            this.container.style.display = 'block';
            this.autoHide(5000);
        }

        showError(msg) {
            this.content.innerHTML = `<div style="color: #e53e3e;">${msg}</div>`;
            this.container.style.display = 'block';
            this.autoHide(3000);
        }

        hide() {
            this.container.style.display = 'none';
        }

        position(x, y) {
            if (this.isMobile) {
                // 移动端居中显示，CSS已处理水平居中，垂直位置固定为20%
                this.container.style.top = '20%';
                this.container.style.left = '50%';
                this.container.style.transform = 'translateX(-50%)';
            } else {
                // 桌面端基于鼠标/触摸位置
                const OFFSET = 15;
                const rect = this.container.getBoundingClientRect();
                let top = y + OFFSET;
                let left = x + OFFSET;

                if (left + rect.width > window.innerWidth) {
                    left = Math.max(OFFSET, window.innerWidth - rect.width - OFFSET);
                }
                if (top + rect.height > window.innerHeight) {
                    top = Math.max(OFFSET, y - rect.height - OFFSET);
                }

                this.container.style.top = `${top}px`;
                this.container.style.left = `${left}px`;
                this.container.style.transform = 'none'; // 清除移动端变换
            }
        }

        autoHide(delay) {
            clearTimeout(this.hideTimer);
            this.hideTimer = setTimeout(() => this.hide(), delay);
        }
    }

    function isInputElement(node) {
        return node && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA' || node.isContentEditable);
    }

    function isSearchBox(node) {
        return node && node.tagName === 'INPUT' && node.type === 'search';
    }

    let lastSelection = '';
    let lastTranslation = '';
    let cacheExpireTimer;
    const MAX_HISTORY = 15;
    let translationHistory = [];

    function updateCache(text, translation) {
        lastSelection = text;
        lastTranslation = translation;
        translationHistory = [
            { text, translation },
            ...translationHistory.slice(0, MAX_HISTORY - 1)
        ];
        clearTimeout(cacheExpireTimer);
        cacheExpireTimer = setTimeout(() => {
            lastSelection = '';
            lastTranslation = '';
            translationHistory = [];
        }, 1800000);
    }

    // 主程序
    (function init() {
        const ui = new TranslationUI();
        let debounceTimer = null;

        const debounce = (func, delay = 300) => {
            return (...args) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => func.apply(this, args), delay);
            };
        };

        const handleTranslate = async (x, y, text) => {
            if (!text) return;

            const cached = translationHistory.find(item => item.text === text);
            if (cached) {
                ui.position(x, y);
                ui.showResult(cached.translation);
                return;
            }

            ui.currentText = text;
            ui.position(x, y);
            ui.showLoading();

            try {
                const result = await TranslationCore.translate(text);
                updateCache(text, result);
                ui.showResult(result);
            } catch (error) {
                ui.showError(`翻译失败: ${error.message || '服务不可用'}`);
                GM_notification({
                    title: '翻译错误',
                    text: error.message,
                    timeout: 3000
                });
            }
        };

        const handleMouseUp = debounce((e) => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            if (text) handleTranslate(e.pageX, e.pageY, text);
        }, 150);

        const handleTouchEnd = debounce((e) => {
            const selection = window.getSelection();
            const text = selection.toString().trim();
            if (text) {
                const touch = e.changedTouches[0];
                handleTranslate(touch.pageX, touch.pageY, text);
            }
        }, 150);

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleTouchEnd);
    })();
})();
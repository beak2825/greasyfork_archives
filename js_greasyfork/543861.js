// ==UserScript==
// @name         Qiuwei Chat Assistant
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add custom chat functionality to Qiuwei wechat admin console
// @author       You
// @match        https://siyu.qiuweiai.com/customer/wechatAdmin/wechat*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAS1BMVEX////ycnLyampuu25muGby8nLy8mrl5eXk5OT8DAz8/AzPz8/z8zONvY3Nzc3d3d3b29v/AAAMnAwAmQD//wDMzMz19SmIu4j///+ks1oiAAAAEXRSTlMAwMfg5cDHgIj+/vD7/v7AxxKKtKIAAAABYktHRACIBR1IAAAACW9GRnMAAAEtAAABagBZv0KIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4gERCw82Bupv1AAAAAl2cEFnAAADGgAABGMAz64W0QAAAItJREFUaN7t2UkKgEAQBEF13Pfd///UQ4n0YQRBBIXMYzEaD+ggIPpZYaRCO7pYObMlqUrswyxX2TVQDKqw4zip0WzlrEr7sFpUBQAAAAAAAAAAAHBWr6p+C/D+CwAAAAAAAAAA4BnQbKp5C2iP71oAAAAAAAAAAID/AN6Ddderzmze2/SNgzXRJ9sBPp3K24JPMHQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMTdUMTk6MTQ6NDIrMDg6MDBqGWm5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTE3VDE5OjE0OjQyKzA4OjAwG0TRBQAAAABJRU5ErkJggg==
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/543861/Qiuwei%20Chat%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/543861/Qiuwei%20Chat%20Assistant.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    // 添加 Ant Design 风格的 CSS
    const antStyles = `
        /* Ant Design 风格的基础样式 */
        :root {
            --ant-primary-color: #1890ff;
            --ant-success-color: #52c41a;
            --ant-warning-color: #faad14;
            --ant-error-color: #f5222d;
            --ant-font-size-base: 14px;
            --ant-border-radius-base: 2px;
            --ant-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
        }

        .ant-btn {
            line-height: 1.5715;
            position: relative;
            display: inline-block;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
            background-image: none;
            border: 1px solid transparent;
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            user-select: none;
            touch-action: manipulation;
            height: 32px;
            padding: 4px 15px;
            font-size: 14px;
            border-radius: 2px;
            color: rgba(0, 0, 0, 0.85);
            border-color: #d9d9d9;
            background: #fff;
        }

        .ant-btn:hover {
            color: var(--ant-primary-color);
            border-color: var(--ant-primary-color);
        }

        .ant-btn-primary {
            color: #fff;
            border-color: var(--ant-primary-color);
            background: var(--ant-primary-color);
            text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }

        .ant-btn-primary:hover {
            color: #fff;
            border-color: #40a9ff;
            background: #40a9ff;
        }

        .ant-input {
            box-sizing: border-box;
            margin: 0;
            padding: 4px 11px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            line-height: 1.5715;
            list-style: none;
            position: relative;
            display: inline-block;
            width: 100%;
            min-width: 0;
            background-color: #fff;
            background-image: none;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            transition: all 0.3s;
        }

        .ant-input:hover {
            border-color: #40a9ff;
            border-right-width: 1px !important;
        }

        .ant-input:focus {
            border-color: #40a9ff;
            border-right-width: 1px !important;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .ant-textarea {
            max-width: 100%;
            height: auto;
            min-height: 100px;
            line-height: 1.5715;
            vertical-align: bottom;
            transition: all 0.3s, height 0s;
            resize: vertical;
        }

        .ant-card {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5715;
            list-style: none;
            font-feature-settings: 'tnum';
            position: relative;
            background: #fff;
            border-radius: 2px;
            transition: all 0.3s;
        }

        .ant-card-bordered {
            border: 1px solid #f0f0f0;
        }

        .ant-card-head {
            min-height: 48px;
            margin-bottom: -1px;
            padding: 0 24px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            background: transparent;
            border-bottom: 1px solid #f0f0f0;
            border-radius: 2px 2px 0 0;
        }

        .ant-card-head-title {
            display: inline-block;
            flex: 1;
            padding: 16px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .ant-card-extra {
            float: right;
            margin-left: auto;
            padding: 16px 0;
            color: rgba(0, 0, 0, 0.85);
            font-weight: normal;
            font-size: 14px;
        }

        .ant-card-body {
            padding: 24px;
        }

        .ant-float-btn {
            position: fixed;
            z-index: 100;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03);
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .ant-float-btn:hover {
            box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.12), 0 18px 56px 4px rgba(0, 0, 0, 0.1), 0 24px 80px 16px rgba(0, 0, 0, 0.06);
        }

        .ant-float-btn-primary {
            background-color: var(--ant-primary-color);
            color: #fff;
        }

        .ant-float-btn-primary:hover {
            background-color: #40a9ff;
        }

        .ant-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .ant-toast.visible {
            opacity: 1;
        }

        /* 长文本优化样式 */
        #result-container {
            word-break: break-word;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            line-height: 1.6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
        }

        #result-container:focus {
            outline: none;
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        /* 确保长URL和数字能够正确换行 */
        #result-container * {
            word-break: break-all;
            word-wrap: break-word;
        }

        .ant-loading {
            display: inline-block;
            animation: ant-spin 1s infinite linear;
        }

        @keyframes ant-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    // 添加样式
    GM_addStyle(antStyles);

    // 全局状态管理
    const state = {
        initialized: false,
        floatingBtn: null,
        mainInterface: null,
        isApiRequestActive: false,
        lastCapturedNickname: '',
        isUserEditing: false,
        eventListeners: [],
        observers: [],
        urlCheckInterval: null,
        conversation_id: '',
        message_id: ''
    };

    // 目标URL
    const TARGET_URL = 'https://siyu.qiuweiai.com/customer/wechatAdmin/wechat';

    // 工具函数
    const utils = {
        // 防抖函数
        debounce(fn, delay) {
            let timer = null;
            return function(...args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    fn.apply(this, args);
                    timer = null;
                }, delay);
            };
        },

        // 安全的DOM查询
        safeQuerySelector(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (e) {
                console.warn('DOM查询失败:', selector, e);
                return null;
            }
        },

        // 安全的DOM查询所有
        safeQuerySelectorAll(selector, parent = document) {
            try {
                return parent.querySelectorAll(selector);
            } catch (e) {
                console.warn('DOM查询失败:', selector, e);
                return [];
            }
        },

        // 输入验证和清理
        sanitizeInput(input) {
            if (typeof input !== 'string') return '';
            return input.trim().replace(/[<>]/g, '');
        },

        // 安全的JSON解析
        safeJsonParse(jsonString) {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                console.error('JSON解析失败:', e);
                return null;
            }
        },

        // 添加事件监听器并记录
        addEventListenerWithTracking(element, event, handler, options = {}) {
            element.addEventListener(event, handler, options);
            state.eventListeners.push({ element, event, handler, options });
        },

        // 清理所有事件监听器
        cleanupEventListeners() {
            state.eventListeners.forEach(({ element, event, handler, options }) => {
                try {
                    element.removeEventListener(event, handler, options);
                } catch (e) {
                    console.warn('移除事件监听器失败:', e);
                }
            });
            state.eventListeners = [];
        },

        // 清理所有观察器
        cleanupObservers() {
            state.observers.forEach(observer => {
                try {
                    observer.disconnect();
                } catch (e) {
                    console.warn('断开观察器失败:', e);
                }
            });
            state.observers = [];
        },

        // 处理长文本，确保正确换行
        processLongText(text) {
            if (!text) return '';
            
            // 移除多余的空白字符
            let processed = text.trim();
            
            // 处理超长单词（如URL、长数字等）- 只处理没有空格的长字符串
            processed = processed.replace(/([^\s]{80,})/g, function(match) {
                // 对于超长单词，每80个字符插入一个换行符
                return match.match(/.{1,80}/g).join('\n');
            });
            
            // 确保多个连续换行符不超过2个
            processed = processed.replace(/\n{3,}/g, '\n\n');
            
            return processed;
        }
    };

    // 初始化
    function init() {
        if (state.initialized) return;
        
        // 清理之前的资源
        cleanup();
        
        // 开始监听URL变化
        startUrlChangeMonitor();
        
        state.initialized = true;
        
        // 初始检查URL
        checkCurrentUrl();
    }

    // 清理资源
    function cleanup() {
        utils.cleanupEventListeners();
        utils.cleanupObservers();
        
        // 清理定时器
        if (state.urlCheckInterval) {
            clearInterval(state.urlCheckInterval);
            state.urlCheckInterval = null;
        }
        
        // 移除现有元素
        const existingAssistant = document.getElementById('qiuwei-chat-assistant');
        const existingButton = document.getElementById('qiuwei-chat-button');
        
        if (existingAssistant) existingAssistant.remove();
        if (existingButton) existingButton.remove();
        
        // 重置状态
        state.floatingBtn = null;
        state.mainInterface = null;
        state.isApiRequestActive = false;
        state.lastCapturedNickname = '';
        state.isUserEditing = false;
    }

    // 开始监听URL变化
    function startUrlChangeMonitor() {
        // 监听history API变化
        monitorHistoryChanges();

        // 使用定时器定期检查URL (兜底方案)
        const urlCheckInterval = setInterval(checkCurrentUrl, 1000);
        state.urlCheckInterval = urlCheckInterval;

        // 监听hashchange事件
        const hashChangeHandler = () => checkCurrentUrl();
        utils.addEventListenerWithTracking(window, 'hashchange', hashChangeHandler);

        // 监听popstate事件
        const popStateHandler = () => checkCurrentUrl();
        utils.addEventListenerWithTracking(window, 'popstate', popStateHandler);
    }

    // 监听history API变化
    function monitorHistoryChanges() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 覆盖pushState
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkCurrentUrl();
        };

        // 覆盖replaceState
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            checkCurrentUrl();
        };
    }

    // 检查当前URL
    function checkCurrentUrl() {
        const currentUrl = window.location.href;

        if (currentUrl.startsWith(TARGET_URL)) {
            showElements();
        } else {
            hideElements();
        }
    }

    // 显示元素
    function showElements() {
        if (state.floatingBtn && document.body.contains(state.floatingBtn)) {
            state.floatingBtn.style.display = 'flex';
        } else if (!document.getElementById('qiuwei-chat-assistant')) {
            createFloatingButton();
        }

        const assistant = document.getElementById('qiuwei-chat-assistant');
        if (assistant) {
            assistant.style.display = 'block';
        }
    }

    // 隐藏元素
    function hideElements() {
        if (state.floatingBtn && document.body.contains(state.floatingBtn)) {
            state.floatingBtn.style.display = 'none';
        }

        const assistant = document.getElementById('qiuwei-chat-assistant');
        if (assistant) {
            assistant.style.display = 'none';
        }
    }

    // 创建浮动按钮
    function createFloatingButton() {
        if (document.getElementById("qiuwei-chat-button")) return;
        if (!window.location.href.startsWith(TARGET_URL)) return;

        const chatContainer = utils.safeQuerySelector('.chat-container, .message-list, .conversation-area');

        const button = document.createElement('div');
        button.id = 'qiuwei-chat-button';
        button.className = 'ant-float-btn ant-float-btn-primary';
        button.style.cssText = `
            width: 40px;
            height: 40px;
            font-size: 18px;
            z-index: 9999;
            background-color: var(--ant-primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
        `;

        button.innerHTML = '<svg viewBox="64 64 896 896" focusable="false" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg>';
        button.title = '对话助手';

        if (chatContainer) {
            button.style.position = 'absolute';
            chatContainer.parentNode.insertBefore(button, chatContainer);
            
            setTimeout(() => {
                const chatContainerRect = chatContainer.getBoundingClientRect();
                button.style.top = (chatContainerRect.top - 50) + 'px';
                button.style.left = 'auto';
                button.style.right = '20px';
            }, 0);
        } else {
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px';
            document.body.appendChild(button);
        }

        state.floatingBtn = button;

        // 事件处理
        const clickHandler = function(e) {
            e.stopPropagation();
            if (!window.location.href.startsWith(TARGET_URL)) return;
            this.remove();
            state.floatingBtn = null;
            createMainInterface();
        };

        const mouseEnterHandler = function() {
            this.style.transform = 'scale(1.1)';
        };

        const mouseLeaveHandler = function() {
            this.style.transform = 'scale(1)';
        };

        utils.addEventListenerWithTracking(button, 'click', clickHandler);
        utils.addEventListenerWithTracking(button, 'mouseenter', mouseEnterHandler);
        utils.addEventListenerWithTracking(button, 'mouseleave', mouseLeaveHandler);

        observeDOMChanges();
    }

    // 创建主界面
    function createMainInterface() {
        if (!window.location.href.startsWith(TARGET_URL)) return;

        const container = createElement();
        const chatContainer = utils.safeQuerySelector('.chat-container, .message-list, .conversation-area');

        if (chatContainer) {
            container.style.position = 'absolute';
            container.style.top = (chatContainer.getBoundingClientRect().top - 10) + 'px';
            container.style.right = '20px';
            chatContainer.parentNode.insertBefore(container, chatContainer);
        } else {
            document.body.appendChild(container);
        }

        state.mainInterface = container;

        setTimeout(() => {
            addEventListeners();
            capturePageContent();
        }, 100);
    }

    // 创建界面元素
    function createElement() {
        const container = document.createElement('div');
        container.id = 'qiuwei-chat-assistant';
        container.className = 'ant-card ant-card-bordered';
        container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            width: 400px;
            max-width: 90vw;
            background-color: white;
            border-radius: 2px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            box-shadow: var(--ant-box-shadow);
        `;

        container.innerHTML = `
            <div class="ant-card-head">
                <div class="ant-card-head-wrapper">
                    <div class="ant-card-head-title">对话助手</div>
                    <div class="ant-card-extra">
                        <button id="minimize-btn" class="ant-btn" style="padding: 0 8px; height: 24px;">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="minus" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="ant-card-body">
                <div style="margin-bottom: 16px;">
                    <label for="belong_user_name" style="display: block; margin-bottom: 8px;">所属用户</label>
                    <input id="belong_user_name" class="ant-input" type="text" placeholder="请输入所属用户">
                </div>

                <div style="margin-bottom: 16px;">
                    <label for="nickname" style="display: block; margin-bottom: 8px;">昵称</label>
                    <input id="nickname" class="ant-input" type="text" placeholder="请输入昵称">
                </div>

                <div style="margin-bottom: 16px;">
                    <label for="message" style="display: block; margin-bottom: 8px;">消息内容</label>
                    <textarea id="message" class="ant-input ant-textarea" style="height: 100px;" placeholder="请输入消息内容"></textarea>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <button id="submit-btn" class="ant-btn ant-btn-primary" style="flex: 1;">提交</button>
                    <button id="capture-btn" class="ant-btn">重新获取</button>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label>返回结果</label>
                        <div>
                            <button id="copy-btn" class="ant-btn" style="margin-right: 8px;">复制</button>
                            <button id="save-btn" class="ant-btn">写入</button>
                        </div>
                    </div>
                    <div id="result-container" contenteditable="true" class="ant-input ant-textarea" style="min-height: 150px; max-height: 600px; overflow-y: auto; word-break: break-all; white-space: pre-wrap; overflow-x: hidden; word-wrap: break-word; hyphens: auto;" placeholder="结果将显示在这里..."></div>
                </div>
            </div>
        `;

        return container;
    }

    // 添加事件监听器
    function addEventListeners() {
        const container = document.getElementById('qiuwei-chat-assistant');
        if (!container) return;

        const submitBtn = document.getElementById('submit-btn');
        const copyBtn = document.getElementById('copy-btn');
        const saveBtn = document.getElementById('save-btn');
        const captureBtn = document.getElementById('capture-btn');
        const minimizeBtn = document.getElementById('minimize-btn');

        if (!submitBtn || !copyBtn || !saveBtn || !captureBtn || !minimizeBtn) {
            console.error('无法找到必要的DOM元素');
            return;
        }

        // 使用事件委托
        const containerClickHandler = function(e) {
            e.stopPropagation();
            if (!window.location.href.startsWith(TARGET_URL)) return;

            const target = e.target;

            if (target === submitBtn || target.closest('#submit-btn')) {
                handleSubmit();
            } else if (target === copyBtn || target.closest('#copy-btn')) {
                handleCopy();
            } else if (target === saveBtn || target.closest('#save-btn')) {
                handleSave();
            } else if (target === captureBtn || target.closest('#capture-btn')) {
                clearInputFields();
                state.isUserEditing = false;
                state.lastCapturedNickname = '';
                capturePageContent(true);
            } else if (target === minimizeBtn || target.closest('#minimize-btn')) {
                container.remove();
                state.mainInterface = null;
                createFloatingButton();
                setTimeout(adjustButtonPosition, 100);
            }
        };

        utils.addEventListenerWithTracking(container, 'click', containerClickHandler);

        // 监听用户编辑
        const belongUserNameInput = document.getElementById('belong_user_name');
        const nicknameInput = document.getElementById('nickname');
        const messageInput = document.getElementById('message');
        
        if (belongUserNameInput) {
            const belongUserNameInputHandler = function() {
                state.isUserEditing = true;
            };
            utils.addEventListenerWithTracking(belongUserNameInput, 'input', belongUserNameInputHandler);
        }
        
        if (nicknameInput) {
            const nicknameInputHandler = function() {
                state.isUserEditing = true;
            };
            utils.addEventListenerWithTracking(nicknameInput, 'input', nicknameInputHandler);
        }
        
        if (messageInput) {
            const messageInputHandler = function() {
                state.isUserEditing = true;
            };
            utils.addEventListenerWithTracking(messageInput, 'input', messageInputHandler);
        }

        // 添加拖动功能
        const header = container.querySelector('.ant-card-head');
        if (header) {
            makeDraggable(container, header);
        }

        // 处理结果容器的粘贴事件
        const resultContainer = document.getElementById('result-container');
        if (resultContainer) {
            const pasteHandler = function(e) {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text');
                if (text) {
                    // 处理长文本，确保正确换行
                    const processedText = utils.processLongText(text);
                    document.execCommand('insertText', false, processedText);
                }
            };
            utils.addEventListenerWithTracking(resultContainer, 'paste', pasteHandler);
            
            // 监听输入事件，处理手动输入的长文本
            const inputHandler = function() {
                const content = this.textContent || this.innerText;
                if (content && content.length > 1000) {
                    // 如果内容很长，自动处理换行
                    const processedContent = utils.processLongText(content);
                    if (processedContent !== content) {
                        this.innerHTML = processedContent.replace(/\n/g, '<br>');
                        // 将光标移到末尾
                        setTimeout(() => {
                            const range = document.createRange();
                            const selection = window.getSelection();
                            range.selectNodeContents(this);
                            range.collapse(false);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }, 0);
                    }
                }
            };
            utils.addEventListenerWithTracking(resultContainer, 'input', inputHandler);
        }
    }

    // 拖动功能
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.style.cursor = 'move';
        
        const dragMouseDown = function(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };

        const elementDrag = function(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const rect = element.getBoundingClientRect();
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;
            if (newLeft > window.innerWidth - 50) newLeft = window.innerWidth - 50;

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = 'auto';
        };

        const closeDragElement = function() {
            document.onmouseup = null;
            document.onmousemove = null;
        };

        utils.addEventListenerWithTracking(handle, 'mousedown', dragMouseDown);
    }

    // 防抖的页面内容抓取
    const debouncedCapture = utils.debounce(function() {
        if (document.getElementById('qiuwei-chat-assistant')) {
            capturePageContent();
        }
    }, 300);

    // 观察DOM变化
    function observeDOMChanges() {
        const observer = new MutationObserver(utils.debounce(() => {
            adjustButtonPosition();
            if (window.location.href.startsWith(TARGET_URL) &&
                document.getElementById('qiuwei-chat-assistant')) {
                capturePageContent();
            }
        }, 300));

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        state.observers.push(observer);
    }

    // 抓取页面内容
    function capturePageContent(forceCapture = false, retryCount = 0) {
        try {
            if (!window.location.href.startsWith(TARGET_URL)) return;
            if (state.isApiRequestActive && forceCapture) {
                showToast('请求处理中，请稍后再试');
                return;
            }
            if (state.isUserEditing && !forceCapture) {
                return;
            }

            const containers = utils.safeQuerySelectorAll('.ant-spin-container');
            const rootContainer = containers[1];
            
            if (!rootContainer) {
                if (retryCount < 1) {
                    setTimeout(() => capturePageContent(forceCapture, retryCount + 1), 300);
                } else {
                    console.warn('未找到rootContainer，重试后依然失败');
                }
                return;
            }

            // 昵称抓取
            let nickname = '';
            const spaceItems = rootContainer.querySelectorAll('.ant-space-item');
            for (const item of spaceItems) {
                const targetDiv = item.querySelector('div.inline-block.truncate.cursor-text.overflow-hidden');
                if (targetDiv && targetDiv.textContent.trim()) {
                    nickname = utils.sanitizeInput(targetDiv.textContent.trim());
                    break;
                }
            }

            // 群聊昵称后缀
            let tail = '';
            for (const item of spaceItems) {
                const targetDiv = item.querySelector('div.relative.bottom-\\[1px\\]');
                if (targetDiv && targetDiv.textContent.trim()) {
                    tail = utils.sanitizeInput(targetDiv.textContent.trim());
                    break;
                }
            }

            const messageInput = document.getElementById('message');
            const nicknameInput = document.getElementById('nickname');

            if (!forceCapture && nickname === state.lastCapturedNickname && 
                messageInput && messageInput.value.trim() !== '') {
                if (nicknameInput && nickname) {
                    nicknameInput.value = nickname;
                }
                return;
            }

            if (nicknameInput && nickname) {
                nicknameInput.value = nickname;
            }

             // 提取active卡片的name
             let activeCardName = null;
             const activeCard = document.querySelector('.cursor-pointer.active');
             if (activeCard) {
                 // 名称一般在 .text-left.leading-5 内
                 const nameDiv = activeCard.querySelector('.text-left.leading-5');
                 if (nameDiv && nameDiv.textContent) {
                     activeCardName = nameDiv.textContent.trim();
                 }
             }

            // 设置所属用户输入框的值
            const belongUserNameInput = document.getElementById('belong_user_name');
            if (belongUserNameInput && activeCardName) {
                belongUserNameInput.value = activeCardName;
            }

            if ((/群/.test(nickname) && /^\(\d+\)$/.test(tail)) || /^\(\d+\)$/.test(tail)) {
                if (messageInput) {
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                }
                return;
            }

            // 消息内容抓取
            let messages = [];
            // 只获取 style 中 translateY 不等于 -9999px 的 vue-recycle-scroller__item-view 下的 message-item
            let msgItems = [];
            const scrollerViews = rootContainer.querySelectorAll('.vue-recycle-scroller__item-view');
            scrollerViews.forEach(view => {
                const transform = view.style.transform || '';
                // 匹配 translateY 的值
                const match = transform.match(/translateY\((-?\d+)px\)/);
                let y = null;
                if (match) {
                    y = parseInt(match[1], 10);
                }
                // 只保留 translateY 不等于 -9999 的
                if (y !== -9999) {
                    const items = view.querySelectorAll('div.message-item');
                    msgItems = msgItems.concat(Array.from(items));
                }
            });
            // 兼容：如果没有找到，回退原有逻辑
            if (msgItems.length === 0) {
                msgItems = Array.from(rootContainer.querySelectorAll('div.message-item'));
            }
            if (msgItems.length === 0) return;

            const lastMessageItem = msgItems[msgItems.length - 1];
            const wfullDiv = lastMessageItem.querySelector('div.w-full');
            if (!wfullDiv) return;

            const lastChild = wfullDiv.lastElementChild;
            if (!lastChild) return;

            const isLastMessageLeftSide = lastChild.classList.contains('item') && 
                                         lastChild.classList.contains('pr-[6px]') &&
                                         !lastChild.classList.contains('creator');

            if (!isLastMessageLeftSide) {
                if (messageInput) {
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                }
                return;
            }

            let lastRightMessageIndex = -1;
            for (let i = msgItems.length - 1; i >= 0; i--) {
                const item = msgItems[i];
                const itemWfullDiv = item.querySelector('div.w-full');
                if (!itemWfullDiv) continue;
                const rightSideDiv = itemWfullDiv.querySelector('div.creator.item.pr-\\[6px\\]');
                if (rightSideDiv) {
                    lastRightMessageIndex = i;
                    break;
                }
            }

            // if (isGroup) {
            //     let leftMessages = [];
            //     for (let i = msgItems.length - 1; i > lastRightMessageIndex; i--) {
            //         const item = msgItems[i];
            //         const itemWfullDiv = item.querySelector('div.w-full');
            //         if (!itemWfullDiv) continue;
            //         const leftSideDiv = itemWfullDiv.querySelector('div.item.pr-\\[6px\\]');
            //         if (leftSideDiv && !leftSideDiv.classList.contains('creator')) {
            //             const textDiv = leftSideDiv.querySelector('.text');
            //             if (textDiv && textDiv.textContent.trim()) {
            //                 const clonedTextDiv = textDiv.cloneNode(true);
            //                 const imageMasks = clonedTextDiv.querySelectorAll('.ant-image-mask');
            //                 imageMasks.forEach(mask => mask.remove());
            //                 const cleanText = utils.sanitizeInput(clonedTextDiv.textContent.trim());
            //                 if (cleanText && !/^https?:\/\//.test(cleanText)) {
            //                     leftMessages.push(cleanText);
            //                 }
            //             }
            //         }
            //     }
            //     leftMessages = leftMessages.reverse().slice(-5);
            //     messages = leftMessages;
            // } 
            if (lastRightMessageIndex >= 0) {
                for (let i = lastRightMessageIndex + 1; i < msgItems.length; i++) {
                    const item = msgItems[i];
                    const itemWfullDiv = item.querySelector('div.w-full');
                    if (!itemWfullDiv) continue;
                    const leftSideDiv = itemWfullDiv.querySelector('div.item.pr-\\[6px\\]');
                    if (leftSideDiv && !leftSideDiv.classList.contains('creator')) {
                        const textDiv = leftSideDiv.querySelector('.text');
                        if (textDiv && textDiv.textContent.trim()) {
                            const clonedTextDiv = textDiv.cloneNode(true);
                            const imageMasks = clonedTextDiv.querySelectorAll('.ant-image-mask');
                            imageMasks.forEach(mask => mask.remove());
                            const cleanText = utils.sanitizeInput(clonedTextDiv.textContent.trim());
                            if (cleanText && !/^https?:\/\//.test(cleanText)) {
                                messages.push(cleanText);
                            }
                        }
                    }
                }
            } else {
                msgItems.forEach((item) => {
                    const itemWfullDiv = item.querySelector('div.w-full');
                    if (!itemWfullDiv) return;
                    const leftSideDiv = itemWfullDiv.querySelector('div.item.pr-\\[6px\\]');
                    if (leftSideDiv && !leftSideDiv.classList.contains('creator')) {
                        const textDiv = leftSideDiv.querySelector('.text');
                        if (textDiv && textDiv.textContent.trim()) {
                            const clonedTextDiv = textDiv.cloneNode(true);
                            const imageMasks = clonedTextDiv.querySelectorAll('.ant-image-mask');
                            imageMasks.forEach(mask => mask.remove());
                            const cleanText = utils.sanitizeInput(clonedTextDiv.textContent.trim());
                            if (cleanText && !/^https?:\/\//.test(cleanText)) {
                                messages.push(cleanText);
                            }
                        }
                    }
                });
            }

            if (messageInput) {
                if (messages.length > 0) {
                    const combinedMessage = messages.join('\n');
                    messageInput.value = combinedMessage;
                    messageInput.style.height = 'auto';
                    messageInput.style.height = (messageInput.scrollHeight) + 'px';
                } else {
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                }
            }

            if (forceCapture) {
                showToast('已更新最新内容');
            }
            state.lastCapturedNickname = nickname;
        } catch (e) {
            console.error('获取失败:', e);
            showToast('获取失败');
        }
    }

    // 处理提交
    function handleSubmit() {
        const nickname = document.getElementById('nickname')?.value;
        const message = document.getElementById('message')?.value;
        const belong_user_name = document.getElementById('belong_user_name')?.value;
        const submitBtn = document.getElementById('submit-btn');

        if (!nickname || !message) {
            showToast('请填写昵称和消息内容');
            return;
        }

        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';

        resultContainer.innerHTML = '<div style="color: #888;"><span class="ant-loading-dot"></span> 正在处理请求...</div>';

        const processedMessage = utils.preprocessMessage(message);
        state.isApiRequestActive = true;

        setTimeout(() => {
            ajaxRequest({
                method: "POST",
                url: "http://47.97.11.56:8000/api/coze/assistantChat",
                data: JSON.stringify({
                    content: processedMessage,
                    nickname: nickname,
                    belong_user_name: belong_user_name
                }),
                success: function(response) {
                    state.isApiRequestActive = false;
                    try {
                        const result = utils.safeJsonParse(response);
                        if (result && result.code === 200) {
                            resultContainer.innerHTML = utils.formatResponse(result.data.reply || '无回复内容');
                            state.conversation_id = result.data.conversation_id;
                            state.message_id = result.data.message_id;
                        } else {
                            resultContainer.innerHTML = `<div style="color: var(--ant-error-color);">请求失败: ${result?.message || '未知错误'}</div>`;
                        }
                    } catch(e) {
                        console.error('解析响应失败:', e);
                        resultContainer.innerHTML = utils.formatResponse(response) || '<div style="color: var(--ant-error-color);">解析响应失败</div>';
                    }
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                },
                error: function() {
                    state.isApiRequestActive = false;
                    resultContainer.innerHTML = '<div style="color: var(--ant-error-color);">请求失败，请重试</div>';
                    simulateResponse();
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                }
            });
        }, 0);
    }

    // 预处理消息内容
    utils.preprocessMessage = function(message) {
        if (!message) return '';
        return message.replace(/\n{3,}/g, '\n\n');
    };

    // AJAX请求
    function ajaxRequest(options) {
        const { method, url, data, success, error } = options;

        try {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 300000,
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            success(response.responseText);
                        } else {
                            console.error('请求失败:', response.status, response.statusText);
                            error(response);
                        }
                    } catch(e) {
                        console.error('处理响应失败:', e);
                        error(e);
                    }
                },
                onerror: function(err) {
                    console.error('请求错误:', err);
                    error(err);
                },
                ontimeout: function() {
                    console.error('请求超时');
                    error(new Error('请求超时：已等待300秒'));
                }
            });
        } catch (e) {
            console.error('发送请求失败:', e);
            error(e);
        }
    }

    // 格式化响应
    utils.formatResponse = function(text) {
        if (!text) return '';

        let decoded = text.replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&amp;/g, '&')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'");

        // 处理长文本换行
        decoded = utils.processLongText(decoded);

        if (decoded.includes('工作流请求超时') || decoded.includes('请稍后重试')) {
            return `<div style="color: var(--ant-warning-color); font-weight: bold; padding: 8px; background-color: rgba(250, 173, 20, 0.1); border-radius: 4px;">${decoded.replace(/\n/g, '<br>')}</div>`;
        }

        return decoded.replace(/\n/g, '<br>');
    };

    // 模拟响应
    function simulateResponse() {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        setTimeout(() => {
            resultContainer.innerHTML = utils.formatResponse("工作流请求超时,请稍后重试。");
        }, 800);
    }

    // 处理复制
    function handleCopy() {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        const text = resultContainer.innerText;
        copyTextToClipboard(text);
    }

    // 复制到剪贴板
    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('已复制到剪贴板');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    showToast('复制失败，请重试');
                });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                showToast('已复制到剪贴板');
            } catch (err) {
                console.error('复制失败:', err);
                showToast('复制失败，请重试');
            }

            document.body.removeChild(textArea);
        }
    }

    // 处理保存
    function handleSave() {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        const content = resultContainer.innerText;
        const nickname = document.getElementById('nickname')?.value;

        if (content.includes('工作流请求超时') || content.includes('请稍后重试') || content.includes('正在处理请求')) {
            showToast('提示信息不能写入');
            return;
        }

        if (!content || !nickname) {
            showToast('写入内容不能为空');
            return;
        }

        showToast('正在保存...');
        state.isApiRequestActive = true;

        ajaxRequest({
            method: "POST",
            url: "http://47.97.11.56:8000/api/coze/assistantChatWrite",
            data: JSON.stringify({
                conversation_id: state.conversation_id,
                message_id: state.message_id,
                content: content
            }),
            success: function(response) {
                state.isApiRequestActive = false;
                try {
                    const result = utils.safeJsonParse(response);
                    if (result && result.code === 200) {
                        showToast('写入成功');
                        saveToLocalStorage(content);
                    } else {
                        showToast(result?.message || '保存失败');
                    }
                } catch(e) {
                    console.error('解析响应失败:', e);
                    showToast('保存失败: 服务器响应异常');
                }
            },
            error: function() {
                state.isApiRequestActive = false;
                showToast('保存失败: 无法连接到服务器');
                saveToLocalStorage(content);
            }
        });
    }

    // 保存到本地存储
    function saveToLocalStorage(content) {
        try {
            const savedResponses = GM_getValue('savedResponses', []);
            savedResponses.push({
                conversation_id: state.conversation_id,
                message_id: state.message_id,
                content: content,
                timestamp: new Date().toISOString()
            });
            GM_setValue('savedResponses', savedResponses);
            showToast('已保存到本地');
        } catch (e) {
            console.error('本地保存失败:', e);
            showToast('无法保存内容');
        }
    }

    // 显示Toast
    function showToast(message) {
        const existingToast = document.querySelector('.ant-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'ant-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('visible');
            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 100);
            }, 300);
        });
    }

    // 调整按钮位置
    function adjustButtonPosition() {
        if (!state.floatingBtn || !document.body.contains(state.floatingBtn)) return;

        if (!window.location.href.startsWith(TARGET_URL)) {
            hideElements();
            return;
        }

        const chatContainer = utils.safeQuerySelector('.chat-container, .message-list, .conversation-area, .chat-box');
        if (chatContainer) {
            const chatContainerRect = chatContainer.getBoundingClientRect();
            state.floatingBtn.style.position = 'absolute';
            state.floatingBtn.style.top = (chatContainerRect.top - 50) + 'px';
            state.floatingBtn.style.left = 'auto';
            state.floatingBtn.style.right = '20px';
        }
    }

    // 清空输入字段
    function clearInputFields() {
        const belongUserNameInput = document.getElementById('belong_user_name');
        const nicknameInput = document.getElementById('nickname');
        const messageInput = document.getElementById('message');
        
        if (belongUserNameInput) {
            belongUserNameInput.value = '';
        }
        if (nicknameInput) {
            nicknameInput.value = '';
        }
        if (messageInput) {
            messageInput.value = '';
            messageInput.style.height = 'auto';
        }
    }

    // 清空功能
    function handleClear() {
        const messageInput = document.getElementById('message');
        const resultContainer = document.getElementById('result-container');
        
        if (messageInput) messageInput.value = '';
        if (resultContainer) resultContainer.innerHTML = '';
        
        state.conversation_id = '';
        state.message_id = '';
        showToast('已清空内容');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听导航完成事件
    window.addEventListener('load', () => {
        if (!state.initialized) {
            init();
        }
        checkCurrentUrl();
    });

    // 监听SPA路由变化
    window.addEventListener('popstate', checkCurrentUrl);
    window.addEventListener('pushstate', checkCurrentUrl);
    window.addEventListener('replacestate', checkCurrentUrl);

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', cleanup);
})();
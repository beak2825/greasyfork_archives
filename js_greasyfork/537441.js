// ==UserScript==
// @name         MWI公屏聊天全屏
// @version      3.0
// @description  聊天全屏 + 多栏布局 + 自动调整消息数量 + 背景颜色切换 + 全屏输入框
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/537441/MWI%E5%85%AC%E5%B1%8F%E8%81%8A%E5%A4%A9%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/537441/MWI%E5%85%AC%E5%B1%8F%E8%81%8A%E5%A4%A9%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const CONFIG = {
        DEFAULT_LAYOUT: 3,          // 默认三栏布局
        BG_COLORS: [
            { color: '#ffffff', name: '白色' },
            { color: '#f0fff0', name: '护眼绿' },
            { color: '#fff8e7', name: '护眼黄' },
            { color: '#e6f2ff', name: '护眼蓝' }
        ],
        SELECTORS: {
            CHAT: '[class^="ChatHistory_chatHistory"]',
            CHAT_INPUT: '.Chat_chatInput__16dhX'
        },
        MESSAGE_HEIGHT_ESTIMATE: 40, // 预估每条消息的高度（包括间距）
        PADDING: 40,                 // 容器内边距
        INPUT_BOX_HEIGHT: 60         // 输入框区域高度
    };

    // 应用状态
    const state = {
        layoutMode: CONFIG.DEFAULT_LAYOUT,
        messageCount: 0,            // 动态计算，不再固定
        fullscreenMode: false,
        bgColorIndex: 0,
        observer: null,
        allMessages: [],
        firstLoad: true,
        lastCalculatedHeight: 0,    // 记录上次计算的容器高度
        originalInput: null         // 原始输入框引用
    };

    // DOM 元素管理
    const elements = {
        buttons: {},
        chat: null,
        fullscreenInput: null,
        inputContainer: null
    };

    /**
     * 工具函数
     */
    const utils = {
        // 防抖函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 获取聊天元素
        getChatElement() {
            return document.querySelector(CONFIG.SELECTORS.CHAT);
        },

        // 获取原始输入框
        getOriginalInput() {
            return document.querySelector(CONFIG.SELECTORS.CHAT_INPUT);
        },

        // 计算每栏可显示的消息数量
        calculateMessagesPerColumn(chat, forceRecalculate = false) {
            if (!chat) return 20; // 默认值

            const containerHeight = chat.clientHeight - CONFIG.PADDING - CONFIG.INPUT_BOX_HEIGHT;
            const columnHeight = containerHeight;

            // 如果不强制重新计算且容器高度没有变化，返回缓存结果
            if (!forceRecalculate &&
                state.lastCalculatedHeight === containerHeight &&
                state.messageCount > 0) {
                return Math.floor(state.messageCount / state.layoutMode);
            }

            // 临时显示一些消息来测量实际高度
            const testMessages = state.allMessages.slice(-Math.min(50, state.allMessages.length));

            // 先隐藏所有消息，然后显示测试消息
            state.allMessages.forEach(msg => msg.style.display = 'none');
            testMessages.forEach(msg => msg.style.display = 'block');

            // 计算平均消息高度
            let totalHeight = 0;
            let visibleCount = 0;

            testMessages.forEach(msg => {
                const rect = msg.getBoundingClientRect();
                if (rect.height > 0) {
                    totalHeight += rect.height + parseInt(getComputedStyle(msg).marginBottom || 0);
                    visibleCount++;
                }
            });

            const avgMessageHeight = visibleCount > 0 ?
                totalHeight / visibleCount :
                CONFIG.MESSAGE_HEIGHT_ESTIMATE;

            const messagesPerColumn = Math.floor(columnHeight / avgMessageHeight);
            state.lastCalculatedHeight = containerHeight;

            return Math.max(1, messagesPerColumn); // 至少显示1条消息
        },

        // 计算总消息数量
        calculateTotalMessages(chat, forceRecalculate = false) {
            const messagesPerColumn = this.calculateMessagesPerColumn(chat, forceRecalculate);
            return messagesPerColumn * state.layoutMode;
        },

        // 强制DOM回流
        forceReflow(element) {
            return element.offsetHeight;
        },

        // 创建样式字符串
        createStyleString(styles) {
            return Object.entries(styles)
                .map(([key, value]) => `${key}: ${value}`)
                .join('; ');
        },

        // 模拟按键事件
        simulateKeyPress(element, key) {
            const event = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: key,
                code: key === 'Enter' ? 'Enter' : key,
                which: key === 'Enter' ? 13 : key.charCodeAt(0)
            });
            element.dispatchEvent(event);
        },

        // 模拟输入事件
        simulateInput(element, value) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    /**
     * 样式注入
     */
    function injectStyles() {
        if (document.getElementById('mwi-chat-styles')) return;

        const style = document.createElement('style');
        style.id = 'mwi-chat-styles';
        style.textContent = `
            /* 基础消息样式 */
            ${CONFIG.SELECTORS.CHAT} > div {
                margin-bottom: 6px;
                padding-bottom: 2px;
                font-size: 14px;
                line-height: 1.4;
                word-wrap: break-word;
                white-space: pre-wrap;
                word-break: break-word;
                user-select: text;
            }

            /* 全屏聊天样式 */
            .fullscreen-chat {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: calc(100vh - ${CONFIG.INPUT_BOX_HEIGHT}px) !important;
                z-index: 9998 !important;
                overflow-y: auto !important;
                padding: 20px;
                box-sizing: border-box;
                color: #333 !important;
                column-gap: 40px;
                font-size: 16px !important;
                background-color: var(--chat-bg-color, #ffffff);
            }

            .fullscreen-chat > div {
                color: #111 !important;
                break-inside: avoid;
                margin-bottom: 10px;
                transition: opacity 0.3s ease;
            }

            /* 全屏输入框容器 */
            .fullscreen-input-container {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100vw;
                height: ${CONFIG.INPUT_BOX_HEIGHT}px;
                background-color: var(--chat-bg-color, #ffffff);
                border-top: 2px solid #ddd;
                display: flex;
                align-items: center;
                padding: 0 20px;
                box-sizing: border-box;
                z-index: 9999;
            }

            /* 全屏输入框样式 */
            .fullscreen-chat-input {
                flex: 1;
                height: 40px;
                padding: 0 15px;
                border: 1px solid #000;
                border-radius: 20px;
                font-size: 16px;
                outline: none;
                transition: border-color 0.3s ease;
                background-color: #ffffff !important;
                color: #000 !important;
                caret-color: #000 !important;
            }

            .fullscreen-chat-input:focus {
                border-color: #000;
            }

            .fullscreen-chat-input::placeholder {
                color: #666 !important;
            }

            /* 发送按钮样式 */
            .fullscreen-send-btn {
                margin-left: 10px;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }

            .fullscreen-send-btn:hover {
                background-color: #0056b3;
            }

            .fullscreen-send-btn:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }

            /* 按钮基础样式 */
            .mwi-btn {
                position: fixed;
                right: 10px;
                z-index: 9999;
                padding: 10px 15px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                color: white;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transition: background-color 0.3s ease;
            }

            /* 主按钮样式 */
            #fullscreen-toggle-btn {
                top: 10px;
                background-color: #007bff;
            }

            #fullscreen-toggle-btn:hover {
                background-color: #0056b3;
            }

            /* 布局按钮样式 */
            #layout-btn {
                top: 60px;
                background-color: #6c757d;
                display: none;
            }

            #layout-btn:hover {
                background-color: #5a6268;
            }

            /* 背景颜色按钮样式 */
            #bgcolor-btn {
                top: 110px;
                background-color: #28a745;
                display: none;
            }

            #bgcolor-btn:hover {
                background-color: #218838;
            }

            /* 响应式调整 */
            @media (max-width: 768px) {
                .fullscreen-chat {
                    padding: 10px;
                    column-gap: 20px;
                }

                .mwi-btn {
                    font-size: 12px;
                    padding: 8px 12px;
                }

                .fullscreen-input-container {
                    padding: 0 10px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 输入框管理
     */
    const inputManager = {
        // 创建全屏输入框
        createFullscreenInput() {
            if (elements.inputContainer) return;

            // 创建输入框容器
            const container = document.createElement('div');
            container.className = 'fullscreen-input-container';
            container.style.display = 'none';

            // 创建输入框
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'fullscreen-chat-input';
            input.placeholder = '输入消息...';

            // 创建发送按钮
            const sendBtn = document.createElement('button');
            sendBtn.className = 'fullscreen-send-btn';
            sendBtn.textContent = '发送';

            // 组装元素
            container.appendChild(input);
            container.appendChild(sendBtn);
            document.body.appendChild(container);

            // 保存引用
            elements.inputContainer = container;
            elements.fullscreenInput = input;

            // 绑定事件
            this.bindInputEvents(input, sendBtn);

            console.log('全屏输入框创建完成');
        },

        // 绑定输入框事件
        bindInputEvents(input, sendBtn) {
            // 回车发送
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // 按钮发送
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });

            // 输入时更新按钮状态
            input.addEventListener('input', () => {
                sendBtn.disabled = !input.value.trim();
            });

            // 初始化按钮状态
            sendBtn.disabled = true;
        },

        // 发送消息
        sendMessage() {
            const message = elements.fullscreenInput.value.trim();
            if (!message) return;

            const originalInput = utils.getOriginalInput();
            if (!originalInput) {
                alert('❗ 找不到原始输入框，无法发送消息');
                return;
            }

            try {
                // 聚焦原始输入框
                originalInput.focus();

                // 设置输入内容
                utils.simulateInput(originalInput, message);

                // 模拟回车发送
                setTimeout(() => {
                    utils.simulateKeyPress(originalInput, 'Enter');

                    // 清空全屏输入框
                    elements.fullscreenInput.value = '';
                    elements.fullscreenInput.dispatchEvent(new Event('input', { bubbles: true }));

                    console.log('消息已发送:', message);
                }, 50);

            } catch (error) {
                console.error('发送消息失败:', error);
                alert('❗ 发送消息失败，请检查页面状态');
            }
        },

        // 显示输入框
        showInput() {
            if (elements.inputContainer) {
                elements.inputContainer.style.display = 'flex';
                // 聚焦输入框
                setTimeout(() => {
                    if (elements.fullscreenInput) {
                        elements.fullscreenInput.focus();
                    }
                }, 100);
            }
        },

        // 隐藏输入框
        hideInput() {
            if (elements.inputContainer) {
                elements.inputContainer.style.display = 'none';
                // 清空输入框
                if (elements.fullscreenInput) {
                    elements.fullscreenInput.value = '';
                }
            }
        },

        // 更新输入框背景色
        updateInputBgColor() {
            if (elements.inputContainer) {
                const currentBg = CONFIG.BG_COLORS[state.bgColorIndex];
                elements.inputContainer.style.backgroundColor = currentBg.color;
            }
        }
    };

    /**
     * 按钮创建和管理
     */
    const buttonManager = {
        // 创建主切换按钮
        createToggleButton() {
            const button = document.createElement('button');
            button.id = 'fullscreen-toggle-btn';
            button.className = 'mwi-btn';
            button.textContent = '聊天全屏';

            button.addEventListener('click', chatManager.toggleFullscreen.bind(chatManager));

            if (!document.getElementById('fullscreen-toggle-btn')) {
                document.body.appendChild(button);
                elements.buttons.toggle = button;
            }
        },

        // 创建布局切换按钮
        createLayoutButton() {
            const button = document.createElement('button');
            button.id = 'layout-btn';
            button.className = 'mwi-btn';
            button.textContent = '布局: 三栏';

            button.addEventListener('click', layoutManager.toggleLayout.bind(layoutManager));

            if (!document.getElementById('layout-btn')) {
                document.body.appendChild(button);
                elements.buttons.layout = button;
            }
        },

        // 创建背景颜色按钮
        createBgColorButton() {
            const button = document.createElement('button');
            button.id = 'bgcolor-btn';
            button.className = 'mwi-btn';
            button.textContent = '背景: 白色';

            button.addEventListener('click', backgroundManager.toggleBgColor.bind(backgroundManager));

            if (!document.getElementById('bgcolor-btn')) {
                document.body.appendChild(button);
                elements.buttons.bgcolor = button;
            }
        },

        // 更新按钮文本
        updateButtonText(buttonId, text) {
            const button = elements.buttons[buttonId] || document.getElementById(buttonId);
            if (button) {
                button.textContent = text;
            }
        },

        // 显示/隐藏辅助按钮
        toggleAuxiliaryButtons(show) {
            const buttons = ['layout-btn', 'bgcolor-btn'];
            buttons.forEach(id => {
                const button = document.getElementById(id);
                if (button) {
                    button.style.display = show ? 'block' : 'none';
                }
            });
        }
    };

    /**
     * 布局管理
     */
    const layoutManager = {
        // 切换布局模式
        toggleLayout() {
            state.layoutMode = (state.layoutMode % 3) + 1;
            this.updateLayout();
        },

        // 更新布局
        updateLayout() {
            const chat = utils.getChatElement();
            if (!chat || !chat.classList.contains('fullscreen-chat')) return;

            const layoutNames = ['一栏', '两栏', '三栏'];

            buttonManager.updateButtonText('layout', `布局: ${layoutNames[state.layoutMode - 1]}`);
            chat.style.columnCount = state.layoutMode;

            // 强制重新计算并应用消息数量
            utils.forceReflow(chat); // 确保布局更新

            // 延迟执行以确保DOM完全更新
            setTimeout(() => {
                messageManager.recalculateAndApply();
            }, 50);

            console.log(`切换到${layoutNames[state.layoutMode - 1]}布局`);
        }
    };

    /**
     * 背景管理
     */
    const backgroundManager = {
        // 切换背景颜色
        toggleBgColor() {
            state.bgColorIndex = (state.bgColorIndex + 1) % CONFIG.BG_COLORS.length;
            this.updateBgColor();
        },

        // 更新背景颜色
        updateBgColor() {
            const chat = utils.getChatElement();
            if (!chat || !chat.classList.contains('fullscreen-chat')) return;

            const currentBg = CONFIG.BG_COLORS[state.bgColorIndex];
            buttonManager.updateButtonText('bgcolor', `背景: ${currentBg.name}`);

            // 使用CSS自定义属性
            document.documentElement.style.setProperty('--chat-bg-color', currentBg.color);

            // 更新输入框背景色
            inputManager.updateInputBgColor();
        }
    };

    /**
     * 消息管理
     */
    const messageManager = {
        // 应用消息数量限制
        applyMessageLimit() {
            const chat = utils.getChatElement();
            if (!chat || state.allMessages.length === 0) return;

            // 先隐藏所有消息
            state.allMessages.forEach(msg => msg.style.display = 'none');

            // 显示最近的消息
            const recentMessages = state.allMessages.slice(-state.messageCount);
            recentMessages.forEach(msg => msg.style.display = 'block');

            console.log(`当前显示最近 ${recentMessages.length} 条消息，分 ${state.layoutMode} 栏显示`);
        },

        // 重新计算并应用消息限制（用于分栏切换）
        recalculateAndApply() {
            const chat = utils.getChatElement();
            if (!chat || !chat.classList.contains('fullscreen-chat')) return;

            // 更新消息列表
            state.allMessages = Array.from(chat.children);

            // 强制重新计算消息数量
            state.messageCount = utils.calculateTotalMessages(chat, true);

            // 应用新的消息限制
            this.applyMessageLimit();
        },

        // 设置消息观察器
        setupObserver(chat) {
            this.disconnectObserver();

            state.observer = new MutationObserver(utils.debounce((mutations) => {
                let shouldUpdate = false;

                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        state.allMessages = Array.from(chat.children);
                        shouldUpdate = true;
                    }
                });

                if (shouldUpdate) {
                    // 新消息到达时，使用当前的消息数量设置，不重新计算
                    this.applyMessageLimit();
                }
            }, 100));

            state.observer.observe(chat, {
                childList: true,
                subtree: false
            });
        },

        // 断开观察器
        disconnectObserver() {
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }
        },

        // 重置消息显示
        resetMessageDisplay() {
            state.allMessages.forEach(msg => msg.style.display = 'block');
            state.allMessages = [];
            state.lastCalculatedHeight = 0; // 重置高度缓存
            state.messageCount = 0; // 重置消息计数
        }
    };

    /**
     * 聊天管理
     */
    const chatManager = {
        // 切换全屏模式
        toggleFullscreen() {
            const chat = utils.getChatElement();
            if (!chat) {
                alert('❗ 找不到聊天区域');
                return;
            }

            state.fullscreenMode = !chat.classList.contains('fullscreen-chat');

            if (state.fullscreenMode) {
                this.enterFullscreen(chat);
            } else {
                this.exitFullscreen(chat);
            }
        },

        // 进入全屏模式
        enterFullscreen(chat) {
            chat.classList.add('fullscreen-chat');
            buttonManager.updateButtonText('toggle', '退出全屏');
            buttonManager.toggleAuxiliaryButtons(true);

            utils.forceReflow(chat);

            // 获取所有消息
            state.allMessages = Array.from(chat.children);

            messageManager.setupObserver(chat);
            layoutManager.updateLayout();
            backgroundManager.updateBgColor();

            // 显示输入框
            inputManager.showInput();

            state.firstLoad = false;
        },

        // 退出全屏模式
        exitFullscreen(chat) {
            chat.classList.remove('fullscreen-chat');
            buttonManager.updateButtonText('toggle', '聊天全屏');
            buttonManager.toggleAuxiliaryButtons(false);

            messageManager.disconnectObserver();
            messageManager.resetMessageDisplay();

            // 隐藏输入框
            inputManager.hideInput();

            state.firstLoad = true;
        }
    };

    /**
     * 初始化管理
     */
    const initManager = {
        // 等待聊天区域加载
        waitForChat() {
            const observer = new MutationObserver((mutations, obs) => {
                const chat = utils.getChatElement();
                if (chat) {
                    this.initializePlugin();
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 设置超时，避免无限等待
            setTimeout(() => {
                observer.disconnect();
                console.warn('MWI Chat Plugin: 等待聊天区域超时');
            }, 10000);
        },

        // 初始化插件
        initializePlugin() {
            injectStyles();
            buttonManager.createToggleButton();
            buttonManager.createLayoutButton();
            buttonManager.createBgColorButton();
            inputManager.createFullscreenInput();
            this.bindEvents();

            console.log('MWI Chat Plugin: 初始化完成');
        },

        // 绑定事件
        bindEvents() {
            // 窗口大小变化事件 - 需要重新计算消息数量
            window.addEventListener('resize', utils.debounce(() => {
                const chat = utils.getChatElement();
                if (chat && chat.classList.contains('fullscreen-chat')) {
                    // 窗口大小变化时重新计算并应用
                    messageManager.recalculateAndApply();
                }
            }, 250));

            // 页面卸载清理
            window.addEventListener('beforeunload', () => {
                messageManager.disconnectObserver();
            });
        }
    };

    /**
     * 主程序入口
     */
    function main() {
        // 检查页面是否已加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initManager.waitForChat.bind(initManager));
        } else {
            initManager.waitForChat();
        }
    }

    // 启动插件
    main();

})();
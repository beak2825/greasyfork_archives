// ==UserScript==
// @name         我要喝咖啡
// @namespace    https://xyk-h5.mxbc.net/*
// @version      3.5
// @author       PedroZ
// @description  咖啡
// @homepage     https://linux.do/t/topic/165279
// @homepageURL  https://linux.do/t/topic/165279
// @match        https://xyk-h5.mxbc.net/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502841/%E6%88%91%E8%A6%81%E5%96%9D%E5%92%96%E5%95%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/502841/%E6%88%91%E8%A6%81%E5%96%9D%E5%92%96%E5%95%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 常量定义
    const CONSTANTS = {
        SCRIPT_ENABLED_KEY: 'scriptEnabled',
        TOKENS_KEY: 'accessTokens',
        RESPONSE_LOG_KEY: 'responseLog',
        ROUND_INTERVAL_KEY: 'roundInterval',
        DEFAULT_ROUND_INTERVAL: 1500, //请求时间间隔（毫秒）
        EXECUTION_DURATION: 30, //可执行时间（秒），当时间点过了以后在这个时间段内进入依然会开始请求
        EXECUTION_TIMES: [
            { hour: 11, minute: 0 },
            { hour: 12, minute: 0 },
            { hour: 13, minute: 0 },
            { hour: 14, minute: 0 },
            { hour: 15, minute: 0 },
            { hour: 16, minute: 0 },
            { hour: 17, minute: 0 },
            { hour: 18, minute: 0 },
            { hour: 9, minute: 0 },
            { hour: 10, minute: 0 }
        ]
    };

    // 工具函数
    const Utils = {
        getLocalStorageItem(key, defaultValue) {
            const value = localStorage.getItem(key);
            return value !== null ? JSON.parse(value) : defaultValue;
        },

        setLocalStorageItem(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },

        ensurePanelInteractivity() {
            const panel = document.getElementById('blurContainer');
            if (panel) {
                const isUnclickable = document.body.classList.contains('van-toast--unclickable');
                if (isUnclickable) {
                    panel.style.pointerEvents = 'auto';
                    panel.style.zIndex = '2147483647';
                    Array.from(panel.getElementsByTagName('*')).forEach(element => {
                        element.style.pointerEvents = 'auto';
                    });
                } else {
                    panel.style.pointerEvents = '';
                    Array.from(panel.getElementsByTagName('*')).forEach(element => {
                        element.style.pointerEvents = '';
                    });
                }
            }
            requestAnimationFrame(Utils.ensurePanelInteractivity);
        }
    };

    const NotificationManager = {
        container: null,

        init() {
            this.createContainer();
            this.addStyles();
        },

        createContainer() {
            if (!document.getElementById('custom-notification-container')) {
                this.container = document.createElement('div');
                this.container.id = 'custom-notification-container';
                document.body.appendChild(this.container);
            } else {
                this.container = document.getElementById('custom-notification-container');
            }
        },

        addStyles() {
            const styles = `
              #custom-notification-container {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  z-index: 2147483647;
              }
              .custom-notification {
                  background-color: #ffffff;
                  color: #333333;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                  margin-bottom: 10px;
                  padding: 12px 20px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  min-width: 200px;
                  max-width: 330px;
                  opacity: 0;
                  transform: translateX(100%);
                  transition: all 0.3s ease-in-out;
                  text-align: left;
              }
              .custom-notification.show {
                  opacity: 1;
                  transform: translateX(0);
              }
              .custom-notification-content {
                  flex-grow: 1;
                  margin-right: 10px;
              }
              .custom-notification-close {
                  cursor: pointer;
                  font-size: 18px;
                  color: #999999;
              }
              .custom-notification-icon {
                  margin-right: 12px;
                  font-size: 20px;
              }
              .custom-notification.success .custom-notification-icon { color: #4CAF50; }
              .custom-notification.error .custom-notification-icon { color: #F44336; }
              .custom-notification.warn .custom-notification-icon { color: #FFC107; }
          `;
            GM_addStyle(styles);
        },

        createNotification(message, type = 'info', isPersistent = false) {
            const notification = document.createElement('div');
            notification.className = `custom-notification ${type}`;

            const icon = document.createElement('span');
            icon.className = 'custom-notification-icon';
            icon.innerHTML = this.getIconForType(type);

            const content = document.createElement('span');
            content.className = 'custom-notification-content';
            content.textContent = message;

            const closeBtn = document.createElement('span');
            closeBtn.className = 'custom-notification-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => this.removeNotification(notification);

            notification.appendChild(icon);
            notification.appendChild(content);
            notification.appendChild(closeBtn);

            this.container.appendChild(notification);

            // 使用 requestAnimationFrame 来确保通知显示
            window.requestAnimationFrame(() => {
                notification.classList.add('show');
            });

            if (!isPersistent) {
                window.setTimeout(() => {
                    this.removeNotification(notification);
                }, 2000);
            }
        },

        removeNotification(notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode === this.container) {
                    this.container.removeChild(notification);
                }
            }, 300);
        },

        getIconForType(type) {
            switch (type) {
                case 'success': return '✓';
                case 'error': return '✗';
                case 'warn': return '⚠';
                default: return 'ℹ';
            }
        },

        show(message, isPersistent = false) {
            this.createNotification(message, 'info', isPersistent);
        },

        success(message, isPersistent = false) {
            this.createNotification(message, 'success', isPersistent);
        },

        error(message, isPersistent = false) {
            this.createNotification(message, 'error', isPersistent);
        },

        warn(message, isPersistent = false) {
            this.createNotification(message, 'warn', isPersistent);
        }
    };

    const UIManager = {
        createFloatingPanel() {
            const style = document.createElement('style');
            style.textContent = `
                #blurContainer {
                    position: fixed !important;
                    top: 10px !important;
                    left: 0 !important;
                    width: 280px !important;
                    height: 480px !important;
                    z-index: 2147483646 !important;
                    transition: transform 0.3s ease !important;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                    display: flex !important;
                    align-items: center !important;
                }

                #blurContainer.hidden {
                    transform: translateX(-280px);
                }

                #panelContent {
                    width: 280px;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    overflow: hidden;
                    border-radius: 0 10px 10px 0;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
                }

                #toggleButton {
                    position: absolute !important;
                    right: -24px !important;
                    top: 190px !important;
                    width: 24px !important;
                    height: 100px !important;
                    cursor: pointer !important;
                    background-color: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border-radius: 0 100px 100px 0 / 0 50px 50px 0;
                    box-shadow: 4px 0 6px rgba(0, 0, 0, 0.1);
                    z-index: 2147483646 !important;
                }

                #toggleButton::before {
                    content: '';
                    position: absolute;
                    width: 4px;
                    height: 40px;
                    background-color: #888;
                    border-radius: 2px;
                    top: 50%;
                    left: 10px;
                    transform: translateY(-50%);
                }


                #tabContainer {
                    display: flex;
                }

                .tab {
                    padding: 10px;
                    cursor: pointer;
                    flex: 1;
                    text-align: center;
                }

                .tab.状态-tab:not(.active) {
                    box-shadow: -1px -2px 5px 0px rgba(0, 0, 0, 0.3) inset;
                }

                .tab.设置-tab:not(.active) {
                    box-shadow: 1px -2px 5px 0px rgba(0, 0, 0, 0.3) inset
                }

                #contentArea {
                    overflow: visible;
                    flex-grow: 1;
                    overflow: hidden;
                    padding: 5px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }

                .panel-title {
                    font-weight: bold !important;
                    font-size: 16px !important;
                }

                .section-title {
                    font-weight: bold !important;
                    font-size: 14px !important;
                    margin-bottom: 5px !important;
                }

                #statusPage, #settingsPage {
                    display: none;
                    height: 100%;
                    overflow-y: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                    flex-direction: column;
                    padding-top: 5px;
                    padding-bottom: 8px;
                    padding-left: 3px;
                    padding-right: 5px;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

                #statusPage.active, #settingsPage.active {
                    display: flex;
                    flex-direction: column;
                }

                #scriptStatusDisplay {
                    background-color: rgba(0, 0, 0, 0.1);
                    color: #333;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    flex-shrink: 0;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                #responseLogContainer {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                }

                #responseLogHeader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }

                #responseLogDisplay {
                    background-color: rgba(0, 0, 0, 0.1);
                    color: #333;
                    padding: 10px;
                    border-radius: 5px;
                    overflow-y: auto;
                    font-size: 11px;
                    flex-grow: 1;
                    scrollbar-width: thin;
                    scrollbar-color: #888 #f1f1f1;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                }

                #statusPage, #settingsPage, #responseLogDisplay {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(136, 136, 136, 0.5) transparent;
                }

                #statusPage::-webkit-scrollbar,
                #responseLogDisplay::-webkit-scrollbar {
                    width: 8px;
                }

                #settingsPage::-webkit-scrollbar {
                    width: 8px;
                    margin-left: 5px; /* 添加左侧空白 */
                }

                #statusPage::-webkit-scrollbar-track,
                #settingsPage::-webkit-scrollbar-track,
                #responseLogDisplay::-webkit-scrollbar-track {
                    background: transparent;
                }

                #statusPage::-webkit-scrollbar-thumb,
                #settingsPage::-webkit-scrollbar-thumb,
                #responseLogDisplay::-webkit-scrollbar-thumb {
                    background-color: rgba(136, 136, 136, 0.5);
                    border-radius: 4px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }

                #statusPage::-webkit-scrollbar-thumb:hover,
                #settingsPage::-webkit-scrollbar-thumb:hover,
                #responseLogDisplay::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(136, 136, 136, 0.8);
                }

                #statusPage::-webkit-scrollbar-thumb:active,
                #settingsPage::-webkit-scrollbar-thumb:active,
                #responseLogDisplay::-webkit-scrollbar-thumb:active {
                    background-color: rgba(136, 136, 136, 1);
                }

                #statusPage, #settingsPage, #responseLogDisplay {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(136, 136, 136, 0.5) transparent;
                }

                #statusPage:hover, #settingsPage:hover, #responseLogDisplay:hover {
                    scrollbar-color: rgba(136, 136, 136, 0.8) transparent;
                }

                /* 为 #settingsPage 添加右内边距 */
                #settingsPage {
                    padding-right: 5px;
                }


                @media screen and (min-width: 2560px) {
                    #blurContainer {
                        font-size: 20px !important;
                    }
                }

                @media screen and (min-width: 3840px) {
                    #blurContainer {
                        font-size: 24px !important;
                    }
                }
            `;
            document.head.appendChild(style);

            const blurContainer = document.createElement('div');
            blurContainer.id = 'blurContainer';
            blurContainer.addEventListener('touchstart', this.preventPropagation, { passive: true });
            blurContainer.addEventListener('touchmove', this.preventPropagation, { passive: true });
            blurContainer.addEventListener('touchend', this.preventPropagation, { passive: true });

            const panelContent = document.createElement('div');
            panelContent.id = 'panelContent';

            const toggleButton = document.createElement('div');
            toggleButton.id = 'toggleButton';
            toggleButton.addEventListener('click', this.togglePanel);

            const tabContainer = this.createTabContainer();
            const contentArea = document.createElement('div');
            contentArea.id = 'contentArea';

            const statusPage = this.createStatusPage();
            const settingsPage = this.createSettingsPage();

            contentArea.appendChild(statusPage);
            contentArea.appendChild(settingsPage);

            panelContent.appendChild(tabContainer);
            panelContent.appendChild(contentArea);

            blurContainer.appendChild(panelContent);
            blurContainer.appendChild(toggleButton);

            document.body.appendChild(blurContainer);

            this.switchTab('状态');
            // 为可滚动元素添加特殊处理
            this.handleScrollableElements();
        },

        preventPropagation(event) {
            // 只阻止事件冒泡，不阻止默认行为
            event.stopPropagation();
        },

        handleScrollableElements() {
            const scrollableElements = document.querySelectorAll('#statusPage, #settingsPage, #responseLogDisplay');
            scrollableElements.forEach(element => {
                element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
                element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            });
        },

        handleTouchStart(event) {
            this.lastTouchY = event.touches[0].clientY;
        },

        handleTouchMove(event) {
            const element = event.currentTarget;
            const touchY = event.touches[0].clientY;
            const deltaY = touchY - this.lastTouchY;

            // 检查是否到达滚动边界
            if (this.isAtScrollBoundary(element, deltaY)) {
                event.preventDefault();
            } else {
                // 更新最后触摸位置
                this.lastTouchY = touchY;
            }

            // 始终阻止事件传播到底层页面
            event.stopPropagation();
        },

        isAtScrollBoundary(element, deltaY) {
            const { scrollTop, scrollHeight, clientHeight } = element;
            // 检查是否在顶部且试图向下滚动，或在底部且试图向上滚动
            return (scrollTop <= 0 && deltaY > 0) ||
                   (scrollTop + clientHeight >= scrollHeight && deltaY < 0);
        },
        addResizeHandle() {
            const resizeHandle = document.createElement('div');
            resizeHandle.id = 'resizeHandle';
            resizeHandle.style.cssText = `
                position: absolute;
                right: 0;
                bottom: 0;
                width: 10px;
                height: 10px;
                cursor: se-resize;
            `;

            const blurContainer = document.getElementById('blurContainer');
            blurContainer.appendChild(resizeHandle);

            let isResizing = false;
            let startX, startY, startWidth, startHeight;

            resizeHandle.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(blurContainer).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(blurContainer).height, 10);
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                const width = startWidth + e.clientX - startX;
                const height = startHeight + e.clientY - startY;
                blurContainer.style.width = `${width}px`;
                blurContainer.style.height = `${height}px`;
            });

            document.addEventListener('mouseup', () => {
                isResizing = false;
            });
        },

        // 在创建面板后调用此方法
        initialize() {
            this.createFloatingPanel();
            this.addResizeHandle();
            this.adjustForHighDPI();
        },

        // 根据设备像素比调整大小
        adjustForHighDPI() {
            const dpr = window.devicePixelRatio || 1;
            if (dpr > 1) {
                const blurContainer = document.getElementById('blurContainer');
                const scale = 1 + (dpr - 1) * 0.5; // 根据DPR适度增加大小
                blurContainer.style.transform = `scale(${scale})`;
                blurContainer.style.transformOrigin = 'top left';
            }
        },

        togglePanel() {
            const blurContainer = document.getElementById('blurContainer');
            blurContainer.classList.toggle('hidden');
        },

        createTabContainer() {
            const tabContainer = document.createElement('div');
            tabContainer.id = 'tabContainer';

            const statusTab = this.createTab('状态', true);
            const settingsTab = this.createTab('设置', false);

            tabContainer.appendChild(statusTab);
            tabContainer.appendChild(settingsTab);

            return tabContainer;
        },

        createTab(text, isActive) {
            const tab = document.createElement('div');
            tab.textContent = text;
            tab.className = `tab ${isActive ? 'active' : ''} ${text.toLowerCase()}-tab`;
            tab.addEventListener('click', () => this.switchTab(text));
            return tab;
        },

        switchTab(tabName) {
            const tabs = document.querySelectorAll('.tab');
            const statusPage = document.getElementById('statusPage');
            const settingsPage = document.getElementById('settingsPage');

            tabs.forEach(tab => tab.classList.remove('active'));
            statusPage.classList.remove('active');
            settingsPage.classList.remove('active');

            if (tabName === '状态') {
                tabs[0].classList.add('active');
                statusPage.classList.add('active');
                LogManager.scrollLogToBottom();
            } else {
                tabs[1].classList.add('active');
                settingsPage.classList.add('active');
            }
        },

        createStatusPage() {
            const statusPage = document.createElement('div');
            statusPage.id = 'statusPage';
            statusPage.style.cssText = `
                overflow-y: auto;
                height: 100%;
            `;

            const headerContainer = document.createElement('div');
            headerContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding: 0 5px;
            `;

            const versionInfo = document.createElement('span');
            versionInfo.textContent = `我要喝奶茶 v${GM_info.script.version}`;
            versionInfo.className = 'panel-title';
            versionInfo.style.marginLeft = '3px';

            const toggleButton = this.createToggleButton();
            toggleButton.style.marginRight = '3px';

            headerContainer.appendChild(versionInfo);
            headerContainer.appendChild(toggleButton);

            const statusDisplay = this.createStatusDisplay();

            const responseLogContainer = document.createElement('div');
            responseLogContainer.id = 'responseLogContainer';

            const responseLogHeader = document.createElement('div');
            responseLogHeader.id = 'responseLogHeader';
            responseLogHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
                padding: 0 5px;
            `;

            const responseLogTitle = document.createElement('div');
            responseLogTitle.textContent = '日志';
            responseLogTitle.className = 'section-title';
            responseLogTitle.style.cssText = `
                display: flex;
                align-items: center;
                margin: 0;
                padding: 0;
                margin-left: 3px;
            `;

            const clearLogButton = document.createElement('button');
            clearLogButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19Z" /></svg>`;
            clearLogButton.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                padding: 0;
                margin: 0;
                line-height: 1;
                display: flex;
                align-items: center;
                color: inherit;
                marginRight = '3px';
            `;
            clearLogButton.title = '清除日志';
            // 设置SVG的填充颜色为currentColor
            const svgElement = clearLogButton.querySelector('svg');
            svgElement.style.fill = 'currentColor';
            clearLogButton.addEventListener('click', LogManager.clearResponseLog);

            responseLogHeader.appendChild(responseLogTitle);
            responseLogHeader.appendChild(clearLogButton);

            const responseLog = this.createResponseLog();

            responseLogContainer.appendChild(responseLogHeader);
            responseLogContainer.appendChild(responseLog);

            statusPage.appendChild(headerContainer);
            statusPage.appendChild(statusDisplay);
            statusPage.appendChild(responseLogContainer);

            return statusPage;
        },

        createSettingsPage() {
            const settingsPage = document.createElement('div');
            settingsPage.id = 'settingsPage';
            settingsPage.style.cssText = `
                overflow-y: auto;
                height: 100%;
            `;
            const settingsContent = document.createElement('div');
            settingsContent.style.cssText = 'display: flex; flex-direction: column;';

            const secretInput = this.createSettingItem('口令', 'secretInput', 'text', 'secretKey', '');
            settingsContent.appendChild(secretInput);
            
            const roundIntervalContainer = this.createSettingItem('间隔时间(ms)', 'roundIntervalInput', 'number', CONSTANTS.ROUND_INTERVAL_KEY, CONSTANTS.DEFAULT_ROUND_INTERVAL);
            const tokenManagement = this.createSettingItem('Token 管理', 'accessTokenInput', 'text', '', '', true);

            settingsContent.appendChild(roundIntervalContainer);
            settingsContent.appendChild(tokenManagement);

            settingsPage.appendChild(settingsContent);

            return settingsPage;
        },

        createSettingItem(labelText, inputId, inputType, storageKey, defaultValue, isTokenManagement = false) {
            const container = document.createElement('div');
            container.style.marginBottom = '20px';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.className = 'section-title';
            label.style.display = 'block';
            label.style.marginBottom = '8px';

            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = 'display: flex; align-items: center; background: rgba(255, 255, 255, 0.2); border-radius: 5px; overflow: hidden; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);';

            const input = document.createElement('input');
            input.id = inputId;
            input.type = inputType;
            let currentValue = isTokenManagement ? '' : (Utils.getLocalStorageItem(storageKey) || defaultValue.toString());
            input.value = currentValue;
            input.placeholder = isTokenManagement ? '输入 accessToken' : '';
            input.style.cssText = `
                flex-grow: 1;
                padding: 10px;
                border: none;
                background: transparent;
                color: #333;
                font-size: 14px;
                outline: none;
                min-width: 0; // 允许输入框在必要时缩小
            `;

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                white-space: nowrap; // 防止按钮换行
            `;

            const button = document.createElement('button');
            button.textContent = isTokenManagement ? '添加' : '设置';
            button.style.cssText = `
                padding: 10px 15px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            `;

            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#45a049';
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4CAF50';
            });

            button.addEventListener('click', () => {
                const value = input.value.trim();
                if (value) {
                    if (isTokenManagement) {
                        if (ConfigManager.addToken(value)) {
                            input.value = '';
                            NotificationManager.success('Token 添加成功');
                        }
                    } else if (inputId === 'secretInput') {
                        ConfigManager.setSecret(value);
                        NotificationManager.success('口令已保存');
                    } else {
                        const numericValue = Number(value);
                        if (!isNaN(numericValue)) {
                            const updateResult = ConfigManager.updateSettings({ [storageKey]: numericValue });
                            if (updateResult) {
                                NotificationManager.success('设置更新成功');
                                currentValue = value;
                            } else {
                                input.value = currentValue;
                            }
                        } else {
                            NotificationManager.warn('请输入有效的数字');
                            input.value = currentValue;
                        }
                    }
                } else {
                    NotificationManager.warn('请输入有效的值');
                    if (!isTokenManagement) {
                        input.value = currentValue;
                    }
                }
            });

            buttonContainer.appendChild(button);
            inputContainer.appendChild(input);
            inputContainer.appendChild(buttonContainer);

            container.appendChild(label);
            container.appendChild(inputContainer);

            if (isTokenManagement) {
                const tokenList = document.createElement('div');
                tokenList.id = 'tokenList';
                tokenList.style.marginTop = '10px';
                container.appendChild(tokenList);
            }

            return container;
        },

        createToggleButton() {
            const button = document.createElement('button');
            button.id = 'scriptToggleButton';
            button.style.cssText = `
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                min-width: 70px;
                transition: background-color 0.3s;
                margin-left: auto;
            `;

            const isEnabled = Utils.getLocalStorageItem(CONSTANTS.SCRIPT_ENABLED_KEY, false);
            this.updateButtonState(button, isEnabled);

            button.addEventListener('click', () => GlobalController.toggleScript());
            return button;
        },

        updateButtonState(button, isEnabled) {
            button.textContent = isEnabled ? '停止' : '启动';
            button.style.backgroundColor = isEnabled ? '#f44336' : '#4CAF50';
        },

        createStatusDisplay() {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'scriptStatusDisplay';
            return statusDiv;
        },

        createResponseLog() {
            const logDiv = document.createElement('div');
            logDiv.id = 'responseLogDisplay';
            return logDiv;
        },

        updateTokenList() {
            const tokenList = document.getElementById('tokenList');
            let tokens = ConfigManager.getTokens();

            if (tokenList) {
                tokenList.innerHTML = '';
                tokens.forEach((tokenObj, index) => {
                    const tokenElement = document.createElement('div');
                    tokenElement.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 5px;
                        padding: 5px;
                        border-radius: 3px;
                    `;

                    const leftPart = document.createElement('div');
                    leftPart.style.display = 'flex';
                    leftPart.style.alignItems = 'center';
                    leftPart.style.flexGrow = '1';
                    leftPart.style.minWidth = '0'; // 允许在必要时缩小

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = tokenObj.enabled !== false;
                    checkbox.addEventListener('change', () => ConfigManager.toggleToken(index));

                    const tokenText = document.createElement('span');
                    tokenText.textContent = tokenObj.token ? '...' + tokenObj.token.slice(-10) : 'Invalid Token';
                    tokenText.style.marginLeft = '20px';
                    tokenText.style.overflow = 'hidden';
                    tokenText.style.textOverflow = 'ellipsis';
                    tokenText.style.whiteSpace = 'nowrap';

                    leftPart.appendChild(checkbox);
                    leftPart.appendChild(tokenText);

                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.marginLeft = '5px';

                    const setButton = document.createElement('button');
                    setButton.textContent = '设定';
                    setButton.style.cssText = `
                        padding: 2px 5px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        margin-right: 5px;
                        font-size: 12px;
                    `;
                    setButton.addEventListener('click', () => ConfigManager.setToken(tokenObj.token));

                    const removeButton = document.createElement('button');
                    removeButton.textContent = '删除';
                    removeButton.style.cssText = `
                        padding: 2px 5px;
                        background-color: #f44336;
                        color: white;
                        border: none;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    `;
                    removeButton.addEventListener('click', () => ConfigManager.removeToken(index));

                    buttonContainer.appendChild(setButton);
                    buttonContainer.appendChild(removeButton);

                    tokenElement.appendChild(leftPart);
                    tokenElement.appendChild(buttonContainer);
                    tokenList.appendChild(tokenElement);
                });
            }
        }
    };

    const ConfigManager = {
        setSecret(secret) {
            Utils.setLocalStorageItem('secretKey', secret);
        },
    
        getSecret() {
            return Utils.getLocalStorageItem('secretKey', '');
        },

        addToken(token) {
            if (!token || typeof token !== 'string') {
                throw new Error('无效的Token');
            }
            let tokens = this.getTokens();
            if (tokens.some(t => t.token === token)) {
                NotificationManager.warn('Token已存在');
                return false;
            }
            if (tokens.length >= 10) {
                NotificationManager.error('最多只能添加10个Token');
                return false;
            }
            tokens.push({ token: token, enabled: true });
            Utils.setLocalStorageItem(CONSTANTS.TOKENS_KEY, tokens);
            UIManager.updateTokenList();
            return true;
        },

        removeToken(index) {
            let tokens = this.getTokens();
            if (index >= 0 && index < tokens.length) {
                tokens.splice(index, 1);
                Utils.setLocalStorageItem(CONSTANTS.TOKENS_KEY, tokens);
                UIManager.updateTokenList();
                return true;
            }
            return false;
        },

        disableToken(index) {
            let tokens = this.getTokens();
            if (tokens[index]) {
                tokens[index].enabled = false;
                Utils.setLocalStorageItem(CONSTANTS.TOKENS_KEY, tokens);
                UIManager.updateTokenList();
                const tokenIdentifier = this.getTokenIdentifier(index);
                LogManager.log(null, index, null, `已被禁用`);

                // 通知 SubmissionController 更新 token 列表
                SubmissionController.updateTokenList();
            }
        },

        getTokenIdentifier(index) {
            const tokens = this.getTokens();
            if (tokens[index] && tokens[index].token) {
                return `...${tokens[index].token.slice(-6)}`;
            }
            return `Token${index + 1}`;
        },

        getTokens() {
            return Utils.getLocalStorageItem(CONSTANTS.TOKENS_KEY, []);
        },

        toggleToken(index) {
            let tokens = this.getTokens();
            if (tokens[index]) {
                tokens[index].enabled = !tokens[index].enabled;
                Utils.setLocalStorageItem(CONSTANTS.TOKENS_KEY, tokens);
                UIManager.updateTokenList();
                const tokenIdentifier = this.getTokenIdentifier(index);
                const status = tokens[index].enabled ? '启用' : '禁用';
                LogManager.log(null, index, null, `已被${status}`);
                SubmissionController.updateTokenList();  // 更新 SubmissionController 中的 token 列表
                return true;
            }
            return false;
        },

        setToken(token) {
            window.sessionStorage.setItem("accessToken", token);
            const tokenIdentifier = `...${token.slice(-6)}`;
            LogManager.log(null, null, null, `Token已设定: ${tokenIdentifier}`);
            NotificationManager.success('Token已设定');
        },

        updateSettings(settings) {
            let updated = false;
            if (typeof settings.roundInterval === 'number') {
                if (settings.roundInterval < 50) {
                    NotificationManager.warn('请求间隔时间最小为50ms');
                    return false;
                }
                Utils.setLocalStorageItem(CONSTANTS.ROUND_INTERVAL_KEY, settings.roundInterval);
                updated = true;
            }
            return updated;
        },

        getSettings() {
            return {
                roundInterval: Utils.getLocalStorageItem(CONSTANTS.ROUND_INTERVAL_KEY, CONSTANTS.DEFAULT_ROUND_INTERVAL)
            };
        },

        getEnabledTokens() {
            return this.getTokens().map((token, index) => ({ ...token, index })).filter(token => token.enabled);
        },
    };

    const StatusManager = {
        updateStatus(type, data = {}) {
            const statusDiv = document.getElementById('scriptStatusDisplay');
            if (!statusDiv) return;

            let message = '';
            switch (type) {
                case 'countdown':
                    message = `下次执行: ${data.targetTime.toLocaleString()}<br>
                               剩余时间: ${data.hours !== 0 ? `${data.hours} 小时 ` : ''}${data.minutes !== 0 ? `${data.minutes} 分钟 ` : ''}${data.seconds} 秒<br>
                               请求间隔: ${data.roundInterval}ms`;
                    break;
                case 'stopped':
                    message = '脚本已停止运行';
                    break;
                case 'running':
                    message = `当前正在执行第${data.currentRound}轮请求`;
                    break;
                case 'pending':
                    message = '正在尝试获取口令，请等待...';
                    break;
                default:
                    console.warn('未知的状态类型');
                    return;
            }
            statusDiv.innerHTML = message;
        }
    };

    const LogManager = {
        MAX_LOG_ENTRIES: 1000,

        log(message, tokenIndex, round, customMessage, response) {
            const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });
            let logEntry = `${timestamp} `;

            if (tokenIndex !== null && tokenIndex !== undefined) {
                const tokenIdentifier = ConfigManager.getTokenIdentifier(tokenIndex);
                logEntry += `${tokenIdentifier} `;
            }

            if (round !== null && round !== undefined) {
                logEntry += `第${round}次 `;
            }

            if (customMessage) {
                logEntry += customMessage;
            }

            if (response) {
                logEntry += ` 响应：${response}`;
            }

            this.addLogEntry(logEntry);
        },

        addLogEntry(entry) {
            const logDiv = document.getElementById('responseLogDisplay');
            if (logDiv) {
                const logEntryElement = document.createElement('div');
                logEntryElement.textContent = entry;

                logDiv.appendChild(logEntryElement);

                const emptyLine = document.createElement('div');
                emptyLine.style.height = '0.5em';
                logDiv.appendChild(emptyLine);

                const statusPage = document.getElementById('statusPage');
                if (statusPage.classList.contains('active')) {
                    this.scrollLogToBottom();
                }

                let logs = Utils.getLocalStorageItem(CONSTANTS.RESPONSE_LOG_KEY, []);
                logs.push(entry);
                logs = logs.slice(-this.MAX_LOG_ENTRIES);
                Utils.setLocalStorageItem(CONSTANTS.RESPONSE_LOG_KEY, logs);
            }
        },

        clearResponseLog() {
            localStorage.removeItem(CONSTANTS.RESPONSE_LOG_KEY);
            const logDiv = document.getElementById('responseLogDisplay');
            if (logDiv) {
                logDiv.innerHTML = '';
            }
        },

        loadLog() {
            const logDiv = document.getElementById('responseLogDisplay');
            if (logDiv) {
                const logs = Utils.getLocalStorageItem(CONSTANTS.RESPONSE_LOG_KEY, []);
                logDiv.innerHTML = logs.map(log => {
                    if (log.trim()) {
                        return `<div>${log}</div><div style="height:0.5em;"></div>`;
                    }
                    return '';
                }).join('');

                this.scrollLogToBottom();
            }
        },
        scrollLogToBottom() {
            const logDiv = document.getElementById('responseLogDisplay');
            if (logDiv) {
                requestAnimationFrame(() => {
                    logDiv.scrollTop = logDiv.scrollHeight;
                });
            }
        },
        scrollToBottom(element) {
            element.scrollTop = element.scrollHeight;
        }
    };

    const GlobalController = {
        _isRunning: false,
        _isPausing: false,
        globalSecret: '',
        currentRound: 0,
        timer: null,
        executionTimer: null,

        set isRunning(value) {
            this._isRunning = value;
            Utils.setLocalStorageItem(CONSTANTS.SCRIPT_ENABLED_KEY, value);
            this.updateButtonState();
            if (value) {
                LogManager.log(null, null, null, '当前状态：已开启');
                // 移除这里的 this.handleScriptStart()，我们会在其他地方调用它
            } else {
                LogManager.log(null, null, null, '当前状态：已停止');
                this.clearAllTimers();
                StatusManager.updateStatus('stopped');
            }
        },

        get isRunning() {
            return this._isRunning;
        },

        set isPausing(value) {
            this._isPausing = value;
            if (value) {
                this.scheduleNextExecution();
            } else {
                this.startExecution();
            }
        },

        get isPausing() {
            return this._isPausing;
        },


        handleScriptStart() {
            if (this.isExecutionTime()) {
                LogManager.log(null, null, null, '当前为执行时间，开始操作');
                this.startExecution();
            } else {
                LogManager.log(null, null, null, '等待下一个执行时间点');
                this.scheduleNextExecution();
            }
        },

        updateButtonState() {
            const button = document.getElementById('scriptToggleButton');
            if (button) {
                UIManager.updateButtonState(button, this._isRunning);
            }
        },
        toggleScript() {
            const previousState = this.isRunning;
            this.isRunning = !previousState;
            if (this.isRunning) {
                this.handleScriptStart();
            }
        },

        startScript() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.handleScriptStart();
            }
        },

        stopScript(reason = '已停止运行') {
            if (this.isRunning) {
                this.isRunning = false;
                LogManager.log(null, null, null, `已停止运行：${reason}`);
                StatusManager.updateStatus('stopped');

                // 更新按钮状态
                const button = document.getElementById('scriptToggleButton');
                if (button) {
                    UIManager.updateButtonState(button, false);
                }
            }
        },

        clearAllTimers() {
            clearTimeout(this.timer);
            const highestTimeoutId = setTimeout(";");
            for (let i = 0; i < highestTimeoutId; i++) {
                clearTimeout(i);
            }
        },

        isExecutionTime() {
            const now = new Date();
            return CONSTANTS.EXECUTION_TIMES.some(time => {
                const executionStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hour, time.minute);
                const executionEnd = new Date(executionStart.getTime() + CONSTANTS.EXECUTION_DURATION * 1000);
                return now >= executionStart && now < executionEnd;
            });
        },


        scheduleNextExecution() {
            if (!this.isRunning) return;

            clearTimeout(this.executionTimer);

            const now = new Date();
            const nextTime = this.getNextExecutionTime();

            if (nextTime <= now) {
                // 如果已经到了或过了下一个执行时间，立即开始执行
                this.executeNow();
            } else {
                const delay = nextTime.getTime() - now.getTime();
                this.updateCountdown(nextTime);
                this.executionTimer = setTimeout(() => this.executeNow(), delay);
            }
        },

        executeNow() {
            if (!this.isRunning) {
                StatusManager.updateStatus('stopped');
                return;
            }

            if (this.isPausing) {
                LogManager.log(null, null, null, "当前处于暂停状态，等待下一次执行");
                this.scheduleNextExecution();
                return;
            }

            SubmissionController.resetCounters();
            SubmissionController.startSubmission().catch(error => {
                LogManager.log(null, null, null, `执行过程中出错: ${error.message}`);
                this.isPausing = true;
                this.scheduleNextExecution();
            });
        },


        isPageFullyLoaded() {
            return document.readyState === 'complete' &&
                   document.querySelector('.secret-tip') !== null &&
                   document.querySelector('input[placeholder="请输入口令"]') !== null &&
                   document.querySelector('button.sure-btn') !== null;
        },

        updateCountdown(targetTime) {
            const updateTimer = () => {
                const now = new Date();
                const remainingTime = Math.max(0, Math.floor((targetTime.getTime() - now.getTime()) / 1000));

                if (remainingTime > 0 && this.isRunning) {
                    const hours = Math.floor(remainingTime / 3600);
                    const minutes = Math.floor((remainingTime % 3600) / 60);
                    const seconds = remainingTime % 60;
                    const { roundInterval } = ConfigManager.getSettings();

                    StatusManager.updateStatus('countdown', {
                        targetTime,
                        hours,
                        minutes,
                        seconds,
                        roundInterval
                    });

                    if (remainingTime > 1) {
                        setTimeout(updateTimer, 1000);
                    }
                }
            };

            updateTimer();
        },

        startExecution() {
            SubmissionController.resetCounters();
            SubmissionController.startSubmission().catch(error => {
                LogManager.log(null, null, null, `执行过程中出错: ${error.message}`);
                this.isPausing = true;
                this.scheduleNextExecution();
            });
        },

        handleSubmissionResponse(result) {
            if (result.status === 'SUCCESS' || result.status === 'TOKEN_EXPIRED') {
                this.successfulToken = result.tokenIndex;
            }
            const tokenIndex = result.tokenIndex;
            switch (result.status) {
                case 'SECURITY_THREAT':
                    NotificationManager.error('IP已被风控，请更换IP。手机可切换飞行模式，宽带可重新拨号进行尝试', true);
                    this.stopScript("IP已被风控，请更换IP。手机可切换飞行模式，宽带可重新拨号进行尝试");
                    break;
                case 'SESSION_COMPLETE':
                    NotificationManager.warn('本轮已抢完，等待下一时段', true);
                    LogManager.log(null, null, null, '本轮已抢完，等待下一时段');
                    SubmissionController.pauseSubmission();
                    break;
                case 'SUCCESS':
                case 'TOKEN_EXPIRED':
                    if (tokenIndex !== null && tokenIndex !== undefined) {
                        ConfigManager.disableToken(tokenIndex);
                        const tokenIdentifier = ConfigManager.getTokenIdentifier(tokenIndex);
                        const logMessage = result.status === 'SUCCESS' ?
                            `抢券成功，Token已自动禁用` :
                            `Token已失效，已自动禁用`;
                        LogManager.log(null, tokenIndex, null, logMessage);
                        const notificationMessage = result.status === 'SUCCESS' ?
                            `Token: ${tokenIdentifier} 抢到了！该Token已自动禁用` :
                            `Token: ${tokenIdentifier} 已失效，该Token已自动禁用`;
                        NotificationManager.success(notificationMessage, true);
                        SubmissionController.updateTokenList();
                    } else {
                        const logMessage = result.status === 'SUCCESS' ?
                            `抢券成功，但无法确定是哪个账号，请手动检查并禁用该Token` :
                            `Token已失效，但无法确定是哪个账号，请手动检查并禁用该Token`;
                        LogManager.log(null, null, null, logMessage);
                        NotificationManager.success(logMessage, true);
                    }
                    break;
                default:
                    break;
            }
        },

        getNextExecutionTime() {
            const now = new Date();
            for (let time of CONSTANTS.EXECUTION_TIMES) {
                const executionTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hour, time.minute);
                if (executionTime > now) {
                    return executionTime;
                }
            }
            // 如果今天的所有时间点都已过，返回明天的第一个时间点
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), CONSTANTS.EXECUTION_TIMES[0].hour, CONSTANTS.EXECUTION_TIMES[0].minute);
        },
    };

    const SubmissionController = {
        isSubmitting: false,
        currentRound: 0,
        tokenCounters: {},
        enabledTokens: [],
        successfulToken: null,

        async startSubmission() {
            this.isSubmitting = true;
            this.currentRound = 0;
            this.tokenCounters = {};
            this.updateTokenList();
            NetworkManager.resetProcessedTokens();
        
            if (this.enabledTokens.length === 0) {
                NotificationManager.error('没有可用Token，请检查token设置后重新启动运行。');
                GlobalController.stopScript("没有可用Token，请检查token设置后重新启动运行。");
                return;
            }
        
            const userInputSecret = Utils.getLocalStorageItem('secretKey', '');
            if (!userInputSecret) {
                NotificationManager.error('请在设置中输入口令');
                GlobalController.stopScript("未输入口令");
                return;
            }
        
            GlobalController.globalSecret = userInputSecret;
            LogManager.log(null, null, null, `使用口令: ${GlobalController.globalSecret}`);
            await this.submitNextRound();
        },


        updateTokenList() {
            this.enabledTokens = ConfigManager.getEnabledTokens();
            this.enabledTokens.forEach(token => {
            });
        },

        async submitNextRound() {
            if (!this.isSubmitting) return;

            this.currentRound++;
            this.successfulToken = null;
            const settings = ConfigManager.getSettings();

            if (this.currentRound > 100) {
                this.stopSubmission("请求已达到100轮，状态可能异常，已停止。");
                return;
            }

            StatusManager.updateStatus('running', {
                currentRound: this.currentRound,
            });

            LogManager.log(null, null, null, `开始第${this.currentRound}轮提交。`);

            this.updateTokenList();

            if (this.enabledTokens.length === 0) {
                GlobalController.stopScript("没有可用的Token");
                return;
            }

            for (let token of this.enabledTokens) {
                if (!this.isSubmitting) break;
                await this.submitSingle(token);
                    await new Promise(resolve => setTimeout(resolve, settings.roundInterval));
                }

            if (this.successfulToken) {
                LogManager.log(null, null, null, `Token: ${ConfigManager.getTokenIdentifier(this.successfulToken)} 在本轮成功抢到！`);
                ConfigManager.disableToken(this.successfulToken);
            }

            if (this.isSubmitting) {
                this.submitNextRound();
            }
        },

        async submitSingle(token) {
            const count = (this.tokenCounters[token.index] || 0) + 1;
            this.tokenCounters[token.index] = count;

            if (!GlobalController.globalSecret) {
                throw new Error('未找到有效口令');
            }

            window.sessionStorage.setItem("accessToken", token.token);

            let input = document.querySelector('input[placeholder="请输入口令"]');
            if (!input) {
                throw new Error('未找到输入框');
            }
            input.value = GlobalController.globalSecret;

            let event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);

            let button = document.querySelector('button.sure-btn');
            if (!button) {
                throw new Error('未找到提交按钮');
            }

            const tokenIdentifier = ConfigManager.getTokenIdentifier(token.index);
            LogManager.log(null, token.index, count, `提交`);

            NetworkManager.setCurrentTokenIndex(token.index);
            button.click();

            const typeSet = NetworkManager.tokenTypeMap.get(token.index);
            if (!typeSet || typeSet.size === 0) {
                console.warn(`警告：未能立即捕获 token${token.index + 1} 的 type__1286 参数`);
            }
        },

        stopSubmission(reason) {
            this.isSubmitting = false;
            LogManager.log(null, null, null, `停止提交: ${reason}`);
            StatusManager.updateStatus('stopped');
            GlobalController.isPausing = true;
        },

        pauseSubmission(reason = "暂停当前时段的提交") {
            if (this.isSubmitting) {
                this.isSubmitting = false;
                GlobalController.isPausing = true;
            }
        },

        continueSubmission() {
            if (GlobalController.isPausing) {
                GlobalController.isPausing = false;
                this.isSubmitting = true;
                this.submitNextRound();
            }
        },

        resetCounters() {
            this.tokenCounters = {};
        }
    };

    const NetworkManager = {
        tokenTypeMap: new Map(), // Map<tokenIndex, Set<type__1286>>
        currentTokenIndex: null,
        processedTokens: new Set(),

        setCurrentTokenIndex(index) {
            this.currentTokenIndex = index;
        },

        addTypeForToken(tokenIndex, type) {
            if (!this.tokenTypeMap.has(tokenIndex)) {
                this.tokenTypeMap.set(tokenIndex, new Set());
            }
            this.tokenTypeMap.get(tokenIndex).add(type);
        },

        findTokenIndexByType(type) {
            for (let [tokenIndex, typeSet] of this.tokenTypeMap.entries()) {
                if (typeSet.has(type)) {
                    return tokenIndex;
                }
            }
            return null;
        },

        removeTypeForToken(tokenIndex, type) {
            const typeSet = this.tokenTypeMap.get(tokenIndex);
            if (typeSet) {
                typeSet.delete(type);
                if (typeSet.size === 0) {
                    this.tokenTypeMap.delete(tokenIndex);
                }
            }
        },

        interceptXHR() {
            const self = this;
            const XHR = XMLHttpRequest.prototype;
            const open = XHR.open;
            const send = XHR.send;

            XHR.open = function (method, url) {
                this._url = url;
                return open.apply(this, arguments);
            };

            XHR.send = function () {
                if (this._url.includes('/api/v1/h5/marketing/secretword/confirm')) {
                    const urlParams = new URLSearchParams(this._url.split('?')[1]);
                    const typeParam = urlParams.get('type__1286');
                    if (typeParam && self.currentTokenIndex !== null) {
                        self.addTypeForToken(self.currentTokenIndex, typeParam);
                    }
                }

                this.addEventListener('load', function () {
                    if (this._url.includes('/api/v1/h5/marketing/secretword/confirm')) {
                        const urlParams = new URLSearchParams(this._url.split('?')[1]);
                        const typeParam = urlParams.get('type__1286');

                        const tokenIndex = self.findTokenIndexByType(typeParam);

                        if (self.processedTokens.has(tokenIndex)) {
                            return;
                        }

                        const response = this.responseText;
                        let result = {
                            status: null,
                            response,
                            tokenIndex: tokenIndex
                        };

                        if (response.includes("安全威胁")) {
                            result.status = 'SECURITY_THREAT';
                        } else if (response.includes("本轮已抢完，下次再来吧")) {
                            result.status = 'SESSION_COMPLETE';
                        } else if (response.includes('.gif') || response.includes('领取上限')) {
                            result.status = 'SUCCESS';
                        } else if (response.includes('请重新登录')) {
                            result.status = 'TOKEN_EXPIRED';
                        }

                        if (result.status === 'SUCCESS' || result.status === 'TOKEN_EXPIRED') {
                            self.processedTokens.add(tokenIndex);
                        } else if (result.status === 'SECURITY_THREAT' || result.status === 'SESSION_COMPLETE') {
                            self.markAllTokensAsProcessed();
                        }

                        GlobalController.handleSubmissionResponse(result);

                        if (result.tokenIndex !== null) {
                            self.removeTypeForToken(result.tokenIndex, typeParam);
                        }
                    }
                });
                return send.apply(this, arguments);
            };
        },

        markAllTokensAsProcessed() {
            if (this.tokenTypeMap && typeof this.tokenTypeMap.keys === 'function') {
                for (let tokenIndex of this.tokenTypeMap.keys()) {
                    this.processedTokens.add(tokenIndex);
                }
            } else {
                console.error('tokenTypeMap is not properly initialized');
                for (let i = 0; i < ConfigManager.getTokens().length; i++) {
                    this.processedTokens.add(i);
                }
            }
        },

        // 重置已处理的 tokens（在开始新的提交轮次时调用）
        resetProcessedTokens() {
            this.processedTokens.clear();
        }
    };

    async function initScript() {
        try {
            NetworkManager.interceptXHR();
            UIManager.createFloatingPanel();
            LogManager.loadLog();
            UIManager.updateTokenList();
            NotificationManager.init();

            const isEnabled = Utils.getLocalStorageItem(CONSTANTS.SCRIPT_ENABLED_KEY, false);
            GlobalController.isRunning = isEnabled;

            if (isEnabled) {
                GlobalController.handleScriptStart();
            }

            Utils.ensurePanelInteractivity();
        } catch (error) {
            console.error('初始化脚本时出错:', error);
            StatusManager.updateStatus('初始化失败，请刷新页面重试...');
            setTimeout(() => location.reload(), 1000);
        }
    }

    initScript();

})();
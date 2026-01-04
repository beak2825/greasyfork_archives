// ==UserScript==
// @name         Claude Session Key 管理器
// @name:zh-CN   Claude Session Key 管理器
// @name:en      Claude Session Key Manager
// @version      1.0.1
// @description  Claude Session Key 管理工具，支持拖拽、测活、导入导出、WebDAV云备份等功能
// @description:zh-CN  Claude Session Key 管理工具，支持拖拽、测活、批量导入导出、WebDAV云备份等功能
// @description:en  Claude Session Key Manager with drag-and-drop, token validation, import/export, WebDAV backup and more
// @author       xiaoye6688
// @namespace    https://greasyfork.org/users/1317128-xiaoye6688
// @homepage     https://greasyfork.org/zh-CN/users/1317128-xiaoye6688
// @supportURL   https://greasyfork.org/zh-CN/users/1317128-xiaoye6688
// @license      MIT
// @date         2025-03-09
// @modified     2025-03-09

// @match        https://claude.ai/*
// @match        https://claude.asia/*
// @match        https://demo.fuclaude.com/*
// @include      https://*fuclaude*/*
//
// @icon         https://claude.ai/favicon.ico
// @run-at       document-end

// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_info

// @connect      ipapi.co
// @connect      api.claude.ai
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/529223/Claude%20Session%20Key%20%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529223/Claude%20Session%20Key%20%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const config = {
        storageKey: "claudeTokens",
        ipApiUrl: "https://ipapi.co/country_code",
        defaultToken: {
            name: "Token00",
            key: "sk-key",
        },
        currentTokenKey: "currentClaudeToken",
        testResultsKey: "claudeTokenTestResults",
        testResultExpiry: 1800000, // 30分钟过期
    };

    const theme = {
        light: {
            bgColor: "#fcfaf5",
            textColor: "#333",
            borderColor: "#ccc",
            buttonBg: "#f5f1e9",
            buttonHoverBg: "#e5e1d9",
            modalBg: "rgba(0, 0, 0, 0.5)",
        },
        dark: {
            bgColor: "#2c2b28",
            textColor: "#f5f4ef",
            borderColor: "#3f3f3c",
            buttonBg: "#3f3f3c",
            buttonHoverBg: "#4a4a47",
            modalBg: "rgba(0, 0, 0, 0.7)",
        },
    };

    const getStyles = (isDarkMode) => `
        :root {
            --bg-color: ${isDarkMode ? theme.dark.bgColor : theme.light.bgColor};
            --text-color: ${isDarkMode ? theme.dark.textColor : theme.light.textColor};
            --border-color: ${isDarkMode ? theme.dark.borderColor : theme.light.borderColor};
            --button-bg: ${isDarkMode ? theme.dark.buttonBg : theme.light.buttonBg};
            --button-hover-bg: ${isDarkMode ? theme.dark.buttonHoverBg : theme.light.buttonHoverBg};
            --modal-bg: ${isDarkMode ? theme.dark.modalBg : theme.light.modalBg};
        }
        
        /* 浮动按钮样式 */
        #claude-toggle-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--bg-color);
            color: #b3462f;
            cursor: move;
            position: fixed;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: background-color 0.3s ease, transform 0.2s ease;
            outline: none;
            padding: 0;
            user-select: none;
            touch-action: none;
            border: 1px solid var(--border-color);
            font-size: 18px;
        }
        
        #claude-toggle-button:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        
        /* 下拉容器样式 */
        .claude-dropdown-container {
            position: fixed;
            background-color: var(--bg-color);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            display: none;
            flex-direction: column;
            gap: 0; /* 移除flex布局产生的空隙 */
            width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
            border: 1px solid var(--border-color);
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            scrollbar-gutter: stable; /* 保持滚动条空间稳定 */
            scrollbar-width: thin; /* Firefox滚动条样式 */
            scrollbar-color: ${isDarkMode ? "rgba(255, 255, 255, 0.2) transparent" : "rgba(0, 0, 0, 0.2) transparent"};
        }
        
        /* 标题容器 */
        .claude-title-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
        }
        
        .claude-title-container h2 {
            margin: 0;
            color: var(--text-color);
            font-size: 18px;
            font-weight: 600;
        }
        
        .claude-ip-display {
            font-size: 14px;
            color: var(--text-color);
            padding: 4px 10px;
            background-color: var(--button-bg);
            border-radius: 12px;
        }
        
        /* Token 网格容器 */
        .claude-token-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            max-height: calc(2 * (90px + 12px) + 24px); /* 两行token的高度加上间隙和padding */
            overflow-y: auto;
            padding: 12px 0 12px 12px;
            scrollbar-gutter: stable; /* 保持滚动条空间稳定，防止出现时推动内容 */
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)"};
            /* Firefox滚动条样式支持 */
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? "rgba(255, 255, 255, 0.2) transparent" : "rgba(0, 0, 0, 0.2) transparent"};
        }
        
        /* Token 卡片样式 */
        .claude-token-item {
            padding: 15px;
            border-radius: 8px;
            background-color: var(--bg-color);
            border: 1px solid var(--border-color);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            height: 90px; /* 固定高度 */
            box-sizing: border-box; /* 确保padding不会增加总高度 */
            display: flex;
            flex-direction: column;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .claude-token-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: ${isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"};
        }
        
        .claude-token-item.current-token {
            border: 2px solid #b3462f;
            background-color: ${isDarkMode ? "rgba(179, 70, 47, 0.1)" : "rgba(179, 70, 47, 0.05)"};
            position: relative;
        }
        
        .current-token-badge {
            position: absolute;
            top: -8px;
            left: 8px;
            background-color: #b3462f;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .current-token-badge::after {
            content: "";
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: white;
        }
        
        /* Token 内容样式 */
        .token-info {
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1; /* 填充可用空间 */
            justify-content: space-between; /* 顶部行和底部行分别位于容器顶部和底部 */
        }
        
        .token-top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .token-name-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .token-number {
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            background-color: var(--button-bg);
        }
        
        .token-name {
            font-weight: 500;
            font-size: 14px;
        }
        
        .token-actions {
            display: flex;
            gap: 8px;
        }
        
        .token-action-btn {
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-color);
            transition: all 0.2s ease;
        }
        
        .token-action-btn:hover {
            background-color: var(--button-hover-bg);
            transform: scale(1.1);
        }
        
        .token-action-btn.delete-btn {
            color: #e24a4a;
        }
        
        .token-bottom-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .token-status {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-left: auto;
        }
        
        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #888;
        }
        
        .status-indicator.success {
            background-color: #48bb78;
        }
        
        .status-indicator.error {
            background-color: #e53e3e;
        }
        
        .status-indicator.loading {
            background-color: #888;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
        }
        
        .token-time {
            font-size: 12px;
            color: var(--text-color);
            opacity: 0.7;
        }
        
        /* 按钮容器 */
        .claude-button-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            padding-top: 12px;
        }
        
        .claude-button {
            padding: 8px 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
        }
        
        .claude-button:hover {
            transform: translateY(-2px);
        }
        
        .claude-button.primary {
            background-color: #b3462f;
            color: white;
        }
        
        .claude-button.primary:hover {
            background-color: #a03d2a;
        }
        
        .claude-button.secondary {
            background-color: var(--button-bg);
            color: var(--text-color);
        }
        
        .claude-button.secondary:hover {
            background-color: var(--button-hover-bg);
        }
        
        /* 工具提示样式 */
        .claude-button[data-tooltip]:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 10001;
            margin-bottom: 5px;
            pointer-events: none;
            opacity: 0;
            animation: tooltip-fade-in 0.2s ease forwards;
        }
        
        @keyframes tooltip-fade-in {
            from { opacity: 0; transform: translate(-50%, 5px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        
        /* 模态框样式 */
        .claude-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--modal-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        }
        
        .claude-modal-content {
            background-color: var(--bg-color);
            padding: 20px;
            padding-right: 14px; /* 右侧padding稍微增加，为滚动条预留空间但不过多 */
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 500px;
            max-width: 90%;
            overflow-y: auto;
            position: relative;
            scrollbar-gutter: stable; /* 保持滚动条空间稳定 */
            scrollbar-width: thin; /* Firefox滚动条样式 */
            scrollbar-color: ${isDarkMode ? "rgba(255, 255, 255, 0.2) transparent" : "rgba(0, 0, 0, 0.2) transparent"};
        }
        
        .claude-modal-content.narrow-modal {
            width: 400px;
            max-width: 80%;
        }
        
        .claude-modal h2 {
            margin-top: 0;
            margin-bottom: 15px;
            color: var(--text-color);
            font-size: 18px;
            font-weight: 600;
        }
        
        .claude-modal input, .claude-modal textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 14px;
            background-color: var(--bg-color);
            color: var(--text-color);
        }
        
        .claude-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
        }
        
        .claude-close-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: var(--text-color);
            padding: 5px;
            line-height: 1;
        }
        
        /* 自定义滚动条样式 */
        .claude-token-grid::-webkit-scrollbar {
            width: 6px;
            /* 初始状态下滚动条透明 */
            background-color: transparent;
        }
        
        .claude-token-grid::-webkit-scrollbar-track {
            background: transparent;
            margin: 4px 0;
        }
        
        .claude-token-grid::-webkit-scrollbar-thumb {
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"};
            border-radius: 6px;
            transition: background-color 0.3s ease;
            /* 初始状态下滚动条半透明 */
            opacity: 0.6;
        }
        
        .claude-token-grid::-webkit-scrollbar-thumb:hover {
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"};
            opacity: 1;
        }
        
        .claude-token-grid:hover::-webkit-scrollbar-thumb {
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"};
            opacity: 1;
        }
        
        /* 滚动条样式 */
        .claude-dropdown-container::-webkit-scrollbar,
        .claude-modal-content::-webkit-scrollbar {
            width: 6px;
            background-color: transparent;
        }
        
        .claude-dropdown-container::-webkit-scrollbar-track,
        .claude-modal-content::-webkit-scrollbar-track {
            background: transparent;
            margin: 4px 0;
        }
        
        .claude-dropdown-container::-webkit-scrollbar-thumb,
        .claude-modal-content::-webkit-scrollbar-thumb {
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"};
            border-radius: 6px;
            transition: background-color 0.3s ease;
            opacity: 0.6;
        }
        
        .claude-dropdown-container::-webkit-scrollbar-thumb:hover,
        .claude-modal-content::-webkit-scrollbar-thumb:hover {
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"};
            opacity: 1;
        }
        
        .claude-dropdown-container:hover::-webkit-scrollbar-thumb,
        .claude-modal-content:hover::-webkit-scrollbar-thumb {
            opacity: 1;
        }
        
        /* 预览容器 */
        .claude-preview-container {
            margin-top: 15px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 15px;
        }
        
        .claude-preview-title {
            font-size: 16px;
            margin-bottom: 10px;
            color: var(--text-color);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 5px;
        }
        
        .claude-preview-item {
            margin-bottom: 8px;
            font-size: 14px;
            padding: 8px;
            border-radius: 4px;
            background-color: var(--button-bg);
        }

        /* 滚动提示样式 */
        .scroll-indicator {
            grid-column: 1 / -1; /* 横跨所有列 */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            margin-top: 5px;
            color: ${isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.5)"};
            font-size: 12px;
            background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)"};
            border-radius: 6px;
            gap: 8px;
        }

        .scroll-arrow {
            animation: bounce 1.5s infinite;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(3px); }
        }
    `;

    const UI = {
        createElem(tag, className = "", styles = {}) {
            const elem = document.createElement(tag);
            if (className) elem.className = className;
            Object.assign(elem.style, styles);
            return elem;
        },

        createButton(text, className, icon = "") {
            const button = this.createElem("button", className);
            if (icon) {
                button.innerHTML = `${icon} ${text}`;
            } else {
                button.textContent = text;
            }
            return button;
        },

        createModal(title, content, includeCloseButton = true) {
            const modal = this.createElem("div", "claude-modal");
            modal.setAttribute("aria-modal", "true");
            modal.setAttribute("role", "dialog");

            const modalContent = this.createElem("div", "claude-modal-content");

            const titleElem = this.createElem("h2");
            titleElem.textContent = title;
            modalContent.appendChild(titleElem);

            if (includeCloseButton) {
                const closeButton = this.createElem("button", "claude-close-button");
                closeButton.textContent = "×";
                closeButton.addEventListener("click", () => document.body.removeChild(modal));
                modalContent.appendChild(closeButton);
            }

            modalContent.appendChild(content);

            const buttonContainer = this.createElem("div", "claude-modal-buttons");
            modalContent.appendChild(buttonContainer);

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            return {
                modal,
                buttonContainer,
                close: () => document.body.removeChild(modal),
            };
        },
    };

    const App = {
        init() {
            this.isDarkMode = document.documentElement.getAttribute("data-mode") === "dark";
            this.injectStyles();
            this.tokens = this.loadTokens();
            this.createUI();
            this.setupEventListeners();
            this.observeThemeChanges();

            // 获取保存的位置或使用默认值
            const savedPosition = {
                left: GM_getValue("buttonLeft", 10),
                bottom: GM_getValue("buttonBottom", 10)
            };

            // 设置按钮位置
            this.toggleButton.style.left = `${savedPosition.left}px`;
            this.toggleButton.style.bottom = `${savedPosition.bottom}px`;

            // 初始化拖拽状态
            this.isDragging = false;
            this.buttonLeft = savedPosition.left;
            this.buttonBottom = savedPosition.bottom;

            // 获取IP信息
            this.fetchIPCountryCode();
        },

        injectStyles() {
            this.styleElem = document.createElement("style");
            this.styleElem.textContent = getStyles(this.isDarkMode);
            document.head.appendChild(this.styleElem);
        },

        updateStyles() {
            this.styleElem.textContent = getStyles(this.isDarkMode);
        },

        loadTokens() {
            try {
                const savedTokens = GM_getValue(config.storageKey);
                let tokens = savedTokens && savedTokens.length > 0
                    ? savedTokens
                    : [config.defaultToken];

                // 为没有创建时间的token添加默认值
                tokens = tokens.map(token => {
                    if (!token.createdAt) {
                        const now = new Date();
                        return {
                            ...token,
                            createdAt: now.toLocaleString("zh-CN", {
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                            timestamp: now.getTime()
                        };
                    }
                    return token;
                });

                return tokens;
            } catch (error) {
                console.error("加载 tokens 失败:", error);
                return [config.defaultToken];
            }
        },

        saveTokens() {
            try {
                GM_setValue(config.storageKey, this.tokens);
            } catch (error) {
                console.error("保存 tokens 失败:", error);
                alert("保存 tokens 失败，请重试。");
            }
        },

        createUI() {
            // 创建浮动按钮
            this.toggleButton = UI.createElem("button", "claude-toggle-button", {
                left: "10px",
                bottom: "10px"
            });
            this.toggleButton.id = "claude-toggle-button";
            this.toggleButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pointer-events="none">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" pointer-events="none"></path>
                </svg>
            `;
            document.body.appendChild(this.toggleButton);

            // 创建下拉容器
            this.dropdownContainer = UI.createElem("div", "claude-dropdown-container");
            document.body.appendChild(this.dropdownContainer);

            // 创建标题容器
            const titleContainer = UI.createElem("div", "claude-title-container");

            const title = UI.createElem("h2");
            title.textContent = "Claude Session Key 管理器";

            this.ipDisplay = UI.createElem("div", "claude-ip-display");
            this.ipDisplay.textContent = "IP: 加载中...";

            titleContainer.appendChild(title);
            titleContainer.appendChild(this.ipDisplay);
            this.dropdownContainer.appendChild(titleContainer);

            // 创建 Token 网格
            this.tokenGrid = UI.createElem("div", "claude-token-grid");
            this.dropdownContainer.appendChild(this.tokenGrid);

            // 更新 Token 网格
            this.updateTokenGrid();

            // 创建按钮容器
            const buttonContainer = UI.createElem("div", "claude-button-container");

            // 测试所有按钮
            const testAllButton = UI.createButton("测活", "claude-button primary", "🔍");
            testAllButton.setAttribute("data-tooltip", "测试所有Token是否有效");
            testAllButton.addEventListener("click", () => this.testAllTokens());
            buttonContainer.appendChild(testAllButton);

            // 清理无效按钮
            const cleanInvalidButton = UI.createButton("清理", "claude-button secondary", "🗑️");
            cleanInvalidButton.setAttribute("data-tooltip", "清理所有无效的Token");
            cleanInvalidButton.addEventListener("click", () => this.removeInvalidTokens());
            buttonContainer.appendChild(cleanInvalidButton);

            // 添加 Token 按钮
            const addTokenButton = UI.createButton("添加", "claude-button secondary", "➕");
            addTokenButton.setAttribute("data-tooltip", "添加新的Token");
            addTokenButton.addEventListener("click", () => this.showAddTokenModal());
            buttonContainer.appendChild(addTokenButton);

            // 批量导入按钮
            const importButton = UI.createButton("导入", "claude-button secondary", "📥");
            importButton.setAttribute("data-tooltip", "批量导入多个Token");
            importButton.addEventListener("click", () => this.showBulkImportModal());
            buttonContainer.appendChild(importButton);

            // 批量导出按钮
            const exportButton = UI.createButton("导出", "claude-button secondary", "📤");
            exportButton.setAttribute("data-tooltip", "导出所有Token");
            exportButton.addEventListener("click", () => this.exportTokens());
            buttonContainer.appendChild(exportButton);

            // WebDAV备份按钮
            const webdavButton = UI.createButton("云备份", "claude-button secondary", "☁️");
            webdavButton.setAttribute("data-tooltip", "WebDAV云备份与恢复");
            webdavButton.addEventListener("click", () => this.showWebDAVModal());
            buttonContainer.appendChild(webdavButton);

            this.dropdownContainer.appendChild(buttonContainer);

            // 添加信息提示
            const infoSection = UI.createElem("div", "claude-info-section", {
                marginTop: "10px",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#666",
                textAlign: "center"
            });
            infoSection.innerHTML = '悬停显示面板 • 拖拽按钮调整位置 • 支持WebDAV云备份';
            this.dropdownContainer.appendChild(infoSection);
        },

        updateTokenGrid() {
            this.tokenGrid.innerHTML = "";

            // 获取当前使用的 token
            const currentTokenName = GM_getValue(config.currentTokenKey);

            // 加载测试结果
            const testResults = this.loadTestResults();

            this.tokens.forEach((token, index) => {
                const tokenItem = UI.createElem("div", "claude-token-item");
                if (token.name === currentTokenName) {
                    tokenItem.classList.add("current-token");

                    // 添加选中标记
                    const currentBadge = UI.createElem("div", "current-token-badge");
                    tokenItem.appendChild(currentBadge);
                }

                // Token 信息容器
                const tokenInfo = UI.createElem("div", "token-info");

                // 顶部行：名称和操作按钮
                const topRow = UI.createElem("div", "token-top-row");

                // 名称容器
                const nameContainer = UI.createElem("div", "token-name-container");

                const numberBadge = UI.createElem("span", "token-number");
                numberBadge.textContent = `#${(index + 1).toString().padStart(2, "0")}`;

                const nameSpan = UI.createElem("span", "token-name");
                nameSpan.textContent = token.name;

                nameContainer.appendChild(numberBadge);
                nameContainer.appendChild(nameSpan);

                // 操作按钮
                const actions = UI.createElem("div", "token-actions");

                // 编辑按钮
                const editButton = UI.createElem("button", "token-action-btn edit-btn");
                editButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                `;
                editButton.dataset.index = index;
                editButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.showEditTokenModal(index);
                });

                // 删除按钮
                const deleteButton = UI.createElem("button", "token-action-btn delete-btn");
                deleteButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                `;
                deleteButton.dataset.index = index;
                deleteButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.confirmDeleteToken(index);
                });

                actions.appendChild(editButton);
                actions.appendChild(deleteButton);

                topRow.appendChild(nameContainer);
                topRow.appendChild(actions);

                // 底部行：状态和时间
                const bottomRow = UI.createElem("div", "token-bottom-row");

                // 添加时间戳（使用token的创建时间）
                const timeSpan = UI.createElem("span", "token-time");
                timeSpan.textContent = token.createdAt || "";
                bottomRow.appendChild(timeSpan);

                // 状态指示器
                const status = UI.createElem("div", "token-status");
                const statusIndicator = UI.createElem("div", "status-indicator");

                // 检查缓存的测试结果
                const testResult = testResults[token.key];
                if (testResult) {
                    statusIndicator.classList.add(testResult.status);
                }

                status.appendChild(statusIndicator);
                status.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    await this.testSingleToken(token, statusIndicator, bottomRow);
                });

                bottomRow.appendChild(status);

                // 将行添加到信息容器
                tokenInfo.appendChild(topRow);
                tokenInfo.appendChild(bottomRow);

                // 将信息容器添加到 token 项
                tokenItem.appendChild(tokenInfo);

                // 点击切换 token
                tokenItem.addEventListener("click", () => this.switchToToken(token));

                // 将 token 项添加到网格
                this.tokenGrid.appendChild(tokenItem);
            });

            // 如果token数量超过4个（两行），添加滚动提示
            if (this.tokens.length > 4) {
                const scrollIndicator = UI.createElem("div", "scroll-indicator");
                scrollIndicator.innerHTML = `
                    <div class="scroll-text">向下滚动查看更多 (${this.tokens.length - 4})</div>
                    <div class="scroll-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M7 13l5 5 5-5"></path>
                            <path d="M7 6l5 5 5-5"></path>
                        </svg>
                    </div>
                `;
                this.tokenGrid.appendChild(scrollIndicator);
            }
        },

        async switchToToken(token) {
            // 检查是否有缓存的测试结果
            const cachedResult = this.getTestResult(token.key);

            // 如果有缓存的测试结果且为无效，提示用户并询问是否继续
            if (cachedResult && cachedResult.status === "error") {
                const confirmResult = await this.showConfirmDialog(
                    "警告",
                    `该 Token "${token.name}" 已被标记为无效，是否仍要切换到该 Token？`
                );

                if (!confirmResult) {
                    return;
                }
            }

            // 应用 token
            this.applyToken(token.key);
            GM_setValue(config.currentTokenKey, token.name);

            // 隐藏下拉菜单
            this.hideDropdown();
        },

        applyToken(token) {
            const currentURL = window.location.href;

            if (currentURL.startsWith("https://claude.ai/")) {
                document.cookie = `sessionKey=${token}; path=/; domain=.claude.ai`;
                window.location.reload();
            } else {
                let loginUrl;
                const hostname = new URL(currentURL).hostname;
                if (hostname !== "claude.ai") {
                    loginUrl = `https://${hostname}/login_token?session_key=${token}`;
                }

                if (loginUrl) {
                    window.location.href = loginUrl;
                }
            }
        },

        async testSingleToken(token, statusIndicator, bottomRow) {
            // 显示加载状态
            statusIndicator.className = "status-indicator loading";

            // 测试 token
            const result = await this.testToken(token.key);

            // 保存测试结果
            this.saveTestResult(token.key, result);

            // 更新状态指示器
            statusIndicator.className = `status-indicator ${result.status}`;

            // 不再更新时间戳，保持显示token的创建时间
        },

        async testAllTokens() {
            // 获取所有 token 项
            const tokenItems = this.tokenGrid.querySelectorAll(".claude-token-item");

            // 禁用测试按钮
            const testButton = this.dropdownContainer.querySelector(".claude-button.primary");
            testButton.disabled = true;
            testButton.textContent = "测试中...";

            // 清除所有缓存的测试结果
            GM_setValue(config.testResultsKey, {});

            const tokens = Array.from(tokenItems);

            // 按4个一组处理所有tokens
            for (let i = 0; i < tokens.length; i += 4) {
                // 取出当前4个(或更少)token
                const currentChunk = tokens.slice(i, Math.min(i + 4, tokens.length));

                // 并行处理这最多4个token
                await Promise.all(
                    currentChunk.map(async (tokenItem) => {
                        const index = Array.from(tokenItems).indexOf(tokenItem);
                        const token = this.tokens[index];
                        const statusIndicator = tokenItem.querySelector(".status-indicator");
                        const bottomRow = tokenItem.querySelector(".token-bottom-row");

                        await this.testSingleToken(token, statusIndicator, bottomRow);
                    })
                );
            }

            // 恢复测试按钮
            testButton.disabled = false;
            testButton.innerHTML = "🔍 测活";
        },

        async testToken(key) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.claude.ai/api/organizations",
                    headers: {
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "max-age=0",
                        cookie: `sessionKey=${key}`,
                        "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                    },
                    onload: (response) => {
                        try {
                            if (response.status !== 200) {
                                resolve({ status: "error", message: "无效" });
                                return;
                            }

                            const responseText = response.responseText;

                            if (responseText.toLowerCase().includes("unauthorized")) {
                                resolve({ status: "error", message: "无效" });
                                return;
                            }

                            if (responseText.trim() === "") {
                                resolve({ status: "error", message: "无响应" });
                                return;
                            }

                            try {
                                const objects = JSON.parse(responseText);
                                if (objects && objects.length > 0) {
                                    resolve({ status: "success", message: "有效" });
                                    return;
                                }
                            } catch (e) {
                                resolve({ status: "error", message: "解析失败" });
                                return;
                            }

                            resolve({ status: "error", message: "无效数据" });
                        } catch (error) {
                            console.error("解析响应时发生错误:", error);
                            resolve({ status: "error", message: "测试失败" });
                        }
                    },
                    onerror: (error) => {
                        console.error("请求发生错误:", error);
                        resolve({ status: "error", message: "网络错误" });
                    },
                    ontimeout: () => {
                        resolve({ status: "error", message: "超时" });
                    },
                });
            });
        },

        loadTestResults() {
            try {
                const cached = GM_getValue(config.testResultsKey, {});
                const now = Date.now();
                // 清理过期的测试结果
                const filtered = Object.entries(cached).reduce((acc, [key, value]) => {
                    if (now - value.timestamp < config.testResultExpiry) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                return filtered;
            } catch (error) {
                console.error("加载测试结果缓存失败:", error);
                return {};
            }
        },

        saveTestResult(key, result) {
            try {
                const testResults = this.loadTestResults();
                const now = new Date();
                // 统一使用简短时间格式
                const formattedTime = now.toLocaleString("zh-CN", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                });

                testResults[key] = {
                    status: result.status,
                    message: result.message,
                    timestamp: now.getTime(),
                    testTime: formattedTime, // 保存简短格式的时间
                };
                GM_setValue(config.testResultsKey, testResults);
            } catch (error) {
                console.error("保存测试结果失败:", error);
            }
        },

        getTestResult(key) {
            const testResults = this.loadTestResults();
            return testResults[key];
        },

        async removeInvalidTokens() {
            const confirmResult = await this.showConfirmDialog(
                "确认清理",
                "是否删除所有无效的 Tokens？此操作不可撤销。"
            );

            if (!confirmResult) return;

            const testResults = this.loadTestResults();
            const validTokens = this.tokens.filter((token) => {
                const result = testResults[token.key];
                return !result || result.status === "success";
            });

            if (validTokens.length === this.tokens.length) {
                alert("没有发现无效的 Tokens");
                return;
            }

            this.tokens = validTokens;
            this.saveTokens();
            this.updateTokenGrid();
        },

        showAddTokenModal() {
            const content = UI.createElem("div", "claude-add-token-form");

            const nameInput = UI.createElem("input");
            nameInput.placeholder = "Token 名称";
            nameInput.setAttribute("aria-label", "Token 名称");

            const keyInput = UI.createElem("input");
            keyInput.placeholder = "Token 密钥";
            keyInput.setAttribute("aria-label", "Token 密钥");

            content.appendChild(nameInput);
            content.appendChild(keyInput);

            const { modal, buttonContainer, close } = UI.createModal("添加 Token", content);
            modal.querySelector(".claude-modal-content").classList.add("narrow-modal");

            const addButton = UI.createButton("添加", "claude-button primary");
            addButton.addEventListener("click", () => {
                if (this.validateInput(nameInput.value, keyInput.value)) {
                    // 获取当前时间并格式化
                    const now = new Date();
                    const formattedTime = now.toLocaleString("zh-CN", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    this.tokens.push({
                        name: nameInput.value,
                        key: keyInput.value,
                        createdAt: formattedTime, // 添加创建时间
                        timestamp: now.getTime() // 添加时间戳用于排序
                    });

                    this.saveTokens();
                    this.updateTokenGrid();
                    close();
                }
            });

            const cancelButton = UI.createButton("取消", "claude-button secondary");
            cancelButton.addEventListener("click", close);

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(addButton);
        },

        showEditTokenModal(index) {
            const token = this.tokens[index];
            const content = UI.createElem("div", "claude-edit-token-form");

            const nameInput = UI.createElem("input");
            nameInput.value = token.name;
            nameInput.placeholder = "Token 名称";

            const keyInput = UI.createElem("input");
            keyInput.value = token.key;
            keyInput.placeholder = "Token 密钥";

            content.appendChild(nameInput);
            content.appendChild(keyInput);

            const { modal, buttonContainer, close } = UI.createModal("编辑 Token", content);
            modal.querySelector(".claude-modal-content").classList.add("narrow-modal");

            const saveButton = UI.createButton("保存", "claude-button primary");
            saveButton.addEventListener("click", () => {
                if (this.validateInput(nameInput.value, keyInput.value)) {
                    // 保留原有的创建时间和时间戳
                    this.tokens[index] = {
                        name: nameInput.value,
                        key: keyInput.value,
                        createdAt: token.createdAt || "", // 保留原有的创建时间
                        timestamp: token.timestamp || Date.now() // 保留原有的时间戳
                    };

                    this.saveTokens();
                    this.updateTokenGrid();
                    close();
                }
            });

            const cancelButton = UI.createButton("取消", "claude-button secondary");
            cancelButton.addEventListener("click", close);

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(saveButton);
        },

        confirmDeleteToken(index) {
            const token = this.tokens[index];
            const content = UI.createElem("div", "claude-delete-confirm");

            content.innerHTML = `
                <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">⚠️</div>
                <div style="font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 12px;">删除确认</div>
                <div style="text-align: center; margin-bottom: 24px;">
                    您确定要删除 Token "${token.name}" 吗？<br>
                    此操作无法撤销。
                </div>
            `;

            const { modal, buttonContainer, close } = UI.createModal("", content);
            modal.querySelector(".claude-modal-content").classList.add("narrow-modal");

            const deleteButton = UI.createButton("删除", "claude-button primary");
            deleteButton.style.backgroundColor = "#e53e3e";
            deleteButton.addEventListener("click", () => {
                this.deleteToken(index);
                close();
            });

            const cancelButton = UI.createButton("取消", "claude-button secondary");
            cancelButton.addEventListener("click", close);

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(deleteButton);
        },

        deleteToken(index) {
            this.tokens.splice(index, 1);
            this.saveTokens();
            this.updateTokenGrid();
        },

        showBulkImportModal() {
            const content = UI.createElem("div", "claude-bulk-import-form");

            // 文本区域标签
            const textareaLabel = UI.createElem("label");
            textareaLabel.innerHTML = "<strong>1️⃣ Tokens 粘贴区：</strong><br>在这里粘贴您需要导入的 Tokens，每行一个！";
            content.appendChild(textareaLabel);

            // 文本区域
            const textarea = UI.createElem("textarea");
            textarea.rows = 10;
            content.appendChild(textarea);

            // 命名规则容器
            const namingRuleContainer = UI.createElem("div", "claude-naming-rule");

            // 命名规则标签
            const namingRuleLabel = UI.createElem("label");
            namingRuleLabel.innerHTML = "<strong>2️⃣ Tokens 命名规则：</strong>";
            namingRuleContainer.appendChild(namingRuleLabel);

            // 名称前缀
            const prefixLabel = UI.createElem("label");
            prefixLabel.textContent = "名称前缀：";
            namingRuleContainer.appendChild(prefixLabel);

            const prefixInput = UI.createElem("input");
            prefixInput.value = "token";
            namingRuleContainer.appendChild(prefixInput);

            // 起始编号
            const startNumberLabel = UI.createElem("label");
            startNumberLabel.textContent = "名称起始编号：";
            namingRuleContainer.appendChild(startNumberLabel);

            const startNumberInput = UI.createElem("input");
            startNumberInput.type = "number";
            startNumberInput.value = "1";
            namingRuleContainer.appendChild(startNumberInput);

            content.appendChild(namingRuleContainer);

            // 预览容器
            const previewLabel = UI.createElem("label");
            previewLabel.innerHTML = "<strong>3️⃣ Tokens 导入结果预览：</strong>";
            content.appendChild(previewLabel);

            const previewContainer = UI.createElem("div", "claude-preview-container");
            content.appendChild(previewContainer);

            const { modal, buttonContainer, close } = UI.createModal("批量导入 Tokens", content);

            const importButton = UI.createButton("导入", "claude-button primary");
            importButton.addEventListener("click", () => {
                this.performBulkImport(
                    textarea.value,
                    prefixInput.value,
                    startNumberInput.value
                );
                close();
            });

            const cancelButton = UI.createButton("取消", "claude-button secondary");
            cancelButton.addEventListener("click", close);

            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(importButton);

            // 更新预览
            const updatePreview = () => {
                this.previewBulkImport(
                    textarea.value,
                    prefixInput.value,
                    startNumberInput.value,
                    previewContainer
                );
            };

            [textarea, prefixInput, startNumberInput].forEach((elem) => {
                elem.addEventListener("input", updatePreview);
            });

            // 初始化预览
            updatePreview();
        },

        previewBulkImport(input, namePrefix, startNumber, previewContainer) {
            previewContainer.innerHTML = "";

            const tokens = this.parseTokens(input);
            const namedTokens = this.applyNamingRule(
                tokens,
                namePrefix,
                parseInt(startNumber)
            );

            const previewTitle = UI.createElem("div", "claude-preview-title");
            previewTitle.textContent = "请核对下方导入结果：";
            previewContainer.appendChild(previewTitle);

            if (namedTokens.length === 0) {
                const emptyMessage = UI.createElem("div", "claude-preview-item");
                emptyMessage.textContent = "等待输入...";
                previewContainer.appendChild(emptyMessage);
                return;
            }

            namedTokens.forEach((token) => {
                const previewItem = UI.createElem("div", "claude-preview-item");
                previewItem.innerHTML = `
                    <strong>${token.name}:</strong>
                    <span style="font-family: monospace; word-break: break-all;">${token.key}</span>
                `;
                previewContainer.appendChild(previewItem);
            });
        },

        performBulkImport(input, namePrefix, startNumber) {
            const tokens = this.parseTokens(input);
            const namedTokens = this.applyNamingRule(
                tokens,
                namePrefix,
                parseInt(startNumber)
            );

            if (namedTokens.length === 0) {
                alert("没有有效的 Tokens 可导入");
                return;
            }

            this.tokens = [...this.tokens, ...namedTokens];
            this.saveTokens();
            this.updateTokenGrid();
        },

        parseTokens(input) {
            return input
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => this.validateTokenKey(line))
                .map((key) => ({ key }));
        },

        applyNamingRule(tokens, namePrefix, startNumber) {
            return tokens.map((token, index) => {
                const number = startNumber + index;
                const name = `${namePrefix}${number.toString().padStart(2, "0")}`;
                return { ...token, name };
            });
        },

        exportTokens() {
            const testResults = this.loadTestResults();
            const exportData = this.tokens.map((token) => {
                const testResult = testResults[token.key] || {};
                return {
                    name: token.name,
                    sessionKey: token.key,
                    isValid: testResult.status === "success" ? true : testResult.status === "error" ? false : null,
                    testTime: testResult.testTime || null,
                    testMessage: testResult.message || null,
                };
            });

            // 创建并下载 JSON 文件
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `claude_tokens_${new Date().toISOString().split("T")[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        showWebDAVModal() {
            const content = UI.createElem("div", "claude-webdav-form");
            content.style.cssText = "width: 100%; max-width: 600px;";

            // 添加帮助信息
            const helpInfo = UI.createElem("div", "claude-webdav-help");
            helpInfo.style.cssText = `
                margin-bottom: 10px;
                padding: 12px;
                background-color: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                font-size: 13px;
                color: var(--text-color);
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            `;
            helpInfo.innerHTML = `
                <p style="margin: 0 0 10px 0; font-weight: 600; color: var(--text-color);">📝 WebDAV服务器设置说明：</p>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
                    <li>URL必须是完整的WebDAV路径，例如：https://dav.jianguoyun.com/dav/Claude/</li>
                    <li>确保路径末尾有斜杠"/"</li>
                    <li>如果遇到404错误，请确认路径是否存在</li>
                    <li>坚果云用户请使用应用专用密码</li>
                </ul>
            `;
            content.appendChild(helpInfo);

            // 创建表单容器
            const formContainer = UI.createElem("div", "claude-webdav-form-container");
            formContainer.style.cssText = `
                display: grid;
                gap: 8px;
                margin-bottom: 15px;
            `;

            // WebDAV服务器URL输入
            const urlGroup = UI.createElem("div", "input-group");
            urlGroup.style.cssText = "display: flex; align-items: center; gap: 10px;";

            const urlLabel = UI.createElem("label");
            urlLabel.textContent = "WebDAV URL:";
            urlLabel.style.cssText = "font-weight: 500; color: var(--text-color); min-width: 120px; text-align: right;";

            const urlInput = UI.createElem("input");
            urlInput.type = "text";
            urlInput.placeholder = "https://dav.jianguoyun.com/dav/Claude/";
            urlInput.value = GM_getValue("webdav_url", "");
            urlInput.style.cssText = `
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 14px;
                background-color: var(--bg-color);
                color: var(--text-color);
                transition: all 0.3s ease;
            `;

            urlGroup.appendChild(urlLabel);
            urlGroup.appendChild(urlInput);
            formContainer.appendChild(urlGroup);

            // 用户名输入
            const usernameGroup = UI.createElem("div", "input-group");
            usernameGroup.style.cssText = "display: flex; align-items: center; gap: 10px;";

            const usernameLabel = UI.createElem("label");
            usernameLabel.textContent = "用户名:";
            usernameLabel.style.cssText = "font-weight: 500; color: var(--text-color); min-width: 120px; text-align: right;";

            const usernameInput = UI.createElem("input");
            usernameInput.type = "text";
            usernameInput.placeholder = "用户名";
            usernameInput.value = GM_getValue("webdav_username", "");
            usernameInput.style.cssText = `
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 14px;
                background-color: var(--bg-color);
                color: var(--text-color);
                transition: all 0.3s ease;
            `;

            usernameGroup.appendChild(usernameLabel);
            usernameGroup.appendChild(usernameInput);
            formContainer.appendChild(usernameGroup);

            // 密码输入
            const passwordGroup = UI.createElem("div", "input-group");
            passwordGroup.style.cssText = "display: flex; align-items: center; gap: 10px;";

            const passwordLabel = UI.createElem("label");
            passwordLabel.textContent = "密码:";
            passwordLabel.style.cssText = "font-weight: 500; color: var(--text-color); min-width: 120px; text-align: right;";

            const passwordInput = UI.createElem("input");
            passwordInput.type = "password";
            passwordInput.placeholder = "密码";
            passwordInput.value = GM_getValue("webdav_password", "");
            passwordInput.style.cssText = `
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 14px;
                background-color: var(--bg-color);
                color: var(--text-color);
                transition: all 0.3s ease;
            `;

            passwordGroup.appendChild(passwordLabel);
            passwordGroup.appendChild(passwordInput);
            formContainer.appendChild(passwordGroup);

            // 文件名输入
            const filenameGroup = UI.createElem("div", "input-group");
            filenameGroup.style.cssText = "display: flex; align-items: center; gap: 10px;";

            const filenameLabel = UI.createElem("label");
            filenameLabel.textContent = "文件名:";
            filenameLabel.style.cssText = "font-weight: 500; color: var(--text-color); min-width: 120px; text-align: right;";

            const filenameInput = UI.createElem("input");
            filenameInput.type = "text";
            filenameInput.placeholder = "claude_tokens.json";
            filenameInput.value = GM_getValue("webdav_filename", "claude_tokens.json");
            filenameInput.style.cssText = `
                flex: 1;
                padding: 10px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                font-size: 14px;
                background-color: var(--bg-color);
                color: var(--text-color);
                transition: all 0.3s ease;
            `;

            filenameGroup.appendChild(filenameLabel);
            filenameGroup.appendChild(filenameInput);
            formContainer.appendChild(filenameGroup);

            content.appendChild(formContainer);

            // 测试连接按钮
            const testConnectionButton = UI.createButton("测试连接", "claude-button secondary");
            testConnectionButton.style.cssText = `
                width: 100%;
                margin: 10px 0;
                padding: 10px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 6px;
                background-color: var(--button-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            testConnectionButton.addEventListener("click", async () => {
                this.saveWebDAVSettings(urlInput.value, usernameInput.value, passwordInput.value, filenameInput.value);

                statusDisplay.style.display = "block";
                statusDisplay.textContent = "正在测试连接...";
                statusDisplay.style.backgroundColor = "var(--bg-color)";

                try {
                    await this.checkWebDAVDirectory(urlInput.value, usernameInput.value, passwordInput.value);
                    statusDisplay.textContent = "✅ 连接成功！目录存在且可访问。";
                    statusDisplay.style.backgroundColor = "#d4edda";
                } catch (error) {
                    statusDisplay.textContent = `❌ 连接失败: ${error.message}`;
                    statusDisplay.style.backgroundColor = "#f8d7da";
                }
            });
            content.appendChild(testConnectionButton);

            // 状态显示
            const statusDisplay = UI.createElem("div", "claude-webdav-status");
            statusDisplay.style.cssText = `
                margin: 10px 0;
                padding: 10px;
                border-radius: 6px;
                font-size: 14px;
                text-align: center;
                display: none;
                transition: all 0.3s ease;
            `;
            content.appendChild(statusDisplay);

            // 操作按钮容器
            const actionsContainer = UI.createElem("div", "claude-webdav-actions");
            actionsContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-top: 15px;
            `;

            // 备份按钮
            const backupButton = UI.createButton("备份到WebDAV", "claude-button primary");
            backupButton.style.cssText = `
                padding: 12px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 6px;
                background-color: #b3462f;
                color: white;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            backupButton.addEventListener("click", async () => {
                this.saveWebDAVSettings(urlInput.value, usernameInput.value, passwordInput.value, filenameInput.value);

                statusDisplay.style.display = "block";
                statusDisplay.textContent = "正在备份...";
                statusDisplay.style.backgroundColor = "var(--bg-color)";

                try {
                    await this.backupToWebDAV(urlInput.value, usernameInput.value, passwordInput.value, filenameInput.value);
                    statusDisplay.textContent = "✅ 备份成功！";
                    statusDisplay.style.backgroundColor = "#d4edda";
                } catch (error) {
                    statusDisplay.textContent = `❌ 备份失败: ${error.message}`;
                    statusDisplay.style.backgroundColor = "#f8d7da";
                }
            });

            // 恢复按钮
            const restoreButton = UI.createButton("从WebDAV恢复", "claude-button secondary");
            restoreButton.style.cssText = `
                padding: 12px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 6px;
                background-color: var(--button-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            restoreButton.addEventListener("click", async () => {
                this.saveWebDAVSettings(urlInput.value, usernameInput.value, passwordInput.value, filenameInput.value);

                statusDisplay.style.display = "block";
                statusDisplay.textContent = "正在恢复...";
                statusDisplay.style.backgroundColor = "var(--bg-color)";

                try {
                    await this.restoreFromWebDAV(urlInput.value, usernameInput.value, passwordInput.value, filenameInput.value);
                    statusDisplay.textContent = "✅ 恢复成功！";
                    statusDisplay.style.backgroundColor = "#d4edda";
                    this.updateTokenGrid();
                } catch (error) {
                    statusDisplay.textContent = `❌ 恢复失败: ${error.message}`;
                    statusDisplay.style.backgroundColor = "#f8d7da";
                }
            });

            // 关闭按钮
            const closeButton = UI.createButton("关闭", "claude-button secondary");
            closeButton.style.cssText = `
                padding: 12px;
                font-size: 14px;
                font-weight: 500;
                border-radius: 6px;
                background-color: var(--button-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            closeButton.addEventListener("click", () => {
                modal.remove();
            });

            actionsContainer.appendChild(backupButton);
            actionsContainer.appendChild(restoreButton);
            actionsContainer.appendChild(closeButton);
            content.appendChild(actionsContainer);

            // 创建模态框
            const { modal, buttonContainer } = UI.createModal("☁️ WebDAV备份与恢复", content, true);
            document.body.appendChild(modal);

            // 添加关闭按钮事件监听
            const closeBtn = modal.querySelector(".claude-close-button");
            if (closeBtn) {
                closeBtn.addEventListener("click", () => {
                    document.body.removeChild(modal);
                });
            }
        },

        saveWebDAVSettings(url, username, password, filename) {
            GM_setValue("webdav_url", url);
            GM_setValue("webdav_username", username);
            GM_setValue("webdav_password", password);
            GM_setValue("webdav_filename", filename);
        },

        async backupToWebDAV(url, username, password, filename) {
            // 准备备份数据
            const testResults = this.loadTestResults();
            const exportData = this.tokens.map((token) => {
                const testResult = testResults[token.key] || {};
                return {
                    name: token.name,
                    sessionKey: token.key,
                    isValid: testResult.status === "success" ? true : testResult.status === "error" ? false : null,
                    testTime: testResult.testTime || null,
                    testMessage: testResult.message || null,
                };
            });

            const jsonData = JSON.stringify(exportData, null, 2);

            // 确保URL以/结尾
            if (!url.endsWith('/')) {
                url += '/';
            }

            // 先检查目录是否存在
            try {
                await this.checkWebDAVDirectory(url, username, password);
            } catch (error) {
                // 如果是404错误，尝试创建目录
                if (error.message.includes("404")) {
                    try {
                        // 尝试创建父目录
                        const parentUrl = url.substring(0, url.lastIndexOf('/', url.length - 2) + 1);
                        if (parentUrl !== url) {
                            await this.createWebDAVDirectory(parentUrl, username, password, url.substring(parentUrl.length, url.length - 1));
                        } else {
                            throw new Error("无法确定父目录");
                        }
                    } catch (createError) {
                        throw new Error(`目录不存在且无法创建: ${createError.message}`);
                    }
                } else {
                    throw error;
                }
            }

            // 发送到WebDAV服务器
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "PUT",
                    url: url + filename,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Basic " + btoa(username + ":" + password)
                    },
                    data: jsonData,
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve();
                        } else {
                            console.error("WebDAV备份失败:", response);
                            reject(new Error(`HTTP错误: ${response.status} ${response.statusText || ''}\n响应: ${response.responseText || '无响应内容'}`));
                        }
                    },
                    onerror: function (error) {
                        console.error("WebDAV备份网络错误:", error);
                        reject(new Error(`网络错误: ${error.statusText || '连接失败'}`));
                    }
                });
            });
        },

        // 检查WebDAV目录是否存在
        checkWebDAVDirectory(url, username, password) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "PROPFIND",
                    url: url,
                    headers: {
                        "Depth": "0",
                        "Authorization": "Basic " + btoa(username + ":" + password)
                    },
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve();
                        } else {
                            reject(new Error(`HTTP错误: ${response.status} ${response.statusText || ''}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error(`网络错误: ${error.statusText || '连接失败'}`));
                    }
                });
            });
        },

        // 创建WebDAV目录
        createWebDAVDirectory(parentUrl, username, password, dirName) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "MKCOL",
                    url: parentUrl + dirName,
                    headers: {
                        "Authorization": "Basic " + btoa(username + ":" + password)
                    },
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve();
                        } else {
                            reject(new Error(`无法创建目录: HTTP错误 ${response.status} ${response.statusText || ''}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error(`网络错误: ${error.statusText || '连接失败'}`));
                    }
                });
            });
        },

        async restoreFromWebDAV(url, username, password, filename) {
            // 确保URL以/结尾
            if (!url.endsWith('/')) {
                url += '/';
            }

            // 从WebDAV服务器获取数据
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url + filename,
                    headers: {
                        "Authorization": "Basic " + btoa(username + ":" + password)
                    },
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);

                                // 转换数据格式
                                const tokens = data.map(item => ({
                                    name: item.name,
                                    key: item.sessionKey,
                                    createdAt: new Date().toLocaleString("zh-CN", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }),
                                    timestamp: Date.now()
                                }));

                                // 更新tokens
                                this.tokens = tokens;
                                this.saveTokens();

                                resolve();
                            } catch (error) {
                                console.error("解析WebDAV数据失败:", error, response.responseText);
                                reject(new Error(`解析数据失败: ${error.message}`));
                            }
                        } else {
                            console.error("WebDAV恢复失败:", response);
                            reject(new Error(`HTTP错误: ${response.status} ${response.statusText || ''}\n响应: ${response.responseText || '无响应内容'}`));
                        }
                    },
                    onerror: function (error) {
                        console.error("WebDAV恢复网络错误:", error);
                        reject(new Error(`网络错误: ${error.statusText || '连接失败'}`));
                    }
                });
            });
        },

        validateInput(name, key) {
            if (!name || !key) {
                alert("Token 名称和密钥都要填写！");
                return false;
            }
            // 移除对token名称的严格限制，允许更多字符，包括@和.
            // if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
            //     alert("Token 名称只能包含字母、数字、下划线和连字符！");
            //     return false;
            // }
            if (!this.validateTokenKey(key)) {
                alert("无效的 Token 密钥格式！");
                return false;
            }
            return true;
        },

        validateTokenKey(key) {
            return /^sk-ant-sid\d{2}-[A-Za-z0-9_-]*$/.test(key);
        },

        showConfirmDialog(title, message) {
            return new Promise((resolve) => {
                const content = UI.createElem("div", "claude-confirm-dialog");

                content.innerHTML = `
                    <div style="font-size: 48px; text-align: center; margin-bottom: 16px;">⚠️</div>
                    <div style="font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 12px;">${title}</div>
                    <div style="text-align: center; margin-bottom: 24px;">${message}</div>
                `;

                const { modal, buttonContainer, close } = UI.createModal("", content);
                modal.querySelector(".claude-modal-content").classList.add("narrow-modal");

                const confirmButton = UI.createButton("确认", "claude-button primary");
                confirmButton.addEventListener("click", () => {
                    close();
                    resolve(true);
                });

                const cancelButton = UI.createButton("取消", "claude-button secondary");
                cancelButton.addEventListener("click", () => {
                    close();
                    resolve(false);
                });

                buttonContainer.appendChild(cancelButton);
                buttonContainer.appendChild(confirmButton);
            });
        },

        fetchIPCountryCode() {
            this.ipDisplay.textContent = "IP: 加载中...";

            GM_xmlhttpRequest({
                method: "GET",
                url: config.ipApiUrl,
                onload: (response) => {
                    if (response.status === 200) {
                        this.ipDisplay.textContent = "IP: " + response.responseText.trim();
                    } else {
                        this.ipDisplay.textContent = "IP: 获取失败";
                    }
                },
                onerror: () => {
                    this.ipDisplay.textContent = "IP: 获取失败";
                },
            });
        },

        setupEventListeners() {
            // 拖拽相关事件
            this.toggleButton.addEventListener("mousedown", this.onMouseDown.bind(this));
            document.addEventListener("mousemove", this.onMouseMove.bind(this));
            document.addEventListener("mouseup", this.onMouseUp.bind(this));

            // 状态管理对象
            this.state = {
                isButtonHovered: false,
                isDropdownHovered: false,
                isDropdownVisible: false,
                isDragging: false,
                isProcessingClick: false,  // 新增：处理点击状态
                isClosing: false,  // 新增：窗口正在关闭的状态

                // 检查当前是否应该保持弹窗显示
                shouldKeepOpen() {
                    // 修改逻辑，即使在拖动过程中，也要考虑鼠标悬停状态
                    return this.isButtonHovered || this.isDropdownHovered;
                }
            };

            // 定时器
            this.hoverTimeout = null;
            this.closeTimeout = null;

            // 鼠标进入按钮
            this.toggleButton.addEventListener("mouseenter", (e) => {
                if (this.state.isProcessingClick) return;  // 如果正在处理点击，忽略hover

                this.state.isButtonHovered = true;
                clearTimeout(this.closeTimeout);
                clearTimeout(this.hoverTimeout);  // 确保清除之前的hover定时器

                // 如果下拉窗口未显示或正在关闭中，则显示窗口
                if (!this.state.isDropdownVisible || this.state.isClosing) {
                    // 如果窗口正在关闭，立即显示
                    if (this.state.isClosing) {
                        this.state.isClosing = false;
                        this.showDropdown();
                    } else {
                        this.hoverTimeout = setTimeout(() => {
                            this.showDropdown();
                        }, 300);
                    }
                }
            });

            // 鼠标离开按钮
            this.toggleButton.addEventListener("mouseleave", (e) => {
                if (this.state.isProcessingClick) return;  // 如果正在处理点击，忽略hover

                this.state.isButtonHovered = false;
                clearTimeout(this.hoverTimeout);

                // 检查是否应该关闭弹窗
                if (!this.state.shouldKeepOpen()) {
                    this.scheduleHideDropdown();
                }
            });

            // 按钮点击事件
            this.toggleButton.addEventListener("click", (e) => {
                if (this.state.isDragging) return;  // 如果正在拖拽，忽略点击

                this.state.isProcessingClick = true;
                clearTimeout(this.hoverTimeout);
                clearTimeout(this.closeTimeout);

                if (this.state.isDropdownVisible) {
                    this.hideDropdown();
                } else {
                    this.showDropdown();
                }

                setTimeout(() => {
                    this.state.isProcessingClick = false;
                }, 100);
            });

            // 鼠标进入弹窗
            this.dropdownContainer.addEventListener("mouseenter", () => {
                if (this.state.isProcessingClick) return;

                this.state.isDropdownHovered = true;
                clearTimeout(this.closeTimeout);

                // 如果弹窗在淡出过程中，恢复显示
                if (this.state.isDropdownVisible && this.dropdownContainer.style.opacity !== "1") {
                    this.dropdownContainer.style.opacity = "1";
                    this.dropdownContainer.style.transform = "scale(1)";
                }
            });

            // 鼠标离开弹窗
            this.dropdownContainer.addEventListener("mouseleave", () => {
                if (this.state.isProcessingClick) return;

                this.state.isDropdownHovered = false;

                // 检查是否应该关闭弹窗
                if (!this.state.shouldKeepOpen()) {
                    this.scheduleHideDropdown();
                }
            });

            // 点击其他区域关闭下拉菜单
            document.addEventListener("click", (e) => {
                if (
                    this.dropdownContainer.style.display === "flex" &&
                    !this.dropdownContainer.contains(e.target) &&
                    e.target !== this.toggleButton
                ) {
                    this.state.isDropdownHovered = false;
                    this.state.isButtonHovered = false;
                    this.hideDropdown();
                }
            });
        },

        onMouseDown(e) {
            if (e.button !== 0) return; // 只处理左键点击

            this.isDragging = true;
            this.state.isDragging = true;
            this.startX = e.clientX;
            this.startY = e.clientY;

            const rect = this.toggleButton.getBoundingClientRect();
            this.offsetX = this.startX - rect.left;
            this.offsetY = this.startY - rect.top;

            this.toggleButton.style.cursor = "grabbing";

            // 不再清除悬停定时器，允许在拖动过程中显示窗口
            // clearTimeout(this.hoverTimeout);
            clearTimeout(this.closeTimeout);

            // 如果鼠标在按钮上，立即显示下拉窗口
            if (this.state.isButtonHovered && !this.state.isDropdownVisible) {
                this.showDropdown();
            }

            // 阻止默认行为和事件冒泡
            e.preventDefault();
            e.stopPropagation();
        },

        onMouseMove(e) {
            // 检查鼠标是否在按钮上，用于处理拖动过程中的悬停
            const buttonRect = this.toggleButton.getBoundingClientRect();
            const isOverButton =
                e.clientX >= buttonRect.left &&
                e.clientX <= buttonRect.right &&
                e.clientY >= buttonRect.top &&
                e.clientY <= buttonRect.bottom;

            // 更新悬停状态
            if (isOverButton && !this.state.isButtonHovered) {
                this.state.isButtonHovered = true;
                // 如果下拉窗口未显示或正在关闭中，则显示窗口
                if (!this.state.isDropdownVisible || this.state.isClosing) {
                    clearTimeout(this.hoverTimeout);
                    // 如果窗口正在关闭或正在拖动，立即显示
                    if (this.state.isClosing || this.isDragging) {
                        this.state.isClosing = false;
                        this.showDropdown();
                    } else {
                        this.hoverTimeout = setTimeout(() => {
                            this.showDropdown();
                        }, 300);
                    }
                }
            } else if (!isOverButton && this.state.isButtonHovered) {
                this.state.isButtonHovered = false;
                clearTimeout(this.hoverTimeout);
                if (!this.state.shouldKeepOpen()) {
                    this.scheduleHideDropdown();
                }
            }

            if (!this.isDragging) return;

            const x = e.clientX - this.offsetX;
            const y = e.clientY - this.offsetY;

            // 计算底部位置
            const bottom = window.innerHeight - y - this.toggleButton.offsetHeight;

            // 确保按钮在窗口范围内
            const maxX = window.innerWidth - this.toggleButton.offsetWidth;
            const maxBottom = window.innerHeight - this.toggleButton.offsetHeight;

            this.buttonLeft = Math.max(0, Math.min(x, maxX));
            this.buttonBottom = Math.max(0, Math.min(bottom, maxBottom));

            // 更新按钮位置
            this.toggleButton.style.left = `${this.buttonLeft}px`;
            this.toggleButton.style.bottom = `${this.buttonBottom}px`;
            this.toggleButton.style.top = "auto";

            // 如果下拉窗口可见,更新其位置
            if (this.state.isDropdownVisible) {
                this.updateDropdownPosition();
            }

            e.preventDefault();
        },

        // 添加新方法用于更新下拉窗口位置
        updateDropdownPosition() {
            const buttonRect = this.toggleButton.getBoundingClientRect();
            const dropdownWidth = 600; // 下拉窗口宽度

            // 计算下拉窗口位置
            let left = buttonRect.right + 10;
            let top = buttonRect.top;

            // 检查是否超出右边界
            if (left + dropdownWidth > window.innerWidth) {
                // 如果右边放不下，则放到左边
                left = buttonRect.left - dropdownWidth - 10;
            }

            // 如果左边也放不下，则居中显示
            if (left < 0) {
                left = Math.max(0, (window.innerWidth - dropdownWidth) / 2);
            }

            // 检查是否超出底部边界
            const dropdownHeight = Math.min(this.dropdownContainer.scrollHeight, window.innerHeight * 0.8);
            if (top + dropdownHeight > window.innerHeight) {
                // 如果超出底部，则向上显示，确保完全可见
                top = Math.max(0, window.innerHeight - dropdownHeight - 10);
            }

            // 应用新位置
            this.dropdownContainer.style.left = `${left}px`;
            this.dropdownContainer.style.top = `${top}px`;
        },

        onMouseUp(e) {
            if (!this.isDragging) return;

            this.isDragging = false;
            this.state.isDragging = false;
            this.toggleButton.style.cursor = "move";

            // 保存位置
            GM_setValue("buttonLeft", this.buttonLeft);
            GM_setValue("buttonBottom", this.buttonBottom);

            // 检查鼠标是否在按钮上
            const buttonRect = this.toggleButton.getBoundingClientRect();
            const isOverButton =
                e.clientX >= buttonRect.left &&
                e.clientX <= buttonRect.right &&
                e.clientY >= buttonRect.top &&
                e.clientY <= buttonRect.bottom;

            // 更新悬停状态
            this.state.isButtonHovered = isOverButton;

            // 添加短暂延迟，避免与点击事件冲突
            setTimeout(() => {
                // 如果鼠标在按钮上且下拉窗口未显示，则显示下拉窗口
                if (isOverButton && !this.state.isDropdownVisible) {
                    this.showDropdown();
                }
                // 否则检查是否应该关闭弹窗
                else if (!this.state.shouldKeepOpen()) {
                    this.scheduleHideDropdown();
                }
            }, 100);

            e.preventDefault();
        },

        scheduleHideDropdown() {
            if (this.state.isProcessingClick) return;

            clearTimeout(this.closeTimeout);
            this.closeTimeout = setTimeout(() => {
                if (!this.state.shouldKeepOpen()) {
                    this.hideDropdown();
                }
            }, 300);
        },

        showDropdown() {
            // 立即更新状态
            this.state.isDropdownVisible = true;
            this.state.isClosing = false;

            // 计算下拉菜单位置
            const buttonRect = this.toggleButton.getBoundingClientRect();
            const dropdownWidth = 600;

            // 先显示容器但设为透明，以便获取实际高度
            this.dropdownContainer.style.opacity = "0";
            this.dropdownContainer.style.display = "flex";

            // 更新下拉窗口位置
            this.updateDropdownPosition();

            // 淡入效果
            setTimeout(() => {
                this.dropdownContainer.style.opacity = "1";
                this.dropdownContainer.style.transform = "scale(1)";
                this.toggleButton.style.transform = "scale(1.1)";
            }, 10);
        },

        hideDropdown() {
            // 设置正在关闭状态
            this.state.isClosing = true;

            // 添加动画
            this.dropdownContainer.style.opacity = "0";
            this.dropdownContainer.style.transform = "scale(0.95)";
            this.toggleButton.style.transform = "scale(1)";

            // 等待动画完成后隐藏
            this.closeTimeout = setTimeout(() => {
                if (!this.state.shouldKeepOpen()) {
                    this.dropdownContainer.style.display = "none";
                    this.state.isDropdownVisible = false;
                    this.state.isClosing = false;  // 重置关闭状态
                } else {
                    // 如果此时应该保持打开，则恢复显示
                    this.state.isClosing = false;  // 重置关闭状态
                    this.dropdownContainer.style.opacity = "1";
                    this.dropdownContainer.style.transform = "scale(1)";
                }
            }, 300);
        },

        observeThemeChanges() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.type === "attributes" &&
                        mutation.attributeName === "data-mode"
                    ) {
                        this.isDarkMode =
                            document.documentElement.getAttribute("data-mode") === "dark";
                        this.updateStyles();
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["data-mode"],
            });
        },
    };

    // 初始化应用
    App.init();
})(); 
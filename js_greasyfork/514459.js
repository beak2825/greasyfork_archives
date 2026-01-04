// ==UserScript==
// @name         [Claude] Session Key (Token) \切换&管理/ 20241028.2
// @version      20241028.2
// @description  带批量测活、更用户友好的 [Claude] Session Key (Token) 管理
// @author       xiaohan17, ethan-j, 0_V, ... and Luminus (+ AI assistant)
//
// @match        https://claude.ai/*
// @match        https://claude.asia/*
// @match        https://demo.fuclaude.com/*
// @include      https://*fuclaude*/*
//
// @icon         https://claude.ai/favicon.ico
//
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
//
// @connect      ipapi.co
// @connect      api.claude.ai
// @namespace https://greasyfork.org/users/1387562
// @downloadURL https://update.greasyfork.org/scripts/514459/%5BClaude%5D%20Session%20Key%20%28Token%29%20%5C%E5%88%87%E6%8D%A2%E7%AE%A1%E7%90%86%20202410282.user.js
// @updateURL https://update.greasyfork.org/scripts/514459/%5BClaude%5D%20Session%20Key%20%28Token%29%20%5C%E5%88%87%E6%8D%A2%E7%AE%A1%E7%90%86%20202410282.meta.js
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
                    --bg-color: ${
                      isDarkMode ? theme.dark.bgColor : theme.light.bgColor
                    };
                    --text-color: ${
                      isDarkMode ? theme.dark.textColor : theme.light.textColor
                    };
                    --border-color: ${
                      isDarkMode
                        ? theme.dark.borderColor
                        : theme.light.borderColor
                    };
                    --button-bg: ${
                      isDarkMode ? theme.dark.buttonBg : theme.light.buttonBg
                    };
                    --button-hover-bg: ${
                      isDarkMode
                        ? theme.dark.buttonHoverBg
                        : theme.light.buttonHoverBg
                    };
                    --modal-bg: ${
                      isDarkMode ? theme.dark.modalBg : theme.light.modalBg
                    };
                }
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
                    z-index: 10000;
                }
                .claude-modal-content {
                    background-color: var(--bg-color);
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    width: 500px;
                    max-width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                }
                .claude-modal-content.narrow-modal {
                    width: 400px;  // 将宽度改小
                    max-width: 80%;  // 保持响应式
                }
                .claude-modal h2 {
                    margin-top: 0;
                    margin-bottom: 15px;
                    color: var(--text-color);
                    font-size: 18px;
                    font-weight: 600;
                }
                .claude-modal input, .claude-modal textarea, .claude-modal select {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    font-size: 14px;
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    transition: border-color 0.3s ease;
                }
                .claude-modal input:focus, .claude-modal textarea:focus, .claude-modal select:focus {
                    outline: none;
                    border-color: #6e6e6e;
                }
                .claude-modal button {
                    padding: 10px 16px;
                    margin-right: 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.1s;
                    font-size: 14px;
                    font-weight: 500;
                }
                .claude-modal button:active {
                    transform: scale(0.98);
                }
                .claude-button-save {
                    background-color: #b3462f;
                    color: #ffffff;
                }
                .claude-button-save:hover {
                    background-color: #a03d2a;
                }
                .claude-button-cancel {
                    background-color: var(--button-bg);
                    color: var(--text-color);
                }
                .claude-button-cancel:hover {
                    background-color: var(--button-hover-bg);
                }
                .claude-button-container {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr); // 为4列均分
                    gap: 12px;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                }
                .claude-button-container button {
                    min-width: 100px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .claude-button-container .claude-button-save {
                    background-color: #b3462f;
                    color: white;
                }
                .claude-button-container .claude-button-save:hover {
                    background-color: #a03d2a;
                }
                .claude-button-container .claude-button-cancel {
                    background-color: var(--button-bg);
                    color: var(--text-color);
                }
                .claude-button-container .claude-button-cancel:hover {
                    background-color: var(--button-hover-bg);
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
                .claude-token-list {
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 20px;
                    padding-right: 12px;
                }
                .claude-token-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    margin-bottom: 12px;
                    border-radius: 12px;
                    background-color: var(--bg-color);
                    border: 1px solid var(--border-color);
                    transition: all 0.2s ease;
                }
                .claude-token-item:hover {
                    /* transform: translateY(-2px); // 移除上移动画 */
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .claude-token-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .claude-token-icon {
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s ease, transform 0.2s ease;
                    font-size: 16px;
                }
                .claude-token-icon:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
                .test-status {
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .test-status.success {
                    background-color: rgba(72, 187, 120, 0.1);
                    color: #48bb78;
                }
                .test-status.error {
                    background-color: rgba(245, 101, 101, 0.1);
                    color: #f56565;
                }
                .loading-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .claude-add-token-button, .claude-bulk-import-button {
                    margin-top: 15px;
                    width: 100%;
                }
                #claude-toggle-button {
                    position: fixed;
                    top: 10px;
                    right: 200px;
                    z-index: 9998;
                    width: 120px;
                    height: 36px;
                    background-color: transparent;
                    border: none;
                    border-radius: 0.375rem;
                    font-size: 15px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background-color 0.3s ease, color 0.3s ease;
                    color: var(--text-color);
                }
                #claude-toggle-button:hover {
                    background-color: var(--button-hover-bg);
                }
                #claude-container {
                    position: fixed;
                    top: 50px;
                    right: 77px;
                    z-index: 9999;
                    background-color: var(--bg-color);
                    padding: 12px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    display: none;
                    font-size: 14px;
                    width: auto;
                }
                #claude-token-select {
                    margin-right: 8px;
                    font-size: 14px;
                    width: 150px;
                    background-color: var(--bg-color);
                    color: var(--text-color);
                    height: 36px;
                    padding: 0 8px;
                    line-height: 36px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    background-size: 12px;
                }
                #claude-switch-button, #claude-manage-button {
                    font-size: 14px;
                    height: 36px;
                    padding: 0 12px;
                    line-height: 34px;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.1s;
                }
                #claude-switch-button:active, #claude-manage-button:active {
                    transform: scale(0.98);
                }
                .claude-preview-container {
                    margin-top: 15px;
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 15px;
                    background-color: var(--bg-color);
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
                .claude-preview-item:nth-child(even) {
                    background-color: var(--button-hover-bg);
                }
                .claude-preview-name {
                    font-weight: bold;
                    color: #b3462f;
                }
                .claude-preview-key {
                    font-family: monospace;
                    word-break: break-all;
                }
                .claude-naming-rule {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 15px;
                }
                .claude-naming-rule label {
                    margin-bottom: 5px;
                    color: var(--text-color);
                }
                .claude-naming-rule select, .claude-naming-rule input {
                    width: 100%;
                    margin-bottom: 10px;
                }
                .claude-token-item.test-success {
                    background-color: rgba(125, 74, 59, 0.05);
                    border-color: rgba(125, 74, 59, 0.3);
                    box-shadow: 0 2px 4px rgba(125, 74, 59, 0.1);
                }
                .claude-token-item.test-error {
                    background-color: rgba(96, 96, 96, 0.05);
                    border-color: rgba(96, 96, 96, 0.2);
                    box-shadow: 0 2px 4px rgba(96, 96, 96, 0.1);
                }
                .claude-token-item .test-status {
                    margin-left: 8px;
                    display: inline-flex;
                    align-items: center;
                }
                
                .claude-token-item .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid var(--border-color);
                    border-top: 2px solid #b3462f;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-right: 4px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .test-result-icon {
                    font-size: 16px;
                    margin-right: 4px;
                }
                
                .test-result-text {
                    font-size: 14px;
                    color: var(--text-color);
                }
                /* 滚动条样式 */
                .claude-token-list::-webkit-scrollbar,
                .claude-preview-container::-webkit-scrollbar,
                .claude-modal-content::-webkit-scrollbar {
                    width: 6px;
                }
      
                .claude-token-list::-webkit-scrollbar-track,
                .claude-preview-container::-webkit-scrollbar-track,
                .claude-modal-content::-webkit-scrollbar-track {
                    background: transparent;
                }
      
                .claude-token-list::-webkit-scrollbar-thumb,
                .claude-preview-container::-webkit-scrollbar-thumb,
                .claude-modal-content::-webkit-scrollbar-thumb {
                    background-color: ${
                      isDarkMode
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(0, 0, 0, 0.2)"
                    };
                    border-radius: 3px;
                }
      
                .claude-token-list::-webkit-scrollbar-thumb:hover,
                .claude-preview-container::-webkit-scrollbar-thumb:hover,
                .claude-modal-content::-webkit-scrollbar-thumb:hover {
                    background-color: ${
                      isDarkMode
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.3)"
                    };
                }
                .token-action-btn {
                    padding: 6px 12px;
                    border-radius: 6px;
                    border: 1px solid var(--border-color);
                    background: transparent;
                    color: var(--text-color);
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
      
                .token-action-btn:hover {
                    background-color: var(--button-hover-bg);
                    transform: translateY(-1px);
                }
      
                .token-action-btn.edit-token-button {
                    color: #4a90e2;
                    border-color: #4a90e2;
                }
      
                .token-action-btn.delete-token-button {
                    color: #e24a4a;
                    border-color: #e24a4a;
                }
      
                .token-action-btn.edit-token-button:hover {
                    background-color: rgba(74, 144, 226, 0.1);
                }
      
                .token-action-btn.delete-token-button:hover {
                    background-color: rgba(226, 74, 74, 0.1);
                }
      
                .test-status {
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
      
                .test-status.success {
                    background-color: rgba(72, 187, 120, 0.1);
                    color: #48bb78;
                }
      
                .test-status.error {
                    background-color: rgba(245, 101, 101, 0.1);
                    color: #f56565;
                }
      
                .token-action-icon {
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
      
                .token-action-icon:hover {
                    background-color: var(--button-hover-bg);
                    transform: translateY(-1px);
                }
      
                .token-action-icon.edit-token-button {
                    color: var(--text-color);
                }
      
                .token-action-icon.delete-token-button {
                    color: #e24a4a;
                }
      
                .token-action-icon svg {
                    width: 16px;
                    height: 16px;
                }
                // 编辑模态框样式
                .claude-edit-token-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 10px;
                }
                
                .claude-edit-token-form input {
                    background-color: ${
                      isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.02)"
                    };
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                
                .claude-edit-token-form input:focus {
                    border-color: #b3462f;
                    box-shadow: 0 0 0 2px rgba(179, 70, 47, 0.1);
                    outline: none;
                }
                
                .claude-edit-token-form label {
                    display: block;
                    margin-bottom: 6px;
                    color: var(--text-color);
                    font-size: 14px;
                    font-weight: 500;
                }
                
                // 删除确认模态框样式
                .claude-delete-confirm {
                    text-align: center;
                    padding: 20px 10px;
                }
                
                .claude-delete-confirm-icon {
                    font-size: 48px;
                    color: #e24a4a;
                    margin-bottom: 16px;
                }
                
                .claude-delete-confirm-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color);
                    margin-bottom: 12px;
                }
                
                .claude-delete-confirm-message {
                    font-size: 14px;
                    color: ${
                      isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : "rgba(0, 0, 0, 0.6)"
                    };
                    margin-bottom: 24px;
                    line-height: 1.5;
                }
                
                .claude-delete-confirm-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                
                .claude-delete-confirm-buttons button {
                    min-width: 100px;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                
                .claude-delete-button {
                    background-color: #e24a4a;
                    color: white;
                    border: none;
                }
                
                .claude-delete-button:hover {
                    background-color: #d43c3c;
                }
                .claude-token-item {
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .claude-token-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .claude-token-item.current-token {
                    border: 2px solid #b3462f;
                    background-color: ${
                      isDarkMode
                        ? "rgba(179, 70, 47, 0.1)"
                        : "rgba(179, 70, 47, 0.05)"
                    };
                    position: relative;
                }
                
                .current-token-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background-color: #b3462f;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .claude-help-text {
                    text-align: center;
                    color: var(--text-color);
                    opacity: 0.8;
                    margin-bottom: 15px;
                    font-size: 14px;
                    padding: 8px;
                    background-color: var(--button-bg);
                    border-radius: 6px;
                }
                
                #claude-toggle-button {
                    min-width: 160px;
                    background-color: var(--button-bg);
                    border: 1px solid var(--border-color);
                }
            `;

  const UI = {
    createElem(tag, styles) {
      const elem = document.createElement(tag);
      Object.assign(elem.style, styles);
      return elem;
    },

    createButton(text, styles, className) {
      const button = this.createElem("button", styles);
      button.textContent = text;
      button.className = className;
      return button;
    },

    createModal(title, content, includeCloseButton = false) {
      const modal = document.createElement("div");
      modal.className = "claude-modal";
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("role", "dialog");

      const modalContent = document.createElement("div");
      modalContent.className = "claude-modal-content";

      const titleElem = document.createElement("h2");
      titleElem.textContent = title;
      modalContent.appendChild(titleElem);

      if (includeCloseButton) {
        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.className = "claude-close-button";
        modalContent.appendChild(closeButton);
      }

      modalContent.appendChild(content);

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "claude-button-container";
      // 添加样式
      buttonContainer.style.borderTop = "1px solid var(--border-color)";
      buttonContainer.style.paddingTop = "15px";
      buttonContainer.style.marginTop = "15px";

      modalContent.appendChild(buttonContainer);

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      return {
        modal,
        buttonContainer,
        close: () => document.body.removeChild(modal),
      };
    },

    createTestButton() {
      const button = this.createButton("测试", {}, "claude-button-cancel");
      button.style.marginLeft = "8px";
      return button;
    },

    createTestResultSpan() {
      const span = document.createElement("span");
      span.style.marginLeft = "8px";
      span.style.fontSize = "14px";
      return span;
    },
  };

  const App = {
    init() {
      this.isDarkMode =
        document.documentElement.getAttribute("data-mode") === "dark";
      this.injectStyles();
      this.tokens = this.loadTokens();
      this.createUI();
      this.setupEventListeners();
      this.fetchIPCountryCode();
      this.observeThemeChanges();
      this.selectCurrentToken();
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
        return savedTokens && savedTokens.length > 0
          ? savedTokens
          : [config.defaultToken];
      } catch (error) {
        console.error("Error loading tokens:", error);
        return [config.defaultToken];
      }
    },

    saveTokens() {
      try {
        GM_setValue(config.storageKey, this.tokens);
      } catch (error) {
        console.error("Error saving tokens:", error);
        alert("Failed to save tokens. Please try again.");
      }
    },

    createUI() {
      this.toggleButton = UI.createButton("", {}, "claude-button-cancel");
      this.toggleButton.id = "claude-toggle-button";
      this.toggleButton.addEventListener("click", () =>
        this.showManageTokensModal()
      );

      // 初始化时就显示IP
      this.fetchIPCountryCode();

      document.body.appendChild(this.toggleButton);
    },

    setupEventListeners() {
      // 使用事件委托，但要处理SVG元素的情况
      document.addEventListener("click", (event) => {
        const actionButton = event.target.closest(
          ".delete-token-button, .edit-token-button"
        );
        if (!actionButton) return;

        event.stopPropagation(); // 阻止事件冒泡，防止触发卡片的点击事件

        if (actionButton.classList.contains("delete-token-button")) {
          this.confirmDeleteToken(actionButton.dataset.index);
        } else if (actionButton.classList.contains("edit-token-button")) {
          this.showEditTokenModal(actionButton.dataset.index);
        }
      });

      // 其他事件监听保持不变
      document.addEventListener("click", (event) => {
        if (event.target.classList.contains("claude-add-token-button")) {
          this.showAddTokenModal();
        } else if (
          event.target.classList.contains("claude-bulk-import-button")
        ) {
          this.showBulkImportModal();
        }
      });
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

    updateTokenSelect() {
      this.updateManageTokensModal();
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

    showManageTokensModal() {
      const content = document.createElement("div");
      content.className = "claude-token-manager";

      const tokenList = this.createTokenList();
      content.appendChild(tokenList);

      const { modal, buttonContainer, close } = UI.createModal(
        "📚 Session 管理",
        content,
        true
      );

      // 添加说明文本
      const helpText = document.createElement("div");
      helpText.className = "claude-help-text";
      helpText.textContent = "点击任意 Session 卡片即可切换使用";
      content.insertBefore(helpText, tokenList);

      // 添加关闭按钮事件
      const closeButton = modal.querySelector(".claude-close-button");
      if (closeButton) {
        closeButton.addEventListener("click", close);
      }

      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          close();
        }
      });

      // 设置 buttonContainer 为垂直布局
      buttonContainer.style.display = "flex";
      buttonContainer.style.flexDirection = "column";
      buttonContainer.style.width = "100%";

      // 创建两个按钮容器来分行显示
      const topButtonRow = document.createElement("div");
      topButtonRow.style.cssText = "margin-bottom: 12px; width: 100%;";

      const bottomButtonRow = document.createElement("div");
      bottomButtonRow.style.cssText =
        "display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%;";

      // 一键测活按钮
      const testAllButton = UI.createButton(
        "🔍 一键测活",
        {},
        "claude-button-save"
      );
      testAllButton.style.width = "100%";
      testAllButton.addEventListener("click", () => this.testAllTokens());
      topButtonRow.appendChild(testAllButton);

      // 其他按钮
      const removeInvalidButton = UI.createButton(
        "🗑️ 清理无效",
        {},
        "claude-button-cancel"
      );
      removeInvalidButton.style.marginLeft = "0"; // 设置左边距为0
      removeInvalidButton.style.marginRight = "0"; // 设置右边距为0

      const addTokenButton = UI.createButton(
        "📮 单个添加",
        {},
        "claude-button-cancel"
      );
      addTokenButton.style.marginLeft = "0"; // 设置左边距为0
      addTokenButton.style.marginRight = "0"; // 设置右边距为0

      const bulkImportButton = UI.createButton(
        "📥 批量导入",
        {},
        "claude-button-cancel"
      );
      bulkImportButton.style.marginLeft = "0"; // 设置左边距为0
      bulkImportButton.style.marginRight = "0"; // 设置右边距为0

      const exportButton = UI.createButton(
        "📤 批量导出",
        {},
        "claude-button-cancel"
      );
      exportButton.style.marginLeft = "0"; // 设置左边距为0
      exportButton.style.marginRight = "0"; // 设置右边距为0

      removeInvalidButton.addEventListener("click", () =>
        this.removeInvalidTokens()
      );
      addTokenButton.addEventListener("click", () => this.showAddTokenModal());
      bulkImportButton.addEventListener("click", () =>
        this.showBulkImportModal()
      );
      exportButton.addEventListener("click", () => this.exportTokens());

      // 将按钮添加到底部按钮行
      bottomButtonRow.appendChild(removeInvalidButton);
      bottomButtonRow.appendChild(addTokenButton);
      bottomButtonRow.appendChild(bulkImportButton);
      bottomButtonRow.appendChild(exportButton);

      buttonContainer.appendChild(topButtonRow);
      buttonContainer.appendChild(bottomButtonRow);
    },

    createTokenList() {
      const tokenList = document.createElement("div");
      tokenList.className = "claude-token-list";

      this.tokens.forEach((token, index) => {
        const tokenItem = this.createTokenItem(token, index);
        tokenList.appendChild(tokenItem);
      });

      return tokenList;
    },

    createTokenItem(token, index) {
      const tokenItem = document.createElement("div");
      tokenItem.className = "claude-token-item";
      tokenItem.dataset.index = index;

      // 检查是否是当前使用的token
      const currentTokenName = GM_getValue(config.currentTokenKey);
      if (token.name === currentTokenName) {
        tokenItem.classList.add("current-token");

        // 添加"当前"标签
        const currentBadge = document.createElement("div");
        currentBadge.className = "current-token-badge";
        currentBadge.textContent = "当前";
        tokenItem.appendChild(currentBadge);
      }

      // 左侧信息容器
      const infoContainer = document.createElement("div");
      infoContainer.className = "token-info";
      infoContainer.style.cssText =
        "display: flex; flex-direction: column; gap: 8px; flex: 1;";

      // 第一行：序号、名称和操作按钮
      const topRow = document.createElement("div");
      topRow.style.cssText =
        "display: flex; align-items: center; justify-content: space-between;";

      // 左侧序号和名称
      const nameContainer = document.createElement("div");
      nameContainer.style.cssText =
        "display: flex; align-items: center; gap: 12px;";

      const numberBadge = document.createElement("span");
      numberBadge.className = "token-number";
      numberBadge.textContent = `#${(index + 1).toString().padStart(2, "0")}`;
      numberBadge.style.cssText =
        "padding: 2px 8px; border-radius: 12px; font-size: 12px; background-color: var(--button-bg);";

      const nameSpan = document.createElement("span");
      nameSpan.textContent = token.name;
      nameSpan.style.cssText = "font-weight: 500; font-size: 14px;";

      nameContainer.appendChild(numberBadge);
      nameContainer.appendChild(nameSpan);

      // 右侧编辑和删除按钮
      const actionButtons = document.createElement("div");
      actionButtons.style.cssText = "display: flex; gap: 8px;";

      const editButton = document.createElement("button");
      editButton.className = "token-action-btn edit-token-button";
      editButton.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
          `;
      editButton.dataset.index = index;
      editButton.addEventListener("click", (event) => {
        event.stopPropagation(); // 阻止事件冒泡，防止触发卡片的点击事件
        this.showEditTokenModal(index);
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "token-action-btn delete-token-button";
      deleteButton.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
          `;
      deleteButton.dataset.index = index;
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // 阻止事件冒泡，防止触发卡片的点击事件
        this.confirmDeleteToken(index);
      });

      actionButtons.appendChild(editButton);
      actionButtons.appendChild(deleteButton);

      topRow.appendChild(nameContainer);
      topRow.appendChild(actionButtons);
      infoContainer.appendChild(topRow);

      // 第二行：测试状态和时间
      const bottomRow = document.createElement("div");
      bottomRow.style.cssText =
        "display: flex; align-items: center; gap: 12px;";

      const testStatus = document.createElement("span");
      testStatus.className = "test-status untested";
      testStatus.style.cursor = "pointer";

      const timeStamp = document.createElement("span");
      timeStamp.className = "time-stamp";
      timeStamp.style.cssText =
        "font-size: 12px; color: var(--text-color); opacity: 0.7;";

      // 检查缓存的测试结果
      const cachedResult = this.getTestResult(token.key);
      if (cachedResult) {
        this.updateTestStatus(testStatus, timeStamp, cachedResult);
      } else {
        // 修改默认状态为 untested
        testStatus.className = "test-status untested";
        testStatus.innerHTML =
          '<span style="font-size: 10px;">●</span><span>未测试</span>';
        timeStamp.textContent = ""; // 未测试时不显示时间
      }

      // 添加点击测试功能
      testStatus.addEventListener("click", async (event) => {
        event.stopPropagation(); // 阻止事件冒泡
        if (!testStatus.classList.contains("loading")) {
          this.showLoadingSpinner(testStatus);
          const result = await this.testToken(token.key);
          this.saveTestResult(token.key, result);
          this.updateTestStatus(testStatus, timeStamp, result);
        }
      });

      bottomRow.appendChild(testStatus);
      bottomRow.appendChild(timeStamp);
      infoContainer.appendChild(bottomRow);

      tokenItem.appendChild(infoContainer);

      // 修改点击切换功能
      tokenItem.addEventListener("click", async () => {
        // 先检查是否有缓存的测试结果
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

        // 如果没有缓存结果或结果已过期，进��实时测试
        if (!cachedResult) {
          const testStatus = tokenItem.querySelector(".test-status");
          this.showLoadingSpinner(testStatus);
          const result = await this.testToken(token.key);
          this.saveTestResult(token.key, result);

          // 如果测试结果为无效，提示用户并询问是否继续
          if (result.status === "error") {
            this.updateTestStatus(
              testStatus,
              tokenItem.querySelector(".time-stamp"),
              result
            );

            const confirmResult = await this.showConfirmDialog(
              "警告",
              `测试显示该 Token "${token.name}" 无效，是否仍要切换到该 Token？`
            );

            if (!confirmResult) {
              return;
            }
          }
        }

        // Token 有效或用户确认要使用无效token，执行切换操作
        this.applyToken(token.key);
        GM_setValue(config.currentTokenKey, token.name);

        // 更新高亮显示
        document.querySelectorAll(".claude-token-item").forEach((item) => {
          item.classList.remove("current-token");
          // 移除所有现有的 current-token-badge
          const badge = item.querySelector(".current-token-badge");
          if (badge) {
            badge.remove();
          }
        });

        tokenItem.classList.add("current-token");

        // 添加"当前"标签
        if (!tokenItem.querySelector(".current-token-badge")) {
          const currentBadge = document.createElement("div");
          currentBadge.className = "current-token-badge";
          currentBadge.textContent = "当前";
          tokenItem.appendChild(currentBadge);
        }
      });

      return tokenItem;
    },

    showAddTokenModal() {
      const content = document.createElement("div");
      content.className = "claude-add-token-form";

      const nameInput = document.createElement("input");
      nameInput.placeholder = "Token 名称";
      nameInput.setAttribute("aria-label", "Token 名称：");
      content.appendChild(nameInput);

      const keyInput = document.createElement("input");
      keyInput.placeholder = "Token 密钥";
      keyInput.setAttribute("aria-label", "Token 密钥：");
      content.appendChild(keyInput);

      const { modal, buttonContainer, close } = UI.createModal(
        "📮 添加 Token",
        content
      );
      modal
        .querySelector(".claude-modal-content")
        .classList.add("narrow-modal");

      const addButton = UI.createButton("添加", {}, "claude-button-save");
      addButton.addEventListener("click", () => {
        if (this.validateInput(nameInput.value, keyInput.value)) {
          // 添加新token时不进行测试，也不添加测试结果缓存
          this.tokens.push({
            name: nameInput.value,
            key: keyInput.value,
          });

          // 确保不会有该token的缓存测试结果
          const testResults = this.loadTestResults();
          if (testResults[keyInput.value]) {
            delete testResults[keyInput.value];
            GM_setValue(config.testResultsKey, testResults);
          }

          this.saveTokens();
          this.updateTokenSelect();
          this.updateManageTokensModal();
          close();
        }
      });
      buttonContainer.appendChild(addButton);

      const cancelButton = UI.createButton("取消", {}, "claude-button-cancel");
      cancelButton.addEventListener("click", close);
      buttonContainer.appendChild(cancelButton);
    },

    showEditTokenModal(index) {
      const token = this.tokens[index];
      const content = document.createElement("div");
      content.className = "claude-edit-token-form";

      // 名称输入区域
      const nameGroup = document.createElement("div");
      const nameLabel = document.createElement("label");
      nameLabel.textContent = "Token 名称";
      const nameInput = document.createElement("input");
      nameInput.value = token.name;
      nameInput.placeholder = "请输入 Token 名称";
      nameGroup.appendChild(nameLabel);
      nameGroup.appendChild(nameInput);

      // 密钥输入区域
      const keyGroup = document.createElement("div");
      const keyLabel = document.createElement("label");
      keyLabel.textContent = "Token 密钥";
      const keyInput = document.createElement("input");
      keyInput.value = token.key;
      keyInput.placeholder = "请输入 Token 密钥";
      keyGroup.appendChild(keyLabel);
      keyGroup.appendChild(keyInput);

      content.appendChild(nameGroup);
      content.appendChild(keyGroup);

      const { modal, buttonContainer, close } = UI.createModal(
        "✏️ 编辑 Token",
        content
      );
      modal
        .querySelector(".claude-modal-content")
        .classList.add("narrow-modal");

      const saveButton = UI.createButton("保存", {}, "claude-button-save");
      saveButton.addEventListener("click", () => {
        if (this.validateInput(nameInput.value, keyInput.value)) {
          this.tokens[index] = { name: nameInput.value, key: keyInput.value };
          this.saveTokens();
          this.updateTokenSelect();
          this.updateManageTokensModal();
          close();
        }
      });

      const cancelButton = UI.createButton("取消", {}, "claude-button-cancel");
      cancelButton.addEventListener("click", close);

      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(saveButton);
    },

    showBulkImportModal() {
      const content = document.createElement("div");
      content.className = "claude-bulk-import-form";

      const textareaLabel = document.createElement("label");
      textareaLabel.innerHTML =
        "<strong>1️⃣ Tokens 粘贴区：</strong><br>" +
        "在这里粘贴您需要导入的 Tokens，每行一个！";
      textareaLabel.setAttribute("for", "claude-bulk-import-textarea");
      content.appendChild(textareaLabel);

      const textarea = document.createElement("textarea");
      textarea.id = "claude-bulk-import-textarea";
      textarea.placeholder = "";
      textarea.rows = 10;
      content.appendChild(textarea);

      const namingRuleContainer = document.createElement("div");
      namingRuleContainer.className = "claude-naming-rule";

      const namingRuleContainerLabel = document.createElement("label");
      namingRuleContainerLabel.innerHTML =
        "<strong>2️⃣ Tokens 命名规则：</strong>";
      namingRuleContainerLabel.setAttribute("for", "claude-naming-rule");
      namingRuleContainer.appendChild(namingRuleContainerLabel);

      const nameLabel = document.createElement("label");
      nameLabel.textContent = "名称前缀：";
      nameLabel.setAttribute("for", "claude-name-prefix");
      namingRuleContainer.appendChild(nameLabel);

      const nameInput = document.createElement("input");
      nameInput.id = "claude-name-prefix";
      nameInput.value = "token";
      namingRuleContainer.appendChild(nameInput);

      const numberLabel = document.createElement("label");
      numberLabel.textContent = "名称起始编号：";
      numberLabel.setAttribute("for", "claude-start-number");
      namingRuleContainer.appendChild(numberLabel);

      const numberInput = document.createElement("input");
      numberInput.id = "claude-start-number";
      numberInput.type = "number";
      numberInput.value = "1";
      namingRuleContainer.appendChild(numberInput);

      const orderLabel = document.createElement("label");
      orderLabel.textContent = "名称排序方式：";
      orderLabel.setAttribute("for", "claude-order-select");
      namingRuleContainer.appendChild(orderLabel);

      const orderSelect = document.createElement("select");
      orderSelect.id = "claude-order-select";
      orderSelect.innerHTML = `
                        <option value="asc">顺序</option>
                        <option value="desc">倒序</option>
                    `;
      namingRuleContainer.appendChild(orderSelect);

      content.appendChild(namingRuleContainer);

      const previewContainer = document.createElement("div");
      previewContainer.className = "claude-preview-container";

      const previewContainerLabel = document.createElement("label");
      previewContainerLabel.innerHTML =
        "<strong>3️⃣ Tokens 导入结果 预览：</strong>";
      previewContainerLabel.setAttribute("for", "claude-preview-container");

      content.appendChild(previewContainerLabel);

      content.appendChild(previewContainer);

      const { modal, buttonContainer, close } = UI.createModal(
        "📥 批量入 Tokens",
        content
      );

      const importButton = UI.createButton("导入", {}, "claude-button-save");
      importButton.addEventListener("click", () => {
        this.performBulkImport(
          textarea.value,
          nameInput.value,
          numberInput.value,
          orderSelect.value
        );
        close();
      });
      buttonContainer.appendChild(importButton);

      const cancelButton = UI.createButton("取消", {}, "claude-button-cancel");
      cancelButton.addEventListener("click", close);
      buttonContainer.appendChild(cancelButton);

      const updatePreview = () => {
        this.previewBulkImport(
          textarea.value,
          nameInput.value,
          numberInput.value,
          orderSelect.value,
          previewContainer
        );
      };

      [textarea, nameInput, numberInput, orderSelect].forEach((elem) => {
        elem.addEventListener("input", updatePreview);
      });

      updatePreview();
    },

    previewBulkImport(input, namePrefix, startNumber, order, previewContainer) {
      const tokens = this.parseTokens(input);
      const namedTokens = this.applyNamingRule(
        tokens,
        namePrefix,
        parseInt(startNumber),
        order
      );
      const claudePreviewTitle = document.createElement("div");
      claudePreviewTitle.innerHTML =
        '<div class="claude-preview-title">请核对下方导入结果：</div>';
      previewContainer.appendChild(claudePreviewTitle);

      namedTokens.forEach((token) => {
        const previewItem = document.createElement("div");
        previewItem.className = "claude-preview-item";
        previewItem.innerHTML = `
                            <span class="claude-preview-name">${token.name}:</span>
                            <span class="claude-preview-key">${token.key}</span>
                        `;
        previewContainer.appendChild(previewItem);
      });

      if (namedTokens.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "claude-preview-item";
        emptyMessage.textContent = "等待... ";
        previewContainer.appendChild(emptyMessage);
      }
    },

    performBulkImport(input, namePrefix, startNumber, order) {
      const tokens = this.parseTokens(input);
      const namedTokens = this.applyNamingRule(
        tokens,
        namePrefix,
        parseInt(startNumber),
        order
      );
      this.tokens = [...this.tokens, ...namedTokens];
      this.saveTokens();
      this.updateTokenSelect();
      this.updateManageTokensModal();
    },

    parseTokens(input) {
      return input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => this.validateTokenKey(line))
        .map((key) => ({ key }));
    },

    applyNamingRule(tokens, namePrefix, startNumber, order) {
      return tokens.map((token, index) => {
        const number =
          order === "asc"
            ? startNumber + index
            : startNumber + tokens.length - 1 - index;
        const name = `${namePrefix}${number.toString().padStart(2, "0")}`;
        return { ...token, name };
      });
    },

    updateManageTokensModal() {
      const tokenList = document.querySelector(".claude-token-list");
      if (tokenList) {
        tokenList.innerHTML = "";
        this.tokens.forEach((token, index) => {
          const tokenItem = this.createTokenItem(token, index);
          tokenList.appendChild(tokenItem);
        });
      }
    },

    confirmDeleteToken(index) {
      const token = this.tokens[index];
      const content = document.createElement("div");
      content.className = "claude-delete-confirm";

      content.innerHTML = `
              <div class="claude-delete-confirm-icon">⚠️</div>
              <div class="claude-delete-confirm-title">删除确认</div>
              <div class="claude-delete-confirm-message">
                  您确定要删除 Token "${token.name}" 吗？<br>
                  此作无法撤销。
              </div>
          `;

      const { modal, buttonContainer, close } = UI.createModal("", content);
      modal
        .querySelector(".claude-modal-content")
        .classList.add("narrow-modal");

      const deleteButton = UI.createButton("删除", {}, "claude-delete-button");
      deleteButton.addEventListener("click", () => {
        this.deleteToken(index);
        close();
      });

      const cancelButton = UI.createButton("取消", {}, "claude-button-cancel");
      cancelButton.addEventListener("click", close);

      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "claude-delete-confirm-buttons";
      buttonsContainer.appendChild(cancelButton);
      buttonsContainer.appendChild(deleteButton);

      buttonContainer.appendChild(buttonsContainer);
    },

    deleteToken(index) {
      this.tokens.splice(index, 1);
      this.saveTokens();
      this.updateTokenSelect();
      this.updateManageTokensModal();
    },

    validateInput(name, key) {
      if (!name || !key) {
        alert("Token 名称和密钥都要填写！");
        return false;
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        alert("Token 名称只能包含字母、数字、下划线和连字符！");
        return false;
      }
      if (!this.validateTokenKey(key)) {
        alert("无效的 Token 密钥格式！");
        return false;
      }
      return true;
    },

    validateTokenKey(key) {
      return /^sk-ant-sid\d{2}-[A-Za-z0-9_-]*$/.test(key);
    },

    fetchIPCountryCode: (() => {
      let lastFetchTime = 0;
      const FETCH_INTERVAL = 60000; // 1 minute

      return function () {
        const now = Date.now();
        if (now - lastFetchTime < FETCH_INTERVAL) {
          return;
        }

        lastFetchTime = now;
        this.toggleButton.innerHTML =
          "🌎 IP:&nbsp;&nbsp; <strong>Loading...</strong>";

        GM_xmlhttpRequest({
          method: "GET",
          url: config.ipApiUrl,
          onload: (response) => {
            if (response.status === 200) {
              this.toggleButton.innerHTML =
                "🌎 IP:&nbsp;&nbsp; <strong>" +
                response.responseText.trim() +
                "</strong>";
            } else {
              this.toggleButton.innerHTML =
                "🌎 IP:&nbsp;&nbsp; <strong>ERROR</strong>";
            }
          },
          onerror: () => {
            this.toggleButton.innerHTML =
              "🌎 IP:&nbsp;&nbsp; <strong>ERROR</strong>";
          },
        });
      };
    })(),

    selectCurrentToken() {
      const currentTokenName = GM_getValue(config.currentTokenKey);
      if (currentTokenName) {
        const token = this.tokens.find(
          (token) => token.name === currentTokenName
        );
        if (token) {
          // 可以在这里添加其他需要的初始化逻辑
        }
      }
    },

    async testToken(key) {
      return new Promise((resolve) => {
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://api.claude.ai/api/organizations",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
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

    async testAllTokens() {
      const tokenItems = document.querySelectorAll(
        ".claude-token-list .claude-token-item"
      );
      // 修改选择器以匹配新的布局结构
      const testButton = document.querySelector(
        ".claude-modal .claude-button-container .claude-button-save"
      );
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
          currentChunk.map((tokenItem) => this.processTokenItem(tokenItem))
        );
      }

      testButton.disabled = false;
      testButton.textContent = "🔍 一键测活";
    },

    async processTokenItem(tokenItem) {
      const index = tokenItem.dataset.index;
      const token = this.tokens[index];
      const testStatus = tokenItem.querySelector(".test-status");
      const timeStamp = tokenItem.querySelector(".time-stamp");

      // 显示加载动画
      this.showLoadingSpinner(testStatus);

      // 测试 token 并保存结果
      const result = await this.testToken(token.key);
      this.saveTestResult(token.key, result);

      // 更新测试状态显示
      this.updateTestStatus(testStatus, timeStamp, result);
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
        console.error("加载测试结果缓存失:", error);
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

    showLoadingSpinner(container) {
      container.className = "test-status";
      container.innerHTML = `
                <div class="loading-spinner"></div>
                <span>测试中</span>
            `;
    },

    updateTestStatus(statusContainer, timeContainer, result) {
      statusContainer.className = `test-status ${result.status}`;
      const icon = result.status === "success" ? "●" : "●";
      const text = result.status === "success" ? "有效" : "无效";

      statusContainer.innerHTML = `
                <span style="font-size: 10px;">${icon}</span>
                <span>${text}</span>
            `;

      // 直接使用保存的格式化时间，如果没有则生成新的
      timeContainer.textContent =
        result.testTime ||
        new Date().toLocaleString("zh-CN", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
    },

    // 添加删除无效token的方法
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
      this.updateTokenSelect();
      this.updateManageTokensModal();
    },

    // 添加确认对话框方法
    showConfirmDialog(title, message) {
      return new Promise((resolve) => {
        const content = document.createElement("div");
        content.className = "claude-delete-confirm";
        content.innerHTML = `
                    <div class="claude-delete-confirm-icon">⚠️</div>
                    <div class="claude-delete-confirm-title">${title}</div>
                    <div class="claude-delete-confirm-message">${message}</div>
                `;

        const { modal, buttonContainer, close } = UI.createModal("", content);
        modal
          .querySelector(".claude-modal-content")
          .classList.add("narrow-modal");

        const confirmButton = UI.createButton(
          "确认",
          {},
          "claude-delete-button"
        );
        confirmButton.addEventListener("click", () => {
          close();
          resolve(true);
        });

        const cancelButton = UI.createButton(
          "取消",
          {},
          "claude-button-cancel"
        );
        cancelButton.addEventListener("click", () => {
          close();
          resolve(false);
        });

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "claude-delete-confirm-buttons";
        buttonsContainer.appendChild(cancelButton);
        buttonsContainer.appendChild(confirmButton);

        buttonContainer.appendChild(buttonsContainer);
      });
    },

    // 添加导出功能方法
    exportTokens() {
      const testResults = this.loadTestResults();
      const exportData = this.tokens.map((token) => {
        const testResult = testResults[token.key] || {};
        return {
          name: token.name,
          sessionKey: token.key,
          isValid:
            testResult.status === "success"
              ? true
              : testResult.status === "error"
              ? false
              : null, // null 表示未测试
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
      a.download = `claude_tokens_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  };

  // Initialize the application
  App.init();
})();

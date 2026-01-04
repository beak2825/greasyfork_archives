// ==UserScript==
// @name         ClaudeToken 切换（自用）
// @version      1.0.0
// @description  动态切换claude的token
// @author       ethan-j
// @match        https://claude.ai/*
// @match        https://demo.fuclaude.com/*
// @match        https://claude.asia/*
// @match        https://claude.zheyu.ink/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      ipapi.co
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1338998
// @downloadURL https://update.greasyfork.org/scripts/502072/ClaudeToken%20%E5%88%87%E6%8D%A2%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502072/ClaudeToken%20%E5%88%87%E6%8D%A2%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        storageKey: 'claudeTokens',
        ipApiUrl: 'https://ipapi.co/country_code'
    };

    // 样式
    const getStyles = (isDarkMode) => `
    .claude-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    .claude-modal-content {
        background-color: ${isDarkMode ? '#2c2b28' : '#faf9f7'};
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
        width: 400px;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    .claude-modal h2 {
        margin-top: 0;
        margin-bottom: 15px;
        color: ${isDarkMode ? '#f5f4ef' : '#333'};
        font-size: 18px;
        font-weight: 600;
    }
    .claude-token-list {
        max-height: 60vh;
        overflow-y: auto;
        margin-bottom: 15px;
    }
    .claude-token-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid ${isDarkMode ? '#3f3f3c' : '#eee'};
    }
    .claude-token-item:last-child {
        border-bottom: none;
    }
    .claude-token-item input {
        flex-grow: 1;
        margin-right: 10px;
        padding: 5px;
        border: 1px solid ${isDarkMode ? '#3f3f3c' : '#ddd'};
        border-radius: 4px;
        font-size: 14px;
        background-color: ${isDarkMode ? '#1f1e1b' : '#fff'};
        color: ${isDarkMode ? '#f5f4ef' : '#333'};
    }
    .claude-token-item button {
        padding: 5px 10px;
        margin-left: 5px;
        border: none;
        border-radius: 4px;
        background-color: ${isDarkMode ? '#3f3f3c' : '#f0f0f0'};
        color: ${isDarkMode ? '#f5f4ef' : '#333'};
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .claude-token-item button:hover {
        background-color: ${isDarkMode ? '#4a4a47' : '#e0e0e0'};
    }
    .claude-token-item button.cancel {
        background-color: ${isDarkMode ? '#3a3935' : '#ffebee'};
        color: ${isDarkMode ? '#ff9b9b' : '#d32f2f'};
    }
    .claude-token-item button.cancel:hover {
        background-color: ${isDarkMode ? '#454540' : '#ffcdd2'};
    }
    .claude-modal button.close {
        display: block;
        width: 100%;
        padding: 8px;
        margin-top: 10px;
        border: none;
        border-radius: 4px;
        background-color: ${isDarkMode ? '#5a5a5a' : '#4a4a4a'};
        color: ${isDarkMode ? '#f5f4ef' : 'white'};
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    .claude-modal button.close:hover {
        background-color: ${isDarkMode ? '#666' : '#333'};
    }

    /* Add Token Modal Styles */
    .claude-modal-content.add-token {
        background-color: ${isDarkMode ? '#2c2b28' : '#faf9f7'};
        border-radius: 8px;
        padding: 16px;
        width: 280px;
        box-shadow: 0 2px 4px ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    }
    .claude-modal-content.add-token h2 {
        color: ${isDarkMode ? '#f5f4ef' : '#29261b'};
        font-size: 18px;
        margin-bottom: 12px;
        font-weight: 600;
    }
    .claude-modal-content.add-token form {
        display: flex;
        flex-direction: column;
    }
    .claude-modal-content.add-token input {
        width: 100%;
        padding: 8px;
        margin-bottom: 12px;
        border: 1px solid ${isDarkMode ? '#3f3f3c' : '#e0e0e0'};
        border-radius: 4px;
        font-size: 14px;
        color: ${isDarkMode ? '#f5f4ef' : '#29261b'};
        background-color: ${isDarkMode ? '#1f1e1b' : '#ffffff'};
        transition: border-color 0.2s ease;
    }
    .claude-modal-content.add-token input:focus {
        outline: none;
        border-color: ${isDarkMode ? '#5a5a5a' : '#b0b0b0'};
    }
    .claude-modal-content.add-token .button-container {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 4px;
    }
    .claude-modal-content.add-token button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .claude-modal-content.add-token button.add {
        background-color: ${isDarkMode ? '#4a4a47' : '#e6e6e6'};
        color: ${isDarkMode ? '#f5f4ef' : '#29261b'};
    }
    .claude-modal-content.add-token button.add:hover {
        background-color: ${isDarkMode ? '#5a5a57' : '#d6d6d6'};
    }
    .claude-modal-content.add-token button.cancel {
        background-color: ${isDarkMode ? '#3f3f3c' : '#f0f0f0'};
        color: ${isDarkMode ? '#f5f4ef' : '#29261b'};
    }
    .claude-modal-content.add-token button.cancel:hover {
        background-color: ${isDarkMode ? '#4a4a47' : '#e0e0e0'};
    }
`;

    // UI 组件
    const UI = {
        createElem(tag, styles) {
            const elem = document.createElement(tag);
            Object.assign(elem.style, styles);
            return elem;
        },

        createButton(text, styles) {
            const button = this.createElem('button', styles);
            button.innerText = text;
            return button;
        },

        createTokenSelect(isDarkMode) {
            return this.createElem('select', {
                marginRight: '4px',
                fontSize: '12px',
                width: '150px',
                backgroundColor: isDarkMode ? '#2f2f2c' : '#f5f1e9',
                color: isDarkMode ? '#f5f4ef' : '#333',
                height: '24px',
                padding: '0 4px',
                lineHeight: '24px',
                border: `1px solid ${isDarkMode ? '#3f3f3c' : '#ccc'}`,
                borderRadius: '3px',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right .5em top 50%',
                backgroundSize: '.65em auto',
            });
        },

        createModal(title, content) {
            const modal = document.createElement('div');
            modal.className = 'claude-modal';

            const modalContent = document.createElement('div');
            modalContent.className = 'claude-modal-content';

            const titleElem = document.createElement('h2');
            titleElem.textContent = title;
            modalContent.appendChild(titleElem);

            modalContent.appendChild(content);
            modal.appendChild(modalContent);

            document.body.appendChild(modal);

            return {
                modal,
                close: () => document.body.removeChild(modal)
            };
        }
    };

    // 主要功能
    const App = {
        init() {
            this.isDarkMode = document.documentElement.getAttribute('data-mode') === 'dark';
            this.injectStyles();
            this.tokens = this.loadTokens();
            this.createUI();
            this.setupEventListeners();
            this.updateTokenSelect();
            this.fetchIPCountryCode();
            this.observeThemeChanges();
            this.checkCurrentToken();
        },

        checkCurrentToken() {
            // 这里需要根据您的具体实现来获取当前使用的token
            // 以下是一个示例，您可能需要根据实际情况调整
            const currentToken = this.getCurrentTokenFromCookie(); // 假设您有这样一个方法

            if (currentToken) {
                const tokenIndex = this.tokens.findIndex(t => t.key === currentToken);
                if (tokenIndex !== -1) {
                    this.tokenSelect.value = tokenIndex;
                    localStorage.setItem('lastSelectedTokenIndex', tokenIndex);
                }
            }
        },

        getCurrentTokenFromCookie() {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith('sessionKey=')) {
                    return cookie.substring('sessionKey='.length, cookie.length);
                }
            }
            return null; // 如果没有找到sessionKey cookie
        },

        injectStyles() {
            this.styleElem = document.createElement('style');
            this.styleElem.textContent = getStyles(this.isDarkMode);
            document.head.appendChild(this.styleElem);
        },

        updateStyles() {
            this.styleElem.textContent = getStyles(this.isDarkMode);
            this.updateUIColors();
        },

        updateUIColors() {
            Object.assign(this.container.style, {
                backgroundColor: this.isDarkMode ? '#2c2b28' : '#fcfaf5',
                boxShadow: `0 1px 3px ${this.isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)'}`,
            });

            Object.assign(this.tokenSelect.style, {
                backgroundColor: this.isDarkMode ? '#2f2f2c' : '#f5f1e9',
                color: this.isDarkMode ? '#f5f4ef' : '#333',
                border: `1px solid ${this.isDarkMode ? '#3f3f3c' : '#ccc'}`,
            });

            [this.switchButton, this.addButton, this.manageButton].forEach(button => {
                Object.assign(button.style, {
                    backgroundColor: this.isDarkMode ? '#2f2f2c' : '#f5f1e9',
                    color: this.isDarkMode ? '#f5f4ef' : '#333',
                    border: `1px solid ${this.isDarkMode ? '#3f3f3c' : '#ccc'}`,
                });
            });

            this.toggleButton.style.color = this.isDarkMode ? '#f5f4ef' : '#29261b';
        },

        // 加载令牌
        loadTokens() {
            const defaultTokens = [
                { name: 'F', key: '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' },
            ];

            const savedTokens = JSON.parse(GM_getValue(config.storageKey, '[]'));
            return savedTokens.length > 0 ? savedTokens : defaultTokens;
        },

        // 保存令牌
        saveTokens() {
            GM_setValue(config.storageKey, JSON.stringify(this.tokens));
        },

        createUI() {
            this.tokenSelect = UI.createTokenSelect(this.isDarkMode);
            this.toggleButton = UI.createButton('...', {
                position: 'fixed',
                top: '10px',
                right: '95px',
                zIndex: '9998',
                width: '36px',
                height: '36px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                color: this.isDarkMode ? '#f5f4ef' : '#29261b',
            });
            this.switchButton = UI.createButton('切换', {
                fontSize: '12px',
                height: '24px',
                padding: '0 8px',
                lineHeight: '22px',
                border: `1px solid ${this.isDarkMode ? '#3f3f3c' : '#ccc'}`,
                borderRadius: '3px',
                backgroundColor: this.isDarkMode ? '#2f2f2c' : '#f5f1e9',
                color: this.isDarkMode ? '#f5f4ef' : '#333',
                cursor: 'pointer',
            });
            this.addButton = UI.createButton('添加', {
                fontSize: '12px',
                height: '24px',
                padding: '0 8px',
                lineHeight: '22px',
                border: `1px solid ${this.isDarkMode ? '#3f3f3c' : '#ccc'}`,
                borderRadius: '3px',
                backgroundColor: this.isDarkMode ? '#2f2f2c' : '#f5f1e9',
                color: this.isDarkMode ? '#f5f4ef' : '#333',
                cursor: 'pointer',
            });
            this.manageButton = UI.createButton('管理', {
                fontSize: '12px',
                height: '24px',
                padding: '0 8px',
                lineHeight: '22px',
                border: `1px solid ${this.isDarkMode ? '#3f3f3c' : '#ccc'}`,
                borderRadius: '3px',
                backgroundColor: this.isDarkMode ? '#2f2f2c' : '#f5f1e9',
                color: this.isDarkMode ? '#f5f4ef' : '#333',
                cursor: 'pointer',
            });

            this.container = UI.createElem('div', {
                position: 'fixed',
                top: '50px',
                right: '77px',
                zIndex: '9999',
                backgroundColor: this.isDarkMode ? '#2c2b28' : '#fcfaf5',
                padding: '8px',
                borderRadius: '3px',
                boxShadow: `0 1px 3px ${this.isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.2)'}`,
                display: 'none',
                fontSize: '12px',
                width: 'auto',
            });

            const buttonContainer = UI.createElem('div', {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
            });

            buttonContainer.appendChild(this.tokenSelect);
            buttonContainer.appendChild(this.switchButton);
            buttonContainer.appendChild(this.addButton);
            buttonContainer.appendChild(this.manageButton);
            this.container.appendChild(buttonContainer);

            document.body.appendChild(this.container);
            document.body.appendChild(this.toggleButton);
        },

        setupEventListeners() {
            this.toggleButton.addEventListener('click', () => this.toggleContainer());
            this.toggleButton.addEventListener('mouseover', () => {
                this.toggleButton.style.backgroundColor = this.isDarkMode ? '#1a1915' : '#ded8c4';
                this.toggleButton.style.color = this.isDarkMode ? '#f5f4ef' : '#29261b';
            });
            this.toggleButton.addEventListener('mouseout', () => {
                this.toggleButton.style.backgroundColor = 'transparent';
                this.toggleButton.style.color = this.isDarkMode ? '#f5f4ef' : '#29261b';
            });
            this.switchButton.addEventListener('click', () => this.switchToken());
            this.addButton.addEventListener('click', () => this.showAddTokenModal());
            this.manageButton.addEventListener('click', () => this.showManageTokensModal());
        },

        observeThemeChanges() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-mode') {
                        this.isDarkMode = document.documentElement.getAttribute('data-mode') === 'dark';
                        this.updateStyles();
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-mode']
            });
        },

        toggleContainer() {
            this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
        },

        updateTokenSelect() {
            this.tokenSelect.innerHTML = '';
            this.tokens.forEach((token, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.text = token.name;
                this.tokenSelect.appendChild(option);
            });

            // 恢复上次选中的token
            const lastSelectedIndex = localStorage.getItem('lastSelectedTokenIndex');
            if (lastSelectedIndex !== null && lastSelectedIndex < this.tokens.length) {
                this.tokenSelect.value = lastSelectedIndex;
            }
        },

        switchToken() {
            const selectedToken = this.tokens[this.tokenSelect.value];
            this.applyToken(selectedToken.key);

            // 保存当前选中的token索引
            localStorage.setItem('lastSelectedTokenIndex', this.tokenSelect.value);
        },

        applyToken(token) {
            const currentURL = window.location.href;
            const baseURL = new URL(currentURL).origin;  // 获取URL的基本部分，例如 "https://claude.ai"

            // 设置cookie的函数
            const setCookie = (domain) => {
                document.cookie = `sessionKey=${token}; path=/; domain=${domain}`;
            };

            const tokenIndex = this.tokens.findIndex(t => t.key === token);
            if (tokenIndex !== -1) {
                this.tokenSelect.value = tokenIndex;
                localStorage.setItem('lastSelectedTokenIndex', tokenIndex);
            }

            // 根据不同的域名设置cookie和重定向
            if (currentURL.startsWith('https://claude.ai/')) {
                setCookie('.claude.ai');
                window.location.href = baseURL;
            } else if (currentURL.startsWith('https://demo.fuclaude.com/')) {
                setCookie('.fuclaude.com');
                window.location.href = `${baseURL}/login_token?session_key=${token}`;
            } else if (currentURL.startsWith('https://claude.asia/')) {
                setCookie('.claude.asia');
                window.location.href = `${baseURL}/login_token?session_key=${token}`;
            } else {
                // 对于其他可能的匹配网站，我们使用一个通用的处理方式
                const domain = new URL(currentURL).hostname;
                setCookie(domain);
                // 如果不确定是否需要 login_token 参数，可以尝试直接重定向到基本URL
                window.location.href = `${baseURL}/login_token?session_key=${token}`;
            }
        },

        showAddTokenModal() {
            const modal = document.createElement('div');
            modal.className = 'claude-modal';

            const content = document.createElement('div');
            content.className = 'claude-modal-content add-token';

            const title = document.createElement('h2');
            title.textContent = '添加新Token';
            content.appendChild(title);

            const form = document.createElement('form');
            form.onsubmit = (e) => e.preventDefault(); // Prevent form submission

            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Token名称';
            nameInput.required = true;
            form.appendChild(nameInput);

            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.placeholder = 'Token密钥';
            keyInput.required = true;
            form.appendChild(keyInput);

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.className = 'cancel';
            buttonContainer.appendChild(cancelButton);

            const addButton = document.createElement('button');
            addButton.textContent = '添加';
            addButton.className = 'add';
            addButton.type = 'submit';
            buttonContainer.appendChild(addButton);

            form.appendChild(buttonContainer);
            content.appendChild(form);
            modal.appendChild(content);

            document.body.appendChild(modal);

            const closeModal = () => {
                document.body.removeChild(modal);
            };

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (nameInput.value && keyInput.value) {
                    this.tokens.push({ name: nameInput.value, key: keyInput.value });
                    this.saveTokens();
                    this.updateTokenSelect();
                    closeModal();
                }
            });

            cancelButton.addEventListener('click', closeModal);

            // Add keyboard event listener
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        },

        showManageTokensModal() {
            const content = document.createElement('div');
            const tokenList = document.createElement('div');
            tokenList.className = 'claude-token-list';

            this.tokens.forEach((token, index) => {
                const tokenItem = document.createElement('div');
                tokenItem.className = 'claude-token-item';

                const nameInput = document.createElement('input');
                nameInput.value = token.name;
                nameInput.placeholder = 'Token名称';

                const saveButton = document.createElement('button');
                saveButton.textContent = '保存';
                saveButton.addEventListener('click', () => {
                    this.tokens[index].name = nameInput.value;
                    this.saveTokens();
                    this.updateTokenSelect();
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.className = 'cancel';
                deleteButton.addEventListener('click', () => {
                    if (confirm('确定要删除这个Token吗？')) {
                        this.tokens.splice(index, 1);
                        this.saveTokens();
                        this.updateTokenSelect();
                        tokenItem.remove();
                    }
                });

                tokenItem.appendChild(nameInput);
                tokenItem.appendChild(saveButton);
                tokenItem.appendChild(deleteButton);
                tokenList.appendChild(tokenItem);
            });

            content.appendChild(tokenList);
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.className = 'close';
            content.appendChild(closeButton);

            const { modal, close } = UI.createModal('管理Tokens', content);
            closeButton.addEventListener('click', close);

            // 添加键盘事件监听器
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    close();
                }
            });
        },

        fetchIPCountryCode() {
            GM_xmlhttpRequest({
                method: "GET",
                url: config.ipApiUrl,
                onload: (response) => {
                    if (response.status === 200) {
                        this.toggleButton.innerText = response.responseText.trim();
                    } else {
                        this.toggleButton.innerText = 'ERR';
                    }
                },
                onerror: () => {
                    this.toggleButton.innerText = 'ERR';
                }
            });
        }
    };

    // 初始化应用
    App.init();
})();
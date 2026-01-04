// ==UserScript==
// @name         ClaudeToken切换(十七优化版)
// @namespace    https://www.violet17.com
// @version      1.7.1
// @description  动态切换claude的token
// @author       xiaohan17(author), ethan-j
// @match        https://claude.ai/*
// @match        https://demo.fuclaude.com/*
// @match        https://claude.asia/*
// @grant        GM_xmlhttpRequest
// @connect      ipapi.co
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/501501/ClaudeToken%E5%88%87%E6%8D%A2%28%E5%8D%81%E4%B8%83%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501501/ClaudeToken%E5%88%87%E6%8D%A2%28%E5%8D%81%E4%B8%83%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        storageKey: 'claudeTokens',
        ipApiUrl: 'https://ipapi.co/country_code',
        defaultToken: {
            name: 'xiaohan17',
            key: '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'
        }
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
            background-color: ${isDarkMode ? '#2c2b28' : '#fff'};
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
            width: 300px;
            max-width: 90%;
        }
        .claude-modal h2 {
            margin-top: 0;
            margin-bottom: 15px;
            color: ${isDarkMode ? '#f5f4ef' : '#333'};
            font-size: 18px;
        }
        .claude-modal input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid ${isDarkMode ? '#3f3f3c' : '#ddd'};
            border-radius: 4px;
            font-size: 14px;
            background-color: ${isDarkMode ? '#2f2f2c' : '#fff'};
            color: ${isDarkMode ? '#f5f4ef' : '#333'};
        }
        .claude-modal button {
            padding: 8px 12px;
            margin-right: 10px;
            border: none;
            border-radius: 4px;
            background-color: ${isDarkMode ? '#3f3f3c' : '#4CAF50'};
            color: ${isDarkMode ? '#f5f4ef' : 'white'};
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .claude-modal button:hover {
            background-color: ${isDarkMode ? '#4a4a47' : '#45a049'};
        }
        .claude-modal button.cancel {
            background-color: ${isDarkMode ? '#3a3935' : '#f44336'};
        }
        .claude-modal button.cancel:hover {
            background-color: ${isDarkMode ? '#454540' : '#da190b'};
        }
        .claude-token-list {
            max-height: 200px;
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
        .claude-token-manager {
            background-color: ${isDarkMode ? '#2c2b28' : '#fcfaf5'};
            color: ${isDarkMode ? '#f5f4ef' : '#333'};
        }
        .claude-token-manager select,
        .claude-token-manager button {
            background-color: ${isDarkMode ? '#2f2f2c' : '#f5f1e9'};
            color: ${isDarkMode ? '#f5f4ef' : '#333'};
            border-color: ${isDarkMode ? '#3f3f3c' : '#ccc'};
        }
        .claude-token-manager button:hover {
            background-color: ${isDarkMode ? '#3a3935' : '#e5e1d9'};
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

        loadTokens() {
            const savedTokens = JSON.parse(localStorage.getItem(config.storageKey) || '[]');
            return savedTokens.length > 0 ? savedTokens : [config.defaultToken];
        },

        saveTokens() {
            localStorage.setItem(config.storageKey, JSON.stringify(this.tokens));
        },

        createUI() {
            this.tokenSelect = UI.createTokenSelect(this.isDarkMode);
            this.toggleButton = UI.createButton('...', {
                position: 'fixed',
                top: '10px',
                right: '145px',
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
        },

        switchToken() {
            const selectedToken = this.tokens[this.tokenSelect.value];
            this.applyToken(selectedToken.key);
        },

        applyToken(token) {
            const currentURL = window.location.href;

            if (currentURL.startsWith('https://claude.ai/')) {
                document.cookie = `sessionKey=${token}; path=/; domain=.claude.ai`;
                window.location.reload();
            } else {
                let loginUrl;
                if (currentURL.startsWith('https://demo.fuclaude.com/')) {
                    loginUrl = `https://demo.fuclaude.com/login_token?session_key=${token}`;
                } else if (currentURL.startsWith('https://claude.asia/')) {
                    loginUrl = `https://claude.asia/login_token?session_key=${token}`;
                }

                if (loginUrl) {
                    window.location.href = loginUrl;
                }
            }
        },

        showAddTokenModal() {
            const content = document.createElement('div');
            const nameInput = document.createElement('input');
            nameInput.placeholder = 'Token名称';
            const keyInput = document.createElement('input');
            keyInput.placeholder = 'Token密钥';
            const addButton = document.createElement('button');
            addButton.textContent = '添加';
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.className = 'cancel';

            content.appendChild(nameInput);
            content.appendChild(keyInput);
            content.appendChild(addButton);
            content.appendChild(cancelButton);

            const { close } = UI.createModal('添加新Token', content);

            addButton.addEventListener('click', () => {
                if (nameInput.value && keyInput.value) {
                    this.tokens.push({ name: nameInput.value, key: keyInput.value });
                    this.saveTokens();
                    this.updateTokenSelect();
                    close();
                }
            });

            cancelButton.addEventListener('click', close);
        },

        showManageTokensModal() {
            const content = document.createElement('div');
            const tokenList = document.createElement('div');
            tokenList.className = 'claude-token-list';

            this.tokens.forEach((token, index) => {
                const tokenItem = document.createElement('div');
                tokenItem.className = 'claude-token-item';
                tokenItem.textContent = token.name;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
                deleteButton.className = 'cancel';
                deleteButton.addEventListener('click', () => {
                    this.tokens.splice(index, 1);
                    this.saveTokens();
                    this.updateTokenSelect();
                    tokenItem.remove();
                });
                tokenItem.appendChild(deleteButton);
                tokenList.appendChild(tokenItem);
            });

            content.appendChild(tokenList);
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            content.appendChild(closeButton);

            const { close } = UI.createModal('管理Tokens', content);
            closeButton.addEventListener('click', close);
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
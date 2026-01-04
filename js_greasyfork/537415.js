// ==UserScript==
// @name         Duolingo Account Creator
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Create Duolingo accounts 
// @author       You
// @match        https://www.duolingo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @connect      duolingo.com
// @connect      www.duolingo.com
// @connect      https://www.duolingo.com/2017-06-30/user
// @discord      https://discord.gg/kfct8FuHmW
// @connect      api.ipify.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537415/Duolingo%20Account%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/537415/Duolingo%20Account%20Creator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_ACCOUNTS = 5000;

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --bg-color: #2B2D31;
            --panel-color: #3E4043;
            --text-color: #E6E6E6;
            --border-color: #4D4F53;
            --primary-color: #58CC02;
            --primary-hover: #61E002;
            --primary-shadow: #46A302;
            --info-color: #1CB0F6;
            --warning-color: #FFC107;
            --error-color: #FF6B6B;
            --secondary-text: #B5B5B5;
            --button-bg: #3E4043;
            --button-text: #E6E6E6;
            --button-hover-text: #FFFFFF;
            --input-bg: #3E4043;
        }

        :root.light-mode {
            --bg-color: #FFFFFF;
            --panel-color: #F5F5F5;
            --text-color: #333333;
            --border-color: #E0E0E0;
            --primary-color: #58CC02;
            --primary-hover: #61E002;
            --primary-shadow: #46A302;
            --info-color: #1CB0F6;
            --warning-color: #FFC107;
            --error-color: #FF6B6B;
            --secondary-text: #666666;
            --button-bg: #E0E0E0;
            --button-text: #333333;
            --button-hover-text: #FFFFFF;
            --input-bg: #F5F5F5;
        }

        #duolingo-account-creator * {
            box-sizing: border-box;
        }

        .account-row:hover .delete-account-btn {
            display: inline-block;
        }

        .delete-account-btn {
            display: none;
            background-color: var(--error-color) !important;
            color: white !important;
            border: none;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 11px;
            cursor: pointer;
            margin-left: 6px;
        }

        .delete-account-btn:hover {
            background-color: #ff5252 !important;
        }
    `;
    document.head.appendChild(style);

    const state = {
        accounts: [],
        isCreating: false,
        notifications: [],
        activeMenu: null,
        userIP: null,
        settings: JSON.parse(localStorage.getItem('duolingoAccountCreatorSettings')) || {
            saveAccounts: true,
            randomEmail: true,
            randomPassword: true,
            creationSpeed: 'medium',
            theme: 'dark'
        },
        createdCount: 0,
        totalCount: 0
    };

    const elements = {
        mainContainer: null,
        settingsPanel: null,
        logsPanel: null,
        notificationsPanel: null,
        accountProgress: null
    };

    const utils = {
        async getUserIP() {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                return data.ip;
            } catch (error) {
                console.error('Error getting IP:', error);
                return 'unknown';
            }
        },

        applyTheme() {
            if (state.settings.theme === 'light') {
                document.documentElement.classList.add('light-mode');
            } else {
                document.documentElement.classList.remove('light-mode');
            }
            this.updateAllUI();
        },

        updateAllUI() {
            if (elements.mainContainer) {
                elements.mainContainer.style.backgroundColor = 'var(--bg-color)';
                elements.mainContainer.style.borderColor = 'var(--border-color)';
                elements.mainContainer.style.color = 'var(--text-color)';
            }

            document.querySelectorAll('#duolingo-account-creator button, #duolingo-account-creator input, #duolingo-account-creator select').forEach(el => {
                if (el.tagName === 'BUTTON' && !el.id.includes('start-create')) {
                    el.style.color = 'var(--button-text)';
                    el.style.backgroundColor = 'var(--button-bg)';
                }
            });
        },

        closeAllMenus() {
            for (const panel in elements) {
                if (panel !== 'mainContainer' && elements[panel] && panel !== 'accountProgress') {
                    elements[panel].style.display = 'none';
                }
            }
            state.activeMenu = null;
        },

        createIconButton(icon, normalColor, hoverColor, titleText = '') {
            const btn = document.createElement('button');
            btn.innerHTML = icon;
            btn.title = titleText;
            Object.assign(btn.style, {
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: normalColor === 'transparent' ? 'transparent' : 'var(--button-bg)',
                color: 'var(--button-text)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                margin: '0 2px'
            });

            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = hoverColor;
                btn.style.color = 'var(--button-hover-text)';
            });

            btn.addEventListener('mouseout', () => {
                btn.style.backgroundColor = normalColor === 'transparent' ? 'transparent' : 'var(--button-bg)';
                btn.style.color = 'var(--button-text)';
            });

            return btn;
        },

        makeDraggable(element, handle) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            handle.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        },

        generateRandomEmail() {
            const domainSelect = document.getElementById('email-domain');
            const domain = domainSelect.value === 'custom'
                ? document.getElementById('custom-domain').value
                : domainSelect.value;

            const randomString = Math.random().toString(36).substring(2, 10);
            const randomNumber = Math.floor(Math.random() * 1000);
            return `${randomString}${randomNumber}@${domain}`;
        },

        generateRandomPassword() {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
            let password = '';
            for (let i = 0; i < 12; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return password;
        },

        generateRandomUsername() {
            const randomString = Math.random().toString(36).substring(2, 10);
            const randomNumber = Math.floor(Math.random() * 1000);
            return `user_${randomString}${randomNumber}`;
        },

        saveSettings() {
            localStorage.setItem('duolingoAccountCreatorSettings', JSON.stringify(state.settings));
            this.applyTheme();
        },

        addNotification(message, type = 'info') {
            const notification = {
                id: Date.now(),
                message,
                type,
                timestamp: new Date().toLocaleTimeString()
            };
            state.notifications.unshift(notification);
            if (elements.notificationsPanel) {
                ui.updateNotificationsPanel();
            }
        },

        saveAccountsToStorage() {
            if (state.settings.saveAccounts) {
                const accountsToSave = state.accounts.map(account => ({
                    ...account,
                    ip: state.userIP,
                    createdAt: new Date().toISOString()
                }));
                localStorage.setItem('duolingoAccounts', JSON.stringify(accountsToSave));
            }
        },

        loadAccountsFromStorage() {
            const savedAccounts = localStorage.getItem('duolingoAccounts');
            if (savedAccounts) {
                const accounts = JSON.parse(savedAccounts);
                state.accounts = accounts.filter(acc => acc.ip === state.userIP);
            }
        },

        deleteAllAccounts() {
            state.accounts = [];
            localStorage.removeItem('duolingoAccounts');
            ui.updateLogsTable();
            utils.addNotification('All accounts deleted', 'success');
        },

        deleteAccount(index) {
            if (index >= 0 && index < state.accounts.length) {
                state.accounts.splice(index, 1);
                utils.saveAccountsToStorage();
                ui.updateLogsTable();
                utils.addNotification('Account deleted', 'success');
            }
        },

        updateProgressCounter() {
            if (elements.accountProgress) {
                elements.accountProgress.textContent = ` (${state.createdCount}/${state.totalCount})`;
            }
        }
    };

    const api = {
        checkUsernameAvailability(username, retries = 3) {
            return new Promise((resolve, reject) => {
                const url = `https://www.duolingo.com/2017-06-30/user?username=${encodeURIComponent(username)}`;

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'Accept': 'application/json' },
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data.available === true);
                            } catch (error) {
                                if (retries > 0) {
                                    setTimeout(() => {
                                        api.checkUsernameAvailability(username, retries - 1).then(resolve).catch(reject);
                                    }, 1000);
                                } else {
                                    reject(new Error(`Invalid response format: ${error.message}`));
                                }
                            }
                        } else if (response.status === 429 && retries > 0) {
                            setTimeout(() => {
                                api.checkUsernameAvailability(username, retries - 1).then(resolve).catch(reject);
                            }, 2000);
                        } else {
                            reject(new Error(`API Error: ${response.status} - ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        if (retries > 0) {
                            setTimeout(() => {
                                api.checkUsernameAvailability(username, retries - 1).then(resolve).catch(reject);
                            }, 2000);
                        } else {
                            reject(new Error(`Network error: ${error.message || 'Unknown error'}`));
                        }
                    }
                });
            });
        },

        createAccount(email, username, password, retries = 3) {
            return new Promise((resolve, reject) => {
                const url = 'https://www.duolingo.com/2017-06-30/user';
                const payload = {
                    email: email,
                    username: username,
                    password: password,
                    fromLanguage: 'en',
                    learningLanguage: 'es'
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: JSON.stringify(payload),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.responseText);
                        } else if (response.status === 429 && retries > 0) {
                            setTimeout(() => {
                                api.createAccount(email, username, password, retries - 1).then(resolve).catch(reject);
                            }, 2000);
                        } else {
                            reject(new Error(`API Error: ${response.status} - ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        if (retries > 0) {
                            setTimeout(() => {
                                api.createAccount(email, username, password, retries - 1).then(resolve).catch(reject);
                            }, 2000);
                        } else {
                            reject(new Error(`Network error: ${error.message || 'Unknown error'}`));
                        }
                    }
                });
            });
        }
    };

    const ui = {
        createMainContainer() {
            const container = document.createElement('div');
            container.id = 'duolingo-account-creator';
            Object.assign(container.style, {
                position: 'fixed',
                top: '100px',
                left: '20px',
                zIndex: '9999',
                backgroundColor: 'var(--bg-color)',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
                width: '280px',
                cursor: 'move',
                userSelect: 'none',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)'
            });

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '12px';

            const title = document.createElement('h3');
            title.textContent = 'Account Creator';
            Object.assign(title.style, {
                margin: '0',
                color: 'var(--primary-color)',
                fontSize: '15px',
                fontWeight: '600'
            });

            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '4px';

            const settingsBtn = utils.createIconButton('⚙', 'transparent', 'var(--primary-color)', 'Settings');
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSettings();
            });

            const logsBtn = utils.createIconButton('📋', 'transparent', 'var(--info-color)', 'Show Logs');
            logsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showLogs();
            });

            const notifyBtn = utils.createIconButton('🔔', 'transparent', 'var(--warning-color)', 'Notifications');
            notifyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showNotifications();
            });

            const closeBtn = utils.createIconButton('×', 'transparent', 'var(--error-color)', 'Close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                container.style.display = 'none';
                utils.closeAllMenus();
            });

            buttonGroup.appendChild(settingsBtn);
            buttonGroup.appendChild(logsBtn);
            buttonGroup.appendChild(notifyBtn);
            buttonGroup.appendChild(closeBtn);
            header.appendChild(title);
            header.appendChild(buttonGroup);

            const content = document.createElement('div');
            content.innerHTML = `
                <div style="margin-bottom: 12px;">
                    <label for="account-count" style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: var(--secondary-text);">
                        Number of accounts
                        <span id="account-progress" style="color: var(--primary-color); font-size: 12px;"> (0/0)</span>
                    </label>
                    <input type="number" id="account-count" min="1" max="${MAX_ACCOUNTS}" value="1" style="width: 100%; padding: 8px 10px; box-sizing: border-box; background-color: var(--input-bg); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px; outline: none; transition: all 0.2s;" onkeypress="return (event.charCode !=8 && event.charCode == 0 || (event.charCode >= 48 && event.charCode <= 57))" oninput="if(this.value > ${MAX_ACCOUNTS}) {this.value = ${MAX_ACCOUNTS};}">
                </div>
                <div style="margin-bottom: 12px;">
                    <label for="email-domain" style="display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: var(--secondary-text);">Email Domain</label>
                    <select id="email-domain" style="width: 100%; padding: 8px 10px; box-sizing: border-box; background-color: var(--input-bg); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px; outline: none;">
                        <option value="gmail.com">gmail.com</option>
                        <option value="yahoo.com">yahoo.com</option>
                        <option value="outlook.com">outlook.com</option>
                        <option value="protonmail.com">protonmail.com</option>
                        <option value="custom">Custom Domain</option>
                    </select>
                    <input type="text" id="custom-domain" placeholder="Enter custom domain" style="width: 100%; padding: 8px 10px; margin-top: 6px; box-sizing: border-box; background-color: var(--input-bg); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px; outline: none; display: none;">
                </div>
            `;

            const createBtn = document.createElement('button');
            createBtn.id = 'start-create';
            createBtn.textContent = 'Start Creating';
            Object.assign(createBtn.style, {
                width: '100%',
                padding: '10px 0',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 3px 0 0 var(--primary-shadow)',
                position: 'relative',
                overflow: 'hidden'
            });

            createBtn.addEventListener('mouseover', () => {
                createBtn.style.backgroundColor = 'var(--primary-hover)';
                createBtn.style.boxShadow = '0 3px 0 0 var(--primary-shadow)';
            });

            createBtn.addEventListener('mouseout', () => {
                createBtn.style.backgroundColor = 'var(--primary-color)';
                createBtn.style.boxShadow = '0 3px 0 0 var(--primary-shadow)';
            });

            createBtn.addEventListener('mousedown', () => {
                createBtn.style.transform = 'translateY(2px)';
                createBtn.style.boxShadow = '0 1px 0 0 var(--primary-shadow)';
            });

            createBtn.addEventListener('mouseup', () => {
                createBtn.style.transform = 'translateY(0)';
                createBtn.style.boxShadow = '0 3px 0 0 var(--primary-shadow)';
            });

            createBtn.addEventListener('click', accountManager.startCreatingAccounts);

            content.appendChild(createBtn);
            container.appendChild(header);
            container.appendChild(content);
            document.body.appendChild(container);

            document.getElementById('email-domain').addEventListener('change', function() {
                const customDomainInput = document.getElementById('custom-domain');
                customDomainInput.style.display = this.value === 'custom' ? 'block' : 'none';
            });

            utils.makeDraggable(container, header);
            elements.mainContainer = container;
            elements.accountProgress = document.getElementById('account-progress');
        },

        showSettings() {
            if (state.activeMenu === 'settings') {
                utils.closeAllMenus();
                return;
            }
            utils.closeAllMenus();
            state.activeMenu = 'settings';

            if (elements.settingsPanel) {
                elements.settingsPanel.style.display = 'block';
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'settings-panel';
            Object.assign(panel.style, {
                position: 'fixed',
                right: '20px',
                top: '100px',
                backgroundColor: 'var(--panel-color)',
                borderRadius: '12px',
                padding: '12px',
                width: '220px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: '10000',
                border: '1px solid var(--border-color)',
                display: 'block'
            });

            const panelHeader = document.createElement('div');
            panelHeader.style.display = 'flex';
            panelHeader.style.justifyContent = 'space-between';
            panelHeader.style.alignItems = 'center';
            panelHeader.style.marginBottom = '10px';

            const panelTitle = document.createElement('div');
            panelTitle.textContent = 'Settings';
            panelTitle.style.fontWeight = '600';
            panelTitle.style.color = 'var(--primary-color)';

            const closeBtn = utils.createIconButton('×', 'transparent', 'var(--error-color)', 'Close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.style.display = 'none';
                state.activeMenu = null;
            });

            panelHeader.appendChild(panelTitle);
            panelHeader.appendChild(closeBtn);
            panel.appendChild(panelHeader);

            panel.innerHTML += `
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; font-weight: 500; margin-bottom: 6px; color: var(--secondary-text);">Account Options</div>
                    <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 4px; cursor: pointer; color: var(--text-color);">
                        <input type="checkbox" id="save-accounts" ${state.settings.saveAccounts ? 'checked' : ''}> Save accounts
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 4px; cursor: pointer; color: var(--text-color);">
                        <input type="checkbox" id="random-email" ${state.settings.randomEmail ? 'checked' : ''}> Random emails
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px; font-size: 12px; margin-bottom: 4px; cursor: pointer; color: var(--text-color);">
                        <input type="checkbox" id="random-password" ${state.settings.randomPassword ? 'checked' : ''}> Random passwords
                    </label>
                </div>
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; font-weight: 5
                    00; margin-bottom: 6px; color: var(--secondary-text);">Creation Speed</div>
                    <select id="creation-speed" style="width: 100%; padding: 6px; border-radius: 6px; background-color: var(--input-bg); color: var(--text-color); border: 1px solid var(--border-color); font-size: 12px;">
                        <option value="fast" ${state.settings.creationSpeed === 'fast' ? 'selected' : ''}>Fast (1s)</option>
                        <option value="medium" ${state.settings.creationSpeed === 'medium' ? 'selected' : ''}>Medium (3s)</option>
                        <option value="slow" ${state.settings.creationSpeed === 'slow' ? 'selected' : ''}>Slow (5s)</option>
                    </select>
                </div>
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 12px; font-weight: 500; margin-bottom: 6px; color: var(--secondary-text);">Theme</div>
                    <select id="theme-selector" style="width: 100%; padding: 6px; border-radius: 6px; background-color: var(--input-bg); color: var(--text-color); border: 1px solid var(--border-color); font-size: 12px;">
                        <option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>Dark Mode</option>
                        <option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>Light Mode</option>
                    </select>
                </div>
                <button id="save-settings" style="width: 100%; padding: 8px; background-color: var(--primary-color); color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; margin-top: 6px;">Save Settings</button>
            `;

            document.body.appendChild(panel);
            elements.settingsPanel = panel;

            document.getElementById('save-settings').addEventListener('click', () => {
                state.settings = {
                    saveAccounts: document.getElementById('save-accounts').checked,
                    randomEmail: document.getElementById('random-email').checked,
                    randomPassword: document.getElementById('random-password').checked,
                    creationSpeed: document.getElementById('creation-speed').value,
                    theme: document.getElementById('theme-selector').value
                };

                utils.saveSettings();
                utils.addNotification('Settings saved successfully', 'success');
                panel.style.display = 'none';
                state.activeMenu = null;
            });
        },

        showLogs() {
            if (state.activeMenu === 'logs') {
                utils.closeAllMenus();
                return;
            }
            utils.closeAllMenus();
            state.activeMenu = 'logs';

            if (elements.logsPanel) {
                elements.logsPanel.style.display = 'block';
                this.updateLogsTable();
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'logs-panel';
            Object.assign(panel.style, {
                position: 'fixed',
                right: '20px',
                top: '100px',
                backgroundColor: 'var(--bg-color)',
                borderRadius: '12px',
                padding: '12px',
                width: '500px',
                maxHeight: '500px',
                overflowY: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: '10000',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)',
                display: 'block'
            });

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '12px';

            const title = document.createElement('h3');
            title.textContent = 'Created Accounts';
            Object.assign(title.style, {
                margin: '0',
                color: 'var(--info-color)',
                fontSize: '15px',
                fontWeight: '600'
            });

            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '4px';

            const deleteAllBtn = utils.createIconButton('🗑️', 'transparent', 'var(--error-color)', 'Delete All');
            deleteAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete ALL accounts?')) {
                    utils.deleteAllAccounts();
                }
            });

            const closeBtn = utils.createIconButton('×', 'transparent', 'var(--error-color)', 'Close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.style.display = 'none';
                state.activeMenu = null;
            });

            buttonGroup.appendChild(deleteAllBtn);
            buttonGroup.appendChild(closeBtn);

            header.appendChild(title);
            header.appendChild(buttonGroup);
            panel.appendChild(header);

            const tableContainer = document.createElement('div');
            tableContainer.style.overflowX = 'auto';

            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginTop = '8px';
            table.style.fontSize = '12px';

            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr style="background-color: var(--panel-color); color: var(--secondary-text);">
                    <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color);">#</th>
                    <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Email</th>
                    <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Username</th>
                    <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Password</th>
                    <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Status</th>
                    <th style="padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border-color);">Actions</th>
                </tr>
            `;
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            tbody.id = 'logs-table-body';
            table.appendChild(tbody);

            tableContainer.appendChild(table);
            panel.appendChild(tableContainer);

            const exportBtn = document.createElement('button');
            exportBtn.textContent = 'Export to CSV';
            Object.assign(exportBtn.style, {
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                width: '100%'
            });
            exportBtn.addEventListener('click', this.exportToCSV);

            panel.appendChild(exportBtn);
            document.body.appendChild(panel);
            elements.logsPanel = panel;

            this.updateLogsTable();
        },

        showNotifications() {
            if (state.activeMenu === 'notifications') {
                utils.closeAllMenus();
                return;
            }
            utils.closeAllMenus();
            state.activeMenu = 'notifications';

            if (elements.notificationsPanel) {
                elements.notificationsPanel.style.display = 'block';
                this.updateNotificationsPanel();
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'notifications-panel';
            Object.assign(panel.style, {
                position: 'fixed',
                right: '20px',
                top: '100px',
                backgroundColor: 'var(--bg-color)',
                borderRadius: '12px',
                padding: '12px',
                width: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: '10000',
                border: '1px solid var(--border-color)',
                color: 'var(--text-color)',
                display: 'block'
            });

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '12px';

            const title = document.createElement('h3');
            title.textContent = 'Notifications';
            Object.assign(title.style, {
                margin: '0',
                color: 'var(--warning-color)',
                fontSize: '15px',
                fontWeight: '600'
            });

            const closeBtn = utils.createIconButton('×', 'transparent', 'var(--error-color)', 'Close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.style.display = 'none';
                state.activeMenu = null;
            });

            const clearBtn = utils.createIconButton('🗑️', 'transparent', 'var(--error-color)', 'Clear All');
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                state.notifications = [];
                this.updateNotificationsPanel();
            });

            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.appendChild(clearBtn);
            btnGroup.appendChild(closeBtn);

            header.appendChild(title);
            header.appendChild(btnGroup);
            panel.appendChild(header);

            const notificationsContainer = document.createElement('div');
            notificationsContainer.id = 'notifications-container';
            panel.appendChild(notificationsContainer);

            document.body.appendChild(panel);
            elements.notificationsPanel = panel;

            this.updateNotificationsPanel();
        },

        updateNotificationsPanel() {
            const container = document.getElementById('notifications-container');
            if (!container) return;

            container.innerHTML = '';

            if (state.notifications.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.textContent = 'No notifications yet';
                emptyMsg.style.color = 'var(--secondary-text)';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.padding = '12px';
                container.appendChild(emptyMsg);
                return;
            }

            state.notifications.forEach(notification => {
                const notifElement = document.createElement('div');
                notifElement.style.padding = '8px';
                notifElement.style.marginBottom = '6px';
                notifElement.style.borderRadius = '6px';
                notifElement.style.backgroundColor = 'var(--panel-color)';
                notifElement.style.borderLeft = `3px solid ${
                    notification.type === 'success' ? 'var(--primary-color)' :
                    notification.type === 'error' ? 'var(--error-color)' : 'var(--info-color)'
                }`;

                const timeElement = document.createElement('div');
                timeElement.textContent = notification.timestamp;
                timeElement.style.fontSize = '10px';
                timeElement.style.color = 'var(--secondary-text)';
                timeElement.style.marginBottom = '4px';

                const messageElement = document.createElement('div');
                messageElement.textContent = notification.message;
                messageElement.style.fontSize = '12px';

                notifElement.appendChild(timeElement);
                notifElement.appendChild(messageElement);
                container.appendChild(notifElement);
            });
        },

        updateLogsTable() {
            const tbody = document.getElementById('logs-table-body');
            if (!tbody) return;

            tbody.innerHTML = '';

            if (state.accounts.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="6" style="padding: 12px; text-align: center; color: var(--secondary-text);">No accounts created yet</td>
                `;
                tbody.appendChild(row);
                return;
            }

            state.accounts.forEach((account, index) => {
                const row = document.createElement('tr');
                row.className = 'account-row';
                Object.assign(row.style, {
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: index % 2 === 0 ? 'var(--bg-color)' : 'var(--panel-color)'
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-account-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    utils.deleteAccount(index);
                });

                const actionCell = document.createElement('td');
                actionCell.style.padding = '6px 8px';
                actionCell.appendChild(deleteBtn);

                row.innerHTML = `
                    <td style="padding: 6px 8px;">${index + 1}</td>
                    <td style="padding: 6px 8px;">${account.email || ''}</td>
                    <td style="padding: 6px 8px;">${account.username || ''}</td>
                    <td style="padding: 6px 8px;">${account.password || ''}</td>
                    <td style="padding: 6px 8px; color: ${account.status === 'Success' ? 'var(--primary-color)' : 'var(--error-color)'}">${account.status || ''}</td>
                `;
                row.appendChild(actionCell);
                tbody.appendChild(row);
            });
        },

        exportToCSV() {
            if (state.accounts.length === 0) {
                utils.addNotification('No accounts to export', 'error');
                return;
            }

            let csvContent = "STT,Email,Username,Password,Status\n";
            state.accounts.forEach((account, index) => {
                csvContent += `${index + 1},${account.email || ''},${account.username || ''},${account.password || ''},${account.status || ''}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `duolingo_accounts_${new Date().toISOString().slice(0,10)}.csv`);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            utils.addNotification('Accounts exported to CSV', 'success');
        },

        addToggleButton() {
            const toggleBtn = document.createElement('div');
            toggleBtn.textContent = 'AC';
            Object.assign(toggleBtn.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: '9998',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                fontWeight: 'bold',
                fontSize: '13px',
                transition: 'all 0.2s'
            });

            toggleBtn.addEventListener('mouseover', () => {
                toggleBtn.style.transform = 'scale(1.1)';
                toggleBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            });

            toggleBtn.addEventListener('mouseout', () => {
                toggleBtn.style.transform = 'scale(1)';
                toggleBtn.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2)';
            });

            toggleBtn.addEventListener('click', () => {
                if (elements.mainContainer) {
                    elements.mainContainer.style.display = elements.mainContainer.style.display === 'none' ? 'block' : 'none';
                    if (elements.mainContainer.style.display === 'none') {
                        utils.closeAllMenus();
                    }
                }
            });

            document.body.appendChild(toggleBtn);
        }
    };

    const accountManager = {
        async startCreatingAccounts() {
            const count = parseInt(document.getElementById('account-count').value);
            const button = document.getElementById('start-create');

            if (isNaN(count) || count <= 0) {
                utils.addNotification('Invalid account count', 'error');
                return;
            }

            if (count > MAX_ACCOUNTS) {
                utils.addNotification(`Cannot create more than ${MAX_ACCOUNTS} accounts`, 'error');
                return;
            }

            state.isCreating = true;
            state.createdCount = 0;
            state.totalCount = count;
            utils.updateProgressCounter();
            button.disabled = true;
            button.style.backgroundColor = 'var(--button-bg)';
            button.style.boxShadow = '0 3px 0 0 var(--border-color)';
            button.textContent = 'Creating...';

            utils.addNotification(`Starting creation of ${count} accounts`, 'info');
            state.accounts = [];

            let created = 0;
            let successCount = 0;
            let errorCount = 0;

            const delay = {
                fast: 1000,
                medium: 3000,
                slow: 5000
            }[state.settings.creationSpeed] || 3000;

            while (created < count && state.isCreating) {
                try {
                    const email = state.settings.randomEmail ? utils.generateRandomEmail() : '';
                    let username = utils.generateRandomUsername();
                    const password = state.settings.randomPassword ? utils.generateRandomPassword() : 'defaultPassword123!';

                    let isAvailable = false;
                    let attempts = 0;
                    const maxAttempts = 5;

                    while (!isAvailable && attempts < maxAttempts && state.isCreating) {
                        try {
                            isAvailable = await api.checkUsernameAvailability(username);
                            if (!isAvailable) {
                                attempts++;
                                username = utils.generateRandomUsername();
                                await new Promise(resolve => setTimeout(resolve, 500));
                            }
                        } catch (error) {
                            console.error('Error checking username:', error);
                            attempts++;
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }
                    }

                    if (!isAvailable) {
                        state.accounts.push({
                            email,
                            username,
                            password,
                            status: 'Failed: No available username',
                            ip: state.userIP,
                            createdAt: new Date().toISOString()
                        });
                        utils.saveAccountsToStorage();
                        utils.addNotification('Failed to create account: No available username', 'error');
                        errorCount++;
                        created++;
                        state.createdCount++;
                        utils.updateProgressCounter();
                        ui.updateLogsTable();
                        continue;
                    }

                    state.accounts.push({
                        email,
                        username,
                        password,
                        status: 'Creating...',
                        ip: state.userIP,
                        createdAt: new Date().toISOString()
                    });
                    utils.saveAccountsToStorage();
                    ui.updateLogsTable();

                    await api.createAccount(email, username, password)
                        .then(() => {
                            state.accounts[created].status = 'Success';
                            utils.saveAccountsToStorage();
                            utils.addNotification(`Account created: ${username}`, 'success');
                            successCount++;
                        })
                        .catch(error => {
                            state.accounts[created].status = 'Failed: ' + error.message;
                            utils.saveAccountsToStorage();
                            utils.addNotification(`Failed to create account: ${error.message}`, 'error');
                            errorCount++;
                        });

                    created++;
                    state.createdCount++;
                    utils.updateProgressCounter();
                    ui.updateLogsTable();

                    if (created < count) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                } catch (error) {
                    console.error('Error in account creation loop:', error);
                    created++;
                    state.createdCount++;
                    utils.updateProgressCounter();
                    errorCount++;
                    utils.addNotification(`Error during account creation: ${error.message}`, 'error');
                }
            }

            button.disabled = false;
            button.style.backgroundColor = 'var(--primary-color)';
            button.style.boxShadow = '0 3px 0 0 var(--primary-shadow)';
            button.textContent = 'Start Creating';
            state.isCreating = false;

            utils.addNotification(`Finished creating ${count} accounts (${successCount} success)`, successCount > 0 ? 'success' : 'error');
        }
    };

    async function init() {
        state.userIP = await utils.getUserIP();
        utils.loadAccountsFromStorage();
        ui.createMainContainer();
        ui.addToggleButton();
        utils.applyTheme();
        utils.addNotification('Account Creator initialized', 'info');
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
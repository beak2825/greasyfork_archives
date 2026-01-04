// ==UserScript==
// @name         Duolingo Auto-Super-Generate
// @namespace    http://tampermonkey.net/
// @version      https://discord.gg/ufBrcGemBH
// @description  AutoSuper Old Version
// @author       DUOS
// @match        *://*.duolingo.com/*
// @license      MIT
// @icon         https://d35aaqx5ub95lt.cloudfront.net/vendor/a0ee30fa22ca3d00e9e5db913b1965b5.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544400/Duolingo%20Auto-Super-Generate.user.js
// @updateURL https://update.greasyfork.org/scripts/544400/Duolingo%20Auto-Super-Generate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        defaultPassword: 'DuolingoAuto2025',
        emailDomains: ['@tempmail.org', '@10minutemail.com', '@guerrillamail.com'],
        exportShortcut: 'Alt+E',
        exportMultipleShortcut: 'Alt+M',
        discordLink: 'https://discord.gg/ufBrcGemBH',
        storageKeys: {
            accounts: 'duolingoAccountsList',
            currentIndex: 'duolingoCurrentAccountIndex',
            registeredAccounts: 'duolingoRegisteredAccounts',
            selectedCourse: 'selectedCourse',
            windowPosition: 'duoWindowPos',
            windowMinimized: 'duoWindowMin'
        }
    };

    const util = {
        generateRandomEmail: () => {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            const domains = CONFIG.emailDomains;
            const randomString = Array(8).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
            const randomDomain = domains[Math.floor(Math.random() * domains.length)];
            return randomString + randomDomain;
        },

        getJwtToken: () => {
            const match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'));
            return match ? match[0].slice(11) : null;
        },

        downloadAsFile: (content, filename) => {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        },

        createElement: (tag, attributes = {}, styles = {}, eventListeners = {}) => {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => element[key] = value);
            Object.entries(styles).forEach(([key, value]) => element.style[key] = value);
            Object.entries(eventListeners).forEach(([event, handler]) => element.addEventListener(event, handler));
            return element;
        },

        setValue: (selector, value) => {
            const element = document.querySelector(selector);
            if (!element) return false;

            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

            if (valueSetter && prototypeValueSetter) {
                (valueSetter !== prototypeValueSetter ? prototypeValueSetter : valueSetter).call(element, value);
            } else {
                element.value = value;
            }

            ['input', 'change', 'blur'].forEach(eventType =>
                element.dispatchEvent(new Event(eventType, { bubbles: true }))
            );

            const keyupEvent = new Event('keyup', { bubbles: true });
            Object.defineProperty(keyupEvent, 'keyCode', { get: () => 13 });
            element.dispatchEvent(keyupEvent);

            return true;
        },

        clickElement: selector => {
            const element = document.querySelector(selector);
            if (element) element.click();
            return !!element;
        },

        storeAccount: (email, password, token) => {
            const accounts = JSON.parse(localStorage.getItem(CONFIG.storageKeys.registeredAccounts) || '[]');
            const newAccount = {
                id: (accounts.length + 1).toString(),
                username: email,
                password: password,
                token: token,
                createdAt: new Date().toISOString()
            };
            accounts.push(newAccount);
            localStorage.setItem(CONFIG.storageKeys.registeredAccounts, JSON.stringify(accounts));
            return newAccount;
        },

        delay: ms => new Promise(resolve => setTimeout(resolve, ms)),

        formatDate: (date) => {
            if (!date) return '';
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-US', options);
        },

        saveWindowState: (x, y, minimized) => {
            localStorage.setItem(CONFIG.storageKeys.windowPosition, JSON.stringify({x, y}));
            localStorage.setItem(CONFIG.storageKeys.windowMinimized, minimized);
        },

        loadWindowState: () => {
            const pos = JSON.parse(localStorage.getItem(CONFIG.storageKeys.windowPosition) || '{"x":20,"y":20}');
            const minimized = localStorage.getItem(CONFIG.storageKeys.windowMinimized) === 'true';
            return {pos, minimized};
        },

        updateAccountCount: () => {
            const accountCountElement = document.querySelector('#accountCount');
            if (accountCountElement) {
                const registeredAccounts = JSON.parse(localStorage.getItem(CONFIG.storageKeys.registeredAccounts) || '[]');
                accountCountElement.textContent = `${registeredAccounts.length} accounts`;
            }
        }
    };

    const ui = {
        isDragging: false,
        dragOffset: {x: 0, y: 0},

        createWindow: () => {
            const {pos, minimized} = util.loadWindowState();

            const discordCheck = () => {
                if (!CONFIG.discordLink) throw new Error('Discord integration required');
                return true;
            };
            discordCheck();

            const windowContainer = util.createElement('div', {id: 'duoAutoWindow'}, {
                position: 'fixed',
                left: pos.x + 'px',
                top: pos.y + 'px',
                width: '380px',
                minHeight: minimized ? '40px' : '480px',
                backgroundColor: '#202020',
                border: '1px solid #404040',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                zIndex: '999999',
                fontFamily: 'Segoe UI, system-ui, sans-serif',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            });

            const titleBar = util.createElement('div', {}, {
                height: '40px',
                backgroundColor: '#2d2d2d',
                borderBottom: '1px solid #404040',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                cursor: 'move',
                userSelect: 'none'
            });

            const titleText = util.createElement('div', {
                innerHTML: '<span style="color: #00d4ff; font-weight: 600;">Duolingo</span> <span style="color: #ffffff;">Auto Tools</span>'
            }, {
                fontSize: '14px',
                fontWeight: '500'
            });

            const windowControls = util.createElement('div', {}, {
                display: 'flex',
                gap: '12px'
            });

            const minimizeBtn = util.createElement('div', {innerHTML: '⎯'}, {
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: '#404040',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#ffffff',
                transition: 'all 0.15s ease'
            });

            const closeBtn = util.createElement('div', {innerHTML: '✕'}, {
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: '#e74c3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '10px',
                color: '#ffffff',
                transition: 'all 0.15s ease'
            });

            const content = util.createElement('div', {id: 'windowContent'}, {
                padding: '20px',
                height: 'calc(100% - 40px)',
                display: minimized ? 'none' : 'block'
            });

            const discordBanner = util.createElement('div', {
                innerHTML: `<div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #5865f2, #7289da); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">D</div>
                    <div>
                        <div style="color: #ffffff; font-weight: 600; font-size: 14px;">Join Discord Server</div>
                        <div style="color: #b0b0b0; font-size: 12px;">Get support & updates</div>
                    </div>
                </div>`
            }, {
                background: 'linear-gradient(135deg, #5865f2 0%, #7289da 100%)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255,255,255,0.1)'
            }, {
                click: () => window.open(CONFIG.discordLink, '_blank'),
                mouseenter: e => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(88, 101, 242, 0.3)';
                },
                mouseleave: e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                }
            });

            const buttonGrid = util.createElement('div', {}, {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '16px'
            });

            const buttons = [
                {text: 'Register', handler: actions.startAutoRegister, color: '#00d4ff'},
                {text: 'Logout', handler: actions.logOut, color: '#ff6b6b'},
                {text: 'Auto Login', handler: actions.handleLoginAuto, color: '#51cf66'},
                {text: 'Get Plus', handler: actions.startPlusOfferProcess, color: '#ffd43b'},
                {text: 'Get Link', handler: actions.getLink, color: '#9c88ff'},
                {text: 'Auto Kick', handler: actions.autoKick, color: '#ff8787'}
            ];

            buttons.forEach(btn => {
                const button = ui.createButton(btn.text, btn.handler, btn.color);
                buttonGrid.appendChild(button);
            });

            const fullWidthButtons = [
                {text: 'Complete Course Setup', handler: actions.startAdditionalSteps, color: '#20c997'},
                {text: 'Export Accounts', handler: () => actions.exportAccounts(), color: '#6c5ce7'}
            ];

            content.appendChild(discordBanner);
            content.appendChild(buttonGrid);

            fullWidthButtons.forEach(btn => {
                const button = ui.createButton(btn.text, btn.handler, btn.color);
                button.style.width = '100%';
                button.style.marginBottom = '12px';
                content.appendChild(button);
            });

            // Tạo statusBar với account count
            const registeredAccounts = JSON.parse(localStorage.getItem(CONFIG.storageKeys.registeredAccounts) || '[]');
            const statusBar = util.createElement('div', {
                innerHTML: `<div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #b0b0b0; font-size: 11px;">Alt+E: Export current | Alt+M: Export all</span>
                    <span id="accountCount" style="color: #00d4ff; font-size: 11px; font-weight: 600;">${registeredAccounts.length} accounts</span>
                </div>`
            }, {
                padding: '12px 16px',
                backgroundColor: '#1a1a1a',
                borderTop: '1px solid #404040',
                fontSize: '11px'
            });

            titleBar.appendChild(titleText);
            windowControls.appendChild(minimizeBtn);
            windowControls.appendChild(closeBtn);
            titleBar.appendChild(windowControls);

            windowContainer.appendChild(titleBar);
            windowContainer.appendChild(content);
            content.appendChild(statusBar);

            minimizeBtn.addEventListener('click', () => {
                const isMinimized = content.style.display === 'none';
                content.style.display = isMinimized ? 'block' : 'none';
                windowContainer.style.minHeight = isMinimized ? '480px' : '40px';
                util.saveWindowState(
                    parseInt(windowContainer.style.left),
                    parseInt(windowContainer.style.top),
                    !isMinimized
                );
            });

            minimizeBtn.addEventListener('mouseenter', e => {
                e.target.style.backgroundColor = '#595959';
            });
            minimizeBtn.addEventListener('mouseleave', e => {
                e.target.style.backgroundColor = '#404040';
            });

            closeBtn.addEventListener('click', () => {
                windowContainer.remove();
            });

            closeBtn.addEventListener('mouseenter', e => {
                e.target.style.backgroundColor = '#c0392b';
            });
            closeBtn.addEventListener('mouseleave', e => {
                e.target.style.backgroundColor = '#e74c3c';
            });

            titleBar.addEventListener('mousedown', e => {
                ui.isDragging = true;
                ui.dragOffset.x = e.clientX - windowContainer.offsetLeft;
                ui.dragOffset.y = e.clientY - windowContainer.offsetTop;
                document.addEventListener('mousemove', ui.handleDrag);
                document.addEventListener('mouseup', ui.stopDrag);
            });

            return windowContainer;
        },

        createButton: (text, handler, color = '#00d4ff') => {
            return util.createElement('button', {innerHTML: text}, {
                backgroundColor: color,
                color: '#ffffff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.15s ease',
                fontFamily: 'Segoe UI, system-ui, sans-serif'
            }, {
                click: handler,
                mouseenter: e => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.filter = 'brightness(1.1)';
                },
                mouseleave: e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.filter = 'brightness(1)';
                }
            });
        },

        handleDrag: (e) => {
            if (!ui.isDragging) return;
            const windowContainer = document.getElementById('duoAutoWindow');
            const newX = Math.max(0, Math.min(window.innerWidth - windowContainer.offsetWidth, e.clientX - ui.dragOffset.x));
            const newY = Math.max(0, Math.min(window.innerHeight - windowContainer.offsetHeight, e.clientY - ui.dragOffset.y));
            windowContainer.style.left = newX + 'px';
            windowContainer.style.top = newY + 'px';
        },

        stopDrag: () => {
            if (ui.isDragging) {
                ui.isDragging = false;
                const windowContainer = document.getElementById('duoAutoWindow');
                util.saveWindowState(
                    parseInt(windowContainer.style.left),
                    parseInt(windowContainer.style.top),
                    document.getElementById('windowContent').style.display === 'none'
                );
                document.removeEventListener('mousemove', ui.handleDrag);
                document.removeEventListener('mouseup', ui.stopDrag);
            }
        },

        createNotification: () => {
            const notification = util.createElement('div', {
                innerHTML: 'Kurumi ơi né ra giùm em nha'
            }, {
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#2d2d2d',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                zIndex: '1000000',
                border: '1px solid #404040',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                fontFamily: 'Segoe UI, system-ui, sans-serif',
                animation: 'slideDown 0.3s ease-out'
            });

            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideUp 0.3s ease-in forwards';
                style.textContent += `
                    @keyframes slideUp {
                        from { transform: translateX(-50%) translateY(0); opacity: 1; }
                        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                    }
                `;
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    const actions = {
        startAutoRegister: async () => {
            const haveAccountButton = document.querySelector('button[data-test="have-account"]');
            if (haveAccountButton) {
                haveAccountButton.click();
                await util.delay(500);
            }

            util.clickElement('button[data-test="sign-up-button"]');
            await util.delay(800);

            const email = util.generateRandomEmail();
            const password = CONFIG.defaultPassword;

            util.setValue('input[data-test="age-input"]', '25');
            await util.delay(300);
            util.clickElement('button[data-test="continue-button"]');
            await util.delay(800);

            util.setValue('input[data-test="full-name-input"]', 'Auto User');
            util.setValue('input[data-test="email-input"]', email);
            util.setValue('input[data-test="password-input"]', password);
            await util.delay(500);
            util.clickElement('button[data-test="register-button"]');

            localStorage.setItem('user_email', email);
            localStorage.setItem('user_password', password);

            setTimeout(() => {
                const token = util.getJwtToken();
                if (token) {
                    util.storeAccount(email, password, token);
                    util.updateAccountCount(); // Sử dụng hàm helper mới
                    console.log('Account registered:', email);
                }
            }, 2000);
        },

        logOut: async () => {
            console.log('Logging out...');
            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'}
                });

                if (response.ok) {
                    console.log('Logout successful');
                    const accountsListStr = localStorage.getItem(CONFIG.storageKeys.accounts);
                    if (accountsListStr) {
                        const accountsFromStorage = JSON.parse(accountsListStr);
                        let currentIndex = parseInt(localStorage.getItem(CONFIG.storageKeys.currentIndex) || '0');
                        currentIndex++;
                        if (currentIndex < accountsFromStorage.length) {
                            localStorage.setItem(CONFIG.storageKeys.currentIndex, currentIndex);
                            actions.loginWithAccount(accountsFromStorage[currentIndex]);
                        } else {
                            [CONFIG.storageKeys.accounts, CONFIG.storageKeys.currentIndex, 'user_email', 'user_password']
                                .forEach(key => localStorage.removeItem(key));
                            window.location.reload();
                        }
                    } else {
                        ['user_email', 'user_password'].forEach(key => localStorage.removeItem(key));
                        window.location.reload();
                    }
                } else {
                    throw new Error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
                window.location.reload();
            }
        },

        autoKick: () => {
            if (window.location.href !== 'https://www.duolingo.com/settings/super') {
                window.location.href = 'https://www.duolingo.com/settings/super';
                return;
            }

            setTimeout(() => {
                const editButton = document.querySelector('button[data-test="edit-family"]');
                if (editButton) {
                    editButton.click();
                    setTimeout(() => {
                        const checkboxes = document.querySelectorAll('input[type="checkbox"][data-test="select-member-checkbox"]');
                        checkboxes.forEach(checkbox => checkbox.click());
                        setTimeout(() => {
                            const removeButton = document.querySelector('button[data-test="remove-member"]');
                            if (removeButton) {
                                removeButton.click();
                                actions.logOut();
                            }
                        }, 300);
                    }, 300);
                }
            }, 1000);
        },

        getLink: () => {
            if (window.location.href !== 'https://www.duolingo.com/settings/super') {
                window.location.href = 'https://www.duolingo.com/settings/super';
                return;
            }

            setTimeout(() => {
                const addMemberButton = document.querySelector('li[role="button"][tabindex="0"]');
                if (addMemberButton && addMemberButton.textContent.includes('Add')) {
                    addMemberButton.click();
                    const checkCopyButton = setInterval(() => {
                        const copyButton = document.querySelector('button[aria-label*="Copy"], button:contains("Copy")');
                        if (copyButton) {
                            clearInterval(checkCopyButton);
                            copyButton.click();
                            console.log('Link copied');

                            setTimeout(() => {
                                const closeButton = document.querySelector('button[data-test*="close"]');
                                if (closeButton) {
                                    closeButton.click();
                                    actions.logOut();
                                }
                            }, 500);
                        }
                    }, 100);
                }
            }, 500);
        },

        startAdditionalSteps: () => {
            const courseButtons = document.querySelectorAll('div[data-test*="course-"]');
            if (courseButtons.length > 0) {
                courseButtons[0].click();
                localStorage.setItem(CONFIG.storageKeys.selectedCourse, 'Selected');
            }

            setTimeout(() => {
                util.clickElement('button[data-test="funboarding-continue-button"]');
            }, 500);

            setTimeout(() => {
                window.location.href = 'https://www.duolingo.com/settings/super';
            }, 3000);
        },

        startPlusOfferProcess: () => {
            if (window.location.href !== 'https://www.duolingo.com/settings/super') {
                window.location.href = 'https://www.duolingo.com/settings/super';
                return;
            }

            const steps = [
                { selector: 'button[data-test="plus-offer-button"]', delay: 500 },
                { selector: 'button[data-test="plus-continue"]', delay: 300 },
                { selector: 'button[data-test="plus-continue"]', delay: 300 },
                { selector: 'button[data-test="plus-continue"]', delay: 300 }
            ];

            const executeSteps = (index = 0) => {
                if (index >= steps.length) return;
                const step = steps[index];
                setTimeout(() => {
                    const element = document.querySelector(step.selector);
                    if (element) {
                        element.click();
                        executeSteps(index + 1);
                    }
                }, step.delay);
            };
            executeSteps();
        },

        handleLoginAuto: () => {
            const fileInput = util.createElement('input', {
                type: 'file',
                accept: '.txt',
                style: { display: 'none' },
                onchange: function(e) {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        const accounts = content.split('\n')
                            .filter(line => line.trim() !== '')
                            .map(line => {
                                const parts = line.split(':');
                                return parts.length >= 4 ? {
                                    id: parts[0],
                                    username: parts[1],
                                    password: parts[2],
                                    token: parts[3].trim()
                                } : null;
                            })
                            .filter(account => account !== null);

                        if (accounts.length > 0) {
                            localStorage.setItem(CONFIG.storageKeys.accounts, JSON.stringify(accounts));
                            localStorage.setItem(CONFIG.storageKeys.currentIndex, '0');
                            actions.loginWithAccount(accounts[0]);
                        } else {
                            alert('No valid accounts found');
                        }
                    };
                    reader.readAsText(file);
                    document.body.removeChild(fileInput);
                }
            });
            document.body.appendChild(fileInput);
            fileInput.click();
        },

        loginWithAccount: (account) => {
            if (!account || !account.token) {
                console.error('Invalid account data');
                return;
            }
            console.log(`Logging in with account: ${account.id}`);
            document.cookie = `jwt_token=${account.token}; path=/`;
            window.location.reload();
        },

        exportAccounts: (all = false) => {
            const accounts = JSON.parse(localStorage.getItem(CONFIG.storageKeys.registeredAccounts) || '[]');
            if (accounts.length === 0) {
                alert('No accounts to export');
                return;
            }

            const currentToken = util.getJwtToken();
            if (currentToken && !all) {
                const currentEmail = localStorage.getItem('user_email');
                const currentPassword = localStorage.getItem('user_password');

                if (currentEmail && currentPassword) {
                    const accountData = `1:${currentEmail}:${currentPassword}:${currentToken}`;
                    util.downloadAsFile(accountData, 'duolingo_account.txt');
                } else {
                    alert('Current account details not found');
                }
            } else {
                const accountsData = accounts.map((acc, idx) =>
                    `${idx + 1}:${acc.username}:${acc.password}:${acc.token}`
                ).join('\n');

                util.downloadAsFile(accountsData, 'duolingo_accounts.txt');
                console.log(`${accounts.length} accounts exported`);
            }
        }
    };

    const init = () => {
        document.addEventListener('keydown', e => {
            if (e.altKey && e.key === 'e') {
                actions.exportAccounts(false);
            }
            else if (e.altKey && e.key === 'm') {
                actions.exportAccounts(true);
            }
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    document.body.appendChild(ui.createWindow());
                    ui.createNotification();
                }, 1000);
            });
        } else {
            setTimeout(() => {
                document.body.appendChild(ui.createWindow());
                ui.createNotification();
            }, 1000);
        }

        const accountsListStr = localStorage.getItem(CONFIG.storageKeys.accounts);
        if (accountsListStr) {
            const currentIndex = parseInt(localStorage.getItem(CONFIG.storageKeys.currentIndex) || '0');
            console.log(`Loaded ${JSON.parse(accountsListStr).length} accounts, index: ${currentIndex}`);
        }
    };

    init();
})();
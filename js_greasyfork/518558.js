// ==UserScript==
// @name         GPT账号批量管理助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  批量化添加和管理GPT账号
// @author       xuming
// @match        https://chat.openai.com/**
// @match        https://auth.openai.com/*
// @match        https://auth0.openai.com/u/login/*
// @match        https://auth0.openai.com/u/login/password*
// @match        https://chatgpt.com/**
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://chat.rawchat.cc
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518558/GPT%E8%B4%A6%E5%8F%B7%E6%89%B9%E9%87%8F%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/518558/GPT%E8%B4%A6%E5%8F%B7%E6%89%B9%E9%87%8F%E7%AE%A1%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let accounts = JSON.parse(GM_getValue('accounts', '[]')) || [];
    let accountsLastUsed = JSON.parse(GM_getValue('accountsLastUsed', '{}')) || {};
    let currentAccountIndex = parseInt(GM_getValue('currentAccountIndex', '0'), 10);

    const commonStyles = {
        button: {
            padding: '8px 15px',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
        },
        closeButton: {
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '5px 10px',
            color: '#666'
        },
        popup: {
            position: 'fixed',
            right: '20px',
            bottom: '80px',
            padding: '20px',
            backgroundColor: 'white',
            border: '1px solid black',
            zIndex: 1000,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        titleBar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            backgroundColor: 'white',
            padding: '10px 0'
        }
    };

    function createElement(tag, styles = {}, innerText = '') {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        element.innerText = innerText;
        return element;
    }

    function createButton(text, styles = {}, onClick) {
        const button = createElement('button', {...commonStyles.button, ...styles}, text);
        if (onClick) button.addEventListener('click', onClick);
        return button;
    }

    function createPopup(title, content, styles = {}) {
        const popup = createElement('div', {...commonStyles.popup, ...styles});
        const titleBar = createElement('div', commonStyles.titleBar);
        titleBar.appendChild(createElement('h3', {}, title));
        titleBar.appendChild(createButton('×', commonStyles.closeButton, () => document.body.removeChild(popup)));
        popup.appendChild(titleBar);
        popup.appendChild(content);
        document.body.appendChild(popup);
        return popup;
    }

    function updateAccounts(newAccounts) {
        accounts = newAccounts;
        GM_setValue('accounts', JSON.stringify(accounts));
    }

    function showToast(message, duration = 2000) {
        const toast = createElement('div', {
            position: 'fixed',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            zIndex: 10000,
            fontSize: '14px'
        }, message);
        
        document.body.appendChild(toast);
        setTimeout(() => {
            document.body.removeChild(toast);
        }, duration);
    }

    const accountOperations = {
        copy: (text, type, accountDiv) => {
            navigator.clipboard.writeText(text);
            accountsLastUsed[text] = new Date().toLocaleString();
            GM_setValue('accountsLastUsed', JSON.stringify(accountsLastUsed));
            accountDiv.querySelector('small:last-child').textContent = `上次使用: ${accountsLastUsed[text]}`;
            
            if (type === '账号') {
                const newIndex = accounts.findIndex(acc => acc.username === text);
                if (newIndex !== -1) {
                    currentAccountIndex = newIndex;
                    GM_setValue('currentAccountIndex', currentAccountIndex);
                    const popupElement = accountDiv.closest('[style*="position: fixed"]');
                    if (popupElement) {
                        document.body.removeChild(popupElement);
                        showAccountsList();
                    }
                }
            }
            
            showToast(`已复制${type}：${text}`);
        },

        delete: (index, container) => {
            accounts.splice(index, 1);
            updateAccounts(accounts);
            if (currentAccountIndex >= accounts.length) {
                currentAccountIndex = 0;
                GM_setValue('currentAccountIndex', currentAccountIndex);
            }
            document.body.removeChild(container);
            showAccountsList();
        }
    };

    const AccountManager = {
        export: () => {
            if (accounts.length === 0) {
                showToast('当前没有保存的账号！');
                return;
            }
            const text = accounts.map(acc => `${acc.username}---${acc.password}`).join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const link = createElement('a');
            link.download = `GPT账号列表_${new Date().toLocaleDateString()}.txt`;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        }
    };

    function showAddAccountForm() {
        const content = createElement('div');
        const textArea = createElement('textarea', {width: '300px', height: '200px'});
        textArea.placeholder = '请输入账号，格式如下：\nemail@example.com---password\n每行一个账号';

        const buttonContainer = createElement('div', {marginTop: '10px'});

        const buttons = [
            {
                text: '批量导入',
                color: '#2196F3',
                onClick: () => {
                    const newAccounts = textArea.value.split('\n')
                        .filter(line => line.trim())
                        .map(line => {
                            const [username, password] = line.split('---');
                            return username && password ? {username: username.trim(), password: password.trim()} : null;
                        })
                        .filter(acc => acc);

                    accounts.push(...newAccounts);
                    updateAccounts(accounts);
                    document.body.removeChild(popup);
                    showToast(`成功添加 ${newAccounts.length} 个账号`);
                }
            },
            {
                text: '清空所有账号',
                color: '#ff4444',
                onClick: () => {
                    if (confirm('确定要清空所有账号吗？')) {
                        updateAccounts([]);
                        document.body.removeChild(popup);
                        showToast('已清空所有账号');
                    }
                }
            }
        ];

        buttons.forEach(({ text, color, onClick }) => {
            buttonContainer.appendChild(createButton(text, { backgroundColor: color }, onClick));
        });

        content.appendChild(textArea);
        content.appendChild(buttonContainer);

        const popup = createPopup('添加账号', content);
    }

    function showAccountsList() {
        const content = createElement('div', {overflow: 'auto'});

        if (accounts.length > 0) {
            const currentAccount = accounts[currentAccountIndex];
            const nextIndex = (currentAccountIndex + 1) % accounts.length;
            const nextAccount = accounts[nextIndex];

            content.innerHTML = `
                <div style="font-size: 0.9em; color: #666; margin-bottom: 10px;">
                    当前账号: ${currentAccountIndex + 1}号 (${currentAccount.username})<br>
                    下一个账号: ${nextIndex + 1}号 (${nextAccount.username})
                </div>
            `;
        }

        accounts.forEach((account, index) => {
            const accountDiv = createElement('div', {
                padding: '10px',
                borderBottom: '1px solid #eee',
                ...commonStyles.container
            });

            accountDiv.innerHTML = `
                <div style="flex: 1">
                    <strong>${index + 1}. ${account.username}</strong><br>
                    <small style="color: #666;">密码: ${account.password}</small><br>
                    <small style="color: #999; font-size: 0.8em;">
                        上次使用: ${accountsLastUsed[account.username] || '从未使用'}
                    </small>
                </div>
            `;

            const buttonContainer = createElement('div', {display: 'flex', gap: '5px'});
            [
                ['复制账号', '#4CAF50', () => accountOperations.copy(account.username, '账号', accountDiv)],
                ['复制密码', '#2196F3', () => accountOperations.copy(account.password, '密码', accountDiv)],
                ['删除', '#ff4444', () => accountOperations.delete(index, popup)]
            ].forEach(([text, color, onClick]) => {
                buttonContainer.appendChild(createButton(text, { backgroundColor: color }, onClick));
            });

            accountDiv.appendChild(buttonContainer);
            content.appendChild(accountDiv);
        });

        const popup = createPopup(
            `当前账号列表 (共${accounts.length}个)`,
            content,
            {
                maxHeight: '80vh',
                width: '400px',
                overflowY: 'auto'
            }
        );
    }

    window.addEventListener('load', () => {
        setTimeout(createAccountPool, 1000);
    });

    function createAccountPool() {
        const mainButton = createButton('账号池', {
            position: 'fixed',
            right: '15px',
            bottom: '15px',
            zIndex: 1000,
            padding: '4px 8px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            color: '#666',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '3px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontSize: '12px',
            transition: 'all 0.3s ease'
        });

        const menuContainer = createElement('div', {
            position: 'fixed',
            right: '20px',
            bottom: '70px',
            backgroundColor: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '5px',
            zIndex: 999
        });

        const menuItems = [
            { text: '添加账号', color: '#2196F3', handler: showAddAccountForm },
            { text: '查看账号', color: '#FF9800', handler: showAccountsList },
            { text: '导出账号', color: '#9C27B0', handler: AccountManager.export }
        ].forEach(({ text, color, handler }) => {
            menuContainer.appendChild(createButton(text, {
                backgroundColor: color,
                width: '100%',
                minWidth: '120px'
            }, handler));
        });

        const toggleMenu = (() => {
            let isVisible = false;
            return () => {
                isVisible = !isVisible;
                menuContainer.style.display = isVisible ? 'flex' : 'none';
            };
        })();

        mainButton.addEventListener('click', toggleMenu);
        document.addEventListener('click', (event) => {
            if (!mainButton.contains(event.target) && !menuContainer.contains(event.target)) {
                menuContainer.style.display = 'none';
            }
        });

        [mainButton, menuContainer].forEach(el => document.body.appendChild(el));
    }
})();
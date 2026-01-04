// ==UserScript==
// @name         Stackblitz Account Selector (RU)
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Интерфейс для сайта stackblitz предоставляющую возможность загружать свою базу аккаунтов (локально) и использовать ее для упрощения логина в разные аккаунты
// @author       t.me/dud3lk
// @match        https://stackblitz.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527318/Stackblitz%20Account%20Selector%20%28RU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527318/Stackblitz%20Account%20Selector%20%28RU%29.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const BACKGROUND_COLOR = '#1D1F24';
    const BUTTON_LOGIN_COLOR = '#28a745';
    const BUTTON_DELETE_COLOR = '#dc3545';
    const BUTTON_UPLOAD_COLOR = '#007bff';


    let logoutObserver = null;
    let lastUsedAccount = null;


    if (window.location.href.includes('sign_in')) {
        handleLoginPage();
    } else {
        handleMainPage();
    }


    function handleLoginPage() {
        waitForLoginFields();
        startLogoutDetection();
    }

    function handleMainPage() {
        waitForSignInButton();
        startLogoutDetection();
    }



    function startLogoutDetection() {
        if (logoutObserver) return;

        logoutObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const signInLink = document.querySelector('a[href="/sign_in"]');
                    if (signInLink) {
                        handleLogoutEvent();
                    }
                }
            });
        });

        logoutObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function handleLogoutEvent() {
        const email = GM_getValue('lastUsedAccount', null);
        if (email) {
            logLogout(email);
            GM_deleteValue('lastUsedAccount');


            const container = document.getElementById('account-selector-container');
            if (container) {
                container.remove();
                showAccountSelector();
            }
        }
    }

    function logLogout(email) {
        const logs = GM_getValue('logoutLogs', {});
        logs[email] = new Date().toISOString();
        GM_setValue('logoutLogs', logs);
        console.log(`[LOGOUT] ${email} at ${logs[email]}`);
    }


    function logLogin(email) {
        const logs = GM_getValue('loginLogs', {});
        logs[email] = new Date().toISOString();
        GM_setValue('loginLogs', logs);

        GM_setValue('lastUsedAccount', email);
        console.log(`[LOGIN] ${email} at ${logs[email]}`);
    }


    function showAccountSelector() {
        const accounts = GM_getValue('accounts', []);
        const logoutLogs = GM_getValue('logoutLogs', {});
        const loginLogs = GM_getValue('loginLogs', {});

        if (accounts.length === 0) {
            alert('Нет доступных аккаунтов. Загрузите файл.');
            return;
        }

        const container = document.createElement('div');
        container.id = 'account-selector-container';
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = BACKGROUND_COLOR;
        container.style.padding = '20px';
        container.style.border = '1px solid #333';
        container.style.zIndex = 9999;
        container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        container.style.borderRadius = '8px';
        container.style.width = '450px';
        container.style.maxHeight = '600px';
        container.style.overflowY = 'auto';
        container.style.color = '#fff';

        const title = document.createElement('h3');
        title.textContent = 'Выберите аккаунт:';
        title.style.marginBottom = '15px';
        title.style.color = '#aaa';
        title.style.fontSize = '16px';

        const list = document.createElement('ul');
        list.style.listStyleType = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        accounts.forEach(account => {
            const [email] = account.split(':');
            const lastLogout = logoutLogs[email];
            const lastLogin = loginLogs[email];

            const listItem = document.createElement('li');
            listItem.style.display = 'flex';
            listItem.style.justifyContent = 'space-between';
            listItem.style.alignItems = 'center';
            listItem.style.padding = '10px';
            listItem.style.borderBottom = '1px solid #333';
            listItem.style.cursor = 'pointer';
            listItem.style.transition = 'background-color 0.3s';

            const emailSpan = document.createElement('span');
            emailSpan.style.display = 'flex';
            emailSpan.style.flexDirection = 'column';
            emailSpan.style.gap = '5px';

            const emailText = document.createElement('span');
            emailText.textContent = email;
            emailText.style.color = '#ccc';
            emailText.style.fontSize = '14px';

            const lastLoginSpan = document.createElement('span');
            lastLoginSpan.style.color = '#888';
            lastLoginSpan.style.fontSize = '12px';
            lastLoginSpan.textContent = lastLogin
                ? `Вход: ${new Date(lastLogin).toLocaleString()}`
                : '';

            const lastLogoutSpan = document.createElement('span');
            lastLogoutSpan.style.color = '#888';
            lastLogoutSpan.style.fontSize = '12px';

            if (lastLogout) {
                const logoutDate = new Date(lastLogout);
                const now = new Date();
                const diffHours = Math.floor((now - logoutDate) / 36e5);

                lastLogoutSpan.textContent = `Выход: ${logoutDate.toLocaleString()}`;

                if (diffHours < 24) {
                    lastLogoutSpan.textContent += ` (Заблокирован на ${24 - diffHours}ч)`;
                }
            } else {
                lastLogoutSpan.textContent = 'Выходов не было';
            }

            emailSpan.appendChild(emailText);
            emailSpan.appendChild(lastLoginSpan);
            emailSpan.appendChild(lastLogoutSpan);

            const loginButton = createButton('Войти', BUTTON_LOGIN_COLOR);
            loginButton.style.padding = '5px 10px';
            loginButton.style.fontSize = '12px';

            if (lastLogout) {
                const logoutDate = new Date(lastLogout);
                const now = new Date();
                const diffHours = Math.floor((now - logoutDate) / 36e5);

                if (diffHours < 24) {
                    loginButton.style.backgroundColor = BUTTON_DELETE_COLOR;
                    loginButton.title = `Доступно через: ${24 - diffHours} часов`;
                }
            }

            loginButton.addEventListener('click', () => {
                GM_setValue('selectedAccount', account);
                redirectToSignIn();
                container.remove();
            });

            listItem.appendChild(emailSpan);
            listItem.appendChild(loginButton);
            list.appendChild(listItem);
        });

        const deleteButton = createButton('Удалить аккаунты', BUTTON_DELETE_COLOR);
        deleteButton.style.marginTop = '15px';
        deleteButton.addEventListener('click', () => {
            GM_deleteValue('accounts');
            GM_deleteValue('logoutLogs');
            GM_deleteValue('loginLogs');
            alert('Все данные удалены.');
            container.remove();
            showUploadBasePrompt();
        });

        container.appendChild(title);
        container.appendChild(list);
        container.appendChild(deleteButton);
        document.body.appendChild(container);
    }



    function createButton(text, color) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.display = 'inline-block';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = color;
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginTop = '10px';
        return button;
    }

    function redirectToSignIn() {
        waitForElement('a[href="/sign_in"]', (signInButton) => {
            signInButton.click();
            const checkForSignInPage = setInterval(() => {
                if (window.location.href.includes('sign_in')) {
                    clearInterval(checkForSignInPage);
                    waitForLoginFields();
                }
            }, 200);
            setTimeout(() => {
                clearInterval(checkForSignInPage);
                alert('Переход на страницу входа не выполнен. Попробуйте войти вручную.');
            }, 10000);
        });
    }

    function waitForLoginFields() {

        waitForElement('input[name="login"], input[name="password"], button[type="submit"]', () => {
            const selectedAccount = GM_getValue('selectedAccount', null);
            if (selectedAccount) {
                const [email, password] = selectedAccount.split(':');
                performLogin(email, password);
            } else {
                alert('Не выбран аккаунт. Вернитесь на главную страницу и выберите аккаунт.');
            }
        });
    }

    function performLogin(email, password) {
        const emailInput = document.querySelector('input[name="login"]');
        const passwordInput = document.querySelector('input[name="password"]');

        const submitButton = document.querySelector('button[type="submit"]');

        if (emailInput && passwordInput && submitButton) {
            emailInput.value = email;
            passwordInput.value = password;
            setTimeout(() => {
                submitButton.click();
                logLogin(email);
                GM_deleteValue('selectedAccount');
            }, 500);
        } else {
            alert('Не удалось найти поля для входа. Пожалуйста, войдите вручную.');
        }
    }

    function waitForSignInButton() {
        waitForElement('a._link_kkm2m_1[href="/sign_in"]', () => {
            loadAccounts();
            showAccountSelector();
        });

    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    callback(element);
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function loadAccounts() {
        const accounts = GM_getValue('accounts', null);
        if (!accounts) {
            showUploadBasePrompt();
        }
    }

    function showUploadBasePrompt() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.backgroundColor = BACKGROUND_COLOR;
        container.style.padding = '10px';
        container.style.border = '1px solid #333';
        container.style.zIndex = 9999;
        container.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        container.style.borderRadius = '5px';
        container.style.color = '#fff';

        const label = document.createElement('label');
        label.textContent = 'Загрузите базу аккаунтов:';
        label.style.display = 'block';
        label.style.marginBottom = '10px';
        label.style.color = '#aaa';

        const uploadButton = createButton('Загрузить базу', BUTTON_UPLOAD_COLOR);
        uploadButton.addEventListener('click', () => {
            createFileInput();
            container.remove();
        });

        container.appendChild(label);
        container.appendChild(uploadButton);
        document.body.appendChild(container);
    }

    function createFileInput() {
        const fileInputContainer = document.createElement('div');
        fileInputContainer.style.position = 'fixed';
        fileInputContainer.style.top = '10px';
        fileInputContainer.style.left = '10px';
        fileInputContainer.style.backgroundColor = BACKGROUND_COLOR;
        fileInputContainer.style.padding = '10px';
        fileInputContainer.style.border = '1px solid #333';
        fileInputContainer.style.zIndex = 9999;
        fileInputContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        fileInputContainer.style.borderRadius = '5px';
        fileInputContainer.style.color = '#fff';

        const label = document.createElement('label');
        label.textContent = 'Выберите файл:';
        label.style.display = 'block';
        label.style.marginBottom = '10px';
        label.style.color = '#aaa';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.style.display = 'block';

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    const accountList = content.split('\n').map(line => line.trim()).filter(line => line !== '');
                    GM_setValue('accounts', accountList);
                    alert('Аккаунты успешно загружены!');
                    fileInputContainer.remove();
                    showAccountSelector();
                };
                reader.readAsText(file);
            }
        });

        fileInputContainer.appendChild(label);
        fileInputContainer.appendChild(fileInput);
        document.body.appendChild(fileInputContainer);
        fileInput.click();
    }
})();
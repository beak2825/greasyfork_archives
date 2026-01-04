// ==UserScript==
// @name         多账号自动登录脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动登录多个账户并登出
// @author       Linux.do
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/493750/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/493750/%E5%A4%9A%E8%B4%A6%E5%8F%B7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let accounts = GM_getValue('accounts', []);
    let scriptEnabled = GM_getValue('scriptEnabled', false);

    GM_registerMenuCommand('配置账号', openConfig);
    GM_registerMenuCommand('启动/停止脚本', toggleScript);

    function showMessage(message, timeout = 3000) {
        let messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '10px';
        messageDiv.style.left = '10px';
        messageDiv.style.zIndex = '9999';
        messageDiv.style.background = 'white';
        messageDiv.style.padding = '10px';
        messageDiv.style.border = '1px solid black';
        messageDiv.style.borderRadius = '5px';
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, timeout);
    }

    function toggleScript() {
        scriptEnabled = !scriptEnabled;
        GM_setValue('scriptEnabled', scriptEnabled);
        showMessage('脚本现在' + (scriptEnabled ? '启动' : '停止') + '。');
        if (scriptEnabled) {
            GM_setValue('shouldRunMain', true);
            main();
        } else {
            GM_setValue('shouldRunMain', false);
        }
    }

    function openConfig() {
        let configHtml = `
            <div id="tm-config" style="position: fixed; top: 20px; left: 20px; z-index: 9999; background: white; padding: 10px; border: 1px solid black;">
                <h2>账号配置</h2>
                <div id="tm-accounts"></div>
                <button id="tm-add-account">添加账号</button>
                <button id="tm-save-config">保存配置</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', configHtml);

        accounts.forEach((account, index) => {
            addAccountFields(index, account.username, account.password);
        });

        document.getElementById('tm-add-account').addEventListener('click', () => {
            addAccountFields(accounts.length);
        });

        document.getElementById('tm-save-config').addEventListener('click', saveConfig);
    }

    function addAccountFields(index, username = '', password = '') {
        let accountHtml = `
            <div class="tm-account" data-index="${index}">
                用户名：<input type="text" class="tm-username" value="${username}">
                密码：<input type="password" class="tm-password" value="${password}">
                <button class="tm-remove-account">移除</button>
            </div>
        `;
        document.getElementById('tm-accounts').insertAdjacentHTML('beforeend', accountHtml);

        let removeButtons = document.getElementsByClassName('tm-remove-account');
        let lastButton = removeButtons[removeButtons.length - 1];
        lastButton.addEventListener('click', function () {
            this.parentElement.remove();
        });
    }

    function saveConfig() {
        let accountDivs = document.getElementsByClassName('tm-account');
        accounts = Array.from(accountDivs).map(div => {
            return {
                username: div.querySelector('.tm-username').value,
                password: div.querySelector('.tm-password').value
            };
        });
        GM_setValue('accounts', accounts);
        alert('配置已保存！');
        document.getElementById('tm-config').remove();
    }

    function isLoggedIn() {
        return document.querySelector('#toggle-current-user') !== null;
    }

    function waitForElement(selector, callback, checkVisibility = false, timeout = 5000) {
        let start = Date.now();
        let interval = setInterval(() => {
            let element = document.querySelector(selector);
            let isVisible = element && (element.offsetParent !== null);
            if (element && (!checkVisibility || isVisible)) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                console.error('等待元素超时: ', selector);
                showMessage('操作超时，脚本停止。');
                GM_setValue('scriptEnabled', false);
            }
        }, 100);
    }

    function login(account, callback) {
        if (!isLoggedIn()) {
            let loginButton = document.querySelector('.login-button');
            if (loginButton) {
                loginButton.click();
                waitForElement('#login-account-name', () => {
                    let usernameField = document.getElementById('login-account-name');
                    let passwordField = document.getElementById('login-account-password');

                    usernameField.value = '';
                    passwordField.value = '';

                    setTimeout(() => {
                        usernameField.value = account.username;
                        passwordField.value = account.password;

                        usernameField.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordField.dispatchEvent(new Event('input', { bubbles: true }));

                        setTimeout(() => {
                            document.getElementById('login-button').click();

                            setTimeout(() => {
                                let alertElement = document.querySelector('#modal-alert.alert.alert-error');
                                if (alertElement && alertElement.textContent.includes('请稍后再尝试登录。')) {
                                    console.log('出现错误提示，正在重试登录...');
                                    setTimeout(() => {
                                        document.getElementById('login-button').click();
                                    }, 500);
                                } else if (typeof callback === "function") {
                                    callback();
                                }
                            }, 100);
                        }, 800);
                    }, 200);
                });
            }
        }
    }

    function logout(callback) {
        waitForElement('#toggle-current-user', (profileButton) => {
            profileButton.click();
            waitForElement('.bottom-tabs .user-menu-tab', (profileTab) => {
                profileTab.click();
                waitForElement('.logout .profile-tab-btn', (logoutButton) => {
                    logoutButton.click();
                    if (typeof callback === "function") {
                        callback();
                    }
                });
            });
        });
    }

    function main() {
        if (!GM_getValue('shouldRunMain', false)) {
            return;
        }
        console.log('开始处理账号');

        setTimeout(() => {
            console.log('开始处理账号');

            let accountIndex = GM_getValue('accountIndex', 0);
            if (scriptEnabled && accountIndex < accounts.length) {
                if (isLoggedIn()) {
                    console.log('已登录，准备登出');
                    logout(() => {
                        let nextAccountIndex = (GM_getValue('accountIndex', 0) + 1) % accounts.length;
                        GM_setValue('accountIndex', nextAccountIndex);
                        document.addEventListener('DOMContentLoaded', main);
                    });
                } else {
                    let account = accounts[accountIndex];
                    console.log('准备登录账号：', account.username);
                    GM_setValue('currentAccount', account.username);
                    login(account, () => {
                        GM_setValue('accountIndex', accountIndex + 1);
                        document.addEventListener('DOMContentLoaded', main);
                    });
                }
            } else {
                console.log('所有账号处理完毕');
                GM_setValue('accountIndex', 0);
                GM_setValue('shouldRunMain', false);
                GM_setValue('scriptEnabled', false);
                showMessage('操作完成');
            }
        }, 2000);
    }

    window.addEventListener('load', function () {
        if (GM_getValue('shouldRunMain', false) && GM_getValue('scriptEnabled', false)) {
            main();
        }
    });
})();

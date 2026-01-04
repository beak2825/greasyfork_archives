// ==UserScript==
// @name         自动化登录账号
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动登录和切换账号，带有手动切换按钮
// @author       Kai
// @match        https://chat.rawchat.cc/login
// @match        https://chat.rawchat.cc/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495357/%E8%87%AA%E5%8A%A8%E5%8C%96%E7%99%BB%E5%BD%95%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/495357/%E8%87%AA%E5%8A%A8%E5%8C%96%E7%99%BB%E5%BD%95%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';

    // 初始账号列表
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [
        {username: 'solovey.yuliya@gmail.com', password: '80979852851y'},
        {username: 'mvmadpro@yahoo.com', password: 'Decarlo1$'},
        {username: 'gumondu92@aol.com', password: 'Jessica97'},
        // 添加更多账号
    ];

    // 获取当前账号索引
    let currentAccountIndex = parseInt(localStorage.getItem('currentAccountIndex') || '0', 10);

    function fillCredentials(account) {
        // 输入用户名和密码
        document.querySelector('input[name="username"]').value = account.username;
        document.querySelector('input[name="password"]').value = account.password;
        document.querySelector('input[name="password"]').dispatchEvent(new Event('input', { bubbles: true })); // 触发事件确保密码框填入

        // 模拟按下Enter键以实现自动登录
        document.querySelector('input[name="password"]').dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
    }

    function switchAccount() {
        currentAccountIndex++;
        if (currentAccountIndex >= accounts.length) {
            currentAccountIndex = 0; // 循环使用账号
        }
        localStorage.setItem('currentAccountIndex', currentAccountIndex);
        fillCredentials(accounts[currentAccountIndex]);
    }

    function addSwitchButton() {
        const button = document.createElement('button');
        button.innerText = '切换账号';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.addEventListener('click', handleButtonClick);
        document.body.appendChild(button);
    }

    function addAccountButton() {
        const button = document.createElement('button');
        button.innerText = '添加账号';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.addEventListener('click', showAddAccountForm);
        document.body.appendChild(button);
    }

    function showAddAccountForm() {
        const form = document.createElement('div');
        form.style.position = 'fixed';
        form.style.top = '100px';
        form.style.right = '10px';
        form.style.padding = '20px';
        form.style.backgroundColor = 'white';
        form.style.border = '1px solid black';
        form.style.zIndex = 1000;

        const usernameLabel = document.createElement('label');
        usernameLabel.innerText = '账号: ';
        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';

        const passwordLabel = document.createElement('label');
        passwordLabel.innerText = '密码: ';
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';

        const saveButton = document.createElement('button');
        saveButton.innerText = '保存';
        saveButton.addEventListener('click', () => {
            const newAccount = {
                username: usernameInput.value,
                password: passwordInput.value
            };
            accounts.push(newAccount);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            document.body.removeChild(form);
        });

        form.appendChild(usernameLabel);
        form.appendChild(usernameInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(passwordLabel);
        form.appendChild(passwordInput);
        form.appendChild(document.createElement('br'));
        form.appendChild(saveButton);
        document.body.appendChild(form);
    }

    function handleButtonClick() {
        const currentURL = window.location.href;
        if (currentURL.includes('https://chat.rawchat.cc/login')) {
            switchAccount();
        } else if (currentURL === 'https://chat.rawchat.cc/') {
            currentAccountIndex++;
            if (currentAccountIndex >= accounts.length) {
                currentAccountIndex = 0; // 循环使用账号
            }
            localStorage.setItem('currentAccountIndex', currentAccountIndex);
            window.open('https://chat.rawchat.cc/login', '_blank');
        }
    }

    window.addEventListener('load', () => {
        const currentURL = window.location.href;
        if (currentURL.includes('https://chat.rawchat.cc/login')) {
            fillCredentials(accounts[currentAccountIndex]);
        }
        addSwitchButton();
        addAccountButton();
    });
})();
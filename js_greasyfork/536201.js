// ==UserScript==
// @name         HUST 校园网自动登录 + 账号切换
// @namespace    https://github.com/Yiipu
// @version      1.0.1
// @description  本地（❗明文❗）保存账号密码，支持自动登录、一键切换账号。
// @author       Yiipu
// @match        http://172.18.18.61:8080/eportal/*
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/536201/HUST%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%20%2B%20%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/536201/HUST%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%20%2B%20%E8%B4%A6%E5%8F%B7%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'accounts';
    const SWITCH_ACCOUNT_KEY = 'switchAccountTo';

    // 工具函数
    function getAccounts() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }

    function saveAccount(username, password) {
        const accounts = getAccounts();
        accounts[username] = password;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }

    function deleteAccount(username) {
        const accounts = getAccounts();
        const _accounts = Object.keys(accounts).reduce((acc, key)=>{
            if(key != username) acc[key] = accounts[key];
            return acc;
        },{})
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_accounts));
    }

    function setTargetAccount(username) {
        localStorage.setItem(SWITCH_ACCOUNT_KEY, username);
    }

    function getTargetAccount() {
        return localStorage.getItem(SWITCH_ACCOUNT_KEY);
    }

    function clearTargetAccount() {
        localStorage.removeItem(SWITCH_ACCOUNT_KEY);
    }

    // 登录页面逻辑
    function handleLoginPage() {
        const trigger_usr = document.querySelector('#username_tip');
        const trigger_pwd = document.querySelector("#pwd_tip");

        const usernameInput = document.querySelector('#username.input');
        const passwordInput = document.querySelector('#pwd.input');
        const loginButton = document.querySelector('#loginLink');

        const container = document.querySelector('#connectNetworkPageId');
        const accountSelector = document.createElement('select');
        const saveButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        saveButton.textContent = '保存当前账号';
        deleteButton.textContent = '删除所选账号';

        container.appendChild(accountSelector);
        container.appendChild(saveButton);
        container.appendChild(deleteButton);

        var accounts;
        updateSelector();

        accountSelector.addEventListener('change', function () {
            const selectedUser = this.value;
            if (selectedUser && accounts[selectedUser]) {
                usernameInput.value = selectedUser;
                passwordInput.value = accounts[selectedUser];
                trigger_usr.focus();
                trigger_pwd.focus();
            }
        });

        saveButton.addEventListener('click', function () {
            const user = usernameInput.value;
            const pass = passwordInput.value;
            if (user && pass) {
                saveAccount(user, pass);
                updateSelector();
                console.log('账号已保存');
            } else {
                console.log('请输入账号和密码');
            }
        });

        deleteButton.addEventListener('click', function () {
            const selectedUser = accountSelector.value;
            if (selectedUser) {
                deleteAccount(selectedUser);
                updateSelector();
                console.log('账号已删除');
            } else {
                console.log('请选择账号');
            }
        });

        function updateSelector() {
            accounts = getAccounts();

            accountSelector.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.textContent = '选择账号';
            defaultOption.value = '';
            accountSelector.appendChild(defaultOption);

            for (const user in accounts) {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                accountSelector.appendChild(option);
            }

            // 如果有待登录账号，自动登录
            const target = getTargetAccount();
            if (target && accounts[target]) {
                usernameInput.value = target;
                passwordInput.value = accounts[target];
                clearTargetAccount();
                // TODO：提示密码未被加密，点击输入框后可以手动登录
                // document.querySelector("#pwd_hk_posi").focus();
                // document.querySelector("#pwd_hk_posi").click();
                loginButton.click();
            }
        }
    }

    // 登录成功页逻辑
    function handleSuccessPage() {
        const container = document.querySelector("#maintable > tbody > tr:nth-child(1) > td:nth-child(3)");
        const switchContainer = document.createElement('div');
        const accountSelector = document.createElement('select');
        const switchButton = document.createElement('button');

        switchContainer.style.marginTop = '20px';
        switchButton.textContent = '切换账号';

        switchContainer.appendChild(accountSelector);
        switchContainer.appendChild(switchButton);
        container.appendChild(switchContainer);

        const accounts = getAccounts();

        const defaultOption = document.createElement('option');
        defaultOption.textContent = '选择账号';
        defaultOption.value = '';
        accountSelector.appendChild(defaultOption);

        for (const user in accounts) {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            accountSelector.appendChild(option);
        }

        switchButton.addEventListener('click', function () {
            const selected = accountSelector.value;
            if (selected && accounts[selected]) {
                setTargetAccount(selected);
                sureLogout(); // 页面自身的全局函数
            } else {
                console.log('请选择一个账号');
            }
        });
    }

    // 注销页面逻辑（自动跳转回登录页）
    function handleLogoutPage() {
        location.href = 'http://172.18.18.61:8080/eportal/gologout.jsp';
    }

    // 主程序：根据 URL 决定逻辑
    const url = location.href;

    if (url.includes('eportal/index.jsp')) {
        handleLoginPage();
    } else if (url.includes('eportal/success.jsp')) {
        handleSuccessPage();
    } else if (url.includes('eportal/logout.jsp')) {
        handleLogoutPage();
    }
})();

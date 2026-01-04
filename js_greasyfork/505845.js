// ==UserScript==
// @name         河南工学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  可用于河南工学院校园网快速登录
// @author       软件工程234
// @match        http://211.69.15.10:6060/portalReceiveAction.do*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505845/%E6%B2%B3%E5%8D%97%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/505845/%E6%B2%B3%E5%8D%97%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置
    const CONFIG = {
        account: localStorage.getItem('autoLoginAccount') || '', // 学号
        password: localStorage.getItem('autoLoginPassword') || '', // 密码
        lsp: localStorage.getItem('autoLoginLSP') || '0', // 运营商：0 校园网、1 中国电信、2 中国移动、3 中国联通
    };

    // 各控件的 selector
    const SELECTORS = {
        accountInput: '#userName',
        passwordInput: '#password',
        lspButtons: {
            1: 'body > div.loginWrap > form > div > div.loginWay > span:nth-child(3) > label > i', // 中国电信
            2: 'body > div.loginWrap > form > div > div.loginWay > span:nth-child(2) > label > i', // 中国联通
            3: 'body > div.loginWrap > form > div > div.loginWay > span:nth-child(1) > label > i'  // 中国移动
        },
        loginButton: 'body > div.loginWrap > form > div > div:nth-child(6) > input',
        backButton: '#edit_body > div:nth-child(1) > div.edit_loginBox.ui-resizable-autohide > form > input',
    };

    // 填写表单并登录
    function login() {
        console.log("正在进行登录操作");

        // 填写账号和密码
        const accountField = document.querySelector(SELECTORS.accountInput);
        const passwordField = document.querySelector(SELECTORS.passwordInput);
        if (accountField && passwordField) {
            accountField.value = CONFIG.account;
            passwordField.value = CONFIG.password;
        } else {
            console.error("未找到账号或密码输入框");
            return;
        }

        // 选择运营商并点击登录
        const lspButton = document.querySelector(SELECTORS.lspButtons[CONFIG.lsp]);
        if (lspButton) {
            lspButton.click();
        } else {
            console.error("未找到对应的运营商按钮");
            return;
        }

        const loginButton = document.querySelector(SELECTORS.loginButton);
        if (loginButton) {
            setTimeout(() => loginButton.click(), 200);
        } else {
            console.error("未找到登录按钮");
        }
    }

    // 显示输入对话框
    function promptUserCredentials() {
        let account = prompt("请输入学号：", CONFIG.account);
        if (account === null) return false; // 用户取消
        account = account.trim();

        let password = prompt("请输入密码：", CONFIG.password);
        if (password === null) return false; // 用户取消
        password = password.trim();

        let lsp;
        while (true) {
            const lspInput = prompt("请选择运营商：1 中国电信、2 中国联通、3 中国移动", CONFIG.lsp);
            if (lspInput === null) return false; // 用户取消
            lsp = parseInt(lspInput.trim(), 10);
            if ([1, 2, 3].includes(lsp)) {
                break;
            }
            alert("无效的运营商选择，请输入 1、2 或 3。");
        }

        if (!account || !password) {
            alert("学号和密码不能为空！");
            return false;
        }

        CONFIG.account = account;
        CONFIG.password = password;
        CONFIG.lsp = lsp.toString();

        // 保存到 localStorage
        localStorage.setItem('autoLoginAccount', CONFIG.account);
        localStorage.setItem('autoLoginPassword', CONFIG.password);
        localStorage.setItem('autoLoginLSP', CONFIG.lsp);

        alert("信息已更新！");
        return true;
    }

    // 监听键盘事件以更改学号、密码和运营商
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key.toLowerCase() === 'l') { // Shift + L 触发
            promptUserCredentials();
        }
    });

    // 执行登录逻辑
    function executeLogin() {
        if (!CONFIG.account || !CONFIG.password) {
            if (!promptUserCredentials()) {
                console.log("用户取消了登录");
                return;
            }
        }

        setTimeout(() => {
            console.log("登录框存在");
            login();

            setTimeout(() => {
                const backButton = document.querySelector(SELECTORS.backButton);
                if (backButton && backButton.value === "返  回") {
                    console.log("存在返回按钮，立即返回，并执行登录操作");
                    backButton.click();
                    login();
                }
                console.log("登录成功");
            }, 1000);
        }, 300);
    }

    // 检查并执行登录
    window.addEventListener('load', executeLogin);
})();

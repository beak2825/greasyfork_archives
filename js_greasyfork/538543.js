// ==UserScript==
// @name         AWS 自动登录
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  自动填写 AWS 账号 ID、子账号名、密码，自动点击登录
// @author       Ganlv
// @match        https://*.aws.amazon.com/*
// @icon         https://aws.amazon.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538543/AWS%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/538543/AWS%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_registerMenuCommand(
        "设置AWS账号和用户名密码",
        function () {
            const accountId = prompt("请输入 AWS 账号 ID （12 位数字）（提交空内容则会删除已保存的用户名密码）：", GM_getValue("account_id", ""));
            if (accountId === null) {
                return;
            }
            if (accountId === '') {
                GM_deleteValue("account_id");
                GM_deleteValue("username");
                GM_deleteValue("password");
                alert("账号 ID、用户名密码已删除");
                return;
            }
            if (!/^\d{12}$/.test(accountId)) {
                alert("账号 ID 必须是 12 位数字");
                return;
            }
            const username = prompt("请输入用户名：", GM_getValue("username", ""));
            if (username === null) {
                return;
            }
            if (username === '') {
                alert("用户名不能为空");
                return;
            }
            const password = prompt("请输入密码：", "");
            if (password === null) {
                return;
            }
            if (password === '') {
                alert("密码不能为空");
                return;
            }
            GM_setValue("account_id", accountId);
            GM_setValue("username", username);
            GM_setValue("password", password);
            alert("用户名和密码已保存！");
        },
    );

    (async () => {
        if (!location.href.includes('/oauth')) {
            return;
        }
        const accountId = GM_getValue("account_id", "");
        const username = GM_getValue("username", "");
        const password = GM_getValue("password", "");
        if (!accountId || !username || !password) {
            console.log("AWS 自动登录的用户名或密码为空，请先设置用户名和密码。");
            return;
        }
        for (let i = 0; i < 100; i++) {
            const elAccount = document.querySelector('input[name="account"]');
            const elUsername = document.querySelector('input[name="username"]');
            const elPassword = document.querySelector('input[name="password"]');
            const elSignInButton = document.querySelector('#signin_button');
            if (elAccount && elUsername && elPassword && elSignInButton) {
                elAccount.value = accountId;
                elUsername.value = username;
                elPassword.value = password;
                if (Object.keys(elAccount).some(key => key.startsWith('__reactProps'))) {
                    Object.entries(elAccount).find(([key, value]) => key.startsWith('__reactProps'))[1].onChange({target: elAccount});
                    Object.entries(elUsername).find(([key, value]) => key.startsWith('__reactProps'))[1].onChange({target: elUsername});
                    Object.entries(elPassword).find(([key, value]) => key.startsWith('__reactProps'))[1].onChange({target: elPassword});
                } else {
                    elAccount.dispatchEvent(new Event('input', {bubbles: true}));
                    elUsername.dispatchEvent(new Event('input', {bubbles: true}));
                    elPassword.dispatchEvent(new Event('input', {bubbles: true}));
                }
                elSignInButton.click();
                break;
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    })();
})();
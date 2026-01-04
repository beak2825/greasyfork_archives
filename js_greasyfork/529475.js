// ==UserScript==
// @name         km AutoLogin
// @namespace    http://github.com/Emokui/Sukuna
// @version      1.02
// @description  快猫短视频自动登录
// @author       𝙁𝙖𝙩𝙖𝙡𝙚𝙫𝙚𝙡
// @match        https://4b55n57.xyz/km/*
// @match        https://km.ygking.site/km/*
// @match        https://km.hk.dedyn.io/km/*
// @match        https://kmsvip.pages.dev/km/*
// @match        http://23.225.181.59/km/*
// @match        https://24y2if5.xyz/km/*
// @match        https://i4433b6.xyz/km/*
// @match        https://kmsvip.xyz/km/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529475/km%20AutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/529475/km%20AutoLogin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 可编辑的账号和密码
    const ACCOUNT = '你的账号';
    const PASSWORD = '你的密码';

    const fillCredentials = () => {
        const inputAccount = document.querySelector('div.login-account input[type="text"][placeholder="请输入账号（邮箱）"]');
        const inputPassword = document.querySelector('div.login-account input[type="password"][placeholder="请输入密码"]');
        const loginButton = document.querySelector('div.buttonbox');

        if (inputAccount && inputPassword && loginButton) {
            inputAccount.value = ACCOUNT;
            inputAccount.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            inputAccount.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

            inputPassword.value = PASSWORD;
            inputPassword.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            inputPassword.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true }));

            loginButton.click();
        }
    };

    // 使用 MutationObserver 监听 DOM 变化，确保自动填充
    const observer = new MutationObserver(() => {
        fillCredentials();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    console.log('自动登录脚本已加载');
})();
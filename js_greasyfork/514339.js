// ==UserScript==
// @name         Auto Login Script Example
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填写用户名和密码并登录
// @author       你
// @match        https://example.com/login  // 将此URL替换为实际的登录页面地址
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/514339/Auto%20Login%20Script%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/514339/Auto%20Login%20Script%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 输入用户名和密码
        const username = 'yourUsername';  // 替换为实际用户名
        const password = 'yourPassword';  // 替换为实际密码

        // 查找用户名和密码输入框以及登录按钮
        const usernameInput = document.querySelector('input[name="username"]'); // 替换为实际的用户名输入框选择器
        const passwordInput = document.querySelector('input[name="password"]'); // 替换为实际的密码输入框选择器
        const loginButton = document.querySelector('button[type="submit"]');    // 替换为实际的登录按钮选择器

        // 填写用户名和密码
        if (usernameInput && passwordInput) {
            usernameInput.value = username;
            passwordInput.value = password;
        }

        // 点击登录按钮
        if (loginButton) {
            loginButton.click();
        }
    });
})();

// ==UserScript==
// @name         腾讯企业邮箱自动登录
// @description  自动登录腾讯企业邮箱
// @version      1.0
// @match        https://exmail.qq.com/login
// @license      MIT
// @namespace https://greasyfork.org/users/1292046
// @downloadURL https://update.greasyfork.org/scripts/517888/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/517888/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const username = "请在脚本编辑器中编辑账号"; // 替换为你的账号
    const password = "请在脚本编辑器中编辑账号"; // 替换为你的密码

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    async function autoLogin() {
        try {
            const otherLoginButton = document.querySelector('.js_show_other_panel');
            if (otherLoginButton) {
                otherLoginButton.click();
                await delay(100);
            }

            const accountPasswordButton = document.querySelector('.js_show_pwd_panel');
            if (accountPasswordButton) {
                accountPasswordButton.click();
                await delay(100);
            }

            const usernameInput = document.querySelector('#inputuin');
            if (usernameInput) {
                usernameInput.value = username;
            }

            const passwordInput = document.querySelector('#pp');
            if (passwordInput) {
                passwordInput.value = password;
            }

            const loginButton = document.querySelector('#btlogin');
            if (loginButton) {
                loginButton.click();
            }
        } catch (error) {
            console.error('自动登录过程中发生错误:', error);
        }
    }

    window.addEventListener('load', () => {
        autoLogin();
    });
})();

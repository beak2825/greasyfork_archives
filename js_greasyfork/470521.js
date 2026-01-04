// ==UserScript==
// @name         CasAutoLogin
// @version      0.1
// @description  Cas 自动登录
// @author       zwang57
// @home-url     https://greasyfork.org/zh-CN/scripts/470521-casautologin
// @match        *://cas.ctripcorp.com/caso/login.html*
// @match        *://cas.ctripcorp.com/caso/login_en.html*
// @match        *://cas.uat.qa.nt.ctripcorp.com/caso/login.html*
// @match        *://cas.uat.qa.nt.ctripcorp.com/caso/login_en.html*
// @match        *://cas.fat358.qa.nt.ctripcorp.com/caso/login.html*
// @match        *://cas.fat358.qa.nt.ctripcorp.com/caso/login_en.html*
// @match        *://cas.intranet.infosec.uat.qa.nt.ctripcorp.com/login_en.html*
// @match        *://cas.intranet.infosec.ctripcorp.com/login_en.html*
// @match        *://cas.intranet.fat358.qa.nt.ctripcorp.com/login_en.html*
// @match        *://cas.intranet.infosec.uat.qa.nt.ctripcorp.com/login.html*
// @match        *://cas.intranet.infosec.ctripcorp.com/login.html*
// @match        *://cas.intranet.fat358.qa.nt.ctripcorp.com/login.html*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1069332
// @downloadURL https://update.greasyfork.org/scripts/470521/CasAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/470521/CasAutoLogin.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        // 页面加载完成后执行的代码
        var usernameButton = document.querySelector('div[class="login-tab clearfix"] div:nth-child(1)');
        usernameButton.click();
        var timer = setInterval(function () {
            var usernameInput = document.querySelector(`#username`);
            var passwordInput = document.querySelector(`#password`);
            var loginButton = document.querySelector('input.account-button.login-common-button');
            if (usernameInput.value && passwordInput.value) {
                clearInterval(timer);
                // 密码已经填充，可以开始执行后续操作
                console.log('输入框有内容：' + usernameInput.value);
                loginButton.click();
            } else {
                console.log('输入框没有内容');
            }
        }, 500);

        setTimeout(function () {
            clearInterval(timer);
            // 超时时间到，密码没有填充
            console.log('用户名密码没有填充');
        }, 9000);

    };


})();


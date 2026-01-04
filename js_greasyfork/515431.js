// ==UserScript==
// @name         南阳师范学院校园网自动登陆
// @namespace    http://tampermonkey.net/
// @version      2024-06-12
// @description  try to take over the world!  auto login!!!
// @author       XiaoNing
// @match        http://211.84.144.202/eportal/index.jsp?wlanuserip=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/515431/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/515431/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let account = localStorage.getItem('account');
    let password = localStorage.getItem('password');

    if (!account || !password) {
        account = prompt('请输入账号：');
        password = prompt('请输入密码：');
        if (account && password) {
            localStorage.setItem('account', account);
            localStorage.setItem('password', password);
        } else {
            alert('账号或密码不能为空！');
            return; // 如果没有输入账号或密码，退出脚本
        }
    }


    var usernameInput = document.querySelector("#username");
    var passwordInput = document.querySelector("#pwd");
    var loginButton = document.querySelector("#loginLink");

    function autologin() {
        if (usernameInput && passwordInput && loginButton) {
            usernameInput.value = account;
            passwordInput.value = password;
            loginButton.click();
        }
    }

    function checkLoginStatus() {

        var errorElement = document.querySelector("#error_span_content");
        if (errorElement) {
            handleLoginFailure();
        } else {
            handleLoginSuccess();
        }
    }

    function handleLoginSuccess() {
        console.log('登录成功！');
    }

    function handleLoginFailure() {
        localStorage.removeItem('account');
        localStorage.removeItem('password');
        alert('登录失败，请重新输入账号和密码！');
        account = prompt('请输入账号：');
        password = prompt('请输入密码：');
        if (account && password) {
            localStorage.setItem('account', account);
            localStorage.setItem('password', password);
            autologin();
        } else {
            alert('账号或密码不能为空！');
        }
    }


    loginButton.addEventListener('click', function() {
        setTimeout(checkLoginStatus, 2000);
    });

    window.addEventListener('load', autologin);
})();
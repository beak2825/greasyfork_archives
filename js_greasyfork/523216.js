// ==UserScript==
// @name         厦大自动登录助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically click the login link if it contains a specific URL or QR login type
// @author       pydroid
// @match        *://*.xmu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523216/%E5%8E%A6%E5%A4%A7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523216/%E5%8E%A6%E5%A4%A7%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 需要自动点击的链接的部分
    const targetUrl = "ids.xmu.edu.cn/authserver/login?service";

    // 自动点击目标链接
    function clickTargetLink() {
        // 查找所有链接
        const links = document.querySelectorAll('a');

        // 查找并点击所有符合目标 URL 的链接
        links.forEach(link => {
            if (link.href.includes(targetUrl)) {
                link.click();
            }
        });
    }

    // 每 0.2 秒检查一次 URL 是否包含 'login?type=qrLogin'
    setInterval(() => {
        if (window.location.href.includes('login?type=qrLogin')) {
            // 查找并点击包含指定 ID 的 span 内的链接
            const accountLoginSpan = document.getElementById('pwdLoginSpan');
            if (accountLoginSpan) {
                const accountLoginLink = accountLoginSpan.querySelector('a');
                if (accountLoginLink) {
                    accountLoginLink.click();
                    //document.querySelector('#login_submit.lang_text_ellipsis').click();
                }
            }
        }

    }, 200); // 200 毫秒

    // 初始检查以点击目标链接
    clickTargetLink();

    // 添加键盘按键事件监听器
    document.addEventListener('keydown', function () {
        triggerLoginClick();
    });

    // 添加鼠标点击事件监听器
    document.addEventListener('click', function () {
        triggerLoginClick();
    });

    // 触发登录按钮点击的函数
    function triggerLoginClick() {
        // 模拟点击按钮
        let loginButton = document.getElementById('login_submit') || document.getElementById('login') || document.getElementById('ampHasNoLogin');
        if (loginButton) {
            loginButton.click();
        } else {
            console.warn('Login button not found!');
        }
    }

    document.getElementById('ampHasNoLogin').click();

})();

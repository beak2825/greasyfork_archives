// ==UserScript==
// @name         91视频登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动完成QQ网页版登录
// @match        https://xui.ptlogin2.qq.com/*
// @match        https://qzone.qq.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/535911/91%E8%A7%86%E9%A2%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/535911/91%E8%A7%86%E9%A2%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        username: '您的QQ号', // 建议首次使用后改为通过菜单设置
        password: '您的密码',
        checkInterval: 1000
    };

    // 安全存储凭证（可选）
    GM_registerMenuCommand("设置QQ号", () => {
        config.username = prompt("请输入QQ号：", config.username);
        GM_setValue('qq_username', config.username);
    });

    GM_registerMenuCommand("设置密码", () => {
        config.password = prompt("请输入密码：", config.password);
        GM_setValue('qq_password', config.password);
    });

    // 主登录函数
    function autoLogin() {
        // 切换到登录框架
        const loginFrame = document.querySelector('#login_frame');
        if (!loginFrame) return;

        const frameDoc = loginFrame.contentDocument || loginFrame.contentWindow.document;

        // 切换至账号密码登录
        const switchBtn = frameDoc.querySelector('#switcher_plogin');
        if (switchBtn) switchBtn.click();

        // 填充登录信息
        const usernameInput = frameDoc.querySelector('#u');
        const passwordInput = frameDoc.querySelector('#p');
        const submitBtn = frameDoc.querySelector('#login_button');

        if (usernameInput && passwordInput) {
            usernameInput.value = GM_getValue('qq_username') || config.username;
            passwordInput.value = GM_getValue('qq_password') || config.password;

            // 触发React事件处理
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            // 提交登录
            setTimeout(() => {
                submitBtn.click();
                handleCaptcha();
            }, 500);
        }
    }

    // 验证码处理
    function handleCaptcha() {
        const captchaFrame = document.querySelector('#tcaptcha_iframe');
        if (captchaFrame) {
            const confirm = window.confirm('需要手动完成滑块验证，完成后点击确定');
            if (confirm) location.reload();
        }
    }

    // 初始化检测
    let attempts = 0;
    const initCheck = setInterval(() => {
        if (document.readyState === 'complete') {
            autoLogin();
            if (++attempts > 5) clearInterval(initCheck);
        }
    }, config.checkInterval);
})();
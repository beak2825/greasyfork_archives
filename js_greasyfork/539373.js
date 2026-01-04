// ==UserScript==
// @name         华理邮箱自动登录
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  华东理工大学学生邮箱ecustmail自动登录
// @author       TheOrder
// @match        https://stu.mail.ecust.edu.cn/*
// @icon         
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539373/%E5%8D%8E%E7%90%86%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/539373/%E5%8D%8E%E7%90%86%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息 - 替换为你的实际账号密码
    const CONFIG = {
        username: "账号",
        password: "密码",
        delay: 1000, // 页面加载后等待的时间(毫秒)
        checkInterval: 500, // 检查表单是否加载完成的间隔(毫秒)
        maxAttempts: 20 // 最大尝试次数
    };

    // 等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(tryToLogin, CONFIG.delay);
    });

    // 尝试登录函数
    function tryToLogin(attempt = 1) {
        // 检查表单元素是否存在
        const accountInput = document.getElementById('account_name');
        const passwordInput = document.getElementById('password');
        const submitButton = document.getElementById('submit-btn');
        const loginForm = document.getElementById('loginform');

        // 如果所有必要元素都存在，执行登录
        if (accountInput && passwordInput && (submitButton || loginForm)) {
            console.log("找到登录表单，开始自动登录...");

            // 直接设置表单值
            accountInput.value = CONFIG.username;
            passwordInput.value = CONFIG.password;

            // 触发必要的事件以确保前端验证通过
            ['input', 'change'].forEach(eventName => {
                accountInput.dispatchEvent(new Event(eventName, { bubbles: true }));
                passwordInput.dispatchEvent(new Event(eventName, { bubbles: true }));
            });

            // 尝试直接调用登录函数
            if (typeof frmvalidator === 'function') {
                console.log("调用登录函数...");
                frmvalidator();
                return;
            }

            // 如果有提交按钮，点击它
            if (submitButton) {
                console.log("点击提交按钮...");
                submitButton.click();
                return;
            }

            // 否则直接提交表单
            if (loginForm) {
                console.log("直接提交表单...");
                loginForm.submit();
            }

            return;
        }

        // 如果元素不存在但未达到最大尝试次数，继续尝试
        if (attempt < CONFIG.maxAttempts) {
            console.log(`未找到完整的登录表单，第 ${attempt} 次尝试...`);
            setTimeout(() => tryToLogin(attempt + 1), CONFIG.checkInterval);
        } else {
            console.error("无法找到登录表单，自动登录失败");
        }
    }
})();

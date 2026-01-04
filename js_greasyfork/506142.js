// ==UserScript==
// @name         NEU Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto login to NEU portal
// @author       FutureoO
// @match        *://*.neu.edu.cn/*
// @icon         https://www.neu.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506142/NEU%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/506142/NEU%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换成你的用户名和密码
    const username = '666';
    const password = '666';

    /**
     * 执行登录操作的函数
     * @param {boolean} withDelay - 是否在执行登录操作前添加延迟（仅在父级界面跳转后使用）
     */
    function performLogin(withDelay = false) {
        // 获取用户名输入框、密码输入框和登录按钮
        const usernameInput = document.querySelector('#un') || document.querySelector('#username');
        const passwordInput = document.querySelector('#pd') || document.querySelector('#password');
        const loginButton = document.querySelector('#index_login_btn') || document.querySelector('#login-account');

        // 检查输入框和按钮是否存在
        if (usernameInput && passwordInput && loginButton) {
            if (withDelay) {
                // 如果需要延迟（适用于从父级界面跳转后的情况），延迟1000毫秒再执行
                setTimeout(() => {
                    // 填写用户名和密码
                    usernameInput.value = username;
                    passwordInput.value = password;
                    // 点击登录按钮
                    loginButton.click();
                }, 1000);  // 延迟1000毫秒
            } else {
                // 直接执行登录操作（适用于直接进入子级登录界面的情况）
                usernameInput.value = username;
                passwordInput.value = password;
                loginButton.click();
            }
        } else {
            // 如果未找到输入框或按钮，输出错误信息
            console.log('未找到登录元素.');
        }
    }

    /**
     * 处理统一身份认证（SSO）重定向的函数
     */
    function handleSSO() {
        // 查找“统一身份认证登录”按钮
        const ssoButton = document.querySelector('#login-sso');
        if (ssoButton) {
            // 如果找到该按钮，模拟点击
            ssoButton.click();

            // 使用MutationObserver观察页面跳转后的变化
            const observer = new MutationObserver((mutations, observer) => {
                // 跳转后查找用户名和密码输入框
                const usernameInput = document.querySelector('#un') || document.querySelector('#username');
                const passwordInput = document.querySelector('#pd') || document.querySelector('#password');
                if (usernameInput && passwordInput) {
                    // 如果输入框已加载，停止观察并执行登录操作（带延迟）
                    observer.disconnect(); // 停止观察
                    performLogin(true); // 执行延迟登录
                }
            });

            // 观察整个文档的子元素和子树的变化
            observer.observe(document, { childList: true, subtree: true });
        } else {
            // 如果直接进入子级登录界面，立即执行登录操作（无延迟）
            performLogin();
        }
    }

    /**
     * 插入或重新插入悬浮按钮的函数
     */
    function insertButton() {
        // 查找是否已经存在该按钮
        let button = document.querySelector('#autoLoginButton');
        if (!button) {
            // 如果按钮不存在，则创建并设置其样式和属性
            button = document.createElement('button');
            button.id = 'autoLoginButton';
            button.textContent = 'Auto Login';
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.right = '10px';
            button.style.zIndex = '9999';
            button.style.padding = '10px';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            // 添加点击事件监听器，点击按钮时执行SSO处理
            button.addEventListener('click', handleSSO);
            // 将按钮插入到文档的顶层元素
            document.documentElement.appendChild(button);
        }
    }

    /**
     * 监视DOM变化以确保按钮始终存在的函数
     */
    function monitorDOM() {
        // 使用MutationObserver监视整个文档的变化
        const observer = new MutationObserver(() => {
            // 如果发生变化，重新插入按钮
            insertButton();
        });
        // 监视文档元素的子节点和子树的变化
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    // 在页面开始加载时执行脚本逻辑
    window.addEventListener('DOMContentLoaded', function() {
        // 插入按钮并启动DOM监视
        insertButton();
        monitorDOM();
    });

    // 定期检查按钮是否存在，必要时重新插入
    setInterval(insertButton, 500);

})();
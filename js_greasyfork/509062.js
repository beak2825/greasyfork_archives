// ==UserScript==
// @name         Crawlab 自动登录
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  自动登录 Crawlab
// @match        http://your-crawlab-address/#/login
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/509062/Crawlab%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/509062/Crawlab%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// 注意：请在 Tampermonkey 的脚本设置中的 "用户包含" / "User includes" 部分
// 添加您的 Crawlab 地址的匹配规则，例如：*://your-crawlab-address:port/*

(function() {
    'use strict';

    // 获取当前域名
    const currentDomain = window.location.hostname;

    // 获取用户名和密码
    let username = GM_getValue(`crawlab_username_${currentDomain}`, '');
    let password = GM_getValue(`crawlab_password_${currentDomain}`, '');

    console.log(`Crawlab 自动登录脚本已加载 (域名: ${currentDomain})`);

    let indicator = null;

    // 创建一个视觉指示器
    function createIndicator(message, backgroundColor = 'yellow') {
        if (indicator) return;
        indicator = document.createElement('div');
        indicator.textContent = message;
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.right = '10px';
        indicator.style.backgroundColor = backgroundColor;
        indicator.style.padding = '5px';
        indicator.style.borderRadius = '5px';
        indicator.style.zIndex = '9999';
        document.body.appendChild(indicator);
    }

    // 移除视觉指示器
    function removeIndicator() {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
            indicator = null;
        }
    }

    // 模拟用户输入
    function simulateUserInput(element, value) {
        if (!element) return;
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 等待元素加载
    function waitForElement(selector, callback, maxTries = 20, interval = 500) {
        let tries = 0;
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (tries < maxTries) {
                tries++;
                setTimeout(checkElement, interval);
            } else {
                console.error(`未找到元素: ${selector}`);
                removeIndicator();
            }
        };
        checkElement();
    }

    // 主函数
    function autoLogin() {
        if (!window.location.hash.includes('#/login')) {
            console.log('不在登录页面，脚本不执行');
            removeIndicator();
            return;
        }

        if (!username || !password) {
            console.log('用户名或密码未设置，请先设置');
            createIndicator('请先设置用户名和密码', 'orange');
            return;
        }

        console.log('开始自动登录过程');
        createIndicator('自动登录脚本正在运行');

        waitForElement('input[name="username"]', (usernameInput) => {
            simulateUserInput(usernameInput, username);
            console.log('用户名已填充');

            waitForElement('input[name="password"]', (passwordInput) => {
                simulateUserInput(passwordInput, password);
                console.log('密码已填充');

                waitForElement('button.el-button--primary', (loginButton) => {
                    console.log('找到登录按钮，尝试点击');
                    setTimeout(() => {
                        try {
                            loginButton.click();
                            console.log('已点击登录按钮');
                        } catch (error) {
                            console.error('点击登录按钮时出错:', error);
                        }
                        removeIndicator();
                    }, 1000);
                });
            });
        });
    }

    // 监听 URL 变化
    function checkUrl() {
        if (window.location.hash.includes('#/login')) {
            setTimeout(autoLogin, 1000); // 延迟执行自动登录
        } else {
            removeIndicator();
        }
    }

    // 设置用户名和密码
    function setCredentials() {
        const newUsername = prompt('请输入用户名:', username);
        if (newUsername !== null) {
            username = newUsername;
            GM_setValue(`crawlab_username_${currentDomain}`, username);
        }

        const newPassword = prompt('请输入密码:', password);
        if (newPassword !== null) {
            password = newPassword;
            GM_setValue(`crawlab_password_${currentDomain}`, password);
        }

        if (username && password) {
            alert(`用户名和密码已更新 (域名: ${currentDomain})`);
            removeIndicator();
            autoLogin(); // 设置完成后尝试自动登录
        } else {
            createIndicator('用户名或密码未设置，请重新设置', 'orange');
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand('设置用户名和密码', setCredentials);

    // 在页面加载完成后执行自动登录
    if (document.readyState === 'complete') {
        checkUrl();
    } else {
        window.addEventListener('load', checkUrl);
    }

    // 监听 hash 变化
    window.addEventListener('hashchange', checkUrl);
})();

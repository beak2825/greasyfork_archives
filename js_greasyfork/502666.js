// ==UserScript==
// @name         通用网站登录状态保存和恢复（增强版）
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  手动保存网站的登录状态，自动恢复登录，适用于绝大多数网站，包括复杂的登录系统
// @author       Hayden
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502666/%E9%80%9A%E7%94%A8%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81%E4%BF%9D%E5%AD%98%E5%92%8C%E6%81%A2%E5%A4%8D%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/502666/%E9%80%9A%E7%94%A8%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81%E4%BF%9D%E5%AD%98%E5%92%8C%E6%81%A2%E5%A4%8D%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2023 Hayden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const currentURL = window.location.origin;
    let savedSites = GM_getValue('savedLoginSites', {});

    // 通用登录状态检查
    function isLoggedIn() {
        // 检查常见的登录标识
        if (document.cookie.includes('user_id') || 
            document.cookie.includes('session') || 
            document.cookie.includes('token') ||
            localStorage.getItem('user') ||
            sessionStorage.getItem('auth')) {
            return true;
        }

        // 检查页面元素
        const logoutButton = document.querySelector('a[href*="logout"], button:contains("退出"), .logout-btn');
        const userInfo = document.querySelector('.user-info, .avatar, .profile');
        
        // 针对阿里云IDE的特殊检查
        if (window.location.hostname.includes('aliyun.com')) {
            return !!document.querySelector('.ide-header-user-info');
        }

        return !!(logoutButton || userInfo);
    }

    // 保存登录状态
    function saveLoginState() {
        const state = {
            cookies: document.cookie,
            localStorage: JSON.stringify(localStorage),
            sessionStorage: JSON.stringify(sessionStorage),
            timestamp: Date.now()
        };

        savedSites[currentURL] = state;
        GM_setValue('savedLoginSites', savedSites);
        console.log('登录状态已保存');
        updateToggleButton();
    }

    // 应用登录状态
    function applyLoginState() {
        const savedState = savedSites[currentURL];
        if (!savedState) return false;

        // 应用 cookies
        document.cookie = savedState.cookies;

        // 应用 localStorage
        const localData = JSON.parse(savedState.localStorage);
        for (let key in localData) {
            localStorage.setItem(key, localData[key]);
        }

        // 应用 sessionStorage
        const sessionData = JSON.parse(savedState.sessionStorage);
        for (let key in sessionData) {
            sessionStorage.setItem(key, sessionData[key]);
        }

        console.log('尝试恢复登录状态');
        return true;
    }

    // 高级登录尝试
    function advancedLoginAttempt() {
        // 针对阿里云IDE的特殊处理
        if (window.location.hostname.includes('aliyun.com')) {
            // 尝试直接跳转到IDE页面
            window.location.href = 'https://ide2-cn-shenzhen.data.aliyun.com/?defaultProjectId=9978';
            return true;
        }

        // 模拟表单提交
        const loginForm = document.querySelector('form[action*="login"]');
        if (loginForm) {
            const usernameField = loginForm.querySelector('input[name*="user"], input[name*="email"]');
            const passwordField = loginForm.querySelector('input[type="password"]');
            const submitButton = loginForm.querySelector('input[type="submit"], button[type="submit"]');

            if (usernameField && passwordField && submitButton) {
                usernameField.value = savedSites[currentURL].username;
                passwordField.value = savedSites[currentURL].password;
                submitButton.click();
                return true;
            }
        }

        // 尝试执行登录相关的JavaScript函数
        if (typeof unsafeWindow.login === 'function') {
            unsafeWindow.login(savedSites[currentURL].username, savedSites[currentURL].password);
            return true;
        }

        return false;
    }

    // 主函数
    function main() {
        if (!isLoggedIn() && savedSites[currentURL]) {
            if (applyLoginState()) {
                setTimeout(() => {
                    if (!isLoggedIn()) {
                        if (!advancedLoginAttempt()) {
                            console.log('自动登录失败，可能需要手动操作');
                        }
                    }
                }, 2000);
            }
        }
    }

    // 移除当前网站的保存状态
    function removeCurrentSite() {
        if (savedSites[currentURL]) {
            delete savedSites[currentURL];
            GM_deleteValue(currentURL);
            console.log('已移除当前网站的保存状态');
            GM_setValue('savedLoginSites', savedSites);
            updateToggleButton();
        }
    }

    // 创建操作按钮
    function createActionButtons() {
        const saveButton = document.createElement('button');
        saveButton.id = 'login-state-save';
        saveButton.textContent = '保存登录状态';
        saveButton.style.position = 'fixed';
        saveButton.style.bottom = '50px';
        saveButton.style.right = '10px';
        saveButton.style.zIndex = '9999';
        saveButton.style.padding = '5px 10px';
        saveButton.style.fontSize = '12px';
        saveButton.style.border = '1px solid #ccc';
        saveButton.style.borderRadius = '3px';
        saveButton.style.cursor = 'pointer';
        saveButton.style.background = '#4d79ff';
        saveButton.style.color = 'white';
        saveButton.addEventListener('click', saveLoginState);
        document.body.appendChild(saveButton);

        const removeButton = document.createElement('button');
        removeButton.id = 'login-state-remove';
        removeButton.textContent = '移除保存状态';
        removeButton.style.position = 'fixed';
        removeButton.style.bottom = '10px';
        removeButton.style.right = '10px';
        removeButton.style.zIndex = '9999';
        removeButton.style.padding = '5px 10px';
        removeButton.style.fontSize = '12px';
        removeButton.style.border = '1px solid #ccc';
        removeButton.style.borderRadius = '3px';
        removeButton.style.cursor = 'pointer';
        removeButton.style.background = '#ff4d4d';
        removeButton.style.color = 'white';
        removeButton.addEventListener('click', removeCurrentSite);
        document.body.appendChild(removeButton);

        updateToggleButton();
    }

    // 更新按钮状态
    function updateToggleButton() {
        const saveButton = document.getElementById('login-state-save');
        const removeButton = document.getElementById('login-state-remove');
        
        if (savedSites[currentURL]) {
            if (saveButton) saveButton.style.display = 'none';
            if (removeButton) removeButton.style.display = 'block';
        } else {
            if (saveButton) saveButton.style.display = 'block';
            if (removeButton) removeButton.style.display = 'none';
        }
    }

    // 显示已保存的网站列表
    function showSavedSites() {
        let siteList = '已保存的网站列表：\n\n';
        for (let site in savedSites) {
            siteList += `${site}\n`;
        }
        alert(siteList);
    }

    // 注册油猴菜单命令
    GM_registerMenuCommand("查看已保存的网站", showSavedSites);

    // 运行主函数
    main();

    // 创建操作按钮
    createActionButtons();

    // 监听页面变化，可能是单页应用导航
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            main();
            updateToggleButton();
        }
    }).observe(document, {subtree: true, childList: true});
})();
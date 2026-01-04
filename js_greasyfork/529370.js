// ==UserScript==
// @name         Fort Login Automation Suite
// @namespace    http://tampermonkey.net/
// @version      3.2.3
// @description  自动登录 Fort 系统, 提供密码管理功能, 增加网页保活, 优化复制提示
// @author       Ryan (部分功能由AI助手协助)
// @match        https://21.21.21.36:9443/fort/login
// @match        https://21.21.21.36:9443/fort/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529370/Fort%20Login%20Automation%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/529370/Fort%20Login%20Automation%20Suite.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Ryan

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

    /* ===== 用户可自定义配置（仅适用于自动登录功能） =====
       修改下面的 AUTOLOGIN_USERNAME 和 AUTOLOGIN_PASSWORD 以适配您的登录信息
    ====================================================== */
    const AUTOLOGIN_USERNAME = 'RTG8';
    const AUTOLOGIN_PASSWORD = 'Matrix@501123';

    // 自动登录功能——仅在 /fort/login 页面生效
    if (window.location.pathname === '/fort/login') {

        // 等待页面元素加载的函数，无延迟
        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else {
                requestAnimationFrame(() => waitForElement(selector, callback));
            }
        }
        // 模拟输入的函数
        function simulateInput(element, value, callback) {
            let index = 0;
            function inputNextChar() {
                if (index < value.length) {
                    element.value += value[index];
                    element.dispatchEvent(new Event('input')); // 触发输入事件
                    index++;
                    setTimeout(inputNextChar, 100); // 设置延迟模拟输入
                } else if (callback) {
                    callback(); // 输入完成后调用回调
                }
            }
            inputNextChar(); // 开始模拟输入
        }
        // 强制点击登录按钮
        function forceClickLogin() {
            const loginButton = document.querySelector('#do_login');
            if (loginButton) {
                loginButton.click(); // 自动点击登录按钮
                console.log("Login button clicked");
            } else {
                console.log("Login button not found");
            }
        }
        // 填写表单的函数并自动点击登录
        function autoFillAndLogin() {
            // 选择登录方式为 2
            waitForElement('#loginMethod', function(loginMethodElement) {
                loginMethodElement.value = '2'; // 设置登录方式为 2
                loginMethodElement.dispatchEvent(new Event('change')); // 触发选择框变化
            });
            // 填充用户名
            waitForElement('#username', function(usernameField) {
                usernameField.focus(); // 确保用户名框聚焦
                setTimeout(() => {
                    simulateInput(usernameField, AUTOLOGIN_USERNAME, function() {
                        console.log("Username set: ", usernameField.value);
                        usernameField.dispatchEvent(new Event('blur')); // 触发失焦事件以确保输入完成
                        // 填充密码
                        waitForElement('#tUserLock', function(passwordField) {
                            passwordField.focus(); // 确保密码框聚焦
                            setTimeout(() => {
                                simulateInput(passwordField, AUTOLOGIN_PASSWORD, function() {
                                    console.log("Password set");
                                    passwordField.dispatchEvent(new Event('blur')); // 触发失焦事件以确保输入完成
                                    forceClickLogin(); // 自动点击登录
                                });
                            }, 100); // 增加延迟以确保聚焦生效
                        });
                    });
                }, 100); // 增加延迟以确保聚焦生效
            });
        }
        // 立即执行表单自动填充并登录
        autoFillAndLogin();
    }

    // 密码面板功能, 网页保活功能, 浮动提示功能 —— 在 /fort/* 页面中除 /fort/login 页面外生效
    if (window.location.pathname !== '/fort/login' && window.location.pathname.indexOf('/fort/') === 0) {

        // ===== 浮动提示功能 =====
        function showFloatingMessage(message, duration = 2000, isError = false) {
            const existingMessage = document.getElementById('gm-floating-message');
            if (existingMessage) {
                // 清除可能存在的旧的移除定时器，并立即移除
                if (existingMessage.removeTimer) clearTimeout(existingMessage.removeTimer);
                if (existingMessage.fadeTimer) clearTimeout(existingMessage.fadeTimer);
                existingMessage.remove();
            }

            const messageDiv = document.createElement('div');
            messageDiv.id = 'gm-floating-message';
            messageDiv.textContent = message;
            messageDiv.style.position = 'fixed';
            messageDiv.style.bottom = '30px';
            messageDiv.style.left = '50%';
            messageDiv.style.transform = 'translateX(-50%)';
            messageDiv.style.backgroundColor = isError ? 'rgba(220, 53, 69, 0.9)' : 'rgba(40, 167, 69, 0.9)'; // 错误用红色，成功用绿色 (Bootstrap danger/success like)
            messageDiv.style.color = 'white';
            messageDiv.style.padding = '12px 25px';
            messageDiv.style.borderRadius = '8px';
            messageDiv.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
            messageDiv.style.zIndex = '1000000'; // 确保在最上层
            messageDiv.style.fontSize = '14px';
            messageDiv.style.fontFamily = 'Arial, sans-serif';
            messageDiv.style.textAlign = 'center';
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.4s ease-in-out';

            document.body.appendChild(messageDiv);

            // 淡入
            requestAnimationFrame(() => { // 使用 rAF 确保元素已插入DOM并应用了初始样式
                messageDiv.style.opacity = '1';
            });

            // 设置淡出和移除的定时器
            messageDiv.fadeTimer = setTimeout(() => {
                messageDiv.style.opacity = '0';
                messageDiv.removeTimer = setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 400); // 等待淡出动画完成 (与过渡时间一致)
            }, duration);
        }
        // ========================

        // ==== 配置区：按名称（最后三位）升序排列的密码 ====
        const passwords = [
            { label: '229', value: 'matrix@MW1!229' },
            { label: '231', value: 'matrix@MW1!231' },
            { label: '232', value: 'matrix@MW1!232' },
            { label: '237', value: 'matrix@MW1!237' },
            { label: '238', value: 'matrix@MW1!238' },
            { label: '243', value: 'matrix@MW1!243' },
            { label: '252', value: 'matrix@MW1!252' },
            { label: '253', value: 'matrix@MW1!253' },
            { label: '254', value: 'matrix@MW1!254' },
            { label: '255', value: 'matrix@MW1!255' },
            { label: '155', value: 'Waisi@501' }
        ];
        // =============================================

        // ===== 网页保活功能 =====
        const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5分钟

        function sendHeartbeat() {
            console.log('Fort Keep-Alive: Sending heartbeat to', window.location.href);
            fetch(window.location.href, { method: 'GET', cache: 'no-store' })
                .then(response => {
                    if (response.ok) {
                        console.log('Fort Keep-Alive: Heartbeat successful. Status:', response.status);
                        if (response.redirected && response.url.includes('/fort/login')) {
                            console.warn('Fort Keep-Alive: Detected redirection to login page. Stopping heartbeats.');
                            if (heartbeatIntervalId) {
                                clearInterval(heartbeatIntervalId);
                            }
                            showFloatingMessage('会话已超时，请重新登录。保活已停止。', 5000, true);
                        }
                    } else {
                        console.warn('Fort Keep-Alive: Heartbeat request failed. Status:', response.status);
                        // 可以选择在这里也提示用户，或者停止心跳
                        // showFloatingMessage(`保活请求失败 (状态: ${response.status})`, 3000, true);
                    }
                })
                .catch(error => {
                    console.error('Fort Keep-Alive: Heartbeat error:', error);
                    // showFloatingMessage('保活请求网络错误', 3000, true);
                });
        }

        const heartbeatIntervalId = setInterval(sendHeartbeat, KEEP_ALIVE_INTERVAL);
        console.log(`Fort Keep-Alive: Service started. Heartbeat interval: ${KEEP_ALIVE_INTERVAL / 1000 / 60} minutes.`);
        // ========================


        // 密码面板创建
        if (document.getElementById('password-panel')) {
            console.log("密码面板已经存在，不需要再次创建");
        } else {
            function createPasswordPanel() {
                const bodyElement = document.getElementById('body1');
                if (!bodyElement) {
                    console.warn("Fort Script: Element with id 'body1' not found. Password panel cannot be created.");
                    return;
                }
                const container = document.createElement('div');
                container.id = 'password-panel';
                container.style.position = 'fixed';
                container.style.top = '50px';
                container.style.right = '20px';
                container.style.zIndex = '999999';
                container.style.background = 'rgba(0, 0, 0, 0.5)';
                container.style.padding = '10px';
                container.style.borderRadius = '5px';
                container.style.color = '#fff';
                container.style.fontFamily = 'Arial, sans-serif';
                container.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
                bodyElement.appendChild(container);

                passwords.forEach((password) => {
                    const button = document.createElement('button');
                    button.textContent = password.label;
                    button.style.margin = '5px';
                    button.style.padding = '8px';
                    button.style.backgroundColor = '#3498db';
                    button.style.border = 'none';
                    button.style.color = '#fff';
                    button.style.cursor = 'pointer';
                    button.style.borderRadius = '3px';
                    button.addEventListener('click', () => {
                        navigator.clipboard.writeText(password.value).then(() => {
                            showFloatingMessage(`密码 "${password.label}" 已复制!`);
                        }).catch((err) => {
                            console.error('无法复制到剪贴板: ', err);
                            showFloatingMessage(`复制失败: ${err.message}`, 3000, true);
                        });
                    });
                    container.appendChild(button);
                });
                console.log("密码面板已生成并插入 <body> 元素中");
            }
            createPasswordPanel();
        }
    }
})();

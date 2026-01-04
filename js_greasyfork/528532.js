// ==UserScript==
// @name         南昌工程学院自动登录（NIT）
// @namespace    http://tampermonkey.net/
// @version      v1.3
// @description  自动登录南昌工程学院校园网(NIT)
// @author       Yowaimono
// @match        https://eapp2.nit.edu.cn:9443/cas/login?service*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nit.edu.cn
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528532/%E5%8D%97%E6%98%8C%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88NIT%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528532/%E5%8D%97%E6%98%8C%E5%B7%A5%E7%A8%8B%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88NIT%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .nit-login-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 24px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: Arial, sans-serif;
        }
        .nit-login-popup h3 {
            margin: 0 0 16px;
            font-size: 18px;
            color: #333;
        }
        .nit-login-popup input {
            width: 100%;
            margin-bottom: 12px;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #ddd;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s ease;
        }
        .nit-login-popup input:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
        }
        .nit-login-popup button {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: none;
            background-color: #007bff;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .nit-login-popup button:hover {
            background-color: #0056b3;
        }
        .nit-login-popup .notice {
            font-size: 12px;
            color: #666;
            margin-bottom: 16px;
            text-align: center;
        }
    `);

    // 检查 localStorage 中是否已保存账号密码
    const username = localStorage.getItem('nit_username');
    const password = localStorage.getItem('nit_password');

    if (!username || !password) {
        // 创建弹窗界面
        createLoginPopup();
    } else {
        // 自动登录并等待重定向
        autoLogin();
    }

    // 创建登录弹窗
    function createLoginPopup() {
        // 创建弹窗 HTML
        const popupHTML = `
            <div class="nit-login-popup">
                <h3>南昌工程学院自动登录</h3>
                <div class="notice">初次使用需要输入账号密码</div>
                <input type="text" id="nit-username" placeholder="请输入用户名">
                <input type="password" id="nit-password" placeholder="请输入密码">
                <button id="nit-save-btn">保存并登录</button>
            </div>
        `;

        // 将弹窗插入到页面中
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // 绑定保存按钮点击事件
        const saveButton = document.getElementById('nit-save-btn');
        saveButton.addEventListener('click', () => {
            const usernameValue = document.getElementById('nit-username').value.trim();
            const passwordValue = document.getElementById('nit-password').value.trim();

            if (usernameValue && passwordValue) {
                // 保存账号密码到 localStorage
                localStorage.setItem('nit_username', usernameValue);
                localStorage.setItem('nit_password', passwordValue);
                // 关闭弹窗
                document.querySelector('.nit-login-popup').remove();
                // 自动登录
                autoLogin();
            } else {
                alert('请输入完整的账号和密码！');
            }
        });
    }

    // 自动登录
    function autoLogin() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const submitButton = document.querySelector('input[type="submit"]');

        if (usernameInput && passwordInput && submitButton) {
            // 填充账号和密码
            usernameInput.value = localStorage.getItem('nit_username');
            passwordInput.value = localStorage.getItem('nit_password');

           
            submitButton.click();
           
        } else {
            console.error('无法找到登录表单元素，请检查页面结构。');
        }
    }
})();

// MIT License
//
// Copyright (c) 2025 Yowaimono
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
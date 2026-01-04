// ==UserScript==
// @name         FZU JWCH Auto Login
// @namespace    https://greasyfork.org/zh-CN/users/1435250-linrongda
// @version      1.9.3
// @description  本脚本适用于福州大学教务处本科教学管理系统的验证登录
// @author       lrd
// @match        https://jwcjwxt2.fzu.edu.cn/login.htm
// @icon         https://www.fzu.edu.cn/__local/B/00/85/7E40A9947CCADB9BCCF7F6A8AA0_9BDD11BE_23796.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @connect      jwcjwxt2.fzu.edu.cn
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/526970/FZU%20JWCH%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/526970/FZU%20JWCH%20Auto%20Login.meta.js
// ==/UserScript==

/*
免责声明：
本脚本仅供个人学习和研究使用，作者不对使用此脚本造成的任何直接或间接后果负责。
用户应自行承担使用风险，并确保遵守相关网站的使用条款和法律法规。
本脚本不会上传用户的学号和密码，所有数据仅存储在本地。请勿在公共设备上使用，以免泄露个人信息。
*/

(function() {
    'use strict';

    // 创建悬浮界面
    function createFloatingUI() {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '200px';
        div.style.left = '20px';
        div.style.backgroundColor = '#f9f9f9';
        div.style.border = '1px solid #ddd';
        div.style.borderRadius = '8px';
        div.style.padding = '20px';
        div.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        div.style.zIndex = '10000';
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.color = '#333';
        div.style.width = '300px';
        div.style.transition = 'all 0.75s ease'; // 添加过渡效果
        div.innerHTML = `
            <h3 style="margin-top: 0; font-size: 18px; color: #333; margin-bottom: 15px;">首次使用，请输入学号和密码！</h3>
            <p style="font-size: 12px; color: #666;">本脚本不会上传学号和密码，这些数据均储存在本地！</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 15px;">请勿在公共设备上使用，以免泄露个人信息。</p>
            <p style="font-size: 10px; color: #ff0000; margin-bottom: 15px;">
                免责声明：本脚本仅供个人学习和研究使用，作者不对使用此脚本造成的任何直接或间接后果负责。用户应自行承担使用风险，并确保遵守相关网站的使用条款和法律法规。
            </p>
            <label for="username" style="display: block; font-size: 14px; margin-bottom: 5px;">学号：</label>
            <input type="text" id="username" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
            <label for="password" style="display: block; font-size: 14px; margin-bottom: 5px;">密码：</label>
            <input type="password" id="password" style="width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
            <button id="saveBtn" style="width: 100%; padding: 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; font-size: 14px; cursor: pointer;">保存</button>
        `;
        document.body.appendChild(div);

        // 保存按钮点击事件
        document.getElementById('saveBtn').addEventListener('click', () => {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username && password) {
                // 使用 GM_setValue 存储学号和密码
                GM_setValue('username', username);
                GM_setValue('password', password);
                showSuccess(div); // 显示成功效果
                setTimeout(() => {
                    div.remove(); // 关闭悬浮界面
                    autoLogin(); // 调用自动登录
                }, 1000); // 1秒后关闭悬浮界面
            } else {
                showError(); // 显示错误效果
            }
        });

        // 显示错误效果
        function showError() {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            // 抖动效果
            usernameInput.style.animation = 'shake 0.5s';
            passwordInput.style.animation = 'shake 0.5s';

            // 标红输入框
            usernameInput.style.borderColor = '#ff0000';
            usernameInput.style.backgroundColor = '#ffe6e6';
            passwordInput.style.borderColor = '#ff0000';
            passwordInput.style.backgroundColor = '#ffe6e6';

            // 动画结束后清除样式
            setTimeout(() => {
                usernameInput.style.animation = '';
                passwordInput.style.animation = '';
            }, 500);
        }

        // 显示成功效果
        function showSuccess(div) {
            // 显式设置初始高度
            div.style.height = `${div.offsetHeight}px`; // 获取当前高度
            div.style.overflow = 'hidden'; // 防止内容溢出

            // 强制浏览器应用初始高度
            div.offsetHeight; // 触发重绘

            // 设置目标高度和宽度
            div.style.width = '200px';
            div.style.height = '30px';
            div.style.transform = 'translate(50px, 150px)'; // 确保中心点对齐
            div.style.padding = '10px';
            div.style.backgroundColor = '#4CAF50';
            div.style.color = '#fff';
            div.style.textAlign = 'center';
            div.style.lineHeight = '30px';
            div.innerHTML = '保存成功！';
        }
    }

    // 自动登录函数
    function autoLogin() {
        const username = GM_getValue('username');
        const password = GM_getValue('password');

        if (username && password) {
            const usrnm = document.getElementById('UserName');
            const pwd = document.getElementsByClassName('input-password input-same')[0];

            if (usrnm && pwd) {
                usrnm.value = username;
                pwd.value = password;
                verifycode(); // 调用验证码识别和登录
            }
        } else {
            createFloatingUI(); // 如果没有存储的学号和密码，显示悬浮界面
        }
    }

    // 验证码识别和登录
    function verifycode()
    {
        GM_xmlhttpRequest({
            method: 'GET',
            url: document.getElementById('yzm_pic').src,
            responseType: 'arraybuffer',
            onload: function(response) {
                const arrayBuffer = response.response;
                const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
                document.getElementById('yzm_pic').src = 'data:image/png;base64,' + base64;
                const formData = new FormData();
                formData.append("validateCode", 'data:image/png;base64,' + base64);
                fetch("https://statistics.fzuhelper.w2fzu.com/api/login/validateCode?validateCode", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                    // 获取识别结果并填写到表单中
                    const regex = /^([2-9][0-9]|1[0-9]{2})$/;
                    if(regex.test(data.message))
                    {
                        document.getElementsByClassName("input-text input-yzm fl")[0].value = data.message;
                    }
                    else
                    {
                        verifycode(); // 如果验证码识别失败，重新获取
                    }
                })
                    .then(click=>{
                    if(document.getElementsByClassName("input-text input-yzm fl")[0].value){
                        document.getElementById("login_btn").click(); // 点击登录按钮
                    }
                });
            },
            onerror: function(error) {
                console.error('Error fetching image:', error);
            }
        });
    }

    // 添加抖动动画的 CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    autoLogin();

})();

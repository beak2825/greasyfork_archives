// ==UserScript==
// @name         重庆大学统一身份认证自动登录
// @namespace    http://tampermonkey.net/
// @description  自动登录到重庆大学的服务系统
// @author       You
// @match        https://sso.cqu.edu.cn/login*
// @grant        none
// @license      MIT
// @version      0.1.3
// @date         2024-05-28
// @downloadURL https://update.greasyfork.org/scripts/495644/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495644/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本开始执行...");


    // 从本地存储获取用户名和密码
    function retrieveCredentials() {
        let username = localStorage.getItem('cqu_sso_username');
        let password = localStorage.getItem('cqu_sso_password');
        return { username, password };
    }

    // 提示用户输入用户名和密码，并保存
    function promptForCredentials() {
        let username = prompt("请输入你的统一身份认证号/身份证件号:");
        let password = prompt("请输入你的密码:");
        if (username && password) {
            localStorage.setItem('cqu_sso_username', username);
            localStorage.setItem('cqu_sso_password', password);
        }
        return { username, password };
    }

    let { username, password } = retrieveCredentials();

    // 如果本地存储中没有用户名或密码或登录失败后返回登录页面
    if (!username || !password) {
        ({ username, password } = promptForCredentials());
    }

    function simulateInput(inputElement, value) {
        inputElement.value = value;
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
        inputElement.focus();
        inputElement.click();
    }

    const interval = setInterval(() => {
        console.log("检查页面元素...");

        const usernameInput = document.querySelector('input[placeholder="统一身份认证号/身份证件号"]');
        const passwordInput = document.querySelector('input[placeholder="请输入密码"]');
        const loginButton = document.querySelector('button[type="submit"][class*="login-button"]');

        if (usernameInput && passwordInput && loginButton) {
            console.log("元素已找到，准备填写信息...");
            clearInterval(interval);

            simulateInput(usernameInput, username);
            simulateInput(passwordInput, password);

            if (!loginButton.disabled) {
                console.log("登录按钮已启用，提交表单...");
                loginButton.click();

                // 检查一段时间后，是否有错误消息显示
                setTimeout(() => {
                    const errorMessage = document.querySelector('span.error-msg');
                    if (errorMessage && errorMessage.textContent.includes("用户名或密码错误，请确认后重新输入")) {
                        console.error("登录失败，用户名或密码错误。");
                        alert("登录失败，用户名或密码错误。请重新输入您的用户名和密码。");
                        localStorage.removeItem('cqu_sso_username');
                        localStorage.removeItem('cqu_sso_password');
                        ({ username, password } = promptForCredentials()); // 重新提示输入
                    }
                }, 1000); // 延迟足够长以便登录尝试完成

            } else {
                console.error("登录按钮仍然被禁用。");
            }
        } else {
            console.error("未能找到所需的页面元素。");
        }
    }, 200);
})();

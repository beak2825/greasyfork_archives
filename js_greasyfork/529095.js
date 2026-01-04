// ==UserScript==
// @name         MoviePilot-V1自动登录
// @version      1.3
// @description  MoviePilot-V1自动登录脚本
// @author       spacey0409
// @namespace    spacey0409
// @match        http://192.168.3.10:3000
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5.2
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/529095/MoviePilot-V1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529095/MoviePilot-V1%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 直接在这里配置账号、密码和MoviePilot地址
    const uname = "test";   // 你的 MoviePilot 账号
    const upassword = "test"; // 你的 MoviePilot 密码
    const MoviePilotHost = "http://192.168.3.10:3000"; // MoviePilot 地址

    function autoLogin() {
        let inputFields = document.querySelectorAll('.v-field__input'); // 选择所有匹配的输入框
        let usernameInput = inputFields[0]; // 第一个输入框（用户名）
        let passwordInput = inputFields[1]; // 第二个输入框（密码）
        let loginButton = document.querySelector('button[type="submit"], button.login-button');

        if (usernameInput && passwordInput && loginButton) {
            function setInputValue(element, value) {
                let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(element, value);
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            }

            setInputValue(usernameInput, uname);
            setInputValue(passwordInput, upassword);

            setTimeout(() => {
                loginButton.click();
            }, 1000);
        } else {
            console.error("无法找到登录输入框或按钮！");
        }
    }


    function checkLoginPage() {
        // 每3秒检查一次 URL 是否包含 "/#/login"
        setInterval(() => {
            if (window.location.href.includes('/#/login')) {
                let checkLoginForm = setInterval(() => {
                    let inputFields = document.querySelectorAll('.v-field__input'); // 重新获取输入框
                    if (inputFields.length >= 2) { // 确保至少有两个输入框
                        clearInterval(checkLoginForm);
                        autoLogin();
                    }
                }, 500);
            }
        }, 3000);  // 每3秒检查一次 URL
    }

    // 在页面加载时，检查是否需要自动登录
    checkLoginPage();
})();
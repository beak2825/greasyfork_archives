// ==UserScript==
// 用户脚本的元数据，包括脚本名称、描述、作者等信息
// @name         自动填充账号密码并点击登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在指定页面自动填充账号和密码，并点击登录按钮
// @author       Your Name
// @match        http://account.sfc.com/login
// @match        https://account.suntekcorps.com/login
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490350/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E5%B9%B6%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490350/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E5%B9%B6%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面加载完成后执行以下代码
    window.addEventListener('load', function() {
        // 获取登录按钮
        var loginButton = document.querySelector('.el-button--primary');

        // 填充账号和密码
        if (loginButton) {
            // 获取账号和密码输入框
            var usernameInput = document.querySelector('input[name="username"]');
            var passwordInput = document.querySelector('input[name="password"]');

            // 模拟用户输入账号和密码
            simulateInput(usernameInput, 'STGF1457'); // 填充账号
            simulateInput(passwordInput, 'wp10086.'); // 填充密码

            // 点击登录按钮
            loginButton.click();
        }
    });

    // 模拟输入函数，用于填充输入框
    function simulateInput(element, value) {
        // 创建并触发一个输入事件
        var event = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            composed: true,
            inputType: 'insertText',
            data: value
        });
        element.value = value; // 将值填充到输入框
        element.dispatchEvent(event); // 触发输入事件
    }
})();

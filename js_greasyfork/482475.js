// ==UserScript==
// @name         小叽资源自动填充密码
// @namespace    Violentmonkey Scripts
// @match        https://acgxj.com/*
// @grant        none
// @version      0.1
// @author       Cary
// @description  解放双手！
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482475/%E5%B0%8F%E5%8F%BD%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482475/%E5%B0%8F%E5%8F%BD%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPasswordElement() {
        // 查找包含特定文本的 span 元素
        var passwordElements = document.querySelectorAll('span');
        for (var i = 0; i < passwordElements.length; i++) {
            if (passwordElements[i].textContent.includes('查看密码：')) {
                return passwordElements[i];
            }
        }
        return null;
    }

    function getPassword() {
        var passwordElement = getPasswordElement();
        if (passwordElement) {
            var match = passwordElement.textContent.match(/\d{6}/);
            if (match) {
                return match[0];
            }
        }
        return null;
    }

    // 在页面加载时运行
    window.addEventListener('load', function() {
        // 检查是否已经填写密码，避免重复提交
        var inputElement = document.querySelector('input[type="password"]');
        if (inputElement && inputElement.value.trim() === "") {
            var password = getPassword();

            if (password !== null) {
                // 将密码填写到输入框中
                inputElement.value = password;

                // 提交表单
                var formElement = inputElement.closest('form');
                if (formElement) {
                    formElement.submit();
                }
            }
        }
    });
})();
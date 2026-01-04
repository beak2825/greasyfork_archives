// ==UserScript==
// @name         上网登录
// @namespace    http://10.255.224.4/
// @version      2024-10-19
// @description  湖南工学院上网登录认证,需要自己把账号密码和运营商补全。
// @author       Bing
// @match        http://10.255.224.4/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512243/%E4%B8%8A%E7%BD%91%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/512243/%E4%B8%8A%E7%BD%91%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 账号和密码
    const username = '账号';     //需要将xxxxxx换为自己的账号密码和服务商
    const password = '密码';
    const op = '运营商';       //写全称  // 例如 "中国移动"、"中国联通" 或 "中国电信"

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 自动填写账号和密码
        fillInputs(username, password);

        // 选择中国电信选项
        selectOption(op);

        // 勾选复选框
        checkCheckbox();

        // 点击按钮
        clickButton();

        // 登录成功后给用户反馈
        setTimeout(function() {
            const pageTips = document.querySelector('[name="PageTips"]');
            const pageTips2 = document.querySelector('p');
            if (pageTips && pageTips.textContent.includes('您已经成功登录。')||pageTips2.textContent.includes('温馨提示')) {
                alert('登录成功！');
            } else {
                alert('登录失败，请检查账号和密码是否正确。');
            }
        }, 3000);  // 假设登录操作需要3秒左右的时间
    });

    // 填写账号和密码
    function fillInputs(username, password) {
        const usernameInput = document.querySelector('input[type="text"], input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');

        if (usernameInput) {
            usernameInput.value = username;
        }

        if (passwordInput) {
            passwordInput.value = password;
        }
    }

    // 选择中国电信选项
    function selectOption(optionText) {
        const selectElement = document.querySelector('select');

        if (selectElement) {
            for (let option of selectElement.options) {
                if (option.text === optionText) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

    // 勾选复选框
    function checkCheckbox() {
        const checkbox = document.querySelector('input[type="checkbox"]');

        if (checkbox) {
            checkbox.checked = true;
        }
    }

    // 点击按钮（通过模糊匹配 value 属性）
    function clickButton() {
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
        for (let button of buttons) {
            if (button.value && button.value.includes('登    录')) {
                button.click();
                return;
            }
        }
    }
})();
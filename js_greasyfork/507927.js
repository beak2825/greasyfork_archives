// ==UserScript==
// @name         HNUSTCASAutoLogin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动登录“湖南科技大学统一身份认证平台”油猴脚本
// @author       YJM
// @match        *://*.hnust.edu.cn/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507927/HNUSTCASAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/507927/HNUSTCASAutoLogin.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const username = 'xxx';
    const password = 'xxx';
    // 如果是统一身份认证平台
    var cas = function () {
        // 点击登录按钮
        let inner_text = '登录';
        let login_xpath = '//*[@id="vue_main"]/div[2]/div[1]/div/div[4]/div[1]/div[3]/div[1]/div/form/div[3]/div/button/span';
        let matchingElement = document.evaluate(login_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement && matchingElement.innerText === inner_text) {
            // Fill the username and password
            let usernameInput = document.evaluate('//*[@id="vue_main"]/div[2]/div[1]/div/div[4]/div[1]/div[3]/div[1]/div/form/div[1]/div/div/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let passwordInput = document.evaluate('//*[@id="vue_main"]/div[2]/div[1]/div/div[4]/div[1]/div[3]/div[1]/div/form/div[2]/div/div[1]/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let rememberMeCheckbox = document.evaluate('//*[@id="vue_main"]/div[2]/div[1]/div/div[4]/div[1]/div[3]/div[1]/div/form/div[2]/div/div[2]/label/span[1]/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (usernameInput) {
                // 请输入你的学号
                usernameInput.value = username;
                // 触发input事件
                let event = new Event('input', {bubbles: true});
                usernameInput.dispatchEvent(event);
            } else {
                console.error('脚本未找到用户名输入框！')
            }

            if (passwordInput) {
                // 请输入你的密码
                passwordInput.value = password;
                // 触发input事件
                let event = new Event('input', {bubbles: true});
                passwordInput.dispatchEvent(event);
            } else {
                console.error('脚本未找到密码输入框！')
            }

            if (rememberMeCheckbox) {
                // 勾选记住我
                rememberMeCheckbox.click();
            } else {
                console.error('脚本未找到记住我复选框！')
            }

            let button_xpath = '//*[@id="vue_main"]/div[2]/div[1]/div/div[4]/div[1]/div[3]/div[1]/div/form/div[3]/div/button'
            let matchingElement = document.evaluate(button_xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (matchingElement) {
                matchingElement.click();
            } else {
                console.error('脚本未找到登录按钮！')
            }
        } else {
            console.info('已登录')
        }
    };

    if (window.location.href.indexOf('hnust.edu.cn') !== -1) {
        window.addEventListener('load', cas);
    } else {
        console.error('未知页面')
    }
})();
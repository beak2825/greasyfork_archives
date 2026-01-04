// ==UserScript==
// @name         抖店自动登录（邮箱）
// @namespace    http://tampermonkey.net/
// @version      2.16
// @description  在抖店自动完成邮箱登录的点击操作
// @author       Hongkun Liu
// @license      MIT
// @match        https://fxg.jinritemai.com/login/common*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524208/%E6%8A%96%E5%BA%97%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E9%82%AE%E7%AE%B1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/524208/%E6%8A%96%E5%BA%97%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E9%82%AE%E7%AE%B1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待邮箱登录按钮显示
    const emailButtonXPath = '//*[@id="ecomLoginForm"]/section/div[2]/div[2]';
    const phoneButtonXPath = '//*[@id="ecomLoginForm"]/section/div[2]/div[1]';  // 手机登录按钮的 XPath
    const waitForEmailButtonToAppear = function() {
        const emailButton = document.evaluate(emailButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (emailButton && emailButton.offsetParent !== null) {
            // 邮箱登录按钮可见，开始执行自动登录操作
            console.log('邮箱登录按钮已显示，开始执行自动登录操作...');
            performLoginActions();
        } else {
            // 如果邮箱登录按钮未显示，则继续等待
            console.log('邮箱登录按钮未显示，继续等待...');
            setTimeout(waitForEmailButtonToAppear, 500);
        }
    };

    // 点击邮箱登录按钮
    const clickEmailButton = function() {
        const emailButton = document.evaluate(emailButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (emailButton) {
            console.log('点击邮箱登录按钮...');
            emailButton.click();
        } else {
            console.error('邮箱登录按钮未找到，请检查 XPath');
        }
    };

    // 点击同意协议复选框
    const clickAgreementCheckbox = function() {
        const agreementCheckbox = document.evaluate('//*[@id="root"]/div/div[1]/div/div/div/div/div[2]/div[4]/div[1]/label/span/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (agreementCheckbox) {
            console.log('点击同意协议复选框...');
            agreementCheckbox.click();
        } else {
            console.error('协议复选框未找到，请检查 XPath');
        }
    };

    // 点击邮箱输入框
    const clickEmailInput = function() {
        const emailInput = document.evaluate('/html/body/div[1]/div/div[1]/div/div/div/div/div[2]/div[2]/section/div[3]/div[1]/div/div/span/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (emailInput) {
            console.log('点击邮箱输入框...');
            emailInput.click();
        } else {
            console.error('邮箱输入框未找到，请检查 XPath');
        }
    };

    // 点击邮箱输入框中间向下 80 像素的位置
    const clickEmailInputMiddle = function() {
        const emailInput = document.evaluate('/html/body/div[1]/div/div[1]/div/div/div/div/div[2]/div[2]/section/div[3]/div[1]/div/div/span/input', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (emailInput) {
            const rect = emailInput.getBoundingClientRect();
            const middleY = rect.top + (rect.height / 2) + 80; // 向下 80 像素
            window.scrollTo(0, middleY);  // 滚动到目标位置
            console.log('点击邮箱输入框中间向下 80 像素的位置...');
            // 模拟点击
            const event = new MouseEvent('click', {
                clientX: rect.left + rect.width / 2,
                clientY: middleY
            });
            emailInput.dispatchEvent(event);
        } else {
            console.error('邮箱输入框未找到，请检查 XPath');
        }
    };

    // 强制点击登录按钮
    const forceClickLoginButton = function() {
        const loginButton = document.evaluate('//*[@id="ecomLoginForm"]/section/div[6]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (loginButton) {
            console.log('尝试点击登录按钮...');
            // 强制触发登录按钮的点击事件
            loginButton.click();
            console.log('强制点击登录按钮');
        } else {
            console.error('登录按钮未找到，请检查 XPath');
        }
    };

    // 提交表单（模拟回车键）
    const submitForm = function() {
        const form = document.evaluate('//*[@id="ecomLoginForm"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (form) {
            console.log('提交表单...');
            form.submit();  // 直接提交表单
        } else {
            console.error('表单未找到，请检查 XPath');
        }
    };

    // 执行登录操作，每个操作间隔 0.5 秒
    const performLoginActions = function() {
        // 1. 点击邮箱登录按钮
        setTimeout(() => {
            clickEmailButton();
        }, 1000);  // 第一步：点击邮箱登录按钮，间隔 1 秒

        // 2. 点击同意协议复选框
        setTimeout(() => {
            clickAgreementCheckbox();
        }, 1500);  // 第二步：点击同意协议复选框，间隔 0.5 秒

        // 3. 点击邮箱输入框
        setTimeout(() => {
            clickEmailInput();
        }, 2000);  // 第三步：点击邮箱输入框，间隔 0.5 秒

        // 4. 点击邮箱输入框中间向下 80 像素的位置
        setTimeout(() => {
            clickEmailInputMiddle();
        }, 2500);  // 第四步：点击邮箱输入框下方 80 像素，间隔 0.5 秒

        // 5. 强制点击登录按钮
        setTimeout(() => {
            forceClickLoginButton();
        }, 3000);  // 第五步：强制点击登录按钮，间隔 0.5 秒

        // 6. 提交表单（模拟回车键）
        setTimeout(() => {
            submitForm();
        }, 3500);  // 第六步：提交表单（模拟回车键），间隔 0.5 秒
    };

    // 开始检测邮箱登录按钮是否显示
    console.log('开始检查邮箱登录按钮...');
    waitForEmailButtonToAppear();
})();

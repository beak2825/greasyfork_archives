// ==UserScript==
// @name         三全校园网登入
// @license GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.102
// @description  自动登录三全校园网
// @author       lumi
// @match        http://10.10.0.22/a79.htm
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/519882/%E4%B8%89%E5%85%A8%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/519882/%E4%B8%89%E5%85%A8%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素出现
    function waitForElement(xpath, timeout = 1500) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkElement = () => {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element = result.singleNodeValue;
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime < timeout) {
                    setTimeout(checkElement, 100);
                } else {
                    reject(new Error(`Element not found: ${xpath}`));
                }
            };
            checkElement();
        });
    }

    async function autoLogin() {
        try {

            // 输入用户名，你 的 学 号
            const usernameField = await waitForElement('//*[@id="edit_body"]/div[3]/div[1]/div/div[2]/div[1]/div/form/input[3]');
            console.log('Username field found:', usernameField);
            usernameField.value = '你 的 学 号';

            // 输入密码，你 的 密 码
            const passwordField = await waitForElement('//*[@id="edit_body"]/div[3]/div[1]/div/div[2]/div[1]/div/form/input[4]');
            console.log('Password field found:', passwordField);
            passwordField.value = '你 的 密 码';

            // 等待选择运营商完成，时间可以自己改，默认5000ms
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 点击登录按钮
            const loginButton = await waitForElement('//*[@id="edit_body"]/div[3]/div[1]/div/div[2]/div[1]/div/form/input[2]');
            console.log('Login button found:', loginButton);
            loginButton.click();

            // 设置标志表示脚本已经运行过
            await GM_setValue('autoLoginRan', true);
        } catch (error) {
            console.error('Auto login failed:', error);
        }
    }

    // 运行自动登录函数
    autoLogin();
})();
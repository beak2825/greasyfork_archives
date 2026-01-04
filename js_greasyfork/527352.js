// ==UserScript==
// @name         郑州工商学院校园网自动登录
// @version      1.1
// @author       like977
// @license           AGPL-3.0-or-later
// @namespace    http://tampermonkey.net/
// @description  适用于郑州工商学院校园网自动登录，两个校区都适用
// @match        http://10.200.251.2/  //默认填写当前校园网登录IP，后续变动可自行更新
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527352/%E9%83%91%E5%B7%9E%E5%B7%A5%E5%95%86%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527352/%E9%83%91%E5%B7%9E%E5%B7%A5%E5%95%86%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        account: "12121****", //校园网账号
        password: "1212***", //账号密码
        executeDelay: 1500,  // 等待动态元素加载，不用修改
        debugMode: false
    };
    // 以下内容不用改动
    function dispatchInputEvents(element) {
        const events = ['input', 'change', 'keydown', 'keyup'];
        events.forEach(eventType => {
            element.dispatchEvent(new Event(eventType, {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    function autoLogin() {
        try {
            const accountInput = document.querySelector('input[name="DDDDD"][placeholder="学号或工号"]');
            const passwordInput = document.querySelector('input[name="upass"][type="password"]');
            const loginButton = document.querySelector('input[name="0MKKey"][type="button"]');
            const logoutButton = document.querySelector('input[name="logout"][type="button"][onclick="javascript:wc()"]');
            if (!accountInput || !passwordInput) {
                throw new Error('输入框定位失败');
            }
            accountInput.focus();
            accountInput.value = CONFIG.account;
            dispatchInputEvents(accountInput);
            passwordInput.focus();
            passwordInput.value = CONFIG.password;
            dispatchInputEvents(passwordInput);
            if (loginButton) {
                loginButton.focus();
                loginButton.click();
                if(CONFIG.debugMode) console.log('已触发按钮点击事件');
            } else {
                document.forms.f3?.submit();
                if(CONFIG.debugMode) console.log('已提交表单');
            }
        } catch (error) {
            console.error('自动登录失败:', error);
            const fallbackAccount = document.evaluate(
                "//input[contains(@style,'background-image') and contains(@placeholder,'学号')]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if(fallbackAccount) fallbackAccount.value = CONFIG.account;
        }
    }
    if (document.readyState === 'complete') {
        setTimeout(autoLogin, CONFIG.executeDelay);
    } else {
        window.addEventListener('load', () => {
            setTimeout(autoLogin, CONFIG.executeDelay);
        });
    }
})();
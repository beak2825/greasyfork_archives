// ==UserScript==
// @name         Srun(深澜) 校园网管理后台自动登录
// @version      1.0
// @author       like977
// @license           AGPL-3.0-or-later
// @namespace    http://tampermonkey.net/
// @description  DR.COM管理后台自动登录
// @match        http://127.0.0.0:8080/Self/login/?302=LI  //填写校园网登录IP
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527350/Srun%28%E6%B7%B1%E6%BE%9C%29%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527350/Srun%28%E6%B7%B1%E6%BE%9C%29%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        account: "123", //登录账户
        password: "456", //登录密码
        executeDelay: 1500,  // 等待动态元素加载
        debugMode: false
    };

    // 增强事件触发器
    function dispatchInputEvents(element) {
        const events = ['input', 'change', 'keydown', 'keyup'];
        events.forEach(eventType => {
            element.dispatchEvent(new Event(eventType, {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    // 主执行函数
    function autoLogin() {
        try {
            // 精准定位元素
            const accountInput1 = document.querySelector('input[id="account"][name="account"][placeholder="账号"]');
            //<input type="text" id="account" name="account" class="form-control" placeholder="账号">
            const passwordInput1 = document.querySelector('input[type="password"][id="password"][name="password"][placeholder="密码"]');
            //<input type="password" id="password" name="password" class="form-control" placeholder="密码">
            const loginButton1 = document.querySelector('input[name="submit"][type="submit"]');
            //<button type="submit" name="submit" class="btn btn-primary btn-block">

            const accountInput = document.getElementById('account');
            const passwordInput = document.getElementById('password');
            const loginButton = document.querySelector('form[action="/Self/login/verify"]');


            if (!accountInput || !passwordInput) {
                throw new Error('输入框定位失败');
            }
 //           if(logoutButton){
 //            console.log.error("账号已登录，无需重复登录！")
 //           }else{
//                console.log("正在执行登录操作")
//            }

            // 账号填充流程
            accountInput.focus();
            accountInput.value = CONFIG.account;
            dispatchInputEvents(accountInput);

            // 密码填充流程
            passwordInput.focus();
            passwordInput.value = CONFIG.password;
            dispatchInputEvents(passwordInput);

            // 提交登录
            if (loginButton1) {
                loginButton1.focus();
                loginButton1.click();
                if(CONFIG.debugMode) console.log('已触发按钮点击事件');
            } else {
                document.forms.f3?.submit();
                if(CONFIG.debugMode) console.log('已提交表单');
            }


                        // 提交表单
            if (loginButton) {
                const submitButton = loginButton.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.click();
                } else {
                    loginButton.submit();
                }
            }

        } catch (error) {
            console.error('自动登录失败:', error);
            // 备用定位方案
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

    // 执行控制
    if (document.readyState === 'complete') {
        setTimeout(autoLogin, CONFIG.executeDelay);
    } else {
        window.addEventListener('load', () => {
            setTimeout(autoLogin, CONFIG.executeDelay);
        });
    }
})();
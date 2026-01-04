// ==UserScript==
// @name         河南工学院校园网自动登录
// @namespace    https://www.cnblogs.com/wkkwk
// @version      1.3
// @description  不等待页面内所有元素加载完毕，使用异步登录方式，自动登录河南工学院校园网
// @author       哇咔咔哇咔
// @match        http://211.69.15.10:6060/portalReceiveAction.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527102/%E6%B2%B3%E5%8D%97%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527102/%E6%B2%B3%E5%8D%97%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置账户信息（需用户自行修改）
    const ACCOUNT = {
        username: '你的账号',    // 替换为你的账号
        password: '你的密码',    // 替换为你的密码
        operator: '运营商'       // 运营商：yd-移动/lt-联通/dx-电信
    };

    // 通用延时函数
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 错误处理函数
    function handleError(errorMessage) {
        console.error('自动登录失败:', errorMessage);
        alert('自动登录失败: ' + errorMessage);
    }

    // 元素等待函数
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
            }, 100);
    
            setTimeout(() => {
                clearInterval(interval);
                reject(new Error('等待元素超时: ${selector}'));
            }, timeout);
        });
    }

    // 主逻辑函数
    async function autoLogin() {
        try {
            // 提前等待关键元素
            await Promise.all([
                waitForElement('#userName'),
                waitForElement('#password'),
                waitForElement('.loginWay')
            ]);

            await sleep(1000); // 初始等待

            // 填写用户名
            const userNameInput = document.getElementById('userName');
            if (!userNameInput) throw new Error("用户名输入框未找到");
            userNameInput.value = ACCOUNT.username;
            console.log('用户名已填写');
            await sleep(1000);

            // 填写密码
            const passwordInput = document.getElementById('password');
            if (!passwordInput) throw new Error("密码输入框未找到");
            passwordInput.value = ACCOUNT.password;
            console.log('密码已填写');
            await sleep(1000);

            // 选择运营商
            const radioSelector = `.loginWay input[type="radio"][value="${ACCOUNT.operator}"]`;
            const operatorRadio = await waitForElement(radioSelector);
            if (!operatorRadio) throw new Error("运营商选项未找到");
            operatorRadio.click();

            // 如果需要确保样式更新，可以触发关联的 <i> 元素的点击事件
            // const iconElement = operatorRadio.closest('label').querySelector('i');
            // if (!iconElement) throw new Error("运营商选项未找到");
            // iconElement.click();

            console.log('运营商已选择');
            await sleep(1000);

            // 提交登录
            const loginBtn = await waitForElement('.loginBtn');
            if (!loginBtn) throw new Error("登录按钮未找到");
            loginBtn.click();
            console.log('已提交登录请求');

        } catch (error) {
            handleError(error.message);
        }
    }

    // 页面开始解析时即启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoLogin);
    } else {
        autoLogin();
    }
})();
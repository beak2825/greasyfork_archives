// ==UserScript==
// @name         南京师范大学中北学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  高效检测登录状态，自动关闭页面
// @match        http://172.31.254.2/*
// @license      允许任何人修改和重新分发编写的代码。
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/529269/%E5%8D%97%E4%BA%AC%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E4%B8%AD%E5%8C%97%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529269/%E5%8D%97%E4%BA%AC%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E4%B8%AD%E5%8C%97%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(() => {
    'use strict';
    // 配置区
    const CFG = {
        acc: "81000000", //这里填写账号
        pwd: "000000",   //这里填写密码
        net: "@cmcc"     // 如果是中国移动填写@cmcc/如果是中国电信@telecom/如果是校园网-1
    };
    // 核心逻辑
    const check = () => {
        const success = document.querySelector('[name="PageTips"]');
        if (success?.textContent.includes("成功登录")) {
            console.log("✅ 登录成功，关闭窗口");
            return window.close();
        }
        return false;
    };
    const login = () => {
        if (check()) return;

        // 自动填充
        const [acc, pwd, sel] = ['text', 'password', 'select'].map(t =>
            document.querySelector(`input[type="${t}"],${t}`));
        if (acc && pwd) {
            acc.value = CFG.acc;
            pwd.value = CFG.pwd;
            sel && (sel.value = CFG.net) && sel.dispatchEvent(new Event('change'));
            document.querySelector('input[type="submit"]')?.click();
            console.log("🚀 登录请求已发送");
            // 启动轮询检测
            const timer = setInterval(() => check() && clearInterval(timer), 1000);
        }
    };
    // 执行入口
    if (location.host === '172.31.254.2') {
        new MutationObserver(check).observe(document.body, { subtree: true, childList: true });
        setTimeout(login, 1500);
    }
})();
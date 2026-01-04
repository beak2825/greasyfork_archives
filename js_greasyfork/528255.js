// ==UserScript==
// @name         NFU Academic System Auto Login (广州南方学院教务系统自动登录)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  NFU（广州南方学院）新教务系统自动登录
// @author       ZeroNight
// @license      MIT
// @match        https://jwxt.nfu.edu.cn/jwglxt/xtgl/login_slogin.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528255/NFU%20Academic%20System%20Auto%20Login%20%28%E5%B9%BF%E5%B7%9E%E5%8D%97%E6%96%B9%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528255/NFU%20Academic%20System%20Auto%20Login%20%28%E5%B9%BF%E5%B7%9E%E5%8D%97%E6%96%B9%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 用户名和密码
    const USERNAME = "XXXXXXXX"; //请将这里的XXXX换成你的账号" "要保留
    const PASSWORD = "XXXXXXXXX";//请将这里的XXXX换成你的密码" "要保留

    // 获取输入框和按钮
    const usernameInput = document.getElementById("yhm"); // 用户名输入框
    const passwordInput = document.getElementById("mm");  // 密码输入框
    const loginButton = document.getElementById("dl");    // 登录按钮

    if (usernameInput && passwordInput && loginButton) {
        usernameInput.value = USERNAME;
        passwordInput.value = PASSWORD;
        console.log("已填写用户名和密码");

        setTimeout(() => {
            console.log("正在点击登录按钮...");
            loginButton.click();
        }, 500); // 延迟 500ms 防止页面未完全加载
    } else {
        console.error("找不到某些登录元素，请检查选择器！");
    }
})();

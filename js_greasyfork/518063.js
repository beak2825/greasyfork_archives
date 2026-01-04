// ==UserScript==
// @name         自动填写账号密码
// @namespace    http://tampermonkey.net/
// @version      2024-11-19
// @description  访问密服平台登录页，自动填写账号密码
// @author       GISirFive
// @match        https://*8866/*
// @include      https://*8866/*
// @icon         none
// @grant        GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518063/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/518063/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        // 选择表单元素
        const form = document.querySelector('.el-form.login-form');
        if(form == null){
            GM_log('未获取到登录表单');
            return;
        }
        // 定义事件，跳过校验
        var focus = new Event('focus');
        var input = new Event('input');
        var change = new Event('change');
        var blur = new Event('blur');
        //填充表单
        const tenantInput = form.querySelector('input[placeholder="租户标识"]');
        if(tenantInput != null){
            tenantInput.value = "xxx";
            tenantInput.dispatchEvent(focus);
            tenantInput.dispatchEvent(input);
            tenantInput.dispatchEvent(change);
            tenantInput.dispatchEvent(blur);
        }
        const usernameInput = form.querySelector('input[placeholder="账号"]');
        usernameInput.value = "xxx";
        usernameInput.dispatchEvent(focus);
        usernameInput.dispatchEvent(input);
        usernameInput.dispatchEvent(change);
        usernameInput.dispatchEvent(blur);
        const passwordInput = form.querySelector('input[placeholder="密码"]');
        passwordInput.value = "xxx";
        passwordInput.dispatchEvent(focus);
        passwordInput.dispatchEvent(input);
        passwordInput.dispatchEvent(change);
        passwordInput.dispatchEvent(blur);
        const validInput = form.querySelector('input[placeholder="验证码"]');
        validInput.focus();
        // 查找并点击登录按钮
        //const loginButton = form.querySelector('.el-button.login-btn');
        //loginButton.click();
    }, 1000);
})();
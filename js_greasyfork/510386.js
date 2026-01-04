// ==UserScript==
// @name         江西财经大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动登录校园网，支持多个校园网网址
// @author       jxufe Qiuli0
// @match        http://172.31.170.209/*
// @match        http://172.31.170.203/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/510386/%E6%B1%9F%E8%A5%BF%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/510386/%E6%B1%9F%E8%A5%BF%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 账号密码
    let builtInUsername;
    let builtInPassword;

    // 判断当前网址，并根据网址设置不同的账号密码

    // 实验室公共账号密码
    if (window.location.href.includes('http://172.31.170.209')) {
        builtInUsername = 'username1'; // 账号1
        builtInPassword = 'password1'; // 密码1

    // 一卡通账号密码
    } else if (window.location.href.includes('http://172.31.170.203')) {
        builtInUsername = 'username2'; // 账号2
        builtInPassword = 'password2'; // 密码2
    }

    // Cookie保存用户输入的账号和密码
    function setCookie(name, value) {
        var Days = 360;
        var exp  = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    // 获取用户保存Cookie的账号和密码
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null)
            return unescape(arr[2]);
        return null;
    }

    // 保存密码的对象
    var savePassword = {
        set: function(form) {
            var savePasswordCheckbox = form.querySelector('input[name="savePassword"]');
            if (savePasswordCheckbox && savePasswordCheckbox.checked) {
                setCookie("save_DDDDD", form.DDDDD.value);
                setCookie("save_upass", form.upass.value);
            } else {
                this.del();
            }
        },
        check: function(form) {
            var DDDDD = getCookie('save_DDDDD');
            var upass = getCookie('save_upass');
            if (DDDDD && upass) {
                form.querySelector('input[name="DDDDD"]').value = DDDDD;
                form.querySelector('input[name="upass"]').value = upass;
                var savePasswordCheckbox = form.querySelector('input[name="savePassword"]');
                if (savePasswordCheckbox) {
                    savePasswordCheckbox.checked = true;
                }
            }
        },
        del: function() {
            setCookie('save_DDDDD', '');
            setCookie('save_upass', '');
        }
    };

    // 页面加载时检查是否保存了账号和密码
    const form = document.forms['f3'];
    if (form) {
        // 优先使用内置账号和密码
        const usernameField = form.querySelector('input[name="DDDDD"]');
        const passwordField = form.querySelector('input[name="upass"]');

        // 如果内置账号和密码存在
        if (builtInUsername) {
            usernameField.value = builtInUsername;
        }

        if (builtInPassword) {
            passwordField.value = builtInPassword;
        }

        // 检查 Cookie 中的账号和密码
        savePassword.check(form);
    } else {
        console.log("找不到Cookie");
        return;
    }

    // 模拟点击登录按钮，处理 onsubmit 逻辑
    const loginButton = form.querySelector('input[name="0MKKey"]');
    if (loginButton) {
        // 验证账号是否为空
        if (form.DDDDD.value.length === 0) {
            console.log("账号不能为空！");
            return;
        }

        // 检查密码是否为空
        if (form.upass.value.length === 0) {
            console.log("密码不能为空！");
            return;
        }

        // 调用 ee(3)
        if (typeof ee === "function") {
            const result = ee(3);
            if (result) {
                // 保存账号和密码到 Cookie
                savePassword.set(form);

                form.submit(); // 提交表单
                console.log("表单已成功提交");
            } else {
                console.log("表单提交被取消");
            }
        } else {
            console.log("未找到 ee 函数，直接提交表单");
            form.submit(); // 如果未定义 ee 函数，直接提交表单
        }
    } else {
        console.log("找不到登录按钮");
    }
})();

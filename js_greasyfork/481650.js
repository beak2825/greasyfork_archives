// ==UserScript==
// @name         NKU_WLAN_login
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Connect to NKU_WLAN easily!
// @author       lihaji
// @match        http://202.113.18.106/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18.106
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481650/NKU_WLAN_login.user.js
// @updateURL https://update.greasyfork.org/scripts/481650/NKU_WLAN_login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 这里填上你的学号和密码
    var user_name = "";
    var user_password = "";

    // 获取当前网址
    var currentURL = window.location.href;

    // http://202.113.18.106/

    // 判断当前网址前缀
    if (currentURL.startsWith("http://202.113.18.106/a70.htm")) {
        // 在 http://202.113.18.106/a70.htm* 前缀下执行的代码
        console.log("登录界面");
        // 在登录界面 自动填充账号密码

        var loginButton = document.querySelector('.edit_lobo_cell[value="登录(Login)"]');
        var input_username = document.querySelector('.edit_lobo_cell[name="DDDDD"]');
        var input_password = document.querySelector('.edit_lobo_cell[name="upass"]');

        // 检查是否成功获取到元素
        if (input_username && input_password) {
            // 执行点击事件
            input_username.value = user_name;
            input_password.value = user_password;
        } else {
            console.error('无法找到输入框');
        }


        // 检查是否成功获取到元素
        if (loginButton) {
            // 执行点击事件
            loginButton.click();
        } else {
            console.error('无法找到登录按钮');
        }



    } else if (currentURL.startsWith("http://202.113.18.106/2.htm")) {
        // 在 http://202.113.18.106/2.htm* 前缀下执行的代码
        console.log("AC认证失败界面");
        // 在 AC认证失败界面 返回登录界面进行二次登录

        var returnButton = document.querySelector('.edit_lobo_cell[value="返回（Go Back）"]');
        // 检查是否成功获取到元素
        if (returnButton) {
            // 执行点击事件，返回登录界面
            returnButton.click();
        } else {
            console.error('无法找到返回按钮');
        }

    } else {
        // 不匹配任何前缀
        console.log("非法页面");
    }



})();
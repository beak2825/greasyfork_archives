// ==UserScript==
// @name         广东培正学院自动登录
// @namespace    http://tampermonkey.net/
// @version      2024-10-11
// @description  广东培正学院自动登录!
// @author       danehong
// @match        http://10.20.3.1/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508303/%E5%B9%BF%E4%B8%9C%E5%9F%B9%E6%AD%A3%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/508303/%E5%B9%BF%E4%B8%9C%E5%9F%B9%E6%AD%A3%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// user_account、user_password 分别是账号和密码，账号是你的学号
var user_account = '20238080901025';
var user_password = '006166';

// 各个控件的 selector
var boxOfLogin = "#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form";
var inputOfAccount = '#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)';
var inputOfPassword = '#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(5)';
var buttonOfLogin = '#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(2)';
var buttonOfBack = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form > input';
var timeout = '#message'
var backForm = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form'

// 登录函数
function login() {
    console.log("正在进行登录操作");
    // 自动填写账号密码到输入框
    document.querySelector(inputOfAccount).value = user_account;
    document.querySelector(inputOfPassword).value = user_password;

    document.querySelector(buttonOfLogin).click();
    var buttonOfBackValue = document.querySelector(buttonOfBack).value;
    console.log(buttonOfBackValue);
    if (buttonOfBackValue) {
        console.log("清除计时器");
        // 如果有注销按钮清除计时器
        clearInterval(loginInterval);
    }
}

// 定义一个变量来存储定时器的ID
var loginInterval;

(function () {
    'use strict';
    // Your code here..
    window.setTimeout(function () {
        //判断输入框是否存在
        if (document.querySelector(boxOfLogin) !== null) {
            console.log("登录框存在");
            // 设置定时器，并将定时器的ID赋值给loginInterval变量
            loginInterval = setInterval(login, 1000);
        }

        // 设置检查间隔时间（毫秒）
        var checkInterval = 500; // 每0.5秒检查一次

        // 检查登录框是否存在的函数
        function checkBackBox() {
            var backFormBox = document.querySelector(backForm); // 使用之前定义的选择器
            if (backFormBox) {
                console.log("返回");
                // 如果超时，点击返回
                document.querySelector(buttonOfBack).click();
                // 登录后，可以清除定时器，避免重复登录
                clearInterval(loginCheckTimer);
            }
        }

        // 创建定时器，每隔一定时间检查登录框
        var loginCheckTimer = setInterval(checkBackBox, checkInterval);

    }, 300)
})();

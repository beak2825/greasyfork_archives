// ==UserScript==
// @name         杭电HDU校园网自动登陆
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测校园网校园网是否登陆，如果未登录则自动填写账号密码进行登陆，并且一分钟刷新一次网页（网页需挂在到后台），保证被踢下线之后可以再次自动登陆
// @author       hdu电院wch
// @match        https://login.hdu.edu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542782/%E6%9D%AD%E7%94%B5HDU%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/542782/%E6%9D%AD%E7%94%B5HDU%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 判断是否是校园网登录页面
    function isCampusNetworkPage() {
        return window.location.href.includes('login.hdu.edu.cn');
    }
 
    // 自动填写账号和密码并提交
    function autoLogin() {
        const username = '你的账号'; // 填写你的校园网账号
        const password = '你的密码'; // 填写你的校园网密码
 
        // 查找账号和密码输入框
        const usernameField = document.querySelector('#username'); // 根据 id 查找账号输入框
        const passwordField = document.querySelector('#password'); // 根据 id 查找密码输入框
 
        // 如果找到输入框
        if (usernameField && passwordField) {
            // 填充账号和密码
            usernameField.value = username;
            passwordField.value = password;
 
            // 查找登录按钮并点击
            const loginButton = document.querySelector('#login-account');
            if (loginButton) {
                loginButton.click();
                // 点击登录按钮
            }
        }
    }
 
    // 每隔一分钟刷新一次网页
    setInterval(() => {
        location.reload();
        // 刷新当前页面
    }, 60000); // 60000 毫秒 = 1 分钟
 
    // 如果是校园网登录页面，执行自动登录
    if (isCampusNetworkPage()) {
        // 检查是否已经登录，如果没有登录则执行自动填写和点击
        const loginButton = document.querySelector('#login-account');
        if (loginButton) {
            autoLogin();
        }
    }
})();
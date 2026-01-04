// ==UserScript==
// @name         🔥云南财经大学校园网自动登录🔥
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  仅限个人学习开发使用，出现任何引起的后果，概不负责！！！！
// @author       卓计21 GENARDING
// @match        http://172.16.130.31/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467050/%F0%9F%94%A5%E4%BA%91%E5%8D%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/467050/%F0%9F%94%A5%E4%BA%91%E5%8D%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // 代码放在这里

    // Your code here...
const form = document.querySelector('.panel-login');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const button = document.querySelector('.panel-login .panel-row:last-child .btn-login[data-domain="2- @ctc"]');
const predefinedUsername = '输入账号会吧'; // 填入你的账号
const predefinedPassword = '填个密码会吧'; // 填入你的密码
// 设置预填充的用户名和密码
usernameInput.value = predefinedUsername;
passwordInput.value = predefinedPassword;
// 提交登录表单
button.click();
console.log('Logged in successfully!');
})();
// ==UserScript==
// @name         ZJUT校园网自动登入
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  浙江工业大学校园网自动登入（莫干山校区）
// @author       haoni886
// @match        http://192.168.8.1/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477838/ZJUT%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/477838/ZJUT%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

// 账号和密码
const username = 'YourAccount';  //这里填你的学号
const password = 'YourPassport'; //这里填密码（一般为身份证后8位）

// 元素选择器
const accountSelector = '#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)';
const passwordSelector = '#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(5)';
const loginBtnSelector = '#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(2)';

// 登录函数
const login = () => {
  document.querySelector(accountSelector).value = username;
  document.querySelector(passwordSelector).value = password;
  document.querySelector(loginBtnSelector).click();
}

// 延迟执行
setTimeout(() => {

  login();

  // 检测是否登录成功
  setTimeout(() => {
    // ...
  }, 1000);

}, 5000); // 5秒后执行
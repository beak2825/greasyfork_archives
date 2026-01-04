// ==UserScript==
// @name         武汉纺织大学外经贸学院校园网自动登录
// @namespace    https://lran.top
// @version      1.0.2
// @description  自动登录武汉纺织大学外经贸学院校园网（深澜）
// @match        http://218.104.96.75/*
// @author       LRan
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477460/%E6%AD%A6%E6%B1%89%E7%BA%BA%E7%BB%87%E5%A4%A7%E5%AD%A6%E5%A4%96%E7%BB%8F%E8%B4%B8%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/477460/%E6%AD%A6%E6%B1%89%E7%BA%BA%E7%BB%87%E5%A4%A7%E5%AD%A6%E5%A4%96%E7%BB%8F%E8%B4%B8%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 检查是否存在注销按钮，如果存在则停止登录
  function checkLogoutButton() {
    var logoutButton = document.querySelector('#logout');
    if (logoutButton) {
      // 注销按钮存在，停止登录
      console.log('已登录，停止自动登录');
      return true;
    }
    return false;
  }

  // 自动填充用户名和密码并点击登录按钮
  function autoLogin() {
    var usernameInput = document.querySelector('#username');
    var passwordInput = document.querySelector('#password');
    var loginButton = document.querySelector('#login-account');

    if (usernameInput && passwordInput && loginButton) {
      // 将114514修改为你的账号，密码默认为123456
      //问题反馈请加QQ1219079128
      usernameInput.value = '114514';
      passwordInput.value = '123456';

      // 点击登录按钮
      loginButton.click();
    }
  }

  // 检查是否需要登录并执行相应操作
  function checkAndLogin() {
    if (!checkLogoutButton()) {
      // 注销按钮不存在，执行自动登录
      autoLogin();
    }
  }

  // 在页面加载完成后检查是否需要登录
  window.addEventListener('load', checkAndLogin);
})();
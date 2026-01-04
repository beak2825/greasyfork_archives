// ==UserScript==
 // @name         NFUAutoLogin
 // @namespace    https://greasyfork.org/zh-TW/scripts/453980-nfuautologin
 // @version      1.1.1
 // @description  Guangzhou NanFang College campus network automatic login
 // @author       CoverLi
 // @license      MIT
 // @match        http://172.16.30.33/*
 // @match        http://172.16.30.45/*
 // @match        http://172.30.255.34/*
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453980/NFUAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/453980/NFUAutoLogin.meta.js
 // ==/UserScript==

(function () {
  'use strict';
  setTimeout(function () {
    setTimeout(function () {
      // 获取学号输入框并设置值
      document.getElementsByClassName("edit_lobo_cell")[1].value = "学号";
      // 获取密码输入框并设置值
      document.getElementsByClassName("edit_lobo_cell")[2].value = "密码";
      // 点击登录按钮
      document.getElementsByClassName("edit_lobo_cell")[0].click();
    }, 500);
  }, 1000);
})();

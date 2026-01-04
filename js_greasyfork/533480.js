// ==UserScript==
// @name         阿里云自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  阿里云系列网站实现自动登录
// @license      MIT
// @author       tccpc
// @match        https://passport.aliyun.com/havanaone/login/login.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533480/%E9%98%BF%E9%87%8C%E4%BA%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/533480/%E9%98%BF%E9%87%8C%E4%BA%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const userName = "test";   // 输入你的账户
  const password = "输入你的密码";    // 输入你的密码（只会被你自己看到）

  const nameDom = document.querySelector("#fm-login-id");
  const passwordDom = document.querySelector("#fm-login-password");
  if (nameDom && passwordDom) {
    nameDom.value = userName;
    passwordDom.value = password;
    document.querySelector('.password-login').click();
  }
})();
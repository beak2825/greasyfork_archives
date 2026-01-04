// ==UserScript==
// @name        GIWIFI自动登录
// @namespace    none
// @version      1.1
// @description  使用前需要把第15行中的账号改为你的手机号，第16行改为你的密码。
// @author       knowliu
// @match        http://login.gwifi.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431831/GIWIFI%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431831/GIWIFI%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("login_name").value='你的手机号';//别忘了把账号改为你的手机号
    document.getElementById("login_password").value='你的密码';//别忘了把密码改为你的密码
    document.getElementById("loginButton").click();//点击登陆
})();

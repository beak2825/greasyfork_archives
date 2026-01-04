// ==UserScript==
// @name        GIWIFI自动登录
// @namespace    买不起域名，等有了女朋友在买（笑）
// @version      α
// @description  使用前需要把第15行中的账号改为你的手机号，第16行改为你的密码。
// @author       Rapt0r
// @match        http://login.gwifi.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392495/GIWIFI%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/392495/GIWIFI%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("first_name").value='账号';//别忘了把账号改为你的手机号
    document.getElementById("first_password").value='密码';//别忘了把密码改为你的密码
    document.getElementById("first_button").click();//点击登陆
})();

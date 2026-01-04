// ==UserScript==
// @name         信阳学院校园网自动登录
// @license MIT
// @description  用于自动登录信阳学院的校园宽带！
// @author       Skylarrkuo
// @match        http://172.20.2.242:9090/*
// @icon         https://portalx.xyu.edu.cn/portal-minio/cms/%E7%BD%91%E7%AB%99%E5%9B%BE%E6%A0%87120_120_%E5%BD%A9%E8%89%B2_1671688763273.png
// @grant        none
// @version 0.0.1.20240302132304
// @namespace https://greasyfork.org/users/1269323
// @downloadURL https://update.greasyfork.org/scripts/488807/%E4%BF%A1%E9%98%B3%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/488807/%E4%BF%A1%E9%98%B3%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var students_number = "你的学号";   //在此输入学号！！
    var password = "你的密码";          //在此输入密码！！

    // Your code here...
    if (document.querySelector('[id="user_name"]').value = students_number) {
        console.log("1.已输入账号");
    }

    if (document.querySelector('[id="password"]').value = password) {
        console.log("2.已输入密码");
    }
    if (document.querySelector('[id="remember_password"]').click()) {
        console.log("3.开启记住密码");
    }
    if (document.querySelector('[id="auto_login"]').click()) {
        console.log("4.开启自动登录");
    }
    if (document.querySelector('[id="login_submit"]').click()) {
        console.log("5.上线");
    }

})();
// ==UserScript==
// @name         ZAFU校园网络自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ZAFU校园网络自动登录认证
// @author       Wangyp
// @match        10.152.250.2/*
// @icon         https://www.zafu.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474899/ZAFU%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%BB%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/474899/ZAFU%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%BB%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var s = 0//second
    var m = 0//minute
    var h = 1//hour
    var username = ""    //修改成自己的学/工号
    var password = ""    //修改成自己的密码
    var domain = ""      //修改成自己的运营商："1-"(教职工), "3-@chinanet"(学生电信), "4-@cmcc"(学生移动)
    var time = 1000*s +60000*m + 3600000*h
    
    if(document.getElementById("login-account").value = "登录")
    {
        document.getElementById("username").value = username;
        document.getElementById("password").value = password;
        document.getElementById("domain").value = domain;
        document.getElementById("login-account").click();
    }
    self.setInterval("location.reload();",time);//refresh
})();
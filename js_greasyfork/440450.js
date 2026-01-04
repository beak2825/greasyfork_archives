// ==UserScript==
// @name         浙江农林大学上网脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  哼哼哼啊啊啊啊啊啊啊啊啊啊
// @author       Syhen_XX
// @match        10.152.250.2/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440450/%E6%B5%99%E6%B1%9F%E5%86%9C%E6%9E%97%E5%A4%A7%E5%AD%A6%E4%B8%8A%E7%BD%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/440450/%E6%B5%99%E6%B1%9F%E5%86%9C%E6%9E%97%E5%A4%A7%E5%AD%A6%E4%B8%8A%E7%BD%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = 0//秒
    var m = 0//分钟
    var h = 1//小时
    var username = "114"//修改成自己的学号
    var password = "514"//修改成自己的密码
    var domain = "@cmcc"//选择运营商：@cmcc(移动) @chinanet(电信)
    var time = 1000*s +60000*m + 3600000*h
    if(document.getElementById("login").value = "登陆")
    {
        document.getElementById("username").value = username;
        document.getElementById("password").value = password;
        document.getElementById("domain").value = domain;
        document.getElementById("login").click();
    }
    self.setInterval("location.reload();",time);//循环刷新
})();
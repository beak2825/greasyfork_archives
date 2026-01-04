// ==UserScript==
// @name         汕头大学上网直通车自动登陆
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      Anti 996 License
// @description  Automatically complete the login of Shantou University online express
// @description:zh 自动完成汕头大学上网直通车的登录
// @description:zh-CN 自动完成汕头大学上网直通车的登录，登录网站请打开http://1.1.1.2/*
// @author       yunjingshan
// @match        http://1.1.1.2/*
// @match        http://a.stu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404940/%E6%B1%95%E5%A4%B4%E5%A4%A7%E5%AD%A6%E4%B8%8A%E7%BD%91%E7%9B%B4%E9%80%9A%E8%BD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/404940/%E6%B1%95%E5%A4%B4%E5%A4%A7%E5%AD%A6%E4%B8%8A%E7%BD%91%E7%9B%B4%E9%80%9A%E8%BD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
//======================CONFIG======================
// Credentials for auto-login
    var username = "username";
    var password = "password";
// Timeout settings in ms
    var timeoutBeforeLogin = 1500;
    var timeoutBeforeCloseWindows = 3000;
//==================================================

    function $(id){
        return document.getElementById(id);
    }
    function $$(classname){
        return document.getElementsByClassName(classname);
    }
    function $$$(name){
        return document.getElementsByName(name);
    }
    var clickevt = document.createEvent("MouseEvents");
    clickevt.initEvent("click", true, true);


(function() {
    //填写登录信息
    $("password_name").value=username;
    $("password_pwd").value=password;

    setTimeout(function(){
        //登录
        $("password_submitBtn").click();
    }, timeoutBeforeLogin);

    setTimeout(function(){
        //关闭窗口
        window.close();
    }, timeoutBeforeCloseWindows);


})();
// ==UserScript==
// @name         深澜软件校园网自动登录（电子科大版本）
// @namespace    merak
// @version      0.3
// @description  在脚本中配置好账号密码后，打开校园网登陆界面自动填充账号密码并点击登录
// @author       饵丝
// @match        http://10.253.0.237/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=99.3
 
// @downloadURL https://update.greasyfork.org/scripts/465029/%E6%B7%B1%E6%BE%9C%E8%BD%AF%E4%BB%B6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E7%89%88%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/465029/%E6%B7%B1%E6%BE%9C%E8%BD%AF%E4%BB%B6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E7%94%B5%E5%AD%90%E7%A7%91%E5%A4%A7%E7%89%88%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var usr="******"//将此处改为自己的学号
    var pwd="*****"//将此处改为自己的密码
    if (usr == "******" || pwd == "*****")
    {
    alert("请去用户脚本管理器中，找到此脚本的第 13、14 行代码，添加自己的账号与密码");
    } 
    else
    {
		document.querySelector("#username").value=usr
		document.querySelector("#password").value=pwd
		document.querySelector("#school-login").click();//将此处改为登录类型：#school-login 为校园网登录，#ctcc-login 为电信登录
    }

   // document.getElementById("login-account").click();

    
})();
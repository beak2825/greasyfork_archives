// ==UserScript==
// @name         郑州经贸学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  郑州经贸学院校园网保存密码及自动登陆!
// @author       asdlkjcsol
// @match        http://10.10.10.3/*
// @icon         https://t14.baidu.com/it/u=2925776863,533185360&fm=179&app=42&size=w54&n=0&f=JPEG&fmt=auto?s=A940E01088D3C9F318D71BDE0300E0A5&sec=1663434000&t=65d3219465084ad681f41983ac4dbac0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451527/%E9%83%91%E5%B7%9E%E7%BB%8F%E8%B4%B8%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/451527/%E9%83%91%E5%B7%9E%E7%BB%8F%E8%B4%B8%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //用户自定义
    var usr=""//这里填写账号
    var pwd=""//这里填写密码

if (usr === "" || pwd == "") {
    alert("请去用户脚本管理器中，找到此脚本的第 14、15 行代码，添加自己的账号与密码");
} else{
		document.querySelector("#username").value=usr
		document.querySelector("#password").value=pwd
		document.querySelector("#login-account").click();
      }
})();
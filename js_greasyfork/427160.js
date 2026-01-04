// ==UserScript==
// @name         河北工程大学校园网（深澜）自动登陆
// @namespace    http://www.baifan97.cn/
// @version      0.22
// @description  仅仅提供河北工程大学校园网的保存密码及自动登陆。
// @author       WhiteFan
// @match        http://10.1.0.251/*
// @icon         https://ypy.baifan97.cn//typecho/uploads/pic/icon.png
// @icon64       https://ypy.baifan97.cn//typecho/uploads/pic/icon64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427160/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E6%B7%B1%E6%BE%9C%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/427160/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E6%B7%B1%E6%BE%9C%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //用户自定义
    var usr="这里填账号"//账号
    var pwd="这里填密码"//密码

    //↓重要代码，请勿修改。↓
if (usr === "这里填账号" || pwd == "这里填密码") {
    alert("请去用户脚本管理器中，找到此脚本的第 13、14 行代码，添加自己的账号与密码");
} else{
		document.querySelector("#username").value=usr
		document.querySelector("#password").value=pwd
		document.querySelector("#login").click();
      }
})();
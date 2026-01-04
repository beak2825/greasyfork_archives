// ==UserScript==
// @name         平顶山学院校园网自动登陆
// @namespace    http://ling_yue.gitee.io/
// @version      0.5
// @description  功能较少,还在学习中!
// @author       凌
// @match        http://10.0.8.2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424088/%E5%B9%B3%E9%A1%B6%E5%B1%B1%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/424088/%E5%B9%B3%E9%A1%B6%E5%B1%B1%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

//账户信息
var Account = '校园网账号';//校园网账号
var Password = '校园网密码';//校园网密码

(function() {
		document.querySelector("#username").value=Account;
		document.querySelector("#password").value=Password;
		document.querySelector("#login").click();

})();
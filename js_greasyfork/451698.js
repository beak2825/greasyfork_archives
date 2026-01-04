// ==UserScript==
// @name         广东海洋大学（新校园网）自动登陆
// @namespace    。。。。
// @version      0.02
// @description  只是自动登陆。
// @author       WeiLi
// @match        http://10.129.1.1/*
// @icon         https://www.gdou.edu.cn/img/logo1.png
// @icon64       https://www.gdou.edu.cn/img/logo1.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451698/%E5%B9%BF%E4%B8%9C%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%EF%BC%88%E6%96%B0%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/451698/%E5%B9%BF%E4%B8%9C%E6%B5%B7%E6%B4%8B%E5%A4%A7%E5%AD%A6%EF%BC%88%E6%96%B0%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

function login() {
    'use strict';
    //自定义信息
    var usr="填写账号"//账号
    var pwd="填写密码"//密码

		document.querySelector("#username").value=usr
		document.querySelector("#password").value=pwd
        document.querySelector("#protocol").click();
		document.querySelector("#login-account").click();
}

login();

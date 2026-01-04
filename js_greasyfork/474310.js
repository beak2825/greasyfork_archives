// ==UserScript==
// @name         深澜软件校园网自动登录（内农大版本）
// @namespace    idaidai
// @version      0.2
// @description  在脚本中配置好账号密码后，打开校园网登陆界面自动填充账号密码并点击登录
// @author       idaidai
// @match        10.130.1.200/srun_portal_pc?ac_id=2&theme=pro
// @icon         https://www.google.com/s2/favicons?sz=64&domain=99.3
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474310/%E6%B7%B1%E6%BE%9C%E8%BD%AF%E4%BB%B6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E5%86%85%E5%86%9C%E5%A4%A7%E7%89%88%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474310/%E6%B7%B1%E6%BE%9C%E8%BD%AF%E4%BB%B6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E5%86%85%E5%86%9C%E5%A4%A7%E7%89%88%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var usr="这里填账号"//将此处改为自己的学号
    var pwd="这里填密码"//将此处改为自己的密码
    if (usr == "这里填账号" || pwd == "这里填密码")
    {
    alert("请去用户脚本管理器中，找到此脚本的第 14、15 行代码，添加自己的账号与密码");
    } 
    else
    {
		document.querySelector("#username").value=usr
		document.querySelector("#password").value=pwd
		document.querySelector("#login-account").click();
    }

   // document.getElementById("login-account").click();

    
})();
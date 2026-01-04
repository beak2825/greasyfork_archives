// ==UserScript==
// @name         湖北工业大学校园网（深澜）自动登陆
// @namespace    http://tampermonkey.net/
// @version      24.3.3.7
// @description  只是为了更好的登录校园网
// @author       Xiegaoxiao
// @match        http://202.114.177.246/*
// @match        http://202.114.177.115/*
// @match        http://202.114.177.114/*
// @match        http://202.114.177.113/*
// @icon         https://ts2.cn.mm.bing.net/th?id=ODLS.05f9d038-4ea6-4b54-b7c8-908b5213e055&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/488574/%E6%B9%96%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E6%B7%B1%E6%BE%9C%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/488574/%E6%B9%96%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E6%B7%B1%E6%BE%9C%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //用户自定义
    var usr="这里填账号"
    //账号如果是联通就添加 @cucc 移动 @cmcc 电信 @ctcc 比如 123213124@cmcc 就是中国移动 不加就是校园网登录
    var pwd="这里填密码"//密码

    //↓重要代码，请勿修改。↓
    if (usr === "这里填账号" || pwd == "这里填密码") {
        alert("请去用户脚本管理器中，找到此脚本的第 16、17 行代码，添加自己的账号与密码");
    } else{
        document.querySelector("#username").value=usr
        document.querySelector("#password").value=pwd
        document.querySelector("#login-account").click();
        
    }
})();
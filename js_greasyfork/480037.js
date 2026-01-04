// ==UserScript==
// @name         成都工业学院郫都校区校园网（安朗）自动登陆
// @namespace    https://www.tweaker.cn/
// @version      0.22
// @description  仅提供成都工业学院校园网的保存密码及自动登陆
// @author       tweaker
// @match        http://10.110.10.58/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480037/%E6%88%90%E9%83%BD%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E9%83%AB%E9%83%BD%E6%A0%A1%E5%8C%BA%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E5%AE%89%E6%9C%97%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/480037/%E6%88%90%E9%83%BD%E5%B7%A5%E4%B8%9A%E5%AD%A6%E9%99%A2%E9%83%AB%E9%83%BD%E6%A0%A1%E5%8C%BA%E6%A0%A1%E5%9B%AD%E7%BD%91%EF%BC%88%E5%AE%89%E6%9C%97%EF%BC%89%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
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
		document.querySelector("#userId").value=usr
		document.querySelector("#passwd").value=pwd
		document.querySelector("#submitForm").click();
      }
})();
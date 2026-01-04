// ==UserScript==
// @name         武汉交通职业学院深澜自动登录
// @description  武汉交通职业学院校园网的保存密码及自动登陆
// @version 1.0
// @namespace
// @author       worthy
// @match        http://192.168.180.160/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/922770
// @downloadURL https://update.greasyfork.org/scripts/446094/%E6%AD%A6%E6%B1%89%E4%BA%A4%E9%80%9A%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%B7%B1%E6%BE%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446094/%E6%AD%A6%E6%B1%89%E4%BA%A4%E9%80%9A%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E6%B7%B1%E6%BE%9C%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    var user="填写你的学号";
    var pass="填写你的密码";
    document.evaluate('//form//div//div//input',document).iterateNext().value=user
    document.evaluate('//form//div//div//input[@type="password"]',document).iterateNext().value=pass
    document.evaluate('//button',document.body, null, 9, null).singleNodeValue.click();
   // document.getElementsByTagName("button")[0].onclik=function(){}
})();
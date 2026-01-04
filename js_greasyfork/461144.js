// ==UserScript==
// @name         南宁理工学院校园网自动登录脚本
// @namespace    https://github.com/qixiangiii/Campus-network
// @version      1.0
// @description  南宁理工学院校园网自动登录脚本 有问题请联系qq:1462709953    Microsoft、Chrome浏览器能自动登录  部分浏览器需要刷新即可自动登录如：QQ浏览器
// @author       QiXiang
// @match        http://10.251.251.250/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/461144/%E5%8D%97%E5%AE%81%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/461144/%E5%8D%97%E5%AE%81%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// *************   在引号中输入你的信息   *************
var username = "******"//这里填学号
var password = "******"//这里填密码
var port = 1;//这里填运营商 默认联通 校园网：-1   中国联通：1    中国电信：3

(function() {
    window.addEventListener('load', function() {
    $("input[name='R3']").val(1);
    $("input[name='DDDDD']").val(username);
    $("input[name='upass']").val(password);
    window.document.querySelector("[name='ISP_select']").value=port;
    $("input[name='0MKKey']").click();
    }, false);
})();
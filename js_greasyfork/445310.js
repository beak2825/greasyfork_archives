// ==UserScript==
// @name         东华理工大学校园网快速自动登录脚本
// @namespace    https://github.com/wobisheng/tampermonkey_ntu_faskauto_login
// @version      1.1
// @description  ECUT校园网自动登录脚本
// @author       inventor
// @match        http://172.21.255.105/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=79.141
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445310/%E4%B8%9C%E5%8D%8E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%BF%AB%E9%80%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/445310/%E4%B8%9C%E5%8D%8E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E5%BF%AB%E9%80%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var username = "2021***"//学号
var password = "***"//密码
var port = 2;//0校园网，1中国移动，2中国电信，3中国联通

(function() {
    var _port_text = ["input[value='']","input[value='@cmcc']","input[value='@telecom']","input[value='@unicom']"];
    window.addEventListener('load', function() {
    $(_port_text[port]).attr('checked',true);
    $("input[name='DDDDD']").val(username);
    $("input[name='upass']").val(password);
    $("input[name='0MKKey']").click();
    }, false);
})();
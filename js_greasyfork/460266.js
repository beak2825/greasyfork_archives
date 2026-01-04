// ==UserScript==
// @name         苏科大校园网自动登录脚本
// @namespace    https://github.com/XFiendd/aut0_Login/
// @version      0.2
// @description  实现苏科大校园网自动登录脚本
// @author       XFiend
// @match        http://10.160.63.9/*
// @icon         http://10.160.63.9:801/eportal/extern/123/ip/1/8bf05145a5be5aff993538a202421b07.jpg
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460266/%E8%8B%8F%E7%A7%91%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/460266/%E8%8B%8F%E7%A7%91%E5%A4%A7%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var username = "XXXXX";//将X替换成你的学号
var password = "XXXXX";//将X替换成你的密码
var port = -1;//将-1替换成自己的运营商数字   0校园网，1中国移动，2中国电信，3中国联通

(function() {
    'use strict';
    var operator_list = ["@keda","@cmcc","@telecom","@unicom"];
    window.addEventListener('load', function(){
    $("select[name='ISP_select']").val(operator_list[port]);
    $("input[name='DDDDD']").val(username);
    $("input[name='upass']").val(password);
    $("input[name='0MKKey']").click();
    }, false);
})();
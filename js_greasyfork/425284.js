// ==UserScript==
// @name         南通大学自动登录脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  南通大学上网登录页自动登录脚本，需要在代码中选择运营商并输入自己的学号及密码
// @include      *210.29.79.141*
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @author       kanami
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425284/%E5%8D%97%E9%80%9A%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425284/%E5%8D%97%E9%80%9A%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
$(document).ready(function () {
    var a = document.querySelectorAll(".edit_lobo_cell");
    var choice=a[5];
    var c2=choice.querySelectorAll("span")[4].querySelector("input");//中括号里数字要改，移动改2，电信改3，联通改4
    c2.click();
    var login=a[1];
    var username=a[2];
    username.value="1111111111";//双引号里输入自己的学号
    var password=a[3];
    password.value="222222";//双引号里输入密码
    login.onclick();
});



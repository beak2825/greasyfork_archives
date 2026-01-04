// ==UserScript==
// @name         🔥安阳工学院WiFi认证自动登录🔥【记得去代码里改账号和密码】
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安阳工学院wifi自动输入账号、密码、选择运营商、保存密码进行登录
// @author       You
// @match        http://172.168.254.4/*
// @match        http://172.168.254.6/*
// @icon         https://gitee.com/xvyang123/resource/raw/master/favicon.ico
// @grant        GM_setValue
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/473950/%F0%9F%94%A5%E5%AE%89%E9%98%B3%E5%B7%A5%E5%AD%A6%E9%99%A2WiFi%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%F0%9F%94%A5%E3%80%90%E8%AE%B0%E5%BE%97%E5%8E%BB%E4%BB%A3%E7%A0%81%E9%87%8C%E6%94%B9%E8%B4%A6%E5%8F%B7%E5%92%8C%E5%AF%86%E7%A0%81%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/473950/%F0%9F%94%A5%E5%AE%89%E9%98%B3%E5%B7%A5%E5%AD%A6%E9%99%A2WiFi%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%F0%9F%94%A5%E3%80%90%E8%AE%B0%E5%BE%97%E5%8E%BB%E4%BB%A3%E7%A0%81%E9%87%8C%E6%94%B9%E8%B4%A6%E5%8F%B7%E5%92%8C%E5%AF%86%E7%A0%81%E3%80%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    /*
    【jQuery选择器】
    万能写法：document.querySelector('[什么="值"]')
    其他写法：
        #id选择器       $('#test')
        .class选择器    $('.test')
        :type选择器     $(':test')
        等等。。。搜菜鸟教程：jQuery选择器
    */
    var students_number = "20136610135";//学号
    var password = "080205";//密码
    var operators='3';//运营商，填0-校园网 1-中国电信 2-中国移动 3-中国联通
    var save_the_cookies='1';//是否保存密码 填1(true)-同意 0(false)-不同意


    if (document.querySelector('[placeholder="请输入账号"]').value = students_number) {
        console.log("1.已输入账号");
    }

    if (document.querySelector('[placeholder="请输入密码"]').value = password) {
        console.log("2.已输入密码");
    }

    if (document.querySelector('[class="service"]').value = operators) {
        console.log("3.下拉框选择【"+operators+"】");
    }

    if (document.querySelector('[type="checkbox"]').checked = save_the_cookies) {
        console.log("4.已勾选【保存密码】")
    }

    if (document.querySelector('[type="submit"]').click()) {
        console.log("5.已登录");
    }


})();
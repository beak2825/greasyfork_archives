// ==UserScript==
// @name         河南职业技术学院校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      5.2.0
// @license MIT
// @description  给她用于自动登录河职的校园宽带！
// @author       Skylarrkuo & Wuliweiwei
// @match        http://172.16.1.38/*
// @icon         https://we.hnzj.edu.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488803/%E6%B2%B3%E5%8D%97%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/488803/%E6%B2%B3%E5%8D%97%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var students_number = "你的学号";   //在此输入学号！！
    var password = "你的密码";          //在此输入密码！！
    var operators= "@telecom";          //在此选择运营商！——填 @telecom-中国电信 @cmcc-中国移动 @unicom-中国联通

    // Your code here...
    if (document.querySelector('[placeholder="学号"]').value = students_number) {
        console.log("1.已输入账号");
    }

    if (document.querySelector('[placeholder="密码"]').value = password) {
        console.log("2.已输入密码");
    }

    if (document.querySelector('[class="edit_lobo_cell edit_select ui-draggable-dragging"]').value = operators) {
        console.log("3.下拉框选择【"+operators+"】");
    }

    if (document.querySelector('[type="submit"]').click()) {
        console.log("4.终端IP已经在线");
    }

})();
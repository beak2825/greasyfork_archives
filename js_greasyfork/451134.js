// ==UserScript==
// @name         河北医科大学电脑一键登录校园网
// @namespace    QQ：51839879
// @version      0.1
// @description  一键登录校园网
// @author       John
// @match        https://eportal.hebmu.edu.cn:8443/eportal/*
// @icon         http://lib.hebmu.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451134/%E6%B2%B3%E5%8C%97%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E7%94%B5%E8%84%91%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95%E6%A0%A1%E5%9B%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451134/%E6%B2%B3%E5%8C%97%E5%8C%BB%E7%A7%91%E5%A4%A7%E5%AD%A6%E7%94%B5%E8%84%91%E4%B8%80%E9%94%AE%E7%99%BB%E5%BD%95%E6%A0%A1%E5%9B%AD%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#username").value="用学号替换双引号内的这段文字";
    document.querySelector("#pwd").value="用密码替换双引号内的这段文字";
    document.querySelector("#loginLink_div").click(); 
    
})();
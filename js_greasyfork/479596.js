// ==UserScript==
// @name         NIT联通校园网自动登录
// @namespace    nitAutoLogin
// @version      0.1
// @license      MIT
// @description  适用于南昌工程学院联通校园网自动登录，效果为连接wifi后弹出的网页自动点击登录
// @author       Coldmou4
// @match        118.212.160.67/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479596/NIT%E8%81%94%E9%80%9A%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/479596/NIT%E8%81%94%E9%80%9A%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loginButton = document.getElementById('logonbtn');
    // 检查按钮是否存在
    if(loginButton) loginButton.click()

    //立即关闭网页
    let time = 500;
    setTimeout(()=>{
        window.close();
    },time);
})();
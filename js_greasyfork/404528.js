// ==UserScript==
// @name         去除CSDN登录二维码窗口和遮罩背景
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  去除CSDN中的登录二维码窗口和遮罩背景
// @author       qqyg000
// @match        http*://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404528/%E5%8E%BB%E9%99%A4CSDN%E7%99%BB%E5%BD%95%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%AA%97%E5%8F%A3%E5%92%8C%E9%81%AE%E7%BD%A9%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/404528/%E5%8E%BB%E9%99%A4CSDN%E7%99%BB%E5%BD%95%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%AA%97%E5%8F%A3%E5%92%8C%E9%81%AE%E7%BD%A9%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 去除登录二维码窗口和遮罩背景
    var loginBox = document.querySelector('#passportbox');
    var loginCover = document.querySelector('.login-mark');
    loginBox ? loginBox.parentNode.removeChild(loginBox) : console.log('no login box');
    loginCover ? loginCover.style.display='none' : console.log('no login cover');
})();
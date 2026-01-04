// ==UserScript==
// @name         KMU 账号密码登录
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  恢复KMU被隐藏的账号密码界面并默认账号密码登录
// @author       竹林听雨
// @match        http://cas.kmu.edu.cn/lyuapServer/login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511555/KMU%20%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/511555/KMU%20%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取 ukeylogin 元素并修改 onclick 属性和 class
    const ukeylogin = document.getElementById('ukeylogin');
    if (ukeylogin) {
        // 修改 onclick 属性
        ukeylogin.setAttribute('onclick', "select_login('1')");
        // 移除 style 中的 display:none
        ukeylogin.style.display = '';

        // 增加 active 类
        ukeylogin.classList.add('active');

        // 添加 <span>账号密码登录</span> 到 ukeylogin
        const spanElement = document.createElement('span');
        spanElement.innerHTML = '账号密码登录';
        ukeylogin.appendChild(spanElement);
    }

    // 获取 fasrtlongin 元素并移除 active 类
    const fasrtlongin = document.getElementById('fasrtlongin');
    if (fasrtlongin) {
        fasrtlongin.classList.remove('active');
    }

    // 设置 id 为 login 的元素的 style 为 display: block;
    const loginElement = document.getElementById('login');
    if (loginElement) {
        loginElement.style.display = 'block';
    }

    // 设置 id 为 imglogin 的元素的 style 为 display: none;
    const imgloginElement = document.getElementById('imglogin');
    if (imgloginElement) {
        imgloginElement.style.display = 'none';
    }

})();

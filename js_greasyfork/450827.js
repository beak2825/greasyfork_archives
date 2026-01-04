// ==UserScript==
// @name         CSDN免登陆复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  免登陆复制
// @author       Nhenk
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450827/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450827/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 获取所有的代码块
    let codes = document.querySelectorAll('code');
    // 循环遍历所有代码块
    codes.forEach(c => {
        // 设置代码块可以编辑，从而实现复制
        c.contentEditable = "true";
    })
})();
// ==UserScript==
// @name         CSDN免登陆复制_辉
// @version      1.0
// @description  CSDN实现免登陆复制代码
// @author       小白程序猿H
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @namespace https://greasyfork.org/users/953193
// @downloadURL https://update.greasyfork.org/scripts/450563/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6_%E8%BE%89.user.js
// @updateURL https://update.greasyfork.org/scripts/450563/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6_%E8%BE%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有代码块
    let codes = document.querySelectorAll("code");
    // 循环遍历所有代码块
    codes.forEach(c => {
     //设置代码可以编辑，从而实现复制
        c.contentEditable = "true";
    })
})();
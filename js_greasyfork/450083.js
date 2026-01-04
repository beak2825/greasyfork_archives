// ==UserScript==
// @name         CSDN免登陆复制
// @namespace    https://www.zxiyun.com/
// @version      1.0
// @description  CSDN免登陆就可以复制
// @author       朝晞-淼炎
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450083/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450083/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //获取所有代码块
    let codes = document.querySelectorAll("code");
    //循环遍历所有代码块
    codes.forEach(c => {
        //设置代码块可以编辑，从而实现可复制
        c.contentEditable = "true";
    })
})();
// ==UserScript==
// @name        CSDN免登复制
// @namespace     于镇桂
// @version      1.0
// @description   不用再登陆恶心的CSDN
// @author       You于镇桂
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/469457/CSDN%E5%85%8D%E7%99%BB%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469457/CSDN%E5%85%8D%E7%99%BB%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let codes=document.querySelectorAll("code");
    codes.forEach(c =>{
        c.contentEditable="ture";

    });


    // Your code here...
})();
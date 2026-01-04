// ==UserScript==
// @name         CSDN
// @namespace    https://zhenghaoqi.com
// @version      1.0
// @description  CSDN免登录复制
// @author       郑小柒~
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      AGPL - 3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449664/CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/449664/CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取所有代码块
    let codes=document.querySelectorAll("code");
    //循环遍历所有代码块
    codes.forEach(c=>{
        //设置代码块可以编辑，从而实现复制
        c.contentEditable="true";
    });
    // Your code here...
})();
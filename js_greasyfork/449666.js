// ==UserScript==
// @name         cx
// @namespace    https://haoqi.com
// @version      1.0
// @description  cx复制hhh
// @author       郑小柒~
// @match        http://notice.chaoxing.com/*/notice/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449666/cx.user.js
// @updateURL https://update.greasyfork.org/scripts/449666/cx.meta.js
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
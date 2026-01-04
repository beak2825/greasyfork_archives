// ==UserScript==
// @name         CSDNclear
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去广告,居中
// @author       gorgias
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376543/CSDNclear.user.js
// @updateURL https://update.greasyfork.org/scripts/376543/CSDNclear.meta.js
// ==/UserScript==
(function() {
'use strict';
//展开全文
document.getElementById("btn-readmore").click();
//去侧边栏 居中
function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
}
addGlobalStyle(`
#mainBox > aside:nth-child(3){
  display:none;
  visibility: hidden;
}
#mainBox{
  position:relative;
  right:130px;
}
`);
    // Your code here...
 })();
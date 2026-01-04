// ==UserScript==
// @name         直接显示青年大学习结束图片
// @namespace    net.myitian.js.QuickEndDaxuexi
// @version      0.1919810
// @description  不加载视频播放页面，直接显示青年大学习结束图片
// @author       Myitian
// @license      Unlicensed
// @match        *://h5.cyol.com/special/daxuexi/*/index.html*
// @match        *://h5.cyol.com/special/daxuexi/*/m.html*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480440/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E7%BB%93%E6%9D%9F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/480440/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E7%BB%93%E6%9D%9F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

var href = window.location.href;
if (href.includes("index.html")) {
    document.querySelector("iframe").src = `data:text/html,<body style="margin:0"><img style="width:100%;height:100%" src="${href.substring(0, href.lastIndexOf("/"))}/images/end.jpg"></body>`;
} else {
    document.documentElement.innerHTML += `<body style="margin:0;z-index:114514"><img style="width:100%;height:100%" src="${href.substring(0, href.lastIndexOf("/"))}/images/end.jpg"></body>`;
}
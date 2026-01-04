// ==UserScript==
// @name         csdn 文章复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将文章内容弹窗显示，可以复制到md文档中
// @author       You
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473164/csdn%20%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/473164/csdn%20%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let div=document.createElement("div");
    div.innerHTML='<button id="span-1" style="z-index: 9999;position: fixed;top: 80%;right: 10%;color: #fff;width: 100px;height: 50px;background-color: #ff03038f;">打开新页面</button>';
    div.onclick=function(event){
        var html=document.getElementsByClassName("blog-content-box");
        console.log(html[0].innerText)
        console.log(html[0].innerHTML)
        let myWindow=window.open('','','width=1920,height=1080');
        myWindow.document.write(html[0].innerHTML)
        myWindow.focus();
    };
    document.body.append(div);

})();
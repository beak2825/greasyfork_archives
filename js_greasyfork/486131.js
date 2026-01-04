// ==UserScript==
// @name         csdn自由复制
// @namespace    http://tampermonkey.net/
// @version      2024-01-31
// @description  可自由复制csdn内的文本，并且去除了侧边栏，使用更简洁高效
// @license      MIT
// @author       You
// @match        https://blog.csdn.net/*/article/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486131/csdn%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/486131/csdn%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.querySelectorAll("body>.main_father>#mainBox>main>.blog-content-box>.baidu_pl>#article_content>#content_views>pre>code").forEach((ele)=>{
        ele.style.userSelect="text"
    })
    document.querySelectorAll("body>.main_father>#mainBox>main>.blog-content-box>.baidu_pl>#article_content>#content_views>pre .hljs-button").forEach((ele)=>{
        ele.remove()
    })
    document.querySelector("body>.main_father>#mainBox>main>.blog-content-box").addEventListener("copy",function(event){
        event.stopImmediatePropagation()
    },true)
    document.querySelector("body>.main_father>#mainBox>main").style.width='1300px'
})();
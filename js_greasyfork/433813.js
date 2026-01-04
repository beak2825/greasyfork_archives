// ==UserScript==
// @name         简书、知乎、csdn、掘金外链接自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简书、知乎、csdn、掘金的外链接界面去自动跳转到链接界面
// @author       wxb
// @include      https://www.jianshu.com/go-wild?*
// @include      https://link.zhihu.com/*
// @include      https://link.csdn.net/*
// @include      https://link.juejin.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433813/%E7%AE%80%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81csdn%E3%80%81%E6%8E%98%E9%87%91%E5%A4%96%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433813/%E7%AE%80%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81csdn%E3%80%81%E6%8E%98%E9%87%91%E5%A4%96%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let siteLink = window.location.origin;  // 获取网站的地址
     setTimeout(()=>{
         // 判断是哪个网站的地址，做出相应的判断
         switch(siteLink){
                 // 知乎
             case "https://link.zhihu.com":
                 document.querySelector(".actions a").click();
                 break;
                 // 简书
             case "https://www.jianshu.com":
                 var jsLink = document.getElementsByTagName("textarea")[0].value;
                 window.location.href=jsLink;
                 break;
                 // csdn
             case "https://link.csdn.net":
                 document.querySelector('.loading-btn').click();
                 break;
                 // 掘金
             case "https://link.juejin.cn":
                 document.querySelector('button').click();
                 break;
        }
     },200)
    // Your code here...
})();
// ==UserScript==
// @name         使洛谷个人主页可见
// @version      2024-02-20
// @namespace    https://greasyfork.org/users/1263992
// @description  使洛谷被隐藏的个人主页可见
// @match        *://www.luogu.com.cn/user/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487787/%E4%BD%BF%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%8F%AF%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/487787/%E4%BD%BF%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E5%8F%AF%E8%A7%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var tipspath="//*[@id=\"app\"]/div[2]/main/div/div[2]/section[2]/div/div[1]";
    window.addEventListener('load',function(){
        console.log("[Show Personal Page] Start processing.");
        var namespaceResolver=document.createNSResolver(document);
        var tips=document.evaluate(tipspath,document,namespaceResolver,XPathResult.ANY_TYPE,null);
        if (tips.iterateNext().textContent.replace(/\s/g,'')=="系统维护，该内容暂不可见。"){
            document.evaluate(tipspath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.remove();
        }
        console.log("[Show Personal Page] Tips box removed.");
        var intro=document.getElementsByClassName("introduction marked")[0];
        intro.removeAttribute("style");
        console.log("[Show Personal Page] Success.");
    },false);
    // Your code here...
})();
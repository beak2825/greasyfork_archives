// ==UserScript==
// @name         BiliBili站内禁止链接新建标签页跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站链接禁止新建标签页跳转
// @author       You
// @match        https://www.bilibili.com/*
// @match        http://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462434/BiliBili%E7%AB%99%E5%86%85%E7%A6%81%E6%AD%A2%E9%93%BE%E6%8E%A5%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/462434/BiliBili%E7%AB%99%E5%86%85%E7%A6%81%E6%AD%A2%E9%93%BE%E6%8E%A5%E6%96%B0%E5%BB%BA%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // $(document).ready



})();
// window.onload
window.onload=function(){
    setTimeout(function(){
        console.log("BiliBili站内禁止链接新建标签页跳转 starting")
        var items = document.getElementsByTagName("a")
        for ( var i = 0 ,len = items.length;i < len;i++) {items[i].target="_parent"}
        console.log("BiliBili站内禁止链接新建标签页跳转 end")
    },500)
}

window.onscroll=function(){
    var items = document.getElementsByTagName("a")
    for ( var i = 0 ,len = items.length;i < len;i++) {items[i].target="_parent"}
};


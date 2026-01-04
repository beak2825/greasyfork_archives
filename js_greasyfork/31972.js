// ==UserScript==
// @name         知音漫客去除购买页面
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*.zymk.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31972/%E7%9F%A5%E9%9F%B3%E6%BC%AB%E5%AE%A2%E5%8E%BB%E9%99%A4%E8%B4%AD%E4%B9%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/31972/%E7%9F%A5%E9%9F%B3%E6%BC%AB%E5%AE%A2%E5%8E%BB%E9%99%A4%E8%B4%AD%E4%B9%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        var el1 = document.getElementById('layui-layer-shade1');
        var el2 = document.getElementById('layui-layer1');
        if(!!el1){
            console.log("移除蒙层");
            document.body.removeChild(el1);
        }
        if(!!el2){
            console.log("移除付费界面");
            document.body.removeChild(el2);
        }
    }, 2);
    // Your code here...
})();
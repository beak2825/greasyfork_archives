// ==UserScript==
// @name         bilibili专栏复制去除后缀
// @namespace    http://luckycat.ink/
// @version      0.1
// @description  bilibili专栏复制，去吃后缀作者链接信息
// @author       LuckyCat
// @match        https://www.bilibili.com/read/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460039/bilibili%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E5%8E%BB%E9%99%A4%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/460039/bilibili%E4%B8%93%E6%A0%8F%E5%A4%8D%E5%88%B6%E5%8E%BB%E9%99%A4%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (a,b,c){
        if(a=='copy') return;
    }
})();
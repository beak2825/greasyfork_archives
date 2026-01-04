// ==UserScript==
// @name         移除sakura frp 的文档走马灯
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除sakurafrp的文档走马灯
// @author       You
// @match        https://www.natfrp.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?domain=natfrp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444854/%E7%A7%BB%E9%99%A4sakura%20frp%20%E7%9A%84%E6%96%87%E6%A1%A3%E8%B5%B0%E9%A9%AC%E7%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/444854/%E7%A7%BB%E9%99%A4sakura%20frp%20%E7%9A%84%E6%96%87%E6%A1%A3%E8%B5%B0%E9%A9%AC%E7%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a =0;
    var interval = setInterval(function(){
    if(a==1){
        clearInterval(interval);
    }
    var ele = document.getElementById('rtfm');
    if(ele != undefined){
        ele.remove();
        a=1;
    }
}, 100);
    
})();
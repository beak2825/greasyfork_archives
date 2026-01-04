// ==UserScript==
// @name         bilibili专栏图片替换
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  替换webp
// @author       丁真
// @match        https://www.bilibili.com/read/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/456719/bilibili%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/456719/bilibili%E4%B8%93%E6%A0%8F%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    let ar=document.getElementsByClassName("normal-img");
    for(var i=0;i<ar.length;i++){
        ar[i].dataset.src=ar[i].dataset.src.replace(/@.*avif/,"");
    };
})();
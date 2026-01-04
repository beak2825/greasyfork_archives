// ==UserScript==
// @name         W3C 去除广告
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  去除 W3Cschool 多余妨碍学习的元素，让学习更清爽
// @author       Aikn
// @match        *://*.w3cschool.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=w3cschool.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460220/W3C%20%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460220/W3C%20%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

function main() {
    'use strict';
    var elemsBore = [];
    elemsBore[0] = document.getElementById("rfbanner");
    elemsBore[1] = document.getElementById("topbanner");
    elemsBore[2] = document.getElementsByClassName("header-menu-vip")[0];
    elemsBore[3] = document.getElementsByClassName("portlet-title pro-title")[0];
    elemsBore[4] = document.getElementsByClassName("fr h-right")[0];
    elemsBore[5] = document.getElementsByClassName("abox-item wwads-cn wwads-horizontal")[0];
    elemsBore[6] = document.getElementById("evaluate-box");
    elemsBore[7] = document.getElementsByClassName("recommend-footer")[0];
    elemsBore[8] = document.getElementsByClassName("sidebar-pro-nav")[0];
    elemsBore[9] = document.getElementsByClassName("sidebar-menu")[0];
    elemsBore[10] = document.getElementsByClassName("side-widget")[0];


    for(var i=0; i<elemsBore.length; i++){
        elemsBore[i].remove();
    }
};

window.onload = function(){
  main();
}
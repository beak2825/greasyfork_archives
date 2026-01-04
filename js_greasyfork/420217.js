// ==UserScript==
// @name         柳州江畔文章审核脚本
//此脚本来自     柳州职业技术学院  电子信息工程学院  计算机应用技术3班  邱绍倡
// @namespace    *://*.http://manager.ihuaben.com/safetyaudit/auditList?type=11/*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       *://*.manager.ihuaben.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420217/%E6%9F%B3%E5%B7%9E%E6%B1%9F%E7%95%94%E6%96%87%E7%AB%A0%E5%AE%A1%E6%A0%B8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420217/%E6%9F%B3%E5%B7%9E%E6%B1%9F%E7%95%94%E6%96%87%E7%AB%A0%E5%AE%A1%E6%A0%B8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
let btn = document.querySelector(".btn-success");

        document.addEventListener('keyup',function(e){
            if(e.keyCode==32){

btn.click();
            }
        })
})(3000);

(function() {
let btn = document.querySelector(".btn-warning");

        document.addEventListener('keyup',function(e){
            if(e.keyCode==70){

btn.click();
            }
        })
})(3000);



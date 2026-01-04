// ==UserScript==
// @name         bilibili批量转为悄悄关注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  仅在使用时打开，操作完成后立即关闭脚本
// @author       You
// @match        https://space.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418960/bilibili%E6%89%B9%E9%87%8F%E8%BD%AC%E4%B8%BA%E6%82%84%E6%82%84%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418960/bilibili%E6%89%B9%E9%87%8F%E8%BD%AC%E4%B8%BA%E6%82%84%E6%82%84%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
var patt = /fans/
if (patt.test(window.location.href)){
window.onload=function(){
    var a=$(".follow-list")[0]
    var a2=document.createElement("li");
    a.appendChild(a2)
    a2.innerHTML='点击此处将此页20位用户转为悄悄关注(默认1500毫秒执行一次，可自行更改)'
    a2.onclick=function(){
$(".cover")[0].click()
for(let i=1; i<20; i++){
// $(".cover")[i].click()
setTimeout(function(){$(".cover")[i].click() }, i*1500)
    }}}}///                                       /默认每1500毫秒执行一次，可自行修改
if (!patt.test(window.location.href)){
window.onload=function(){
$(".be-dropdown-item:contains('转为悄悄关注')").click()
window.close()
}}
//https://space.bilibili.com/*/fans/follow
    // Your code here...
})();
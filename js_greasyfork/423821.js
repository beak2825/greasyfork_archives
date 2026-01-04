// ==UserScript==
// @name         蓝奏云批量下载(eg: 多卷小说)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用，需要弹窗等权限以及微调代码，不会用不要下载
// @author       You
// @match        *://*.lanzoux.com/*
// @match        *://*.lanzous.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423821/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%28eg%3A%20%E5%A4%9A%E5%8D%B7%E5%B0%8F%E8%AF%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/423821/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%28eg%3A%20%E5%A4%9A%E5%8D%B7%E5%B0%8F%E8%AF%B4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
//window.onload=function(){
function aaa(){
//main
if ($('.txt').length==0){
var a=$(".rets")[0]
var a2=document.createElement("a");
a.appendChild(a2)
a2.innerHTML='点击此处将此页文档全部下载(默认1500毫秒执行一次，可自行更改)'
a2.onclick=function(){
var nu=$('#infos').find('a').length
for(let i=0; i<nu; i++){
// $(".cover")[i].click()
setTimeout(function(){$('#infos').find('a')[i].click() }, i*2500)}}}

//dl
setTimeout(function(){if ($('.txt').length!=0){$('.txt')[0].click(); setTimeout(function(){window.close()},1000) }}, 1500)

}
setTimeout(aaa,1500)
    // Your code here...
})();
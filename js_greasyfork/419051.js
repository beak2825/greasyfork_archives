// ==UserScript==
// @name         Bilibili指定装扮及表情屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  meaguna 完 全 自 定 义
// @author       You
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419051/Bilibili%E6%8C%87%E5%AE%9A%E8%A3%85%E6%89%AE%E5%8F%8A%E8%A1%A8%E6%83%85%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/419051/Bilibili%E6%8C%87%E5%AE%9A%E8%A3%85%E6%89%AE%E5%8F%8A%E8%A1%A8%E6%83%85%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
function rm(){
    //var num=$(".sailing-img[alt='神楽Mea']").length
    //for(let i=0;i<num;i++){$(".sailing-img[alt='神楽Mea']")[i].parentNode.remove();}
    $(".sailing-img[alt='神楽Mea']").remove();//屏蔽装扮卡片
    $(".sailing-img[alt='你想屏蔽的人']").remove()
    $(".true-love:contains('財布')").remove()//屏蔽粉丝牌
    $(".bili-avatar-pendent").remove();  //屏蔽头像挂饰
    $("img[alt^='[神楽Mea']").remove()    //屏蔽表情
    $("img[alt^='[你想屏蔽的人']").remove()}
function tt()
{var a=document.getElementsByTagName("body")[0];
var a2=document.createElement("a");
a.appendChild(a2)
a2.innerHTML='屏<br>蔽'
a2.id='meaguna'
a2.onclick=rm
rm()
a2.style.position = "fixed";
a2.style.left = "0px";
a2.style.top = "400px";
}
setTimeout(tt,3000)
//setTimeout(rm,5000)

    // Your code here...
})();
// ==UserScript==
// @name         洛谷题解优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.luogu.org/problemnew/solution/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389139/%E6%B4%9B%E8%B0%B7%E9%A2%98%E8%A7%A3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/389139/%E6%B4%9B%E8%B0%B7%E9%A2%98%E8%A7%A3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // Your code here...
    var a=document.getElementsByClassName('am-g lg-main-content')[0];
    a.parentNode.removeChild(a);
    //alert(functional.child);
    //functional.parentNode.removeChild(functional);
    //functional.appendChild(exitbutton);
    //document.body.appendChild(exitbutton);
    window.onload=function (){
    var functional=document.getElementsByClassName('functional')[0];
    var exitbutton=document.createElement("button");
    functional.appendChild(exitbutton);
        functional.innerHTML='<div data-v-1e7e791f=""  class="operation"><button onClick="window.location.href=\'https://www.luogu.org/problem/\'+window.location.href.slice(-5);" data-v-f3e1ca6a="" data-v-21780baf="" type="button" class="lfe-form-sz-middle" data-v-1e7e791f="" style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);">返回题目</button>  </div>';
    }
})();
//
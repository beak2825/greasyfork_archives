// ==UserScript==
// @name         合工大unipus视听说
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  简单脚本
// @author       HUANG ZHIYANG
// @match        http://10.111.100.201/book/*
// @match        http://172.31.241.173/book/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/417847/%E5%90%88%E5%B7%A5%E5%A4%A7unipus%E8%A7%86%E5%90%AC%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/417847/%E5%90%88%E5%B7%A5%E5%A4%A7unipus%E8%A7%86%E5%90%AC%E8%AF%B4.meta.js
// ==/UserScript==

var scriptt =String($("html").html());
var str = "^"
var str2= "'"
var num1 = scriptt.lastIndexOf("judge");
var num5 = scriptt.indexOf(str,num1);
var num2 = scriptt.lastIndexOf(str2,num5);
var num3 = scriptt.indexOf(';',num5);
var num4 = scriptt.lastIndexOf(str,num3);
num4 = num4 + 2;
var script2 = scriptt.slice(num2,num4);
console.log( num1,num2,num3,num4 ); // output alert(1);

var dialogHtml = '<div id="hint-dialog" style="margin:0px auto;opacity:0.8;padding:5px 10px;position:fixed;z-index: 10001;display: block;bottom:30px;left:55%;color:#fff;background-color:#CE480F;font-size:13px;border-radius:3px;">'+script2+'</div>';
$('#hint-dialog').remove();
$('body').append(dialogHtml);
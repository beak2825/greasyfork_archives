// ==UserScript==
// @name New Script
// @namespace Violentmonkey Scripts
// @match https://greasyfork.org/zh-CN/scripts/by-site/uestcedu.com
// @grant none
// @description self use
// @include   http*://learning.uestcedu.com/learning3/console/*
// @version 0.0.1.20190515124927
// @downloadURL https://update.greasyfork.org/scripts/383076/New%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/383076/New%20Script.meta.js
// ==/UserScript==

var importJs=document.createElement('script')  //在页面新建一个script标签
importJs.setAttribute("type","text/javascript")  //给script标签增加type属性
importJs.setAttribute("src", 'http://ajax.microsoft.com/ajax/jquery/jquery-1.4.min.js') //给script标签增加src属性， url地址为cdn公共库里的
document.getElementsByTagName("head")[0].appendChild(importJs) //把importJs标签添加在页面
console.log("Jquery loaded!");

// 状态类型有 incomplete notattempt
var interval=setInterval(function(){
	$($("span.incomplete")[0]).parent().find("a").click()
},5000);

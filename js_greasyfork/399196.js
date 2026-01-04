// ==UserScript==
// @name         欢迎界面展示
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  脚本：展现给用户美好的一天
// @author       xiongbai
// @include      *
// @match        http://write.blog.csdn.net/mdeditor
// @grant        none
// @exclude      http://diveintogreasemonkey.org/*
// @exclude      http://www.diveintogreasemonkey.org/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js  
// @downloadURL https://update.greasyfork.org/scripts/399196/%E6%AC%A2%E8%BF%8E%E7%95%8C%E9%9D%A2%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/399196/%E6%AC%A2%E8%BF%8E%E7%95%8C%E9%9D%A2%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function (){
	//your code ...
	var openDiv=document.createElement('div');
	openDiv.id="content";
	openDiv.style.width=300+"px";
	openDiv.style.height=200+"px";
	openDiv.style.backgroundColor="red";
	document.body.appendChild(openDiv);
})()

// ==UserScript==
// @name         b站正在直播用户 直播封面提取 脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  来到用户个人页，点击直播间旁边“下载封面”按钮即可
// @author       You
// @match        https://space.bilibili.com/*
// @grant        none
// @icon         http://bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445745/b%E7%AB%99%E6%AD%A3%E5%9C%A8%E7%9B%B4%E6%92%AD%E7%94%A8%E6%88%B7%20%E7%9B%B4%E6%92%AD%E5%B0%81%E9%9D%A2%E6%8F%90%E5%8F%96%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/445745/b%E7%AB%99%E6%AD%A3%E5%9C%A8%E7%9B%B4%E6%92%AD%E7%94%A8%E6%88%B7%20%E7%9B%B4%E6%92%AD%E5%B0%81%E9%9D%A2%E6%8F%90%E5%8F%96%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	var img_src = document.getElementsByClassName("i-live-cover")[0].src;
	var live_div = document.getElementsByClassName("i-live")[0];
	var btn = document.createElement("button");
	btn.innerText = "下载封面";
	btn.style.width = "100px";
	btn.style.height = "30px";
	btn.onclick = function() {
		window.open(img_src, '_blank');
	};
	
	live_div.appendChild(btn);
})
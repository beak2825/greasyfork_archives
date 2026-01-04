// ==UserScript==
// @name         洛谷个人主页个性化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可用一套语言拓展洛谷主页文字，图片的局限性 包括iframe和video等等功能
// @author       Haraki
// @match        https://www.luogu.com.cn/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422225/%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E4%B8%AA%E6%80%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/422225/%E6%B4%9B%E8%B0%B7%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5%E4%B8%AA%E6%80%A7%E5%8C%96.meta.js
// ==/UserScript==


function doit() {
	var a = document.querySelectorAll(".introduction p,h1,h2,h3,h4,h5,h6");
	var s, plc, fml;
	for (var i = 0; i < a.length; i++) {
		if (a[i].innerText.substr(0, 7) == "%align%") {
			a[i].innerText = a[i].innerText.substring(7, a[i].innerText.length);
			s = a[i].getAttribute("style");
			if (s == null) s = "";
			a[i].setAttribute("style", s + "text-align:center;");
		}
		if (a[i].innerText.substr(0, 6) == "%color") {
			var col = a[i].innerText.substr(6, 8);
			a[i].innerText = a[i].innerText.substring(15, a[i].innerText.length);
			s = a[i].getAttribute("style");
			if (s == null) s = "";
			a[i].setAttribute("style", s + "color" + col + ";");
		}
		if (a[i].innerText.substr(0, 12) == "%font-family") {
			plc = a[i].innerText.indexOf('%', 1);
			fml = a[i].innerText.substr(12, plc - 12);
			a[i].innerText = a[i].innerText.substring(plc + 1, a[i].innerText.length);
			s = a[i].getAttribute("style");
			if (s == null) s = "";
			a[i].setAttribute("style", s + "font-family" + fml + ";");
		}
		if (a[i].innerText.substr(0, 10) == "%font-size") {
			plc = a[i].innerText.indexOf('%', 1);
			fml = a[i].innerText.substr(10, plc - 10);
			a[i].innerText = a[i].innerText.substring(plc + 1, a[i].innerText.length);
			s = a[i].getAttribute("style");
			if (s == null) s = "";
			a[i].setAttribute("style", s + "font-size" + fml + ";");
		}
		if (a[i].innerText.substr(0, 6) == "%video") {
			plc = a[i].innerText.indexOf('%', 1);
			fml = a[i].innerText.substr(7, plc - 7);
			a[i].innerText = "";
			var vdo = document.createElement("video");
			vdo.setAttribute("src", fml);
			vdo.setAttribute("controls", "controls");
			vdo.setAttribute("style", "width:100%;height:auto;");
			vdo.innerText = "您的浏览器不支持 video 标签。";
			document.querySelector(".introduction").insertBefore(vdo, a[i].nextSibling);

		}
		if (a[i].innerText.substr(0, 7) == "%iframe") {
			plc = a[i].innerText.indexOf('%', 1);
			fml = a[i].innerText.substr(8, plc - 8);
			a[i].innerText = "";
			var ifr = document.createElement("iframe");
			ifr.setAttribute("src", fml);
			ifr.setAttribute("width", "100%");
			ifr.setAttribute("height", "500px");
			ifr.setAttribute("seamless", "");
			ifr.innerText = "您的浏览器不支持 iframe 标签。";
			document.querySelector(".introduction").insertBefore(ifr, a[i].nextSibling);

		}

	}
}
(function() {
	'use strict';
	var k = window.setInterval(doit, 500);
})();

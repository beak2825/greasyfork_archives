// ==UserScript==
// @name         馒头预览图右移
// @namespace    http://tampermonkey.net/
// @version      0.2
// @include     *://*.m-team.cc/*
// @description  适用于馒头站，种子列表预览图右移
// @author       You
// @match        https://kp.m-team.cc/adult.php?cat=412
// @icon         https://www.google.com/s2/favicons?domain=m-team.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434814/%E9%A6%92%E5%A4%B4%E9%A2%84%E8%A7%88%E5%9B%BE%E5%8F%B3%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/434814/%E9%A6%92%E5%A4%B4%E9%A2%84%E8%A7%88%E5%9B%BE%E5%8F%B3%E7%A7%BB.meta.js
// ==/UserScript==

(function() {
	var insertCSS = function(cssStyle) {
		var style = document.createElement("style");
		var theHead = document.head || document.getElementsByTagName('head')[0];
		style.type = "text/css";
		if (style.styleSheet) {
			var ieInsertCSS = function() {
				try {
					style.styleSheet.cssText = cssStyle;
				} catch(e) {}
			};
			//若当前styleSheet不能使用，则放到异步中
			if (style.styleSheet.disable) {
				setTimeout(ieInsertCSS, 10);
			} else {
				ieInsertCSS();
			}
		} else { //W3c浏览器
			style.appendChild(document.createTextNode(cssStyle));
			theHead.appendChild(style);
		}
	}
	insertCSS('[id^="tid"]{left: 500px !important}')
})();
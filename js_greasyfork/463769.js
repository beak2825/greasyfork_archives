// ==UserScript==
// @name         禁用知乎外链中转直接跳到目标网站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎链接
// @author       You
// @match        *.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463769/%E7%A6%81%E7%94%A8%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E4%B8%AD%E8%BD%AC%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0%E7%9B%AE%E6%A0%87%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/463769/%E7%A6%81%E7%94%A8%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E4%B8%AD%E8%BD%AC%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0%E7%9B%AE%E6%A0%87%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function () {
	"use strict";
  // v1 跳转过去更改url
	// let changeUrl = (function () {
	// 	let reg = /zhihu\.com\/\?target=[^]*/;
	// 	let url = location.href;
	// 	if (reg.test(url)) {
	// 		location.href = decodeURIComponent(location.href.split("target=")[1]);
	// 	}
	// })();

	// let scriptNode = document.createElement("script");
	// scriptNode.appendChild = changeUrl;
  // document.head.insertBefore(scriptNode, document.head.firstChild);
  

  //v2 点击后更新链接,如果使用监听事件,则带有href属性的目标元素获取繁琐
  window.addEventListener(
	"click",
	function (e) {
		let links = document.querySelectorAll('a[href^="https://link.zhihu.com/?target="]');
		for (let i = 0; i < links.length; i++) {
			let link = links[i];
			let url2 = decodeURIComponent(link.href.split("target=")[1]);
			link.href = url2;
		}
	},
	{ useCapture: true }
);
})();
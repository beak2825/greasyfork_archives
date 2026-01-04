// ==UserScript==
// @name         Site Quick Open网页快开
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Click on the lower left button in the search engine, quickly open all websites.(Please allow the browser to redirect many times). 点击左下角按钮帮您快速打开搜索引擎的所有链接(请先允许浏览器多次重定向)
// @author       Exisi
// @match        *://*.baidu.com/s*
// @match        *://*.google.com.*/search*
// @match        *://*.google.com/search*
// @match        *://*.google.com.hk/search*
// @match        *://*.bing.com/search*
// @match        *://*.yahoo.com/search*
// @match        *://*.yandex.com/search*
// @downloadURL https://update.greasyfork.org/scripts/440899/Site%20Quick%20Open%E7%BD%91%E9%A1%B5%E5%BF%AB%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/440899/Site%20Quick%20Open%E7%BD%91%E9%A1%B5%E5%BF%AB%E5%BC%80.meta.js
// ==/UserScript==
(function () {
	"use strict";
	// ready
	let data = [
		{
			name: "bing",
			resultItemSelector: "#b_content li.b_algo",
			aSelector: "h2 a",
			contentSelector: "#b_content",
		},
		{
			name: "baidu",
			resultItemSelector: ".c-container.new-pmd:has(h3):not(.c-gap-top)",
			aSelector: "h3 a",
			contentSelector: "#wrapper",
		},
		{
			name: "google",
			resultItemSelector: "#search div.g",
			aSelector: "span a",
			contentSelector: "#main",
		},
		{
			name: "yahoo",
			resultItemSelector: ".searchCenterMiddle .algo",
			aSelector: ".compTitle a",
			contentSelector: "#results",
		},
		{
			name: "yandex",
			resultItemSelector: ".content__left ul li",
			aSelector: ".OrganicTitle-Link",
			contentSelector: ".main.serp.i-bem",
		},
	];
	// get the site type
	let url = window.location.href;
	let type = data.findIndex((item) => url.includes(item.name));

	let titleItems = document.querySelectorAll(data[type].resultItemSelector);

	if (!titleItems) {
		return;
	}

	//add button
	let btn = document.createElement("input");
	btn.setAttribute("type", "button");
	btn.setAttribute("value", "🚀");
	btn.setAttribute("id", "startBtn");
	btn.style.background = "pink";
	btn.style.color = "white";
	btn.style.fontWeight = "500";
	btn.style.width = "50px";
	btn.style.height = "50px";
	btn.style.borderRadius = "100px";
	btn.style.fontSize = "14px";
	btn.style.position = "fixed";
	btn.style.border = "1px pink solid";
	btn.style.bottom = 0;
	btn.style.left = 0;
	btn.style.outline = "none";
	btn.style.margin = "25px";
	btn.addEventListener("click", function () {
		quickOpen(titleItems);
	});
	document.querySelector(data[type].contentSelector).append(btn);

	// openlink
	function quickOpen(titleItems) {
		Array.from(titleItems).forEach((titleItem) => {
			// // check for the presence of the ublacklist chrome plugin
			// // check for the presence of the ac-baidu script
			if (titleItem.getAttribute("data-ub-blocked") || titleItem.getAttribute("ac-needhide")) {
				return;
			}

			let aTile = titleItem.querySelector(data[type].aSelector);

			if (!aTile) {
				return;
			}

			let target = document.createElement("a");
			target.setAttribute("href", aTile.getAttribute("href"));
			target.setAttribute("target", "_blank");
			target.click();
		});
	}
})();

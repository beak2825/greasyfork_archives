// ==UserScript==
// @name         anti-bilibili-anit-antiAD
// @version      0.2.2
// @description  fk bilibili anti-antiAD 去除顶部反反广告插件的提示，并且如果是手机网页跳转pc网页
// @author       WiSHao
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-body
// @license      ISC
// @grant        none
// @namespace https://greasyfork.org/users/1103837
// @downloadURL https://update.greasyfork.org/scripts/468906/anti-bilibili-anit-antiAD.user.js
// @updateURL https://update.greasyfork.org/scripts/468906/anti-bilibili-anit-antiAD.meta.js
// ==/UserScript==

(function () {
	'use strict';
	window.onload = () => {
		window.setTimeout(() => {
			let ad = document.querySelector('.adblock-tips');
			if (ad != null) {
				ad.remove();
			}
		}, 300);
	};

	window.setInterval(() => {
		let ad = document.querySelector('.adblock-tips');
		if (ad != null) {
			ad.remove();
		}
	}, 10000);

	let url = window.location.href;
	let regExp = /(https?:\/\/)(www\.)?(m\.)(bilibili\.com\/.*)/i;
	let match = url.match(regExp);
	if (match) {
		let newUrl = match[1] + (match[2] ? match[2] : '') + match[4];
		window.location.href = newUrl;
	}
})();

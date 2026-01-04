// ==UserScript==
// @name        微信公众号后台 title显示公众号名称
// @namespace   Violentmonkey Scripts
// @match       https://mp.weixin.qq.com/*
// @grant       ShowLee
// @version     1.0
// @author      -
// @description 2023/2/4 09:34:28
// @license     MIT
// @require     https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/459411/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%20title%E6%98%BE%E7%A4%BA%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459411/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8E%E5%8F%B0%20title%E6%98%BE%E7%A4%BA%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==


setTimeout(function() {

	var nTit = $("div.weui-desktop-account__fold-info a:first").text();

	document.title = nTit;

	setInterval(function() {
		let nTitle2 = $(".weui-desktop-page__title").text();
		let nTitle = nTit + " > " + nTitle2;
		document.title = nTitle;
	}, 3000);

}, 2500);
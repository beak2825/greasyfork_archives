// ==UserScript==
// @name         SANU搜索脚本系列 — 全网 VIP 视频破解去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全网VIP视频免费破解。支持：腾讯、爱奇艺、优酷、芒果、pptv、乐视等其它网站。
// @author       SANU搜索
// @match        *://v.qq.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.bilibili.com/*
// @match        *://tv.sohu.com/*
// @match        *://movie.douban.com/*
// @icon         https://www.uuugz.com/lib/logo.svg
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/471365/SANU%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC%E7%B3%BB%E5%88%97%20%E2%80%94%20%E5%85%A8%E7%BD%91%20VIP%20%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/471365/SANU%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC%E7%B3%BB%E5%88%97%20%E2%80%94%20%E5%85%A8%E7%BD%91%20VIP%20%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var title = "";
	var videourl = window.location.href;
	var link = document.createElement('a');
	link.setAttribute('class', 'uuugz')
	link.setAttribute('title', '点击前往观看')
	link.style.position = 'fixed';
	link.style.top = '274px';
	link.style.left = '0';
	link.style.zIndex = '9999';
	link.style.cursor = 'pointer';
	var img = document.createElement('img');
	img.src = 'https://www.uuugz.com/lib/logo.svg';
	img.style.width = '50px';
	img.style.background = '#fff';
	img.style.borderRadius = '5px';
	link.appendChild(img);
	document.body.appendChild(link);
	function tiaozhuan(title) {
		if (title) {
			window.open(`https://www.uuugz.com/s/${title}`);
		} else {
			window.open(`https://www.uuugz.com`);
		};
	};
	function isAttributey(selects) {
		title = document.querySelector(selects);
		if (title) {
			title = title.textContent;
			tiaozhuan(title);
		} else {
			tiaozhuan(null);
		};
	};
	function bianli(shuxing, name, dengyu, zhi) {
		var headele = document.head.outerHTML;
		if (headele.indexOf(dengyu) !== -1) {
			var metaTags = document.querySelectorAll(shuxing);
			for (var i = 0; i < metaTags.length; i++) {
				title = metaTags[i].getAttribute(name);
				if (title === dengyu) {
					title = metaTags[i].getAttribute(zhi);
					tiaozhuan(title);
				}
			};
		} else {
			tiaozhuan(null);
		}
	};
	link.addEventListener('click', function() {
		if (videourl.indexOf('iqiyi') !== -1) {
			bianli("meta", "name", "irAlbumName", "content");
		};
		if (videourl.indexOf('v.qq.com') !== -1) {
			isAttributey(".playlist-intro__title");
		};
		if (videourl.indexOf('mgtv.com') !== -1) {
			isAttributey("div.m-aside-header.m-aside-header-ie > div > h2 > div");
		};
		if (videourl.indexOf('youku.com') !== -1) {
			isAttributey(".contents-wrap.contentsNode > div.new-title-wrap > h3")
		};
		if (videourl.indexOf('le.com') !== -1) {
			isAttributey(".column_right.le_jujibox > div > div.juji_bar.j_jujiName");
		};
		if (videourl.indexOf('bilibili.com') !== -1) {
			bianli("meta", "property", "og:title", "content");
		};
		if (videourl.indexOf('tv.sohu.com') !== -1) {
			tiaozhuan(null);
		};
        if (videourl.indexOf('movie.douban.com') !== -1) {
			bianli("meta", "property", "og:title", "content");
		};
	});
})();
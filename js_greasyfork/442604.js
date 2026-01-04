// ==UserScript==
// @name         还你一个干净清爽的百度百科页面，还支持百度经验，移除了秒懂百科这sb
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  去除百度百科、百度经验页面上的声明、秒懂百科、TA说等与条目介绍相关性不强的sb信息
// @author       hellodk
// @match        https://*.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442604/%E8%BF%98%E4%BD%A0%E4%B8%80%E4%B8%AA%E5%B9%B2%E5%87%80%E6%B8%85%E7%88%BD%E7%9A%84%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2%EF%BC%8C%E8%BF%98%E6%94%AF%E6%8C%81%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%EF%BC%8C%E7%A7%BB%E9%99%A4%E4%BA%86%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%E8%BF%99sb.user.js
// @updateURL https://update.greasyfork.org/scripts/442604/%E8%BF%98%E4%BD%A0%E4%B8%80%E4%B8%AA%E5%B9%B2%E5%87%80%E6%B8%85%E7%88%BD%E7%9A%84%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E9%A1%B5%E9%9D%A2%EF%BC%8C%E8%BF%98%E6%94%AF%E6%8C%81%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%EF%BC%8C%E7%A7%BB%E9%99%A4%E4%BA%86%E7%A7%92%E6%87%82%E7%99%BE%E7%A7%91%E8%BF%99sb.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var domain = document.domain;
	var classNames = [];
	var idNames = [];
	switch (domain) {
		case 'baike.baidu.com':
			classNames = ['secondsknow-large-container', 'J-wgt-seconds-know-container', 'J-secondsknow-large-container'];
			idNames = ['J-declare', 'tashuo_bottom'];
			break;
		case 'jingyan.baidu.com':
			names = ['feeds-video-box', 'feeds-video-one-view'];
			break;
	};
	if (classNames) {
		var index;
		var removeIt = false;
		for (index in classNames) {
			var sb = document.getElementsByClassName(classNames[index])[0];
			if (sb) {
				sb.remove();
				removeIt = true;
			};
			if (removeIt) {
				console.log('remove it success!');
			}
			else {
				console.log('have not found ' + index);
			};
		};
	}
	else {
		console.log('current web page is not matched our target.');
	};
	if (idNames) {
		var index;
		var removeIt = false;
		for (index in idNames) {
			var sb = document.getElementById(idNames[index]);
			if (sb) {
				sb.remove();
				removeIt = true;
			};
			if (removeIt) {
				console.log('remove it success!');
			}
			else {
				console.log('have not found ' + index);
			};
		};
	}
	else {
		console.log('current web page is not matched our target.');
	};
})();

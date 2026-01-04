// ==UserScript==
// @name         还我干净清爽百度百科！
// @namespace    https://github.com/hellodk34/refresh-baidu-baike
// @version      1.0.4
// @license      GNU General Public License v3.0
// @description  去除百度百科、百度经验页面上的声明、秒懂百科、TA说等与条目介绍相关性不强的sb信息
// @author       hellodk
// @match        https://*.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/442605/%E8%BF%98%E6%88%91%E5%B9%B2%E5%87%80%E6%B8%85%E7%88%BD%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/442605/%E8%BF%98%E6%88%91%E5%B9%B2%E5%87%80%E6%B8%85%E7%88%BD%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%EF%BC%81.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var domain = document.domain;
	var classNames = [];
	var idNames = [];
	switch (domain) {
		// switch 让未来可支持更多百度系 web page；class 和 id 的数组让未来能处理更多的页面元素，为的就是干净清爽的页面
		case 'baike.baidu.com':
			classNames = ['navbar-bg-top', 'secondsknow-large-container', 'J-wgt-seconds-know-container', 'J-secondsknow-large-container', 'num', 'topA'];
			idNames = ['J-declare', 'tashuo_bottom', 'tashuo_right'];
			break;
		case 'jingyan.baidu.com':
			classNames = ['feeds-video-box', 'feeds-video-one-view', 'clearfix feeds-video-box'];
			idNames = ['cms-slide-img', 'exp-player-video-container'];
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
				console.log('remove' + sb + 'success!');
			}
			else {
				console.log('have not found ' + sb);
			};
		};
	}
	else {
		console.log('current web page is not matched our target.');
	};

	if (idNames) {
		var index2;
		var removeIt2 = false;
		for (index2 in idNames) {
			var sb2 = document.getElementById(idNames[index2]);
			if (sb2) {
				sb2.remove();
				removeIt2 = true;
			};
			if (removeIt2) {
				console.log('remove ' + sb2 + 'success!');
			}
			else {
				console.log('have not found ' + sb2);
			};
		};
	}
	else {
		console.log('current web page is not matched our target.');
	};
})();

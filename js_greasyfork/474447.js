// ==UserScript==
// @name         拉长B站合集列表
// @namespace    https://greasyfork.org/zh-CN/scripts/474447
// @version      0.5
// @description  哔哩哔哩的推荐机制很差，但是很自信，所以我把合集列表高度拉长，把不相关的推荐视频挤到下面去。
// @author       beibeibeibei
// @license      MIT
// @match        *.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474447/%E6%8B%89%E9%95%BFB%E7%AB%99%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/474447/%E6%8B%89%E9%95%BFB%E7%AB%99%E5%90%88%E9%9B%86%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let 自定义高度 = 597;
	let 检测时间间隔 = 2000;

	let timer = setInterval(() => {
		requestIdleCallback((deadline) => {
			if (deadline.timeRemaining() > 0) {
				// 使用搜索引擎搜索如下链接查找合集：https://space.bilibili.com/*/channel/collectiondetail
				let 容器 = document.querySelector("div.video-pod__body");
				let 合集名称容器高度 = 10;
				try { 合集名称容器高度 = parseInt(getComputedStyle(document.querySelector("div.video-pod__header1")).height); } catch (_) {}

				if (容器 && 自定义高度 - 合集名称容器高度 > 0) {
					容器.style.maxHeight = (自定义高度 - 合集名称容器高度) + 'px';
				}
			}
		}, {
			timeout: parseInt(检测时间间隔 / 2)
		});
	}, 检测时间间隔);

	// Your code here...
})();

// ==UserScript==
// @name         美卡论坛高亮点赞和回应
// @version      0.10.0
// @description  高亮美卡论坛帖子的点赞和回应(姚明,troll...)并贴靠到左侧显示，方便爬楼
// @author       zhangxinyi1719@gmail.com
// @include      http*://*uscardforum.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uscardforum.com
// @namespace    https://greasyfork.org/users/767596
// @downloadURL https://update.greasyfork.org/scripts/514240/%E7%BE%8E%E5%8D%A1%E8%AE%BA%E5%9D%9B%E9%AB%98%E4%BA%AE%E7%82%B9%E8%B5%9E%E5%92%8C%E5%9B%9E%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/514240/%E7%BE%8E%E5%8D%A1%E8%AE%BA%E5%9D%9B%E9%AB%98%E4%BA%AE%E7%82%B9%E8%B5%9E%E5%92%8C%E5%9B%9E%E5%BA%94.meta.js
// ==/UserScript==

(function () {
	'use strict';

	let style = document.createElement('style');
	document.head.appendChild(style);
	style.sheet.insertRule('.post-controls { display: inline-flex !important; }', 0);
	style.sheet.insertRule('.reactions-counter { color: #39c5bb !important; font-weight: bold !important; }', 1);
})();
// ==UserScript==
// @name        移除哔哩哔哩直播马赛克
// @description 移除常见于游戏分区的马赛克
// @author      qianxu
// @version     1.0.2
// @match       https://live.bilibili.com/*
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   remove-bilibili-live-mask
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/506112/%E7%A7%BB%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/506112/%E7%A7%BB%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(() => {
	const removeMask = setInterval(() => {
		document.querySelector("#web-player-module-area-mask-panel")?.remove();
	}, 1000);

	setTimeout(() => {
		clearInterval(removeMask);
	}, 10000);
})();

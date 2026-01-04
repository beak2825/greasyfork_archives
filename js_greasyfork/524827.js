// ==UserScript==
// @name         B站视频框放大
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  放大B站视频框布局, 最大化利用浏览器页面
// @author       yy
// @match        *://www.bilibili.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524827/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%A1%86%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/524827/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%A1%86%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

GM_addStyle(`

	/* 设置宽屏布局 */
	.video-info-container[data-v-fe6ec38e],
	.video-info-container[data-v-1be0114a] {
		height: 75px;
		padding-top: 12px;
	}
	.left-container {
		width: 1080px;
	}
	#playerWrap {
		height: 654px;
	}
	#bilibili-player {
		width: 100%;
		height: 100%;
	}

.playlist-container--left {
    width: 1080px;
}
`);
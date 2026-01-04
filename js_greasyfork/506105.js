// ==UserScript==
// @name        哔哩哔哩直播自动跳转到纯净版直播间
// @description 自动跳转到无各种活动的直播间
// @author      qianxu
// @version     1.1.3
// @match       https://live.bilibili.com/*
// @run-at      document-start
// @icon        https://www.bilibili.com/favicon.ico
// @namespace   bilibili-auto-redirect-to-blanc-live-room
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/506105/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%BA%AF%E5%87%80%E7%89%88%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/506105/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%BA%AF%E5%87%80%E7%89%88%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==

(() => {
	const url = location.href;
	const reg = /https:\/\/live\.bilibili\.com\/\d+.*/;

	if (reg.test(url)) {
		const roomId = url.match(/\d+/)[0];
		location.href = `https://live.bilibili.com/blanc/${roomId}`;
	}
})();

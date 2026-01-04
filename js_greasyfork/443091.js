// ==UserScript==
// @name         自动收起bilibili弹幕列表
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  五秒之内自动收起弹幕列表
// @author       zerozawa
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.notification
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443091/%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7bilibili%E5%BC%B9%E5%B9%95%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/443091/%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7bilibili%E5%BC%B9%E5%B9%95%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function () {
	"use strict";
	let click = function (i) {
		setTimeout(function () {
			if (
				document.getElementsByClassName("player-auxiliary-filter-title")[0] &&
				!document.getElementsByClassName("bui-collapse-wrap bui-collapse-wrap-folded")[0]
			) {
				document.getElementsByClassName("player-auxiliary-filter-title")[0].click();
			}
		}, i);
    };
    click(5000);
    click(10000);
})();
// ==UserScript==
// @name            隐藏哔哩哔哩直播礼物公告
// @namespace       moe.kotori.bililivetools
// @version         0.0.1
// @description     隐藏哔哩哔哩直播的占用空间巨大的全服礼物公告。
// @author          Zyzsdy
// @match           http://live.bilibili.com/*
// @match           https://live.bilibili.com/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/36669/%E9%9A%90%E8%97%8F%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E5%85%AC%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/36669/%E9%9A%90%E8%97%8F%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E5%85%AC%E5%91%8A.meta.js
// ==/UserScript==

(function(){
	var styleNode = document.createElement("style");
	styleNode.type = "text/css";
	var rule = document.createTextNode(".bilibili-live-player-video-gift{display:none;}");
	styleNode.appendChild(rule);
	document.getElementsByTagName("head")[0].appendChild(styleNode);
})();
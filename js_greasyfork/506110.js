// ==UserScript==
// @name        禁止直播平台 PCDN 上传
// @description 阻止直播平台占用上行带宽和消耗流量
// @author      qianxu
// @version     1.1.2
// @match       https://*.huya.com/*
// @match       https://*.douyu.com/*
// @match       https://live.bilibili.com/*
// @icon        https://www.huya.com/favicon.ico
// @namespace   block-live-pcdn
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/506110/%E7%A6%81%E6%AD%A2%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%20PCDN%20%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/506110/%E7%A6%81%E6%AD%A2%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%20PCDN%20%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(() => {
	window.RTCDataChannel = undefined;
	window.RTCPeerConnection = undefined;
	window.webkitRTCPeerConnection = undefined;
})();

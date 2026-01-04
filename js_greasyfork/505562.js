// ==UserScript==
// @name         Auto play in MPV
// @description  Automatically redirect to mpv player when playing online video
// @author       lxl66566
// @namespace    https://github.com/lxl66566/auto-play-in-mpv
// @version      0.1.2
// @icon 				 https://mpv.io/images/mpv-logo-128-0baae5aa.png
// @run-at       document-start
// @license      MIT
// @grant        window.close
// @match        *://*.bilibili.com/*
// @match        *://bilibili.com/*
// @match        *://youtube.com/*
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/505562/Auto%20play%20in%20MPV.user.js
// @updateURL https://update.greasyfork.org/scripts/505562/Auto%20play%20in%20MPV.meta.js
// ==/UserScript==

(function () {
	// rome-ignore lint/suspicious/noRedundantUseStrict:
	"use strict";

	// 要拦截的URL模式
	const targetPatterns = [
		"https://www.bilibili.com/video/*",
		"https://live.bilibili.com/*",
		"https://www.bilibili.com/bangumi/play/*",
		"https://www.youtube.com/watch*",
		"https://www.youtube.com/playlist*",
	];

	const socket = new WebSocket("ws://localhost:5777");
	socket.onopen = function () {
		console.log("WebSocket connection established");
	};
	socket.onmessage = function (event) {
		console.log("Message from server: ", event.data);
	};
	socket.onclose = function () {
		console.log("WebSocket connection closed");
	};
	socket.onerror = function (error) {
		console.error("WebSocket error: ", error);
	};

	function sendUrlToServerAndClose(url) {
		if (socket.readyState === WebSocket.OPEN) {
			socket.send(url);
			console.log("auto-play-in-mpv: url send to socket");

			// close window if received any ack message
			socket.onmessage = function (event) {
				console.log("auto-play-in-mpv: received ack server");
				socket.close();
				window.close();
			};
		} else {
			console.error("WebSocket is not open");
			// do not close window
		}
	}

	function trigger() {
		const url = window.location.href;
		console.log("auto-play-in-mpv: get url: ", url);
		if (targetPatterns.some((pattern) => url.match(pattern))) {
			console.log("auto-play-in-mpv: url match");
			sendUrlToServerAndClose(url);
		}
	}

	window.addEventListener("DOMContentLoaded", trigger, false); // for bilibili
	window.addEventListener("hashchange", trigger, false); // for youtube

	// const originalOpen = window.open;
	// window.open = function (url, ...args) {
	// 	console.log("捕获到新页面打开请求:", url);
	// 	// return originalOpen.call(window, url, ...args); // 若允许则执行
	// 	return null; // 若阻止则返回 null
	// };
})();

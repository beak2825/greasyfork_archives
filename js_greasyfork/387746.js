// ==UserScript==
// @name         极客时间视频播放优化
// @namespace    Yx
// @version      1.4
// @description  try to take over the world!
// @icon         http://tvax4.sinaimg.cn/crop.0.0.996.996.180/006d9cayly8fpqt30cr2ej30ro0ro74u.jpg?Expires=1563811579&ssig=kCwD4wCfuy&KID=imgbed,tva
// @author       Yx_Zou
// @include      https://time.geekbang.org/course/detail/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387746/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/387746/%E6%9E%81%E5%AE%A2%E6%97%B6%E9%97%B4%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// 阻塞时间
	let time = 3000;
	// 初始赋值
	// 右键一次加时间(s)
	let addTime = -5;
	// 左键一次减时间(s)
	let lessTime = -5;
	window.onload = function() {
		setTimeout(function() {
			let dVideo = document.getElementsByTagName('video')[0];
			document.getElementsByClassName('_3JVQc9Vz_0')[0].addEventListener('click', dVideoUpdate);
			function dVideoUpdate() {
				setTimeout(function() {
					if (dVideo != document.getElementsByTagName('video')[0]) {
						dVideo = document.getElementsByTagName('video')[0];
					}
				}, 3000);
			}
			document.onkeydown = function(event) {
				let e = event || window.event;
				if (e && e.keyCode == 37) {
					//左
					console.log('左');
					dVideo.currentTime = dVideo.currentTime - lessTime < 0 ? 0 : dVideo.currentTime - lessTime;
				}
				if (e && e.keyCode == 39) {
					//右
					console.log('右');
					dVideo.currentTime =
						dVideo.currentTime + addTime > dVideo.duration ? dVideo.duration : dVideo.currentTime + addTime;
				}
			};
		}, time);
	};
})();

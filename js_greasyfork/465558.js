// ==UserScript==
// @name         moocHelper 智慧职教助手，新版智慧职教新版职教云
// @namespace    https://mooc.zzf4.top/
// @version      0.1
// @description  新版智慧职教、职教云课件视频自动完成，可选择倍速,全部功能请前往mooc.zzf4.top体验
// @author       Danyhug
// @match        https://course.icve.com.cn/learnspace/learn/learn/templateeight/content_video.action?*
// @downloadURL https://update.greasyfork.org/scripts/465558/moocHelper%20%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E5%8A%A9%E6%89%8B%EF%BC%8C%E6%96%B0%E7%89%88%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E6%96%B0%E7%89%88%E8%81%8C%E6%95%99%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/465558/moocHelper%20%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E5%8A%A9%E6%89%8B%EF%BC%8C%E6%96%B0%E7%89%88%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99%E6%96%B0%E7%89%88%E8%81%8C%E6%95%99%E4%BA%91.meta.js
// ==/UserScript==

(function() {
	'use strict';

	window.onload = function() {
		alert('由于浏览器限制，脚本只做到了静音+倍速，全部功能请前往mooc.zzf4.top体验');
		// 暂停按钮
		var event = new MouseEvent('click', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});

		function checkVideoElement() {
			var video = document.querySelector("video");
			if (video) {
				console.log("Found video element:");

				video.playbackRate = 2;
				video.muted = true;
				let status = document.querySelector('video').paused;
				// 点击开始按钮
				if (status) {
					document.querySelector('#container').dispatchEvent(event);
				}


				// 查看当前课程是否完成
				// video.addEventListener('ended', function() {
				// 	// 完成后自动获取新视频，第一个未完成的就是新视频
				// 	let videos = document.querySelector('#screen_narrow').querySelectorAll(
				// 		'.s_learn_video');
				// 	videos[1].dispatchEvent(event);
				// 	console.log('到我了！')
				// })

			} else {
				console.log("No video element found, continue checking...");
			}
		}

		// 每隔 1 秒钟检测一次页面中是否有 video 元素
		var intervalId = setInterval(checkVideoElement, 1000);
	}
})();
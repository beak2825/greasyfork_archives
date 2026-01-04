// ==UserScript==
// @name         湖南省高等学历继续教育视频跳过
// @namespace    http://tampermonkey.net/
// @version      1.0
// @foo 
// @description 进入视频后自动跳到末尾，自动点击下一课
// @author       小Q
// @match https://www.jwstudy.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461857/%E6%B9%96%E5%8D%97%E7%9C%81%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/461857/%E6%B9%96%E5%8D%97%E7%9C%81%E9%AB%98%E7%AD%89%E5%AD%A6%E5%8E%86%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==
(function() {
	'use strict';
	var ii = 0;
	//自动获取未完成的视频点击进入
	if (window.location.href.includes("mycourselist.aspx")) {
		console.log('查询未完成视频....');
		window.onload = function() {
			const panelElems = document.querySelectorAll('.clh-panel');

			panelElems.forEach((panelElem) => {
				const lsPercentElem = panelElem.querySelector('.lsPercents');
				console.log(lsPercentElem.textContent);
				if (lsPercentElem.textContent !== "100%") {
					const keepLearningElem = panelElem.querySelector('.keepLearning');
					if (keepLearningElem) {
						// 在新的标签页中打开链接
						window.open(keepLearningElem.href, '_blank', 'noopener noreferrer');
					}
				}
			});
		};
	}
	//在学习视频页面
	if (window.location.href.includes("play")) {
		console.log('学习视频....');

		var video = document.getElementsByTagName('video')[0];
		video.volume = 0;
		video.addEventListener('loadedmetadata', function() {
			// 将视频的当前时间设置为总时长减去1秒
			video.currentTime = video.duration - 1;

		});
		setInterval(function() {
			for (var i = 0; i < document.getElementsByTagName('video')
				.length; i++) {
				var current_video = document.getElementsByTagName('video')[i];

				// 静音
				current_video.volume = 0;

				// 16倍速
				current_video.playbackRate = 16.0;

				// 视频播放结束后，模拟点击“下一课”
				if (current_video.ended) {
					const learnNextSectionElem = document.getElementById('learnNextSection');
					const computedStyle = getComputedStyle(learnNextSectionElem);
					if (computedStyle.display !== 'none') {
						// 元素存在时 自动下一课
						console.log("下一课");
						document.getElementById('learnNextSection')
							.click();
						current_video.currentTime = star_time.substring(0, 2) * 60;
					} else {
						// 元素不存在时 返回视频列表
						console.log("学习完成");
						document.getElementById('back-course')
							.click();




					}

				}

				// 如果视频被暂停
				if (current_video.paused) {
					current_video.play();
				}
			}
		}, 2000);

	}

})();
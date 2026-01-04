// ==UserScript==
// @name         英语精听5秒循环播放
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  由于大部分听力网站或app的音频的循环播放都是以一句为单位，但是很多时候一句太长。目前应用于新东方雅思，也可以简单修改选择器适配为其它网站。
// @author       You
// @match        https://ieltscat.xdf.cn/intensive/intensive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xdf.cn
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503406/%E8%8B%B1%E8%AF%AD%E7%B2%BE%E5%90%AC5%E7%A7%92%E5%BE%AA%E7%8E%AF%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/503406/%E8%8B%B1%E8%AF%AD%E7%B2%BE%E5%90%AC5%E7%A7%92%E5%BE%AA%E7%8E%AF%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(event) {
	// 检查是否按下了 Alt 键
	if (event.altKey) {
			var audioElement = document.querySelector("#centenceLs") || document.querySelector("#textLs");

			// 判断是否已经在循环播放
			if (!audioElement.isLooping) {
					// 标记当前状态为循环
					audioElement.isLooping = true;

					// 记录当前时间，计算循环起始点
					audioElement.loopEnd = audioElement.currentTime;
					audioElement.loopStart = Math.max(0, audioElement.loopEnd - 4);

					// 设置一个循环，每次播放时间达到循环结束点时重置为循环起始点
					audioElement.loopInterval = setInterval(function() {
							if (audioElement.currentTime >= audioElement.loopEnd) {
									audioElement.currentTime = audioElement.loopStart;
							}
					}, 300); // 检查间隔为100毫秒

			} else {
					// 如果已经在循环，则停止循环，恢复正常播放
					audioElement.isLooping = false;
					clearInterval(audioElement.loopInterval);
			}

			GM_notification({
				text: '开始/停止循环',
				timeout: 1000 // 通知显示时间，单位为毫秒
			});
	}


});


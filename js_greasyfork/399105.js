// ==UserScript==
// @name        超星 - 禁止暂停视频
// @description 不要停下来啊！（指视频）（不支持 Flash 视频）
// @namespace   UnKnown
// @author      UnKnown
// @version     1.0
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @match       *://*.chaoxing.com/ananas/modules/work/index.html
// @match       *://*.chaoxing.com/ananas/modules/video/index.html
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/399105/%E8%B6%85%E6%98%9F%20-%20%E7%A6%81%E6%AD%A2%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/399105/%E8%B6%85%E6%98%9F%20-%20%E7%A6%81%E6%AD%A2%E6%9A%82%E5%81%9C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

"use strict";

setTimeout(
	() => document.querySelectorAll('video').forEach(
		video => {

			// 清空暂停视频函数
			video.pause = () => {};

			// 下面这些应该也有效。

			// 不再响应暂停事件
		/*
			video.addEventListener(
				"pause", event => event.preventDefault()
			);
		*/

			// 暂停后自动点击播放按钮
		/*
			video.addEventListener(
				"pause", event => {
					const playButton =
						video.parentElement.querySelector(
							':scope button.vjs-play-control'
						);
					playButton && playButton.click();
				}
			);
		*/

		}
	), 3000
);
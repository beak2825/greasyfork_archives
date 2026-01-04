// ==UserScript==
// @name         【B站】分段/章节切换
// @namespace    http://tampermonkey.net/
// @version      20250816.1
// @description  ctrl+左右箭头切换分段/章节；在播放器栏左侧添加按钮点击快进到下一分段/章节
// @author       atakhalo
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546027/%E3%80%90B%E7%AB%99%E3%80%91%E5%88%86%E6%AE%B5%E7%AB%A0%E8%8A%82%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/546027/%E3%80%90B%E7%AB%99%E3%80%91%E5%88%86%E6%AE%B5%E7%AB%A0%E8%8A%82%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 跳转下一个章节
	function Jump(previous) {
		const cur = document.querySelector(".bpx-player-ctrl-viewpoint-text");
		const targetText = cur.textContent.trim().replace("章节 · ", "");
		// 遍历匹配并触发点击
		for (const li of document.querySelectorAll('.bpx-player-ctrl-viewpoint-menu li')) {
			if (li.textContent.trim() === targetText) {
				const toLi = previous == true ? li.previousElementSibling : li.nextElementSibling;
				if (toLi) {
					toLi.click(); // 触发下一个章节的点击事件
					return;
				}
				li.click();	// 没有下一个章节则触发本章节的
				return;
			}
		}
	}

	// 增加ctrl+左右箭头
	document.addEventListener('keydown', function (event) {
		if (event.altKey || event.shiftKey || event.metaKey)
			return;
		if (event.ctrlKey && event.key === 'ArrowLeft') {
			Jump(true);
		}
		else if (event.ctrlKey && event.key === 'ArrowRight') {
			Jump(false);
		}
	});

	// 往播放栏中添加子视频标题复制按钮
	function AddJumpButton() {
		// 创建按钮
		const container = document.querySelector('.bpx-player-control-bottom-left');
		const insertBeforeElement = container.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-viewpoint');
		if (container && insertBeforeElement) {

			const button = document.createElement('div');
			button.textContent = "下一段";
			button.addEventListener('click', Jump);

			// 在目标元素前插入按钮
			container.insertBefore(button, insertBeforeElement);
		}
	}

	// 网页有播放器才执行脚本内容
	function TryExecute() {
		const video = document.querySelector('.bpx-player-video-area');
		if (video) {
			window.setTimeout(AddJumpButton, 2000); // 等加载章节按钮，放到章节按钮后面
		}
	}
	TryExecute();
})();

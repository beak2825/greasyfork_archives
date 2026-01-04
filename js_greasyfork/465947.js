// ==UserScript==
// @name         B站播放器速度级别调整
// @namespace    Bilibili
// @version      2.0
// @description  将B站播放器的速度调整范围改成0.5~4.0
// @author       coder
// @match        *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465947/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%9F%E5%BA%A6%E7%BA%A7%E5%88%AB%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/465947/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%9F%E5%BA%A6%E7%BA%A7%E5%88%AB%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
(function() {
	'use strict';

	const observer = new MutationObserver(()=>{
		const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
		if (!menu) {
			return;
		}

		observer.disconnect();

		// 设置自定义速度值，单位为倍数
		const speeds = [4.0, 3.5, 3.0, 2.5, 2.0, 1.75, 1.5, 1.25, 1.0, 0.75, 0.5];

		// 删除原有菜单项
		const items = menu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item');
		items.forEach(item=>item.remove());

		// 创建新菜单项
		speeds.forEach(speed=>{
			const item = document.createElement('li');
			item.classList.add('bpx-player-ctrl-playbackrate-menu-item');
			item.setAttribute('data-value', speed.toString());
			item.textContent = speed.toString();
			menu.appendChild(item);
		});

		// 设置默认速度
		const defaultSpeed = 1.0;
		const activeItem = menu.querySelector('.bpx-player-ctrl-playbackrate-menu-item[data-value="' + defaultSpeed + '"]');
		if (activeItem) {
			activeItem.classList.add('bpx-state-active');
		}
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
})();
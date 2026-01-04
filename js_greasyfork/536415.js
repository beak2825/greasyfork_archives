// ==UserScript==
// @name         Busuu Audio Speed Controller Pro+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Triple speed control with persistent settings
// @author       郭立 leo
// @match        https://www.busuu.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @homepage     https://github.com/leeguooooo/Busuu-Audio-Speed-Controller
// @supportURL   https://github.com/leeguooooo/Busuu-Audio-Speed-Controller/issues
// @downloadURL https://update.greasyfork.org/scripts/536415/Busuu%20Audio%20Speed%20Controller%20Pro%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/536415/Busuu%20Audio%20Speed%20Controller%20Pro%2B.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// 配置参数
	const speeds = [1.0, 2.0, 3.0];
	let currentSpeed = GM_getValue('busuuSpeed', 2.0);
	let speedIndex = speeds.indexOf(currentSpeed);

	// 创建控制面板
	const panel = document.createElement('div');
	panel.innerHTML = `
			<style>
					.speed-panel {
							position: fixed;
							bottom: 30px;
							right: 30px;
							z-index: 2147483647;
							background: #4CAF50;
							color: white;
							border-radius: 25px;
							padding: 15px 25px;
							cursor: pointer;
							font-family: Arial, sans-serif;
							font-weight: bold;
							box-shadow: 0 4px 15px rgba(0,0,0,0.3);
							transition: all 0.3s;
							display: flex;
							align-items: center;
					}
					.speed-panel:hover {
							transform: scale(1.08);
							box-shadow: 0 6px 20px rgba(0,0,0,0.4);
					}
					.speed-badge {
							margin-right: 10px;
							font-size: 1.2em;
							min-width: 30px;
							text-align: center;
					}
			</style>
			<div class="speed-panel">
					<span class="speed-badge">${currentSpeed}x</span>
					<span>SPEED</span>
			</div>
	`;

	document.body.appendChild(panel);

	// 速度控制核心
	function enforceSpeed() {
			document.querySelectorAll('audio').forEach(audio => {
					if (audio.playbackRate !== currentSpeed) {
							audio.playbackRate = currentSpeed;
					}

					if (!audio.dataset.speedHooked) {
							const originalPlay = audio.play;
							audio.play = function() {
									this.playbackRate = currentSpeed;
									return originalPlay.apply(this, arguments);
							};
							audio.dataset.speedHooked = true;
					}
			});
	}

	// 切换速度
	function cycleSpeed() {
			speedIndex = (speedIndex + 1) % speeds.length;
			currentSpeed = speeds[speedIndex];
			panel.querySelector('.speed-badge').textContent = `${currentSpeed}x`;
			GM_setValue('busuuSpeed', currentSpeed);
			enforceSpeed();
	}

	// 事件监听
	panel.addEventListener('click', cycleSpeed);

	// 监控系统
	const observer = new MutationObserver(enforceSpeed);
	observer.observe(document, {
			childList: true,
			subtree: true
	});

	// 定时检查 + 立即执行
	setInterval(enforceSpeed, 500);
	enforceSpeed();

})();

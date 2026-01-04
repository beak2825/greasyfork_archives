// ==UserScript==
// @name         通用视频倍速控制器
// @namespace    http://tampermonkey.net/
// @version      20250816.1
// @description  1-9设置对应倍速，0设为0.5倍，+-调整0.5倍;在视频播放器内显示倍速和变速时间;
// @author       atakhalo
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546023/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546023/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// 当前控制的视频元素
	let currentVideo = null;
	// 倍速显示元素
	let speedDisplay = null;
	// 时间显示元素
	let timeDisplay = null;
	// 倍速提示的计时器
	let speedDisplayTimer = null;

	// 初始化函数
	function init() {
		// 查找当前视频元素
		findCurrentVideo();
		if (!currentVideo) return;

		// 确保视频容器有定位上下文
		const videoContainer = getVideoContainer(currentVideo);
		if (!videoContainer) return;

		// 创建倍速显示元素
		speedDisplay = document.createElement('div');
		speedDisplay.id = 'custom-speed-display';
		speedDisplay.style.cssText = `
            position: absolute;
            bottom: 60px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: #ffcc00;
            font-size: 28px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 8px;
            z-index: 1000;
            display: none;
            pointer-events: none;
            box-shadow: 0 0 15px rgba(255, 204, 0, 0.5);
            transition: opacity 0.3s;
        `;
		videoContainer.appendChild(speedDisplay);

		// 创建时间显示元素
		timeDisplay = document.createElement('div');
		timeDisplay.id = 'custom-time-display';
		timeDisplay.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            font-size: 16px;
            padding: 8px 15px;
            border-radius: 6px;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        `;
		videoContainer.appendChild(timeDisplay);

		// 监听键盘事件
		document.addEventListener('keydown', handleKeyPress, true); // true会吞掉点击，避免触发网站的快捷键

		// 监听页面变化，以便在动态加载视频时也能工作
		const observer = new MutationObserver(() => {
			if (!currentVideo || !document.contains(currentVideo)) {
				findCurrentVideo();
				if (currentVideo) {
					moveDisplaysToVideoContainer();
				}
			}
		});
		observer.observe(document, { childList: true, subtree: true });

		// 每秒更新一次时间显示
		setInterval(updateTimeDisplay, 1000);

		// 初始更新时间显示
		updateTimeDisplay();
	}

	// 获取视频容器
	function getVideoContainer(video) {
		// 尝试找到合适的容器
		let container = video.parentElement;
		while (container) {
			if (container.tagName === 'BODY') break;
			const style = window.getComputedStyle(container);
			if (style.position !== 'static') {
				return container;
			}
			container = container.parentElement;
		}
		// 如果没有定位容器，使用body
		return document.body;
	}

	// 移动显示元素到视频容器
	function moveDisplaysToVideoContainer() {
		if (!currentVideo) return;

		const videoContainer = getVideoContainer(currentVideo);
		if (!videoContainer) return;

		if (speedDisplay && speedDisplay.parentNode !== videoContainer) {
			if (speedDisplay.parentNode) {
				speedDisplay.parentNode.removeChild(speedDisplay);
			}
			videoContainer.appendChild(speedDisplay);
		}

		if (timeDisplay && timeDisplay.parentNode !== videoContainer) {
			if (timeDisplay.parentNode) {
				timeDisplay.parentNode.removeChild(timeDisplay);
			}
			videoContainer.appendChild(timeDisplay);
		}
	}

	// 查找当前视频元素
	function findCurrentVideo() {
		// 优先选择正在播放的视频
		const playingVideos = Array.from(document.querySelectorAll('video')).filter(v => !v.paused);
		if (playingVideos.length > 0) {
			currentVideo = playingVideos[0];
			return;
		}

		// 其次选择有焦点的视频
		const focusedVideo = document.querySelector('video:focus');
		if (focusedVideo) {
			currentVideo = focusedVideo;
			return;
		}

		// 最后选择页面上第一个视频
		const firstVideo = document.querySelector('video');
		if (firstVideo) {
			currentVideo = firstVideo;
		}
	}

	// 处理按键事件
	function handleKeyPress(e) {
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
			return;

		// 如果焦点在可输入元素上，则不处理
		if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
			return;
		}

		// 查找当前视频
		findCurrentVideo();
		if (!currentVideo) return;

		// 确保显示元素在正确的容器中
		moveDisplaysToVideoContainer();

		let newSpeed = currentVideo.playbackRate;
		let speedUpdate = true;

		// 数字键1-9: 设置对应倍速
		if (e.key >= '1' && e.key <= '9') {
			newSpeed = parseInt(e.key);
		}
		// 数字0: 设置为0.5倍速
		else if (e.key === '0') {
			newSpeed = 0.5;
		}
		// +键: 增加0.5倍速
		else if (e.key === '+' || e.key === '=') {
			newSpeed = Math.min(currentVideo.playbackRate + 0.5, 16);
		}
		// -键: 减少0.5倍速
		else if (e.key === '-' || e.key === '_') {
			newSpeed = Math.max(currentVideo.playbackRate - 0.5, 0.1);
		}
		// *键: x2倍速
		else if (e.key === '*' || e.key === ']') {
			console.log(currentVideo.playbackRate * 2)
			newSpeed = Math.min(Math.ceil(currentVideo.playbackRate * 2), 16);
		}
		// /键: /2倍速
		else if (e.key === '/' || e.key === '[') {
			newSpeed = Math.max(currentVideo.playbackRate / 2, 0.1);
		}
		// 其他按键忽略
		else {
			return;
		}

		// 应用新速度
		currentVideo.playbackRate = newSpeed;

		// 显示倍速提示
		showSpeedDisplay(newSpeed);

		// 更新右上角时间显示
		updateTimeDisplay();

		// 快捷键生效时不再传播
		// 1. 阻止默认行为
		e.preventDefault();
		// 2. 停止事件传播
		e.stopImmediatePropagation();
		// 3. 停止事件在DOM树中进一步传播
		e.stopPropagation();
	}

	// 显示倍速提示
	function showSpeedDisplay(speed) {
		if (!speedDisplay) return;

		speedDisplay.textContent = speed.toFixed(1) + 'x';
		speedDisplay.style.display = 'block';
		speedDisplay.style.opacity = '1';

		// 清除之前的计时器
		if (speedDisplayTimer) clearTimeout(speedDisplayTimer);

		// 1秒后淡出
		speedDisplayTimer = setTimeout(() => {
			speedDisplay.style.opacity = '0';
			setTimeout(() => {
				speedDisplay.style.display = 'none';
			}, 300);
		}, 1000);
	}

	// 更新右上角时间显示（显示变速后时间）
	function updateTimeDisplay() {
		if (!currentVideo || !timeDisplay || isNaN(currentVideo.duration)) {
			if (timeDisplay) timeDisplay.style.display = 'none';
			return;
		}

		// 计算变速后的时间
		const speed = currentVideo.playbackRate;
		const actualCurrentTime = currentVideo.currentTime;
		const actualDuration = currentVideo.duration;

		// 变速后时间 = 原时间 / 速度
		const adjustedCurrentTime = actualCurrentTime / speed;
		const adjustedDuration = actualDuration / speed;

		// 格式化时间 (秒 -> mm:ss)
		function formatTime(seconds) {
			const min = Math.floor(seconds / 60);
			const sec = Math.floor(seconds % 60);
			return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
		}

		const current = formatTime(adjustedCurrentTime);
		const total = formatTime(adjustedDuration);

		timeDisplay.textContent = `${current} / ${total} (${speed.toFixed(1)}x)`;
		timeDisplay.style.display = 'block';
	}

	// 页面加载完成后初始化
	if (document.readyState === 'complete') {
		init();
	} else {
		window.addEventListener('load', init);
	}
})();

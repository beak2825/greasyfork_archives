// ==UserScript==
// @name         Video Control with Reload and Floating Window
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  为指定视频添加可移动的进度条、音量控制器、重新加载按钮和悬浮窗功能和去黑边
// @match        https://app.kosmi.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499232/Video%20Control%20with%20Reload%20and%20Floating%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/499232/Video%20Control%20with%20Reload%20and%20Floating%20Window.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let videoElement = null;
	let controller = null;
	let isDragging = false;
	let initialX = 0,
		initialY = 0;
	let lastX = 0,
		lastY = 0;
	let buttonCreated = false;
	let floatingWindow = null;

	function createController() {
		controller = document.createElement('div');
		controller.id = 'video-controller';
		controller.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            cursor: move;
            user-select: none;
            width: 300px;
            height: 233px;
            transition: width 0.3s, height 0.3s;
            display: none;
        `;
		controller.innerHTML = `
             <progress id="progress-bar" value="0" max="100" style="width: 100%; height: 10px; background-color: #444; cursor: pointer;"></progress>
            <div id="time-display" style="text-align: center; margin-top: 5px;">0:00 / 0:00</div>
            <div id="volume-container" style="display: flex; align-items: center; margin-top: 10px; cursor: pointer;">
                <span id="volume-icon" style="margin-right: 10px;">🔊</span>
                <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="1" style="flex-grow: 1; cursor: pointer;">
            </div>
            <button id="reload-button" style="width: 100%; margin-top: 10px; padding: 5px; background-color: #4CAF50; border: none; color: white; cursor: pointer;">重新加载视频控制</button>
            <button id="float-video-button" style="width: 100%; margin-top: 10px; padding: 5px; background-color: #2196F3; border: none; color: white; cursor: pointer;">创建悬浮视频窗口</button>
            <button id="video-remove-black" style="width: 100%; margin-top: 10px; padding: 5px; background-color: #FFA500; border: none; color: white; cursor: pointer;">视频去黑边</button>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <button class="size-button" data-action="increase-width" style="cursor: pointer;">宽度+</button>
                <button class="size-button" data-action="decrease-width"  style="cursor: pointer;">宽度-</button>
                <button class="size-button" data-action="increase-height"  style="cursor: pointer;">高度+</button>
                <button class="size-button" data-action="decrease-height"  style="cursor: pointer;">高度-</button>
            </div>
        `;
		document.body.appendChild(controller);
		return controller;
	}

	function createToggleButton() {
		if (!buttonCreated) {
			const button = document.createElement('button');
			button.textContent = '🎥';
			button.style.cssText = `
                position: fixed;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                padding: 5px;
                font-size: 20px;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: move;
                z-index: 9999;
            `;
			document.body.appendChild(button);

			let pos1 = 0,
				pos2 = 0;

			button.onmousedown = function(e) {
				e.preventDefault();
				isDragging = true;
				initialX = e.clientX;
				initialY = e.clientY;
				lastX = initialX;
				lastY = initialY;
				document.onmouseup = closeDragElement;
				document.onmousemove = throttle(buttonDrag, 16);
			};

			function buttonDrag(e) {
				if (!isDragging) return;
				e.preventDefault();
				pos1 = lastX - e.clientX;
				pos2 = lastY - e.clientY;
				lastX = e.clientX;
				lastY = e.clientY;

				button.style.top = (button.offsetTop - pos2) + "px";
				button.style.left = (button.offsetLeft - pos1) + "px";
			}

			function closeDragElement() {
				document.onmouseup = null;
				document.onmousemove = null;
				isDragging = false;
			}

			button.addEventListener('click', function() {
				if (controller.style.display === 'none') {
					controller.style.display = 'block';
				} else {
					controller.style.display = 'none';
				}
			});

			let isClicking = false;
			button.addEventListener('touchstart', function(e) {
				e.preventDefault();
				if (e.touches.length === 1) {
					isClicking = true;
					setTimeout(() => {
						if (isClicking) {
							if (controller.style.display === 'none' || controller.style.display === '') {
								controller.style.display = 'block';
							} else {
								controller.style.display = 'none';
							}
						}
					}, 200);
				} else {
					isClicking = false;
				}

				const touch = e.touches[0];
				initialX = touch.clientX - button.offsetLeft;
				initialY = touch.clientY - button.offsetTop;
				isDragging = true;
			});

			button.addEventListener('touchmove', function(e) {
				e.preventDefault();
				if (!isDragging) return;
				isClicking = false;
				const touch = e.touches[0];
				const newX = touch.clientX - initialX;
				const newY = touch.clientY - initialY;
				button.style.left = newX + 'px';
				button.style.top = newY + 'px';
			});

			button.addEventListener('touchend', function() {
				isDragging = false;
			});
		}
		buttonCreated = true;
	}

	// 让元素能在手机拖动
	function makeDraggable(element) {
		console.log('progressContainer1');
		let pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		let isDragging = false;

		element.onmousedown = dragMouseDown;
		element.ontouchstart = dragTouchStart;

		function dragMouseDown(e) {
			console.log('progressContainer2');
			if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
			isDragging = true;
		}

		function dragTouchStart(e) {
			console.log(e.target.tagName);
			console.log(e);
			if (e.target.tagName === 'BUTTON' || e.target.tagName === 'PROGRESS' || e.target.tagName === 'INPUT') return;
			e.preventDefault();
			const touch = e.touches[0];
			pos3 = touch.clientX;
			pos4 = touch.clientY;
			document.ontouchend = closeDragElement;
			document.ontouchmove = elementTouchDrag;
			isDragging = true;
		}

		function elementDrag(e) {
			console.log('progressContainer');
			if (!isDragging) return;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			element.style.top = (element.offsetTop - pos2) + "px";
			element.style.left = (element.offsetLeft - pos1) + "px";
		}

		function elementTouchDrag(e) {
			console.log('progressContainer4');
			if (!isDragging) return;
			e.preventDefault();
			const touch = e.touches[0];
			pos1 = pos3 - touch.clientX;
			pos2 = pos4 - touch.clientY;
			pos3 = touch.clientX;
			pos4 = touch.clientY;
			element.style.top = (element.offsetTop - pos2) + "px";
			element.style.left = (element.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			console.log('progressContainer5');
			isDragging = false;
			document.onmouseup = null;
			document.onmousemove = null;
			document.ontouchend = null;
			document.ontouchmove = null;
		}
	}

	function throttle(func, limit) {
		let lastFunc;
		let lastRan;
		return function() {
			const context = this;
			const args = arguments;
			if (!lastRan) {
				func.apply(context, args);
				lastRan = Date.now();
			} else {
				clearTimeout(lastFunc);
				lastFunc = setTimeout(function() {
					if ((Date.now() - lastRan) >= limit) {
						func.apply(context, args);
						lastRan = Date.now();
					}
				}, limit - (Date.now() - lastRan));
			}
		};
	}

	function formatTime(seconds) {
		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}

	function createFloatingWindow() {
		videoElement = document.querySelector('video[src^="blob:https://app.kosmi.io/"]');
		if (videoElement) {
			if (floatingWindow) {
				floatingWindow.remove();
			}

			floatingWindow = document.createElement('div');
			floatingWindow.style.cssText = `
            position: fixed;
            top: 50px;
            left: 01px;
            width: 320px;
            height: 240px;
            background-color: #000;
            border: 0px solid #000;
            z-index: 10000;
            resize: both;
            cursor: move;
            overflow: hidden;
        `;

			const closeButton = document.createElement('button');
			closeButton.textContent = 'X';
			closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: grey;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 10001;
            opacity: 0.1;
        `;
			
closeButton.onclick = () => {
    // 停止播放视频
    videoElement.pause();
    videoElement.load();
    // 移除浮窗
    floatingWindow.remove();
};

			floatingWindow.appendChild(closeButton);
			document.body.appendChild(floatingWindow);

			// 保存视频的原始尺寸
			const originalWidth = videoElement.offsetWidth;
			const originalHeight = videoElement.offsetHeight;
			// 调整视频大小以适应悬浮窗
			videoElement.style.width = '100%';
			videoElement.style.height = '100%';

			// 将视频添加到悬浮窗中
			floatingWindow.appendChild(videoElement);

			// 添加悬浮窗到body
			document.body.appendChild(floatingWindow);

			makeDraggable(floatingWindow);
		}
	}

	function removeVideoBlack() {
		videoElement = document.querySelector('video[src^="blob:https://app.kosmi.io/"]');
		if (videoElement) {
			videoElement.style.width = '100%';
			videoElement.style.height = '100%';
			videoElement.style.objectFit = 'cover';
		}
	}

	function main() {
		const existingController = document.getElementById('video-controller');
		const existingButton = document.getElementById('toggle-button');
		if (existingController) {
			existingController.remove();
		}
		if (existingButton) {
			existingButton.remove();
		}

		videoElement = document.querySelector('video[src^="blob:https://app.kosmi.io/"]');
		if (!videoElement) {
			console.log('未找到指定视频');
			return;
		}

		controller = createController();
		makeDraggable(controller);
		createToggleButton();

		const progressBar = document.getElementById('progress-bar');
		const timeDisplay = document.getElementById('time-display');
		const volumeSlider = document.getElementById('volume-slider');
		const volumeIcon = document.getElementById('volume-icon');
		const reloadButton = document.getElementById('reload-button');
		const floatVideoButton = document.getElementById('float-video-button');
		const videoRemoveBlack = document.getElementById('video-remove-black');
		const sizeButtons = document.querySelectorAll('.size-button');

		function updateProgress() {
			const progress = (videoElement.currentTime / videoElement.duration) * 100;
			progressBar.value = progress; // 设置进度条的value属性
			const current = formatTime(videoElement.currentTime);
			const total = formatTime(videoElement.duration);
			timeDisplay.textContent = `${current} / ${total}`;
		}

		// 添加点击事件监听器以改变视频播放位置
		progressBar.addEventListener('click', function(e) {
			if (isDragging) return;

			// 获取进度条的位置
			const rect = progressBar.getBoundingClientRect();
			const pos = (e.clientX - rect.left) / rect.width;

			// 设置视频播放位置
			videoElement.currentTime = pos * videoElement.duration;
		});

		volumeSlider.addEventListener('input', function() {
			videoElement.volume = this.value;
			updateVolumeIcon(this.value);
		});

		function updateVolumeIcon(volume) {
			if (volume > 0.5) {
				volumeIcon.textContent = '🔊';
			} else if (volume > 0) {
				volumeIcon.textContent = '🔉';
			} else {
				volumeIcon.textContent = '🔇';
			}
		}

		volumeSlider.value = videoElement.volume;
		updateVolumeIcon(videoElement.volume);

		reloadButton.addEventListener('click', function() {
			videoElement.removeEventListener('timeupdate', updateProgress);
			videoElement.removeEventListener('loadedmetadata', updateProgress);
			main();
			videoElement.addEventListener('timeupdate', updateProgress);
			videoElement.addEventListener('loadedmetadata', updateProgress);
		});

		floatVideoButton.addEventListener('click', createFloatingWindow);

		videoRemoveBlack.addEventListener('click', removeVideoBlack);

		sizeButtons.forEach(button => {
			button.addEventListener('click', function() {
				if (!floatingWindow) return;

				const action = this.dataset.action;
				const step = 20;

				switch (action) {
					case 'increase-width':
						floatingWindow.style.width = (floatingWindow.offsetWidth + step) + 'px';
						break;
					case 'decrease-width':
						floatingWindow.style.width = Math.max(160, floatingWindow.offsetWidth - step) + 'px';
						break;
					case 'increase-height':
						floatingWindow.style.height = (floatingWindow.offsetHeight + step) + 'px';
						break;
					case 'decrease-height':
						floatingWindow.style.height = Math.max(120, floatingWindow.offsetHeight - step) + 'px';
						break;
				}
			});
		});

		videoElement.addEventListener('timeupdate', updateProgress);
		videoElement.addEventListener('loadedmetadata', updateProgress);
	}

	function waitForVideo() {
		const video = document.querySelector('video[src^="blob:https://app.kosmi.io/"]');
		if (video) {
			main();
		} else {
			setTimeout(waitForVideo, 1000);
		}
	}

	waitForVideo();
})();
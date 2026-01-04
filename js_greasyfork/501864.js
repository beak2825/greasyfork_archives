// ==UserScript==
// @name         Vid1eo Control with Reload and Size Adjustment (Including Children)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  这个版本可以简单调整画面高度 为指定视频添加可移动的进度条、音量控制器、重新加载按钮和尺寸调整按钮（包括子元素）
// @match        https://app.kosmi.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501864/Vid1eo%20Control%20with%20Reload%20and%20Size%20Adjustment%20%28Including%20Children%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501864/Vid1eo%20Control%20with%20Reload%20and%20Size%20Adjustment%20%28Including%20Children%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let videoElement = null;
    let controller = null;
    let isDragging = false;
    let initialX = 0, initialY = 0;
    let lastX = 0, lastY = 0;
    let buttonCreated = false;

    // 创建控制器
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
            transition: width 0.3s, height 0.3s;
            display: none;
        `;
        controller.innerHTML = `
            <div id="progress-container" style="width: 100%; height: 10px; background-color: #444; position: relative; cursor: pointer;">
                <div id="progress-indicator" style="width: 0%; height: 100%; background-color: #fff; position: absolute;"></div>
            </div>
            <div id="time-display" style="text-align: center; margin-top: 5px;">0:00 / 0:00</div>
            <div id="volume-container" style="display: flex; align-items: center; margin-top: 10px;">
                <span id="volume-icon" style="margin-right: 10px;">🔊</span>
                <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="1" style="flex-grow: 1;">
            </div>
            <button id="reload-button" style="width: 100%; margin-top: 10px; padding: 5px; background-color: #4CAF50; border: none; color: white; cursor: pointer;">重新加载视频控制</button>
            <div id="size-controls" style="display: flex; justify-content: space-between; margin-top: 10px;">
                <button class="size-btn" data-action="width-increase">宽度+</button>
                <button class="size-btn" data-action="width-decrease">宽度-</button>
                <button class="size-btn" data-action="height-increase">高度+</button>
                <button class="size-btn" data-action="height-decrease">高度-</button>
            </div>
        `;
        document.body.appendChild(controller);
        return controller;
    }

    // 创建显示/隐藏按钮
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

            // 使按钮可拖动
            let pos1 = 0, pos2 = 0;

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
            // 触摸点击事件
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

    // 使控制器可拖动
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            if (e.target.id === 'progress-container' || e.target.id === 'progress-indicator' || e.target.id === 'volume-slider' || e.target.id === 'reload-button') return;
            e.preventDefault();
            isDragging = true;

            initialX = e.clientX;
            initialY = e.clientY;
            lastX = initialX;
            lastY = initialY;
            document.onmouseup = closeDragElement;
            document.onmousemove = throttle(elementDrag, 16);
        }

        function elementDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            pos1 = initialX - e.clientX;
            pos2 = initialY - e.clientY;
            initialX = e.clientX;
            initialY = e.clientY;

            requestAnimationFrame(() => {
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
                element.style.bottom = 'auto';
            });
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            isDragging = false;
        }
    }

    // 节流函数
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

    // 格式化时间
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // 主函数
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

        const progressContainer = document.getElementById('progress-container');
        const progressIndicator = document.getElementById('progress-indicator');
        const timeDisplay = document.getElementById('time-display');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeIcon = document.getElementById('volume-icon');
        const reloadButton = document.getElementById('reload-button');

        function updateProgress() {
            const progress = (videoElement.currentTime / videoElement.duration) * 100;
            progressIndicator.style.width = `${progress}%`;
            const current = formatTime(videoElement.currentTime);
            const total = formatTime(videoElement.duration);
            timeDisplay.textContent = `${current} / ${total}`;
        }

        progressContainer.addEventListener('click', function(e) {
            if (isDragging) return;
            const rect = progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
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

        const sizeButtons = controller.querySelectorAll('.size-btn');
        sizeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                const targetElement = document.querySelector('.x78zum5.x1n2onr6.x193iq5w.xdt5ytf.xysyzu8.x5yr21d.x98rzlu');
                if (targetElement) {
                    adjustSizeRecursively(targetElement, action);
                }
            });
        });

        function adjustSizeRecursively(element, action) {
            const style = window.getComputedStyle(element);
            const currentHeight = parseFloat(style.height);
            const currentWidth = parseFloat(style.width);
            const step = 10; // 每次调整的像素数

            let newWidth = currentWidth;
            let newHeight = currentHeight;

            switch(action) {
                case 'width-increase':
                    newWidth = currentWidth + step;
                    break;
                case 'width-decrease':
                    newWidth = Math.max(currentWidth - step, 50);
                    break;
                case 'height-increase':
                    newHeight = currentHeight + step;
                    break;
                case 'height-decrease':
                    newHeight = Math.max(currentHeight - step, 50);
                    break;
            }

            // 调整当前元素的尺寸
            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;

        }

        videoElement.addEventListener('timeupdate', updateProgress);
        videoElement.addEventListener('loadedmetadata', updateProgress);
    }

    // 等待视频加载完成
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
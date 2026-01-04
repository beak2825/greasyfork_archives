// ==UserScript==
// @name         Speed Adjustment
// @namespace    http://tampermonkey.net/
// @version      2025-02-27 V1.0.1
// @description  Video Speed Adjustment
// @author       SMK
// @include      *
// @license     MIT
// @icon         https://bkimg.cdn.bcebos.com/pic/d043ad4bd11373f0b4cbf3e2ab0f4bfbfaed04d2?x-bce-process=image/format,f_auto/quality,Q_70/resize,m_lfit,limit_1,w_536
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528190/Speed%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/528190/Speed%20Adjustment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        const targetSelector = '#ad-pic,.ad-pic,#ad-overlay';

        // 隐藏广告元素
        function hideElement() {
            const element = document.querySelector(targetSelector);
            if (element) {
                element.style.display = 'none';
            }
        }

        // 监听页面变化，确保广告及时移除
        const observer = new MutationObserver(hideElement);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始执行一次
        hideElement();

        // 保存位置到 localStorage
        function savePosition(position) {
            localStorage.setItem('speedControlPosition', JSON.stringify(position));
        }

        // 获取保存的位置，默认为右上角
        function getSavedPosition() {
            const savedPosition = localStorage.getItem('speedControlPosition');
            return savedPosition ? JSON.parse(savedPosition) : { top: '30px', right: '5px' };
        }

        // 选择页面上的所有视频元素
        function addSpeedControlsToVideos() {
            var videos = document.querySelectorAll('video');
            videos.forEach(function(video) {
                if (!video.hasAttribute('data-speed-controls')) { // 防止重复添加
                    var speedContainer = document.createElement('div');
                    speedContainer.style.position = 'absolute';
                    const position = getSavedPosition();
                    speedContainer.style.top = position.top;
                    speedContainer.style.right = position.right;
                    speedContainer.style.zIndex = '1000';
                    speedContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    speedContainer.style.color = 'white';
                    speedContainer.style.padding = '3px';
                    speedContainer.style.borderRadius = '5px';
                    speedContainer.style.display = 'flex';
                    speedContainer.style.flexWrap = 'wrap'; // 使按钮换行
                    speedContainer.style.alignItems = 'center'; // 垂直居中
                    speedContainer.style.overflow = 'hidden'; // 确保容器不会超出范围
                    speedContainer.style.width = '45px'; // 设置容器宽度，以便让按钮能够换行
                    speedContainer.style.transition = 'width 0.3s ease'; // 宽度动画过渡效果
                    speedContainer.style.whiteSpace = 'nowrap'; // 防止按钮换行

                    // 通用按钮样式
                    const buttonStyle = {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        border: 'none',
                        padding: '3px 6px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        margin: '3px',
                        fontFamily: 'Arial, sans-serif', // 统一字体
                    };

                    // 创建当前倍速按钮
                    var currentSpeedButton = document.createElement('button');
                    currentSpeedButton.innerText = `${video.playbackRate}x`;
                    Object.assign(currentSpeedButton.style, buttonStyle);

                    // 点击当前倍速按钮时，切换到其他倍速
                    currentSpeedButton.addEventListener('click', function() {
                        const speeds = [0.5, 1.0, 2.0, 2.5, 3.0, 5.0];
                        let currentIndex = speeds.indexOf(video.playbackRate);
                        if (currentIndex === -1) currentIndex = 1; // 默认到1倍速

                        // 循环倍速
                        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
                        video.playbackRate = nextSpeed;
                        currentSpeedButton.innerText = `${nextSpeed}x`; // 更新按钮显示的倍速
                    });
                    // 添加当前倍速按钮到容器
                    speedContainer.appendChild(currentSpeedButton);

                    // 播放速度选项按钮
                    const speeds = [0.5, 1.0, 2.0, 2.5, 3.0, 5.0];
                    speeds.forEach(function(speed) {
                        var speedButton = document.createElement('button');
                        speedButton.innerText = `${speed}x`;
                        Object.assign(speedButton.style, buttonStyle); // 使用统一的样式

                        // 点击按钮时改变播放速度
                        speedButton.addEventListener('click', function() {
                            const wasPaused = video.paused; // 记录视频是否暂停
                            const wasPlaying = !wasPaused;

                            // 设置播放速度
                            video.playbackRate = speed;
                            currentSpeedButton.innerText = `${speed}x`; // 更新当前倍速按钮显示的倍速

                            // 通过 requestAnimationFrame 确保播放不会中断
                            requestAnimationFrame(() => {
                                if (wasPlaying) {
                                    video.play();
                                }
                            });
                        });

                        // 初始时隐藏其他按钮
                        speedButton.style.display = 'none'; // 关键修改：初始时隐藏
                        speedContainer.appendChild(speedButton); // 将按钮添加到容器中
                    });

                    // 鼠标悬停时展开按钮，鼠标移开时收缩
                    speedContainer.addEventListener('mouseenter', function() {
                        const buttons = speedContainer.querySelectorAll('button');
                        buttons.forEach(button => button.style.display = 'block'); // 显示所有按钮
                        speedContainer.style.width = '270px'; // 扩展容器宽度，显示更多按钮
                    });

                    speedContainer.addEventListener('mouseleave', function() {
                        const buttons = speedContainer.querySelectorAll('button');
                        buttons.forEach((button, index) => {
                            if (index !== 0) button.style.display = 'none'; // 只保留第一个按钮（当前倍速）
                        });
                        speedContainer.style.width = '45px'; // 恢复容器宽度
                    });
                     /**
                    // 创建悬浮窗)

                    **/

                    const floatingWindow = document.createElement('div');
                    floatingWindow.style.position = 'absolute';
                    floatingWindow.style.top = '150px';
                    floatingWindow.style.right = '-10px';
                    floatingWindow.style.zIndex = '1000';
                    floatingWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    floatingWindow.style.padding = '15px';
                    floatingWindow.style.borderRadius = '15px';
                    floatingWindow.style.transition = 'opacity 0.3s ease';
                    floatingWindow.style.opacity = '0.3';



                    // 鼠标悬停显示按钮
                    floatingWindow.addEventListener('mouseenter', function() {
                        floatingWindow.style.opacity = '1';
                        positionButtons.forEach(button => button.style.display = 'block');
                    });

                    // 鼠标移出隐藏按钮
                    floatingWindow.addEventListener('mouseleave', function() {
                        floatingWindow.style.opacity = '0.3';
                        positionButtons.forEach(button => button.style.display = 'none');
                    });

                    const positions = [
                        { label: '左上', top: '10px', left: '10px' },
                        { label: '右上', top: '10px', right: '10px' },
                        { label: '左下', bottom: '10px', left: '10px' },
                        { label: '右下', bottom: '10px', right: '10px' }
                    ];

                    const positionButtons = [];
                    positions.forEach(position => {
                        const positionButton = document.createElement('button');
                        positionButton.innerText = position.label;
                        Object.assign(positionButton.style, buttonStyle);
                        positionButton.style.display = 'none';
                        positionButton.style.marginBottom = '5px';

                        positionButton.addEventListener('click', function() {
                            speedContainer.style.top = position.top || '';
                            speedContainer.style.right = position.right || '';
                            speedContainer.style.bottom = position.bottom || '';
                            speedContainer.style.left = position.left || '';
                            savePosition(position);
                        });

                        floatingWindow.appendChild(positionButton);
                        positionButtons.push(positionButton);
                    });



                    // 将按钮容器插入到视频元素之前
                    video.parentNode.insertBefore(speedContainer, video);
                    video.parentNode.insertBefore(floatingWindow, video);
                    video.setAttribute('data-speed-controls', 'true'); // 防止重复添加
                }
            });
        }

        // 创建 MutationObserver 监听 video 元素的变化
        const videoObserver = new MutationObserver(addSpeedControlsToVideos);
        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始执行一次
        addSpeedControlsToVideos();
    });
})();
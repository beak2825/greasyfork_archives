// ==UserScript==
// @name         定时唤醒播放器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license MIT
// @description  在指定时间自动播放当前页面的视频，带有可设置的控制界面和倒计时。
// @author       Chenlianghong
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540993/%E5%AE%9A%E6%97%B6%E5%94%A4%E9%86%92%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540993/%E5%AE%9A%E6%97%B6%E5%94%A4%E9%86%92%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本开始运行');

    function init() {
        console.log('DOM 加载完成，开始初始化');

        try {
            // --- 样式部分 ---
            GM_addStyle(`
                #wakeup-float-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background-color: #4CAF50;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    cursor: grab;
                    z-index: 999999;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    transition: background-color 0.3s;
                    user-select: none;
                }
                #wakeup-float-btn:hover {
                    background-color: #45a049;
                }
                #wakeup-float-btn:active {
                    cursor: grabbing;
                }
                #wakeup-control-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: white;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                    z-index: 1000000;
                    display: none;
                    font-family: Arial, sans-serif;
                    min-width: 300px;
                }
                #wakeup-control-panel h3 {
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: #333;
                    text-align: center;
                }
                #wakeup-control-panel label {
                    display: block;
                    margin-bottom: 8px;
                    color: #555;
                }
                #wakeup-control-panel input[type="time"] {
                    width: calc(100% - 20px);
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 16px;
                }
                #wakeup-control-panel button {
                    background-color: #007BFF;
                    color: white;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                }
                #wakeup-control-panel button:hover {
                    background-color: #0056b3;
                }
                #wakeup-time-display {
                    margin-top: 15px;
                }
                #wakeup-time-display p {
                    margin: 5px 0;
                    color: #666;
                }
                #wakeup-close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 24px;
                    height: 24px;
                    background-color: #f0f0f0;
                    border: none;
                    border-radius: 50%;
                    font-size: 16px;
                    line-height: 24px;
                    text-align: center;
                    cursor: pointer;
                    color: #666;
                    transition: all 0.3s ease;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                #wakeup-close-btn:hover {
                    background-color: #ff4444;
                    color: white;
                }
            `);

            // 创建浮动按钮
            const floatButton = document.createElement('div');
            floatButton.id = 'wakeup-float-btn';
            floatButton.textContent = '🎶';
            document.body.appendChild(floatButton);
            console.log('浮动按钮已创建');

            // 创建控制面板
            const controlPanel = document.createElement('div');
            controlPanel.id = 'wakeup-control-panel';
            controlPanel.innerHTML = `
                <button id="wakeup-close-btn">×</button>
                <h3>定时播放设置</h3>
                <label for="set-play-time">设置播放时间:</label>
                <input type="time" id="set-play-time">
                <button id="save-play-time">保存设置</button>
                <div id="wakeup-time-display">
                    <p>当前时间: <span id="current-time"></span></p>
                    <p>目标时间: <span id="target-time">未设置</span></p>
                    <p>剩余时间: <span id="countdown-time">未设置</span></p>
                </div>
            `;
            document.body.appendChild(controlPanel);
            console.log('控制面板已创建');

            // 添加拖动功能
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            floatButton.addEventListener('mousedown', function(e) {
                isDragging = true;
                initialX = e.clientX - floatButton.offsetLeft;
                initialY = e.clientY - floatButton.offsetTop;

                floatButton.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;

                e.preventDefault();

                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // 确保按钮不会被拖出视窗
                currentX = Math.max(0, Math.min(currentX, window.innerWidth - floatButton.offsetWidth));
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - floatButton.offsetHeight));

                floatButton.style.left = currentX + 'px';
                floatButton.style.top = currentY + 'px';
                floatButton.style.right = 'auto';
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
                floatButton.style.cursor = 'grab';
            });

            // 获取保存的时间
            const savedTime = GM_getValue('targetTime', '');
            if (savedTime) {
                document.getElementById('set-play-time').value = savedTime;
                document.getElementById('target-time').textContent = savedTime;
            }

            // 计算并更新剩余时间
            function updateCountdown() {
                const targetTimeStr = GM_getValue('targetTime', '');
                if (!targetTimeStr) return;

                const now = new Date();
                const [targetHour, targetMinute] = targetTimeStr.split(':').map(Number);
                let targetTime = new Date();
                targetTime.setHours(targetHour, targetMinute, 0, 0);

                // 如果目标时间已过，设置为明天
                if (targetTime < now) {
                    targetTime.setDate(targetTime.getDate() + 1);
                }

                const diff = targetTime - now;
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                document.getElementById('countdown-time').textContent =
                    `${hours}小时${minutes}分钟${seconds}秒`;
            }

            // 更新当前时间显示
            function updateCurrentTime() {
                const now = new Date();
                document.getElementById('current-time').textContent =
                    now.toLocaleTimeString('zh-CN', { hour12: false });
                updateCountdown(); // 同时更新倒计时
            }

            // 检查并播放视频的函数
            function checkAndPlay() {
                const targetTimeStr = GM_getValue('targetTime', '');
                if (!targetTimeStr) return;

                const now = new Date();
                const [targetHour, targetMinute] = targetTimeStr.split(':').map(Number);
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();

                if (currentHour === targetHour && currentMinute === targetMinute) {
                    console.log('时间到，尝试播放视频...');
                    const videos = document.querySelectorAll('video');
                    if (videos.length > 0) {
                        videos.forEach(video => {
                            video.muted = false;
                            video.volume = 1;
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise
                                    .then(() => console.log('视频开始播放'))
                                    .catch(err => {
                                        console.error('播放失败:', err);
                                        // 尝试静音播放
                                        video.muted = true;
                                        video.play().catch(e => console.error('静音播放也失败:', e));
                                    });
                            }
                        });
                    } else {
                        console.log('页面上没有找到视频元素');
                    }
                }
            }

            // 事件监听器
            floatButton.addEventListener('click', function(e) {
                if (!isDragging) { // 只在非拖动状态下响应点击
                    controlPanel.style.display = 'block';
                }
            });

            // 关闭按钮事件
            document.getElementById('wakeup-close-btn').addEventListener('click', () => {
                controlPanel.style.display = 'none';
            });

            document.getElementById('save-play-time').addEventListener('click', () => {
                const timeInput = document.getElementById('set-play-time').value;
                if (timeInput) {
                    GM_setValue('targetTime', timeInput);
                    document.getElementById('target-time').textContent = timeInput;
                    alert('时间设置已保存！');
                    controlPanel.style.display = 'none'; // 保存后自动关闭面板
                } else {
                    alert('请选择有效的时间！');
                }
            });

            // 启动定时更新
            setInterval(updateCurrentTime, 1000); // 每秒更新时间显示
            setInterval(checkAndPlay, 30000); // 每30秒检查一次是否需要播放

            // 立即执行一次更新
            updateCurrentTime();
            checkAndPlay();

        } catch (error) {
            console.error('脚本初始化失败:', error);
        }
    }

    // 确保在页面加载完成后运行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

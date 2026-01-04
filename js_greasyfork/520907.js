// ==UserScript==
// @name         卫宁学院优化学习版(仅作学习参考，提高看视频体验和学习效率)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  视频控制面板，显示学习进度和时长，支持播放速度调节和快捷键，记忆播放功能，自动开启声音
// @author       cyy
// @match        http://edu.winning.com.cn:19001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520907/%E5%8D%AB%E5%AE%81%E5%AD%A6%E9%99%A2%E4%BC%98%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%89%88%28%E4%BB%85%E4%BD%9C%E5%AD%A6%E4%B9%A0%E5%8F%82%E8%80%83%EF%BC%8C%E6%8F%90%E9%AB%98%E7%9C%8B%E8%A7%86%E9%A2%91%E4%BD%93%E9%AA%8C%E5%92%8C%E5%AD%A6%E4%B9%A0%E6%95%88%E7%8E%87%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520907/%E5%8D%AB%E5%AE%81%E5%AD%A6%E9%99%A2%E4%BC%98%E5%8C%96%E5%AD%A6%E4%B9%A0%E7%89%88%28%E4%BB%85%E4%BD%9C%E5%AD%A6%E4%B9%A0%E5%8F%82%E8%80%83%EF%BC%8C%E6%8F%90%E9%AB%98%E7%9C%8B%E8%A7%86%E9%A2%91%E4%BD%93%E9%AA%8C%E5%92%8C%E5%AD%A6%E4%B9%A0%E6%95%88%E7%8E%87%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEFAULT_SPEED = 1.0;
    const DEFAULT_SEEK_TIME = 3;
    const CHECK_INTERVAL = 1000;

    // 等待视频元素加载
    function waitForVideo() {
        return new Promise(resolve => {
            const check = setInterval(() => {
                const video = document.querySelector('video');
                if (video) {
                    clearInterval(check);
                    resolve(video);
                }
            }, 1000);
        });
    }

    // 保存播放进度
    function saveVideoProgress(video) {
        if (!video) return;
        const title = document.querySelector('.material-item.active .title')?.textContent.trim();
        if (!title) return;

        const progress = {
            title: title,
            time: video.currentTime,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(`videoProgress_${title}`, JSON.stringify(progress));
            console.log('保存进度:', title, video.currentTime);
        } catch (e) {
            console.error('保存进度失败:', e);
        }
    }

    // 恢复播放进度
    function restoreVideoProgress(video) {
        if (!video) return;
        const currentTitle = document.querySelector('.material-item.active .title')?.textContent.trim();
        if (!currentTitle) return;

        try {
            const savedProgress = localStorage.getItem(`videoProgress_${currentTitle}`);
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);
                if (Date.now() - progress.timestamp < 30 * 24 * 60 * 60 * 1000) {
                    video.currentTime = progress.time;
                    console.log('恢复进度:', currentTitle, progress.time);
                } else {
                    localStorage.removeItem(`videoProgress_${currentTitle}`);
                }
            }
        } catch (e) {
            console.error('恢复进度失败:', e);
        }
    }

    // 获取学习时长信息
    function getLearningTime() {
        try {
            const timeText = document.body.textContent;
            const match = timeText.match(/已学习时长：\s*(\d+)\s*分钟.*建议学习:\s*(\d+)分钟/);
            if (match) {
                return {
                    learned: parseInt(match[1]),
                    required: parseInt(match[2])
                };
            }
        } catch (error) {
            console.error('获取学习时长失败:', error);
        }
        return null;
    }

    // 格式化时间显示
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // 更新控制面板信息
    function updateControlPanelInfo(video) {
        const timeInfo = getLearningTime();
        const infoElement = document.getElementById('learningTimeInfo');
        if (timeInfo && infoElement && !isNaN(video.duration)) {
            const currentTime = video.currentTime;
            const duration = video.duration;
            const progress = (timeInfo.learned / timeInfo.required * 100).toFixed(1);
            const color = timeInfo.learned >= timeInfo.required ? '#4CAF50' : '#FFA726';
            infoElement.innerHTML = `
                <div>已学习: ${timeInfo.learned}分钟</div>
                <div>建议学习: ${timeInfo.required}分钟</div>
                <div style="color: ${color}">完成度: ${progress}%</div>
                <div style="margin-top: 5px; color: #fff">视频进度: ${formatTime(currentTime)} / ${formatTime(duration)}</div>
            `;
        }
    }

    // 设置视频监控
    function setupVideoMonitor(video) {
        if (!video) return;
        const currentTitle = document.querySelector('.material-item.active .title')?.textContent.trim();
        console.log('设置视频监控...', currentTitle);

        // 清除现有的监控
        if (window._videoCheckInterval) {
            clearInterval(window._videoCheckInterval);
        }
        if (window._saveInterval) {
            clearInterval(window._saveInterval);
        }

        // 设置播放速度
        const speed = document.getElementById('playbackSpeed')?.value || DEFAULT_SPEED;
        video.playbackRate = parseFloat(speed);

        // 自动开启声音
        video.muted = false;  // 取消静音
        video.volume = 1.0;   // 设置音量为最大

        // 监听音量变化，确保声音保持开启
        video.addEventListener('volumechange', () => {
            if (video.muted) {
                video.muted = false;
            }
        });

        // 处理浏览器自动播放策略
        video.play().catch(() => {
            // 如果自动播放失败，添加点击事件来启用声音
            const enableAudio = () => {
                video.muted = false;
                video.volume = 1.0;
                video.play().catch(() => {});
                document.removeEventListener('click', enableAudio);
            };
            document.addEventListener('click', enableAudio);
        });

        // 恢复播放进度
        restoreVideoProgress(video);

        // 每30秒保存一次进度
        window._saveInterval = setInterval(() => {
            if (!video.paused) {
                saveVideoProgress(video);
            }
        }, 30000);

        // 设置检查间隔
        const checkInterval = setInterval(() => {
            try {
                const currentVideo = document.querySelector('video');
                if (!currentVideo) {
                    console.log('视频元素不存在，重新初始化...');
                    clearInterval(checkInterval);
                    clearInterval(window._saveInterval);
                    waitForVideo().then(newVideo => {
                        if (newVideo) {
                            setupVideoMonitor(newVideo);
                        }
                    });
                    return;
                }

                updateControlPanelInfo(currentVideo);
            } catch (error) {
                console.error('检查过程出错:', error);
            }
        }, CHECK_INTERVAL);

        window._videoCheckInterval = checkInterval;
    }

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(40, 44, 52, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const speedOptions = [1, 1.25, 1.5, 2, 4, 8, 16]
            .map(speed => `<option value="${speed}"${speed === DEFAULT_SPEED ? ' selected' : ''}>${speed}x</option>`).join('');
        const seekOptions = [3, 5, 10]
            .map(time => `<option value="${time}"${time === DEFAULT_SEEK_TIME ? ' selected' : ''}>${time}秒</option>`).join('');

        panel.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div id="learningTimeInfo" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px; margin-bottom: 5px; font-size: 12px;"></div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="min-width: 70px;">播放速度:</span>
                    <select id="playbackSpeed" style="
                        flex: 1;
                        padding: 5px 8px;
                        border-radius: 5px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        background: rgba(40, 44, 52, 0.9);
                        color: white;
                        cursor: pointer;
                        outline: none;
                    ">
                        ${speedOptions}
                    </select>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="min-width: 70px;">快进/快退:</span>
                    <select id="seekTime" style="
                        flex: 1;
                        padding: 5px 8px;
                        border-radius: 5px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        background: rgba(40, 44, 52, 0.9);
                        color: white;
                        cursor: pointer;
                        outline: none;
                    ">
                        ${seekOptions}
                    </select>
                </div>
                <button id="testSwitchBtn" style="
                    margin-top: 5px;
                    padding: 8px 12px;
                    border: none;
                    border-radius: 5px;
                    background: #4CAF50;
                    color: white;
                    cursor: pointer;
                ">切换下一课程</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 播放速度控制
        document.getElementById('playbackSpeed').addEventListener('change', function(e) {
            const video = document.querySelector('video');
            if (video) {
                const speed = parseFloat(e.target.value);
                video.playbackRate = speed;
                console.log(`播放速度已设置为 ${speed}x`);
            }
        });

        // 切换按钮
        document.getElementById('testSwitchBtn').addEventListener('click', () => {
            const nextCourse = document.querySelector('.material-item.active + .material-item .title');
            if (nextCourse) {
                nextCourse.click();
            }
        });
    }

    // 初始化
    async function init() {
        try {
            // 监听课程列表的变化
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const video = document.querySelector('video');
                        if (video && !window._videoCheckInterval) {
                            console.log('检测到新的视频元素');
                            setupVideoMonitor(video);
                            break;
                        }
                    }
                }
            });

            // 监听整个文档的变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 初始化第一个视频
            const video = await waitForVideo();
            if (video) {
                setupVideoMonitor(video);
            }

            // 添加点击事件监听
            document.addEventListener('click', async (e) => {
                const courseItem = e.target.closest('.material-item');
                if (courseItem) {
                    console.log('检测到课程点击');
                    // 等待新视频加载
                    setTimeout(async () => {
                        const newVideo = await waitForVideo();
                        if (newVideo) {
                            setupVideoMonitor(newVideo);
                        }
                    }, 1000);
                }
            }, { capture: true });

        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 启动脚本
    window.addEventListener('load', () => {
        init();
        addControlPanel();
    });

    // 快捷键支持
    document.addEventListener('keydown', function(e) {
        const video = document.querySelector('video');
        if (!video) return;
        const seekTime = parseInt(document.getElementById('seekTime').value);
        switch(e.code) {
            case 'Space':
                if (video.paused) video.play();
                else video.pause();
                e.preventDefault();
                break;
            case 'ArrowRight':
                video.currentTime += seekTime;
                e.preventDefault();
                break;
            case 'ArrowLeft':
                video.currentTime -= seekTime;
                e.preventDefault();
                break;
        }
    });
})();
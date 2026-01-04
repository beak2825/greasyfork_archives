// ==UserScript==
// @name         卫宁学院全自动
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  自动挂机学习视频
// @author       chenfu
// @match        http://edu.winning.com.cn:19001/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520900/%E5%8D%AB%E5%AE%81%E5%AD%A6%E9%99%A2%E5%85%A8%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520900/%E5%8D%AB%E5%AE%81%E5%AD%A6%E9%99%A2%E5%85%A8%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEFAULT_SPEED = 1.0;
    const DEFAULT_SEEK_TIME = 3;
    const CHECK_INTERVAL = 1000;

    // 添加页面可见性处理
    function handleVisibilityChange() {
        const video = document.querySelector('video');
        if (video) {
            // 设置视频属性以允许后台播放
            video.setAttribute('autoplay', '');
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');

            // 保持视频播放
            if (video.paused) {
                video.play().catch(error => {
                    console.log('视频播放失败:', error);
                });
            }
        }
    }

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 定期检查视频状态
    setInterval(() => {
        if (document.hidden) {
            handleVisibilityChange();
        }
    }, 1000);

    // 阻止页面自动暂停
    const preventPause = () => {
        const video = document.querySelector('video');
        if (video && video.paused) {
            video.play().catch(() => {});
        }
    };
    ['blur', 'focusout', 'pagehide'].forEach(event => {
        window.addEventListener(event, preventPause);
    });

    function waitForElements() {
        return new Promise(resolve => {
            const check = setInterval(() => {
                const video = document.querySelector('video');
                const courseItems = document.querySelectorAll('.material-item');
                if (video && courseItems.length > 0) {
                    clearInterval(check);
                    resolve({video, courseItems: Array.from(courseItems)});
                }
            }, 1000);
        });
    }

    function findNextCourse() {
        // 获取所有课程项目
        const courses = Array.from(document.querySelectorAll('.material-item'));
        // 找到当前激活的课程索引
        const currentIndex = courses.findIndex(item => item.classList.contains('active'));
        // 返回下一个课程，如果没有下一个则返回null
        return currentIndex !== -1 && currentIndex < courses.length - 1 ? courses[currentIndex + 1] : null;
    }

    async function switchToNextCourse() {
        try {
            const nextCourse = findNextCourse();
            if (!nextCourse) {
                console.log('没有下一个课程了');
                return false;
            }
            console.log('切换到下一课程:', nextCourse.querySelector('.title')?.textContent.trim());
            const titleElement = nextCourse.querySelector('.title');
            if (titleElement) {
                titleElement.click();
                return true;
            }
        } catch (error) {
            console.error('切换课程时出错:', error);
        }
        return false;
    }

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

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function setupVideoMonitor(video) {
        console.log('设置视频监控...');

        // 设置视频属性以允许后台播放
        video.setAttribute('autoplay', '');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');

        if (window._videoCheckInterval) {
            clearInterval(window._videoCheckInterval);
        }

        // 移除旧的事件监听器
        if (window._videoEndHandler) {
            const oldVideo = document.querySelector('video');
            if (oldVideo) {
                oldVideo.removeEventListener('ended', window._videoEndHandler);
            }
        }

        let lastCheckTime = Date.now();
        let switching = false;

        // 视频结束处理函数
        const handleVideoEnd = () => {
            console.log('视频播放结束，重新播放');
            video.currentTime = 0;
            video.play().catch(() => {});
        };

        // 保存事件处理函数引用
        window._videoEndHandler = handleVideoEnd;
        video.addEventListener('ended', handleVideoEnd);

        const checkInterval = setInterval(async () => {
            if (switching) return;

            try {
                // 确保视频元素存在且有效
                const currentVideo = document.querySelector('video');
                if (!currentVideo) {
                    console.log('视频元素不存在，重新初始化...');
                    const {video: newVideo} = await waitForElements();
                    if (newVideo) {
                        setupVideoMonitor(newVideo);
                    }
                    clearInterval(checkInterval);
                    return;
                }

                const timeInfo = getLearningTime();
                const infoElement = document.getElementById('learningTimeInfo');
                if (timeInfo && infoElement && !isNaN(currentVideo.duration)) {
                    // 获取视频进度
                    const currentTime = currentVideo.currentTime;
                    const duration = currentVideo.duration;

                    const progress = (timeInfo.learned / timeInfo.required * 100).toFixed(1);
                    const color = timeInfo.learned >= timeInfo.required ? '#4CAF50' : '#FFA726';
                    infoElement.innerHTML = `
                        <div>已学习: ${timeInfo.learned}分钟</div>
                        <div>建议学习: ${timeInfo.required}分钟</div>
                        <div style="color: ${color}">完成度: ${progress}%</div>
                        <div style="margin-top: 5px; color: #fff">视频进度: ${formatTime(currentTime)} / ${formatTime(duration)}</div>
                    `;

                    // 每3秒检查一次是否满足学习时长
                    const now = Date.now();
                    if (now - lastCheckTime >= 3000) {
                        lastCheckTime = now;
                        console.log('执行定时检查...');

                        if (timeInfo.learned >= timeInfo.required) {
                            console.log('已达到建议学习时长，准备切换课程');
                            switching = true;

                            const success = await switchToNextCourse();
                            if (success) {
                                console.log('切换成功，等待新视频加载');
                                clearInterval(checkInterval);

                                setTimeout(async () => {
                                    const {video: newVideo} = await waitForElements();
                                    if (newVideo) {
                                        const speed = document.getElementById('playbackSpeed')?.value || DEFAULT_SPEED;
                                        newVideo.playbackRate = parseFloat(speed);
                                        setupVideoMonitor(newVideo);
                                        newVideo.play().catch(() => {});
                                    }
                                    switching = false;
                                }, 2000);
                            } else {
                                switching = false;
                            }
                        } else {
                            console.log('未达到建议学习时长，继续播放');
                        }
                    }
                }
            } catch (error) {
                console.error('检查过程出错:', error);
            }
        }, CHECK_INTERVAL);

        window._videoCheckInterval = checkInterval;
    }

    async function main() {
        console.log('初始化脚本...');
        try {
            const {video} = await waitForElements();
            if (video) {
                const speed = document.getElementById('playbackSpeed')?.value || DEFAULT_SPEED;
                video.playbackRate = parseFloat(speed);
                setupVideoMonitor(video);
            }
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

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
                    <select id="playbackSpeed" style="flex: 1; padding: 5px 8px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.1); color: white; cursor: pointer; outline: none;">
                        ${speedOptions}
                    </select>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="min-width: 70px;">快进/快退:</span>
                    <select id="seekTime" style="flex: 1; padding: 5px 8px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.1); color: white; cursor: pointer; outline: none;">
                        ${seekOptions}
                    </select>
                </div>
                <button id="testSwitchBtn" style="margin-top: 5px; padding: 8px 12px; border: none; border-radius: 5px; background: #4CAF50; color: white; cursor: pointer;">测试切换</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('playbackSpeed').addEventListener('change', function(e) {
            const video = document.querySelector('video');
            if (video) {
                const speed = parseFloat(e.target.value);
                video.playbackRate = speed;
                console.log(`播放速度已设置为 ${speed}x`);
            }
        });

        document.getElementById('testSwitchBtn').addEventListener('click', switchToNextCourse);
    }

    window.addEventListener('load', () => {
        main();
        addControlPanel();
    });

    // 监听URL变化
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL变化，重新初始化...');
            setTimeout(async () => {
                const {video} = await waitForElements();
                if (video) {
                    setupVideoMonitor(video);
                }
            }, 2000);
        }
    });

    urlObserver.observe(document, {subtree: true, childList: true});

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
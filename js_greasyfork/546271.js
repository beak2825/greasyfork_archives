// ==UserScript==
// @name         小脏i学习-全自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  智慧通用里面的小通i学习，加载脚本将自动学习，进入视频列表开始任务。
// @author       xiaozang
// @match        https://education.gt.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546271/%E5%B0%8F%E8%84%8Fi%E5%AD%A6%E4%B9%A0-%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546271/%E5%B0%8F%E8%84%8Fi%E5%AD%A6%E4%B9%A0-%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentLearningVideoItem = null;
    let logTextarea = null;
    const playbackRate = 3;

    function customLog(message) {
        if (logTextarea) {
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            logTextarea.value += `[${timeString}] ${message}\n`;
            logTextarea.scrollTop = logTextarea.scrollHeight;
        }
        console.log(message);
    }

    window.alert = function(message) {
        customLog(`提示信息: ${message}`);
    };

    // 确保视频持续播放并设置倍速、静音和音量的函数
    function autoPlayVideo() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            let changed = false;

            // 检查并设置视频倍速
            if (videoElement.playbackRate !== playbackRate) {
                videoElement.playbackRate = playbackRate;
                changed = true;
            }

            // 确保视频已静音
            if (!videoElement.muted) {
                videoElement.muted = true;
                changed = true;
            }

            // 确保音量设置为0
            if (videoElement.volume > 0) {
                videoElement.volume = 0;
                changed = true;
            }

            // 如果有任何属性被更改，输出一条合并的日志
            if (changed) {
                customLog(`已将视频速度设置为 ${playbackRate} 倍，并设置为静音。`);
            }
        }
    }

    setInterval(autoPlayVideo, 5000);

    // 查找并点击下一个待学视频
    function clickNextVideo() {
        const videoItems = document.querySelectorAll('.el-col-video-play.el-col.el-col-8');
        let targetVideo = null;

        for (const item of videoItems) {
            const statusLabel = item.querySelector('.videoStudyingProgressLabel');
            if (statusLabel && statusLabel.textContent.includes('%')) {
                targetVideo = item;
                customLog('找到一个已经有进度的视频，准备学习。');
                break;
            }
        }

        if (!targetVideo) {
            for (const item of videoItems) {
                const statusLabel = item.querySelector('.videoProgressLabel');
                if (statusLabel && statusLabel.textContent.includes('待学')) {
                    targetVideo = item;
                    customLog('未找到有进度的视频，找到一个待学视频。');
                    break;
                }
            }
        }

        if (targetVideo) {
            const videoCard = targetVideo.querySelector('.el-card');
            if (videoCard) {
                videoCard.click();
                customLog('已学习一个待学或有进度的视频。');
                currentLearningVideoItem = targetVideo;
                waitForVideoCompletion(currentLearningVideoItem);
            }
        } else {
            customLog('所有视频均已完成，或没有找到待学视频。');
            window.alert('所有视频均已完成，脚本已停止。');
        }
    }

    // 使用 MutationObserver 等待视频状态更新为“已学”
    function waitForVideoCompletion(videoItem) {
        if (window.observer) {
            window.observer.disconnect();
        }

        let isProcessing = false;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const newStatusLabel = videoItem.querySelector('.videoStudyedProgressLabel');

                if (newStatusLabel && newStatusLabel.textContent.includes('已学') && !isProcessing) {
                    isProcessing = true;
                    customLog('视频状态已变更为“已学”。');
                    observer.disconnect();

                    setTimeout(() => {
                        customLog('延迟3秒，正在暂停当前视频并寻找下一个。');
                        const videoElement = document.querySelector('video');
                        if (videoElement) {
                            videoElement.pause();
                            customLog('当前视频已暂停。');
                        }
                        customLog('正在重新寻找下一个视频...');
                        clickNextVideo();
                        isProcessing = false;
                    }, 3000);
                }
            });
        });

        const config = { subtree: true, childList: true, attributes: true };
        observer.observe(document.body, config);
        window.observer = observer;
    }

    // 底部添加只读编辑框并初始化日志功能
    function addEditorBox() {
        const editorContainer = document.createElement('div');
        editorContainer.style.position = 'fixed';
        editorContainer.style.bottom = '10px';
        editorContainer.style.right = '10px';
        editorContainer.style.width = '350px';
        editorContainer.style.height = '220px';
        editorContainer.style.backgroundColor = '#fff';
        editorContainer.style.border = '1px solid #ccc';
        editorContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        editorContainer.style.zIndex = '9999';
        editorContainer.style.borderRadius = '8px';
        editorContainer.style.overflow = 'hidden';
        editorContainer.style.display = 'flex';
        editorContainer.style.flexDirection = 'column';

        const header = document.createElement('div');
        header.style.backgroundColor = '#f1f1f1';
        header.style.padding = '5px 10px';
        header.style.borderBottom = '1px solid #ccc';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'pointer';

        const title = document.createElement('span');
        title.textContent = '脚本日志';
        title.style.fontWeight = 'bold';
        title.style.fontSize = '12px';

        const toggleButton = document.createElement('span');
        toggleButton.textContent = '▼';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.transition = 'transform 0.3s ease';

        header.appendChild(title);
        header.appendChild(toggleButton);

        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.boxSizing = 'border-box';
        textarea.style.border = 'none';
        textarea.style.padding = '10px';
        textarea.style.resize = 'none';
        textarea.style.fontFamily = 'monospace';
        textarea.style.fontSize = '12px';
        textarea.style.lineHeight = '1.5';
        textarea.placeholder = '日志信息将显示在这里...';
        textarea.readOnly = true;

        editorContainer.appendChild(header);
        editorContainer.appendChild(textarea);
        document.body.appendChild(editorContainer);

        logTextarea = textarea;

        let isCollapsed = false;
        header.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                editorContainer.style.height = '25px';
                textarea.style.display = 'none';
                toggleButton.style.transform = 'rotate(-90deg)';
            } else {
                editorContainer.style.height = '220px';
                textarea.style.display = 'block';
                toggleButton.style.transform = 'rotate(0deg)';
            }
        });

        customLog('欢迎使用由xiaozang开发的小脏i学习脚本。');
        customLog('Hook页面成功，脚本日志功能已启动。');
        customLog('正在等待视频列表加载...');
    }

    // 防止视频因页面失去焦点而暂停
    function preventVideoPause() {
        // 覆盖 document.visibilityState 属性，使其始终为 'visible'
        Object.defineProperty(document, 'visibilityState', {
            get() {
                return 'visible';
            }
        });

        // 覆盖 document.hidden 属性，使其始终为 false
        Object.defineProperty(document, 'hidden', {
            get() {
                return false;
            }
        });

        // 拦截并阻止 'visibilitychange' 和 'blur' 事件
        const stopPropagation = (event) => {
            event.stopImmediatePropagation();
        };

        window.addEventListener('visibilitychange', stopPropagation, true);
        window.addEventListener('blur', stopPropagation, true);

        // 额外的安全措施：如果视频仍然暂停，强制播放它
        setInterval(() => {
            const video = document.querySelector('video');
            if (video && video.paused) {
                video.play().catch(e => customLog('自动播放失败: ' + e.message));
            }
        }, 5000);
    }

    // 插入编辑框和阻止暂停功能，然后监听视频列表
    addEditorBox();
    preventVideoPause(); // 调用函数来防止视频暂停

    const mainObserver = new MutationObserver((mutationsList, observer) => {
        if (document.querySelector('.el-col-video-play')) {
            setTimeout(clickNextVideo, 3000);
            observer.disconnect();
        }
    });

    mainObserver.observe(document.body, { childList: true, subtree: true });

})();
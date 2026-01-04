// ==UserScript==
// @name         YouTube Local Subtitle Loader
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button to load local SRT or VTT subtitle files on YouTube. Supports both hh:mm:ss,ms and mm:ss,ms time formats.
// @match        https://www.youtube.com/watch?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547019/YouTube%20Local%20Subtitle%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/547019/YouTube%20Local%20Subtitle%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 在这里自定义字幕样式 ---
    const subtitleStyle = `
        position: absolute;
        bottom: 8%; /* 字幕距离底部的距离 */
        width: 90%; /* 字幕区域宽度 */
        left: 5%;   /* 居中 */
        text-align: center;
        pointer-events: none;
        z-index: 99999; /* 确保在最顶层，避免被遮挡 */
        font-size: 2.2em; /* 字体大小 */
        color: white; /* 字体颜色 */
        font-weight: bold;
        text-shadow: 2px 2px 2px #000000, -2px -2px 2px #000000, 2px -2px 2px #000000, -2px 2px 2px #000000; /* 黑色描边，增强可读性 */
        font-family: Arial, "Heiti SC", "Microsoft Yahei", sans-serif;
        line-height: 1.4;
    `;

    let subtitles = [];
    let videoElement = null;
    let subtitleContainer = null;
    let animationFrameId = null;

    // 将时间字符串 (HH:MM:SS,ms 或 MM:SS,ms) 转换为秒
    function timeToSeconds(timeString) {
        const parts = timeString.replace('.', ',').split(/[:,]/).reverse(); // 反转数组，从毫秒开始处理
        if (parts.length < 3) return 0; // 容错处理，至少有 M:S,ms

        const milliseconds = parseInt(parts[0], 10) || 0;
        const seconds = parseInt(parts[1], 10) || 0;
        const minutes = parseInt(parts[2], 10) || 0;
        const hours = parseInt(parts[3], 10) || 0; // 如果不存在(mm:ss,ms)，则为 undefined，parseInt结果为NaN，最终取0

        return (hours * 3600) + (minutes * 60) + seconds + (milliseconds / 1000);
    }

    // 解析 SRT/VTT 字幕内容 (兼容两种格式)
    function parseSubtitles(subtitleContent) {
        const lines = subtitleContent.replace(/\r/g, '').split('\n\n');
        const subs = [];
        for (const line of lines) {
            const parts = line.split('\n');
            if (parts.length < 2) continue;

            const timeMatch = parts.find(p => p.includes('-->'));
            if (!timeMatch) continue;

            const timeParts = timeMatch.split(' --> ');
            if (timeParts.length !== 2) continue;

            const startTime = timeToSeconds(timeParts[0]);
            const endTime = timeToSeconds(timeParts[1]);
            const text = parts.slice(parts.indexOf(timeMatch) + 1).join('\n').trim();

            if (text) {
                subs.push({ start: startTime, end: endTime, text: text });
            }
        }
        return subs;
    }


    // 更新字幕显示
    function updateSubtitles() {
        if (!videoElement || !subtitleContainer) {
            animationFrameId = requestAnimationFrame(updateSubtitles);
            return;
        }

        const currentTime = videoElement.currentTime;
        const currentSub = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);

        if (currentSub && subtitleContainer.innerHTML !== currentSub.text) {
            subtitleContainer.innerHTML = currentSub.text.replace(/\n/g, '<br>');
            subtitleContainer.style.visibility = 'visible';
        } else if (!currentSub && subtitleContainer.innerHTML !== '') {
            subtitleContainer.innerHTML = '';
            subtitleContainer.style.visibility = 'hidden';
        }
        animationFrameId = requestAnimationFrame(updateSubtitles);
    }


    // 处理文件选择
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            subtitles = parseSubtitles(content);

            if(subtitles.length > 0){
                alert(`字幕加载成功！共 ${subtitles.length} 条。`);
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                updateSubtitles();
            } else {
                alert('无法解析字幕文件，请检查文件格式是否正确 (支持 SRT 和 VTT) 或文件编码是否为 UTF-8。');
            }
        };
        reader.readAsText(file, 'UTF-8');
    }

    // 创建并注入UI元素
    function injectUI() {
        const player = document.querySelector('#movie_player');
        // 新的按钮位置，在点赞按钮的容器里
        const actionsContainer = document.querySelector('#below #actions');

        if (!player || !actionsContainer) {
            return; // 如果元素未找到，则不执行任何操作
        }

        // --- 创建字幕显示容器 (如果不存在) ---
        if (!document.getElementById('custom-subtitle-display')) {
            subtitleContainer = document.createElement('div');
            subtitleContainer.id = 'custom-subtitle-display';
            subtitleContainer.style.cssText = subtitleStyle;
            player.appendChild(subtitleContainer);
            console.log('Subtitle container injected.');
        }

        // --- 创建文件选择器 (如果不存在) ---
        if (!document.getElementById('local-subtitle-input-container')) {
            const container = document.createElement('div');
            container.id = 'local-subtitle-input-container';
            container.style.cssText = `
                display: flex;
                align-items: center;
                margin: 0 8px;
            `;

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.srt,.vtt';
            fileInput.style.display = 'none';
            fileInput.id = 'local-subtitle-input';
            fileInput.addEventListener('change', handleFileSelect);

            const fileInputLabel = document.createElement('label');
            fileInputLabel.htmlFor = 'local-subtitle-input';
            fileInputLabel.textContent = '加载字幕';
            fileInputLabel.style.cssText = `
                cursor: pointer;
                background-color: #eee;
                color: #333;
                padding: 8px 12px;
                border-radius: 18px;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.3s;
                white-space: nowrap; /* 关键改动：强制不换行 */
            `;
            // 适配暗色模式
            if(document.querySelector('html[dark=true]')) {
                 fileInputLabel.style.backgroundColor = '#3f3f3f';
                 fileInputLabel.style.color = '#fff';
            }

            fileInputLabel.onmouseover = () => { fileInputLabel.style.backgroundColor = '#ccc'; };
            fileInputLabel.onmouseout = () => {
                 fileInputLabel.style.backgroundColor = document.querySelector('html[dark=true]') ? '#3f3f3f' : '#eee';
            };


            container.appendChild(fileInput);
            container.appendChild(fileInputLabel);

            // 插入到 "分享" 按钮后面
            const shareButton = actionsContainer.querySelector('ytd-button-renderer:nth-child(2)');
            if (shareButton) {
                shareButton.parentNode.insertBefore(container, shareButton.nextSibling);
            } else {
                 actionsContainer.appendChild(container); // 备用方案
            }
            console.log('UI button injected.');
        }


        // 获取 video 元素
        videoElement = document.querySelector('#movie_player video');
        if (!videoElement) {
             console.error("Could not find video element.");
             return;
        }

        // 确保字幕循环只在需要时启动
        if (!animationFrameId) {
             updateSubtitles();
        }
    }

    // 使用 MutationObserver 来确保在页面动态加载完成后执行脚本
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('#below #actions') && document.querySelector('#movie_player video')) {
            injectUI();
            obs.disconnect(); // 找到元素后停止观察，避免重复执行
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
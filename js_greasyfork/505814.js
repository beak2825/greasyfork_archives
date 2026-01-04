// ==UserScript==
// @name         B站视频进度条
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  准确统计全部分P观看进度（含双重进度显示）
// @author       FocusOn1
// @match        https://www.bilibili.com/video/*
// @match        https://greasyfork.org/zh-CN/scripts/505814-b%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1
// @match        https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505814/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/505814/B%E7%AB%99%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        size: 80,
        position: {
            x: GM_getValue('posX', 20),
            y: GM_getValue('posY', 20)
        },
        colors: GM_getValue('colors', {
            progress: '#FF9500',
            progress2: '#00a1d6',
            bg: '#eeeeee',
            text: '#222'
        }),
        opacity: GM_getValue('opacity', 0.8),
        lineWidth: 4,
        updateInterval: 500,
        zIndex: 2147483647,
        fullscreenZIndex: 2147483646
    };

    // 状态
    const state = {
        container: null,
        canvas: null,
        tooltip: null,
        video: null,
        lastUpdate: 0,
        partDurations: [],
        currentPart: 1,
        totalParts: 1,
        isFullscreen: false
    };

    // 创建UI元素
    function createUI() {
        // 移除旧元素
        const old = document.getElementById('bili-progress-container');
        if (old) old.remove();

        // 创建容器
        state.container = document.createElement('div');
        state.container.id = 'bili-progress-container';
        updateContainerStyle();

        // 创建Canvas - 使用2D渲染避免WebGL警告
        state.canvas = document.createElement('canvas');
        state.canvas.width = config.size;
        state.canvas.height = config.size;
        state.canvas.style.cssText = 'display: block; width: 100%; height: 100%;';
        state.container.appendChild(state.canvas);

        // 创建工具提示
        state.tooltip = document.createElement('div');
        state.tooltip.id = 'bili-progress-tooltip';
        state.tooltip.style.cssText = `
            position: absolute;
            left: ${config.size + 10}px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: ${config.zIndex + 1};
            font-size: 12px;
            white-space: nowrap;
            display: none;
            min-width: 200px;
            pointer-events: none;
        `;
        state.container.appendChild(state.tooltip);

        // 添加事件监听
        state.container.addEventListener('mouseenter', () => state.tooltip.style.display = 'block');
        state.container.addEventListener('mouseleave', () => state.tooltip.style.display = 'none');
        state.container.addEventListener('mousedown', startDrag);
        state.container.addEventListener('contextmenu', showColorPicker);

        // 添加到正确的位置
        appendToCorrectParent();
    }

    // 拖动功能
    function startDrag(e) {
        if (e.button !== 0) return;

        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = parseInt(state.container.style.left);
        const startBottom = parseInt(state.container.style.bottom);

        function moveHandler(e) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = startLeft + dx;
            const newBottom = startBottom - dy;

            state.container.style.left = newLeft + 'px';
            state.container.style.bottom = newBottom + 'px';

            config.position.x = newLeft;
            config.position.y = newBottom;
            GM_setValue('posX', newLeft);
            GM_setValue('posY', newBottom);
        }

        function upHandler() {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        }

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }

    // 更新容器样式
    function updateContainerStyle() {
        if (!state.container) return;

        state.container.style.cssText = `
            position: ${state.isFullscreen ? 'absolute' : 'fixed'};
            left: ${config.position.x}px;
            bottom: ${config.position.y}px;
            width: ${config.size}px;
            height: ${config.size}px;
            border-radius: 50%;
            background: rgba(246, 248, 250, ${config.opacity});
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: ${state.isFullscreen ? config.fullscreenZIndex : config.zIndex};
            cursor: move;
            user-select: none;
            pointer-events: auto;
        `;
    }

    // 将元素添加到正确的父容器
    function appendToCorrectParent() {
        if (!state.container) return;

        // 尝试获取全屏容器
        const fullscreenContainer = getFullscreenContainer();

        if (state.isFullscreen && fullscreenContainer) {
            // 全屏模式下添加到播放器容器
            if (state.container.parentNode !== fullscreenContainer) {
                fullscreenContainer.appendChild(state.container);
            }
        } else {
            // 其他模式下添加到body
            if (state.container.parentNode !== document.body) {
                document.body.appendChild(state.container);
            }
        }
    }

    // 获取全屏容器
    function getFullscreenContainer() {
        // B站新版全屏容器
        const newFullscreenContainer = document.querySelector('.bpx-player-container.bpx-player-fullscreen, .bpx-player-video-wrap');
        if (newFullscreenContainer) return newFullscreenContainer;

        // 旧版全屏容器
        return document.querySelector('.bilibili-player-video-wrap.bilibili-player-fullscreen');
    }

    // 检测全屏状态
    function checkFullscreenStatus() {
        const newStatus = document.fullscreenElement ||
                         document.webkitFullscreenElement ||
                         document.mozFullScreenElement ||
                         document.msFullscreenElement;

        // 检查B站特定的全屏类
        const bilibiliFullscreen = document.querySelector('.bpx-player-container.bpx-player-fullscreen, .bilibili-player-video-wrap.bilibili-player-fullscreen');

        const shouldBeFullscreen = !!newStatus || !!bilibiliFullscreen;

        if (shouldBeFullscreen !== state.isFullscreen) {
            state.isFullscreen = shouldBeFullscreen;
            handleFullscreenChange();
        }
    }

    // 处理全屏变化
    function handleFullscreenChange() {
        if (!state.container) return;

        updateContainerStyle();
        appendToCorrectParent();

        // 强制重绘
        if (state.canvas) {
            const progress = calculateDoubleProgress();
            if (progress) {
                drawDoubleProgress(progress.percent1, progress.percent2);
            }
        }
    }

    // 设置全屏监听器
    function setupFullscreenListeners() {
        const events = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange'
        ];

        events.forEach(event => {
            document.addEventListener(event, checkFullscreenStatus, false);
        });

        // 初始检查
        checkFullscreenStatus();

        // 添加定时检查，确保捕获所有全屏变化
        setInterval(checkFullscreenStatus, 1000);
    }

    // 绘制双重进度条
    function drawDoubleProgress(percent1, percent2) {
        if (!state.canvas) return;

        const ctx = state.canvas.getContext('2d');
        const center = config.size / 2;
        const radius = center - 10;
        const innerRadius = radius - 8;

        ctx.clearRect(0, 0, config.size, config.size);

        // 背景圆环
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.strokeStyle = config.colors.bg;
        ctx.lineWidth = config.lineWidth;
        ctx.stroke();

        // 主进度条（外圈）
        ctx.beginPath();
        ctx.arc(center, center, radius, -Math.PI/2, (percent1/100)*Math.PI*2 - Math.PI/2);
        ctx.strokeStyle = config.colors.progress;
        ctx.lineWidth = config.lineWidth;
        ctx.stroke();

        // 次进度条（内圈）
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, -Math.PI/2, (percent2/100)*Math.PI*2 - Math.PI/2);
        ctx.strokeStyle = config.colors.progress2;
        ctx.lineWidth = config.lineWidth - 1;
        ctx.stroke();

        // 百分比文字
        ctx.fillStyle = config.colors.text;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.min(100, percent1).toFixed(1)}%`, center, center);
    }

    // 获取当前分P信息
    function getCurrentPartInfo() {
        try {
            // 从URL获取当前分P
            const urlParams = new URLSearchParams(window.location.search);
            const pParam = urlParams.get('p');
            state.currentPart = pParam ? parseInt(pParam) : 1;

            // 从页面元素获取总P数
            const partInfoElement = document.querySelector(".part-info, .video-pod__header .left div, .video-info .p");
            if (partInfoElement) {
                const partText = partInfoElement.textContent.trim();
                const match = partText.match(/(\d+)\/(\d+)/);
                if (match) {
                    state.totalParts = parseInt(match[2]);
                }
            }

            // 获取当前分P时长
            const durationElement = document.querySelector(".bpx-player-duration-time");
            let duration = state.video ? state.video.duration : 0;

            if (durationElement) {
                const durationText = durationElement.textContent.trim();
                duration = parseDuration(durationText);
            }

            return duration;
        } catch (e) {
            console.error('获取分P信息失败:', e);
            return 0;
        }
    }

    // 解析时长
    function parseDuration(text) {
        const parts = text.split(':').reverse();
        let seconds = 0;
        if (parts[0]) seconds += parseInt(parts[0]) || 0;
        if (parts[1]) seconds += (parseInt(parts[1]) || 0) * 60;
        if (parts[2]) seconds += (parseInt(parts[2]) || 0) * 3600;
        return seconds;
    }

    // 获取所有分P的时长
    function fetchAllPartDurations() {
        const aidMatch = window.location.pathname.match(/video\/(av\d+|BV\w+)/);
        if (!aidMatch) return;

        const bvid = aidMatch[1];
        const apiUrl = `https://api.bilibili.com/x/player/pagelist?bvid=${bvid}&jsonp=jsonp`;

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 0 && data.data && data.data.length > 0) {
                        state.partDurations = data.data.map(part => part.duration);
                        state.totalParts = data.data.length;
                        console.log('获取分P时长成功:', state.partDurations);
                    }
                } catch (e) {
                    console.error('解析分P时长失败:', e);
                }
            },
            onerror: function(error) {
                console.error('获取分P时长失败:', error);
            }
        });
    }

    // 计算双重进度
    function calculateDoubleProgress() {
        if (!state.video) return null;

        const now = Date.now();
        if (now - state.lastUpdate < config.updateInterval) return null;
        state.lastUpdate = now;

        // 获取当前分P信息
        const currentDuration = getCurrentPartInfo();

        // 如果没有获取到所有分P时长，使用当前分P时长作为默认值
        if (state.partDurations.length === 0) {
            state.partDurations = Array(state.totalParts).fill(currentDuration);
        }

        // 确保当前分P在合理范围内
        state.currentPart = Math.min(Math.max(1, state.currentPart), state.totalParts);

        // 计算总时长和已观看时长
        const totalDuration = state.partDurations.reduce((sum, duration) => sum + duration, 0);
        let watchedBeforeCurrent = 0;

        // 计算之前所有分P的总时长
        for (let i = 0; i < state.currentPart - 1; i++) {
            watchedBeforeCurrent += state.partDurations[i] || 0;
        }

        // 主进度：(当前+之前)/全部
        const percent1 = totalDuration > 0 ?
            ((watchedBeforeCurrent + state.video.currentTime) / totalDuration) * 100 : 0;

        // 次进度：当前/当前分P
        const currentPartDuration = state.partDurations[state.currentPart - 1] || currentDuration;
        const percent2 = currentPartDuration > 0 ?
            (state.video.currentTime / currentPartDuration) * 100 : 0;

        const isComplete = percent1 >= 99.9;

        return {
            percent1,
            percent2,
            text: `累计: ${formatTime(watchedBeforeCurrent + state.video.currentTime)} / ${formatTime(totalDuration)}`,
            current: formatTime(state.video.currentTime),
            currentTotal: formatTime(currentPartDuration),
            part: state.currentPart,
            totalParts: state.totalParts,
            isComplete
        };
    }

    // 格式化时间
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 更新UI
    function updateUI() {
        const progress = calculateDoubleProgress();
        if (!progress) return;

        if (progress.isComplete) {
            state.canvas.style.filter = 'drop-shadow(0 0 5px #00a1d6)';
        } else {
            state.canvas.style.filter = 'none';
        }

        drawDoubleProgress(progress.percent1, progress.percent2);

        if (state.tooltip) {
            state.tooltip.innerHTML = `
                <div><strong>总进度: ${progress.percent1.toFixed(1)}%</strong> (已看${progress.part}/${progress.totalParts}P)</div>
                <div>${progress.text}</div>
                <div style="margin-top:5px;border-top:1px solid #eee;padding-top:5px;">
                    <div>当前分P: ${progress.part}/${progress.totalParts}</div>
                    <div>当前进度: ${progress.current} / ${progress.currentTotal} (${progress.percent2.toFixed(1)}%)</div>
                </div>
                ${progress.isComplete ? '<div style="color:#00a1d6;font-weight:bold;margin-top:5px;">✓ 已完成</div>' : ''}
            `;
        }
    }

    // 颜色选择器
    function showColorPicker(e) {
        e.preventDefault();

        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: ${config.zIndex + 2};
            display: grid;
            grid-template-columns: 80px 1fr;
            gap: 10px;
            align-items: center;
        `;

        const title = document.createElement('div');
        title.textContent = '设置';
        title.style.cssText = 'grid-column: 1 / 3; font-weight: bold; margin-bottom: 5px;';
        popup.appendChild(title);

        // 颜色设置
        addColorPicker(popup, '主进度颜色', 'progress', config.colors.progress);
        addColorPicker(popup, '次进度颜色', 'progress2', config.colors.progress2);
        addColorPicker(popup, '背景颜色', 'bg', config.colors.bg);
        addColorPicker(popup, '文字颜色', 'text', config.colors.text);

        // 透明度滑块
        const opacityLabel = document.createElement('label');
        opacityLabel.textContent = '透明度';
        opacityLabel.style.textAlign = 'right';
        popup.appendChild(opacityLabel);

        const opacityContainer = document.createElement('div');
        opacityContainer.style.display = 'flex';
        opacityContainer.style.alignItems = 'center';
        opacityContainer.style.gap = '10px';

        const opacitySlider = document.createElement('input');
        opacitySlider.type = 'range';
        opacitySlider.min = '0.1';
        opacitySlider.max = '1';
        opacitySlider.step = '0.1';
        opacitySlider.value = config.opacity;
        opacitySlider.style.flex = '1';

        const opacityValue = document.createElement('span');
        opacityValue.textContent = Math.round(config.opacity * 100) + '%';
        opacityValue.style.width = '40px';

        opacitySlider.addEventListener('input', (e) => {
            config.opacity = parseFloat(e.target.value);
            opacityValue.textContent = Math.round(config.opacity * 100) + '%';
            state.container.style.background = `rgba(246, 248, 250, ${config.opacity})`;
        });

        opacityContainer.appendChild(opacitySlider);
        opacityContainer.appendChild(opacityValue);
        popup.appendChild(opacityContainer);

        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = 'grid-column: 1 / 3; display: flex; gap: 10px; margin-top: 5px;';

        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置默认';
        resetBtn.addEventListener('click', () => {
            config.colors = {
                progress: '#FF9500',
                progress2: '#00a1d6',
                bg: '#eeeeee',
                text: '#222'
            };
            config.opacity = 0.8;
            opacitySlider.value = 0.8;
            opacityValue.textContent = '80%';
            GM_setValue('colors', config.colors);
            GM_setValue('opacity', 0.8);
            state.container.style.background = `rgba(246, 248, 250, 0.8)`;
            updateUI();
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.addEventListener('click', () => {
            GM_setValue('colors', config.colors);
            GM_setValue('opacity', config.opacity);
            popup.remove();
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.addEventListener('click', () => popup.remove());

        btnContainer.appendChild(resetBtn);
        btnContainer.appendChild(saveBtn);
        btnContainer.appendChild(closeBtn);
        popup.appendChild(btnContainer);

        function handleOutsideClick(e) {
            if (!popup.contains(e.target)) {
                popup.remove();
                document.removeEventListener('click', handleOutsideClick);
            }
        }

        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 100);

        document.body.appendChild(popup);
    }

    function addColorPicker(container, label, key, defaultValue) {
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        labelEl.style.textAlign = 'right';
        container.appendChild(labelEl);

        const input = document.createElement('input');
        input.type = 'color';
        input.value = defaultValue;
        input.addEventListener('input', (e) => {
            config.colors[key] = e.target.value;
            updateUI();
        });
        container.appendChild(input);
    }

    // 初始化
    function init() {
        createUI();
        setupFullscreenListeners();

        // 查找视频元素
        state.video = document.querySelector('video');
        if (!state.video) {
            const observer = new MutationObserver(() => {
                const video = document.querySelector('video');
                if (video) {
                    state.video = video;
                    observer.disconnect();
                    state.video.addEventListener('timeupdate', updateUI);
                    fetchAllPartDurations();
                    updateUI();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        state.video.addEventListener('timeupdate', updateUI);
        fetchAllPartDurations();
        updateUI();
    }

    // 启动
    if (document.readyState === 'complete') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1000));
    }
})();
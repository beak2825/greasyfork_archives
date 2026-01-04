// ==UserScript==
// @name         动画疯弹幕播放器
// @namespace    http://tampermonkey.net/
// @version      2025-07-11
// @description  为动画疯添加自定义视频播放器，支持弹幕显示和时间微调
// @author       You
// @match        https://ani.gamer.com.tw/animeVideo.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ani.gamer.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542283/%E5%8A%A8%E7%94%BB%E7%96%AF%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542283/%E5%8A%A8%E7%94%BB%E7%96%AF%E5%BC%B9%E5%B9%95%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let danmuData = [];
    let timeOffset = 0; // 时间偏移量（秒）
    let customPlayer = null;
    let danmuContainer = null;
    let isPlaying = false; // 视频播放状态
    let activeDanmuElements = new Set(); // 活跃的弹幕元素集合
    let isCustomFullscreen = false; // 自定义全屏状态

    // 弹幕设置
    let danmuSettings = {
        displayArea: 'full', // 'full' | 'half' | 'quarter'
        opacity: 0.9,
        fontSize: 1.0,
        speed: 1.0,
        density: 1.0,
        showScroll: true,
        showTop: true,
        showBottom: true
    };

    // 从URL中提取视频sn
    function getVideoSn() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('sn');
    }

    // 获取弹幕数据
    async function fetchDanmu(sn) {
        try {
            const response = await fetch(`https://api.gamer.com.tw/anime/v1/danmu.php?videoSn=${sn}&geo=TW%2CHK`);
            const data = await response.json();
            if (data.data && data.data.danmu) {
                danmuData = data.data.danmu;
                console.log(`获取到 ${danmuData.length} 条弹幕`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('获取弹幕失败:', error);
            return false;
        }
    }

    // 创建自定义播放器
    function createCustomPlayer() {
        const playerContainer = document.createElement('div');
        playerContainer.id = 'custom-player-container';
        playerContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80vw;
            max-width: 1200px;
            height: 70vh;
            background: #000;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.8);
            z-index: 10000;
            display: none;
            flex-direction: column;
        `;

        // 播放器头部控制栏
        const playerHeader = document.createElement('div');
        playerHeader.id = 'player-header';
        playerHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: rgba(0,0,0,0.8);
            color: white;
            border-radius: 8px 8px 0 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            position: relative;
            z-index: 1000;
        `;

        const playerTitle = document.createElement('div');
        playerTitle.textContent = '自定义弹幕播放器';
        playerTitle.style.fontSize = '16px';

        const controlButtons = document.createElement('div');
        controlButtons.style.display = 'flex';
        controlButtons.style.gap = '10px';

        // 时间微调控件
        const timeAdjustContainer = document.createElement('div');
        timeAdjustContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 12px;
        `;

        const timeAdjustLabel = document.createElement('span');
        timeAdjustLabel.textContent = '时间微调:';

        // 减少按钮组
        const minusButtonsContainer = document.createElement('div');
        minusButtonsContainer.style.cssText = `
            display: flex;
            gap: 2px;
        `;

        // 创建减少按钮
        const adjustValues = [0.1, 0.5, 1, 5];
        const minusButtons = [];
        const plusButtons = [];

        adjustValues.forEach(value => {
            const minusBtn = document.createElement('button');
            minusBtn.textContent = `-${value}s`;
            minusBtn.style.cssText = `
                padding: 2px 4px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                min-width: 35px;
            `;
            minusButtons.push({ button: minusBtn, value: value });
            minusButtonsContainer.appendChild(minusBtn);
        });

        // 时间显示
        const timeAdjustDisplay = document.createElement('span');
        timeAdjustDisplay.textContent = '0.0s';
        timeAdjustDisplay.style.cssText = `
            min-width: 50px;
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 4px 8px;
            border-radius: 3px;
            margin: 0 3px;
        `;

        // 增加按钮组
        const plusButtonsContainer = document.createElement('div');
        plusButtonsContainer.style.cssText = `
            display: flex;
            gap: 2px;
        `;

        adjustValues.forEach(value => {
            const plusBtn = document.createElement('button');
            plusBtn.textContent = `+${value}s`;
            plusBtn.style.cssText = `
                padding: 2px 4px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 10px;
                min-width: 35px;
            `;
            plusButtons.push({ button: plusBtn, value: value });
            plusButtonsContainer.appendChild(plusBtn);
        });

        // 重置按钮
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置';
        resetButton.style.cssText = `
            padding: 2px 6px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
            margin-left: 5px;
        `;

        timeAdjustContainer.appendChild(timeAdjustLabel);
        timeAdjustContainer.appendChild(minusButtonsContainer);
        timeAdjustContainer.appendChild(timeAdjustDisplay);
        timeAdjustContainer.appendChild(plusButtonsContainer);
        timeAdjustContainer.appendChild(resetButton);

        // 弹幕设置按钮
        const danmuSettingsButton = document.createElement('button');
        danmuSettingsButton.textContent = '⚙️';
        danmuSettingsButton.title = '弹幕设置';
        danmuSettingsButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 5px;
        `;

        // 自定义全屏按钮
        const fullscreenButton = document.createElement('button');
        fullscreenButton.textContent = '⛶';
        fullscreenButton.title = '全屏播放';
        fullscreenButton.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 5px;
        `;

        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;

        controlButtons.appendChild(timeAdjustContainer);
        controlButtons.appendChild(danmuSettingsButton);
        controlButtons.appendChild(fullscreenButton);
        controlButtons.appendChild(closeButton);

        playerHeader.appendChild(playerTitle);
        playerHeader.appendChild(controlButtons);

        // 视频播放区域
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
            position: relative;
            flex: 1;
            overflow: hidden;
        `;

        const video = document.createElement('video');
        video.id = 'custom-video-player';
        video.controls = true;
        video.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
        `;

        // 完全禁用video原生全屏
        video.disablePictureInPicture = true;
        video.controlsList = 'nodownload nofullscreen';

        // 双击视频全屏
        video.addEventListener('dblclick', () => {
            toggleCustomFullscreen();
        });

        // 阻止任何可能的原生全屏
        video.addEventListener('webkitbeginfullscreen', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCustomFullscreen();
        });

        video.addEventListener('webkitendfullscreen', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // 弹幕容器
        danmuContainer = document.createElement('div');
        danmuContainer.id = 'danmu-container';
        danmuContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 2147483647;
        `;

        // 初始化弹幕容器显示区域
        updateDanmuContainer();

        videoContainer.appendChild(video);
        videoContainer.appendChild(danmuContainer);

        playerContainer.appendChild(playerHeader);
        playerContainer.appendChild(videoContainer);

        // 事件监听
        // 减少按钮事件
        minusButtons.forEach(({ button, value }) => {
            button.addEventListener('click', () => {
                timeOffset -= value;
                timeAdjustDisplay.textContent = `${timeOffset.toFixed(1)}s`;
            });
        });

        // 增加按钮事件
        plusButtons.forEach(({ button, value }) => {
            button.addEventListener('click', () => {
                timeOffset += value;
                timeAdjustDisplay.textContent = `${timeOffset.toFixed(1)}s`;
            });
        });

        // 重置按钮事件
        resetButton.addEventListener('click', () => {
            timeOffset = 0;
            timeAdjustDisplay.textContent = '0.0s';
        });

        danmuSettingsButton.addEventListener('click', () => {
            toggleDanmuSettings();
        });

        fullscreenButton.addEventListener('click', () => {
            toggleCustomFullscreen();
        });

        closeButton.addEventListener('click', () => {
            playerContainer.style.display = 'none';
        });

        // 视频事件监听
        video.addEventListener('timeupdate', () => {
            if (isPlaying) {
                displayDanmu(video.currentTime);
            }
        });

        video.addEventListener('play', () => {
            isPlaying = true;
            resumeAllDanmu();
        });

        video.addEventListener('pause', () => {
            isPlaying = false;
            pauseAllDanmu();
        });

        video.addEventListener('ended', () => {
            isPlaying = false;
            clearAllDanmu();
        });

        // 监听视频元素的全屏事件
        video.addEventListener('webkitbeginfullscreen', () => {
            console.log('视频开始全屏 (webkit)');
            handleVideoFullscreen(true);
        });

        video.addEventListener('webkitendfullscreen', () => {
            console.log('视频结束全屏 (webkit)');
            handleVideoFullscreen(false);
        });

        video.addEventListener('seeked', () => {
            // 拖拽进度条时清除所有弹幕
            clearAllDanmu();
        });

        // 全屏状态变化监听
        document.addEventListener('fullscreenchange', () => {
            handleFullscreenChange();
        });

        document.addEventListener('webkitfullscreenchange', () => {
            handleFullscreenChange();
        });

        document.addEventListener('mozfullscreenchange', () => {
            handleFullscreenChange();
        });

        document.addEventListener('MSFullscreenChange', () => {
            handleFullscreenChange();
        });

        document.body.appendChild(playerContainer);
        return { container: playerContainer, video: video, fullscreenButton: fullscreenButton, header: playerHeader, danmuSettingsButton: danmuSettingsButton };
    }

    // 创建弹幕设置面板
    function createDanmuSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'danmu-settings-panel';
        panel.style.cssText = `
            position: absolute;
            top: 60px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            font-size: 14px;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #fff;">弹幕设置</h3>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">显示区域：</label>
                <select id="danmu-display-area" style="width: 100%; padding: 5px; border-radius: 4px; border: none; background: #333; color: white;">
                    <option value="full">全屏显示</option>
                    <option value="half">半屏显示</option>
                    <option value="quarter">1/4屏显示</option>
                </select>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">透明度：<span id="opacity-value">90%</span></label>
                <input type="range" id="danmu-opacity" min="0.1" max="1" step="0.1" value="0.9" style="width: 100%;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">字体大小：<span id="fontsize-value">100%</span></label>
                <input type="range" id="danmu-fontsize" min="0.5" max="2" step="0.1" value="1.0" style="width: 100%;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">滚动速度：<span id="speed-value">100%</span></label>
                <input type="range" id="danmu-speed" min="0.5" max="2" step="0.1" value="1.0" style="width: 100%;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">弹幕密度：<span id="density-value">100%</span></label>
                <input type="range" id="danmu-density" min="0.1" max="2" step="0.1" value="1.0" style="width: 100%;">
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 10px;">弹幕类型：</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="danmu-scroll" checked style="margin-right: 5px;">
                        滚动弹幕
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="danmu-top" checked style="margin-right: 5px;">
                        顶部弹幕
                    </label>
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="danmu-bottom" checked style="margin-right: 5px;">
                        底部弹幕
                    </label>
                </div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="danmu-settings-reset" style="flex: 1; padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    重置
                </button>
                <button id="danmu-settings-close" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    关闭
                </button>
            </div>
        `;

        return panel;
    }

    // 弹幕设置面板控制
    let danmuSettingsPanel = null;
    let isSettingsPanelOpen = false;

    function toggleDanmuSettings() {
        if (!danmuSettingsPanel) {
            danmuSettingsPanel = createDanmuSettingsPanel();
            if (customPlayer && customPlayer.container) {
                customPlayer.container.appendChild(danmuSettingsPanel);
                setupDanmuSettingsEvents();
            }
        }

        if (isSettingsPanelOpen) {
            danmuSettingsPanel.style.display = 'none';
            isSettingsPanelOpen = false;
        } else {
            danmuSettingsPanel.style.display = 'block';
            isSettingsPanelOpen = true;
            updateSettingsDisplay();
        }
    }

    // 设置弹幕设置面板的事件监听
    function setupDanmuSettingsEvents() {
        if (!danmuSettingsPanel) return;

                 // 显示区域
         const displayAreaSelect = danmuSettingsPanel.querySelector('#danmu-display-area');
         displayAreaSelect.addEventListener('change', (e) => {
             danmuSettings.displayArea = e.target.value;
             updateDanmuContainer();
         });

        // 透明度
        const opacitySlider = danmuSettingsPanel.querySelector('#danmu-opacity');
        const opacityValue = danmuSettingsPanel.querySelector('#opacity-value');
        opacitySlider.addEventListener('input', (e) => {
            danmuSettings.opacity = parseFloat(e.target.value);
            opacityValue.textContent = Math.round(danmuSettings.opacity * 100) + '%';
            updateDanmuStyles();
        });

        // 字体大小
        const fontsizeSlider = danmuSettingsPanel.querySelector('#danmu-fontsize');
        const fontsizeValue = danmuSettingsPanel.querySelector('#fontsize-value');
        fontsizeSlider.addEventListener('input', (e) => {
            danmuSettings.fontSize = parseFloat(e.target.value);
            fontsizeValue.textContent = Math.round(danmuSettings.fontSize * 100) + '%';
            updateDanmuStyles();
        });

        // 滚动速度
        const speedSlider = danmuSettingsPanel.querySelector('#danmu-speed');
        const speedValue = danmuSettingsPanel.querySelector('#speed-value');
        speedSlider.addEventListener('input', (e) => {
            danmuSettings.speed = parseFloat(e.target.value);
            speedValue.textContent = Math.round(danmuSettings.speed * 100) + '%';
        });

        // 弹幕密度
        const densitySlider = danmuSettingsPanel.querySelector('#danmu-density');
        const densityValue = danmuSettingsPanel.querySelector('#density-value');
        densitySlider.addEventListener('input', (e) => {
            danmuSettings.density = parseFloat(e.target.value);
            densityValue.textContent = Math.round(danmuSettings.density * 100) + '%';
        });

        // 弹幕类型
        const scrollCheckbox = danmuSettingsPanel.querySelector('#danmu-scroll');
        const topCheckbox = danmuSettingsPanel.querySelector('#danmu-top');
        const bottomCheckbox = danmuSettingsPanel.querySelector('#danmu-bottom');

        scrollCheckbox.addEventListener('change', (e) => {
            danmuSettings.showScroll = e.target.checked;
        });

        topCheckbox.addEventListener('change', (e) => {
            danmuSettings.showTop = e.target.checked;
        });

        bottomCheckbox.addEventListener('change', (e) => {
            danmuSettings.showBottom = e.target.checked;
        });

        // 重置按钮
        const resetButton = danmuSettingsPanel.querySelector('#danmu-settings-reset');
        resetButton.addEventListener('click', () => {
            resetDanmuSettings();
        });

        // 关闭按钮
        const closeButton = danmuSettingsPanel.querySelector('#danmu-settings-close');
        closeButton.addEventListener('click', () => {
            toggleDanmuSettings();
        });
    }

    // 更新设置显示
    function updateSettingsDisplay() {
        if (!danmuSettingsPanel) return;

        const displayAreaSelect = danmuSettingsPanel.querySelector('#danmu-display-area');
        const opacitySlider = danmuSettingsPanel.querySelector('#danmu-opacity');
        const opacityValue = danmuSettingsPanel.querySelector('#opacity-value');
        const fontsizeSlider = danmuSettingsPanel.querySelector('#danmu-fontsize');
        const fontsizeValue = danmuSettingsPanel.querySelector('#fontsize-value');
        const speedSlider = danmuSettingsPanel.querySelector('#danmu-speed');
        const speedValue = danmuSettingsPanel.querySelector('#speed-value');
        const densitySlider = danmuSettingsPanel.querySelector('#danmu-density');
        const densityValue = danmuSettingsPanel.querySelector('#density-value');
        const scrollCheckbox = danmuSettingsPanel.querySelector('#danmu-scroll');
        const topCheckbox = danmuSettingsPanel.querySelector('#danmu-top');
        const bottomCheckbox = danmuSettingsPanel.querySelector('#danmu-bottom');

        displayAreaSelect.value = danmuSettings.displayArea;
        opacitySlider.value = danmuSettings.opacity;
        opacityValue.textContent = Math.round(danmuSettings.opacity * 100) + '%';
        fontsizeSlider.value = danmuSettings.fontSize;
        fontsizeValue.textContent = Math.round(danmuSettings.fontSize * 100) + '%';
        speedSlider.value = danmuSettings.speed;
        speedValue.textContent = Math.round(danmuSettings.speed * 100) + '%';
        densitySlider.value = danmuSettings.density;
        densityValue.textContent = Math.round(danmuSettings.density * 100) + '%';
        scrollCheckbox.checked = danmuSettings.showScroll;
        topCheckbox.checked = danmuSettings.showTop;
        bottomCheckbox.checked = danmuSettings.showBottom;
    }

    // 重置弹幕设置
    function resetDanmuSettings() {
        danmuSettings = {
            displayArea: 'full',
            opacity: 0.9,
            fontSize: 1.0,
            speed: 1.0,
            density: 1.0,
            showScroll: true,
            showTop: true,
            showBottom: true
        };
        updateSettingsDisplay();
        updateDanmuContainer();
        updateDanmuStyles();
    }

    // 更新弹幕容器显示区域
    function updateDanmuContainer() {
        if (!danmuContainer) return;

        // 全屏时强制使用全屏显示，不修改容器
        if (isCustomFullscreen) {
            return;
        }

        let height = '100%';
        let top = '0';

        switch (danmuSettings.displayArea) {
            case 'half':
                height = '50%';
                top = '0';
                break;
            case 'quarter':
                height = '25%';
                top = '0';
                break;
            case 'full':
            default:
                height = '100%';
                top = '0';
                break;
        }

        danmuContainer.style.height = height;
        danmuContainer.style.top = top;
    }

    // 更新现有弹幕样式
    function updateDanmuStyles() {
        const existingDanmu = document.querySelectorAll('.danmu-item');
        existingDanmu.forEach(element => {
            element.style.opacity = danmuSettings.opacity;

            // 更新字体大小
            const currentFontSize = parseFloat(element.style.fontSize);
            if (currentFontSize) {
                const baseFontSize = currentFontSize / (element.dataset.fontScale || 1);
                element.style.fontSize = (baseFontSize * danmuSettings.fontSize) + 'px';
                element.dataset.fontScale = danmuSettings.fontSize;
            }
        });
    }

    // 真正的全屏切换（让播放器容器进入全屏）
    function toggleCustomFullscreen() {
        if (!customPlayer) return;

        if (!isCustomFullscreen) {
            // 进入真正的全屏
            const container = customPlayer.container;

            // 准备全屏样式
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.background = '#000';
            container.style.borderRadius = '0';
            container.style.boxShadow = 'none';

            // 使用浏览器全屏API让容器进入全屏
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
                container.msRequestFullscreen();
            }

            console.log('请求进入真正的全屏模式');
        } else {
            // 退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }

            console.log('请求退出全屏模式');
        }
    }

    // 处理全屏状态变化
    function handleFullscreenChange() {
        const fullscreenElement = document.fullscreenElement ||
                                document.webkitFullscreenElement ||
                                document.mozFullScreenElement ||
                                document.msFullscreenElement;

        if (fullscreenElement) {
            // 进入全屏
            isCustomFullscreen = true;

            // 更新全屏按钮
            if (customPlayer && customPlayer.fullscreenButton) {
                customPlayer.fullscreenButton.textContent = '⛷';
                customPlayer.fullscreenButton.title = '退出全屏';
            }

            // 隐藏顶部工具栏
            if (customPlayer && customPlayer.header) {
                customPlayer.header.style.opacity = '0';
                customPlayer.header.style.transform = 'translateY(-100%)';
                customPlayer.header.style.pointerEvents = 'none';
            }

            // 添加鼠标移动显示工具栏的功能
            setupFullscreenControls();

            // 确保弹幕容器正确显示
            if (danmuContainer) {
                danmuContainer.style.position = 'absolute';
                danmuContainer.style.top = '0';
                danmuContainer.style.left = '0';
                danmuContainer.style.width = '100%';
                danmuContainer.style.height = '100%';
                danmuContainer.style.zIndex = '2147483647';
                danmuContainer.style.pointerEvents = 'none';
                danmuContainer.style.display = 'block';
                danmuContainer.style.visibility = 'visible';
            }

            console.log('已进入全屏模式');
        } else {
            // 退出全屏
            isCustomFullscreen = false;

            // 更新全屏按钮
            if (customPlayer && customPlayer.fullscreenButton) {
                customPlayer.fullscreenButton.textContent = '⛶';
                customPlayer.fullscreenButton.title = '全屏播放';
            }

            // 显示顶部工具栏
            if (customPlayer && customPlayer.header) {
                customPlayer.header.style.opacity = '1';
                customPlayer.header.style.transform = 'translateY(0)';
                customPlayer.header.style.pointerEvents = 'auto';
            }

            // 清除全屏控制
            clearFullscreenControls();

            // 恢复播放器容器样式
            if (customPlayer && customPlayer.container) {
                customPlayer.container.style.width = '80vw';
                customPlayer.container.style.height = '70vh';
                customPlayer.container.style.background = '#000';
                customPlayer.container.style.borderRadius = '8px';
                customPlayer.container.style.boxShadow = '0 8px 32px rgba(0,0,0,0.8)';
            }

            // 更新弹幕容器显示区域
            updateDanmuContainer();

            console.log('已退出全屏模式');
        }
    }

    // 全屏控制相关变量
    let fullscreenMouseTimer;
    let fullscreenMouseListener;

    // 设置全屏控制
    function setupFullscreenControls() {
        if (!customPlayer || !customPlayer.container) return;

        // 鼠标移动监听器
        fullscreenMouseListener = (e) => {
            // 显示工具栏
            if (customPlayer.header) {
                customPlayer.header.style.opacity = '1';
                customPlayer.header.style.transform = 'translateY(0)';
                customPlayer.header.style.pointerEvents = 'auto';
            }

            // 清除之前的定时器
            if (fullscreenMouseTimer) {
                clearTimeout(fullscreenMouseTimer);
            }

            // 3秒后隐藏工具栏
            fullscreenMouseTimer = setTimeout(() => {
                if (customPlayer.header && isCustomFullscreen) {
                    customPlayer.header.style.opacity = '0';
                    customPlayer.header.style.transform = 'translateY(-100%)';
                    customPlayer.header.style.pointerEvents = 'none';
                }
            }, 3000);
        };

        // 添加鼠标移动监听
        customPlayer.container.addEventListener('mousemove', fullscreenMouseListener);

        // 初始隐藏工具栏
        setTimeout(() => {
            if (customPlayer.header && isCustomFullscreen) {
                customPlayer.header.style.opacity = '0';
                customPlayer.header.style.transform = 'translateY(-100%)';
                customPlayer.header.style.pointerEvents = 'none';
            }
        }, 3000);
    }

    // 清除全屏控制
    function clearFullscreenControls() {
        if (fullscreenMouseTimer) {
            clearTimeout(fullscreenMouseTimer);
            fullscreenMouseTimer = null;
        }

        if (fullscreenMouseListener && customPlayer && customPlayer.container) {
            customPlayer.container.removeEventListener('mousemove', fullscreenMouseListener);
            fullscreenMouseListener = null;
        }
    }

    // 处理视频全屏（移动端）
    function handleVideoFullscreen(isFullscreen) {
        if (isFullscreen && danmuContainer) {
            console.log('处理视频全屏模式');
            // 创建全屏弹幕容器
            const fullscreenDanmuContainer = document.createElement('div');
            fullscreenDanmuContainer.id = 'fullscreen-danmu-container';
            fullscreenDanmuContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                overflow: hidden;
                z-index: 2147483647;
                background: transparent;
            `;

            // 将现有弹幕移动到全屏容器
            while (danmuContainer.firstChild) {
                fullscreenDanmuContainer.appendChild(danmuContainer.firstChild);
            }

            document.body.appendChild(fullscreenDanmuContainer);
            danmuContainer.dataset.originalContainer = 'true';
            danmuContainer = fullscreenDanmuContainer;
        } else if (!isFullscreen && danmuContainer && danmuContainer.id === 'fullscreen-danmu-container') {
            console.log('退出视频全屏模式');
            // 恢复原始容器
            const originalContainer = document.getElementById('danmu-container');
            if (originalContainer) {
                // 将弹幕移回原始容器
                while (danmuContainer.firstChild) {
                    originalContainer.appendChild(danmuContainer.firstChild);
                }

                // 移除全屏容器
                danmuContainer.remove();
                danmuContainer = originalContainer;
            }
        }
    }

    // 显示弹幕
    function displayDanmu(currentTime) {
        if (!danmuData.length || !danmuContainer || !isPlaying) return;

        // 检查是否处于全屏状态，如果是则确保弹幕容器正确显示
        ensureDanmuVisibility();

        const adjustedTime = (currentTime + timeOffset) * 10; // 转换为0.1秒单位

        // 清除过期弹幕
        const existingDanmu = danmuContainer.querySelectorAll('.danmu-item');
        existingDanmu.forEach(item => {
            const itemTime = parseFloat(item.dataset.time);
            if (adjustedTime - itemTime > 100) { // 10秒后清除
                item.remove();
                activeDanmuElements.delete(item);
            }
        });

        // 添加新弹幕（应用密度设置）
        let danmuCount = 0;
        const maxDanmuPerFrame = Math.ceil(5 * danmuSettings.density);

        danmuData.forEach(danmu => {
            const danmuTime = danmu.time;
            const timeDiff = Math.abs(adjustedTime - danmuTime);

            if (timeDiff <= 1 && !danmuContainer.querySelector(`[data-sn="${danmu.sn}"]`)) {
                // 应用弹幕类型过滤
                const position = danmu.position === 2 ? 'bottom' : danmu.position === 1 ? 'top' : 'scroll';

                if ((position === 'scroll' && !danmuSettings.showScroll) ||
                    (position === 'top' && !danmuSettings.showTop) ||
                    (position === 'bottom' && !danmuSettings.showBottom)) {
                    return;
                }

                // 应用密度限制
                if (danmuCount >= maxDanmuPerFrame) {
                    return;
                }

                createDanmuElement(danmu);
                danmuCount++;
            }
        });
    }

    // 确保弹幕容器可见
    function ensureDanmuVisibility() {
        if (!danmuContainer) return;

        // 确保弹幕容器始终可见
        danmuContainer.style.position = 'absolute';
        danmuContainer.style.top = '0';
        danmuContainer.style.left = '0';
        danmuContainer.style.width = '100%';
        danmuContainer.style.height = '100%';
        danmuContainer.style.zIndex = '2147483647';
        danmuContainer.style.pointerEvents = 'none';
        danmuContainer.style.display = 'block';
        danmuContainer.style.visibility = 'visible';
    }

    // 暂停所有弹幕动画
    function pauseAllDanmu() {
        activeDanmuElements.forEach(element => {
            // 对于滚动弹幕，记录当前位置并停止动画
            if (element.classList.contains('scroll-danmu')) {
                const computedStyle = window.getComputedStyle(element);
                const currentRight = computedStyle.right;
                element.style.transition = 'none';
                element.style.right = currentRight;
                element.dataset.pausedRight = currentRight;

                // 记录暂停时间，用于计算剩余时间
                element.dataset.pausedTime = Date.now();
            }

            // 对于固定弹幕，清除自动移除的定时器
            if (element.classList.contains('fixed-danmu') && element.dataset.removeTimer) {
                clearTimeout(parseInt(element.dataset.removeTimer));
                delete element.dataset.removeTimer;
            }
        });
    }

    // 恢复所有弹幕动画
    function resumeAllDanmu() {
        activeDanmuElements.forEach(element => {
            // 对于滚动弹幕，从暂停位置继续滚动
            if (element.classList.contains('scroll-danmu') && element.dataset.pausedRight) {
                const pausedRight = parseFloat(element.dataset.pausedRight);
                const containerWidth = element.parentElement.offsetWidth;
                const elementWidth = element.offsetWidth;
                const totalDistance = containerWidth + elementWidth;

                // 计算已经移动的距离
                const movedDistance = totalDistance * (100 - pausedRight) / 100;
                const remainingDistance = totalDistance - movedDistance;
                const remainingTime = (remainingDistance / totalDistance) * 8; // 8秒总时长

                element.style.transition = `right ${remainingTime}s linear`;
                element.style.right = '100%';

                // 设置新的移除定时器
                const removeTimer = setTimeout(() => {
                    if (element.parentNode) {
                        element.remove();
                        activeDanmuElements.delete(element);
                    }
                }, remainingTime * 1000);

                element.dataset.removeTimer = removeTimer.toString();
                delete element.dataset.pausedRight;
                delete element.dataset.pausedTime;
            }

            // 对于固定弹幕，重新设置移除定时器
            if (element.classList.contains('fixed-danmu') && !element.dataset.removeTimer) {
                const removeTimer = setTimeout(() => {
                    if (element.parentNode) {
                        element.remove();
                        activeDanmuElements.delete(element);
                    }
                }, 3000);

                element.dataset.removeTimer = removeTimer.toString();
            }
        });
    }

    // 清除所有弹幕
    function clearAllDanmu() {
        const existingDanmu = danmuContainer.querySelectorAll('.danmu-item');
        existingDanmu.forEach(item => {
            item.remove();
        });
        activeDanmuElements.clear();
    }

    // 创建弹幕元素
    function createDanmuElement(danmu) {
        const danmuElement = document.createElement('div');
        danmuElement.className = 'danmu-item';
        danmuElement.dataset.sn = danmu.sn;
        danmuElement.dataset.time = danmu.time;
        danmuElement.textContent = danmu.text;

        // 弹幕样式（应用设置）
        const baseFontSize = danmu.size === 2 ? 20 : danmu.size === 1 ? 16 : 14;
        const fontSize = (baseFontSize * danmuSettings.fontSize) + 'px';
        const position = danmu.position === 2 ? 'bottom' : danmu.position === 1 ? 'top' : 'scroll';

        danmuElement.style.cssText = `
            position: absolute;
            color: ${danmu.color};
            font-size: ${fontSize};
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            white-space: nowrap;
            z-index: 2147483647;
            pointer-events: none;
            font-family: Arial, sans-serif;
            opacity: ${danmuSettings.opacity};
        `;

        // 保存字体缩放比例
        danmuElement.dataset.fontScale = danmuSettings.fontSize;

        // 添加到活跃弹幕集合
        activeDanmuElements.add(danmuElement);

        // 根据位置类型设置弹幕位置和动画
        if (position === 'scroll') {
            // 滚动弹幕（应用速度设置）
            danmuElement.classList.add('scroll-danmu');

            // 根据显示区域调整位置（全屏时使用全区域）
            let maxTop = 70;
            if (!isCustomFullscreen) {
                switch (danmuSettings.displayArea) {
                    case 'half':
                        maxTop = 35;
                        break;
                    case 'quarter':
                        maxTop = 15;
                        break;
                    default:
                        maxTop = 70;
                        break;
                }
            }

            const randomTop = Math.random() * maxTop + 10;
            danmuElement.style.top = `${randomTop}%`;
            danmuElement.style.right = '-100%';

            // 应用速度设置
            const duration = 8 / danmuSettings.speed;
            danmuElement.style.transition = `right ${duration}s linear`;

            danmuContainer.appendChild(danmuElement);

            // 触发滚动动画
            setTimeout(() => {
                if (isPlaying) {
                    danmuElement.style.right = '100%';
                }
            }, 50);

            // 根据速度调整移除时间
            const removeTimer = setTimeout(() => {
                if (danmuElement.parentNode) {
                    danmuElement.remove();
                    activeDanmuElements.delete(danmuElement);
                }
            }, duration * 1000);

            danmuElement.dataset.removeTimer = removeTimer.toString();
        } else if (position === 'top') {
            // 顶部固定弹幕
            danmuElement.classList.add('fixed-danmu');
            danmuElement.style.top = '10%';
            danmuElement.style.left = '50%';
            danmuElement.style.transform = 'translateX(-50%)';
            danmuContainer.appendChild(danmuElement);

            const removeTimer = setTimeout(() => {
                if (danmuElement.parentNode) {
                    danmuElement.remove();
                    activeDanmuElements.delete(danmuElement);
                }
            }, 3000);

            danmuElement.dataset.removeTimer = removeTimer.toString();
        } else if (position === 'bottom') {
            // 底部固定弹幕
            danmuElement.classList.add('fixed-danmu');
            danmuElement.style.bottom = '10%';
            danmuElement.style.left = '50%';
            danmuElement.style.transform = 'translateX(-50%)';
            danmuContainer.appendChild(danmuElement);

            const removeTimer = setTimeout(() => {
                if (danmuElement.parentNode) {
                    danmuElement.remove();
                    activeDanmuElements.delete(danmuElement);
                }
            }, 3000);

            danmuElement.dataset.removeTimer = removeTimer.toString();
        }
    }

    // 创建上传按钮
    function createUploadButton() {
        const button = document.createElement('button');
        button.innerHTML = '🎬 上传视频+弹幕';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.background = '#0056b3';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#007bff';
            button.style.transform = 'scale(1)';
        });

        return button;
    }

    // 创建文件输入框
    function createFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.style.display = 'none';
        return fileInput;
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' :
              type === 'error' ? 'background: #dc3545;' : 'background: #17a2b8;'}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // 处理视频上传
    async function handleVideoUpload(file) {
        const videoSn = getVideoSn();
        if (!videoSn) {
            showNotification('无法获取视频SN，请确保在正确的页面', 'error');
            return;
        }

        showNotification('正在获取弹幕数据...', 'info');

        const success = await fetchDanmu(videoSn);
        if (!success) {
            showNotification('获取弹幕失败', 'error');
            return;
        }

        // 创建播放器（如果还没有）
        if (!customPlayer) {
            customPlayer = createCustomPlayer();
        }

        // 加载视频
        const fileURL = URL.createObjectURL(file);
        customPlayer.video.src = fileURL;

        // 显示播放器
        customPlayer.container.style.display = 'flex';

        showNotification(`视频加载成功，共 ${danmuData.length} 条弹幕`, 'success');
    }

    // 初始化脚本
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 创建按钮和文件输入框
        const uploadButton = createUploadButton();
        const fileInput = createFileInput();

        document.body.appendChild(uploadButton);
        document.body.appendChild(fileInput);

        // 事件监听
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith('video/')) {
                showNotification('请选择视频文件！', 'error');
                return;
            }

            handleVideoUpload(file);
            fileInput.value = '';
        });

        // ESC键退出全屏由浏览器自动处理，不需要手动监听

        console.log('动画疯弹幕播放器已加载');
    }

    // 启动脚本
    init();
})();
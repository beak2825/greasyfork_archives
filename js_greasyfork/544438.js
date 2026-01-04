// ==UserScript==
// @name         YUC.Wiki 番剧标记助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  标记番剧为已阅或删除状态，支持显示/隐藏标记番剧,一键复制动画名称
// @author       uylrcia
// @match        https://yuc.wiki/*
// @exclude      https://yuc.wiki/new
// @exclude      https://yuc.wiki/new/
// @icon         https://yuc.wiki/images/32x32.png
// @license      MIT license
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/544438/YUCWiki%20%E7%95%AA%E5%89%A7%E6%A0%87%E8%AE%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544438/YUCWiki%20%E7%95%AA%E5%89%A7%E6%A0%87%E8%AE%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 配置存储键名
    const STORAGE_KEY = 'YUC_ANIME_TRACKER_STATE';
    const SETTINGS_KEY = 'YUC_TRACKER_SETTINGS';
    const DETAILS_STATE_KEY = 'YUC_DETAILS_STATE';
    const SEASON_STATE_KEY = 'YUC_SEASON_STATE';

    // PASS状态基础滤镜
    const BASE_PASS_FILTER = 'sepia(100%) hue-rotate(-50deg) saturate(500%) brightness(0.7)';

    // 默认设置
    const defaultSettings = {
        readOpacity: 0.5,
        buttonOpacity: 1.0,
        showRead: true,
        showPass: true,
        panelOpen: false,
        effectsEnabled: true,
        passOpacity: 0.3,
        hoverPanelOpen: false,
        keepPanelOpen: false,
        seasonOpacity: 0.6, // 新增月份标记透明度设置
        showIntro: true // [新增] 默认开启新番介绍
    };

    // 加载设置
    function loadSettings() {
        const saved = GM_getValue(SETTINGS_KEY, JSON.stringify(defaultSettings));
        return {...defaultSettings, ...JSON.parse(saved)};
    }

    // 保存设置
    function saveSettings(settings) {
        GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    // 加载动画状态
    function loadAnimeState() {
        const saved = GM_getValue(STORAGE_KEY, '{}');
        return JSON.parse(saved);
    }

    // 保存动画状态
    function saveAnimeState(state) {
        GM_setValue(STORAGE_KEY, JSON.stringify(state));
    }

    // 加载月份状态
    function loadSeasonState() {
        const saved = GM_getValue(SEASON_STATE_KEY, '{}');
        return JSON.parse(saved);
    }

    // 保存月份状态
    function saveSeasonState(state) {
        GM_setValue(SEASON_STATE_KEY, JSON.stringify(state));
    }

    // 加载详情展开状态
    function loadDetailsState() {
        const saved = GM_getValue(DETAILS_STATE_KEY, '{}');
        return JSON.parse(saved);
    }

    // 保存详情展开状态
    function saveDetailsState(state) {
        GM_setValue(DETAILS_STATE_KEY, JSON.stringify(state));
    }

    // 统计当前页面状态数量
    function countStates() {
        let readCount = 0;
        let passCount = 0;

        document.querySelectorAll('.anime-item').forEach(item => {
            const title = item.querySelector('.anime-title').textContent;
            const state = animeState[title];
            if (state === 'read') readCount++;
            else if (state === 'pass') passCount++;
        });

        return { readCount, passCount };
    }

    // 更新设置面板中的数量显示
    function updateCountDisplay() {
        const counts = countStates();

        if (readCounter) {
            readCounter.textContent = `(${counts.readCount})`;
        }
        if (passCounter) {
            passCounter.textContent = `(${counts.passCount})`;
        }
    }

    // 创建控制面板
    function createControlPanel() {
        let panel = document.getElementById('anime-tracker-control');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'anime-tracker-control';
            panel.style.cssText = `
            position: fixed;
            bottom: 118px;
            right: 20px;
            background: rgba(255, 255, 255, 0.85);
            padding: 18px;
            border-radius: 20px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: 'Microsoft YaHei', sans-serif;
            max-width: 300px;
            border: 1px solid #ddd;
            transition: transform 0.3s ease;
            transform: translateY(${settings.hoverPanelOpen ? '0' : '20px'});
        `;

            // 标题栏
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '8px';
            const title = document.createElement('h3');
            title.textContent = 'YUC.WIKI 番剧标记助手';
            title.style.margin = '0';
            title.style.fontSize = '16px';
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 0;
            line-height: 1;
        `;
            closeBtn.addEventListener('click', () => {
                settings.panelOpen = false;
                settings.hoverPanelOpen = false;
                saveSettings(settings);
                panel.style.display = 'none';
                toggleFloatingBall(true);
            });
            header.appendChild(title);
            header.appendChild(closeBtn);
            panel.appendChild(header);

            // 已阅透明度控制
            const opacityRow = document.createElement('div');
            opacityRow.style.display = 'flex';
            opacityRow.style.alignItems = 'center';
            opacityRow.style.marginBottom = '12px';
            const opacityLabel = document.createElement('label');
            opacityLabel.textContent = '已阅(状态)透明度:';
            opacityLabel.style.marginRight = '8px';
            opacityLabel.style.flex = '0 0 auto';
            opacityLabel.style.fontSize = '14px';
            const opacitySlider = document.createElement('input');
            opacitySlider.type = 'range';
            opacitySlider.min = '0.1';
            opacitySlider.max = '1.0';
            opacitySlider.step = '0.05';
            opacitySlider.value = settings.readOpacity;
            opacitySlider.style.flex = '1';
            opacitySlider.style.height = '16px';
            const opacityValue = document.createElement('div');
            opacityValue.textContent = Math.round(settings.readOpacity * 100) + '%';
            opacityValue.style.flex = '0 0 40px';
            opacityValue.style.textAlign = 'right';
            opacityValue.style.paddingLeft = '8px';
            opacityValue.style.fontSize = '14px';
            opacitySlider.addEventListener('input', () => {
                settings.readOpacity = parseFloat(opacitySlider.value);
                opacityValue.textContent = Math.round(settings.readOpacity * 100) + '%';
                applyStates();
                updateCountDisplay();
            });
            opacityRow.appendChild(opacityLabel);
            opacityRow.appendChild(opacitySlider);
            opacityRow.appendChild(opacityValue);
            panel.appendChild(opacityRow);

            // 删除透明度控制
            const passOpacityRow = document.createElement('div');
            passOpacityRow.style.display = 'flex';
            passOpacityRow.style.alignItems = 'center';
            passOpacityRow.style.marginBottom = '12px';
            const passOpacityLabel = document.createElement('label');
            passOpacityLabel.textContent = '删除(状态)透明度:';
            passOpacityLabel.style.marginRight = '8px';
            passOpacityLabel.style.flex = '0 0 auto';
            passOpacityLabel.style.fontSize = '14px';
            const passOpacitySlider = document.createElement('input');
            passOpacitySlider.type = 'range';
            passOpacitySlider.min = '0';
            passOpacitySlider.max = '1';
            passOpacitySlider.step = '0.05';
            passOpacitySlider.value = settings.passOpacity;
            passOpacitySlider.style.flex = '1';
            passOpacitySlider.style.height = '16px';
            const passOpacityValue = document.createElement('div');
            passOpacityValue.textContent = Math.round(settings.passOpacity * 100) + '%';
            passOpacityValue.style.flex = '0 0 40px';
            passOpacityValue.style.textAlign = 'right';
            passOpacityValue.style.paddingLeft = '8px';
            passOpacityValue.style.fontSize = '14px';
            passOpacitySlider.addEventListener('input', () => {
                settings.passOpacity = parseFloat(passOpacitySlider.value);
                passOpacityValue.textContent = Math.round(settings.passOpacity * 100) + '%';
                applyStates();
                updateCountDisplay();
            });
            passOpacityRow.appendChild(passOpacityLabel);
            passOpacityRow.appendChild(passOpacitySlider);
            passOpacityRow.appendChild(passOpacityValue);
            panel.appendChild(passOpacityRow);


            // 月份标记透明度控制
            const seasonOpacityRow = document.createElement('div');
            seasonOpacityRow.style.display = 'flex';
            seasonOpacityRow.style.alignItems = 'center';
            seasonOpacityRow.style.marginBottom = '12px';
            const seasonOpacityLabel = document.createElement('label');
            seasonOpacityLabel.textContent = '季度(状态)透明度:';
            seasonOpacityLabel.style.marginRight = '8px';
            seasonOpacityLabel.style.flex = '0 0 auto';
            seasonOpacityLabel.style.fontSize = '14px';
            const seasonOpacitySlider = document.createElement('input');
            seasonOpacitySlider.type = 'range';
            seasonOpacitySlider.min = '0.1';
            seasonOpacitySlider.max = '1.0';
            seasonOpacitySlider.step = '0.05';
            seasonOpacitySlider.value = settings.seasonOpacity;
            seasonOpacitySlider.style.flex = '1';
            seasonOpacitySlider.style.height = '16px';
            const seasonOpacityValue = document.createElement('div');
            seasonOpacityValue.textContent = Math.round(settings.seasonOpacity * 100) + '%';
            seasonOpacityValue.style.flex = '0 0 40px';
            seasonOpacityValue.style.textAlign = 'right';
            seasonOpacityValue.style.paddingLeft = '8px';
            seasonOpacityValue.style.fontSize = '14px';
            seasonOpacitySlider.addEventListener('input', () => {
                settings.seasonOpacity = parseFloat(seasonOpacitySlider.value);
                seasonOpacityValue.textContent = Math.round(settings.seasonOpacity * 100) + '%';
                applySeasonStates();
            });
            seasonOpacityRow.appendChild(seasonOpacityLabel);
            seasonOpacityRow.appendChild(seasonOpacitySlider);
            seasonOpacityRow.appendChild(seasonOpacityValue);
            panel.appendChild(seasonOpacityRow);


            // 按钮可视度控制
            const buttonOpacityRow = document.createElement('div');
            buttonOpacityRow.style.display = 'flex';
            buttonOpacityRow.style.alignItems = 'center';
            buttonOpacityRow.style.marginBottom = '12px';
            const buttonOpacityLabel = document.createElement('label');
            buttonOpacityLabel.textContent = '按钮透明度:';
            buttonOpacityLabel.style.marginRight = '45px';
            buttonOpacityLabel.style.flex = '0 0 auto';
            buttonOpacityLabel.style.fontSize = '14px';
            const buttonOpacitySlider = document.createElement('input');
            buttonOpacitySlider.type = 'range';
            buttonOpacitySlider.min = '0.0';
            buttonOpacitySlider.max = '1.0';
            buttonOpacitySlider.step = '0.05';
            buttonOpacitySlider.value = settings.buttonOpacity;
            buttonOpacitySlider.style.flex = '1';
            buttonOpacitySlider.style.height = '16px';
            const buttonOpacityValue = document.createElement('div');
            buttonOpacityValue.textContent = Math.round(settings.buttonOpacity * 100) + '%';
            buttonOpacityValue.style.flex = '0 0 40px';
            buttonOpacityValue.style.textAlign = 'right';
            buttonOpacityValue.style.paddingLeft = '8px';
            buttonOpacityValue.style.fontSize = '14px';
            buttonOpacitySlider.addEventListener('input', () => {
                settings.buttonOpacity = parseFloat(buttonOpacitySlider.value);
                buttonOpacityValue.textContent = Math.round(settings.buttonOpacity * 100) + '%';
                applyButtonOpacity();
            });
            buttonOpacityRow.appendChild(buttonOpacityLabel);
            buttonOpacityRow.appendChild(buttonOpacitySlider);
            buttonOpacityRow.appendChild(buttonOpacityValue);
            panel.appendChild(buttonOpacityRow);

            // 显示已阅和显示删除放在同一行
            const showReadPassRow = document.createElement('div');
            showReadPassRow.style.display = 'flex';
            showReadPassRow.style.justifyContent = 'space-between';
            showReadPassRow.style.marginBottom = '12px';

            // 显示已阅开关
            const showReadContainer = document.createElement('div');
            showReadContainer.style.display = 'flex';
            showReadContainer.style.alignItems = 'center';
            showReadContainer.style.flex = '1';
            showReadContainer.style.marginRight = '10px';
            const showReadLabel = document.createElement('label');
            showReadLabel.textContent = '显示已阅:';
            showReadLabel.style.marginRight = '8px';
            showReadLabel.style.flex = '0 0 auto';
            showReadLabel.style.fontSize = '14px';
            const showReadToggle = document.createElement('div');
            showReadToggle.className = 'toggle-switch';
            showReadToggle.style.cssText = `
            width: 40px;
            height: 20px;
            background-color: ${settings.showRead ? '#4CAF50' : '#cccccc'};
            border-radius: 10px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
            const showReadSlider = document.createElement('div');
            showReadSlider.style.cssText = `
            position: absolute;
            top: 2px;
            left: ${settings.showRead ? '22px' : '2px'};
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: left 0.3s;
        `;
            showReadToggle.appendChild(showReadSlider);
            showReadToggle.addEventListener('click', () => {
                settings.showRead = !settings.showRead;
                showReadToggle.style.backgroundColor = settings.showRead ? '#4CAF50' : '#cccccc';
                showReadSlider.style.left = settings.showRead ? '22px' : '2px';
                saveSettings(settings);
                applyStates();
                updateCountDisplay();
            });
            showReadContainer.appendChild(showReadLabel);
            showReadContainer.appendChild(showReadToggle);

            // 数量计数器
            readCounter = document.createElement('span');
            readCounter.className = 'counter';
            readCounter.textContent = '(0)';
            readCounter.style.marginLeft = '8px';
            readCounter.style.fontSize = '14px';
            showReadContainer.appendChild(readCounter);

            // 显示删除开关
            const showPassContainer = document.createElement('div');
            showPassContainer.style.display = 'flex';
            showPassContainer.style.alignItems = 'center';
            showPassContainer.style.flex = '1';
            const showPassLabel = document.createElement('label');
            showPassLabel.textContent = '显示删除:';
            showPassLabel.style.marginRight = '8px';
            showPassLabel.style.flex = '0 0 auto';
            showPassLabel.style.fontSize = '14px';
            const showPassToggle = document.createElement('div');
            showPassToggle.className = 'toggle-switch';
            showPassToggle.style.cssText = `
            width: 40px;
            height: 20px;
            background-color: ${settings.showPass ? '#4CAF50' : '#cccccc'};
            border-radius: 10px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
            const showPassSlider = document.createElement('div');
            showPassSlider.style.cssText = `
            position: absolute;
            top: 2px;
            left: ${settings.showPass ? '22px' : '2px'};
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: left 0.3s;
        `;
            showPassToggle.appendChild(showPassSlider);
            showPassToggle.addEventListener('click', () => {
                settings.showPass = !settings.showPass;
                showPassToggle.style.backgroundColor = settings.showPass ? '#4CAF50' : '#cccccc';
                showPassSlider.style.left = settings.showPass ? '22px' : '2px';
                saveSettings(settings);
                applyStates();
                updateCountDisplay();
            });
            showPassContainer.appendChild(showPassLabel);
            showPassContainer.appendChild(showPassToggle);

            // 数量计数器
            passCounter = document.createElement('span');
            passCounter.className = 'counter';
            passCounter.textContent = '(0)';
            passCounter.style.marginLeft = '8px';
            passCounter.style.fontSize = '14px';
            showPassContainer.appendChild(passCounter);

            showReadPassRow.appendChild(showReadContainer);
            showReadPassRow.appendChild(showPassContainer);
            panel.appendChild(showReadPassRow);


            // --- 新番介绍开关 ---
            const introRow = document.createElement('div');
            introRow.style.display = 'flex';
            introRow.style.justifyContent = 'space-between';
            introRow.style.marginBottom = '12px';

            const introContainer = document.createElement('div');
            introContainer.style.display = 'flex';
            introContainer.style.alignItems = 'center';
            introContainer.style.flex = '1';

            const introLabel = document.createElement('label');
            introLabel.textContent = '新番介绍:'; // 开关名称
            introLabel.style.marginRight = '8px';
            introLabel.style.flex = '0 0 auto';
            introLabel.style.fontSize = '14px';

            const introToggle = document.createElement('div');
            introToggle.className = 'toggle-switch';
            introToggle.style.cssText = `
                width: 40px;
                height: 20px;
                background-color: ${settings.showIntro ? '#4CAF50' : '#cccccc'};
                border-radius: 10px;
                position: relative;
                cursor: pointer;
                transition: background-color 0.3s;
            `;

            const introSlider = document.createElement('div');
            introSlider.style.cssText = `
                position: absolute;
                top: 2px;
                left: ${settings.showIntro ? '22px' : '2px'};
                width: 16px;
                height: 16px;
                background-color: white;
                border-radius: 50%;
                transition: left 0.3s;
            `;

            introToggle.appendChild(introSlider);
            introToggle.addEventListener('click', () => {
                settings.showIntro = !settings.showIntro;
                // 更新UI状态
                introToggle.style.backgroundColor = settings.showIntro ? '#4CAF50' : '#cccccc';
                introSlider.style.left = settings.showIntro ? '22px' : '2px';
                // 保存并应用
                saveSettings(settings);
                applyIntroVisibility();
            });

            introContainer.appendChild(introLabel);
            introContainer.appendChild(introToggle);
            introRow.appendChild(introContainer);
            panel.appendChild(introRow);

            // 全局效果和保持菜单放在同一行
            const effectsKeepRow = document.createElement('div');
            effectsKeepRow.style.display = 'flex';
            effectsKeepRow.style.justifyContent = 'space-between';
            effectsKeepRow.style.marginBottom = '12px';

            // 全局效果开关
            const effectsContainer = document.createElement('div');
            effectsContainer.style.display = 'flex';
            effectsContainer.style.alignItems = 'center';
            effectsContainer.style.flex = '1';
            effectsContainer.style.marginRight = '10px';
            const effectsLabel = document.createElement('label');
            effectsLabel.textContent = '全局效果:';
            effectsLabel.style.marginRight = '8px';
            effectsLabel.style.flex = '0 0 auto';
            effectsLabel.style.fontSize = '14px';
            const effectsToggle = document.createElement('div');
            effectsToggle.className = 'toggle-switch';
            effectsToggle.style.cssText = `
            width: 40px;
            height: 20px;
            background-color: ${settings.effectsEnabled ? '#4CAF50' : '#cccccc'};
            border-radius: 10px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
            const toggleSlider = document.createElement('div');
            toggleSlider.style.cssText = `
            position: absolute;
            top: 2px;
            left: ${settings.effectsEnabled ? '22px' : '2px'};
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: left 0.3s;
        `;
            effectsToggle.appendChild(toggleSlider);
            effectsToggle.addEventListener('click', () => {
                settings.effectsEnabled = !settings.effectsEnabled;
                effectsToggle.style.backgroundColor = settings.effectsEnabled ? '#4CAF50' : '#cccccc';
                toggleSlider.style.left = settings.effectsEnabled ? '22px' : '2px';
                saveSettings(settings);
                applyStates();
            });
            effectsContainer.appendChild(effectsLabel);
            effectsContainer.appendChild(effectsToggle);

            // 保持菜单打开开关
            const keepOpenContainer = document.createElement('div');
            keepOpenContainer.style.display = 'flex';
            keepOpenContainer.style.alignItems = 'center';
            keepOpenContainer.style.flex = '1';
            const keepOpenLabel = document.createElement('label');
            keepOpenLabel.textContent = '保持菜单:';
            keepOpenLabel.style.marginRight = '8px';
            keepOpenLabel.style.flex = '0 0 auto';
            keepOpenLabel.style.fontSize = '14px';
            const keepOpenToggle = document.createElement('div');
            keepOpenToggle.className = 'toggle-switch';
            keepOpenToggle.style.cssText = `
            width: 40px;
            height: 20px;
            background-color: ${settings.keepPanelOpen ? '#4CAF50' : '#cccccc'};
            border-radius: 10px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.3s;
        `;
            const keepOpenSlider = document.createElement('div');
            keepOpenSlider.style.cssText = `
            position: absolute;
            top: 2px;
            left: ${settings.keepPanelOpen ? '22px' : '2px'};
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: left 0.3s;
        `;
            keepOpenToggle.appendChild(keepOpenSlider);
            keepOpenToggle.addEventListener('click', () => {
                settings.keepPanelOpen = !settings.keepPanelOpen;
                keepOpenToggle.style.backgroundColor = settings.keepPanelOpen ? '#4CAF50' : '#cccccc';
                keepOpenSlider.style.left = settings.keepPanelOpen ? '22px' : '2px';
                saveSettings(settings);
            });
            keepOpenContainer.appendChild(keepOpenLabel);
            keepOpenContainer.appendChild(keepOpenToggle);

            effectsKeepRow.appendChild(effectsContainer);
            effectsKeepRow.appendChild(keepOpenContainer);
            panel.appendChild(effectsKeepRow);

            // 重置按钮容器
            const resetButtonsContainer = document.createElement('div');
            resetButtonsContainer.style.cssText = `
            display: flex;
            gap: 20px;
            margin-top: 12px;
        `;

            // 仅重置当前页面标记按钮
            const resetCurrentBtn = document.createElement('button');
            resetCurrentBtn.textContent = '重置当前页标记';
            resetCurrentBtn.style.cssText = `
            flex: 1;
            padding: 6px;
            background-color: #ff9800;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        `;
            resetCurrentBtn.addEventListener('click', () => {
                if (confirm('确定要重置当前页面的番剧标记吗？')) {
                    // 获取当前页面所有标题
                    const currentPageTitles = [];
                    document.querySelectorAll('.anime-item').forEach(item => {
                        const title = item.querySelector('.anime-title').textContent;
                        currentPageTitles.push(title);
                    });

                    // 从状态中移除当前页面的标记
                    const newState = {...animeState};
                    currentPageTitles.forEach(title => {
                        delete newState[title];
                    });

                    // 保存新状态并刷新
                    saveAnimeState(newState);
                    location.reload();
                }
            });
            resetButtonsContainer.appendChild(resetCurrentBtn);

            // 重置所有标记按钮
            const resetAllBtn = document.createElement('button');
            resetAllBtn.textContent = '重置所有标记';
            resetAllBtn.style.cssText = `
            flex: 1;
            padding: 6px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        `;
            resetAllBtn.addEventListener('click', () => {
                if (confirm('确定要重置所有番剧标记吗？')) {
                    GM_setValue(STORAGE_KEY, '{}');
                    GM_setValue(SEASON_STATE_KEY, '{}');
                    location.reload();
                }
            });
            resetButtonsContainer.appendChild(resetAllBtn);

            panel.appendChild(resetButtonsContainer);

            document.body.appendChild(panel);
        }

        panel.style.display = settings.panelOpen || settings.hoverPanelOpen ? 'block' : 'none';
        toggleFloatingBall(true);
        updateCountDisplay();
    }

    // 创建悬浮球
    function createFloatingBall() {
        let ball = document.getElementById('anime-tracker-ball');
        if (!ball) {
            ball = document.createElement('div');
            ball.id = 'anime-tracker-ball';
            ball.textContent = '⚙️';
            ball.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 24px;
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            z-index: 9998;
            transition: transform 0.3s ease;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            outline: none;
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
        `;
            ball.addEventListener('mouseenter', () => {
                settings.hoverPanelOpen = true;
                saveSettings(settings);
                createControlPanel();
            });
            ball.addEventListener('click', () => {
                settings.panelOpen = !settings.panelOpen;
                settings.hoverPanelOpen = false;
                saveSettings(settings);
                createControlPanel();
            });
            document.body.appendChild(ball);
        }
        ball.addEventListener('focus', () => {
            ball.blur();
        });
    }

    function toggleFloatingBall(show) {
        const ball = document.getElementById('anime-tracker-ball');
        if (ball) ball.style.display = show ? 'flex' : 'none';
    }

    // 应用按钮透明度
    function applyButtonOpacity() {
        saveSettings(settings);
        const shouldShow = settings.buttonOpacity > 0;
        document.querySelectorAll('.btn-container').forEach(container => {
            container.style.display = shouldShow ? 'flex' : 'none';
            container.style.opacity = settings.buttonOpacity;
            // 确保z-index保持最高
            container.style.zIndex = '9999';
            container.style.background = 'transparent !important';
        });
    }

    // 应用状态到动画条目
    function applyStates() {
        saveSettings(settings);

        // 应用每个番剧项的样式
        document.querySelectorAll('.anime-item').forEach(item => {
            const title = item.querySelector('.anime-title').textContent;
            const state = animeState[title] || 'none';

            // 重置样式
            const elementsToStyle = [
                '.div_date, .div_date_', 'table',
                '.date_title, .date_title_, .date_title1, .date_title2',
                '.copyright',
                '.div_sp', '.sp_title, .sp_title_',
                '.future_div' // [新增] 支持新番表新格式的图片容器
            ];

            elementsToStyle.forEach(sel => {
                const el = item.querySelector(sel);
                if (el) {
                    el.style.opacity = '';
                    el.style.filter = '';
                    // 确保不重置按钮容器的z-index
                }
            });
            item.style.display = '';

            // 应用效果（如果全局效果启用）
            if (settings.effectsEnabled) {
                if (state === 'read') {
                    if (settings.showRead) {
                        elementsToStyle.forEach(sel => {
                            const el = item.querySelector(sel);
                            if (el) {
                                el.style.opacity = settings.readOpacity;
                                el.style.filter = 'grayscale(100%)';
                            }
                        });
                    } else {
                        item.style.display = 'none';
                    }
                } else if (state === 'pass') {
                    if (settings.showPass) {
                        elementsToStyle.forEach(sel => {
                            const el = item.querySelector(sel);
                            if (el) {
                                el.style.filter = BASE_PASS_FILTER;
                                el.style.opacity = settings.passOpacity;
                            }
                        });
                    } else {
                        item.style.display = 'none';
                    }
                }
            }
        });

        // 应用按钮透明度
        applyButtonOpacity();

        // 应用月份状态
        applySeasonStates();

        // 应用复制按钮
        setupCopyButtons();
    }

    // [修改版] 应用新番介绍部分的显示/隐藏状态 (支持老页面自动识别 #A01 等锚点)
    function applyIntroVisibility() {
        let startNode = null;

        // 策略1: 优先尝试查找标准的 "新番介绍部分" 注释
        const xpathStandard = "//comment()[contains(., '新番介绍部分')]";
        const standardIterator = document.evaluate(xpathStandard, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        startNode = standardIterator.singleNodeValue;

        // 策略2: 如果没找到标准头，则查找第一个符合 #A01, #B02 格式的锚点注释
        if (!startNode) {
            // 查找所有以 # 开头的注释
            const xpathAnchor = "//comment()[starts-with(., '#')]";
            const anchorSnapshot = document.evaluate(xpathAnchor, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

            for (let i = 0; i < anchorSnapshot.snapshotLength; i++) {
                const node = anchorSnapshot.snapshotItem(i);
                // 正则验证：匹配 #A01 到 #Z99 的格式
                // ^# 匹配开头, [A-Z] 匹配一个大写字母, \d{2} 匹配两位数字
                if (/^#[A-Z]\d{2}$/.test(node.textContent.trim())) {
                    startNode = node;
                    break; // 找到第一个(通常是 #A01)就停止，以此为起点
                }
            }
        }

        // 如果连锚点都没找到，说明页面没有介绍部分，直接退出
        if (!startNode) return;

        // 从找到的起点开始，控制后续所有兄弟元素的显示
        let currentNode = startNode.nextSibling;
        const shouldShow = settings.showIntro;

        while (currentNode) {
            // [新增] 检查是否到达"动态漫与限制级"等后续部分的开头
            // 如果遇到了 <p class="future_intro_"> 或类似结构，说明"新番介绍"部分结束了，停止隐藏
            if (currentNode.nodeType === 1 && currentNode.classList.contains('future_intro_')) {
                break;
            }

            // 仅处理元素节点 (跳过纯文本换行)
            if (currentNode.nodeType === 1) {
                // 防止误伤：如果遇到 "post-copyright" (作者版权信息)，通常建议停止隐藏，
                // 但如果你想连版权信息也一起隐藏，可以去掉下面这个 if 判断。
                if (currentNode.classList.contains('post-copyright') || currentNode.tagName === 'FOOTER') {
                    // 遇到版权区是否停止？目前逻辑是不停止，一并隐藏，符合"关闭介绍"的彻底性。
                    // 如果想保留版权区，请取消下一行的注释:
                    // break;
                }

                currentNode.style.display = shouldShow ? '' : 'none';
            }
            currentNode = currentNode.nextSibling;
        }
    }


    // 应用月份状态
    function applySeasonStates() {
        document.querySelectorAll('.season-item').forEach(item => {
            const link = item.querySelector('a').href;
            const state = seasonState[link] || 'none';

            if (state === 'read') {
                item.style.opacity = settings.seasonOpacity;
                item.style.filter = 'grayscale(100%)';
            } else {
                item.style.opacity = '';
                item.style.filter = '';
            }
        });
    }


    // 获取动画标题文本
    function getAnimeTitle(item) {
        // 尝试多种选择器以适应不同页面
        const titleSelectors = [
            '.date_title', '.date_title_', '.date_title1', '.date_title2',
            '.sp_title', '.sp_title_', '.date_title2',
            '.future_title_' // [新增] 支持动态漫/限制级部分标题
        ];

        for (const selector of titleSelectors) {
            const titleEl = item.querySelector(selector);
            if (titleEl) {
                return titleEl.textContent.replace(/\n/g, ' ').trim();
            }
        }

        // 作为备选方案，尝试查找包含标题文本的元素
        const possibleElements = item.querySelectorAll('td[class*="title"], div[class*="title"]');
        for (const el of possibleElements) {
            if (el.textContent.trim().length > 1) {
                return el.textContent.replace(/\n/g, ' ').trim();
            }
        }
        return 'Unknown';
    }

    // 设置动画条目和标记按钮
    function setupAnimeItems() {
        // 尝试多种选择器以适应不同页面
        const animeItems = document.querySelectorAll('div[style*="float:left"]:not(.anime-item)');
        if (animeItems.length) {
            animeItems.forEach(item => {
                const title = getAnimeTitle(item);
                if (title === 'Unknown') {
                    return;
                }

                item.classList.add('anime-item');
                const titleSpan = document.createElement('span');
                titleSpan.className = 'anime-title';
                titleSpan.textContent = title;
                titleSpan.style.display = 'none';
                item.appendChild(titleSpan);

                // 检查是否已经添加过按钮
                if (item.querySelector('.btn-container')) return;

                const btnContainer = document.createElement('div');
                btnContainer.className = 'btn-container';
                btnContainer.style.cssText = `
                display: flex;
                justify-content: center;
                gap: 6px;
                margin-top: 4px;
                position: relative;
                z-index: 9999; /* 提高z-index确保在最顶层 */
                opacity: ${settings.buttonOpacity};
                background: transparent !important; /* 确保背景透明 */
                pointer-events: auto !important; /* 确保可交互 */
            `;

                const readBtn = document.createElement('button');
                readBtn.textContent = '已阅';
                readBtn.style.cssText = `
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px solid #4CAF50;
                background-color: rgba(76,175,80,0.2);
                color: #4CAF50;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s;
                min-width: 50px;
                position: relative;
                z-index: 9999; /* 按钮本身更高的z-index */
            `;

                const passBtn = document.createElement('button');
                passBtn.textContent = '删除';
                passBtn.style.cssText = `
                padding: 2px 6px;
                border-radius: 5px;
                border: 1px solid #f44336;
                background-color: rgba(244,67,54,0.2);
                color: #f44336;
                cursor: pointer;
                font-size: 13px;
                min-width: 50px;
                position: relative;
                z-index: 9999; /* 按钮本身更高的z-index */
            `;

                // 仅已阅按钮添加hover效果
                readBtn.addEventListener('mouseover', () => {
                    readBtn.style.backgroundColor = 'rgba(76,175,80,0.4)';
                });
                readBtn.addEventListener('mouseout', () => {
                    readBtn.style.backgroundColor = 'rgba(76,175,80,0.2)';
                });

                readBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    e.preventDefault();
                    animeState[title] = animeState[title] === 'read' ? 'none' : 'read';
                    applyStates();
                    saveAnimeState(animeState);
                    updateCountDisplay();
                });

                passBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    e.preventDefault();
                    animeState[title] = animeState[title] === 'pass' ? 'none' : 'pass';
                    applyStates();
                    saveAnimeState(animeState);
                    updateCountDisplay();
                });

                btnContainer.appendChild(readBtn);
                btnContainer.appendChild(passBtn);

                // [修改] 尝试多种插入位置以适应不同页面
                const futureDiv = item.querySelector('.future_div');

                if (futureDiv) {
                    // [新增] 针对动态漫/限制级新布局的处理
                    // 找到标题行
                    const titleRow = item.querySelector('.future_tr');

                    if (titleRow) {
                        // 找到标题行所在的表格
                        const futureTable = item.querySelector('.future_table');

                        if (futureTable) {
                            // 创建一个新的行来放置按钮容器
                            const buttonRow = document.createElement('tr');
                            const buttonCell = document.createElement('td');
                            buttonCell.style.cssText = `
                            text-align: center;
                            padding: 4px 0;
                        `;
                            buttonCell.setAttribute('colspan', '1'); // 根据实际列数调整

                            // 调整按钮容器样式
                            btnContainer.style.cssText = `
                            display: flex;
                            justify-content: center;
                            gap: 6px;
                            margin: 0;
                            position: relative;
                            z-index: 9999;
                            opacity: ${settings.buttonOpacity};
                            background: transparent !important;
                            pointer-events: auto !important;
                        `;

                            buttonCell.appendChild(btnContainer);
                            buttonRow.appendChild(buttonCell);

                            // 将按钮行插入到标题行之后
                            if (titleRow.parentNode) {
                                titleRow.parentNode.insertBefore(buttonRow, titleRow.nextSibling);
                            }
                        } else {
                            // 如果找不到表格，则将按钮容器插入到标题行之后（同级的div）
                            titleRow.parentNode.insertBefore(btnContainer, titleRow.nextSibling);
                        }
                    } else {
                        // 如果找不到标题行，则使用原来的方式
                        futureDiv.style.position = 'relative';
                        btnContainer.style.position = 'absolute';
                        btnContainer.style.bottom = '20px'; // 向上移动20px，避免被标题遮挡
                        btnContainer.style.left = '0';
                        btnContainer.style.width = '100%';
                        btnContainer.style.background = 'transparent !important'; // 透明背景
                        btnContainer.style.padding = '2px 0';
                        btnContainer.style.marginTop = '0';
                        btnContainer.style.zIndex = '9999';

                        // 调整按钮大小以适应小图片容器
                        readBtn.style.minWidth = '40px';
                        passBtn.style.minWidth = '40px';

                        futureDiv.appendChild(btnContainer);
                    }
                } else {
                    // 原有逻辑：插入到表格后或图片后
                    const table = item.querySelector('table');
                    if (table) {
                        table.parentNode.insertBefore(btnContainer, table.nextSibling);
                    } else {
                        const img = item.querySelector('.div_sp');
                        if (img) {
                            img.parentNode.insertBefore(btnContainer, img.nextSibling);
                        } else {
                            item.appendChild(btnContainer);
                        }
                    }
                }
            });
        }
        setupCopyButtons();
    }

    // 设置月份列表项
    function setupSeasonItems() {
        const seasonItems = document.querySelectorAll('.links-of-blogroll-item:not(.season-item)');
        if (!seasonItems.length) return;

        seasonItems.forEach(item => {
            item.classList.add('season-item');
            const link = item.querySelector('a').href;
            if (link.includes('/new') || link.includes('/sp') || link.includes('/movie')) return;
            if (item.querySelector('.season-btn-container')) return;

            // 创建按钮容器（修改样式部分）
            const btnContainer = document.createElement('div');
            btnContainer.className = 'season-btn-container';
            btnContainer.style.cssText = `
            display: inline-flex !important;
            margin-left: 2px;
            gap: 2px;
            opacity: 0; /* 初始状态完全透明 */
            transition: opacity 0.2s ease;
            pointer-events: none; /* 初始状态不可交互 */
        `;

            // 创建按钮
            const readBtn = document.createElement('button');
            readBtn.textContent = '已阅';
            readBtn.style.cssText = `
            padding: 1px 4px;
            border-radius: 3px;
            border: 1px solid #4CAF50;
            background-color: rgba(76,175,80,0.2);
            color: #4CAF50;
            cursor: pointer;
            font-size: 12px;
            min-width: 38px;
            line-height: 1.2;
            transform: scale(0.9);
            transition: all 0.2s;
        `;

            // 修改悬浮逻辑 - 使用JavaScript控制透明度
            item.addEventListener('mouseenter', () => {
                btnContainer.style.opacity = settings.buttonOpacity || 0.8;
                btnContainer.style.pointerEvents = 'auto';
            });
            item.addEventListener('mouseleave', () => {
                btnContainer.style.opacity = 0;
                btnContainer.style.pointerEvents = 'none';
            });

            // 调整链接容器布局
            const linkContainer = item.querySelector('a').parentNode;
            linkContainer.style.cssText = `
            display: inline-flex;
            align-items: flex-end;

            gap: 3px;
        `;

            readBtn.addEventListener('mouseover', () => {
                readBtn.style.backgroundColor = 'rgba(76,175,80,0.4)';
            });
            readBtn.addEventListener('mouseout', () => {
                readBtn.style.backgroundColor = 'rgba(76,175,80,0.2)';
            });

            readBtn.addEventListener('click', e => {
                e.stopPropagation();
                seasonState[link] = seasonState[link] === 'read' ? 'none' : 'read';
                applySeasonStates();
                saveSeasonState(seasonState);
            });

            btnContainer.appendChild(readBtn);
            item.querySelector('a').insertAdjacentElement('afterend', btnContainer);
        });
    }

    // 设置复制按钮（在文字区域内）
    function setupCopyButtons() {
        const animeItems = document.querySelectorAll('.anime-item');
        if (!animeItems.length) return;

        animeItems.forEach(item => {
            const title = item.querySelector('.anime-title').textContent;

            // 尝试多种选择器以适应不同页面
            const titleSelectors = [
                '.date_title', '.date_title_', '.date_title1, .date_title2',
                '.sp_title', '.sp_title_', '.movie_title',
                '.future_title_' // [新增]
            ];

            let titleEl = null;
            for (const selector of titleSelectors) {
                titleEl = item.querySelector(selector);
                if (titleEl) break;
            }

            if (!titleEl) {
                // 作为备选方案，尝试查找包含标题文本的元素
                const possibleElements = item.querySelectorAll('td[class*="title"], div[class*="title"]');
                for (const el of possibleElements) {
                    if (el.textContent.trim().length > 1) {
                        titleEl = el;
                        break;
                    }
                }
            }

            // 移除已有的复制按钮
            const existingCopyBtn = item.querySelector('.copy-btn');
            if (existingCopyBtn) existingCopyBtn.remove();

            // 创建复制按钮放在标题元素内
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = '复制';
            copyBtn.title = '复制标题';
            copyBtn.style.cssText = `
                position: absolute;
                top: 2px;
                right: 4px;
                padding: 2px 6px;
                font-size: 11px;
                background: rgba(0,0,0,0.6);
                color: #fff;
                border: none;
                border-radius: 3px;
                opacity: 0;
                cursor: pointer;
                transition: opacity 0.2s;
                z-index: 9999; /* 最高层级 */
                pointer-events: auto;
                filter: none !important; /* 确保不受父元素滤镜影响 */
            `;

            // 确保标题元素有相对定位
            // 如果标题元素本来是 display: table-cell, relative 可能会表现稍有不同，但通常没问题
            // 对于 .future_title_ 它是 td, 设置relative通常有效
            titleEl.style.position = 'relative';
            titleEl.appendChild(copyBtn);

            // 悬浮显示/隐藏
            titleEl.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
            });
            titleEl.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0';
            });

            copyBtn.addEventListener('click', e => {
                e.stopPropagation();
                navigator.clipboard.writeText(title).then(() => {
                    const old = copyBtn.textContent;
                    copyBtn.textContent = '已复制!';
                    copyBtn.style.background = '#4CAF50';
                    setTimeout(() => {
                        copyBtn.textContent = old;
                        copyBtn.style.background = 'rgba(0,0,0,0.6)';
                    }, 1000);
                });
            });
        });
    }

    // 设置详情折叠状态保存
    function setupDetails() {
        const detailsEls = document.querySelectorAll('details');
        const detailsState = loadDetailsState();
        detailsEls.forEach((d, i) => {
            const key = `details_${i}`;
            if (detailsState[key] !== undefined) d.open = detailsState[key];
            d.addEventListener('toggle', () => {
                detailsState[key] = d.open;
                saveDetailsState(detailsState);
            });
        });
    }

    // 点击空白处关闭设置面板
    function setupPanelCloseOnOutsideClick() {
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('anime-tracker-control');
            const ball = document.getElementById('anime-tracker-ball');

            if (!panel || panel.style.display !== 'block') return;

            const isPanelClick = panel.contains(e.target);
            const isBallClick = ball && ball.contains(e.target);

            if (settings.keepPanelOpen) return;

            if (!isPanelClick && !isBallClick) {
                settings.hoverPanelOpen = false;
                settings.panelOpen = false;
                saveSettings(settings);
                panel.style.display = 'none';
                toggleFloatingBall(true);
            }
        });
    }

    // 初始化
    const settings = loadSettings();
    const animeState = loadAnimeState();
    const seasonState = loadSeasonState();
    let readCounter = null;
    let passCounter = null;

    function addNavSettingButton() {
        const nav = document.querySelector('#nav');
        if (nav) {
            const btn = document.createElement('a');
            btn.textContent = '标记设置';
            btn.href = '#';
            btn.style.marginLeft = '15px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '14px';
            btn.addEventListener('click', e => {
                e.preventDefault();
                settings.panelOpen = true;
                settings.hoverPanelOpen = false;
                saveSettings(settings);
                createControlPanel();
            });
            nav.appendChild(btn);
        }
    }

    function init() {
        setupSeasonItems();
        addNavSettingButton();
        setupAnimeItems();
        applyStates();
        applyIntroVisibility(); // [新增] 初始化时应用介绍部分的显示状态
        setupDetails();
        createControlPanel();
        createFloatingBall();
        toggleFloatingBall(true);
        setupPanelCloseOnOutsideClick();
    }

    window.addEventListener('load', init);
    if (document.readyState === 'complete') {
        setTimeout(init, 500);
    }

})();
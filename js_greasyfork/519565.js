// ==UserScript==
// @name         Bilibili时间标记跳转
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在B站视频播放时标记时间点并能快速跳转
// @author       洪小帅
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519565/Bilibili%E6%97%B6%E9%97%B4%E6%A0%87%E8%AE%B0%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/519565/Bilibili%E6%97%B6%E9%97%B4%E6%A0%87%E8%AE%B0%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let markedTimes = [];  // 存储标记的时间点
    let isInitialized = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // 默认设置
    const defaultSettings = {
        markHotkey: 'm',
        jumpHotkey: 'n',
        maxTimePoints: 15,
        panelPosition: { x: 50, y: 120 },
        clearOnRefresh: true
    };

    // 获取设置
    let settings = GM_getValue('biliTimeMarkerSettings', defaultSettings);

    // 创建控制面板
    const createControlPanel = () => {
        const panel = document.createElement('div');
        panel.className = 'bili-time-marker-panel';
        panel.style.cssText = `
            position: fixed;
            top: ${settings.panelPosition.y}px;
            right: ${settings.panelPosition.x}px;
            z-index: 999999;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 8px;
            padding: 12px;
            color: white;
            font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
            min-width: 200px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            user-select: none;
        `;

        // 添加拖动条
        const dragBar = document.createElement('div');
        dragBar.style.cssText = `
            padding: 4px;
            margin: -12px -12px 8px -12px;
            cursor: move;
            background-color: #00a1d6;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        const title = document.createElement('span');
        title.textContent = '403专用时间标记器';
        title.style.marginLeft = '8px';

        const settingsButton = document.createElement('button');
        settingsButton.innerHTML = '⚙️';
        settingsButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0 8px;
            font-size: 16px;
        `;
        settingsButton.onclick = () => {
            document.body.appendChild(createOverlay());
            showSettings();
        };

        dragBar.appendChild(title);
        dragBar.appendChild(settingsButton);

        // 添加拖动功能
        dragBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            panel.style.transition = 'none';
            document.addEventListener('mousemove', handleDrag);
            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.removeEventListener('mousemove', handleDrag);
                // 保存位置
                const rect = panel.getBoundingClientRect();
                settings.panelPosition = {
                    x: window.innerWidth - rect.right,
                    y: rect.top
                };
                GM_setValue('biliTimeMarkerSettings', settings);
            });
        });

        panel.appendChild(dragBar);

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        `;

        const markButton = createButton(`标记 [${settings.markHotkey}]`, '#00a1d6');
        const clearButton = createButton('清除标记', '#fb7299');

        markButton.onclick = addTimePoint;
        clearButton.onclick = () => {
            markedTimes = markedTimes.filter(t => t.pinned);
            updateTimesList();
            // 清除时立即保存到存储
            GM_setValue('biliTimeMarkerPoints', markedTimes);
        };

        buttonContainer.appendChild(markButton);
        buttonContainer.appendChild(clearButton);
        panel.appendChild(buttonContainer);

        // 创建时间点列表容器
        const timesList = document.createElement('div');
        timesList.className = 'bili-time-marker-list';
        timesList.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 6px;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 4px;
        `;

        // 添加滚动条样式
        GM_addStyle(`
            .bili-time-marker-list::-webkit-scrollbar {
                width: 4px;
            }
            .bili-time-marker-list::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
            }
            .bili-time-marker-list::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
            }
            .bili-time-marker-list::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
        `);

        panel.appendChild(timesList);

        return panel;
    };

    // 处理拖动
    const handleDrag = (e) => {
        if (!isDragging) return;
        const panel = document.querySelector('.bili-time-marker-panel');
        if (!panel) return;

        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // 确保面板不会拖出屏幕
        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;

        panel.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
        panel.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        panel.style.right = 'auto';
    };

    // 添加时间点
    const addTimePoint = () => {
        const video = document.querySelector('video');
        if (!video) return;

        const currentTime = video.currentTime;
        const timeString = formatTime(currentTime);

        markedTimes.unshift({
            time: currentTime,
            label: timeString,
            pinned: false
        });

        // 如果超出限制且有未固定的时间点，删除最早的未固定时间点
        if (markedTimes.length > settings.maxTimePoints) {
            const unpinnedIndex = markedTimes.findIndex(t => !t.pinned);
            if (unpinnedIndex !== -1) {
                markedTimes.splice(unpinnedIndex, 1);
            }
        }

        updateTimesList();
    };

    // 创建时间点按钮
    const createTimeButton = (timeData, index) => {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            padding: 6px;
            transition: background-color 0.2s;
        `;

        const button = document.createElement('button');
        button.style.cssText = `
            flex: 1;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 12px;
            text-align: left;
            padding: 0;
        `;
        button.textContent = `⏱ ${timeData.label}`;

        const pinButton = document.createElement('button');
        pinButton.innerHTML = timeData.pinned ? '📌' : '📍';
        pinButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0 4px;
            opacity: ${timeData.pinned ? 1 : 0.5};
        `;

        pinButton.onclick = (e) => {
            e.stopPropagation();
            timeData.pinned = !timeData.pinned;
            updateTimesList();
        };

        container.onmouseover = () => container.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        container.onmouseout = () => container.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        container.onclick = () => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = timeData.time;
            }
        };

        container.appendChild(button);
        container.appendChild(pinButton);
        return container;
    };

    // 显示设置面板
    const showSettings = () => {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'bili-time-marker-settings';
        settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 8px;
            z-index: 1000000;
            min-width: 300px;
            color: #333;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        settingsPanel.innerHTML = `
            <h3 style="margin-top: 0; color: #00a1d6;">设置</h3>
            <div style="margin-bottom: 12px;">
                <label>标记快捷键: <input type="text" id="markHotkey" value="${settings.markHotkey}" style="width: 50px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; color: #333;"></label>
            </div>
            <div style="margin-bottom: 12px;">
                <label>跳转快捷键: <input type="text" id="jumpHotkey" value="${settings.jumpHotkey}" style="width: 50px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; color: #333;"></label>
            </div>
            <div style="margin-bottom: 12px;">
                <label>最大时间点数量: <input type="number" id="maxTimePoints" value="${settings.maxTimePoints}" min="1" max="50" style="width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; color: #333;"></label>
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="clearOnRefresh" ${settings.clearOnRefresh ? 'checked' : ''} style="width: 16px; height: 16px;">
                    <span>刷新页面时清除标记点</span>
                </label>
            </div>
            <div style="text-align: right;">
                <button id="saveSettings" style="padding: 6px 12px; background: #00a1d6; border: none; border-radius: 4px; color: white; cursor: pointer;">保存</button>
            </div>
        `;

        document.body.appendChild(settingsPanel);

        document.getElementById('saveSettings').onclick = () => {
            settings.markHotkey = document.getElementById('markHotkey').value;
            settings.jumpHotkey = document.getElementById('jumpHotkey').value;
            settings.maxTimePoints = parseInt(document.getElementById('maxTimePoints').value);
            settings.clearOnRefresh = document.getElementById('clearOnRefresh').checked;
            GM_setValue('biliTimeMarkerSettings', settings);
            settingsPanel.remove();
            document.querySelector('.bili-time-marker-overlay')?.remove();
            init();
        };
    };

    // 添加快捷键支持
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;

        if (e.key === settings.markHotkey) {
            addTimePoint();
        } else if (e.key === settings.jumpHotkey && markedTimes.length > 0) {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = markedTimes[0].time;
            }
        }
    });

    // 格式化时间
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 1000);

        const parts = [];

        if (h > 0) {
            parts.push(String(h).padStart(2, '0'));
        }
        parts.push(String(m).padStart(2, '0'));
        parts.push(String(s).padStart(2, '0'));

        return parts.join(':') + `.${String(ms).padStart(3, '0')}`;
    };

    // 创建按钮的辅助函数
    const createButton = (text, color) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = `
            flex: 1;
            padding: 6px 12px;
            background-color: ${color};
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: opacity 0.2s;
        `;
        button.onmouseover = () => button.style.opacity = '0.8';
        button.onmouseout = () => button.style.opacity = '1';
        return button;
    };

    // 更新时间点列表
    const updateTimesList = () => {
        const timesList = document.querySelector('.bili-time-marker-list');
        if (!timesList) return;

        timesList.innerHTML = '';
        if (markedTimes.length === 0) {
            const emptyText = document.createElement('div');
            emptyText.style.cssText = `
                text-align: center;
                color: #999;
                font-size: 12px;
                padding: 8px;
            `;
            emptyText.textContent = '暂无标记时间点';
            timesList.appendChild(emptyText);
            return;
        }

        // 保存时间点到本地存储
        GM_setValue('biliTimeMarkerPoints', markedTimes);

        // 创建时间点列表
        markedTimes.forEach((timeData, index) => {
            timesList.appendChild(createTimeButton(timeData, index));
        });
    };

    // 从本地存储加载时间点
    const loadTimePoints = () => {
        if (settings.clearOnRefresh) {
            markedTimes = [];
            GM_setValue('biliTimeMarkerPoints', []); // 确保存储也被清除
            updateTimesList();
            return;
        }

        const savedPoints = GM_getValue('biliTimeMarkerPoints', []);
        if (Array.isArray(savedPoints) && savedPoints.length > 0) {
            markedTimes = savedPoints;
            updateTimesList();
        }
    };

    // 添加设置面板的遮罩层
    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'bili-time-marker-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999999;
        `;
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                document.querySelector('.bili-time-marker-settings')?.remove();
            }
        };
        return overlay;
    };

    // 初始化
    const init = () => {
        if (isInitialized) return;

        const video = document.querySelector('video');
        if (!video) {
            setTimeout(init, 1000);
            return;
        }

        const existingPanel = document.querySelector('.bili-time-marker-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        document.body.appendChild(createControlPanel());
        loadTimePoints();
        updateTimesList();
        isInitialized = true;
        console.log('时间标记面板已添加');
    };

    // 监听视频加载
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('video')) {
            init();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 立即尝试初始化
    init();

    // 添加页面卸载时的清理函数
    window.addEventListener('beforeunload', () => {
        if (settings.clearOnRefresh) {
            GM_setValue('biliTimeMarkerPoints', []);
        }
    });
})();
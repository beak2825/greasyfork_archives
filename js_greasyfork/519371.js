// ==UserScript==
// @name         抖音直播自动点赞-作者：1kb(云看北)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在抖音直播间自动点赞，支持自定义设置，随机点击间隔，理论其他网站也支持
// @author       1KB(云看北)
// @license      MIT
// @match        https://live.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519371/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E-%E4%BD%9C%E8%80%85%EF%BC%9A1kb%28%E4%BA%91%E7%9C%8B%E5%8C%97%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519371/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E-%E4%BD%9C%E8%80%85%EF%BC%9A1kb%28%E4%BA%91%E7%9C%8B%E5%8C%97%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        enabled: false,
        clickPosition: null,
        clickInterval: 150,    // 基础点击间隔
        clickDuration: 50,     // 点击持续时间
        intervalVariation: 20, // 间隔波动范围(±500ms)
        clickCount: 0,
        isSettingPosition: false,
        isPanelExpanded: false
    };

    // 创建控制面板
    function createControlPanel() {
        const mainButton = document.createElement('div');
        mainButton.innerHTML = '⚙️';
        mainButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 350px;
            z-index: 9999999;
            width: 32px;
            height: 32px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.3s;
        `;

        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="autoLikePanel" style="
                position: fixed;
                top: 50px;
                right: 90px;
                z-index: 9999998;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 4px;
                font-size: 14px;
                display: none;
                flex-direction: column;
                gap: 5px;
                min-width: 200px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: bold;">自动点赞设置</span>
                    <span id="closePanel" style="cursor: pointer; padding: 2px 6px;">×</span>
                </div>

                <button id="setClickArea" style="
                    padding: 5px;
                    margin: 2px;
                    background: #2196F3;
                    border: none;
                    color: white;
                    cursor: pointer;
                    border-radius: 4px;
                ">设置点击位置</button>

                <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0;">
                    <label style="flex: 1;">基础间隔(ms):</label>
                    <input type="number" id="intervalInput"
                        value="${config.clickInterval}"
                        min="100"
                        max="5000"
                        style="width: 70px; padding: 2px;">
                </div>

                <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0;">
                    <label style="flex: 1;">间隔波动(±ms):</label>
                    <input type="number" id="variationInput"
                        value="${config.intervalVariation}"
                        min="0"
                        max="2000"
                        style="width: 70px; padding: 2px;">
                </div>

                <div style="display: flex; align-items: center; gap: 5px; margin: 5px 0;">
                    <label style="flex: 1;">点击持续(ms):</label>
                    <input type="number" id="durationInput"
                        value="${config.clickDuration}"
                        min="50"
                        max="1000"
                        style="width: 70px; padding: 2px;">
                </div>

                <button id="startBtn" style="
                    padding: 5px;
                    margin: 2px;
                    background: #fe2c55;
                    border: none;
                    color: white;
                    cursor: pointer;
                    border-radius: 4px;
                ">开始点赞</button>

                <div style="font-size: 12px; margin-top: 5px;">
                    <div id="status">未设置点击位置</div>
                    <div id="clickCount">点击次数: 0</div>
                    <div id="nextClick">下次点击: - ms</div>
                </div>
            </div>
        `;

        document.body.appendChild(mainButton);
        document.body.appendChild(panel);

        // 绑定面板显示/隐藏事件
        mainButton.addEventListener('click', () => {
            const panelEl = document.getElementById('autoLikePanel');
            config.isPanelExpanded = !config.isPanelExpanded;
            panelEl.style.display = config.isPanelExpanded ? 'flex' : 'none';
            mainButton.style.transform = config.isPanelExpanded ? 'rotate(180deg)' : 'rotate(0)';
        });

        document.getElementById('closePanel').addEventListener('click', () => {
            config.isPanelExpanded = false;
            document.getElementById('autoLikePanel').style.display = 'none';
            mainButton.style.transform = 'rotate(0)';
        });

        bindEventHandlers();
    }

    // 绑定事件处理程序
    function bindEventHandlers() {
        document.getElementById('setClickArea').addEventListener('click', startPositionSelection);

        document.getElementById('startBtn').addEventListener('click', function() {
            if (!config.clickPosition) {
                alert('请先设置点击位置！');
                return;
            }

            config.enabled = !config.enabled;
            this.textContent = config.enabled ? '停止点赞' : '开始点赞';
            this.style.background = config.enabled ? '#ff4444' : '#fe2c55';

            if (config.enabled) {
                startAutoClick();
            } else {
                stopAutoClick();
            }
        });

        document.getElementById('intervalInput').addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value >= 100 && value <= 5000) {
                config.clickInterval = value;
                if (config.enabled) {
                    startAutoClick();
                }
            } else {
                alert('基础间隔请设置在100-5000ms之间');
                this.value = config.clickInterval;
            }
        });

        document.getElementById('variationInput').addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value >= 0 && value <= 2000) {
                config.intervalVariation = value;
            } else {
                alert('波动范围请设置在0-2000ms之间');
                this.value = config.intervalVariation;
            }
        });

        document.getElementById('durationInput').addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value >= 50 && value <= 1000) {
                config.clickDuration = value;
            } else {
                alert('点击持续时间请设置在50-1000ms之间');
                this.value = config.clickDuration;
            }
        });
    }

    // 开始位置选择
    function startPositionSelection() {
        if (config.isSettingPosition) return;

        config.isSettingPosition = true;
        const statusEl = document.getElementById('status');
        statusEl.textContent = '请点击要点赞的位置...';

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            cursor: crosshair;
            z-index: 9999998;
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener('click', function handleClick(e) {
            e.preventDefault();
            e.stopPropagation();

            config.clickPosition = {
                x: e.clientX,
                y: e.clientY
            };

            statusEl.textContent = `点击位置已设置: (${e.clientX}, ${e.clientY})`;
            config.isSettingPosition = false;

            overlay.remove();
        }, { once: true });
    }

    // 获取随机间隔时间
    function getRandomInterval() {
        const variation = Math.random() * 2 * config.intervalVariation - config.intervalVariation;
        return Math.max(100, config.clickInterval + variation);
    }

    // 更新下次点击时间显示
    function updateNextClickTime(interval) {
        const nextClickEl = document.getElementById('nextClick');
        if (nextClickEl) {
            nextClickEl.textContent = `下次点击: ${Math.round(interval)}ms`;
        }
    }

    // 执行点击
    async function performClick() {
        if (!config.enabled || !config.clickPosition) return;

        try {
            const element = document.elementFromPoint(
                config.clickPosition.x,
                config.clickPosition.y
            );

            if (element) {
                // 模拟鼠标按下
                element.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: config.clickPosition.x,
                    clientY: config.clickPosition.y
                }));

                // 等待设定的持续时间
                await new Promise(resolve => setTimeout(resolve, config.clickDuration));

                // 模拟鼠标松开和点击
                ['mouseup', 'click'].forEach(eventType => {
                    element.dispatchEvent(new MouseEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: config.clickPosition.x,
                        clientY: config.clickPosition.y
                    }));
                });

                config.clickCount++;
                document.getElementById('clickCount').textContent = `点击次数: ${config.clickCount}`;
            }
        } catch (error) {
            console.error('点击失败:', error);
        }
    }

    // 开始自动点击
    function startAutoClick() {
        stopAutoClick();

        function scheduleNextClick() {
            if (!config.enabled) return;

            const nextInterval = getRandomInterval();
            updateNextClickTime(nextInterval);

            window.clickTimer = setTimeout(() => {
                performClick();
                scheduleNextClick();
            }, nextInterval);
        }

        performClick();
        scheduleNextClick();
    }

    // 停止自动点击
    function stopAutoClick() {
        if (window.clickTimer) {
            clearTimeout(window.clickTimer);
            window.clickTimer = null;
        }
    }

    // 初始化
    function init() {
        createControlPanel();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面卸载时清理
    window.addEventListener('unload', stopAutoClick);
})();
// ==UserScript==
// @name         水源戒手
// @namespace    https://shuiyuan.sjtu.edu.cn/
// @version      1.4.1
// @description  统计特定网站的浏览时间，提供可自定义的中央提醒和快捷操作
// @match        https://shuiyuan.sjtu.edu.cn/*
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @author       claude-3-5-sonnet-20240620 ，十一世纪
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517462/%E6%B0%B4%E6%BA%90%E6%88%92%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/517462/%E6%B0%B4%E6%BA%90%E6%88%92%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置
    const defaultConfig = {
        buttons: [
            { name: "戒！", url: "https://www.bilibili.com/video/BV1UT42167xb" },
            { name: "学！", url: "https://oc.sjtu.edu.cn/" },
            { name: "源！", url: "" }
        ],
        popupInterval: -1,
        popupEnabled: true,
        nextPopupTime: 0,
        suppressDuration: 0,
        lastResetTime: Date.now()
    };

    // 全局变量
    let config = GM_getValue('config', defaultConfig);
    let startTime = Date.now();
    let totalTime = GM_getValue('totalTime', 0);
    let lastActive = Date.now();
    let isActive = true;

    // 添加样式
    GM_addStyle(`
        .time-tracker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }

        .time-tracker-popup {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 400px;
            max-width: 90%;
        }

        .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .popup-header h2 {
            margin: 0;
            color: #333;
        }

        .close-btn {
            cursor: pointer;
            font-size: 24px;
            color: #666;
        }

        .time-display {
            text-align: center;
            font-size: 18px;
            margin-bottom: 20px;
        }

        .button-container {
            display: flex;
            justify-content: space-around;
            gap: 10px;
            margin: 15px 0;
        }

        .button-wrapper {
            position: relative;
            width: 100%;
        }

        .custom-button {
            position: relative;
            width: 100%;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: white;
            margin-bottom: 5px;
        }

        .custom-button:nth-child(1) {
            background-color: #ff4444;
        }

        .custom-button:nth-child(2) {
            background-color: #4CAF50;
        }

        .custom-button:nth-child(3) {
            background-color: #2196F3;
        }

        /* 如果需要调整气泡提示的位置，可以修改这些值 */
        .tooltip-trigger {
            position: absolute;
            left: 0;
            right: 0;
            top: -40px;
            height: 60px;
            z-index: 999;
        }

        .tooltip {
            visibility: hidden;
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 8px;
            border-radius: 4px;
            white-space: nowrap;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .tooltip input {
            margin: 0 5px;
            padding: 2px 5px;
            border: 1px solid #666;
            border-radius: 3px;
            width: 200px;
        }

        .tooltip-trigger:hover + .tooltip,
        .tooltip:hover {
            visibility: visible;
            opacity: 1;
        }

        .settings-container {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .settings-group {
            margin-bottom: 15px;
        }

        .settings-label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }

        .settings-select {
            width: 100%;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 10px;
        }

        .suppress-controls {
            display: flex;
            gap: 10px;
            align-items: center;  /* 垂直居中对齐 */
            justify-content: flex-start;  /* 靠左对齐 */
        }

        .settings-button {
            padding: 8px 15px;  /* 调整内边距使按钮更宽 */
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;  /* 防止文字换行 */
            min-width: 120px;  /* 设置最小宽度 */
            text-align: center;  /* 文字居中 */
        }

        .settings-button:hover {
            background: #1976D2;
        }

        #quit {
            background-color: #ff4444;
        }

        #study {
            background-color: #4CAF50;
        }

        #continue {
            background-color: #2196F3;
        }

        #quit:hover {
            background-color: #ff6666;
        }

        #study:hover {
            background-color: #66BB6A;
        }

        #continue:hover {
            background-color: #42A5F5;
        }
    `);

    // 创建水源图标
    function createWaterSourceIcon() {
        const headerIcons = document.querySelector('.icons.d-header-icons');
        if (!headerIcons) return;

        // 检查是否存在“聊天”或“搜索”图标
        const hasChatOrSearchIcon = headerIcons.querySelector('.chat-header-icon, .search-dropdown');

        if (!hasChatOrSearchIcon) return; // 如果两者都不存在，则不插入图标

        const listItem = document.createElement('li');
        listItem.className = 'header-dropdown-toggle';

        const button = document.createElement('button');
        button.className = 'btn no-text icon btn-flat';
        button.title = '水源戒手';

        button.innerHTML = `
            <svg class="fa d-icon svg-icon svg-string" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"/>
            </svg>
        `;

        button.onclick = () => createPopup(true);
        listItem.appendChild(button);

        // 插入到“聊天”或“搜索”图标之前
        headerIcons.insertBefore(listItem, hasChatOrSearchIcon);
    }


    // 更新配置
    function updateConfig() {
        GM_setValue('config', config);
    }

    // 更新时间
    function updateTime() {
        if (isActive) {
            const now = Date.now();
            // 检查是否需要重置
            if (!checkAndResetTime()) {
                totalTime += (now - startTime) / 1000;
                GM_setValue('totalTime', totalTime);
            }
            startTime = now;
        }
    }
    // 重置活动状态
    function resetActivity() {
        if (!isActive) {
            startTime = Date.now();
        }
        isActive = true;
        lastActive = Date.now();
    }

    // 检查不活跃状态
    function checkInactivity() {
        if (Date.now() - lastActive > 60000) {
            isActive = false;
        }
    }

    // 创建弹窗
    function createPopup(isManualClick = false) {
        // 检查是否应该显示弹窗
        if (!isManualClick && config.nextPopupTime > Date.now()) {
            return;
        }

        updateTime();
        const overlay = document.createElement('div');
        overlay.className = 'time-tracker-overlay';

        let buttonsHtml = config.buttons.map((button, index) => `
        <div class="button-wrapper">
            <button class="custom-button" id="${['quit', 'study', 'continue'][index]}" data-url="${button.url}">
                ${button.name}
            </button>
            ${index !== 2 ? `
                <div class="tooltip-trigger"></div>
                <div class="tooltip">
                    <input type="text" value="${button.url}">
                </div>
            ` : ''}
        </div>
    `).join('');

        overlay.innerHTML = `
            <div class="time-tracker-popup">
                <div class="popup-header">
                    <h2>水源戒手</h2>
                    <span class="close-btn">&times;</span>
                </div>
                <div class="popup-content">
                    <p class="time-display">你已经看了 ${Math.round(totalTime / 60)} 分钟的水源了！</p>

                    <div class="button-container">
                        ${buttonsHtml}
                    </div>

                    <div class="settings-container">
                        <div class="settings-group">
                            <label class="settings-label">弹窗提醒间隔：</label>
                            <select class="settings-select" id="popupSettings">
                                <option value="-1">不设置定时弹窗</option>
                                <option value="3">3分钟</option>
                                <option value="10">10分钟</option>
                                <option value="15">15分钟</option>
                                <option value="30">30分钟</option>
                                <option value="60">60分钟</option>
                            </select>
                        </div>

                        <div class="settings-group">
                            <label class="settings-label">本次浏览提醒设置：</label>
                            <div class="suppress-controls">
                                <select class="settings-select" id="suppressDuration">
                                    <option value="0">每次刷新都提醒</option>
                                    <option value="0.05">3分钟内不再提醒</option>
                                    <option value="0.17">10分钟内不再提醒</option>
                                    <option value="0.25">15分钟内不再提醒</option>
                                    <option value="0.5">30分钟内不再提醒</option>
                                    <option value="1">1小时内不再提醒</option>
                                    <option value="3">3小时内不再提醒</option>
                                    <option value="12">12小时内不再提醒</option>
                                    <option value="24">24小时内不再提醒</option>
                                </select>
                                <button class="settings-button" id="suppressButton">确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 设置选项的初始值
        const popupSelect = document.getElementById('popupSettings');
        const suppressSelect = document.getElementById('suppressDuration');
        popupSelect.value = config.popupInterval.toString();
        suppressSelect.value = config.suppressDuration.toString();

        // 事件监听
        overlay.querySelector('.close-btn').addEventListener('click', () => overlay.remove());

        // 按钮点击事件
        overlay.querySelectorAll('.custom-button').forEach((button, index) => {
            button.addEventListener('click', () => {
                if (index === 2) { // "源！"按钮
                    overlay.remove();
                } else {
                    const url = button.dataset.url;
                    if (url) {
                        window.location.href = url;
                    }
                }
            });
        });

        // URL输入事件
        overlay.querySelectorAll('.tooltip input').forEach((input, index) => {
            input.addEventListener('click', e => e.stopPropagation());
            input.addEventListener('change', e => {
                const button = e.target.closest('.custom-button');
                const newUrl = e.target.value;
                button.dataset.url = newUrl;
                config.buttons[index].url = newUrl;
                updateConfig();
            });
        });

        // 设置相关事件
        popupSelect.addEventListener('change', (e) => {
            config.popupInterval = parseInt(e.target.value);
            config.popupEnabled = (config.popupInterval !== -1);
            updateConfig();
        });

        document.getElementById('suppressButton').addEventListener('click', () => {
            const duration = parseFloat(suppressSelect.value);
            config.nextPopupTime = duration === 0 ? 0 : Date.now() + (duration * 60 * 60 * 1000);
            config.suppressDuration = duration;
            updateConfig();
            overlay.remove();
        });
    }

    // 重置函数
    function checkAndResetTime() {
        const now = new Date();
        const lastResetTime = new Date(config.lastResetTime);
        
        // 获取今天的凌晨4点时间
        const today4AM = new Date(now);
        today4AM.setHours(4, 0, 0, 0);
        
        // 获取昨天的凌晨4点时间
        const yesterday4AM = new Date(today4AM);
        yesterday4AM.setDate(yesterday4AM.getDate() - 1);
        
        // 如果上次重置时间在昨天4点之前，且现在时间已过今天4点
        if (lastResetTime < yesterday4AM && now >= today4AM) {
            totalTime = 0;
            GM_setValue('totalTime', 0);
            config.lastResetTime = now.getTime();
            updateConfig();
            return true;
        }
        return false;
    }
    // 初始化
    function initialize() {
        createWaterSourceIcon();
        
        // 检查是否需要重置时间
        checkAndResetTime();

        // 检查是否需要显示初始弹窗
        if (config.nextPopupTime <= Date.now()) {
            setTimeout(() => createPopup(false), 1000);
        }
    }

    initialize();

    // 定时检查是否需要弹窗
    setInterval(() => {
        if (config.popupEnabled && config.popupInterval !== -1) {
            createPopup(false);
        }
    }, 60000);

    // 添加定时检查重置
    setInterval(() => {
        checkAndResetTime();
    }, 60000); // 每分钟检查一次

    // 全局事件监听
    window.addEventListener('beforeunload', updateTime);
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(eventType => {
        document.addEventListener(eventType, resetActivity);
    });
    setInterval(checkInactivity, 10000);
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            updateTime();
            isActive = false;
        } else {
            resetActivity();
        }
    });
})();

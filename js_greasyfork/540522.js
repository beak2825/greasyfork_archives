// ==UserScript==
// @name         Grok Monitor
// @namespace    https://github.com/Loongphy/Grok-Monitor
// @version      1.0.1
// @author       Loongphy
// @description  监控 Grok API 配额（标准、思考、深度、更深），默认显示总数，悬浮查看详情，支持鼠标拖动位置
// @match        https://grok.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/540522/Grok%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/540522/Grok%20Monitor.meta.js
// ==/UserScript==

/*
 * Grok Monitor - 监控 Grok API 配额使用情况的油猴脚本
 * 新增功能：支持鼠标左键拖动监控器位置，位置自动保存
 *
 * 本脚本基于 GPL-3.0 许可证
 * 衍生自 BlueSkyXN 的 Grok Helper
 * 原始代码: https://github.com/BlueSkyXN/GPT-Models-Plus/blob/main/GrokHelper.js
 * 原作者: BlueSkyXN
 */

(function() {
    'use strict';

    // 缓存查询结果
    let cachedResults = null;

    // 获取用户设置或设置默认值
    let isCompactMode = GM_getValue('compactMode', true); // 默认使用精简模式
    let monitorPosition = GM_getValue('monitorPosition', { left: 16, top: 72 }); // 默认位置

    // 四种模式 -> 中文名称对应表
    const MODE_LABELS = {
        DEFAULT: '标准',
        REASONING: '思考',
        DEEPSEARCH: '深度',
        DEEPERSEARCH: '更深'
    };

    // 我们需要查询的四种模式
    const REQUEST_KINDS = Object.keys(MODE_LABELS);

    // 图标 SVG (来自 Font Awesome 免费图标)
    const ICONS = {
        BOLT: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3S397.3 224 384 224H272.5L349.4 44.6z"/></svg>',
        TIMER: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"><path fill="currentColor" d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>',
        INFO: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
        REFRESH: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12" height="12"><path fill="currentColor" d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/></svg>'
    };

    // 添加自定义样式
    GM_addStyle(`
        /* 通用样式 */
        .grok-monitor {
            position: fixed;
            left: ${monitorPosition.left}px; /* 动态设置初始位置 */
            top: ${monitorPosition.top}px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            z-index: 100;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            width: fit-content;
            cursor: move; /* 提示可拖动 */
            user-select: none; /* 防止拖动时选中文字 */
        }

        /* 完整模式样式 */
        .grok-monitor.full-mode {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.95);
            color: #333;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(8px);
            max-width: 280px;
            border: 1px solid rgba(0, 0, 0, 0.06);
            transform-origin: top left;
            padding: 12px 16px;
            font-size: 14px;
        }

        .grok-monitor.full-mode:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12), 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        /* 精简模式样式 */
        .grok-monitor.compact-mode {
            display: flex;
            flex-direction: column;
            border-radius: 12px;
            background-color: rgba(255, 255, 255, 0.95);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.06);
            overflow: hidden;
            max-width: 280px;
        }

        .grok-monitor.compact-mode .compact-header {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            gap: 10px;
            font-size: 15px;
            color: #333;
            width: 100%;
        }

        .grok-monitor-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            gap: 10px;
        }

        .grok-monitor-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 14px;
            color: #444;
        }

        .grok-monitor-title .icon {
            display: flex;
            align-items: center;
            color: #2563EB;
        }

        .grok-monitor-summary {
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
            font-weight: 500;
            font-size: 15px;
            color: #444;
            width: 100%;
        }

        .full-mode .grok-monitor-summary {
            background: rgba(0, 0, 0, 0.03);
            padding: 6px 10px;
            border-radius: 8px;
            justify-content: space-between;
        }

        .compact-mode .grok-monitor-summary {
            padding: 0;
            margin: 0;
            justify-content: space-between;
        }

        .grok-monitor-summary-text {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .grok-monitor-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
            box-shadow: 0 0 0 rgba(0, 0, 0, 0);
            transition: all 0.3s ease;
            margin-left: 8px;
        }

        .grok-monitor-indicator.green {
            background-color: #10B981;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
        }

        .grok-monitor-indicator.yellow {
            background-color: #F59E0B;
            box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
        }

        .grok-monitor-indicator.red {
            background-color: #EF4444;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
        }

        .grok-monitor-details {
            display: none;
            flex-direction: column;
            gap: 8px;
            font-size: 13px;
            color: #555;
            width: 100%;
        }

        .show-details .grok-monitor-details,
        .full-mode:hover .grok-monitor-details,
        .compact-mode:hover .grok-monitor-details {
            display: flex;
            animation: fadeIn 0.3s ease forwards;
        }

        .compact-mode .grok-monitor-details {
            padding: 0 16px 12px;
        }

        .grok-monitor-kind-row {
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
            padding: 6px 10px;
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.02);
            justify-content: space-between;
            transition: background-color 0.2s ease;
        }

        .grok-monitor-kind-row:hover {
            background: rgba(0, 0, 0, 0.04);
        }

        .grok-monitor-kind-name {
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .grok-monitor-kind-name .icon {
            display: flex;
            color: #555;
        }

        .grok-monitor-info {
            color: #666;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .grok-monitor-info .time {
            opacity: 0.8;
            font-size: 12px;
            color: #777;
            display: flex;
            align-items: center;
            gap: 3px;
        }

        .grok-monitor-info .time .icon {
            display: flex;
            color: #777;
        }

        .refresh-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(37, 99, 235, 0.08);
            color: #2563EB;
            border: none;
            border-radius: 6px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            padding: 0;
            margin-left: auto;
        }

        .refresh-button:hover {
            background: rgba(37, 99, 235, 0.15);
        }

        .refresh-button .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }

        .refresh-button:hover .icon-container {
            animation: rotateIcon 0.8s ease forwards;
        }

        .grok-monitor.updating .grok-monitor-indicator {
            animation: pulse 1s ease-in-out infinite;
        }

        .mode-switch-btn {
            width: 100%;
            padding: 6px 0;
            font-size: 13px;
            border: none;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 6px;
            cursor: pointer;
            color: #555;
            transition: background 0.2s ease;
            margin-top: 4px;
        }

        .mode-switch-btn:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.3);
                opacity: 0.7;
            }
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes rotateIcon {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @media (prefers-color-scheme: dark) {
            .grok-monitor.full-mode,
            .grok-monitor.compact-mode {
                background-color: rgba(30, 30, 30, 0.9);
                color: #eee;
                border-color: rgba(255, 255, 255, 0.1);
            }

            .mode-switch-btn {
                background: rgba(255, 255, 255, 0.05);
                color: #aaa;
            }

            .mode-switch-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .grok-monitor-title {
                color: #ddd;
            }

            .grok-monitor-summary {
                color: #ddd;
            }

            .full-mode .grok-monitor-summary {
                background: rgba(255, 255, 255, 0.05);
            }

            .grok-monitor-details {
                color: #ccc;
            }

            .grok-monitor-kind-row {
                background: rgba(255, 255, 255, 0.03);
            }

            .grok-monitor-kind-row:hover {
                background: rgba(255, 255, 255, 0.07);
            }

            .grok-monitor-kind-name {
                color: #ddd;
            }

            .grok-monitor-kind-name .icon {
                color: #aaa;
            }

            .grok-monitor-info {
                color: #bbb;
            }

            .grok-monitor-info .time {
                color: #999;
            }

            .grok-monitor-info .time .icon {
                color: #999;
            }

            .refresh-button {
                background: rgba(59, 130, 246, 0.12);
            }

            .refresh-button:hover {
                background: rgba(59, 130, 246, 0.2);
            }
        }
    `);

    // 工具函数：格式化等待时间
    function formatWaitTime(seconds) {
        if (seconds <= 0) return '0分';
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分`;
    }

    // 工具函数：格式化窗口时间
    function formatWindowTime(seconds) {
        if (seconds <= 0) return '0h';
        const hours = Math.floor(seconds / 3600);
        return `${hours}h`;
    }

    // 启用拖动功能
    function enableDrag(element) {
        let isDragging = false;
        let currentX = monitorPosition.left;
        let currentY = monitorPosition.top;
        let initialX, initialY;

        // 鼠标按下事件
        element.addEventListener('mousedown', (e) => {
            // 仅响应左键点击，且避免按钮区域
            if (e.button === 0 && !e.target.closest('.refresh-button, .mode-switch-btn')) {
                isDragging = true;
                initialX = e.clientX - currentX;
                initialY = e.clientY - currentY;
                e.preventDefault(); // 防止文本选中
            }
        });

        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                // 限制拖动范围在视口内
                currentX = Math.max(0, Math.min(currentX, window.innerWidth - element.offsetWidth));
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - element.offsetHeight));
                element.style.left = `${currentX}px`;
                element.style.top = `${currentY}px`;
            }
        });

        // 鼠标释放事件
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // 保存新位置
                monitorPosition = { left: currentX, top: currentY };
                GM_setValue('monitorPosition', monitorPosition);
            }
        });
    }

    // 切换显示模式
    function toggleMode() {
        isCompactMode = !isCompactMode;
        GM_setValue('compactMode', isCompactMode);

        // 直接更新UI，不刷新页面
        const monitorElement = document.querySelector('.grok-monitor');
        if (monitorElement) {
            // 清空现有内容
            monitorElement.innerHTML = '';
            monitorElement.className = `grok-monitor ${isCompactMode ? 'compact-mode' : 'full-mode'}`;
            // 恢复保存的位置
            monitorElement.style.left = `${monitorPosition.left}px`;
            monitorElement.style.top = `${monitorPosition.top}px`;

            // 重新创建UI
            if (isCompactMode) {
                createCompactModeUI(monitorElement);
            } else {
                createFullModeUI(monitorElement);
            }

            // 如果有缓存的数据，直接更新UI
            if (cachedResults) {
                updateUI(cachedResults);
            }

            // 重新绑定拖动事件
            enableDrag(monitorElement);
        }
    }

    // 创建监控器UI
    function createMonitor() {
        const monitor = document.createElement('div');
        monitor.className = `grok-monitor ${isCompactMode ? 'compact-mode' : 'full-mode'}`;
        monitor.style.left = `${monitorPosition.left}px`;
        monitor.style.top = `${monitorPosition.top}px`;

        if (isCompactMode) {
            createCompactModeUI(monitor);
        } else {
            createFullModeUI(monitor);
        }

        document.body.appendChild(monitor);
        enableDrag(monitor); // 启用拖动
        return monitor;
    }

    // 创建完整模式UI
    function createFullModeUI(monitor) {
        // 标题栏
        const header = document.createElement('div');
        header.className = 'grok-monitor-header';

        const title = document.createElement('div');
        title.className = 'grok-monitor-title';

        const titleIcon = document.createElement('span');
        titleIcon.className = 'icon';
        titleIcon.innerHTML = ICONS.BOLT;

        const titleText = document.createElement('span');
        titleText.textContent = 'Grok 配额监控';

        title.appendChild(titleIcon);
        title.appendChild(titleText);

        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.title = '刷新数据';

        const iconContainer = document.createElement('span');
        iconContainer.className = 'icon-container';
        iconContainer.innerHTML = ICONS.REFRESH;

        refreshButton.appendChild(iconContainer);

        refreshButton.onclick = async (e) => {
            e.stopPropagation();
            await checkRateLimits();
        };

        header.appendChild(title);
        header.appendChild(refreshButton);

        // 小版本（默认显示）
        const summaryRow = document.createElement('div');
        summaryRow.className = 'grok-monitor-summary';

        const sumText = document.createElement('div');
        sumText.className = 'grok-monitor-summary-text';

        const sumSpan = document.createElement('span');
        sumSpan.textContent = '剩余总数: ...';

        sumText.appendChild(sumSpan);

        const indicator = document.createElement('div');
        indicator.className = 'grok-monitor-indicator';

        summaryRow.appendChild(sumText);
        summaryRow.appendChild(indicator);

        // 大版本（悬浮后展开）
        const details = document.createElement('div');
        details.className = 'grok-monitor-details';

        // 为每种模式创建行
        REQUEST_KINDS.forEach(kind => {
            const row = document.createElement('div');
            row.className = 'grok-monitor-kind-row';

            const nameContainer = document.createElement('div');
            nameContainer.className = 'grok-monitor-kind-name';

            const kindIcon = document.createElement('span');
            kindIcon.className = 'icon';
            kindIcon.innerHTML = ICONS.INFO;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = MODE_LABELS[kind];

            nameContainer.appendChild(kindIcon);
            nameContainer.appendChild(nameSpan);

            const infoContainer = document.createElement('div');
            infoContainer.className = 'grok-monitor-info';

            const infoSpan = document.createElement('span');
            infoSpan.textContent = '剩余 .../...';

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            const timeIcon = document.createElement('span');
            timeIcon.className = 'icon';
            timeIcon.innerHTML = ICONS.TIMER;

            const timeText = document.createElement('span');
            timeText.textContent = '...h刷新';

            timeSpan.appendChild(timeIcon);
            timeSpan.appendChild(timeText);

            infoContainer.appendChild(infoSpan);
            infoContainer.appendChild(timeSpan);

            row.appendChild(nameContainer);
            row.appendChild(infoContainer);
            details.appendChild(row);
        });

        // 添加切换模式按钮
        const switchBtn = document.createElement('button');
        switchBtn.className = 'mode-switch-btn';
        switchBtn.textContent = '切换为精简模式';
        switchBtn.onclick = toggleMode;
        details.appendChild(switchBtn);

        monitor.appendChild(header);
        monitor.appendChild(summaryRow);
        monitor.appendChild(details);
    }

    // 创建精简模式UI
    function createCompactModeUI(monitor) {
        // 创建精简头部
        const compactHeader = document.createElement('div');
        compactHeader.className = 'compact-header';

        // 精简模式只显示总数和指示灯
        const summaryRow = document.createElement('div');
        summaryRow.className = 'grok-monitor-summary';

        const sumText = document.createElement('div');
        sumText.className = 'grok-monitor-summary-text';

        const sumSpan = document.createElement('span');
        sumSpan.textContent = '剩余总数: ...';

        sumText.appendChild(sumSpan);

        const indicator = document.createElement('div');
        indicator.className = 'grok-monitor-indicator';

        // 添加刷新按钮
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.title = '刷新数据';

        const iconContainer = document.createElement('span');
        iconContainer.className = 'icon-container';
        iconContainer.innerHTML = ICONS.REFRESH;

        refreshButton.appendChild(iconContainer);

        refreshButton.onclick = async (e) => {
            e.stopPropagation();
            await checkRateLimits();
        };

        summaryRow.appendChild(sumText);
        summaryRow.appendChild(indicator);
        summaryRow.appendChild(refreshButton);

        compactHeader.appendChild(summaryRow);

        // 创建详情部分（悬浮时展开）
        const details = document.createElement('div');
        details.className = 'grok-monitor-details';

        // 为每种模式创建行
        REQUEST_KINDS.forEach(kind => {
            const row = document.createElement('div');
            row.className = 'grok-monitor-kind-row';

            const nameContainer = document.createElement('div');
            nameContainer.className = 'grok-monitor-kind-name';

            const kindIcon = document.createElement('span');
            kindIcon.className = 'icon';
            kindIcon.innerHTML = ICONS.INFO;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = MODE_LABELS[kind];

            nameContainer.appendChild(kindIcon);
            nameContainer.appendChild(nameSpan);

            const infoContainer = document.createElement('div');
            infoContainer.className = 'grok-monitor-info';

            const infoSpan = document.createElement('span');
            infoSpan.textContent = '剩余 .../...';

            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            const timeIcon = document.createElement('span');
            timeIcon.className = 'icon';
            timeIcon.innerHTML = ICONS.TIMER;

            const timeText = document.createElement('span');
            timeText.textContent = '...h刷新';

            timeSpan.appendChild(timeIcon);
            timeSpan.appendChild(timeText);

            infoContainer.appendChild(infoSpan);
            infoContainer.appendChild(timeSpan);

            row.appendChild(nameContainer);
            row.appendChild(infoContainer);
            details.appendChild(row);
        });

        // 添加切换模式按钮
        const switchBtn = document.createElement('button');
        switchBtn.className = 'mode-switch-btn';
        switchBtn.textContent = '切换为完整模式';
        switchBtn.onclick = toggleMode;
        details.appendChild(switchBtn);

        monitor.appendChild(compactHeader);
        monitor.appendChild(details);
    }

    // 获取当前域名的基础URL
    function getBaseUrl() {
        return window.location.origin;
    }

    // 获取每种模式的限额
    async function fetchRateLimit(kind) {
        try {
            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}/rest/rate-limits`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    requestKind: kind,
                    modelName: "grok-3"
                }),
                credentials: 'include'
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error(`Failed to fetch ${kind} rate limit`);
            }
        } catch (error) {
            console.error('Rate limit check failed:', error);
            return null;
        }
    }

    // 一次获取所有模式数据
    async function getAllRateLimits() {
        const results = {};
        for (const kind of REQUEST_KINDS) {
            results[kind] = await fetchRateLimit(kind);
        }
        return results;
    }

    // 更新UI
    function updateUI(results) {
        cachedResults = results;

        const monitor = document.querySelector('.grok-monitor');
        const sumSpan = monitor.querySelector('.grok-monitor-summary-text span');
        const indicator = monitor.querySelector('.grok-monitor-indicator');

        monitor.classList.add('updating');

        indicator.classList.remove('green', 'yellow', 'red');

        let sum = 0;
        REQUEST_KINDS.forEach(kind => {
            const data = results[kind];
            if (data && data.remainingQueries > 0) {
                sum += data.remainingQueries;
            }
        });

        sumSpan.textContent = `剩余总数: ${sum}`;

        if (sum === 0) {
            indicator.classList.add('red');
        } else if (sum > 0 && sum < 5) {
            indicator.classList.add('yellow');
        } else {
            indicator.classList.add('green');
        }

        const detailRows = monitor.querySelectorAll('.grok-monitor-details .grok-monitor-kind-row');
        updateDetailRows(detailRows, results);

        setTimeout(() => monitor.classList.remove('updating'), 1000);
    }

    // 更新详情行
    function updateDetailRows(detailRows, results) {
        detailRows.forEach(row => {
            const label = row.querySelector('.grok-monitor-kind-name span:last-child')?.textContent;
            if (!label) return;

            const kind = Object.keys(MODE_LABELS).find(k => MODE_LABELS[k] === label);
            if (!kind) return;

            const data = results[kind];

            const infoSpan = row.querySelector('.grok-monitor-info span:first-child');
            const timeText = row.querySelector('.grok-monitor-info .time span:last-child');

            if (!data) {
                infoSpan.textContent = '获取失败';
                timeText.textContent = '';
                return;
            }

            const { remainingQueries, totalQueries, windowSizeSeconds, waitTimeSeconds } = data;
            if (remainingQueries > 0) {
                infoSpan.textContent = `剩余 ${remainingQueries}/${totalQueries}`;
                timeText.textContent = formatWindowTime(windowSizeSeconds);
            } else {
                infoSpan.textContent = `等待刷新`;
                timeText.textContent = formatWaitTime(waitTimeSeconds);
            }
        });
    }

    // 定时检查
    async function checkRateLimits() {
        const results = await getAllRateLimits();
        updateUI(results);
    }

    // 注册油猴菜单
    GM_registerMenuCommand("切换显示模式", toggleMode);

    // 初始化
    function init() {
        createMonitor();
        checkRateLimits();
        setInterval(checkRateLimits, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
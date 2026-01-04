// ==UserScript==
// @name         linux.do 板块活动雷达图
// @namespace    http://tampermonkey.net/
// @version      2025-06-18
// @description  linux.do 活动雷达图，展示7个板块在不同时间段的活动数据，界面炫彩，富含科技感，并根据发帖和回帖赋予不同权重。
// @author       NullUser
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539893/linuxdo%20%E6%9D%BF%E5%9D%97%E6%B4%BB%E5%8A%A8%E9%9B%B7%E8%BE%BE%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/539893/linuxdo%20%E6%9D%BF%E5%9D%97%E6%B4%BB%E5%8A%A8%E9%9B%B7%E8%BE%BE%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CACHE_PREFIX = 'linuxdo_activity_radar_graph_';
    const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
    const MAX_RETRIES = 3; // For initial request, in case of network issues
    const RETRY_DELAY_MS = 3000; // 3 seconds delay on retry

    // 活动权重配置
    const ACTIVITY_WEIGHTS = {
        TOPIC_CREATED: 10, // action_type: 4 (话题)
        POST_CREATED: 1,   // action_type: 5 (回帖/回复)
    };

    // 板块配置 (中文名称)
    const category_dict = {
        "前沿快讯": [34, 78, 79, 80],
        "开发调优": [4, 20, 31, 88],
        "搞七捻三": [11, 35, 89, 21],
        "深海幽域": [45, 57, 58, 59],
        "福利羊毛": [36, 60, 61, 62],
        "资源荟萃": [14, 83, 84, 85],
        "跳蚤市场": [10, 13, 81, 82],
    };

    const categoryIdToNameMap = new Map();
    for (const name in category_dict) {
        category_dict[name].forEach(id => categoryIdToNameMap.set(id, name));
    }
    const enabledCategories = Object.keys(category_dict); // 所有要展示的板块名称

    // 为每个板块分配独特的颜色，更鲜艳，并用于SVG填充
    const categoryColors = {
        "前沿快讯": "#00BCD4", // Cyan
        "开发调优": "#4CAF50", // Green
        "搞七捻三": "#FFC107", // Amber
        "深海幽域": "#9C27B0", // Purple
        "福利羊毛": "#FF5722", // Deep Orange
        "资源荟萃": "#2196F3", // Blue
        "跳蚤市场": "#E91E63", // Pink
    };

    // --- Styles ---
    const styles = `
.radar-graph-container {
    margin-bottom: 20px !important;
    background: linear-gradient(135deg, #2a2a2a, #1a1a1a); /* Dark gradient background */
    border-radius: 12px !important; /* More rounded corners */
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4) !important; /* Stronger shadow */
    padding: 30px !important; /* More padding */
    font-family: "Microsoft YaHei", "Segoe UI", sans-serif; /* Prefer YaHei for Chinese */
    color: #f0f0f0; /* Light text color for dark background */
    border: 1px solid rgba(60, 60, 60, 0.5); /* Subtle border */
    position: relative;
    overflow: hidden; /* For pseudo-elements glow */
}

/* Pseudo-elements for sci-fi glow effect */
.radar-graph-container::before,
.radar-graph-container::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;
    z-index: 0;
}

.radar-graph-container::before {
    width: 150px;
    height: 150px;
    background: linear-gradient(45deg, #00bfff, #8a2be2); /* Blue-Violet glow */
    top: -50px;
    left: -50px;
    animation: glow-move 10s infinite alternate;
}

.radar-graph-container::after {
    width: 180px;
    height: 180px;
    background: linear-gradient(135deg, #ff4500, #ffd700); /* Orange-Gold glow */
    bottom: -60px;
    right: -60px;
    animation: glow-move 12s infinite reverse;
}

@keyframes glow-move {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, 20px) scale(1.1); }
    100% { transform: translate(0, 0) scale(1); }
}


.radar-graph-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: relative; /* Z-index above glows */
    z-index: 1;
}

.radar-graph-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #00f0ff; /* Bright cyan title */
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.6); /* Glow effect */
    letter-spacing: 1px;
}

.radar-graph-content {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 30px; /* Increased gap */
    position: relative;
    z-index: 1;
}

.radar-chart-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border-radius: 8px;
    background-color: rgba(30, 30, 30, 0.7); /* Slightly lighter dark background */
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    border: 1px solid rgba(80, 80, 80, 0.4);
    min-width: 280px; /* Wider charts */
    box-sizing: border-box;
    flex: 1;
    max-width: 32%;
    backdrop-filter: blur(5px); /* Frosted glass effect */
}

.radar-chart-title {
    font-size: 1.2em;
    font-weight: bold;
    color: #e0e0e0;
    margin-bottom: 15px;
    text-align: center;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
}

.radar-chart-svg {
    width: 220px; /* Larger SVG */
    height: 220px;
    overflow: visible;
    margin-bottom: 10px;
}

/* SVG Elements Styling */
.radar-grid-circle {
    stroke: rgba(150, 150, 150, 0.2); /* Lighter, more subtle grid lines */
    stroke-width: 1;
    fill: none;
    stroke-dasharray: 4 4; /* More pronounced dashes */
}

.radar-axis-line {
    stroke: rgba(120, 120, 120, 0.3); /* Even lighter axis lines */
    stroke-width: 0.8;
}

.radar-polygon-fill {
    /* Fill and stroke will be set by JS dynamically */
    transition: all 0.5s ease-out; /* Smooth animation for shape change */
    filter: drop-shadow(0px 0px 5px rgba(0, 255, 255, 0.4)); /* Glow behind polygon */
}

.radar-category-label {
    font-size: 11px;
    fill: #b0b0b0; /* Lighter grey for labels */
    font-weight: 500;
    text-anchor: middle;
    dominant-baseline: central;
}

.radar-label-legend {
    margin-top: 15px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 20px;
}

.radar-label-item {
    display: flex;
    align-items: center;
    font-size: 0.9em;
    color: #d0d0d0;
}

.radar-label-color {
    width: 14px; /* Larger color square */
    height: 14px;
    border-radius: 4px; /* Slightly more rounded */
    margin-right: 10px;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 0 5px rgba(255,255,255,0.2); /* Subtle glow on colors */
}

/* Loading Indicator */
.activity-graph-loading {
  display: flex ;
  justify-content: center;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  font-size: 16px;
  color: #00f0ff; /* Bright cyan loading text */
  z-index: 1000; /* Ensure it's on top */
  position: relative; /* For z-index to work */
}
.activity-graph-loading .spinner {
  border: 4px solid rgba(0,240,255,0.2); /* Lighter border */
  border-left-color: #00f0ff; /* Bright cyan spinner */
  border-radius: 50%;
  width: 28px; /* Larger spinner */
  height: 28px;
  animation: spin 0.8s linear infinite; /* Faster spin */
  margin-right: 12px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .radar-chart-wrapper {
        max-width: 48%;
        min-width: unset; /* Allow flexible width */
    }
}

@media (max-width: 480px) {
    .radar-chart-wrapper {
        max-width: 100%;
    }
    .radar-chart-svg {
        width: 180px;
        height: 180px;
    }
    .radar-category-label {
        font-size: 10px;
    }
}
`;

    // Create and inject style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // --- Helper Functions ---

    function getTimestampXHoursAgo(hours) {
        const d = new Date();
        d.setHours(d.getHours() - hours);
        return d.getTime();
    }

    function getTimestampXDaysAgo(days) {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.getTime();
    }

    // --- Loading Indicator ---
    function showLoadingIndicator(message = "正在加载活动数据...") {
        removeLoadingIndicator();
        const indicator = document.createElement('div');
        indicator.className = 'activity-graph-loading';
        indicator.innerHTML = `<div class="spinner"></div> <span class="loading-text">${message}</span>`;
        return indicator;
    }

    function updateLoadingMessage(indicator, message) {
        if (indicator) {
            const textElement = indicator.querySelector('.loading-text');
            if (textElement) textElement.textContent = message;
        }
    }

    function removeLoadingIndicator() {
        const existingIndicator = document.querySelector('.activity-graph-loading');
        if (existingIndicator) {
            existingIndicator.remove();
        }
    }

    // --- Caching ---
    /**
     * 从缓存获取处理后的雷达图数据。
     * @param {string} username 用户名
     * @returns {Object|null} 缓存数据或null
     */
    function getCachedRadarData(username) {
        const cacheKey = `${CACHE_PREFIX}${username}_radar_data_weighted`; // 修改缓存键名以区分权重版本
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION_MS) {
                    console.log('活动雷达图: 使用缓存的处理后数据 (权重版)', username);
                    return data;
                }
                console.log('活动雷达图: 缓存的处理后数据 (权重版) 已过期', username);
            }
        } catch (e) {
            console.error('活动雷达图: 读取处理后数据缓存错误 (权重版)', e);
            localStorage.removeItem(cacheKey); // 清除损坏的缓存
        }
        return null;
    }

    /**
     * 缓存处理后的雷达图数据。
     * @param {string} username 用户名
     * @param {Object} radarData 处理后的雷达图数据
     */
    function setCachedRadarData(username, radarData) {
        const cacheKey = `${CACHE_PREFIX}${username}_radar_data_weighted`; // 修改缓存键名以区分权重版本
        const itemToCache = {
            timestamp: Date.now(),
            data: radarData
        };
        try {
            localStorage.setItem(cacheKey, JSON.stringify(itemToCache));
            console.log('活动雷达图: 处理后数据已缓存 (权重版)', username);
        } catch (e) {
            console.error('活动雷达图: 设置处理后数据缓存错误 (权重版)', e);
            // 提示用户存储空间不足
            if (e.name === 'QuotaExceededError') {
                alert('提示：您的浏览器本地存储空间不足，活动图表数据可能无法完全缓存。');
            }
        }
    }

    /**
     * 获取原始用户活动数据。
     * @param {string} username 用户名
     * @param {HTMLElement} loadingIndicator 加载指示器DOM元素
     * @returns {Array|null} 原始用户活动数组
     */
    async function fetchAllRawData(username, loadingIndicator) {
        const limit = 10000;
        let retries = 0;

        while (retries <= MAX_RETRIES) {
            try {
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    updateLoadingMessage(loadingIndicator, `网络错误，正在重试... (第 ${retries} 次)`);
                } else {
                    updateLoadingMessage(loadingIndicator, `正在快速加载活动数据...`);
                }

                // filter=4 (topic_created), 5 (post_created)
                const response = await fetch(`https://linux.do/user_actions.json?offset=0&limit=${limit}&username=${username}&filter=4,5`);

                if (!response.ok) {
                    if (response.status === 429) {
                         throw new Error(`请求频率过高 (429)`);
                    }
                    throw new Error(`HTTP 错误: ${response.status}`);
                }

                const data = await response.json();
                if (data.user_actions) {
                    console.log(`活动雷达图: 一次性获取到 ${data.user_actions.length} 条原始活动数据.`);
                    return data.user_actions;
                } else {
                    throw new Error("API返回数据格式不正确。");
                }

            } catch (error) {
                console.error('活动雷达图: 获取原始数据失败', error);
                retries++;
                if (retries > MAX_RETRIES) {
                    throw new Error(`数据加载失败: ${error.message || '未知错误'}`);
                }
            }
        }
        return null;
    }

    /**
     * 处理活动数据，按时间范围和板块分类计数 (带权重)。
     * @param {Array} userActions - 用户活动数组
     * @returns {Object} 包含不同时间范围的板块活动计数的对象
     */
    function processRadarActivityData(userActions) {
        const now = Date.now();
        const last24HoursThreshold = getTimestampXHoursAgo(24);
        const last7DaysThreshold = getTimestampXDaysAgo(7);
        const last30DaysThreshold = getTimestampXDaysAgo(30);

        const counts = {
            '24h': {},
            '7d': {},
            '30d': {}
        };

        enabledCategories.forEach(catName => {
            counts['24h'][catName] = 0;
            counts['7d'][catName] = 0;
            counts['30d'][catName] = 0;
        });

        userActions.forEach(action => {
            const actionTime = new Date(action.created_at).getTime();
            const categoryName = categoryIdToNameMap.get(action.category_id);
            let score = 0; // 初始化分数为0

            if (categoryName) {
                // 根据 action_type 赋予不同的分数
                if (action.action_type === 4) { // 话题 (发帖)
                    score = ACTIVITY_WEIGHTS.TOPIC_CREATED;
                } else if (action.action_type === 5) { // 回帖 (回复)
                    score = ACTIVITY_WEIGHTS.POST_CREATED;
                }

                if (score > 0) { // 只有有分数的活动才会计入
                    if (actionTime >= last24HoursThreshold) {
                        counts['24h'][categoryName] += score;
                    }
                    if (actionTime >= last7DaysThreshold) {
                        counts['7d'][categoryName] += score;
                    }
                    if (actionTime >= last30DaysThreshold) {
                        counts['30d'][categoryName] += score;
                    }
                }
            }
        });
        return counts;
    }

    /**
     * 创建一个雷达图 (SVG)。
     * @param {string} title - 图表标题
     * @param {Object} data - 板块活动计数 { "板块名称": count }
     * @returns {HTMLElement} 雷达图的DOM元素
     */
    function createRadarChart(title, data) {
        const wrapper = document.createElement('div');
        wrapper.className = 'radar-chart-wrapper';

        const chartTitle = document.createElement('div');
        chartTitle.className = 'radar-chart-title';
        chartTitle.textContent = title;
        wrapper.appendChild(chartTitle);

        const svgWidth = 220;
        const svgHeight = 220;
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        const maxRadius = Math.min(centerX, centerY) * 0.7; // 最大半径，为标签留出空间

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
        svg.classList.add('radar-chart-svg');
        wrapper.appendChild(svg);

        // Define a gradient for the polygon fill
        const gradientId = `radarGradient-${Math.random().toString(36).substring(7)}`; // Unique ID
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
        linearGradient.setAttribute("id", gradientId);
        linearGradient.setAttribute("x1", "0%");
        linearGradient.setAttribute("y1", "0%");
        linearGradient.setAttribute("x2", "100%");
        linearGradient.setAttribute("y2", "100%");

        // Add gradient stops
        const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "rgba(0,190,255,0.6)"); // Starting color (bright blue)
        linearGradient.appendChild(stop1);

        const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "rgba(100,255,255,0.6)"); // Ending color (light cyan)
        linearGradient.appendChild(stop2);

        defs.appendChild(linearGradient);
        svg.appendChild(defs);

        // 绘制同心圆作为网格背景
        const numLevels = 4; // 减少刻度线数量，使图更清爽
        for (let i = 1; i <= numLevels; i++) {
            const radius = (maxRadius / numLevels) * i;
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", centerX);
            circle.setAttribute("cy", centerY);
            circle.setAttribute("r", radius);
            circle.classList.add('radar-grid-circle');
            svg.appendChild(circle);
        }

        // 绘制轴线和标签
        const numCategories = enabledCategories.length;
        const angleSlice = (Math.PI * 2) / numCategories; // 角度切片 (弧度)

        const maxDataValue = Math.max(...Object.values(data));
        const effectiveMaxDataValue = maxDataValue > 0 ? maxDataValue : 1;

        const scale = (value) => {
            return (value / effectiveMaxDataValue) * maxRadius;
        };


        let polygonPoints = []; // 用于存储多边形顶点的字符串

        enabledCategories.forEach((categoryName, i) => {
            const value = data[categoryName] || 0;
            const angle = angleSlice * i - Math.PI / 2; // 调整初始角度，让第一个轴线向上

            // 绘制轴线
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", centerX);
            line.setAttribute("y1", centerY);
            line.setAttribute("x2", centerX + maxRadius * Math.cos(angle));
            line.setAttribute("y2", centerY + maxRadius * Math.sin(angle));
            line.classList.add('radar-axis-line');
            svg.appendChild(line);

            // 计算多边形顶点
            const pointRadius = scale(value);
            const pointX = centerX + pointRadius * Math.cos(angle);
            const pointY = centerY + pointRadius * Math.sin(angle);
            polygonPoints.push(`${pointX},${pointY}`);

            // 绘制板块标签
            const labelDistance = maxRadius + 18; // 标签离中心更远一点，避免和图重叠
            const labelX = centerX + labelDistance * Math.cos(angle);
            const labelY = centerY + labelDistance * Math.sin(angle);

            const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textElement.setAttribute("x", labelX);
            textElement.setAttribute("y", labelY);
            textElement.classList.add('radar-category-label');
            textElement.textContent = categoryName;

            // 根据标签位置调整文本对齐
            if (Math.abs(angle - (-Math.PI / 2)) < 0.1 || Math.abs(angle - (3 * Math.PI / 2)) < 0.1) { // Top/Bottom
                textElement.style.textAnchor = "middle";
            } else if (angle > -Math.PI / 2 && angle < Math.PI / 2) { // Right side
                textElement.style.textAnchor = "start";
                textElement.setAttribute('dx', '0.5em');
            } else { // Left side
                textElement.style.textAnchor = "end";
                textElement.setAttribute('dx', '-0.5em');
            }
            svg.appendChild(textElement);
        });

        // 绘制填充多边形
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", polygonPoints.join(" "));
        polygon.classList.add('radar-polygon-fill');
        polygon.setAttribute("fill", `url(#${gradientId})`); // Use the defined gradient
        polygon.setAttribute("stroke", "rgba(0,255,255,0.7)"); // Bright cyan stroke
        polygon.setAttribute("stroke-width", "2"); // Thicker stroke for visibility
        svg.appendChild(polygon);


        // 添加图例
        const labelLegend = document.createElement('div');
        labelLegend.className = 'radar-label-legend';
        enabledCategories.forEach(catName => {
            const item = document.createElement('div');
            item.className = 'radar-label-item';
            item.innerHTML = `<span class="radar-label-color" style="background-color: ${categoryColors[catName]}"></span><span>${catName}: ${data[catName] || 0}</span>`;
            labelLegend.appendChild(item);
        });
        wrapper.appendChild(labelLegend);

        return wrapper;
    }

    // Function to check if URL matches pattern
    function isUserSummaryPage() {
        return window.location.pathname.match(/^\/u\/[^/]+\/summary$/);
    }

    // Function to remove existing graph and tooltip
    function cleanupPreviousGraph() {
        const existingGraphContainer = document.querySelector('.radar-graph-container');
        if (existingGraphContainer) {
            existingGraphContainer.remove();
        }
        removeLoadingIndicator();
    }

    // Function to wait for the #user-content element
    async function waitForUserContent(timeout = 5000) { // Add a timeout
        const startTime = Date.now();
        return new Promise(resolve => {
            const checkElement = () => {
                const userContent = document.querySelector('#user-content');
                if (userContent) {
                    console.log('活动雷达图: 发现 #user-content 元素。');
                    resolve(userContent);
                } else if (Date.now() - startTime > timeout) {
                    console.warn('活动雷达图: 超时未找到 #user-content 元素。');
                    resolve(null); // Resolve with null on timeout
                } else {
                    requestAnimationFrame(checkElement); // Continue checking
                }
            };
            requestAnimationFrame(checkElement);
        });
    }

    // Main function to initialize the graph
    async function init() {
        if (!isUserSummaryPage()) {
            cleanupPreviousGraph();
            return;
        }

        const usernameMatch = window.location.pathname.match(/^\/u\/([^/]+)\/summary$/);
        if (!usernameMatch || !usernameMatch[1]) {
            console.error('活动雷达图: 无法从URL中提取用户名。');
            return;
        }
        const username = usernameMatch[1];

        cleanupPreviousGraph(); // 清理旧图表和加载指示器

        const loadingIndicator = showLoadingIndicator(`正在为 ${username} 加载活动数据...`);
        // 尝试将加载指示器插入到 body，如果 #user-content 还没好，至少有加载提示
        document.body.appendChild(loadingIndicator);

        const userContent = await waitForUserContent(); // 等待 #user-content
        if (!userContent) {
            updateLoadingMessage(loadingIndicator, `页面内容加载超时，无法显示图表。`);
            const spinner = loadingIndicator.querySelector('.spinner');
            if (spinner) spinner.style.display = 'none';
            // 从 body 移除加载指示器，因为它已经显示错误信息了
            if (loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
            }
            return;
        }

        // 如果 userContent 找到了，把加载指示器移动到 userContent 里面
        // 只有当加载指示器还在 body 里的时候才移动，避免二次操作报错
        if (loadingIndicator.parentNode === document.body) {
            document.body.removeChild(loadingIndicator);
            userContent.prepend(loadingIndicator);
        }


        try {
            let radarData = getCachedRadarData(username);

            if (!radarData) { // 如果没有缓存或缓存过期
                const userActions = await fetchAllRawData(username, loadingIndicator);
                if (!userActions) {
                    throw new Error("未能获取到原始活动数据。");
                }
                radarData = processRadarActivityData(userActions);
                setCachedRadarData(username, radarData); // 缓存处理后的数据
            } else {
                updateLoadingMessage(loadingIndicator, `正在使用缓存数据显示图表...`);
            }

            // 确保 userContent 仍然存在且可用
            const currentUserContent = document.querySelector('#user-content');
            if (!currentUserContent) {
                 throw new Error("User content element disappeared during rendering.");
            }

            const radarGraphContainer = document.createElement('div');
            radarGraphContainer.className = 'radar-graph-container';

            const header = document.createElement('div');
            header.className = 'radar-graph-header';
            header.innerHTML = `<div class="radar-graph-title">【@${username}】板块活动雷达图</div>`;
            radarGraphContainer.appendChild(header);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'radar-graph-content';
            radarGraphContainer.appendChild(contentDiv);

            // 创建并添加不同时间范围的雷达图
            contentDiv.appendChild(createRadarChart('最近24小时', radarData['24h']));
            contentDiv.appendChild(createRadarChart('最近7天', radarData['7d']));
            contentDiv.appendChild(createRadarChart('最近30天', radarData['30d']));

            // 插入最终的图表容器
            currentUserContent.prepend(radarGraphContainer);

        } catch (error) {
            console.error('活动雷达图: 创建图表时发生错误:', error);
            if (loadingIndicator) updateLoadingMessage(loadingIndicator, `加载活动图失败: ${error.message}`);
            const spinner = loadingIndicator.querySelector('.spinner');
            if (spinner) spinner.style.display = 'none';
            return;
        } finally {
            // 无论成功失败，如果加载指示器还在DOM中，就移除它
            if (loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
            }
        }
    }

    // Initialize the graph on page load and URL changes
    let lastUrl = location.href;
    const urlChangeObserver = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('活动雷达图: URL变更，重新初始化。');
            init();
        }
    });

    urlChangeObserver.observe(document.body, { subtree: true, childList: true });

    init();

})();
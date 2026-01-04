// ==UserScript==
// @name         浏览器下雪效果(可折叠/开关/配置保存)
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在浏览器页面添加雪花飘落动画效果，并提供一个可折叠、带总开关的UI来控制雪花的颜色、数量和大小，支持配置保存。
// @author       shenmi
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542008/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8B%E9%9B%AA%E6%95%88%E6%9E%9C%28%E5%8F%AF%E6%8A%98%E5%8F%A0%E5%BC%80%E5%85%B3%E9%85%8D%E7%BD%AE%E4%BF%9D%E5%AD%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542008/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%8B%E9%9B%AA%E6%95%88%E6%9E%9C%28%E5%8F%AF%E6%8A%98%E5%8F%A0%E5%BC%80%E5%85%B3%E9%85%8D%E7%BD%AE%E4%BF%9D%E5%AD%98%29.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // --- 配置管理 ---
    const CONFIG_KEY = 'snowflake_config';
    const defaultConfig = {
        snowEnabled: true,
        color: '#ffffff',
        count: 100,
        size: 20,
        collapsed: false,
        positionX: 20,
        positionY: 20
    };

    let currentX = defaultConfig.positionX; // 初始化为默认配置位置
    let currentY = defaultConfig.positionY; // 初始化为默认配置位置

    let currentConfig = {};

    // --- 动态注入CSS动画 ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            from { transform: translateY(-10vh); }
            to { transform: translateY(110vh); }
        }

        @keyframes sway {
            0%, 100% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(40px); /* 减小了摇摆幅度，效果更柔和 */
            }
        }

        .fall-container {
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9999;
            will-change: transform;
            animation-name: fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }

        .snowflake {
            /* 使用字符替代div */
            color: #fff;
            font-family: "Arial", "sans-serif"; /* 确保字符能渲染 */
            will-change: transform, opacity;
            animation-name: sway;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
        }

        /* --- 控制器样式 --- */
        #snowflake-controls-container {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
            background-color: rgba(0, 0, 0, 0.65);
            border-radius: 8px;
            color: white;
            font-family: sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            will-change: transform;
            overflow: hidden; /* 配合折叠动画 */
        }
        #controls-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            cursor: move;
            user-select: none; /* 防止拖动时选中文本 */
        }
        #controls-header h3 { margin: 0; font-size: 15px; font-weight: 600; }
        #toggle-button { background: none; border: none; color: white; font-size: 16px; cursor: pointer; padding: 0 4px; line-height: 1; }
        #controls-body {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 4px 12px 12px 12px;
            max-height: 300px; /* 为动画提供初始高度 */
            transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
        }
        #snowflake-controls-container.collapsed #controls-body { max-height: 0; padding-top: 0; padding-bottom: 0; }
        .control-row { display: flex; align-items: center; justify-content: space-between; }
        .control-row label { width: 60px; text-align: right; margin-right: 10px; white-space: nowrap; font-size: 14px; }
        .control-row input[type="color"] { cursor: pointer; width: 40px; height: 25px; border: none; background: none; padding: 0; }
        .control-row input[type="range"] { cursor: pointer; width: 80px; }
        .control-row .value-display { min-width: 35px; text-align: right; font-size: 14px; }

        /* --- 开关样式 --- */
        .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 22px; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .slider { background-color: #4a6bff; }
        input:checked + .slider:before { transform: translateX(37px); }
    `;
    document.head.appendChild(style);

    // --- 创建控制器UI ---
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'snowflake-controls-container';
    controlsContainer.innerHTML = `
        <div id="controls-header">
            <h3>❄️ 雪花控制</h3>
            <button id="toggle-button">▲</button>
        </div>
        <div id="controls-body">
            <div class="control-row">
                <label for="snow-toggle-input">显示雪花:</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="snow-toggle-input">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="control-row">
                <label for="snowflake-color-input">颜色:</label>
                <input type="color" id="snowflake-color-input">
            </div>
            <div class="control-row">
                <label for="snowflake-count-input">数量:</label>
                <input type="range" id="snowflake-count-input" min="10" max="500">
                <span id="count-value" class="value-display"></span>
            </div>
            <div class="control-row">
                <label for="snowflake-size-input">大小:</label>
                <input type="range" id="snowflake-size-input" min="10" max="40">
                <span id="size-value" class="value-display"></span>
            </div>
        </div>
    `;
    document.body.appendChild(controlsContainer);

    // --- 获取UI元素 ---
    const controlsHeader = document.getElementById('controls-header');
    const toggleButton = document.getElementById('toggle-button');
    const snowToggleInput = document.getElementById('snow-toggle-input');
    const colorInput = document.getElementById('snowflake-color-input');
    const countInput = document.getElementById('snowflake-count-input');
    const countValue = document.getElementById('count-value');
    const sizeInput = document.getElementById('snowflake-size-input');
    const sizeValue = document.getElementById('size-value');
    const snowContainer = document.body;

    const saveConfig = () => {
        currentConfig = {
            snowEnabled: snowToggleInput.checked,
            color: colorInput.value,
            count: parseInt(countInput.value, 10),
            size: parseInt(sizeInput.value, 10),
            collapsed: controlsContainer.classList.contains('collapsed'),
            positionX: currentX,
            positionY: currentY
        };
        GM_setValue(CONFIG_KEY, currentConfig);
    };

    const loadConfig = async () => {
        currentConfig = await GM_getValue(CONFIG_KEY, defaultConfig);

        // 应用配置到UI
        snowToggleInput.checked = currentConfig.snowEnabled;
        colorInput.value = currentConfig.color;
        countInput.value = currentConfig.count;
        countValue.textContent = currentConfig.count;
        sizeInput.value = currentConfig.size;
        sizeValue.textContent = `${currentConfig.size}px`;

        if (currentConfig.collapsed) {
            controlsContainer.classList.add('collapsed');
            toggleButton.textContent = '▼';
        } else {
            controlsContainer.classList.remove('collapsed');
            toggleButton.textContent = '▲';
        }

        // 应用位置
        currentX = currentConfig.positionX;
        currentY = currentConfig.positionY;
        controlsContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;

        // 初始应用雪花效果
        applySnowflakeSettings();
    };

    // --- 折叠/展开逻辑 ---
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        controlsContainer.classList.toggle('collapsed');
        toggleButton.textContent = controlsContainer.classList.contains('collapsed') ? '▼' : '▲';
        saveConfig(); // 保存折叠状态
    });

    // --- 让控制器可拖动 (仅限头部) ---
    let isDragging = false;
    let startX, startY;
    let initialX, initialY;
    controlsHeader.addEventListener('mousedown', (e) => {
        if (e.target === toggleButton) return;
        e.preventDefault();
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        initialX = currentX; // 直接使用 currentX 作为初始位移
        initialY = currentY; // 直接使用 currentY 作为初始位移

        controlsHeader.style.cursor = 'grabbing';
        document.body.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            currentX = initialX + deltaX;
            currentY = initialY + deltaY;
            controlsContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            controlsHeader.style.cursor = 'move';
            document.body.style.cursor = 'default';
            saveConfig(); // 保存位置
        }
    });

    // --- 核心功能函数 ---
    const createSnowflake = () => {
        const faller = document.createElement('div');
        faller.className = 'fall-container';
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '&#10052;';
        snowflake.dataset.sizeFactor = Math.random();
        faller.appendChild(snowflake);
        snowContainer.appendChild(faller);
        const maxFallDuration = 18, minFallDuration = 8;
        const maxSwayDuration = 7, minSwayDuration = 3;
        const fallDuration = Math.random() * (maxFallDuration - minFallDuration) + minFallDuration;
        const swayDuration = Math.random() * (maxSwayDuration - minSwayDuration) + minSwayDuration;
        faller.style.left = `${Math.random() * 100}vw`;
        faller.style.animationDuration = `${fallDuration}s`;
        faller.style.animationDelay = `${Math.random() * 5}s`;
        snowflake.style.animationDuration = `${swayDuration}s`;
        snowflake.style.animationDelay = `${Math.random() * 3}s`;
        updateSnowflakeSize(snowflake, sizeInput.value);
        updateSnowflakeColor(snowflake, colorInput.value);
        return faller;
    };
    const updateSnowflakeColor = (flake, color) => {
        const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16);
        flake.style.color = color;
        flake.style.textShadow = `0 0 3px rgba(${r}, ${g}, ${b}, 0.9)`;
    };
    const updateSnowflakeSize = (flake, maxSize) => {
        const minSize = maxSize / 2;
        const sizeFactor = parseFloat(flake.dataset.sizeFactor);
        const size = sizeFactor * (maxSize - minSize) + minSize;
        flake.style.fontSize = `${size}px`;
        flake.style.opacity = sizeFactor * 0.7 + 0.3;
    };

    // --- 应用雪花设置 (初始化和配置加载后调用) ---
    const applySnowflakeSettings = () => {
        // 应用总开关状态
        const displayStyle = snowToggleInput.checked ? '' : 'none';
        document.querySelectorAll('.fall-container').forEach(flake => {
            flake.style.display = displayStyle;
        });

        // 应用数量
        const newCount = parseInt(countInput.value, 10);
        countValue.textContent = newCount;
        let currentFlakes = document.querySelectorAll('.fall-container');
        if (newCount > currentFlakes.length) {
            for (let i = 0; i < newCount - currentFlakes.length; i++) createSnowflake();
        } else {
            for (let i = 0; i < currentFlakes.length - newCount; i++) currentFlakes[i].remove();
        }

        // 应用颜色和大小 (会由各自的update函数处理)
        document.querySelectorAll('.snowflake').forEach(flake => {
            updateSnowflakeColor(flake, colorInput.value);
            updateSnowflakeSize(flake, sizeInput.value);
        });
    };

    // --- 事件监听 ---
    snowToggleInput.addEventListener('change', (e) => { applySnowflakeSettings(); saveConfig(); });
    colorInput.addEventListener('input', (e) => { document.querySelectorAll('.snowflake').forEach(flake => updateSnowflakeColor(flake, e.target.value)); saveConfig(); });
    countInput.addEventListener('input', (e) => { countValue.textContent = e.target.value; applySnowflakeSettings(); saveConfig(); });
    sizeInput.addEventListener('input', (e) => { sizeValue.textContent = `${e.target.value}px`; document.querySelectorAll('.snowflake').forEach(flake => updateSnowflakeSize(flake, e.target.value)); saveConfig(); });

    // --- 脚本初始化 ---
    await loadConfig();
})();
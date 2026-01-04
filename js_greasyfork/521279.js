// ==UserScript==
// @name         Reading Ruler 阅读标尺
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  A reading ruler tool to help focus while reading, with duplicate prevention
// @author       lumos momo
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/521279/Reading%20Ruler%20%E9%98%85%E8%AF%BB%E6%A0%87%E5%B0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521279/Reading%20Ruler%20%E9%98%85%E8%AF%BB%E6%A0%87%E5%B0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查全局标识,防止重复初始化
    if (window._readingRulerInitialized) {
        console.log('Reading Ruler already initialized');
        return;
    }

    // 检查已存在的元素
    if (document.querySelector('.reading-ruler') || document.querySelector('.ruler-control')) {
        console.log('Reading Ruler elements already exist, preventing duplicate initialization');
        return;
    }

    // 设置全局初始化标识
    window._readingRulerInitialized = true;

    // 默认设置
    const defaultSettings = {
        height: 30,           
        color: '#ffeb3b',     
        opacity: 0.3,         
        isEnabled: false,     
        isInverted: false,    
        position: { x: 20, y: '50%' }  
    };

    // 从存储中获取设置
    let settings = {
        ...defaultSettings,
        ...GM_getValue('rulerSettings', {})
    };

    // 确保只在根文档中添加样式和元素
    if (window.self !== window.top) {
        console.log('Skip initialization in iframe');
        return;
    }

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .reading-ruler {
            position: fixed;
            left: 0;
            width: 100%;
            height: ${settings.height}px;
            pointer-events: none;
            z-index: 2147483646;
            transition: top 0.1s ease;
            display: none;
        }

        .reading-ruler.normal {
            background-color: ${settings.color};
            opacity: ${settings.opacity};
        }

        .reading-ruler.inverted {
            background-color: transparent;
            box-shadow: 0 0 0 100vh ${settings.color};
            position: fixed;
            left: 0;
            right: 0;
            width: 100%;
        }

        .ruler-control {
            position: fixed;
            left: ${settings.position.x}px;
            top: ${settings.position.y};
            transform: translateY(-50%);
            z-index: 2147483647;
            cursor: move;
            user-select: none;
        }

        .ruler-toggle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: white;
            border: none;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
            font-size: 20px;
            font-weight: bold;
            color: #666;
        }

        .ruler-toggle:hover {
            background-color: #f5f5f5;
        }

        .ruler-toggle.active {
            background-color: #e3f2fd;
            color: #2196f3;
        }

        .ruler-settings {
            position: absolute;
            background: white;
            border-radius: 4px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
            width: 200px;
            max-height: 90vh;
            overflow-y: auto;
        }

        .ruler-settings.visible {
            display: block;
        }

        .ruler-settings.right {
            left: 100%;
            margin-left: 10px;
        }

        .ruler-settings.left {
            right: 100%;
            margin-right: 10px;
        }

        .ruler-settings.top {
            bottom: 100%;
            margin-bottom: 10px;
        }

        .ruler-settings.bottom {
            top: 100%;
            margin-top: 10px;
        }

        .ruler-settings label {
            display: block;
            margin: 10px 0;
            font-size: 14px;
        }

        .ruler-settings input {
            width: 100%;
            margin-top: 5px;
        }

        .ruler-settings .mode-switch {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 0;
            border-top: 1px solid #eee;
        }

        .ruler-settings .mode-switch span {
            flex-grow: 1;
            font-size: 14px;
        }

        .mode-switch-toggle {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }

        .mode-switch-toggle input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .mode-switch-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
        }

        .mode-switch-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        .mode-switch-toggle input:checked + .mode-switch-slider {
            background-color: #2196F3;
        }

        .mode-switch-toggle input:checked + .mode-switch-slider:before {
            transform: translateX(20px);
        }
    `;
    document.head.appendChild(style);

    // 创建标尺和控制元素函数
    function createRulerElements() {
        // 创建标尺元素并添加到根元素
        const ruler = document.createElement('div');
        ruler.className = 'reading-ruler';
        document.documentElement.appendChild(ruler);

        // 创建控制面板并添加到根元素
        const control = document.createElement('div');
        control.className = 'ruler-control';
        control.innerHTML = `
            <button class="ruler-toggle" id="toggleRuler">📏</button>
            <div class="ruler-settings">
                <label>
                    高度 (px):
                    <input type="range" id="rulerHeight" min="10" max="100" value="${settings.height}">
                    <span id="heightValue">${settings.height}</span>px
                </label>
                <label>
                    颜色:
                    <input type="color" id="rulerColor" value="${settings.color}">
                </label>
                <label>
                    透明度:
                    <input type="range" id="rulerOpacity" min="0" max="100" value="${settings.opacity * 100}">
                    <span id="opacityValue">${Math.round(settings.opacity * 100)}</span>%
                </label>
                <div class="mode-switch">
                    <span>反色模式</span>
                    <label class="mode-switch-toggle">
                        <input type="checkbox" id="toggleMode" ${settings.isInverted ? 'checked' : ''}>
                        <span class="mode-switch-slider"></span>
                    </label>
                </div>
            </div>
        `;
        document.documentElement.appendChild(control);

        return { ruler, control };
    }

    // 创建元素
    const { ruler, control } = createRulerElements();

    // 获取所有需要的元素
    const toggleButton = document.getElementById('toggleRuler');
    const modeSwitch = document.getElementById('toggleMode');
    const settingsPanel = control.querySelector('.ruler-settings');

    // 设置面板位置调整函数
    function adjustSettingsPanelPosition() {
        const controlRect = control.getBoundingClientRect();
        const settingsRect = settingsPanel.getBoundingClientRect();

        settingsPanel.classList.remove('right', 'left', 'top', 'bottom');

        if (controlRect.right + settingsRect.width + 10 <= window.innerWidth) {
            settingsPanel.classList.add('right');
        }
        else if (controlRect.left - settingsRect.width - 10 >= 0) {
            settingsPanel.classList.add('left');
        }
        else if (controlRect.bottom + settingsRect.height + 10 <= window.innerHeight) {
            settingsPanel.classList.add('bottom');
        }
        else {
            settingsPanel.classList.add('top');
        }
    }

    // 拖拽状态管理
    let dragState = {
        isDragging: false,
        startX: 0,
        startY: 0,
        startPosX: 0,
        startPosY: 0
    };

    // 显示通知提示
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 2147483647;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.documentElement.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 拖动相关函数
    function dragStart(e) {
        if (!e.target.closest('.ruler-toggle')) return;

        e.preventDefault();
        const rect = control.getBoundingClientRect();

        dragState.isDragging = true;
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.startPosX = rect.left;
        dragState.startPosY = rect.top;

        control.style.transition = 'none';
        control.style.transform = 'none';

        settingsPanel.classList.remove('visible');
    }

    function drag(e) {
        if (!dragState.isDragging) return;

        e.preventDefault();

        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;

        let newX = Math.max(0, Math.min(window.innerWidth - control.offsetWidth,
            dragState.startPosX + deltaX));
        let newY = Math.max(0, Math.min(window.innerHeight - control.offsetHeight,
            dragState.startPosY + deltaY));

        control.style.left = `${newX}px`;
        control.style.top = `${newY}px`;
    }

    function dragEnd(e) {
        if (!dragState.isDragging) return;

        dragState.isDragging = false;

        settings.position = {
            x: parseInt(control.style.left),
            y: control.style.top
        };
        saveSettings();

        control.style.transition = '';
    }

    // 设置相关函数
    function updateSettingsDisplay() {
        document.getElementById('heightValue').textContent = settings.height;
        document.getElementById('opacityValue').textContent = Math.round(settings.opacity * 100);
        ruler.style.height = `${settings.height}px`;
        updateRulerMode();
    }

    function updateRulerMode() {
        ruler.className = 'reading-ruler ' + (settings.isInverted ? 'inverted' : 'normal');
        if (!settings.isInverted) {
            ruler.style.backgroundColor = settings.color;
            ruler.style.opacity = settings.opacity;
            ruler.style.boxShadow = '';
        } else {
            ruler.style.backgroundColor = 'transparent';
            ruler.style.boxShadow = `0 0 0 100vh ${settings.color}`;
            ruler.style.opacity = settings.opacity;
        }
    }

    function saveSettings() {
        GM_setValue('rulerSettings', settings);
    }

    function updateDisplayMode() {
        ruler.style.display = settings.isEnabled ? 'block' : 'none';
        updateRulerMode();
    }

    function resetControlPosition() {
        if (control) {
            control.style.left = defaultSettings.position.x + 'px';
            control.style.top = defaultSettings.position.y;
            control.style.transform = 'translateY(-50%)';

            settings.position = {
                x: defaultSettings.position.x,
                y: defaultSettings.position.y
            };

            saveSettings();
            showNotification('按钮位置已重置');
        }
    }

    // 注册油猴脚本菜单命令
    GM_registerMenuCommand("打开设置面板", () => {
        settingsPanel.classList.add('visible');
        adjustSettingsPanelPosition();
    });

    GM_registerMenuCommand("重置按钮位置", resetControlPosition);

    // 事件监听器设置
    toggleButton.addEventListener('click', () => {
        settings.isEnabled = !settings.isEnabled;
        toggleButton.classList.toggle('active', settings.isEnabled);
        updateDisplayMode();
        saveSettings();
    });

    modeSwitch.addEventListener('change', (e) => {
        settings.isInverted = e.target.checked;
        updateDisplayMode();
        saveSettings();
    });

    toggleButton.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        settingsPanel.classList.toggle('visible');
        if (settingsPanel.classList.contains('visible')) {
            adjustSettingsPanelPosition();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.ruler-settings') && !e.target.closest('.ruler-toggle')) {
            settingsPanel.classList.remove('visible');
        }
    });

    // 拖动事件监听
    control.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    // 防止拖动时选中文本
    control.addEventListener('selectstart', (e) => {
        if (dragState.isDragging) {
            e.preventDefault();
        }
    });

    // 设置面板事件监听
    document.getElementById('rulerHeight').addEventListener('input', (e) => {
        settings.height = parseInt(e.target.value);
        updateSettingsDisplay();
        saveSettings();
    });

    document.getElementById('rulerColor').addEventListener('input', (e) => {
        settings.color = e.target.value;
        updateSettingsDisplay();
        saveSettings();
    });

    document.getElementById('rulerOpacity').addEventListener('input', (e) => {
        settings.opacity = parseInt(e.target.value) / 100;
        updateSettingsDisplay();
        saveSettings();
    });

    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // 鼠标移动时更新标尺位置
    document.addEventListener('mousemove', throttle((e) => {
        if (settings.isEnabled) {
            const y = e.clientY - (settings.height / 2);
            ruler.style.top = `${y}px`;
        }
    }, 16)); // 16ms 大约相当于 60fps

    // 监听窗口大小变化，调整设置面板位置
    window.addEventListener('resize', () => {
        if (settingsPanel.classList.contains('visible')) {
            adjustSettingsPanelPosition();
        }
    });

    // 添加 MutationObserver 以检测 DOM 变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // 检查是否有重复的标尺元素
                const rulers = document.querySelectorAll('.reading-ruler');
                const controls = document.querySelectorAll('.ruler-control');
                
                if (rulers.length > 1 || controls.length > 1) {
                    // 移除多余的元素
                    Array.from(rulers).slice(1).forEach(el => el.remove());
                    Array.from(controls).slice(1).forEach(el => el.remove());
                }
            }
        });
    });

    // 观察整个文档的变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 初始化显示状态
    if (settings.isEnabled) {
        toggleButton.classList.add('active');
        updateDisplayMode();
    }
})();
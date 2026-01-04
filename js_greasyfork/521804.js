// ==UserScript==
// @name         125论坛手机版优化
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  通过模拟小米10 Pro设备来优化125论坛移动端显示
// @author       Your name
// @match        https://bbs.125.la/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521804/125%E8%AE%BA%E5%9D%9B%E6%89%8B%E6%9C%BA%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/521804/125%E8%AE%BA%E5%9D%9B%E6%89%8B%E6%9C%BA%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从localStorage加载配置
    const savedConfig = localStorage.getItem('deviceEmulatorConfig');
    
    // 默认设备配置
    let DEVICE_CONFIG = savedConfig ? JSON.parse(savedConfig) : {
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Mi 10 Pro Build/RKQ1.200826.002) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36',
        width: 393,
        height: 851,
        deviceScaleFactor: 1.5
    };

    // 保存配置到localStorage
    function saveConfig() {
        localStorage.setItem('deviceEmulatorConfig', JSON.stringify(DEVICE_CONFIG));
    }

    // 修改应用更改按钮的处理函数
    function applyChanges(content) {
        DEVICE_CONFIG.width = parseInt(content.querySelector('#deviceWidth').value);
        DEVICE_CONFIG.height = parseInt(content.querySelector('#deviceHeight').value);
        DEVICE_CONFIG.deviceScaleFactor = parseFloat(content.querySelector('#deviceScale').value);
        saveConfig(); // 保存配置
        initialize(); // 重新初始化
    }

    // 创建悬浮窗
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'deviceControlPanel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9999;
            font-size: 14px;
            min-width: 40px;
            transition: all 0.3s;
        `;

        // 修改标题和展开按钮
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        `;
        header.innerHTML = `
            <span id="panelTitle" style="font-weight: bold; margin-right: 10px; display: none;">设备模拟控制面板</span>
            <button id="togglePanel" style="padding: 4px 8px; border: none; background: none; cursor: pointer;">⚙️</button>
        `;
        panel.appendChild(header);

        // 更新设备预设
        const presets = {
            mi10pro: {
                name: "小米10 Pro",
                width: 393,
                height: 851,
                deviceScaleFactor: 1.5
            },
            mi12s: {
                name: "小米12S",
                width: 390,
                height: 844,
                deviceScaleFactor: 1.5
            },
            mi13: {
                name: "小米13",
                width: 412,
                height: 915,
                deviceScaleFactor: 1.5
            },
            iphone14pro: {
                name: "iPhone 14 Pro",
                width: 430,
                height: 932,
                deviceScaleFactor: 1.5
            },
            iphone13: {
                name: "iPhone 13",
                width: 390,
                height: 844,
                deviceScaleFactor: 1.5
            },
            pixel7: {
                name: "Pixel 7",
                width: 412,
                height: 915,
                deviceScaleFactor: 1.5
            },
            galaxys23: {
                name: "Galaxy S23",
                width: 360,
                height: 800,
                deviceScaleFactor: 1.5
            },
            huaweip60: {
                name: "华为 P60",
                width: 412,
                height: 915,
                deviceScaleFactor: 1.5
            },
            oppo_find_x6: {
                name: "OPPO Find X6",
                width: 412,
                height: 918,
                deviceScaleFactor: 1.5
            },
            vivo_x90: {
                name: "vivo X90",
                width: 393,
                height: 851,
                deviceScaleFactor: 1.5
            }
        };

        // 创建内容区域
        const content = document.createElement('div');
        content.id = 'panelContent';
        content.style.display = 'none'; // 默认隐藏
        content.style.padding = '10px';
        content.innerHTML = `
            <div style="margin-bottom: 10px;">
                <label>宽度:</label>
                <input type="number" id="deviceWidth" value="${DEVICE_CONFIG.width}" style="width: 60px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label>高度:</label>
                <input type="number" id="deviceHeight" value="${DEVICE_CONFIG.height}" style="width: 60px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label>缩放比例:</label>
                <input type="number" id="deviceScale" value="${DEVICE_CONFIG.deviceScaleFactor}" step="0.1" style="width: 60px;">
            </div>
            <div style="margin-bottom: 10px;">
                <label>设备预设:</label>
                <select id="devicePreset" style="width: 120px;">
                    <option value="custom">自定义</option>
                    ${Object.entries(presets).map(([key, preset]) => 
                        `<option value="${key}">${preset.name}</option>`
                    ).join('')}
                </select>
            </div>
            <button id="applyChanges" style="width: 100%; padding: 5px;">应用更改</button>
        `;
        panel.appendChild(content);

        // 修改最小化功能
        const toggleBtn = panel.querySelector('#togglePanel');
        const content_div = panel.querySelector('#panelContent');
        const panelTitle = panel.querySelector('#panelTitle');
        let isMinimized = true; // 默认收起

        toggleBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            content_div.style.display = isMinimized ? 'none' : 'block';
            panelTitle.style.display = isMinimized ? 'none' : 'block';
            toggleBtn.textContent = isMinimized ? '⚙️' : '×';
            panel.style.minWidth = isMinimized ? '40px' : '200px';
            panel.style.padding = isMinimized ? '8px' : '15px';
        });

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
                panel.style.right = 'auto';
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        // 添加设备预设
        const presetSelect = content.querySelector('#devicePreset');
        presetSelect.addEventListener('change', () => {
            const preset = presets[presetSelect.value];
            if (preset) {
                content.querySelector('#deviceWidth').value = preset.width;
                content.querySelector('#deviceHeight').value = preset.height;
                content.querySelector('#deviceScale').value = preset.deviceScaleFactor;
            }
        });

        // 修改应用更改按钮的事件处理
        const applyBtn = content.querySelector('#applyChanges');
        applyBtn.addEventListener('click', () => {
            applyChanges(content);
        });

        // 设置预设选择框的初始值
        let currentPreset = 'custom';
        for (const [key, preset] of Object.entries(presets)) {
            if (preset.width === DEVICE_CONFIG.width &&
                preset.height === DEVICE_CONFIG.height &&
                preset.deviceScaleFactor === DEVICE_CONFIG.deviceScaleFactor) {
                currentPreset = key;
                break;
            }
        }
        presetSelect.value = currentPreset;

        document.body.appendChild(panel);
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // 模拟设备特性
    function emulateDevice() {
        // 只在第一次执行时修改User-Agent
        if (!window._userAgentModified) {
            Object.defineProperty(navigator, 'userAgent', {
                get: function() { return DEVICE_CONFIG.userAgent; }
            });
            window._userAgentModified = true;
        }

        // 修改设备属性
        try {
            Object.defineProperties(window.screen, {
                width: { value: DEVICE_CONFIG.width },
                height: { value: DEVICE_CONFIG.height },
                availWidth: { value: DEVICE_CONFIG.width  },//减去10px
                availHeight: { value: DEVICE_CONFIG.height  }
            });
        } catch(e) {
            console.log('Screen properties already defined');
        }
    }

    // 设置viewport
    function setupViewport() {
        const existingViewport = document.querySelector('meta[name="viewport"]');
        // 修改viewport内容，使用固定宽度
        const viewportContent = `width=${DEVICE_CONFIG.width}, initial-scale=1.0, user-scalable=yes`;

        if (existingViewport) {
            if (existingViewport.content !== viewportContent) {
                existingViewport.content = viewportContent;
            }
        } else {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = viewportContent;
            document.head.appendChild(viewport);
        }
    }

    // 添加页面宽度限制的CSS
    function addPageStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            html {
                overflow-x: hidden !important;
                width: 100% !important;
                font-size: 16px !important;
            }
            
            body {
                overflow-x: hidden !important;
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                position: relative !important;
                margin: 0 !important;
                padding: 0 !important;
                font-size: 16px !important;
                line-height: 1.6 !important;
            }

            #wp, #ct, .wp, .ct {
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
            }

            .container {
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 10px !important;
                box-sizing: border-box !important;
            }

            /* 设置字体大小 */
            .thread_tit, h3 {
                font-size: 18px !important;
                line-height: 1.4 !important;
                margin: 10px 0 !important;
            }

            p, div, span, a {
                font-size: 16px !important;
                line-height: 1.6 !important;
            }

            .f_count, .sub_forum {
                font-size: 14px !important;
            }

            img {
                max-width: 100% !important;
                height: auto !important;
            }

            /* 防止字体自动调整大小 */
            * {
                -webkit-text-size-adjust: none !important;
                text-size-adjust: none !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    // 修改初始化逻辑
    function initialize() {
        emulateDevice();
        setupViewport();
        addPageStyles(); // 添加页面样式
        
        // 确保DOM加载完成后再创建控制面板
        if (document.readyState === 'complete') {
            if (!document.querySelector('#deviceControlPanel')) {
                setTimeout(createControlPanel, 500);
            }
        } else {
            window.addEventListener('load', () => {
                if (!document.querySelector('#deviceControlPanel')) {
                    setTimeout(createControlPanel, 500);
                }
            });
        }
    }

    // 初始执行
    initialize();

    // 监听viewport变化
    const observer = new MutationObserver((mutations) => {
        let needsUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                needsUpdate = true;
            }
        });
        if (needsUpdate) {
            debouncedSetupViewport();
        }
    });

    // 延迟启动观察器
    setTimeout(() => {
        observer.observe(document.head, {
            childList: true,
            subtree: true
        });
    }, 1000);

    // 清理函数
    window.addEventListener('unload', () => {
        observer.disconnect();
    });

    // 使用防抖处理viewport变化
    const debouncedSetupViewport = debounce(setupViewport, 100);

})(); 
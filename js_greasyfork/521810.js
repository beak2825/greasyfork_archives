// ==UserScript==
// @name         设备模拟器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  模拟各种设备的 UA 和屏幕参数
// @author       Your name
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521810/%E8%AE%BE%E5%A4%87%E6%A8%A1%E6%8B%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521810/%E8%AE%BE%E5%A4%87%E6%A8%A1%E6%8B%9F%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 如果存在保存的设置，立即应用
    const savedSettings = GM_getValue('deviceSettings', null);
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            applySettings(settings);
        } catch (e) {
            console.error('加载初始设置失败:', e);
        }
    }

    // 预设设备列表
    const presetDevices = {
        'iPhone 13': {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            width: 390,
            height: 844,
            deviceScaleFactor: 3
        },
        'Pixel 5': {
            userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
            width: 393,
            height: 851,
            deviceScaleFactor: 2.75
        },
        'iPad Pro': {
            userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            width: 1024,
            height: 1366,
            deviceScaleFactor: 2
        }
    };

    // 创建悬浮窗
    function createFloatingWindow() {
        const container = document.createElement('div');
        container.innerHTML = `
            <div id="device-simulator" style="position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 9999; box-shadow: 0 0 10px rgba(0,0,0,0.1); min-width: 200px;">
                <div id="simulator-header" style="cursor: move; padding: 5px; background: #f0f0f0; margin-bottom: 10px;">
                    <span>设备模拟器</span>
                    <button id="toggle-simulator" style="float: right;">收起</button>
                </div>
                <div id="simulator-content">
                    <select id="device-select" style="width: 100%; margin-bottom: 10px;">
                        <option value="">选择设备</option>
                        ${Object.keys(presetDevices).map(device => `<option value="${device}">${device}</option>`).join('')}
                    </select>
                    <div style="margin-bottom: 10px;">
                        <label>User Agent:</label>
                        <textarea id="ua-input" style="width: 100%; height: 60px;"></textarea>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>屏幕宽度:</label>
                        <input type="number" id="width-input" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>屏幕高度:</label>
                        <input type="number" id="height-input" style="width: 100%;">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label>设备像素比:</label>
                        <input type="number" id="scale-input" style="width: 100%;" step="0.01">
                    </div>
                    <button id="apply-settings" style="width: 100%;">应用设置</button>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        return container;
    }

    // 初始化拖拽功能
    function initializeDrag(container) {
        const header = container.querySelector('#simulator-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - container.offsetLeft;
            initialY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                container.style.left = currentX + 'px';
                container.style.top = currentY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 初始化事件监听
    function initializeEvents(container) {
        const toggleBtn = container.querySelector('#toggle-simulator');
        const content = container.querySelector('#simulator-content');
        const deviceSelect = container.querySelector('#device-select');
        const uaInput = container.querySelector('#ua-input');
        const widthInput = container.querySelector('#width-input');
        const heightInput = container.querySelector('#height-input');
        const scaleInput = container.querySelector('#scale-input');
        const applyBtn = container.querySelector('#apply-settings');

        // 加载保存的设置
        const savedSettings = GM_getValue('deviceSettings', null);
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                uaInput.value = settings.userAgent || '';
                widthInput.value = settings.width || '';
                heightInput.value = settings.height || '';
                scaleInput.value = settings.deviceScaleFactor || '';
                // 立即应用保存的设置
                applySettings(settings);
            } catch (e) {
                console.error('加载设置失败:', e);
            }
        }

        // 切换显示/隐藏
        toggleBtn.addEventListener('click', () => {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleBtn.textContent = '收起';
            } else {
                content.style.display = 'none';
                toggleBtn.textContent = '展开';
            }
        });

        // 选择预设设备
        deviceSelect.addEventListener('change', () => {
            const device = presetDevices[deviceSelect.value];
            if (device) {
                uaInput.value = device.userAgent;
                widthInput.value = device.width;
                heightInput.value = device.height;
                scaleInput.value = device.deviceScaleFactor;
            }
        });

        // 应用设置
        applyBtn.addEventListener('click', () => {
            const settings = {
                userAgent: uaInput.value,
                width: parseInt(widthInput.value) || window.innerWidth,
                height: parseInt(heightInput.value) || window.innerHeight,
                deviceScaleFactor: parseFloat(scaleInput.value) || window.devicePixelRatio
            };
            
            try {
                GM_setValue('deviceSettings', JSON.stringify(settings));
                applySettings(settings);
                console.log('设置已保存');
            } catch (e) {
                console.error('保存设置失败:', e);
            }
        });
    }

    // 应用设备设置
    function applySettings(settings) {
        try {
            // 修改 User Agent
            Object.defineProperty(navigator, 'userAgent', {
                get: function() {
                    return settings.userAgent || navigator.userAgent;
                },
                configurable: true
            });

            // 修改屏幕参数
            const screenProps = {
                width: settings.width,
                height: settings.height,
                availWidth: settings.width,
                availHeight: settings.height
            };

            // 修改 window 属性
            Object.defineProperties(window, {
                'innerWidth': { 
                    value: settings.width,
                    configurable: true,
                    writable: true
                },
                'outerWidth': { 
                    value: settings.width,
                    configurable: true,
                    writable: true
                },
                'innerHeight': { 
                    value: settings.height,
                    configurable: true,
                    writable: true
                },
                'outerHeight': { 
                    value: settings.height,
                    configurable: true,
                    writable: true
                },
                'devicePixelRatio': { 
                    value: settings.deviceScaleFactor,
                    configurable: true,
                    writable: true
                }
            });

            // 修改 screen 属性
            Object.defineProperties(screen, {
                'width': { 
                    value: screenProps.width,
                    configurable: true,
                    writable: true
                },
                'height': { 
                    value: screenProps.height,
                    configurable: true,
                    writable: true
                },
                'availWidth': { 
                    value: screenProps.availWidth,
                    configurable: true,
                    writable: true
                },
                'availHeight': { 
                    value: screenProps.availHeight,
                    configurable: true,
                    writable: true
                }
            });

            // 设置 viewport
            const viewportContent = `width=${settings.width}, initial-scale=1.0, user-scalable=yes, maximum-scale=1.0`;
            let viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.content = viewportContent;
            } else {
                viewport = document.createElement('meta');
                viewport.name = 'viewport';
                viewport.content = viewportContent;
                document.head.appendChild(viewport);
            }

            // 添加强制样式
            const styleId = 'device-simulator-styles';
            let styleSheet = document.getElementById(styleId);
            if (!styleSheet) {
                styleSheet = document.createElement('style');
                styleSheet.id = styleId;
                document.head.appendChild(styleSheet);
            }
            
            styleSheet.textContent = `
                :root {
                    --device-width: ${settings.width}px;
                }
                
                html, body {
                    overflow-x: hidden !important;
                    width: var(--device-width) !important;
                    min-width: var(--device-width) !important;
                    max-width: var(--device-width) !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                
                body > * {
                    max-width: var(--device-width) !important;
                }

                img {
                    max-width: 100% !important;
                    height: auto !important;
                }

                * {
                    -webkit-text-size-adjust: none !important;
                    text-size-adjust: none !important;
                    box-sizing: border-box !important;
                }
            `;

            // 触发重绘事件
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('orientationchange'));
            
            // 强制重新计算布局
            document.documentElement.style.zoom = '99.99999%';
            setTimeout(() => {
                document.documentElement.style.zoom = '100%';
            }, 10);

        } catch (e) {
            console.error('应用设置失败:', e);
        }
    }

    // 初始化
    const container = createFloatingWindow();
    initializeDrag(container);
    initializeEvents(container);
    
    // 默认收起状态
    container.querySelector('#simulator-content').style.display = 'none';
    container.querySelector('#toggle-simulator').textContent = '展开';
})();

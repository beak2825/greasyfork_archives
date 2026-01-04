// ==UserScript==
// @name         智能护眼模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据时间自动调整页面亮度和色温，支持手动调节
// @author       Trae AI Assistant
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543382/%E6%99%BA%E8%83%BD%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/543382/%E6%99%BA%E8%83%BD%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        autoMode: true,
        brightness: 100,
        blueLight: 0,
        contrast: 100,
        nightModeStart: 20, // 晚上8点
        nightModeEnd: 6,    // 早上6点
        nightBrightness: 70,
        nightBlueLight: 50
    };

    // 获取配置
    function getConfig() {
        const saved = GM_getValue('eyeProtectionConfig', JSON.stringify(defaultConfig));
        return JSON.parse(saved);
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue('eyeProtectionConfig', JSON.stringify(config));
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'eye-protection-panel';
        panel.innerHTML = `
            <div class="ep-header">
                <span>👁️ 护眼模式</span>
                <button id="ep-toggle">×</button>
            </div>
            <div class="ep-content">
                <div class="ep-item">
                    <label>
                        <input type="checkbox" id="ep-auto"> 自动模式
                    </label>
                </div>
                <div class="ep-item">
                    <label>亮度: <span id="ep-brightness-val">100</span>%</label>
                    <input type="range" id="ep-brightness" min="20" max="100" value="100">
                </div>
                <div class="ep-item">
                    <label>蓝光过滤: <span id="ep-bluelight-val">0</span>%</label>
                    <input type="range" id="ep-bluelight" min="0" max="80" value="0">
                </div>
                <div class="ep-item">
                    <label>对比度: <span id="ep-contrast-val">100</span>%</label>
                    <input type="range" id="ep-contrast" min="50" max="150" value="100">
                </div>
                <div class="ep-item">
                    <button id="ep-reset">重置</button>
                    <button id="ep-preset-night">夜间模式</button>
                </div>
            </div>
        `;

        // 添加样式
        GM_addStyle(`
            #eye-protection-panel {
                position: fixed;
                top: 50px;
                right: 20px;
                width: 280px;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                backdrop-filter: blur(10px);
                transform: translateX(300px);
                transition: transform 0.3s ease;
            }
            
            #eye-protection-panel.show {
                transform: translateX(0);
            }
            
            .ep-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 8px 8px 0 0;
                font-weight: 500;
            }
            
            #ep-toggle {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .ep-content {
                padding: 16px;
            }
            
            .ep-item {
                margin-bottom: 16px;
            }
            
            .ep-item label {
                display: block;
                margin-bottom: 6px;
                font-size: 14px;
                font-weight: 500;
                color: #333;
            }
            
            .ep-item input[type="range"] {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: #ddd;
                outline: none;
                -webkit-appearance: none;
            }
            
            .ep-item input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #667eea;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .ep-item button {
                padding: 8px 16px;
                margin-right: 8px;
                border: none;
                border-radius: 4px;
                background: #667eea;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }
            
            .ep-item button:hover {
                background: #5a67d8;
            }
            
            #ep-reset {
                background: #718096 !important;
            }
            
            #ep-preset-night {
                background: #553c9a !important;
            }
        `);

        document.body.appendChild(panel);
        return panel;
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'eye-protection-btn';
        button.innerHTML = '👁️';
        
        GM_addStyle(`
            #eye-protection-btn {
                position: fixed;
                top: 50px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            #eye-protection-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            }
        `);
        
        document.body.appendChild(button);
        return button;
    }

    // 应用滤镜效果
    function applyFilters(brightness, blueLight, contrast) {
        const filterId = 'eye-protection-filter';
        let filterElement = document.getElementById(filterId);
        
        if (!filterElement) {
            filterElement = document.createElement('div');
            filterElement.id = filterId;
            document.body.appendChild(filterElement);
        }
        
        // 计算滤镜值
        const brightnessVal = brightness / 100;
        const sepiaVal = blueLight / 100;
        const contrastVal = contrast / 100;
        
        GM_addStyle(`
            html {
                filter: brightness(${brightnessVal}) sepia(${sepiaVal}) contrast(${contrastVal}) !important;
                transition: filter 0.3s ease !important;
            }
        `);
    }

    // 获取当前时间是否为夜间
    function isNightTime(config) {
        const now = new Date().getHours();
        return now >= config.nightModeStart || now < config.nightModeEnd;
    }

    // 自动调整设置
    function autoAdjust(config) {
        if (!config.autoMode) return;
        
        if (isNightTime(config)) {
            applyFilters(config.nightBrightness, config.nightBlueLight, config.contrast);
        } else {
            applyFilters(config.brightness, config.blueLight, config.contrast);
        }
    }

    // 初始化
    function init() {
        const config = getConfig();
        const floatingBtn = createFloatingButton();
        const panel = createControlPanel();
        let panelVisible = false;
        
        // 悬浮按钮点击事件
        floatingBtn.addEventListener('click', () => {
            panelVisible = !panelVisible;
            panel.classList.toggle('show', panelVisible);
        });
        
        // 面板控制事件
        const autoCheckbox = document.getElementById('ep-auto');
        const brightnessSlider = document.getElementById('ep-brightness');
        const bluelightSlider = document.getElementById('ep-bluelight');
        const contrastSlider = document.getElementById('ep-contrast');
        const resetBtn = document.getElementById('ep-reset');
        const nightBtn = document.getElementById('ep-preset-night');
        const toggleBtn = document.getElementById('ep-toggle');
        
        // 初始化界面
        autoCheckbox.checked = config.autoMode;
        brightnessSlider.value = config.brightness;
        bluelightSlider.value = config.blueLight;
        contrastSlider.value = config.contrast;
        
        // 更新数值显示
        function updateValues() {
            document.getElementById('ep-brightness-val').textContent = brightnessSlider.value;
            document.getElementById('ep-bluelight-val').textContent = bluelightSlider.value;
            document.getElementById('ep-contrast-val').textContent = contrastSlider.value;
        }
        updateValues();
        
        // 应用当前设置
        function applyCurrentSettings() {
            const newConfig = {
                ...config,
                autoMode: autoCheckbox.checked,
                brightness: parseInt(brightnessSlider.value),
                blueLight: parseInt(bluelightSlider.value),
                contrast: parseInt(contrastSlider.value)
            };
            
            if (newConfig.autoMode) {
                autoAdjust(newConfig);
            } else {
                applyFilters(newConfig.brightness, newConfig.blueLight, newConfig.contrast);
            }
            
            saveConfig(newConfig);
            Object.assign(config, newConfig);
        }
        
        // 事件绑定
        autoCheckbox.addEventListener('change', applyCurrentSettings);
        
        [brightnessSlider, bluelightSlider, contrastSlider].forEach(slider => {
            slider.addEventListener('input', () => {
                updateValues();
                applyCurrentSettings();
            });
        });
        
        resetBtn.addEventListener('click', () => {
            autoCheckbox.checked = defaultConfig.autoMode;
            brightnessSlider.value = defaultConfig.brightness;
            bluelightSlider.value = defaultConfig.blueLight;
            contrastSlider.value = defaultConfig.contrast;
            updateValues();
            applyCurrentSettings();
        });
        
        nightBtn.addEventListener('click', () => {
            autoCheckbox.checked = false;
            brightnessSlider.value = 70;
            bluelightSlider.value = 50;
            contrastSlider.value = 90;
            updateValues();
            applyCurrentSettings();
        });
        
        toggleBtn.addEventListener('click', () => {
            panelVisible = false;
            panel.classList.remove('show');
        });
        
        // 初始应用设置
        if (config.autoMode) {
            autoAdjust(config);
        } else {
            applyFilters(config.brightness, config.blueLight, config.contrast);
        }
        
        // 定时检查自动模式
        setInterval(() => {
            if (config.autoMode) {
                autoAdjust(config);
            }
        }, 60000); // 每分钟检查一次
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
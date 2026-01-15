    // ==UserScript==
    // @name         网页背景调节器
    // @namespace    http://tampermonkey.net/
    // @version      1.72.4
    // @description  调整网页下方背景的透明度、颜色遮罩、模糊度，并支持上传本地图片作为背景。优化 UI 美观性并按域名单独记忆设置，反转遮罩透明度逻辑，支持自定义默认配置，重置恢复页面原始状态，Dark 模式下 UI 面板背景变黑，添加中英文切换，修复百分比更新、卡顿、元素错位、关闭按钮失效问题，保存默认配置时应用到所有网站。
    // @author       wwdboy-modifided from Grey333
    // @match        *://*/*
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_listValues
    // @grant        GM_deleteValue
    // @license      MIT
    // @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/532495/%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%B0%83%E8%8A%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532495/%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%B0%83%E8%8A%82%E5%99%A8.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        // 原始默认设置
        const defaultSettings = {
            transparency: 0.8,
            blur: 0,
            overlayColor: 'transparent',
            overlayOpacity: 0,
            forceMode: true,
            disableOnThisPage: false,
            backgroundImage: null,
            theme: 'light',
            language: 'zh'
        };
     
        // 按域名加载当前页面设置
        const domainKey = `settings_${location.hostname}`;
        let settings = JSON.parse(GM_getValue(domainKey, JSON.stringify(defaultSettings)));
        if (!settings.language) settings.language = 'zh';
     
        // 全局存储自定义默认配置
        const customDefaultKey = 'customDefaultSettings';
        let customDefaultSettings = JSON.parse(GM_getValue(customDefaultKey, null));
        if (!customDefaultSettings) {
            customDefaultSettings = { ...defaultSettings };
            GM_setValue(customDefaultKey, JSON.stringify(customDefaultSettings));
        }
     
        // 如果该页面不生效，直接返回
        GM_registerMenuCommand(settings.disableOnThisPage ? '恢复脚本在此页面生效' : '在此页面禁用脚本', () => {
            settings.disableOnThisPage = !settings.disableOnThisPage;
            GM_setValue(domainKey, JSON.stringify(settings));
            location.reload();
        });
     
        GM_registerMenuCommand('打开背景调节器', () => {
            if (!settings.disableOnThisPage) {
                panel.style.display = 'block';
            }
        });
     
        if (settings.disableOnThisPage) {
            return;
        }
     
        // 创建样式元素
        const style = document.createElement('style');
        style.id = 'background-adjuster-style';
        document.head.appendChild(style);
     
        // 设置初始 CSS 变量
        function applySettings() {
            document.body.style.setProperty('--base-transparency', 1 - settings.transparency);
            document.body.style.setProperty('--base-blur', settings.blur === 0 ? 'none' : `blur(${settings.blur}px)`);
            document.body.style.setProperty('--overlay-color', settings.overlayColor);
            document.body.style.setProperty('--overlay-opacity', 1 - settings.overlayOpacity);
        }
     
        // 添加默认背景层
        const bgLayer = document.createElement('div');
        bgLayer.id = 'background-layer';
        bgLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1000;
            background: ${settings.theme === 'dark' ? '#000000' : '#ffffff'};
            opacity: var(--base-transparency);
            filter: var(--base-blur);
            pointer-events: none;
        `;
        document.body.insertBefore(bgLayer, document.body.firstChild);
     
        // 添加颜色遮罩层
        const overlayLayer = document.createElement('div');
        overlayLayer.id = 'overlay-layer';
        overlayLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -999;
            background: var(--overlay-color);
            opacity: var(--overlay-opacity);
            pointer-events: none;
        `;
        document.body.insertBefore(overlayLayer, document.body.firstChild.nextSibling);
     
        // 中英文文本映射表
        const textMap = {
            zh: {
                title: '背景调节器',
                transparency: '透明度',
                blur: '模糊度',
                overlayColor: '颜色遮罩',
                overlayOpacity: '遮罩透明度',
                backgroundImage: '背景图片',
                forceMode: '强制模式',
                theme: '主题',
                language: '语言',
                saveDefault: '保存为默认配置',
                applyDefault: '应用默认配置',
                reset: '重置',
                close: '关闭'
            },
            en: {
                title: 'Background Adjuster',
                transparency: 'Transparency',
                blur: 'Blur',
                overlayColor: 'Overlay Color',
                overlayOpacity: 'Overlay Opacity',
                backgroundImage: 'Background Image',
                forceMode: 'Force Mode',
                theme: 'Theme',
                language: 'Language',
                saveDefault: 'Save as Default',
                applyDefault: 'Apply Default',
                reset: 'Reset',
                close: 'Close'
            }
        };
     
        // 添加优化后的 CSS 样式
        style.textContent = `
            #background-layer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -1000;
                opacity: var(--base-transparency);
                filter: var(--base-blur);
                pointer-events: none;
            }
            #overlay-layer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: -999;
                background: var(--overlay-color);
                opacity: var(--overlay-opacity);
                pointer-events: none;
            }
            #bg-adjuster-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${settings.theme === 'dark' ? '#000000' : '#fafafa'};
                border: none;
                padding: 25px;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                z-index: 10000;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
                width: 300px;
                max-height: 85vh;
                overflow-y: auto;
                color: ${settings.theme === 'dark' ? '#ffffff' : '#333'};
            }
            #bg-adjuster-panel label {
                display: flex;
                align-items: center;
                margin: 15px 0;
                font-size: 14px;
                color: ${settings.theme === 'dark' ? '#ffffff' : '#333'};
            }
            #bg-adjuster-panel input[type="range"] {
                flex: 1;
                margin: 0 10px;
                height: 10px;
                border-radius: 8px;
                position: relative;
                outline: none;
                cursor: pointer;
                appearance: none;
            }
            #bg-adjuster-panel input[type="range"]::-webkit-slider-runnable-track {
                height: 10px;
                border-radius: 8px;
            }
            #bg-adjuster-panel input[type="range"]::-moz-range-track {
                height: 10px;
                border-radius: 8px;
            }
            #bg-adjuster-panel input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid ${settings.theme === 'dark' ? '#000000' : '#fff'};
                cursor: pointer;
                box-shadow: 0 3px 8px rgba(0,0,0,0.2);
                margin-top: -5px;
                background: ${settings.theme === 'dark' ? '#ffffff' : '#4a90e2'};
            }
            #bg-adjuster-panel input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid ${settings.theme === 'dark' ? '#000000' : '#fff'};
                cursor: pointer;
                box-shadow: 0 3px 8px rgba(0,0,0,0.2);
                background: ${settings.theme === 'dark' ? '#ffffff' : '#4a90e2'};
            }
            #bg-adjuster-panel .percentage {
                width: 40px;
                text-align: right;
                font-size: 12px;
                color: ${settings.theme === 'dark' ? '#cccccc' : '#666'};
            }
            #bg-adjuster-panel .color-btn {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                border: 2px solid ${settings.theme === 'dark' ? '#ffffff' : '#ddd'};
                cursor: pointer;
                margin-right: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            #bg-adjuster-panel .color-btn:hover {
                transform: scale(1.15);
                box-shadow: 0 0 6px rgba(0,0,0,0.3);
            }
            #bg-adjuster-panel .color-btn:active {
                transform: scale(1.05);
                box-shadow: 0 0 8px rgba(0,0,0,0.4);
            }
            #bg-adjuster-panel #custom-color {
                width: 40px;
                height: 40px;
                padding: 0;
                border: 2px solid ${settings.theme === 'dark' ? '#ffffff' : '#ddd'};
                border-radius: 12px;
                cursor: pointer;
                margin-left: auto;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            #bg-adjuster-panel button {
                padding: 8px 14px;
                cursor: pointer;
                border-radius: 10px;
                border: none;
                font-size: 14px;
                transition: background 0.2s;
            }
            #bg-image-label {
                display: block;
                margin: 15px 0;
                font-size: 14px;
            }
            #bg-image-label input[type="file"] {
                width: 100%;
                font-size: 12px;
                margin-top: 8px;
                padding: 6px;
                border: 1px solid ${settings.theme === 'dark' ? '#ffffff' : '#ddd'};
                border-radius: 8px;
                background: ${settings.theme === 'dark' ? '#333333' : '#fff'};
                color: ${settings.theme === 'dark' ? '#ffffff' : '#333'};
            }
            #overlay-opacity-section {
                display: none;
            }
            #force-mode-label, #theme-label, #language-label {
                font-size: 12px;
                color: ${settings.theme === 'dark' ? '#ffffff' : '#333'};
            }
            #theme-container {
                position: absolute;
                top: 10px;
                left: 10px;
                display: flex;
                align-items: center;
            }
            #language-container {
                position: absolute;
                top: 10px;
                right: 10px;
                display: flex;
                align-items: center;
            }
            #theme-select, #language-select {
                margin-left: 5px;
                padding: 3px;
                border-radius: 5px;
                font-size: 12px;
                background: ${settings.theme === 'dark' ? '#333333' : '#fff'};
                color: ${settings.theme === 'dark' ? '#ffffff' : '#333'};
                border: 1px solid ${settings.theme === 'dark' ? '#ffffff' : '#ddd'};
            }
        `;
     
        // 创建 UI 面板
        const panel = document.createElement('div');
        panel.id = 'bg-adjuster-panel';
        document.body.appendChild(panel);
     
        // UI 面板初始内容
        panel.innerHTML = `
            <div id="theme-container">
                <label id="theme-label">主题:
                    <select id="theme-select">
                        <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                    </select>
                </label>
            </div>
            <div id="language-container">
                <label id="language-label">语言:
                    <select id="language-select">
                        <option value="zh" ${settings.language === 'zh' ? 'selected' : ''}>中文</option>
                        <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </label>
            </div>
            <h3 style="margin: 20px 0; font-size: 16px; text-align: center; color: ${settings.theme === 'dark' ? '#ffffff' : '#333'};">背景调节器</h3>
            <label id="transparency-label">透明度: <input type="range" min="0" max="1" step="0.01" id="transparency-slider" value="${settings.transparency}"><span class="percentage">${Math.round(settings.transparency * 100)}%</span></label>
            <label id="blur-label">模糊度: <input type="range" min="0" max="20" step="1" id="blur-slider" value="${settings.blur}"><span class="percentage">${Math.round((settings.blur / 20) * 100)}%</span></label>
            <div id="color-overlay-section">
                <label id="overlay-color-label" style="display: flex; align-items: center;">颜色遮罩:
                    <button class="color-btn" id="none-btn" title="无"></button>
                    <button class="color-btn" id="yellow-btn" title="黄色"></button>
                    <button class="color-btn" id="green-btn" title="绿色"></button>
                    <input type="color" id="custom-color" value="${settings.overlayColor === 'transparent' ? '#ffffff' : settings.overlayColor}" title="自定义颜色">
                </label>
            </div>
            <div id="overlay-opacity-section">
                <label id="overlay-opacity-label">遮罩透明度: <input type="range" min="0" max="1" step="0.01" id="overlay-opacity" value="${settings.overlayOpacity}"><span class="percentage">${Math.round(settings.overlayOpacity * 100)}%</span></label>
            </div>
            <label id="bg-image-label">背景图片:<input type="file" id="bg-image-input" accept="image/*"></label>
            <label id="force-mode-label" style="display: flex; align-items: center;">强制模式:
                <input type="checkbox" id="force-mode-switch" ${settings.forceMode ? 'checked' : ''}>
            </label>
            <button id="save-default-btn" style="width: 100%; margin-top: 15px; background: #28a745; color: white;">保存为默认配置</button>
            <button id="apply-default-btn" style="width: 100%; margin-top: 10px; background: #17a2b8; color: white;">应用默认配置</button>
            <button id="reset-btn" style="width: 100%; margin-top: 10px;">重置</button>
            <button id="close-btn" style="width: 100%; margin-top: 10px;">关闭</button>
        `;
     
        // 获取 UI 元素
        const transparencySlider = document.getElementById('transparency-slider');
        const blurSlider = document.getElementById('blur-slider');
        const noneBtn = document.getElementById('none-btn');
        const yellowBtn = document.getElementById('yellow-btn');
        const greenBtn = document.getElementById('green-btn');
        const customColor = document.getElementById('custom-color');
        const overlayOpacity = document.getElementById('overlay-opacity');
        const overlayOpacitySection = document.getElementById('overlay-opacity-section');
        const bgImageInput = document.getElementById('bg-image-input');
        const saveDefaultBtn = document.getElementById('save-default-btn');
        const applyDefaultBtn = document.getElementById('apply-default-btn');
        const resetBtn = document.getElementById('reset-btn');
        const closeBtn = document.getElementById('close-btn');
        const forceModeSwitch = document.getElementById('force-mode-switch');
        const themeSelect = document.getElementById('theme-select');
        const languageSelect = document.getElementById('language-select');
        const backgroundLayer = document.getElementById('background-layer');
        const overlayLayerElement = document.getElementById('overlay-layer');
        const transparencyPercentage = transparencySlider.nextElementSibling;
        const blurPercentage = blurSlider.nextElementSibling;
        const overlayOpacityPercentage = overlayOpacity.nextElementSibling;
     
        // 防抖函数
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
     
        // 更新设置和 UI
        function updateSettings() {
            settings.transparency = parseFloat(transparencySlider.value);
            settings.blur = parseInt(blurSlider.value);
            settings.overlayColor = customColor.value === '#ffffff' && overlayOpacity.value == 0 ? 'transparent' : customColor.value;
            settings.overlayOpacity = parseFloat(overlayOpacity.value);
            settings.forceMode = forceModeSwitch.checked;
            settings.theme = themeSelect.value;
            settings.language = languageSelect.value;
     
            applySettings();
            backgroundLayer.style.display = 'block';
            overlayLayerElement.style.display = 'block';
            document.body.style.setProperty('background', 'transparent');
     
            if (settings.backgroundImage) {
                backgroundLayer.style.backgroundImage = `url(${settings.backgroundImage})`;
                backgroundLayer.style.backgroundSize = 'cover';
                backgroundLayer.style.backgroundRepeat = 'no-repeat';
                backgroundLayer.style.backgroundColor = 'transparent';
            } else {
                backgroundLayer.style.backgroundImage = 'none';
                backgroundLayer.style.backgroundColor = settings.theme === 'dark' ? '#000000' : '#ffffff';
            }
     
            panel.style.background = settings.theme === 'dark' ? '#000000' : '#fafafa';
            panel.style.color = settings.theme === 'dark' ? '#ffffff' : '#333';
            const labels = panel.querySelectorAll('label');
            labels.forEach(label => label.style.color = settings.theme === 'dark' ? '#ffffff' : '#333');
            const h3 = panel.querySelector('h3');
            h3.style.color = settings.theme === 'dark' ? '#ffffff' : '#333';
            const percentages = panel.querySelectorAll('.percentage');
            percentages.forEach(p => p.style.color = settings.theme === 'dark' ? '#cccccc' : '#666');
            bgImageInput.style.background = settings.theme === 'dark' ? '#333333' : '#fff';
            bgImageInput.style.color = settings.theme === 'dark' ? '#ffffff' : '#333';
            bgImageInput.style.borderColor = settings.theme === 'dark' ? '#ffffff' : '#ddd';
            themeSelect.style.background = settings.theme === 'dark' ? '#333333' : '#fff';
            themeSelect.style.color = settings.theme === 'dark' ? '#ffffff' : '#333';
            themeSelect.style.borderColor = settings.theme === 'dark' ? '#ffffff' : '#ddd';
            languageSelect.style.background = settings.theme === 'dark' ? '#333333' : '#fff';
            languageSelect.style.color = settings.theme === 'dark' ? '#ffffff' : '#333';
            languageSelect.style.borderColor = settings.theme === 'dark' ? '#ffffff' : '#ddd';
     
            transparencyPercentage.textContent = `${Math.round(settings.transparency * 100)}%`;
            blurPercentage.textContent = `${Math.round((settings.blur / 20) * 100)}%`;
            overlayOpacityPercentage.textContent = `${Math.round(settings.overlayOpacity * 100)}%`;
     
            const lang = settings.language || 'zh';
            h3.textContent = textMap[lang].title;
            document.getElementById('transparency-label').childNodes[0].textContent = `${textMap[lang].transparency}: `;
            document.getElementById('blur-label').childNodes[0].textContent = `${textMap[lang].blur}: `;
            document.getElementById('overlay-color-label').childNodes[0].textContent = `${textMap[lang].overlayColor}: `;
            document.getElementById('overlay-opacity-label').childNodes[0].textContent = `${textMap[lang].overlayOpacity}: `;
            document.getElementById('bg-image-label').childNodes[0].textContent = `${textMap[lang].backgroundImage}: `;
            document.getElementById('force-mode-label').childNodes[0].textContent = `${textMap[lang].forceMode}: `;
            document.getElementById('theme-label').childNodes[0].textContent = `${textMap[lang].theme}: `;
            document.getElementById('language-label').childNodes[0].textContent = `${textMap[lang].language}: `;
            saveDefaultBtn.textContent = textMap[lang].saveDefault;
            applyDefaultBtn.textContent = textMap[lang].applyDefault;
            resetBtn.textContent = textMap[lang].reset;
            closeBtn.textContent = textMap[lang].close;
            noneBtn.title = textMap[lang].language === '中文' ? '无' : 'None';
            yellowBtn.title = textMap[lang].language === '中文' ? '黄色' : 'Yellow';
            greenBtn.title = textMap[lang].language === '中文' ? '绿色' : 'Green';
            customColor.title = textMap[lang].language === '中文' ? '自定义颜色' : 'Custom Color';
     
            if (settings.forceMode) {
                forceModeSwitch.style.setProperty('background', forceModeSwitch.checked ? '#4a90e2' : '#999', 'important');
                noneBtn.style.setProperty('background', 'transparent', 'important');
                noneBtn.style.setProperty('border', `2px dashed ${settings.theme === 'dark' ? '#ffffff' : '#ccc'}`, 'important');
                yellowBtn.style.setProperty('background', '#ffff00', 'important');
                greenBtn.style.setProperty('background', '#00ff00', 'important');
                resetBtn.style.setProperty('background', '#ff3b30', 'important');
                resetBtn.style.setProperty('color', 'white', 'important');
                applyDefaultBtn.style.setProperty('background', '#17a2b8', 'important');
                applyDefaultBtn.style.setProperty('color', 'white', 'important');
                saveDefaultBtn.style.setProperty('background', '#28a745', 'important');
                saveDefaultBtn.style.setProperty('color', 'white', 'important');
                closeBtn.style.setProperty('background', '#4a90e2', 'important');
                closeBtn.style.setProperty('color', 'white', 'important');
                transparencySlider.style.setProperty('background', `linear-gradient(to right, #4a90e2 ${settings.transparency * 100}%, #e0e0e0 ${settings.transparency * 100}%)`, 'important');
                blurSlider.style.setProperty('background', `linear-gradient(to right, #4a90e2 ${(settings.blur / 20) * 100}%, #e0e0e0 ${(settings.blur / 20) * 100}%)`, 'important');
                overlayOpacity.style.setProperty('background', `linear-gradient(to right, #4a90e2 ${settings.overlayOpacity * 100}%, #e0e0e0 ${settings.overlayOpacity * 100}%)`, 'important');
     
                style.textContent += `
                    body *:not(#bg-adjuster-panel):not(#background-layer):not(#overlay-layer):not(input):not(button):not(select):not(textarea):not(a) {
                        background-color: transparent !important;
                        background-image: none !important;
                    }
                `;
            } else {
                forceModeSwitch.style.setProperty('background', forceModeSwitch.checked ? '#4a90e2' : '#999', 'important');
                noneBtn.style.setProperty('background', 'transparent', 'important');
                noneBtn.style.setProperty('border', `2px dashed ${settings.theme === 'dark' ? '#ffffff' : '#ccc'}`, 'important');
                yellowBtn.style.setProperty('background', '#ffff00', 'important');
                greenBtn.style.setProperty('background', '#00ff00', 'important');
                resetBtn.style.setProperty('background', '#ff3b30', 'important');
                resetBtn.style.setProperty('color', 'white', 'important');
                applyDefaultBtn.style.setProperty('background', '#17a2b8', 'important');
                applyDefaultBtn.style.setProperty('color', 'white', 'important');
                saveDefaultBtn.style.setProperty('background', '#28a745', 'important');
                saveDefaultBtn.style.setProperty('color', 'white', 'important');
                closeBtn.style.setProperty('background', '#4a90e2', 'important');
                closeBtn.style.setProperty('color', 'white', 'important');
                transparencySlider.style.setProperty('background', `linear-gradient(to right, #4a90e2 ${settings.transparency * 100}%, #e0e0e0 ${settings.transparency * 100}%)`, 'important');
                blurSlider.style.setProperty('background', `linear-gradient(to right, #4a90e2 ${(settings.blur / 20) * 100}%, #e0e0e0 ${(settings.blur / 20) * 100}%)`, 'important');
                overlayOpacity.style.setProperty('background', `linear-gradient(to right, #4a90e2 ${settings.overlayOpacity * 100}%, #e0e0e0 ${settings.overlayOpacity * 100}%)`, 'important');
     
                style.textContent = style.textContent.replace(/body \*:not\(#bg-adjuster-panel\):not\(#background-layer\):not\(#overlay-layer\):not\(input\):not\(button\):not\(select\):not\(textarea\):not\(a\) {[^}]*}/g, '');
            }
            
            overlayOpacitySection.style.display = settings.overlayColor === 'transparent' ? 'none' : 'block';
        }
     
        // 防抖版本的 updateSettings
        const debouncedUpdateSettings = debounce(updateSettings, 100);
     
        // 为开关和滑块添加事件监听
        forceModeSwitch.addEventListener('change', () => {
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
        themeSelect.addEventListener('change', () => {
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
        languageSelect.addEventListener('change', () => {
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
        transparencySlider.addEventListener('input', debouncedUpdateSettings);
        blurSlider.addEventListener('input', debouncedUpdateSettings);
        overlayOpacity.addEventListener('input', debouncedUpdateSettings);
        customColor.addEventListener('change', () => {
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
     
        // 为颜色按钮添加事件监听
        noneBtn.addEventListener('click', () => {
            customColor.value = '#ffffff';
            overlayOpacity.value = 0;
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
        yellowBtn.addEventListener('click', () => {
            customColor.value = '#ffff00';
            if (settings.overlayOpacity === 0) overlayOpacity.value = 0;
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
        greenBtn.addEventListener('click', () => {
            customColor.value = '#00ff00';
            if (settings.overlayOpacity === 0) overlayOpacity.value = 0;
            updateSettings();
            GM_setValue(domainKey, JSON.stringify(settings));
        });
     
        // 处理背景图片上传
        bgImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    settings.backgroundImage = e.target.result;
                    backgroundLayer.style.backgroundImage = `url(${settings.backgroundImage})`;
                    backgroundLayer.style.backgroundSize = 'cover';
                    backgroundLayer.style.backgroundRepeat = 'no-repeat';
                    backgroundLayer.style.backgroundColor = 'transparent';
                    updateSettings();
                    GM_setValue(domainKey, JSON.stringify(settings));
                };
                reader.readAsDataURL(file);
            }
        });
     
        // 保存为默认配置按钮功能（更新所有网站设置）
        saveDefaultBtn.addEventListener('click', () => {
            // 更新全局默认配置
            customDefaultSettings = { ...settings };
            GM_setValue(customDefaultKey, JSON.stringify(customDefaultSettings));
     
            // 获取所有存储的键
            const allKeys = GM_listValues();
            allKeys.forEach(key => {
                if (key.startsWith('settings_') && key !== domainKey) {
                    // 更新其他域名的设置
                    const domainSettings = JSON.parse(GM_getValue(key, JSON.stringify(defaultSettings)));
                    Object.assign(domainSettings, customDefaultSettings);
                    GM_setValue(key, JSON.stringify(domainSettings));
                }
            });
     
            // 更新当前页面设置并应用
            settings = { ...customDefaultSettings };
            GM_setValue(domainKey, JSON.stringify(settings));
            transparencySlider.value = settings.transparency;
            blurSlider.value = settings.blur;
            customColor.value = settings.overlayColor === 'transparent' ? '#ffffff' : settings.overlayColor;
            overlayOpacity.value = settings.overlayOpacity;
            forceModeSwitch.checked = settings.forceMode;
            themeSelect.value = settings.theme;
            languageSelect.value = settings.language;
     
            if (settings.backgroundImage) {
                backgroundLayer.style.backgroundImage = `url(${settings.backgroundImage})`;
                backgroundLayer.style.backgroundSize = 'cover';
                backgroundLayer.style.backgroundRepeat = 'no-repeat';
                backgroundLayer.style.backgroundColor = 'transparent';
            } else {
                backgroundLayer.style.backgroundImage = 'none';
                backgroundLayer.style.backgroundColor = settings.theme === 'dark' ? '#000000' : '#ffffff';
            }
     
            transparencyPercentage.textContent = `${Math.round(settings.transparency * 100)}%`;
            blurPercentage.textContent = `${Math.round((settings.blur / 20) * 100)}%`;
            overlayOpacityPercentage.textContent = `${Math.round(settings.overlayOpacity * 100)}%`;
            updateSettings();
     
            alert(settings.language === 'zh' ? '已保存当前设置为默认配置并应用到所有网站！' : 'Current settings saved as default and applied to all websites!');
        });
     
        // 应用默认配置按钮功能
        applyDefaultBtn.addEventListener('click', () => {
            settings.transparency = customDefaultSettings.transparency;
            settings.blur = customDefaultSettings.blur;
            settings.overlayColor = customDefaultSettings.overlayColor;
            settings.overlayOpacity = customDefaultSettings.overlayOpacity;
            settings.backgroundImage = customDefaultSettings.backgroundImage;
            settings.theme = customDefaultSettings.theme;
            settings.language = customDefaultSettings.language;
     
            transparencySlider.value = settings.transparency;
            blurSlider.value = settings.blur;
            customColor.value = settings.overlayColor === 'transparent' ? '#ffffff' : settings.overlayColor;
            overlayOpacity.value = settings.overlayOpacity;
            themeSelect.value = settings.theme;
            languageSelect.value = settings.language;
     
            if (settings.backgroundImage) {
                backgroundLayer.style.backgroundImage = `url(${settings.backgroundImage})`;
                backgroundLayer.style.backgroundSize = 'cover';
                backgroundLayer.style.backgroundRepeat = 'no-repeat';
                backgroundLayer.style.backgroundColor = 'transparent';
            } else {
                backgroundLayer.style.backgroundImage = 'none';
                backgroundLayer.style.backgroundColor = settings.theme === 'dark' ? '#000000' : '#ffffff';
            }
     
            GM_setValue(domainKey, JSON.stringify(settings));
            transparencyPercentage.textContent = `${Math.round(settings.transparency * 100)}%`;
            blurPercentage.textContent = `${Math.round((settings.blur / 20) * 100)}%`;
            overlayOpacityPercentage.textContent = `${Math.round(settings.overlayOpacity * 100)}%`;
            updateSettings();
        });
     
        // 重置按钮功能
        resetBtn.addEventListener('click', () => {
            backgroundLayer.style.display = 'none';
            overlayLayerElement.style.display = 'none';
            document.body.style.removeProperty('background');
     
            transparencySlider.value = 1;
            blurSlider.value = 0;
            customColor.value = '#ffffff';
            overlayOpacity.value = 0;
            forceModeSwitch.checked = false;
            themeSelect.value = 'light';
            languageSelect.value = settings.language;
     
            settings.transparency = 1;
            settings.blur = 0;
            settings.overlayColor = 'transparent';
            settings.overlayOpacity = 0;
            settings.forceMode = false;
            settings.backgroundImage = null;
            settings.theme = 'light';
     
            GM_setValue(domainKey, JSON.stringify(settings));
            transparencyPercentage.textContent = '100%';
            blurPercentage.textContent = '0%';
            overlayOpacityPercentage.textContent = '0%';
     
            forceModeSwitch.style.removeProperty('background');
            noneBtn.style.removeProperty('background');
            noneBtn.style.removeProperty('border');
            yellowBtn.style.removeProperty('background');
            greenBtn.style.removeProperty('background');
            resetBtn.style.removeProperty('background');
            resetBtn.style.removeProperty('color');
            applyDefaultBtn.style.removeProperty('background');
            applyDefaultBtn.style.removeProperty('color');
            saveDefaultBtn.style.removeProperty('background');
            saveDefaultBtn.style.removeProperty('color');
            closeBtn.style.removeProperty('background');
            closeBtn.style.removeProperty('color');
            transparencySlider.style.removeProperty('background');
            blurSlider.style.removeProperty('background');
            overlayOpacity.style.removeProperty('background');
        });
     
        // 关闭面板
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
            GM_setValue(domainKey, JSON.stringify(settings));
        });
     
        // 点击面板外关闭
        document.addEventListener('click', (e) => {
            if (panel.style.display === 'block' && !panel.contains(e.target) && e.target !== closeBtn) {
                panel.style.display = 'none';
                GM_setValue(domainKey, JSON.stringify(settings));
            }
        });
     
        // 防止面板内部点击冒泡到外部关闭
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
     
        // 初始化设置
        updateSettings();
    })();


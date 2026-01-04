// ==UserScript==
// @name         Misskey服务器跳转
// @namespace    https://github.com/YFTree
// @version      1.0
// @description  Misskey增强工具，支持自定义服务器跳转、按钮颜色自定义（默认自动识别主题色），自带设置菜单，更多设置项请查看源码（有中文标注）
// @author       YFTree
// @match        *misskey.io/*
// @match        *nya.one/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @compatible    edge
// @compatible    chrome
// @downloadURL https://update.greasyfork.org/scripts/528474/Misskey%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528474/Misskey%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        /* 基础按钮样式 */
        .modern-button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 1px 2px 4px rgba(0,0,0,0.1);
            font-family: system-ui, -apple-system, sans-serif;
            color: black;
        }

        /* 设置面板样式 */
        .settings-panel {
            position: fixed;
            top: 50%;  /* 设置面板默认顶部距离 */
            left: 50%;  /* 设置面板默认左边距离 */
            transform: translate(-50%, -50%);
            padding: 24px;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            z-index: 99999; /* 设置面板默认堆叠顺序 */
            display: none;
            width: min(80vw, 300px);
            background: var(--bg-color);
            color: var(--text-color);
        }

        /* 设置项网格布局 */
        .settings-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin: 16px 0;
        }

        /* 输入组样式 */
        .settings-input-group label {
            display: block;
            margin-bottom: 6px;
            font-size: 0.9em;
            color: var(--text-secondary);
        }

        /* 输入框基础样式 */
        .settings-input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            background: var(--input-bg);
            color: var(--text-color);
            transition: all 0.2s ease;
            box-sizing: border-box;
        }

        /* 输入框聚焦状态 */
        .settings-input:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 2px var(--accent-color-20);
        }

        /* 保存按钮样式 */
        .save-button {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
        }

        /* 重置按钮样式 */
        .reset-button {
            background: linear-gradient(135deg, #6b6bff, #8787ff);
            color: white;
        }

        /* 二级菜单样式 */
        .submenu {
            display: none;
            margin-top: 10px;
        }

        /* 二级菜单标题样式 */
        .submenu-title {
            font-size: 1em;
            font-weight: bold;
            margin-bottom: 10px;
            cursor: pointer;
            color: var(--text-color);
        }

        /* 居中按钮容器 */
        .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }
    `);

    // 配置存储结构
    const defaultConfig = {
        position: {
            bottom: 60, // 默认底部距离
            right: 94,  // 默认右边距离
            unit: '%'  // 默认位置单位
        },

        size: {
            width: 24,  // 默认按钮宽度
            height: 100, // 默认按钮长度
            fontSize: 10 // 默认按钮文本大小
        },

        colorMode: 'auto', // 默认按钮颜色模式
        customColor: '', // 默认自定义按钮颜色
        colorType: 'hex', // 默认按钮颜色类型
        openInNewTab: true, // 默认新窗口打开设置
        jumpDomain: 'nya.one', // 默认跳转服务器域名
        textColorMode: 'dark', // 默认文本颜色模式设置
        customTextColor: '', // 默认自定义文本颜色
        textColorType: 'hex' // 默认文本颜色类型
    };

    // 初始化配置
    let config = JSON.parse(GM_getValue('buttonConfig', JSON.stringify(defaultConfig)));

    // 创建设置面板
    const settingsPanel = createSettingsPanel();
    document.body.appendChild(settingsPanel);

    // 创建主按钮
    const mainButton = createMainButton();
    document.body.appendChild(mainButton);

    // 注册菜单命令
    GM_registerMenuCommand('⚙️ 调整按钮设置', () => toggleSettingsPanel());

    // 绑定主按钮点击事件
    mainButton.addEventListener('click', handleMainButtonClick);

    // 初始化主题系统
    initThemeSystem();

    // 创建主按钮
    function createMainButton() {
        const btn = document.createElement('button');
        btn.textContent = '打开用户页面'; // 默认按钮显示文本
        Object.assign(btn.style, {
            position: 'fixed',
            zIndex: '999999', // 默认按钮堆叠顺序（越大覆盖的页面越多）
            cursor: 'pointer',
            borderRadius: '40px', // 默认按钮圆角
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });
        updateButtonStyles(btn);
        return btn;
    }

    // 创建设置面板
   function createSettingsPanel() {
    const panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.innerHTML = `
        <h3 style="margin:0 0 20px; font-size:1.1em">按钮设置</h3>
        <div class="submenu-title" id="positionSizeMenu">位置与大小设置</div>
        <div class="submenu" id="positionSizeSubmenu">
            <div class="settings-grid">
                <!-- 位置设置 -->
                <div class="settings-input-group">
                    <label>底部距离</label>
                    <input type="number" class="settings-input" id="bottom" value="${config.position.bottom}">
                </div>
                <div class="settings-input-group">
                    <label>右侧距离</label>
                    <input type="number" class="settings-input" id="right" value="${config.position.right}">
                </div>
                <!-- 尺寸设置 -->
                <div class="settings-input-group">
                    <label>宽度 (px)</label>
                    <input type="number" class="settings-input" id="width" value="${config.size.width}">
                </div>
                <div class="settings-input-group">
                    <label>高度 (px)</label>
                    <input type="number" class="settings-input" id="height" value="${config.size.height}">
                </div>
                <div class="settings-input-group">
                    <label>文字大小 (px)</label>
                    <input type="number" class="settings-input" id="fontSize" value="${config.size.fontSize}">
                </div>
                <!-- 单位选择 -->
                <div class="settings-input-group">
                    <label>按钮位置单位类型</label>
                    <select class="settings-input" id="unit">
                        <option value="px" ${config.position.unit === 'px' ? 'selected' : ''}>像素(px)</option>
                        <option value="%" ${config.position.unit === '%' ? 'selected' : ''}>百分比(%)</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="submenu-title" id="colorMenu">颜色设置</div>
        <div class="submenu" id="colorSubmenu">
            <div class="settings-grid">
    <!-- 按钮颜色模式（1） -->
    <div class="settings-input-group">
        <label>按钮颜色模式</label>
        <select class="settings-input" id="colorMode">
            <option value="auto" ${config.colorMode === 'auto' ? 'selected' : ''}>自动</option>
            <option value="light" ${config.colorMode === 'light' ? 'selected' : ''}>浅色主题色</option>
            <option value="dark" ${config.colorMode === 'dark' ? 'selected' : ''}>深色主题色</option>
            <option value="custom" ${config.colorMode === 'custom' ? 'selected' : ''}>自定义颜色</option>
        </select>
    </div>

    <!-- 文本颜色模式（2） -->
    <div class="settings-input-group">
        <label>文本颜色模式</label>
        <select class="settings-input" id="textColorMode">
            <option value="auto" ${config.textColorMode === 'auto' ? 'selected' : ''}>自动</option>
            <option value="light" ${config.textColorMode === 'light' ? 'selected' : ''}>浅色</option>
            <option value="dark" ${config.textColorMode === 'dark' ? 'selected' : ''}>深色</option>
            <option value="custom" ${config.textColorMode === 'custom' ? 'selected' : ''}>自定义颜色</option>
        </select>
    </div>

    <!-- 自定义按钮颜色（3） -->
    <div class="settings-input-group" id="customColorGroup" style="display: ${config.colorMode === 'custom' ? 'block' : 'none'}">
        <label>自定义按钮颜色</label>
        <select class="settings-input" id="colorType">
            <option value="hex" ${config.colorType === 'hex' ? 'selected' : ''}>#RRGGBB</option>
            <option value="shortHex" ${config.colorType === 'shortHex' ? 'selected' : ''}>#RGB</option>
            <option value="rgb" ${config.colorType === 'rgb' ? 'selected' : ''}>RGB(RRR,GGG,BBB)</option>
        </select>
        <input type="text" class="settings-input" id="customColor" value="${config.customColor.replace(/^#|^rgb\(|\)$/g, '')}">
    </div>

    <!-- 自定义文本颜色（4） -->
    <div class="settings-input-group" id="customTextColorGroup" style="display: ${config.textColorMode === 'custom' ? 'block' : 'none'}">
        <label>自定义文本颜色</label>
        <select class="settings-input" id="textColorType">
            <option value="hex" ${config.textColorType === 'hex' ? 'selected' : ''}>#RRGGBB</option>
            <option value="shortHex" ${config.textColorType === 'shortHex' ? 'selected' : ''}>#RGB</option>
            <option value="rgb" ${config.textColorType === 'rgb' ? 'selected' : ''}>RGB(RRR,GGG,BBB)</option>
        </select>
        <input type="text" class="settings-input" id="customTextColor" value="${config.customTextColor.replace(/^#|^rgb\(|\)$/g, '')}">
    </div>
</div>
        </div>
        <div class="submenu-title" id="openJumpMenu">打开和跳转设置</div>
        <div class="submenu" id="openJumpSubmenu">
            <div class="settings-grid">
                <!-- 打开方式设置 -->
                <div class="settings-input-group">
                    <label>打开方式</label>
                    <select class="settings-input" id="openInNewTab">
                        <option value="false" ${!config.openInNewTab ? 'selected' : ''}>当前标签页</option>
                        <option value="true" ${config.openInNewTab ? 'selected' : ''}>新标签页</option>
                    </select>
                </div>
                <!-- 跳转域名设置 -->
                <div class="settings-input-group">
                    <label>跳转域名</label>
                    <input type="text" class="settings-input" id="jumpDomain" value="${config.jumpDomain}">
                </div>
            </div>
        </div>
        <!-- 操作按钮 -->
        <div class="button-container">
            <button class="modern-button reset-button" id="resetSettings">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.713T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.188-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.7 0 3.113-.862t2.187-2.313l1.8.75Q17.2 17.725 15.4 18.862T12 20Z"/></svg>
                重置
            </button>
            <button class="modern-button save-button" id="saveSettings">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
                保存
            </button>
        </div>
    `;

    // 为所有输入项添加事件监听
    const inputs = panel.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => updatePreview());
    });

    // 绑定重置和保存按钮事件
    panel.querySelector('#resetSettings').addEventListener('click', resetSettings);
    panel.querySelector('#saveSettings').addEventListener('click', saveSettings);

    // 绑定按钮颜色模式更改事件
    panel.querySelector('#colorMode').addEventListener('change', () => {
        const customColorGroup = panel.querySelector('#customColorGroup');
        customColorGroup.style.display = panel.querySelector('#colorMode').value === 'custom' ? 'block' : 'none';
        saveColorSettings();
        updateButtonColor(mainButton);
        updateCustomColorInput();
    });

    // 绑定按钮颜色类型更改事件
    panel.querySelector('#colorType').addEventListener('change', () => {
        updateButtonColor(mainButton);
        updateCustomColorInput();
    });

    // 绑定按钮颜色值输入事件
    panel.querySelector('#customColor').addEventListener('input', () => {
        updateButtonColor(mainButton);
    });

    // 绑定文本颜色模式更改事件
    panel.querySelector('#textColorMode').addEventListener('change', () => {
        const customTextColorGroup = panel.querySelector('#customTextColorGroup');
        customTextColorGroup.style.display = panel.querySelector('#textColorMode').value === 'custom' ? 'block' : 'none';
        saveColorSettings();
        updateButtonTextColor(mainButton);
        updateCustomTextColorInput(mainButton);
    });

    // 绑定文本颜色类型更改事件
    panel.querySelector('#textColorType').addEventListener('change', () => {
        updateButtonTextColor(mainButton);
        updateCustomTextColorInput();
    });

    // 绑定文本颜色值输入事件
    panel.querySelector('#customTextColor').addEventListener('input', () => {
        updateButtonTextColor(mainButton);
        updateCustomTextColorInput(mainButton);
    });

    // 绑定二级菜单点击事件
    panel.querySelectorAll('.submenu-title').forEach(title => {
        title.addEventListener('click', () => {
            const submenu = title.nextElementSibling;
            toggleSubmenu(submenu);
        });
    });
    return panel;
}

    // 更新预览效果
    function updatePreview() {
        const formData = getFormData();
        mainButton.style.bottom = `${formData.position.bottom}${formData.position.unit}`;
        mainButton.style.right = `${formData.position.right}${formData.position.unit}`;
        mainButton.style.width = `${formData.size.width}px`;
        mainButton.style.height = `${formData.size.height}px`;
        mainButton.style.fontSize = `${formData.size.fontSize}px`;
        updateButtonColor(mainButton);
        updateButtonTextColor(mainButton);
    }

    // 保存设置
    function saveSettings() {
        const formData = getFormData();
        if (formData.colorMode === 'custom' && !isValidColor(formData.customColor)) {
            alert('自定义颜色格式错误，请输入有效的颜色值（如 #RGB、#RRGGBB 或 rgb() 等格式）');
            return;
        }

        if (formData.textColorMode === 'custom' && !isValidColor(formData.customTextColor)) {
            alert('自定义文本颜色格式错误，请输入有效的颜色值（如 #RGB、#RRGGBB 或 rgb() 等格式）');
            return;
        }

        config = formData;
        GM_setValue('buttonConfig', JSON.stringify(config));
        settingsPanel.style.display = 'none';
        updateButtonStyles(mainButton);
    }

    // 重置设置
    function resetSettings() {
        config = JSON.parse(JSON.stringify(defaultConfig));
        updateFormData(config);
        updatePreview();
    }

    // 获取表单数据
    function getFormData() {
        const colorType = settingsPanel.querySelector('#colorType').value;
        let customColor = settingsPanel.querySelector('#customColor').value;
        if (customColor) {
            if (colorType === 'hex') {
                customColor = `#${customColor}`;
            } else if (colorType === 'shortHex') {
                if (customColor.length === 3) {
                    customColor = `#${customColor[0]}${customColor[0]}${customColor[1]}${customColor[1]}${customColor[2]}${customColor[2]}`;
                } else {
                    customColor = `#${customColor}`;
                }
            } else if (colorType === 'rgb') {
                customColor = `rgb(${customColor})`;
            }
        }

        const textColorType = settingsPanel.querySelector('#textColorType').value;
        let customTextColor = settingsPanel.querySelector('#customTextColor').value;
        if (customTextColor) {
            if (textColorType === 'hex') {
                customTextColor = `#${customTextColor}`;
            } else if (textColorType === 'shortHex') {
                if (customTextColor.length === 3) {
                    customTextColor = `#${customTextColor[0]}${customTextColor[0]}${customTextColor[1]}${customTextColor[1]}${customTextColor[2]}${customTextColor[2]}`;
                } else {
                    customTextColor = `#${customTextColor}`;
                }
            } else if (textColorType === 'rgb') {
                customTextColor = `rgb(${customTextColor})`;
            }
        }
        return {
            position: {
                bottom: parseInt(settingsPanel.querySelector('#bottom').value) || 60,
                right: parseInt(settingsPanel.querySelector('#right').value) || 90,
                unit: settingsPanel.querySelector('#unit').value
            },
            size: {
                width: settingsPanel.querySelector('#width').value,
                height: parseInt(settingsPanel.querySelector('#height').value) || 40,
                fontSize: parseInt(settingsPanel.querySelector('#fontSize').value) || 14
            },
            colorMode: settingsPanel.querySelector('#colorMode').value,
            customColor: customColor,
            colorType: colorType,
            openInNewTab: settingsPanel.querySelector('#openInNewTab').value === 'true',
            jumpDomain: settingsPanel.querySelector('#jumpDomain').value || 'nya.one',
            textColorMode: settingsPanel.querySelector('#textColorMode').value,
            customTextColor: customTextColor,
            textColorType: textColorType
        };
    }

    // 更新表单数据
    function updateFormData(data) {
        settingsPanel.querySelector('#bottom').value = data.position.bottom;
        settingsPanel.querySelector('#right').value = data.position.right;
        settingsPanel.querySelector('#unit').value = data.position.unit;
        settingsPanel.querySelector('#width').value = data.size.width;
        settingsPanel.querySelector('#height').value = data.size.height;
        settingsPanel.querySelector('#fontSize').value = data.size.fontSize;
        settingsPanel.querySelector('#colorMode').value = data.colorMode;
        settingsPanel.querySelector('#colorType').value = data.colorType;

        if (settingsPanel.querySelector('#customColor')) {
            let customColor = data.customColor || '';
            if (data.colorType === 'hex' && customColor.startsWith('#')) {
                customColor = customColor.slice(1);
            } else if (data.colorType === 'rgb' && customColor.startsWith('rgb(')) {
                customColor = customColor.slice(4, -1);
            }
            settingsPanel.querySelector('#customColor').value = customColor;
        }
        settingsPanel.querySelector('#openInNewTab').value = data.openInNewTab ? 'true' : 'false';
        settingsPanel.querySelector('#jumpDomain').value = data.jumpDomain;
        settingsPanel.querySelector('#textColorMode').value = data.textColorMode;
        settingsPanel.querySelector('#textColorType').value = data.textColorType;

        if (settingsPanel.querySelector('#customTextColor')) {
            let customTextColor = data.customTextColor || '';
            if (data.textColorType === 'hex' && customTextColor.startsWith('#')) {
                customTextColor = customTextColor.slice(1);
            } else if (data.textColorType === 'rgb' && customTextColor.startsWith('rgb(')) {
                customTextColor = customTextColor.slice(4, -1);
            }
            settingsPanel.querySelector('#customTextColor').value = customTextColor;
        }

        // 重置后更新自定义颜色输入框的显示状态
        const customColorGroup = settingsPanel.querySelector('#customColorGroup');
        customColorGroup.style.display = data.colorMode === 'custom' ? 'block' : 'none';
        const customTextColorGroup = settingsPanel.querySelector('#customTextColorGroup');
        customTextColorGroup.style.display = data.textColorMode === 'custom' ? 'block' : 'none';
    }

    // 更新按钮样式
    function updateButtonStyles(btn) {
        btn.style.bottom = `${config.position.bottom}${config.position.unit}`;
        btn.style.right = `${config.position.right}${config.position.unit}`;
        btn.style.width = `${config.size.width}px`;
        btn.style.height = `${config.size.height}px`;
        btn.style.fontSize = `${config.size.fontSize}px`;
        updateButtonColor(btn);
        updateButtonTextColor(btn);
    }

    // 更新按钮文本颜色
function updateButtonTextColor(btn) {
    let textColor = '#000000'; // 默认文本颜色
    switch (config.textColorMode) {
        case 'auto':
            textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
            break;
        case 'light':
            textColor = '#ffffff';
            break;
        case 'dark':
            textColor = '#000000';
            break;
        case 'custom':
            const textColorType = settingsPanel.querySelector('#textColorType').value;
            let customTextColor = settingsPanel.querySelector('#customTextColor').value;

            if (customTextColor) {
                if (textColorType === 'hex') {
                    customTextColor = `#${customTextColor}`;
                } else if (textColorType === 'shortHex') {
                    if (customTextColor.length === 3) {
                        customTextColor = `#${customTextColor[0]}${customTextColor[0]}${customTextColor[1]}${customTextColor[1]}${customTextColor[2]}${customTextColor[2]}`;
                    } else {
                        customTextColor = `#${customTextColor}`;
                    }
                } else if (textColorType === 'rgb') {
                    customTextColor = `rgb(${customTextColor})`;
                }
                if (isValidColor(customTextColor)) {
                    textColor = customTextColor;
                } else {
                    textColor = '#000000';
                }
            }
            break;
    }
    btn.style.color = textColor;
}

    // 初始化主题系统
    function initThemeSystem() {
        const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = () => {
            const isDark = darkModeMedia.matches;
            document.documentElement.style.setProperty('--bg-color', isDark ? '#2d2d2d' : '#ffffff');
            document.documentElement.style.setProperty('--text-color', isDark ? 'rgba(255,255,255,.85)' : '#333333');
            document.documentElement.style.setProperty('--text-secondary', isDark ? '#aaaaaa' : '#666666');
            document.documentElement.style.setProperty('--border-color', isDark ? '#444444' : '#dddddd');
            document.documentElement.style.setProperty('--input-bg', isDark ? '#383838' : '#f5f5f5');
            document.documentElement.style.setProperty('--accent-color', getThemeColor('accentLighten'));
            document.documentElement.style.setProperty('--accent-color-20', `${getThemeColor('accentLighten')}33`);
        };
        darkModeMedia.addEventListener('change', updateTheme);
        updateTheme();
    }

    // 获取主题颜色
    function getThemeColor() {
        try {
            let themeAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--MI_THEME-accent').trim();
            if (!themeAccentColor || !isValidColor(themeAccentColor)) {
                themeAccentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
            }
            if (!themeAccentColor || !isValidColor(themeAccentColor)) {
                themeAccentColor = '#9ab3da';
            }
            return themeAccentColor;
        } catch (error) {
            console.error('获取主题颜色时出错:', error);
            return '#9ab3da';
        }
    }

    // 更新按钮颜色
    function updateButtonColor(btn = mainButton) {
        try {
            let color = '#9ab3da';
            switch (config.colorMode) {
                case 'auto':
                    color = getThemeColor();
                    break;
                case 'light':
                    color = '#ffffff';
                    break;
                case 'dark':
                    color = '#2d2d2d';
                    break;
                case 'custom':
                    const colorType = settingsPanel.querySelector('#colorType').value;
                    let customColor = settingsPanel.querySelector('#customColor').value;
                    if (customColor) {
                        if (colorType === 'hex') {
                            customColor = `#${customColor}`;
                        } else if (colorType === 'shortHex') {
                            if (customColor.length === 3) {
                                customColor = `#${customColor[0]}${customColor[0]}${customColor[1]}${customColor[1]}${customColor[2]}${customColor[2]}`;
                            } else {
                                customColor = `#${customColor}`;
                            }
                        } else if (colorType === 'rgb') {
                            customColor = `rgb(${customColor})`;
                        }
                        if (isValidColor(customColor)) {
                            color = customColor;
                        } else {
                            color = '#9ab3da';
                        }
                    }
                    break;
            }
            btn.style.backgroundColor = color;
            btn.style.boxShadow = `0 4px 12px ${color}33`;
        } catch (error) {
            console.error('更新按钮颜色错误:', error);
        }
    }

    // 保存颜色相关设置
    function saveColorSettings() {
        const formData = getFormData();
        config.colorMode = formData.colorMode;
        config.customColor = formData.customColor;
        config.colorType = formData.colorType;
        config.textColorMode = formData.textColorMode;
        config.customTextColor = formData.customTextColor;
        config.textColorType = formData.textColorType;
        GM_setValue('buttonConfig', JSON.stringify(config));
    }

    // 切换设置面板显示状态
    function toggleSettingsPanel() {
    if (settingsPanel.style.display === 'none' || settingsPanel.style.display === '') {
        // 显示设置面板
        settingsPanel.style.display = 'block';
        // 更新颜色输入框的值
        updateCustomColorInput();
        updateCustomTextColorInput();
        // 更新自定义颜色输入框的显示状态
        const customColorGroup = settingsPanel.querySelector('#customColorGroup');
        customColorGroup.style.display = config.colorMode === 'custom' ? 'block' : 'none';
        const customTextColorGroup = settingsPanel.querySelector('#customTextColorGroup');
        customTextColorGroup.style.display = config.textColorMode === 'custom' ? 'block' : 'none';
    } else {
        // 隐藏设置面板
        settingsPanel.style.display = 'none';
    }
}

    // 切换二级菜单显示状态
    function toggleSubmenu(submenu) {
        if (submenu.style.display === 'none' || submenu.style.display === '') {
            submenu.style.display = 'block';
        } else {
            submenu.style.display = 'none';
        }
    }
    // 验证颜色格式
    function isValidColor(color) {
        return /^(#([0-9A-Fa-f]{3,4}){1,2}|rgb\((\d{1,3},\s*){2}\d{1,3}\)|rgba\((\d{1,3},\s*){3}\d*\.?\d+\))$/.test(color);
    }

    // 更新输入框中的颜色值
    function updateCustomColorInput() {
        const colorType = settingsPanel.querySelector('#colorType').value;
        let customColor = settingsPanel.querySelector('#customColor').value;
        if (colorType === 'hex' && customColor.startsWith('#')) {
            customColor = customColor.slice(1);
        } else if (colorType === 'rgb' && customColor.startsWith('rgb(')) {
            customColor = customColor.slice(4, -1);
        }
        settingsPanel.querySelector('#customColor').value = customColor;
    }

    // 更新输入框中的文本颜色值
    function updateCustomTextColorInput() {
        const textColorType = settingsPanel.querySelector('#textColorType').value;
        let customTextColor = settingsPanel.querySelector('#customTextColor').value;

        if (textColorType === 'hex' && customTextColor.startsWith('#')) {
            customTextColor = customTextColor.slice(1);
        } else if (textColorType === 'rgb' && customTextColor.startsWith('rgb(')) {
            customTextColor = customTextColor.slice(4, -1);
        }
        settingsPanel.querySelector('#customTextColor').value = customTextColor;
    }

    // 处理主按钮点击事件
    function handleMainButtonClick() {
    const spans = document.querySelectorAll('span');
    let username = null;
    for (const span of spans) {
        if (span.textContent && span.textContent.startsWith('@')) {
            username = span.textContent.trim();
            break;
        }
    }
    const fullUrl = window.location.href;
    const server = window.location.hostname;
    const keywords = ['/@', '/notes/']; // 自定义关键词以启用链接跳转功能
    const containsKeywords = keywords.some(keyword => fullUrl.includes(keyword));
    if (containsKeywords) {
        if (username && server) {
            const cleanUsername = (username.match(/@/g) && username.match(/@/g).length === 2) ? username : `${username}@${server}`;
            const url = `https://${config.jumpDomain}/${cleanUsername}`;
            if (config.openInNewTab) {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }
        } else {
                alert('无法解析用户名或服务器信息');
            }
        }
        }
})();
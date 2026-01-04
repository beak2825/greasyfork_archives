// ==UserScript==
// @name         AIRole.net 图片发送器
// @name:en      AIRole.net Image Sender
// @namespace    https://airole.net/
// @version      1.0.1
// @description  在图片上悬停显示浮动按钮，点击发送到AIRole.net进行角色生成
// @description:en Hover over images to show floating button, click to send to AIRole.net for character generation
// @author       AIRole.net
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @icon         https://airole.net/logo.128.png
// @homepage     https://airole.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539833/AIRolenet%20%E5%9B%BE%E7%89%87%E5%8F%91%E9%80%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539833/AIRolenet%20%E5%9B%BE%E7%89%87%E5%8F%91%E9%80%81%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        websiteUrl: 'https://airole.net',
        language: 'auto', // auto, zh, en
        enabled: true
    };

    // 多语言文本
    const i18n = {
        zh: {
            buttonTitle: '发送到 AIRole.net',
            settingsTitle: 'AIRole.net 图片发送器设置',
            websiteUrlLabel: '目标网站地址:',
            saveButton: '保存设置',
            resetButton: '重置为默认',
            enabledLabel: '启用插件',
            languageLabel: '语言:',
            languageAuto: '自动',
            languageChinese: '中文',
            languageEnglish: 'English',
            settingsSaved: '设置已保存！',
            invalidUrl: '请输入有效的网站地址',
            confirmReset: '确定要重置为默认设置吗？',
            resetSuccess: '已重置为默认设置',
            instructions: '悬停在任意图片上，点击浮动按钮即可发送到 AIRole.net'
        },
        en: {
            buttonTitle: 'Send to AIRole.net',
            settingsTitle: 'AIRole.net Image Sender Settings',
            websiteUrlLabel: 'Target Website URL:',
            saveButton: 'Save Settings',
            resetButton: 'Reset to Default',
            enabledLabel: 'Enable Plugin',
            languageLabel: 'Language:',
            languageAuto: 'Auto',
            languageChinese: '中文',
            languageEnglish: 'English',
            settingsSaved: 'Settings saved!',
            invalidUrl: 'Please enter a valid website URL',
            confirmReset: 'Are you sure you want to reset to default settings?',
            resetSuccess: 'Reset to default settings',
            instructions: 'Hover over any image and click the floating button to send to AIRole.net'
        }
    };

    // 获取当前语言
    function getCurrentLanguage() {
        const config = getConfig();
        if (config.language === 'auto') {
            return navigator.language.startsWith('zh') ? 'zh' : 'en';
        }
        return config.language;
    }

    // 获取国际化文本
    function getText(key) {
        const lang = getCurrentLanguage();
        return i18n[lang][key] || i18n.en[key] || key;
    }

    // 获取配置
    function getConfig() {
        const saved = GM_getValue('config', '{}');
        try {
            const config = JSON.parse(saved);
            return { ...DEFAULT_CONFIG, ...config };
        } catch (e) {
            return DEFAULT_CONFIG;
        }
    }

    // 保存配置
    function saveConfig(config) {
        GM_setValue('config', JSON.stringify(config));
    }

    // 验证URL
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    // 添加样式
    GM_addStyle(`
        .airole-floating-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            font-family: Arial, sans-serif;
            white-space: nowrap;
            user-select: none;
            opacity: 0;
            visibility: hidden;
            transform: scale(0.8);
        }
        
        .airole-floating-button:hover {
            background: #005a8a;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        .airole-floating-button.show {
            opacity: 1;
            visibility: visible;
            transform: scale(1);
        }
        
        .airole-floating-button::before {
            content: "🖼️ ";
            margin-right: 4px;
        }
        
        .airole-image-container {
            position: relative;
            display: inline-block;
        }
        
        .airole-settings-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            padding: 24px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            min-width: 400px;
            max-width: 90vw;
        }
        
        .airole-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        }
        
        .airole-settings-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 16px;
            color: #333;
        }
        
        .airole-settings-field {
            margin-bottom: 16px;
        }
        
        .airole-settings-label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
            color: #555;
        }
        
        .airole-settings-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .airole-settings-select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }
        
        .airole-settings-checkbox {
            margin-right: 8px;
        }
        
        .airole-settings-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 24px;
        }
        
        .airole-settings-button {
            padding: 8px 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 14px;
        }
        
        .airole-settings-button.primary {
            background: #007cba;
            color: white;
            border-color: #007cba;
        }
        
        .airole-settings-button:hover {
            opacity: 0.8;
        }
        
        .airole-settings-instructions {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 12px;
            margin-top: 16px;
            font-size: 13px;
            color: #666;
        }
    `);

    // 创建设置对话框
    function createSettingsDialog() {
        const config = getConfig();
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'airole-settings-overlay';
        
        // 创建对话框
        const dialog = document.createElement('div');
        dialog.className = 'airole-settings-dialog';
        
        dialog.innerHTML = `
            <div class="airole-settings-title">${getText('settingsTitle')}</div>
            
            <div class="airole-settings-field">
                <label class="airole-settings-label">
                    <input type="checkbox" class="airole-settings-checkbox" id="enabledCheckbox" ${config.enabled ? 'checked' : ''}>
                    ${getText('enabledLabel')}
                </label>
            </div>
            
            <div class="airole-settings-field">
                <label class="airole-settings-label" for="websiteUrl">${getText('websiteUrlLabel')}</label>
                <input type="text" id="websiteUrl" class="airole-settings-input" value="${config.websiteUrl}" placeholder="https://airole.net">
            </div>
            
            <div class="airole-settings-field">
                <label class="airole-settings-label" for="language">${getText('languageLabel')}</label>
                <select id="language" class="airole-settings-select">
                    <option value="auto" ${config.language === 'auto' ? 'selected' : ''}>${getText('languageAuto')}</option>
                    <option value="zh" ${config.language === 'zh' ? 'selected' : ''}>${getText('languageChinese')}</option>
                    <option value="en" ${config.language === 'en' ? 'selected' : ''}>${getText('languageEnglish')}</option>
                </select>
            </div>
            
            <div class="airole-settings-instructions">
                ${getText('instructions')}
            </div>
            
            <div class="airole-settings-buttons">
                <button class="airole-settings-button" id="resetButton">${getText('resetButton')}</button>
                <button class="airole-settings-button" id="cancelButton">取消</button>
                <button class="airole-settings-button primary" id="saveButton">${getText('saveButton')}</button>
            </div>
        `;
        
        // 绑定事件
        const saveButton = dialog.querySelector('#saveButton');
        const cancelButton = dialog.querySelector('#cancelButton');
        const resetButton = dialog.querySelector('#resetButton');
        const websiteUrlInput = dialog.querySelector('#websiteUrl');
        const languageSelect = dialog.querySelector('#language');
        const enabledCheckbox = dialog.querySelector('#enabledCheckbox');
        
        function closeDialog() {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        }
        
        saveButton.addEventListener('click', () => {
            const websiteUrl = websiteUrlInput.value.trim();
            
            if (!isValidUrl(websiteUrl)) {
                alert(getText('invalidUrl'));
                return;
            }
            
            const newConfig = {
                websiteUrl: websiteUrl,
                language: languageSelect.value,
                enabled: enabledCheckbox.checked
            };
            
            saveConfig(newConfig);
            alert(getText('settingsSaved'));
            closeDialog();
        });
        
        cancelButton.addEventListener('click', closeDialog);
        
        resetButton.addEventListener('click', () => {
            if (confirm(getText('confirmReset'))) {
                saveConfig(DEFAULT_CONFIG);
                alert(getText('resetSuccess'));
                closeDialog();
            }
        });
        
        overlay.addEventListener('click', closeDialog);
        
        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
        
        // 聚焦到网站URL输入框
        websiteUrlInput.focus();
        websiteUrlInput.select();
    }

    // 发送图片到 AIRole.net
    function sendImageToAIRole(imageUrl) {
        const config = getConfig();
        if (!config.enabled) {
            return;
        }
        
        const targetUrl = `${config.websiteUrl}?img=${encodeURIComponent(imageUrl)}`;
        GM_openInTab(targetUrl, { active: true });
    }

    // 创建浮动按钮
    function createFloatingButton(imageElement) {
        const config = getConfig();
        if (!config.enabled) {
            return null;
        }
        
        // 检查是否已经有按钮
        const existingButton = imageElement.parentElement.querySelector('.airole-floating-button');
        if (existingButton) {
            return existingButton;
        }
        
        const button = document.createElement('button');
        button.className = 'airole-floating-button';
        button.textContent = getText('buttonTitle');
        button.title = getText('buttonTitle');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            sendImageToAIRole(imageElement.src);
        });
        
        return button;
    }

    // 为图片添加容器和浮动按钮
    function setupImageHover(imageElement) {
        const config = getConfig();
        if (!config.enabled) {
            return;
        }
        
        // 跳过已经处理过的图片
        if (imageElement.hasAttribute('data-airole-processed')) {
            return;
        }
        
        // 标记为已处理
        imageElement.setAttribute('data-airole-processed', 'true');
        
        // 创建容器
        const container = document.createElement('div');
        container.className = 'airole-image-container';
        
        // 将图片包装在容器中
        const parent = imageElement.parentNode;
        parent.insertBefore(container, imageElement);
        container.appendChild(imageElement);
        
        // 创建浮动按钮
        const button = createFloatingButton(imageElement);
        if (button) {
            container.appendChild(button);
            
            // 鼠标悬停事件
            container.addEventListener('mouseenter', () => {
                button.classList.add('show');
            });
            
            container.addEventListener('mouseleave', () => {
                button.classList.remove('show');
            });
        }
    }

    // 初始化所有图片
    function initializeImages() {
        const images = document.querySelectorAll('img[src]:not([data-airole-processed])');
        images.forEach(setupImageHover);
    }

    // 监听新图片的加载
    function observeNewImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查添加的节点本身是否是图片
                            if (node.tagName === 'IMG' && node.src) {
                                setupImageHover(node);
                            }
                            // 检查添加的节点内部是否有图片
                            const images = node.querySelectorAll('img[src]:not([data-airole-processed])');
                            images.forEach(setupImageHover);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        // 注册设置菜单命令
        GM_registerMenuCommand(getText('settingsTitle'), createSettingsDialog);
        
        // 初始化现有图片
        initializeImages();
        
        // 监听新图片
        observeNewImages();
        
        // 监听图片加载完成事件
        document.addEventListener('load', (event) => {
            if (event.target.tagName === 'IMG' && event.target.src) {
                setupImageHover(event.target);
            }
        }, true);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(); 
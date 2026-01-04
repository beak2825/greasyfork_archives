// ==UserScript==
// @name         You.com 模型选择优化 (现代化UI)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  现代化模型选择下拉框，记忆上次使用的模型，自动同步模型列表变化，添加联网搜索开关
// @author       ice lover
// @match        https://you.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=you.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530888/Youcom%20%E6%A8%A1%E5%9E%8B%E9%80%89%E6%8B%A9%E4%BC%98%E5%8C%96%20%28%E7%8E%B0%E4%BB%A3%E5%8C%96UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530888/Youcom%20%E6%A8%A1%E5%9E%8B%E9%80%89%E6%8B%A9%E4%BC%98%E5%8C%96%20%28%E7%8E%B0%E4%BB%A3%E5%8C%96UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        debug: false,  // 设置为true开启调试日志
        selectorId: 'youcom-modern-selector',
        switchDelay: 600,
        styleId: 'youcom-selector-styles',
        defaultModel: 'Claude 3.7 Sonnet', // 默认模型
        storageKey: 'last-used-model',     // 存储键名
        webAccessKey: 'web-access-state',  // 联网状态存储键名
        modelContainerSelectors: [         // 模型按钮可能所在的容器选择器
            'div[class*="model-switcher"]',
            'div[class*="model-selector"]',
            'footer',
            'body'
        ]
    };

    // 调试日志
    function log(...args) {
        if (config.debug) console.log('[You.com模型选择优化]', ...args);
    }

    // 保存最近使用的模型
    function saveLastUsedModel(model) {
        try {
            if (typeof GM_setValue === 'function') {
                GM_setValue(config.storageKey, model);
                log('已保存最近使用的模型:', model);
            } else {
                localStorage.setItem(config.storageKey, model);
                log('已保存最近使用的模型(localStorage):', model);
            }
        } catch (e) {
            log('保存模型失败:', e);
        }
    }

    // 获取最近使用的模型
    function getLastUsedModel() {
        try {
            let model;
            if (typeof GM_getValue === 'function') {
                model = GM_getValue(config.storageKey);
            } else {
                model = localStorage.getItem(config.storageKey);
            }

            // 检查模型是否存在于当前可用的模型列表中
            const availableModels = getAllModelNames();
            if (model && availableModels.includes(model)) {
                log('已获取最近使用的模型:', model);
                return model;
            }
        } catch (e) {
            log('获取模型失败:', e);
        }
        log('使用默认模型:', config.defaultModel);
        return config.defaultModel;
    }

    // 获取所有可用的模型名称
    function getAllModelNames() {
        return getAllModelButtons().map(btn => cleanModelText(btn.textContent));
    }

    // 保存联网搜索状态
    function saveWebAccessState(enabled) {
        try {
            if (typeof GM_setValue === 'function') {
                GM_setValue(config.webAccessKey, enabled);
                log('已保存联网搜索状态:', enabled);
            } else {
                localStorage.setItem(config.webAccessKey, enabled);
                log('已保存联网搜索状态(localStorage):', enabled);
            }
        } catch (e) {
            log('保存联网搜索状态失败:', e);
        }
    }

    // 获取联网搜索状态
    function getWebAccessState() {
        try {
            let state;
            if (typeof GM_getValue === 'function') {
                state = GM_getValue(config.webAccessKey, true); // 默认为true
            } else {
                state = localStorage.getItem(config.webAccessKey);
                state = state === null ? true : state === 'true';
            }
            log('已获取联网搜索状态:', state);
            return state;
        } catch (e) {
            log('获取联网搜索状态失败:', e);
            return true; // 默认为true
        }
    }

    // 检测是否为暗黑模式
    function isDarkMode() {
        // 检查html标签上的data-color-scheme属性
        const htmlColorScheme = document.documentElement.getAttribute('data-color-scheme');
        if (htmlColorScheme === '@dark') {
            return true;
        }

        // 也可以通过媒体查询作为备选检测方法
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 添加全局样式
    function addGlobalStyles() {
        // 移除旧样式（如果存在）
        const oldStyle = document.getElementById(config.styleId);
        if (oldStyle) oldStyle.remove();

        // 检测当前模式
        const darkMode = isDarkMode();
        log('当前模式:', darkMode ? '暗黑' : '浅色');

        const style = document.createElement('style');
        style.id = config.styleId;
        style.textContent = `
            @keyframes youcom-spin { to { transform: rotate(360deg); } }

            /* 隐藏原始模型选择器 - 保持DOM存在但视觉隐藏 */
            div[data-testid="mode-switcher-chips"],
            div[class*="sc-17cb04c2-1"],
            div.sc-17cb04c2-0.hfTcaY,
            div.kqQJqI,
            [data-testid="mode-switcher-chips"] {
                opacity: 0 !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
                height: 1px !important;
                width: 1px !important;
                overflow: hidden !important;
            }

            .youcom-loading {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid rgba(${darkMode ? '255,255,255' : '0,0,0'},0.1);
                border-radius: 50%;
                border-top-color: ${darkMode ? '#ffffff' : '#555'};
                animation: youcom-spin 0.8s linear infinite;
            }

            #${config.selectorId} {
                position: fixed;
                top: 12px;
                left: calc(50% + 100px);
                transform: translateX(-50%);
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 12px;
                background-color: ${darkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 1)'};
                backdrop-filter: ${darkMode ? 'blur(10px)' : 'none'};
                padding: 7px 12px;
                border-radius: 12px;
                box-shadow: ${darkMode ? '0 2px 8px rgba(0, 0, 0, 0.5)' : 'none'};
                border: ${darkMode ? '1px solid rgba(50, 50, 50, 0.8)' : 'none'};
            }

            /* 联网搜索开关 */
            #${config.selectorId} .youcom-web-switch {
                display: flex;
                align-items: center;
                gap: 8px;
                background-color: ${darkMode ? '#121212' : '#ffffff'};
                border: 1px solid ${darkMode ? '#333' : '#e8e8e8'};
                border-radius: 8px;
                padding: 6px 12px;
                font-size: 13px;
                color: ${darkMode ? '#ffffff' : '#333'};
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
                box-shadow: 0 1px 2px rgba(0, 0, 0, ${darkMode ? '0.3' : '0.03'});
            }

            #${config.selectorId} .youcom-globe-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                color: ${darkMode ? '#ffffff' : '#666'};
                transition: all 0.25s ease;
            }

            #${config.selectorId} .youcom-switch-label {
                font-size: 13px;
                font-weight: 500;
                color: ${darkMode ? '#ffffff' : '#333'};
                white-space: nowrap;
            }

            #${config.selectorId} .youcom-web-switch.active {
                background-color: ${darkMode ? '#1a365d' : '#e8f0fe'};
            }

            #${config.selectorId} .youcom-web-switch:hover {
                background-color: ${darkMode ? '#1e1e1e' : 'rgba(250, 250, 250, 0.9)'};
                box-shadow: 0 1px 3px rgba(0, 0, 0, ${darkMode ? '0.4' : '0.05'});
            }

            #${config.selectorId} .youcom-web-switch:hover .youcom-globe-icon {
                color: ${darkMode ? '#ffffff' : '#444'};
            }

            #${config.selectorId} .youcom-modern-switch {
                position: relative;
                display: inline-block;
                width: 46px;
                height: 24px;
            }

            #${config.selectorId} .youcom-modern-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            #${config.selectorId} .youcom-modern-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${darkMode ? 'rgba(60, 60, 60, 0.8)' : 'rgba(230, 230, 230, 0.5)'};
                transition: all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
                border-radius: 24px;
                backdrop-filter: blur(4px);
                box-shadow: inset 0 0 0 1px ${darkMode ? 'rgba(80, 80, 80, 0.9)' : 'rgba(210, 210, 210, 0.5)'};
                overflow: hidden;
            }

            #${config.selectorId} .youcom-modern-slider:after {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                bottom: 2px;
                background-color: ${darkMode ? '#ffffff' : 'white'};
                transition: all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
                border-radius: 50%;
                box-shadow: 0 1px 2px rgba(0, 0, 0, ${darkMode ? '0.3' : '0.08'});
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #${config.selectorId} .youcom-modern-slider:before {
                position: absolute;
                content: "🔍";
                font-size: 12px;
                z-index: 2;
                left: 8px;
                top: 5px;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
                transform: scale(0.5);
            }

            #${config.selectorId} input:checked + .youcom-modern-slider {
                background-color: ${darkMode ? 'rgba(56, 114, 216, 0.5)' : 'rgba(66, 133, 244, 0.5)'};
                box-shadow: inset 0 0 0 1px ${darkMode ? 'rgba(66, 133, 244, 0.7)' : 'rgba(66, 133, 244, 0.3)'};
            }

            #${config.selectorId} input:checked + .youcom-modern-slider:after {
                transform: translateX(22px);
                background-color: ${darkMode ? '#4285f4' : 'white'};
            }

            #${config.selectorId} input:checked + .youcom-modern-slider:before {
                opacity: 1;
                transform: translateX(22px) scale(1);
            }

            /* 模型下拉框 */
            #${config.selectorId} .youcom-dropdown {
                position: relative;
            }

            #${config.selectorId} .youcom-selected {
                display: flex;
                align-items: center;
                gap: 6px;
                background-color: ${darkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.6)'};
                border: 1px solid ${darkMode ? '#333' : '#e8e8e8'};
                border-radius: 8px;
                padding: 6px 12px;
                font-size: 13px;
                font-weight: 500;
                color: ${darkMode ? '#ffffff' : '#333'};
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
                box-shadow: 0 1px 2px rgba(0, 0, 0, ${darkMode ? '0.3' : '0.03'});
                width: 120px;
            }

            #${config.selectorId} .youcom-selected:hover {
                background-color: ${darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(250, 250, 250, 0.9)'};
                box-shadow: 0 1px 3px rgba(0, 0, 0, ${darkMode ? '0.4' : '0.05'});
            }

            #${config.selectorId} .youcom-model-name {
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: calc(100% - 20px);
            }

            #${config.selectorId} .youcom-arrow {
                margin-left: auto;
                position: relative;
                min-width: 10px;
                transition: transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            #${config.selectorId} .youcom-arrow::before,
            #${config.selectorId} .youcom-arrow::after {
                content: "";
                position: absolute;
                background-color: ${darkMode ? '#ffffff' : '#666'};
                width: 7px;
                height: 1.5px;
                border-radius: 1px;
                transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
            }

            #${config.selectorId} .youcom-arrow::before {
                transform: rotate(45deg);
                right: 3px;
            }

            #${config.selectorId} .youcom-arrow::after {
                transform: rotate(-45deg);
                right: -2px;
            }

            #${config.selectorId} .youcom-dropdown.active .youcom-arrow::before {
                transform: rotate(-45deg);
            }

            #${config.selectorId} .youcom-dropdown.active .youcom-arrow::after {
                transform: rotate(45deg);
            }

            #${config.selectorId} .youcom-options {
                position: absolute;
                top: calc(100% + 6px);
                left: 0;
                width: 180px; /* 设置固定宽度 */
                background: ${darkMode ? '#121212' : 'white'};
                border: 1px solid ${darkMode ? '#333' : '#eaeaea'};
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, ${darkMode ? '0.5' : '0.08'});
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
                z-index: 10000;
                max-height: 300px;
                overflow-y: auto;
                pointer-events: none;
            }

            #${config.selectorId} .youcom-dropdown.active .youcom-options {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
                pointer-events: auto;
            }

            /* 自定义滚动条 */
            #${config.selectorId} .youcom-options::-webkit-scrollbar {
                width: 5px;
            }

            #${config.selectorId} .youcom-options::-webkit-scrollbar-track {
                background: ${darkMode ? '#1a1a1a' : '#f9f9f9'};
                border-radius: 3px;
            }

            #${config.selectorId} .youcom-options::-webkit-scrollbar-thumb {
                background: ${darkMode ? '#444' : '#e0e0e0'};
                border-radius: 3px;
            }

            #${config.selectorId} .youcom-options::-webkit-scrollbar-thumb:hover {
                background: ${darkMode ? '#555' : '#ccc'};
            }

            #${config.selectorId} .youcom-option {
                padding: 8px 14px;
                cursor: pointer;
                color: ${darkMode ? '#ffffff' : '#333'};
                border-bottom: 1px solid ${darkMode ? '#222' : '#f5f5f5'};
                display: flex;
                align-items: center;
                transition: all 0.2s;
                position: relative;
                overflow: hidden;
                font-size: 13px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #${config.selectorId} .youcom-option:hover {
                background: ${darkMode ? '#1e1e1e' : '#f9f9f9'};
                padding-left: 18px;
            }

            #${config.selectorId} .youcom-option:hover::before {
                opacity: 1;
                transform: translateX(0);
            }

            #${config.selectorId} .youcom-option::before {
                content: "";
                position: absolute;
                left: 7px;
                top: 50%;
                width: 3px;
                height: 3px;
                background: ${darkMode ? '#4285f4' : '#4285f4'};
                border-radius: 50%;
                transform: translateX(-10px);
                opacity: 0;
                transition: all 0.25s ease;
                margin-top: -1.5px;
            }

            #${config.selectorId} .youcom-option:last-child {
                border-bottom: none;
            }

            #${config.selectorId} .youcom-option-selected {
                background: ${darkMode ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.05)'};
                font-weight: 500;
            }

            #${config.selectorId} .youcom-option-selected::before {
                opacity: 1;
                transform: translateX(0);
                background: #4285f4;
            }

            #${config.selectorId} .youcom-option-selected:hover {
                background: ${darkMode ? 'rgba(66, 133, 244, 0.25)' : 'rgba(66, 133, 244, 0.08)'};
            }

            /* 更多按钮 */
            #${config.selectorId} .youcom-more-btn {
                display: flex;
                align-items: center;
                gap: 5px;
                background-color: ${darkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.6)'};
                border: 1px solid ${darkMode ? '#333' : '#e8e8e8'};
                border-radius: 8px;
                padding: 6px 10px;
                font-size: 13px;
                color: ${darkMode ? '#ffffff' : '#333'};
                cursor: pointer;
                transition: all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1);
                box-shadow: 0 1px 2px rgba(0, 0, 0, ${darkMode ? '0.3' : '0.03'});
                white-space: nowrap;
            }

            #${config.selectorId} .youcom-more-btn:hover {
                background-color: ${darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(250, 250, 250, 0.9)'};
                box-shadow: 0 1px 3px rgba(0, 0, 0, ${darkMode ? '0.4' : '0.05'});
            }

            #${config.selectorId} .youcom-more-btn svg {
                fill: ${darkMode ? '#ffffff' : '#666'};
                width: 14px;
                height: 14px;
                margin-right: 1px;
                transition: all 0.25s ease;
            }

            #${config.selectorId} .youcom-more-btn:hover svg {
                fill: ${darkMode ? '#ffffff' : '#444'};
                transform: rotate(90deg);
            }

            /* 加载动画 */
            @keyframes youcom-rotation {
                from { transform: rotate(0deg); }
                to { transform: rotate(359deg); }
            }

            #${config.selectorId} .youcom-loader {
                display: none;
                width: 16px;
                height: 16px;
                border: 2px solid ${darkMode ? 'rgba(66, 133, 244, 0.3)' : 'rgba(26, 115, 232, 0.2)'};
                border-top-color: ${darkMode ? '#4285f4' : '#1a73e8'};
                border-radius: 50%;
                animation: youcom-rotation 0.8s infinite linear;
                margin: 0 2px;
            }

            #${config.selectorId} .youcom-web-switch.loading .youcom-globe-icon {
                display: none;
            }

            #${config.selectorId} .youcom-web-switch.loading .youcom-loader {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    // 清理模型文本
    function cleanModelText(text) {
        if (!text) return '';
        const cleaned = text.trim();
        return cleaned === '更多模型...' ? '更多...' : cleaned;
    }

    // 获取当前选中模型
    function getCurrentModel() {
        // 方法1：尝试寻找带有特定标识的选中模型按钮
        const modelButtons = document.querySelectorAll('button[data-testid*="model-chip"], button[data-testid*="mode-switcher-chip"]');
        for (const button of modelButtons) {
            // 检查是否有选中状态的样式特征
            const style = getComputedStyle(button);
            // 选中的按钮通常背景色不是透明的
            if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                style.backgroundColor !== 'transparent') {
                const text = cleanModelText(button.textContent);
                log('通过背景色找到选中的模型:', text);
                return text;
            }

            // 有些情况下通过类名判断选中状态
            if (button.classList.contains('selected') ||
                button.classList.contains('active') ||
                button.getAttribute('aria-selected') === 'true') {
                const text = cleanModelText(button.textContent);
                log('通过类名找到选中的模型:', text);
                return text;
            }
        }

        // 方法2：使用更通用的方法寻找所有可能的模型按钮并检查其状态
        const allButtons = getAllModelButtons();
        for (const button of allButtons) {
            const style = getComputedStyle(button);
            // 检查背景色、边框或其他可能表示选中状态的特征
            if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                style.backgroundColor !== 'transparent') {
                const text = cleanModelText(button.textContent);
                log('通过通用方法找到选中的模型:', text);
                return text;
            }
        }

        // 如果找不到选中的模型，尝试从URL或其他信息推断
        const urlMatch = window.location.href.match(/model=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
            const modelFromUrl = decodeURIComponent(urlMatch[1]);
            log('从URL推断的模型:', modelFromUrl);
            return modelFromUrl;
        }

        // 最后返回默认值
        log('无法确定当前模型，使用默认值');
        return config.defaultModel;
    }

    // 判断按钮是否是模型按钮
    function isModelButton(button) {
        // 获取按钮文本并清理
        const buttonText = cleanModelText(button.textContent);
        if (!buttonText) return false;

        // 检查是否有特定的data-testid属性
        if (button.hasAttribute('data-testid')) {
            const testId = button.getAttribute('data-testid');
            if (testId.includes('model-chip') ||
                testId.includes('mode-switcher-chip') ||
                testId.includes('mode-switcher-chips-more')) {
                return true;
            }
        }

        // 检查按钮是否在特定的模型选择器容器中
        const modelSwitcher = button.closest('div[class*="model-switcher"]') ||
                              button.closest('[data-testid="mode-switcher-chips"]');
        if (modelSwitcher) {
            return true;
        }

        // 检查按钮样式特征
        const style = getComputedStyle(button);
        // 检查是否有边框圆角 - 模型按钮通常是圆角的
        if (parseInt(style.borderRadius) > 0) {
            // 检查按钮的尺寸 - 模型按钮通常高度在30-50px之间
            const height = button.offsetHeight;
            if (height >= 30 && height <= 50) {
                // 最后检查是否有可能的模型名称关键词
                if (buttonText.includes('GPT') ||
                    buttonText.includes('Claude') ||
                    buttonText.includes('Llama') ||
                    buttonText.includes('Gemini') ||
                    buttonText.includes('Mini') ||
                    buttonText.includes('Sonnet') ||
                    buttonText.includes('Opus') ||
                    buttonText.includes('Haiku') ||
                    buttonText.includes('Smart') ||
                    buttonText.includes('更多') ||
                    buttonText.includes('More')) {
                    return true;
                }
            }
        }

        return false;
    }

    // 获取所有模型按钮，排除More按钮
    function getAllModelButtons() {
        // 首先尝试使用更精确的选择器
        let buttons = Array.from(document.querySelectorAll('button[data-testid*="model-chip"], button[data-testid*="mode-switcher-chip"]'));

        // 过滤掉"更多"按钮
        buttons = buttons.filter(btn => {
            const text = cleanModelText(btn.textContent);
            return !text.includes('更多') && !text.includes('More');
        });

        // 如果找不到，则使用更宽松的选择器并进行过滤
        if (buttons.length === 0) {
            buttons = Array.from(document.querySelectorAll('button'))
                .filter(btn => {
                    // 过滤掉明显不是模型按钮的元素
                    const text = btn.textContent.trim();
                    if (!text) return false;
                    if (text.includes('更多') || text.includes('More')) return false; // 排除更多按钮
                    if (btn.offsetWidth < 20 || btn.offsetHeight < 20) return false; // 太小的按钮

                    return isModelButton(btn);
                });
        }

        // 确保按钮可见
        return buttons.filter(btn => btn.offsetParent !== null);
    }

    // 获取真正的"更多"按钮
    function getRealMoreButton() {
        const buttons = document.querySelectorAll('button[data-testid="mode-switcher-chips-more"]');
        for (const button of buttons) {
            if (button.closest('aside') === null && button.closest('nav') === null) {
                return button;
            }
        }
        return null;
    }

    // 是否是新对话页面
    function isNewChatPage() {
        return window.location.href.includes('/search') &&
               !window.location.href.includes('cid=') &&
               document.querySelector('input[type="text"][placeholder*="问问"]');
    }

    // 检测指定模型按钮
    function findModelButton(modelName) {
        const buttons = getAllModelButtons();
        return buttons.find(btn => cleanModelText(btn.textContent) === modelName);
    }

    // 自动选择上次使用的模型
    async function autoSelectLastUsedModel() {
        if (!isNewChatPage()) return false;

        log('检测到新对话页面');

        const lastModel = getLastUsedModel();
        const currentModel = getCurrentModel();

        log('当前模型:', currentModel, '上次使用的模型:', lastModel);

        if (currentModel !== lastModel) {
            const modelButton = findModelButton(lastModel);
            if (modelButton) {
                log('自动切换到上次使用的模型:', lastModel);
                modelButton.click();
                await new Promise(resolve => setTimeout(resolve, config.switchDelay));
                return true;
            } else {
                log('未找到上次使用的模型按钮:', lastModel);
            }
        } else {
            log('当前模型已经是上次使用的模型');
        }

        return false;
    }

    // 检查模型列表是否变化
    function hasModelListChanged() {
        // 获取当前所有模型按钮
        const currentButtons = getAllModelButtons()
            .map(btn => cleanModelText(btn.textContent))
            .filter(text => text); // 过滤掉空文本

        const selector = document.getElementById(config.selectorId);
        if (!selector) return true;

        const selectorButtons = Array.from(selector.querySelectorAll('.youcom-option'))
                                   .map(opt => opt.textContent.trim())
                                   .filter(text => text); // 过滤掉空文本

        log('当前模型按钮:', currentButtons);
        log('选择器内容:', selectorButtons);

        if (currentButtons.length !== selectorButtons.length) {
            log('模型数量变化:', currentButtons.length, '->', selectorButtons.length);
            return true;
        }

        // 比较模型名称是否一致
        for (const currentModel of currentButtons) {
            if (!selectorButtons.includes(currentModel)) {
                log('发现新模型:', currentModel);
                return true;
            }
        }

        // 检查是否有模型被移除
        for (const selectorModel of selectorButtons) {
            if (!currentButtons.includes(selectorModel)) {
                log('模型被移除:', selectorModel);
                return true;
            }
        }

        return false;
    }

    // 观察模型按钮区域的变化
    function observeModelButtons() {
        let container = null;
        for (const selector of config.modelContainerSelectors) {
            container = document.querySelector(selector);
            if (container) break;
        }

        if (!container) {
            log('未找到模型按钮容器');
            return null;
        }

        log('开始观察模型按钮区域:', container);

        const observer = new MutationObserver(() => {
            if (hasModelListChanged()) {
                log('检测到模型按钮变化，更新下拉列表');
                createModernSelector();
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        return observer;
    }

    // 打开设置面板并切换联网搜索状态
    async function toggleWebAccess(enabled) {
        log('开始切换联网搜索状态:', enabled);

        // 1. 找到+号按钮并点击
        const plusButton = document.querySelector('div._1ct82yn0 svg')?.closest('div');
        if (!plusButton) {
            log('未找到+号按钮');
            return false;
        }

        log('点击+号按钮');
        plusButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2. 找到Web access选项卡并点击
        const webAccessTab = Array.from(document.querySelectorAll('span._1qvgj558'))
                                .find(el => el.textContent.includes('Web access'));
        if (!webAccessTab) {
            log('未找到Web access选项卡');
            return false;
        }

        log('点击Web access选项卡');
        webAccessTab.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3. 找到切换开关并设置状态
        const toggleInput = document.querySelector('input.zvioep1[type="checkbox"]');
        if (!toggleInput) {
            log('未找到Web access切换开关');
            return false;
        }

        // 只有当当前状态与目标状态不同时才切换
        if (toggleInput.checked !== enabled) {
            log('切换Web access开关状态:', toggleInput.checked, '->', enabled);
            toggleInput.click();
            await new Promise(resolve => setTimeout(resolve, 300));
        } else {
            log('Web access开关已经是目标状态:', enabled);
        }

        // 4. 找到保存按钮并点击 - 更新为更精确的选择器
        const saveButton = document.querySelector('button[data-testid="modal-primary-action-button"]');
        if (!saveButton) {
            log('未找到保存按钮');
            return false;
        }

        log('点击保存按钮:', saveButton);
        saveButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));

        log('成功切换联网搜索状态:', enabled);
        return true;
    }

    // 创建更多按钮并添加事件监听
    function createMoreButton(container, moreButton) {
        const moreBtnContainer = document.createElement('div');
        moreBtnContainer.className = 'youcom-more-btn';

        // 添加SVG图标
        moreBtnContainer.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            <span>More</span>
        `;

        // 添加点击事件处理
        moreBtnContainer.addEventListener('click', (e) => {
            e.stopPropagation();

            // 记录点击时间
            window._youcomMoreClickTime = Date.now();

            // 点击原始按钮
            moreButton.click();

            // 设置全局事件监听，检测用户点击或操作
            const handleUserAction = () => {
                // 延迟执行，让界面先响应
                setTimeout(() => {
                    // 确保事件发生在点击More之后的合理时间内
                    if (Date.now() - window._youcomMoreClickTime > 300) {
                        // 需要完全重建选择器，传入强制重建参数
                        log('检测到More弹窗交互，完全重建选择器');
                        createModernSelector(true);

                        // 清理事件监听
                        document.removeEventListener('click', handleUserAction);
                        document.removeEventListener('keydown', handleUserAction);
                    }
                }, 300);
            };

            document.addEventListener('click', handleUserAction);
            document.addEventListener('keydown', handleUserAction);

            // 设置最长等待时间，避免无限等待
            setTimeout(() => {
                document.removeEventListener('click', handleUserAction);
                document.removeEventListener('keydown', handleUserAction);

                // 检查最后一次刷新时间，如果超过3秒没刷新，则强制刷新一次
                if (Date.now() - window._youcomMoreClickTime > 3000) {
                    // 强制完全重建
                    const oldSelector = document.getElementById(config.selectorId);
                    if (oldSelector) oldSelector.remove();
                    createModernSelector();
                }
            }, 5000);
        });

        return moreBtnContainer;
    }

    // 创建现代化下拉菜单
    function createModernSelector(forceRebuild = false) {
        // 只在需要时重建选择器
        const oldSelector = document.getElementById(config.selectorId);

        // 如果强制重建或检测到模型列表变化，则重建整个选择器
        const modelListChanged = hasModelListChanged();

        if (oldSelector) {
            if (forceRebuild || modelListChanged) {
                // 需要完全重建
                log('强制重建选择器或模型列表已变化');
                oldSelector.remove();
            } else {
                // 检查是否只需要更新当前选中的模型
                const currentModel = getCurrentModel();
                const displayedModel = oldSelector.querySelector('.youcom-model-name')?.textContent;

                if (displayedModel === currentModel) {
                    // 如果显示的模型和当前模型一致，不做任何改变
                    return;
                }

                // 如果只是模型变了，只更新模型名称而不重建整个 UI
                if (displayedModel && currentModel !== '选择模型') {
                    log('仅更新显示的模型名称:', displayedModel, '->', currentModel);
                    oldSelector.querySelector('.youcom-model-name').textContent = currentModel;

                    // 更新选中状态
                    const options = oldSelector.querySelectorAll('.youcom-option');
                    options.forEach(opt => {
                        opt.classList.remove('youcom-option-selected');
                        if (opt.textContent === currentModel) {
                            opt.classList.add('youcom-option-selected');
                        }
                    });

                    return;
                }

                // 其他情况才移除旧选择器
                oldSelector.remove();
            }
        }

        // 获取模型按钮和更多按钮
        let buttons = getAllModelButtons();
        const moreButton = getRealMoreButton();

        // 检查是否有足够的按钮生成选择器
        if (buttons.length === 0) {
            log('未找到模型按钮，延迟创建选择器');
            // 如果没有找到模型按钮，但找到了更多按钮，仍然创建选择器
            if (!moreButton) {
                // 设置短暂延迟后再次尝试创建选择器
                setTimeout(() => createModernSelector(), 300);
                return;
            }
        }

        // 确保样式已添加
        addGlobalStyles();

        const currentModel = getCurrentModel();
        log('当前选中的模型:', currentModel);

        // 创建主容器
        const container = document.createElement('div');
        container.id = config.selectorId;

        // 联网搜索开关
        const webAccessState = getWebAccessState();
        const webToggle = document.createElement('div');
        webToggle.className = `youcom-web-switch ${webAccessState ? 'active' : ''}`;
        webToggle.innerHTML = `
            <div class="youcom-globe-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9851 4.00291C11.9933 4.00046 11.9982 4.00006 11.9996 4C12.001 4.00006 12.0067 4.00046 12.0149 4.00291C12.0256 4.00615 12.047 4.01416 12.079 4.03356C12.2092 4.11248 12.4258 4.32444 12.675 4.77696C12.9161 5.21453 13.1479 5.8046 13.3486 6.53263C13.6852 7.75315 13.9156 9.29169 13.981 11H10.019C10.0844 9.29169 10.3148 7.75315 10.6514 6.53263C10.8521 5.8046 11.0839 5.21453 11.325 4.77696C11.5742 4.32444 11.7908 4.11248 11.921 4.03356C11.953 4.01416 11.9744 4.00615 11.9851 4.00291ZM8.01766 11C8.08396 9.13314 8.33431 7.41167 8.72334 6.00094C8.87366 5.45584 9.04762 4.94639 9.24523 4.48694C6.48462 5.49946 4.43722 7.9901 4.06189 11H8.01766ZM4.06189 13H8.01766C8.09487 15.1737 8.42177 17.1555 8.93 18.6802C9.02641 18.9694 9.13134 19.2483 9.24522 19.5131C6.48461 18.5005 4.43722 16.0099 4.06189 13ZM10.019 13H13.981C13.9045 14.9972 13.6027 16.7574 13.1726 18.0477C12.9206 18.8038 12.6425 19.3436 12.3823 19.6737C12.2545 19.8359 12.1506 19.9225 12.0814 19.9649C12.0485 19.9852 12.0264 19.9935 12.0153 19.9969C12.0049 20.0001 11.9999 20 11.9999 20C11.9999 20 11.9948 20 11.9847 19.9969C11.9736 19.9935 11.9515 19.9852 11.9186 19.9649C11.8494 19.9225 11.7455 19.8359 11.6177 19.6737C11.3575 19.3436 11.0794 18.8038 10.8274 18.0477C10.3973 16.7574 10.0955 14.9972 10.019 13ZM15.9823 13C15.9051 15.1737 15.5782 17.1555 15.07 18.6802C14.9736 18.9694 14.8687 19.2483 14.7548 19.5131C17.5154 18.5005 19.5628 16.0099 19.9381 13H15.9823ZM19.9381 11C19.5628 7.99009 17.5154 5.49946 14.7548 4.48694C14.9524 4.94639 15.1263 5.45584 15.2767 6.00094C15.6657 7.41167 15.916 9.13314 15.9823 11H19.9381Z" fill="currentColor"></path>
                </svg>
            </div>
            <div class="youcom-loader"></div>
            <span class="youcom-switch-label">搜索</span>
        `;

        // 添加开关事件监听
        webToggle.addEventListener('click', async (e) => {
            if (webToggle.classList.contains('loading')) return; // 防止重复点击

            const enabled = !webToggle.classList.contains('active');

            log('用户切换联网搜索:', enabled);

            // 显示加载状态
            webToggle.classList.add('loading');
            webToggle.style.pointerEvents = 'none';

            try {
                const success = await toggleWebAccess(enabled);
                if (success) {
                    saveWebAccessState(enabled);
                    // 更新激活状态
                    if (enabled) {
                        webToggle.classList.add('active');
                    } else {
                        webToggle.classList.remove('active');
                    }
                } else {
                    log('切换联网搜索失败，恢复状态');
                }
            } catch (error) {
                log('切换联网搜索出错:', error);
            } finally {
                // 移除加载状态
                webToggle.classList.remove('loading');
                webToggle.style.pointerEvents = '';
            }
        });

        // 主下拉容器
        const dropdown = document.createElement('div');
        dropdown.className = 'youcom-dropdown';

        // 当前选择显示
        const selected = document.createElement('div');
        selected.className = 'youcom-selected';
        selected.innerHTML = `
            <span class="youcom-model-name">${currentModel}</span>
            <span class="youcom-arrow"></span>
        `;

        // 下拉选项容器
        const options = document.createElement('div');
        options.className = 'youcom-options';

        // 直接从当前模型按钮获取模型选项，排除"更多"按钮
        buttons.forEach(button => {
            const text = cleanModelText(button.textContent);
            // 排除空文本和"更多"按钮
            if (!text || text.includes('更多') || text.includes('More')) return;

            const option = document.createElement('div');
            option.textContent = text;
            option.className = 'youcom-option';

            if (text === currentModel) {
                option.classList.add('youcom-option-selected');
            }

            option.addEventListener('click', async (e) => {
                e.stopPropagation();

                log('点击了模型选项:', text);

                // 显示加载状态
                const originalText = option.textContent;
                option.innerHTML = `
                    <span class="youcom-loading"></span>
                    <span style="margin-left:8px">${originalText}</span>
                `;
                option.style.pointerEvents = 'none';

                // 关闭下拉菜单
                dropdown.classList.remove('active');

                try {
                    log('点击原始按钮:', button.textContent);
                    button.click();
                    log('等待模型切换完成...');
                    await new Promise(resolve => setTimeout(resolve, config.switchDelay));

                    // 更新显示
                    const newModel = getCurrentModel();
                    log('切换后的模型:', newModel);
                    selected.querySelector('.youcom-model-name').textContent = newModel;

                    // 保存最近使用的模型
                    saveLastUsedModel(newModel);

                    // 更新所有选项状态
                    options.querySelectorAll('.youcom-option').forEach(opt => {
                        opt.classList.remove('youcom-option-selected');
                        if (opt.textContent === newModel) {
                            opt.classList.add('youcom-option-selected');
                        }
                    });
                } finally {
                    // 恢复原始文本
                    option.innerHTML = originalText;
                    option.style.pointerEvents = '';
                }
            });

            options.appendChild(option);
        });

        // 事件监听
        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        dropdown.appendChild(selected);
        dropdown.appendChild(options);

        // 添加更多按钮到容器
        if (moreButton) {
            const moreBtnContainer = createMoreButton(container, moreButton);
            container.appendChild(dropdown);
            container.appendChild(moreBtnContainer);
            container.appendChild(webToggle);
        } else {
            container.appendChild(dropdown);
            container.appendChild(webToggle);
        }

        document.body.appendChild(container);

        // 全局点击事件用于关闭下拉菜单
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });

        log('选择器创建完成');
    }

    // 观察URL变化并优化刷新机制
    function observeUrlChanges() {
        let lastUrl = window.location.href;
        let refreshTimeout = null;

        const checkUrlChange = () => {
            if (lastUrl !== window.location.href) {
                log('URL变化:', window.location.href);
                lastUrl = window.location.href;

                // 清除之前的任何等待中的刷新
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }

                // 立即创建选择器以提供初始UI
                createModernSelector(true);

                // 然后设置一系列的刷新以确保UI在页面完全加载后更新
                const refreshTimes = [100, 300, 600, 1000, 2000]; // 多次尝试刷新
                refreshTimes.forEach(time => {
                    setTimeout(() => {
                        if (document.readyState === 'complete') {
                            createModernSelector();

                            // 在页面完全加载后再尝试自动选择模型
                            if (time >= 600) {
                                autoSelectLastUsedModel().then(() => {
                                    // 选择模型后再次更新UI
                                    setTimeout(() => createModernSelector(), 300);
                                });
                            }
                        }
                    }, time);
                });
            }
        };

        // 增加检查频率，从原来的2秒减少到1秒
        setInterval(checkUrlChange, 1000);

        // 也监听popstate和hashchange事件以捕获更多导航变化
        window.addEventListener('popstate', checkUrlChange);
        window.addEventListener('hashchange', checkUrlChange);

        // 监听页面加载完成事件
        window.addEventListener('load', () => {
            log('页面加载完成，更新选择器');
            createModernSelector();

            // 等待一段时间后再次刷新，确保所有动态内容都已加载
            setTimeout(() => createModernSelector(), 500);
        });
    }

    // 添加暗黑模式观察器
    function observeThemeChanges() {
        // 监视HTML元素的data-color-scheme属性变化
        const htmlObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-scheme') {
                    log('检测到主题变化，更新样式');
                    addGlobalStyles();
                    // 重新创建选择器以应用新样式
                    const selector = document.getElementById(config.selectorId);
                    if (selector) {
                        selector.remove();
                        createModernSelector(true);
                    }
                }
            }
        });

        htmlObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-color-scheme']
        });

        // 同时也监听媒体查询变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener(() => {
            log('检测到系统主题变化，更新样式');
            addGlobalStyles();
            // 重新创建选择器以应用新样式
            const selector = document.getElementById(config.selectorId);
            if (selector) {
                selector.remove();
                createModernSelector(true);
            }
        });
    }

    // 使用 requestAnimationFrame 优化渲染时机
    function updateUI() {
        window.requestAnimationFrame(() => {
            createModernSelector();
        });
    }

    // 初始化
    function init() {
        log('脚本初始化');

        // 1. 先添加全局样式
        addGlobalStyles();

        // 2. 创建MutationObserver以监视DOM变化
        const bodyObserver = new MutationObserver((mutations) => {
            // 检查是否已经存在选择器
            const selector = document.getElementById(config.selectorId);

            // 如果选择器不存在，尝试创建它
            if (!selector) {
                // 使用requestAnimationFrame延迟到下一帧以优化性能
                window.requestAnimationFrame(() => {
                    createModernSelector();
                });
            } else {
                // 如果选择器存在，检查模型列表是否有变化
                if (hasModelListChanged()) {
                    log('检测到模型列表变化，更新选择器');
                    createModernSelector();
                }
            }
        });

        // 使用更高效的配置观察body
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // 3. 立即尝试创建选择器（不等待模型选择）
        createModernSelector();

        // 4. 页面加载完成后再次创建选择器以确保UI正确
        if (document.readyState === 'complete') {
            setTimeout(createModernSelector, 100);
        } else {
            window.addEventListener('load', () => {
                setTimeout(createModernSelector, 100);
            });
        }

        // 5. 设置延迟任务以执行模型自动选择
        setTimeout(async () => {
            const modelChanged = await autoSelectLastUsedModel();
            if (modelChanged) {
                // 如果模型更改了，更新选择器显示
                setTimeout(createModernSelector, 300);
            }
        }, 300);

        // 6. 观察URL变化以处理页面导航
        observeUrlChanges();

        // 7. 观察主题变化
        observeThemeChanges();

        log('所有初始化任务已完成');
    }

    // 启动脚本 - 使用更可靠的启动方式
    function startScript() {
        // 检查页面是否已经加载
        if (document.readyState === 'loading') {
            log('等待DOMContentLoaded事件');
            document.addEventListener('DOMContentLoaded', () => {
                // 稍微延迟初始化，以确保页面基本元素已加载
                setTimeout(init, 100);
            });
        } else {
            log('DOM已加载，立即初始化');
            // 立即初始化但使用微任务延迟
            Promise.resolve().then(init);
        }
    }

    // 立即启动脚本
    startScript();
})();
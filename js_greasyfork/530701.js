// ==UserScript==
// @name         视频分辨率检测显示器
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  实时显示视频分辨率，支持快捷键和右键菜单控制
// @author       Deepseek AI生成
// @license      GPL-3.0
// @homepage     https://greasyfork.org/zh-CN/scripts/530701
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530701/%E8%A7%86%E9%A2%91%E5%88%86%E8%BE%A8%E7%8E%87%E6%A3%80%E6%B5%8B%E6%98%BE%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530701/%E8%A7%86%E9%A2%91%E5%88%86%E8%BE%A8%E7%8E%87%E6%A3%80%E6%B5%8B%E6%98%BE%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储
    let config = {
        visible: true,
        hotkey: ';'
    };

    // 初始化元素
    const display = createDisplay();
    let settingsPanel = null;
    let menuCommandId = null;

    // 加载存储配置
    function loadConfig() {
        const savedConfig = GM_getValue('config');
        if (savedConfig) {
            config = {...config, ...savedConfig};
        }
        updateDisplayVisibility();
    }

    // 创建显示控件
    function createDisplay() {
        const div = document.createElement('div');
        div.id = 'video-res-display';
        GM_addStyle(`
            #video-res-display {
                position: fixed;
                background: rgba(0,0,0,0.7) !important;
                color: #fff !important;
                padding: 8px 12px !important;
                border-radius: 4px !important;
                font-family: Arial !important;
                z-index: 99999 !important;
                transition: all 0.3s !important;
                pointer-events: none !important;
            }
        `);
        document.body.appendChild(div);
        return div;
    }

    // 视频检测逻辑
    function initVideoObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO' || node.querySelector('video')) {
                        bindVideoEvents(node.querySelector('video') || node);
                    }
                });
            });
        });

        observer.observe(document, {
            subtree: true,
            childList: true
        });

        // 初始绑定
        document.querySelectorAll('video').forEach(video => {
            bindVideoEvents(video);
        });
    }

    // 绑定视频事件
    function bindVideoEvents(video) {
        video.addEventListener('timeupdate', updateResolution);
        video.addEventListener('resize', updateResolution);
    }

    // 更新分辨率显示
    function updateResolution(e) {
        const video = e.target;
        if (!video) return;

        const rect = video.getBoundingClientRect();
        display.textContent = `${video.videoWidth}x${video.videoHeight}`;

        // 动态定位
        display.style.left = `${rect.right - 150}px`;
        display.style.top = `${rect.bottom - 50}px`;
    }

    // 显隐控制
    function toggleDisplay() {
        config.visible = !config.visible;
        GM_setValue('config', config);
        updateDisplayVisibility();
        updateMenuCommand();
    }

    function updateDisplayVisibility() {
        display.style.display = config.visible ? 'block' : 'none';
    }

    // 快捷键处理
    function handleHotkey(e) {
        const expectedKeys = config.hotkey.toLowerCase().split('+');
        let match = true;

        expectedKeys.forEach(key => {
            key = key.trim();
            if (key === 'ctrl' && !e.ctrlKey) match = false;
            else if (key === 'alt' && !e.altKey) match = false;
            else if (key === 'shift' && !e.shiftKey) match = false;
            else if (key.length === 1 && e.key.toLowerCase() !== key) match = false;
        });

        if (match) toggleDisplay();
    }

    // 右键菜单
    function updateMenuCommand() {
        if (menuCommandId) GM_unregisterMenuCommand(menuCommandId);
        menuCommandId = GM_registerMenuCommand(
            config.visible ? '隐藏分辨率窗口' : '显示分辨率窗口',
            toggleDisplay
        );
    }

    // 设置面板
    function createSettingsPanel() {
        if (settingsPanel) return;

        // 添加样式保护
        GM_addStyle(`
            .video-res-settings-panel {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                background: #fff !important;
                padding: 20px !important;
                box-shadow: 0 0 10px rgba(0,0,0,0.2) !important;
                z-index: 1000000 !important;
                border-radius: 8px !important;
                font-family: Arial, sans-serif !important;
                color: #333 !important;
            }
            .video-res-settings-panel h3 {
                margin: 0 0 15px 0 !important;
                font-size: 16px !important;
                color: #222 !important;
            }
            .video-res-settings-panel label {
                display: flex !important;
                align-items: center !important;
                margin-bottom: 15px !important;
            }
            .video-res-settings-panel input {
                margin-left: 10px !important;
                padding: 5px !important;
                border: 1px solid #ddd !important;
                border-radius: 4px !important;
                background: #fff !important;
                color: #333 !important;
            }
            .video-res-settings-panel button {
                padding: 6px 12px !important;
                border: none !important;
                border-radius: 4px !important;
                background: #007bff !important;
                color: white !important;
                cursor: pointer !important;
                margin-left: 10px !important;
            }
            .video-res-settings-panel button:hover {
                background: #0056b3 !important;
            }
        `);

        settingsPanel = document.createElement('div');
        settingsPanel.className = 'video-res-settings-panel';
        settingsPanel.innerHTML = `
            <h3>分辨率显示设置</h3>
            <label>
                快捷键：
                <input type="text" id="hotkeyInput" value="${config.hotkey}">
            </label>
            <button id="saveBtn">保存</button>
            <button id="closeBtn">关闭</button>
        `;

        settingsPanel.querySelector('#saveBtn').addEventListener('click', () => {
            config.hotkey = settingsPanel.querySelector('#hotkeyInput').value.trim();
            GM_setValue('config', config);
            settingsPanel.remove();
            settingsPanel = null;
        });

        settingsPanel.querySelector('#closeBtn').addEventListener('click', () => {
            settingsPanel.remove();
            settingsPanel = null;
        });

        document.body.appendChild(settingsPanel);
    }

    // 初始化
    loadConfig();
    initVideoObserver();
    document.addEventListener('keydown', handleHotkey);
    GM_registerMenuCommand('打开设置面板', createSettingsPanel);
    updateMenuCommand();

    // 全屏适配
    document.addEventListener('fullscreenchange', () => {
        const video = document.querySelector('video');
        if (video && document.fullscreenElement === video) {
            display.style.fontSize = '24px';
        } else {
            display.style.fontSize = '14px';
        }
    });
})();
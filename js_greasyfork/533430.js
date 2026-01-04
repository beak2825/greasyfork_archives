// ==UserScript==
// @name         豆包音频下载助手
// @namespace    http://tampermonkey.net/
// @version      2.0.5
// @description  捕获豆包网页版中的音频数据，支持主动/被动捕获、自动合并、暗黑模式、可拖拽面板、音频排序管理
// @author       cenglin123
// @match        https://www.doubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.0/lame.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533430/%E8%B1%86%E5%8C%85%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533430/%E8%B1%86%E5%8C%85%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储捕获的音频数据
    let capturedAudio = [];
    let isMonitoring = false; // 监控是否开启 (XHR/Fetch)
    let isCapturing = false;  // 是否处于"一键获取"的主动模式
    let originalXHR = unsafeWindow.XMLHttpRequest;
    let originalFetch = unsafeWindow.fetch;
    let observer = null;

    // 自动合并相关
    let autoMergeEnabled = GM_getValue('autoMergeEnabled', false);
    let autoMergeTimer = null;
    let lastAudioCaptureTime = null;
    const AUTO_MERGE_DELAY = 10000; // 10秒

    // 自动清空列表
    let autoClearList = GM_getValue('autoClearList');
    if (autoClearList === undefined) {
        autoClearList = true;
        GM_setValue('autoClearList', true);
    }

    // 暗黑模式检测
    let isDarkMode = false;

    // 面板拖拽相关
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isMinimized = GM_getValue('isMinimized', false);

    // 验证并修正面板位置
    function validatePanelPosition(position) {
        const defaultPosition = { bottom: 20, right: 20 };

        // 如果没有位置信息，使用默认值
        if (!position || typeof position.bottom !== 'number' || typeof position.right !== 'number') {
            console.log('位置信息无效，使用默认位置');
            return defaultPosition;
        }

        // 获取窗口尺寸
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = 320; // 面板宽度
        const panelHeight = 650; // 面板大致高度

        // 验证位置是否在合理范围内
        // bottom 和 right 应该在 0 到窗口尺寸之间
        const isValidBottom = position.bottom >= 0 && position.bottom < windowHeight - 100;
        const isValidRight = position.right >= 0 && position.right < windowWidth - 100;

        if (!isValidBottom || !isValidRight) {
            console.log('保存的位置超出屏幕范围:', position, '窗口尺寸:', windowWidth, windowHeight);
            console.log('重置为默认位置');
            // 保存修正后的位置
            GM_setValue('panelPosition', defaultPosition);
            return defaultPosition;
        }

        console.log('位置验证通过:', position);
        return position;
    }

    let panelPosition = validatePanelPosition(GM_getValue('panelPosition', { bottom: 20, right: 20 }));

    // 文件名
    let fileNamePrefix = GM_getValue('fileNamePrefix', 'doubao_audio');

    // 静音定时器
    let muteInterval = null;
    let dataUrlScanInterval = null; // 用于定期扫描 data URL

    // SVG图标定义
    const icons = {
        speaker: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>',
        mic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>',
        stop: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>',
        eye: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        download: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
        link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
        clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        code: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        minimize: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
        maximize: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
        close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        music: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>',
        copy: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
        sort: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M7 12h10M11 18h6"></path></svg>',
        search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>'
    };

    // 检测暗黑模式
    function detectDarkMode() {
        // 优先使用浏览器的暗色模式偏好
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        // 如果系统有明确的主题偏好，直接使用它
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
            isDarkMode = prefersDark;
            console.log('暗色模式检测结果:', isDarkMode, '(使用系统偏好)');
            return isDarkMode;
        }

        // 如果系统没有主题偏好，才检查页面背景色
        let pageDark = false;
        try {
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bodyBg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                pageDark = brightness < 128;
            }
        } catch (e) {
            console.log('检测页面背景色失败:', e);
        }

        isDarkMode = pageDark;
        console.log('暗色模式检测结果:', isDarkMode, '(使用页面背景)');
        return isDarkMode;
    }

    // 获取主题样式
    function getThemeStyles() {
        detectDarkMode();
        if (isDarkMode) {
            return {
                background: '#1e1e1e', color: '#e0e0e0', border: '#444',
                buttonBg: '#2d2d2d', buttonHover: '#3d3d3d',
                primaryBg: '#5B8DEF', primaryHover: '#4A7DD9',
                dangerBg: '#E57373', shadowColor: 'rgba(0,0,0,0.5)',
                disabledBg: '#374151', disabledColor: '#6b7280',
                successBg: '#66BB6A', successHover: '#57AB5A'
            };
        } else {
            return {
                background: '#ffffff', color: '#333', border: '#e5e7eb',  // 更浅的边框
                buttonBg: '#f8f9fa', buttonHover: '#e9ecef',                // 更浅的背景
                primaryBg: '#5B8DEF', primaryHover: '#4A7DD9',
                dangerBg: '#EF5350', shadowColor: 'rgba(0,0,0,0.08)',       // 更浅的阴影
                disabledBg: '#f3f4f6', disabledColor: '#9ca3af',
                successBg: '#66BB6A', successHover: '#57AB5A'
            };
        }
    }

    // 注入自定义滚动条样式
    function injectCustomScrollbarStyles() {
        const theme = getThemeStyles(); // 获取当前主题
        const styleId = 'audio-capturer-scrollbar-style';
        let styleElement = document.getElementById(styleId);

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        // 为模态框内的滚动区域和面板本身（如果需要）添加样式
        styleElement.textContent = `
            /* Custom Scrollbar for Audio Capturer (WebKit) */
            .audio-capture-modal-backdrop ::-webkit-scrollbar,
            #audio-list-container::-webkit-scrollbar,
            div[style*="max-height: 300px"][style*="overflow-y: auto"]::-webkit-scrollbar,
            #audio-capture-panel ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .audio-capture-modal-backdrop ::-webkit-scrollbar-track,
            #audio-list-container::-webkit-scrollbar-track,
            div[style*="max-height: 300px"][style*="overflow-y: auto"]::-webkit-scrollbar-track,
            #audio-capture-panel ::-webkit-scrollbar-track {
                background: ${theme.buttonBg};
                border-radius: 4px;
            }
            .audio-capture-modal-backdrop ::-webkit-scrollbar-thumb,
            #audio-list-container::-webkit-scrollbar-thumb,
            div[style*="max-height: 300px"][style*="overflow-y: auto"]::-webkit-scrollbar-thumb,
            #audio-capture-panel ::-webkit-scrollbar-thumb {
                background: ${isDarkMode ? '#555' : '#aaa'};
                border-radius: 4px;
                border: 2px solid ${theme.buttonBg};
            }
            .audio-capture-modal-backdrop ::-webkit-scrollbar-thumb:hover,
            #audio-list-container::-webkit-scrollbar-thumb:hover,
            div[style*="max-height: 300px"][style*="overflow-y: auto"]::-webkit-scrollbar-thumb:hover,
            #audio-capture-panel ::-webkit-scrollbar-thumb:hover {
                background: ${isDarkMode ? '#777' : '#888'};
            }

            /* Custom Scrollbar (Firefox) */
            .audio-capture-modal-backdrop .audio-capture-modal,
            #audio-list-container,
            div[style*="max-height: 300px"][style*="overflow-y: auto"] {
                scrollbar-width: thin;
                scrollbar-color: ${isDarkMode ? '#555' : '#aaa'} ${theme.buttonBg};
            }

            /* 拖拽排序样式 */
            .audio-item.dragging {
                opacity: 0.85;
                transform: translate3d(6px, 6px, 0);
                box-shadow: 0 12px 24px ${isDarkMode ? 'rgba(0,0,0,0.45)' : 'rgba(15,23,42,0.18)'};
            }
            .audio-item.drag-over {
                border: 2px dashed ${theme.primaryBg};
                background: ${isDarkMode ? 'rgba(91, 141, 239, 0.1)' : 'rgba(91, 141, 239, 0.05)'};
            }
            .drag-handle {
                cursor: grab;
                opacity: 0.6;
                transition: opacity 0.2s;
            }
            .drag-handle:hover {
                opacity: 1;
            }
            .drag-handle:active {
                cursor: grabbing;
            }
        `;
    }

    // 自动点击页面播放/停止按钮
    function clickAudioToggleButton() {
        try {
            const stopBtn = document.querySelector('button[data-testid="audio_stop_button"]');
            if (stopBtn && !stopBtn.disabled) {
                stopBtn.click();
                updateStatus('✓ 已触发停止按钮');
                return true;
            }
            const playBtn = document.querySelector('button[data-testid="audio_play_button"]');
            if (playBtn && !playBtn.disabled) {
                playBtn.click();
                updateStatus('✓ 已触发播放按钮');
                return true;
            }
            const playBtnByClass = document.querySelector('button.semi-button-primary[aria-disabled="false"]');
            if (playBtnByClass && playBtnByClass.querySelector('svg')) {
                playBtnByClass.click();
                updateStatus('✓ 已触发播放/停止按钮（备用方法）');
                return true;
            }
            updateStatus('⚠ 未找到播放/停止按钮');
            return false;
        } catch (e) {
            console.error('点击播放/停止按钮失败:', e);
            updateStatus('⚠ 触发播放/停止失败');
            return false;
        }
    }

    // 创建UI函数
    function createMainInterface() {
        try {
            console.log('createMainInterface被调用');

            // 先清理可能存在的旧面板
            const oldPanel = document.getElementById('audio-capture-panel');
            if (oldPanel) {
                console.log('发现旧面板，正在移除...');
                oldPanel.remove();
            }

            const theme = getThemeStyles();
            const panel = document.createElement('div');
            panel.id = 'audio-capture-panel';
            const positionStyle = `bottom: ${panelPosition.bottom}px; right: ${panelPosition.right}px;`;

            panel.style.cssText = `
                position: fixed !important;
                ${positionStyle}
                background: ${theme.background}; color: ${theme.color};
                border: 1px solid ${theme.border}; border-radius: 12px;
                padding: ${isMinimized ? '12px' : '20px'};
                box-shadow: 0 4px 20px ${theme.shadowColor}; z-index: 999999 !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
                width: ${isMinimized ? 'auto' : '320px'};
                transition: all 0.3s ease;
                user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
            `;

            console.log('面板样式已设置，当前主题:', isDarkMode ? '暗色' : '亮色');

                // 最小化面版
                const headerHtml = `
                <div id="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${isMinimized ? '0' : '16px'}; user-select: none;">
                    ${isMinimized ? `
                    <div style="display: flex; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <button id="active-capture-btn" class="icon-btn minimized-btn" title="一键获取" style="padding: 8px; background: transparent !important; border: none; cursor: pointer; opacity: 0.7; transition: all 0.2s; display: flex; align-items: center; color: inherit;">${icons.speaker}</button>
                            <button id="passive-capture-btn" class="icon-btn minimized-btn" title="手动获取" style="padding: 8px; background: transparent !important; border: none; cursor: pointer; opacity: 0.7; transition: all 0.2s; display: flex; align-items: center; color: inherit;">${icons.clock}</button>
                            <div style="width: 1px; height: 20px; background: ${theme.border}; margin: 0 8px;"></div>
                            <button id="view-captured" class="icon-btn minimized-btn" title="已捕获音频管理" style="padding: 8px; background: transparent !important; border: none; cursor: pointer; opacity: 0.7; transition: all 0.2s; display: flex; align-items: center; position: relative; color: inherit;">
                            ${icons.eye}
                            <div class="audio-count-badge" style="position: absolute; top: 2px; right: 2px; background: ${theme.primaryBg}; color: white; border-radius: 8px; padding: 1px 4px; font-size: 10px; line-height: 1; min-width: 14px; text-align: center;">0</div>
                        </button>
                            <button id="merge-download" class="icon-btn minimized-btn" title="合并下载" style="padding: 8px; background: transparent !important; border: none; cursor: pointer; opacity: 0.7; transition: all 0.2s; display: flex; align-items: center;">${icons.download}</button>
                            <button id="clear-all-audio" class="icon-btn minimized-btn" title="清空列表" style="padding: 8px; background: transparent !important; border: none; cursor: pointer; opacity: 0.7; transition: all 0.2s; display: flex; align-items: center;">${icons.trash}</button>
                        </div>
                        <div style="width: 1px; height: 20px; background: ${theme.border}; margin: 0 8px;"></div>
                        <style>
                            .icon-btn:hover { opacity: 1 !important; transform: scale(1.1); }
                            .icon-btn:active { transform: scale(0.95); }
                            .icon-btn svg { width: 20px; height: 20px; }
                        </style>
                    </div>
                    ` : `
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600; user-select: none; display: flex; align-items: center; gap: 8px;">
                        ${icons.music} <span>豆包音频下载助手</span>
                    </h3>
                    `}
                    <div style="display: flex; gap: 8px;">
                        <button id="minimize-toggle" style="background: none; border: none; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; padding: 4px; display: flex; align-items: center;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                            ${isMinimized ? icons.maximize : icons.minimize}
                        </button>
                        <button id="close-tool" style="background: none; border: none; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; padding: 4px; display: flex; align-items: center;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">
                            ${icons.close}
                        </button>
                    </div>
                </div>
            `;

            // 主内容区域
            const mainContent = isMinimized ? '' : `
                <div style="display: flex; flex-direction: column; gap: 12px;">

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <button id="active-capture-btn" style="
                            padding: 14px; background: ${theme.successBg};
                            color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 500;
                            display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
                            box-shadow: 0 2px 6px ${isDarkMode ? 'rgba(102, 187, 106, 0.25)' : 'rgba(102, 187, 106, 0.15)'};
                        ">
                            <div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                ${icons.speaker} <span>一键获取</span>
                            </div>
                        </button>
                        <button id="passive-capture-btn" style="
                            padding: 14px; background: ${theme.primaryBg};
                            color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 500;
                            display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
                            box-shadow: 0 2px 6px ${isDarkMode ? 'rgba(91, 141, 239, 0.25)' : 'rgba(91, 141, 239, 0.15)'};
                        ">
                            <div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                ${icons.clock} <span>手动获取</span>
                            </div>
                        </button>
                    </div>

                    <div style="margin-bottom: 4px;">
                        <label style="display: block; font-size: 13px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; margin-bottom: 6px;">文件名前缀</label>
                        <input type="text" id="filename-prefix" value="${fileNamePrefix}" placeholder="doubao_audio"
                            style="width: 100%; padding: 10px 12px; background: ${isDarkMode ? '#374151' : '#f3f4f6'}; color: ${theme.color}; border: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}; border-radius: 6px; font-size: 14px; box-sizing: border-box; transition: all 0.2s;"
                            onfocus="this.style.borderColor='#3b82f6'; this.style.background='${isDarkMode ? '#1f2937' : '#ffffff'}'"
                            onblur="this.style.borderColor='${isDarkMode ? '#4b5563' : '#e5e7eb'}'; this.style.background='${isDarkMode ? '#374151' : '#f3f4f6'}'">
                    </div>

                    <div style="margin: -4px 0;">
                        <div style="padding: 4px 10px; cursor: default;">
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; padding: 4px 0;" onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='transparent'">
                                <input type="checkbox" id="auto-merge-toggle" ${autoMergeEnabled ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                                <span style="font-size: 14px; flex: 1;">自动合并下载(10秒无新音频时)</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; padding: 4px 0;" onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='transparent'">
                                <input type="checkbox" id="auto-clear-toggle" ${autoClearList ? 'checked' : ''} style="cursor: pointer; width: 16px; height: 16px;">
                                <span style="font-size: 14px; flex: 1;">下载完成后自动清空列表</span>
                            </label>
                        </div>
                    </div>

                    <div style="display: flex; gap: 4px; margin: 4px 0;">
                        <button id="merge-download" style="
                            flex: 1; padding: 14px; background: ${isDarkMode ? '#374151' : '#f3f4f6'}; color: ${theme.color};
                            border: 1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}; border-radius: 10px; cursor: pointer; font-size: 15px; font-weight: 500;
                            display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;
                        " onmouseover="this.style.transform='scale(1.02)'; this.style.background='${isDarkMode ? '#4b5563' : '#e5e7eb'}'" onmouseout="this.style.transform='scale(1)'; this.style.background='${isDarkMode ? '#374151' : '#f3f4f6'}'">
                            <div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                ${icons.download} <span>合并下载</span>
                            </div>
                        </button>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                        <button id="view-captured" style="
                            padding: 10px; background: ${theme.buttonBg}; color: ${theme.color};
                            border: 1px solid ${theme.border}; border-radius: 8px;
                            cursor: pointer; font-size: 14px; font-weight: 400;
                            display: flex; align-items: center; justify-content: center; gap: 8px;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                            ${icons.eye} <span>音频管理 <span id="audio-count">0</span></span>
                        </button>

                        <button id="clear-all-audio" style="
                            padding: 10px; background: ${theme.buttonBg}; color: ${theme.color};
                            border: 1px solid ${theme.border}; border-radius: 8px;
                            cursor: pointer; font-size: 14px; font-weight: 400;
                            display: flex; align-items: center; justify-content: center; gap: 8px;
                            transition: all 0.2s;
                        " onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                            ${icons.trash} <span>清空列表</span>
                        </button>
                    </div>

                <div id="status-area" style="
                    margin-top: 6px; padding: 10px 12px; font-size: 12px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
                    background: ${isDarkMode ? '#1f2937' : '#f9fafb'}; border-radius: 6px; text-align: center; user-select: text; min-height: 20px;
                ">工具已启动就绪</div>
            `;

            panel.innerHTML = headerHtml + mainContent;
            document.body.appendChild(panel);

            console.log('面板已添加到DOM');
            console.log('面板元素:', panel);
            console.log('面板父元素:', panel.parentElement);
            console.log('面板当前位置:', panel.getBoundingClientRect());

            updateAudioCount();
            setupDraggable(panel);

            // 最小化/关闭 按钮
            document.getElementById('minimize-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                isMinimized = !isMinimized;
                GM_setValue('isMinimized', isMinimized);

                // 获取当前面板的位置
                const rect = panel.getBoundingClientRect();
                const currentPosition = {
                    bottom: window.innerHeight - rect.bottom,
                    right: window.innerWidth - rect.right
                };
                panelPosition = currentPosition;
                createMainInterface();
            });

            document.getElementById('close-tool').addEventListener('click', (e) => {
                e.stopPropagation();
                panel.remove();
            });

            // 按钮事件监听 (不管是否最小化都需要)
            document.getElementById('active-capture-btn').addEventListener('click', handleActiveClick);
            document.getElementById('passive-capture-btn').addEventListener('click', handlePassiveClick);
            document.getElementById('view-captured').addEventListener('click', (e) => { e.stopPropagation(); showAudioManagementWindow(); });
            document.getElementById('merge-download').addEventListener('click', (e) => { e.stopPropagation(); showAudioManagementWindow({ autoSelectAll: true }); });
            document.getElementById('clear-all-audio').addEventListener('click', function(e) {
                e.stopPropagation();
                if (capturedAudio.length === 0) {
                    updateStatus('当前没有已捕获的音频');
                    return;
                }
                capturedAudio = [];
                updateAudioCount();
                saveAudioData();
                updateStatus('已清空所有音频');
            });

            if (!isMinimized) {
                // 文件名前缀保存
                document.getElementById('filename-prefix').addEventListener('change', function(e) {
                    e.stopPropagation();
                    fileNamePrefix = this.value.trim() || 'doubao_audio';
                    GM_setValue('fileNamePrefix', fileNamePrefix);
                    updateStatus('文件名前缀已保存: ' + fileNamePrefix);
                });

                // 其他按钮
                document.getElementById('view-captured').addEventListener('click', (e) => { e.stopPropagation(); showAudioManagementWindow(); });
                document.getElementById('merge-download').addEventListener('click', (e) => { e.stopPropagation(); showAudioManagementWindow({ autoSelectAll: true }); });

                // 清空音频按钮（无确认）
                document.getElementById('clear-all-audio').addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (capturedAudio.length === 0) {
                        updateStatus('当前没有已捕获的音频');
                        return;
                    }
                    capturedAudio = [];
                    updateAudioCount();
                    saveAudioData();
                    updateStatus('已清空所有音频');
                });

                // 自动合并开关
                document.getElementById('auto-merge-toggle').addEventListener('change', function(e) {
                    e.stopPropagation();
                    autoMergeEnabled = this.checked;
                    GM_setValue('autoMergeEnabled', autoMergeEnabled);
                    updateStatus(autoMergeEnabled ? '自动合并已启用' : '自动合并已禁用');
                    if (autoMergeEnabled && capturedAudio.length > 0) {
                        resetAutoMergeTimer();
                    }
                });

                // 从存储中同步自动合并状态
                syncAutoMergeCheckbox();

                // 自动清空开关
                document.getElementById('auto-clear-toggle').addEventListener('change', function(e) {
                    e.stopPropagation();
                    autoClearList = this.checked;
                    GM_setValue('autoClearList', autoClearList);
                    updateStatus(autoClearList ? '自动清空已启用' : '自动清空已禁用');
                });

                // 从存储中同步自动清空状态
                syncAutoClearCheckbox();
            }

            // 监听主题变化
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                    createMainInterface();
                });
            }

            // 在面板创建完成后，立即更新按钮状态
            setTimeout(() => {
                updateCaptureUI();
            }, 100);

            console.log('音频捕获工具界面已创建');
        } catch (error) {
            console.error('创建界面时出错:', error);
            alert('创建工具界面失败，请刷新页面重试');
        }
    }

    // 处理"一键获取"点击
    function handleActiveClick() {
        if (isMonitoring && isCapturing) {
            // 正在主动捕获 -> 停止
            stopCaptureActions(true);
            // 同步UI状态
            updateCaptureUI();
        } else if (!isMonitoring) {
            // 已停止 -> 开始主动捕获
            isCapturing = true;
            startMonitoring();
            mutePageAudio();

            // 自动勾选"自动合并"
            const autoMergeCheckbox = document.getElementById('auto-merge-toggle');
            if (autoMergeCheckbox) {
                autoMergeCheckbox.checked = true;
            }
            autoMergeEnabled = true;
            GM_setValue('autoMergeEnabled', autoMergeEnabled);

            setTimeout(clickAudioToggleButton, 500);
            updateStatus('一键获取已启动，已静音');
            // 同步UI状态
            updateCaptureUI();
        }
    }

    // 在 handlePassiveClick 函数中，在更新状态后添加同步代码
    function handlePassiveClick() {
        if (isMonitoring && !isCapturing) {
            // 正在被动监控 -> 停止
            stopCaptureActions(false);
            // 同步UI状态
            updateCaptureUI();
        } else if (!isMonitoring) {
            // 已停止 -> 开始被动监控
            isCapturing = false;
            startMonitoring();
            updateStatus('手动监控已启动，请点击播放');
            // 同步UI状态
            updateCaptureUI();
        }
    }

    // 在 stopCaptureActions 函数中，确保调用 updateCaptureUI
    function stopCaptureActions(isActiveMode) {
        stopMonitoring();
        if (isActiveMode) {
            unmutePageAudio(true);
        } else {
            unmutePageAudio(false);
        }
        isCapturing = false;
        updateCaptureUI(); // 确保这里被调用
    }

    // 修改 updateCaptureUI 函数，确保它能正确处理两种界面状态
    function updateCaptureUI() {
        const activeBtn = document.getElementById('active-capture-btn');
        const passiveBtn = document.getElementById('passive-capture-btn');
        if (!activeBtn || !passiveBtn) return;

        const theme = getThemeStyles();

        // 默认样式
        const styles = {
            green: theme.successBg,
            blue: theme.primaryBg,
            red: '#EF5350',
            gray: theme.disabledBg,
            shadowGreen: `0 2px 6px ${isDarkMode ? 'rgba(102, 187, 106, 0.25)' : 'rgba(102, 187, 106, 0.15)'}`,
            shadowBlue: `0 2px 6px ${isDarkMode ? 'rgba(91, 141, 239, 0.25)' : 'rgba(91, 141, 239, 0.15)'}`,
            shadowRed: `0 2px 6px ${isDarkMode ? 'rgba(239, 83, 80, 0.25)' : 'rgba(239, 83, 80, 0.15)'}`,
            shadowGray: 'none'
        };

        // 检查当前面板状态
        const currentPanel = document.getElementById('audio-capture-panel');
        const isCurrentlyMinimized = currentPanel ? currentPanel.style.width === 'auto' || currentPanel.style.padding === '12px' : isMinimized;

        if (!isMonitoring) {
            // 状态: OFF
            if (isCurrentlyMinimized) {
                // 最小化模式
                activeBtn.innerHTML = icons.speaker;
                activeBtn.style.background = 'transparent';
                activeBtn.style.boxShadow = 'none';
                activeBtn.style.color = 'inherit';
                activeBtn.style.opacity = '0.7';
                activeBtn.disabled = false;

                passiveBtn.innerHTML = icons.clock;
                passiveBtn.style.background = 'transparent';
                passiveBtn.style.boxShadow = 'none';
                passiveBtn.style.color = 'inherit';
                passiveBtn.style.opacity = '0.7';
                passiveBtn.disabled = false;
            } else {
                // 展开模式
                activeBtn.innerHTML = `<div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">${icons.speaker} <span>一键获取</span></div>`;
                activeBtn.style.background = styles.green;
                activeBtn.style.boxShadow = styles.shadowGreen;
                activeBtn.style.color = 'white';
                activeBtn.disabled = false;

                passiveBtn.innerHTML = `<div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">${icons.clock} <span>手动获取</span></div>`;
                passiveBtn.style.background = styles.blue;
                passiveBtn.style.boxShadow = styles.shadowBlue;
                passiveBtn.style.color = 'white';
                passiveBtn.disabled = false;
            }

        } else if (isCapturing) {
            // 状态: ACTIVE (一键获取中)
            if (isCurrentlyMinimized) {
                // 最小化模式
                activeBtn.innerHTML = icons.stop;
                activeBtn.style.background = styles.red;
                activeBtn.style.boxShadow = styles.shadowRed;
                activeBtn.style.color = 'white';
                activeBtn.style.opacity = '1';
                activeBtn.disabled = false;

                passiveBtn.innerHTML = icons.clock;
                passiveBtn.style.background = 'transparent';
                passiveBtn.style.boxShadow = 'none';
                passiveBtn.style.color = 'inherit';
                passiveBtn.style.opacity = '0.3';
                passiveBtn.disabled = true;
            } else {
                // 展开模式
                activeBtn.innerHTML = `<div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">${icons.stop} <span>停止获取</span></div>`;
                activeBtn.style.background = styles.red;
                activeBtn.style.boxShadow = styles.shadowRed;
                activeBtn.style.color = 'white';
                activeBtn.disabled = false;

                passiveBtn.innerHTML = `<div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">${icons.clock} <span>手动获取</span></div>`;
                passiveBtn.style.background = styles.gray;
                passiveBtn.style.boxShadow = styles.shadowGray;
                passiveBtn.style.color = theme.disabledColor;
                passiveBtn.disabled = true;
            }

        } else {
            // 状态: PASSIVE (手动监控中)
            if (isCurrentlyMinimized) {
                // 最小化模式
                activeBtn.innerHTML = icons.speaker;
                activeBtn.style.background = 'transparent';
                activeBtn.style.boxShadow = 'none';
                activeBtn.style.color = 'inherit';
                activeBtn.style.opacity = '0.3';
                activeBtn.disabled = true;

                passiveBtn.innerHTML = icons.stop;
                passiveBtn.style.background = styles.red;
                passiveBtn.style.boxShadow = styles.shadowRed;
                passiveBtn.style.color = 'white';
                passiveBtn.style.opacity = '1';
                passiveBtn.disabled = false;
            } else {
                // 展开模式
                activeBtn.innerHTML = `<div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">${icons.speaker} <span>一键获取</span></div>`;
                activeBtn.style.background = styles.gray;
                activeBtn.style.boxShadow = styles.shadowGray;
                activeBtn.style.color = theme.disabledColor;
                activeBtn.disabled = true;

                passiveBtn.innerHTML = `<div style="pointer-events: none; display: flex; align-items: center; justify-content: center; gap: 8px;">${icons.stop} <span>停止监控</span></div>`;
                passiveBtn.style.background = styles.red;
                passiveBtn.style.boxShadow = styles.shadowRed;
                passiveBtn.style.color = 'white';
                passiveBtn.disabled = false;
            }
        }

        // 添加悬停效果（只在非禁用状态下）
        if (!activeBtn.disabled) {
            activeBtn.onmouseover = () => {
                if (!isCurrentlyMinimized) activeBtn.style.transform = 'translateY(-1px)';
                if (isMonitoring && isCapturing) activeBtn.style.background = styles.red;
            };
            activeBtn.onmouseout = () => {
                if (!isCurrentlyMinimized) activeBtn.style.transform = 'translateY(0)';
                if (isMonitoring && isCapturing) activeBtn.style.background = styles.red;
            };
        } else {
            activeBtn.onmouseover = null;
            activeBtn.onmouseout = null;
        }

        if (!passiveBtn.disabled) {
            passiveBtn.onmouseover = () => {
                if (!isCurrentlyMinimized) passiveBtn.style.transform = 'translateY(-1px)';
                if (isMonitoring && !isCapturing) passiveBtn.style.background = styles.red;
            };
            passiveBtn.onmouseout = () => {
                if (!isCurrentlyMinimized) passiveBtn.style.transform = 'translateY(0)';
                if (isMonitoring && !isCapturing) passiveBtn.style.background = styles.red;
            };
        } else {
            passiveBtn.onmouseover = null;
            passiveBtn.onmouseout = null;
        }
    }


    // 同步自动合并checkbox状态
    function syncAutoMergeCheckbox() {
        const checkbox = document.getElementById('auto-merge-toggle');
        if (checkbox) {
            checkbox.checked = autoMergeEnabled;
        }
    }

    // 同步自动清空checkbox状态
    function syncAutoClearCheckbox() {
        const checkbox = document.getElementById('auto-clear-toggle');
        if (checkbox) {
            checkbox.checked = autoClearList;
        }
    }

    // 设置可拖拽
    function setupDraggable(panel) {
        panel.addEventListener('mousedown', (e) => {
            const interactiveElements = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'];
            if (interactiveElements.includes(e.target.tagName) || e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            document.body.style.cursor = 'grabbing';
            panel.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            const finalX = Math.max(0, Math.min(x, maxX));
            const finalY = Math.max(0, Math.min(y, maxY));
            panel.style.left = finalX + 'px';
            panel.style.top = finalY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            panel.style.transition = 'none';
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = '';
                panel.style.cursor = '';
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
                panel.style.transition = 'all 0.3s ease';
                const rect = panel.getBoundingClientRect();
                const newPosition = {
                    bottom: window.innerHeight - rect.bottom,
                    right: window.innerWidth - rect.right
                };

                // 验证并保存位置
                const validatedPosition = validatePanelPosition(newPosition);
                panelPosition = validatedPosition;
                GM_setValue('panelPosition', validatedPosition);
                console.log('保存面板位置:', validatedPosition);
            }
        });
        panel.addEventListener('selectstart', (e) => {
            if (isDragging) e.preventDefault();
        });
    }

    // 页面静音 (不太好用，后续继续开发)
    function mutePageAudio() {
        if (muteInterval) clearInterval(muteInterval);

        const muteAllElements = () => {
            const audioElements = document.querySelectorAll('audio, video');
            audioElements.forEach(element => {
                if (!element.dataset.originalVolume) {
                    element.dataset.originalVolume = element.volume;
                }
                element.volume = 0;
                element.muted = true;
            });
        };

        muteAllElements();
        muteInterval = setInterval(muteAllElements, 500);

        if (window.AudioContext || window.webkitAudioContext) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'running') {
                    audioContext.suspend();
                }
            } catch (e) {
                console.log('无法静音AudioContext:', e);
            }
        }
    }

    // 解除静音并可选择性停止播放
    function unmutePageAudio(shouldClickButton = true) {
        if (muteInterval) clearInterval(muteInterval);
        muteInterval = null;

        const audioElements = document.querySelectorAll('audio, video');
        audioElements.forEach(element => {
            if (element.dataset.originalVolume) {
                element.volume = parseFloat(element.dataset.originalVolume);
                delete element.dataset.originalVolume;
            }
            element.muted = false;
            element.pause();
        });

        if (window.AudioContext || window.webkitAudioContext) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            } catch (e) {
                console.log('无法恢复AudioContext:', e);
            }
        }

        // 只有在主动模式下才点击停止按钮
        if (shouldClickButton) {
            clickAudioToggleButton();
            updateStatus('已恢复页面音频并暂停播放');
        } else {
            updateStatus('已停止监控');
        }
    }

    // 重置自动合并计时器
    function resetAutoMergeTimer() {
        if (autoMergeTimer) clearTimeout(autoMergeTimer);
        if (autoMergeEnabled && capturedAudio.length > 0) {
            autoMergeTimer = setTimeout(() => {
                const now = Date.now();
                const timeSinceLastCapture = lastAudioCaptureTime ? now - lastAudioCaptureTime : 0;
                if (timeSinceLastCapture >= AUTO_MERGE_DELAY && capturedAudio.length > 0) {
                    updateStatus('🤖 自动合并中...');
                    autoMergeAndDownload();
                }
            }, AUTO_MERGE_DELAY);
        }
    }

    // 自动合并并下载
    function autoMergeAndDownload() {
        if (capturedAudio.length === 0) return;
        const indices = capturedAudio.map((_, index) => index);
        const modal = createModal('自动合并进度');
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="text-align: center; margin: 20px 0;">
                <div id="merge-progress-text">🤖 自动合并 ${capturedAudio.length} 个音频文件...</div>
                <div style="margin: 15px 0; background: ${isDarkMode ? '#2d2d2d' : '#f0f0f0'}; border-radius: 4px; overflow: hidden;">
                    <div id="merge-progress-bar" style="width: 0%; height: 20px; background: #0f9d58;"></div>
                </div>
                <div id="merge-status">正在初始化...</div>
            </div>
        `;
        modal.appendChild(content);
        setTimeout(() => {
            startMergeProcess(indices, 'mp3', modal, true);
        }, 500);
    }

    // 更新状态区域
    function updateStatus(message) {
        const statusArea = document.getElementById('status-area');
        if (statusArea) statusArea.textContent = message;
    }

    // 更新音频计数
    function updateAudioCount() {
        // 更新展开模式的计数
        const countElement = document.getElementById('audio-count');
        if (countElement) countElement.textContent = capturedAudio.length;

        // 更新最小化模式的计数气泡
        const countBadge = document.querySelector('.audio-count-badge');
        if (countBadge) countBadge.textContent = capturedAudio.length;
    }

    // 开始监控网络请求
    function startMonitoring() {
        if (isMonitoring) return; // 防止重复挂钩
        isMonitoring = true;

        // 拦截 Audio 和 Video 元素的 src 属性设置
        try {
            const AudioProto = unsafeWindow.HTMLAudioElement.prototype;
            const VideoProto = unsafeWindow.HTMLVideoElement.prototype;
            const MediaProto = unsafeWindow.HTMLMediaElement.prototype;

            // 保存原始的 src 属性描述符
            const originalAudioSrcDescriptor = Object.getOwnPropertyDescriptor(MediaProto, 'src') ||
                                              Object.getOwnPropertyDescriptor(AudioProto, 'src');
            const originalVideoSrcDescriptor = Object.getOwnPropertyDescriptor(MediaProto, 'src') ||
                                              Object.getOwnPropertyDescriptor(VideoProto, 'src');

            // 拦截 Audio 元素的 src 设置
            if (originalAudioSrcDescriptor) {
                Object.defineProperty(AudioProto, 'src', {
                    get: function() {
                        return originalAudioSrcDescriptor.get.call(this);
                    },
                    set: function(value) {
                        if (isMonitoring && value && value.startsWith && value.startsWith('data:')) {
                            setTimeout(() => scanNodeForDataUrls(this), 0);
                        }
                        return originalAudioSrcDescriptor.set.call(this, value);
                    },
                    configurable: true
                });
            }

            // 拦截 Video 元素的 src 设置
            if (originalVideoSrcDescriptor) {
                Object.defineProperty(VideoProto, 'src', {
                    get: function() {
                        return originalVideoSrcDescriptor.get.call(this);
                    },
                    set: function(value) {
                        if (isMonitoring && value && value.startsWith && value.startsWith('data:')) {
                            setTimeout(() => scanNodeForDataUrls(this), 0);
                        }
                        return originalVideoSrcDescriptor.set.call(this, value);
                    },
                    configurable: true
                });
            }
        } catch (e) {
            console.log('无法拦截 Audio/Video src 属性:', e);
        }

        unsafeWindow.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            xhr.open = function() {
                this.url = arguments[1];
                return originalOpen.apply(this, arguments);
            };
            xhr.addEventListener('load', function() {
                if (!isMonitoring) return; // 检查是否仍在监控
                try {
                    const contentType = this.getResponseHeader('Content-Type') || '';
                    const isAudio = contentType.includes('audio') || contentType.includes('octet-stream') || (this.url && this.url.match(/\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i));
                    if (isAudio) {
                        captureAudioFromResponse(this.response, contentType, this.url);
                    }
                } catch (e) { console.error('处理XHR请求时出错:', e); }
            });
            return xhr;
        };

        unsafeWindow.fetch = function() {
            const url = arguments[0] instanceof Request ? arguments[0].url : arguments[0];
            return originalFetch.apply(this, arguments).then(response => {
                if (!isMonitoring) return response; // 检查是否仍在监控
                try {
                    const contentType = response.headers.get('Content-Type') || '';
                    const isAudio = contentType.includes('audio') || contentType.includes('octet-stream') || (url && url.match(/\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i));
                    if (isAudio) {
                        response.clone().arrayBuffer().then(buffer => {
                            captureAudioFromResponse(buffer, contentType, url);
                        });
                    }
                } catch (e) { console.error('处理Fetch请求时出错:', e); }
                return response;
            });
        };

        observer = new MutationObserver(mutations => {
            if (!isMonitoring) return; // 检查是否仍在监控
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO') {
                        // 立即捕获已有的 src
                        if (node.src && node.src.startsWith('data:')) {
                            scanNodeForDataUrls(node);
                        }

                        // 监听 play 事件
                        node.addEventListener('play', () => {
                            if (node.src) captureAudioFromMediaElement(node);
                        });

                        // 监听 loadstart 事件（音频开始加载时触发）
                        node.addEventListener('loadstart', () => {
                            if (node.src && node.src.startsWith('data:')) {
                                scanNodeForDataUrls(node);
                            }
                        });

                        // 监听 canplay 事件（音频可以播放时触发）
                        node.addEventListener('canplay', () => {
                            if (node.src && node.src.startsWith('data:')) {
                                scanNodeForDataUrls(node);
                            }
                        });

                        if (isCapturing && muteInterval) { // 只有主动模式才静音新元素
                            if (!node.dataset.originalVolume) {
                                node.dataset.originalVolume = node.volume;
                            }
                            node.volume = 0;
                            node.muted = true;
                        }
                    }
                    // 扫描新增节点中的 data URL
                    scanNodeForDataUrls(node);
                });
                // 检查属性变化（如元素的 src、href 等属性）
                if (mutation.type === 'attributes' && mutation.target) {
                    const target = mutation.target;
                    // 特别处理 Audio/Video 元素的 src 变化
                    if ((target.nodeName === 'AUDIO' || target.nodeName === 'VIDEO') &&
                        mutation.attributeName === 'src' &&
                        target.src &&
                        target.src.startsWith('data:')) {
                        scanNodeForDataUrls(target);
                    } else {
                        scanNodeForDataUrls(target);
                    }
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'href', 'data-src', 'data-url']
        });

        document.querySelectorAll('audio, video').forEach(mediaElement => {
            // 立即检查现有的 src
            if (mediaElement.src && mediaElement.src.startsWith('data:')) {
                scanNodeForDataUrls(mediaElement);
            }

            // 监听 play 事件
            mediaElement.addEventListener('play', () => {
                if (mediaElement.src) captureAudioFromMediaElement(mediaElement);
            });

            // 监听 loadstart 事件
            mediaElement.addEventListener('loadstart', () => {
                if (mediaElement.src && mediaElement.src.startsWith('data:')) {
                    scanNodeForDataUrls(mediaElement);
                }
            });

            // 监听 canplay 事件
            mediaElement.addEventListener('canplay', () => {
                if (mediaElement.src && mediaElement.src.startsWith('data:')) {
                    scanNodeForDataUrls(mediaElement);
                }
            });
        });

        scanPageForDataUrls();

        // 启动定期扫描（每500ms扫描一次新的 data URL）
        startDataUrlScanning();
    }

    // 启动定期扫描 data URL
    function startDataUrlScanning() {
        if (dataUrlScanInterval) return; // 防止重复启动
        dataUrlScanInterval = setInterval(() => {
            if (!isMonitoring) {
                stopDataUrlScanning();
                return;
            }
            scanPageForDataUrls();
        }, 500); // 每500ms扫描一次
    }

    // 停止定期扫描 data URL
    function stopDataUrlScanning() {
        if (dataUrlScanInterval) {
            clearInterval(dataUrlScanInterval);
            dataUrlScanInterval = null;
        }
    }

    // 停止监控
    function stopMonitoring() {
        if (!isMonitoring) return; // 防止重复卸载
        isMonitoring = false;
        unsafeWindow.XMLHttpRequest = originalXHR;
        unsafeWindow.fetch = originalFetch;
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        stopDataUrlScanning(); // 停止定期扫描
    }

    // 从响应捕获音频
    function captureAudioFromResponse(response, contentType, url) {
        if (!isMonitoring) return; // 最终检查
        if (capturedAudio.some(audio => audio.url === url)) return;
        const audioItem = {
            id: generateId(), source: 'network', url: url, contentType: contentType,
            timestamp: new Date().toISOString(), data: response,
            format: guessAudioFormat(contentType, url),
            size: response ? (response.byteLength || 0) : 0
        };
        capturedAudio.push(audioItem);
        lastAudioCaptureTime = Date.now();
        updateAudioCount();
        saveAudioData();
        updateStatus(`捕获到新音频: ${getShortUrl(url)}`);
        resetAutoMergeTimer();
    }

    // 从媒体元素捕获音频
    function captureAudioFromMediaElement(mediaElement) {
        if (!isMonitoring) return; // 最终检查
        if (capturedAudio.some(audio => audio.url === mediaElement.src)) return;
        const audioItem = {
            id: generateId(), source: 'media', url: mediaElement.src, contentType: 'audio/media',
            timestamp: new Date().toISOString(), mediaElement: mediaElement,
            format: 'mp3', size: 'unknown'
        };
        capturedAudio.push(audioItem);
        lastAudioCaptureTime = Date.now();
        updateAudioCount();
        saveAudioData();
        updateStatus(`捕获到媒体元素音频: ${getShortUrl(mediaElement.src)}`);
        resetAutoMergeTimer();
    }

    // 生成唯一ID
    function generateId() {
        return 'audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 获取简短URL
    function getShortUrl(url) {
        if (!url) return 'unknown';
        if (url.startsWith('data:')) return 'data:URL';
        try {
            const path = new URL(url).pathname;
            return path.length > 20 ? path.substr(0, 17) + '...' : path;
        } catch (e) {
            return url.substr(0, 20) + '...';
        }
    }

    // 猜测音频格式
    function guessAudioFormat(contentType, url) {
        if (contentType.includes('mpeg') || contentType.includes('mp3')) return 'mp3';
        if (contentType.includes('wav')) return 'wav';
        if (contentType.includes('ogg')) return 'ogg';
        if (contentType.includes('aac')) return 'aac';
        if (contentType.includes('flac')) return 'flac';
        if (url) {
            if (url.match(/\.mp3($|\?)/i)) return 'mp3';
            if (url.match(/\.wav($|\?)/i)) return 'wav';
            if (url.match(/\.ogg($|\?)/i)) return 'ogg';
            if (url.match(/\.aac($|\?)/i)) return 'aac';
            if (url.match(/\.flac($|\?)/i)) return 'flac';
        }
        return 'mp3';
    }

    // 保存音频数据
    function saveAudioData() {
        try {
            const serializedData = capturedAudio.map(({ id, source, url, contentType, timestamp, format, size }) =>
                ({ id, source, url, contentType, timestamp, format, size }));
            GM_setValue('capturedAudioMeta', JSON.stringify(serializedData));
        } catch (e) { console.error('保存音频元数据时出错:', e); }
    }

    // 加载音频元数据
    function loadAudioData() {
        try {
            const data = GM_getValue('capturedAudioMeta');
            if (data) {
                capturedAudio = JSON.parse(data);
                updateAudioCount();
            }
        } catch (e) { console.error('加载音频元数据时出错:', e); }
    }

    // 扫描单个节点中的 data URL
    function scanNodeForDataUrls(node) {
        if (!node) return;

        // Shadow DOM支持
        if (node.shadowRoot) {
            scanNodeForDataUrls(node.shadowRoot);
        }

        // 如果是元素节点或文档片段，检查其属性
        if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            // 检查常见的包含 URL 的属性
            const attributes = ['src', 'href', 'data-src', 'data-url', 'data-audio'];
            attributes.forEach(attr => {
                const value = node.getAttribute?.(attr);
                if (value && value.startsWith('data:application/octet-stream;base64,')) {
                    if (!capturedAudio.some(audio => audio.url === value)) {
                        validateAudioDataUrl(value, () => captureDataUrl(value, 'application/octet-stream'));
                    }
                } else if (value && value.match(/^data:audio\/[^;]+;base64,/)) {
                    if (!capturedAudio.some(audio => audio.url === value)) {
                        const mimeType = value.split(';')[0].split(':')[1];
                        validateAudioDataUrl(value, () => captureDataUrl(value, mimeType));
                    }
                }
            });

            // 递归扫描子节点
            node.childNodes?.forEach(child => scanNodeForDataUrls(child));
        }

        // 如果是文本节点，检查其内容
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const dataUrlRegex = /data:(application\/octet-stream|audio\/[^;]+);base64,([\sA-Za-z0-9+/=]{40,})/gi;
            let match;
            while ((match = dataUrlRegex.exec(node.textContent)) !== null) {
                const dataUrl = `data:${match[1]};base64,${match[2].replace(/\s+/g, '')}`;
                if (!capturedAudio.some(audio => audio.url === dataUrl)) {
                    validateAudioDataUrl(dataUrl, () => captureDataUrl(dataUrl, match[1]));
                }
            }
        }
    }

    // 扫描页面中的data URLs
    function scanPageForDataUrls() {
        const dataUrlRegex = /data:(application\/octet-stream|audio\/[^;]+);base64,([\sA-Za-z0-9+/=]{40,})/gi;
        let match;
        const content = document.documentElement.innerHTML || '';
        while ((match = dataUrlRegex.exec(content)) !== null) {
            const dataUrl = `data:${match[1]};base64,${match[2].replace(/\s+/g, '')}`;
            if (!capturedAudio.some(audio => audio.url === dataUrl)) {
                validateAudioDataUrl(dataUrl, () => captureDataUrl(dataUrl, match[1]));
            }
        }
    }

    // 深度扫描整个DOM，强行读取所有data音频
    function performDeepScanForDataAudio() {
        const beforeCount = capturedAudio.length;
        try {
            scanNodeForDataUrls(document.body);
            scanPageForDataUrls();
            document.querySelectorAll('audio, video').forEach(node => {
                if (node.src && node.src.startsWith('data:')) {
                    scanNodeForDataUrls(node);
                }
            });
            document.querySelectorAll('iframe').forEach(frame => {
                try {
                    const doc = frame.contentDocument || frame.contentWindow?.document;
                    if (doc) {
                        scanNodeForDataUrls(doc.body);
                    }
                } catch (err) {
                    // 跨域iframe会抛错，忽略
                }
            });
        } catch (e) {
            console.error('深度扫描时出错:', e);
        }
        const added = capturedAudio.length - beforeCount;
        if (added > 0) {
            saveAudioData();
            updateAudioCount();
        }
        return added;
    }

    // 验证数据URL
    function validateAudioDataUrl(dataUrl, callback) {
        const audio = new Audio();
        audio.onloadedmetadata = () => { if (audio.duration > 0) callback(); };
        audio.onerror = () => {
            try {
                fetch(dataUrl).then(r => r.arrayBuffer()).then(buffer => {
                    if (checkAudioSignature(buffer)) callback();
                });
            } catch (e) {}
        };
        audio.src = dataUrl;
    }

    // 捕获data URL
    function captureDataUrl(dataUrl, mimeType) {
        if (!isMonitoring) {
            // 即使不在监控状态，也允许手动添加
            console.log('手动添加data URL音频');
        }

        // 检查是否已存在相同的URL
        if (capturedAudio.some(audio => audio.url === dataUrl)) {
            updateStatus('⚠ 该音频已在捕获列表中');
            return;
        }

        const audioItem = {
            id: generateId(),
            source: 'dataUrl',
            url: dataUrl,
            contentType: mimeType,
            timestamp: new Date().toISOString(),
            format: guessAudioFormat(mimeType, null),
            size: 'embedded'
        };

        capturedAudio.push(audioItem);
        lastAudioCaptureTime = Date.now();
        updateAudioCount();
        saveAudioData();

        // 不在监控状态时也重置自动合并计时器
        if (autoMergeEnabled && capturedAudio.length > 0) {
            resetAutoMergeTimer();
        }
    }

    // 检查音频签名
    function checkAudioSignature(buffer) {
        if (!buffer || buffer.byteLength < 8) return false;
        const view = new Uint8Array(buffer.slice(0, 16));
        const signatures = {
            'ID3': [0x49, 0x44, 0x33], 'MP3': [0xFF, 0xFB], 'RIFF': [0x52, 0x49, 0x46, 0x46],
            'OGG': [0x4F, 0x67, 0x67, 0x53], 'FLAC': [0x66, 0x4C, 0x61, 0x43],
            'M4A': [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], 'FLV': [0x46, 0x4C, 0x56, 0x01]
        };
        for (const sig of Object.values(signatures)) {
            if (sig.every((byte, i) => view[i] === byte)) return true;
        }
        try {
            const text = new TextDecoder('utf-8').decode(new Uint8Array(buffer.slice(0, 100)));
            return text.includes('Lavf') || text.includes('matroska') || text.includes('webm');
        } catch (e) { return false; }
    }

    // 从data URL解析
    function downloadFromDataUrl() {
        const audioDataUrl = prompt("请粘贴data:application/octet-stream;base64,开头的URL:", "");
        if (!audioDataUrl || !audioDataUrl.startsWith('data:')) {
            if (audioDataUrl) { // 如果用户输入了内容但不是data URL
                alert('请提供有效的data URL，格式为: data:application/octet-stream;base64,...');
            }
            return;
        }

        try {
            // 验证数据URL格式
            if (!audioDataUrl.includes('base64,')) {
                alert('数据URL格式不正确，必须包含base64编码的数据');
                return;
            }

            // 提取MIME类型
            const mimeTypeMatch = audioDataUrl.match(/^data:([^;]+);/);
            const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';

            // 捕获到列表但不下载
            captureDataUrl(audioDataUrl, mimeType);
            updateStatus('✓ 音频已添加到捕获列表');

            // 可选：自动打开捕获列表让用户查看
            setTimeout(() => {
                if (capturedAudio.length > 0) {
                    showAudioManagementWindow();
                }
            }, 500);

        } catch (error) {
            console.error('处理data URL失败:', error);
            alert('处理data URL失败: ' + error.message);
            updateStatus('⚠ 处理data URL失败');
        }
    }

    // 处理Base64
    function handleBase64FromRequest() {
        const modal = createModal('处理Base64数据', {
            width: '95%',
            maxWidth: '420px',
            maxHeight: '70vh',
            stack: true,
            backdropOpacity: 0.35
        });
        const theme = getThemeStyles();
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="margin-bottom: 16px;">
                <div style="font-size: 13px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; margin-bottom: 8px;">
                    将Base64文本粘贴到下面的输入框中，支持直接包含 data:audio/*;base64, 前缀的数据。
                </div>
                <textarea id="base64-input" placeholder="在此粘贴base64编码的音频数据"
                    style="width: 100%; height: 150px; padding: 12px; background: ${theme.buttonBg}; color: ${theme.color};
                    border: 1px solid ${theme.border}; border-radius: 6px; font-size: 13px; font-family: monospace;
                    resize: vertical; box-sizing: border-box; transition: all 0.2s;"
                    onfocus="this.style.borderColor='#3b82f6'; this.style.background='${isDarkMode ? '#1f2937' : '#ffffff'}'"
                    onblur="this.style.borderColor='${theme.border}'; this.style.background='${theme.buttonBg}'"></textarea>
                <div style="font-size: 11px; color: ${isDarkMode ? '#6b7280' : '#9ca3af'}; margin-top: 6px; padding-left: 4px;">
                    💡 如果文本中包含 data:audio/...;base64, 前缀，会自动提取并识别格式。
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
                <label for="format-select" style="font-size: 13px; color: ${isDarkMode ? '#d1d5db' : '#4b5563'};">保存格式:</label>
                <select id="format-select" style="padding: 10px 12px; background: ${theme.buttonBg}; color: ${theme.color};
                    border: 1px solid ${theme.border}; border-radius: 6px; font-size: 13px; transition: all 0.2s;"
                    onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='${theme.border}'">
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                    <option value="flac">FLAC</option>
                </select>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button id="cancel-base64" style="padding: 10px 20px; background: ${theme.buttonBg}; color: ${theme.color};
                    border: 1px solid ${theme.border}; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;"
                    onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                    取消
                </button>
                <button id="process-base64-btn" style="padding: 10px 20px; background: ${theme.primaryBg}; color: white;
                    border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s;
                    display: flex; align-items: center; gap: 6px;"
                    onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    ${icons.download} <span>处理并下载</span>
                </button>
            </div>
        `;
        modal.appendChild(content);
        document.getElementById('cancel-base64').addEventListener('click', () => closeModal(modal));
        document.getElementById('process-base64-btn').addEventListener('click', () => {
            const base64Data = document.getElementById('base64-input').value.trim();
            if (!base64Data) { alert('请输入base64数据'); return; }
            let cleanBase64 = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
            try {
                atob(cleanBase64.substring(0, 10)); // 验证
                const format = document.getElementById('format-select').value;
                const mimeTypes = {'mp3': 'audio/mpeg', 'wav': 'audio/wav', 'ogg': 'audio/ogg', 'flac': 'audio/flac'};
                const dataUrl = `data:${mimeTypes[format] || 'application/octet-stream'};base64,${cleanBase64}`;
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `${fileNamePrefix}_${Date.now()}.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                captureDataUrl(dataUrl, mimeTypes[format]);
                closeModal(modal);
                updateStatus('音频处理并下载成功');
            } catch (e) { alert('无效的base64数据: ' + e.message); }
        });
    }

    // 复制Base64数据
    async function copyAudioData(id) {
        const audio = capturedAudio.find(a => a.id === id);
        if (!audio) {
            updateStatus('⚠ 未找到音频数据');
            return;
        }

        const btn = document.querySelector(`.copy-btn[data-id="${id}"]`);
        const originalHtml = btn ? btn.innerHTML : '';

        if (btn) {
            btn.innerHTML = `...`;
            btn.disabled = true;
        }

        try {
            let base64Data;
            if (audio.source === 'dataUrl') {
                if (audio.url.includes('base64,')) {
                    base64Data = audio.url.split('base64,')[1];
                } else {
                    updateStatus('⚠ 无法复制非Base64的Data URL');
                    if (btn) btn.innerHTML = originalHtml;
                    return;
                }
            } else if (audio.data instanceof ArrayBuffer || audio.url) {
                // 需要先获取缓冲区
                const buffer = await getAudioBuffer(audio);

                // 将ArrayBuffer转换为Base64
                const bytes = new Uint8Array(buffer);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                base64Data = window.btoa(binary);
            } else {
                updateStatus('⚠ 无法获取音频数据');
                if (btn) btn.innerHTML = originalHtml;
                return;
            }

            await navigator.clipboard.writeText(base64Data);
            const shortId = id.split('_')[1] || id;
            updateStatus(`✓ 音频 #${shortId} 的Base64已复制`);

            // 显示"已复制"的临时状态
            if (btn) {
                btn.innerHTML = `${icons.check} 已复制`;
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.disabled = false;
                }, 2000);
            }

        } catch (err) {
            console.error('复制Base64失败:', err);
            updateStatus('⚠ 复制失败: ' + err.message);
            alert('复制失败。请检查控制台获取更多信息。');
            if (btn) {
                btn.innerHTML = originalHtml;
                btn.disabled = false;
            }
        }
    }

    // 显示已捕获音频管理窗口
    function showAudioManagementWindow(options = {}) {
        // 注入拖拽排序样式
        injectCustomScrollbarStyles();

        const theme = getThemeStyles();
        const parseButtonBorderColor = isDarkMode ? '#4b5563' : theme.border;
        const parseButtonTextColor = isDarkMode ? '#f3f4f6' : '#111827';
        const parseButtonBaseStyle = `
            padding: 12px 16px;
            background: transparent;
            color: ${parseButtonTextColor};
            border: 1px solid ${parseButtonBorderColor};
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: opacity 0.2s, border-color 0.2s;
            white-space: nowrap;
        `;
        const parseButtonLargeStyle = `${parseButtonBaseStyle} justify-content: center; gap: 8px; font-size: 14px;`;
        const parseButtonHoverOpacity = isDarkMode ? '0.85' : '0.75';
        const shouldAutoSelectAll = !!options.autoSelectAll;

        // 如果列表为空，显示添加音频的选项
        if (capturedAudio.length === 0) {
            const modal = createModal('已捕获音频管理');
            const content = document.createElement('div');
            content.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};">
                    <div style="font-size: 48px; margin-bottom: 12px;">🎵</div>
                    <div style="font-size: 14px; margin-bottom: 8px;">暂无捕获的音频</div>
                    <div style="font-size: 12px; opacity: 0.7; margin-bottom: 20px;">您可以通过以下方式添加音频</div>
                    <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px; margin: 0 auto;">
                        <button id="parse-url-btn" style="${parseButtonLargeStyle}"
                            onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                            ${icons.link} <span>解析URL添加音频</span>
                        </button>
                        <button id="parse-base64-btn" style="${parseButtonLargeStyle}"
                            onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                            ${icons.code} <span>解析Base64文本</span>
                        </button>
                        <button id="deep-scan-empty" style="${parseButtonLargeStyle}"
                            onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                            ${icons.search} <span style="font-weight: 400;">深度扫描</span>
                        </button>
                        <div style="font-size: 11px; opacity: 0.7; text-align: center;">
                            或使用主面板的"一键获取"或"手动获取"功能
                        </div>
                    </div>
                </div>
                <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                    <button id="close-empty-list" style="padding: 8px 16px; background: ${theme.buttonBg}; color: ${theme.color};
                        border: 1px solid ${theme.border}; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;"
                        onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                        关闭
                    </button>
                </div>
            `;
            modal.appendChild(content);

            document.getElementById('close-empty-list').addEventListener('click', () => closeModal(modal));
            document.getElementById('parse-url-btn').addEventListener('click', () => {
                closeModal(modal);
                showParseUrlDialog();
            });
            document.getElementById('parse-base64-btn').addEventListener('click', () => {
                closeModal(modal);
                handleBase64FromRequest();
            });
            document.getElementById('deep-scan-empty').addEventListener('click', () => {
                const added = performDeepScanForDataAudio();
                if (added > 0) {
                    updateStatus(`深度扫描完成，新增 ${added} 个音频`);
                    closeModal(modal);
                    showAudioManagementWindow({ autoSelectAll: shouldAutoSelectAll });
                } else {
                    updateStatus('深度扫描完成，未发现新的音频');
                }
            });

            return;
        }

        // 完整的音频管理窗口
        const modal = createModal('已捕获音频管理');
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="margin-bottom: 16px;">
                <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
                    <div style="position: relative; flex: 1;">
                        <input type="text" id="search-audio" placeholder="🔍 搜索音频..."
                            style="width: 100%; padding: 12px 16px; background: ${theme.buttonBg}; color: ${theme.color};
                            border: 1px solid ${theme.border}; border-radius: 8px; font-size: 14px; transition: all 0.2s;"
                            onfocus="this.style.borderColor='#3b82f6'; this.style.background='${isDarkMode ? '#1f2937' : '#ffffff'}'"
                            onblur="this.style.borderColor='${theme.border}'; this.style.background='${theme.buttonBg}'">
                    </div>
                    <button id="parse-url-in-list" style="${parseButtonBaseStyle}"
                        onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                        ${icons.link} <span>解析URL</span>
                    </button>
                    <button id="parse-base64-in-list" style="${parseButtonBaseStyle}"
                        onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                        ${icons.code} <span>解析Base64</span>
                    </button>
                    <button id="deep-scan-btn" style="${parseButtonBaseStyle}"
                        onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                        ${icons.search} <span style="font-weight: 400;">深度扫描</span>
                    </button>
                </div>

                <!-- 合并下载区域 -->
                <div style="background: ${isDarkMode ? '#1f2937' : '#f3f4f6'}; padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="font-size: 14px; color: ${theme.color}; margin-bottom: 8px; font-weight: 500;">
                        📦 合并下载 (${capturedAudio.length} 个音频)
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <input type="text" id="merge-range" placeholder="例如: 1-5,7,9-12"
                            style="flex: 1; min-width: 150px; padding: 10px 12px; background: ${theme.buttonBg}; color: ${theme.color};
                            border: 1px solid ${theme.border}; border-radius: 6px; font-size: 14px; transition: all 0.2s;"
                            onfocus="this.style.borderColor='#3b82f6'; this.style.background='${isDarkMode ? '#1f2937' : '#ffffff'}'"
                            onblur="this.style.borderColor='${theme.border}'; this.style.background='${theme.buttonBg}'">
                        <select id="merge-format" style="padding: 10px 12px; background: ${theme.buttonBg}; color: ${theme.color};
                            border: 1px solid ${theme.border}; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s;"
                            onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='${theme.border}'">
                            <option value="mp3">MP3</option>
                            <option value="wav">WAV</option>
                        </select>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                                <button id="select-all-btn" style="padding: 10px 16px; background: ${theme.buttonBg}; color: ${theme.color};
                                    border: 1px solid ${theme.border}; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; white-space: nowrap;
                                    display: flex; align-items: center; justify-content: center; gap: 6px;"
                                    onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                                    ${icons.check} <span>全选</span>
                                </button>
                                <button id="deselect-all-btn" style="padding: 10px 16px; background: ${theme.buttonBg}; color: ${theme.color};
                                    border: 1px solid ${theme.border}; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; white-space: nowrap;
                                    display: flex; align-items: center; justify-content: center; gap: 6px;"
                                    onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                                    ${icons.close} <span>全不选</span>
                                </button>
                            </div>
                            <button id="start-merge" style="padding: 10px 20px; background: ${theme.successBg};
                                color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;
                                transition: all 0.2s; box-shadow: 0 2px 6px ${isDarkMode ? 'rgba(102, 187, 106, 0.25)' : 'rgba(102, 187, 106, 0.15)'};
                                display: flex; align-items: center; justify-content: center; gap: 8px;"
                                onmouseover="this.style.transform='translateY(-1px)'; this.style.background='${theme.successHover}'; this.style.boxShadow='0 4px 10px ${isDarkMode ? 'rgba(102, 187, 106, 0.3)' : 'rgba(102, 187, 106, 0.2)'}'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.background='${theme.successBg}'; this.style.boxShadow='0 2px 6px ${isDarkMode ? 'rgba(102, 187, 106, 0.25)' : 'rgba(102, 187, 106, 0.15)'}'">
                                ${icons.download} <span>合并下载</span>
                            </button>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: ${isDarkMode ? '#6b7280' : '#9ca3af'}; margin-top: 6px; padding-left: 4px;">
                        💡 拖拽音频项可重新排序，范围格式: 单个数字(如5)、范围(如1-5)或组合(如1-3,5,7-9)
                    </div>
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button id="close-audio-list" style="padding: 8px 16px; background: ${theme.buttonBg}; color: ${theme.color};
                        border: 1px solid ${theme.border}; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;"
                        onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                        关闭
                    </button>
                    <button id="clear-all" style="padding: 8px 16px; background: ${theme.dangerBg}; color: white;
                        border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s;"
                        onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                        清空列表
                    </button>
                </div>
            </div>
            <div id="audio-list-container" style="max-height: calc(75vh - 260px); overflow-y: auto; margin-top: 16px;"></div>
        `;
        modal.appendChild(content);

        document.getElementById('close-audio-list').addEventListener('click', () => closeModal(modal));
        document.getElementById('parse-url-in-list').addEventListener('click', () => {
            showParseUrlDialog();
        });
        document.getElementById('parse-base64-in-list').addEventListener('click', () => {
            handleBase64FromRequest();
        });
        document.getElementById('deep-scan-btn').addEventListener('click', () => {
            const searchInput = document.getElementById('search-audio');
            const currentSearch = searchInput ? searchInput.value : '';
            const added = performDeepScanForDataAudio();
            renderAudioList(currentSearch);
            const rangeInputEl = document.getElementById('merge-range');
            if (rangeInputEl) {
                if (rangeInputEl.value.trim()) {
                    rangeInputEl.dispatchEvent(new Event('input'));
                } else if (shouldAutoSelectAll) {
                    selectAllForMerge();
                }
            }
            updateStatus(added > 0 ? `深度扫描完成，新增 ${added} 个音频` : '深度扫描完成，未发现新的音频');
        });

        // 清空列表（无确认）
        document.getElementById('clear-all').addEventListener('click', function() {
            capturedAudio = [];
            updateAudioCount();
            saveAudioData();
            closeModal(modal);
            updateStatus('已清空音频列表');
        });

        renderAudioList();

        document.getElementById('search-audio').addEventListener('input', function() {
            renderAudioList(this.value);
        });

        const selectAllForMerge = () => {
            const mergeRangeInput = document.getElementById('merge-range');
            if (!mergeRangeInput) return;
            if (capturedAudio.length === 0) {
                mergeRangeInput.value = '';
                document.querySelectorAll('.merge-select').forEach(cb => { cb.checked = false; });
                return;
            }
            mergeRangeInput.value = `1-${capturedAudio.length}`;
            document.querySelectorAll('.merge-select').forEach(cb => { cb.checked = true; });
        };

        const clearAllSelections = () => {
            const mergeRangeInput = document.getElementById('merge-range');
            if (mergeRangeInput) mergeRangeInput.value = '';
            document.querySelectorAll('.merge-select').forEach(cb => { cb.checked = false; });
        };

        if (shouldAutoSelectAll) {
            selectAllForMerge();
        }

        // 全选按钮
        document.getElementById('select-all-btn').addEventListener('click', () => {
            selectAllForMerge();
        });

        const deselectButton = document.getElementById('deselect-all-btn');
        if (deselectButton) {
            deselectButton.addEventListener('click', () => {
                clearAllSelections();
            });
        }

        // 合并下载按钮
        document.getElementById('start-merge').addEventListener('click', () => {
            const range = document.getElementById('merge-range').value.trim();
            if (!range) {
                alert('⚠ 请选择要合并的音频范围');
                return;
            }
            const indices = parseRangeString(range, capturedAudio.length);
            if (indices.length === 0) {
                alert('⚠ 未选择任何有效的音频');
                return;
            }
            const format = document.getElementById('merge-format').value;
            mergeAudio(indices, format);
            closeModal(modal);
        });

        // 范围输入和复选框联动
        const rangeInput = document.getElementById('merge-range');
        rangeInput.addEventListener('input', function() {
            const indices = parseRangeString(this.value.trim(), capturedAudio.length);
            document.querySelectorAll('.merge-select').forEach(cb => {
                cb.checked = indices.includes(parseInt(cb.getAttribute('data-index')));
            });
        });

        function renderAudioList(searchTerm = '') {
            const theme = getThemeStyles();
            const container = document.getElementById('audio-list-container');
            container.innerHTML = '';

            // 添加使用提示
            if (capturedAudio.length > 0 && !searchTerm) {
                const tipElement = document.createElement('div');
                tipElement.style.cssText = `
                    background: ${isDarkMode ? '#1f2937' : '#f0f9ff'};
                    border: 1px solid ${isDarkMode ? '#374151' : '#bae6fd'};
                    border-radius: 6px;
                    padding: 12px;
                    margin-bottom: 12px;
                    font-size: 12px;
                    color: ${isDarkMode ? '#9ca3af' : '#0369a1'};
                `;
                const dragIconInline = `<span style="display:inline-flex; align-items:center; vertical-align:middle; color: ${theme.primaryBg}; font-weight: 500;">${icons.sort}</span>`;
                tipElement.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                        <span style="font-size: 14px; line-height: 1;">💡</span>
                        <div style="line-height: 1.6; word-break: break-word;">
                            <strong>提示：</strong>拖拽 ${dragIconInline} 图标可重新排序音频，勾选复选框选择要合并的音频。
                        </div>
                    </div>
                `;
                container.appendChild(tipElement);
            }

            const filteredAudio = searchTerm ?
                capturedAudio.filter(a => (a.url && a.url.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                        a.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        a.source.toLowerCase().includes(searchTerm.toLowerCase())) :
                capturedAudio;

            if (filteredAudio.length === 0) {
                container.innerHTML = `<div style="text-align: center; padding: 40px 20px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};">
                    <div style="font-size: 48px; margin-bottom: 12px;">${searchTerm ? '🔍' : '🎵'}</div>
                    <div style="font-size: 14px; margin-bottom: 8px;">${searchTerm ? '没有匹配的音频' : '暂无捕获的音频'}</div>
                    ${!searchTerm ? `
                        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px;">
                            <button id="parse-url-empty" style="${parseButtonBaseStyle}"
                                onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                                ${icons.link} <span>解析URL</span>
                            </button>
                            <button id="parse-base64-empty" style="${parseButtonBaseStyle}"
                                onmouseover="this.style.opacity='${parseButtonHoverOpacity}'" onmouseout="this.style.opacity='1'">
                                ${icons.code} <span>解析Base64</span>
                            </button>
                        </div>
                    ` : ''}
                </div>`;

                if (!searchTerm) {
                    document.getElementById('parse-url-empty').addEventListener('click', () => {
                        showParseUrlDialog();
                    });
                    document.getElementById('parse-base64-empty').addEventListener('click', () => {
                        handleBase64FromRequest();
                    });
                }
                return;
            }

            // 渲染音频列表
            filteredAudio.forEach((audio, index) => {
                const originalIndex = capturedAudio.findIndex(a => a.id === audio.id);
                const item = document.createElement('div');
                item.className = 'audio-item';
                item.setAttribute('data-id', audio.id);
                item.setAttribute('draggable', 'true');
                item.style.cssText = `
                    background: ${isDarkMode ? '#2d2d2d' : '#f9fafb'};
                    border: 1px solid ${theme.border};
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                    cursor: move;
                `;

                const date = new Date(audio.timestamp).toLocaleString();
                const size = typeof audio.size === 'number' ? (audio.size / 1024).toFixed(2) + ' KB' : audio.size;

                item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div class="drag-handle" style="display: flex; align-items: center; padding: 4px;">
                            ${icons.sort}
                        </div>
                        <input type="checkbox" class="merge-select" data-index="${originalIndex}"
                            style="cursor: pointer; width: 16px; height: 16px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="background: ${theme.primaryBg}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                #${originalIndex + 1}
                            </span>
                            <span style="font-weight: 600; font-size: 14px;">${audio.format.toUpperCase()}</span>
                        </div>
                        <div style="flex: 1;"></div>
                        <div style="font-size: 11px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};">${date}</div>
                    </div>
                    <div title="${audio.url}" style="font-size: 12px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};
                        word-break: break-all; margin-bottom: 8px; padding: 6px 8px; background: ${isDarkMode ? '#1f2937' : '#ffffff'};
                        border-radius: 4px; font-family: monospace;">
                        ${getShortUrl(audio.url)}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <div style="font-size: 11px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'};">
                            来源: ${audio.source} | 大小: ${size}
                        </div>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            <button class="download-btn" data-id="${audio.id}" style="padding: 6px 12px; background: ${theme.primaryBg};
                                color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;
                                display: flex; align-items: center; gap: 4px;"
                                onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                                ${icons.download} 下载
                            </button>
                            <button class="copy-btn" data-id="${audio.id}" style="padding: 6px 12px; background: ${theme.buttonBg};
                                color: ${theme.color}; border: 1px solid ${theme.border}; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;
                                display: flex; align-items: center; gap: 4px;"
                                onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                                ${icons.copy} 复制
                            </button>
                            <button class="remove-btn" data-id="${audio.id}" style="padding: 6px 12px; background: ${isDarkMode ? '#7f1d1d' : '#fee2e2'};
                                color: ${isDarkMode ? '#fca5a5' : '#dc2626'}; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s;
                                display: flex; align-items: center; gap: 4px;"
                                onmouseover="this.style.background='${isDarkMode ? '#991b1b' : '#fecaca'}'" onmouseout="this.style.background='${isDarkMode ? '#7f1d1d' : '#fee2e2'}'">
                                ${icons.trash} 删除
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(item);

                // 设置拖拽事件
                setupDragAndDrop(item, originalIndex);
            });

            // 设置复选框变化事件
            document.querySelectorAll('.merge-select').forEach(cb => {
                cb.addEventListener('change', () => {
                    const selectedIndices = Array.from(document.querySelectorAll('.merge-select:checked'))
                        .map(c => parseInt(c.getAttribute('data-index')));
                    rangeInput.value = generateRangeString(selectedIndices);
                });
            });

            document.querySelectorAll('.download-btn').forEach(btn => btn.addEventListener('click', function() {
                downloadAudio(this.getAttribute('data-id'));
            }));
            document.querySelectorAll('.copy-btn').forEach(btn => btn.addEventListener('click', function() {
                copyAudioData(this.getAttribute('data-id'));
            }));
            document.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', function() {
                removeAudio(this.getAttribute('data-id'));
                renderAudioList(searchTerm);
            }));
        }

        function setupDragAndDrop(item, currentIndex) {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', currentIndex);
                item.classList.add('dragging');
                setTimeout(() => {
                    item.style.opacity = '0.4';
                }, 0);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                item.style.opacity = '1';
                // 更新所有复选框的data-index属性
                document.querySelectorAll('.audio-item').forEach((el, index) => {
                    const checkbox = el.querySelector('.merge-select');
                    if (checkbox) {
                        checkbox.setAttribute('data-index', index);
                    }
                    const indexBadge = el.querySelector('span[style*="background"]');
                    if (indexBadge) {
                        indexBadge.textContent = `#${index + 1}`;
                    }
                });
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');

                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = currentIndex;

                if (fromIndex !== toIndex) {
                    // 重新排序数组
                    const [movedItem] = capturedAudio.splice(fromIndex, 1);
                    capturedAudio.splice(toIndex, 0, movedItem);

                    // 保存数据
                    saveAudioData();

                    // 重新渲染列表
                    renderAudioList(document.getElementById('search-audio').value);

                    updateStatus(`音频 #${fromIndex + 1} 已移动到位置 #${toIndex + 1}`);
                }
            });
        }

        function downloadAudio(id) {
            const audio = capturedAudio.find(a => a.id === id);
            if (!audio) return;
            if (audio.source === 'dataUrl') {
                const a = document.createElement('a');
                a.href = audio.url;
                a.download = `${fileNamePrefix}_${Date.now()}.${audio.format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                updateStatus(`已下载音频 #${capturedAudio.findIndex(a => a.id === id) + 1}`);
            } else if (audio.url) {
                GM_download({
                    url: audio.url,
                    name: `${fileNamePrefix}_${Date.now()}.${audio.format}`,
                    onload: () => updateStatus(`已下载音频 #${capturedAudio.findIndex(a => a.id === id) + 1}`),
                    onerror: (e) => {
                        console.error('下载失败:', e);
                        updateStatus('下载失败');
                    }
                });
            }
        }

        function removeAudio(id) {
            const index = capturedAudio.findIndex(a => a.id === id);
            if (index !== -1) {
                capturedAudio.splice(index, 1);
                updateAudioCount();
                saveAudioData();
                updateStatus('已删除音频');
            }
        }
    }

    // 解析URL对话框函数
    function showParseUrlDialog() {
        const modal = createModal('解析URL添加音频', {
            width: '95%',
            maxWidth: '420px',
            maxHeight: '70vh',
            stack: true,
            backdropOpacity: 0.35
        });
        const theme = getThemeStyles();
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="margin-bottom: 16px;">
                <div style="font-size: 13px; color: ${isDarkMode ? '#9ca3af' : '#6b7280'}; margin-bottom: 8px;">
                    粘贴data URL格式的音频链接（以 data:application/octet-stream;base64, 开头）
                </div>
                <textarea id="url-input" placeholder="data:application/octet-stream;base64,..."
                    style="width: 100%; height: 120px; padding: 12px; background: ${theme.buttonBg}; color: ${theme.color};
                    border: 1px solid ${theme.border}; border-radius: 6px; font-size: 13px; font-family: monospace;
                    resize: vertical; box-sizing: border-box; transition: all 0.2s;"
                    onfocus="this.style.borderColor='#3b82f6'; this.style.background='${isDarkMode ? '#1f2937' : '#ffffff'}'"
                    onblur="this.style.borderColor='${theme.border}'; this.style.background='${theme.buttonBg}'"></textarea>
                <div style="font-size: 11px; color: ${isDarkMode ? '#6b7280' : '#9ca3af'}; margin-top: 6px; padding-left: 4px;">
                    💡 提示：可以在浏览器开发者工具的Network面板中找到音频请求，复制Response中的data URL
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button id="cancel-parse" style="padding: 10px 20px; background: ${theme.buttonBg}; color: ${theme.color};
                    border: 1px solid ${theme.border}; border-radius: 6px; cursor: pointer; font-size: 13px; transition: all 0.2s;"
                    onmouseover="this.style.background='${theme.buttonHover}'" onmouseout="this.style.background='${theme.buttonBg}'">
                    取消
                </button>
                <button id="confirm-parse" style="padding: 10px 20px; background: ${theme.primaryBg}; color: white;
                    border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s;
                    display: flex; align-items: center; gap: 6px;"
                    onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                    ${icons.link} <span>添加到列表</span>
                </button>
            </div>
        `;
        modal.appendChild(content);

        document.getElementById('cancel-parse').addEventListener('click', () => closeModal(modal));
        document.getElementById('confirm-parse').addEventListener('click', () => {
            const urlInput = document.getElementById('url-input').value.trim();
            if (!urlInput) {
                alert('请输入URL');
                return;
            }

            if (!urlInput.startsWith('data:')) {
                alert('请输入有效的data URL，格式为: data:application/octet-stream;base64,...');
                return;
            }

            try {
                // 验证数据URL格式
                if (!urlInput.includes('base64,')) {
                    alert('数据URL格式不正确，必须包含base64编码的数据');
                    return;
                }

                // 提取MIME类型
                const mimeTypeMatch = urlInput.match(/^data:([^;]+);/);
                const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'application/octet-stream';

                // 捕获到列表
                captureDataUrl(urlInput, mimeType);
                closeModal(modal);
                updateStatus('✓ 音频已添加到捕获列表');

                // 重新打开管理窗口显示新添加的音频
                setTimeout(() => {
                    showAudioManagementWindow();
                }, 500);

            } catch (error) {
                console.error('处理data URL失败:', error);
                alert('处理data URL失败: ' + error.message);
                updateStatus('⚠ 处理data URL失败');
            }
        });
    }

    // 解析范围字符串
    function parseRangeString(rangeStr, maxValue) {
        const result = new Set();
        rangeStr.split(',').forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim()));
                const startIndex = Math.max(0, start - 1);
                const endIndex = Math.min(maxValue - 1, end - 1);
                if (!isNaN(startIndex) && !isNaN(endIndex) && startIndex <= endIndex) {
                    for (let i = startIndex; i <= endIndex; i++) result.add(i);
                }
            } else {
                const index = parseInt(part) - 1;
                if (!isNaN(index) && index >= 0 && index < maxValue) result.add(index);
            }
        });
        return Array.from(result).sort((a, b) => a - b);
    }

    // 生成范围字符串
    function generateRangeString(indices) {
        if (indices.length === 0) return '';
        indices.sort((a, b) => a - b);
        const ranges = [];
        let start = indices[0], end = indices[0];
        for (let i = 1; i < indices.length; i++) {
            if (indices[i] === end + 1) {
                end = indices[i];
            } else {
                ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
                start = end = indices[i];
            }
        }
        ranges.push(start === end ? `${start + 1}` : `${start + 1}-${end + 1}`);
        return ranges.join(',');
    }

    // 合并音频
    function mergeAudio(indices, format) {
        if (indices.length === 0) { alert('未选择任何音频'); return; }
        const modal = createModal('音频合并进度');
        const theme = getThemeStyles();
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="text-align: center; margin: 20px 0;">
                <div id="merge-progress-text">准备合并 ${indices.length} 个音频文件...</div>
                <div style="margin: 15px 0; background: ${isDarkMode ? '#2d2d2d' : '#f0f0f0'}; border-radius: 4px; overflow: hidden;">
                    <div id="merge-progress-bar" style="width: 0%; height: 20px; background: #0f9d58;"></div>
                </div>
                <div id="merge-status">正在初始化...</div>
            </div>
        `;
        modal.appendChild(content);
        setTimeout(() => {
            startMergeProcess(indices, format, modal, false);
        }, 500);
    }

    // 开始合并流程
    async function startMergeProcess(indices, format, modal, isAutoMerge = false) {
        try {
            updateMergeProgress(5, '开始下载音频数据...');
            const audioBuffers = [];
            for (let i = 0; i < indices.length; i++) {
                const index = indices[i];
                const progress = 5 + Math.floor(((i + 1) / indices.length) * 50);
                updateMergeProgress(progress, `正在处理第 ${i + 1}/${indices.length} 个音频...`);
                const audio = capturedAudio[index];
                if (!audio) continue;
                try {
                    const buffer = await getAudioBuffer(audio);
                    if (buffer && (format !== 'mp3' || (audio.format === 'mp3' || isValidMp3(buffer)))) {
                        audioBuffers.push(buffer);
                    }
                } catch (e) {
                    console.error(`处理第 ${index + 1} 个音频时出错:`, e);
                    updateMergeStatus(`处理第 ${index + 1} 个音频时出错: ${e.message}`);
                }
            }

            if (audioBuffers.length === 0) {
                updateMergeStatus('没有有效的音频数据可合并');
                setTimeout(() => closeModal(modal), 3000);
                return;
            }

            updateMergeProgress(60, `已加载 ${audioBuffers.length} 个音频，开始合并...`);
            const mergedAudio = await mergeAudioBuffers(audioBuffers, format);
            updateMergeProgress(90, '合并完成，准备下载...');

            const fileName = `${fileNamePrefix}_${Date.now()}.${format}`;
            const blob = new Blob([mergedAudio], { type: format === 'mp3' ? 'audio/mpeg' : 'audio/wav' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            let statusMsg = `已成功合并 ${audioBuffers.length} 个音频文件并下载`;
            if (autoClearList) {
                capturedAudio = [];
                updateAudioCount();
                saveAudioData();
                statusMsg = `合并下载完成，并已清空列表`;
            }
            updateMergeProgress(100, '合并完成，已开始下载！');
            updateStatus(statusMsg);

            if (isAutoMerge && (isMonitoring && isCapturing)) { // 仅在主动模式下自动停止
                setTimeout(() => {
                    stopMonitoring();
                    unmutePageAudio(true); // 主动模式，需要点击停止按钮
                    isCapturing = false;
                    isMonitoring = false;
                    updateCaptureUI();
                    updateStatus('✅ 自动合并完成，已停止获取');
                }, 1000);
            }

            setTimeout(() => closeModal(modal), 3000);
        } catch (error) {
            console.error('合并音频过程中出错:', error);
            updateMergeStatus(`合并失败: ${error.message}`);
        }
    }

    // 获取音频的ArrayBuffer数据
    async function getAudioBuffer(audio) {
        return new Promise(async (resolve, reject) => {
            try {
                if (audio.data instanceof ArrayBuffer) {
                    resolve(audio.data);
                } else if (audio.source === 'dataUrl') {
                    if (audio.url.startsWith('data:application/octet-stream;base64,') || audio.url.startsWith('data:audio/mpeg;base64,') || audio.url.includes('base64,')) {
                        const base64Data = audio.url.split('base64,')[1];
                        const binaryString = atob(base64Data);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        resolve(bytes.buffer);
                    } else {
                        fetch(audio.url).then(response => response.arrayBuffer()).then(buffer => resolve(buffer)).catch(reject);
                    }
                } else if (audio.url) {
                    GM_xmlhttpRequest({
                        method: 'GET', url: audio.url, responseType: 'arraybuffer',
                        onload: (response) => resolve(response.response),
                        onerror: (error) => reject(new Error('无法下载音频: ' + error))
                    });
                } else {
                    reject(new Error('无法获取音频数据'));
                }
            } catch (e) { reject(e); }
        });
    }

    // 合并音频缓冲区
    async function mergeAudioBuffers(audioBuffers, format) {
        return new Promise(async (resolve, reject) => {
            try {
                if (format === 'mp3') {
                    // MP3 快速合并
                    updateMergeStatus('正在直接合并MP3文件...');
                    const validMp3Buffers = [];
                    for (let i = 0; i < audioBuffers.length; i++) {
                        const buffer = audioBuffers[i];
                        if (isValidMp3(buffer)) {
                            validMp3Buffers.push(buffer);
                        } else {
                            console.warn(`跳过第${i+1}个非MP3格式文件`);
                        }
                        updateMergeProgress(60 + Math.floor((i / audioBuffers.length) * 30), `正在处理第 ${i + 1}/${audioBuffers.length} 个文件...`);
                    }

                    if (validMp3Buffers.length === 0) {
                        reject(new Error('没有有效的MP3文件可以合并')); return;
                    }

                    updateMergeStatus(`正在合并 ${validMp3Buffers.length} 个MP3文件...`);
                    const totalLength = validMp3Buffers.reduce((total, buffer) => total + buffer.byteLength, 0);
                    const mergedMp3 = new Uint8Array(totalLength);
                    let offset = 0;
                    for (const buffer of validMp3Buffers) {
                        const data = new Uint8Array(buffer);
                        mergedMp3.set(data, offset);
                        offset += buffer.byteLength;
                    }
                    updateMergeProgress(95, '合并完成，准备下载...');
                    resolve(mergedMp3.buffer);

                } else if (format === 'wav') {
                    // WAV 合并处理
                    updateMergeStatus('正在合并 WAV 文件...');

                    // WAV 头部参数
                    const RIFF = 0x46464952;
                    const WAVE = 0x45564157;
                    const fmt  = 0x20746D66;
                    const data = 0x61746164;

                    let totalDataSize = 0;
                    let sampleRate = 0;
                    let channels = 0;
                    let bitsPerSample = 0;

                    // 第一次遍历，获取音频参数和总数据大小
                    for (let i = 0; i < audioBuffers.length; i++) {
                        const buffer = audioBuffers[i];
                        const view = new DataView(buffer);

                        // 检查WAV文件头
                        if (view.getUint32(0, false) !== RIFF || view.getUint32(8, false) !== WAVE) {
                            continue;
                        }

                        // 获取音频参数（使用第一个有效WAV的参数）
                        if (!sampleRate) {
                            channels = view.getUint16(22, true);
                            sampleRate = view.getUint32(24, true);
                            bitsPerSample = view.getUint16(34, true);
                        }

                        // 找到数据块
                        let offset = 12;
                        while (offset < buffer.byteLength) {
                            const chunkId = view.getUint32(offset, false);
                            const chunkSize = view.getUint32(offset + 4, true);
                            if (chunkId === data) {
                                totalDataSize += chunkSize;
                                break;
                            }
                            offset += 8 + chunkSize;
                        }
                    }

                    if (totalDataSize === 0 || !sampleRate) {
                        reject(new Error('没有有效的WAV文件可以合并'));
                        return;
                    }

                    // 创建合并后的WAV文件
                    const headerLength = 44;
                    const totalLength = headerLength + totalDataSize;
                    const mergedBuffer = new ArrayBuffer(totalLength);
                    const mergedView = new DataView(mergedBuffer);

                    // 写入WAV头部
                    mergedView.setUint32(0, RIFF, false);                    // RIFF标识
                    mergedView.setUint32(4, totalLength - 8, true);         // 文件大小
                    mergedView.setUint32(8, WAVE, false);                   // WAVE标识
                    mergedView.setUint32(12, fmt, false);                   // fmt块标识
                    mergedView.setUint32(16, 16, true);                     // fmt块大小
                    mergedView.setUint16(20, 1, true);                      // 音频格式(PCM)
                    mergedView.setUint16(22, channels, true);               // 通道数
                    mergedView.setUint32(24, sampleRate, true);            // 采样率
                    mergedView.setUint32(28, sampleRate * channels * bitsPerSample / 8, true); // 字节率
                    mergedView.setUint16(32, channels * bitsPerSample / 8, true);             // 数据块对齐
                    mergedView.setUint16(34, bitsPerSample, true);         // 采样位数
                    mergedView.setUint32(36, data, false);                 // data块标识
                    mergedView.setUint32(40, totalDataSize, true);         // 数据大小

                    // 写入音频数据
                    let dataOffset = headerLength;
                    for (let i = 0; i < audioBuffers.length; i++) {
                        const buffer = audioBuffers[i];
                        const view = new DataView(buffer);

                        // 找到数据块并复制
                        let offset = 12;
                        while (offset < buffer.byteLength) {
                            const chunkId = view.getUint32(offset, false);
                            const chunkSize = view.getUint32(offset + 4, true);
                            if (chunkId === data) {
                                const dataArray = new Uint8Array(buffer, offset + 8, chunkSize);
                                new Uint8Array(mergedBuffer).set(dataArray, dataOffset);
                                dataOffset += chunkSize;
                                break;
                            }
                            offset += 8 + chunkSize;
                        }

                        updateMergeProgress(60 + Math.floor((i / audioBuffers.length) * 30),
                            `正在处理第 ${i + 1}/${audioBuffers.length} 个WAV文件...`);
                    }

                    updateMergeProgress(95, 'WAV合并完成，准备下载...');
                    resolve(mergedBuffer);
                } else {
                    reject(new Error(`不支持 ${format} 格式的合并`));
                }
            } catch (e) { reject(e); }
        });
    }

    // 简单检查是否为有效的MP3文件
    function isValidMp3(buffer) {
        if (!buffer || buffer.byteLength < 3) return false;
        const view = new Uint8Array(buffer);
        if (view[0] === 0x49 && view[1] === 0x44 && view[2] === 0x33) return true;
        for (let i = 0; i < Math.min(100, view.length - 1); i++) {
            if (view[i] === 0xFF && (view[i+1] & 0xE0) === 0xE0) return true;
        }
        return false;
    }

    // 更新合并进度
    function updateMergeProgress(percent, message) {
        const progressBar = document.getElementById('merge-progress-bar');
        const progressText = document.getElementById('merge-progress-text');
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = message || `进度: ${percent}%`;
    }

    // 更新合并状态
    function updateMergeStatus(message) {
        const statusElement = document.getElementById('merge-status');
        if (statusElement) statusElement.textContent = message;
    }

    // 创建模态框
    function createModal(title, options = {}) {
        // 注入/更新滚动条样式
        injectCustomScrollbarStyles();

        const existingBackdrops = Array.from(document.querySelectorAll('.audio-capture-modal-backdrop'));
        if (!options.stack && existingBackdrops.length) {
            existingBackdrops.forEach(el => document.body.removeChild(el));
        }

        const theme = getThemeStyles();
        const backdropOpacity = typeof options.backdropOpacity === 'number' ? options.backdropOpacity : 0.5;
        const baseZIndex = options.stack ? 10000 + existingBackdrops.length : 10000;

        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'audio-capture-modal-backdrop';
        modalBackdrop.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, ${backdropOpacity});
            z-index: ${options.zIndex || baseZIndex};
            display: flex; justify-content: center;
        `;
        modalBackdrop.style.alignItems = options.alignTop ? 'flex-start' : 'center';
        if (options.alignTop) {
            modalBackdrop.style.paddingTop = options.offsetTop || '60px';
        }

        const modal = document.createElement('div');
        modal.className = 'audio-capture-modal';
        modal.style.cssText = `
            background: ${theme.background}; color: ${theme.color};
            border-radius: 8px; box-shadow: 0 0 20px ${theme.shadowColor};
            width: ${options.width || '80%'}; max-width: ${options.maxWidth || '700px'};
            max-height: ${options.maxHeight || '90vh'};
            min-height: ${options.minHeight || '60vh'};
            display: flex; flex-direction: column; /* 确保标题和内容正确布局 */
            z-index: ${(options.zIndex || baseZIndex) + 1};
        `;
        if (options.minWidth) modal.style.minWidth = options.minWidth;

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin: 0; padding: 20px 20px 15px 20px;
            border-bottom: 1px solid ${theme.border};
            flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;
        `;

        // 添加关闭按钮到标题右侧
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = icons.close;
        closeBtn.style.cssText = `
            background: none; border: none; padding: 4px;
            cursor: pointer; opacity: 0.7; transition: opacity 0.2s;
            display: flex; align-items: center;
        `;
        closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
        closeBtn.onmouseout = () => closeBtn.style.opacity = '0.7';
        closeBtn.onclick = () => closeModal(contentWrapper);
        titleElement.appendChild(closeBtn);

        // 创建一个可滚动的内容容器
        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `
            overflow-y: auto;
            padding: 20px;
            flex-grow: 1; /* 占据剩余空间 */
        `;

        modal.appendChild(titleElement);
        modal.appendChild(contentWrapper); // 内容将被添加到这个包装器中
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);

        // 返回内容包装器，以便调用者向其中添加内容
        return contentWrapper;
    }

    // 关闭模态框
    function closeModal(modalWrapper) {
        try {
            // modalWrapper 是我们返回的内容容器
            // 我们需要找到它的父级 .audio-capture-modal，然后再找到 .audio-capture-modal-backdrop
            const backdrop = modalWrapper.closest('.audio-capture-modal-backdrop');
            if (backdrop && document.body.contains(backdrop)) {
                document.body.removeChild(backdrop);
            }
        } catch (e) {
            console.error('关闭模态框时出错:', e);
            document.querySelectorAll('.audio-capture-modal-backdrop').forEach(el => el.remove());
        }
    }

    // 注册GM菜单
    GM_registerMenuCommand('🎵 打开音频下载窗口', createMainInterface);
    GM_registerMenuCommand('▶️ 一键获取', function() {
        document.getElementById('active-capture-btn')?.click();
    });
    GM_registerMenuCommand('⏱️ 手动获取', function() {
        document.getElementById('passive-capture-btn')?.click();
    });
    GM_registerMenuCommand('📋 已捕获音频管理', showAudioManagementWindow);
    GM_registerMenuCommand('🤖 切换是否自动合并', function() {
        autoMergeEnabled = !autoMergeEnabled;
        GM_setValue('autoMergeEnabled', autoMergeEnabled);
        // 同步UI中的checkbox
        syncAutoMergeCheckbox();
        // 保持使用 updateStatus，不弹窗
        updateStatus(autoMergeEnabled ? '✅ 自动合并已启用' : '❌ 自动合并已禁用');
    });
    GM_registerMenuCommand('📍 重置面板位置', function() {
        const defaultPosition = { bottom: 20, right: 20 };
        panelPosition = defaultPosition;  // 只临时修改当前值，不保存到存储
        const panel = document.getElementById('audio-capture-panel');
        if (panel) {
            panel.remove();
        }
        createMainInterface();
        alert('✅ 面板位置已重置到右下角');
    });

    // 初始化函数
    let isInitialized = false; // 添加初始化标记

    function initialize() {
        if (isInitialized) {
            console.log('豆包音频捕获工具已经初始化，跳过重复初始化');
            return;
        }

        try {
            console.log('开始初始化豆包音频捕获工具...');
            console.log('当前document.readyState:', document.readyState);

            loadAudioData();

            // 根据当前页面加载状态决定如何初始化
            const initUI = () => {
                console.log('准备创建主界面...');
                try {
                    createMainInterface();
                    console.log('✓ 主界面创建成功');

                    // 验证面板是否真的在DOM中
                    setTimeout(() => {
                        const panel = document.getElementById('audio-capture-panel');
                        if (panel) {
                            console.log('✓ 面板验证成功，面板存在于DOM中');
                            console.log('面板位置:', panel.getBoundingClientRect());
                            console.log('面板可见性:', window.getComputedStyle(panel).display);
                            console.log('面板z-index:', window.getComputedStyle(panel).zIndex);
                        } else {
                            console.error('✗ 面板验证失败，面板不存在于DOM中！');
                        }
                    }, 500);
                } catch (error) {
                    console.error('创建主界面时出错:', error);
                }
            };

            if (document.readyState === 'loading') {
                console.log('页面仍在加载中，等待DOMContentLoaded事件');
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('DOMContentLoaded事件触发');
                    initUI();
                });
            } else {
                console.log('页面已加载完成，立即创建界面');
                // 延迟一小段时间，确保页面完全准备好
                setTimeout(initUI, 100);
            }

            isInitialized = true;
            console.log('豆包音频捕获工具初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            isInitialized = false;
        }
    }

    // 启动初始化
    initialize();
})();

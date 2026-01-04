// ==UserScript==
// @name         网易云音乐和酷狗音乐自动下载脚本(增强版-支持会员歌曲下载)
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @description  自动监测网易云音乐和酷狗音乐网页端播放的歌曲，提供一键下载MP3/FLAC功能，支持会员歌曲下载
// @author       醉春风
// @license      All Rights Reserved. 版权所有，禁止修改和再分发。未经作者明确许可，禁止对本脚本进行任何形式的修改、再分发或商业使用。
// @match        *://music.163.com/*
// @match        *://*.music.163.com/*
// @match        *://www.kugou.com/*
// @match        *://*.kugou.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      music.163.com
// @connect      kugou.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538270/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%92%8C%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%28%E5%A2%9E%E5%BC%BA%E7%89%88-%E6%94%AF%E6%8C%81%E4%BC%9A%E5%91%98%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538270/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%92%8C%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%28%E5%A2%9E%E5%BC%BA%E7%89%88-%E6%94%AF%E6%8C%81%E4%BC%9A%E5%91%98%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================ 配置项 ================
    const CONFIG = {
        defaultQuality: GM_getValue('defaultQuality', 'standard'), // 默认下载音质: standard, higher, exhigh, lossless
        autoDetect: GM_getValue('autoDetect', true),               // 自动检测歌曲
        showNotifications: GM_getValue('showNotifications', true), // 显示通知
        theme: GM_getValue('theme', 'auto'),                       // 主题: auto, netease, kugou
        downloadPath: GM_getValue('downloadPath', ''),             // 下载路径
        detectDelay: 5000,                                         // 检测延迟(毫秒)
        preferredFormat: GM_getValue('preferredFormat', 'mp3'),    // 首选格式: mp3, flac
        preferDirectStream: GM_getValue('preferDirectStream', true) // 优先使用直接音频流下载
    };

    // ================ 平台检测 ================
    const PLATFORM = {
        NETEASE: 'netease',
        KUGOU: 'kugou',
        UNKNOWN: 'unknown'
    };

    // 当前平台
    let currentPlatform = detectPlatform();

    // 当前歌曲信息
    let currentSong = {
        id: '',
        name: '',
        artist: '',
        album: '',
        cover: '',
        duration: 0,
        audioSrc: '', // 直接音频流地址
        mediaElement: null, // 媒体元素引用
        platform: PLATFORM.UNKNOWN
    };

    // ================ 音频格式转换器 ================
    // 音频格式转换器状态
    let audioConverterState = {
        ffmpegLoaded: false,
        ffmpeg: null,
        isConverting: false
    };

    // 初始化音频转换器
    async function initAudioConverter() {
        if (audioConverterState.ffmpegLoaded) return true;
        
        try {
            if (typeof FFmpeg === 'undefined') {
                console.error("FFmpeg WASM 未加载");
                return false;
            }
            
            const { createFFmpeg } = FFmpeg;
            audioConverterState.ffmpeg = createFFmpeg({ 
                log: false,
                corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
            });
            
            await audioConverterState.ffmpeg.load();
            audioConverterState.ffmpegLoaded = true;
            console.log("音频转换器初始化成功");
            return true;
        } catch (error) {
            console.error("音频转换器初始化失败:", error);
            return false;
        }
    }

    // MP3 转 FLAC 格式
    async function convertToFlac(audioUrl, fileName) {
        if (!await initAudioConverter()) {
            console.error("音频转换器未初始化，无法转换");
            return null;
        }
        
        if (audioConverterState.isConverting) {
            console.log("已有转换任务正在进行，请稍后再试");
            return null;
        }
        
        audioConverterState.isConverting = true;
        showProgress(0);
        
        try {
            console.log("开始下载音频文件用于转换...");
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            const inputData = new Uint8Array(arrayBuffer);
            
            const inputFileName = 'input.mp3';
            const outputFileName = 'output.flac';
            
            console.log("开始转换音频格式...");
            const { ffmpeg } = audioConverterState;
            
            ffmpeg.FS('writeFile', inputFileName, inputData);
            
            await ffmpeg.run('-i', inputFileName, '-c:a', 'flac', outputFileName);
            
            const outputData = ffmpeg.FS('readFile', outputFileName);
            
            // 清理文件系统
            ffmpeg.FS('unlink', inputFileName);
            ffmpeg.FS('unlink', outputFileName);
            
            console.log("音频格式转换完成");
            audioConverterState.isConverting = false;
            
            return new Blob([outputData.buffer], { type: 'audio/flac' });
        } catch (error) {
            console.error("音频格式转换失败:", error);
            audioConverterState.isConverting = false;
            return null;
        }
    }

    // 检测当前平台
    function detectPlatform() {
        const url = window.location.href;
        if (url.includes('music.163.com')) {
            return PLATFORM.NETEASE;
        } else if (url.includes('kugou.com')) {
            return PLATFORM.KUGOU;
        }
        return PLATFORM.UNKNOWN;
    }

    // ================ 样式注入 ================
    function injectStyles() {
        const primaryColor = currentPlatform === PLATFORM.NETEASE ? '#C20C0C' : '#2CA2F9';

        GM_addStyle(`
            /* 全局样式 */
            .music-dl-container * {
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            }

            /* 悬浮按钮 */
            .music-dl-btn {
                position: fixed;
                right: 20px;
                bottom: 80px;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background-color: ${primaryColor};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 9999; /* High z-index */
                transition: all 0.3s ease;
            }

            .music-dl-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }

            .music-dl-btn.active {
                animation: pulse 1.5s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }

            /* 主面板 */
            .music-dl-panel {
                position: fixed;
                right: 20px;
                bottom: 140px;
                width: 320px;
                max-height: 420px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 9998; /* High z-index, below button */
                overflow: hidden;
                display: none;
                flex-direction: column;
                animation: slideIn 0.3s ease;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .music-dl-panel-header {
                padding: 15px;
                background-color: ${primaryColor};
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .music-dl-panel-title {
                font-size: 16px;
                font-weight: bold;
            }

            .music-dl-panel-close {
                cursor: pointer;
                font-size: 18px;
            }
            
            /* 作者信息区域 */
            .music-dl-author-info {
                background-color: #f8f8f8;
                padding: 8px 15px;
                display: flex;
                flex-direction: column;
                border-bottom: 1px solid #eee;
            }
            
            .music-dl-author {
                font-size: 14px;
                font-weight: bold;
                color: #333;
                margin-bottom: 4px;
            }
            
            .music-dl-qq-group {
                font-size: 13px;
                color: #666;
            }

            .music-dl-panel-content {
                padding: 15px;
                overflow-y: auto;
                flex: 1;
            }

            .music-dl-song-info {
                display: flex;
                margin-bottom: 15px;
            }

            .music-dl-song-cover {
                width: 80px;
                height: 80px;
                border-radius: 4px;
                object-fit: cover;
                margin-right: 15px;
                background-color: #eee; /* Placeholder background */
            }

            .music-dl-song-details {
                flex: 1;
                min-width: 0; /* Prevent overflow issues */
            }

            .music-dl-song-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .music-dl-song-artist {
                font-size: 14px;
                color: #666;
                margin-bottom: 3px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .music-dl-song-album {
                font-size: 12px;
                color: #999;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .music-dl-quick-download {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                margin-bottom: 15px;
            }

            .music-dl-quick-download-btn {
                flex: 1;
                padding: 10px;
                text-align: center;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s;
                margin: 0 5px;
                border: none; /* Ensure no default border */
            }

            .music-dl-quick-download-btn:first-child {
                margin-left: 0;
            }

            .music-dl-quick-download-btn:last-child {
                margin-right: 0;
            }

            .music-dl-quick-download-btn.mp3 {
                background-color: #31C27C;
                color: white;
            }

            .music-dl-quick-download-btn.mp3:hover {
                background-color: #28a66a;
            }

            .music-dl-quick-download-btn.flac {
                background-color: #2CA2F9;
                color: white;
            }

            .music-dl-quick-download-btn.flac:hover {
                background-color: #1a8fe6;
            }

            .music-dl-quality-options {
                margin-top: 15px;
            }

            .music-dl-quality-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .music-dl-quality-btn {
                display: block;
                width: 100%;
                padding: 10px;
                margin-bottom: 8px;
                background-color: #f5f5f5;
                border: none;
                border-radius: 4px;
                text-align: left;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .music-dl-quality-btn:hover {
                background-color: #eaeaea;
            }

            .music-dl-quality-btn span {
                float: right;
                color: #999;
            }

            .music-dl-panel-footer {
                padding: 10px 15px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center; /* Align items vertically */
            }

            .music-dl-settings-btn {
                color: #666;
                cursor: pointer;
                font-size: 14px;
            }

            .music-dl-version {
                 font-size: 12px;
                 color: #aaa;
            }

            /* 设置面板 */
            .music-dl-settings {
                padding: 15px;
                display: none;
            }

            .music-dl-settings-group {
                margin-bottom: 15px;
            }

            .music-dl-settings-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .music-dl-settings-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .music-dl-settings-label {
                font-size: 14px;
                color: #333;
            }

            .music-dl-settings-select {
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #ddd;
            }

            .music-dl-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 20px;
            }

            .music-dl-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .music-dl-slider {
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

            .music-dl-slider:before {
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

            input:checked + .music-dl-slider {
                background-color: ${primaryColor};
            }

            input:checked + .music-dl-slider:before {
                transform: translateX(20px);
            }

            .music-dl-settings-buttons {
                display: flex;
                justify-content: flex-end;
                margin-top: 15px;
            }

            .music-dl-settings-save {
                padding: 8px 15px;
                background-color: ${primaryColor};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            .music-dl-settings-cancel {
                padding: 8px 15px;
                background-color: #f5f5f5;
                color: #333;
                border: none;
                border-radius: 4px;
                margin-right: 10px;
                cursor: pointer;
            }

            /* 下载进度 */
            .music-dl-progress-container {
                margin-top: 15px;
                display: none;
            }

            .music-dl-progress-bar {
                height: 6px;
                background-color: #eee;
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 5px;
            }

            .music-dl-progress-fill {
                height: 100%;
                background-color: ${primaryColor};
                width: 0%;
                transition: width 0.3s;
            }

            .music-dl-progress-text {
                font-size: 12px;
                color: #666;
                text-align: right;
            }

            /* 音频流模式指示器 */
            .music-dl-stream-mode {
                font-size: 12px;
                color: #31C27C;
                margin-top: 5px;
                text-align: right;
                font-weight: bold;
            }
        `);
    }

    // ================ UI组件 ================
    function createUI() {
        // 检查是否已存在UI元素，避免重复创建
        if (document.querySelector('.music-dl-btn')) {
            console.log('音乐下载助手UI已存在，跳过创建');
            return;
        }

        // 创建悬浮按钮
        const floatButton = document.createElement('div');
        floatButton.className = 'music-dl-btn';
        floatButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
        document.body.appendChild(floatButton);
        console.log('创建悬浮按钮成功');

        // 创建主面板
        const panel = document.createElement('div');
        panel.className = 'music-dl-panel';
        panel.innerHTML = `
            <div class="music-dl-panel-header">
                <div class="music-dl-panel-title">音乐下载助手</div>
                <div class="music-dl-panel-close">×</div>
            </div>
            <div class="music-dl-author-info">
                <div class="music-dl-author">by醉春风</div>
                <div class="music-dl-qq-group">加QQ群：1028141108</div>
            </div>
            <div class="music-dl-panel-content">
                <div class="music-dl-song-info">
                    <img class="music-dl-song-cover" src="" alt="封面">
                    <div class="music-dl-song-details">
                        <div class="music-dl-song-name">未检测到歌曲</div>
                        <div class="music-dl-song-artist">-</div>
                        <div class="music-dl-song-album">-</div>
                        <div class="music-dl-stream-mode"></div>
                    </div>
                </div>
                <div class="music-dl-quick-download">
                    <button class="music-dl-quick-download-btn mp3">下载MP3</button>
                    <button class="music-dl-quick-download-btn flac">下载FLAC</button>
                </div>
                <div class="music-dl-quality-options">
                    <div class="music-dl-quality-title">选择音质下载</div>
                    <button class="music-dl-quality-btn" data-quality="standard">标准音质 <span>128kbps</span></button>
                    <button class="music-dl-quality-btn" data-quality="higher">较高音质 <span>320kbps</span></button>
                    <button class="music-dl-quality-btn" data-quality="exhigh">极高音质 <span>320kbps</span></button>
                    <button class="music-dl-quality-btn" data-quality="lossless">无损音质 <span>FLAC</span></button>
                </div>
                <div class="music-dl-progress-container">
                    <div class="music-dl-progress-bar">
                        <div class="music-dl-progress-fill"></div>
                    </div>
                    <div class="music-dl-progress-text">0%</div>
                </div>
                 <div class="music-dl-settings">
                    <div class="music-dl-settings-group">
                        <div class="music-dl-settings-title">常规设置</div>
                        <div class="music-dl-settings-item">
                            <div class="music-dl-settings-label">默认下载音质</div>
                            <select class="music-dl-settings-select" id="music-dl-default-quality">
                                <option value="standard">标准音质 (128kbps)</option>
                                <option value="higher">较高音质 (320kbps)</option>
                                <option value="exhigh">极高音质 (320kbps)</option>
                                <option value="lossless">无损音质 (FLAC)</option>
                            </select>
                        </div>
                        <div class="music-dl-settings-item">
                            <div class="music-dl-settings-label">首选格式</div>
                            <select class="music-dl-settings-select" id="music-dl-preferred-format">
                                <option value="mp3">MP3</option>
                                <option value="flac">FLAC</option>
                            </select>
                        </div>
                        <div class="music-dl-settings-item">
                            <div class="music-dl-settings-label">自动检测歌曲</div>
                            <label class="music-dl-switch">
                                <input type="checkbox" id="music-dl-auto-detect" checked>
                                <span class="music-dl-slider"></span>
                            </label>
                        </div>
                        <div class="music-dl-settings-item">
                            <div class="music-dl-settings-label">显示通知</div>
                            <label class="music-dl-switch">
                                <input type="checkbox" id="music-dl-show-notifications" checked>
                                <span class="music-dl-slider"></span>
                            </label>
                        </div>
                        <div class="music-dl-settings-item">
                            <div class="music-dl-settings-label">优先使用音频流下载</div>
                            <label class="music-dl-switch">
                                <input type="checkbox" id="music-dl-prefer-direct-stream" checked>
                                <span class="music-dl-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="music-dl-settings-group">
                        <div class="music-dl-settings-title">主题</div>
                        <div class="music-dl-settings-item">
                            <div class="music-dl-settings-label">界面主题</div>
                            <select class="music-dl-settings-select" id="music-dl-theme">
                                <option value="auto">自动 (跟随平台)</option>
                                <option value="netease">网易云红</option>
                                <option value="kugou">酷狗蓝</option>
                            </select>
                        </div>
                    </div>
                    <div class="music-dl-settings-buttons">
                        <button class="music-dl-settings-cancel">取消</button>
                        <button class="music-dl-settings-save">保存</button>
                    </div>
                </div>
            </div>
            <div class="music-dl-panel-footer">
                <div class="music-dl-settings-btn">设置</div>
                <div class="music-dl-version">v1.2.9</div>
            </div>
        `;
        // Append panel to body to minimize interference
        document.body.appendChild(panel);
        console.log('创建主面板成功');

        // Get references after adding to DOM
        const settingsPanel = panel.querySelector('.music-dl-settings');

        // Initialize settings values
        const defaultQualitySelect = settingsPanel.querySelector('#music-dl-default-quality');
        defaultQualitySelect.value = CONFIG.defaultQuality;
        const preferredFormatSelect = settingsPanel.querySelector('#music-dl-preferred-format');
        preferredFormatSelect.value = CONFIG.preferredFormat;
        const autoDetectCheckbox = settingsPanel.querySelector('#music-dl-auto-detect');
        autoDetectCheckbox.checked = CONFIG.autoDetect;
        const showNotificationsCheckbox = settingsPanel.querySelector('#music-dl-show-notifications');
        showNotificationsCheckbox.checked = CONFIG.showNotifications;
        const preferDirectStreamCheckbox = settingsPanel.querySelector('#music-dl-prefer-direct-stream');
        preferDirectStreamCheckbox.checked = CONFIG.preferDirectStream;
        const themeSelect = settingsPanel.querySelector('#music-dl-theme');
        themeSelect.value = CONFIG.theme;

        // Bind events
        floatButton.addEventListener('click', togglePanel);
        panel.querySelector('.music-dl-panel-close').addEventListener('click', hidePanel);
        panel.querySelector('.music-dl-settings-btn').addEventListener('click', toggleSettings);
        settingsPanel.querySelector('.music-dl-settings-save').addEventListener('click', saveSettings);
        settingsPanel.querySelector('.music-dl-settings-cancel').addEventListener('click', hideSettings);

        // Bind download button events
        const quickDownloadButtons = panel.querySelectorAll('.music-dl-quick-download-btn');
        quickDownloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (this.classList.contains('mp3')) {
                    quickDownload('mp3');
                } else if (this.classList.contains('flac')) {
                    quickDownload('flac');
                }
            });
        });
        const qualityButtons = panel.querySelectorAll('.music-dl-quality-btn');
        qualityButtons.forEach(button => {
            button.addEventListener('click', function() {
                const quality = this.getAttribute('data-quality');
                downloadSong(quality);
            });
        });

        // Close panel on outside click (ensure this doesn't interfere with player controls)
        document.addEventListener('click', function(e) {
            // Check if the click is outside the panel AND outside the float button
            if (!panel.contains(e.target) && !floatButton.contains(e.target)) {
                 // Also check if the click target is part of the Kugou player controls to avoid closing the panel accidentally
                 // This requires identifying Kugou's player control selectors, which might be fragile.
                 // Example (needs verification): const isPlayerControl = e.target.closest('.kgPlayer_controls, #playerControl');
                 // if (!isPlayerControl) {
                      hidePanel();
                 // }
            } else {
                 // If click is inside panel, prevent propagation if necessary
                 // e.stopPropagation(); // Use with caution
            }
        }, true); // Use capture phase to potentially catch clicks earlier
    }

    // 显示/隐藏主面板
    function togglePanel() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        if (panel.style.display === 'flex') {
            hidePanel();
        } else {
            showPanel();
        }
    }

    // 显示主面板
    function showPanel() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        panel.style.display = 'flex';
        hideSettings(); // Ensure settings are hidden when panel opens
        updateSongInfo(); // Refresh song info when panel opens
    }

    // 隐藏主面板
    function hidePanel() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        panel.style.display = 'none';
    }

    // 显示/隐藏设置面板
    function toggleSettings() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        const settings = panel.querySelector('.music-dl-settings');
        const content = panel.querySelector('.music-dl-panel-content');
        const songInfo = content.querySelector('.music-dl-song-info');
        const quickDownload = content.querySelector('.music-dl-quick-download');
        const qualityOptions = content.querySelector('.music-dl-quality-options');
        const progressContainer = content.querySelector('.music-dl-progress-container');

        if (!settings) return;

        if (settings.style.display === 'block') {
            hideSettings();
        } else {
            // Hide other content sections
            if(songInfo) songInfo.style.display = 'none';
            if(quickDownload) quickDownload.style.display = 'none';
            if(qualityOptions) qualityOptions.style.display = 'none';
            if(progressContainer) progressContainer.style.display = 'none';
            // Show settings
            settings.style.display = 'block';
        }
    }

    // 隐藏设置面板
    function hideSettings() {
        const panel = document.querySelector('.music-dl-panel');
         if (!panel) return;
        const settings = panel.querySelector('.music-dl-settings');
        const content = panel.querySelector('.music-dl-panel-content');
        const songInfo = content.querySelector('.music-dl-song-info');
        const quickDownload = content.querySelector('.music-dl-quick-download');
        const qualityOptions = content.querySelector('.music-dl-quality-options');

        if (!settings) return;

        // Hide settings
        settings.style.display = 'none';

        // Show other content sections
        if(songInfo) songInfo.style.display = 'flex';
        if(quickDownload) quickDownload.style.display = 'flex';
        if(qualityOptions) qualityOptions.style.display = 'block';
        // Progress container visibility is handled by showProgress/hideProgress
    }

    // 保存设置
    function saveSettings() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        const settingsPanel = panel.querySelector('.music-dl-settings');
        if (!settingsPanel) return;

        const defaultQuality = settingsPanel.querySelector('#music-dl-default-quality').value;
        const preferredFormat = settingsPanel.querySelector('#music-dl-preferred-format').value;
        const autoDetect = settingsPanel.querySelector('#music-dl-auto-detect').checked;
        const showNotifications = settingsPanel.querySelector('#music-dl-show-notifications').checked;
        const preferDirectStream = settingsPanel.querySelector('#music-dl-prefer-direct-stream').checked;
        const theme = settingsPanel.querySelector('#music-dl-theme').value;

        // Save to GM storage
        GM_setValue('defaultQuality', defaultQuality);
        GM_setValue('preferredFormat', preferredFormat);
        GM_setValue('autoDetect', autoDetect);
        GM_setValue('showNotifications', showNotifications);
        GM_setValue('preferDirectStream', preferDirectStream);
        GM_setValue('theme', theme);

        // Update config object
        CONFIG.defaultQuality = defaultQuality;
        CONFIG.preferredFormat = preferredFormat;
        CONFIG.autoDetect = autoDetect;
        CONFIG.showNotifications = showNotifications;
        CONFIG.preferDirectStream = preferDirectStream;
        CONFIG.theme = theme;

        showNotification('设置已保存', '您的偏好设置已成功保存', 'success');
        hideSettings();
    }

    // 更新歌曲信息显示
    function updateSongInfo() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return; // Exit if panel doesn't exist

        const songNameEl = panel.querySelector('.music-dl-song-name');
        const songArtistEl = panel.querySelector('.music-dl-song-artist');
        const songAlbumEl = panel.querySelector('.music-dl-song-album');
        const songCoverEl = panel.querySelector('.music-dl-song-cover');
        const streamModeEl = panel.querySelector('.music-dl-stream-mode');
        const qualityButtons = panel.querySelectorAll('.music-dl-quality-btn');
        const quickDownloadButtons = panel.querySelectorAll('.music-dl-quick-download-btn');

        if (!songNameEl || !songArtistEl || !songAlbumEl || !songCoverEl) return;

        if (currentSong.name && currentSong.artist) { // Check for valid name and artist
            songNameEl.textContent = currentSong.name;
            songNameEl.title = currentSong.name; // Add title for long names
            songArtistEl.textContent = currentSong.artist;
            songArtistEl.title = currentSong.artist;
            songAlbumEl.textContent = currentSong.album || '-';
            songAlbumEl.title = currentSong.album || '';
            songCoverEl.src = currentSong.cover || '';
            songCoverEl.alt = currentSong.name ? `封面: ${currentSong.name}` : '封面';
            
            // 显示音频流模式指示
            if (streamModeEl) {
                if (currentSong.audioSrc || currentSong.mediaElement) {
                    streamModeEl.textContent = '✓ 支持直接下载';
                    streamModeEl.style.display = 'block';
                } else {
                    streamModeEl.style.display = 'none';
                }
            }
            
            // 启用下载按钮
            qualityButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
            
            quickDownloadButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
        } else {
            // 无歌曲信息时显示默认状态
            songNameEl.textContent = '未检测到歌曲';
            songArtistEl.textContent = '-';
            songAlbumEl.textContent = '-';
            songCoverEl.src = '';
            songCoverEl.alt = '封面';
            
            if (streamModeEl) {
                streamModeEl.style.display = 'none';
            }
            
            // 禁用下载按钮
            qualityButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            });
            
            quickDownloadButtons.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            });
        }
    }

    // 显示下载进度
    function showProgress(percent) {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        
        const progressContainer = panel.querySelector('.music-dl-progress-container');
        const progressFill = panel.querySelector('.music-dl-progress-fill');
        const progressText = panel.querySelector('.music-dl-progress-text');
        
        if (!progressContainer || !progressFill || !progressText) return;
        
        progressContainer.style.display = 'block';
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
        
        if (percent >= 100) {
            setTimeout(() => {
                hideProgress();
            }, 2000);
        }
    }

    // 隐藏下载进度
    function hideProgress() {
        const panel = document.querySelector('.music-dl-panel');
        if (!panel) return;
        
        const progressContainer = panel.querySelector('.music-dl-progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    // 显示通知
    function showNotification(title, message, type = 'info') {
        if (!CONFIG.showNotifications) return;
        
        // 使用SweetAlert2显示通知
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        
        // 同时使用GM_notification作为备份
        GM_notification({
            title: title,
            text: message,
            timeout: 3000
        });
    }

    // ================ 网易云音乐相关 ================
    // 监测网易云音乐播放
    function monitorNeteasePlaying() {
        if (!CONFIG.autoDetect) return;
        console.log("开始监测网易云音乐播放...");
        
        // 检查iframe
        function checkIframe() {
            const iframe = document.querySelector('#g_iframe');
            if (iframe) {
                console.log("网易云: 找到iframe");
                try {
                    // 监听iframe加载完成
                    iframe.addEventListener('load', function() {
                        console.log("网易云: iframe加载完成");
                        setTimeout(() => {
                            try {
                                extractNeteaseInfo(iframe.contentDocument);
                            } catch (e) {
                                console.error("网易云: iframe内容提取失败", e);
                            }
                        }, 1000);
                    });
                    
                    // 立即尝试提取
                    if (iframe.contentDocument) {
                        extractNeteaseInfo(iframe.contentDocument);
                    }
                } catch (e) {
                    console.error("网易云: 访问iframe失败", e);
                }
            }
        }
        
        // 监听audio元素
        function monitorAudioElements() {
            const audioElements = document.querySelectorAll('audio');
            if (audioElements.length > 0) {
                console.log(`网易云: 找到 ${audioElements.length} 个 audio 元素`);
                
                // 为每个audio元素添加事件监听
                audioElements.forEach(audio => {
                    // 存储已找到的audio元素
                    if (!currentSong.mediaElement && audio.src && audio.src.startsWith('http')) {
                        currentSong.mediaElement = audio;
                        currentSong.audioSrc = audio.src;
                        console.log("网易云: 捕获到音频流地址:", audio.src);
                        updateSongInfo();
                    }
                    
                    // 监听src变化
                    const audioObserver = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                                const audioElement = mutation.target;
                                if (audioElement.src && audioElement.src.startsWith('http')) {
                                    console.log("网易云: audio src变化:", audioElement.src);
                                    currentSong.mediaElement = audioElement;
                                    currentSong.audioSrc = audioElement.src;
                                    updateSongInfo();
                                }
                            }
                        });
                    });
                    
                    audioObserver.observe(audio, { attributes: true });
                    
                    // 监听播放事件
                    audio.addEventListener('play', () => {
                        console.log("网易云: audio播放事件触发");
                        if (audio.src && audio.src.startsWith('http')) {
                            currentSong.mediaElement = audio;
                            currentSong.audioSrc = audio.src;
                            extractNeteaseInfo();
                        }
                    });
                });
            } else {
                // 如果没有找到，稍后重试
                setTimeout(monitorAudioElements, 3000);
            }
            
            // 尝试在iframe中查找audio元素
            try {
                const iframe = document.querySelector('#g_iframe');
                if (iframe && iframe.contentDocument) {
                    const iframeAudios = iframe.contentDocument.querySelectorAll('audio');
                    if (iframeAudios.length > 0) {
                        console.log(`网易云: 在iframe中找到 ${iframeAudios.length} 个 audio 元素`);
                        
                        iframeAudios.forEach(audio => {
                            if (!currentSong.mediaElement && audio.src && audio.src.startsWith('http')) {
                                currentSong.mediaElement = audio;
                                currentSong.audioSrc = audio.src;
                                console.log("网易云: 从iframe捕获到音频流地址:", audio.src);
                                updateSongInfo();
                            }
                            
                            audio.addEventListener('play', () => {
                                console.log("网易云: iframe audio播放事件触发");
                                if (audio.src && audio.src.startsWith('http')) {
                                    currentSong.mediaElement = audio;
                                    currentSong.audioSrc = audio.src;
                                    extractNeteaseInfo(iframe.contentDocument);
                                }
                            });
                        });
                    }
                }
            } catch (e) {
                console.error("网易云: 访问iframe中的audio元素出错", e);
            }
        };

        // 开始监听audio元素
        setTimeout(monitorAudioElements, 2000);
        
        // 开始检查iframe
        setTimeout(checkIframe, 1000);
        
        // 初始检查
        setTimeout(extractNeteaseInfo, 2000);
        
        // 定期检查audio元素
        setInterval(monitorAudioElements, 10000);
    }

    // 提取网易云音乐信息
    function extractNeteaseInfo(iframeDoc = null) {
        console.log("尝试提取网易云音乐信息...");
        let songName = '', artistName = '', albumName = '', songId = '', coverUrl = '';

        // 1. 从URL提取歌曲ID
        const urlMatch = window.location.href.match(/[?&/#]id=(\d+)/);
        if (urlMatch) {
            songId = urlMatch[1];
            console.log("网易云: 从URL提取到歌曲ID:", songId);
        }

        // 2. 从iframe提取信息
        if (iframeDoc) {
            try {
                console.log("网易云: 从iframe提取信息");
                
                // 尝试多种选择器以提高兼容性
                const titleElement = iframeDoc.querySelector('.tit, .f-ff2, .hd .tit');
                const artistElements = iframeDoc.querySelectorAll('.des a, .s-fc7, p.des.s-fc4 > span > a');
                const albumElement = iframeDoc.querySelector('.des + p a, p.des.s-fc4 + p > a');
                const coverImg = iframeDoc.querySelector('.cover img, .u-cover img, .j-img');

                if (titleElement) {
                    songName = titleElement.textContent.trim();
                }
                
                if (artistElements.length > 0) {
                    artistName = Array.from(artistElements)
                        .map(a => a.textContent.trim())
                        .filter(text => text && !text.includes('的音乐'))
                        .join(', ');
                }
                
                if (albumElement) {
                    albumName = albumElement.textContent.trim();
                }
                
                if (coverImg && coverImg.src) {
                    coverUrl = coverImg.src.replace(/\?param=\d+y\d+$/, '?param=200y200');
                }
                
                console.log(`网易云iframe提取: 歌名=${songName}, 艺术家=${artistName}, 专辑=${albumName}`);
                
                // 尝试在iframe中查找audio元素
                if (!currentSong.mediaElement) {
                    const iframeAudios = iframeDoc.querySelectorAll('audio');
                    if (iframeAudios.length > 0) {
                        console.log(`网易云: 在iframe中找到 ${iframeAudios.length} 个 audio 元素`);
                        
                        iframeAudios.forEach(audio => {
                            if (audio.src && audio.src.startsWith('http')) {
                                currentSong.mediaElement = audio;
                                currentSong.audioSrc = audio.src;
                                console.log("网易云: 从iframe捕获到音频流地址:", audio.src);
                            }
                        });
                    }
                }
            } catch (e) {
                console.error("网易云: 从iframe提取信息失败", e);
            }
        }

        // 3. 从主页面底部播放栏提取
        if (!songName || !artistName) {
            try {
                console.log("网易云: 从主页面底部播放栏提取");
                
                const bottomBar = document.querySelector('.g-btmbar');
                if (bottomBar) {
                    const nameElement = bottomBar.querySelector('.name');
                    const artistElements = bottomBar.querySelectorAll('.by a');
                    const coverElement = bottomBar.querySelector('.head img');
                    
                    if (nameElement) {
                        songName = nameElement.textContent.trim();
                        // 尝试从href提取ID
                        if (!songId && nameElement.href) {
                            const idMatch = nameElement.href.match(/id=(\d+)/);
                            if (idMatch) songId = idMatch[1];
                        }
                    }
                    
                    if (artistElements.length > 0) {
                        artistName = Array.from(artistElements)
                            .map(a => a.textContent.trim())
                            .join(', ');
                    }
                    
                    if (coverElement && coverElement.src) {
                        coverUrl = coverElement.src.replace(/\?param=\d+y\d+$/, '?param=200y200');
                    }
                    
                    console.log(`网易云底部栏提取: 歌名=${songName}, 艺术家=${artistName}`);
                }
            } catch (e) {
                console.error("网易云: 从主页面提取信息失败", e);
            }
        }

        // 4. 如果有足够信息，更新当前歌曲
        if ((songId && songName && artistName) || (songName && artistName)) {
            const effectiveId = songId || `${songName}-${artistName}`;
            
            if (currentSong.id !== effectiveId || currentSong.name !== songName) {
                console.log('检测到新网易云歌曲:', songName, artistName, effectiveId);
                
                currentSong = {
                    id: effectiveId,
                    name: songName,
                    artist: artistName,
                    album: albumName || '未知专辑',
                    cover: coverUrl,
                    audioSrc: currentSong.audioSrc || '',
                    mediaElement: currentSong.mediaElement || null,
                    platform: PLATFORM.NETEASE
                };
                
                const floatBtn = document.querySelector('.music-dl-btn');
                if (floatBtn) floatBtn.classList.add('active');
                
                if (CONFIG.showNotifications) {
                    showNotification('检测到歌曲', `${songName} - ${artistName}`, 'info');
                }
                
                updateSongInfo();
                return true;
            } else if (currentSong.cover !== coverUrl && coverUrl) {
                // 更新封面
                currentSong.cover = coverUrl;
                updateSongInfo();
            }
            
            return true;
        } else {
            console.log('未能检测到完整的网易云歌曲信息');
            return false;
        }
    }

    // 获取网易云音乐下载链接
    function getNeteaseDownloadUrl(songId, quality) {
        return new Promise((resolve, reject) => {
            // 1. 如果优先使用直接音频流且有可用的音频流，直接返回
            if (CONFIG.preferDirectStream && (currentSong.audioSrc || currentSong.mediaElement)) {
                const audioSrc = currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src);
                if (audioSrc && audioSrc.startsWith('http')) {
                    console.log("网易云: 使用直接捕获的音频流:", audioSrc);
                    const isFlac = audioSrc.includes('.flac');
                    resolve({ 
                        url: audioSrc, 
                        size: 0, 
                        type: isFlac ? 'flac' : 'mp3',
                        directStream: true
                    });
                    return;
                }
            }
            
            // 2. 否则尝试API获取
            if (!songId || !/^\d+$/.test(songId)) {
                // 如果没有有效ID但有音频流，也使用音频流
                if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                    const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                    console.log("网易云: 无效ID，使用捕获的音频流:", audioSrc);
                    const isFlac = audioSrc.includes('.flac');
                    resolve({ 
                        url: audioSrc, 
                        size: 0, 
                        type: isFlac ? 'flac' : 'mp3',
                        directStream: true
                    });
                } else {
                    return reject('无效的网易云歌曲ID');
                }
                return;
            }

            // 使用新版API
            const apiUrl = `https://music.163.com/api/song/enhance/player/url/v1?ids=[${songId}]&level=${quality}&encodeType=aac`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: {
                    'Referer': 'https://music.163.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.code === 200 && data.data && data.data.length > 0) {
                            const songData = data.data[0];
                            if (songData.url) {
                                const type = songData.type === 'flac' ? 'flac' : 'mp3';
                                resolve({ url: songData.url, size: songData.size, type: type });
                            } else {
                                // API无法获取链接，尝试使用直接音频流
                                if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                                    const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                                    console.log("网易云: API无法获取链接，使用捕获的音频流:", audioSrc);
                                    const isFlac = audioSrc.includes('.flac');
                                    resolve({ 
                                        url: audioSrc, 
                                        size: 0, 
                                        type: isFlac ? 'flac' : 'mp3',
                                        directStream: true
                                    });
                                } else {
                                    reject('无法获取下载链接 (可能需要VIP或版权限制)');
                                }
                            }
                        } else {
                            // API失败，尝试使用直接音频流
                            if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                                const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                                console.log("网易云: API返回错误，使用捕获的音频流:", audioSrc);
                                const isFlac = audioSrc.includes('.flac');
                                resolve({ 
                                    url: audioSrc, 
                                    size: 0, 
                                    type: isFlac ? 'flac' : 'mp3',
                                    directStream: true
                                });
                            } else {
                                // 尝试获取歌曲详情
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: `https://music.163.com/api/song/detail?ids=[${songId}]`,
                                    headers: {
                                        'Referer': 'https://music.163.com/',
                                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                                    },
                                    onload: function(detailResponse) {
                                        try {
                                            const detailData = JSON.parse(detailResponse.responseText);
                                            if (detailData && detailData.songs && detailData.songs.length > 0) {
                                                const song = detailData.songs[0];
                                                reject(`歌曲 "${song.name}" 无法下载 (可能需要VIP或版权限制)`);
                                            } else {
                                                reject('无法获取歌曲详情');
                                            }
                                        } catch (e) {
                                            reject('解析歌曲详情失败: ' + e.message);
                                        }
                                    },
                                    onerror: function(error) {
                                        reject('请求歌曲详情失败: ' + JSON.stringify(error));
                                    }
                                });
                            }
                        }
                    } catch (e) {
                        // 解析失败，尝试使用直接音频流
                        if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                            const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                            console.log("网易云: API响应解析失败，使用捕获的音频流:", audioSrc);
                            const isFlac = audioSrc.includes('.flac');
                            resolve({ 
                                url: audioSrc, 
                                size: 0, 
                                type: isFlac ? 'flac' : 'mp3',
                                directStream: true
                            });
                        } else {
                            reject('解析响应失败: ' + e.message);
                        }
                    }
                },
                onerror: function(error) {
                    // 请求失败，尝试使用直接音频流
                    if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                        const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                        console.log("网易云: API请求失败，使用捕获的音频流:", audioSrc);
                        const isFlac = audioSrc.includes('.flac');
                        resolve({ 
                            url: audioSrc, 
                            size: 0, 
                            type: isFlac ? 'flac' : 'mp3',
                            directStream: true
                        });
                    } else {
                        reject('请求失败: ' + JSON.stringify(error));
                    }
                }
            });
        });
    }

    // ================ 酷狗音乐相关 ================
    // 监测酷狗音乐播放
    function monitorKugouPlaying() {
        if (!CONFIG.autoDetect) return;
        console.log("开始监测酷狗音乐播放...");

        // 监听页面标题变化
        const titleObserver = new MutationObserver(() => {
            console.log("酷狗页面标题变化，尝试提取信息");
            setTimeout(extractKugouInfo, 500);
        });
        
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleObserver.observe(titleElement, { childList: true });
            console.log("酷狗: 监听页面标题");
        }

        // 监听播放器区域
        const playerObserver = new MutationObserver(() => {
            console.log("酷狗播放器区域变化，尝试提取信息");
            setTimeout(extractKugouInfo, 500);
        });
        
        const playerElements = document.querySelectorAll('#player, #audioPlayer, .player_wrap, #kgPlayer');
        playerElements.forEach(el => {
            if (el) {
                playerObserver.observe(el, { childList: true, subtree: true });
                console.log("酷狗: 监听播放器元素", el);
            }
        });

        // 监听audio元素
        function monitorAudioElements() {
            const audioElements = document.querySelectorAll('audio');
            if (audioElements.length > 0) {
                console.log(`酷狗: 找到 ${audioElements.length} 个 audio 元素`);
                
                audioElements.forEach(audio => {
                    if (!currentSong.mediaElement && audio.src && audio.src.startsWith('http')) {
                        currentSong.mediaElement = audio;
                        currentSong.audioSrc = audio.src;
                        console.log("酷狗: 捕获到音频流地址:", audio.src);
                        updateSongInfo();
                    }
                    
                    // 监听src变化
                    const audioObserver = new MutationObserver(mutations => {
                        mutations.forEach(mutation => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                                const audioElement = mutation.target;
                                if (audioElement.src && audioElement.src.startsWith('http')) {
                                    console.log("酷狗: audio src变化:", audioElement.src);
                                    currentSong.mediaElement = audioElement;
                                    currentSong.audioSrc = audioElement.src;
                                    extractKugouInfo();
                                }
                            }
                        });
                    });
                    
                    audioObserver.observe(audio, { attributes: true });
                    
                    // 监听播放事件
                    audio.addEventListener('play', () => {
                        console.log("酷狗: audio播放事件触发");
                        if (audio.src && audio.src.startsWith('http')) {
                            currentSong.mediaElement = audio;
                            currentSong.audioSrc = audio.src;
                            extractKugouInfo();
                        }
                    });
                });
            } else {
                // 如果没有找到，稍后重试
                setTimeout(monitorAudioElements, 3000);
            }
        }

        // 开始监听audio元素
        setTimeout(monitorAudioElements, 2000);
        
        // 初始检查
        setTimeout(extractKugouInfo, 2000);
        
        // 定期检查
        setInterval(extractKugouInfo, 10000);
    }

    // 提取酷狗音乐信息
    function extractKugouInfo() {
        console.log("尝试提取酷狗音乐信息...");
        let songName = '', artistName = '', albumName = '', songId = '', coverUrl = '', audioSrc = '';

        // 1. 尝试获取音频流地址
        if (currentSong.mediaElement) {
            const audioElement = currentSong.mediaElement;
            if (audioElement.src && audioElement.src.startsWith('http')) {
                audioSrc = audioElement.src;
                currentSong.audioSrc = audioSrc;
                currentSong.mediaElement = audioElement;
            }
        } else if (!audioSrc) {
            const audio = document.querySelector('audio');
            if (audio && audio.src && audio.src.startsWith('http')) {
                audioSrc = audio.src;
                currentSong.mediaElement = audio;
            }
        }

        // 2. 获取歌曲Hash
        const hashMatch = window.location.hash.match(/hash=([A-Z0-9]+)/i);
        if (hashMatch) {
            songId = hashMatch[1];
        } else {
            // 尝试从DOM获取hash
            const playerElement = document.querySelector('[data-hash]');
            if (playerElement && playerElement.dataset.hash) {
                songId = playerElement.dataset.hash;
            } else if (window.KG_PLAYER && KG_PLAYER.currentSong && KG_PLAYER.currentSong.hash) {
                songId = KG_PLAYER.currentSong.hash;
            }
        }

        // 3. 从DOM获取歌曲信息
        // 尝试从标题中提取
        const pageTitle = document.title;
        if (pageTitle && !pageTitle.includes('酷狗音乐') && pageTitle.includes('-')) {
            const parts = pageTitle.split(/[-–—]/);
            if (parts.length >= 2) {
                songName = parts[0].trim();
                artistName = parts.slice(1).join('-').trim();
            }
        }

        // 尝试从播放器元素获取
        if (!songName) {
            const nameElement = document.querySelector('.songName, .song_name, .songinfo .title, #songname');
            if (nameElement) songName = nameElement.textContent.trim();
        }
        
        if (!artistName) {
            const artistElement = document.querySelector('.singerName, .singer_name, .songinfo .artist a');
            if (artistElement) artistName = artistElement.textContent.trim();
        }
        
        if (!albumName) {
            const albumElement = document.querySelector('.albumName, .album_name, .songinfo .album a');
            if (albumElement) albumName = albumElement.textContent.trim();
        }

        // 4. 获取封面图片
        const coverImg = document.querySelector('.album_cover img, .albumImg img, #albumCover, .song_cover img');
        if (coverImg && coverImg.src) {
            coverUrl = coverImg.src;
        } else {
            const playerBg = document.querySelector('.player_bg, #playerBg');
            if (playerBg && playerBg.style.backgroundImage) {
                const bgUrlMatch = playerBg.style.backgroundImage.match(/url\("?(.*?)"?\)/);
                if (bgUrlMatch && bgUrlMatch[1]) {
                    coverUrl = bgUrlMatch[1];
                }
            }
        }

        // 5. 更新全局状态
        if (songName && artistName) {
            const effectiveId = songId || `${songName}-${artistName}`;
            
            if (currentSong.id !== effectiveId || currentSong.platform !== PLATFORM.KUGOU || currentSong.name !== songName) {
                console.log('检测到新酷狗歌曲:', songName, artistName, effectiveId);
                
                currentSong = {
                    id: effectiveId,
                    name: songName,
                    artist: artistName,
                    album: albumName || '未知专辑',
                    cover: coverUrl,
                    audioSrc: audioSrc || currentSong.audioSrc,
                    mediaElement: currentSong.mediaElement,
                    platform: PLATFORM.KUGOU
                };
                
                const floatBtn = document.querySelector('.music-dl-btn');
                if (floatBtn) floatBtn.classList.add('active');
                
                if (CONFIG.showNotifications) {
                    showNotification('检测到歌曲', `${songName} - ${artistName}`, 'info');
                }
                
                updateSongInfo();
                return true;
            } else if (currentSong.cover !== coverUrl || currentSong.audioSrc !== audioSrc) {
                // 更新封面和音频源
                if (coverUrl) currentSong.cover = coverUrl;
                if (audioSrc) currentSong.audioSrc = audioSrc;
                updateSongInfo();
                return true;
            }
            
            return true;
        } else {
            console.log('未能检测到完整的酷狗歌曲信息');
            return false;
        }
    }

    // 获取酷狗音乐下载链接
    function getKugouDownloadUrl(songHash, quality) {
        return new Promise((resolve, reject) => {
            // 1. 如果优先使用直接音频流且有可用的音频流，直接返回
            if (CONFIG.preferDirectStream && (currentSong.audioSrc || currentSong.mediaElement)) {
                const audioSrc = currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src);
                if (audioSrc && audioSrc.startsWith('http')) {
                    console.log("酷狗: 使用直接捕获的音频流:", audioSrc);
                    const isFlac = audioSrc.includes('.flac');
                    resolve({ 
                        url: audioSrc, 
                        size: 0, 
                        type: isFlac ? 'flac' : 'mp3',
                        directStream: true
                    });
                    return;
                }
            }
            
            // 2. 否则尝试API获取
            if (!songHash || !/^[A-Z0-9]+$/i.test(songHash)) {
                if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                    const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                    console.log("酷狗: Hash无效，使用捕获的audioSrc:", audioSrc);
                    const isFlac = audioSrc.includes('.flac');
                    resolve({ 
                        url: audioSrc, 
                        size: 0, 
                        type: isFlac ? 'flac' : 'mp3',
                        directStream: true
                    });
                } else {
                    return reject('无效或缺失的酷狗歌曲Hash');
                }
                return;
            }
            
            const apiUrl = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${songHash}&dfid=-&mid=-&platid=4`;
            console.log("酷狗API请求URL:", apiUrl);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: {
                    'Referer': 'https://www.kugou.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.status === 1 && data.data && data.data.play_url) {
                            let url = data.data.play_url;
                            let type = 'mp3';
                            if (data.data.extname === 'flac' || url.includes('.flac')) type = 'flac';
                            if (quality === 'lossless' && type !== 'flac') console.warn("酷狗: 请求无损但API未返回FLAC");
                            resolve({ url: url, size: data.data.filesize || 0, type: type });
                        } else {
                            // API获取失败，尝试使用直接音频流
                            if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                                const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                                console.log("酷狗: API获取链接失败，使用捕获的audioSrc:", audioSrc);
                                const isFlac = audioSrc.includes('.flac');
                                resolve({ 
                                    url: audioSrc, 
                                    size: 0, 
                                    type: isFlac ? 'flac' : 'mp3',
                                    directStream: true
                                });
                            } else {
                                reject(data.err_code ? `API错误 ${data.err_code}` : '无法获取下载链接 (可能需要VIP或版权限制)');
                            }
                        }
                    } catch (e) {
                        // 解析失败，尝试使用直接音频流
                        if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                            const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                            console.log("酷狗: API响应解析失败，使用捕获的audioSrc:", audioSrc);
                            const isFlac = audioSrc.includes('.flac');
                            resolve({ 
                                url: audioSrc, 
                                size: 0, 
                                type: isFlac ? 'flac' : 'mp3',
                                directStream: true
                            });
                        } else {
                            reject('解析响应失败: ' + e.message);
                        }
                    }
                },
                onerror: function(error) {
                    // 请求失败，尝试使用直接音频流
                    if (currentSong.audioSrc || (currentSong.mediaElement && currentSong.mediaElement.src)) {
                        const audioSrc = currentSong.audioSrc || currentSong.mediaElement.src;
                        console.log("酷狗: API请求失败，使用捕获的audioSrc:", audioSrc);
                        const isFlac = audioSrc.includes('.flac');
                        resolve({ 
                            url: audioSrc, 
                            size: 0, 
                            type: isFlac ? 'flac' : 'mp3',
                            directStream: true
                        });
                    } else {
                        reject('请求失败: ' + JSON.stringify(error));
                    }
                }
            });
        });
    }

    // ================ 下载功能 ================
    function quickDownload(format) {
        if (!currentSong.name || !currentSong.artist) {
            showNotification('下载失败', '请先播放一首歌曲', 'warning');
            return;
        }
        const quality = (format === 'flac') ? 'lossless' : CONFIG.defaultQuality;
        downloadSong(quality, format);
    }

    function downloadSong(quality, preferredFormat = null) {
        if (!currentSong.name || !currentSong.artist) {
            showNotification('下载失败', '未检测到有效的歌曲信息', 'error');
            return;
        }
        
        showProgress(0);
        console.log(`开始下载: ${currentSong.name}, 音质=${quality}, 平台=${currentSong.platform}`);
        
        let downloadPromise;
        if (currentSong.platform === PLATFORM.NETEASE) {
            downloadPromise = getNeteaseDownloadUrl(currentSong.id, quality);
        } else if (currentSong.platform === PLATFORM.KUGOU) {
            downloadPromise = getKugouDownloadUrl(currentSong.id, quality);
        } else {
            showNotification('下载失败', '不支持的平台', 'error');
            hideProgress();
            return;
        }
        
        downloadPromise.then(async data => {
            if (!data || !data.url) throw new Error('获取下载链接失败 (无URL返回)');
            
            // 修复：确保flac格式正确识别，即使URL不包含.flac后缀
            let actualType = data.type;
            let needsConversion = false;
            
            // 检查是否需要转换为FLAC
            if ((quality === 'lossless' || preferredFormat === 'flac') && actualType !== 'flac') {
                console.log("检测到需要转换为FLAC格式");
                needsConversion = true;
            } else if (data.url.includes('.flac')) {
                actualType = 'flac';
            } else if (!actualType) {
                actualType = 'mp3';
            }
            
            let fileName;
            
            // 针对网易云音乐，简化文件名
            if (currentSong.platform === PLATFORM.NETEASE) {
                fileName = `${currentSong.name} - ${currentSong.artist}.${needsConversion ? 'flac' : actualType}`;
            } else {
                // 酷狗音乐保持原有格式
                fileName = `${currentSong.name} - ${currentSong.artist}`;
                
                if (needsConversion || actualType === 'flac') {
                    fileName += ' [FLAC]';
                } else {
                    switch (quality) {
                        case 'exhigh': fileName += ' [320K]'; break;
                        case 'higher': fileName += ' [320K]'; break;
                        case 'standard': fileName += ' [128K]'; break;
                        default: fileName += ' [MP3]';
                    }
                }
                
                fileName += `.${needsConversion ? 'flac' : actualType}`;
            }
            
            fileName = fileName.replace(/[\\/:*?"<>|]/g, '_');
            
            console.log(`准备下载: URL=${data.url}, Filename=${fileName}, 类型=${actualType}, 直接流=${data.directStream ? '是' : '否'}, 需要转换=${needsConversion ? '是' : '否'}`);
            
            // 显示直接流下载提示
            if (data.directStream) {
                showNotification('使用直接音频流', '正在下载会员歌曲...', 'info');
            }
            
            // 如果需要转换为FLAC格式
            if (needsConversion && (quality === 'lossless' || preferredFormat === 'flac')) {
                try {
                    console.log("开始转换为FLAC格式...");
                    showProgress(10);
                    
                    // 转换为FLAC
                    const flacBlob = await convertToFlac(data.url, fileName);
                    
                    if (!flacBlob) {
                        throw new Error("转换FLAC格式失败");
                    }
                    
                    showProgress(80);
                    console.log("FLAC转换完成，准备下载");
                    
                    // 创建Blob URL并下载
                    const blobUrl = URL.createObjectURL(flacBlob);
                    
                    GM_download({
                        url: blobUrl,
                        name: fileName,
                        saveAs: false,
                        onload: function() {
                            console.log("FLAC下载完成:", fileName);
                            showProgress(100);
                            showNotification('下载完成', `${fileName}`, 'success');
                            URL.revokeObjectURL(blobUrl);
                        },
                        onerror: function(error) {
                            console.error("FLAC下载错误:", error);
                            showNotification('下载失败', `错误: ${error.error || '未知错误'}`, 'error');
                            hideProgress();
                            URL.revokeObjectURL(blobUrl);
                        }
                    });
                    
                    return;
                } catch (error) {
                    console.error("FLAC转换或下载失败:", error);
                    showNotification('FLAC转换失败', '将使用原始格式下载', 'warning');
                    // 转换失败时继续使用原始格式下载
                }
            }
            
            // 正常下载流程
            GM_download({
                url: data.url,
                name: fileName,
                saveAs: false,
                onload: function() {
                    console.log("下载完成:", fileName);
                    showProgress(100);
                    showNotification('下载完成', `${fileName}`, 'success');
                },
                onerror: function(error) {
                    console.error("下载错误:", error);
                    showNotification('下载失败', `错误: ${error.error || '未知错误'}`, 'error');
                    hideProgress();
                },
                ontimeout: function() {
                    console.error("下载超时");
                    showNotification('下载失败', '下载超时', 'error');
                    hideProgress();
                },
                onprogress: function(e) {
                    if (e.lengthComputable && e.total > 0) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        showProgress(percent);
                    }
                }
            });
        }).catch(error => {
            console.error("获取下载链接时出错:", error);
            showNotification('获取链接失败', `${error}`, 'error');
            hideProgress();
        });
    }

    // ================ 初始化 ================
    function init() {
        console.log('音乐下载助手初始化开始 (v1.2.9)...');
        
        // 确保样式先注入
        try {
            injectStyles();
            console.log('样式注入成功');
        } catch (e) {
            console.error("样式注入失败:", e);
        }
        
        // 初始化音频转换器
        initAudioConverter().then(success => {
            if (success) {
                console.log("音频转换器初始化成功");
            } else {
                console.warn("音频转换器初始化失败，FLAC转换功能可能不可用");
            }
        });
        
        // 创建UI并开始监听
        setTimeout(() => {
            try {
                createUI();
                updateSongInfo(); // 初始UI状态
                console.log('UI 创建完成');
                
                // 开始监听
                if (currentPlatform === PLATFORM.NETEASE) {
                    monitorNeteasePlaying();
                } else if (currentPlatform === PLATFORM.KUGOU) {
                    monitorKugouPlaying();
                }
                
                // 注册菜单命令
                GM_registerMenuCommand('音乐下载助手设置', function() {
                    showPanel();
                    toggleSettings();
                });
                
                console.log('音乐下载助手初始化完成，当前平台:', currentPlatform);
            } catch (e) {
                console.error("初始化失败:", e);
                
                // 尝试重新初始化
                setTimeout(() => {
                    try {
                        console.log('尝试重新初始化...');
                        if (!document.querySelector('.music-dl-btn')) {
                            createUI();
                            
                            if (currentPlatform === PLATFORM.NETEASE) {
                                monitorNeteasePlaying();
                            } else if (currentPlatform === PLATFORM.KUGOU) {
                                monitorKugouPlaying();
                            }
                        }
                    } catch (e2) {
                        console.error("重新初始化失败:", e2);
                    }
                }, 5000);
            }
        }, 1000);
    }

    // 确保在页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 备份方案：如果DOMContentLoaded错过了，使用load事件
    window.addEventListener('load', () => {
        if (!document.querySelector('.music-dl-btn')) {
            console.log('使用window.load事件初始化');
            init();
        }
    });
    
    // 立即尝试初始化
    setTimeout(() => {
        if (!document.querySelector('.music-dl-btn')) {
            console.log('使用setTimeout初始化');
            init();
        }
    }, 2000);
})();

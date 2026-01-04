// ==UserScript==
// @name         豆包播客音频获取
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  捕获豆包网页版中的音频数据，支持直接下载、合并下载多个音频 此为修改版 原脚本作者：cenglin123 https://greasyfork.org/zh-CN/scripts/533430-%E8%B1%86%E5%8C%85%E7%BD%91%E9%A1%B5%E7%89%88%E9%9F%B3%E9%A2%91%E6%8D%95%E8%8E%B7%E4%B8%8E%E5%90%88%E5%B9%B6
// @author       木子不是木子狸
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
// @downloadURL https://update.greasyfork.org/scripts/534955/%E8%B1%86%E5%8C%85%E6%92%AD%E5%AE%A2%E9%9F%B3%E9%A2%91%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534955/%E8%B1%86%E5%8C%85%E6%92%AD%E5%AE%A2%E9%9F%B3%E9%A2%91%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储捕获的音频数据
    let capturedAudio = [];
    let isMonitoring = false;
    let originalXHR = unsafeWindow.XMLHttpRequest;
    let originalFetch = unsafeWindow.fetch;
    let observer = null;
    let isDarkMode = false;
    
    // 自动合并下载相关变量
    let autoMergeTimer = null;
    let lastCaptureCount = 0;
    let isAutoMergeEnabled = true; // 默认启用自动合并功能
    
    // 检测暗黑模式
    function detectDarkMode() {
        // 检查系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        
        // 检查页面背景色
        const bodyBg = window.getComputedStyle(document.body).backgroundColor;
        if (bodyBg) {
            // 转换为RGB值并判断亮度
            const rgb = bodyBg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
                // 计算亮度 (简化版)
                const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                return brightness < 128;
            }
        }
        
        // 尝试查找豆包网站特定的暗色模式元素
        return document.documentElement.classList.contains('dark') || 
               document.body.classList.contains('dark-theme') ||
               document.querySelector('[data-theme="dark"]') !== null;
    }
    
    // 创建UI
    function createMainInterface() {
        // 检查是否已存在UI
        if (document.getElementById('audio-capture-panel')) {
            const panel = document.getElementById('audio-capture-panel');
            panel.style.display = 'block';
            
            // 如果之前最小化了，还需要检查并恢复正常状态
            if (panel.classList.contains('minimized')) {
                // 确保迷你按钮容器可见
                const miniButtons = panel.querySelector('.mini-buttons-container');
                if (miniButtons) {
                    miniButtons.classList.add('active');
                    miniButtons.style.display = '';
                }
            } else {
                // 显示所有子元素
                Array.from(panel.children).forEach(child => {
                    if (child.id !== 'panel-drag-handle') {
                        child.style.display = '';
                    }
                });
                panel.style.height = 'auto';
            }
            
            return;
        }
        
        // 检测暗黑模式
        isDarkMode = detectDarkMode();
        
        // 添加全局样式
        const globalStyle = document.createElement('style');
        globalStyle.textContent = `
            #audio-capture-panel * {
                box-sizing: border-box;
                font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
            }
            #audio-capture-panel {
                transition: all 0.3s ease;
                user-select: none;
            }
            #panel-drag-handle {
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
            }
            #panel-drag-handle h3 {
                margin: 0;
                color: ${isDarkMode ? '#7AB4FF' : '#4285f4'};
                font-size: 16px;
                font-weight: 600;
            }
            .panel-actions {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .action-buttons-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 15px;
            }
            .action-button {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding: 12px 5px;
                border-radius: 10px;
                transition: all 0.2s;
            }
            .action-button svg {
                width: 22px;
                height: 22px;
                margin-bottom: 5px;
            }
            .action-button-text {
                font-size: 12px;
                font-weight: 500;
            }
            /* 最小化模式样式 */
            #audio-capture-panel.minimized {
                width: auto !important;
                height: auto !important;
                padding: 10px;
                border-radius: 10px;
            }
            .mini-buttons-container {
                display: none;
                flex-direction: row;
                align-items: center;
                gap: 8px;
            }
            .mini-buttons-container.active {
                display: flex !important; /* 使用!important确保优先级 */
            }
            #audio-capture-panel.minimized .mini-buttons-container {
                display: flex;
            }
            .mini-button {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                border: none;
                background: ${isDarkMode ? 'rgba(60, 60, 70, 0.7)' : 'rgba(248, 248, 248, 0.9)'};
                color: ${isDarkMode ? '#eee' : '#333'};
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }
            .mini-button svg {
                width: 18px;
                height: 18px;
            }
            .mini-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .mini-button.active {
                background: ${isDarkMode ? '#2D5A9F' : '#4285f4'};
                color: white;
            }
            .mini-button.red {
                background: ${isDarkMode ? '#A1352B' : '#db4437'};
                color: white;
            }
            .mini-button.green {
                background: ${isDarkMode ? '#096D3B' : '#0f9d58'};
                color: white;
            }
            .mini-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: ${isDarkMode ? '#2D5A9F' : '#4285f4'};
                color: white;
                font-size: 10px;
                font-weight: bold;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #audio-capture-panel button {
                transition: all 0.2s ease;
                border: none;
                border-radius: 8px;
                padding: 10px 15px;
                cursor: pointer;
                font-weight: 500;
                font-size: 14px;
                outline: none;
            }
            #audio-capture-panel button:hover {
                filter: brightness(1.1);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            #audio-capture-panel button:active {
                transform: translateY(0);
                filter: brightness(0.95);
            }
            .audio-capture-modal-backdrop {
                backdrop-filter: blur(8px);
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(66, 133, 244, 0); }
                100% { box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
            }
            .pulse-animation {
                animation: pulse 1.5s infinite;
            }
            #global-play-button {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: linear-gradient(135deg, ${isDarkMode ? '#3a6bc9, #2D5A9F' : '#5294ff, #4285f4'});
                color: white;
                font-weight: 600;
                overflow: hidden;
                width: 100%;
                margin-bottom: 15px;
            }
            #global-play-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: all 0.5s;
            }
            #global-play-button:hover::before {
                left: 100%;
            }
            #status-area {
                margin-top: 10px;
                padding: 10px;
                font-size: 12px;
                border-radius: 8px;
                transition: all 0.3s;
                min-height: 20px;
                text-align: center;
            }
        `;
        document.head.appendChild(globalStyle);
        
        const panel = document.createElement('div');
        panel.id = 'audio-capture-panel';
        
        // 根据暗黑模式设置样式
        updatePanelTheme(panel, isDarkMode);
        
        // 添加动画样式
        const animStyle = document.createElement('style');
        animStyle.textContent = `
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }
        `;
        document.head.appendChild(animStyle);
        
        panel.innerHTML = `
            <div id="panel-drag-handle">
                <h3>豆包播客音频获取</h3>
                <div class="panel-actions">
                    <button id="minimize-tool" style="background: none; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 50%; padding: 0; color: ${isDarkMode ? '#aaa' : '#666'}; margin-right: 5px;">_</button>
                    <button id="close-tool" style="background: none; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 50%; padding: 0; color: ${isDarkMode ? '#aaa' : '#666'};">✕</button>
                </div>
            </div>
            
            <!-- 最小化模式的按钮组 -->
            <div class="mini-buttons-container">
                <button class="mini-button" id="mini-play" title="播放音频">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"></path>
                    </svg>
                </button>
                <button class="mini-button" id="mini-monitor" title="开始/停止监控">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                        <path d="M13 7h-2v6h6v-2h-4z"/>
                    </svg>
                </button>
                <button class="mini-button" id="mini-view" title="查看已捕获的音频">
                    <span id="mini-audio-count" class="mini-count">0</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 15V5c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2zM7 5h10l.001 10H7V5z"/>
                        <path d="M5 21h12c1.103 0 2-.897 2-2v-2h-2v2H5V7H3v12c0 1.103.897 2 2 2z"/>
                    </svg>
                </button>
                <button class="mini-button green" id="mini-download" title="合并下载">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 16l4-5h-3V4h-2v7H8z"/>
                        <path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"/>
                    </svg>
                </button>
                <button class="mini-button" id="mini-expand" title="展开面板">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 11H3c-.6 0-1 .4-1 1s.4 1 1 1h18c.6 0 1-.4 1-1s-.4-1-1-1zm0-4H3c-.6 0-1 .4-1 1s.4 1 1 1h18c.6 0 1-.4 1-1s-.4-1-1-1zm0-4H3c-.6 0-1 .4-1 1s.4 1 1 1h18c.6 0 1-.4 1-1s-.4-1-1-1zm-18 16h18c.6 0 1-.4 1-1s-.4-1-1-1H3c-.6 0-1 .4-1 1s.4 1 1 1z"/>
                    </svg>
                </button>
            </div>
            
            <button id="global-play-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M5.714 8.857h.8l.596-.532 4.366-3.899v15.148L7.11 15.675l-.596-.532H3.095V8.857zm0-2.095 5.295-4.728c1.027-.834 2.562-.103 2.562 1.22v17.492c0 1.324-1.535 2.054-2.562 1.22l-5.295-4.728H3.095A2.095 2.095 0 0 1 1 15.143V8.857c0-1.157.938-2.095 2.095-2.095zM18.03 4.274a1.05 1.05 0 0 1 1.48-.082A10.45 10.45 0 0 1 23 12c0 3.103-1.35 5.892-3.492 7.809a1.048 1.048 0 0 1-1.397-1.562A8.36 8.36 0 0 0 20.905 12a8.36 8.36 0 0 0-2.794-6.247 1.05 1.05 0 0 1-.082-1.48m-.5 3.924a1.048 1.048 0 0 0-1.63 1.318c.606.748.932 1.518.932 2.484 0 .967-.326 1.736-.931 2.484a1.048 1.048 0 0 0 1.629 1.318c.85-1.052 1.397-2.274 1.397-3.802s-.546-2.75-1.397-3.802" clip-rule="evenodd"></path></svg>
                播放音频
            </button>
            
            <div style="margin-bottom: 15px; background: ${isDarkMode ? 'rgba(40, 40, 45, 0.5)' : 'rgba(248, 248, 248, 0.8)'}; padding: 12px; border-radius: 10px;">
                <label for="file-name-prefix" style="display: block; margin-bottom: 8px; font-size: 13px; color: ${isDarkMode ? '#ccc' : '#555'};">文件名前缀:</label>
                <input type="text" id="file-name-prefix" value="doubao_audio" style="width: 100%; padding: 8px; border: 1px solid ${isDarkMode ? '#444' : '#e0e0e0'}; border-radius: 8px; background: ${isDarkMode ? 'rgba(30, 30, 35, 0.7)' : 'rgba(255, 255, 255, 0.9)'}; color: ${isDarkMode ? '#eee' : '#333'}; font-size: 13px; transition: all 0.2s;">
            </div>
            
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <input type="checkbox" id="auto-merge-toggle" checked style="margin-right: 8px; width: 16px; height: 16px; accent-color: ${isDarkMode ? '#2D5A9F' : '#4285f4'};">
                <label for="auto-merge-toggle" style="font-size: 13px; color: ${isDarkMode ? '#ccc' : '#555'};">5秒无新音频时自动合并下载</label>
            </div>
            
            <div class="action-buttons-container">
                <button class="action-button" id="monitor-toggle" style="background: ${isMonitoring ? (isDarkMode ? '#A1352B' : '#db4437') : (isDarkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)')}; color: ${isMonitoring ? 'white' : (isDarkMode ? '#eee' : '#333')};">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                        <path d="M13 7h-2v6h6v-2h-4z"/>
                    </svg>
                    <span class="action-button-text">
                        ${isMonitoring ? '停止监控' : '开始监控'}
                    </span>
                </button>
                
                <button class="action-button" id="view-captured" style="background: ${isDarkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)'}; color: ${isDarkMode ? '#eee' : '#333'}; position: relative;">
                    <span id="audio-count" style="position: absolute; top: 5px; right: 5px; background: ${isDarkMode ? '#2D5A9F' : '#4285f4'}; color: white; padding: 1px 6px; border-radius: 10px; font-size: 11px; font-weight: bold;">0</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 15V5c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2zM7 5h10l.001 10H7V5z"/>
                        <path d="M5 21h12c1.103 0 2-.897 2-2v-2h-2v2H5V7H3v12c0 1.103.897 2 2 2z"/>
                    </svg>
                    <span class="action-button-text">
                        已捕获音频
                    </span>
                </button>
                
                <button class="action-button" id="merge-download" style="background: ${isDarkMode ? '#096D3B' : '#0f9d58'}; color: white;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 16l4-5h-3V4h-2v7H8z"/>
                        <path d="M20 18H4v-7H2v7c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-7h-2v7z"/>
                    </svg>
                    <span class="action-button-text">
                        合并下载
                    </span>
                </button>
                
                <button class="action-button" id="clear-all" style="background: ${isDarkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)'}; color: ${isDarkMode ? '#eee' : '#333'};">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"/>
                    </svg>
                    <span class="action-button-text">
                        清空列表
                    </span>
                </button>
            </div>
            
            <div style="display: flex; gap: 8px; margin-top: 5px;">
                <button id="direct-download" style="flex: 1; padding: 8px 5px; background: ${isDarkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)'}; color: ${isDarkMode ? '#eee' : '#333'}; border: 1px solid ${isDarkMode ? '#444' : '#e0e0e0'}; font-size: 12px;">解析URL</button>
                <button id="process-base64" style="flex: 1; padding: 8px 5px; background: ${isDarkMode ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)'}; color: ${isDarkMode ? '#eee' : '#333'}; border: 1px solid ${isDarkMode ? '#444' : '#e0e0e0'}; font-size: 12px;">处理Base64</button>
            </div>
            
            <div id="status-area" style="color: ${isDarkMode ? '#aaa' : '#666'}; background: ${isDarkMode ? 'rgba(40, 40, 45, 0.5)' : 'rgba(248, 248, 248, 0.8)'};">工具已准备就绪</div>
        `;
        
        document.body.appendChild(panel);
        
        // 添加面板拖动功能
        makePanelDraggable(panel);
        
        // 更新音频计数
        updateAudioCount();
        
        // 添加事件监听
        document.getElementById('close-tool').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // 添加最小化按钮功能
        document.getElementById('minimize-tool').addEventListener('click', () => {
            toggleMinimizeMode(panel);
        });
        
        // 添加迷你模式中的展开按钮功能
        document.getElementById('mini-expand').addEventListener('click', () => {
            toggleMinimizeMode(panel);
        });
        
        // 添加迷你模式的其他按钮事件
        document.getElementById('mini-play').addEventListener('click', triggerPageAudioPlay);
        document.getElementById('mini-monitor').addEventListener('click', toggleMonitoring);
        document.getElementById('mini-view').addEventListener('click', showCapturedAudioList);
        document.getElementById('mini-download').addEventListener('click', function() {
            showMergeOptions(true); // 自动全选
        });
        
        // 全局播放按钮
        document.getElementById('global-play-button').addEventListener('click', triggerPageAudioPlay);
        
        document.getElementById('direct-download').addEventListener('click', downloadFromDataUrl);
        document.getElementById('process-base64').addEventListener('click', handleBase64FromRequest);
        document.getElementById('view-captured').addEventListener('click', showCapturedAudioList);
        document.getElementById('merge-download').addEventListener('click', function() {
            // 调用合并选项但自动全选
            showMergeOptions(true);
        });
        
        // 清空列表按钮
        document.getElementById('clear-all').addEventListener('click', function() {
            if (confirm('确定要清空所有已捕获的音频吗？')) {
                capturedAudio = [];
                updateAudioCount();
                saveAudioData();
                updateStatus('已清空音频列表');
                
                // 清除自动合并计时器
                if (autoMergeTimer) {
                    clearTimeout(autoMergeTimer);
                    autoMergeTimer = null;
                }
            }
        });
        
        // 监控网络请求按钮
        document.getElementById('monitor-toggle').addEventListener('click', toggleMonitoring);
        
        // 美化输入框焦点效果
        const fileNameInput = document.getElementById('file-name-prefix');
        fileNameInput.addEventListener('focus', function() {
            this.style.border = `1px solid ${isDarkMode ? '#7AB4FF' : '#4285f4'}`;
            this.style.boxShadow = `0 0 0 2px ${isDarkMode ? 'rgba(122, 180, 255, 0.2)' : 'rgba(66, 133, 244, 0.2)'}`;
        });
        fileNameInput.addEventListener('blur', function() {
            this.style.border = `1px solid ${isDarkMode ? '#444' : '#e0e0e0'}`;
            this.style.boxShadow = 'none';
        });
        
        // 监听暗黑模式变化
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            isDarkMode = e.matches || detectDarkMode();
            updatePanelTheme(panel, isDarkMode);
        });
        
        // 每分钟检查一次暗黑模式变化（为了捕捉网站主题切换）
        setInterval(() => {
            const newDarkMode = detectDarkMode();
            if (newDarkMode !== isDarkMode) {
                isDarkMode = newDarkMode;
                updatePanelTheme(panel, isDarkMode);
            }
        }, 60000);
        
        // 自动合并下载复选框
        document.getElementById('auto-merge-toggle').addEventListener('change', function() {
            isAutoMergeEnabled = this.checked;
            updateStatus(`自动合并下载已${isAutoMergeEnabled ? '启用' : '禁用'}`);
        });
    }
    
    // 更新面板主题
    function updatePanelTheme(panel, isDark) {
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${isDark ? 'rgba(30, 30, 35, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
            border: ${isDark ? '1px solid #444' : 'none'};
            border-radius: 12px;
            padding: 15px;
            box-shadow: ${isDark ? '0 5px 25px rgba(0,0,0,0.25)' : '0 5px 25px rgba(0,0,0,0.15)'};
            z-index: 9999;
            font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
            max-width: 300px;
            width: 300px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: ${isDark ? '#eee' : '#333'};
            height: auto;
        `;
        
        // 更新其他元素
        if (document.getElementById('close-tool')) {
            document.getElementById('close-tool').style.color = isDark ? '#aaa' : '#666';
        }
        
        if (document.getElementById('monitor-toggle')) {
            const monitorBtn = document.getElementById('monitor-toggle');
            monitorBtn.style.background = isMonitoring ? 
                (isDark ? '#A1352B' : '#db4437') : 
                (isDark ? '#2D5A9F' : '#4285f4');
            monitorBtn.style.boxShadow = `0 2px 5px ${isDark ? 'rgba(0, 0, 0, 0.4)' : isMonitoring ? 'rgba(219, 68, 55, 0.3)' : 'rgba(66, 133, 244, 0.3)'}`;
        }
        
        // 文件名输入框
        if (document.getElementById('file-name-prefix')) {
            const input = document.getElementById('file-name-prefix');
            input.style.background = isDark ? 'rgba(30, 30, 35, 0.7)' : 'rgba(255, 255, 255, 0.9)';
            input.style.color = isDark ? '#eee' : '#333';
            input.style.border = `1px solid ${isDark ? '#444' : '#e0e0e0'}`;
        }
        
        // 查看已捕获的音频按钮
        if (document.getElementById('view-captured')) {
            const btn = document.getElementById('view-captured');
            btn.style.background = isDark ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)';
            btn.style.color = isDark ? '#eee' : '#333';
            btn.style.border = `1px solid ${isDark ? '#444' : '#e0e0e0'}`;
        }
        
        // 音频计数
        if (document.getElementById('audio-count')) {
            document.getElementById('audio-count').style.background = isDark ? '#2D5A9F' : '#4285f4';
        }
        
        // 合并下载按钮
        if (document.getElementById('merge-download')) {
            const btn = document.getElementById('merge-download');
            btn.style.background = isDark ? '#096D3B' : '#0f9d58';
            btn.style.boxShadow = `0 2px 5px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(15, 157, 88, 0.3)'}`;
        }
        
        // 清空列表按钮
        if (document.getElementById('clear-all')) {
            const btn = document.getElementById('clear-all');
            btn.style.background = isDark ? '#A1352B' : '#db4437';
            btn.style.boxShadow = `0 2px 5px ${isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(219, 68, 55, 0.3)'}`;
        }
        
        // 直接下载和处理Base64按钮
        const smallBtns = ['direct-download', 'process-base64'];
        smallBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.style.background = isDark ? 'rgba(60, 60, 70, 0.5)' : 'rgba(248, 248, 248, 0.8)';
                btn.style.color = isDark ? '#eee' : '#333';
                btn.style.border = `1px solid ${isDark ? '#444' : '#e0e0e0'}`;
            }
        });
        
        // 状态区域
        if (document.getElementById('status-area')) {
            const status = document.getElementById('status-area');
            status.style.background = isDark ? 'rgba(40, 40, 45, 0.5)' : 'rgba(248, 248, 248, 0.8)';
            status.style.color = isDark ? '#aaa' : '#666';
        }
        
        // 全局播放按钮
        if (document.getElementById('global-play-button')) {
            const btn = document.getElementById('global-play-button');
            btn.style.background = `linear-gradient(135deg, ${isDark ? '#3a6bc9, #2D5A9F' : '#5294ff, #4285f4'})`;
        }
    }
    
    // 更新状态区域
    function updateStatus(message) {
        const statusArea = document.getElementById('status-area');
        if (statusArea) {
            // 添加动画效果
            statusArea.style.background = isDarkMode ? 'rgba(45, 90, 159, 0.4)' : '#e8f0fe';
            statusArea.style.color = isDarkMode ? '#aae' : '#4285f4';
            statusArea.textContent = message;
            
            // 3秒后恢复原样
            setTimeout(() => {
                statusArea.style.background = isDarkMode ? 'rgba(40, 40, 45, 0.5)' : 'rgba(248, 248, 248, 0.8)';
                statusArea.style.color = isDarkMode ? '#aaa' : '#666';
            }, 3000);
        }
    }
    
    // 更新音频计数
    function updateAudioCount() {
        const countElement = document.getElementById('audio-count');
        const miniCountElement = document.getElementById('mini-audio-count');
        
        if (countElement) {
            countElement.textContent = capturedAudio.length;
            
            // 如果有新音频，添加脉冲动画效果
            if (capturedAudio.length > 0) {
                countElement.classList.add('pulse-animation');
                setTimeout(() => {
                    countElement.classList.remove('pulse-animation');
                }, 3000);
            }
        }
        
        // 更新迷你模式的计数
        if (miniCountElement) {
            miniCountElement.textContent = capturedAudio.length;
            if (capturedAudio.length > 0) {
                miniCountElement.classList.add('pulse-animation');
                setTimeout(() => {
                    miniCountElement.classList.remove('pulse-animation');
                }, 3000);
            }
        }
    }
    
    // 开始监控网络请求
    function startMonitoring() {
        if (isMonitoring) return;
        isMonitoring = true;
        
        // 拦截XHR请求
        unsafeWindow.XMLHttpRequest = function() {
            const xhr = new originalXHR();
            const originalOpen = xhr.open;
            const originalSend = xhr.send;
            
            xhr.open = function() {
                this.method = arguments[0];
                this.url = arguments[1];
                return originalOpen.apply(this, arguments);
            };
            
            xhr.send = function() {
                this.addEventListener('load', function() {
                    try {
                        // 检查是否是音频相关内容
                        const contentType = this.getResponseHeader('Content-Type') || '';
                        const isAudio = contentType.includes('audio') || 
                                       contentType.includes('octet-stream') ||
                                       this.url.match(/\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i);
                        
                        if (isAudio || contentType.includes('octet-stream')) {
                            captureAudioFromResponse(this.response, contentType, this.url);
                        }
                    } catch (e) {
                        console.error('处理XHR请求时出错:', e);
                    }
                });
                
                return originalSend.apply(this, arguments);
            };
            
            return xhr;
        };
        
        // 拦截Fetch请求
        unsafeWindow.fetch = function() {
            const url = arguments[0] instanceof Request ? arguments[0].url : arguments[0];
            const method = arguments[0] instanceof Request ? arguments[0].method : 'GET';
            
            return originalFetch.apply(this, arguments).then(response => {
                try {
                    const contentType = response.headers.get('Content-Type') || '';
                    const isAudio = contentType.includes('audio') || 
                                   contentType.includes('octet-stream') ||
                                   url.match(/\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i);
                    
                    if (isAudio || contentType.includes('octet-stream')) {
                        // 克隆响应以不影响原始处理
                        response.clone().arrayBuffer().then(buffer => {
                            captureAudioFromResponse(buffer, contentType, url);
                        });
                    }
                } catch (e) {
                    console.error('处理Fetch请求时出错:', e);
                }
                
                return response;
            });
        };
        
        // 监控DOM变化以捕获新添加的媒体元素
        observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO') {
                        node.addEventListener('play', () => {
                            if (node.src) {
                                captureAudioFromMediaElement(node);
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 监控现有的媒体元素
        document.querySelectorAll('audio, video').forEach(mediaElement => {
            mediaElement.addEventListener('play', () => {
                if (mediaElement.src) {
                    captureAudioFromMediaElement(mediaElement);
                }
            });
        });
        
        // 扫描页面中的data URLs
        scanPageForDataUrls();
    }
    
    // 停止监控
    function stopMonitoring() {
        if (!isMonitoring) return;
        isMonitoring = false;
        
        // 恢复原始的XHR和Fetch
        unsafeWindow.XMLHttpRequest = originalXHR;
        unsafeWindow.fetch = originalFetch;
        
        // 停止DOM观察
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }
    
    // 从响应捕获音频
    function captureAudioFromResponse(response, contentType, url) {
        // 检查是否已捕获
        if (capturedAudio.some(audio => audio.url === url)) {
            return;
        }
        
        const audioItem = {
            id: generateId(),
            source: 'network',
            url: url,
            contentType: contentType,
            timestamp: new Date().toISOString(),
            data: response,
            format: guessAudioFormat(contentType, url),
            size: response ? (response.byteLength || 0) : 0
        };
        
        capturedAudio.push(audioItem);
        updateAudioCount();
        saveAudioData();
        updateStatus(`捕获到新音频: ${getShortUrl(url)}`);
        
        // 重置自动合并计时器
        resetAutoMergeTimer();
    }
    
    // 从媒体元素捕获音频
    function captureAudioFromMediaElement(mediaElement) {
        if (capturedAudio.some(audio => audio.url === mediaElement.src)) {
            return;
        }
        
        const audioItem = {
            id: generateId(),
            source: 'media',
            url: mediaElement.src,
            contentType: 'audio/media',
            timestamp: new Date().toISOString(),
            mediaElement: mediaElement,
            format: 'mp3',
            size: 'unknown'
        };
        
        capturedAudio.push(audioItem);
        updateAudioCount();
        saveAudioData();
        updateStatus(`捕获到媒体元素音频: ${getShortUrl(mediaElement.src)}`);
        
        // 重置自动合并计时器
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
            const urlObj = new URL(url);
            const path = urlObj.pathname;
            if (path.length > 20) {
                return path.substr(0, 17) + '...';
            }
            return path;
        } catch (e) {
            return url.substr(0, 20) + '...';
        }
    }
    
    // 猜测音频格式
    function guessAudioFormat(contentType, url) {
        if (contentType.includes('mpeg') || contentType.includes('mp3')) {
            return 'mp3';
        } else if (contentType.includes('wav')) {
            return 'wav';
        } else if (contentType.includes('ogg')) {
            return 'ogg';
        } else if (contentType.includes('aac')) {
            return 'aac';
        } else if (contentType.includes('flac')) {
            return 'flac';
        } else if (url) {
            // 从URL猜测
            if (url.match(/\.mp3($|\?)/i)) return 'mp3';
            if (url.match(/\.wav($|\?)/i)) return 'wav';
            if (url.match(/\.ogg($|\?)/i)) return 'ogg';
            if (url.match(/\.aac($|\?)/i)) return 'aac';
            if (url.match(/\.flac($|\?)/i)) return 'flac';
        }
        return 'mp3'; // 默认值
    }
    
    // 保存音频数据到GM存储
    function saveAudioData() {
        try {
            // 只保存必要的信息，不保存二进制数据
            const serializedData = capturedAudio.map(audio => {
                const { id, source, url, contentType, timestamp, format, size } = audio;
                return { id, source, url, contentType, timestamp, format, size };
            });
            
            GM_setValue('capturedAudioMeta', JSON.stringify(serializedData));
        } catch (e) {
            console.error('保存音频元数据时出错:', e);
        }
    }
    
    // 加载音频元数据
    function loadAudioData() {
        try {
            const data = GM_getValue('capturedAudioMeta');
            if (data) {
                capturedAudio = JSON.parse(data);
                updateAudioCount();
            }
        } catch (e) {
            console.error('加载音频元数据时出错:', e);
        }
    }
    
    // 扫描页面中的data URLs
    function scanPageForDataUrls() {
        const pageContent = document.documentElement.innerHTML;
        const dataUrlRegex = /data:(application\/octet-stream|audio\/[^;]+);base64,([A-Za-z0-9+/=]{100,})/g;
        
        let match;
        while ((match = dataUrlRegex.exec(pageContent)) !== null) {
            const mimeType = match[1];
            const base64Data = match[2];
            const dataUrl = `data:${mimeType};base64,${base64Data}`;
            
            if (!capturedAudio.some(audio => audio.url === dataUrl)) {
                // 验证是否为有效音频
                validateAudioDataUrl(dataUrl, () => {
                    captureDataUrl(dataUrl, mimeType);
                });
            }
        }
    }
    
    // 验证数据URL是否为有效音频
    function validateAudioDataUrl(dataUrl, callback) {
        const audio = new Audio();
        
        audio.onloadedmetadata = function() {
            // 数据加载成功，是有效音频
            if (audio.duration > 0) {
                callback();
            }
        };
        
        audio.onerror = function() {
            // 尝试作为二进制数据处理
            try {
                fetch(dataUrl)
                    .then(response => response.arrayBuffer())
                    .then(buffer => {
                        // 检查二进制标记
                        const isAudioData = checkAudioSignature(buffer);
                        if (isAudioData) {
                            callback();
                        }
                    });
            } catch (e) {
                // 忽略错误
            }
        };
        
        audio.src = dataUrl;
    }
    
    // 从data URL捕获音频
    function captureDataUrl(dataUrl, mimeType) {
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
        updateAudioCount();
        saveAudioData();
        updateStatus('捕获到data URL音频');
        
        // 重置自动合并计时器
        resetAutoMergeTimer();
    }
    
    // 检查二进制数据是否为音频
    function checkAudioSignature(buffer) {
        if (!buffer || buffer.byteLength < 8) return false;
        
        const view = new Uint8Array(buffer);
        const signatures = {
            // MP3 (ID3)
            'ID3': [0x49, 0x44, 0x33],
            // MP3 (no ID3)
            'MP3': [0xFF, 0xFB],
            // WAV
            'RIFF': [0x52, 0x49, 0x46, 0x46],
            // OGG
            'OGG': [0x4F, 0x67, 0x67, 0x53],
            // FLAC
            'FLAC': [0x66, 0x4C, 0x61, 0x43],
            // M4A/AAC
            'M4A': [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70],
            // FLV
            'FLV': [0x46, 0x4C, 0x56, 0x01]
        };
        
        for (const [format, sig] of Object.entries(signatures)) {
            let match = true;
            for (let i = 0; i < sig.length; i++) {
                if (view[i] !== sig[i]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
        
        // 检查字符串标记
        try {
            const textDecoder = new TextDecoder('utf-8');
            const text = textDecoder.decode(new Uint8Array(buffer.slice(0, 100)));
            return text.includes('Lavf') || text.includes('matroska') || text.includes('webm');
        } catch (e) {
            return false;
        }
    }
    
    // 从data URL直接下载
    function downloadFromDataUrl() {
        const audioDataUrl = prompt(
            "请粘贴data:application/octet-stream;base64,开头的URL:",
            ""
        );
        
        if (!audioDataUrl || !audioDataUrl.startsWith('data:')) {
            alert('请提供有效的data URL');
            return;
        }
        
        try {
            // 获取用户设置的文件名前缀
            const fileNamePrefix = document.getElementById('file-name-prefix').value || 'doubao_audio';
            const fileName = `${fileNamePrefix}_${Date.now()}.mp3`;
            
            // 创建下载链接
            const a = document.createElement('a');
            a.href = audioDataUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            updateStatus(`音频下载已启动: ${fileName}`);
            
            // 加入捕获列表
            const mimeType = audioDataUrl.split(';')[0].split(':')[1];
            captureDataUrl(audioDataUrl, mimeType);
        } catch (error) {
            console.error('下载失败:', error);
            alert('下载失败: ' + error.message);
        }
    }
    
    // 处理base64编码的音频数据
    function handleBase64FromRequest() {
        const modal = createModal('处理Base64数据');
        
        const content = document.createElement('div');
        content.innerHTML = `
            <textarea id="base64-input" placeholder="在此粘贴base64编码的音频数据" 
                      style="width: 100%; height: 150px; padding: 8px; margin-bottom: 10px; font-family: monospace; border: 1px solid #ddd; border-radius: 4px;"></textarea>
            <div style="margin-bottom: 10px;">
                <label for="format-select" style="display: block; margin-bottom: 5px;">保存格式:</label>
                <select id="format-select" style="padding: 8px; width: 100%; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                    <option value="flac">FLAC</option>
                </select>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
                <button id="cancel-base64" style="padding: 8px 15px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px;">取消</button>
                <button id="process-base64-btn" style="padding: 8px 15px; background: #4285f4; color: white; border: none; border-radius: 4px;">处理并下载</button>
            </div>
        `;
        
        modal.appendChild(content);
        
        document.getElementById('cancel-base64').addEventListener('click', () => {
            closeModal(modal);
        });
        
        document.getElementById('process-base64-btn').addEventListener('click', () => {
            const base64Data = document.getElementById('base64-input').value.trim();
            if (!base64Data) {
                alert('请输入base64数据');
                return;
            }
            
            // 移除可能的前缀
            let cleanBase64 = base64Data;
            if (cleanBase64.includes('base64,')) {
                cleanBase64 = cleanBase64.split('base64,')[1];
            }
            
            try {
                // 检查是否为有效base64
                atob(cleanBase64.substring(0, 10));
                
                const format = document.getElementById('format-select').value;
                const mimeTypes = {
                    'mp3': 'audio/mpeg',
                    'wav': 'audio/wav',
                    'ogg': 'audio/ogg',
                    'flac': 'audio/flac'
                };
                
                // 获取用户设置的文件名前缀
                const fileNamePrefix = document.getElementById('file-name-prefix').value || 'doubao_audio';
                const fileName = `${fileNamePrefix}_${Date.now()}.${format}`;
                
                // 创建完整的data URL
                const dataUrl = `data:${mimeTypes[format] || 'application/octet-stream'};base64,${cleanBase64}`;
                
                // 下载文件
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // 加入捕获列表
                captureDataUrl(dataUrl, mimeTypes[format]);
                
                closeModal(modal);
                updateStatus(`音频处理并下载成功: ${fileName}`);
            } catch (e) {
                alert('无效的base64数据: ' + e.message);
            }
        });
    }
    
    // 显示已捕获的音频列表
    function showCapturedAudioList() {
        if (capturedAudio.length === 0) {
            alert('尚未捕获任何音频');
            return;
        }
        
        const modal = createModal('已捕获的音频列表');
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="margin-bottom: 10px;">
                <input type="text" id="search-audio" placeholder="搜索音频..." 
                    style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <button id="close-audio-list" style="padding: 8px 15px; background: #f0f0f0; border: 1px solid #ccc; float: right; border-radius: 4px;">
                    关闭
                </button>
            </div>
            <div id="audio-list-container" style="max-height: 400px; overflow-y: auto; margin-top: 40px;"></div>
        `;
        
        modal.appendChild(content);
        
        // 添加关闭按钮事件
        document.getElementById('close-audio-list').addEventListener('click', () => {
            closeModal(modal);
        });
        
        // 显示音频列表
        renderAudioList();
        
        // 搜索功能
        document.getElementById('search-audio').addEventListener('input', function() {
            renderAudioList(this.value);
        });
        
        // 渲染音频列表
        function renderAudioList(searchTerm = '') {
            const container = document.getElementById('audio-list-container');
            container.innerHTML = '';
            
            const filteredAudio = searchTerm ? 
                capturedAudio.filter(audio => 
                    audio.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    audio.format.toLowerCase().includes(searchTerm.toLowerCase())
                ) : 
                capturedAudio;
            
            if (filteredAudio.length === 0) {
                container.innerHTML = '<p>没有匹配的音频</p>';
                return;
            }
            
            filteredAudio.forEach((audio, index) => {
                const item = document.createElement('div');
                item.style.cssText = `
                    border-bottom: 1px solid #eee;
                    padding: 10px;
                    margin-bottom: 5px;
                    border-radius: 4px;
                    transition: background 0.2s;
                `;
                item.addEventListener('mouseover', () => {
                    item.style.background = '#f9f9f9';
                });
                item.addEventListener('mouseout', () => {
                    item.style.background = 'transparent';
                });
                
                const date = new Date(audio.timestamp).toLocaleString();
                const size = typeof audio.size === 'number' ? 
                    (audio.size / 1024).toFixed(2) + ' KB' : 
                    audio.size;
                
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <div>
                            <strong>#${index + 1}</strong> - ${audio.format.toUpperCase()}
                        </div>
                        <div style="font-size: 12px; color: #666;">
                            ${date}
                        </div>
                    </div>
                    <div title="${audio.url}" style="font-size: 12px; word-break: break-all; margin: 5px 0;">
                        ${getShortUrl(audio.url)}
                    </div>
                    <div style="font-size: 12px; color: #666;">
                        来源: ${audio.source} | 大小: ${size}
                    </div>
                    <div style="display: flex; gap: 5px; margin-top: 8px;">
                        <input type="checkbox" class="audio-select" data-id="${audio.id}" style="margin-right: 5px;">
                        <button class="download-btn" data-id="${audio.id}" style="padding: 5px 10px; background: #4285f4; color: white; border: none; border-radius: 3px; cursor: pointer;">下载</button>
                        <button class="play-btn" data-id="${audio.id}" style="padding: 5px 10px; background: #0f9d58; color: white; border: none; border-radius: 3px; cursor: pointer;">播放</button>
                        <button class="remove-btn" data-id="${audio.id}" style="padding: 5px 10px; background: #db4437; color: white; border: none; border-radius: 3px; cursor: pointer;">删除</button>
                    </div>
                `;
                
                container.appendChild(item);
            });
            
            // 绑定按钮事件
            document.querySelectorAll('.download-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    downloadAudio(id);
                });
            });
            
            document.querySelectorAll('.play-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    playAudio(id);
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    removeAudio(id);
                    renderAudioList(searchTerm);
                });
            });
        }
        
        // 下载音频
        function downloadAudio(id) {
            const audio = capturedAudio.find(a => a.id === id);
            if (!audio) return;
            
            // 获取用户设置的文件名前缀
            const fileNamePrefix = document.getElementById('file-name-prefix').value || 'doubao_audio';
            const fileName = `${fileNamePrefix}_${Date.now()}.${audio.format}`;
            
            if (audio.source === 'dataUrl') {
                // 直接下载data URL
                const a = document.createElement('a');
                a.href = audio.url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                // 下载后从列表中移除
                removeAudio(id);
                updateStatus(`已下载并移除: ${fileName}`);
            } else if (audio.url) {
                // 下载URL
                GM_download({
                    url: audio.url,
                    name: fileName,
                    onload: () => {
                        updateStatus(`下载完成: ${fileName}`);
                        // 下载后从列表中移除
                        removeAudio(id);
                    },
                    onerror: (e) => {
                        console.error('下载失败:', e);
                        updateStatus('下载失败');
                    }
                });
            }
        }
        
        // 播放音频
        function playAudio(id) {
            const audio = capturedAudio.find(a => a.id === id);
            if (!audio) return;
            
            if (audio.source === 'dataUrl') {
                const audioElement = new Audio(audio.url);
                audioElement.play();
            } else if (audio.mediaElement) {
                audio.mediaElement.play();
            } else if (audio.url) {
                const audioElement = new Audio(audio.url);
                audioElement.play();
            }
        }
        
        // 删除音频
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
    
    // 显示合并选项
    function showMergeOptions(autoSelectAll = false) {
        if (capturedAudio.length === 0) {
            alert('尚未捕获任何音频');
            return;
        }
        
        const modal = createModal('合并下载音频');
        
        const content = document.createElement('div');
        content.innerHTML = `
            <p style="color: ${isDarkMode ? '#ccc' : '#333'};">当前有 ${capturedAudio.length} 个已捕获的音频，您可以选择要合并的音频范围：</p>
            <div style="margin: 15px 0;">
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
                    <label for="merge-range" style="min-width: 60px; color: ${isDarkMode ? '#ccc' : '#333'};">合并范围:</label>
                    <input type="text" id="merge-range" placeholder="例如: 1-5,7,9-12" style="flex: 1; padding: 8px; border: 1px solid ${isDarkMode ? '#444' : '#ddd'}; border-radius: 8px; background: ${isDarkMode ? 'rgba(40, 40, 45, 0.7)' : 'white'}; color: ${isDarkMode ? '#eee' : '#333'};">
                    <button id="select-all-btn" style="padding: 8px 12px; background: ${isDarkMode ? '#2D5A9F' : '#4285f4'}; color: white; border: none; border-radius: 8px;">全选</button>
                </div>
                <div style="margin-bottom: 10px;">
                    <label for="merge-format" style="color: ${isDarkMode ? '#ccc' : '#333'};">输出格式:</label>
                    <select id="merge-format" style="padding: 8px; margin-left: 10px; border: 1px solid ${isDarkMode ? '#444' : '#ddd'}; border-radius: 8px; background: ${isDarkMode ? 'rgba(40, 40, 45, 0.7)' : 'white'}; color: ${isDarkMode ? '#eee' : '#333'};">
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                    </select>
                </div>
                <div style="font-size: 12px; color: ${isDarkMode ? '#888' : '#666'}; margin-top: 5px;">
                    * 范围格式: 单个数字(如5)、范围(如1-5)或组合(如1-3,5,7-9)
                </div>
            </div>
            
            <div style="max-height: 300px; overflow-y: auto; margin: 15px 0; border: 1px solid ${isDarkMode ? '#444' : '#eee'}; padding: 10px; border-radius: 8px; background: ${isDarkMode ? 'rgba(35, 35, 40, 0.5)' : 'rgba(250, 250, 250, 0.9)'};">
                <h4 style="margin-top: 0; color: ${isDarkMode ? '#ccc' : '#333'};">可选择的音频列表:</h4>
                <div id="merge-audio-list"></div>
            </div>
            
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancel-merge" style="padding: 10px 15px; background: ${isDarkMode ? 'rgba(60, 60, 70, 0.7)' : '#f0f0f0'}; color: ${isDarkMode ? '#ccc' : '#333'}; border: ${isDarkMode ? '1px solid #444' : '1px solid #ccc'}; border-radius: 8px;">取消</button>
                <button id="start-merge" style="padding: 10px 15px; background: ${isDarkMode ? '#096D3B' : '#0f9d58'}; color: white; border: none; border-radius: 8px; font-weight: bold;">开始合并</button>
            </div>
        `;
        
        modal.appendChild(content);
        
        // 显示音频列表
        const audioListContainer = document.getElementById('merge-audio-list');
        capturedAudio.forEach((audio, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                margin-bottom: 6px;
                border-bottom: 1px solid ${isDarkMode ? '#333' : '#f0f0f0'};
                border-radius: 6px;
                transition: background 0.2s;
            `;
            
            item.addEventListener('mouseover', () => {
                item.style.background = isDarkMode ? 'rgba(55, 55, 60, 0.5)' : '#f9f9f9';
            });
            
            item.addEventListener('mouseout', () => {
                item.style.background = 'transparent';
            });
            
            item.innerHTML = `
                <input type="checkbox" class="merge-select" data-index="${index}" id="merge-item-${index}" style="margin-right: 12px; width: 18px; height: 18px; accent-color: ${isDarkMode ? '#2D5A9F' : '#4285f4'};">
                <label for="merge-item-${index}" style="flex: 1; cursor: pointer; color: ${isDarkMode ? '#ccc' : '#333'};">
                    <strong>#${index + 1}</strong> - ${audio.format.toUpperCase()} 
                    <span style="font-size: 12px; color: ${isDarkMode ? '#888' : '#666'};">(${getShortUrl(audio.url)})</span>
                </label>
            `;
            
            audioListContainer.appendChild(item);
        });
        
        // 取消按钮
        document.getElementById('cancel-merge').addEventListener('click', () => {
            closeModal(modal);
        });
        
        // 全选按钮
        document.getElementById('select-all-btn').addEventListener('click', () => {
            document.getElementById('merge-range').value = `1-${capturedAudio.length}`;
            document.querySelectorAll('.merge-select').forEach(checkbox => {
                checkbox.checked = true;
            });
        });
        
        // 如果设置了自动全选
        if (autoSelectAll) {
            setTimeout(() => {
                document.getElementById('select-all-btn').click();
            }, 100);
        }
        
        // 范围输入框事件
        document.getElementById('merge-range').addEventListener('input', function() {
            const range = this.value.trim();
            if (!range) {
                document.querySelectorAll('.merge-select').forEach(checkbox => {
                    checkbox.checked = false;
                });
                return;
            }
            
            // 解析范围
            const indices = parseRangeString(range, capturedAudio.length);
            
            // 更新复选框
            document.querySelectorAll('.merge-select').forEach(checkbox => {
                const index = parseInt(checkbox.getAttribute('data-index'));
                checkbox.checked = indices.includes(index);
            });
        });
        
        // 复选框变化时更新范围
        document.querySelectorAll('.merge-select').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // 获取所有选中的索引
                const selectedIndices = [];
                document.querySelectorAll('.merge-select:checked').forEach(cb => {
                    selectedIndices.push(parseInt(cb.getAttribute('data-index')));
                });
                
                // 生成范围字符串
                document.getElementById('merge-range').value = generateRangeString(selectedIndices);
            });
        });
        
        // 开始合并按钮
        document.getElementById('start-merge').addEventListener('click', () => {
            const range = document.getElementById('merge-range').value.trim();
            if (!range) {
                alert('请选择要合并的音频范围');
                return;
            }
            
            const indices = parseRangeString(range, capturedAudio.length);
            if (indices.length === 0) {
                alert('未选择任何有效的音频');
                return;
            }
            
            const format = document.getElementById('merge-format').value;
            
            // 开始合并
            mergeAudio(indices, format);
            closeModal(modal);
            
            // 清除自动合并计时器，因为用户已手动触发合并
            if (autoMergeTimer) {
                clearTimeout(autoMergeTimer);
                autoMergeTimer = null;
            }
        });
    }
    
    // 解析范围字符串，例如 "1-3,5,7-9"
    function parseRangeString(rangeStr, maxValue) {
        const result = [];
        const parts = rangeStr.split(',');
        
        for (const part of parts) {
            const trimmed = part.trim();
            if (!trimmed) continue;
            
            if (trimmed.includes('-')) {
                // 范围
                const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
                // 转换为0-based索引
                const startIndex = Math.max(0, start - 1);
                const endIndex = Math.min(maxValue - 1, end - 1);
                
                if (!isNaN(startIndex) && !isNaN(endIndex) && startIndex <= endIndex) {
                    for (let i = startIndex; i <= endIndex; i++) {
                        if (!result.includes(i)) result.push(i);
                    }
                }
            } else {
                // 单个数字
                const index = parseInt(trimmed) - 1; // 转换为0-based索引
                if (!isNaN(index) && index >= 0 && index < maxValue && !result.includes(index)) {
                    result.push(index);
                }
            }
        }
        
        return result.sort((a, b) => a - b);
    }
    
    // 生成范围字符串
    function generateRangeString(indices) {
        if (indices.length === 0) return '';
        
        // 排序
        indices.sort((a, b) => a - b);
        
        const ranges = [];
        let start = indices[0];
        let end = start;
        
        for (let i = 1; i < indices.length; i++) {
            if (indices[i] === end + 1) {
                end = indices[i];
            } else {
                // 结束当前范围
                if (start === end) {
                    ranges.push((start + 1).toString()); // 转换为1-based显示
                } else {
                    ranges.push(`${start + 1}-${end + 1}`); // 转换为1-based显示
                }
                
                // 开始新范围
                start = end = indices[i];
            }
        }
        
        // 添加最后一个范围
        if (start === end) {
            ranges.push((start + 1).toString()); // 转换为1-based显示
        } else {
            ranges.push(`${start + 1}-${end + 1}`); // 转换为1-based显示
        }
        
        return ranges.join(',');
    }
    
    // 合并音频
    function mergeAudio(indices, format) {
        // 检查索引
        if (indices.length === 0) {
            alert('未选择任何音频');
            return;
        }
        
        // 创建进度模态框
        const modal = createModal('音频合并进度');
        
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="text-align: center; margin: 20px 0;">
                <div id="merge-progress-text">准备合并 ${indices.length} 个音频文件...</div>
                <div style="margin: 15px 0; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                    <div id="merge-progress-bar" style="width: 0%; height: 20px; background: #0f9d58; transition: width 0.3s;"></div>
                </div>
                <div id="merge-status">正在初始化...</div>
            </div>
        `;
        
        modal.appendChild(content);
        
        // 开始合并流程
        setTimeout(() => {
            startMergeProcess(indices, format, modal);
        }, 500);
    }
    
    // 开始合并流程
    async function startMergeProcess(indices, format, modal) {
        try {
            updateMergeProgress(5, '开始下载音频数据...');
            
            // 准备音频数据
            const audioBuffers = [];
            let currentIndex = 0;
            
            for (const index of indices) {
                currentIndex++;
                const progress = 5 + Math.floor((currentIndex / indices.length) * 50);
                updateMergeProgress(progress, `正在处理第 ${currentIndex}/${indices.length} 个音频...`);
                
                const audio = capturedAudio[index];
                if (!audio) continue;
                
                try {
                    const buffer = await getAudioBuffer(audio);
                    if (buffer) {
                        // 如果是MP3格式且需要合并为MP3，直接添加
                        if (format === 'mp3' && (audio.format === 'mp3' || isValidMp3(buffer))) {
                            audioBuffers.push(buffer);
                        } else {
                            // 如果需要转换格式，仍需添加
                            audioBuffers.push(buffer);
                        }
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
            
            // 合并音频
            const mergedAudio = await mergeAudioBuffers(audioBuffers, format);
            updateMergeProgress(90, '合并完成，准备下载...');
            
            // 获取用户设置的文件名前缀
            const fileNamePrefix = document.getElementById('file-name-prefix').value || 'doubao_merged';
            const fileName = `${fileNamePrefix}_${Date.now()}.${format}`;
            
            // 下载合并后的文件
            const blob = new Blob([mergedAudio], { type: format === 'mp3' ? 'audio/mpeg' : 'audio/wav' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            updateMergeProgress(100, `合并完成，已开始下载 ${fileName}！`);
            updateStatus(`已成功合并 ${audioBuffers.length} 个音频文件并下载`);
            
            // 3秒后关闭窗口
            setTimeout(() => {
                closeModal(modal);
                
                // 询问用户是否要清空列表
                if (confirm('下载完成，是否清空音频列表？')) {
                    capturedAudio = [];
                    updateAudioCount();
                    saveAudioData();
                    updateStatus('已清空音频列表');
                }
            }, 3000);
        } catch (error) {
            console.error('合并音频过程中出错:', error);
            updateMergeStatus(`合并失败: ${error.message}`);
        }
    }
    
    // 获取音频的ArrayBuffer数据
    // 处理base64编码的音频数据
    async function getAudioBuffer(audio) {
        return new Promise(async (resolve, reject) => {
            try {
                if (audio.data instanceof ArrayBuffer) {
                    // 已经有ArrayBuffer数据
                    resolve(audio.data);
                } else if (audio.source === 'dataUrl') {
                    // 如果是data URL，先检查是否为base64编码的MP3
                    if (audio.url.startsWith('data:application/octet-stream;base64,') || 
                        audio.url.startsWith('data:audio/mpeg;base64,')) {
                        // 直接从data URL获取二进制数据
                        const base64Data = audio.url.split('base64,')[1];
                        const binaryString = atob(base64Data);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        resolve(bytes.buffer);
                    } else {
                        // 其他类型的data URL
                        fetch(audio.url)
                            .then(response => response.arrayBuffer())
                            .then(buffer => resolve(buffer))
                            .catch(reject);
                    }
                } else if (audio.url) {
                    // 从URL获取
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: audio.url,
                        responseType: 'arraybuffer',
                        onload: function(response) {
                            resolve(response.response);
                        },
                        onerror: function(error) {
                            reject(new Error('无法下载音频: ' + error));
                        }
                    });
                } else {
                    reject(new Error('无法获取音频数据'));
                }
            } catch (e) {
                reject(e);
            }
        });
    }
    
    // 合并音频缓冲区
    // 直接合并MP3文件
    async function mergeAudioBuffers(audioBuffers, format) {
        return new Promise(async (resolve, reject) => {
            try {
                // 如果选择的格式不是MP3，仍使用旧方法
                if (format !== 'mp3') {
                    updateMergeStatus('非MP3格式仍需要完整处理，可能需要较长时间...');
                    // 使用之前的方法处理
                    // ...原来的mergeAudioBuffers代码...
                    return;
                }
                
                updateMergeStatus('正在直接合并MP3文件...');
                
                // 检查每个文件的MP3头，确保是有效的MP3
                const validMp3Buffers = [];
                for (let i = 0; i < audioBuffers.length; i++) {
                    const buffer = audioBuffers[i];
                    // 简单检查是否为MP3文件
                    if (isValidMp3(buffer)) {
                        validMp3Buffers.push(buffer);
                    } else {
                        console.warn(`跳过第${i+1}个非MP3格式文件`);
                    }
                    
                    updateMergeProgress(60 + Math.floor((i / audioBuffers.length) * 30), 
                        `正在处理第 ${i + 1}/${audioBuffers.length} 个文件...`);
                }
                
                if (validMp3Buffers.length === 0) {
                    reject(new Error('没有有效的MP3文件可以合并'));
                    return;
                }
                
                updateMergeStatus(`正在合并 ${validMp3Buffers.length} 个MP3文件...`);
                
                // 直接拼接MP3文件内容
                const totalLength = validMp3Buffers.reduce((total, buffer) => total + buffer.byteLength, 0);
                const mergedMp3 = new Uint8Array(totalLength);
                
                let offset = 0;
                for (const buffer of validMp3Buffers) {
                    const data = new Uint8Array(buffer);
                    mergedMp3.set(data, offset);
                    offset += buffer.byteLength;
                    
                    updateMergeProgress(90, `已合并 ${offset} / ${totalLength} 字节...`);
                }
                
                updateMergeProgress(95, '合并完成，准备下载...');
                resolve(mergedMp3.buffer);
                
            } catch (e) {
                reject(e);
            }
        });
    }

    // 简单检查是否为有效的MP3文件
    function isValidMp3(buffer) {
        if (!buffer || buffer.byteLength < 3) return false;
        
        const view = new Uint8Array(buffer);
        
        // 检查ID3v2标记
        if (view[0] === 0x49 && view[1] === 0x44 && view[2] === 0x33) {
            return true;
        }
        
        // 检查MP3帧头标记 (通常以0xFF开头)
        for (let i = 0; i < Math.min(100, view.length); i++) {
            if (view[i] === 0xFF && (view[i+1] & 0xE0) === 0xE0) {
                return true;
            }
        }
        
        return false;
    }
    
    // 编码为MP3
    // 优化的MP3编码
    function encodeOptimizedMp3(audioBuffer, sampleRate, callback) {
        const channels = audioBuffer.numberOfChannels;
        const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
        
        // 获取音频样本，一次性处理以减少循环次数
        const samples = getInterleavedSamples(audioBuffer);
        const mp3Data = [];
        
        // 使用更大的块大小，减少处理次数
        const chunkSize = 1152 * 10; // 增加批量处理量
        
        // 创建工作器函数用于批处理
        const processChunks = (startIndex) => {
            let endTime = Date.now() + 50; // 每50ms让出主线程
            let currentIndex = startIndex;
            
            while (currentIndex < samples.length && Date.now() < endTime) {
                const end = Math.min(currentIndex + chunkSize, samples.length);
                const chunk = samples.subarray(currentIndex, end);
                const mp3buf = mp3encoder.encodeBuffer(chunk);
                
                if (mp3buf.length > 0) {
                    mp3Data.push(mp3buf);
                }
                
                currentIndex = end;
                
                // 仅在处理一定量数据后更新进度，减少DOM操作
                if (currentIndex % (chunkSize * 10) === 0) {
                    const progress = 80 + Math.floor((currentIndex / samples.length) * 10);
                    updateMergeProgress(progress, `正在编码MP3: ${Math.floor(currentIndex / samples.length * 100)}%...`);
                }
            }
            
            // 所有数据处理完毕或时间片用完
            if (currentIndex < samples.length) {
                // 还有数据要处理，安排下一个时间片
                setTimeout(() => processChunks(currentIndex), 0);
            } else {
                // 所有数据处理完毕，结束编码
                finishEncoding();
            }
        };
        
        // 完成编码
        const finishEncoding = () => {
            const end = mp3encoder.flush();
            if (end.length > 0) {
                mp3Data.push(end);
            }
            
            // 合并所有数据
            const totalLength = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
            const mp3Array = new Uint8Array(totalLength);
            let offset = 0;
            
            for (const buf of mp3Data) {
                mp3Array.set(buf, offset);
                offset += buf.length;
            }
            
            callback(mp3Array.buffer);
        };
        
        // 开始处理
        processChunks(0);
    }

    // 优化的交错样本获取(用于MP3编码)
    function getInterleavedSamples(audioBuffer) {
        const channels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * channels;
        const result = new Int16Array(length);
        
        // 预先获取所有通道数据，避免反复调用getChannelData
        const channelsData = [];
        for (let channel = 0; channel < channels; channel++) {
            channelsData.push(audioBuffer.getChannelData(channel));
        }
        
        // 块处理，减少循环次数
        const blockSize = 8192;
        for (let blockStart = 0; blockStart < audioBuffer.length; blockStart += blockSize) {
            const blockEnd = Math.min(blockStart + blockSize, audioBuffer.length);
            
            for (let i = blockStart; i < blockEnd; i++) {
                for (let channel = 0; channel < channels; channel++) {
                    const sample = Math.max(-1, Math.min(1, channelsData[channel][i]));
                    result[i * channels + channel] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                }
            }
        }
        
        return result;
    }

    // 编码为WAV
    // 优化的WAV编码
    function encodeOptimizedWAV(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM格式
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const bytesPerSecond = sampleRate * blockAlign;
        
        // 一次性获取所有样本数据
        const samplesData = getWavSamples(audioBuffer);
        
        const buffer = new ArrayBuffer(44 + samplesData.length);
        const view = new DataView(buffer);
        
        // WAV头
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samplesData.length, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, bytesPerSecond, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samplesData.length, true);
        
        // 写入样本数据
        const uint8 = new Uint8Array(buffer);
        uint8.set(samplesData, 44);
        
        return buffer;
    }

    // 优化的WAV样本获取
    function getWavSamples(audioBuffer) {
        const numChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length;
        const samples = new Uint8Array(length * numChannels * 2);
        let offset = 0;
        
        // 预先获取所有通道数据
        const channelsData = [];
        for (let channel = 0; channel < numChannels; channel++) {
            channelsData.push(audioBuffer.getChannelData(channel));
        }
        
        // 批量处理样本
        const processBlock = 10000;
        
        for (let blockStart = 0; blockStart < length; blockStart += processBlock) {
            const blockEnd = Math.min(blockStart + processBlock, length);
            
            for (let i = blockStart; i < blockEnd; i++) {
                for (let channel = 0; channel < numChannels; channel++) {
                    const sample = Math.max(-1, Math.min(1, channelsData[channel][i]));
                    const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                    samples[offset++] = value & 0xFF;
                    samples[offset++] = (value >> 8) & 0xFF;
                }
            }
            
            // 只在每个块完成后更新进度
            const progress = 80 + Math.floor((blockEnd / length) * 10);
            updateMergeProgress(progress, `正在编码WAV: ${Math.floor(blockEnd / length * 100)}%...`);
        }
        
        return samples;
    }
    
    // 辅助函数：写入字符串到DataView
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    
    // 更新合并进度
    function updateMergeProgress(percent, message) {
        const progressBar = document.getElementById('merge-progress-bar');
        const progressText = document.getElementById('merge-progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${percent}%`;
            progressText.textContent = message || `进度: ${percent}%`;
        }
    }
    
    // 更新合并状态
    function updateMergeStatus(message) {
        const statusElement = document.getElementById('merge-status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
    
    // 辅助函数：创建模态框
    function createModal(title) {
        // 检查是否已存在模态框
        const existingModal = document.querySelector('.audio-capture-modal-backdrop');
        if (existingModal && document.body.contains(existingModal)) {
            document.body.removeChild(existingModal);
        }
        
        // 检测暗黑模式
        const currentDarkMode = detectDarkMode();
        
        // 创建背景
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'audio-capture-modal-backdrop';
        modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${currentDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'};
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: opacity 0.3s;
        `;
        
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'audio-capture-modal';
        modal.style.cssText = `
            background: ${currentDarkMode ? 'rgba(35, 35, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, ${currentDarkMode ? '0.4' : '0.2'});
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            z-index: 10001;
            padding: 25px;
            animation: modalFadeIn 0.3s ease-out;
            border: ${currentDarkMode ? '1px solid #444' : 'none'};
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: ${currentDarkMode ? '#eee' : '#333'};
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(-10px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .audio-capture-modal::-webkit-scrollbar {
                width: 8px;
            }
            .audio-capture-modal::-webkit-scrollbar-track {
                background: ${currentDarkMode ? '#333' : '#f1f1f1'};
                border-radius: 4px;
            }
            .audio-capture-modal::-webkit-scrollbar-thumb {
                background: ${currentDarkMode ? '#666' : '#c1c1c1'};
                border-radius: 4px;
            }
            .audio-capture-modal::-webkit-scrollbar-thumb:hover {
                background: ${currentDarkMode ? '#888' : '#a1a1a1'};
            }
        `;
        document.head.appendChild(style);
        
        // 标题
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid ${currentDarkMode ? '#444' : '#eee'};
            color: ${currentDarkMode ? '#7AB4FF' : '#4285f4'};
            font-size: 18px;
            font-weight: 600;
        `;
        
        // 添加到DOM
        modal.appendChild(titleElement);
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);
        
        return modal;
    }
    
    // 关闭模态框
    // 修改 closeModal 函数
    function closeModal(modal) {
        try {
            const backdrop = modal.parentElement;
            if (backdrop && document.body.contains(backdrop)) {
                document.body.removeChild(backdrop);
            }
        } catch (e) {
            console.error('关闭模态框时出错:', e);
            // 备用方案：查找并移除所有模态框背景
            document.querySelectorAll('.audio-capture-modal-backdrop').forEach(element => {
                if (document.body.contains(element)) {
                    document.body.removeChild(element);
                }
            });
        }
    }
    
    // 注册GM菜单
    GM_registerMenuCommand('打开豆包音频捕获工具', createMainInterface);
    GM_registerMenuCommand('开始/停止监控', function() {
        if (isMonitoring) {
            stopMonitoring();
            updateStatus('已停止监控网络请求');
        } else {
            startMonitoring();
            updateStatus('正在监控网络请求...');
        }
    });
    GM_registerMenuCommand('查看已捕获的音频', showCapturedAudioList);
    GM_registerMenuCommand('合并下载音频', showMergeOptions);
    
    // 加载保存的音频元数据
    loadAudioData();
    
    // 自动创建UI
    window.addEventListener('load', function() {
        setTimeout(createMainInterface, 1000);
    });
    
    // 触发页面上的音频播放按钮
    function triggerPageAudioPlay() {
        try {
            // 寻找页面上的播放按钮
            const playButton = document.querySelector('button[data-testid="audio_play_button"]');
            
            if (playButton) {
                // 模拟点击
                playButton.click();
                updateStatus('已触发页面音频播放');
                
                // 添加视觉反馈
                const globalPlayBtn = document.getElementById('global-play-button');
                if (globalPlayBtn) {
                    globalPlayBtn.classList.add('pulse-animation');
                    setTimeout(() => {
                        globalPlayBtn.classList.remove('pulse-animation');
                    }, 2000);
                }
            } else {
                updateStatus('未找到页面上的音频播放按钮');
            }
        } catch (e) {
            console.error('触发音频播放失败:', e);
            updateStatus('触发音频播放失败');
        }
    }
    
    // 使面板可拖动
    function makePanelDraggable(panel) {
        const dragHandle = document.getElementById('panel-drag-handle');
        let isDragging = false;
        let offsetX, offsetY;
        
        // 添加恢复位置功能
        restorePosition(panel);
        
        dragHandle.addEventListener('mousedown', startDrag);
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });
        
        function startDrag(e) {
            // 阻止事件默认行为，避免文本选择等
            e.preventDefault();
            
            // 获取鼠标或触摸事件坐标
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (clientX === undefined || clientY === undefined) return;
            
            // 计算偏移量
            const rect = panel.getBoundingClientRect();
            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;
            
            isDragging = true;
            
            // 记录当前高度并设置为固定值，防止拖动时变形
            if (!panel.classList.contains('minimized')) {
                panel.dataset.originalHeight = panel.offsetHeight + 'px';
                panel.style.height = panel.offsetHeight + 'px';
            }
            
            // 添加拖动和结束拖动事件监听
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('touchmove', doDrag, { passive: false });
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchend', stopDrag);
            
            // 添加拖动样式
            panel.style.transition = 'none';
            dragHandle.style.cursor = 'grabbing';
        }
        
        function doDrag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            
            // 获取鼠标或触摸事件坐标
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            if (clientX === undefined || clientY === undefined) return;
            
            // 计算新位置
            const newLeft = clientX - offsetX;
            const newTop = clientY - offsetY;
            
            // 边界处理，防止面板拖出视口
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;
            
            panel.style.left = `${Math.max(0, Math.min(newLeft, maxX))}px`;
            panel.style.top = `${Math.max(0, Math.min(newTop, maxY))}px`;
            
            // 清除底部定位，确保面板完全跟随鼠标移动
            panel.style.bottom = 'auto';
            
            // 如果到达顶部区域，添加贴附效果
            if (newTop < 20) {
                panel.style.top = '0px';
            }
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            
            // 移除事件监听
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('touchmove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchend', stopDrag);
            
            // 恢复样式
            panel.style.transition = 'box-shadow 0.3s ease';
            dragHandle.style.cursor = 'move';
            
            // 如果不是最小化状态，恢复自动高度
            if (!panel.classList.contains('minimized') && panel.dataset.originalHeight) {
                panel.style.height = 'auto';
            }
            
            // 保存面板位置
            savePosition(panel.style.left, panel.style.top);
        }
    }
    
    // 保存面板位置
    function savePosition(left, top) {
        try {
            GM_setValue('panelPosition', JSON.stringify({ left, top }));
        } catch(e) {
            console.error('保存面板位置失败:', e);
        }
    }
    
    // 恢复面板位置
    function restorePosition(panel) {
        try {
            const position = GM_getValue('panelPosition');
            if (position) {
                const { left, top } = JSON.parse(position);
                if (left && top) {
                    panel.style.left = left;
                    panel.style.top = top;
                }
            }
        } catch(e) {
            console.error('恢复面板位置失败:', e);
        }
    }
    
    // 切换监控状态
    function toggleMonitoring() {
        if (isMonitoring) {
            stopMonitoring();
            if (document.getElementById('monitor-toggle')) {
                document.getElementById('monitor-toggle').textContent = '开始监控';
                document.getElementById('monitor-toggle').style.background = isDarkMode ? '#2D5A9F' : '#4285f4';
            }
            updateStatus('已停止监控网络请求');
            
            // 更新迷你模式按钮状态
            const miniMonitorBtn = document.getElementById('mini-monitor');
            if (miniMonitorBtn) {
                miniMonitorBtn.classList.remove('active');
            }
        } else {
            startMonitoring();
            if (document.getElementById('monitor-toggle')) {
                document.getElementById('monitor-toggle').textContent = '停止监控';
                document.getElementById('monitor-toggle').style.background = isDarkMode ? '#A1352B' : '#db4437';
            }
            updateStatus('正在监控网络请求...');
            
            // 更新迷你模式按钮状态
            const miniMonitorBtn = document.getElementById('mini-monitor');
            if (miniMonitorBtn) {
                miniMonitorBtn.classList.add('active');
            }
        }
    }
    
    // 切换最小化模式
    function toggleMinimizeMode(panel) {
        // 保存当前位置
        const currentLeft = panel.style.left;
        const currentTop = panel.style.top;
        
        // 获取迷你按钮容器
        const miniButtons = panel.querySelector('.mini-buttons-container');
        
        // 如果面板已经最小化，则恢复
        if (panel.classList.contains('minimized')) {
            panel.classList.remove('minimized');
            panel.style.width = '300px';
            panel.style.height = 'auto';
            
            // 不要设置display:none，而是通过CSS类控制显示
            if (miniButtons) {
                miniButtons.classList.remove('active');
            }
            
            // 显示所有常规内容
            Array.from(panel.children).forEach(child => {
                if (child.className !== 'mini-buttons-container' && child.id !== 'panel-drag-handle') {
                    child.style.display = '';
                }
            });
            
            document.getElementById('minimize-tool').textContent = '_';
        } else {
            // 最小化面板
            panel.classList.add('minimized');
            
            // 通过CSS类激活迷你按钮，而不是直接设置style
            if (miniButtons) {
                miniButtons.classList.add('active');
                // 确保没有内联样式干扰
                miniButtons.style.display = '';
            }
            
            // 隐藏所有常规内容，只显示迷你按钮和拖动手柄
            Array.from(panel.children).forEach(child => {
                if (child.className !== 'mini-buttons-container' && child.id !== 'panel-drag-handle') {
                    child.style.display = 'none';
                }
            });
            
            document.getElementById('minimize-tool').textContent = '□';
            
            // 更新迷你模式按钮状态
            if (isMonitoring) {
                document.getElementById('mini-monitor').classList.add('active');
            } else {
                document.getElementById('mini-monitor').classList.remove('active');
            }
        }
        
        // 恢复位置，防止位置重置
        panel.style.left = currentLeft;
        panel.style.top = currentTop;
        panel.style.bottom = 'auto';
    }
    
    // 监控网络请求按钮 
    document.getElementById('monitor-toggle').addEventListener('click', toggleMonitoring);
    
    // 重置自动合并计时器
    function resetAutoMergeTimer() {
        // 清除现有计时器
        if (autoMergeTimer) {
            clearTimeout(autoMergeTimer);
        }
        
        // 记录当前捕获的音频数量
        lastCaptureCount = capturedAudio.length;
        
        // 如果自动合并功能启用且捕获了音频，设置新计时器
        if (isAutoMergeEnabled && capturedAudio.length > 0) {
            autoMergeTimer = setTimeout(() => {
                // 检查5秒内音频数量是否有变化
                if (capturedAudio.length === lastCaptureCount && capturedAudio.length > 0) {
                    // 音频数量未变化，触发自动合并下载
                    updateStatus('检测到5秒内无新音频，开始自动合并下载...');
                    showMergeOptions(true); // 自动全选并开始合并下载
                }
            }, 5000); // 5秒检测间隔
        }
    }
})();
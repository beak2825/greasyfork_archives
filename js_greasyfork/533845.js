// ==UserScript==
// @name         内蒙古继续教育网站自动刷课脚本 (整合版)
// @namespace    http://tampermonkey.net/
// @version      2025.04.22.02
// @description  内蒙古继续教育网站自动刷课脚本,默认不自动播放，只检测已完成状态
// @author       request101
// @match        *://*.chinahrt.cn/*
// @match        *://*.chinahrt.com/*
// @match        *://*.chinahrt.com.cn/*
// @match        *://*.chinaedu.net/*
// @match        *://*.nmgbfrc.chinahrt.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533845/%E5%86%85%E8%92%99%E5%8F%A4%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20%28%E6%95%B4%E5%90%88%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533845/%E5%86%85%E8%92%99%E5%8F%A4%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%20%28%E6%95%B4%E5%90%88%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 全局变量
    let globalVideoElement = null;
    let processedUrls = [];
    let playlist = [];
    let lastJumpTime = 0;
    const JUMP_COOLDOWN = 3000; // 3秒冷却时间
    let jumpRetryCount = 0;
    const MAX_JUMP_RETRIES = 3;
    
    // 配置
    const config = {
        autoPlay: false,     // 自动播放（默认关闭）
        mute: true,          // 静音
        drag: 5,             // 拖动时间（秒）
        speed: 1.5,          // 播放速度
        playMode: 'loop',    // 播放模式：loop（循环）, single（单个）
        skipCompleted: true, // 跳过已完成课程
        debug: true          // 调试模式
    };
    
    // 初始化
    function init() {
        // 加载配置
        loadConfig();
        
        // 初始化样式
        initStyles();
        
        // 创建调试面板
        if (config.debug) {
            createDebugPanel();
        }
        
        // 初始化路由
        initRouter();
    }
    
    // 加载配置
    function loadConfig() {
        // 从localStorage加载配置
        const savedConfig = localStorage.getItem('chinahrtConfig');
        if (savedConfig) {
            try {
                const parsedConfig = JSON.parse(savedConfig);
                Object.assign(config, parsedConfig);
            } catch (e) {
                logDebugInfo('配置加载失败:', e);
            }
        }
        
        logDebugInfo('配置加载完成', config);
    }
    
    // 保存配置
    function saveConfig() {
        try {
            localStorage.setItem('chinahrtConfig', JSON.stringify(config));
            logDebugInfo('配置已保存');
        } catch (e) {
            logDebugInfo('配置保存失败:', e);
        }
    }
    
    // 增强的调试信息函数
    function logDebugInfo(message, data) {
        if (config.debug) {
            const timestamp = new Date().toISOString().substr(11, 8); // 获取时:分:秒
            
            if (data) {
                console.log(`[ChinaHRT调试 ${timestamp}] ${message}`, data);
            } else {
                console.log(`[ChinaHRT调试 ${timestamp}] ${message}`);
            }
            
            // 将日志添加到页面上的调试面板（如果存在）
            const debugPanel = document.getElementById('debug-panel');
            if (debugPanel) {
                const logEntry = document.createElement('div');
                logEntry.textContent = `${timestamp} - ${message}`;
                debugPanel.appendChild(logEntry);
                
                // 限制日志条目数量，避免过多
                while (debugPanel.children.length > 50) {
                    debugPanel.removeChild(debugPanel.firstChild);
                }
                
                // 自动滚动到底部
                debugPanel.scrollTop = debugPanel.scrollHeight;
            }
        }
    }
    
    // 跳转日志函数
    function logJumpInfo(message, data) {
        // 添加特殊标记，便于在日志中区分跳转相关信息
        logDebugInfo(`[跳转] ${message}`, data);
    }
    
    // 创建调试面板
    function createDebugPanel() {
        // 如果已存在，则不重复创建
        if (document.getElementById('debug-panel')) {
            return;
        }
        
        // 创建调试面板
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 400px;
            height: 200px;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            overflow-y: auto;
            z-index: 10000;
            border-radius: 5px;
            display: none;
        `;
        
        // 创建标题和控制按钮
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            border-bottom: 1px solid #555;
            padding-bottom: 5px;
        `;
        
        const title = document.createElement('span');
        title.textContent = '调试日志';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #fff;
            cursor: pointer;
        `;
        closeButton.onclick = function() {
            debugPanel.style.display = 'none';
        };
        
        header.appendChild(title);
        header.appendChild(closeButton);
        debugPanel.appendChild(header);
        
        // 添加到页面
        document.body.appendChild(debugPanel);
        
        // 添加快捷键切换显示/隐藏
        document.addEventListener('keydown', function(e) {
            // Alt+D 切换调试面板
            if (e.altKey && e.key === 'd') {
                debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
            }
            
            // Alt+J 触发跳转
            if (e.altKey && e.key === 'j') {
                logJumpInfo('用户手动触发跳转');
                handleCourseCompleted(true); // 强制跳转
            }
            
            // Alt+P 调试播放列表
            if (e.altKey && e.key === 'p') {
                debugPlaylist();
            }
        });
        
        return debugPanel;
    }
    
    // 调试播放列表
    function debugPlaylist() {
        logDebugInfo('播放列表调试信息:');
        logDebugInfo(`播放列表长度: ${playlist.length}`);
        
        for (let i = 0; i < playlist.length; i++) {
            logDebugInfo(`[${i}] ${playlist[i].title} - ${playlist[i].url}`);
        }
        
        // 获取当前URL
        const currentUrl = window.location.href;
        logDebugInfo(`当前URL: ${currentUrl}`);
        
        // 尝试查找当前URL在播放列表中的位置
        let found = false;
        for (let i = 0; i < playlist.length; i++) {
            if (isSameUrl(playlist[i].url, currentUrl)) {
                logDebugInfo(`当前URL在播放列表中的位置: ${i}`);
                found = true;
                break;
            }
        }
        
        if (!found) {
            logDebugInfo('当前URL不在播放列表中');
        }
    }
    
    // 初始化样式
    function initStyles() {
        logDebugInfo('初始化样式');
        
        const style = document.createElement('style');
        style.textContent = `
            .autoPlayBox { padding: 5px 10px; }
            .autoPlayBox .title {  color: blue; }
            .autoPlayBox label {  margin-right: 6px; display: inline-block; cursor: pointer; }
            .autoPlayBox label input {  margin-left: 4px; cursor: pointer; }
            .canPlaylist {  width: 300px;  height: auto;  position: fixed;  top: 20px;  background: rgba(255, 255, 255, 1);  left: 20px;  border: 1px solid #c1c1c1;  overflow-y: auto; z-index: 10000; padding: 10px; }
            .canPlaylist .oneClick {  margin: 0 auto;  width: 100%;  border: none;  padding: 6px 0;  background: linear-gradient(180deg, #4BCE31, #4bccf2);  height: 50px;  border-radius: 5px;  color: #FFF;  font-weight: bold;  letter-spacing: 4px;  font-size: 18px; cursor: pointer; }
            .canPlaylist .oneClear {  margin: 5px auto;  width: 100%;  border: none;  padding: 6px 0;  background: linear-gradient(180deg, #f24b4b, #f2994b);  height: 50px;  border-radius: 5px;  color: #FFF;  font-weight: bold;  letter-spacing: 4px;  font-size: 18px; cursor: pointer; }
            .canPlaylist .item {  border-bottom: 1px solid #c1c1c1;  padding: 8px;  line-height: 150%;  border-bottom: 1px solid #c1c1c1;  margin-bottom: 3px; }
            .canPlaylist .item .title {  font-size: 13px;  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis; }
            .canPlaylist .item .status {  font-size: 12px;  white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;  color: #c90000; }
            .canPlaylist .item .addBtn {  color: #FFF;  background-color: #4bccf2;  border: none;  padding: 5px 10px;  margin-top: 4px; cursor: pointer; }
            .canPlaylist .item .addBtn.remove {  background-color: #fd1952; }
            .dragBox {  padding: 5px 10px; }
            .dragBox .title {  color: blue; }
            .dragBox .remark {  font-size: 12px;  color: #fc1818; }
            .dragBox label {  margin-right: 6px; display: inline-block; cursor: pointer; }
            .dragBox label input {  margin-left: 4px; cursor: pointer; }
            .multiSegmentBox {  position: fixed;  right: 255px;  top: 0;  width: 250px;  height: 280px;  background-color: #FFF;  z-index: 9999;  border: 1px solid #ccc;  font-size: 12px; }
            .multiSegmentBox .tip {  border-bottom: 1px solid #ccc;  padding: 5px;  font-weight: bold;  color: red; }
            .multiSegmentBox .item {  font-size: 14px; }
            .multiSegmentBox label {  margin-right: 3px; display: inline-block; cursor: pointer; }
            .multiSegmentBox label input {  margin-left: 2px; cursor: pointer; }
            .muteBox {  padding: 5px 10px; }
            .muteBox .title {  color: blue; }
            .muteBox .remark {  font-size: 12px;  color: #fc1818; }
            .muteBox label {  margin-right: 6px; display: inline-block; cursor: pointer; }
            .muteBox label input {  margin-left: 4px; cursor: pointer; }
            .controllerBox {  position: fixed;  right: 0;  top: 0;  width: 250px;  height: 280px;  background-color: #FFF;  z-index: 9999;  border: 1px solid #ccc;  overflow-y: auto;  font-size: 12px; }
            .controllerBox .linksBox {  display: flex;  flex-wrap: wrap;  justify-content: space-between;  height: 30px;  line-height: 30px;  font-weight: bold;  border-bottom: 1px dotted; }
            .playlistBox {  position: fixed;  right: 0;  top: 290px;  width: 300px;  height: 450px;  background-color: #FFF;  z-index: 9999;  border: 1px solid #ccc;  overflow-y: auto; }
            .playlistBox .oneClear {  width: 100%;  border: none;  padding: 6px 0;  background: linear-gradient(180deg, #f24b4b, #f2994b);  height: 50px;  border-radius: 5px;  color: #FFF;  font-weight: bold;  letter-spacing: 4px;  font-size: 18px;  cursor: pointer;  margin-bottom: 5px; }
            .playlistBox .playlistItem {  display: flex;  justify-content: space-between;  align-items: center;  margin-bottom: 5px; padding: 5px; border-bottom: 1px solid #eee; }
            .playlistBox .playlistItem .child_title {  font-size: 13px;  overflow: hidden;  text-overflow: ellipsis;  width: 180px; display: block; max-height: 40px; }
            .playlistBox .playlistItem .child_remove {  color: #FFF;  background-color: #fd1952;  border: none;  padding: 5px 10px;  cursor: pointer; }
            .playlistBox .playlistItem .child_play {  color: #FFF;  background-color: #4BCE31;  border: none;  padding: 5px 10px;  cursor: pointer;  margin-right: 5px; }
            .speedBox {  padding: 5px 10px; }
            .speedBox .title {  color: blue; }
            .speedBox .remark {  font-size: 12px;  color: #fc1818; }
            .speedBox label {  margin-right: 6px; display: inline-block; cursor: pointer; }
            .speedBox label input {  margin-left: 4px; cursor: pointer; }
            .skipCompletedBox { padding: 5px 10px; }
            .skipCompletedBox .title { color: blue; }
            .skipCompletedBox label { margin-right: 6px; display: inline-block; cursor: pointer; }
            .skipCompletedBox label input { margin-left: 4px; cursor: pointer; }
            .tooltip { position: absolute; background: rgba(0,0,0,0.8); color: white; padding: 5px; border-radius: 3px; z-index: 10001; max-width: 300px; }
        `;
        
        document.head.appendChild(style);
        logDebugInfo('样式初始化完成');
    }
    
    // 初始化路由
    function initRouter() {
        logDebugInfo('初始化路由');
        
        // 获取当前页面类型
        const pageType = currentPageType();
        
        // 根据页面类型执行不同的初始化
        switch (pageType) {
            case 1: // 视频列表页面
                initVideoListPage();
                break;
            case 2: // 视频播放页面
                initVideoPlayPage();
                break;
            case 3: // 我的课程页面
                // 不需要任何功能框
                break;
            case 4: // 课程学习页面
                logDebugInfo('课程学习页面，只显示简化版UI');
                initSimplifiedCoursePage();
                break;
            default:
                // 其他页面不做处理
                break;
        }
    }
    
    // 获取当前页面类型
    function currentPageType() {
        const pathname = window.location.pathname;
        const href = window.location.href;
        
        logDebugInfo('检查页面类型', {pathname, href});
        
        // 适配内蒙古网站的视频播放页面
        if (pathname.includes("/onlineVideo.asp")) {
            logDebugInfo('当前页面类型: 视频播放页面');
            return 2; // 视频播放页面
        }
        
        // 特殊处理course_study.asp页面
        if (pathname.includes("/course_study.asp")) {
            logDebugInfo('当前页面类型: 课程学习页面');
            return 4; // 课程学习页面 - 只显示简化版UI
        }
        
        // 特殊处理myCourses.asp页面
        if (pathname.includes("/myCourses.asp")) {
            logDebugInfo('当前页面类型: 我的课程页面');
            return 3; // 我的课程页面 - 不需要任何功能框
        }
        
        logDebugInfo('当前页面类型: 其他页面');
        return 0; // 其他页面
    }
    
    // 初始化视频列表页面
    function initVideoListPage() {
        logDebugInfo('初始化视频列表页面');
        
        // 创建可播放列表
        createCanPlaylist();
        
        // 创建控制面板
        createControllerBox();
        
        // 创建播放列表
        createPlaylistBox();
    }
    
    // 初始化视频播放页面
    function initVideoPlayPage() {
        logDebugInfo('初始化视频播放页面');
        
        // 创建控制面板
        createControllerBox();
        
        // 创建播放列表
        createPlaylistBox();
        
        // 阻止网站自身的自动播放
        preventAutoplay();
        
        // 初始化视频播放器
        initVideoPlayer();
        
        // 设置完成状态检查器
        setupCompletionChecker();
        
        // 设置DOM变化监听器
        setupDOMChangeListener();
        
        // 初始检查完成状态
        setTimeout(() => {
            if (checkCourseCompleted()) {
                logDebugInfo('初始检查：检测到课程已完成');
                handleCourseCompleted();
            }
        }, 2000);
    }
    
    // 阻止网站自身的自动播放
    function preventAutoplay() {
        logDebugInfo('尝试阻止网站自身的自动播放');
        
        // 方法1：覆盖原生play方法
        try {
            const originalPlay = HTMLMediaElement.prototype.play;
            HTMLMediaElement.prototype.play = function() {
                if (config.autoPlay) {
                    return originalPlay.apply(this);
                } else {
                    logDebugInfo('阻止了自动播放尝试');
                    return new Promise((resolve, reject) => {
                        reject(new DOMException('自动播放被阻止', 'NotAllowedError'));
                    });
                }
            };
            logDebugInfo('成功覆盖原生play方法');
        } catch (e) {
            logDebugInfo('覆盖原生play方法失败:', e);
        }
        
        // 方法2：监听并阻止自动播放事件
        document.addEventListener('play', function(e) {
            if (!config.autoPlay && e.target.tagName.toLowerCase() === 'video') {
                logDebugInfo('检测到自动播放事件，尝试阻止');
                e.target.pause();
                e.preventDefault();
            }
        }, true);
        
        // 方法3：定期检查并暂停所有视频
        if (!config.autoPlay) {
            const pauseInterval = setInterval(() => {
                const videos = document.querySelectorAll('video');
                for (const video of videos) {
                    if (!video.paused && !config.autoPlay) {
                        logDebugInfo('检测到正在播放的视频，尝试暂停');
                        video.pause();
                    }
                }
            }, 500); // 每500毫秒检查一次
            
            // 30秒后清除定期检查
            setTimeout(() => {
                clearInterval(pauseInterval);
                logDebugInfo('已清除定期暂停检查');
            }, 30000);
        }
    }
    
    // 初始化简化版课程列表页面
    function initSimplifiedCoursePage() {
        logDebugInfo('初始化简化版课程列表页面');
        
        // 创建简化版可播放列表
        createSimplifiedCanPlaylist();
    }
    
    // 创建简化版可播放列表
    function createSimplifiedCanPlaylist() {
        logDebugInfo('创建简化版可播放列表');
        
        let playlist = document.createElement("div");
        playlist.id = "canPlaylist";
        playlist.className = "canPlaylist";
        playlist.style.position = "fixed";
        playlist.style.top = "20px";
        playlist.style.left = "20px";
        playlist.style.width = "auto";
        playlist.style.height = "auto";
        playlist.style.padding = "10px";
        playlist.style.zIndex = "10000";
        
        playlist.innerHTML = `
            <button class="oneClick">一键添加所有视频</button>
            <button class="oneClear">一键清空播放列表</button>
            <div id="status" style="margin-top: 10px; color: blue;"></div>
        `;
        
        // 添加事件监听器
        const oneClickBtn = playlist.querySelector('.oneClick');
        if (oneClickBtn) {
            oneClickBtn.addEventListener('click', function() {
                oneClickAddAllVideos();
                // 添加状态反馈
                const statusDiv = document.getElementById('status');
                if (statusDiv) {
                    statusDiv.textContent = '正在添加视频...';
                    setTimeout(() => {
                        statusDiv.textContent = '视频添加完成！';
                    }, 1000);
                }
            });
        }
        
        const oneClearBtn = playlist.querySelector('.oneClear');
        if (oneClearBtn) {
            oneClearBtn.addEventListener('click', function() {
                clearPlaylist();
                // 添加状态反馈
                const statusDiv = document.getElementById('status');
                if (statusDiv) {
                    statusDiv.textContent = '播放列表已清空！';
                }
            });
        }
        
        document.body.appendChild(playlist);
        logDebugInfo('简化版可播放列表已添加到页面');
        return playlist;
    }
    
    // 创建可播放列表
    function createCanPlaylist() {
        let playlist = document.createElement("div");
        playlist.id = "canPlaylist";
        playlist.className = "canPlaylist";
        
        playlist.innerHTML = `
            <button class="oneClick">一键添加所有视频</button>
            <button class="oneClear">一键清空播放列表</button>
            <div id="videoList"></div>
        `;
        
        // 添加事件监听器
        const oneClickBtn = playlist.querySelector('.oneClick');
        if (oneClickBtn) {
            oneClickBtn.addEventListener('click', oneClickAddAllVideos);
        }
        
        const oneClearBtn = playlist.querySelector('.oneClear');
        if (oneClearBtn) {
            oneClearBtn.addEventListener('click', clearPlaylist);
        }
        
        document.body.appendChild(playlist);
        return playlist;
    }
    
    // 创建控制面板
    function createControllerBox() {
        let controllerBox = document.createElement("div");
        controllerBox.className = "controllerBox";
        
        controllerBox.innerHTML = `
            <div class="linksBox">
                <a href="javascript:;" onclick="toggleBox('autoPlayBox')">自动播放</a>
                <a href="javascript:;" onclick="toggleBox('muteBox')">静音</a>
                <a href="javascript:;" onclick="toggleBox('speedBox')">倍速</a>
                <a href="javascript:;" onclick="toggleBox('dragBox')">拖动</a>
                <a href="javascript:;" onclick="toggleBox('skipCompletedBox')">跳过已完成</a>
            </div>
            <div id="autoPlayBox" class="autoPlayBox" style="display: none;">
                <div class="title">自动播放</div>
                <label><input type="radio" name="autoPlay" value="1" ${config.autoPlay ? 'checked' : ''}>开启</label>
                <label><input type="radio" name="autoPlay" value="0" ${!config.autoPlay ? 'checked' : ''}>关闭</label>
            </div>
            <div id="muteBox" class="muteBox" style="display: none;">
                <div class="title">静音</div>
                <label><input type="radio" name="mute" value="1" ${config.mute ? 'checked' : ''}>开启</label>
                <label><input type="radio" name="mute" value="0" ${!config.mute ? 'checked' : ''}>关闭</label>
            </div>
            <div id="speedBox" class="speedBox" style="display: none;">
                <div class="title">倍速</div>
                <label><input type="radio" name="speed" value="1" ${config.speed === 1 ? 'checked' : ''}>1.0</label>
                <label><input type="radio" name="speed" value="1.25" ${config.speed === 1.25 ? 'checked' : ''}>1.25</label>
                <label><input type="radio" name="speed" value="1.5" ${config.speed === 1.5 ? 'checked' : ''}>1.5</label>
                <label><input type="radio" name="speed" value="2" ${config.speed === 2 ? 'checked' : ''}>2.0</label>
            </div>
            <div id="dragBox" class="dragBox" style="display: none;">
                <div class="title">拖动</div>
                <div class="remark">每30秒拖动一次</div>
                <label><input type="radio" name="drag" value="0" ${config.drag === 0 ? 'checked' : ''}>关闭</label>
                <label><input type="radio" name="drag" value="5" ${config.drag === 5 ? 'checked' : ''}>5秒</label>
                <label><input type="radio" name="drag" value="10" ${config.drag === 10 ? 'checked' : ''}>10秒</label>
                <label><input type="radio" name="drag" value="30" ${config.drag === 30 ? 'checked' : ''}>30秒</label>
            </div>
            <div id="skipCompletedBox" class="skipCompletedBox" style="display: none;">
                <div class="title">跳过已完成</div>
                <label><input type="radio" name="skipCompleted" value="1" ${config.skipCompleted ? 'checked' : ''}>开启</label>
                <label><input type="radio" name="skipCompleted" value="0" ${!config.skipCompleted ? 'checked' : ''}>关闭</label>
            </div>
        `;
        
        document.body.appendChild(controllerBox);
        
        // 添加事件监听器
        window.toggleBox = function(boxId) {
            toggleBox(boxId);
        };
        
        document.querySelectorAll('input[name="autoPlay"]').forEach(input => {
            input.addEventListener('change', function() {
                config.autoPlay = this.value === '1';
                saveConfig();
                
                if (globalVideoElement) {
                    if (config.autoPlay) {
                        globalVideoElement.play().catch(e => {
                            logDebugInfo('自动播放失败:', e);
                        });
                    } else {
                        globalVideoElement.pause();
                    }
                }
            });
        });
        
        document.querySelectorAll('input[name="mute"]').forEach(input => {
            input.addEventListener('change', function() {
                config.mute = this.value === '1';
                saveConfig();
                
                if (globalVideoElement) {
                    globalVideoElement.muted = config.mute;
                }
            });
        });
        
        document.querySelectorAll('input[name="speed"]').forEach(input => {
            input.addEventListener('change', function() {
                config.speed = parseFloat(this.value);
                saveConfig();
                
                if (globalVideoElement) {
                    globalVideoElement.playbackRate = config.speed;
                }
            });
        });
        
        document.querySelectorAll('input[name="drag"]').forEach(input => {
            input.addEventListener('change', function() {
                config.drag = parseInt(this.value);
                saveConfig();
            });
        });
        
        document.querySelectorAll('input[name="skipCompleted"]').forEach(input => {
            input.addEventListener('change', function() {
                config.skipCompleted = this.value === '1';
                saveConfig();
            });
        });
        
        return controllerBox;
    }
    
    // 切换显示/隐藏控制面板中的盒子
    function toggleBox(boxId) {
        const box = document.getElementById(boxId);
        if (box) {
            const isVisible = box.style.display !== 'none';
            
            // 隐藏所有盒子
            document.querySelectorAll('.controllerBox > div:not(.linksBox)').forEach(div => {
                div.style.display = 'none';
            });
            
            // 如果当前盒子是可见的，则隐藏它；否则显示它
            box.style.display = isVisible ? 'none' : 'block';
        }
    }
    
    // 创建播放列表
    function createPlaylistBox() {
        let playlistBox = document.createElement("div");
        playlistBox.className = "playlistBox";
        
        playlistBox.innerHTML = `
            <button class="oneClear">一键清空播放列表</button>
            <div id="playlistItems"></div>
        `;
        
        document.body.appendChild(playlistBox);
        
        // 添加事件监听器
        const oneClearBtn = playlistBox.querySelector('.oneClear');
        if (oneClearBtn) {
            oneClearBtn.addEventListener('click', clearPlaylist);
        }
        
        // 加载播放列表
        loadPlaylist();
        
        return playlistBox;
    }
    
    // 增强的播放列表加载函数
    function loadPlaylist() {
        // 从localStorage加载播放列表
        const savedPlaylist = localStorage.getItem('chinahrtPlaylist');
        if (savedPlaylist) {
            try {
                playlist = JSON.parse(savedPlaylist);
                logDebugInfo('播放列表加载成功，包含 ' + playlist.length + ' 个课程');
                
                // 验证播放列表数据的有效性
                let validItems = 0;
                for (let i = 0; i < playlist.length; i++) {
                    if (playlist[i] && playlist[i].url && playlist[i].title) {
                        validItems++;
                    }
                }
                
                if (validItems === 0) {
                    logDebugInfo('播放列表中没有有效项目，尝试重建');
                    rebuildPlaylist();
                } else {
                    updatePlaylistUI();
                }
            } catch (e) {
                logDebugInfo('播放列表加载失败:', e);
                rebuildPlaylist();
            }
        } else {
            logDebugInfo('未找到保存的播放列表，尝试重建');
            rebuildPlaylist();
        }
    }
    
    // 自动重建播放列表
    function rebuildPlaylist() {
        logDebugInfo('开始重建播放列表');
        playlist = [];
        
        // 尝试从当前页面提取课程信息
        const courseLinks = document.querySelectorAll('a[href*="course_study.asp"], a[href*="onlineVideo.asp"]');
        if (courseLinks && courseLinks.length > 0) {
            for (const link of courseLinks) {
                const url = link.href;
                const title = link.textContent.trim();
                
                if (url && title && !processedUrls.includes(url)) {
                    playlist.push({ url, title });
                    processedUrls.push(url);
                    logDebugInfo('从页面添加课程到播放列表:', title);
                }
            }
        }
        
        // 保存重建的播放列表
        savePlaylist();
        updatePlaylistUI();
        
        logDebugInfo('播放列表重建完成，包含 ' + playlist.length + ' 个课程');
    }
    
    // 更新播放列表UI
    function updatePlaylistUI() {
        const playlistItems = document.getElementById('playlistItems');
        if (!playlistItems) return;
        
        // 清空播放列表UI
        playlistItems.innerHTML = '';
        
        // 添加播放列表项
        for (let i = 0; i < playlist.length; i++) {
            const item = playlist[i];
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'playlistItem';
            
            itemDiv.innerHTML = `
                <span class="child_title">${item.title}</span>
                <div>
                    <button class="child_play">播放</button>
                    <button class="child_remove">删除</button>
                </div>
            `;
            
            // 添加播放按钮事件
            const playButton = itemDiv.querySelector('.child_play');
            playButton.addEventListener('click', function() {
                window.location.href = item.url;
            });
            
            // 添加删除按钮事件
            const removeButton = itemDiv.querySelector('.child_remove');
            removeButton.addEventListener('click', function() {
                playlist.splice(i, 1);
                savePlaylist();
                updatePlaylistUI();
            });
            
            playlistItems.appendChild(itemDiv);
        }
    }
    
    // 保存播放列表
    function savePlaylist() {
        try {
            localStorage.setItem('chinahrtPlaylist', JSON.stringify(playlist));
            logDebugInfo('播放列表已保存，包含 ' + playlist.length + ' 个课程');
        } catch (e) {
            logDebugInfo('播放列表保存失败:', e);
        }
    }
    
    // 清空播放列表
    function clearPlaylist() {
        playlist = [];
        processedUrls = [];
        savePlaylist();
        updatePlaylistUI();
        logDebugInfo('播放列表已清空');
    }
    
    // 一键添加所有视频
    function oneClickAddAllVideos() {
        logDebugInfo('开始一键添加所有视频');
        
        // 清空已处理的URL列表
        processedUrls = [];
        
        // 尝试多种选择器来获取视频链接
        const selectors = [
            '#cc li a',                // 标准选择器
            '.ui-bxkc li a',           // 内蒙古网站特定选择器
            '.chapter-list li a',      // 通用选择器
            'a[href*="onlineVideo.asp"]', // 基于URL的选择器
            '.video-item a',           // 通用视频项选择器
            '#videoList a'             // 视频列表选择器
        ];
        
        let videoLinks = null;
        
        // 尝试每个选择器，直到找到视频链接
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                videoLinks = elements;
                logDebugInfo(`使用选择器 "${selector}" 找到 ${elements.length} 个视频链接`);
                break;
            }
        }
        
        // 如果没有找到视频链接，尝试更通用的方法
        if (!videoLinks || videoLinks.length === 0) {
            // 尝试查找所有可能是视频链接的元素
            const allLinks = document.querySelectorAll('a');
            const possibleVideoLinks = Array.from(allLinks).filter(link => {
                const href = link.href || '';
                return href.includes('onlineVideo.asp') || href.includes('course_study.asp');
            });
            
            if (possibleVideoLinks.length > 0) {
                videoLinks = possibleVideoLinks;
                logDebugInfo(`使用通用方法找到 ${possibleVideoLinks.length} 个可能的视频链接`);
            }
        }
        
        // 如果仍然没有找到视频链接，返回
        if (!videoLinks || videoLinks.length === 0) {
            logDebugInfo('未找到视频链接');
            return;
        }
        
        // 处理每个视频链接
        for (const link of videoLinks) {
            const url = link.href;
            // 提取视频名称，去除可能的图标和状态文本
            let title = link.textContent.trim();
            title = title.replace(/已完成/g, '').trim();
            title = title.replace(/\s*\d+%\s*/g, '').trim();
            
            // 如果链接有效且不在已处理列表中
            if (url && title && !processedUrls.includes(url)) {
                // 添加到播放列表
                playlist.push({ url, title });
                processedUrls.push(url);
                logDebugInfo('添加视频到播放列表:', title);
            }
        }
        
        // 保存播放列表
        savePlaylist();
        
        // 更新播放列表UI
        updatePlaylistUI();
        
        logDebugInfo('一键添加所有视频完成，共添加 ' + playlist.length + ' 个视频');
    }
    
    // 初始化视频播放器
    function initVideoPlayer() {
        logDebugInfo('初始化视频播放器');
        
        // 查找视频元素
        const videoElements = document.querySelectorAll('video');
        if (!videoElements || videoElements.length === 0) {
            logDebugInfo('未找到视频元素，尝试等待视频加载');
            
            // 等待视频元素加载
            setTimeout(initVideoPlayer, 1000);
            return;
        }
        
        // 使用第一个视频元素
        const videoElement = videoElements[0];
        globalVideoElement = videoElement;
        
        logDebugInfo('找到视频元素:', videoElement);
        
        // 立即设置autoplay属性为false，防止首次加载时自动播放
        videoElement.autoplay = false;
        
        // 立即暂停视频，确保不会自动播放
        videoElement.pause();
        
        // 应用视频设置
        applyVideoSettings();
        
        // 添加视频事件监听器
        addVideoEventListeners(videoElement);
        
        // 如果配置了自动播放，尝试播放视频
        if (config.autoPlay) {
            videoElement.play().catch(e => {
                logDebugInfo('自动播放失败:', e);
                
                // 如果自动播放失败，尝试静音后再播放
                videoElement.muted = true;
                videoElement.play().catch(e => {
                    logDebugInfo('静音后自动播放仍然失败:', e);
                });
            });
        } else {
            logDebugInfo('自动播放已关闭，不自动播放视频');
            // 再次确保视频是暂停状态
            videoElement.pause();
        }
    }
    
    // 应用视频设置
    function applyVideoSettings() {
        if (!globalVideoElement) return;
        
        logDebugInfo('应用视频设置:', config);
        
        // 设置自动播放
        if (config.autoPlay) {
            globalVideoElement.autoplay = true;
            globalVideoElement.play().catch(e => {
                logDebugInfo('自动播放失败:', e);
                
                // 如果自动播放失败，尝试静音后再播放
                globalVideoElement.muted = true;
                globalVideoElement.play().catch(e => {
                    logDebugInfo('静音后自动播放仍然失败:', e);
                });
            });
        } else {
            globalVideoElement.autoplay = false;
            logDebugInfo('自动播放已关闭，视频将不会自动播放');
        }
        
        // 设置静音
        globalVideoElement.muted = config.mute;
        
        // 设置播放速度
        globalVideoElement.playbackRate = config.speed;
        
        // 设置拖动
        if (config.drag > 0) {
            // 每隔一段时间拖动视频
            setInterval(() => {
                if (globalVideoElement && !globalVideoElement.paused && globalVideoElement.duration > 0) {
                    // 计算新的播放位置
                    let newTime = globalVideoElement.currentTime + config.drag;
                    
                    // 确保不超过视频总时长
                    if (newTime < globalVideoElement.duration - 5) {
                        globalVideoElement.currentTime = newTime;
                    }
                }
            }, 30000); // 每30秒拖动一次
        }
    }
    
    // 增强的视频事件监听器
    function addVideoEventListeners(videoElement) {
        // 视频播放结束事件
        videoElement.addEventListener('ended', function() {
            logDebugInfo('视频播放结束');
            
            // 延迟检查，给页面状态更新的时间
            setTimeout(() => {
                // 检查课程是否已完成
                if (checkCourseCompleted()) {
                    logDebugInfo('视频结束：检测到完成状态');
                    handleCourseCompleted(true); // 强制跳转
                }
            }, 2000); // 增加延迟时间
        });
        
        // 视频时间更新事件
        videoElement.addEventListener('timeupdate', function() {
            // 只在视频接近结束时检查
            if (videoElement.duration > 0 && 
                videoElement.currentTime > 0 && 
                videoElement.currentTime / videoElement.duration > 0.95) {
                
                // 限制检查频率，避免频繁检查
                if (!videoElement._lastTimeUpdateCheck || 
                    Date.now() - videoElement._lastTimeUpdateCheck > 2000) {
                    
                    videoElement._lastTimeUpdateCheck = Date.now();
                    
                    // 检查是否已完成
                    if (checkCourseCompleted()) {
                        logDebugInfo('timeupdate事件：检测到完成状态');
                        handleCourseCompleted();
                    }
                }
            }
        });
        
        // 视频进度事件
        videoElement.addEventListener('progress', function() {
            // 检查是否已完成
            if (checkCourseCompleted()) {
                logDebugInfo('progress事件：检测到完成状态');
                handleCourseCompleted();
            }
        });
        
        // 视频错误事件
        videoElement.addEventListener('error', function(e) {
            logDebugInfo('视频播放错误:', e);
            
            // 尝试恢复播放
            setTimeout(() => {
                videoElement.load();
                if (config.autoPlay) {
                    videoElement.play();
                }
            }, 3000);
        });
        
        // 视频加载完成事件
        videoElement.addEventListener('loadedmetadata', function() {
            logDebugInfo('视频元数据加载完成，时长: ' + videoElement.duration + '秒');
            
            // 对于非常短的视频（小于5秒），可能是占位视频，直接视为完成
            if (videoElement.duration < 5) {
                logDebugInfo('视频时长小于5秒，可能是占位视频，直接视为完成');
                setTimeout(() => {
                    handleCourseCompleted();
                }, 1000);
            }
        });
    }
    
    // 设置完成状态检测
    function setupCompletionChecker() {
        logDebugInfo('设置完成状态检测');
        
        // 清除之前的检查间隔
        if (window.completionCheckInterval) {
            clearInterval(window.completionCheckInterval);
        }
        
        // 设置新的检查间隔
        window.completionCheckInterval = setInterval(() => {
            // 检查课程是否已完成
            if (checkCourseCompleted()) {
                logDebugInfo('定期检查：检测到完成状态');
                handleCourseCompleted();
            }
        }, 3000); // 每3秒检查一次
    }
    
    // 设置DOM变化监听器
    function setupDOMChangeListener() {
        // 创建MutationObserver
        const observer = new MutationObserver((mutations) => {
            // 检查是否有相关变化
            let hasRelevantChanges = false;
            
            for (const mutation of mutations) {
                // 检查是否有添加节点
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        // 检查是否是元素节点
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否包含完成状态相关的元素
                            if (node.id === 'jd_box' || 
                                node.classList.contains('pl30') ||
                                node.textContent.includes('已完成')) {
                                hasRelevantChanges = true;
                                break;
                            }
                        }
                    }
                }
                
                // 检查是否有属性变化
                if (!hasRelevantChanges && mutation.type === 'attributes') {
                    const target = mutation.target;
                    
                    // 检查是否是完成状态相关的属性变化
                    if (target.id === 'jd_box' || 
                        target.classList.contains('pl30') ||
                        (mutation.attributeName === 'class' && target.classList.contains('completed'))) {
                        hasRelevantChanges = true;
                    }
                }
                
                if (hasRelevantChanges) {
                    break;
                }
            }
            
            // 如果有相关变化，检查完成状态
            if (hasRelevantChanges) {
                logDebugInfo('检测到DOM变化，检查完成状态');
                
                // 延迟检查，给页面状态更新的时间
                setTimeout(() => {
                    if (checkCourseCompleted()) {
                        logDebugInfo('DOM变化后检测到完成状态');
                        handleCourseCompleted();
                    }
                }, 1000);
            }
        });
        
        // 开始观察
        observer.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['class', 'style', 'id']
        });
        
        // 保存观察器引用，以便后续可以停止观察
        window.domChangeObserver = observer;
        
        logDebugInfo('已设置DOM变化监听器');
    }
    
    // 检查课程是否已完成
    function checkCourseCompleted() {
        // 记录开始检测
        logDebugInfo('开始检测课程完成状态');
        
        // 记录所有检测方法的结果
        let detectionResults = [];
        
        // 方法1：检查jd_box元素
        const jdBox = document.getElementById('jd_box');
        const jdBoxResult = jdBox && jdBox.textContent.includes('已完成');
        detectionResults.push({method: 'jd_box', result: jdBoxResult});
        
        // 方法2：检查带pl30类的元素
        const pl30Elements = document.querySelectorAll('.pl30');
        let pl30Result = false;
        for (const element of pl30Elements) {
            if (element.textContent.includes('已完成')) {
                pl30Result = true;
                break;
            }
        }
        detectionResults.push({method: 'pl30', result: pl30Result});
        
        // 方法3：检查进度条
        const progressBars = document.querySelectorAll('.progress-bar, .progress');
        let progressBarResult = false;
        for (const progressBar of progressBars) {
            const style = window.getComputedStyle(progressBar);
            const width = parseFloat(style.width);
            const maxWidth = parseFloat(style.maxWidth) || 100;
            
            if (width / maxWidth >= 0.99) { // 如果进度达到99%
                progressBarResult = true;
                break;
            }
        }
        detectionResults.push({method: 'progress_bar', result: progressBarResult});
        
        // 方法4：检查状态文本
        const stateElements = document.querySelectorAll('.state, .status, .course-state, .course-status');
        let stateTextResult = false;
        for (const element of stateElements) {
            if (element.textContent.includes('已完成') || 
                element.textContent.includes('100%') ||
                element.textContent.includes('完成')) {
                stateTextResult = true;
                break;
            }
        }
        detectionResults.push({method: 'state_text', result: stateTextResult});
        
        // 方法5：检查完成图标
        const completedIcons = document.querySelectorAll('.completed-icon, .done-icon, .icon-completed, .icon-done');
        const completedIconResult = completedIcons.length > 0;
        detectionResults.push({method: 'completed_icon', result: completedIconResult});
        
        // 方法6：检查完成类
        const completedElements = document.querySelectorAll('.completed, .done, .finished');
        const completedClassResult = completedElements.length > 0;
        detectionResults.push({method: 'completed_class', result: completedClassResult});
        
        // 方法7：检查完成属性
        const elementsWithCompletedAttr = document.querySelectorAll('[data-completed="true"], [data-status="completed"], [data-state="completed"]');
        const completedAttrResult = elementsWithCompletedAttr.length > 0;
        detectionResults.push({method: 'completed_attr', result: completedAttrResult});
        
        // 方法8：检查全文
        const bodyText = document.body.textContent;
        const bodyTextResult = bodyText.includes('已完成学习') || 
                              bodyText.includes('学习已完成') || 
                              bodyText.includes('课程已完成');
        detectionResults.push({method: 'body_text', result: bodyTextResult});
        
        // 方法9：检查带有特定ID的元素
        const specificIdElements = [
            document.getElementById('complete-status'),
            document.getElementById('study-status'),
            document.getElementById('learning-status')
        ];
        let specificIdResult = false;
        for (const element of specificIdElements) {
            if (element && (
                element.textContent.includes('已完成') || 
                element.textContent.includes('100%') ||
                element.classList.contains('completed')
            )) {
                specificIdResult = true;
                break;
            }
        }
        detectionResults.push({method: 'specific_id', result: specificIdResult});
        
        // 方法10：检查内蒙古网站特定的完成标记
        const nmgSpecificElements = document.querySelectorAll('.ui-bxkc li a, .ui-bxkc li span');
        let nmgSpecificResult = false;
        for (const element of nmgSpecificElements) {
            if (element.textContent.includes('已完成') || 
                element.classList.contains('completed') ||
                element.classList.contains('done')) {
                nmgSpecificResult = true;
                break;
            }
        }
        detectionResults.push({method: 'nmg_specific', result: nmgSpecificResult});
        
        // 方法11：检查视频播放进度
        let videoProgressResult = false;
        if (globalVideoElement && globalVideoElement.duration > 0) {
            const progress = globalVideoElement.currentTime / globalVideoElement.duration;
            if (progress > 0.98) { // 如果进度超过98%
                videoProgressResult = true;
            }
        }
        detectionResults.push({method: 'video_progress', result: videoProgressResult});
        
        // 方法12：检查页面标题
        const titleResult = document.title.includes('已完成') || document.title.includes('100%');
        detectionResults.push({method: 'page_title', result: titleResult});
        
        // 记录检测结果
        logDebugInfo('完成状态检测结果:', detectionResults);
        
        // 记录每种方法的结果
        for (const result of detectionResults) {
            logDebugInfo(`方法 ${result.method}: ${result.result ? '已完成' : '未完成'}`);
        }
        
        // 计算有多少方法检测到完成
        const positiveResults = detectionResults.filter(r => r.result).length;
        
        // 如果至少两种方法检测到完成，直接确认完成
        if (positiveResults >= 2) {
            logDebugInfo('至少两种方法检测到完成，确认课程已完成');
            return true;
        }
        
        // 如果只有一种方法检测到完成，检查是哪种方法
        if (positiveResults === 1) {
            const positiveMethod = detectionResults.find(r => r.result).method;
            
            // 对于高可靠性的方法，可以单独确认完成
            const highReliabilityMethods = ['jd_box', 'pl30', 'progress_bar', 'state_text', 'nmg_specific'];
            if (highReliabilityMethods.includes(positiveMethod)) {
                logDebugInfo(`单一高可靠性方法 ${positiveMethod} 检测到完成，确认课程已完成`);
                return true;
            }
            
            // 对于其他方法，如果视频已接近结束，也可以确认完成
            if (globalVideoElement && globalVideoElement.duration > 0 && 
                globalVideoElement.currentTime / globalVideoElement.duration > 0.9) {
                logDebugInfo(`单一方法 ${positiveMethod} 检测到完成，且视频接近结束，确认课程已完成`);
                return true;
            }
        }
        
        // 特殊情况：如果视频已结束，也视为完成
        if (globalVideoElement && globalVideoElement.ended) {
            logDebugInfo('视频已结束，视为课程已完成');
            return true;
        }
        
        // 如果没有检测到完成
        logDebugInfo('未检测到课程完成状态');
        return false;
    }
    
    // 处理课程完成
    function handleCourseCompleted(forceJump = false) {
        logJumpInfo(`处理课程完成 (强制跳转: ${forceJump})`);
        
        // 检查是否在冷却期内
        const currentTime = Date.now();
        if (!forceJump && currentTime - lastJumpTime < JUMP_COOLDOWN) {
            logJumpInfo('跳转冷却中，忽略此次跳转请求');
            return;
        }
        
        // 如果是强制跳转，直接跳过确认
        if (forceJump) {
            logJumpInfo('强制跳转，跳过确认');
            lastJumpTime = currentTime;
            jumpToNextCourseWithRetry();
            return;
        }
        
        // 确认跳转
        if (confirmJump()) {
            logJumpInfo('跳转确认成功');
            lastJumpTime = currentTime;
            jumpToNextCourseWithRetry();
        } else {
            logJumpInfo('跳转确认失败，设置延迟重试');
            
            // 设置延迟重试
            setTimeout(() => {
                logJumpInfo('延迟重试跳转');
                if (confirmJump(true)) { // 延迟重试时强制确认
                    lastJumpTime = Date.now();
                    jumpToNextCourseWithRetry();
                }
            }, 5000); // 5秒后重试
        }
    }
    
    // 确认跳转
    function confirmJump(forceConfirm = false) {
        // 如果强制确认，直接返回true
        if (forceConfirm) {
            logJumpInfo('强制确认跳转');
            return true;
        }
        
        // 检查视频是否已结束
        const videoEnded = globalVideoElement && globalVideoElement.ended;
        if (videoEnded) {
            logJumpInfo('视频已结束，确认跳转');
            return true;
        }
        
        // 再次检查完成状态
        if (checkCourseCompleted()) {
            logJumpInfo('检测到完成状态，确认跳转');
            return true;
        }
        
        // 所有检查都未通过
        logJumpInfo('跳转确认失败');
        return false;
    }
    
    // 带重试的跳转
    function jumpToNextCourseWithRetry() {
        logJumpInfo(`尝试跳转到下一课程 (尝试次数: ${jumpRetryCount + 1}/${MAX_JUMP_RETRIES + 1})`);
        
        // 重置重试计数器（如果这是新的跳转尝试）
        if (window.lastJumpAttemptTime && Date.now() - window.lastJumpAttemptTime > 30000) {
            jumpRetryCount = 0;
        }
        
        // 记录本次尝试时间
        window.lastJumpAttemptTime = Date.now();
        
        // 尝试跳转
        jumpToNextCourse();
        
        // 设置重试
        if (jumpRetryCount < MAX_JUMP_RETRIES) {
            jumpRetryCount++;
            
            // 设置重试计时器
            setTimeout(() => {
                // 检查是否仍在同一页面
                if (window.location.href === window.lastJumpAttemptUrl) {
                    logJumpInfo(`跳转似乎失败，尝试重试 (${jumpRetryCount}/${MAX_JUMP_RETRIES})`);
                    jumpToNextCourseWithRetry();
                }
            }, 5000); // 5秒后重试
        } else {
            logJumpInfo(`达到最大重试次数 (${MAX_JUMP_RETRIES})，尝试其他方法`);
            jumpRetryCount = 0;
            
            // 尝试从播放列表中找到任何可用的课程
            const anyAvailableCourse = findAnyAvailableCourseInPlaylist();
            if (anyAvailableCourse) {
                logJumpInfo(`找到播放列表中的可用课程: ${anyAvailableCourse}`);
                setTimeout(() => {
                    window.location.href = anyAvailableCourse;
                }, 1000);
                return;
            }
            
            // 如果实在找不到任何课程，才尝试返回课程列表页面
            logJumpInfo('无法找到任何可用课程，返回课程列表页面');
            setTimeout(() => {
                // 使用历史记录返回，避免直接跳转到myCourses.asp
                history.back();
            }, 1000);
        }
        
        // 记录当前URL
        window.lastJumpAttemptUrl = window.location.href;
    }
    
    // 在播放列表中查找任何可用的课程
    function findAnyAvailableCourseInPlaylist() {
        logJumpInfo('尝试在播放列表中查找任何可用的课程');
        
        // 如果播放列表为空，尝试重新加载
        if (!playlist || playlist.length === 0) {
            logJumpInfo('播放列表为空，尝试重新加载');
            loadPlaylist();
            
            // 如果仍然为空，返回null
            if (!playlist || playlist.length === 0) {
                logJumpInfo('重新加载后播放列表仍为空');
                return null;
            }
        }
        
        // 获取当前URL
        const currentUrl = window.location.href;
        
        // 查找当前URL在播放列表中的索引
        let currentIndex = -1;
        for (let i = 0; i < playlist.length; i++) {
            if (isSameUrl(playlist[i].url, currentUrl)) {
                currentIndex = i;
                break;
            }
        }
        
        // 如果找到当前URL，优先返回下一个URL
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            return playlist[currentIndex + 1].url;
        }
        
        // 如果没有找到当前URL或当前URL是最后一个，返回第一个URL
        if (playlist.length > 0) {
            // 避免返回当前URL
            for (let i = 0; i < playlist.length; i++) {
                if (!isSameUrl(playlist[i].url, currentUrl)) {
                    return playlist[i].url;
                }
            }
        }
        
        // 如果实在找不到任何可用的课程，返回null
        return null;
    }
    
    // 跳转到下一课程
    function jumpToNextCourse() {
        logJumpInfo('开始跳转到下一课程');
        
        // 尝试跳转
        try {
            // 方法1：使用下一章节链接
            const nextChapterLink = getNextChapterLink();
            if (nextChapterLink) {
                logJumpInfo(`方法1：跳转到下一章节: ${nextChapterLink}`);
                
                // 使用setTimeout确保日志记录完成
                setTimeout(() => {
                    window.location.href = nextChapterLink;
                }, 100);
                return;
            }
            
            // 方法2：使用播放列表中的下一个课程
            const nextCourseInPlaylist = getNextCourseInPlaylist();
            if (nextCourseInPlaylist) {
                logJumpInfo(`方法2：跳转到播放列表中的下一个课程: ${nextCourseInPlaylist}`);
                
                // 使用setTimeout确保日志记录完成
                setTimeout(() => {
                    window.location.href = nextCourseInPlaylist;
                }, 100);
                return;
            }
            
            // 方法3：使用DOM操作点击下一课程链接
            if (clickNextCourseLink()) {
                logJumpInfo('方法3：通过点击下一课程链接跳转');
                return;
            }
            
            // 方法4：使用历史记录返回并刷新
            logJumpInfo('方法4：使用历史记录返回并刷新');
            setTimeout(() => {
                history.back();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }, 100);
        } catch (e) {
            logJumpInfo(`跳转失败: ${e.message}`);
            
            // 失败后尝试其他方法
            logJumpInfo(`跳转失败: ${e.message}`);
            
            // 尝试从播放列表中找到任何可用的课程
            const anyAvailableCourse = findAnyAvailableCourseInPlaylist();
            if (anyAvailableCourse) {
                logJumpInfo(`找到播放列表中的可用课程: ${anyAvailableCourse}`);
                setTimeout(() => {
                    window.location.href = anyAvailableCourse;
                }, 1000);
                return;
            }
            
            // 如果实在找不到任何课程，才尝试返回上一页
            logJumpInfo('无法找到任何可用课程，返回上一页');
            setTimeout(() => {
                history.back();
            }, 1000);
        }
    }
    
    // 通过DOM操作点击下一课程链接
    function clickNextCourseLink() {
        try {
            // 尝试查找各种可能的"下一课程"链接
            const nextLinkSelectors = [
                'a.next-course', 
                'a.next', 
                'a:contains("下一课程")', 
                'a:contains("下一章节")',
                '.ui-bxkc li.current + li a',
                '.course-list li.active + li a'
            ];
            
            for (const selector of nextLinkSelectors) {
                const links = document.querySelectorAll(selector);
                if (links.length > 0) {
                    logJumpInfo(`找到下一课程链接: ${selector}`);
                    links[0].click();
                    return true;
                }
            }
            
            return false;
        } catch (e) {
            logJumpInfo(`点击下一课程链接失败: ${e.message}`);
            return false;
        }
    }
    
    // 获取下一章节链接
    function getNextChapterLink() {
        try {
            // 尝试查找各种可能的章节链接
            const chapterLinkSelectors = [
                '.ui-bxkc li a',
                '.course-list li a',
                '.chapter-list li a',
                '#chapterList li a',
                '#cc li a'
            ];
            
            // 获取当前URL
            const currentUrl = window.location.href;
            
            // 查找所有章节链接
            let allChapterLinks = [];
            for (const selector of chapterLinkSelectors) {
                const links = document.querySelectorAll(selector);
                if (links.length > 0) {
                    allChapterLinks = Array.from(links);
                    break;
                }
            }
            
            // 如果没有找到章节链接，返回null
            if (allChapterLinks.length === 0) {
                return null;
            }
            
            // 查找当前章节的索引
            let currentIndex = -1;
            for (let i = 0; i < allChapterLinks.length; i++) {
                if (isSameUrl(allChapterLinks[i].href, currentUrl)) {
                    currentIndex = i;
                    break;
                }
            }
            
            // 如果找到当前章节，返回下一章节的链接
            if (currentIndex !== -1 && currentIndex < allChapterLinks.length - 1) {
                return allChapterLinks[currentIndex + 1].href;
            }
            
            return null;
        } catch (e) {
            logJumpInfo(`获取下一章节链接失败: ${e.message}`);
            return null;
        }
    }
    
    // 获取播放列表中的下一个课程
    function getNextCourseInPlaylist() {
        logJumpInfo('查找播放列表中的下一个课程');
        
        // 如果播放列表为空，尝试重新加载
        if (!playlist || playlist.length === 0) {
            logJumpInfo('播放列表为空，尝试重新加载');
            loadPlaylist();
            
            // 如果仍然为空，返回null
            if (!playlist || playlist.length === 0) {
                logJumpInfo('重新加载后播放列表仍为空');
                return null;
            }
        }
        
        // 获取当前URL
        const currentUrl = window.location.href;
        logJumpInfo(`当前URL: ${currentUrl}`);
        
        // 查找当前URL在播放列表中的索引
        let currentIndex = -1;
        
        // 方法1：完整URL匹配
        for (let i = 0; i < playlist.length; i++) {
            if (isSameUrl(playlist[i].url, currentUrl)) {
                currentIndex = i;
                logJumpInfo(`方法1：在播放列表中找到当前URL，索引: ${currentIndex}`);
                break;
            }
        }
        
        // 方法2：简化URL匹配（忽略查询参数）
        if (currentIndex === -1) {
            const simplifiedCurrentUrl = currentUrl.split('?')[0];
            for (let i = 0; i < playlist.length; i++) {
                const simplifiedPlaylistUrl = playlist[i].url.split('?')[0];
                if (simplifiedCurrentUrl === simplifiedPlaylistUrl) {
                    currentIndex = i;
                    logJumpInfo(`方法2：在播放列表中找到当前URL（简化匹配），索引: ${currentIndex}`);
                    break;
                }
            }
        }
        
        // 方法3：ID参数匹配
        if (currentIndex === -1) {
            const currentIdMatch = currentUrl.match(/[?&]id=(\d+)/);
            const currentGcidMatch = currentUrl.match(/[?&]gcid=(\d+)/);
            
            if (currentIdMatch || currentGcidMatch) {
                const currentId = currentIdMatch ? currentIdMatch[1] : null;
                const currentGcid = currentGcidMatch ? currentGcidMatch[1] : null;
                
                for (let i = 0; i < playlist.length; i++) {
                    const playlistUrl = playlist[i].url;
                    const playlistIdMatch = playlistUrl.match(/[?&]id=(\d+)/);
                    const playlistGcidMatch = playlistUrl.match(/[?&]gcid=(\d+)/);
                    
                    const playlistId = playlistIdMatch ? playlistIdMatch[1] : null;
                    const playlistGcid = playlistGcidMatch ? playlistGcidMatch[1] : null;
                    
                    if ((currentId && playlistId && currentId === playlistId) ||
                        (currentGcid && playlistGcid && currentGcid === playlistGcid)) {
                        currentIndex = i;
                        logJumpInfo(`方法3：在播放列表中找到当前URL（ID参数匹配），索引: ${currentIndex}`);
                        break;
                    }
                }
            }
        }
        
        // 如果找到当前URL，返回下一个URL
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            const nextUrl = playlist[currentIndex + 1].url;
            logJumpInfo(`找到下一个课程URL: ${nextUrl}`);
            return nextUrl;
        }
        
        logJumpInfo('在播放列表中没有找到下一个课程');
        return null;
    }
    
    // 判断两个URL是否相同
    function isSameUrl(url1, url2) {
        // 如果完全相同，直接返回true
        if (url1 === url2) {
            return true;
        }
        
        try {
            // 解析URL
            const parsedUrl1 = new URL(url1);
            const parsedUrl2 = new URL(url2);
            
            // 比较主机名和路径
            if (parsedUrl1.hostname !== parsedUrl2.hostname || 
                parsedUrl1.pathname !== parsedUrl2.pathname) {
                return false;
            }
            
            // 提取查询参数
            const params1 = new URLSearchParams(parsedUrl1.search);
            const params2 = new URLSearchParams(parsedUrl2.search);
            
            // 比较关键参数（id和gcid）
            const id1 = params1.get('id');
            const id2 = params2.get('id');
            const gcid1 = params1.get('gcid');
            const gcid2 = params2.get('gcid');
            
            // 如果两个URL都有id参数，比较id
            if (id1 && id2) {
                return id1 === id2;
            }
            
            // 如果两个URL都有gcid参数，比较gcid
            if (gcid1 && gcid2) {
                return gcid1 === gcid2;
            }
            
            // 如果没有关键参数，比较整个查询字符串
            return parsedUrl1.search === parsedUrl2.search;
        } catch (e) {
            // 如果URL解析失败，回退到简单比较
            return url1.split('?')[0] === url2.split('?')[0];
        }
    }
    
    // 初始化
    init();
})();

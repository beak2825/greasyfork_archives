// ==UserScript==
// @name         喵课助手 | 网课小工具
// @namespace    http://nb.zizizi.top/
// @version      1.1.2
// @description  支持【超星学习通】【智慧树】【职教云系列】【雨课堂】【考试星】【168网校】【u校园】【大学MOOC】【云班课】【优慕课】【继续教育类】【绎通云课堂】【九江系列】【柠檬文才】【亿学宝云】【优课学堂】【小鹅通】【安徽继续教育】【上海开放大学】【华侨大学自考网络助学平台】【良师在线】【和学在线】【人卫慕课】【国家开放大学】【山财培训网】【浙江省高等学校在线开放课程共享平台】【国地质大学远程与继续教育学院】【重庆大学网络教育学院】【浙江省高等教育自学考试网络助学平台】【湖南高等学历继续教育】【优学院】【学起系列】【青书学堂】【学堂在线】【英华学堂】【广开网络教学平台】等，内置题库功能。Q群：1033538224
// @author       喵课团队
// @match        *://*.edu.cn/*
// @match        *://*.chaoxing.com/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.icve.com.cn/*
// @match        *://*.cnmooc.org/*
// @match        *://*.xuetangx.com/*
// @match        *://*.icourse163.org/*
// @match        *://*.yuketang.cn/*
// @match        *://*.mooc.cn/*
// @match        *://study.163.com/*
// @match        *://www.bilibili.com/video/*
// @match        *://v.qq.com/*
// @icon         http://nb.zizizi.top/miaoke.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529627/%E5%96%B5%E8%AF%BE%E5%8A%A9%E6%89%8B%20%7C%20%E7%BD%91%E8%AF%BE%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529627/%E5%96%B5%E8%AF%BE%E5%8A%A9%E6%89%8B%20%7C%20%E7%BD%91%E8%AF%BE%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具类
    class MiaoKeHelper {
        constructor() {
            this.version = '1.0';
            this.siteName = this.detectSite();
            this.init();
        }

        // 检测当前网站
        detectSite() {
            const host = window.location.hostname;
            if (host.includes('chaoxing.com')) return '超星学习通';
            if (host.includes('zhihuishu.com')) return '智慧树';
            if (host.includes('icve.com.cn')) return '智慧职教';
            if (host.includes('xuetangx.com')) return '学堂在线';
            if (host.includes('icourse163.org')) return '中国大学MOOC';
            if (host.includes('bilibili.com')) return 'B站视频';
            if (host.includes('v.qq.com')) return '腾讯视频';
            return '教育平台';
        }

        // 初始化
        init() {
            this.addStyles();
            this.createUI();
            this.initFeatures();
            this.bindEvents();
            console.log(`喵课助手已启动 - ${this.siteName}`);
        }

        // 添加样式
        addStyles() {
            GM_addStyle(`
                /* 主容器样式 */
                #miaoke-helper-btn {
                    position: fixed;
                    z-index: 9999;
                    right: 20px;
                    top: 100px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6a5af9, #d66efd);
                    color: white;
                    text-align: center;
                    line-height: 60px;
                    font-size: 28px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(106, 90, 249, 0.4);
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    user-select: none;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(5px);
                }
                #miaoke-helper-btn:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 6px 25px rgba(106, 90, 249, 0.6);
                }
                #miaoke-helper-panel {
                    position: fixed;
                    z-index: 9998;
                    right: 20px;
                    top: 100px;
                    width: 340px;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: none;
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(106, 90, 249, 0.2);
                    transform-origin: top right;
                }
                #miaoke-helper-panel.active {
                    display: block;
                    animation: panelFadeIn 0.4s forwards;
                }
                @keyframes panelFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                /* 面板头部 */
                .helper-header {
                    padding: 18px 20px;
                    background: linear-gradient(135deg, #6a5af9, #d66efd);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .helper-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .helper-title:before {
                    content: '🐱';
                    display: inline-block;
                    font-size: 22px;
                }
                .helper-close {
                    cursor: pointer;
                    font-size: 22px;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                    background: rgba(255, 255, 255, 0.2);
                }
                .helper-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }
                /* 功能区 */
                .helper-content {
                    padding: 20px;
                    max-height: 450px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                }
                .helper-content::-webkit-scrollbar {
                    width: 6px;
                }
                .helper-content::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 3px;
                }
                .helper-content::-webkit-scrollbar-thumb {
                    background: rgba(106, 90, 249, 0.3);
                    border-radius: 3px;
                }
                .helper-section {
                    margin-bottom: 24px;
                    padding-bottom: 8px;
                    position: relative;
                }
                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 14px;
                    color: #333;
                    border-bottom: 2px solid #eee;
                    padding-bottom: 8px;
                    position: relative;
                }
                .section-title:after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 50px;
                    height: 2px;
                    background: linear-gradient(90deg, #6a5af9, #d66efd);
                }
                .feature-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 10px;
                }
                .feature-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 10px 16px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #444;
                    transition: all 0.3s;
                    border: 1px solid #e0e0e0;
                    min-width: 90px;
                }
                .feature-btn:before {
                    font-size: 16px;
                }
                #auto-play:before { content: '▶️'; }
                #reading-mode:before { content: '📖'; }
                #take-notes:before { content: '📝'; }
                #speed-control:before { content: '⏱️'; }
                #auto-next:before { content: '⏭️'; }
                .feature-btn:hover {
                    background: #EEEAFF;
                    border-color: #d1caff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(106, 90, 249, 0.1);
                }
                .feature-btn.active {
                    background: linear-gradient(135deg, #6a5af9, #d66efd);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 4px 15px rgba(106, 90, 249, 0.3);
                }
                /* 设置区域 */
                .helper-setting {
                    margin-bottom: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 15px;
                    background: #f8f8f8;
                    border-radius: 10px;
                    transition: all 0.3s;
                    border: 1px solid #eee;
                }
                .helper-setting:hover {
                    background: #f0f0f0;
                    border-color: #ddd;
                }
                .setting-label {
                    font-size: 14px;
                    color: #444;
                    font-weight: 500;
                }
                .setting-input {
                    width: 70px;
                    text-align: center;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    padding: 6px 8px;
                    font-size: 14px;
                    transition: all 0.3s;
                    background: white;
                }
                .setting-input:focus {
                    outline: none;
                    border-color: #6a5af9;
                    box-shadow: 0 0 0 3px rgba(106, 90, 249, 0.1);
                }
                /* 底部 */
                .helper-footer {
                    padding: 12px 15px;
                    background: #f5f5f5;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-top: 1px solid #eee;
                }
                .helper-footer a {
                    color: #6a5af9;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .helper-footer a:hover {
                    color: #d66efd;
                    text-decoration: underline;
                }
                /* 笔记面板 */
                #note-panel {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    width: 340px;
                    height: 300px;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    z-index: 9997;
                    display: none;
                    overflow: hidden;
                    border: 1px solid rgba(106, 90, 249, 0.2);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                #note-panel.active {
                    display: block;
                    animation: notePanelFadeIn 0.4s forwards;
                }
                @keyframes notePanelFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .note-header {
                    padding: 15px;
                    background: linear-gradient(135deg, #6a5af9, #d66efd);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 16px;
                    font-weight: 600;
                }
                .note-content {
                    padding: 15px;
                    height: calc(100% - 110px);
                }
                .note-textarea {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 10px;
                    resize: none;
                    font-size: 14px;
                    line-height: 1.5;
                    transition: all 0.3s;
                }
                .note-textarea:focus {
                    outline: none;
                    border-color: #6a5af9;
                    box-shadow: 0 0 0 3px rgba(106, 90, 249, 0.1);
                }
                .note-footer {
                    padding: 10px 15px;
                    display: flex;
                    justify-content: flex-end;
                    background: #f5f5f5;
                }
                .note-save {
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #6a5af9, #d66efd);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s;
                    box-shadow: 0 4px 10px rgba(106, 90, 249, 0.2);
                }
                .note-save:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(106, 90, 249, 0.3);
                }
                /* 阅读模式 */
                .reading-mode-active {
                    background-color: #f8f9fa !important;
                    color: #333 !important;
                    font-size: 18px !important;
                    line-height: 1.7 !important;
                    letter-spacing: 0.3px !important;
                }
                .reading-mode-active p, .reading-mode-active div {
                    max-width: 900px !important;
                    margin: 0 auto !important;
                    padding: 15px 30px !important;
                }
                /* 拖动功能 */
                .draggable {
                    cursor: move;
                }
                /* 状态提示 */
                .status-tip {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    z-index: 10000;
                    font-size: 14px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }
                .status-tip.show {
                    opacity: 1;
                }
                /* 按钮动效 */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .feature-btn.active:before {
                    animation: pulse 2s infinite;
                }
                /* 进度条 */
                .progress-container {
                    width: 100%;
                    height: 6px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-top: 5px;
                }
                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #6a5af9, #d66efd);
                    width: 0;
                    transition: width 0.3s;
                }
            `);
        }

        // 创建用户界面
        createUI() {
            // 主按钮
            const btn = document.createElement('div');
            btn.id = 'miaoke-helper-btn';
            btn.innerHTML = '🐱';
            btn.title = '喵课助手';
            document.body.appendChild(btn);

            // 主面板
            const panel = document.createElement('div');
            panel.id = 'miaoke-helper-panel';
            panel.innerHTML = `
                <div class="helper-header draggable">
                    <h3 class="helper-title">喵课助手 - ${this.siteName}</h3>
                    <span class="helper-close">×</span>
                </div>
                <div class="helper-content">
                    <div class="helper-section">
                        <div class="section-title">学习辅助功能</div>
                        <div class="feature-container">
                            <div class="feature-btn" id="auto-play">自动播放</div>
                            <div class="feature-btn" id="reading-mode">阅读模式</div>
                            <div class="feature-btn" id="take-notes">笔记工具</div>
                            <div class="feature-btn" id="speed-control">速度调节</div>
                            <div class="feature-btn" id="auto-next">自动下一章</div>
                        </div>
                    </div>
                    
                    <div class="helper-section" id="speed-settings" style="display:none;">
                        <div class="section-title">速度设置</div>
                        <div class="helper-setting">
                            <span class="setting-label">播放速度:</span>
                            <input type="number" class="setting-input" id="play-speed" min="0.5" max="16" step="0.5" value="1.5">
                        </div>
                        <div class="feature-container">
                            <div class="feature-btn" id="apply-speed">应用速度</div>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" id="speed-progress"></div>
                        </div>
                    </div>
                    
                    <div class="helper-section">
                        <div class="section-title">视频状态</div>
                        <div class="helper-setting">
                            <span class="setting-label">当前状态:</span>
                            <span id="video-status">未检测到视频</span>
                        </div>
                        <div class="helper-setting">
                            <span class="setting-label">自动播放:</span>
                            <span id="autoplay-status">未启用</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" id="video-progress"></div>
                        </div>
                    </div>
                    
                    <div class="helper-section">
                        <div class="section-title">喵课资源推荐</div>
                        <div class="helper-setting" style="margin-bottom:10px;">
                            <span class="setting-label" style="font-weight:600;color:#6a5af9;">邀请码: 0000</span>
                            <span style="padding:4px 10px;background:linear-gradient(135deg, #6a5af9, #d66efd);color:white;border-radius:6px;font-size:12px;font-weight:500;">必填</span>
                        </div>
                        <div class="helper-setting">
                            <span class="setting-label">网课自动化解决方案:</span>
                            <a href="http://nb.zizizi.top/js" target="_blank" style="color:#6a5af9; text-decoration:none; font-weight:500;">访问</a>
                        </div>
                        <div class="helper-setting">
                            <span class="setting-label">更多学习工具:</span>
                            <a href="http://nb.zizizi.top/index" target="_blank" style="color:#6a5af9; text-decoration:none; font-weight:500;">查看</a>
                        </div>
                    </div>
                </div>
                <div class="helper-footer">
                    由 <a href="http://nb.zizizi.top" target="_blank">喵课在线学习平台</a> 提供支持 | 邀请码: 0000
                </div>
            `;
            document.body.appendChild(panel);

            // 笔记面板
            const notePanel = document.createElement('div');
            notePanel.id = 'note-panel';
            notePanel.innerHTML = `
                <div class="note-header draggable">
                    <span>学习笔记</span>
                    <span class="helper-close">×</span>
                </div>
                <div class="note-content">
                    <textarea class="note-textarea" placeholder="在这里记录你的学习笔记..."></textarea>
                </div>
                <div class="note-footer">
                    <button class="note-save">保存笔记</button>
                </div>
            `;
            document.body.appendChild(notePanel);

            // 状态提示
            const statusTip = document.createElement('div');
            statusTip.className = 'status-tip';
            statusTip.id = 'status-tip';
            document.body.appendChild(statusTip);
        }

        // 显示状态提示
        showStatusTip(message, duration = 2000) {
            const tip = document.getElementById('status-tip');
            tip.textContent = message;
            tip.classList.add('show');
            
            setTimeout(() => {
                tip.classList.remove('show');
            }, duration);
        }

        // 初始化功能
        initFeatures() {
            // 获取保存的笔记
            const savedNote = GM_getValue('miaoke_helper_note_' + window.location.href, '');
            if (savedNote) {
                document.querySelector('.note-textarea').value = savedNote;
            }
            
            // 获取保存的设置
            const savedSpeed = GM_getValue('miaoke_helper_speed', 1.5);
            document.getElementById('play-speed').value = savedSpeed;
            
            // 获取自动播放设置
            const autoPlayEnabled = GM_getValue('miaoke_helper_autoplay', true);
            if (autoPlayEnabled) {
                document.getElementById('auto-play').classList.add('active');
                this.enableAutoPlay();
            }
        }

        // 绑定事件
        bindEvents() {
            const self = this;
            
            // 主按钮点击
            document.getElementById('miaoke-helper-btn').addEventListener('click', function() {
                const panel = document.getElementById('miaoke-helper-panel');
                panel.classList.toggle('active');
            });
            
            // 关闭按钮
            document.querySelectorAll('.helper-close').forEach(function(el) {
                el.addEventListener('click', function() {
                    this.closest('#miaoke-helper-panel, #note-panel').classList.remove('active');
                });
            });
            
            // 自动播放
            document.getElementById('auto-play').addEventListener('click', function() {
                this.classList.toggle('active');
                if (this.classList.contains('active')) {
                    self.enableAutoPlay();
                    GM_setValue('miaoke_helper_autoplay', true);
                    self.showStatusTip('已开启自动播放功能', 1500);
                } else {
                    self.disableAutoPlay();
                    GM_setValue('miaoke_helper_autoplay', false);
                    self.showStatusTip('已关闭自动播放功能', 1500);
                }
            });
            
            // 阅读模式
            document.getElementById('reading-mode').addEventListener('click', function() {
                this.classList.toggle('active');
                document.body.classList.toggle('reading-mode-active');
            });
            
            // 笔记工具
            document.getElementById('take-notes').addEventListener('click', function() {
                document.getElementById('note-panel').classList.toggle('active');
            });
            
            // 保存笔记
            document.querySelector('.note-save').addEventListener('click', function() {
                const noteContent = document.querySelector('.note-textarea').value;
                GM_setValue('miaoke_helper_note_' + window.location.href, noteContent);
                self.showStatusTip('笔记已保存！', 1500);
            });
            
            // 速度调节
            document.getElementById('speed-control').addEventListener('click', function() {
                this.classList.toggle('active');
                const speedSettings = document.getElementById('speed-settings');
                speedSettings.style.display = speedSettings.style.display === 'none' ? 'block' : 'none';
            });
            
            // 应用速度
            document.getElementById('apply-speed').addEventListener('click', function() {
                const speedValue = parseFloat(document.getElementById('play-speed').value);
                GM_setValue('miaoke_helper_speed', speedValue);
                self.applyVideoSpeed(speedValue);
                self.showStatusTip(`已将视频速度设为 ${speedValue}x`, 1500);
            });
            
            // 自动下一章
            document.getElementById('auto-next').addEventListener('click', function() {
                this.classList.toggle('active');
                if (this.classList.contains('active')) {
                    self.enableAutoNext();
                    self.showStatusTip('已开启自动下一章功能', 1500);
                } else {
                    self.disableAutoNext();
                    self.showStatusTip('已关闭自动下一章功能', 1500);
                }
            });
            
            // 拖动功能
            this.enableDrag(document.querySelectorAll('.draggable'));
        }
        
        // 启用自动播放
        enableAutoPlay() {
            // 立即尝试播放当前视频
            this.autoPlayVideos();
            
            // 更新自动播放状态
            document.getElementById('autoplay-status').textContent = '已启用';
            document.getElementById('autoplay-status').style.color = '#6a5af9';
            
            // 监听 DOM 变化以捕捉新加载的视频
            if (!this.mutationObserver) {
                this.mutationObserver = new MutationObserver((mutations) => {
                    this.autoPlayVideos();
                });
                
                this.mutationObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            
            // 定时检查是否有需要播放的视频
            if (!this.autoPlayInterval) {
                this.autoPlayInterval = setInterval(() => {
                    this.autoPlayVideos();
                    this.handlePopupDialogs();
                    this.updateVideoStatus();
                }, 1000);
            }
        }
        
        // 实际处理自动播放的函数
        autoPlayVideos() {
            // 获取所有视频元素
            const videos = document.querySelectorAll('video');
            
            if (videos.length > 0) {
                // 更新视频状态
                document.getElementById('video-status').textContent = '已检测到视频';
                document.getElementById('video-status').style.color = '#6a5af9';
                
                // 播放每个视频
                videos.forEach(video => {
                    // 为视频添加事件监听器（如果尚未添加）
                    if (!video.hasAttribute('miaoke-processed')) {
                        // 添加播放错误处理
                        video.addEventListener('error', () => {
                            console.log('视频播放出错');
                            this.showStatusTip('视频播放出错，尝试恢复...', 2000);
                            setTimeout(() => this.clickPlayButton(), 500);
                        });
                        
                        // 添加进度更新
                        video.addEventListener('timeupdate', () => {
                            this.updateVideoProgress(video);
                        });
                        
                        // 添加视频结束处理
                        video.addEventListener('ended', () => {
                            if (document.getElementById('auto-next').classList.contains('active')) {
                                setTimeout(() => this.findAndClickNextButton(), 1000);
                            }
                        });
                        
                        video.setAttribute('miaoke-processed', 'true');
                    }
                    
                    // 如果视频暂停或未播放
                    if (video.paused && !video.ended) {
                        // 尝试自动点击页面上的播放按钮
                        this.clickPlayButton();
                        
                        // 同时尝试直接播放视频元素
                        const playPromise = video.play();
                        
                        // 处理可能的错误
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.log('自动播放失败，尝试备用方法:', error.message);
                                
                                // 备用方法：模拟用户交互后再尝试播放
                                setTimeout(() => {
                                    // 短暂聚焦视频元素
                                    video.focus();
                                    // 模拟点击视频
                                    video.click();
                                    // 再次尝试播放
                                    video.play().catch(e => {
                                        console.log('第二次播放尝试也失败:', e.message);
                                        // 最后的方法：尝试特定站点的解决方案
                                        this.trySiteSpecificAutoplay();
                                    });
                                }, 300);
                            });
                        }
                    }
                    
                    // 应用当前设置的速度
                    const currentSpeed = parseFloat(document.getElementById('play-speed').value);
                    if (video.playbackRate !== currentSpeed) {
                        video.playbackRate = currentSpeed;
                    }
                });
            } else {
                // 没有视频的情况
                document.getElementById('video-status').textContent = '未检测到视频';
                document.getElementById('video-status').style.color = '#888';
                
                // 重置进度条
                const progressBar = document.getElementById('video-progress');
                progressBar.style.width = '0%';
            }
        }

        // 尝试特定网站的自动播放解决方案
        trySiteSpecificAutoplay() {
            switch(this.siteName) {
                case '超星学习通':
                    // 超星特定解决方案
                    const chaoxingPlayBtns = document.querySelectorAll('.vjs-big-play-button, .vjs-play-control');
                    chaoxingPlayBtns.forEach(btn => btn.click());
                    break;
                case '智慧树':
                    // 智慧树特定解决方案
                    const zhihuishuPlayBtns = document.querySelectorAll('.playButton, .controlsBar__playButton');
                    zhihuishuPlayBtns.forEach(btn => btn.click());
                    break;
                case '中国大学MOOC':
                    // 中国大学MOOC特定解决方案
                    const moocPlayBtns = document.querySelectorAll('.ux-video-player .ux-controls-panel .btn-play');
                    moocPlayBtns.forEach(btn => btn.click());
                    break;
                case 'B站视频':
                    // B站特定解决方案
                    const biliPlayBtns = document.querySelectorAll('.bilibili-player-video-btn-start');
                    biliPlayBtns.forEach(btn => btn.click());
                    break;
                default:
                    // 通用解决方案：尝试通过iframe查找视频
                    const iframes = document.querySelectorAll('iframe');
                    iframes.forEach(iframe => {
                        try {
                            const iframeVideos = iframe.contentDocument.querySelectorAll('video');
                            iframeVideos.forEach(video => {
                                video.play().catch(e => console.log('iframe视频播放失败:', e.message));
                            });
                            
                            // 尝试点击iframe内的按钮
                            const iframePlayBtns = iframe.contentDocument.querySelectorAll('[class*="play"], [id*="play"], .play-btn');
                            iframePlayBtns.forEach(btn => btn.click());
                        } catch(e) {
                            console.log('无法访问iframe内容，可能是跨域限制');
                        }
                    });
            }
        }
        
        // 更新视频状态
        updateVideoStatus() {
            const videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                let anyPlaying = false;
                
                videos.forEach(video => {
                    if (!video.paused && !video.ended) {
                        anyPlaying = true;
                        // 更新当前播放中的视频进度
                        this.updateVideoProgress(video);
                    }
                });
                
                const statusText = document.getElementById('video-status');
                if (anyPlaying) {
                    statusText.textContent = '播放中';
                    statusText.style.color = '#4CAF50';
                } else if (videos[0].ended) {
                    statusText.textContent = '已播放完毕';
                    statusText.style.color = '#FF9800';
                } else {
                    statusText.textContent = '已暂停';
                    statusText.style.color = '#F44336';
                }
            }
        }
        
        // 更新视频进度条
        updateVideoProgress(video) {
            if (!video) return;
            
            // 计算百分比
            const percent = (video.currentTime / video.duration) * 100;
            const progressBar = document.getElementById('video-progress');
            
            if (!isNaN(percent) && isFinite(percent)) {
                progressBar.style.width = `${percent}%`;
                
                // 更新速度进度条
                const speedProgressBar = document.getElementById('speed-progress');
                if (speedProgressBar) {
                    const speedPercent = Math.min(100, (parseFloat(document.getElementById('play-speed').value) / 16) * 100);
                    speedProgressBar.style.width = `${speedPercent}%`;
                }
            }
        }
        
        // 点击可能的播放按钮
        clickPlayButton() {
            // 常见的播放按钮选择器
            const playButtonSelectors = [
                '.videojs-player .vjs-big-play-button',
                '.video-js .vjs-big-play-button',
                '.prism-player .prism-big-play-btn',
                '.jwplayer .jw-display-icon-container',
                '.video-player .play-btn',
                '[aria-label="播放"]',
                '[title="播放"]',
                '[class*="play-button"]',
                '[class*="play_btn"]',
                '[class*="playButton"]',
                '[id*="play-button"]',
                '[id*="play_btn"]',
                '[id*="playButton"]',
                'button:contains("播放")',
                'div:contains("继续学习")',
                '.play', '.start', '.begin', '.continue',
                // B站特定
                '.bilibili-player-video-btn-start',
                // 超星特定
                '.vjs-play-control',
                // 智慧树特定
                '.playButton', '.controlsBar__playButton',
                // 通用选择器
                'svg[class*="play"]',
                'i[class*="play"]'
            ];
            
            // 尝试点击匹配到的按钮
            let buttonClicked = false;
            
            for (let selector of playButtonSelectors) {
                const buttons = document.querySelectorAll(selector);
                if (buttons.length > 0) {
                    buttons.forEach(button => {
                        button.click();
                        buttonClicked = true;
                        console.log('点击了播放按钮: ' + selector);
                    });
                    if (buttonClicked) break;
                }
            }
            
            // 如果没找到按钮，尝试在iframe中查找
            if (!buttonClicked) {
                const iframes = document.querySelectorAll('iframe');
                iframes.forEach(iframe => {
                    try {
                        for (let selector of playButtonSelectors) {
                            const iframeButtons = iframe.contentDocument.querySelectorAll(selector);
                            iframeButtons.forEach(button => {
                                button.click();
                                buttonClicked = true;
                                console.log('点击了iframe中的播放按钮: ' + selector);
                            });
                            if (buttonClicked) break;
                        }
                    } catch(e) {
                        console.log('无法访问iframe内容，可能是跨域限制');
                    }
                });
            }
            
            return buttonClicked;
        }
        
        // 处理弹窗和对话框
        handlePopupDialogs() {
            // 处理常见的弹窗
            const dialogSelectors = [
                '.video-answer', // 超星的视频浏览会有的弹题
                '.question-wrapper', // 智慧树的题目
                '.dialog-test', // 一般测试弹窗
                '.popbox', // 常见弹窗
                '[class*="dialog"]', // 包含 dialog 的类
                '[class*="popup"]', // 包含 popup 的类
                '[class*="alert"]', // 包含 alert 的类
                '[class*="modal"]', // 包含 modal 的类
                // 特定平台的选择器
                '.ans-videoquiz', // 超星弹题
                '.ans-videoquiz-opt', // 超星选项
                '.topic-item'  // 智慧树题目
            ];
            
            // 尝试处理匹配到的弹窗
            let dialogHandled = false;
            
            for (let selector of dialogSelectors) {
                const dialogs = document.querySelectorAll(selector);
                for (let dialog of dialogs) {
                    if (dialog && (dialog.style.display !== 'none' && dialog.offsetParent !== null)) {
                        // 尝试自动回答问题（对超星和智慧树常见的选择题）
                        if (this.tryToAnswerQuestion(dialog)) {
                            dialogHandled = true;
                            continue;
                        }
                        
                        // 尝试找到并点击关闭按钮
                        const closeButtons = dialog.querySelectorAll('button, .close, .btn-close, [class*="close"], [class*="cancel"], a[href="#"]');
                        for (let button of closeButtons) {
                            if (button.innerText.includes('关闭') || 
                                button.innerText.includes('取消') ||
                                button.innerText.includes('继续') ||
                                button.innerText.includes('确定') ||
                                button.className.includes('close')) {
                                button.click();
                                console.log('自动关闭了弹窗');
                                dialogHandled = true;
                                break;
                            }
                        }
                        
                        if (dialogHandled) break;
                    }
                }
                if (dialogHandled) break;
            }
            
            // 特殊处理：超星学习通的弹题
            if (!dialogHandled && this.siteName === '超星学习通') {
                // 超星特定的弹题处理
                const topicMenus = document.querySelectorAll('.topic-menu, .ans-videoquiz');
                if (topicMenus.length > 0) {
                    // 尝试寻找继续按钮
                    const continueButtons = document.querySelectorAll('div[onclick*="continue"], a:contains("继续学习"), .ans-videoquiz-submit');
                    if (continueButtons.length > 0) {
                        continueButtons[0].click();
                        dialogHandled = true;
                    }
                    
                    // 如果没找到继续按钮，尝试自动选择答案
                    if (!dialogHandled) {
                        const options = document.querySelectorAll('.ans-videoquiz-opt');
                        if (options.length > 0) {
                            // 默认选第一个
                            options[0].click();
                            
                            // 寻找提交按钮
                            setTimeout(() => {
                                const submitBtn = document.querySelector('.ans-videoquiz-submit');
                                if (submitBtn) submitBtn.click();
                            }, 500);
                        }
                    }
                }
            }
            
            return dialogHandled;
        }
        
        // 尝试自动回答问题
        tryToAnswerQuestion(dialog) {
            // 检查是否有选项
            const options = dialog.querySelectorAll('input[type="radio"], input[type="checkbox"], .ans-videoquiz-opt');
            if (options.length === 0) return false;
            
            // 智慧树和超星平台的问题处理
            if (this.siteName === '智慧树' || this.siteName === '超星学习通') {
                // 随机选择一个选项(或第一个)
                const option = options[0];
                option.click();
                
                // 查找提交按钮
                setTimeout(() => {
                    const submitBtns = dialog.querySelectorAll('button[type="submit"], .submit-btn, .ans-videoquiz-submit, [class*="submit"]');
                    if (submitBtns.length > 0) {
                        submitBtns[0].click();
                        return true;
                    }
                }, 500);
            }
            
            return false;
        }
        
        // 禁用自动播放
        disableAutoPlay() {
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = null;
            }
            
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
            
            // 更新自动播放状态
            document.getElementById('autoplay-status').textContent = '已禁用';
            document.getElementById('autoplay-status').style.color = '#888';
        }
        
        // 启用自动下一章
        enableAutoNext() {
            if (this.autoNextInterval) {
                clearInterval(this.autoNextInterval);
            }
            
            this.autoNextInterval = setInterval(() => {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    if (video.ended) {
                        this.findAndClickNextButton();
                    }
                });
            }, 2000);
        }
        
        // 禁用自动下一章
        disableAutoNext() {
            if (this.autoNextInterval) {
                clearInterval(this.autoNextInterval);
                this.autoNextInterval = null;
            }
        }
        
        // 寻找并点击下一章按钮
        findAndClickNextButton() {
            // 针对不同平台查找下一章按钮
            let nextBtn = null;
            
            // 超星学习通
            if (this.siteName === '超星学习通') {
                nextBtn = document.querySelector('.ans-job-icon[title="下一章"]') || 
                          document.querySelector('.nextChapter');
            }
            // 智慧树
            else if (this.siteName === '智慧树') {
                nextBtn = document.querySelector('.next-page-btn') ||
                          document.querySelector('.next-btn');
            }
            // 智慧职教
            else if (this.siteName === '智慧职教') {
                nextBtn = document.querySelector('.next_lesson') ||
                          document.querySelector('.next-lesson');
            }
            // 其他平台的通用选择器
            else {
                const possibleSelectors = [
                    '.next', '.next-btn', '.next-lesson', '.nextChapter',
                    '[title="下一章"]', '[title="下一节"]', '[title="下一讲"]',
                    'a:contains("下一章")', 'a:contains("下一节")'
                ];
                
                for (let selector of possibleSelectors) {
                    nextBtn = document.querySelector(selector);
                    if (nextBtn) break;
                }
            }
            
            if (nextBtn) {
                nextBtn.click();
                console.log('已自动跳转至下一章');
            }
        }
        
        // 设置视频速度
        applyVideoSpeed(speed) {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.playbackRate = speed;
            });
            
            // 持续应用速度(防止视频网站重置)
            if (this.speedInterval) {
                clearInterval(this.speedInterval);
            }
            
            this.speedInterval = setInterval(() => {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => {
                    if (video.playbackRate !== speed) {
                        video.playbackRate = speed;
                    }
                });
                
                // 更新速度进度条
                const speedProgressBar = document.getElementById('speed-progress');
                if (speedProgressBar) {
                    const speedPercent = Math.min(100, (speed / 16) * 100);
                    speedProgressBar.style.width = `${speedPercent}%`;
                }
                
                // 在面板上显示当前速度
                const statusText = document.getElementById('video-status');
                if (statusText && statusText.textContent.includes('播放中')) {
                    statusText.textContent = `播放中 (${speed}x)`;
                }
            }, 1000);
            
            // 显示状态提示
            this.showStatusTip(`视频速度已设置为 ${speed}x`, 2000);
        }
        
        // 启用拖动功能
        enableDrag(elements) {
            elements.forEach(el => {
                el.addEventListener('mousedown', (e) => {
                    const target = el.closest('#miaoke-helper-panel, #note-panel, #miaoke-helper-btn');
                    if (!target) return;
                    
                    // 初始位置
                    const initialX = e.clientX;
                    const initialY = e.clientY;
                    const startLeft = target.offsetLeft;
                    const startTop = target.offsetTop;
                    
                    // 移动处理函数
                    const moveHandler = (e) => {
                        const dx = e.clientX - initialX;
                        const dy = e.clientY - initialY;
                        
                        target.style.left = startLeft + dx + 'px';
                        target.style.top = startTop + dy + 'px';
                    };
                    
                    // 释放处理函数
                    const upHandler = () => {
                        document.removeEventListener('mousemove', moveHandler);
                        document.removeEventListener('mouseup', upHandler);
                    };
                    
                    document.addEventListener('mousemove', moveHandler);
                    document.addEventListener('mouseup', upHandler);
                });
            });
        }
    }

    // 页面加载完成后初始化
    window.addEventListener('load', () => {
        // 延迟一点时间确保页面元素都已加载
        setTimeout(() => {
            window.miaokeHelper = new MiaoKeHelper();
        }, 1500);
    });
})();

// ==UserScript==
// @name         腾讯视频vip解析 - 带顶部日志
// @namespace    https://jixiejidiguan.top/A2zml/
// @version      2025-08-05
// @description  在腾讯视频页面顶部显示日志面板，用于调试和信息展示
// @author       jixiejidiguan.top
// @match        https://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MT
// @downloadURL https://update.greasyfork.org/scripts/544648/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91vip%E8%A7%A3%E6%9E%90%20-%20%E5%B8%A6%E9%A1%B6%E9%83%A8%E6%97%A5%E5%BF%97.user.js
// @updateURL https://update.greasyfork.org/scripts/544648/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91vip%E8%A7%A3%E6%9E%90%20-%20%E5%B8%A6%E9%A1%B6%E9%83%A8%E6%97%A5%E5%BF%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 视频解析接口配置
    const videoParsers = [
        { id: 'parser1', name: '解析接口 1', url: 'https://jx.playerjy.com/?ads=0&url=' },
        { id: 'parser2', name: '解析接口 2', url: 'https://jx.xmflv.com/?url=' },
        { id: 'parser3', name: '解析接口 3', url: 'https://z1.190000000007.top/?jx=' },
        { id: 'parser4', name: '解析接口 4', url: 'https://jx.dmflv.cc/?url=' },
        { id: 'parser5', name: '解析接口 5', url: 'https://www.yemu.xyz/?url=' },
        { id: 'parser6', name: '解析接口 6', url: 'https://jx.nnxv.cn/tv.php?url=' }
    ];

    // 日志管理模块
    const LogManager = {
        panel: null,
        content: null,
        hideTimeout: null,

        // 初始化日志面板
        init() {
            if (this.isAlreadyInjected('tampermonkey-log-panel')) {
                this.content = document.getElementById('tampermonkey-log-content');
                return this.content;
            }

            this.panel = document.createElement('div');
            this.panel.id = 'tampermonkey-log-panel';
            this.panel.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #1e1e1e79;
                color: #fff;
                z-index: 99999;
                padding: 10px;
                font-family: monospace;
                font-size: 14px;
                border-bottom: 2px solid #007acc;
                max-height: 200px;
                overflow-y: auto;
            `;

            const title = document.createElement('div');
            title.textContent = '🔧 TamperMonkey 脚本日志';
            title.style.cssText = `
                font-weight: bold;
                margin-bottom: 8px;
                color: #00d4ff;
            `;
            this.panel.appendChild(title);

            this.content = document.createElement('div');
            this.content.id = 'tampermonkey-log-content';
            this.content.style.cssText = `
                white-space: pre-wrap;
                word-break: break-word;
                line-height: 1.4;
            `;
            this.panel.appendChild(this.content);

            // 将日志面板添加到页面顶部
            document.body.appendChild(this.panel);

            // 全局日志方法
            window.logToPage = (msg, type = 'info') => this.log(msg, type);

            return this.content;
        },

        // 检查元素是否已注入
        isAlreadyInjected(id) {
            return document.getElementById(id) !== null;
        },

        // 记录日志
        log(msg, type = 'info') {
            if (!this.content) return;
            const time = new Date().toLocaleTimeString();
            const prefix = {
                error: '[❌ ERROR]',
                warn: '[⚠️ WARN]',
                info: '[ℹ️ INFO]',
                log: '[💬 LOG]'
            }[type] || '[💬 LOG]';

            // 创建新的日志行元素
            const logLine = document.createElement('div');
            logLine.textContent = `${time} ${prefix} ${msg}`;

            // 添加日志行到内容容器
            this.content.appendChild(logLine);

            // 显示日志面板
            this.show();

            // 清除之前的隐藏定时器
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
            }

            // 5秒后隐藏日志面板
            this.hideTimeout = setTimeout(() => this.hide(), 3000);
        },

        // 显示日志面板
        show() {
            if (this.panel) {
                this.panel.style.display = "block";
            }
        },

        // 隐藏日志面板
        hide() {
            if (this.panel) {
                this.panel.style.display = "none";
            }
        }
    };

    // 工具栏按钮模块
    const ToolbarButton = {
        element: null,

        // 初始化工具栏按钮
        init() {
            if (LogManager.isAlreadyInjected('custom-popup-button')) return;

            const btnContainer = document.createElement('div');
            btnContainer.id = 'custom-popup-button';
            btnContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 20px;
                transform: translateY(-50%);
                z-index: 99999;
            `;

            const btn = document.createElement('button');
            btn.textContent = '🔧 打开弹窗';
            btn.style.cssText = `
                writing-mode: vertical-rl;
                text-orientation: mixed;
                padding: 12px 8px;
                background: #1976d2;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                transition: background 0.2s;
                font-size: 14px;
            `;

            // 添加事件监听器
            btn.addEventListener('mouseover', () => {
                btn.style.background = '#1565c0';
            });

            btn.addEventListener('mouseout', () => {
                btn.style.background = '#1976d2';
            });

            btn.addEventListener('click', ModalManager.show);

            btnContainer.appendChild(btn);
            document.body.appendChild(btnContainer);

            this.element = btnContainer;

            LogManager.log('🔧 工具按钮已添加', 'info');
        },

        // 移除工具栏按钮
        remove() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
                this.element = null;
            }
        }
    };

    // 模态框管理模块
    const ModalManager = {
        overlay: null,

        // 显示模态框
        show() {

            this.overlay = document.createElement('div');
            this.overlay.id = 'custom-modal-overlay';
            this.overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100000;
        `;

            const modal = document.createElement('div');
            modal.style.cssText = `
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 400px;
            max-width: 500px;
            font-family: sans-serif;
            position: relative;
        `;

            modal.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #000;">🔧 视频解析工具</h3>
            <p style="margin: 0 0 20px 0; color: #666; line-height: 1.5;">
                请输入需要解析的视频地址，然后选择一个解析接口
            </p>
            <button id="close-modal-btn" style="color: #000;
                background: #f0f0f0;
                border: 1px solid #ccc;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 15px;
            ">关闭</button>
        `;

            // 创建并添加视频解析区域
            const parserSection = VideoParser.createSection();
            modal.insertBefore(parserSection, modal.querySelector('#close-modal-btn'));

            this.overlay.appendChild(modal);
            document.body.appendChild(this.overlay);

            // 关闭按钮事件 - 使用箭头函数确保this指向正确
            const closeModalBtn = modal.querySelector('#close-modal-btn');
            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', (e) => {
                    ModalManager.hide();
                    LogManager.log('🔧 关闭按钮触发关闭', 'info');
                }); // 添加once选项防止多次触发
            }

            // 点击背景关闭
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    ModalManager.hide();
                    LogManager.log('🔧 背景点击触发关闭', 'info');
                }
            }); // 添加once选项

            LogManager.log('🔧 视频解析工具已打开', 'info');
        },

        // 隐藏模态框
        hide() {
            const existingVideoContainer = document.getElementById('custom-modal-overlay');
            if (existingVideoContainer) {
                if (existingVideoContainer.parentNode) {
                    existingVideoContainer.parentNode.removeChild(existingVideoContainer);
                } else {
                    existingVideoContainer.remove();
                }
            }
        }
    };


    // 视频解析模块
    const VideoParser = {
        // 创建视频解析区域
        createSection() {
            const parserContainer = document.createElement('div');
            parserContainer.style.cssText = `
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            `;

            // 标题和输入框
            parserContainer.innerHTML = `
                <h4 style="margin: 0 0 12px 0; color: #333;">视频解析</h4>
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                    输入视频URL并选择解析接口
                </p>
                <div style="margin-bottom: 15px;">
                    <input type="text" id="video-url-input" placeholder="请输入视频地址"
                        style="color: #000;width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                </div>
                <div id="parser-buttons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                    <!-- 按钮会通过JS动态生成 -->
                </div>
            `;

            // 获取按钮容器
            const buttonsContainer = parserContainer.querySelector('#parser-buttons');

            // 动态生成解析按钮
            videoParsers.forEach(parser => {
                const button = this.createButton(parser);
                buttonsContainer.appendChild(button);
            });

            return parserContainer;
        },

        // 创建解析按钮
        createButton(parser) {
            const button = document.createElement('button');
            button.id = parser.id;
            button.textContent = parser.name;
            button.style.cssText = `
                padding: 8px 12px;
                background: #1976d2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
                text-align: center;
            `;

            // 添加事件监听器
            button.addEventListener('mouseover', () => {
                button.style.background = '#1565c0';
            });

            button.addEventListener('mouseout', () => {
                button.style.background = '#1976d2';
            });

            button.addEventListener('click', () => this.parseVideo(parser));

            return button;
        },

        // 解析视频
        parseVideo(parser) {
            // 获取视频URL（优先使用输入框内容，否则使用当前页面URL）
            const videoInput = document.getElementById('video-url-input');
            const currentUrl = window.location.href;
            const videoUrl = videoInput ? videoInput.value.trim() : '';

            // 如果输入框为空，则使用当前页面URL
            const finalUrl = videoUrl || currentUrl;

            if (!finalUrl) {
                alert('请输入视频地址');
                return;
            }

            // 1. 关闭弹窗
            ModalManager.hide();

            // 2. 清除已有的视频容器（避免重复）
            this.removeExistingPlayer();

            // 3. 构建完整的解析URL
            const fullUrl = `${parser.url}${encodeURIComponent(finalUrl)}`;

            // 4. 创建新的视频容器
            const videoContainer = this.createPlayerContainer(fullUrl);

            // 5. 添加到页面容器
            const container = document.querySelector('.container-main__wrapper');
            const containerleft = document.querySelector('.container-main__left');

            if (containerleft) {
                containerleft.style.cssText = `visibility: hidden;`;
            }

            // 暂停页面上的视频
            this.pausePageVideos();

            if (container) {
                container.appendChild(videoContainer);
                LogManager.log(`使用${parser.name}解析视频: ${finalUrl}`, 'info');
            } else {
                console.error('未找到.container-main容器');
                LogManager.log('未找到视频容器，无法播放视频', 'error');
            }
        },

        // 移除已存在的播放器
        removeExistingPlayer() {
            const existingVideoContainer = document.getElementById('video-player-container');
            if (existingVideoContainer) {
                if (existingVideoContainer.parentNode) {
                    existingVideoContainer.parentNode.removeChild(existingVideoContainer);
                } else {
                    existingVideoContainer.remove();
                }
            }
        },

        // 创建播放器容器
        createPlayerContainer(url) {
            const videoContainer = document.createElement('div');
            videoContainer.id = 'video-player-container';
            videoContainer.style.cssText = `
                position: absolute;
                top: 0;
                width: 100%;
                padding-top: 56.25%; /* 16:9比例 */
                margin-top: 20px;
            `;

            // 添加iframe视频播放器
            videoContainer.innerHTML = `
                <iframe src="${url}"
                    allowfullscreen
                    frameborder="0"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #000;"></iframe>
            `;

            return videoContainer;
        },

        // 暂停页面上的视频
        pausePageVideos() {
            const videos = document.querySelectorAll('video[playsinline="isiPhoneShowPlaysinline"]');
            videos.forEach(video => {
                try {
                    video.pause();
                } catch (error) {
                    console.warn('Failed to pause video:', error);
                }
            });
        }
    };

    // 播放列表管理模块
    const PlaylistManager = {
        // 初始化播放列表事件监听
        init() {
            const playlistContainer = document.querySelector('.playlist-rect');
            if (!playlistContainer) return;

            playlistContainer.addEventListener('click', (event) => {
                // 通过 closest() 方法检测点击目标是否符合条件
                const targetCol = event.target.closest('.playlist-rect__col');

                if (targetCol) {
                    this.handlePlaylistClick();
                }
            });
        },

        // 处理播放列表点击事件
        handlePlaylistClick() {
            const videoContainer = document.getElementById('video-player-container');
            if (videoContainer) {
                // 添加过渡动画效果
                videoContainer.style.transition = 'opacity 0.3s';
                videoContainer.style.opacity = '0';

                // 动画结束后移除元素
                setTimeout(() => {
                    try {
                        if (videoContainer.parentNode) {
                            videoContainer.parentNode.removeChild(videoContainer);
                        } else {
                            videoContainer.remove();
                        }
                        console.log('视频容器已成功移除');
                    } catch (error) {
                        console.error('元素移除失败:', error);
                    }
                }, 300);
            }

            const containerleft = document.querySelector('.container-main__left');
            if (containerleft) {
                containerleft.style.cssText = `visibility: visible;`;
            }
        }
    };

    // 主初始化模块
    const App = {
        initialized: false,

        // 初始化应用
        init() {
            // 防止重复初始化
            if (this.initialized) return;

            // 先确保日志面板已设置好
            const logElement = LogManager.init();
            if (logElement) {
                LogManager.log('🚀 脚本启动初始化...', 'info');
                ToolbarButton.init();
                PlaylistManager.init();
                LogManager.log('✅ 脚本初始化完成', 'info');
                this.initialized = true;
            } else {
                console.error('日志面板初始化失败');
            }
        },

        // 清理应用资源
        cleanup() {
            ModalManager.hide();
            ToolbarButton.remove();
            LogManager.hide();
            this.initialized = false;
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        App.cleanup();
    });
})();
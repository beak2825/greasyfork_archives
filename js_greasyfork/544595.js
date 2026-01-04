// ==UserScript==
// @name         抖音视频转Get笔记
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  一键将抖音视频转换为Get笔记，支持单条和批量处理
// @author       王老禅头
// @match        https://www.douyin.com/*
// @match        https://www.biji.com/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544595/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E8%BD%ACGet%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/544595/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E8%BD%ACGet%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项 - 纯API版本
    const CONFIG = {
        debug: true,         // 调试模式
        useCurrentUrl: true  // 直接使用当前URL作为分享链接
    };

    // 日志工具
    const logger = {
        log: (msg, ...args) => console.log(`[抖音转Get笔记] ${msg}`, ...args),
        error: (msg, ...args) => console.error(`[抖音转Get笔记] ${msg}`, ...args),
        warn: (msg, ...args) => console.warn(`[抖音转Get笔记] ${msg}`, ...args)
    };

    // 页面类型识别
    const PageType = {
        VIDEO: 'video',        // 单条视频页面
        USER: 'user',          // 博主主页
        GET_NOTE: 'get_note',  // Get笔记页面
        UNKNOWN: 'unknown'
    };

    // 获取当前页面类型
    function getCurrentPageType() {
        const host = window.location.hostname;
        const pathname = window.location.pathname;
        const fullUrl = window.location.href;

        if (host === 'www.biji.com') {
            return PageType.GET_NOTE;
        }

        if (host === 'www.douyin.com') {
            // 单条视频页面：/video/xxx 或 /note/xxx
            if (pathname.match(/^\/(video|note)\/\d+$/)) {
                return PageType.VIDEO;
            }

            // 特殊情况：用户主页中的视频模态窗口 (有modal_id参数表示是单条视频)
            if (pathname.startsWith('/user/') && fullUrl.includes('modal_id=')) {
                return PageType.VIDEO;
            }

            // 精选页面中的单条视频 (/jingxuan?modal_id=xxx)
            if (pathname === '/jingxuan' && fullUrl.includes('modal_id=')) {
                return PageType.VIDEO;
            }

            // 博主主页：/user/xxx (没有modal_id参数)
            if (pathname.startsWith('/user/')) {
                // 检查是否是适合批量转换的页面
                const urlParams = new URLSearchParams(window.location.search);
                const showTab = urlParams.get('showTab');
                const fromTab = urlParams.get('from_tab_name');

                // 排除不适合批量转换的页面
                const excludeTabs = ['like', 'favorite', 'collection', 'music'];
                const excludeFromTabs = ['like', 'favorite'];

                if (excludeTabs.includes(showTab) || excludeFromTabs.includes(fromTab)) {
                    logger.log(`检测到特殊页面参数: showTab=${showTab}, from_tab_name=${fromTab}, 不显示批量转换按钮`);
                    return PageType.UNKNOWN;
                }

                return PageType.USER;
            }
        }

        return PageType.UNKNOWN;
    }



    // 提取视频信息
    function extractVideoInfo() {
        const currentUrl = window.location.href;
        const pathname = window.location.pathname;

        // 方案1: 标准格式 /video/xxx 或 /note/xxx
        const match = pathname.match(/^\/(video|note)\/(\d+)$/);
        let videoId = match ? match[2] : null;

        // 方案2: 模态窗口格式，从URL参数提取
        if (!videoId && (pathname.startsWith('/user/') || pathname === '/jingxuan')) {
            const urlParams = new URLSearchParams(window.location.search);
            const modalId = urlParams.get('modal_id');
            const vid = urlParams.get('vid');

            // 优先使用modal_id，其次使用vid
            videoId = modalId || vid;
        }

        let videoDataUrl = null;
        try {
            if (window.__INITIAL_SSR_STATE__?.app?.videoDetail?.aweme_id) {
                const awemeId = window.__INITIAL_SSR_STATE__.app.videoDetail.aweme_id;
                videoDataUrl = `https://www.douyin.com/video/${awemeId}`;
            }
            else if (window.RENDER_DATA?.app?.videoDetail?.aweme_id) {
                const awemeId = window.RENDER_DATA.app.videoDetail.aweme_id;
                videoDataUrl = `https://www.douyin.com/video/${awemeId}`;
            }
        } catch (e) {
            // 忽略页面数据提取失败
        }

        // 如果有videoId但没有videoDataUrl，构造标准链接
        if (videoId && !videoDataUrl) {
            videoDataUrl = `https://www.douyin.com/video/${videoId}`;
        }

        return {
            videoId,
            currentUrl,
            videoDataUrl,
            bestUrl: videoDataUrl || currentUrl
        };
    }

    // 创建苹果风格样式
    function createStyles() {
        const styles = `
            /* 苹果风格按钮基础样式 */
            .dy-to-get-btn {
                position: fixed;
                z-index: 9999;
                background: rgba(0, 122, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                color: white;
                border: none;
                border-radius: 14px;
                padding: 12px 24px;
                font-size: 15px;
                font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 122, 255, 0.25),
                           0 1px 3px rgba(0, 0, 0, 0.1);
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border: 0.5px solid rgba(255, 255, 255, 0.1);
                letter-spacing: -0.02em;
                user-select: none;
                -webkit-user-select: none;
            }

            .dy-to-get-btn:hover {
                transform: translateY(-1px) scale(1.02);
                box-shadow: 0 6px 25px rgba(0, 122, 255, 0.35),
                           0 2px 8px rgba(0, 0, 0, 0.15);
                background: rgba(0, 122, 255, 1);
            }

            .dy-to-get-btn:active {
                transform: translateY(0px) scale(0.98);
                box-shadow: 0 2px 10px rgba(0, 122, 255, 0.3);
                transition: all 0.1s ease;
            }

            .dy-to-get-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            /* 单条转换按钮 */
            .dy-to-get-single {
                top: 50%;
                right: 24px;
                transform: translateY(-50%);
                background: rgba(52, 199, 89, 0.95);
                box-shadow: 0 4px 20px rgba(52, 199, 89, 0.25),
                           0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .dy-to-get-single:hover {
                background: rgba(52, 199, 89, 1);
                box-shadow: 0 6px 25px rgba(52, 199, 89, 0.35),
                           0 2px 8px rgba(0, 0, 0, 0.15);
            }

            /* 批量转换按钮 */
            .dy-to-get-batch {
                top: 100px;
                right: 24px;
                background: rgba(88, 86, 214, 0.95);
                box-shadow: 0 4px 20px rgba(88, 86, 214, 0.25),
                           0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .dy-to-get-batch:hover {
                background: rgba(88, 86, 214, 1);
                box-shadow: 0 6px 25px rgba(88, 86, 214, 0.35),
                           0 2px 8px rgba(0, 0, 0, 0.15);
            }

            /* 滚动扫描按钮 */
            .dy-to-get-scroll {
                top: 160px;
                right: 24px;
                background: rgba(255, 149, 0, 0.95);
                box-shadow: 0 4px 20px rgba(255, 149, 0, 0.25),
                           0 1px 3px rgba(0, 0, 0, 0.1);
                font-size: 13px;
                padding: 10px 20px;
            }

            .dy-to-get-scroll:hover {
                background: rgba(255, 149, 0, 1);
                box-shadow: 0 6px 25px rgba(255, 149, 0, 0.35),
                           0 2px 8px rgba(0, 0, 0, 0.15);
            }

            /* 消息提示样式 */
            .dy-message-toast {
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 10000;
                background: rgba(28, 28, 30, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 500;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                max-width: 320px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                           0 2px 8px rgba(0, 0, 0, 0.2);
                border: 0.5px solid rgba(255, 255, 255, 0.1);
                letter-spacing: -0.01em;
                line-height: 1.4;
                animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            /* 成功消息 */
            .dy-message-success {
                background: rgba(52, 199, 89, 0.95) !important;
                color: white;
            }

            /* 错误消息 */
            .dy-message-error {
                background: rgba(255, 59, 48, 0.95) !important;
                color: white;
            }

            /* 警告消息 */
            .dy-message-warning {
                background: rgba(255, 149, 0, 0.95) !important;
                color: white;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // 简化的单条视频转换器
    class SimpleVideoConverter {
        constructor() {
            this.button = null;
        }

        init() {
            this.createButton();
        }

        createButton() {
            this.button = document.createElement('button');
            this.button.textContent = '转Get笔记';
            this.button.className = 'dy-to-get-btn dy-to-get-single';
            this.button.addEventListener('click', () => this.handleConvert());
            document.body.appendChild(this.button);
        }

        async handleConvert() {
            const videoInfo = extractVideoInfo();
            const shareUrl = videoInfo.bestUrl;

            try {
                this.button.textContent = '转换中...';
                this.button.disabled = true;
                await this.convertSingleVideoWithApi(shareUrl);
            } catch (error) {
                logger.error('转换失败:', error);
                this.showMessage('❌ 转换失败: ' + error.message);
            } finally {
                this.button.textContent = '转Get笔记';
                this.button.disabled = false;
            }
        }

        async convertSingleVideoWithApi(url) {
            this.showMessage('🔐 正在获取认证信息...');

            // 存储单条视频信息供Get笔记页面使用
            GM_setValue('singleUrl', url);
            GM_setValue('batchMode', 'single_api');
            GM_setValue('initTime', Date.now().toString());
            GM_setValue('authStatus', '');

            // 打开Get笔记页面进行认证初始化
            GM_openInTab('https://www.biji.com', { active: true });

            // 等待认证初始化完成
            const maxWaitTime = 30000;
            const startTime = Date.now();

            while (Date.now() - startTime < maxWaitTime) {
                const authStatus = GM_getValue('authStatus');
                if (authStatus === 'ready') {
                    break;
                } else if (authStatus === 'failed') {
                    throw new Error('认证初始化失败，请确保已登录Get笔记');
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const authStatus = GM_getValue('authStatus');
            if (authStatus !== 'ready') {
                throw new Error('认证初始化超时，请手动检查Get笔记页面');
            }

            this.showMessage('🚀 正在进行API转换...');
            const authInfo = JSON.parse(GM_getValue('authInfo') || '{}');
            const result = await this.callApiWithAuth(url, authInfo);

            if (result && result.noteId) {
                this.showMessage(`✅ 转换成功！笔记ID: ${result.noteId}`);
            } else {
                throw new Error('API转换失败');
            }
        }

        async callApiWithAuth(url, authInfo) {
            try {
                const requestData = {
                    attachments: [{
                        size: 100,
                        type: "link",
                        title: "",
                        url: url
                    }],
                    content: "",
                    entry_type: "ai",
                    note_type: "link",
                    source: "web",
                    prompt_template_id: ""
                };

                // 构建请求头
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Origin': 'https://www.biji.com',
                    'Referer': 'https://www.biji.com/',
                    'User-Agent': navigator.userAgent,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                };

                // 添加认证信息
                if (authInfo.cookies) {
                    headers['Cookie'] = authInfo.cookies;
                }
                if (authInfo.token) {
                    headers['Authorization'] = `Bearer ${authInfo.token}`;
                }

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream',
                        headers: headers,
                        data: JSON.stringify(requestData),
                        onload: (response) => {
                            if (response.status === 200) {
                                // 解析SSE响应
                                const lines = response.responseText.split('\n');
                                let noteId = null;

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        try {
                                            const data = JSON.parse(line.substring(6));
                                            if (data.data && data.data.note_id) {
                                                noteId = data.data.note_id;
                                                break;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误
                                        }
                                    }
                                }

                                if (noteId) {
                                    resolve({ noteId, url });
                                } else {
                                    reject(new Error('未找到笔记ID'));
                                }
                            } else {
                                reject(new Error(`API请求失败: ${response.status} - ${response.responseText}`));
                            }
                        },
                        onerror: (error) => {
                            reject(error);
                        }
                    });
                });

            } catch (error) {
                logger.error('API调用异常:', error);
                throw error;
            }
        }

        async callGetNoteAPI(url) {
            // 复用批量转换的API调用逻辑
            try {
                logger.log('单条视频调用Get笔记API:', url);

                // 获取认证Token
                const authToken = this.getAuthToken();

                const requestData = {
                    attachments: [{
                        size: 100,
                        type: "link",
                        title: "",
                        url: url
                    }],
                    content: "",
                    entry_type: "ai",
                    note_type: "link",
                    source: "web",
                    prompt_template_id: ""
                };

                // 构建请求头
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Origin': 'https://www.biji.com',
                    'Referer': 'https://www.biji.com/',
                    'User-Agent': navigator.userAgent,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                };

                // 添加认证头
                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                // 添加Cookie
                const cookies = document.cookie;
                if (cookies) {
                    headers['Cookie'] = cookies;
                }

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream',
                        headers: headers,
                        data: JSON.stringify(requestData),
                        onload: (response) => {
                            if (response.status === 200) {
                                // 解析SSE响应
                                const lines = response.responseText.split('\n');
                                let noteId = null;

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        try {
                                            const data = JSON.parse(line.substring(6));
                                            if (data.data && data.data.note_id) {
                                                noteId = data.data.note_id;
                                                break;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误
                                        }
                                    }
                                }

                                if (noteId) {
                                    resolve({ noteId, url });
                                } else {
                                    reject(new Error('未找到笔记ID'));
                                }
                            } else {
                                reject(new Error(`API请求失败: ${response.status} - ${response.responseText}`));
                            }
                        },
                        onerror: (error) => {
                            reject(error);
                        }
                    });
                });

            } catch (error) {
                logger.error('API调用异常:', error);
                throw error;
            }
        }

        getAuthToken() {
            // 获取认证Token
            try {
                // 方法1: 从localStorage获取
                const localToken = localStorage.getItem('token') ||
                                 localStorage.getItem('auth_token') ||
                                 localStorage.getItem('access_token');
                if (localToken) {
                    return localToken;
                }

                // 方法2: 从sessionStorage获取
                const sessionToken = sessionStorage.getItem('token') ||
                                   sessionStorage.getItem('auth_token') ||
                                   sessionStorage.getItem('access_token');
                if (sessionToken) {
                    return sessionToken;
                }

                // 方法3: 从Cookie中提取
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name && (name.includes('token') || name.includes('auth') || name.includes('jwt'))) {
                        return value;
                    }
                }

                return null;

            } catch (error) {
                logger.error('获取认证Token失败:', error);
                return null;
            }
        }

        showMessage(message) {
            // 移除现有的toast
            const existingToast = document.querySelector('.dy-message-toast');
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement('div');
            toast.className = 'dy-message-toast';

            // 根据消息类型添加对应的样式类
            if (message.includes('✅') || message.includes('成功')) {
                toast.classList.add('dy-message-success');
            } else if (message.includes('❌') || message.includes('失败') || message.includes('错误')) {
                toast.classList.add('dy-message-error');
            } else if (message.includes('⚠️') || message.includes('警告')) {
                toast.classList.add('dy-message-warning');
            }

            toast.textContent = message;
            document.body.appendChild(toast);

            // 自动消失
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    toast.style.animation = 'slideOutRight 0.3s ease-in-out';
                    setTimeout(() => {
                        if (document.body.contains(toast)) {
                            document.body.removeChild(toast);
                        }
                    }, 300);
                }
            }, 4000);
        }
    }

    // 增强的批量转换器（带自动滚动）
    class EnhancedBatchConverter {
        constructor() {
            this.button = null;
            this.scrollButton = null;
            this.videoUrls = [];
            this.isScanning = false;
            this.scrollTimer = null;
            this.maxRetries = 10;
            this.currentRetries = 0;
            this.currentUrl = location.href;
            this.urlCheckTimer = null;
        }

        init() {
            this.createButtons();

            // 延迟扫描，确保页面内容加载完成
            setTimeout(() => this.scanVideos(), 3000);
            setTimeout(() => {
                if (this.videoUrls.length === 0) {
                    this.scanVideos();
                }
            }, 5000);
            setTimeout(() => {
                if (this.videoUrls.length === 0) {
                    this.scanVideos();
                }
            }, 8000);

            // URL监听现在由全局PageManager处理
        }

        createButtons() {
            // 主转换按钮
            this.button = document.createElement('button');
            this.button.textContent = '批量转换 (扫描中...)';
            this.button.className = 'dy-to-get-btn dy-to-get-batch';
            this.button.addEventListener('click', () => this.handleBatchConvert());
            document.body.appendChild(this.button);

            // 自动滚动按钮
            this.scrollButton = document.createElement('button');
            this.scrollButton.textContent = '开始滚动扫描';
            this.scrollButton.className = 'dy-to-get-btn dy-to-get-scroll';
            this.scrollButton.addEventListener('click', () => this.toggleAutoScroll());
            document.body.appendChild(this.scrollButton);
        }

        showButtons() {
            if (this.button) {
                this.button.style.display = 'block';
            }
            if (this.scrollButton) {
                this.scrollButton.style.display = 'block';
            }
        }

        hideButtons() {
            if (this.button) {
                this.button.style.display = 'none';
            }
            if (this.scrollButton) {
                this.scrollButton.style.display = 'none';
            }
        }

        scanVideos() {
            // 优先扫描视频列表区域
            const videoListContainer = document.querySelector('[data-e2e="user-post-list"]') ||
                                     document.querySelector('[data-e2e="scroll-list"]') ||
                                     document.querySelector('.user-post-list') ||
                                     document.body;

            console.log('🎯 扫描容器:', videoListContainer);

            // 在指定容器内查找视频链接
            const allLinks = videoListContainer.querySelectorAll('a[href*="/video/"]');

            console.log(`🔍 在容器内找到 ${allLinks.length} 个视频链接`);

            // 只保留视频链接，排除图文 (/note/) 链接
            const videoLinks = Array.from(allLinks).filter(a => {
                if (!a.href || !a.href.includes('/video/')) return false;

                // 检查是否是有效的视频ID格式
                const videoIdMatch = a.href.match(/\/video\/(\d+)/);
                if (!videoIdMatch) return false;

                // 检查元素是否在视频列表容器内
                const isInVideoList = videoListContainer.contains(a);

                // 检查元素是否可见
                const rect = a.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;

                // 排除导航栏、侧边栏等区域的链接
                const isInMainContent = !a.closest('nav') &&
                                      !a.closest('.sidebar') &&
                                      !a.closest('[data-e2e="nav"]') &&
                                      !a.closest('header');

                console.log(`链接: ${a.href}, 在列表内: ${isInVideoList}, 可见: ${isVisible}, 在主内容: ${isInMainContent}`);

                return isInVideoList && isVisible && isInMainContent;
            });

            // 按视频ID去重
            const videoData = videoLinks.map(a => {
                const url = a.href;
                const match = url.match(/\/video\/(\d+)/);
                const videoId = match ? match[1] : null;
                return { url, videoId, element: a };
            }).filter(item => item.videoId);

            // 去重，保留第一个遇到的链接
            const uniqueVideos = [];
            const seenIds = new Set();

            videoData.forEach(item => {
                if (!seenIds.has(item.videoId)) {
                    seenIds.add(item.videoId);
                    uniqueVideos.push(item);
                }
            });

            const newUrls = uniqueVideos.map(item => item.url);

            console.log(`📊 最终结果: ${newUrls.length} 个唯一视频`);
            uniqueVideos.forEach((item, index) => {
                console.log(`${index + 1}. ID: ${item.videoId} - ${item.url}`);
            });

            this.videoUrls = newUrls;
            this.updateButtonText();
        }

        updateButtonText() {
            if (this.button) {
                this.button.textContent = `批量转换 (${this.videoUrls.length}个视频)`;
            }
        }

        // 清理定时器（在页面卸载时调用）
        cleanup() {
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
                this.scrollTimer = null;
            }
        }

        toggleAutoScroll() {
            if (this.isScanning) {
                this.stopAutoScroll();
            } else {
                this.startAutoScroll();
            }
        }

        startAutoScroll() {
            this.isScanning = true;
            this.currentRetries = 0;
            this.scrollButton.textContent = '停止扫描';
            this.scrollButton.style.background = 'rgba(255, 59, 48, 0.95)';
            this.scrollButton.style.boxShadow = '0 4px 20px rgba(255, 59, 48, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)';

            this.showMessage('🔄 开始自动滚动扫描，请稍等...');
            this.performScroll();
        }

        stopAutoScroll() {
            this.isScanning = false;
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
                this.scrollTimer = null;
            }

            this.scrollButton.textContent = '开始滚动扫描';
            this.scrollButton.style.background = 'rgba(255, 149, 0, 0.95)';
            this.scrollButton.style.boxShadow = '0 4px 20px rgba(255, 149, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)';

            this.showMessage(`✅ 扫描完成！找到 ${this.videoUrls.length} 个视频`);
        }

        performScroll() {
            if (!this.isScanning) return;

            const oldCount = this.videoUrls.length;

            // 检查各种底部状态
            const bottomStatus = this.checkBottomStatus();

            // 执行滚动 - 参考原脚本的滚动逻辑
            this.scrollPage();

            // 等待页面加载新内容
            setTimeout(() => {
                this.scanVideos();
                const newCount = this.videoUrls.length;

                if (oldCount === newCount) {
                    // 没有新视频，增加重试计数
                    this.currentRetries++;

                    // 检查是否检测到底部提示文字或达到物理底部
                    const shouldStop = bottomStatus.hasNoMoreText ||
                                     bottomStatus.hasEndText ||
                                     (bottomStatus.isAtPhysicalBottom && this.currentRetries >= 3);

                    if (shouldStop) {
                        this.completeScrollAndReturn(newCount);
                        return;
                    }
                    else if (this.currentRetries >= this.maxRetries) {
                        this.completeScrollAndReturn(newCount, '⏹️ 扫描停止');
                        return;
                    }
                } else {
                    // 发现新视频，重置重试计数
                    this.currentRetries = 0;
                    const newVideos = newCount - oldCount;
                    this.showMessage(`📹 发现 ${newVideos} 个新视频，总计 ${newCount} 个`);
                }

                // 继续滚动（如果还在扫描状态）
                if (this.isScanning) {
                    this.scrollTimer = setTimeout(() => this.performScroll(), 2000);
                }
            }, 1500);
        }

        checkBottomStatus() {
            // 综合检查页面底部状态
            const status = {
                isAtPhysicalBottom: false,
                hasNoMoreText: false,
                hasEndText: false,
                detectedTexts: []
            };

            // 1. 检查物理底部
            const scrollContainer = document.querySelector('.route-scroll-container');
            if (scrollContainer) {
                const threshold = 100;
                status.isAtPhysicalBottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - threshold;
            } else {
                const threshold = 100;
                status.isAtPhysicalBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
            }

            // 2. 检查底部提示文字
            const bottomTexts = [
                '暂时没有更多了',
                '没有更多了',
                '已经到底了',
                '暂无更多内容',
                '没有更多内容了',
                '到底了',
                '没有更多',
                'No more',
                'End of content'
            ];

            // 获取页面底部区域的所有文本内容
            const allElements = document.querySelectorAll('*');
            const bottomElements = Array.from(allElements).filter(el => {
                const rect = el.getBoundingClientRect();
                // 检查屏幕底部300px范围内的元素
                return rect.top > window.innerHeight - 300 && rect.top < window.innerHeight + 100;
            });

            for (const element of bottomElements) {
                const text = element.textContent || element.innerText || '';
                status.detectedTexts.push(text.trim());

                for (const bottomText of bottomTexts) {
                    if (text.includes(bottomText)) {
                        logger.log(`检测到底部提示文字: "${bottomText}" in "${text}"`);
                        if (bottomText.includes('没有更多') || bottomText.includes('暂时没有更多')) {
                            status.hasNoMoreText = true;
                        } else {
                            status.hasEndText = true;
                        }
                        break;
                    }
                }
            }

            // 3. 额外检查常见的底部元素
            const bottomSelectors = [
                '[class*="no-more"]',
                '[class*="end"]',
                '[class*="bottom"]',
                '[class*="finish"]',
                '.empty-tip',
                '.no-data',
                '.load-more',
                '[data-testid*="end"]'
            ];

            for (const selector of bottomSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top > window.innerHeight - 200 && rect.top < window.innerHeight + 50) {
                        const text = el.textContent || el.innerText || '';
                        if (text.trim()) {
                            status.detectedTexts.push(`[${selector}] ${text.trim()}`);
                            logger.log(`底部元素检测: ${selector} -> "${text}"`);
                        }
                    }
                }
            }

            return status;
        }

        async completeScrollAndReturn(videoCount, customMessage = null) {
            // 停止扫描状态
            this.isScanning = false;
            if (this.scrollTimer) {
                clearTimeout(this.scrollTimer);
                this.scrollTimer = null;
            }

            // 更新按钮状态
            this.scrollButton.textContent = '回到顶部中...';
            this.scrollButton.style.background = 'rgba(255, 149, 0, 0.95)';

            const message = customMessage || '✅ 扫描完成！快速回到顶部...';
            this.showMessage(message);

            // 快速滚动回到顶部
            await this.scrollToTop();

            // 恢复按钮状态
            this.scrollButton.textContent = '开始滚动扫描';
            this.scrollButton.style.background = 'rgba(255, 149, 0, 0.95)';

            // 最终完成消息
            this.showMessage(`🎉 扫描完成！共找到 ${videoCount} 个视频`);
        }

        async scrollToTop() {
            const scrollContainer = document.querySelector('.route-scroll-container');

            if (scrollContainer) {
                // 使用抖音专用的滚动容器 - 快速滚动
                const startPos = scrollContainer.scrollTop;
                const duration = 800; // 0.8秒滚动到顶部（更快）
                const startTime = Date.now();

                const animateScroll = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // 使用更快的缓动函数
                    const easeOut = 1 - Math.pow(1 - progress, 2);
                    const currentPos = startPos * (1 - easeOut);

                    scrollContainer.scrollTop = currentPos;

                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    }
                };

                requestAnimationFrame(animateScroll);

            } else {
                // 备用方案：直接跳转到顶部（最快）
                window.scrollTo({
                    top: 0,
                    behavior: 'auto' // 立即跳转，不使用平滑滚动
                });
            }

            // 等待滚动完成 - 减少等待时间
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        checkIfAtBottom() {
            // 保留原方法作为备用
            const scrollContainer = document.querySelector('.route-scroll-container');
            if (scrollContainer) {
                const threshold = 100;
                return scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - threshold;
            } else {
                const threshold = 100;
                return window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
            }
        }

        scrollPage() {
            // 参考原脚本的滚动逻辑
            const scrollContainer = document.querySelector('.route-scroll-container');

            if (scrollContainer) {
                // 使用抖音专用的滚动容器
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
                logger.log('使用 .route-scroll-container 滚动');
            } else {
                // 备用方案：滚动整个页面
                window.scrollTo(0, document.body.scrollHeight);
                logger.log('使用 window.scrollTo 滚动');
            }
        }

        showMessage(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 200px;
                right: 20px;
                z-index: 10000;
                background: #333;
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                font-size: 12px;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(toast);

            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 3000);
        }

        handleBatchConvert() {
            if (this.videoUrls.length === 0) {
                alert('没有找到视频链接，请先使用"开始滚动扫描"获取视频');
                return;
            }

            // 显示视频数量选择界面
            this.showVideoSelectionDialog();
        }

        showVideoSelectionDialog() {
            // 创建选择对话框
            const dialog = this.createSelectionDialog();
            document.body.appendChild(dialog);
        }

        createSelectionDialog() {
            const overlay = document.createElement('div');
            overlay.id = 'video-selection-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.4);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                animation: fadeIn 0.3s ease-out;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
                           0 8px 32px rgba(0, 0, 0, 0.15);
                min-width: 480px;
                max-width: 90vw;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                animation: slideInScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                border: 0.5px solid rgba(255, 255, 255, 0.8);
                color: #1d1d1f;
            `;

            // 添加动画样式
            if (!document.getElementById('dialog-animations')) {
                const style = document.createElement('style');
                style.id = 'dialog-animations';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideInScale {
                        from {
                            transform: scale(0.9) translateY(20px);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1) translateY(0);
                            opacity: 1;
                        }
                    }

                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            dialog.innerHTML = `
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📹</div>
                    <h2 style="margin: 0 0 12px 0; color: #1d1d1f; font-size: 28px; font-weight: 700; letter-spacing: -0.02em;">批量转换设置</h2>
                    <p style="margin: 0; color: #86868b; font-size: 17px; font-weight: 400;">发现 <strong style="color: #0066cc; font-weight: 600;">${this.videoUrls.length}</strong> 个视频</p>
                </div>

                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 16px; color: #1d1d1f; font-size: 17px; font-weight: 600;">
                        选择转换数量
                    </label>
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                        <span style="color: #86868b; font-size: 17px; min-width: 60px;">转换前</span>
                        <input
                            type="number"
                            id="video-count-input"
                            value="${this.videoUrls.length}"
                            min="1"
                            max="${this.videoUrls.length}"
                            style="
                                flex: 1;
                                padding: 16px 20px;
                                border: 1.5px solid #d2d2d7;
                                border-radius: 12px;
                                font-size: 17px;
                                font-weight: 400;
                                text-align: center;
                                outline: none;
                                transition: all 0.2s ease;
                                background: rgba(255, 255, 255, 0.8);
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                            "
                        >
                        <span style="color: #86868b; font-size: 17px; min-width: 60px;">个视频</span>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="document.getElementById('video-count-input').value = 10" style="
                            padding: 8px 16px;
                            background: rgba(0, 122, 255, 0.1);
                            color: #0066cc;
                            border: 1px solid rgba(0, 122, 255, 0.2);
                            border-radius: 20px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            font-family: inherit;
                        ">前10个</button>
                        <button onclick="document.getElementById('video-count-input').value = 20" style="
                            padding: 8px 16px;
                            background: rgba(0, 122, 255, 0.1);
                            color: #0066cc;
                            border: 1px solid rgba(0, 122, 255, 0.2);
                            border-radius: 20px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            font-family: inherit;
                        ">前20个</button>
                        <button onclick="document.getElementById('video-count-input').value = 50" style="
                            padding: 8px 16px;
                            background: rgba(0, 122, 255, 0.1);
                            color: #0066cc;
                            border: 1px solid rgba(0, 122, 255, 0.2);
                            border-radius: 20px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            font-family: inherit;
                        ">前50个</button>
                        <button onclick="document.getElementById('video-count-input').value = ${this.videoUrls.length}" style="
                            padding: 8px 16px;
                            background: rgba(0, 122, 255, 0.1);
                            color: #0066cc;
                            border: 1px solid rgba(0, 122, 255, 0.2);
                            border-radius: 20px;
                            font-size: 15px;
                            font-weight: 500;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            font-family: inherit;
                        ">全部</button>
                    </div>
                </div>

                <div style="margin-bottom: 32px;">
                    <label style="display: block; margin-bottom: 16px; color: #1d1d1f; font-size: 17px; font-weight: 600;">
                        API 转换设置
                    </label>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: #86868b; font-size: 15px;">每批次调用数量</label>
                            <input
                                type="number"
                                id="batch-size-input"
                                value="5"
                                min="1"
                                max="10"
                                style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 1.5px solid #d2d2d7;
                                    border-radius: 10px;
                                    font-size: 16px;
                                    font-weight: 400;
                                    text-align: center;
                                    outline: none;
                                    transition: all 0.2s ease;
                                    background: rgba(255, 255, 255, 0.8);
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                                "
                            >
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; color: #86868b; font-size: 15px;">间隔时间(秒)</label>
                            <input
                                type="number"
                                id="interval-input"
                                value="3"
                                min="1"
                                max="10"
                                style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 1.5px solid #d2d2d7;
                                    border-radius: 10px;
                                    font-size: 16px;
                                    font-weight: 400;
                                    text-align: center;
                                    outline: none;
                                    transition: all 0.2s ease;
                                    background: rgba(255, 255, 255, 0.8);
                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                                "
                            >
                        </div>
                    </div>
                    <div style="margin-top: 12px; font-size: 14px; color: #86868b; text-align: center;">
                        较小的批次数量和较长的间隔可以提高成功率
                    </div>
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 24px;">
                    <button id="copy-links-btn" style="
                        background: rgba(52, 199, 89, 0.95);
                        backdrop-filter: blur(20px);
                        color: white;
                        border: none;
                        padding: 16px 32px;
                        border-radius: 12px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        flex: 1;
                        box-shadow: 0 4px 20px rgba(52, 199, 89, 0.25);
                        font-family: inherit;
                        letter-spacing: -0.01em;
                    ">
                        复制链接
                    </button>
                    <button id="start-convert-btn" style="
                        background: rgba(0, 122, 255, 0.95);
                        backdrop-filter: blur(20px);
                        color: white;
                        border: none;
                        padding: 16px 32px;
                        border-radius: 12px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        flex: 1;
                        box-shadow: 0 4px 20px rgba(0, 122, 255, 0.25);
                        font-family: inherit;
                        letter-spacing: -0.01em;
                    ">
                        开始转换
                    </button>
                </div>

                <div style="text-align: center;">
                    <button id="cancel-btn" style="
                        background: rgba(142, 142, 147, 0.12);
                        color: #86868b;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        font-size: 17px;
                        font-weight: 400;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-family: inherit;
                    ">
                        取消
                    </button>
                </div>

                <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(0, 0, 0, 0.1); font-size: 15px; color: #86868b; text-align: center; line-height: 1.4;">
                    选择较少的数量可以更快完成转换
                </div>
            `;

            // 添加按钮事件监听
            setTimeout(() => {
                const input = document.getElementById('video-count-input');
                const batchSizeInput = document.getElementById('batch-size-input');
                const intervalInput = document.getElementById('interval-input');
                const startBtn = document.getElementById('start-convert-btn');
                const copyBtn = document.getElementById('copy-links-btn');
                const cancelBtn = document.getElementById('cancel-btn');

                // 设置输入框样式函数
                const setupInputStyles = (inputElement, min, max) => {
                    if (!inputElement) return;

                    inputElement.addEventListener('focus', () => {
                        inputElement.style.borderColor = '#0066cc';
                        inputElement.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.1)';
                    });

                    inputElement.addEventListener('blur', () => {
                        inputElement.style.borderColor = '#d2d2d7';
                        inputElement.style.boxShadow = 'none';
                    });

                    inputElement.addEventListener('input', () => {
                        const value = parseInt(inputElement.value);
                        if (value < min) inputElement.value = min;
                        if (value > max) inputElement.value = max;
                    });
                };

                // 主输入框聚焦和验证
                if (input) {
                    input.focus();
                    input.select();
                    setupInputStyles(input, 1, this.videoUrls.length);
                }

                // API设置输入框
                setupInputStyles(batchSizeInput, 1, 10);
                setupInputStyles(intervalInput, 1, 10);

                // 开始转换按钮
                if (startBtn) {
                    startBtn.addEventListener('click', () => {
                        const count = parseInt(input.value) || this.videoUrls.length;
                        const batchSize = parseInt(batchSizeInput.value) || 5;
                        const interval = parseInt(intervalInput.value) || 3;
                        this.startSelectedConversion(count, batchSize, interval);
                        this.closeSelectionDialog();
                    });

                    startBtn.addEventListener('mouseenter', () => {
                        startBtn.style.transform = 'translateY(-2px)';
                        startBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                    });

                    startBtn.addEventListener('mouseleave', () => {
                        startBtn.style.transform = 'translateY(0)';
                        startBtn.style.boxShadow = 'none';
                    });
                }

                // 复制链接按钮
                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        const count = parseInt(input.value) || this.videoUrls.length;
                        this.copySelectedLinks(count);
                        this.closeSelectionDialog();
                    });

                    copyBtn.addEventListener('mouseenter', () => {
                        copyBtn.style.transform = 'translateY(-2px)';
                        copyBtn.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                    });

                    copyBtn.addEventListener('mouseleave', () => {
                        copyBtn.style.transform = 'translateY(0)';
                        copyBtn.style.boxShadow = 'none';
                    });
                }

                // 取消按钮
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', () => {
                        this.closeSelectionDialog();
                    });
                }

                // ESC键关闭
                const handleKeyPress = (e) => {
                    if (e.key === 'Escape') {
                        this.closeSelectionDialog();
                        document.removeEventListener('keydown', handleKeyPress);
                    } else if (e.key === 'Enter') {
                        startBtn.click();
                        document.removeEventListener('keydown', handleKeyPress);
                    }
                };
                document.addEventListener('keydown', handleKeyPress);

                // 点击遮罩关闭
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.closeSelectionDialog();
                    }
                });

            }, 100);

            overlay.appendChild(dialog);
            return overlay;
        }

        closeSelectionDialog() {
            const overlay = document.getElementById('video-selection-overlay');
            if (overlay) {
                overlay.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                }, 300);
            }
        }

        startSelectedConversion(count, batchSize = 5, interval = 3) {
            // 截取指定数量的视频
            const selectedUrls = this.videoUrls.slice(0, count);
            const originalUrls = this.videoUrls;

            // 临时替换videoUrls数组
            this.videoUrls = selectedUrls;

            // 保存API设置
            this.batchSize = batchSize;
            this.batchInterval = interval * 1000; // 转换为毫秒

            logger.log(`用户选择转换前 ${count} 个视频，从 ${originalUrls.length} 个中选择`);
            logger.log(`API设置: 批次大小=${batchSize}, 间隔=${interval}秒`);
            this.showMessage(`🎯 开始转换前 ${count} 个视频（批次=${batchSize}, 间隔=${interval}s）`);

            // 开始转换
            this.startParallelConversion().then(() => {
                // 转换完成后恢复原始数组
                this.videoUrls = originalUrls;
                this.updateButtonText();
            });
        }

        copySelectedLinks(count) {
            const selectedUrls = this.videoUrls.slice(0, count);
            const urlText = selectedUrls.join('\n');

            if (navigator.clipboard) {
                navigator.clipboard.writeText(urlText).then(() => {
                    this.showMessage(`📋 已复制前 ${count} 个视频链接到剪贴板`);
                });
            } else {
                // 创建文本区域供用户复制
                this.createCopyTextarea(urlText, count);
            }
        }

        createCopyTextarea(urlText, count) {
            const textarea = document.createElement('textarea');
            textarea.value = urlText;
            textarea.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10001;
                width: 80%;
                height: 300px;
                background: white;
                border: 2px solid #333;
                padding: 10px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
            `;
            document.body.appendChild(textarea);
            textarea.select();

            this.showMessage(`请手动复制文本框中的 ${count} 个链接`);

            setTimeout(() => {
                if (document.body.contains(textarea)) {
                    document.body.removeChild(textarea);
                }
            }, 10000);
        }

        async startParallelConversion() {
            this.showMessage('🚀 准备API批量转换，正在跳转到Get笔记页面...');
            logger.log(`开始API批量转换 ${this.videoUrls.length} 个视频`);

            // 存储批量转换配置信息
            GM_setValue('batchUrls', JSON.stringify(this.videoUrls));
            GM_setValue('batchMode', 'api');
            GM_setValue('batchSize', this.batchSize || 5);
            GM_setValue('batchInterval', this.batchInterval || 3000);
            GM_setValue('initTime', Date.now().toString());

            // 直接跳转到Get笔记页面，让Get笔记页面处理所有逻辑
            GM_openInTab('https://www.biji.com', { active: true });

            this.showMessage('✅ 已跳转到Get笔记页面，请查看转换进度');
        }


        createProgressPanel() {
            // 移除现有的进度面板
            const existingPanel = document.getElementById('batch-progress-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            this.progressPanel = document.createElement('div');
            this.progressPanel.id = 'batch-progress-panel';
            this.progressPanel.style.cssText = `
                position: fixed;
                top: 160px;
                right: 20px;
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 0.5px solid rgba(255, 255, 255, 0.8);
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2),
                           0 4px 16px rgba(0, 0, 0, 0.1);
                width: 280px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                color: #1d1d1f;
                animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;

            // 添加滑入动画样式
            if (!document.getElementById('progress-panel-animations')) {
                const style = document.createElement('style');
                style.id = 'progress-panel-animations';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.progressPanel.innerHTML = `
                <div style="text-align: center; margin-bottom: 16px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                    <h3 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: -0.02em;">
                        批量转换进度
                    </h3>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="
                        background: rgba(142, 142, 147, 0.12);
                        height: 6px;
                        border-radius: 3px;
                        overflow: hidden;
                        margin-bottom: 10px;
                    ">
                        <div id="progress-bar" style="
                            height: 100%;
                            background: linear-gradient(90deg, #0066cc, #007aff);
                            width: 0%;
                            transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                            border-radius: 3px;
                        "></div>
                    </div>
                    <div id="progress-text" style="
                        font-size: 14px;
                        font-weight: 500;
                        color: #1d1d1f;
                        text-align: center;
                        margin-bottom: 6px;
                    ">准备开始...</div>
                    <div id="batch-info" style="
                        font-size: 12px;
                        color: #86868b;
                        text-align: center;
                        line-height: 1.3;
                    "></div>
                </div>

                <div style="text-align: center;">
                    <button id="stop-batch" style="
                        background: rgba(255, 59, 48, 0.95);
                        backdrop-filter: blur(20px);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 12px rgba(255, 59, 48, 0.25);
                        font-family: inherit;
                        letter-spacing: -0.01em;
                        width: 100%;
                    ">停止转换</button>
                </div>
            `;

            document.body.appendChild(this.progressPanel);

            // 添加停止按钮事件
            document.getElementById('stop-batch').onclick = () => {
                this.stopBatchConversion();
            };
        }


        updateProgress(batchInfo, statusText) {
            if (!this.progressPanel) return;

            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const batchInfoEl = document.getElementById('batch-info');

            const progress = (this.processedCount / this.videoUrls.length) * 100;

            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }

            if (progressText) {
                progressText.textContent = statusText;
            }

            if (batchInfoEl && batchInfo) {
                // 避免重复显示相同的批次信息
                if (batchInfoEl.textContent !== batchInfo) {
                    batchInfoEl.textContent = batchInfo;
                }
            }
        }

        async processUrlWithAPI(url, taskId) {
            try {
                logger.log(`开始API转换: ${url} (任务ID: ${taskId})`);

                // 调用Get笔记API
                const result = await this.callGetNoteAPI(url);

                if (result && result.noteId) {
                    logger.log(`API转换成功: ${url} -> 笔记ID: ${result.noteId}`);
                    return { success: true, noteId: result.noteId, url };
                } else {
                    throw new Error('API调用失败或未返回笔记ID');
                }

            } catch (error) {
                logger.error(`API转换失败: ${url}`, error);

                // 所有错误直接抛出，不再使用页面操作回退
                throw { url, error: error.message };
            }
        }


        async callGetNoteAPI(url) {
            try {
                logger.log('调用Get笔记API:', url);

                // 获取认证Token (复用GetNoteAutoFill的方法)
                const authToken = this.getAuthToken();

                const requestData = {
                    attachments: [{
                        size: 100,
                        type: "link",
                        title: "",
                        url: url
                    }],
                    content: "",
                    entry_type: "ai",
                    note_type: "link",
                    source: "web",
                    prompt_template_id: ""
                };

                // 构建请求头
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Origin': 'https://www.biji.com',
                    'Referer': 'https://www.biji.com/',
                    'User-Agent': navigator.userAgent,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                };

                // 添加认证头
                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                // 添加Cookie
                const cookies = document.cookie;
                if (cookies) {
                    headers['Cookie'] = cookies;
                }

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream',
                        headers: headers,
                        data: JSON.stringify(requestData),
                        onload: (response) => {
                            if (response.status === 200) {
                                // 解析SSE响应
                                const lines = response.responseText.split('\n');
                                let noteId = null;

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        try {
                                            const data = JSON.parse(line.substring(6));
                                            if (data.data && data.data.note_id) {
                                                noteId = data.data.note_id;
                                                break;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误
                                        }
                                    }
                                }

                                if (noteId) {
                                    resolve({ noteId, url });
                                } else {
                                    reject(new Error('未找到笔记ID'));
                                }
                            } else {
                                reject(new Error(`API请求失败: ${response.status} - ${response.responseText}`));
                            }
                        },
                        onerror: (error) => {
                            reject(error);
                        }
                    });
                });

            } catch (error) {
                logger.error('API调用异常:', error);
                throw error;
            }
        }

        getAuthToken() {
            // 获取认证Token（复用GetNoteAutoFill的逻辑）
            try {
                // 方法1: 从localStorage获取
                const localToken = localStorage.getItem('token') ||
                                 localStorage.getItem('auth_token') ||
                                 localStorage.getItem('access_token');
                if (localToken) {
                    return localToken;
                }

                // 方法2: 从sessionStorage获取
                const sessionToken = sessionStorage.getItem('token') ||
                                   sessionStorage.getItem('auth_token') ||
                                   sessionStorage.getItem('access_token');
                if (sessionToken) {
                    return sessionToken;
                }

                // 方法3: 从Cookie中提取
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name && (name.includes('token') || name.includes('auth') || name.includes('jwt'))) {
                        return value;
                    }
                }

                return null;

            } catch (error) {
                logger.error('获取认证Token失败:', error);
                return null;
            }
        }

        updateProgressBar(progress) {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }

        completeBatchConversion() {
            logger.log('所有批次处理完成！');

            // 生成详细的完成报告
            const successRate = this.videoUrls.length > 0 ?
                Math.round((this.successCount / this.videoUrls.length) * 100) : 0;

            const summary = `✅ 批量转换完成！\n成功: ${this.successCount}/${this.videoUrls.length} (${successRate}%)\n失败: ${this.failedCount}`;

            this.updateProgress('转换完成', summary);
            this.showMessage(`🎉 批量转换完成！成功率: ${successRate}%`);

            // 如果有失败的URL，记录到控制台
            if (this.failedUrls.length > 0) {
                logger.warn('转换失败的URL列表:', this.failedUrls);
            }

            // 10秒后自动关闭进度面板
            setTimeout(() => {
                if (this.progressPanel) {
                    this.progressPanel.remove();
                    this.progressPanel = null;
                }
            }, 10000);
        }

        stopBatchConversion() {
            logger.log('用户停止了批量转换');
            this.stopRequested = true;
            this.showMessage('⏹️ 批量转换已停止');

            if (this.progressPanel) {
                this.progressPanel.remove();
                this.progressPanel = null;
            }
        }

        copyLinksToClipboard() {
            const urlText = this.videoUrls.join('\n');

            if (navigator.clipboard) {
                navigator.clipboard.writeText(urlText).then(() => {
                    this.showMessage(`📋 已复制 ${this.videoUrls.length} 个视频链接到剪贴板`);
                });
            } else {
                // 创建文本区域供用户复制
                const textarea = document.createElement('textarea');
                textarea.value = urlText;
                textarea.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10001;
                    width: 80%;
                    height: 300px;
                    background: white;
                    border: 2px solid #333;
                    padding: 10px;
                    border-radius: 8px;
                `;
                document.body.appendChild(textarea);
                textarea.select();

                this.showMessage('请手动复制文本框中的链接');

                setTimeout(() => {
                    if (document.body.contains(textarea)) {
                        document.body.removeChild(textarea);
                    }
                }, 10000);
            }
        }
    }

    // Get笔记页面自动填入功能（支持并行批量处理）
    class GetNoteAutoFill {
        constructor() {
            this.tabId = null;
            this.batchInfo = null;
        }

        async init() {
            const batchMode = GM_getValue('batchMode');
            const currentBatch = GM_getValue('currentBatch');
            const pendingUrl = GM_getValue('pendingUrl');
            const initTime = GM_getValue('initTime');

            // 检查是否是脚本触发的访问（1分钟内的跳转）
            const isScriptTriggered = initTime && (Date.now() - parseInt(initTime)) < 60000;

            if (!isScriptTriggered) {
                return;
            }

            // 检查是否是API模式（批量或单条）
            if (batchMode === 'api' || batchMode === 'single_api') {
                this.createStatusIndicator();

                if (batchMode === 'single_api') {
                    await this.handleSingleApiAuth();
                } else {
                    await this.handleApiAuthInitialization();
                }
                return;
            }

            // 检查是否是普通批量处理
            if (currentBatch) {
                this.createStatusIndicator();
                await this.handleBatchProcess(JSON.parse(currentBatch));
                return;
            }

            // 检查单独的待处理链接
            if (pendingUrl) {
                this.createStatusIndicator();
                this.updateStatus('🔄 开始处理链接...', '#007bff');
                await this.handleSingleUrl(pendingUrl);
                GM_setValue('pendingUrl', '');
                return;
            }
        }

        async handleSingleApiAuth() {
            this.updateStatus('🔐 正在获取认证信息...', '#007bff');

            try {
                await this.waitForPageLoad();
                const authInfo = await this.extractAuthInfo();

                // 存储认证信息
                GM_setValue('authInfo', JSON.stringify(authInfo));
                GM_setValue('authStatus', 'ready');

                this.updateStatus('✅ 认证信息获取成功！开始单条转换...', '#28a745');

                setTimeout(() => {
                    this.startSingleApiConversion();
                }, 1000);

            } catch (error) {
                logger.error('认证初始化失败:', error);
                GM_setValue('authStatus', 'failed');
                GM_setValue('batchMode', '');
                GM_setValue('initTime', '');
                this.updateStatus('❌ 认证获取失败，请确保已登录', '#dc3545');
            }
        }

        async startSingleApiConversion() {
            const singleUrl = GM_getValue('singleUrl');
            if (!singleUrl) {
                this.updateStatus('❌ 未找到待转换的视频URL', '#dc3545');
                return;
            }

            this.updateStatus('🔄 正在转换视频...', '#007bff');

            try {
                const authInfo = JSON.parse(GM_getValue('authInfo') || '{}');
                const result = await this.callSingleVideoApi(singleUrl, authInfo);

                if (result && result.noteId) {
                    this.updateStatus(`✅ 转换成功！笔记ID: ${result.noteId}`, '#28a745');

                    // 显示成功提示后立即刷新页面
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500); // 1.5秒后刷新，让用户看到成功提示
                } else {
                    throw new Error('API转换失败');
                }

            } catch (error) {
                logger.error('单条视频转换失败:', error);
                this.updateStatus(`❌ 转换失败: ${error.message}`, '#dc3545');
            } finally {
                GM_setValue('singleUrl', '');
                GM_setValue('batchMode', '');
                GM_setValue('initTime', '');
            }
        }

        async callSingleVideoApi(url, authInfo) {
            logger.log('调用单条视频API:', url);

            // 使用与批量转换相同的API端点和数据格式
            const requestData = {
                attachments: [{
                    size: 100,
                    type: "link",
                    title: "",
                    url: url
                }],
                content: "",
                entry_type: "ai",
                note_type: "link",
                source: "web",
                prompt_template_id: ""
            };

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                'Origin': 'https://www.biji.com',
                'Referer': 'https://www.biji.com/',
                'User-Agent': navigator.userAgent,
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            };

            // 添加认证信息
            if (authInfo.cookies) {
                headers['Cookie'] = authInfo.cookies;
            }
            if (authInfo.token) {
                headers['Authorization'] = `Bearer ${authInfo.token}`;
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream',
                    headers: headers,
                    data: JSON.stringify(requestData),
                    timeout: 30000,
                    onload: function(response) {
                        logger.log('单条视频API响应:', response);
                        try {
                            if (response.status === 200) {
                                // 解析SSE响应格式
                                const lines = response.responseText.split('\n');
                                let noteId = null;

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        try {
                                            const data = JSON.parse(line.substring(6));
                                            if (data.data && data.data.note_id) {
                                                noteId = data.data.note_id;
                                                break;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误
                                        }
                                    }
                                }

                                if (noteId) {
                                    resolve({ noteId, url });
                                } else {
                                    reject(new Error('未找到笔记ID'));
                                }
                            } else {
                                logger.error('API请求失败详情:', {
                                    status: response.status,
                                    statusText: response.statusText,
                                    responseText: response.responseText
                                });

                                if (response.status === 403) {
                                    reject(new Error('认证失败：请确保已登录Get笔记，或尝试刷新页面重新登录'));
                                } else {
                                    reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                                }
                            }
                        } catch (e) {
                            reject(new Error(`解析响应失败: ${e.message}`));
                        }
                    },
                    onerror: function(error) {
                        logger.error('单条视频API请求失败:', error);
                        reject(new Error('网络请求失败'));
                    },
                    ontimeout: function() {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }



        async handleApiAuthInitialization() {
            logger.log('=== 开始批量API认证初始化 ===');
            this.updateStatus('🔐 正在获取认证信息...', '#007bff');

            try {
                logger.log('步骤1: 等待页面完全加载');
                // 等待页面完全加载
                await this.waitForPageLoad();
                logger.log('步骤1完成: 页面加载完成');

                logger.log('步骤2: 开始获取认证信息');
                // 获取认证信息
                const authInfo = await this.extractAuthInfo();
                logger.log('步骤2完成: 认证信息获取完成', authInfo);

                // 详细检查认证信息
                const hasCookies = authInfo.cookies && authInfo.cookies.length > 0;
                const hasToken = authInfo.token && authInfo.token.length > 0;

                logger.log('批量认证信息详细检查:', {
                    cookies: authInfo.cookies,
                    cookiesLength: authInfo.cookies?.length || 0,
                    hasCookies: hasCookies,
                    token: authInfo.token,
                    tokenLength: authInfo.token?.length || 0,
                    hasToken: hasToken,
                    canProceed: hasCookies || hasToken
                });

                // 最宽松的条件：总是尝试继续（让API调用自己处理认证）
                logger.log('跳过严格的认证检查，直接尝试批量API调用');

                // 存储认证信息
                GM_setValue('authInfo', JSON.stringify(authInfo));
                GM_setValue('authStatus', 'ready');

                logger.log('认证信息获取成功:', authInfo);
                this.updateStatus('✅ 认证信息获取成功！开始批量转换...', '#28a745');

                // 延迟1秒后开始批量转换，让用户看到成功提示
                setTimeout(() => {
                    this.startApiBatchConversion();
                }, 1000);

            } catch (error) {
                logger.error('认证初始化失败:', error);
                GM_setValue('authStatus', 'failed');

                // 清理临时标记，避免后续正常访问时误触发
                GM_setValue('batchMode', '');
                GM_setValue('initTime', '');

                this.updateStatus('❌ 认证获取失败，请确保已登录', '#dc3545');
            }
        }

        async extractAuthInfo() {
            const authInfo = {
                cookies: document.cookie,
                token: null,
                headers: {}
            };

            try {
                // 从localStorage获取
                const localToken = localStorage.getItem('token') ||
                                 localStorage.getItem('auth_token') ||
                                 localStorage.getItem('access_token') ||
                                 localStorage.getItem('jwt_token');
                if (localToken) {
                    authInfo.token = localToken;
                }

                // 从sessionStorage获取
                if (!authInfo.token) {
                    const sessionToken = sessionStorage.getItem('token') ||
                                       sessionStorage.getItem('auth_token') ||
                                       sessionStorage.getItem('access_token');
                    if (sessionToken) {
                        authInfo.token = sessionToken;
                    }
                }

                // 从页面全局变量获取
                if (!authInfo.token) {
                    if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.token) {
                        authInfo.token = window.__INITIAL_STATE__.token;
                    }
                }

                // 从Cookie中解析
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name && (name.includes('token') || name.includes('auth') || name.includes('jwt'))) {
                        if (!authInfo.token) {
                            authInfo.token = value;
                        }
                    }
                }

                return authInfo;

            } catch (error) {
                logger.error('提取认证信息失败:', error);
                throw error;
            }
        }

        createStatusIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'get-note-status';
            indicator.style.cssText = `
                position: fixed;
                top: 24px;
                right: 24px;
                z-index: 10000;
                background: rgba(28, 28, 30, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                color: white;
                padding: 12px 20px;
                border-radius: 16px;
                font-size: 15px;
                font-weight: 500;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                           0 2px 8px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
                border: 0.5px solid rgba(255, 255, 255, 0.1);
                letter-spacing: -0.01em;
                user-select: none;
                animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;
            indicator.textContent = '🔄 脚本已激活';

            // 悬停效果
            indicator.addEventListener('mouseenter', () => {
                indicator.style.transform = 'translateY(-2px) scale(1.02)';
                indicator.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25)';
            });

            indicator.addEventListener('mouseleave', () => {
                indicator.style.transform = 'translateY(0) scale(1)';
                indicator.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)';
            });

            // 添加点击测试功能
            indicator.addEventListener('click', () => {
                const testUrl = 'https://www.douyin.com/video/7511981483389668608';
                logger.log('手动触发测试，使用测试URL:', testUrl);
                this.handleSingleUrl(testUrl);
            });

            document.body.appendChild(indicator);
        }

        updateStatus(message, color = '#28a745') {
            const indicator = document.getElementById('get-note-status');
            if (indicator) {
                indicator.textContent = message;
                indicator.style.background = color;
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async waitForPageLoad() {
            if (document.readyState === 'complete') {
                return;
            }

            return new Promise((resolve) => {
                const checkReady = () => {
                    if (document.readyState === 'complete') {
                        resolve();
                    } else {
                        setTimeout(checkReady, 500);
                    }
                };

                checkReady();

                // 设置最大等待时间（10秒）
                setTimeout(() => {
                    resolve();
                }, 10000);
            });
        }

        async handleBatchProcess(batchInfo) {
            logger.log('处理批量任务:', batchInfo);
            this.batchInfo = batchInfo;
            this.updateStatus('🔍 查找对应链接...', '#007bff');

            // 查找当前标签页对应的链接
            const currentUrl = await this.findUrlForCurrentTab(batchInfo);
            if (currentUrl) {
                logger.log('找到当前标签页对应的链接:', currentUrl);
                await this.handleSingleUrl(currentUrl);

                // 清除已处理的链接
                this.clearProcessedUrl();
            } else {
                logger.log('未找到当前标签页对应的链接');
                this.updateStatus('⚠️ 未找到对应链接', '#ffc107');
            }
        }

        async findUrlForCurrentTab(batchInfo) {
            // 尝试匹配存储的批次链接
            for (let i = 0; i < batchInfo.urls.length; i++) {
                const tabId = `${batchInfo.batchId}_${i}`;
                const storedUrl = GM_getValue(tabId);

                if (storedUrl) {
                    // 使用第一个找到的链接
                    this.tabId = tabId;
                    return storedUrl;
                }
            }
            return null;
        }

        clearProcessedUrl() {
            if (this.tabId) {
                GM_setValue(this.tabId, ''); // 清除已处理的链接
                logger.log(`已清除处理过的链接: ${this.tabId}`);
            }
        }

        async handleSingleUrl(url) {
            this.updateStatus('🔍 处理链接中...', '#007bff');
            logger.log('开始处理单个URL:', url);

            // 直接使用API调用Get笔记服务（用户默认已登录）
            try {
                const result = await this.callGetNoteAPI(url);
                if (result) {
                    this.updateStatus('✅ 转换成功！', '#28a745');
                    logger.log('API调用成功，笔记ID:', result.noteId);
                } else {
                    throw new Error('API调用失败');
                }
            } catch (error) {
                logger.error('API调用失败:', error);
                this.updateStatus('❌ API转换失败', '#dc3545');
                // 不再使用页面操作回退，只显示错误信息
            }
        }

        isLoggedInToGetNote() {
            // 检查是否有Get笔记的登录Cookie
            const cookies = document.cookie;
            const hasAuthCookie = cookies.includes('session') ||
                                 cookies.includes('token') ||
                                 cookies.includes('auth') ||
                                 cookies.includes('uid') ||
                                 cookies.includes('user');

            logger.log('Cookie检查结果:', hasAuthCookie ? '已登录' : '未登录');
            return hasAuthCookie;
        }

        async callGetNoteAPI(url) {
            try {
                const authToken = this.getAuthToken();

                const requestData = {
                    attachments: [{
                        size: 100,
                        type: "link",
                        title: "",
                        url: url
                    }],
                    content: "",
                    entry_type: "ai",
                    note_type: "link",
                    source: "web",
                    prompt_template_id: ""
                };

                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Origin': 'https://www.biji.com',
                    'Referer': 'https://www.biji.com/',
                    'User-Agent': navigator.userAgent,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                };

                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                const cookies = document.cookie;
                if (cookies) {
                    headers['Cookie'] = cookies;
                }

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream',
                        headers: headers,
                        data: JSON.stringify(requestData),
                        onload: (response) => {
                            if (response.status === 200) {
                                const lines = response.responseText.split('\n');
                                let noteId = null;

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        try {
                                            const data = JSON.parse(line.substring(6));
                                            if (data.data && data.data.note_id) {
                                                noteId = data.data.note_id;
                                                break;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误
                                        }
                                    }
                                }

                                if (noteId) {
                                    resolve({ noteId, url });
                                } else {
                                    reject(new Error('未找到笔记ID'));
                                }
                            } else {
                                logger.error('API请求失败:', response.status, response.responseText);
                                reject(new Error(`API请求失败: ${response.status}`));
                            }
                        },
                        onerror: (error) => {
                            logger.error('API请求网络错误:', error);
                            reject(error);
                        }
                    });
                });

            } catch (error) {
                logger.error('Get笔记API调用异常:', error);
                return null;
            }
        }

        getAuthToken() {
            try {
                // 从localStorage获取
                const localToken = localStorage.getItem('token') ||
                                 localStorage.getItem('auth_token') ||
                                 localStorage.getItem('access_token');
                if (localToken) {
                    return localToken;
                }

                // 从sessionStorage获取
                const sessionToken = sessionStorage.getItem('token') ||
                                   sessionStorage.getItem('auth_token') ||
                                   sessionStorage.getItem('access_token');
                if (sessionToken) {
                    return sessionToken;
                }

                // 从Cookie中提取
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    const [name, value] = cookie.trim().split('=');
                    if (name && (name.includes('token') || name.includes('auth') || name.includes('jwt'))) {
                        return value;
                    }
                }

                // 从页面全局变量获取
                if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.token) {
                    return window.__INITIAL_STATE__.token;
                }

                return null;

            } catch (error) {
                logger.error('获取认证Token失败:', error);
                return null;
            }
        }

        async waitForElement(selector, timeout = 5000) {
            logger.log('等待元素:', selector);
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const element = document.querySelector(selector) ||
                               this.findElementByText('button', '添加链接') ||
                               this.findElementByText('div', '添加链接');
                if (element) {
                    logger.log('找到元素:', element);
                    return element;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            logger.warn('等待元素超时:', selector);
            return null;
        }

        findElementByText(tag, text) {
            const elements = document.querySelectorAll(tag);
            return Array.from(elements).find(el => el.textContent.includes(text));
        }

        showToast(message) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: #333;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-size: 14px;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            document.body.appendChild(toast);

            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 5000);
        }

        // API批量转换相关方法
        async startApiBatchConversion() {
            logger.log('开始Get笔记页面的API批量转换...');

            // 获取批量转换参数
            const batchUrls = JSON.parse(GM_getValue('batchUrls') || '[]');
            const batchSize = parseInt(GM_getValue('batchSize')) || 5;
            const batchInterval = parseInt(GM_getValue('batchInterval')) || 3000;

            if (batchUrls.length === 0) {
                this.updateStatus('❌ 没有找到待转换的视频链接', '#dc3545');
                return;
            }

            logger.log(`开始批量转换 ${batchUrls.length} 个视频，批次大小: ${batchSize}，间隔: ${batchInterval}ms`);

            // 创建进度面板
            this.createProgressPanel();

            // 初始化转换参数
            this.videoUrls = batchUrls;
            this.batchSize = batchSize;
            this.batchInterval = batchInterval;
            this.processedCount = 0;
            this.successCount = 0;
            this.failedCount = 0;
            this.failedUrls = [];
            this.stopRequested = false;

            // 初始化进度显示
            this.updateProgress('准备转换', '正在初始化批量转换...');

            // 开始API转换
            try {
                await this.performApiConversion();
            } catch (error) {
                logger.error('API批量转换失败:', error);
                this.updateProgress('转换失败', `❌ 转换过程中出现错误: ${error.message}`);
            }
        }

        async performApiConversion() {
            logger.log('在Get笔记页面执行API批量转换...');

            // 使用用户设置的批次大小
            const batches = [];
            for (let i = 0; i < this.videoUrls.length; i += this.batchSize) {
                batches.push(this.videoUrls.slice(i, i + this.batchSize));
            }

            logger.log(`分为 ${batches.length} 批处理，每批并发 ${this.batchSize} 个链接，间隔 ${this.batchInterval/1000} 秒`);

            // 获取认证信息
            const authInfo = JSON.parse(GM_getValue('authInfo') || '{}');

            // 依次处理每一批
            for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                if (this.stopRequested) break;

                const batch = batches[batchIndex];
                const batchInfo = `第 ${batchIndex + 1}/${batches.length} 批 (${batch.length} 个链接)`;

                logger.log(`开始处理${batchInfo}`);
                this.updateProgress(batchInfo, `正在处理批次 ${batchIndex + 1}/${batches.length}...`);

                // 并发处理当前批次的所有链接
                const promises = batch.map((url, index) =>
                    this.processUrlWithAuthenticatedAPI(url, authInfo, `${batchIndex}-${index}`)
                );

                try {
                    const results = await Promise.allSettled(promises);

                    // 统计结果
                    for (const result of results) {
                        this.processedCount++;
                        if (result.status === 'fulfilled' && result.value && result.value.success) {
                            this.successCount++;
                            logger.log(`转换成功，笔记ID: ${result.value.noteId}`);
                        } else {
                            this.failedCount++;
                            if (result.reason) {
                                logger.error('转换失败:', result.reason);
                                this.failedUrls.push(result.reason.url || '未知URL');
                            }
                        }
                    }

                    // 更新进度
                    const progress = (this.processedCount / this.videoUrls.length) * 100;
                    this.updateProgressBar(progress);

                    logger.log(`批次完成: 成功 ${this.successCount}, 失败 ${this.failedCount}, 总进度 ${this.processedCount}/${this.videoUrls.length}`);

                } catch (error) {
                    logger.error(`批次处理错误:`, error);
                }

                // 使用用户设置的间隔时间
                if (batchIndex < batches.length - 1) {
                    logger.log(`等待 ${this.batchInterval/1000} 秒后处理下一批...`);
                    await new Promise(resolve => setTimeout(resolve, this.batchInterval));
                }
            }

            // 转换完成
            this.completeBatchConversion();
        }

        async processUrlWithAuthenticatedAPI(url, authInfo, taskId) {
            try {
                logger.log(`开始认证API转换: ${url} (任务ID: ${taskId})`);

                const requestData = {
                    attachments: [{
                        size: 100,
                        type: "link",
                        title: "",
                        url: url
                    }],
                    content: "",
                    entry_type: "ai",
                    note_type: "link",
                    source: "web",
                    prompt_template_id: ""
                };

                // 构建请求头
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Origin': 'https://www.biji.com',
                    'Referer': 'https://www.biji.com/',
                    'User-Agent': navigator.userAgent,
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                };

                // 添加认证信息
                if (authInfo.cookies) {
                    headers['Cookie'] = authInfo.cookies;
                }
                if (authInfo.token) {
                    headers['Authorization'] = `Bearer ${authInfo.token}`;
                }

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream',
                        headers: headers,
                        data: JSON.stringify(requestData),
                        onload: (response) => {
                            if (response.status === 200) {
                                // 解析SSE响应
                                const lines = response.responseText.split('\n');
                                let noteId = null;

                                for (const line of lines) {
                                    if (line.startsWith('data: ')) {
                                        try {
                                            const data = JSON.parse(line.substring(6));
                                            if (data.data && data.data.note_id) {
                                                noteId = data.data.note_id;
                                                break;
                                            }
                                        } catch (e) {
                                            // 忽略解析错误
                                        }
                                    }
                                }

                                if (noteId) {
                                    resolve({ success: true, noteId, url });
                                } else {
                                    reject(new Error('未找到笔记ID'));
                                }
                            } else {
                                reject(new Error(`API请求失败: ${response.status} - ${response.responseText}`));
                            }
                        },
                        onerror: (error) => {
                            reject(error);
                        }
                    });
                });

                return result;

            } catch (error) {
                logger.error(`认证API转换失败: ${url}`, error);
                throw { url, error: error.message };
            }
        }

        createProgressPanel() {
            // 隐藏状态指示器，显示进度面板
            const statusIndicator = document.getElementById('get-note-status');
            if (statusIndicator) {
                statusIndicator.style.display = 'none';
            }

            // 移除现有的进度面板
            const existingPanel = document.getElementById('batch-progress-panel');
            if (existingPanel) {
                existingPanel.remove();
            }

            this.progressPanel = document.createElement('div');
            this.progressPanel.id = 'batch-progress-panel';
            this.progressPanel.style.cssText = `
                position: fixed;
                top: 160px;
                right: 20px;
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 0.5px solid rgba(255, 255, 255, 0.8);
                border-radius: 16px;
                padding: 20px;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2),
                           0 4px 16px rgba(0, 0, 0, 0.1);
                width: 280px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                color: #1d1d1f;
                animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            `;

            // 添加滑入动画样式
            if (!document.getElementById('progress-panel-animations')) {
                const style = document.createElement('style');
                style.id = 'progress-panel-animations';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.progressPanel.innerHTML = `
                <div style="text-align: center; margin-bottom: 16px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                    <h3 style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: -0.02em;">
                        批量转换进度
                    </h3>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="
                        background: rgba(142, 142, 147, 0.12);
                        height: 6px;
                        border-radius: 3px;
                        overflow: hidden;
                        margin-bottom: 10px;
                    ">
                        <div id="progress-bar" style="
                            height: 100%;
                            background: linear-gradient(90deg, #0066cc, #007aff);
                            width: 0%;
                            transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                            border-radius: 3px;
                        "></div>
                    </div>
                    <div id="progress-text" style="
                        font-size: 14px;
                        font-weight: 500;
                        color: #1d1d1f;
                        text-align: center;
                        margin-bottom: 6px;
                    ">准备开始...</div>
                    <div id="batch-info" style="
                        font-size: 12px;
                        color: #86868b;
                        text-align: center;
                        line-height: 1.3;
                    "></div>
                </div>

                <div style="text-align: center;">
                    <button id="stop-batch" style="
                        background: rgba(255, 59, 48, 0.95);
                        backdrop-filter: blur(20px);
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 12px rgba(255, 59, 48, 0.25);
                        font-family: inherit;
                        letter-spacing: -0.01em;
                        width: 100%;
                    ">停止转换</button>
                </div>
            `;

            document.body.appendChild(this.progressPanel);

            // 添加停止按钮事件
            document.getElementById('stop-batch').onclick = () => {
                this.stopBatchConversion();
            };
        }



        updateProgressBar(progress) {
            const progressBar = document.getElementById('progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }

        completeBatchConversion() {
            logger.log('所有批次处理完成！');

            // 生成详细的完成报告
            const successRate = this.videoUrls.length > 0 ?
                Math.round((this.successCount / this.videoUrls.length) * 100) : 0;

            const summary = `✅ 批量转换完成！\n成功: ${this.successCount}/${this.videoUrls.length} (${successRate}%)\n失败: ${this.failedCount}`;

            this.updateProgress('转换完成', summary);

            // 如果有失败的URL，记录到控制台
            if (this.failedUrls.length > 0) {
                logger.warn('转换失败的URL列表:', this.failedUrls);
            }

            // 显示自动刷新倒计时
            this.showAutoRefreshCountdown();

            // 清理存储的批量转换数据
            GM_setValue('batchUrls', '');
            GM_setValue('batchMode', '');
            GM_setValue('batchSize', '');
            GM_setValue('batchInterval', '');
            GM_setValue('initTime', '');
            GM_setValue('authInfo', '');
            GM_setValue('authStatus', '');
        }

        showAutoRefreshCountdown() {
            const stopButton = document.getElementById('stop-batch');
            if (!stopButton) return;

            // 设置倒计时秒数
            let countdown = 5;
            this.countdownTimer = null;

            // 更改按钮为倒计时样式
            stopButton.style.background = 'rgba(255, 149, 0, 0.95)';
            stopButton.style.boxShadow = '0 2px 12px rgba(255, 149, 0, 0.25)';
            stopButton.disabled = false;

            // 倒计时函数
            const updateCountdown = () => {
                if (countdown > 0) {
                    stopButton.textContent = `🔄 ${countdown}秒后自动刷新`;
                    countdown--;
                } else {
                    // 倒计时结束，执行刷新
                    stopButton.textContent = '正在刷新...';
                    stopButton.disabled = true;
                    stopButton.style.background = 'rgba(142, 142, 147, 0.5)';

                    logger.log('自动刷新页面');
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);

                    // 清除计时器
                    if (this.countdownTimer) {
                        clearInterval(this.countdownTimer);
                        this.countdownTimer = null;
                    }
                    return;
                }
            };

            // 立即显示初始状态
            updateCountdown();

            // 启动倒计时
            this.countdownTimer = setInterval(updateCountdown, 1000);

            // 添加点击事件：立即刷新
            stopButton.onclick = () => {
                logger.log('用户手动点击立即刷新');

                // 清除倒计时
                if (this.countdownTimer) {
                    clearInterval(this.countdownTimer);
                    this.countdownTimer = null;
                }

                stopButton.textContent = '正在刷新...';
                stopButton.disabled = true;
                stopButton.style.background = 'rgba(142, 142, 147, 0.5)';

                setTimeout(() => {
                    window.location.reload();
                }, 500);
            };

            // 添加悬浮效果
            const addHoverEffect = () => {
                stopButton.addEventListener('mouseenter', () => {
                    if (!stopButton.disabled) {
                        stopButton.style.transform = 'translateY(-2px)';
                        stopButton.style.boxShadow = '0 4px 16px rgba(255, 149, 0, 0.35)';
                    }
                });

                stopButton.addEventListener('mouseleave', () => {
                    if (!stopButton.disabled) {
                        stopButton.style.transform = 'translateY(0)';
                        stopButton.style.boxShadow = '0 2px 12px rgba(255, 149, 0, 0.25)';
                    }
                });
            };

            addHoverEffect();
            logger.log('已启动自动刷新倒计时，5秒后自动刷新页面');
        }

        changeButtonToRefresh() {
            const stopButton = document.getElementById('stop-batch');
            if (stopButton) {
                // 更改按钮外观为绿色刷新按钮
                stopButton.textContent = '🔄 刷新页面';
                stopButton.disabled = false;
                stopButton.style.background = 'rgba(52, 199, 89, 0.95)';
                stopButton.style.boxShadow = '0 2px 12px rgba(52, 199, 89, 0.25)';

                // 移除旧的事件监听器，添加新的刷新事件
                stopButton.onclick = () => {
                    logger.log('用户点击刷新页面');

                    // 添加一个简短的加载提示
                    stopButton.textContent = '刷新中...';
                    stopButton.disabled = true;
                    stopButton.style.background = 'rgba(142, 142, 147, 0.5)';

                    // 延迟500ms后刷新页面，让用户看到反馈
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                };

                // 添加悬浮效果
                stopButton.addEventListener('mouseenter', () => {
                    if (!stopButton.disabled) {
                        stopButton.style.transform = 'translateY(-2px)';
                        stopButton.style.boxShadow = '0 4px 16px rgba(52, 199, 89, 0.35)';
                    }
                });

                stopButton.addEventListener('mouseleave', () => {
                    if (!stopButton.disabled) {
                        stopButton.style.transform = 'translateY(0)';
                        stopButton.style.boxShadow = '0 2px 12px rgba(52, 199, 89, 0.25)';
                    }
                });

                logger.log('已将停止按钮更改为刷新页面按钮');
            }
        }

        stopBatchConversion() {
            logger.log('用户停止了批量转换');
            this.stopRequested = true;

            const stopButton = document.getElementById('stop-batch');
            if (stopButton) {
                stopButton.textContent = '已停止';
                stopButton.disabled = true;
                stopButton.style.background = 'rgba(142, 142, 147, 0.5)';
            }

            this.updateProgress('转换已停止', `⏹️ 用户手动停止转换\n已处理: ${this.processedCount}/${this.videoUrls.length}`);
        }

        updateProgress(batchInfo, statusText) {
            logger.log(`进度更新: ${batchInfo} - ${statusText}`);

            // 更新进度面板UI
            const progressText = document.getElementById('progress-text');
            const batchInfoElement = document.getElementById('batch-info');
            const progressBar = document.getElementById('progress-bar');

            if (progressText) {
                progressText.textContent = statusText;
            }

            if (batchInfoElement && batchInfo) {
                batchInfoElement.textContent = batchInfo;
            }

            // 更新进度条
            if (progressBar && this.videoUrls && this.processedCount !== undefined) {
                const progress = (this.processedCount / this.videoUrls.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
        }

    }

    // 页面管理器 - 处理页面切换时的按钮显示逻辑
    class PageManager {
        constructor() {
            this.currentPageType = null;
            this.currentConverter = null;
            this.urlCheckTimer = null;
            this.currentUrl = location.href;
        }

        init() {
            this.updatePageType();
            this.startGlobalUrlMonitoring();
        }

        updatePageType() {
            const newPageType = getCurrentPageType();

            // 如果页面类型改变，清理旧的转换器并创建新的
            if (newPageType !== this.currentPageType) {
                this.cleanup();
                this.currentPageType = newPageType;

                switch (newPageType) {
                    case PageType.VIDEO:
                        this.currentConverter = new SimpleVideoConverter();
                        this.currentConverter.init();
                        break;

                    case PageType.USER:
                        this.currentConverter = new EnhancedBatchConverter();
                        this.currentConverter.init();
                        break;

                    case PageType.GET_NOTE:
                        this.currentConverter = new GetNoteAutoFill();
                        this.currentConverter.init();
                        break;

                    default:
                        this.currentConverter = null;
                        break;
                }
            }
        }

        startGlobalUrlMonitoring() {
            this.urlCheckTimer = setInterval(() => {
                const newUrl = location.href;
                if (newUrl !== this.currentUrl) {
                    this.currentUrl = newUrl;
                    logger.log('检测到页面URL变化:', newUrl);
                    this.updatePageType();
                }
            }, 1000);
        }

        cleanup() {
            // 清理当前转换器
            if (this.currentConverter && this.currentConverter.cleanup) {
                this.currentConverter.cleanup();
            }

            // 移除所有按钮
            const buttons = document.querySelectorAll('.dy-to-get-btn');
            buttons.forEach(button => button.remove());
        }

        destroy() {
            this.cleanup();
            if (this.urlCheckTimer) {
                clearInterval(this.urlCheckTimer);
                this.urlCheckTimer = null;
            }
        }
    }

    // 主程序初始化
    async function init() {
        createStyles();

        // 等待页面加载
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        // 创建页面管理器
        const pageManager = new PageManager();
        pageManager.init();

        // 页面卸载时清理
        window.addEventListener('beforeunload', () => {
            pageManager.destroy();
        });
    }

    // 启动脚本
    init().catch(error => {
        logger.error('脚本初始化失败:', error);
    });

})();
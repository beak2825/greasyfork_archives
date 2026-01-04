// ==UserScript==
// @name         Monkey解析器
// @namespace    Monkey解析器
// @version      2.6
// @description  高效抓取网页内的视频和音频资源，提供复制和下载功能
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540922/Monkey%E8%A7%A3%E6%9E%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540922/Monkey%E8%A7%A3%E6%9E%90%E5%99%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 配置支持的媒体格式
    const SUPPORTED_VIDEO_TYPES = ['mp4', 'webm', 'ogg', 'mov', 'mkv', 'flv', 'm3u8'];
    const SUPPORTED_AUDIO_TYPES = ['mp3', 'wav', 'aac', 'flac', 'm4a', 'ogg', 'opus'];
    
    // 媒体资源存储
    const mediaResources = {
        video: [],
        audio: []
    };
 
    // UI元素缓存
    let floatingBall, panelContainer, notification;
    let videoContainer, audioContainer;
    let tabs, closeBtn;
 
    // 状态管理
    const state = {
        isExpanded: false,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        position: GM_getValue('tm_position', { x: 20, y: 20 }),
        activeTab: 'video',
        scanInterval: null,
        mutationObserver: null
    };
 
    // 防抖函数
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };
 
    // 创建UI元素
    const createUI = () => {
        // 创建悬浮球
        floatingBall = document.createElement('div');
        floatingBall.id = 'tm-floating-ball';
        floatingBall.className = 'tm-floating-ball';
        floatingBall.innerHTML = `<span id="tm-resource-count">0</span>`;
        floatingBall.style.display = 'none';
        document.body.appendChild(floatingBall);
 
        // 创建主面板
        panelContainer = document.createElement('div');
        panelContainer.id = 'tm-panel-container';
        panelContainer.className = 'tm-panel-container';
        panelContainer.innerHTML = `
            <div class="tm-panel-header">
                <div class="tm-panel-title">TypeMonkey 媒体资源</div>
                <button class="tm-close-btn" id="tm-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="tm-tabs">
                <div class="tm-tab tm-active" data-tab="video">
                    <i class="fas fa-video"></i> 视频 <span class="tm-tab-count" id="tm-video-count">0</span>
                </div>
                <div class="tm-tab" data-tab="audio">
                    <i class="fas fa-music"></i> 音频 <span class="tm-tab-count" id="tm-audio-count">0</span>
                </div>
            </div>
            <div class="tm-content">
                <div class="tm-tab-content tm-active" id="tm-video-tab">
                    <div class="tm-media-container" id="tm-video-container">
                        <div class="tm-empty-placeholder">
                            <i class="fas fa-search"></i>
                            <p>扫描网页中的视频资源...</p>
                        </div>
                    </div>
                </div>
                <div class="tm-tab-content" id="tm-audio-tab">
                    <div class="tm-media-container" id="tm-audio-container">
                        <div class="tm-empty-placeholder">
                            <i class="fas fa-search"></i>
                            <p>扫描网页中的音频资源...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panelContainer);
 
        // 创建通知
        notification = document.createElement('div');
        notification.id = 'tm-notification';
        notification.className = 'tm-notification';
        notification.textContent = '链接已复制到剪贴板！';
        notification.style.display = 'none';
        document.body.appendChild(notification);
 
        // 缓存DOM元素
        videoContainer = document.getElementById('tm-video-container');
        audioContainer = document.getElementById('tm-audio-container');
        tabs = document.querySelectorAll('.tm-tab');
        closeBtn = document.getElementById('tm-close-btn');
 
        // 添加Font Awesome图标
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        fontAwesome.crossOrigin = 'anonymous';
        document.head.appendChild(fontAwesome);
 
        // 添加事件监听
        initEventListeners();
        updatePosition();
    };
 
    // 初始化事件监听
    const initEventListeners = () => {
        // 悬浮球点击
        floatingBall.addEventListener('click', togglePanel);
 
        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            state.isExpanded = false;
            hidePanel();
        });
 
        // 标签切换
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有活动标签
                tabs.forEach(t => t.classList.remove('tm-active'));
                document.querySelectorAll('.tm-tab-content').forEach(c => c.classList.remove('tm-active'));
                
                // 激活当前标签
                tab.classList.add('tm-active');
                const tabId = `tm-${tab.dataset.tab}-tab`;
                document.getElementById(tabId).classList.add('tm-active');
                state.activeTab = tab.dataset.tab;
            });
        });
 
        // 悬浮球拖动
        floatingBall.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('mouseleave', endDrag);
        
        // 面板打开时拖动结束需要更新位置
        document.addEventListener('mouseup', () => {
            if (state.isExpanded) {
                updatePanelPosition();
            }
        });
    };
 
    // 拖动功能
    const startDrag = (e) => {
        // 防止在按钮上拖动
        if (e.target !== floatingBall && !e.target.classList.contains('tm-floating-ball')) return;
        
        state.isDragging = true;
        const rect = floatingBall.getBoundingClientRect();
        state.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        floatingBall.style.cursor = 'grabbing';
        floatingBall.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
        e.preventDefault();
    };
 
    const drag = (e) => {
        if (!state.isDragging) return;
        state.position = {
            x: e.clientX - state.dragOffset.x,
            y: e.clientY - state.dragOffset.y
        };
        updatePosition();
    };
 
    const endDrag = () => {
        if (!state.isDragging) return;
        state.isDragging = false;
        floatingBall.style.cursor = 'grab';
        floatingBall.style.boxShadow = '0 5px 25px rgba(0,0,0,0.3)';
        GM_setValue('tm_position', state.position);
    };
 
    // 更新悬浮球位置
    const updatePosition = () => {
        // 边界检查
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const ballSize = 60;
        const safeX = Math.max(5, Math.min(state.position.x, viewportWidth - ballSize - 5));
        const safeY = Math.max(5, Math.min(state.position.y, viewportHeight - ballSize - 5));
        
        floatingBall.style.left = `${safeX}px`;
        floatingBall.style.top = `${safeY}px`;
        
        // 如果面板是展开状态，同时更新面板位置
        if (state.isExpanded) {
            updatePanelPosition();
        }
    };
 
    // 更新面板位置
    const updatePanelPosition = () => {
        if (!state.isExpanded) return;
        
        const ballRect = floatingBall.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const panelWidth = 350;
        const panelHeight = Math.min(window.innerHeight * 0.7, 500);
        
        // 尝试放在悬浮球下方
        let top = ballRect.bottom + 10;
        let left = ballRect.left;
        
        // 如果下方空间不足，就放在上方
        if (top + panelHeight > viewportHeight) {
            top = ballRect.top - panelHeight - 10;
            if (top < 10) top = 10;
        }
        
        // 水平方向调整，避免超出右边界
        if (left + panelWidth > viewportWidth) {
            left = viewportWidth - panelWidth - 10;
        } else if (left < 10) {
            left = 10;
        }
        
        panelContainer.style.left = `${left}px`;
        panelContainer.style.top = `${top}px`;
    };
 
    // 显示面板
    const showPanel = () => {
        panelContainer.style.display = 'block';
        updatePanelPosition();
        setTimeout(() => {
            panelContainer.classList.add('tm-visible');
        }, 10);
        renderMediaLists();
    };
 
    // 隐藏面板
    const hidePanel = () => {
        panelContainer.classList.remove('tm-visible');
        setTimeout(() => {
            panelContainer.style.display = 'none';
        }, 300);
    };
 
    // 切换面板显示
    const togglePanel = (e) => {
        // 防止拖动时误触发点击
        if (state.isDragging) return;
        
        state.isExpanded = !state.isExpanded;
        if (state.isExpanded) {
            showPanel();
        } else {
            hidePanel();
        }
    };
 
    // 媒体扫描功能
    const scanMedia = debounce(() => {
        try {
            const videoElements = findElements('video');
            const audioElements = findElements('audio');
            
            // 查找带有媒体属性的元素
            const mediaElements = findElements('[data-video-src], [data-audio-src], [data-src], [src*="video"], [src*="audio"]');
            
            processMediaElements(videoElements, SUPPORTED_VIDEO_TYPES, 'video');
            processMediaElements(audioElements, SUPPORTED_AUDIO_TYPES, 'audio');
            processCustomMediaElements(mediaElements);
            
            updateUI();
        } catch (e) {
            console.error('TypeMonkey scan error:', e);
        }
    }, 1000); // 1秒防抖
 
    // 查找元素
    const findElements = (selector) => {
        try {
            return [...document.querySelectorAll(selector)];
        } catch (e) {
            console.error('TypeMonkey querySelector error:', e);
            return [];
        }
    };
 
    // 处理标准媒体元素
    const processMediaElements = (elements, types, mediaType) => {
        const existingUrls = new Set(mediaResources[mediaType].map(m => m.url));
        const newItems = [];
        
        elements.forEach(el => {
            const sources = getSourcesFromElement(el);
            
            sources.forEach(url => {
                if (url && isSupportedMedia(url, types) && !existingUrls.has(url)) {
                    const resource = createMediaResource(url, mediaType, el);
                    if (resource) {
                        mediaResources[mediaType].push(resource);
                        existingUrls.add(url);
                        newItems.push(resource);
                    }
                }
            });
        });
        
        return newItems.length;
    };
 
    // 处理自定义媒体元素
    const processCustomMediaElements = (elements) => {
        const existingUrls = new Set([
            ...mediaResources.video.map(m => m.url),
            ...mediaResources.audio.map(m => m.url)
        ]);
        let count = 0;
        
        elements.forEach(el => {
            let url = null;
            let mediaType = null;
            
            // 检查可能的属性
            const attrs = ['data-video-src', 'data-audio-src', 'src', 'data-src'];
            for (const attr of attrs) {
                if (el.hasAttribute(attr)) {
                    const val = el.getAttribute(attr);
                    if (val) {
                        url = val;
                        if (attr.includes('video') || url.match(/\.(mp4|webm|ogg|mov|mkv|flv|m3u8)(?:$|\?)/i)) {
                            mediaType = 'video';
                            break;
                        } else if (attr.includes('audio') || url.match(/\.(mp3|wav|aac|flac|m4a|ogg|opus)(?:$|\?)/i)) {
                            mediaType = 'audio';
                            break;
                        }
                    }
                }
            }
            
            if (url && mediaType && !existingUrls.has(url)) {
                const types = mediaType === 'video' ? SUPPORTED_VIDEO_TYPES : SUPPORTED_AUDIO_TYPES;
                if (isSupportedMedia(url, types)) {
                    const resource = createMediaResource(url, mediaType, el);
                    if (resource) {
                        mediaResources[mediaType].push(resource);
                        existingUrls.add(url);
                        count++;
                    }
                }
            }
        });
        
        return count;
    };
 
    // 创建媒体资源对象
    const createMediaResource = (url, type, element) => {
        try {
            // 验证URL是否为有效的HTTP/HTTPS地址
            const urlObj = new URL(url);
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return null;
            }
            
            const domain = urlObj.hostname.replace(/^www\./, '');
            return {
                url,
                type,
                element,
                id: `tm-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                title: `${domain.substring(0, 15)}_${type}_${mediaResources[type].length + 1}`,
                added: Date.now()
            };
        } catch (e) {
            console.error('TypeMonkey resource error:', e);
            return null;
        }
    };
 
    // 从元素获取源URL
    const getSourcesFromElement = (el) => {
        const sources = new Set();
        
        // 检查主src属性
        if (el.src) {
            sources.add(el.src);
        }
        
        // 检查source子元素
        if (el.querySelectorAll) {
            el.querySelectorAll('source').forEach(source => {
                if (source.src) {
                    sources.add(source.src);
                }
            });
        }
        
        // 检查video poster可能会伪装成src
        if (el.hasAttribute('poster')) {
            const poster = el.getAttribute('poster');
            if (poster) {
                sources.add(poster);
            }
        }
        
        return [...sources];
    };
 
    // 检查支持的媒体类型
    const isSupportedMedia = (url, types) => {
        if (!url) return false;
        
        try {
            // 验证URL有效性
            const urlObj = new URL(url);
            if (!['http:', 'https:', 'blob:', 'data:'].includes(urlObj.protocol)) {
                return false;
            }
        } catch (e) {
            return false;
        }
        
        const normalizedUrl = url.toLowerCase();
        
        // 特殊处理data URLs
        if (normalizedUrl.startsWith('data:')) {
            return types.some(type => {
                if (type === 'mp4' && normalizedUrl.includes('video/mp4')) return true;
                if (type === 'webm' && normalizedUrl.includes('video/webm')) return true;
                if (type === 'mp3' && normalizedUrl.includes('audio/mp3')) return true;
                if (type === 'wav' && normalizedUrl.includes('audio/wav')) return true;
                return false;
            });
        }
        
        // 提取文件扩展名，支持更多格式
        const extensionMatch = normalizedUrl.match(/\.([a-z0-9]+)(?:[?#&]|$)/);
        const extension = extensionMatch ? extensionMatch[1] : '';
        
        return types.some(type => {
            // 检查文件扩展名
            if (extension === type) return true;
            
            // 特殊检查HLS流媒体
            if (type === 'm3u8' && (normalizedUrl.includes('m3u8') || normalizedUrl.includes('.ts'))) return true;
            
            // 检查URL中包含的媒体关键词
            if (normalizedUrl.includes(`/${type}/`) || normalizedUrl.includes(`_${type}_`)) return true;
            
            return false;
        });
    };
 
    // 更新UI
    const updateUI = () => {
        try {
            const videoCount = mediaResources.video.length;
            const audioCount = mediaResources.audio.length;
            const total = videoCount + audioCount;
            
            // 更新悬浮球计数
            const countElement = document.getElementById('tm-resource-count');
            if (countElement) {
                countElement.textContent = total;
            }
            
            // 更新标签页计数
            const videoCountElement = document.getElementById('tm-video-count');
            const audioCountElement = document.getElementById('tm-audio-count');
            if (videoCountElement) videoCountElement.textContent = videoCount;
            if (audioCountElement) audioCountElement.textContent = audioCount;
            
            // 显示或隐藏悬浮球
            if (total > 0) {
                floatingBall.style.display = 'flex';
                setTimeout(() => {
                    floatingBall.classList.add('tm-visible');
                }, 100);
            } else {
                floatingBall.classList.remove('tm-visible');
                setTimeout(() => {
                    floatingBall.style.display = 'none';
                }, 300);
            }
            
            // 如果面板已展开，则刷新列表
            if (state.isExpanded) {
                renderMediaLists();
            }
        } catch (e) {
            console.error('TypeMonkey updateUI error:', e);
        }
    };
 
    // 生成媒体卡片
    const generateMediaCard = (resource) => {
        const card = document.createElement('div');
        card.className = 'tm-media-card';
        card.dataset.id = resource.id;
        
        // 安全HTML生成
        const domain = new URL(resource.url).hostname;
        const filename = resource.url.substring(resource.url.lastIndexOf('/') + 1).split('?')[0];
        const extension = filename.split('.').pop();
        const isVideo = resource.type === 'video';
        
        card.innerHTML = `
            <div class="tm-media-header">
                <div class="tm-media-title">
                    <i class="${isVideo ? 'fas fa-video' : 'fas fa-music'}"></i>
                    ${escapeHTML(filename.substring(0, 30))}${filename.length > 30 ? '...' : ''}
                    <span class="tm-media-type">${isVideo ? '视频' : '音频'}</span>
                </div>
            </div>
            <div class="tm-media-url">
                <div class="tm-domain">${escapeHTML(domain)}</div>
                <div>${escapeHTML(truncateText(filename, 70))}</div>
            </div>
            <div class="tm-media-actions">
                <button class="tm-btn tm-btn-copy" data-id="${escapeHTML(resource.id)}">
                    <i class="fas fa-copy"></i> 复制
                </button>
                <button class="tm-btn tm-btn-download" data-id="${escapeHTML(resource.id)}">
                    <i class="fas fa-download"></i> 下载
                </button>
            </div>
        `;
        
        // 添加复制功能
        const copyBtn = card.querySelector('.tm-btn-copy');
        copyBtn.addEventListener('click', function() {
            GM_setClipboard(resource.url);
            showNotification('链接已复制到剪贴板！');
        });
        
        // 添加下载功能 - 修复下载问题
        const downloadBtn = card.querySelector('.tm-btn-download');
        downloadBtn.addEventListener('click', function() {
            try {
                // 验证URL有效性
                if (!resource.url.startsWith('http')) {
                    showNotification('错误：无效的资源URL');
                    return;
                }
 
                // 获取更合适的文件名
                const url = resource.url;
                const safeFilename = filename.replace(/[/\\:*?"<>|]/g, '_');
                const cleanExtension = extension.replace(/[^a-z0-9]/gi, '');
                const finalFilename = safeFilename.endsWith(`.${cleanExtension}`) ? 
                                    safeFilename : 
                                    `${safeFilename}.${cleanExtension || (isVideo ? 'mp4' : 'mp3')}`;
                
                showNotification(`开始下载: ${finalFilename}`);
                
                // 修复GM_download调用
                GM_download(url, finalFilename, null, {
                    onload: function() {
                        showNotification('下载成功！');
                    },
                    onerror: function(error) {
                        showNotification(`下载失败: ${error.error || '未知错误'}`);
                    }
                });
            } catch (e) {
                showNotification('下载失败: ' + e.message);
                console.error('TypeMonkey download error:', e);
            }
        });
        
        return card;
    };
 
    // 渲染媒体列表
    const renderMediaLists = () => {
        try {
            // 视频资源处理
            const videoPlaceholder = videoContainer.querySelector('.tm-empty-placeholder');
            if (mediaResources.video.length > 0) {
                if (videoPlaceholder) videoPlaceholder.remove();
                videoContainer.innerHTML = '';
                mediaResources.video.forEach(resource => {
                    videoContainer.appendChild(generateMediaCard(resource));
                });
            } else if (!videoPlaceholder) {
                videoContainer.innerHTML = `
                    <div class="tm-empty-placeholder">
                        <i class="fas fa-search"></i>
                        <p>未找到视频资源</p>
                    </div>
                `;
            }
            
            // 音频资源处理
            const audioPlaceholder = audioContainer.querySelector('.tm-empty-placeholder');
            if (mediaResources.audio.length > 0) {
                if (audioPlaceholder) audioPlaceholder.remove();
                audioContainer.innerHTML = '';
                mediaResources.audio.forEach(resource => {
                    audioContainer.appendChild(generateMediaCard(resource));
                });
            } else if (!audioPlaceholder) {
                audioContainer.innerHTML = `
                    <div class="tm-empty-placeholder">
                        <i class="fas fa-search"></i>
                        <p>未找到音频资源</p>
                    </div>
                `;
            }
        } catch (e) {
            console.error('TypeMonkey renderMediaLists error:', e);
        }
    };
 
    // 显示通知
    const showNotification = (message) => {
        try {
            notification.textContent = message;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.classList.add('tm-show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('tm-show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 300);
            }, 2000);
        } catch (e) {
            console.error('TypeMonkey showNotification error:', e);
        }
    };
 
    // 工具函数：转义HTML
    const escapeHTML = (str) => {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };
 
    // 工具函数：截断文本
    const truncateText = (text, maxLen) => {
        if (!text) return '';
        return text.length > maxLen ? `${text.substring(0, maxLen)}...` : text;
    };
 
    // 添加CSS样式
    const addStyles = () => {
        GM_addStyle(`
            .tm-floating-ball {
                position: fixed;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #FF9800, #FF5722);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 20px;
                cursor: grab;
                box-shadow: 0 5px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                transition: all 0.4s ease;
                opacity: 0;
                transform: scale(0) rotate(180deg);
                user-select: none;
                touch-action: none;
            }
            
            .tm-floating-ball.tm-visible {
                opacity: 1;
                transform: scale(1) rotate(0deg);
            }
            
            .tm-floating-ball:hover {
                transform: scale(1.05) !important;
                box-shadow: 0 7px 30px rgba(0,0,0,0.4);
            }
            
            /* 主面板容器 */
            .tm-panel-container {
                position: fixed;
                width: 350px;
                max-width: 90vw;
                max-height: 70vh;
                background: white;
                border-radius: 15px;
                box-shadow: 0 15px 50px rgba(0,0,0,0.3);
                z-index: 9999;
                overflow: hidden;
                transform: translateY(20px);
                opacity: 0;
                transition: all 0.4s ease;
                display: none;
            }
            
            .tm-panel-container.tm-visible {
                transform: translateY(0);
                opacity: 1;
            }
            
            .tm-panel-header {
                background: linear-gradient(135deg, #1a2a6c, #4A00E0);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .tm-panel-title {
                font-size: 1.2rem;
                font-weight: 600;
            }
            
            .tm-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.3rem;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.3s;
            }
            
            .tm-close-btn:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .tm-tabs {
                display: flex;
                background: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .tm-tab {
                padding: 12px 20px;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: 600;
                color: #666;
                border-bottom: 3px solid transparent;
                flex: 1;
                text-align: center;
                position: relative;
            }
            
            .tm-tab.tm-active {
                color: #1a2a6c;
                border-bottom: 3px solid #FF9800;
                background: rgba(255, 152, 0, 0.05);
            }
            
            .tm-tab:hover:not(.tm-active) {
                background: rgba(0, 0, 0, 0.03);
            }
            
            .tm-tab-count {
                font-size: 0.75em;
                background: rgba(26, 42, 108, 0.1);
                color: #1a2a6c;
                padding: 2px 6px;
                border-radius: 20px;
                margin-left: 6px;
            }
            
            .tm-content {
                padding: 15px;
                max-height: 50vh;
                overflow-y: auto;
            }
            
            .tm-tab-content {
                display: none;
            }
            
            .tm-tab-content.tm-active {
                display: block;
            }
            
            .tm-media-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .tm-media-card {
                background: #f8f9fa;
                border-radius: 10px;
                overflow: hidden;
                border: 1px solid #e0e0e0;
                transition: all 0.3s ease;
            }
            
            .tm-media-card:hover {
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                transform: translateY(-2px);
            }
            
            .tm-media-header {
                padding: 12px 15px;
                background: rgba(26, 42, 108, 0.05);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .tm-media-title {
                font-size: 0.95rem;
                font-weight: 600;
                color: #333;
                display: flex;
                align-items: center;
                gap: 8px;
                flex: 1;
                overflow: hidden;
            }
            
            .tm-media-type {
                font-size: 0.8rem;
                background: #1a2a6c;
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                flex-shrink: 0;
            }
            
            .tm-media-url {
                font-size: 0.75rem;
                color: #666;
                word-break: break-all;
                padding: 10px 15px;
                line-height: 1.5;
                border-top: 1px dashed #e0e0e0;
            }
            
            .tm-domain {
                color: #2196F3;
                font-weight: 500;
                margin-bottom: 4px;
            }
            
            .tm-media-actions {
                display: flex;
                gap: 10px;
                padding: 10px 15px;
                border-top: 1px solid #f0f0f0;
            }
            
            .tm-btn {
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.2s;
                flex: 1;
                justify-content: center;
            }
            
            .tm-btn-copy {
                background: #4CAF50;
                color: white;
            }
            
            .tm-btn-copy:hover {
                background: #388E3C;
                transform: translateY(-2px);
            }
            
            .tm-btn-download {
                background: #2196F3;
                color: white;
            }
            
            .tm-btn-download:hover {
                background: #1976D2;
                transform: translateY(-2px);
            }
            
            .tm-empty-placeholder {
                text-align: center;
                padding: 30px 20px;
                color: #777;
                font-size: 0.9rem;
            }
            
            .tm-empty-placeholder i {
                font-size: 2rem;
                color: #ccc;
                margin-bottom: 15px;
            }
            
            .tm-notification {
                position: fixed;
                top: 20px;
                right: -100%;
                padding: 12px 20px;
                border-radius: 8px;
                background: #4CAF50;
                color: white;
                font-weight: 500;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                transition: right 0.5s ease;
                z-index: 10000;
                font-size: 0.9rem;
                max-width: 300px;
            }
            
            .tm-notification.tm-show {
                right: 20px;
            }
        `);
    };
 
    // 初始化MutationObserver
    const initMutationObserver = () => {
        if (state.mutationObserver) {
            state.mutationObserver.disconnect();
        }
        
        state.mutationObserver = new MutationObserver(mutations => {
            let mediaChanged = false;
            
            mutations.forEach(mutation => {
                // 添加节点检查
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType !== 1) continue;
                        
                        if (node.matches('video, audio, [data-video-src], [data-audio-src], [data-src]') || 
                            node.querySelector('video, audio, [data-video-src], [data-audio-src], [data-src]')) {
                            mediaChanged = true;
                            break;
                        }
                    }
                }
                
                // 属性变化检查
                if (mutation.type === 'attributes') {
                    const attr = mutation.attributeName;
                    if (attr === 'src' || attr === 'data-src' || attr === 'data-video-src' || attr === 'data-audio-src') {
                        mediaChanged = true;
                    }
                }
            });
            
            if (mediaChanged) {
                scanMedia();
            }
        });
        
        state.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'data-src', 'data-video-src', 'data-audio-src']
        });
    };
 
    // 清理资源
    const cleanup = () => {
        if (state.scanInterval) {
            clearInterval(state.scanInterval);
            state.scanInterval = null;
        }
        
        if (state.mutationObserver) {
            state.mutationObserver.disconnect();
            state.mutationObserver = null;
        }
        
        // 移除事件监听
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('mouseleave', endDrag);
    };
 
    // 初始化
    const init = () => {
        try {
            // 确保在正确的环境中运行
            if (typeof GM_download === 'undefined' || typeof GM_setClipboard === 'undefined') {
                console.warn('TypeMonkey: 缺少必要的GM函数，请确保在支持的用户脚本管理器中运行');
                return;
            }
            
            cleanup();
            addStyles();
            createUI();
            
            // 初始扫描
            scanMedia();
            
            // 设置安全扫描间隔（每分钟扫描一次）
            state.scanInterval = setInterval(scanMedia, 60000);
            
            // 初始化MutationObserver
            initMutationObserver();
            
            // 窗口大小变化时重新定位
            window.addEventListener('resize', updatePosition);
            
            console.log('TypeMonkey 初始化成功');
        } catch (e) {
            console.error('TypeMonkey initialization failed:', e);
            // 重试机制
            setTimeout(() => {
                console.log('TypeMonkey 尝试重新初始化...');
                init();
            }, 3000);
        }
    };

    // 页面卸载时清理
    window.addEventListener('beforeunload', cleanup);

    // 页面加载完成后初始化 - 改进的初始化时机
    const startInit = () => {
        if (document.readyState === 'complete') {
            setTimeout(init, 500);
        } else if (document.readyState === 'interactive') {
            setTimeout(init, 1000);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 1000);
            });
            // 备用方案
            setTimeout(init, 3000);
        }
    };
    
    startInit();
})();
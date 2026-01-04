// ==UserScript==
// @name         Anime1 本地收藏夹
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  站内收藏管理功能（支持集数保存）
// @author       zhist
// @match        https://anime1.me/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537771/Anime1%20%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/537771/Anime1%20%E6%9C%AC%E5%9C%B0%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 样式配置
    GM_addStyle(`
        .anime1-collect-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(255,71,87,0.4);
            transition: all 0.3s;
            font-weight: bold;
        }
        .anime1-collect-btn:hover {
            transform: scale(1.05);
            background: #ff6b81;
        }
        .bookmarks-panel {
            position: fixed;
            top: 70px;
            right: 20px;
            width: 350px;
            background: rgba(255,255,255,0.95);
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            backdrop-filter: blur(10px);
            padding: 15px;
            display: none;
            max-height: 70vh;
            overflow-y: auto;
        }
        .bookmark-item {
            display: flex;
            align-items: center;
            padding: 12px;
            margin: 8px 0;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            transition: transform 0.2s;
        }
        .bookmark-item:hover {
            transform: translateX(5px);
        }
        .bookmark-content {
            flex: 1;
            overflow: hidden;
        }
        .bookmark-link {
            display: block;
            color: #2f3542;
            text-decoration: none;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 500;
        }
        .bookmark-episode {
            font-size: 0.85em;
            color: #ff6b81;
            margin-top: 2px;
            font-weight: bold;
        }
        .bookmark-time {
            font-size: 0.75em;
            color: #999;
            margin-top: 2px;
        }
        .delete-btn {
            color: #ff4757;
            cursor: pointer;
            margin-left: 10px;
            padding: 3px;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            flex-shrink: 0;
        }
        .delete-btn:hover {
            background: #ffe4e6;
        }
        .episode-indicator {
            background: #ff6b81;
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 0.75em;
            margin-left: 8px;
            font-weight: bold;
        }
    `);

    const watchedSet = new Set();

    // 存储系统初始化
    const STORAGE_KEY = 'anime1_bookmarks';
    let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let currentEpisode = null;


    const btn = createCollectButton();

    // 保存收藏数据
    function saveBookmarks() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }

    function setCurrentEpisode(episode) {
        if (!watchedSet.has(episode)) {
            watchedSet.add(episode);
            currentEpisode = episode;
            console.log('更新currentEpisode:', episode);
            updateButtonText(btn);
            updateEpisode(btn)
        }
    }

    // 从URL中提取集数
    // function extractEpisodeFromUrl(url) {
    //     // 匹配类似 https://hajime.v.anime1.me/1623/9.mp4 的格式
    //     const match = url.match(/\/(\d+)\.mp4$/);
    //     return match ? parseInt(match[1]) : null;
    // }
    // 从URL中提取集数
    function extractEpisodeFromUrl(url) {
        // 匹配类似以下格式的URL:
        // https://hajime.v.anime1.me/1623/9.mp4 → 集数: 9
        // https://bocchi.v.anime1.me/1655/8b.mp4 → 集数: 8
        // 格式: /数字/集数数字+其它什么.mp4，但只提取开头的数字部分
        const match = url.match(/\/\d+\/(\d+)[^\/]*\.mp4$/);
        return match ? parseInt(match[1]) : null;
    }

    // 监听所有网络请求来捕获视频URL
    function interceptNetworkRequests() {
        // 拦截XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            if (url.includes('.mp4') && url.includes('anime1.me')) {
                const episode = extractEpisodeFromUrl(url);
                if (episode !== null) {
                    setCurrentEpisode(episode);
                    console.log('检测到视频集数:', episode);
                }
            }
            return originalXHROpen.call(this, method, url, ...args);
        };

        // 拦截fetch请求
        const originalFetch = window.fetch;
        window.fetch = function (url, ...args) {
            if (typeof url === 'string' && url.includes('.mp4') && url.includes('anime1.me')) {
                const episode = extractEpisodeFromUrl(url);
                if (episode !== null) {
                    setCurrentEpisode(episode);
                    console.log('检测到视频集数:', episode);
                    updateEpisodeIfSaved(episode)
                }
            }
            return originalFetch.call(this, url, ...args);
        };
    }

    // 监听所有网络流量（包括video标签的src变化）
    function monitorVideoElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                    const target = mutation.target;
                    if (target.tagName === 'VIDEO' || target.tagName === 'SOURCE') {
                        const src = target.src || target.getAttribute('src');
                        if (src && src.includes('.mp4') && src.includes('anime1.me')) {
                            const episode = extractEpisodeFromUrl(src);
                            if (episode !== null) {
                                setCurrentEpisode(episode);
                                console.log('检测到视频集数:', episode);
                            }
                        }
                    }
                }

                // 检查新增的video元素
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const videos = node.tagName === 'VIDEO' ? [node] : node.querySelectorAll('video');
                            videos.forEach((video) => {
                                if (video.src && video.src.includes('.mp4') && video.src.includes('anime1.me')) {
                                    const episode = extractEpisodeFromUrl(video.src);
                                    if (episode !== null) {
                                        setCurrentEpisode(episode);
                                        console.log('检测到视频集数:', episode);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    // 定期检查页面中的视频元素
    function checkExistingVideos() {
        const videos = document.querySelectorAll('video, source');
        videos.forEach((video) => {
            const src = video.src || video.getAttribute('src');
            if (src && src.includes('.mp4') && src.includes('anime1.me')) {
                const episode = extractEpisodeFromUrl(src);
                if (episode !== null) {
                    setCurrentEpisode(episode);
                    // console.log('检测到视频集数:', episode);

                }
            }
        });
    }

    // 判断当前是否视频页面
    function isVideoPage() {
        return location.pathname.includes('/category');
    }

    // 判断当前视频是否被藏
    function isFavorited() {
        const currentUrl = location.href;
        const existingIndex = bookmarks.findIndex(b => b.url === currentUrl);
        return existingIndex;
    }

    // 创建收藏按钮
    function createCollectButton() {
        const btn = document.createElement('button');
        btn.className = 'anime1-collect-btn';
        updateButtonText(btn);
        return btn;
    }

    // 更新按钮文本
    function updateButtonText(btn) {
        if (isVideoPage()) {
            if (isFavorited() === -1) {
                const episodeText = currentEpisode ? ` (第${currentEpisode}集)` : '';
                btn.innerHTML = `⭐ 收藏本视频${episodeText}`;
            } else {
                btn.innerHTML = '📚 查看收藏夹';
            }
        } else {
            btn.innerHTML = '📚 查看收藏夹';
        }
    }

    // 创建收藏面板
    function createBookmarkPanel() {
        const panel = document.createElement('div');
        panel.className = 'bookmarks-panel';
        return panel;
    }

    // 格式化时间
    function formatTime(timeString) {
        const date = new Date(timeString);
        return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // 渲染收藏列表
    function renderBookmarks(panel) {
        panel.innerHTML = bookmarks.length ?
            bookmarks.map((b, i) => `
                <div class="bookmark-item">
                    <div class="bookmark-content">
                        <a href="${b.url}" class="bookmark-link" target="_blank">${b.title}</a>
                        ${b.episode ? `<div class="bookmark-episode">第 ${b.episode} 集</div>` : ''}
                        <div class="bookmark-time">${formatTime(b.time)}</div>
                    </div>
                    <div class="delete-btn" data-index="${i}">×</div>
                </div>
            `).join('') :
            '<div style="text-align:center; color:#666; padding: 20px;">暂无收藏内容</div>';
    }

    // 更新集数
    function updateEpisode(btn) {
        let existingIndex, r1, r2, r3, r4;
        // 更新现有收藏的集数信息
        // console.log('try to update episode : ' + currentEpisode)
        if ((r1 = currentEpisode) &&
            // (r2=!watchedSet.has(currentEpisode)) &&
            (r3 = (existingIndex = isFavorited()) !== -1) &&
            (r4 = bookmarks[existingIndex].episode !== currentEpisode)) {
            bookmarks[existingIndex].episode = currentEpisode;
            bookmarks[existingIndex].time = new Date().toISOString(); // 更新时间
            saveBookmarks();
            btn.innerHTML = `🔄 已更新至第${currentEpisode}集！`;
            setTimeout(() => updateButtonText(btn), 2000);
        }
        console.log(r1, r2, r3, r4)
        // else {
        //     btn.innerHTML = '⚠️ 已存在！';
        //     setTimeout(() => updateButtonText(btn), 1000);
        // }
    }

    // 主逻辑
    function init() {
        // 启动网络监听
        interceptNetworkRequests();
        monitorVideoElements();

        // 定期检查视频元素
        setInterval(checkExistingVideos, 2000);

        const container = document.createElement('div');
        const panel = createBookmarkPanel();

        document.body.appendChild(btn);
        document.body.appendChild(panel);

        // 定期更新按钮文本（当检测到新集数时）
        // setInterval(() => {
        updateButtonText(btn);
        updateEpisode(btn)
        // }, 1000);

        // 按钮点击事件
        btn.addEventListener('click', () => {
            if (isVideoPage()) {
                // 收藏当前页面
                const currentUrl = location.href;
                const currentTitle = document.title;

                const existingIndex = bookmarks.findIndex(b => b.url === currentUrl);

                if (existingIndex === -1) {
                    // 新增收藏
                    bookmarks.unshift({
                        title: currentTitle,
                        url: currentUrl,
                        episode: currentEpisode,
                        time: new Date().toISOString()
                    });
                    saveBookmarks();
                    btn.innerHTML = `✅ 已收藏！${currentEpisode ? ` (第${currentEpisode}集)` : ''}`;
                    setTimeout(() => updateButtonText(btn), 1500);
                } else {
                    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                    if (panel.style.display === 'block') renderBookmarks(panel);
                }
            } else {
                // 切换收藏面板
                panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
                if (panel.style.display === 'block') renderBookmarks(panel);
            }
        });

        // 删除功能
        panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = parseInt(e.target.dataset.index);
                bookmarks.splice(index, 1);
                saveBookmarks();
                renderBookmarks(panel);
                updateButtonText(btn);
            }
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !panel.contains(e.target)) {
                panel.style.display = 'none';
            }
        });
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
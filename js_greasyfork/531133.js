// ==UserScript==
// @license MIT
// @name         YouTube 4K 视频过滤器 - 高级版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  通过检查视频设置菜单识别并筛选YouTube上的4K视频
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/531133/YouTube%204K%20%E8%A7%86%E9%A2%91%E8%BF%87%E6%BB%A4%E5%99%A8%20-%20%E9%AB%98%E7%BA%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531133/YouTube%204K%20%E8%A7%86%E9%A2%91%E8%BF%87%E6%BB%A4%E5%99%A8%20-%20%E9%AB%98%E7%BA%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储空间键名
    const STORAGE_KEY = 'youtube_4k_videos';
    const SCANNING_KEY = 'youtube_4k_scanning';
    const buttonId = 'yt-4k-filter-button';
    const scanButtonId = 'yt-4k-scan-button';
    const badgeClass = 'yt-4k-badge';
    
    // 存储和获取4K视频记录
    function saveVideoQuality(videoId, is4K) {
        const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        storage[videoId] = {
            is4K: is4K,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
        console.log(`保存视频 ${videoId} 4K状态: ${is4K}`);
    }
    
    function getVideoQuality(videoId) {
        const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return storage[videoId] || null;
    }
    
    function getAllVideoQualities() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    }
    
    // 检测是否在视频详情页
    function isVideoPage() {
        return window.location.pathname === '/watch';
    }
    
    // 检测是否在频道或浏览页面
    function isListingPage() {
        const path = window.location.pathname;
        return path.includes('/channel/') || 
               path.includes('/c/') || 
               path.includes('/user/') || 
               path.includes('/@') ||
               path === '/' ||
               path.includes('/results') ||
               path.includes('/feed/');
    }
    
    // 从URL中提取视频ID
    function extractVideoId(url) {
        const regExp = /(?:\/|v=)([a-zA-Z0-9_-]{11})(?:\?|&|\/|$)/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
    
    // 获取当前视频ID
    function getCurrentVideoId() {
        if (isVideoPage()) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('v');
        }
        return null;
    }
    
    // === 视频页面功能 ===
    
    // 检查当前视频是否有4K选项
    async function checkCurrentVideoFor4K() {
        const videoId = getCurrentVideoId();
        if (!videoId) return;
        
        // 如果已经检查过此视频，则跳过
        const existingData = getVideoQuality(videoId);
        if (existingData) {
            console.log(`视频 ${videoId} 已检查过，跳过`);
            return;
        }
        
        console.log(`检查视频 ${videoId} 是否有4K选项`);
        
        try {
            // 等待视频播放器加载
            await waitForElement('button.ytp-settings-button');
            
            // 检查是否在播放广告，如果是，等待广告结束
            await waitForAdToFinish();
            
            // 点击设置按钮
            const settingsButton = document.querySelector('button.ytp-settings-button');
            settingsButton.click();
            await sleep(300);
            
            // 点击质量选项
            const qualityButton = Array.from(document.querySelectorAll('.ytp-panel-menu .ytp-menuitem'))
                .find(el => el.textContent.includes('画质') || el.textContent.includes('Quality'));
            
            if (qualityButton) {
                qualityButton.click();
                await sleep(300);
                
                // 检查是否有4K选项
                const qualityOptions = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem');
                let has4K = false;
                
                qualityOptions.forEach(option => {
                    const text = option.textContent.trim();
                    if (text.includes('2160p') || text.includes('4K')) {
                        has4K = true;
                        console.log(`发现4K选项: ${text}`);
                    }
                });
                
                // 保存结果
                saveVideoQuality(videoId, has4K);
                
                // 关闭菜单
                const closeButton = document.querySelector('.ytp-popup .ytp-panel-back-button');
                if (closeButton) closeButton.click();
                await sleep(100);
                settingsButton.click();
                
                // 如果是由扫描模式打开的，向列表页面发送消息并关闭此页面
                if (isScanningMode()) {
                    // 将此视频标记为已扫描
                    markVideoAsScanned(videoId);
                    
                    // 1秒后关闭页面
                    setTimeout(() => {
                        window.close();
                    }, 1000);
                }
            }
        } catch (error) {
            console.error('检查视频质量时出错:', error);
            
            // 如果是扫描模式，仍然标记为已扫描，避免卡住
            if (isScanningMode()) {
                markVideoAsScanned(videoId);
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
        }
    }
    
    // 检查并等待广告结束
    async function waitForAdToFinish() {
        // 检查是否存在广告标识
        const isAdPlaying = () => {
            return Boolean(
                document.querySelector('.ytp-ad-text') || 
                document.querySelector('.ytp-ad-preview-container') ||
                document.querySelector('.ytp-ad-skip-button') ||
                document.querySelector('[class*="ytp-ad"]')?.textContent?.includes('广告')
            );
        };
        
        let adWaitTime = 0;
        const maxWaitTime = 90000; // 最多等待90秒
        const checkInterval = 1000; // 每秒检查一次
        
        if (isAdPlaying()) {
            console.log('检测到广告播放，等待广告结束...');
            
            // 等待广告结束
            while (isAdPlaying() && adWaitTime < maxWaitTime) {
                await sleep(checkInterval);
                adWaitTime += checkInterval;
                
                // 如果找到跳过广告按钮，尝试点击
                const skipButton = document.querySelector('.ytp-ad-skip-button');
                if (skipButton && skipButton.offsetParent !== null) {
                    console.log('点击跳过广告按钮');
                    skipButton.click();
                    await sleep(500);
                }
            }
            
            if (adWaitTime >= maxWaitTime) {
                console.log('广告等待超时，继续执行');
            } else {
                console.log('广告播放结束');
                // 广告结束后额外等待一小段时间，确保界面恢复正常
                await sleep(1000);
            }
        }
    }
    
    // 等待元素出现
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // 设置超时
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`等待元素 ${selector} 超时`));
            }, timeout);
        });
    }
    
    // 睡眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // === 列表页面功能 ===
    
    // 创建4K过滤按钮
    function createFilterButton() {
        if (document.getElementById(buttonId)) return;
        
        console.log('创建4K过滤按钮');
        
        const container = document.createElement('div');
        container.id = 'yt-4k-filter-container';
        container.style.position = 'fixed';
        container.style.top = '120px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        
        // 过滤按钮
        const filterButton = document.createElement('button');
        filterButton.id = buttonId;
        filterButton.textContent = '显示4K视频';
        filterButton.style.padding = '10px 16px';
        filterButton.style.backgroundColor = 'red';
        filterButton.style.color = 'white';
        filterButton.style.border = '2px solid white';
        filterButton.style.borderRadius = '4px';
        filterButton.style.cursor = 'pointer';
        filterButton.style.fontWeight = 'bold';
        filterButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
        filterButton.addEventListener('click', toggleFilter);
        
        // 扫描按钮
        const scanButton = document.createElement('button');
        scanButton.id = scanButtonId;
        scanButton.textContent = '扫描4K视频';
        scanButton.style.padding = '10px 16px';
        scanButton.style.backgroundColor = 'blue';
        scanButton.style.color = 'white';
        scanButton.style.border = '2px solid white';
        scanButton.style.borderRadius = '4px';
        scanButton.style.cursor = 'pointer';
        scanButton.style.fontWeight = 'bold';
        scanButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
        scanButton.addEventListener('click', startScanningVideos);
        
        // 改进后的状态显示
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'yt-4k-status';
        statusDisplay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        statusDisplay.style.color = 'white';
        statusDisplay.style.padding = '10px';
        statusDisplay.style.borderRadius = '4px';
        statusDisplay.style.fontSize = '14px';
        statusDisplay.style.fontWeight = 'bold';
        statusDisplay.style.minWidth = '200px';
        statusDisplay.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        statusDisplay.style.display = 'none';
        statusDisplay.style.transition = 'opacity 0.1s';
        
        container.appendChild(filterButton);
        container.appendChild(scanButton);
        container.appendChild(statusDisplay);
        document.body.appendChild(container);
    }
    
    // 更新状态显示
    function updateStatus(message, show = true) {
        const statusEl = document.getElementById('yt-4k-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.display = show ? 'block' : 'none';
            
            // 强制重新渲染状态框，确保内容更新
            statusEl.style.opacity = '0.99';
            setTimeout(() => {
                statusEl.style.opacity = '1';
            }, 50);
            
            // 将状态消息记录到控制台，便于调试
            console.log(`状态更新: ${message}`);
        }
    }
    
    // 切换过滤状态
    let filterActive = false;
    function toggleFilter() {
        filterActive = !filterActive;
        const button = document.getElementById(buttonId);
        
        if (filterActive) {
            button.textContent = '筛选所有视频';
            button.style.backgroundColor = 'green';
            
            const storage = getAllVideoQualities();
            let count4K = 0;
            
            // 筛选视频
            const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
            videoElements.forEach(video => {
                const linkElement = video.querySelector('a#thumbnail') || 
                                   video.querySelector('a.yt-simple-endpoint');
                
                if (!linkElement || !linkElement.href) return;
                
                const videoId = extractVideoId(linkElement.href);
                if (!videoId) return;
                
                const qualityData = storage[videoId];
                const is4K = qualityData && qualityData.is4K;
                
                if (is4K) {
                    count4K++;
                    // 添加4K标记
                    if (!video.querySelector(`.${badgeClass}`)) {
                        addBadgeToVideo(video, linkElement);
                    }
                    video.style.display = '';
                } else {
                    video.style.display = 'none';
                }
            });
            
            updateStatus(`找到 ${count4K} 个4K视频`);
        } else {
            button.textContent = '显示4K视频';
            button.style.backgroundColor = 'red';
            
            // 恢复所有视频显示
            document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer').forEach(video => {
                video.style.display = '';
            });
            
            updateStatus('', false);
        }
    }
    
    // 为视频添加4K标记
    function addBadgeToVideo(videoElement, linkElement) {
        // 检查是否已存在标签
        if (videoElement.querySelector(`.${badgeClass}`)) return;
        
        // 直接在视频元素上添加标记，而不是在缩略图链接上
        const badge = document.createElement('div');
        badge.className = badgeClass;
        badge.textContent = '4K';
        badge.style.position = 'absolute';
        badge.style.top = '5px';
        badge.style.right = '5px';
        badge.style.backgroundColor = 'red';
        badge.style.color = 'white';
        badge.style.padding = '3px 6px';
        badge.style.borderRadius = '3px';
        badge.style.fontWeight = 'bold';
        badge.style.fontSize = '12px';
        badge.style.zIndex = '100';
        badge.style.pointerEvents = 'none'; // 防止点击干扰
        
        // 查找更合适的容器
        const thumbnailContainer = videoElement.querySelector('#thumbnail') || 
                                 videoElement.querySelector('.yt-simple-endpoint');
        
        if (thumbnailContainer) {
            // 使用relative定位，这样不会破坏布局
            const currentPosition = window.getComputedStyle(thumbnailContainer).position;
            if (currentPosition === 'static') {
                thumbnailContainer.style.position = 'relative';
            }
            
            // 确保缩略图容器已有相对或绝对定位
            thumbnailContainer.appendChild(badge);
        } else {
            // 备用方法：如果找不到合适的容器，创建一个覆盖层
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '10';
            overlay.appendChild(badge);
            
            // 找到卡片的第一个子元素并插入
            const firstChild = videoElement.firstElementChild;
            if (firstChild) {
                const currentPosition = window.getComputedStyle(firstChild).position;
                if (currentPosition === 'static') {
                    firstChild.style.position = 'relative';
                }
                firstChild.appendChild(overlay);
            }
        }
    }
    
    // 扫描功能
    function isScanningMode() {
        return localStorage.getItem(SCANNING_KEY) === 'true';
    }
    
    function setScanningMode(isScanning) {
        localStorage.setItem(SCANNING_KEY, isScanning ? 'true' : 'false');
    }
    
    function markVideoAsScanned(videoId) {
        const scannedVideos = JSON.parse(localStorage.getItem('scanned_videos') || '[]');
        if (!scannedVideos.includes(videoId)) {
            scannedVideos.push(videoId);
            localStorage.setItem('scanned_videos', JSON.stringify(scannedVideos));
        }
    }
    
    function isVideoScanned(videoId) {
        const scannedVideos = JSON.parse(localStorage.getItem('scanned_videos') || '[]');
        return scannedVideos.includes(videoId);
    }
    
    // 自动滚动加载所有视频
    async function scrollToLoadAllVideos() {
        updateStatus('正在加载所有视频...', true);
        
        // 记录初始视频数量
        let previousCount = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer').length;
        let sameCountTimes = 0;
        let maxScrollAttempts = 100; // 最大滚动尝试次数
        let scrollAttempts = 0;
        
        // 循环滚动直到无法加载更多视频
        while (scrollAttempts < maxScrollAttempts) {
            // 滚动到页面底部
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(1500); // 等待内容加载
            
            // 获取当前视频数量
            const currentCount = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer').length;
            
            // 更新状态
            updateStatus(`正在加载所有视频... (已加载 ${currentCount} 个)`, true);
            
            // 如果视频数量没有增加
            if (currentCount === previousCount) {
                sameCountTimes++;
                // 如果连续5次滚动都没有新视频，认为已加载完毕
                if (sameCountTimes >= 5) {
                    break;
                }
            } else {
                // 重置计数器
                sameCountTimes = 0;
                previousCount = currentCount;
            }
            
            scrollAttempts++;
        }
        
        // 滚动回页面顶部
        window.scrollTo(0, 0);
        
        // 返回加载的视频数量
        return document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer').length;
    }
    
    // 修改扫描函数，先加载所有视频再扫描
    async function startScanningVideos() {
        const scanButton = document.getElementById(scanButtonId);
        if (isScanningMode()) {
            // 停止扫描
            setScanningMode(false);
            scanButton.textContent = '扫描4K视频';
            scanButton.style.backgroundColor = 'blue';
            updateStatus('扫描已停止', true);
            setTimeout(() => updateStatus('', false), 3000);
            return;
        }
        
        // 开始扫描
        setScanningMode(true);
        scanButton.textContent = '停止扫描';
        scanButton.style.backgroundColor = 'orange';
        
        try {
            // 首先滚动加载所有视频
            const totalVideos = await scrollToLoadAllVideos();
            updateStatus(`加载完成，共发现 ${totalVideos} 个视频`, true);
            await sleep(1000);
            
            // 获取页面上的所有视频
            const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
            let scannedCount = 0;
            let pendingCount = 0;
            
            // 清除已扫描记录
            localStorage.setItem('scanned_videos', '[]');
            
            // 遍历视频元素
            for (let i = 0; i < videoElements.length; i++) {
                if (!isScanningMode()) break; // 如果扫描被中止则退出
                
                const video = videoElements[i];
                const linkElement = video.querySelector('a#thumbnail') || 
                                   video.querySelector('a.yt-simple-endpoint');
                
                if (!linkElement || !linkElement.href) continue;
                
                const videoId = extractVideoId(linkElement.href);
                if (!videoId) continue;
                
                // 检查是否已经知道此视频的4K状态
                const qualityData = getVideoQuality(videoId);
                if (qualityData) {
                    scannedCount++;
                    updateStatus(`扫描进度: ${scannedCount}/${totalVideos}，已知视频跳过`, true);
                    continue;
                }
                
                // 在新标签页中打开视频
                updateStatus(`扫描进度: ${scannedCount}/${totalVideos}，打开视频 ${videoId}`, true);
                
                // 限制并发标签页数量
                pendingCount++;
                if (pendingCount >= 3) {
                    // 等待至少一个视频被扫描
                    await waitForAnyVideoScanned();
                    pendingCount--;
                }
                
                // 打开新标签页
                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                
                // 等待一段时间再继续
                await sleep(1500);
            }
            
            // 扫描完成
            setScanningMode(false);
            scanButton.textContent = '扫描4K视频';
            scanButton.style.backgroundColor = 'blue';
            updateStatus('所有视频扫描完成!', true);
            setTimeout(() => updateStatus('', false), 5000);
        } catch (error) {
            console.error('扫描过程中出错:', error);
            setScanningMode(false);
            scanButton.textContent = '扫描4K视频';
            scanButton.style.backgroundColor = 'blue';
            updateStatus('扫描过程中出错', true);
        }
    }
    
    // 等待任意视频被扫描
    function waitForAnyVideoScanned() {
        return new Promise(resolve => {
            const initialCount = JSON.parse(localStorage.getItem('scanned_videos') || '[]').length;
            
            const checkInterval = setInterval(() => {
                const currentCount = JSON.parse(localStorage.getItem('scanned_videos') || '[]').length;
                if (currentCount > initialCount || !isScanningMode()) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500);
            
            // 设置超时，避免永久等待
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }
    
    // 标记已知的4K视频
    function markKnown4KVideos() {
        if (filterActive) return; // 如果正在过滤则跳过
        
        const storage = getAllVideoQualities();
        const videoElements = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
        
        videoElements.forEach(video => {
            const linkElement = video.querySelector('a#thumbnail') || 
                               video.querySelector('a.yt-simple-endpoint');
            
            if (!linkElement || !linkElement.href) return;
            
            const videoId = extractVideoId(linkElement.href);
            if (!videoId) return;
            
            const qualityData = storage[videoId];
            if (qualityData && qualityData.is4K && !video.querySelector(`.${badgeClass}`)) {
                addBadgeToVideo(video, linkElement);
            }
        });
    }
    
    // === 初始化 ===
    
    // 根据页面类型初始化功能
    function init() {
        if (isVideoPage()) {
            // 视频详情页
            checkCurrentVideoFor4K();
        } else if (isListingPage()) {
            // 视频列表页
            createFilterButton();
            markKnown4KVideos();
            
            // 监听DOM变化
            createDOMObserver();
        }
    }
    
    // 启动程序
    function start() {
        console.log('YouTube 4K 过滤器启动');
        
        // 尝试多次初始化，确保在页面加载后运行
        setTimeout(init, 5000);
        
        // 监听URL变化
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                // URL变化时重新初始化
                setTimeout(init, 1500);
            }
        });
        
        urlObserver.observe(document.body, { subtree: true, childList: true });
    }
    
    // 更安全的观察者实现，避免频繁DOM更新
    function createDOMObserver() {
        // 移除任何现有的观察器
        if (window.ytObserver) {
            window.ytObserver.disconnect();
        }
        
        // 创建新的观察器
        window.ytObserver = new MutationObserver(mutations => {
            // 节流：避免太频繁地更新
            clearTimeout(window.observerTimeout);
            window.observerTimeout = setTimeout(() => {
                if (!document.getElementById(buttonId)) {
                    createFilterButton();
                }
                
                // 仅在必要时更新视频标记
                if (!filterActive) {
                    markKnown4KVideos();
                }
            }, 1000);
        });
        
        // 开始观察DOM变化
        window.ytObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    start();
})(); 
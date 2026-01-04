// ==UserScript==
// @name         通用视频播放器截图工具（测试）
// @icon         data:image/png;base64,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
// @version      2025.07.18
// @description  适用于所有视频播放器的截图脚本（H5、Flash、iframe等）
// @author       嘉友友
// @match        *://www.youtube.com/*
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.twitch.tv/*
// @match        *://live.douyin.com/*
// @match        *://live.kuaishou.com/*
// @license      GPL-3.0
// @namespace https://greasyfork.org/users/1336389
// @downloadURL https://update.greasyfork.org/scripts/542555/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/542555/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E6%88%AA%E5%9B%BE%E5%B7%A5%E5%85%B7%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 缓存优化
    const cache = {
        videoElements: null,
        lastCacheTime: 0,
        cacheValidityTime: 2000, // 缓存2秒有效
        queryResults: new Map()
    };

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // 优化的页面检查（使用缓存）
    function isVideoPage() {
        const cacheKey = 'isVideoPage';
        if (cache.queryResults.has(cacheKey)) {
            return cache.queryResults.get(cacheKey);
        }

        const url = window.location.href.toLowerCase();
        const videoKeywords = [
            'youtube', 'bilibili', 'iqiyi', 'youku', 'douyin', 'tiktok',
            'twitch', 'kuaishou', 'huya', 'douyu', 'acfun', 'vimeo',
            'video', 'movie', 'play', 'watch', 'live', 'stream'
        ];

        const result = videoKeywords.some(keyword => url.includes(keyword)) ||
                      document.querySelector('video, embed, object, iframe[src*="video"], iframe[src*="player"]');

        cache.queryResults.set(cacheKey, result);
        // 清理缓存，避免内存泄漏
        setTimeout(() => cache.queryResults.delete(cacheKey), 5000);

        return result;
    }

    // 优化的视频元素查找（使用缓存和优化查询）
    function findVideoElements() {
        const now = Date.now();

        // 使用缓存
        if (cache.videoElements && now - cache.lastCacheTime < cache.cacheValidityTime) {
            return cache.videoElements;
        }

        // 优化选择器，按常用程度排序
        const selectors = [
            'video', // 最常用的放前面
            '.html5-main-video',
            '.video-stream',
            '.bilibili-live-player video',
            '.bpx-player-video-wrap video',
            '#movie_player video',
            '.player-area video',
            '.xgplayer video'
        ];

        const videos = [];
        const processedElements = new Set(); // 避免重复处理

        for (const selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (element.tagName === 'VIDEO' && !processedElements.has(element)) {
                        processedElements.add(element);
                        // 使用更高效的尺寸检查
                        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
                            videos.push(element);
                        }
                    }
                }
                // 如果已经找到视频，优先使用第一个匹配的选择器结果
                if (videos.length > 0 && selector === 'video') break;
            } catch (e) {
                // 忽略选择器错误，继续下一个
                continue;
            }
        }

        // 缓存结果
        cache.videoElements = videos;
        cache.lastCacheTime = now;

        return videos;
    }

    // 优化的视频有效性检查（减少DOM查询）
    function isValidVideo(video) {
        // 先检查最简单的属性
        if (video.hidden) return false;

        // 使用 offsetWidth/offsetHeight 替代 getBoundingClientRect（性能更好）
        if (video.offsetWidth <= 0 || video.offsetHeight <= 0) return false;

        // 最后检查 computed style（最耗性能的）
        const style = video.currentStyle || window.getComputedStyle(video);
        return style.display !== 'none';
    }

    // 优化的视频元素截图（保持源质量）
    async function captureVideoElement(video) {
        try {
            // 提前检查，避免无用计算
            if (video.readyState < 1) {
                return { success: false, message: '视频尚未加载，请稍后再试' };
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { alpha: false }); // 禁用alpha通道提升性能

            canvas.width = video.videoWidth || video.clientWidth;
            canvas.height = video.videoHeight || video.clientHeight;

            try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } catch (e) {
                if (e.name === 'SecurityError') {
                    return { success: false, message: 'CORS安全限制，无法截取此视频' };
                }
                throw e;
            }

            return new Promise((resolve) => {
                canvas.toBlob(function(blob) {
                    if (!blob) {
                        resolve({ success: false, message: '生成图片失败' });
                        return;
                    }

                    downloadImage(blob, canvas.width, canvas.height);
                    resolve({
                        success: true,
                        width: canvas.width,
                        height: canvas.height
                    });
                }, 'image/png', 1.0); // 保持源质量 1.0
            });

        } catch (error) {
            return { success: false, message: '截图失败: ' + error.message };
        }
    }

    // 优化的H5视频截图
    function captureH5Video() {
        const videos = findVideoElements();

        // 优先级排序：可见 > 已加载 > 大尺寸
        const sortedVideos = videos
            .filter(video => isValidVideo(video) && video.readyState >= 1)
            .sort((a, b) => {
                const aRect = { width: a.offsetWidth, height: a.offsetHeight };
                const bRect = { width: b.offsetWidth, height: b.offsetHeight };
                return (bRect.width * bRect.height) - (aRect.width * aRect.height);
            });

        for (let video of sortedVideos) {
            // 优先选择较大尺寸的视频
            if (video.offsetWidth >= 200 && video.offsetHeight >= 150) {
                return captureVideoElement(video);
            }
        }

        // 如果没有大尺寸的，选择第一个可用的
        if (sortedVideos.length > 0) {
            return captureVideoElement(sortedVideos[0]);
        }

        return null;
    }

    // 优化的iframe查找（减少DOM查询）
    function captureIframeVideo() {
        const iframes = document.querySelectorAll('iframe[src*="video"], iframe[src*="player"], iframe[src*="youtube"], iframe[src*="bilibili"], iframe[src*="vimeo"], iframe[src*="live"]');

        const validIframes = [];
        for (const iframe of iframes) {
            if (iframe.offsetWidth > 0 && iframe.offsetHeight > 0) {
                validIframes.push({
                    element: iframe,
                    area: iframe.offsetWidth * iframe.offsetHeight
                });
            }
        }

        if (validIframes.length > 0) {
            // 选择面积最大的iframe
            validIframes.sort((a, b) => b.area - a.area);
            return captureElementArea(validIframes[0].element);
        }
        return null;
    }

    // 优化的Flash/Object查找
    function captureFlashVideo() {
        const objects = document.querySelectorAll('object[type*="flash"], object[data*="video"], embed[type*="flash"], embed[src*="video"]');

        const validObjects = [];
        for (const obj of objects) {
            if (obj.offsetWidth > 0 && obj.offsetHeight > 0) {
                validObjects.push(obj);
                break; // 找到第一个就够了
            }
        }

        if (validObjects.length > 0) {
            return captureElementArea(validObjects[0]);
        }
        return null;
    }

    // 优化的元素区域截图（保持源质量）
    function captureElementArea(element) {
        try {
            const width = Math.min(element.offsetWidth, 1920);
            const height = Math.min(element.offsetHeight, 1080);

            if (width === 0 || height === 0) {
                return { success: false, message: '播放器区域无效' };
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { alpha: false });

            canvas.width = width;
            canvas.height = height;

            // 优化绘制过程，减少绘制调用
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, width - 2, height - 2);

            // 合并文字绘制
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 28px Arial';
            ctx.fillText('🎬 视频播放器区域', width / 2, height / 2 - 40);

            ctx.font = '18px Arial';
            ctx.fillStyle = '#ffcc00';
            ctx.fillText('无法直接截取视频内容', width / 2, height / 2);

            ctx.fillStyle = '#888888';
            ctx.font = '16px Arial';
            ctx.fillText(`尺寸: ${Math.round(element.offsetWidth)} × ${Math.round(element.offsetHeight)}`, width / 2, height / 2 + 40);

            return new Promise((resolve) => {
                canvas.toBlob(function(blob) {
                    downloadImage(blob, width, height);
                    resolve({ success: true, isPlaceholder: true });
                }, 'image/png', 1.0); // 保持源质量 1.0
            });

        } catch (error) {
            return { success: false, message: '截图失败: ' + error.message };
        }
    }

    // 优化的主截图函数
    async function captureVideoFrame() {
        try {
            // 清除缓存，强制重新查找
            cache.videoElements = null;

            const h5Result = captureH5Video();
            if (h5Result) {
                const result = await h5Result;
                if (result.success) {
                    showMessage(`📸 截图成功！分辨率: ${result.width}×${result.height}`, 'success');
                    return;
                } else {
                    showMessage(result.message, 'warning');
                }
            }

            // 使用 requestAnimationFrame 优化后续操作
            await new Promise(resolve => requestAnimationFrame(resolve));

            const iframeResult = captureIframeVideo();
            if (iframeResult) {
                const result = await iframeResult;
                if (result.success) {
                    const type = result.isPlaceholder ? '播放器区域截图' : '截图';
                    showMessage(`📸 ${type}成功！`, 'success');
                    return;
                }
            }

            const flashResult = captureFlashVideo();
            if (flashResult) {
                const result = await flashResult;
                if (result.success) {
                    showMessage('📸 播放器区域截图成功！', 'success');
                    return;
                }
            }

            showMessage('未找到可截图的视频播放器！\n请等待视频加载完成后再试', 'error');
        } catch (error) {
            showMessage('截图过程出错：' + error.message, 'error');
        }
    }

    // 优化的视频信息获取
    function getVideoInfo() {
        const videos = findVideoElements();

        if (videos.length === 0) {
            return '📺 未检测到有效的视频播放器';
        }

        const infoParts = [`📺 检测到 ${videos.length} 个有效视频播放器:\n`];
        let validCount = 0;

        videos.forEach((video) => {
            const isVisible = isValidVideo(video);
            const videoWidth = video.videoWidth || 0;
            const videoHeight = video.videoHeight || 0;
            const displayWidth = video.offsetWidth;
            const displayHeight = video.offsetHeight;

            if (displayWidth > 0 && displayHeight > 0) {
                validCount++;
                const status = video.readyState >= 1 ? '✅' : '⏳';
                const visibility = isVisible ? '👁️' : '🚫';

                let info = `${validCount}. ${status}${visibility} `;

                if (videoWidth && videoHeight) {
                    info += `视频分辨率: ${videoWidth}×${videoHeight}\n`;
                    if (displayWidth !== videoWidth || displayHeight !== videoHeight) {
                        info += `   显示尺寸: ${displayWidth}×${displayHeight}\n`;
                    }
                } else {
                    info += `显示尺寸: ${displayWidth}×${displayHeight}\n`;
                }

                if (video.duration && !isNaN(video.duration) && video.duration !== Infinity) {
                    const duration = Math.round(video.duration);
                    const minutes = Math.floor(duration / 60);
                    const seconds = duration % 60;
                    info += `   时长: ${minutes}:${seconds.toString().padStart(2, '0')}\n`;
                }

                infoParts.push(info + '\n');
            }
        });

        // 优化iframe检查
        const validIframes = document.querySelectorAll('iframe[src*="video"], iframe[src*="player"], iframe[src*="youtube"], iframe[src*="bilibili"]');
        const visibleIframes = Array.from(validIframes).filter(iframe =>
            iframe.offsetWidth > 0 && iframe.offsetHeight > 0
        );

        if (visibleIframes.length > 0) {
            infoParts.push(`📱 iframe播放器: ${visibleIframes.length} 个\n`);
            visibleIframes.forEach((iframe, index) => {
                infoParts.push(`${index + 1}. 尺寸: ${iframe.offsetWidth}×${iframe.offsetHeight}\n`);
            });
        }

        if (validCount === 0 && visibleIframes.length === 0) {
            return '📺 未检测到有尺寸信息的播放器';
        }

        return infoParts.join('').trim();
    }

    // 优化的下载函数（使用 revokeObjectURL 的延迟清理）
    function downloadImage(blob, width, height) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const now = new Date();
        const timestamp = now.getFullYear() +
            String(now.getMonth() + 1).padStart(2, '0') +
            String(now.getDate()).padStart(2, '0') + '_' +
            String(now.getHours()).padStart(2, '0') +
            String(now.getMinutes()).padStart(2, '0') +
            String(now.getSeconds()).padStart(2, '0');

        const domain = window.location.hostname.replace(/\./g, '_');
        a.download = `${domain}_video_${timestamp}.png`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 延迟清理，确保下载完成
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // 优化的消息显示（缓存样式）
    const messageStyles = {
        success: { bg: 'rgba(40, 167, 69, 0.95)', icon: '✅' },
        error: { bg: 'rgba(220, 53, 69, 0.95)', icon: '❌' },
        warning: { bg: 'rgba(255, 193, 7, 0.95)', icon: '⚠️' },
        info: { bg: 'rgba(52, 58, 64, 0.95)', icon: 'ℹ️' }
    };

    function showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        const style = messageStyles[type];

        messageDiv.textContent = `${style.icon} ${text}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${style.bg};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            z-index: 999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            max-width: 350px;
            word-wrap: break-word;
            white-space: pre-line;
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
            will-change: transform, opacity;
        `;

        document.body.appendChild(messageDiv);

        // 使用 requestAnimationFrame 优化动画
        requestAnimationFrame(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateX(0)';
        });

        const hideDelay = type === 'error' ? 5000 : 3500;
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(20px)';
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, hideDelay);
    }

    // 优化的键盘事件监听（防抖处理）
    const debouncedCapture = debounce(captureVideoFrame, 300);
    const debouncedInfo = debounce(() => {
        const info = getVideoInfo();
        showMessage(info, 'info');
    }, 300);

    document.addEventListener('keydown', function(event) {
        // 避免在输入框中触发
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        if (event.altKey && event.code === 'Digit1') {
            event.preventDefault();
            debouncedCapture();
        }

        if (event.altKey && event.code === 'Digit2') {
            event.preventDefault();
            debouncedInfo();
        }
    }, { passive: false });

    // 优化的初始化
    function initialize() {
        if (!isVideoPage()) return;

        const videos = findVideoElements();
        if (videos.length > 0) {
            showMessage(`🎬 截图工具已就绪\nAlt+1: 截图  Alt+2: 查看信息\n检测到 ${videos.length} 个有效播放器`, 'success');
        } else {
            showMessage('🎬 截图工具已就绪\nAlt+1: 截图  Alt+2: 查看信息', 'info');
        }
    }

    // 优化的页面变化监听（节流 + 防抖）
    let lastUrl = location.href;
    const throttledObserver = throttle(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // 清除缓存
            cache.videoElements = null;
            cache.queryResults.clear();

            setTimeout(() => {
                if (isVideoPage()) initialize();
            }, 1500);
        }
    }, 1000);

    // 使用更精确的观察配置
    const observer = new MutationObserver(throttledObserver);
    observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: false, // 不观察属性变化
        characterData: false // 不观察文本变化
    });

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        cache.queryResults.clear();
        cache.videoElements = null;
    });

    // 优化的页面加载检查
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () =>
            setTimeout(initialize, 1000), { once: true });
    } else {
        setTimeout(initialize, 1000);
    }

})();

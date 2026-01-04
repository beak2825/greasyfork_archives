// ==UserScript==
// @name         YouTube视频链接提取器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取YouTube频道所有公开视频的链接
// @author       huayuhuia
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532713/YouTube%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532713/YouTube%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式
    const styles = `
        .yt-extractor-btn {
            position: fixed;
            top: 70px;
            right: 20px;
            background-color: red;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            font-size: 14px;
            cursor: pointer;
            z-index: 9999;
            font-weight: bold;
        }
        .yt-extractor-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            z-index: 10000;
            display: flex;
            flex-direction: column;
        }
        .yt-extractor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
        }
        .yt-extractor-title {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
        }
        .yt-extractor-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #606060;
        }
        .yt-extractor-content {
            padding: 16px;
            overflow-y: auto;
            flex-grow: 1;
        }
        .yt-extractor-footer {
            padding: 12px 16px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
        }
        .yt-extractor-status {
            color: #606060;
        }
        .yt-extractor-actions button {
            margin-left: 8px;
            padding: 6px 12px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
        }
        .yt-extractor-copy {
            background-color: #065fd4;
            color: white;
        }
        .yt-extractor-download {
            background-color: #2ba640;
            color: white;
        }
        .yt-extractor-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        .yt-extractor-progress {
            width: 100%;
            height: 4px;
            background-color: #f0f0f0;
            margin-top: 8px;
        }
        .yt-extractor-progress-bar {
            height: 100%;
            background-color: red;
            width: 0%;
            transition: width 0.3s;
        }
        .yt-extractor-video-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .yt-extractor-video-item {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .yt-extractor-video-item:last-child {
            border-bottom: none;
        }
        .yt-extractor-video-title {
            font-weight: bold;
            margin-bottom: 4px;
        }
        .yt-extractor-video-link {
            color: #065fd4;
            text-decoration: none;
            word-break: break-all;
        }
        .yt-extractor-video-meta {
            font-size: 12px;
            color: #606060;
            margin-top: 4px;
        }
    `;

    // 添加样式
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // 创建提取按钮
    function createExtractorButton() {
        const button = document.createElement('button');
        button.className = 'yt-extractor-btn';
        button.textContent = '提取视频链接';
        button.addEventListener('click', startExtraction);
        document.body.appendChild(button);
    }

    // 创建模态框
    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'yt-extractor-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'yt-extractor-modal';
        
        const header = document.createElement('div');
        header.className = 'yt-extractor-header';
        
        const title = document.createElement('h2');
        title.className = 'yt-extractor-title';
        title.textContent = '视频链接提取器';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'yt-extractor-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const content = document.createElement('div');
        content.className = 'yt-extractor-content';
        
        const statusDiv = document.createElement('div');
        statusDiv.className = 'yt-extractor-status';
        statusDiv.textContent = '准备提取视频链接...';
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'yt-extractor-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'yt-extractor-progress-bar';
        
        progressContainer.appendChild(progressBar);
        
        const videoList = document.createElement('ul');
        videoList.className = 'yt-extractor-video-list';
        
        content.appendChild(statusDiv);
        content.appendChild(progressContainer);
        content.appendChild(videoList);
        
        const footer = document.createElement('div');
        footer.className = 'yt-extractor-footer';
        
        const footerStatus = document.createElement('div');
        footerStatus.className = 'yt-extractor-status';
        footerStatus.textContent = '视频数量: 0';
        
        const actions = document.createElement('div');
        actions.className = 'yt-extractor-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'yt-extractor-copy';
        copyBtn.textContent = '复制链接';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(videoList);
        });
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'yt-extractor-download';
        downloadBtn.textContent = '下载TXT';
        downloadBtn.addEventListener('click', () => {
            downloadAsTxt(videoList);
        });
        
        actions.appendChild(copyBtn);
        actions.appendChild(downloadBtn);
        
        footer.appendChild(footerStatus);
        footer.appendChild(actions);
        
        modal.appendChild(header);
        modal.appendChild(content);
        modal.appendChild(footer);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        return {
            overlay,
            modal,
            statusDiv,
            progressBar,
            videoList,
            footerStatus
        };
    }

    // 复制到剪贴板
    function copyToClipboard(videoList) {
        const links = [];
        const items = videoList.querySelectorAll('.yt-extractor-video-item');
        
        items.forEach(item => {
            const title = item.querySelector('.yt-extractor-video-title').textContent;
            const link = item.querySelector('.yt-extractor-video-link').href;
            links.push(`${title}\n${link}\n`);
        });
        
        const text = links.join('\n');
        
        navigator.clipboard.writeText(text).then(() => {
            alert('链接已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制。');
        });
    }

    // 下载为TXT
    function downloadAsTxt(videoList) {
        const links = [];
        const items = videoList.querySelectorAll('.yt-extractor-video-item');
        
        items.forEach(item => {
            const title = item.querySelector('.yt-extractor-video-title').textContent;
            const link = item.querySelector('.yt-extractor-video-link').href;
            const meta = item.querySelector('.yt-extractor-video-meta')?.textContent || '';
            links.push(`标题: ${title}\n链接: ${link}\n${meta}\n${'='.repeat(80)}\n`);
        });
        
        const text = links.join('\n');
        const channelName = getChannelName();
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `youtube_videos_${channelName}_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 获取频道名称
    function getChannelName() {
        const url = window.location.href;
        const match = url.match(/\/@([^\/]+)/);
        if (match) {
            return match[1];
        }
        
        // 尝试从页面获取频道名称
        const channelNameElement = document.querySelector('#channel-name');
        if (channelNameElement) {
            return channelNameElement.textContent.trim().replace(/\s+/g, '_');
        }
        
        return 'channel';
    }

    // 检查是否在频道页面
    function isChannelPage() {
        return window.location.href.includes('/channel/') || 
               window.location.href.includes('/@') || 
               window.location.href.includes('/c/') || 
               window.location.href.includes('/user/');
    }

    // 检查是否在视频页面
    function isVideosTab() {
        return window.location.href.includes('/videos');
    }

    // 开始提取
    function startExtraction() {
        if (!isChannelPage()) {
            alert('请在YouTube频道页面使用此功能！');
            return;
        }
        
        if (!isVideosTab()) {
            // 如果不在视频标签页，跳转到视频标签页
            const currentUrl = window.location.href;
            const videosUrl = currentUrl.endsWith('/') ? `${currentUrl}videos` : `${currentUrl}/videos`;
            window.location.href = videosUrl;
            return;
        }
        
        const modalElements = createModal();
        
        // 开始提取视频
        extractVideos(modalElements);
    }

    // 提取视频
    async function extractVideos(modalElements) {
        const { statusDiv, progressBar, videoList, footerStatus } = modalElements;
        
        statusDiv.textContent = '正在提取视频链接...';
        
        const videos = [];
        let lastHeight = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 300; // 最大滚动次数
        
        while (scrollAttempts < maxScrollAttempts) {
            // 滚动到页面底部
            window.scrollTo(0, document.documentElement.scrollHeight);
            
            // 等待内容加载
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 提取当前页面上的视频
            const currentVideos = extractCurrentVideos();
            
            // 更新视频列表
            for (const video of currentVideos) {
                if (!videos.some(v => v.id === video.id)) {
                    videos.push(video);
                    
                    // 添加到UI
                    const item = document.createElement('li');
                    item.className = 'yt-extractor-video-item';
                    
                    const title = document.createElement('div');
                    title.className = 'yt-extractor-video-title';
                    title.textContent = video.title;
                    
                    const link = document.createElement('a');
                    link.className = 'yt-extractor-video-link';
                    link.href = video.url;
                    link.textContent = video.url;
                    link.target = '_blank';
                    
                    const meta = document.createElement('div');
                    meta.className = 'yt-extractor-video-meta';
                    if (video.published || video.views) {
                        meta.textContent = [video.published, video.views].filter(Boolean).join(' • ');
                    }
                    
                    item.appendChild(title);
                    item.appendChild(link);
                    item.appendChild(meta);
                    
                    videoList.appendChild(item);
                }
            }
            
            // 更新状态
            statusDiv.textContent = `已找到 ${videos.length} 个视频，继续滚动加载更多...`;
            footerStatus.textContent = `视频数量: ${videos.length}`;
            
            // 检查是否已经到达底部
            const currentHeight = document.documentElement.scrollHeight;
            if (currentHeight === lastHeight) {
                scrollAttempts++;
                if (scrollAttempts >= 3) { // 连续3次没有新内容，认为已到达底部
                    break;
                }
            } else {
                scrollAttempts = 0;
                lastHeight = currentHeight;
            }
            
            // 更新进度条
            progressBar.style.width = `${Math.min((scrollAttempts / 3) * 100, 100)}%`;
        }
        
        // 完成提取
        statusDiv.textContent = `提取完成！共找到 ${videos.length} 个视频。`;
        progressBar.style.width = '100%';
    }

    // 从当前页面提取视频
    function extractCurrentVideos() {
        const videos = [];
        
        console.log('开始提取视频...');
        
        // 尝试多种可能的视频容器选择器
        const selectors = [
            'ytd-grid-video-renderer', 
            'ytd-rich-item-renderer', 
            'ytd-video-renderer',
            'ytd-compact-video-renderer',
            'ytd-reel-item-renderer',
            // 更通用的选择器
            'div[id="dismissible"]',
            'div[class*="ytd-rich-grid-media"]',
            'div[class*="ytd-grid-video"]'
        ];
        
        // 使用更通用的选择器组合
        const selectorString = selectors.join(', ');
        console.log(`使用选择器: ${selectorString}`);
        
        const videoElements = document.querySelectorAll(selectorString);
        console.log(`找到 ${videoElements.length} 个可能的视频元素`);
        
        // 遍历所有找到的元素
        videoElements.forEach((element, index) => {
            try {
                console.log(`处理第 ${index + 1} 个元素...`);
                
                // 尝试多种可能的链接选择器
                const linkSelectors = [
                    'a#video-title', 
                    'a.yt-simple-endpoint.style-scope.ytd-video-renderer',
                    'a[href*="watch?v="]',
                    'a[title]',
                    'a[aria-label]'
                ];
                
                // 尝试每个选择器直到找到有效的链接元素
                let linkElement = null;
                for (const selector of linkSelectors) {
                    const el = element.querySelector(selector);
                    if (el && el.href && el.href.includes('watch?v=')) {
                        linkElement = el;
                        console.log(`找到链接元素，使用选择器: ${selector}`);
                        break;
                    }
                }
                
                // 如果没有找到链接元素，尝试查找任何带有href的a标签
                if (!linkElement) {
                    const allLinks = element.querySelectorAll('a[href]');
                    for (const link of allLinks) {
                        if (link.href && link.href.includes('watch?v=')) {
                            linkElement = link;
                            console.log('找到备用链接元素');
                            break;
                        }
                    }
                }
                
                if (!linkElement) {
                    console.log('未找到有效的链接元素，跳过');
                    return;
                }
                
                const videoUrl = linkElement.href;
                if (!videoUrl || !videoUrl.includes('watch?v=')) {
                    console.log('链接不是有效的视频URL，跳过');
                    return;
                }
                
                // 提取视频ID
                const videoId = new URL(videoUrl).searchParams.get('v');
                if (!videoId) {
                    console.log('无法提取视频ID，跳过');
                    return;
                }
                
                // 提取标题 - 尝试多种方法
                let title = '';
                if (linkElement.getAttribute('title')) {
                    title = linkElement.getAttribute('title');
                } else if (linkElement.getAttribute('aria-label')) {
                    title = linkElement.getAttribute('aria-label');
                } else if (linkElement.textContent.trim()) {
                    title = linkElement.textContent.trim();
                } else {
                    // 尝试从父元素中查找标题
                    const possibleTitleElements = element.querySelectorAll('h3, .title, [id*="title"]');
                    for (const el of possibleTitleElements) {
                        if (el.textContent.trim()) {
                            title = el.textContent.trim();
                            break;
                        }
                    }
                }
                
                if (!title) {
                    title = `视频 ${videoId}`;
                }
                
                // 提取发布时间和观看次数 - 尝试多种方法
                let published = '';
                let views = '';
                
                // 1. 尝试标准元数据选择器
                const metaSelectors = [
                    '#metadata-line span', 
                    '.metadata-line span', 
                    '#metadata span',
                    '.ytd-video-meta-block span',
                    '[id*="metadata"] span',
                    '[class*="metadata"] span'
                ];
                
                for (const selector of metaSelectors) {
                    const metaElements = element.querySelectorAll(selector);
                    if (metaElements.length >= 2) {
                        views = metaElements[0].textContent.trim();
                        published = metaElements[1].textContent.trim();
                        break;
                    } else if (metaElements.length === 1) {
                        views = metaElements[0].textContent.trim();
                        break;
                    }
                }
                
                // 2. 如果上面的方法失败，使用正则表达式从元素文本中提取
                if (!views && !published) {
                    const infoText = element.textContent;
                    
                    // 匹配观看次数
                    const viewsPatterns = [
                        /(\d+(\.\d+)?[KMB]?次观看)/,
                        /(\d+(\.\d+)?[KMB]? views)/,
                        /(\d+(\.\d+)?[KMB]?播放)/,
                        /观看次数：(\d+(\.\d+)?[KMB]?)/
                    ];
                    
                    for (const pattern of viewsPatterns) {
                        const match = infoText.match(pattern);
                        if (match) {
                            views = match[0];
                            break;
                        }
                    }
                    
                    // 匹配发布时间
                    const timePatterns = [
                        /((\d+)天前|(\d+)小时前|(\d+)分钟前|(\d+)秒前)/,
                        /((\d+) days ago|(\d+) hours ago|(\d+) minutes ago|(\d+) seconds ago)/,
                        /((\d+)天|(\d+)小时|(\d+)分钟|(\d+)秒)/
                    ];
                    
                    for (const pattern of timePatterns) {
                        const match = infoText.match(pattern);
                        if (match) {
                            published = match[0];
                            break;
                        }
                    }
                }
                
                // 添加视频到列表
                videos.push({
                    id: videoId,
                    title: title,
                    url: videoUrl,
                    published: published,
                    views: views
                });
                
                console.log(`成功提取视频: ${title} (${videoId})`);
            } catch (e) {
                console.error('提取视频信息时出错:', e);
            }
        });
        
        console.log(`本次提取到 ${videos.length} 个视频`);
        return videos;
    }

    // 修改提取视频函数，增加延迟和重试机制
    async function extractVideos(modalElements) {
        const { statusDiv, progressBar, videoList, footerStatus } = modalElements;
        
        statusDiv.textContent = '正在提取视频链接...';
        
        const videos = [];
        let lastHeight = 0;
        let scrollAttempts = 0;
        let emptyAttempts = 0;
        const maxScrollAttempts = 300; // 最大滚动次数
        const maxEmptyAttempts = 5; // 最大空提取次数
        
        while (scrollAttempts < maxScrollAttempts && emptyAttempts < maxEmptyAttempts) {
            // 滚动到页面底部
            window.scrollTo(0, document.documentElement.scrollHeight);
            
            // 等待内容加载 - 增加等待时间
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 提取当前页面上的视频
            const currentVideos = extractCurrentVideos();
            
            if (currentVideos.length === 0) {
                emptyAttempts++;
                console.log(`未找到视频，空提取尝试 ${emptyAttempts}/${maxEmptyAttempts}`);
                statusDiv.textContent = `正在加载视频，请稍候... (${emptyAttempts}/${maxEmptyAttempts})`;
            } else {
                emptyAttempts = 0; // 重置空提取计数
            }
            
            // 更新视频列表
            for (const video of currentVideos) {
                if (!videos.some(v => v.id === video.id)) {
                    videos.push(video);
                    
                    // 添加到UI
                    const item = document.createElement('li');
                    item.className = 'yt-extractor-video-item';
                    
                    const title = document.createElement('div');
                    title.className = 'yt-extractor-video-title';
                    title.textContent = video.title;
                    
                    const link = document.createElement('a');
                    link.className = 'yt-extractor-video-link';
                    link.href = video.url;
                    link.textContent = video.url;
                    link.target = '_blank';
                    
                    const meta = document.createElement('div');
                    meta.className = 'yt-extractor-video-meta';
                    if (video.published || video.views) {
                        meta.textContent = [video.published, video.views].filter(Boolean).join(' • ');
                    }
                    
                    item.appendChild(title);
                    item.appendChild(link);
                    item.appendChild(meta);
                    
                    videoList.appendChild(item);
                }
            }
            
            // 更新状态
            statusDiv.textContent = `已找到 ${videos.length} 个视频，继续滚动加载更多...`;
            footerStatus.textContent = `视频数量: ${videos.length}`;
            
            // 检查是否已经到达底部
            const currentHeight = document.documentElement.scrollHeight;
            if (currentHeight === lastHeight) {
                scrollAttempts++;
                if (scrollAttempts >= 3) { // 连续3次没有新内容，认为已到达底部
                    break;
                }
            } else {
                scrollAttempts = 0;
                lastHeight = currentHeight;
            }
            
            // 更新进度条
            progressBar.style.width = `${Math.min((scrollAttempts / 3) * 100, 100)}%`;
        }
        
        // 完成提取
        if (videos.length > 0) {
            statusDiv.textContent = `提取完成！共找到 ${videos.length} 个视频。`;
        } else {
            statusDiv.textContent = `未能找到视频。请尝试刷新页面或检查控制台日志。`;
        }
        progressBar.style.width = '100%';
    }

    // 复制到剪贴板
    function copyToClipboard(videoList) {
        const links = [];
        const items = videoList.querySelectorAll('.yt-extractor-video-item');
        
        console.log(`准备复制 ${items.length} 个视频链接`); // 添加调试信息
        
        items.forEach(item => {
            const title = item.querySelector('.yt-extractor-video-title').textContent;
            const link = item.querySelector('.yt-extractor-video-link').href;
            links.push(`${title}\n${link}\n`);
        });
        
        const text = links.join('\n');
        
        if (text.trim() === '') {
            alert('没有找到视频链接可复制！');
            return;
        }
        
        // 使用备用方法复制到剪贴板
        try {
            navigator.clipboard.writeText(text).then(() => {
                alert('链接已复制到剪贴板！');
            }).catch(err => {
                console.error('使用navigator.clipboard复制失败:', err);
                fallbackCopy(text);
            });
        } catch (e) {
            console.error('复制到剪贴板出错:', e);
            fallbackCopy(text);
        }
    }
    
    // 备用复制方法
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert('链接已复制到剪贴板！');
            } else {
                alert('复制失败，请手动复制。');
            }
        } catch (err) {
            console.error('备用复制方法失败:', err);
            alert('复制失败，请手动复制。');
        }
        
        document.body.removeChild(textarea);
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createExtractorButton);
        } else {
            createExtractorButton();
        }
        
        // 监听URL变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                
                // 移除旧按钮
                const oldButton = document.querySelector('.yt-extractor-btn');
                if (oldButton) {
                    oldButton.remove();
                }
                
                // 添加新按钮
                setTimeout(createExtractorButton, 1000);
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 启动脚本
    init();
})();
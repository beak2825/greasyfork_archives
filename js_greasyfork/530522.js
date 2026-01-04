// ==UserScript==
// @license MIT
// @name         B站收藏夹与合集视频链接批量获取
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  获取B站收藏夹和合集内所有视频的链接（直接解析网页）
// @author       Claude
// @match        https://space.bilibili.com/*/favlist*
// @match        https://space.bilibili.com/*/lists/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530522/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E4%B8%8E%E5%90%88%E9%9B%86%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530522/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E4%B8%8E%E5%90%88%E9%9B%86%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储所有收集到的视频
    let allVideos = [];
    
    // 创建主面板
    const container = document.createElement('div');
    container.className = 'bili-link-collector';
    container.innerHTML = `
        <style>
            .bili-link-collector {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                width: 320px;
                font-family: "Microsoft YaHei", "Segoe UI", Arial, sans-serif;
            }
            .bili-link-collector * {
                box-sizing: border-box;
            }
            .bili-collect-btn {
                width: 100%;
                padding: 10px 15px;
                background-color: #FB7299;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .bili-collect-btn:hover {
                background-color: #fc8bab;
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            }
            .bili-collect-btn svg {
                margin-right: 8px;
            }
            .bili-result-panel {
                margin-top: 10px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                overflow: hidden;
                display: none;
                max-height: 70vh;
                display: flex;
                flex-direction: column;
            }
            .bili-result-header {
                background-color: #F6F7F8;
                padding: 12px 15px;
                border-bottom: 1px solid #E5E9EF;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .bili-result-title {
                font-size: 14px;
                font-weight: bold;
                color: #18191C;
                display: flex;
                align-items: center;
            }
            .bili-result-counter {
                margin-left: 6px;
                background-color: #FB7299;
                color: white;
                border-radius: 10px;
                padding: 1px 6px;
                font-size: 12px;
            }
            .bili-result-actions {
                display: flex;
                gap: 8px;
            }
            .bili-action-btn {
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid #E5E9EF;
                background-color: white;
                color: #61666D;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .bili-action-btn:hover {
                background-color: #F6F7F8;
                color: #FB7299;
                border-color: #FB7299;
            }
            .bili-copy-20-btn {
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid #FB7299;
                background-color: #FFF0F5;
                color: #FB7299;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .bili-copy-20-btn:hover {
                background-color: #FB7299;
                color: white;
            }
            .bili-result-list {
                overflow-y: auto;
                padding: 0;
                margin: 0;
                list-style: none;
                flex: 1;
            }
            .bili-result-item {
                padding: 12px 15px;
                border-bottom: 1px solid #E5E9EF;
                transition: background-color 0.2s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .bili-result-item:hover {
                background-color: #F6F7F8;
            }
            .bili-result-item:last-child {
                border-bottom: none;
            }
            .bili-video-cover {
                width: 80px;
                height: 50px;
                border-radius: 4px;
                overflow: hidden;
                flex-shrink: 0;
                background-color: #F6F7F8;
                position: relative;
            }
            .bili-video-cover img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            .bili-result-item:hover .bili-video-cover img {
                transform: scale(1.05);
            }
            .bili-video-info {
                flex: 1;
                min-width: 0;
            }
            .bili-video-title {
                font-size: 14px;
                margin: 0;
                line-height: 1.4;
            }
            .bili-video-title a {
                color: #18191C;
                text-decoration: none;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .bili-video-title a:hover {
                color: #FB7299;
            }
            .bili-tip {
                padding: 10px 15px;
                border-top: 1px solid #E5E9EF;
                color: #9499A0;
                font-size: 12px;
                text-align: center;
            }
            .bili-icon {
                display: inline-block;
                vertical-align: middle;
            }
            .bili-video-cover::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.03);
                pointer-events: none;
            }
            .bili-action-group {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
        </style>
        <button class="bili-collect-btn">
            <svg class="bili-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 1C7 0.447715 7.44772 0 8 0C8.55228 0 9 0.447715 9 1V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V1Z" fill="white"/>
                <path d="M1 9C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H1Z" fill="white"/>
            </svg>
            获取当前页视频链接
        </button>
        <div class="bili-result-panel">
            <div class="bili-result-header">
                <div class="bili-result-title">收集结果<span class="bili-result-counter">0</span></div>
                <div class="bili-action-group">
                    <button class="bili-copy-20-btn" id="bili-copy-20-btn">复制20条</button>
                    <button class="bili-action-btn" id="bili-copy-btn">复制全部</button>
                    <button class="bili-action-btn" id="bili-clear-btn">清空</button>
                </div>
            </div>
            <ul class="bili-result-list"></ul>
            <div class="bili-tip">提示：请手动翻页后再次点击获取按钮收集更多视频</div>
        </div>
    `;
    document.body.appendChild(container);
    
    const collectBtn = container.querySelector('.bili-collect-btn');
    const resultPanel = container.querySelector('.bili-result-panel');
    const resultList = container.querySelector('.bili-result-list');
    const resultCounter = container.querySelector('.bili-result-counter');
    const copyBtn = container.querySelector('#bili-copy-btn');
    const copy20Btn = container.querySelector('#bili-copy-20-btn');
    const clearBtn = container.querySelector('#bili-clear-btn');
    
    // 点击按钮收集视频
    collectBtn.addEventListener('click', function() {
        // 显示结果面板
        resultPanel.style.display = 'flex';
        
        try {
            // 获取视频
            const videos = getVideosFromCurrentPage();
            
            // 添加到总视频列表中（去重）
            videos.forEach(video => {
                if (!allVideos.some(v => v.bvid === video.bvid)) {
                    allVideos.push(video);
                }
            });
            
            // 更新显示
            updateResultsDisplay();
        } catch (error) {
            alert('获取视频失败: ' + error.message);
        }
    });
    
    // 复制链接
    copyBtn.addEventListener('click', function() {
        if (allVideos.length === 0) {
            alert('还没有收集到视频链接');
            return;
        }
        
        const links = allVideos
            .map(video => `https://www.bilibili.com/video/${video.bvid}`)
            .join('\n');
        
        // 使用Clipboard API或回退到execCommand
        copyToClipboard(links, '已复制所有视频链接到剪贴板！');
    });
    
    // 复制前20条并删除
    copy20Btn.addEventListener('click', function() {
        if (allVideos.length === 0) {
            alert('还没有收集到视频链接');
            return;
        }
        
        // 确定要复制的数量（最多20条，或者全部如果不足20条）
        const count = Math.min(20, allVideos.length);
        const videosToCopy = allVideos.slice(0, count);
        
        const links = videosToCopy
            .map(video => `https://www.bilibili.com/video/${video.bvid}`)
            .join('\n');
        
        // 复制到剪贴板
        copyToClipboard(links, `已复制前${count}条视频链接到剪贴板！`);
        
        // 从列表中删除已复制的视频
        allVideos = allVideos.slice(count);
        
        // 更新显示
        updateResultsDisplay();
    });
    
    // 清空结果
    clearBtn.addEventListener('click', function() {
        allVideos = [];
        updateResultsDisplay();
    });
    
    // 通用复制到剪贴板函数
    function copyToClipboard(text, successMessage) {
        try {
            navigator.clipboard.writeText(text).then(() => {
                alert(successMessage);
            }).catch(err => {
                fallbackCopy(text, successMessage);
            });
        } catch (e) {
            fallbackCopy(text, successMessage);
        }
    }
    
    // 从当前页面获取视频
    function getVideosFromCurrentPage() {
        // 检查页面类型
        const isListPage = window.location.href.includes('/lists/');

        // 尝试合集页面的视频卡片(list页面)
        if (isListPage) {
            // 尝试合集页特有的选择器
            const seasonCards = document.querySelectorAll('.season-item');
            if (seasonCards && seasonCards.length > 0) {
                return extractVideosFromElements(seasonCards);
            }
            
            const episodeItems = document.querySelectorAll('.ep-item');
            if (episodeItems && episodeItems.length > 0) {
                return extractVideosFromElements(episodeItems);
            }
        }
        
        // 尝试B站最新收藏夹界面的视频卡片
        const videoCards = document.querySelectorAll('.bili-video-card');
        if (videoCards && videoCards.length > 0) {
            return extractVideosFromElements(videoCards);
        }
        
        // 尝试旧版收藏夹界面的视频项
        const videoItems = document.querySelectorAll('.fav-video-list .small-item') || 
                         document.querySelectorAll('.content-list .small-item') ||
                         document.querySelectorAll('.favorite-list-content .favorite-video-item');
        
        if (videoItems && videoItems.length > 0) {
            return extractVideosFromElements(videoItems);
        }
        
        // 如果上面的选择器都没找到，尝试找所有视频链接
        const allLinks = Array.from(document.querySelectorAll('a[href*="/video/BV"]'));
        if (allLinks.length > 0) {
            return allLinks.map(link => {
                const href = link.href;
                const bvid = href.match(/\/video\/(BV[a-zA-Z0-9]+)/)?.[1] || '';
                const title = link.textContent.trim() || link.getAttribute('title') || bvid;
                const imgElem = link.querySelector('img') || document.querySelector(`a[href*="${bvid}"] img`);
                const cover = imgElem ? (imgElem.src || imgElem.getAttribute('data-src')) : '';
                
                return { bvid, title, cover };
            });
        }
        
        throw new Error('未找到视频元素，请确保你在收藏夹或合集页面上');
    }
    
    // 从元素中提取视频信息
    function extractVideosFromElements(elements) {
        const videos = [];
        
        elements.forEach(item => {
            try {
                // 获取视频链接
                const linkElement = item.querySelector('a[href*="/video/BV"]');
                if (!linkElement) return;
                
                const href = linkElement.href;
                const bvid = href.match(/\/video\/(BV[a-zA-Z0-9]+)/)?.[1];
                if (!bvid) return;
                
                // 获取标题 - 优先查找新版B站的标题元素
                const titleElement = item.querySelector('.bili-video-card__title') ||
                                    item.querySelector('.title') || 
                                    item.querySelector('.video-title') || 
                                    item.querySelector('.ep-title') ||
                                    item.querySelector('.season-title') ||
                                    linkElement;
                
                const title = titleElement.textContent.trim() || titleElement.getAttribute('title') || bvid;
                
                // 获取封面
                const imgElement = item.querySelector('.bili-video-card__cover img') ||
                                  item.querySelector('.cover img') ||
                                  item.querySelector('img.cover') || 
                                  item.querySelector('.ep-cover img') ||
                                  item.querySelector('.season-cover img') ||
                                  item.querySelector('img') ||
                                  document.querySelector(`a[href*="${bvid}"] img`);
                
                let cover = '';
                if (imgElement) {
                    cover = imgElement.src || imgElement.getAttribute('data-src') || '';
                    // 如果是懒加载图片
                    if (!cover && imgElement.dataset.src) {
                        cover = imgElement.dataset.src;
                    }
                    // 如果是缩略图，尝试获取更大的图片
                    if (cover.includes('@') && !cover.includes('gif')) {
                        cover = cover.split('@')[0];
                    }
                }
                
                videos.push({ bvid, title, cover });
            } catch (e) {
                // 忽略单个视频解析错误
            }
        });
        
        return videos;
    }
    
    // 更新结果显示
    function updateResultsDisplay() {
        // 更新计数
        resultCounter.textContent = allVideos.length;
        
        // 清空当前列表
        resultList.innerHTML = '';
        
        // 添加视频项
        allVideos.forEach(video => {
            const li = document.createElement('li');
            li.className = 'bili-result-item';
            
            const videoLink = `https://www.bilibili.com/video/${video.bvid}`;
            
            // 设置默认封面
            let coverImg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA1MCI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNDAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7npL7ljLrlm77niYc8L3RleHQ+PC9zdmc+';
            if (video.cover) {
                coverImg = video.cover;
            }
            
            li.innerHTML = `
                <div class="bili-video-cover">
                    <img src="${coverImg}" alt="${video.title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA1MCI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNDAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+'">
                </div>
                <div class="bili-video-info">
                    <h3 class="bili-video-title">
                        <a href="${videoLink}" target="_blank" title="${video.title}">${video.title}</a>
                    </h3>
                </div>
            `;
            
            resultList.appendChild(li);
        });

        // 根据是否有足够的视频更新复制20条按钮的状态
        if (allVideos.length < 20) {
            copy20Btn.textContent = `复制${allVideos.length}条`;
        } else {
            copy20Btn.textContent = '复制20条';
        }
    }
    
    // 备用复制方法
    function fallbackCopy(text, successMessage) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                alert(successMessage);
            } else {
                alert('复制失败，请手动复制以下链接：\n' + text);
            }
        } catch (e) {
            alert('复制失败，请手动复制以下链接：\n' + text);
        }
        
        document.body.removeChild(textarea);
    }
})();
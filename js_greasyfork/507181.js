// ==UserScript==
// @name         YouTube搜索页和首页 视频点赞数显示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Display like counts and percentage on YouTube search results and homepage
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @license      MIT
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/507181/YouTube%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%92%8C%E9%A6%96%E9%A1%B5%20%E8%A7%86%E9%A2%91%E7%82%B9%E8%B5%9E%E6%95%B0%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/507181/YouTube%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%92%8C%E9%A6%96%E9%A1%B5%20%E8%A7%86%E9%A2%91%E7%82%B9%E8%B5%9E%E6%95%B0%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个防抖函数来限制API调用频率
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

    // 格式化数字函数
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 计算百分比函数
    function calculatePercentage(likes, views) {
        if (views === 0) return 'N/A';
        const percentage = (likes / views) * 100;
        return percentage.toFixed(2) + '%';
    }

    // 主函数
    async function addLikeCounts() {
        const videoItems = document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer');
        for (const item of videoItems) {
            const metadataLine = item.querySelector('div#metadata-line.style-scope.ytd-video-meta-block');
            if (metadataLine && !metadataLine.querySelector('.like-count')) {
                const videoId = item.querySelector('a#video-title, a#video-title-link')?.href?.split('v=')[1];
                if (!videoId) continue;
                try {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=AIzaSyAei7QIUVmaGKi9j83fi_D4EbUE0P-cAQI`);
                    const data = await response.json();
                    const likes = parseInt(data.items[0]?.statistics?.likeCount) || 0;
                    const views = parseInt(data.items[0]?.statistics?.viewCount) || 0;
                    const percentage = calculatePercentage(likes, views);
                    const likeElement = document.createElement('div');
                    likeElement.textContent = `• 赞:${formatNumber(likes)} (${percentage})`;
                    likeElement.style.color = '#606060';
                    likeElement.style.fontSize = '14px';
                    likeElement.style.marginTop = '1px';
                    likeElement.style.marginLeft = '5px';
                    likeElement.className = 'like-count';
                    metadataLine.appendChild(likeElement);
                } catch (error) {
                    console.error('获取点赞数时出错:', error);
                }
            }
        }
    }

    // 使用防抖函数包装主函数
    const debouncedAddLikeCounts = debounce(addLikeCounts, 1000);

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.matches('ytd-video-renderer, ytd-rich-item-renderer') ||
                 node.querySelector('ytd-video-renderer, ytd-rich-item-renderer'))
            )
        )) {
            debouncedAddLikeCounts();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始运行
    debouncedAddLikeCounts();
})();

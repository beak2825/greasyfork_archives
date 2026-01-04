// ==UserScript==
// @name         微博内容爬虫
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动爬取微博帖子内容的脚本（仅用于学术研究目的，研究结束后将删除）
// @author       稳稳
// @match        https://weibo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528888/%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/528888/%E5%BE%AE%E5%8D%9A%E5%86%85%E5%AE%B9%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        autoScroll: true,          // 是否自动滚动页面
        scrollInterval: 2000,      // 滚动间隔(毫秒)
        maxPosts: 300,             // 最大爬取帖子数
        saveToFile: true,          // 是否保存到文件
        API_HOST: 'http://localhost:8888'  // 本地MAMP服务器地址
    };

    // 存储爬取的数据
    let collectedPosts = [];

    // 主函数
    function init() {
        // 添加控制面板
        addControlPanel();
        // 开始监听页面变化
        observePageChanges();
    }

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999;
        `;

        panel.innerHTML = `
            <button id="startCrawl">开始爬取</button>
            <button id="stopCrawl">停止爬取</button>
            <button id="exportData">导出数据</button>
            <div id="crawlStatus">状态: 未开始</div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听
        document.getElementById('startCrawl').addEventListener('click', startCrawling);
        document.getElementById('stopCrawl').addEventListener('click', stopCrawling);
        document.getElementById('exportData').addEventListener('click', exportData);
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // 检查新增的节点是否包含微博内容
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            extractPostContent(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 提取帖子内容
    function extractPostContent(node) {
        // 查找帖子内容区域
        const posts = node.querySelectorAll('[class*="Feed_body"]');
        posts.forEach(post => {
            const postData = {
                id: getPostId(post),
                content: getTextContent(post),
                author: getAuthor(post),
                time: getPostTime(post),
                interactions: getInteractions(post)
            };

            if (postData.id && !isDuplicate(postData)) {
                collectedPosts.push(postData);
                updateStatus();
                // 上传到服务器
                uploadPost(postData);
            }
        });
    }

    // 获取帖子ID
    function getPostId(post) {
        const feedCard = post.closest('[class*="Feed_card"]');
        return feedCard ? feedCard.getAttribute('data-id') || '' : '';
    }

    function getTextContent(post) {
        const contentNode = post.querySelector('[class*="detail_wbtext"]');
        return contentNode ? contentNode.textContent.trim() : '';
    }

    function getAuthor(post) {
        const authorNode = post.querySelector('[class*="ALink_name"]');
        const verifiedNode = post.querySelector('[class*="woo_svg_"]');
        return authorNode ? {
            name: authorNode.textContent.trim(),
            link: authorNode.href,
            verified: verifiedNode ? verifiedNode.id : null
        } : null;
    }

    function getPostTime(post) {
        const timeNode = post.querySelector('[class*="Feed_from"] a');
        return timeNode ? timeNode.textContent.trim() : '';
    }

    function getInteractionCount(post, type) {
        const node = post.querySelector(`[class*="toolbar_${type}"]`);
        if (!node) return 0;
        const countText = node.textContent.trim().replace(/[^0-9]/g, '');
        return countText ? parseInt(countText) : 0;
    }

    // 获取互动数据
    function getInteractions(post) {
        return {
            likes: getInteractionCount(post, '点赞'),
            comments: getInteractionCount(post, '评论'),
            reposts: getInteractionCount(post, '转发')
        };
    }

    // 获取互动数量
    function getInteractionCount(post, type) {
        const node = post.querySelector(`[title*="${type}"]`);
        return node ? parseInt(node.textContent) || 0 : 0;
    }

    // 检查是否重复
    function isDuplicate(postData) {
        return collectedPosts.some(post => post.id === postData.id);
    }

    // 更新状态
    function updateStatus() {
        const statusDiv = document.getElementById('crawlStatus');
        if (statusDiv) {
            statusDiv.textContent = `状态: 已爬取 ${collectedPosts.length} 条帖子`;
        }
    }

    // 开始爬取
    function startCrawling() {
        // 实现开始爬取的逻辑
        document.getElementById('crawlStatus').textContent = '状态: 爬取中...';
    }

    // 停止爬取
    function stopCrawling() {
        // 实现停止爬取的逻辑
        document.getElementById('crawlStatus').textContent = '状态: 已停止';
    }

    // 导出数据
    function exportData() {
        const blob = new Blob([JSON.stringify(collectedPosts, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `weibo_posts_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 上传帖子数据到服务器
    function uploadPost(postData) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${config.API_HOST}/weibo-server/save_weibo.php`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: JSON.stringify(postData),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        console.log('数据上传成功:', postData.id);
                    } else {
                        console.error('数据上传失败:', result.message);
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
            },
            onerror: function(error) {
                console.error('上传请求失败:', error);
            }
        });
    }

    // 启动脚本
    init();
})();
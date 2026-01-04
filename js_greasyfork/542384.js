// ==UserScript==
// @name         小红书评论区助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在小红书笔记页面添加两个悬浮按钮：1. 自动展开所有评论；2. 导出所有评论（包含帖子链接和完整信息）为TXT文件。
// @author       Gao + Claude
// @match        https://www.xiaohongshu.com/explore/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542384/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542384/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 样式定义 (与之前相同) ---
    GM_addStyle(`
        .xhs-helper-btn-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .xhs-helper-btn {
            padding: 10px 15px;
            background-color: #ff2442;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: background-color 0.3s, transform 0.2s;
            width: 150px;
            text-align: center;
        }
        .xhs-helper-btn:hover {
            background-color: #e01f38;
        }
        .xhs-helper-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            transform: none;
        }
        .xhs-helper-btn:active:not(:disabled) {
            transform: scale(0.98);
        }
    `);

    // --- 创建按钮 (与之前相同) ---
    const container = document.createElement('div');
    container.className = 'xhs-helper-btn-container';
    const expandButton = document.createElement('button');
    expandButton.id = 'expand-comments-btn';
    expandButton.className = 'xhs-helper-btn';
    expandButton.innerText = '自动展开评论';
    const exportButton = document.createElement('button');
    exportButton.id = 'export-comments-btn';
    exportButton.className = 'xhs-helper-btn';
    exportButton.innerText = '导出全部评论';
    container.appendChild(expandButton);
    container.appendChild(exportButton);
    document.body.appendChild(container);

    // --- 核心功能实现 (大部分与之前相同) ---

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function handleExpandComments() {
        let clickCount = 0;
        expandButton.disabled = true;
        expandButton.innerText = '展开中...';
        try {
            while (true) {
                const moreButtons = document.querySelectorAll('.show-more, .bottom-bar .loading.active');
                if (moreButtons.length === 0) {
                    console.log('未找到可展开的按钮，任务完成。');
                    expandButton.innerText = '全部已展开';
                    break;
                }
                console.log(`找到 ${moreButtons.length} 个展开按钮，正在点击...`);
                moreButtons.forEach(btn => {
                    btn.click();
                    clickCount++;
                    expandButton.innerText = `展开中... (${clickCount})`;
                });
                await sleep(1500);
            }
        } catch (error) {
            console.error('展开评论时发生错误:', error);
            expandButton.innerText = '出现错误';
        }
    }
    
    function handleExportComments() {
        exportButton.disabled = true;
        exportButton.innerText = '正在导出...';
        console.log('开始提取评论内容...');

        let exportText = '';
        
        // --- 新增功能：获取并添加帖子链接 ---
        const postUrl = window.location.href;
        exportText += `帖子链接: ${postUrl}\n\n`;
        
        const noteTitle = document.querySelector('#detail-title')?.textContent.trim() || '未知标题';
        const authorName = document.querySelector('.author-wrapper .name .username')?.textContent.trim() || '未知作者';
        const noteDesc = document.querySelector('#detail-desc')?.textContent.trim() || '无';

        exportText += `笔记标题: ${noteTitle}\n`;
        exportText += `作者: ${authorName}\n\n`;
        exportText += `笔记内容:\n${noteDesc}\n\n`;
        exportText += "==================== 评论区 ====================\n\n";

        const comments = document.querySelectorAll('.parent-comment');
        if (comments.length === 0) {
            exportText += "当前页面没有评论。";
        }

        comments.forEach((comment, index) => {
            const mainCommentInfo = extractCommentInfo(comment);
            exportText += `【${index + 1}楼】 ${mainCommentInfo.userName}  (点赞: ${mainCommentInfo.likes})\n`;
            exportText += `时间: ${mainCommentInfo.time} ${mainCommentInfo.location}\n`;
            exportText += `内容: ${mainCommentInfo.content}\n`;

            const replies = comment.querySelectorAll('.reply-container .comment-item');
            if (replies.length > 0) {
                exportText += "--- 回复 ---\n";
                replies.forEach(reply => {
                    const replyInfo = extractCommentInfo(reply);
                    exportText += `  -> ${replyInfo.userName} (点赞: ${replyInfo.likes}): ${replyInfo.content}\n`;
                    if(replyInfo.time || replyInfo.location){
                         exportText += `     时间: ${replyInfo.time} ${replyInfo.location}\n`;
                    }
                });
            }
            exportText += '----------------------------------------\n\n';
        });

        console.log('评论提取完成，准备下载...');
        downloadTextFile(exportText, `${noteTitle}_评论区.txt`);

        exportButton.innerText = '导出完成!';
        setTimeout(() => {
            exportButton.disabled = false;
            exportButton.innerText = '导出全部评论';
        }, 3000);
    }
    
    function extractCommentInfo(element) {
        const userElement = element.querySelector('.name');
        const contentElement = element.querySelector('.content');
        const timeElement = element.querySelector('.info .date');
        const locationElement = element.querySelector('.info .location');
        const likeCountElement = element.querySelector('.like-wrapper .count');

        const userName = userElement?.textContent.trim().replace(/\s*回复\s*.*/, '') || '未知用户';
        const content = contentElement?.textContent.trim() || '（无文本内容）';
        const time = timeElement?.textContent.trim() || '';
        const location = locationElement ? `IP属地: ${locationElement.textContent.trim()}` : '';
        
        let likes = '0';
        if (likeCountElement) {
            const likeText = likeCountElement.textContent.trim();
            if (likeText && !isNaN(parseInt(likeText, 10))) {
                likes = likeText;
            }
        }

        return { userName, content, time, location, likes };
    }

    function downloadTextFile(text, filename) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    // --- 绑定事件监听 ---
    expandButton.addEventListener('click', handleExpandComments);
    exportButton.addEventListener('click', handleExportComments);

})();
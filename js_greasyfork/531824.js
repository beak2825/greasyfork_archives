// ==UserScript==
// @name         小红书视频下载极简版
// @namespace    http://tampermonkey.net/
// @version      1.0.12
// @description  这是ai编的......
// @match        *://www.xiaohongshu.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.9/dayjs.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531824/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%9E%81%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531824/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%9E%81%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 原版按钮样式（未改动）
    const btn = document.createElement('button');
    btn.id = 'xhs-video-downloader';
    GM_addStyle(`
        #xhs-video-downloader {
            position: fixed;
            bottom: 30px;
            right: 80px;
            z-index: 9999;
            padding: 10px 20px;
            background: #ff2442;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: -apple-system, sans-serif;
        }

         #xhs-video-downloader:disabled {
             background-color: #cccccc;
             cursor: not-allowed;
             opacity: 0.7;
         }
    `);
    btn.textContent = '↓ 下载视频';
    // 初始时不显式设置禁用状态，由检测逻辑控制
    document.body.appendChild(btn);

    // =============== 增强视频检测 (保持原样) ===============
    let currentVideoUrl = null;
    let lastVideoCheck = 0;

    // =============== 增强作者获取 (保持原样) ===============
    const getDynamicAuthor = () => {
        try {
            return (
                document.querySelector('.author-info .name')?.textContent.trim() ||
                document.querySelector('[class*="username"]')?.textContent.trim() ||
                document.title.split('的小红书笔记')[0]
            ).replace(/[\\/:*?"<>|.\n\r]/g, '').substring(0, 20) || '未知作者';
        } catch(e) {
            return '未知作者';
        }
    };

    // =============== 新增：只获取 #detail-title 的内容 ===============
    const getSpecificTitle = () => {
        try {
            const titleElement = document.querySelector('#detail-title'); // 直接使用 ID 选择器
            if (titleElement) {
                const titleText = titleElement.textContent;
                const firstLine = titleText.split('\n')[0].trim();
                // 清理并截取前 20 字符
                const cleanTitle = firstLine.replace(/[\\/:*?"<>|.\n\r]/g, '').substring(0, 20);
                return cleanTitle; // 返回清理后的标题
            }
            return ''; // 找不到元素则返回空字符串
        } catch (e) {
            console.error("获取 #detail-title 出错:", e); // 输出错误到控制台
            return ''; // 出错也返回空字符串
        }
    };

    // =============== 点击事件（只修改文件名） ===============
    btn.addEventListener('click', () => {
        if(!currentVideoUrl) return alert('请先播放视频');
        // 保持原始逻辑，不添加额外的禁用检查

        const timestamp = dayjs().format('YYYYMMDD_HH-mm-ss');
        const author = getDynamicAuthor();
        const title = getSpecificTitle(); // <-- 调用新的、只获取指定ID的函数

        // 构建文件名
        let filename = `XHS_${timestamp}_${author}`;
        if (title) { // 只有标题非空时才添加
            filename += `_${title}`;
        }
        filename += '.mp4';

        console.log("生成文件名:", filename); // 保留原始确认日志

        // 恢复原始 GM_download
        GM_download({
            url: currentVideoUrl,
            name: filename,
            onerror: (e) => alert(`下载失败: ${e.error}`)
            // 无 onload, ontimeout
        });
    });

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if(typeof url === 'string' && /sns-video.*\.mp4/.test(url)) {
             let fullUrl = url;
             try { if (!url.startsWith('http')) { fullUrl = new URL(url, window.location.href).href; } } catch {}
             if (fullUrl && fullUrl.startsWith('http') && fullUrl !== currentVideoUrl) {
                 currentVideoUrl = fullUrl;
                 btn.disabled = false; // 启用按钮
                 console.log('XHR捕获视频:', fullUrl);
             }
        }
        try {
            origOpen.apply(this, arguments);
        } catch(e) { /* 忽略原始调用错误 */ }
    };

})();
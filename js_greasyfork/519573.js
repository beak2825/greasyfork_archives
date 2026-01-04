// ==UserScript==
// @name         小宇宙FM音频下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为小宇宙FM添加音频下载功能
// @author       Zane
// @match        https://www.xiaoyuzhoufm.com/episode/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519573/%E5%B0%8F%E5%AE%87%E5%AE%99FM%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/519573/%E5%B0%8F%E5%AE%87%E5%AE%99FM%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加下载按钮的样式
    const style = document.createElement('style');
    style.textContent = `
        .download-btn {
            background-color: #1890ff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px;
            font-size: 14px;
        }
        .download-btn:hover {
            background-color: #40a9ff;
        }
    `;
    document.head.appendChild(style);

    // 主函数
    function init() {
        console.log('初始化下载器...');
        // 创建状态显示按钮
        const statusButton = document.createElement('button');
        statusButton.className = 'download-btn searching';
        statusButton.textContent = '正在查找音频...';
        statusButton.style.cssText = `
            background-color: #f0f0f0;
            color: #666;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 14px;
            display: block;
        `;

        // 插入到标题下方
        const title = document.querySelector('.jsx-399326063.title');
        if (title) {
            title.parentNode.insertBefore(statusButton, title.nextSibling);
        }

        let attempts = 0;
        const maxAttempts = 5; // 减少尝试次数

        const checkInterval = setInterval(() => {
            attempts++;
            statusButton.textContent = `正在查找音频...${attempts}/${maxAttempts}`;

            const audioElement = document.querySelector('audio');

            if (audioElement) {
                clearInterval(checkInterval);
                // 转换为下载按钮
                statusButton.textContent = '下载音频';
                statusButton.style.backgroundColor = '#1890ff';
                statusButton.style.color = 'white';
                statusButton.style.cursor = 'pointer';
                statusButton.classList.remove('searching');

                statusButton.addEventListener('click', () => {
                    if (audioElement.src) {
                        downloadAudio(audioElement.src);
                    } else {
                        const audioUrl = findAudioUrlFromPage();
                        if (audioUrl) {
                            downloadAudio(audioUrl);
                        } else {
                            alert('未能找到音频文件，请确保音频已开始播放');
                        }
                    }
                });
            }

            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                statusButton.textContent = '未找到音频，请先播放';
                statusButton.style.backgroundColor = '#ff4d4f';
                statusButton.style.color = 'white';
            }
        }, 1000);
    }

    // 新增：从页面数据中查找音频URL
    function findAudioUrlFromPage() {
        // 尝试从页面脚本中查找音频URL
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            const content = script.textContent;
            if (content && content.includes('audioUrl')) {
                const match = content.match(/"audioUrl":"([^"]+)"/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        return null;
    }

    // 下载音频文件
    function downloadAudio(audioUrl) {
        if (!audioUrl) {
            alert('未找到音频文件');
            return;
        }

        // 获取播客标题作为文件名
        const title = document.querySelector('.episode-title')?.textContent ||
                     document.title ||
                     '小宇宙FM音频';
        const fileName = `${title}.mp3`.replace(/[\\/:*?"<>|]/g, '_');

        // 显示下载状态
        const downloadStatus = document.createElement('div');
        downloadStatus.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 10px; background: #1890ff; color: white; border-radius: 4px; z-index: 9999;';
        downloadStatus.textContent = '正在下载...0%';
        document.body.appendChild(downloadStatus);

        // 使用GM_xmlhttpRequest下载文件
        GM_xmlhttpRequest({
            method: 'GET',
            url: audioUrl,
            responseType: 'blob',
            onprogress: (progress) => {
                if (progress.total) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    downloadStatus.textContent = `正在下载...${percent}%`;
                }
            },
            onload: (response) => {
                // 创建下载链接
                const blob = new Blob([response.response], { type: 'audio/mpeg' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();

                // 清理
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    document.body.removeChild(downloadStatus);
                }, 1000);

                console.log('下载完成');
            },
            onerror: (error) => {
                console.error('下载失败:', error);
                alert('下载失败，请重试');
                document.body.removeChild(downloadStatus);
            }
        });
    }

    // 监听URL变化，支持SPA
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('xiaoyuzhoufm.com/episode/')) {
                init();
            }
        }
    }).observe(document, {subtree: true, childList: true});

    // 初始化
    init();
})();
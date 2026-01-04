// ==UserScript==
// @name         YouTube MP3 下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  YouTube to MP3 converter with clean interface
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      loader.to
// @connect      p.oceansaver.in
// @downloadURL https://update.greasyfork.org/scripts/512674/YouTube%20MP3%20%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/512674/YouTube%20MP3%20%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        const trigger = document.createElement('div');
        trigger.id = 'yt-mp3-trigger';

        const button = document.createElement('button');
        button.id = 'yt-mp3-download';

        const text = document.createTextNode('⬇');  // 使用已验证的下载图标
        button.appendChild(text);

        button.addEventListener('click', showDownloadPanel);

        const wrapper = document.createDocumentFragment();
        wrapper.appendChild(trigger);
        wrapper.appendChild(button);

        return wrapper;
    }

    // 添加样式
    function addStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #yt-mp3-download {
                position: fixed !important;
                bottom: -30px !important;
                left: 20px !important;
                width: 40px !important;
                height: 40px !important;
                background-color: rgba(0, 0, 0, 0.6) !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                opacity: 0 !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                z-index: 9999999 !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
            }
            #yt-mp3-trigger {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                width: 100px !important;
                height: 60px !important;
                z-index: 9999998 !important;
            }
            #yt-mp3-trigger:hover + #yt-mp3-download,
            #yt-mp3-download:hover {
                bottom: 20px !important;
                opacity: 0.8 !important;
            }
            #yt-mp3-download:hover {
                transform: scale(1.1) !important;
                opacity: 1 !important;
            }
            #yt-mp3-panel {
                position: fixed !important;
                bottom: 70px !important;
                left: 20px !important;
                background: rgba(33, 33, 33, 0.95) !important;
                border-radius: 12px !important;
                padding: 15px !important;
                color: white !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
                font-size: 14px !important;
                min-width: 200px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
                backdrop-filter: blur(10px) !important;
                z-index: 9999997 !important;
                transform: translateX(0);
                transition: transform 0.3s ease;
            }
            .download-progress {
                width: 100% !important;
                height: 4px !important;
                background: rgba(255,255,255,0.1) !important;
                border-radius: 2px !important;
                margin: 10px 0 !important;
                overflow: hidden !important;
            }
            .progress-bar {
                width: 0% !important;
                height: 100% !important;
                background: #FF0000 !important;
                transition: width 0.3s ease !important;
            }
            .download-info {
                margin-top: 8px !important;
                font-size: 12px !important;
                color: rgba(255,255,255,0.7) !important;
            }
            .download-button {
                background: #FF0000 !important;
                color: white !important;
                border: none !important;
                padding: 8px 16px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                width: 100% !important;
                margin-top: 10px !important;
                font-weight: 500 !important;
                transition: background 0.3s ease !important;
            }
            .download-button:hover {
                background: #FF1a1a !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 显示下载面板
    function showDownloadPanel() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) {
            alert('Please open a YouTube video first.');
            return;
        }

        // 移除已存在的面板
        const existingPanel = document.getElementById('yt-mp3-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'yt-mp3-panel';

        // 添加标题栏
        const headerBar = document.createElement('div');
        headerBar.style.cssText = `
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            cursor: move;
        `;

        const title = document.createElement('div');
        title.textContent = 'MP3 Download';
        title.style.fontSize = '14px';

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0 6px;
            font-size: 16px;
        `;
        closeButton.onclick = () => document.body.removeChild(panel);

        headerBar.appendChild(title);
        headerBar.appendChild(closeButton);
        panel.appendChild(headerBar);

        // 添加进度条
        const progress = document.createElement('div');
        progress.className = 'download-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progress.appendChild(progressBar);
        progress.style.display = 'none';
        panel.appendChild(progress);

        // 添加状态信息
        const info = document.createElement('div');
        info.className = 'download-info';
        panel.appendChild(info);

        // 添加下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-button';
        downloadButton.textContent = 'Start Download';
        downloadButton.onclick = () => startDownload(videoId, progressBar, info, downloadButton);
        panel.appendChild(downloadButton);

        document.body.appendChild(panel);

        // 添加拖动功能
        let isDragging = false;
        let currentX, currentY, initialX, initialY, xOffset = 0, yOffset = 0;

        headerBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === headerBar) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, panel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px)`;
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // 开始下载
    function startDownload(videoId, progressBar, info, button) {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const API_KEY = 'a4016fa228909c2bd7cb02037ca2a34c815d03a7';

        button.disabled = true;
        button.textContent = 'Preparing...';
        progressBar.parentElement.style.display = 'block';
        info.textContent = 'Initializing download...';

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://loader.to/ajax/download.php?format=mp3&url=${encodeURIComponent(videoUrl)}&api=${API_KEY}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.success) {
                        info.textContent = 'Starting conversion...';
                        checkProgress(data.id, progressBar, info, button);
                    } else {
                        info.textContent = 'Failed to start download: ' + (data.error || 'Unknown error');
                        button.textContent = 'Retry';
                        button.disabled = false;
                    }
                } catch (error) {
                    info.textContent = 'Error parsing response: ' + error.message;
                    button.textContent = 'Retry';
                    button.disabled = false;
                }
            },
            onerror: function(error) {
                info.textContent = 'Network error: ' + (error.message || 'Connection failed');
                button.textContent = 'Retry';
                button.disabled = false;
            }
        });
    }

    // 检查下载进度
    function checkProgress(downloadId, progressBar, info, button) {
        const progressCheck = setInterval(() => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://p.oceansaver.in/ajax/progress.php?id=${downloadId}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (!data) {
                            clearInterval(progressCheck);
                            info.textContent = 'Error: Invalid response';
                            button.textContent = 'Retry';
                            button.disabled = false;
                            return;
                        }

                        const percent = (data.progress / 10).toFixed(1);
                        progressBar.style.width = `${percent}%`;
                        info.textContent = data.text || `Converting: ${percent}%`;

                        if (data.download_url) {
                            clearInterval(progressCheck);
                            info.textContent = 'Download ready!';
                            button.textContent = 'Download MP3';
                            button.disabled = false;
                            button.onclick = () => {
                                window.location.href = data.download_url;
                            };
                        }
                    } catch (error) {
                        clearInterval(progressCheck);
                        info.textContent = 'Error occurred';
                        button.textContent = 'Retry';
                        button.disabled = false;
                    }
                },
                onerror: function() {
                    clearInterval(progressCheck);
                    info.textContent = 'Network error';
                    button.textContent = 'Retry';
                    button.disabled = false;
                }
            });
        }, 1000);
    }

    // 初始化脚本
    function init() {
        if (!document.getElementById('yt-mp3-download')) {
            addStyles();
            const elements = createDownloadButton();
            document.body.appendChild(elements);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听页面变化
    const observer = new MutationObserver(() => {
        if (!document.getElementById('yt-mp3-download')) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();

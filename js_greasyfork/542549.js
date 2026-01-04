// ==UserScript==
// @name         自动嗅探M3U8链接【并支持推送到本地M3U8下载】
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  需要有支持脚本的M3U8客户端才可以正常收到信息，并同时运行本地的M3U8下载器，否则无法推送成功。
// @author       You 
// @license      MIT
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542549/%E8%87%AA%E5%8A%A8%E5%97%85%E6%8E%A2M3U8%E9%93%BE%E6%8E%A5%E3%80%90%E5%B9%B6%E6%94%AF%E6%8C%81%E6%8E%A8%E9%80%81%E5%88%B0%E6%9C%AC%E5%9C%B0M3U8%E4%B8%8B%E8%BD%BD%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/542549/%E8%87%AA%E5%8A%A8%E5%97%85%E6%8E%A2M3U8%E9%93%BE%E6%8E%A5%E3%80%90%E5%B9%B6%E6%94%AF%E6%8C%81%E6%8E%A8%E9%80%81%E5%88%B0%E6%9C%AC%E5%9C%B0M3U8%E4%B8%8B%E8%BD%BD%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top || window.hasCacheM3U8SnifferRun) return;
    window.hasCacheM3U8SnifferRun = true;

    // 极简样式
    const style = document.createElement('style');
    style.textContent = `
        #cache-m3u8-sniffer {
            position: fixed;
            z-index: 99999;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 10px;
            border-radius: 4px;
            width: 550px;
            max-height: 80vh;
            overflow: auto;
            font-family: Arial, sans-serif;
            font-size: 13px;
            border: 1px solid #4CAF50;
            display: none;
            cursor: move;
        }
        .m3u8-group {
            margin-bottom: 12px;
            border-bottom: 1px solid #333;
            padding-bottom: 8px;
        }
        .video-title {
            color: #FF9800;
            font-weight: bold;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .m3u8-url {
            color: #4CAF50;
            word-break: break-all;
            margin-bottom: 8px;
            position: relative;
            display: flex;
            align-items: center;
        }
        .url-checkbox {
            margin-right: 8px;
        }
        #cache-m3u8-sniffer-header {
            height: 10px;
            margin-bottom: 8px;
            cursor: move;
        }
        #send-button {
            background: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            width: 100%;
        }
        #send-button:hover {
            background: #0b7dda;
        }
        #send-button:disabled {
            background: #757575;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    // 创建容器
    const container = document.createElement('div');
    container.id = 'cache-m3u8-sniffer';
    container.innerHTML = `
        <div id="cache-m3u8-sniffer-header"></div>
        <div id="m3u8-entries"></div>
        <button id="send-button">推送到本地M3U8下载</button>
    `;
    document.body.appendChild(container);

    const foundUrls = new Map();
    const sendButton = document.getElementById('send-button');
    let isSending = false;
    const MAX_URLS = 3; // 最大嗅探链接数
    const CHECK_INTERVAL = 3000; // 检查间隔3秒
    const MAX_CHECKS = 5; // 最大检查次数
    let sniffingStopped = false;
    let checkCount = 0;

    // 获取保存的位置信息
    const savedPosition = GM_getValue('sniffer_position', {
        left: 'auto',
        top: 'auto',
        right: '10px',
        bottom: '10px'
    });

    // 应用保存的位置信息
    Object.keys(savedPosition).forEach(key => {
        container.style[key] = savedPosition[key];
    });

    // 拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        if (e.target.id !== 'cache-m3u8-sniffer' &&
            e.target.id !== 'cache-m3u8-sniffer-header') {
            return;
        }

        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;

        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        container.style.left = (e.clientX - offsetX) + 'px';
        container.style.top = (e.clientY - offsetY) + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'move';
            savePosition();
        }
    });

    function savePosition() {
        const position = {
            left: container.style.left,
            top: container.style.top,
            right: container.style.right,
            bottom: container.style.bottom
        };
        GM_setValue('sniffer_position', position);
    }

    async function sendToPython(title, url) {
        try {
            await fetch("https://localhost:5020/receive", {
                method: "POST",
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    url: url
                })
            });
        } catch (error) {
            console.error('发送失败:', error);
        }
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', async () => {
        if (isSending) return;

        isSending = true;
        sendButton.disabled = true;
        sendButton.textContent = '发送中...';

        try {
            const selectedUrls = [];
            const checkboxes = document.querySelectorAll('.url-checkbox:checked');

            // 如果是单链接且没有多选框的情况
            if (foundUrls.size === 1) {
                const [title, urls] = [...foundUrls.entries()][0];
                if (urls.size === 1) {
                    const url = [...urls][0];
                    await sendToPython(title, url);
                    return;
                }
            }

            // 多选框选择的情况
            if (checkboxes.length > 0) {
                for (const checkbox of checkboxes) {
                    const title = checkbox.getAttribute('data-title');
                    const url = checkbox.getAttribute('data-url');
                    await sendToPython(title, url);
                }
            }
        } finally {
            setTimeout(() => {
                isSending = false;
                sendButton.disabled = false;
                sendButton.textContent = '推送到本地M3U8下载';
            }, 3000); // 3秒冷却时间
        }
    });

    window.addEventListener('resize', savePosition);

    // 获取视频标题
    function getVideoTitle() {
        return document.title.trim() || '未命名视频';
    }

    // 检查是否达到最大URL数量
    function checkMaxUrlsReached() {
        let totalUrls = 0;
        foundUrls.forEach(urls => {
            totalUrls += urls.size;
        });
        return totalUrls >= MAX_URLS;
    }

    // 核心检测函数
    function detectCachedM3U8() {
        if (sniffingStopped) return;

        checkCount++;
        if (checkCount > MAX_CHECKS) {
            sniffingStopped = true;
            return;
        }

        const videoTitle = getVideoTitle();

        // 按照优先级顺序执行嗅探
        hookNetworkRequests(videoTitle);
        if (!sniffingStopped) scanHlsObjects(videoTitle);
        if (!sniffingStopped) scanVideoPlayers(videoTitle);
        if (!sniffingStopped) deepScanWindow(videoTitle);

        updateUI();

        // 检查是否达到最大URL数量
        if (checkMaxUrlsReached()) {
            sniffingStopped = true;
            console.log('已嗅探到足够数量的M3U8链接，停止进一步嗅探');
        }
    }

    function scanHlsObjects(videoTitle) {
        if (unsafeWindow.Hls || unsafeWindow.hls) {
            const hls = unsafeWindow.Hls || unsafeWindow.hls;
            if (hls.players) {
                Object.values(hls.players).forEach(player => {
                    if (player.url) addM3U8Url(player.url, videoTitle);
                    if (sniffingStopped) return;
                });
            }
        }

        ['videojs', 'plyr', 'shaka', 'flowplayer'].forEach(name => {
            if (unsafeWindow[name]) {
                scanObjectForUrls(unsafeWindow[name], videoTitle);
                if (sniffingStopped) return;
            }
        });
    }

    function scanVideoPlayers(videoTitle) {
        document.querySelectorAll('video').forEach(video => {
            if (video.src) addM3U8Url(video.src, videoTitle);
            if (sniffingStopped) return;

            if (video.textTracks) {
                Array.from(video.textTracks).forEach(track => {
                    if (track.src) addM3U8Url(track.src, videoTitle);
                    if (sniffingStopped) return;
                });
            }
        });

        document.querySelectorAll('iframe').forEach(iframe => {
            if (iframe.contentWindow && iframe.src.includes('m3u8')) {
                addM3U8Url(iframe.src, videoTitle);
                if (sniffingStopped) return;
            }
        });
    }

    function deepScanWindow(videoTitle) {
        const win = unsafeWindow || window;
        Object.keys(win).forEach(prop => {
            const value = win[prop];
            if (typeof value === 'string' && isM3U8Url(value)) {
                addM3U8Url(value, videoTitle);
                if (sniffingStopped) return;
            } else if (value && typeof value === 'object') {
                scanObjectForUrls(value, videoTitle);
                if (sniffingStopped) return;
            }
        });
    }

    function scanObjectForUrls(obj, videoTitle, depth = 0) {
        if (depth > 2 || sniffingStopped) return;
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                if (typeof value === 'string' && isM3U8Url(value)) {
                    addM3U8Url(value, videoTitle);
                    if (sniffingStopped) return;
                } else if (value && typeof value === 'object') {
                    scanObjectForUrls(value, videoTitle, depth + 1);
                    if (sniffingStopped) return;
                }
            });
        }
    }

    function hookNetworkRequests(videoTitle) {
        if (window.XMLHttpRequest && !window.XMLHttpRequest._hooked) {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', function() {
                    if (this.responseURL && isM3U8Url(this.responseURL)) {
                        addM3U8Url(this.responseURL, videoTitle);
                    }
                });
                originalOpen.apply(this, arguments);
            };
            window.XMLHttpRequest._hooked = true;
        }

        if (window.fetch && !window.fetch._hooked) {
            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                const response = await originalFetch.apply(this, args);
                if (response.url && isM3U8Url(response.url)) {
                    addM3U8Url(response.url, videoTitle);
                }
                return response;
            };
            window.fetch._hooked = true;
        }
    }

    function isM3U8Url(url) {
        return url && /\.m3u8($|\?)/i.test(url);
    }

    function addM3U8Url(url, videoTitle) {
        if (!url || sniffingStopped) return;

        if (url.startsWith('//')) {
            url = window.location.protocol + url;
        } else if (url.startsWith('/')) {
            url = window.location.origin + url;
        } else if (!url.startsWith('http')) {
            url = new URL(url, window.location.href).href;
        }

        if (isM3U8Url(url)) {
            if (!foundUrls.has(videoTitle)) {
                foundUrls.set(videoTitle, new Set());
            }
            foundUrls.get(videoTitle).add(url);

            // 检查是否达到最大URL数量
            if (checkMaxUrlsReached()) {
                sniffingStopped = true;
            }
        }
    }

    function updateUI() {
        const container = document.getElementById('cache-m3u8-sniffer');
        const entriesDiv = document.getElementById('m3u8-entries');

        if (!entriesDiv || !container) return;

        if (foundUrls.size === 0) {
            container.style.display = 'none';
            return;
        }

        entriesDiv.innerHTML = '';

        foundUrls.forEach((urls, title) => {
            const group = document.createElement('div');
            group.className = 'm3u8-group';

            const titleElement = document.createElement('div');
            titleElement.className = 'video-title';
            titleElement.textContent = title;
            titleElement.title = title;

            group.appendChild(titleElement);

            urls.forEach(url => {
                const urlContainer = document.createElement('div');
                urlContainer.className = 'm3u8-url';

                if (foundUrls.size > 1 || urls.size > 1) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'url-checkbox';
                    checkbox.setAttribute('data-title', title);
                    checkbox.setAttribute('data-url', url);
                    urlContainer.appendChild(checkbox);
                }

                const urlText = document.createElement('span');
                urlText.textContent = url;
                urlContainer.appendChild(urlText);

                group.appendChild(urlContainer);

                // 添加空行分隔多个链接
                if (urls.size > 1) {
                    const spacer = document.createElement('div');
                    spacer.style.height = '8px';
                    group.appendChild(spacer);
                }
            });

            entriesDiv.appendChild(group);
        });

        container.style.display = 'block';
    }

    // 初始扫描
    detectCachedM3U8();

    // 定期检查（每3秒），最多5次
    const checkInterval = setInterval(() => {
        if (!sniffingStopped) {
            detectCachedM3U8();
        } else {
            clearInterval(checkInterval);
        }
    }, CHECK_INTERVAL);

})();
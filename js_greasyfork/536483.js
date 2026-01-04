// ==UserScript==
// @name         哔哩哔哩弹幕搬运
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  在不同的哔哩哔哩视频中复用弹幕，并支持时间轴调整。
// @author       Your Name
// @match        *://www.bilibili.com/video/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @run-at       document-idle
// @license      AI
// @downloadURL https://update.greasyfork.org/scripts/536483/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%B9%E5%B9%95%E6%90%AC%E8%BF%90.user.js
// @updateURL https://update.greasyfork.org/scripts/536483/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%B9%E5%B9%95%E6%90%AC%E8%BF%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 从 popup.css 和 danmaku_styles.css 提取的样式 ---
    const styles = `
        #bdr-settings-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 320px;
            background-color: #f4f4f4;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            font-family: sans-serif;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: none; /* 默认隐藏 */
        }
        #bdr-settings-panel h2 {
            text-align: center;
            color: #333;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
        }
        #bdr-settings-panel .bdr-input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
        }
        #bdr-settings-panel label {
            font-weight: bold;
            color: #555;
            font-size: 14px;
        }
        #bdr-settings-panel input[type="text"] {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        #bdr-settings-panel button {
            padding: 10px 15px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
            width: 100%;
        }
        #bdr-settings-panel button:hover {
            background-color: #007ead;
        }
        #bdr-status-message {
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
            color: #d9534f; /* Error color by default */
            min-height: 20px;
        }
        #bdr-toggle-button {
            position: fixed;
            top: 60px;
            right: 20px;
            padding: 8px 12px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
        }

        /* 弹幕样式 */
        #custom-danmaku-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 9999;
        }
        .custom-danmaku-item {
            position: absolute;
            right: 0;
            transform: translateX(100%);
            white-space: nowrap;
            font-size: 20px;
            font-weight: bold;
            color: #fff;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
            padding: 2px 5px;
            will-change: transform;
            line-height: 1.2;
        }
        @keyframes scrollDanmaku {
            from {
                right: 0;
                transform: translateX(100%);
            }
            to {
                right: 100%;
                transform: translateX(-100%);
            }
        }
    `;
    GM_addStyle(styles);

    // --- UI创建和逻辑 (来自 popup.html 和 popup.js) ---
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'bdr-settings-panel';
        panel.innerHTML = `
            <h2>哔哩哔哩弹幕复用</h2>
            <div class="bdr-input-group">
                <label for="bdr-source-video-url">弹幕来源视频URL:</label>
                <input type="text" id="bdr-source-video-url" placeholder="例如：https://www.bilibili.com/video/BVxxxxxxx">
            </div>
            <div class="bdr-input-group">
                <label for="bdr-source-danmaku-time">源弹幕时间点 (分:秒):</label>
                <input type="text" id="bdr-source-danmaku-time" placeholder="例如: 2:00 或 120" value="0:00">
            </div>
            <div class="bdr-input-group">
                <label for="bdr-target-load-time">当前视频加载时间点 (分:秒):</label>
                <input type="text" id="bdr-target-load-time" placeholder="例如: 1:00 或 60" value="0:00">
            </div>
            <button id="bdr-load-danmaku-button">加载并应用时间轴</button>
            <p id="bdr-status-message"></p>
        `;
        document.body.appendChild(panel);

        const toggleButton = document.createElement('button');
        toggleButton.id = 'bdr-toggle-button';
        toggleButton.textContent = '弹幕复用设置';
        toggleButton.onclick = () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(toggleButton);

        const sourceVideoUrlInput = document.getElementById('bdr-source-video-url');
        const sourceDanmakuTimeInput = document.getElementById('bdr-source-danmaku-time');
        const targetLoadTimeInput = document.getElementById('bdr-target-load-time');
        const loadDanmakuButton = document.getElementById('bdr-load-danmaku-button');
        const statusMessage = document.getElementById('bdr-status-message');

        // 加载保存的设置
        sourceVideoUrlInput.value = GM_getValue('bdr_sourceVideoUrl', '');
        sourceDanmakuTimeInput.value = GM_getValue('bdr_sourceDanmakuTime', '0:00');
        targetLoadTimeInput.value = GM_getValue('bdr_targetLoadTime', '0:00');

        loadDanmakuButton.addEventListener('click', function() {
            const sourceVideoUrl = sourceVideoUrlInput.value.trim();
            const sourceDanmakuTimeInSeconds = parseTimeToSeconds(sourceDanmakuTimeInput.value);
            const targetLoadTimeInSeconds = parseTimeToSeconds(targetLoadTimeInput.value);
            statusMessage.textContent = '';

            if (!sourceVideoUrl) {
                statusMessage.textContent = '请输入弹幕来源视频的URL！';
                return;
            }
            if (!isValidBilibiliVideoUrl(sourceVideoUrl)) {
                statusMessage.textContent = '请输入有效的哔哩哔哩视频URL！';
                return;
            }

            sourceDanmakuTimeInput.value = formatSecondsToTime(sourceDanmakuTimeInSeconds);
            targetLoadTimeInput.value = formatSecondsToTime(targetLoadTimeInSeconds);

            GM_setValue('bdr_sourceVideoUrl', sourceVideoUrl);
            GM_setValue('bdr_sourceDanmakuTime', sourceDanmakuTimeInput.value);
            GM_setValue('bdr_targetLoadTime', targetLoadTimeInput.value);

            // 调用核心弹幕加载逻辑
            loadCustomDanmaku(sourceVideoUrl, sourceDanmakuTimeInSeconds, targetLoadTimeInSeconds);
        });
    }

    function parseTimeToSeconds(timeStr) {
        if (typeof timeStr !== 'string' && typeof timeStr !== 'number') return 0;
        timeStr = String(timeStr).trim();
        if (timeStr.includes(':')) {
            const parts = timeStr.split(':');
            const minutes = parseInt(parts[0], 10) || 0;
            const seconds = parseInt(parts[1], 10) || 0;
            return (minutes * 60) + seconds;
        } else {
            return parseInt(timeStr, 10) || 0;
        }
    }

    function formatSecondsToTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function isValidBilibiliVideoUrl(url) {
        return url.startsWith('https://www.bilibili.com/video/BV') || url.startsWith('https://www.bilibili.com/video/av');
    }

    // --- 核心弹幕注入逻辑 (来自 bilibili_danmaku_injector.js) ---
    let danmakuContainer = null;
    let videoElement = null;
    let currentDanmakuData = [];
    let danmakuDisplayInterval = null;
    let lastDisplayedIndex = -1;

    function loadCustomDanmaku(sourceUrl, sourceTime, targetTime) {
        const statusMessage = document.getElementById('bdr-status-message'); // Get status message element
        if (!document.querySelector('video')) {
            statusMessage.textContent = "当前页面没有检测到视频播放器。";
            statusMessage.style.color = '#d9534f';
            return;
        }
        initializeDanmakuDisplay();
        fetchDanmaku(sourceUrl)
            .then(danmakuList => {
                if (danmakuList && danmakuList.length > 0) {
                    const timeOffset = targetTime - sourceTime;
                    currentDanmakuData = danmakuList.map(d => ({
                        ...d,
                        time: d.time + timeOffset
                    })).filter(d => d.time >= 0);
                    currentDanmakuData.sort((a, b) => a.time - b.time);
                    console.log(`[油猴脚本] 获取并调整后 ${currentDanmakuData.length} 条弹幕数据，时间偏移: ${timeOffset}s`);
                    startDanmakuDisplay();
                    statusMessage.textContent = '弹幕加载指令已发送！';
                    statusMessage.style.color = '#5cb85c';
                } else {
                    statusMessage.textContent = "未能获取到弹幕数据或弹幕为空。";
                    statusMessage.style.color = '#d9534f';
                }
            })
            .catch(error => {
                console.error("[油猴脚本] 获取弹幕失败:", error);
                statusMessage.textContent = `获取弹幕失败: ${error.message}`;
                statusMessage.style.color = '#d9534f';
            });
    }

    function initializeDanmakuDisplay() {
        videoElement = document.querySelector('video');
        if (!videoElement) {
            console.error("[油猴脚本] 未能找到video元素");
            return;
        }
        if (danmakuContainer) {
            danmakuContainer.remove();
        }
        danmakuContainer = document.createElement('div');
        danmakuContainer.id = 'custom-danmaku-container';
        const videoPlayerContainer = videoElement.closest('.bpx-player-video-wrap') || videoElement.parentNode;
        if (videoPlayerContainer) {
            videoPlayerContainer.style.position = 'relative';
            videoPlayerContainer.appendChild(danmakuContainer);
        } else {
            document.body.appendChild(danmakuContainer);
        }
        if (danmakuDisplayInterval) {
            clearInterval(danmakuDisplayInterval);
            danmakuDisplayInterval = null;
        }
        currentDanmakuData = [];
    }

    async function fetchDanmaku(sourceVideoUrl) {
        const videoId = extractVideoId(sourceVideoUrl);
        if (!videoId) throw new Error("无法从URL中提取视频ID");
        console.log("[油猴脚本] 提取到的视频ID:", videoId);

        const pageListUrl = videoId.startsWith('BV') ?
            `https://api.bilibili.com/x/player/pagelist?bvid=${videoId}&jsonp=jsonp` :
            `https://api.bilibili.com/x/player/pagelist?aid=${videoId.substring(2)}&jsonp=jsonp`;

        const cid = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: pageListUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data && data.data.length > 0) {
                            resolve(data.data[0].cid);
                        } else {
                            reject(new Error(`获取CID失败: ${data.message || '未知错误'}`));
                        }
                    } catch (e) {
                        reject(new Error(`解析CID响应失败: ${e.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求CID失败: ${error.statusText || '网络错误'}`));
                }
            });
        });
        console.log("[油猴脚本] 获取到的CID:", cid);
        if (!cid) throw new Error("未能获取到视频的CID");

        const danmakuApiUrl = `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`;
        console.log("[油猴脚本] 请求弹幕API:", danmakuApiUrl);

        const danmakuXmlText = await new Promise((resolve, reject) => {
             GM_xmlhttpRequest({
                method: "GET",
                url: danmakuApiUrl,
                overrideMimeType: 'text/xml; charset=utf-8', // 确保正确解析编码
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`获取弹幕XML失败，状态码: ${response.status}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`请求弹幕XML失败: ${error.statusText || '网络错误'}`));
                }
            });
        });
        return parseDanmakuXml(danmakuXmlText);
    }

    function extractVideoId(url) {
        let match = url.match(/BV([a-zA-Z0-9]+)/);
        if (match && match[1]) return 'BV' + match[1];
        match = url.match(/av([0-9]+)/);
        if (match && match[1]) return 'av' + match[1];
        return null;
    }

    function parseDanmakuXml(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const danmakuElements = xmlDoc.getElementsByTagName('d');
        const danmakuList = [];
        for (let i = 0; i < danmakuElements.length; i++) {
            const pAttribute = danmakuElements[i].getAttribute('p');
            if (pAttribute) {
                const params = pAttribute.split(',');
                const time = parseFloat(params[0]);
                const text = danmakuElements[i].textContent;
                danmakuList.push({ time, text });
            }
        }
        return danmakuList;
    }

    function startDanmakuDisplay() {
        if (!videoElement || !danmakuContainer || currentDanmakuData.length === 0) return;
        console.log("[油猴脚本] 开始弹幕显示循环");
        lastDisplayedIndex = -1;
        if (danmakuDisplayInterval) clearInterval(danmakuDisplayInterval);

        danmakuDisplayInterval = setInterval(() => {
            if (videoElement && !videoElement.paused) {
                const currentTime = videoElement.currentTime;
                for (let i = lastDisplayedIndex + 1; i < currentDanmakuData.length; i++) {
                    const danmaku = currentDanmakuData[i];
                    if (danmaku.time >= currentTime && danmaku.time < currentTime + 0.5) {
                        displaySingleDanmaku(danmaku.text);
                        lastDisplayedIndex = i;
                    } else if (danmaku.time > currentTime + 0.5) {
                        break;
                    }
                }
            }
        }, 250);
        if(videoElement){
            videoElement.addEventListener('seeked', resetDanmakuOnSeek);
            videoElement.addEventListener('play', resetDanmakuOnSeek);
        }
    }

    function resetDanmakuOnSeek() {
        if (!videoElement) return;
        console.log("[油猴脚本] 视频进度条变动，重置弹幕索引");
        const currentTime = videoElement.currentTime;
        lastDisplayedIndex = -1;
        for (let i = 0; i < currentDanmakuData.length; i++) {
            if (currentDanmakuData[i].time <= currentTime) {
                lastDisplayedIndex = i;
            } else {
                break;
            }
        }
        if (danmakuContainer) danmakuContainer.innerHTML = '';
    }

    function displaySingleDanmaku(text) {
        if (!danmakuContainer) return;
        const danmakuElement = document.createElement('div');
        danmakuElement.classList.add('custom-danmaku-item');
        danmakuElement.textContent = text;
        const containerHeight = danmakuContainer.clientHeight;
        const randomTop = Math.random() * (containerHeight - 20);
        danmakuElement.style.top = `${Math.max(0, randomTop)}px`;
        danmakuElement.style.color = getRandomColor();
        danmakuContainer.appendChild(danmakuElement);
        const animationDuration = 8 + Math.random() * 4;
        danmakuElement.style.animation = `scrollDanmaku ${animationDuration}s linear forwards`;
        danmakuElement.addEventListener('animationend', () => {
            danmakuElement.remove();
        });
    }

    function getRandomColor() {
        const colors = ['#FFFFFF', '#FFE5E5', '#DFFFDF', '#E0E0FF', '#FFFFD4', '#FFD1FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // --- 初始化 ---
    createSettingsPanel();
    console.log("哔哩哔哩弹幕复用油猴脚本已加载并初始化设置面板。");

})();
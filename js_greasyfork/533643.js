// ==UserScript==
// @name           VTuber直播/视频镜像查找工具
// @name:en        VTuber Stream Mirror Finder (Ragtag Archive Hook)
// @namespace      https://github.com/ChineseOnChain
// @author         Chairman
// @version        1.0b
// @description    检测未存档/私享的直播/视频，并检查Ragtag.moe查找镜像。 
// @description:en Check for mirrors of unarchived VTuber content on Ragtag.moe
// @match          https://www.youtube.com/watch?v=*
// @match          https://www.youtube.com/live/*
// @grant          GM_xmlhttpRequest
// @connect        archive.ragtag.moe
// @downloadURL https://update.greasyfork.org/scripts/533643/VTuber%20Stream%20Mirror%20Finder%20%28Ragtag%20Archive%20Hook%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533643/VTuber%20Stream%20Mirror%20Finder%20%28Ragtag%20Archive%20Hook%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 每个视频ID最多检查一次  
    const checkedVideoIds = new Set();
    let isCheckingInProgress = false;

    function debugLog(message, data) {
        console.log(`[VTuber Mirror Finder] ${message}`, data || '');
    }

    // 检测当前视频是否已失效/不可用  
    function isDeadVideo() {
        return document.querySelector('div.promo-message.style-scope.ytd-background-promo-renderer') !== null;
    }

    function getVideoID() {
        const url = new URL(window.location.href);
        if (url.pathname.includes('/live/')) {
            return url.pathname.split('/live/')[1].split(/[/?]/)[0];
        }
        return url.searchParams.get('v');
    }

    function createMirrorButton(videoId) {
        const archiveUrl = `https://archive.ragtag.moe/watch?v=${videoId}`;

        const button = document.createElement('a');
        button.id = 'ragtag-mirror-button';
        button.innerHTML = '⚠️ View on Ragtag.moe Archive';
        button.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            font-family: YouTube Noto, Arial;
            text-decoration: none;
            font-size: 14px;
            transition: all 0.2s;
        `;
        button.href = archiveUrl;
        button.target = '_blank';

        button.onmouseenter = () => {
            button.style.background = '#ff6b81';
            button.style.transform = 'scale(1.05)';
        };
        button.onmouseleave = () => {
            button.style.background = '#ff4757';
            button.style.transform = 'scale(1)';
        };

        document.body.appendChild(button);
        debugLog(`已为视频ID创建镜像按钮/Created archive button for video ID: ${videoId}`);
    }

    function checkForMirror() {
        if (isCheckingInProgress || !isDeadVideo()) return;

        const videoId = getVideoID();
        if (!videoId || checkedVideoIds.has(videoId)) return;

        isCheckingInProgress = true;
        checkedVideoIds.add(videoId);
        debugLog(`正在检查视频ID的镜像存档/Checking archive for video ID: ${videoId}`);

        const apiUrl = `https://archive.ragtag.moe/api/v1/search?q=${encodeURIComponent(videoId)}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            headers: {
                'Accept': 'application/json'
            },
            onload: function(response) {
                isCheckingInProgress = false;

                if (response.status !== 200) {
                    debugLog(`API请求失败，状态码/API request failed with status ${response.status}`);
                    return;
                }

                try {
                    const data = JSON.parse(response.responseText);
                    debugLog('已收到API响应/API response received', data);

                    // 检查API返回结果中是否存在匹配的视频ID
                    if (data.hits?.hits?.some(hit => hit._id === videoId)) {
                        debugLog(`找到视频ID的精确匹配/Found exact match for video ID: ${videoId}`);
                        createMirrorButton(videoId);
                    } else {
                        debugLog('未在结果中找到完全匹配的视频ID/No exact video ID match found in results');
                    }
                } catch (e) {
                    debugLog('解析API响应时出错/Error parsing API response:', e);
                }
            },
            onerror: function(error) {
                isCheckingInProgress = false;
                debugLog('API请求失败/API request failed:', error);
            },
            timeout: 5000
        });
    }

    function initialize() {
        if (document.readyState === 'complete') {
            checkForMirror();
        } else {
            window.addEventListener('load', checkForMirror);
        }

        let observerTimeout;
        new MutationObserver(() => {
            clearTimeout(observerTimeout);
            observerTimeout = setTimeout(checkForMirror, 500);
        }).observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(checkForMirror, 3000);
    }

    initialize();
})();
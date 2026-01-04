// ==UserScript==
// @name                Extract Douyin Live Stream URLs
// @name:zh-CN          抖音直播流提取
// @namespace           Cassandre
// @version             2.0
// @description         Extract stream URLs from Douyin live streams
// @description:zh-CN   提取抖音直播地址
// @author              Cassandre Cora
// @license MIT
// @icon                https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/logo-horizontal-small.svg
// @match               https://live.douyin.com/*
// @match               https://www.douyin.com/*
// @connect             live.douyin.com
// @run-at              document-end
// @grant               GM_addStyle
// @grant               GM_setClipboard
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/515942/Extract%20Douyin%20Live%20Stream%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/515942/Extract%20Douyin%20Live%20Stream%20URLs.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let dragBallTop = GM_getValue('dragBallTop');

    dragBallTop = dragBallTop ?? '50%';

    GM_setValue('dragBallTop', dragBallTop);

    const STYLES = `
    .douyin-stream-url-side-button {
        position: fixed;
        z-index: 19998;
        right: 0;
        width: 40px;
        height: 40px;
        border: none;
        outline: none;
        cursor: pointer;
        color: white;
        text-align: center;
        background: linear-gradient(135deg, #FE2C55 0%, #FF4B75 100%);
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAASLSURBVHhe7ZtfSFNRHMddDjZBG4KUiDXJ/gwq8EEIMhJEHySQQAl88DEQguytHnvzKejRnnyrqEAK6aGEsH9EMxikbrCZt8bUQnKGtIlT+57dM2l27s49d/fe7a7zgS+/3/ltu3fn69m991zPde3u7lZJtDlAo0QDaRAHaRAH2wyKxWJ9CAPpdNqnVooD26lH6FcUpUOtWAQ5SFutcDh8BfHzzs7OT8RbqVTK9/frosLn67GtUeRJxCC237v/PWaJWTRLW1tbNYjXoa9QFmrSCF7zIDI/V0hkm9jGbeRJKAvaswiDRrdZSMyiWVpeXm5HfA7lgQ4lEIZFO0QNvwl9h/LANp/F43GyP+ZnjYpZNFOLi4s9iG+hPERNKmQOeIn9dCAyP1uMmEWzVaxJpTKHiFm0QkZNKqU5RMyiVRI1qdTmEDGLVkrEpGAweAOxZOYQMYtWq4BJe9c0uWun7Av52GYOEbNohwqZBI0jLbk5RJbf7iBTAq/XS6YXZGqQN83AvrtdLtcQ0qNqRRu8dw7vHUf6Sa3ssQatYz9r2M+6WjIPUw3KZDI1breb/IXJvOscOnQK0ZS5lx6w3xTCIvQK+34K0z4Wa5opBtFRchXpNYg7GuwCfZuBUXfx/SYNG0UMKka4vL+AY8Yk8jRUluD7vTB67GIW9SoajfYhzkBlD0x6g+/bhZTZFy0xi3rkJHNyGDGJWeRJUZRuxH9O0U4AJgnN+oXvKJIDst/vH0Bq7Z086+hubm6+hH7oOrsKG4TR04PgVHOqcFYj87uhSCTSS0sFETKIjJ5AINCF9IxacSYwqbWtre0krts8tKSJkEGrq6unEU6oLWeDUdS+srJyljY1MWLQcbXleI4lk8kjNNdEyKCNjY0mhMNqy/E0oT+HaK6JkEHb29teBO7v1gngOFS/ubnJPZPpNogcoDs7O22beNoB+lPPO90LjSCD3MNvnUxgXUTIWxEfkheKwIptMhEaQQgVNYIAGUEHac7EjhHkaMrGIFyXLIRCoUGk2Z8NEdrDiN+gkiFHEAdpEAdpEAdpEAdpEAdpEAdpEAdpEIeyMYje5XuAlPwnMyu0xxBL+o9IOYI4SIM4SIM4SIM46DbI6/Vm1+GorYqBrCn6RXM2uX+x8kSW/yOOQZXEKO+xCKERND09XVEjCP3hrkoTOgZ5PJ6K+ZlhdKSqq6vTtKmJkEF1dXVLCD/UluNZqq2t5fZFyCCfz/cFIa62HM98Q0NDjOaaCBnU2NhIVpjOqi1ng6nNHAyK0qYmQga53e5UKBSaR1rSG+nFguPPTCQSea1nYaeQQYRAIPAIO5hAuqlWnAdGz1RLS8t72iyIsEHkdJ9IJJ4gfadWHMeUoij6lwXnLohEJRdx6pCTTLJ9GXBOWg+llAsw5jf02OjzrGY+itCPdAQqm/WL6NsCDsh38P3u6z7m7MPUh1moUeexzctoXsSX8yPatuAK+yVToTD0AfueyGQyQVyaFHW2NdUgFtQ0smzGquUzznkcqhIRvg7635AGcZAGcZAGcZAGcZAGcZAGcZAGFaSq6g9nIAeo/buTRwAAAABJRU5ErkJggg==);
        background-size: 100% 100%;
    }
    .douyin-stream-url-side-button:hover {
        transform: scale(1.08);
    }
    .douyin-stream-url-close-button {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border: 2px solid #FE2C55;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        outline: none;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .douyin-stream-url-close-button:hover {
        transform: scale(1.1);
        background: rgb(254, 44, 85);
        color: white;
        font-weight: bold;
    }
    #douyin-stream-url-app {
        position: fixed;
        right: 20px;
        width: 320px;
        height: auto;
        opacity: 0;
        background-color: rgba(24, 24, 24, 0.95);
        color: #e0e0e0;
        padding: 15px;
        font-size: 13px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        z-index: 9999;
        border-radius: 16px;
        transform: translateX(110%);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,.7)
    }
    .douyin-stream-url-list-container {
        background-color: rgba(31, 31, 31, 0.8);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 12px;
        overflow: hidden;
    }
    .douyin-stream-url-list-container:last-child {
        margin-bottom: 0;
    }
    .douyin-stream-url-list-header {
        background-color: rgba(45, 45, 45, 0.8);
        padding: 10px 12px;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .douyin-hls-stream-url-list-content, .douyin-flv-stream-url-list-content {
        padding: 8px;
        overflow-x: auto;
        white-space: nowrap;
        background-color: rgba(38, 38, 38, 0.8);
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-size: 13px;
        line-height: 1.6;
        color: #d1d1d1;
        max-height: 150px;
        overflow-y: auto;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .douyin-stream-url-button-container {
        display: flex;
        gap: 4px;
        padding: 4px;
    }
    .douyin-hls-stream-url-copy-button, .douyin-flv-stream-url-copy-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50%;
        padding: 10px;
        background: rgb(254, 44, 85);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    }
    .douyin-hls-stream-url-copy-button:hover, .douyin-flv-stream-url-copy-button:hover {
        transform: translateY(-1px);
        background: rgb(210, 27, 70);
    }
    .douyin-stream-url-download-all-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 12px;
        background: rgb(254, 44, 85);
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        border-radius: 10px;
        margin-top: 8px;
    }
    .douyin-stream-url-download-all-button:hover {
        transform: translateY(-1px);
        background: rgb(210, 27, 70);
    }
`;

    const QUALITY_LEVELS = ['FULL_HD1', 'HD1', 'SD2', 'SD1'];

    const QUALITY_MAP = {
        'FULL_HD1': '原画',
        'HD1': '超清',
        'SD2': '高清',
        'SD1': '标清'
    };

    // current room ID
    let currentRid = null;

    // Inject styles
    GM_addStyle(STYLES);

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Initialize based on domain
    function init() {
        const domain = window.location.hostname;
        switch (domain) {
            case 'live.douyin.com':
                initLivePage();
                break;
            case 'www.douyin.com':
                initUrlChangeListener();
                break;
        }
    }

    // Initialize live page
    function initLivePage() {
        const streamData = getStreamDataFromPage();
        if (streamData?.status) {
            createUI(streamData);
        }
    }

    // Initialize URL change listener
    function initUrlChangeListener() {
        onUrlChange(handleUrlChange);
    }

    // Handle URL changes
    async function handleUrlChange(urlData) {
        const isLivePage = ['root/live', 'follow/live'].some(path => urlData.url.includes(`www.douyin.com/${path}`));
        if (!isLivePage) {
            currentRid = null;
            const selectors = ['douyin-stream-url-app', '.douyin-stream-url-side-button'];
            selectors.forEach(selector => {
                const element = selector.startsWith('.') ?
                    document.querySelector(selector) :
                    document.getElementById(selector);
                element?.remove();
            });
            return;
        }

        const rid = extractRoomId(urlData.url);
        if (!rid) {
            console.warn('Failed to extract room ID');
            return;
        }

        if (rid === currentRid) {
            console.warn(`Room ID unchanged: ${rid}`);
            return;
        }

        currentRid = rid;

        try {
            console.log(`Getting stream data from API, room ID: ${rid}`);
            await getStreamDataFromApi(rid);
        } catch (err) {
            console.error('Failed to get stream data:', err);
        }
    }

    // Extract room ID from URL
    function extractRoomId(url) {
        const match = url.match(/\/(\d+)(?:\/|\?|$)/);
        return match ? match[1] : null;
    }

    // URL change listener
    function onUrlChange(callback) {
        window.addEventListener('popstate', () => callback({
            type: 'popstate',
            url: window.location.href,
            timestamp: Date.now()
        }));

        const originalPushState = history.pushState;
        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            callback({
                type: 'pushState',
                url: window.location.href,
                timestamp: Date.now()
            });
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            callback({
                type: 'replaceState',
                url: window.location.href,
                timestamp: Date.now()
            });
        };

        window.addEventListener('hashchange', () => callback({
            type: 'hashchange',
            url: window.location.href,
            timestamp: Date.now()
        }));
    }

    // Extract JSON from page
    function extractJSON(pattern, page) {
        const pageHTML = page || document.documentElement.outerHTML;
        const match = pageHTML?.match(pattern);
        return match ? match[1].replace(/\\/g, '').replace(/u0026/g, '&') : null;
    }

    // Get stream data from page
    function getStreamDataFromPage(pageHTML) {
        try {
            const jsonStr = extractJSON(/(\{\\"state\\":.*?)]\\n"]\)/, pageHTML) ||
                extractJSON(/(\{\\"common\\":.*?)]\\n"]\)<\/script><div hidden/, pageHTML);

            if (!jsonStr) {
                console.warn("Page JSON data not found");
                return null;
            }

            const roomStoreMatch = jsonStr.match(/"roomStore":(.*?),"linkmicStore"/);
            if (!roomStoreMatch) {
                console.warn("Room data not found");
                return null;
            }

            const roomStore = `${roomStoreMatch[1].split(',"has_commerce_goods"')[0]}}}}`;
            const roomData = JSON.parse(roomStore)?.roomInfo?.room;

            if (!roomData) {
                console.warn("Invalid room data structure");
                return null;
            }

            const anchorNameMatch = roomStore.match(/"nickname":"(.*?)","avatar_thumb/);

            const replaceHttp = (obj) => {
                try {
                    return Object.entries(obj).reduce((acc, [key, value]) => {
                        acc[key] = value.replace(/http:\/\//g, 'https://');
                        return acc;
                    }, {});
                } catch (error) {
                    return null;
                }
            };

            return {
                id: roomData?.id_str || '',
                status: roomData?.status === 2,
                anchor_name: anchorNameMatch?.[1] || '',
                hls_stream_url: replaceHttp(roomData?.stream_url?.hls_pull_url_map) || '',
                flv_stream_url: replaceHttp(roomData?.stream_url?.flv_pull_url) || '',
                title: roomData?.title || '',
                avatar_thumb: roomData?.owner?.avatar_thumb || ''
            };

        } catch (error) {
            console.error("Error parsing room data:", error);
            return null;
        }
    }

    // Get stream data from API
    async function getStreamDataFromApi(rid, retryCount = 0) {
        if (typeof rid !== 'string' && typeof rid !== 'number') {
            console.warn('Invalid room ID type');
            return null;
        }

        try {
            const userAgent = navigator.userAgent;
            const language = navigator.language;
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://live.douyin.com/${rid}`,
                headers: {
                    'User-Agent': userAgent,
                    'Accept-Language': language,
                    'Referer': 'https://live.douyin.com/',
                },
                onload: (response) => {
                    const res = response.responseText;
                    const streamData = getStreamDataFromPage(res);
                    if (streamData === null && retryCount < 1) {
                        console.warn('Failed to get stream data from page, retrying once...');
                        setTimeout(() => {
                            getStreamDataFromApi(rid, retryCount + 1);
                        }, 1000);
                        return;
                    }
                    if (streamData?.status) {
                        createUI(streamData);
                    }
                },
                onerror: (error) => {
                    console.error('Failed to get stream data:', error);
                }
            });
        } catch (error) {
            console.error('Failed to get stream data:', error);
            return null;
        }
    }

    // Create stream URL list
    function createStreamUrlList(data) {
        return QUALITY_LEVELS.reduce((acc, quality) => {
            acc[quality] = {
                hls_stream_url: data.hls_stream_url?.[quality] || null,
                flv_stream_url: data.flv_stream_url?.[quality] || null
            };
            return acc;
        }, {});
    }

    // Copy to clipboard
    async function copyToClipboard(text, button, type) {
        try {
            if (GM_setClipboard) {
                await GM_setClipboard(text);
            } else {
                await navigator.clipboard.writeText(text);
            }
            button.textContent = '已复制!';
            setTimeout(() => {
                button.textContent = `复制 ${type}`;
            }, 1000);
        } catch (err) {
            console.error('Copy failed:', err);
            button.textContent = '复制失败!';
        }
    }

    // Download M3U8 file
    function downloadM3U8(content, filename) {
        try {
            const blob = new Blob([content], { type: 'application/x-mpegURL' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download M3U8 file:', err);
        }
    }

    // Create UI components
    function createUI(data) {
        const app = document.createElement('div');
        app.id = 'douyin-stream-url-app';

        const urlList = createStreamUrlList(data);

        Object.entries(urlList).forEach(([quality, urls]) => {
            if (!urls.hls_stream_url && !urls.flv_stream_url) return;
            const container = createQualityContainer(quality, urls);
            app.appendChild(container);
        });

        const downloadAllButton = createDownloadAllButton(data, urlList);
        app.appendChild(downloadAllButton);

        const { sideButton, closeButton } = createControlButtons(app);

        app.appendChild(closeButton);
        document.body.appendChild(app);
        document.body.appendChild(sideButton);

        app.style.top = getAppTop(app);
    }

    // Get app top position
    function getAppTop(app) {
        const appHeight = app.clientHeight;
        const viewportHeight = document.documentElement.clientHeight;

        // Parse dragBallTop value and convert to pixels
        const dragBallValue = parseFloat(dragBallTop);
        const centerHeight = typeof dragBallTop === 'number' ? dragBallTop :
            dragBallTop.includes('%') ? dragBallValue * viewportHeight / 100 :
                dragBallValue;

        // Calculate vertical position of app, ensure within viewport
        const minTop = 10;
        const maxTop = viewportHeight - appHeight - 10;
        const calculatedTop = centerHeight + 20 - appHeight / 2;

        // Constrain within valid range and return
        return `${Math.max(minTop, Math.min(maxTop, calculatedTop))}px`;
    }

    // Create quality container
    function createQualityContainer(quality, urls) {
        const container = document.createElement('div');
        container.className = 'douyin-stream-url-list-container';

        const header = document.createElement('div');
        header.className = 'douyin-stream-url-list-header';
        header.textContent = `${QUALITY_MAP[quality]} ${quality}`;
        container.appendChild(header);

        const buttonContainer = createButtonContainer(quality, urls);
        container.appendChild(buttonContainer);

        return container;
    }

    // Create button container
    function createButtonContainer(quality, urls) {
        const container = document.createElement('div');
        container.className = 'douyin-stream-url-button-container';

        if (urls.hls_stream_url) {
            const hlsButton = document.createElement('button');
            hlsButton.className = 'douyin-hls-stream-url-copy-button';
            hlsButton.textContent = '复制 HLS';
            hlsButton.onclick = () => copyToClipboard(urls.hls_stream_url, hlsButton, 'HLS');
            container.appendChild(hlsButton);
        }

        if (urls.flv_stream_url) {
            const flvButton = document.createElement('button');
            flvButton.className = 'douyin-flv-stream-url-copy-button';
            flvButton.textContent = '复制 FLV';
            flvButton.onclick = () => copyToClipboard(urls.flv_stream_url, flvButton, 'FLV');
            container.appendChild(flvButton);
        }

        return container;
    }

    // Create download all button
    function createDownloadAllButton(data, urlList) {
        const button = document.createElement('button');
        button.className = 'douyin-stream-url-download-all-button';
        button.textContent = 'M3U8文件下载';

        button.onclick = () => {
            let m3u8Content = '#EXTM3U\n';
            Object.entries(urlList).forEach(([quality, urls]) => {
                if (urls.hls_stream_url) {
                    m3u8Content += `#EXTINF:-1 tvg-name="${QUALITY_MAP[quality]} ${quality} hls" tvg-logo="${data.avatar_thumb.url_list[0]}"\n${urls.hls_stream_url}\n`;
                }
                if (urls.flv_stream_url) {
                    m3u8Content += `#EXTINF:-1 tvg-name="${QUALITY_MAP[quality]} ${quality} flv" tvg-logo="${data.avatar_thumb.url_list[0]}"\n${urls.flv_stream_url}\n`;
                }
            });

            const filename = `抖音直播_${data.anchor_name}_${new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(/[\/\s:]/g, '').replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1$2$3_$4:$5')}.m3u8`;

            downloadM3U8(m3u8Content, filename);

            button.textContent = 'M3U8文件成功生成!';
            setTimeout(() => {
                button.textContent = 'M3U8文件下载';
            }, 1000);
        };

        return button;
    }

    // Create control buttons
    function createControlButtons(app) {
        const sideButton = document.createElement('button');
        sideButton.className = 'douyin-stream-url-side-button';
        sideButton.style.top = dragBallTop;

        dragBall(sideButton, app);

        const closeButton = document.createElement('button');
        closeButton.className = 'douyin-stream-url-close-button';
        closeButton.innerHTML = '<span>X</span>';

        closeButton.onclick = () => {
            app.style.transform = 'translateX(110%)';
            app.style.opacity = '0';
            sideButton.style.display = 'block';
        };

        return { sideButton, closeButton };
    }

    function dragBall(drag, container) {
        let startEvt, moveEvt, endEvt
        // Check if touch events are supported
        if ('ontouchstart' in window) {
            startEvt = 'touchstart'
            moveEvt = 'touchmove'
            endEvt = 'touchend'
        } else {
            startEvt = 'mousedown'
            moveEvt = 'mousemove'
            endEvt = 'mouseup'
        }
        // Flag to determine if it's a drag or click
        let isClick = true
        let disX, disY, left, top, starX, starY

        drag.addEventListener(startEvt, function (e) {
            // Prevent page scrolling and zooming
            e.preventDefault()
            isClick = true
            // Get coordinates when finger/mouse is pressed
            starX = e.touches ? e.touches[0].clientX : e.clientX
            starY = e.touches ? e.touches[0].clientY : e.clientY
            // Calculate offset from element's top-left corner
            disX = starX - drag.offsetLeft
            disY = starY - drag.offsetTop
            // Add event listeners after press
            document.addEventListener(moveEvt, moveFun)
            document.addEventListener(endEvt, endFun)
            // Remove transition during drag
            drag.style.transition = 'none'
        })

        function moveFun(e) {
            // If movement > 20px, consider it a drag rather than click
            if (
                Math.abs(starX - (e.touches ? e.touches[0].clientX : e.clientX)) > 20 ||
                Math.abs(starY - (e.touches ? e.touches[0].clientY : e.clientY)) > 20
            ) {
                isClick = false
            }
            left = (e.touches ? e.touches[0].clientX : e.clientX) - disX
            top = (e.touches ? e.touches[0].clientY : e.clientY) - disY
            // Constrain X movement within screen bounds
            if (left < 0) {
                left = 0
            } else if (left > document.documentElement.clientWidth - drag.offsetWidth) {
                left = document.documentElement.clientWidth - drag.offsetWidth
            }
            // Constrain Y movement within screen bounds
            if (top < 0) {
                top = 0
            } else if (top > document.documentElement.clientHeight - drag.offsetHeight) {
                top = document.documentElement.clientHeight - drag.offsetHeight
            }
            drag.style.left = left + 'px'
            drag.style.top = top + 'px'
        }

        function endFun(e) {
            document.removeEventListener(moveEvt, moveFun)
            document.removeEventListener(endEvt, endFun)
            if (isClick) { // Handle click
                drag.style.display = 'none';
                container.style.transform = 'translateX(0)';
                container.style.opacity = '1';
            } else { // Handle drag end
                drag.style.transition = 'left 0.3s ease-out'
                drag.style.left = (document.documentElement.clientWidth - drag.offsetWidth) + 'px'
                dragBallTop = drag.style.top;
                GM_setValue('dragBallTop', dragBallTop);
                container.style.top = getAppTop(container);
            }
        }
    }

    // Initialize
    init();
})()
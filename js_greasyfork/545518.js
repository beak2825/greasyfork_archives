// ==UserScript==
// @name         Jellyfin 沉浸式播放控制：Trickplay 预览 + 键盘/触控增强
// @namespace    https://github.com/guiyuanyuanbao/Jellyfin-betterJellyfinWebPlayer-extension
// @version      1.4
// @description  为 Jellyfin 提供沉浸式播放控制体验：滑动进度时显示影片预览图 (Trickplay)；键盘右键短按快进 10 秒 / 长按 2 倍速；移动端支持长按倍速、水平滑动调节进度、双击播放暂停；倍速显示呼吸灯动画，滑动显示时间预览和自定义进度条；智能 OSD 隐藏，打造无干扰观影环境。
// @author       guiyuanyuanbao
// @license      MIT
// @match        *://*/*/web/index.html
// @match        *://*/web/index.html
// @match        *://*/*/web/
// @match        *://*/web/
// @run-at       document-idle
// @grant        none
// @supportURL   https://github.com/guiyuanyuanbao/Jellyfin-betterJellyfinWebPlayer-extension/issues
// @homepageURL  https://github.com/guiyuanyuanbao/Jellyfin-betterJellyfinWebPlayer-extension
// @downloadURL https://update.greasyfork.org/scripts/545518/Jellyfin%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6%EF%BC%9ATrickplay%20%E9%A2%84%E8%A7%88%20%2B%20%E9%94%AE%E7%9B%98%E8%A7%A6%E6%8E%A7%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545518/Jellyfin%20%E6%B2%89%E6%B5%B8%E5%BC%8F%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6%EF%BC%9ATrickplay%20%E9%A2%84%E8%A7%88%20%2B%20%E9%94%AE%E7%9B%98%E8%A7%A6%E6%8E%A7%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[InjectScript] Jellyfin speed control script loaded');

    const LONG_PRESS_MS = 300;
    const SHORT_SEEK_S = 10;
    let pressTimer = null;
    let originalRate = 1;
    let isFast = false;
    let osdBottomElement = null; // 添加OSD元素引用
    let headerElement = null; // 添加頭部元素引用

    // --- Trickplay 相關變數 ---
    let trickplayData = null;
    let lastVideoSrc = null; // 用於追蹤影片來源是否變更

    function getVideo() {
        return document.querySelector('video');
    }

    // --- 全新改寫：獲取 Trickplay 資訊 (兼容直接播放和轉碼) ---
    async function getTrickplayInfo() {
        console.log('[Inject] 正在嘗試獲取 Trickplay 資訊...');
        const vid = getVideo();
        if (!vid) return null;

        // --- 方案 A: 嘗試從 URL 直接解析 (適用於直接播放) ---
        if (vid.src && !vid.src.startsWith('blob:')) {
            try {
                const url = new URL(vid.src);
                const apiKey = url.searchParams.get('api_key');
                const match = url.pathname.match(/\/Videos\/([a-f0-9]+)\//);
                if (apiKey && match && match[1]) {
                    const info = {
                        itemId: match[1],
                        apiKey: apiKey,
                        baseUrl: `${url.protocol}//${url.host}`
                    };
                    console.log('[Inject] 成功從 URL 獲取資訊 (方案A):', info);
                    return info;
                }
            } catch (e) {
                console.log('[Inject] 從 URL 解析失敗，將嘗試方案B。');
            }
        }

        // --- 方案 B: 從 API 獲取 (適用於轉碼 'blob:' URL 或方案A失敗時) ---
        console.log('[Inject] URL 為 blob 或解析失敗，正在啟動 API 方案 (方案B)...');
        try {
            if (typeof ApiClient === 'undefined') {
                console.log('[Inject] 找不到 ApiClient。');
                return null;
            }
            const apiKey = ApiClient.accessToken();
            const baseUrl = ApiClient.serverAddress();
            const deviceId = ApiClient.deviceId();
            const sessionUrl = `${baseUrl}/Sessions`;

            const response = await fetch(sessionUrl, {
                headers: { 'X-Emby-Token': apiKey }
            });
            if (!response.ok) throw new Error(`API 請求失敗，狀態: ${response.status}`);

            const sessions = await response.json();
            // 精準查找與當前裝置 ID 匹配，並且正在播放內容的 session
            const currentSession = sessions.find(s => s.DeviceId === deviceId && s.NowPlayingItem);

            if (currentSession) {
                const info = {
                    itemId: currentSession.NowPlayingItem.Id,
                    apiKey: apiKey,
                    baseUrl: baseUrl
                };
                console.log('[Inject] 成功從 Sessions API 獲取資訊 (方案B):', info);
                return info;
            }
        } catch (error) {
            console.error('[Inject] 透過 API 獲取資訊時出錯:', error);
            return null;
        }

        console.log('[Inject] 方案A和B均失敗，無法獲取 Trickplay 資訊。');
        return null;
    }


    // --- 獲取並解析 M3U8 檔案 ---
    async function setupTrickplay() {
        console.log('[Inject] 正在設定 Trickplay...');
        // getTrickplayInfo 現在是異步的，需要 await
        const trickplayInfo = await getTrickplayInfo();
        if (!trickplayInfo) {
            console.log('[Inject] 無法獲取 Trickplay 資訊，設定中止。');
            trickplayData = null;
            return;
        }

        const m3u8Url = `${trickplayInfo.baseUrl}/Videos/${trickplayInfo.itemId}/Trickplay/320/tiles.m3u8?api_key=${trickplayInfo.apiKey}`;

        try {
            const response = await fetch(m3u8Url);
            if (!response.ok) throw new Error(`HTTP 錯誤！狀態: ${response.status}`);
            const m3u8Text = await response.text();

            const baseImageUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf('/') + 1);
            console.log('[Inject] 推導出的圖片基礎路徑:', baseImageUrl);

            const lines = m3u8Text.split('\n');
            const tilesLine = lines.find(line => line.startsWith('#EXT-X-TILES'));
            if (!tilesLine) throw new Error('在 M3U8 中找不到 #EXT-X-TILES 標籤。');

            const resolutionMatch = tilesLine.match(/RESOLUTION=(\d+)x(\d+)/);
            const layoutMatch = tilesLine.match(/LAYOUT=(\d+)x(\d+)/);
            const durationMatch = tilesLine.match(/DURATION=([\d.]+)/);

            if (!resolutionMatch || !layoutMatch || !durationMatch) {
                 throw new Error('無法解析 #EXT-X-TILES 標籤的屬性。');
            }

            const images = lines.filter(line => line.includes('.jpg'));

            trickplayData = {
                width: parseInt(resolutionMatch[1], 10),
                height: parseInt(resolutionMatch[2], 10),
                cols: parseInt(layoutMatch[1], 10),
                rows: parseInt(layoutMatch[2], 10),
                interval: parseFloat(durationMatch[1]),
                images: images,
                thumbsPerImage: parseInt(layoutMatch[1], 10) * parseInt(layoutMatch[2], 10),
                baseImageUrl: baseImageUrl
            };

            console.log('[Inject] Trickplay 數據已成功載入:', trickplayData);
        } catch (error) {
            console.error('[Inject] 獲取或解析 Trickplay M3U8 失敗:', error);
            trickplayData = null;
        }
    }

    // --- 更新並顯示 Trickplay 預覽 ---
    function updateTrickplay(time) {
        if (!trickplayData || !getVideo()?.duration) return;

        const previewEl = document.getElementById('trickplay-preview');
        if (!previewEl) return;

        const timePerImage = trickplayData.thumbsPerImage * trickplayData.interval;
        const imageIndex = Math.floor(time / timePerImage);
        const timeInImage = time % timePerImage;
        const thumbIndex = Math.floor(timeInImage / trickplayData.interval);

        if (imageIndex >= trickplayData.images.length) return;

        const imageName = trickplayData.images[imageIndex];
        const imageUrl = `${trickplayData.baseImageUrl}${imageName}`;

        const col = thumbIndex % trickplayData.cols;
        const row = Math.floor(thumbIndex / trickplayData.cols);

        const bgPosX = -col * trickplayData.width;
        const bgPosY = -row * trickplayData.height;

        previewEl.style.width = `${trickplayData.width}px`;
        previewEl.style.height = `${trickplayData.height}px`;
        // 添加对于油猴的兼容性支持
        let backgroundImage = "url(" + imageUrl +  ")";
        previewEl.style.backgroundImage = `${backgroundImage}`;
        previewEl.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;

        previewEl.style.display = 'block';
    }

    // --- 隱藏 Trickplay 預覽 ---
    function hideTrickplay() {
        const previewEl = document.getElementById('trickplay-preview');
        if (previewEl) {
            previewEl.style.display = 'none';
        }
    }

    function injectStyles() {
        const css = `
#speed-overlay {
    border-radius: 8px;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 4px 8px;
    font-size: 12px;
    display: none;
    align-items: center;
    z-index: 9999;
    pointer-events: none;
}

@keyframes breathe {
    0%, 100% {
        opacity: 0.4;
    }
    50% {
        opacity: 1;
    }
}

#speed-overlay .tri {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 8px solid #fff;
    margin-right: 4px;
    animation: breathe 1.5s infinite ease-in-out;
}

#speed-overlay .tri:nth-child(2) {
    animation-delay: 0.5s;
}

#speed-overlay .tri:nth-child(3) {
    animation-delay: 1s;
}

#time-overlay {
    border-radius: 12px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: bold;
    display: none;
    z-index: 10001;
    pointer-events: none;
    text-align: center;
}

#custom-progress-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(130deg,#a95bc2,#00a4db);
    z-index: 9997;
    display: none;
    pointer-events: none;
    transition: none;
    transform-origin: left center;
    border-radius: 0 2px 0 0;
}

#custom-progress-bar::before {
    content: '';
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    z-index: -1;
}

#custom-progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0 2px 0 0;
}

#trickplay-preview {
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: none;
    border: 2px solid rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    background-color: #000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    z-index: 10000;
    pointer-events: none;
}

/* 原生進度條樣式 - 與自訂進度條顏色保持一致 */
.mdl-slider-background-lower {
    background: linear-gradient(130deg,#a95bc2,#00a4db) !important;
}

.osdPositionSlider::-webkit-slider-thumb {
    background: #00a4db !important;
    border: 2px solid #ffffff !important;
    box-shadow: 0 0 6px rgba(0, 164, 219, 0.5) !important;
}

.osdPositionSlider::-moz-range-thumb {
    background: #00a4db !important;
    border: 2px solid #ffffff !important;
    box-shadow: 0 0 6px rgba(0, 164, 219, 0.5) !important;
}

/* 圖示OSD進度條樣式 - 與其他進度條顏色保持一致 */
.iconOsdProgressInner {
    background: linear-gradient(130deg,#a95bc2,#00a4db) !important;
}

.iconOsdProgressOuter {
    background: rgba(255, 255, 255, 0.3) !important;
}

/* 腳本專屬的隱藏CSS類 */
.script-osd-hidden {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}

/* MDL載入動畫漸變樣式 - 與進度條顏色保持一致 */
.mdl-spinner__circle {
    border: none !important;
    background: conic-gradient(
        from 0deg,
        #a95bc2 0deg,
        #9456b5 60deg,
        #7c6bc9 120deg,
        #00a4db 180deg,
        #a95bc2 240deg,
        transparent 240deg,
        transparent 360deg
    ) !important;
    border-radius: 50% !important;
    position: relative !important;
    mask: radial-gradient(circle at center, transparent 44%, black 45%, black 47%, transparent 48%) !important;
    -webkit-mask: radial-gradient(circle at center, transparent 44%, black 45%, black 47%, transparent 48%) !important;
    filter: drop-shadow(0 0 3px rgba(169, 91, 194, 0.3)) !important;
}

.mdl-spinner__circle::before {
    display: none !important;
}

.mdl-spinner__circleLeft,
.mdl-spinner__circleRight {
    border: none !important;
    background: transparent !important;
}

/* 移除單獨的層級樣式，使用統一的漸變圓環 */
.mdl-spinner__layer-1 .mdl-spinner__circle,
.mdl-spinner__layer-2 .mdl-spinner__circle,
.mdl-spinner__layer-3 .mdl-spinner__circle,
.mdl-spinner__layer-4 .mdl-spinner__circle {
    border: none !important;
    background: conic-gradient(
        from 0deg,
        #a95bc2 0deg,
        #9456b5 60deg,
        #7c6bc9 120deg,
        #00a4db 180deg,
        #a95bc2 240deg,
        transparent 240deg,
        transparent 360deg
    ) !important;
    mask: radial-gradient(circle at center, transparent 44%, black 45%, black 47%, transparent 48%) !important;
    -webkit-mask: radial-gradient(circle at center, transparent 44%, black 45%, black 47%, transparent 48%) !important;
    filter: drop-shadow(0 0 3px rgba(169, 91, 194, 0.3)) !important;
}

/* 確保spinner圓形完整顯示 */
.mdl-spinner__circle-clipper .mdl-spinner__circle {
    border: none !important;
    background: conic-gradient(
        from 0deg,
        #a95bc2 0deg,
        #9456b5 60deg,
        #7c6bc9 120deg,
        #00a4db 180deg,
        #a95bc2 240deg,
        transparent 240deg,
        transparent 360deg
    ) !important;
    border-radius: 50% !important;
    mask: radial-gradient(circle at center, transparent 44%, black 45%, black 47%, transparent 48%) !important;
    -webkit-mask: radial-gradient(circle at center, transparent 44%, black 45%, black 47%, transparent 48%) !important;
    filter: drop-shadow(0 0 3px rgba(169, 91, 194, 0.3)) !important;
}

/* 增強動畫的流暢性 */
.mdl-spinner {
    animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1) !important;
}
`;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    function createOverlay(container) {
        const ov = document.createElement('div');
        ov.id = 'speed-overlay';
        container.style.position = container.style.position || 'relative';
        container.appendChild(ov);

        const timeOv = document.createElement('div');
        timeOv.id = 'time-overlay';
        document.body.appendChild(timeOv);

        const progressBar = document.createElement('div');
        progressBar.id = 'custom-progress-bar';
        document.body.appendChild(progressBar);

        const trickplayPreview = document.createElement('div');
        trickplayPreview.id = 'trickplay-preview';
        document.body.appendChild(trickplayPreview);

        return ov;
    }

    function showOverlay(rate) {
        overlay.innerHTML = `
            <span class="tri"></span>
            <span class="tri"></span>
            <span class="tri"></span>
            <span class="text">倍速播放中 ×${rate.toFixed(1)}</span>
        `;
        overlay.style.display = 'flex';
    }

    function hideOverlay() {
        overlay.style.display = 'none';
    }

    function showTimeOverlay(currentTime, duration) {
        const timeOverlay = document.getElementById('time-overlay');
        if (timeOverlay) {
            const formatTime = (seconds) => {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            };
            timeOverlay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            timeOverlay.style.display = 'block';
        }
    }

    function hideTimeOverlay() {
        const timeOverlay = document.getElementById('time-overlay');
        if (timeOverlay) {
            timeOverlay.style.display = 'none';
        }
    }

    function hideOSDControls() {
        if (osdBottomElement) {
            if (!osdBottomElement.classList.contains('videoOsdBottom-hidden')) {
                osdBottomElement.classList.add('videoOsdBottom-hidden');
            }
            if (!osdBottomElement.classList.contains('hide')) {
                osdBottomElement.classList.add('hide');
            }
            if (!osdBottomElement.classList.contains('script-osd-hidden')) {
                osdBottomElement.classList.add('script-osd-hidden');
            }
        }
        if (headerElement) {
            if (!headerElement.classList.contains('osdHeader-hidden')) {
                headerElement.classList.add('osdHeader-hidden');
            }
            if (!headerElement.classList.contains('hide')) {
                headerElement.classList.add('hide');
            }
            if (!headerElement.classList.contains('script-osd-hidden')) {
                headerElement.classList.add('script-osd-hidden');
            }
        }
    }

    function showOSDControls() {
        if (osdBottomElement) {
            if (osdBottomElement.classList.contains('videoOsdBottom-hidden')) {
                osdBottomElement.classList.remove('videoOsdBottom-hidden');
            }
            if (osdBottomElement.classList.contains('hide')) {
                osdBottomElement.classList.remove('hide');
            }
            if (osdBottomElement.classList.contains('script-osd-hidden')) {
                osdBottomElement.classList.remove('script-osd-hidden');
            }
        }
        if (headerElement) {
            if (headerElement.classList.contains('osdHeader-hidden')) {
                headerElement.classList.remove('osdHeader-hidden');
            }
            if (headerElement.classList.contains('hide')) {
                headerElement.classList.remove('hide');
            }
            if (headerElement.classList.contains('script-osd-hidden')) {
                headerElement.classList.remove('script-osd-hidden');
            }
        }
    }

    function goFast() {
        const vid = getVideo();
        if (!vid || isFast) return;
        originalRate = vid.playbackRate || 1;
        const newRate = originalRate * 2;
        vid.playbackRate = newRate;
        isFast = true;
        showOverlay(newRate);
    }

    function restore() {
        const vid = getVideo();
        if (!vid || !isFast) return;
        vid.playbackRate = originalRate;
        isFast = false;
        hideOverlay();
    }

    function seekShort() {
        const vid = getVideo();
        if (!vid) return;
        vid.currentTime = Math.min(vid.duration, vid.currentTime + SHORT_SEEK_S);
    }

    function findOSDElement() {
        const view = document.querySelector('div[data-type="video-osd"]') || document;
        osdBottomElement = view.querySelector('.videoOsdBottom-maincontrols');
        headerElement = document.querySelector('.skinHeader');
    }

    function removePlayControlClasses() {
        const playControlButtons = document.querySelector('.osdPlayControlButtons');
        if (playControlButtons) {
            playControlButtons.classList.remove('flex', 'align-items-center', 'flex-direction-row', 'osdPlayControlButtons');
        }
    }

    function togglePlay() {
        const vid = getVideo();
        if (!vid) return;
        if (vid.paused) {
            vid.play();
            findOSDElement();
            hideOSDControls();
        } else {
            vid.pause();
            findOSDElement();
            showOSDControls();
        }
    }

    function toggleOSDVisibility() {
        findOSDElement();
        if (osdBottomElement && osdBottomElement.classList.contains('script-osd-hidden')) {
            showOSDControls();
        } else {
            hideOSDControls();
        }
    }

    function isVideoOsdPageActive() {
        const videoOsdPage = document.getElementById('videoOsdPage');
        if (!videoOsdPage) return false;
        const hasVideoOsdType = videoOsdPage.getAttribute('data-type') === 'video-osd';
        const hasVideo = !!getVideo();
        return hasVideoOsdType && hasVideo;
    }

    function isOSDControlElement(target) {
        if (osdBottomElement && (osdBottomElement.contains(target) || target === osdBottomElement)) return true;
        if (headerElement && (headerElement.contains(target) || target === headerElement)) return true;
        // 选集插件兼容性支持
        let episodeSidebarElement = document.querySelector('.episodeSidebar');
        if (episodeSidebarElement && (episodeSidebarElement.contains(target) || target === episodeSidebarElement)) return true;
        // 弹幕插件兼容性支持
        let danmakuSidebarElement = document.querySelector('.danmakuSidebar');
        if (danmakuSidebarElement && (danmakuSidebarElement.contains(target) || target === danmakuSidebarElement)) return true;
        let danmakuSelectDialogElement = document.querySelector('.selectDialog');
        if (danmakuSelectDialogElement && (danmakuSelectDialogElement.contains(target) || target === danmakuSelectDialogElement)) return true;
        let danmakuInputDialogElement = document.querySelector('.inputDialog');
        if (danmakuInputDialogElement && (danmakuInputDialogElement.contains(target) || target === danmakuInputDialogElement)) return true;

        const controlSelectors = ['.btnPause', '.btnPlay', '.btnStop', '.btnNext', '.btnPrevious', '.osdPositionSlider', '.mdl-slider', '.volumeSlider', '.btnVolume', '.btnMute', '.btnSubtitles', '.btnAudio', '.btnFullscreen', '.btnExitFullscreen', '.btnSettings', '.osdPlayControlButtons', '.videoOsdBottom-maincontrols', '#debugInfo', '.debug-close-btn', 'button', 'input[type="range"]', '.slider', '[role="button"]'];
        for (const selector of controlSelectors) {
            if (target.closest(selector)) return true;
        }
        return false;
    }

    function updateCustomProgressBar(currentTime, duration) {
        const customProgressBar = document.getElementById('custom-progress-bar');
        if (customProgressBar && duration > 0) {
            const percentage = (currentTime / duration) * 100;
            customProgressBar.style.width = percentage + '%';
        }
    }

    function showCustomProgressBar() {
        const customProgressBar = document.getElementById('custom-progress-bar');
        if (customProgressBar) customProgressBar.style.display = 'block';
        findOSDElement();
        hideOSDControls();
    }

    function hideCustomProgressBar() {
        const customProgressBar = document.getElementById('custom-progress-bar');
        if (customProgressBar) customProgressBar.style.display = 'none';
    }

    function init() {
        console.log('[Inject] init handlers');
        const container = document.querySelector('#root') || document.body;
        injectStyles();
        window.overlay = createOverlay(container);
        findOSDElement();
        removePlayControlClasses();
        const observer = new MutationObserver(() => {
            removePlayControlClasses();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        let lastTapTime = 0;
        const doubleTapDelay = 500;
        let startX = 0, startY = 0, startVideoTime = 0, startTarget = null, isLongPressing = false, isSliding = false, slideThreshold = 20, slideTimer = null, previewTime = 0;
        let keyActive = false;
        container.addEventListener('keydown', e => {
            if (e.code === 'ArrowRight') {
                if (!keyActive) {
                    keyActive = true;
                    pressTimer = setTimeout(goFast, LONG_PRESS_MS);
                }
                e.preventDefault(); e.stopImmediatePropagation();
            }
        }, true);
        container.addEventListener('keyup', e => {
            if (e.code === 'ArrowRight') {
                clearTimeout(pressTimer);
                if (!isFast) seekShort(); else restore();
                keyActive = false;
                e.preventDefault(); e.stopImmediatePropagation();
            }
        }, true);
        container.addEventListener('touchstart', e => {
            if (!isVideoOsdPageActive()) return;

            const vid = getVideo();
            if (vid && vid.src && vid.src !== lastVideoSrc) {
                lastVideoSrc = vid.src;
                trickplayData = null;
                setTimeout(setupTrickplay, 500);
            }

            startTarget = e.target;
            if (isOSDControlElement(startTarget)) return;
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                startVideoTime = vid ? vid.currentTime : 0;
                isLongPressing = false;
                isSliding = false;
                pressTimer = setTimeout(() => {
                    findOSDElement();
                    goFast();
                    hideOSDControls();
                    isLongPressing = true;
                }, LONG_PRESS_MS);
            }
        });
        container.addEventListener('touchmove', e => {
            if (!isVideoOsdPageActive() || (startTarget && isOSDControlElement(startTarget))) return;
            if (e.touches.length === 1 && !isLongPressing) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = touch.clientY - startY;
                if (Math.abs(deltaX) > slideThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (!isSliding) {
                        clearTimeout(pressTimer);
                        isSliding = true;
                        showCustomProgressBar();
                    }
                    findOSDElement();
                    hideOSDControls();
                    const vid = getVideo();
                    if (vid && vid.duration) {
                        const timeChange = (deltaX / 100) * 10;
                        previewTime = Math.max(0, Math.min(vid.duration, startVideoTime + timeChange));
                        showTimeOverlay(previewTime, vid.duration);
                        updateCustomProgressBar(previewTime, vid.duration);
                        updateTrickplay(previewTime);
                        clearTimeout(slideTimer);
                    }
                    e.preventDefault();
                }
            }
        });
        container.addEventListener('touchend', (e) => {
            if (!isVideoOsdPageActive()) return;
            clearTimeout(pressTimer);
            if (isSliding) {
                hideTrickplay();
                const vid = getVideo();
                if (vid) vid.currentTime = previewTime;
                slideTimer = setTimeout(() => {
                    hideTimeOverlay();
                    hideCustomProgressBar();
                    findOSDElement();
                    hideOSDControls();
                }, 1000);
                isSliding = false;
                return;
            }
            if (isLongPressing) {
                restore();
                findOSDElement();
                hideOSDControls();
                isLongPressing = false;
                return;
            }
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;
            if (tapLength < doubleTapDelay && tapLength > 0) {
                if (!isOSDControlElement(startTarget)) togglePlay();
                e.preventDefault();
            } else {
                if (!isFast) {
                    if (!isOSDControlElement(startTarget)) toggleOSDVisibility();
                } else {
                    restore();
                    findOSDElement();
                    hideOSDControls();
                }
            }
            lastTapTime = currentTime;
        });
        container.addEventListener('touchcancel', () => {
            if (!isVideoOsdPageActive()) return;
            clearTimeout(pressTimer);
            clearTimeout(slideTimer);
            if (isLongPressing) {
                restore();
                isLongPressing = false;
            }
            if (isSliding) {
                hideTimeOverlay();
                hideCustomProgressBar();
                hideTrickplay();
                isSliding = false;
            }
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
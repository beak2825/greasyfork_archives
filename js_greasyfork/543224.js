// ==UserScript==
// @name         91porn视频免费看
// @namespace    91porn_vip_video_free_see_modern
// @version      1.0
// @description  91porn视频免费看 HD视频
// @author       xiaomengdemo
// @include      /^https://\w+.9p58b.com/.*?$/
// @match        https://w1226.9p58b.com/*
// @icon         https://w1226.9p58b.com/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543224/91porn%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543224/91porn%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeAds() {
        try {
            const adScripts = document.querySelectorAll('script[src*="jads.js"], script[src*="juicyads"]');
            adScripts.forEach(script => script.remove());

            const adIframes = document.querySelectorAll('iframe[src*="juicyads"], iframe[src*="adserver"]');
            adIframes.forEach(iframe => iframe.remove());

            const adContainers = document.querySelectorAll('.cont6, #cont3');
            adContainers.forEach(container => container.remove());

            const adLinks = document.querySelectorAll('a[href*="ligmd"], a[href*="pbuu.ltd"], a[href*="mcwy.pro"], a[href*="dongyudg.top"], a[href*="xmxjy.net"]');
            adLinks.forEach(link => link.remove());

            const adImages = document.querySelectorAll('img.ad_img, img[src*="fans.91selfie.com"]');
            adImages.forEach(img => {
                const parentLink = img.closest('a');
                if (parentLink) {
                    parentLink.remove();
                } else {
                    img.remove();
                }
            });

            try {
                const specificAd = document.getElementById('5nkq5n');
                if (specificAd) specificAd.remove();
            } catch (e) {}

            const allElements = document.querySelectorAll('*[id]');
            allElements.forEach(element => {
                if (element.id && element.id.includes('cont')) {
                    element.remove();
                }
            });

        } catch (err) {}
    }

    function startAdBlocker() {
        removeAds();
        const adBlockInterval = setInterval(() => removeAds(), 2000);

        const observer = new MutationObserver((mutations) => {
            let hasNewAds = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    for (const node of addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'SCRIPT' && (node.src?.includes('jads') || node.src?.includes('juicy')) ||
                                node.tagName === 'IFRAME' && (node.src?.includes('juicyads') || node.src?.includes('adserver')) ||
                                node.className?.includes('cont') ||
                                node.querySelector && (node.querySelector('img.ad_img') || node.querySelector('img[src*="fans.91selfie.com"]'))) {
                                hasNewAds = true;
                                break;
                            }
                        }
                    }
                }
                if (hasNewAds) break;
            }
            if (hasNewAds) setTimeout(removeAds, 100);
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            clearInterval(adBlockInterval);
            setInterval(removeAds, 10000);
        }, 20000);
    }

    function addModernStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .video-container {
                position: relative !important;
                width: 100% !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                border-radius: 20px !important;
                overflow: hidden !important;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1) !important;
                padding: 8px !important;
                margin: 20px 0 !important;
                backdrop-filter: blur(10px) !important;
            }
            #custom_player {
                width: 100% !important;
                height: auto !important;
                min-height: 400px !important;
                max-height: 600px !important;
                aspect-ratio: 16/9 !important;
                background: #000 !important;
                border-radius: 16px !important;
                border: none !important;
                outline: none !important;
                object-fit: contain !important;
            }
            #custom_player::-webkit-media-controls-panel {
                background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%) !important;
                border-radius: 0 0 16px 16px !important;
            }
            #custom_player::-webkit-media-controls-play-button,
            #custom_player::-webkit-media-controls-pause-button {
                background-color: transparent !important;
                opacity: 1 !important;
            }
            #custom_player::-webkit-media-controls-timeline {
                opacity: 1 !important;
            }
            #custom_player::-webkit-media-controls-current-time-display,
            #custom_player::-webkit-media-controls-time-remaining-display {
                color: #fff !important;
                font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif !important;
                font-weight: 500 !important;
                text-shadow: 0 1px 3px rgba(0,0,0,0.5) !important;
                font-size: 13px !important;
                opacity: 1 !important;
            }
            #custom_player::-webkit-media-controls-mute-button {
                background-color: transparent !important;
                opacity: 1 !important;
            }
            #custom_player::-webkit-media-controls-volume-slider {
                opacity: 1 !important;
            }
            #custom_player::-webkit-media-controls-fullscreen-button {
                background-color: transparent !important;
                opacity: 1 !important;
            }
            .loading-spinner {
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 60px !important;
                height: 60px !important;
                border: 4px solid rgba(255,255,255,0.2) !important;
                border-top: 4px solid #667eea !important;
                border-radius: 50% !important;
                animation: spin 1s linear infinite !important;
                z-index: 1000 !important;
            }
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            #my_add_dizhi {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
                border-radius: 16px !important;
                padding: 20px !important;
                margin: 20px 0 !important;
                box-shadow: 0 10px 30px rgba(240, 147, 251, 0.3) !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                backdrop-filter: blur(10px) !important;
            }
            #my_add_dizhi p {
                color: #fff !important;
                font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif !important;
                font-weight: 500 !important;
                text-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
                margin: 8px 0 !important;
                line-height: 1.6 !important;
            }
            #my_add_dizhi a {
                color: #fff !important;
                text-decoration: none !important;
                background: rgba(255,255,255,0.2) !important;
                padding: 6px 12px !important;
                border-radius: 20px !important;
                transition: all 0.3s ease !important;
                display: inline-block !important;
                margin: 0 4px !important;
            }
            #my_add_dizhi a:hover {
                background: rgba(255,255,255,0.3) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
            }
            div.col-xs-12.col-sm-4.col-md-3.col-lg-3 .well,
            div.well.well-sm.videos-text-align,
            .well.well-sm,
            .well {
                background-color: transparent !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                -webkit-box-shadow: none !important;
            }
            div.col-xs-12.col-sm-4.col-md-3.col-lg-3 .well.well-sm.videos-text-align {
                background-color: transparent !important;
                background: transparent !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-radius: 12px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                -webkit-box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    function createModernPlayer(videoUrl) {
        const videoElement = document.createElement('video');
        videoElement.id = 'custom_player';
        videoElement.controls = true;
        videoElement.preload = 'auto';
        videoElement.playsInline = true;
        videoElement.autoplay = false;
        videoElement.src = videoUrl;

        const source = document.createElement('source');
        source.src = videoUrl;
        source.type = 'video/mp4';
        videoElement.appendChild(source);

        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        loadingSpinner.id = 'loading-spinner';

        videoElement.addEventListener('loadstart', () => {
            const spinner = document.getElementById('loading-spinner');
            if (spinner) spinner.style.display = 'block';
        });

        videoElement.addEventListener('canplay', () => {
            const spinner = document.getElementById('loading-spinner');
            if (spinner) spinner.style.display = 'none';
        });

        videoElement.addEventListener('error', (e) => {
            const spinner = document.getElementById('loading-spinner');
            if (spinner) spinner.style.display = 'none';
        });

        return { videoElement, loadingSpinner };
    }

    // 替换播放器
    function replacePlayer(videoUrl) {
        try {
            addModernStyles();
            const container = document.querySelector('div.video-container');
            if (!container) return false;

            container.innerHTML = '';
            const { videoElement, loadingSpinner } = createModernPlayer(videoUrl);
            container.appendChild(loadingSpinner);
            container.appendChild(videoElement);

            if (!document.querySelector("#my_add_dizhi")) {
                const mydiv = document.createElement('div');
                mydiv.innerHTML = `<div id="my_add_dizhi">

                    <p>📱 <a href="${videoUrl}" target="_blank">点击下载视频</a> | 🔗 <a href="${videoUrl}" target="_blank">复制视频链接</a></p>
                    <p style="font-size:12px;opacity:0.8;">💡</p></div>`;
                container.after(mydiv);
            }
            return true;
        } catch (err) {
            return false;
        }
    }

    let capturedVideoUrl = null;

    function interceptDocumentWrite() {
        const originalWrite = document.write;
        document.write = function(content) {
            if (content.includes('source') && content.includes('mp4') && content.includes('src=')) {
                const srcMatch = content.match(/src='([^']+)'/);
                if (srcMatch) {
                    capturedVideoUrl = srcMatch[1];
                }
            }
            return originalWrite.call(this, content);
        };
    }

    function getVideoUrl() {
        if (capturedVideoUrl) return capturedVideoUrl;

        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const content = script.textContent || script.innerHTML;
            if (content.includes('strencode2') && content.includes('mp4')) {
                const match = content.match(/strencode2\("([^"]+)"\)/);
                if (match) {
                    try {
                        const decoded = decodeURIComponent(match[1]);
                        const srcMatch = decoded.match(/src='([^']+)'/);
                        if (srcMatch) return srcMatch[1];
                    } catch (e) {}
                }
            }
        }

        const video = document.querySelector('video');
        const source = document.querySelector('video source');

        if (source && source.src) return source.src;
        else if (video && video.src) return video.src;
        return null;
    }

    function processVideoPage() {
        let retryCount = 0;
        const maxRetries = 8;

        const checkAndReplace = () => {
            retryCount++;
            const videoUrl = getVideoUrl();

            if (videoUrl) {
                const container = document.querySelector('div.video-container');
                if (container) {
                    replacePlayer(videoUrl);
                    return;
                } else {
                    setTimeout(checkAndReplace, 500);
                    return;
                }
            } else {
                if (retryCount < maxRetries) {
                    const delay = retryCount <= 3 ? 1000 : 2000;
                    setTimeout(checkAndReplace, delay);
                }
            }
        };

        setTimeout(checkAndReplace, 1000);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    for (const node of addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'VIDEO' ||
                                node.tagName === 'SOURCE' ||
                                node.querySelector && (node.querySelector('video') || node.querySelector('source'))) {
                                setTimeout(checkAndReplace, 100);
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 10000);
    }

    function get_videourl() {
        try {
            if (location.href.match("https://.*?/index.php") != null || location.href.match("https://.*?/v.php") != null) {
                startAdBlocker();
                addModernStyles();
                var nodelist = document.querySelectorAll("div.videos-text-align");
                nodelist?.forEach((item, idx, arr) => {
                    var link = item.querySelector("a");
                    if (link) link.href = link.href.replace("view_video_hd", "view_video");
                });
                clearInterval(my_timer);
            }
            else if (location.href.match("view_video_hd.php") != null) {
                location.href = location.href.replace("view_video_hd", "view_video");
            }
            else if (location.href.match("view_video.php") != null) {
                startAdBlocker();
                processVideoPage();
                clearInterval(my_timer);
            }
        }
        catch (err) {}
    }

    interceptDocumentWrite();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            removeAds();
            addModernStyles();
        });
    } else {
        removeAds();
        addModernStyles();
    }

    let my_timer = setInterval(get_videourl, 2000);

    var oldhref = location.href;
    setInterval(function () {
        if (location.href != oldhref) {
            oldhref = location.href;
            capturedVideoUrl = null;
            my_timer = setInterval(get_videourl, 2000);
        }
    }, 1000);

})();

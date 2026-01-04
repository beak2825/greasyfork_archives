// ==UserScript==
// @name         AvBase Ultimate Enhancer
// @namespace    http://tampermonkey.net/
// @version      2.3.2
// @description  Enhances avbase.net with video previews, zoom sliders, Sukebei RSS results in a styled table, larger images, titles below images, original size image popups, and adds Jable, Missav, and videoId copy buttons with 404 transparency at the correct position.
// @match        https://www.avbase.net/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504327/AvBase%20Ultimate%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/504327/AvBase%20Ultimate%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 合併後的樣式
    GM_addStyle(`
        .adaptive-container {
            height: auto !important;
            min-height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            grid-column: 1 / -1;
            align-items: center;
            overflow: visible;
        }
        .vertical-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            overflow-x: auto;
            overflow-y: visible;
            height: auto;
        }
        .image-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 1px;
            height: auto;
        }
        .scene-container {
            width: 100%;
            max-width: 800px;
            height: auto;
            min-height: 450px;
        }
        .table-wrapper {
            width: 100%;
            padding: 10px;
            height: auto;
        }
        .toggle-button {
            padding: 5px 295px;
            background-color: #1e293b;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px 0;
        }
        .toggle-button img {
            width: 20px;
            height: 20px;
            filter: brightness(100%) invert(1);
            transition: transform 0.2s ease;
        }
        .toggle-button:active img {
            transform: scale(1.2);
        }
        .controls-bar {
            width: 100%;
            max-width: 800px;
            background-color: #000000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
            margin: 0;
            box-sizing: border-box;
        }
        .controls-bar button {
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
            margin-right: 8px;
        }
        .controls-bar button:last-child {
            margin-right: 0;
        }
        .controls-bar button img {
            width: 20px;
            height: 20px;
            filter: brightness(100%) invert(1);
        }
        .controls-bar button:active {
            transform: scale(1.2);
        }
        .zoom-slider-container {
            display: flex;
            align-items: center;
            position: relative;
            margin: 0;
        }
        .zoom-button {
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
        }
        .zoom-button img {
            width: 20px;
            height: 20px;
            filter: brightness(100%) invert(1);
        }
        .zoom-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 0;
            height: 6px;
            background: #1e293b;
            outline: none;
            opacity: 0;
            transition: opacity 0.3s ease, width 0.3s ease;
            border-radius: 4px;
            margin: 0 5px;
            vertical-align: middle;
        }
        .zoom-slider.show {
            opacity: 1;
            width: 70px;
        }
        .zoom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: #fff;
            cursor: pointer;
            border-radius: 50%;
        }
        .zoom-slider::-moz-range-thumb {
            width: 12px;
            height: 12px;
            background: #fff;
            cursor: pointer;
            border-radius: 50%;
        }
        .zoom-value {
            color: white;
            font-size: 12px;
            margin-right: 5px;
            width: 40px;
            text-align: right;
            opacity: 0;
            transition: opacity 0.3s ease;
            vertical-align: middle;
        }
        .zoom-value.show {
            opacity: 1;
        }
        .volume-slider-container {
            display: flex;
            align-items: center;
            position: relative;
        }
        .volume-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 0;
            height: 6px;
            background: #1e293b;
            outline: none;
            opacity: 0;
            transition: opacity 0.3s ease, width 0.3s ease;
            border-radius: 4px;
            margin: 0 5px;
        }
        .volume-slider.show {
            opacity: 1;
            width: 70px;
        }
        .volume-slider:hover {
            opacity: 1;
        }
        .volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            background: #fff;
            cursor: pointer;
            border-radius: 50%;
        }
        .volume-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #fff;
            cursor: pointer;
            border-radius: 50%;
        }
        .fullscreen-button {
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            padding: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .fullscreen-button img {
            width: 20px;
            height: 20px;
            filter: brightness(100%) invert(1);
        }
        .table-wrapper svg {
            fill: white;
            width: 20px;
            height: 20px;
        }
        @media (min-width: 1024px) {
            .cl-container {
                width: 100%;
            }
        }
        .sm\\:grid-cols-2 {
            grid-template-columns: repeat(6, minmax(0, 1fr));
        }
        .sm\\:grid-cols-3 {
            grid-template-columns: repeat(6, minmax(0, 1fr));
        }
        .large-image {
            width: 100%;
            max-width: 100%;
            height: auto;
            object-fit: contain;
            display: block;
            border-radius: 4px;
            cursor: zoom-in;
        }
        .title-below-image {
            font-size: 0.75rem;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 8px;
            text-align: center;
            color: #333;
            text-decoration: none;
            font-weight: bold;
            width: 100%;
            box-sizing: border-box;
        }
        .image-title-container {
            display: block;
            width: 100%;
            text-align: center;
        }
        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .overlay.show {
            opacity: 1;
        }
        .overlay-image {
            max-width: 90%;
            max-height: 90%;
            width: auto;
            height: auto;
            object-fit: contain;
            cursor: zoom-out;
            border-radius: 4px;
        }
        a-scene .a-canvas + div {
            display: none !important;
        }
        .jable-btn, .missav-btn, .copy-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 2rem;
            line-height: 2rem;
            text-align: center;
            background-color: #4b5563;
            color: white;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: normal;
            padding: 0 0.5rem;
            cursor: pointer;
        }
        .jable-btn, .missav-btn {
            width: 2rem;
        }
        .copy-btn {
            max-width: 10rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .transparent {
            background-color: transparent !important;
        }
        .jable-btn a, .missav-btn a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: inherit;
            text-decoration: none;
        }
    `);

    // 動態載入 A-Frame 庫
    function loadAFrame() {
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.7.0/aframe.min.js';
        document.head.appendChild(aframeScript);
    }

    // 處理 DMM 鏈接
    function processDmmLink(link) {
        try {
            if (link.includes('al.dmm.co.jp')) {
                const urlParams = new URLSearchParams(new URL(link).search);
                const acred = urlParams.get('acred');
                if (acred) return decodeURIComponent(acred);
                const lurl = urlParams.get('lurl');
                if (lurl) return decodeURIComponent(lurl);
            }
            return link;
        } catch (error) {
            console.error('處理 DMM 鏈接時出錯:', error);
            return link;
        }
    }

    // 檢查圖片是否存在
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
            setTimeout(() => resolve(false), 5000);
        });
    }

    // 檢查視頻可用性
    async function checkVideoAvailability(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            console.error(`檢查 ${url} 失敗:`, error);
            return false;
        }
    }

    // 從圖片 URL 提取影片 ID 並構造更大圖片 URL
    function getLargerImageUrl(smallImageUrl) {
        let match = smallImageUrl.match(/\/([^\/]+)(ps|jm)\.jpg$/i);
        if (!match) return null;
        let videoId = match[1];
        const suffix = match[2].toLowerCase();

        if (suffix === 'ps' && smallImageUrl.includes('awsimgsrc.dmm.co.jp')) {
            if (/^[a-zA-Z]+[0-9]{3}$/.test(videoId)) {
                videoId = videoId.replace(/([a-zA-Z]+)([0-9]{3})/, '$100$2');
            }
            return `https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/${videoId}/${videoId}pl.jpg`;
        }
        if (suffix === 'jm' && smallImageUrl.includes('pics.dmm.co.jp')) {
            return smallImageUrl.replace(/jm\.jpg$/i, 'jp.jpg');
        }
        return smallImageUrl.replace(/ps\.jpg$/i, 'pl.jpg');
    }

    // 獲取 Sukebei RSS 結果
    function fetchSukebeiResults(videoId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://sukebei.nyaa.si/?page=rss&q=${encodeURIComponent(videoId)}`,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                    "Referer": "https://sukebei.nyaa.si/"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        let parser = new DOMParser();
                        let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        let items = xmlDoc.getElementsByTagName("item");
                        let results = [];
                        for (let i = 0; i < items.length; i++) {
                            let item = items[i];
                            let title = item.getElementsByTagName("title")[0]?.textContent.trim() || "";
                            let link = item.getElementsByTagName("link")[0]?.textContent.trim() || "";
                            let size = item.getElementsByTagName("nyaa:size")[0]?.textContent.trim() || "";
                            let pubDate = item.getElementsByTagName("pubDate")[0]?.textContent.trim() || "";
                            let infoHash = item.getElementsByTagName("nyaa:infoHash")[0]?.textContent.trim() || "";
                            let magnet = infoHash ? "magnet:?xt=urn:btih:" + infoHash : "";
                            results.push({ name: title, link: link, size: size, date: pubDate, magnet: magnet });
                        }
                        resolve(results);
                    } else {
                        reject(`HTTP error: ${response.status}`);
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // 檢查 Jable 是否返回 404
    function checkJableAvailability(videoId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://jable.tv/videos/${encodeURIComponent(videoId)}/`,
                onload: response => {
                    const is404 = response.status === 404 ||
                                  response.responseText.includes('<title>404') ||
                                  response.responseText.includes('<h1>Not Found</h1>');
                    resolve(!is404);
                },
                onerror: () => resolve(false)
            });
        });
    }

    // 檢查 Missav 是否返回 404
    function checkMissavAvailability(videoId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://missav.ai/${encodeURIComponent(videoId)}`,
                onload: response => {
                    const is404 = response.responseText.includes('404') ||
                                  response.responseText.includes('找不到頁面');
                    resolve(!is404);
                },
                onerror: () => resolve(false)
            });
        });
    }

    // 圖片增強功能
    function enhanceImages() {
        const resultContainers = document.querySelectorAll('.bg-base.border.border-light.rounded-lg.overflow-hidden');
        if (!resultContainers.length) return;

        resultContainers.forEach((container) => {
            const imageLink = container.querySelector('div.flex.items-center.justify-center.bg-base2 a[rel="noopener noreferrer sponsored"] img');
            const titleLink = container.querySelector('a.text-md.font-bold.btn-ghost.rounded-lg.m-1[class*="line-clamp"]');

            if (imageLink && titleLink) {
                const smallImageUrl = imageLink.src;
                let largeImageUrl = smallImageUrl;

                if (smallImageUrl.match(/ps\.jpg$/i) && smallImageUrl.includes('awsimgsrc.dmm.co.jp')) {
                    let videoId = smallImageUrl.match(/\/([^\/]+)ps\.jpg$/i)[1];
                    if (/^[a-zA-Z]+[0-9]{3}$/.test(videoId)) {
                        videoId = videoId.replace(/([a-zA-Z]+)([0-9]{3})/, '$100$2');
                    }
                    largeImageUrl = `https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/${videoId}/${videoId}pl.jpg`;
                } else if (smallImageUrl.match(/jm\.jpg$/i) && smallImageUrl.includes('pics.dmm.co.jp')) {
                    largeImageUrl = smallImageUrl.replace(/jm\.jpg$/i, 'jp.jpg');
                } else if (smallImageUrl.match(/ps\.jpg$/i)) {
                    largeImageUrl = smallImageUrl.replace(/ps\.jpg$/i, 'pl.jpg');
                }

                imageLink.src = largeImageUrl;
                imageLink.classList.add('large-image');

                const imageAnchor = imageLink.parentElement;
                const imageContainerDiv = imageAnchor.closest('.flex.items-center.justify-center.bg-base2.grow-0.shrink-0.w-28.h-40.basis-28');
                if (imageContainerDiv) {
                    imageContainerDiv.innerHTML = '';
                    imageContainerDiv.appendChild(imageLink);
                    imageContainerDiv.style.width = '100%';
                    imageContainerDiv.style.height = 'auto';
                    imageContainerDiv.style.display = 'block';
                    imageContainerDiv.style.padding = '0';
                }

                imageLink.addEventListener('click', async () => {
                    const overlay = document.createElement('div');
                    overlay.className = 'overlay';
                    const overlayImage = document.createElement('img');
                    overlayImage.className = 'overlay-image';

                    let finalImageUrl = largeImageUrl;
                    const largerImageUrl = getLargerImageUrl(smallImageUrl);
                    if (largerImageUrl) {
                        const largerImageExists = await checkImageExists(largerImageUrl);
                        if (largerImageExists) finalImageUrl = largerImageUrl;
                    }

                    if (smallImageUrl.match(/ps\.jpg$/i)) {
                        let videoId = smallImageUrl.match(/\/([^\/]+)ps\.jpg$/i)[1];
                        if (/^[a-zA-Z]+[0-9]{3}$/.test(videoId)) {
                            videoId = videoId.replace(/([a-zA-Z]+)([0-9]{3})/, '$100$2');
                        }
                        const awsPlImageUrl = `https://awsimgsrc.dmm.co.jp/pics_dig/digital/video/${videoId}/${videoId}pl.jpg`;
                        const awsImageExists = await checkImageExists(awsPlImageUrl);
                        if (awsImageExists) finalImageUrl = awsPlImageUrl;
                    }

                    overlayImage.src = finalImageUrl;
                    overlay.appendChild(overlayImage);
                    document.body.appendChild(overlay);
                    setTimeout(() => overlay.classList.add('show'), 10);

                    overlay.addEventListener('click', () => {
                        overlay.classList.remove('show');
                        setTimeout(() => overlay.remove(), 300);
                    });
                });

                const imageTitleContainer = document.createElement('div');
                imageTitleContainer.className = 'image-title-container';
                imageTitleContainer.appendChild(imageContainerDiv);

                titleLink.classList.remove('text-md');
                titleLink.classList.add('title-below-image');
                const titleContainer = titleLink.parentElement;
                titleContainer.style.display = 'block';
                titleContainer.style.margin = '0';
                imageTitleContainer.appendChild(titleContainer);

                const flexContainer = container.querySelector('.flex.min-w-0.border-y.border-light');
                if (flexContainer) {
                    flexContainer.innerHTML = '';
                    flexContainer.appendChild(imageTitleContainer);
                    flexContainer.style.display = 'block';
                }

                container.style.display = 'block';
            }
        });
    }

    // 視頻和詳情頁增強功能
    async function enhanceDetails() {
        if (!window.location.href.startsWith('https://www.avbase.net/works/')) return;

        loadAFrame();

        const container = document.querySelector('.flex.overflow-x-auto.overflow-y-hidden');
        if (!container) return;

        const titleLink = document.querySelector('h1.text-lg')?.parentElement;
        if (titleLink && titleLink.href && titleLink.href.includes('al.dmm.co.jp')) {
            titleLink.href = processDmmLink(titleLink.href);
        }

        const verticalContainer = document.createElement('div');
        verticalContainer.className = 'vertical-container';
        container.parentNode.replaceChild(verticalContainer, container);

        const parentContainer = verticalContainer.closest('.h-44.w-full.flex');
        if (parentContainer) {
            parentContainer.className = 'adaptive-container bg-base-300';
        }

        const codeElement = document.querySelector('span[dir="rtl"].pl-1.whitespace-nowrap.overflow-hidden.text-ellipsis');
        const code = codeElement ? codeElement.textContent.trim() : null;
        if (!code) return;

        // 添加 Jable、Missav 和複製按鈕
        const buttonContainer = document.querySelector('div.flex.gap-2.items-center');
        if (buttonContainer) {
            const targetSpan = buttonContainer.querySelector('span.text-xs.flex');
            if (targetSpan) {
                const videoIdElement = document.querySelector('div.flex.gap-2.items-center span.text-xs div span:not(.text-gray-400)') ||
                                      document.querySelector('span[dir="rtl"].pl-1.whitespace-nowrap.overflow-hidden.text-ellipsis');
                const videoId = videoIdElement ? videoIdElement.textContent.trim() : null;

                if (videoId && !buttonContainer.querySelector('.jable-btn') && !buttonContainer.querySelector('.missav-btn') && !buttonContainer.querySelector('.copy-btn')) {
                    const encodedVideoId = encodeURIComponent(videoId);

                    // Jable 按鈕
                    const jableButton = document.createElement('div');
                    jableButton.className = 'jable-btn';
                    const jableLink = document.createElement('a');
                    jableLink.href = `https://jable.tv/videos/${encodedVideoId}/`;
                    jableLink.target = '_blank';
                    jableLink.rel = 'noopener noreferrer';
                    jableLink.textContent = 'J';
                    jableButton.appendChild(jableLink);

                    // Missav 按鈕
                    const missavButton = document.createElement('div');
                    missavButton.className = 'missav-btn';
                    const missavLink = document.createElement('a');
                    missavLink.href = `https://missav.ai/${encodedVideoId}`;
                    missavLink.target = '_blank';
                    missavLink.rel = 'noopener noreferrer';
                    missavLink.textContent = 'M';
                    missavButton.appendChild(missavLink);

                    // 複製按鈕
                    const copyButton = document.createElement('div');
                    copyButton.className = 'copy-btn';
                    copyButton.textContent = encodedVideoId;
                    copyButton.title = '點擊複製 videoId';

                    // 動態設置按鈕寬度
                    const charWidth = 0.5;
                    const padding = 1;
                    const textWidth = encodedVideoId.length * charWidth;
                    const copiedWidth = 3 * charWidth;
                    const buttonWidth = Math.max(textWidth, copiedWidth) + padding;
                    copyButton.style.width = `${buttonWidth}rem`;

                    copyButton.addEventListener('click', () => {
                        navigator.clipboard.writeText(encodedVideoId).then(() => {
                            copyButton.textContent = '已復製';
                            setTimeout(() => copyButton.textContent = encodedVideoId, 1500);
                        }).catch(err => console.error('複製失敗:', err));
                    });

                    // 插入按鈕
                    buttonContainer.insertBefore(copyButton, targetSpan);
                    buttonContainer.insertBefore(missavButton, copyButton);
                    buttonContainer.insertBefore(jableButton, missavButton);

                    // 檢查 404 並設置背景
                    Promise.all([checkJableAvailability(videoId), checkMissavAvailability(videoId)])
                        .then(([jableAvailable, missavAvailable]) => {
                            if (!jableAvailable) jableButton.classList.add('transparent');
                            if (!missavAvailable) missavButton.classList.add('transparent');
                        });
                }
            }
        }

        let videoUrls = [];
        const isVR = code.toLowerCase().includes('vr') || code.toLowerCase().includes('aqu') || code.toLowerCase().includes('exmo') || code.startsWith('1fsvss');
        const prefix = code.includes('_') ? 'h_1' : code.substr(0, 3);

        if ((code.startsWith('1f') && !code.startsWith('1fsvss')) || code.startsWith('1m')) {
            videoUrls.push(`https://videos.vpdmm.cc/litevideo/freepv/${code.charAt(0)}/${code.substr(0,3)}/${code.substr(0,6)}${code.substr(8,3)}/${code.substr(0,6)}${code.substr(8,3)}4k.mp4`);
        }
        if (isVR) {
            videoUrls.push(`https://cc3001.dmm.com/vrsample/${code.charAt(0)}/${prefix}/${code}/${code}vrlite.mp4`);
        } else {
            videoUrls.push(`https://cc3001.dmm.com/litevideo/freepv/${code.charAt(0)}/${prefix}/${code}/${code}hhb.mp4`);
        }
        videoUrls.push(`https://cc3001.dmm.com/litevideo/freepv/${code.charAt(0)}/${prefix}/${code}/${code}_dmb_w.mp4`);
        if (code.includes('_')) {
            videoUrls.push(`https://cc3001.dmm.com/vrsample/${code.charAt(0)}/${prefix}/${code}/${code}vrlite.mp4`);
        }

        const availabilityChecks = videoUrls.map(url => checkVideoAvailability(url));
        const results = await Promise.all(availabilityChecks);
        const availableVideoUrl = videoUrls[results.findIndex(result => result)];

        if (availableVideoUrl) {
            const sceneContainer = document.createElement('div');
            sceneContainer.className = 'scene-container';
            verticalContainer.appendChild(sceneContainer);

            let isVRMode = isVR;
            let cameraZoom = 160;
            let lastVolume = 1;

            function initializePlayer() {
                sceneContainer.innerHTML = '';
                if (isVRMode) {
                    const scene = document.createElement('a-scene');
                    scene.setAttribute('embedded', '');
                    scene.setAttribute('vr-mode-ui', 'enabled: false');
                    sceneContainer.appendChild(scene);

                    const videoSphere = document.createElement('a-videosphere');
                    videoSphere.setAttribute('src', availableVideoUrl);
                    videoSphere.setAttribute('rotation', '0 -180 0');
                    videoSphere.setAttribute('phi-start', '0');
                    videoSphere.setAttribute('phi-length', '180');
                    videoSphere.setAttribute('autoplay', '');
                    videoSphere.setAttribute('muted', '');
                    scene.appendChild(videoSphere);

                    const camera = document.createElement('a-camera');
                    camera.setAttribute('position', `0 0 ${cameraZoom}`);
                    camera.setAttribute('rotation', '0 90 0');
                    scene.appendChild(camera);
                } else {
                    const videoElement = document.createElement('video');
                    videoElement.src = availableVideoUrl;
                    videoElement.controls = true;
                    videoElement.style.width = '100%';
                    videoElement.style.maxWidth = '800px';
                    videoElement.style.height = 'auto';
                    videoElement.style.aspectRatio = '16/9';
                    sceneContainer.appendChild(videoElement);
                    videoElement.addEventListener('loadeddata', () => videoElement.play());
                }
            }
            initializePlayer();

            const controlsBar = document.createElement('div');
            controlsBar.className = 'controls-bar';
            verticalContainer.appendChild(controlsBar);

            const leftControls = document.createElement('div');
            leftControls.style.display = 'flex';
            leftControls.style.alignItems = 'center';
            controlsBar.appendChild(leftControls);

            const rightControls = document.createElement('div');
            rightControls.style.display = 'flex';
            rightControls.style.alignItems = 'center';
            controlsBar.appendChild(rightControls);

            function createButton(svgUrl, onClick, comment) {
                const button = document.createElement('button');
                const img = document.createElement('img');
                img.src = svgUrl;
                img.style.width = '20px';
                img.style.height = '20px';
                button.appendChild(img);
                button.addEventListener('click', onClick);
                return button;
            }

            const playPauseButton = createButton(
                'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/play.svg',
                () => {
                    const video = isVRMode ?
                        sceneContainer.querySelector('a-videosphere').components.material.material.map.image :
                        sceneContainer.querySelector('video');
                    if (video.paused) {
                        video.play();
                        playPauseButton.firstChild.src = 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/pause.svg';
                    } else {
                        video.pause();
                        playPauseButton.firstChild.src = 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/play.svg';
                    }
                },
                '播放/暫停按鈕'
            );
            leftControls.appendChild(playPauseButton);

            const rewindButton = createButton(
                'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/seek-backward-10.svg',
                () => {
                    const video = isVRMode ?
                        sceneContainer.querySelector('a-videosphere').components.material.material.map.image :
                        sceneContainer.querySelector('video');
                    video.currentTime = Math.max(0, video.currentTime - 5);
                },
                '倒退5秒按鈕'
            );
            leftControls.appendChild(rewindButton);

            const forwardButton = createButton(
                'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/seek-forward-10.svg',
                () => {
                    const video = isVRMode ?
                        sceneContainer.querySelector('a-videosphere').components.material.material.map.image :
                        sceneContainer.querySelector('video');
                    video.currentTime = Math.min(video.duration, video.currentTime + 5);
                },
                '快進5秒按鈕'
            );
            leftControls.appendChild(forwardButton);

            const volumeContainer = document.createElement('div');
            volumeContainer.className = 'volume-slider-container';
            const volumeButton = createButton(
                'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/volume-high.svg',
                () => {
                    const video = isVRMode ?
                        sceneContainer.querySelector('a-videosphere').components.material.material.map.image :
                        sceneContainer.querySelector('video');
                    if (video.muted) {
                        video.muted = false;
                        video.volume = lastVolume;
                        volumeButton.firstChild.src = 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/volume-high.svg';
                    } else {
                        lastVolume = video.volume;
                        video.muted = true;
                        volumeButton.firstChild.src = 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/mute.svg';
                    }
                },
                '音量開關按鈕'
            );
            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.className = 'volume-slider';
            volumeSlider.min = '0';
            volumeSlider.max = '1';
            volumeSlider.step = '0.01';
            volumeSlider.value = '1';
            volumeSlider.addEventListener('input', () => {
                const video = isVRMode ?
                    sceneContainer.querySelector('a-videosphere').components.material.material.map.image :
                    sceneContainer.querySelector('video');
                video.muted = false;
                video.volume = parseFloat(volumeSlider.value);
                lastVolume = video.volume;
                volumeButton.firstChild.src = video.volume === 0 ?
                    'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/mute.svg' :
                    'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/volume-high.svg';
            });
            volumeContainer.appendChild(volumeButton);
            volumeContainer.appendChild(volumeSlider);
            volumeContainer.addEventListener('mouseenter', () => {
                volumeSlider.classList.add('show');
            });
            volumeContainer.addEventListener('mouseleave', () => {
                volumeSlider.classList.remove('show');
            });
            leftControls.appendChild(volumeContainer);

            const zoomContainer = document.createElement('div');
            zoomContainer.className = 'zoom-slider-container';
            const zoomButton = document.createElement('button');
            zoomButton.className = 'zoom-button';
            const zoomImg = document.createElement('img');
            zoomImg.src = 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/search.svg';
            zoomImg.style.width = '20px';
            zoomImg.style.height = '20px';
            zoomButton.appendChild(zoomImg);
            const zoomSlider = document.createElement('input');
            zoomSlider.type = 'range';
            zoomSlider.className = 'zoom-slider';
            zoomSlider.min = '-480';
            zoomSlider.max = '480';
            zoomSlider.step = '10';
            zoomSlider.value = '160';
            const zoomValue = document.createElement('span');
            zoomValue.className = 'zoom-value';
            zoomValue.textContent = '160';
            zoomButton.addEventListener('click', () => {
                zoomSlider.classList.toggle('show');
                zoomValue.classList.toggle('show');
            });
            zoomSlider.addEventListener('input', () => {
                if (!isVRMode) return;
                const camera = sceneContainer.querySelector('a-camera');
                if (!camera) return;
                cameraZoom = parseFloat(zoomSlider.value);
                camera.setAttribute('position', `0 0 ${cameraZoom}`);
                zoomValue.textContent = cameraZoom;
            });
            zoomContainer.appendChild(zoomValue);
            zoomContainer.appendChild(zoomSlider);
            zoomContainer.appendChild(zoomButton);
            rightControls.appendChild(zoomContainer);

            const togglePlayerButton = createButton(
                isVRMode ? 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/2d-label-icon.svg' : 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/vr-label-icon.svg',
                () => {
                    const video = isVRMode ?
                        sceneContainer.querySelector('a-videosphere')?.components.material.material.map.image :
                        sceneContainer.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                    isVRMode = !isVRMode;
                    initializePlayer();
                    togglePlayerButton.firstChild.src = isVRMode ?
                        'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/2d-label-icon.svg' :
                        'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/vr-label-icon.svg';
                },
                '2D/VR切換按鈕'
            );
            rightControls.appendChild(togglePlayerButton);

            const fullscreenButton = createButton(
                'https://raw.githubusercontent.com/leogfa/svg/65fdb85e8047e4b5b6e221e5516962c534d8efb6/fullscreen.svg',
                () => {
                    if (!document.fullscreenElement) {
                        sceneContainer.requestFullscreen().catch(err => {
                            console.error('無法進入全螢幕:', err);
                        });
                    } else {
                        document.exitFullscreen();
                    }
                },
                '全螢幕切換按鈕'
            );
            fullscreenButton.className = 'fullscreen-button';
            rightControls.appendChild(fullscreenButton);
        }

        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        imageContainer.style.display = 'none';
        verticalContainer.appendChild(imageContainer);

        container.querySelectorAll('a').forEach(link => {
            let newSrc = link.href;
            if (newSrc.includes('al.dmm.co.jp')) {
                newSrc = processDmmLink(newSrc);
            }
            const img = link.querySelector('img');
            if (img) {
                img.src = newSrc;
                img.style.width = 'auto';
                img.style.height = 'auto';
                img.style.maxWidth = '100%';
                img.style.objectFit = 'contain';
            }
            link.href = newSrc;
            link.style.display = 'block';
            link.style.width = 'auto';
            link.style.height = 'auto';
            imageContainer.appendChild(link);
        });

        const toggleButton = document.createElement('button');
        const toggleImg = document.createElement('img');
        toggleImg.src = 'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/eye.svg';
        toggleImg.style.width = '20px';
        toggleImg.style.height = '20px';
        toggleButton.appendChild(toggleImg);
        toggleButton.className = 'toggle-button';
        toggleButton.addEventListener('click', () => {
            imageContainer.style.display = imageContainer.style.display === 'none' ? 'flex' : 'none';
            toggleImg.src = imageContainer.style.display === 'none' ?
                'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/eye.svg' :
                'https://raw.githubusercontent.com/leogfa/svg/b99823546f418d86bc5c3ecdd53b7c02e38cad9c/no-eye.svg';
            verticalContainer.style.height = 'auto';
            parentContainer.style.height = 'auto';
        });
        verticalContainer.insertBefore(toggleButton, imageContainer);

        const videoIdElement = document.querySelector('div.flex.gap-2.items-center span.text-xs div span:not(.text-gray-400)');
        const videoId = videoIdElement ? videoIdElement.textContent.trim() : null;
        if (videoId) {
            fetchSukebeiResults(videoId).then(results => {
                let tableWrapper = document.createElement('div');
                tableWrapper.className = 'table-wrapper';

                let table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.fontSize = '12px';
                table.style.margin = '0';

                if (results.length) {
                    results.forEach(result => {
                        let tr = document.createElement('tr');

                        let tdName = document.createElement('td');
                        tdName.style.padding = '8px';
                        tdName.style.border = '1px solid #ddd';
                        tdName.style.width = '60%';
                        tdName.textContent = result.name;
                        tr.appendChild(tdName);

                        let tdLink = document.createElement('td');
                        tdLink.style.padding = '8px';
                        tdLink.style.border = '1px solid #ddd';
                        tdLink.style.textAlign = 'center';
                        tdLink.style.width = '15%';
                        let iconWrapper = document.createElement('div');
                        iconWrapper.style.display = 'inline-flex';
                        iconWrapper.style.gap = '8px';
                        iconWrapper.style.alignItems = 'center';
                        let aTorrent = document.createElement('a');
                        aTorrent.href = result.link;
                        aTorrent.target = '_blank';
                        aTorrent.innerHTML = `<img src="https://raw.githubusercontent.com/leogfa/svg/fde17c8702542028c186c6fb170a8bc26a6c1be5/download.svg" style="width: 24px; height: 24px; filter: brightness(100%) invert(1);">`;
                        iconWrapper.appendChild(aTorrent);
                        let btnMagnet = document.createElement('button');
                        btnMagnet.style.background = 'none';
                        btnMagnet.style.border = 'none';
                        btnMagnet.style.cursor = 'pointer';
                        btnMagnet.innerHTML = `<img src="https://raw.githubusercontent.com/leogfa/svg/3edada4e4c0a5c1a83938a427459a488d22ec6a4/magnet.svg" style="width: 24px; height: 24px; filter: brightness(100%) invert(1);">`;
                        btnMagnet.addEventListener('click', () => {
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(result.magnet).then(() => {
                                    btnMagnet.textContent = '已複製';
                                    setTimeout(() => {
                                        btnMagnet.innerHTML = `<img src="https://raw.githubusercontent.com/leogfa/svg/3edada4e4c0a5c1a83938a427459a488d22ec6a4/magnet.svg" style="width: 24px; height: 24px; filter: brightness(100%) invert(1);">`;
                                    }, 1500);
                                });
                            }
                        });
                        iconWrapper.appendChild(btnMagnet);
                        tdLink.appendChild(iconWrapper);
                        tr.appendChild(tdLink);

                        let tdSize = document.createElement('td');
                        tdSize.style.padding = '8px';
                        tdSize.style.border = '1px solid #ddd';
                        tdSize.style.textAlign = 'center';
                        tdSize.style.width = '10%';
                        tdSize.textContent = result.size;
                        tr.appendChild(tdSize);

                        let tdDate = document.createElement('td');
                        tdDate.style.padding = '8px';
                        tdDate.style.border = '1px solid #ddd';
                        tdDate.style.textAlign = 'center';
                        tdDate.style.width = '15%';
                        let d = new Date(result.date);
                        function pad(n) { return n < 10 ? "0" + n : n; }
                        let formattedDate = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
                        tdDate.textContent = formattedDate;
                        tr.appendChild(tdDate);

                        table.appendChild(tr);
                    });
                } else {
                    let noResultRow = document.createElement('tr');
                    let noResultTd = document.createElement('td');
                    noResultTd.colSpan = "4";
                    noResultTd.style.padding = '8px';
                    noResultTd.style.textAlign = 'center';
                    noResultTd.textContent = '找不到Seed';
                    noResultRow.appendChild(noResultTd);
                    table.appendChild(noResultRow);
                }
                tableWrapper.appendChild(table);
                imageContainer.insertAdjacentElement('afterend', tableWrapper);
            }).catch(err => {
                console.error('Sukebei RSS 搜尋失敗: ', err);
            });
        }
    }

    // 主初始化函數
    function initialize() {
        if (!window.location.href.startsWith('https://www.avbase.net/works/')) {
            enhanceImages();
        }
        enhanceDetails();

        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                enhanceImages();
                enhanceDetails();
            }
        });
        urlObserver.observe(document, { subtree: true, childList: true });

        const contentObserver = new MutationObserver(() => {
            if (!window.location.href.startsWith('https://www.avbase.net/works/')) {
                enhanceImages();
            } else {
                enhanceDetails();
            }
        });
        contentObserver.observe(document.body, { childList: true, subtree: true });
    }

    initialize();
})();
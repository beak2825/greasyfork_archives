// ==UserScript==
// @name         视频外挂字幕加载器
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在视频控制条集成一个“字幕”按钮，用于加载本地或网络SRT字幕。字幕无背景，位置已优化，完美支持全屏，菜单位置安全。
// @author       xxjxt
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/538964/%E8%A7%86%E9%A2%91%E5%A4%96%E6%8C%82%E5%AD%97%E5%B9%95%E5%8A%A0%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538964/%E8%A7%86%E9%A2%91%E5%A4%96%E6%8C%82%E5%AD%97%E5%B9%95%E5%8A%A0%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let subtitles = [];
    let video = null;
    let subtitleDisplay = null;
    let videoContainer = null;

    function parseSRT(data) {
        const srtRegex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2}[,.]\d{3}) --> (\d{2}:\d{2}:\d{2}[,.]\d{3})\r?\n([\s\S]+?)(?=\r?\n\r?\n|$)/g;
        let match;
        const parsedSubtitles = [];
        function timeToSeconds(time) {
            time = time.replace(',', '.');
            const parts = time.split(':');
            const secondsAndMs = parts[2].split('.');
            return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(secondsAndMs[0], 10) + parseInt(secondsAndMs[1], 10) / 1000;
        }
        while ((match = srtRegex.exec(data)) !== null) {
            parsedSubtitles.push({
                start: timeToSeconds(match[2]),
                end: timeToSeconds(match[3]),
                text: match[4].trim().replace(/\r?\n/g, '<br>')
            });
        }
        return parsedSubtitles;
    }

    function displaySubtitles() {
        if (!video || !video.closest('body') || subtitles.length === 0) {
            return;
        }
        const currentTime = video.currentTime;
        const currentSub = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
        if (currentSub) {
            if (subtitleDisplay.innerHTML !== currentSub.text) {
                subtitleDisplay.innerHTML = currentSub.text;
                subtitleDisplay.style.visibility = 'visible';
            }
        } else {
            if (subtitleDisplay.innerHTML !== '') {
                subtitleDisplay.innerHTML = '';
                subtitleDisplay.style.visibility = 'hidden';
            }
        }
    }

    function setupSubtitleDisplay() {
        if (!video) return;
        videoContainer = video.parentElement;
        if (getComputedStyle(videoContainer).position === 'static') {
            videoContainer.style.position = 'relative';
        }
        const doc = video.ownerDocument;
        if (doc.getElementById('custom-subtitle-display')) {
            subtitleDisplay = doc.getElementById('custom-subtitle-display');
            return;
        }
        subtitleDisplay = doc.createElement('div');
        subtitleDisplay.id = 'custom-subtitle-display';
        videoContainer.appendChild(subtitleDisplay);
        GM_addStyle(`
            #custom-subtitle-display {
                position: absolute;
                bottom: 15%;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 900px;
                padding: 10px 20px;
                background-color: transparent;
                color: white;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
                border-radius: 8px;
                z-index: 2147483647;
                pointer-events: none;
                visibility: hidden;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), -2px -2px 4px rgba(0, 0, 0, 0.9);
                line-height: 1.5;
            }
        `);
    }

    function integrateControlButton() {
        const doc = video.ownerDocument;
        const controlBar = doc.querySelector('.jw-controlbar .jw-button-container, .vjs-control-bar, .dplayer-controller, [class*="control-bar"]');
        if (!controlBar || doc.getElementById('custom-subtitle-trigger')) {
            return;
        }

        const mainButton = doc.createElement('div');
        mainButton.id = 'custom-subtitle-trigger';
        mainButton.textContent = '字幕';

        const menu = doc.createElement('div');
        menu.id = 'custom-subtitle-menu';

        const localButton = doc.createElement('button');
        localButton.textContent = '加载本地字幕';
        localButton.className = 'custom-subtitle-menu-button';
        const fileInput = doc.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.srt';
        fileInput.style.display = 'none';
        localButton.onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                subtitles = parseSRT(event.target.result);
                menu.style.display = 'none';
            };
            reader.readAsText(file);
            e.target.value = '';
        };

        const urlButton = doc.createElement('button');
        urlButton.textContent = '加载网络字幕';
        urlButton.className = 'custom-subtitle-menu-button';
        urlButton.onclick = () => {
            const url = prompt('请输入SRT字幕文件URL地址:');
            if (url) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        subtitles = parseSRT(response.responseText);
                        menu.style.display = 'none';
                    },
                    onerror: function(response) {
                        alert('加载网络字幕失败');
                    }
                });
            }
        };

        menu.appendChild(localButton);
        menu.appendChild(urlButton);
        mainButton.appendChild(fileInput);
        mainButton.appendChild(menu);

        const rewindButton = controlBar.querySelector('[class*="rewind"]');
        if (rewindButton) {
            controlBar.insertBefore(mainButton, rewindButton);
        } else {
            controlBar.appendChild(mainButton);
        }

        mainButton.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });

        doc.addEventListener('click', () => {
             if (menu.style.display === 'block') {
                menu.style.display = 'none';
            }
        }, true);

        GM_addStyle(`
            #custom-subtitle-trigger {
                position: relative;
                color: white;
                font-size: 14px;
                padding: 0 10px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
            }
            #custom-subtitle-trigger:hover {
                opacity: 0.8;
            }
            #custom-subtitle-menu {
                display: none;
                position: absolute;
                bottom: 45px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #2b2b2b;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                padding: 5px;
                z-index: 2147483647;
                width: 120px;
            }
            .custom-subtitle-menu-button {
                display: block;
                width: 100%;
                background: none;
                border: none;
                color: white;
                text-align: left;
                padding: 8px 10px;
                cursor: pointer;
                font-size: 14px;
            }
            .custom-subtitle-menu-button:hover {
                background-color: #555;
            }
        `);
    }

    function init() {
        const potentialVideo = document.querySelector('video');
        if (!potentialVideo || potentialVideo.hasAttribute('data-subtitle-script-attached')) {
            return;
        }
        video = potentialVideo;
        video.setAttribute('data-subtitle-script-attached', 'true');
        setupSubtitleDisplay();
        integrateControlButton();
        video.removeEventListener('timeupdate', displaySubtitles);
        video.addEventListener('timeupdate', displaySubtitles);
    }

    const observer = new MutationObserver(() => {
        if (!document.querySelector('video[data-subtitle-script-attached]')) {
            init();
        } else {
            const doc = document.querySelector('video').ownerDocument;
            if (doc && !doc.getElementById('custom-subtitle-trigger')) {
                 integrateControlButton();
            }
        }
    });

    window.addEventListener('load', () => {
        setTimeout(init, 1000);
        observer.observe(document.body, { childList: true, subtree: true });
    }, false);

})();
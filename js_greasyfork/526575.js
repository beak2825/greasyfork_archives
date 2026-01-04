// ==UserScript==
// @name         Missav字幕加载
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  一键搜索字幕，加载本地字幕，快捷键操作加速
// @author       月月小射
// @match        *://missav.ws/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @connect      xunlei.com
// @connect      geilijiasu.com
// @connect      v.geilijiasu.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526575/Missav%E5%AD%97%E5%B9%95%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/526575/Missav%E5%AD%97%E5%B9%95%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        .custom-control-panel {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10px;
            z-index: 9999;
            border-radius: 5px;
            min-width: 300px;
        }
        .custom-control-panel label {
            margin-right: 5px;
        }
        .custom-control-panel input[type="number"] {
            width: 60px;
            margin-right: 5px;
            color: white;
            background: rgba(0, 0, 0, 0.3);
        }
        .custom-control-panel input[type="text"] {
            width: 60px;
            margin-right: 5px;
            color: white;
            background: rgba(0, 0, 0, 0.3);
        }
        .custom-control-panel button {
            background: #2196F3;
            border: none;
            color: white;
            padding: 5px 5px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
        }
        .custom-subtitle {
            position: absolute;
            bottom: 15%;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            background: rgba(0,0,0,0.0);
            padding: 4px 8px;
            border-radius: 4px;
            max-width: 80%;
            text-align: center;
            transition: opacity 0.3s;
            z-index: 10000;
        }
        .subtitle-list {
            position: fixed;
            bottom: 60px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            max-height: 300px;
            overflow-y: auto;
            padding: 10px;
            border-radius: 5px;
            z-index: 10001;
        }
        .subtitle-item {
            padding: 5px;
            cursor: pointer;
            border-bottom: 1px solid #444;
        }
        .subtitle-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    `);
    let accelerationRate = parseFloat(localStorage.getItem('missavAccelerationRate')) || 3;
    let skipTime = parseFloat(localStorage.getItem('missavSkipTime')) || 5;
    let subtitleOffset = 0;
    let isZKeyPressed = false;
    let plyrInstance = null;
    let subtitles = [];
    let currentSubtitle = null;
    let shortcutKeys = {
        accelerate: localStorage.getItem('missavAccelerateKey') || 'z',
        forward: localStorage.getItem('missavForwardKey') || 'x',
        backward: localStorage.getItem('missavBackwardKey') || 'c'
    };
    let controlPanel;
    let subtitleElement;
    let videoContainer;
    let subtitleList = null;
    let originalSubtitleText = '';

    function createControlPanel() {
        if (document.querySelector('.custom-control-panel')) return;
        controlPanel = document.createElement('div');
        controlPanel.className = 'custom-control-panel';
        const createInputGroup = (labelText, inputType, inputValue, onInputHandler) => {
            const group = document.createElement('div');
            const label = document.createElement('label');
            label.textContent = labelText;
            const input = document.createElement('input');
            input.type = inputType;
            input.value = inputValue;
            input.oninput = onInputHandler;
            group.append(label, input);
            return group;
        };
        controlPanel.append(
            createInputGroup('加速键:', 'text', shortcutKeys.accelerate, (e) => {
                shortcutKeys.accelerate = e.target.value.toLowerCase();
            }),
            createInputGroup('快进键:', 'text', shortcutKeys.forward, (e) => {
                shortcutKeys.forward = e.target.value.toLowerCase();
            }),
            createInputGroup('倒退键:', 'text', shortcutKeys.backward, (e) => {
                shortcutKeys.backward = e.target.value.toLowerCase();
            })
        );
        controlPanel.append(
            createInputGroup('加速倍率:', 'number', accelerationRate, (e) => {
                accelerationRate = parseFloat(e.target.value);
            }),
            createInputGroup('快进(秒):', 'number', skipTime, (e) => {
                skipTime = parseFloat(e.target.value);
            }),
            createInputGroup('字幕偏移:', 'number', subtitleOffset, async (e) => {
                subtitleOffset = parseFloat(e.target.value);
                if (originalSubtitleText) {
                    subtitles = await parseSRT(originalSubtitleText);
                }
            })
        );
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        const subtitleInput = document.createElement('input');
        subtitleInput.type = 'file';
        subtitleInput.accept = '.srt';
        subtitleInput.style.display = 'none';
        const subtitleButton = document.createElement('button');
        subtitleButton.textContent = '加载本地字幕';
        subtitleButton.onclick = () => subtitleInput.click();
        const searchSubtitleButton = document.createElement('button');
        searchSubtitleButton.textContent = '搜索字幕1';
        searchSubtitleButton.onclick = searchSubtitle;
        const searchSubtitle2Button = document.createElement('button');
        searchSubtitle2Button.textContent = '搜索字幕2';
        searchSubtitle2Button.onclick = searchSubtitle2;
        const clearSubtitleButton = document.createElement('button');
        clearSubtitleButton.textContent = '清除字幕';
        clearSubtitleButton.onclick = () => {
            subtitles = [];
            subtitleElement.textContent = '';
            originalSubtitleText = '';
        };
        const saveSettingsButton = document.createElement('button');
        saveSettingsButton.textContent = '保存设置';
        saveSettingsButton.onclick = saveSettings;
        buttonContainer.append(
            subtitleButton,
            searchSubtitleButton,
            searchSubtitle2Button,
            clearSubtitleButton,
            saveSettingsButton,
            subtitleInput
        );
        controlPanel.appendChild(buttonContainer);
        document.body.appendChild(controlPanel);
        setupSubtitleHandler(subtitleInput);
    }

    function setupSubtitleHandler(inputElement) {
        subtitleElement = document.createElement('div');
        subtitleElement.className = 'custom-subtitle';
        subtitleElement.style.display = 'none';
        if (videoContainer) {
            videoContainer.appendChild(subtitleElement);
        }
        inputElement.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const text = await file.text();
                originalSubtitleText = text;
                subtitles = await parseSRT(text);
                subtitleElement.style.display = 'block';
                showToast('本地字幕加载成功');
            } catch (error) {
                showToast(`读取失败: ${error.message}`);
            }
        });
    }

    async function parseSRT(text) {
        return text.replace(/\r/g, '').split(/\n\n+/).filter(Boolean).map(block => {
            const [id, time, ...textLines] = block.split('\n');
            const [start, end] = time.split(' --> ').map(parseTime);
            return {
                start: start + subtitleOffset,
                end: end + subtitleOffset,
                text: textLines.join('\n').trim()
            };
        });
    }

    function parseTime(timeStr) {
        const [hms, ms] = timeStr.split(/[,.]/);
        const [h, m, s] = hms.split(':');
        return (+h * 3600) + (+m * 60) + (+s) + (+ms / 1000);
    }

    function updateSubtitle() {
        if (!plyrInstance || !subtitles.length) return;
        const currentTime = unsafeWindow.player.currentTime;
        const sub = subtitles.find(s => currentTime >= s.start && currentTime <= s.end);
        subtitleElement.textContent = sub?.text || '';
        subtitleElement.style.display = sub ? 'block' : 'none';
    }

    function initPlayer() {
        const checkPlayer = setInterval(() => {
            const video = document.querySelector('video');
            if (video && unsafeWindow.player) {
                clearInterval(checkPlayer);
                plyrInstance = unsafeWindow.player;
                video.addEventListener('timeupdate', () => {
                    requestAnimationFrame(updateSubtitle);
                });
                setInterval(updateSubtitle, 250);
                showToast('播放器初始化完成');
            }
        }, 500);
    }

    function setupShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (!plyrInstance) return;
            const key = e.key.toLowerCase();
            if (key === shortcutKeys.accelerate) {
                plyrInstance.speed = accelerationRate;
                isZKeyPressed = true;
            } else if (key === shortcutKeys.forward) {
                plyrInstance.currentTime += skipTime;
            } else if (key === shortcutKeys.backward) {
                plyrInstance.currentTime -= skipTime;
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === shortcutKeys.accelerate && isZKeyPressed) {
                plyrInstance.speed = 1;
                isZKeyPressed = false;
            }
        });
    }

    function searchSubtitle() {
        const videoID = getCurrentVideoID();
        GM_openInTab(`https://subtitlecat.com/index.php?search=${encodeURIComponent(videoID)}`, { active: true });
    }

    function fetchSubtitleAPI(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "Cache-Control": "no-cache",
                    "Referer": location.href,
                    "Origin": location.origin,
                    "User-Agent": navigator.userAgent
                },
                timeout: 15000,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            resolve(JSON.parse(res.responseText));
                        } catch (e) {
                            reject(new Error('JSON解析失败'));
                        }
                    } else {
                        reject(new Error(`HTTP错误 ${res.status}`));
                    }
                },
                onerror: () => reject(new Error('网络错误')),
                ontimeout: () => reject(new Error('请求超时'))
            });
        });
    }

    async function searchSubtitle2() {
        try {
            const videoID = getCurrentVideoID();
            if (!videoID) return showToast('无法获取视频ID');
            showToast('正在搜索字幕...');
            const data = await fetchSubtitleAPI(`https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(videoID)}`);
            if (data.code === 0) {
                showSubtitleList(data.data.filter(item =>
                    item.url.includes('.srt') &&
                    item.name.toUpperCase().includes(videoID.toUpperCase())
                ));
            } else {
                showToast('未找到匹配字幕');
            }
        } catch (e) {
            showToast(`错误: ${e.message}`);
        }
    }

    function showSubtitleList(items) {
        if (subtitleList) subtitleList.remove();
        subtitleList = document.createElement('div');
        subtitleList.className = 'subtitle-list';
        subtitleList.innerHTML = '<div style="color:#ccc; margin-bottom:8px;">选择字幕：</div>';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'subtitle-item';
            div.textContent = `${item.name} (${item.extra_name})`;
            div.onclick = () => loadRemoteSubtitle(item.url);
            subtitleList.appendChild(div);
        });
        document.body.appendChild(subtitleList);
    }

    async function loadRemoteSubtitle(url) {
        showToast('正在加载字幕...');
        try {
            const content = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        "Referer": location.href,
                        "Origin": location.origin,
                        "User-Agent": navigator.userAgent
                    },
                    timeout: 15000,
                    onload: (res) => res.status === 200 ? resolve(res.responseText) : reject(),
                    onerror: reject,
                    ontimeout: () => reject(new Error('请求超时'))
                });
            });
            originalSubtitleText = content;
            subtitles = await parseSRT(content);
            subtitleElement.style.display = 'block';
            subtitleList.remove();
            showToast('在线字幕加载成功');
        } catch (e) {
            showToast(`字幕加载失败: ${e.message}`);
        }
    }

    function getCurrentVideoID() {
        const pathSegments = location.pathname.split('/').filter(segment => segment.length > 0);

        if (pathSegments.length === 0) {
            return '';
        }

        const lastSegment = pathSegments[pathSegments.length - 1];

        if (/^[a-zA-Z0-9]+-[a-zA-Z0-9]+$/.test(lastSegment)) {
            return lastSegment;
        }

        const idMatch = lastSegment.match(/([a-zA-Z]+-\d+|[a-zA-Z]+\d+-\d+|[a-zA-Z]+\d+[a-zA-Z]+-\d+)/i);
        if (idMatch && idMatch[1]) {
            return idMatch[1];
        }

        const looseMatch = lastSegment.match(/([a-zA-Z0-9]+-[a-zA-Z0-9]+)/);
        if (looseMatch && looseMatch[1]) {
            return looseMatch[1];
        }

        return lastSegment;
    }

    function saveSettings() {
        localStorage.setItem('missavAccelerationRate', accelerationRate);
        localStorage.setItem('missavSkipTime', skipTime);
        localStorage.setItem('missavAccelerateKey', shortcutKeys.accelerate);
        localStorage.setItem('missavForwardKey', shortcutKeys.forward);
        localStorage.setItem('missavBackwardKey', shortcutKeys.backward);
        showToast('设置已保存');
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 99999;
            animation: fadeIn 0.3s;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    (function init() {
        videoContainer = document.querySelector('.plyr__video-wrapper');
        if (!videoContainer) return setTimeout(init, 500);
        createControlPanel();
        setupShortcuts();
        initPlayer();
    })();
})();
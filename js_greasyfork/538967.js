// ==UserScript==
// @name         辅助
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全能视频工具：仅在识别到番号时激活所有功能。激活后：智能穿透iFrame，自动搜索字幕并加载；切换标签页时更换安全标题防社死；提供强大快捷键。
// @author       xxjxt
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        window.focus
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538967/%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/538967/%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let activeVideo = null;
    let subtitles = [];
    let subtitleDisplay = null;
    let isShortcutKeyPressed = { accelerate: false };

    const defaultSettings = {
        accelerationRate: 3,
        skipTime: 5,
        keys: { accelerate: 'z', forward: 'x', backward: 'c' }
    };

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

    function getSettings() {
        return {
            accelerationRate: parseFloat(GM_getValue('accelerationRate', defaultSettings.accelerationRate)),
            skipTime: parseFloat(GM_getValue('skipTime', defaultSettings.skipTime)),
            keys: {
                accelerate: GM_getValue('accelerateKey', defaultSettings.keys.accelerate),
                forward: GM_getValue('forwardKey', defaultSettings.keys.forward),
                backward: GM_getValue('backwardKey', defaultSettings.keys.backward)
            }
        };
    }

    if (window.self === window.top) {
        let storedOriginalTitle = document.title;
        const safeTitle = "SUP DO - 新的理想型社区";

        function handleVisibilityChange() {
            if (document.hidden) {
                storedOriginalTitle = document.title;
                document.title = safeTitle;
            } else {
                document.title = storedOriginalTitle;
            }
        }

        function initializeAntiSocialDeath() {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }

        function findAndStoreVideoId() {
            GM_setValue("currentVideoId", null);
            const titleElements = document.querySelectorAll('.film-info-title, .archive-title, h1, h2, h3, title');
            const REGEX = /[a-zA-Z]{2,5}-[0-9]{2,5}/g;
            for (const element of titleElements) {
                const text = element.innerText || element.textContent;
                const matches = text.match(REGEX);
                if (matches && matches.length > 0) {
                    const videoId = matches[0].toUpperCase();
                    GM_setValue("currentVideoId", videoId);
                    return videoId;
                }
            }
            return null;
        }

        function registerMenuCommands() {
             GM_registerMenuCommand("设置快捷键", () => {
                const settings = getSettings();
                const container = document.createElement('div');
                container.innerHTML = `
                <div id="enhancer-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2147483646;"></div>
                <div id="enhancer-dialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 2147483647; min-width: 300px; color: black; font-family: Arial, sans-serif;">
                    <h3 style="margin-top: 0;">视频快捷键设置</h3>
                    <div style="margin-bottom: 10px;"><label style="display: block; margin-bottom: 5px;">加速倍率 (默认: 3)</label><input type="number" id="accelerationRate" value="${settings.accelerationRate}" min="1" max="16" step="0.1" style="width: 100%; padding: 5px; box-sizing: border-box;"></div>
                    <div style="margin-bottom: 10px;"><label style="display: block; margin-bottom: 5px;">快进/快退时间 (秒) (默认: 5)</label><input type="number" id="skipTime" value="${settings.skipTime}" min="1" max="60" step="1" style="width: 100%; padding: 5px; box-sizing: border-box;"></div>
                    <div style="margin-bottom: 10px;"><label style="display: block; margin-bottom: 5px;">加速快捷键 (默认: z)</label><input type="text" id="accelerateKey" value="${settings.keys.accelerate}" maxlength="1" style="width: 100%; padding: 5px; box-sizing: border-box;"></div>
                    <div style="margin-bottom: 10px;"><label style="display: block; margin-bottom: 5px;">快进快捷键 (默认: x)</label><input type="text" id="forwardKey" value="${settings.keys.forward}" maxlength="1" style="width: 100%; padding: 5px; box-sizing: border-box;"></div>
                    <div style="margin-bottom: 15px;"><label style="display: block; margin-bottom: 5px;">快退快捷键 (默认: c)</label><input type="text" id="backwardKey" value="${settings.keys.backward}" maxlength="1" style="width: 100%; padding: 5px; box-sizing: border-box;"></div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px;">
                        <button id="enhancer-cancel" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                        <button id="enhancer-save" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
                    </div>
                </div>`;
                document.body.appendChild(container);
                const closeDialog = () => document.body.removeChild(container);
                document.getElementById('enhancer-cancel').onclick = closeDialog;
                document.getElementById('enhancer-overlay').onclick = closeDialog;
                document.getElementById('enhancer-save').onclick = () => {
                    const newSettings = {
                        accelerationRate: parseFloat(document.getElementById('accelerationRate').value),
                        skipTime: parseFloat(document.getElementById('skipTime').value),
                        keys: { accelerate: document.getElementById('accelerateKey').value.toLowerCase(), forward: document.getElementById('forwardKey').value.toLowerCase(), backward: document.getElementById('backwardKey').value.toLowerCase() }
                    };
                    if (isNaN(newSettings.accelerationRate) || newSettings.accelerationRate < 1 || newSettings.accelerationRate > 16) { alert('加速倍率必须在1-16之间'); return; }
                    if (isNaN(newSettings.skipTime) || newSettings.skipTime < 1 || newSettings.skipTime > 60) { alert('快进/快退时间必须在1-60秒之间'); return; }
                    if (!newSettings.keys.accelerate || !newSettings.keys.forward || !newSettings.keys.backward) { alert('快捷键不能为空'); return; }
                    GM_setValue('accelerationRate', newSettings.accelerationRate); GM_setValue('skipTime', newSettings.skipTime); GM_setValue('accelerateKey', newSettings.keys.accelerate); GM_setValue('forwardKey', newSettings.keys.forward); GM_setValue('backwardKey', newSettings.keys.backward);
                    alert('设置已保存！');
                    closeDialog();
                };
            });
        }

        if (findAndStoreVideoId()) {
            registerMenuCommands();
            initializeAntiSocialDeath();
        }

    } else {
        let foundSubtitleList = [];
        let shortcutListenersAttached = false;

        function displaySubtitles() {
             if (!activeVideo || !activeVideo.closest('body') || !subtitleDisplay) return;
            const currentTime = activeVideo.currentTime;
            const currentSub = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
            if (currentSub) { if (subtitleDisplay.innerHTML !== currentSub.text) { subtitleDisplay.innerHTML = currentSub.text; subtitleDisplay.style.visibility = 'visible'; }
            } else { if (subtitleDisplay.innerHTML !== '') { subtitleDisplay.innerHTML = ''; subtitleDisplay.style.visibility = 'hidden'; } }
        }

        function setupSubtitleDisplay() {
            if (!activeVideo) return;
            let videoContainer = activeVideo.parentElement;
            if (getComputedStyle(videoContainer).position === 'static') videoContainer.style.position = 'relative';
            if (document.getElementById('custom-subtitle-display')) { subtitleDisplay = document.getElementById('custom-subtitle-display'); videoContainer.appendChild(subtitleDisplay); return; }
            subtitleDisplay = document.createElement('div'); subtitleDisplay.id = 'custom-subtitle-display';
            videoContainer.appendChild(subtitleDisplay);
            GM_addStyle(`#custom-subtitle-display { position: absolute; bottom: 15%; left: 50%; transform: translateX(-50%); width: 90%; max-width: 900px; padding: 10px 20px; background-color: transparent; color: white; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; z-index: 2147483647; pointer-events: none; visibility: hidden; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), -2px -2px 4px rgba(0, 0, 0, 0.9); line-height: 1.5; }`);
        }

        function loadSubtitleFromUrl(url, menu) {
            GM_xmlhttpRequest({
                method: 'GET', url: url,
                onload: (response) => { subtitles = parseSRT(response.responseText); if (menu) menu.style.display = 'none'; },
                onerror: () => alert('加载网络字幕失败')
            });
        }

        function searchSubtitles(videoId) {
            GM_xmlhttpRequest({
                method: 'GET', url: `https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${videoId}`,
                onload: function(response) {
                    if (response.status === 200) { try { const d = JSON.parse(response.responseText); if (d.code === 0 && d.data && d.data.length > 0) { foundSubtitleList = d.data; } } catch (e) {} }
                    updateSubtitleMenu(videoId);
                },
                onerror: () => updateSubtitleMenu(videoId)
            });
        }

        function updateSubtitleMenu(videoId) {
            const menu = document.getElementById('custom-subtitle-menu');
            if (!menu) return;
            menu.innerHTML = '';
            if (foundSubtitleList.length > 0) {
                foundSubtitleList.forEach(sub => {
                    if (sub.name && sub.url) {
                        const subButton = document.createElement('button');
                        subButton.textContent = `[${sub.ext}] ${sub.name}`; subButton.className = 'custom-subtitle-menu-button';
                        subButton.onclick = (e) => { e.stopPropagation(); loadSubtitleFromUrl(sub.url, menu); };
                        menu.appendChild(subButton);
                    }
                });
                menu.appendChild(document.createElement('div')).className = 'custom-subtitle-menu-separator';
            }
            if (videoId) {
                const catButton = document.createElement('button');
                catButton.textContent = `在 Subtitlecat 搜索: ${videoId}`; catButton.className = 'custom-subtitle-menu-button';
                catButton.onclick = (e) => { e.stopPropagation(); GM_openInTab(`https://subtitlecat.com/index.php?search=${videoId}`, { active: true }); menu.style.display = 'none'; };
                menu.appendChild(catButton);
            }
            const localButton = document.createElement('button');
            localButton.textContent = '加载本地字幕'; localButton.className = 'custom-subtitle-menu-button';
            const fileInput = document.createElement('input');
            fileInput.type = 'file'; fileInput.accept = '.srt'; fileInput.style.display = 'none';
            localButton.onclick = () => fileInput.click();
            fileInput.onchange = (e) => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => { subtitles = parseSRT(event.target.result); menu.style.display = 'none'; };
                reader.readAsText(file); e.target.value = '';
            };
            localButton.appendChild(fileInput);
            menu.appendChild(localButton);
        }

        function integrateControlButton() {
            if (!activeVideo || document.getElementById('custom-subtitle-trigger')) return;
            const playerRoot = activeVideo.closest('.jwplayer, .video-js, .dplayer, [class*="player-container"], .plyr');
            const searchContext = playerRoot || document;
            const controlBar = searchContext.querySelector('.jw-controlbar .jw-button-container, .vjs-control-bar, .dplayer-controller, .plyr__controls, [class*="control-bar"], [class*="bottom-bar"]');
            if (!controlBar) { setTimeout(integrateControlButton, 500); return; }
            const mainButton = document.createElement('div');
            mainButton.id = 'custom-subtitle-trigger'; mainButton.textContent = '字幕';
            const menu = document.createElement('div');
            menu.id = 'custom-subtitle-menu'; mainButton.appendChild(menu);

            const pipButton = controlBar.querySelector(`
                .jw-icon-pip, .vjs-picture-in-picture-control, .dplayer-pip-wrap,
                [class*="pip"], [class*="picture-in-picture"], [data-plyr="pip"],
                [title*="画中画"], [title*="picture-in-picture" i], [title*="pip" i],
                [aria-label*="画中画"], [aria-label*="picture-in-picture" i], [aria-label*="pip" i]
            `);
            const fullscreenButton = controlBar.querySelector(`
                .jw-icon-fullscreen, .vjs-fullscreen-control, .dplayer-fullscreen-wrap,
                [class*="fullscreen"], [class*="full-screen"], [data-plyr="fullscreen"],
                [title*="全屏"], [title*="fullscreen" i], [aria-label*="全屏"], [aria-label*="fullscreen" i]
            `);

            if (pipButton) { controlBar.insertBefore(mainButton, pipButton); }
            else if (fullscreenButton) { controlBar.insertBefore(mainButton, fullscreenButton); }
            else { controlBar.appendChild(mainButton); }

            mainButton.addEventListener('click', (e) => { e.stopPropagation(); menu.style.display = menu.style.display === 'block' ? 'none' : 'block'; });
            document.addEventListener('click', () => { if (menu.style.display === 'block') { menu.style.display = 'none'; } });

            GM_addStyle(`
                #custom-subtitle-trigger { position: relative; color: white; font-size: 14px; padding: 0 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; height: 100%; }
                #custom-subtitle-trigger:hover { opacity: 0.8; }
                #custom-subtitle-menu { display: none; position: absolute; bottom: 100%; right: 0; background-color: #2b2b2b; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.5); padding: 5px; margin-bottom: 30px; z-index: 2147483647; width: 250px; max-height: 50vh; overflow-y: auto; }
                .custom-subtitle-menu-button { display: block; width: 100%; box-sizing: border-box; background: none; border: none; color: white; text-align: left; padding: 8px 12px; cursor: pointer; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .custom-subtitle-menu-button:hover { background-color: #555; }
                .custom-subtitle-menu-separator { height: 1px; background-color: #555; margin: 5px 0; }
            `);
        }

        function setupShortcuts() {
            if (shortcutListenersAttached) return;
            try { window.focus(); } catch (e) {}
            document.addEventListener('keydown', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
                if (!activeVideo || !document.body.contains(activeVideo)) return;
                const key = e.key.toLowerCase(); const settings = getSettings(); let preventDefault = false;
                if (key === settings.keys.accelerate) { if (!isShortcutKeyPressed.accelerate) { if (activeVideo.playbackRate !== settings.accelerationRate) activeVideo.playbackRate = settings.accelerationRate; isShortcutKeyPressed.accelerate = true; } preventDefault = true; }
                else if (key === settings.keys.forward) { activeVideo.currentTime += settings.skipTime; preventDefault = true; }
                else if (key === settings.keys.backward) { activeVideo.currentTime -= settings.skipTime; preventDefault = true; }
                if (preventDefault) { e.preventDefault(); e.stopPropagation(); }
            }, true);
            document.addEventListener('keyup', (e) => {
                if (!activeVideo || !document.body.contains(activeVideo)) return;
                const key = e.key.toLowerCase(); const settings = getSettings();
                if (key === settings.keys.accelerate && isShortcutKeyPressed.accelerate) { if (activeVideo.playbackRate === settings.accelerationRate) activeVideo.playbackRate = 1.0; isShortcutKeyPressed.accelerate = false; e.preventDefault(); e.stopPropagation(); }
            }, true);
            shortcutListenersAttached = true;
        }

        function findVideoElement() {
            const videos = Array.from(document.querySelectorAll('video')).filter(v => v.offsetParent !== null && v.readyState > 0 && v.clientHeight > 50 && v.clientWidth > 50);
            if (videos.length === 0) return document.querySelector('video');
            videos.sort((a, b) => (b.clientWidth * b.clientHeight) - (a.clientWidth * a.clientHeight));
            return videos[0];
        }

        function pollAndInitialize() {
            let attempts = 0;
            const maxAttempts = 20;
            const interval = setInterval(async () => {
                const videoId = await GM_getValue("currentVideoId", null);
                attempts++;
                if (videoId || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (videoId) {
                        setupShortcuts();
                        setupSubtitleDisplay();
                        integrateControlButton();
                        searchSubtitles(videoId);
                        activeVideo.addEventListener('timeupdate', displaySubtitles);
                    }
                }
            }, 500);
        }

        function attachToVideo(videoElement) {
            if (!videoElement || videoElement.hasAttribute('data-enhancer-attached')) return;
            activeVideo = videoElement;
            activeVideo.setAttribute('data-enhancer-attached', 'true');
            pollAndInitialize();
        }

        function mainLoop() {
            const bestVideo = findVideoElement();
            if (bestVideo && (!activeVideo || !document.body.contains(activeVideo))) {
                attachToVideo(bestVideo);
            } else if (activeVideo && !document.body.contains(activeVideo)) {
                activeVideo = null;
            }
        }

        const observer = new MutationObserver(mainLoop);
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(mainLoop, 500);
    }
})();
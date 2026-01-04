// ==UserScript==
// @name         Subtitle Uploader
// @namespace    http://tampermonkey.net/
// @version      4.5
// @author       md-dahshan
// @license      MIT
// @description  Upload subtitles to any video on any website + settings panel (Fixed Fullscreen)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542345/Subtitle%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/542345/Subtitle%20Uploader.meta.js
// ==/UserScript==

    (function () {
        'use strict';

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        function init() {
            const defaultSettings = {
                fontSize: 17,
                fontColor: '#ffffff',
                bgColor: '#000000',
                bgToggle: true,
                offsetY: 19,
                delay: 0,
                bgOpacity: 0.7,
                fontFamily: 'System Default',
                karaokeMode: false,
                karaokeEffect: 'spotlight',
                karaokeSpeed: 1,
                shortcuts: {
                    settings: 'Alt+Q',
                    upload: 'Alt+W',
                    clear: 'Alt+X',
                    toggleButtons: 'Alt+Z',
                    support: 'Alt+A',
                    karaoke: 'Alt+K'
                },
                // إضافة: مكان حفظ الإعدادات المتعددة
                profiles: {
                    'Default': null // سيتم ملؤه بالإعدادات الافتراضية
                },
                currentProfile: 'Default'
            };

        const cryptoAddresses = {
            Bitcoin_BTC: '1Hi4HnetFFnM2B2GzEvJDgU48yF2mSnWh8',
            BNB_BEP20: '0x1452c2ae22683dbf6133684501044d3c44f476d3',
            USDT_TRC20: 'TEjLXNrydPDRdE2n3Wmjr3TyvSuDFm8JVg',
            PAYPAL: 'paypal.me/MDDASH',
            Binance_ID: '859818212'
        };

        const settings = loadSettings();
        const topDoc = getTopDocument();
        const style = topDoc.createElement('style');
        topDoc.head.appendChild(style);

        // *** إضافة: History System ***
        let settingsHistory = [];
        let historyIndex = -1;
        const MAX_HISTORY = 20;

        function addToHistory(newSettings) {
            // إزالة أي تاريخ بعد الموقع الحالي (عند عمل تعديل جديد)
            settingsHistory = settingsHistory.slice(0, historyIndex + 1);

            // إضافة الإعدادات الجديدة
            settingsHistory.push(JSON.parse(JSON.stringify(newSettings)));

            // الحفاظ على حد أقصى للتاريخ
            if (settingsHistory.length > MAX_HISTORY) {
                settingsHistory.shift();
            } else {
                historyIndex++;
            }
        }

        function undoSettings() {
            if (historyIndex > 0) {
                historyIndex--;
                const previousSettings = settingsHistory[historyIndex];
                applyHistorySettings(previousSettings);
                return true;
            }
            return false;
        }

        function redoSettings() {
            if (historyIndex < settingsHistory.length - 1) {
                historyIndex++;
                const nextSettings = settingsHistory[historyIndex];
                applyHistorySettings(nextSettings);
                return true;
            }
            return false;
        }

        function applyHistorySettings(histSettings) {
            const panel = settingsPanel;
            panel.querySelector('#sub-font-size').value = histSettings.fontSize;
            panel.querySelector('#sub-font-color').value = histSettings.fontColor;
            panel.querySelector('#sub-bg-color').value = histSettings.bgColor;
            panel.querySelector('#sub-bg-toggle').checked = histSettings.bgToggle;
            panel.querySelector('#sub-offsetY').value = histSettings.offsetY;
            panel.querySelector('#sub-delay').value = histSettings.delay;
            panel.querySelector('#sub-bg-opacity').value = histSettings.bgOpacity;

            panel.querySelector('#sub-offsetY-value').textContent = histSettings.offsetY + 'px';
            panel.querySelector('#bg-opacity-value').textContent = Math.round(histSettings.bgOpacity * 100) + '%';

            applySettings();
        }

        // حفظ الإعدادات الأولية في التاريخ
        addToHistory(settings);

        const settingsPanel = createSettingsPanel();
        const uploadModal = createUploadModal();
        const supportModal = createSupportModal();
        const karaokeModal = createKaraokeModal();
        const profilesModal = createProfilesModal();
        const helpModal = createHelpModal();
        let __currentTargetVideo = null;

        // Settings panel starts hidden, only shows when settings button is clicked
        settingsPanel.style.display = 'none';

        applySettings();

        // Call positionButtons with multiple delays to ensure videos are loaded
        setTimeout(positionButtons, 100);
        setTimeout(positionButtons, 500);
        setTimeout(positionButtons, 1500);
        setTimeout(positionButtons, 3000);
        setTimeout(positionButtons, 5000);

        // Special handling for YouTube and dynamic sites
        if (window.location.hostname.includes('youtube.com')) {
            // YouTube loads videos dynamically, so we need to watch for URL changes
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    // Wait a bit for YouTube to load the new video
                    setTimeout(positionButtons, 1000);
                    setTimeout(positionButtons, 2000);
                    setTimeout(positionButtons, 3000);
                    setTimeout(positionButtons, 5000);
                    setTimeout(positionButtons, 7000);
                    setTimeout(positionButtons, 15000);
                    setTimeout(positionButtons, 25000);
                }
            }).observe(document.body, { subtree: true, childList: true });

            // Also watch for the video player specifically
            const checkYouTubeVideo = setInterval(() => {
                const ytPlayer = document.querySelector('.html5-video-player video');
                if (ytPlayer && !ytPlayer.__subtitleButtonsAdded) {
                    ytPlayer.__subtitleButtonsAdded = true;
                    positionButtons();
                }
            }, 1000);
        }
        setTimeout(positionButtons, 7000);
        setTimeout(positionButtons, 15000);
        setTimeout(positionButtons, 25000);
        // Use MutationObserver to detect new videos efficiently
        const videoObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && (node.tagName === 'VIDEO' || node.querySelector('video'))) {
                            // Video added, reposition buttons after a short delay
                            setTimeout(positionButtons, 500);
                            return; // No need to check other mutations
                        }
                    }
                }
            }
        });

        videoObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('resize', positionButtons);
        document.addEventListener('fullscreenchange', positionButtons);

        // Keyboard shortcuts - استخدام Alt بدلاً من Ctrl+Shift لتجنب التعارض
        document.addEventListener('keydown', (e) => {
            const shortcuts = settings.shortcuts || defaultSettings.shortcuts;

            // Helper function to check if shortcut matches
            const matchesShortcut = (shortcutStr) => {
                const parts = shortcutStr.split('+').map(p => p.trim().toLowerCase());
                const hasAlt = parts.includes('alt');
                const hasCtrl = parts.includes('ctrl') || parts.includes('control');
                const hasShift = parts.includes('shift');
                const key = parts.find(p => !['alt', 'ctrl', 'control', 'shift'].includes(p));

                if (!key) return false; // No key found, invalid shortcut

                return (
                    e.altKey === hasAlt &&
                    e.ctrlKey === hasCtrl &&
                    e.shiftKey === hasShift &&
                    e.key.toLowerCase() === key
                );
            };

            // Settings Panel
            if (matchesShortcut(shortcuts.settings)) {
                e.preventDefault();
                settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
            }

            // Upload Subtitle
            if (matchesShortcut(shortcuts.upload)) {
                e.preventDefault();
                const video = document.querySelector('video');
                if (video) {
                    __currentTargetVideo = video;
                    uploadModal.style.display = 'flex';
                    // Load last used subtitle when modal opens
                    if (typeof window.__loadLastUsedSubtitle === 'function') {
                        window.__loadLastUsedSubtitle();
                    }
                }
            }

            // Clear Subtitle
            if (matchesShortcut(shortcuts.clear)) {
                e.preventDefault();
                if (confirm('⚠️ Are you sure you want to clear the subtitle?')) {
                    document.querySelectorAll('video').forEach(video => {
                        video.querySelectorAll('track').forEach(t => t.remove());
                        video.closest('body')?.querySelector('.manual-subtitle')?.remove();
                        Array.from(video.textTracks).forEach(track => {
                            track.mode = 'disabled';
                        });
                    });
                    if (style && style.parentNode) {
                        style.remove();
                    }
                    alert('✅ Subtitle cleared!');
                    setTimeout(() => location.reload(), 600);
                }
            }

            // Toggle Buttons
            if (matchesShortcut(shortcuts.toggleButtons)) {
                e.preventDefault();
                const controls = document.querySelectorAll('.subtitle-controls');
                if (controls.length > 0) {
                    const isHidden = controls[0].style.display === 'none';
                    controls.forEach(ctrl => {
                        ctrl.style.display = isHidden ? 'flex' : 'none';
                    });
                }
            }

            // Support Window
            if (matchesShortcut(shortcuts.support)) {
                e.preventDefault();
                supportModal.style.display = 'flex';
                const supSel = supportModal.querySelector('#support-crypto-select');
                if (supSel && !supSel.__enhanced) enhanceSelect(supSel);
            }

            // Karaoke Mode Window
            if (matchesShortcut(shortcuts.karaoke || 'Alt+K')) {
                e.preventDefault();
                karaokeModal.style.display = 'flex';
            }

            // Escape - إغلاق جميع النوافذ المفتوحة
            if (e.key === 'Escape') {
                if (settingsPanel.style.display !== 'none') {
                    settingsPanel.style.display = 'none';
                }
                if (uploadModal.style.display === 'flex') {
                    uploadModal.style.display = 'none';
                }
                if (supportModal.style.display === 'flex') {
                    supportModal.style.display = 'none';
                }
                if (karaokeModal.style.display === 'flex') {
                    karaokeModal.style.display = 'none';
                }
                if (profilesModal.style.display === 'flex') {
                    profilesModal.style.display = 'none';
                }
                if (helpModal.style.display === 'flex') {
                    helpModal.style.display = 'none';
                }
            }
        });

        function positionButtons() {
            document.querySelectorAll('.subtitle-controls').forEach(e => e.remove());

            const isFull = !!document.fullscreenElement;
            let videos = document.querySelectorAll('video');

            // Special selector for YouTube
            if (videos.length === 0 && window.location.hostname.includes('youtube.com')) {
                const ytVideo = document.querySelector('.html5-video-player video');
                if (ytVideo) videos = [ytVideo];
            }

            // If no videos found, retry after a short delay
            if (videos.length === 0) {
                setTimeout(positionButtons, 1000);
                return;
            }

            videos.forEach((video, index) => {
                // Skip if video is too small (probably a thumbnail)
                let rect = video.getBoundingClientRect();
                if (rect.width < 200 || rect.height < 150) return;

                const container = document.createElement('div');
                container.className = 'subtitle-controls';

                const btnUpload = document.createElement('button');
                btnUpload.title = 'Upload Subtitle';
                btnUpload.style.cssText = btnStyle();
                btnUpload.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="8 8 20 20" width="20" height="20" fill="currentColor">
                    <path d="M11,11 C9.9,11 9,11.9 9,13 L9,23 C9,24.1 9.9,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M11,17 L14,17 L14,19 L11,19 L11,17 L11,17 Z M20,23 L11,23 L11,21 L20,21 L20,23 L20,23 Z M25,23 L22,23 L22,21 L25,21 L25,23 L25,23 Z M25,19 L16,19 L16,17 L25,17 L25,19 L25,19 Z" fill="#fff"></path>
                    </svg>
                `;

                const btnSettings = document.createElement('button');
                btnSettings.title = 'Settings';
                btnSettings.style.cssText = btnStyle();
                btnSettings.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="8 8 20 20" width="20" height="20" fill="currentColor">
                    <path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff"></path>
                    </svg>
                `;

                btnUpload.onclick = () => {
                    __currentTargetVideo = video;
                    uploadModal.style.display = 'flex';
                    // Load last used subtitle when modal opens
                    if (typeof window.__loadLastUsedSubtitle === 'function') {
                        window.__loadLastUsedSubtitle();
                    }
                };
                btnSettings.onclick = () => {
                    settingsPanel.style.display = 'block';
                };

                container.appendChild(btnUpload);
                container.appendChild(btnSettings);
                const topDoc = getTopDocument();
                topDoc.body.appendChild(container);

                // Use the rect already calculated above
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

                container.style.cssText += `
                    position: absolute;
                    top: ${rect.top + scrollTop + 10}px;
                    left: ${rect.left + scrollLeft + rect.width - 100}px;
                    z-index: 99999;
                    display: ${isFull ? 'none' : 'flex'};
                    overflow: hidden;
                    border-radius: 30%;
                    gap: 2px;
                `;
            });
        }

        function attachSubtitle(video, vttURL) {
            video.querySelectorAll('track.__custom_subtitle__').forEach(t => t.remove());

            const track = document.createElement('track');
            track.label = 'Custom Subtitle';
            track.kind = 'subtitles';
            track.srclang = 'en';
            track.src = vttURL;
            track.default = true;
            track.classList.add('__custom_subtitle__');

            video.appendChild(track);
            track.addEventListener('load', () => {
                applySettings();
            });

            setTimeout(() => {
                const cuesVisible = Array.from(video.textTracks)
                    .some(t => t.cues && t.cues.length > 0);

                if (!cuesVisible) {
                    if (!document.querySelector('.manual-subtitle')) {
                        const div = document.createElement('div');
                        div.className = 'manual-subtitle';
                        div.style.cssText = `
                            position: absolute;
                            bottom: 10%;
                            width: 100%;
                            text-align: center;
                            z-index: 100000;
                        `;
                        const span = document.createElement('span');
                        span.style.cssText = `
                                display: inline-block;
                                color: white;
                                font-size: 20px;
                                font-weight: 600;
                                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                                background: rgba(0,0,0,0.7);
                                border-radius: 35px;
                                padding: 8px 16px;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                                line-height: 1.3;
                            `;
                        span.textContent = 'Subtitle loaded (manual fallback)';
                        div.appendChild(span);
                        video.parentElement.appendChild(div);
                    }
                }
            }, 1000);
        }

        function btnStyle() {
            return `
        background: rgba(0, 0, 0, 0.50);
        color: #fff;
        border: none;
        width: 32px;
        border-radius: 20px;
        height: 32px;
        font-size: 16.5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        `;
        }

        function makePanelDraggable(panel) {
            const header = panel.querySelector('h3'); // الجزء الذي سنسحب منه
            header.style.cursor = 'move';
            let isDragging = false;
            let offsetX, offsetY;

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - panel.offsetLeft;
                offsetY = e.clientY - panel.offsetTop;

                // منع تحديد النص أثناء السحب
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    // حساب الموضع الجديد مع حدود الشاشة
                    let newLeft = e.clientX - offsetX;
                    let newTop = e.clientY - offsetY;

                    // التأكد من أن اللوحة لا تخرج من حدود الشاشة
                    const panelWidth = panel.offsetWidth;
                    const panelHeight = panel.offsetHeight;
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;

                    // حدود أفقية
                    if (newLeft < 0) newLeft = 0;
                    if (newLeft + panelWidth > windowWidth) newLeft = windowWidth - panelWidth;

                    // حدود عمودية
                    if (newTop < 0) newTop = 0;
                    if (newTop + panelHeight > windowHeight) newTop = windowHeight - panelHeight;

                    panel.style.left = `${newLeft}px`;
                    panel.style.top = `${newTop}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        }

        function createSettingsPanel() {
            const panel = document.createElement('div');
            panel.className = 'subtitle-settings-panel';
            panel.innerHTML = `
    <style>
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    /* Karaoke Animations */
    @keyframes karaokeSpotlight {
        0% {
            color: rgba(255,255,255,0.3);
            background: none;
            text-shadow: none;
            transform: scale(1);
        }
        50% {
            color: #fff;
            background: radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, transparent 70%);
            text-shadow:
                0 0 10px #fff,
                0 0 20px #fff,
                0 0 30px #ffd700,
                0 2px 4px rgba(0,0,0,0.5);
            filter: brightness(2) contrast(1.2);
            transform: scale(1.15);
            box-shadow:
                0 0 20px rgba(255,255,255,0.3),
                inset 0 0 20px rgba(255,255,255,0.1);
        }
        100% {
            color: rgba(255,255,255,0.3);
            background: none;
            text-shadow: none;
            transform: scale(1);
        }
    }

    .karaoke-word {
        display: inline-block;
        margin: 0 2px;
        transition: all 0.1s ease;
        white-space: nowrap;
    }

    .subtitle-settings-panel {
        animation: slideUp 0.3s ease;
        position: fixed;
        top: 60px;
        right: 30px;
        z-index: 100000;
        max-width: 90vw;
        max-height: 90vh;
        background: linear-gradient(225deg, rgba(24, 15, 15, 0.95) 0%, rgba(13, 34, 31, 0.95) 50%, rgba(5, 18, 17, 0.95) 100%);
        color: #fff;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        display: none;
        font-size: 14px;
        width: 280px;
        font-family: Arial, sans-serif;
        max-height: 80vh;
        overflow-y: auto;
        border: 1px solid rgba(5, 180, 166, 0.4);
        direction: ltr !important;
    }

    .subtitle-settings-panel h3 {
        margin-top: 0;
        margin-bottom: 0px;
        font-size: 18px;
        color: #ddd;
        text-align: center;

    }

    .subtitle-settings-panel label {
        display: block;
        margin: 6px 0 2px;
        font-weight: bold;
        font-size: 12px;

    }

    .subtitle-settings-panel input,
    .subtitle-settings-panel select {
        width: 100%;
        margin-bottom: 10px;
        padding: 8px;
        color: #fff;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(15px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .subtitle-settings-panel input:focus,
    .subtitle-settings-panel select:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.02);
    }

    .subtitle-settings-panel button {
        background: linear-gradient(118deg, rgba(48, 123, 123, 0) 4.09%, rgba(48, 93, 84, 0.7) 58.71%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        color: #fff;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
    }

    .subtitle-settings-panel button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        background: linear-gradient(118deg, rgba(48, 123, 123, 0.2) 4.09%, rgba(48, 93, 84, 0.9) 58.71%);
        border-color: rgba(5, 180, 166, 0.5);
    }

    .subtitle-settings-panel button:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .subtitle-settings-panel .validation-text {
        color: #10b981;
        font-size: 16px;
        margin-top: 4px;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 20px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked+.slider {
        background: linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6);
        background-size: 200% 100%;
    }

    input:checked+.slider:before {
        transform: translateX(20px);
    }

    input[type="range"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: transparent;
        width: 79%;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 15px;
        height: 15px;
        background: linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6);
        background-size: 200% 100%;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 15px;
        height: 15px;
        background: linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6);
        background-size: 200% 100%;
        border-radius: 50%;
        border: none;
        cursor: pointer;
    }

    input[type="range"]::-ms-thumb {
        width: 15px;
        height: 15px;
        background: linear-gradient(90deg, #22c55e, #3b82f6, #8b5cf6);
        background-size: 200% 100%;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]:focus {
        outline: none;
    }

    #copy-crypto:hover {
        opacity: 0.8;
        transform: scale(1.1);
    }

    #copy-crypto:active {
        transform: scale(0.9);
    }
    </style>
    <style>
    .su-select { position: relative; width: 100%; user-select: none; }
    .su-select__button {
        width: 100%; padding: 8px; color: #fff; border-radius: 8px;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(150px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        display: flex; align-items: center; justify-content: space-between; gap: 8px;
        cursor: pointer;
    }
    .su-select__button:focus { outline: none; border-color: rgba(255,255,255,0.4); box-shadow: 0 0 0 3px rgba(255,255,255,0.1); }
    .su-select__arrow { transition: transform .2s ease; opacity: .85; }
    .su-select__menu {
        position: absolute; left: 0; right: 0; margin-top: 6px;
        background: linear-gradient(225deg, rgb(24, 15, 15) 0%, #ffffff 0.03%, rgba(13, 34, 31, 0.88) 0.88%, rgba(5, 18, 17, 0.82) 25.56%, rgba(32, 61, 53, 0.51) 37.25%, rgba(15, 26, 22, 0.9) 82.63%, rgba(0,0,0,0.58) 98.5%);
        border: 0.5px solid rgba(5,180,166,0.9);
        border-radius: 10px; backdrop-filter: blur(150px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        z-index: 100002; max-height: 240px; overflow: auto; display: none;
    }
    .su-select__menu.open { display: block; }
    .su-select__option { padding: 8px 10px; color: #fff; cursor: pointer; transition: background .15s; font-size: 13px; }
    .su-select__option:hover, .su-select__option[aria-selected="true"] { background: rgba(255,255,255,0.10); }
    .su-hidden-select { position: absolute !important; left: -99999px !important; top: auto !important; width: 1px !important; height: 1px !important; overflow: hidden !important; }
    </style>

    <h3 style="display:flex;align-items:center;justify-content:space-between;">
        Subtitle Settings
        <button id="open-help-modal" title="Help & Shortcuts" style="background:linear-gradient(135deg,#667eea,#764ba2);border:none;color:#fff;padding:6px 12px;border-radius:8px;cursor:pointer;font-size:14px;box-shadow:0 4px 15px rgba(102,126,234,0.4);transition:all 0.3s ease;">
            ❓ Help
        </button>
    </h3>
    <label>_________________________________________</label>

    <div style="display:flex;gap:15px;margin-top:15px;align-items:center;">
        <div style="flex:1.5;">
            <label>Font Color</label>
            <input type="color" id="sub-font-color" value="${settings.fontColor}" style="width: 79%">
        </div>
        <div style="flex:1;">
            <label>Font Size</label>
            <input type="number" id="sub-font-size" value="${settings.fontSize}" style="width:81%">
        </div>
    </div>

    <div>
    <label>Font Family</label>
    <select id="sub-font-family">
        ${[
            '#_System Default',
            '#_Cairo',
            '#_Tajawal',
            '#_Noto Naskh Arabic',
            '#_Noto Kufi Arabic',
            '#_Amiri',
            '#_Scheherazade New',
            '#_Markazi Text',
            '#_El Messiri',
            '#_Reem Kufi',
            '#_Changa',
            '#_Harmattan',
            '#_Mada',
            '#_IBM Plex Sans Arabic',
            '#_Almarai',
            '#_Roboto',
            '#_Inter',
            '#_Arial',
            '#_Georgia'
        ].map(f => `<option value="${f}" ${settings.fontFamily === f ? 'selected' : ''}>${f}</option>`).join('')}
    </select>
    </div>

    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
        <label style="display: flex; align-items: center; gap: 10px; white-space: nowrap;">
            bg-opacity & Background Color
            <label class="switch">
                <input type="checkbox" id="sub-bg-toggle" ${settings.bgToggle ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </label>

        <div style="flex: 1; display: flex; flex-direction: row; align-items: center; gap: 8px;">
            <div style="flex:1.2;display:flex;flex-direction:Column;align-items:center;">
                <input type="range" min="0" max="1" step="0.01" id="sub-bg-opacity" value="${settings.bgOpacity || 0.7}">
            </div>
            <div style="flex:0.35;">
                <span id="bg-opacity-value" style="font-size: 10px; color: #fff;">${(settings.bgOpacity || 0.7) * 100}%</span>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column;">
                <input type="color" id="sub-bg-color" value="${settings.bgColor}" style="width:94%">
            </div>
        </div>
    </div>

    <div style="flex: 1; display: flex; flex-direction: row; align-items: center; gap: 8px;">
        <div style="flex:1.2;display:flex;flex-direction:Column;">
            <label>Position</label>
            <input type="range" min="0" max="100" id="sub-offsetY" value="${settings.offsetY}">
        </div>
        <div style="flex:0.35;">
            <span id="sub-offsetY-value" style="font-size:10px;color:#fff;">${settings.offsetY}px</span>
        </div>
        <div style="flex:1;">
            <label>Delay(ms)</label>
            <input type="number" id="sub-delay" value="${settings.delay}" step="50" style="width:81%">
        </div>
    </div>


    <!-- Action Buttons - 2 rows of 3 buttons each -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-top: 12px;">
        <button id="open-profiles" title="Profiles" style="background: linear-gradient(118deg, rgba(16, 37, 37, 0.47) 4.09%, rgba(48, 93, 84, 0.7) 58.71%); border: 1px solid rgba(33, 128, 115, 0.77); color: #fff; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; transition: all 0.2s ease;"> Profiles</button>
        <button id="open-karaoke" title="Karaoke Mode" style="background: linear-gradient(118deg, rgba(16, 37, 37, 0.47) 4.09%, rgba(48, 93, 84, 0.7) 58.71%); border: 1px solid rgba(33, 128, 115, 0.77); color: #fff; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; transition: all 0.2s ease;"> Karaoke</button>
        <button id="open-support" title="Support" style="background: linear-gradient(118deg, rgba(16, 37, 37, 0.47) 4.09%, rgba(48, 93, 84, 0.7) 58.71%); border: 1px solid rgba(33, 128, 115, 0.77); color: #fff; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; transition: all 0.2s ease;">❤️ Support</button>

        <button id="sub-reset-settings" title="Reset Settings" style="background: linear-gradient(118deg, rgba(16, 37, 37, 0.47) 4.09%, rgba(48, 93, 84, 0.7) 58.71%); border: 1px solid rgba(33, 128, 115, 0.77); color: #fff; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; transition: all 0.2s ease;"> Reset</button>
        <button id="sub-clear" title="Clear Subtitle" style="background: linear-gradient(118deg, rgba(16, 37, 37, 0.47) 4.09%, rgba(48, 93, 84, 0.7) 58.71%); border: 1px solid rgba(33, 128, 115, 0.77); color: #fff; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; transition: all 0.2s ease;"> Clear</button>
        <button id="sub-close" title="Close Panel" style="background: linear-gradient(118deg, rgba(16, 37, 37, 0.47) 4.09%, rgba(48, 93, 84, 0.7) 58.71%); border: 1px solid rgba(33, 128, 115, 0.77); color: #fff; padding: 6px 8px; border-radius: 6px; cursor: pointer; text-align: center; font-size: 11px; transition: all 0.2s ease;">✕ Close</button>
    </div>
    `;
            const topDoc = getTopDocument();
            topDoc.body.appendChild(panel);
            enhanceSelect(panel.querySelector('#sub-font-family'));

            panel.querySelector('#sub-offsetY').addEventListener('input', () => {
                panel.querySelector('#sub-offsetY-value').textContent =
                    panel.querySelector('#sub-offsetY').value + 'px';
            });

            panel.querySelector('#sub-close').onclick = () => panel.style.display = 'none';

            // Add reset settings functionality
            panel.querySelector('#sub-reset-settings').onclick = () => {
                if (confirm('Are you sure you want to reset all settings to their defaults?')) {
                    localStorage.removeItem('__subtitle_settings__');
                    alert('Settings have been reset. The page will now reload.');
                    location.reload();
                }
            };
            panel.querySelector('#sub-clear').onclick = () => {
                document.querySelectorAll('video').forEach(video => {
                    // إزالة كل التراكات
                    video.querySelectorAll('track').forEach(t => t.remove());

                    // إزالة fallback يدوي لو موجود
                    video.closest('body')?.querySelector('.manual-subtitle')?.remove();

                    // تعطيل الـ textTracks
                    Array.from(video.textTracks).forEach(track => {
                        track.mode = 'disabled';
                    });
                });

                // إزالة الستايل تبع ::cue
                if (style && style.parentNode) {
                    style.remove();
                }

                alert('✅ Translation removed, page will be reloaded for full cleanup.');
                setTimeout(() => {
                    location.reload();
                }, 600); // ندي وقت لل alert يظهر
            };


            panel.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => {
                    saveSettings();
                    applySettings();
                    // *** إضافة للتاريخ ***
                    addToHistory(loadSettings());
                });
            });
            panel.querySelector('#sub-font-family').addEventListener('change', () => {
                saveSettings();
                applySettings();
                addToHistory(loadSettings());
            });
            panel.querySelector('#sub-bg-opacity').addEventListener('input', () => {
                const val = panel.querySelector('#sub-bg-opacity').value;
                panel.querySelector('#bg-opacity-value').textContent = ` ${Math.round(val * 100)}%`;
                saveSettings();
                applySettings();
                addToHistory(loadSettings());
            });

            // Add event handler for the background toggle switch
            panel.querySelector('#sub-bg-toggle').addEventListener('change', () => {
                saveSettings();
                applySettings();
                addToHistory(loadSettings());
            });

            panel.querySelector('#open-profiles').onclick = () => {
                profilesModal.style.display = 'flex';
                const profSel = profilesModal.querySelector('#profile-selector');
                if (profSel && !profSel.__enhanced) enhanceSelect(profSel);
                // Update preview when opening profiles modal
                const updatePreviewFunc = profilesModal.__updatePreview;
                if (updatePreviewFunc) updatePreviewFunc(null);
            };

            panel.querySelector('#open-karaoke').onclick = () => {
                karaokeModal.style.display = 'flex';
            };

            panel.querySelector('#open-support').onclick = () => {
                supportModal.style.display = 'flex';
                const supSel = supportModal.querySelector('#support-crypto-select');
                if (supSel && !supSel.__enhanced) enhanceSelect(supSel);
            };

            panel.querySelector('#open-help-modal').onclick = () => {
                helpModal.style.display = 'flex';
            };

            // Make the panel draggable
            makePanelDraggable(panel);

            return panel;
        }

        function createUploadModal() {
            const modal = document.createElement('div');
            modal.className = 'subtitle-upload-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.55);
                z-index: 100001;
            `;

            modal.innerHTML = `
    <style>
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .sumodal-card {
        animation: slideUp 0.3s ease;
    }
    </style>
    <div class="sumodal-card" style="
        width: min(95vw, 350px);
        background: linear-gradient(225deg, rgba(24, 15, 15, 0.95) 0%, rgba(13, 34, 31, 0.95) 50%, rgba(5, 18, 17, 0.95) 100%);
        color: #fff;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        padding: 16px;
        font-family: Arial, sans-serif;
        border: 1px solid rgba(5, 180, 166, 0.4);
    ">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
        <h3 style="margin:0;font-size:16px;color:#e5e7eb">Upload Subtitle</h3>
        <button id="su-close-modal" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.2s;">✕</button>
    </div>
    <div id="su-drop-zone" style="
        border: 2px dashed rgba(255,255,255,0.35);
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        background: rgba(255,255,255,0.04);
        transition: border-color .2s, background .2s;
        user-select: none;
    ">
        <div style="font-size:14px;color:#cbd5e1;margin-bottom:8px;">Drag & Drop .vtt or .srt here</div>
        <div style="font-size:11px;color:#94a3b8;margin-bottom:12px;">or</div>
        <input id="su-file-input" type="file" accept=".vtt,.srt" style="display:none">
        <button id="su-choose-btn" style="background:#2f4f4f;border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer">Choose file</button>
    </div>

    <!-- Last Used Subtitle Section -->
    <div id="su-last-used" style="display:none;margin-top:12px;padding:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(5, 180, 166, 0.4);border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:12px;color:#5db4a6;font-weight:600;">Last Used</span>
            <button id="su-clear-last" style="background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.3);color:#ef4444;padding:3px 10px;border-radius:6px;cursor:pointer;font-size:10px;transition:all 0.2s;">✕ Clear</button>
        </div>
        <div id="su-last-filename" style="font-size:13px;color:#cbd5e1;margin-bottom:10px;word-break:break-all;background:rgba(255,255,255,0.05);padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);"></div>
        <button id="su-reuse-last" style="width:100%;background:linear-gradient(135deg, rgba(5, 180, 166, 0.2), rgba(5, 180, 166, 0.3));border:1px solid rgba(5, 180, 166, 0.5);color:#22c55e;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s;box-shadow:0 2px 8px rgba(5, 180, 166, 0.2);">Use Again</button>
    </div>

    <!-- Advanced Preview Section (Hidden by default) -->
    <div id="su-preview-section" style="display:none;margin-top:15px;max-height:60vh;overflow-y:auto;">
        <!-- Visual Preview (Now First) -->
        <div id="su-visual-preview"></div>

        <!-- Analysis Results (Now Second) -->
        <div id="su-analysis-results"></div>
    </div>

    <!-- Action Buttons (Always visible when file is selected) -->
    <div id="su-action-buttons" style="display:none;margin-top:12px;gap:8px;">
        <button id="su-apply-btn" style="flex:1;background:rgba(34,197,94,0.3);border:1px solid rgba(34,197,94,0.5);color:#22c55e;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✓ Apply Subtitle</button>
        <button id="su-cancel-preview" style="flex:1;background:rgba(239,68,68,0.3);border:1px solid rgba(239,68,68,0.5);color:#ef4444;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:bold;">✗ Cancel</button>
    </div>
    </div>
            `;

            const topDoc = getTopDocument();
            topDoc.body.appendChild(modal);
            enhanceSelect(modal.querySelector('#support-crypto-select'));

            const closeBtn = modal.querySelector('#su-close-modal');
            const chooseBtn = modal.querySelector('#su-choose-btn');
            const fileInput = modal.querySelector('#su-file-input');
            const dropZone = modal.querySelector('#su-drop-zone');
            const lastUsedSection = modal.querySelector('#su-last-used');
            const lastFilenameEl = modal.querySelector('#su-last-filename');
            const reuseLastBtn = modal.querySelector('#su-reuse-last');
            const clearLastBtn = modal.querySelector('#su-clear-last');

            // Load and display last used subtitle
            const loadLastUsed = () => {
                const lastSubtitle = localStorage.getItem('__last_subtitle__');
                if (lastSubtitle) {
                    try {
                        const data = JSON.parse(lastSubtitle);
                        lastFilenameEl.textContent = data.filename;
                        lastUsedSection.style.display = 'block';
                    } catch (e) {
                        localStorage.removeItem('__last_subtitle__');
                    }
                } else {
                    lastUsedSection.style.display = 'none';
                }
            };

            // Make loadLastUsed accessible globally for saveLastUsed
            window.__loadLastUsedSubtitle = loadLastUsed;

            // Reuse last subtitle
            reuseLastBtn.onclick = () => {
                const lastSubtitle = localStorage.getItem('__last_subtitle__');
                if (lastSubtitle) {
                    try {
                        const data = JSON.parse(lastSubtitle);
                        const blob = new Blob([data.content], { type: 'text/vtt' });
                        const file = new File([blob], data.filename, { type: 'text/vtt' });
                        handleSubtitleFile(file);
                    } catch (e) {
                        showToast('❌ Failed to load last subtitle', 'error');
                    }
                }
            };

            // Clear last used
            clearLastBtn.onclick = () => {
                localStorage.removeItem('__last_subtitle__');
                lastUsedSection.style.display = 'none';
                showToast('🗑️ Last subtitle cleared', 'info');
            };

            // Add hover effects
            clearLastBtn.onmouseenter = () => {
                clearLastBtn.style.background = 'rgba(239,68,68,0.4)';
                clearLastBtn.style.transform = 'scale(1.05)';
            };
            clearLastBtn.onmouseleave = () => {
                clearLastBtn.style.background = 'rgba(239,68,68,0.2)';
                clearLastBtn.style.transform = 'scale(1)';
            };

            reuseLastBtn.onmouseenter = () => {
                reuseLastBtn.style.background = 'linear-gradient(135deg, rgba(5, 180, 166, 0.3), rgba(5, 180, 166, 0.5))';
                reuseLastBtn.style.transform = 'translateY(-2px)';
                reuseLastBtn.style.boxShadow = '0 4px 12px rgba(5, 180, 166, 0.4)';
            };
            reuseLastBtn.onmouseleave = () => {
                reuseLastBtn.style.background = 'linear-gradient(135deg, rgba(5, 180, 166, 0.2), rgba(5, 180, 166, 0.3))';
                reuseLastBtn.style.transform = 'translateY(0)';
                reuseLastBtn.style.boxShadow = '0 2px 8px rgba(5, 180, 166, 0.2)';
            };

            const closeModal = () => { modal.style.display = 'none'; };
            closeBtn.onclick = closeModal;
            closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,0,0,0.3)'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.1)'; };
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            chooseBtn.onclick = () => fileInput.click();
            fileInput.onchange = () => {
                const file = fileInput.files && fileInput.files[0];
                if (file) {
                    // Validate file type
                    const fileName = file.name.toLowerCase();
                    if (!fileName.endsWith('.vtt') && !fileName.endsWith('.srt')) {
                        showToast('❌ Please upload .vtt or .srt file only', 'error');
                        fileInput.value = ''; // Reset input
                        return;
                    }
                    handleSubtitleFile(file);
                }
            };

            const highlight = (on) => {
                dropZone.style.borderColor = on ? '#22c55e' : 'rgba(255,255,255,0.35)';
                dropZone.style.background = on ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)';
            };

            ;['dragenter','dragover'].forEach(evt => {
                dropZone.addEventListener(evt, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    highlight(true);
                });
            });
            ;['dragleave','drop'].forEach(evt => {
                dropZone.addEventListener(evt, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    highlight(false);
                });
            });
            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                if (!dt || !dt.files || !dt.files.length) return;
                const file = dt.files[0];

                // Validate file type
                const fileName = file.name.toLowerCase();
                if (!fileName.endsWith('.vtt') && !fileName.endsWith('.srt')) {
                    showToast('❌ Please upload .vtt or .srt file only', 'error');
                    return;
                }

                handleSubtitleFile(file);
            });

            return modal;
        }

        function createSupportModal() {
            const modal = document.createElement('div');
            modal.className = 'subtitle-support-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.55);
                z-index: 100001;
            `;

            modal.innerHTML = `
    <style>
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .sumodal-card {
        animation: slideUp 0.3s ease;
    }
    </style>
    <div class="sumodal-card" style="
        width: min(95vw, 380px);
        background: linear-gradient(225deg, rgba(24, 15, 15, 0.95) 0%, rgba(13, 34, 31, 0.95) 50%, rgba(5, 18, 17, 0.95) 100%);
        color: #fff;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        padding: 16px;
        font-family: Arial, sans-serif;
        border: 1px solid rgba(5, 180, 166, 0.4);
    ">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
        <h3 style="margin:0;font-size:16px;color:#e5e7eb">💰 Donate Me❤️</h3>
        <button id="support-close" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.2s;">✕</button>
    </div>
    <div>
        <select id="support-crypto-select" style="width: 100%; margin-bottom: 10px; padding: 8px; color: #fff; border-radius: 8px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(15px); transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
            <option value="">-- Choose --</option>
            ${Object.entries(cryptoAddresses).map(([k, v]) => `<option value="${v}">${k}</option>`).join('')}
        </select>
        <div style="display:flex;gap:4px;align-items:center;margin-top:4px;">
            <input type="text" id="support-crypto-output" readonly placeholder="Selected address" style="flex:1; padding: 8px; color:#fff; border-radius: 8px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25);">
            <button id="support-copy" title="Copy" style="background:#303835;border:none;color:#fff;margin-bottom:10px;cursor:pointer; padding:6px 12px; border-radius: 8px;"> copy </button>
        </div>
    </div>
    </div>
            `;

            const topDoc = getTopDocument();
            topDoc.body.appendChild(modal);

            const closeBtn = modal.querySelector('#support-close');
            const selectEl = modal.querySelector('#support-crypto-select');
            const outputEl = modal.querySelector('#support-crypto-output');
            const copyBtn = modal.querySelector('#support-copy');

            const closeModal = () => { modal.style.display = 'none'; };
            closeBtn.onclick = closeModal;
            closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,0,0,0.3)'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.1)'; };
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

            selectEl.onchange = function () {
                outputEl.value = this.value;
            };

            copyBtn.onclick = async () => {
                const out = outputEl.value;
                if (!out) return alert('Please select an address first!🫵🤨');
                try {
                    await navigator.clipboard.writeText(out);
                    alert('Address copied!❤️');
                } catch (err) {
                    const temp = document.createElement('textarea');
                    temp.value = out;
                    temp.style.position = 'fixed';
                    temp.style.left = '-9999px';
                    document.body.appendChild(temp);
                    temp.select();
                    try {
                        const success = document.execCommand('copy');
                        if (success) alert('Address copied!❤️');
                        else throw new Error('execCommand failed');
                    } catch (e) {
                        alert('❌ Failed to copy. Please copy manually.');
                    }
                    document.body.removeChild(temp);
                }
            };

            return modal;
        }

        function createKaraokeModal() {
            const modal = document.createElement('div');
            modal.className = 'subtitle-karaoke-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.55);
                z-index: 100001;
            `;

            modal.innerHTML = `
    <style>
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .karaoke-modal-card {
        animation: slideUp 0.3s ease;
    }
    .karaoke-preview-word {
        display: inline-block;
        margin: 0 4px;
        transition: all 0.3s ease;
    }
    </style>
    <div class="karaoke-modal-card" style="
        width: min(95vw, 450px);
        background: linear-gradient(225deg, rgba(24, 15, 15, 0.95) 0%, rgba(13, 34, 31, 0.95) 50%, rgba(5, 18, 17, 0.95) 100%);
        color: #fff;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        padding: 16px;
        font-family: Arial, sans-serif;
        border: 1px solid rgba(5, 180, 166, 0.4);
        max-height: 90vh;
        overflow-y: auto;
    ">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:16px;">
        <h3 style="margin:0;font-size:18px;color:#e5e7eb;display:flex;align-items:center;gap:8px;">
            🎤 Karaoke Mode
        </h3>
        <button id="karaoke-close" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.2s;">✕</button>
    </div>

    <!-- Enable/Disable Toggle -->
    <div style="background: rgba(5, 180, 166, 0.1); padding: 14px; border-radius: 10px; border: 1px solid rgba(5, 180, 166, 0.3); margin-bottom: 16px;">
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <span style="font-size: 15px; font-weight: 600;">Enable Karaoke Mode</span>
            <label class="switch">
                <input type="checkbox" id="karaoke-modal-toggle" ${settings.karaokeMode ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </label>
    </div>

    <!-- Karaoke Controls -->
    <div id="karaoke-modal-controls" style="display: ${settings.karaokeMode ? 'block' : 'none'};">

        <!-- Live Preview -->
        <div style="background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 105, 180, 0.08)); border: 2px solid rgba(255, 215, 0, 0.3); border-radius: 10px; padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <span style="font-size: 12px;">🔴</span>
                <span style="color: #ffd700; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Live Preview</span>
            </div>
            <div style="background: rgba(0,0,0,0.4); border-radius: 8px; padding: 20px; min-height: 60px; display: flex; align-items: center; justify-content: center;">
                <div id="karaoke-preview-text" style="text-align: center; font-size: 16px; font-weight: 600;">
                    مرحباً بكم في وضع الكاريوكي
                </div>
            </div>
            <button id="karaoke-test-preview" style="width: 100%; margin-top: 10px; background: rgba(255, 215, 0, 0.2); border: 1px solid rgba(255, 215, 0, 0.4); color: #ffd700; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s;">
                ▶ Test Animation
            </button>
        </div>



        <!-- Animation Speed -->
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 600;">
                Animation Speed: <span id="karaoke-modal-speed-value" style="color: #ffd700;">${settings.karaokeSpeed || 1}x</span>
            </label>
            <input type="range" id="karaoke-modal-speed" min="0.5" max="2" step="0.1" value="${settings.karaokeSpeed || 1}"
                   style="width: 100%; height: 6px; accent-color: rgba(5, 180, 166, 0.8); cursor: pointer;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px;">
                <span>0.5x (Slow)</span>
                <span>1x (Normal)</span>
                <span>2x (Fast)</span>
            </div>
        </div>


    </div>

    </div>
            `;

            const topDoc = getTopDocument();
            topDoc.body.appendChild(modal);

            // Close button
            modal.querySelector('#karaoke-close').onclick = () => {
                modal.style.display = 'none';
            };

            // Click outside to close
            modal.onclick = (e) => {
                if (e.target === modal) modal.style.display = 'none';
            };

            // Toggle Karaoke Mode
            const karaokeToggle = modal.querySelector('#karaoke-modal-toggle');
            const karaokeControls = modal.querySelector('#karaoke-modal-controls');

            karaokeToggle.addEventListener('change', () => {
                karaokeControls.style.display = karaokeToggle.checked ? 'block' : 'none';
                saveSettings();
                applySettings();
            });

            // Effect buttons
            const effectButtons = modal.querySelectorAll('.karaoke-effect-btn');
            effectButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const effect = btn.dataset.effect;

                    // Update button styles (Spotlight only)
                    effectButtons.forEach(b => {
                        if (b.dataset.effect === 'spotlight') {
                            b.style.borderColor = 'rgba(255,215,0,0.6)';
                        }
                    });

                    // Update settings
                    settings.karaokeEffect = 'spotlight';
                    saveSettings();
                    applySettings();
                });
            });

            // Speed slider
            const speedSlider = modal.querySelector('#karaoke-modal-speed');
            const speedValue = modal.querySelector('#karaoke-modal-speed-value');

            speedSlider.addEventListener('input', () => {
                speedValue.textContent = `${speedSlider.value}x`;
                saveSettings();
                applySettings();
            });

            // Test preview button
            const testBtn = modal.querySelector('#karaoke-test-preview');
            const previewText = modal.querySelector('#karaoke-preview-text');

            testBtn.addEventListener('click', () => {
                const currentEffect = settings.karaokeEffect || 'spotlight';
                const sampleTexts = [
                    'مرحباً بكم في وضع الكاريوكي', // Arabic RTL
                    'Welcome to Karaoke Mode'      // English LTR
                ];
                const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

                // Use the same logic as processKaraokeText for consistency
                const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(randomText);
                let words = randomText.split(/\s+/).filter(w => w.length > 0);

                const speed = parseFloat(settings.karaokeSpeed || 1);
                const delayPerWord = (1200 / words.length) / speed; // 1200ms total duration

                // Handle Arabic RTL animation properly
                let processedWords;
                if (hasArabic) {
                    // For Arabic RTL: keep logical order; container will be RTL.
                    processedWords = words.map((word, index) => {
                        const animationDelay = (delayPerWord * index) / 1000;
                        const animationDuration = (delayPerWord / 1000) * 1.5;
                        return `<span class=\"karaoke-preview-word\" style=\"animation: karaoke${currentEffect.charAt(0).toUpperCase() + currentEffect.slice(1)} ${animationDuration}s ease-in-out ${animationDelay}s forwards;\">${word}</span>`;
                    }).join(' ');
                } else {
                    // For LTR: animate from left to right
                    processedWords = words.map((word, index) => {
                        const animationDelay = (delayPerWord * index) / 1000;
                        const animationDuration = (delayPerWord / 1000) * 1.5;
                        return `<span class=\"karaoke-preview-word\" style=\"animation: karaoke${currentEffect.charAt(0).toUpperCase() + currentEffect.slice(1)} ${animationDuration}s ease-in-out ${animationDelay}s forwards;\">${word}</span>`;
                    }).join(' ');
                }

                // Apply proper direction and alignment
                const direction = hasArabic ? 'rtl' : 'ltr';
                const textAlign = hasArabic ? 'right' : 'center';
                previewText.innerHTML = `<div dir="${direction}" style="direction: ${direction}; text-align: ${textAlign};">${processedWords}</div>`;

                // Reset after animation
                setTimeout(() => {
                    previewText.innerHTML = randomText;
                    previewText.style.direction = direction;
                    previewText.style.textAlign = textAlign;
                }, 2500);
            });

            return modal;
        }

        function createProfilesModal() {
            const modal = document.createElement('div');
            modal.className = 'subtitle-profiles-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.55);
                z-index: 100001;
            `;

            modal.innerHTML = `
    <style>
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes pulse {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        50% { transform: translate(-10%, -10%) scale(1.1); opacity: 0.5; }
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    .sumodal-card {
        animation: slideUp 0.3s ease;
    }
    #preview-refresh:hover {
        background: rgba(34,197,94,0.3);
        transform: scale(1.05);
    }
    #preview-refresh:active {
        transform: scale(0.95);
    }
    </style>
    <div class="sumodal-card" style="
        width: min(95vw, 450px);
        background: linear-gradient(225deg, rgba(24, 15, 15, 0.95) 0%, rgba(13, 34, 31, 0.95) 50%, rgba(5, 18, 17, 0.95) 100%);
        color: #fff;
        border-radius: 14px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        padding: 16px;
        font-family: Arial, sans-serif;
        border: 1px solid rgba(5, 180, 166, 0.4);
        max-height: 90vh;
        overflow-y: auto;
    ">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;">
        <h3 style="margin:0;font-size:16px;color:#e5e7eb">⚙️ Profiles Manager</h3>
        <button id="profiles-close" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.2s;">✕</button>
    </div>

    <!-- Enhanced Live Preview Card - Compact Version -->
    <div id="profile-preview-container" style="background: linear-gradient(135deg, rgba(34,197,94,0.08), rgba(59,130,246,0.08));border: 2px solid rgba(34,197,94,0.3);border-radius: 10px;padding: 10px;margin-bottom: 12px;box-shadow: 0 4px 20px rgba(0,0,0,0.3);position: relative;overflow: hidden;">
        <!-- Animated background effect -->
        <div style="position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);animation:pulse 3s ease-in-out infinite;pointer-events:none;"></div>

        <div style="position:relative;z-index:1;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="font-size:12px;animation:blink 2s ease-in-out infinite;">🔴</span>
                    <span style="color:#22c55e;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Live Preview</span>
                </div>
                <button id="preview-refresh" title="Refresh Preview" style="background:rgba(34,197,94,0.2);border:1px solid rgba(34,197,94,0.4);color:#22c55e;padding:2px 8px;border-radius:4px;cursor:pointer;font-size:10px;transition:all 0.2s;">🗘</button>
            </div>

            <!-- Compact video-like preview area -->
            <div style="background:#0000001a;border-radius:6px;padding:12px 8px;min-height:50px;display:flex;align-items:center;justify-content:center;position:relative;box-shadow:inset 0 2px 10px rgba(0,0,0,0.5);margin-bottom:8px;">
                <!-- Preview subtitle text -->
                <div id="preview-subtitle-container" style="text-align:center;max-width:90%;">
                    <span id="preview-subtitle-text" style="text-align:center;padding:6px 12px;border-radius:20px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:inline-block;transition:all 0.3s ease;font-size:14px;">Sample Text 🎬</span>
                </div>
            </div>

            <!-- Compact Info Grid - 2 rows of 2 -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">
                <div style="background:rgba(139,92,246,0.15);padding:6px;border-radius:6px;border:1px solid rgba(139,92,246,0.3);display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:14px;">📏</span>
                    <div style="text-align:right;">
                        <div style="color:#a78bfa;font-size:8px;text-transform:uppercase;">Size</div>
                        <div style="color:#fff;font-weight:700;font-size:12px;" id="preview-font">17px</div>
                    </div>
                </div>

                <div style="background:rgba(236,72,153,0.15);padding:6px;border-radius:6px;border:1px solid rgba(236,72,153,0.3);display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:14px;">📍</span>
                    <div style="text-align:right;">
                        <div style="color:#f9a8d4;font-size:8px;text-transform:uppercase;">Pos</div>
                        <div style="color:#fff;font-weight:700;font-size:12px;" id="preview-position">19px</div>
                    </div>
                </div>

                <div style="background:rgba(34,197,94,0.15);padding:6px;border-radius:6px;border:1px solid rgba(34,197,94,0.3);display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:14px;">⏱️</span>
                    <div style="text-align:right;">
                        <div style="color:#86efac;font-size:8px;text-transform:uppercase;">Delay</div>
                        <div style="color:#fff;font-weight:700;font-size:12px;" id="preview-delay">0ms</div>
                    </div>
                </div>

                <div style="background:rgba(251,146,60,0.15);padding:6px;border-radius:6px;border:1px solid rgba(251,146,60,0.3);display:flex;align-items:center;justify-content:space-between;">
                    <span style="font-size:14px;">🎨</span>
                    <div style="text-align:right;">
                        <div style="color:#fdba74;font-size:8px;text-transform:uppercase;">BG</div>
                        <div style="color:#fff;font-weight:700;font-size:12px;" id="preview-bg">70%</div>
                    </div>
                </div>
            </div>

            <!-- Font Family Display - Compact -->
            <div style="text-align:center;padding:4px;background:rgba(0,0,0,0.2);border-radius:4px;border:1px solid rgba(255,255,255,0.1);">
                <span style="color:#94a3b8;font-size:9px;margin-right:4px;">Font:</span>
                <span style="color:#22c55e;font-size:10px;font-weight:600;" id="preview-font-family">System Default</span>
            </div>
        </div>
    </div>

    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
        <select id="profile-selector" style="width: 100%; margin-bottom: 10px; padding: 8px; color: #fff; border-radius: 8px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(15px); transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
            <option value="">-- Select Profile --</option>
            ${Object.keys(settings.profiles || {}).map(name =>
                `<option value="${name}" ${settings.currentProfile === name ? 'selected' : ''}>${name}</option>`
            ).join('')}
        </select>
        <div style="display:flex;gap:8px;align-items:center;margin-top:4px;">
            <button id="load-profile" title="Load" style="flex:1;background:rgba(34,197,94,0.3);border:1px solid rgba(34,197,94,0.5);color:#22c55e;margin-bottom:10px;cursor:pointer; padding:8px 12px; border-radius: 8px;font-weight:bold;">Load</button>
            <button id="delete-profile" title="Delete" style="flex:1;background:rgba(239,68,68,0.3);border:1px solid rgba(239,68,68,0.5);color:#ef4444;margin-bottom:10px;cursor:pointer; padding:8px 12px; border-radius: 8px;font-weight:bold;">Delete</button>
        </div>
        <input type="text" id="new-profile-name" placeholder="New profile name" style="width: 100%; padding: 8px; color:#fff; border-radius: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); margin-bottom:10px;">
        <button id="save-profile" title="Save Current Settings as New Profile" style="width:100%;background:rgba(102,126,234,0.3);border:1px solid rgba(102,126,234,0.5);color:#667eea;margin-bottom:10px;cursor:pointer; padding:8px 12px; border-radius: 8px;font-weight:bold;">💾 Save as New Profile</button>
    </div>
    </div>
            `;

            const topDoc = getTopDocument();
            topDoc.body.appendChild(modal);

            // Enhance the profile selector with custom dropdown
            enhanceSelect(modal.querySelector('#profile-selector'));

            const closeBtn = modal.querySelector('#profiles-close');
            const profileSelector = modal.querySelector('#profile-selector');
            const loadProfileBtn = modal.querySelector('#load-profile');
            const saveProfileBtn = modal.querySelector('#save-profile');
            const deleteProfileBtn = modal.querySelector('#delete-profile');
            const newProfileInput = modal.querySelector('#new-profile-name');

            // Preview Elements
            const previewText = modal.querySelector('#preview-subtitle-text');
            const previewFont = modal.querySelector('#preview-font');
            const previewPosition = modal.querySelector('#preview-position');
            const previewDelay = modal.querySelector('#preview-delay');
            const previewBg = modal.querySelector('#preview-bg');
            const previewFontFamily = modal.querySelector('#preview-font-family');
            const previewRefreshBtn = modal.querySelector('#preview-refresh');

            // Function to update preview based on profile data
            function updatePreview(profileData) {
                if (!profileData) {
                    // Show current settings if no profile data
                    profileData = {
                        fontSize: settingsPanel.querySelector('#sub-font-size').value,
                        fontColor: settingsPanel.querySelector('#sub-font-color').value,
                        bgColor: settingsPanel.querySelector('#sub-bg-color').value,
                        bgToggle: settingsPanel.querySelector('#sub-bg-toggle').checked,
                        offsetY: settingsPanel.querySelector('#sub-offsetY').value,
                        delay: parseInt(settingsPanel.querySelector('#sub-delay').value || 0),
                        bgOpacity: parseFloat(settingsPanel.querySelector('#sub-bg-opacity').value),
                        fontFamily: settingsPanel.querySelector('#sub-font-family').value
                    };
                }

                const fontSize = profileData.fontSize || 17;
                const fontColor = profileData.fontColor || '#ffffff';
                const bgColor = profileData.bgColor || '#000000ff';
                const bgToggle = profileData.bgToggle !== false;
                const bgOpacity = profileData.bgOpacity || 0.7;
                const offsetY = profileData.offsetY || 19;
                const delay = profileData.delay || 0;
                const fontFamily = profileData.fontFamily || 'System Default';

                // Update preview text style with animation
                previewText.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                previewText.style.color = fontColor;
                previewText.style.fontSize = fontSize + 'px';
                previewText.style.textShadow = `2px 2px 4px rgba(0, 0, 0, 0.80), 0 0 10px ${fontColor}40`;

                if (fontFamily && fontFamily !== 'System Default') {
                    const cleanFamily = fontFamily.replace(/^#_/, '');
                    previewText.style.fontFamily = `'${cleanFamily}', sans-serif`;
                    previewFontFamily.textContent = cleanFamily;
                    previewFontFamily.style.fontFamily = `'${cleanFamily}', sans-serif`;
                } else {
                    previewText.style.fontFamily = '';
                    previewFontFamily.textContent = 'System Default';
                    previewFontFamily.style.fontFamily = '';
                }

                if (bgToggle) {
                    const rgb = hexToRgba(bgColor, bgOpacity);
                    previewText.style.backgroundColor = rgb;
                    previewText.style.backdropFilter = 'blur(4px)';
                } else {
                    previewText.style.backgroundColor = 'transparent';
                    previewText.style.backdropFilter = 'none';
                }

                // Update info values with smooth transitions
                const updateValue = (element, value) => {
                    element.style.transition = 'all 0.3s ease';
                    element.style.transform = 'scale(1.1)';
                    element.textContent = value;
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 300);
                };

                updateValue(previewFont, fontSize + 'px');
                updateValue(previewPosition, offsetY + 'px');
                updateValue(previewDelay, delay + 'ms');
                updateValue(previewBg, bgToggle ? Math.round(bgOpacity * 100) + '%' : 'Off');

                // Add pulse effect to preview text
                previewText.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    previewText.style.transform = 'scale(1)';
                }, 100);
            }

            // Refresh button - updates preview with current settings panel values
            previewRefreshBtn.onclick = () => {
                previewRefreshBtn.style.transform = 'rotate(360deg)';
                previewRefreshBtn.style.transition = 'transform 0.5s ease';
                updatePreview(null);
                showToast('🗘 Preview refreshed!', 'info');
                setTimeout(() => {
                    previewRefreshBtn.style.transform = 'rotate(0deg)';
                }, 500);
            };

            // Update preview when profile selector changes
            profileSelector.addEventListener('change', () => {
                const selectedProfile = profileSelector.value;
                if (selectedProfile && settings.profiles[selectedProfile]) {
                    updatePreview(settings.profiles[selectedProfile]);
                    showToast(`👁️ Previewing "${selectedProfile}"`, 'info');
                } else {
                    updatePreview(null); // Show current settings
                }
            });

            // Initialize preview with current settings
            updatePreview(null);

            // Store update function in modal for external access
            modal.__updatePreview = updatePreview;

            const closeModal = () => { modal.style.display = 'none'; };
            closeBtn.onclick = closeModal;
            closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,0,0,0.3)'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.1)'; };
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

            // Load Profile
            loadProfileBtn.onclick = () => {
                const selectedProfile = profileSelector.value;
                if (!selectedProfile || !settings.profiles[selectedProfile]) {
                    showToast('⚠️ Please select a valid profile!', 'warning');
                    return;
                }

                const profileData = settings.profiles[selectedProfile];
                if (!profileData) {
                    showToast('⚠️ This profile has no saved data!', 'warning');
                    return;
                }

                // تطبيق الإعدادات من الـ profile
                settingsPanel.querySelector('#sub-font-size').value = profileData.fontSize || 17;
                settingsPanel.querySelector('#sub-font-color').value = profileData.fontColor || '#ffffff';
                settingsPanel.querySelector('#sub-bg-color').value = profileData.bgColor || '#000000';
                settingsPanel.querySelector('#sub-bg-toggle').checked = profileData.bgToggle !== false;
                settingsPanel.querySelector('#sub-offsetY').value = profileData.offsetY || 19;
                settingsPanel.querySelector('#sub-delay').value = profileData.delay || 0;
                settingsPanel.querySelector('#sub-bg-opacity').value = profileData.bgOpacity || 0.7;
                settingsPanel.querySelector('#sub-font-family').value = profileData.fontFamily || 'System Default';

                // تحديث العروض
                settingsPanel.querySelector('#sub-offsetY-value').textContent = (profileData.offsetY || 19) + 'px';
                settingsPanel.querySelector('#bg-opacity-value').textContent = Math.round((profileData.bgOpacity || 0.7) * 100) + '%';

                settings.currentProfile = selectedProfile;
                saveSettings();
                applySettings();
                closeModal();
                showToast(`✅ Profile "${selectedProfile}" loaded successfully!`, 'success');
            };

            // Save New Profile
            saveProfileBtn.onclick = () => {
                const profileName = newProfileInput.value.trim();
                if (!profileName) {
                    showToast('⚠️ Please enter a profile name!', 'warning');
                    return;
                }

                if (settings.profiles[profileName]) {
                    if (!confirm(`Profile "${profileName}" already exists. Overwrite?`)) {
                        return;
                    }
                }

                // حفظ الإعدادات الحالية كـ profile جديد
                settings.profiles[profileName] = {
                    fontSize: settingsPanel.querySelector('#sub-font-size').value,
                    fontColor: settingsPanel.querySelector('#sub-font-color').value,
                    bgColor: settingsPanel.querySelector('#sub-bg-color').value,
                    bgToggle: settingsPanel.querySelector('#sub-bg-toggle').checked,
                    offsetY: settingsPanel.querySelector('#sub-offsetY').value,
                    delay: parseInt(settingsPanel.querySelector('#sub-delay').value || 0),
                    bgOpacity: parseFloat(settingsPanel.querySelector('#sub-bg-opacity').value),
                    fontFamily: settingsPanel.querySelector('#sub-font-family').value
                };

                settings.currentProfile = profileName;
                saveSettings();

                // تحديث القائمة
                const option = document.createElement('option');
                option.value = profileName;
                option.textContent = profileName;
                option.selected = true;
                profileSelector.appendChild(option);

                newProfileInput.value = '';
                showToast(`✅ Profile "${profileName}" saved successfully!`, 'success');
            };

            // Delete Profile
            deleteProfileBtn.onclick = () => {
                const selectedProfile = profileSelector.value;
                if (selectedProfile === 'Default') {
                    showToast('⚠️ Cannot delete the Default profile!', 'warning');
                    return;
                }

                if (!confirm(`Are you sure you want to delete profile "${selectedProfile}"?`)) {
                    return;
                }

                delete settings.profiles[selectedProfile];

                // إذا كان الـ profile المحذوف هو الحالي، نرجع للـ Default
                if (settings.currentProfile === selectedProfile) {
                    settings.currentProfile = 'Default';
                }

                saveSettings();

                // إزالة من القائمة
                profileSelector.querySelector(`option[value="${selectedProfile}"]`).remove();
                profileSelector.value = settings.currentProfile;

                showToast(`✅ Profile "${selectedProfile}" deleted!`, 'success');
            };

            return modal;
        }

        function createHelpModal() {
            const modal = document.createElement('div');
            modal.className = 'subtitle-help-modal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(0,0,0,0.75);
                z-index: 100002;
                backdrop-filter: blur(4px);
            `;

            modal.innerHTML = `
    <style>
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .help-content {
        animation: slideUp 0.3s ease;
    }
    .help-tab {
        padding: 8px 16px;
        background: rgba(255,255,255,0.05);
        border: none;
        color: #94a3b8;
        cursor: pointer;
        border-radius: 8px 8px 0 0;
        transition: all 0.2s;
        font-size: 13px;
        margin-right: 4px;
    }
    .help-tab:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
    }
    .help-tab.active {
        background: rgba(34,197,94,0.2);
        color: #22c55e;
        font-weight: bold;
    }
    .help-tab-content {
        display: none;
        padding: 16px;
        background: rgba(255,255,255,0.02);
        border-radius: 0 8px 8px 8px;
        max-height: 380px;
        overflow-y: auto;
    }
    .help-tab-content.active {
        display: block;
    }
    .kbd {
        display: inline-block;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
        color: #fff;
        background: linear-gradient(145deg, #2d3748, #1a202c);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        margin: 0 2px;
    }
    .shortcut-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border-radius: 6px;
        transition: all 0.2s;
        font-size: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .shortcut-row:hover {
        background: rgba(255,255,255,0.05);
    }
    .shortcut-icon {
        font-size: 16px;
        width: 24px;
    }
    .shortcut-keys {
        min-width: 100px;
    }
    .shortcut-desc {
        flex: 1;
        color: #cbd5e1;
        font-size: 12px;
    }
    .edit-shortcut-btn {
        background: rgba(102,126,234,0.2);
        border: 1px solid rgba(102,126,234,0.4);
        color: #667eea;
        padding: 3px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.2s;
    }
    .edit-shortcut-btn:hover {
        background: rgba(102,126,234,0.3);
    }
    .tip-box {
        background: rgba(34,197,94,0.08);
        border-left: 2px solid #22c55e;
        padding: 8px;
        border-radius: 4px;
        margin: 6px 0;
        font-size: 11px;
        line-height: 1.4;
    }
    </style>

    <div class="help-content" style="
        width: min(95vw, 460px);
        background: linear-gradient(225deg, rgba(24, 15, 15, 0.95) 0%, rgba(13, 34, 31, 0.95) 50%, rgba(5, 18, 17, 0.95) 100%);
        color: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        padding: 20px;
        font-family: Arial, sans-serif;
        border: 1px solid rgba(5, 180, 166, 0.4);
    ">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <h2 style="margin:0;font-size:18px;display:flex;align-items:center;gap:8px;">
                <span style="font-size:22px;">📚</span> Help Guide
            </h2>
            <button id="help-modal-close" style="background:rgba(255,255,255,0.1);border:none;color:#fff;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:16px;transition:all 0.2s;">✕</button>
        </div>

        <div style="display:flex;margin-bottom:12px;">
            <button class="help-tab active" data-tab="shortcuts">⌨️ Shortcuts</button>
            <button class="help-tab" data-tab="tips">💡 Tips</button>
            <button class="help-tab" data-tab="contact">📧 Contact</button>
        </div>

        <!-- Shortcuts Tab -->
        <div class="help-tab-content active" id="tab-shortcuts">
            <div class="shortcut-row" data-action="settings">
                <div class="shortcut-icon">⚙️</div>
                <div class="shortcut-keys">
                    <span class="kbd" id="key-settings">${settings.shortcuts?.settings || 'Alt+Q'}</span>
                </div>
                <div class="shortcut-desc">Settings Panel</div>
                <button class="edit-shortcut-btn" data-edit="settings">Edit</button>
            </div>

            <div class="shortcut-row" data-action="upload">
                <div class="shortcut-icon">📤</div>
                <div class="shortcut-keys">
                    <span class="kbd" id="key-upload">${settings.shortcuts?.upload || 'Alt+W'}</span>
                </div>
                <div class="shortcut-desc">Upload Subtitle</div>
                <button class="edit-shortcut-btn" data-edit="upload">Edit</button>
            </div>

            <div class="shortcut-row" data-action="clear">
                <div class="shortcut-icon">🗑️</div>
                <div class="shortcut-keys">
                    <span class="kbd" id="key-clear">${settings.shortcuts?.clear || 'Alt+X'}</span>
                </div>
                <div class="shortcut-desc">Clear Subtitle</div>
                <button class="edit-shortcut-btn" data-edit="clear">Edit</button>
            </div>

            <div class="shortcut-row" data-action="toggleButtons">
                <div class="shortcut-icon">👁️</div>
                <div class="shortcut-keys">
                    <span class="kbd" id="key-toggleButtons">${settings.shortcuts?.toggleButtons || 'Alt+Z'}</span>
                </div>
                <div class="shortcut-desc">Toggle Buttons</div>
                <button class="edit-shortcut-btn" data-edit="toggleButtons">Edit</button>
            </div>

            <div class="shortcut-row" data-action="support">
                <div class="shortcut-icon">❤️</div>
                <div class="shortcut-keys">
                    <span class="kbd" id="key-support">${settings.shortcuts?.support || 'Alt+A'}</span>
                </div>
                <div class="shortcut-desc">Support/Donate</div>
                <button class="edit-shortcut-btn" data-edit="support">Edit</button>
            </div>

            <div class="shortcut-row">
                <div class="shortcut-icon">🚪</div>
                <div class="shortcut-keys">
                    <span class="kbd">Escape</span>
                </div>
                <div class="shortcut-desc">Close Windows</div>
            </div>

            <div style="margin-top:12px;padding:8px;background:rgba(255,193,7,0.1);border-radius:6px;font-size:10px;color:#ffc107;">
                💡 Click "Edit" to customize any shortcut!
            </div>
        </div>

        <!-- Tips Tab -->
        <div class="help-tab-content" id="tab-tips">
            <div class="tip-box">
                <strong>📌</strong> Don't upload subtitle twice on same video
            </div>
            <div class="tip-box">
                <strong>⏱️</strong> Delay in milliseconds (1000ms = 1s)
            </div>
            <div class="tip-box">
                <strong>🎨</strong> Fully customize font, color & size
            </div>
            <div class="tip-box">
                <strong>📍</strong> Position: 0 = bottom, 100 = top
            </div>
            <div class="tip-box">
                <strong>💾</strong> Settings auto-save in browser
            </div>
            <div class="tip-box">
                <strong>🗘</strong> If not working, reload or try another server
            </div>
            <div class="tip-box">
                <strong>🌐</strong> Supports .vtt and .srt files
            </div>
        </div>

        <!-- Contact Tab -->
        <div class="help-tab-content" id="tab-contact">
            <div style="background:rgba(255,255,255,0.05);padding:12px;border-radius:8px;font-size:12px;">
                <div style="margin-bottom:10px;">
                    <strong>📮 Email:</strong><br>
                    <a href="mailto:dashmail0001@gmail.com" style="color:#22c55e;text-decoration:none;">dashmail0001@gmail.com</a>
                </div>
                <div style="margin-bottom:10px;">
                    <strong>🌐 GreasyFork:</strong><br>
                    Subtitle Uploader2
                </div>
                <div style="margin-bottom:10px;">
                    <strong>💝 Support Me:</strong><br>
                    Press <span class="kbd">Alt+A</span> or click Support button
                </div>
                <div>
                    <strong>⭐ Version:</strong> 3.2 by md-dahshan
                </div>
            </div>

            <div style="text-align:center;margin-top:12px;padding:10px;background:rgba(102,126,234,0.1);border-radius:6px;font-size:11px;">
                Made with mddahshan | MIT License
            </div>
        </div>
    </div>
            `;

            const topDoc = getTopDocument();
            topDoc.body.appendChild(modal);

            // Tab switching
            const tabs = modal.querySelectorAll('.help-tab');
            const tabContents = modal.querySelectorAll('.help-tab-content');

            tabs.forEach(tab => {
                tab.onclick = () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    tab.classList.add('active');
                    const tabId = tab.getAttribute('data-tab');
                    modal.querySelector(`#tab-${tabId}`).classList.add('active');
                };
            });

            // Edit shortcut buttons
            modal.querySelectorAll('.edit-shortcut-btn').forEach(btn => {
                btn.onclick = () => {
                    const action = btn.getAttribute('data-edit');
                    const currentKey = settings.shortcuts?.[action] || '';
                    const newKey = prompt(`Enter new shortcut for ${action}\n\nFormat: Alt+Key, Ctrl+Key, Shift+Key\nExamples: Alt+S, Ctrl+K, Shift+Q\n\nCurrent: ${currentKey}`, currentKey);

                    if (newKey && newKey.trim()) {
                        const normalized = newKey.trim();
                        const allShortcuts = Object.values(settings.shortcuts || {});

                        // Validation
                        if (allShortcuts.includes(normalized) && normalized !== currentKey) {
                            alert(`❌ Shortcut "${normalized}" is already in use!`);
                            return;
                        }
                        if (!/^(Alt|Ctrl|Shift)\+[A-Z0-9]$/i.test(normalized)) {
                            alert(`❌ Invalid format! Use format like "Alt+Q" or "Ctrl+K".`);
                            return;
                        }

                        if (!settings.shortcuts) settings.shortcuts = {};
                        settings.shortcuts[action] = normalized;
                        saveSettings();
                        modal.querySelector(`#key-${action}`).textContent = normalized;
                        alert(`✅ Shortcut updated to: ${normalized}\n\nReload the page for changes to take effect.`);
                    }
                };
            });

            const closeBtn = modal.querySelector('#help-modal-close');
            const closeModal = () => { modal.style.display = 'none'; };

            closeBtn.onclick = closeModal;
            closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,0,0,0.3)'; };
            closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.1)'; };

            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            return modal;
        }

        function enhanceSelect(nativeSelect) {
            if (!nativeSelect) return;
            if (nativeSelect.__enhanced) return;
            nativeSelect.__enhanced = true;

            nativeSelect.classList.add('su-hidden-select');

            const wrap = document.createElement('div');
            wrap.className = 'su-select';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'su-select__button';
            btn.setAttribute('aria-haspopup', 'listbox');
            btn.setAttribute('aria-expanded', 'false');

            const label = document.createElement('span');
            label.textContent = nativeSelect.options[nativeSelect.selectedIndex]?.text || 'Choose';

            const arrow = document.createElement('span');
            arrow.className = 'su-select__arrow';
            arrow.textContent = '▾';

            btn.appendChild(label);
            btn.appendChild(arrow);

            const menu = document.createElement('div');
            menu.className = 'su-select__menu';
            menu.setAttribute('role', 'listbox');
            menu.tabIndex = -1;

            function buildOptions() {
                menu.innerHTML = '';
                Array.from(nativeSelect.options).forEach((opt, idx) => {
                    const item = document.createElement('div');
                    item.className = 'su-select__option';
                    item.setAttribute('role', 'option');
                    item.setAttribute('data-value', opt.value);
                    item.textContent = opt.text;
                    if (idx === nativeSelect.selectedIndex) {
                        item.setAttribute('aria-selected', 'true');
                    }
                    item.onclick = () => {
                        nativeSelect.value = opt.value;
                        nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        label.textContent = opt.text;
                        closeMenu();
                    };
                    menu.appendChild(item);
                });
            }

            function openMenu() {
                buildOptions();
                menu.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                arrow.style.transform = 'rotate(180deg)';
            }
            function closeMenu() {
                menu.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
                arrow.style.transform = 'rotate(0deg)';
            }
            function toggleMenu() {
                if (menu.classList.contains('open')) closeMenu(); else openMenu();
            }

            btn.onclick = toggleMenu;
            document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) closeMenu(); });

            // Keyboard accessibility
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); openMenu(); menu.focus();
                }
            });
            menu.addEventListener('keydown', (e) => {
                const options = Array.from(menu.querySelectorAll('.su-select__option'));
                const current = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
                if (e.key === 'Escape') { e.preventDefault(); closeMenu(); btn.focus(); }
                if (e.key === 'ArrowDown') { e.preventDefault(); (options[Math.min(current + 1, options.length - 1)]||{}).focus?.(); }
                if (e.key === 'ArrowUp') { e.preventDefault(); (options[Math.max(current - 1, 0)]||{}).focus?.(); }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const focused = document.activeElement?.classList?.contains('su-select__option') ? document.activeElement : options[current];
                    focused?.click(); btn.focus();
                }
            });

            nativeSelect.parentElement.insertBefore(wrap, nativeSelect);
            wrap.appendChild(btn);
            wrap.appendChild(menu);
            wrap.appendChild(nativeSelect);

            nativeSelect.addEventListener('change', () => {
                label.textContent = nativeSelect.options[nativeSelect.selectedIndex]?.text || 'Choose';
            });
        }

        // Advanced Subtitle Analysis Function
        function analyzeSubtitleFile(fileContent, fileName) {
            const lines = fileContent.split('\n').map(l => l.trim());
            const subtitles = [];
            let currentSub = { index: 0, start: '', end: '', text: '' };
            let lineNumber = 0;

            // Parse subtitles
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                lineNumber = i + 1;

                // Match timing line - support both formats:
                // HH:MM:SS.mmm --> HH:MM:SS.mmm (with hours)
                // MM:SS.mmm --> MM:SS.mmm (without hours)
                const timeMatch = line.match(/((?:\d{1,2}:)?\d{1,2}:\d{2}[.,]\d{2,3})\s*-->\s*((?:\d{1,2}:)?\d{1,2}:\d{2}[.,]\d{2,3})/);
                if (timeMatch) {
                    if (currentSub.text) {
                        subtitles.push({...currentSub});
                        currentSub = { index: subtitles.length, start: '', end: '', text: '' };
                    }
                    currentSub.start = timeMatch[1].replace(',', '.');
                    currentSub.end = timeMatch[2].replace(',', '.');
                    currentSub.lineNumber = lineNumber;
                } else if (line && !line.match(/^\d+$/) && !line.match(/^WEBVTT/i) && !line.match(/^NOTE/i)) {
                    // Accumulate text (skip numbers, WEBVTT header, and NOTE lines)
                    currentSub.text += (currentSub.text ? '\n' : '') + line;
                }
            }

            // Add last subtitle
            if (currentSub.text) {
                subtitles.push(currentSub);
            }

            // Analysis calculations
            const issues = [];
            const warnings = [];
            const suggestions = [];

            // Calculate statistics
            let totalChars = 0;
            let maxLength = 0;
            let maxLengthLine = 0;
            let multiLineCount = 0;
            let overlaps = 0;
            let longGaps = [];
            let shortDisplays = [];

            subtitles.forEach((sub, idx) => {
                // Skip if no valid timestamps
                if (!sub.start || !sub.end) {
                    warnings.push(`Line #${idx + 1}: Missing timestamp`);
                    return;
                }

                const textLength = sub.text.length;
                totalChars += textLength;

                // Check max length
                if (textLength > maxLength) {
                    maxLength = textLength;
                    maxLengthLine = idx + 1;
                }

                // Check if too long
                if (textLength > 100) {
                    issues.push(`Line #${idx + 1}: Text too long (${textLength} chars)`);
                }

                // Check multi-line
                if (sub.text.includes('\n')) {
                    multiLineCount++;
                }

                // Check timing
                const startTime = parseTimestamp(sub.start);
                const endTime = parseTimestamp(sub.end);
                const duration = endTime - startTime;

                // Validate timing
                if (startTime === 0 && endTime === 0) {
                    warnings.push(`Line #${idx + 1}: Invalid timestamp format`);
                    return;
                }

                // Check display duration
                if (duration < 1000) {
                    shortDisplays.push(idx + 1);
                    warnings.push(`Line #${idx + 1}: Very short display (<1 sec)`);
                }

                // Check overlaps with next subtitle
                if (idx < subtitles.length - 1) {
                    const nextSub = subtitles[idx + 1];
                    if (!nextSub.start) return; // Skip if next has no timestamp

                    const nextStartTime = parseTimestamp(nextSub.start);
                    if (nextStartTime < endTime) {
                        overlaps++;
                        issues.push(`Line #${idx + 1}: Overlaps with next subtitle`);
                    }

                    // Check gaps
                    const gap = nextStartTime - endTime;
                    if (gap > 5000) {
                        longGaps.push({ line: idx + 1, gap: Math.round(gap / 1000) });
                        warnings.push(`Line #${idx + 1}: Long gap (${Math.round(gap / 1000)}s) before next`);
                    }
                }
            });

            // Calculate reading speed
            const avgLength = subtitles.length > 0 ? totalChars / subtitles.length : 0;
            const firstTime = subtitles[0] ? parseTimestamp(subtitles[0].start) : 0;
            const lastTime = subtitles[subtitles.length - 1] ? parseTimestamp(subtitles[subtitles.length - 1].end) : 0;
            const totalDuration = (lastTime - firstTime) / 1000; // in seconds
            const readingSpeed = totalDuration > 0 ? totalChars / totalDuration : 0;

            // Detect language (simple detection)
            const sampleText = subtitles.slice(0, 10).map(s => s.text).join(' ');
            const arabicChars = (sampleText.match(/[\u0600-\u06FF]/g) || []).length;
            const totalSampleChars = sampleText.length;
            const arabicPercentage = totalSampleChars > 0 ? (arabicChars / totalSampleChars) * 100 : 0;

            const language = arabicPercentage > 30 ? 'Arabic (العربية)' : 'English/Other';
            const direction = arabicPercentage > 30 ? 'RTL' : 'LTR';

            // Reading speed evaluation
            let readingSpeedStatus = 'Perfect ✓';
            if (readingSpeed < 12) readingSpeedStatus = 'Too Slow ⚠️';
            else if (readingSpeed > 25) readingSpeedStatus = 'Too Fast ⚠️';

            // Add suggestions
            if (maxLength > 100) {
                suggestions.push(`Consider splitting line #${maxLengthLine}`);
            }
            if (longGaps.length > 5) {
                suggestions.push(`Review timing gaps for better sync`);
            }

            return {
                fileName: fileName,
                fileSize: (fileContent.length / 1024).toFixed(1) + ' KB',
                totalLines: subtitles.length,
                firstStart: subtitles[0]?.start || 'N/A',
                lastEnd: subtitles[subtitles.length - 1]?.end || 'N/A',
                duration: formatDuration(totalDuration),
                avgLength: Math.round(avgLength),
                maxLength: maxLength,
                maxLengthLine: maxLengthLine,
                multiLineCount: multiLineCount,
                multiLinePercent: subtitles.length > 0 ? ((multiLineCount / subtitles.length) * 100).toFixed(1) : 0,
                readingSpeed: readingSpeed.toFixed(1),
                readingSpeedStatus: readingSpeedStatus,
                language: language,
                direction: direction,
                languageConfidence: arabicPercentage > 30 ? arabicPercentage.toFixed(1) : (100 - arabicPercentage).toFixed(1),
                overlaps: overlaps,
                longGaps: longGaps.length,
                shortDisplays: shortDisplays.length,
                issues: issues,
                warnings: warnings,
                suggestions: suggestions,
                subtitles: subtitles,
                totalChars: totalChars
            };
        }

        // Helper function to parse timestamp to milliseconds
        function parseTimestamp(timestamp) {
            if (!timestamp || typeof timestamp !== 'string') return 0;

            // Clean and normalize timestamp
            timestamp = timestamp.trim().replace(',', '.');

            const parts = timestamp.split(':');
            if (parts.length < 2) return 0;

            let hours = 0;
            let minutes = 0;
            let seconds = 0;
            let ms = 0;

            // Handle different formats:
            // HH:MM:SS.mmm (3 parts with hours)
            // MM:SS.mmm (2 parts, no hours)
            if (parts.length === 3) {
                // HH:MM:SS.mmm
                hours = parseInt(parts[0]) || 0;
                minutes = parseInt(parts[1]) || 0;
                if (parts[2]) {
                    const secondsParts = parts[2].split(/[.,]/);
                    seconds = parseInt(secondsParts[0]) || 0;
                    if (secondsParts[1]) {
                        const msStr = secondsParts[1].padEnd(3, '0').substring(0, 3);
                        ms = parseInt(msStr) || 0;
                    }
                }
            } else if (parts.length === 2) {
                // MM:SS.mmm (no hours)
                minutes = parseInt(parts[0]) || 0;
                if (parts[1]) {
                    const secondsParts = parts[1].split(/[.,]/);
                    seconds = parseInt(secondsParts[0]) || 0;
                    if (secondsParts[1]) {
                        const msStr = secondsParts[1].padEnd(3, '0').substring(0, 3);
                        ms = parseInt(msStr) || 0;
                    }
                }
            }

            return (hours * 3600 + minutes * 60 + seconds) * 1000 + ms;
        }

        // Helper function to format duration
        function formatDuration(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Save last used subtitle to localStorage
        function saveLastUsed(filename, content) {
            try {
                localStorage.setItem('__last_subtitle__', JSON.stringify({
                    filename: filename,
                    content: content,
                    timestamp: Date.now()
                }));
                // Reload the UI if available
                if (typeof window.__loadLastUsedSubtitle === 'function') {
                    window.__loadLastUsedSubtitle();
                }
            } catch (e) {
                console.error('Failed to save last subtitle:', e);
            }
        }

        function handleSubtitleFile(file) {
            if (!__currentTargetVideo) {
                showToast('❌ No video detected on page', 'error');
                return;
            }
            if (!file) return;

            const reader = new FileReader();
            reader.onerror = () => {
                showToast('❌ Failed to read file', 'error');
            };
            reader.onload = () => {
                try {
                    let text = reader.result;
                    if (typeof text !== 'string') text = String(text || '');

                    // Convert SRT to VTT if needed
                    let originalText = text;
                    if (file.name.toLowerCase().endsWith('.srt')) {
                        text = 'WEBVTT\n\n' + text
                            .replace(/\r+/g, '')
                            .replace(/(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g, '$2 --> $3')
                            .replace(/,/g, '.');
                    }

                    // Analyze subtitle
                    const analysis = analyzeSubtitleFile(originalText, file.name);

                    // Show preview and analysis
                    showSubtitlePreview(analysis, text, file);
                } catch (err) {
                    showToast('❌ Error processing file: ' + err.message, 'error');
                }
            };
            reader.readAsText(file);
        }

        // Show advanced preview
        function showSubtitlePreview(analysis, vttContent, file) {
            const dropZone = uploadModal.querySelector('#su-drop-zone');
            const previewSection = uploadModal.querySelector('#su-preview-section');
            const analysisResults = uploadModal.querySelector('#su-analysis-results');
            const visualPreview = uploadModal.querySelector('#su-visual-preview');
            const actionButtons = uploadModal.querySelector('#su-action-buttons');
            const lastUsedSection = uploadModal.querySelector('#su-last-used');

            if (!dropZone || !previewSection || !analysisResults || !visualPreview || !actionButtons) {
                showToast('❌ Modal elements not found', 'error');
                return;
            }

            // Hide drop zone and last used section, show preview and buttons
            dropZone.style.display = 'none';
            if (lastUsedSection) lastUsedSection.style.display = 'none';
            previewSection.style.display = 'block';
            actionButtons.style.display = 'flex';

            // Build visual preview FIRST (at top)
            buildVisualPreview(analysis, visualPreview);

            // Then analysis results BELOW
            analysisResults.innerHTML = `
                <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;margin-top:10px;">
                    <div style="font-size:13px;font-weight:bold;color:#22c55e;margin-bottom:8px;text-align:center;">📊 SUBTITLE ANALYSIS</div>

                    <!-- Grid Layout -->
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px;">
                        <!-- Cell 1: File -->
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;text-align:center;">
                            <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">File</div>
                            <div style="font-size:10px;color:#fff;font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${analysis.fileName}">${analysis.fileName.length > 10 ? analysis.fileName.substring(0,10) + '...' : analysis.fileName}</div>
                        </div>

                        <!-- Cell 2: Size -->
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;text-align:center;">
                            <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">Size</div>
                            <div style="font-size:10px;color:#fff;font-weight:bold;">${analysis.fileSize}</div>
                        </div>

                        <!-- Cell 3: Lines -->
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;text-align:center;">
                            <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">Lines</div>
                            <div style="font-size:10px;color:#fff;font-weight:bold;">${analysis.totalLines}</div>
                        </div>

                        <!-- Cell 4: Time -->
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;text-align:center;">
                            <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">Time</div>
                            <div style="font-size:10px;color:#fff;font-weight:bold;">${analysis.duration}</div>
                        </div>

                        <!-- Cell 5: Language -->
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;text-align:center;">
                            <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">Lang</div>
                            <div style="font-size:10px;color:#fff;font-weight:bold;">${analysis.language}</div>
                        </div>

                        <!-- Cell 6: Direction -->
                        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:6px;text-align:center;">
                            <div style="font-size:10px;color:#94a3b8;margin-bottom:2px;">Dir</div>
                            <div style="font-size:10px;color:#fff;font-weight:bold;">${analysis.direction}</div>
                        </div>
                    </div>

                    <!-- Confidence Badge -->
                    <div style="text-align:center;font-size:9px;color:#22c55e;font-weight:bold;">
                        ${analysis.languageConfidence}% Confidence
                    </div>
                </div>
            `;

            // Setup buttons
            const applyBtn = uploadModal.querySelector('#su-apply-btn');
            const cancelBtn = uploadModal.querySelector('#su-cancel-preview');

            applyBtn.onclick = () => {
                const blob = new Blob([vttContent], { type: 'text/vtt' });
                const url = URL.createObjectURL(blob);
                uploadModal.style.display = 'none';
                attachSubtitle(__currentTargetVideo, url);
                applySettings();

                // Save last used subtitle
                saveLastUsed(file.name, vttContent);

                // Show success notification
                showToast('✅ Subtitle loaded successfully');

                // Reset modal
                dropZone.style.display = 'block';
                previewSection.style.display = 'none';
                actionButtons.style.display = 'none';
                // Reload last used to show it again
                if (typeof window.__loadLastUsedSubtitle === 'function') {
                    window.__loadLastUsedSubtitle();
                }
            };

            cancelBtn.onclick = () => {
                dropZone.style.display = 'block';
                previewSection.style.display = 'none';
                actionButtons.style.display = 'none';
                // Reload last used to show it again
                if (typeof window.__loadLastUsedSubtitle === 'function') {
                    window.__loadLastUsedSubtitle();
                }
            };
        }

        // Build visual preview with navigation
        function buildVisualPreview(analysis, container) {
            if (analysis.subtitles.length === 0) {
                container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:20px;">No subtitles to preview</div>';
                return;
            }

            let currentIndex = 0;
            let searchResults = [];
            let currentSearchIndex = 0;

            const updatePreview = () => {
                const sub = analysis.subtitles[currentIndex];
                const currentSettings = {
                    fontSize: document.querySelector('#sub-font-size')?.value || 17,
                    fontColor: document.querySelector('#sub-font-color')?.value || '#ffffff',
                    bgColor: document.querySelector('#sub-bg-color')?.value || '#000000',
                    bgToggle: document.querySelector('#sub-bg-toggle')?.checked !== false,
                    bgOpacity: document.querySelector('#sub-bg-opacity')?.value || 0.7
                };

                const rgb = hexToRgba(currentSettings.bgColor, currentSettings.bgOpacity);

                // Calculate stats
                const startTime = parseTimestamp(sub.start);
                const endTime = parseTimestamp(sub.end);
                const duration = ((endTime - startTime) / 1000).toFixed(3);
                const charCount = sub.text.length;
                const charsPerSec = (charCount / parseFloat(duration)).toFixed(1);
                const speedStatus = charsPerSec < 15 ? '🐢 Slow' : charsPerSec > 25 ? '🏃 Fast' : '✓ Good';

                // Calculate timeline position
                const totalDuration = parseTimestamp(analysis.lastEnd);
                const currentPosition = startTime;
                const percentage = (currentPosition / totalDuration) * 100;

                container.innerHTML = `
                    <div style="background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;margin-top:10px;">
                        <!-- Header -->
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <div style="font-size:12px;font-weight:bold;color:#22c55e;">👁️ VISUAL PREVIEW</div>
                            <button id="settings-hint" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#94a3b8;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:10px;">⚙️ Live</button>
                        </div>

                        <!-- Video-like preview area -->
                        <div style="background:#000;border-radius:8px;padding:30px 15px;min-height:100px;display:flex;align-items:center;justify-content:center;position:relative;margin-bottom:12px;box-shadow:0 4px 15px rgba(0,0,0,0.5);">
                            <div style="text-align:center;max-width:90%;">
                                <span style="
                                    color:${currentSettings.fontColor};
                                    font-size:${currentSettings.fontSize}px;
                                    background:${currentSettings.bgToggle ? rgb : 'transparent'};
                                    padding:8px 16px;
                                    border-radius:${currentSettings.bgToggle ? '20px' : '0'};
                                    display:inline-block;
                                    font-weight:600;
                                    box-shadow:${currentSettings.bgToggle ? '0 4px 12px rgba(0,0,0,0.4)' : 'none'};
                                    line-height:1.5;
                                    white-space:pre-wrap;
                                ">${sub.text}</span>
                            </div>
                        </div>

                        <!-- Stats Bar -->
                        <div style="background:rgba(255,255,255,0.03);border-radius:6px;padding:8px;margin-bottom:10px;font-size:10px;display:flex;justify-content:space-around;text-align:center;">
                            <div>
                                <div style="color:#94a3b8;font-size:8px;">Time</div>
                                <div style="color:#22c55e;font-weight:bold;">${sub.start} → ${sub.end}</div>
                                <div style="color:#94a3b8;font-size:8px;">${duration}s</div>
                            </div>
                            <div style="border-left:1px solid rgba(255,255,255,0.1);"></div>
                            <div>
                                <div style="color:#94a3b8;font-size:8px;">Characters</div>
                                <div style="color:#3b82f6;font-weight:bold;">${charCount}</div>
                                <div style="color:#94a3b8;font-size:8px;">${charsPerSec} c/s</div>
                            </div>
                            <div style="border-left:1px solid rgba(255,255,255,0.1);"></div>
                            <div>
                                <div style="color:#94a3b8;font-size:8px;">Speed</div>
                                <div style="color:#fbbf24;font-weight:bold;">${speedStatus}</div>
                            </div>
                        </div>

                        <!-- Timeline Scrubber -->
                        <div style="margin-bottom:10px;">
                            <div style="display:flex;justify-content:space-between;font-size:8px;color:#94a3b8;margin-bottom:4px;">
                                <span>00:00:00</span>
                                <span style="color:#22c55e;">↓ Current</span>
                                <span>${analysis.duration}</span>
                            </div>
                            <div style="background:rgba(255,255,255,0.1);height:6px;border-radius:3px;position:relative;cursor:pointer;" id="timeline-bar">
                                <div style="background:linear-gradient(90deg, #3b82f6, #22c55e);height:100%;width:${percentage}%;border-radius:3px;"></div>
                                <div style="position:absolute;top:50%;left:${percentage}%;transform:translate(-50%,-50%);width:12px;height:12px;background:#22c55e;border:2px solid #000;border-radius:50%;"></div>
                            </div>
                        </div>

                        <!-- Main Navigation -->
                        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-bottom:8px;">
                            <button id="first-sub" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#3b82f6;padding:6px;border-radius:6px;cursor:pointer;font-size:10px;" ${currentIndex === 0 ? 'disabled' : ''}>⏮️</button>
                            <button id="prev-sub" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#3b82f6;padding:6px;border-radius:6px;cursor:pointer;font-size:10px;" ${currentIndex === 0 ? 'disabled' : ''}>◀</button>
                            <button id="goto-sub" style="background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.4);color:#a855f7;padding:6px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:bold;">${currentIndex + 1}/${analysis.subtitles.length}</button>
                            <button id="next-sub" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#3b82f6;padding:6px;border-radius:6px;cursor:pointer;font-size:10px;" ${currentIndex === analysis.subtitles.length - 1 ? 'disabled' : ''}>▶</button>
                            <button id="last-sub" style="background:rgba(59,130,246,0.2);border:1px solid rgba(59,130,246,0.4);color:#3b82f6;padding:6px;border-radius:6px;cursor:pointer;font-size:10px;" ${currentIndex === analysis.subtitles.length - 1 ? 'disabled' : ''}>⏭️</button>
                        </div>

                        <!-- Search Bar -->
                        <div style="display:flex;gap:4px;align-items:center;">
                            <span style="font-size:10px;color:#94a3b8;display:inline-flex;align-items:center;">
                                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" style="display:block;">
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                                </svg>
                            </span>
                            <input type="text" id="search-input" placeholder="Search subtitle text..." style="flex:1;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;padding:6px 8px;border-radius:6px;font-size:10px;" value="${searchResults.length > 0 ? 'Found: ' + searchResults.length : ''}">
                            <button id="search-btn" style="background:rgba(34,197,94,0.2);border:1px solid rgba(34,197,94,0.4);color:#22c55e;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:10px;">Search</button>
                        </div>

                        ${searchResults.length > 0 ? `
                        <div style="margin-top:6px;font-size:9px;color:#22c55e;text-align:center;">
                            Found ${searchResults.length} result(s) • Showing result ${currentSearchIndex + 1}
                            <button id="next-result" style="background:none;border:none;color:#3b82f6;cursor:pointer;text-decoration:underline;margin-left:5px;">Next →</button>
                        </div>
                        ` : ''}

                        <div style="margin-top:8px;font-size:8px;color:#64748b;text-align:center;">
                            ⌨️ Tip: Use ← → keys to navigate • Preview updates with your settings
                        </div>
                    </div>
                `;

                // Attach navigation events
                const firstBtn = container.querySelector('#first-sub');
                const prevBtn = container.querySelector('#prev-sub');
                const gotoBtn = container.querySelector('#goto-sub');
                const nextBtn = container.querySelector('#next-sub');
                const lastBtn = container.querySelector('#last-sub');
                const searchBtn = container.querySelector('#search-btn');
                const searchInput = container.querySelector('#search-input');
                const nextResultBtn = container.querySelector('#next-result');

                if (firstBtn) firstBtn.onclick = () => {
                    currentIndex = 0;
                    updatePreview();
                };

                if (prevBtn) prevBtn.onclick = () => {
                    if (currentIndex > 0) {
                        currentIndex--;
                        updatePreview();
                    }
                };

                if (gotoBtn) gotoBtn.onclick = () => {
                    const line = prompt(`Go to subtitle (1-${analysis.subtitles.length}):`, currentIndex + 1);
                    if (line) {
                        const num = parseInt(line);
                        if (num >= 1 && num <= analysis.subtitles.length) {
                            currentIndex = num - 1;
                            updatePreview();
                        }
                    }
                };

                if (nextBtn) nextBtn.onclick = () => {
                    if (currentIndex < analysis.subtitles.length - 1) {
                        currentIndex++;
                        updatePreview();
                    }
                };

                if (lastBtn) lastBtn.onclick = () => {
                    currentIndex = analysis.subtitles.length - 1;
                    updatePreview();
                };

                if (searchBtn && searchInput) {
                    searchBtn.onclick = () => {
                        const query = searchInput.value.trim().toLowerCase();
                        if (query && !searchInput.value.startsWith('Found:')) {
                            searchResults = [];
                            analysis.subtitles.forEach((s, i) => {
                                if (s.text.toLowerCase().includes(query)) {
                                    searchResults.push(i);
                                }
                            });
                            currentSearchIndex = 0;
                            if (searchResults.length > 0) {
                                currentIndex = searchResults[0];
                            }
                            updatePreview();
                        }
                    };

                    searchInput.onkeypress = (e) => {
                        if (e.key === 'Enter') searchBtn.click();
                    };
                }

                if (nextResultBtn) {
                    nextResultBtn.onclick = () => {
                        currentSearchIndex = (currentSearchIndex + 1) % searchResults.length;
                        currentIndex = searchResults[currentSearchIndex];
                        updatePreview();
                    };
                }

                // Timeline interaction
                const timelineBar = container.querySelector('#timeline-bar');
                if (timelineBar) {
                    const handleTimelineClick = (e) => {
                        const rect = timelineBar.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = (clickX / rect.width) * 100;
                        const targetIndex = Math.floor((percentage / 100) * analysis.subtitles.length);

                        if (targetIndex >= 0 && targetIndex < analysis.subtitles.length) {
                            currentIndex = targetIndex;
                            updatePreview();
                        }
                    };

                    // Click event
                    timelineBar.onclick = handleTimelineClick;

                    // Smooth drag support with step-by-step movement
                    let isDragging = false;
                    let lastMouseX = 0;
                    let accumulatedDelta = 0;
                    const pixelsPerStep = 0.3; // كل 15 بكسل = subtitle واحد

                    timelineBar.onmousedown = (e) => {
                        isDragging = true;
                        lastMouseX = e.clientX;
                        accumulatedDelta = 0;
                        timelineBar.style.cursor = 'grabbing';
                    };

                    document.addEventListener('mousemove', (e) => {
                        if (isDragging) {
                            const deltaX = e.clientX - lastMouseX;
                            accumulatedDelta += deltaX;
                            lastMouseX = e.clientX;

                            // حساب عدد الخطوات المطلوبة
                            const steps = Math.floor(Math.abs(accumulatedDelta) / pixelsPerStep);

                            if (steps > 0) {
                                const direction = accumulatedDelta > 0 ? 1 : -1;
                                const newIndex = currentIndex + (direction * steps);

                                // تطبيق الحدود
                                if (newIndex >= 0 && newIndex < analysis.subtitles.length && newIndex !== currentIndex) {
                                    currentIndex = newIndex;
                                    updatePreview();

                                    // إعادة ضبط التراكم
                                    accumulatedDelta = accumulatedDelta % pixelsPerStep;
                                }
                            }
                        }
                    });

                    document.addEventListener('mouseup', () => {
                        if (isDragging) {
                            isDragging = false;
                            accumulatedDelta = 0;
                            timelineBar.style.cursor = 'pointer';
                        }
                    });
                }

                // Keyboard shortcuts
                document.addEventListener('keydown', handleKeyboard);
            };

            const handleKeyboard = (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    currentIndex--;
                    updatePreview();
                    e.preventDefault();
                } else if (e.key === 'ArrowRight' && currentIndex < analysis.subtitles.length - 1) {
                    currentIndex++;
                    updatePreview();
                    e.preventDefault();
                } else if (e.key === 'Home') {
                    currentIndex = 0;
                    updatePreview();
                    e.preventDefault();
                } else if (e.key === 'End') {
                    currentIndex = analysis.subtitles.length - 1;
                    updatePreview();
                    e.preventDefault();
                }
            };

            updatePreview();
        }

    function applySettings() {
            const size = document.querySelector('#sub-font-size').value || 30;
            const color = document.querySelector('#sub-font-color').value || '#fff';
            const bg = document.querySelector('#sub-bg-color').value || '#000';
            const bgToggle = document.querySelector('#sub-bg-toggle').checked;
            const offsetY = parseFloat(document.querySelector('#sub-offsetY').value || 85);
            const delay = parseInt(document.querySelector('#sub-delay').value || 0);
            const opacity = parseFloat(document.querySelector('#sub-bg-opacity').value || 0.7);
            let fontFamily = (document.querySelector('#sub-font-family')?.value || 'System Default');
            if (fontFamily && fontFamily.startsWith('#_')) fontFamily = fontFamily.replace(/^#_/, '');

            ensureFontLoaded(fontFamily);

            // --- Invert Color for Numbers Logic ---
            const invertColor = (hex) => {
                // Remove # if present
                hex = hex.replace('#', '');
                // Convert to RGB
                const r = parseInt(hex.slice(0, 2), 16);
                const g = parseInt(hex.slice(2, 4), 16);
                const b = parseInt(hex.slice(4, 6), 16);
                // Invert
                const invR = (255 - r).toString(16).padStart(2, '0');
                const invG = (255 - g).toString(16).padStart(2, '0');
                const invB = (255 - b).toString(16).padStart(2, '0');
                return `#${invR}${invG}${invB}`;
            };

            let numberColor = invertColor(color);

            // استثناء: إذا كان اللون المعكوس أسود أو قريب جداً من الأسود، استخدم الذهبي
            const invertedR = parseInt(numberColor.slice(1, 3), 16);
            const invertedG = parseInt(numberColor.slice(3, 5), 16);
            const invertedB = parseInt(numberColor.slice(5, 7), 16);

            if (invertedR < 30 && invertedG < 30 && invertedB < 30) {
                numberColor = '#FFD700'; // Gold color as fallback
            }
            // --- End of Invert Logic ---



            const css = `
    /* Hide original subtitles completely */
    video::cue, video::-webkit-media-text-track-display, ::cue {
        color: transparent !important;
        background: transparent !important;
        text-shadow: none !important;
        font-size: 0px !important;
    }

    /* تنسيقات النص الذكي */
    .smart-text {
        font-feature-settings: "kern" 1, "liga" 1 !important;
        text-rendering: optimizeLegibility !important;
    }

    .smart-text b {
        font-weight: 700 !important;
    }

    .smart-text i {
        font-style: italic !important;
    }

    .smart-text .highlight {
        color: #ffd700 !important;
        font-weight: bold !important;
        text-shadow: 0 0 3px rgba(255, 215, 0, 0.3) !important;
    }

    .smart-text a {
        color: inherit !important;
        text-decoration: none !important;
        border-bottom: 1px dotted currentColor !important;
    }

    .smart-text[dir="rtl"] {
        font-feature-settings: "kern" 1, "liga" 1, "rlig" 1, "rclt" 1, "calt" 1 !important;
    }

    /* Custom subtitle overlay styles */
    .custom-subtitle-overlay {
    position: absolute !important;
    bottom: 85px;
    left: 50% !important;
    transform: translateX(-50%) !important;
    z-index: 100000 !important;
    pointer-events: none !important;
    text-align: center !important;
    max-width: 90% !important;
    }

    .custom-subtitle-overlay .subtitle-text {
    color: ${color} !important;
    font-size: ${size}px !important;
    ${fontFamily !== 'System Default' ? `font-family: '${fontFamily}', sans-serif !important;` : ''}
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8) !important;
    line-height: 1.4 !important;
    font-weight: 600 !important;
    background-color: ${bgToggle ? hexToRgba(bg, opacity) : 'transparent'} !important;
    border-radius: 35px !important;
    padding: 8px 16px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
    display: inline-block !important;
    margin: 2px !important;
    transition: all 0.3s ease !important;
    }

    .custom-subtitle-overlay .subtitle-number {
    color: ${numberColor} !important;
    font-weight: bold !important;
    }
    `;
            style.textContent = css;

            // Create custom subtitle overlays for all videos
            setTimeout(() => {
                document.querySelectorAll('video').forEach(video => {
                    createCustomSubtitleOverlay(video, color, size, fontFamily, bg, opacity, offsetY);
                });
            }, 100);

            // Helper: stable id for each video
            let __videoIdSeq = 1;
            function ensureVideoId(video) {
                if (!video.dataset.__suId) {
                    video.dataset.__suId = String(__videoIdSeq++);
                }
                return video.dataset.__suId;
            }

            function positionOverlayForVideo(video, overlay, offsetY) {
                const isFull = !!document.fullscreenElement;
                const rect = video.getBoundingClientRect();

                // Check if we're on YouTube
                const isYouTube = window.location.hostname.includes('youtube.com');

                // For YouTube in normal mode, we need to position relative to the video container
                let scrollTop, scrollLeft, centerX, baselineY;

                if (isFull) {
                    // Fullscreen mode - position fixed relative to viewport
                    scrollTop = 0;
                    scrollLeft = 0;
                    centerX = rect.left + (rect.width / 2);
                    overlay.style.position = 'fixed';
                } else if (isYouTube) {
                    // YouTube normal mode - position relative to video player
                    const playerContainer = video.closest('.html5-video-player') || video.parentElement;
                    const containerRect = playerContainer ? playerContainer.getBoundingClientRect() : rect;

                    scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
                    scrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
                    centerX = containerRect.left + scrollLeft + (containerRect.width / 2);
                    overlay.style.position = 'absolute';
                } else {
                    // Other sites - standard positioning
                    scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
                    scrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
                    centerX = rect.left + scrollLeft + (rect.width / 2);
                    overlay.style.position = 'absolute';
                }

                const val = Number(offsetY || 0);
                const isPercent = val >= 0 && val <= 100;
                const padding = 8;
                const innerHeight = Math.max(0, rect.height - 2 * padding);
                const desiredY = isPercent
                    ? (rect.bottom + scrollTop - (val / 100) * innerHeight - padding)
                    : (rect.bottom + scrollTop - val);
                const minY = rect.top + scrollTop + padding;
                const maxY = rect.bottom + scrollTop - padding;
                baselineY = Math.max(minY, Math.min(maxY, desiredY));

                overlay.style.left = `${centerX}px`;
                overlay.style.top = `${baselineY}px`;
                overlay.style.transform = 'translate(-50%, -100%)';
                const maxW = Math.max(50, Math.floor(rect.width * 0.9));
                overlay.style.maxWidth = `${maxW}px`;
            }

            // Function to process text for Karaoke mode
            function processKaraokeText(text, duration, effect, speed) {
                // Remove HTML tags first
                const plainText = text.replace(/<[^>]*>/g, '');

                // Detect if text contains Arabic characters
                const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(plainText);

                // Split into words
                let words = plainText.split(/\s+/).filter(w => w.length > 0);

                if (words.length === 0) return text;

                // Calculate delay per word based on duration and speed
                const totalDuration = duration * 1000; // Convert to milliseconds
                const delayPerWord = (totalDuration / words.length) / speed;

                // For Arabic, we need to handle both visual order and animation timing
                let processedWords;
                if (hasArabic) {
                    // For Arabic RTL: keep logical order; container is RTL so visual order is right-to-left.
                    // Animate starting from the first word (rightmost visually) with delay 0.
                    processedWords = words.map((word, index) => {
                        const animationDelay = (delayPerWord * index) / 1000;
                        const animationDuration = (delayPerWord / 1000) * 1.5;
                        return `<span class="karaoke-word" style="animation: karaoke${effect.charAt(0).toUpperCase() + effect.slice(1)} ${animationDuration}s ease-in-out ${animationDelay}s forwards;">${word}</span>`;
                    }).join(' ');
                } else {
                    // For LTR languages: animate from left to right
                    processedWords = words.map((word, index) => {
                        const animationDelay = (delayPerWord * index) / 1000;
                        const animationDuration = (delayPerWord / 1000) * 1.5;
                        return `<span class="karaoke-word" style="animation: karaoke${effect.charAt(0).toUpperCase() + effect.slice(1)} ${animationDuration}s ease-in-out ${animationDelay}s forwards;">${word}</span>`;
                    }).join(' ');
                }

                // Return just the processed words, direction will be handled at container level
                return processedWords;
            }

            // Function to create custom subtitle overlay
            function createCustomSubtitleOverlay(video, color, size, fontFamily, bg, opacity, offsetY) {
                const vidId = ensureVideoId(video);
                const existingOverlay = document.querySelector(`.custom-subtitle-overlay[data-video-id="${vidId}"]`);
                if (existingOverlay) existingOverlay.remove();

                const overlay = document.createElement('div');
                overlay.className = 'custom-subtitle-overlay';
                overlay.dataset.videoId = vidId;
                overlay.style.cssText = `
                    position: absolute;
                    left: 0; top: 0;
                    z-index: 100000;
                    pointer-events: auto;
                    text-align: center;
                    max-width: 90%;
                `;

                const tracks = video.textTracks;
                for (let i = 0; i < tracks.length; i++) {
                    const track = tracks[i];
                    track.addEventListener('cuechange', () => {
                        const activeCues = track.activeCues;
                        if (activeCues && activeCues.length > 0) {
                            const cue = activeCues[0];

                            // Check if Karaoke mode is enabled
                            const currentSettings = loadSettings();
                            let formattedText;

                            if (currentSettings.karaokeMode) {
                                // Calculate cue duration
                                const duration = cue.endTime - cue.startTime;
                                // Process text with Karaoke effect
                                formattedText = processKaraokeText(
                                    cue.text,
                                    duration,
                                    currentSettings.karaokeEffect || 'spotlight',
                                    currentSettings.karaokeSpeed || 1
                                );
                            } else {
                                // Normal formatting
                                formattedText = formatSubtitleText(cue.text);
                            }

                            // Check if text contains Arabic characters
                            const hasArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(cue.text);
                            const direction = hasArabic ? 'rtl' : 'ltr';
                            const textAlign = hasArabic ? 'right' : 'center';

                            overlay.innerHTML = `
                                <div class="subtitle-text-wrapper" dir="${direction}" style="position: relative; display: inline-block; pointer-events: auto; direction: ${direction};">
                                    <div class="subtitle-text" style="pointer-events: auto; text-align: ${textAlign};">${formattedText}</div>
                                </div>`;

                            // Add hover buttons
                            const wrapper = overlay.querySelector('.subtitle-text-wrapper');
                            const textElement = overlay.querySelector('.subtitle-text');

                            let hoverTimeout;
                            let buttonsContainer;

                            const showButtons = () => {
                                clearTimeout(hoverTimeout);
                                if (buttonsContainer) return;

                                const rawText = cue.text.replace(/<[^>]*>/g, '').trim();
                                if (!rawText) return;

                                // Get background color from settings
                                const bgColor = document.querySelector('#sub-bg-color')?.value || '#000000';
                                const bgOpacity = parseFloat(document.querySelector('#sub-bg-opacity')?.value || 0.7);

                                buttonsContainer = document.createElement('div');
                                buttonsContainer.className = 'subtitle-hover-buttons';
                                buttonsContainer.style.cssText = `
                                    position: absolute;
                                    left: 1px;
                                    bottom: 95%;
                                    transform: translateY(-50%);
                                    display: flex;
                                    gap: 5px;
                                    animation: fadeIn 0.2s ease;
                                    pointer-events: all;
                                `;

                                // Search button
                                const searchBtn = document.createElement('button');
                                searchBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
                                searchBtn.title = 'Search in Google';
                                searchBtn.style.cssText = `
                                    width: 28px;
                                    height: 28px;
                                    border-radius: 50%;
                                    border: 1px solid rgba(255,255,255,0.3);
                                    background: ${bgColor};
                                    opacity: ${bgOpacity};
                                    color: white;
                                    cursor: pointer;
                                    font-size: 14px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                    padding: 0;
                                `;
                                searchBtn.onmouseenter = () => {
                                    searchBtn.style.opacity = '1';
                                    searchBtn.style.transform = 'scale(1.1)';
                                };
                                searchBtn.onmouseleave = () => {
                                    searchBtn.style.opacity = bgOpacity.toString();
                                    searchBtn.style.transform = 'scale(1)';
                                };
                                searchBtn.onclick = (e) => {
                                    e.stopPropagation();
                                    window.open(`https://www.google.com/search?q=${encodeURIComponent(rawText)}`, '_blank');
                                };

                                // Copy button
                                const copyBtn = document.createElement('button');
                                const copySvgOriginal = `<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M12.668 10.667C12.668 9.95614 12.668 9.46258 12.6367 9.0791C12.6137 8.79732 12.5758 8.60761 12.5244 8.46387L12.4688 8.33399C12.3148 8.03193 12.0803 7.77885 11.793 7.60254L11.666 7.53125C11.508 7.45087 11.2963 7.39395 10.9209 7.36328C10.5374 7.33197 10.0439 7.33203 9.33301 7.33203H6.5C5.78896 7.33203 5.29563 7.33195 4.91211 7.36328C4.63016 7.38632 4.44065 7.42413 4.29688 7.47559L4.16699 7.53125C3.86488 7.68518 3.61186 7.9196 3.43555 8.20703L3.36524 8.33399C3.28478 8.49198 3.22795 8.70352 3.19727 9.0791C3.16595 9.46259 3.16504 9.95611 3.16504 10.667V13.5C3.16504 14.211 3.16593 14.7044 3.19727 15.0879C3.22797 15.4636 3.28473 15.675 3.36524 15.833L3.43555 15.959C3.61186 16.2466 3.86474 16.4807 4.16699 16.6348L4.29688 16.6914C4.44063 16.7428 4.63025 16.7797 4.91211 16.8027C5.29563 16.8341 5.78896 16.835 6.5 16.835H9.33301C10.0439 16.835 10.5374 16.8341 10.9209 16.8027C11.2965 16.772 11.508 16.7152 11.666 16.6348L11.793 16.5645C12.0804 16.3881 12.3148 16.1351 12.4688 15.833L12.5244 15.7031C12.5759 15.5594 12.6137 15.3698 12.6367 15.0879C12.6681 14.7044 12.668 14.211 12.668 13.5V10.667ZM13.998 12.665C14.4528 12.6634 14.8011 12.6602 15.0879 12.6367C15.4635 12.606 15.675 12.5492 15.833 12.4688L15.959 12.3975C16.2466 12.2211 16.4808 11.9682 16.6348 11.666L16.6914 11.5361C16.7428 11.3924 16.7797 11.2026 16.8027 10.9209C16.8341 10.5374 16.835 10.0439 16.835 9.33301V6.5C16.835 5.78896 16.8341 5.29563 16.8027 4.91211C16.7797 4.63025 16.7428 4.44063 16.6914 4.29688L16.6348 4.16699C16.4807 3.86474 16.2466 3.61186 15.959 3.43555L15.833 3.36524C15.675 3.28473 15.4636 3.22797 15.0879 3.19727C14.7044 3.16593 14.211 3.16504 13.5 3.16504H10.667C9.9561 3.16504 9.46259 3.16595 9.0791 3.19727C8.79739 3.22028 8.6076 3.2572 8.46387 3.30859L8.33399 3.36524C8.03176 3.51923 7.77886 3.75343 7.60254 4.04102L7.53125 4.16699C7.4508 4.32498 7.39397 4.53655 7.36328 4.91211C7.33985 5.19893 7.33562 5.54719 7.33399 6.00195H9.33301C10.022 6.00195 10.5791 6.00131 11.0293 6.03809C11.4873 6.07551 11.8937 6.15471 12.2705 6.34668L12.4883 6.46875C12.984 6.7728 13.3878 7.20854 13.6533 7.72949L13.7197 7.87207C13.8642 8.20859 13.9292 8.56974 13.9619 8.9707C13.9987 9.42092 13.998 9.97799 13.998 10.667V12.665ZM18.165 9.33301C18.165 10.022 18.1657 10.5791 18.1289 11.0293C18.0961 11.4302 18.0311 11.7914 17.8867 12.1279L17.8203 12.2705C17.5549 12.7914 17.1509 13.2272 16.6553 13.5313L16.4365 13.6533C16.0599 13.8452 15.6541 13.9245 15.1963 13.9619C14.8593 13.9895 14.4624 13.9935 13.9951 13.9951C13.9935 14.4624 13.9895 14.8593 13.9619 15.1963C13.9292 15.597 13.864 15.9576 13.7197 16.2939L13.6533 16.4365C13.3878 16.9576 12.9841 17.3941 12.4883 17.6982L12.2705 17.8203C11.8937 18.0123 11.4873 18.0915 11.0293 18.1289C10.5791 18.1657 10.022 18.165 9.33301 18.165H6.5C5.81091 18.165 5.25395 18.1657 4.80371 18.1289C4.40306 18.0962 4.04235 18.031 3.70606 17.8867L3.56348 17.8203C3.04244 17.5548 2.60585 17.151 2.30176 16.6553L2.17969 16.4365C1.98788 16.0599 1.90851 15.6541 1.87109 15.1963C1.83431 14.746 1.83496 14.1891 1.83496 13.5V10.667C1.83496 9.978 1.83432 9.42091 1.87109 8.9707C1.90851 8.5127 1.98772 8.10625 2.17969 7.72949L2.30176 7.51172C2.60586 7.0159 3.04236 6.6122 3.56348 6.34668L3.70606 6.28027C4.04237 6.136 4.40303 6.07083 4.80371 6.03809C5.14051 6.01057 5.53708 6.00551 6.00391 6.00391C6.00551 5.53708 6.01057 5.14051 6.03809 4.80371C6.0755 4.34588 6.15483 3.94012 6.34668 3.56348L6.46875 3.34473C6.77282 2.84912 7.20856 2.44514 7.72949 2.17969L7.87207 2.11328C8.20855 1.96886 8.56979 1.90385 8.9707 1.87109C9.42091 1.83432 9.978 1.83496 10.667 1.83496H13.5C14.1891 1.83496 14.746 1.83431 15.1963 1.87109C15.6541 1.90851 16.0599 1.98788 16.4365 2.17969L16.6553 2.30176C17.151 2.60585 17.5548 3.04244 17.8203 3.56348L17.8867 3.70606C18.031 4.04235 18.0962 4.40306 18.1289 4.80371C18.1657 5.25395 18.165 5.81091 18.165 6.5V9.33301Z"/></svg>`;
                                copyBtn.innerHTML = copySvgOriginal;
                                copyBtn.title = 'Copy text';
                                copyBtn.style.cssText = searchBtn.style.cssText;
                                copyBtn.onmouseenter = () => {
                                    copyBtn.style.opacity = '1';
                                    copyBtn.style.transform = 'scale(1.1)';
                                };
                                copyBtn.onmouseleave = () => {
                                    copyBtn.style.opacity = bgOpacity.toString();
                                    copyBtn.style.transform = 'scale(1)';
                                };
                                copyBtn.onclick = async (e) => {
                                    e.stopPropagation();
                                    try {
                                        await navigator.clipboard.writeText(rawText);
                                        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>';
                                        setTimeout(() => { copyBtn.innerHTML = copySvgOriginal; }, 1000);
                                    } catch (err) {
                                        copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>';
                                        setTimeout(() => { copyBtn.innerHTML = copySvgOriginal; }, 1000);
                                    }
                                };

                                buttonsContainer.appendChild(searchBtn);
                                buttonsContainer.appendChild(copyBtn);
                                wrapper.appendChild(buttonsContainer);
                            };

                            const hideButtons = () => {
                                hoverTimeout = setTimeout(() => {
                                    if (buttonsContainer) {
                                        buttonsContainer.remove();
                                        buttonsContainer = null;
                                    }
                                }, 100);
                            };

                            wrapper.addEventListener('mouseenter', showButtons);
                            wrapper.addEventListener('mouseleave', hideButtons);
                        } else {
                            overlay.innerHTML = '';
                        }
                        positionOverlayForVideo(video, overlay, offsetY);
                    });
                }
                try {
                    for (let i = 0; i < tracks.length; i++) {
                        const activeCues = tracks[i].activeCues;
                        if (activeCues && activeCues.length > 0) {
                            const cue = activeCues[0];
                            // *** هنا التعديل أيضاً ***
                            const formattedText = formatSubtitleText(cue.text);
                            overlay.innerHTML = `
                                <div class="subtitle-text-wrapper" style="position: relative; display: inline-block; pointer-events: auto;">
                                    <div class="subtitle-text" style="pointer-events: auto;">${formattedText}</div>
                                </div>`;

                            // Add hover buttons for initial load
                            const wrapper = overlay.querySelector('.subtitle-text-wrapper');
                            const rawText = cue.text.replace(/<[^>]*>/g, '').trim();

                            let hoverTimeout;
                            let buttonsContainer;

                            const showButtons = () => {
                                clearTimeout(hoverTimeout);
                                if (buttonsContainer || !rawText) return;

                                // Get background color from settings
                                const bgColor = document.querySelector('#sub-bg-color')?.value || '#000000';
                                const bgOpacity = parseFloat(document.querySelector('#sub-bg-opacity')?.value || 0.7);

                                buttonsContainer = document.createElement('div');
                                buttonsContainer.className = 'subtitle-hover-buttons';
                                buttonsContainer.style.cssText = `
                                    position: absolute;
                                    left: 1px;
                                    bottom: 95%;
                                    transform: translateY(-50%);
                                    display: flex;
                                    gap: 5px;
                                    animation: fadeIn 0.2s ease;
                                    pointer-events: all;

                                `;

                                // Search button
                                const searchBtn = document.createElement('button');
                                searchBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="display:block;"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;
                                searchBtn.title = 'Search in Google';
                                searchBtn.style.cssText = `
                                    width: 28px;
                                    height: 28px;
                                    border-radius: 50%;
                                    border: 1px solid rgba(255,255,255,0.3);
                                    background: ${bgColor};
                                    opacity: ${bgOpacity};
                                    color: white;
                                    cursor: pointer;
                                    font-size: 14px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.2s;
                                    padding: 0;
                                `;
                                searchBtn.onmouseenter = () => {
                                    searchBtn.style.opacity = '1';
                                    searchBtn.style.transform = 'scale(1.1)';
                                };
                                searchBtn.onmouseleave = () => {
                                    searchBtn.style.opacity = bgOpacity.toString();
                                    searchBtn.style.transform = 'scale(1)';
                                };
                                searchBtn.onclick = (e) => {
                                    e.stopPropagation();
                                    window.open(`https://www.google.com/search?q=${encodeURIComponent(rawText)}`, '_blank');
                                };

                                // Copy button
                                const copyBtn = document.createElement('button');
                                const copySvgOriginal = `<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M12.668 10.667C12.668 9.95614 12.668 9.46258 12.6367 9.0791C12.6137 8.79732 12.5758 8.60761 12.5244 8.46387L12.4688 8.33399C12.3148 8.03193 12.0803 7.77885 11.793 7.60254L11.666 7.53125C11.508 7.45087 11.2963 7.39395 10.9209 7.36328C10.5374 7.33197 10.0439 7.33203 9.33301 7.33203H6.5C5.78896 7.33203 5.29563 7.33195 4.91211 7.36328C4.63016 7.38632 4.44065 7.42413 4.29688 7.47559L4.16699 7.53125C3.86488 7.68518 3.61186 7.9196 3.43555 8.20703L3.36524 8.33399C3.28478 8.49198 3.22795 8.70352 3.19727 9.0791C3.16595 9.46259 3.16504 9.95611 3.16504 10.667V13.5C3.16504 14.211 3.16593 14.7044 3.19727 15.0879C3.22797 15.4636 3.28473 15.675 3.36524 15.833L3.43555 15.959C3.61186 16.2466 3.86474 16.4807 4.16699 16.6348L4.29688 16.6914C4.44063 16.7428 4.63025 16.7797 4.91211 16.8027C5.29563 16.8341 5.78896 16.835 6.5 16.835H9.33301C10.0439 16.835 10.5374 16.8341 10.9209 16.8027C11.2965 16.772 11.508 16.7152 11.666 16.6348L11.793 16.5645C12.0804 16.3881 12.3148 16.1351 12.4688 15.833L12.5244 15.7031C12.5759 15.5594 12.6137 15.3698 12.6367 15.0879C12.6681 14.7044 12.668 14.211 12.668 13.5V10.667ZM13.998 12.665C14.4528 12.6634 14.8011 12.6602 15.0879 12.6367C15.4635 12.606 15.675 12.5492 15.833 12.4688L15.959 12.3975C16.2466 12.2211 16.4808 11.9682 16.6348 11.666L16.6914 11.5361C16.7428 11.3924 16.7797 11.2026 16.8027 10.9209C16.8341 10.5374 16.835 10.0439 16.835 9.33301V6.5C16.835 5.78896 16.8341 5.29563 16.8027 4.91211C16.7797 4.63025 16.7428 4.44063 16.6914 4.29688L16.6348 4.16699C16.4807 3.86474 16.2466 3.61186 15.959 3.43555L15.833 3.36524C15.675 3.28473 15.4636 3.22797 15.0879 3.19727C14.7044 3.16593 14.211 3.16504 13.5 3.16504H10.667C9.9561 3.16504 9.46259 3.16595 9.0791 3.19727C8.79739 3.22028 8.6076 3.2572 8.46387 3.30859L8.33399 3.36524C8.03176 3.51923 7.77886 3.75343 7.60254 4.04102L7.53125 4.16699C7.4508 4.32498 7.39397 4.53655 7.36328 4.91211C7.33985 5.19893 7.33562 5.54719 7.33399 6.00195H9.33301C10.022 6.00195 10.5791 6.00131 11.0293 6.03809C11.4873 6.07551 11.8937 6.15471 12.2705 6.34668L12.4883 6.46875C12.984 6.7728 13.3878 7.20854 13.6533 7.72949L13.7197 7.87207C13.8642 8.20859 13.9292 8.56974 13.9619 8.9707C13.9987 9.42092 13.998 9.97799 13.998 10.667V12.665ZM18.165 9.33301C18.165 10.022 18.1657 10.5791 18.1289 11.0293C18.0961 11.4302 18.0311 11.7914 17.8867 12.1279L17.8203 12.2705C17.5549 12.7914 17.1509 13.2272 16.6553 13.5313L16.4365 13.6533C16.0599 13.8452 15.6541 13.9245 15.1963 13.9619C14.8593 13.9895 14.4624 13.9935 13.9951 13.9951C13.9935 14.4624 13.9895 14.8593 13.9619 15.1963C13.9292 15.597 13.864 15.9576 13.7197 16.2939L13.6533 16.4365C13.3878 16.9576 12.9841 17.3941 12.4883 17.6982L12.2705 17.8203C11.8937 18.0123 11.4873 18.0915 11.0293 18.1289C10.5791 18.1657 10.022 18.165 9.33301 18.165H6.5C5.81091 18.165 5.25395 18.1657 4.80371 18.1289C4.40306 18.0962 4.04235 18.031 3.70606 17.8867L3.56348 17.8203C3.04244 17.5548 2.60585 17.151 2.30176 16.6553L2.17969 16.4365C1.98788 16.0599 1.90851 15.6541 1.87109 15.1963C1.83431 14.746 1.83496 14.1891 1.83496 13.5V10.667C1.83496 9.978 1.83432 9.42091 1.87109 8.9707C1.90851 8.5127 1.98772 8.10625 2.17969 7.72949L2.30176 7.51172C2.60586 7.0159 3.04236 6.6122 3.56348 6.34668L3.70606 6.28027C4.04237 6.136 4.40303 6.07083 4.80371 6.03809C5.14051 6.01057 5.53708 6.00551 6.00391 6.00391C6.00551 5.53708 6.01057 5.14051 6.03809 4.80371C6.0755 4.34588 6.15483 3.94012 6.34668 3.56348L6.46875 3.34473C6.77282 2.84912 7.20856 2.44514 7.72949 2.17969L7.87207 2.11328C8.20855 1.96886 8.56979 1.90385 8.9707 1.87109C9.42091 1.83432 9.978 1.83496 10.667 1.83496H13.5C14.1891 1.83496 14.746 1.83431 15.1963 1.87109C15.6541 1.90851 16.0599 1.98788 16.4365 2.17969L16.6553 2.30176C17.151 2.60585 17.5548 3.04244 17.8203 3.56348L17.8867 3.70606C18.031 4.04235 18.0962 4.40306 18.1289 4.80371C18.1657 5.25395 18.165 5.81091 18.165 6.5V9.33301Z"/></svg>`;
                                copyBtn.innerHTML = copySvgOriginal;
                                copyBtn.title = 'Copy text';
                                copyBtn.style.cssText = searchBtn.style.cssText;
                                copyBtn.onmouseenter = () => {
                                    copyBtn.style.opacity = '1';
                                    copyBtn.style.transform = 'scale(1.1)';
                                };
                                copyBtn.onmouseleave = () => {
                                    copyBtn.style.opacity = bgOpacity.toString();
                                    copyBtn.style.transform = 'scale(1)';
                                };
                                copyBtn.onclick = async (e) => {
                                    e.stopPropagation();
                                    try {
                                        await navigator.clipboard.writeText(rawText);
                                        copyBtn.innerHTML = '✓';
                                        setTimeout(() => { copyBtn.innerHTML = copySvgOriginal; }, 1000);
                                    } catch (err) {
                                        copyBtn.innerHTML = '✗';
                                        setTimeout(() => { copyBtn.innerHTML = copySvgOriginal; }, 1000);
                                    }
                                };

                                buttonsContainer.appendChild(searchBtn);
                                buttonsContainer.appendChild(copyBtn);
                                wrapper.appendChild(buttonsContainer);
                            };

                            const hideButtons = () => {
                                hoverTimeout = setTimeout(() => {
                                    if (buttonsContainer) {
                                        buttonsContainer.remove();
                                        buttonsContainer = null;
                                    }
                                }, 100);
                            };

                            wrapper.addEventListener('mouseenter', showButtons);
                            wrapper.addEventListener('mouseleave', hideButtons);
                            break;
                        }
                    }
                } catch (_) {}

                const topDoc = getTopDocument();
                topDoc.body.appendChild(overlay);
                positionOverlayForVideo(video, overlay, offsetY);
            }

            document.querySelector('.manual-subtitle')?.remove();

            document.querySelectorAll('video').forEach(video => {
                const tracks = video.textTracks;
                for (let i = 0; i < tracks.length; i++) {
                    try { tracks[i].mode = 'showing'; } catch (_) {}
                }
                const previousDelay = applySettings.__lastDelay;
                const delayChanged = (previousDelay === undefined) || (previousDelay !== delay);
                if(delayChanged) {
                    for (let i = 0; i < tracks.length; i++) {
                        const track = tracks[i];
                        for (let j = 0; j < (track.cues?.length || 0); j++) {
                            const cue = track.cues[j];
                            if (!cue.__originalStart) {
                                cue.__originalStart = cue.startTime;
                                cue.__originalEnd = cue.endTime;
                            }
                            cue.startTime = Math.max(0, cue.__originalStart + delay / 1000);
                            cue.endTime = Math.max(0, cue.__originalEnd + delay / 1000);
                        }
                        track.mode = 'disabled';
                        setTimeout(() => { track.mode = 'showing'; }, 10);
                    }
                }
                applySettings.__lastDelay = delay;
                video.parentElement?.querySelector('.manual-subtitle')?.remove();
                const overlay = document.querySelector(`.custom-subtitle-overlay[data-video-id="${video.dataset.__suId||''}"]`);
                if (overlay) {
                    positionOverlayForVideo(video, overlay, offsetY);
                }
            });

            const realign = () => {
                const fullscreenEl = document.fullscreenElement;
                document.querySelectorAll('.custom-subtitle-overlay').forEach(overlay => {
                    const vidId = overlay.getAttribute('data-video-id');
                    if (!vidId) return;
                    const video = document.querySelector(`video[data-__su-id="${vidId}"]`);
                    if (video) {
                        // *** الجزء الأهم في الإصلاح ***
                        // إذا كنا في وضع ملء الشاشة ولم تكن الترجمة بداخله، انقلها
                        if (fullscreenEl && overlay.parentElement !== fullscreenEl) {
                            fullscreenEl.appendChild(overlay);
                            overlay.style.zIndex = '2147483647'; // أعلى z-index ممكن
                        }
                        // إذا خرجنا من وضع ملء الشاشة ولم تكن الترجمة في الصفحة، أعدها
                        else if (!fullscreenEl && overlay.parentElement !== getTopDocument().body) {
                            getTopDocument().body.appendChild(overlay);
                            overlay.style.zIndex = '100000'; // z-index الأصلي
                        }

                        const offsetYNow = parseFloat(document.querySelector('#sub-offsetY')?.value || 85);
                        positionOverlayForVideo(video, overlay, offsetYNow);
                    }
                });
            };

            // إزالة المستمعين القدامى لتجنب تكرارهم
            if (applySettings.realignHandler) {
                window.removeEventListener('scroll', applySettings.realignHandler);
                window.removeEventListener('resize', applySettings.realignHandler);
                document.removeEventListener('fullscreenchange', applySettings.realignHandler);
            }
            applySettings.realignHandler = realign;

            window.addEventListener('scroll', realign, { passive: true });
            window.addEventListener('resize', realign);
            document.addEventListener('fullscreenchange', realign);
        }

        function ensureFontLoaded(fontFamily) {
            const id = '__su_font__';
            let link = document.getElementById(id);
            if (!fontFamily || fontFamily === 'System Default') {
                if (link) link.remove();
                return;
            }

            const googleMap = {
                'Cairo': 'Cairo:wght@400;600;700',
                'Tajawal': 'Tajawal:wght@400;600;700',
                'Noto Naskh Arabic': 'Noto+Naskh+Arabic:wght@400;600;700',
                'Noto Kufi Arabic': 'Noto+Kufi+Arabic:wght@400;600;700',
                'Amiri': 'Amiri:wght@400;700',
                'Scheherazade New': 'Scheherazade+New:wght@400;700',
                'Markazi Text': 'Markazi+Text:wght@400;600;700',
                'El Messiri': 'El+Messiri:wght@400;600;700',
                'Reem Kufi': 'Reem+Kufi:wght@400;600;700',
                'Changa': 'Changa:wght@400;600;700',
                'Harmattan': 'Harmattan:wght@400;700',
                'Mada': 'Mada:wght@400;700',
                'IBM Plex Sans Arabic': 'IBM+Plex+Sans+Arabic:wght@400;600;700',
                'Almarai': 'Almarai:wght@400;700',
                'Roboto': 'Roboto:wght@400;700',
                'Inter': 'Inter:wght@400;700'
            };
            const gf = googleMap[fontFamily];
            if (!gf) {
                if (link) link.remove();
                return;
            }
            const href = `https://fonts.googleapis.com/css2?family=${gf}&display=swap`;
            if (link && link.getAttribute('href') === href) return;
            if (link) link.remove();
            link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }

        // Toast Notification System
        function showToast(message, type = 'info') {
            const toastContainer = document.querySelector('.su-toast-container') || createToastContainer();

            const toast = document.createElement('div');
            toast.className = `su-toast su-toast-${type}`;

            toast.innerHTML = `<span style="font-size:13px;font-weight:400;">${message}</span>`;

            toast.style.cssText = `
                background: rgba(13, 34, 31, 0.95);
                color: rgba(255, 255, 255, 0.9);
                padding: 10px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                margin-bottom: 8px;
                animation: slideInToast 0.3s ease, fadeOutToast 0.3s ease 2.7s;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(5, 180, 166, 0.3);
                min-width: 200px;
                max-width: 350px;
                pointer-events: auto;
                cursor: pointer;
                text-align: center;
            `;

            toastContainer.appendChild(toast);

            // Click to dismiss
            toast.onclick = () => {
                toast.style.animation = 'fadeOutToast 0.2s ease';
                setTimeout(() => toast.remove(), 200);
            };

            // Auto remove after 3 seconds
            setTimeout(() => {
                toast.style.animation = 'fadeOutToast 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);

            // Click to dismiss
            toast.onclick = () => {
                toast.style.animation = 'fadeOutToast 0.2s ease';
                setTimeout(() => toast.remove(), 200);
            };
        }

        function createToastContainer() {
            const container = document.createElement('div');
            container.className = 'su-toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;

            // Add animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInToast {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOutToast {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(container);
            return container;
        }

        function getTopDocument() {
            let currentWindow = window;
            try {
                while (currentWindow.parent && currentWindow.parent !== currentWindow) {
                    // Check if we can access the parent's document
                    if (currentWindow.parent.document) {
                        currentWindow = currentWindow.parent;
                    } else {
                        // If we can't access due to cross-origin policy, break
                        break;
                    }
                }
            } catch (e) {
                // Error accessing parent, likely cross-origin
            }
            return currentWindow.document;
        }


        // دوال مساعدة للمعالجة الذكية للنص
        function smartTextProcessing(text) {
            if (!text) return '';

            // 1. تنسيق بسيط للنص (مائل وعريض) وتغليف الأرقام
            text = text
                .replace(/_([^_]+)_/g, '<i>$1</i>')
                .replace(/\*([^*]+)\*/g, '<b>$1</b>')
                .replace(/(\d+)/g, '<span class="subtitle-number">$1</span>');

            // 2. الكشف عن اللغة السائدة وتغليف الأجزاء المختلطة
            const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
            const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
            const dominantDir = arabicChars > latinChars ? 'rtl' : 'ltr';

            // Regex to find segments of the non-dominant language
            const oppositeLangRegex = dominantDir === 'rtl'
                ? /([a-zA-Z0-9\s.,!?'"-]+)/g // Find English segments
                : /([\u0600-\u06FF\s.,!?'"-]+)/g; // Find Arabic segments

            const oppositeDir = dominantDir === 'rtl' ? 'ltr' : 'rtl';

            // Split by HTML tags to avoid processing them
            const parts = text.split(/(<[^>]+>)/);
            const processedParts = parts.map(part => {
                if (part.startsWith('<')) {
                    return part; // It's an HTML tag, leave it as is
                }
                // It's a text node, process it
                return part.replace(oppositeLangRegex, (match) => {
                    if (match.trim() === '') return match; // Don't wrap whitespace
                    return `<span dir="${oppositeDir}">${match}</span>`;
                });
            });

            // 3. إضافة اتجاه النص العام
            return `<span dir="${dominantDir}" class="smart-text">${processedParts.join('')}</span>`;
        }

        // تحديث دالة تنسيق النص
        function formatSubtitleText(text) {
            // معالجة النص بالتحسينات الذكية أولاً
            const processedText = smartTextProcessing(text);

            // تقسيم النص إلى سطرين إذا كان طويلاً جداً، مع الحفاظ على HTML
            // هذا حل بسيط لتجنب تكسر الـ HTML
            const lines = processedText.split(/\r?\n/);
            if (lines.length > 1) {
                return lines.join('<br>');
            }

            // إذا كان النص طويلاً ولا يحتوي على فواصل أسطر، نقسمه من المنتصف تقريبًا
            // هذا ليس مثاليًا ولكنه أفضل من تكسير الوسوم
            const plainText = text.replace(/<[^>]+>/g, ''); // إزالة HTML لقياس الطول
            if (plainText.length > 50) { // يمكن تعديل هذا الرقم حسب الحاجة
                const middle = Math.floor(processedText.length / 2);
                const breakPoint = processedText.lastIndexOf(' ', middle);
                if (breakPoint > 0) {
                    return processedText.substring(0, breakPoint) + '<br>' + processedText.substring(breakPoint + 1);
                }
            }

            return processedText;
        }

        function saveSettings() {
            const current = {
                fontSize: document.querySelector('#sub-font-size').value || 30,
                fontColor: document.querySelector('#sub-font-color').value || '#fff',
                bgColor: document.querySelector('#sub-bg-color').value || '#000',
                bgToggle: document.querySelector('#sub-bg-toggle').checked,
                offsetY: document.querySelector('#sub-offsetY').value || 85,
                delay: parseInt(document.querySelector('#sub-delay').value || 0),
                bgOpacity: parseFloat(document.querySelector('#sub-bg-opacity').value || 0.7),
                fontFamily: document.querySelector('#sub-font-family')?.value || 'System Default',
                karaokeMode: document.querySelector('#karaoke-modal-toggle')?.checked || false,
                karaokeEffect: settings.karaokeEffect || 'spotlight',
                karaokeSpeed: parseFloat(document.querySelector('#karaoke-modal-speed')?.value || 1),
                shortcuts: settings.shortcuts || defaultSettings.shortcuts
            };
            localStorage.setItem('__subtitle_settings__', JSON.stringify(current));
        }

        function loadSettings() {
            const saved = localStorage.getItem('__subtitle_settings__');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
        }

        function hexToRgba(hex, alpha) {
            const bigint = parseInt(hex.replace('#', ''), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    positionButtons();
                }, 1500); // استنى شوية لحد ما الفيديو يظهر
            }
        }).observe(document, { subtree: true, childList: true });

        } // End of init function

    })();
// ==UserScript==
// @name         TorrentBD Shoutbox Notifier
// @version      1.3
// @description  Automatically detects your username, highlights messages, and plays a sound in the TorrentBD shoutbox when keywords are mentioned.
// @author       5ifty6ix
// @namespace    5ifty6ix
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546367/TorrentBD%20Shoutbox%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/546367/TorrentBD%20Shoutbox%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let processedMessages = GM_getValue('TBD_processed_messages', []);
    const MAX_PROCESSED_MESSAGES = 200;
    function detectUsername() {
        const allRankElements = document.querySelectorAll('.tbdrank');
        for (const rankElement of allRankElements) {
            if (!rankElement.closest('#shoutbox-container')) {
                if (rankElement && rankElement.firstChild && rankElement.firstChild.nodeType === Node.TEXT_NODE) {
                    return rankElement.firstChild.nodeValue.trim();
                }
            }
        }
        return 'Not Found';
    }
    const settings = {
        username: GM_getValue('TBD_shout_username', detectUsername() || ''),
        keywords: GM_getValue('TBD_shout_keywords', []),
        soundVolume: GM_getValue('TBD_shout_soundVolume', 0.5),
        highlightColor: GM_getValue('TBD_shout_highlightColor', '#2E4636')
    };
    function playSound() {
        if (settings.soundVolume < 0.01) return;
        try {
            const audio = new Audio("https://raw.githubusercontent.com/5ifty6ix/custom-sounds/refs/heads/main/new-notification-010-352755.mp3");
            audio.volume = settings.soundVolume;
            audio.play();
        } catch (e) {
            console.error('Shoutbox Notifier: Could not play custom sound.', e);
        }
    }
    function notifyUser() {
        if (!document.title.startsWith('(1)')) {
            document.title = '(1) ' + document.title;
        }
        playSound();
    }
    function highlightShout(shoutElement) {
        shoutElement.style.backgroundColor = settings.highlightColor;
        shoutElement.style.borderLeft = '3px solid #14a76c';
        shoutElement.style.paddingLeft = '5px';
    }
    function checkShout(shoutElement) {
        if (!shoutElement || !shoutElement.id) return;
        const messageBody = shoutElement.querySelector('.shout-text');
        if (!messageBody) return;
        const messageText = messageBody.textContent.toLowerCase();
        const activeUsername = (settings.username && settings.username !== 'Not Found') ? [settings.username] : [];
        const allKeywords = [...activeUsername, ...settings.keywords]
            .filter(k => k && k.trim() !== '')
            .map(k => k.toLowerCase());
        if (allKeywords.length === 0) return;
        let keywordFound = false;
        for (const keyword of allKeywords) {
            const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const keywordRegex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
            if (keywordRegex.test(messageText)) {
                highlightShout(shoutElement);
                keywordFound = true;
                break;
            }
        }
        if (keywordFound) {
            if (!processedMessages.includes(shoutElement.id)) {
                notifyUser();
                processedMessages.push(shoutElement.id);
                if (processedMessages.length > MAX_PROCESSED_MESSAGES) {
                    processedMessages.shift();
                }
                GM_setValue('TBD_processed_messages', processedMessages);
            }
        }
    }
    function createSettingsUI() {
        const uiWrapper = document.createElement('div');
        uiWrapper.id = 'sbn-modal-wrapper';
        uiWrapper.style.display = 'none';
        uiWrapper.innerHTML = `
            <div id="sbn-container">
                <div id="sbn-header">
                    <h1>Shoutbox Notifier</h1>
                    <p>Get notified when your username or any specific words appear in the Shoutbox</p>
                    <button id="sbn-close-btn" title="Close">×</button>
                </div>
                <div id="sbn-content">
                    <div class="sbn-form-group">
                        <label>Username</label>
                        <div id="sbn-username-display">Detecting...</div>
                    </div>
                    <div class="sbn-form-group">
                        <div class="sbn-label-row">
                            <label for="sbn-keywords">Other Keywords (One per line)</label>
                            <button id="sbn-reset-keywords">Reset</button>
                        </div>
                        <textarea id="sbn-keywords" placeholder="Add other keywords here..."></textarea>
                    </div>
                    <div class="sbn-controls-row">
                        <div class="sbn-form-group">
                            <label>Highlight Colour</label>
                            <div id="sbn-color-picker-wrapper">
                                <input type="color" id="sbn-color">
                            </div>
                        </div>
                        <div class="sbn-form-group">
                            <label for="sbn-volume">Notification Volume</label>
                            <div class="sbn-volume-control">
                                <div id="sbn-volume-icon"></div>
                                <input type="range" id="sbn-volume" min="0" max="100" step="1">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(uiWrapper);
        const settingsButton = document.createElement('div');
        settingsButton.id = 'sbn-settings-btn';
        settingsButton.title = 'Shoutbox Notifier Settings';
        settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" /></svg>`;
        settingsButton.addEventListener('click', (e) => {
            e.stopPropagation();
            uiWrapper.style.display = 'flex';
            loadSettings();
        });
        const titleElement = document.querySelector('#shoutbox-container .content-title h6.left');
        if (titleElement) {
            titleElement.style.display = 'flex';
            titleElement.style.alignItems = 'center';
            titleElement.appendChild(settingsButton);
        }
        const usernameDisplay = document.getElementById('sbn-username-display');
        const keywordsInput = document.getElementById('sbn-keywords');
        const resetKeywordsBtn = document.getElementById('sbn-reset-keywords');
        const colorInput = document.getElementById('sbn-color');
        const colorPickerWrapper = document.getElementById('sbn-color-picker-wrapper');
        const volumeSlider = document.getElementById('sbn-volume');
        const volumeIconContainer = document.getElementById('sbn-volume-icon');
        const closeBtn = document.getElementById('sbn-close-btn');
        function loadSettings() {
            const detectedUser = detectUsername();
            settings.username = detectedUser;
            GM_setValue('TBD_shout_username', settings.username);
            usernameDisplay.textContent = settings.username;
            settings.keywords = GM_getValue('TBD_shout_keywords', []);
            settings.highlightColor = GM_getValue('TBD_shout_highlightColor', '#2E4636');
            settings.soundVolume = GM_getValue('TBD_shout_soundVolume', 0.5);
            keywordsInput.value = settings.keywords.join('\n');
            colorInput.value = settings.highlightColor;
            colorPickerWrapper.style.backgroundColor = settings.highlightColor;
            volumeSlider.value = settings.soundVolume * 100;
            updateVolumeIcon();
        }
        const volumeIcons = {
            mute: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" /></svg>`,
            on: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" /><path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" /></svg>`
        };
        function updateVolumeIcon() {
            const value = parseFloat(volumeSlider.value);
            if (value == 0) {
                volumeIconContainer.innerHTML = volumeIcons.mute;
            } else {
                volumeIconContainer.innerHTML = volumeIcons.on;
            }
        }
        closeBtn.addEventListener('click', () => { uiWrapper.style.display = 'none'; });
        uiWrapper.addEventListener('click', (event) => {
            if (event.target.id === 'sbn-modal-wrapper') {
                uiWrapper.style.display = 'none';
            }
        });
        resetKeywordsBtn.addEventListener('click', () => {
            keywordsInput.value = '';
            settings.keywords = [];
            GM_setValue('TBD_shout_keywords', []);
        });
        keywordsInput.addEventListener('input', () => {
            settings.keywords = keywordsInput.value.split('\n').map(k => k.trim()).filter(k => k);
            GM_setValue('TBD_shout_keywords', settings.keywords);
        });
        colorInput.addEventListener('input', () => {
            settings.highlightColor = colorInput.value;
            colorPickerWrapper.style.backgroundColor = colorInput.value;
            GM_setValue('TBD_shout_highlightColor', settings.highlightColor);
        });
        volumeSlider.addEventListener('input', () => {
            settings.soundVolume = parseFloat(volumeSlider.value) / 100;
            GM_setValue('TBD_shout_soundVolume', settings.soundVolume);
            updateVolumeIcon();
        });
        loadSettings();
    }
    GM_addStyle(`
        #sbn-modal-wrapper { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        #sbn-container { background-color: #2c2c2c; color: #e0e0e0; border: 1px solid #4a4a4a; border-radius: 16px; width: 90%; max-width: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        #sbn-header { padding: 24px; text-align: center; position: relative; }
        #sbn-header h1 { font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 8px 0; }
        #sbn-header p { font-size: 14px; color: #a0a0a0; margin: 0; }
        #sbn-close-btn { position: absolute; top: 05px; right: 10px; border: none; background: none; color: #888; cursor: pointer; font-size: 24px; font-weight: bold; transition: color .2s; padding: 4px; line-height: 1; }
        #sbn-close-btn:hover { color: #fff; }
        #sbn-content { padding: 0 24px 24px 24px; }
        .sbn-form-group { margin-bottom: 24px; }
        .sbn-form-group:last-child { margin-bottom: 0; }
        #sbn-content label { display: block; margin-bottom: 8px; font-weight: 500; color: #CFCFCF; font-size: 13px; }
        .sbn-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        #sbn-reset-keywords { background: none; border: none; color: #FF453A; font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; }
        #sbn-reset-keywords:hover { text-decoration: underline; }
        #sbn-username-display { background-color: #1e1e1e; border: 1px solid #555; border-radius: 8px; color: #fff; padding: 12px 16px; font-size: 16px; min-height: 45px; box-sizing: border-box; }
        #sbn-keywords { width: 100%; height: 180px; resize: none; background-color: #1e1e1e; border: 1px solid #555; border-radius: 8px; color: #fff; padding: 10px; font-size: 14px; box-sizing: border-box; }
        #sbn-keywords:focus { outline: none; border-color: #888; }
        .sbn-controls-row { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
        #sbn-color-picker-wrapper { position: relative; width: 100%; height: 44px; border: 1px solid #555; border-radius: 8px; overflow: hidden; }
        #sbn-color { position: absolute; top: -5px; left: -5px; width: calc(100% + 10px); height: calc(100% + 10px); border: none; padding: 0; cursor: pointer; }
        .sbn-volume-control { display: flex; align-items: center; gap: 12px; height: 44px; background-color: #1e1e1e; border: 1px solid #555; border-radius: 8px; padding: 0 20px; box-sizing: border-box; }
        #sbn-volume-icon { color: #a0a0a0; width: 24px; height: 24px; flex-shrink: 0; }
        #sbn-volume { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; background: #4a4a4a; border-radius: 3px; outline: none; }
        #sbn-volume::-webkit-slider-runnable-track { background: #4a4a4a; border-radius: 3px; height: 7px; margin-right: -5px; margin-left: -5px; }
        #sbn-volume::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; background: #d1d5db; border-radius: 50%; cursor: pointer; margin-top: -6px; }
        #sbn-volume::-moz-range-track { background: #4a4a4a; border-radius: 3px; height: 6px; }
        #sbn-volume::-moz-range-thumb { width: 18px; height: 18px; background: #d1d5db; border-radius: 50%; cursor: pointer; border: none; }
        #sbn-settings-btn { cursor: pointer; margin-left: 10px; display: inline-flex; align-items: center; color: #9e9e9e; transition: color .2s ease; }
        #sbn-settings-btn:hover { color: #fff; }
        #sbn-settings-btn svg { width: 20px; height: 20px; }
    `);
    window.addEventListener('load', () => {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('shout-item')) {
                            checkShout(node);
                        }
                    });
                }
            }
        });
        function startObserver() {
            const shoutbox = document.getElementById('shouts-container');
            if (shoutbox) {
                shoutbox.querySelectorAll('.shout-item').forEach(checkShout);
                observer.observe(shoutbox, {
                    childList: true
                });
            } else {
                setTimeout(startObserver, 500);
            }
        }
        createSettingsUI();
        startObserver();
    });
})();

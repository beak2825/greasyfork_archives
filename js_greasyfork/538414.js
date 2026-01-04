// ==UserScript==
// @name         Reddit Emoji Picker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reddit Emoji Picker for the baj
// @author       Baj
// @license      MIT
// @match        https://*.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538414/Reddit%20Emoji%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/538414/Reddit%20Emoji%20Picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List emojis and codes
    const emojiList = [
        { code: '[emote:t5_33td5:59888](http://img)', name: 'Clueless', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Clueless.png' },
        { code: '[emote:t5_33td5:59889](http://img)', name: 'Okayeg', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Okayeg.png' },
        { code: '[emote:t5_33td5:59890](http://img)', name: 'cmonBruh', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/cmonBruh.png' },
        { code: '[emote:t5_33td5:59891](http://img)', name: 'Copesen', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Copesen.png' },
        { code: '[emote:t5_33td5:59892](http://img)', name: 'forsenCD', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenCD.png' },
        { code: '[emote:t5_33td5:59893](http://img)', name: 'forsenE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenE.png' },
        { code: '[emote:t5_33td5:59894](http://img)', name: 'tf', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/tf.png' },
        { code: '[emote:t5_33td5:59895](http://img)', name: 'FeelsOkayMan', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/FeelsOkayMan.png' },
        { code: '[emote:t5_33td5:59896](http://img)', name: 'gachiGASM', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/gachiGASM.png' },
        { code: '[emote:t5_33td5:59897](http://img)', name: 'monkaOMEGA', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/monkaOMEGA.png' },
        { code: '[emote:t5_33td5:59898](http://img)', name: 'LULE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/LULE.png' },
        { code: '[emote:t5_33td5:59899](http://img)', name: 'OMEGALUL', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/OMEGALUL.png' },
        { code: '[emote:t5_33td5:59900](http://img)', name: 'PagMan', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/PagMan.png' },
        { code: '[emote:t5_33td5:59901](http://img)', name: 'forsenBased', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenBased.png' },
        { code: '[emote:t5_33td5:59902](http://img)', name: 'Sadeg', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Sadeg.png' },
        { code: '[emote:t5_33td5:59903](http://img)', name: 'forsenAlright', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenAlright.png' },
        { code: '[emote:t5_33td5:59904](http://img)', name: 'forsenLevel', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenLevel.png' },
        { code: '[emote:t5_33td5:59905](http://img)', name: 'pepeLaugh', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/pepeLaugh.png' },
        { code: '[emote:t5_33td5:59906](http://img)', name: 'forsenDespair', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenDespair.png' },
        { code: '[emote:t5_33td5:53915](http://img)', name: 'sadE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/sadE.png' },
        { code: '[emote:t5_33td5:53373](http://img)', name: 'forsenMaxLevel', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenMaxLevel.png' },
        { code: '[emote:t5_33td5:9486](http://img)', name: 'maoE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/maoE.png' },
        { code: '[emote:t5_33td5:9683](http://img)', name: 'Wutface', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Wutface.png' },
        { code: '[emote:t5_33td5:5322](http://img)', name: 'MegaLUL', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/MegaLUL.png' },
        { code: '[emote:t5_33td5:5359](http://img)', name: 'Docsen', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Docsen.png' },
        { code: '[emote:t5_33td5:10257](http://img)', name: 'amongE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/amongE.png' },
        { code: '[emote:t5_33td5:9671](http://img)', name: 'Batchest', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Batchest.png' },
        { code: '[emote:t5_33td5:53371](http://img)', name: 'forsenNugget', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenNugget.png' },
        { code: '[emote:t5_33td5:53390](http://img)', name: 'LongHairMaxLevel', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/LongHairMaxLevel.png' },
        { code: '[emote:t5_33td5:54526](http://img)', name: 'Pewds', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Pewds.png' },
        { code: '[emote:t5_33td5:53563](http://img)', name: 'monkaLaugh', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/monkaLaugh.png' },
        { code: '[emote:t5_33td5:55418](http://img)', name: 'muv', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/muv.png' },
        { code: '[emote:t5_33td5:55894](http://img)', name: 'snowman', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/snowman.png' },
        { code: '[emote:t5_33td5:55905](http://img)', name: 'bbangrE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/bbangrE.png' },
        { code: '[emote:t5_33td5:56633](http://img)', name: 'WeebsOut', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/WeebsOut.png' },
        { code: '[emote:t5_33td5:56664](http://img)', name: 'freakE', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/freakE.png' },
        { code: '[emote:t5_33td5:57649](http://img)', name: 'emiru', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/emiru.png' },
        { code: '[emote:t5_33td5:58897](http://img)', name: 'wahhabi', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/wahhabi.png' },
        { code: '[emote:t5_33td5:58898](http://img)', name: 'thisIsYouOnIslam', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/thisIsYouOnIslam.png' },
        { code: '[emote:t5_33td5:58899](http://img)', name: 'familyPhoto', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/familyPhoto.png' },
        { code: '[emote:t5_33td5:58900](http://img)', name: 'sheikh', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/sheikh.png' },
        { code: '[emote:t5_33td5:58901](http://img)', name: 'Stoning', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Stoning.png' },
        { code: '[emote:t5_33td5:58913](http://img)', name: 'turban', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/turban.png' },
        { code: '[emote:t5_33td5:58914](http://img)', name: 'quranPepe', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/quranPepe.png' },
        { code: '[emote:t5_33td5:58948](http://img)', name: 'desertLevel', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/desertLevel.png' },
        { code: '[emote:t5_33td5:58949](http://img)', name: 'hesHalal', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/hesHalal.png' },
        { code: '[emote:t5_33td5:59909](http://img)', name: 'Tomfoolery', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Tomfoolery.png' },
        { code: '[emote:t5_33td5:60326](http://img)', name: 'salute', url: 'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/salute.png' }
    ];

    const defaultConfig = { autoSwitchToMarkdown: true };
    let config = GM_getValue('redditEmojiPickerConfig', defaultConfig);
    let showFormattingClicked = false;
    let switchToMarkdownClicked = false;
    let markdownObserver = null;
    const processedEditors = new Map();

    const styles = `
        .emoji-picker-button {
            background-color: transparent;
            color: #606060;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 8px;
            transition: background-color 0.2s;
        }
        .emoji-picker-button:hover { background-color: rgba(0, 0, 0, 0.1); }
        .emoji-picker-button svg { width: 24px; height: 24px; fill: currentColor; }
        .emoji-picker-container {
            position: absolute;
            background-color: #1a1a1b;
            border: 1px solid #343536;
            border-radius: 8px;
            padding: 12px;
            max-width: 400px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1001;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .emoji-item {
            width: 32px;
            height: 32px;
            cursor: pointer;
            border-radius: 4px;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        .emoji-item:hover { background-color: #343536; }
        .emoji-item img { width: 100%; height: 100%; object-fit: contain; }
        .emoji-config-panel {
            position: absolute;
            background-color: #1a1a1b;
            border: 1px solid #343536;
            border-radius: 8px;
            padding: 12px;
            width: 250px;
            z-index: 1001;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            display: none;
        }
        .emoji-config-title { font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #d7dadc; }
        .emoji-config-option { display: flex; align-items: center; margin-bottom: 8px; }
        .emoji-config-option label { margin-left: 8px; color: #d7dadc; flex-grow: 1; }
        .emoji-config-button {
            background-color: #0079d3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            margin-top: 8px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
        }
        .emoji-config-button:hover { background-color: #0061a9; }
        .emoji-config-toggle {
            background-color: transparent;
            color: #606060;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: absolute;
            top: 8px;
            right: 8px;
            transition: background-color 0.2s;
        }
        .emoji-config-toggle:hover { background-color: rgba(0, 0, 0, 0.1); }
        .emoji-config-toggle svg { width: 16px; height: 16px; fill: currentColor; }
        .emoji-picker-wrapper { position: relative; display: flex; align-items: center; margin: 8px 0; z-index: 999; }
        .emoji-status-message {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            bottom: 100%;
            left: 0;
            margin-bottom: 5px;
            display: none;
            z-index: 1002;
        }
    `;

    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    function createEmojiPickerButton() {
        const button = document.createElement('button');
        button.className = 'emoji-picker-button';
        button.title = 'Show emoji picker';
        button.setAttribute('aria-label', 'Show emoji picker');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true">
                <path d="M15.83 15c-.52 1.38-2.19 2-3.79 2-1.59 0-3.28-.62-3.85-2h7.64m.69-1H7.49c-.27 0-.49.22-.46.47C7.34 16.83 9.7 18 12.05 18c2.35 0 4.69-1.18 4.93-3.54.03-.25-.2-.46-.46-.46zM12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9m0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM6.94 9.73C7.19 9.25 7.72 9 8.5 9c.75 0 1.28.25 1.57.75.14.24.45.32.68.18.24-.14.32-.44.18-.68C10.6 8.68 9.91 8 8.5 8c-1.48 0-2.15.69-2.44 1.27-.13.25-.03.55.21.67.07.04.15.06.23.06.18 0 .36-.1.44-.27zm7 0c.25-.48.78-.73 1.56-.73.75 0 1.28.25 1.57.75.14.24.45.32.68.18.24-.14.32-.44.18-.68C17.6 8.68 16.91 8 15.5 8c-1.48 0-2.15.69-2.44 1.27-.13.25-.03.55.21.67.07.04.15.06.23.06.18 0 .36-.1.44-.27z"></path>
            </svg>
        `;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleEmojiPicker(e);
        }, true);
        return button;
    }

    function createConfigButton() {
        const button = document.createElement('button');
        button.className = 'emoji-config-toggle';
        button.title = 'Settings';
        button.setAttribute('aria-label', 'Settings');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path>
            </svg>
        `;
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleConfigPanel(e);
        }, true);
        return button;
    }

    function createStatusMessage() {
        const message = document.createElement('div');
        message.className = 'emoji-status-message';
        return message;
    }

    function showStatusMessage(wrapper, text, duration = 3000) {
        const statusMessage = wrapper.querySelector('.emoji-status-message');
        if (statusMessage) {
            statusMessage.textContent = text;
            statusMessage.style.display = 'block';
            setTimeout(() => statusMessage.style.display = 'none', duration);
        }
    }

    function createConfigPanel() {
        const panel = document.createElement('div');
        panel.className = 'emoji-config-panel';
        panel.innerHTML = `
            <div class="emoji-config-title">Emoji Picker Settings</div>
            <div class="emoji-config-option">
                <input type="checkbox" id="auto-switch-markdown" ${config.autoSwitchToMarkdown ? 'checked' : ''}>
                <label for="auto-switch-markdown">Auto-switch to Markdown editor</label>
            </div>
            <button class="emoji-config-button" type="button">Save Settings</button>
        `;
        const saveButton = panel.querySelector('.emoji-config-button');
        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const checkbox = panel.querySelector('#auto-switch-markdown');
            const oldConfig = { ...config };
            config.autoSwitchToMarkdown = checkbox.checked;
            GM_setValue('redditEmojiPickerConfig', config);
            if (config.autoSwitchToMarkdown && !oldConfig.autoSwitchToMarkdown) startMarkdownObserver();
            else if (!config.autoSwitchToMarkdown && oldConfig.autoSwitchToMarkdown) stopMarkdownObserver();
            panel.style.display = 'none';
            if (panel.parentNode?.classList.contains('emoji-picker-wrapper')) {
                showStatusMessage(panel.parentNode, 'Settings saved!', 2000);
            }
        });
        return panel;
    }

    function toggleConfigPanel(event) {
        const button = event.currentTarget;
        const panel = button.parentNode.querySelector('.emoji-config-panel');
        const isHidden = panel.style.display === 'none' || panel.style.display === '';
        document.querySelectorAll('.emoji-config-panel').forEach(p => p.style.display = 'none');
        if (isHidden) panel.style.display = 'block';
    }

    function createEmojiPickerContainer(composerElement, wrapper) {
        const container = document.createElement('div');
        container.className = 'emoji-picker-container';
        container.style.display = 'none';

        emojiList.forEach(emoji => {
            const item = document.createElement('div');
            item.className = 'emoji-item';
            item.title = emoji.name;
            item.innerHTML = `<img src="${emoji.url}" alt="${emoji.name}">`;
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const form = composerElement.closest('faceplate-form');
                const submitButton = form?.querySelector('shreddit-composer button[slot="submit-button"][type="submit"]') ||
                    composerElement.querySelector('button[slot="submit-button"][type="submit"]');
                const wasDisabled = submitButton?.disabled ?? false;
                if (submitButton) submitButton.disabled = true;

                const finalize = (error) => {
                    if (submitButton && !wasDisabled) {
                        setTimeout(() => submitButton.disabled = false, error ? 100 : 300);
                    }
                    container.style.display = 'none';
                };

                (config.autoSwitchToMarkdown ? activateEditor(composerElement).then(() => new Promise(r => setTimeout(r, 300))) : activateEditor(composerElement))
                    .then(() => {
                        const target = composerElement.shadowRoot?.querySelector('shreddit-markdown-composer textarea') ||
                            composerElement.shadowRoot?.querySelector('[data-lexical-editor="true"]');
                        if (target) target.focus();
                        return new Promise(r => setTimeout(r, 50));
                    })
                    .then(() => insertEmoji(emoji.code, composerElement, wrapper))
                    .then(() => finalize(false))
                    .catch(() => {
                        showStatusMessage(wrapper, 'Error inserting emoji', 2000);
                        finalize(true);
                    });
            }, true);
            container.appendChild(item);
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target) && !wrapper.querySelector('.emoji-picker-button').contains(e.target)) {
                container.style.display = 'none';
            }
        }, false);

        return container;
    }

    function toggleEmojiPicker(event) {
        const button = event.currentTarget;
        const container = button.parentNode.querySelector('.emoji-picker-container');
        const isHidden = container.style.display === 'none' || container.style.display === '';
        document.querySelectorAll('.emoji-picker-container').forEach(c => c.style.display = 'none');
        document.querySelectorAll('.emoji-config-panel').forEach(p => p.style.display = 'none');
        if (isHidden) container.style.display = 'grid';
    }

    function activateEditor(composerElement) {
        return new Promise(resolve => {
            if (!composerElement?.shadowRoot) return resolve();
            const lexicalEditor = composerElement.shadowRoot.querySelector('[data-lexical-editor="true"]');
            if (lexicalEditor) {
                lexicalEditor.click();
                lexicalEditor.focus();
                return setTimeout(resolve, 100);
            }
            const markdownComposer = composerElement.shadowRoot.querySelector('shreddit-markdown-composer');
            const textarea = markdownComposer?.shadowRoot?.querySelector('textarea');
            if (textarea) {
                textarea.click();
                textarea.focus();
                return setTimeout(resolve, 100);
            }
            const triggerButton = composerElement.shadowRoot.querySelector('[data-testid="trigger-button"]');
            if (triggerButton) {
                triggerButton.click();
                return setTimeout(resolve, 300);
            }
            resolve();
        });
    }

    function querySelectorAllDeep(selector, root = document) {
        const results = Array.from(root.querySelectorAll(selector));
        root.querySelectorAll('*').forEach(host => {
            if (host.shadowRoot) results.push(...querySelectorAllDeep(selector, host.shadowRoot));
        });
        return results;
    }

    function checkAndClickMarkdownButtons(composerContext = document.body) {
        if (!config.autoSwitchToMarkdown) return;
        const searchRoot = composerContext.shadowRoot || composerContext;
        if (!showFormattingClicked) {
            const formattingBarConfigs = searchRoot === document.body ?
                querySelectorAllDeep('data[data-key="formattingBar"][data-show-formatting-bar="false"]') :
                Array.from(searchRoot.querySelectorAll('data[data-key="formattingBar"][data-show-formatting-bar="false"]'));
            if (formattingBarConfigs.length) {
                const buttons = searchRoot === document.body ?
                    querySelectorAllDeep('rte-toolbar-button') :
                    Array.from(searchRoot.querySelectorAll('rte-toolbar-button'));
                for (const button of buttons) {
                    if (button.offsetParent && button.getAttribute('screenreadercontent') === 'Show formatting options') {
                        button.click();
                        showFormattingClicked = true;
                        setTimeout(() => checkMarkdownSwitch(searchRoot), 300);
                        break;
                    }
                }
            } else {
                checkMarkdownSwitch(searchRoot);
            }
        }
    }

    function checkMarkdownSwitch(searchRoot) {
        if (switchToMarkdownClicked) return;
        const markdownButtons = searchRoot === document.body ?
            querySelectorAllDeep('button[aria-label="Switch to Markdown Editor"]') :
            Array.from(searchRoot.querySelectorAll('button[aria-label="Switch to Markdown Editor"]'));
        if (markdownButtons.length && markdownButtons[0].offsetParent) {
            markdownButtons[0].click();
            switchToMarkdownClicked = true;
        }
    }

    function detectAndProcessNewEditors() {
        querySelectorAllDeep('shreddit-composer').forEach(composer => {
            if (!processedEditors.has(composer)) {
                processedEditors.set(composer, true);
                activateEditor(composer).then(() => {
                    setTimeout(() => {
                        if (config.autoSwitchToMarkdown) {
                            showFormattingClicked = false;
                            switchToMarkdownClicked = false;
                            checkAndClickMarkdownButtons(composer);
                        }
                    }, 750);
                });
            }
        });
        processedEditors.forEach((_, key) => !document.contains(key) && processedEditors.delete(key));
    }

    function startMarkdownObserver() {
        if (markdownObserver) return;
        markdownObserver = new MutationObserver(() => {
            checkAndClickMarkdownButtons();
            detectAndProcessNewEditors();
        });
        markdownObserver.observe(document.body, { childList: true, subtree: true });
        detectAndProcessNewEditors();
    }

    function stopMarkdownObserver() {
        if (markdownObserver) {
            markdownObserver.disconnect();
            markdownObserver = null;
            showFormattingClicked = false;
            switchToMarkdownClicked = false;
            processedEditors.clear();
        }
    }

    function insertEmoji(emojiCode, composerElement, wrapper) {
        if (!composerElement?.shadowRoot) return;
        const markdownComposer = composerElement.shadowRoot.querySelector('shreddit-markdown-composer');
        const textarea = markdownComposer?.shadowRoot?.querySelector('textarea');
        if (textarea) {
            textarea.focus();
            const start = textarea.selectionStart;
            textarea.value = textarea.value.substring(0, start) + emojiCode + ' ' + textarea.value.substring(textarea.selectionEnd);
            const newPos = start + emojiCode.length + 1;
            textarea.setSelectionRange(newPos, newPos);
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
            showStatusMessage(wrapper, 'Emoji inserted!', 1000);
            return;
        }
        const lexicalEditor = composerElement.shadowRoot.querySelector('[data-lexical-editor="true"]');
        if (lexicalEditor) {
            lexicalEditor.focus();
            try {
                document.execCommand('insertText', false, emojiCode + ' ');
                showStatusMessage(wrapper, 'Emoji inserted!', 1000);
            } catch {
                const selection = window.getSelection();
                const textNode = document.createTextNode(emojiCode + ' ');
                if (selection.rangeCount) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(textNode);
                    range.setStartAfter(textNode);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    lexicalEditor.appendChild(textNode);
                }
                showStatusMessage(wrapper, 'Emoji inserted!', 1000);
            }
        }
    }

    function addEmojiPickerToCommentAreas() {
        document.querySelectorAll('shreddit-composer:not([data-emoji-picker-added="true"])').forEach(composer => {
            composer.setAttribute('data-emoji-picker-added', 'true');
            const wrapper = document.createElement('div');
            wrapper.className = 'emoji-picker-wrapper';
            wrapper.appendChild(createEmojiPickerButton());
            wrapper.appendChild(createStatusMessage());
            wrapper.appendChild(createEmojiPickerContainer(composer, wrapper));
            wrapper.appendChild(createConfigButton());
            wrapper.appendChild(createConfigPanel());
            composer.parentNode?.insertBefore(wrapper, composer);
        });
    }

    function observeDOM() {
        new MutationObserver((mutations) => {
            if (mutations.some(m => Array.from(m.addedNodes).some(n => n.nodeType === Node.ELEMENT_NODE &&
                (n.tagName === 'SHREDDIT-COMPOSER' || n.querySelector('shreddit-composer'))))) {
                setTimeout(addEmojiPickerToCommentAreas, 500);
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        injectStyles();
        if (config.autoSwitchToMarkdown) startMarkdownObserver();
        setTimeout(() => {
            addEmojiPickerToCommentAreas();
            observeDOM();
        }, 1000);
        setInterval(addEmojiPickerToCommentAreas, 3000);
    }

    document.readyState === 'complete' ? init() : window.addEventListener('load', init);
})();

// ==UserScript==
// @name         Reddit Emoji Picker Pro (updated with newer code)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Professional Reddit Emoji Picker with Modern UI
// @author       sadE
// @match        https://*.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538390/Reddit%20Emoji%20Picker%20Pro%20%28updated%20with%20newer%20code%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538390/Reddit%20Emoji%20Picker%20Pro%20%28updated%20with%20newer%20code%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Emoji data array (keeping original)
    const emotes = [{code:'[emote:t5_33td5:59888](http://img)',name:'Clueless',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Clueless.png'},{code:'[emote:t5_33td5:59889](http://img)',name:'Okayeg',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Okayeg.png'},{code:'[emote:t5_33td5:59890](http://img)',name:'cmonBruh',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/cmonBruh.png'},{code:'[emote:t5_33td5:59891](http://img)',name:'Copesen',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Copesen.png'},{code:'[emote:t5_33td5:59892](http://img)',name:'forsenCD',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenCD.png'},{code:'[emote:t5_33td5:59893](http://img)',name:'forsenE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenE.png'},{code:'[emote:t5_33td5:59894](http://img)',name:'tf',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/tf.png'},{code:'[emote:t5_33td5:59895](http://img)',name:'FeelsOkayMan',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/FeelsOkayMan.png'},{code:'[emote:t5_33td5:59896](http://img)',name:'gachiGASM',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/gachiGASM.png'},{code:'[emote:t5_33td5:59897](http://img)',name:'monkaOMEGA',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/monkaOMEGA.png'},{code:'[emote:t5_33td5:59898](http://img)',name:'LULE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/LULE.png'},{code:'[emote:t5_33td5:59899](http://img)',name:'OMEGALUL',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/OMEGALUL.png'},{code:'[emote:t5_33td5:59900](http://img)',name:'PagMan',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/PagMan.png'},{code:'[emote:t5_33td5:59901](http://img)',name:'forsenBased',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenBased.png'},{code:'[emote:t5_33td5:59902](http://img)',name:'Sadeg',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Sadeg.png'},{code:'[emote:t5_33td5:59903](http://img)',name:'forsenAlright',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenAlright.png'},{code:'[emote:t5_33td5:59904](http://img)',name:'forsenLevel',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenLevel.png'},{code:'[emote:t5_33td5:59905](http://img)',name:'pepeLaugh',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/pepeLaugh.png'},{code:'[emote:t5_33td5:59906](http://img)',name:'forsenDespair',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenDespair.png'},{code:'[emote:t5_33td5:53915](http://img)',name:'sadE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/sadE.png'},{code:'[emote:t5_33td5:53373](http://img)',name:'forsenMaxLevel',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenMaxLevel.png'},{code:'[emote:t5_33td5:9486](http://img)',name:'maoE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/maoE.png'},{code:'[emote:t5_33td5:9683](http://img)',name:'Wutface',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Wutface.png'},{code:'[emote:t5_33td5:5322](http://img)',name:'MegaLUL',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/MegaLUL.png'},{code:'[emote:t5_33td5:5359](http://img)',name:'Docsen',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Docsen.png'},{code:'[emote:t5_33td5:10257](http://img)',name:'amongE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/amongE.png'},{code:'[emote:t5_33td5:9671](http://img)',name:'Batchest',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Batchest.png'},{code:'[emote:t5_33td5:53371](http://img)',name:'forsenNugget',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/forsenNugget.png'},{code:'[emote:t5_33td5:53390](http://img)',name:'LongHairMaxLevel',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/LongHairMaxLevel.png'},{code:'[emote:t5_33td5:54526](http://img)',name:'Pewds',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Pewds.png'},{code:'[emote:t5_33td5:53563](http://img)',name:'monkaLaugh',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/monkaLaugh.png'},{code:'[emote:t5_33td5:55418](http://img)',name:'muv',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/muv.png'},{code:'[emote:t5_33td5:55894](http://img)',name:'snowman',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/snowman.png'},{code:'[emote:t5_33td5:55905](http://img)',name:'bbangrE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/bbangrE.png'},{code:'[emote:t5_33td5:56633](http://img)',name:'WeebsOut',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/WeebsOut.png'},{code:'[emote:t5_33td5:56664](http://img)',name:'freakE',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/freakE.png'},{code:'[emote:t5_33td5:57649](http://img)',name:'emiru',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/emiru.png'},{code:'[emote:t5_33td5:58897](http://img)',name:'wahhabi',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/wahhabi.png'},{code:'[emote:t5_33td5:58898](http://img)',name:'thisIsYouOnIslam',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/thisIsYouOnIslam.png'},{code:'[emote:t5_33td5:58899](http://img)',name:'familyPhoto',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/familyPhoto.png'},{code:'[emote:t5_33td5:58900](http://img)',name:'sheikh',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/sheikh.png'},{code:'[emote:t5_33td5:58901](http://img)',name:'Stoning',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Stoning.png'},{code:'[emote:t5_33td5:58913](http://img)',name:'turban',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/turban.png'},{code:'[emote:t5_33td5:58914](http://img)',name:'quranPepe',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/quranPepe.png'},{code:'[emote:t5_33td5:58948](http://img)',name:'desertLevel',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/desertLevel.png'},{code:'[emote:t5_33td5:58949](http://img)',name:'hesHalal',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/hesHalal.png'},{code:'[emote:t5_33td5:59909](http://img)',name:'Tomfoolery',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/Tomfoolery.png'},{code:'[emote:t5_33td5:60326](http://img)',name:'salute',url:'https://raw.githubusercontent.com/rarestemotes/emotes/main/images/salute.png'}];

    let config = GM_getValue('redditEmojiPickerConfig', { autoSwitchToMarkdown: true });
    let hasShownFormattingBar = false, hasSwitchedToMarkdown = false, mutationObserver = null;
    const addedElements = new Map();

    // Modern CSS with professional design system
    const styles = document.createElement('style');
    styles.textContent = `
        /* Button - Clean, minimal with subtle hover */
        .emoji-btn {
            background: transparent;
            border: none;
            border-radius: 6px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1);
            color: #878a8c;
        }
        .emoji-btn:hover {
            background: rgba(26, 26, 27, 0.1);
            color: #1c1c1c;
            transform: scale(1.05);
        }
        .emoji-btn svg {
            width: 18px;
            height: 18px;
        }

        /* Picker - Modern card design with backdrop blur */
        .emoji-picker {
            position: absolute;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(215, 218, 220, 0.4);
            border-radius: 12px;
            padding: 8px;
            width: 280px;
            max-height: 240px;
            overflow-y: auto;
            z-index: 10000;
            display: none;
            box-shadow:
                0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06),
                0 20px 25px -5px rgba(0, 0, 0, 0.1);
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 4px;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .emoji-picker {
                background: rgba(26, 26, 27, 0.95);
                border-color: rgba(52, 53, 54, 0.6);
            }
            .emoji-btn:hover {
                background: rgba(215, 218, 220, 0.1);
                color: #d7dadc;
            }
        }

        /* Emoji items - Rounded with smooth interactions */
        .emoji-item {
            width: 28px;
            height: 28px;
            cursor: pointer;
            border-radius: 6px;
            padding: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.12s ease;
            position: relative;
        }
        .emoji-item:hover {
            background: rgba(0, 121, 211, 0.1);
            transform: scale(1.1);
        }
        .emoji-item img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* Settings panel - Compact and clean */
        .emoji-settings {
            position: absolute;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(215, 218, 220, 0.4);
            border-radius: 8px;
            padding: 12px;
            width: 200px;
            z-index: 10001;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        @media (prefers-color-scheme: dark) {
            .emoji-settings {
                background: rgba(26, 26, 27, 0.98);
                border-color: rgba(52, 53, 54, 0.6);
                color: #d7dadc;
            }
        }

        .emoji-settings h3 {
            margin: 0 0 8px 0;
            font-size: 13px;
            font-weight: 600;
            color: inherit;
        }
        .emoji-settings label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            cursor: pointer;
        }
        .emoji-settings button {
            width: 100%;
            background: #0079d3;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px;
            margin-top: 8px;
            font-size: 11px;
            cursor: pointer;
            transition: background 0.15s;
        }
        .emoji-settings button:hover {
            background: #0061a9;
        }

        /* Wrapper and status */
        .emoji-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin: 4px 0;
        }
        .emoji-status {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            bottom: 100%;
            left: 0;
            margin-bottom: 4px;
            display: none;
            z-index: 10002;
        }

        /* Scrollbar styling for webkit browsers */
        .emoji-picker::-webkit-scrollbar {
            width: 4px;
        }
        .emoji-picker::-webkit-scrollbar-track {
            background: transparent;
        }
        .emoji-picker::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
        }
    `;
    document.head.appendChild(styles);

    // Create main button with modern icon
    const createButton = () => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.title = 'Emojis';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>`;
        btn.addEventListener('click', togglePicker, true);
        return btn;
    };

    // Toggle picker visibility
    const togglePicker = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const picker = e.currentTarget.parentNode.querySelector('.emoji-picker');
        const isHidden = picker.style.display === 'none';

        // Close all other pickers
        document.querySelectorAll('.emoji-picker, .emoji-settings').forEach(p => p.style.display = 'none');

        if (isHidden) {
            picker.style.display = 'grid';
        }
    };

    // Create settings button
    const createSettingsBtn = () => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.title = 'Settings';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>`;
        btn.addEventListener('click', toggleSettings, true);
        return btn;
    };

    // Toggle settings panel
    const toggleSettings = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const panel = e.currentTarget.parentNode.querySelector('.emoji-settings');
        const isHidden = panel.style.display === 'none';

        document.querySelectorAll('.emoji-settings').forEach(p => p.style.display = 'none');

        if (isHidden) {
            panel.style.display = 'block';
        }
    };

    // Show status message
    const showStatus = (wrapper, message, duration = 2000) => {
        const status = wrapper.querySelector('.emoji-status');
        if (status) {
            status.textContent = message;
            status.style.display = 'block';
            setTimeout(() => status.style.display = 'none', duration);
        }
    };

    // Create settings panel
    const createSettings = () => {
        const panel = document.createElement('div');
        panel.className = 'emoji-settings';
        panel.innerHTML = `
            <h3>Settings</h3>
            <label>
                <input type="checkbox" id="auto-markdown" ${config.autoSwitchToMarkdown ? 'checked' : ''}>
                Auto-switch to Markdown
            </label>
            <button type="button">Save</button>
        `;

        panel.querySelector('button').addEventListener('click', (e) => {
            e.preventDefault();
            const checkbox = panel.querySelector('#auto-markdown');
            const prevConfig = {...config};

            config.autoSwitchToMarkdown = checkbox.checked;
            GM_setValue('redditEmojiPickerConfig', config);

            if (config.autoSwitchToMarkdown && !prevConfig.autoSwitchToMarkdown) {
                enableAutoSwitch();
            } else if (!config.autoSwitchToMarkdown && prevConfig.autoSwitchToMarkdown) {
                disableAutoSwitch();
            }

            panel.style.display = 'none';
            showStatus(panel.parentNode, 'Saved!');
        });

        return panel;
    };

    // Create emoji picker
    const createPicker = (composer, wrapper) => {
        const picker = document.createElement('div');
        picker.className = 'emoji-picker';
        picker.style.display = 'none';

        emotes.forEach(emote => {
            const item = document.createElement('div');
            item.className = 'emoji-item';
            item.title = emote.name;
            item.innerHTML = `<img src="${emote.url}" alt="${emote.name}">`;

            item.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const submitBtn = composer.closest('faceplate-form')?.querySelector('button[slot="submit-button"]') ||
                                composer.querySelector('button[slot="submit-button"]');
                const wasDisabled = submitBtn?.disabled ?? false;

                if (submitBtn) submitBtn.disabled = true;

                try {
                    if (config.autoSwitchToMarkdown) {
                        await switchToMarkdown(composer);
                        await new Promise(resolve => setTimeout(resolve, 300));
                    } else {
                        await switchToMarkdown(composer);
                    }

                    const textArea = composer.shadowRoot?.querySelector('shreddit-markdown-composer textarea') ||
                                   composer.shadowRoot?.querySelector('[data-lexical-editor="true"]');

                    if (textArea) textArea.focus();
                    await new Promise(resolve => setTimeout(resolve, 50));

                    await insertEmote(emote.code, composer, wrapper);

                    if (submitBtn && !wasDisabled) {
                        setTimeout(() => submitBtn.disabled = false, 100);
                    }
                } catch (error) {
                    showStatus(wrapper, 'Error', 2000);
                    if (submitBtn && !wasDisabled) {
                        setTimeout(() => submitBtn.disabled = false, 300);
                    }
                }

                picker.style.display = 'none';
            }, true);

            picker.appendChild(item);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && !wrapper.querySelector('.emoji-btn').contains(e.target)) {
                picker.style.display = 'none';
            }
        }, false);

        return picker;
    };

    // Helper to find all shadow DOM elements
    const getAllElements = (root = document) => {
        const elements = Array.from(root.querySelectorAll('*'));
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) {
                elements.push(...getAllElements(el.shadowRoot));
            }
        });
        return elements;
    };

    // Switch to markdown mode
    const switchToMarkdown = (composer) => new Promise(resolve => {
        if (!composer?.shadowRoot) return resolve();

        // Try lexical editor first
        const lexicalEditor = composer.shadowRoot.querySelector('[data-lexical-editor="true"]');
        if (lexicalEditor) {
            lexicalEditor.click();
            lexicalEditor.focus();
            return setTimeout(resolve, 100);
        }

        // Try markdown composer
        const markdownComposer = composer.shadowRoot.querySelector('shreddit-markdown-composer');
        const textarea = markdownComposer?.shadowRoot?.querySelector('textarea');
        if (textarea) {
            textarea.click();
            textarea.focus();
            return setTimeout(resolve, 100);
        }

        // Try trigger button to switch modes
        const triggerBtn = composer.shadowRoot.querySelector('[data-testid="trigger-button"]');
        if (triggerBtn) {
            triggerBtn.click();
            return setTimeout(resolve, 300);
        }

        resolve();
    });

    // Auto-switch functionality for markdown mode
    const autoSwitchToMarkdown = (root = document.body) => {
        if (!config.autoSwitchToMarkdown) return;

        const rootElements = root.shadowRoot || root;

        if (!hasShownFormattingBar) {
            const formattingData = rootElements === document.body ?
                getAllElements(rootElements).filter(el =>
                    el.tagName === 'DATA' &&
                    el.getAttribute('data-key') === 'formattingBar' &&
                    el.getAttribute('data-show-formatting-bar') === 'false'
                ) :
                Array.from(rootElements.querySelectorAll('data[data-key="formattingBar"][data-show-formatting-bar="false"]'));

            if (formattingData.length) {
                const toolbarButtons = rootElements === document.body ?
                    getAllElements(rootElements).filter(el => el.tagName === 'RTE-TOOLBAR-BUTTON') :
                    Array.from(rootElements.querySelectorAll('rte-toolbar-button'));

                for (const btn of toolbarButtons) {
                    if (btn.offsetParent && btn.getAttribute('screenreadercontent') === 'Show formatting options') {
                        btn.click();
                        hasShownFormattingBar = true;
                        setTimeout(() => switchToMarkdownEditor(rootElements), 300);
                        break;
                    }
                }
            } else {
                switchToMarkdownEditor(rootElements);
            }
        }
    };

    const switchToMarkdownEditor = (root) => {
        if (hasSwitchedToMarkdown) return;

        const markdownButtons = root === document.body ?
            getAllElements(root).filter(el =>
                el.tagName === 'BUTTON' &&
                el.getAttribute('aria-label') === 'Switch to Markdown Editor'
            ) :
            Array.from(root.querySelectorAll('button[aria-label="Switch to Markdown Editor"]'));

        if (markdownButtons.length && markdownButtons[0].offsetParent) {
            markdownButtons[0].click();
            hasSwitchedToMarkdown = true;
        }
    };

    // Insert emote into composer
    const insertEmote = (code, composer, wrapper) => {
        if (!composer?.shadowRoot) return;

        // Try markdown textarea first
        const markdownComposer = composer.shadowRoot.querySelector('shreddit-markdown-composer');
        const textarea = markdownComposer?.shadowRoot?.querySelector('textarea');

        if (textarea) {
            textarea.focus();
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const textBefore = textarea.value.substring(0, startPos);
            const textAfter = textarea.value.substring(endPos);

            textarea.value = textBefore + code + ' ' + textAfter;
            const newPos = startPos + code.length + 1;
            textarea.setSelectionRange(newPos, newPos);

            // Trigger events to notify Reddit
            textarea.dispatchEvent(new Event('input', {bubbles: true}));
            textarea.dispatchEvent(new Event('change', {bubbles: true}));

            showStatus(wrapper, 'Added!', 1000);
            return;
        }

        // Fallback to lexical editor
        const lexicalEditor = composer.shadowRoot.querySelector('[data-lexical-editor="true"]');
        if (lexicalEditor) {
            lexicalEditor.focus();

            try {
                // Try modern insertText command
                if (document.execCommand('insertText', false, code + ' ')) {
                    showStatus(wrapper, 'Added!', 1000);
                    return;
                }
            } catch (e) {
                // Fall back to manual insertion
            }

            // Manual insertion fallback
            const selection = window.getSelection();
            const textNode = document.createTextNode(code + ' ');

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

            showStatus(wrapper, 'Added!', 1000);
        }
    };

    // Initialize composers
    const initComposers = () => {
        document.querySelectorAll('shreddit-composer:not([data-emoji-picker-added="true"])').forEach(composer => {
            composer.setAttribute('data-emoji-picker-added', 'true');

            const wrapper = document.createElement('div');
            wrapper.className = 'emoji-wrapper';

            const statusDiv = document.createElement('div');
            statusDiv.className = 'emoji-status';

            wrapper.appendChild(createButton());
            wrapper.appendChild(statusDiv);
            wrapper.appendChild(createPicker(composer, wrapper));
            wrapper.appendChild(createSettingsBtn());
            wrapper.appendChild(createSettings());

            composer.parentNode?.insertBefore(wrapper, composer);
        });
    };

    // Track composers and handle auto-switching
    const trackComposers = () => {
        getAllElements(document).filter(el => el.tagName === 'SHREDDIT-COMPOSER').forEach(composer => {
            if (!addedElements.has(composer)) {
                addedElements.set(composer, true);
                switchToMarkdown(composer).then(() => {
                    setTimeout(() => {
                        if (config.autoSwitchToMarkdown) {
                            hasShownFormattingBar = false;
                            hasSwitchedToMarkdown = false;
                            autoSwitchToMarkdown(composer);
                        }
                    }, 750);
                });
            }
        });

        // Clean up removed elements
        addedElements.forEach((value, element) => {
            if (!document.contains(element)) {
                addedElements.delete(element);
            }
        });
    };

    // Auto-switch functionality (simplified)
    const enableAutoSwitch = () => {
        if (!mutationObserver) {
            mutationObserver = new MutationObserver(() => {
                autoSwitchToMarkdown();
                trackComposers();
            });
            mutationObserver.observe(document.body, {childList: true, subtree: true});
            trackComposers();
        }
    };

    const disableAutoSwitch = () => {
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
            hasShownFormattingBar = false;
            hasSwitchedToMarkdown = false;
            addedElements.clear();
        }
    };

    // Setup mutation observer for new composers
    const setupObserver = () => {
        new MutationObserver(mutations => {
            const hasNewComposer = mutations.some(mutation =>
                Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.tagName === 'SHREDDIT-COMPOSER' || node.querySelector('shreddit-composer'))
                )
            );
            if (hasNewComposer) setTimeout(initComposers, 500);
        }).observe(document.body, {childList: true, subtree: true});
    };

    // Initialize
    const init = () => {
        if (config.autoSwitchToMarkdown) enableAutoSwitch();
        setTimeout(() => {
            initComposers();
            setupObserver();
        }, 1000);
        setInterval(initComposers, 3000);
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
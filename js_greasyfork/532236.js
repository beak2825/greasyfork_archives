// ==UserScript==
// @name         Anti Bubble Spam
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Merges consecutive chat messages from the same user in Torn.com, with customizable background colors and options. Supports bubble and classic mode.
// @author       Elaine [2047176]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532236/Anti%20Bubble%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/532236/Anti%20Bubble%20Spam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Konfiguration ---
    const SCRIPT_ID_PREFIX = 'antiBubbleSpam_';
    const CHAT_ROOT_ID = 'chatRoot';
    const MESSAGE_LIST_SELECTOR = 'div[class*="list___"]';
    const MESSAGE_ITEM_SELECTOR = 'div[class*="item___"]';

    const MESSAGE_ROOT_SELECTOR = `div[class*="list___"] > div[class^="root___"]`;
    const MESSAGE_BOX_SELECTOR = `div[class^="box___"]`;
    const MESSAGE_TEXT_CONTAINER_SELECTOR = `p[class*="message___"], span[class*="message___"]`;

    const SENDER_LINK_SELECTOR = `a[href*="/profiles.php?XID="][class*="sender___"]`;
    const SENDER_CONTAINER_SELECTOR_BUBBLE = `span[class*="senderContainer___"]`;

    const SELF_MESSAGE_CLASS_PART_BUBBLE = 'self___';
    const TIMESTAMP_DIVIDER_SELECTOR = `div[class*="messageGroupTimestamp___"]`;

    const DATA_ORIGINAL_HTML_ATTR = 'data-original-html';
    const SETTINGS_PANEL_SELECTOR = `#settings_panel div[class*="content___"]`;
    const CLASSIC_MODE_LIST_CLASS = 'classic___HVCmX';

    const NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS = 'abs-no-newline-bubble-agg';
    const NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS = 'abs-no-newline-classic-agg';

    const DEFAULT_SETTINGS = {
        bgColor1_rgb: "0,0,0",
        bgColor1_alpha: 0.1,
        bgColor2_rgb: "255,255,255",
        bgColor2_alpha: 0.05,
        enabled: true,
        startFirstMessageOnNewLine: true,
        useAlternatingBackgrounds: true
    };
    let currentSettings = { ...DEFAULT_SETTINGS };
    let styleElement = null;
    let colorSetting1Div = null;
    let colorSetting2Div = null;


    function isClassicMode(messageElementOrList) {
        const listElement = messageElementOrList.matches(MESSAGE_LIST_SELECTOR)
            ? messageElementOrList
            : messageElementOrList.closest(MESSAGE_LIST_SELECTOR);
        return listElement ? listElement.classList.contains(CLASSIC_MODE_LIST_CLASS) : false;
    }

    function loadSettings() {
        currentSettings.bgColor1_rgb = GM_getValue(SCRIPT_ID_PREFIX + 'bgColor1_rgb', DEFAULT_SETTINGS.bgColor1_rgb);
        currentSettings.bgColor1_alpha = parseFloat(GM_getValue(SCRIPT_ID_PREFIX + 'bgColor1_alpha', DEFAULT_SETTINGS.bgColor1_alpha));
        currentSettings.bgColor2_rgb = GM_getValue(SCRIPT_ID_PREFIX + 'bgColor2_rgb', DEFAULT_SETTINGS.bgColor2_rgb);
        currentSettings.bgColor2_alpha = parseFloat(GM_getValue(SCRIPT_ID_PREFIX + 'bgColor2_alpha', DEFAULT_SETTINGS.bgColor2_alpha));
        currentSettings.enabled = GM_getValue(SCRIPT_ID_PREFIX + 'enabled', DEFAULT_SETTINGS.enabled);
        currentSettings.startFirstMessageOnNewLine = GM_getValue(SCRIPT_ID_PREFIX + 'startFirstMessageOnNewLine', DEFAULT_SETTINGS.startFirstMessageOnNewLine);
        currentSettings.useAlternatingBackgrounds = GM_getValue(SCRIPT_ID_PREFIX + 'useAlternatingBackgrounds', DEFAULT_SETTINGS.useAlternatingBackgrounds);
    }

    function saveSettings() {
        GM_setValue(SCRIPT_ID_PREFIX + 'bgColor1_rgb', currentSettings.bgColor1_rgb);
        GM_setValue(SCRIPT_ID_PREFIX + 'bgColor1_alpha', currentSettings.bgColor1_alpha);
        GM_setValue(SCRIPT_ID_PREFIX + 'bgColor2_rgb', currentSettings.bgColor2_rgb);
        GM_setValue(SCRIPT_ID_PREFIX + 'bgColor2_alpha', currentSettings.bgColor2_alpha);
        GM_setValue(SCRIPT_ID_PREFIX + 'enabled', currentSettings.enabled);
        GM_setValue(SCRIPT_ID_PREFIX + 'startFirstMessageOnNewLine', currentSettings.startFirstMessageOnNewLine);
        GM_setValue(SCRIPT_ID_PREFIX + 'useAlternatingBackgrounds', currentSettings.useAlternatingBackgrounds);
    }

    function hexToRgbString(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}` : null;
    }

    function rgbStringToHex(rgbString) {
        if (!rgbString) return "#000000";
        const rgbArray = rgbString.split(',').map(Number);
        return "#" + rgbArray.map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join('');
    }

    function updateStyles() {
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = SCRIPT_ID_PREFIX + 'dynamic_styles';
            document.head.appendChild(styleElement);
        }
        if (!currentSettings.enabled) {
            styleElement.innerHTML = ''; // Clear styles if script is disabled
            return;
        }

        let css = `
            .merged-message-wrapper .merged-message-content {
                display: block; padding: 1px 3px; margin: 0; border-radius: 3px;
            }
            .${CLASSIC_MODE_LIST_CLASS} .merged-message-wrapper > ${MESSAGE_BOX_SELECTOR} {}
        `;

        if (currentSettings.useAlternatingBackgrounds) {
            css += `
                .merged-message-wrapper .merged-message-content:nth-child(odd) {
                    background-color: rgba(${currentSettings.bgColor1_rgb}, ${currentSettings.bgColor1_alpha});
                }
                .merged-message-wrapper .merged-message-content:nth-child(even) {
                    background-color: rgba(${currentSettings.bgColor2_rgb}, ${currentSettings.bgColor2_alpha});
                }
            `;
        } else {
            // Ensure no background is applied if option is off
            css += `
                .merged-message-wrapper .merged-message-content:nth-child(odd),
                .merged-message-wrapper .merged-message-content:nth-child(even) {
                    background-color: transparent !important;
                }
            `;
        }

        // Styles for newline option
        css += `
            ${MESSAGE_BOX_SELECTOR} > span[class*="senderContainer___"] + .${NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS} {
                display: inline !important; margin-left: 0.3em;
            }
            .${NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS} > .merged-message-content:first-child {
                display: inline !important;
            }
            .${NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS} > .merged-message-content:not(:first-child) {
                display: block !important;
            }
            .${NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS} > .merged-message-content:first-child {
                display: inline !important; margin-left: 0.3em;
            }
        `;
        styleElement.innerHTML = css;
    }

    function toggleColorSettingsDisabledState(disabled) {
        const elementsToToggle = [];
        if (colorSetting1Div) elementsToToggle.push(colorSetting1Div);
        if (colorSetting2Div) elementsToToggle.push(colorSetting2Div);

        elementsToToggle.forEach(container => {
            container.style.opacity = disabled ? '0.5' : '1';
            const inputs = container.querySelectorAll('input');
            inputs.forEach(input => input.disabled = disabled);
        });
    }


    function createSettingsUI() {
        const settingsPanelContent = document.querySelector(SETTINGS_PANEL_SELECTOR);
        if (!settingsPanelContent) return;

        const protoCheckboxLabel = settingsPanelContent.querySelector('label[class*="subtitle___"][class^="root___"]:has(input[type="checkbox"])');
        const checkboxLabelClass = protoCheckboxLabel ? protoCheckboxLabel.className : 'abs-checkbox-label';

        const protoSectionTitle = settingsPanelContent.querySelector(`span[class^="header___"]`);
        const sectionTitleClass = protoSectionTitle ? protoSectionTitle.className : 'abs-section-title';

        const protoSettingsContainer = settingsPanelContent.querySelector(`div[class^="root___"]:has(span[class^="header___"])`);
        const settingsContainerClass = protoSettingsContainer ? protoSettingsContainer.className : 'abs-settings-block';

        const generalSettingsSliderContainer = settingsPanelContent.querySelector('div[class*="panelSizeContainer___"] > div[class^="root___"]');
        const sliderContainerClass = generalSettingsSliderContainer ? generalSettingsSliderContainer.className : 'abs-slider-container';

        const protoSliderLabel = generalSettingsSliderContainer ? generalSettingsSliderContainer.querySelector(`label[class^="label___"]`) : null;
        const sliderLabelClass = protoSliderLabel ? protoSliderLabel.className : 'abs-slider-label';

        const protoSliderInput = generalSettingsSliderContainer ? generalSettingsSliderContainer.querySelector(`input[type="range"][class^="range___"]`) : null;
        const sliderInputClass = protoSliderInput ? protoSliderInput.className : 'abs-slider-input';


        const separator = document.createElement('div');
        separator.style.height = '1px';
        separator.style.backgroundColor = 'var(--chat-divider-color, #444)';
        separator.style.margin = '15px 0';

        const sectionTitleElement = document.createElement('span');
        sectionTitleElement.className = sectionTitleClass;
        sectionTitleElement.textContent = 'Anti Bubble Spam Settings';
        sectionTitleElement.style.display = 'block';
        sectionTitleElement.style.marginBottom = '8px';

        const settingsContainerElement = document.createElement('div');
        settingsContainerElement.className = settingsContainerClass;
        settingsContainerElement.style.marginBottom = '15px';

        const enableLabel = document.createElement('label');
        enableLabel.className = checkboxLabelClass;
        enableLabel.style.display = 'flex';
        enableLabel.style.alignItems = 'center';
        enableLabel.style.marginBottom = '10px';

        const enableCheckbox = document.createElement('input');
        enableCheckbox.type = 'checkbox';
        enableCheckbox.checked = currentSettings.enabled;
        enableCheckbox.id = SCRIPT_ID_PREFIX + 'enable_script';
        enableCheckbox.style.marginRight = '8px';
        enableCheckbox.addEventListener('change', (e) => {
            currentSettings.enabled = e.target.checked;
            saveSettings();
            updateStyles(); // Update styles immediately
            processAllOpenChatLists(); // Re-process chats to apply/remove merging
        });
        enableLabel.appendChild(enableCheckbox);
        enableLabel.append(' Enable Anti Bubble Spam');
        settingsContainerElement.appendChild(enableLabel);

        const newLineLabel = document.createElement('label');
        newLineLabel.className = checkboxLabelClass;
        newLineLabel.style.display = 'flex';
        newLineLabel.style.alignItems = 'center';
        newLineLabel.style.marginBottom = '10px';

        const newLineCheckbox = document.createElement('input');
        newLineCheckbox.type = 'checkbox';
        newLineCheckbox.checked = currentSettings.startFirstMessageOnNewLine;
        newLineCheckbox.id = SCRIPT_ID_PREFIX + 'newLine_script';
        newLineCheckbox.style.marginRight = '8px';
        newLineCheckbox.addEventListener('change', (e) => {
            currentSettings.startFirstMessageOnNewLine = e.target.checked;
            saveSettings();
            updateStyles();
            processAllOpenChatLists();
        });
        newLineLabel.appendChild(newLineCheckbox);
        newLineLabel.append(' Start first message on new line');
        settingsContainerElement.appendChild(newLineLabel);

        const altBgLabel = document.createElement('label');
        altBgLabel.className = checkboxLabelClass;
        altBgLabel.style.display = 'flex';
        altBgLabel.style.alignItems = 'center';
        altBgLabel.style.marginBottom = '15px';

        const altBgCheckbox = document.createElement('input');
        altBgCheckbox.type = 'checkbox';
        altBgCheckbox.checked = currentSettings.useAlternatingBackgrounds;
        altBgCheckbox.id = SCRIPT_ID_PREFIX + 'altBg_script';
        altBgCheckbox.style.marginRight = '8px';
        altBgCheckbox.addEventListener('change', (e) => {
            currentSettings.useAlternatingBackgrounds = e.target.checked;
            saveSettings();
            updateStyles();
            toggleColorSettingsDisabledState(!currentSettings.useAlternatingBackgrounds);
        });
        altBgLabel.appendChild(altBgCheckbox);
        altBgLabel.append(' Use alternating background colors');
        settingsContainerElement.appendChild(altBgLabel);


        function updateSliderBackground(slider) {
            const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
            slider.style.background = `linear-gradient(to right, var(--chat-range-progress-color-default) ${value}%, var(--chat-range-range-color) ${value}%, var(--chat-range-range-color) 100%)`;
        }

        function createColorSetting(idPrefix, labelText) {
            const mainSettingDiv = document.createElement('div');
            mainSettingDiv.style.marginTop = '10px';
            mainSettingDiv.style.display = 'flex';
            mainSettingDiv.style.flexDirection = 'column';
            mainSettingDiv.style.gap = '8px';

            const colorRowDiv = document.createElement('div');
            colorRowDiv.style.display = 'flex';
            colorRowDiv.style.alignItems = 'center';

            const colorLabel = document.createElement('label');
            colorLabel.className = sliderLabelClass;
            colorLabel.textContent = labelText + ': ';
            colorLabel.style.minWidth = '160px';
            colorLabel.style.marginRight = '5px';

            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = rgbStringToHex(currentSettings[idPrefix + '_rgb']);
            colorInput.style.minWidth = '40px';
            colorInput.style.height = '25px';
            colorInput.style.padding = '0 2px';
            colorInput.style.border = '1px solid #555';
            colorInput.style.backgroundColor = '#333';
            colorInput.addEventListener('input', (e) => {
                const rgb = hexToRgbString(e.target.value);
                if (rgb) {
                    currentSettings[idPrefix + '_rgb'] = rgb;
                    saveSettings();
                    updateStyles();
                }
            });
            colorRowDiv.appendChild(colorLabel);
            colorRowDiv.appendChild(colorInput);

            const alphaSliderDiv = document.createElement('div');
            alphaSliderDiv.className = sliderContainerClass;

            const alphaLabelElement = document.createElement('label');
            alphaLabelElement.className = sliderLabelClass;
            const updateAlphaLabelText = () => {
                alphaLabelElement.textContent = `Alpha (${(currentSettings[idPrefix + '_alpha'] * 100).toFixed(0)}%)`;
            };
            updateAlphaLabelText();

            const alphaSlider = document.createElement('input');
            alphaSlider.type = 'range';
            alphaSlider.min = '0';
            alphaSlider.max = '1';
            alphaSlider.step = '0.01';
            alphaSlider.value = currentSettings[idPrefix + '_alpha'];
            alphaSlider.className = sliderInputClass;
            updateSliderBackground(alphaSlider);

            alphaSlider.addEventListener('input', (e) => {
                currentSettings[idPrefix + '_alpha'] = parseFloat(e.target.value);
                updateAlphaLabelText();
                updateSliderBackground(e.target);
                saveSettings();
                updateStyles();
            });

            alphaSliderDiv.appendChild(alphaLabelElement);
            alphaSliderDiv.appendChild(alphaSlider);

            mainSettingDiv.appendChild(colorRowDiv);
            mainSettingDiv.appendChild(alphaSliderDiv);
            return mainSettingDiv;
        }

        colorSetting1Div = createColorSetting('bgColor1', 'Background 1 (Odd)');
        colorSetting2Div = createColorSetting('bgColor2', 'Background 2 (Even)');
        settingsContainerElement.appendChild(colorSetting1Div);
        settingsContainerElement.appendChild(colorSetting2Div);

        toggleColorSettingsDisabledState(!currentSettings.useAlternatingBackgrounds);


        const messageStylingSection = Array.from(settingsPanelContent.children).find(child =>
            child.querySelector('span[class*="header___"]')?.textContent.includes('Message Styling Settings')
        );

        if (messageStylingSection) {
            settingsPanelContent.insertBefore(separator, messageStylingSection);
            settingsPanelContent.insertBefore(sectionTitleElement, messageStylingSection);
            settingsPanelContent.insertBefore(settingsContainerElement, messageStylingSection);
        } else {
            settingsPanelContent.appendChild(separator);
            settingsPanelContent.appendChild(sectionTitleElement);
            settingsContainerElement.appendChild(settingsContainerElement);
        }
    }

    function getSenderInfo(messageElement) {
        const classic = isClassicMode(messageElement);
        let isSelfMessage = false;

        if (classic) {
            if (messageElement.style.outlineColor === 'rgb(170, 0, 110)' || messageElement.style.outline.includes('rgb(170, 0, 110)')) {
                isSelfMessage = true;
            }
        } else {
            if (messageElement.className.includes(SELF_MESSAGE_CLASS_PART_BUBBLE)) {
                isSelfMessage = true;
            }
        }

        if (isSelfMessage) {
            return { id: 'self', nameElement: null, isSelf: true, classic: classic };
        }

        let senderLinkElement;
        let nameElementContainer;
        const boxElement = messageElement.querySelector(MESSAGE_BOX_SELECTOR);
        if (!boxElement) return { id: 'other_unknown_nobox_' + Date.now() + Math.random(), nameElement: null, isSelf: false, classic: classic };


        if (classic) {
            const senderSpan = boxElement.querySelector('span:first-child');
            senderLinkElement = senderSpan ? senderSpan.querySelector('a[href*="profiles.php?XID="]') : null;
            nameElementContainer = senderSpan ? senderSpan.cloneNode(true) : null;
        } else {
            senderLinkElement = boxElement.querySelector(SENDER_LINK_SELECTOR);
            nameElementContainer = boxElement.querySelector(SENDER_CONTAINER_SELECTOR_BUBBLE)?.cloneNode(true);
        }

        if (senderLinkElement) {
            const href = senderLinkElement.getAttribute('href');
            const match = href.match(/XID=(\d+)/);
            const senderId = match ? match[1] : senderLinkElement.textContent.trim().replace(':', '');
            return { id: senderId, nameElement: nameElementContainer, isSelf: false, classic: classic };
        }

        if (!classic) {
            const chatWindow = messageElement.closest('div[id^="private-"]');
            if (chatWindow) {
                return { id: `other_private_${chatWindow.id}`, nameElement: null, isSelf: false, classic: classic };
            }
        }
        return { id: 'other_unknown_' + Date.now() + Math.random(), nameElement: null, isSelf: false, classic: classic };
    }

    function storeOriginalHTMLIfNotExists(messageElement) {
        if (!messageElement.hasAttribute(DATA_ORIGINAL_HTML_ATTR)) {
            const boxElement = messageElement.querySelector(MESSAGE_BOX_SELECTOR);
            if (!boxElement) {
                 messageElement.setAttribute(DATA_ORIGINAL_HTML_ATTR, '');
                 return;
            }
            const messageTextParent = boxElement.querySelector(MESSAGE_TEXT_CONTAINER_SELECTOR);
            const rawHtml = messageTextParent ? messageTextParent.innerHTML : '';
            messageElement.setAttribute(DATA_ORIGINAL_HTML_ATTR, rawHtml);
        }
    }

    function getMessageContents(messageElement) {
        const originalHtml = messageElement.getAttribute(DATA_ORIGINAL_HTML_ATTR);
        if (originalHtml === null || originalHtml.trim() === '') return null;
        const contentSpan = document.createElement('span');
        contentSpan.className = 'merged-message-content';
        contentSpan.innerHTML = originalHtml;
        return contentSpan;
    }

    function mergeGroup(group) {
        // Unmerging logic: Restore original HTML for each message in the group
        if (!currentSettings.enabled || !group || group.length < 2) {
            group.forEach(msgNode => {
                msgNode.style.display = '';
                msgNode.classList.remove('merged-message-wrapper', 'self-merged', 'processed-by-antibubble');

                const boxElement = msgNode.querySelector(MESSAGE_BOX_SELECTOR);
                if (boxElement) {
                    const textAggregator = boxElement.querySelector(MESSAGE_TEXT_CONTAINER_SELECTOR);
                    if (textAggregator) {
                        textAggregator.classList.remove(NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS, NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS);
                        const originalHtml = msgNode.getAttribute(DATA_ORIGINAL_HTML_ATTR);
                        if (originalHtml !== null) { // Ensure attribute exists
                            textAggregator.innerHTML = originalHtml;
                        }
                    }
                }
            });
            return;
        }

        // Merging logic
        const firstMessageNode = group[0];
        const senderInfo = getSenderInfo(firstMessageNode);

        firstMessageNode.classList.add('merged-message-wrapper');
        if (senderInfo.isSelf) firstMessageNode.classList.add('self-merged');

        let messageTextAggregator;
        const boxElement = firstMessageNode.querySelector(MESSAGE_BOX_SELECTOR);
        if (!boxElement) return;


        if (senderInfo.classic) {
            messageTextAggregator = boxElement.querySelector(MESSAGE_TEXT_CONTAINER_SELECTOR);
            if (!messageTextAggregator) {
                messageTextAggregator = document.createElement('span');
                const bodySpan = boxElement.querySelector('span[class*="body___"]');
                messageTextAggregator.className = bodySpan ? bodySpan.className.replace(/body___[^ ]+/, 'message___') : 'message___';
                messageTextAggregator.classList.add('abs-classic-text-aggregator-fallback');
                boxElement.appendChild(messageTextAggregator);
            }
            messageTextAggregator.classList.remove(NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS);
            if (!currentSettings.startFirstMessageOnNewLine) {
                messageTextAggregator.classList.add(NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS);
            } else {
                messageTextAggregator.classList.remove(NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS);
            }
        } else {
            if (!senderInfo.isSelf && senderInfo.nameElement) {
                const existingSenderContainer = boxElement.querySelector(SENDER_CONTAINER_SELECTOR_BUBBLE);
                if (existingSenderContainer) existingSenderContainer.classList.add('merged-sender-name');
            }
            messageTextAggregator = boxElement.querySelector(MESSAGE_TEXT_CONTAINER_SELECTOR);
            if (!messageTextAggregator) {
                messageTextAggregator = document.createElement(senderInfo.isSelf ? 'p' : 'span');
                const bodyElement = boxElement.querySelector('p[class*="body___"], span[class*="body___"]');
                messageTextAggregator.className = bodyElement ? bodyElement.className.replace(/body___[^ ]+/, 'message___') : 'message___';
                messageTextAggregator.classList.add('abs-bubble-text-aggregator-fallback');
                boxElement.appendChild(messageTextAggregator);
            }
            messageTextAggregator.classList.remove(NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS);
            if (!currentSettings.startFirstMessageOnNewLine && !senderInfo.isSelf) {
                messageTextAggregator.classList.add(NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS);
            } else {
                messageTextAggregator.classList.remove(NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS);
            }
        }

        if (!messageTextAggregator) return;
        messageTextAggregator.innerHTML = '';

        group.forEach((msgNodeInGroup) => {
            storeOriginalHTMLIfNotExists(msgNodeInGroup);
            const contentSpan = getMessageContents(msgNodeInGroup);
            if (contentSpan) {
                messageTextAggregator.appendChild(contentSpan);
            }
        });

        for (let k = 0; k < group.length; k++) {
            if (k > 0) group[k].style.display = 'none';
            group[k].classList.add('processed-by-antibubble');
        }
    }

    function processMessagesInList(messageListElement) {
        // --- RESET PHASE ---
        Array.from(messageListElement.children).forEach(child => {
            if (child.matches(MESSAGE_ROOT_SELECTOR)) {
                child.style.display = '';
                child.classList.remove('merged-message-wrapper', 'self-merged', 'processed-by-antibubble');

                const boxElement = child.querySelector(MESSAGE_BOX_SELECTOR);
                if (boxElement) {
                    const textContainer = boxElement.querySelector(MESSAGE_TEXT_CONTAINER_SELECTOR);
                    if (textContainer) {
                        textContainer.classList.remove(NO_NEWLINE_FIRST_BUBBLE_AGGREGATOR_CLASS, NO_NEWLINE_FIRST_CLASSIC_AGGREGATOR_CLASS);
                        const originalHtml = child.getAttribute(DATA_ORIGINAL_HTML_ATTR);
                        if (originalHtml !== null) {
                            textContainer.innerHTML = originalHtml;
                        }
                    }
                }
            }
        });

        if (!currentSettings.enabled) {
            updateStyles();
            return;
        }
        // --- END RESET PHASE ---

        Array.from(messageListElement.children).forEach(child => {
            if (child.matches(MESSAGE_ROOT_SELECTOR)) storeOriginalHTMLIfNotExists(child);
        });

        const children = Array.from(messageListElement.children);
        let lastSenderId = null;
        let currentMessageGroup = [];

        for (let i = 0; i < children.length; i++) {
            const currentElement = children[i];
            if (currentElement.style.display === 'none' && currentElement.classList.contains('processed-by-antibubble')) continue;

            if (!currentElement.matches(MESSAGE_ROOT_SELECTOR) || currentElement.matches(TIMESTAMP_DIVIDER_SELECTOR)) {
                if (currentMessageGroup.length > 0) mergeGroup(currentMessageGroup);
                currentMessageGroup = []; lastSenderId = null; continue;
            }
            const senderInfo = getSenderInfo(currentElement);
            if (senderInfo.id && senderInfo.id === lastSenderId) {
                currentMessageGroup.push(currentElement);
            } else {
                if (currentMessageGroup.length > 0) mergeGroup(currentMessageGroup);
                currentMessageGroup = [currentElement]; lastSenderId = senderInfo.id;
            }
        }
        if (currentMessageGroup.length > 0) mergeGroup(currentMessageGroup);
        updateStyles();
    }

    function processAllOpenChatLists() {
        const chatRootElement = document.getElementById(CHAT_ROOT_ID);
        if (chatRootElement) {
            const allLists = chatRootElement.querySelectorAll(MESSAGE_LIST_SELECTOR);
            allLists.forEach(list => processMessagesInList(list));
        }
    }

    const observerCallback = (mutationsList) => {
        if (!currentSettings.enabled) return;
        let listsToReProcess = new Set();
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.matches(MESSAGE_ITEM_SELECTOR) || addedNode.querySelector(MESSAGE_LIST_SELECTOR)) {
                            const lists = addedNode.querySelectorAll(MESSAGE_LIST_SELECTOR);
                            lists.forEach(list => listsToReProcess.add(list));
                        } else if (addedNode.matches(MESSAGE_ROOT_SELECTOR)) {
                            const parentList = addedNode.closest(MESSAGE_LIST_SELECTOR);
                            if (parentList) listsToReProcess.add(parentList);
                        }
                    }
                });
            }
        }
        if (listsToReProcess.size > 0) {
            setTimeout(() => {
                listsToReProcess.forEach(list => {
                    processMessagesInList(list);
                    if (!list.dataset.antibubbleObserved) {
                        observeMessageList(list);
                        list.dataset.antibubbleObserved = 'true';
                    }
                });
            }, 200);
        }
    };

    function observeMessageList(listElement) {
        const listObserver = new MutationObserver(() => {
            if (!currentSettings.enabled) return;
            setTimeout(() => processMessagesInList(listElement), 200);
        });
        listObserver.observe(listElement, { childList: true });
    }

    function initialize() {
        loadSettings();
        updateStyles();

        const settingsPanelObserver = new MutationObserver(() => {
            const panel = document.querySelector(SETTINGS_PANEL_SELECTOR);
            if (panel) {
                if (!document.getElementById(SCRIPT_ID_PREFIX + 'enable_script')) {
                    createSettingsUI();
                }
            }
        });
        const chatRootForPanel = document.getElementById(CHAT_ROOT_ID) || document.body;
        settingsPanelObserver.observe(chatRootForPanel, { childList: true, subtree: true });

        const chatRootElement = document.getElementById(CHAT_ROOT_ID);
        if (!chatRootElement) {
            setTimeout(initialize, 1000); return;
        }

        processAllOpenChatLists();
        const existingMessageLists = chatRootElement.querySelectorAll(MESSAGE_LIST_SELECTOR);
        existingMessageLists.forEach(list => {
            if (!list.dataset.antibubbleObserved) {
                observeMessageList(list);
                list.dataset.antibubbleObserved = 'true';
            }
        });
        const mainObserver = new MutationObserver(observerCallback);
        mainObserver.observe(chatRootElement, { childList: true, subtree: true });
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initialize();
    } else {
        window.addEventListener('DOMContentLoaded', initialize);
    }
})();

// ==UserScript==
// @name        c.ai X Font color etc for CAI Tools users
// @namespace   c.ai X Font color etc for CAI Tools users
// @match       https://character.ai/*
// @match       https://*.character.ai/*
// @grant       none
// @license     MIT
// @version     1.1
// @author      LuxTallis based on Vishanka via chatGPT
// @description Lets you change the text colors, font type, and font size as you wish, with fixes for CAI Tools compatibility and fully eliminated twitching
// @icon        https://i.imgur.com/ynjBqKW.png
// @downloadURL https://update.greasyfork.org/scripts/533152/cai%20X%20Font%20color%20etc%20for%20CAI%20Tools%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/533152/cai%20X%20Font%20color%20etc%20for%20CAI%20Tools%20users.meta.js
// ==/UserScript==

(function () {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    var plaintextColor = localStorage.getItem('plaintext_color') || '#A2A2AC';
    var italicColor = localStorage.getItem('italic_color') || '#E0DF7F';
    var quotationMarksColor = localStorage.getItem('quotationmarks_color') || '#FFFFFF';
    var customColor = localStorage.getItem('custom_color') || '#E0DF7F';
    var selectedFont = localStorage.getItem('selected_font') || 'Roboto';
    var fontSize = localStorage.getItem('font_size') || '16px';
    var lastAppliedStyles = null; // Track the last applied styles to avoid redundant updates

    // List of fonts, excluding unavailable ones
    const fontList = [
        'Roboto',
        'Josefin Sans',
        'JetBrains Mono',
        'Open Sans',
        'Montserrat',
        'Montserrat Alternates',
        'Lato',
        'PT Sans',
        'Nunito Sans',
        'Courier Prime',
        'Averia Serif Libre',
        'Fira Code',
        'Fira Sans',
        'Anime Ace',
        'Manga Temple',
        'Dancing Script',
        'Medieval Sharp'
    ];

    // Create CSS with broader targeting and exclusions
    var css = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto|Josefin+Sans|JetBrains+Mono|Open+Sans|Montserrat|Montserrat+Alternates|Lato|PT+Sans|Nunito+Sans|Courier+Prime|Averia+Serif+Libre|Fira+Code|Fira+Sans|Dancing+Script|MedievalSharp|Anime+Ace|Manga+Temple&display=swap');

        body div[class*="swiper-slide"] p[node='[object Object]'],
        body #chat-messages div[class*="rounded-2xl"] p:not([title]),
        body .chat2 p:not(.no-color-override),
        body div[class*="message"] p,
        body div[class*="user-message"] p,
        body div[class*="bot-message"] p,
        body p:not(.cai-tools-managed):not(.no-color-override) {
            color: ${plaintextColor} !important;
            background: none !important;
            font-family: "${selectedFont}", sans-serif !important;
            font-size: ${fontSize} !important;
        }
        body div[class*="swiper-slide"] p[node='[object Object]'] em,
        body #chat-messages div[class*="rounded-2xl"] p:not([title]) em,
        body .chat2 p:not(.no-color-override) em,
        body div[class*="message"] p em,
        body div[class*="user-message"] p em,
        body div[class*="bot-message"] p em,
        body p:not(.cai-tools-managed):not(.no-color-override) em {
            color: ${italicColor} !important;
            font-family: "${selectedFont}", sans-serif !important;
            font-size: ${fontSize} !important;
        }
    `;

    // Apply CSS with a unique ID
    function applyStyles() {
        const currentStyles = JSON.stringify({ css, plaintextColor, italicColor, quotationMarksColor, customColor, selectedFont, fontSize });
        if (lastAppliedStyles === currentStyles) {
            return;
        }

        let style = document.getElementById('custom-text-color-style');
        if (!style) {
            style = document.createElement("style");
            style.id = 'custom-text-color-style';
            style.setAttribute("type", "text/css");
            document.head.appendChild(style);
        }
        style.innerHTML = css;
        lastAppliedStyles = currentStyles;
    }

    // Apply styles initially after a delay to outpace CAI Tools
    setTimeout(applyStyles, 1000);

    // Function to change colors for quotation marks and custom words
    function changeColors(targetPTags = null) {
        const pTags = targetPTags || document.querySelectorAll(
            'p[node="[object Object]"], #chat-messages div[class*="rounded-2xl"] p:not([title]), .chat2 p:not(.no-color-override), div[class*="message"] p, div[class*="user-message"] p, div[class*="bot-message"] p, p:not(.cai-tools-managed):not(.no-color-override)'
        );
        const wordlistCc = JSON.parse(localStorage.getItem('wordlist_cc')) || [];
        const wordRegex = wordlistCc.length > 0
            ? new RegExp('\\b(' + wordlistCc.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi')
            : null;

        Array.from(pTags).forEach((pTag) => {
            if (
                pTag.dataset.colorChanged === "true" ||
                pTag.querySelector("code") ||
                pTag.querySelector("img") ||
                pTag.querySelector("textarea") ||
                pTag.querySelector("button") ||
                pTag.querySelector("div") ||
                pTag.classList.contains('no-color-override') ||
                pTag.classList.contains('cai-tools-managed')
            ) {
                return;
            }

            let text = pTag.innerHTML;
            const katexElems = Array.from(pTag.querySelectorAll(".katex"));
            const katexReplacements = katexElems.map((elem, index) => {
                const placeholder = `KATEX_PLACEHOLDER_${index}`;
                text = text.replace(elem.outerHTML, placeholder);
                return { html: elem.outerHTML, placeholder };
            });

            const aTags = Array.from(pTag.getElementsByTagName("a"));
            const aTagsReplacements = aTags.map((aTag, j) => {
                const placeholder = `REPLACE_ME_${j}`;
                text = text.replace(aTag.outerHTML, placeholder);
                return { tag: aTag, placeholder };
            });

            text = text.replace(/(["“”«»].*?["“”«»])/g, `<span style="color: ${quotationMarksColor} !important; font-family: '${selectedFont}', sans-serif !important; font-size: ${fontSize} !important;">$1</span>`);
            if (wordRegex) {
                text = text.replace(wordRegex, `<span style="color: ${customColor} !important; font-family: '${selectedFont}', sans-serif !important; font-size: ${fontSize} !important;">$1</span>`);
            }

            [...katexReplacements, ...aTagsReplacements].forEach(({ html, placeholder, tag }) => {
                text = text.replace(placeholder, html || tag.outerHTML);
            });

            pTag.innerHTML = text;
            pTag.dataset.colorChanged = "true";
        });
    }

    // Function to check if a mutation is relevant to chat content (structural changes)
    function isRelevantMutation(mutation) {
        const target = mutation.target;
        const isRelevantTarget = (
            target.matches('#chat-messages, #chat-messages *') ||
            target.matches('.chat2, .chat2 *') ||
            target.matches('div[class*="message"], div[class*="message"] *') ||
            target.matches('div[class*="user-message"], div[class*="user-message"] *') ||
            target.matches('div[class*="bot-message"], div[class*="bot-message"] *') ||
            target.matches('div[class*="swiper-slide"], div[class*="swiper-slide"] *') ||
            target.matches('p:not(.cai-tools-managed):not(.no-color-override), p:not(.cai-tools-managed):not(.no-color-override) *')
        );

        const hasRelevantNodes = mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
        return isRelevantTarget && hasRelevantNodes;
    }

    // Single observer for structural changes
    const observerConfig = { childList: true, subtree: true };
    const chatContainer = document.querySelector('#chat-messages') || document.querySelector('.chat2') || document.body;

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(isRelevantMutation)) {
            applyStyles();
            changeColors();

            // Start the generation monitoring loop if a new bot message appears
            const latestBotMessage = document.querySelector('div[class*="bot-message"]:last-child');
            if (latestBotMessage && !isMonitoringGeneration) {
                startGenerationMonitoring(latestBotMessage);
            }
        }
    });
    observer.observe(chatContainer, observerConfig);

    // Variables for generation monitoring
    let isMonitoringGeneration = false;
    let lastContent = '';
    let idleCounter = 0;
    const IDLE_THRESHOLD = 60; // ~1 second at 60fps

    // Monitor the latest bot message during generation using requestAnimationFrame
    function startGenerationMonitoring(botMessage) {
        if (isMonitoringGeneration) return;
        isMonitoringGeneration = true;

        function monitor() {
            const pTags = botMessage.querySelectorAll('p:not(.cai-tools-managed):not(.no-color-override)');
            if (!pTags.length) {
                // If the message disappears (e.g., page navigation), stop monitoring
                isMonitoringGeneration = false;
                return;
            }

            // Check if the content has changed
            const currentContent = Array.from(pTags).map(p => p.innerHTML).join('');
            if (currentContent !== lastContent) {
                lastContent = currentContent;
                idleCounter = 0; // Reset idle counter on content change

                // Force reapplication of colors
                pTags.forEach(pTag => {
                    pTag.dataset.colorChanged = "false";
                });
                changeColors(pTags);
            } else {
                idleCounter++;
                // Stop monitoring if no changes for ~1 second (generation likely finished)
                if (idleCounter >= IDLE_THRESHOLD) {
                    isMonitoringGeneration = false;
                    changeColors(pTags); // Final reapplication
                    return;
                }
            }

            // Continue monitoring
            if (isMonitoringGeneration) {
                requestAnimationFrame(monitor);
            }
        }

        // Start the monitoring loop
        requestAnimationFrame(monitor);
    }

    // Initial application of colors
    setTimeout(changeColors, 1000);

    // Function to create buttons
    function createButton(symbol, onClick) {
        const button = document.createElement('button');
        button.innerHTML = symbol;
        button.style.position = 'relative';
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.fontSize = '18px';
        button.style.top = '-5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    }

    // Function to create the color and font selector panel
    function createColorPanel() {
        const panel = document.createElement('div');
        panel.id = 'colorPanel';
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.backgroundColor = currentTheme === 'dark' ? 'rgba(19, 19, 22, 0.95)' : 'rgba(214, 214, 221, 0.95)';
        panel.style.border = 'none';
        panel.style.borderRadius = '5px';
        panel.style.padding = '20px';
        panel.style.zIndex = '9999';

        const categories = ['plaintext', 'italic', 'quotationmarks', 'custom'];
        const colorPickers = {};
        const transparentCheckboxes = {};
        const labelWidth = '150px';

        // Color pickers
        categories.forEach(category => {
            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            const storedColor = localStorage.getItem(`${category}_color`) || getDefaultColor(category);
            colorPicker.value = storedColor !== 'transparent' ? storedColor : '#000000';
            colorPickers[category] = colorPicker;

            const colorDiv = document.createElement('div');
            colorDiv.style.position = 'relative';
            colorDiv.style.width = '20px';
            colorDiv.style.height = '20px';
            colorDiv.style.marginLeft = '10px';
            colorDiv.style.top = '0px';
            colorDiv.style.backgroundColor = storedColor === 'transparent' ? 'transparent' : colorPicker.value;
            colorDiv.style.display = 'inline-block';
            colorDiv.style.marginRight = '10px';
            colorDiv.style.cursor = 'pointer';
            colorDiv.style.border = '1px solid black';

            colorDiv.addEventListener('click', function () {
                if (!transparentCheckboxes[category].checked) {
                    colorPicker.click();
                }
            });

            colorPicker.addEventListener('input', function () {
                if (!transparentCheckboxes[category].checked) {
                    colorDiv.style.backgroundColor = colorPicker.value;
                    localStorage.setItem(`${category}_color`, colorPicker.value);
                }
            });

            const transparentCheckbox = document.createElement('input');
            transparentCheckbox.type = 'checkbox';
            transparentCheckbox.checked = storedColor === 'transparent';
            transparentCheckbox.title = 'Toggle transparency';
            transparentCheckbox.style.marginLeft = '10px';
            transparentCheckbox.style.marginRight = '5px';
            transparentCheckboxes[category] = transparentCheckbox;

            transparentCheckbox.addEventListener('change', function () {
                if (transparentCheckbox.checked) {
                    colorDiv.style.backgroundColor = 'transparent';
                    localStorage.setItem(`${category}_color`, 'transparent');
                } else {
                    colorDiv.style.backgroundColor = colorPicker.value;
                    localStorage.setItem(`${category}_color`, colorPicker.value);
                }
            });

            const label = document.createElement('label');
            label.style.width = labelWidth;
            label.style.margin = '0';
            label.style.padding = '0';
            label.appendChild(document.createTextNode(`${category}: `));

            const resetButton = createButton('↺', function () {
                const defaultColor = getDefaultColor(category);
                colorPicker.value = defaultColor;
                colorDiv.style.backgroundColor = defaultColor;
                transparentCheckbox.checked = false;
                localStorage.setItem(`${category}_color`, defaultColor);
            });
            resetButton.style.position = 'relative';
            resetButton.style.top = '-2px';
            resetButton.style.margin = '0';
            resetButton.style.padding = '0';

            const containerDiv = document.createElement('div');
            containerDiv.style.margin = '2px 0';
            containerDiv.style.padding = '0';
            containerDiv.style.display = 'flex';
            containerDiv.style.alignItems = 'center';

            containerDiv.appendChild(label);
            containerDiv.appendChild(colorDiv);
            containerDiv.appendChild(transparentCheckbox);
            containerDiv.appendChild(resetButton);

            panel.appendChild(containerDiv);
        });

        // Font picker
        const fontLabel = document.createElement('label');
        fontLabel.style.width = labelWidth;
        fontLabel.style.margin = '0';
        fontLabel.style.padding = '0';
        fontLabel.appendChild(document.createTextNode('Font: '));

        const fontSelect = document.createElement('select');
        fontSelect.style.width = '150px';
        fontSelect.style.height = '30px';
        fontSelect.style.borderRadius = '3px';
        fontList.forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.text = font;
            if (font === selectedFont) option.selected = true;
            fontSelect.appendChild(option);
        });

        const fontContainer = document.createElement('div');
        fontContainer.style.margin = '2px 0';
        fontContainer.style.padding = '0';
        fontContainer.style.display = 'flex';
        fontContainer.style.alignItems = 'center';
        fontContainer.appendChild(fontLabel);
        fontContainer.appendChild(fontSelect);
        panel.appendChild(fontContainer);

        // Font size picker
        const sizeLabel = document.createElement('label');
        sizeLabel.style.width = labelWidth;
        sizeLabel.style.margin = '0';
        sizeLabel.style.padding = '0';
        sizeLabel.appendChild(document.createTextNode('Font Size: '));

        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.min = '8';
        sizeInput.max = '48';
        sizeInput.value = parseInt(fontSize);
        sizeInput.style.width = '60px';
        sizeInput.style.height = '30px';
        sizeInput.style.borderRadius = '3px';

        const sizeContainer = document.createElement('div');
        sizeContainer.style.margin = '2px 0';
        sizeContainer.style.padding = '0';
        sizeContainer.style.display = 'flex';
        sizeContainer.style.alignItems = 'center';
        sizeContainer.appendChild(sizeLabel);
        sizeContainer.appendChild(sizeInput);
        panel.appendChild(sizeContainer);

        // Custom word list input
        const wordListInput = document.createElement('input');
        wordListInput.type = 'text';
        wordListInput.placeholder = 'Separate words with commas';
        wordListInput.style.width = '250px';
        wordListInput.style.height = '35px';
        wordListInput.style.borderRadius = '3px';
        wordListInput.style.marginBottom = '10px';
        panel.appendChild(wordListInput);
        panel.appendChild(document.createElement('br'));

        const wordListContainer = document.createElement('div');
        wordListContainer.style.display = 'flex';
        wordListContainer.style.flexWrap = 'wrap';
        wordListContainer.style.maxWidth = '300px';

        const wordListArray = JSON.parse(localStorage.getItem('wordlist_cc')) || [];

        function createWordButton(word) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const removeSymbol = isMobile ? '×' : '🞮';
            const wordButton = createButton(`${word} ${removeSymbol}`, function() {
                const index = wordListArray.indexOf(word);
                if (index !== -1) {
                    wordListArray.splice(index, 1);
                    updateWordListButtons();
                }
            });
            wordButton.style.borderRadius = '3px';
            wordButton.style.border = 'none';
            wordButton.style.backgroundColor = currentTheme === 'dark' ? '#26272B' : '#E4E4E7';
            wordButton.style.marginBottom = '5px';
            wordButton.style.marginRight = '5px';
            wordButton.style.fontSize = '16px';
            return wordButton;
        }

        function updateWordListButtons() {
            wordListContainer.innerHTML = '';
            wordListArray.forEach(word => {
                const wordButton = createWordButton(word);
                wordListContainer.appendChild(wordButton);
            });
        }

        updateWordListButtons();

        const addWordsButton = document.createElement('button');
        addWordsButton.textContent = 'Add';
        addWordsButton.style.marginTop = '-8px';
        addWordsButton.style.marginLeft = '5px';
        addWordsButton.style.borderRadius = '3px';
        addWordsButton.style.border = 'none';
        addWordsButton.style.backgroundColor = currentTheme === 'dark' ? '#26272B' : '#E4E4E7';
        addWordsButton.addEventListener('click', function() {
            const wordListValue = wordListInput.value;
            const newWords = wordListValue.split(',').map(word => word.trim().toLowerCase()).filter(word => word !== '');
            wordListArray.push(...newWords);
            updateWordListButtons();
        });

        const inputButtonContainer = document.createElement('div');
        inputButtonContainer.style.display = 'flex';
        inputButtonContainer.style.alignItems = 'center';
        inputButtonContainer.appendChild(wordListInput);
        inputButtonContainer.appendChild(addWordsButton);
        panel.appendChild(inputButtonContainer);
        panel.appendChild(wordListContainer);

        // OK button
        const okButton = document.createElement('button');
        okButton.textContent = 'Confirm';
        okButton.style.marginTop = '-20px';
        okButton.style.width = '75px';
        okButton.style.height = '35px';
        okButton.style.marginRight = '5px';
        okButton.style.borderRadius = '3px';
        okButton.style.border = 'none';
        okButton.style.backgroundColor = currentTheme === 'dark' ? '#26272B' : '#D9D9DF';
        okButton.style.position = 'relative';
        okButton.style.left = '24%';
        okButton.addEventListener('click', function () {
            categories.forEach(category => {
                const colorPicker = colorPickers[category];
                const transparentCheckbox = transparentCheckboxes[category];
                const newValue = transparentCheckbox.checked ? 'transparent' : colorPicker.value;
                localStorage.setItem(`${category}_color`, newValue);
                if (category === 'plaintext') plaintextColor = newValue;
                else if (category === 'italic') italicColor = newValue;
                else if (category === 'quotationmarks') quotationMarksColor = newValue;
                else if (category === 'custom') customColor = newValue;
            });

            selectedFont = fontSelect.value;
            localStorage.setItem('selected_font', selectedFont);
            fontSize = sizeInput.value + 'px';
            localStorage.setItem('font_size', fontSize);

            // Update CSS dynamically
            css = `
                @import url('https://fonts.googleapis.com/css2?family=Roboto|Josefin+Sans|JetBrains+Mono|Open+Sans|Montserrat|Montserrat+Alternates|Lato|PT+Sans|Nunito+Sans|Courier+Prime|Averia+Serif+Libre|Fira+Code|Fira+Sans|Dancing+Script|MedievalSharp|Anime+Ace|Manga+Temple&display=swap');

                body div[class*="swiper-slide"] p[node='[object Object]'],
                body #chat-messages div[class*="rounded-2xl"] p:not([title]),
                body .chat2 p:not(.no-color-override),
                body div[class*="message"] p,
                body div[class*="user-message"] p,
                body div[class*="bot-message"] p,
                body p:not(.cai-tools-managed):not(.no-color-override) {
                    color: ${plaintextColor} !important;
                    background: none !important;
                    font-family: "${selectedFont}", sans-serif !important;
                    font-size: ${fontSize} !important;
                }
                body div[class*="swiper-slide"] p[node='[object Object]'] em,
                body #chat-messages div[class*="rounded-2xl"] p:not([title]) em,
                body .chat2 p:not(.no-color-override) em,
                body div[class*="message"] p em,
                body div[class*="user-message"] p em,
                body div[class*="bot-message"] p em,
                body p:not(.cai-tools-managed):not(.no-color-override) em {
                    color: ${italicColor} !important;
                    font-family: "${selectedFont}", sans-serif !important;
                    font-size: ${fontSize} !important;
                }
            `;
            applyStyles();
            changeColors();
            const wordListValue = wordListInput.value;
            const newWords = wordListValue.split(',').map(word => word.trim().toLowerCase()).filter(word => word !== '');
            const uniqueNewWords = Array.from(new Set(newWords));
            uniqueNewWords.forEach(newWord => {
                if (!wordListArray.includes(newWord)) {
                    wordListArray.push(newWord);
                }
            });
            localStorage.setItem('wordlist_cc', JSON.stringify(wordListArray));
            updateWordListButtons();
            changeColors();
            panel.remove();
        });

        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.marginTop = '-20px';
        cancelButton.style.borderRadius = '3px';
        cancelButton.style.width = '75px';
        cancelButton.style.marginLeft = '5px';
        cancelButton.style.height = '35px';
        cancelButton.style.border = 'none';
        cancelButton.style.backgroundColor = currentTheme === 'dark' ? '#5E5E5E' : '#CBD2D4';
        cancelButton.style.position = 'relative';
        cancelButton.style.left = '25%';
        cancelButton.addEventListener('click', function() {
            panel.remove();
        });

        // Reset all button
        const resetAll = document.createElement('button');
        resetAll.style.marginBottom = '20px';
        resetAll.style.borderRadius = '3px';
        resetAll.style.width = '80px';
        resetAll.style.marginLeft = '5px';
        resetAll.style.height = '30px';
        resetAll.style.border = 'none';
        resetAll.textContent = 'Reset All';
        resetAll.addEventListener('click', function () {
            const resetConfirmed = confirm('This will reset all colors, font, and size to default. Proceed?');
            if (resetConfirmed) {
                categories.forEach(category => {
                    const defaultColor = getDefaultColor(category);
                    colorPickers[category].value = defaultColor;
                    transparentCheckboxes[category].checked = false;
                    localStorage.setItem(`${category}_color`, defaultColor);
                    if (category === 'plaintext') plaintextColor = defaultColor;
                    else if (category === 'italic') italicColor = defaultColor;
                    else if (category === 'quotationmarks') quotationMarksColor = defaultColor;
                    else if (category === 'custom') customColor = defaultColor;
                });
                selectedFont = 'Roboto';
                fontSelect.value = 'Roboto';
                localStorage.setItem('selected_font', 'Roboto');
                fontSize = '16px';
                sizeInput.value = '16';
                localStorage.setItem('font_size', '16px');
                localStorage.removeItem('wordlist_cc');
                wordListArray.length = 0;
                updateWordListButtons();
                css = `
                    @import url('https://fonts.googleapis.com/css2?family=Roboto|Josefin+Sans|JetBrains+Mono|Open+Sans|Montserrat|Montserrat+Alternates|Lato|PT+Sans|Nunito+Sans|Courier+Prime|Averia+Serif+Libre|Fira+Code|Fira+Sans|Dancing+Script|MedievalSharp|Anime+Ace|Manga+Temple&display=swap');

                    body div[class*="swiper-slide"] p[node='[object Object]'],
                    body #chat-messages div[class*="rounded-2xl"] p:not([title]),
                    body .chat2 p:not(.no-color-override),
                    body div[class*="message"] p,
                    body div[class*="user-message"] p,
                    body div[class*="bot-message"] p,
                    body p:not(.cai-tools-managed):not(.no-color-override) {
                        color: ${getDefaultColor('plaintext')} !important;
                        background: none !important;
                        font-family: "Roboto", sans-serif !important;
                        font-size: 16px !important;
                    }
                    body div[class*="swiper-slide"] p[node='[object Object]'] em,
                    body #chat-messages div[class*="rounded-2xl"] p:not([title]) em,
                    body .chat2 p:not(.no-color-override) em,
                    body div[class*="message"] p em,
                    body div[class*="user-message"] p em,
                    body div[class*="bot-message"] p em,
                    body p:not(.cai-tools-managed):not(.no-color-override) em {
                        color: ${getDefaultColor('italic')} !important;
                        font-family: "Roboto", sans-serif !important;
                        font-size: 16px !important;
                    }
                `;
                applyStyles();
                changeColors();
            }
        });

        panel.appendChild(document.createElement('br'));
        panel.appendChild(resetAll);
        panel.appendChild(document.createElement('br'));
        panel.appendChild(okButton);
        panel.appendChild(cancelButton);
        document.body.appendChild(panel);
    }

    // Function to get default colors
    function getDefaultColor(category) {
        if (currentTheme === 'dark') {
            const defaultColors = {
                'plaintext': '#A2A2AC',
                'italic': '#E0DF7F',
                'quotationmarks': '#FFFFFF',
                'custom': '#E0DF7F'
            };
            return defaultColors[category];
        } else {
            const defaultColors = {
                'plaintext': '#374151',
                'italic': '#4F7AA6',
                'quotationmarks': '#000000',
                'custom': '#4F7AA6'
            };
            return defaultColors[category];
        }
    }

    // Create and insert main button
    const mainButton = createButton('', function() {
        const colorPanelExists = document.getElementById('colorPanel');
        if (!colorPanelExists) {
            createColorPanel();
        }
    });
    mainButton.style.backgroundImage = "url('https://i.imgur.com/yBgJ3za.png')";
    mainButton.style.backgroundSize = "cover";
    mainButton.style.position = "fixed";
    mainButton.style.top = "135px";
    mainButton.style.right = "5px";
    mainButton.style.width = "22px";
    mainButton.style.height = "22px";
    mainButton.style.zIndex = '10000';
    document.body.appendChild(mainButton);

    console.info('c.ai Text Color and Font Button appended to the top right corner.');
})();
// ==UserScript==
// @name         Twitch.tv chat Translation (Optimized)
// @namespace    Magof - twitch-translation-script
// @version      2.1
// @description  Add a button to the Twitch.tv website that opens a menu to translate messages to the Twitch.tv chat.
// @author       Magof
// @match        https://www.twitch.tv/*
// @downloadURL https://update.greasyfork.org/scripts/471118/Twitchtv%20chat%20Translation%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471118/Twitchtv%20chat%20Translation%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'twitch_translation_config';

    // Load saved settings
    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) {
            return {};
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }

    // Function called when the button is clicked
    function toggleToolbox() {
        const toolbox = document.getElementById('toolbox');
        if (toolbox) {
            toolbox.classList.toggle('visible');
        }
    }

    function addButton() {
        // Check if the button has already been added
        const existingButton = document.getElementById('toggle-toolbox');
        if (existingButton) {
            return;
        }

        // Create the button (Native Style)
        const newButton = document.createElement('div');
        newButton.style.display = 'inline-flex';
        newButton.style.alignItems = 'center';

        const btnInner = document.createElement('button');
        // Copy classes from a neighbor button if possible, or use standard twitch layout classes
        btnInner.className = 'Layout-sc-1xcs6mc-0 cMreAt'; // Generic Twitch button container class often used
        btnInner.style.cssText = 'background: transparent; border: none; color: var(--color-fill-button-icon); cursor: pointer; padding: 4px; display: flex; align-items: center; font-weight: 600; font-size: 13px;';
        btnInner.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                <path d="M10.5 5h-1v3H6v1h3.5v5.5h1V9H14V8h-3.5z"/>
            </svg>
            <span style="margin-left: 4px; padding-right: 5px;">Translate</span>
        `;

        btnInner.onmouseover = () => { btnInner.style.backgroundColor = 'var(--color-background-button-text-hover)'; btnInner.style.borderRadius = '4px'; };
        btnInner.onmouseout = () => { btnInner.style.backgroundColor = 'transparent'; };

        newButton.appendChild(btnInner);
        newButton.id = 'toggle-toolbox';

        // Add the click event to the button
        btnInner.addEventListener('click', (e) => {
            e.preventDefault();
            toggleToolbox();
        });

        // Add the button to the element with the class "chat-input__buttons-container"
        const chatButtonsContainer = document.querySelector('.chat-input__buttons-container');
        if (chatButtonsContainer) {
            // Insert as first item
            if (chatButtonsContainer.firstChild) {
                chatButtonsContainer.insertBefore(newButton, chatButtonsContainer.firstChild);
            } else {
                chatButtonsContainer.appendChild(newButton);
            }
        }
    }

    // Add a keydown event listener to the document
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const toolbox = document.getElementById('toolbox');
            if (toolbox && toolbox.classList.contains('visible')) {
                toggleToolbox();
            }
        }
    });

    // Variable to store the MutationObserver reference
    let observer = null;

    // Store the original messages in a map (key: message element, value: original text)
    const originalMessages = new Map();

    // Cache for translations to reduce API calls
    const translationCache = new Map();

    // Function to translate text using the Google Translate API
    function translateText(text, destinationLanguage) {
        return new Promise((resolve, reject) => {
            const cacheKey = `${destinationLanguage}:${text}`;
            if (translationCache.has(cacheKey)) {
                resolve(translationCache.get(cacheKey));
                return;
            }

            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${destinationLanguage}&dt=t&q=${encodeURIComponent(text)}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Safe join for multi-sentence translations
                    const translation = data[0].map(item => item[0]).join('');
                    translationCache.set(cacheKey, translation);
                    resolve(translation);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Function to translate a message
    function translateMessage(messageElement, destinationLanguage) {
        const originalText = originalMessages.get(messageElement);
        translateText(originalText, destinationLanguage)
            .then(translation => {
                // Feature: Append Mode (keep original)
                // We check if we want to show original or not. For now, let's keep it simple: Replace but with style.

                // Let's implement the format: "Translated Text <opacity>Original</opacity>"
                // Or just replace as requested by the original logic, but robustly.

                messageElement.textContent = translation;
                messageElement.title = originalText; // Tooltip for original
                messageElement.style.color = 'var(--color-text-base)';
                messageElement.style.backgroundColor = 'var(--color-background-alt)'; // Subtle highlight
                messageElement.style.borderRadius = '2px';
                messageElement.style.padding = '0 2px';
            })
            .catch(error => {
                console.error("Error translating message:", error);
            });
    }

    // Function to handle translation logic start/stop
    function updateTranslationState() {
        const checkbox = document.getElementById('real-time-translate');
        const selectElement = document.getElementById('language-select');

        if (!checkbox || !selectElement) return;

        const option = selectElement.value;
        const isEnabled = checkbox.checked;

        // Save settings
        saveSettings({ enabled: isEnabled, lang: option });

        if (isEnabled) {
            // Start translation

            // If there is already an observation, we don't need to create another one
            if (observer) {
                // If language changed, we might need to re-translate? 
                // For simplicity in this structure, we just assume user stops/starts to change lang, or next messages use new lang.
                return;
            }

            // Translate all existing messages and store them in the originalMessages map
            const messages = document.querySelectorAll("span.text-fragment");
            messages.forEach(messageElement => {
                if (!originalMessages.has(messageElement)) {
                    const originalText = messageElement.textContent;
                    originalMessages.set(messageElement, originalText);
                    translateMessage(messageElement, option);
                }
            });

            // Create the observation for new messages
            const chatContainer = document.querySelector('[data-test-selector="chat-scrollable-area__message-container"]');
            if (chatContainer && !observer) {
                observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        const newMessages = Array.from(mutation.addedNodes).filter(node => node.nodeType === Node.ELEMENT_NODE);
                        newMessages.forEach(node => {
                            // Recursively find text fragments
                            const messageElements = node.querySelectorAll ? node.querySelectorAll('span.text-fragment') : [];
                            messageElements.forEach(messageElement => {
                                if (messageElement && !originalMessages.has(messageElement)) {
                                    const originalText = messageElement.textContent;
                                    originalMessages.set(messageElement, originalText);
                                    translateMessage(messageElement, option);
                                }
                            });
                        });
                    });
                });

                const observerConfig = { childList: true, subtree: true };
                observer.observe(chatContainer, observerConfig);
            }
        } else {
            // Disable translation

            // Remove the observation
            if (observer) {
                observer.disconnect();
                observer = null;
            }

            // Revert translated messages to their original texts
            originalMessages.forEach((originalText, messageElement) => {
                messageElement.textContent = originalText;
                messageElement.style.backgroundColor = '';
                messageElement.style.color = '';
            });

            // Clear the map of original messages
            originalMessages.clear();
        }
    }

    // Function to check for changes in the DOM
    function checkDOMChange() {
        addButton();

        // Ensure settings are applied once UI is ready
        const checkbox = document.getElementById('real-time-translate');
        const selectElement = document.getElementById('language-select');
        if (checkbox && selectElement && !checkbox.dataset.restored) {
            const settings = loadSettings();
            if (settings.lang) selectElement.value = settings.lang;
            if (settings.enabled) {
                checkbox.checked = true;
                // Manually trigger update since we set it programmatically
                updateTranslationState();
            }
            checkbox.dataset.restored = "true";
        }

        setTimeout(checkDOMChange, 2000); // Check again every 2 seconds (relaxed)
    }

    // Wait for the page to fully load and then add the button
    window.addEventListener('load', () => {
        // Inject CSS first
        const css = `
            /* Style for the visible toolbox */
            .tool-box.visible {
              display: block;
              opacity: 1;
              transform: translateY(0);
            }

            /* General style for the hidden toolbox */
            .tool-box {
              position: fixed;
              bottom: 60px; /* Positioned above the chat input */
              right: 20px;
              background-color: var(--color-background-base); /* Twitch BG */
              border: 1px solid var(--color-border-base);
              padding: 16px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
              font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
              color: var(--color-text-base);
              display: none;
              width: 300px;
              z-index: 9999;
            }

            /* Style for the toolbox title */
            .tool-box h2 {
              font-size: 18px;
              margin-bottom: 16px;
              text-align: center;
              font-weight: 700;
              border-bottom: 1px solid var(--color-border-base);
              padding-bottom: 8px;
            }

            /* Style for checkboxes and labels */
            .tool-box label {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
              cursor: pointer;
              font-size: 14px;
            }
            
            .tool-box input[type="checkbox"] {
                margin-right: 8px;
                transform: scale(1.2);
            }

            /* Style for the select element */
            .tool-box select {
              width: 100%;
              padding: 8px;
              margin-bottom: 10px;
              background-color: var(--color-background-input);
              color: var(--color-text-input);
              border: 1px solid var(--color-border-input);
              border-radius: 4px;
              font-size: 14px;
            }
            .tool-box select:focus {
                outline: 2px solid var(--color-fill-brand);
            }
            
            .tool-box-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                color: var(--color-text-alt);
                cursor: pointer;
                font-weight: bold;
            }
        `;
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        // Add the toolbox to the document body
        const toolboxHtml = `
            <div class="tool-box" id="toolbox">
                <button class="tool-box-close" onclick="document.getElementById('toolbox').classList.remove('visible')">✕</button>
                <h2>Translation Settings</h2>
                <label>
                    <input type="checkbox" id="real-time-translate" />
                    <span>Enable Real-Time Translation</span>
                </label>
                <div style="margin-bottom: 4px; font-size:12px; font-weight:600; color:var(--color-text-alt);">Target Language</div>
                <select id="language-select">
            <option value="af">Afrikaans</option>
            <option value="sq">Albanian</option>
            <option value="am">Amharic</option>
            <option value="ar">Arabic</option>
            <option value="hy">Armenian</option>
            <option value="az">Azerbaijani</option>
            <option value="eu">Basque</option>
            <option value="be">Belarusian</option>
            <option value="bn">Bengali</option>
            <option value="bs">Bosnian</option>
            <option value="bg">Bulgarian</option>
            <option value="ca">Catalan</option>
            <option value="ceb">Cebuano</option>
            <option value="ny">Chichewa</option>
            <option value="zh-cn">Chinese (Simplified)</option>
            <option value="zh-tw">Chinese (Traditional)</option>
            <option value="co">Corsican</option>
            <option value="hr">Croatian</option>
            <option value="cs">Czech</option>
            <option value="da">Danish</option>
            <option value="nl">Dutch</option>
            <option value="en">English</option>
            <option value="eo">Esperanto</option>
            <option value="et">Estonian</option>
            <option value="tl">Filipino</option>
            <option value="fi">Finnish</option>
            <option value="fr">French</option>
            <option value="fy">Frisian</option>
            <option value="gl">Galician</option>
            <option value="ka">Georgian</option>
            <option value="de">German</option>
            <option value="el">Greek</option>
            <option value="gu">Gujarati</option>
            <option value="ht">Haitian Creole</option>
            <option value="ha">Hausa</option>
            <option value="haw">Hawaiian</option>
            <option value="iw">Hebrew</option>
            <option value="hi">Hindi</option>
            <option value="hmn">Hmong</option>
            <option value="hu">Hungarian</option>
            <option value="is">Icelandic</option>
            <option value="ig">Igbo</option>
            <option value="id">Indonesian</option>
            <option value="ga">Irish</option>
            <option value="it">Italian</option>
            <option value="ja">Japanese</option>
            <option value="jw">Javanese</option>
            <option value="kn">Kannada</option>
            <option value="kk">Kazakh</option>
            <option value="km">Khmer</option>
            <option value="ko">Korean</option>
            <option value="ku">Kurdish (Kurmanji)</option>
            <option value="ky">Kyrgyz</option>
            <option value="lo">Lao</option>
            <option value="la">Latin</option>
            <option value="lv">Latvian</option>
            <option value="lt">Lithuanian</option>
            <option value="lb">Luxembourgish</option>
            <option value="mk">Macedonian</option>
            <option value="mg">Malagasy</option>
            <option value="ms">Malay</option>
            <option value="ml">Malayalam</option>
            <option value="mt">Maltese</option>
            <option value="mi">Maori</option>
            <option value="mr">Marathi</option>
            <option value="mn">Mongolian</option>
            <option value="my">Myanmar (Burmese)</option>
            <option value="ne">Nepali</option>
            <option value="no">Norwegian</option>
            <option value="ps">Pashto</option>
            <option value="fa">Persian</option>
            <option value="pl">Polish</option>
            <option value="pt">Portuguese</option>
            <option value="pt-br">Portuguese (Brazil)</option>
            <option value="pa">Punjabi</option>
            <option value="ro">Romanian</option>
            <option value="ru">Russian</option>
            <option value="sm">Samoan</option>
            <option value="gd">Scots Gaelic</option>
            <option value="sr">Serbian</option>
            <option value="st">Sesotho</option>
            <option value="sn">Shona</option>
            <option value="sd">Sindhi</option>
            <option value="si">Sinhala</option>
            <option value="sk">Slovak</option>
            <option value="sl">Slovenian</option>
            <option value="so">Somali</option>
            <option value="es">Spanish</option>
            <option value="su">Sundanese</option>
            <option value="sw">Swahili</option>
            <option value="sv">Swedish</option>
            <option value="tg">Tajik</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="th">Thai</option>
            <option value="tr">Turkish</option>
            <option value="uk">Ukrainian</option>
            <option value="ur">Urdu</option>
            <option value="uz">Uzbek</option>
            <option value="vi">Vietnamese</option>
            <option value="cy">Welsh</option>
            <option value="xh">Xhosa</option>
            <option value="yi">Yiddish</option>
            <option value="yo">Yoruba</option>
            <option value="zu">Zulu</option>
        </select>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = toolboxHtml;
        document.body.appendChild(div);

        // Bind events
        document.getElementById('real-time-translate').addEventListener('change', updateTranslationState);
        document.getElementById('language-select').addEventListener('change', updateTranslationState);

        // Start checking
        checkDOMChange();
    });
})();

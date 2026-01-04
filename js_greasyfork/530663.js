// ==UserScript==
// @name         Nebula.tv Auto Translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract subtitles and replace them inline with DeepL translations (500k chars/month free tier)!
// @author       samu126
// @match        https://nebula.tv/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530663/Nebulatv%20Auto%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/530663/Nebulatv%20Auto%20Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Nebula.tv Auto Translate loaded!');

    // Load config from localStorage or use default values
    const defaultConfig = {
        targetLang: 'HU',
        deepLApiKey: '',
        subSize: 24,
    };

    const config = JSON.parse(localStorage.getItem('subtitleTranslatorConfig')) || defaultConfig;

    // Apply saved configuration
    const { targetLang, deepLApiKey, subSize } = config;
    const apiURL = 'https://api-free.deepl.com/v2/translate'; // Free tier api
    const seenSubtitles = new Set();

    // Configuration page HTML
    function createConfigPage() {
        const configPage = document.createElement('div');
        configPage.id = 'configPage';
        configPage.innerHTML = `
            <div style="position: absolute; top: 10%; right: 10%; background: white; color: black; border: 1px solid black; padding: 20px; z-index: 9999; width: 300px;">
                <h3>DeepL Subtitle Translator Config</h3>
                <label for="targetLang">Target Language (e.g., HU for Hungarian):</label>
                <input type="text" id="targetLang" value="${targetLang}" style="width: 100%; margin-bottom: 10px;"/>
                <br/>
                <label for="deepLApiKey">DeepL API Key:</label>
                <input type="text" id="deepLApiKey" value="${deepLApiKey}" style="width: 100%; margin-bottom: 10px;"/>
                <br/>
                <label for="subSize">Subtitle size:</label>
                <input type="number" id="subSize" value="${subSize}" style="width: 100%; margin-bottom: 10px;"/>
                <br/>
                <button id="saveConfig" style="width: 100%; background-color: #4CAF50; color: white; padding: 10px;">Save</button>
                <button id="closeConfig" style="width: 100%; margin-top: 10px; background-color: red; color: white; padding: 10px;">Close</button>
            </div>
        `;

        document.body.appendChild(configPage);

        // Close the configuration page
        document.getElementById('closeConfig').addEventListener('click', () => {
            document.body.removeChild(configPage);
        });

        // Save the configuration
        document.getElementById('saveConfig').addEventListener('click', () => {
            const newTargetLang = document.getElementById('targetLang').value.trim().toUpperCase();
            const newDeepLApiKey = document.getElementById('deepLApiKey').value.trim();
            const newSubSize = document.getElementById('subSize').value;

            if (newTargetLang && newDeepLApiKey && newSubSize) {
                const newConfig = { targetLang: newTargetLang, deepLApiKey: newDeepLApiKey, subSize: newSubSize };
                localStorage.setItem('subtitleTranslatorConfig', JSON.stringify(newConfig));

                // Reload the page to apply the new config
                location.reload();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Register the command in Tampermonkey's menu
    GM_registerMenuCommand('Open Subtitle Translator Config', createConfigPage);

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Found element:', element);
                observer.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function translateTextDeepL(text) {
        const params = new URLSearchParams();
        params.append('auth_key', deepLApiKey);
        params.append('text', text);
        params.append('target_lang', targetLang);

        try {
            const response = await fetch(apiURL, {
                method: 'POST',
                body: params
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.translations && data.translations.length > 0) {
                return data.translations[0].text;
            } else {
                return '[No translation returned]';
            }
        } catch (error) {
            console.error('DeepL translation error:', error);
            return '[Translation failed] ' + text;
        }
    }

    function displayTranslatedSubtitle(text, subtitleDiv) {
        const translatedDiv = document.createElement('div');
        translatedDiv.classList.add('translated-subtitle'); // Add an identifier class
        translatedDiv.textContent = text;

        Object.assign(translatedDiv.style, {
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            fontSize: subSize + 'px',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px',
            textShadow: '2px 2px 4px black',
            zIndex: 9999,
            fontFamily: 'Arial, sans-serif',
            width: 'auto'
        });

        // Replace the original subtitle with the translated subtitle
        subtitleDiv.parentNode.replaceChild(translatedDiv, subtitleDiv);
    }

    waitForElement('div[data-subtitles-container="true"]', (container) => {
        console.log('Subtitle container found!', container);

        // Observe subtitle container for new subtitle text
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const subtitleDivs = container.querySelectorAll('div > div > div');
                    subtitleDivs.forEach(async subDiv => {
                        // Check if this subtitle has already been translated (based on an added class)
                        if (subDiv.classList.contains('translated-subtitle')) {
                            return; // Skip if already translated
                        }

                        const subtitleText = subDiv.innerText.trim();
                        if (subtitleText && !seenSubtitles.has(subtitleText)) {
                            seenSubtitles.add(subtitleText);
                            console.log('Original subtitle:', subtitleText);

                            // Hide the original subtitle immediately
                            subDiv.style.visibility = 'hidden';

                            const translated = await translateTextDeepL(subtitleText);
                            console.log('Translated subtitle:', translated);

                            // Display the translated subtitle in place of the original
                            displayTranslatedSubtitle(translated, subDiv);
                        }
                    });
                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });
        console.log('Now observing and translating subtitles via DeepL...');
    });
})();

// ==UserScript==
// @name         BlueSky Dynamic Translation Display
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Insert the translation result into the previous sibling element of the parent element when the translate button is clicked.
// @author       littelsix
// @match        https://bsky.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517605/BlueSky%20Dynamic%20Translation%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/517605/BlueSky%20Dynamic%20Translation%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Script loaded successfully！');

    const supportedLanguages = {
        'zh-CN': '中文',
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'ja': '日本語'
    };

    function detectDefaultLanguage() {
        const browserLanguage = navigator.language || navigator.languages[0];
        console.log(`Detected browser language：${browserLanguage}`);
        return supportedLanguages[browserLanguage] ? browserLanguage : 'zh-CN';
    }

    let userLanguage = localStorage.getItem('bsky-translate-language') || detectDefaultLanguage();

    async function translateText(text, targetLang = 'zh-CN') {
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error：${response.status}`);
            }
            const result = await response.json();
            return result[0].map(segment => segment[0]).join('');
        } catch (error) {
            console.error(`Translation failed：${error.message || 'Unable to connect to the translation service. Please try again later'}`);
            throw error;
        }
    }

    function ensureTranslationContainer(referenceElement) {
        let translationDiv = referenceElement.querySelector('.translated-text');
        if (!translationDiv) {
            translationDiv = document.createElement('div');
            translationDiv.className = 'css-146c3p1 translated-text';
            translationDiv.style.color = 'rgb(16, 131, 254)';
            translationDiv.style.marginTop = '10px';
            translationDiv.textContent = 'Translation results will appear here';
            referenceElement.appendChild(translationDiv);
        }
        return translationDiv;
    }

    function createLanguageSelector(button) {
        let languageSelector = button.parentElement.querySelector('.language-selector');
        if (!languageSelector) {
            languageSelector = document.createElement('select');
            languageSelector.className = 'language-selector';
            languageSelector.style.marginLeft = '10px';
            languageSelector.style.border = '1px solid #ccc';
            languageSelector.style.borderRadius = '4px';
            languageSelector.style.padding = '2px';

            for (const [code, name] of Object.entries(supportedLanguages)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                if (code === userLanguage) {
                    option.selected = true;
                }
                languageSelector.appendChild(option);
            }

            languageSelector.addEventListener('change', (event) => {
                userLanguage = event.target.value;
                localStorage.setItem('bsky-translate-language', userLanguage);
                console.log(`Language switched to：${supportedLanguages[userLanguage]}`);
            });

            button.parentElement.appendChild(languageSelector);
        }
    }

    function bindTranslateButtons() {
        const translateButtons = document.querySelectorAll('a[href*="https://translate.google.com"]');
        console.log(`Found ${translateButtons.length} translate buttons.`);

        translateButtons.forEach(button => {
            if (!button.dataset.bound) {
                button.dataset.bound = true;

                createLanguageSelector(button);

                button.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('Translate button clicked!');

                    const parentElement = button.parentElement.parentElement;
                    if (!parentElement) {
                        console.error('Parent element not found。');
                        return;
                    }

                    const postTextDiv = parentElement.previousElementSibling;
                    if (!postTextDiv) {
                        console.error('Previous sibling element not found, unable to translate.');
                        return;
                    }

                    const textToTranslate = postTextDiv.textContent.trim();
                    if (!textToTranslate) {
                        console.error('Text is empty, unable to translate.');
                        return;
                    }

                    const translationDiv = ensureTranslationContainer(postTextDiv);

                    translationDiv.textContent = 'Translating...';
                    try {
                        const translatedText = await translateText(textToTranslate, userLanguage);
                        console.log(`Original text：${textToTranslate}`);
                        console.log(`Translation result：${translatedText}`);
                        translationDiv.textContent = translatedText;
                        translationDiv.dataset.translated = 'true';
                    } catch (error) {
                        translationDiv.textContent = 'Translation failed, please try again later.。';
                        console.error('Translation failed. Check console logs for details.');
                    }
                });
            }
        });
    }

    bindTranslateButtons();

    const observer = new MutationObserver(() => {
        bindTranslateButtons();
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
})();

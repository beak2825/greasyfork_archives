// ==UserScript==
// @name         DiscordAutoTranslator
// @namespace    http://tampermonkey.net/
// @version      1.20
// @description  Автоматический перевод сообщений в каналах/личных сообщениях на выбранный язык в Discord Web.
// @match        *://discord.com/*
// @author       Timka251 & eretly
// @grant        GM_xmlhttpRequest
// @icon         https://i.pinimg.com/236x/68/95/31/689531dc04ba222ab7af0fa34dc63644.jpg
// @run-at       document-end
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/506133/DiscordAutoTranslator.user.js
// @updateURL https://update.greasyfork.org/scripts/506133/DiscordAutoTranslator.meta.js
// ==/UserScript==

/*
 * Copyright 2024 eretly
 * Licensed under the BSD 3-Clause License.
 */

(function () {
    'use strict';

    const languageSelector = document.createElement('div');
    languageSelector.style.position = 'fixed';
    languageSelector.style.top = '12px';
    languageSelector.style.right = '15px';
    languageSelector.style.backgroundColor = '#2f3136';
    languageSelector.style.padding = '16px';
    languageSelector.style.zIndex = '9999';
    languageSelector.style.border = '1px solid #4f545c';
    languageSelector.style.borderRadius = '8px';
    languageSelector.style.width = '250px';
    languageSelector.style.display = 'none';

    const toggleButton = document.createElement('button');
    toggleButton.style.width = '100%';
    toggleButton.style.marginTop = '10px';
    toggleButton.style.padding = '8px 12px';
    toggleButton.style.backgroundColor = '#7289da';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '4px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.textContent = 'Enable Translator';

    const languages = {
        'auto': 'Auto-Detect', 'en': 'English', 'ru': 'Russian',
    };

    function createCustomSelect(defaultText, label) {
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
        customSelect.style.marginBottom = '10px';

        const selectButton = document.createElement('button');
        selectButton.className = 'select-button';
        selectButton.style.width = '100%';
        selectButton.style.padding = '8px 12px';
        selectButton.style.color = 'white';
        selectButton.style.backgroundColor = '#2f3136';
        selectButton.style.border = '1px solid #4f545c';
        selectButton.style.borderRadius = '4px';
        selectButton.style.cursor = 'pointer';
        selectButton.style.textAlign = 'left';
        selectButton.textContent = defaultText;

        const chevronDown = document.createElement('span');
        chevronDown.textContent = '▼';
        chevronDown.style.float = 'right';
        selectButton.appendChild(chevronDown);

        const selectOptions = document.createElement('div');
        selectOptions.className = 'select-options';
        selectOptions.style.display = 'none';
        selectOptions.style.position = 'absolute';
        selectOptions.style.backgroundColor = '#2f3136';
        selectOptions.style.border = '1px solid #4f545c';
        selectOptions.style.borderRadius = '4px';
        selectOptions.style.maxHeight = '200px';
        selectOptions.style.overflowY = 'auto';
        selectOptions.style.width = '94%';
        selectOptions.style.zIndex = '1000';

        Object.entries(languages).forEach(([code, name]) => {
            const option = document.createElement('div');
            option.className = 'select-option';
            option.textContent = name;
            option.dataset.code = code;
            option.style.padding = '8px 12px';
            option.style.cursor = 'pointer';
            option.style.color = 'white';
            option.addEventListener('mouseover', () => {
                option.style.backgroundColor = '#7289da';
            });
            option.addEventListener('mouseout', () => {
                option.style.backgroundColor = '';
            });
            option.addEventListener('click', () => {
                selectButton.textContent = name;
                selectButton.dataset.code = code;
                selectButton.appendChild(chevronDown);
                selectOptions.style.display = 'none';
                customSelect.dispatchEvent(new Event('change'));
            });
            selectOptions.appendChild(option);
        });

        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.style.marginTop = '4px';
        labelElement.style.fontSize = '12px';
        labelElement.style.color = '#b9bbbe';

        selectButton.addEventListener('click', () => {
            selectOptions.style.display = selectOptions.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (event) => {
            if (!customSelect.contains(event.target)) {
                selectOptions.style.display = 'none';
            }
        });

        customSelect.appendChild(selectButton);
        customSelect.appendChild(selectOptions);
        customSelect.appendChild(labelElement);

        return customSelect;
    }

    const sourceSelect = createCustomSelect('English', 'Source Language');
    const targetSelect = createCustomSelect('Russian', 'Target Language');

    languageSelector.appendChild(sourceSelect);
    languageSelector.appendChild(targetSelect);
    languageSelector.appendChild(toggleButton);
    document.body.appendChild(languageSelector);

    const savedSourceLang = localStorage.getItem('sourceLang') || 'en';
    const savedTargetLang = localStorage.getItem('targetLang') || 'ru';
    let isTranslatorActive = localStorage.getItem('isTranslatorActive') === 'true';

    sourceSelect.querySelector('.select-button').textContent = languages[savedSourceLang];
    sourceSelect.querySelector('.select-button').dataset.code = savedSourceLang;
    targetSelect.querySelector('.select-button').textContent = languages[savedTargetLang];
    targetSelect.querySelector('.select-button').dataset.code = savedTargetLang;

    let sourceLang = savedSourceLang;
    let targetLang = savedTargetLang;
    let activeRequests = [];

    if (isTranslatorActive) {
        toggleButton.textContent = 'Disable Translator';
        translateAllMessages();
    }

    function updateLanguages() {
        const sourceButton = sourceSelect.querySelector('.select-button');
        const targetButton = targetSelect.querySelector('.select-button');
        sourceLang = sourceButton.dataset.code;
        targetLang = targetButton.dataset.code;
        localStorage.setItem('sourceLang', sourceLang);
        localStorage.setItem('targetLang', targetLang);
        if (isTranslatorActive) {
            translateAllMessages();
        }
    }

    sourceSelect.addEventListener('change', updateLanguages);
    targetSelect.addEventListener('change', updateLanguages);

    function updateTranslatorState() {
        isTranslatorActive = !isTranslatorActive;
        localStorage.setItem('isTranslatorActive', isTranslatorActive);
        toggleButton.textContent = isTranslatorActive ? 'Disable Translator' : 'Enable Translator';

        if (isTranslatorActive) {
            translateAllMessages();
        } else {
            resetTranslations();
            cancelActiveRequests();
        }
    }

    toggleButton.addEventListener('click', updateTranslatorState);

    function translateText(text, callback) {
        const detectedLang = detectLanguage(text);

        // Если язык текста совпадает с целевым языком, отменяем перевод
        if (detectedLang === targetLang) {
            callback(text); // Возвращаем оригинальный текст без перевода
            return;
        }

        const url = `https://translate.google.com/m?hl=${targetLang}&sl=${detectedLang}&tl=${targetLang}&ie=UTF-8&prev=_m&q=${encodeURIComponent(text)}`;

        const request = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const translatedTextElement = doc.querySelector('.result-container');

                    if (translatedTextElement) {
                        callback(translatedTextElement.textContent.trim());
                    } else {
                        console.error("Translation failed");
                    }
                } else {
                    console.error("Error when receiving transfer, status: " + response.status);
                }
                activeRequests = activeRequests.filter(req => req !== request);
            },
            onerror: function () {
                console.error("Network error during transfer request");
                activeRequests = activeRequests.filter(req => req !== request);
            }
        });

        activeRequests.push(request);
    }


    function cancelActiveRequests() {
        activeRequests.forEach(request => {
            if (request && request.abort) {
                request.abort();
            }
        });
        activeRequests = [];
    }

    function annotateMessage(div) {
        const originalText = div.textContent.trim();
        const detectedLang = detectLanguage(originalText);

        if (/^[\s\W]+$/.test(originalText)) {
            return;
        }

        if (detectedLang === targetLang) {
            return;
        }

        const container = document.createElement('div');
        container.style.position = 'relative';

        const translatedDiv = document.createElement('div');
        translatedDiv.classList.add('translated-message');
        translatedDiv.style.color = 'rgb(135, 155, 164)';
        translatedDiv.style.marginTop = '0px';
        translatedDiv.style.paddingLeft = '0px';

        translateText(originalText, function (translatedText) {
            translatedDiv.textContent = translatedText;
            container.appendChild(translatedDiv);
            div.parentNode.insertBefore(container, div.nextSibling);
        });
    }



    function checkNewDiv() {
        const divs = document.querySelectorAll('div[id^="message-content-"]');

        divs.forEach(div => {
            if (!div.dataset.processed) {
                const text = div.textContent;
                let lang = sourceLang === 'auto' ? detectLanguage(text) : sourceLang; // Check for auto-detect

                if (lang && isTranslatorActive) {
                    annotateMessage(div, lang);
                }

                div.dataset.processed = 'true';
            }
        });
    }

    function detectLanguage(text) {
        return text.match(/[a-zA-Z]/) ? 'en' : 'ru';
    }

    function resetTranslations() {
        const translatedMessages = document.querySelectorAll('.translated-message');
        translatedMessages.forEach(msg => msg.remove());
    }

    function translateAllMessages() {
        resetTranslations();
        const divs = document.querySelectorAll('div[id^="message-content-"]');
        divs.forEach(div => {
            const text = div.textContent;
            const lang = detectLanguage(text);

            if (lang === sourceLang && isTranslatorActive) {
                annotateMessage(div);
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.altKey && (event.key === 't' || event.key === 'е')) { // Alt + T or Alt + Е
            event.preventDefault();
            languageSelector.style.display = languageSelector.style.display === 'none' ? 'block' : 'none';
        }
    });

    setInterval(checkNewDiv, 1000);
})();
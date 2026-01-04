// ==UserScript==
// @name         Synopsis Mismatch Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlights synopsis fields when language doesn't match title metadata language for multiple languages
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @run-at       document-start
// @grant        none
// @author       aakpooni
// @downloadURL https://update.greasyfork.org/scripts/538589/Synopsis%20Mismatch%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/538589/Synopsis%20Mismatch%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const languagePatterns = {
        // Spanish
        'es': {
            characters: /[áéíóúñ¿¡]/i,
            commonWords: /\b(el|la|los|las|de|en|con|por|para|esto|esta|ese|esa|muy)\b/i
        },
        // French
        'fr': {
            characters: /[éèêëàâçîïôûùüÿœæ]/i,
            commonWords: /\b(le|la|les|un|une|des|du|de|je|tu|il|nous|vous|ils|est|sont)\b/i
        },
        // German
        'de': {
            characters: /[äöüß]/i,
            commonWords: /\b(der|die|das|und|ist|ich|sie|mit|für|von|den|zu|das|nicht|ein|eine)\b/i
        },
        // Italian
        'it': {
            characters: /[àèéìíîòóùú]/i,
            commonWords: /\b(il|lo|la|i|gli|le|un|uno|una|sono|è|per|con|nel|sulla)\b/i
        },
        // Portuguese
        'pt': {
            characters: /[áâãàçéêíóôõú]/i,
            commonWords: /\b(o|a|os|as|um|uma|não|em|de|para|com|por|seu|sua)\b/i
        },
        // Dutch
        'nl': {
            characters: /[äëïöü]/i,
            commonWords: /\b(de|het|een|hij|zij|wij|jullie|en|of|maar|want|dus)\b/i
        },
        // Polish
        'pl': {
            characters: /[ąćęłńóśźż]/i,
            commonWords: /\b(i|w|na|z|do|to|że|nie|dla|jest|są)\b/i
        },
        // Chinese (Simplified & Traditional)
        'zh': {
            characters: /[\u4E00-\u9FFF]/,
            commonWords: /[的是不我有在人这个们]/
        },
        // Japanese
        'ja': {
            characters: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
            commonWords: /[はをがでのに]/
        },
        // Korean
        'ko': {
            characters: /[\uAC00-\uD7AF\u1100-\u11FF]/,
            commonWords: /[은는이가을를]/
        },
        // Russian
        'ru': {
            characters: /[а-яА-ЯёЁ]/,
            commonWords: /\b(и|в|не|на|я|быть|он|с|что|а|по|это)\b/i
        },
        // Turkish
        'tr': {
            characters: /[ğıİöşü]/i,
            commonWords: /\b(ve|bu|bir|için|ile|ben|sen|o|biz|siz)\b/i
        },
        // Arabic
        'ar': {
            characters: /[\u0600-\u06FF]/,
            commonWords: /[ال|في|من|على|إلى|عن|مع|هذا|التي|هو]/
        },
        // Hindi
        'hi': {
            characters: /[\u0900-\u097F]/,
            commonWords: /[का|के|की|है|में|और|को|से|पर|एक]/
        }
    };

    function detectLanguage(text) {
        if (!text || text.trim().length === 0) return 'unknown';

        // Check for English first (if text only contains ASCII characters and common English words)
        const englishPattern = /^[A-Za-z0-9\s.,!?'"()-]+$/;
        const commonEnglishWords = /\b(the|be|to|of|and|a|in|that|have|I|it|for|not|on|with|he|as|you|do|at)\b/i;

        if (englishPattern.test(text) && commonEnglishWords.test(text)) {
            return 'en';
        }

        // Check for other languages
        for (const [lang, patterns] of Object.entries(languagePatterns)) {
            if (patterns.characters.test(text) || patterns.commonWords.test(text)) {
                return lang;
            }
        }

        return 'unknown';
    }

    function getLanguageCodeFromMetadata(metadataText) {
        const languageMapping = {
            'English': 'en',
            'Spanish': 'es',
            'French': 'fr',
            'German': 'de',
            'Italian': 'it',
            'Portuguese': 'pt',
            'Dutch': 'nl',
            'Polish': 'pl',
            'Chinese': 'zh',
            'Japanese': 'ja',
            'Korean': 'ko',
            'Russian': 'ru',
            'Turkish': 'tr',
            'Arabic': 'ar',
            'Hindi': 'hi'
        };

        for (const [key, value] of Object.entries(languageMapping)) {
            if (metadataText.includes(key)) {
                return value;
            }
        }

        // Handle ISO language codes in metadata
        const isoCodeMatch = metadataText.match(/\[([a-z]{2})-[A-Z]{2}\]/);
        if (isoCodeMatch) {
            return isoCodeMatch[1];
        }

        return 'unknown';
    }

    function highlightSynopsisMismatch() {
        const languageHeader = Array.from(document.querySelectorAll('th')).find(th =>
            th.textContent.trim() === 'Title Metadata Language');
        if (!languageHeader) return;

        const languageCell = languageHeader.nextElementSibling;
        if (!languageCell) return;

        const metadataLanguage = getLanguageCodeFromMetadata(languageCell.textContent.trim());

        const elements = document.querySelectorAll('th');
        elements.forEach(element => {
            const text = element.textContent.trim();

            if (text === 'Short Synopsis' || text === 'Long Synopsis') {
                const synopsisContent = element.nextElementSibling;
                if (!synopsisContent) return;

                const synopsisText = synopsisContent.textContent.trim();
                const detectedLanguage = detectLanguage(synopsisText);

                if (detectedLanguage !== 'unknown' && detectedLanguage !== metadataLanguage) {
                    synopsisContent.style.backgroundColor = '#ffeb3b';
                    synopsisContent.style.padding = '5px';

                    // Add tooltip showing detected language
                    synopsisContent.title = `Detected language: ${detectedLanguage.toUpperCase()}, Expected: ${metadataLanguage.toUpperCase()}`;
                } else {
                    synopsisContent.style.backgroundColor = '';
                    synopsisContent.style.padding = '';
                    synopsisContent.title = '';
                }
            }
        });
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    highlightSynopsisMismatch();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            highlightSynopsisMismatch();
            observeDOMChanges();
        });
    } else {
        highlightSynopsisMismatch();
        observeDOMChanges();
    }
})();

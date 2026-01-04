// ==UserScript==
// @name         Synopsis Language Mismatch Highlighter
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Highlights synopsis fields when language doesn't match title metadata language for multiple languages
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @run-at       document-start
// @grant        none
// @author       aakpooni
// @downloadURL https://update.greasyfork.org/scripts/538617/Synopsis%20Language%20Mismatch%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/538617/Synopsis%20Language%20Mismatch%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const languagePatterns = {
        english: {
            variants: ['en', 'en-us', 'en-gb', 'en-ca', 'en-au', 'en-nz', 'en-ie', 'en-za', 'en-in'],
            words: /\b(the|and|for|that|with|this|from|they|will|would|what|about|there|their|have)\b/gi,
            chars: /^[a-z\s.,!?'"-]+$/i,
            minWords: 3
        },
        german: {
            variants: ['de', 'de-de', 'de-at', 'de-ch', 'de-li', 'de-lu'],
            words: /\b(der|die|das|und|ist|mit|für|von|den|zu|nicht|eine|dass|wird|bei|sind|auch)\b/gi,
            chars: /[äöüßÄÖÜ]/,
            minWords: 2
        },
        french: {
            variants: ['fr', 'fr-fr', 'fr-be', 'fr-ca', 'fr-ch', 'fr-lu', 'fr-mc'],
            words: /\b(les|des|que|dans|est|pour|qui|vous|nous|sont|avec|mais|elle|tout|plus)\b/gi,
            chars: /[éèêëàâçîïôûùüÿœæÉÈÊËÀÂÇÎÏÔÛÙÜŸŒÆ]/,
            minWords: 2
        },
        spanish: {
            variants: ['es', 'es-es', 'es-mx', 'es-ar', 'es-bo', 'es-cl', 'es-co', 'es-cr', 'es-do', 'es-ec', 'es-gt', 'es-hn', 'es-ni', 'es-pa', 'es-pe', 'es-pr', 'es-py', 'es-sv', 'es-uy', 'es-ve'],
            words: /\b(que|los|las|por|una|para|con|del|está|tiene|pero|cuando|este|sobre|muy)\b/gi,
            chars: /[áéíóúñ¿¡ÁÉÍÓÚÑ]/,
            minWords: 2
        },
        portuguese: {
            variants: ['pt', 'pt-br', 'pt-pt', 'pt-ao', 'pt-cv', 'pt-gw', 'pt-mo', 'pt-mz', 'pt-st', 'pt-tl'],
            words: /\b(que|dos|das|não|como|uma|por|seu|quando|muito|nos|está|são|tem|mas)\b/gi,
            chars: /[áâãàçéêíóôõúÁÂÃÀÇÉÊÍÓÔÕÚ]/,
            minWords: 2
        },
        italian: {
            variants: ['it', 'it-it', 'it-ch', 'it-sm', 'it-va'],
            words: /\b(che|per|sono|questo|anche|come|alla|della|quello|tutti|loro|quando)\b/gi,
            chars: /[àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]/,
            minWords: 2
        },
        russian: {
            variants: ['ru', 'ru-ru', 'ru-by', 'ru-kz', 'ru-kg'],
            words: /\b(это|как|все|для|вот|лет|еще|вас|они|вам|уже|чем|если|очень)\b/gi,
            chars: /[а-яёА-ЯЁ]/,
            minWords: 2
        },
        dutch: {
            variants: ['nl', 'nl-nl', 'nl-be', 'nl-aw', 'nl-cw', 'nl-sx'],
            words: /\b(het|een|dat|wat|van|met|bij|nog|maar|wel|toch|alleen|twee|hier)\b/gi,
            chars: /[äëïöüÄËÏÖÜ]/,
            minWords: 2
        },
        norwegian: {
            variants: ['no', 'nb', 'nn', 'no-no', 'nb-no', 'nn-no'],
            words: /\b(og|er|som|på|for|til|med|har|ikke|det|var|jeg|han|hun)\b/gi,
            chars: /[æøåÆØÅ]/,
            minWords: 2
        },
        japanese: {
            variants: ['ja', 'ja-jp'],
            words: /[はをがでのにへとかもる]/,
            chars: /[\u3040-\u309F\u30A0-\u30FF]/,
            minWords: 1
        },
        chinese: {
            variants: ['zh', 'zh-cn', 'zh-tw', 'zh-hk', 'zh-sg', 'zh-mo'],
            words: /[的是不我有在人这个们]/,
            chars: /[\u4E00-\u9FFF]/,
            minWords: 1
        },
        korean: {
            variants: ['ko', 'ko-kr'],
            words: /[는은이가을를]/,
            chars: /[\uAC00-\uD7AF\u1100-\u11FF]/,
            minWords: 1
        },
        arabic: {
            variants: ['ar', 'ar-sa', 'ar-ae', 'ar-bh', 'ar-dz', 'ar-eg', 'ar-iq', 'ar-jo', 'ar-kw', 'ar-lb', 'ar-ly'],
            words: /[في|من|على|إلى|عن|مع|هذا|التي|هو]/,
            chars: /[\u0600-\u06FF]/,
            minWords: 1
        }
    };
    function getLanguageFamily(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return 'unknown';
        }

        const scores = {};

        // Initialize scores
        for (const lang in languagePatterns) {
            scores[lang] = 0;
        }

        // Calculate scores for each language
        for (const [lang, pattern] of Object.entries(languagePatterns)) {
            // Check for special characters
            const charMatches = (text.match(pattern.chars) || []).length;
            scores[lang] += charMatches * 2;

            // Check for common words
            const wordMatches = (text.match(pattern.words) || []).length;
            scores[lang] += wordMatches * 3;

            // If minimum word threshold isn't met, reduce score
            if (wordMatches < pattern.minWords) {
                scores[lang] *= 0.5;
            }
        }

        // Special handling for English (if text is purely ASCII)
        if (/^[a-z\s.,!?'"-]+$/i.test(text)) {
            scores.english += 3;
        }

        // Special handling for CJK languages
        if (/[\u3040-\u30FF]/.test(text)) {
            scores.japanese += 5;
        }
        if (/[\u4E00-\u9FFF]/.test(text)) {
            scores.chinese += 5;
        }
        if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) {
            scores.korean += 5;
        }

        // Find the language with the highest score
        let maxScore = 0;
        let detectedLang = 'unknown';

        for (const [lang, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                detectedLang = lang;
            }
        }

        // Require a minimum confidence threshold
        return maxScore >= 2 ? detectedLang : 'unknown';
    }

    function getMetadataLanguage(metadataText) {
        const lowerText = metadataText.toLowerCase();

        // Check for specific language patterns in metadata
        for (const [lang, pattern] of Object.entries(languagePatterns)) {
            // Check all variants
            for (const variant of pattern.variants) {
                if (lowerText.includes(`[${variant}]`)) {
                    return lang;
                }
            }
            // Check for language name
            if (lowerText.includes(lang)) {
                return lang;
            }
        }

        return 'unknown';
    }

    function has8ContinuousChars(text, lang) {
        // Special handling for languages with different character sets
        switch(lang) {
            case 'chinese':
                return /[\u4E00-\u9FFF]{4,}/.test(text);
            case 'japanese':
                return /[\u3040-\u309F\u30A0-\u30FF]{4,}/.test(text);
            case 'korean':
                return /[\uAC00-\uD7AF\u1100-\u11FF]{4,}/.test(text);
            case 'arabic':
                return /[\u0600-\u06FF]{8,}/.test(text);
            case 'russian':
                return /[а-яёА-ЯЁ]{8,}/.test(text);
            case 'english':
                return /[a-zA-Z]{8,}/.test(text) &&
                       /\b(the|and|for|that|with)\b/i.test(text);
            case 'german':
                return /[a-zA-ZäöüßÄÖÜ]{8,}/.test(text) &&
                       /\b(der|die|das|und|ist)\b/i.test(text);
            case 'french':
                return /[a-zA-ZéèêëàâçîïôûùüÿœæÉÈÊËÀÂÇÎÏÔÛÙÜŸŒÆ]{8,}/.test(text) &&
                       /\b(les|des|que|dans|est)\b/i.test(text);
            case 'spanish':
                return /[a-zA-ZáéíóúñÁÉÍÓÚÑ]{8,}/.test(text) &&
                       /\b(que|los|las|por|una)\b/i.test(text);
            case 'portuguese':
                return /[a-zA-ZáâãàçéêíóôõúÁÂÃÀÇÉÊÍÓÔÕÚ]{8,}/.test(text) &&
                       /\b(que|dos|das|não|como)\b/i.test(text);
            case 'italian':
                return /[a-zA-ZàèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]{8,}/.test(text) &&
                       /\b(che|per|sono|questo|anche)\b/i.test(text);
            case 'dutch':
                return /[a-zA-ZäëïöüÄËÏÖÜ]{8,}/.test(text) &&
                       /\b(het|een|dat|wat|van)\b/i.test(text);
            case 'norwegian':
                return /[a-zA-ZæøåÆØÅ]{8,}/.test(text) &&
                       /\b(og|er|som|på|for)\b/i.test(text);
            default:
                return false;
        }
    }

    function highlightSynopsisMismatch() {
        const languageHeader = Array.from(document.querySelectorAll('th')).find(th =>
            th.textContent.trim() === 'Title Metadata Language');
        if (!languageHeader) return;

        const languageCell = languageHeader.nextElementSibling;
        if (!languageCell) return;

        const metadataText = languageCell.textContent.trim();
        const metadataFamily = getMetadataLanguage(metadataText);

        const elements = document.querySelectorAll('th');
        elements.forEach(element => {
            const text = element.textContent.trim();

            if (text === 'Short Synopsis' || text === 'Long Synopsis') {
                const synopsisContent = element.nextElementSibling;
                if (!synopsisContent) return;

                const synopsisText = synopsisContent.textContent.trim();
                const synopsisFamily = getLanguageFamily(synopsisText);

                // Check for 8 continuous characters for all supported languages
                const has8CharsMatch = has8ContinuousChars(synopsisText, metadataFamily);

                // Only highlight if there's a clear mismatch between language families
                // and there's no 8 continuous character match
                if (synopsisFamily !== 'unknown' &&
                    metadataFamily !== 'unknown' &&
                    synopsisFamily !== metadataFamily &&
                    !has8CharsMatch) {

                    console.log('Language mismatch:', {
                        synopsis: synopsisFamily,
                        metadata: metadataFamily,
                        text: synopsisText.substring(0, 100),
                        has8CharsMatch: has8CharsMatch
                    });

                    synopsisContent.style.backgroundColor = '#ffeb3b';
                    synopsisContent.style.padding = '5px';
                    synopsisContent.title = `Detected: ${synopsisFamily.toUpperCase()}, Expected: ${metadataFamily.toUpperCase()}`;
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

    // Initialize the script
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

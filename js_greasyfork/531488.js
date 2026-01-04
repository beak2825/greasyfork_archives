// ==UserScript==
// @name         YouTube Search Suggestion Translator (YAYTools)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Translate YouTube autocomplete suggestions into English, with fine-tuned spacing.
// @author       YAYLabs
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531488/YouTube%20Search%20Suggestion%20Translator%20%28YAYTools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531488/YouTube%20Search%20Suggestion%20Translator%20%28YAYTools%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Translates text to English using Google's free (unofficial) translate endpoint.
    async function translateToEnglish(text) {
        if (!text) return '';
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            const json = await response.json();
            // Typically found at json[0][0][0]
            const translatedText = json?.[0]?.[0]?.[0];
            return translatedText && translatedText !== text ? translatedText : '';
        } catch (err) {
            console.error('[YAYTools] Translation error:', err);
            return '';
        }
    }

    const observer = new MutationObserver(async () => {
        // Target the same elements as before
        const suggestionSelector = '#i0 .ytSuggestionComponentText';
        const suggestionEls = document.querySelectorAll(suggestionSelector);

        for (const el of suggestionEls) {
            // Skip if we've done this already
            if (el.dataset.hasTranslation === 'true') continue;
            el.dataset.hasTranslation = 'true';

            const originalText = el.innerText.trim();
            if (!originalText) continue;

            const translated = await translateToEnglish(originalText);
            if (!translated) continue;

            // 1) Insert a line break
            const lineBreak = document.createElement('br');
            el.appendChild(lineBreak);

            // 2) Create the translation span
            const translationSpan = document.createElement('span');
            translationSpan.style.color = '#888';
            translationSpan.style.fontSize = '0.85em';

            // Place it slightly higher so it's not too far below the original
            translationSpan.style.position = 'relative';
            translationSpan.style.top = '1.5px';          // adjust this up/down to taste

            // Shift it horizontally a bit to the right
            translationSpan.style.marginLeft = '10px';   // adjust left spacing

            // Add 2–3 spaces before the text for clarity
            translationSpan.textContent = '   ' + translated; // 3 non-breaking spaces

            // 3) Append the translation span
            el.appendChild(translationSpan);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[YAYTools] Fine-tuned spacing for translations is active.');
})();

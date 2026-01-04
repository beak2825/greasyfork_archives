// ==UserScript==
// @name         YouTube Search Results Title Translator (YAYTools)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Translates video titles in YouTube search results into English, displaying translation above the original, adapting color for dark/light theme.
// @author       YAYLabs
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531490/YouTube%20Search%20Results%20Title%20Translator%20%28YAYTools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531490/YouTube%20Search%20Results%20Title%20Translator%20%28YAYTools%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect if YouTube is in dark theme (class "dark-theme" on <ytd-app>)
    function isDarkTheme() {
        return !!document.querySelector('ytd-app.dark-theme');
    }

    /**
     * Translates text to English using Google's free (unofficial) endpoint.
     * @param {string} text
     * @returns {Promise<string>}
     */
    async function translateToEnglish(text) {
        if (!text) return '';
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            const json = await response.json();
            // Typically the translation is at json[0][0][0].
            const translatedText = json?.[0]?.[0]?.[0];
            return translatedText && translatedText !== text ? translatedText : '';
        } catch (err) {
            console.error('[YAYTools] Translation error:', err);
            return '';
        }
    }

    const observer = new MutationObserver(() => {
        // We look for the video titles in normal search results or grid layouts
        const videoTitleEls = document.querySelectorAll(
            'ytd-video-renderer #video-title, ytd-grid-video-renderer #video-title'
        );

        videoTitleEls.forEach(async (titleLink) => {
            // Skip if we've already translated it
            if (titleLink.dataset.translated === 'true') return;
            titleLink.dataset.translated = 'true';

            // Try to get text from 'title' attribute or innerText
            const originalText = titleLink.title?.trim() || titleLink.innerText.trim();
            if (!originalText) return;

            const translated = await translateToEnglish(originalText);
            if (!translated) return;

            const translationDiv = document.createElement('div');
            translationDiv.style.fontSize = '12px';
            translationDiv.style.fontWeight = 'normal';
            translationDiv.style.marginBottom = '4px';

            // Pick color based on dark vs. light theme
            translationDiv.style.color = isDarkTheme() ? '#f9ecb6' : '#A3CFA7';

            translationDiv.textContent = translated;

            // Insert the translation ABOVE the original title
            titleLink.parentNode.insertBefore(translationDiv, titleLink);
        });
    });

    // Watch for dynamically loaded results
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[YAYTools] Theme-aware translator active. Dark uses #f9ecb6, light uses #A3CFA7.');
})();

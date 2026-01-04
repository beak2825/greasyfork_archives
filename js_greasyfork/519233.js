// ==UserScript==
// @name                Youtube字幕
// @version             1.3.0
// @author              LR
// @license             MIT
// @description         YouTube字幕，任何语言翻译成中文，删除英语字幕。
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @require             https://unpkg.com/ajax-hook@latest/dist/ajaxhook.min.js
// @grant               none
// @run-at              document-start
// @namespace           https://greasyfork.org/users/1210499
// @icon                https://www.youtube.com/s/desktop/b9bfb983/img/favicon_32x32.png
// @downloadURL https://update.greasyfork.org/scripts/519233/Youtube%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/519233/Youtube%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_LANG = 'zh'; // 目标语言：中文

    /**
     * Fetch translated subtitles from the YouTube API
     * @param {string} url The request URL for subtitles
     * @returns {Promise<Object|null>} Translated subtitles or null if failed
     */
    async function fetchTranslatedSubtitles(url) {
        const modifiedUrl = url.replace(/(^|[&?])tlang=[^&]*/g, '') + `&tlang=${TARGET_LANG}&translate_h00ked`;
        try {
            const response = await fetch(modifiedUrl, { method: 'GET' });
            if (!response.ok) throw new Error(`Failed to fetch translated subtitles: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Subtitle translation fetch error:", error);
            return null;
        }
    }

    /**
     * Merge default subtitles with translated ones.
     * @param {Object} defaultSubs Default YouTube subtitles
     * @param {Object} translatedSubs Translated subtitles
     * @returns {string} Merged subtitles as a JSON string
     */
    function mergeSubtitles(defaultSubs, translatedSubs) {
        const mergedSubs = { ...defaultSubs }; // Shallow copy to avoid mutation of original
        const translatedMap = new Map(
            translatedSubs.events
                .filter(event => event.segs)
                .map(event => [event.tStartMs, event])
        );

        mergedSubs.events.forEach(event => {
            if (event.segs) {
                // Find the closest translated event based on timestamp
                const closestTranslatedEvent = [...translatedMap.keys()]
                    .reduce((closest, tStartMs) =>
                        Math.abs(tStartMs - event.tStartMs) < Math.abs(closest - event.tStartMs) ? tStartMs : closest, 
                        Infinity
                    );

                const translatedEvent = translatedMap.get(closestTranslatedEvent);
                if (translatedEvent) {
                    const translatedText = translatedEvent.segs.map(seg => seg.utf8).join('');
                    event.segs = [{ utf8: translatedText }]; // Keep only translated text
                }
            }
        });

        return JSON.stringify(mergedSubs);
    }

    /**
     * Handle the response and modify subtitles when needed.
     */
    ah.proxy({
        onResponse: async (response, handler) => {
            if (response.config.url.includes('/api/timedtext') && !response.config.url.includes('&translate_h00ked')) {
                try {
                    const defaultSubs = JSON.parse(response.response);
                    const translatedSubs = await fetchTranslatedSubtitles(response.config.url);
                    if (translatedSubs) {
                        response.response = mergeSubtitles(defaultSubs, translatedSubs);
                    }
                } catch (error) {
                    console.error("Error processing subtitles:", error);
                }
            }
            handler.resolve(response); // Proceed with the response
        }
    });

})();

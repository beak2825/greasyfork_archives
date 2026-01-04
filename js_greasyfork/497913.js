// ==UserScript==
// @name         ニコニコ動画（Re:仮）Emoji Comments Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ニコニコ動画（Re:仮）から絵文字を含むコメントを除外する。
// @author       Yumenaka
// @match        https://www.nicovideo.jp/watch_tmp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497913/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%EF%BC%88Re%3A%E4%BB%AE%EF%BC%89Emoji%20Comments%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/497913/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%EF%BC%88Re%3A%E4%BB%AE%EF%BC%89Emoji%20Comments%20Filter.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

(function() {
    'use strict';

    // Override the fetch function to intercept API calls
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        if (response.url.includes('nvapi.nicovideo.jp/v1/tmp/comments/')) {
            const clonedResponse = response.clone();
            const json = await clonedResponse.json();
            if (json.data && json.data.comments) {
                json.data.comments = json.data.comments.filter(comment => !containsEmoji(comment.message));
                const modifiedResponse = new Response(JSON.stringify(json), {
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText,
                    headers: clonedResponse.headers
                });
                return modifiedResponse;
            }
        }
        return response;
    };

    function containsEmoji(text) {
        const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}\u{1F192}\u{1F193}\u{1F194}\u{1F195}\u{1F196}\u{1F197}\u{1F198}\u{1F199}\u{1F19A}\u{1F201}\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}\u{1F233}\u{1F234}\u{1F235}\u{1F236}\u{1F237}\u{1F238}\u{1F239}\u{1F23A}\u{1F250}\u{1F251}]/gu;
        return emojiRegex.test(text);
    }
})();


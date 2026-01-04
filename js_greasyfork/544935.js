// ==UserScript==
// @name         Hide "Related" Videos in YouTube Search (Mobile)
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0
// @description  Hides YouTube search results labeled "Related" on m.youtube.com
// @author       Jake + ChatGPT
// @match        https://m.youtube.com/results*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544935/Hide%20%22Related%22%20Videos%20in%20YouTube%20Search%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544935/Hide%20%22Related%22%20Videos%20in%20YouTube%20Search%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideRelatedVideos() {
        const videoCards = document.querySelectorAll('ytm-compact-video-renderer, ytm-video-with-context-renderer');
        videoCards.forEach(card => {
            const textMatch = card.textContent?.toLowerCase().includes('related');
            if (textMatch) {
                card.style.display = 'none';
            }
        });
    }

    // Run on load and on dynamic content changes
    const observer = new MutationObserver(hideRelatedVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    hideRelatedVideos(); // Initial run
})();
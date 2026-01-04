// ==UserScript==
// @name         Hide Videos Except Ads on Yandex
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide all videos on Yandex search results except those marked as "Реклама"
// @author       Your Name
// @match        https://ya.ru/video/search*
// @match        https://*.yandex.ru/video/search*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523874/Hide%20Videos%20Except%20Ads%20on%20Yandex.user.js
// @updateURL https://update.greasyfork.org/scripts/523874/Hide%20Videos%20Except%20Ads%20on%20Yandex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to filter videos
    const filterVideos = () => {
        // Select all video containers
        const videoContainers = document.querySelectorAll('.VideoSnippet2');

        videoContainers.forEach(container => {
            const adMarker = container.querySelector(
                'span.ya-unit-category span:first-child'
            );

            // Hide video if it's not an advertisement
            if (!adMarker || adMarker.textContent.trim() !== 'Реклама') {
                container.style.display = 'none'; // Hide the video container
            }
        });
    };

    // Run the filter function when the DOM loads
    document.addEventListener('DOMContentLoaded', filterVideos);

    // Observe dynamic content changes for infinite scroll
    const observer = new MutationObserver(filterVideos);
    observer.observe(document.body, { childList: true, subtree: true });
})();

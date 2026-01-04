// ==UserScript==
// @name         Anime News Network Layout Fix
// @namespace    https://greasyfork.org/en/scripts/530579-anime-news-network-layout-fix
// @version      1.1
// @description  Cleans up the Anime News Network homepage layout by moving/removing some elements and centering the main content for widescreen displays
// @author       Stuart Saddler
// @match        https://www.animenewsnetwork.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530579/Anime%20News%20Network%20Layout%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/530579/Anime%20News%20Network%20Layout%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject custom styles for layout cleanup and centering
    const style = document.createElement('style');
    style.textContent = `
        /* Center the middle-area container */
        .middle-area {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
        }

        /* Set max-width for readability */
        #main {
            width: auto !important;
            max-width: 1800px !important;
        }

        /* Center mainfeed content block */
        #mainfeed {
            margin: 0 auto !important;
            float: none !important;
        }
    `;
    document.head.appendChild(style);

    // Run DOM modifications after page fully loads
    window.addEventListener('load', () => {
        // Move the #menu to the top of <body>
        const menu = document.getElementById('menu');
        if (menu) {
            document.body.insertBefore(menu, document.body.firstChild);
        }

        // Remove the #footer element
        const footer = document.getElementById('footer');
        if (footer && footer.parentNode) {
            footer.parentNode.removeChild(footer);
        }
    });
})();

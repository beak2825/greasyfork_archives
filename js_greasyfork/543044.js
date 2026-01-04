// ==UserScript==
// @name         Commons Special:ListFiles Reverse Image Search
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  Adds Google Lens and TinEye links for files in Special:ListFiles.
// @author       Franco Brignone
// @match        https://commons.wikimedia.org/wiki/Special:ListFiles*
// @match        https://commons.wikimedia.org/w/index.php?title=Special:ListFiles*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543044/Commons%20Special%3AListFiles%20Reverse%20Image%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543044/Commons%20Special%3AListFiles%20Reverse%20Image%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('tr').forEach(row => {
        const timestampCell = row.querySelector('.TablePager_col_img_timestamp');
        const fileLink = row.querySelector('.TablePager_col_img_name a[href*="upload.wikimedia.org"]');

        if (timestampCell && fileLink) {
            const imgURL = fileLink.href;

            // Container div with some top margin
            const container = document.createElement('div');
            container.style.marginTop = '4px';

            // Common style for links
            const linkStyle = `
                color: #0645ad;       /* Wikimedia link blue */
                cursor: pointer;
                font-size: 90%;
                font-weight: normal;
                text-decoration: underline;
                margin-right: 10px;
            `;

            // Google Lens link
            const googleLink = document.createElement('a');
            googleLink.textContent = 'Google';
            googleLink.href = "https://lens.google.com/uploadbyurl?url=" + encodeURIComponent(imgURL) + "&safe=off";
            googleLink.target = '_blank';
            googleLink.rel = 'noopener noreferrer';
            googleLink.style.cssText = linkStyle;

            // TinEye link
            const tineyeLink = document.createElement('a');
            tineyeLink.textContent = 'TinEye';
            tineyeLink.href = "https://www.tineye.com/search?url=" + encodeURIComponent(imgURL);
            tineyeLink.target = '_blank';
            tineyeLink.rel = 'noopener noreferrer';
            tineyeLink.style.cssText = linkStyle;

            container.appendChild(googleLink);
            container.appendChild(tineyeLink);

            timestampCell.appendChild(container);
        }
    });
})();


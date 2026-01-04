// ==UserScript==
// @name         Commons Category Reverse Image Search
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  Adds Google Lens and TinEye links in Commons categories.
// @author       Franco Brignone
// @match        https://commons.wikimedia.org/wiki/Category:*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543043/Commons%20Category%20Reverse%20Image%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/543043/Commons%20Category%20Reverse%20Image%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const linkStyle = `
        color: #0645ad;
        cursor: pointer;
        font-size: 90%;
        font-weight: normal;
        text-decoration: underline;
        margin-right: 10px;
    `;

    document.querySelectorAll('.gallerybox').forEach(galleryBox => {
        const galleryText = galleryBox.querySelector('.gallerytext');
        const thumbImg = galleryBox.querySelector('img');

        if (!galleryText || !thumbImg) return;

        // Reconstruct original image URL from thumbnail URL
        let thumbSrc = thumbImg.src;
        let originalURL = thumbSrc.replace('/thumb', '').replace(/\/[^\/]+$/, '');

        // Create container div for links
        const container = document.createElement('div');
        container.style.marginTop = '4px';

        // Google Lens link
        const googleLink = document.createElement('a');
        googleLink.textContent = 'Google';
        googleLink.href = "https://lens.google.com/uploadbyurl?url=" + encodeURIComponent(originalURL) + "&safe=off";
        googleLink.target = '_blank';
        googleLink.rel = 'noopener noreferrer';
        googleLink.style.cssText = linkStyle;

        // TinEye link
        const tineyeLink = document.createElement('a');
        tineyeLink.textContent = 'TinEye';
        tineyeLink.href = "https://www.tineye.com/search?url=" + encodeURIComponent(originalURL);
        tineyeLink.target = '_blank';
        tineyeLink.rel = 'noopener noreferrer';
        tineyeLink.style.cssText = linkStyle;

        container.appendChild(googleLink);
        container.appendChild(tineyeLink);

        // Append container below the filesize text inside .gallerytext
        galleryText.appendChild(container);
    });
})();


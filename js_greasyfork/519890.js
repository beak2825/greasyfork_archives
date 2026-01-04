// ==UserScript==
// @name         SubHD合集字幕置顶
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Move collection section below subtitle info on SubHD.tv
// @author       Allion
// @match        https://subhd.tv/d/*
// @license     MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=subhd.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519890/SubHD%E5%90%88%E9%9B%86%E5%AD%97%E5%B9%95%E7%BD%AE%E9%A1%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/519890/SubHD%E5%90%88%E9%9B%86%E5%AD%97%E5%B9%95%E7%BD%AE%E9%A1%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load
    window.addEventListener('load', function() {
        // Find the collection section by looking for text content "合集"
        const sections = document.querySelectorAll('.f12.bg-light.bg-gradient.text-danger.fw-bold');
        let collectionSection = null;
        let collectionContent = null;

        for (let section of sections) {
            if (section.textContent.trim() === '合集') {
                collectionSection = section;
                // Get all content until the next hr element
                collectionContent = [];
                let nextEl = section;
                while (nextEl) {
                    // Clone the element
                    collectionContent.push(nextEl.cloneNode(true));
                    // Remove original
                    let toRemove = nextEl;
                    nextEl = nextEl.nextElementSibling;
                    toRemove.remove();
                    // Stop if we reach the end
                    if (!nextEl) break;
                }
                break;
            }
        }

        if (collectionSection && collectionContent.length > 0) {
            // Find the subtitle info section
            const subtitleInfo = document.querySelector('.shadow-sm.p-3.my-3.bg-white.rounded-3');

            if (subtitleInfo) {
                // Create container for collection content
                const container = document.createElement('div');
                container.className = 'bg-white shadow-sm rounded-3 mb-5';

                // Add all collection content
                collectionContent.forEach(el => container.appendChild(el));

                // Insert after subtitle info
                subtitleInfo.parentNode.insertBefore(container, subtitleInfo.nextSibling);
            }
        }
    });
})();
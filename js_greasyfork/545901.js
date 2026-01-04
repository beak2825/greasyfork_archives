// ==UserScript==
// @name        Show Only English Comics
// @namespace   Violentmonkey Scripts
// @match       https://nhentai.net/tag/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 6/26/2025, 3:51:26 AM
// @downloadURL https://update.greasyfork.org/scripts/545901/Show%20Only%20English%20Comics.user.js
// @updateURL https://update.greasyfork.org/scripts/545901/Show%20Only%20English%20Comics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filterGalleryDivs() {
        const galleryDivs = document.querySelectorAll('div.gallery');

        galleryDivs.forEach(div => {
            const dataTagValue = div.dataset.tags;

            if (!dataTagValue || !dataTagValue.includes('12227')) {
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
            }
        });
    }

    if (document.readyState === 'complete') {
        filterGalleryDivs();
    } else {
        window.addEventListener('load', filterGalleryDivs);
    }


})();
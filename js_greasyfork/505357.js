// ==UserScript==
// @name         EMP Replace Thumbnail Images with Full Images
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace all thumbnail images on with full images
// @author       bighype
// @include      /^https:\/\/www\.empornium\.(me|sx|is)\/torrents\.php\?id=\d+/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505357/EMP%20Replace%20Thumbnail%20Images%20with%20Full%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/505357/EMP%20Replace%20Thumbnail%20Images%20with%20Full%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all <img> elements on the page
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        // Check if the image is from the specific domains and ends with '.th.jpg', '.th.png', '.md.jpg', or '.md.png'
        if ((img.src.includes('jerking.empornium.ph') || img.src.includes('fapping.empornium.sx'))) {
            if (img.src.endsWith('.th.jpg') || img.src.endsWith('.md.jpg')) {
                img.src = img.src.replace(/\.th\.jpg$|\.md\.jpg$/, '.jpg');
            } else if (img.src.endsWith('.th.png') || img.src.endsWith('.md.png')) {
                img.src = img.src.replace(/\.th\.png$|\.md\.png$/, '.png');
            }
            // Also replace in the 'alt' attribute if present
            if (img.alt) {
                if (img.alt.endsWith('.th.jpg') || img.alt.endsWith('.md.jpg')) {
                    img.alt = img.alt.replace(/\.th\.jpg$|\.md\.jpg$/, '.jpg');
                } else if (img.alt.endsWith('.th.png') || img.alt.endsWith('.md.png')) {
                    img.alt = img.alt.replace(/\.th\.png$|\.md\.png$/, '.png');
                }
            }
        }
    });
})();

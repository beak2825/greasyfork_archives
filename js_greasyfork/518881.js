// ==UserScript==
// @name         Karups Images
// @namespace    https://greasyfork.org/en/users/1384264-atman
// @version      2024-11-23
// @description  Access to full size content and download buttons
// @author       atman
// @match        https://*.karups.com/gallery/*
// @match        https://*.karupsow.com/gallery/*
// @match        https://*.karupsha.com/gallery/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/518881/Karups%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/518881/Karups%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const galleryBlock = document.querySelector('.gallery-thumbs');
    const photoHolders = document.querySelectorAll('.thumb-grid-item img');

    if (photoHolders) {
        photoHolders.forEach(img => {
            const originalSrc = img.src;
            const fullImageUrl = originalSrc.replace(/lowres/g, 'highres').replace(/\.thumb/g, '').replace(/\/thumbs/g, '').replace(/1500(?!.*1500)/, '3000').replace(/1024(?!.*1024)/, '1500');

            // Set the link
            const link = document.createElement('a');
            link.href = fullImageUrl;
            link.target = '_blank';
            img.parentNode.insertBefore(link, img);
            link.appendChild(img);
        });

        const originalSrc = photoHolders[1].src.replace(/lowres/g, 'highres').replace(/\.thumb/g, '').replace(/\/thumbs/g, '').replace(/1500(?!.*1500)/, '3000').replace(/1024(?!.*1024)/, '1500');
        const downloadUrl = originalSrc.replace(/\/highres/g, '').slice(0, -8) + ".zip";
        // Create a single download button
        if (downloadUrl) {
            const downloadButton = document.createElement('a');
            downloadButton.href = downloadUrl;
            downloadButton.textContent = 'Download ZIP';
            downloadButton.style.cssText = `
            display: block;
            margin-bottom: 10px;
            padding: 10px 10px;
            background: linear-gradient(90deg, #00d478, #297d58);
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-weight: bold;
            transition: background 0.5s linear;
            `;

            let insertDiv = document.querySelector('.content-information');
            if(insertDiv){
                document.querySelector('.button-holder').remove();
                insertDiv.appendChild(downloadButton);
            }
            else {
                insertDiv = document.querySelector('.gallery-thumbs');
                document.querySelector('.gallery-desc.cf').remove();
                insertDiv.insertBefore(downloadButton, insertDiv.firstChild);
            }

        }
    }
})();
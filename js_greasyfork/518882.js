// ==UserScript==
// @name         ATKingdom Images
// @namespace    https://greasyfork.org/en/users/1384264-atman
// @version      2024-11-24
// @description  Access to full size content and download buttons
// @author       atman
// @match        https://*.amkingdom.com/tour/photo/*
// @match        https://*.atkpetites.com/tour/photo/*
// @match        https://*.atkpremium.com/tour/photo/*
// @match        https://*.atkexotics.com/tour/photo/*
// @match        https://*.atkhairy.com/tour/photo/*
// @match        https://*.atkarchives.com/tour/photo/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/518882/ATKingdom%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/518882/ATKingdom%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const galleryBlock = document.querySelector('.content-header');
    const photoHolders = document.querySelectorAll('.photo_holder img');

    if (photoHolders) {
        photoHolders.forEach(img => {
            let originalSrc = img.src;
            let modifiedSrc = originalSrc.replace(/cdn\d{2}/, 'content').replace('thumbs', '3000');

            // Set the link
            let joinLink = img.closest('.photo_holder').parentElement;
            joinLink.href = modifiedSrc;
            joinLink.target = '_blank';
        });

        const srcUrl = photoHolders[1].src.split('.jpg')[0].slice(0, -3) + "_3000_all.zip";
        const downloadUrl = srcUrl.replace(/cdn\d{2}/, 'content').replace('thumbs', '3000');

        // Create a single download button
        if (downloadUrl) {
            const joinNow = document.querySelector('.left .member');
            const downloadButton = document.createElement('a');
            downloadButton.href = downloadUrl;
            downloadButton.textContent = 'Download ZIP';
            downloadButton.style.cssText = `
            display: block;
            margin-bottom: 10px;
            padding: 5px 10px;
            background: linear-gradient(90deg, #00d478, #297d58);
            color: #FFFFFF;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            transition: background 0.5s linear;
        `;

            if (joinNow) {
                let joinNow = document.querySelector('.left .member');
                joinNow.innerText = '';
                joinNow.appendChild(downloadButton);
                document.querySelector('.login_section').remove();
                document.querySelector('.join_bottom').remove();
            }
            else {
                galleryBlock.insertBefore(downloadButton, galleryBlock.firstChild);
                document.querySelector('.pull-left').remove();
                document.querySelector('.pull-right').remove();
            }
        }
    }
})();
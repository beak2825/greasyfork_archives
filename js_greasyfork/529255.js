// ==UserScript==
// @name         Roblox 2016 Item Viewer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Restores the look of the item viewer to look more like how it did in 2016
// @author       Xx_3mdiv1der78_xX [AKA: The_Noise.]
// @match        https://www.roblox.com/catalog/*
// @match        https://www.roblox.com/bundles/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529255/Roblox%202016%20Item%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/529255/Roblox%202016%20Item%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* White box for item details with a border */
        .item-details-wrapper {
            background: #fff !important;
            border: 10px solid #FFFFFF !important;
            border-radius: 3px !important;
            padding: 12px !important;
            margin: 12px auto !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
            position: relative;
        }

        /* Thumbnail outline */
        .thumbnail-holder {
            border: 1px solid #B8B8B8 !important;
            border-radius: 3px !important;
            padding: 3px !important;
        }

        /* Recommendations styling */
        .item-card-caption .recommended-creator {
            margin-top: 3px !important;
            font-size: 12px !important;
        }
        .item-card-caption .recommended-creator-by {
            margin-right: 3px !important;
            color: #666 !important;
        }
        .item-card-caption .recommended-creator .xsmall {
            font-size: 12px !important;
            line-height: 14px !important;
        }
        .item-card-caption .recommended-creator .text-link {
            color: #00A2FF !important;
            text-decoration: none !important;
        }
        .item-card-caption .recommended-creator .text-label {
            color: #666 !important;
            font-weight: normal !important;
        }

        /* Recommendations header */
        .item-list-carousel-title h1.font-header-1 {
            font-size: 20px !important;
            font-weight: 400 !important;
            color: #333 !important;
        }

        /* BTR Preview Container Styles */
        #item-thumbnail-container-frontend .thumbnail-2d-container {
            position: relative !important;
        }

        #item-thumbnail-container-frontend .thumbnail-2d-container .btr-preview-container-itempage {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 1 !important;
        }

        /* Ensure BTR preview stays visible */
        #item-thumbnail-container-frontend .btr-preview-container-itempage {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* Ensure the canvas stays visible */
        #item-thumbnail-container-frontend .btr-preview-container canvas {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    function updateStyles() {
        // Only remove empty item-details-wrapper elements
        const existingWrappers = document.querySelectorAll('.item-details-wrapper');
        existingWrappers.forEach(wrapper => {
            // Check if this wrapper contains the item content
            const hasThumbnail = wrapper.querySelector('#item-thumbnail-container-frontend');
            const hasInfo = wrapper.querySelector('#item-info-container-frontend');

            // Only remove if it doesn't contain the important content
            if (!hasThumbnail && !hasInfo) {
                wrapper.remove();
            }
        });

        // Check if we already have a wrapper with content
        const existingContentWrapper = document.querySelector('.item-details-wrapper #item-thumbnail-container-frontend');
        if (!existingContentWrapper) {
            // Create a new wrapper only if we don't have one with content
            const itemDetailsWrapper = document.createElement('div');
            itemDetailsWrapper.className = 'item-details-wrapper';

            // Move the relevant elements into the new wrapper
            const thumbnailContainer = document.querySelector('#item-thumbnail-container-frontend');
            const infoContainer = document.querySelector('#item-info-container-frontend');
            const socialContainer = document.querySelector('.item-social-container');

            if (thumbnailContainer && infoContainer) {
                itemDetailsWrapper.appendChild(thumbnailContainer);
                itemDetailsWrapper.appendChild(infoContainer);
                if (socialContainer) {
                    itemDetailsWrapper.appendChild(socialContainer);
                }
                // Insert the new wrapper into the page
                const pageContent = document.querySelector('.page-content');
                if (pageContent) {
                    pageContent.insertBefore(itemDetailsWrapper, pageContent.firstChild);
                }
            }
        }

        // Handle BTR thumbnails
        function positionBTRThumbnail() {
            const btrPreview = document.querySelector('.btr-preview-container-itempage');
            const thumbnail2dContainer = document.querySelector('#item-thumbnail-container-frontend .thumbnail-2d-container');

            if (btrPreview && thumbnail2dContainer && !thumbnail2dContainer.contains(btrPreview)) {
                // Move the BTR preview into the 2D thumbnail container specifically
                thumbnail2dContainer.appendChild(btrPreview);

                // Ensure the preview stays visible
                btrPreview.style.display = 'block';
                btrPreview.style.visibility = 'visible';
                btrPreview.style.opacity = '1';

                // Ensure the canvas stays visible
                const canvas = btrPreview.querySelector('canvas');
                if (canvas) {
                    canvas.style.display = 'block';
                    canvas.style.visibility = 'visible';
                    canvas.style.opacity = '1';
                }
            }
        }

        // Remove the item-details-container if it exists
        const detailsContainer = document.querySelector('.item-details-container');
        if (detailsContainer) {
            detailsContainer.remove();
        }

        // Update creator sections
        const creatorDivs = document.querySelectorAll('.item-card-caption .item-card-creator:not(.recommended-creator)');
        creatorDivs.forEach(div => {
            div.classList.add('recommended-creator');

            const span = div.querySelector('span');
            const link = div.querySelector('a');

            if (!span || !link) return;

            const byLabel = document.createElement('span');
            byLabel.className = 'xsmall text-label recommended-creator-by';
            byLabel.textContent = 'By';

            link.className = 'xsmall text-overflow text-link ng-binding';

            span.textContent = '';
            span.append(byLabel, ' ', link);
        });

        // Update Recommendations header
        const header = document.querySelector('.item-list-carousel-title h1.font-header-1');
        if (header && header.textContent.trim() === 'Recommendations') {
            header.textContent = 'Recommended Items';
        }

        // Initial BTR positioning
        positionBTRThumbnail();

        // Add observer for thumbnail changes
        const thumbnailObserver = new MutationObserver(() => {
            positionBTRThumbnail();
        });

        // Start observing the thumbnail container
        const thumbnailTarget = document.querySelector('#item-thumbnail-container-frontend');
        if (thumbnailTarget) {
            thumbnailObserver.observe(thumbnailTarget, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });
        }
    }

    // Run on page load and watch for changes
    let timeout;
    const observer = new MutationObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(updateStyles, 100);
    });

    function initObserver() {
        const container = document.querySelector('.item-list-carousel');
        if (container) {
            updateStyles();
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(initObserver, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initObserver);
    } else {
        initObserver();
    }
})();
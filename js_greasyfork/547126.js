// ==UserScript==
// @name         Open All Graphic Assets - CRISP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button next to Images text to open all graphic assets
// @author       aakpooni
// @match        https://kdpow.amazon.com/work/vdp/baseline/*
// @match        https://crisp.amazon.com/details/*
// @match        https://kdpow.amazon.com/work/pv/baseline/*
// @match        https://m.media-amazon.com/images/S/pv-target-images/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547126/Open%20All%20Graphic%20Assets%20-%20CRISP.user.js
// @updateURL https://update.greasyfork.org/scripts/547126/Open%20All%20Graphic%20Assets%20-%20CRISP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createOpenAllButton() {
        // Find the Images text container
        let imagesElements;

        if (window.location.href.includes('/work/pv/baseline/')) {
            // For PV baseline pages
            imagesElements = Array.from(document.querySelectorAll('.a-box-inner'))
                .filter(el => el.textContent.includes('Images'));
        } else if (window.location.href.includes('m.media-amazon.com/images/S/pv-target-images/')) {
            // For media pages
            imagesElements = Array.from(document.querySelectorAll('div'))
                .filter(el => el.textContent.includes('Images'));
        } else {
            // For other pages
            imagesElements = Array.from(document.getElementsByClassName('a-box-inner'))
                .filter(el => el.textContent.trim() === 'Images');
        }

        imagesElements.forEach(container => {
            // Check if button already exists
            if (container.querySelector('.open-all-assets-btn')) return;

            // Create button
            const button = document.createElement('button');
            button.textContent = 'Open all Assets';
            button.className = 'open-all-assets-btn';
            button.style.cssText = `
                margin-left: 10px;
                padding: 3px 8px;
                background: #2E7D32;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                display: inline-block;
                vertical-align: middle;
            `;

            // Add click event listener
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openAllAssets(container);
            });

            // Add button next to Images text
            container.appendChild(button);
        });
    }

    function openAllAssets(container) {
        let parentContainer;

        if (window.location.href.includes('/work/pv/baseline/')) {
            // For PV baseline pages
            parentContainer = container.closest('.a-box-group.a-spacing-large');
        } else if (window.location.href.includes('m.media-amazon.com/images/S/pv-target-images/')) {
            // For media pages
            parentContainer = document.body; // or any specific container that contains all images
        } else {
            // For other pages
            parentContainer = container.closest('.a-box-group');
        }

        if (!parentContainer) return;

        // Find all image links
        const links = parentContainer.querySelectorAll('a[href*="images-amazon.com"], a[href*="m.media-amazon.com"]');

        if (!links || links.length === 0) return;

        // Open each link in a new tab
        links.forEach(link => {
            window.open(link.href, '_blank');
        });
    }

    // Initial setup with longer delay for PV baseline pages
    function init() {
        if (window.location.href.includes('/work/pv/baseline/') ||
            window.location.href.includes('m.media-amazon.com/images/S/pv-target-images/')) {
            setTimeout(createOpenAllButton, 2000); // Longer delay for PV baseline and media pages
        } else {
            setTimeout(createOpenAllButton, 1000);
        }
    }

    // Wait for page to load
    window.addEventListener('load', init);

    // Observer for dynamic content loading
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                if (window.location.href.includes('/work/pv/baseline/') ||
                    window.location.href.includes('m.media-amazon.com/images/S/pv-target-images/')) {
                    setTimeout(createOpenAllButton, 2000);
                } else {
                    setTimeout(createOpenAllButton, 1000);
                }
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add button when URL changes (for single-page applications)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 2000);
        }
    }).observe(document, {subtree: true, childList: true});
})();

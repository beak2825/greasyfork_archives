// ==UserScript==
// @name         Aither | Icon and Logo Replacement
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhance Aither's appearance by replacing the default favicon and logo with custom icons
// @author       Anil & Claude
// @author       icons by dbl
// @license      MIT
// @match        https://aither.cc/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520134/Aither%20%7C%20Icon%20and%20Logo%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/520134/Aither%20%7C%20Icon%20and%20Logo%20Replacement.meta.js
// ==/UserScript==

// Preload images
const preloadImages = () => {
    const images = [
        'https://ptpimg.me/1h1guy.png',
        'https://ptpimg.me/zdz840.png'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Flag
let isCustomized = false;

// Main customization function
const customizeAitherSite = () => {
    if (isCustomized) return;

    // Change favicon images
    const allImages = document.querySelectorAll('img[src*="favicon_32x32.ico"]');
    allImages.forEach(img => {
        if (!img.dataset.modified) {
            const originalHeight = img.style.height;
            const originalVerticalAlign = img.style.verticalAlign;

            img.src = 'https://ptpimg.me/1h1guy.png';
            img.style.height = originalHeight;
            img.style.verticalAlign = originalVerticalAlign;
            img.dataset.modified = 'true';
        }
    });

    // Change logo elements
    const siteLogoElements = document.querySelectorAll('.top-nav__site-logo');
    siteLogoElements.forEach(logoElement => {
        if (!logoElement.dataset.modified) {
            logoElement.style.display = 'none';

            const newImage = document.createElement('img');
            newImage.src = 'https://ptpimg.me/zdz840.png';
            newImage.style.height = '22px';
            newImage.style.width = 'auto';
            newImage.alt = 'Aither Logo';

            logoElement.parentNode.insertBefore(newImage, logoElement.nextSibling);
            logoElement.dataset.modified = 'true';
        }
    });

    // Update flag if all changes are complete
    if (allImages.length > 0 && siteLogoElements.length > 0) {
        isCustomized = true;
    }
};

// Initialization function
const initializeCustomization = () => {
    // Preload images
    preloadImages();

    // Apply changes and observe
    const applyAndObserve = () => {
        customizeAitherSite();

        // Monitor dynamic changes
        const observer = new MutationObserver((mutations) => {
            if (!isCustomized) {
                customizeAitherSite();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Apply changes when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAndObserve);
    } else {
        applyAndObserve();
    }
};

// Start
initializeCustomization();
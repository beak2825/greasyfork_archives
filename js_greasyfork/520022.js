// ==UserScript==
// @name         Aither | Icon & Color Replacement | OCS + favicon
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  close up with Aither colors progressive scheme
// @author       Anil & Claude
// @author       icons by dbl
// @license      MIT
// @match        https://aither.cc/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/520022/Aither%20%7C%20Icon%20%20Color%20Replacement%20%7C%20OCS%20%2B%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/520022/Aither%20%7C%20Icon%20%20Color%20Replacement%20%7C%20OCS%20%2B%20favicon.meta.js
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    /* globals jQuery */

    // Combined rank configurations with icon URLs and colors
    const rankConfigs = {
        'fa-user-cog': {                // Admin
            icon: 'https://ptpimg.me/jepqgd.png'
        },
        'fa-paint-brush': {             // Contributor
            icon: 'https://ptpimg.me/nz355k.png'
        },
        'fa-edit': {                    // Editor
            icon: 'https://ptpimg.me/i2o56p.png'
        },
        'fa-life-ring': {               // FLS
            icon: 'https://ptpimg.me/7ze86a.png'
        },
        'fa-magic': {                   // Internal
            icon: 'https://ptpimg.me/6x4259.png'
        },
        'fa-crown': {                   // Owner
            icon: 'https://ptpimg.me/xq82oc.png'
        },
        'fa-shield': {                  // Trustee
            icon: 'https://ptpimg.me/9130l6.png'
        },
        'fa-fire': {                    // Typhon
            icon: 'https://ptpimg.me/7imo4p.png'
        },
        'fa-user': {                    // Phobos
            icon: 'https://ptpimg.me/cd517z.png',
            color: '#b8c8ff'
        },
        'fa-user-plus': {               // Harmonia
            icon: 'https://ptpimg.me/ylggau.png',
            color: '#a5b8ff'
        },
        'fa-user-tag': {                // Zeus
            icon: 'https://ptpimg.me/4t0c4f.png',
            color: '#7f8eff'
        },
        'fa-user-tie': {                // Helios
            icon: 'https://ptpimg.me/s87z38.png',
            color: '#508bf2'
        },
        'fa-user-graduate': {           // Prometheus
            icon: 'https://ptpimg.me/890gvc.png',
            color: '#6a6cff'
        },
        'fa-user-md': {                 // Oceanus
            icon: 'https://ptpimg.me/g8ji8z.png',
            color: '#6c7eff'
        },
        'fa-user-secret': {             // Gigantes
            icon: 'https://ptpimg.me/1r9b0t.png',
            color: '#466eff'
        },
        'fa-user-astronaut': {          // Titan
            icon: 'https://ptpimg.me/roo523.png',
            color: '#214e96'
        }
    };

    // WeakSet to track processed elements
    const processedElements = new WeakSet();

    // Immediately inject critical CSS
    const criticalCSS = document.createElement('style');
    criticalCSS.textContent = `
        img[src*="https://aither.cc/favicon_32x32.ico"] {
            visibility: hidden;
        }
        img[src*="https://aither.cc/favicon_32x32.ico"].replaced {
            visibility: visible;
        }
        ${Object.keys(rankConfigs).map(className => `.${className}:before`).join(', ')} {
            display: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(criticalCSS);

    // Function to replace status badge
    function replaceStatusBadge() {
        const badges = document.querySelectorAll('img[src*="https://aither.cc/favicon_32x32.ico"]:not(.replaced)');
        badges.forEach(badge => {
            if (!processedElements.has(badge)) {
                badge.src = 'https://ptpimg.me/1h1guy.png';
                badge.classList.add('replaced');
                processedElements.add(badge);
            }
        });
    }

    // Main function to replace icons and update colors
    function replaceIcons() {
        // Replace status badge first
        replaceStatusBadge();

        // Select and process all elements at once
        const selector = Object.keys(rankConfigs).map(className => `.${className}`).join(', ');
        document.querySelectorAll(selector).forEach(element => {
            if (processedElements.has(element)) return;

            const elementClass = Object.keys(rankConfigs).find(className =>
                element.classList.contains(className)
            );

            if (elementClass && !element.querySelector('img.custom-icon')) {
                const config = rankConfigs[elementClass];

                // Create image element
                const img = document.createElement('img');
                img.src = config.icon;
                img.className = 'custom-icon';
                img.style.cssText = `
                    height: 1em;
                    width: 1em;
                    vertical-align: middle;
                    margin-right: ${element.tagName === 'A' ? '0.3em' : '0'};
                `;

                // Insert image at the beginning
                element.insertBefore(img, element.firstChild);

                // Apply color changes
                if (config.color) {
                    const topNav = element.closest('.top-nav__username, .top-nav__username--highresolution');
                    if (topNav) {
                        const textBold = element.closest('a').querySelector('.text-bold');
                        if (textBold) textBold.style.color = config.color;
                    } else if (element.tagName === 'A') {
                        element.style.color = config.color;
                    } else {
                        const closestA = element.closest('a');
                        if (closestA) closestA.style.color = config.color;
                    }
                }

                processedElements.add(element);
            }
        });
    }

    // Run immediately
    replaceIcons();

    // Pre-load images
    Object.values(rankConfigs).forEach(config => {
        const img = new Image();
        img.src = config.icon;
    });

    // Set up mutation observer before DOM is ready
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length ||
                (mutation.type === 'attributes' &&
                 (mutation.attributeName === 'src' || mutation.attributeName === 'class'))) {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) {
            replaceIcons();
        }
    });

    // Start observing as soon as possible
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'class']
        });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'class']
            });
        });
    }

    // Additional event listeners for dynamic content
    document.addEventListener('DOMContentLoaded', replaceIcons);
    window.addEventListener('load', replaceIcons);
    document.addEventListener('readystatechange', replaceIcons);

    // Handle AJAX updates
    if (window.jQuery) {
        jQuery(document).ajaxComplete(replaceIcons);
    }
})();
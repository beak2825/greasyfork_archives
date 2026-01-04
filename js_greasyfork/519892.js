// ==UserScript==
// @name         Aither | Better User Icons | PCS
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Alternative with Aither colors progressive scheme for user icons
// @author       Anil & Claude
// @author       icons by dbl
// @license      MIT
// @match        https://aither.cc/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519892/Aither%20%7C%20Better%20User%20Icons%20%7C%20PCS.user.js
// @updateURL https://update.greasyfork.org/scripts/519892/Aither%20%7C%20Better%20User%20Icons%20%7C%20PCS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Combined rank configurations with icon URLs and colors
    const rankConfigs = {
        'fa-user': {                    // Phobos
            icon: 'https://ptpimg.me/6411w3.png',
            color: '#b8c8ff'
        },
        'fa-user-plus': {               // Harmonia
            icon: 'https://ptpimg.me/a0id4y.png',
            color: '#87c1f4'
        },
        'fa-user-tag': {                // Zeus
            icon: 'https://ptpimg.me/oq942q.png',
            color: '#6abeee'
        },
        'fa-user-tie': {                // Helios
            icon: 'https://ptpimg.me/z4ui3i.png',
            color: '#4ebae9'
        },
        'fa-user-graduate': {           // Prometheus
            icon: 'https://ptpimg.me/n06r73.png',
            color: '#43abe6'
        },
        'fa-user-md': {                 // Oceanus
            icon: 'https://ptpimg.me/wycr7e.png',
            color: '#4793e8'
        },
        'fa-user-secret': {             // Gigantes
            icon: 'https://ptpimg.me/x7xu2m.png',
            color: '#4e78e9'
        },
        'fa-user-astronaut': {          // Titan
            icon: 'https://ptpimg.me/6l4v9q.png',
            color: '#5760eb'
        },
        'fa-angle-up': {                // Junior Uploader
            icon: 'https://ptpimg.me/3832wl.png'
        },
        'fa-angles-up': {               // Uploader
            icon: 'https://ptpimg.me/nxxpo2.png'
        },
        'fa-fire': {                    // Typhon
            icon: 'https://ptpimg.me/7imo4p.png'
        },
        'fa-magic': {                   // Internal
            icon: 'https://ptpimg.me/6x4259.png'
        },
        'fa-paint-brush': {             // Contributor
            icon: 'https://ptpimg.me/nz355k.png'
        },
        'fa-shield': {                  // Trustee
            icon: 'https://ptpimg.me/9130l6.png'
        },
        'fa-life-ring': {               // FLS
            icon: 'https://ptpimg.me/7ze86a.png'
        },
        'fa-edit': {                    // Editor
            icon: 'https://ptpimg.me/i2o56p.png'
        },
        'fa-balance-scale': {           // Moderator
            icon: 'https://ptpimg.me/e41414.png'
        },
        'fa-user-cog': {                // Administrator
            icon: 'https://ptpimg.me/jepqgd.png'
        },
        'fa-terminal': {                // Coder
            icon: 'https://ptpimg.me/5o17r7.png'
        },
        'fa-crown': {                   // Owner
            icon: 'https://ptpimg.me/xq82oc.png'
        }
    };
    // Preload images
    const imageCache = new Map();
    function preloadImages() {
        Object.values(rankConfigs).forEach(config => {
            const img = new Image();
            img.src = config.icon;
            imageCache.set(config.icon, img);
        });
    }

    // Add initial hiding styles immediately
    const initialStyle = document.createElement('style');
    initialStyle.textContent = `
        /* Hide original Font Awesome icons immediately */
        ${Object.keys(rankConfigs).map(className =>
            `.${className}:not(.top-nav__main-menus .fa-life-ring):before`
        ).join(', ')} {
            display: none !important;
        }

        /* Prevent FOUC by hiding icons until ready */
        .custom-icon {
            opacity: 0 !important;
            transition: opacity 0.2s ease-in !important;
        }
        .custom-icon.loaded {
            opacity: 1 !important;
        }
    `;
    document.documentElement.appendChild(initialStyle);

    // Add main styles
    const mainStyle = document.createElement('style');
    mainStyle.textContent = `
        /* Basic icon style */
        .custom-icon {
            display: inline-block !important;
            height: 1em !important;
            width: 1em !important;
            will-change: transform !important;
        }

        /* Styles for normal cases */
        .custom-icon:not(.panel__body .custom-icon):not(.torrent-icons .custom-icon):not(.top-nav__username .custom-icon):not(.top-nav__username--highresolution .custom-icon):not(.user-tag__link .custom-icon) {
            vertical-align: -0.125em !important;
            margin-right: 0.3em !important;
            transform: translateY(0.15em) !important;
        }

        /* Special style for top nav username */
        .top-nav__username .custom-icon,
        .top-nav__username--highresolution .custom-icon {
            transform: translateY(0.1em) !important;
            vertical-align: -0.125em !important;
        }

        /* Special style for torrent icons */
        .torrent-icons .custom-icon {
            vertical-align: -0.125em !important;
            margin-right: 0 !important;
        }

        /* Special style for icons in panel body */
        .panel__body.text-center .custom-icon {
            vertical-align: -0.125em !important;
        }

        /* Special style for user tag links */
        .user-tag__link .custom-icon {
            vertical-align: -0.125em !important;
            margin-right: 0.2em !important;
            transform: translateY(0.05em) !important;
        }

        /* Fix for Font Awesome alignment in user tags */
        .user-tag__link {
            display: inline-flex !important;
            align-items: center !important;
        }
    `;

    // Main function to replace icons with performance optimizations
    function replaceIcons() {
        Object.keys(rankConfigs).forEach(className => {
            const elements = document.querySelectorAll(`.${className}:not([data-icon-replaced])`);

            elements.forEach(element => {
                // Skip if in top-nav__main-menus or already processed
                if (element.closest('.top-nav__main-menus')) return;
                if (element.querySelector('.custom-icon')) return;

                const config = rankConfigs[className];

                // Use cached image if available
                const cachedImg = imageCache.get(config.icon);
                const img = document.createElement('img');
                img.src = config.icon;
                img.className = 'custom-icon';

                // Mark as loaded if cached image is complete
                if (cachedImg && cachedImg.complete) {
                    img.classList.add('loaded');
                } else {
                    img.onload = () => img.classList.add('loaded');
                }

                element.insertBefore(img, element.firstChild);
                element.setAttribute('data-icon-replaced', 'true');

                // Apply color if specified
                if (config.color) {
                    if (element.closest('.top-nav__username, .top-nav__username--highresolution')) {
                        const boldText = element.closest('a').querySelector('.text-bold');
                        if (boldText) boldText.style.color = config.color;
                    } else if (element.tagName === 'A') {
                        element.style.color = config.color;
                    } else {
                        const parentLink = element.closest('a');
                        if (parentLink) parentLink.style.color = config.color;
                    }
                }

                // Additional alignment fix for user tag links
                if (element.closest('.user-tag__link')) {
                    element.style.display = 'inline-flex';
                    element.style.alignItems = 'center';
                }
            });
        });
    }

    // Initialize with optimizations
    function init() {
        // Add main styles
        document.head.appendChild(mainStyle);

        // Preload images
        preloadImages();

        // Initial replacement
        replaceIcons();

        // Optimized observer setup
        const observer = new MutationObserver((mutations) => {
            let shouldReplace = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    shouldReplace = true;
                    break;
                }
            }
            if (shouldReplace) {
                replaceIcons();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
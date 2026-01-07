// ==UserScript==
// @name         YouTube - Small As Before Thumbnails
// @description  Shrink large YouTube thumbnails & adjust layout
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @supportURL   https://github.com/5tratz/Tampermonkey-Scripts/issues
// @version      0.1.2
// @author       5tratz
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545720/YouTube%20-%20Small%20As%20Before%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/545720/YouTube%20-%20Small%20As%20Before%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with defaults
    const config = {
        thumbnailWidth: GM_getValue('thumbnailWidth', 246),
        thumbnailHeight: GM_getValue('thumbnailHeight', 138),
        gapSize: GM_getValue('gapSize', 8),
        thumbnailsPerRow: GM_getValue('thumbnailsPerRow', 5),
        // ADDED: Responsive mode setting
        useResponsiveMode: GM_getValue('useResponsiveMode', false),
        responsiveMinWidth: GM_getValue('responsiveMinWidth', 180),
        responsiveMaxWidth: GM_getValue('responsiveMaxWidth', 320)
    };

    // Register menu commands for configuration - IN YOUR REQUESTED ORDER
    GM_registerMenuCommand('Configure Thumbnail Layout', configureLayout);
    GM_registerMenuCommand('Enable/Disable Responsive Mode', toggleResponsiveMode);
    GM_registerMenuCommand('Reset to Defaults', resetToDefaults);

    // ADDED: Function to toggle responsive mode
    function toggleResponsiveMode() {
        config.useResponsiveMode = !config.useResponsiveMode;
        GM_setValue('useResponsiveMode', config.useResponsiveMode);

        if (config.useResponsiveMode) {
            const minWidth = prompt('Minimum thumbnail width for responsive mode (pixels, 120-250 recommended):', config.responsiveMinWidth);
            if (minWidth !== null) {
                const parsedMinWidth = parseInt(minWidth);
                if (!isNaN(parsedMinWidth) && parsedMinWidth >= 100 && parsedMinWidth <= 300) {
                    config.responsiveMinWidth = parsedMinWidth;
                    GM_setValue('responsiveMinWidth', parsedMinWidth);
                }
            }

            const maxWidth = prompt('Maximum thumbnail width for responsive mode (pixels, 250-400 recommended):', config.responsiveMaxWidth);
            if (maxWidth !== null) {
                const parsedMaxWidth = parseInt(maxWidth);
                if (!isNaN(parsedMaxWidth) && parsedMaxWidth >= 200 && parsedMaxWidth <= 500) {
                    config.responsiveMaxWidth = parsedMaxWidth;
                    GM_setValue('responsiveMaxWidth', parsedMaxWidth);
                }
            }

            alert('Responsive Mode ENABLED!\n\nThumbnails will automatically adjust size based on screen width.\nMin: ' + config.responsiveMinWidth + 'px, Max: ' + config.responsiveMaxWidth + 'px');
        } else {
            alert('Responsive Mode DISABLED!\n\nUsing fixed thumbnail size: ' + config.thumbnailWidth + 'px');
        }

        applyCustomCSS();
    }

    // Function to show configuration dialog
    function configureLayout() {
        const width = prompt('Thumbnail width (pixels):', config.thumbnailWidth);
        if (width !== null) {
            const parsedWidth = parseInt(width);
            if (!isNaN(parsedWidth) && parsedWidth > 0) {
                config.thumbnailWidth = parsedWidth;
                config.thumbnailHeight = Math.round(parsedWidth * (9/16)); // Maintain 16:9 aspect ratio
                GM_setValue('thumbnailWidth', config.thumbnailWidth);
                GM_setValue('thumbnailHeight', config.thumbnailHeight);
            }
        }

        const gap = prompt('Gap between thumbnails (pixels):', config.gapSize);
        if (gap !== null) {
            const parsedGap = parseInt(gap);
            if (!isNaN(parsedGap) && parsedGap >= 0) {
                config.gapSize = parsedGap;
                GM_setValue('gapSize', config.gapSize);
            }
        }

        const perRow = prompt('Thumbnails per row (4-6 recommended):', config.thumbnailsPerRow);
        if (perRow !== null) {
            const parsedPerRow = parseInt(perRow);
            if (!isNaN(parsedPerRow) && parsedPerRow >= 3 && parsedPerRow <= 8) {
                config.thumbnailsPerRow = parsedPerRow;
                GM_setValue('thumbnailsPerRow', config.thumbnailsPerRow);
            }
        }

        applyCustomCSS();
        alert('Settings saved! Refresh YouTube page to see changes.');
    }

    // Function to reset to defaults
    function resetToDefaults() {
        // Your preferred defaults
        config.thumbnailWidth = 246;
        config.thumbnailHeight = 138; // 246 * 9/16 = 138.375 ≈ 138
        config.gapSize = 8;
        config.thumbnailsPerRow = 5;
        config.useResponsiveMode = false;
        config.responsiveMinWidth = 180;
        config.responsiveMaxWidth = 320;

        GM_setValue('thumbnailWidth', config.thumbnailWidth);
        GM_setValue('thumbnailHeight', config.thumbnailHeight);
        GM_setValue('gapSize', config.gapSize);
        GM_setValue('thumbnailsPerRow', config.thumbnailsPerRow);
        GM_setValue('useResponsiveMode', config.useResponsiveMode);
        GM_setValue('responsiveMinWidth', config.responsiveMinWidth);
        GM_setValue('responsiveMaxWidth', config.responsiveMaxWidth);

        applyCustomCSS();
        alert('Reset to defaults! Refresh YouTube page to see changes.');
    }

    // ADDED: Function to calculate responsive thumbnail width
    function calculateResponsiveWidth() {
        if (!config.useResponsiveMode) {
            // Use original calculation
            const maxWidth = Math.floor((window.innerWidth - 100) / config.thumbnailsPerRow);
            return Math.min(config.thumbnailWidth, maxWidth);
        }

        // Responsive mode: calculate based on screen width
        const screenWidth = window.innerWidth;

        // Scale thumbnail width based on screen size
        let responsiveWidth;

        if (screenWidth < 1280) {
            // Small screens (mobile/tablet)
            responsiveWidth = config.responsiveMinWidth;
        } else if (screenWidth < 1920) {
            // HD screens
            responsiveWidth = config.responsiveMinWidth + (config.responsiveMaxWidth - config.responsiveMinWidth) * 0.3;
        } else if (screenWidth < 2560) {
            // 2K/QHD screens
            responsiveWidth = config.responsiveMinWidth + (config.responsiveMaxWidth - config.responsiveMinWidth) * 0.6;
        } else if (screenWidth < 3840) {
            // 4K screens
            responsiveWidth = config.responsiveMinWidth + (config.responsiveMaxWidth - config.responsiveMinWidth) * 0.8;
        } else {
            // Ultra-wide/5K+ screens
            responsiveWidth = config.responsiveMaxWidth;
        }

        // Ensure it fits within min/max bounds
        responsiveWidth = Math.max(config.responsiveMinWidth, Math.min(config.responsiveMaxWidth, responsiveWidth));

        // Ensure it's not too wide for the screen
        const maxPossibleWidth = Math.floor((screenWidth - 100) / config.thumbnailsPerRow);
        return Math.min(Math.floor(responsiveWidth), maxPossibleWidth);
    }

    // Function to add or update the style
    function applyCustomCSS() {
        let style = document.getElementById('CustomCSSwrapper');
        if (!style) {
            style = document.createElement('style');
            style.id = 'CustomCSSwrapper';
            document.head.appendChild(style);
        }

        // Calculate dynamic values based on thumbnails per row
        const calculatedWidth = calculateResponsiveWidth();
        const calculatedHeight = Math.round(calculatedWidth * (9/16));

        // ADDED: Multi-monitor responsive CSS
        const responsiveCSS = config.useResponsiveMode ? `
            /* Multi-monitor responsive adjustments */
            @media (min-width: 3840px) {
                /* 4K monitor optimization */
                #video-title {
                    font-size: 1.5rem !important;
                }
                #channel-name.ytd-video-meta-block {
                    font-size: 1.4rem !important;
                }
                #metadata-line {
                    font-size: 1.4rem !important;
                }
            }

            @media (min-width: 5120px) {
                /* Ultra-wide monitor optimization */
                #video-title {
                    font-size: 1.6rem !important;
                }
                #channel-name.ytd-video-meta-block {
                    font-size: 1.5rem !important;
                }
                #metadata-line {
                    font-size: 1.5rem !important;
                }
            }

            /* Prevent layout breaking on multi-monitor setups */
            ytd-rich-grid-renderer {
                max-width: 100vw !important;
            }
        ` : '';

        style.textContent = `
            /* -----------------------------
               YouTube Small Thumbnails CSS
               ----------------------------- */

            /* Target all grid containers including featured rows */
            ytd-rich-grid-renderer,
            ytd-rich-grid-row,
            #contents.ytd-rich-grid-row,
            #contents.ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${config.thumbnailsPerRow + 1} !important;
            }

            /* Control ALL rich items consistently */
            ytd-rich-item-renderer {
                min-width: ${calculatedWidth}px !important;
                max-width: ${calculatedWidth}px !important;
                width: ${calculatedWidth}px !important;
                flex: 0 0 ${calculatedWidth}px !important;
            }

            /* Fix grid container layout */
            ytd-rich-grid-renderer {
                display: block !important;
            }

            /* Fix row containers */
            ytd-rich-grid-row {
                display: flex !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                gap: ${config.gapSize}px !important;
            }

            /* Fix the content wrapper in rows */
            #contents.ytd-rich-grid-row,
            #contents.ytd-rich-grid-renderer {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(${calculatedWidth}px, 1fr)) !important;
                gap: ${config.gapSize}px !important;
                width: 100% !important;
                max-width: 100% !important;
                justify-content: center !important;
                grid-auto-flow: row !important;
            }

            /* FIX: Ensure main grid container wraps properly */
            ytd-rich-grid-renderer #contents {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(${calculatedWidth}px, 1fr)) !important;
                justify-content: center !important;
                grid-auto-flow: row !important;
            }

            /* Ensure all thumbnails have consistent size - HOME PAGE ONLY */
            ytd-rich-grid-renderer ytd-thumbnail,
            ytd-rich-item-renderer ytd-thumbnail {
                width: ${calculatedWidth}px !important;
                height: ${calculatedHeight}px !important;
                aspect-ratio: 16/9 !important;
            }

            /* Hide channel avatar image from video grid - HOME PAGE ONLY */
            ytd-rich-grid-renderer #avatar-link {
                display: none !important;
            }

            /* Make video titles a bit bigger */
            #video-title {
                font-size: 1.4rem !important;
            }

            /* Make channel names bigger */
            #channel-name.ytd-video-meta-block {
                font-size: 1.3rem !important;
            }

            /* Make metadata (views, time, etc.) bigger */
            #metadata-line {
                font-size: 1.3rem !important;
            }

            /* Hide YouTube's "mini guide" (small left sidebar) */
            .ytd-mini-guide-renderer {
                display: none !important;
            }

            /* Remove any max-width constraints on the main grid */
            ytd-rich-grid-renderer > #contents {
                max-width: none !important;
            }

            /* Fix for promoted/shorts shelf if needed */
            ytd-rich-shelf-renderer ytd-rich-item-renderer {
                min-width: ${calculatedWidth}px !important;
                max-width: ${calculatedWidth}px !important;
                width: ${calculatedWidth}px !important;
            }

            /* Ensure consistent spacing */
            ytd-rich-item-renderer {
                margin: 0 !important;
            }

            /* Optional: Remove any padding that might affect layout */
            #primary.ytd-browse {
                padding-left: 0 !important;
                padding-right: 0 !important;
            }

            /* FIX: Additional selector for different YouTube layouts */
            ytd-rich-grid-renderer[use-prominent-thumbs] #contents,
            ytd-rich-grid-renderer[use-spring-loading] #contents {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(${calculatedWidth}px, 1fr)) !important;
                justify-content: center !important;
                grid-auto-flow: row !important;
            }

            /* ADDED: Responsive and multi-monitor support */
            ${responsiveCSS}

            /* ADDED: Better handling for very wide screens */
            @media (min-width: 3000px) {
                ytd-rich-grid-renderer #contents,
                #contents.ytd-rich-grid-row {
                    justify-content: flex-start !important;
                }
            }
        `;
    }

    // REMOVED: The addSettingsButton() function completely
    // Settings will only be accessed through Tampermonkey dropdown

    // Apply CSS immediately
    applyCustomCSS();

    // Reapply when page changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                applyCustomCSS();
            }, 100);
        }
    }).observe(document, { subtree: true, childList: true });

    // Also reapply periodically to catch dynamic content
    setInterval(applyCustomCSS, 2000);

    // Reapply CSS on window resize - MORE IMPORTANT for multi-monitor
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(applyCustomCSS, 150);
    });
})();
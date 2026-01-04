// ==UserScript==
// @name         YouTube - Small As Before Thumbnails
// @description  Shrink large YouTube thumbnails & adjust layout
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/64/2504/2504965.png
// @version      0.1.0
// @author       rxm
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
        thumbnailsPerRow: GM_getValue('thumbnailsPerRow', 5)
    };

    // Register menu commands for configuration
    GM_registerMenuCommand('Configure Thumbnail Layout', configureLayout);
    GM_registerMenuCommand('🔄 Reset to Defaults', resetToDefaults);

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

        GM_setValue('thumbnailWidth', config.thumbnailWidth);
        GM_setValue('thumbnailHeight', config.thumbnailHeight);
        GM_setValue('gapSize', config.gapSize);
        GM_setValue('thumbnailsPerRow', config.thumbnailsPerRow);

        applyCustomCSS();
        alert('Reset to defaults! Refresh YouTube page to see changes.');
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
        const maxWidth = Math.floor((window.innerWidth - 100) / config.thumbnailsPerRow);
        const calculatedWidth = Math.min(config.thumbnailWidth, maxWidth);
        const calculatedHeight = Math.round(calculatedWidth * (9/16));

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
        `;
    }

    // Add a settings button to YouTube interface
    function addSettingsButton() {
        // Check if button already exists
        if (document.getElementById('yt-thumbnail-settings-btn')) return;

        // Wait for YouTube's topbar to be available
        const observer = new MutationObserver(() => {
            const topbar = document.querySelector('#end');
            if (topbar && !document.getElementById('yt-thumbnail-settings-btn')) {
                // Create settings button
                const settingsBtn = document.createElement('button');
                settingsBtn.id = 'yt-thumbnail-settings-btn';
                settingsBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span style="margin-left: 8px; font-size: 14px;">Thumbnail Settings</span>
                `;
                settingsBtn.style.cssText = `
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    color: white;
                    padding: 8px 16px;
                    margin: 0 8px;
                    cursor: pointer;
                    font-family: 'Roboto', 'Arial', sans-serif;
                    font-size: 14px;
                    transition: background 0.2s;
                `;
                settingsBtn.onmouseover = () => {
                    settingsBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                };
                settingsBtn.onmouseout = () => {
                    settingsBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                };
                settingsBtn.onclick = configureLayout;

                // Insert button in topbar
                topbar.insertBefore(settingsBtn, topbar.firstChild);
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Apply CSS immediately
    applyCustomCSS();

    // Add settings button
    setTimeout(addSettingsButton, 3000);

    // Reapply when page changes (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                applyCustomCSS();
                addSettingsButton();
            }, 100);
        }
    }).observe(document, { subtree: true, childList: true });

    // Also reapply periodically to catch dynamic content
    setInterval(applyCustomCSS, 2000);

    // Reapply CSS on window resize
    window.addEventListener('resize', applyCustomCSS);
})();
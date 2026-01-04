// ==UserScript==
// @name         YouTube Classic Interface Restoration
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Restore YouTube's interface to match pre-update classic dimensions
// @author       DCS
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535876/YouTube%20Classic%20Interface%20Restoration.user.js
// @updateURL https://update.greasyfork.org/scripts/535876/YouTube%20Classic%20Interface%20Restoration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to restore classic YouTube dimensions and styling
    const classicYouTubeCSS = `
        /* Restore classic header height */
        ytd-masthead {
            height: 56px !important;
            min-height: 56px !important;
            padding: 0 16px !important;
        }

        /* Restore classic logo size */
        #masthead-logo {
            transform: none !important;
        }

        /* Standard search bar width */
        ytd-searchbox {
            max-width: 640px !important;
        }

        /* Fix thumbnail sizes to classic dimensions */
        ytd-rich-grid-media, ytd-thumbnail {
            transform: none !important;
        }

        /* Restore 4 videos per row (classic YouTube standard) */
        ytd-rich-grid-renderer #contents {
            --ytd-rich-grid-items-per-row: 4 !important;
        }

        /* Fix classic spacing in video grid */
        ytd-rich-grid-row #contents {
            gap: 16px !important;
        }

        /* Restore original padding in grid items */
        ytd-rich-item-renderer {
            margin: 0 8px 24px 8px !important;
            padding: 0 !important;
        }

        /* Fix video title styling */
        #video-title {
            margin: 12px 0 4px 0 !important;
            font-size: 14px !important;
            line-height: 20px !important;
            font-weight: 500 !important;
            max-height: 40px !important;
            overflow: hidden !important;
        }

        /* Restore channel information styling */
        ytd-channel-name, #metadata-line {
            font-size: 13px !important;
            line-height: 18px !important;
            margin: 4px 0 !important;
            color: #606060 !important;
        }

        /* Classic sidebar width */
        ytd-guide-renderer {
            width: 240px !important;
            overflow-x: hidden !important;
        }

        /* Classic mini-guide width */
        ytd-mini-guide-renderer {
            width: 72px !important;
        }

        ytd-guide-section-renderer {
            padding: 8px 0 !important;
        }

        /* Restore classic sidebar item styling */
        ytd-guide-entry-renderer {
            height: 40px !important;
            padding: 0 !important;
            font-size: 14px !important;
        }

        ytd-guide-entry-renderer tp-yt-paper-item {
            padding: 0 24px !important;
            min-height: 40px !important;
        }

        /* Classic icon size in sidebar */
        ytd-guide-entry-renderer yt-icon {
            width: 24px !important;
            height: 24px !important;
        }

        /* Restore classic search results spacing */
        ytd-item-section-renderer {
            padding: 20px 0 !important;
        }

        /* Classic video player page layout */
        ytd-watch-flexy #primary {
            padding: 24px 24px 0 0 !important;
            max-width: 70% !important;
        }

        ytd-watch-flexy #secondary {
            padding: 24px 0 0 0 !important;
            max-width: 30% !important;
        }

        /* Classic player controls */
        .ytp-chrome-bottom {
            height: 40px !important;
        }

        .ytp-chrome-controls {
            height: 40px !important;
        }

        /* Classic comment section styling */
        ytd-comments {
            margin-top: 24px !important;
            font-size: 100% !important;
        }

        ytd-comment-renderer {
            padding: 16px 0 !important;
        }

        /* Classic chips/filters bar styling */
        yt-chip-cloud-renderer {
            --yt-chip-height: 32px !important;
        }

        yt-chip-cloud-chip-renderer {
            height: 32px !important;
            margin: 8px 8px 8px 0 !important;
        }

        /* Restore button sizing */
        yt-button-renderer, yt-formatted-string {
            font-size: 100% !important;
        }

        /* Restore card styling */
        ytd-rich-section-renderer {
            margin: 24px 0 !important;
            transform: none !important;
        }

        /* Classic description styling */
        #description-inline-expander {
            font-size: 100% !important;
            padding: 12px !important;
        }

        /* Classic avatar size */
        yt-img-shadow, #avatar {
            width: 40px !important;
            height: 40px !important;
        }

        /* Remove modern rounded corners */
        ytd-thumbnail, ytd-playlist-thumbnail, ytd-playlist-panel-video-renderer,
        ytd-rich-grid-slim-media, ytd-chip-cloud-chip-renderer, ytd-video-preview {
            border-radius: 0 !important;
            overflow: hidden;
        }

        /* Remove modern shadow effects */
        ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer,
        ytd-compact-video-renderer, ytd-playlist-video-renderer {
            box-shadow: none !important;
        }

        /* Fix popup menus */
        ytd-menu-popup-renderer {
            border-radius: 2px !important;
        }

        /* Fix watch page layout */
        ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy {
            max-width: calc(100% - 426px) !important;
        }

        ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy {
            max-width: 402px !important;
        }

        /* Optional: Hide Shorts completely */
        /* Uncomment the following if you want to hide Shorts section
        ytd-guide-entry-renderer[ep-guide-item-type="TYPE_SHORTS"],
        ytd-mini-guide-entry-renderer[guide-item-type="TYPE_SHORTS"],
        ytd-rich-shelf-renderer[is-shorts],
        ytd-rich-section-renderer:has([is-shorts]),
        ytd-reel-shelf-renderer {
            display: none !important;
        }
        */
    `;

    // Insert the CSS into the page
    const styleElement = document.createElement('style');
    styleElement.textContent = classicYouTubeCSS;
    document.head.appendChild(styleElement);

    // Function to further adjust elements to match classic YouTube
    function applyClassicYouTubeAdjustments() {
        // Restore classic hover effects
        const thumbnails = document.querySelectorAll('ytd-thumbnail');
        thumbnails.forEach(thumbnail => {
            if (!thumbnail.hasAttribute('classic-style-applied')) {
                thumbnail.style.transition = 'opacity 0.1s cubic-bezier(0.4, 0, 1, 1)';
                thumbnail.setAttribute('classic-style-applied', 'true');
            }
        });

        // Ensure classic layout for video page
        if (window.location.pathname === '/watch') {
            const videoContainer = document.querySelector('ytd-watch-flexy');
            if (videoContainer && !videoContainer.hasAttribute('classic-layout-applied')) {
                // Only apply once
                videoContainer.setAttribute('classic-layout-applied', 'true');
            }
        }
    }

    // Apply immediately with a delay to ensure page elements are loaded
    setTimeout(applyClassicYouTubeAdjustments, 1000);

    // Also apply on navigation and DOM changes (YouTube is a SPA)
    const observer = new MutationObserver(() => {
        setTimeout(applyClassicYouTubeAdjustments, 500);
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Add keyboard shortcut to toggle the script (Ctrl+Alt+Y)
    let isEnabled = true;
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.code === 'KeyY') {
            isEnabled = !isEnabled;
            styleElement.disabled = !isEnabled;
            alert(isEnabled ? 'YouTube Classic Interface: Enabled' : 'YouTube Classic Interface: Disabled');
        }
    });

})();

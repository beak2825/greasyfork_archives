// ==UserScript==
// @name         Old Red YouTube Progress Bar
// @namespace    https://greasyfork.org/en/users/1384870
// @version      1.2.1
// @description  Restores the old solid red YouTube progress bars and other UI elements (favicon, icons, etc.) with red color styling. Dynamically applies on page loads and DOM changes.
// @author       Rastrisr
// @compatible   firefox
// @compatible   chrome
// @compatible   edge
// @match        *://*.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513628/Old%20Red%20YouTube%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/513628/Old%20Red%20YouTube%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply old red progress bar and additional style tweaks
    function applyCustomStyles() {
        let styleElement = document.getElementById('customYouTubeStyles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'customYouTubeStyles';
            document.head.appendChild(styleElement);
        }

        // Apply all the styles
        styleElement.innerHTML = `
            .ytp-play-progress {
                background: #FF0000 !important; /* Old solid red for video player progress */
            }
            #progress.ytd-thumbnail-overlay-resume-playback-renderer {
                background: #FF0000 !important; /* Red for thumbnail overlay progress */
            }
            #progress.yt-page-navigation-progress {
                background: #FF0000 !important; /* Red for top loading bar */
            }
            .YtProgressBarLineProgressBarPlayed {
                background: #FF0000 !important; /* Red for hover preview progress */
            }
            .ytp-cairo-refresh-signature-moments .ytp-play-progress {
                background: #FF0000 !important; /* Removes pink fade from playback progress */
            }
            ytd-thumbnail-overlay-resume-playback-renderer[enable-refresh-signature-moments-web] #progress.ytd-thumbnail-overlay-resume-playback-renderer {
                background: #FF0000 !important; /* Red for refreshed signature moments */
            }
            html[refresh], [refresh] {
                --yt-spec-static-brand-red: #FF0000 !important;
                --yt-spec-static-overlay-background-brand: rgba(255, 0, 0, 0.9) !important; /* Red for playback head dot */
            }
            #icon > .yt-icon-shape.style-scope.yt-icon.yt-spec-icon-shape > div > svg > path:first-of-type {
                fill: #FF0000 !important; /* Red for shorts icon */
            }
            .YtProgressBarLineProgressBarPlayedRefresh.YtProgressBarLineProgressBarPlayed {
                background: #FF0000 !important; /* Red for shorts progress bar */
            }
            .YtProgressBarPlayheadProgressBarPlayheadDot {
                background-color: #FF0000 !important; /* Red for shorts playhead dot */
            }
            .yt-spec-icon-badge-shape__badge {
                background: #CC0000 !important;
                color: #FFF !important; /* Red for notification badge and white font */
            }
            html, [light] {
                --yt-frosted-glass-desktop: rgba(255, 255, 255, 1.0) !important; /* Remove transparency from title bar */
                --yt-spec-red-indicator: #FF0000 !important; /* Red for settings icon */
            }
            html[dark], [dark] {
                --yt-frosted-glass-desktop: rgba(15, 15, 15, 1.0) !important;
                --yt-spec-red-indicator: #FF0000 !important;
            }
            yt-page-navigation-progress[enable-refresh-signature-moments-web] #progress.yt-page-navigation-progress {
                background: #FF0000 !important; /* Red for refresh progress bar */
            }
            #logo-icon > .yt-spec-icon-shape.yt-icon.style-scope.yt-icon-shape > div > svg > g:first-of-type > path:first-of-type {
                fill: #FF0000 !important; /* Red for YouTube logo */
            }
            .yt-core-attributed-string--inline-block-mod > img {
                filter: brightness(100%) saturate(100%) hue-rotate(18deg) !important; /* Red for link preview icon */
            }
            .yt-spec-avatar-shape--cairo-refresh.yt-spec-avatar-shape--live-ring::after {
                background: #FF0000 !important; /* Red for live-ring */
            }
        `;
    }

    // Function to remove YouTube favicon to prevent it from being replaced with pinkish one
    function removeYouTubeFavicons() {
        let favicons = document.querySelectorAll('link[rel*="icon"]');
        favicons.forEach(favicon => {
            favicon.remove();
        });
    }

    // MutationObserver to ensure styles are reapplied dynamically
    function observeForChanges() {
        const observer = new MutationObserver(() => {
            applyCustomStyles();
            removeYouTubeFavicons();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initial application of styles and setting up the observer
    setTimeout(() => {
        applyCustomStyles();
        removeYouTubeFavicons();
        observeForChanges();
    }, 2000);

})();
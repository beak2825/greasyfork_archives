// ==UserScript==
// @name         YouTube Middle Mouse Button Mute / Unmute
// @description  Mutes / unmutes a YouTube video / Shorts by clicking the middle mouse button within the video player. For Shorts you can also middle mouse click the black side bars around the video. While performing the middle mouse button click, the scroll button gets disabled. Mute / unmute / scroll disabling won't work with any elements floating over the video player.
// @namespace    https://greasyfork.org/users/877912
// @version      0.5
// @license      MIT
// @match        *://*.youtube.com/watch*?*v=*
// @match        *://*.youtube.com/embed/*?*v=*
// @match        *://*.youtube.com/v/*
// @match        *://*.youtube.com/shorts/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501758/YouTube%20Middle%20Mouse%20Button%20Mute%20%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/501758/YouTube%20Middle%20Mouse%20Button%20Mute%20%20Unmute.meta.js
// ==/UserScript==

(function() {

    // Flag to enable or disable showing borders around floating elements aka ignoredMuteUnmuteElements and debug elements
    const debug = false;

    const muteUnmuteElements = {
        videoAreaRegularAndShorts: "video.video-stream.html5-main-video",
        videoAreaRegularBlackBars1: "div.ytp-player-content.ytp-iv-player-content[data-layer='4']",
        videoAreaRegularBlackBars2: "div#movie_player",
        videoAreaShortsBlackBars: "div#shorts-container",
        muteButtonRegular: "button.ytp-mute-button",
        muteButtonShorts: "button.YtdDesktopShortsVolumeControlsMuteIconButton",
        contentContainer: "div#contentContainer",
        endscreenPreviousButton: "button.ytp-button.ytp-endscreen-previous",
        endscreenNextButton: "button.ytp-button.ytp-endscreen-next",
        endscreenContainer: "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles.ytp-endscreen-paginate",
        endscreenContainerVariant1: "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles",
        endscreenContainerVariant2: "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles[data-layer='4']",
        videoOverlay: "div.ytp-iv-video-content[data-layer='4']"
    };

    const ignoredMuteUnmuteElements = {
        ".branding-context-container-outer": "blue" // Branding container
    };

    const debugElements = {
        ".ytp-cards-teaser": "red",                  // Cards teaser
        ".ytp-pip-button": "red",                    // Picture-in-Picture button
        ".ytp-ad-overlay-container": "red",          // Ad overlays
        ".ytp-ad-player-overlay": "red",             // Ad overlays
        ".ytp-endscreen-content": "red",             // Endscreen content
        ".ytp-chrome-bottom": "red",                 // Bottom controls (progress bar, play button, etc.)
        ".ytp-chrome-top": "red",                    // Top controls (settings, subtitles, etc.)
        ".ytp-gradient-top": "red",                  // Gradient overlays at the top
        ".ytp-gradient-bottom": "red",               // Gradient overlays at the bottom
        ".ytp-ce-element": "red",                    // End screen elements
        ".ytp-ce-element-shadow": "red",             // Shadows for end screen elements
        ".ytp-subtitles-button": "red",              // Subtitles button
        ".ytp-caption-window": "red",                // Caption window for subtitles
        ".ytp-spinner": "red",                       // Loading spinner
        ".ytp-fullscreen-button": "red",             // Fullscreen button
        ".ytp-play-button": "red",                   // Play button
        ".ytp-volume-panel": "red",                  // Volume panel
        ".ytp-share-button": "red",                  // Share button
        ".ytp-like-button-renderer": "red",          // Like button
        ".picture-in-picture-toggle": "red",         // Firefox Picture-in-Picture toggle button
        ".ytp-title": "red"                          // YouTube video title area
    };

    let isClicked = false;

    function handleMiddleClick(event) {
        if (event.button !== 1 || isClicked) return;

        for (let selector of Object.keys(ignoredMuteUnmuteElements)) {
            if (event.target.closest(selector) && !event.target.closest(muteUnmuteElements.ytpTitle) && !event.target.closest(muteUnmuteElements.contentContainer)) return;
        }

        let muteButton = null;
        isClicked = true;
        setTimeout(() => isClicked = false, 200);
        event.preventDefault();

        if (event.target.matches(muteUnmuteElements.videoAreaRegularAndShorts) ||
            event.target.matches(muteUnmuteElements.videoOverlay)) {
            muteButton = window.location.href.includes("shorts") ? document.querySelector(muteUnmuteElements.muteButtonShorts) : document.querySelector(muteUnmuteElements.muteButtonRegular);
        } else if (
            event.target.closest(muteUnmuteElements.videoAreaRegularBlackBars1) ||
            event.target.matches(muteUnmuteElements.videoAreaRegularBlackBars2) ||
            event.target.matches(muteUnmuteElements.contentContainer) ||
            event.target.matches(muteUnmuteElements.endscreenPreviousButton) ||
            event.target.matches(muteUnmuteElements.endscreenNextButton) ||
            event.target.matches(muteUnmuteElements.endscreenContainer) ||
            event.target.matches(muteUnmuteElements.endscreenContainerVariant1) ||
            event.target.matches(muteUnmuteElements.endscreenContainerVariant2)
        ) {
            muteButton = document.querySelector(muteUnmuteElements.muteButtonRegular);
        } else if (event.target.matches(muteUnmuteElements.videoAreaShortsBlackBars)) {
            muteButton = document.querySelector(muteUnmuteElements.muteButtonShorts);
        }

        if (muteButton) muteButton.click();
    }

    function addBorderStyles(elements) {
        const style = document.createElement('style');
        style.type = 'text/css';
        let styles = '';

        for (let selector in elements) {
            styles += `
                ${selector} {
                    border: 2px solid ${elements[selector]} !important;
                }
            `;
        }

        style.innerHTML = styles;
        document.head.appendChild(style);
    }

    document.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            if (event.target.matches(muteUnmuteElements.videoAreaRegularAndShorts) ||
                event.target.matches(muteUnmuteElements.videoOverlay) ||
                event.target.closest(muteUnmuteElements.videoAreaRegularBlackBars1) ||
                event.target.matches(muteUnmuteElements.videoAreaRegularBlackBars2) ||
                event.target.matches(muteUnmuteElements.videoAreaShortsBlackBars) ||
                event.target.matches(muteUnmuteElements.contentContainer) ||
                event.target.matches(muteUnmuteElements.endscreenPreviousButton) ||
                event.target.matches(muteUnmuteElements.endscreenNextButton) ||
                event.target.matches(muteUnmuteElements.endscreenContainer) ||
                event.target.matches(muteUnmuteElements.endscreenContainerVariant1) ||
                event.target.matches(muteUnmuteElements.endscreenContainerVariant2)) {
                handleMiddleClick(event);
            }
        }
    }, true);

    function waitForKeyElements(selector, actionFunction) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.matches && node.matches(selector)) {
                            actionFunction(node);
                        }
                    });
                }
            }
        });

        observer.observe(document, { childList: true, subtree: true });
    }

    waitForKeyElements(Object.values(muteUnmuteElements).join(", "), (node) => {
        if (node.closest(muteUnmuteElements.videoAreaRegularBlackBars2) || node.matches(muteUnmuteElements.videoAreaShortsBlackBars)) {
            node.addEventListener('mousedown', handleMiddleClick, true);
        }
    });

    if (debug) {
        addBorderStyles(ignoredMuteUnmuteElements);
        addBorderStyles(debugElements);
    }

})();
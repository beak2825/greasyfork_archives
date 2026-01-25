// ==UserScript==
// @name         YouTube Middle Mouse Button Mute / Unmute
// @description  Mutes / unmutes a YouTube video / Shorts by clicking the middle mouse button within the video player. For Shorts you can also middle mouse click the black side bars around the video. While performing the middle mouse button click, the scroll button gets disabled. Mute / unmute / scroll disabling won't work with any elements floating over the video player.
// @namespace    https://greasyfork.org/users/877912
// @version      0.7
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
        videoAreaShortsMain: "ytd-shorts",
        shortsActionsArea: "#actions",
        shortsPivotButton: "#pivot-button", // Added pivot button for mute/unmute
        muteButtonRegular: "button.ytp-volume-icon.ytp-button",
        muteButtonShorts: "button.ytdVolumeControlsMuteIconButton",
        contentContainer: "div#contentContainer",
        endscreenPreviousButton: "button.ytp-button.ytp-endscreen-previous",
        endscreenNextButton: "button.ytp-button.ytp-endscreen-next",
        endscreenContainer: "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles.ytp-endscreen-paginate",
        endscreenContainerVariant1: "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles",
        endscreenContainerVariant2: "div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles[data-layer='4']",
        videoOverlay: "div.ytp-iv-video-content[data-layer='4']"
    };

    const ignoredMuteUnmuteElements = {
        ".branding-context-container-outer": "blue", // Branding container
        ".ytp-chrome-controls": "green", // Regular video player controls
        ".metadata-container": "green", // Shorts metadata/title/channel area
        "#metapanel": "green", // Shorts metadata panel
        "input": "green", // Input fields (like volume slider)
        "ytd-menu-renderer": "green" // Menu renderers
    };

    const debugElements = {
        ".ytp-cards-teaser": "red",
        ".ytp-pip-button": "red",
        ".ytp-ad-overlay-container": "red",
        ".ytp-ad-player-overlay": "red",
        ".ytp-endscreen-content": "red",
        ".ytp-chrome-bottom": "red",
        ".ytp-chrome-top": "red",
        ".ytp-gradient-top": "red",
        ".ytp-gradient-bottom": "red",
        ".ytp-ce-element": "red",
        ".ytp-ce-element-shadow": "red",
        ".ytp-subtitles-button": "red",
        ".ytp-caption-window": "red",
        ".ytp-spinner": "red",
        ".ytp-fullscreen-button": "red",
        ".ytp-play-button": "red",
        ".ytp-volume-panel": "red",
        ".ytp-share-button": "red",
        ".ytp-like-button-renderer": "red",
        ".picture-in-picture-toggle": "red",
        ".ytp-title": "red"
    };

    let isClicked = false;

    function handleMiddleClick(event) {
        if (event.button !== 1 || isClicked) return;

        // Check if clicking on ignored elements
        for (let selector of Object.keys(ignoredMuteUnmuteElements)) {
            if (event.target.matches(selector) || event.target.closest(selector)) {
                return;
            }
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
        } else if (event.target.matches(muteUnmuteElements.videoAreaShortsBlackBars) ||
                   event.target.matches(muteUnmuteElements.videoAreaShortsMain) ||
                   event.target.closest(muteUnmuteElements.videoAreaShortsMain) ||
                   event.target.matches(muteUnmuteElements.shortsActionsArea) ||
                   event.target.closest(muteUnmuteElements.shortsActionsArea) ||
                   event.target.matches(muteUnmuteElements.shortsPivotButton) ||
                   event.target.closest(muteUnmuteElements.shortsPivotButton)) {
            muteButton = document.querySelector(muteUnmuteElements.muteButtonShorts);
        }

        if (muteButton) muteButton.click();
    }

    // Prevent default middle-click behavior on pivot button (but allow our mute function)
    function preventPivotButtonMiddleClick(event) {
        if (event.button === 1) {
            if (event.target.closest('#pivot-button') ||
                event.target.closest('pivot-button-view-model') ||
                event.target.closest('.ytwPivotButtonViewModelHost')) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
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

    // Prevent default middle-click on pivot button (opening in new tab)
    document.addEventListener('mousedown', preventPivotButtonMiddleClick, true);
    document.addEventListener('click', preventPivotButtonMiddleClick, true);
    document.addEventListener('auxclick', preventPivotButtonMiddleClick, true);

    document.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
            if (event.target.matches(muteUnmuteElements.videoAreaRegularAndShorts) ||
                event.target.matches(muteUnmuteElements.videoOverlay) ||
                event.target.closest(muteUnmuteElements.videoAreaRegularBlackBars1) ||
                event.target.matches(muteUnmuteElements.videoAreaRegularBlackBars2) ||
                event.target.matches(muteUnmuteElements.videoAreaShortsBlackBars) ||
                event.target.matches(muteUnmuteElements.videoAreaShortsMain) ||
                event.target.closest(muteUnmuteElements.videoAreaShortsMain) ||
                event.target.matches(muteUnmuteElements.shortsActionsArea) ||
                event.target.closest(muteUnmuteElements.shortsActionsArea) ||
                event.target.matches(muteUnmuteElements.shortsPivotButton) ||
                event.target.closest(muteUnmuteElements.shortsPivotButton) ||
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
        if (node.closest(muteUnmuteElements.videoAreaRegularBlackBars2) ||
            node.matches(muteUnmuteElements.videoAreaShortsBlackBars) ||
            node.matches(muteUnmuteElements.videoAreaShortsMain) ||
            node.matches(muteUnmuteElements.shortsActionsArea) ||
            node.matches(muteUnmuteElements.shortsPivotButton)) {
            node.addEventListener('mousedown', handleMiddleClick, true);
        }
    });

    if (debug) {
        addBorderStyles(ignoredMuteUnmuteElements);
        addBorderStyles(debugElements);
    }

})();
// ==UserScript==
// @name Incestflix - UI & Playback Tweaks
// @namespace shobu-san/scripts
// @version 0.0.5
// @description Improved site layout, windowed fullscreen support, new video playback options
// @author shobu-san
// @license MIT
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @run-at document-start
// @match *://*.incestflix.org/*
// @match *://*.incestflix.com/*
// @downloadURL https://update.greasyfork.org/scripts/509748/Incestflix%20-%20UI%20%20Playback%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/509748/Incestflix%20-%20UI%20%20Playback%20Tweaks.meta.js
// ==/UserScript==

// Fullscreen CSS for windowed fullscreen
const windowedFullscreenCss = `
    /* Expand video player for windowed fullscreen */
    #incflix-bodywrap {
        max-width: none;
        text-align: center;
    }
    #incflix-player {
        max-height: 100%;
        height: 100%;
    }
    #incflix-videowrap {
        background: #0f0f0f;
        padding: 0.5em 0em;
        margin: 0.5em 0;
    }
    ::-webkit-scrollbar {
        display: none;
    }

    /* Fix recommended videos/tags */
    #photos .img-overflow {
        margin: 1px;
        width: 445px !important;
        height: 250px !important;
    }
    #incflix-indexwrap {
        max-width: none;
        text-align: center;
    }
    #tables {
        text-align: left;
        padding: 0em 0.5em;
        max-width: none;
    }
    #videotags {
        width: 100%;
        margin-top: 0em;
        text-align: left;
    }
`;

// Menu CSS for latest/random/popular video pages
const menuCss = `
    /* Expand search results to fit screen */
    #incflix-bodywrap {
        max-width: none;
        text-align: center;
    }

    /* Fix recommended videos/tags */
    #photos .img-overflow {
        margin: 1px;
        width: 445px !important;
        height: 250px !important;
    }
    #incflix-indexwrap {
        max-width: none;
        text-align: center;
    }
    #tables {
        text-align: left;
        padding: 0em 0.5em;
        max-width: none;
    }
    #videotags {
        width: 100%;
        margin-top: 0em;
        text-align: left;
    }
    #incflix-header{
        position:absolute;
        top:-75px;
    }
    [class=headerlogo]{
        position:absolute;
        top:70px;
        left:0px;
        transform: scale(0.5);
    }
    #tagline{
        display:none!important;
    }
    #videotags {
        width: 100%;
        margin-top: 0em;
        text-align: left;
    }
`;

let styleNode = null; // Used to load CSS rules into the page

let videoPlayer = null; // Global variable to hold the video player element
let pauseTimeout = 200 // Time in milliseconds to wait before a pause event is actioned

// Menu options
const menuOptions = {
    windowedFullscreen: { state: true, label: 'Enable Windowed Fullscreen' },
    fullscreenOnPlay: { state: true, label: 'Fullscreen on Play' },
    fullscreenOnLoad: { state: false, label: 'Fullscreen on Load' },
    autoplayOnLoad: { state: false, label: 'Autoplay on Load' },
    mutedOnLoad: { state: false, label: 'Muted on Load' },
    reloadOnStalled: { state: true, label: 'Auto-reload Stalled Video - BETA' },
    enableLogging: { state: false, label: 'DEBUG: Enable Logging' },
};

// Function for logging if debug mode is enabled
function logDebug(message, ...optionalParams) {
    if (getState('enableLogging')) {
        console.log(`DEBUG: ${message}`, ...optionalParams);
    }
}

/**
 * Get the saved state of an option or the default state if not saved.
 * @param {string} option - The option key.
 * @returns {boolean} - The state of the option.
 */
function getState(option) {
    const savedMenu = GM_getValue('menuOptions', menuOptions);
    return savedMenu.hasOwnProperty(option) ? savedMenu[option].state : menuOptions[option].state;
}

/**
 * Toggle the state of a menu option and update the menu display.
 * @param {string} option - The option key to toggle.
 */
function toggleOption(option) {
    const currentState = getState(option);
    menuOptions[option].state = !currentState;
    GM_setValue('menuOptions', menuOptions);
    displayMenu();
}

/**
 * Build the Tampermonkey menu based on the current state of the options.
 */
function displayMenu() {
    Object.entries(menuOptions).forEach(([key, option]) => {
        const currentState = getState(key);
        GM_registerMenuCommand(`[${currentState ? '✔️' : '❌'}]: ${option.label}`, () => toggleOption(key), { id: key, autoClose: false });
    });
}

/**
 * Injects the provided CSS into the document.
 * @param {string} css - The CSS to be injected.
 */
function injectStyle(css) {
    if (!styleNode) {
        logDebug('Injecting CSS into the document');
        styleNode = document.createElement('style');
        styleNode.textContent = css;
        (document.head || document.documentElement).appendChild(styleNode);
    }
}

/**
 * Removes the injected CSS from the document.
 */
function removeStyle() {
    if (styleNode) {
        logDebug('Removing injected CSS');
        styleNode.remove();
        styleNode = null;
    }
}

// Function to check if the URL contains '/watch'
function applyMenuCss() {
    const url = window.location.href;
    logDebug('Checking if URL contains /watch');
    if (!url.includes('/watch')) {
        logDebug('URL does not contain /watch, applying menu CSS');
        injectStyle(menuCss); // Enable the CSS immediately if URL doesn't contain '/watch'
    }
}

/**
 * Enable fullscreen mode by applying styles and scrolling the video player into view.
 * If windowed fullscreen is disabled, it will trigger the browser's normal fullscreen.
 * @param {HTMLElement} videoPlayer - The video player element.
 */
function enableFullscreen() {
    const windowedFullscreen = getState('windowedFullscreen');
    logDebug(`Enabling fullscreen. Windowed Fullscreen: ${windowedFullscreen}`);

    if (windowedFullscreen) {
        injectStyle(windowedFullscreenCss); // Enable windowed fullscreen
        videoPlayer.scrollIntoView({ behavior: 'instant' });
    } else {
        // Trigger normal fullscreen mode
        if (videoPlayer && videoPlayer.requestFullscreen) {
            logDebug('Requesting browser fullscreen');
            videoPlayer.requestFullscreen();
        }
    }
}

/**
 * Disable fullscreen mode by removing styles or exiting normal fullscreen.
 */
function disableFullscreen() {
    const windowedFullscreen = getState('windowedFullscreen');
    logDebug('Disabling fullscreen');

    removeStyle(); // Disable windowed fullscreen

    if (windowedFullscreen) {
        window.scrollTo(0, 0); // Scroll back to the top of the page
    } else if (document.fullscreenElement) {
        // Exit normal fullscreen if active
        logDebug('Exiting browser fullscreen');
        document.exitFullscreen();
    }
}

// Function to check if the video player exists
function getVideoPlayer() {
    videoPlayer = document.querySelector('#incflix-player');
    logDebug('Checking if video player exists:', videoPlayer ? 'Found' : 'Not Found');
}

async function getStatus(singleVideo) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(singleVideo);
        }, pauseTimeout);
    });
}

// Function to handle fullscreen behavior on video play
function handlePlay() {
    if (!videoPlayer) return;

    const fullscreenOnPlay = getState('fullscreenOnPlay');
    logDebug(`Video started playing. Fullscreen on Play: ${fullscreenOnPlay}`);

    if (fullscreenOnPlay) {
        enableFullscreen(videoPlayer);
    }
}

// Function to handle disabling fullscreen on video pause
function handlePause() {
    if (!videoPlayer) return;

    const fullscreenOnPlay = getState('fullscreenOnPlay');

    getStatus(videoPlayer).then(video => {
        if(video.paused){
            logDebug(`Video paused. Fullscreen on Play: ${fullscreenOnPlay}`);
            if (fullscreenOnPlay) {
                disableFullscreen(); // Disable fullscreen when the video is actually paused
            }
        }else{
            logDebug(`Video is not paused after ${pauseTimeout}ms, skipping pause event.`);
        }})
}

// Function to handle stalled event by reloading the video at the same timestamp
function handleStalled() {
    if (!videoPlayer) return;
    const currentTime = videoPlayer.currentTime; // Capture the current timestamp
    logDebug(`Video stalled at ${currentTime}s. Reloading video source...`);

    const src = videoPlayer.currentSrc; // Capture the current video source
    videoPlayer.src = ''; // Clear the source to force reload
    videoPlayer.load(); // Reset the video element
    videoPlayer.src = src; // Reassign the source
    videoPlayer.currentTime = currentTime; // Seek to the same timestamp
    videoPlayer.play(); // Start playing from the same position

    logDebug('Video reloaded and resumed at the same timestamp.');
}

// Function to handle video settings on page load
function initializeVideoPlayerSettings() {
    logDebug('Initializing video player settings');

    if (!videoPlayer) return;

    // Fullscreen on Load
    if (getState('fullscreenOnLoad')) {
        logDebug('Fullscreen on load is enabled');
        enableFullscreen(videoPlayer);
    }

    // Autoplay on Load
    if (getState('autoplayOnLoad')) {
        logDebug('Autoplay on load is enabled');
        videoPlayer.play();
    }

    // Mute on Load
    if (getState('mutedOnLoad')) {
        logDebug('Muted on load is enabled');
        videoPlayer.muted = true;
    }
}

// Attach event listeners to video player
function attachVideoPlayerListeners() {
    if (!videoPlayer) return;

    logDebug('Attaching event listeners to video player');
    videoPlayer.addEventListener('play', handlePlay, { passive: true });
    videoPlayer.addEventListener('pause', handlePause, { passive: true });
    videoPlayer.addEventListener('stalled', handleStalled, { passive: true });
}

// Initialize the script
function init() {
    getVideoPlayer();
    initializeVideoPlayerSettings();
    attachVideoPlayerListeners();
}

logDebug('Script initialized');
displayMenu();
applyMenuCss();

// Run the initialization after the page is fully loaded
window.addEventListener('load', init, {passive: true});

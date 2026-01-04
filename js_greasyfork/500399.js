// ==UserScript==
// @name         Jb's Yt
// @namespace    https://github.com/gokuthug1
// @version      8.5
// @description  My version of youtube.
// @author       gokuthug1
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch*
// @icon         https://raw.githubusercontent.com/gokuthug1/Image-source/main/J.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500399/Jb%27s%20Yt.user.js
// @updateURL https://update.greasyfork.org/scripts/500399/Jb%27s%20Yt.meta.js
// ==/UserScript==

    // Function to hide elements by class
function hideElementsByClass(className) {
    const elements = document.querySelectorAll('.' + className);
    elements.forEach(element => {
        element.style.display = 'none';
        element.style.pointerEvents = 'none';
    });
}

// Function to hide specific YouTube elements
function applyYouTubeHideFunctions() {
    hideElementsByClass('ytp-miniplayer-button');
    hideElementsByClass('ytp-size-button');
    hideAutoPlayButton();
    hidePlayOnTVButton();
    hideYouTubeEndCards();
    blockErrorScreens();
    hideFullScreenEduElements(); // Include hiding fullscreen educational elements here
}

// Function to hide the Auto Play button
function hideAutoPlayButton() {
    const autoPlayButton = document.querySelector('.ytp-button[data-tooltip-target-id="ytp-autonav-toggle-button"]');
    if (autoPlayButton) {
        autoPlayButton.style.display = 'none';
        autoPlayButton.style.pointerEvents = 'none';
        autoPlayButton.setAttribute('title', '');
        autoPlayButton.setAttribute('aria-label', '');
        autoPlayButton.querySelectorAll('.ytp-autonav-toggle-button-container, .ytp-autonav-toggle-button').forEach(element => {
            element.style.display = 'none';
            element.style.pointerEvents = 'none';
        });
    }
}

// Function to hide the "Play on TV" button
function hidePlayOnTVButton() {
    const playOnTVButton = document.querySelector('.ytp-remote-button.ytp-button[aria-label="Play on TV"]');
    if (playOnTVButton) {
        playOnTVButton.style.display = 'none';
        playOnTVButton.style.pointerEvents = 'none';
    }
}

// Function to hide educational elements in fullscreen mode
function hideFullScreenEduElements() {
    // Check if in fullscreen mode
    var isInFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;

    // Hide the "Scroll for details" text
    var textElements = document.querySelectorAll('.ytp-fullerscreen-edu-text');
    textElements.forEach(function(element) {
        if (element.textContent.trim() === 'Scroll for details') {
            element.style.display = isInFullScreen ? 'none' : ''; // Hide if in fullscreen, otherwise show
        }
    });

    // Hide the chevron
    var chevron = document.querySelector('.ytp-fullerscreen-edu-chevron');
    if (chevron) {
        chevron.style.display = isInFullScreen ? 'none' : ''; // Hide if in fullscreen, otherwise show
    }
}

// Function to hide YouTube end cards
function hideYouTubeEndCards() {
    const endCards = document.querySelectorAll('.ytp-ce-element');
    endCards.forEach(card => {
        card.style.display = 'none';
    });
}

// Function to block error screens
function blockErrorScreens() {
    const selectorsToBlock = [
        '.container.ytd-enforcement-message-view-model.style-scope',
        '.yt-playability-error-supported-renderers.style-scope',
        '.error-screen.ytd-watch-flexy.style-scope',
        '.player.ytd-watch-flexy.style-scope',
        '#error-screen.style-scope.ytd-watch-flexy'
    ];

    selectorsToBlock.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.display = 'none';
            element.style.pointerEvents = 'none';
        });
    });
}

// Function to apply all hiding and blocking functions
function applyFunctions() {
    applyYouTubeHideFunctions();
    // Add more apply functions here if needed for other elements or features
}

// Function to add event listeners and observers
function addEventListenersAndObservers() {
    applyFunctions();

    // Observer to detect changes in the DOM
    const observer = new MutationObserver(() => {
        applyFunctions();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Add event listener for full screen changes
    document.addEventListener('fullscreenchange', applyFunctions);
}

// Run the functions when the page loads
window.addEventListener('load', () => {
    // Wait for the YouTube video player to load
    const checkExist = setInterval(() => {
        const videoPlayer = document.querySelector('.html5-main-video');
        if (videoPlayer) {
            clearInterval(checkExist);
            addEventListenersAndObservers();
        }
    }, 100); // Check every 100 milliseconds

    // Also run the functions when the page changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            applyFunctions();
        }
    }).observe(document, { subtree: true, childList: true });
});

// Make scrollbar invisible but still functional
document.documentElement.style.overflow = 'auto';
document.documentElement.style.scrollbarWidth = 'none';

// Add CSS for font styling
const style = document.createElement('style');
style.textContent = `
/* Apply the font family to all elements */
* {
    font-family: 'Times New Roman', Times, serif !important;
}

/* Apply the font family to various specific text elements to ensure coverage */
#video-title,
#video-title yt-formatted-string,
h1.title,
h1.title yt-formatted-string,
#comments,
#comments #content-text,
yt-formatted-string,
yt-formatted-string * {
    font-family: 'Times New Roman', Times, serif !important;
}

/* Apply the font to titles in various video renderers */
.ytd-thumbnail .style-scope.ytd-video-renderer #video-title,
.ytd-thumbnail .style-scope.ytd-compact-video-renderer #video-title,
#items ytd-compact-video-renderer #video-title,
#items ytd-compact-video-renderer #video-title yt-formatted-string,
#items ytd-video-renderer #video-title,
#items ytd-video-renderer #video-title yt-formatted-string,
ytd-rich-grid-media #video-title,
ytd-video-renderer #video-title,
ytd-playlist-panel-video-renderer #video-title,
ytd-grid-video-renderer #video-title,
ytd-channel-video-renderer #video-title,
ytd-video-primary-info-renderer h1.title,
ytd-video-primary-info-renderer h1.title yt-formatted-string,
ytd-playlist-video-renderer #video-title,
ytd-playlist-video-renderer #video-title yt-formatted-string,
ytd-playlist-panel-video-renderer #video-title,
ytd-playlist-panel-video-renderer #video-title yt-formatted-string,
ytd-search ytd-video-renderer #video-title,
ytd-search ytd-video-renderer #video-title yt-formatted-string,
ytd-expanded-shelf-contents-renderer #video-title,
ytd-expanded-shelf-contents-renderer #video-title yt-formatted-string,
.yt-shelf-grid-item .yt-shelf-grid-item-renderer .yt-simple-endpoint yt-formatted-string {
    font-family: 'Times New Roman', Times, serif !important;
}

/* Apply the font to recommended video titles */
#related ytd-watch-next-secondary-results-renderer #video-title,
#related ytd-watch-next-secondary-results-renderer #video-title yt-formatted-string,
#related ytd-compact-video-renderer #video-title,
#related ytd-compact-video-renderer #video-title yt-formatted-string {
    font-family: 'Times New Roman', Times, serif !important;
}

/* Apply the font to YouTube Shorts recommended video titles */
ytd-rich-shelf-renderer #video-title,
ytd-rich-shelf-renderer #video-title yt-formatted-string,
ytm-promoted-shelf-renderer #video-title,
ytm-promoted-shelf-renderer #video-title yt-formatted-string {
    font-family: 'Times New Roman', Times, serif !important;
}
`;
document.head.append(style);

// Variable to track whether the volume booster is active
let volumeBoosterActive = false;

// Function to toggle the volume booster
function toggleVolumeBooster() {
    // Ensure the volume booster is initialized
    if (!window.boosterGainNode) {
        initializeVolumeBooster();
    }

    // Toggle the volume booster
    if (volumeBoosterActive) {
        window.boosterGainNode.gain.value = 1; // Set volume back to normal
        volumeBoosterActive = false;
    } else {
        window.boosterGainNode.gain.value = 3; // Boost volume
        volumeBoosterActive = true;
    }
}

// Initialize the AudioContext and GainNode if not already done
function initializeVolumeBooster() {
    try {
        if (!window.audioContext) {
            // Check if AudioContext is supported in this browser
            if (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
                // Create a new AudioContext only after a user gesture (click or keypress)
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                window.audioContext = new AudioContext();

                // Wait for a user gesture to resume AudioContext
                document.addEventListener('click', resumeAudioContext);
                document.addEventListener('keydown', resumeAudioContext);
            } else {
                throw new Error("Web Audio API is not supported in this browser.");
            }
        }

        if (!window.boosterGainNode && window.audioContext) {
            // Create and configure the GainNode
            window.boosterGainNode = window.audioContext.createGain();
            window.boosterGainNode.gain.value = 1; // Set initial gain value to 1
            window.boosterGainNode.connect(window.audioContext.destination);
        }

        // Ensure media source is connected to the gain node
        connectVideoToBooster();
    } catch (e) {
        console.error("Web Audio API error:", e);
    }
}

// Resume the AudioContext after a user gesture
function resumeAudioContext() {
    if (window.audioContext && window.audioContext.state === 'suspended') {
        window.audioContext.resume().then(() => {
            // Remove event listeners after AudioContext is resumed
            document.removeEventListener('click', resumeAudioContext);
            document.removeEventListener('keydown', resumeAudioContext);

            // Now that the context is resumed, proceed with the volume booster initialization
            initializeVolumeBooster();
        });
    }
}

// Function to connect video element to the GainNode
function connectVideoToBooster() {
    const video = document.querySelector('video');
    if (video) {
        if (!window.mediaSource) {
            window.mediaSource = window.audioContext.createMediaElementSource(video);
            window.mediaSource.connect(window.boosterGainNode);
        }
    }
}

// Function to boost volume when pressing Ctrl+Z
function boostVolumeWithShortcut(event) {
    if (event.ctrlKey && event.key === 'z') {
        toggleVolumeBooster(); // Toggle volume booster when Ctrl+Z is pressed
    }
}

// Observe for changes to add volume booster to new video elements
const observer = new MutationObserver(() => {
    connectVideoToBooster();
});

observer.observe(document.body, { childList: true, subtree: true });

// Add event listener for keydown event to trigger volume boost shortcut
document.addEventListener('keydown', boostVolumeWithShortcut);

// Ensure the volume booster is initialized when the script loads
initializeVolumeBooster();

// Enable The Undetected Adblocker
const adblocker = true;

function removeAds() {
    let adLoop = 0;
    const videoPlayback = 1;

    setInterval(() => {
        const adVideo = findAdVideo();
        const ad = findAd();

        if (ad && adVideo) {
            adLoop++;
            if (adLoop < 10) {
                clickElement('.ytp-ad-button-icon');
                clickElement('[label="Block ad"]');
                clickElement('.Eddif [label="CONTINUE"] button');
                clickElement('.zBmRhe-Bz112c');
            } else {
                skipAd(adVideo);
            }
        } else {
            adLoop = 0;
            if (adVideo && adVideo.currentTime < 29) {
                adVideo.currentTime = 29;
                adVideo.pause();
            }
            if (adVideo && adVideo.playbackRate === 10) {
                adVideo.playbackRate = videoPlayback;
            }
        }
    }, 50);

    function findAd() {
        // Example: Look for elements with ad-related classes or attributes
        return document.querySelector('.ad-showing');
    }

    function findAdVideo() {
        // Example: Look for video elements related to ads
        return document.querySelector('.ad-showing video');
    }

    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.click();
    }

    function skipAd(video) {
        console.log("Found Ad");

        const skipButtons = ['ytp-ad-skip-button-container', 'ytp-ad-skip-button-modern', '.videoAdUiSkipButton', '.ytp-ad-skip-button', '.ytp-ad-skip-button-modern', '.ytp-ad-skip-button', '.ytp-ad-skip-button-slot'];

        video.playbackRate = 10;
        video.volume = 0;

        skipButtons.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => element?.click());
        });

        video.play();
        video.currentTime = video.duration + (Math.random() * (0.5 - 0.1) + 0.1) || 0;

        console.log("Skipped Ad (✔️)");
    }

    function removePageAds() {
        const style = document.createElement('style');
        style.textContent = `
            /* CSS to hide specific types of page ads */
            ytd-action-companion-ad-renderer,
            ytd-display-ad-renderer,
            ytd-video-masthead-ad-advertiser-info-renderer,
            ytd-video-masthead-ad-primary-video-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-ad-slot-renderer,
            yt-about-this-ad-renderer,
            yt-mealbar-promo-renderer,
            ytd-statement-banner-renderer,
            ytd-ad-slot-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer-background,
            statement-banner-style-type-compact,
            .ytd-video-masthead-ad-v3-renderer,
            div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
            div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
            div#main-container.style-scope.ytd-promoted-video-renderer,
            div#player-ads.style-scope.ytd-watch-flexy,
            ad-slot-renderer,
            ytm-promoted-sparkles-web-renderer,
            masthead-ad,
            tp-yt-iron-overlay-backdrop,
            #masthead-ad {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    removePageAds();
}

if (adblocker) removeAds();

// Used for debug messages
function log(message, level = 'info', ...args) {
    const prefix = 'Adblocker:';
    const fullMessage = `${prefix} ${message}`;
    console[level](fullMessage, ...args);
}

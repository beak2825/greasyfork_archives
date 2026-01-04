// ==UserScript==
// @name         Telegram Auto Next & CSS Fullscreen
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Automatically enters CSS web fullscreen on video or image load and clicks 'next' on video end or image showed after 2s. Toggle with 'G' key.
// @author       CurssedCoffin (perfected with gemini) https://github.com/CurssedCoffin
// @match        https://web.telegram.org/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544993/Telegram%20Auto%20Next%20%20CSS%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/544993/Telegram%20Auto%20Next%20%20CSS%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict'; // Enforces stricter parsing and error handling in JavaScript.

    // --- Log Function ---
    /**
     * Logs a message to the console with a specific script prefix for easy debugging.
     * @param {string} message The message to log.
     */
    function log(message) {
        // Prepends a unique identifier to all console messages from this script.
        console.log(`[TG Media Enhancer] ${message}`);
    }

    // --- Configuration ---
    // The interval (in milliseconds) at which the script checks the state of the media viewer.
    const CHECK_INTERVAL_MS = 250;
    // The delay (in milliseconds) before automatically switching to the next image.
    const IMAGE_SWITCH_DELAY_MS = 2000;
    // The time threshold (in seconds) from the end of a video to trigger the switch to the next media.
    const VIDEO_END_THRESHOLD_S = 1.0;
    // The key used to toggle the script's enabled/disabled state.
    const TOGGLE_KEY = 'g';
    // A unique ID for the CSS <style> element injected by this script for fullscreen mode.
    const FULLSCREEN_STYLE_ID = 'tg-enhancer-fullscreen-style';

    // --- State Variables ---
    // Holds the current enabled/disabled state of the script.
    // The state is persisted across sessions using GM_getValue. Defaults to 'true' (enabled).
    let isEnabled = GM_getValue('tgMediaEnhancerEnabled', true);
    // Holds the timer ID for the automatic image switch. Used to cancel the timer if needed.
    let imageSwitchTimeout = null;
    // Stores a reference to the currently displayed media element to prevent reprocessing it.
    let processedMediaElement = null;
    // Stores the last calculated dimensions to detect changes and trigger recalculation.
    let lastCalculatedWidth = 0;
    let lastCalculatedHeight = 0;

    log(`Initial state loaded. Enabled: ${isEnabled}`);

    /**
     * Shows a temporary notification overlay on the screen.
     * @param {string} message The message to display.
     */
    function showNotification(message) {
        log(`Showing notification: "${message}"`);
        // Find and remove any existing notification to prevent overlap.
        const existing = document.getElementById('tg-enhancer-notification');
        if (existing) {
            log("Removing existing notification.");
            existing.remove();
        }

        // Create the notification element.
        const notification = document.createElement('div');
        notification.id = 'tg-enhancer-notification';
        // Apply CSS styles for positioning, appearance, and transitions.
        Object.assign(notification.style, {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            padding: '10px 20px', background: 'rgba(0, 0, 0, 0.75)', color: 'white',
            zIndex: '9999', borderRadius: '8px', opacity: '1',
            transition: 'opacity 0.5s ease-out', pointerEvents: 'none',
        });
        notification.textContent = message;
        document.body.appendChild(notification);
        log("Notification element appended to body.");

        // Set a timer to fade out and then remove the notification.
        setTimeout(() => {
            log("Fading out notification.");
            notification.style.opacity = '0';
            setTimeout(() => {
                log("Removing notification from DOM.");
                notification.remove();
            }, 500); // Wait for fade-out transition to complete before removing.
        }, 2000); // Notification stays visible for 2 seconds.
    }

    /**
     * Removes the fullscreen CSS style from the document head, returning to the default view.
     */
    function disableFullscreen() {
        log("Attempting to disable fullscreen.");
        const styleTag = document.getElementById(FULLSCREEN_STYLE_ID);
        if (styleTag) {
            styleTag.remove();
            log("Fullscreen style tag found and removed.");
        } else {
            log("Fullscreen style tag not found, no action needed.");
        }
    }

    /**
     * Creates or updates the CSS style for a clean, letterboxed/pillarboxed fullscreen media display.
     * It calculates the correct scale and translation to fit the media to the screen.
     * @param {HTMLElement} contentElement The element containing the media.
     */
    function updateOrCreateFullscreenStyle(contentElement, mediaViewer) {
        log("Attempting to update or create fullscreen style.");
        // Find the elements that define the media's dimensions.
        const videoSizer = contentElement.querySelector('.VideoPlayer > div');
        const imageElement = contentElement.querySelector('img');

        let mediaWidth = 0, mediaHeight = 0;

        // Get dimensions from the video sizer element if it exists.
        if (videoSizer && videoSizer.style.width) {
            mediaWidth = parseFloat(videoSizer.style.width);
            mediaHeight = parseFloat(videoSizer.style.height);
            log(`Video sizer found. Dimensions: ${mediaWidth}x${mediaHeight}`);
        // Otherwise, get dimensions from the image's rendered size.
        } else if (imageElement) {
            // Get rendered width and height (actual displayed size)
            mediaWidth = imageElement.offsetWidth || imageElement.width || imageElement.naturalWidth;
            mediaHeight = imageElement.offsetHeight || imageElement.height || imageElement.naturalHeight;
            log(`Image element found. Rendered dimensions: ${mediaWidth}x${mediaHeight}`);
        } else {
            log("No video sizer or image element found for style creation.");
        }

        // Abort if media dimensions are not valid.
        if (isNaN(mediaWidth) || mediaWidth === 0) {
            log("Media width is invalid or zero, aborting style creation.");
            return;
        }

        // Update tracked dimensions after successful calculation.
        lastCalculatedWidth = mediaWidth;
        lastCalculatedHeight = mediaHeight;

        // Calculate the scale factor to fit the media within the viewport while maintaining aspect ratio.
        const screenWidth = window.innerWidth, screenHeight = window.innerHeight;
        const scale = Math.min(screenWidth / mediaWidth, screenHeight / mediaHeight);
        // Calculate the translation needed to center the scaled media on the screen.
        const translateX = (screenWidth - (mediaWidth * scale)) / 2;
        const translateY = (screenHeight - (mediaHeight * scale)) / 2;
        // Construct the CSS transform value.
        const newTransform = `translate3d(${translateX.toFixed(4)}px, ${translateY.toFixed(4)}px, 0px) scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
        log(`Calculated fullscreen transform: ${newTransform}`);

        // Define the CSS rule to override Telegram's default styles for the active media slide.
        const newRule = `
            #MediaViewer .MediaViewerSlide--active .MediaViewerContent {
                position: fixed !important; top: 0 !important; left: 0 !important;
                width: ${mediaWidth}px !important; height: ${mediaHeight}px !important;
                transform-origin: 0 0 !important; transform: ${newTransform} !important;
                z-index: 1500 !important;
            }
        `;

        // Find the existing style tag or create a new one.
        let styleTag = document.getElementById(FULLSCREEN_STYLE_ID);
        if (!styleTag) {
            log("No existing style tag found, creating a new one.");
            styleTag = document.createElement('style');
            styleTag.id = FULLSCREEN_STYLE_ID;
            document.head.appendChild(styleTag);
            log("New style tag appended to head.");
        }

        // Update the style tag's content only if it has changed.
        if (styleTag.textContent !== newRule) {
            log("Updating style tag content.");
            styleTag.textContent = newRule;
        } else {
            log("Style rule is already up-to-date.");
        }

        // For a cleaner view, remove the default header and caption.
        const mediaHead = mediaViewer.querySelector('.media-viewer-head');
        if (mediaHead) {
            mediaHead.remove();
            log("Removed media viewer header.");
        }

        const mediaText = contentElement.querySelector('.media-viewer-footer-content');
        if (mediaText) {
            mediaText.remove();
            log("Removed media text overlay.");
        }
    }

    /**
     * Dispatches a keyboard event to the document to simulate pressing the right arrow key,
     * which is Telegram's native way to advance to the next media item.
     */
    function switchToNext() {
        log("Dispatching 'ArrowRight' keydown event to switch to next media.");
        const rightArrowEvent = new KeyboardEvent('keydown', {
            key: 'ArrowRight', keyCode: 39, which: 39, bubbles: true, cancelable: true
        });
        document.dispatchEvent(rightArrowEvent);
    }

    /**
     * The main function of the script, called periodically by setInterval.
     * It checks the current state of the Telegram media viewer and takes action.
     */
    function checkViewState() {
        // Check if the main media viewer container is present in the DOM.
        const mediaViewer = document.getElementById('MediaViewer');

        if (!mediaViewer) {
            // If the viewer is closed, perform cleanup.
            if (processedMediaElement) {
                log("Media viewer is closed. Cleaning up state.");
                clearTimeout(imageSwitchTimeout); // Clear any pending image switch.
                log("Image switch timeout cleared.");
                processedMediaElement = null; // Reset the state.
                lastCalculatedWidth = 0; // Reset tracked dimensions.
                lastCalculatedHeight = 0;
                log("Processed media element reset.");
                disableFullscreen(); // Remove the custom fullscreen styles.
            }
            return; // Exit the function since the viewer isn't open.
        }

        // If the script is manually disabled, perform cleanup and exit.
        if (!isEnabled) {
            if (processedMediaElement) {
                log("Script is disabled but state exists. Cleaning up.");
                clearTimeout(imageSwitchTimeout);
                log("Image switch timeout cleared because script is disabled.");
                processedMediaElement = null;
                lastCalculatedWidth = 0; // Reset tracked dimensions.
                lastCalculatedHeight = 0;
                log("Processed media element reset because script is disabled.");
                disableFullscreen();
            }
            return;
        }

        // Find the currently active media slide.
        const activeSlide = mediaViewer.querySelector('.MediaViewerSlide--active');
        if (!activeSlide) {
            // This can happen briefly during transitions, so we just wait for the next check.
            return;
        }

        // Find the container and the actual media element (video or image).
        const contentElement = activeSlide.querySelector('.MediaViewerContent');
        const currentElement = activeSlide.querySelector('video, img');

        if (!contentElement || !currentElement) {
            log("No content or media element (video/img) found in the active slide.");
            return;
        }

        // This is the core logic: check if the displayed media is a new one.
        if (currentElement !== processedMediaElement) {
            log(`New media detected. Old: ${processedMediaElement?.tagName}, New: ${currentElement.tagName}.`);
            processedMediaElement = currentElement; // Update state to the new element.
            log("Clearing any existing image switch timeout.");
            clearTimeout(imageSwitchTimeout); // Cancel previous timer.
            lastCalculatedWidth = 0; // Reset tracked dimensions for new media.
            lastCalculatedHeight = 0;
            updateOrCreateFullscreenStyle(contentElement, mediaViewer); // Apply fullscreen styles.

            // If the new media is an image, set a timer to switch to the next one.
            if (currentElement.tagName === 'IMG') {
                log(`Setting up timer to switch image in ${IMAGE_SWITCH_DELAY_MS}ms.`);
                imageSwitchTimeout = setTimeout(() => {
                    log("Image timer expired. Triggering switch to next media.");
                    processedMediaElement = null; // Reset state *before* switching to allow the next media to be processed.
                    switchToNext();
                }, IMAGE_SWITCH_DELAY_MS);
            }
            return; // Return after processing the new media.
        }

        // Check if dimensions have changed for the current media (e.g., image finished loading).
        // This handles cases where the initial calculation failed due to incomplete loading.
        if (currentElement.tagName === 'IMG') {
            const imageElement = currentElement;
            const currentWidth = imageElement.offsetWidth || imageElement.width || imageElement.naturalWidth;
            const currentHeight = imageElement.offsetHeight || imageElement.height || imageElement.naturalHeight;
            
            // Recalculate if dimensions are now valid but weren't before, or if they changed.
            if ((currentWidth > 0 && currentHeight > 0) && 
                (lastCalculatedWidth === 0 || lastCalculatedHeight === 0 || 
                 currentWidth !== lastCalculatedWidth || currentHeight !== lastCalculatedHeight)) {
                log(`Image dimensions changed or became available. Recalculating. Current: ${currentWidth}x${currentHeight}, Last: ${lastCalculatedWidth}x${lastCalculatedHeight}`);
                updateOrCreateFullscreenStyle(contentElement, mediaViewer);
            }
        }

        // If the media is a video that we are already tracking:
        if (currentElement.tagName === 'VIDEO') {
            const video = currentElement;
            // Check if the video is near its end.
            const isNearEnd = video.duration && (video.duration - video.currentTime) < VIDEO_END_THRESHOLD_S;

            if (isNearEnd) {
                log(`Video is near end (currentTime: ${video.currentTime}, duration: ${video.duration}). Triggering switch.`);
                processedMediaElement = null; // Reset state before switching.
                switchToNext();
            }
        }
    }

    // Add a global keyboard listener to handle the toggle key.
    document.addEventListener('keydown', (e) => {
        log(`Keydown event detected: Key='${e.key}', Target='${e.target.tagName}'.`);
        // Ignore key presses if the user is typing in a text field to prevent conflicts.
        if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            log("Keydown event ignored (target is content-editable or an input field).");
            return;
        }

        // Check if the pressed key is the designated toggle key.
        if (e.key.toLowerCase() === TOGGLE_KEY) {
            log(`Toggle key '${TOGGLE_KEY}' pressed.`);
            isEnabled = !isEnabled; // Flip the enabled state.
            GM_setValue('tgMediaEnhancerEnabled', isEnabled); // Save the new state.
            log(`Script is now ${isEnabled ? 'ENABLED' : 'DISABLED'}. Saved state.`);
            showNotification(`Media Enhancer: ${isEnabled ? 'ON' : 'OFF'}`);
            if (!isEnabled) {
                // If disabled, immediately turn off the fullscreen features.
                log("Script disabled, ensuring fullscreen is turned off.");
                disableFullscreen();
            } else {
                // If enabled, reset processed media to force a re-evaluation on the next check.
                log("Script enabled, resetting processed media element to force re-evaluation.");
                processedMediaElement = null;
            }
        }
    });

    // --- Initialization ---
    // Start the main loop.
    setInterval(checkViewState, CHECK_INTERVAL_MS);
    log('Script v2.1 loaded and checkViewState interval started.');
    // Show a notification on load to inform the user that the script is active.
    showNotification(`Media Enhancer Loaded (Toggle key: G)`);
})();
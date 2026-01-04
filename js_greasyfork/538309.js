// ==UserScript==
// @name         Pornhub Auto Next & CSS Fullscreen
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Automatically enters CSS web fullscreen on video load and clicks 'next' on video end. Toggle fullscreen with 'G' key.
// @author       CurssedCoffin (by gemini) https://github.com/CurssedCoffin
// @match        *://*.pornhub.com/view_video.php*
// @match        *://*.pornhub.com/video/watch*
// @match        *://*.pornhub.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538309/Pornhub%20Auto%20Next%20%20CSS%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/538309/Pornhub%20Auto%20Next%20%20CSS%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_PREFIX = '[PH Auto FS/Next Persistent Manual Save Retry] ';
    const NEXT_BUTTON_SELECTOR = '.mgp_nextBtn';

    const PLAYER_QUALIFYING_SELECTORS = 'video.mgp_videoElement';
    const PLAYER_CONTAINER_SELECTORS_FOR_FULLSCREEN = '.video-element-wrapper-js';

    const FULLSCREEN_STATE_STORAGE_KEY = 'phWebFullscreenStateManualSave'; // Unique key

    // Removed: retryCountFindVideoForListeners, MAX_RETRIES_FIND_VIDEO_FOR_LISTENERS
    const MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH = 30; // times
    const RETRY_INTERVAL_ENTER_FULLSCREEN_VIDEO_SEARCH = 200; // interval

    const MAX_RETRIES_AUTO_NEXT_CLICK = MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH;
    const RETRY_INTERVAL_AUTO_NEXT_CLICK = RETRY_INTERVAL_ENTER_FULLSCREEN_VIDEO_SEARCH;

    let webFullscreenApplied = false;
    let videoElementCache = null; // Cache used by findVideoElement
    let initialFullscreenAttempted = false; // Flag to track if initial fullscreen attempt was made

    let mainVideoElementObserver = null; // Observer for video element changes

    const webFullscreenCSS = `
        body.ph-web-fullscreen-active,
        html.ph-web-fullscreen-active {
            overflow: hidden !important;
        }
        .ph-player-is-web-fullscreen {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            z-index: 2147483646 !important; background-color: black !important;
            padding: 0 !important; margin: 0 !important; border: none !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }
        .ph-player-is-web-fullscreen video {
            width: 100% !important; height: 100% !important; object-fit: contain !important;
            max-width: 100vw !important; max-height: 100vh !important;
            z-index: 1 !important;
        }
        .ph-player-is-web-fullscreen video.mgp_videoElement {
            position: absolute !important;
            left: 0px !important;
            top: 0px !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
        }
        .ph-player-is-web-fullscreen video.fp-player {
            position: absolute !important;
            left: 0px !important;
            top: 0px !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
        }
         .ph-player-is-web-fullscreen .mgp_controlsContainer,
        .ph-player-is-web-fullscreen .mgp_controlsBar,
        .ph-player-is-web-fullscreen .fp-ui,
        .ph-player-is-web-fullscreen .fp-controls,
        .ph-player-is-web-fullscreen .video-control-container {
            z-index: 2147483647 !important;
            pointer-events: auto !important;
            opacity: 1 !important; visibility: visible !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
        }
        .ph-player-is-web-fullscreen .mgp_controlsContainer *,
        .ph-player-is-web-fullscreen .mgp_controlsBar *,
        .ph-player-is-web-fullscreen .fp-ui *,
        .ph-player-is-web-fullscreen .fp-controls * {
            pointer-events: auto !important;
        }
        body.ph-web-fullscreen-active #header,
        body.ph-web-fullscreen-active #main-container > .container:not(:has(.ph-player-is-web-fullscreen)),
        body.ph-web-fullscreen-active #footer,
        body.ph-web-fullscreen-active .bottomMenu,
        body.ph-web-fullscreen-active #relatedVideosCenter,
        body.ph-web-fullscreen-active #comments,
        body.ph-web-fullscreen-active .rightCol,
        body.ph-web-fullscreen-active .leftCol,
        body.ph-web-fullscreen-active .abovePlayer,
        body.ph-web-fullscreen-active .belowPlayer,
        body.ph-web-fullscreen-active #hd-rightColVideoPage,
        body.ph-web-fullscreen-active .wrapper #sb_wrapper {
            display: none !important;
        }
    `;

    function addCustomCSS() {
        if (typeof GM_addStyle !== "undefined") { GM_addStyle(webFullscreenCSS); }
        else {
            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css"; styleSheet.innerText = webFullscreenCSS;
            document.head.appendChild(styleSheet);
        }
        console.log(LOG_PREFIX + 'Web fullscreen CSS injected.');
    }
    addCustomCSS();

    function findVisibleElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            const style = getComputedStyle(element);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && element.offsetParent !== null) {
                let parent = element.parentElement;
                while (parent && parent !== document.body) {
                    const parentStyle = getComputedStyle(parent);
                    if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') return null;
                    parent = parent.parentElement;
                }
                return element;
            }
        }
        return null;
    }

    function findVideoElement() {
        if (videoElementCache && document.body.contains(videoElementCache)) {
            return videoElementCache;
        }

        try {
            let video = document.querySelector(PLAYER_QUALIFYING_SELECTORS);
            if (video) {
                 videoElementCache = video;
                 return video;
            }
        } catch (e) { /* querySelector might fail on complex/invalid selectors, though unlikely here */ }

        let videos = Array.from(document.querySelectorAll('video'));
        videos = videos.filter(v => v.readyState > 0 && v.duration > 0 && v.videoWidth > 5 && v.videoHeight > 5);
        if (videos.length > 0) {
            videos.sort((a, b) => (b.videoWidth * b.videoHeight) - (a.videoWidth * a.videoHeight));
            const mainVideoInPlayer = videos.find(v => v.closest(PLAYER_CONTAINER_SELECTORS_FOR_FULLSCREEN));
            if (mainVideoInPlayer) {
                videoElementCache = mainVideoInPlayer;
                return mainVideoInPlayer;
            }
            if (videos[0].closest('body')) { // Check if the largest video is actually part of the document body
                 videoElementCache = videos[0];
                 return videos[0];
            }
        }

        videoElementCache = null; // Explicitly nullify if no suitable video found
        return null;
    }

    function simulateDetailedClick(element) {
        if (!element) { console.error(LOG_PREFIX + 'simulateDetailedClick called with null element.'); return; }
        console.log(LOG_PREFIX + 'Simulating detailed click on:', element);
        try {
            const LER = element.getBoundingClientRect();
            const elementWindow = element.ownerDocument.defaultView || window;
            const eventArgs = { bubbles: true, cancelable: true, view: elementWindow, button: 0, clientX: LER.left + (LER.width / 2), clientY: LER.top + (LER.height / 2) };
            element.dispatchEvent(new PointerEvent('pointerdown', eventArgs));
            element.dispatchEvent(new MouseEvent('mousedown', eventArgs));
            element.dispatchEvent(new PointerEvent('pointerup', eventArgs));
            element.dispatchEvent(new MouseEvent('mouseup', eventArgs));
            element.dispatchEvent(new MouseEvent('click', eventArgs));
            if (typeof element.click === 'function') element.click();
            console.log(LOG_PREFIX + 'Detailed click simulation finished for:', element);
        } catch (e) { console.error(LOG_PREFIX + 'Error during click simulation:', e, element); }
    }

    function clearInlineStyles(element) {
         if (!element) return;
         const stylesToClear = ['width', 'height', 'objectFit', 'position', 'zIndex', 'maxWidth', 'maxHeight', 'left', 'top', 'margin', 'padding', 'border'];
         stylesToClear.forEach(prop => element.style[prop] = '');
    }

    function setFullscreenState(isFullScreen) {
        try {
            GM_setValue(FULLSCREEN_STATE_STORAGE_KEY, isFullScreen);
            console.log(LOG_PREFIX + `Fullscreen state saved: ${isFullScreen}`);
        } catch (e) {
            console.error(LOG_PREFIX + 'Error saving fullscreen state:', e);
        }
    }

    function getFullscreenState() {
        try {
            return GM_getValue(FULLSCREEN_STATE_STORAGE_KEY, false);
        } catch (e) {
            console.error(LOG_PREFIX + 'Error retrieving fullscreen state:', e);
            return false;
        }
    }

    function enterWebFullscreen(retryAttempt = 0) {
        if (webFullscreenApplied || (retryAttempt >= MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH)) {
             if (webFullscreenApplied) console.log(LOG_PREFIX + 'Already in web fullscreen, not re-applying.');
             return webFullscreenApplied;
        }

        const videoElement = findVideoElement();

        if (!videoElement) {
             console.log(LOG_PREFIX + `Video element not found for web fullscreen (Attempt ${retryAttempt + 1}/${MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH}). Retrying...`);
             setTimeout(() => enterWebFullscreen(retryAttempt + 1), RETRY_INTERVAL_ENTER_FULLSCREEN_VIDEO_SEARCH);
             return false;
        }

        let playerContainer = videoElement.closest(PLAYER_CONTAINER_SELECTORS_FOR_FULLSCREEN);

        if (!playerContainer && retryAttempt < MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH) {
             console.log(LOG_PREFIX + `Player container not found for web fullscreen (Attempt ${retryAttempt + 1}/${MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH}). Retrying...`);
             setTimeout(() => enterWebFullscreen(retryAttempt + 1), RETRY_INTERVAL_ENTER_FULLSCREEN_VIDEO_SEARCH);
             return false;
        }

        if (playerContainer) {
            console.log(LOG_PREFIX + 'Entering web fullscreen for player container:', playerContainer);
            clearInlineStyles(playerContainer); clearInlineStyles(videoElement);
            document.documentElement.classList.add('ph-web-fullscreen-active');
            document.body.classList.add('ph-web-fullscreen-active');
            playerContainer.classList.add('ph-player-is-web-fullscreen');

            if (videoElement.classList.contains('mgp_videoElement') || videoElement.classList.contains('fp-player')) {
                 videoElement.style.left = '0px'; videoElement.style.top = '0px';
                 videoElement.style.position = 'absolute'; videoElement.style.width = '100%';
                 videoElement.style.height = '100%'; videoElement.style.objectFit = 'contain';
            }
            webFullscreenApplied = true;
            console.log(LOG_PREFIX + 'Web fullscreen applied successfully.');
            if (typeof window.dispatchEvent === 'function') window.dispatchEvent(new Event('resize'));
            const playerInstance = videoElement.player || playerContainer.player || (window.player && typeof window.player.resize === 'function' ? window.player : null);
            if (playerInstance && typeof playerInstance.resize === 'function') {
                try { playerInstance.resize(); } catch (e) { console.warn(LOG_PREFIX + "Error calling player.resize()", e); }
            }
            return true;
        } else {
             console.warn(LOG_PREFIX + `Player container not found after ${MAX_RETRIES_ENTER_FULLSCREEN_VIDEO_SEARCH} retries for web fullscreen. Cannot apply fullscreen.`);
             return false;
        }
    }

    function exitWebFullscreen() {
        if (!webFullscreenApplied && !document.querySelector('.ph-player-is-web-fullscreen')) {
             console.log(LOG_PREFIX + 'Not in web fullscreen, no exit needed.');
             return true;
        }
        console.log(LOG_PREFIX + 'Exiting web fullscreen.');
        document.documentElement.classList.remove('ph-web-fullscreen-active');
        document.body.classList.remove('ph-web-fullscreen-active');
        const playerContainer = document.querySelector('.ph-player-is-web-fullscreen');
        if (playerContainer) {
            playerContainer.classList.remove('ph-player-is-web-fullscreen');
            const videoElement = playerContainer.querySelector('video');
            if (videoElement) clearInlineStyles(videoElement);
            clearInlineStyles(playerContainer);
        }
        const currentVideoElement = findVideoElement(); // Re-find, might be different
        if (currentVideoElement && (!playerContainer || !playerContainer.contains(currentVideoElement))) {
             clearInlineStyles(currentVideoElement);
        }
        webFullscreenApplied = false;
        console.log(LOG_PREFIX + 'Web fullscreen exited.');
        if (typeof window.dispatchEvent === 'function') window.dispatchEvent(new Event('resize'));
        const videoForResize = currentVideoElement || (playerContainer ? playerContainer.querySelector('video') : null);
        if (videoForResize) {
            const playerInstance = videoForResize.player || (videoForResize.closest(PLAYER_QUALIFYING_SELECTORS) ? (videoForResize.closest(PLAYER_QUALIFYING_SELECTORS).player || window.player) : window.player) ;
            if (playerInstance && typeof playerInstance.resize === 'function') {
                try { playerInstance.resize(); } catch (e) { console.warn(LOG_PREFIX + "Error calling player.resize() on exit", e); }
            }
        }
        return true;
    }

    function toggleWebFullscreenAndSaveState() {
        if (webFullscreenApplied && document.querySelector('.ph-player-is-web-fullscreen')) {
            exitWebFullscreen(); setFullscreenState(false);
        } else {
            const entered = enterWebFullscreen(); if (entered) setFullscreenState(true);
        }
    }

    function handleKeyDown(event) {
        if (event.key.toLowerCase() === 'g' && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(event.target.tagName) && !event.target.isContentEditable) {
            event.preventDefault(); event.stopPropagation();
            console.log(LOG_PREFIX + "'G' key pressed. Toggling web fullscreen and saving state.");
            toggleWebFullscreenAndSaveState();
        }
    }
    document.addEventListener('keydown', handleKeyDown, true);

    function clickNextButtonWithRetries(retryAttempt = 0) {
        if (retryAttempt >= MAX_RETRIES_AUTO_NEXT_CLICK) {
            console.error(LOG_PREFIX + `Failed to click next button after ${MAX_RETRIES_AUTO_NEXT_CLICK} retries.`);
            return;
        }
        const nextButton = findVisibleElement(NEXT_BUTTON_SELECTOR);
        if (nextButton) {
            console.log(LOG_PREFIX + 'Primary next button found:', nextButton, 'Attempting detailed click.');
            simulateDetailedClick(nextButton);
        } else {
            console.warn(LOG_PREFIX + `Primary next button (${NEXT_BUTTON_SELECTOR}) not found or not visible (Attempt ${retryAttempt + 1}/${MAX_RETRIES_AUTO_NEXT_CLICK}).`);
            const alternateNextSelectors = ['.upNextPlayer', 'a[rel="next"]', '[data-action="next-video"]', '.recommended-video-link:first-child', '.mgp_popUpNextVideoInfo a', '.icon-Next'];
            let alternateButton = alternateNextSelectors.reduce((found, sel) => found || findVisibleElement(sel), null);
            if (alternateButton) {
                console.log(LOG_PREFIX + 'Found alternate next button/link:', alternateButton, 'Clicking.');
                simulateDetailedClick(alternateButton);
            } else {
                console.log(LOG_PREFIX + `No primary or alternate next button found (Attempt ${retryAttempt + 1}/${MAX_RETRIES_AUTO_NEXT_CLICK}). Retrying...`);
                setTimeout(() => clickNextButtonWithRetries(retryAttempt + 1), RETRY_INTERVAL_AUTO_NEXT_CLICK);
            }
        }
    }

    function attachListenersToFoundVideo(videoElement) {
        if (!initialFullscreenAttempted) {
            initialFullscreenAttempted = true;
            if (getFullscreenState()) {
                console.log(LOG_PREFIX + 'Persistent fullscreen state is true. Attempting to enter fullscreen.');
                setTimeout(() => enterWebFullscreen(), 300);
            } else {
                 console.log(LOG_PREFIX + 'Persistent fullscreen state is false or not set. Not auto-entering fullscreen.');
            }
        }

        if (videoElement.dataset.autoNextListenerAttached !== 'true') {
            videoElement.addEventListener('ended', function onVideoEnded() {
                console.log(LOG_PREFIX + 'Video ended.');
                // if (webFullscreenApplied) exitWebFullscreen();
                setTimeout(() => {
                    console.log(LOG_PREFIX + 'Attempting to find and click next button...');
                    clickNextButtonWithRetries();
                }, 800);
            });
            videoElement.dataset.autoNextListenerAttached = 'true';
            console.log(LOG_PREFIX + 'Auto-next event listener attached to:', videoElement);
        }
    }

    function tryAttachVideoListeners() {
        const videoElement = findVideoElement();

        if (videoElement) {
            if (videoElement.readyState >= 1 || !videoElement.paused || videoElement.src || videoElement.HAVE_CURRENT_DATA >=1 ) { // Added HAVE_CURRENT_DATA as another check
                attachListenersToFoundVideo(videoElement);
            } else {
                // console.log(LOG_PREFIX + `Video element found but not ready. State: ${videoElement.readyState}. Will retry on next mutation/check.`);
            }
        } else {
            if (!initialFullscreenAttempted && getFullscreenState()) {
                console.log(LOG_PREFIX + 'Video not found, but persistent fullscreen state is true. Attempting fullscreen without video element.');
                initialFullscreenAttempted = true;
                setTimeout(() => enterWebFullscreen(), 300);
            }
        }
    }

    function initializeMainVideoObserver() {
        if (mainVideoElementObserver) {
            mainVideoElementObserver.disconnect();
        }

        mainVideoElementObserver = new MutationObserver((mutationsList) => {
            let potentiallyRelevantChange = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const hasVideoNode = (nodes) => Array.from(nodes).some(node =>
                        node.nodeName === 'VIDEO' ||
                        (node.matches && (node.matches(PLAYER_QUALIFYING_SELECTORS) || node.matches(PLAYER_CONTAINER_SELECTORS_FOR_FULLSCREEN))) ||
                        (node.querySelector && (node.querySelector(PLAYER_QUALIFYING_SELECTORS) || node.querySelector(PLAYER_CONTAINER_SELECTORS_FOR_FULLSCREEN)))
                    );
                    if (hasVideoNode(mutation.addedNodes) || hasVideoNode(mutation.removedNodes)) {
                        potentiallyRelevantChange = true;
                        break;
                    }
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.nodeName === 'VIDEO' && (mutation.attributeName === 'src' || mutation.attributeName === 'id' || mutation.attributeName === 'class')) {
                        potentiallyRelevantChange = true;
                        break;
                    }
                    if (mutation.target.matches && mutation.target.matches(PLAYER_CONTAINER_SELECTORS_FOR_FULLSCREEN) && (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                         potentiallyRelevantChange = true;
                         break;
                    }
                }
            }

            if (potentiallyRelevantChange) {
                // console.log(LOG_PREFIX + "Potentially relevant DOM change detected. Re-checking for video listeners.");
                tryAttachVideoListeners();
            }
        });

        mainVideoElementObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            // No attributeFilter, internal filtering is more flexible
        });
        // console.log(LOG_PREFIX + "Main video element observer initialized.");

        // Initial check after a brief delay for the page to settle
        setTimeout(tryAttachVideoListeners, 250);
        // Also, run a slightly delayed check in case initial load is slow for player
        setTimeout(tryAttachVideoListeners, 1000);
        setTimeout(tryAttachVideoListeners, 3000);
    }

    // This observer is for the "Next" button's visibility/attributes, can remain.
    const nextButtonObserver = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.target.matches && mutation.target.matches(NEXT_BUTTON_SELECTOR)) {
                 const videoElem = findVideoElement();
                 if (videoElem && videoElem.ended && !document.querySelector('.mgp_nextBtn:focus')) {
                     console.log(LOG_PREFIX + "Next button attributes changed and video has ended. Re-attempting click via observer.");
                     setTimeout(() => {
                        const nextBtn = findVisibleElement(NEXT_BUTTON_SELECTOR);
                        if(nextBtn) simulateDetailedClick(nextBtn);
                     }, 250);
                 }
            }
        }
    });
    nextButtonObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['style', 'class', 'href'] });


    // Start the main process for video listener attachment
    initializeMainVideoObserver();


    window.addEventListener('beforeunload', () => {
        document.removeEventListener('keydown', handleKeyDown, true);
        if (webFullscreenApplied) {
             exitWebFullscreen();
        }
        nextButtonObserver.disconnect();
        if (mainVideoElementObserver) {
            mainVideoElementObserver.disconnect();
        }
        console.log(LOG_PREFIX + 'Cleaned up listeners and observers.');
    });

})();
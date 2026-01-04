// ==UserScript==
// @name         AdBlock for YouTube
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  removes ads and annoying popups from youtube.
// @author       FairyRoot
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @namespace https://github.com/fairy-root
// @downloadURL https://update.greasyfork.org/scripts/499955/AdBlock%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/499955/AdBlock%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
    // Config
    const adblocker = true;
    const removePopup = false;
    const debugMessages = true;
    const fixTimestamps = true;

    // Variables
    let currentUrl = window.location.href;

    // Setup
    log("Script started");

    if (adblocker) removeAds();
    if (removePopup) popupRemover();
    if (fixTimestamps) timestampFix();
    removeUnwantedElements();

    function popupRemover() {
        setInterval(() => {
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const popupButton = document.getElementById("dismiss-button");

            const video = document.querySelector('video');

            const bodyStyle = document.body.style;
            bodyStyle.setProperty('overflow-y', 'auto', 'important');

            if (modalOverlay) {
                modalOverlay.removeAttribute("opened");
                modalOverlay.remove();
            }

            if (popup) {
                log("Popup detected, removing...");

                if (popupButton) popupButton.click();

                popup.remove();
                video.play();

                setTimeout(() => {
                    video.play();
                }, 500);

                log("Popup removed");
            }

            if (!video.paused) return;
            video.play();
        }, 500);
    }

    function removeAds() {
        log("removeAds()");

        let currentUrl = window.location.href;
        let isShortsPage = currentUrl.includes("shorts");
        let video = document.querySelector('video');

        // Initial check and setup
        if (video && !video.paused && !isShortsPage) {
            video.pause();
            video.play();
        }

        // Function to handle removing ads and checking video playback
        function checkVideoAndRemoveAds() {
            const currentHref = window.location.href;

            // Check if URL has changed
            if (currentHref !== currentUrl) {
                currentUrl = currentHref;
                isShortsPage = currentHref.includes("shorts");
                video = document.querySelector('video'); // Re-fetch video element if necessary
            }

            // Check if on YouTube shorts page, ignore if true
            if (isShortsPage) {
                log("YouTube shorts detected, ignoring...");
                return;
            }

            // Check if video element exists and is playing
            if (video && !video.paused) {
                log("Video detected playing, pausing and playing...");
                video.pause();
                video.play();
            }
        }

        // Initial call to remove ads
        checkVideoAndRemoveAds();
        removePageAds();
    }

    function removePageAds() {
        const sponsor = document.querySelectorAll("div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy");
        const style = document.createElement('style');

        style.textContent = `
            ytd-action-companion-ad-renderer,
            ytd-display-ad-renderer,
            ytd-video-masthead-ad-advertiser-info-renderer,
            ytd-video-masthead-ad-primary-video-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-ad-slot-renderer,
            yt-about-this-ad-renderer,
            #masthead-ad,
            .ytd-promoted-sparkles-text-search-renderer,
            .ytd-promoted-sparkles-web-renderer,
            .ytd-compact-promoted-video-renderer,
            .ytd-video-masthead-ad-v3-renderer,
            .ytd-promoted-sparkles-web-renderer,
            .ytd-action-companion-ad-renderer,
            .ytd-promoted-sparkles-text-search-renderer,
            .video-ads,
            #player-ads,
            #panels
            {
                display: none !important;
            }
        `;

        document.head.appendChild(style);

        sponsor.forEach((el) => el.style.setProperty("display", "none", "important"));
    }

    function removeUnwantedElements() {
        setInterval(() => {
            const enforcementMessage = document.querySelector("ytd-enforcement-message-view-model");
            if (enforcementMessage) {
                log("Enforcement message detected, removing...");
                enforcementMessage.remove();
                log("Enforcement message removed");
            }

            const ironOverlayBackdrop = document.querySelector("tp-yt-iron-overlay-backdrop");
            if (ironOverlayBackdrop) {
                log("Iron overlay backdrop detected, removing...");
                ironOverlayBackdrop.remove();
                log("Iron overlay backdrop removed");
            }
        }, 5000);
    }

    function log(message) {
        if (debugMessages) console.log(`[AdBlock for YouTube] ${message}`);
    }
})();

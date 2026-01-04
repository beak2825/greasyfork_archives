// ==UserScript==
// @name         Mobile video player controls fixer
// @namespace    http://tampermonkey.net/
// @version      2024-12-03-2
// @description  Fixes video player controls which do not show up after being hidden
// @author       You
// @match        https://app.jointherealworld.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jointherealworld.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519648/Mobile%20video%20player%20controls%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/519648/Mobile%20video%20player%20controls%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let video = null;
    let controlsContainer = null;
    let hideControlsTimeout;

    // Function to initialize event listeners for the video and controls
    function initializeVideoControls() {
        video = document.querySelector("video");
        controlsContainer = document.querySelector("div.relative .absolute.inset-0.bottom-3");

        // If either video or controlsContainer is missing, return
        if (!video || !controlsContainer) return;

        // Remove any existing listeners to avoid duplication
        removeListeners();

        // Add event listeners
        video.addEventListener("click", showControls);
        video.addEventListener("touchstart", showControls);
        video.addEventListener("play", hideControls);
        video.addEventListener("pause", showControls);
        controlsContainer.addEventListener("mouseenter", showControls);
        controlsContainer.addEventListener("mouseleave", () => {
            if (!video.paused) hideControls();
        });

        // Show controls initially
        showControls();
    }

    // Function to remove existing listeners (to avoid duplication)
    function removeListeners() {
        if (video) {
            video.removeEventListener("click", showControls);
            video.removeEventListener("touchstart", showControls);
            video.removeEventListener("play", hideControls);
            video.removeEventListener("pause", showControls);
        }
        if (controlsContainer) {
            controlsContainer.removeEventListener("mouseenter", showControls);
            controlsContainer.removeEventListener("mouseleave", hideControls);
        }
    }

    // Function to show controls
    function showControls() {
        if (!controlsContainer) return;
        controlsContainer.style.opacity = "1";
        controlsContainer.style.pointerEvents = "auto";

        // Hide controls after 3 seconds of inactivity
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(hideControls, 3000);
    }

    // Function to hide controls
    function hideControls() {
        if (!controlsContainer) return;
        controlsContainer.style.opacity = "0";
        controlsContainer.style.pointerEvents = "none";
    }

    // Periodically check for video and controls
    setInterval(() => {
        const currentVideo = document.querySelector("video");
        const currentControlsContainer = document.querySelector("div.relative .absolute.inset-0.bottom-3");

        // If video or controlsContainer has changed or was missing, reinitialize
        if (currentVideo !== video || currentControlsContainer !== controlsContainer) {
            initializeVideoControls();
        }
    }, 1000); // Check every 1 second

})();
// ==UserScript==
// @name         YouTube Spacebar Play/Pause
// @namespace    YTspacebarxFIRKx
// @version      1.04
// @description  Allows using spacebar to play/pause YouTube videos/shorts
// @author       xFIRKx
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @exclude      https://*.youtube.com/embed/*
// @homepageURL  https://greasyfork.org/it/scripts/493791-youtube-spacebar-play-pause
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493791/YouTube%20Spacebar%20PlayPause.user.js
// @updateURL https://update.greasyfork.org/scripts/493791/YouTube%20Spacebar%20PlayPause.meta.js
// ==/UserScript==

let lastVisibilityChangeTime = Date.now(); // Track the time of the last visibility change
let isShowDesktopAction = false; // Flag to track if the visibility change was caused by the "show desktop" action
let videoClickedOrFocused = false; // Flag to track if video is clicked on or in focus
let scriptEnabled = false; // Flag to control script enabling/disabling

// Event listener for visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        lastVisibilityChangeTime = Date.now(); // Update the time of the last visibility change
        isShowDesktopAction = true; // Assume "show desktop" action when the window becomes hidden
        scriptEnabled = false; // Disable the script when the window becomes hidden
    } else {
        isShowDesktopAction = false; // Reset the flag otherwise
        if (!videoClickedOrFocused) {
            scriptEnabled = true; // Enable the script when the window becomes visible, unless a video is clicked or focused
        }
    }
});

let cachedMode = "";

document.addEventListener("keydown", function onEvent(e) {
    e.stopPropagation(); // Stop event propagation

    if (!scriptEnabled || e.code !== "Space") return;

    let ae = document.activeElement;
    if (ae.tagName.toLowerCase() == "input" || ae.hasAttribute("contenteditable")) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    if (document.location.hostname == "music.youtube.com") {
        document.querySelector("#play-pause-button").click();
    } else {
        let player = document.querySelector(".html5-video-player");
        if (player.classList.contains("paused-mode")) cachedMode = "paused-mode";
        if (player.classList.contains("playing-mode")) cachedMode = "playing-mode";
        if (player.classList.contains("ended-mode")) cachedMode = "ended-mode";

        setTimeout(() => {
            let player = document.querySelector(".html5-video-player");
            if (player.classList.contains(cachedMode)) {
                document.querySelector("button.ytp-play-button").click();
                cachedMode = "";
            }
        }, 200);
    }
});

// Disable the script initially
scriptEnabled = false;

// Event listener for window focus
window.addEventListener('focus', function() {
    if (!videoClickedOrFocused && Date.now() - lastVisibilityChangeTime > 20) {
        scriptEnabled = true; // Enable the script after alt tabbing and unfocusing, unless a video is clicked or focused
    }
});

// Event listener for window blur
window.addEventListener('blur', function() {
    scriptEnabled = false; // Disable the script when the window loses focus
});

// Event listener for clicking on video
document.addEventListener('click', function(event) {
    if (event.target.tagName.toLowerCase() === 'video') {
        event.stopPropagation(); // Stop event propagation
        videoClickedOrFocused = true; // Set flag to true when clicking on the video
        scriptEnabled = false; // Disable the script after clicking on the video
    }
});

// Event listener for focusing on video
document.addEventListener('focusin', function(event) {
    if (event.target.tagName.toLowerCase() === 'video') {
        videoClickedOrFocused = true; // Set flag to true when focusing on the video
        scriptEnabled = false; // Disable the script when a video is focused
    }
});

// Event listener for blurring from video
document.addEventListener('focusout', function(event) {
    if (event.target.tagName.toLowerCase() === 'video') {
        videoClickedOrFocused = false; // Reset flag when blurring from the video
    }
});

// Event listener for visibility change (switching tabs)
document.addEventListener('visibilitychange', function() {
    if (isShowDesktopAction || videoClickedOrFocused) {
        scriptEnabled = false; // Disable the script if the visibility change was caused by the "show desktop" action or a video is clicked or focused
        isShowDesktopAction = false; // Reset the "show desktop" action flag
    }
});
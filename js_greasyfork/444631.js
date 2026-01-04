// ==UserScript==
// @name         Redgifs media controls
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Adds media controls for Redgifs
// @author       You
// @match        https://www.redgifs.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444631/Redgifs%20media%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/444631/Redgifs%20media%20controls.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict";
    console.info("Redgifs media controls initiated");

    const SELECTORS = {
        MUTE_BUTTON: ".sound",
        QUALITY_BUTTON: ".gif-quality",
        PLAY_BUTTON: "video",
        SEARCH_BOX_ID: "global-search-input"
    };

    var videoElement = getPlayerInSight();

    function getPlayerInSight() {
        const element = document.fullscreenElement || Array.prototype.filter.call(document.querySelectorAll(".player"), isInViewport)[0];
        console.log("ELEMENT IN SIGHT", element);
        return element || videoElement;
    }

    function videoPlayerRefresher() {
        // if video player isn't assigned, look for it again
        videoElement = videoElement || getPlayerInSight();
    }

    function isMuted() {
        return (videoElement.querySelector(`${SELECTORS.MUTE_BUTTON} > div[class=label]`).innerText === "Off");
    }

    function toggleSound(forceSoundState = false) {
        if (forceSoundState) {
            if (!isMuted()) {
                return;
            }
        }
        videoElement.querySelector(SELECTORS.MUTE_BUTTON)?.click();
    }

    function toggleFullscreen() {
        if (document.fullscreen) {
            document.exitFullscreen();
        } else {
            videoElement.requestFullscreen();
        }
    }

    function getQuality() {
        return videoElement.querySelector(SELECTORS.QUALITY_BUTTON)?.classList[1];
    }

    function toggleQuality(forceHDState = false) {
        const qualityButton = videoElement.querySelector(SELECTORS.QUALITY_BUTTON);
        if (forceHDState && qualityButton?.classList.contains("hd")) {
            return;
        }
        qualityButton?.click();
    }

    function togglePlayState(forcePlayState) {
        const playerElement = videoElement.querySelector(SELECTORS.PLAY_BUTTON);
        if (forcePlayState === true) {
            playerElement.play();
            return;
        } else if (forcePlayState === false) {
            playerElement.pause();
            return;
        }
        playerElement.click();
    }

    function seekVideo(time, isMarker=false, absolute=false) {
        const video = videoElement.querySelector("video");
        if (absolute) {
            video.currentTime = Number(time);
        } else if (!isMarker) {
            video.currentTime = Math.max(0, video.currentTime + Number(time));
        } else {
            const duration = video.duration;
            video.currentTime = (time * video.duration) / 10;
        }
    }

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (rect.y > 0) && (rect.y < (window.innerHeight / 2));
        // return ((rect.height + rect.y) > 0);
    }

    function syncPlayerSettings(exportMode = false) {
        videoPlayerRefresher();

        const playerQuality = getQuality();
        const playerAudible = !isMuted();

        if (exportMode) {
            localStorage.setItem("quality", playerQuality);
            localStorage.setItem("audible", playerAudible);
        }

        const syncedQuality = localStorage.getItem("quality") || playerQuality;
        const syncedAudible = (localStorage.getItem("audible") || String(playerAudible)) === "true";
        if (syncedQuality !== playerQuality) {
            toggleQuality();
        }
        if (syncedAudible !== playerAudible) {
            toggleSound();
        }
    }

    document.addEventListener("keydown", e => {
        console.log(e.target);
        if (e.target.id === SELECTORS.SEARCH_BOX_ID) {
            // don't use media controls if user is currently typing in search bar
            return;
        }
        videoPlayerRefresher();
        console.log(e.code);
        switch(e.code) {
            case "KeyF":
                toggleFullscreen();
                break;
            case "KeyM":
                toggleSound();
                break;
            case "KeyQ":
                toggleQuality();
                break;
            case "Space":
                e.preventDefault();
                e.stopImmediatePropagation();
                togglePlayState();
                break;
            case "KeyA":
                toggleFullscreen();
                toggleSound(true);
                toggleQuality(true);
                break;
            case "ArrowLeft":
                seekVideo(-5);
                break;
            case "ArrowRight":
                seekVideo(5);
                break;
            case "ArrowUp":
            case "ArrowDown":
                // this is only to avoid clashes with Redgifs fullscreen behavoiur because their code is poorly written
                if (document.fullscreen) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                break;
            case "Digit0":
            case "Digit1":
            case "Digit2":
            case "Digit3":
            case "Digit4":
            case "Digit5":
            case "Digit6":
            case "Digit7":
            case "Digit8":
            case "Digit9":
                seekVideo(Number(e.code[5]), true);
                break;
            default: console.log("Register key press", e.code);
        }
    });

    // change player based on scroll position
    let lastKnownScrollPosition = 0;
    let ticking = false;

    document.addEventListener('scroll', function(e) {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(function() {
                const newVideoElement = getPlayerInSight();
                if (videoElement !== newVideoElement) {
                    console.log("Current video player changed to play", newVideoElement);
                }
                videoElement = newVideoElement;
                ticking = false;
            });

            ticking = true;
        }
    });

    window.addEventListener("blur", function(event) {
        syncPlayerSettings(true);
    }, false);

    window.addEventListener("focus", function(event) {
        window.setTimeout(syncPlayerSettings, 100);
    }, false);

    window.addEventListener("load", (event) => {
        syncPlayerSettings();
    });
})();
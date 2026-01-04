// ==UserScript==
// @name         Remove Adblock Notifications
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Kills YouTube's new Anti-Adblock Popups
// @author       PoppingXanax
// @license MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477675/Remove%20Adblock%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/477675/Remove%20Adblock%20Notifications.meta.js
// ==/UserScript==

(function() {

    // Configuration
    const DEBUG_MODE = true;
    const DOMAINS_TO_CHECK = ['*.youtube-nocookie.com/*'];
    const JSON_PATHS_TO_REMOVE = [
        'playerResponse.adPlacements',
        'playerResponse.playerAds',
        'adPlacements',
        'playerAds',
        'playerConfig',
        'auxiliaryUi.messageRenderers.enforcementMessageViewModel'
    ];

    let unpauseCounter = 0;

    // Disable YouTube's adblock detection flag
    window.__ytplayer_adblockDetected = false;

    // Helper Functions
    function debugLog(message) {
        if (DEBUG_MODE) console.log(`Remove Adblock Notifications: ${message}`);
    }

    function triggerUnpause() {
        const keyEvent = new KeyboardEvent("keydown", {
            key: "k",
            code: "KeyK",
            keyCode: 75,
            which: 75,
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(keyEvent);
        unpauseCounter = 0;
        debugLog("Unpaused video using 'k' key");
    }
    
    function processAdblockPopup() {
        const adblockPopup = document.querySelector("body > ytd-app > ytd-popup-container > tp-yt-paper-dialog");
        const videoMain = document.querySelector("#movie_player > video.html5-main-video");
        const videoAlt = document.querySelector("#movie_player > .html5-video-container > video");
    
        if (adblockPopup) {
            debugLog("Adblock popup detected, removing...");
            adblockPopup.remove();
            unpauseCounter = 2;
            console.log("Removed Adblock popup.");
        } else {
            console.log("No Adblock popup detected.");
        }
    
        if (unpauseCounter > 0) {
            if (videoMain && videoMain.paused) triggerUnpause();
            else if (videoAlt && videoAlt.paused) triggerUnpause();
            else unpauseCounter--;
        }
    }

    function cleanJsonPaths(domains, paths) {
        if (!domains.includes(window.location.hostname)) return;

        paths.forEach(path => {
            let targetObject = window;
            path.split('.').forEach(part => {
                if (targetObject.hasOwnProperty(part)) {
                    targetObject = targetObject[part];
                } else {
                    return;
                }
            });
            targetObject = undefined;
        });
    }

    // Initialization
    debugLog("Script initialized");

    setInterval(processAdblockPopup, 1000);

    cleanJsonPaths(DOMAINS_TO_CHECK, JSON_PATHS_TO_REMOVE);

    const domObserver = new MutationObserver(() => {
        cleanJsonPaths(DOMAINS_TO_CHECK, JSON_PATHS_TO_REMOVE);
    });

    domObserver.observe(document.body, { childList: true, subtree: true });

})();
// ==UserScript==
// @name         Refresh when streamer goes live
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      2025-06-04
// @description  Also unmutes and refreshes on video player error.
// @author       Dragosarus
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @compatible   firefox
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/532971/Refresh%20when%20streamer%20goes%20live.user.js
// @updateURL https://update.greasyfork.org/scripts/532971/Refresh%20when%20streamer%20goes%20live.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Time to wait for the Twitch UI to load
    const INITIAL_DELAY_MS = 10000;

    // Check interval
    const CHECK_INTERVAL_MS = 1000;

    // Enables console logs ("rwsgl: ...")
    const ENABLE_LOGS = true;

    // Unmute after reloading
    const UNMUTE_AFTER_RELOAD = true;

    // Refresh if the player encounters an error
    const RELOAD_ON_ERROR = true;

    // Will refresh the page regardless of live status.
    const DEBUG = false;

    const SELECTORS = {
        // The "LIVE" label under the streamer's profile picture
        "live": ".ScChannelStatusTextIndicatorMask-sc-qtgrnb-1",
        // The "↗ Chat" button
        "chat": "p.ScTitleText-sc-d9mj2s-0:nth-child(2)",
        // The text when hovering over the volume button when muted
        // NOTE: may depend on language settings
        "unmute": '[aria-label="Unmute (m)"]',
        // Class that is only present when the video player encountered
        // an error (e.g. #5000)
        "playerError": ".jjYHlC",
    };

    // Reload only if the streamer wasn't live (and later is)
    let wasLive = true;

    function log(...args) {
        if (ENABLE_LOGS) {
            args.unshift("rwsgl:");
            console.log.apply(this, args);
        }
    }

    function clickIfPresent(selector) {
        if (document.querySelector(selector)) {
            document.querySelector(selector).click();
        }
    }

    function isLive() {
        // BUG: will react to the LIVE label in the "While {streamer} is offline, check out:" window.
        return DEBUG || document.querySelector(SELECTORS.live) != null;
    };

    function playerError() {
        return document.querySelector(SELECTORS.playerError) != null;
    }

    function reload() {
        GM.setValue("reload", true);
        window.location.reload();
    }

    function checkLive() {
        let live = isLive();
        if (isLive() && !wasLive) {
            reload();
        } else if (playerError() && RELOAD_ON_ERROR) {
            log("Player error:", document.querySelector(SELECTORS.playerError));
            reload();
        }
        setLive();
        setTimeout(checkLive, CHECK_INTERVAL_MS);
    }

    function setLive() {
        // Do not reload if the streamer is already live
        wasLive = isLive() && !DEBUG;
        log("Live? " + wasLive);
    }

    function init() {
        setLive();

        // If we just reloaded, ...
        let reload = GM_getValue("reload", false);
        if (reload) {
            GM_setValue("reload", false);

            // Go to the chat view
            clickIfPresent(SELECTORS.chat);

            // Unmute if the stream is muted
            if (UNMUTE_AFTER_RELOAD) {
                clickIfPresent(SELECTORS.unmute);
            }
        }

        setTimeout(checkLive, INITIAL_DELAY_MS + CHECK_INTERVAL_MS);
    }

    GM_registerMenuCommand('Reset live status', function() {
        setLive();
    }, 'r');

    setTimeout(init, INITIAL_DELAY_MS);
})();

// ==UserScript==
// @name         Iwara 自动分辨率调整
// @description  自动调整新版 Iwara 的视频分辨率为原始分辨率
// @version      0.1
// @license      MIT
// @match        *://*.iwara.tv/*
// @inject-into  content
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/730723
// @downloadURL https://update.greasyfork.org/scripts/462050/Iwara%20%E8%87%AA%E5%8A%A8%E5%88%86%E8%BE%A8%E7%8E%87%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/462050/Iwara%20%E8%87%AA%E5%8A%A8%E5%88%86%E8%BE%A8%E7%8E%87%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // User Configurables

    ////////////////////////////////////////////////////////////////////

    // Implementation

    const main = () => {
        let check = document.getElementsByClassName("vjs-playing");

        if (check.length <= 0)
            return false;

        let list = document.getElementsByClassName("resolution-Source");

        if (list.length != 1)
            return false;

        list[0].click();

        return true;
    };

    ////////////////////////////////////////////////////////////////////

    // Initializer

    // Single-shot script initializer
    // For each event, retry main() once on each update of the page, stop on succeed, reset on url change
    // Interface: bool main();
    // Usage: Put at the end of the script

    // Event Trigger
    let startupLaunchUrl = "";

    const startupRegisterEvent = (callback) => {
        startupLaunchUrl = document.location.href;
    };

    const startupEventOccured = () => {
        return startupLaunchUrl !== document.location.href;
    };

    const startupEventCleanup = () => {
        startupLaunchUrl = document.location.href;
    };

    // Core Routine
    let startupRetry = 1;
    let startupRetryDelay = 500;
    let startupFinished = false;
    let startupTimer = 0;

    const startupRunImpl = () => {
        if (startupTimer > 0) {
            clearTimeout(startupTimer);
        }

        startupTimer = -1;
        startupRetry--;

        startupFinished = main();

        if (!startupFinished) {
            startupTimer = setTimeout(() => {
                startupTimer = 0;

                if (startupShouldRun()) {
                    startupRunImpl();
                }
            }, startupRetryDelay);
        }
    };

    const startupShouldRun = () => {
        return !startupFinished && startupRetry >= 0 && startupTimer === 0;
    };

    const startupTryRun = () => {
        startupRetry = 1;

        if (startupShouldRun() || startupEventOccured()) {
            startupEventCleanup();
            startupRunImpl();
        }
    };

    // Stale Resolver
    const startupObservee = document.querySelector("body");
    const startupObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            startupTryRun();
        });
    });

    const startupObserverConfig = { // Change this to define your 'stale'
        attributes: false,
        characterData: false,
        childList: true,
        subtree: true,
    };

    const startupRegisterObserver = () => {
        startupObserver.observe(startupObservee, startupObserverConfig);
    };

    // Bootstrap
    startupRegisterEvent(startupTryRun);
    startupRegisterObserver();
    startupTryRun();
})();

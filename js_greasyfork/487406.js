// ==UserScript==
// @name         Youtube Automatic Max Quality
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  Set Youtube player automatically to max quality.
// @author       Santeri Hetekivi
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/487406/Youtube%20Automatic%20Max%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/487406/Youtube%20Automatic%20Max%20Quality.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**
     * Get element with selector and call callback with it.
     * @param {string} selector Selector for the element.
     * @param {function} callback Callback function to call with the element.
     */
    function forElement(selector, callback) {
        // Init forElement.timeoutCount.
        if (forElement.timeoutCount === undefined) {
            forElement.timeoutCount = {}
        }
        // Init forElement.timeoutCount[selector].
        if (forElement.timeoutCount[selector] === undefined) {
            forElement.timeoutCount[selector] = 0
        }

        // Get element.
        const element = document.querySelector(selector)

        // If element not found.
        if (element === null) {
            // try again after timeout.
            setTimeout(
                function () {
                    forElement(selector, callback)
                },
                (
                    // Base timeout.
                    100
                    *
                    // Increase timeout after each try.
                    (forElement.timeoutCount[selector]++)
                )
            )
        }
        // If element found
        else {
            // reset timeout count
            forElement.timeoutCount[selector] = 0
            // and call callback with element.
            callback(element)
        }
    }

    // Init previous video id.
    let videoIdPrevious = null;

    /**
     * Run on url change.
     */
    function onUrlChange() {
        // Get video id from url.
        const videoId = (new URLSearchParams(window.location.search)).get("v");
        // If
        if (
            // did not get video id
            videoId === null
            ||
            // or video id did not change
            videoId === videoIdPrevious
        ) {
            // just return.
            return
        }

        // Update previous video id.
        videoIdPrevious = videoId;

        // Run for
        forElement(
            // video player
            ".html5-video-player",
            function (player) {
                // get max quality (cannot use getMaxPlaybackQuality because it returns 'auto')
                const maxQuality = player.getAvailableQualityLevels()[0]
                // set max quality.
                player.setPlaybackQualityRange(maxQuality, maxQuality)
            }
        )

        // NOTE: If you dont have Youtube Premium or dont care for 1080p Premium, you dont need this:
        // Run for
        forElement(
            // settings button
            ".ytp-settings-button",
            function (buttonSettings) {
                // click settings button
                buttonSettings.click()
                // and run for
                forElement(
                    // quality selection button
                    ".ytp-panel .ytp-menuitem:nth-child(5)",
                    function (buttonSelectQuality) {
                        // click quality selection button
                        buttonSelectQuality.click()
                        // and run for first quality option
                        forElement(
                            ".ytp-quality-menu .ytp-menuitem:nth-child(1)",
                            function (buttonMaxQuality) {
                                // click max quality option.
                                buttonMaxQuality.click()
                            }
                        )
                    }
                )
            }
        )
    }

    // Add event listener for
    window.addEventListener(
        // Youtube page data updated event.
        'yt-page-data-updated',
        function () {
            onUrlChange();
        }
    );

    // Run on url change once on first load.
    onUrlChange();
})();

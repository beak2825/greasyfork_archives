// ==UserScript==
// @name         Youtube Automatic Theater
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  Turn Youtube player to theater mode automatically.
// @author       Santeri Hetekivi
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/487397/Youtube%20Automatic%20Theater.user.js
// @updateURL https://update.greasyfork.org/scripts/487397/Youtube%20Automatic%20Theater.meta.js
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
            // Youtube page manager that has video id
            ".ytd-page-manager[video-id]",
            function (manager) {
                // If theater mode is on
                if (manager.theater) {
                    // just return.
                    return
                }

                // Run for
                forElement(
                    // Youtube size button
                    ".ytp-size-button",
                    function (button) {
                        /**
                         * Turn Youtube player to theater mode.
                         */
                        function toTheaterMode() {
                            // If manager is already in theater mode
                            if (manager.theater) {
                                // just return.
                                return
                            }

                            // Click the size button.
                            button.click()

                            // Init timeout count.
                            if (toTheaterMode.timeoutCount === undefined)
                                toTheaterMode.timeoutCount = 0

                            // Try again after timeout.
                            setTimeout(
                                function () {
                                    toTheaterMode()
                                },
                                (
                                    // Base timeout.
                                    100
                                    *
                                    // Increase timeout after each try.
                                    (toTheaterMode.timeoutCount++)
                                )
                            )
                        }

                        // Call turning to theater mode.
                        toTheaterMode()
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

// ==UserScript==
// @name         Youtube Pause On Start
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  Pause Youtube video on start.
// @author       Santeri Hetekivi
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/487396/Youtube%20Pause%20On%20Start.user.js
// @updateURL https://update.greasyfork.org/scripts/487396/Youtube%20Pause%20On%20Start.meta.js
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

    // Init previous video ID.
    let videoIdCurr = null;

    // Init paused video ID.
    let videoIdPaused = null

    // Init video element.
    let videoElement = null

    /**
     * On playing event.
     */
    function onPlaying() {
        // If video ID has not changed from last paused one
        if (videoIdPaused === videoIdCurr) {
            // just return.
            return
        }

        // Pause video
        videoElement.pause()

        // Update paused video ID.
        videoIdPaused = videoIdCurr
    }

    /**
     * Run on url change.
     */
    function onUrlChange() {
        // Get video id from url.
        const videoIdNew = (new URLSearchParams(window.location.search)).get("v");
        // If
        if (
            // did not get video id
            videoIdNew === null
            ||
            // or video id did not change
            videoIdNew === videoIdCurr
        ) {
            // just return.
            return
        }

        // Update previous video id.
        videoIdCurr = videoIdNew;

        // Run for
        forElement(
            // video element that has src attribute
            "video[src]",
            function (video) {
                // If video element is set
                if (videoElement) {
                    // remove event listener from video element.
                    videoElement.removeEventListener("playing", onPlaying);
                }
                
                // Update video element.
                videoElement = video
                
                // Add event listener to video element
                videoElement.addEventListener("playing", onPlaying);
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

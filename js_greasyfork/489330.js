// ==UserScript==
// @name         Youtube Automatic Min Quality
// @namespace    http://tampermonkey.net/
// @version      2024-03-08
// @description  Set Youtube player automatically to min quality.
// @author       Santeri Hetekivi
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/489330/Youtube%20Automatic%20Min%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/489330/Youtube%20Automatic%20Min%20Quality.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Base timeout.
    const TIMEOUT_MS = 100

    // Selector for player.
    const SELECTOR_PLAYER = ".html5-video-player"

    // Min quality.
    const MIN_QUALITY = "tiny"

    /**
     * Get element by selector.
     * @param {string} selector For this selector.
     * @param {function} callback Function to call with element.
     * @param {?string} key If given, use this key for data.
     */
    function getElementBySelector(selector, callback, key) {
        // Get element by selector.
        const element = document.querySelector(selector)

        // Init data.
        if (typeof getElementBySelector.data !== "object") {
            getElementBySelector.data = {}
        }

        // If key is undefined
        if (typeof key === "undefined") {
            // generate key that is not in use.
            do {
                key = (Math.random() + 1).toString(36).substring(2)
            } while (key in getElementBySelector.data)
        }
        // Else if key is not in use
        else if (!(key in getElementBySelector.data)) {
            // throw error.
            throw new Error("Key '" + key + "' not found in getElementBySelector.data!")
        }

        // Key has data.
        const keyHasData = (typeof getElementBySelector.data[key] === "object")

        // If element found.
        if (element) {
            // If key has data
            if (keyHasData) {
                // and timeout is number
                if (typeof getElementBySelector.data[key].timeout === "number") {
                    // clear timeout.
                    clearTimeout(getElementBySelector.data[key].timeout)
                }
                // delete data for key.
                delete getElementBySelector.data[key]
            }
            // Callback with element.
            callback(element)
        }
        // Else if element not found.
        else {
            // If key has no data
            if (!keyHasData) {
                // init data.
                getElementBySelector.data[key] = { counter: 0, timeout: null }
            }
            // After timeout
            getElementBySelector.data[key].timeout = setTimeout(
                function () {
                    // call again with same key.
                    getElementBySelector(selector, callback, key)
                },
                (
                    // Wait base timeout
                    TIMEOUT_MS
                    *
                    // times updated counter.
                    (getElementBySelector.data[key].counter++)
                )
            )
        }
    }

    // Init previous video id.
    let videoIdPrevious = null

    /**
     * Run on url change.
     */
    function onUrlChange() {
        // Get video id from url.
        const videoId = (new URLSearchParams(window.location.search)).get("v")
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
        videoIdPrevious = videoId

        // Run for
        getElementBySelector(
            // video player
            SELECTOR_PLAYER,
            function (player) {
                // set min quality.
                player.setPlaybackQualityRange(MIN_QUALITY, MIN_QUALITY)
            }
        )
    }

    // Add event listener for
    window.addEventListener(
        // Youtube page data updated event.
        'yt-page-data-updated',
        function () {
            onUrlChange()
        }
    )

    // Run on url change once on first load.
    onUrlChange()
})();
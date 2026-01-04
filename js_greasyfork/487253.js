// ==UserScript==
// @name         YouTube Shorts Auto Next
// @description  Automatically plays the next YouTube short.
// @version      2024-03-02
// @author       Santeri Hetekivi
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      Apache-2.0
// @namespace https://greasyfork.org/users/164021
// @downloadURL https://update.greasyfork.org/scripts/487253/YouTube%20Shorts%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/487253/YouTube%20Shorts%20Auto%20Next.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Get video element.
     * @returns {HTMLVideoElement} The video element.
     */
    function getVideo() {
        // Get all video elements with src attribute.
        const videos = document.querySelectorAll("video[src]")

        // Get elements length.
        const videosLength = videos.length
        // If there is only one video element
        if (videosLength === 1) {
            // init get video timeout counter.
            getVideo.timeoutCounter = 0
            const video = videos[0]
            if (!(video instanceof HTMLVideoElement)) {
                throw new Error("Video is not a HTMLVideoElement!")
            }
            return video
        }
        // Else if no video elements found
        else if (videosLength === 0) {
            // Set timeout for getting video.
            getVideo.timeout = setTimeout(
                function () {
                    // Clear timeout.
                    clearTimeout(getVideo.timeout)
                    getVideo.timeout = null
                    return getVideo()
                },
                // Timeout time is 1000ms * times this has been called..
                1000 * (++getVideo.timeoutCounter)
            );
        }
        // Else if there are more than one video elements, throw error.
        else {
            throw new Error("Found " + videosLength + " video elements with src attribute!")
        }
    }

    // Get and initialise video element.
    const video = getVideo()

    /**
     * Init video element.
     */
    function initVideo() {
        // Set autoplay to false.
        video.autoplay = false
        // Set loop to false.
        video.loop = false
    }

    // Init video.
    initVideo()

    // Add event listener for ended event.
    video.addEventListener(
        "ended",
        function () {
            // Get next button.
            const button = document.querySelector("#navigation-button-down button")
            if (!(button instanceof HTMLButtonElement)) {
                throw new Error("No next button found!")
            }
            // Click the next button.
            button.click()
        }
    )

    // Add event listener for progress event.
    video.addEventListener(
        "progress",
        function () {
            // Init video again, because Youtube resets video element.
            initVideo()
        }
    )
})();

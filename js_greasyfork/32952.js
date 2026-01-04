// ==UserScript==
// @name         YouTube channels: disable featured video autoplay
// @description  Disable autoplay of the featured video in the channel page
// @author       Pietro Albini
// @version      1.0.1
// @license      MIT License
// @namespace    https://userscripts.pietroalbini.org
// @icon         https://userscripts.pietroalbini.org/icons/youtube.png
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32952/YouTube%20channels%3A%20disable%20featured%20video%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/32952/YouTube%20channels%3A%20disable%20featured%20video%20autoplay.meta.js
// ==/UserScript==

// Copyright (c) 2017-2019 Pietro Albini <pietro@pietroalbini.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.


(() => {
    "use strict";

    const VALID_PAGES_RE = /^\/(user|channel)\/[a-zA-Z0-9_\-]+(\/featured)?$/;

    const pause_video = () => {
        // Don't do anything on pages other than the channel preview
        if (VALID_PAGES_RE.exec(location.pathname) === null) {
            return;
        }

        let paused = false;
        let interval = setInterval(() => {
            let video = document.querySelector(
                ".ytd-channel-video-player-renderer video"
            );

            if (video !== null) {
                // Pause the video automatically the first time it starts playing
                video.addEventListener("play", () => {
                    if (paused === false) {
                        paused = true;
                        video.pause();
                    }
                });
                clearInterval(interval);
            }
        }, 100);
    };

    // Pause videos once a YouTube page finishes loading
    // This also works for pages loaded through JS
    document.addEventListener("yt-navigate-finish", pause_video);
})();

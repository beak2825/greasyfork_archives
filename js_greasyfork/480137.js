// ==UserScript==
// @name YouTube H.264 + FPS
// @name:ru YouTube H.264 + FPS
// @namespace https://www.youtube.com
// @version 2023.11.20.2
// @description Clone of h264ify with optional limit up to 30 FPS.
// @description:ru Клон h264ify с опциональным ограничением до 30 FPS.
// @match *://*.youtube.com/*
// @match *://*.youtube-nocookie.com/*
// @match *://*.youtubekids.com/*
// @license MIT
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/480137/YouTube%20H264%20%2B%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/480137/YouTube%20H264%20%2B%20FPS.meta.js
// ==/UserScript==

// Constants for video settings
const BLOCK_HIGH_FPS = true;
const DISALLOWED_TYPES_REGEX = /webm|vp8|vp9|av01/i;
const FRAME_RATE_REGEX = /framerate=(\d+)/;

(function() {
    const mediaSource = window.MediaSource;

    if (!mediaSource) return;

    const originalIsTypeSupported = mediaSource.isTypeSupported.bind(mediaSource);

    mediaSource.isTypeSupported = (type) => {
        if (typeof type !== 'string') return false;

        if (DISALLOWED_TYPES_REGEX.test(type)) return false;

        const frameRateMatch = FRAME_RATE_REGEX.exec(type);
        if (BLOCK_HIGH_FPS && frameRateMatch && frameRateMatch[1] > 30) {
            return false;
        }

        return originalIsTypeSupported(type);
    };
})();

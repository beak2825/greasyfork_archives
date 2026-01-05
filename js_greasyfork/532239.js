// ==UserScript==
// @name                YouTube Music Opus Codec
// @icon                https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_music_opus_codec_namespace
// @version             3.0.0
// @description         Force YouTube Music to use the Opus codec by blocking AAC.
// @match               *://music.youtube.com/*
// @run-at              document-start
// @grant               none
// @inject-into         page
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/532239/YouTube%20Music%20Opus%20Codec.user.js
// @updateURL https://update.greasyfork.org/scripts/532239/YouTube%20Music%20Opus%20Codec.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    'use strict';

    // Modern Logic
    if (window.MediaSource) {
        const originalIsTypeSupported = window.MediaSource.isTypeSupported;
        window.MediaSource.isTypeSupported = function (mime) {
            // Block AAC to force YTM to default to Opus.
            if (typeof mime === 'string' && (mime.includes('mp4a') || mime.includes('aac'))) return false;
            return originalIsTypeSupported.call(this, mime);
        };
    }

    // Legacy Fallback Logic
    const originalCanPlayType = window.HTMLMediaElement.prototype.canPlayType;
    window.HTMLMediaElement.prototype.canPlayType = function (mime) {
        // Block AAC to force YTM to default to Opus.
        if (typeof mime === 'string' && (mime.includes('mp4a') || mime.includes('aac'))) return '';
        return originalCanPlayType.call(this, mime);
    };

})();

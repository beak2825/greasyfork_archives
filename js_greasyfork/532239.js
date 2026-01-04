// ==UserScript==
// @name                YouTube Music Opus Codec
// @icon                https://www.youtube.com/img/favicon_48.png
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_music_opus_codec_namespace
// @version             2.0.0
// @match               *://music.youtube.com/*
// @grant               none
// @license             MIT
// @description         Spoofs a mobile user agent to trick YouTube Music into using the Opus audio codec if the song is not available in 256kbps AAC (High Quality), since desktop YouTube Music seems to be unable to play in Opus codec always defaults to AAC.
// @downloadURL https://update.greasyfork.org/scripts/532239/YouTube%20Music%20Opus%20Codec.user.js
// @updateURL https://update.greasyfork.org/scripts/532239/YouTube%20Music%20Opus%20Codec.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    "use strict";
    const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...";
    Object.defineProperty(navigator, "userAgent", {
        get: function () { return mobileUA; }
    });
    Object.defineProperty(navigator, "platform", {
        get: function () { return "iPhone"; }
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
        get: function () { return 1; }
    });
})();
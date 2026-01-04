// ==UserScript==
// @name         FixRedYoutube
// @description  CSS fixed to new youtube
// @include 	 *://*.youtube.com*
// @grant        GM_addStyle
// @run-at document-start
// @version 2.2
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/32731/FixRedYoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/32731/FixRedYoutube.meta.js
// ==/UserScript==

GM_addStyle ( "#player-ads { display: none; }\
paper-button.ytd-subscribe-button-renderer {\
    background: hsla(3, 60%, 47%, 1);\
}\
a.yt-simple-endpoint.yt-formatted-string {\
    color: hsla(3, 60%, 47%, 1);\
}\
#progress.ytd-thumbnail-overlay-resume-playback-renderer, .ytp-red2 .ytp-swatch-background-color, .ytp-red2 .ytp-swatch-background-color-secondary, .ytp-play-progress.ytp-swatch-background-color, .ytp-swatch-background-color-secondary {\
    background-color: hsla(3, 60%, 47%, 1);\
}\
path#lozenge-path, #logo path.style-scope.yt-icon {\
    fill: hsla(3, 60%, 47%, 1);\
}\
div#top div#player {\
    max-height: calc(100vh - var(--ytd-masthead-height, 56px));\
}");
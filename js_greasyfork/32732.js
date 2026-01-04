// ==UserScript==
// @name         PinkYoutube
// @description  Pink youtube CSS
// @include 	 *://*.youtube.com*
// @grant        GM_addStyle
// @run-at document-start
// @version 2.2
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/32732/PinkYoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/32732/PinkYoutube.meta.js
// ==/UserScript==

GM_addStyle ( "#player-ads { display: none; }\
paper-button.ytd-subscribe-button-renderer {\
    background: hsl(318, 54%, 51%);\
}\
a.yt-simple-endpoint.yt-formatted-string {\
    color: hsl(318, 54%, 51%);\
}\
#progress.ytd-thumbnail-overlay-resume-playback-renderer, .ytp-red2 .ytp-swatch-background-color, .ytp-red2 .ytp-swatch-background-color-secondary, .ytp-play-progress.ytp-swatch-background-color, .ytp-swatch-background-color-secondary {\
    background-color: hsl(318, 54%, 51%);\
}\
path#lozenge-path, #logo path.style-scope.yt-icon {\
    fill: hsl(318, 54%, 51%);\
}\
div#top div#player {\
    max-height: calc(100vh - var(--ytd-masthead-height, 56px));\
}");
// ==UserScript==
// @name        YouTube Embed Remove Branding.
// @namespace   youtubeembedbrandremoval
// @match       https://*.youtube.com/embed*
// @grant       none
// @version     1.0.4
// @license     GPLv3
// @author      Hououin Kyōma
// @description Ideal for custom embedded players to make embed feel less like third-party.
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/451446/YouTube%20Embed%20Remove%20Branding.user.js
// @updateURL https://update.greasyfork.org/scripts/451446/YouTube%20Embed%20Remove%20Branding.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.innerHTML = `
.ytp-gradient-top,
.ytp-chrome-top,
.ytp-show-tiles,
.ytp-watermark,
.ytp-youtube-button,
.ytp-impression-link,
.ytp-pause-overlay-container,
.ytp-player-content,
.ytp-ce-element,
.ytp-small-redirect {
  display: none!important;
}

.ytp-large-play-button-bg, .ytp-large-play-button-red-bg {
  display: none!important;
  fill: #222!important; /* If you want it, can make it less YT like */
}
div:hover .ytp-large-play-button-bg, div:hover .ytp-large-play-button-red-bg {
  fill: #333!important;
}

`;

document.head.appendChild(style);
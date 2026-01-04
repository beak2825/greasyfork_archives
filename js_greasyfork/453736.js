// ==UserScript==
// @name Less Obtrusive YouTube End Cards
// @namespace https://afn.lol
// @version 1
// @description Make YouTube end cards less obtrusive.
// @author xafn
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/453736/Less%20Obtrusive%20YouTube%20End%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/453736/Less%20Obtrusive%20YouTube%20End%20Cards.meta.js
// ==/UserScript==

(function() {
let css = `
.ytp-ce-element {
    transform: scale(0.7) !important;
}

.ytp-ce-element:not(:has(.ytp-ce-expanding-image)), 
.ytp-ce-expanding-icon, 
.ytp-ce-element-shadow, 
.ytp-ce-expanding-overlay {
    border-radius: 4px;
}

.ytp-ce-covering-image, 
.ytp-ce-video-title, 
.ytp-ce-expanding-image, 
.ytp-ce-video-duration,
.ytp-ce-playlist-count,
.ytp-ce-playlist-title,
.ytp-ce-expanding-icon{
    transition: opacity 0.4s !important;
    opacity: 0.4 !important;
}

.ytp-ce-element:hover .ytp-ce-covering-image,
.ytp-ce-element:hover .ytp-ce-video-title,
.ytp-ce-element:hover .ytp-ce-expanding-image,
.ytp-ce-element:hover .ytp-ce-playlist-count,
.ytp-ce-element:hover .ytp-ce-playlist-title,
.ytp-ce-element:hover .ytp-ce-video-duration,
.ytp-ce-element:hover .ytp-ce-expanding-icon{
    opacity: 1 !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

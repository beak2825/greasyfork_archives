// ==UserScript==
// @name Gegenstimme Dark Mode colourful like/dislike buttons
// @namespace userstyles.world/user/782754-picblick
// @version 1.1
// @description Changes colour of the like or dislike button if activated, so it's easier to see if video already was rated. Red dislike, green like.
// @author picblick@web.de
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.gegenstimme.tv/*
// @downloadURL https://update.greasyfork.org/scripts/463195/Gegenstimme%20Dark%20Mode%20colourful%20likedislike%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/463195/Gegenstimme%20Dark%20Mode%20colourful%20likedislike%20buttons.meta.js
// ==/UserScript==

(function() {
let css = `
    .video-bottom .video-info .video-info-first-row .video-actions-rates .video-actions .action-button.action-button-like.activated svg {
        color: green !important;
    }

    .video-bottom .video-info .video-info-first-row .video-actions-rates .video-actions .action-button.action-button-dislike.activated svg {
        color: red !important;
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

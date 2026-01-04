// ==UserScript==
// @name YouTube - Watch Later and Share Buttons Return
// @namespace lednerg
// @version 17.7.10
// @description Enables the Watch Later and Share buttons on the player when not in Fullscreen mode.
// @author lednerg
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/408875/YouTube%20-%20Watch%20Later%20and%20Share%20Buttons%20Return.user.js
// @updateURL https://update.greasyfork.org/scripts/408875/YouTube%20-%20Watch%20Later%20and%20Share%20Buttons%20Return.meta.js
// ==/UserScript==

(function() {
let css = `

  .ytp-hide-info-bar:not(.ended-mode) .ytp-chrome-top:not(.ytp-chrome-top-show-buttons) .ytp-watch-later-button, .ytp-hide-info-bar:not(.ended-mode) .ytp-chrome-top:not(.ytp-chrome-top-show-buttons) .ytp-share-button
  {
    display: inline-block !important;
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

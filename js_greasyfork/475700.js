// ==UserScript==
// @name ARD Mediathek - Smaller Subtitles
// @namespace https://greasyfork.org/users/703184
// @version 1.0.0
// @description Makes the subtitles on the ARD Mediathek smaller
// @author floriegl
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.ardmediathek.de/video/*
// @downloadURL https://update.greasyfork.org/scripts/475700/ARD%20Mediathek%20-%20Smaller%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/475700/ARD%20Mediathek%20-%20Smaller%20Subtitles.meta.js
// ==/UserScript==

(function() {
let css = `
    .ardplayer-untertitel * {
        font-size: 16px !important;
        line-height: 1.5 !important;
    }
    .ardplayer-xl .ardplayer-untertitel * {
        font-size: 24px !important;
    }
    .ardplayer-untertitel span:not(:has(span)) {
        background-color: rgba(0, 0, 0, 0.5) !important;
        padding: 2px !important;
    }
    .ardplayer-xl .ardplayer-untertitel span:not(:has(span)) {
        padding: 3px !important;
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

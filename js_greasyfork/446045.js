// ==UserScript==
// @name YouTube - Hide Controls Until Hover
// @namespace q1k
// @version 1.0.0
// @description Automatically hides the top and bottom bar when paused. Makes it easier to read text on the top/bottom that is normally hidden by the controls.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/446045/YouTube%20-%20Hide%20Controls%20Until%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/446045/YouTube%20-%20Hide%20Controls%20Until%20Hover.meta.js
// ==/UserScript==

(function() {
let css = `
.html5-video-player.paused-mode .ytp-chrome-top, 
.html5-video-player.paused-mode .ytp-gradient-top, 
.html5-video-player.paused-mode .ytp-chrome-bottom, 
.html5-video-player.paused-mode .ytp-gradient-bottom {
  visibility: hidden;
}
.html5-video-player.paused-mode:hover .ytp-chrome-top, 
.html5-video-player.paused-mode:hover .ytp-gradient-top, 
.html5-video-player.paused-mode:hover .ytp-chrome-bottom, 
.html5-video-player.paused-mode:hover .ytp-gradient-bottom {
  visibility: visible;
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

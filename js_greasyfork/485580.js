// ==UserScript==
// @name YouTube Always Show Progress Bar - CSS Method
// @namespace greasyfork.org/en/users/1252550-kiokito
// @version 1.0.0
// @description Shows YouTube progress bar at all times, formatted for theater mode, via lightweight CSS.
// @author Kiokito
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/485580/YouTube%20Always%20Show%20Progress%20Bar%20-%20CSS%20Method.user.js
// @updateURL https://update.greasyfork.org/scripts/485580/YouTube%20Always%20Show%20Progress%20Bar%20-%20CSS%20Method.meta.js
// ==/UserScript==

(function() {
let css = `
    
    html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) {
        overflow: visible !important;
    }
    
    html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) .ytp-chrome-bottom {
        display: block !important;
        opacity: 1 !important;
        position: absolute !important;
        bottom: -4.4vh !important;
        width: 100% !important;
        z-index: 100 !important;
    }
    
    html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) .ytp-gradient-bottom {
        display: none !important;
    }
    
    html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) .ytp-caption-window-bottom {
        bottom: 5vh !important;
    }
    
    html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) #player-container {
        padding-bottom: 3.5vh !important;
    }
    
    @media (max-width: 600px) {
        html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) .ytp-chrome-bottom {
            bottom: 0vh !important;
        }
        html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) .ytp-caption-window-bottom {
            bottom: 4vh !important;
        }
        html:not(.ftw-fullsize.on) .html5-video-player:not(.ytp-fullscreen) #player-container {
            padding-bottom: 4vh !important;
        }
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

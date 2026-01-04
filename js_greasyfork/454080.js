// ==UserScript==
// @name YouTube - Show Full View Count and Date (unless hovering)
// @namespace lednerg
// @version 23.7.26
// @description Brings back the full view count and date to the description box.
// @author lednerg
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/454080/YouTube%20-%20Show%20Full%20View%20Count%20and%20Date%20%28unless%20hovering%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454080/YouTube%20-%20Show%20Full%20View%20Count%20and%20Date%20%28unless%20hovering%29.meta.js
// ==/UserScript==

(function() {
let css = `

/* Places the tooltip over the "time ago" statement and mimics the font */
    #description .tp-yt-paper-tooltip {
        opacity: 1;
        transition: opacity .125s;
        display: block !important;
        position: relative;
        bottom: 101px;
        left: 2px;
        padding: 2px !important;
        padding-right: 50px !important; /* extra padding for large view counts */
        font-size: 14px !important;
        font-weight: 500 !important;
    }
/* Fade out tooltip whenever the mouse hovers over the description box (while it's collapsed) */
    ytd-watch-metadata[description-collapsed] #description:hover .tp-yt-paper-tooltip {
        opacity: 0 !important;
        transition: opacity .125s;
    }
/* Keeps tooltip's background from appearing during transitions */
    ytd-watch-metadata:not([description-collapsed]) #description .tp-yt-paper-tooltip {
        opacity: 0 !important;
        transition: opacity .125s;
    }
/* Adds the • symbol between the default view count and date in order to match the tooltip */
    #description #info span:first-child + span:before {
        content: " •";
        margin-right: -3.5px;
    }
/* Matching background color for dark mode */
    html[dark] #description .tp-yt-paper-tooltip {
        background-color: #272727 !important;
    }
      /* dark mode while hovering */
    html[dark] #description:hover .tp-yt-paper-tooltip {
        background-color: #3f3f3f !important;
    }
/* Matching background color for light mode */
    html:not([dark]) #description .tp-yt-paper-tooltip {
        color: #0f0f0f !important;
        background-color: #f2f2f2 !important;
    }
      /* light mode while hovering */
    html:not([dark]) #description:hover .tp-yt-paper-tooltip {
        color: #0f0f0f !important;
        background-color: #e5e5e5 !important;
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

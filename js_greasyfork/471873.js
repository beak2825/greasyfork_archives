// ==UserScript==
// @name YouTube - Large "Show less" Button
// @namespace lednerg
// @version 25.3.12
// @description Turns the right half of the description box into a large "Show less" button.
// @author lednerg
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/471873/YouTube%20-%20Large%20%22Show%20less%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/471873/YouTube%20-%20Large%20%22Show%20less%22%20Button.meta.js
// ==/UserScript==

(function() {
let css = `
    
    tp-yt-paper-button#collapse {
        border: none !important;
        box-shadow: none !important;
    }
    
    /* "Show more" text */
    ytd-watch-metadata[description-collapsed] tp-yt-paper-button#expand {
        opacity: 0.2 !important;
        transition: opacity .5s !important;
        border-width: 0px !important;
        box-shadow: none !important;
    }
    /* "Show more" text when hovered */
    ytd-watch-metadata[description-collapsed] #description:hover tp-yt-paper-button#expand {
        opacity: 1 !important;
        transition: opacity .125s !important;
    }
    /* Puts some space before the "Show more" text */
    ytd-watch-metadata[description-collapsed] tp-yt-paper-button#expand:before {
        content: "   " !important
    }
    /* "Show less" button location, size, coloring, etc */
    ytd-watch-metadata:not([description-collapsed]) tp-yt-paper-button#collapse {
        color: transparent !important; /* hides original "Show less" text */
        position: absolute !important;
        bottom: 0% !important;
        right: 0% !important;
        height: 100%;
        width: 50%;
        opacity: 0 !important;
        z-index: 0;
        border-radius: 0;
    }
    /* "Show less" button when hovered */
    ytd-watch-metadata:not([description-collapsed]) tp-yt-paper-button#collapse:hover {
        background: linear-gradient(90deg, #9990 0%, #9992 22%, #9993 45%, #9993 55%, #9992 78%, #9990 100%) !important; 
        transition: opacity .125s !important;
        opacity: 1 !important; 
    }
    /* "Show less" text */
    ytd-watch-metadata:not([description-collapsed]) tp-yt-paper-button#collapse:before {
        color: #fff !important;
        content: "Show less";
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
    }
    /* "Show less" text when hovered */
    ytd-watch-metadata:not([description-collapsed]) tp-yt-paper-button#collapse:hover:before {
        opacity: 1 !important;
        transition: opacity .25s !important;
    }
    /* Allows links, Chapters, Key Moments, etc to be clicked under "Show less" button*/
    ytd-watch-metadata:not([description-collapsed]) #description a,
    ytd-watch-metadata:not([description-collapsed]) #description span,
    ytd-watch-metadata:not([description-collapsed]) #description .yt-formatted-string ,
    ytd-watch-metadata:not([description-collapsed]) div[slot="extra-content"] div:not(#left-arrow, #right-arrow, #left-arrow-container, #right-arrow-container) {
        position: relative !important;
        z-index: 1 !important;
    }
    #left-arrow, #right-arrow, #left-arrow-container, #right-arrow-container {
        z-index: 2 !important;
    }
    /* Move "Show less" down while open so it doesn't collide with text. */
    ytd-watch-metadata:not([description-collapsed]) ytd-text-inline-expander {
        min-height: 20px;
        padding-bottom: 20px;
        /* retrying the thing that was glitchy but in this element */
        margin-top: -20px;
        padding-top: 20px;
    }

    /* Sometimes extra stuff under the description blocks the button. This narrows that area. */
    div[slot="extra-content"] {
        width: 70% !important;
    }
    div#left-arrow-container {
        position: absolute !important;
        z-index: 999 !important;
    }
    div#right-arrow-container {
        position: absolute !important;
        z-index: 999 !important;
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

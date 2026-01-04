// ==UserScript==
// @name         YouTube Always Hoverable ProgressBar
// @namespace    https://github.com/Amadeus-AI
// @version      1.0.3
// @description  Makes progressbar hoverable from the very beginning (also works when paused).
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @author       AmadeusAI
// @match        *://www.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435487/YouTube%20Always%20Hoverable%20ProgressBar.user.js
// @updateURL https://update.greasyfork.org/scripts/435487/YouTube%20Always%20Hoverable%20ProgressBar.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

var InstantBar =
{
    css :
`
.ytp-chrome-bottom { opacity: 0 }
.ytp-chrome-top { opacity: 0 }
.ytp-gradient-bottom { opacity: 0 }
.ytp-gradient-top { opacity: 0 }
.html5-video-player:not(.ytp-fullscreen):hover > .ytp-chrome-bottom { opacity: 1 }
.html5-video-player:not(.ytp-fullscreen):hover > .ytp-gradient-bottom { opacity: 1 }
.html5-video-player.ytp-fullscreen > .ytp-chrome-bottom:hover { opacity: 1 }

`,

    apply : function()
    {
        if (typeof GM_addStyle !== "undefined")
        {
            GM_addStyle(InstantBar.css);
        }
        else
        {
            let styleNode = document.createElement("style");
            styleNode.appendChild(document.createTextNode(InstantBar.css));
            (document.querySelector("head") || document.documentElement).appendChild(styleNode);
        }
    },

    start : function()
    {
        // To overwrite youtube's default behavior
        setTimeout(InstantBar.apply, 0);
    }
};

InstantBar.start();
// ==UserScript==
// @name         Youtube Dislike String Remover
// @namespace    https://github.com/Amadeus-AI
// @version      1.0
// @description  Hide the useless "dislike" string (not the button) to save some space
// @icon         https://www.youtube.com/s/desktop/3748dff5/img/favicon_48.png
// @author       AmadeusAI
// @match        *://www.youtube.com/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435987/Youtube%20Dislike%20String%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/435987/Youtube%20Dislike%20String%20Remover.meta.js
// ==/UserScript==
/*jshint esversion: 6 */


let styleNode = document.createElement("style");
styleNode.appendChild
(
    document.createTextNode
    (
        `ytd-toggle-button-renderer.style-text.force-icon-button.ytd-menu-renderer.style-scope:nth-of-type(2) yt-formatted-string.style-text.ytd-toggle-button-renderer.style-scope { display: none }`
    )
);
(document.querySelector("head") || document.documentElement).appendChild(styleNode);
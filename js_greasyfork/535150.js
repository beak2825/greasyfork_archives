// ==UserScript==
// @name         Youtube Video Size Enlarger
// @namespace    http://tampermonkey.net/
// @version      2025-04-06
// @description  "Enlarge the theatre-mode youtube video"
// @author       JAC5
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/535150/Youtube%20Video%20Size%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/535150/Youtube%20Video%20Size%20Enlarger.meta.js
// ==/UserScript==

function add_space() {
    // This is where you set the size taken up by the player. 100vh is the full 
    // height of the page. However, there is the youtube top bar to consider, so
    // cut off a few 'vh'
    document.getElementById("full-bleed-container").style.maxHeight = "96vh";
}

(function() {
    'use strict';
    // Add a delay to ensure page loads correctly before making changes. 2000=2seconds
    addEventListener("load", setTimeout(add_space, 2000));
})();
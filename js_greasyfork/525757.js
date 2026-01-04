// ==UserScript==
// @name         Add Background to Body
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a background to websites that have transparency in your browser (e.g. Zen Browser).
// @author       Maniac
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525757/Add%20Background%20to%20Body.user.js
// @updateURL https://update.greasyfork.org/scripts/525757/Add%20Background%20to%20Body.meta.js
// ==/UserScript==


(function() {
    'use strict';

/*
This generally should deal with most websites that have the transparency issue.
*/
    // Apply background color before the page starts rendering
    document.documentElement.style.backgroundColor = "#ffffff"; // White background

    window.addEventListener('DOMContentLoaded', function() {
        const bodyStyle = window.getComputedStyle(document.body);

        if (!bodyStyle.backgroundImage && bodyStyle.backgroundImage === 'none' && bodyStyle.backgroundColor === 'rgba(0, 0, 0, 0)' && !bodyStyle.background) {
            document.body.style.backgroundColor = "#ffffff"; // Ensure body background stays white
        }
    });

/*
This was a fix for Brave Search that could help with other websites.
This takes the background color of the body and makes a div with that background color in the very back.
*/
    const bgDiv = document.createElement("div");
    bgDiv.style.position = "fixed";
    bgDiv.style.top = "0";
    bgDiv.style.left = "0";
    bgDiv.style.width = "100vw";
    bgDiv.style.height = "100vh";
    bgDiv.style.zIndex = "-1"; // Send it to the back
    bgDiv.style.background = getComputedStyle(document.body).backgroundColor || "white";

    // Insert at the very beginning of the body
    document.body.prepend(bgDiv);
})();
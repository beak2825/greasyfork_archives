// ==UserScript==
// @name         NoShorts – YT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes those annoying shorts from your search/homepage
// @author       OndryDEV
// @match        https://www.youtube.com/*
// @icon         https://www.adexchanger.com/wp-content/uploads/2023/11/shorts600.jpg
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486864/NoShorts%20%E2%80%93%20YT.user.js
// @updateURL https://update.greasyfork.org/scripts/486864/NoShorts%20%E2%80%93%20YT.meta.js
// ==/UserScript==

// IF REDISTRIBUTING CREDIT ME

// dont mind @icon xd im too lazy to make logo
(function() {
    'use strict';

    // remove
    function removeShorts() {
        var titles = document.querySelectorAll("span#title");
        titles.forEach(function(title) {
            if (title.textContent.includes("Shorts")) {
                var parentDiv = title.closest("div#dismissible, ytd-reel-shelf-renderer");
                if (parentDiv) {
                    parentDiv.parentNode.removeChild(parentDiv);
                }
            }
        });
     // for yt videos (hidden shorts)
        var shortsTitles = document.querySelectorAll("span[aria-label='Shorts']");
        shortsTitles.forEach(function(title) {
            var parentDiv = title.closest("div#dismissible");
            if (parentDiv) {
                parentDiv.parentNode.removeChild(parentDiv);
            }
        });
    }

    // clock
    function noShorts() {
        removeShorts();
        setTimeout(noShorts, 500); // Check every second
    }

    // call func
    noShorts();
})();

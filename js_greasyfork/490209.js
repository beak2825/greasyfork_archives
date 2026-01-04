// ==UserScript==
// @name         Hide Ignored Steam Games
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hides all ignored games on Steam's front page.
// @author       Unbroken
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?domain=store.steampowered.com
// @grant        none
// @license      GNU GPLv3
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/490209/Hide%20Ignored%20Steam%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/490209/Hide%20Ignored%20Steam%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hider(){
       document.querySelectorAll('.ds_ignored').forEach(element => {element.style.display = 'none';});
    }

     // MutationObserver to react to DOM changes
    const observer = new MutationObserver((mutations) => {
        hider(); // Attempt to colorize the div on each DOM change
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    hider();
})();
// ==UserScript==
// @name         Bandcamp - Move tracklist & Change Play button background (Updated)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  doing things
// @author       Threeskimo
// @match        *://*.bandcamp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bandcamp.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526899/Bandcamp%20-%20Move%20tracklist%20%20Change%20Play%20button%20background%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526899/Bandcamp%20-%20Move%20tracklist%20%20Change%20Play%20button%20background%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function moveTableContents() {
        const table = document.getElementById('track_table');
        const targetDiv = document.querySelector('.inline_player');

        if (table && targetDiv && table !== targetDiv.nextSibling) {
            targetDiv.parentNode.insertBefore(table, targetDiv.nextSibling);

            // Add a <br> after the table if not already there
            if (!table.nextSibling || table.nextSibling.tagName !== 'BR') {
                const br = document.createElement('br');
                table.parentNode.insertBefore(br, table.nextSibling);
            }

            console.log('[BC] Table moved after inline player.');
        }
    }

    function highlightPlayingStatus() {
        const playingDivs = document.querySelectorAll('.play_status.playing');
        playingDivs.forEach(div => {
            div.style.backgroundColor = 'orange';
        });
    }

    // Run functions every 2 seconds
    setInterval(() => {
        moveTableContents();
        highlightPlayingStatus();
    }, 1000);

    // Monitor for dynamically added elements
    const observer = new MutationObserver(() => highlightPlayingStatus());
    observer.observe(document.body, { childList: true, subtree: true });

})();

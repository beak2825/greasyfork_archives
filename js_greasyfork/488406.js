// ==UserScript==
// @name         TorrentBD Shoutbox Cleaner
// @icon         https://icons.duckduckgo.com/ip3/torrentbd.net.ico
// @namespace    foxbinner
// @version      1.1.0
// @description  Improve the shoutbox by filtering out unrelated entries such as 'New Torrent', 'New Forum Post', thus refining the user experience to ensure relevance.
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        none
// @author       foxbinner
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488406/TorrentBD%20Shoutbox%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/488406/TorrentBD%20Shoutbox%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Shoutbox phrases to remove
    const phrasesToRemove = [
        "New Torrent :",
        "New Forum Post",
        "New Forum Topic",
        "New Request :"
    ];

    // Remove items containing the phrases
    function checkShoutbox() {
        let shoutItems = document.querySelectorAll('.shout-item');
        shoutItems.forEach((item) => {
            let textField = item.querySelector('.shout-text');
            if (!textField) return;
            let shoutText = textField.textContent || "";
            for(let phrase of phrasesToRemove) {
                if(shoutText.includes(phrase)) {
                    item.remove();
                    break; // Stop after removing
                }
            }
        });
    }

    checkShoutbox();

    let shoutContainer = document.querySelector('#shouts-container');
    if (shoutContainer) {
        let observer = new MutationObserver(checkShoutbox);
        observer.observe(shoutContainer, { childList: true, subtree: true });
    }
})();
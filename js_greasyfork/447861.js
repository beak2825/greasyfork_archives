// ==UserScript==
// @name         Twitch Auto Theatre Mode
// @namespace    https://greasyfork.org/en/users/935727-kotaless
// @version      1.0
// @description  Load Twitch Streams in Theatre Mode Automatically
// @author       Kotaless
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447861/Twitch%20Auto%20Theatre%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/447861/Twitch%20Auto%20Theatre%20Mode.meta.js
// ==/UserScript==

// Click to the theatre button
function theatreMode() {
    if (document.querySelector("[data-a-target=player-theatre-mode-button]")) {
        document.querySelector("[data-a-target=player-theatre-mode-button]").click();
    }
}

// Execute the function when the page load
setTimeout(theatreMode, 1000);

// Execute the function again when the page changes
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(theatreMode, 1000);
    }
}).observe(document, { subtree: true, childList: true });
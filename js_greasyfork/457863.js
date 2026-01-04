// ==UserScript==
// @name        YouTube - Shorts remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.6.0
// @license     MIT
// @description Remove all short videos from your homepage, subscription feed, search and watch page on YouTube.
// @match       https://*.youtube.com/
// @match       https://*.youtube.com/feed/*
// @match       https://*.youtube.com/results*
// @match       https://*.youtube.com/watch*
// @match       https://youtube.com/
// @match       https://youtube.com/feed/*
// @match       https://youtube.com/results*
// @match       https://youtube.com/watch*
// @icon        https://i.imgur.com/rvNc0hN.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/457863/YouTube%20-%20Shorts%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/457863/YouTube%20-%20Shorts%20remover.meta.js
// ==/UserScript==
const observer = new MutationObserver(function(mutationList, observer) {
    // Remove any reel shelves
    const shelves = document.getElementsByTagName('ytd-reel-shelf-renderer')
    for (let i = 0; i < shelves.length; i++) {
        console.log("Removing shorts shelf", shelves[i]);
        shelves[i].remove()
    }

    // Remove any rich reel shelves
    const richShelves = document.getElementsByTagName('ytd-rich-shelf-renderer')
    for (let i = 0; i < richShelves.length; i++) {
        console.log("Removing shorts shelf", richShelves[i]);
        richShelves[i].remove()
    }

    // Remove anything with the shorts overlay
    const overlays = document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]');
    for (let i = 0; i < overlays.length; i++) {
        const element = overlays[i];

        const section = element.closest('.ytd-item-section-renderer');
        if (section) { console.log("Removing short overlay", element); section.remove(); return; }

        const grid = element.closest('.ytd-grid-renderer');
        if (grid) { console.log("Removing short overlay", element); grid.remove(); return; }

        const list = element.closest('.ytd-section-list-renderer');
        if (list) { console.log("Removing short overlay", element); list.remove(); }
    }
});


const observeShorts = () => {
    observer.observe(document.querySelector('ytd-page-manager'), { childList: true, subtree: true });
}

// Ensure the observer is update when we navigate away
window.navigation.addEventListener("navigate", (event) => {
    observer.disconnect();
    observeShorts()
});

// Ensure we observe on initial load as well
observeShorts();
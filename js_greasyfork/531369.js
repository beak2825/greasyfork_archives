// ==UserScript==
// @name        fuck reels
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 31/03/2025, 05:51:04
// @downloadURL https://update.greasyfork.org/scripts/531369/fuck%20reels.user.js
// @updateURL https://update.greasyfork.org/scripts/531369/fuck%20reels.meta.js
// ==/UserScript==
function findAndDeleteReels() {
    const spans = document.querySelectorAll("div > div > div > div > div > div > div > div > div > div > div > span");
    const found = Array.from(spans).find(span => span.textContent.includes("Reels"));

    if (found) {
        console.log("Found:", found);

        let parent = found;
        let depth = 0;

        while (parent.parentElement && depth < 23) {
            parent = parent.parentElement;
            depth++;
        }

        if (depth === 23 && parent.parentElement) {
            console.log("Deleting parent 23:", parent);
            parent.remove(); // Remove the 23rd parent element
            return true;
        } else {
            console.log("Parent 23 does not exist.");
        }
    }
    return false;
}

if (!findAndDeleteReels()) {
    console.log("Not found initially, starting observer...");

    const observer = new MutationObserver(() => {
        if (findAndDeleteReels()) {
            console.log("Found dynamically, stopping observer.");
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

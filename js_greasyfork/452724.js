// ==UserScript==
// @name         Hide Facebook Reels Completely
// @namespace    none
// @version      1.0.4
// @description  Prevents FB Reels from showing up in your feed
// @author       Freyam Mehta
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452724/Hide%20Facebook%20Reels%20Completely.user.js
// @updateURL https://update.greasyfork.org/scripts/452724/Hide%20Facebook%20Reels%20Completely.meta.js
// ==/UserScript==

const element = document.querySelector('[aria-label="Reel tile preview"]');
element.style.display = "none";

function hideReelsSection() {
    const spans = document.querySelectorAll("span");

    for (const span of spans) {
        if (span.innerText.includes("Reels and short videos")) {
            const parent = span.closest("div.x1lliihq");
            parent.style.display = "none";

            console.log("Hidden the Reels Section");

            return true;
        }
    }

    return false;
}

function hideReelsTopSection() {
    const spans = document.querySelectorAll("span");

    for (const span of spans) {
        if (span.innerText.includes("Reels")) {
            const parent = span.closest("div.x1qughib");
            parent.style.display = "none";

            console.log("Hidden the Top Reels Section");

            return true;
        }
    }

    return false;
}

(function () {
    "use strict";
    const interval1 = setInterval(() => {
        if (hideReelsSection()) clearInterval(interval1);
    }, 2000);
})();

(function () {
    "use strict";
    const interval2 = setInterval(() => {
        if (hideReelsTopSection()) clearInterval(interval2);
    }, 2000);
})();

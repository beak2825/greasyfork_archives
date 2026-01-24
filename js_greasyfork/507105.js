// ==UserScript==
// @name         RA-See More
// @namespace    https://metalsnake.space/
// @version      0.6.3
// @description  Clicks the "see more" button on the user and game page
// @author       MetalSnake
// @match        *://retroachievements.org/*
// @icon         https://static.retroachievements.org/assets/images/favicon.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507105/RA-See%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/507105/RA-See%20More.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGETS = ["see more"];
    let lastUrl = location.href;

    function clickButton() {
        const buttons = document.querySelectorAll("button");

        for (const button of buttons) {
            const text = button.innerText.trim().toLowerCase();

            if (TARGETS.includes(text)) {
                button.click();
                return true;
            }
        }
        return false;
    }

    function onUrlChange() {
        // kleiner Delay, damit der neue DOM aufgebaut werden kann
        setTimeout(clickButton, 50);
    }

    //// Initialer Seitenaufruf
    clickButton();
     setTimeout(() => {
        clickButton();
    }, 100);

    // pushState / replaceState hooken
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            onUrlChange();
        }
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            onUrlChange();
        }
    };

    // Browser zurück / vor
    window.addEventListener('popstate', () => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            onUrlChange();
        }
    });

})();

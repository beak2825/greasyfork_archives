// ==UserScript==
// @name         Tinder Unblur
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Unblur Tinder teaser images
// @author       You
// @match        https://tinder.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/503780/Tinder%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/503780/Tinder%20Unblur.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    }

    async function unblur() {
        const teasers = await fetch("https://api.gotinder.com/v2/fast-match/teasers", {
            headers: {
                "X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"),
                platform: "android",
            },
        })
        .then((res) => res.json())
        .then((res) => res.data.results);

        const teaserEls = document.querySelectorAll(
            ".Expand.enterAnimationContainer > div:nth-child(1)"
        );

        // Check if the length of teaserEls matches teasers array length
        teasers.forEach((teaser, index) => {
            const teaserEl = teaserEls[index];
            
            // Ensure teaserEl exists before trying to modify it
            if (teaserEl) {
                const teaserImage = `https://preview.gotinder.com/${teaser.user._id}/original_${teaser.user.photos[0].id}.jpeg`;
                teaserEl.style.backgroundImage = `url(${teaserImage})`;
            } else {
                console.warn(`No matching element for teaser at index ${index}`);
            }
        });
    }

    // Wait for the elements to be present before executing unblur
    waitForElement(".Expand.enterAnimationContainer > div:nth-child(1)", unblur);

})();

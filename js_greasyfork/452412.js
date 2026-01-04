// ==UserScript==
// @name         Netflix Skip Intro
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Skips the intro and outro
// @author       Preckrasno, Kavoye
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452412/Netflix%20Skip%20Intro.user.js
// @updateURL https://update.greasyfork.org/scripts/452412/Netflix%20Skip%20Intro.meta.js
// ==/UserScript==

const targetNode = document;
const config = { childList: true, subtree: true };

const callback = function(mutationsList) {

    for(let mutation of mutationsList) {

        let introLabel = "ltr-1mjzmhv"; // 1.0.2

        // Try finding the skip intro button using the label first.
        let skipButton = document.querySelector(`.button-primary.watch-video--skip-content-button.medium.hasLabel.${introLabel}`);

        // If not found, try without the label.
        if (!skipButton) {
            skipButton = document.querySelector('.button-primary.watch-video--skip-content-button.medium.hasLabel');
        }

        if (skipButton) {
            skipButton.click();
        }

        // Now, try finding the next episode button
        let nextButton = document.querySelector('[data-uia="next-episode-seamless-button"], [data-uia="next-episode-seamless-button-draining"]');

        if (nextButton) {
            nextButton.click();
        }
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

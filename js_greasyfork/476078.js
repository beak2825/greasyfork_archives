// ==UserScript==
// @name         Netflix Skip Intro Automation
// @namespace    https://www.netflix.com
// @version      1.0
// @description  This script automatically clicks the "Skip Intro" button for Netflix streams as soon as it appears.
// @license      MIT
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476078/Netflix%20Skip%20Intro%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/476078/Netflix%20Skip%20Intro%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoClickSkipIntroButton() {
        const button = document.querySelector('[data-uia="player-skip-intro"]');
        if (button) {
            button.click();
        }
    }

    function handleMutation(mutationsList, observer) {
        autoClickSkipIntroButton();
    }

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    // Start observing as soon as the page loads
    window.addEventListener('load', () => {
        autoClickSkipIntroButton();
    });
})();

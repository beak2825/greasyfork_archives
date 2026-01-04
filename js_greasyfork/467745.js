// ==UserScript==
// @name         Netflix Auto Skip Intro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click the Skip Intro button on Netflix
// @author       Rusty
// @match        https://www.netflix.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467745/Netflix%20Auto%20Skip%20Intro.user.js
// @updateURL https://update.greasyfork.org/scripts/467745/Netflix%20Auto%20Skip%20Intro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkForSkipButton = () => {
        const skipIntroButton = document.querySelector('[data-uia="player-skip-intro"]');
        if (skipIntroButton) {
            skipIntroButton.click();
        }
    }

    setInterval(checkForSkipButton, 1000); // Check every second
})();

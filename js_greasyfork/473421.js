// ==UserScript==
// @name         AnkiWeb hide Hard & Easy answer buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Literally never used these..
// @author       ithelor
// @match        https://ankiuser.net/study
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473421/AnkiWeb%20hide%20Hard%20%20Easy%20answer%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/473421/AnkiWeb%20hide%20Hard%20%20Easy%20answer%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver((mutationsList) => mutationsList.forEach(({ type }) => {
        if (type === "childList") {
            const answerButtons = document.getElementById('ansarea').children.item(0).children;

            if (answerButtons.length < 4) {
                return
            }

            const hardButton = answerButtons.item(1);
            const easyButton = answerButtons.item(3);

            hardButton.remove();
            easyButton.remove();
        }
    })).observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
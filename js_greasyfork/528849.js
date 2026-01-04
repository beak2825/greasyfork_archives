// ==UserScript==
// @name        w3schools - Navigate to Next/Previous section using arrow keys!
// @namespace   Violentmonkey Scripts
// @match       https://www.w3schools.com/*/*
// @grant       none
// @version     1.2
// @author      AvinashReddy3108 (assisted by ChatGPT)
// @license     WTFPL
// @description Use the arrow keys to quickly navigate to the next or previous sections of w3schools.com tutorials ;)
// @downloadURL https://update.greasyfork.org/scripts/528849/w3schools%20-%20Navigate%20to%20NextPrevious%20section%20using%20arrow%20keys%21.user.js
// @updateURL https://update.greasyfork.org/scripts/528849/w3schools%20-%20Navigate%20to%20NextPrevious%20section%20using%20arrow%20keys%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('keydown', function (event) {
        // We don't want to bother you when you're filling a form or typing a large text
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
            return;
        }

        let container = document.querySelector("div.w3-clear.nextprev");
        if (!container) {
            return;
        }

        let prevButton = container.querySelector("a.w3-left.w3-btn");
        let nextButton = container.querySelector("a.w3-right.w3-btn");

        if (event.key === 'ArrowLeft' && prevButton) {
            // Prevent going away to the home page when pressing the left key at the first section.
            if (prevButton.textContent.trim() !== "❮ Home") {
                window.location.href = prevButton.href;
            }
        } else if (event.key === 'ArrowRight' && nextButton) {
            // We don't want to accidentally go into any external sites using the sneaky "Next" button.
            // ex: Certification exams, etc..
            let currentHost = window.location.hostname;
            let nextHost = new URL(nextButton.href, window.location.href).hostname;

            if (currentHost === nextHost) {
                window.location.href = nextButton.href;
            }
        }
    });
})();

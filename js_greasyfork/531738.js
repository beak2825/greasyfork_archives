// ==UserScript==
// @name         Jenkins - Approve Click
// @namespace    http://tampermonkey.net/
// @version      2025-04-02
// @description  Automates environment selection, discards changes, and approves for specific environments.
// @match        https://jenkins.cmh.platform-cicd.evinternal.net/*/console
// @grant        GM_log
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531738/Jenkins%20-%20Approve%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/531738/Jenkins%20-%20Approve%20Click.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_log("Auto-Environment-Clicker script running...");

    function waitForAndClickSpan() {
        const targetText = "Approve change sets deployment to test? (See job description)\n";

        const intervalId = setInterval(() => {
            const targetSpan = findSpanByTextContent(targetText);

            if (targetSpan && targetSpan.children && targetSpan.children[0]) {
                console.log("Found span and clicking...");
                targetSpan.children[0].click();
                clearInterval(intervalId); // Stop the interval
            } else {
                console.log("Looking for span...");
            }
        }, 1000); // Check every 1 second
    }

    function findSpanByTextContent(text) {
        const allSpans = document.querySelectorAll('span');
        for (const span of allSpans) {
            if (span.textContent.startsWith(text)) {
                return span;
            }
        }
        return null;
    }

    waitForAndClickSpan();

})();
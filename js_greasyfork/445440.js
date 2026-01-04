// ==UserScript==
// @name         showLetterCounts
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Display letter count of Redactle-redacted words
// @author       gauss256
// @match        https://www.redactle.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redactle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445440/showLetterCounts.user.js
// @updateURL https://update.greasyfork.org/scripts/445440/showLetterCounts.meta.js
// ==/UserScript==

/* global $ */
/* jshint esversion:6 */

(function () {
    'use strict';

    // Wait up to 5 s for the page to be complete.
    var i = 0;
    var redacts = [];
    var maxLoopCount = 50;
    var delayPerLoop = 100;
    function waitForPageCompletion() {
        setTimeout(function () {
            redacts = document.getElementsByClassName("baffled");
            if (redacts.length == 0) { // not ready yet
                if (i < maxLoopCount) {
                    i++;
                    waitForPageCompletion(); // wait some more
                }
                else {
                    console.log(`Redacted not complete after ${i * delayPerLoop} ms`);
                }
            }
            else { // now it's ready
                console.log(`Redacted complete after ${i * delayPerLoop} ms`);
                modifyPage();
            }
        }, delayPerLoop);
    }
    waitForPageCompletion();

    function modifyPage() {
        redacts = document.getElementsByClassName("baffled");
        for (let i = 0; i < redacts.length; i++) {
            let redact = redacts[i];
            let count = redact.innerHTML.length;
            let idxStart = count.toString().length;
            let ihOld = redact.innerHTML.substring(idxStart);
            let ihNew = `<span style="color: #606060; font-style: normal">${count}</span>${ihOld}`;
            redact.innerHTML = ihNew;
        }

        // Display letter count to the right of the userGuess input field
        // https://www.reddit.com/r/Redactle/comments/uui6kg/redactle_count_display
        $('#inGrp').append('<div class="mx-4" style="font-size: 1.25rem;" id="guessCount"></div>');
        $('#userGuess').keyup(function () {
            $('#guessCount').text($(this).val().length > 0 ? $(this).val().length : '');
        });
    }
})();
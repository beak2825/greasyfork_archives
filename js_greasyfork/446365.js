// ==UserScript==
// @name         showHoverCounts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display letter count of words on hover
// @author       gauss256
// @match        https://www.redactle.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redactle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446365/showHoverCounts.user.js
// @updateURL https://update.greasyfork.org/scripts/446365/showHoverCounts.meta.js
// ==/UserScript==

/* global $ */
/* jshint esversion:6 */

(function () {
    'use strict';

    const hoverOnly = true; // only show counts when hovering over a word
    let backgroundColor; // will be read from completed page
    let foregroundColor = '#606060';

    // Change display style when mouse enters element
    function attachMouseEnterEvents() {
        $('.baffled').mouseenter(function () {
            debugger;
            $(this).children('.count').css('color', foregroundColor);
        });
    }

    // Change display style when mouse leaves element
    function attachMouseLeaveEvents() {
        $('.baffled').mouseleave(function () {
            $(this).children('.count').css('color', backgroundColor);
        });
    }

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
                if (hoverOnly) {
                    attachMouseEnterEvents();
                    attachMouseLeaveEvents();
                }
            }
        }, delayPerLoop);
    }
    waitForPageCompletion();

    function modifyPage() {
        redacts = document.getElementsByClassName("baffled");
        backgroundColor = $(redacts[0]).css('background-color');
        let ihStyle;
        if (hoverOnly) {
            ihStyle = `"color: ${backgroundColor}; font-style: normal;"`;
        }
        else {
            ihStyle = `"color: ${foregroundColor}; font-style: normal;"`;
        }
        for (let i = 0; i < redacts.length; i++) {
            let redact = redacts[i];
            let count = redact.innerHTML.length;
            let idxStart = count.toString().length;
            let ihOld = redact.innerHTML.substring(idxStart);
            let ihNew = `<span class="count" style=${ihStyle}>${count}</span>${ihOld}`;
            redact.innerHTML = ihNew;
        }
    }

    // Display letter count to the right of the userGuess input field
    // https://www.reddit.com/r/Redactle/comments/uui6kg/redactle_count_display
    $('#inGrp').append('<div class="mx-4" style="font-size: 1.25rem;" id="guessCount"></div>');
    $('#userGuess').keyup(function () {
        $('#guessCount').text($(this).val().length > 0 ? $(this).val().length : '');
    });

})();

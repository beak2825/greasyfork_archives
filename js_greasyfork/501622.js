// ==UserScript==
// @name         Close allow-Ad-dialog on westca.com
// @namespace    http://tampermonkey.net/
// @version      2024-07-23
// @description  Automatically close the allow-ad-dialog everytime it shows up
// @author       nessus
// @match        https://www.westca.com/Forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=westca.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501622/Close%20allow-Ad-dialog%20on%20westcacom.user.js
// @updateURL https://update.greasyfork.org/scripts/501622/Close%20allow-Ad-dialog%20on%20westcacom.meta.js
// ==/UserScript==


/*
1. wait for each page finish loading
2. find class="fc-close fc-icon-button"
3. click to by-pass it!
*/



function runWhenReady(readySelector) {
    var numAttempts = 0;
    var tryNow = function() {
        var elem = document.querySelector(readySelector);
        if (elem) {
            elem.click();
        } else {
            numAttempts++;
            if (numAttempts >= 9999) {
                console.warn('Giving up after 9999 attempts. Could not find: ' + readySelector);
            } else {
                setTimeout(tryNow, 10);
            }
        }
    };
    tryNow();
}

runWhenReady('.fc-close.fc-icon-button')
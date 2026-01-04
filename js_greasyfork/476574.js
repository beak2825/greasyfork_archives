// ==UserScript==
// @name         Next chapter in mangalib.me automatically
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click next chapter in mangalib.me automatically
// @author       Killua Kill
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangalib.me
// @match        https://mangalib.me/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476574/Next%20chapter%20in%20mangalibme%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/476574/Next%20chapter%20in%20mangalibme%20automatically.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the button is visible on the screen
    function isButtonVisible() {
        var button = document.querySelectorAll('.reader-next__btn')[1];
        var rect = button.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to click the button
    function clickButton() {
        var button = document.querySelectorAll('.reader-next__btn')[1];
        button.click();
    }

    // Check if the button is visible on the screen and click it
    if (isButtonVisible()) {
        clickButton();
    } else {
        // If the button is not visible, wait for it to appear and then click it
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList' && isButtonVisible()) {
                    clickButton();
                    observer.disconnect();
                    break;
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();

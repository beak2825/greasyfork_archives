// ==UserScript==
// @name         New user AliExpress coupon popup closer.
// @namespace    https://44r0n.cc
// @version      1.0
// @description  This just closes the AliExpress coupon popup that happens on every page load while a user is not logged in.
// @author       44R0N7
// @match        https://www.aliexpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407494/New%20user%20AliExpress%20coupon%20popup%20closer.user.js
// @updateURL https://update.greasyfork.org/scripts/407494/New%20user%20AliExpress%20coupon%20popup%20closer.meta.js
// ==/UserScript==

let calledCount = 0; // Keep track of how many times the function is called. Used later to end the loop.
const retryTimeout = 125; // The time in miliseconds to wait before trying to close it again.
const secondsToTry = 5; // The number of seconds to continue trying to close the popup.

// These are the selectors for the close button element. It's different on the home page than other pages.
const homepageSelector = 'body > div.ui-window.ui-window-normal.ui-window-transition.ui-newuser-layer-dialog > div > div > a';
const otherPagesSelector = 'body > div.next-overlay-wrapper.opened > div.next-overlay-inner.next-dialog-container > div > a';

function clickCloseButton() {
    'use strict';
    ++calledCount; // Increase the counter by 1 because we don't want an infinite loop on pages where this button will never show and while the user is logged in.

    // Get the element, if it exists yet.
    let closeButton = document.querySelector(homepageSelector) ||
        document.querySelector(otherPagesSelector);

    // If the button was found, close it.
    if (closeButton) {
        closeButton.click();
    } else if (calledCount < (1000 / retryTimeout) * secondsToTry) {
        // Retry until it's found for a maximum of secondsToTry seconds. This is in case the element has not yet been loaded on the page. This was a problem for me, maybe not for everyone.
        window.setTimeout(clickCloseButton, retryTimeout);
    }
}

clickCloseButton();
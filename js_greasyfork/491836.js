// ==UserScript==
// @name         Click Twitter Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clicks on a Twitter button with a specific class when it appears on the page
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491836/Click%20Twitter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/491836/Click%20Twitter%20Button.meta.js
// ==/UserScript==

// Replace ".example-class" with the actual class name of the element to click
var targetClass = ".css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-173mn98.r-1s2bzr4.r-15ysp7h.r-4wgw6l.r-ymttw5.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l,.css-1rynq56.r-bcqeeo.r-qvutc0.r-37j5jr.r-a023e6.r-rjixqe.r-16dba41.r-1loqt21";

// Create a MutationObserver to detect when the element appears on the screen
var observer = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            var elements = document.querySelectorAll(targetClass);
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].textContent === "Show") {
                    elements[i].click();
                }
            }
        }
    }
});

// Start observing the document for changes
observer.observe(document.body, { childList: true, subtree: true });
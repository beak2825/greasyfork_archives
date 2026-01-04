// ==UserScript==
// @name         Jazeera Sphinx Flights Warning
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Warns you about shitty Sphinx flights on Jazeera Airways
// @author       Unbroken
// @icon         https://www.google.com/s2/favicons?domain=jazeeraairways.com
// @match        https://booking.jazeeraairways.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/499690/Jazeera%20Sphinx%20Flights%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/499690/Jazeera%20Sphinx%20Flights%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function colorize(){
        var spans = document.getElementsByClassName('place-name');

        for (var i = 0; i < spans.length; ++i) {
            if (spans[i].textContent.includes('Sphinx')){
                var div = spans[i].closest('div.flight-search-result-item');
                div.style.backgroundColor = 'lightpink';
            }
        }
    }

    // MutationObserver to react to DOM changes
    const observer = new MutationObserver((mutations) => {
        colorize(); // Attempt to colorize the div on each DOM change
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    colorize();
})();
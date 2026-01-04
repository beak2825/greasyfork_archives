// ==UserScript==
// @name         Google Docs/Slides Always Visible Turn In Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keeps the "Turn in" button always visible on Google Docs and Slides through Google Classroom.
// @author       You
// @match        *://docs.google.com/*
// @match        *://slides.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516768/Google%20DocsSlides%20Always%20Visible%20Turn%20In%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/516768/Google%20DocsSlides%20Always%20Visible%20Turn%20In%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function makeTurnInButtonVisible() {
        // Check for the button using a query selector
        let turnInButton = document.querySelector('[aria-label="Turn in"]');

        if (turnInButton) {
            // Ensure the button is always visible
            turnInButton.style.display = "inline-block";
            turnInButton.style.visibility = "visible";
            turnInButton.style.position = "fixed";
            turnInButton.style.top = "10px";
            turnInButton.style.right = "10px";
            turnInButton.style.zIndex = "1000";
        }
    }

    // Run the function initially and set an interval to keep checking in case of DOM updates
    makeTurnInButtonVisible();
    setInterval(makeTurnInButtonVisible, 2000);
})();

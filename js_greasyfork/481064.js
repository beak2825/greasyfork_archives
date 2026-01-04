// ==UserScript==
// @name         mycourses-utils
// @namespace    Monkey Scripts
// @description  Quality of life improvements for RIT MyCourses
// @author       Ethan Logue
// @version      1.1
// @match        https://mycourses.rit.edu/d2l/home
// @match        https://mycourses.rit.edu/d2l/home/*
// @exclude      https://mycourses.rit.edu/d2l/lms/dropbox/*
// @icon         https://mycourses.rit.edu/d2l/lp/web/faviconView?variant=0&version=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481064/mycourses-utils.user.js
// @updateURL https://update.greasyfork.org/scripts/481064/mycourses-utils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // custom css rules
    var style = document.createElement('style');
    style.innerHTML = `
        /* container holding the original content */
        .d2l-datalist-item-content > div {
            padding-top: 8px !important;
        }

        /* link tag holding the span */
        .d2l-datalist-item-actioncontrol {
            padding: 0 10px !important;
            margin-left: 1rem !important;
            color: var(--d2l-color-celestine) !important;
        }

        /* hover state of the link tag */
        .d2l-datalist-item-actioncontrol:hover {
            color: var(--d2l-color-celestine-minus-1) !important;
            text-decoration: underline !important;
        }

        /* span tag withing the link thats usually hidden */
        .d2l-offscreen {
            position: relative !important;
            left: 0 !important;
        }
    `;

    document.head.appendChild(style);

    // sidebar events seem to load asynchronously so this gives it a second to load 
    // and tries 10 times to ensure slow connections can still be handled
    window.onload = function() {
        var maxAttempts = 10;
        var attempts = 0;
        var intervalTime = 1000;

        var interval = setInterval(function() {
            attempts++;
            console.log('Checking for element: ' + attempts);

            // gets the span tag that holds the text for the event
            var viewEvents = document.querySelectorAll('span.d2l-offscreen');
            if (viewEvents.length > 0) {
                clearInterval(interval); // clear the interval once the element is found (currently doesn't clear it for some reason)
                viewEvents.forEach(function(event) {
                    event.textContent = 'Open in New Tab';
                    event.parentElement.target = '_blank';
                });
            } else if (attempts >= maxAttempts) {
                console.log('Element not found after ' + attempts + ' attempts.');
                clearInterval(interval); // stops checking when maximum attempts reached
            }
        }, intervalTime);
    }

})();

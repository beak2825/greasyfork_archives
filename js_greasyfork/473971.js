// ==UserScript==
// @name         justpaste.it skip redirect message
// @namespace    skyline1
// @version      0.1
// @description  Skips the "you are going to leave justpaste.it
// @author       skyline1
// @match        https://justpaste.it/redirect/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473971/justpasteit%20skip%20redirect%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/473971/justpasteit%20skip%20redirect%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to find and click on the element
    function clickElement() {
        const targetClass = "redirectLink redirectLinkBold";
        const elements = document.getElementsByClassName(targetClass);

        if (elements.length > 0) {
            elements[0].click(); // Click the first element with the specified class
            console.log("Clicked on the element.");
        } else {
            console.log("Element not found.");
        }
    }

    // Retry every 1 second
    function retryClick() {
        setInterval(clickElement, 1000);
    }

    // Start the retry process
    retryClick();
})();

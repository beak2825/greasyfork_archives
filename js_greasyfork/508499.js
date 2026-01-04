// ==UserScript==
// @name         Krea Minute Increase
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Increase the time limit on Krea from 3 minutes to 120 minutes
// @author       You
// @match        *://*.krea.ai/*  // Adjust the domain to match the Krea website
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508499/Krea%20Minute%20Increase.user.js
// @updateURL https://update.greasyfork.org/scripts/508499/Krea%20Minute%20Increase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A function to find and modify minute values from 3 to 120
    function modifyMinutes() {
        // You may need to adjust this selector based on the actual structure of the Krea website
        let minuteElements = document.querySelectorAll("span, p, div"); // Adjust selectors to match minute elements
        minuteElements.forEach(el => {
            if (el.innerText.includes('3 minutes')) {
                el.innerText = el.innerText.replace('3 minutes', '120 minutes');
            }
        });
    }

    // Run the function initially and set an interval to check for dynamic changes on the page
    modifyMinutes();
    setInterval(modifyMinutes, 2000); // Recheck every 2 seconds to ensure dynamic content is updated
})();

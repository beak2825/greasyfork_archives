// ==UserScript==
// @name         cybertyrant.com -and others- link shortener auto-skipper
// @version      1.2
// @description  Auto-click the buttons and redirect to the download link.
// @author       Rust1667
// @match        *://cybertyrant.com/*
// @match        *://profitshort.com/*
// @match        *://courselinkfree.us/*
// @match        *://technorozen.com/*
// @match        *://hubdrive.me/*
// @match        *://bestadvise4u.com/*
// @match        *://newztalkies.com/*
// @match        *://10desires.org/*
// @match        *://theapknews.shop/*
// @match        *://aiotechnical.com/*
// @match        *://cryptonewzhub.com/*
// @match        *://trendzguruji.me/*
// @match        *://techvybes.com/*
// @match        *://wizitales.com/*
// @match        *://101desires.com/*
// @match        *://gdspike.com/*
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485473/cybertyrantcom%20-and%20others-%20link%20shortener%20auto-skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/485473/cybertyrantcom%20-and%20others-%20link%20shortener%20auto-skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable to store the interval ID
    var intervalId;

    // Variable to track whether the link is found
    var linkFound = false;

    // Function to check and redirect, and simulate a click if 'rd_btn' is found
    function checkRedirectAndClick() {
        // If the link is found, stop the interval
        if (linkFound) {
            clearInterval(intervalId);
            return;
        }

        // Find the element with class 'rd_btn'
        var rdBtnElement = document.querySelector('.rd_btn');

        // Check if the element is found and contains an href attribute
        if (rdBtnElement && rdBtnElement.href) {
            var rdBtnHref = rdBtnElement.href;

            if (rdBtnHref.includes("/?re=")) {
              // Show the link in an alert
              alert("Download link: " + rdBtnHref);
            }

            // Redirect the current window to the href link
            window.location.href = rdBtnHref;

            // Set the linkFound variable to true
            linkFound = true;

            // Stop the interval once the link is found
            clearInterval(intervalId);
        } else if (rdBtnElement) {
            console.log("trying to click...");
            // Simulate a click on the 'rd_btn' element
            rdBtnElement.click();
        }
    }

    // Start the interval and store the interval ID
    intervalId = setInterval(checkRedirectAndClick, 1000); // Check every 1000 milliseconds (1 second)
})();

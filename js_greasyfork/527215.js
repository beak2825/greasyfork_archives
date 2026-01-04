// ==UserScript==
// @name         Auto Reload if ivac login page Found
// @namespace    https://payment.ivacbd.com
// @version      2.0
// @description  Make a GET AJAX request every 20 seconds and reload if "mobile_no" input is found
// @match        *://payment.ivacbd.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527215/Auto%20Reload%20if%20ivac%20login%20page%20Found.user.js
// @updateURL https://update.greasyfork.org/scripts/527215/Auto%20Reload%20if%20ivac%20login%20page%20Found.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function checkForMobileNo() {
        // Create an AJAX request
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://payment.ivacbd.com", true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let responseText = xhr.responseText;

                // Check if the response contains an input field with name="mobile_no"
                if (responseText.includes('name="mobile_no"')) {
                    console.log("Mobile number input found in AJAX response! Reloading the page...");
                    location.reload();  // Reload the page
                } else {
                    console.log("Mobile number input not found. Checking again in 20 seconds...");
                }
            }
        };

        xhr.send();
    }

    // Check every 20 seconds

    setInterval(checkForMobileNo, 360000);
})();

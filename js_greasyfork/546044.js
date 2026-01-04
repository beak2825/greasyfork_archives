// ==UserScript==
// @name         Unbooked Version Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add an 'Unbooked Version' button to booked car view pages for Sales Manager
// @author       MuftyPro
// @match        https://salsabeelcars.site/index.php/sales_manager/car_booked_view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546044/Unbooked%20Version%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/546044/Unbooked%20Version%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the full URL
    let fullUrl = window.location.href;

    // Extract the last part of the URL (car ID)
    let urlParts = fullUrl.split('/');
    let last_part = urlParts[urlParts.length - 1];

    // Create the button
    let unbookedButton = document.createElement('button');
    unbookedButton.innerText = 'Unbooked Version';
    unbookedButton.style.position = 'fixed';
    unbookedButton.style.top = '60px';       // slightly lower
    unbookedButton.style.right = '10px';
    unbookedButton.style.padding = '3px 8px';
    unbookedButton.style.background = 'red';
    unbookedButton.style.color = 'white';
    unbookedButton.style.border = 'none';
    unbookedButton.style.borderRadius = '3px';
    unbookedButton.style.cursor = 'pointer';
    unbookedButton.style.zIndex = '9999';     // ensure top layer
    unbookedButton.style.fontSize = '12px';

    // Redirect to the car_view page on button click
    unbookedButton.onclick = function() {
        window.location.href = `https://salsabeelcars.site/index.php/sales_manager/car_view/${last_part}`;
    };

    // Append the button to the page
    document.body.appendChild(unbookedButton);
})();

// ==UserScript==
// @name         Displaycase Value
// @namespace    com.torn.GamingAnonymous
// @version      1.1
// @description  Display the total value of items in the displaycase
// @author       GamingAnonymous
// @match        *.torn.com/displaycase.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32177/Displaycase%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/32177/Displaycase%20Value.meta.js
// ==/UserScript==

// Your API Key
var apiKey = "yourAPIKey";
var worthTotal = 0;

(function() {
    'use strict';
    console.log("API Key: " + apiKey);

    // get the ID of the displaycase you are currently viewing
    let currentPage = window.location.href;
    let urlElements = currentPage.split('/');
    let currentPageUserID = urlElements[urlElements.length - 1];
    console.log(currentPageUserID);

    // Get the information from the API for this displaycase
    let url = 'https://api.torn.com/user/' + currentPageUserID + '?selections=display&key=' + apiKey;
    fetch(url)
        .then(res => res.json())
        .then((out) => {
        for(let i = 0; i < out.display.length; i++)
        {
            // Add up the worth of the items
            worthTotal += out.display[i].market_price;
        }

        // Display the worth formatted with commas
        window.alert("This display case is worth: $" + worthTotal.toLocaleString(undefined));
    })
    .catch(err => console.error(err));
})();
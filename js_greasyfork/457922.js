// ==UserScript==
// @name         AWS Console - Show AWS Account Name
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @version      1.1
// @description  Shows AWS account name in upper right of menu bar for a quick view of current context.
// @author       Bernd VanSkiver
// @namespace    https://greasyfork.org/users/1009418
// @downloadURL https://update.greasyfork.org/scripts/457922/AWS%20Console%20-%20Show%20AWS%20Account%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/457922/AWS%20Console%20-%20Show%20AWS%20Account%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check and update the account name
    function updateAccountName() {
        let accountrolespan = document.querySelector("#awsc-navigation__more-menu--list li:last-child div button span span:first-child");

        // Check if the element exists and if its title starts with "AWSReservedSSO"
        if (accountrolespan && accountrolespan.getAttribute("title").startsWith("AWSReservedSSO")) {
            accountrolespan.innerHTML += " @ " + accountrolespan.getAttribute("title").split(" @ ")[1];
            clearInterval(intervalId); // Stop checking once the update is applied
        }
    }

    // Set an interval to check for the element every second
    let intervalId = setInterval(updateAccountName, 1000);
})();
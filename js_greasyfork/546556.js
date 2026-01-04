// ==UserScript==
// @name         Auto Close Inventory Tab
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically close the current inventory tab based on user-defined timer or when the inventory page expired
// @author       Lucky11
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546556/Auto%20Close%20Inventory%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/546556/Auto%20Close%20Inventory%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const closeEvenIfNotExpired = false;
    const closeAfterSeconds = 10;
    const closeDelaySeconds = 3; // Add a delay before closing the window waits 3 seconds before closing the tab

    // Function to focus on Dead Frontier game
    function launchDeadFrontier() {
        window.location.href = "deadfrontier:";
    }

    // Function to modify the Done button inside inventory to not only close the game but also focus on game when user clicks it.
    function modifyButton() {
        const okButton = document.getElementById('OkButton');
        if (okButton) {
            okButton.parentElement.onclick = function() {
                launchDeadFrontier();
            };
        }
    }

    function checkForExpiredMessage() {
        if (document.body.innerText.includes("This inventory page has expired.")) {
            console.log("attempted to close window: inventory page has expired");
            setTimeout(() => {
                window.close(); // Close the window after the delay
            }, closeDelaySeconds * 1000);
        }
    }

    function checkForMissingElements() {
        const invHolder = document.getElementById("inventoryholder");
        if (!invHolder || !invHolder.querySelector("#invController")) {
            console.log("attempted to close window: inventoryholder or invController is missing");
            setTimeout(() => {
                window.close(); // Close the window after the delay
            }, closeDelaySeconds * 1000);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            checkForMissingElements();
            checkForExpiredMessage();
            modifyButton();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        checkForMissingElements();
        checkForExpiredMessage();
        modifyButton();
    }, 5000);

    if (closeEvenIfNotExpired) {
        setTimeout(() => {
            setTimeout(() => {
                window.close();
            }, closeDelaySeconds * 1000); // Close after the delay
        }, closeAfterSeconds * 1000);
    }
})();

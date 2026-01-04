// ==UserScript==
// @name        New script *.tu.edu.np
// @namespace   Violentmonkey Scripts
// @match       https://*tu.edu.np/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/16/2024, 1:02:56 AM
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490817/New%20script%20%2Atuedunp.user.js
// @updateURL https://update.greasyfork.org/scripts/490817/New%20script%20%2Atuedunp.meta.js
// ==/UserScript==

// Function to click on all elements with IDs in the format main-modal-X with a delay of 2 seconds
function clickOnMainModals() {
    // Get all elements matching the pattern
    let mainModals = document.querySelectorAll('[id^="main-modal-"]');

    // Loop through each matching element and click on it with a delay of 2 seconds
    mainModals.forEach((modal, index) => {
        let closeButton = modal.querySelector('button.btn-close');
            if (closeButton) {
              setTimeout(() => {
                closeButton.click();
              }, 0);
            }
    });
}

clickOnMainModals();


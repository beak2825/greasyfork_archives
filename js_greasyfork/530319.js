// ==UserScript==
// @name         Change Header Color for The_Head
// @namespace    https://example.com/
// @version      1.1
// @description  Change header color to pink if the user is The_Head
// @author       Daeron
// @match        https://www.fortressoflies.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530319/Change%20Header%20Color%20for%20The_Head.user.js
// @updateURL https://update.greasyfork.org/scripts/530319/Change%20Header%20Color%20for%20The_Head.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Use a MutationObserver to ensure dynamic content is detected
    const observer = new MutationObserver(() => {
        // Select the profile picture of the current user
        const currentUserProfile = document.querySelector('#current-user img.avatar[title="The_Head"]');

        if (currentUserProfile) {
            // If the current user is "The_Head", select headers
            const headers = document.querySelectorAll('.d-header.clearfix');
            headers.forEach(header => {
                header.style.backgroundColor = 'pink'; // Change the header background color to pink
            });
            console.log('Header color changed to pink for LadyGaga.');

            // Disconnect the observer after applying the change
            observer.disconnect();
        } else {
            console.log('Current user is not The_Head. No changes applied.');
        }
    });

    // Start observing the DOM for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();

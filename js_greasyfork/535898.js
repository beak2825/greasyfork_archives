// ==UserScript==
// @name         F*** Reddit
// @namespace    Me
// @version      1.2
// @description  Replaces Reddit content and shows time difference from the userscript installation date
// @author       GoogleMaster662
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535898/F%2A%2A%2A%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/535898/F%2A%2A%2A%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate the time difference from the installation date
    function calculateTimeDifference(installDate) {
        const currentDate = new Date();
        
        // Calculate the difference in milliseconds
        const timeDifference = currentDate - installDate;
        
        // Convert milliseconds to days, hours, and minutes
        const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const totalMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        return `${totalDays} days, ${totalHours} hours, and ${totalMinutes} minutes ago.`;
    }

    // Function to check and save the installation date
    function getInstallDate() {
        let installDate = localStorage.getItem('userscriptInstallDate');

        if (!installDate) {
            // If the installation date is not saved yet, save it
            installDate = new Date();
            localStorage.setItem('userscriptInstallDate', installDate.toString());
        } else {
            installDate = new Date(installDate);
        }

        return installDate;
    }

    // Replace the content of the Reddit page
    function replaceRedditContent() {
        const installDate = getInstallDate(); // Get the install date from localStorage
        const timeDifference = calculateTimeDifference(installDate); // Calculate time since installation

        // Replace the entire body content of the Reddit page
        document.body.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h1>You are stopping your Reddit addiction or you're studying, remember?</h1>
                <p>You stopped your Reddit addiction on ${new Date(installDate).toLocaleDateString()}</p>
                <p>Time since you stopped using Reddit ${timeDifference}.</p>
                <p>This page is now completely replaced.</p>
            </div>
        `;
    }

    // Call the function to replace content when the page loads
    replaceRedditContent();

})();

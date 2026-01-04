// ==UserScript==
// @name         Random Target Finder
// @version      1.0
// @description  Adds a button to the top of the page that opens a new tab with an easy target.
// @author       TORN
// @match        https://www.torn.com/*
// @namespace https://greasyfork.org/users/1154608
// @downloadURL https://update.greasyfork.org/scripts/478764/Random%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/478764/Random%20Target%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define requirements
    // These are user ID ranges that should cover players between 15 and 400 days old
    const minID = 2800000;
    const maxID = 3100000;
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Create a button element
    const button = document.createElement('button');
    button.innerHTML = 'Chain';
    button.style.position = 'fixed';
    //button.style.top = '10px';
    //button.style.right = '10px';
    button.style.top = '27%'; // Adjusted to center vertically
    button.style.right = '0%'; // Center horizontally
    //button.style.transform = 'translate(-50%, -50%)'; // Center the button properly
    button.style.zIndex = '9999';

    // Add CSS styles for a green background
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '2px';
    button.style.borderRadius = '2px';
    button.style.cursor = 'pointer';

    // Add a click event listener to open Google in a new tab
    button.addEventListener('click', function() {
        let randID = getRandomNumber(minID,maxID);
        let profileLink = `https://www.torn.com/profiles.php?XID=${randID}`;
        // Comment this line and uncomment the one below it if you want the profile to open in a new tab
        window.location.href = profileLink;
        //window.open(profileLink, '_blank');
    });
    // Add the button to the page
    document.body.appendChild(button);
})();
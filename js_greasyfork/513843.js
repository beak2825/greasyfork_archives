// ==UserScript==
// @name         Random Target Finder
// @version      2.1
// @namespace    http://tampermonkey.net/
// @description  Adds a button to the top of the page that opens a new tab with an hittable target withing some boundaries.
// @author       Omanpx [1906686], Titanic_ [2968477], xlemmingx [2035104]
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513843/Random%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/513843/Random%20Target%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define requirements
    const enableApiChecks = false; // requires valid public api key if set to true - enter below
    const apiKey = ''; // public API key
    const maxXanax = 1000;
    const maxRefills = 500;
    const maxSEs = 1;

    // These are user ID ranges that will be targeted
    const minID = 1000000;
    const maxID = 3400000;
    
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function findTarget() {
        let success = false;
        let randID = getRandomNumber(minID, maxID);

        success = true;
        if (enableApiChecks) {
            const url = `https://api.torn.com/user/${randID}?selections=basic,personalstats&key=${apiKey}`;
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload(response) {
                    try {
                        const user = JSON.parse(response.responseText);

                        if (user.status.state != 'Okay') {
                            console.log(`User {$user} discarded because not Okay`);
                            success = false;
                        }
                        if (user.personalstats.xantaken > maxXanax) {
                            console.log(`User {$user} discarded because too many Xanax`);
                            success = false;
                        }
                        if (user.personalstats.refills > maxRefills) {
                            console.log(`User {$user} discarded because too many refills`);
                            success = false;
                        }
                        if (user.personalstats.statenhancersused > maxSEs) {
                            console.log(`User {$user} discarded because too many SEs`);
                            success = false;
                        }

                        if (success) {
                            openProfile(user.player_id);
                        } else {
                            setTimeout(() => findTarget(), 200); // some dalay because of api rate limit
                        }
                    } catch {
                        setTimeout(() => findTarget(), 200); // some dalay because of api rate limit
                    }

                },
                onerror() {
                    console.log(`Error loading URL: ${url}`);
                    setTimeout(() => findTarget(), 200); // some dalay because of api rate limit
                }
            });
        } else {
            openProfile(randID);
        }
    }

    function openProfile(userId) {
         // Uncomment one of the lines below, depending on what you prefer
        let profileLink = `https://www.torn.com/profiles.php?XID=${userId}`; // Profile link
        // profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`; // Attack link
        // Comment this line and uncomment the one below it if you want the profile to open in a new tab
        //window.location.href = profileLink;
        window.open(profileLink, '_blank');
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
    button.style.padding = '6px';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';

    // Add a click event listener to open Google in a new tab
    button.addEventListener('click', findTarget);

    // Add the button to the page
    document.body.appendChild(button);
})();
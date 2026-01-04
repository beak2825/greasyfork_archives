// ==UserScript==
// @name         Torn Organized Crime Status Icon
// @namespace    ReconDalek.Torn
// @version      1.1
// @description  Displays a status icon if you are in an Organized Crime
// @author       ReconDalek
// @match        https://www.torn.com/*
// @icon         https://imgur.com/pvK87It.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524332/Torn%20Organized%20Crime%20Status%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/524332/Torn%20Organized%20Crime%20Status%20Icon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CACHE_KEY = 'tornCrimeStatusCache';
    const API_KEY_KEY = 'tornApiKey';
    const API_URL = 'https://api.torn.com/v2/user/organizedcrime';

    const ICONS = {
        Recruiting: 'https://imgur.com/pvK87It.png',
        Planning: 'https://imgur.com/pvK87It.png',
        // Completed: 'https://imgur.com/pvK87It.png',
    };

    async function fetchCrimeStatus(apiKey) {
        try {
            const response = await fetch(API_URL, {
                headers: { Authorization: `ApiKey ${apiKey}` },
            });
            const data = await response.json();

            if (data.organizedCrime && data.organizedCrime.status) {
                return {
                    status: data.organizedCrime.status,
                    timestamp: Date.now(),
                };
            } else {
                console.error('Invalid API response:', data);
                return null;
            }
        } catch (error) {
            console.error('Error fetching API data:', error);
            return null;
        }
    }

    function insertIcon(status) {
        const iconURL = ICONS[status];
        if (!iconURL) {
            console.error('No icon available for status:', status);
            return;
        }

        const ulElement = document.querySelector(
            'ul.status-icons___gPkXF.big___DX94I, ul.status-icons___gPkXF.mobile___MWm2o.big___DX94I'
        );

        if (ulElement) {
            const li = document.createElement('li');
            li.style.listStyleType = 'none'; // Remove default list styling
            li.style.background = 'none'; // Ensure no background circle
            li.style.width = 'auto';
            li.style.height = 'auto';

            const a = document.createElement('a');
            a.href = 'https://www.torn.com/factions.php?step=your&type=1#/tab=crimes';

            const img = document.createElement('img');
            img.src = iconURL;
            img.alt = status;
            img.style.width = '17px'; // Adjust size to match other icons
            img.style.height = '17px'; // Adjust size to match other icons
            img.style.display = 'block';

            a.appendChild(img);
            li.appendChild(a);

            // Insert as the second-to-last element
            if (ulElement.children.length > 0) {
                ulElement.insertBefore(li, ulElement.children[ulElement.children.length - 1]);
            } else {
                ulElement.appendChild(li); // Fallback if no other elements are present
            }
        } else {
            console.error('Status icons element not found');
        }
    }

    async function main() {
        // Get API Key from localStorage or prompt the user
        let apiKey = localStorage.getItem(API_KEY_KEY);
        if (!apiKey) {
            apiKey = prompt('Please enter your Torn API key, Minimal Access Required!');
            if (apiKey) {
                localStorage.setItem(API_KEY_KEY, apiKey);
            } else {
                console.error('No API key provided.');
                return;
            }
        }

        // Retrieve cached data or fetch new data if expired
        let cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (!cachedData || Date.now() - cachedData.timestamp > 3600000) {
            cachedData = await fetchCrimeStatus(apiKey);
            if (cachedData) {
                localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
            } else {
                console.error('Failed to fetch or cache data.');
                return;
            }
        }

        // Insert the icon
        insertIcon(cachedData.status);
    }

    main();
})();
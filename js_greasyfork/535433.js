// ==UserScript==
// @name         Steam Tracker App Info
// @namespace    https://github.com/encumber
// @version      0.8
// @description  Adds app category info to the booster game selector and provides a category summary with modified art area styling.
// @author       Nitoned
// @match        https://steamcommunity.com/tradingcards/boostercreator/*
// @grant        GM_xmlhttpRequest
// @connect      steam-tracker.com
// @downloadURL https://update.greasyfork.org/scripts/535433/Steam%20Tracker%20App%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/535433/Steam%20Tracker%20App%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const boosterGameSelector = document.getElementById('booster_game_selector');
    const boosterCreatorArt = document.querySelector('.booster_creator_art'); // Get the art element by class

    if (!boosterGameSelector) {
        console.log('Booster game selector not found.');
        return;
    }

    if (!boosterCreatorArt) {
        console.log('Booster creator art element (class .booster_creator_art) not found.');
        // We can still add info to the selector, but won't have the summary location
    } else {
        // Modify the styling of the .booster_creator_art element
        boosterCreatorArt.style.right = '-50px';
        boosterCreatorArt.style.background = 'transparent';
        // You might need to adjust position if 'right' is not taking effect.
        // If its default position is static, making it relative or absolute might be necessary.
        // boosterCreatorArt.style.position = 'relative'; // Or 'absolute' depending on context
    }

    // Fetch the app list from Steam Tracker API
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://steam-tracker.com/api?action=GetAppListV3",
        onload: function(response) {
            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);

                    // Check if the parsed data is an object and has the 'removed_apps' key
                    if (data && typeof data === 'object' && data.removed_apps && Array.isArray(data.removed_apps)) {
                        const apps = data.removed_apps; // Access the array within the 'removed_apps' key
                        addAppInfoToSelector(apps);
                        if (boosterCreatorArt) {
                           createCategorySummary(apps, boosterCreatorArt); // Pass the art element
                        }
                    } else {
                        // Log the actual structure if it doesn't match
                        console.error('Steam Tracker API data not in expected format (expected object with "removed_apps" array). Received:', data);
                    }
                } catch (e) {
                    console.error('Error parsing Steam Tracker API response:', e);
                }
            } else {
                console.error('Error fetching Steam Tracker API data:', response.status, response.statusText);
            }
        },
        onerror: function(error) {
            console.error('Network error fetching Steam Tracker API data:', error);
        }
    });

    function addAppInfoToSelector(apps) {
        const appMap = new Map();
        apps.forEach(app => {
            // Ensure appid and category exist before adding to map
            if (app.appid !== undefined && app.category !== undefined) {
                 appMap.set(app.appid, app.category);
            } else {
                 console.warn('Skipping app with missing appid or category:', app);
            }
        });

        const options = boosterGameSelector.options;

        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            // Ensure option value is a valid number before converting
            if (option.value && !isNaN(option.value)) {
                const appid = parseInt(option.value, 10);

                if (appMap.has(appid)) {
                    const category = appMap.get(appid);
                    // Only append if category is not null or empty string
                    if (category) {
                        option.text += ` - ${category}`;
                    }
                }
            }
        }
    }

    // Pass the target element to this function
    function createCategorySummary(apps, targetElement) {
        const appMap = new Map();
        apps.forEach(app => {
            if (app.appid !== undefined && app.category !== undefined) {
                 appMap.set(app.appid, app.category);
            }
        });

        const options = boosterGameSelector.options;
        const categoryCounts = new Map();

        // Calculate total game count (excluding the first option which is "Select a game")
        const totalGameCount = options.length > 0 ? options.length - 1 : 0;


        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.value && !isNaN(option.value)) {
                const appid = parseInt(option.value, 10);

                if (appMap.has(appid)) {
                    const category = appMap.get(appid);
                    if (category) {
                        // Increment the count for this category
                        categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
                    }
                }
            }
        }

        // Clear the existing content of the target element
        targetElement.innerHTML = '';

        // Create the summary content
        const summaryContainer = document.createElement('div');
        summaryContainer.id = 'steam-tracker-category-summary'; // Still good to have an ID for potential future targeting
        // Apply some basic styling to match Steam
        summaryContainer.style.padding = '15px';
        summaryContainer.style.backgroundColor = 'transparent'; // Background set on the parent .booster_creator_art
        summaryContainer.style.color = '#c7d5e0'; // Light text
        summaryContainer.style.fontFamily = '"Motiva Sans", Arial, Helvetica, sans-serif';
        summaryContainer.style.fontSize = '14px';
        summaryContainer.style.height = '100%'; // Make it fill the height of the art container
        summaryContainer.style.boxSizing = 'border-box'; // Include padding in height calculation
        // Note: OverflowY is now on the summaryContainer itself since it fills the art area
        summaryContainer.style.overflowY = 'auto';


        const title = document.createElement('h3');
        title.textContent = 'Steam Tracker Category Summary';
        title.style.color = '#ffffff'; // White title
        title.style.fontSize = '16px';
        title.style.fontWeight = 'normal';
        title.style.marginBottom = '10px';
        summaryContainer.appendChild(title);

        // Add the total game count
        const totalCountElement = document.createElement('p');
        totalCountElement.textContent = `Total Games: ${totalGameCount}`;
        totalCountElement.style.marginBottom = '10px';
        summaryContainer.appendChild(totalCountElement);


        if (categoryCounts.size > 0) {
            const summaryList = document.createElement('ul');
            summaryList.style.listStyle = 'none';
            summaryList.style.padding = '0';
            summaryList.style.margin = '0';
             // maxHeight is no longer needed on the list itself if the container scrolls
             // summaryList.style.maxHeight = 'calc(100% - 30px - ' + totalCountElement.offsetHeight + 'px)';


            // Sort categories alphabetically for consistent display
            const sortedCategories = Array.from(categoryCounts.keys()).sort();

            sortedCategories.forEach(category => {
                const count = categoryCounts.get(category);
                const listItem = document.createElement('li');
                listItem.textContent = `${category}: ${count}`;
                listItem.style.marginBottom = '5px';
                listItem.style.whiteSpace = 'nowrap'; // Prevent wrapping
                listItem.style.overflow = 'hidden'; // Hide overflowing text
                listItem.style.textOverflow = 'ellipsis'; // Add ellipsis for overflowing text

                summaryList.appendChild(listItem);
            });

            summaryContainer.appendChild(summaryList);
        } else {
            const noDataMessage = document.createElement('p');
            noDataMessage.textContent = 'No categorized apps found in the booster selector.';
            summaryContainer.appendChild(noDataMessage);
        }

         // Append the summary content to the target element
         // The targetElement is now .booster_creator_art itself
         targetElement.appendChild(summaryContainer);

         // The post-append height adjustment for the list is no longer needed
         // since the summaryContainer is scrolling.
         // if (categoryCounts.size > 0) {
         //     const adjustedMaxHeight = summaryContainer.offsetHeight - title.offsetHeight - totalCountElement.offsetHeight - 30; // 30 for padding/margins
         //     summaryContainer.querySelector('ul').style.maxHeight = adjustedMaxHeight + 'px';
         // }

    }

})();
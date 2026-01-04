// ==UserScript==
// @name         [V.O.T.T] Days in faction
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add days in faction next to faction info in profile page
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/profiles.php?XID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480491/%5BVOTT%5D%20Days%20in%20faction.user.js
// @updateURL https://update.greasyfork.org/scripts/480491/%5BVOTT%5D%20Days%20in%20faction.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // #region API Key Validation

    // Function ask the user for the API key
    var storedApiKey = GM_getValue('apiKey');
    function askforapikey() {
        storedApiKey = prompt('Please enter your Torn API key (or click "Cancel" to skip):') || 'null';
        if (storedApiKey !== 'null') {
            GM_setValue('apiKey', storedApiKey);
            location.reload();
        } else {
            alert('You have chosen not to provide an API key. The script will not run.');
            GM_setValue('apiKey', storedApiKey);
        }
    }

    // Function to check the API key
    async function checkApiKey(apiKey) {
        const Href = window.location.href;
        const XID = Href.split('=')[1];
        const apiUrl = `https://api.torn.com/user/${XID}?selections=profile&comment=VOTT&key=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.error);
        }

        return response.json();
    }

    // Check if the API key is stored
    if (!storedApiKey || storedApiKey === 'null') {
        askforapikey();
    }

    // Check the API key everytime the website is loaded
    if (storedApiKey !== 'null') {
        try {
            const checkapi = await checkApiKey(storedApiKey);
            if (checkapi.error) {
                if (checkapi.error.code === 2 || checkapi.error.code === 16) {
                    alert(`[Days in faction] Error. Please enter a valid limited Torn API key.`);
                    askforapikey();
                    return; // Terminate the script to prevent further execution
                } else if (checkapi.error.code === 7) {
                    alert(`[Days in faction] Error: ${checkapi.error.error}. Are you factionless? Script will not run.`);
                    return; // Terminate the script to prevent further execution
                }
            }
        } catch (error) {
            console.error(`Error during API key validation: ${error}`);

            // If access level is not high enough or incorrect key, re-ask the user for the API key
            if (error === 'Access level of this key is not high enough' || error === 'Incorrect key') {
                alert(`[Days in faction] Error: ${error}. Please enter a valid Torn API key.`);
                GM_setValue('apiKey', 'null');
                return; // Terminate the script to prevent further execution
            }
        }
    }

    // #endregion

    // #region Main Script

    // Fetch data using the validated API key
    if (storedApiKey !== 'null') {
        try {
            const data = await checkApiKey(storedApiKey);

            // Code goes here ...
            const DayInFaction = data.faction.days_in_faction;

            let profileRoot = document.querySelector('.core-layout__viewport > .user-profile');
            let ProfileWrapper = profileRoot.getElementsByClassName('profile-wrapper')[2]; // get the third element
            let BasicInfo = ProfileWrapper.getElementsByClassName('info-table')[0];
            let UserInfo = BasicInfo.childNodes[2];
            let UserInfoTable = UserInfo.childNodes[1];
             
            let DaysInFaction = document.createElement('span');
            if (DaysInFaction === 0 || DaysInFaction === 1) {
            DaysInFaction.innerHTML = "(" + DayInFaction + " day)";
            } else {
            DaysInFaction.innerHTML = "(" + DayInFaction + " days)";
            }
            DaysInFaction.style.marginLeft = "5px";
            UserInfoTable.appendChild(DaysInFaction);



        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    } else {
        console.log('User has chosen not to provide an API key or entered an incorrect key.');

        // Clear stored API key so that the prompt is shown again on the next visit
        GM_setValue('apiKey', 'null');
    }

    // #endregion

})();
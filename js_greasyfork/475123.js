// ==UserScript==
// @name         Search For Cash Helper
// @namespace    Phantom Scripting
// @version      0.3
// @description  Search For Cash Notifier
// @author       ErrorNullTag
// @match        www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/475123/Search%20For%20Cash%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475123/Search%20For%20Cash%20Helper.meta.js
// ==/UserScript==

//=====================================================
//Acceptable Use Policy for All Phantom Scripting Scripts
//Version 1.0
//Last Updated: 9/17/2023
//=====================================================

//Introduction:
//-------------
//This Acceptable Use Policy ("Policy") outlines the acceptable and unacceptable uses
//of All Phantom Scripting Scripts ("Software"). This Policy applies to all users of the
//Software, including but not limited to contributors, developers, and end-users.
//By using the Software, you agree to abide by this Policy, as well as any other terms and
//conditions imposed by Phantom Scripting.

//Acceptable Use:
//---------------
//The Software is intended for usage in-game as it's stated usage on the download page for the software.
//Users are encouraged to use the Software for its intended purposes, and any use beyond this
//should be consistent with the principles of integrity, respect, and legality.

//Unacceptable Use:
//-----------------
//By using the Software, you agree not to:

//1. Use the Software for any illegal or unauthorized purpose, including but not limited to violating
//any local, state, or international laws.
//2. Use the Software for malicious gains, including but not limited to hacking, spreading malware,
//or engaging in activities that harm or exploit others.
//3. Alter, modify, or use the Software in a way that is inconsistent with its intended purpose,
//as described in official documentation, without explicit permission from Phantom Scripting.
//4. Use the Software to infringe upon the copyrights, trademarks, or other intellectual property
//rights of others.
//5. Use the Software to harass, abuse, harm, or discriminate against individuals or groups,
//based on race, religion, gender, sexual orientation, or any other characteristic.
//6. Use the Software to spam or engage in phishing activities.

//Consequences of Unacceptable Use:
//---------------------------------
//Phantom Scripting reserves the right to take any actions deemed appropriate for violations of this
//Policy, which may include:

//1. Temporary or permanent revocation of access to the Software.
//2. Moderative actions against the individual or entity in violation of this Policy.
//3. Public disclosure of the violation, to both Game Staff and the userbase.

//Amendments:
//-----------
//Phantom Scripting reserves the right to modify this Policy at any time.
//Users are encouraged to regularly review this Policy to ensure they are aware of any changes.

//Contact Information:
//---------------------
//For any questions regarding this Policy, please contact ErrorNullTag on Discord.

//=====================================================

(function() {
    'use strict';

    let apiKey = GM_getValue('API_KEY', '');
    if (!apiKey) {
        apiKey = prompt('Enter your API key:');
        GM_setValue('API_KEY', apiKey);
    }

    const defaultSearchForCashData = {
        "search_the_trash": {"title": "Trash Collection", "percentage": "N/A"},
        "search_the_subway": {"title": "Subway", "percentage": "N/A"},
        "search_the_junkyard": {"title": "Junkyard", "percentage": "N/A"},
        "search_the_beach": {"title": "Beach", "percentage": "N/A"},
        "search_the_cemetery": {"title": "Cemetery", "percentage": "N/A"},
        "search_the_fountain": {"title": "Fountain", "percentage": "N/A"}
    };

    let isBoxCollapsed = false;

    function toggleBox() {
        const contentDiv = document.getElementById('alertBoxContent');
        const alertBox = document.getElementById('alertBox');
        if (contentDiv && alertBox) {
            isBoxCollapsed = !isBoxCollapsed;
            contentDiv.style.display = isBoxCollapsed ? 'none' : 'block';
            alertBox.style.height = isBoxCollapsed ? '40px' : '250px';
        }
    }

    function displayAlertBox(searchForCashData = defaultSearchForCashData) {
        let alertBox = document.getElementById('alertBox');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'alertBox';
            alertBox.style.position = 'fixed';
            alertBox.style.right = '0';
            alertBox.style.top = '0';
            alertBox.style.width = '350px';
            alertBox.style.height = '250px';
            alertBox.style.backgroundColor = 'black';
            alertBox.style.zIndex = '99999999';
            alertBox.style.border = '2px solid gold';
            document.body.appendChild(alertBox);

            const collapseButton = document.createElement('button');
            collapseButton.innerHTML = 'Toggle';
            collapseButton.onclick = toggleBox;
            collapseButton.style.backgroundColor = 'gold';
            collapseButton.style.color = 'black';
            collapseButton.style.border = 'none';
            alertBox.appendChild(collapseButton);

            const contentDiv = document.createElement('div');
            contentDiv.id = 'alertBoxContent';
            alertBox.appendChild(contentDiv);
        }

        const contentDiv = document.getElementById('alertBoxContent');
        contentDiv.innerHTML = '';

        const title = document.createElement('div');
        title.innerHTML = "Phantom Scripting";
        title.style.color = 'gold';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        title.style.fontSize = '26px';
        contentDiv.appendChild(title);

        for (const key in searchForCashData) {
            const activityData = searchForCashData[key];
            const activityDiv = document.createElement('div');
            activityDiv.innerHTML = `${activityData.title} - ${activityData.percentage}%`;
            activityDiv.style.color = activityData.percentage > 50 ? 'limegreen' : 'red';
            activityDiv.style.fontWeight = 'bold';
            activityDiv.style.marginBottom = '5px';
            activityDiv.style.fontSize = '15px';
            contentDiv.appendChild(activityDiv);
        }
    }

    function fetchAndDisplayData() {
        fetch(`https://api.torn.com/torn/?selections=searchforcash&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                for (const location in data.searchforcash) {
                    if (defaultSearchForCashData.hasOwnProperty(location)) {
                        defaultSearchForCashData[location].percentage = data.searchforcash[location].percentage;
                    }
                }
                displayAlertBox(defaultSearchForCashData);
            })
            .catch(error => console.error('API Error for searchForCash:', error));
    }

    // Render the box instantly with default values
    displayAlertBox();
    fetchAndDisplayData();

    // Update the data every 30 seconds
    setInterval(fetchAndDisplayData, 30000);
})();

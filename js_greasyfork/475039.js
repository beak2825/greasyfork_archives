// ==UserScript==
// @name         Shoplifting alert
// @namespace    Phantom Scripting
// @version      0.3
// @description  Guard Notifier
// @author       ErrorNullTag
// @match        www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/475039/Shoplifting%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/475039/Shoplifting%20alert.meta.js
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

    let apiKey = GM_getValue('shoplifting_api_key', '');
    if (!apiKey) {
        apiKey = prompt('Enter your API key:');
        GM_setValue('shoplifting_api_key', apiKey);
    }

    function displayAlertBox(camera = false, guard = false) {
    let alertBox = document.getElementById('alertBox');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'alertBox';
        alertBox.style.position = 'fixed';
        alertBox.style.right = '0';
        alertBox.style.top = '0';
        alertBox.style.width = '280px';
        alertBox.style.height = '150px';
        alertBox.style.backgroundColor = 'black';
        alertBox.style.zIndex = '99999999';
        alertBox.style.display = 'flex';
        alertBox.style.flexDirection = 'column';
        alertBox.style.justifyContent = 'center';
        alertBox.style.alignItems = 'center';
        alertBox.style.fontFamily = 'Arial, sans-serif';
        alertBox.style.padding = '10px';
        alertBox.style.border = '2px solid gold';
        document.body.appendChild(alertBox);
    }

    // Clear the content to update it
    alertBox.innerHTML = '';

    const title = document.createElement('div');
    title.innerHTML = "Phantom Scripting";
    title.style.color = 'gold';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '20px'; // Increased spacing
    title.style.fontSize = '26px'; // Slightly bigger for prominence
    alertBox.appendChild(title);

    const cameraStatus = document.createElement('div');
    cameraStatus.innerHTML = camera ? "Camera: Offline" : "Camera: Online";
    cameraStatus.style.color = camera ? 'limegreen' : 'red'; // Changed green to limegreen for better visibility
    cameraStatus.style.fontWeight = 'bold';
    cameraStatus.style.borderBottom = '1px solid white'; // Added subtle border
    cameraStatus.style.paddingBottom = '5px'; // Padding for the border
    cameraStatus.style.fontSize = '20px'; // Bigger font size for better readability

    const guardStatus = document.createElement('div');
    guardStatus.innerHTML = guard ? "Guards: Gone" : "Guards: On duty";
    guardStatus.style.color = guard ? 'limegreen' : 'red';
    guardStatus.style.fontWeight = 'bold';
    guardStatus.style.fontSize = '20px';

    alertBox.appendChild(cameraStatus);
    alertBox.appendChild(guardStatus);

    if (camera && guard) {
        alert("Time to mug Big Al's!");
    }
}


    function fetchAndDisplayData() {
        fetch(`https://api.torn.com/torn/?selections=shoplifting&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                    const camera = data.shoplifting.big_als[0].disabled;
                    const guard = data.shoplifting.big_als[1].disabled;
                    displayAlertBox(camera, guard);
                }
            )
            .catch(error => console.error('API Error:', error));
    }

    // Render the box instantly with default values
    displayAlertBox();

    setInterval(fetchAndDisplayData, 10000);
})();

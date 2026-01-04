// ==UserScript==
// @name         Rock Paper Scissors Faction
// @namespace    heartflower.torn.com
// @version      1.1
// @description  Showcase rock/paper/scissors team on faction page
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/488016/Rock%20Paper%20Scissors%20Faction.user.js
// @updateURL https://update.greasyfork.org/scripts/488016/Rock%20Paper%20Scissors%20Faction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change to be whatever you want it to be, max 100
    let maxAPICalls = 70;

    let mobile;
    if (window.innerWidth <= 784) {
        mobile = true;
    } else if (window.innerWidth > 784) {
        mobile = false;
    }

    let userIDs = [];
    let failedUserIDs = [];
    let index = 0;

    let apiKey = '';
    let storedAPIKey = localStorage.getItem('hf-public-apiKey');
    if (storedAPIKey) {
        apiKey = storedAPIKey;
    }

    if (apiKey == '') {
        enterAPIMessage();
    } else {
        setTimeout(findUserIDs, 100);
    }

    // Find all user IDs for the specific faction
    function findUserIDs() {
        console.log('find user IDs');
        let tableRows = document.querySelectorAll('li.table-row');

        if (!tableRows || tableRows.length == 0) {
            console.log('no table row');
            setTimeout(findUserIDs, 100);
            return;
        }

        console.log(tableRows);

        tableRows.forEach(function(tableRow) {
            let profileLink = tableRow.querySelector('.honorWrap___BHau4 a.linkWrap___ZS6r9');
            let href = profileLink.getAttribute('href');
            let startIndex = href.indexOf('ID=') + 3; // Length of 'ID=' is 3
            let endIndex = href.indexOf('&', startIndex);
            if (endIndex === -1) {
                endIndex = href.length;
            }
            let userID = href.substring(startIndex, endIndex);

            userIDs.push(userID);
        });

        console.log(userIDs);
        fetchAllAPIs();
    }

    // Add the API message if API not entered
    function enterAPIMessage() {
        // Create the main container div
        let infoMsgDiv = document.createElement('div');
        infoMsgDiv.className = 'info-msg-cont border-round m-top10 factionMessageDiv';
        infoMsgDiv.style.background = 'red';

        // Create the inner div for the message content
        let innerDiv = document.createElement('div');
        innerDiv.className = 'info-msg border-round';

        // Create the icon element
        let iconElement = document.createElement('i');
        iconElement.className = 'info-icon';

        // Create the message container div
        let msgContainer = document.createElement('div');
        msgContainer.className = 'delimiter';

        // Create the message element
        let messageElement = document.createElement('div');
        messageElement.id = 'hf-enter-api';
        messageElement.className = 'msg right-round factionMessageElement';
        messageElement.setAttribute('role', 'alert');
        messageElement.setAttribute('aria-live', 'assertive');

        let link = document.createElement('a');
        link.id = 'hf-enter-api';
        link.href = '#'; // Set a placeholder href
        link.textContent = `Click here to enter your (public) API key to load this faction's rock/paper/scissors teams!`;
        messageElement.appendChild(link);

        // Add click event listener to the link
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            promptAPIKey();
        });

        // Append elements to construct the message structure
        msgContainer.appendChild(messageElement);
        innerDiv.appendChild(iconElement);
        innerDiv.appendChild(msgContainer);
        infoMsgDiv.appendChild(innerDiv);

        // Get the reference element after which the new div should be inserted
        let referenceElement = document.querySelector('.content-title.m-bottom10');

        // Insert the new div after the reference element
        referenceElement.parentNode.insertBefore(infoMsgDiv, referenceElement.nextSibling);

        // Create the <hr> element
        let hrElement = document.createElement('hr');
        hrElement.className = 'page-head-delimiter m-top10 m-bottom10 factionMessageDivider';

        // Insert the <hr> element after the new div
        referenceElement.parentNode.insertBefore(hrElement, infoMsgDiv.nextSibling);
    }

    // Prompt for the API key if API not entered
    function promptAPIKey() {
        let enterAPIKey = prompt('Enter a public API key here:');

        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-public-apiKey', enterAPIKey);
            apiKey = enterAPIKey;

            alert('API key set succesfully');

            let APImessage = document.getElementById('hf-enter-api');

            if (APImessage) {
                APImessage.remove();
            }

            setTimeout(findUserIDs, 100);
        } else {
            alert('No valid API key entered!');
        }
    }

    // Call the API for every user ID, if needed wait a minute
    function fetchAllAPIs() {
        // Get a chunk of user IDs
        let chunk = userIDs.slice(index, index + maxAPICalls);

        // Fetch API data for the chunk
        chunk.forEach(userID => fetchAPI(userID));

        // Update index for the next chunk
        index += maxAPICalls;

        // If there are more user IDs, wait for a minute and process the next chunk
        if (index < userIDs.length) {
            setTimeout(fetchAllAPIs, 60000); // Wait for a minute (60,000 milliseconds)
        }
    }

    // Call the API for every failed user ID, the script always waits a minute to run this for safety measures
    function fetchFailedAPIs() {
        console.log('fetching failed APIs');
        console.log(failedUserIDs);

        index = 0;

        // Get a chunk of user IDs
        let chunk = failedUserIDs.slice(index, index + maxAPICalls);

        // Fetch API data for the chunk
        chunk.forEach(failedUserID => fetchAPI(failedUserID));

        // Update index for the next chunk
        index += maxAPICalls;

        // If there are more user IDs, wait for a minute and process the next chunk
        if (index < failedUserIDs.length) {
            setTimeout(fetchFailedAPIs, 60000); // Wait for a minute (60,000 milliseconds)
        }
    }

    // Fetch the team for a specific user ID
    function fetchAPI(userID) {
        console.log('Fetching api for ' + userID)
        let apiUrl = `https://api.torn.com/user/${userID}?selections=profile&key=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            let team = data.competition.status;

            console.log('User ID: ' + userID + ' team: ' + team);

            if (mobile === false) {
                displayTeam(userID, team);
            } else if (mobile === true) {
                displayMobileTeam(userID, team);
            }
        })
            .catch(error => {
            console.error('Error fetching data for userID ' + userID + ': ' + error + '. Trying again in a minute.');
            failedUserIDs.push(userID);
        });
    }

    // Displays the team in the faction table
    function displayTeam(chosenUserID, team) {
        let tableRows = document.querySelectorAll('li.table-row');

        if (!tableRows) {
            setTimeout(findUserIDs, 100);
            return;
        }

        tableRows.forEach(function(tableRow) {
            let profileLink = tableRow.querySelector('.honorWrap___BHau4 a.linkWrap___ZS6r9');
            let href = profileLink.getAttribute('href');
            let startIndex = href.indexOf('ID=') + 3; // Length of 'ID=' is 3
            let endIndex = href.indexOf('&', startIndex);
            if (endIndex === -1) {
                endIndex = href.length;
            }
            let userID = href.substring(startIndex, endIndex);

            if (userID !== chosenUserID) {
                return;
            }

            let iconTray = tableRow.querySelector('#iconTray');

            let li = document.createElement('li');
            li.className = 'iconShow';
            li.style.float = 'none';
            li.style.display = 'inline-block';
            li.style.width = '23px';
            li.style.marginLeft = '-5px';
            li.style.marginBottom = '0px';

            if (team == 'rock') {
                li.style.background = 'url(/images/v2/rps/rock@1x.png) left -3px / 110% no-repeat'
            } else if (team == 'paper') {
                    li.style.background = 'url(/images/v2/rps/paper_light@1x.png) left -3px / 110% no-repeat'
            } else if (team == 'scissors') {
                    li.style.background = 'url(/images/v2/rps/scissors_light@1x.png) left -3px / 110% no-repeat'
            }

            // Insert the new li element as the first child of iconTray
            iconTray.insertBefore(li, iconTray.firstChild);
        });
    }

    function displayMobileTeam(chosenUserID, team) {
        let tableRows = document.querySelectorAll('li.table-row');

        if (!tableRows) {
            setTimeout(findUserIDs, 100);
            return;
        }

        tableRows.forEach(function(tableRow) {
            let profileLink = tableRow.querySelector('.honorWrap___BHau4 a.linkWrap___ZS6r9');
            let href = profileLink.getAttribute('href');
            let startIndex = href.indexOf('ID=') + 3; // Length of 'ID=' is 3
            let endIndex = href.indexOf('&', startIndex);
            if (endIndex === -1) {
                endIndex = href.length;
            }
            let userID = href.substring(startIndex, endIndex);

            if (userID !== chosenUserID) {
                return;
            }

            let div = document.createElement('div');
            div.textContent = 'Competition team: ' + team;
            div.style.textAlign = 'center';
            div.style.borderBottom = '1px solid';
            div.style.borderColor = 'var(--default-panel-divider-outer-side-color)';
            div.style.padding = '5px';
            tableRow.parentNode.insertBefore(div, tableRow.nextSibling);
        });
    }

    setTimeout(fetchFailedAPIs, 60000); // If API calls failed, try again in a minute

})();
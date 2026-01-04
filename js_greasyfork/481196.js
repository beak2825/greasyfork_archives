// ==UserScript==
// @name         YAMAH
// @namespace    https://greasyfork.org/en/users/1060007-dsumner12
// @version      1.0
// @description  Add multiple artists to a film on Secret Cinema rather than one by one.
// @author       ChatGPT
// @match        https://secret-cinema.pw/torrents.php?id=*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481196/YAMAH.user.js
// @updateURL https://update.greasyfork.org/scripts/481196/YAMAH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to dynamically get the AUTH_TOKEN from the page
    function getAuthToken() {
        const authTokenInput = document.querySelector('input[name="auth"]');
        return authTokenInput ? authTokenInput.value : null;
    }

    // Function to dynamically get the GROUP_ID from the page
    function getGroupId() {
        const groupIdInput = document.querySelector('input[name="groupid"]');
        return groupIdInput ? groupIdInput.value : null;
    }
function getImportanceValue(role) {
        var roleMapping = {
            'Director': '1',
            'Writer': '2',
            'Producer': '3',
            'Composer': '4',
            'Cinematographer': '6',
            'Actor': '5'
        };
        return roleMapping[role] || '5'; // Default to 'Actor' if role not found
    }

    // Function to create a textarea for each role
function createRoleTextarea(role) {
    var textAreaContainer = document.createElement('div');
    textAreaContainer.style.marginBottom = '10px'; // Add space between boxes
    textAreaContainer.style.marginLeft = '-10px'; // Add space between boxes
    textAreaContainer.style.border = '1px solid #ccc'; // Add border around each box
    textAreaContainer.style.borderRadius = '4px'; // Round the corners of the boxes
    textAreaContainer.style.overflow = 'hidden'; // Ensure the border contains the label and textarea
    textAreaContainer.style.backgroundColor = '#f8f8f8'; // Slightly different background to stand out

    var textAreaLabel = document.createElement('label');
    textAreaLabel.textContent = role + ':';
    textAreaLabel.style.fontWeight = 'bold'; // Make label bold
    textAreaLabel.style.display = 'block'; // Ensure the label is on its own line
    textAreaLabel.style.padding = '8px'; // Add padding around the label for better spacing
    textAreaLabel.style.background = '#e9e9e9'; // Different background for the label
    textAreaLabel.style.borderBottom = '1px solid #ccc'; // Add a separator between the label and textarea

    var textArea = document.createElement('textarea');
    textArea.setAttribute('data-role', role);
    textArea.style.width = 'calc(100% - 16px)'; // Adjust width to allow for padding
    textArea.style.margin = '0'; // Remove default margin
    textArea.style.padding = '8px'; // Add padding inside the textarea
    textArea.style.border = 'none'; // Remove border since the container has one
    textArea.style.resize = 'vertical'; // Allow vertical resizing only

    textAreaContainer.appendChild(textAreaLabel);
    textAreaContainer.appendChild(textArea);
    return textAreaContainer;
}


    function addBatchAddInterface() {
        var roles = ['Director', 'Writer', 'Producer', 'Composer', 'Cinematographer', 'Actor'];
        var batchAddDiv = document.createElement('div');
        batchAddDiv.className = 'box';
        batchAddDiv.id = 'batchAddArtists';

        var batchAddHeader = document.createElement('div');
        batchAddHeader.className = 'head';
        batchAddHeader.innerHTML = '<strong>Batch Add Artists [+]</strong>'; // Added toggle indicator
        batchAddHeader.addEventListener('click', toggleBatchAddBody);
        batchAddDiv.appendChild(batchAddHeader);

        var batchAddBody = document.createElement('div');
        batchAddBody.className = 'body';
        batchAddBody.style.display = 'none'; // Initially hide the body
        roles.forEach(function(role) {
            batchAddBody.appendChild(createRoleTextarea(role));
        });

        var addButton = document.createElement('button');
        addButton.textContent = 'Add Artists';
        addButton.style.marginTop = '10px';
        addButton.addEventListener('click', batchAddArtists);
        batchAddBody.appendChild(addButton);

        batchAddDiv.appendChild(batchAddBody);

        var addArtistBox = document.querySelector('div.box_addartists');
        if (addArtistBox) {
            addArtistBox.parentNode.insertBefore(batchAddDiv, addArtistBox.nextSibling);
        }
    }

    function toggleBatchAddBody() {
        var batchAddBody = document.querySelector('#batchAddArtists .body');
        var batchAddHeader = document.querySelector('#batchAddArtists .head strong');
        if (batchAddBody) {
            var isOpen = batchAddBody.style.display !== 'none';
            batchAddBody.style.display = isOpen ? 'none' : 'block';
            batchAddHeader.innerHTML = isOpen ? 'Batch Add Artists [+]' : 'Batch Add Artists [-]';
        }
    }

    function batchAddArtists() {
    const AUTH_TOKEN = getAuthToken(); // Get the auth token dynamically
    const GROUP_ID = getGroupId();     // Get the group ID dynamically

    var addArtistPromises = []; // Array to hold all promises for addArtist calls
    var textAreas = document.querySelectorAll('#batchAddArtists textarea');
    textAreas.forEach(function(textArea) {
        var role = textArea.getAttribute('data-role');
        var artists = textArea.value.split('\n');
        artists.forEach(function(artist) {
            if (artist.trim()) {
                // Push the promise returned by addArtist into the array
                addArtistPromises.push(addArtist(artist.trim(), role, AUTH_TOKEN, GROUP_ID));
            }
        });
    });

    // Use Promise.all to wait for all addArtist operations to complete
    Promise.all(addArtistPromises).then(function() {
        // Refresh the page after all artists have been added
        window.location.reload();
    }).catch(function(error) {
        // Handle errorAs here if any of the promises fail
        console.error('An error occurred while adding artists:', error);
    });
}

function addArtist(artistName, role, authToken, groupId) {
    return new Promise((resolve, reject) => { // Return a new Promise
        if (!authToken || !groupId) {
            console.error('AUTH_TOKEN or GROUP_ID is missing.');
            reject('Missing token or group ID');
            return;
        }

        var formData = new FormData();
        formData.append('action', 'add_alias');
        formData.append('auth', authToken);
        formData.append('groupid', groupId);
        formData.append('aliasname[]', artistName);
        formData.append('importance[]', getImportanceValue(role));

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://secret-cinema.pw/torrents.php',
            data: formData,
            onload: function(response) {
                console.log('Artist added:', response.responseText);
                resolve(response.responseText); // Resolve the promise when the artist is added
            },
            onerror: function(response) {
                console.error('Error adding artist:', response.responseText);
                reject(response.responseText); // Reject the promise on error
            }
        });
    });
}


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addBatchAddInterface);
    } else {
        addBatchAddInterface();
    }
})();

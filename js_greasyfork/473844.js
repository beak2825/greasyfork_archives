// ==UserScript==
// @name         GitHub Star Network Request
// @namespace    https://github.com/CherryLover/GithubStarScript
// @version      0.4
// @description  GitHub Star 自动记录到 Notion Database
// @author       jiangjiwei
// @supportURL	 https://github.com/CherryLover/GithubStarScript
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473844/GitHub%20Star%20Network%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/473844/GitHub%20Star%20Network%20Request.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sendNetworkRequest() {
        // Modify the following URL to the desired endpoint

        var databasePageId = GM_getValue('databasePageId', ''); // Load saved value
        var notionToken = GM_getValue('notionToken', ''); // Load saved value

        if (databasePageId.length == 0 || notionToken.length == 0) {
            alert('please input your token and database page id');
            return;
        }

        const endpointURL = 'https://api.notion.com/v1/pages/';

        var repositoryName = document.querySelector('strong[itemprop="name"]').textContent;

        var currentUrl = window.location.href;
        if (currentUrl == "https://github.com") {
            repositoryName = "GitHub";
        } else {
            repositoryName = currentUrl.substring(currentUrl.lastIndexOf("/") + 1);
        }

        var body = {
            "parent": {
                "database_id": databasePageId
            },
            "properties": {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": repositoryName
                            }
                        }
                    ]
                },
                "URL": {
                    "url": currentUrl
                }

            }
        }

        console.log("request body " + JSON.stringify(body))

        

        GM_xmlhttpRequest({
            method: 'POST',
            url: endpointURL,
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + notionToken,
                'Notion-Version': '2022-02-22',
            },
            data: JSON.stringify(body),
            onload: function (response) {
                // print response code
                console.log('Response code:', response.status);
                if (response.status == 200) {
                    console.log('success');
                } else {
                    console.log('failed');
                    console.log('Network request sent successfully.' + response.responseText);
                }
            },
            onerror: function (error) {
                console.error('Error sending network request:', error);
            }
        });
    }

    let settingsDiv = null;
    // Show settings interface
    let isSettingsVisible = false; // Flag to track visibility

    // Function to toggle settings visibility
    function toggleSettings() {
        isSettingsVisible = !isSettingsVisible;

        if (isSettingsVisible) {
            showSettings();
        } else {
            hideSettings();
        }
    }

    // Show settings interface
    function showSettings() {
        settingsDiv = document.createElement('div');
        settingsDiv.id = 'user-script-settings';
        settingsDiv.style.position = 'fixed';
        settingsDiv.style.top = '0';
        settingsDiv.style.left = '0';
        settingsDiv.style.padding = '10px';
        settingsDiv.style.background = 'white';
        settingsDiv.style.border = '1px solid #ccc';
        settingsDiv.style.borderRadius = '8px';
        settingsDiv.style.display = 'flex';
        settingsDiv.style.flexDirection = 'column';
        settingsDiv.style.alignItems = 'flex-start';
        settingsDiv.style.color = '#333333';

        const tokenLabel = document.createElement('label');
        tokenLabel.textContent = 'Notion Token:';
        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.value = GM_getValue('notionToken', ''); // Load saved value
        tokenInput.style.background = 'white';
        tokenInput.style.border = '1px solid #999999';
        tokenInput.style.borderRadius = '8px';
        tokenInput.style.padding = '5px';
        tokenInput.style.color = '#333333';
        tokenInput.style.width = '100%';
        settingsDiv.appendChild(tokenLabel);
        settingsDiv.appendChild(tokenInput);

        const pageIdLabel = document.createElement('label');
        pageIdLabel.textContent = 'Database Page Id:';
        pageIdLabel.style.marginTop = '10px';
        const pageIdInput = document.createElement('input');
        pageIdInput.type = 'text';
        pageIdInput.value = GM_getValue('databasePageId', ''); // Load saved value
        pageIdInput.style.background = 'white';
        pageIdInput.style.border = '1px solid #999999';
        pageIdInput.style.borderRadius = '8px';
        pageIdInput.style.padding = '5px';
        pageIdInput.style.color = '#333333';
        pageIdInput.style.width = '100%';
        settingsDiv.appendChild(pageIdLabel);
        settingsDiv.appendChild(pageIdInput);

        const duplicateLink = document.createElement('a');
        duplicateLink.textContent = 'How to get this?';
        duplicateLink.href = 'https://notion.so';
        duplicateLink.style.color = 'rgb(47, 129, 247)';
        duplicateLink.style.marginTop = '5px';
        settingsDiv.appendChild(duplicateLink);


        const containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex';
        containerDiv.style.flexDirection = 'row';
        containerDiv.style.alignItems = 'center';
        containerDiv.style.justifyContent = 'space-between'; // Space between elements
        containerDiv.style.width = '100%';

        const saveButtonContainer = document.createElement('div');
        saveButtonContainer.style.display = 'flex';
        saveButtonContainer.style.alignItems = 'center'; // Center vertically
        saveButtonContainer.style.justifyContent = 'center'; // Center horizontally
        saveButtonContainer.style.width = '100%';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';

        saveButton.addEventListener('click', function () {
            var tokenText = tokenInput.value;
            var pageIdText = pageIdInput.value;
            if (tokenText.length == 0 || pageIdText.length == 0) {
                alert('please input your token and database page id');
                return;
            }
            GM_setValue('notionToken', tokenInput.value); // Save Notion Token value
            GM_setValue('databasePageId', pageIdInput.value); // Save Database Page Id value
            hideSettings(); // Hide after saving
        });

        // Set button styles
        const buttonHeight = '30px'; // Set the button height
        const buttonWidth = '50%'; // Set the button width to 50%
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '15px'; // Set the border radius to 50%
        saveButton.style.padding = '0';
        saveButton.style.margin = '10px 10px 10px 10px';
        saveButton.style.width = buttonWidth;
        saveButton.style.height = buttonHeight;
        saveButton.style.backgroundColor = 'rgb(47, 129, 247)'; // Button color
        saveButton.style.color = 'white'; // Button text color

        saveButton.addEventListener('mouseenter', function () {
            saveButton.style.backgroundColor = 'rgb(29, 101, 207)'; // Hover color
        });

        saveButton.addEventListener('mouseleave', function () {
            saveButton.style.backgroundColor = 'rgb(47, 129, 247)'; // Button color
        });

        saveButton.addEventListener('mousedown', function () {
            saveButton.style.backgroundColor = 'rgb(12, 84, 171)'; // Click color
        });

        saveButton.addEventListener('mouseup', function () {
            saveButton.style.backgroundColor = 'rgb(29, 101, 207)'; // Hover color
        });

        saveButtonContainer.appendChild(saveButton);
        containerDiv.appendChild(saveButtonContainer);

        settingsDiv.appendChild(containerDiv);

        document.body.appendChild(settingsDiv);
    }

    // Hide settings interface
    function hideSettings() {
        if (settingsDiv) {
            settingsDiv.remove();
        }
    }

    const starButton = document.querySelector('button.js-toggler-target');

    console.log('star button is null ' + (starButton == null));

    if (starButton != null) {
        starButton.addEventListener('click', () => {
            // Call the function to send the network request
            console.log("you click star button")
            sendNetworkRequest();
        });
    }


    window.addEventListener('keydown', function (event) {
        if (event.key === 'F9') {
            toggleSettings();
        }
    });

})();

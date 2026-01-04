// ==UserScript==
// @name         ChatGPT Events
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Create button to manage profiles and key-value pairs
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518204/ChatGPT%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/518204/ChatGPT%20Events.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for storagePanel to be available
    function waitForStoragePanel() {
        if (typeof window.storagePanel !== 'undefined') {
            initializeButton();
        } else {
            setTimeout(waitForStoragePanel, 500);
        }
    }

    waitForStoragePanel();

    function initializeButton() {
        // Create button to open profile management panel
        const button = document.createElement('button');
        button.innerText = 'Manage Events';
        button.style.margin = '10px';
        button.onclick = openProfilePanel;

        // Append the button to storagePanel
        window.storagePanel.appendChild(button);
    }

function openProfilePanel() {
    // Create profile management panel
    const profilePanel = document.createElement('div');
    profilePanel.style.position = 'fixed';
    profilePanel.style.top = '50%';
    profilePanel.style.left = '50%';
    profilePanel.style.transform = 'translate(-50%, -50%)';
    profilePanel.style.width = '800px';
    profilePanel.style.height = '700px';
    profilePanel.style.backgroundColor = '#2F2F2F';
    profilePanel.style.color = 'white';
    profilePanel.style.borderRadius = '20px';
    profilePanel.style.padding = '20px';
    profilePanel.style.zIndex = '1000';
    profilePanel.style.display = 'flex';
    profilePanel.style.flexDirection = 'row';

    // Create close button for profilePanel
// Create close button for profilePanel
const closeButton = document.createElement('button');
closeButton.style.position = 'absolute';
closeButton.style.top = '15px';
closeButton.style.right = '15px';
closeButton.style.width = '30px';
closeButton.style.height = '30px';
closeButton.style.backgroundColor = 'transparent';
closeButton.style.color = '#ffffff';
closeButton.style.border = 'none';
closeButton.style.borderRadius = '50%';
closeButton.style.cursor = 'pointer';
closeButton.style.display = 'flex';
closeButton.style.alignItems = 'center';
closeButton.style.justifyContent = 'center';
closeButton.style.transition = 'background-color 0.2s ease';
closeButton.style.boxSizing = 'border-box';

// Create span for the '✕' character
const closeIcon = document.createElement('span');
closeIcon.innerText = '✕';
closeIcon.style.fontSize = '16px';
closeIcon.style.position = 'relative';
closeIcon.style.top = '-1px'; // Adjust this value to move the character up

// Append the span to the button
closeButton.appendChild(closeIcon);

// Hover effect
closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = '#676767';
});

closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'transparent';
});

// Close button action
closeButton.onclick = function() {
    document.body.removeChild(profilePanel);
};

// Append the button to the profile panel
profilePanel.appendChild(closeButton);


    // Create profile list container
    const profileListContainer = document.createElement('div');
    profileListContainer.style.flex = '0.50';
    profileListContainer.style.marginRight = '20px';
    profileListContainer.style.paddingRight = '20px';
    profileListContainer.style.display = 'flex';
    profileListContainer.style.flexDirection = 'column';
    profileListContainer.style.borderRight = '1px solid #444444';
    profileListContainer.style.overflowY = 'auto';
    profileListContainer.style.maxHeight = '660px';

    // Create header for profile list
    const profileListHeader = document.createElement('h4');
    profileListHeader.innerText = 'Profiles';
    profileListHeader.style.marginBottom = '10px';
    profileListContainer.appendChild(profileListHeader);

    // Create profile list
    const profileList = document.createElement('ul');
    profileList.style.overflowY = 'auto';
    profileList.style.height = '600px';
    profileListContainer.appendChild(profileList);

    // Create button to add profile
    const addProfileButton = document.createElement('button');
    addProfileButton.innerText = 'Add Profile';
addProfileButton.style.padding = '8px';
addProfileButton.style.border = '0.2px solid #4E4E4E';

addProfileButton.style.backgroundColor = 'transparent';
addProfileButton.style.color = '#fff';
addProfileButton.style.borderRadius = '20px';
addProfileButton.style.cursor = 'pointer';

addProfileButton.onmouseover = () => {
    addProfileButton.style.backgroundColor = '#424242';
};
addProfileButton.onmouseout = () => {
    addProfileButton.style.backgroundColor = 'transparent';
};
    addProfileButton.onclick = function() {
        openAddProfileDialog();
    };
    profileListContainer.appendChild(addProfileButton);

    // Create key-value input container
    const keyValueContainer = document.createElement('div');
    keyValueContainer.style.flex = '2.3';
    keyValueContainer.style.display = 'flex';
    keyValueContainer.style.flexDirection = 'column';
    keyValueContainer.style.gap = '10px';

    // Create entries list
    const entriesList = document.createElement('div');
    entriesList.style.overflowY = 'auto';
    entriesList.style.height = '340px';
    entriesList.style.width = '100%';
    entriesList.style.paddingRight = '20px';
    entriesList.style.borderCollapse = 'collapse';
    entriesList.style.display = 'block';
    entriesList.style.overflowY = 'auto';

    // Create a header above the headerRow
    const manageEventsHeader = document.createElement('h2');
    manageEventsHeader.innerText = 'Manage Event List';
    manageEventsHeader.style.marginBottom = '-10px';
    keyValueContainer.appendChild(manageEventsHeader);

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Key', 'Value', '%', 'Time', ''];
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.innerText = headerText;
        header.style.padding = '5px';
        header.style.textAlign = 'left';

        if (headerText === 'Value') {
            header.style.width = '60%';
        } else if (headerText === 'Key') {
            header.style.width = '15%';
        } else if (headerText === '%' || headerText === 'Time') {
            header.style.width = '10%';
        } else if (headerText === '') {
            header.style.width = '5%';
        }

        headerRow.appendChild(header);
    });
    const headerContainer = document.createElement('div');
    headerContainer.style.position = 'sticky';
    headerContainer.style.top = '0';
    headerContainer.style.backgroundColor = '#2F2F2F';
    headerContainer.style.zIndex = '1';
    headerContainer.appendChild(headerRow);
    entriesList.appendChild(headerContainer);
    entriesList.style.position = 'sticky';
    entriesList.style.top = '0';
    entriesList.style.backgroundColor = '#2F2F2F';
    // Create a separate header for the entries list
    const entriesHeaderContainer = document.createElement('div');
    entriesHeaderContainer.style.position = 'sticky';
    entriesHeaderContainer.style.top = '0';
    entriesHeaderContainer.style.backgroundColor = '#2F2F2F';
    entriesHeaderContainer.style.zIndex = '1';
    const entriesHeader = document.createElement('div');
    entriesHeader.style.display = 'flex';
    entriesHeader.style.padding = '5px 0';
    entriesHeader.style.borderBottom = '1px solid #444444';
    headers.forEach(headerText => {
        const header = document.createElement('div');
        header.innerText = headerText;
        header.style.padding = '5px';
        header.style.textAlign = 'left'; // Align headers to the left
        if (headerText === 'Value') {
            header.style.width = '57%';
        } else if (headerText === 'Key') {
            header.style.width = '15%';
        } else if (headerText === '%' || headerText === 'Time') {
            header.style.width = '7%';
        } else if (headerText === '') {
            header.style.width = '5%';
        }
        entriesHeader.appendChild(header);
    });
    entriesHeaderContainer.appendChild(entriesHeader);
    keyValueContainer.appendChild(entriesHeaderContainer);
    keyValueContainer.appendChild(entriesList);
// Create container for probability and time range inputs
// Create container for probability and time range inputs
const probTimeContainer = document.createElement('div');
probTimeContainer.style.display = 'flex';
probTimeContainer.style.gap = '10px';
probTimeContainer.style.marginBottom = '-4px';

// Create probability label and input
const probabilityContainer = document.createElement('div');
probabilityContainer.style.display = 'flex';
probabilityContainer.style.flexDirection = 'column';
probabilityContainer.style.width = '30%'; // Adjust width to fit the row better

const probabilityLabel = document.createElement('div');
probabilityLabel.innerText = 'Event Probability';
probabilityLabel.style.color = 'white';
probabilityLabel.style.marginBottom = '0px';
probabilityContainer.appendChild(probabilityLabel);

const probabilityInputContainer = document.createElement('div');
probabilityInputContainer.style.display = 'flex';
probabilityInputContainer.style.alignItems = 'center';

const probabilityInput = document.createElement('input');
probabilityInput.type = 'number';
probabilityInput.placeholder = '0-100';
probabilityInput.style.backgroundColor = '#1E1E1E';
probabilityInput.style.color = 'white';
probabilityInput.style.border = '1px solid #444444';
probabilityInput.style.borderRadius = '5px';
probabilityInput.style.padding = '5px';
probabilityInput.style.width = '85%';
probabilityInput.style.marginRight = '5px';
probabilityInputContainer.appendChild(probabilityInput);

const probabilityPercentLabel = document.createElement('span');
probabilityPercentLabel.innerText = '%';
probabilityPercentLabel.style.color = 'white';
probabilityInputContainer.appendChild(probabilityPercentLabel);

probabilityContainer.appendChild(probabilityInputContainer);
probTimeContainer.appendChild(probabilityContainer);

// Create time range label and input
const timeRangeContainer = document.createElement('div');
timeRangeContainer.style.display = 'flex';
timeRangeContainer.style.flexDirection = 'column';
timeRangeContainer.style.width = '30%'; // Adjust width to fit the row better

const timeRangeLabel = document.createElement('div');
timeRangeLabel.innerText = 'Time Range';
timeRangeLabel.style.color = 'white';
timeRangeLabel.style.marginBottom = '0px';
timeRangeContainer.appendChild(timeRangeLabel);

const timeRangeInputContainer = document.createElement('div');
timeRangeInputContainer.style.display = 'flex';
timeRangeInputContainer.style.alignItems = 'center';

const timeRangeInput = document.createElement('input');
timeRangeInput.type = 'text';
timeRangeInput.placeholder = '0-24';
timeRangeInput.value = '0-24'; // Set default value

timeRangeInput.style.backgroundColor = '#1E1E1E';
timeRangeInput.style.color = 'white';
timeRangeInput.style.border = '1px solid #444444';
timeRangeInput.style.borderRadius = '5px';
timeRangeInput.style.padding = '5px';
timeRangeInput.style.width = '85%';
timeRangeInput.style.marginRight = '5px';

timeRangeInput.addEventListener('blur', () => {
    const timeValue = timeRangeInput.value.trim();
    const timeRegex = /^([0-9]|1[0-9]|2[0-3])-(?:[0-9]|1[0-9]|2[0-3])$/;
    if (!timeRegex.test(timeValue)) {
        alert('Please enter a valid time range between 0-23, e.g., "8-16" or "0-24". Defaulting to "0-24".');
        timeRangeInput.value = '0-24';
    }
});

timeRangeInputContainer.appendChild(timeRangeInput);

const timeRangeUnitLabel = document.createElement('span');
timeRangeUnitLabel.innerText = 'h';
timeRangeUnitLabel.style.color = 'white';
timeRangeInputContainer.appendChild(timeRangeUnitLabel);

timeRangeContainer.appendChild(timeRangeInputContainer);
probTimeContainer.appendChild(timeRangeContainer);

// Create overall probability label and input
const overallProbabilityContainer = document.createElement('div');
overallProbabilityContainer.style.display = 'flex';
overallProbabilityContainer.style.flexDirection = 'column';
overallProbabilityContainer.style.width = '30%'; // Adjust width to fit the row better

const overallProbabilityLabel = document.createElement('div');
overallProbabilityLabel.innerText = 'Overall Probability';
overallProbabilityLabel.style.color = 'white';
overallProbabilityLabel.style.marginBottom = '0px';
overallProbabilityContainer.appendChild(overallProbabilityLabel);

const overallProbabilityInputContainer = document.createElement('div');
overallProbabilityInputContainer.style.display = 'flex';
overallProbabilityInputContainer.style.alignItems = 'center';

const overallProbabilityInput = document.createElement('input');
overallProbabilityInput.type = 'number';
overallProbabilityInput.placeholder = '0-100';
overallProbabilityInput.style.backgroundColor = '#202530';
overallProbabilityInput.style.color = 'white';
overallProbabilityInput.style.border = '1px solid #444444';
overallProbabilityInput.style.borderRadius = '5px';
overallProbabilityInput.style.padding = '5px';
overallProbabilityInput.style.marginRight = '5px';
overallProbabilityInput.style.width = '85%';

// Load the existing overall probability value if set
const savedProbability = localStorage.getItem('events.probability');
if (savedProbability) {
    overallProbabilityInput.value = savedProbability;
}

// Add event listener to save the value to localStorage when changed
overallProbabilityInput.addEventListener('input', () => {
    const probabilityValue = overallProbabilityInput.value.trim();
    if (probabilityValue !== '' && probabilityValue >= 0 && probabilityValue <= 100) {
        localStorage.setItem('events.probability', probabilityValue);
    } else {
        alert('Please enter a valid probability between 0 and 100.');
    }
});

overallProbabilityInputContainer.appendChild(overallProbabilityInput);

const overallProbabilityPercentLabel = document.createElement('span');
overallProbabilityPercentLabel.innerText = '%';
overallProbabilityPercentLabel.style.color = 'white';
overallProbabilityInputContainer.appendChild(overallProbabilityPercentLabel);

overallProbabilityContainer.appendChild(overallProbabilityInputContainer);
probTimeContainer.appendChild(overallProbabilityContainer);

// Append probability and time range container to the main keyValue container
keyValueContainer.appendChild(probTimeContainer);

// Create input for key
const keyInput = document.createElement('input');
keyInput.type = 'text';
keyInput.placeholder = 'Enter key';
keyInput.style.backgroundColor = '#1E1E1E';
keyInput.style.color = 'white';
keyInput.style.border = '1px solid #444444';
keyInput.style.borderRadius = '5px';
keyInput.style.padding = '5px';
keyInput.style.marginBottom = '-4px';
keyValueContainer.appendChild(keyInput);

// Create input for value
const valueInput = document.createElement('textarea');
valueInput.placeholder = 'Enter value';
valueInput.style.backgroundColor = '#1E1E1E';
valueInput.style.color = 'white';
valueInput.style.border = '1px solid #444444';
valueInput.style.borderRadius = '5px';
valueInput.style.padding = '5px';
valueInput.style.height = '80px';
valueInput.style.overflowWrap = 'break-word';
valueInput.style.overflow = 'auto';
valueInput.style.marginBottom = '-4px';
keyValueContainer.appendChild(valueInput);


// Create button to add key-value pair
const addEntryButton = document.createElement('button');
addEntryButton.innerText = 'Add Entry';
    addEntryButton.innerText = 'Add Entry';
    addEntryButton.style.padding = '10px 20px';
    addEntryButton.style.border = '0.2px solid #4E4E4E';
    addEntryButton.style.backgroundColor = '#2F2F2F';
    addEntryButton.style.color = '#fff';
    addEntryButton.style.borderRadius = '50px';
    addEntryButton.style.cursor = 'pointer';

    addEntryButton.onmouseover = () => {
        addEntryButton.style.backgroundColor = '#424242';
    };
    addEntryButton.onmouseout = () => {
        addEntryButton.style.backgroundColor = 'transparent';
    };

addEntryButton.onclick = function () {
    if (!selectedProfile) {
        alert('Please select a profile before adding entries.');
        return;
    }

    const key = keyInput.value.trim();
    const value = `<${valueInput.value.trim()}>`;
    const probability = probabilityInput.value.trim();
    const timeRange = timeRangeInput.value.trim();
    const fullKey = `events.${selectedProfile}:${key}`;

    if (key && value) {
        if (!localStorage.getItem(fullKey)) {
            const entryData = {
                value: value,
                probability: probability || '100',
                timeRange: timeRange || '0-24'
            };
            localStorage.setItem(fullKey, JSON.stringify(entryData));
            loadEntries();

            // Clear the input fields after adding the entry
            keyInput.value = '';
            valueInput.value = '';
            probabilityInput.value = '100';
            timeRangeInput.value = '0-24';



        } else {
            alert('Entry with this key already exists. Please use a different key.');
        }
    }
};
keyValueContainer.appendChild(addEntryButton);

// Append containers to profilePanel
profilePanel.appendChild(profileListContainer);
profilePanel.appendChild(keyValueContainer);



    // Load saved profiles and entries
    let selectedProfile = localStorage.getItem('events.selectedProfile');

    function loadProfiles() {
        profileList.innerHTML = '';
        for (let key in localStorage) {
            if (key.startsWith('events.profile.')) {
                const profileName = key.replace('events.profile.', '');
                const listItem = document.createElement('li');
                listItem.style.display = 'flex';
                listItem.style.alignItems = 'center';
                listItem.style.cursor = 'pointer';

                const nameSpan = document.createElement('span');
                nameSpan.innerText = profileName;
                nameSpan.style.flex = '1';
                listItem.appendChild(nameSpan);

                listItem.onclick = function() {
                    if (selectedProfile === profileName) {
                        selectedProfile = null;
                        localStorage.setItem('events.selectedProfile', '');
                        listItem.style.backgroundColor = '';
                        loadEntries();
                    } else {
                        selectedProfile = profileName;
                        localStorage.setItem('events.selectedProfile', selectedProfile);
                        loadEntries();
                        highlightSelectedProfile(listItem);
                    }
                };

                const deleteButton = document.createElement('button');
    //            deleteButton.innerText = 'x';
deleteButton.style.backgroundColor = 'transparent';
deleteButton.style.borderRadius = '50%';
deleteButton.style.marginLeft = '10px';
deleteButton.style.border = 'none';
deleteButton.style.color = '#ffffff';
deleteButton.style.cursor = 'pointer';
deleteButton.style.padding = '14px';
deleteButton.style.width = '15px';
deleteButton.style.height = '15px';
deleteButton.style.display = 'flex';
deleteButton.style.alignItems = 'center';
deleteButton.style.justifyContent = 'center';

deleteButton.style.transition = 'background-color 0.1s';

// Hover effect
deleteButton.addEventListener('mouseenter', () => {
//    closeButton.style.transform = 'scale(1.1)';
    deleteButton.style.backgroundColor = '#676767';
});

deleteButton.addEventListener('mouseleave', () => {
//    closeButton.style.transform = 'scale(1)';
    deleteButton.style.backgroundColor = 'transparent';
});



const closeIcon2 = document.createElement('span');
closeIcon2.innerText = '✕';
closeIcon2.style.fontSize = '16px';
closeIcon2.style.position = 'relative';
closeIcon2.style.top = '-1px'; // Adjust this value to move the character up

deleteButton.appendChild(closeIcon2);



                deleteButton.onclick = function(event) {
                    event.stopPropagation();
                    localStorage.removeItem(`events.profile.${profileName}`);
                    if (selectedProfile === profileName) {
                        selectedProfile = null;
                        localStorage.setItem('events.selectedProfile', '');
                    }
                    loadProfiles();
                    loadEntries();
                };
                listItem.appendChild(deleteButton);

                if (selectedProfile === profileName) {
                    highlightSelectedProfile(listItem);
                }
                profileList.appendChild(listItem);
            }
        }
    }

    function openAddProfileDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#424242';
        dialog.style.padding = '20px';
        dialog.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        dialog.style.zIndex = '1100';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter profile name';
        dialog.appendChild(input);

        const addButton = document.createElement('button');
        addButton.innerText = 'Add';
        addButton.style.marginLeft = '10px';
        addButton.onclick = function() {
            const profileName = input.value.trim();
            if (profileName && !localStorage.getItem(`events.profile.${profileName}`)) {
                localStorage.setItem(`events.profile.${profileName}`, JSON.stringify({}));
                loadProfiles();
                document.body.removeChild(dialog);
            }
        };
        dialog.appendChild(addButton);

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.style.marginLeft = '10px';
        cancelButton.onclick = function() {
            document.body.removeChild(dialog);
        };
        dialog.appendChild(cancelButton);

        document.body.appendChild(dialog);
    }

    function loadEntries() {
        entriesList.innerHTML = '';
        // Add header back after clearing
        if (selectedProfile) {
            for (let key in localStorage) {
                if (key.startsWith(`events.${selectedProfile}:`)) {
                    const entryData = JSON.parse(localStorage.getItem(key));
                    const row = document.createElement('div');
                    row.style.padding = '10px';
                    row.style.margin = '5px 0';
                    row.style.borderRadius = '10px';
                    row.style.marginBottom = '12px';
                    row.style.backgroundColor = '#424242';
                    row.style.display = 'flex';
                    row.style.alignItems = 'center';

                    // Create cells for key, value, probability, and time range
                    const keyCell = document.createElement('div');
                    keyCell.innerText = key.split(':')[1];
                    keyCell.style.padding = '5px';
                    keyCell.style.width = '15%';
                    row.appendChild(keyCell);

                    const valueCell = document.createElement('div');
                    valueCell.innerText = entryData.value.slice(1, -1); // Remove surrounding brackets
                    valueCell.style.padding = '5px';
                    valueCell.style.width = '60%';
                    row.appendChild(valueCell);

                    const probabilityCell = document.createElement('div');
                    probabilityCell.innerText = `${entryData.probability}%`;
                    probabilityCell.style.padding = '5px';
                    probabilityCell.style.width = '10%';
                    row.appendChild(probabilityCell);

                    const timeRangeCell = document.createElement('div');
                    timeRangeCell.innerText = entryData.timeRange;
                    timeRangeCell.style.padding = '5px';
                    timeRangeCell.style.width = '10%';
                    row.appendChild(timeRangeCell);



/*// Create close button for profilePanel
const closeButton = document.createElement('button');
closeButton.style.position = 'absolute';
closeButton.style.top = '15px';
closeButton.style.right = '15px';
closeButton.style.width = '30px';
closeButton.style.height = '30px';
closeButton.style.backgroundColor = 'transparent';
closeButton.style.color = '#ffffff';
closeButton.style.border = 'none';
closeButton.style.borderRadius = '50%';
closeButton.style.cursor = 'pointer';
closeButton.style.display = 'flex';
closeButton.style.alignItems = 'center';
closeButton.style.justifyContent = 'center';
closeButton.style.transition = 'background-color 0.2s ease';
closeButton.style.boxSizing = 'border-box';

// Create span for the '✕' character
const closeIcon = document.createElement('span');
closeIcon.innerText = '✕';
closeIcon.style.fontSize = '16px';
closeIcon.style.position = 'relative';
closeIcon.style.top = '-1px'; // Adjust this value to move the character up

// Append the span to the button
closeButton.appendChild(closeIcon);

*/

                    // Add remove button for each entry
                    const actionCell = document.createElement('div');
                    actionCell.style.padding = '5px';
                    actionCell.style.width = '5%';
                    const removeButton = document.createElement('button');
                //    removeButton.innerText = '✕';
removeButton.style.backgroundColor = 'transparent';
removeButton.style.border = 'none';
removeButton.style.cursor = 'pointer';
removeButton.style.display = 'flex';
removeButton.style.alignItems = 'center';
removeButton.style.justifyContent = 'center';
removeButton.style.width = '100%';
removeButton.style.height = '100%';
removeButton.style.transition = 'background-color 0.2s ease';
removeButton.style.borderRadius = '50%';
removeButton.style.width = '28px';
removeButton.style.height = '28px';
removeButton.style.marginLeft = '-3px';
removeButton.style.boxSizing = 'border-box';
                    removeButton.onclick = function() {
                        localStorage.removeItem(key);
                        loadEntries();
                    };

const closeIcon1 = document.createElement('span');
closeIcon1.innerText = '✕';
closeIcon1.style.fontSize = '16px';
closeIcon1.style.position = 'relative';
closeIcon1.style.top = '-1px'; // Adjust this value to move the character up

                // Append the span to the button
                    removeButton.appendChild(closeIcon1);
                    actionCell.appendChild(removeButton);
                    row.appendChild(actionCell);

// Hover effect
removeButton.addEventListener('mouseenter', () => {
    removeButton.style.backgroundColor = '#676767';
});

removeButton.addEventListener('mouseleave', () => {
    removeButton.style.backgroundColor = 'transparent';
});


                    // Make the row editable when clicked
                    row.onclick = function() {
                        keyInput.value = key.split(':')[1];
                        valueInput.value = entryData.value.slice(1, -1); // Remove surrounding brackets for editing
                        probabilityInput.value = entryData.probability;
                        timeRangeInput.value = entryData.timeRange;
                    };

                    entriesList.appendChild(row);
                }
            }
        }
    }





    function highlightSelectedProfile(selectedItem) {
        // Remove highlight from all items
        Array.from(profileList.children).forEach(item => {
            item.style.backgroundColor = '';
        });
        // Highlight the selected item
        selectedItem.style.backgroundColor = '#444444';
        selectedItem.style.borderRadius = '10px';
        selectedItem.style.padding = '10px';
    }

    loadProfiles();
    loadEntries();

    // Append profilePanel to body
    document.body.appendChild(profilePanel);
}



// Function to select a random entry and output to console
function getRandomEntry() {
    const selectedProfile = localStorage.getItem('events.selectedProfile');
    if (selectedProfile) {
        let profileEntries = [];
        const currentHour = new Date().getHours();
        for (let key in localStorage) {
            if (key.startsWith(`events.${selectedProfile}:`)) {
                const entryData = JSON.parse(localStorage.getItem(key));
                const [startHour, endHour] = entryData.timeRange.split('-').map(Number);
                // Check if current hour is within the specified time range
                if (currentHour >= startHour && currentHour < endHour) {
                    profileEntries.push({ key, ...entryData });
                }
            }
        }
        if (profileEntries.length > 0) {
            const probability = parseInt(localStorage.getItem('events.probability') || '100', 10);
            let selectedEntry = null;
            while (profileEntries.length > 0) {
                // Randomly select an entry from the available entries
                const randomIndex = Math.floor(Math.random() * profileEntries.length);
                const randomEntry = profileEntries[randomIndex];
                // Check if the entry passes the individual probability check
                if (Math.random() * 100 < randomEntry.probability) {
                    selectedEntry = randomEntry;
                    break;
                } else {
                    // Remove the entry from the list if it fails the probability check
                    profileEntries.splice(randomIndex, 1);
                }
            }
            if (selectedEntry && Math.random() * 100 < probability) {
                console.log(`Random Entry - Key: ${selectedEntry.key}, Value: ${selectedEntry.value}`);

                // Add the entry to the textarea
                const textarea = document.querySelector('div#prompt-textarea.ProseMirror');
                if (textarea) {
                    // Create a new paragraph element for the random entry, like the customMessages
                    const newParagraph = document.createElement('p');
                    newParagraph.textContent = selectedEntry.value;
                    textarea.appendChild(newParagraph);

                    console.log('Random entry added as a new paragraph.');
                } else {
                    console.log('Textarea not found.');
                }
            } else {
                console.log('No entry selected this time based on the given probability.');
            }
        } else {
            console.log('No entries available for the selected profile in the current time range.');
        }
    } else {
        console.log('No profile selected. Please select a profile to retrieve a random entry.');
    }
}

// Expose the function to be accessible from other scripts
window.getRandomEntry = getRandomEntry;



})();

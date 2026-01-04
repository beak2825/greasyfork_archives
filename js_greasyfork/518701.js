// ==UserScript==
// @name         Discord/Shapes - Lorebook
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Storing and loading Lorebook Entries for Discord/Shapes
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        unsafeWindow
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/518701/DiscordShapes%20-%20Lorebook.user.js
// @updateURL https://update.greasyfork.org/scripts/518701/DiscordShapes%20-%20Lorebook.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Create and add the arrow button to open the storage panel
const arrowButton = document.createElement('div');
arrowButton.innerHTML = '&#x2329;'; // Unicode for a more spread left-pointing angle bracket
arrowButton.style.position = 'fixed';
arrowButton.style.bottom = '50%';
arrowButton.style.right = '0'; // Start visible at the screen edge
arrowButton.style.padding = '10px';
arrowButton.style.fontSize = '24px';
arrowButton.style.zIndex = '1000';
arrowButton.style.cursor = 'pointer';
//arrowButton.style.backgroundColor = '#212121';
arrowButton.style.color = '#B4B4B4'; // Light grey color
arrowButton.style.borderRadius = '5px 0 0 5px';
arrowButton.style.transition = 'transform 0.3s ease, right 0.3s ease, background-color 0.1s';

arrowButton.onmouseover = () => {
    arrowButton.style.backgroundColor = 'transparent';
};
arrowButton.onmouseout = () => {
    arrowButton.style.backgroundColor = 'transparent';
};

document.body.appendChild(arrowButton);
// Create the fancy sliding panel
unsafeWindow.DCstoragePanel = document.createElement('div');
DCstoragePanel.style.position = 'fixed';
DCstoragePanel.style.top = '0';
DCstoragePanel.style.right = '-250px'; // Initially hidden
DCstoragePanel.style.height = '100%';
DCstoragePanel.style.width = '250px';
DCstoragePanel.style.backgroundColor = '#171717';
//storagePanel.style.boxShadow = '-4px 0px 8px rgba(0, 0, 0, 0.5)';
DCstoragePanel.style.transition = 'right 0.3s ease';
DCstoragePanel.style.zIndex = '999';

document.body.appendChild(DCstoragePanel);

// Create the header above the button
const storagePanelHeader = document.createElement('div');
storagePanelHeader.innerText = 'Shapes Tools';
storagePanelHeader.style.margin = '20px';
storagePanelHeader.style.padding = '10px';
storagePanelHeader.style.fontSize = '19px';
storagePanelHeader.style.fontWeight = '550';
storagePanelHeader.style.color = '#ECECEC';
storagePanelHeader.style.textAlign = 'center';

DCstoragePanel.appendChild(storagePanelHeader);

// Create a divider line
const dividerLine = document.createElement('div');
dividerLine.style.height = '1px';
dividerLine.style.backgroundColor = '#212121'; // Dark grey color for subtle separation
dividerLine.style.margin = '10px 20px'; // Space around the line (top/bottom, left/right)
DCstoragePanel.appendChild(dividerLine);
// Create the button inside the panel

    // Create the button to open the panel
    const button = document.createElement('button');
    button.id = 'profileManagerButton';
    button.innerText = 'Manage Lorebook';
button.style.marginTop = '20px';
button.style.marginLeft = '13px';
button.style.marginRight = '5px';
button.style.padding = '7px 15px';
button.style.fontSize = '16px';
button.style.cursor = 'pointer';
button.style.backgroundColor = 'transparent';
button.style.color = '#b0b0b0'; // Light grey text color
button.style.borderRadius = '8px';
button.style.textAlign = 'center';
button.style.width = '90%';
button.style.transition = 'background-color 0.1s, color 0.1s';

button.onmouseover = () => {
  button.style.backgroundColor = '#212121';
  button.style.color = '#ffffff';
};
button.onmouseout = () => {
  button.style.backgroundColor = 'transparent';
  button.style.color = '#b0b0b0';
};

    DCstoragePanel.appendChild(button);
//DCstoragePanel.appendChild(uiButton);
//DCstoragePanel.appendChild(settingsWindow);
//DCstoragePanel.appendChild(importButton);
//DCstoragePanel.appendChild(exportButton);
// Toggle panel visibility
arrowButton.addEventListener('click', () => {
    if (DCstoragePanel.style.right === '-250px') {
        DCstoragePanel.style.right = '0';
        arrowButton.style.right = '250px'; // Clamp arrow button to the panel border
        arrowButton.style.transform = 'rotate(180deg)'; // Rotate the arrow
    } else {
        DCstoragePanel.style.right = '-250px';
        arrowButton.style.right = '0'; // Keep arrow button visible at the screen edge
        arrowButton.style.transform = 'rotate(0deg)';
    }
});






// Create the main panel container
const panel = document.createElement('div');
panel.id = 'profileManagerPanel';
panel.style.position = 'fixed';
panel.style.top = '50%';
panel.style.left = '50%';
panel.style.transform = 'translate(-50%, -50%)';

// Check if the device is mobile
if (window.innerWidth <= 768) { // Example threshold for mobile
    panel.style.width = '90%'; // Wider for mobile
    panel.style.height = '90%'; // Taller for mobile
} else {
    panel.style.width = '800px'; // Default for non-mobile
    panel.style.height = '700px'; // Default for non-mobile
}

panel.style.backgroundColor = '#2F2F2F';
panel.style.borderRadius = '20px';
panel.style.padding = '10px';
panel.style.display = 'none';
panel.style.zIndex = '1000';
document.body.appendChild(panel);

    // Add close button for the panel
    const closeButton = document.createElement('button');
    closeButton.innerText = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.borderRadius = '50%';
    closeButton.style.color = '#ffffff';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.cursor = 'pointer';

// Hover effect
closeButton.addEventListener('mouseenter', () => {
//    closeButton.style.transform = 'scale(1.1)';
    closeButton.style.backgroundColor = '#676767';
});

closeButton.addEventListener('mouseleave', () => {
//    closeButton.style.transform = 'scale(1)';
    closeButton.style.backgroundColor = 'transparent';
});


    panel.appendChild(closeButton);



    closeButton.addEventListener('click', () => {
        panel.style.display = 'none';
    });

    // Toggle panel visibility when button is clicked
    button.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        loadProfileEntries();
    });

const profileslabel = document.createElement('div');
profileslabel.textContent = 'Profiles';
profileslabel.style.color = '#dddddd';
profileslabel.style.fontSize = '14px';
profileslabel.style.marginBottom = '5px';
profileslabel.style.marginLeft = '3px';
profileslabel.style.marginTop = '5px';
profileslabel.style.fontSize = '20px';
profileslabel.style.fontWeight = '550';
    panel.appendChild(profileslabel);
    // Create the profile management panel
    const profilePanel = document.createElement('div');
    profilePanel.id = 'profilePanel';
    profilePanel.style.float = 'left';
    profilePanel.style.width = '20%';
    profilePanel.style.borderRight = '0.5px solid #444444';
    profilePanel.style.height = '93%';

    panel.appendChild(profilePanel);

    // Create the profile list container
    const profileList = document.createElement('div');
    profileList.id = 'profileList';
    profileList.style.height = '95%';
    profileList.style.color = 'white';
    profileList.style.overflowY = 'auto';

    profilePanel.appendChild(profileList);

    // Create the add profile button
    const addProfileButton = document.createElement('button');
    addProfileButton.innerText = 'Add Profile';
    addProfileButton.style.padding = '8px';
    addProfileButton.style.border = '0.2px solid #4E4E4E';
    addProfileButton.style.backgroundColor = 'transparent';
    addProfileButton.style.color = '#fff';
    addProfileButton.style.borderRadius = '20px';
    addProfileButton.style.width = '90%';
    addProfileButton.style.cursor = 'pointer';

addProfileButton.onmouseover = () => {
    addProfileButton.style.backgroundColor = '#424242';
};
addProfileButton.onmouseout = () => {
    addProfileButton.style.backgroundColor = 'transparent';
};
   profilePanel.appendChild(addProfileButton);


    // Add functionality to add profile button
    addProfileButton.addEventListener('click', () => {
        const profileName = prompt('Enter profile name:');
        if (profileName) {
            const profileKey = `profile-${profileName}`;
            if (!localStorage.getItem(profileKey)) {
                localStorage.setItem(profileKey, JSON.stringify({}));  // Save profile under key "profile-[profilename]" with empty value
                loadProfiles();
            } else {
                alert('Profile already exists.');
            }
        }
    });

    // Create the profile selection functionality
    function loadProfiles() {
        profileList.innerHTML = '';
        Object.keys(localStorage).forEach(profileKey => {
            if (profileKey.startsWith('profile-')) {
                const profileName = profileKey.replace('profile-', '');
                const profileItem = document.createElement('div');
                profileItem.innerText = profileName;
                profileItem.style.padding = '5px';
                profileItem.style.marginBottom = '5px';
                profileItem.style.cursor = 'pointer';
                profileItem.style.backgroundColor = profileName === getCurrentProfile() ? '#424242' : '#2F2F2F';
                profileItem.style.borderRadius = '5px';
                profileItem.style.width = '90%';
                profileItem.style.position = 'relative';

                profileItem.addEventListener('click', () => {
                    setCurrentProfile(profileName);
                    loadProfiles();
                    loadProfileEntries();
                });

                const removeButton = document.createElement('button');
                removeButton.innerText = '✕';
                removeButton.style.position = 'absolute';
                removeButton.style.top = '3px';
                removeButton.style.right = '10px';
                removeButton.style.cursor = 'pointer';
                removeButton.style.backgroundColor = 'transparent';
                removeButton.style.color = 'white';
                removeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    localStorage.removeItem(profileKey);
                    if (profileName === getCurrentProfile()) {
                        setCurrentProfile(null);
                    }
                    loadProfiles();
                    loadProfileEntries();
                });

                profileItem.appendChild(removeButton);
                profileList.appendChild(profileItem);
            }
        });
    }



    const title = document.createElement('h3');
    title.innerText = 'Manage Lorebook Entries';
    title.style.fontWeight = 'normal';
    title.style.color = '#ffffff';
    title.style.textAlign = 'left';
    title.style.fontSize = '24px';
    title.style.marginTop = '20px';
    title.style.position = 'relative';
    title.style.marginLeft = '23%';
    title.style.marginBottom = '15px';
    title.style.fontWeight = '550';
    panel.appendChild(title);
    // Create profile entries list
    const profileEntriesList = document.createElement('div');
    profileEntriesList.id = 'profileEntriesList';
    profileEntriesList.style.marginTop = '20px';
    profileEntriesList.style.height = '48%';
// Check if the device is mobile
if (window.innerWidth <= 768) { // Example threshold for mobile
    profileEntriesList.style.height = '30%';
} else {
    profileEntriesList.style.height = '48%';
}


    profileEntriesList.style.overflowY = 'auto';
    panel.appendChild(profileEntriesList);


const entrieslabel = document.createElement('div');
entrieslabel.textContent = 'Enter keys and description:';
entrieslabel.style.color = '#dddddd';
entrieslabel.style.fontSize = '14px';
entrieslabel.style.marginBottom = '5px';
entrieslabel.style.marginTop = '5px';
    entrieslabel.style.marginLeft = '23%';
    panel.appendChild(entrieslabel);
    // Create key-value input fields
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inputContainer';
    inputContainer.style.marginTop = '10px';
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.alignItems = 'center'; // Center children horizontally
    inputContainer.style.margin = '0 auto';
    panel.appendChild(inputContainer);

    const keyInput = document.createElement('input');
//    keyInput.id = 'keyInput';
    keyInput.type = 'text';
    keyInput.placeholder = 'Entry Keywords (comma-separated)';
    keyInput.style.width = '90%';
    keyInput.style.marginBottom = '5px';
    keyInput.style.padding = '10px';
    keyInput.style.border = '1px solid #444444';
    keyInput.style.borderRadius = '8px';
    keyInput.style.backgroundColor = '#1e1e1e';
    keyInput.style.color = '#dddddd';
    inputContainer.appendChild(keyInput);

    const valueInput = document.createElement('textarea');
//    valueInput.id = 'valueInput';
    valueInput.placeholder = ' ';
    valueInput.style.width = '90%';
    valueInput.style.marginBottom = '5px';
valueInput.style.padding = '10px';
valueInput.style.border = '1px solid #444444';
valueInput.style.borderRadius = '8px';
valueInput.style.backgroundColor = '#1e1e1e';
valueInput.style.color = '#dddddd';
valueInput.style.height = '100px';
valueInput.style.resize = 'vertical';
valueInput.maxLength = 1000;
valueInput.style.overflow = 'auto';

const charCounter = document.createElement('div');
charCounter.style.color = '#dddddd';
charCounter.style.fontSize = '12px';
charCounter.style.marginTop = '0px';
charCounter.style.marginBottom = '15px';
charCounter.style.textAlign = 'right';
charCounter.style.marginRight = '-87%';
charCounter.style.color = 'grey';
charCounter.textContent = `0/${valueInput.maxLength}`;

// Update the counter as the user types
valueInput.addEventListener('input', () => {
  charCounter.textContent = `${valueInput.value.length}/${valueInput.maxLength}`;
});



    inputContainer.appendChild(valueInput);
    inputContainer.appendChild(charCounter);
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Add Entry';
    saveButton.style.padding = '10px 20px';
    saveButton.style.border = '0.2px solid #4E4E4E';
    saveButton.style.backgroundColor = '#2F2F2F';
    saveButton.style.color = '#fff';
    saveButton.style.borderRadius = '50px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.width = '95%';

    inputContainer.appendChild(saveButton);

    let isEditing = false;
    let editingKey = '';

saveButton.addEventListener('click', () => {
    const key = keyInput.value.trim(); // Trim any extra spaces
    const value = valueInput.value;
    const currentProfile = getCurrentProfile();

    if (key && currentProfile) {
        const profileKey = `${currentProfile}-lorebook:${key.toLowerCase()}`; // Normalize to lowercase
        const formattedValue = `<[Lorebook: ${key}] ${value}>`;

        // Check for duplicate keys (case-insensitive)
        const isDuplicateKey = Object.keys(localStorage).some(storageKey => {
            return storageKey.toLowerCase() === profileKey.toLowerCase();
        });

        // Allow overwrite if editing, otherwise enforce uniqueness
        if (!isEditing && isDuplicateKey) {
            alert('The key is already used in an existing entry (case-insensitive). Please use a different key.');
            return;
        }

        localStorage.setItem(profileKey, formattedValue);
//        alert('Saved!');
        keyInput.value = ''; // Clear the key input
        valueInput.value = ''; // Clear the value input
        isEditing = false;
        editingKey = '';
        loadProfileEntries();
    } else {
        alert('Please select a profile and enter a key.');
    }
});


function loadProfileEntries() {
    profileEntriesList.innerHTML = '';
    profileEntriesList.style.display = 'flex';
    profileEntriesList.style.flexDirection = 'column';
    profileEntriesList.style.alignItems = 'center'; // Center children horizontally
    profileEntriesList.style.margin = '0 auto';    // Center the entire container

    const currentProfile = getCurrentProfile();
    if (currentProfile) {
        Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(`${currentProfile}-lorebook:`)) {
                const entryKey = storageKey.replace(`${currentProfile}-lorebook:`, '');
                const entryValue = localStorage.getItem(storageKey);
                const displayedValue = entryValue.replace(/^<\[Lorebook:.*?\]\s*/, '').replace(/>$/, '');

                const entryItem = document.createElement('div');
                entryItem.style.padding = '10px';
                entryItem.style.marginBottom = '12px';
                entryItem.style.borderRadius = '8px';
 //               entryItem.style.borderBottom = '0.5px solid #424242';
                entryItem.style.backgroundColor = '#424242';
                entryItem.style.position = 'relative';
                entryItem.style.color = 'white';
                entryItem.style.flexDirection = 'column';
                entryItem.style.width = '90%';


                const keyElement = document.createElement('div');
                keyElement.innerText = entryKey;
                keyElement.style.fontWeight = 'bold';
                keyElement.style.marginBottom = '10px';
                entryItem.appendChild(keyElement);

                const valueElement = document.createElement('div');
                valueElement.innerText = displayedValue;
                entryItem.appendChild(valueElement);

                entryItem.addEventListener('click', () => {
                    keyInput.value = entryKey;
                    valueInput.value = entryValue.replace(`<[Lorebook: ${entryKey}] `, '').replace('>', '');
                    isEditing = true;
                    editingKey = entryKey;
                });

                const removeButton = document.createElement('button');
                removeButton.innerText = '✕';
                removeButton.style.position = 'absolute';
                removeButton.style.top = '10px';
                removeButton.style.right = '10px';
                removeButton.style.cursor = 'pointer';
                removeButton.style.backgroundColor = 'transparent';
                removeButton.style.color = 'white';
                removeButton.addEventListener('click', () => {
                    localStorage.removeItem(storageKey);
                    loadProfileEntries();
                });

                entryItem.appendChild(removeButton);
                profileEntriesList.appendChild(entryItem);
            }
        });
    }
}


    // Utility functions to manage profiles and local storage
    function getCurrentProfile() {
        return localStorage.getItem('currentProfile');
    }

    function setCurrentProfile(profileName) {
        localStorage.setItem('currentProfile', profileName);
    }

    // Initial load
    loadProfiles();
})();

// ==UserScript==
// @name         Discord/Shapes Tools
// @namespace    https://vishanka.com
// @version      3.3
// @description  Various Functions for Shapes.inc for Discord
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      Proprietary
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518989/DiscordShapes%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/518989/DiscordShapes%20Tools.meta.js
// ==/UserScript==


(function() {
    'use strict';
let notifierActive = false;

// ================================================================== LOREBOOK ==================================================================
function LorebookScript(){

// Create and add the arrow button to open the storage panel
const arrowButton = document.createElement('div');
arrowButton.innerHTML = '&#x2329;';
arrowButton.style.position = 'fixed';
arrowButton.style.bottom = '50%';
arrowButton.style.right = '0';
arrowButton.style.padding = '10px';
arrowButton.style.fontSize = '24px';
arrowButton.style.zIndex = '1000';
arrowButton.style.cursor = 'pointer';
arrowButton.style.color = '#B4B4B4';
arrowButton.style.borderRadius = '5px 0 0 5px';
arrowButton.style.transition = 'transform 0.3s ease, right 0.3s ease, background-color 0.1s';

// Toggle panel visibility
arrowButton.addEventListener('click', () => {
  if (DCstoragePanel.style.right === '-250px') {
    DCstoragePanel.style.right = '0';
    arrowButton.style.right = '250px';
    arrowButton.style.transform = 'rotate(180deg)';
  } else {
    DCstoragePanel.style.right = '-250px';
    arrowButton.style.right = '0';
    arrowButton.style.transform = 'rotate(0deg)';
  }
});

// Create the fancy sliding panel
window.DCstoragePanel = document.createElement('div');
DCstoragePanel.style.position = 'fixed';
DCstoragePanel.style.top = '0';
DCstoragePanel.style.right = '-250px'; // Initially hidden
DCstoragePanel.style.height = '100%';
DCstoragePanel.style.width = '250px';
DCstoragePanel.style.backgroundColor = '#171717';
DCstoragePanel.style.transition = 'right 0.3s ease';
DCstoragePanel.style.zIndex = '999';

// Create the header above the button
const storagePanelHeader = document.createElement('div');
storagePanelHeader.innerText = 'Shapes Tools';
storagePanelHeader.style.margin = '20px';
storagePanelHeader.style.padding = '10px';
storagePanelHeader.style.fontSize = '19px';
storagePanelHeader.style.fontWeight = '550';
storagePanelHeader.style.color = '#ECECEC';
storagePanelHeader.style.textAlign = 'center';

// Create a divider line
const dividerLine = document.createElement('div');
dividerLine.style.height = '1px';
dividerLine.style.backgroundColor = '#212121';
dividerLine.style.margin = '10px 20px';

// Manage Lorebook Button
window.openLorebookButton = document.createElement('div');
window.openLorebookButton.innerHTML = `
    <button id="toggle-lorebook-panel"
        style="
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            top: 10px;
            right: 0px;
            left: 10px;
            padding: 7px 15px;
            background: transparent;
            color: #b0b0b0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.1s, color 0.1s;
            z-index: 1001;">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-[-1px]">
            <path d="M6 3C4.89543 3 4 3.89543 4 5V13C4 14.1046 4.89543 15 6 15L6 3Z" fill="currentColor"></path>
            <path d="M7 3V15H8.18037L8.4899 13.4523C8.54798 13.1619 8.69071 12.8952 8.90012 12.6858L12.2931 9.29289C12.7644 8.82153 13.3822 8.58583 14 8.58578V3.5C14 3.22386 13.7761 3 13.5 3H7Z" fill="currentColor"></path>
            <path d="M11.3512 15.5297L9.73505 15.8529C9.38519 15.9229 9.07673 15.6144 9.14671 15.2646L9.46993 13.6484C9.48929 13.5517 9.53687 13.4628 9.60667 13.393L12.9996 10C13.5519 9.44771 14.4473 9.44771 14.9996 10C15.5519 10.5523 15.5519 11.4477 14.9996 12L11.6067 15.393C11.5369 15.4628 11.448 15.5103 11.3512 15.5297Z" fill="currentColor"></path>
        </svg>
        Manage Lorebook
    </button>
`;

const lorebookButtonElement = openLorebookButton.querySelector('button');
lorebookButtonElement.onmouseover = () => {
    lorebookButtonElement.style.backgroundColor = '#212121';
    lorebookButtonElement.style.color = '#ffffff';
};
lorebookButtonElement.onmouseout = () => {
    lorebookButtonElement.style.backgroundColor = 'transparent';
    lorebookButtonElement.style.color = '#b0b0b0';
};

// Create the main panel container
const lorebookPanel = document.createElement('div');
lorebookPanel.id = 'lorebookManagerPanel';
lorebookPanel.style.position = 'fixed';
lorebookPanel.style.top = '50%';
lorebookPanel.style.left = '50%';
lorebookPanel.style.transform = 'translate(-50%, -50%)';
// Size different for Mobile and Desktop
if (window.innerWidth <= 768) {
    lorebookPanel.style.width = '90%';
    lorebookPanel.style.height = '90%';
} else {
    lorebookPanel.style.width = '800px';
    lorebookPanel.style.height = '700px';
}
lorebookPanel.style.backgroundColor = '#2F2F2F';
lorebookPanel.style.borderRadius = '20px';
lorebookPanel.style.padding = '10px';
lorebookPanel.style.display = 'none';
lorebookPanel.style.zIndex = '1000';

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

closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = '#676767';
});
closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'transparent';
});

// Hide the Lorebook Panel
closeButton.addEventListener('click', () => {
    lorebookPanel.style.display = 'none';
});

// Open the Lorebook Panel
openLorebookButton.addEventListener('click', () => {
    lorebookPanel.style.display = lorebookPanel.style.display === 'none' ? 'block' : 'none';
    loadProfileEntries();
});

// Profiles Title
const profileslabel = document.createElement('div');
profileslabel.textContent = 'Profiles';
profileslabel.style.color = '#dddddd';
profileslabel.style.fontSize = '14px';
profileslabel.style.marginBottom = '5px';
profileslabel.style.marginLeft = '3px';
profileslabel.style.marginTop = '5px';
profileslabel.style.fontSize = '20px';
profileslabel.style.fontWeight = '550';

// Profile Management Panel
const lorebookProfilePanel = document.createElement('div');
lorebookProfilePanel.id = 'lorebookProfilePanel';
lorebookProfilePanel.style.float = 'left';
lorebookProfilePanel.style.width = '20%';
lorebookProfilePanel.style.borderRight = '0.5px solid #444444';
lorebookProfilePanel.style.height = '93%';

// Create the profile list container
const profileList = document.createElement('div');
profileList.id = 'profileList';
profileList.style.height = '95%';
profileList.style.color = 'white';
profileList.style.overflowY = 'auto';

// Add Profiles Button
const addProfileButton = document.createElement('button');
addProfileButton.innerText = 'Add Profile';
addProfileButton.style.padding = '8px';
addProfileButton.style.border = '0.2px solid #4E4E4E';
addProfileButton.style.backgroundColor = 'transparent';
addProfileButton.style.color = '#fff';
addProfileButton.style.borderRadius = '20px';
addProfileButton.style.width = '90%';
addProfileButton.style.cursor = 'pointer';

// Mouseover Effect for Add Profiles Button
addProfileButton.onmouseover = () => {
    addProfileButton.style.backgroundColor = '#424242';
};
addProfileButton.onmouseout = () => {
    addProfileButton.style.backgroundColor = 'transparent';
};

addProfileButton.addEventListener('click', () => {
    const profileName = prompt('Enter profile name:');
    if (profileName) {
        const profileKey = `lorebook.profile:${profileName}`;

        // Create a list of keys from localStorage that match the prefix 'lorebook.profile:'
        const existingKeys = Object.keys(localStorage)
            .filter(key => key.startsWith('lorebook.profile:'))
            .map(key => key.toLowerCase()); // Convert all keys to lowercase for case-insensitive check

        if (!existingKeys.includes(profileKey.toLowerCase())) {
            localStorage.setItem(profileKey, JSON.stringify({}));
            loadProfiles();
        } else {
            alert('Profile already exists.');
        }
    }
});


// Profile Selection Functionality
function loadProfiles() {
    profileList.innerHTML = '';
        Object.keys(localStorage).forEach(profileKey => {
            if (profileKey.startsWith('lorebook.profile:')) {
                const profileName = profileKey.replace('lorebook.profile:', '');
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

// Lorebook Entries Title
const lorebookEntriesTitle = document.createElement('h3');
lorebookEntriesTitle.innerText = 'Manage Lorebook Entries';
lorebookEntriesTitle.style.fontWeight = 'normal';
lorebookEntriesTitle.style.color = '#ffffff';
lorebookEntriesTitle.style.textAlign = 'left';
lorebookEntriesTitle.style.fontSize = '24px';
lorebookEntriesTitle.style.marginTop = '20px';
lorebookEntriesTitle.style.position = 'relative';
lorebookEntriesTitle.style.marginLeft = '23%';
lorebookEntriesTitle.style.marginBottom = '15px';
lorebookEntriesTitle.style.fontWeight = '550';

// Profile Entries List
const profileEntriesList = document.createElement('div');
profileEntriesList.id = 'profileEntriesList';
profileEntriesList.style.marginTop = '20px';
profileEntriesList.style.height = '48%';
// Check if the device is mobile
if (window.innerWidth <= 768) {
    profileEntriesList.style.height = '30%';
} else {
    profileEntriesList.style.height = '48%';
}
profileEntriesList.style.overflowY = 'auto';

// Header for Inputs
const entrieslabel = document.createElement('div');
entrieslabel.textContent = 'Enter keys and description:';
entrieslabel.style.color = '#dddddd';
entrieslabel.style.fontSize = '14px';
entrieslabel.style.marginBottom = '5px';
entrieslabel.style.marginTop = '5px';
entrieslabel.style.marginLeft = '23%';

// Create key-value input fields
const inputContainer = document.createElement('div');
inputContainer.id = 'inputContainer';
inputContainer.style.marginTop = '10px';
inputContainer.style.display = 'flex';
inputContainer.style.flexDirection = 'column';
inputContainer.style.alignItems = 'center';
inputContainer.style.margin = '0 auto';


const lorebookKeyInput = document.createElement('input');
lorebookKeyInput.type = 'text';
lorebookKeyInput.placeholder = 'Entry Keywords (comma-separated)';
lorebookKeyInput.style.width = '90%';
lorebookKeyInput.style.marginBottom = '5px';
lorebookKeyInput.style.padding = '10px';
lorebookKeyInput.style.border = '1px solid #444444';
lorebookKeyInput.style.borderRadius = '8px';
lorebookKeyInput.style.backgroundColor = '#1e1e1e';
lorebookKeyInput.style.color = '#dddddd';


const lorebookValueInput = document.createElement('textarea');
lorebookValueInput.placeholder = ' ';
lorebookValueInput.style.width = '90%';
lorebookValueInput.style.marginBottom = '5px';
lorebookValueInput.style.padding = '10px';
lorebookValueInput.style.border = '1px solid #444444';
lorebookValueInput.style.borderRadius = '8px';
lorebookValueInput.style.backgroundColor = '#1e1e1e';
lorebookValueInput.style.color = '#dddddd';
lorebookValueInput.style.height = '100px';
lorebookValueInput.style.resize = 'vertical';
lorebookValueInput.maxLength = 1000;
lorebookValueInput.style.overflow = 'auto';

const charCounter = document.createElement('div');
charCounter.style.color = '#dddddd';
charCounter.style.fontSize = '12px';
charCounter.style.marginTop = '0px';
charCounter.style.marginBottom = '15px';
charCounter.style.textAlign = 'right';
charCounter.style.marginRight = '-87%';
charCounter.style.color = 'grey';
charCounter.textContent = `0/${lorebookValueInput.maxLength}`;

// Update the counter as the user types
lorebookValueInput.addEventListener('input', () => {
  charCounter.textContent = `${lorebookValueInput.value.length}/${lorebookValueInput.maxLength}`;
});

// Save Entry button, also important for editing
const lorebookSaveButton = document.createElement('button');
lorebookSaveButton.innerText = 'Add Entry';
lorebookSaveButton.style.padding = '10px 20px';
lorebookSaveButton.style.border = '0.2px solid #4E4E4E';
lorebookSaveButton.style.backgroundColor = '#2F2F2F';
lorebookSaveButton.style.color = '#fff';
lorebookSaveButton.style.borderRadius = '50px';
lorebookSaveButton.style.cursor = 'pointer';
lorebookSaveButton.style.width = '95%';

// Append all Elements
document.body.appendChild(arrowButton);
document.body.appendChild(DCstoragePanel);
DCstoragePanel.appendChild(storagePanelHeader);
DCstoragePanel.appendChild(dividerLine);
document.body.appendChild(lorebookPanel);
lorebookPanel.appendChild(closeButton);
lorebookPanel.appendChild(profileslabel);
lorebookPanel.appendChild(lorebookProfilePanel);
lorebookProfilePanel.appendChild(profileList);
lorebookProfilePanel.appendChild(addProfileButton);
lorebookPanel.appendChild(lorebookEntriesTitle);
lorebookPanel.appendChild(profileEntriesList);
lorebookPanel.appendChild(entrieslabel);
lorebookPanel.appendChild(inputContainer);
inputContainer.appendChild(lorebookKeyInput);
inputContainer.appendChild(lorebookValueInput);
inputContainer.appendChild(charCounter);
inputContainer.appendChild(lorebookSaveButton);

let isEditing = false;
let editingKey = '';

lorebookSaveButton.addEventListener('click', () => {
    const key = lorebookKeyInput.value.trim().toLowerCase(); // Ensure key is always saved as lowercase
    const value = lorebookValueInput.value;
    const currentProfile = getCurrentProfile();

    if (key && currentProfile) {
        const profileKey = `${currentProfile}.lorebook:${key}`;
        const formattedValue = `<[Lorebook: ${key}] ${value}>`;

        // Check for duplicate keys (case-insensitive) and prevent keys that partially match an existing key
        const isDuplicateKey = Object.keys(localStorage).some(storageKey => {
            const normalizedStorageKey = storageKey.toLowerCase();
            const normalizedCurrentProfile = currentProfile.toLowerCase();
            const currentKey = normalizedStorageKey.replace(`${normalizedCurrentProfile}.lorebook:`.toLowerCase(), '');
            return (
                (currentKey === key || currentKey.split(',').includes(key)) &&
                (!isEditing || editingKey.toLowerCase() !== currentKey)
            );
        });

        // Enforce uniqueness for edits as well
        if (isDuplicateKey) {
            alert('The key is already used in an existing entry (case-insensitive). Please use a different key.');
            return;
        }

        // Remove the old key if editing and key has changed
        if (isEditing && editingKey.toLowerCase() !== key) {
            const oldProfileKey = `${currentProfile}.lorebook:${editingKey.toLowerCase()}`;
            localStorage.removeItem(oldProfileKey);
        }

        localStorage.setItem(profileKey, formattedValue);
        lorebookKeyInput.value = '';
        lorebookValueInput.value = '';
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
    profileEntriesList.style.alignItems = 'center';
    profileEntriesList.style.margin = '0 auto';

    const currentProfile = getCurrentProfile();
    if (currentProfile) {
        Object.keys(localStorage).forEach(storageKey => {
            // Normalize both the profile and the storage key for case-insensitive comparison
            if (storageKey.toLowerCase().startsWith(`${currentProfile.toLowerCase()}.lorebook:`)) {
                const entryKey = storageKey.replace(new RegExp(`^${currentProfile}\.lorebook:`, 'i'), '');
                const entryValue = localStorage.getItem(storageKey);
                const displayedValue = entryValue.replace(/^<\[Lorebook:.*?\]\s*/, '').replace(/>$/, '');

                const entryItem = document.createElement('div');
                entryItem.style.padding = '10px';
                entryItem.style.marginBottom = '12px';
                entryItem.style.borderRadius = '8px';
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
                    lorebookKeyInput.value = entryKey;
                    lorebookValueInput.value = entryValue.replace(/^<\[Lorebook:.*?\]\s*/, '').replace(/>$/, '');
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
                removeButton.addEventListener('click', (event) => {
                    event.stopPropagation();
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
    // Return the current profile name in its original case, but convert to lower case for comparisons
    const selectedProfile = localStorage.getItem('selectedProfile.lorebook');
    return selectedProfile ? selectedProfile : null;
}

function setCurrentProfile(profileName) {
    localStorage.setItem('selectedProfile.lorebook', profileName);
}

loadProfiles();

}

// ================================================================ IMPORT/EXPORT ===============================================================
function ImportExportScript() {
// Create buttons to trigger export and import
window.exportButton = document.createElement('div');
exportButton.innerHTML = `
    <button id="toggle-export-button"
        style="
            position: relative;
            top: 10px;
            right: 0px;
            left: 10px;
            padding: 7px 15px;
            background: transparent;
            color: #b0b0b0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.1s, color 0.1s;
            z-index: 1001;
            display: flex;
            align-items: center;">
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
            <path d="M12 5L11.2929 4.29289L12 3.58579L12.7071 4.29289L12 5ZM13 14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14L13 14ZM6.29289 9.29289L11.2929 4.29289L12.7071 5.70711L7.70711 10.7071L6.29289 9.29289ZM12.7071 4.29289L17.7071 9.29289L16.2929 10.7071L11.2929 5.70711L12.7071 4.29289ZM13 5L13 14L11 14L11 5L13 5Z" fill="#B0B0B0"></path>
            <path d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16" stroke="#B0B0B0" stroke-width="2"></path>
        </svg>
        Export Data
    </button>
`;


window.exportButton.onmouseover = () => {
  exportButton.querySelector('button').style.backgroundColor = '#212121';
  exportButton.querySelector('button').style.color = '#ffffff';
};
exportButton.onmouseout = () => {
  exportButton.querySelector('button').style.backgroundColor = 'transparent';
  exportButton.querySelector('button').style.color = '#b0b0b0';
};
//DCstoragePanel.appendChild(exportButton);

window.importButton = document.createElement('div');
importButton.innerHTML = `
    <button id="toggle-import-button"
        style="
            position: relative;
            top: 10px;
            right: 0px;
            left: 10px;
            padding: 7px 15px;
            background: transparent;
            color: #b0b0b0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.1s, color 0.1s;
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 8px;">
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 14L11.2929 14.7071L12 15.4142L12.7071 14.7071L12 14ZM13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44771 11 5L13 5ZM6.29289 9.70711L11.2929 14.7071L12.7071 13.2929L7.70711 8.29289L6.29289 9.70711ZM12.7071 14.7071L17.7071 9.70711L16.2929 8.29289L11.2929 13.2929L12.7071 14.7071ZM13 14L13 5L11 5L11 14L13 14Z" fill="#B0B0B0"></path>
            <path d="M5 16L5 17C5 18.1046 5.89543 19 7 19L17 19C18.1046 19 19 18.1046 19 17V16" stroke="#B0B0B0" stroke-width="2"></path>
        </svg>
        Import Data
    </button>
`;

importButton.onmouseover = () => {
  importButton.querySelector('button').style.backgroundColor = '#212121';
  importButton.querySelector('button').style.color = '#ffffff';
};
importButton.onmouseout = () => {
  importButton.querySelector('button').style.backgroundColor = 'transparent';
  importButton.querySelector('button').style.color = '#b0b0b0';
};
//DCstoragePanel.appendChild(importButton);

    // Export specific localStorage entries
    exportButton.addEventListener('click', () => {
        const filteredData = {};
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                if (key.startsWith('events') || key.includes('lorebook') || key.includes('Rule') || key.includes('notifier')) {
                    filteredData[key] = localStorage.getItem(key);
                }
            }
        }
        const data = JSON.stringify(filteredData);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'localStorage_filtered.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Import localStorage
    importButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    for (const key in importedData) {
                        localStorage.setItem(key, importedData[key]);
                    }
                    alert('localStorage has been successfully imported.');
                } catch (err) {
                    alert('Failed to import localStorage: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });
    }

// =================================================================== EVENTS ===================================================================
function EventsScript() {

window.eventsButton = document.createElement('div');
window.eventsButton.innerHTML = `
    <button id="toggle-events-panel"
        style="
            position: relative;
            top: 10px;
            right: 0px;
            left: 10px;
            padding: 7px 15px;
            display: flex;
            align-items: center;

            text-align: left;
            background: transparent;
            color: #b0b0b0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.1s, color 0.1s;
            z-index: 1001;">
<svg fill="#B0B0B0" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xml:space="preserve" width="20px" height="20px" style="padding-right: 5px; margin-left: 1px;">

            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M5,2v2H4C2.9,4,2,4.9,2,6v11c0,1.1,0.9,2,2,2h6.8c1.8-1.8,0,0,2-2H4V8h12v5.9c1.6-1.6,0.2-0.2,2-2V6c0-1.1-0.9-2-2-2h-1V2 h-2v2H7V2H5z M10,9.2l-0.8,2L7,11.4l1.6,1.4l-0.5,2.1l1.8-1.1l1.8,1.1l-0.5-2.1l1.6-1.4l-2.2-0.2L10,9.2z M20.5,12 c-0.1,0-0.3,0.1-0.4,0.2L19.3,13l2,2l0.8-0.8c0.2-0.2,0.2-0.6,0-0.7l-1.3-1.3C20.8,12,20.6,12,20.5,12z M18.8,13.5L12.3,20v2h2 l6.5-6.5L18.8,13.5"></path>
            </g>
        </svg>
        Manage Events
    </button>
`;


let manageEventsButton = window.eventsButton.querySelector('#toggle-events-panel');
manageEventsButton.onclick = openProfilePanel;

const eventsbuttonElement = eventsButton.querySelector('button');
eventsbuttonElement.onmouseover = () => {
    eventsbuttonElement.style.backgroundColor = '#212121';
    eventsbuttonElement.style.color = '#ffffff';
};
eventsbuttonElement.onmouseout = () => {
    eventsbuttonElement.style.backgroundColor = 'transparent';
    eventsbuttonElement.style.color = '#b0b0b0';
};

function openProfilePanel() {

    if (document.querySelector('#eventsProfilePanel')) {
        return;
    }

// Create profile management panel
const eventsProfilePanel = document.createElement('div');
eventsProfilePanel.id = 'eventsProfilePanel';
eventsProfilePanel.style.position = 'fixed';
eventsProfilePanel.style.top = '50%';
eventsProfilePanel.style.left = '50%';
eventsProfilePanel.style.transform = 'translate(-50%, -50%)';
// Size different for Mobile and Desktop
if (window.innerWidth <= 768) {
    eventsProfilePanel.style.width = '90%';
    eventsProfilePanel.style.height = '90%';
} else {
    eventsProfilePanel.style.width = '800px';
    eventsProfilePanel.style.height = '700px';
}
//eventsProfilePanel.style.width = '800px';
//eventsProfilePanel.style.height = '700px';
eventsProfilePanel.style.backgroundColor = '#2F2F2F';
eventsProfilePanel.style.color = 'white';
eventsProfilePanel.style.borderRadius = '20px';
eventsProfilePanel.style.padding = '20px';
eventsProfilePanel.style.zIndex = '1000';
eventsProfilePanel.style.display = 'flex';
eventsProfilePanel.style.flexDirection = 'row';

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
closeButton.style.zIndex = '1001';
closeButton.style.justifyContent = 'center';
closeButton.style.transition = 'background-color 0.2s ease';
closeButton.style.boxSizing = 'border-box';

// Create span for the '✕' character
const closeIcon = document.createElement('span');
closeIcon.innerText = '✕';
closeIcon.style.fontSize = '16px';
closeIcon.style.position = 'relative';
closeIcon.style.top = '-1px';

// Hover effect
closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = '#676767';
});

closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'transparent';
});

// Close button action
closeButton.onclick = function() {
    document.body.removeChild(eventsProfilePanel);
};

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

// Create profile list
const profileList = document.createElement('ul');
profileList.style.overflowY = 'auto';
profileList.style.height = '600px';


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

closeButton.appendChild(closeIcon);
eventsProfilePanel.appendChild(closeButton);
profileListContainer.appendChild(profileListHeader);
profileListContainer.appendChild(profileList);
profileListContainer.appendChild(addProfileButton);
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

// Adding Entries
let currentEditingKey = null; // This keeps track of the current key being edited

// Add or Edit Entry Button
addEntryButton.onclick = function () {
    if (!selectedProfile) {
        alert('Please select a profile before adding entries.');
        return;
    }

    const key = keyInput.value.trim();
    const value = `<Event: ${valueInput.value.trim()}>`;
    const probability = probabilityInput.value.trim();
    const timeRange = timeRangeInput.value.trim();
    const fullKey = `${selectedProfile}.events:${key}`;

    if (key && value) {
        // Check if we are editing an existing entry
        if (currentEditingKey) {
            // Check if we are attempting to edit to a key that already exists
            if (currentEditingKey !== fullKey && localStorage.getItem(fullKey)) {
                alert('An entry with this key already exists. Please use a different key.');
                return;
            }

            // Remove the old entry if the key has changed
            if (currentEditingKey !== fullKey) {
                localStorage.removeItem(currentEditingKey);
            }

            // Update or add the new entry
            const entryData = {
                value: value,
                probability: probability || '100',
                timeRange: timeRange || '0-24'
            };
            localStorage.setItem(fullKey, JSON.stringify(entryData));
            currentEditingKey = null; // Reset the editing key

        } else {
            // If adding a new entry
            if (!localStorage.getItem(fullKey)) {
                const entryData = {
                    value: value,
                    probability: probability || '100',
                    timeRange: timeRange || '0-24'
                };
                localStorage.setItem(fullKey, JSON.stringify(entryData));
            } else {
                alert('Entry with this key already exists. Please use a different key.');
                return;
            }
        }

        loadEntries();

        // Clear the input fields after adding/editing the entry
        keyInput.value = '';
        valueInput.value = '';
        probabilityInput.value = '100';
        timeRangeInput.value = '0-24';
    }
};
keyValueContainer.appendChild(addEntryButton);

// Append containers to profilePanel
eventsProfilePanel.appendChild(profileListContainer);
eventsProfilePanel.appendChild(keyValueContainer);



    // Load saved profiles and entries
    let selectedProfile = localStorage.getItem('selectedProfile.events');

    function loadProfiles() {
        profileList.innerHTML = '';
        for (let key in localStorage) {
            if (key.startsWith('events.profile:')) {
                const profileName = key.replace('events.profile:', '');
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
                        localStorage.setItem('selectedProfile.events', '');
                        listItem.style.backgroundColor = '';
                        loadEntries();
                    } else {
                        selectedProfile = profileName;
                        localStorage.setItem('selectedProfile.events', selectedProfile);
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
closeIcon2.style.color = '#ffffff';
closeIcon2.style.position = 'relative';
closeIcon2.style.top = '-1px'; // Adjust this value to move the character up

deleteButton.appendChild(closeIcon2);



deleteButton.onclick = function(event) {
    event.stopPropagation();
    localStorage.removeItem(`events.profile:${profileName}`);
        if (selectedProfile === profileName) {
            selectedProfile = null;
            localStorage.setItem('selectedProfile.events', '');
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
        if (profileName) {
            // Perform a case-insensitive check for existing profiles
            const existingProfiles = Object.keys(localStorage).filter(key => key.startsWith('events.profile:'));
            const profileExists = existingProfiles.some(key => key.toLowerCase() === `events.profile:${profileName.toLowerCase()}`);

            if (!profileExists) {
                localStorage.setItem(`events.profile:${profileName}`, JSON.stringify({}));
                loadProfiles();
                document.body.removeChild(dialog);
            } else {
                alert('Profile name already exists. Please choose a different name.');
            }
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
        const prefix = `${selectedProfile}.events:`.toLowerCase();

        for (let key in localStorage) {
            if (key.toLowerCase().startsWith(prefix)) {
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
                    valueCell.innerText = entryData.value.replace(/^<Event:\s*/, '').slice(0, -1); // Remove surrounding brackets
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
closeIcon1.style.color = '#ffffff';
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
// Make the row editable when clicked
row.onclick = function() {
    keyInput.value = key.split(':')[1]; // If key processing remains as is
    valueInput.value = entryData.value.replace(/^<Event:\s*/, '').slice(0, -1); // Remove <Event: > prefix and surrounding brackets
    probabilityInput.value = entryData.probability;
    timeRangeInput.value = entryData.timeRange;
    currentEditingKey = key; // Set the current key for editing
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
    document.body.appendChild(eventsProfilePanel);
}

}

// ==================================================================== RULES ===================================================================
function RulesScript() {
    // Custom texts to cycle through
    let customRules = [];
    let currentIndex = 0;

    // Function to determine the current rule index by scanning last two messages
    function determineCurrentIndex() {
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        if (messageItems.length >= 1) {
            // Check the last message first
            const lastMessage = Array.from(messageItems[messageItems.length - 1].querySelectorAll('span')).map(span => span.innerText).join('') || messageItems[messageItems.length - 1].innerText;

            for (let i = 0; i < customRules.length; i++) {
                if (lastMessage.includes(`<Rule${i + 1}:`)) {
                    currentIndex = (i + 1) % customRules.length;
                    return;
                }
            }
        }

        // If not found in the last message, check the second to last message
        if (messageItems.length >= 2) {
            const secondLastMessage = Array.from(messageItems[messageItems.length - 2].querySelectorAll('span')).map(span => span.innerText).join('') || messageItems[messageItems.length - 2].innerText;

            for (let i = 0; i < customRules.length; i++) {
                if (secondLastMessage.includes(`<Rule${i + 1}:`)) {
                    currentIndex = (i + 1) % customRules.length;
                    return;
                }
            }
        }
    }

    // Expose necessary elements to be used by the second script
    window.customRuleLogic = {
        customRules,
        determineCurrentIndex,
        getCurrentText: function() {
            determineCurrentIndex();
            const customRule = '\n' + customRules[currentIndex];
            currentIndex = (currentIndex + 1) % customRules.length;
            return customRule;
        }
    };

    // Create Button and Panel UI for Local Storage Key Management
    window.manageRulesButton = document.createElement('div');
    window.manageRulesButton.innerHTML = `
        <button id="toggle-rules-panel"
            style="
                position: relative;
                top: 10px;
                right: 0px;
                left: 10px;
                padding: 7px 15px;
                background: transparent;
                color: #b0b0b0;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                text-align: left;
                cursor: pointer;
                width: 90%;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background-color 0.1s, color 0.1s;
                z-index: 1001;">
            <svg fill="#B0B0B0" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 492.508 492.508" xml:space="preserve" style="padding-right: 0px; margin-left: 1px;">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <g>
                            <path d="M199.493,402.145c0-10.141-8.221-18.361-18.36-18.361H42.475c-10.139,0-18.36,8.221-18.36,18.361 c0,3.195,0.818,6.199,2.255,8.816H0v38.067h223.607v-38.067h-26.369C198.674,408.343,199.493,405.34,199.493,402.145z"></path>
                            <path d="M175.898,88.224l117.157,74.396c9.111,4.643,20.43,1.678,26.021-7.129l5.622-8.85c5.938-9.354,3.171-21.75-6.182-27.69 L204.592,46.608c-9.352-5.939-21.748-3.172-27.688,6.182l-5.622,8.851C165.692,70.447,167.82,81.952,175.898,88.224z"></path>
                            <path d="M492.456,372.433l-0.082-1.771l-0.146-1.672c-0.075-1.143-0.235-2.159-0.375-3.204c-0.562-4.177-1.521-7.731-2.693-10.946 c-2.377-6.386-5.738-11.222-9.866-14.845c-1.027-0.913-2.126-1.714-3.218-2.528l-3.271-2.443 c-2.172-1.643-4.387-3.218-6.587-4.815c-2.196-1.606-4.419-3.169-6.644-4.729c-2.218-1.571-4.445-3.125-6.691-4.651 c-4.468-3.089-8.983-6.101-13.51-9.103l-6.812-4.464l-6.85-4.405c-4.58-2.911-9.167-5.813-13.785-8.667 c-4.611-2.865-9.24-5.703-13.896-8.496l-13.979-8.363l-14.072-8.22l-14.149-8.096l-14.219-7.987l-14.287-7.882l-14.354-7.773 c-4.802-2.566-9.599-5.137-14.433-7.653c-4.822-2.529-9.641-5.071-14.498-7.548l-4.398,6.928l-22.17-10.449l24.781-39.026 l-117.156-74.395l-60.944,95.974l117.157,74.395l24.781-39.026l18.887,15.622l-4.399,6.929c4.309,3.343,8.657,6.619,12.998,9.91 c4.331,3.305,8.698,6.553,13.062,9.808l13.14,9.686l13.211,9.577l13.275,9.474l13.346,9.361l13.422,9.242l13.514,9.095 c4.51,3.026,9.045,6.009,13.602,8.964c4.547,2.967,9.123,5.882,13.707,8.792l6.898,4.324l6.936,4.266 c4.643,2.818,9.289,5.625,13.985,8.357c2.337,1.383,4.689,2.739,7.055,4.078c2.358,1.349,4.719,2.697,7.106,4 c2.383,1.312,4.75,2.646,7.159,3.912l3.603,1.922c1.201,0.64,2.394,1.296,3.657,1.837c5.036,2.194,10.841,3.18,17.63,2.614 c3.409-0.305,7.034-0.949,11.054-2.216c1.006-0.317,1.992-0.606,3.061-1.023l1.574-0.58l1.639-0.68 c2.185-0.91,4.523-2.063,7.059-3.522C492.513,377.405,492.561,374.799,492.456,372.433z"></path>
                            <path d="M67.897,261.877l113.922,72.341c9.354,5.938,21.75,3.172,27.689-6.181l5.621-8.852c5.592-8.808,3.462-20.311-4.615-26.583 L93.358,218.207c-9.111-4.642-20.43-1.678-26.022,7.13l-5.62,8.85C55.775,243.541,58.543,255.938,67.897,261.877z"></path>
                        </g>
                    </g>
                </g>
            </svg>
            Manage Rules
        </button>
    `;

    const rulesButtonElement = manageRulesButton.querySelector('button');
    rulesButtonElement.onmouseover = () => {
        rulesButtonElement.style.backgroundColor = '#212121';
        rulesButtonElement.style.color = '#ffffff';
    };
    rulesButtonElement.onmouseout = () => {
        rulesButtonElement.style.backgroundColor = 'transparent';
        rulesButtonElement.style.color = '#b0b0b0';
    };

    const rulesPanel = document.createElement('div');
    rulesPanel.style.position = 'fixed';
    rulesPanel.style.top = '50%';
    rulesPanel.style.left = '50%';
    rulesPanel.style.transform = 'translate(-50%, -50%)';
    // Size different for Mobile and Desktop
    if (window.innerWidth <= 768) {
        rulesPanel.style.width = '90%';
        rulesPanel.style.height = '90%';
    } else {
        rulesPanel.style.width = '800px';
        rulesPanel.style.height = '700px';
    }
    rulesPanel.style.backgroundColor = '#2f2f2f';
    rulesPanel.style.padding = '20px';
    rulesPanel.style.overflow = 'hidden'; // Prevent full panel scrolling
    rulesPanel.style.display = 'none';
    rulesPanel.style.zIndex = 1000;
    rulesPanel.style.borderRadius = '10px';
    document.body.appendChild(rulesPanel);

    const title = document.createElement('h2');
    title.innerText = 'Manage Rules';
    title.style.textAlign = 'center';
    title.style.color = '#ffffff';
    title.style.fontSize = '24px';
    title.style.fontWeight = '550';
    title.style.marginBottom = '20px';
    rulesPanel.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.innerText = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.borderRadius = '50%';
    closeButton.style.color = '#ffffff';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = '#676767';
    });
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = 'transparent';
    });

    closeButton.addEventListener('click', () => {
        rulesPanel.style.display = 'none';
    });
    rulesPanel.appendChild(closeButton);

    const rulesListContainer = document.createElement('div');
    rulesListContainer.style.height = 'calc(100% - 110px)'; // Adjust height to leave space for header and button
    rulesListContainer.style.overflowY = 'auto'; // Allow only the rules list to scroll
    rulesPanel.appendChild(rulesListContainer);

    // Create and append the "Add Rule" button once
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Rule';
    addButton.style.margin = '15px auto';
    addButton.style.display = 'block';
    addButton.style.padding = '10px';
    addButton.style.border = 'none';
    addButton.style.width = '90%';
    addButton.style.backgroundColor = '#e0e0e0';
    addButton.style.borderRadius = '20px';
    addButton.style.cursor = 'pointer';
    addButton.addEventListener('click', () => {
        const newRule = `<Rule${customRules.length + 1}: Define your rule here>`;
        customRules.push(newRule);
        updateLocalStorageKeys();
        renderPanel();
    });
    rulesPanel.appendChild(addButton);

    manageRulesButton.addEventListener('click', () => {
        rulesPanel.style.display = rulesPanel.style.display === 'none' ? 'block' : 'none';
        if (rulesPanel.style.display === 'block') {
            renderPanel();
        }
    });

    function renderPanel() {
        rulesListContainer.innerHTML = '';

        customRules.forEach((rule, index) => {
            const ruleContainer = document.createElement('div');
            ruleContainer.style.marginBottom = '15px';
            ruleContainer.style.display = 'flex';
            ruleContainer.style.alignItems = 'center';
            ruleContainer.style.width = '95%';
            ruleContainer.style.gap = '5px'; // Reduced gap to bring elements closer

            const ruleLabel = document.createElement('label');
            ruleLabel.textContent = `Rule ${index + 1}:`;
            ruleLabel.style.color = 'white';
            ruleLabel.style.marginLeft = '5%';
            ruleLabel.style.flex = '0.5'; // Reduced flex to bring the label closer to the input
            ruleContainer.appendChild(ruleLabel);

            // Set the textarea value to the rule text rather than using it as a placeholder
            const ruleInput = document.createElement('textarea');
            ruleInput.value = rule.replace(/<Rule\d+: (.*?)>/, '$1'); // Set the inner text as the value for editing
            ruleInput.style.flex = '2';
            ruleInput.style.padding = '5px'; // Added more padding for easier tapping
            ruleInput.style.borderRadius = '5px';
            ruleInput.style.border = '0.5px solid #444444';
            ruleInput.style.backgroundColor = '#1E1E1E';
            ruleInput.style.color = 'gray';
            ruleInput.style.overflowY = 'hidden'; // Handle vertical overflow automatically
            ruleInput.style.overflowX = 'hidden'; // Prevent horizontal overflow
            ruleInput.style.maxWidth = '100%'; // Prevent textarea from extending beyond container width
            ruleInput.style.boxSizing = 'border-box'; // Ensure padding is included in width calculation
            ruleInput.style.resize = 'none'; // Disable manual resizing to avoid visual clutter

            // Adjust height based on input content
            function adjustHeight(element) {
                element.style.height = 'auto'; // Reset height to calculate the new height
                element.style.height = `${element.scrollHeight}px`; // Set height to match content
            }

            // Adjust height initially to fit content on render
            adjustHeight(ruleInput);

            ruleInput.addEventListener('input', () => {
                adjustHeight(ruleInput);
                ruleInput.style.color = '#D16262'; // Indicate unsaved changes
            });

            ruleContainer.appendChild(ruleInput);

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.style.padding = '5px 10px';
            updateButton.style.border = 'none';
            updateButton.style.backgroundColor = '#1E1E1E';
            updateButton.style.color = 'white';
            updateButton.style.borderRadius = '5px';
            updateButton.style.cursor = 'pointer';
            updateButton.addEventListener('click', () => {
                customRules[index] = `<Rule${index + 1}: ${ruleInput.value}>`;
                updateLocalStorageKeys();
                ruleInput.style.color = 'black'; // Change color to indicate saved state
            });
            ruleContainer.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.padding = '5px 10px';
            deleteButton.style.border = 'none';
            deleteButton.style.backgroundColor = '#1E1E1E';
            deleteButton.style.color = 'white';
            deleteButton.style.marginLeft = '5px';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.addEventListener('click', () => {
                customRules.splice(index, 1);
                updateLocalStorageKeys();
                renderPanel();
            });
            ruleContainer.appendChild(deleteButton);

            // Move rule up/down container
            const moveContainer = document.createElement('div');
            moveContainer.style.display = 'flex';
            moveContainer.style.flexDirection = 'column';
            moveContainer.style.gap = '3px';

            // Move rule up
            if (index > 0) {
                const upButton = document.createElement('button');
                upButton.textContent = '▲';
                upButton.style.padding = '3px';
                upButton.style.border = 'none';
                upButton.style.backgroundColor = 'transparent';
                upButton.style.color = 'white';
                upButton.style.borderRadius = '5px';
                upButton.style.cursor = 'pointer';
                upButton.addEventListener('click', () => {
                    [customRules[index - 1], customRules[index]] = [customRules[index], customRules[index - 1]];
                    updateLocalStorageKeys();
                    renderPanel();
                });
                moveContainer.appendChild(upButton);
            }

            // Move rule down
            if (index < customRules.length - 1) {
                const downButton = document.createElement('button');
                downButton.textContent = '▼';
                downButton.style.padding = '3px';
                downButton.style.border = 'none';
                downButton.style.backgroundColor = 'transparent';
                downButton.style.color = 'white';
                downButton.style.borderRadius = '5px';
                downButton.style.cursor = 'pointer';
                downButton.addEventListener('click', () => {
                    [customRules[index], customRules[index + 1]] = [customRules[index + 1], customRules[index]];
                    updateLocalStorageKeys();
                    renderPanel();
                });
                moveContainer.appendChild(downButton);
            }

            ruleContainer.appendChild(moveContainer);
            rulesListContainer.appendChild(ruleContainer);
        });

        // No longer append the addButton here

        // Adjust height for all textareas after rendering the panel
        adjustAllHeights();
    }

    // Initial adjustment when loading the panel
    function adjustAllHeights() {
        const textareas = rulesListContainer.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            textarea.style.height = 'auto'; // Reset height to calculate the new height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to match content
        });
    }

    function updateLocalStorageKeys() {
        // Clear existing rules in localStorage
        for (let i = 1; i <= localStorage.length; i++) {
            localStorage.removeItem(`Rule${i}`);
        }
        // Set updated rules
        customRules.forEach((rule, index) => {
            localStorage.setItem(`Rule${index + 1}`, rule);
        });
    }

    // Load rules from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const savedRule = localStorage.getItem(`Rule${i + 1}`);
        if (savedRule) {
            customRules.push(savedRule);
        }
    }
}

// ===================================================================== MP3 ====================================================================
function mp3Script() {

    // Function to get API key from local storage
    function getApiKey() {
        return localStorage.getItem('google_cloud_api_key');
    }

    // Function to set the API key in local storage when "Save API Key" is clicked
    function saveApiKey() {
        const apiKey = document.getElementById('api-key-input').value.trim();
        if (apiKey) {
            localStorage.setItem('google_cloud_api_key', apiKey);
            API_KEY = apiKey;
            alert('API key saved successfully.');
        } else {
            alert('Please enter a valid API key.');
        }
    }

    let API_KEY = getApiKey();
    const API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`;

    // Create a button to toggle the transcription panel
    window.mp3ToggleButton = document.createElement('div');
    mp3ToggleButton.innerHTML = `
        <button id="toggle-transcription-panel"
            style="
                display: flex;
                align-items: center;
                gap: 8px;
                position: relative;
                top: 10px;
                right: 0px;
                left: 10px;
                padding: 7px 15px;
                background: transparent;
                color: #b0b0b0;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                text-align: left;
                cursor: pointer;
                width: 90%;
                transition: background-color 0.1s, color 0.1s;
                z-index: 1001;">
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xml:space="preserve" width="20px" height="20px" style="margin-right: -2px;">
                <path d="M6 11L6 13" stroke="#B0B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9 9L9 15" stroke="#B0B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M15 9L15 15" stroke="#B0B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M18 11L18 13" stroke="#B0B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M12 11L12 13" stroke="#B0B0B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            Show Transcript
        </button>
    `;

    const buttonElement = mp3ToggleButton.querySelector('button');
    buttonElement.onmouseover = () => {
        buttonElement.style.backgroundColor = '#212121';
        buttonElement.style.color = '#ffffff';
    };
    buttonElement.onmouseout = () => {
        buttonElement.style.backgroundColor = 'transparent';
        buttonElement.style.color = '#b0b0b0';
    };

    // Panel HTML
    const panelHTML = `
        <div id="transcription-panel" style="display: none;">
            <h3>MP3 Transcription Tool</h3>
            <input type="text" id="api-key-input" placeholder="Enter Google Cloud API key here" />
            <button id="save-api-key-button">Save API Key</button>
            <input type="text" id="mp3-url" placeholder="Enter MP3 URL here" />
            <button id="transcribe-button">Transcribe</button>
            <textarea id="transcription-result" placeholder="Transcript will appear here..." readonly></textarea>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // If API key exists, show it in the input
    if (API_KEY) {
        const apiKeyInput = document.getElementById('api-key-input');
        if (apiKeyInput) {
            apiKeyInput.value = API_KEY;
        }
    }

    GM_addStyle(`
        #transcription-panel {
            position: fixed;
            bottom: 50px;
            right: 10px;
            width: 300px;
            background: #f8f9fa;
            border: 1px solid #ccc;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        #transcription-panel h3 {
            margin: 0 0 10px;
            font-size: 16px;
        }
        #transcription-panel input, #transcription-panel textarea {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
        }
        #transcription-panel button {
            width: 100%;
            padding: 5px;
            cursor: pointer;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            margin-bottom: 10px;
        }
    `);

    // Event listener for toggle panel button
    document.addEventListener('click', (event) => {
        const button = event.target.closest('#toggle-transcription-panel');
        if (button) {
            const panel = document.getElementById('transcription-panel');
            if (panel) {
                if (panel.style.display === 'none') {
                    panel.style.display = 'block';
                    button.innerText = 'Hide MP3 Transcription';
                } else {
                    panel.style.display = 'none';
                    button.innerText = 'Show Transcript';
                }
            } else {
                console.error('Transcription panel not found!');
            }
        }
    });

    // Event listener for Save API Key button
    document.getElementById('save-api-key-button').addEventListener('click', saveApiKey);

    // Event listener for Transcribe button
    document.getElementById('transcribe-button').addEventListener('click', transcribe);

    function transcribe() {
        const mp3Url = document.getElementById('mp3-url').value.trim();
        if (!mp3Url) {
            alert('Please enter a valid MP3 URL.');
            return;
        }

        // Check if API key is set
        if (!API_KEY) {
            alert('No API key found. Please enter and save your API key first.');
            return;
        }

        // Check if the transcript already exists in local storage
        const storedTranscript = localStorage.getItem(mp3Url);
        if (storedTranscript) {
            document.getElementById('transcription-result').value = storedTranscript;
            return;
        }

        // Fetch MP3 file
        GM_xmlhttpRequest({
            method: 'GET',
            url: mp3Url,
            responseType: 'arraybuffer',
            onload: (response) => {
                const audioBase64 = arrayBufferToBase64(response.response);
                sendToGoogleCloud(audioBase64, mp3Url);
            },
            onerror: (err) => {
                alert('Failed to fetch the MP3 file.');
                console.error(err);
            },
        });
    }

    function sendToGoogleCloud(audioBase64, mp3Url) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
                config: {
                    encoding: 'MP3',
                    sampleRateHertz: 16000,
                    languageCode: 'en-US',
                },
                audio: {
                    content: audioBase64,
                },
            }),
            onload: (response) => {
                const result = JSON.parse(response.responseText);
                if (result.error) {
                    alert(`Error: ${result.error.message}`);
                } else {
                    const transcript = result.results
                        ?.map((r) => r.alternatives[0].transcript)
                        .join('\n') || 'No transcript found.';
                    document.getElementById('transcription-result').value = transcript;
                    localStorage.setItem(mp3Url, transcript);
                    manageLocalStorageLimit();
                    showTranscriptionDoneMessage();
                }
            },
            onerror: (err) => {
                alert('Failed to process the transcription.');
                console.error(err);
            },
        });
    }

    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    const observer = new MutationObserver(() => {
        const messageItems = document.querySelectorAll('div[class*="messageContent_"]');
        const lastMessage = messageItems[messageItems.length - 1];

        if (lastMessage) {
            const mp3LinkMatch = lastMessage.innerText.match(/https:\/\/files\.shapes\.inc\/.*\.mp3/);
            if (mp3LinkMatch) {
                const mp3Link = mp3LinkMatch[0];
                const storedLink = localStorage.getItem('lastMp3Link');

                // If no API key, do not attempt automatic transcription
                if (!API_KEY) {
                    return;
                }

                // Check if the link is new or different
                if (mp3Link !== storedLink) {
                    localStorage.setItem('lastMp3Link', mp3Link);
                    manageLocalStorageLimit();
                    document.getElementById('mp3-url').value = mp3Link;
                    transcribe();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function manageLocalStorageLimit() {
        const mp3KeysPrefix = 'mp3Link_';
        const mp3Keys = Object.keys(localStorage).filter((key) => key.startsWith(mp3KeysPrefix));

        // Store the new mp3 link with a timestamp
        const timestamp = Date.now();
        const lastLink = localStorage.getItem('lastMp3Link');
        if (lastLink) {
            localStorage.setItem(`${mp3KeysPrefix}${timestamp}`, lastLink);
        }

        // Limit to 10 entries
        if (mp3Keys.length >= 10) {
            mp3Keys.sort((a, b) => {
                const timeA = parseInt(a.replace(mp3KeysPrefix, ''), 10);
                const timeB = parseInt(b.replace(mp3KeysPrefix, ''), 10);
                return timeA - timeB;
            });
            while (mp3Keys.length >= 10) {
                localStorage.removeItem(mp3Keys.shift());
            }
        }
    }

    function showTranscriptionDoneMessage() {
        let messageDiv = document.getElementById('transcription-done-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'transcription-done-message';
            messageDiv.innerText = 'Transcript done!';
            document.body.appendChild(messageDiv);
        }

        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// =================================================================== STYLES ===================================================================
function StylesScript() {

    // Add custom CSS rule to modify the channel text area
    const style = document.createElement('style');
    style.innerHTML = `
        .channelTextArea_bdf0de {
            position: relative;
            width: 120%;
            text-indent: 0;
            border-radius: 8px;
        }
        .themedBackground_bdf0de {
            background: #2F2F2F;
        }
        .chatContent_a7d72e {
            position: relative;
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
            flex: 1 1 auto;
            background: #212121 !important;
        }

        .theme-dark .container_ee69e0 {
            background: #191919;
        }
        .theme-dark .themed_fc4f04 {
            background: #212121;
        }

        .footer_f8ec41 {
            background: #131313;
        }
        .theme-dark .container_b2ca13 {
            background: #191919;
        }

.wrapper_fea3ef {
            background-color: #131313;
    display: none !important;

}



    `;
    document.head.appendChild(style);

    // Function to hide the targeted elements
    function hideElements() {
        // Select all elements that match the provided pattern
        const elements = document.querySelectorAll("[id^='message-accessories-'] > article > div > div > div.embedProvider_b0068a.embedMargin_b0068a, [id^='message-accessories-'] > article > div > div > div.embedTitle_b0068a.embedMargin_b0068a, .buttons_bdf0de .expression-picker-chat-input-button.buttonContainer_bdf0de, .channelAppLauncher_df39bd .buttonContainer_df39bd.app-launcher-entrypoint");

        // Iterate over each element and hide it
        elements.forEach(element => {
            element.style.display = 'none';
        });
    }

    // Run the function initially to hide elements present at page load
    hideElements();

    // Observe mutations to the DOM and hide elements when new ones are added
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

// Create the toggleButton div
// Create the toggleButton div
window.serverbartoggleButton = document.createElement('div');
serverbartoggleButton.innerHTML = `
    <button id="toggle-server-panel"
        style="
            display: flex;
            align-items: center;
            gap: 8px; /* Add spacing between icon and text */
            position: relative;
            top: 10px;
            right: 0px;
            left: 10px;
            padding: 7px 15px;
            background: transparent;
            color: #b0b0b0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.1s, color 0.1s;
            z-index: 1001;">
        <svg width="16px" height="16px" viewBox="0 0 16 16" style="padding-right: 0px; margin-left: 2px" xmlns="http://www.w3.org/2000/svg" fill="#000000">
            <g fill="#B0B0B0">
                <path d="m 6.5 14 v -12 h -5 v 12 z m 0 0" fill-opacity="0.34902"></path>
                <path d="m 3 1 c -1.644531 0 -3 1.355469 -3 3 v 8 c 0 1.644531 1.355469 3 3 3 h 10 c 1.644531 0 3 -1.355469 3 -3 v -8 c 0 -1.644531 -1.355469 -3 -3 -3 z m 0 2 h 10 c 0.570312 0 1 0.429688 1 1 v 8 c 0 0.570312 -0.429688 1 -1 1 h -10 c -0.570312 0 -1 -0.429688 -1 -1 v -8 c 0 -0.570312 0.429688 -1 1 -1 z m 0 0"></path>
                <path d="m 6 2 h 1 v 12 h -1 z m 0 0"></path>
            </g>
        </svg>
        Toggle Sidebar
    </button>
`;

// Append the toggleButton to the desired parent element (e.g., `DCstoragePanel`)
//window.DCstoragePanel.appendChild(serverbartoggleButton);

// Function to toggle .itemsContainer_fea3ef visibility
function servertoggleItemsContainer() {
    const serveritemsContainer = document.querySelectorAll('.wrapper_fea3ef');
    serveritemsContainer.forEach(container => {
        const currentDisplay = window.getComputedStyle(container).getPropertyValue('display');

        if (currentDisplay === 'none') {
            container.setAttribute('style', 'display: flex !important;');
        } else {
            container.setAttribute('style', 'display: none !important;');
        }
    });
}


    // Add event listener to the toggle button
    serverbartoggleButton.addEventListener('click', servertoggleItemsContainer);

const serverbuttonElement = serverbartoggleButton.querySelector('button');
serverbuttonElement.onmouseover = () => {
    serverbuttonElement.style.backgroundColor = '#212121';
    serverbuttonElement.style.color = '#ffffff';
};
serverbuttonElement.onmouseout = () => {
    serverbuttonElement.style.backgroundColor = 'transparent';
    serverbuttonElement.style.color = '#b0b0b0';
};


}

// ================================================================== < > HIDER =================================================================
function HiderScript() {
    function hideEnclosedEntries() {
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        messageItems.forEach(messageItem => {
            const spans = messageItem.querySelectorAll('div[class*="messageContent_"] span');

            let isHiding = false;
            spans.forEach(span => {
                const text = span.textContent.trim();

                // Start hiding when encountering '<'
                if (text.startsWith('<') && !isHiding) {
                    isHiding = true;
                }

                // Apply hiding style if within an enclosed entry
                if (isHiding) {
                    span.style.opacity = '0'; // Make it invisible
                    span.style.position = 'absolute'; // Remove it from the document flow
                }

                // Stop hiding when encountering '>'
                if (text.endsWith('>') && isHiding) {
                    isHiding = false;
                }
            });
        });
    }

    // Observe for new messages being added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            hideEnclosedEntries();
        });
    });

    // Start observing the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    hideEnclosedEntries();

}

// ================================================================== NOTIFIER ==================================================================
function NotifierScript() {

    // Utility: Generate a unique ID for entries
    function generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }

    // The storage scheme requested:
    // Profiles: Key: "notifier.profile:ProfileName" Value: "{}" (just an empty object for now)
    // Selected profile: Key: "selectedProfile.notifier" Value: "ProfileName"
    // Entries: Key: "ProfileName.notifiers" Value: JSON array of entries

    // Styles
    GM_addStyle(`
        #calendarToggleBtn {
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            padding: 5px 10px;
            background: #444;
            color: #eee;
            font-size: 14px;
            border: none;
            cursor: pointer;
        }

#calendarPanel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 80%;
    background: #222;
    z-index: 9999;
    border: 1px solid #555;
    display: none;
    box-sizing: border-box;
    overflow: auto; /* Enable scrollbars if needed */
    font-family: Arial, sans-serif;
    font-size: 14px;
    color: #eee;
    resize: both; /* Allow resizing from bottom and right edges */
    min-width: 300px; /* Optional: set a minimum width so it's not too small */
    min-height: 200px; /* Optional: set a minimum height as well */
}

#calendarPanel::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 15px;
    height: 15px;
    background: #444;
    border-top: 1px solid #555;
    border-left: 1px solid #555;
    cursor: se-resize;
}


        #calendarPanelHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px;
            background: #333;
            border-bottom: 1px solid #555;
        }

        #calendarPanelClose {
            cursor: pointer;
            font-weight: bold;
            color: #eee;
        }

        #calendarPanelContent {
            display: flex;
            width: 100%;
            height: calc(100% - 30px);
        }

        #profileSection {
            width: 15%; /* Reduced width */
            border-right: 1px solid #555;
            overflow-y: auto;
            padding: 10px;
            box-sizing: border-box;
            background: #222;
            color: #eee;
        }

        #profileList {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        #profileList li {
            cursor: pointer;
            padding: 5px;
            margin-bottom: 5px;
            background: #333;
            border: 1px solid #444;
            color: #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #profileList li span.profileName {
            flex: 1;
        }

        #profileList li button.deleteProfileBtn {
            background: #600;
            border: 1px solid #800;
            color: #eee;
            margin-left: 5px;
            cursor: pointer;
            font-size: 12px;
            padding: 2px 5px;
        }

        #profileList li.selected {
            background: #444;
        }

        #addProfileForm {
            display: flex;
            margin-top: 10px;
        }

        #addProfileForm input[type=text] {
            flex: 1;
            padding: 3px;
            background: #333;
            border: 1px solid #444;
            color: #eee;
        }

        #addProfileForm button {
            padding: 3px;
            background: #444;
            border: 1px solid #555;
            color: #eee;
            cursor: pointer;
        }

        #calendarSection {
            width: 85%; /* Increased width */
            padding: 10px;
            box-sizing: border-box;
            overflow: auto;
            background: #222;
            color: #eee;
        }

        #calendarNav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        #calendarNav button {
            padding: 3px 5px;
            background: #444;
            color: #eee;
            border: 1px solid #555;
            cursor: pointer;
        }


        #calendarGrid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 10px;   /* Add a bit more spacing between days */
        }

        .calendarDay {
            background: #333;
            border: 1px solid #444;
            height: 150px;
            width: 100%;
            position: relative;
            padding: 5px;
            box-sizing: border-box;
            overflow: hidden;
            font-size: 12px;
            color: #eee;
        }

.calendarDayEntries {
    display: block;
    overflow-y: auto;
    max-height: 120px; /* Adjust as needed */
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    font-size: 11px;
    color: #eee;
    outline: none;
}

.calendarDayEntries:focus {
    outline: 2px solid #888; /* Visible focus indicator */
}


/* Truncate each individual entry to 3 lines */
.calendarEntry {
    display: -webkit-box;
    -webkit-line-clamp: 3; /* Number of lines to display */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2em;
    max-height: 3.6em; /* line-height * lines to display */
    margin: 2px 0;
    padding: 2px;
    background: #444;
    border: 1px solid #555;
    color: #eee;
    cursor: move;
}

        .calendarEntry:hover {
            background: #555;
        }

        /* Modal Styles */
        #entryModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
        }

        #entryModalContent {
            background: #333;
            padding: 20px;
            border: 1px solid #444;
            width: 400px;
            box-sizing: border-box;
            color: #eee;
        }

        #entryModalContent h3 {
            margin-top: 0;
            color: #eee;
        }

        #entryModalContent label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #eee;
        }

        #entryModalContent input[type=text],
        #entryModalContent select,
        #entryModalContent input[type=time],
        #entryModalContent input[type=number],
        #entryModalContent input[type=range],
        #entryModalContent input[type=date] {
            width: 100%;
            box-sizing: border-box;
            padding: 5px;
            margin-bottom: 10px;
            background: #444;
            border: 1px solid #555;
            color: #eee;
        }

        #entryModalContent .timeframe {
            display: flex;
            justify-content: space-between;
            gap: 5px;
        }

        #entryModalContent .timeframe input[type=time] {
            width: 48%;
        }

        #entryModalContent .recurrenceOptions {
            margin-bottom: 10px;
        }

        #entryModalContent .weeklyDays {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }

        #entryModalContent .weeklyDays label {
            display: flex;
            align-items: center;
            font-weight: normal;
            color: #eee;
        }

        #entryModalButtons {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-top: 10px;
        }

        #entryModalButtonsLeft {
            display: flex;
            gap: 10px;
        }

        #entryModalButtons button {
            padding: 5px 10px;
            background: #444;
            border: 1px solid #555;
            color: #eee;
            cursor: pointer;
        }

        #probabilityWrapper {
            margin-bottom: 10px;
        }
        #probabilityValue {
            text-align: center;
            margin-top: -5px;
            margin-bottom: 10px;
            color: #eee;
        }
    .currentDay {
        border: 2px solid #98cfb2; /* Gold border */
        box-shadow: 0 0 10px #98cfb2; /* Gold glow */
        background: #444; /* Slight background change to distinguish */
    }

    /* Optional: Add a hover effect for the current day */
    .currentDay:hover {
        background: #555;
    }
    `);


// Create the toggle button container
window.notifierToggleButton = document.createElement('div');
notifierToggleButton.innerHTML = `
    <button id="toggle-notifier-panel"
        style="
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            top: 10px;
            right: 0px;
            left: 10px;
            padding: 7px 15px;
            background: transparent;
            color: #b0b0b0;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            text-align: left;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.1s, color 0.1s;
            z-index: 1001;">
        <svg width="17px" height="17px" viewBox="0 0 24 24"
             fill="#b0b0b0" stroke="#b0b0b0"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M8,21h8c2.8,0,5-2.2,5-5v-4c0-0.6-0.4-1-1-1s-1,0.4-1,1v4c0,1.7-1.3,3-3,3H8
                   c-1.7,0-3-1.3-3-3V8c0-1.7,1.3-3,3-3h4c0.6,0,1-0.4,1-1s-0.4-1-1-1H8C5.2,3,3,5.2,3,8v8C3,18.8,5.2,21,8,21z"></path>
          <path d="M18,2c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S20.2,2,18,2z
                   M18,8c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S19.1,8,18,8z"></path>
        </svg>
        Show Notifiers
    </button>
`;

// Apply hover effects to the button
const notifierButtonElement = notifierToggleButton.querySelector('button');
notifierButtonElement.onmouseover = () => {
    notifierButtonElement.style.backgroundColor = '#212121';
    notifierButtonElement.style.color = '#ffffff';
};
notifierButtonElement.onmouseout = () => {
    notifierButtonElement.style.backgroundColor = 'transparent';
    notifierButtonElement.style.color = '#b0b0b0';
};

// Later, append to your panel as needed:
// DCstoragePanel.appendChild(notifierToggleButton);


    // Create panel
    let panel = document.createElement('div');
    panel.id = 'calendarPanel';
    panel.innerHTML = `
        <div id="calendarPanelHeader">
            <span>Profiles & Calendar</span>
            <span id="calendarPanelClose" title="Close">X</span>
        </div>
        <div id="calendarPanelContent">
            <div id="profileSection">
                <ul id="profileList"></ul>
                <form id="addProfileForm">
                    <input type="text" id="newProfileInput" placeholder="New profile name" />
                    <button type="submit">Add</button>
                </form>
            </div>
            <div id="calendarSection">
                <div id="calendarNav">
                    <button id="prevMonthBtn">&lt;</button>
                    <span id="currentMonthLabel"></span>
                    <button id="nextMonthBtn">&gt;</button>
                </div>
<div id="dayNamesRow" style="
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #444;
    margin-bottom: 5px;
    padding-bottom: 5px;
">
    <div>Mon</div>
    <div>Tue</div>
    <div>Wed</div>
    <div>Thu</div>
    <div>Fri</div>
    <div>Sat</div>
    <div>Sun</div>
</div>

<div id="calendarGrid"></div>

                <div id="calendarGrid"></div>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // Create entry modal
    let entryModal = document.createElement('div');
    entryModal.id = 'entryModal';
    entryModal.innerHTML = `
        <div id="entryModalContent">
            <h3>Add/Edit Entry</h3>
            <label for="entryTitle">Title:</label>
            <input type="text" id="entryTitle" placeholder="Entry title">

            <label>Start Date:</label>
            <input type="date" id="entryStartDate">

            <label>End Date:</label>
            <input type="date" id="entryEndDate">

            <label>Time / Timeframe:</label>
            <div class="timeframe">
                <input type="time" id="entryStartTime">
                <input type="time" id="entryEndTime">
            </div>

            <label for="recurrenceType">Recurrence:</label>
            <select id="recurrenceType">
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Select days)</option>
                <option value="monthly">Monthly (Same day of month)</option>
            </select>

            <div class="recurrenceOptions">
                <div id="weeklyDaysOptions" style="display:none;">
                    <div class="weeklyDays">
                        <label><input type="checkbox" value="1">Mon</label>
                        <label><input type="checkbox" value="2">Tue</label>
                        <label><input type="checkbox" value="3">Wed</label>
                        <label><input type="checkbox" value="4">Thu</label>
                        <label><input type="checkbox" value="5">Fri</label>
                        <label><input type="checkbox" value="6">Sat</label>
                        <label><input type="checkbox" value="0">Sun</label>
                    </div>
                </div>
            </div>


<div id="dailyDaysOptions" style="display:none;">
    <div class="weeklyDays">
        <label><input type="checkbox" value="1" checked>Mon</label>
        <label><input type="checkbox" value="2" checked>Tue</label>
        <label><input type="checkbox" value="3" checked>Wed</label>
        <label><input type="checkbox" value="4" checked>Thu</label>
        <label><input type="checkbox" value="5" checked>Fri</label>
        <label><input type="checkbox" value="6" checked>Sat</label>
        <label><input type="checkbox" value="0" checked>Sun</label>
    </div>
    <p style="font-size:12px;color:#eee;">(Uncheck any days you do not want to include in the daily schedule)</p>
</div>



            <div id="probabilityWrapper">
                <label for="entryProbability">Probability (%):</label>
                <input type="range" id="entryProbability" min="0" max="100" value="100">
                <div id="probabilityValue">100%</div>
            </div>

            <div id="entryModalButtons">
                <div id="entryModalButtonsLeft">
                    <button id="saveEntryBtn">Save</button>
                    <button id="cancelEntryBtn">Cancel</button>
                </div>
                <button id="deleteEntryBtn" style="display:none;background:#600;border:1px solid #800;">Delete</button>
            </div>
        </div>
    `;
    document.body.appendChild(entryModal);

    let currentProfile = null;
    // Load selected profile
    let lastProfile = localStorage.getItem('selectedProfile.notifier');
    if (lastProfile && localStorage.getItem('notifier.profile:' + lastProfile)) {
        currentProfile = lastProfile;
    }

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let editingEventId = null; // if we're editing an event

    // Elements
    const calendarGrid = panel.querySelector('#calendarGrid');
    const currentMonthLabel = panel.querySelector('#currentMonthLabel');
    const profileListEl = panel.querySelector('#profileList');
    const addProfileForm = panel.querySelector('#addProfileForm');
    const newProfileInput = panel.querySelector('#newProfileInput');

    const modal = document.getElementById('entryModal');
    const entryTitle = document.getElementById('entryTitle');
    const entryStartTime = document.getElementById('entryStartTime');
    const entryEndTime = document.getElementById('entryEndTime');
    const recurrenceType = document.getElementById('recurrenceType');
    const weeklyDaysOptions = document.getElementById('weeklyDaysOptions');
    const dailyDaysOptions = document.getElementById('dailyDaysOptions');
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const cancelEntryBtn = document.getElementById('cancelEntryBtn');
    const deleteEntryBtn = document.getElementById('deleteEntryBtn');
    const entryProbability = document.getElementById('entryProbability');
    const probabilityValue = document.getElementById('probabilityValue');
    const entryStartDate = document.getElementById('entryStartDate');
    const entryEndDate = document.getElementById('entryEndDate');

// After the calendar is rendered:
document.querySelectorAll('.calendarDayEntries').forEach(dayEntries => {
    // Make it focusable
    dayEntries.setAttribute('tabindex', '0');

    // On hover, focus the entry panel so keyboard scroll will target it
    dayEntries.addEventListener('mouseenter', () => {
        dayEntries.focus();
    });

    // Optional: Remove focus on mouse leave (if desired)
    dayEntries.addEventListener('mouseleave', () => {
        dayEntries.blur();
    });
});



    notifierButtonElement.addEventListener('click', () => {
        panel.style.display = (panel.style.display === 'none' || panel.style.display === '') ? 'block' : 'none';
        renderProfiles();
        renderCalendar();
    });

    document.getElementById('calendarPanelClose').addEventListener('click', () => {
        panel.style.display = 'none';
    });

    addProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let name = newProfileInput.value.trim();
        if (name !== '') {
            createProfile(name);
            currentProfile = name;
            saveSelectedProfile();
            newProfileInput.value = '';
            renderProfiles();
            renderCalendar();
        }
    });

    document.getElementById('prevMonthBtn').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    document.getElementById('nextMonthBtn').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

recurrenceType.addEventListener('change', () => {
    if (recurrenceType.value === 'weekly') {
        weeklyDaysOptions.style.display = 'block';
        dailyDaysOptions.style.display = 'none';
    } else if (recurrenceType.value === 'daily') {
        dailyDaysOptions.style.display = 'block';
        weeklyDaysOptions.style.display = 'none';
    } else {
        weeklyDaysOptions.style.display = 'none';
        dailyDaysOptions.style.display = 'none';
    }
});


    saveEntryBtn.addEventListener('click', () => {
        saveEntry();
    });

    cancelEntryBtn.addEventListener('click', () => {
        closeModal();
    });

    deleteEntryBtn.addEventListener('click', () => {
        if (editingEventId) {
            deleteEntry(editingEventId);
        }
    });

    entryProbability.addEventListener('input', () => {
        probabilityValue.textContent = entryProbability.value + '%';
    });

    // Drag & Drop handlers
    calendarGrid.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    calendarGrid.addEventListener('drop', (e) => {
        e.preventDefault();
        let eventId = e.dataTransfer.getData('text');
        let target = e.target.closest('.calendarDay');
        if (!target || !eventId) return;
        let dayNumber = parseInt(target.querySelector('.dayNumber')?.textContent, 10);
        if (!dayNumber) return;

        let entries = getAllEntries();
        let entry = entries.find(en => en.id === eventId);
        if (!entry) return;

        let dropDate = new Date(currentYear, currentMonth, dayNumber);
        adjustRecurrenceForDrop(entry, dropDate);
        setAllEntries(entries);
        renderCalendar();
    });

    function createProfile(profileName) {
        if (!localStorage.getItem('notifier.profile:' + profileName)) {
            localStorage.setItem('notifier.profile:' + profileName, '{}');
            // Also initialize entries
            localStorage.setItem(profileName + '.notifiers', '[]');
        }
    }

    function deleteProfile(profileName) {
        if (!confirm(`Delete profile "${profileName}"? This will remove all entries for that profile.`)) return;
        localStorage.removeItem('notifier.profile:' + profileName);
        localStorage.removeItem(profileName + '.notifiers');
        if (currentProfile === profileName) {
            currentProfile = null;
        }
        if (!currentProfile) {
            localStorage.removeItem('selectedProfile.notifier');
        }
        renderProfiles();
        renderCalendar();
    }

    function saveSelectedProfile() {
        if (currentProfile) {
            localStorage.setItem('selectedProfile.notifier', currentProfile);
        } else {
            localStorage.removeItem('selectedProfile.notifier');
        }
    }

    function getProfiles() {
        let profiles = [];
        for (let i=0; i<localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key && key.startsWith('notifier.profile:')) {
                let profileName = key.substring('notifier.profile:'.length);
                profiles.push(profileName);
            }
        }
        return profiles;
    }

    function renderProfiles() {
        let profiles = getProfiles();
        profileListEl.innerHTML = '';
        profiles.forEach(p => {
            let li = document.createElement('li');
            let nameSpan = document.createElement('span');
            nameSpan.className = 'profileName';
            nameSpan.textContent = p;

            let delBtn = document.createElement('button');
            delBtn.className = 'deleteProfileBtn';
            delBtn.textContent = 'Del';
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteProfile(p);
            });

            li.appendChild(nameSpan);
            li.appendChild(delBtn);

            if (p === currentProfile) {
                li.classList.add('selected');
            }
            li.addEventListener('click', () => {
                currentProfile = p;
                saveSelectedProfile();
                renderProfiles();
                renderCalendar();
            });
            profileListEl.appendChild(li);
        });
    }

    function getAllEntries() {
        if (!currentProfile) return [];
        let key = currentProfile + '.notifiers';
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    function setAllEntries(entries) {
        if (!currentProfile) return;
        let key = currentProfile + '.notifiers';
        localStorage.setItem(key, JSON.stringify(entries));
    }

function renderCalendar() {
    if (!currentProfile) {
        currentMonthLabel.textContent = "No profile selected";
        calendarGrid.innerHTML = '';
        return;
    }

    let date = new Date(currentYear, currentMonth, 1);
    let monthName = date.toLocaleString('default', { month: 'long' });
    currentMonthLabel.textContent = `${monthName} ${currentYear}`;

    let startDay = (date.getDay() + 6) % 7; // Adjusting so Monday=0
    let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    calendarGrid.innerHTML = '';

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
        let emptyCell = document.createElement('div');
        emptyCell.classList.add('calendarDay'); // Optional: Style empty cells similarly
        calendarGrid.appendChild(emptyCell);
    }

    let entries = getAllEntries();

    // Get today's date for highlighting
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        let cell = document.createElement('div');
        cell.className = 'calendarDay';
        cell.setAttribute('data-day', day);
        cell.innerHTML = `<span class="dayNumber">${day}</span><div class="calendarDayEntries"></div>`;

        // Highlight the current day
        if (currentYear === todayYear && currentMonth === todayMonth && day === todayDate) {
            cell.classList.add('currentDay');
        }

        cell.addEventListener('click', (e) => {
            if (e.target.classList.contains('calendarEntry')) {
                // Handled separately
            } else {
                openModalForNew(day);
            }
        });

        let dayEntries = getEntriesForDay(entries, currentYear, currentMonth, day);
        dayEntries.sort((a, b) => (a.startTime || '00:00').localeCompare(b.startTime || '00:00'));

        let entriesContainer = cell.querySelector('.calendarDayEntries');
        dayEntries.forEach(entry => {
            let div = document.createElement('div');
            div.className = 'calendarEntry';
            div.setAttribute('draggable', 'true');
            div.setAttribute('data-event-id', entry.id);

            div.addEventListener('dragstart', (ev) => {
                ev.dataTransfer.setData('text', entry.id);
            });

            div.addEventListener('click', (ev) => {
                ev.stopPropagation();
                openModalForEdit(entry.id);
            });

            div.textContent = formatEntry(entry);
            entriesContainer.appendChild(div);
        });

        calendarGrid.appendChild(cell);
    }
}


    function isMultiDay(entry) {
        return (entry.endYear !== entry.year || entry.endMonth !== entry.month || entry.endDay !== entry.day);
    }

    function dateInRange(date, start, end) {
        return date >= start && date <= end;
    }

function getEntriesForDay(allEntries, year, month, day) {
    let dayDate = new Date(year, month, day);
    let dayOfWeek = dayDate.getDay().toString();

    return allEntries.filter(entry => {
        let startDate = new Date(entry.year, entry.month, entry.day);
        let endDate = new Date(entry.endYear, entry.endMonth, entry.endDay);

        // If no recurrence
        if (entry.recurrenceType === 'none') {
            if (!dateInRange(dayDate, startDate, endDate)) return false;
            return true;
        }

        // For all recurrence types, ensure day is after start date:
        if (dayDate < startDate) return false;

        if (entry.recurrenceType === 'daily') {
            // If dailyDays is defined, only show on those days.
            if (entry.dailyDays && entry.dailyDays.length > 0) {
                return entry.dailyDays.includes(dayOfWeek);
            }
            // If no dailyDays stored, assume all days.
            return true;
        } else if (entry.recurrenceType === 'weekly') {
            // If no days selected, we used start day. If days selected, must match.
            return entry.weekDays && entry.weekDays.includes(dayOfWeek);
        } else if (entry.recurrenceType === 'monthly') {
            // Shows up every month on same day number.
            return day === entry.day;
        }

        return false;
    });
}


    function formatEntry(entry) {
        let timeStr = '';
        if (entry.startTime && entry.endTime) {
            timeStr = `${entry.startTime}-${entry.endTime} `;
        } else if (entry.startTime) {
            timeStr = `${entry.startTime} `;
        }

        let probStr = '';
        if (entry.probability != null) {
            probStr = `[${entry.probability}%] `;
        }

        return `${probStr}${timeStr}${entry.title}`;
    }

    function openModalForNew(day) {
        editingEventId = null;
        entryTitle.value = '';
        entryStartTime.value = '';
        entryEndTime.value = '';
        recurrenceType.value = 'none';
        weeklyDaysOptions.style.display = 'none';
        dailyDaysOptions.style.display = 'none';
        Array.from(weeklyDaysOptions.querySelectorAll('input[type=checkbox]')).forEach(cb => cb.checked = false);
        entryProbability.value = 100;
        probabilityValue.textContent = '100%';

        let year = currentYear;
        let month = currentMonth+1;
        let dayPadded = String(day).padStart(2,'0');
        let monthPadded = String(month).padStart(2,'0');
        let dateStr = `${year}-${monthPadded}-${dayPadded}`;

        entryStartDate.value = dateStr;
        entryEndDate.value = dateStr;

        deleteEntryBtn.style.display = 'none';

        modal.style.display = 'flex';
    }

    function openModalForEdit(id) {
        let entries = getAllEntries();
        let entry = entries.find(e => e.id === id);
        if (!entry) return;

        editingEventId = id;

        entryTitle.value = entry.title;
        entryStartTime.value = entry.startTime;
        entryEndTime.value = entry.endTime;
        recurrenceType.value = entry.recurrenceType;
        entryProbability.value = entry.probability || 100;
        probabilityValue.textContent = (entry.probability || 100) + '%';

        if (entry.recurrenceType === 'weekly') {
            weeklyDaysOptions.style.display = 'block';
            Array.from(weeklyDaysOptions.querySelectorAll('input[type=checkbox]')).forEach(cb => {
                cb.checked = entry.weekDays && entry.weekDays.includes(cb.value);
            });
        } else {
            weeklyDaysOptions.style.display = 'none';
        }

    if (entry.recurrenceType === 'daily') {
        dailyDaysOptions.style.display = 'block';
        Array.from(dailyDaysOptions.querySelectorAll('input[type=checkbox]')).forEach(cb => {
            cb.checked = !entry.dailyDays || entry.dailyDays.includes(cb.value);
        });
    } else {
        dailyDaysOptions.style.display = 'none';
    }


        let startY = entry.year; let startM = entry.month+1; let startD = entry.day;
        let endY = entry.endYear; let endM = entry.endMonth+1; let endD = entry.endDay;
        entryStartDate.value = `${startY}-${String(startM).padStart(2,'0')}-${String(startD).padStart(2,'0')}`;
        entryEndDate.value = `${endY}-${String(endM).padStart(2,'0')}-${String(endD).padStart(2,'0')}`;

        deleteEntryBtn.style.display = 'inline-block';

        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

function saveEntry() {
    if (!currentProfile) return;

    let title = entryTitle.value.trim();
    if (!title) {
        alert('Title cannot be empty.');
        return;
    }

    let start = entryStartTime.value;
    let end = entryEndTime.value;
    let rType = recurrenceType.value;

    let sDate = new Date(entryStartDate.value);
    let eDate = new Date(entryEndDate.value);

    // Validate start date
    if (isNaN(sDate.getTime())) {
        alert("Invalid start date");
        return;
    }

    // If recurrence but no valid end date, pick a far future end date
    if (rType !== 'none' && isNaN(eDate.getTime())) {
        let futureDate = new Date(sDate);
        futureDate.setFullYear(futureDate.getFullYear() + 100);
        eDate = futureDate;
    }

    // If end date is given and is before start, warn
    if (!isNaN(eDate.getTime()) && eDate < sDate) {
        alert("End date must be after or equal to start date.");
        return;
    }

    let prob = parseInt(entryProbability.value, 10) || 100;
    let entries = getAllEntries();
    let entry;

    if (editingEventId) {
        entry = entries.find(e => e.id === editingEventId);
        if (!entry) return;
    } else {
        entry = { id: generateId() };
        entries.push(entry);
    }

    entry.title = title;
    entry.startTime = start || '';
    entry.endTime = end || '';
    entry.recurrenceType = rType;
    entry.probability = prob;

    entry.year = sDate.getFullYear();
    entry.month = sDate.getMonth();
    entry.day = sDate.getDate();
    entry.endYear = eDate.getFullYear();
    entry.endMonth = eDate.getMonth();
    entry.endDay = eDate.getDate();

    if (rType === 'weekly') {
        let weekDays = Array.from(weeklyDaysOptions.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
        if (weekDays.length === 0) {
            let startDayOfWeek = sDate.getDay().toString();
            weekDays = [startDayOfWeek];
        }
        entry.weekDays = weekDays;
        delete entry.dailyDays; // ensure no dailyDays if weekly
    } else if (rType === 'daily') {
        // Gather selected daily days
        let dailyDays = Array.from(dailyDaysOptions.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
        // If all are checked, we can either store them all or consider that as a default 'all days'.
        // Let's store them anyway.
        if (dailyDays.length === 7) {
            // All days selected. We can leave it as all.
            // Storing them is fine, it means "all days".
        }
        entry.dailyDays = dailyDays;
        delete entry.weekDays; // ensure no weekDays if daily
    } else {
        // no daily or weekly days
        delete entry.weekDays;
        delete entry.dailyDays;
    }

    setAllEntries(entries);
    closeModal();
    renderCalendar();
}


    function deleteEntry(id) {
        if (!confirm('Delete this entry?')) return;
        let entries = getAllEntries();
        entries = entries.filter(e => e.id !== id);
        setAllEntries(entries);
        closeModal();
        renderCalendar();
    }

    function adjustRecurrenceForDrop(entry, dropDate) {
        if (entry.recurrenceType === 'daily') {
            let oldDate = new Date(entry.year, entry.month, entry.day);
            let diff = (dropDate - oldDate)/(1000*3600*24);
            let startObj = new Date(entry.year, entry.month, entry.day);
            let endObj = new Date(entry.endYear, entry.endMonth, entry.endDay);
            startObj.setDate(startObj.getDate()+diff);
            endObj.setDate(endObj.getDate()+diff);
            entry.year = startObj.getFullYear();
            entry.month = startObj.getMonth();
            entry.day = startObj.getDate();
            entry.endYear = endObj.getFullYear();
            entry.endMonth = endObj.getMonth();
            entry.endDay = endObj.getDate();
        } else if (entry.recurrenceType === 'weekly') {
            let newDayOfWeek = dropDate.getDay().toString();
            entry.weekDays = [newDayOfWeek];
            let oldDate = new Date(entry.year, entry.month, entry.day);
            let diff = (dropDate - oldDate)/(1000*3600*24);
            let startObj = new Date(entry.year, entry.month, entry.day);
            let endObj = new Date(entry.endYear, entry.endMonth, entry.endDay);
            startObj.setDate(startObj.getDate()+diff);
            endObj.setDate(endObj.getDate()+diff);
            entry.year = startObj.getFullYear();
            entry.month = startObj.getMonth();
            entry.day = startObj.getDate();
            entry.endYear = endObj.getFullYear();
            entry.endMonth = endObj.getMonth();
            entry.endDay = endObj.getDate();

        } else if (entry.recurrenceType === 'monthly') {
            let oldStart = new Date(entry.year, entry.month, entry.day);
            let oldEnd = new Date(entry.endYear, entry.endMonth, entry.endDay);
            let length = (oldEnd - oldStart)/(1000*3600*24);
            entry.year = dropDate.getFullYear();
            entry.month = dropDate.getMonth();
            entry.day = dropDate.getDate();
            let endObj = new Date(entry.year, entry.month, entry.day);
            endObj.setDate(endObj.getDate()+length);
            entry.endYear = endObj.getFullYear();
            entry.endMonth = endObj.getMonth();
            entry.endDay = endObj.getDate();
        } else {
            let oldDate = new Date(entry.year, entry.month, entry.day);
            let diff = (dropDate - oldDate)/(1000*3600*24);
            let startObj = new Date(entry.year, entry.month, entry.day);
            let endObj = new Date(entry.endYear, entry.endMonth, entry.endDay);
            startObj.setDate(startObj.getDate()+diff);
            endObj.setDate(endObj.getDate()+diff);
            entry.year = startObj.getFullYear();
            entry.month = startObj.getMonth();
            entry.day = startObj.getDate();
            entry.endYear = endObj.getFullYear();
            entry.endMonth = endObj.getMonth();
            entry.endDay = endObj.getDate();
        }
    }

let messageSentTimestamps = {};
//let notifierActive = false;

function loadNotifiers(profileName) {
    console.log("Loading notifiers for profile:", profileName);
    const data = localStorage.getItem(`${profileName}.notifiers`);
    if (!data) {
        console.log("No notifier data found for profile:", profileName);
        return [];
    }
    try {
        const parsed = JSON.parse(data);
        console.log("Notifier data loaded:", parsed);
        return parsed;
    } catch (e) {
        console.error("Failed to parse notifier data:", e);
        return [];
    }
}

function saveMessageSentTimestamps() {
    localStorage.setItem('messageSentTimestamps', JSON.stringify(messageSentTimestamps));
}

function loadMessageSentTimestamps() {
    console.log("Loading messageSentTimestamps...");
    messageSentTimestamps = JSON.parse(localStorage.getItem('messageSentTimestamps') || '{}');
    console.log("messageSentTimestamps loaded:", messageSentTimestamps);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get ISO week number
function getWeekNumber(date) {
    const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(),0,1));
    return Math.ceil((((tempDate - yearStart) / 86400000) + 1)/7);
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// For monthly triggers
function getMonthlyTriggerDate(event, now) {
    console.log("Determining monthly trigger date for event:", event.id);
    const yearMonthKey = `${event.id}-monthlyTrigger-${now.getFullYear()}-${now.getMonth()}`;
    let stored = localStorage.getItem(yearMonthKey);
    if (stored) {
        console.log("Found stored monthly trigger date/time:", stored);
        return JSON.parse(stored);
    }

    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    let day = getRandomInt(1, daysInMonth);
    let hour = 0, minute = 0;
    if (event.endTime) {
        const [startH, startM] = event.startTime.split(':').map(Number);
        const [endH, endM] = event.endTime.split(':').map(Number);
        const startTotal = startH*60 + startM;
        const endTotal = endH*60 + endM;
        const randomTotal = getRandomInt(startTotal, endTotal);
        hour = Math.floor(randomTotal / 60);
        minute = randomTotal % 60;
    } else {
        const [h,m] = event.startTime.split(':').map(Number);
        hour = h; minute = m;
    }

    const triggerData = { day, hour, minute };
    localStorage.setItem(yearMonthKey, JSON.stringify(triggerData));
    console.log("Stored new monthly trigger date/time:", triggerData);
    return triggerData;
}

// For weekly triggers
function getWeeklyTriggerTime(event, now) {
    console.log("Determining weekly trigger time for event:", event.id);
    const year = now.getFullYear();
    const weekNum = getWeekNumber(now);
    const dow = now.getDay();
    const key = `${event.id}-weeklyTrigger-${year}-${weekNum}-${dow}`;

    let stored = localStorage.getItem(key);
    if (stored) {
        console.log("Found stored weekly trigger time:", stored);
        return JSON.parse(stored);
    }

    if (!event.endTime) {
        const [h,m] = event.startTime.split(':').map(Number);
        const triggerData = { hour: h, minute: m };
        localStorage.setItem(key, JSON.stringify(triggerData));
        console.log("No timeframe, weekly trigger time:", triggerData);
        return triggerData;
    }

    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const startTotal = startH*60 + startM;
    const endTotal = endH*60 + endM;
    const randomTotal = getRandomInt(startTotal, endTotal);
    const hour = Math.floor(randomTotal / 60);
    const minute = randomTotal % 60;
    const triggerData = { hour, minute };
    localStorage.setItem(key, JSON.stringify(triggerData));
    console.log("Timeframe weekly trigger time:", triggerData);
    return triggerData;
}

// For daily triggers
function getDailyTriggerTime(event, now) {
    console.log("Determining daily trigger time for event:", event.id);
    const dateKey = `${event.id}-dailyTrigger-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    let stored = localStorage.getItem(dateKey);
    if (stored) {
        console.log("Found stored daily trigger time:", stored);
        return JSON.parse(stored);
    }

    if (!event.endTime) {
        const [h,m] = event.startTime.split(':').map(Number);
        const triggerData = { hour: h, minute: m };
        localStorage.setItem(dateKey, JSON.stringify(triggerData));
        console.log("No timeframe, daily trigger time:", triggerData);
        return triggerData;
    }

    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const startTotal = startH*60 + startM;
    const endTotal = endH*60 + endM;
    const randomTotal = getRandomInt(startTotal, endTotal);
    const hour = Math.floor(randomTotal / 60);
    const minute = randomTotal % 60;
    const triggerData = { hour, minute };
    localStorage.setItem(dateKey, JSON.stringify(triggerData));
    console.log("Timeframe daily trigger time:", triggerData);
    return triggerData;
}

// For single events
function getSingleTriggerTime(event) {
    console.log("Determining single event trigger time:", event.id);
    const eventDateKey = `${event.id}-singleTrigger-${event.year}-${event.month}-${event.day}`;
    let stored = localStorage.getItem(eventDateKey);
    if (stored) {
        console.log("Found stored single trigger time:", stored);
        return JSON.parse(stored);
    }

    if (!event.endTime) {
        const [h,m] = event.startTime.split(':').map(Number);
        const triggerData = { hour: h, minute: m };
        localStorage.setItem(eventDateKey, JSON.stringify(triggerData));
        console.log("No timeframe, single event trigger time:", triggerData);
        return triggerData;
    }

    const [startH, startM] = event.startTime.split(':').map(Number);
    const [endH, endM] = event.endTime.split(':').map(Number);
    const startTotal = startH*60 + startM;
    const endTotal = endH*60 + endM;
    const randomTotal = getRandomInt(startTotal, endTotal);
    const hour = Math.floor(randomTotal / 60);
    const minute = randomTotal % 60;

    const triggerData = { hour, minute };
    localStorage.setItem(eventDateKey, JSON.stringify(triggerData));
    console.log("Timeframe single event trigger time:", triggerData);
    return triggerData;
}

function hasTriggeredThisPeriod(event, now) {
    const key = getTriggerKeyForEvent(event, now);
    const triggered = !!localStorage.getItem(key);
    console.log(`Checking if event ${event.id} triggered this period (key: ${key}):`, triggered);
    return triggered;
}

function markTriggeredThisPeriod(event, now) {
    const key = getTriggerKeyForEvent(event, now);
    localStorage.setItem(key, "triggered");
    console.log(`Marked event ${event.id} as triggered for period with key:`, key);
}

function getTriggerKeyForEvent(event, now) {
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    switch (event.recurrenceType) {
        case 'daily':
            return `${event.id}-triggered-${year}-${month}-${date}`;
        case 'weekly': {
            const weekNum = getWeekNumber(now);
            return `${event.id}-triggered-${year}-week${weekNum}`;
        }
        case 'monthly':
            return `${event.id}-triggered-${year}-${month}`;
        case 'none':
        case '':
        case undefined:
        case null:
            // single/no recurrence
            if (event.year !== undefined && event.month !== undefined && event.day !== undefined) {
                return `${event.id}-triggered-${event.year}-${event.month}-${event.day}`;
            } else {
                // no date means trigger once ever
                return `${event.id}-triggered-once`;
            }
        default:
            // Unknown recurrence - treat as single event to avoid skipping
            return `${event.id}-triggered-once`;
    }
}

function isEventDueThisPeriod(event, now) {
    console.log("Checking if event is due this period:", event.id, "Recurrence:", event.recurrenceType);
    if (!event.recurrenceType || event.recurrenceType === "" || event.recurrenceType === "none") {
        // single event logic
        if (event.year !== undefined && event.month !== undefined && event.day !== undefined) {
            const evDate = new Date(event.year, event.month, event.day);
            const due = isSameDay(evDate, now);
            console.log("Single event due check:", due);
            return due;
        } else {
            // If no specific date is given and no recurrence, assume it should trigger today
            // This means we just consider it could trigger any time today
            return true;
        }
    }

    if (event.recurrenceType === 'daily') {
        console.log("Daily event is always due");
        return true;
    }

    if (event.recurrenceType === 'weekly') {
        if (!Array.isArray(event.weekDays) || event.weekDays.length === 0) {
            console.log("Weekly event has no weekDays defined, not due");
            return false;
        }
        const currentDayOfWeek = now.getDay();
        const dayInts = event.weekDays.map(d => parseInt(d,10));
        const due = dayInts.includes(currentDayOfWeek);
        console.log("Weekly event due check (currentDayOfWeek:", currentDayOfWeek, "):", due);
        return due;
    }

    if (event.recurrenceType === 'monthly') {
        // monthly triggers once a month
        console.log("Monthly event is due if not triggered yet this month");
        return true;
    }

    console.log("Recurrence type unknown:", event.recurrenceType);
    return false;
}

function probabilityPassed(prob) {
    const roll = Math.random() * 100;
    console.log("Probability roll:", roll, "Needed:", prob);
    return roll <= prob;
}

function tryTriggerEvent(event, now) {
    console.log("Trying to trigger event:", event.id, event);
    if (hasTriggeredThisPeriod(event, now)) {
        console.log("Event already triggered this period, skipping:", event.id);
        return false;
    }

    if (!isEventDueThisPeriod(event, now)) {
        console.log("Event not due this period, skipping:", event.id);
        return false;
    }

    let triggerHour, triggerMinute, triggerDay = now.getDate();

    // Determine trigger time based on recurrence and timeframe
    if (event.recurrenceType === 'daily') {
        const trig = getDailyTriggerTime(event, now);
        triggerHour = trig.hour;
        triggerMinute = trig.minute;
    } else if (event.recurrenceType === 'weekly') {
        const trig = getWeeklyTriggerTime(event, now);
        triggerHour = trig.hour;
        triggerMinute = trig.minute;
    } else if (event.recurrenceType === 'monthly') {
        const trig = getMonthlyTriggerDate(event, now);
        triggerHour = trig.hour;
        triggerMinute = trig.minute;
        triggerDay = trig.day;
    } else {
        // single/no recurrence
        const trig = getSingleTriggerTime(event);
        triggerHour = trig.hour;
        triggerMinute = trig.minute;
    }

    console.log("Trigger time determined:", {triggerDay, triggerHour, triggerMinute});

    if (event.recurrenceType === 'monthly' && triggerDay !== now.getDate()) {
        console.log("Not the chosen day for monthly event. Current day:", now.getDate(), "Trigger day:", triggerDay);
        return false;
    }

    if (now.getHours() === triggerHour && now.getMinutes() === triggerMinute) {
        let prob = event.probability !== undefined ? event.probability : 100;
        if (!probabilityPassed(prob)) {
            console.log("Probability check failed for event:", event.id);
            markTriggeredThisPeriod(event, now);
            return false;
        }

        console.log("Event conditions met, triggering event:", event.title);
        sendNotifierMessage(`<[Notifier] ${event.title}>`);
        markTriggeredThisPeriod(event, now);
        return true;
    } else {
        console.log("Current time does not match trigger time for event:", event.id);
    }

    return false;
}

function sendNotifierMessage(notifierMessage) {
    console.log("Sending notifier message:", notifierMessage);
    const inputElement = document.querySelector('[data-slate-editor="true"]') || document.querySelector('textarea[class*="textArea_"]');
    if (!inputElement) {
        console.log("No input element found, cannot send message");
        return;
    }

    notifierActive = true;

    inputElement.focus();
    if (inputElement.getAttribute('data-slate-editor') === 'true') {
        const inputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: `${notifierMessage}`,
        });
        inputElement.dispatchEvent(inputEvent);
    } else {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, inputElement.value + notifierMessage);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        inputElement.dispatchEvent(inputEvent);
        inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length);
    }

    let sendButton = document.querySelector('button[aria-label="Nachricht senden"]');
    if (sendButton) {
        sendButton.click();
        console.log('Send button clicked to send message');
        notifierActive = false; // Reset notifierActive after sending
    } else {
        // For desktop version, simulate pressing Enter to send the message
        let enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        inputElement.dispatchEvent(enterEvent);
        console.log('Enter key simulated to send message');
        notifierActive = false; // Reset notifierActive after sending
    }
}

function setInputValue() {
    console.log("setInputValue() called");
    if (notifierActive) {
        console.log("notifierActive is true, skipping");
        return;
    }

    const selectedProfile = localStorage.getItem('selectedProfile.notifier');
    if (!selectedProfile) {
        console.error("Selected profile not found in localStorage");
        return;
    }

    loadMessageSentTimestamps();

    const now = new Date();
    const notifiers = loadNotifiers(selectedProfile);
    if (!notifiers || notifiers.length === 0) {
        console.log("No notifiers found for this profile");
        return;
    }

    console.log("Checking events for triggering...");
    for (let event of notifiers) {
        if (tryTriggerEvent(event, now)) {
            console.log("Event triggered, stopping further checks");
            break;
        }
    }
}

function checkForMessages() {
    console.log("Starting interval to check for messages every 20s");
    setInterval(() => {
        setInputValue();
    }, 20000);
}

// Throttle function to limit the frequency of callback execution
function throttle(callback, limit) {
    let waiting = false; // Initially, we're not waiting
    return function (...args) {
        if (!waiting) {
            callback.apply(this, args); // Execute callback
            waiting = true; // Prevent further execution
            setTimeout(() => (waiting = false), limit); // Reset waiting after limit
        }
    };
}

// Throttle the setInputValue logic
const throttledCallback = throttle(() => {
    console.log("Mutation observed, attempting setInputValue()");
    if (document.querySelector('[data-slate-editor="true"]') || document.querySelector('textarea[class*="textArea_"]')) {
        setInputValue();
    } else {
        console.log("No input field found in mutation observer");
    }
}, 2000); // Limit to 200ms intervals (adjust as needed)

const observer = new MutationObserver(throttledCallback);

observer.observe(document.body, { childList: true, subtree: true });


checkForMessages();

console.log("Notifier script loaded and running...");


}

// ================================================================= MAIN LOGIC =================================================================
function MainLogicScript() {
    // Function to check localStorage and reload if not ready
    function checkLocalStorageAndReload() {
        try {
            if (localStorage.length > 0) {
                console.log("LocalStorage has items. Proceeding with script...");
                initializeScript();
            } else {
                console.warn("LocalStorage is empty. Reloading page...");
                setTimeout(() => {
                    location.reload();
                }, 5000); // Wait 5 seconds before reloading
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
            setTimeout(() => {
                location.reload();
            }, 5000); // Wait 5 seconds before reloading
        }
    }

    // Initial check for localStorage existence
    checkLocalStorageAndReload();

    function initializeScript() {
        // Retrieve settings from localStorage or set default values
        let enterKeyDisabled = JSON.parse(localStorage.getItem('enterKeyDisabled')) || false;
        let customRuleEnabled = JSON.parse(localStorage.getItem('customRuleEnabled')) || true;
        let scanForKeywordsEnabled = JSON.parse(localStorage.getItem('scanForKeywordsEnabled')) || true;

        // Create the settings window
window.settingsWindow = document.createElement('div');
settingsWindow.style.bottom = '60px';
settingsWindow.style.right = '20px';
settingsWindow.style.width = '250px';
settingsWindow.style.padding = '15px';
settingsWindow.style.color = 'white';
settingsWindow.style.borderRadius = '5px';
settingsWindow.style.zIndex = '1001';

// Custom Rule Checkbox
const enableCustomRuleCheckbox = document.createElement('input');
enableCustomRuleCheckbox.type = 'checkbox';
enableCustomRuleCheckbox.checked = customRuleEnabled;
enableCustomRuleCheckbox.id = 'enableCustomRuleCheckbox';

const enableCustomRuleLabel = document.createElement('label');
enableCustomRuleLabel.htmlFor = 'enableCustomRuleCheckbox';
enableCustomRuleLabel.innerText = ' Enable Custom Rules';
enableCustomRuleLabel.style.color = '#b0b0b0';

// Wrap Custom Rule elements in a div
const customRuleDiv = document.createElement('div');
customRuleDiv.style.marginBottom = '10px'; // Add spacing
customRuleDiv.appendChild(enableCustomRuleCheckbox);
customRuleDiv.appendChild(enableCustomRuleLabel);

// Scan for Keywords Checkbox
const enableScanForKeywordsCheckbox = document.createElement('input');
enableScanForKeywordsCheckbox.type = 'checkbox';
enableScanForKeywordsCheckbox.checked = scanForKeywordsEnabled;
enableScanForKeywordsCheckbox.id = 'enableScanForKeywordsCheckbox';

const enableScanForKeywordsLabel = document.createElement('label');
enableScanForKeywordsLabel.htmlFor = 'enableScanForKeywordsCheckbox';
enableScanForKeywordsLabel.innerText = ' Enable Lorebook';
enableScanForKeywordsLabel.style.color = '#b0b0b0';

// Wrap Scan for Keywords elements in a div
const scanForKeywordsDiv = document.createElement('div');
scanForKeywordsDiv.style.marginBottom = '10px'; // Add spacing
scanForKeywordsDiv.appendChild(enableScanForKeywordsCheckbox);
scanForKeywordsDiv.appendChild(enableScanForKeywordsLabel);

// Append elements to settings window
settingsWindow.appendChild(customRuleDiv);
settingsWindow.appendChild(scanForKeywordsDiv);


// Update customRuleEnabled when checkbox is toggled, and save it in localStorage
enableCustomRuleCheckbox.addEventListener('change', function() {
    customRuleEnabled = enableCustomRuleCheckbox.checked;
    localStorage.setItem('customRuleEnabled', JSON.stringify(customRuleEnabled));
});

// Update scanForKeywordsEnabled when checkbox is toggled, and save it in localStorage
enableScanForKeywordsCheckbox.addEventListener('change', function() {
    scanForKeywordsEnabled = enableScanForKeywordsCheckbox.checked;
    localStorage.setItem('scanForKeywordsEnabled', JSON.stringify(scanForKeywordsEnabled));
});


// Function to get the correct input element based on the mode
function getInputElement() {
    return document.querySelector('[data-slate-editor="true"]') || document.querySelector('textarea[class*="textArea_"]');
}

// Add event listener to handle Enter key behavior
window.addEventListener('keydown', function(event) {
    if (notifierActive) return;

    const inputElement = getInputElement();
    if (event.key === 'Enter' && !event.shiftKey && !enterKeyDisabled) {
        if (inputElement && inputElement.nodeName === 'TEXTAREA') {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log('Enter key disabled');
        enterKeyDisabled = true;

        handleEnterKey();

        enterKeyDisabled = false;
    }
}, true);


// Add event listener to the send button to execute handleEnterKey when clicked
window.addEventListener('click', function(event) {
    if (notifierActive) {
        return; // Skip handling if the notifier is active
    }
    const sendButton = document.querySelector('button[aria-label="Nachricht senden"]');
    const inputElement = getInputElement();

    if (sendButton && sendButton.contains(event.target)) {
        if (inputElement && inputElement.nodeName === 'TEXTAREA') {
            // Skip handleEnterKey() if notifier is active
            if (!notifierActive) {
                handleEnterKey();
            }
        }
    }
}, true);



// Main function that handles Enter key behavior
function handleEnterKey() {
    if (notifierActive) {
        console.log('Notifier is active, skipping handleEnterKey');
        return; // Prevent handleEnterKey from executing if notifier is active
    }

    let inputElement = getInputElement();
    if (inputElement) {
        inputElement.focus();
        setCursorToEnd(inputElement);
        if (customRuleEnabled) {
            applyCustomRule(inputElement);
        }
        setCursorToEnd(inputElement);
        if (scanForKeywordsEnabled) {
            scanForKeywords(inputElement);
        }
        getRandomEntry(inputElement);
        sendMessage(inputElement);
        anotherCustomFunction();
    }
}


// Function to apply custom rules for the input field
function applyCustomRule(inputElement) {
    const customRule = window.customRuleLogic ? window.customRuleLogic.getCurrentText() : '';

    if (inputElement.nodeName === 'TEXTAREA') {
        // For mobile version where input is <textarea>
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, inputElement.value + customRule);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        inputElement.dispatchEvent(inputEvent);
    } else {
        // For desktop version where input is a Slate editor
        const inputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: customRule,
        });
        inputElement.dispatchEvent(inputEvent);
    }
}

// Function to set the cursor position to the end after inserting the text
function setCursorToEnd(inputElement) {
    if (inputElement.nodeName === 'TEXTAREA') {
        // For mobile version where input is <textarea>
        inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
    } else {
        // For desktop version where input is a Slate editor
        inputElement.focus();

        // Simulate repeated Ctrl + ArrowRight key press events to move cursor to the end
        const repeatPresses = 150; // Number of times to simulate Ctrl + ArrowRight
        for (let i = 0; i < repeatPresses; i++) {
            const ctrlArrowRightEvent = new KeyboardEvent('keydown', {
                key: 'ArrowRight',
                code: 'ArrowRight',
                keyCode: 39, // ArrowRight key code
                charCode: 0,
                which: 39,
                bubbles: true,
                cancelable: true,
                ctrlKey: true // Set Ctrl key to true
            });
            inputElement.dispatchEvent(ctrlArrowRightEvent);
        }
    }
}

// Function to send the message (either click send button or simulate Enter key)
function sendMessage(inputElement) {
    if (inputElement.nodeName === 'TEXTAREA') {
        // Mobile version: Do not send message, just return to allow linebreak
        return;
    }

    let sendButton = document.querySelector('button[aria-label="Nachricht senden"]');
    if (sendButton) {
        sendButton.click();
        console.log('Send button clicked to send message');
    } else {
        // For desktop version, simulate pressing Enter to send the message
        let enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        inputElement.dispatchEvent(enterEvent);
        console.log('Enter key simulated to send message');
    }
}



// Example of adding another function
function anotherCustomFunction() {
    console.log('Another custom function executed');
}




// Function to get the current profile from local storage
function getCurrentProfile() {
    return localStorage.getItem('selectedProfile.lorebook');
}



// Function to scan for keywords and access local storage
function scanForKeywords(inputElement) {
    const currentProfile = getCurrentProfile();
    if (currentProfile) {
        // Retrieve all messages before iterating through storage keys
        const messageItems = document.querySelectorAll('div[class*="messageContent_"]');
        let relevantMessages = Array.from(messageItems).slice(-15); // Last 15 messages
        const lastMessage = Array.from(messageItems).slice(-1); // Last message only


// Iterate over the last 15 messages to extract hidden bracket content
relevantMessages = relevantMessages.map(msg => {
    // Retrieve all span elements within the message
    const spans = msg.querySelectorAll('span');

    // Filter out the spans based on both style conditions: opacity and position
    const hiddenSpans = Array.from(spans).filter(span => {
        const style = window.getComputedStyle(span);
        return style.opacity === '0' && style.position === 'absolute';
    });

    // Join the text content of all matching spans, converting them to lowercase
    const bracketContent = hiddenSpans.map(span => span.textContent.toLowerCase()).join('');

    // Extract content within square brackets, if any
    const match = bracketContent.match(/\[(.*?)\]/);
    return match ? match[1] : null;
}).filter(content => content !== null);

// Log the filtered messages for debugging purposes
console.log("Filtered Relevant Messages (content in brackets, last 15):", relevantMessages);
        console.log("Last Message:", lastMessage.map(msg => msg.textContent));

        // Track how many entries have been appended
        let appendedCount = 0;
        const maxAppends = 3;

        // Check if the last message contains a specific link pattern
        const mp3LinkPattern = /https:\/\/files\.shapes\.inc\/.*\.mp3/;
        let mp3LinkValue = null;

        if (lastMessage.length > 0) {
        const lastMessageText = lastMessage[0].textContent.toLowerCase();

            const mp3LinkMatch = lastMessageText.match(mp3LinkPattern);
            if (mp3LinkMatch) {
                const mp3LinkKey = mp3LinkMatch[0];
                mp3LinkValue = localStorage.getItem(mp3LinkKey);
                console.log(`MP3 Link detected: ${mp3LinkKey}. Retrieved value: ${mp3LinkValue}`);
            }
        }

        // Create an array to hold all entry keys that need to be checked
        let allEntryKeys = [];

        // Iterate through all localStorage keys that match the profile-lorebook prefix
        Object.keys(localStorage).forEach(storageKey => {
            if (storageKey.startsWith(`${currentProfile}.lorebook:`)) {
                const entryKeys = storageKey.replace(`${currentProfile}.lorebook:`, '').split(',');
                const entryValue = localStorage.getItem(storageKey);

                // Log the entry keys for debugging purposes
                console.log(`Entry Keys: `, entryKeys);

                entryKeys.forEach(entryKey => {
                    allEntryKeys.push({ entryKey, entryValue });
                });
            }
        });

        // If mp3LinkValue is present, parse it for keywords as well
        if (mp3LinkValue) {
            console.log(`Scanning MP3 link value for keywords: ${mp3LinkValue}`);
            const mp3Keywords = mp3LinkValue.split(',');
            mp3Keywords.forEach(keyword => {
                const trimmedKeyword = keyword.trim();
                console.log(`Adding keyword from MP3 value: ${trimmedKeyword}`);
                // Add mp3 keywords but set entryValue to an empty string instead of null
                allEntryKeys.push({ entryKey: trimmedKeyword, entryValue: '' });
            });
        }

        // Iterate over all collected entry keys and perform the checks
        allEntryKeys.forEach(({ entryKey, entryValue }) => {
            if (appendedCount >= maxAppends) return; // Stop if max appends reached

            // Log each keyword being checked
            console.log(`Checking keyword: ${entryKey}`);

            // Check input element text for complete word match of keyword (case-insensitive)
            const inputText = inputElement.value || inputElement.textContent;

            // Combine check for keyword in input, in the last message, or in the mp3 link value
            const isKeywordInInput = inputText && new RegExp(`\\b${entryKey}\\b`, 'i').test(inputText);
            const isKeywordInLastMessage = lastMessage.some(message => {
                const lastMessageText = message.textContent;
                return new RegExp(`\\b${entryKey}\\b`, 'i').test(lastMessageText);
            });
            const isKeywordInMp3LinkValue = mp3LinkValue && mp3LinkValue.includes(entryKey);

            console.log(`Keyword '${entryKey}' in input: ${isKeywordInInput}, in last message: ${isKeywordInLastMessage}, in MP3 value: ${isKeywordInMp3LinkValue}`);

            if ((isKeywordInInput || isKeywordInLastMessage || isKeywordInMp3LinkValue) && entryValue) {
                const keywordAlreadyUsed = relevantMessages.some(bracketContent => {
                    return new RegExp(`\\b${entryKey}\\b`, 'i').test(bracketContent);
                });

                if (!keywordAlreadyUsed) {
                    // Append the entryValue to the input element only if entryValue is not null or empty
                    if (inputElement.nodeName === 'TEXTAREA') {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
                        nativeInputValueSetter.call(inputElement, inputElement.value + '\n' + entryValue);

                        const inputEvent = new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        inputElement.dispatchEvent(inputEvent);
                    } else {
                        const inputEvent = new InputEvent('beforeinput', {
                            bubbles: true,
                            cancelable: true,
                            inputType: 'insertText',
                            data: '\n' + entryValue,
                        });
                        inputElement.dispatchEvent(inputEvent);
                    }
                    appendedCount++; // Increment the count
                    console.log(`Keyword '${entryKey}' detected. Appended lorebook entry to the input.`);
                } else {
                    console.log(`Keyword '${entryKey}' already found in recent bracketed messages or entryValue is null/empty. Skipping append.`);
                }
            }
        });

        // Log the total number of entries appended
        console.log(`Total lorebook entries appended: ${appendedCount}`);
    }
}




function getRandomEntry(inputElement) {
    const selectedProfile = localStorage.getItem('selectedProfile.events');
    if (selectedProfile) {
        let profileEntries = [];
        const currentHour = new Date().getHours();
for (let key in localStorage) {
    if (key.startsWith(`${selectedProfile}.events:`)) {
        const entryData = JSON.parse(localStorage.getItem(key));
        const [startHour, endHour] = entryData.timeRange.split('-').map(Number);
        // Check if current hour is within the time range
        if (
            (startHour <= endHour && currentHour >= startHour && currentHour < endHour) || // Normal range
            (startHour > endHour && (currentHour >= startHour || currentHour < endHour)) // Crosses midnight
        ) {
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
                console.log(`Random Entry Selected: ${selectedEntry.value}`);
                appendToInput(inputElement, selectedEntry.value); // Append the random entry to the input element
            }
        } else {
            console.log('No entries available for the selected profile in the current time range.');
        }
    } else {
        console.log('No profile selected. Please select a profile to retrieve a random entry.');
    }
}

// Helper function to append text to the input element
function appendToInput(inputElement, text) {
    const lineBreak = '\n';
    if (!inputElement) {
        console.error('Input element not found.');
        return;
    }

    if (inputElement.nodeName === 'TEXTAREA') {
        // Mobile: Append text to <textarea>
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputElement, inputElement.value + `${lineBreak}${text}`);

        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        inputElement.dispatchEvent(inputEvent);
    } else if (inputElement.hasAttribute('data-slate-editor')) {
        // Desktop: Append text for Slate editor
        const inputEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'insertText',
            data: `${lineBreak}${text}`,
        });
        inputElement.dispatchEvent(inputEvent);
    } else {
        console.error('Unsupported input element type.');
    }
}



// Expose the function to be accessible from other scripts
window.getRandomEntry = getRandomEntry;


  }

}

// =================================================================== BUTTONS ==================================================================
function createDivider() {
const divider = document.createElement('div');
divider.style.height = '1px';
divider.style.backgroundColor = '#212121';
divider.style.margin = '20px 20px 0px 20px';
    return divider;
}

function createFooterText() {
    const footerText = document.createElement('div');
    footerText.textContent = '© Vishanka 2024';
    footerText.style.position = 'absolute';
    footerText.style.bottom = '10px';
    footerText.style.left = '50%';
    footerText.style.transform = 'translateX(-50%)';
    footerText.style.fontSize = '12px';
    footerText.style.fontWeight = '550';
    footerText.style.color = '#272727';
    return footerText;
}

function initializeButton() {
    DCstoragePanel.appendChild(openLorebookButton);


    DCstoragePanel.appendChild(eventsButton);


    DCstoragePanel.appendChild(manageRulesButton);
    DCstoragePanel.appendChild(notifierToggleButton);
    DCstoragePanel.appendChild(createDivider()); // Add divider after manageRulesButton

    DCstoragePanel.appendChild(serverbartoggleButton);


    DCstoragePanel.appendChild(mp3ToggleButton);
    DCstoragePanel.appendChild(createDivider()); // Add divider after mp3ToggleButton

    DCstoragePanel.appendChild(exportButton);

    DCstoragePanel.appendChild(importButton);
    DCstoragePanel.appendChild(createDivider()); // Add divider after importButton

    DCstoragePanel.appendChild(settingsWindow);

    DCstoragePanel.appendChild(createFooterText());
}

// ============================================================ SCRIPT LOADING ORDER ============================================================

LorebookScript();
NotifierScript();
ImportExportScript();
EventsScript();
RulesScript();
mp3Script();
StylesScript();
HiderScript();
MainLogicScript();
initializeButton();


})();

// ==UserScript==
// @name         Noba Autofill
// @version      2.7
// @description  Save, autofill, and manage form field profiles, including dropdowns, with a modern UI and automatic profile loading
// @author       Ahmed Esslaoui
// @match        *://*/*
// @icon         https://www.svgrepo.com/download/434124/joker.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/807598
// @downloadURL https://update.greasyfork.org/scripts/497564/Noba%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/497564/Noba%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom styles
    GM_addStyle(`
        #autofill-menu {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #000000;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            width: 300px;
            color: white;
        }
        #autofill-menu h2 {
            margin-top: 0;
            font-size: 18px;
            color: white;
            display: flex;
            align-items: center;
        }
        #autofill-menu h2 img {
            margin-right: 10px;
            width: 24px;
            height: 24px;
        }
        #autofill-menu button {
            background-color: #2F363F;
            color: #A7E92F;
            border: none;
            padding: 10px 20px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
        }
        #autofill-menu button:hover {
            background-color: #505A63;
        }
        #autofill-menu .profile-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
            background-color: #2F363F;
        }
        #autofill-menu .profile-item span {
            font-weight: bold;
            text-transform: capitalize;
            color: white;
            font-family: 'Roboto', sans-serif;
        }
        #autofill-menu .profile-actions {
            display: flex;
            gap: 5px;
        }
        #autofill-menu .delete-profile,
        #autofill-menu .update-profile,
        #autofill-menu .back-button {
            color: white;
            border: none;
            border-radius: 50%;
            padding: 5px;
            cursor: pointer;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #autofill-menu .delete-profile {
            background-color: red;
        }
        #autofill-menu .update-profile {
            background-color: #00A6ED;
        }
        #autofill-menu .back-button {
            background-color: #A7E92F;
            color: #272C33;
            position: absolute;
            top: 10px;
            right: 10px;
        }
        #autofill-menu .delete-profile:hover {
            background-color: darkred;
        }
        #autofill-menu .update-profile:hover {
            background-color: #008bb5;
        }
        #autofill-menu .back-button:hover {
            background-color: #89d32f;
        }
    `);

    // Function to clear existing menu
    function clearMenu() {
        const existingMenu = document.getElementById('autofill-menu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
        }
    }

    // Create and display the options menu
    function showOptionsMenu() {
        clearMenu();
        const menu = document.createElement('div');
        menu.id = 'autofill-menu';
        menu.innerHTML = `
            <h2><img src="https://www.svgrepo.com/show/434124/joker.svg" alt="Noba">Noba Autofill</h2>
            <button id="save-profile">Save New Profile</button>
            <button id="manage-profiles">Manage Profiles</button>
            <button id="close-menu">Close</button>
        `;
        document.body.appendChild(menu);

        document.getElementById('save-profile').addEventListener('click', saveNewProfile);
        document.getElementById('manage-profiles').addEventListener('click', manageProfiles);
        document.getElementById('close-menu').addEventListener('click', clearMenu);
    }

    // Function to save all field values of the current page as a new profile
    function saveNewProfile() {
        const profileName = prompt('Enter a name for this profile:');
        if (!profileName) return;

        const inputs = document.querySelectorAll('input, textarea, select');
        const profileData = {};
        inputs.forEach(input => {
            const key = `${input.name || input.id}`;
            profileData[key] = input.value;
        });

        GM_setValue(profileName, profileData);
        alert(`Profile "${profileName}" has been saved.`);
    }

    // Function to display and manage profiles
    function manageProfiles() {
        clearMenu();
        const menu = document.createElement('div');
        menu.id = 'autofill-menu';
        menu.innerHTML = `
            <h2>Manage Profiles</h2>
            <button class="back-button">↩</button>
            <button id="close-menu">Close</button>
            <div id="profiles-list"></div>
        `;
        document.body.appendChild(menu);
        const profilesList = document.getElementById('profiles-list');

        const profiles = GM_listValues();
        profiles.forEach(profileName => {
            const profileDiv = document.createElement('div');
            profileDiv.className = 'profile-item';
            profileDiv.innerHTML = `
                <span>${profileName}</span>
                <div class="profile-actions">
                    <button class="update-profile" data-profile="${profileName}">🔄</button>
                    <button class="delete-profile" data-profile="${profileName}">🗑️</button>
                </div>
            `;
            profilesList.appendChild(profileDiv);
        });

        document.querySelectorAll('.delete-profile').forEach(button => {
            button.addEventListener('click', deleteProfile);
        });

        document.querySelectorAll('.update-profile').forEach(button => {
            button.addEventListener('click', updateProfile);
        });

        document.querySelector('.back-button').addEventListener('click', showOptionsMenu);
        document.getElementById('close-menu').addEventListener('click', clearMenu);
    }

    // Function to fill saved values from a profile
    function fillSavedValues(profileName) {
        const profile = GM_getValue(profileName);
        Object.entries(profile).forEach(([key, value]) => {
            const field = document.querySelector(`[name="${key}"], [id="${key}"]`);
            if (field) {
                field.value = value;
                if (field.tagName === 'SELECT') {
                    const event = new Event('change', { bubbles: true });
                    field.dispatchEvent(event);
                }
            }
        });
    }

    // Function to delete a profile
    function deleteProfile(event) {
        const profileName = event.target.dataset.profile;
        GM_deleteValue(profileName);
        alert(`Profile "${profileName}" has been deleted.`);
        manageProfiles(); // Refresh the profiles list
    }

    // Function to update a profile
    function updateProfile(event) {
        const profileName = event.target.dataset.profile;
        const profile = GM_getValue(profileName);
        const inputs = document.querySelectorAll('input, textarea, select');
        const updatedProfileData = {};
        inputs.forEach(input => {
            const key = `${input.name || input.id}`;
            updatedProfileData[key] = input.value;
        });

        if (Object.keys(updatedProfileData).every(key => key in profile)) {
            GM_setValue(profileName, updatedProfileData);
            alert(`Profile "${profileName}" has been updated.`);
        } else {
            alert(`The fields on this page do not match the fields in the profile "${profileName}".`);
        }
    }

    // Function to automatically load a matching profile
    function autoLoadProfile() {
        const profiles = GM_listValues();
        profiles.forEach(profileName => {
            const profile = GM_getValue(profileName);
            const allFieldsPresent = Object.keys(profile).every(key => document.querySelector(`[name="${key}"], [id="${key}"]`));
            if (allFieldsPresent) {
                fillSavedValues(profileName);
                console.log(`Profile "${profileName}" has been loaded automatically.`);
            }
        });
    }

    // Add context menu command to open options menu
    GM_registerMenuCommand('Noba Autofill', showOptionsMenu);

    // Automatically load profiles on page load
    window.addEventListener('load', autoLoadProfile);
})();

// ==UserScript==
// @name         Auto-fill JEE Form with Multiple Credentials
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Auto-fills roll number and Base64-encoded password with an overlay for managing multiple credentials
// @match        https://josaa.admissions.nic.in/Applicant/Root/CandidateLogin.aspx*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/538392/Auto-fill%20JEE%20Form%20with%20Multiple%20Credentials.user.js
// @updateURL https://update.greasyfork.org/scripts/538392/Auto-fill%20JEE%20Form%20with%20Multiple%20Credentials.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Encode and decode Base64 string
    function encode(str) {
        return btoa(str);
    }
    
    function decode(str) {
        return atob(str);
    }

    // Get saved credentials
    let credentialsList = GM_getValue('jeeCredentialsList', []);
    if (credentialsList.length === 0) {
        // Add default credentials if none exist
        credentialsList.push({
            name: 'Default',
            rollNumber: '250310617863',
            encodedPassword: 'U2l0amVlQDg4',
            timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19)
        });
        GM_setValue('jeeCredentialsList', credentialsList);
    }

    // Get last used profile index or default to 0
    let lastUsedProfileIndex = GM_getValue('jeeLastUsedProfileIndex', 0);
    
    // Make sure index is valid (in case profiles were deleted)
    if (lastUsedProfileIndex >= credentialsList.length) {
        lastUsedProfileIndex = 0;
        GM_setValue('jeeLastUsedProfileIndex', 0);
    }
    
    // Set active credentials to last used profile
    let activeCredentials = credentialsList[lastUsedProfileIndex];

    window.addEventListener('load', function() {
        applyCredentials(activeCredentials);
        createCredentialsOverlay();
    });

    function applyCredentials(creds) {
        const rollInput = document.getElementById('ctl00_ContentPlaceHolder1_rollno');
        const passInput = document.getElementById('ctl00_ContentPlaceHolder1_Password1');

        if (rollInput) {
            rollInput.value = creds.rollNumber;
        }

        if (passInput) {
            passInput.value = decode(creds.encodedPassword);
        }
    }

    function createCredentialsOverlay() {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.bottom = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.color = 'white';
        overlay.style.padding = '15px';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.maxHeight = '70vh';
        overlay.style.overflowY = 'auto';

        // Create profile management section
        const profileSection = document.createElement('div');
        profileSection.style.width = '100%';
        profileSection.style.marginBottom = '10px';
        profileSection.style.display = 'flex';
        profileSection.style.flexWrap = 'wrap';
        profileSection.style.justifyContent = 'center';
        profileSection.style.alignItems = 'center';

        // Profile selector
        const profileSelect = document.createElement('select');
        profileSelect.style.padding = '5px';
        profileSelect.style.marginRight = '10px';

        // Populate profile selector
        credentialsList.forEach((cred, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = cred.name + ' (' + cred.rollNumber + ')';
            if (index === lastUsedProfileIndex) {
                option.selected = true;
            }
            profileSelect.appendChild(option);
        });

        // Profile selector change handler
        profileSelect.addEventListener('change', function() {
            const selectedIndex = parseInt(this.value);
            activeCredentials = credentialsList[selectedIndex];
            
            // Save the last used profile index
            lastUsedProfileIndex = selectedIndex;
            GM_setValue('jeeLastUsedProfileIndex', lastUsedProfileIndex);
            
            // Update form fields
            nameInput.value = activeCredentials.name;
            rollInput.value = activeCredentials.rollNumber;
            passInput.value = decode(activeCredentials.encodedPassword);
            
            // Update status
            updateStatusMessage('Profile "' + activeCredentials.name + '" selected');
        });

        // Delete profile button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.style.padding = '5px 10px';
        deleteBtn.style.backgroundColor = '#f44336';
        deleteBtn.style.border = 'none';
        deleteBtn.style.color = 'white';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.marginRight = '10px';
        deleteBtn.addEventListener('click', function() {
            const selectedIndex = parseInt(profileSelect.value);
            
            // Can't delete if only one profile exists
            if (credentialsList.length <= 1) {
                updateStatusMessage('Cannot delete the only profile', 'error');
                return;
            }
            
            // Confirm deletion
            if (!confirm('Delete profile "' + credentialsList[selectedIndex].name + '"?')) {
                return;
            }
            
            // Delete profile
            credentialsList.splice(selectedIndex, 1);
            GM_setValue('jeeCredentialsList', credentialsList);
            
            // Adjust last used index if needed
            if (lastUsedProfileIndex >= credentialsList.length) {
                lastUsedProfileIndex = credentialsList.length - 1;
            }
            if (selectedIndex === lastUsedProfileIndex) {
                lastUsedProfileIndex = 0; // Reset to first profile if we're deleting the active one
            }
            GM_setValue('jeeLastUsedProfileIndex', lastUsedProfileIndex);
            
            // Set active credentials to the new last used profile
            activeCredentials = credentialsList[lastUsedProfileIndex];
            
            // Rebuild dropdown
            while (profileSelect.firstChild) {
                profileSelect.removeChild(profileSelect.firstChild);
            }
            
            // Repopulate dropdown
            credentialsList.forEach((cred, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = cred.name + ' (' + cred.rollNumber + ')';
                if (index === lastUsedProfileIndex) {
                    option.selected = true;
                }
                profileSelect.appendChild(option);
            });
            
            // Update form fields
            nameInput.value = activeCredentials.name;
            rollInput.value = activeCredentials.rollNumber;
            passInput.value = decode(activeCredentials.encodedPassword);
            
            updateStatusMessage('Profile deleted successfully');
        });

        // Create form section
        const formSection = document.createElement('div');
        formSection.style.width = '100%';
        formSection.style.display = 'flex';
        formSection.style.flexWrap = 'wrap';
        formSection.style.justifyContent = 'center';
        formSection.style.alignItems = 'center';
        formSection.style.marginBottom = '10px';

        // Profile name input
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Profile Name: ';
        nameLabel.style.marginRight = '5px';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Profile Name';
        nameInput.value = activeCredentials.name;
        nameInput.style.marginRight = '15px';
        nameInput.style.padding = '5px';

        // Create roll number input
        const rollLabel = document.createElement('label');
        rollLabel.textContent = 'Roll Number: ';
        rollLabel.style.marginRight = '5px';

        const rollInput = document.createElement('input');
        rollInput.type = 'text';
        rollInput.placeholder = 'Enter Roll Number';
        rollInput.value = activeCredentials.rollNumber;
        rollInput.style.marginRight = '15px';
        rollInput.style.padding = '5px';

        // Create password input
        const passLabel = document.createElement('label');
        passLabel.textContent = 'Password: ';
        passLabel.style.marginRight = '5px';

        const passInput = document.createElement('input');
        passInput.type = 'password';
        passInput.placeholder = 'Enter Password';
        passInput.value = decode(activeCredentials.encodedPassword);
        passInput.style.marginRight = '15px';
        passInput.style.padding = '5px';

        // Toggle password visibility button
        const togglePassBtn = document.createElement('button');
        togglePassBtn.textContent = '👁️';
        togglePassBtn.style.padding = '5px';
        togglePassBtn.style.marginRight = '15px';
        togglePassBtn.style.cursor = 'pointer';
        togglePassBtn.title = 'Toggle Password Visibility';
        togglePassBtn.addEventListener('click', function() {
            if (passInput.type === 'password') {
                passInput.type = 'text';
            } else {
                passInput.type = 'password';
            }
        });

        // Button section
        const buttonSection = document.createElement('div');
        buttonSection.style.width = '100%';
        buttonSection.style.display = 'flex';
        buttonSection.style.justifyContent = 'center';
        buttonSection.style.marginTop = '10px';

        // Create apply button
        const applyButton = document.createElement('button');
        applyButton.textContent = '✓ Apply';
        applyButton.style.padding = '5px 10px';
        applyButton.style.backgroundColor = '#4CAF50';
        applyButton.style.border = 'none';
        applyButton.style.color = 'white';
        applyButton.style.cursor = 'pointer';
        applyButton.style.marginRight = '10px';

        // Create save as new button
        const saveNewButton = document.createElement('button');
        saveNewButton.textContent = '💾 Save as New';
        saveNewButton.style.padding = '5px 10px';
        saveNewButton.style.backgroundColor = '#2196F3';
        saveNewButton.style.border = 'none';
        saveNewButton.style.color = 'white';
        saveNewButton.style.cursor = 'pointer';
        saveNewButton.style.marginRight = '10px';

        // Create update button
        const updateButton = document.createElement('button');
        updateButton.textContent = '🔄 Update Profile';
        updateButton.style.padding = '5px 10px';
        updateButton.style.backgroundColor = '#FF9800';
        updateButton.style.border = 'none';
        updateButton.style.color = 'white';
        updateButton.style.cursor = 'pointer';
        updateButton.style.marginRight = '10px';

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';

        // Status message
        const statusMsg = document.createElement('div');
        statusMsg.style.width = '100%';
        statusMsg.style.textAlign = 'center';
        statusMsg.style.marginTop = '8px';
        statusMsg.style.fontSize = '0.9em';
        statusMsg.textContent = 'Select a profile or create a new one';

        // Update status message function
        function updateStatusMessage(message, type = 'info') {
            statusMsg.textContent = message;
            
            if (type === 'error') {
                statusMsg.style.color = '#f44336';
            } else if (type === 'success') {
                statusMsg.style.color = '#4CAF50';
            } else {
                statusMsg.style.color = 'white';
            }
            
            // Reset color after 3 seconds
            setTimeout(function() {
                statusMsg.style.color = 'white';
                statusMsg.textContent = 'Select a profile or create a new one';
            }, 3000);
        }

        // Add event listeners
        applyButton.addEventListener('click', function() {
            // Apply the current values and remember as last used
            const selectedIndex = parseInt(profileSelect.value);
            lastUsedProfileIndex = selectedIndex;
            GM_setValue('jeeLastUsedProfileIndex', lastUsedProfileIndex);
            
            const formRollInput = document.getElementById('ctl00_ContentPlaceHolder1_rollno');
            const formPassInput = document.getElementById('ctl00_ContentPlaceHolder1_Password1');
            
            if (formRollInput) {
                formRollInput.value = rollInput.value;
            }
            
            if (formPassInput) {
                formPassInput.value = passInput.value;
            }
            
            updateStatusMessage('Credentials applied successfully', 'success');
        });

        saveNewButton.addEventListener('click', function() {
            // Create a new profile
            const now = new Date();
            const timestamp = now.toISOString().replace('T', ' ').substr(0, 19);
            
            const newProfile = {
                name: nameInput.value || 'Profile ' + (credentialsList.length + 1),
                rollNumber: rollInput.value,
                encodedPassword: encode(passInput.value),
                timestamp: timestamp
            };
            
            // Add to list and save
            credentialsList.push(newProfile);
            GM_setValue('jeeCredentialsList', credentialsList);
            
            // Set as active and remember
            lastUsedProfileIndex = credentialsList.length - 1;
            GM_setValue('jeeLastUsedProfileIndex', lastUsedProfileIndex);
            activeCredentials = newProfile;
            
            // Add to dropdown
            const option = document.createElement('option');
            option.value = lastUsedProfileIndex;
            option.textContent = newProfile.name + ' (' + newProfile.rollNumber + ')';
            option.selected = true;
            profileSelect.appendChild(option);
            
            updateStatusMessage('New profile "' + newProfile.name + '" created', 'success');
        });

        updateButton.addEventListener('click', function() {
            const selectedIndex = parseInt(profileSelect.value);
            const now = new Date();
            const timestamp = now.toISOString().replace('T', ' ').substr(0, 19);
            
            // Update the profile
            credentialsList[selectedIndex] = {
                name: nameInput.value || credentialsList[selectedIndex].name,
                rollNumber: rollInput.value,
                encodedPassword: encode(passInput.value),
                timestamp: timestamp
            };
            
            // Update active credentials and remember
            activeCredentials = credentialsList[selectedIndex];
            lastUsedProfileIndex = selectedIndex;
            GM_setValue('jeeLastUsedProfileIndex', lastUsedProfileIndex);
            
            // Save changes
            GM_setValue('jeeCredentialsList', credentialsList);
            
            // Update dropdown
            profileSelect.options[selectedIndex].textContent = activeCredentials.name + ' (' + activeCredentials.rollNumber + ')';
            
            updateStatusMessage('Profile "' + activeCredentials.name + '" updated', 'success');
        });

        closeButton.addEventListener('click', function() {
            overlay.style.display = 'none';
            
            // Create a small button to show overlay again
            const showButton = document.createElement('button');
            showButton.textContent = 'Show Form';
            showButton.style.position = 'fixed';
            showButton.style.bottom = '10px';
            showButton.style.right = '10px';
            showButton.style.padding = '5px';
            showButton.style.backgroundColor = '#555';
            showButton.style.color = 'white';
            showButton.style.border = 'none';
            showButton.style.borderRadius = '5px';
            showButton.style.cursor = 'pointer';
            showButton.style.zIndex = '9998';
            
            showButton.addEventListener('click', function() {
                overlay.style.display = 'flex';
                showButton.remove();
            });
            
            document.body.appendChild(showButton);
        });

        // Append elements to profile section
        profileSection.appendChild(document.createTextNode('Select Profile: '));
        profileSection.appendChild(profileSelect);
        profileSection.appendChild(deleteBtn);

        // Append elements to form section
        formSection.appendChild(nameLabel);
        formSection.appendChild(nameInput);
        formSection.appendChild(document.createElement('br'));
        formSection.appendChild(document.createElement('br'));
        formSection.appendChild(rollLabel);
        formSection.appendChild(rollInput);
        formSection.appendChild(passLabel);
        formSection.appendChild(passInput);
        formSection.appendChild(togglePassBtn);

        // Append elements to button section
        buttonSection.appendChild(applyButton);
        buttonSection.appendChild(saveNewButton);
        buttonSection.appendChild(updateButton);
        buttonSection.appendChild(closeButton);

        // Append sections to overlay
        overlay.appendChild(profileSection);
        overlay.appendChild(document.createElement('hr'));
        overlay.appendChild(formSection);
        overlay.appendChild(buttonSection);
        overlay.appendChild(statusMsg);

        // Append overlay to body
        document.body.appendChild(overlay);
    }
})();
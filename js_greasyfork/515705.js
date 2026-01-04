// ==UserScript==
// @name         KIIT Portal Auto Login with Name and Roll Number Storage
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  It is just for educational purpose if you misuse it author is not going to be responsible for anything.
// @             Store names and roll numbers in a table format, autofill on click, edit, delete, reset attempts on roll change, and auto-click lock icon within attempt limits
// @ process :- to lock the profile you should have 2 click in lock icon for confirmation and it start automatically to lock the profile and last one click more for confirmation to lock the profile.
// @author       Bibek
// @match        https://kiitportal.kiituniversity.net/irj/portal/
// @grant        none
// @icon         https://toppng.com/uploads/preview/sap-logo-vector-11573942505cqxaqpwu0h.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515705/KIIT%20Portal%20Auto%20Login%20with%20Name%20and%20Roll%20Number%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/515705/KIIT%20Portal%20Auto%20Login%20with%20Name%20and%20Roll%20Number%20Storage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random password
    function generateRandomPassword(length) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    let attempts = parseInt(localStorage.getItem('attempts')) || 0;
    const lastUsedRoll = localStorage.getItem('lastUsedRoll') || "";

    // Display the attempts on the console
    console.log(`Attempts: ${attempts}`);

    window.addEventListener('load', () => {
        const rollNumberField = document.getElementById('logonuidfield');

        if (rollNumberField) {
            // Listen for manual changes in roll number field
            rollNumberField.addEventListener('input', () => {
                const currentRoll = rollNumberField.value.trim();
                const storedRoll = localStorage.getItem('lastUsedRoll') || "";

                // If roll number has changed, reset attempts and update stored roll number
                if (currentRoll && currentRoll !== storedRoll) {
                    attempts = 0;
                    localStorage.setItem('attempts', attempts);
                    localStorage.setItem('lastUsedRoll', currentRoll);
                    attemptCounter.textContent = `Attempts: ${attempts}`;
                    console.log(`Roll number changed to ${currentRoll}. Attempts reset to 0.`);
                }
            });
        }

        const lockIconButton = document.createElement('img');
        lockIconButton.src = 'https://cdn-icons-png.flaticon.com/512/10464/10464776.png';
        lockIconButton.style.position = 'fixed';
        lockIconButton.style.top = '10px';
        lockIconButton.style.right = '70px';
        lockIconButton.style.width = '50px';
        lockIconButton.style.height = '50px';
        lockIconButton.style.cursor = 'pointer';
        lockIconButton.style.zIndex = '1000';

        const dataIconButton = document.createElement('img');
        dataIconButton.src = 'https://cdn-icons-png.flaticon.com/512/5135/5135010.png';
        dataIconButton.style.position = 'fixed';
        dataIconButton.style.top = '10px';
        dataIconButton.style.right = '10px';
        dataIconButton.style.width = '50px';
        dataIconButton.style.height = '50px';
        dataIconButton.style.cursor = 'pointer';
        dataIconButton.style.zIndex = '1000';

        const attemptCounter = document.createElement('span');
        attemptCounter.style.position = 'fixed';
        attemptCounter.style.top = '20px';
        attemptCounter.style.right = '130px';
        attemptCounter.style.fontSize = '20px';
        attemptCounter.style.color = 'black';
        attemptCounter.style.zIndex = '1000';
        attemptCounter.textContent = `Attempts: ${attempts}`;

        document.body.appendChild(lockIconButton);
        document.body.appendChild(dataIconButton);
        document.body.appendChild(attemptCounter);

        const handleLogin = () => {
            const passwordField = document.getElementById('logonpassfield');
            const logonButton = document.querySelector('.urBtnStdNew');

            if (passwordField && logonButton) {
                const randomPassword = generateRandomPassword(10);
                passwordField.value = randomPassword;

                const intervalId = setInterval(() => {
                    logonButton.click();
                    attempts++;
                    attemptCounter.textContent = `Attempts: ${attempts}`;
                    console.log(`Attempt ${attempts}`);
                    localStorage.setItem('attempts', attempts);

                    if (attempts >= 11) {
                        clearInterval(intervalId);
                    }
                }, 500);
            } else {
                console.error("Password field or logon button not found.");
            }
        };

        const checkAndAutoClick = () => {
            if (attempts > 1 && attempts < 10) {
                handleLogin();
            }
        };

        lockIconButton.addEventListener('click', () => {
            if (attempts < 11) {
                handleLogin();
            } else {
                console.warn("Maximum attempts reached.");
            }
        });

        let storageTable;
        let nameInput;
        let rollInput;
        let currentEditIndex = null;

        const showDataEntryModal = () => {
            const modalOverlay = document.createElement('div');
            modalOverlay.style.position = 'fixed';
            modalOverlay.style.top = '0';
            modalOverlay.style.left = '0';
            modalOverlay.style.width = '100%';
            modalOverlay.style.height = '100%';
            modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modalOverlay.style.zIndex = '2000';

            const modalContent = document.createElement('div');
            modalContent.style.position = 'absolute';
            modalContent.style.top = '50%';
            modalContent.style.left = '50%';
            modalContent.style.transform = 'translate(-50%, -50%)';
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '20px';
            modalContent.style.borderRadius = '10px';
            modalContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

            nameInput = document.createElement('input');
            nameInput.placeholder = 'Enter Name';

            rollInput = document.createElement('input');
            rollInput.placeholder = 'Enter Roll Number';
            rollInput.style.marginTop = '10px';
            rollInput.style.marginBottom = '10px';

            const addButton = document.createElement('button');
            addButton.textContent = 'Add Entry';
            addButton.style.marginRight = '10px';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';

            addButton.addEventListener('click', () => {
                const name = nameInput.value.trim();
                const roll = rollInput.value.trim();

                if (name && roll) {
                    if (currentEditIndex !== null) {
                        localStorage.setItem(`name_${currentEditIndex}`, name);
                        localStorage.setItem(`roll_${currentEditIndex}`, roll);
                        currentEditIndex = null;
                    } else {
                        addEntry(name, roll);
                    }
                    modalOverlay.remove();
                } else {
                    alert('Please fill both fields.');
                }
            });

            cancelButton.addEventListener('click', () => {
                modalOverlay.remove();
            });

            storageTable = document.createElement('table');
            storageTable.style.borderCollapse = 'collapse';
            storageTable.style.width = '100%';
            storageTable.style.marginTop = '20px';
            storageTable.style.zIndex = '1000';
            storageTable.style.backgroundColor = 'white';
            storageTable.style.border = '1px solid black';

            const headerRow = document.createElement('tr');
            const nameHeader = document.createElement('th');
            nameHeader.textContent = 'Name';
            nameHeader.style.border = '1px solid black';
            const rollHeader = document.createElement('th');
            rollHeader.textContent = 'Roll Number';
            rollHeader.style.border = '1px solid black';
            const actionHeader = document.createElement('th');
            actionHeader.textContent = 'Actions';
            actionHeader.style.border = '1px solid black';
            headerRow.appendChild(nameHeader);
            headerRow.appendChild(rollHeader);
            headerRow.appendChild(actionHeader);
            storageTable.appendChild(headerRow);

            loadStoredData();

            modalContent.appendChild(nameInput);
            modalContent.appendChild(rollInput);
            modalContent.appendChild(addButton);
            modalContent.appendChild(cancelButton);
            modalContent.appendChild(storageTable);
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
        };

        const addEntry = (name, roll) => {
            for (let i = 0; i < 10; i++) {
                if (!localStorage.getItem(`name_${i}`) && !localStorage.getItem(`roll_${i}`)) {
                    localStorage.setItem(`name_${i}`, name);
                    localStorage.setItem(`roll_${i}`, roll);
                    updateStorageTable();
                    break;
                }
            }
        };

        const updateStorageTable = () => {
            if (storageTable) {  // Ensure storageTable is defined
                while (storageTable.rows.length > 1) {
                    storageTable.deleteRow(1);
                }
                loadStoredData();
            }
        };

        const loadStoredData = () => {
            for (let i = 0; i < 10; i++) {
                const name = localStorage.getItem(`name_${i}`) || '';
                const roll = localStorage.getItem(`roll_${i}`) || '';
                if (name || roll) {
                    const row = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = name;
                    nameCell.style.border = '1px solid black';
                    row.appendChild(nameCell);

                    const rollCell = document.createElement('td');
                    rollCell.textContent = roll;
                    rollCell.style.border = '1px solid black';
                    row.appendChild(rollCell);

                    const editIcon = document.createElement('img');
                    editIcon.src = 'https://cdn-icons-png.flaticon.com/512/10337/10337572.png';
                    editIcon.style.width = '20px';
                    editIcon.style.cursor = 'pointer';
                    editIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        nameInput.value = name;
                        rollInput.value = roll;
                        currentEditIndex = i;
                    });

                    const actionCell = document.createElement('td');
                    actionCell.appendChild(editIcon);

                    const deleteIcon = document.createElement('img');
                    deleteIcon.src = 'https://cdn-icons-png.flaticon.com/512/9790/9790368.png';
                    deleteIcon.style.width = '20px';
                    deleteIcon.style.cursor = 'pointer';
                    deleteIcon.addEventListener('click', (event) => {
                        event.stopPropagation();
                        localStorage.removeItem(`name_${i}`);
                        localStorage.removeItem(`roll_${i}`);
                        updateStorageTable();
                    });

                    actionCell.appendChild(deleteIcon);
                    row.appendChild(actionCell);

                    row.addEventListener('click', () => {
                        const rollNumberField = document.getElementById('logonuidfield');
                        const currentRoll = rollNumberField.value;
                        rollNumberField.value = roll;
                        console.log(`Selected Roll Number: ${roll}`);

                        // Check if roll number has changed and reset attempts if so
                        if (currentRoll !== roll) {
                            attempts = 0;
                            localStorage.setItem('attempts', attempts);
                            attemptCounter.textContent = `Attempts: ${attempts}`;
                            localStorage.setItem('lastUsedRoll', roll);
                        }

                        // Re-check for auto-click if within range
                        checkAndAutoClick();
                    });

                    storageTable.appendChild(row);
                }
            }
        };

        dataIconButton.addEventListener('click', showDataEntryModal);

        // Update table on load
        updateStorageTable();

        // Check if previous roll is the same as the current one, and auto-click if conditions match
        checkAndAutoClick();
    });
})();

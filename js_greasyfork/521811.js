// ==UserScript==
// @name         Blacklist & Warning for AutoDarts 
// @namespace    Owl
// @version      0.1
// @description  Search for player names and display a warning message if found.
// @match        https://play.autodarts.io/*
// @run-at       document-idle
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521811/Blacklist%20%20Warning%20for%20AutoDarts.user.js
// @updateURL https://update.greasyfork.org/scripts/521811/Blacklist%20%20Warning%20for%20AutoDarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Blacklist Script] Starting (EN) - File Import/Export...");

    let blacklistedPlayers = JSON.parse(localStorage.getItem('blacklistedPlayers')) || [];

    function savePlayerList() {
        localStorage.setItem('blacklistedPlayers', JSON.stringify(blacklistedPlayers));
    }

    // Popup variables
    let popupVisible = false;
    let popupContainer = null;

    // Menu item ID
    const MENU_ITEM_ID = 'autodarts-blacklist-menu-item';

    // --------------------------------------------------
    // A) DRAG LOGIC
    // --------------------------------------------------
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    let hasConvertedCenter = false;

    function onDragMouseDown(e) {
        e.preventDefault();
        if (!hasConvertedCenter) {
            convertCenterToAbsolutePosition(popupContainer);
            hasConvertedCenter = true;
        }
        isDragging = true;
        offsetX = popupContainer.offsetLeft - e.clientX;
        offsetY = popupContainer.offsetTop - e.clientY;
    }

    function onDragMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const newLeft = e.clientX + offsetX;
        const newTop = e.clientY + offsetY;
        popupContainer.style.left = newLeft + 'px';
        popupContainer.style.top = newTop + 'px';
    }

    function onDragMouseUp() {
        isDragging = false;
    }

    function convertCenterToAbsolutePosition(elem) {
        const rect = elem.getBoundingClientRect();
        elem.style.left = rect.left + 'px';
        elem.style.top = rect.top + 'px';
        elem.style.transform = 'none';
    }

    // --------------------------------------------------
    // B) CREATE POPUP
    // --------------------------------------------------
    function createPopup() {
        if (popupContainer) return;

        popupContainer = document.createElement('div');
        popupContainer.id = 'autodarts-blacklist-popup';

        Object.assign(popupContainer.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',

            padding: '20px',
            backgroundColor: '#1A202C', // dark gray
            color: '#E2E8F0',
            border: '1px solid #2D3748',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            zIndex: '99999',
            fontFamily: 'sans-serif',

            width: 'auto',
            minWidth: '300px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            display: 'none'
        });

        // Drag bar
        const dragBar = document.createElement('div');
        dragBar.style.height = '20px';
        dragBar.style.cursor = 'move';
        dragBar.style.marginBottom = '10px';
        popupContainer.appendChild(dragBar);

        // Close "X" button
        const closeXButton = document.createElement('button');
        closeXButton.textContent = '×';
        Object.assign(closeXButton.style, {
            position: 'absolute',
            top: '4px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: '#E2E8F0',
            fontSize: '20px',
            lineHeight: '20px',
            cursor: 'pointer'
        });
        closeXButton.addEventListener('click', () => {
            togglePopup(false);
        });
        popupContainer.appendChild(closeXButton);

        // Title
        const title = document.createElement('h2');
        title.textContent = 'BLACKLIST';
        title.style.marginTop = '0';
        title.style.fontSize = '1.4rem';
        title.style.fontWeight = 'bold';
        popupContainer.appendChild(title);

        // Input area
        const inputWrapper = document.createElement('div');
        inputWrapper.style.display = 'flex';
        inputWrapper.style.marginBottom = '10px';
        popupContainer.appendChild(inputWrapper);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter new player name';
        Object.assign(input.style, {
            flex: '1',
            marginRight: '5px',
            padding: '4px 8px'
        });
        inputWrapper.appendChild(input);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        Object.assign(addButton.style, {
            padding: '4px 8px',
            cursor: 'pointer',
            backgroundColor: 'rgba(59, 182, 43, 1)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });
        inputWrapper.appendChild(addButton);

        // UL list
        const listElement = document.createElement('ul');
        listElement.style.listStyle = 'none';
        listElement.style.paddingLeft = '0';
        popupContainer.appendChild(listElement);

        // Add function
        function addName() {
            const name = input.value.trim();
            const uppercaseName = name.toUpperCase();
            if (uppercaseName && !blacklistedPlayers.includes(uppercaseName)) {
                blacklistedPlayers.push(uppercaseName);
                savePlayerList();
                updateList(listElement);
            }
            input.value = '';
        }
        addButton.addEventListener('click', addName);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addName();
            }
        });

        // Show the list initially
        updateList(listElement);

        // IMPORT/EXPORT section
        const importExportWrapper = document.createElement('div');
        importExportWrapper.style.borderTop = '1px solid #2D3748';
        importExportWrapper.style.paddingTop = '10px';
        importExportWrapper.style.marginTop = '10px';
        popupContainer.appendChild(importExportWrapper);

        // Export button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export';
        Object.assign(exportButton.style, {
            padding: '4px 8px',
            cursor: 'pointer',
            marginRight: '10px',
            backgroundColor: '#2D3748',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });
        exportButton.addEventListener('click', () => {
            const data = JSON.stringify(blacklistedPlayers, null, 2);

            // 1) Copy to clipboard
            navigator.clipboard.writeText(data)
              .then(() => {
                alert('Blacklist has been copied to your clipboard.');
                // 2) Ask if user wants to save as file
                const saveFile = confirm('Do you want to save it as a JSON file?');
                if (saveFile) {
                    // Create a Blob, then force a download
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'blacklist.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }
              })
              .catch(err => {
                alert('Failed to copy blacklist: ' + err);
              });
        });
        importExportWrapper.appendChild(exportButton);

        // Import button
        const importButton = document.createElement('button');
        importButton.textContent = 'Import';
        Object.assign(importButton.style, {
            padding: '4px 8px',
            cursor: 'pointer',
            backgroundColor: '#2D3748',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
        });
        importButton.addEventListener('click', () => {
            const choice = confirm('Would you like to import from file instead of JSON text?\nClick "OK" for file, "Cancel" for text prompt.');
            if (choice) {
                // Import from file
                importFromFile(listElement);
            } else {
                // Use prompt
                importFromPrompt(listElement);
            }
        });
        importExportWrapper.appendChild(importButton);

        document.body.appendChild(popupContainer);

        // Register drag events
        dragBar.addEventListener('mousedown', onDragMouseDown);
        document.addEventListener('mousemove', onDragMouseMove);
        document.addEventListener('mouseup', onDragMouseUp);
    }

    // ---- IMPORT FROM FILE ----
    function importFromFile(listElement) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json,.json';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', function() {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const content = e.target.result;
                        const importedList = JSON.parse(content);
                        if (Array.isArray(importedList)) {
                            // Convert all to uppercase
                            importedList.forEach((val, idx) => {
                                importedList[idx] = val.toUpperCase();
                            });
                            blacklistedPlayers = importedList;
                            savePlayerList();
                            updateList(listElement);
                            checkPlayers();
                            alert('Blacklist imported successfully from file!');
                        } else {
                            alert('Invalid JSON data in file: Must be an array, e.g. ["Alice","Bob"].');
                        }
                    } catch (err) {
                        alert('Invalid JSON file: ' + err);
                    }
                };
                reader.readAsText(file);
            }
        });

        // "Click" the input programmatically
        document.body.appendChild(fileInput);
        fileInput.click();
        // Remove it afterwards to keep the DOM clean
        fileInput.parentNode.removeChild(fileInput);
    }

    // ---- IMPORT FROM PROMPT ----
    function importFromPrompt(listElement) {
        const inputData = prompt('Paste the JSON data for the blacklist:');
        if (inputData) {
            try {
                const importedList = JSON.parse(inputData);
                if (Array.isArray(importedList)) {
                    // Optional: convert all to uppercase
                    importedList.forEach((val, idx) => {
                        importedList[idx] = val.toUpperCase();
                    });
                    blacklistedPlayers = importedList;
                    savePlayerList();
                    updateList(listElement);
                    checkPlayers();
                    alert('Blacklist imported successfully!');
                } else {
                    alert('Invalid JSON data: Must be an array, e.g. ["Alice","Bob"].');
                }
            } catch (e) {
                alert('Invalid JSON: ' + e);
            }
        }
    }

    function updateList(listElement) {
        listElement.innerHTML = '';
        blacklistedPlayers.forEach(name => {
            const li = document.createElement('li');
            li.textContent = name;
            Object.assign(li.style, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 0'
            });

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            Object.assign(removeBtn.style, {
                marginLeft: '10px',
                backgroundColor: '#C53030',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 8px',
                cursor: 'pointer'
            });

            removeBtn.addEventListener('click', () => {
                blacklistedPlayers = blacklistedPlayers.filter(player => player !== name);
                savePlayerList();
                updateList(listElement);
                checkPlayers();
            });

            li.appendChild(removeBtn);
            listElement.appendChild(li);
        });
    }

    function togglePopup(forceOpen) {
        if (!popupContainer) {
            createPopup();
        }
        popupVisible = (typeof forceOpen === 'boolean') ? forceOpen : !popupVisible;
        popupContainer.style.display = popupVisible ? 'block' : 'none';
    }

    // --------------------------------------------------
    // WARNING AT THE TOP
    // --------------------------------------------------
    let warningDiv = null;

    function showWarning(text) {
        if (!warningDiv) {
            warningDiv = document.createElement('div');
            Object.assign(warningDiv.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                backgroundColor: 'red',
                color: 'white',
                padding: '10px',
                textAlign: 'center',
                zIndex: '100000',
                fontSize: '16px'
            });
            document.body.appendChild(warningDiv);
        }
        warningDiv.textContent = `Attention: ${text}`;
    }

    function removeWarning() {
        if (warningDiv) {
            warningDiv.remove();
            warningDiv = null;
        }
    }

    function checkPlayers() {
        const playerTags = document.querySelectorAll('p.chakra-text.css-0');
        let foundNames = [];

        playerTags.forEach(tag => {
            const name = tag.textContent.trim().toUpperCase();
            if (blacklistedPlayers.includes(name)) {
                if (tag.style.backgroundColor !== 'red' || tag.style.color !== 'white') {
                    tag.style.backgroundColor = 'red';
                    tag.style.color = 'white';
                }
                foundNames.push(name);
            } else {
                if (tag.style.backgroundColor === 'red' || tag.style.color === 'white') {
                    tag.style.backgroundColor = '';
                    tag.style.color = '';
                }
            }
        });

        if (foundNames.length > 0) {
            showWarning(`Players found: ${foundNames.join(', ')}`);
        } else {
            removeWarning();
        }
    }

    // --------------------------------------------------
    // MENU ITEM
    // --------------------------------------------------
    function addBlacklistMenuItem(menuContainer) {
        console.log("[Blacklist Script] Adding the blacklist menu item...");

        let blacklistLink = document.getElementById(MENU_ITEM_ID);
        if (!blacklistLink) {
            blacklistLink = document.createElement('a');
            blacklistLink.id = MENU_ITEM_ID;
            blacklistLink.textContent = 'Blacklist';
            blacklistLink.className = 'chakra-button css-1nal3hj';
            blacklistLink.style.cursor = 'pointer';

            const icon = document.createElement('span');
            icon.className = 'chakra-button__icon css-1wh2kri';
            icon.style.marginRight = '0.5rem';
            icon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                     viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.49 2 2 6.49 2 12s4.49
                    10 10 10 10-4.49 10-10S17.51
                    2 12 2zm3 14H9v-2h6v2zm2-4H7V8h10v4z"/>
                </svg>`;
            blacklistLink.prepend(icon);

            menuContainer.appendChild(blacklistLink);
            blacklistLink.addEventListener('click', () => {
                togglePopup();
            });
        }
    }

    // --------------------------------------------------
    // MUTATIONOBSERVER MIT DEBOUNCE
    // --------------------------------------------------
    let checkTimeout = null;
    function triggerCheckWithDebounce() {
        if (checkTimeout) {
            clearTimeout(checkTimeout);
        }
        checkTimeout = setTimeout(() => {
            checkPlayers();
            checkTimeout = null;
        }, 300);
    }

    const observer = new MutationObserver(() => {
        triggerCheckWithDebounce();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // --------------------------------------------------
    // MENU FIND + ADD
    // --------------------------------------------------
    const intervalId = setInterval(() => {
        const menuContainer = [...document.querySelectorAll('div.chakra-stack')]
          .find(div => div.querySelector('a[href="/"]') && div.querySelector('a[href="/lobbies"]'));

        if (menuContainer) {
            console.log("[Blacklist Script] Menu found:", menuContainer);
            addBlacklistMenuItem(menuContainer);
            clearInterval(intervalId);
        } else {
            console.log("[Blacklist Script] Menu not found yet. Trying again...");
        }
    }, 1000);

    // Start
    checkPlayers();

})();

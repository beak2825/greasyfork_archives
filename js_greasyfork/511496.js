// ==UserScript==
// @name         Persistent Find and Replace
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Manage multiple groups of find-and-replace pairs.
// @match        https://archiveofourown.org/*
// @author       Matskye
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511496/Persistent%20Find%20and%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/511496/Persistent%20Find%20and%20Replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load data from storage
    let groups = JSON.parse(GM_getValue('groups', '[]'));
    let activeGroupName = GM_getValue('activeGroupName', '');
    let autoReplace = GM_getValue('autoReplace', false);
    let currentTheme = GM_getValue('currentTheme', 'light');

    // Save functions
    function saveGroups() { GM_setValue('groups', JSON.stringify(groups)); }
    function saveActiveGroupName() { GM_setValue('activeGroupName', activeGroupName); }
    function saveAutoReplace() { GM_setValue('autoReplace', autoReplace); }
    function saveTheme() { GM_setValue('currentTheme', currentTheme); }

// Escape special characters in the search string
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Perform replacements
function replaceTextInNode(node, pairs) {
    if (node.nodeType === 3) { // Text node
        let text = node.nodeValue;
        for (let i = 0; i < pairs.length; i++) {
            let findText = escapeRegExp(pairs[i].find); // Escape special characters
            // Create regex that matches the exact phrase with optional spaces or punctuation around it
            let regex = new RegExp(`(?<!\\w)${findText}(?!\\w)`, 'gi'); // Case-insensitive, no word before or after
            text = text.replace(regex, pairs[i].replace);
        }
        node.nodeValue = text;
    } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
        for (let i = 0; i < node.childNodes.length; i++) {
            replaceTextInNode(node.childNodes[i], pairs);
        }
    }
}

    function createUI() {
        if (document.getElementById('findReplaceOverlay')) return;

        // Create host element
        let overlayHost = document.createElement('div');
        overlayHost.id = 'findReplaceOverlay';
        document.body.appendChild(overlayHost);

        // Attach shadow root
        let shadowRoot = overlayHost.attachShadow({ mode: 'closed' });

        // Create overlay elements
        let overlay = document.createElement('div');
        overlay.id = 'overlay';

        let dialog = document.createElement('div');
        dialog.id = 'dialog';
        dialog.className = currentTheme + '-theme';

        // Close button
        let closeBtn = document.createElement('span');
        closeBtn.id = 'closeBtn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => overlayHost.remove();
        dialog.appendChild(closeBtn);

        // Theme toggle button
        // let themeToggleBtn = document.createElement('span');
        // themeToggleBtn.id = 'themeToggleBtn';
        // themeToggleBtn.title = 'Toggle Theme';
        // themeToggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
        // themeToggleBtn.onclick = () => {
        //     currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        //     saveTheme();
        //     dialog.className = currentTheme + '-theme';
        //     themeToggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
        // };
        // dialog.appendChild(themeToggleBtn);

        // Title
        let title = document.createElement('h2');
        title.textContent = 'Find and Replace Manager';
        dialog.appendChild(title);

        // Group Selection
        let groupSelectContainer = document.createElement('div');
        groupSelectContainer.className = 'groupSelectContainer';

        let groupLabel = document.createElement('label');
        groupLabel.textContent = 'Select Group: ';
        groupSelectContainer.appendChild(groupLabel);

        let groupSelect = document.createElement('select');
        groupSelect.id = 'groupSelect';

        // Function to refresh group options
        function refreshGroupOptions() {
            groupSelect.innerHTML = '';
            for (let i = 0; i < groups.length; i++) {
                let option = document.createElement('option');
                option.value = groups[i].name;
                option.textContent = groups[i].name;
                groupSelect.appendChild(option);
            }
            groupSelect.value = activeGroupName;
        }

        groupSelect.onchange = function() {
            activeGroupName = groupSelect.value;
            saveActiveGroupName();
            refreshPairs();
        };

        groupSelectContainer.appendChild(groupSelect);

        // Add New Group Button
        let addGroupButton = document.createElement('button');
        addGroupButton.textContent = '+ Add Group';
        addGroupButton.className = 'btn btn-secondary';
        addGroupButton.onclick = function() {
            let groupName = prompt('Enter new group name:');
            if (groupName) {
                // Check if group name already exists
                if (groups.find(g => g.name === groupName)) {
                    alert('A group with this name already exists.');
                    return;
                }
                groups.push({ name: groupName, pairs: [] });
                saveGroups();
                refreshGroupOptions();
                activeGroupName = groupName;
                saveActiveGroupName();
                refreshPairs();
            }
        };
        groupSelectContainer.appendChild(addGroupButton);

        // Delete Group Button
        let deleteGroupButton = document.createElement('button');
        deleteGroupButton.textContent = 'Delete Group';
        deleteGroupButton.className = 'btn btn-danger';
        deleteGroupButton.onclick = function() {
            if (confirm('Are you sure you want to delete this group?')) {
                groups = groups.filter(g => g.name !== activeGroupName);
                saveGroups();
                if (groups.length > 0) {
                    activeGroupName = groups[0].name;
                } else {
                    activeGroupName = '';
                }
                saveActiveGroupName();
                refreshGroupOptions();
                refreshPairs();
            }
        };
        groupSelectContainer.appendChild(deleteGroupButton);

        dialog.appendChild(groupSelectContainer);

        // Import/Export Buttons
        let importExportContainer = document.createElement('div');
        importExportContainer.className = 'importExportContainer';

        let exportButton = document.createElement('button');
        exportButton.textContent = 'Export Group';
        exportButton.className = 'btn btn-secondary';
        exportButton.onclick = function() {
            let activeGroup = groups.find(g => g.name === activeGroupName);
            if (activeGroup) {
                let dataStr = JSON.stringify(activeGroup);
                GM_setClipboard(dataStr);
                alert('Group data copied to clipboard. You can share it with others.');
            } else {
                alert('No active group selected.');
            }
        };
        importExportContainer.appendChild(exportButton);

        let importButton = document.createElement('button');
        importButton.textContent = 'Import Group';
        importButton.className = 'btn btn-secondary';
        importButton.onclick = function() {
            let dataStr = prompt('Paste the group data here:');
            if (dataStr) {
                try {
                    let importedGroup = JSON.parse(dataStr);
                    if (!importedGroup.name || !Array.isArray(importedGroup.pairs)) {
                        alert('Invalid group data.');
                        return;
                    }
                    // Check if group name already exists
                    if (groups.find(g => g.name === importedGroup.name)) {
                        alert('A group with this name already exists.');
                        return;
                    }
                    groups.push(importedGroup);
                    saveGroups();
                    refreshGroupOptions();
                    activeGroupName = importedGroup.name;
                    saveActiveGroupName();
                    refreshPairs();
                    alert('Group imported successfully.');
                } catch (e) {
                    alert('Failed to parse group data.');
                }
            }
        };
        importExportContainer.appendChild(importButton);

        dialog.appendChild(importExportContainer);

        // Create container for the pairs
        let pairsContainer = document.createElement('div');
        pairsContainer.id = 'pairsContainer';

        // Function to refresh the pairs list
        function refreshPairs() {
            // Clear container
            pairsContainer.innerHTML = '';

            let activeGroup = groups.find(g => g.name === activeGroupName);

            if (!activeGroup) {
                // No groups available
                let noGroupMsg = document.createElement('p');
                noGroupMsg.textContent = 'No group selected or groups available. Please add a new group.';
                pairsContainer.appendChild(noGroupMsg);
                return;
            }

            let pairs = activeGroup.pairs;

            for (let i = 0; i < pairs.length; i++) {
                (function(index) {
                    let pairDiv = document.createElement('div');
                    pairDiv.className = 'pairDiv';

                    let findInput = document.createElement('input');
                    findInput.type = 'text';
                    findInput.value = pairs[index].find;
                    findInput.placeholder = 'Find';

                    let replaceInput = document.createElement('input');
                    replaceInput.type = 'text';
                    replaceInput.value = pairs[index].replace;
                    replaceInput.placeholder = 'Replace';

                    findInput.onchange = function() {
                        pairs[index].find = findInput.value;
                        saveGroups();
                    };

                    replaceInput.onchange = function() {
                        pairs[index].replace = replaceInput.value;
                        saveGroups();
                    };

                    let removeButton = document.createElement('button');
                    removeButton.innerHTML = '&times;';
                    removeButton.className = 'btn btn-remove';
                    removeButton.title = 'Remove Pair';
                    removeButton.onclick = function() {
                        pairs.splice(index, 1);
                        saveGroups();
                        refreshPairs();
                    };

                    pairDiv.appendChild(findInput);
                    pairDiv.appendChild(replaceInput);
                    pairDiv.appendChild(removeButton);

                    pairsContainer.appendChild(pairDiv);
                })(i);
            }
        }

        refreshGroupOptions();
        refreshPairs();

        dialog.appendChild(pairsContainer);

        // Add pair button
        let addPairButton = document.createElement('button');
        addPairButton.textContent = '+ Add Pair';
        addPairButton.className = 'btn btn-primary';
        addPairButton.onclick = function() {
            let activeGroup = groups.find(g => g.name === activeGroupName);
            if (activeGroup) {
                activeGroup.pairs.push({ find: '', replace: '' });
                saveGroups();
                refreshPairs();
            } else {
                alert('No active group selected.');
            }
        };
        dialog.appendChild(addPairButton);

        // Apply replacements button
        let replaceButton = document.createElement('button');
        replaceButton.textContent = 'Apply Replacements';
        replaceButton.className = 'btn btn-success';
        replaceButton.onclick = function() {
            let activeGroup = groups.find(g => g.name === activeGroupName);
            if (activeGroup) {
                replaceTextInNode(document.body, activeGroup.pairs);
                alert('Replacements applied to the page.');
            } else {
                alert('No active group selected.');
            }
        };
        dialog.appendChild(replaceButton);

        // Auto-Replace checkbox
        let autoReplaceContainer = document.createElement('div');
        autoReplaceContainer.className = 'autoReplaceContainer';

        let autoReplaceCheckbox = document.createElement('input');
        autoReplaceCheckbox.type = 'checkbox';
        autoReplaceCheckbox.checked = autoReplace;
        autoReplaceCheckbox.id = 'autoReplaceCheckbox';
        autoReplaceCheckbox.onchange = function() {
            autoReplace = autoReplaceCheckbox.checked;
            saveAutoReplace();
        };

        let autoReplaceLabel = document.createElement('label');
        autoReplaceLabel.htmlFor = 'autoReplaceCheckbox';
        autoReplaceLabel.textContent = ' Automatically apply replacements on page load';

        autoReplaceContainer.appendChild(autoReplaceCheckbox);
        autoReplaceContainer.appendChild(autoReplaceLabel);
        dialog.appendChild(autoReplaceContainer);

        // Append dialog to overlay
        overlay.appendChild(dialog);

        // Append overlay to shadow root
        shadowRoot.appendChild(overlay);

        // Add styles
        let style = document.createElement('style');
        style.textContent = `
            #overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #dialog {
                background-color: #fff;
                color: #000;
                padding: 20px 30px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                max-height: 80vh;
                overflow-y: auto;
                width: 500px;
                position: relative;
                font-family: Arial, sans-serif;
            }
            #closeBtn {
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
            }
            #closeBtn:hover {
                color: #000;
            }
        `;
        shadowRoot.appendChild(style);
    }

    // Add the button to open the UI
    function addButton() {
        let btnHost = document.createElement('div');
        document.body.appendChild(btnHost);

        let btnShadow = btnHost.attachShadow({ mode: 'closed' });

        let btn = document.createElement('button');
        btn.id = 'findReplaceButton';
        btn.textContent = 'Find & Replace';
        btn.onclick = createUI;

        // Button styles
        let btnStyle = document.createElement('style');
        btnStyle.textContent = `
            #findReplaceButton {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                padding: 12px 20px;
                background-color: #007BFF;
                color: #fff;
                border: none;
                border-radius: 50px;
                cursor: pointer;
                font-size: 16px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                font-family: Arial, sans-serif;
            }
            #findReplaceButton:hover {
                background-color: #0069d9;
            }
        `;
        btnShadow.appendChild(btnStyle);
        btnShadow.appendChild(btn);
    }

    // Perform replacements on page load
    if (autoReplace) {
        let activeGroup = groups.find(g => g.name === activeGroupName);
        if (activeGroup) {
            replaceTextInNode(document.body, activeGroup.pairs);
        }
    }

    // Initialize the script
    addButton();
})();

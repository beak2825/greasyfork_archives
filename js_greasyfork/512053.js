// ==UserScript==
// @name         Grepolis Optimal Actions
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Suggests optimal actions in Grepolis based on current game state, with enhanced notifications and organized settings.
// @author       Nyxiafed
// @match        https://*.grepolis.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512053/Grepolis%20Optimal%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/512053/Grepolis%20Optimal%20Actions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create a GUI overlay
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '50px';
    gui.style.right = '10px';
    gui.style.width = '320px';
    gui.style.backgroundColor = '#1e1e1e'; // Dark background for dark mode
    gui.style.color = '#f0f0f0'; // Light text color
    gui.style.padding = '15px';
    gui.style.zIndex = '9999';
    gui.style.borderRadius = '12px'; // Rounded corners
    gui.style.fontFamily = 'Arial, sans-serif';
    gui.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5)';
    gui.style.maxHeight = '400px';
    gui.style.overflowY = 'auto';
    gui.style.opacity = '1'; // Fully visible
    document.body.appendChild(gui);

    // Create a static movable minimize/maximize button
    const toggleButton = document.createElement('button');
    toggleButton.innerText = 'Minimize';
    toggleButton.style.position = 'fixed'; // Position fixed
    toggleButton.style.width = '100px'; // Fixed width
    toggleButton.style.height = '40px'; // Fixed height
    toggleButton.style.backgroundColor = '#007bff'; // Blue color for the button
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.zIndex = '10000'; // Above the GUI
    toggleButton.style.right = '10px'; // Initial position
    toggleButton.style.top = '10px'; // Initial position
    document.body.appendChild(toggleButton); // Added button to GUI

    // Make the toggle button draggable
    makeDraggable(toggleButton);

    // Create main content areas for notifications and settings
    const contentArea = document.createElement('div');
    contentArea.style.display = 'flex';
    contentArea.style.flexDirection = 'column';
    gui.appendChild(contentArea);

    // Create resource display area
    const resourceDisplay = createResourceDisplay(contentArea);

    // Create notification area
    const notificationArea = createNotificationArea(contentArea);

    // Create action history area
    const actionHistoryArea = createActionHistoryArea(contentArea);

    // Create a settings tab section
    const settingsTab = createSettingsTab(contentArea);
    contentArea.appendChild(settingsTab);

    // Load settings from local storage
    loadSettings();

    // Show the GUI on page load
    gui.style.display = 'block';

    // Make the GUI draggable
    makeDraggable(gui);

    // Fade everything else on the page when minimizing/maximizing
    toggleButton.addEventListener('click', toggleGUI);

    // Functions to handle the script logic
    function createResourceDisplay(parent) {
        const resourceDisplay = document.createElement('div');
        resourceDisplay.style.backgroundColor = '#444'; // Darker background for resources
        resourceDisplay.style.padding = '10px';
        resourceDisplay.style.borderRadius = '8px';
        resourceDisplay.style.marginBottom = '10px';
        resourceDisplay.style.color = 'white';
        resourceDisplay.innerHTML = `
            <h3 style="margin: 0;">Resources</h3>
            <p>Wood: <span id="woodAmount">0</span></p>
            <p>Stone: <span id="stoneAmount">0</span></p>
            <p>Silver: <span id="silverAmount">0</span></p>
        `;
        parent.appendChild(resourceDisplay);
        updateResources();
        return resourceDisplay;
    }

    function updateResources() {
        // Fetch current resources (replace with actual fetching logic)
        const wood = 1000; // Example value
        const stone = 800; // Example value
        const silver = 600; // Example value

        document.getElementById('woodAmount').innerText = wood;
        document.getElementById('stoneAmount').innerText = stone;
        document.getElementById('silverAmount').innerText = silver;
    }

    function createNotificationArea(parent) {
        const notificationArea = document.createElement('div');
        notificationArea.style.backgroundColor = '#333'; // Darker background for notifications
        notificationArea.style.padding = '10px';
        notificationArea.style.borderRadius = '8px';
        notificationArea.style.marginBottom = '10px';
        notificationArea.style.transition = 'opacity 0.3s';
        parent.appendChild(notificationArea);
        return notificationArea;
    }

    function createActionHistoryArea(parent) {
        const actionHistoryArea = document.createElement('div');
        actionHistoryArea.style.backgroundColor = '#444'; // Darker background for action history
        actionHistoryArea.style.padding = '10px';
        actionHistoryArea.style.borderRadius = '8px';
        actionHistoryArea.style.marginBottom = '10px';
        actionHistoryArea.style.color = 'white';

        const actionHistoryTitle = document.createElement('h3');
        actionHistoryTitle.innerText = 'Action History';
        actionHistoryTitle.style.margin = '0';
        actionHistoryArea.appendChild(actionHistoryTitle);

        const actionList = document.createElement('ul');
        actionList.id = 'actionList';
        actionHistoryArea.appendChild(actionList);

        parent.appendChild(actionHistoryArea);
        return actionHistoryArea;
    }

    function logAction(action) {
        const actionList = document.getElementById('actionList');
        const newAction = document.createElement('li');
        const timestamp = new Date().toLocaleTimeString();
        newAction.innerText = `${action} at ${timestamp}`;
        actionList.appendChild(newAction);
    }

    function createSettingsTab(parent) {
        const settingsTab = document.createElement('div');
        settingsTab.innerHTML = `
            <h3 style="margin-top: 0; text-align: center; color: white;">Settings</h3>
            <div style="margin-bottom: 10px; text-align: center;">
                <button id="generalSettingsBtn" style="width: 48%; margin-right: 4%; margin-bottom: 10px; background-color: #444; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">General</button>
                <button id="notificationSettingsBtn" style="width: 48%; margin-bottom: 10px; background-color: #444; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Notifications</button>
            </div>
            <div id="generalSettings" style="display: block;">
                <label style="display: block; margin-bottom: 10px;">
                    Minimum Wood for Suggestions:
                    <input type="number" id="minWood" value="500" style="width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #444;" />
                </label>
                <label style="display: block; margin-bottom: 10px;">
                    Minimum Stone for Suggestions:
                    <input type="number" id="minStone" value="300" style="width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #444;" />
                </label>
                <label style="display: block; margin-bottom: 10px;">
                    Minimum Silver for Suggestions:
                    <input type="number" id="minSilver" value="400" style="width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #444;" />
                </label>
                <hr style="border: 1px solid #444; margin: 10px 0;" />
                <h4 style="color: white;">Construction Preferences</h4>
                <button id="toggleConstruction" style="background-color: #444; color: white; border: none; padding: 5px; border-radius: 5px; cursor: pointer;">+</button>
                <div id="constructionPreferences" style="display: none;">
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="upgradeTimberCamp" />
                        Upgrade Timber Camp
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="upgradeSilverMine" />
                        Upgrade Silver Mine
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="upgradeBarracks" />
                        Upgrade Barracks
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="upgradeTownHall" />
                        Upgrade Town Hall
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="buildMarket" />
                        Build Market
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="buildWorkshop" />
                        Build Workshop
                    </label>
                    <label style="display: block; margin-bottom: 5px;">
                        <input type="checkbox" id="buildWarehouse" />
                        Build Warehouse
                    </label>
                </div>
                <button id="saveSettings" style="width: 100%; background-color: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Save Settings</button>
            </div>
            <div id="notificationSettings" style="display: none;">
                <h4 style="color: white;">Notification Settings</h4>
                <label style="display: block; margin-bottom: 5px;">
                    Notification Sound URL:
                    <input type="text" id="notificationSound" value="path/to/sound.mp3" style="width: 100%; padding: 5px; border-radius: 5px; border: 1px solid #444;" />
                </label>
                <button id="testSound" style="width: 100%; background-color: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Test Sound</button>
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <textarea id="userFeedback" placeholder="Enter your feedback..." style="width: 100%; height: 50px; padding: 5px; border-radius: 5px; border: 1px solid #444;"></textarea>
                <button id="submitFeedback" style="width: 100%; background-color: #007bff; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Submit Feedback</button>
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <button id="helpButton" style="background-color: #444; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Help</button>
            </div>
        `;
        return settingsTab;
    }

    function toggleGUI() {
        if (gui.style.opacity === '0') {
            gui.style.opacity = '1';
            toggleButton.innerText = 'Minimize';
        } else {
            gui.style.opacity = '0';
            toggleButton.innerText = 'Maximize';
        }
    }

    function makeDraggable(element) {
        let offsetX, offsetY;
        element.onmousedown = function (e) {
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.onmousemove = function (e) {
                element.style.left = e.clientX - offsetX + 'px';
                element.style.top = e.clientY - offsetY + 'px';
            };
            document.onmouseup = function () {
                document.onmousemove = null;
            };
        };
    }

    // Save Settings button event listener
    document.getElementById('saveSettings').addEventListener('click', () => {
        // Save general settings to local storage
        localStorage.setItem('minWood', document.getElementById('minWood').value);
        localStorage.setItem('minStone', document.getElementById('minStone').value);
        localStorage.setItem('minSilver', document.getElementById('minSilver').value);

        // Save construction preferences
        localStorage.setItem('upgradeTimberCamp', document.getElementById('upgradeTimberCamp').checked);
        localStorage.setItem('upgradeSilverMine', document.getElementById('upgradeSilverMine').checked);
        localStorage.setItem('upgradeBarracks', document.getElementById('upgradeBarracks').checked);
        localStorage.setItem('upgradeTownHall', document.getElementById('upgradeTownHall').checked);
        localStorage.setItem('buildMarket', document.getElementById('buildMarket').checked);
        localStorage.setItem('buildWorkshop', document.getElementById('buildWorkshop').checked);
        localStorage.setItem('buildWarehouse', document.getElementById('buildWarehouse').checked);

        alert('Settings saved!');
    });

    // Toggle Settings Tabs
    document.getElementById('generalSettingsBtn').addEventListener('click', () => {
        document.getElementById('generalSettings').style.display = 'block';
        document.getElementById('notificationSettings').style.display = 'none';
    });

    document.getElementById('notificationSettingsBtn').addEventListener('click', () => {
        document.getElementById('generalSettings').style.display = 'none';
        document.getElementById('notificationSettings').style.display = 'block';
    });

    // Toggle Construction Preferences
    document.getElementById('toggleConstruction').addEventListener('click', () => {
        const constructionPreferences = document.getElementById('constructionPreferences');
        constructionPreferences.style.display = constructionPreferences.style.display === 'none' ? 'block' : 'none';
        document.getElementById('toggleConstruction').innerText = constructionPreferences.style.display === 'none' ? '+' : '-';
    });

    // Test Sound Button
    document.getElementById('testSound').addEventListener('click', () => {
        const sound = document.getElementById('notificationSound').value;
        playSound(sound);
    });

    function playSound(sound) {
        const audio = new Audio(sound);
        audio.play();
    }

    // User Feedback Submission
    document.getElementById('submitFeedback').addEventListener('click', () => {
        const feedback = document.getElementById('userFeedback').value;
        if (feedback) {
            localStorage.setItem('userFeedback', feedback);
            alert('Feedback submitted!');
            document.getElementById('userFeedback').value = ''; // Clear the textarea
        } else {
            alert('Please enter feedback before submitting.');
        }
    });

    function loadSettings() {
        document.getElementById('minWood').value = localStorage.getItem('minWood') || 500;
        document.getElementById('minStone').value = localStorage.getItem('minStone') || 300;
        document.getElementById('minSilver').value = localStorage.getItem('minSilver') || 400;

        document.getElementById('upgradeTimberCamp').checked = JSON.parse(localStorage.getItem('upgradeTimberCamp') || 'false');
        document.getElementById('upgradeSilverMine').checked = JSON.parse(localStorage.getItem('upgradeSilverMine') || 'false');
        document.getElementById('upgradeBarracks').checked = JSON.parse(localStorage.getItem('upgradeBarracks') || 'false');
        document.getElementById('upgradeTownHall').checked = JSON.parse(localStorage.getItem('upgradeTownHall') || 'false');
        document.getElementById('buildMarket').checked = JSON.parse(localStorage.getItem('buildMarket') || 'false');
        document.getElementById('buildWorkshop').checked = JSON.parse(localStorage.getItem('buildWorkshop') || 'false');
        document.getElementById('buildWarehouse').checked = JSON.parse(localStorage.getItem('buildWarehouse') || 'false');
    }

    // Add quick action buttons to the settings
    const quickActionButtons = document.createElement('div');
    quickActionButtons.style.marginBottom = '10px';
    quickActionButtons.innerHTML = `
        <h3 style="margin: 0;">Quick Actions</h3>
        <button id="gatherResources" style="margin: 5px; padding: 5px;">Gather Resources</button>
        <button id="build" style="margin: 5px; padding: 5px;">Build</button>
        <button id="upgrade" style="margin: 5px; padding: 5px;">Upgrade</button>
        <button id="sendTroops" style="margin: 5px; padding: 5px;">Send Troops</button>
    `;
    parent.appendChild(quickActionButtons);

    // Event listeners for quick actions
    document.getElementById('gatherResources').addEventListener('click', () => logAction('Gathered Resources'));
    document.getElementById('build').addEventListener('click', () => logAction('Built Structure'));
    document.getElementById('upgrade').addEventListener('click', () => logAction('Upgraded Structure'));
    document.getElementById('sendTroops').addEventListener('click', () => logAction('Sent Troops'));

    // Help section
    document.getElementById('helpButton').addEventListener('click', () => {
        alert('Help:\n- Use the Settings tab to configure your preferences.\n- Click Quick Actions for immediate actions.\n- Feedback is saved for future improvements.');
    });

})();

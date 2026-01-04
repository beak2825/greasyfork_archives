// ==UserScript==
// @name        Diep.io - Custom Builds
// @namespace   .\/.
// @match       *://diep.io/*
// @grant       none
// @version     1.2
// @author      frreal
// @description Create and save builds that upgrade automatically. T to toggle menu.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/546347/Diepio%20-%20Custom%20Builds.user.js
// @updateURL https://update.greasyfork.org/scripts/546347/Diepio%20-%20Custom%20Builds.meta.js
// ==/UserScript==

let hasUpgraded = false;

// Store stat levels and upgrade order
const stats = {
    'health-regen': 0,
    'max-health': 0,
    'body-damage': 0,
    'bullet-speed': 0,
    'bullet-penetration': 0,
    'bullet-damage': 0,
    'reload': 0,
    'movement-speed': 0
};

// Track the full upgrade order (33 upgrades total)
let upgradeOrder = [];

// Track which build is being edited (if any)
let editingBuildIndex = -1;

// Stat to number mapping for the command string
const statToNumber = {
    'health-regen': '1',
    'max-health': '2',
    'body-damage': '3',
    'bullet-speed': '4',
    'bullet-penetration': '5',
    'bullet-damage': '6',
    'reload': '7',
    'movement-speed': '8'
};

// Stat configuration
const statConfig = [
    { name: 'Health Regen', key: 'health-regen', color: '#ff8c00', hotkey: '1' },
    { name: 'Max Health', key: 'max-health', color: '#ff00ff', hotkey: '2' },
    { name: 'Body Damage', key: 'body-damage', color: '#9932cc', hotkey: '3' },
    { name: 'Bullet Speed', key: 'bullet-speed', color: '#4169e1', hotkey: '4' },
    { name: 'Bullet Penetration', key: 'bullet-penetration', color: '#ffd700', hotkey: '5' },
    { name: 'Bullet Damage', key: 'bullet-damage', color: '#ff4444', hotkey: '6' },
    { name: 'Reload', key: 'reload', color: '#32cd32', hotkey: '7' },
    { name: 'Movement Speed', key: 'movement-speed', color: '#00ffff', hotkey: '8' }
];

// Create and inject CSS
function createStyles() {
    const style = document.createElement('style');
    style.textContent = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }

        .build-name-input {
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }

        body {
            background-color: #000;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-image:
                linear-gradient(rgba(50, 50, 50, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(50, 50, 50, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        }

        .menu-container {
            display: none;
            background-color: #1a1a1a;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            min-width: 400px;
            width: 450px;
            height: 800px;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 999999 !important;
            pointer-events: auto !important;
        }



        .back-btn {
            background-color: #555;
            border: none;
            color: #111;
            font-size: 25px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            width: 60px;
            height: 30px;
            border-radius: 4px;
            outline: none;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .back-btn:hover {
            background-color: #777;
            color: #000;
        }

        .back-btn:focus {
            outline: none;
        }

        .builds-list {
            max-height: 670px;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .saved-builds-content {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .builds-list-container {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
        }

        .build-item {
            background-color: #2a2a2a;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            border: 1px solid transparent;
        }

        .build-item * {
            cursor: pointer;
        }

        .build-item:hover {
            background-color: #3a3a3a;
        }

        .build-item.active {
            background-color: #4a4a4a;
        }

        .build-info {
            flex-grow: 1;
        }

        .build-name {
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .build-command {
            color: #aaa;
            font-size: 12px;
            font-family: monospace;
            margin-bottom: 5px;
        }



        .build-actions {
            display: flex;
            gap: 5px;
        }

        .build-btn {
            background-color: #777;
            border: none;
            color: #333;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            padding: 5px 8px;
            border-radius: 3px;
            outline: none;
        }

        .build-btn * {
            cursor: pointer;
        }

        .build-btn:hover {
            background-color: #888;
            color: #222;
        }

        .build-btn:focus {
            outline: none;
        }

        .create-build-btn {
            background-color: #888;
            border: none;
            color: #111;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            padding: 10px 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            outline: none;
            align-self: flex-start;
        }

        .create-build-btn:hover {
            background-color: #999;
            color: #000;
        }

        .create-build-btn:focus {
            outline: none;
        }

        .toggle-text {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #666;
            font-size: 12px;
            pointer-events: none;
        }

        .stat-row {
            display: flex;
            align-items: center;
            background-color: #2a2a2a;
            margin-bottom: 8px;
            border-radius: 8px;
            padding: 12px;
        }

        .stat-row:hover {
            background-color: #3a3a3a;
        }

        .color-bar {
            width: 8px;
            height: 30px;
            border-radius: 4px;
            margin-right: 15px;
        }

        .stat-name {
            color: white;
            font-size: 16px;
            font-weight: bold;
            flex-grow: 1;
        }

        .level-indicator {
            color: white;
            font-size: 14px;
            margin-right: 15px;
            background-color: #333;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .upgrade-btn, .downgrade-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #777;
            border: none;
            color: #333;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 2px;
            outline: none;
        }

        .upgrade-btn:hover, .downgrade-btn:hover {
            background-color: #888 !important;
            color: #222 !important;
            transform: scale(1.1);
        }

        .upgrade-btn:active, .downgrade-btn:active {
            transform: scale(0.95);
        }

        .upgrade-btn:focus, .downgrade-btn:focus {
            outline: none;
        }

        .level-display {
            color: #aaa;
            font-size: 12px;
            margin-left: 10px;
        }

        .command-display {
            color: #fff;
            font-size: 14px;
            font-family: monospace;
            background-color: #333;
            padding: 10px;
            border-radius: 5px;
            margin-top: 8px;
            margin-bottom: 15px;
            word-break: break-all;
            text-align: center;
            min-height: 40px;
            line-height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .build-name-input {
            background-color: #333;
            border: 1px solid #555;
            color: #fff;
            font-size: 14px;
            font-family: monospace;
            padding: 10px;
            border-radius: 5px;
            margin-top: 15px;
            margin-bottom: 8px;
            width: 100%;
            box-sizing: border-box;
            outline: none;
            z-index: 1000000;
            pointer-events: auto;
            cursor: text;
            user-select: text;
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
        }

        .build-name-input:focus {
            border-color: #777;
        }

        .button-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .right-buttons {
            display: flex;
            gap: 10px;
        }

        .delete-btn, .clear-btn, .save-btn {
            background-color: #777;
            border: none;
            color: #333;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 4px;
            outline: none;
        }

        .delete-btn:hover, .clear-btn:hover, .save-btn:hover {
            background-color: #999;
            color: #222;
        }

        .delete-btn:active, .clear-btn:active, .save-btn:active {
            transform: scale(0.95);
        }

        .delete-btn:focus, .clear-btn:focus, .save-btn:focus {
            outline: none;
        }
    `;
    document.head.appendChild(style);
}

// Create stat row element
function createStatRow(stat) {
    const row = document.createElement('div');
    row.className = 'stat-row';
    row.setAttribute('data-stat', stat.key);

    const colorBar = document.createElement('div');
    colorBar.className = 'color-bar';
    colorBar.style.backgroundColor = stat.color;

    const statName = document.createElement('div');
    statName.className = 'stat-name';
    statName.textContent = stat.name;

    const levelIndicator = document.createElement('div');
    levelIndicator.className = 'level-indicator';
    levelIndicator.textContent = `[${stat.hotkey}]`;

    const downgradeBtn = document.createElement('button');
    downgradeBtn.className = 'downgrade-btn';
    downgradeBtn.textContent = '-';
    downgradeBtn.onclick = () => downgradeStat(stat.key);

    const upgradeBtn = document.createElement('button');
    upgradeBtn.className = 'upgrade-btn';
    upgradeBtn.textContent = '+';
    upgradeBtn.onclick = () => upgradeStat(stat.key);

    const levelDisplay = document.createElement('div');
    levelDisplay.className = 'level-display';
    levelDisplay.textContent = `${stats[stat.key]}`;

    row.appendChild(colorBar);
    row.appendChild(statName);
    row.appendChild(levelIndicator);
    row.appendChild(downgradeBtn);
    row.appendChild(upgradeBtn);
    row.appendChild(levelDisplay);

    return row;
}

// Create main menu container
function createMenuContainer() {
    const container = document.createElement('div');
    container.className = 'menu-container';

    // Create the main content
    const mainContent = createMainContent();
    container.appendChild(mainContent);

    return container;
}

// Create main content
function createMainContent() {
    const content = document.createElement('div');
    content.id = 'main-content';

    // Add toggle text
    const toggleText = document.createElement('div');
    toggleText.className = 'toggle-text';
    toggleText.textContent = 'T to Toggle Menu';
    content.appendChild(toggleText);

    // Add back button at the top (only visible in build editor)
    const backBtn = document.createElement('button');
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '&larr;';
    backBtn.onclick = () => showSavedBuilds();
    backBtn.id = 'back-btn';
    backBtn.style.display = 'none';
    content.appendChild(backBtn);

    // Add build editor content (hidden by default)
    const buildEditorContent = createBuildEditorContent();
    buildEditorContent.id = 'build-editor-content';
    buildEditorContent.style.display = 'none';
    content.appendChild(buildEditorContent);

    // Add saved builds content
    const savedBuildsContent = createSavedBuildsContent();
    savedBuildsContent.id = 'saved-builds-content';
    content.appendChild(savedBuildsContent);

    return content;
}

// Create build editor content
function createBuildEditorContent() {
    const content = document.createElement('div');

    // Add "Build Editor" title
    const title = document.createElement('div');
    title.style.cssText = 'color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center;';
    title.textContent = 'Build Editor';
    content.appendChild(title);

    // Add build name input
    const buildNameInput = document.createElement('input');
    buildNameInput.className = 'build-name-input';
    buildNameInput.type = 'text';
    buildNameInput.placeholder = 'Enter build name...';
    buildNameInput.id = 'build-name-input';
    buildNameInput.autocomplete = 'off';

    // Prevent game from interfering with input
    buildNameInput.addEventListener('keydown', (e) => {
        e.stopPropagation();
    });

    buildNameInput.addEventListener('keyup', (e) => {
        e.stopPropagation();
    });

    buildNameInput.addEventListener('input', (e) => {
        e.stopPropagation();
    });

    buildNameInput.addEventListener('focus', (e) => {
        e.stopPropagation();
    });

    buildNameInput.addEventListener('blur', (e) => {
        e.stopPropagation();
    });
        buildNameInput.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        buildNameInput.focus();
    });

    buildNameInput.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        buildNameInput.focus();
    });

    // Save on Enter key
    buildNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            saveBuild();
        }
    });

    content.appendChild(buildNameInput);

    // Add command display
    const commandDisplay = document.createElement('div');
    commandDisplay.className = 'command-display';
    commandDisplay.id = 'command-display';
    commandDisplay.textContent = '';

    content.appendChild(commandDisplay);

    // Add button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.onclick = saveBuild;

    const rightButtons = document.createElement('div');
    rightButtons.className = 'right-buttons';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = deleteLastUpgrade;

    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.onclick = clearAllUpgrades;

    rightButtons.appendChild(deleteBtn);
    rightButtons.appendChild(clearBtn);

    buttonContainer.appendChild(saveBtn);
    buttonContainer.appendChild(rightButtons);
    content.appendChild(buttonContainer);

    // Add stat rows
    statConfig.forEach(stat => {
        const row = createStatRow(stat);
        content.appendChild(row);
    });

    return content;
}

// Create saved builds content
function createSavedBuildsContent() {
    const content = document.createElement('div');
    content.className = 'saved-builds-content';

    // Add "Saved Builds" title
    const title = document.createElement('div');
    title.style.cssText = 'color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center;';
    title.textContent = 'Saved Builds';
    content.appendChild(title);

    // Add "Create Build" button
    const createBuildBtn = document.createElement('button');
    createBuildBtn.className = 'create-build-btn';
    createBuildBtn.textContent = 'Create Build';
    createBuildBtn.onclick = () => {
        showBuildEditor();
        clearAllUpgrades();

        // Reset editing state for new build
        editingBuildIndex = -1;

        // Clear build name input when creating a new build
        const buildNameInput = document.getElementById('build-name-input');
        if (buildNameInput) {
            buildNameInput.value = '';
        }
    };
    content.appendChild(createBuildBtn);

    // Add builds list container
    const buildsListContainer = document.createElement('div');
    buildsListContainer.className = 'builds-list-container';

    // Add builds list
    const buildsList = document.createElement('div');
    buildsList.className = 'builds-list';
    buildsList.id = 'builds-list';
    buildsListContainer.appendChild(buildsList);
    content.appendChild(buildsListContainer);

    return content;
}

// Function to update command display
function updateCommandDisplay() {
    const commandDisplay = document.getElementById('command-display');
    const commandString = upgradeOrder.map(stat => statToNumber[stat]).join('');
    commandDisplay.textContent = commandString;
}

// Function to check if stat can be upgraded (max 7 times)
function canUpgradeStat(statName) {
    return stats[statName] < 7 && upgradeOrder.length < 33;
}

// Function to delete the last upgrade
function deleteLastUpgrade() {
    if (upgradeOrder.length > 0) {
        const lastStat = upgradeOrder.pop();
        stats[lastStat]--;

        // Update the level display
        const statRow = document.querySelector(`[data-stat="${lastStat}"]`);
        const levelDisplay = statRow.querySelector('.level-display');
        levelDisplay.textContent = `${stats[lastStat]}`;

        // Add visual feedback to delete button
        const deleteBtn = document.querySelector('.delete-btn');
        deleteBtn.style.backgroundColor = '#777';
        deleteBtn.style.color = '#222';

        setTimeout(() => {
            deleteBtn.style.backgroundColor = '';
            deleteBtn.style.color = '';
        }, 50);

        // Add visual feedback to the stat's downgrade button
        const downgradeBtn = statRow.querySelector('.downgrade-btn');
        downgradeBtn.style.backgroundColor = '#777';
        downgradeBtn.style.color = '#222';

        setTimeout(() => {
            downgradeBtn.style.backgroundColor = '';
            downgradeBtn.style.color = '';
        }, 50);

        // Update command display
        updateCommandDisplay();

        // Log the deletion
        //log(`Deleted last upgrade: ${lastStat}`);
        //console.log(`Upgrade order: ${upgradeOrder.map(stat => statToNumber[stat]).join('')}`);
    }
}

// Function to clear all upgrades
function clearAllUpgrades() {
    // Reset all stats to 0
    Object.keys(stats).forEach(statName => {
        stats[statName] = 0;
        const statRow = document.querySelector(`[data-stat="${statName}"]`);
        const levelDisplay = statRow.querySelector('.level-display');
        levelDisplay.textContent = '0';
    });

    // Clear upgrade order
    upgradeOrder = [];

    // Preserve editing state - don't reset editingBuildIndex
    // This allows editing an existing build after clearing

    // Update command display
    updateCommandDisplay();

    // Log the clear
    //console.log('All upgrades cleared');
}

// Function to save build to localStorage
function saveBuild() {
    const buildNameInput = document.getElementById('build-name-input');
    const buildName = buildNameInput.value.trim() || 'Unnamed Build';
    const commandString = upgradeOrder.map(stat => statToNumber[stat]).join('');
    const buildData = {
        name: buildName,
        command: commandString,
        stats: { ...stats }
    };

    // Get existing builds or create new array
    const existingBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');

    if (editingBuildIndex !== -1) {
        // Update existing build
        existingBuilds[editingBuildIndex] = buildData;
        //console.log(`Build "${buildName}" updated: ${commandString}`);
        editingBuildIndex = -1; // Reset editing state
    } else {
        // Create new build
        existingBuilds.push(buildData);
        //console.log(`Build "${buildName}" saved: ${commandString}`);
    }

    // Save back to localStorage
    localStorage.setItem('savedBuilds', JSON.stringify(existingBuilds));

    // Add visual feedback
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.style.backgroundColor = '#777';
    saveBtn.style.color = '#222';

    setTimeout(() => {
        saveBtn.style.backgroundColor = '';
        saveBtn.style.color = '';
    }, 200);

    // Return to saved builds page
    setTimeout(() => {
        showSavedBuilds();
    }, 200);
}

// Upgrade function
function upgradeStat(statName) {
    if (!canUpgradeStat(statName)) {
        return; // Can't upgrade anymore
    }

    stats[statName]++;
    upgradeOrder.push(statName);

    // Update the level display
    const statRow = document.querySelector(`[data-stat="${statName}"]`);
    const levelDisplay = statRow.querySelector('.level-display');
    levelDisplay.textContent = `${stats[statName]}`;

    // Add visual feedback
    const upgradeBtn = statRow.querySelector('.upgrade-btn');
    upgradeBtn.style.backgroundColor = '#888';
    upgradeBtn.style.color = '#222';

    setTimeout(() => {
        upgradeBtn.style.backgroundColor = '';
        upgradeBtn.style.color = '';
    }, 50);

    // Update command display
    updateCommandDisplay();

    // Log the upgrade
    //console.log(`${statName} upgraded to level ${stats[statName]}`);
    //console.log(`Upgrade order: ${upgradeOrder.map(stat => statToNumber[stat]).join('')}`);
}

// Downgrade function
function downgradeStat(statName) {
    if (stats[statName] > 0) {
        // Find the last occurrence of this stat in the upgrade order
        const lastIndex = upgradeOrder.lastIndexOf(statName);
        if (lastIndex !== -1) {
            // Remove the last occurrence from the upgrade order
            upgradeOrder.splice(lastIndex, 1);
            stats[statName]--;

            // Update the level display
            const statRow = document.querySelector(`[data-stat="${statName}"]`);
            const levelDisplay = statRow.querySelector('.level-display');
            levelDisplay.textContent = `${stats[statName]}`;

                    // Add visual feedback
        const downgradeBtn = statRow.querySelector('.downgrade-btn');
        downgradeBtn.style.backgroundColor = '#777';
        downgradeBtn.style.color = '#222';

        setTimeout(() => {
            downgradeBtn.style.backgroundColor = '';
            downgradeBtn.style.color = '';
        }, 50);

            // Update command display
            updateCommandDisplay();

            // Log the downgrade
            //console.log(`${statName} downgraded to level ${stats[statName]}`);
            //console.log(`Upgrade order: ${upgradeOrder.map(stat => statToNumber[stat]).join('')}`);
        }
    }
}

// Add keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        const key = event.key;

        // Check if build name input is focused
        const buildNameInput = document.getElementById('build-name-input');
        if (document.activeElement === buildNameInput) {
            // Don't process hotkeys when typing in the build name input
            return;
        }

        // Check for T key to toggle menu
        if (key === 't' || key === 'T' || key === 'Escape') {
            toggleMenu();
            return;
        }

        // Check for delete key
        if (key === 'Delete' || key === 'Backspace') {
            deleteLastUpgrade();
            return;
        }

        // Check for stat hotkeys
        const stat = statConfig.find(s => s.hotkey === key);
        if (stat) {
            upgradeStat(stat.key);
        }
    });
}

// Show saved builds
function showSavedBuilds() {
    document.getElementById('build-editor-content').style.display = 'none';
    document.getElementById('saved-builds-content').style.display = 'block';
    document.getElementById('back-btn').style.display = 'none';
    setTimeout(() => loadSavedBuilds(), 0);
}

// Toggle menu visibility
function toggleMenu() {
    const menuContainer = document.querySelector('.menu-container');
    const computedStyle = window.getComputedStyle(menuContainer);
    if (computedStyle.display === 'none') {
        //console.log("TOGGLE TO OPEN");
        menuContainer.style.display = 'block';
    } else {
        //console.log("TOGGLE TO CLOSE");
        menuContainer.style.display = 'none';
    }
}

// Show build editor
function showBuildEditor() {
    document.getElementById('saved-builds-content').style.display = 'none';
    document.getElementById('build-editor-content').style.display = 'block';
    document.getElementById('back-btn').style.display = 'block';
}

// Load and display saved builds
function loadSavedBuilds() {
    const buildsList = document.getElementById('builds-list');
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
    const activeBuild = JSON.parse(localStorage.getItem('activeBuild') || 'null');

    buildsList.innerHTML = '';

    if (savedBuilds.length === 0) {
        buildsList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">No saved builds found</div>';
        return;
    }

    savedBuilds.forEach((build, index) => {
        const buildItem = document.createElement('div');
        buildItem.className = 'build-item';

        // Check if this build is the active build
        if (activeBuild && activeBuild.name === build.name && activeBuild.command === build.command) {
            buildItem.classList.add('active');
        }

        const buildInfo = document.createElement('div');
        buildInfo.className = 'build-info';

        const buildName = document.createElement('div');
        buildName.className = 'build-name';
        buildName.textContent = build.name;

        const buildCommand = document.createElement('div');
        buildCommand.className = 'build-command';
        buildCommand.textContent = build.command;

        buildInfo.appendChild(buildName);
        buildInfo.appendChild(buildCommand);

        const buildActions = document.createElement('div');
        buildActions.className = 'build-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'build-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the build item click
            loadBuild(build);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'build-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the build item click
            deleteBuild(index);
        };

        buildActions.appendChild(editBtn);
        buildActions.appendChild(deleteBtn);

        buildItem.appendChild(buildInfo);
        buildItem.appendChild(buildActions);

        // Add click handler to set as active build
        buildItem.onclick = () => setActiveBuild(build, index);

        buildsList.appendChild(buildItem);
    });
}

// Load a build into the editor
function loadBuild(build) {
    // Clear current build
    clearAllUpgrades();

    // Load the saved build
    Object.keys(build.stats).forEach(statName => {
        stats[statName] = build.stats[statName];
        const statRow = document.querySelector(`[data-stat="${statName}"]`);
        const levelDisplay = statRow.querySelector('.level-display');
        levelDisplay.textContent = `${stats[statName]}`;
    });

    // Load upgrade order
    upgradeOrder = [];
    build.command.split('').forEach(char => {
        const statName = Object.keys(statToNumber).find(key => statToNumber[key] === char);
        if (statName) {
            upgradeOrder.push(statName);
        }
    });

    // Load build name
    const buildNameInput = document.getElementById('build-name-input');
    buildNameInput.value = build.name;

    // Update command display
    updateCommandDisplay();

    // Set editing state
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
    editingBuildIndex = savedBuilds.findIndex(savedBuild =>
        savedBuild.name === build.name && savedBuild.command === build.command
    );

    // Switch to build editor
    showBuildEditor();

    //console.log(`Loaded build for editing: ${build.name} (index: ${editingBuildIndex})`);
}

// Set active build
function setActiveBuild(build, index) {
    const activeBuild = JSON.parse(localStorage.getItem('activeBuild') || 'null');

    // Check if this build is already active
    if (activeBuild && activeBuild.name === build.name && activeBuild.command === build.command) {
        // Deactivate the build
        localStorage.removeItem('activeBuild');
        document.querySelectorAll('.build-item').forEach(item => {
            item.classList.remove('active');
        });
        //console.log(`Active build deactivated: ${build.name}`);
    } else {
        // Activate the build
        localStorage.setItem('activeBuild', JSON.stringify(build));

        // Update visual highlighting
        document.querySelectorAll('.build-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to the clicked build
        const buildItems = document.querySelectorAll('.build-item');
        if (buildItems[index]) {
            buildItems[index].classList.add('active');
        }
        hasUpgraded = false;
        //console.log(`Active build set to: ${build.name}`);
    }
}

// Delete a build from storage
function deleteBuild(index) {
    const savedBuilds = JSON.parse(localStorage.getItem('savedBuilds') || '[]');
    const deletedBuild = savedBuilds.splice(index, 1)[0];

    // If the deleted build was the active build, clear the active build
    const activeBuild = JSON.parse(localStorage.getItem('activeBuild') || 'null');
    if (activeBuild && activeBuild.name === deletedBuild.name && activeBuild.command === deletedBuild.command) {
        localStorage.removeItem('activeBuild');
        hasUpgraded = false;
    }

    localStorage.setItem('savedBuilds', JSON.stringify(savedBuilds));

    //console.log(`Deleted build: ${deletedBuild.name}`);
    loadSavedBuilds(); // Refresh the list
}

// Initialize the menu
function initMenu() {
    // Create and inject styles
    createStyles();

    // Create and append menu
    const menu = createMenuContainer();
    document.body.appendChild(menu);

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Load saved builds immediately since we start on that page
    setTimeout(() => loadSavedBuilds(), 0);
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
} else {
    initMenu();
}


(function() {
    setInterval(function() {
        try {
            if (window.__common__ && window.__common__._screen_state === "in-game" && !hasUpgraded) {
                let activeBuild = JSON.parse(localStorage.getItem('activeBuild') || 'null');
                if (activeBuild && activeBuild !== 'null') {
                    if (window.input && window.input.execute) {
                        window.input.execute(`game_stats_build ${activeBuild.command}`);
                        //console.log("Upgrade Successful!");
                        hasUpgraded = true;
                    }
                }
            }
            if (window.__common__ && window.__common__._screen_state !== "in-game") {
                hasUpgraded = false;
            }
        } catch (error) {
            console.log("faggot");
        }
    }, 100);
})();

// ==UserScript==
// @name         Tribal Wars Bot with GUI and Start/Stop Buttons
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @license      MIT
// @icon         https://us72.tribalwars.us/favicon.ico
// @description  Tribal wars bot with GUI and Start/Stop buttons
// @author       sharmanhall
// @match        https://enXX.tribalwars.net/*
// @match        https://*.tribalwars.us/*
// @match        https://*.tribalwars.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533611/Tribal%20Wars%20Bot%20with%20GUI%20and%20StartStop%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/533611/Tribal%20Wars%20Bot%20with%20GUI%20and%20StartStop%20Buttons.meta.js
// ==/UserScript==
//
// Description:
// This userscript is designed to automate certain actions in the Tribal Wars game. It includes a graphical user interface (GUI) for configuring settings and starting/stopping the bot. The bot has two main phases:
//
// Phase 1: Automatically queues buildings.
// Phase 2: Automatically queues buildings and farms villages.
//
// Features:
// GUI (Graphical User Interface):
// - Min Wait Time (ms): Input field to set the minimum wait time between actions in milliseconds.
// - Max Wait Time (ms): Input field to set the maximum wait time between actions in milliseconds.
// - Phase: Dropdown menu to select between PHASE_1 (building queue) and PHASE_2 (building queue and farming).
// - Wait For Order Buildings: Checkbox to decide whether the bot should wait for buildings to be queued in a specific order or build as soon as possible.
// - Farm Coordinates: Text area to input the coordinates of villages you want to farm.
// - Farm Troop Set: Dropdown menu to select the set of troops used for farming.
// - Log Area: Text area to view detailed logs of the bot's actions.
//
// Start and Stop Buttons:
// - Start Bot: Button to start the bot.
// - Stop Bot: Button to stop the bot.
//
// Bot Actions:
// - Phase 1: Automatically queues the next available building.
// - Phase 2: Queues the next available building and sends farming attacks to specified coordinates.
//
// Interval Management:
// - Uses intervals to repeatedly check and execute actions at regular intervals (10 seconds by default).
//
// Dynamic Configuration:
// - Allows for changing settings through the GUI, which are applied immediately during the bot's operation.
//
// How It Works:
// Initialization:
// - The script creates a GUI on the game page when enabled.
//
// Configuration:
// - Users can configure wait times, phases, building queue order, farm coordinates, and troop sets through the GUI.
//
// Bot Execution:
// - When the "Start Bot" button is clicked, the bot begins operating based on the selected phase.
//   - Phase 1: The bot navigates to the headquarters view and queues buildings in the specified order or as soon as possible.
//   - Phase 2: The bot navigates to the rally point view and sends farming attacks to the specified coordinates using the chosen troop set.
//
// Stopping the Bot:
// - Clicking the "Stop Bot" button will stop the bot from executing further actions.
//
// Potential Improvements:
// - Error Handling: Enhance error handling to manage scenarios where certain actions fail or specific elements are not found.
// - Logging and Notifications: Add more detailed logging and in-game notifications to inform the user of the bot's actions and status.
// - Advanced Strategies: Implement more sophisticated strategies for farming, such as prioritizing targets based on resources or defensive strength.
// - Dynamic Adaptation: Allow the bot to dynamically adapt to changing game conditions, such as troop availability and resource levels.
// - Customization: Provide more customization options for troop compositions and building priorities.
// - Multi-Village Support: Extend support for managing multiple villages, automating tasks across all user-owned villages.

//*************************** SETUP ***************************//
// Choose Minimum and maximum wait time between actions (in milliseconds)
let MIN_WAIT_TIME = 20000;
let MAX_WAIT_TIME = 40000;
// Choose the bot's actions
// PHASE_1: The bot automatically queues buildings
// PHASE_2: The bot automatically queues buildings and farms villages
let PHASE = "PHASE_1";
// Choose whether you want the bot to queue buildings in the defined order (= true) or
// as soon as a building is available for the building queue (= false)
let WAIT_FOR_ORDER_BUILDINGS = false;
// Enter the coordinates of the villages you want to farm
let FARM_COORDINATES = [
    '000|000', '000|000', '000|000'
];
// Choose your farming troops template
let FARM_TROOP_SET = "FARM_TROOP_SET_3";
// Define your farming troops template
let farmTroopSets = {
    "FARM_TROOP_SET_1": {
        "spear": 10,
        "sword": 10
    },
    "FARM_TROOP_SET_2": {
        "spear": 15,
        "axe": 3
    },
    "FARM_TROOP_SET_3": {
        "lc": 8
    }
};
//*************************** /SETUP ***************************//

// Constants
const OVERVIEW_VIEW = "OVERVIEW_VIEW";
const HEADQUARTERS_VIEW = "HEADQUARTERS_VIEW";
const RALLY_POINT_VIEW = "RALLY_POINT_VIEW";
const ATTACK_CONFIRM_VIEW = "ATTACK_CONFIRM_VIEW";

let isBotRunning = false;
let botInterval;

(function () {
    'use strict';

    console.log("-- Tribal Wars script enabled --");

    createGUI();

})();

// GUI Creation
function createGUI() {
    const guiContainer = document.createElement('div');
    guiContainer.id = 'twBotGUI';
    guiContainer.style.position = 'fixed';
    guiContainer.style.bottom = '10px';
    guiContainer.style.left = '10px';
    guiContainer.style.backgroundColor = '#fff';
    guiContainer.style.border = '1px solid #000';
    guiContainer.style.padding = '10px';
    guiContainer.style.zIndex = '10000';
    guiContainer.style.cursor = 'move';

    const header = document.createElement('div');
    header.innerText = 'Tribal Wars Bot';
    header.style.fontWeight = 'bold';
    header.style.cursor = 'move';
    header.style.backgroundColor = '#ddd';
    header.style.padding = '5px';
    header.onmousedown = dragMouseDown;
    guiContainer.appendChild(header);

    const minButton = document.createElement('button');
    minButton.innerText = 'Minimize';
    minButton.onclick = toggleMinimize;
    guiContainer.appendChild(minButton);

    const content = document.createElement('div');
    content.id = 'twBotGUIContent';

    const minWaitInput = createInput('Min Wait Time (ms)', MIN_WAIT_TIME, (e) => MIN_WAIT_TIME = parseInt(e.target.value));
    const maxWaitInput = createInput('Max Wait Time (ms)', MAX_WAIT_TIME, (e) => MAX_WAIT_TIME = parseInt(e.target.value));
    const phaseInput = createSelect('Phase', ['PHASE_1', 'PHASE_2'], PHASE, (e) => PHASE = e.target.value);
    const waitForOrderInput = createCheckbox('Wait For Order Buildings', WAIT_FOR_ORDER_BUILDINGS, (e) => WAIT_FOR_ORDER_BUILDINGS = e.target.checked);
    const farmCoordsInput = createTextArea('Farm Coordinates', FARM_COORDINATES.join('\n'), (e) => FARM_COORDINATES = e.target.value.split('\n'));
    const farmTroopSetInput = createSelect('Farm Troop Set', Object.keys(farmTroopSets), FARM_TROOP_SET, (e) => FARM_TROOP_SET = e.target.value);

    const startButton = document.createElement('button');
    startButton.innerText = 'Start Bot';
    startButton.onclick = startBot;

    const stopButton = document.createElement('button');
    stopButton.innerText = 'Stop Bot';
    stopButton.onclick = stopBot;

    const logArea = createTextArea('Log', '', () => {});
    logArea.children[1].id = 'logArea';
    logArea.children[1].disabled = true;

    const buildingSelect = createSelect('Select Building', [
        'Headquarters', 'Barracks', 'Stable', 'First church', 'Smithy', 'Rally point', 'Statue', 'Market',
        'Timber camp', 'Clay pit', 'Iron mine', 'Farm', 'Warehouse', 'Hiding place', 'Wall', 'Workshop', 'Academy'
    ], '', (e) => queueBuilding(e.target.value));

    content.appendChild(minWaitInput);
    content.appendChild(maxWaitInput);
    content.appendChild(phaseInput);
    content.appendChild(waitForOrderInput);
    content.appendChild(farmCoordsInput);
    content.appendChild(farmTroopSetInput);
    content.appendChild(startButton);
    content.appendChild(stopButton);
    content.appendChild(buildingSelect);
    content.appendChild(logArea);

    guiContainer.appendChild(content);
    document.body.appendChild(guiContainer);

    function dragMouseDown(e) {
        e.preventDefault();
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        let pos3 = e.clientX;
        let pos4 = e.clientY;

        function elementDrag(e) {
            e.preventDefault();
            let pos1 = pos3 - e.clientX;
            let pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            guiContainer.style.top = (guiContainer.offsetTop - pos2) + "px";
            guiContainer.style.left = (guiContainer.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function toggleMinimize() {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            minButton.innerText = 'Minimize';
        } else {
            content.style.display = 'none';
            minButton.innerText = 'Maximize';
        }
    }
}

function createInput(labelText, defaultValue, onChange) {
    const label = document.createElement('label');
    label.innerText = labelText;

    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
    input.addEventListener('input', onChange);

    const container = document.createElement('div');
    container.appendChild(label);
    container.appendChild(input);

    return container;
}

function createSelect(labelText, options, defaultValue, onChange) {
    const label = document.createElement('label');
    label.innerText = labelText;

    const select = document.createElement('select');
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        select.appendChild(opt);
    });
    select.value = defaultValue;
    select.addEventListener('change', onChange);

    const container = document.createElement('div');
    container.appendChild(label);
    container.appendChild(select);

    return container;
}

function createCheckbox(labelText, defaultChecked, onChange) {
    const label = document.createElement('label');
    label.innerText = labelText;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = defaultChecked;
    checkbox.addEventListener('change', onChange);

    const container = document.createElement('div');
    container.appendChild(label);
    container.appendChild(checkbox);

    return container;
}

function createTextArea(labelText, defaultValue, onChange) {
    const label = document.createElement('label');
    label.innerText = labelText;

    const textarea = document.createElement('textarea');
    textarea.value = defaultValue;
    textarea.addEventListener('input', onChange);

    const container = document.createElement('div');
    container.appendChild(label);
    container.appendChild(textarea);

    return container;
}

function log(message) {
    const logArea = document.getElementById('logArea');
    logArea.value += message + '\n';
    logArea.scrollTop = logArea.scrollHeight;
}

function startBot() {
    if (isBotRunning) return;
    isBotRunning = true;

    if (PHASE == "PHASE_1") {
        botInterval = setInterval(executePhase1, 10000);
    }
    else if (PHASE == "PHASE_2") {
        botInterval = setInterval(executePhase2, 10000);
    }

    log("Bot started");
}

function stopBot() {
    if (!isBotRunning) return;
    isBotRunning = false;

    clearInterval(botInterval);

    log("Bot stopped");
}

function queueBuilding(buildingName) {
    const buildingMap = {
        'Headquarters': 'main_buildlink_main',
        'Barracks': 'main_buildlink_barracks',
        'Stable': 'main_buildlink_stable',
        'First church': 'main_buildlink_church_f',
        'Smithy': 'main_buildlink_smith',
        'Rally point': 'main_buildlink_place',
        'Statue': 'main_buildlink_statue',
        'Market': 'main_buildlink_market',
        'Timber camp': 'main_buildlink_wood',
        'Clay pit': 'main_buildlink_stone',
        'Iron mine': 'main_buildlink_iron',
        'Farm': 'main_buildlink_farm',
        'Warehouse': 'main_buildlink_storage',
        'Hiding place': 'main_buildlink_hide',
        'Wall': 'main_buildlink_wall',
        'Workshop': 'main_buildlink_workshop',
        'Academy': 'main_buildlink_academy'
    };

    const buildLink = document.getElementById(buildingMap[buildingName]);
    if (buildLink) {
        buildLink.click();
        log(`Queued building: ${buildingName}`);
    } else {
        log(`Failed to queue building: ${buildingName}`);
    }
}

// Phase 1: Building
function executePhase1() {
    let currentView = getCurrentView();
    log(currentView);
    if (currentView == HEADQUARTERS_VIEW) {
        buildNextBuilding();
    }
    else if (currentView == OVERVIEW_VIEW) {
        // Open headquarters view
        document.getElementById("l_main").children[0].children[0].click();
    }
}

// Phase 2: Farm
function executePhase2() {
    let delay = Math.floor(Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME) + MIN_WAIT_TIME);

    // Process action
    let currentView = getCurrentView();
    log(currentView);
    setTimeout(function () {
        if (currentView == HEADQUARTERS_VIEW) {
            buildNextBuilding();
            document.getElementById("main_buildrow_place").children[0].children[0].click();
        }
        else if (currentView == RALLY_POINT_VIEW) {
            sendFarmAttacks();
        }
        else if (currentView == OVERVIEW_VIEW) {
            document.getElementById("l_main").children[0].children[0].click();
        }
        else if (currentView == ATTACK_CONFIRM_VIEW) {
            document.getElementById("troop_confirm_go").click();
        }
    }, delay);
}

function getCurrentView() {
    let currentUrl = window.location.href;
    if (currentUrl.endsWith('overview')) {
        return OVERVIEW_VIEW;
    }
    else if (currentUrl.endsWith('main')) {
        return HEADQUARTERS_VIEW;
    }
    else if (currentUrl.endsWith('place')) {
        return RALLY_POINT_VIEW;
    }
    else if (currentUrl.endsWith('confirm')) {
        return ATTACK_CONFIRM_VIEW;
    }
}

function buildNextBuilding() {
    let nextBuildingElement = getNextBuildingElement();
    if (nextBuildingElement !== undefined) {
        nextBuildingElement.click();
        log("Clicked on " + nextBuildingElement);
    }
}

function getNextBuildingElement() {
    let buildableBuildings = document.getElementsByClassName("btn btn-build");
    let buildingElementsQueue = getBuildingElementsQueue();
    let found;
    while (found === undefined && buildingElementsQueue.length > 0) {
        var next = buildingElementsQueue.shift();
        if (buildableBuildings.hasOwnProperty(next)) {
            let nextBuilding = document.getElementById(next);
            var isVisible = nextBuilding.offsetWidth > 0 || nextBuilding.offsetHeight > 0;
            if (isVisible) {
                found = nextBuilding;
            }
            if (WAIT_FOR_ORDER_BUILDINGS) {
                break;
            }
        }
    }
    return found;
}

function sendFarmAttacks() {
    let availableInputs = getAvailableInputs();
    if (availableInputs === undefined) {
        log("Not enough troops available");
        goToOverviewViewFromRallyPointView();
        return;
    }

    let currentlyAttackingCoordinates = getCurrentlyAttackingCoordinates();
    let choice = Math.floor(Math.random() * FARM_COORDINATES.length);

    for (let i = 0; i < FARM_COORDINATES.length; i++) {
        if (choice >= FARM_COORDINATES.length) {
            choice -= FARM_COORDINATES.length;
        }
        if (!currentlyAttackingCoordinates.includes(FARM_COORDINATES[choice])) {
            sendAttackToCoordinate(FARM_COORDINATES[choice], availableInputs);
            return;
        }
        choice++;
    }
    goToOverviewViewFromRallyPointView();
}

function goToOverviewViewFromRallyPointView() {
    document.getElementById("menu_row").children[1].children[0].click();
}

function sendAttackToCoordinate(coordinates, inputAmounts) {
    log("Sending attack to: " + coordinates);
    for (var prop in inputAmounts) {
        inputAmounts[prop].input.value = inputAmounts[prop].amount;
    }
    let coordinatesInput = document.getElementById("place_target").children[1];
    coordinatesInput.value = coordinates;
    document.getElementById("target_attack").click();
}

function getAvailableInputs() {
    let availableInputs = {};
    let farmTroopSet = farmTroopSets[FARM_TROOP_SET];

    if (farmTroopSet.spear !== undefined) {
        let currentInput = document.getElementById("unit_input_spear");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.spear > currentInputAvailableCount) {
            return;
        }
        availableInputs.spear = { "input": currentInput, "amount": farmTroopSet.spear };
    }
    if (farmTroopSet.sword !== undefined) {
        let currentInput = document.getElementById("unit_input_sword");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.sword > currentInputAvailableCount) {
            return;
        }
        availableInputs.sword = { "input": currentInput, "amount": farmTroopSet.sword };
    }
    if (farmTroopSet.axe !== undefined) {
        let currentInput = document.getElementById("unit_input_axe");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.axe > currentInputAvailableCount) {
            return;
        }
        availableInputs.axe = { "input": currentInput, "amount": farmTroopSet.axe };
    }
    if (farmTroopSet.lc !== undefined) {
        let currentInput = document.getElementById("unit_input_light");
        let currentInputAvailableCount = currentInput.getAttribute("data-all-count");
        if (farmTroopSet.lc > currentInputAvailableCount) {
            return;
        }
        availableInputs.lc = { "input": currentInput, "amount": farmTroopSet.lc };
    }
    return availableInputs;
}

function getCurrentlyAttackingCoordinates() {
    let currentlyAttackingElements = document.getElementsByClassName("quickedit-label");
    let currentlyAttackingCoordinates = [];
    for (var i = 0, len = currentlyAttackingElements.length; i < len; i++) {
        let coordinatesString = currentlyAttackingElements[i].innerHTML.split(")")[0].split("(")[1];
        currentlyAttackingCoordinates.push(coordinatesString);
    }
    return currentlyAttackingCoordinates;
}

function getBuildingElementsQueue() {
    var queue = [];
    queue.push("main_buildlink_stone_1");
    queue.push("main_buildlink_wood_1");
    queue.push("main_buildlink_iron_1");
    queue.push("main_buildlink_stone_2");
    queue.push("main_buildlink_wood_2");
    queue.push("main_buildlink_stone_3");
    queue.push("main_buildlink_wood_3");
    queue.push("main_buildlink_iron_2");
    queue.push("main_buildlink_stone_4");
    queue.push("main_buildlink_stone_5");
    queue.push("main_buildlink_wood_4");
    queue.push("main_buildlink_wood_5");
    queue.push("main_buildlink_wood_6");
    queue.push("main_buildlink_wood_7");
    queue.push("main_buildlink_main_2");
    queue.push("main_buildlink_main_3");
    queue.push("main_buildlink_barracks_1");
    queue.push("main_buildlink_wood_8");
    queue.push("main_buildlink_storage_2");
    queue.push("main_buildlink_market_1");
    queue.push("main_buildlink_wood_9");
    queue.push("main_buildlink_storage_3");
    queue.push("main_buildlink_wood_10");
    queue.push("main_buildlink_stone_6");
    queue.push("main_buildlink_market_2");
    queue.push("main_buildlink_stone_7");
    queue.push("main_buildlink_iron_3");
    queue.push("main_buildlink_main_4");
    queue.push("main_buildlink_main_5");
    queue.push("main_buildlink_smith_1");
    queue.push("main_buildlink_smith_2");
    queue.push("main_buildlink_iron_4");
    queue.push("main_buildlink_iron_5");
    queue.push("main_buildlink_market_3");
    queue.push("main_buildlink_iron_6");
    queue.push("main_buildlink_iron_7");
    queue.push("main_buildlink_farm_2");
    queue.push("main_buildlink_farm_3");
    queue.push("main_buildlink_storage_3");
    queue.push("main_buildlink_farm_4");
    queue.push("main_buildlink_storage_4");
    queue.push("main_buildlink_barracks_2");
    queue.push("main_buildlink_barracks_3");
    queue.push("main_buildlink_barracks_4");
    queue.push("main_buildlink_barracks_5");
    queue.push("main_buildlink_main_6");
    queue.push("main_buildlink_main_7");
    queue.push("main_buildlink_farm_5");
    queue.push("main_buildlink_storage_5");
    queue.push("main_buildlink_smith_3");
    queue.push("main_buildlink_main_8");
    queue.push("main_buildlink_main_9");
    queue.push("main_buildlink_main_10");
    queue.push("main_buildlink_smith_4");
    queue.push("main_buildlink_farm_6");
    queue.push("main_buildlink_storage_6");
    queue.push("main_buildlink_smith_5");
    queue.push("main_buildlink_iron_8");
    queue.push("main_buildlink_iron_9");
    queue.push("main_buildlink_iron_10");
    queue.push("main_buildlink_stable_1");
    queue.push("main_buildlink_stable_2");
    queue.push("main_buildlink_stable_3");
    queue.push("main_buildlink_wall_1");
    queue.push("main_buildlink_stone_8");
    queue.push("main_buildlink_stone_9");
    queue.push("main_buildlink_storage_7");
    queue.push("main_buildlink_farm_7");
    queue.push("main_buildlink_market_4");
    queue.push("main_buildlink_market_5");
    queue.push("main_buildlink_barracks_6");
    queue.push("main_buildlink_barracks_7");
    queue.push("main_buildlink_iron_11");
    queue.push("main_buildlink_iron_12");
    queue.push("main_buildlink_iron_13");
    queue.push("main_buildlink_farm_8");
    queue.push("main_buildlink_farm_9");
    queue.push("main_buildlink_iron_14");
    queue.push("main_buildlink_iron_15");
    queue.push("main_buildlink_stone_10");
    queue.push("main_buildlink_stone_11");
    queue.push("main_buildlink_storage_8");
    queue.push("main_buildlink_farm_10");
    queue.push("main_buildlink_wood_11");
    queue.push("main_buildlink_wood_12");
    queue.push("main_buildlink_wood_13");
    queue.push("main_buildlink_main_11");
    queue.push("main_buildlink_main_12");
    queue.push("main_buildlink_farm_11");
    queue.push("main_buildlink_farm_12");
    queue.push("main_buildlink_farm_13");
    queue.push("main_buildlink_storage_9");
    queue.push("main_buildlink_iron_16");
    queue.push("main_buildlink_stone_12");
    queue.push("main_buildlink_stone_13");
    queue.push("main_buildlink_stone_14");
    queue.push("main_buildlink_wood_14");
    queue.push("main_buildlink_wood_15");
    queue.push("main_buildlink_stone_15");
    queue.push("main_buildlink_wall_2");
    queue.push("main_buildlink_wall_3");
    queue.push("main_buildlink_wall_4");
    queue.push("main_buildlink_wall_5");
    queue.push("main_buildlink_wall_6");
    queue.push("main_buildlink_wall_7");
    queue.push("main_buildlink_wall_8");
    queue.push("main_buildlink_storage_10");
    queue.push("main_buildlink_wall_9");
    queue.push("main_buildlink_wall_10");
    queue.push("main_buildlink_stable_4");
    queue.push("main_buildlink_stable_5");
    queue.push("main_buildlink_main_13");
    queue.push("main_buildlink_main_14");
    queue.push("main_buildlink_main_15");
    queue.push("main_buildlink_wood_16");
    queue.push("main_buildlink_stone_16");
    queue.push("main_buildlink_storage_11");
    queue.push("main_buildlink_storage_12");
    queue.push("main_buildlink_storage_13");
    queue.push("main_buildlink_storage_14");
    queue.push("main_buildlink_farm_14");
    queue.push("main_buildlink_farm_15");
    queue.push("main_buildlink_farm_16");
    queue.push("main_buildlink_wood_17");
    queue.push("main_buildlink_stone_17");
    queue.push("main_buildlink_iron_17");
    queue.push("main_buildlink_storage_15");
    queue.push("main_buildlink_wood_18");
    queue.push("main_buildlink_stone_18");
    queue.push("main_buildlink_iron_18");
    queue.push("main_buildlink_storage_16");
    queue.push("main_buildlink_storage_17");
    queue.push("main_buildlink_storage_18");
    queue.push("main_buildlink_main_16");
    queue.push("main_buildlink_main_17");
    queue.push("main_buildlink_main_18");
    queue.push("main_buildlink_main_19");
    queue.push("main_buildlink_main_20");
    queue.push("main_buildlink_farm_17");
    queue.push("main_buildlink_farm_18");
    queue.push("main_buildlink_farm_19");
    queue.push("main_buildlink_farm_20");
    queue.push("main_buildlink_wood_19");
    queue.push("main_buildlink_wood_20");
    queue.push("main_buildlink_stone_19");
    queue.push("main_buildlink_stone_20");
    queue.push("main_buildlink_iron_19");
    queue.push("main_buildlink_iron_20");
    queue.push("main_buildlink_stable_6");
    queue.push("main_buildlink_stable_7");
    queue.push("main_buildlink_stable_8");
    queue.push("main_buildlink_stable_9");
    queue.push("main_buildlink_stable_10");

    return queue;
}
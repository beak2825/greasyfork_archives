// ==UserScript==
// @name         MWI calculator automate thing
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  dont install this
// @author       bingbOng
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @grant        none
// @license      i dont care
// @downloadURL https://update.greasyfork.org/scripts/531504/MWI%20calculator%20automate%20thing.user.js
// @updateURL https://update.greasyfork.org/scripts/531504/MWI%20calculator%20automate%20thing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // More robust page loading detection
    function waitForPageLoad() {
        // Check if a key element exists as an indicator that the page is ready
        if (document.getElementById('selectAbility_1')) {
            console.log("MWI Combat Simulator fully loaded, initializing ability tester...");
            setTimeout(() => {
                initializeAbilityTester();
            }, 1500);
        } else {
            console.log("Waiting for MWI Combat Simulator to fully load...");
            setTimeout(waitForPageLoad, 500);
        }
    }

    // Start waiting for page load immediately
    waitForPageLoad();

    function initializeAbilityTester() {
        // Create UI container
        const container = document.createElement('div');
        const style = document.createElement('style');
        style.textContent = `
            #simulationResultsTable tr,
            #simulationResultsTable td,
            #simulationResultsTableId {
                color: white !important;
            }
            #simulationResultsTableId th {
                color: white !important;
                background-color: #333 !important;
                cursor: pointer;
            }
            #simulationResultsTableId th:hover {
                background-color: #444 !important;
            }
            .sort-asc::after {
                content: ' ▲';
            }
            .sort-desc::after {
                content: ' ▼';
            }
        `;
        document.head.appendChild(style);
        container.innerHTML = `
            <div class="container">
                <div class="row">
                    <!-- Ability selection and simulation controls -->
                    <div class="col">
                        <h3>Remember to click start simulation first and check the settings, it will use those </h3>

                        <!-- Copy abilities button -->
                        <button id="copyCurrentAbilitiesButton" class="btn btn-primary mb-3">Copy Current Abilities</button>

                        <!-- Ability Selection Rows -->
                        <div id="abilityRows">
                            <!-- Row 1 -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <select id="selectAbility_10" class="form-select">
                                        <option value="">Empty</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="number" id="inputAbilityLevel_10" class="form-control" value="1" min="1"
                                        max="400" required />
                                </div>
                            </div>
                            <!-- Row 2 -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <select id="selectAbility_11" class="form-select">
                                        <option value="">Empty</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="number" id="inputAbilityLevel_11" class="form-control" value="1" min="1"
                                        max="400" required />
                                </div>
                            </div>

                            <!-- Row 3 -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <select id="selectAbility_12" class="form-select">
                                        <option value="">Empty</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="number" id="inputAbilityLevel_12" class="form-control" value="1" min="1"
                                        max="400" required />
                                </div>
                            </div>

                            <!-- Row 4 -->
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <select id="selectAbility_13" class="form-select">
                                        <option value="">Empty</option>
                                    </select>
                                </div>
                                <div class="col">
                                    <input type="number" id="inputAbilityLevel_13" class="form-control" value="1" min="1"
                                        max="400" required />
                                </div>
                            </div>
                        </div>

                        <!-- Row 5 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <select id="selectAbility_14" class="form-select">
                                    <option value="">Empty</option>
                                </select>
                            </div>
                            <div class="col">
                                <input type="number" id="inputAbilityLevel_14" class="form-control" value="1" min="1"
                                    max="400" required />
                            </div>
                        </div>

                         <!-- Row 6 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <select id="selectAbility_15" class="form-select">
                                    <option value="">Empty</option>
                                </select>
                            </div>
                            <div class="col">
                                <input type="number" id="inputAbilityLevel_15" class="form-control" value="1" min="1"
                                    max="400" required />
                            </div>
                        </div>

                        <!-- Row 7 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <select id="selectAbility_16" class="form-select">
                                    <option value="">Empty</option>
                                </select>
                            </div>
                            <div class="col">
                                <input type="number" id="inputAbilityLevel_16" class="form-control" value="1" min="1"
                                    max="400" required />
                            </div>
                        </div>

                        <!-- Row 8 -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <select id="selectAbility_17" class="form-select">
                                    <option value="">Empty</option>
                                </select>
                            </div>
                            <div class="col">
                                <input type="number" id="inputAbilityLevel_17" class="form-control" value="1" min="1"
                                    max="400" required />
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col">
                                <select id="selectCombinationStrategy" class="form-select">
                                    <option value="sequential"selected>Sequential</option>
                                    <option value="random" >Random</option>
                                </select>
                            </div>
                        </div>

                        <button id="startAutomationButton" class="btn btn-secondary">Start Automation</button>
                        <button id="stopAutomationButton" class="btn btn-secondary" disabled>Stop Automation</button>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <!-- Simulation results table -->
                    <div class="col">
                        <h3>Simulation Results </h3>
                        <table class="table" id="simulationResultsTableId">
                            <thead>
                                <tr>
                                    <th>Ability 1</th>
                                    <th>Ability 2</th>
                                    <th>Ability 3</th>
                                    <th>Ability 4</th>
                                    <th>Encounters/h</th>
                                    <th>Deaths/h</th>
                                    <th>Total XP/h</th>
                                    <th>Stamina XP/h</th>
                                    <th>Intelligence XP/h</th>
                                    <th>Attack XP/h</th>
                                    <th>Magic XP/h</th>
                                    <th>Ranged XP/h</th>
                                    <th>Power XP/h</th>
                                    <th>Defense XP/h</th>
                                </tr>
                            </thead>
                            <tbody id="simulationResultsTable">
                                <!-- Results will be added here dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Insert UI at the bottom of the page, before the closing </body> tag
        document.body.appendChild(container);

        // Add event listeners for table sorting
        const tableHeaders = document.querySelectorAll('#simulationResultsTableId th');
        tableHeaders.forEach((header, index) => {
            header.addEventListener('click', () => {
                sortTable(index);
            });
        });

        // Extract all ability options from the original selects
        const abilities = extractAbilities();
        populateAbilitySelects(abilities);

        // Set up event listeners
        document.getElementById('startAutomationButton').addEventListener('click', startAutomation);
        document.getElementById('stopAutomationButton').addEventListener('click', stopAutomation);
        document.getElementById('copyCurrentAbilitiesButton').addEventListener('click', copyCurrentAbilities);
    }

    function copyCurrentAbilities() {
        // Map from original selects to our custom selects
        const mapping = [
            { from: 'selectAbility_1', to: 'selectAbility_10', levelFrom: 'inputAbilityLevel_1', levelTo: 'inputAbilityLevel_10' },
            { from: 'selectAbility_2', to: 'selectAbility_11', levelFrom: 'inputAbilityLevel_2', levelTo: 'inputAbilityLevel_11' },
            { from: 'selectAbility_3', to: 'selectAbility_12', levelFrom: 'inputAbilityLevel_3', levelTo: 'inputAbilityLevel_12' },
            { from: 'selectAbility_4', to: 'selectAbility_13', levelFrom: 'inputAbilityLevel_4', levelTo: 'inputAbilityLevel_13' },
            { from: 'selectAbility_5', to: 'selectAbility_14', levelFrom: 'inputAbilityLevel_5', levelTo: 'inputAbilityLevel_14' }
        ];

        // Copy each ability and its level
        mapping.forEach(map => {
            const fromSelect = document.getElementById(map.from);
            const toSelect = document.getElementById(map.to);
            const fromLevel = document.getElementById(map.levelFrom);
            const toLevel = document.getElementById(map.levelTo);

            if (fromSelect && toSelect && fromLevel && toLevel) {
                // Copy the selected value
                const selectedValue = fromSelect.value;
                setSelectOption(toSelect, selectedValue);

                // Copy the level
                toLevel.value = fromLevel.value;

                // Trigger change events
                const event = new Event('change', { bubbles: true });
                toSelect.dispatchEvent(event);
                toLevel.dispatchEvent(event);
            }
        });

    }

    function sortTable(columnIndex) {
        const table = document.getElementById('simulationResultsTableId');
        const tbody = document.getElementById('simulationResultsTable');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headers = table.querySelectorAll('th');

        // Determine sort direction
        const currentHeader = headers[columnIndex];
        const isAscending = !currentHeader.classList.contains('sort-asc');

        // Remove sort indicators from all headers
        headers.forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });

        // Add sort indicator to current header
        currentHeader.classList.add(isAscending ? 'sort-asc' : 'sort-desc');

        // Sort the rows
        rows.sort((rowA, rowB) => {
            const cellA = rowA.querySelectorAll('td')[columnIndex]?.textContent.trim() || '';
            const cellB = rowB.querySelectorAll('td')[columnIndex]?.textContent.trim() || '';

            // Handle numeric comparisons
            const numA = parseFloat(cellA.replace(/,/g, ''));
            const numB = parseFloat(cellB.replace(/,/g, ''));

            if (!isNaN(numA) && !isNaN(numB)) {
                return isAscending ? numA - numB : numB - numA;
            }

            // Default to string comparison
            return isAscending
                ? cellA.localeCompare(cellB)
                : cellB.localeCompare(cellA);
        });

        // Reattach rows in the new order
        rows.forEach(row => {
            tbody.appendChild(row);
        });
    }

    function extractAbilities() {
        const abilities = [];
        // Get the first ability select available in the original UI
        const originalSelect = document.getElementById('selectAbility_1');

        if (originalSelect) {
            // Extract all option values and texts
            Array.from(originalSelect.options).forEach(option => {
                if (option.value && option.text) {
                    abilities.push({
                        value: option.value,
                        text: option.text
                    });
                }
            });
        }

        return abilities;
    }

    function populateAbilitySelects(abilities) {
        // Get all the custom select elements
        const selectIds = [
            'selectAbility_10', 'selectAbility_11', 'selectAbility_12', 'selectAbility_13',
            'selectAbility_14', 'selectAbility_15', 'selectAbility_16', 'selectAbility_17'
        ];

        selectIds.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                // Keep the first option (Empty)
                const firstOption = select.options[0];
                select.innerHTML = '';
                select.appendChild(firstOption);

                // Add all abilities
                abilities.forEach(ability => {
                    const option = document.createElement('option');
                    option.value = ability.value;
                    option.textContent = ability.text;
                    select.appendChild(option);
                });
            }
        });
    }

    let isRunning = false;
    let simulationQueue = [];
    let currentSimulationIndex = 0;

    function startAutomation() {
        if (isRunning) return;

        // Disable start button, enable stop button
        document.getElementById('startAutomationButton').disabled = true;
        document.getElementById('stopAutomationButton').disabled = false;

        // Clear previous results
        document.getElementById('simulationResultsTable').innerHTML = '';

        // Get strategy
        const strategy = document.getElementById('selectCombinationStrategy').value;

        // Get selected abilities
        const selectedAbilities = [];
        for (let i = 10; i <= 17; i++) {
            const select = document.getElementById(`selectAbility_${i}`);
            const level = document.getElementById(`inputAbilityLevel_${i}`).value;

            if (select.value) {
                selectedAbilities.push({
                    id: i,
                    value: select.value,
                    text: select.options[select.selectedIndex].text,
                    level: level
                });
            }
        }

        // Generate simulation combinations
        simulationQueue = generateCombinations(selectedAbilities, strategy);

        // Start the automation
        isRunning = true;
        currentSimulationIndex = 0;
        runNextSimulation();
    }

    function stopAutomation() {
        isRunning = false;
        document.getElementById('startAutomationButton').disabled = false;
        document.getElementById('stopAutomationButton').disabled = true;
    }

    function generateCombinations(abilities, strategy) {
        const combinations = [];
        
        if (abilities.length === 0) return combinations;
    
        if (strategy === 'sequential') {
            // Use all possible permutations of 4 abilities (if there are at least 4)
            if (abilities.length >= 4) {
                // Helper function to generate permutations
                function generatePermutations(items, currentPerm = []) {
                    if (currentPerm.length === 4) {
                        combinations.push([...currentPerm]);
                        return;
                    }
                    
                    for (let i = 0; i < items.length; i++) {
                        // Skip if already used in current permutation
                        if (currentPerm.includes(items[i])) continue;
                        
                        currentPerm.push(items[i]);
                        generatePermutations(items, currentPerm);
                        currentPerm.pop();
                    }
                }
                
                // Get all abilities to use in permutations (max 4)
                const abilitiesToUse = abilities.slice(0, 4);
                generatePermutations(abilitiesToUse);
            } else {
                // If we have fewer than 4 abilities, just use what we have
                combinations.push(abilities);
            }
        } else {
            // Random strategy - generate 20 random combinations
            const numCombinations = 20;
            const uniquePermutations = new Set();
            
            for (let i = 0; i < numCombinations; i++) {
                // Shuffle abilities and take first 4 (or fewer if we don't have 4)
                const shuffled = [...abilities].sort(() => 0.5 - Math.random());
                const numToUse = Math.min(4, shuffled.length);
                const perm = shuffled.slice(0, numToUse);
                
                // Create a unique key for this permutation
                const permKey = perm.map(a => a.value).join('|');
                
                // Only add if we haven't seen this exact permutation
                if (!uniquePermutations.has(permKey)) {
                    uniquePermutations.add(permKey);
                    combinations.push(perm);
                } else {
                    // Try again
                    i--;
                }
            }
        }
    
        return combinations;
    }function generateCombinations(abilities, strategy) {
        const combinations = [];
        
        if (abilities.length === 0) return combinations;
    
        if (strategy === 'sequential') {
            // Use all possible permutations of 4 abilities (if there are at least 4)
            if (abilities.length >= 4) {
                // Helper function to generate permutations
                function generatePermutations(items, currentPerm = []) {
                    if (currentPerm.length === 4) {
                        combinations.push([...currentPerm]);
                        return;
                    }
                    
                    for (let i = 0; i < items.length; i++) {
                        // Skip if already used in current permutation
                        if (currentPerm.includes(items[i])) continue;
                        
                        currentPerm.push(items[i]);
                        generatePermutations(items, currentPerm);
                        currentPerm.pop();
                    }
                }
                
                // Get all abilities to use in permutations (max 4)
                const abilitiesToUse = abilities.slice(0, 4);
                generatePermutations(abilitiesToUse);
            } else {
                // If we have fewer than 4 abilities, just use what we have
                combinations.push(abilities);
            }
        } else {
            // Random strategy - generate 20 random combinations
            const numCombinations = 20;
            const uniquePermutations = new Set();
            
            for (let i = 0; i < numCombinations; i++) {
                // Shuffle abilities and take first 4 (or fewer if we don't have 4)
                const shuffled = [...abilities].sort(() => 0.5 - Math.random());
                const numToUse = Math.min(4, shuffled.length);
                const perm = shuffled.slice(0, numToUse);
                
                // Create a unique key for this permutation
                const permKey = perm.map(a => a.value).join('|');
                
                // Only add if we haven't seen this exact permutation
                if (!uniquePermutations.has(permKey)) {
                    uniquePermutations.add(permKey);
                    combinations.push(perm);
                } else {
                    // Try again
                    i--;
                }
            }
        }
    
        return combinations;
    }

    function runNextSimulation() {
        if (!isRunning || currentSimulationIndex >= simulationQueue.length) {
            // Automation complete
            stopAutomation();
            return;
        }

        const combination = simulationQueue[currentSimulationIndex];
        currentSimulationIndex++;

        // Apply the ability combination to the original UI
        resetOriginalAbilitySelects();

        // Start from 1 instead of 0 to target selectAbility_1 through selectAbility_4
        for (let i = 0; i < Math.min(combination.length, 5); i++) {
            const ability = combination[i];
            // Use i+1 to target the correct elements (1-based indexing)
            const originalSelect = document.getElementById(`selectAbility_${i+1}`);
            const originalLevel = document.getElementById(`inputAbilityLevel_${i+1}`);

            if (originalSelect && originalLevel) {
                // Set the selected ability
                setSelectOption(originalSelect, ability.value);
                originalLevel.value = ability.level;

                // Trigger change event
                const event = new Event('change', { bubbles: true });
                originalSelect.dispatchEvent(event);
                originalLevel.dispatchEvent(event);
            }
        }

        // Start simulation
        const startSimButton = document.getElementById('buttonSimulationSetup');
        if (startSimButton) {
            startSimButton.click();

            // Open simulation modal with a delay to ensure it's loaded
            setTimeout(() => {
                const startActualSimButton = document.getElementById('buttonStartSimulation');
                if (startActualSimButton) {
                    // Track simulation progress by watching the progress bar
                    const waitForSimulationComplete = () => {
                        const progressBar = document.querySelector('#simulationProgressBar');

                        if (progressBar) {
                            const progressText = progressBar.textContent || '';
                            const progressWidth = progressBar.style.width || '';

                            // If we see 100%, the simulation is complete
                            if (progressText.includes('100%') || progressWidth === '100%') {
                                // Wait a moment for results to fully populate
                                setTimeout(() => {
                                    readSimulationResults(combination);

                                    // Run the next simulation after a delay
                                    setTimeout(() => {
                                        runNextSimulation();
                                    }, 500);
                                }, 300);
                                return;
                            }
                        }

                        // Check again in a short while
                        setTimeout(waitForSimulationComplete, 100);
                    };

                    // Start the simulation and begin monitoring
                    startActualSimButton.click();

                    // Start checking for simulation completion
                    setTimeout(waitForSimulationComplete, 300);
                } else {
                    console.error('Start simulation button not found');
                    runNextSimulation();
                }
            }, 500);
        } else {
            console.error('Simulation setup button not found');
            runNextSimulation();
        }
    }

    function readSimulationResults(combination) {
        // Read results from simulation
        const deathsElement = document.getElementById('simulationResultPlayerDeaths');
        const xpElement = document.getElementById('simulationResultExperienceGain');

        let deaths = 'N/A';
        let encounters = 'N/A';

        // Initialize XP values for different skill types
        let xpTotal = '0';
        let xpStamina = '0';
        let xpIntelligence = '0';
        let xpAttack = '0';
        let xpMagic = '0';
        let xpRanged = '0';
        let xpPower = '0';
        let xpDefense = '0';

        // Extract encounters from the kills element - updated extraction method
        const killsElement = document.getElementById('simulationResultKills');
        if (killsElement) {
            // Find the div with the encounters value
            const encountersDiv = killsElement.querySelector('.col-md-6.text-end');
            if (encountersDiv) {
                encounters = encountersDiv.textContent.trim();
            }
        }

        // Extract deaths value - updated extraction method
        if (deathsElement) {
            // Find the div with the deaths value
            const deathsDiv = deathsElement.querySelector('.col-md-6.text-end');
            if (deathsDiv) {
                deaths = deathsDiv.textContent.trim();
            } else {
                // Fallback to the old method
                deaths = deathsElement.textContent.trim();
                // Remove 'player' prefix if it exists
                deaths = deaths.replace(/^player/i, '').trim();
            }
        }

        // Enhanced XP extraction from structured divs
        if (xpElement) {
            // Get all rows in the XP element
            const xpRows = xpElement.querySelectorAll('.row');

            // Process each row to extract the XP values
            xpRows.forEach(row => {
                const label = row.querySelector('.col-md-6:not(.text-end)');
                const value = row.querySelector('.col-md-6.text-end');

                if (label && value) {
                    const labelText = label.textContent.trim();
                    const valueText = value.textContent.trim();

                    // Map each label to the corresponding variable
                    if (labelText.includes('Total')) {
                        xpTotal = valueText;
                    } else if (labelText.includes('Stamina')) {
                        xpStamina = valueText;
                    } else if (labelText.includes('Intelligence')) {
                        xpIntelligence = valueText;
                    } else if (labelText.includes('Attack')) {
                        xpAttack = valueText;
                    } else if (labelText.includes('Magic')) {
                        xpMagic = valueText;
                    } else if (labelText.includes('Ranged')) {
                        xpRanged = valueText;
                    } else if (labelText.includes('Power')) {
                        xpPower = valueText;
                    } else if (labelText.includes('Defense')) {
                        xpDefense = valueText;
                    }
                }
            });
        }

        // Add to results table
        const resultsTable = document.getElementById('simulationResultsTable');
        if (resultsTable) {
            const row = document.createElement('tr');

            // Set text color to white for the entire row
            row.style.color = 'white';

            // Add ability cells (only 4 now)
            for (let i = 0; i < 4; i++) {
                const cell = document.createElement('td');
                cell.style.color = 'white'; // Ensure cell text is white
                if (i < combination.length) {
                    cell.textContent = combination[i].text;
                } else {
                    cell.textContent = '-';
                }
                row.appendChild(cell);
            }

            // Add encounters cell
            const encountersCell = document.createElement('td');
            encountersCell.style.color = 'white'; // Ensure cell text is white
            encountersCell.textContent = encounters;
            row.appendChild(encountersCell);

            // Add deaths cell
            const deathsCell = document.createElement('td');
            deathsCell.style.color = 'white'; // Ensure cell text is white
            deathsCell.textContent = deaths;
            row.appendChild(deathsCell);

            // Add total XP cell
            const xpTotalCell = document.createElement('td');
            xpTotalCell.style.color = 'white'; // Ensure cell text is white
            xpTotalCell.textContent = xpTotal;
            row.appendChild(xpTotalCell);

            // Add individual XP cells for each skill
            const xpStaminaCell = document.createElement('td');
            xpStaminaCell.style.color = 'white'; // Ensure cell text is white
            xpStaminaCell.textContent = xpStamina;
            row.appendChild(xpStaminaCell);

            const xpIntelligenceCell = document.createElement('td');
            xpIntelligenceCell.style.color = 'white'; // Ensure cell text is white
            xpIntelligenceCell.textContent = xpIntelligence;
            row.appendChild(xpIntelligenceCell);

            const xpAttackCell = document.createElement('td');
            xpAttackCell.style.color = 'white'; // Ensure cell text is white
            xpAttackCell.textContent = xpAttack;
            row.appendChild(xpAttackCell);

            const xpMagicCell = document.createElement('td');
            xpMagicCell.style.color = 'white'; // Ensure cell text is white
            xpMagicCell.textContent = xpMagic;
            row.appendChild(xpMagicCell);

            const xpRangedCell = document.createElement('td');
            xpRangedCell.style.color = 'white'; // Ensure cell text is white
            xpRangedCell.textContent = xpRanged;
            row.appendChild(xpRangedCell);

            const xpPowerCell = document.createElement('td');
            xpPowerCell.style.color = 'white'; // Ensure cell text is white
            xpPowerCell.textContent = xpPower;
            row.appendChild(xpPowerCell);

            const xpDefenseCell = document.createElement('td');
            xpDefenseCell.style.color = 'white'; // Ensure cell text is white
            xpDefenseCell.textContent = xpDefense;
            row.appendChild(xpDefenseCell);

            resultsTable.appendChild(row);
        }
    }


    function resetOriginalAbilitySelects() {
        // Clear all ability selections (using 1-based indexing)
        for (let i = 1; i <= 5; i++) {
            const select = document.getElementById(`selectAbility_${i}`);
            const level = document.getElementById(`inputAbilityLevel_${i}`);

            if (select) {
                select.selectedIndex = 0;

                // Trigger change event
                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
            }

            if (level) {
                level.value = 1;
            }
        }
    }

    function setSelectOption(selectElement, value) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === value) {
                selectElement.selectedIndex = i;
                return true;
            }
        }
        return false;
    }
})();
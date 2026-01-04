// ==UserScript==
// @name         Tribal Wars Auto Builder with UI
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Automatically builds buildings with configurable settings
// @author       ricardofauch
// @match        https://*.die-staemme.de/game.php?village=*&screen=main*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514141/Tribal%20Wars%20Auto%20Builder%20with%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/514141/Tribal%20Wars%20Auto%20Builder%20with%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CHECK_INTERVAL = 5 * 61 * 1000; // 5 minutes in milliseconds
    const WAIT_FOR_HIGHER_PRIORITY = 10 * 60; // Wait up to 10 minutes for higher priority building
    const DEBUG = true;
    const STORAGE_KEY = 'tribalWarsBuilderConfig';

    // Extract available buildings from the table
function getAvailableBuildings() {
    debugLog('Starting getAvailableBuildings function');
    const buildings = [];
    const buildingRows = document.querySelectorAll('#buildings tbody tr[id^="main_buildrow_"]');
    debugLog(`Found ${buildingRows.length} building rows`);

    buildingRows.forEach((row, index) => {
        debugLog(`Processing row ${index + 1}:`, {
            rowId: row.id,
            rowHtml: row.innerHTML.substring(0, 100) + '...'
        });

        const buildingCell = row.querySelector('td:first-child');
        if (!buildingCell) {
            debugLog(`No building cell found in row ${index + 1}`);
            return;
        }

        const buildingId = row.id.replace('main_buildrow_', '');
        if (!buildingId) {
            debugLog(`Could not extract building ID from row ${index + 1}`);
            return;
        }

        // Get the name from the second anchor tag's text
        const links = buildingCell.querySelectorAll('a');
        const nameLink = links[1]; // Second link contains the name
        if (!nameLink) {
            debugLog(`No name link found in building cell for row ${index + 1}`);
            return;
        }

        // Skip if the building is fully upgraded
        const inactiveCell = row.querySelector('td.inactive');
        if (inactiveCell && inactiveCell.textContent.includes('vollständig ausgebaut')) {
            debugLog(`Skipping fully upgraded building: ${buildingId}`);
            return;
        }

        // Get current level
        const levelSpan = buildingCell.querySelector('span[style="font-size: 0.9em"]');
        const currentLevel = levelSpan ? levelSpan.textContent.trim() : 'unknown';

        const buildingName = nameLink.textContent.trim();

        debugLog(`Found valid building:`, {
            id: buildingId,
            name: buildingName,
            level: currentLevel,
            element: nameLink.outerHTML
        });

        buildings.push({
            id: buildingId,
            name: buildingName,
            currentLevel: currentLevel
        });
    });

    debugLog('Completed getAvailableBuildings. Found buildings:', buildings);
    return buildings;
}

    // Load saved configuration
    function loadConfig() {
        const defaultConfig = {
            enabledBuildings: [],
            useCostReduction: true,
            buildingPriority: []
        };

        try {
            const savedConfig = localStorage.getItem(STORAGE_KEY);
            return savedConfig ? JSON.parse(savedConfig) : defaultConfig;
        } catch (error) {
            debugLog('Error loading config:', error);
            return defaultConfig;
        }
    }

    // Save configuration
    function saveConfig(config) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            debugLog('Config saved:', config);
        } catch (error) {
            debugLog('Error saving config:', error);
        }
    }

    // Create UI
    function createUI() {
        debugLog('Starting UI creation');
        const config = loadConfig();
        const buildings = getAvailableBuildings();
        debugLog('Initial config:', config);
        debugLog('Available buildings:', buildings);

        // Main container
        const uiContainer = document.createElement('div');
        uiContainer.style.cssText = 'background: #f4e4bc; padding: 15px; margin: 10px 0; border: 1px solid #603000; font-size: 12px;';

        // Title Section
        const titleSection = document.createElement('div');
        titleSection.style.marginBottom = '20px';

        const title = document.createElement('h3');
        title.textContent = 'Auto Builder Settings';
        title.style.cssText = 'margin: 0 0 5px 0; font-size: 14px; font-weight: bold;';
        titleSection.appendChild(title);

        const subtitle = document.createElement('div');
        subtitle.textContent = 'Configure building sequence and automation settings';
        subtitle.style.cssText = 'color: #666; font-style: italic;';
        titleSection.appendChild(subtitle);

        uiContainer.appendChild(titleSection);

        // Settings Section
        const settingsSection = document.createElement('div');
        settingsSection.style.cssText = 'background: #fff3d9; padding: 10px; border: 1px solid #c1a264; margin-bottom: 15px;';

        // Cost Reduction Setting
        const costReductionDiv = document.createElement('div');
        costReductionDiv.style.marginBottom = '10px';

        const costReductionCheckbox = document.createElement('input');
        costReductionCheckbox.type = 'checkbox';
        costReductionCheckbox.id = 'autoBuildCostReduction';
        costReductionCheckbox.checked = config.useCostReduction !== false;

        const costReductionLabel = document.createElement('label');
        costReductionLabel.htmlFor = 'autoBuildCostReduction';
        costReductionLabel.textContent = ' Use -20% cost reduction when available';
        costReductionLabel.style.cursor = 'pointer';

        costReductionDiv.appendChild(costReductionCheckbox);
        costReductionDiv.appendChild(costReductionLabel);
        settingsSection.appendChild(costReductionDiv);

        // Long Build Reduction Settings
        const longBuildDiv = document.createElement('div');
        longBuildDiv.style.marginBottom = '5px';

        const longBuildCheckbox = document.createElement('input');
        longBuildCheckbox.type = 'checkbox';
        longBuildCheckbox.id = 'autoBuildLongReduction';
        longBuildCheckbox.checked = config.useLongBuildReduction !== false;

        const longBuildLabel = document.createElement('label');
        longBuildLabel.htmlFor = 'autoBuildLongReduction';
        longBuildLabel.textContent = ' Auto-reduce builds longer than ';
        longBuildLabel.style.cursor = 'pointer';

        const longBuildThreshold = document.createElement('input');
        longBuildThreshold.type = 'number';
        longBuildThreshold.min = '0.5';
        longBuildThreshold.step = '0.5';
        longBuildThreshold.value = config.longBuildThreshold || 2;
        longBuildThreshold.style.cssText = 'width: 60px; padding: 2px; margin: 0 5px; background-color: #fff; border: 1px solid #c1a264;';

        const hoursLabel = document.createElement('span');
        hoursLabel.textContent = ' hours';

        longBuildDiv.appendChild(longBuildCheckbox);
        longBuildDiv.appendChild(longBuildLabel);
        longBuildDiv.appendChild(longBuildThreshold);
        longBuildDiv.appendChild(hoursLabel);

        settingsSection.appendChild(longBuildDiv);
        uiContainer.appendChild(settingsSection);

        // Building Sequence Section
        const sequenceSection = document.createElement('div');

        // Sequence Header
        const sequenceHeader = document.createElement('div');
        sequenceHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

        const sequenceTitle = document.createElement('div');
        sequenceTitle.textContent = 'Building Sequence';
        sequenceTitle.style.cssText = 'font-weight: bold;';
        sequenceHeader.appendChild(sequenceTitle);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear All';
        clearButton.className = 'btn btn-default';
        clearButton.onclick = () => {
            sequenceList.innerHTML = '';
            const emptyText = document.createElement('div');
            emptyText.textContent = 'No buildings in sequence';
            emptyText.style.cssText = 'color: #666; font-style: italic; text-align: center;';
            sequenceList.appendChild(emptyText);
            UI.SuccessMessage('Sequence cleared');
        };
        sequenceHeader.appendChild(clearButton);

        sequenceSection.appendChild(sequenceHeader);

        // Current Sequence List
        const sequenceList = document.createElement('div');
        sequenceList.id = 'buildSequenceList';
        sequenceList.style.cssText = 'border: 1px solid #c1a264; padding: 10px; margin-bottom: 10px; min-height: 50px; background: #fff3d9;';

        // Initialize sequence list
        function initializeSequenceList() {
            if (!config.buildSequence || config.buildSequence.length === 0) {
                debugLog('No existing sequence found, showing empty state');
                const emptyText = document.createElement('div');
                emptyText.textContent = 'No buildings in sequence';
                emptyText.style.cssText = 'color: #666; font-style: italic; text-align: center;';
                sequenceList.appendChild(emptyText);
            } else {
                debugLog('Loading existing sequence:', config.buildSequence);
                config.buildSequence.forEach(item => {
                    addSequenceItem(item.building, item.targetLevel);
                });
            }
        }

        sequenceSection.appendChild(sequenceList);

        // Add New Building Controls
        const addControls = document.createElement('div');
        addControls.style.cssText = 'display: flex; gap: 10px; align-items: center; background: #fff3d9; padding: 10px; border: 1px solid #c1a264;';

        // Building Selector
        const buildingSelect = document.createElement('select');
        buildingSelect.style.cssText = 'flex: 1; padding: 2px; background-color: #fff; border: 1px solid #c1a264;';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select Building --';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        buildingSelect.appendChild(defaultOption);

        buildings.forEach(building => {
            const option = document.createElement('option');
            option.value = building.id;
            option.textContent = `${building.name} (${building.currentLevel})`;
            buildingSelect.appendChild(option);
        });

        // Target Level Input
        const untilLevelInput = document.createElement('input');
        untilLevelInput.type = 'number';
        untilLevelInput.min = '1';
        untilLevelInput.style.cssText = 'width: 80px; padding: 2px; background-color: #fff; border: 1px solid #c1a264;';
        untilLevelInput.placeholder = 'Target lvl';

        // Add Button
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Sequence';
        addButton.className = 'btn';
        addButton.onclick = () => {
            if (!buildingSelect.value) {
                UI.ErrorMessage('Please select a building');
                return;
            }

            const buildingId = buildingSelect.value;
            const building = buildings.find(b => b.id === buildingId);
            const currentLevel = parseInt(building.currentLevel.replace(/[^\d]/g, '')) || 0;
            const targetLevel = parseInt(untilLevelInput.value);

            if (!targetLevel) {
                UI.ErrorMessage('Please enter a target level');
                return;
            }

            if (targetLevel <= currentLevel) {
                UI.ErrorMessage('Target level must be higher than current level');
                return;
            }

            const emptyText = sequenceList.querySelector('div[style*="text-align: center"]');
            if (emptyText) {
                sequenceList.innerHTML = '';
            }

            addSequenceItem(buildingId, targetLevel);
            untilLevelInput.value = '';
            buildingSelect.value = '';
        };

        addControls.appendChild(buildingSelect);
        addControls.appendChild(untilLevelInput);
        addControls.appendChild(addButton);
        sequenceSection.appendChild(addControls);

        function addSequenceItem(buildingId, targetLevel) {
            debugLog('Adding sequence item:', { buildingId, targetLevel });
            const building = buildings.find(b => b.id === buildingId);
            if (!building) {
                debugLog('Building not found:', buildingId);
                return;
            }

            const item = document.createElement('div');
            item.className = 'sequence-item';
            item.style.cssText = 'display: flex; gap: 10px; margin-bottom: 5px; align-items: center; background: #fff; padding: 5px; border: 1px solid #c1a264;';

            const text = document.createElement('span');
            text.style.flex = '1';
            text.textContent = `${building.name} to level ${targetLevel}`;

            const buttonsDiv = document.createElement('div');
            buttonsDiv.style.cssText = 'display: flex; gap: 5px;';

            const moveUpBtn = document.createElement('button');
            moveUpBtn.innerHTML = '&#9650;';
            moveUpBtn.className = 'btn';
            moveUpBtn.style.padding = '0 5px';
            moveUpBtn.onclick = () => {
                const prev = item.previousElementSibling;
                if (prev) sequenceList.insertBefore(item, prev);
            };

            const moveDownBtn = document.createElement('button');
            moveDownBtn.innerHTML = '&#9660;';
            moveDownBtn.className = 'btn';
            moveDownBtn.style.padding = '0 5px';
            moveDownBtn.onclick = () => {
                const next = item.nextElementSibling;
                if (next) sequenceList.insertBefore(next, item);
            };

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&#10005;';
            removeBtn.className = 'btn';
            removeBtn.style.padding = '0 5px';
            removeBtn.style.color = '#ff0000';
            removeBtn.onclick = () => {
                item.remove();
                if (sequenceList.children.length === 0) {
                    const emptyText = document.createElement('div');
                    emptyText.textContent = 'No buildings in sequence';
                    emptyText.style.cssText = 'color: #666; font-style: italic; text-align: center;';
                    sequenceList.appendChild(emptyText);
                }
            };

            buttonsDiv.appendChild(moveUpBtn);
            buttonsDiv.appendChild(moveDownBtn);
            buttonsDiv.appendChild(removeBtn);

            item.appendChild(text);
            item.appendChild(buttonsDiv);
            sequenceList.appendChild(item);
            debugLog('Added sequence item:', text.textContent);
        }

        uiContainer.appendChild(sequenceSection);

        // Save Button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Settings';
        saveButton.className = 'btn';
        saveButton.style.marginTop = '10px';
        saveButton.onclick = () => {
            debugLog('Save button clicked');
            const sequence = [];
            const items = sequenceList.querySelectorAll('.sequence-item');
            debugLog('Found sequence items:', items.length);

            items.forEach(item => {
                const text = item.querySelector('span').textContent;
                debugLog('Processing item:', text);

                const [buildingName, levelText] = text.split(' to level ');
                const building = buildings.find(b => b.name === buildingName);

                if (building) {
                    const targetLevel = parseInt(levelText);
                    sequence.push({
                        building: building.id,
                        targetLevel: targetLevel
                    });
                    debugLog('Added to sequence:', { buildingId: building.id, targetLevel });
                }
            });

            const newConfig = {
                useCostReduction: costReductionCheckbox.checked,
                useLongBuildReduction: longBuildCheckbox.checked,
                longBuildThreshold: parseFloat(longBuildThreshold.value) || 2,
                buildSequence: sequence
            };

            debugLog('Saving config:', newConfig);
            saveConfig(newConfig);
            UI.SuccessMessage(`Settings saved! Sequence contains ${sequence.length} buildings.`);
        };

        uiContainer.appendChild(saveButton);

        // Insert UI into page
        const buildingsTable = document.getElementById('buildings');
        if (buildingsTable && buildingsTable.parentElement) {
            buildingsTable.parentElement.insertBefore(uiContainer, buildingsTable);
        }

        // Initialize the sequence list
        initializeSequenceList();
        debugLog('UI creation completed');
    }

    function debugLog(message, data = null) {
        if (!DEBUG) return;
        const timestamp = new Date().toLocaleTimeString();
        if (data) {
            console.log(`[${timestamp}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] ${message}`);
        }
    }


    function getBuildingLevel(buildingName) {
        debugLog(`Getting level for ${buildingName}`);
        try {
            // Find the row containing the building
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) {
                debugLog(`No row found for ${buildingName}`);
                return null;
            }

            // Find the build button
            const buildButton = row.querySelector(`a.btn-build[id*="_${buildingName}_"]`);
            if (!buildButton) {
                debugLog(`No build button found for ${buildingName}`);
                return null;
            }

            // Get the next level from data attribute and subtract 1
            const nextLevel = parseInt(buildButton.getAttribute('data-level-next'));
            if (isNaN(nextLevel)) {
                debugLog(`Could not parse next level for ${buildingName}`);
                return null;
            }

            const currentLevel = nextLevel - 1;
            debugLog(`${buildingName} current level:`, currentLevel);
            return currentLevel;
        } catch (error) {
            debugLog(`Error getting level for ${buildingName}:`, error);
            return null;
        }
    }

    function getRemainingBuildTime(buildingName) {
        try {
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) {
                debugLog(`No row found for ${buildingName} when checking time`);
                return Infinity;
            }

            // Check if there's a running timer
            const timerCell = row.querySelector('td:nth-child(5)');
            if (!timerCell) {
                debugLog(`No timer cell found for ${buildingName}`);
                return Infinity;
            }

            const timeText = timerCell.textContent.trim();
            if (!timeText) return 0;

            const [hours, minutes, seconds] = timeText.split(':').map(Number);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            debugLog(`${buildingName} remaining build time: ${timeText} (${totalSeconds} seconds)`);
            return totalSeconds;
        } catch (error) {
            debugLog(`Error getting remaining time for ${buildingName}:`, error);
            return Infinity;
        }
    }

    function canBuildResource(buildingName) {
        try {
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) {
                debugLog(`No row found for ${buildingName} when checking buildability`);
                return false;
            }

            // Find the -20% button specifically
            const buildButton = row.querySelector(`#main_buildlink_${buildingName}_cheap`);
            if (!buildButton) {
                debugLog(`No cheap build button found for ${buildingName}`);
                return false;
            }

            // Check if button has the disabled class
            const isDisabled = buildButton.classList.contains('btn-bcr-disabled');

            // Check if there's a valid build link
            const hasValidHref = buildButton.getAttribute('href') &&
                  buildButton.getAttribute('href').includes('cheap') &&
                  buildButton.getAttribute('href') !== '#';

            // Check if the button is inside a cell with class 'build_options'
            const inBuildOptions = buildButton.closest('.build_options') !== null;

            // A button is buildable if it has a valid href, is in the build options cell, and is not disabled
            const canBuild = hasValidHref && inBuildOptions && !isDisabled;

            debugLog(`Checking if ${buildingName} can be built with -20%:`, {
                buttonFound: true,
                hasValidHref: hasValidHref,
                inBuildOptions: inBuildOptions,
                isDisabled: isDisabled,
                canBuild: canBuild,
                href: buildButton.getAttribute('href'),
                buttonText: buildButton.textContent.trim(),
                buttonClasses: buildButton.className,
                parentCell: buildButton.closest('td')?.className || 'no parent cell'
            });

            return canBuild;
        } catch (error) {
            debugLog(`Error checking if ${buildingName} can be built:`, error);
            return false;
        }
    }

    function willBeAvailableSoon(buildingName) {
        const remainingTime = getRemainingBuildTime(buildingName);
        const willBeSoon = remainingTime > 0 && remainingTime <= WAIT_FOR_HIGHER_PRIORITY;
        debugLog(`Checking if ${buildingName} will be available soon:`, {
            remainingTime,
            threshold: WAIT_FOR_HIGHER_PRIORITY,
            willBeSoon
        });
        return willBeSoon;
    }

    function applyBuildTimeReduction() {
        try {
            // Find all build time reduction buttons
            const reductionButtons = document.querySelectorAll('a.order_feature.btn.btn-btr');
            if (!reductionButtons || reductionButtons.length === 0) {
                debugLog('No build time reduction buttons found');
                return false;
            }

            // Get the last button (most recently added building)
            const lastButton = reductionButtons[reductionButtons.length - 1];

            // Click the button
            lastButton.click();
            debugLog('Clicked build time reduction button');
            return true;
        } catch (error) {
            debugLog('Error applying build time reduction:', error);
            return false;
        }
    }

    function isConstructionInProgress() {
        // Check for buildorder element
        const buildorder = document.querySelector('#buildorder_4');
        const isBuilding = buildorder !== null;

        debugLog('Checking for ongoing construction:', {
            buildorderFound: isBuilding,
            elementId: isBuilding ? buildorder.id : 'not found'
        });

        return isBuilding;
    }

    function reduceLongBuilds() {
        try {
            const config = loadConfig();

            // Check if feature is enabled
            if (!config.useLongBuildReduction) {
                debugLog('Long build reduction is disabled');
                return false;
            }

            const threshold = config.longBuildThreshold || 2;
            debugLog(`Checking for builds longer than ${threshold} hours`);

            // Only get buildorder_1 and buildorder_2
            const buildRows = document.querySelectorAll('#buildorder_1, #buildorder_2');
            debugLog('Found build rows:', buildRows.length);

            // Process each row
            for (const row of buildRows) {
                const durationCell = row.querySelector('td.nowrap.lit-item');
                if (!durationCell) {
                    debugLog('No duration cell found for row:', row.className);
                    continue;
                }

                const timeSpan = durationCell.querySelector('span');
                if (!timeSpan) {
                    debugLog('No time span found in duration cell');
                    continue;
                }

                const durationText = timeSpan.textContent.trim();
                if (!durationText) {
                    debugLog('Empty duration text');
                    continue;
                }

                const [hours, minutes, seconds] = durationText.split(':').map(Number);
                const totalHours = hours + minutes/60 + seconds/3600;

                const buildingCell = row.querySelector('td.lit-item');
                const buildingName = buildingCell ? buildingCell.textContent.trim().split('\n')[0] : 'Unknown';

                debugLog('Checking build duration:', {
                    building: buildingName,
                    duration: durationText,
                    totalHours: totalHours,
                    threshold: threshold,
                    rowClass: row.className,
                    buildOrderId: row.id
                });

                if (totalHours > threshold) {
                    const reductionButton = row.querySelector('a.order_feature.btn.btn-btr:not(.btn-instant)');
                    if (reductionButton) {
                        debugLog('Found long build, clicking reduction button:', {
                            building: buildingName,
                            duration: durationText,
                            buttonText: reductionButton.textContent.trim(),
                            buildOrderId: row.id
                        });
                        reductionButton.click();
                        return true;
                    }
                }
            }

            debugLog(`No builds over ${threshold} hours found needing reduction in first two queue positions`);
            return false;
        } catch (error) {
            debugLog('Error in reduceLongBuilds:', error);
            return false;
        }
    }

    function buildResource(buildingName) {
        const config = loadConfig();
        debugLog(`Attempting to build ${buildingName}${config.useCostReduction ? ' with -20% discount' : ''}`);

        try {
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) {
                debugLog(`No row found for ${buildingName} when trying to build`);
                return false;
            }

            // Choose between normal and cheap build based on configuration
            const buttonSelector = config.useCostReduction ?
                  `#main_buildlink_${buildingName}_cheap` :
            `a.btn-build[id*="_${buildingName}_"]`;

            const buildButton = row.querySelector(buttonSelector);
            if (!buildButton) {
                debugLog(`No build button found for ${buildingName}`);
                return false;
            }

            const buildUrl = buildButton.getAttribute('href');
            if (!buildUrl || (config.useCostReduction && !buildUrl.includes('cheap'))) {
                debugLog(`No valid build href found for ${buildingName}`);
                return false;
            }

            debugLog(`Clicking build button for ${buildingName} with URL: ${buildUrl}`);

            // Instead of directly changing location, set up a sequence
            if (config.useCostReduction) {
                // For cost reduction, we need to:
                // 1. Navigate to build URL
                // 2. Wait for page load
                // 3. Apply time reduction
                // 4. Reload to main page
                window.location.href = buildUrl;

                // The reduction and reload will be handled by the page load event
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => {
                        applyBuildTimeReduction();
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }, 500);
                }, { once: true }); // Use once: true to ensure it only runs once
            } else {
                // For normal build, just build and reload
                window.location.href = buildUrl;

                // Add event listener for page load
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }, { once: true });
            }

            return true;
        } catch (error) {
            debugLog(`Error building ${buildingName}:`, error);
            return false;
        }
    }

    function checkAndBuild() {
        debugLog('Starting building check cycle...');
        reduceLongBuilds();

        try {
            if (isConstructionInProgress()) {
                debugLog('Construction already in progress, skipping build check');
                return;
            }

            const config = loadConfig();
            if (!config.buildSequence || config.buildSequence.length === 0) {
                debugLog('No building sequence configured');
                return;
            }

            // Get first incomplete sequence item
            const currentSequenceItem = config.buildSequence[0];
            const building = currentSequenceItem.building;
            const currentLevel = getBuildingLevel(building);

            debugLog('Checking sequence item:', {
                building,
                currentLevel,
                targetLevel: currentSequenceItem.targetLevel
            });

            if (currentLevel >= currentSequenceItem.targetLevel) {
                // Remove completed item and save
                config.buildSequence.shift();
                saveConfig(config);
                debugLog('Building reached target level, removing from sequence');

                // Add reload after short delay
                setTimeout(() => {
                    debugLog('Reloading page after sequence update');
                    window.location.reload();
                }, 2000);
                return;
            }

            if (canBuildResource(building)) {
                debugLog('Building available for construction');
                if (buildResource(building)) {
                    debugLog('Building command sent successfully');
                }
            } else {
                debugLog('Cannot build current sequence item yet');
            }

        } catch (error) {
            debugLog('Error in checkAndBuild:', error);
        }
    }

    // Create UI and start the script
    createUI();
    debugLog('Script initialized, performing initial check...');
    checkAndBuild();

    // Set up periodic page reload
    debugLog(`Setting up periodic page reload every ${CHECK_INTERVAL/1000} seconds`);
    setInterval(() => {
        debugLog('Triggering page reload for next check');
        window.location.reload();
    }, CHECK_INTERVAL);

    debugLog('Script setup completed successfully');
})();
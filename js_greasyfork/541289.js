// ==UserScript==
// @name         Auto Builder Enhanced v3
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Automatically builds buildings with advanced settings and resource monitoring
// @match        https://*.tribalwars.net/game.php?village=*&screen=main*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541289/Auto%20Builder%20Enhanced%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/541289/Auto%20Builder%20Enhanced%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEBUG = true;
    const STORAGE_KEY = 'tribalWarsBuilderConfig';

    // Get Village ID
    function getVillageId() {
        const match = window.location.href.match(/village=([^&]*)/);
        return match ? match[1] : null;
    }

    const villageId = getVillageId();
    if (!villageId) {
        console.error('Village ID not found in URL.');
        return;
    }

    let nextCheckTimer = null;
    let countdownInterval = null;

    // Get current resource stock
    function getResourceStock(resource) {
        const resourceElement = document.getElementById(resource);
        return resourceElement ? parseInt(resourceElement.innerText.replace(/\D/g, ''), 10) || 0 : 0;
    }

    // Get total resource (stock + incoming)
    function getTotalResource(resource) {
        const stock = getResourceStock(resource);
        
        // Get incoming resources from market status bar
        const marketTableRows = document.querySelectorAll("#market_status_bar table.vis tbody tr")[1];
        let incoming = 0;

        if (marketTableRows) {
            const resourceElement = marketTableRows.children[0].querySelector(`.icon.header.${resource}`);
            if (resourceElement) {
                const fullText = resourceElement.parentElement.textContent;
                incoming = parseInt(fullText.replace(/\D/g, ""), 10) || 0;
            }
        }

        return stock + incoming;
    }

    // Get required resources for a building
    function getRequiredResources(buildingName) {
        try {
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) return null;

            const buildButton = row.querySelector(`a.btn-build[id*="_${buildingName}_"]`);
            if (!buildButton) return null;

            const costElements = row.querySelectorAll('span.icon.header');
            const costs = {
                wood: 0,
                stone: 0,
                iron: 0
            };

            costElements.forEach(elem => {
                const parentText = elem.parentElement.textContent;
                const cost = parseInt(parentText.replace(/\D/g, ''), 10) || 0;
                
                if (elem.classList.contains('wood')) {
                    costs.wood = cost;
                } else if (elem.classList.contains('stone')) {
                    costs.stone = cost;
                } else if (elem.classList.contains('iron')) {
                    costs.iron = cost;
                }
            });

            debugLog(`Required resources for ${buildingName}:`, costs);
            return costs;
        } catch (error) {
            debugLog(`Error getting required resources for ${buildingName}:`, error);
            return null;
        }
    }

    // Check if we have enough resources to build
    function hasEnoughResources(buildingName) {
        const required = getRequiredResources(buildingName);
        if (!required) return false;

        const wood = getResourceStock('wood');
        const stone = getResourceStock('stone');
        const iron = getResourceStock('iron');

        const hasEnough = wood >= required.wood && 
                         stone >= required.stone && 
                         iron >= required.iron;

        debugLog('Resource availability check:', {
            building: buildingName,
            current: { wood, stone, iron },
            required: required,
            hasEnough: hasEnough
        });

        return hasEnough;
    }

    // Check if all required resources meet minimum threshold
    function checkResourceThreshold(config) {
        const wood = getTotalResource('wood');
        const stone = getTotalResource('stone');
        const iron = getTotalResource('iron');

        debugLog('Resource Check:', {
            wood: wood,
            stone: stone,
            iron: iron,
            threshold: config.minResourceThreshold
        });

        return wood >= config.minResourceThreshold && 
               stone >= config.minResourceThreshold && 
               iron >= config.minResourceThreshold;
    }

    // Extract available buildings from the table
    function getAvailableBuildings() {
        debugLog('Starting getAvailableBuildings function');
        const buildings = [];
        const buildingRows = document.querySelectorAll('#buildings tbody tr[id^="main_buildrow_"]');
        debugLog(`Found ${buildingRows.length} building rows`);

        buildingRows.forEach((row, index) => {
            const buildingCell = row.querySelector('td:first-child');
            if (!buildingCell) return;

            const buildingId = row.id.replace('main_buildrow_', '');
            if (!buildingId) return;

            const links = buildingCell.querySelectorAll('a');
            const nameLink = links[1];
            if (!nameLink) return;

            const inactiveCell = row.querySelector('td.inactive');
            if (inactiveCell && inactiveCell.textContent.includes('vollständig ausgebaut')) {
                return;
            }

            const levelSpan = buildingCell.querySelector('span[style="font-size: 0.9em"]');
            const currentLevel = levelSpan ? levelSpan.textContent.trim() : 'unknown';
            const buildingName = nameLink.textContent.trim();

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
            buildingPriority: [],
            useLongBuildReduction: true,
            longBuildThreshold: 2,
            buildSequence: [],
            minResourceThreshold: 50000,
            checkInterval: 5,
            autoRun: false
        };

        try {
            const savedConfig = localStorage.getItem(`${STORAGE_KEY}_${villageId}`);
            return savedConfig ? {...defaultConfig, ...JSON.parse(savedConfig)} : defaultConfig;
        } catch (error) {
            debugLog('Error loading config:', error);
            return defaultConfig;
        }
    }

    // Save configuration
    function saveConfig(config) {
        try {
            localStorage.setItem(`${STORAGE_KEY}_${villageId}`, JSON.stringify(config));
            debugLog('Config saved:', config);
        } catch (error) {
            debugLog('Error saving config:', error);
        }
    }

    // Create countdown timer UI
    function createCountdownUI() {
        const container = document.createElement('div');
        container.id = 'builder-countdown-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 10px;
            background: #222;
            color: #fff;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
            font-family: Arial, sans-serif;
            min-width: 200px;
        `;

        const title = document.createElement('div');
        title.style.cssText = 'font-size: 14px; font-weight: bold; margin-bottom: 8px; text-align: center; border-bottom: 1px solid #444; padding-bottom: 5px;';
        title.textContent = 'Auto Builder Status';

        const statusDiv = document.createElement('div');
        statusDiv.id = 'builder-status';
        statusDiv.style.cssText = 'font-size: 12px; margin-bottom: 5px; color: #aaa;';
        statusDiv.textContent = 'Status: Stopped';

        const timerDiv = document.createElement('div');
        timerDiv.id = 'builder-timer';
        timerDiv.style.cssText = 'font-size: 16px; font-weight: bold; text-align: center; color: #4CAF50;';
        timerDiv.textContent = '--:--';

        const resourceDiv = document.createElement('div');
        resourceDiv.id = 'builder-resources';
        resourceDiv.style.cssText = 'font-size: 11px; margin-top: 8px; padding-top: 5px; border-top: 1px solid #444; color: #999;';
        resourceDiv.innerHTML = `
            <div>Wood: <span id="wood-count">0</span></div>
            <div>Stone: <span id="stone-count">0</span></div>
            <div>Iron: <span id="iron-count">0</span></div>
        `;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'builder-toggle-btn';
        toggleButton.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: background-color 0.3s ease;
        `;
        toggleButton.textContent = 'Start Auto Build';
        
        toggleButton.addEventListener('click', toggleAutoBuilder);
        toggleButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = this.textContent === 'Start Auto Build' ? '#218838' : '#c82333';
        });
        toggleButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = this.textContent === 'Start Auto Build' ? '#28a745' : '#dc3545';
        });

        container.appendChild(title);
        container.appendChild(statusDiv);
        container.appendChild(timerDiv);
        container.appendChild(resourceDiv);
        container.appendChild(toggleButton);

        document.body.appendChild(container);

        updateResourceDisplay();
        setInterval(updateResourceDisplay, 5000);
    }

    // Update resource display
    function updateResourceDisplay() {
        const woodElement = document.getElementById('wood-count');
        const stoneElement = document.getElementById('stone-count');
        const ironElement = document.getElementById('iron-count');

        if (woodElement) woodElement.textContent = getTotalResource('wood').toLocaleString();
        if (stoneElement) stoneElement.textContent = getTotalResource('stone').toLocaleString();
        if (ironElement) ironElement.textContent = getTotalResource('iron').toLocaleString();
    }

    // Update countdown display
    function updateCountdownDisplay(seconds) {
        const timerElement = document.getElementById('builder-timer');
        if (!timerElement) return;

        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Update status display
    function updateStatusDisplay(status, color = '#aaa') {
        const statusElement = document.getElementById('builder-status');
        if (statusElement) {
            statusElement.textContent = `Status: ${status}`;
            statusElement.style.color = color;
        }
    }

    // Toggle auto builder
    function toggleAutoBuilder() {
        const config = loadConfig();
        const button = document.getElementById('builder-toggle-btn');
        
        if (config.autoRun) {
            config.autoRun = false;
            saveConfig(config);
            
            if (nextCheckTimer) {
                clearTimeout(nextCheckTimer);
                nextCheckTimer = null;
            }
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            button.textContent = 'Start Auto Build';
            button.style.backgroundColor = '#28a745';
            updateStatusDisplay('Stopped', '#999');
            updateCountdownDisplay(0);
        } else {
            config.autoRun = true;
            saveConfig(config);
            
            button.textContent = 'Stop Auto Build';
            button.style.backgroundColor = '#dc3545';
            updateStatusDisplay('Running', '#4CAF50');
            
            scheduleNextCheck(config);
        }
    }

    // Schedule next check
    function scheduleNextCheck(config) {
        const intervalMs = config.checkInterval * 60 * 1000;
        let remainingSeconds = config.checkInterval * 60;

        updateCountdownDisplay(remainingSeconds);
        
        if (countdownInterval) clearInterval(countdownInterval);
        if (nextCheckTimer) clearTimeout(nextCheckTimer);

        countdownInterval = setInterval(() => {
            remainingSeconds--;
            updateCountdownDisplay(remainingSeconds);
            
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }, 1000);

        nextCheckTimer = setTimeout(() => {
            debugLog('Timer triggered, reloading page...');
            window.location.reload();
        }, intervalMs);

        debugLog(`Next check scheduled in ${config.checkInterval} minutes`);
    }

    // Create UI
    function createUI() {
        debugLog('Starting UI creation');
        const config = loadConfig();
        const buildings = getAvailableBuildings();

        const uiContainer = document.createElement('div');
        uiContainer.style.cssText = 'background: #f4e4bc; padding: 15px; margin: 10px 0; border: 1px solid #603000; font-size: 12px;';

        const titleSection = document.createElement('div');
        titleSection.style.marginBottom = '20px';

        const title = document.createElement('h3');
        title.textContent = 'Auto Builder Enhanced v2.1';
        title.style.cssText = 'margin: 0 0 5px 0; font-size: 14px; font-weight: bold;';
        titleSection.appendChild(title);

        const subtitle = document.createElement('div');
        subtitle.textContent = 'Configure building sequence and automation settings';
        subtitle.style.cssText = 'color: #666; font-style: italic;';
        titleSection.appendChild(subtitle);

        uiContainer.appendChild(titleSection);

        const settingsSection = document.createElement('div');
        settingsSection.style.cssText = 'background: #fff3d9; padding: 10px; border: 1px solid #c1a264; margin-bottom: 15px;';

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

        const longBuildDiv = document.createElement('div');
        longBuildDiv.style.marginBottom = '10px';

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

        const resourceThresholdDiv = document.createElement('div');
        resourceThresholdDiv.style.marginBottom = '10px';

        const resourceThresholdLabel = document.createElement('label');
        resourceThresholdLabel.textContent = 'Min resource before building: ';
        resourceThresholdLabel.style.marginRight = '5px';

        const resourceThresholdInput = document.createElement('input');
        resourceThresholdInput.type = 'number';
        resourceThresholdInput.id = 'minResourceThreshold';
        resourceThresholdInput.min = '0';
        resourceThresholdInput.step = '1000';
        resourceThresholdInput.value = config.minResourceThreshold || 50000;
        resourceThresholdInput.style.cssText = 'width: 100px; padding: 2px; background-color: #fff; border: 1px solid #c1a264;';

        resourceThresholdDiv.appendChild(resourceThresholdLabel);
        resourceThresholdDiv.appendChild(resourceThresholdInput);
        settingsSection.appendChild(resourceThresholdDiv);

        const intervalDiv = document.createElement('div');
        intervalDiv.style.marginBottom = '5px';

        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = 'Check interval: ';
        intervalLabel.style.marginRight = '5px';

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.id = 'checkInterval';
        intervalInput.min = '1';
        intervalInput.step = '1';
        intervalInput.value = config.checkInterval || 5;
        intervalInput.style.cssText = 'width: 60px; padding: 2px; margin: 0 5px; background-color: #fff; border: 1px solid #c1a264;';

        const minutesLabel = document.createElement('span');
        minutesLabel.textContent = ' minutes';

        intervalDiv.appendChild(intervalLabel);
        intervalDiv.appendChild(intervalInput);
        intervalDiv.appendChild(minutesLabel);

        settingsSection.appendChild(intervalDiv);
        uiContainer.appendChild(settingsSection);

        const sequenceSection = document.createElement('div');

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

        const sequenceList = document.createElement('div');
        sequenceList.id = 'buildSequenceList';
        sequenceList.style.cssText = 'border: 1px solid #c1a264; padding: 10px; margin-bottom: 10px; min-height: 50px; background: #fff3d9;';

        function initializeSequenceList() {
            if (!config.buildSequence || config.buildSequence.length === 0) {
                const emptyText = document.createElement('div');
                emptyText.textContent = 'No buildings in sequence';
                emptyText.style.cssText = 'color: #666; font-style: italic; text-align: center;';
                sequenceList.appendChild(emptyText);
            } else {
                config.buildSequence.forEach(item => {
                    addSequenceItem(item.building, item.targetLevel);
                });
            }
        }

        sequenceSection.appendChild(sequenceList);

        const addControls = document.createElement('div');
        addControls.style.cssText = 'display: flex; gap: 10px; align-items: center; background: #fff3d9; padding: 10px; border: 1px solid #c1a264;';

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

        const untilLevelInput = document.createElement('input');
        untilLevelInput.type = 'number';
        untilLevelInput.min = '1';
        untilLevelInput.style.cssText = 'width: 80px; padding: 2px; background-color: #fff; border: 1px solid #c1a264;';
        untilLevelInput.placeholder = 'Target lvl';

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
            const building = buildings.find(b => b.id === buildingId);
            if (!building) return;

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
        }

        uiContainer.appendChild(sequenceSection);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Settings';
        saveButton.className = 'btn';
        saveButton.style.marginTop = '10px';
        saveButton.onclick = () => {
            const sequence = [];
            const items = sequenceList.querySelectorAll('.sequence-item');

            items.forEach(item => {
                const text = item.querySelector('span').textContent;
                const [buildingName, levelText] = text.split(' to level ');
                const building = buildings.find(b => b.name === buildingName);

                if (building) {
                    const targetLevel = parseInt(levelText);
                    sequence.push({
                        building: building.id,
                        targetLevel: targetLevel
                    });
                }
            });

            const newConfig = {
                useCostReduction: costReductionCheckbox.checked,
                useLongBuildReduction: longBuildCheckbox.checked,
                longBuildThreshold: parseFloat(longBuildThreshold.value) || 2,
                minResourceThreshold: parseInt(resourceThresholdInput.value) || 50000,
                checkInterval: parseInt(intervalInput.value) || 5,
                buildSequence: sequence,
                autoRun: config.autoRun
            };

            saveConfig(newConfig);
            UI.SuccessMessage(`Settings saved! Sequence contains ${sequence.length} buildings.`);
        };

        uiContainer.appendChild(saveButton);

        const buildingsTable = document.getElementById('buildings');
        if (buildingsTable && buildingsTable.parentElement) {
            buildingsTable.parentElement.insertBefore(uiContainer, buildingsTable);
        }

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
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) return null;

            const buildButton = row.querySelector(`a.btn-build[id*="_${buildingName}_"]`);
            if (!buildButton) return null;

            const nextLevel = parseInt(buildButton.getAttribute('data-level-next'));
            if (isNaN(nextLevel)) return null;

            const currentLevel = nextLevel - 1;
            debugLog(`${buildingName} current level:`, currentLevel);
            return currentLevel;
        } catch (error) {
            debugLog(`Error getting level for ${buildingName}:`, error);
            return null;
        }
    }

    function canBuildResource(buildingName, config) {
        try {
            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) return false;

            const buttonSelector = config.useCostReduction ?
                  `#main_buildlink_${buildingName}_cheap` :
                  `a.btn-build[id*="_${buildingName}_"]`;

            const buildButton = row.querySelector(buttonSelector);
            if (!buildButton) return false;

            // Check if button is disabled
            const isDisabled = buildButton.classList.contains('btn-bcr-disabled') ||
                              buildButton.classList.contains('inactive');
            
            // Check if button has valid href
            const hasValidHref = buildButton.getAttribute('href') && 
                                buildButton.getAttribute('href') !== '#';

            // CRITICAL: Check if we actually have enough resources
            const hasResources = hasEnoughResources(buildingName);

            const canBuild = hasValidHref && !isDisabled && hasResources;
            
            debugLog(`Can build ${buildingName}:`, {
                hasValidHref,
                isDisabled,
                hasResources,
                canBuild
            });

            return canBuild;
        } catch (error) {
            debugLog(`Error checking if ${buildingName} can be built:`, error);
            return false;
        }
    }

    function applyBuildTimeReduction() {
        try {
            const reductionButtons = document.querySelectorAll('a.order_feature.btn.btn-btr');
            if (!reductionButtons || reductionButtons.length === 0) return false;

            const lastButton = reductionButtons[reductionButtons.length - 1];
            lastButton.click();
            debugLog('Clicked build time reduction button');
            return true;
        } catch (error) {
            debugLog('Error applying build time reduction:', error);
            return false;
        }
    }

    function isConstructionInProgress() {
        const buildorder = document.querySelector('#buildorder_4');
        return buildorder !== null;
    }

    function reduceLongBuilds(config) {
        try {
            if (!config.useLongBuildReduction) return false;

            const threshold = config.longBuildThreshold || 2;
            const buildRows = document.querySelectorAll('#buildorder_1, #buildorder_2');

            for (const row of buildRows) {
                const durationCell = row.querySelector('td.nowrap.lit-item');
                if (!durationCell) continue;

                const timeSpan = durationCell.querySelector('span');
                if (!timeSpan) continue;

                const durationText = timeSpan.textContent.trim();
                if (!durationText) continue;

                const [hours, minutes, seconds] = durationText.split(':').map(Number);
                const totalHours = hours + minutes/60 + seconds/3600;

                if (totalHours > threshold) {
                    const reductionButton = row.querySelector('a.order_feature.btn.btn-btr:not(.btn-instant)');
                    if (reductionButton) {
                        debugLog('Found long build, clicking reduction button');
                        reductionButton.click();
                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            debugLog('Error in reduceLongBuilds:', error);
            return false;
        }
    }

    function buildResource(buildingName, config) {
        debugLog(`Attempting to build ${buildingName}`);

        try {
            // DOUBLE CHECK: Verify resources one more time before building
            if (!hasEnoughResources(buildingName)) {
                debugLog(`Insufficient resources to build ${buildingName}, aborting`);
                updateStatusDisplay('Not enough resources', '#FF6B6B');
                return false;
            }

            const row = document.querySelector(`#main_buildrow_${buildingName}`);
            if (!row) return false;

            const buttonSelector = config.useCostReduction ?
                  `#main_buildlink_${buildingName}_cheap` :
                  `a.btn-build[id*="_${buildingName}_"]`;

            const buildButton = row.querySelector(buttonSelector);
            if (!buildButton) return false;

            // Final check: button must not be disabled
            if (buildButton.classList.contains('btn-bcr-disabled') || 
                buildButton.classList.contains('inactive')) {
                debugLog(`Build button is disabled for ${buildingName}, aborting`);
                updateStatusDisplay('Button disabled', '#FF6B6B');
                return false;
            }

            const buildUrl = buildButton.getAttribute('href');
            if (!buildUrl || buildUrl === '#') {
                debugLog(`Invalid build URL for ${buildingName}, aborting`);
                return false;
            }

            debugLog(`Building ${buildingName} with URL: ${buildUrl}`);
            updateStatusDisplay('Building...', '#FFA500');

            window.location.href = buildUrl;

            if (config.useCostReduction) {
                document.addEventListener('DOMContentLoaded', function() {
                    setTimeout(() => {
                        applyBuildTimeReduction();
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }, 500);
                }, { once: true });
            } else {
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
        
        const config = loadConfig();
        
        reduceLongBuilds(config);

        if (!config.autoRun) {
            debugLog('Auto-run is disabled, skipping build check');
            return;
        }

        try {
            if (isConstructionInProgress()) {
                debugLog('Construction already in progress, scheduling next check');
                updateStatusDisplay('Building in progress', '#FFA500');
                scheduleNextCheck(config);
                return;
            }

            if (!config.buildSequence || config.buildSequence.length === 0) {
                debugLog('No building sequence configured, scheduling next check');
                updateStatusDisplay('No sequence configured', '#FF6B6B');
                scheduleNextCheck(config);
                return;
            }

            if (!checkResourceThreshold(config)) {
                debugLog('Resource threshold not met, scheduling next check');
                updateStatusDisplay('Waiting for resources', '#FFD700');
                scheduleNextCheck(config);
                return;
            }

            const currentSequenceItem = config.buildSequence[0];
            const building = currentSequenceItem.building;
            const currentLevel = getBuildingLevel(building);

            debugLog('Checking sequence item:', {
                building,
                currentLevel,
                targetLevel: currentSequenceItem.targetLevel
            });

            if (currentLevel >= currentSequenceItem.targetLevel) {
                config.buildSequence.shift();
                saveConfig(config);
                debugLog('Building reached target level, removing from sequence');
                updateStatusDisplay('Target reached, reloading', '#4CAF50');

                setTimeout(() => {
                    debugLog('Reloading page after target reached');
                    window.location.reload();
                }, 2000);
                return;
            }

            if (canBuildResource(building, config)) {
                debugLog('Building available for construction, attempting to build');
                if (buildResource(building, config)) {
                    debugLog('Building command sent successfully');
                } else {
                    updateStatusDisplay('Build failed, retrying', '#FF6B6B');
                    scheduleNextCheck(config);
                }
            } else {
                debugLog('Cannot build current sequence item yet, scheduling next check');
                updateStatusDisplay('Cannot build yet', '#FFD700');
                scheduleNextCheck(config);
            }

        } catch (error) {
            debugLog('Error in checkAndBuild:', error);
            updateStatusDisplay('Error occurred, retrying', '#FF6B6B');
            scheduleNextCheck(config);
        }
    }

    function init() {
        createUI();
        createCountdownUI();
        
        const config = loadConfig();
        
        debugLog('Script initialized');
        debugLog('Config:', config);
        
        const button = document.getElementById('builder-toggle-btn');
        if (config.autoRun) {
            if (button) {
                button.textContent = 'Stop Auto Build';
                button.style.backgroundColor = '#dc3545';
            }
            updateStatusDisplay('Running', '#4CAF50');
            checkAndBuild();
        } else {
            if (button) {
                button.textContent = 'Start Auto Build';
                button.style.backgroundColor = '#28a745';
            }
            updateStatusDisplay('Stopped', '#999');
        }
        
        debugLog('Script setup completed');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
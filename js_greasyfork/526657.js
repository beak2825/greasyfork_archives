// ==UserScript==
// @name         [TORN] OC 2.0 Priority Helper
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Adds filters to show/hide crime scenario cards and disable low-success chance join buttons
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526657/%5BTORN%5D%20OC%2020%20Priority%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/526657/%5BTORN%5D%20OC%2020%20Priority%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants for localStorage keys
    const STORAGE_KEYS = {
        SHOW: 'tornCrimeFilter_show',
        LEVEL: 'tornCrimeFilter_level',
        POSITION_X: 'tornCrimeFilter_posX',
        POSITION_Y: 'tornCrimeFilter_posY',
        IS_COLLAPSED: 'tornCrimeFilter_collapsed',
        HIGHLIGHT_PRIORITY: 'tornCrimeFilter_highlightPriority',
        MIN_SUCCESS: 'tornCrimeFilter_minSuccess'
    };

    // Default settings
    const DEFAULT_SETTINGS = {
        show: true,
        level: 1,
        positionX: 0,
        positionY: 0,
        isCollapsed: false,
        highlightPriority: true,
        minSuccess: 62
    };

    // Priority colors
    const PRIORITY_COLORS = {
        waiting: 'rgba(83, 152, 237, 0.4)',      // Blue - #1 Waiting
        empty: 'rgba(76, 175, 80, 0.4)',         // Green - #2 Empty
        nobodyQueueing: 'rgba(255, 152, 0, 0.4)', // Orange - #3 Nobody queueing
        others: 'rgba(0, 0, 0, 0)'               // Transparent - #4 All others
    };

    // Load saved settings or use defaults
    function loadSettings() {
        return {
            show: localStorage.getItem(STORAGE_KEYS.SHOW) !== 'false',
            level: parseInt(localStorage.getItem(STORAGE_KEYS.LEVEL)) || DEFAULT_SETTINGS.level,
            positionX: parseInt(localStorage.getItem(STORAGE_KEYS.POSITION_X)) || DEFAULT_SETTINGS.positionX,
            positionY: parseInt(localStorage.getItem(STORAGE_KEYS.POSITION_Y)) || DEFAULT_SETTINGS.positionY,
            isCollapsed: localStorage.getItem(STORAGE_KEYS.IS_COLLAPSED) === 'true',
            highlightPriority: localStorage.getItem(STORAGE_KEYS.HIGHLIGHT_PRIORITY) !== 'false',
            minSuccess: parseInt(localStorage.getItem(STORAGE_KEYS.MIN_SUCCESS)) || DEFAULT_SETTINGS.minSuccess
        };
    }

    // Save settings to localStorage
    function saveSettings(settings) {
        Object.entries(settings).forEach(([key, value]) => {
            localStorage.setItem(STORAGE_KEYS[key.toUpperCase()], value);
        });
    }

    // Ensure position is within viewport bounds
    function keepInBounds(element) {
        const rect = element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Extract transformed position
        const transformMatrix = window.getComputedStyle(element).transform;
        let currentX = 0;
        let currentY = 0;

        if (transformMatrix && transformMatrix !== 'none') {
            const matrixValues = transformMatrix.match(/matrix.*\((.+)\)/)[1].split(', ');
            currentX = parseInt(matrixValues[4]) || 0;
            currentY = parseInt(matrixValues[5]) || 0;
        }

        let newX = currentX;
        let newY = currentY;

        if (rect.right > viewportWidth) {
            newX = viewportWidth - rect.width;
        }
        if (rect.left < 0) {
            newX = 0;
        }
        if (rect.bottom > viewportHeight) {
            newY = viewportHeight - rect.height;
        }
        if (rect.top < 0) {
            newY = 0;
        }

        return { x: newX, y: newY };
    }

    // Get slot status - returns one of: 'completed', 'inProgress', 'notStarted', 'empty'
    function getSlotStatus(slotElement) {
        // Check if the slot is empty
        const svgElement = slotElement.querySelector('.slotIcon___VVnQy svg');
        if (svgElement) return 'empty';

        // Get the planning element
        const planningElement = slotElement.querySelector('.planning___CjB09');
        if (!planningElement) return 'unknown';

        // Get the conic-gradient style to determine progress
        const style = planningElement.getAttribute('style');
        if (!style) return 'unknown';

        // Extract the degrees value from the conic-gradient
        const match = style.match(/conic-gradient\([^,]+,\s*[^,]+\s+([0-9.]+)deg/);
        if (!match) return 'unknown';

        const degrees = parseFloat(match[1]);

        if (degrees >= 360) return 'completed';
        if (degrees > 0) return 'inProgress';
        return 'notStarted';
    }

    // Check if a slot is filled (has a participant)
    function isSlotFilled(slotElement) {
        return slotElement.querySelector('.validSlot___n6ueL') !== null;
    }

    // Get the success chance of a slot (0-100)
    function getSuccessChance(slotElement) {
        const successChanceEl = slotElement.querySelector('.successChance___ddHsR');
        if (!successChanceEl) return 0;

        const chanceText = successChanceEl.textContent.trim();
        return parseInt(chanceText, 10) || 0;
    }

    // Process join buttons - disable if success chance is too low
    function processJoinButtons(minSuccess) {
        let disabledCount = 0;
        let totalButtons = 0;

        document.querySelectorAll('.joinButton___Ikoyy').forEach(button => {
            // Find the parent slot element to check the success chance
            const slotElement = button.closest('.wrapper___Lpz_D');
            if (!slotElement) return;

            const successChance = getSuccessChance(slotElement);
            totalButtons++;

            // Apply disabled state based on success chance
            if (successChance < minSuccess) {
                button.disabled = true;
                button.title = `Success chance (${successChance}) is below minimum (${minSuccess})`;
                disabledCount++;

                // Add visual indicator
                button.style.opacity = '0.6';
                button.style.position = 'relative';
                button.style.cursor = 'not-allowed';

                // Check if we need to add the strike-through
                if (!button.querySelector('.strike-through')) {
                    const strikeThrough = document.createElement('div');
                    strikeThrough.className = 'strike-through';
                    strikeThrough.style.position = 'absolute';
                    strikeThrough.style.top = '50%';
                    strikeThrough.style.left = '0';
                    strikeThrough.style.right = '0';
                    strikeThrough.style.height = '1px';
                    strikeThrough.style.backgroundColor = 'red';
                    strikeThrough.style.transform = 'rotate(-10deg)';
                    button.appendChild(strikeThrough);
                }
            } else {
                // Ensure button is enabled and clean
                button.disabled = false;
                button.title = '';
                button.style.opacity = '';
                button.style.cursor = '';

                // Remove strike-through if exists
                const strikeThrough = button.querySelector('.strike-through');
                if (strikeThrough) {
                    strikeThrough.remove();
                }
            }
        });

        return { disabledCount, totalButtons };
    }

    // Process crime cards, add badges and apply highlighting
    function processCrimeCards(highlightPriority, minSuccess) {
        const priorityCounts = {
            waiting: 0,
            empty: 0,
            nobodyQueueing: 0,
            others: 0
        };

        document.querySelectorAll('.wrapper___U2Ap7').forEach(card => {
            // Add participant badge if not exists
            if (!card.querySelector('.participant-badge')) {
                // Get the participants container
                const participantsContainer = card.querySelector('.wrapper___g3mPt');
                if (participantsContainer) {
                    // Count filled slots and total slots
                    const allSlots = participantsContainer.querySelectorAll('.wrapper___Lpz_D');
                    const filledSlots = participantsContainer.querySelectorAll('.validSlot___n6ueL');

                    // Create the badge
                    const badge = document.createElement('div');
                    badge.className = 'participant-badge';
                    badge.style.position = 'absolute';
                    badge.style.top = '0';
                    badge.style.right = '0';
                    badge.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    badge.style.color = '#fff';
                    badge.style.padding = '3px 8px';
                    badge.style.borderRadius = '0 0 0 8px';
                    badge.style.fontSize = '12px';
                    badge.style.fontWeight = 'bold';
                    badge.style.zIndex = '10';
                    badge.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';

                    // Set the badge text
                    badge.textContent = `${filledSlots.length}/${allSlots.length} slots`;

                    // Add the badge to the card
                    card.querySelector('.contentLayer___IYFdz').appendChild(badge);
                }
            }

            // Add or update priority badge
            if (highlightPriority) {
                // First, remove any existing priority badge
                const existingBadge = card.querySelector('.priority-badge');
                if (existingBadge) {
                    existingBadge.remove();
                }

                // Remove previous highlight
                card.style.backgroundColor = '';
                card.style.boxShadow = '';

                // Get the participants container and analyze slots
                const participantsContainer = card.querySelector('.wrapper___g3mPt');
                if (participantsContainer) {
                    const slots = Array.from(participantsContainer.querySelectorAll('.wrapper___Lpz_D'));
                    const filledSlots = slots.filter(slot => isSlotFilled(slot));
                    const emptySlots = slots.filter(slot => !isSlotFilled(slot));

                    // Get status of each slot
                    const slotStatuses = slots.map(slot => ({
                        element: slot,
                        filled: isSlotFilled(slot),
                        status: getSlotStatus(slot)
                    }));

                    let priorityType = '';
                    let priorityLabel = '';

                    // Priority #2: Empty - No participant slots are filled
                    if (filledSlots.length === 0) {
                        priorityType = 'empty';
                        priorityLabel = 'Empty';
                    }
                    // Priority #1: Waiting - Participant slots not fully filled, and no slots with "in progress" status
                    else if (filledSlots.length < slots.length && !slotStatuses.some(s => s.filled && s.status === 'inProgress')) {
                        priorityType = 'waiting';
                        priorityLabel = 'Waiting';
                    }
                    // Priority #3: Nobody queueing - One or more slots filled, all are completed or in progress, rest are empty
                    else if (filledSlots.length > 0 &&
                            filledSlots.every(slot => ['completed', 'inProgress'].includes(getSlotStatus(slot))) &&
                            slots.every(slot => isSlotFilled(slot) || getSlotStatus(slot) === 'empty')) {
                        priorityType = 'nobodyQueueing';
                        priorityLabel = 'Nobody Queueing';
                    }
                    // Priority #4: All others
                    else {
                        priorityType = 'others';
                        priorityLabel = '';
                    }

                    // Apply highlights based on priority
                    if (priorityType && priorityType !== 'others') {
                        card.style.backgroundColor = PRIORITY_COLORS[priorityType];
                        card.style.boxShadow = `0 0 8px ${PRIORITY_COLORS[priorityType]}`;

                        // Create priority badge if it's not "others"
                        const priorityBadge = document.createElement('div');
                        priorityBadge.className = 'priority-badge';
                        priorityBadge.style.position = 'absolute';
                        priorityBadge.style.top = '0';
                        priorityBadge.style.left = '0';
                        priorityBadge.style.backgroundColor = PRIORITY_COLORS[priorityType].replace('0.4', '0.8');
                        priorityBadge.style.color = '#fff';
                        priorityBadge.style.padding = '3px 8px';
                        priorityBadge.style.borderRadius = '0 0 8px 0';
                        priorityBadge.style.fontSize = '12px';
                        priorityBadge.style.fontWeight = 'bold';
                        priorityBadge.style.zIndex = '10';
                        priorityBadge.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';

                        // Set badge text based on priority
                        priorityBadge.textContent = `#${priorityType === 'waiting' ? '1' : priorityType === 'empty' ? '2' : '3'} ${priorityLabel}`;

                        // Add the badge to the card
                        card.querySelector('.contentLayer___IYFdz').appendChild(priorityBadge);
                    }

                    // Count priorities for stats
                    if (priorityType) {
                        priorityCounts[priorityType]++;
                    }
                }
            }
        });

        // Process join buttons based on minimum success chance
        const joinButtonStats = processJoinButtons(minSuccess);

        return {
            priorityCounts,
            joinButtonStats
        };
    }

    function updateFilters() {
        const showCheckbox = document.getElementById('crimeFilterCheckbox');
        const levelInput = document.getElementById('minCrimeLevelInput');
        const highlightPriorityCheckbox = document.getElementById('highlightPriorityCheckbox');
        const minSuccessInput = document.getElementById('minSuccessInput');

        const shouldShow = showCheckbox.checked;
        const minLevel = parseInt(levelInput.value, 10) || 1;
        const highlightPriority = highlightPriorityCheckbox.checked;
        const minSuccess = parseInt(minSuccessInput.value, 10) || DEFAULT_SETTINGS.minSuccess;

        // Save filter settings
        saveSettings({
            show: shouldShow,
            level: minLevel,
            highlightPriority: highlightPriority,
            minSuccess: minSuccess
        });

        // Process crime cards and get statistics
        const processResult = processCrimeCards(highlightPriority, minSuccess);
        const priorityCounts = processResult.priorityCounts;
        const joinButtonStats = processResult.joinButtonStats;

        // Update status text
        const statusEl = document.getElementById('filterStatus');
        let visibleCount = 0;
        let totalCount = 0;
        let filledCount = 0;
        let openCount = 0;

        document.querySelectorAll('.wrapper___U2Ap7').forEach(card => {
            const levelEl = card.querySelector('.level___sBl49');
            totalCount++;

            let shouldDisplay = true;

            if (levelEl) {
                const text = levelEl.textContent.trim();
                const parts = text.split('/');
                const level = parseInt(parts[0], 10) || 0;

                // Apply level filter if checkbox is checked
                if (shouldShow && level < minLevel) {
                    shouldDisplay = false;
                }
            }

            // Count filled and open slots for visible cards
            if (shouldDisplay) {
                visibleCount++;

                // Get filled slots count for this card
                const participantsContainer = card.querySelector('.wrapper___g3mPt');
                if (participantsContainer) {
                    const allSlots = participantsContainer.querySelectorAll('.wrapper___Lpz_D').length;
                    const filledSlots = participantsContainer.querySelectorAll('.validSlot___n6ueL').length;

                    filledCount += filledSlots;
                    openCount += (allSlots - filledSlots);
                }
            }

            // Apply visibility
            card.style.display = shouldDisplay ? '' : 'none';
        });

        // Update status with priority counts and join button stats
        let priorityText = '';
        if (highlightPriority) {
            priorityText = ` | P1: ${priorityCounts.waiting} | P2: ${priorityCounts.empty} | P3: ${priorityCounts.nobodyQueueing}`;
        }

        let successText = '';
        if (joinButtonStats.totalButtons > 0) {
            successText = ` | Blocked: ${joinButtonStats.disabledCount}/${joinButtonStats.totalButtons} join buttons`;
        }

        statusEl.textContent = `Showing ${visibleCount} of ${totalCount} crimes | ${filledCount} filled slots | ${openCount} open slots${priorityText}${successText}`;
    }

    window.addEventListener('load', function() {
        const crimesContainer = document.getElementById('faction-crimes');
        if (!crimesContainer) return;

        // Create custom CSS for the badges
        const style = document.createElement('style');
        style.textContent = `
            .participant-badge, .priority-badge {
                transition: all 0.2s ease;
            }
            .wrapper___U2Ap7:hover .participant-badge {
                background-color: rgba(40, 167, 69, 0.8) !important;
            }
            .wrapper___U2Ap7:hover .priority-badge {
                filter: brightness(1.2);
            }

            /* Success chance tooltip */
            .join-button-tooltip {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 5px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 10001;
                max-width: 250px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                pointer-events: none;
                transition: opacity 0.15s;
                white-space: nowrap;
                opacity: 0;
            }

            /* Legend styles */
            .highlight-legend {
                margin-top: 8px;
                display: grid;
                grid-template-columns: 12px auto;
                grid-gap: 5px 8px;
                align-items: center;
                font-size: 12px;
            }
            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);

        // Load saved settings
        const settings = loadSettings();

        // Create filter UI container
        const filterDiv = document.createElement('div');
        Object.assign(filterDiv.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '12px',
            zIndex: '10000',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'opacity 0.1s ease',
            cursor: 'default'
        });

        // Create header with title and collapse button
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = '8px';
        headerDiv.style.cursor = 'move';
        headerDiv.style.userSelect = 'none'; // Prevent text selection while dragging

        const titleSpan = document.createElement('span');
        titleSpan.textContent = 'Crime Filter';
        titleSpan.style.fontWeight = 'bold';

        const collapseButton = document.createElement('button');
        collapseButton.textContent = settings.isCollapsed ? '▼' : '▲';
        collapseButton.style.background = 'none';
        collapseButton.style.border = 'none';
        collapseButton.style.color = '#fff';
        collapseButton.style.cursor = 'pointer';
        collapseButton.style.padding = '0 5px';

        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.style.display = settings.isCollapsed ? 'none' : 'block';

        // Create controls container
        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.flexDirection = 'column';
        controlsDiv.style.gap = '10px';

        // Create first row (level filter)
        const filterRow = document.createElement('div');
        filterRow.style.display = 'flex';
        filterRow.style.alignItems = 'center';
        filterRow.style.gap = '10px';

        // Create checkbox group
        const checkboxGroup = document.createElement('div');
        checkboxGroup.style.display = 'flex';
        checkboxGroup.style.alignItems = 'center';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'crimeFilterCheckbox';
        checkbox.checked = settings.show;
        checkbox.style.marginRight = '5px';

        const checkboxLabel = document.createElement('label');
        checkboxLabel.htmlFor = 'crimeFilterCheckbox';
        checkboxLabel.textContent = 'Filter by Level';
        checkboxLabel.title = 'When checked, filters crime cards by level. When unchecked, shows all cards.';
        checkboxLabel.style.cursor = 'pointer';

        // Create level input group
        const levelGroup = document.createElement('div');
        levelGroup.style.display = 'flex';
        levelGroup.style.alignItems = 'center';

        const levelLabel = document.createElement('label');
        levelLabel.htmlFor = 'minCrimeLevelInput';
        levelLabel.textContent = 'Min Level:';

        const levelInput = document.createElement('input');
        levelInput.type = 'number';
        levelInput.id = 'minCrimeLevelInput';
        levelInput.min = '1';
        levelInput.max = '10';
        levelInput.value = settings.level;
        levelInput.style.width = '45px';
        levelInput.style.marginLeft = '5px';
        levelInput.style.padding = '2px 4px';

        // Create second row (highlight checkbox and success chance input)
        const highlightRow = document.createElement('div');
        highlightRow.style.display = 'flex';
        highlightRow.style.alignItems = 'center';
        highlightRow.style.justifyContent = 'space-between';

        // Highlight checkbox group
        const highlightCheckboxGroup = document.createElement('div');
        highlightCheckboxGroup.style.display = 'flex';
        highlightCheckboxGroup.style.alignItems = 'center';

        const highlightCheckbox = document.createElement('input');
        highlightCheckbox.type = 'checkbox';
        highlightCheckbox.id = 'highlightPriorityCheckbox';
        highlightCheckbox.checked = settings.highlightPriority;
        highlightCheckbox.style.marginRight = '5px';

        const highlightLabel = document.createElement('label');
        highlightLabel.htmlFor = 'highlightPriorityCheckbox';
        highlightLabel.textContent = 'Highlight Priority';
        highlightLabel.title = 'Highlights crimes based on priority status';
        highlightLabel.style.cursor = 'pointer';

        // Min success chance group
        const successGroup = document.createElement('div');
        successGroup.style.display = 'flex';
        successGroup.style.alignItems = 'center';

        const successLabel = document.createElement('label');
        successLabel.htmlFor = 'minSuccessInput';
        successLabel.textContent = 'Min Success:';

        const successInput = document.createElement('input');
        successInput.type = 'number';
        successInput.id = 'minSuccessInput';
        successInput.min = '0';
        successInput.max = '100';
        successInput.value = settings.minSuccess;
        successInput.style.width = '45px';
        successInput.style.marginLeft = '5px';
        successInput.style.padding = '2px 4px';

        // Create legend for highlight colors
        const legendDiv = document.createElement('div');
        legendDiv.className = 'highlight-legend';
        legendDiv.style.display = settings.highlightPriority ? 'grid' : 'none';

        // Priority #1 legend
        const p1ColorDiv = document.createElement('div');
        p1ColorDiv.className = 'legend-color';
        p1ColorDiv.style.backgroundColor = PRIORITY_COLORS.waiting;
        const p1TextDiv = document.createElement('div');
        p1TextDiv.textContent = '#1 Waiting';

        // Priority #2 legend
        const p2ColorDiv = document.createElement('div');
        p2ColorDiv.className = 'legend-color';
        p2ColorDiv.style.backgroundColor = PRIORITY_COLORS.empty;
        const p2TextDiv = document.createElement('div');
        p2TextDiv.textContent = '#2 Empty';

        // Priority #3 legend
        const p3ColorDiv = document.createElement('div');
        p3ColorDiv.className = 'legend-color';
        p3ColorDiv.style.backgroundColor = PRIORITY_COLORS.nobodyQueueing;
        const p3TextDiv = document.createElement('div');
        p3TextDiv.textContent = '#3 Nobody Queueing';

        // Add legend items
        legendDiv.appendChild(p1ColorDiv);
        legendDiv.appendChild(p1TextDiv);
        legendDiv.appendChild(p2ColorDiv);
        legendDiv.appendChild(p2TextDiv);
        legendDiv.appendChild(p3ColorDiv);
        legendDiv.appendChild(p3TextDiv);

        // Create status text
        const statusEl = document.createElement('div');
        statusEl.id = 'filterStatus';
        statusEl.style.fontSize = '12px';
        statusEl.style.color = '#aaa';
        statusEl.style.marginTop = '4px';

        // Assemble the UI
        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(collapseButton);

        checkboxGroup.appendChild(checkbox);
        checkboxGroup.appendChild(checkboxLabel);
        levelGroup.appendChild(levelLabel);
        levelGroup.appendChild(levelInput);
        filterRow.appendChild(checkboxGroup);
        filterRow.appendChild(levelGroup);

        highlightCheckboxGroup.appendChild(highlightCheckbox);
        highlightCheckboxGroup.appendChild(highlightLabel);
        successGroup.appendChild(successLabel);
        successGroup.appendChild(successInput);

        highlightRow.appendChild(highlightCheckboxGroup);
        highlightRow.appendChild(successGroup);

        controlsDiv.appendChild(filterRow);
        controlsDiv.appendChild(highlightRow);
        controlsDiv.appendChild(legendDiv);

        contentDiv.appendChild(controlsDiv);
        contentDiv.appendChild(statusEl);

        filterDiv.appendChild(headerDiv);
        filterDiv.appendChild(contentDiv);
        document.body.appendChild(filterDiv);

        // Set initial position from saved settings
        filterDiv.style.transform = `translate(${settings.positionX}px, ${settings.positionY}px)`;

        // Collapse button functionality
        collapseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            settings.isCollapsed = !settings.isCollapsed;
            contentDiv.style.display = settings.isCollapsed ? 'none' : 'block';
            collapseButton.textContent = settings.isCollapsed ? '▼' : '▲';
            saveSettings({ isCollapsed: settings.isCollapsed });
        });

        // Highlight checkbox functionality
        highlightCheckbox.addEventListener('change', function() {
            legendDiv.style.display = this.checked ? 'grid' : 'none';
            updateFilters();
        });

        // Add event listeners for filters
        checkbox.addEventListener('change', updateFilters);
        levelInput.addEventListener('input', updateFilters);
        levelInput.addEventListener('change', updateFilters);
        successInput.addEventListener('input', updateFilters);
        successInput.addEventListener('change', updateFilters);

        // Improved drag and drop implementation
        let isDragging = false;
        let xOffset = settings.positionX;
        let yOffset = settings.positionY;
        let startX, startY;

        function dragStart(e) {
            // Only start dragging if clicking on the header or title
            if (e.target === headerDiv || e.target === titleSpan) {
                e.preventDefault();
                isDragging = true;

                // Use clientX/Y for mouse position
                startX = e.clientX;
                startY = e.clientY;

                // Add visual feedback for dragging
                filterDiv.style.opacity = '0.8';
                filterDiv.style.transition = 'opacity 0.1s ease';
                document.body.style.cursor = 'move';

                // Disable text selection
                document.body.style.userSelect = 'none';
            }
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            // Calculate how far we've moved
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // Update position based on movement
            xOffset += dx;
            yOffset += dy;

            // Update position directly with transform
            filterDiv.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

            // Update starting point for next movement
            startX = e.clientX;
            startY = e.clientY;
        }

        function dragEnd(e) {
            if (!isDragging) return;

            // Clean up
            isDragging = false;
            filterDiv.style.opacity = '1';
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';

            // Check bounds and adjust if needed
            const bounds = keepInBounds(filterDiv);
            xOffset = bounds.x;
            yOffset = bounds.y;

            // Apply final position
            filterDiv.style.transform = `translate(${xOffset}px, ${yOffset}px)`;

            // Save position
            saveSettings({
                positionX: xOffset,
                positionY: yOffset
            });
        }

        // Add event listeners for dragging
        headerDiv.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        // Also end drag if mouse leaves the window
        document.addEventListener('mouseleave', dragEnd);

        // Handle window resize to keep the box in bounds
        window.addEventListener('resize', () => {
            const bounds = keepInBounds(filterDiv);
            xOffset = bounds.x;
            yOffset = bounds.y;
            filterDiv.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            saveSettings({
                positionX: xOffset,
                positionY: yOffset
            });
        });

        // Initial filter application
        updateFilters();

        // Set up observer for dynamic content
        const observer = new MutationObserver(() => {
            // Delay the update slightly to ensure DOM is fully updated
            setTimeout(updateFilters, 100);
        });

        observer.observe(crimesContainer, {
            childList: true,
            subtree: true
        });
    });
})();
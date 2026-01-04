// ==UserScript==
// @name         CAS Auto Fill Tool
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Automated cycle and tag adding for CAS
// @author       Arjun Bridgelal
// @match        https://logistics.amazon.com/internal/cas*
// @match        https://logistics.amazon.ca/internal/cas?countryCode=CA*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541673/CAS%20Auto%20Fill%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/541673/CAS%20Auto%20Fill%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper Functions
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    function triggerEvents(element) {
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function fillInput(element, value) {
        if (element) {
            setNativeValue(element, value);
            triggerEvents(element);
        }
    }

    const waitForElement = async (selector, timeout = 5000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(r => setTimeout(r, 100));
        }
        return null;
    };

    // Cycle and Tag Configurations
    const rsrCyclesAndTags = {
        'AD_HOC_1': ['AD_HOC_1'],
        'AD_HOC_2': ['AD_HOC_2'],
        'AD_HOC_3': ['AD_HOC_3'],
        'AMXL_1': ['AMXL_1'],
        'CYCLE_1': ['CYCLE_1', 'AD_HOC_1', 'AD_HOC_2', 'AD_HOC_3', 'RTS_1', 'RTS_2', 'RTS_3', 'NO_SORT_CODE'],
        'RTS_1': ['RTS_1'],
        'RTS_2': ['RTS_2'],
        'RTS_3': ['RTS_3']
    };

    const amzlCyclesAndTags = {
        'CYCLE_1': ['CYCLE_1', 'CRTN', 'AD_HOC_1', 'AD_HOC_2', 'AD_HOC_3', 'RTS_1', 'RTS_2', 'RTS_3'],
        'AD_HOC_1': ['AD_HOC_1'],
        'AD_HOC_2': ['AD_HOC_2'],
        'AD_HOC_3': ['AD_HOC_3'],
        'RTS_1': ['RTS_1'],
        'RTS_2': ['RTS_2'],
        'RTS_3': ['RTS_3'],
        'CRTN_PICKUP_1': ['CRTN_PICKUP_1', 'CRTN'],
        'FER': ['FER'],
        'FER_2': ['FER_2'],
        'VOL_TRANS': ['VOL_TRANS']
    };

    const pfsdCyclesAndTags = {
        'SAME_DAY': ['SAME_DAY', 'Same_Auto', 'Same_Superzone_Auto', 'SAME_FLEX1'],
        'SAME_DAY_AM': ['SAME_DAY_AM', 'Same_Auto', 'Same_Superzone_Auto'],
        'SAME_DAY_SUNRISE': ['SAME_DAY_SUNRISE', 'Same_Auto', 'Same_Superzone_Auto']
    };

    const rushCyclesAndTags = {
        'CYCLE_RUSH_RAPID': ['CYCLE_RUSH_RAPID'],
        'CYCLE_RUSH_EXPR': ['CYCLE_RUSH_EXPR']
    };

    const amxlCyclesAndTags = {
        'AD_HOC_1': ['AD_HOC_1'],
        'AD_HOC_2': ['AD_HOC_2'],
        'AMXL_1': ['AMXL_1'],
        'RTS_1': ['RTS_1'],
        'RTS_2': ['RTS_2'],
        'CRTN_PICKUP_1': ['CRTN_PICKUP_1', 'Standard_1_CommR']
    };


        async function addTagsToExistingCycle(cycleName, tagsToAdd) {
        try {
            await waitForElement('.af-table.cycle-selection');
            const cycleRows = document.querySelectorAll('.af-table.cycle-selection tbody tr');
            console.log('Found cycle rows:', cycleRows.length);

            let targetRow = null;
            for (const row of cycleRows) {
                const cycleNameElement = row.querySelector('.cycle-summary strong');
                console.log('Checking cycle:', cycleNameElement?.textContent);

                if (cycleNameElement && cycleNameElement.textContent.trim() === cycleName) {
                    targetRow = row;
                    break;
                }
            }

            if (targetRow) {
                console.log('Found target cycle:', cycleName);
                const editButton = targetRow.querySelector('.cycle-actions .button-cycle-edit');
                if (editButton) {
                    editButton.click();
                    await new Promise(r => setTimeout(r, 1000));

                    for (const tag of tagsToAdd) {
                        console.log('Adding tag:', tag);
                        const tagInput = document.getElementById('cycle-tag-add-input');
                        if (!tagInput) {
                            console.log('Tag input not found');
                            continue;
                        }

                        tagInput.click();
                        await new Promise(r => setTimeout(r, 500));
                        fillInput(tagInput, tag);
                        await new Promise(r => setTimeout(r, 500));

                        const addTagButton = document.querySelector('.button-tag-add');
                        if (addTagButton) {
                            if (addTagButton.hasAttribute('disabled')) {
                                addTagButton.removeAttribute('disabled');
                            }
                            addTagButton.click();
                            await new Promise(r => setTimeout(r, 500));
                        }
                    }

                    await new Promise(r => setTimeout(r, 1000));
                    const doneButton = document.querySelector('.af-modal-actions .af-button.primary');
                    if (doneButton) {
                        doneButton.click();
                    }
                } else {
                    console.log('Edit button not found');
                }
            } else {
                console.log('Cycle not found:', cycleName);
            }
        } catch (error) {
            console.error('Error in adding tags to existing cycle:', error);
        }
    }

    async function addTagsForCycle(tags) {
        if (tags.length <= 1) {
            await new Promise(r => setTimeout(r, 1000));
            const doneButton = document.querySelector('.af-modal-actions .af-button.primary');
            if (doneButton) {
                doneButton.click();
            }
            return;
        }

        try {
            const extraTags = tags.slice(1);

            for (const tag of extraTags) {
                const tagInput = document.getElementById('cycle-tag-add-input');
                if (!tagInput) continue;

                tagInput.click();
                await new Promise(r => setTimeout(r, 500));
                fillInput(tagInput, tag);
                await new Promise(r => setTimeout(r, 500));

                const addTagButton = document.querySelector('.button-tag-add');
                if (addTagButton) {
                    if (addTagButton.hasAttribute('disabled')) {
                        addTagButton.removeAttribute('disabled');
                    }
                    addTagButton.click();
                    await new Promise(r => setTimeout(r, 500));
                }
            }

            await new Promise(r => setTimeout(r, 1000));
            const doneButton = document.querySelector('.af-modal-actions .af-button.primary');
            if (doneButton) {
                doneButton.click();
            }
        } catch (error) {
            console.log('Error in adding tags:', error);
        }
    }

    async function addCompleteCycle(cycleName, tags) {
        try {
            const dropdown = await waitForElement('.af-select__container__label');
            if (dropdown) {
                dropdown.click();
                await new Promise(r => setTimeout(r, 500));

                const options = document.querySelectorAll('.af-option');
                for (const option of options) {
                    if (option.textContent === cycleName) {
                        option.click();
                        await new Promise(r => setTimeout(r, 500));
                        document.body.click();
                        break;
                    }
                }
            }

            const addCycleButton = await waitForElement('.button-cycle-add');
            if (addCycleButton) {
                addCycleButton.click();
                await new Promise(r => setTimeout(r, 1000));
                await addTagsForCycle(tags);
                await new Promise(r => setTimeout(r, 1000));
            }
        } catch (error) {
            console.log('Error in cycle addition:', error);
        }
    }


        // Handler Functions
    async function handleRSRAutofill() {
        try {
            for (const [cycle, tags] of Object.entries(rsrCyclesAndTags)) {
                await addCompleteCycle(cycle, tags);
            }
            document.body.click();
        } catch (error) {
            console.log('Error in RSR autofill:', error);
        }
    }

    async function handleAMZLAutofill() {
        try {
            for (const [cycle, tags] of Object.entries(amzlCyclesAndTags)) {
                await addCompleteCycle(cycle, tags);
            }
            document.body.click();
        } catch (error) {
            console.log('Error in AMZL autofill:', error);
        }
    }

    async function handlePFSDAutofill() {
        try {
            for (const [cycle, tags] of Object.entries(pfsdCyclesAndTags)) {
                await addCompleteCycle(cycle, tags);
            }
            document.body.click();
        } catch (error) {
            console.log('Error in PFSD autofill:', error);
        }
    }

    async function handleRUSHAutofill() {
        try {
            for (const [cycle, tags] of Object.entries(rushCyclesAndTags)) {
                await addCompleteCycle(cycle, tags);
            }
            document.body.click();
        } catch (error) {
            console.log('Error in RUSH autofill:', error);
        }
    }

    async function handleAMXLAutofill() {
        try {
            for (const [cycle, tags] of Object.entries(amxlCyclesAndTags)) {
                await addCompleteCycle(cycle, tags);
            }
            document.body.click();
        } catch (error) {
            console.log('Error in AMXL autofill:', error);
        }
    }

    function addButtons() {
        // Define color scheme (Amazon Blue)
        const colors = {
            primary: '#232F3E',
            hover: '#37475A',
            background: '#131921',
            text: 'white'
        };

        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.style.cssText = `
            position: fixed;
            top: 5px;
            left: 20px;
            background-color: ${colors.background};
            border: 1px solid ${colors.primary};
            border-radius: 3px;
            padding: 5px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            width: 180px;
            overflow: hidden;
        `;

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            padding: 5px;
            background-color: ${colors.primary};
            color: ${colors.text};
            cursor: move;
            border-radius: 3px;
            margin-bottom: 5px;
            text-align: center;
            user-select: none;
            position: relative;
            width: 100%;
        `;

        dragHandle.innerHTML = 'CAS Auto Fill Tool';


                // Dragging functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            if (e.target === dragHandle) {
                isDragging = true;
                const rect = mainContainer.getBoundingClientRect();
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                const maxX = window.innerWidth - mainContainer.offsetWidth;
                const maxY = window.innerHeight - mainContainer.offsetHeight;
                currentX = Math.min(Math.max(0, currentX), maxX);
                currentY = Math.min(Math.max(0, currentY), maxY);
                mainContainer.style.left = `${currentX}px`;
                mainContainer.style.top = `${currentY}px`;
                mainContainer.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 5px;
            width: 100%;
        `;

        // Button style
        const buttonStyle = `
            padding: 10px;
            border: none;
            border-radius: 3px;
            background-color: ${colors.primary};
            color: ${colors.text};
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
            text-align: center;
            width: 100%;
        `;

        // Create button function
        const createButton = (text, onClick) => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.style.cssText = buttonStyle;
            button.onclick = onClick;
            button.addEventListener('mouseover', () => button.style.backgroundColor = colors.hover);
            button.addEventListener('mouseout', () => button.style.backgroundColor = colors.primary);
            return button;
        };

        // RSR Section
        const rsrSection = document.createElement('div');
        rsrSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const rsrHeader = createButton('▼ RSR Auto Fill');
        const rsrContent = document.createElement('div');
        rsrContent.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 5px;
            margin-left: 10px;
        `;

        // RSR buttons
        const rsrButtons = [
            {
                name: 'RSR Auto Fill',
                handler: handleRSRAutofill
            },
            {
                name: 'Add HUB Tags to C1',
                handler: () => addTagsToExistingCycle('CYCLE_1', ['HUB', '**HUB**'])
            },
            {
                name: 'Add HUB_DP_1',
                handler: () => addCompleteCycle('HUB_DP_1', ['HUB_DP_1', 'HUB', '**HUB**'])
            }
        ];

        rsrButtons.forEach(button => {
            const buttonElement = createButton(button.name, button.handler);
            rsrContent.appendChild(buttonElement);
        });

        // AMZL Button
        const amzlButton = createButton('AMZL Auto Fill', handleAMZLAutofill);


                // RUSH Section
        const rushSection = document.createElement('div');
        rushSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const rushHeader = createButton('▼ RUSH Auto Fill');
        const rushContent = document.createElement('div');
        rushContent.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 5px;
            margin-left: 10px;
        `;

        // RUSH Cycles
        const rushCycles = [
            { name: 'Rush Rapid', handler: () => addCompleteCycle('CYCLE_RUSH_RAPID', rushCyclesAndTags['CYCLE_RUSH_RAPID']) },
            { name: 'Rush Express', handler: () => addCompleteCycle('CYCLE_RUSH_EXPR', rushCyclesAndTags['CYCLE_RUSH_EXPR']) }
        ];

        rushCycles.forEach(cycle => {
            const cycleButton = createButton(cycle.name, cycle.handler);
            rushContent.appendChild(cycleButton);
        });

        // PFSD Section
        const pfsdSection = document.createElement('div');
        pfsdSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const pfsdHeader = createButton('▼ PFSD Auto Fill');
        const pfsdContent = document.createElement('div');
        pfsdContent.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 5px;
            margin-left: 10px;
        `;

        // PFSD Cycles
        const pfsdCycles = [
            { name: 'Same Day', handler: () => addCompleteCycle('SAME_DAY', pfsdCyclesAndTags['SAME_DAY']) },
            { name: 'Same Day AM', handler: () => addCompleteCycle('SAME_DAY_AM', pfsdCyclesAndTags['SAME_DAY_AM']) },
            { name: 'Same Day Sunrise', handler: () => addCompleteCycle('SAME_DAY_SUNRISE', pfsdCyclesAndTags['SAME_DAY_SUNRISE']) }
        ];

        pfsdCycles.forEach(cycle => {
            const cycleButton = createButton(cycle.name, cycle.handler);
            pfsdContent.appendChild(cycleButton);
        });

        // AMXL Section
        const amxlSection = document.createElement('div');
        amxlSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
        `;

        const amxlHeader = createButton('▼ AMXL Auto Fill');
        const amxlContent = document.createElement('div');
        amxlContent.style.cssText = `
            display: none;
            flex-direction: column;
            gap: 5px;
            margin-left: 10px;
        `;

        // AMXL Cycles
        const amxlCycles = [
            { name: 'All AMXL Cycles', handler: handleAMXLAutofill },
            { name: 'AD HOC 1', handler: () => addCompleteCycle('AD_HOC_1', amxlCyclesAndTags['AD_HOC_1']) },
            { name: 'AD HOC 2', handler: () => addCompleteCycle('AD_HOC_2', amxlCyclesAndTags['AD_HOC_2']) },
            { name: 'AMXL 1', handler: () => addCompleteCycle('AMXL_1', amxlCyclesAndTags['AMXL_1']) },
            { name: 'RTS 1', handler: () => addCompleteCycle('RTS_1', amxlCyclesAndTags['RTS_1']) },
            { name: 'RTS 2', handler: () => addCompleteCycle('RTS_2', amxlCyclesAndTags['RTS_2']) },
            { name: 'CRTN PICKUP 1', handler: () => addCompleteCycle('CRTN_PICKUP_1', amxlCyclesAndTags['CRTN_PICKUP_1']) }
        ];

        amxlCycles.forEach(cycle => {
            const cycleButton = createButton(cycle.name, cycle.handler);
            amxlContent.appendChild(cycleButton);
        });


                // Toggle functions
        rsrHeader.onclick = (e) => {
            e.stopPropagation();
            const isExpanded = rsrContent.style.display !== 'none';
            rsrContent.style.display = isExpanded ? 'none' : 'flex';
            rsrHeader.innerHTML = `RSR Auto Fill ${isExpanded ? '▼' : '▲'}`;
        };

        pfsdHeader.onclick = (e) => {
            e.stopPropagation();
            const isExpanded = pfsdContent.style.display !== 'none';
            pfsdContent.style.display = isExpanded ? 'none' : 'flex';
            pfsdHeader.innerHTML = `PFSD Auto Fill ${isExpanded ? '▼' : '▲'}`;
        };

        rushHeader.onclick = (e) => {
            e.stopPropagation();
            const isExpanded = rushContent.style.display !== 'none';
            rushContent.style.display = isExpanded ? 'none' : 'flex';
            rushHeader.innerHTML = `RUSH Auto Fill ${isExpanded ? '▼' : '▲'}`;
        };

        amxlHeader.onclick = (e) => {
            e.stopPropagation();
            const isExpanded = amxlContent.style.display !== 'none';
            amxlContent.style.display = isExpanded ? 'none' : 'flex';
            amxlHeader.innerHTML = `AMXL Auto Fill ${isExpanded ? '▼' : '▲'}`;
        };

        // Collapse button
        const collapseButton = document.createElement('button');
        collapseButton.innerHTML = '▼';
        collapseButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 2px 6px;
            background: none;
            border: none;
            color: ${colors.text};
            cursor: pointer;
        `;

        collapseButton.onclick = (e) => {
            e.stopPropagation();
            const isCollapsed = buttonContainer.style.display === 'none';
            buttonContainer.style.display = isCollapsed ? 'flex' : 'none';
            collapseButton.innerHTML = isCollapsed ? '▲' : '▼';
            if (isCollapsed) {
                rsrContent.style.display = 'none';
                pfsdContent.style.display = 'none';
                rushContent.style.display = 'none';
                amxlContent.style.display = 'none';
                rsrHeader.innerHTML = 'RSR Auto Fill ▼';
                pfsdHeader.innerHTML = 'PFSD Auto Fill ▼';
                rushHeader.innerHTML = 'RUSH Auto Fill ▼';
                amxlHeader.innerHTML = 'AMXL Auto Fill ▼';
            }
        };

        // Prevent drag when clicking buttons
        const preventDrag = (e) => e.stopPropagation();
        buttonContainer.addEventListener('mousedown', preventDrag);
        collapseButton.addEventListener('mousedown', preventDrag);

        // Assemble the UI
        dragHandle.appendChild(collapseButton);
        rsrSection.appendChild(rsrHeader);
        rsrSection.appendChild(rsrContent);
        rushSection.appendChild(rushHeader);
        rushSection.appendChild(rushContent);
        amxlSection.appendChild(amxlHeader);
        amxlSection.appendChild(amxlContent);
        pfsdSection.appendChild(pfsdHeader);
        pfsdSection.appendChild(pfsdContent);

        buttonContainer.appendChild(rsrSection);
        buttonContainer.appendChild(amzlButton);
        buttonContainer.appendChild(rushSection);
        buttonContainer.appendChild(amxlSection);
        buttonContainer.appendChild(pfsdSection);

        mainContainer.appendChild(dragHandle);
        mainContainer.appendChild(buttonContainer);
        document.body.appendChild(mainContainer);
    }

    // Initialize buttons when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButtons);
    } else {
        addButtons();
    }
})();



// ============================================================================================================
//                                              AD_HOC_1
// ============================================================================================================



// ==UserScript==
// @name         RTW Auto Fill Tool 2.0
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  RTW Auto Fill Tool for AMZL, AMXL, RSR, SSD
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545999/RTW%20Auto%20Fill%20Tool%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/545999/RTW%20Auto%20Fill%20Tool%2020.meta.js
// ==/UserScript==

//AD_HOC_1

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on an AD_HOC_1 page
    if (!window.location.href.includes('34d64e17-3e72-45da-897b-036a06da6ff1')) {
        return;
    }




const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};



    // Keep the original sections structure
    const sections = [
    {
        name: 'AMXL AD_HOC_1',
        configKey: 'AMXL_AD_HOC_1',
        buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
    },
    {
        name: 'AMZL AD_HOC_1',
        configKey: 'AMZL_AD_HOC_1',
        buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
    },
    {
        name: 'RSR AD_HOC_1',
        configKey: 'RSR_AD_HOC_1',
        buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
    }
];

        // All cycle configurations
    const cycleConfigurations = {
        'AMZL_AD_HOC_1': {
            type: 'AMZL',
            cycleName: 'AD_HOC_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "ADHOC_1",
                        prefix: "AX",
                        departTime: "12:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "ADHOC_1",
                        vccCodes: ["ADHOC_1"]
                    }
                ]
            }
        },
        'AMXL_AD_HOC_1': {
            type: 'AMXL',
            cycleName: 'AD_HOC_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Crash_1",
                        prefix: "PDD",
                        departTime: "07:30"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Crash_1",
                        vccCodes: ["Crash_1"]
                    }
                ]
            }
        },
        'RSR_AD_HOC_1': {
    type: 'RSR',
    cycleName: 'AD_HOC_1',
    generalInfo: {
        cycleSettings: {
            planningOpenTime: "00:00",
            openMinutes: "800",
            nextDayCutoff: "20:00"
        },
        clusters: [
            {
                name: "Adhoc_1",
                prefix: "AX",
                departTime: "12:00"
            }
        ]
    },
    volumeMappingConfigs: {
        stationArrivalCutoff: false,
        clusters: [
            {
                name: "Adhoc_1",
                vccCodes: ["Adhoc_1"]
            }

                ]
            }
        }
    };


        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

        // Form Filling Functions
    async function fillClusterForm(cluster, index) {
    console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

    const nameInput = await waitForElement(`#clusterCode-${index}`);
    const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
    const departTimeInput = await waitForElement(`#departTime-${index}`);

    if (nameInput && prefixInput && departTimeInput) {
        fillInput(nameInput, cluster.name);
        await new Promise(resolve => setTimeout(resolve, 200));

        fillInput(prefixInput, cluster.prefix);
        await new Promise(resolve => setTimeout(resolve, 200));

        if (cluster.departTimeMessage) {
            createPopup(cluster.departTimeMessage);
        }

        if (cluster.departTime) {
            fillInput(departTimeInput, cluster.departTime);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        return true;
    }
    return false;
}

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
    for (let i = 0; i < clusters.length; i++) {
        // Try all possible selectors for the Add Cluster button
        const addButton = await waitForElement('button.css-c6ayu0') || // Light mode
                         await waitForElement('button[aria-label="Add Cluster"]') || // Try aria-label
                         await waitForElement('button.css-1t4qwh') || // Possible dark mode class
                         document.querySelector('button:contains("Add Cluster")'); // Fallback

        console.log('Searching for Add Cluster button...');

        if (addButton) {
            console.log('Found Add Cluster button, clicking...');
            addButton.click();
            await new Promise(resolve => setTimeout(resolve, 500)); // Reduced from 1000 to match original

            console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
            await fillClusterForm(clusters[i], i);
            await new Promise(resolve => setTimeout(resolve, 500)); // Reduced timing
        } else {
            console.error('Could not find Add Cluster button');
            break;
        }
    }
}

 async function switchToGeneralInfoTab() {
    console.log('Attempting to switch to General Info tab...');

    const tab = await waitForElement('.css-14dbfau');

    if (tab && tab.textContent.trim() === 'General Info') {
        console.log('Found General Info tab, clicking...');
        tab.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    console.error('Could not find General Info tab');
    return false;
}



async function fillAllTextFields(config) {
    console.log('\n=== Starting General Info Text Fields Fill ===');

    // Switch to General Info tab first
    await switchToGeneralInfoTab();

    console.log('Starting text field fill...');
    await fillCycleSettings(config.generalInfo.cycleSettings);
    await new Promise(resolve => setTimeout(resolve, 500)); // Reduced timing to match original

    console.log('Starting cluster addition...');
    await addAndFillClusters(config.generalInfo.clusters);
    console.log('=== Text Field Fill Complete ===');
}



    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
    console.log('\n=== Starting Volume Mappings Fill ===');

    const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
    if (volumeMappingsTab) {
        volumeMappingsTab.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Handle Station Arrival Cutoff first
    console.log('Handling Station Arrival Cutoff...');
    const cycleSettingsSection = document.querySelector('.css-dsf1ob');
    if (cycleSettingsSection) {
        const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle) {
            console.log('Found Station Arrival Cutoff toggle');

            // Check if toggle needs to be changed
            if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                console.log('Turning off Station Arrival Cutoff...');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                console.log('Turning on Station Arrival Cutoff...');
                toggle.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (config.volumeMappingConfigs.stationArrivalMessage) {
                    createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                }

                if (config.volumeMappingConfigs.stationArrivalTime) {
                    const timeInput = document.querySelector('#stationArrivalCutoffs');
                    if (timeInput) {
                        fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        }
    }

    // Process each cluster's volume mappings
    const sections = document.querySelectorAll('.css-uz15kn');
    for (let section of sections) {
        const titleElement = section.querySelector('.css-a4ni36');
        if (!titleElement) continue;

        const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
            titleElement.textContent.includes(conf.name)
        );
        if (!clusterConfig) continue;

        const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
        if (dropdown) {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                    const editButton = Array.from(section.querySelectorAll('button'))
                        .find(button => button.textContent.includes('Edit'));

                    if (editButton) {
                        editButton.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const textarea = document.querySelector('textarea');
                        if (textarea) {
                            const vccCodes = clusterConfig.vccCodes.join('\n');
                            setNativeValue(textarea, vccCodes);
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const saveButton = document.querySelector('button.css-2cbc2h');
                            if (saveButton) {
                                saveButton.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }
            }
        }
    }

    console.log('=== Volume Mappings Fill Complete ===');
}



    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }


        // UI Creation
   function createUI() {
    // Check if we're on an AD_HOC_1 page
    const isAdHoc1Page = window.location.href.includes('34d64e17-3e72-45da-897b-036a06da6ff1');

    // Create main container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '10px';
    container.style.bottom = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '5px';

    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.style.width = '200px';
    dragHandle.style.height = '20px';
    dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
    dragHandle.style.cursor = 'move';
    dragHandle.style.borderRadius = '5px 5px 0 0';
    dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

    // Add drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        container.style.bottom = 'auto';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        container.style.left = `${currentX}px`;
        container.style.top = `${currentY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Create main toggle button
    const mainToggle = document.createElement('button');
    mainToggle.innerHTML = '▼ AD_HOC_1 Auto Fill';
    styleMainButton(mainToggle);

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'none';
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.marginTop = '5px';
    contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
    contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
    contentContainer.style.borderRadius = '5px';
    contentContainer.style.padding = '10px';
    contentContainer.style.maxHeight = '80vh';
    contentContainer.style.overflowY = 'auto';
    contentContainer.style.gap = '10px';

    // Main toggle functionality
    mainToggle.onclick = () => {
        const isOpen = contentContainer.style.display !== 'none';
        contentContainer.style.display = isOpen ? 'none' : 'flex';
        mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} AD_HOC_1 Auto Fill`;
    };

    // Create sections
    sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.style.display = 'flex';
        sectionDiv.style.flexDirection = 'column';
        sectionDiv.style.gap = '5px';
        sectionDiv.style.marginBottom = '10px';

        const sectionToggle = document.createElement('button');
        sectionToggle.innerHTML = `▼ ${section.name}`;
        sectionToggle.setAttribute('data-section-name', section.name); // Store name as data attribute
        styleSectionToggle(sectionToggle);

        const sectionContent = document.createElement('div');
        sectionContent.style.display = 'none';
        sectionContent.style.flexDirection = 'column';
        sectionContent.style.marginLeft = '15px';
        sectionContent.style.marginTop = '5px';
        sectionContent.style.gap = '5px';

        // Section toggle functionality
        sectionToggle.onclick = () => {
            const isOpen = sectionContent.style.display !== 'none';
            sectionContent.style.display = isOpen ? 'none' : 'flex';
            sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

            // Get all section divs but filter out any non-section elements
            const allSectionToggles = Array.from(
                contentContainer.querySelectorAll('button[data-section-name]')
            ).filter(toggle => toggle !== sectionToggle);

            // Handle other sections
            allSectionToggles.forEach(otherToggle => {
                const otherContent = otherToggle.nextElementSibling;
                if (!isOpen) {
                    // Transform to line
                    otherToggle.style.height = '2px';
                    otherToggle.style.padding = '0';
                    otherToggle.style.fontSize = '0';
                    otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                    otherToggle.innerHTML = '';
                    if (otherContent) {
                        otherContent.style.display = 'none';
                    }
                } else {
                    // Restore normal appearance
                    const originalName = otherToggle.getAttribute('data-section-name');
                    otherToggle.style.height = '';
                    otherToggle.style.padding = '8px';
                    otherToggle.style.fontSize = '15px';
                    otherToggle.innerHTML = `▼ ${originalName}`;
                }
            });
        };

        // Create action buttons
        section.buttons.forEach((buttonText, index) => {
            const button = document.createElement('button');
            button.innerHTML = `${index + 1}. ${buttonText}`;
            styleActionButton(button);
            button.style.marginTop = '5px';

            button.onclick = () => {
                const config = cycleConfigurations[section.configKey];
                if (config) {
                    switch(buttonText) {
                        case 'General Info: Text':
                            fillAllTextFields(config);
                            break;
                        case 'General Info: Dropdowns':
                            fillAllDropdowns(config);
                            break;
                        case 'Volume Mappings':
                            fillVolumeMappings(config);
                            break;
                    }
                } else {
                    console.error(`Configuration not found for ${section.configKey}`);
                }
            };

            sectionContent.appendChild(button);
        });

        sectionDiv.appendChild(sectionToggle);
        sectionDiv.appendChild(sectionContent);
        contentContainer.appendChild(sectionDiv);
    });

    // Add components to container in order
    container.appendChild(dragHandle);
    container.appendChild(mainToggle);
    container.appendChild(contentContainer);
    document.body.appendChild(container);
}



    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();




// ============================================================================================================
//                                              AD_HOC_2
// ============================================================================================================





// ==UserScript==
// @name         RTW Auto Fill Tool - AD_HOC_2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for AD_HOC_2 (AMZL, AMXL, RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on an AD_HOC_2 page
    if (!window.location.href.includes('e31a14cf-8b2e-45d7-a703-579d384ab10b')) {
        return;
    }


const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMXL AD_HOC_2',
            configKey: 'AMXL_AD_HOC_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'AMZL AD_HOC_2',
            configKey: 'AMZL_AD_HOC_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'RSR AD_HOC_2',
            configKey: 'RSR_AD_HOC_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
        'AMZL_AD_HOC_2': {
            type: 'AMZL',
            cycleName: 'AD_HOC_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "ADHOC_2",
                        prefix: "AV",
                        departTime: "14:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "ADHOC_2",
                        vccCodes: ["ADHOC_2"]
                    }
                ]
            }
        },
        'AMXL_AD_HOC_2': {
            type: 'AMXL',
            cycleName: 'AD_HOC_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Emergency_2",
                        prefix: "EMC",
                        departTime: "07:30"
                    },
                    {
                        name: "Crash_2",
                        prefix: "CRC",
                        departTime: "07:30"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Emergency_2",
                        vccCodes: ["Emergency_2"]
                    },
                    {
                        name: "Crash_2",
                        vccCodes: ["Crash_2"]
                    }
                ]
            }
        },
        'RSR_AD_HOC_2': {
            type: 'RSR',
            cycleName: 'AD_HOC_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "Adhoc_2",
                        prefix: "AV",
                        departTime: "12:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Adhoc_2",
                        vccCodes: ["Adhoc_2"]
                    }
                ]
            }
        }
    };

        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ AD_HOC_2 Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} AD_HOC_2 Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              AD_HOC_3
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - AD_HOC_3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for AD_HOC_3 (AMZL, RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on an AD_HOC_3 page
    if (!window.location.href.includes('aca147f1-6766-4559-94a6-bc664cfd1c06')) {
        return;
    }

const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL AD_HOC_3',
            configKey: 'AMZL_AD_HOC_3',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'RSR AD_HOC_3',
            configKey: 'RSR_AD_HOC_3',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
        'AMZL_AD_HOC_3': {
            type: 'AMZL',
            cycleName: 'AD_HOC_3',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "ADHOC_3",
                        prefix: "AT",
                        departTime: "16:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "ADHOC_3",
                        vccCodes: ["ADHOC_3"]
                    }
                ]
            }
        },
        'RSR_AD_HOC_3': {
            type: 'RSR',
            cycleName: 'AD_HOC_3',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "Adhoc_3",
                        prefix: "AT",
                        departTime: "12:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Adhoc_3",
                        vccCodes: ["Adhoc_3"]
                    }
                ]
            }
        }
    };


        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ AD_HOC_3 Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} AD_HOC_3 Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              RTS_1
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - RTS_1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for RTS_1 (AMZL, AMXL, RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on a RTS_1 page
    if (!window.location.href.includes('eeb34597-2386-4aa7-92a9-3918a2160dc1')) {
        return;
    }

   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMXL RTS_1',
            configKey: 'AMXL_RTS_1',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'AMZL RTS_1',
            configKey: 'AMZL_RTS_1',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'RSR RTS_1',
            configKey: 'RSR_RTS_1',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
        'AMZL_RTS_1': {
            type: 'AMZL',
            cycleName: 'RTS_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_1",
                        prefix: "RX",
                        departTime: "12:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_1",
                        vccCodes: ["RTS_1"]
                    }
                ]
            }
        },
        'AMXL_RTS_1': {
            type: 'AMXL',
            cycleName: 'RTS_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Scrub_1",
                        prefix: "SC",
                        departTime: "07:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Scrub_1",
                        vccCodes: ["Scrub_1"]
                    }
                ]
            }
        },
        'RSR_RTS_1': {
            type: 'RSR',
            cycleName: 'RTS_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_1",
                        prefix: "RX",
                        departTime: "17:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_1",
                        vccCodes: ["RTS_1"]
                    }
                ]
            }
        }
    };


        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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


        async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }


        async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ RTS_1 Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} RTS_1 Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              RTS_2
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - RTS_2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for RTS_2 (AMZL, AMXL, RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on a RTS_2 page
    if (!window.location.href.includes('ce5d1e05-5d6f-4203-a867-b4eaa0554ccc')) {
        return;
    }

   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMXL RTS_2',
            configKey: 'AMXL_RTS_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'AMZL RTS_2',
            configKey: 'AMZL_RTS_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'RSR RTS_2',
            configKey: 'RSR_RTS_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
        'AMZL_RTS_2': {
            type: 'AMZL',
            cycleName: 'RTS_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_2",
                        prefix: "RV",
                        departTime: "14:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_2",
                        vccCodes: ["RTS_2"]
                    }
                ]
            }
        },
        'AMXL_RTS_2': {
            type: 'AMXL',
            cycleName: 'RTS_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Scrub_2",
                        prefix: "SCC",
                        departTime: "12:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Scrub_2",
                        vccCodes: ["Scrub_2"]
                    }
                ]
            }
        },
        'RSR_RTS_2': {
            type: 'RSR',
            cycleName: 'RTS_2',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_2",
                        prefix: "RV",
                        departTime: "17:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_2",
                        vccCodes: ["RTS_2"]
                    }
                ]
            }
        }
    };


        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {

        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ RTS_2 Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} RTS_2 Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();




// ============================================================================================================
//                                              RTS_3
// ============================================================================================================





// ==UserScript==
// @name         RTW Auto Fill Tool - RTS_3
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for RTS_3 (AMZL, RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on a RTS_3 page
    if (!window.location.href.includes('17344411-99c1-4530-bddc-bb950c8185b0')) {
        return;
    }

   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL RTS_3',
            configKey: 'AMZL_RTS_3',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        },
        {
            name: 'RSR RTS_3',
            configKey: 'RSR_RTS_3',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
        'AMZL_RTS_3': {
            type: 'AMZL',
            cycleName: 'RTS_3',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_3",
                        prefix: "RT",
                        departTime: "16:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_3",
                        vccCodes: ["RTS_3"]
                    }
                ]
            }
        },
        'RSR_RTS_3': {
            type: 'RSR',
            cycleName: 'RTS_3',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "RTS_3",
                        prefix: "RT",
                        departTime: "17:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "RTS_3",
                        vccCodes: ["RTS_3"]
                    }
                ]
            }
        }
    };

    // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ RTS_3 Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} RTS_3 Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              FER
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - FER
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for FER (AMZL)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on a FER page
    if (!window.location.href.includes('a79ca9b1-77d1-4b2e-b5f9-9920d00ea145')) {
        return;
    }

   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};
    const sections = [
        {
            name: 'AMZL FER',
            configKey: 'AMZL_FER',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
    'AMZL_FER': {
        type: 'AMZL',
        cycleName: 'FER',
        generalInfo: {
            cycleSettings: {
                planningOpenTime: "00:00",
                openMinutes: "105",
                nextDayCutoff: "23:00"
            },
            clusters: [
                {
                    name: "FER_1",
                    prefix: "FX",
                    departTime: "19:00"
                }
            ]
        },
        dropdownConfigs: {
            sortType: 'DYNAMIC',
            routingAlgorithm: 'DYNAMIC-PLANNER'
        },
        volumeMappingConfigs: {
            stationArrivalCutoff: false,
            clusters: [
                {
                    name: "FER_1",
                    vccCodes: ["FER_1"]
                }
            ]
        },
        labourMappingConfigs: {
            settings: {
                hideYesterdayLabour: false,
                schedulingAutomation: true,
                planFinalization: false,
                dspRecycling: false
            },
            clusters: [
                {
                    name: "FER_1",
                    serviceType: "AmFlex Vehicle",
                    shiftTime: "105",
                    labourDepartTime: "19:00",
                    scheduleLaborFiniteQuantity: false,
                    unmappedLabourMapsToCluster: true
                }
            ]
        }
    }
};

        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }



        async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            // Handle Hide Yesterday's Labour
if (sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
    const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
    if (toggle) {
        const shouldBeChecked = settings.hideYesterdayLabour === true;
        if (toggle.checked !== shouldBeChecked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle DSP Recycling
            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Plan Finalization
            if (settings.planFinalization === false &&
                sectionText.includes('Plan Finalization')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set Labour Depart Time
                if (cluster.labourDepartTime) {
                    const timeInput = Array.from(clusterSection.querySelectorAll('input[id^="timepicker-"]'))
                        .find(input => {
                            const label = input.closest('.css-14lg5yy')?.querySelector('label');
                            return label && label.textContent.includes('Labour Depart Time');
                        });

                    if (timeInput) {
                        fillInput(timeInput, cluster.labourDepartTime);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Fill Order
                    if (sectionText.includes('Fill order') && cluster.fillOrder) {
                        const fillOrderDropdown = section.querySelector('.css-1hmh5e9[role="combobox"]');
                        if (fillOrderDropdown) {
                            const mouseDown = new MouseEvent('mousedown', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            fillOrderDropdown.dispatchEvent(mouseDown);
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const options = document.querySelectorAll('[role="option"]');
                            const fillOrderOption = Array.from(options).find(opt =>
                                opt.textContent.trim() === cluster.fillOrder.toString()
                            );

                            if (fillOrderOption) {
                                fillOrderOption.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ FER Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'none';  // Ensure it starts hidden
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.marginTop = '5px';
    contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
    contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
    contentContainer.style.borderRadius = '5px';
    contentContainer.style.padding = '10px';
    contentContainer.style.maxHeight = '80vh';
    contentContainer.style.overflowY = 'auto';
    contentContainer.style.gap = '10px';

    // Main toggle functionality
    mainToggle.onclick = () => {
        const isOpen = contentContainer.style.display !== 'none';
        contentContainer.style.display = isOpen ? 'none' : 'flex';  // Use 'flex' when showing
        mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} FER Auto Fill`;
    };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();


// ============================================================================================================
//                                              FER_2
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - FER_2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for FER_2 (AMZL)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
let lastUrl = window.location.href;
let refreshTimeout = null;

// Function to extract cycle ID from URL
function getCycleIdFromUrl(url) {
    const specificCycleId = 'abd3e14b-6749-42bc-9ca0-9a378b701676';
    const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    if (match && match[0] === specificCycleId) {
        return match[0];
    }
    return null;
}

// Create observer to watch for URL changes
const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (lastUrl !== currentUrl) {
        const lastCycleId = getCycleIdFromUrl(lastUrl);
        const currentCycleId = getCycleIdFromUrl(currentUrl);

        // Only refresh if the cycle ID has changed
        if (lastCycleId !== currentCycleId) {
            console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
            refreshTimeout = setTimeout(() => {
                window.location.reload();
            }, 100);
        }

        lastUrl = currentUrl;
    }
});

// Start observing
observer.observe(document, {
    subtree: true,
    childList: true
});

// Only proceed if we're on a FER page
if (!window.location.href.includes('abd3e14b-6749-42bc-9ca0-9a378b701676')) {
    return;
}


  const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};
    const sections = [
        {
            name: 'AMZL FER_2',
            configKey: 'AMZL_FER_2',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    // Cycle configurations
    const cycleConfigurations = {
    'AMZL_FER_2': {
        type: 'AMZL',
        cycleName: 'FER_2',
        generalInfo: {
            cycleSettings: {
                planningOpenTime: "08:00",
                openMinutes: "105",
                nextDayCutoff: "23:00"
            },
            clusters: [
                {
                    name: "FER_2",
                    prefix: "FV",
                    departTime: "19:00"
                }
            ]
        },
        dropdownConfigs: {
            sortType: 'DYNAMIC',
            routingAlgorithm: 'DYNAMIC-PLANNER'
        },
        volumeMappingConfigs: {
            stationArrivalCutoff: false,
            clusters: [
                {
                    name: "FER_2",
                    vccCodes: ["FER_2"]
                }
            ]
        },
        labourMappingConfigs: {
            settings: {
                hideYesterdayLabour: false,
                schedulingAutomation: true,
                planFinalization: false,
                dspRecycling: false
            },
            clusters: [
                {
                    name: "FER_2",
                    serviceType: "AmFlex Vehicle",
                    shiftTime: "105",
                    labourDepartTime: "19:00",
                    scheduleLaborFiniteQuantity: false,
                    unmappedLabourMapsToCluster: true
                }
            ]
        }
    }
};

        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }



        async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            // Handle Hide Yesterday's Labour
if (sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
    const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
    if (toggle) {
        const shouldBeChecked = settings.hideYesterdayLabour === true;
        if (toggle.checked !== shouldBeChecked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle DSP Recycling
            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Plan Finalization
            if (settings.planFinalization === false &&
                sectionText.includes('Plan Finalization')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set Labour Depart Time
                if (cluster.labourDepartTime) {
                    const timeInput = Array.from(clusterSection.querySelectorAll('input[id^="timepicker-"]'))
                        .find(input => {
                            const label = input.closest('.css-14lg5yy')?.querySelector('label');
                            return label && label.textContent.includes('Labour Depart Time');
                        });

                    if (timeInput) {
                        fillInput(timeInput, cluster.labourDepartTime);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Fill Order
                    if (sectionText.includes('Fill order') && cluster.fillOrder) {
                        const fillOrderDropdown = section.querySelector('.css-1hmh5e9[role="combobox"]');
                        if (fillOrderDropdown) {
                            const mouseDown = new MouseEvent('mousedown', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            fillOrderDropdown.dispatchEvent(mouseDown);
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const options = document.querySelectorAll('[role="option"]');
                            const fillOrderOption = Array.from(options).find(opt =>
                                opt.textContent.trim() === cluster.fillOrder.toString()
                            );

                            if (fillOrderOption) {
                                fillOrderOption.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }


        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ FER_2 Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'none';  // Ensure it starts hidden
    contentContainer.style.flexDirection = 'column';
    contentContainer.style.marginTop = '5px';
    contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
    contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
    contentContainer.style.borderRadius = '5px';
    contentContainer.style.padding = '10px';
    contentContainer.style.maxHeight = '80vh';
    contentContainer.style.overflowY = 'auto';
    contentContainer.style.gap = '10px';

    // Main toggle functionality
    mainToggle.onclick = () => {
        const isOpen = contentContainer.style.display !== 'none';
        contentContainer.style.display = isOpen ? 'none' : 'flex';  // Use 'flex' when showing
        mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} FER_2 Auto Fill`;
    };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();


// ============================================================================================================
//                                              AMXL_1
// ============================================================================================================



// ==UserScript==
// @name         RTW Auto Fill Tool - AMXL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for AMXL (Standard, FutureScheduled, Exclusion)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on an AMXL page
    if (!window.location.href.includes('3a1891de-86c8-461d-a4b0-f314ad7fbf0a')) {
        return;
    }

   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMXL',
            configKey: 'AMXL_AMXL_1',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        },
        {
            name: 'RSR AMXL',
            configKey: 'RSR_AMXL_1',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];


        const cycleConfigurations = {
        'AMXL_AMXL_1': {
            type: 'AMXL',
            cycleName: 'AMXL_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "15:00"
                },
                clusters: [
                    {
                        name: "Standard_1",
                        prefix: "XL",
                        departTime: "06:00"
                    },
                    {
                        name: "FutureScheduled_1",
                        prefix: "FS",
                        departTime: "06:00"
                    },
                    {
                        name: "Exclusion_1",
                        prefix: "EX",
                        departTime: "06:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-AMXL'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Standard_1",
                        vccCodes: [
                            "Standard_1",
                            "MultiCycle",
                            "Standard_1_CommH",
                            "Standard_1_CommM",
                            "Standard_1_CommU",
                            "Standard_1_CommR",
                            "Standard_1_R_Comm",
                            "Standard_1_CommMU",
                            "Standard_1_CommS2PT",
                            "Standard_1_CommS"
                        ]
                    },
                    {
                        name: "FutureScheduled_1",
                        vccCodes: [
                            "FutureScheduled_1",
                            "StickyExclusion"
                        ]
                    },
                    {
                        name: "Exclusion_1",
                        vccCodes: [
                            "Exclusion_1",
                            "Exclusion_2"
                        ]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "Standard_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "600",
                        labourDepartTime: "17:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    },
                    {
                        name: "FutureScheduled_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "600",
                        labourDepartTime: "06:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 1
                    },
                    {
                        name: "Exclusion_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "600",
                        labourDepartTime: "08:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 2
                    }
                ]
            }
        },
        'RSR_AMXL_1': {
            type: 'RSR',
            cycleName: 'AMXL_1',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    { name: "Standard_1", prefix: "XL", departTime: "06:10" },
                    { name: "UDS_BASIC", prefix: "UB", departTime: "18:00" },
                    { name: "Professional_1", prefix: "PO", departTime: "06:00" },
                    { name: "Appliance_1", prefix: "MA", departTime: "18:00" },
                    { name: "FutureScheduled_1", prefix: "FS", departTime: "06:00" },
                    { name: "Exclusion_1", prefix: "EX", departTime: "06:00" }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-AMXL'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "Standard_1",
                        vccCodes: [
                            "Standard_1",
                            "Standard_1_Comm",
                            "Standard_1_CommH",
                            "Standard_1_R_Comm"
                        ]
                    },
                    {
                        name: "UDS_BASIC",
                        vccCodes: ["UDS_BASIC"]
                    },
                    {
                        name: "Professional_1",
                        vccCodes: ["Professional_1"]
                    },
                    {
                        name: "Appliance_1",
                        vccCodes: ["Appliance_1"]
                    },
                    {
                        name: "FutureScheduled_1",
                        vccCodes: ["FutureScheduled_1"]
                    },
                    {
                        name: "Exclusion_1",
                        vccCodes: ["Exclusion_1"]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: false,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "Standard_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "540",
                        labourDepartTime: "10:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    },
                    {
                        name: "UDS_BASIC",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "540",
                        labourDepartTime: "10:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 3
                    },
                    {
                        name: "Professional_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "540",
                        labourDepartTime: "10:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 4
                    },
                    {
                        name: "Appliance_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "540",
                        labourDepartTime: "10:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 5
                    },
                    {
                        name: "FutureScheduled_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "540",
                        labourDepartTime: "10:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 1
                    },
                    {
                        name: "Exclusion_1",
                        serviceType: "AMXL Infinity Route",
                        shiftTime: "540",
                        labourDepartTime: "10:20",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: false,
                        fillOrder: 2
                    }
                ]
            }
        }
    };



        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
        const clusterCount = config.generalInfo.clusters.length;
        for (let i = 0; i < clusterCount; i++) {
            await setDropdownValue(`routingAlgorithm-${i}`, 'DYNAMIC-AMXL');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process each cluster's volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

    async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

// Handle Hide Yesterday's Labour
if (sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
    const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
    if (toggle) {
        const shouldBeChecked = config.type === 'AMXL'; // true for AMXL_AMXL, false for RSR_AMXL
        if (toggle.checked !== shouldBeChecked) {
            console.log(`Setting Hide Yesterday's Labour to ${shouldBeChecked ? 'ON' : 'OFF'} for ${config.type} type`);
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle DSP Recycling
            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Plan Finalization
            if (settings.planFinalization === false &&
                sectionText.includes('Plan Finalization')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set Labour Depart Time
                if (cluster.labourDepartTime) {
                    const timeInput = Array.from(clusterSection.querySelectorAll('input[id^="timepicker-"]'))
                        .find(input => {
                            const label = input.closest('.css-14lg5yy')?.querySelector('label');
                            return label && label.textContent.includes('Labour Depart Time');
                        });

                    if (timeInput) {
                        fillInput(timeInput, cluster.labourDepartTime);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Fill Order
                    if (sectionText.includes('Fill order') && cluster.fillOrder) {
                        const fillOrderDropdown = section.querySelector('.css-1hmh5e9[role="combobox"]');
                        if (fillOrderDropdown) {
                            const mouseDown = new MouseEvent('mousedown', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            fillOrderDropdown.dispatchEvent(mouseDown);
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const options = document.querySelectorAll('[role="option"]');
                            const fillOrderOption = Array.from(options).find(opt =>
                                opt.textContent.trim() === cluster.fillOrder.toString()
                            );

                            if (fillOrderOption) {
                                fillOrderOption.click();
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }

        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ AMXL Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} AMXL Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              SAME_DAY_SUNRISE
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - Same Day Sunrise
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for Same Day Sunrise
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Only proceed if we're on a Same Day Sunrise page
    if (!window.location.href.includes('c8c4f476-adc0-45b1-aa79-93c9974aa677')) {
        return;
    }

    const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL Same Day Sunrise',
            configKey: 'AMZL_SAME_DAY_SUNRISE',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    const cycleConfigurations = {
        'AMZL_SAME_DAY_SUNRISE': {
            type: 'AMZL',
            cycleName: 'SAME_DAY_SUNRISE',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "02:30"
                },
                clusters: [
                    {
                        name: "SAME_DAY_SUNRISE",
                        prefix: "SA",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Breakfast window as Depart Time."
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: null,
                stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Breakfast window as Station Arrival Cutoff.",
                clusters: [
                    {
                        name: "SAME_DAY_SUNRISE",
                        vccCodes: ["SAME_DAY_SUNRISE"]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "SAME_DAY_SUNRISE",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "165",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Breakfast window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        }
    };

    // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Found Add Cluster button:', addButton);

            if (addButton) {
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                await setDropdownValue(`routingAlgorithm-${i}`, 'DYNAMIC-PLANNER');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }
                }
            }
        }

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === 'VCC'
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }


    async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            // Handle Hide Yesterday's Labour
            if (settings.hideYesterdayLabour === true &&
                sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

             // Handle Plan Finalization - ensure it's OFF
    if (sectionText.includes('Plan Finalization')) {
        const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle && toggle.checked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

            // Handle DSP Recycling
            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }

    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '300px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '300px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ SAME_DAY_SUNRISE Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} SAME_DAY_SUNRISE Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();


// ============================================================================================================
//                                              SAME_DAY_AM
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - Same Day AM
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for Same Day AM (AMZL and RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: a2e095e6-69d2-4509-8c81-39cb8e15b7c7');
    console.log('URLs match:', window.location.href.includes('a2e095e6-69d2-4509-8c81-39cb8e15b7c7'));

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            console.log('URL changed to:', currentUrl);
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Modified check to ensure script runs
    if (!window.location.href.includes('a2e095e6-69d2-4509-8c81-39cb8e15b7c7')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');

    // Rest of your script remains the same...


    // Only proceed if we're on a Same Day AM page
    if (!window.location.href.includes('a2e095e6-69d2-4509-8c81-39cb8e15b7c7')) {
        return;
    }


const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL Same Day AM',
            configKey: 'AMZL_SAME_DAY_AM',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        },
        {
            name: 'RSR Same Day AM',
            configKey: 'RSR_SAME_DAY_AM',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    const cycleConfigurations = {
        'AMZL_SAME_DAY_AM': {
            type: 'AMZL',
            cycleName: 'SAME_DAY_AM',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "06:00"
                },
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        prefix: "SB",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Depart Time."
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: null,
                stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Brunch window as Station Arrival Cutoff.",
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        vccCodes: ["SAME_DAY_AM"]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "165",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        },
        'RSR_SAME_DAY_AM': {
            type: 'RSR',
            cycleName: 'SAME_DAY_AM',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "06:00"
                },
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        prefix: "SB",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Depart Time."
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: null,
                stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Brunch window as Station Arrival Cutoff.",
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        vccCodes: ["SAME_DAY_AM"]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "SAME_DAY_AM",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "240",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        }
    };

        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Styling Functions with increased widths
    function styleMainButton(button) {
        button.style.width = '250px';  // Increased width
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '250px';  // Increased width
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '250px';  // Increased width
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

        // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Found Add Cluster button:', addButton);

            if (addButton) {
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                await setDropdownValue(`routingAlgorithm-${i}`, 'DYNAMIC-PLANNER');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }
                }
            }
        }

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === 'VCC'
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }
    async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            // Handle Hide Yesterday's Labour
            if (settings.hideYesterdayLabour === true &&
                sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Plan Finalization - ensure it's OFF
    if (sectionText.includes('Plan Finalization')) {
        const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle && toggle.checked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

            // Handle DSP Recycling
            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '250px';  // Matches main button width
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ SAME_DAY_AM Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} SAME_DAY_AM Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              SAME DAY
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - Same Day
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for Same Day (AMZL and RSR)
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: 8cde3688-1a61-45e2-b9ef-72482bb9668d');
    console.log('URLs match:', window.location.href.includes('8cde3688-1a61-45e2-b9ef-72482bb9668d'));

    // Only proceed if we're on a Same Day page
    if (!window.location.href.includes('8cde3688-1a61-45e2-b9ef-72482bb9668d')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');

    const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL Same Day',
            configKey: 'AMZL_SAME_DAY',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        },
        {
            name: 'RSR Same Day',
            configKey: 'RSR_SAME_DAY',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    const cycleConfigurations = {
        'AMZL_SAME_DAY': {
            type: 'AMZL',
            cycleName: 'SAME_DAY',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "19:00"
                },
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        prefix: "SV",
                        departTime: "17:00"
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: "21:30",
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        clusterType: "CATCH_ALL"
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "225",
                        labourDepartTime: "17:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        },
        'RSR_SAME_DAY': {
            type: 'RSR',
            cycleName: 'SAME_DAY',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "19:00"
                },
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        prefix: "SV",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Depart Time."
                    }
                ]
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: "21:30",
                clusters: [
                    { name: "SAME_FLEX1", clusterType: "CATCH_ALL" }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "SAME_FLEX1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "240",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Brunch window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        }
    };

    // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Found Add Cluster button:', addButton);

            if (addButton) {
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                await setDropdownValue(`routingAlgorithm-${i}`, 'DYNAMIC-PLANNER');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Update this section in the fillVolumeMappings function
console.log('Handling Station Arrival Cutoff...');
const cycleSettingsSection = document.querySelector('.css-dsf1ob');
if (cycleSettingsSection) {
    const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
    if (toggle) {
        if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
            console.log('Turning on Station Arrival Cutoff...');
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Always handle the time input if stationArrivalCutoff is true
        if (config.volumeMappingConfigs.stationArrivalCutoff === true) {
            const timeInput = document.querySelector('#stationArrivalCutoffs');
            if (timeInput) {
                console.log('Clearing existing time value...');
                // First clear the existing value
                fillInput(timeInput, '');
                await new Promise(resolve => setTimeout(resolve, 500));

                console.log('Setting new time value to 21:30...');
                // Then set the new value
                fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
}


        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === (clusterConfig.clusterType || 'VCC')
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (!clusterConfig.clusterType && clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

    async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            // Handle Hide Yesterday's Labour
            if (settings.hideYesterdayLabour === true &&
                sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        // Handle Plan Finalization - ensure it's OFF
    if (sectionText.includes('Plan Finalization')) {
        const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle && toggle.checked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

            // Handle DSP Recycling
            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
}

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set Labour Depart Time
                if (cluster.labourDepartTime) {
                    const timeInput = Array.from(clusterSection.querySelectorAll('input[id^="timepicker-"]'))
                        .find(input => {
                            const label = input.closest('.css-14lg5yy')?.querySelector('label');
                            return label && label.textContent.includes('Labour Depart Time');
                        });

                    if (timeInput) {
                        fillInput(timeInput, cluster.labourDepartTime);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }

    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '200px';  // Increased width
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '200px';  // Increased width
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '200px';  // Increased width
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '200px';  // Matches main button width
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ SAME_DAY Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} SAME_DAY Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;

                // Get all section toggles but filter out the current one
                const allSectionToggles = Array.from(
                    contentContainer.querySelectorAll('button[data-section-name]')
                ).filter(toggle => toggle !== sectionToggle);

                // Handle other sections
                allSectionToggles.forEach(otherToggle => {
                    const otherContent = otherToggle.nextElementSibling;
                    if (!isOpen) {
                        // Transform to line
                        otherToggle.style.height = '2px';
                        otherToggle.style.padding = '0';
                        otherToggle.style.fontSize = '0';
                        otherToggle.style.backgroundColor = COLOR_SCHEME.sectionBackground;
                        otherToggle.innerHTML = '';
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    } else {
                        // Restore normal appearance
                        const originalName = otherToggle.getAttribute('data-section-name');
                        otherToggle.style.height = '';
                        otherToggle.style.padding = '8px';
                        otherToggle.style.fontSize = '15px';
                        otherToggle.innerHTML = `▼ ${originalName}`;
                    }
                });
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();


// ============================================================================================================
//                                              SAME_DAY_DINNER
// ============================================================================================================



// ==UserScript==
// @name         RTW Auto Fill Tool - Same Day Dinner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for Same Day Dinner
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

        // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: 2e03b0e7-2970-4344-adab-dc4c96989015');
    console.log('URLs match:', window.location.href.includes('2e03b0e7-2970-4344-adab-dc4c96989015'));

    // Only proceed if we're on a Same Day Dinner page
    if (!window.location.href.includes('2e03b0e7-2970-4344-adab-dc4c96989015')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');


   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL Same Day Dinner',
            configKey: 'AMZL_SAME_DAY_DINNER',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    const cycleConfigurations = {
        'AMZL_SAME_DAY_DINNER': {
            type: 'AMZL',
            cycleName: 'SAME_DAY_DINNER',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "13:00"
                },
                clusters: [
                    {
                        name: "SAME_DAY_DINNER",
                        prefix: "SD",
                        departTime: "",
                        departTimeMessage: "Refer to Ops clock snip attached to SIM for Depart Time. Use Dispatch Wave 1 Start for SSD Dinner window as Depart Time."
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: null,
                stationArrivalMessage: "Refer to Ops clock snip attached to SIM for Station Arrival Cutoff. Use CET end time for SSD Dinner window as Station Arrival Cutoff.",
                clusters: [
                    {
                        name: "SAME_DAY_DINNER",
                        vccCodes: ["SAME_DAY_DINNER"]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "SAME_DAY_DINNER",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "210",
                        labourDepartMessage: "Refer to Ops clock snip attached to SIM for Labour Depart Time. Use Dispatch Wave 1 Start for SSD Dinner window as Labour Depart Time.",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        }
    };

        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    function logElement(element, label = 'Element') {
        console.log(`${label}:`, {
            tagName: element?.tagName,
            id: element?.id,
            className: element?.className,
            role: element?.getAttribute('role'),
            'aria-controls': element?.getAttribute('aria-controls'),
            'aria-expanded': element?.getAttribute('aria-expanded'),
            textContent: element?.textContent?.trim()
        });
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }


        // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Found Add Cluster button:', addButton);

            if (addButton) {
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                await setDropdownValue(`routingAlgorithm-${i}`, 'DYNAMIC-PLANNER');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

        async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }
                }
            }
        }

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === 'VCC'
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

    async function fillLabourMappings(config) {
        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            if (settings.hideYesterdayLabour === true &&
                sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (sectionText.includes('Plan Finalization')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (settings.dspRecycling === false &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            if (cluster.labourDepartMessage) {
                createPopup(cluster.labourDepartMessage);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }



        // Styling Functions
    function styleMainButton(button) {
        button.style.width = '300px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '280px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }



        // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '300px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ SAME_DAY_DINNER Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} SAME_DAY_DINNER Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }


    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              CYCLE_1
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - AMZL Cycle 1 Sort to Zone
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for AMZL Cycle 1 Sort to Zone
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: dfc3989b-67cf-4005-ad2d-4049f56ba9e8');
    console.log('URLs match:', window.location.href.includes('dfc3989b-67cf-4005-ad2d-4049f56ba9e8'));

    // Only proceed if we're on an AMZL Cycle 1 Sort to Zone page
    if (!window.location.href.includes('dfc3989b-67cf-4005-ad2d-4049f56ba9e8')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');

   const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL Cycle 1 Sort to Zone',
            configKey: 'AMZL_CYCLE_1_SORT_TO_ZONE',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    const cycleConfigurations = {
        'AMZL_CYCLE_1_SORT_TO_ZONE': {
            type: 'AMZL',
            cycleName: 'CYCLE_1_SORT_TO_ZONE',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "1439",
                    nextDayCutoff: "13:00"
                },
                clusters: [
                    {
                        name: "STATIC_1",
                        prefix: "CX",
                        departTime: "09:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'SORT_TO_ZONE'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: true,
                stationArrivalTime: "12:30",
                swaForecastStrategy: "Exclude",
                clusters: [
                    {
                        name: "STATIC_1",
                        clusterType: "CATCH_ALL",
                        transportType: "Any"
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: false
                },
                clusters: [
                    {
                        name: "STATIC_1",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "240",
                        labourDepartTime: "12:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        }
    };

    // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(departTimeInput, cluster.departTime);
            await new Promise(resolve => setTimeout(resolve, 200));

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Found Add Cluster button:', addButton);

            if (addButton) {
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs.sortType;
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('Handling Station Arrival Cutoff...');
const cycleSettingsSection = document.querySelector('.css-dsf1ob');
if (cycleSettingsSection) {
    const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
    if (toggle) {
        // Ensure toggle is on
        if (!toggle.checked) {
            console.log('Turning on Station Arrival Cutoff...');
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Always set the time, regardless of existing value
        const timeInput = document.querySelector('#stationArrivalCutoffs');
        if (timeInput && config.volumeMappingConfigs.stationArrivalTime) {
            console.log('Setting Station Arrival Time to:', config.volumeMappingConfigs.stationArrivalTime);
            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}


        // Set SWA Forecast Strategy
        await setDropdownValue('swaForecastStrategy', config.volumeMappingConfigs.swaForecastStrategy);

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === clusterConfig.clusterType
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Set Transport Type
                    if (clusterConfig.transportType) {
                        const transportTypeDropdown = section.querySelector('.css-wkvjgb[role="combobox"]');
                        if (transportTypeDropdown) {
                            await setDropdownValue(transportTypeDropdown.id, clusterConfig.transportType);
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

    async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

       // Handle top section settings
for (const section of toggleSections) {
    const sectionText = section.textContent;

    // Handle Hide Yesterday's Labour
    if (sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
        const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle && !toggle.checked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Handle Scheduling Automation
    if (settings.schedulingAutomation === true &&
        sectionText.includes('Scheduling Automation')) {
        const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle && !toggle.checked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Handle Plan Finalization - ensure it's OFF
    if (sectionText.includes('Plan Finalization')) {
        const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
        if (toggle && toggle.checked) {
            toggle.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}


        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    await setDropdownValue(serviceTypeDropdown.id, cluster.serviceType);
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set Labour Depart Time
                const timeInput = Array.from(clusterSection.querySelectorAll('input[id^="timepicker-"]'))
                    .find(input => {
                        const label = input.closest('.css-14lg5yy')?.querySelector('label');
                        return label && label.textContent.includes('Labour Depart Time');
                    });

                if (timeInput) {
                    fillInput(timeInput, cluster.labourDepartTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    // Handle Schedule labour with finite quantity toggle
                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    // Handle Unmapped labour maps to this cluster toggle
                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }

    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '300px';  // Increased width
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '380px';  // Increased width
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '340px';  // Increased width
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '300px';  // Matches main button width
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ CYCLE_1 Sort to Zone Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} CYCLE_1 Sort to Zone Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();



// ============================================================================================================
//                                              VOL_TRANS
// ============================================================================================================




// ==UserScript==
// @name         RTW Auto Fill Tool - VOL_TRANS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for VOL_TRANS
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: f0a8c0f4-3ebb-4107-927f-e0750357e70b');
    console.log('URLs match:', window.location.href.includes('f0a8c0f4-3ebb-4107-927f-e0750357e70b'));

    // Only proceed if we're on a VOL_TRANS page
    if (!window.location.href.includes('f0a8c0f4-3ebb-4107-927f-e0750357e70b')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');

    const COLOR_SCHEME = {
    mainBackground: '#FDFAF6',   // Warm off-white
    mainBorder: '#E8E6E1',      // Warm light gray border
    mainHover: '#F5F1E8',       // Warmer off-white
    mainTextColor: '#4A4A4A',   // Warm dark gray text
    sectionBackground: '#FAF9F7', // Subtle warm white
    sectionHover: '#F2EFE9',     // Slightly warmer off-white
    sectionTextColor: '#656565', // Warm medium gray text
    cycleBackground: '#FDFAF6',  // Warm off-white
    cycleHover: '#F5F1E8',      // Warmer off-white
    cycleTextColor: '#4A4A4A',   // Warm dark gray text
    actionBackground: '#FFFFFF', // Pure white
    actionHover: '#F9F7F4',     // Very light warm gray
    actionTextColor: '#787878',  // Warm medium-dark gray text
    dropdownBg: '#FDFAF6',      // Warm off-white
    dropdownHover: '#F5F1E8'    // Warmer off-white
};

    const sections = [
        {
            name: 'AMZL VOL_TRANS',
            configKey: 'VOL_TRANS',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings', 'Labour Mappings']
        }
    ];

    const cycleConfigurations = {
        'VOL_TRANS': {
            type: 'AMZL',
            cycleName: 'VOL_TRANS',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "00:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "VOL_TRANS",
                        prefix: "VT",
                        departTime: "12:00"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "VOL_TRANS",
                        vccCodes: ["VOL_TRANS"]
                    }
                ]
            },
            labourMappingConfigs: {
                settings: {
                    hideYesterdayLabour: true,
                    schedulingAutomation: true,
                    planFinalization: false,
                    dspRecycling: true
                },
                clusters: [
                    {
                        name: "VOL_TRANS",
                        serviceType: "AmFlex Vehicle",
                        shiftTime: "240",
                        labourDepartTime: "13:00",
                        scheduleLaborFiniteQuantity: false,
                        unmappedLabourMapsToCluster: true
                    }
                ]
            }
        }
    };

        // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

        async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (config.volumeMappingConfigs.stationArrivalCutoff === true && !toggle.checked) {
                    console.log('Turning on Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (config.volumeMappingConfigs.stationArrivalMessage) {
                        createPopup(config.volumeMappingConfigs.stationArrivalMessage);
                    }

                    if (config.volumeMappingConfigs.stationArrivalTime) {
                        const timeInput = document.querySelector('#stationArrivalCutoffs');
                        if (timeInput) {
                            fillInput(timeInput, config.volumeMappingConfigs.stationArrivalTime);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === 'VCC'
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

        async function fillLabourMappings(config) {
        if (!config.labourMappingConfigs) {
            console.log('No labour mapping configurations found for this cycle');
            return;
        }

        console.log('\n=== Starting Labour Mappings Fill ===');

        const labourMappingsTab = await waitForElement('input[value="labour-mappings"]');
        if (labourMappingsTab) {
            labourMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const settings = config.labourMappingConfigs.settings;
        const toggleSections = document.querySelectorAll('.css-uhaq8');

        // Handle top section settings
        for (const section of toggleSections) {
            const sectionText = section.textContent;

            // Handle Hide Yesterday's Labour
            if (settings.hideYesterdayLabour === true &&
                sectionText.includes('Hide Use Yesterday\'s Labour Button')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Scheduling Automation
            if (settings.schedulingAutomation === true &&
                sectionText.includes('Scheduling Automation')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle Plan Finalization - ensure it's OFF
            if (sectionText.includes('Plan Finalization')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Handle DSP Recycling
            if (settings.dspRecycling === true &&
                sectionText.includes('DSP Recycling')) {
                const toggle = section.querySelector('input[type="checkbox"][role="switch"]');
                if (toggle && !toggle.checked) {
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process each cluster's labour settings
        for (const cluster of config.labourMappingConfigs.clusters) {
            console.log(`\nConfiguring labour settings for cluster: ${cluster.name}`);

            const sections = document.querySelectorAll('.css-uz15kn');
            const clusterSection = Array.from(sections).find(section =>
                section.textContent.includes(cluster.name)
            );

            if (clusterSection) {
                // Set Service Type
                const serviceTypeDropdown = clusterSection.querySelector('.css-wkvjgb[role="combobox"]');
                if (serviceTypeDropdown) {
                    const mouseDown = new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    serviceTypeDropdown.dispatchEvent(mouseDown);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    const options = document.querySelectorAll('[role="option"]');
                    const targetOption = Array.from(options).find(option =>
                        option.textContent.trim() === cluster.serviceType
                    );

                    if (targetOption) {
                        targetOption.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Set Shift Time
                const shiftTimeInput = clusterSection.querySelector('input[aria-label="Shift time (mins)"]');
                if (shiftTimeInput) {
                    fillInput(shiftTimeInput, cluster.shiftTime);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Set Labour Depart Time
                if (cluster.labourDepartTime) {
                    const timeInput = Array.from(clusterSection.querySelectorAll('input[id^="timepicker-"]'))
                        .find(input => {
                            const label = input.closest('.css-14lg5yy')?.querySelector('label');
                            return label && label.textContent.includes('Labour Depart Time');
                        });

                    if (timeInput) {
                        fillInput(timeInput, cluster.labourDepartTime);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                // Handle cluster-specific toggles
                const toggleSections = clusterSection.querySelectorAll('.css-1irdh6e');
                for (const section of toggleSections) {
                    const sectionText = section.textContent;

                    if (sectionText.includes('Schedule labour with finite quantity')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.scheduleLaborFiniteQuantity) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }

                    if (sectionText.includes('Unmapped labour maps to this cluster')) {
                        const toggle = section.querySelector('input[type="checkbox"]');
                        if (toggle && toggle.checked !== cluster.unmappedLabourMapsToCluster) {
                            toggle.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        }

        console.log('=== Labour Mappings Fill Complete ===');
    }

    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '250px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '250px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '250px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ VOL_TRANS Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} VOL_TRANS Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                            case 'Labour Mappings':
                                fillLabourMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();




// ============================================================================================================
//                                              RUSH EXPRESS
// ============================================================================================================


// ==UserScript==
// @name         RTW Auto Fill Tool - Rush Express
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for Rush Express
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: 9f556844-7f1e-46e5-8604-2c0b8cc7f70e');
    console.log('URLs match:', window.location.href.includes('9f556844-7f1e-46e5-8604-2c0b8cc7f70e'));

    // Only proceed if we're on a Rush Express page
    if (!window.location.href.includes('9f556844-7f1e-46e5-8604-2c0b8cc7f70e')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');

    const COLOR_SCHEME = {
        mainBackground: '#FDFAF6',
        mainBorder: '#E8E6E1',
        mainHover: '#F5F1E8',
        mainTextColor: '#4A4A4A',
        sectionBackground: '#FAF9F7',
        sectionHover: '#F2EFE9',
        sectionTextColor: '#656565',
        cycleBackground: '#FDFAF6',
        cycleHover: '#F5F1E8',
        cycleTextColor: '#4A4A4A',
        actionBackground: '#FFFFFF',
        actionHover: '#F9F7F4',
        actionTextColor: '#787878',
        dropdownBg: '#FDFAF6',
        dropdownHover: '#F5F1E8'
    };

    const sections = [
        {
            name: 'CYCLE_RUSH_EXPR',
            configKey: 'CYCLE_RUSH_EXPR',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    const cycleConfigurations = {
        'CYCLE_RUSH_EXPR': {
            type: 'RUSH',
            cycleName: 'CYCLE_RUSH_EXPR',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "08:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "CYCLE_RUSH_EXPR",
                        prefix: "E",
                        departTime: "07:30"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "CYCLE_RUSH_EXPR",
                        vccCodes: ["CYCLE_RUSH_EXPR"]
                    }
                ]
            }
        }
    };

    // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }

    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === 'VCC'
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '250px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '250px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '250px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ Rush Express Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} Rush Express Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();


// ============================================================================================================
//                                              RUSH RAPID
// ============================================================================================================

// ==UserScript==
// @name         RTW Auto Fill Tool - Rush Rapid
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  RTW Auto Fill Tool for Rush Rapid
// @author       Arjun Bridgelal
// @match        https://na.cluster-config.planning.last-mile.a2z.com/cluster-config/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Watch for URL changes
    let lastUrl = window.location.href;
    let refreshTimeout = null;

    // Function to extract cycle ID from URL
    function getCycleIdFromUrl(url) {
        const match = url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
        return match ? match[0] : null;
    }

    // Create observer to watch for URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (lastUrl !== currentUrl) {
            const lastCycleId = getCycleIdFromUrl(lastUrl);
            const currentCycleId = getCycleIdFromUrl(currentUrl);

            // Only refresh if the cycle ID has changed
            if (lastCycleId !== currentCycleId) {
                console.log('Cycle ID changed from', lastCycleId, 'to', currentCycleId);
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }
                refreshTimeout = setTimeout(() => {
                    window.location.reload();
                }, 100);
            }

            lastUrl = currentUrl;
        }
    });

    // Start observing
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // Debug logging for URL and UUID matching
    console.log('Current URL:', window.location.href);
    const currentUUID = window.location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    console.log('Detected UUID:', currentUUID);
    console.log('Looking for UUID: a97cbd29-0572-4b40-a2c4-e1057278ca95');
    console.log('URLs match:', window.location.href.includes('a97cbd29-0572-4b40-a2c4-e1057278ca95'));

    // Only proceed if we're on a Rush Rapid page
    if (!window.location.href.includes('a97cbd29-0572-4b40-a2c4-e1057278ca95')) {
        console.log('UUID not found in URL, script stopping');
        return;
    }

    console.log('UUID matched, continuing with script execution');

    const COLOR_SCHEME = {
        mainBackground: '#FDFAF6',
        mainBorder: '#E8E6E1',
        mainHover: '#F5F1E8',
        mainTextColor: '#4A4A4A',
        sectionBackground: '#FAF9F7',
        sectionHover: '#F2EFE9',
        sectionTextColor: '#656565',
        cycleBackground: '#FDFAF6',
        cycleHover: '#F5F1E8',
        cycleTextColor: '#4A4A4A',
        actionBackground: '#FFFFFF',
        actionHover: '#F9F7F4',
        actionTextColor: '#787878',
        dropdownBg: '#FDFAF6',
        dropdownHover: '#F5F1E8'
    };

    const sections = [
        {
            name: 'CYCLE_RUSH_RAPID',
            configKey: 'CYCLE_RUSH_RAPID',
            buttons: ['General Info: Text', 'General Info: Dropdowns', 'Volume Mappings']
        }
    ];

    const cycleConfigurations = {
        'CYCLE_RUSH_RAPID': {
            type: 'RUSH',
            cycleName: 'CYCLE_RUSH_RAPID',
            generalInfo: {
                cycleSettings: {
                    planningOpenTime: "08:00",
                    openMinutes: "800",
                    nextDayCutoff: "20:00"
                },
                clusters: [
                    {
                        name: "CYCLE_RUSH_RAPID",
                        prefix: "S",
                        departTime: "07:30"
                    }
                ]
            },
            dropdownConfigs: {
                sortType: 'DYNAMIC',
                routingAlgorithm: 'DYNAMIC-PLANNER'
            },
            volumeMappingConfigs: {
                stationArrivalCutoff: false,
                clusters: [
                    {
                        name: "CYCLE_RUSH_RAPID",
                        vccCodes: ["CYCLE_RUSH_RAPID"]
                    }
                ]
            }
        }
    };

    // Helper Functions
    function createPopup(message) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = COLOR_SCHEME.mainBackground;
        popup.style.padding = '20px';
        popup.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        popup.style.borderRadius = '5px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '400px';
        popup.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        popup.style.color = COLOR_SCHEME.mainTextColor;

        const messageText = document.createElement('p');
        messageText.textContent = message;
        messageText.style.margin = '0 0 15px 0';
        messageText.style.fontSize = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '5px 15px';
        okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        okButton.style.color = COLOR_SCHEME.mainTextColor;
        okButton.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        okButton.style.borderRadius = '3px';
        okButton.style.cursor = 'pointer';
        okButton.style.float = 'right';

        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });

        okButton.onclick = () => {
            document.body.removeChild(popup);
        };

        popup.appendChild(messageText);
        popup.appendChild(okButton);
        document.body.appendChild(popup);
    }

    async function waitForElement(selector, timeout = 2000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return null;
    }

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

    async function setDropdownValue(elementId, value) {
        console.log(`Attempting to set ${elementId} to ${value}`);

        const dropdown = document.querySelector(`#${elementId}[role="combobox"]`);
        if (!dropdown) {
            console.log(`Dropdown ${elementId} not found`);
            return false;
        }

        try {
            const mouseDown = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            dropdown.dispatchEvent(mouseDown);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const options = document.querySelectorAll('[role="option"]');
            const targetOption = Array.from(options).find(option =>
                option.textContent.trim() === value
            );

            if (targetOption) {
                targetOption.click();
                await new Promise(resolve => setTimeout(resolve, 200));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error setting dropdown value:', error);
            return false;
        }
    }

    // Form Filling Functions
    async function fillClusterForm(cluster, index) {
        console.log(`Filling cluster ${index + 1}: ${cluster.name}`);

        const nameInput = await waitForElement(`#clusterCode-${index}`);
        const prefixInput = await waitForElement(`#clusterPrefix-${index}`);
        const departTimeInput = await waitForElement(`#departTime-${index}`);

        if (nameInput && prefixInput && departTimeInput) {
            fillInput(nameInput, cluster.name);
            await new Promise(resolve => setTimeout(resolve, 200));

            fillInput(prefixInput, cluster.prefix);
            await new Promise(resolve => setTimeout(resolve, 200));

            if (cluster.departTimeMessage) {
                createPopup(cluster.departTimeMessage);
            }

            if (cluster.departTime) {
                fillInput(departTimeInput, cluster.departTime);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return true;
        }
        return false;
    }

    async function fillCycleSettings(config) {
        const planningOpenTime = document.getElementById('planningOpenTime');
        const openMinutes = document.getElementById('openMinutes');
        const nextDayCutoff = document.getElementById('nextDayCutoff');

        if (planningOpenTime) fillInput(planningOpenTime, config.planningOpenTime);
        if (openMinutes) fillInput(openMinutes, config.openMinutes);
        if (nextDayCutoff) fillInput(nextDayCutoff, config.nextDayCutoff);
    }

    async function addAndFillClusters(clusters) {
        for (let i = 0; i < clusters.length; i++) {
            const addButton = await waitForElement('button.css-c6ayu0') ||
                             await waitForElement('button[aria-label="Add Cluster"]') ||
                             await waitForElement('button.css-1t4qwh') ||
                             document.querySelector('button:contains("Add Cluster")');

            console.log('Searching for Add Cluster button...');

            if (addButton) {
                console.log('Found Add Cluster button, clicking...');
                addButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                console.log(`Attempting to fill cluster form for ${clusters[i].name}`);
                await fillClusterForm(clusters[i], i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                console.error('Could not find Add Cluster button');
                break;
            }
        }
    }


    async function switchToGeneralInfoTab() {
        console.log('Attempting to switch to General Info tab...');

        const tab = await waitForElement('.css-14dbfau');

        if (tab && tab.textContent.trim() === 'General Info') {
            console.log('Found General Info tab, clicking...');
            tab.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true;
        }

        console.error('Could not find General Info tab');
        return false;
    }

    async function fillAllTextFields(config) {
        console.log('\n=== Starting General Info Text Fields Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting text field fill...');
        await fillCycleSettings(config.generalInfo.cycleSettings);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Starting cluster addition...');
        await addAndFillClusters(config.generalInfo.clusters);
        console.log('=== Text Field Fill Complete ===');
    }

    async function fillAllDropdowns(config) {
        console.log('\n=== Starting General Info Dropdowns Fill ===');

        await switchToGeneralInfoTab();

        console.log('Starting dropdown fill...');
        const sortType = config.dropdownConfigs?.sortType || 'DYNAMIC';
        await setDropdownValue('sortType', sortType);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (sortType !== 'SORT_TO_ZONE') {
            const clusterCount = config.generalInfo.clusters.length;
            for (let i = 0; i < clusterCount; i++) {
                const routingAlgorithm = config.type === 'AMXL' ? 'DYNAMIC-AMXL' : 'DYNAMIC-PLANNER';
                await setDropdownValue(`routingAlgorithm-${i}`, routingAlgorithm);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('=== Dropdown Fill Complete ===');
    }

    async function fillVolumeMappings(config) {
        console.log('\n=== Starting Volume Mappings Fill ===');

        const volumeMappingsTab = await waitForElement('input[value="volume-mappings"]');
        if (volumeMappingsTab) {
            volumeMappingsTab.click();
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Handle Station Arrival Cutoff first
        console.log('Handling Station Arrival Cutoff...');
        const cycleSettingsSection = document.querySelector('.css-dsf1ob');
        if (cycleSettingsSection) {
            const toggle = cycleSettingsSection.querySelector('input[type="checkbox"][role="switch"]');
            if (toggle) {
                console.log('Found Station Arrival Cutoff toggle');

                if (config.volumeMappingConfigs.stationArrivalCutoff === false && toggle.checked) {
                    console.log('Turning off Station Arrival Cutoff...');
                    toggle.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        // Process cluster volume mappings
        const sections = document.querySelectorAll('.css-uz15kn');
        for (let section of sections) {
            const titleElement = section.querySelector('.css-a4ni36');
            if (!titleElement) continue;

            const clusterConfig = config.volumeMappingConfigs.clusters.find(conf =>
                titleElement.textContent.includes(conf.name)
            );
            if (!clusterConfig) continue;

            const dropdown = section.querySelector('.css-rd6znd[role="combobox"]');
            if (dropdown) {
                const mouseDown = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                dropdown.dispatchEvent(mouseDown);
                await new Promise(resolve => setTimeout(resolve, 1000));

                const options = document.querySelectorAll('[role="option"]');
                const targetOption = Array.from(options).find(option =>
                    option.textContent.trim() === 'VCC'
                );

                if (targetOption) {
                    targetOption.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    if (clusterConfig.vccCodes) {
                        const editButton = Array.from(section.querySelectorAll('button'))
                            .find(button => button.textContent.includes('Edit'));

                        if (editButton) {
                            editButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));

                            const textarea = document.querySelector('textarea');
                            if (textarea) {
                                const vccCodes = clusterConfig.vccCodes.join('\n');
                                setNativeValue(textarea, vccCodes);
                                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const saveButton = document.querySelector('button.css-2cbc2h');
                                if (saveButton) {
                                    saveButton.click();
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log('=== Volume Mappings Fill Complete ===');
    }

    // Styling Functions
    function styleMainButton(button) {
        button.style.width = '250px';
        button.style.padding = '10px';
        button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        button.style.border = `3px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '5px';
        button.style.color = COLOR_SCHEME.mainTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.mainBackground;
        });
    }

    function styleSectionToggle(button) {
        button.style.width = '250px';
        button.style.padding = '8px';
        button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        button.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '4px';
        button.style.color = COLOR_SCHEME.sectionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.fontWeight = 'bold';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.sectionBackground;
        });
    }

    function styleActionButton(button) {
        button.style.width = '240px';
        button.style.padding = '6px';
        button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        button.style.border = `1px solid ${COLOR_SCHEME.mainBorder}`;
        button.style.borderRadius = '3px';
        button.style.color = COLOR_SCHEME.actionTextColor;
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '15px';
        button.style.textAlign = 'left';

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionHover;
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = COLOR_SCHEME.actionBackground;
        });
    }

    // UI Creation
    function createUI() {
        // Create main container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '5px';

        // Create drag handle
        const dragHandle = document.createElement('div');
        dragHandle.style.width = '250px';
        dragHandle.style.height = '20px';
        dragHandle.style.backgroundColor = COLOR_SCHEME.mainBackground;
        dragHandle.style.cursor = 'move';
        dragHandle.style.borderRadius = '5px 5px 0 0';
        dragHandle.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;

        // Add drag functionality
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            initialX = e.clientX - rect.left;
            initialY = e.clientY - rect.top;
            container.style.bottom = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            container.style.left = `${currentX}px`;
            container.style.top = `${currentY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Create main toggle button
        const mainToggle = document.createElement('button');
        mainToggle.innerHTML = '▼ Rush Rapid Auto Fill';
        styleMainButton(mainToggle);

        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'none';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.marginTop = '5px';
        contentContainer.style.backgroundColor = COLOR_SCHEME.mainBackground;
        contentContainer.style.border = `2px solid ${COLOR_SCHEME.mainBorder}`;
        contentContainer.style.borderRadius = '5px';
        contentContainer.style.padding = '10px';
        contentContainer.style.maxHeight = '80vh';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.gap = '10px';

        // Main toggle functionality
        mainToggle.onclick = () => {
            const isOpen = contentContainer.style.display !== 'none';
            contentContainer.style.display = isOpen ? 'none' : 'flex';
            mainToggle.innerHTML = `${isOpen ? '▼' : '▲'} Rush Rapid Auto Fill`;
        };

        // Create sections
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.style.display = 'flex';
            sectionDiv.style.flexDirection = 'column';
            sectionDiv.style.gap = '5px';
            sectionDiv.style.marginBottom = '10px';

            const sectionToggle = document.createElement('button');
            sectionToggle.innerHTML = `▼ ${section.name}`;
            sectionToggle.setAttribute('data-section-name', section.name);
            styleSectionToggle(sectionToggle);

            const sectionContent = document.createElement('div');
            sectionContent.style.display = 'none';
            sectionContent.style.flexDirection = 'column';
            sectionContent.style.marginLeft = '15px';
            sectionContent.style.marginTop = '5px';
            sectionContent.style.gap = '5px';

            // Section toggle functionality
            sectionToggle.onclick = () => {
                const isOpen = sectionContent.style.display !== 'none';
                sectionContent.style.display = isOpen ? 'none' : 'flex';
                sectionToggle.innerHTML = `${isOpen ? '▼' : '▲'} ${section.name}`;
            };

            // Create action buttons
            section.buttons.forEach((buttonText, index) => {
                const button = document.createElement('button');
                button.innerHTML = `${index + 1}. ${buttonText}`;
                styleActionButton(button);
                button.style.marginTop = '5px';

                button.onclick = () => {
                    const config = cycleConfigurations[section.configKey];
                    if (config) {
                        switch(buttonText) {
                            case 'General Info: Text':
                                fillAllTextFields(config);
                                break;
                            case 'General Info: Dropdowns':
                                fillAllDropdowns(config);
                                break;
                            case 'Volume Mappings':
                                fillVolumeMappings(config);
                                break;
                        }
                    } else {
                        console.error(`Configuration not found for ${section.configKey}`);
                    }
                };

                sectionContent.appendChild(button);
            });

            sectionDiv.appendChild(sectionToggle);
            sectionDiv.appendChild(sectionContent);
            contentContainer.appendChild(sectionDiv);
        });

        // Add components to container in order
        container.appendChild(dragHandle);
        container.appendChild(mainToggle);
        container.appendChild(contentContainer);
        document.body.appendChild(container);
    }

    // Initialize UI when page loads
    window.addEventListener('load', createUI);
})();





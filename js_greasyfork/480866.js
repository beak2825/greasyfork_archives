// ==UserScript==
// @name         Disposal J.A.R.V.I.S.
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  Color-codes disposal options based on safety and shows nerve requirements
// @author       Terekhov
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480866/Disposal%20JARVIS.user.js
// @updateURL https://update.greasyfork.org/scripts/480866/Disposal%20JARVIS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.hash.endsWith('/disposal')) {
        return;
    }

    // Configuration
    const COLORS = {
        safe: '#40Ab24',
        moderatelySafe: '#A4D497',
        caution: '#D6BBA2',
        unsafe: '#B51B1B'
    };

    const NERVE_COSTS = {
        abandon: 6,
        bury: 8,
        burn: 10,
        sink: 12,
        dissolve: 14
    };

    // Method safety mappings for each disposal type
    const DISPOSAL_METHODS = {
        'Biological Waste': {
            safe: ['sink'],
            moderatelySafe: [],
            caution: ['burn'],
            unsafe: ['bury']
        },
        'Body Part': {
            safe: ['dissolve'],
            moderatelySafe: [],
            caution: [],
            unsafe: []
        },
        'Broken Appliance': {
            safe: ['sink'],
            moderatelySafe: [],
            caution: ['abandon', 'bury'],
            unsafe: ['dissolve']
        },
        'Building Debris': {
            safe: ['sink'],
            moderatelySafe: [],
            caution: ['abandon', 'bury'],
            unsafe: []
        },
        'Dead Body': {
            safe: ['dissolve'],
            moderatelySafe: [],
            caution: [],
            unsafe: []
        },
        'Documents': {
            safe: ['burn'],
            moderatelySafe: [],
            caution: ['abandon', 'bury'],
            unsafe: ['dissolve', 'sink']
        },
        'Firearm': {
            safe: ['sink'],
            moderatelySafe: ['bury'],
            caution: [],
            unsafe: ['dissolve']
        },
        'General Waste': {
            safe: ['burn'],
            moderatelySafe: ['bury'],
            caution: ['abandon', 'sink'],
            unsafe: ['dissolve']
        },
        'Industrial Waste': {
            safe: ['sink'],
            moderatelySafe: [],
            caution: ['abandon', 'bury'],
            unsafe: []
        },
        'Murder Weapon': {
            safe: ['sink'],
            moderatelySafe: [],
            caution: [],
            unsafe: ['dissolve']
        },
        'Old Furniture': {
            safe: ['burn'],
            moderatelySafe: [],
            caution: ['abandon', 'bury', 'sink'],
            unsafe: ['dissolve']
        },
        'Vehicle': {
            safe: ['sink'],
            moderatelySafe: ['burn'],
            caution: ['abandon'],
            unsafe: []
        }
    };

    // Helper Functions
    function findElementByClass(targetClass, parent) {
        const elements = parent.getElementsByClassName(targetClass);
        return elements.length > 0 ? elements[0] : null;
    }

    function findElementByClassStartingWith(prefix, parent) {
        if (!parent || !parent.getElementsByClassName) return null;

        for (const element of parent.getElementsByTagName('*')) {
            for (const className of element.classList) {
                if (className.startsWith(prefix)) {
                    return element;
                }
            }
        }
        return null;
    }

    function getDisposalItemName(jobNode) {
        const sections = findElementByClassStartingWith('sections', jobNode);
        if (!sections) return null;

        // The item name is typically the second child in the sections container
        const nameElement = sections.children[1];
        return nameElement ? nameElement.textContent.trim() : null;
    }

    function getMethodsContainer(jobNode) {
        const sections = findElementByClassStartingWith('sections', jobNode);
        if (!sections) return null;

        // Try both desktop and tablet layouts
        let container = findElementByClassStartingWith('desktopMethodsSection', sections) ||
                       findElementByClassStartingWith('tabletMethodsSection', sections);

        if (container) {
            // For tablet layout, we need to go one level deeper
            const picker = findElementByClassStartingWith('methodPicker', container);
            return picker || container;
        }

        return null;
    }

    function calculateMaxNerve(itemName) {
        const methods = DISPOSAL_METHODS[itemName];
        if (!methods) return 0;

        let maxNerve = 0;
        for (const method of methods.safe) {
            const nerveCost = NERVE_COSTS[method];
            if (nerveCost > maxNerve) maxNerve = nerveCost;
        }
        return maxNerve;
    }

    // Main Functions
    function colorizeDisposalMethods(jobNode) {
        const itemName = getDisposalItemName(jobNode);
        if (!itemName || !DISPOSAL_METHODS[itemName]) return;

        const methodsContainer = getMethodsContainer(jobNode);
        if (!methodsContainer) return;

        const methods = DISPOSAL_METHODS[itemName];

        // Apply borders based on safety levels
        for (const [safety, methodList] of Object.entries({
            safe: methods.safe,
            moderatelySafe: methods.moderatelySafe,
            caution: methods.caution,
            unsafe: methods.unsafe
        })) {
            for (const method of methodList) {
                const button = findElementByClassStartingWith(method, methodsContainer);
                if (button) {
                    const borderWidth = (safety === 'safe' || safety === 'unsafe') ? '3px' : '2px';
                    button.style.border = `${borderWidth} solid ${COLORS[safety]}`;
                }
            }
        }
    }

    function updateDisposalHeader() {
        // Find all disposal items
        const currentCrime = document.querySelector('[class^="currentCrime"]');
        if (!currentCrime) return;

        const container = currentCrime.querySelector('[class^="virtualList"]');
        if (!container) return;

        let totalNerve = 0;
        let jobCount = 0;

        // Calculate total nerve needed
        for (const jobNode of container.getElementsByClassName('crimeOptionWrapper___IOnLO')) {
            const itemName = getDisposalItemName(jobNode);
            if (itemName) {
                totalNerve += calculateMaxNerve(itemName);
                jobCount++;
            }
        }

        // Update the header
        const titleDiv = document.querySelector('[class^="titleBar"]');
        if (titleDiv && titleDiv.children[0]) {
            const title = titleDiv.children[0];
            title.textContent = `Disposal ... Max Nerve needed: ${totalNerve} ... ${jobCount} jobs remaining`;
        }
    }

    // Main execution
    function initializeDisposalJARVIS() {
        if (!window.location.href.includes('crimes')) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                const disposalItems = document.getElementsByClassName('crimeOptionWrapper___IOnLO');
                if (disposalItems.length > 0) {
                    for (const item of disposalItems) {
                        colorizeDisposalMethods(item);
                    }
                    updateDisposalHeader();
                }
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial run
        const disposalItems = document.getElementsByClassName('crimeOptionWrapper___IOnLO');
        for (const item of disposalItems) {
            colorizeDisposalMethods(item);
        }
        updateDisposalHeader();
    }

    // Initialize after a short delay to ensure page is loaded
    setTimeout(initializeDisposalJARVIS, 1000);
})();
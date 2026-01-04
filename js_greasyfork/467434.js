// ==UserScript==
// @name         MouseHunt Auto Disarm/Swap Bait
// @author       Kane Kiew
// @namespace    https://greasyfork.org/en/users/979741
// @version      3.4
// @description  Automatically Disarms/Swaps bait when the remaining quantity matches or goes below user input
// @match        http://mousehuntgame.com/*
// @match        https://mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/camp.php*
// @match        https://www.mousehuntgame.com/camp.php*
// @match        http://apps.facebook.com/mousehunt/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @license      GPL-3.0+; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/467434/MouseHunt%20Auto%20DisarmSwap%20Bait.user.js
// @updateURL https://update.greasyfork.org/scripts/467434/MouseHunt%20Auto%20DisarmSwap%20Bait.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Declare the dropdownDiv variable outside the function scope
    let dropdownDiv;
    let lastActionTime = 0; // Track when last action was performed to prevent spamming
    let baitList = []; // Store the bait list globally
    let dropdownInitialized = false; // Track if dropdown has been initialized
    let lastBaitQuantity = 0; // Track last known bait quantity
    let checkInterval; // Interval for periodic checking

    // Function to update the selected cheese UI element
    function updateSelectedCheeseUI(selectedBait) {
        selectedCheeseElement.textContent = `Selected Cheese: ${selectedBait || 'Not Set'}`;
    }

    // Function to get currently equipped cheese ID
    function getEquippedCheeseID() {
        const baitImg = document.querySelector('.campPage-trap-baitDetails .mousehuntHud-bait .mousehuntHud-image');
        if (!baitImg) return null;
        const imgSrc = baitImg.getAttribute('src');
        const idMatch = imgSrc.match(/items\/(\d+)\./);
        return idMatch ? parseInt(idMatch[1]) : null;
    }

    // Function to force update bait quantity
    function forceUpdateBaitQuantity() {
        const newQuantity = getBaitQuantity();
        if (newQuantity !== lastBaitQuantity) {
            lastBaitQuantity = newQuantity;
            updateUI();
            checkQuantity();
        }
    }

    // Watch for changes in bait quantity using MutationObserver
    const baitQuantityObserver = new MutationObserver(() => {
        console.log('MutationObserver detected a change in bait quantity');
        forceUpdateBaitQuantity();
    });

    // Select the parent element of bait quantity using querySelector
    const baitQuantityParent = document.querySelector('.campPage-trap-baitDetails');
    if (baitQuantityParent) {
        baitQuantityObserver.observe(baitQuantityParent, { childList: true, subtree: true, characterData: true });
    }

    // Set up periodic checking
    function setupPeriodicChecking() {
        // Clear any existing interval
        if (checkInterval) {
            clearInterval(checkInterval);
        }

        // Check every 5 seconds (adjust as needed)
        checkInterval = setInterval(forceUpdateBaitQuantity, 900000);
    }

    // Initialize the dropdown with the pre-loaded bait list
    function initializeDropdown() {
        if (dropdownInitialized) return;

        // Remove existing dropdown if it exists
        const existingDropdown = document.getElementById('bait-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        dropdownDiv = document.createElement('div');
        dropdownDiv.id = 'bait-dropdown';
        dropdownDiv.style.position = 'fixed';
        dropdownDiv.style.top = '126px';
        dropdownDiv.style.left = '10px';
        dropdownDiv.style.zIndex = '9999';
        dropdownDiv.style.display = isDisarmSelected ? 'none' : 'block';

        const dropdown = $('<select></select>');

        if (baitList.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.text = 'No Baits found';
            dropdown.append(option);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select a bait...';
            dropdown.append(defaultOption);

            baitList.forEach((bait) => {
                const option = document.createElement('option');
                option.value = bait.itemID;
                option.text = `${bait.name} (ID: ${bait.itemID})`;
                dropdown.append(option);
            });
        }

        $(dropdownDiv).append(dropdown);
        document.body.appendChild(dropdownDiv);

        // Initialize Select2
        dropdown.select2();

        // Add event listener to Select2 dropdown
        dropdown.on('change', function (e) {
            const selectedBaitID = parseInt(e.target.value);
            localStorage.setItem('selectedBaitID', selectedBaitID);
            const selectedBait = e.target.selectedOptions[0].text;
            localStorage.setItem('selectedBait', selectedBait);
            console.log('Selected bait ID:', selectedBaitID);
            console.log('Selected bait:', selectedBait);
            checkQuantity(selectedBaitID);
            updateSelectedCheeseUI(selectedBait);
        });

        // Set the selected value if it exists in localStorage
        const storedBaitID = localStorage.getItem('selectedBaitID');
        if (storedBaitID) {
            dropdown.val(storedBaitID).trigger('change');
        }

        dropdownInitialized = true;
    }

    function processTrapComponents(components) {
        baitList = components
            .filter((component) => component.classification === 'bait')
            .map((component) => ({
                itemID: component.item_id,
                name: component.name,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name

        // Initialize the dropdown immediately with the loaded bait list
        initializeDropdown();
        updateUI();
    }

    function retrieveTrapComponents() {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
            if (xhr.status === 200) {
                let data;
                try {
                    data = JSON.parse(xhr.responseText).components;
                    if (data && data.length > 0) {
                        processTrapComponents(data);
                    } else {
                        console.log('Invalid components array data from gettrapcomponents.php');
                        setTimeout(retrieveTrapComponents, 5000); // Retry after 5 seconds
                    }
                } catch (error) {
                    console.log('Failed to process server response for gettrapcomponents.php');
                    console.error(error.stack);
                    setTimeout(retrieveTrapComponents, 5000); // Retry after 5 seconds
                }
            } else {
                console.log('Error retrieving trap components from gettrapcomponents.php');
                setTimeout(retrieveTrapComponents, 5000); // Retry after 5 seconds
            }
        });
        xhr.open('GET', 'https://www.mousehuntgame.com/managers/ajax/users/gettrapcomponents.php');
        xhr.send();
    }

    // Get bait quantity from the page
    function getBaitQuantity() {
        const hudBaitQuantity = document.querySelector('.campPage-trap-baitDetails .campPage-trap-baitQuantity');
        if (hudBaitQuantity !== null) {
            const quantityText = hudBaitQuantity.innerText.replace(/,/g, ''); // Remove commas from quantity text
            return parseInt(quantityText) || 0;
        }
        return 0;
    }

    // Create UI elements
    const createUIElements = () => {
        const createUIElement = (left, top, text) => {
            const element = document.createElement('div');
            element.style.position = 'fixed';
            element.style.left = left;
            element.style.top = top;
            element.style.backgroundColor = '#fff';
            element.style.padding = '5px';
            element.style.border = '1px solid #ccc';
            element.style.borderRadius = '3px';
            element.style.zIndex = '9999';
            element.style.cursor = 'pointer';
            element.textContent = text;
            document.body.appendChild(element);
            return element;
        };

        return {
            // Create selected cheese UI element
            selectedCheeseElement: createUIElement('10px', '101px', 'Selected Cheese: Not Set'),
            targetQuantityElement: createUIElement('10px', '10px', 'Target Quantity: N/A (Click to set)'),
            baitQuantityElement: createUIElement('10px', '35px', 'Bait Quantity: 0'),
        };
    };

    const { targetQuantityElement, baitQuantityElement, selectedCheeseElement } = createUIElements();

    // Create toggle switch UI element
    const toggleSwitchElement = document.createElement('div');
    toggleSwitchElement.style.position = 'fixed';
    toggleSwitchElement.style.width = '110px';
    toggleSwitchElement.style.height = '30px';
    toggleSwitchElement.style.left = '10px';
    toggleSwitchElement.style.top = '60px';
    toggleSwitchElement.style.backgroundColor = '#fff';
    toggleSwitchElement.style.padding = '5px';
    toggleSwitchElement.style.border = '1px solid #ccc';
    toggleSwitchElement.style.borderRadius = '3px';
    toggleSwitchElement.style.zIndex = '9999';
    toggleSwitchElement.style.display = 'flex';
    toggleSwitchElement.style.alignItems = 'center';
    toggleSwitchElement.style.justifyContent = 'space-between';
    toggleSwitchElement.style.cursor = 'pointer';
    document.body.appendChild(toggleSwitchElement);

    const sliderLabelElement = document.createElement('div');
    sliderLabelElement.style.fontWeight = 'bold';
    sliderLabelElement.style.marginLeft = '5px';
    toggleSwitchElement.appendChild(sliderLabelElement);

    const sliderElement = document.createElement('div');
    sliderElement.style.position = 'relative';
    sliderElement.style.width = '40px';
    sliderElement.style.height = '20px';
    sliderElement.style.backgroundColor = '#ddd';
    sliderElement.style.borderRadius = '10px';
    sliderElement.style.cursor = 'pointer';
    sliderElement.style.transition = 'background-color 0.3s ease';
    toggleSwitchElement.appendChild(sliderElement);

    const sliderKnob = document.createElement('div');
    sliderKnob.style.position = 'absolute';
    sliderKnob.style.width = '16px';
    sliderKnob.style.height = '16px';
    sliderKnob.style.backgroundColor = '#fff';
    sliderKnob.style.borderRadius = '50%';
    sliderKnob.style.boxShadow = '0 0 2px rgba(0,0,0,0.3)';
    sliderKnob.style.transition = 'transform 0.3s ease';
    sliderKnob.style.top = '2px';
    sliderElement.appendChild(sliderKnob);

    // Update target quantity UI
    const updateTargetQuantityUI = () => {
        const storedTarget = localStorage.getItem('targetQuantity');
        if (storedTarget === null || storedTarget === 'N/A') {
            targetQuantity = null;
            targetQuantityElement.textContent = 'Target Quantity: N/A (Click to set)';
        } else {
            targetQuantity = parseInt(storedTarget);
            if (!isNaN(targetQuantity)) {
                targetQuantityElement.textContent = `Target Quantity: ${targetQuantity}`;
            } else {
                targetQuantity = null;
                targetQuantityElement.textContent = 'Target Quantity: N/A (Click to set)';
                localStorage.setItem('targetQuantity', 'N/A');
            }
        }
    };

    // Update bait quantity UI
    const updateBaitQuantityUI = () => {
        const baitQuantity = getBaitQuantity();
        lastBaitQuantity = baitQuantity;
        baitQuantityElement.textContent = `Bait Quantity: ${baitQuantity}`;
    };

    // Update toggle switch UI
    const updateToggleSwitchUI = () => {
        localStorage.setItem('isDisarmSelected', isDisarmSelected.toString());
        if (isDisarmSelected) {
            sliderLabelElement.textContent = 'Disarm';
            sliderElement.style.backgroundColor = '#6b8cff';
            sliderKnob.style.transform = 'translateX(20px)';

            // Hide dropdown and selected cheese when in Disarm mode
            if (dropdownDiv) dropdownDiv.style.display = 'none';
            selectedCheeseElement.style.display = 'none';
        } else {
            sliderLabelElement.textContent = 'Swap Bait';
            sliderElement.style.backgroundColor = '#ffb46b';
            sliderKnob.style.transform = 'translateX(2px)';

            // Show dropdown and selected cheese when in Swap Bait mode
            if (dropdownDiv) dropdownDiv.style.display = 'block';
            selectedCheeseElement.style.display = 'block';
        }
    };

    // Update UI elements
    const updateUI = () => {
        updateSelectedCheeseUI(localStorage.getItem('selectedBait'));
        updateTargetQuantityUI();
        updateBaitQuantityUI();
        updateToggleSwitchUI();
    };

    // Reset target quantity and selected cheese after action
    const resetAfterAction = () => {
        // Reset target quantity
        targetQuantity = null;
        localStorage.setItem('targetQuantity', 'N/A');

        // Reset selected cheese
        localStorage.removeItem('selectedBaitID');
        localStorage.removeItem('selectedBait');

        // Update dropdown to show no selection
        if (dropdownDiv) {
            const select = dropdownDiv.querySelector('select');
            if (select) {
                $(select).val('').trigger('change');
            }
        }

        updateUI();
    };

    // Check if the action should be performed based on target quantity
    const checkQuantity = () => {
        // Prevent rapid consecutive actions (minimum 5 seconds between actions)
        const now = Date.now();
        if (now - lastActionTime < 5000) {
            return;
        }

        // If target quantity is not set (N/A), do nothing
        if (targetQuantity === null) {
            return;
        }

        const selectedBaitID = parseInt(localStorage.getItem('selectedBaitID'));
        const equippedCheeseID = getEquippedCheeseID();
        const baitQuantity = getBaitQuantity();

        // Check if we're trying to swap to the same cheese
        const isSameCheese = selectedBaitID && equippedCheeseID && (selectedBaitID === equippedCheeseID);

        // Check if bait quantity is <= target (including 0) or if we're swapping to same cheese
        if (baitQuantity <= targetQuantity || isSameCheese) {
            if (isDisarmSelected) {
                console.log(`Disarming bait (quantity: ${baitQuantity} <= target: ${targetQuantity})`);
                hg.utils.TrapControl.disarmBait().go();
                lastActionTime = now;
                resetAfterAction();
            } else if (selectedBaitID && !isNaN(selectedBaitID)) {
                if (isSameCheese) {
                    console.log(`Selected cheese (ID: ${selectedBaitID}) is same as equipped cheese - resetting selection`);
                } else {
                    console.log(`Swapping to bait ID ${selectedBaitID} (quantity: ${baitQuantity} <= target: ${targetQuantity})`);
                }
                hg.utils.TrapControl.armItem(selectedBaitID, 'bait').go();
                lastActionTime = now;
                resetAfterAction();
            }
        }
        // Check if target is greater than current bait quantity
        else if (targetQuantity > baitQuantity) {
            console.log(`Target quantity (${targetQuantity}) is greater than current bait (${baitQuantity}) - performing action now`);
            if (isDisarmSelected) {
                hg.utils.TrapControl.disarmBait().go();
                lastActionTime = now;
                resetAfterAction();
            } else if (selectedBaitID && !isNaN(selectedBaitID)) {
                hg.utils.TrapControl.armItem(selectedBaitID, 'bait').go();
                lastActionTime = now;
                resetAfterAction();
            }
        }
    };

    // Prompt user to input the remaining bait quantity
    const updatePrompt = () => {
        const currentTarget = localStorage.getItem('targetQuantity');
        const input = prompt('Enter the bait quantity you want to disarm when reached (0 is valid) or "N/A" to disable:',
                           currentTarget !== null && currentTarget !== 'N/A' ? currentTarget : '');

        if (input === null) return; // User cancelled

        if (input.trim().toUpperCase() === 'N/A') {
            targetQuantity = null;
            localStorage.setItem('targetQuantity', 'N/A');
        } else {
            const newTarget = parseInt(input);
            if (!isNaN(newTarget)) {
                targetQuantity = newTarget;
                localStorage.setItem('targetQuantity', newTarget.toString());
            } else {
                // Invalid input - set to N/A
                targetQuantity = null;
                localStorage.setItem('targetQuantity', 'N/A');
            }
        }

        updateUI();
        checkQuantity(); // Immediately check after changing target
    };

    // Add event listener to target quantity element
    targetQuantityElement.addEventListener('click', updatePrompt);

    // Update UI when the toggle switch is clicked
    toggleSwitchElement.addEventListener('click', () => {
        isDisarmSelected = !isDisarmSelected;
        updateUI();
    });

    // Initialize target quantity and isDisarmSelected
    let targetQuantity = null;
    let isDisarmSelected = localStorage.getItem('isDisarmSelected') === 'true';

    // Set up periodic checking
    setupPeriodicChecking();

    // Retrieve trap components immediately (but don't show dropdown until needed)
    retrieveTrapComponents();

    // Set initial UI state
    updateUI();

    // Also check when the window becomes visible again
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            forceUpdateBaitQuantity();
        }
    });

    // Intercept AJAX calls for horn sounds and trap changes
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function () {
            if (
                this.responseURL === 'https://www.mousehuntgame.com/managers/ajax/users/changetrap.php' ||
                this.responseURL === 'https://www.mousehuntgame.com/managers/ajax/turns/activeturn.php'
            ) {
                console.log('Intercepted relevant AJAX call:', this.responseURL);
                forceUpdateBaitQuantity();
            }
        });
        originalOpen.apply(this, arguments);
    };
})();
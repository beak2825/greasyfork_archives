// ==UserScript==
// @name         Enhanced Vault Interaction with Checkboxes
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Enhance interactions in the vault using checkboxes for a toggleable filter by level
// @author       You
// @match        https://www.net-7.org/*
// @grant        none
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/486024/Enhanced%20Vault%20Interaction%20with%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/486024/Enhanced%20Vault%20Interaction%20with%20Checkboxes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ID of the target element
    const targetElementId = 'source_vault';

    // Counter for park_slot value
    let parkSlotCounter = 1;

    // Function to handle the DOM changes
    function handleChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && isWithinTargetElement(mutation.target)) {
                // Insert checkboxes for Roman numerals 1-9 if they don't exist
                if (!hasCheckboxes()) {
                    insertCheckboxes(mutation.target);
                }
                enhanceVaultInteractions(mutation.target);
            }
        }
    }

    // Function to handle checkbox changes
    function handleCheckboxChange(event) {
        const selectedValue = event.target.value;
        updateVaultDraggableClasses(selectedValue);
    }

    // Function to handle control-click on vault_draggable elements
    function handleVaultDraggableControlClick(event) {
        if (event.ctrlKey || event.metaKey) {
            const vaultDraggable = event.target.closest('.vault_draggable');
            if (vaultDraggable && !vaultDraggable.classList.contains('ui-draggable-disabled')) {
                setParkSlotProperty(vaultDraggable);
                event.preventDefault(); // Prevent the default behavior of control-click
            }
        }
    }

    // Function to check if the node is within the target element
    function isWithinTargetElement(node) {
        return node && node.id === targetElementId || (node.parentNode && isWithinTargetElement(node.parentNode));
    }

    // Function to check if checkboxes already exist
    function hasCheckboxes() {
        return document.getElementById('checkboxesRow') !== null;
    }

    // Function to insert checkboxes for Roman numerals 1-9 ahead of the given element
    function insertCheckboxes(targetElement) {
        // Create a div element for the checkboxes row
        const checkboxesRow = document.createElement('div');
        checkboxesRow.id = 'checkboxesRow';

        // Create and append checkboxes for Roman numerals 1-9
        for (let i = 1; i <= 9; i++) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = i;
            checkbox.id = 'checkbox' + i;
            checkbox.addEventListener('change', handleCheckboxChange);

            const label = document.createElement('label');
            label.innerHTML = getRomanNumeral(i);
            label.htmlFor = 'checkbox' + i;

            checkboxesRow.appendChild(checkbox);
            checkboxesRow.appendChild(label);
        }

        // Insert the checkboxes row ahead of the target element
        if (targetElement.parentNode) {
            targetElement.parentNode.insertBefore(checkboxesRow, targetElement);
        }
    }

    // Function to convert Arabic numeral to Roman numeral
    function getRomanNumeral(num) {
        const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
        return romanNumerals[num];
    }

    // Function to update classes on the element with class 'vault_draggable' based on selected checkbox values
    function updateVaultDraggableClasses(selectedValue) {
        const vaultDraggables = document.getElementsByClassName('vault_draggable');
        for (const vaultDraggable of vaultDraggables) {
            const levelElement = vaultDraggable.querySelector('.pad-level');
            if (levelElement) {
                const isSelected = document.getElementById('checkbox' + selectedValue).checked;
                if (isSelected && levelElement.innerHTML !== getRomanNumeral(selectedValue)) {
                    vaultDraggable.classList.add('ui-draggable-disabled', 'ui-state-disabled');
                } else {
                    vaultDraggable.classList.remove('ui-draggable-disabled', 'ui-state-disabled');
                }
            }
        }
    }

    // Function to set park_slot property on the vault_draggable element
    function setParkSlotProperty(vaultDraggable) {
        const parkSlotValue = 'park_slot_' + parkSlotCounter;
        parkSlotCounter = (parkSlotCounter % 12) + 1; // Increment and wrap around 1-12
        vaultDraggable.setAttribute('park_slot', parkSlotValue);
    }

    // Function to handle unchecking checkbox
    function handleCheckboxUncheck(event) {
        const uncheckedValue = event.target.value;
        updateVaultDraggableClasses(uncheckedValue);
    }

    // Function to enhance interactions in the vault
    function enhanceVaultInteractions(targetElement) {
        // Add control-click event listener to vault_draggable elements
        const vaultDraggables = targetElement.getElementsByClassName('vault_draggable');
        for (const vaultDraggable of vaultDraggables) {
            vaultDraggable.addEventListener('mousedown', handleVaultDraggableControlClick);
        }

        // Add change event listener to checkboxes for clearing selection
        const checkboxes = targetElement.querySelectorAll('input[type="checkbox"]');
        for (const checkbox of checkboxes) {
            checkbox.addEventListener('change', handleCheckboxUncheck);
        }
    }

    // Create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver(handleChanges);

    // Configure and start the observer to observe all childList changes in the entire document
    const config = { childList: true, subtree: true };
    observer.observe(document.documentElement, config);

})();

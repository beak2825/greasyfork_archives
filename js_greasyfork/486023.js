// ==UserScript==
// @name         Net-7 Source Vault Separate Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Handles the actual work of adding and changing elements on the page.
// @author       You
// @match        https://www.net-7.org/*
// @grant        none
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/486023/Net-7%20Source%20Vault%20Separate%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/486023/Net-7%20Source%20Vault%20Separate%20Script.meta.js
// ==/UserScript==

const maxSelectedItems = 12;
let selectedItems = [];

function isItemParent(parent, potential) {
    const parent_iid = parent.getAttribute('iid');
    const parent_slot = parent.getAttribute('slot');
    const potential_iid = potential.getAttribute('iid');
    const potential_slot = potential.getAttribute('slot');
    const is_clone = potential.getAttribute('data-clone');

  return parent_iid === potential_iid && parent_slot === potential_slot && is_clone;
}

// Function to convert Arabic numeral to Roman numeral
function getRomanNumeral(num) {
    const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return romanNumerals[num];
}

// Function to handle unchecking checkbox
function handleCheckboxUncheck(event) {
    const uncheckedValue = event.target.value;
    //TO-DO: implement graying out
}

// Function to handle checkbox changes
function handleCheckboxChange(event) {
    const selectedValue = event.target.value;
    //TO-DO: implement graying out
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

function getRelevantHTMLValues(inner_html) {
    // Extract inner HTML without styles and JS
    const innerHTMLWithoutStyles = inner_html.replace(/<style\b[^>]*>[\s\S]*?<\/script>/g, '');

    const parsedData = [];

    //console.log("Stripped HTML is ", innerHTMLWithoutStyles);

    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = innerHTMLWithoutStyles;

    // Extract and parse relevant information
    const items = tempDiv.querySelectorAll('.vault_draggable');
    items.forEach(item => {
        const itemName = item.querySelector('.acc_vault_moreinfo').getAttribute('name');
        const itemLevel = item.querySelector('.pad-level').textContent;
        const itemStack = item.querySelector('.pad-stack').textContent;
        const item_id = item.getAttribute('iid');
        const slot_id = item.getAttribute('slot');

        // Extract 'data-tooltip' attribute
        const dataTooltip = item.getAttribute('data-tooltip');

        // Parse 'data-tooltip' content so we can extract stuff from it to filter with.
        const tooltipParser = new DOMParser();
        const tooltipDoc = tooltipParser.parseFromString(dataTooltip, 'text/html');

        // Extract the text content after 'Manufacturer'
        const manufacturerField = Array.from(tooltipDoc.querySelectorAll('.nestedleft')).find(el => el.textContent.includes('Manufacturer'));
        const manufacturerValue = (manufacturerField && manufacturerField.nextSibling) ? manufacturerField.nextSibling.textContent.trim() : 'non-pm';

        // Extract img src for both pad-background and pad-item
        const backgroundImgSrc = item.querySelector('.pad-background').src;
        const itemImgSrc = item.querySelector('.pad-item').src;

        // Do something with the parsed information
        /*console.log('Item Name:', itemName);
        console.log('Item Level:', itemLevel);
        console.log('Item Stack:', itemStack);
        console.log('Tooltip:', dataTooltip);
        console.log('Item made by: ', manufacturerValue);*/

        // Create an object with the extracted values
        const parsedItem = {
            itemName,
            itemLevel,
            itemStack,
            item_id,
            slot_id,
            dataTooltip,
            manufacturerValue,
            backgroundImgSrc,
            itemImgSrc
        };

        // Push the object into the array
        parsedData.push(parsedItem);
    });
    // Return the array containing parsed data
    return parsedData;
}

function toggleSelectedState(itemDiv) {
    const isUiSelectable = itemDiv.classList.contains('ui-selectable');
    const isUiStateDisabled = itemDiv.classList.contains('green_checkmark');

    // Check if adding a new item would exceed the maximum limit
    if (selectedItems.length + 1 > maxSelectedItems) {
        return;
    }

    // Get all occupied table slots
    const trasfer_slots_parent = document.querySelector('#parkslots');
    const occupiedSlots = trasfer_slots_parent.querySelectorAll('table td[aria-disabled="true"]');

    // Find the first available slot
    const emptySlot = trasfer_slots_parent.querySelector('td[aria-disabled="false"], td:not([aria-disabled])');
    console.log("Got ", emptySlot, "as empty slot");

    if(isUiSelectable && emptySlot) {
        //Make updates to the 12 slot array of items being moved
        emptySlot.textContent = '';
        const empty_slot_id = emptySlot.id;
        emptySlot.setAttribute('aria-disabled','true');

        //Mark the item as being in the move list before we clone it.
        itemDiv.classList.remove('ui-selectable');
        itemDiv.setAttribute('aria-disabled','true');
        //Create a clone of the vault item and display it in the table of items to move.
        const cloned_item = itemDiv.cloneNode(true);
        cloned_item.setAttribute('data-clone', 'true');

        //Some fixes are needed to get it to display correctly
        cloned_item.classList.add('pad-container');
        const clone_children = cloned_item.children;
        for (let i = 0; i < clone_children.length; i++) {
            const child = clone_children[i];

            if (child.classList.contains('pad-background')) {
                child.classList.remove('pad-background');
                child.classList.add('custom_pad-background');
            }
            if (child.classList.contains('pad-item')) {
                child.classList.remove('pad-item');
                child.classList.add('custom_pad-item');
            }
            if (child.classList.contains('pad-level')) {
                child.classList.remove('pad-level');
                child.classList.add('custom_pad-level');
            }
            if (child.classList.contains('pad-stack')) {
                child.classList.remove('pad-stack');
                child.classList.add('custom_pad-stack');
            }
        }

        //Finally, append the (fixed clone) to the table of stuff to move
        emptySlot.appendChild(cloned_item);

        // Add the item to the selectedItems array if not already selected
        if (!selectedItems.includes(itemDiv)) {
            selectedItems.push(itemDiv);
        }

        //Now update the item itself in the vault:
        itemDiv.setAttribute('park_slot',empty_slot_id);
        itemDiv.classList.add('ui-state-disabled');

        //Give the item being moved a green tint so we can see which ones are moving.
        const image_layer = itemDiv.querySelector('.pad-item');
        image_layer.classList.add('mark_as_moving');
    } else if(!isUiSelectable) {
        occupiedSlots.forEach(slot => {
            const cloned_item = slot.querySelector('div');
            if (isItemParent(itemDiv, cloned_item)) {
                slot.removeChild(cloned_item);
                slot.textContent = "Slot# " + parseInt(slot.id.split('_')[2]);
                slot.setAttribute('aria-disabled', 'false');
            }
        });
        itemDiv.removeAttribute('park_slot');
        itemDiv.removeAttribute('aria-disabled');
        itemDiv.classList.add('ui-selectable');
        itemDiv.classList.remove('green_checkmark', 'ui-state-disabled');

        //Remove the green tint.
        const image_layer = itemDiv.querySelector('.pad-item');
        image_layer.classList.remove('mark_as_moving');
    }
}

function handleItemClick(event) {
    const closest_pad_container = event.target.closest('.pad-container');

    console.log("Item clicked was", event.target);

    if(event.ctrlKey) {
        console.log("Ctrl-click detected on", event.target);
        //Ctrl-click = Open link to item as if we did a DB search.
        event.target.click();
    } else {
        // Check if the click originated from an element within pad-container
        const isClickInsidePadContainer = closest_pad_container !== null;

        if (isClickInsidePadContainer) {
            const item_div = closest_pad_container.querySelector('.tooltip');
            console.log("Toggling click state on ", item_div);
            toggleSelectedState(item_div);
        }
        console.log("Not Toggling click state on ", event.target);
    }
}

function createVaultCell(row_data, parent_element) {
    const item_div_root = document.createElement('div');
    item_div_root.classList.add("pad");
    item_div_root.style.cssText = "float: left;";

    //Add child to parent so event handler registration works.
    parent_element.appendChild(item_div_root);

    const pad_cont_div = document.createElement('div');
    pad_cont_div.classList.add("pad-container");
    pad_cont_div.addEventListener('click', handleItemClick);
    item_div_root.appendChild(pad_cont_div);

    const tooltip_div = document.createElement('div');
    tooltip_div.classList.add("tooltip", "ui-selectable");
    tooltip_div.setAttribute("iid", row_data.item_id);
    tooltip_div.setAttribute("slot", row_data.slot_id);
    //Will either be a player name or 'non-pm' for looted/vendor bought/etc items.
    tooltip_div.setAttribute("mfg_by", row_data.manufacturerValue);
    tooltip_div.setAttribute("ilvl", row_data.itemLevel);
    tooltip_div.setAttribute("stack_size", row_data.itemStack);
    //Do this last
    tooltip_div.setAttribute("tooltip", row_data.dataTooltip)

    pad_cont_div.appendChild(tooltip_div);

    const background_img = document.createElement('img');
    background_img.classList.add("pad-background");
    background_img.src = row_data.backgroundImgSrc;
    tooltip_div.appendChild(background_img);

    const item_img = document.createElement('img');
    item_img.classList.add("pad-item");
    item_img.src = row_data.itemImgSrc;
    tooltip_div.appendChild(item_img);

    const span_level = document.createElement('span');
    span_level.classList.add("pad-level");
    span_level.textContent = row_data.itemLevel;
    tooltip_div.appendChild(span_level);

    const span_stack = document.createElement('span');
    span_stack.classList.add("pad-stack");
    span_stack.textContent = row_data.itemStack;
    tooltip_div.appendChild(span_stack);
}

function createVaultPage(orig_extracted_data, parent_node) {
    const source_vault_root = document.createElement('div');
    source_vault_root.classList.add("clearfix", "inventory_pane");
    source_vault_root.style.cssText = "font-size: 10px; width:84em;";

    parent_node.appendChild(source_vault_root);

    //Now go through each item in the vault and create its box.
    orig_extracted_data.forEach(item => {
        createVaultCell(item, source_vault_root);
    })
}

// Define the function globally using unsafeWindow
window.handleHTMLModification = function(addedNode) {
    //console.log('Handling HTML modification in myfunction:', addedNode.innerHTML);

    // Insert checkboxes for Roman numerals 1-9 if they don't exist
    if (!hasCheckboxes()) {
        insertCheckboxes(addedNode);
    }

    const orig_extracted_data = getRelevantHTMLValues(addedNode.innerHTML);
    //Wipe out the node's current HTML, we will rebuild it.
    addedNode.innerHTML = '';

    //addedNode is the mutation target, ie, source_vault, and is passed by reference.
    createVaultPage(orig_extracted_data, addedNode);
};

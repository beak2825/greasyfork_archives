// ==UserScript==
// @name         Net-7 Account Vault Filters
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds visual filters to the Account Vault page for the Earth & Beyond emulator run by net-7.
// @author       Doctor
// @match        https://www.net-7.org/*
// @grant        none
// @license      CC BY-NC
// @downloadURL https://update.greasyfork.org/scripts/486075/Net-7%20Account%20Vault%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/486075/Net-7%20Account%20Vault%20Filters.meta.js
// ==/UserScript==

//FIXME:
/* Bugs to fix:
* Implement additional filters
* ? Display a count of vault slots in use on char
*/

const maxSelectedItems = 12;
let selectedItems = [];
const FITER_ROW_PARENT_DIV_NAME = "filterSection";
var activeFilters = {
    ilvl: [],
};
var lastTarget = -1;

function addCSS() {
    var cssToAdd = `
        /* Style for items disabled by filtering */
        .mark_as_filtered {
            background-color: rgba(255, 0, 0, 0.5);
        }

        /* Style for items added to the move list */
        .mark_as_moving {
            position:relative;
            z-index:1;
            background-color: rgba(0, 255, 0, 0.5);
        }

        /* Custom version of pad-item style for use in the transfer slots. */
        .custom_pad-item {
            position: relative;
            z-index: 4;
        }
        /* Custom version of pad-item style for use in the transfer slots. */
        .custom_pad-background {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
        }
        /* Custom version of pad-item style for use in the transfer slots. */
        .custom_pad-level, .custom_pad-stack {
            position: absolute;
            left: 0;
            z-index: 5;
            cursor: pointer;
            width: 100%;
            text-align: center;
            font-weight: bold;
            color: #00FF00;
            text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
            font-family: courier;
            font-size: 100%;
        }
        .custom_pad-level {
            top:0;
        }
        .custom_pad-stack {
            bottom:0;
        }

        .quality_filter_radio_td {
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 5px;
            text-align: left;
        }

        .quality_filter_number_td {
            text-align: center;
            vertical-align: middle;
        }
    `;

    // Create a <style> element
    var style = document.createElement('style');
    style.type = 'text/css';

    if (style.styleSheet) {
        // For IE
        style.styleSheet.cssText = cssToAdd;
    } else {
        // For other browsers
        style.appendChild(document.createTextNode(cssToAdd));
    }

    // Append the <style> element to the <head> of the document
    document.head.appendChild(style);
    //console.log("DEBUG: Custom CSS added.");
}//end addCSS

function addFilters(addedNode) {
    //Create a DIV that acts as the parent for all sub-filters.
    const filtersParent = document.createElement('table');
    filtersParent.id = FITER_ROW_PARENT_DIV_NAME;
    filtersParent.style = "width: 100%;";
    filtersParent.border = 1;

    // Add this div to the page
    if (addedNode.parentNode) {
        //Right now it appears just above the vault contents.
        addedNode.parentNode.insertBefore(filtersParent, addedNode);
    }

    //Now we append the filters to the parent.
    const newTableRow = document.createElement('tr');
    filtersParent.appendChild(newTableRow);
    insertItemLevelFilterCheckboxes(newTableRow);
    insertPMOnlyFilter(newTableRow);
    insertQualityFilter(newTableRow);
    insertStackSizeFilter(newTableRow);

    const newTableRow2 = document.createElement('tr');
    filtersParent.appendChild(newTableRow2);
    insertItemNameFilter(newTableRow2);
}

function addMoveSlotEventHandler() {
    const park_table = document.querySelector('#parkslots');
    const table_slots = park_table.querySelectorAll('td');

    table_slots.forEach(slot => {
        slot.addEventListener('click', handleParkSlotClick);
    });
}

function changeHelpText() {
    // Using document.querySelector() to find the span element by its text content -- this did not work.
    //var spanElement = document.querySelector('span:contains("Drag items you want to transfer into one of these slots:")');

    // Get all span elements on the page
    var allSpans = document.querySelectorAll('span');
    var spanElement = 0;

    // Iterate through each span element
    for (var i = 0; i < allSpans.length; i++) {
        if (allSpans[i].textContent === "Drag items you want to transfer into one of these slots:") {
            spanElement = allSpans[i];
            break;
        }
    }

    // Check if the span element is found
    if (spanElement) {
        const parent = spanElement.parentElement;
        const next_sibling = spanElement.nextSibling;
        parent.removeChild(spanElement);

        const newHelp = document.createElement('span');
        newHelp.style.fontSize = "10px";
        newHelp.textContent = "Left-click to select/de-select. Ctrl-click to open DB link. Check boxes next to tier to show only items of that tier.";
        parent.insertBefore(newHelp, next_sibling);
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
    //These two are only needed to get ctrl-click opening a new link-tab working.
    tooltip_div.setAttribute("item_id", row_data.item_id);
    tooltip_div.setAttribute("name", row_data.itemName);
    tooltip_div.setAttribute("qual_pct", row_data.qual_pct);
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
}//end createVaultCell

function createVaultPage(orig_extracted_data, parent_node) {
    //Check if the inventory pane already exists
    var source_vault_root = parent_node.querySelector('.clearfix.inventory_pane');
    if(!source_vault_root) {
        source_vault_root = document.createElement('div');
        source_vault_root.classList.add("clearfix", "inventory_pane");
        source_vault_root.style.cssText = "font-size: 10px; width:84em;";

        parent_node.appendChild(source_vault_root);
        //console.log("DEBUG: Adding inventory pane.");
    }

    //Now go through each item in the vault and create its box.
    orig_extracted_data.forEach(item => {
        createVaultCell(item, source_vault_root);
    })
}

function getRelevantHTMLValues(inner_html) {
    // Extract inner HTML without styles and JS
    const innerHTMLWithoutStyles = inner_html.replace(/<style\b[^>]*>[\s\S]*?<\/script>/g, '');

    const parsedData = [];

    //console.log("DEBUG: Stripped HTML is ", innerHTMLWithoutStyles);

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

        // Pull out the manufacturer name, if there is one, or set to non-pm otherwise.
        const tdElements = tooltipDoc.querySelectorAll('td');
        const manufacturerTD = Array.from(tdElements).find(td => td.textContent.trim() === 'Manufacturer');
        const manufacturerName = manufacturerTD.nextElementSibling.textContent.trim();
        const manufacturerValue = manufacturerName === '' ? 'non-pm' : manufacturerName;

        const qualityTD = Array.from(tdElements).find(td => td.textContent.trim() === 'Quality');
        const qual_pct = qualityTD.nextElementSibling.textContent.trim().replace('%','');

        // Extract img src for both pad-background and pad-item
        const backgroundImgSrc = item.querySelector('.pad-background').src;
        const itemImgSrc = item.querySelector('.pad-item').src;

        // Do something with the parsed information
        /*console.log('DEBUG: Item Name:', itemName);
        console.log('DEBUG: Item Level:', itemLevel);
        console.log('DEBUG: Item Stack:', itemStack);
        console.log('DEBUG: Tooltip:', dataTooltip);
        console.log('DEBUG: Item made by: ', manufacturerValue);*/

        // Create an object with the extracted values
        const parsedItem = {
            itemName,
            itemLevel,
            itemStack,
            item_id,
            slot_id,
            qual_pct,
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
}//end getRelevantHTMLValues

// Function to convert Arabic numeral to Roman numeral
function getRomanNumeral(num) {
    const romanNumerals = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    return romanNumerals[num];
}

/* Ideally, this should be the target for any filter change, as you want them all to recompute their filtering
and the order the functions appear in this call determines which filters are lower or higher priority.
*/
function handleFilters(event) {
    //console.log("DEBUG: got event:", event);

    handleFilterItemLevel();
    handleFilterPMOnly();
    handleFilterQualityPct();
    handleFilterStackSize();
    handleFilterItemName();

    highlightBasedOnFilters();
}

// Function to handle the checkboxes for item level filtering
function handleFilterItemLevel() {
    //For this event type, we don't actually care about the event itself.
    var checkedValues = new Set();

    //Build a cache of which checkboxes are checked.
    const checkboxes = document.querySelector('#itemLevelFilterRow').querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            if (!activeFilters.ilvl.includes(checkbox.value)) {
                activeFilters.ilvl.push(checkbox.value);
            }
        } else {
            const indexToRemove = activeFilters.ilvl.indexOf(checkbox.value);
            if(indexToRemove !== -1) {
                activeFilters.ilvl.splice(indexToRemove, 1);
            }
        }
    });
}

function handleFilterItemName() {
    const name_fragment = document.getElementById('ItemNameBox');
    if(name_fragment && name_fragment.value !== "") {
        activeFilters.name = name_fragment.value;
    } else {
        delete activeFilters.name;
    }
}

function handleFilterPMOnly() {
    //Build a cache of which checkboxes are checked.
    const checkbox = document.querySelector('#PMFilter').querySelector('input[type="checkbox"]');
    const nameBox = document.querySelector('#PMFilter').querySelector('input[type="text"]');

    if (checkbox.checked) {
        activeFilters.mfg_by = '!=|non-pm';
    } else {
        if(nameBox && nameBox.value !== "") {
            activeFilters.mfg_by = '=|' + nameBox.value;
        } else {
            delete activeFilters.mfg_by;
        }
    }
}

function handleFilterQualityPct() {
    //Build a cache of which checkboxes are checked.
    const actions = document.querySelectorAll('input[name="QualityAction"]');
    const qual_value = document.getElementById('QualityPct');

    let checkedCount = 0;
    actions.forEach(action => {
        if (action.checked && qual_value && qual_value.value) {
            checkedCount++;
            activeFilters.qual_pct = action.value + '|' + qual_value.value;
        }
    });

    if (checkedCount > 1) {
        console.log("ERROR! More than one radio button is checked. Only one should be checked.");
    } else if(checkedCount == 0) {
        delete activeFilters.qual_pct;
    }
}

function handleFilterStackSize() {
    //Build a cache of which checkboxes are checked.
    const actions = document.querySelectorAll('input[name="StackSizeAction"]');
    const stack_size = document.getElementById('StackSize');

    let checkedCount = 0;
    actions.forEach(action => {
        if (action.checked && stack_size && stack_size.value) {
            checkedCount++;
            activeFilters.stack_size = action.value + '|' + stack_size.value;
        }
    });

    if (checkedCount > 1) {
        console.log("ERROR! More than one radio button is checked. Only one should be checked.");
    } else if(checkedCount == 0) {
        delete activeFilters.stack_size;
    }
}

// Function to check if checkboxes already exist
function hasFilters() {
    return document.getElementById('filterSection') !== null;
}

function handleItemClick(event) {
    const closest_pad_container = event.target.closest('.pad-container');

    //console.log("DEBUG: Item clicked was", event.target);

    if(event.ctrlKey) {
        //console.log("DEBUG: Ctrl-click detected on", event.target);
        const item_details = closest_pad_container.firstChild;

        /* We toggle the event handlers to prevent the item being removed from the move slot as, fundamentally,
        the page expects a 'left click' to open the link, and we are using that for something else.*/
        this.removeEventListener('click', handleItemClick);
        openItemDBTab(event, item_details);
        this.addEventListener('click', handleItemClick);
    } else {
        // Check if the click originated from an element within pad-container
        const isClickInsidePadContainer = closest_pad_container !== null;

        if (isClickInsidePadContainer) {
            const item_div = closest_pad_container.querySelector('.tooltip');
            //console.log("DEBUG: Toggling click state on ", item_div);
            toggleSelectedState(item_div);
        }
    }
}

function handleParkSlotClick(event) {
    const closest_pad_container = event.target.closest('.pad-container');
    const slot = closest_pad_container.parentNode;

    //console.log("DEBUG: Got park slot event from", event, "nearest pad-container is", closest_pad_container);
    //console.log("DEBUG: Parent is", slot);

    if(event.ctrlKey) {
        //console.log("DEBUG: Ctrl-click detected on", event.target);
        /* We toggle the event handlers to prevent the item being removed from the move slot as, fundamentally,
        the page expects a 'left click' to open the link, and we are using that for something else.*/
        this.removeEventListener('click', handleParkSlotClick);
        //In this case, the pad-container also has the item details.
        openItemDBTab(event, closest_pad_container);
        this.addEventListener('click', handleParkSlotClick);
    } else {
        // Find the div with the ID 'source_vault'
        var sourceVault = document.getElementById('source_vault');

        // Find all divs under the source_vault with 'aria-disabled=true'
        var disabledDivs = sourceVault.querySelectorAll('div[aria-disabled="true"]');

        disabledDivs.forEach(possible_parent => {
            if (isItemParent(possible_parent, closest_pad_container)) {
                possible_parent.removeAttribute('park_slot');
                possible_parent.removeAttribute('aria-disabled');
                possible_parent.classList.add('ui-selectable');
                possible_parent.classList.remove('green_checkmark', 'ui-state-disabled');

                //Remove the green tint.
                const image_layer = possible_parent.querySelector('.pad-item');
                image_layer.classList.remove('mark_as_moving');
            }
        });

        slot.removeChild(closest_pad_container);
        slot.textContent = "Slot# " + parseInt(slot.id.split('_')[2]);
        slot.setAttribute('aria-disabled', 'false');

        selectedItems[slot.id] = undefined;
    }
}

function helper_NumberFilter(item, filterValue, itemValue, currentVisualStatus) {
    const [operator, filter_number_string] = filterValue.split('|');
    const filter_number = parseInt(filter_number_string, 10);
    const item_number = parseInt(itemValue, 10);
    switch (operator) {
        case '>':
            if (item_number <= filter_number) { return true; }
            break;
        case '<':
            if (item_number >= filter_number) { return true; }
            break;
        case '=':
            if (item_number !== filter_number) { return true; }
            break;
        default:
            console.log("Programming error: Hit default case for a number filter");
            break;
    }
    return currentVisualStatus;
}

function highlightBasedOnFilters() {

    // Find the div with the ID 'source_vault'
    const sourceVault = document.getElementById('source_vault');

    // Find all divs under the source_vault with ui-selectable and tooltip classes
    const itemDivs = sourceVault.querySelectorAll('.ui-selectable.tooltip');

    itemDivs.forEach(item => {
        // Check if all filter criteria match
        let visuallyDisable = false;
        Object.entries(activeFilters).forEach(([key, filterValue]) => {
            const itemValue = item.getAttribute(key);

            // If filterValue is an array, check if itemValue is included in it
            if (Array.isArray(filterValue)) {
                if (filterValue.length > 0 && !filterValue.includes(itemValue)) {
                    visuallyDisable = true;
                }
            } else if (key === "mfg_by") {
                const [operator, mfg_txt] = filterValue.split('|');
                switch (operator) {
                    case '!=':
                        if (itemValue === mfg_txt) {
                            visuallyDisable = true;
                        }
                        break;
                    case '=':
                        if (!itemValue.toLowerCase().includes(mfg_txt.toLowerCase())) {
                            visuallyDisable = true;
                        }
                        break;
                    default:
                        console.log("Programming error: Hit default case for",key,"filter");
                        break;
                }
            } else if (key == "name") {
                if (!itemValue.toLowerCase().includes(filterValue.toLowerCase())) {
                    visuallyDisable = true;
                }
            } else if(key === "qual_pct" || key === "stack_size") {
                visuallyDisable = helper_NumberFilter(item, filterValue, itemValue, visuallyDisable);
            } else {
                if (itemValue !== filterValue) {
                    visuallyDisable = true;
                }
            }
        });

        const item_img = item.querySelector('.pad-item');
        // If all criteria match, make sure item is visible
        if (visuallyDisable) {
            item_img.classList.add('mark_as_filtered');
            item.style.opacity = .5;
        } else {
            item_img.classList.remove('mark_as_filtered');
            item.style.opacity = 1;
        }
    });
}//end highlightBasedOnFilters

// Function to insert checkboxes for Roman numerals 1-9 ahead of the given element
function insertItemLevelFilterCheckboxes(filterParent) {
    // Create a div element for the checkboxes row
    const itemLevelFilterRow = document.createElement('td');
    itemLevelFilterRow.id = 'itemLevelFilterRow';

    // Create and append checkboxes for Roman numerals 1-9
    for (let i = 1; i <= 9; i++) {
        const checkbox = document.createElement('input');
        const roman_numeral = getRomanNumeral(i);
        checkbox.type = 'checkbox';
        checkbox.value = roman_numeral;
        checkbox.id = 'ilvl_filter_' + i;
        checkbox.name = 'ilvlfilter';
        checkbox.addEventListener('change', handleFilters);

        const label = document.createElement('label');
        label.innerHTML = roman_numeral;
        label.htmlFor = 'ilvl_filter_' + i;

        itemLevelFilterRow.appendChild(checkbox);
        itemLevelFilterRow.appendChild(label);
    }

    // Insert the checkboxes row ahead of the target element
    filterParent.append(itemLevelFilterRow);
}

function insertItemNameFilter(filterParent) {
    // Create a div element for the checkboxes row
    const itemNameFilterRow = document.createElement('td');
    itemNameFilterRow.id = 'itemNameFilterRow';

    const nameBox = document.createElement('input');
    nameBox.type = 'text';
    nameBox.id = 'ItemNameBox';
    nameBox.addEventListener('input', handleFilters);
    const nblabel = document.createElement('label');
    nblabel.innerHTML = 'Item Name: ';
    nblabel.htmlFor = 'ItemNameBox';

    itemNameFilterRow.appendChild(nblabel);
    itemNameFilterRow.appendChild(nameBox);

    // Insert the checkboxes row ahead of the target element
    filterParent.append(itemNameFilterRow);
}

// Function to insert checkboxes for Roman numerals 1-9 ahead of the given element
function insertPMOnlyFilter(filterParent) {
    // Create a element for the checkboxes row
    const PMFilterElement = document.createElement('td');
    PMFilterElement.id = 'PMFilter';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = 1;
    checkbox.id = 'PMCheckbox';
    checkbox.addEventListener('change', handleFilters);
    const cblabel = document.createElement('label');
    cblabel.innerHTML = 'Hide Any Non-Player Made';
    cblabel.htmlFor = 'PMCheckbox';

    const nameBox = document.createElement('input');
    nameBox.type = 'text';
    nameBox.id = 'PMNameBox';
    nameBox.addEventListener('input', handleFilters);
    const nblabel = document.createElement('label');
    nblabel.innerHTML = 'Show only Made By: ';
    nblabel.htmlFor = 'PMNameBox';

    PMFilterElement.appendChild(cblabel);
    PMFilterElement.appendChild(checkbox);
    PMFilterElement.appendChild(document.createElement('br'));
    PMFilterElement.appendChild(nblabel);
    PMFilterElement.appendChild(nameBox);

    // Insert the checkboxes row ahead of the target element
    filterParent.append(PMFilterElement);
}

function insertQualityFilter(filterParent) {
    const qualityFilterElement = document.createElement('td');
    qualityFilterElement.id = "QualityFilter";

    //Maybe it's just me, but it makes more sense to put a table in a table than...other options
    const inner_table_root = document.createElement('table');
    inner_table_root.width = "100%";
    qualityFilterElement.appendChild(inner_table_root);
    const first_table_row = document.createElement('tr');
    inner_table_root.appendChild(first_table_row);
    //1_1 meaning row 1, col 1
    const cell_1_1 = document.createElement('td');
    cell_1_1.classList.add("quality_filter_radio_td");
    const cell_2_1 = document.createElement('td');
    cell_2_1.classList.add("quality_filter_radio_td");
    const cell_3_1 = document.createElement('td');
    cell_3_1.classList.add("quality_filter_radio_td");
    //row 1 column 2
    const cell_1_2 = document.createElement('td');
    cell_1_2.classList.add("quality_filter_number_td");
    cell_1_2.rowSpan = 3;

    //Now build the table.
    first_table_row.appendChild(cell_1_1);
    first_table_row.appendChild(cell_1_2);
    const second_table_row = document.createElement('tr');
    inner_table_root.appendChild(second_table_row);
    second_table_row.appendChild(cell_2_1);
    const third_table_row = document.createElement('tr');
    inner_table_root.appendChild(third_table_row);
    third_table_row.appendChild(cell_3_1);

    //Label and option for 'Equals' percent option.
    const actionEqualsLabel = document.createElement('label');
    actionEqualsLabel.innerHTML = '=';
    actionEqualsLabel.htmlFor = 'QualityActionEQ';
    cell_1_1.appendChild(actionEqualsLabel);
    const actionRadioEqual = document.createElement('input');
    actionRadioEqual.type = 'radio';
    actionRadioEqual.value = '=';
    actionRadioEqual.id = 'QualityActionEQ';
    actionRadioEqual.name = 'QualityAction';
    actionRadioEqual.addEventListener('click', handleFilters);
    cell_1_1.appendChild(actionRadioEqual);

    //Label and option for 'Less than' percent option.
    const actionLessThanLabel = document.createElement('label');
    actionLessThanLabel.innerHTML = '<';
    actionLessThanLabel.htmlFor = 'QualityActionLT';
    cell_2_1.appendChild(actionLessThanLabel);
    const actionRadioLessThan = document.createElement('input');
    actionRadioLessThan.type = 'radio';
    actionRadioLessThan.value = '<';
    actionRadioLessThan.id = 'QualityActionLT';
    actionRadioLessThan.name = 'QualityAction';
    actionRadioLessThan.addEventListener('change', handleFilters);
    cell_2_1.appendChild(actionRadioLessThan);

    //On the same line as 'less than' is also the input box for the actual quality %
    const qualityPercent = document.createElement('input');
    qualityPercent.type = 'number';
    qualityPercent.min = '1';
    qualityPercent.max = '200';
    qualityPercent.step = '1';
    qualityPercent.id = 'QualityPct';
    qualityPercent.style = 'width: 6ch;';//This should only need to be 3ch, but 6 is needed for some reason.
    qualityPercent.addEventListener('input', handleFilters);
    cell_1_2.textContent = 'Quality %';
    cell_1_2.appendChild(document.createElement('br'));
    cell_1_2.appendChild(qualityPercent);

    //Label and option for 'Greater than' percent option.
    const actionGreaterThanLabel = document.createElement('label');
    actionGreaterThanLabel.innerHTML = '>';
    actionGreaterThanLabel.htmlFor = 'QualityActionGT';
    cell_3_1.appendChild(actionGreaterThanLabel);
    const actionRadioGreaterThan = document.createElement('input');
    actionRadioGreaterThan.type = 'radio';
    actionRadioGreaterThan.value = '>';
    actionRadioGreaterThan.id = 'QualityActionGT';
    actionRadioGreaterThan.name = 'QualityAction';
    actionRadioGreaterThan.addEventListener('change', handleFilters);
    cell_3_1.appendChild(actionRadioGreaterThan);

    //Now append it all to the actual page
    filterParent.append(qualityFilterElement);
}//end insertQualityFilter

function insertStackSizeFilter(filterParent) {
    const qualityFilterElement = document.createElement('td');
    qualityFilterElement.id = "StackSizeFilter";

    //Maybe it's just me, but it makes more sense to put a table in a table than...other options
    const inner_table_root = document.createElement('table');
    inner_table_root.width = "100%";
    qualityFilterElement.appendChild(inner_table_root);
    const first_table_row = document.createElement('tr');
    inner_table_root.appendChild(first_table_row);
    //1_1 meaning row 1, col 1
    const cell_1_1 = document.createElement('td');
    cell_1_1.classList.add("stacksize_filter_radio_td");
    const cell_2_1 = document.createElement('td');
    cell_2_1.classList.add("stacksize_filter_radio_td");
    const cell_3_1 = document.createElement('td');
    cell_3_1.classList.add("stacksize_filter_radio_td");
    //row 1 column 2
    const cell_1_2 = document.createElement('td');
    cell_1_2.classList.add("stacksize_filter_number_td");
    cell_1_2.rowSpan = 3;

    //Now build the table.
    first_table_row.appendChild(cell_1_1);
    first_table_row.appendChild(cell_1_2);
    const second_table_row = document.createElement('tr');
    inner_table_root.appendChild(second_table_row);
    second_table_row.appendChild(cell_2_1);
    const third_table_row = document.createElement('tr');
    inner_table_root.appendChild(third_table_row);
    third_table_row.appendChild(cell_3_1);

    //Label and option for 'Equals' percent option.
    const actionEqualsLabel = document.createElement('label');
    actionEqualsLabel.innerHTML = '=';
    actionEqualsLabel.htmlFor = 'StackSizeActionEQ';
    cell_1_1.appendChild(actionEqualsLabel);
    const actionRadioEqual = document.createElement('input');
    actionRadioEqual.type = 'radio';
    actionRadioEqual.value = '=';
    actionRadioEqual.id = 'StackSizeActionEQ';
    actionRadioEqual.name = 'StackSizeAction';
    actionRadioEqual.addEventListener('click', handleFilters);
    cell_1_1.appendChild(actionRadioEqual);

    //Label and option for 'Less than' percent option.
    const actionLessThanLabel = document.createElement('label');
    actionLessThanLabel.innerHTML = '<';
    actionLessThanLabel.htmlFor = 'StackSizeActionLT';
    cell_2_1.appendChild(actionLessThanLabel);
    const actionRadioLessThan = document.createElement('input');
    actionRadioLessThan.type = 'radio';
    actionRadioLessThan.value = '<';
    actionRadioLessThan.id = 'StackSizeActionLT';
    actionRadioLessThan.name = 'StackSizeAction';
    actionRadioLessThan.addEventListener('change', handleFilters);
    cell_2_1.appendChild(actionRadioLessThan);

    //On the same line as 'less than' is also the input box for the actual quality %
    const qualityPercent = document.createElement('input');
    qualityPercent.type = 'number';
    qualityPercent.min = '1';
    qualityPercent.max = '200';
    qualityPercent.step = '1';
    qualityPercent.id = 'StackSize';
    qualityPercent.style = 'width: 6ch;';//This should only need to be 3ch, but 6 is needed for some reason.
    qualityPercent.addEventListener('input', handleFilters);
    cell_1_2.textContent = 'Stack Size ';
    cell_1_2.appendChild(document.createElement('br'));
    cell_1_2.appendChild(qualityPercent);

    //Label and option for 'Greater than' percent option.
    const actionGreaterThanLabel = document.createElement('label');
    actionGreaterThanLabel.innerHTML = '>';
    actionGreaterThanLabel.htmlFor = 'StackSizeActionGT';
    cell_3_1.appendChild(actionGreaterThanLabel);
    const actionRadioGreaterThan = document.createElement('input');
    actionRadioGreaterThan.type = 'radio';
    actionRadioGreaterThan.value = '>';
    actionRadioGreaterThan.id = 'StackSizeActionGT';
    actionRadioGreaterThan.name = 'StackSizeAction';
    actionRadioGreaterThan.addEventListener('change', handleFilters);
    cell_3_1.appendChild(actionRadioGreaterThan);

    //Now append it all to the actual page
    filterParent.append(qualityFilterElement);
}//end insertStackSizeFilter

function isItemParent(parent, potential) {
    const parent_iid = parent.getAttribute('iid');
    const parent_slot = parent.getAttribute('slot');
    const potential_iid = potential.getAttribute('iid');
    const potential_slot = potential.getAttribute('slot');
    const is_clone = potential.getAttribute('data-clone');

  return parent_iid === potential_iid && parent_slot === potential_slot && is_clone;
}

function openItemDBTab(event, item_details) {
    //Ctrl-click = Open link to item as if we did a DB search.
    item_details.classList.add('acc_vault_moreinfo');

    // Create a new MouseEvent object
    var simulated_event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    // Dispatch the click event on the element
    item_details.dispatchEvent(simulated_event);
    item_details.classList.remove('acc_vault_moreinfo');
}

function toggleSelectedState(itemDiv) {
    const isUiSelectable = itemDiv.classList.contains('ui-selectable');
    const isUiStateDisabled = itemDiv.classList.contains('green_checkmark');

    // Check if adding a new item would exceed the maximum limit
    if (selectedItems.length + 1 > maxSelectedItems) {
        console.log("Aborting due to full parked item list.");
        return;
    }

    // Get all occupied table slots
    const trasfer_slots_parent = document.querySelector('#parkslots');
    const occupiedSlots = trasfer_slots_parent.querySelectorAll('table td[aria-disabled="true"]');

    // Find the first available slot
    const emptySlot = trasfer_slots_parent.querySelector('td[aria-disabled="false"], td:not([aria-disabled])');
    //console.log("DEBUG: Got ", emptySlot, "as empty slot");

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
        if (typeof selectedItems[empty_slot_id] === 'undefined') {
            selectedItems[empty_slot_id] = itemDiv;
        } else {
            console.log("Programmer error, slot",empty_slot_id,"not empty. Has value", selectedItems[empty_slot_id]);
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

                selectedItems[slot.id] = undefined;
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
}//end toggleSelectedState

(function() {
    'use strict';

    // ID of the target element
    const targetElementId = 'source_vault';

    function handleHTMLModification(addedNode) {
        //console.log('DEBUG: Handling HTML modification in myfunction:', addedNode.innerHTML);

        // Insert checkboxes for Roman numerals 1-9 if they don't exist
        if (!hasFilters()) {
            addCSS();
            addFilters(addedNode);
            addMoveSlotEventHandler();
            changeHelpText();
        }

        const orig_extracted_data = getRelevantHTMLValues(addedNode.innerHTML);
        //Wipe out the node's current HTML, we will rebuild it.
        addedNode.innerHTML = '';

        //addedNode is the mutation target, ie, source_vault, and is passed by reference.
        createVaultPage(orig_extracted_data, addedNode);

        /* Any other filters should go here and be written in a way that you check the filter value on the page
       rather than toggle based on an event only.
       IE: checkboxes need to consider all checkbox values for their type and do the right thing regardless of
       what the event says to do.

       This section has to come after we finish creating the vault page itself for obvious reasons.
        */
        handleFilters();
    };

    //When a transfer happens we need to clean out the slots to be moved.
    function resetParkedSlots() {
        const park_table = document.querySelector('#parkslots');
        if(!park_table) {
            //page hasn't loaded yet or they changed something.
            return;
        }

        const table_slots = park_table.querySelectorAll('td');

        table_slots.forEach(slot => {
            const childNode = slot.querySelector('div.tooltip.pad-container');
            if(childNode) {
                slot.removeChild(childNode);
                slot.textContent = "Slot# " + parseInt(slot.id.split('_')[2]);
                slot.setAttribute('aria-disabled', 'false');

                selectedItems[slot.id] = undefined;
            }
        });
    }

    // Function to check if the node is within the target element
    function isWithinTargetElement(node) {
        return node && node.id === targetElementId || (node.parentNode && isWithinTargetElement(node.parentNode));
    }

    // Function to handle the DOM changes
    function handleChanges(mutationsList, observer) {
        for (const mutation of mutationsList) {
            /*The removeNodes.length check is needed for when you switch source_chars. You get two mutations in that case,
             one to delete the div with classes 'clearfix inventory_pane' and a second to actually add in the new content.
             Amusingly, both requests include correct page data...so they are re-rendering the page twice when they could
             just do it once.
            */
            //console.log("DEBUG: Saw mutation:", mutation);
            if (mutation.type === 'childList' && isWithinTargetElement(mutation.target) && mutation.removedNodes.length === 0) {
                //console.log("DEBUG: mutation seen:", mutation);
                // Disconnect the observer temporarily to avoid an infinite loop
                observer.disconnect();
                handleHTMLModification(mutation.target);
                // Reconnect the observer after modifications
                observer.observe(document.documentElement, config);
            } else if (mutation.type === 'childList' && isWithinTargetElement(mutation.target) && mutation.removedNodes.length > 0) {
                observer.disconnect();
                //console.log("DEBUG: Removing park slot contents.");
                //Whenever the page is changed (like swapping chars or transferring) the vault is removed, and we call this.
                resetParkedSlots()
                observer.observe(document.documentElement, config);
            }
        }
    }

    // Create a MutationObserver to watch for changes on 'source_vault'
    const observer = new MutationObserver(handleChanges);

    // Specify options for the observer
    const config = { childList: true, subtree: true };

    // Start checking for 'source_vault' existence
    observer.observe(document.documentElement, config);

})();
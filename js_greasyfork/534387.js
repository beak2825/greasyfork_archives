// ==UserScript==
// @name         [Wallhaven] Subscription Tools
// @namespace    NooScripts
// @author       NooScripts
// @version      1.6
// @description  Adds a useful "tool box" to the top of the side bar on the subscriptions page (Filter Subs by name, sort them by amount, toggle on/off visibility of subs with 0 new wallpapers)
// @license MIT
// @match        https://wallhaven.cc/subscription*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534387/%5BWallhaven%5D%20Subscription%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/534387/%5BWallhaven%5D%20Subscription%20Tools.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
    'use strict';

    // Create container for search tools
    const container = document.createElement('div');
    container.id = 'custom-tag-filter';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '8px';
    container.style.padding = '10px';
    container.style.background = '#111';
    container.style.zIndex = '9999';

    // Search input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Filter tags...';
    input.style.padding = '6px';
    input.style.width = '100%';
    input.style.background = '#222';
    input.style.color = '#fff';
    input.style.border = '1px solid #555';
    input.style.borderRadius = '4px';

    // Create a container for buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '8px';
    buttonsContainer.style.width = '100%';
    buttonsContainer.style.margin = 'auto';

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.padding = '6px 10px';
    resetBtn.style.background = '#333';
    resetBtn.style.color = '#fff';
    resetBtn.style.border = '1px solid #555';
    resetBtn.style.borderRadius = '4px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.flex = '1';

    // Toggle style button
    const toggleBtn = document.createElement('button');
    toggleBtn.style.padding = '6px 10px';
    toggleBtn.style.background = '#333';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.border = '1px solid #555';
    toggleBtn.style.borderRadius = '4px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.flex = '1';

    // Append buttons to the buttons container
    buttonsContainer.appendChild(resetBtn);
    buttonsContainer.appendChild(toggleBtn);

    // Append input and buttons container to the main container
    container.appendChild(input);
    container.appendChild(buttonsContainer);

    // Insert above .sidebar-background
    const sidebarBg = document.querySelector('.sidebar-background');
    if (sidebarBg && sidebarBg.parentNode) {
        sidebarBg.parentNode.insertBefore(container, sidebarBg);
    } else {
        console.warn('⚠️ Could not find sidebar');
    }

    // Initialize styleEnabled from localStorage or default to true
    let styleEnabled = localStorage.getItem('styleEnabled') !== null
        ? JSON.parse(localStorage.getItem('styleEnabled'))
        : true;

    const styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);

    // Set initial button text and stylesheet based on styleEnabled
    toggleBtn.textContent = styleEnabled ? 'Show Empty' : 'Hide Empty';
    styleSheet.textContent = styleEnabled ? `
        .blocklist.subscription-list li:is([class=""]) {
            display: none !important;
        }
    ` : '';

    // Load saved input text from localStorage
    input.value = localStorage.getItem('filterText') || '';
    if (input.value) performFiltering(); // Apply filter if there's saved text

    // Add or remove the CSS to hide empty <li> elements
    function toggleStyle() {
        styleEnabled = !styleEnabled;
        localStorage.setItem('styleEnabled', JSON.stringify(styleEnabled)); // Save to localStorage

        if (styleEnabled) {
            styleSheet.textContent = `
                .blocklist.subscription-list li:is([class=""]) {
                    display: none !important;
                }
            `;
            toggleBtn.textContent = 'Show Empty';
        } else {
            styleSheet.textContent = '';
            toggleBtn.textContent = 'Hide Empty';
        }
    }

    // Function to get all li elements in blocklist
    function getTagItems() {
        return Array.from(document.querySelectorAll('ul.blocklist.subscription-list li'));
    }

    // Perform filtering based on input
    function performFiltering() {
        const term = input.value.toLowerCase().trim();
        localStorage.setItem('filterText', input.value); // Save input text to localStorage
        const items = getTagItems();
        items.forEach(li => {
            const tag = li.querySelector('.tagname');
            if (!tag) return;
            const tagText = tag.textContent.toLowerCase();
            li.style.display = tagText.includes(term) ? '' : 'none';
        });
    }

    // Reset the filter
    function resetFilter() {
        const items = getTagItems();
        items.forEach(li => li.style.display = '');
        input.value = '';
        localStorage.setItem('filterText', ''); // Clear saved input text
    }

    // Add event listeners
    input.addEventListener('input', performFiltering);
    resetBtn.addEventListener('click', resetFilter);
    toggleBtn.addEventListener('click', toggleStyle);
});



//Script 2: Sort Subscriptions By Number

function sortListItems(descending) {
    const container = document.querySelector('[data-storage-id="tagsubscriptions"]');
    if (!container) {
        console.error('Tag subscriptions container not found.');
        return;
    }

    const listItems = Array.from(container.querySelectorAll('.blocklist[class*="subscription-list"] [class*="has-"]'));

    listItems.sort((a, b) => {
        const valueA = parseInt(a.querySelector('small').textContent);
        const valueB = parseInt(b.querySelector('small').textContent);

        return descending ? valueB - valueA : valueA - valueB;
    });

    listItems.forEach((item) => {
        const parent = item.parentNode;
        parent.appendChild(item);
    });
}

function createDropdown(labelText, options, onChange) {
    const dropdown = document.createElement('select');

    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.text = option.text;
        dropdown.appendChild(optionElement);
    });

    dropdown.addEventListener('change', onChange);

    const label = document.createElement('label');
    label.style.marginRight = '10px';
    label.appendChild(document.createTextNode(labelText + ': '));
    label.appendChild(dropdown);

    return label;
}

function handleSortDropdownChange() {
    if (this.value === 'default') {
        localStorage.removeItem('subscriptionSortOrder');
        location.reload();
        return;
    }

    const descending = this.value === 'desc';
    sortListItems(descending);
    localStorage.setItem('subscriptionSortOrder', descending ? 'desc' : 'asc');
}

function handleDisplayDropdownChange() {
    const existingStyle = document.getElementById('display-filter-style');
    if (existingStyle) {
        existingStyle.remove();
    }

    let css = '';
    switch (this.value) {
        case 'sfw':
            css = `
                [class="has-new "]:has([class="tagname sketchy"]) {display: none!important;}
                [class="has-new "]:has([class="tagname nsfw"]) {display: none!important;}
            `;
            break;
        case 'sketch':
            css = `
                [class="has-new "]:has([class="tagname sfw"]) {display: none!important;}
                [class="has-new "]:has([class="tagname nsfw"]) {display: none!important;}
            `;
            break;
        case 'nsfw':
            css = `
                [class="has-new "]:has([class="tagname sfw"]) {display: none!important;}
                [class="has-new "]:has([class="tagname sketchy"]) {display: none!important;}
            `;
            break;
    }

    if (css) {
        const style = document.createElement('style');
        style.id = 'display-filter-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    localStorage.setItem('subscriptionDisplayFilter', this.value);
}

function initializeDropdown() {
    const sortDropdownOptions = [
        { value: 'default', text: 'Default' },
        { value: 'desc', text: 'Most to Least' },
        { value: 'asc', text: 'Least To Most' }
    ];

    const displayDropdownOptions = [
        { value: 'all', text: 'All' },
        { value: 'sfw', text: 'Only SFW' },
        { value: 'sketch', text: 'Only Sketch' },
        { value: 'nsfw', text: 'Only NSFW' }
    ];

    const sortDropdown = createDropdown('Sort Order', sortDropdownOptions, handleSortDropdownChange);
    const displayDropdown = createDropdown('Display', displayDropdownOptions, handleDisplayDropdownChange);

    const container = document.createElement('div');
    container.id = 'sort-dropdown-container';
    container.style.padding = '0px 0px 8px 0px';
    container.style.marginBottom = '10px';
    container.style.backgroundColor = '#111111';
    container.style.borderBottom = '1px solid #4a4a4a';
    container.style.fontSize = '12px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '10px';

    container.appendChild(sortDropdown);
    container.appendChild(displayDropdown);

    const sidebarBackground = document.querySelector('.sidebar-background');
    if (sidebarBackground) {
        sidebarBackground.insertBefore(container, sidebarBackground.firstChild);
    } else {
        console.error('.sidebar-background element not found.');
    }

    const sortOrder = localStorage.getItem('subscriptionSortOrder');
    if (sortOrder === 'desc') {
        sortDropdown.querySelector('select').value = 'desc';
        sortListItems(true);
    } else if (sortOrder === 'asc') {
        sortDropdown.querySelector('select').value = 'asc';
        sortListItems(false);
    }

    const displayFilter = localStorage.getItem('subscriptionDisplayFilter');
    if (displayFilter) {
        displayDropdown.querySelector('select').value = displayFilter;
        handleDisplayDropdownChange.call(displayDropdown.querySelector('select'));
    }
}

initializeDropdown();

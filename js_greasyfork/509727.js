// ==UserScript==
// @name        FreshRSS NG Filter
// @namespace   https://github.com/hiroki-miya
// @version     1.0.4
// @description Mark as read and hide articles matching the rule in FreshRSS. Rules are described by regular expressions.
// @author      hiroki-miya
// @license     MIT
// @match       https://freshrss.example.net/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/509727/FreshRSS%20NG%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/509727/FreshRSS%20NG%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Language for sorting
    const sortLocale = 'ja';

    // Retrieve saved filters
    let savedFilters = GM_getValue('filters', {});

    // Define editingFilterName globally (the name of the filter currently being edited)
    let editingFilterName = null;

    // Add styles
    GM_addStyle(`
        #freshrss-ng-filter {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            width: max-content;
        }
        #freshrss-ng-filter > h2 {
            box-shadow: inset 0 0 0 0.5px black;
            padding: 5px 10px;
            text-align: center;
            cursor: move;
        }
        #freshrss-ng-filter > h4 {
            margin-top: 0;
        }
        #filter-list {
            margin-bottom: 10px;
            max-height: 50vh;
            overflow-y: auto;
        }
        .filter-item  {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #filter-edit > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 2;
            margin-bottom: 5px;
        }
        #filter-edit > div input {
            line-height: 2;
            margin: 0;
        }
        .filter-name,
        #filter-edit > div > label {
            flex-grow: 1;
            margin-right: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        #filter-edit > div > div:has(input[type="checkbox"]) {
            margin-left: 5px;
            max-width: 90%;
            width: 300px;
        }
        #filter-edit > div input[type="checkbox"] {
            transform: scale(1.5);
            margin-left: 4px;
        }
        .edit-filter, .delete-filter,
        #filter-edit > div > input {
            margin-left: 5px;
        }
        .filter-info-label {
            display: inline;
        }
        .filter-info {
            display: inline-block;
            border-radius: 50%;
            width: 16px;
            height: 16px;
            min-height: 16px;
            line-height: 1.2;
            margin-left: 4px;
            position: relative;
            top: -6px;
            text-align: center;
            background-color: black;
            color: white;
            font-weight: 700;
        }
    `);

    // Function to render the filter list
    function updateFilterList() {
        // Sort filters
        const filterNames = Object.keys(savedFilters).sort((a, b) => a.localeCompare(b, sortLocale));
        const filterList = filterNames.map(name => {
            const filter = savedFilters[name];
            const checked = filter.disabled ? 'checked' : '';
            return `
                <div class="filter-item">
                    <div class="filter-name">${name}</div>
                    <button class="edit-filter" data-name="${name}">Edit</button>
                    <button class="delete-filter" data-name="${name}">Delete</button>
                    <label><input type="checkbox" class="disable-filter" data-name="${name}" ${checked}> Disabled</label>
                </div>
            `;
        }).join('');

        // Render the filter list
        document.getElementById('filter-list').innerHTML = filterList || 'No registered filters';

        // Re-register the filter edit button events
        Array.from(document.querySelectorAll('.edit-filter')).forEach(button => {
            button.addEventListener('click', () => {
                const filterName = button.getAttribute('data-name');
                const filter = savedFilters[filterName];

                // Pre-fill the form with the filter values
                document.getElementById('filter-name').value = filterName;
                document.getElementById('filter-currentUrl').value = filter.currentUrl || '';
                document.getElementById('filter-title').value = filter.title || '';
                document.getElementById('filter-url').value = filter.url || '';
                document.getElementById('filter-content').value = filter.content || '';
                document.getElementById('filter-text').value = filter.text || '';
                document.getElementById('filter-case').checked = filter.caseInsensitive || false;

                editingFilterName = filterName;

                // Update the form heading for editing
                document.querySelector('#filter-edit-title').innerText = 'Edit Existing Filter';
                document.querySelector('#fnfs-save').innerText = 'Update';
            });
        });

        Array.from(document.querySelectorAll('.disable-filter')).forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filterName = e.target.getAttribute('data-name');
                savedFilters[filterName].disabled = e.target.checked;
                GM_setValue('filters', savedFilters);
                applyAllFilters();
            });
        });

        document.getElementById('fnfs-toggle-all-filters').innerText = areFiltersDisabled() ? 'Enable All Filters' : 'Disable All Filters';
        // Re-register the filter delete button events
        Array.from(document.querySelectorAll('.delete-filter')).forEach(button => {
            button.addEventListener('click', () => {
                const filterName = button.getAttribute('data-name');
                delete savedFilters[filterName];
                GM_setValue('filters', savedFilters);
                updateFilterList();
                applyAllFilters();
            });
        });
    }

    function areFiltersDisabled() {
        return Object.values(savedFilters).every(filter => filter.disabled);
    }

    function toggleAllFilters() {
        const disableAll = !areFiltersDisabled();
        Object.keys(savedFilters).forEach(filterName => {
            savedFilters[filterName].disabled = disableAll;
        });
        GM_setValue('filters', savedFilters);
        updateFilterList();
        applyAllFilters();
    }

    // Display filter settings
    function showSettings() {
        const settingsHTML = `
            <h2>NG Filter Settings</h2>
            <h4>Saved Filters</h4>
            <div id="filter-list"></div>
            <button id="fnfs-toggle-all-filters">${areFiltersDisabled() ? 'Enable All Filters' : 'Disable All Filters'}</button>
            <br>
            <hr>
            <h4 id="filter-edit-title">Create New Filter</h4>
            <div id="filter-edit">
            <div><label>Filter Name</label><input type="text" id="filter-name"></div>
            <div><label>FreshRSS Feed List URL</label><input type="text" id="filter-currentUrl"></div>
            <div><label>Title</label><input type="text" id="filter-title"></div>
            <div><label>Content URL</label><input type="text" id="filter-url"></div>
            <div><label class="filter-info-label">Content<div title="article.flux_content.innerText" class="filter-info">i</div></label><input type="text" id="filter-content"></div>
            <div><label class="filter-info-label">Text<div title="div.text.innerHTML" class="filter-info">i</div></label><input type="text" id="filter-text"></div>
            <div><label>Case insensitive?</label><div><input type="checkbox" id="filter-case"></div></div>
            <br>
            </div>
            <button id="fnfs-save">Save</button>
            <button id="fnfs-clear">Clear</button>
            <button id="fnfs-close">Close</button>
        `;

        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'freshrss-ng-filter';
        settingsDiv.innerHTML = settingsHTML;
        document.body.appendChild(settingsDiv);

        // Initial render of saved filter list
        updateFilterList();

        // Make settings panel draggable
        makeDraggable(settingsDiv);

        // Save or update button event
        document.getElementById('fnfs-save').addEventListener('click', () => {
            const filterName = document.getElementById('filter-name').value;
            const filterCurrentUrl = document.getElementById('filter-currentUrl').value;
            const filterTitle = document.getElementById('filter-title').value;
            const filterUrl = document.getElementById('filter-url').value;
            const filterContent = document.getElementById('filter-content').value;
            const filterText = document.getElementById('filter-text').value;
            const caseInsensitive = document.getElementById('filter-case').checked;

            if (!filterName) {
                alert('Please enter a filter name');
                return;
            }

            // Save or update the filter
            savedFilters[filterName] = {
                currentUrl: filterCurrentUrl,
                title: filterTitle,
                url: filterUrl,
                content: filterContent,
                text: filterText,
                caseInsensitive: caseInsensitive,
                disabled: false
            };

            // If the filter name was changed during editing, delete the old filter
            if (editingFilterName && editingFilterName !== filterName) {
                delete savedFilters[editingFilterName];
            }

            GM_setValue('filters', savedFilters);

            showTooltip('Saved');

            initEdit();

            // Update filter list
            updateFilterList();

            // Apply filters immediately after saving
            applyAllFilters();
        });

        // Clear button event
        document.getElementById('fnfs-clear').addEventListener('click', () => {
            initEdit();
        });

        // Close button event
        document.getElementById('fnfs-close').addEventListener('click', () => {
            document.body.removeChild(settingsDiv);
        });

        document.getElementById('fnfs-toggle-all-filters').addEventListener('click', toggleAllFilters);
    }

    function initEdit() {
        editingFilterName = null;
        document.getElementById('filter-name').value = '';
        document.getElementById('filter-currentUrl').value = '';
        document.getElementById('filter-title').value = '';
        document.getElementById('filter-url').value = '';
        document.getElementById('filter-content').value = '';
        document.getElementById('filter-text').value = '';
        document.getElementById('filter-case').checked = false;

        // Update the form heading for creating a new filter
        document.querySelector('#filter-edit-title').innerText = 'Create New Filter';
        document.querySelector('#fnfs-save').innerText = 'Save';
    }

    // Function to display the tooltip
    function showTooltip(message) {
        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.position = 'fixed';
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px 20px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.zIndex = '10000';
        tooltip.style.fontSize = '16px';
        tooltip.style.textAlign = 'center';

        // Add the tooltip to the page
        document.body.appendChild(tooltip);

        // Automatically remove the tooltip after 1 second
        setTimeout(() => {
            document.body.removeChild(tooltip);
        }, 1000);
    }

    // Make element draggable
    function makeDraggable(elmnt) {
        const header = elmnt.querySelector('h2');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            // Get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // Calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Mark as read and hide articles
    function markAsNG(articleElement) {
        if (!articleElement) return;

        // Check if mark_read function is available
        if (typeof mark_read === 'function') {
            mark_read(articleElement, true, true);
        } else {
            // Fallback: manually add 'read' class and trigger 'read' event
            articleElement.classList.add('read');
            const event = new Event('read');
            articleElement.dispatchEvent(event);
        }

        // Hide the article
        articleElement.remove();
    }

    // Apply all filters automatically
    function applyAllFilters() {
        const articles = Array.from(document.querySelectorAll('#stream > .flux'));
        const currentPageUrl = window.location.href;

        articles.forEach(article => {
            const title = article.querySelector('a.item-element.title')?.innerText || '';
            const url = article.querySelector('a.item-element.title')?.href || '';
            const content = article.querySelector('.flux_content')?.innerText || '';
            const text = article.querySelector('div.text')?.innerHTML || '';

            let matchesAnyFilter = false;

            for (let filterName in savedFilters) {
                const filter = savedFilters[filterName];
                if (filter.disabled) continue;

                const regexFlags = filter.caseInsensitive ? 'i' : '';
                const currentUrlMatch = !filter.currentUrl || new RegExp(filter.currentUrl, regexFlags).test(currentPageUrl);
                const titleMatch = !filter.title || new RegExp(filter.title, regexFlags).test(title);
                const urlMatch = !filter.url || new RegExp(filter.url, regexFlags).test(url);
                const contentMatch = !filter.content || new RegExp(filter.content, regexFlags).test(content);
                const textMatch = !filter.text || new RegExp(filter.text, regexFlags).test(text);

//                 console.log('titleMatch(' + titleMatch + '): ' + filter.title + ' = ' + title + '\n' +
//                      'urlMatch(' + urlMatch + '): ' + filter.url + ' = ' + url + '\n' +
//                      'contentMatch(' + contentMatch + '): ' + filter.content + ' = ' + content + '\n' +
//                      'textMatch(' + textMatch + '): ' + filter.text + ' = ' + text + '\n');

                // Check if all filter conditions are met (AND condition)
                if (currentUrlMatch && titleMatch && urlMatch && contentMatch && textMatch) {
                    markAsNG(article);
                    break;
                }
            }
        });
    }

    // Setup MutationObserver
    function setupObserver() {
        const targetNode = document.querySelector('#stream');
        if (targetNode) {
            const observer = new MutationObserver(applyAllFilters);
            observer.observe(targetNode, { childList: true, subtree: true });
            applyAllFilters();
        } else {
            // Retry if #stream is not found
            setTimeout(setupObserver, 1000);
        }
    }

    // Register settings screen
    GM_registerMenuCommand('Settings', showSettings);

    // Start setupObserver when the script starts
    setupObserver();
})();

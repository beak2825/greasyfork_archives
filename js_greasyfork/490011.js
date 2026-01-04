// ==UserScript==
// @name         Hall of Fame Filter
// @namespace    heartflower.torn.com
// @version      2.0
// @description  Filters the HOF on Torn based on set preferences
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=hof*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490011/Hall%20of%20Fame%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/490011/Hall%20of%20Fame%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playerHidden = {};
    let currentHash = window.location.hash.match(/type=([^&]*)/)?.[1] || 'level';

    function findTable() {
        let existing = document.body.querySelector('.hf-filter-user');
        if (existing) return;

        let tableRows = document.body.querySelector('.table___giQbC .tableBody___zyVTt')?.querySelectorAll('.tableRow___nX6Th');
        if (!tableRows || tableRows.length < 2) {
            setTimeout(findTable, 100);
            return;
        }

        let headers = []
        let tableHeaders = document.body.querySelector('.table___giQbC .tableHead___Ebgx8 .tableRow___nX6Th')?.querySelectorAll('.tableHeading___fJdkI');
        tableHeaders.forEach(header => {
            header = header.textContent.trim();
            headers.push(header);
        });

        tableRows.forEach(row => {
            row.classList.add('hf-filter-user');

            let userId = row.querySelector('.honorWrap___BHau4 .linkWrap___ZS6r9')?.getAttribute('href')?.replace('/profiles.php?XID=', '');
            if (userId) row.setAttribute('data-hf-user-id', userId);

            if (!userId) {
                let factionId = row.querySelector('.tdFactionLink___A5KhU')?.getAttribute('href')?.replace('/factions.php?step=profile&ID=', '') || 0;
                row.setAttribute('data-hf-user-id', factionId);
                if (factionId) userId = factionId;
            }

            if (userId) playerHidden[userId] ||= {};

            let userName = row.querySelector('.honorWrap___BHau4')?.querySelectorAll('.honor-text')?.[1]?.textContent;
            if (userName) row.setAttribute('data-hf-user-name', userName);
            if (userName) playerHidden[userId].username = false;

            let position = row.querySelector('.tdPosition___Ewmm6').textContent.replace('#', '');
            if (position) row.setAttribute('data-hf-place', position);
            if (position) playerHidden[userId].position = false;

            let userStatus = row.querySelector('.userStatusWrap___ljSJG svg')?.getAttribute('fill')?.replace(`url("#svg_status_`, '').replace(`")`, '');
            if (userStatus) row.setAttribute('data-hf-status', userStatus);
            if (userStatus) playerHidden[userId].status = false;

            let factionTag = row.querySelector('.factionWrap___GhZMa .factionImage___KYVJ_')?.getAttribute('alt');
            if (!factionTag) {
                factionTag = row.querySelector('.tdFactionImageWrapper___TMtUJ img')?.getAttribute('alt');

                if (!factionTag) {
                    factionTag = 'None';
                    row.setAttribute('data-hf-faction-tag', factionTag);
                    playerHidden[userId].factiontag = false;
                }
            } else {
                row.setAttribute('data-hf-faction-tag', factionTag);
                playerHidden[userId].factiontag = false;
            }

            parseInfo(userId, row, headers);
        });

        createFilters();
    }

    function parseInfo(userId, row, headers) {
        let cells = row.querySelectorAll('.tableData___eDESS');
        cells.forEach((cell, index) => {
            let header = headers[index];
            if (header == 'position' || header == 'player') return;

            header = header.replace(/\s+/g, '').replace('&', '-').toLowerCase();

            playerHidden[userId][header] = false;

            let value = cell.textContent.trim().replace(/,/g, '');

            if (header == 'rank') {
                if (currentHash.includes('faction')) {
                    header = 'rw-rank';
                    let img = Array.from(row.querySelectorAll('.factionRankIconWrapper___Kbise g'))
                    .find(g => g.hasAttribute('filter'))
                    ?.getAttribute('filter');

                    if (img.includes('diamond')) {
                        value = 'Diamond';
                    } else if (img.includes('platinum')) {
                        value = 'Platinum';
                    } else if (img.includes('gold')) {
                        value = 'Gold';
                    } else if (img.includes('silver')) {
                        value = 'Silver';
                    } else if (img.includes('bronze')) {
                        value = 'Bronze';
                    }
                }
            }

            row.setAttribute('data-hf-' + header, value);
        });
    }

    function createFilters() {
        let users = document.body.querySelectorAll('.hf-filter-user');
        if (!users || users.length < 1) {
            setTimeout(createFilters, 100);
            return;
        }

        let attributeValues = {};

        // Loop through all `.hf-filter-user` elements
        users.forEach(user => {
            // Loop through attributes of each user
            Array.from(user.attributes).forEach(attribute => {
                if (attribute.name.startsWith('data-hf')) {
                    // Store values in a Set to avoid duplicates
                    if (!attributeValues[attribute.name]) {
                        attributeValues[attribute.name] = new Set();
                    }

                    let rawValue = attribute.value.trim().replace(/,/g, '');
                    let numericValue = Number(rawValue);

                    if (!isNaN(numericValue) && rawValue !== "") {
                        attributeValues[attribute.name].add(numericValue); // Store as a number
                    } else {
                        attributeValues[attribute.name].add(rawValue); // Store as a string
                    }

                    if (attribute.name === "data-hf-faction-tag") {
                        attributeValues[attribute.name].add("In faction");
                    }
                }
            });
        });

        Object.entries(attributeValues).forEach(([name, values]) => {
            let cleanedName = name.replace('data-hf-', '');
            let isNumeric = Array.from(values).every(value => typeof value === 'number');

            if (name === 'data-hf-user-id' || name === 'data-hf-faction-id') {
                return;
            } else if (name === 'data-hf-status') {
                createStatusCheckbox();
            } else if (name === 'data-hf-place') {
                return;
                /*let numericValues = Array.from(values);
                let minValue = Math.min(...numericValues);
                let maxValue = Math.max(...numericValues);
                createMinMaxInput('position', minValue, maxValue);*/
            } else if (name == 'data-hf-level') {
                createMinMaxInput('level', 1, 100);
            } else if (name == 'data-hf-rank') {
                let data = [
                    '#1 Absolute beginner',
                    '#2 Beginner',
                    '#3 Inexperienced',
                    '#4 Rookie',
                    '#5 Novice',
                    '#6 Below Average',
                    '#7 Average',
                    '#8 Reasonable',
                    '#9 Above Average',
                    '#10 Competent',
                    '#11 Highly competent',
                    '#12 Veteran',
                    '#13 Distinguished',
                    '#14 Highly distinguished',
                    '#15 Professional',
                    '#16 Star',
                    '#17 Master',
                    '#18 Outstanding',
                    '#19 Celebrity',
                    '#20 Supreme',
                    '#21 Idolized',
                    '#22 Champion',
                    '#23 Heroic',
                    '#24 Legendary',
                    '#25 Elite',
                    '#26 Invincible'
                ];

                createDatalist('rank', data);
            } else if (isNumeric) {
                let numericValues = Array.from(values);
                let minValue = Math.min(...numericValues);
                let maxValue = Math.max(...numericValues);
                createMinMaxInput(cleanedName, minValue, maxValue);
            } else {
                let stringValues = Array.from(values).map(value => String(value)); // Ensure all are strings
                createDatalist(cleanedName, stringValues);
            }
        });
    }

    // Create the filter container
    function createFilterContainer() {
        let existingContainer = document.body.querySelector('.hf-filter-container');
        let existingTitle = document.body.querySelector('.hf-filter-title');
        let existingHR = document.getElementById('hf-hr');

        if (existingContainer || existingTitle || existingHR) {
            existingContainer?.remove();
            existingTitle?.remove();
            existingHR?.remove();
        }

        let hofRoot = document.getElementById('hof-root');
        let tableWrapper = document.body.querySelector('.tableWrapper___AkLoj');

        if (!hofRoot || !tableWrapper) {
            setTimeout(createFilterContainer, 100);
            return;
        }

        // Create the title
        let title = document.createElement('div');
        title.className = 'hf-filter-title title-black top-round m-top10';
        title.textContent = 'Hall of Fame Filter';
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.cursor = 'pointer';

        // Create the filter container
        let div = document.createElement('div');
        div.className = 'hf-filter-container';
        div.style.background = 'var(--default-bg-panel-color)';
        div.style.padding = '8px';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-evenly';
        div.style.borderRadius = '0 0 5px 5px';

        // Create a collapse button to collapse/uncollapse the filter container
        let collapseButton = document.createElement('span');
        collapseButton.textContent = '▼';
        collapseButton.style.paddingRight = '8px';

        // If the title gets clicked, collapse/uncollapse the filter container
        title.addEventListener('click', function() {
            if (collapseButton.textContent === '▼') {
                collapseButton.textContent = '►';
                title.style.borderRadius = '5px';
                div.style.display = 'none';

                // Remove ::before pseudo-element
                let styleElement = document.createElement('style');
                styleElement.textContent = `
                    .hf-filter-title:before {
                        display: none !important;
                    }
                `;
                document.head.appendChild(styleElement);
            } else {
                collapseButton.textContent = '▼';
                div.style.display = 'flex';
                title.style.borderRadius = '';
            }
        });

        // Create a line break
        let hr = document.createElement('hr');
        hr.id = 'hf-hr';
        hr.className = 'delimiter-999 m-top10 m-bottom10';

        // Create the container for min - max filters
        let minMaxContainer = document.createElement('div');
        minMaxContainer.className = 'hf-min-max-container';
        minMaxContainer.style.display = 'flex';
        minMaxContainer.style.flexDirection = 'column';
        minMaxContainer.style.alignItems = 'flex-end';
        minMaxContainer.style.width = 'max-content';

        // Create the container for datalist filters
        let datalistContainer = document.createElement('div');
        datalistContainer.className = 'hf-datalist-container';
        datalistContainer.style.display = 'flex';
        datalistContainer.style.flexDirection = 'column';
        datalistContainer.style.alignItems = 'flex-end';
        datalistContainer.style.width = 'max-content';

        // Append to the document
        title.appendChild(collapseButton);

        div.appendChild(minMaxContainer);
        div.appendChild(datalistContainer);

        hofRoot.insertBefore(div, tableWrapper);
        hofRoot.insertBefore(title, div);
        hofRoot.insertBefore(hr, tableWrapper);
    }

    // Create the min - max filter for a specific category
    function createMinMaxInput(category, min, max) {
        let container = document.body.querySelector('.hf-min-max-container');
        if (!container) return setTimeout(() => createMinMaxInput(category, min, max), 100);

        let existingElement = [...document.querySelectorAll('.hf-min-max')]
        .find(el => el.getAttribute('hf-category') === category);

        if (existingElement) {
            let [minInput, maxInput] = existingElement.querySelectorAll(`.hf-min-${category}, .hf-max-${category}`);

            if (minInput && maxInput) {
                let prevMin = Number(minInput.min) || min;
                let prevMax = Number(maxInput.max) || max;

                minInput.min = maxInput.min = Math.min(prevMin, min);
                minInput.max = maxInput.max = Math.max(prevMax, max);

                if (category !== 'level' && category !== 'age' && category !== 'members') {
                    minInput.value = minInput.min;
                    maxInput.value = maxInput.max;
                }
            }
            return;
        }

        // Create the container
        let minMaxContainer = document.createElement('div');
        minMaxContainer.className = 'hf-min-max';
        minMaxContainer.setAttribute('hf-category', category);

        // Create the title
        let title = document.createElement('span');
        title.textContent = category + ':';
        title.style.fontWeight = 'bold';
        title.style.textTransform = 'uppercase';

        // Create the inputs
        let minInput = createInput('hf-min-' + category, min, max);
        let maxInput = createInput('hf-max-' + category, min, max);

        // Set the values based on the min and max
        minInput.value = min;
        maxInput.value = max;

        // Make it easier to know it's a min-max input by putting a "-" there
        let span = document.createElement('span');
        span.textContent = '-';

        // Append to the document
        minMaxContainer.appendChild(title);
        minMaxContainer.appendChild(minInput);
        minMaxContainer.appendChild(span);
        minMaxContainer.appendChild(maxInput);
        container.appendChild(minMaxContainer);

        // Attach event listeners
        minInput.addEventListener('change', () => {
            minMaxInputChanged(category, minInput.value, maxInput.value);
        });

        maxInput.addEventListener('change', () => {
            minMaxInputChanged(category, minInput.value, maxInput.value);
        });
    }

    // Create the input field
    function createInput(className, min, max) {
        let input = document.createElement('input');
        input.className = className;
        input.type = 'number';
        input.min = min;
        input.max = max;
        input.step = '1';
        input.style.margin = '8px';
        input.style.paddingLeft = '4px';
        input.style.width = '70px';
        return input;
    }

    function checkHiddenStatus(user, userId) {
        if (Object.values(playerHidden[userId]).some(value => value === true)) {
            user.style.display = 'none';
        } else {
            user.style.display = '';
        }
    }

    // Create checkbox for status (offline / online / idle)
    function createStatusCheckbox() {
        let existing = document.body.querySelector('.hf-status-container');
        if (existing) return;

        let container = document.body.querySelector('.hf-filter-container');
        if (!container) {
            setTimeout(createStatusCheckbox, 100);
            return;
        }

        // Create the checkbox container
        let div = document.createElement('div');
        div.style.padding = '8px';
        div.className = 'hf-status-container';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'flex-start';
        div.style.width = 'max-content';

        // Create a span for the category name
        let span = document.createElement('span');
        span.textContent = 'Status:';
        span.style.fontWeight = 'bold';
        span.style.textTransform = 'uppercase';
        span.style.paddingBottom = '8px';

        // Append to the document
        container.prepend(div);
        div.appendChild(span);

        // Create the checkboxes
        createCheckbox(div, 'hf-online', 'Online', 'online');
        createCheckbox(div, 'hf-offline', 'Offline', 'offline');
        createCheckbox(div, 'hf-idle', 'Idle', 'idle');
    }

    // Create a single checkbox
    function createCheckbox(container, id, labelText, status) {
        // Create the label
        let label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.paddingBottom = '8px';

        // Create the checkbox
        let checkbox = document.createElement('input');
        checkbox.id = id;
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.style.marginRight = '4px';
        checkbox.className = 'hf-status-checkbox';

        // Insert the checkbox before the label textContent
        label.insertBefore(checkbox, label.lastChild);
        container.appendChild(label);

        // Add an event listener for when it changes
        checkbox.addEventListener('change', function() {
            checkBoxChanged('status', status, this.checked);
        });
    }

    // Create a single datalist based on category
    function createDatalist(category, data) {
        let container = document.body.querySelector('.hf-datalist-container');
        if (!container) return setTimeout(() => createDatalist(category, data), 100);

        let existingDiv = document.getElementById(category + '-div');
        let existingDatalist = document.getElementById(category + '-datalist');

        if (existingDatalist) {
            new Set([...existingDatalist.querySelectorAll('option')].map(o => o.value).concat(data))
                .forEach(value => {
                if (![...existingDatalist.options].some(o => o.value === value)) {
                    let option = document.createElement('option');
                    option.value = value;
                    existingDatalist.appendChild(option);
                }
            });
            return;
        }

        // Create the container
        let div = document.createElement('div');
        div.id = category + '-div';
        div.style.padding = '8px';

        // Create the category span
        let span = document.createElement('span');
        span.textContent = category.replace('-', ' ') + ':';
        span.style.fontWeight = 'bold';
        span.style.textTransform = 'uppercase';

        // Create the input
        let input = document.createElement('input');
        input.className = 'hf-datalist-input';
        input.id = category + '-input';
        input.setAttribute('list', category + '-datalist');
        input.style.marginLeft = '4px';
        input.style.paddingLeft = '4px';
        input.style.width = '150px';

        // Create the datalist
        let datalist = document.createElement('datalist');
        datalist.id = category + '-datalist';

        if (category === 'user-name') {
            span.textContent = 'torn name:';
            input.id = 'torn-name';
        }

        // Loop through the data and set each data value as an option
        data.forEach((text, index) => {
            let option = document.createElement('option');
            option.value = text;
            datalist.appendChild(option);
        });

        // Append to the document
        div.appendChild(span);
        div.appendChild(input);
        div.appendChild(datalist);
        container.appendChild(div);

        // Add an event listener to the input
        input.addEventListener('input', function(event) {
            datalistChanged(category, event.target.value);
        });
    }

    function checkBoxChanged(category, status, checked) {
        let attributeName = 'data-hf-' + category;
        let users = document.body.querySelectorAll('.hf-filter-user');

        users.forEach(user => {
            let userId = user.getAttribute('data-hf-user-id');
            let data = user.getAttribute(attributeName);

            if (data === status && checked) {
                playerHidden[userId][category] = false;
                checkHiddenStatus(user, userId);
            } else if (data === status && !checked) {
                playerHidden[userId][category] = true;
                checkHiddenStatus(user, userId);
            }
        });
    }

    function minMaxInputChanged(category, min, max) {
        if (category === 'position') category = 'place';

        let attributeName = 'data-hf-' + category;

        let users = document.body.querySelectorAll('.hf-filter-user');

        users.forEach(user => {
            let userId = user.getAttribute('data-hf-user-id');
            let data = user.getAttribute(attributeName);
            if (parseInt(data) >= min && parseInt(data) <= max) {
                playerHidden[userId][category] = false;
                checkHiddenStatus(user, userId);
            } else {
                playerHidden[userId][category] = true;
                checkHiddenStatus(user, userId);
            }
        });
    }

    function datalistChanged(category, value) {
        let attributeName = 'data-hf-' + category;
        let users = document.body.querySelectorAll('.hf-filter-user');

        users.forEach(user => {
            let userId = user.getAttribute('data-hf-user-id');
            let data = user.getAttribute(attributeName);

            if (value === 'In faction' && category === 'faction-tag' && data !== 'None') {
                playerHidden[userId][category] = false;
                checkHiddenStatus(user, userId);
            } else if (data == value || value == '') {
                playerHidden[userId][category] = false;
                checkHiddenStatus(user, userId);
            } else {
                playerHidden[userId][category] = true;
                checkHiddenStatus(user, userId);
            }
        });
    }

    // Attach click event listener
    document.body.addEventListener('click', (event) => {
        setTimeout(() => handleButtonClick(event), 250);
    });

    // If anything on the page is clicked, check if script already there
    function handleButtonClick(event) {
        let hash = window.location.hash.match(/type=([^&]*)/)?.[1] || 'level';

        if (currentHash === hash) {
            findTable();
            triggerMinMaxListener();
            triggerCheckBoxListener();
            triggerDataListChange();
        } else {
            currentHash = hash;
            createFilterContainer();
            findTable();
        }
    }

    // Trigger the min-max listener when the page changes
    function triggerMinMaxListener() {
        let containers = document.querySelectorAll('.hf-min-max');

        containers.forEach(div => {
            let category = div.getAttribute('hf-category');
            let min = div.querySelector('[class^="hf-min-"]').value;
            let max = div.querySelector('[class^="hf-max-"]').value;

            minMaxInputChanged(category, min, max);
        });
    }

    // Trigger the checkbox listeners when changing the pages
    function triggerCheckBoxListener() {
        let statusCheckboxes = document.querySelectorAll('.hf-status-checkbox');

        statusCheckboxes.forEach(checkbox => {
            checkbox.dispatchEvent(new Event('change'));
        });
    }

    // Tigger the data list change upon page change
    function triggerDataListChange() {
        let inputs = document.querySelectorAll('.hf-datalist-input');

        inputs.forEach(input => {
            input.dispatchEvent(new Event('input'));
        });
    }


    findTable();
    createFilterContainer();

})();
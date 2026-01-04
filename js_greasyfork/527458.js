// ==UserScript==
// @name         RW Filter Status
// @namespace    heartflower.torn
// @version      1.0.6
// @description  Filters status on the RW battle page based on online/okay/offline and okay/hospital/traveling/abroad
// @author       Heartflower [2626587]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527458/RW%20Filter%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/527458/RW%20Filter%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HF] Online? War Page script running');

    let currentPage = window.location.href;

    function findFactions(container) {
        let factions = container.querySelectorAll('.tab-menu-cont');
        if (!factions || factions.length < 2) {
            setTimeout(() => findFactions(container), 100);
            return;
        }

        factions.forEach(faction => {
            findElement(faction, '.members-list');
        });
    }

    function findMembers(memberList) {
        let members = memberList.querySelectorAll('li');
        if (!members || members.length < 2) {
            setTimeout(() => findMembers(memberList), 100);
            return;
        }

        members.forEach(member => {
            findElement(member, '.userStatusWrap___ljSJG');

            setInterval(function() {
                findState(member);
            }, 1000);
        });
    }

    function findStatus(svg) {
        let fill = svg.getAttribute('fill');

        // Determine status based on the fill attribute
        let status = fill.includes('offline') ? 'offline' :
        fill.includes('idle') ? 'idle' :
        fill.includes('online') ? 'online' : '';

        let li = svg.closest('li');
        li.setAttribute('data-hf-status', status);
        li.classList.add('hf-member');

        // Get checkbox elements
        let checkboxes = {
            online: document.body.querySelector('.hf-checkbox-online'),
            offline: document.body.querySelector('.hf-checkbox-offline'),
            idle: document.body.querySelector('.hf-checkbox-idle')
        };

        // Ensure all checkboxes exist before proceeding
        if (!checkboxes.online || !checkboxes.offline || !checkboxes.idle) {
            return;
        }

        // Determine if the checkbox is checked and update the class accordingly
        let shouldAddClass = checkboxes[status]?.checked === false;
        if (shouldAddClass) {
            li.classList.add('hf-status-true');
        } else {
            li.classList.remove('hf-status-true');
        }
    }

    function findState(member) {
        let state = member.querySelector('.status___i8NBb').textContent.toLowerCase();
        member.setAttribute('data-hf-state', state);

        let checkboxes = {
            okay: document.body.querySelector('.hf-checkbox-okay'),
            hospital: document.body.querySelector('.hf-checkbox-hospital'),
            traveling: document.body.querySelector('.hf-checkbox-traveling'),
            abroad: document.body.querySelector('.hf-checkbox-abroad')
        };

        // Ensure all checkboxes exist before proceeding
        if (!checkboxes.okay || !checkboxes.hospital || !checkboxes.traveling || !checkboxes.abroad) {
            return;
        }

        let checkboxState = checkboxes[state]?.checked;

        // If state isn't recognized, use hospital checkbox as fallback
        if (checkboxState === undefined) {
            checkboxState = checkboxes.hospital.checked;
        }

        // Add or remove class based on checkboxState
        if (checkboxState === false) {
            member.classList.add('hf-state-true');
        } else {
            member.classList.remove('hf-state-true');
        }
    }

    function addFilterContainer(descriptions) {
        let existingStatusContainer = document.body.querySelector('.hf-status-filter-container');
        let existingStateContainer = document.body.querySelector('.hf-state-filter-container');
        if (existingStatusContainer || existingStateContainer) return;

        let statusDiv = document.createElement('div');
        statusDiv.className = 'hf-status-filter-container';
        statusDiv.style.display = 'flex';
        statusDiv.style.justifyContent = 'space-around';
        statusDiv.style.background = 'var(--items-glow-turquoise-linear-gradient)';

        createCheckbox(statusDiv, 'online');
        createCheckbox(statusDiv, 'idle');
        createCheckbox(statusDiv, 'offline');

        let stateDiv = document.createElement('div');
        stateDiv.className = 'hf-state-filter-container';
        stateDiv.style.display = 'flex';
        stateDiv.style.justifyContent = 'space-around';
        stateDiv.style.background = 'var(--items-glow-yellow-linear-gradient)';

        createCheckbox(stateDiv, 'okay');
        createCheckbox(stateDiv, 'hospital');
        createCheckbox(stateDiv, 'traveling');
        createCheckbox(stateDiv, 'abroad');

        descriptions.insertBefore(stateDiv, descriptions.firstChild);
        descriptions.insertBefore(statusDiv, descriptions.firstChild);
    }

    // Create a single checkbox
    function createCheckbox(div, text) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'hf-checkbox-' + text;

        // Retrieve saved state from localStorage
        let savedData = localStorage.getItem('hf-checkbox-war-' + text);
        if (savedData) {
            let { checked } = JSON.parse(savedData);
            checkbox.checked = checked; // Apply saved state
        } else {
            checkbox.checked = true; // Default state if nothing is saved
        }

        let labelDiv = document.createElement('div');
        labelDiv.style.padding = '10px';
        labelDiv.style.display = 'flex';
        labelDiv.style.alignItems = 'flex-end';

        let label = document.createElement('label');
        label.textContent = text;
        label.style.cursor = 'pointer';
        label.style.paddingLeft = '5px';
        label.style.textTransform = 'uppercase';

        function toggleCheckbox(event) {
            if (event.target !== checkbox) {
                event.preventDefault(); // Prevent default label behavior
                checkbox.checked = !checkbox.checked; // Toggle checkbox

                // Save to localStorage
                localStorage.setItem(
                    'hf-checkbox-war-' + text,
                    JSON.stringify({ checked: checkbox.checked, storedText: text })
                );
            }

            checkbox.dispatchEvent(new Event('change')); // Trigger change event
            changeVisibility('status', checkbox.checked, text);
        }

        // Add event listeners
        label.addEventListener('click', toggleCheckbox);
        checkbox.addEventListener('click', toggleCheckbox);

        labelDiv.appendChild(checkbox);
        labelDiv.appendChild(label);
        div.appendChild(labelDiv);
    }

    function changeVisibility(type, demand, value) {
        let members = document.body.querySelectorAll('.hf-member');
        if (!members || members.length < 1) {
            setTimeout(() => changeVisibility(status), 100);
            return;
        }

        members.forEach(member => {
            let status = member.getAttribute('data-hf-status');
            let state = member.getAttribute('data-hf-state');

            if (status === value) {
                if (demand === true) {
                    if (member.classList.contains('hf-status-true')) {
                        member.classList.remove('hf-status-true');
                    }
                } else if (demand === false) {
                    member.classList.add('hf-status-true');
                }
            } else if (state === value) {
                if (demand === true) {
                    if (member.classList.contains('hf-state-true')) {
                        member.classList.remove('hf-state-true');
                    }
                } else if (demand === false) {
                    member.classList.add('hf-state-true');
                }
            }
        });
    }

    // Find an element based on className
    function findElement(parent, className) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 100);
            return;
        }

        if (className === '.faction-war') {
            findFactions(element);
        } else if (className === '.members-list') {
            findMembers(element);
        } else if (className === '.userStatusWrap___ljSJG') {
            findElement(element, 'svg');
        } else if (className === 'svg') {
            setInterval(function() {
                findStatus(element);
            }, 1000);
        } else if (className === '.descriptions') {
            addFilterContainer(element);
        }
    }

    // Attach click event listener
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if script already there
    function handleButtonClick(event) {
        setTimeout(() => {
            let existingContainer = document.body.querySelector('.hf-status-filter-container');
            if (existingContainer) return;
            currentPage = window.location.href;

            if (currentPage.includes('rank')) {
                findElement(document.body, '.faction-war');
                findElement(document.body, '.descriptions');
            }
        }, 50);
    }

    function addStyleTag() {
        // Create a new <style> element
        let styleTag = document.createElement('style');

        // Add CSS content to the style tag
        styleTag.innerHTML = `
        .hf-state-true, .hf-status-true {
            display: none;
        }
        `;

        // Append the style tag to the <head> of the document
        document.head.appendChild(styleTag);
    }

    addStyleTag();

    if (currentPage.includes('rank')) {
        findElement(document.body, '.faction-war');
        findElement(document.body, '.descriptions');
    }

})();
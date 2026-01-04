// ==UserScript==
// @name         Advanced Filter
// @namespace    torn.filter.combined
// @version      3.4
// @description  Filtering Abroad and hospital based on the faction ID
// @author       Blame Ibbyz Foundation
// @match        https://www.torn.com/index.php?page=people*
// @match        https://www.torn.com/hospitalview.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498383/Advanced%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/498383/Advanced%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const filterStateKey = 'hospitalFilterState';
    const idsKey = 'hospitalFilterIDs';
    const defaultState = true;
    let isFilterActive = JSON.parse(localStorage.getItem(filterStateKey)) ?? defaultState;
    let storedIDs = JSON.parse(localStorage.getItem(idsKey)) ?? [];

    function extractID(url) {
        const match = url ? url.match(/ID=(\d+)/) : null;
        return match ? match[1] : null;
    }

    function readUserList() {
        const userListSelector = window.location.href.includes('hospitalview.php')
            ? '.user-info-list-wrap.icons.users-list.bottom-round'
            : '.users-list.icons.cont-gray.bottom-round.m-bottom10';

        const userList = document.querySelector(userListSelector);
        if (!userList) {
            console.error('User list not found');
            return;
        }

        const listItems = userList.querySelectorAll('li:not(.iconShow)');
        listItems.forEach(item => {
            const link = item.querySelector('a.user.faction');
            if (link) {
                const href = link.getAttribute('href');
                const id = extractID(href);
                const hasID = storedIDs.includes(id);
                item.style.display = isFilterActive ? (hasID ? 'block' : 'none') : 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function initializeObserver() {
        const targetNodeSelector = window.location.href.includes('hospitalview.php')
            ? '.user-info-list-wrap.icons.users-list.bottom-round'
            : '.users-list.icons.cont-gray.bottom-round.m-bottom10';

        const targetNode = document.querySelector(targetNodeSelector);
        if (!targetNode) {
            console.error('Target node not found');
            return;
        }

        const callback = function(mutationsList, observer) {
            readUserList();
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function toggleFilter() {
        isFilterActive = !isFilterActive;
        localStorage.setItem(filterStateKey, JSON.stringify(isFilterActive));
        updateButton();
        readUserList();
    }

    function updateButton() {
        const buttonDiv = document.getElementById('toggleFilterButton');
        if (!buttonDiv) return;
        buttonDiv.textContent = isFilterActive ? 'Disable Filter' : 'Enable Filter';
    }

    function updateDisplayedIDs() {
        const idsDiv = document.getElementById('storedIDs');
        if (idsDiv) {
            idsDiv.textContent = `Stored IDs: ${storedIDs.join(', ')}`;
        }
    }

    function saveNewIDs() {
        const idsInput = document.getElementById('idsInput');
        if (!idsInput) return;
        const newIDs = idsInput.value.split(',').map(id => id.trim()).filter(id => id);
        storedIDs = newIDs;
        localStorage.setItem(idsKey, JSON.stringify(storedIDs));
        updateDisplayedIDs();
        readUserList();
    }

    function toggleEditMode() {
        const idsInput = document.getElementById('idsInput');
        const saveButton = document.getElementById('saveIDsButton');
        const editButton = document.getElementById('editButton');

        if (idsInput.style.display === 'none') {
            idsInput.value = storedIDs.join(', ');
            idsInput.style.display = 'block';
            saveButton.style.display = 'block';
            editButton.textContent = 'Disable Edit';
        } else {
            idsInput.style.display = 'none';
            saveButton.style.display = 'none';
            editButton.textContent = 'Enable Edit';
        }
    }

    function createUIElements() {
        const wrapperSelector = window.location.href.includes('hospitalview.php')
            ? '.userlist-wrapper.hospital-list-wrapper'
            : '.travel-people.revive-people';

        const wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) {
            console.error('Wrapper not found');
            return;
        }

        if (document.getElementById('toggleFilterButton')) {
            return; // If UI elements already exist, do not create them again
        }

        const createButton = (id, text, clickHandler) => {
            const button = document.createElement('div');
            button.id = id;
            button.textContent = text;
            button.style.height = '40px';
            button.style.cursor = 'pointer';
            button.style.padding = '10px 15px';
            button.style.boxSizing = 'border-box';
            button.style.border = '1px solid var(--default-panel-divider-outer-side-color)';
            button.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, .1)';
            button.style.display = 'flex';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            button.style.background = 'var(--info-msg-bg-gradient)';
            button.style.borderRadius = '5px';
            button.style.fontSize = '15px';
            button.style.lineHeight = '18px';
            button.style.fontFamily = 'Arial, sans-serif';
            button.style.color = 'var(--default-color)';
            button.style.marginRight = '10px';
            button.addEventListener('click', clickHandler);
            return button;
        };

        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.marginBottom = '10px';
        container.style.marginTop = '10px';
        container.style.fontFamily = 'monospace';
        container.style.border = '1px solid var(--default-panel-divider-outer-side-color)';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.background = '#f9f9f9';

        const toggleFilterButton = createButton('toggleFilterButton', isFilterActive ? 'Disable Filter' : 'Enable Filter', toggleFilter);
        toggleFilterButton.style.width = '150px';

        const storedIDsDiv = document.createElement('div');
        storedIDsDiv.id = 'storedIDs';
        storedIDsDiv.style.margin = '10px 0';
        storedIDsDiv.style.fontWeight = 'bold';
        storedIDsDiv.style.maxWidth = '300px';

        const idsInput = document.createElement('input');
        idsInput.id = 'idsInput';
        idsInput.type = 'text';
        idsInput.placeholder = 'Enter IDs separated by commas';
        idsInput.style.height = '40px';
        idsInput.style.minWidth = '200px';
        idsInput.style.marginBottom = '10px';
        idsInput.style.display = 'none';
        idsInput.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, .1)';

        const saveIDsButton = createButton('saveIDsButton', 'Save', saveNewIDs);
        saveIDsButton.style.display = 'none';

        const editButton = createButton('editButton', 'Enable Edit', toggleEditMode);

        container.appendChild(toggleFilterButton);
        container.appendChild(storedIDsDiv);
        container.appendChild(idsInput);
        container.appendChild(saveIDsButton);
        container.appendChild(editButton);

        wrapper.insertBefore(container, wrapper.firstChild);

        updateButton();
        updateDisplayedIDs();
    }

    function initialize() {
        createUIElements();
        initializeObserver();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        document.addEventListener('DOMContentLoaded', initialize);
    }
})();

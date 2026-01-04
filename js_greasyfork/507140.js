// ==UserScript==
// @name        RabbitMQ Payload Injection Tool
// @namespace   Violentmonkey Scripts
// @match       http://localhost:15672/*
// @grant       GM_addStyle
// @grant       GM_addElement
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @author      Adrien Chen
// @version     1.0
// @license     MIT
// @description 9/12/2024, 1:59:09 PM
// @resource    fontAwesome https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css
// @downloadURL https://update.greasyfork.org/scripts/507140/RabbitMQ%20Payload%20Injection%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/507140/RabbitMQ%20Payload%20Injection%20Tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const buttonId = 'customButton_payloadInjection';
    const menuId = 'hamburgerMenu_payloadInjection';
    const eventFormId = 'eventForm';
    const eventListId = 'eventList';
    const settingsId = 'settingsMenu';
    const openMenuToggleId = 'openMenuToggle';
    const autoPublishToggleId = 'autoPublishToggle';
    const backButtonId = 'backButton';
    const addCategoryButtonId = 'addCategoryButton';
    const menuHeaderId = 'menuHeader';

    const defaultPropertiesA = 'content_type';
    const defaultPropertiesB = 'application/json';

    let deleteModeActive = false;
    let editModeActive = false;
    let eventToEdit = null;

    // Add Font Awesome CSS
    addFontAwesome();

    // Initial execution
    executeScriptLogic();

    function addFontAwesome() {
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.rel = 'stylesheet';
        fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        fontAwesomeLink.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
        fontAwesomeLink.crossOrigin = 'anonymous';
        fontAwesomeLink.referrerPolicy = 'no-referrer';
        document.head.appendChild(fontAwesomeLink);
    }

    function executeScriptLogic() {
        console.log("executing Script")
        const urlPattern = /http:\/\/localhost:15672\/#\/exchanges\/%2F\/.*/;

        if (urlPattern.test(window.location.href)) {
            if (document.querySelector('form[action="#/login"][method="put"]')) {
                return;
            }

            createButton();
            createMenu();
            loadEvents();

            const featureToggles = GM_getValue('featureToggles', { openMenuOnArrival: true, autoPublishMessage: false });

            if (featureToggles.openMenuOnArrival) {
                document.getElementById(menuId).style.right = '0%';
            }
        } else {
            removeElementById(buttonId);
            removeElementById(menuId);
        }
    }

    function createButton() {
        if (!document.getElementById(buttonId)) {
            const newButton = GM_addElement('button', {
                id: buttonId,
                style: 'position: fixed; bottom: 10px; right: 20px; z-index: 1000; font-size: 15px'
            });
            newButton.innerHTML = `<i class="fa-solid fa-burger"></i>`;
            newButton.addEventListener('click', toggleMenu);
        }
    }

    function createMenu() {
        if (!document.getElementById(menuId)) {
            const newMenu = GM_addElement('div', {
                id: menuId,
                style: `
                    position: fixed;
                    bottom: 0;
                    right: -35%;
                    width: 30%;
                    min-width: 250px;
                    height: 82%;
                    background-color: #333;
                    color: #fff;
                    z-index: 999;
                    transition: right 0.2s ease;
                    padding: 10px;
                    overflow-y: auto;
                `
            });

            newMenu.innerHTML = getMenuHTML();
            addMenuEventListeners();
        }
    }

    function getMenuHTML() {
        return `
            <style>
                .hidden-checkbox {
                    display: none;
                }

                .custom-checkbox {
                    cursor: pointer;
                    font-size: 24px; /* Adjust the size as needed */
                    color: #757474; /* Adjust the color as needed */
                    display: inline-flex;
                    align-items: center;
                }

                .hidden-checkbox:checked + .custom-checkbox .fa-square-check {
                    color: #FF6600; /* Change color when checked */
                }

            </style>
            <div style="display: flex; justify-content: space-evenly; padding-bottom: 5px">
                <button id="createEventButton" style="color: #000;"><i class="fa-solid fa-plus"></i></button>
                <button id="deleteEventButton" style="color: #000;"><i class="fa-solid fa-trash"></i></button>
                <button id="${addCategoryButtonId}" style="color: #000;"><i class="fa-solid fa-folder-plus"></i></button>
                <button id="settingsButton" style="color: #000;"><i class="fa-solid fa-gear"></i></button>
                <button id="${backButtonId}" style="color: #000; display: none;"><i class="fa-solid fa-arrow-left"></i></button>
            </div>
            <form id="${eventFormId}" style="display: none;">
                <h2 style="color: #fff;" id=${menuHeaderId}></h2>
                <label style="color: #fff;">Display Name: <input type="text" id="eventName" required></label><br>
                <label style="color: #fff;">Routing Key: <input type="text" id="routingKey" required></label><br>
                <label style="color: #fff;">Properties: <input type="text" id="propertiesA" placeholder="${defaultPropertiesA}"> = <input type="text" id="propertiesB" placeholder="${defaultPropertiesB}"></label><br>
                <label style="color: #fff;">Payload:<br><textarea id="payload" style="width: 90%;" required></textarea></label><br>
                <div style="display: flex; padding: 5px">
                    <button type="submit" id="saveEventButton" style="color: #000; margin-right: 10px">Save Event</button>
                    <button type="button" id="cancelEventButton" style="color: #000;">Cancel</button>
                </div>
            </form>
            <div id="${eventListId}" style="color: #fff; margin-bottom: 40px"></div>
            <button id="confirmDeleteButton" style="color: #000; display: none;"><i class="fa-solid fa-check"></i></button>
            <div id="${settingsId}" style="display: none; color: #fff;">
                <h2>Settings</h2>
                <label for="${openMenuToggleId}" style="color: #fff; font-size: 13px;" >Open menu on page load: </label>
                <input type="checkbox" id="${openMenuToggleId}" class="hidden-checkbox">
                <label for="${openMenuToggleId}" class="custom-checkbox">
                    <i class="fa-solid fa-square-check"></i>
                </label>
                <br>
                <label for="${autoPublishToggleId}" style="color: #fff; font-size: 13px;">Auto publish message on injection: </label>
                <input type="checkbox" id="${autoPublishToggleId}" class="hidden-checkbox">
                <label for="${autoPublishToggleId}" class="custom-checkbox">
                    <i class="fa-solid fa-square-check"></i>
                </label>
            </div>
        `;
    }

    function addMenuEventListeners() {
        document.getElementById('createEventButton').addEventListener('click', showEventForm);
        document.getElementById('saveEventButton').addEventListener('click', saveEvent);
        document.getElementById('cancelEventButton').addEventListener('click', cancelEvent);
        document.getElementById('deleteEventButton').addEventListener('click', enableDeleteMode);
        document.getElementById('confirmDeleteButton').addEventListener('click', confirmDelete);
        document.getElementById('settingsButton').addEventListener('click', showSettings);
        document.getElementById(backButtonId).addEventListener('click', goBack);
        document.getElementById(addCategoryButtonId).addEventListener('click', addCategory);

        const featureToggles = GM_getValue('featureToggles', { openMenuOnArrival: true, autoPublishMessage: false });


        document.getElementById(openMenuToggleId).checked = featureToggles.openMenuOnArrival;
        document.getElementById(openMenuToggleId).addEventListener('change', toggleOpenMenuOnArrival);

        document.getElementById(autoPublishToggleId).checked = featureToggles.autoPublishMessage;
        document.getElementById(autoPublishToggleId).addEventListener('change', toggleAutoPublishMessage);
    }

    function toggleMenu() {
        const menu = document.getElementById(menuId);
        menu.style.right = menu.style.right === '0%' ? '-35%' : '0%';
    }

    function showEventForm() {
        document.getElementById(eventFormId).style.display = 'block';
        document.getElementById(eventListId).style.display = 'none';
        document.getElementById(menuHeaderId).innerHTML = "Creating a new event";
        toggleButtonsVisibility(false);
    }

    function saveEvent(event) {
        event.preventDefault();

        const eventName = document.getElementById('eventName').value;
        const routingKey = document.getElementById('routingKey').value;
        const propertiesA = document.getElementById('propertiesA').value || defaultPropertiesA;
        const propertiesB = document.getElementById('propertiesB').value || defaultPropertiesB;
        const payload = document.getElementById('payload').value;

        let events = GM_getValue('events', []);
        let categories = GM_getValue('categories', {});

        if (!Array.isArray(events)) {
            events = [];
        }


        if (editModeActive) {

            if (eventName !== eventToEdit.eventName && events.some(event => event.eventName === eventName)) {
                alert('An event with this name already exists. Please choose a different name.');
                return;
            }

            events = events.map(ev => ev.eventName === eventToEdit.eventName ? { eventName, routingKey, propertiesA, propertiesB, payload } : ev);
            for (const category in categories) {
                categories[category] = categories[category].map(name => name === eventToEdit.eventName ? eventName : name);
            }
            editModeActive = false;
            eventToEdit = null;
        } else {

            if (events.some(event => event.eventName === eventName)) {
                alert('An event with this name already exists. Please choose a different name.');
                return;
            }
            if (eventName && routingKey && propertiesA && propertiesB && payload) {
                const newEvent = { eventName, routingKey, propertiesA, propertiesB, payload };
                events.push(newEvent);
                categories['Uncategorized'] = categories['Uncategorized'] || [];
                categories['Uncategorized'].push(eventName);
            } else {
                alert('Please fill in all fields.');
                return;
            }
        }

        GM_setValue('events', events);
        GM_setValue('categories', categories);
        document.getElementById(eventListId).innerHTML = '';
        loadEvents();
        resetEventForm();
    }

    function cancelEvent() {
        resetEventForm();
    }

    function resetEventForm() {
        document.getElementById(eventFormId).reset();
        document.getElementById(eventFormId).style.display = 'none';
        document.getElementById(eventListId).style.display = 'block';
        toggleButtonsVisibility(true);
        editModeActive = false;
        eventToEdit = null;
    }

    function loadEvents() {
        document.getElementById(eventListId).innerHTML = '';
        const events = GM_getValue('events', []);
        const categories = GM_getValue('categories', { 'Uncategorized': [] });

        for (const category in categories) {
            displayCategory(category, categories[category]);
        }
    }

    function displayCategory(categoryName, eventNames) {
        const eventList = document.getElementById(eventListId);

        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.style.marginBottom = '10px';

        const categoryHeader = document.createElement('div');

        categoryHeader.draggable = true;

        categoryHeader.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            background-color: #555;
            cursor: pointer;
        `;
        categoryHeader.innerHTML = `
            <input type="checkbox" class="delete-category-checkbox" style="display: none; margin-right: 10px;">
            <span>${categoryName}</span>
            <i class="fa-solid fa-chevron-down"></i>
        `;
        categoryHeader.addEventListener('click', (event) => {
              if (!event.srcElement.classList.contains('delete-category-checkbox')) {
                const eventContainer = categoryDiv.querySelector('.event-container');
                const icon = categoryHeader.querySelector('i');
                if (eventContainer.style.display === 'none') {
                    eventContainer.style.display = 'block';
                    icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
                } else {
                    eventContainer.style.display = 'none';
                    icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
                }
            }
        });

        categoryHeader.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'category', name: categoryName }));
            e.dataTransfer.effectAllowed = 'move';
        });

        categoryHeader.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        categoryHeader.addEventListener('drop', (e)=>{
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.type === 'event') {
                moveEventToCategory(data.name, categoryName);
            }
        });

        const eventContainer = document.createElement('div');
        eventContainer.classList.add('event-container');
        eventContainer.style.display = 'block';

        eventNames.forEach(eventName => {
            const event = GM_getValue('events', []).find(ev => ev.eventName === eventName);
            if (event) {
                const eventItem = createEventItem(event);
                eventContainer.appendChild(eventItem);
                eventContainer.appendChild(createSeparator());

                eventItem.addEventListener('dragstart', (e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'event', name: eventName }));
                    e.dataTransfer.effectAllowed = 'move';
                });
            }
        });

        categoryDiv.appendChild(categoryHeader);
        categoryDiv.appendChild(eventContainer);
        eventList.appendChild(categoryDiv);

        categoryDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.type === 'category' && data.name !== categoryName) {
                reorderCategories(data.name, categoryName);
            }
        });

        // Add event listener for category checkbox
        const categoryCheckbox = categoryHeader.querySelector('.delete-category-checkbox');
        categoryCheckbox.addEventListener('change', () => {
            const eventContainer = categoryDiv.querySelector('.event-container');
            const eventCheckboxes = eventContainer.querySelectorAll('.delete-checkbox');
            eventCheckboxes.forEach(checkbox => checkbox.checked = categoryCheckbox.checked);
        });

    }

    function createEventItem(event) {
        const eventItem = document.createElement('div');
        eventItem.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 17px;
            padding: 2px;
            border-bottom: 1px solid #444;
            cursor: pointer;
            background-color: #444;
            color: #fff;
            transition: background-color 0.3s, transform 0.3s;
        `;
        eventItem.draggable = true;
        eventItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'event', name: event.eventName }));
            e.dataTransfer.effectAllowed = 'move';
        });

        eventItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        eventItem.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.type === 'event' && data.name !== event.eventName) {
                reorderEvents(event.eventName, data.name);
            }
        });

        eventItem.addEventListener('mouseover', () => {
            eventItem.style.backgroundColor = '#555';
            if (!deleteModeActive) {
                eventItem.querySelector('.edit-button').style.display = 'inline';
                const editButton = eventItem.querySelector('.edit-button');
                editButton.classList.add('edit-button');

            }
        });
        eventItem.addEventListener('mouseout', () => {
            eventItem.style.backgroundColor = '#444';
            eventItem.querySelector('.edit-button').style.display = 'none';
        });
        eventItem.addEventListener('mousedown', () => eventItem.style.transform = 'scale(0.98)');
        eventItem.addEventListener('mouseup', () => eventItem.style.transform = 'scale(1)');

        const eventText = document.createElement('span');
        eventText.textContent = event.eventName;
        eventText.style = `
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 10px;
        `;
        eventText.title = event.eventName;

        eventItem.addEventListener('click', (e) => {
            if (deleteModeActive) {
                const checkbox = eventItem.querySelector('.delete-checkbox');
                checkbox.checked = !checkbox.checked;
                updateCategoryCheckbox(eventItem);
            } else if (!editModeActive) {
                populatePublishForm(event);
            }
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '10px';
        checkbox.classList.add('delete-checkbox');
        checkbox.style.display = 'none';
        checkbox.addEventListener('click', (e) => {
            checkbox.checked = !checkbox.checked;
            updateCategoryCheckbox(eventItem);
        });

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-solid fa-edit"></i>';
        editButton.classList.add('edit-button');
        editButton.style.display = 'none';
        editButton.style.marginRight = '10px';
        editButton.style.fontsize = '17px';
        editButton.style.justifycontent = 'center';
        editButton.style.padding = 0;
        editButton.style.border = 'none';
        editButton.style.alignitems = 'center';
        editButton.style.background = 'transparent'; // Make the background transparent

        editButton.addEventListener('click', (e) => {
            editEvent(event);
        });

        eventItem.appendChild(checkbox);
        eventItem.appendChild(eventText);
        eventItem.appendChild(editButton);

        return eventItem;
    }

    function createSeparator() {
        const separator = document.createElement('div');
        separator.style.height = '1px';
        separator.style.backgroundColor = '#555';
        return separator;
    }

    function populatePublishForm(event) {
        const publishMessageSection = Array.from(document.querySelectorAll('h2'))
            .find(section => section.textContent.trim() === 'Publish message');

        if (publishMessageSection) {
            const parentElement = publishMessageSection.parentElement;
            setInputValue(parentElement, 'input[name="routing_key"]', event.routingKey);
            setInputValue(parentElement, 'input[name^="props_"][name$="_mfkey"]', event.propertiesA);
            setInputValue(parentElement, 'input[name^="props_"][name$="_mfvalue"]', event.propertiesB);
            setInputValue(parentElement, 'textarea[name="payload"]', event.payload);

            const featureToggles = GM_getValue('featureToggles', { openMenuOnArrival: true, autoPublishMessage: false });
            if (featureToggles.autoPublishMessage) {
                const publishButton = parentElement.querySelector('input[type="submit"]');
                if (publishButton) publishButton.click();
            }
        }
    }

    function setInputValue(parentElement, selector, value) {
        const input = parentElement.querySelector(selector);
        if (input) input.value = value;
    }

    function enableDeleteMode() {
        deleteModeActive = true;
        toggleCheckboxesVisibility(true);
        toggleButtonsVisibility(false);
        document.getElementById('confirmDeleteButton').style.display = 'block';
    }

    function confirmDelete() {
        const eventsToDelete = Array.from(document.querySelectorAll('.delete-checkbox:checked'))
            .map(checkbox => checkbox.parentElement.querySelector('span').textContent);
        const categoriesToDelete = Array.from(document.querySelectorAll('.delete-category-checkbox:checked'))
            .map(checkbox => checkbox.nextElementSibling.textContent);

        let events = GM_getValue('events', []);
        let categories = GM_getValue('categories', {});

        events = events.filter(event => !eventsToDelete.includes(event.eventName));
        for (const category in categories) {
            categories[category] = categories[category].filter(eventName => !eventsToDelete.includes(eventName));
        }

        // Delete selected categories
        categoriesToDelete.forEach(category => {
            delete categories[category];
        });

        GM_setValue('events', events);
        GM_setValue('categories', categories);

        loadEvents();

        deleteModeActive = false;
        toggleCheckboxesVisibility(false);
        toggleButtonsVisibility(true);
        document.getElementById('confirmDeleteButton').style.display = 'none';
    }

    function showSettings() {
        const settingsMenu = document.getElementById(settingsId);
        const isVisible = settingsMenu.style.display === 'block';
        settingsMenu.style.display = isVisible ? 'none' : 'block';
        document.getElementById(eventListId).style.display = isVisible ? 'block' : 'none';
        toggleButtonsVisibility(isVisible);
        document.getElementById(backButtonId).style.display = isVisible ? 'none' : 'block';
    }

    function goBack() {
        document.getElementById(settingsId).style.display = 'none';
        document.getElementById(eventListId).style.display = 'block';
        toggleButtonsVisibility(true);
        document.getElementById(backButtonId).style.display = 'none';
    }

    function toggleOpenMenuOnArrival() {
        const featureToggles = GM_getValue('featureToggles', { openMenuOnArrival: true, autoPublishMessage: false });
        featureToggles.openMenuOnArrival = document.getElementById(openMenuToggleId).checked;
        GM_setValue('featureToggles', featureToggles);
    }

    function toggleAutoPublishMessage() {
        const featureToggles = GM_getValue('featureToggles', { openMenuOnArrival: true, autoPublishMessage: false });
        featureToggles.autoPublishMessage = document.getElementById(autoPublishToggleId).checked;
        GM_setValue('featureToggles', featureToggles);
    }

    function toggleButtonsVisibility(visible) {
        const display = visible ? 'block' : 'none';
        document.getElementById('createEventButton').style.display = display;
        document.getElementById('deleteEventButton').style.display = display;
        document.getElementById('settingsButton').style.display = display;
        document.getElementById(addCategoryButtonId).style.display = display;
    }

    function toggleCheckboxesVisibility(visible) {
        const display = visible ? 'block' : 'none';
        document.querySelectorAll('.delete-checkbox').forEach(checkbox => checkbox.style.display = display);
        document.querySelectorAll('.delete-category-checkbox').forEach(checkbox => checkbox.style.display = display);
    }

    function removeElementById(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    }

    function editEvent(event) {
        editModeActive = true;
        eventToEdit = event;
        document.getElementById('eventName').value = event.eventName;
        document.getElementById('routingKey').value = event.routingKey;
        document.getElementById('propertiesA').value = event.propertiesA;
        document.getElementById('propertiesB').value = event.propertiesB;
        document.getElementById('payload').value = event.payload;
        showEventForm();
        document.getElementById(menuHeaderId).innerHTML = "Editing a saved event";

    }

    function addCategory() {
        const categoryName = prompt('Enter the name of the new category:');
        if (categoryName) {
            // Check if the category name is only numeric
            if (/^\d+$/.test(categoryName)) {
                alert('Category name cannot be only numbers. Please enter a valid name.');
                return;
            }

            let categories = GM_getValue('categories', {});
            if (categories[categoryName]) {
                alert('A category with this name already exists. Please choose a different name.');
                return;
            }
            categories[categoryName] = [];
            GM_setValue('categories', categories);
            loadEvents();
        }
    }

    function reorderEvents(targetEventName, draggedEventName) {
        console.log('reorder events hit');
        let events = GM_getValue('events', []);
        let categories = GM_getValue('categories', {});

        let draggedCategory = null;
        let targetCategory = null;
        let draggedIndex = -1;
        let targetIndex = -1;

        // Find the categories and indices of the dragged and target events
        for (const category in categories) {
            const eventNames = categories[category];
            if (draggedIndex === -1) {
                draggedIndex = eventNames.indexOf(draggedEventName);
                if (draggedIndex > -1) {
                    draggedCategory = category;
                }
            }
            if (targetIndex === -1) {
                targetIndex = eventNames.indexOf(targetEventName);
                if (targetIndex > -1) {
                    targetCategory = category;
                }
            }
            if (draggedCategory && targetCategory) {
                break;
            }
        }

        // If both events are found
        if (draggedCategory && targetCategory) {
            // Remove the dragged event from its original category
            categories[draggedCategory].splice(draggedIndex, 1);

            // Add the dragged event to the target category at the target index
            categories[targetCategory].splice(targetIndex, 0, draggedEventName);

            // Save the updated categories
            GM_setValue('categories', categories);

            // Reload events
            loadEvents();
        } else {
            console.log('One or both events not found in categories');
        }
    }

    function reorderCategories(draggedCategoryName, targetCategoryName) {
        let categories = GM_getValue('categories', {});
        const categoryNames = Object.keys(categories);
        const draggedIndex = categoryNames.indexOf(draggedCategoryName);
        const targetIndex = categoryNames.indexOf(targetCategoryName);

        if (draggedIndex > -1 && targetIndex > -1) {
            categoryNames.splice(draggedIndex, 1);
            categoryNames.splice(targetIndex, 0, draggedCategoryName);

            const newCategories = {};
            categoryNames.forEach(categoryName => {
                newCategories[categoryName] = categories[categoryName];
            });

            GM_setValue('categories', newCategories);
            document.getElementById(eventListId).innerHTML = '';
            loadEvents();
        }
    }

    function moveEventToCategory(eventName, targetCategoryName) {
        let categories = GM_getValue('categories', {});
        for (const category in categories) {
            categories[category] = categories[category].filter(name => name !== eventName);
        }
        categories[targetCategoryName].push(eventName);
        GM_setValue('categories', categories);
        loadEvents();
    }

    function updateCategoryCheckbox(eventItem) {
        const categoryDiv = eventItem.closest('.category');
        const categoryCheckbox = categoryDiv.querySelector('.delete-category-checkbox');
        const eventCheckboxes = categoryDiv.querySelectorAll('.delete-checkbox');

        if (categoryCheckbox.checked && !eventItem.checkbox){
          categoryCheckbox.checked = !categoryCheckbox.checked;
        }
        // else {
        //     const allChecked = Array.from(eventCheckboxes).every(checkbox => checkbox.checked);
        //     categoryCheckbox.checked = allChecked;
        // }
    }


    // Observe changes in the document body
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        executeScriptLogic();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        executeScriptLogic();
    };

    window.addEventListener('popstate', executeScriptLogic);

})();
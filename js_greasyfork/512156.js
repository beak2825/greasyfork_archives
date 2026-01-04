// ==UserScript==
// @name         Searchable Bookmarks
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Allows you to save, edit, and quickly search for frequently used items with a movable frame and hover effects
// @author       SHUNHK
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @icon         https://i.imgur.com/rcXom8b.jpeg
// @license      MIT License


// @downloadURL https://update.greasyfork.org/scripts/512156/Searchable%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/512156/Searchable%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ITEMS_PER_PAGE = 6;
    let currentPage = 1;

    // Create a small frame for input and display
    const frame = createFrame();
    document.body.appendChild(frame);

    // Create input field
    const input = createInputField();
    frame.appendChild(input);

    // Create save button
    const saveButton = createButton('Save', '#007bff', saveItem);
    frame.appendChild(saveButton);

    // Create list to display saved items
    const list = document.createElement('ul');
    list.style.listStyleType = 'none';
    list.style.padding = '0';
    list.style.marginTop = '10px';
    frame.appendChild(list);

    // Create pagination buttons
    const pagination = createPagination();
    frame.appendChild(pagination);

    // Load saved items from localStorage
    const savedItems = loadSavedItems();
    renderPage(currentPage);

    // Create move button
    const moveButton = createButton('Move', '#28a745', () => toggleMove(frame));
    frame.appendChild(moveButton);

    // Add event listener for double-click to search
    list.addEventListener('dblclick', (e) => {
        if (e.target.tagName === 'SPAN') {
            searchForItem(e.target.innerText);
        }
    });

    function createFrame() {
        const frame = document.createElement('div');
        frame.style.position = 'fixed';
        frame.style.top = '10px';
        frame.style.right = '10px';
        frame.style.width = '220px';
        frame.style.padding = '10px';
        frame.style.backgroundImage = 'url(https://i.imgur.com/rcXom8b.jpeg)';
        frame.style.backgroundSize = 'cover';
        frame.style.border = '1px solid #ccc';
        frame.style.borderRadius = '5px';
        frame.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        frame.style.zIndex = '1000';

        return frame;
    }

    function makeDraggable(element) {
        let isMoving = false;
        let shiftX, shiftY;

        element.onmousedown = function(event) {
            if (!isMoving) return;

            shiftX = event.clientX - element.getBoundingClientRect().left;
            shiftY = event.clientY - element.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                element.style.left = pageX - shiftX + 'px';
                element.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        element.ondragstart = function() {
            return false;
        };

        function toggleMove() {
            isMoving = !isMoving;
            element.style.cursor = isMoving ? 'move' : 'default';
        }

        return toggleMove;
    }

    const toggleMove = makeDraggable(frame);

    function createInputField() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter item to search';
        input.style.width = 'calc(100% - 22px)';
        input.style.marginBottom = '10px';
        input.style.padding = '5px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '3px';
        return input;
    }

    function createButton(text, backgroundColor, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.backgroundColor = backgroundColor;
        button.style.color = 'white';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.addEventListener('click', onClick);
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = darkenColor(backgroundColor);
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = backgroundColor;
        });
        return button;
    }

    function saveItem() {
        const item = input.value.trim();
        if (item) {
            savedItems.push(item);
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
            renderPage(currentPage);
            input.value = '';
        }
    }

    function loadSavedItems() {
        try {
            return JSON.parse(localStorage.getItem('savedItems')) || [];
        } catch (e) {
            console.error('Failed to load saved items:', e);
            return [];
        }
    }

    function renderPage(page) {
        list.innerHTML = '';
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const itemsToShow = savedItems.slice(start, end);
        itemsToShow.forEach(item => addItemToList(item, list, savedItems));
        updatePagination();
    }

    function addItemToList(item, list, savedItems) {
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';
        listItem.style.justifyContent = 'space-between';
        listItem.style.alignItems = 'center';
        listItem.style.padding = '5px 0';
        listItem.style.borderBottom = '1px solid #ccc';

        const itemText = document.createElement('span');
        itemText.innerText = item;
        itemText.style.cursor = 'pointer';
        itemText.style.color = 'white';
        itemText.style.transition = 'color 0.3s';
        itemText.addEventListener('dblclick', () => {
            searchForItem(item);
        });
        itemText.addEventListener('mouseover', () => {
            itemText.style.color = '#007bff';
        });
        itemText.addEventListener('mouseout', () => {
            itemText.style.color = 'white';
        });

        const editButton = createButton('Edit', '#ffc107', () => editItem(item, itemText, savedItems));
        const deleteButton = createButton('Delete', '#dc3545', () => deleteItem(item, listItem, savedItems));

        listItem.appendChild(itemText);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        list.appendChild(listItem);
    }

    function editItem(item, itemText, savedItems) {
        const newItem = prompt('Edit item:', item);
        if (newItem) {
            const index = savedItems.indexOf(item);
            if (index !== -1) {
                savedItems[index] = newItem;
                localStorage.setItem('savedItems', JSON.stringify(savedItems));
                itemText.innerText = newItem;
            }
        }
    }

    function deleteItem(item, listItem, savedItems) {
        const index = savedItems.indexOf(item);
        if (index !== -1) {
            savedItems.splice(index, 1);
            localStorage.setItem('savedItems', JSON.stringify(savedItems));
            renderPage(currentPage);
        }
    }

    function createPagination() {
        const pagination = document.createElement('div');
        pagination.style.display = 'flex';
        pagination.style.justifyContent = 'center';
        pagination.style.marginTop = '10px';

        const prevButton = createButton('Prev', '#007bff', () => changePage(currentPage - 1));
        const nextButton = createButton('Next', '#007bff', () => changePage(currentPage + 1));

        pagination.appendChild(prevButton);
        pagination.appendChild(nextButton);

        return pagination;
    }

    function updatePagination() {
        const totalPages = Math.ceil(savedItems.length / ITEMS_PER_PAGE);
        pagination.innerHTML = '';

        const prevButton = createButton('Prev', '#007bff', () => changePage(currentPage - 1));
        prevButton.disabled = currentPage === 1;
        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createButton(i.toString(), currentPage === i ? '#28a745' : '#007bff', () => changePage(i));
            pagination.appendChild(pageButton);
        }

        const nextButton = createButton('Next', '#007bff', () => changePage(currentPage + 1));
        nextButton.disabled = currentPage === totalPages;
        pagination.appendChild(nextButton);
    }

    function changePage(page) {
        const totalPages = Math.ceil(savedItems.length / ITEMS_PER_PAGE);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderPage(currentPage);
    }

    function darkenColor(color) {
        const colorObj = new Option().style;
        colorObj.color = color;
        const rgb = colorObj.color.match(/\d+/g).map(Number);
        return `rgb(${Math.max(0, rgb[0] - 20)}, ${Math.max(0, rgb[1] - 20)}, ${Math.max(0, rgb[2] - 20)})`;
    }

function searchForItem(item) {
    console.log(`Searching for: ${item}`);
    const searchField = document.getElementById('searchField');
    if (searchField) {
        // 
        searchField.value = Math.floor(Math.random() * 10).toString();
        searchField.dispatchEvent(new Event('input', { bubbles: true }));

        // 
        setTimeout(() => {
            searchField.value = item;
            const searchButton = document.getElementById('makeSearch');
            if (searchButton) {
                searchButton.click();
            }
        }, 100); //
    }
}

})();

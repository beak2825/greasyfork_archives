// ==UserScript==
// @name         Redbubble Delete Cart Items
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automation for deleting items from the Redbubble cart
// @author       YAD
// @match        https://www.redbubble.com/cart
// @license      MIT
// @grant        none
// @icon         https://www.redbubble.com/boom/public/favicons/favicon.ico
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/508061/Redbubble%20Delete%20Cart%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/508061/Redbubble%20Delete%20Cart%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.backgroundColor = '#ff596f';
    controlPanel.style.border = '1px solid #ccc';
    controlPanel.style.borderRadius = '8px';
    controlPanel.style.padding = '10px';
    controlPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    controlPanel.style.zIndex = 1000;
    controlPanel.style.cursor = 'move';
    controlPanel.style.transition = 'transform 0.2s';

    const deleteCountDisplay = document.createElement('div');
    deleteCountDisplay.id = 'delete-count';
    deleteCountDisplay.style.fontSize = '16px';
    deleteCountDisplay.style.marginBottom = '10px';
    deleteCountDisplay.innerHTML = 'Items Deleted: <span id="count">0</span>';

    const inputContainer = document.createElement('div');
    inputContainer.style.marginBottom = '10px';

    const itemCountInput = document.createElement('input');
    itemCountInput.type = 'number';
    itemCountInput.id = 'item-count';
    itemCountInput.placeholder = 'Number of items to delete';
    itemCountInput.style.marginRight = '10px';
    itemCountInput.style.width = '150px';

    const deleteAllCheckbox = document.createElement('input');
    deleteAllCheckbox.type = 'checkbox';
    deleteAllCheckbox.id = 'delete-all';
    deleteAllCheckbox.style.marginRight = '5px';

    const deleteAllLabel = document.createElement('label');
    deleteAllLabel.setAttribute('for', 'delete-all');
    deleteAllLabel.textContent = 'Delete All';

    inputContainer.appendChild(itemCountInput);
    inputContainer.appendChild(deleteAllCheckbox);
    inputContainer.appendChild(deleteAllLabel);

    const controlButton = document.createElement('button');
    controlButton.id = 'control-button';
    controlButton.style.backgroundColor = '#e91e63';
    controlButton.style.color = '#fff';
    controlButton.style.border = 'none';
    controlButton.style.borderRadius = '4px';
    controlButton.style.padding = '5px 10px';
    controlButton.style.cursor = 'pointer';
    controlButton.textContent = 'Start';

    controlPanel.appendChild(deleteCountDisplay);
    controlPanel.appendChild(inputContainer);
    controlPanel.appendChild(controlButton);

    document.body.appendChild(controlPanel);

    const savedPosition = JSON.parse(localStorage.getItem('controlPanelPosition'));
    if (savedPosition) {
        controlPanel.style.top = savedPosition.top || '10px';
        controlPanel.style.left = savedPosition.left || '10px';
    } else {
        controlPanel.style.top = '50%';
        controlPanel.style.left = 'calc(100% - 220px)';
        controlPanel.style.transform = 'translateY(-50%)';
    }

    function savePosition() {
        localStorage.setItem('controlPanelPosition', JSON.stringify({
            top: controlPanel.style.top,
            left: controlPanel.style.left
        }));
    }

    let isDragging = false;
    let offsetX, offsetY;
    let isDraggingDisabled = false;

    controlPanel.addEventListener('mousedown', (e) => {
        if (isDraggingDisabled) return;
        isDragging = true;
        offsetX = e.clientX - controlPanel.getBoundingClientRect().left;
        offsetY = e.clientY - controlPanel.getBoundingClientRect().top;
        controlPanel.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            controlPanel.style.top = `${e.clientY - offsetY}px`;
            controlPanel.style.left = `${e.clientX - offsetX}px`;
            savePosition();
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        controlPanel.style.cursor = 'move';
    });

    let isPaused = false;

    function deleteItems() {
        const deleteButtons = document.querySelectorAll('button[aria-label="Show remove confirmation button"]');
        const confirmButtons = document.querySelectorAll('button.LineItem_removeConfirmBtn__CZE_0');
        const totalButtons = deleteButtons.length;

        if (totalButtons === 0) {
            alert('No items found to delete.');
            return;
        }

        let deleteCount = 0;
        let maxDeleteCount = parseInt(itemCountInput.value) || totalButtons;

        if (deleteAllCheckbox.checked) {
            maxDeleteCount = totalButtons;
        }

        function deleteNext() {
            if (isPaused) return;
            if (deleteCount >= maxDeleteCount || deleteCount >= totalButtons) {
                controlButton.textContent = 'Start';
                isDraggingDisabled = false;
                return;
            }

            const deleteButton = deleteButtons[deleteCount];
            if (!deleteButton) {
                console.error('Delete button not found for index:', deleteCount);
                return;
            }
            deleteButton.click();

            setTimeout(() => {
                const confirmButton = confirmButtons[deleteCount];
                if (confirmButton) {
                    confirmButton.click();
                    deleteCount++;
                    document.getElementById('count').textContent = deleteCount;
                    deleteNext();
                } else {
                    console.error('Confirm button not found for index:', deleteCount);
                }
            }, 100);
        }

        deleteNext();
    }

    controlButton.addEventListener('click', () => {
        if (controlButton.textContent === 'Start') {
            isPaused = false;
            isDraggingDisabled = true;
            controlButton.textContent = 'Pause';
            deleteItems();
        } else if (controlButton.textContent === 'Pause') {
            isPaused = !isPaused;
            controlButton.textContent = isPaused ? 'Resume' : 'Pause';
        } else if (controlButton.textContent === 'Resume') {
            isPaused = false;
            controlButton.textContent = 'Pause';
            deleteItems();
        }
    });

    document.addEventListener('mouseup', () => {
        if (controlButton.textContent === 'Resume') {
            isDraggingDisabled = false;
        }
    });

})();

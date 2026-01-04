// ==UserScript==
// @name         Torn better Blacklist
// @namespace    https://www.torn.com
// @version      2.3
// @description  Adds a custom modal to edit blacklist descriptions or remove users from the blacklist on profile page.
// @author       Star [2144173]
// @match        https://www.torn.com/profiles.php?XID=*
// @match        https://www.torn.com/blacklist.php
// @grant        none
// @license      Copyright Star
// @downloadURL https://update.greasyfork.org/scripts/514971/Torn%20better%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/514971/Torn%20better%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCustomModal(existingDescription, userId, blacklistButton, overlayButton) {
        const existingModal = document.getElementById('blacklist-modal');
        if (existingModal) existingModal.remove();

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'blacklist-modal';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '10000';

        const modalBox = document.createElement('div');
        modalBox.style.backgroundColor = '#333';
        modalBox.style.borderRadius = '10px';
        modalBox.style.padding = '20px';
        modalBox.style.width = '300px';
        modalBox.style.textAlign = 'center';
        modalBox.style.color = '#fff';
        modalBox.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('h3');
        title.innerText = 'Edit Blacklist Description';
        title.style.color = '#ffffff';
        modalBox.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter description...';
        input.value = localStorage.getItem('prefillDescription') === 'true' && existingDescription && existingDescription !== 'None' ? existingDescription : '';
        input.style.width = 'calc(100% - 20px)';
        input.style.padding = '10px';
        input.style.marginTop = '10px';
        input.style.borderRadius = '5px';
        input.style.border = '1px solid #ddd';
        input.style.backgroundColor = '#f9f9f9';
        input.style.color = '#333';
        input.autofocus = true;
        modalBox.appendChild(input);

        setTimeout(() => input.focus(), 50);

        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirm';
        confirmButton.style.marginTop = '20px';
        confirmButton.style.padding = '10px';
        confirmButton.style.width = '100%';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '5px';
        confirmButton.style.backgroundColor = '#1a8cff';
        confirmButton.style.color = '#fff';
        confirmButton.style.cursor = 'pointer';

        confirmButton.onclick = () => {
            confirmAction();
        };
        modalBox.appendChild(confirmButton);

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove from Blacklist';
        removeButton.style.marginTop = '10px';
        removeButton.style.padding = '10px';
        removeButton.style.width = '100%';
        removeButton.style.border = 'none';
        removeButton.style.borderRadius = '5px';
        removeButton.style.backgroundColor = '#ff4d4d';
        removeButton.style.color = '#fff';
        removeButton.style.cursor = 'pointer';

        removeButton.onclick = () => {
            overlayButton.remove();
            blacklistButton.click();
            modalOverlay.remove();
        };
        modalBox.appendChild(removeButton);

        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.style.marginTop = '10px';
        cancelButton.style.padding = '10px';
        cancelButton.style.width = '100%';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.backgroundColor = '#666';
        cancelButton.style.color = '#fff';
        cancelButton.style.cursor = 'pointer';

        cancelButton.onclick = () => {
            modalOverlay.remove();
        };
        modalBox.appendChild(cancelButton);

        const settingsContainer = document.createElement('div');
        settingsContainer.style.marginTop = '15px';
        settingsContainer.style.display = 'flex';
        settingsContainer.style.alignItems = 'center';
        settingsContainer.style.justifyContent = 'center';

        const settingsIcon = document.createElement('span');
        settingsIcon.innerHTML = '⚙️';
        settingsIcon.style.fontSize = '20px';
        settingsIcon.style.marginRight = '8px';
        settingsIcon.style.cursor = 'pointer';

        const settingsOptionsContainer = document.createElement('div');
        settingsOptionsContainer.style.display = 'none';
        settingsOptionsContainer.style.flexDirection = 'column';
        settingsOptionsContainer.style.alignItems = 'center';
        settingsOptionsContainer.style.justifyContent = 'center';

        const newTabCheckbox = createCheckboxOption('Open in new tab', 'openInNewTab');
        const prefillCheckbox = createCheckboxOption('Prefill description', 'prefillDescription');

        settingsOptionsContainer.appendChild(newTabCheckbox.container);
        settingsOptionsContainer.appendChild(prefillCheckbox.container);

        settingsIcon.onclick = () => {
            settingsOptionsContainer.style.display = settingsOptionsContainer.style.display === 'none' ? 'flex' : 'none';
        };

        settingsContainer.appendChild(settingsIcon);
        modalBox.appendChild(settingsContainer);
        modalBox.appendChild(settingsOptionsContainer);
        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);

        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                confirmAction();
            }
        });

        function confirmAction() {
            const description = input.value;
            if (description) {
                localStorage.setItem('editBlacklistId', userId);
                localStorage.setItem('editDescription', description);
                const url = 'https://www.torn.com/blacklist.php';
                if (newTabCheckbox.checkbox.checked) {
                    const newTab = window.open(url, '_blank', 'noopener');
                    if (newTab) newTab.blur();
                    window.focus();
                } else {
                    window.location.href = url;
                }
            }
            modalOverlay.remove();
        }
    }

    function createCheckboxOption(labelText, localStorageKey) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.marginTop = '5px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = localStorage.getItem(localStorageKey) === 'true';
        checkbox.style.cursor = 'pointer';
        checkbox.onchange = () => localStorage.setItem(localStorageKey, checkbox.checked);

        const label = document.createElement('label');
        label.innerText = labelText;
        label.style.color = '#ccc';
        label.style.marginLeft = '5px';

        container.appendChild(checkbox);
        container.appendChild(label);

        return { container, checkbox };
    }

    function getExistingDescription() {
        const descriptionTooltip = document.querySelector('#profile-container-description');
        return descriptionTooltip && descriptionTooltip.innerText.includes('on your enemy list')
            ? descriptionTooltip.innerText.split(': ')[1]
            : 'None';
    }

    if (window.location.href.includes("profiles.php")) {
        const observer = new MutationObserver(() => {
            const blacklistButton = document.querySelector('.profile-button-addToEnemyList');
            if (blacklistButton && blacklistButton.classList.contains('red')) {
                const userId = blacklistButton.id.split('-').pop();

                const overlayButton = document.createElement('div');
                overlayButton.style.position = 'absolute';
                overlayButton.style.width = `${blacklistButton.offsetWidth}px`;
                overlayButton.style.height = `${blacklistButton.offsetHeight}px`;
                overlayButton.style.top = `${blacklistButton.offsetTop}px`;
                overlayButton.style.left = `${blacklistButton.offsetLeft}px`;
                overlayButton.style.cursor = 'pointer';
                overlayButton.style.zIndex = '9999';

                overlayButton.onmouseover = () => {
                    const existingDescription = getExistingDescription();
                    overlayButton.onclick = (event) => {
                        event.preventDefault();
                        createCustomModal(existingDescription, userId, blacklistButton, overlayButton);
                    };
                };

                blacklistButton.parentNode.insertBefore(overlayButton, blacklistButton);

                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (window.location.href.includes("blacklist.php")) {
        const editBlacklistId = localStorage.getItem('editBlacklistId');
        const editDescription = localStorage.getItem('editDescription');

        if (editBlacklistId && editDescription) {
            setTimeout(() => {
                const allEntries = document.querySelectorAll('li[data-id]');

                allEntries.forEach(entry => {
                    const userLink = entry.querySelector(`a.user.name[data-placeholder*="[${editBlacklistId}]"]`);

                    if (userLink) {
                        const editIcon = entry.querySelector('.edit-icon');
                        if (editIcon) {
                            editIcon.click();

                            setTimeout(() => {
                                const descriptionInput = entry.querySelector('input.field-description');
                                const updateButton = entry.querySelector('input.upd');

                                if (descriptionInput && updateButton) {
                                    descriptionInput.value = editDescription;
                                    updateButton.click();

                                    localStorage.removeItem('editBlacklistId');
                                    localStorage.removeItem('editDescription');
                                }
                            }, 500);
                        }
                    }
                });
            }, 500);
        }
    }
})();

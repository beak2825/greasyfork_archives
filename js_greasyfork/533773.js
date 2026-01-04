// ==UserScript==
// @name         8chan.moe Ban Modal Presets
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Enhances the ban modal on 8chan.moe with a preset dropdown, save preset button, and delete functionality.
// @match        https://8chan.moe/mod.js?boardUri=*
// @match        https://8chan.moe/*/res/*.html
// @match        https://8chan.moe/*
// @match        https://8chan.moe/*/res/*.html#q*
// @match        https://8chan.moe/openReports.js?boardUri=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533773/8chanmoe%20Ban%20Modal%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/533773/8chanmoe%20Ban%20Modal%20Presets.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Function to load presets from localStorage
    function loadPresets() {
        const presets = localStorage.getItem('banModalPresets');
        return presets ? JSON.parse(presets) : [];
    }

    // Function to save presets to localStorage
    function savePresets(presets) {
        localStorage.setItem('banModalPresets', JSON.stringify(presets));
        console.log('Saved to localStorage:', localStorage.getItem('banModalPresets'));
    }

    // Function to find form fields dynamically
    function getFormFields(modal) {
        const inputs = modal.querySelectorAll('input[type="text"]');
        const selects = modal.querySelectorAll('select');
        return {
            reasonInput: inputs[0] || null,
            durationInput: inputs[1] || null,
            messageInput: inputs[2] || null,
            typeSelect: selects[0] || null,
            deletionSelect: selects[1] || null
        };
    }

    // Function to create the dropdown and save button
    function enhanceBanModal(modal) {
        // Ensure this is the ban modal
        const title = modal.querySelector('h3');
        if (!title || title.textContent !== 'Ban') {
            console.log('Not a ban modal or title not found:', modal.innerHTML);
            return;
        }

        // Log modal structure for debugging
        console.log('Ban modal structure:', modal.innerHTML);

        // Get form fields
        const fields = getFormFields(modal);
        const { reasonInput, durationInput, messageInput, typeSelect, deletionSelect } = fields;

        // Verify required fields
        if (!reasonInput || !durationInput || !messageInput || !typeSelect || !deletionSelect) {
            console.error('Missing required form fields:', fields);
            return;
        }

        // Add glow effect to Ok and Cancel buttons
        const okButton = modal.querySelector('input.modalOkButton');
        const cancelButton = modal.querySelector('input[value="Cancel"]');
        if (okButton) {
            okButton.style.boxShadow = '0 0 5px rgba(0, 255, 0, 0.7), 0 0 10px rgba(0, 255, 0, 0.3)';
        }
        if (cancelButton) {
            cancelButton.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.7), 0 0 10px rgba(255, 0, 0, 0.3)';
        }

        // Create dropdown container
        const dropdownContainer = document.createElement('div');
        dropdownContainer.style.marginBottom = '10px';

        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.style.marginRight = '10px';
        dropdown.innerHTML = '<option value="">Select Preset</option>';
        dropdownContainer.appendChild(dropdown);

        // Create delete button for selected preset with unique class
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'x';
        deleteButton.className = 'preset-delete-button';
        deleteButton.style.display = 'none';
        deleteButton.style.marginLeft = '5px';
        dropdownContainer.appendChild(deleteButton);

        // Insert dropdown after the "Ban" title
        title.insertAdjacentElement('afterend', dropdownContainer);

        // Load presets and populate dropdown
        let presets = loadPresets();
        presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.reason;
            option.textContent = preset.reason || '(No reason)';
            dropdown.appendChild(option);
        });

        // Handle dropdown selection
        dropdown.addEventListener('change', () => {
            const selectedReason = dropdown.value;
            deleteButton.style.display = selectedReason ? 'inline' : 'none';

            if (selectedReason) {
                const preset = presets.find(p => p.reason === selectedReason);
                if (preset) {
                    reasonInput.value = preset.reason || '';
                    durationInput.value = preset.duration || '';
                    messageInput.value = preset.message || '';
                    typeSelect.value = preset.type || 'IP/Bypass ban';
                    deletionSelect.value = preset.deletionAction || 'Do not delete';
                }
            }
        });

        // Handle delete button click
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default actions
            event.stopPropagation(); // Stop event bubbling
            const selectedReason = dropdown.value;
            if (selectedReason) {
                console.log('Before deletion - presets:', presets);
                // Reload presets to ensure fresh data
                presets = loadPresets();
                const newPresets = presets.filter(p => p.reason !== selectedReason);
                console.log('After filtering - newPresets:', newPresets);
                savePresets(newPresets);
                dropdown.removeChild(dropdown.querySelector(`option[value="${selectedReason}"]`));
                dropdown.value = '';
                deleteButton.style.display = 'none';
                presets = newPresets; // Update local presets array
                console.log(`Deleted preset: ${selectedReason}`);
            }
        });

        // Create and insert Save Preset button
        const saveButton = document.createElement('input');
        saveButton.type = 'button';
        saveButton.value = 'Save Preset';
        saveButton.style.marginLeft = '10px';
        const buttonSpan = modal.querySelector('span');
        if (!buttonSpan) {
            console.error('Button span not found in modal');
            return;
        }
        buttonSpan.appendChild(saveButton);

        // Handle Save Preset button click
        saveButton.addEventListener('click', () => {
            const reason = reasonInput.value;
            const duration = durationInput.value;
            const message = messageInput.value;
            const type = typeSelect.value;
            const deletionAction = deletionSelect.value;

            const newPreset = { reason, duration, message, type, deletionAction };
            presets = loadPresets(); // Reload to ensure fresh data
            const existingIndex = presets.findIndex(p => p.reason === reason);
            if (existingIndex !== -1) {
                presets[existingIndex] = newPreset; // Update existing preset
            } else {
                presets.push(newPreset); // Add new preset
                const option = document.createElement('option');
                option.value = reason;
                option.textContent = reason || '(No reason)';
                dropdown.appendChild(option);
            }
            savePresets(presets);
            dropdown.value = reason; // Select the saved preset
            deleteButton.style.display = 'inline';
            console.log(`Saved preset: ${reason}`);
        });
    }

    // Observe DOM changes to detect modal insertion
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('modalForm')) {
                    // Delay to ensure modal is fully rendered
                    setTimeout(() => enhanceBanModal(node), 100);
                }
            });
        });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

    // Check if the modal is already present
    const existingModal = document.querySelector('.modalForm');
    if (existingModal) {
        setTimeout(() => enhanceBanModal(existingModal), 100);
    }
})();
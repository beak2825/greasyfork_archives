// ==UserScript==
// @name         Scratch Editor Extension Maker
// @namespace    https://scratch.mit.edu/projects/editor/
// @version      1.0.0
// @description  Adds a button to open an Extension Maker interface in the Scratch editor.
// @author       YourName
// @match        https://scratch.mit.edu/projects/editor/*
// @grant        none
// @license      this is my maker for scratch
// @downloadURL https://update.greasyfork.org/scripts/498548/Scratch%20Editor%20Extension%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/498548/Scratch%20Editor%20Extension%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show the Extension Maker modal
    function showExtensionMaker() {
        // Check if the modal already exists to prevent duplicates
        if (document.querySelector('#extensionMakerModal')) return;

        // Create the modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'extensionMakerModal';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.zIndex = '1000';

        // Create the modal content container
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.style.width = '50%';
        modalContent.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

        // Modal header
        const modalHeader = document.createElement('h2');
        modalHeader.innerText = 'Extension Maker';
        modalHeader.style.marginTop = '0';
        modalContent.appendChild(modalHeader);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.marginBottom = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            modalOverlay.remove();
        });
        modalContent.appendChild(closeButton);

        // Example input form
        const form = document.createElement('form');
        
        // Extension name input
        const nameLabel = document.createElement('label');
        nameLabel.innerText = 'Extension Name: ';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.style.marginBottom = '10px';
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(document.createElement('br'));

        // Extension description input
        const descLabel = document.createElement('label');
        descLabel.innerText = 'Description: ';
        const descInput = document.createElement('textarea');
        descInput.style.width = '100%';
        descInput.style.height = '50px';
        form.appendChild(descLabel);
        form.appendChild(descInput);
        form.appendChild(document.createElement('br'));

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Create Extension';
        submitButton.style.cursor = 'pointer';
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            alert(`Extension Created:\nName: ${nameInput.value}\nDescription: ${descInput.value}`);
            modalOverlay.remove();
        });
        form.appendChild(submitButton);

        // Append form to modal content
        modalContent.appendChild(form);

        // Append modal content to modal overlay
        modalOverlay.appendChild(modalContent);

        // Append modal overlay to document body
        document.body.appendChild(modalOverlay);
    }

    // Function to add the custom button
    function addCustomButton() {
        // Check if the button already exists to prevent duplicates
        if (document.querySelector('#extensionMakerButton')) return;

        const button = document.createElement('button');
        button.id = 'extensionMakerButton';
        button.innerText = 'Open Extension Maker';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', showExtensionMaker);

        // Append the button to the document body
        document.body.appendChild(button);
    }

    // Wait for the Scratch editor to load fully
    window.addEventListener('load', () => {
        // Ensure the Scratch editor has fully loaded
        const checkEditorLoaded = setInterval(() => {
            if (document.querySelector('.stage-header_stage-header-button_')) {
                clearInterval(checkEditorLoaded);
                addCustomButton();
            }
        }, 1000);
    });
})();

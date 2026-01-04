// ==UserScript==
// @name         Torn Icon Editor with UI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allows editing of Torn icons via right-click context menu, with UI to toggle.
// @author       You
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/529646/Torn%20Icon%20Editor%20with%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/529646/Torn%20Icon%20Editor%20with%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedIcon = null;
    let isIconEditorEnabled = true; // Initially enabled

    function handleContextMenu(event) {
        console.log("Context menu clicked");
        console.log("Target tag name:", event.target.tagName);
        console.log("Target has aria-label:", event.target.hasAttribute('aria-label'));

        if (isIconEditorEnabled && event.target.tagName === 'A' && event.target.hasAttribute('aria-label')) {
            event.preventDefault();
            selectedIcon = event.target;
            showImageUploadPopup(event.clientX, event.clientY);
        }
    }

    function showImageUploadPopup(x, y) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.style.backgroundColor = 'white';
        popup.style.padding = '10px';
        popup.style.border = '1px solid black';
        popup.style.zIndex = '1000';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    changeIconImage(readerEvent.target.result);
                    popup.remove();
                };
                reader.readAsDataURL(file);
            }
        });
        popup.appendChild(fileInput);

        document.body.appendChild(popup);
    }

    function changeIconImage(imageUrl) {
        if (selectedIcon) {
            const width = selectedIcon.offsetWidth;
            const height = selectedIcon.offsetHeight;

            selectedIcon.style.backgroundImage = `url('${imageUrl}')`;
            selectedIcon.style.backgroundSize = `${width}px ${height}px`;
            selectedIcon.style.backgroundRepeat = 'no-repeat';
            selectedIcon.style.backgroundPosition = 'center';
        }
    }

    document.addEventListener('contextmenu', handleContextMenu);

    // UI Toggle
    const toggleButton = document.createElement('button');
    toggleButton.textContent = "Toggle Icon Editor";
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.backgroundColor = 'white';
    toggleButton.addEventListener('click', () => {
        isIconEditorEnabled = !isIconEditorEnabled;
        toggleButton.textContent = isIconEditorEnabled ? "Toggle Icon Editor" : "Icon Editor Disabled";
    });
    document.body.appendChild(toggleButton);
})();
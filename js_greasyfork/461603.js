// ==UserScript==
// @name         Test Color
// @namespace    my-namespace
// @version      4
// @description  Dialog
// @include        *
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/461603/Test%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/461603/Test%20Color.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Retrieve color from local storage
    let color = localStorage.getItem('color') || 'white';

    // Apply the color to the page
    document.body.style.backgroundColor = color;

    // Create the button to open the color dialog
    const openDialogButton = document.createElement('button');
    openDialogButton.textContent = 'Change Color';
    openDialogButton.style.position = 'fixed';
    openDialogButton.style.bottom = '10px';
    openDialogButton.style.right = '10px';
    document.body.appendChild(openDialogButton);

    // Function to open the color dialog
    function openColorDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '0';
        dialog.style.left = '0';
        dialog.style.width = '100%';
        dialog.style.height = '100%';
        dialog.style.backgroundColor = 'rgba(0,0,0,0.5)';
        dialog.style.display = 'flex';
        dialog.style.alignItems = 'center';
        dialog.style.justifyContent = 'center';

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = color;
        dialog.appendChild(colorPicker);

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.marginLeft = '10px';
        okButton.addEventListener('click', () => {
            color = colorPicker.value;
            localStorage.setItem('color', color);
            document.body.style.backgroundColor = color;
            dialog.remove();
        });
        dialog.appendChild(okButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.marginLeft = '10px';
        cancelButton.addEventListener('click', () => {
            dialog.remove();
        });
        dialog.appendChild(cancelButton);

        document.body.appendChild(dialog);
    }

    // Register the menu command and button click handler
    GM_registerMenuCommand('Change Color', openColorDialog);
    openDialogButton.addEventListener('click', openColorDialog);

})();
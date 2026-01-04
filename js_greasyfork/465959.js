// ==UserScript==
// @name         Edit Text on Webpage
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enable or disable the ability to edit any text on a given webpage by clicking a button in the top right corner of the screen.
// @author       You
// @match        *://*/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465959/Edit%20Text%20on%20Webpage.user.js
// @updateURL https://update.greasyfork.org/scripts/465959/Edit%20Text%20on%20Webpage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEditingEnabled = false;

    const enableEditing = () => {
        $('*').attr('contenteditable', 'true');
        isEditingEnabled = true;
    };

    const disableEditing = () => {
        $('*').attr('contenteditable', 'false');
        isEditingEnabled = false;
    };

    const toggleEditing = () => {
        if (isEditingEnabled) {
            disableEditing();
        } else {
            enableEditing();
        }
    };

    const createEditButton = () => {
        const editButton = $('<button>', {
            text: 'Edit Text',
            id: 'edit-text-button',
            click: toggleEditing
        });

        const buttonStyles = {
            'position': 'fixed',
            'top': '5px',
            'right': '5px',
            'z-index': '9999',
            'background-color': '#1e90ff',
            'color': 'white',
            'border': 'none',
            'padding': '5px 10px',
            'border-radius': '5px',
            'font-size': '14px',
            'cursor': 'pointer'
        };

        editButton.css(buttonStyles);

        $('body').append(editButton);
    };

    createEditButton();
})();
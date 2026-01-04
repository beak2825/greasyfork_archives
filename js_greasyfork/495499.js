// ==UserScript==
// @name         Tab Title Editor 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Edit tab name easily with text bar & enter button, no refresh required.
// @author       Emree.el on Instagram
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495499/Tab%20Title%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/495499/Tab%20Title%20Editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the container div
    var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.backgroundColor = 'black';
    container.style.padding = '10px';
    container.style.border = '1px solid black';
    container.style.borderRadius = '5px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    document.body.appendChild(container);

    // Create the checkbox
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '10px';
    container.appendChild(checkbox);

    // Create the text input
    var textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.style.marginRight = '10px';
    textInput.style.display = 'none';
    textInput.style.backgroundColor = 'black';
    textInput.style.color = 'white';
    textInput.style.border = '1px solid white';
    container.appendChild(textInput);

    // Create the button
    var button = document.createElement('button');
    button.textContent = 'Enter';
    button.style.display = 'none';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.border = '1px solid black';
    container.appendChild(button);

    // Show/hide text input and button when checkbox is toggled
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            textInput.style.display = 'inline';
            button.style.display = 'inline';
        } else {
            textInput.style.display = 'none';
            button.style.display = 'none';
        }
    });

    // Change tab title when button is clicked
    button.addEventListener('click', function() {
        if (textInput.value.trim() !== '') {
            document.title = textInput.value;
        }
    });
})();


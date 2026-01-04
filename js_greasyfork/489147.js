// ==UserScript==
// @name         Add Elements to Infinite Craft
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically add elements to Infinite Craft page and prevent reloading
// @author       GW
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489147/Add%20Elements%20to%20Infinite%20Craft.user.js
// @updateURL https://update.greasyfork.org/scripts/489147/Add%20Elements%20to%20Infinite%20Craft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your JavaScript code goes here
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '2.5cm';
    container.style.bottom = '2.5cm';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter text';
    container.appendChild(textInput);

    const emojiInput = document.createElement('input');
    emojiInput.type = 'text';
    emojiInput.placeholder = 'Enter emoji';
    container.appendChild(emojiInput);

    const switchContainer = document.createElement('div');
    switchContainer.style.display = 'flex';
    switchContainer.style.alignItems = 'center';

    const switchInput = document.createElement('input');
    switchInput.type = 'checkbox';
    switchInput.checked = false;
    switchContainer.appendChild(switchInput);

    const switchLabel = document.createElement('span');
    switchLabel.textContent = 'Discovered';
    switchContainer.appendChild(switchLabel);

    container.appendChild(switchContainer);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add Element';
    addButton.onclick = function() {
        const text = textInput.value;
        const emoji = emojiInput.value;
        const discovered = switchInput.checked;

        const existingData = JSON.parse(localStorage.getItem('infinite-craft-data')) || { elements: [], darkMode: false };

        existingData.elements.push({ text, emoji, discovered });

        localStorage.setItem('infinite-craft-data', JSON.stringify(existingData));

        textInput.value = '';
        emojiInput.value = '';
        switchInput.checked = false;

        if(preventReloadSwitch.checked) {
            return false;
        } else {
            location.reload();
        }
    };
    container.appendChild(addButton);

    const preventReloadContainer = document.createElement('div');
    preventReloadContainer.style.display = 'flex';
    preventReloadContainer.style.alignItems = 'center';

    const preventReloadSwitch = document.createElement('input');
    preventReloadSwitch.type = 'checkbox';
    preventReloadSwitch.checked = false;
    preventReloadContainer.appendChild(preventReloadSwitch);

    const preventReloadLabel = document.createElement('span');
    preventReloadLabel.textContent = 'Prevent reloading';
    preventReloadLabel.style.fontSize = 'smaller';
    preventReloadLabel.style.fontWeight = 'normal'; // Not bold
    preventReloadContainer.appendChild(preventReloadLabel);

    container.appendChild(preventReloadContainer);

    textInput.addEventListener('keydown', function(event) {
        event.stopPropagation();
    });
    emojiInput.addEventListener('keydown', function(event) {
        event.stopPropagation();
    });

    document.body.appendChild(container);
})();

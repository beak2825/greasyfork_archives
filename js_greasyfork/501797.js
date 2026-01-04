// ==UserScript==
// @name         Trade message buttons!
// @namespace    https://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=1032262
// @version      1.0
// @description  Adds trade message buttons to quickly add messages to users trades!
// @match        *://www.chickensmoothie.com/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/501797/Trade%20message%20buttons%21.user.js
// @updateURL https://update.greasyfork.org/scripts/501797/Trade%20message%20buttons%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Place your messages here, you can add or remove them as needed, whatever you place in the quotes will be added to your trade message
    const buttonLabels = ["Message1", "Message2", "Message3", "Message4", "Message5"];

    function addButtons() {
        const messageSections = document.querySelectorAll('dl.send-message-section');

        messageSections.forEach(section => {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.marginBottom = '10px';

            const dtText = section.querySelector('dt').textContent.toLowerCase();

            for (let i = 0; i < buttonLabels.length; i += 2) {
                const row = document.createElement('div');
                row.style.marginBottom = '5px';

                for (let j = 0; j < 2 && i + j < buttonLabels.length; j++) {
                    const label = buttonLabels[i + j];
                    const button = document.createElement('button');
                    button.textContent = label;
                    button.style.marginRight = '10px';
                    button.addEventListener('click', (event) => {
                        event.preventDefault(); 
                        const textareaName = dtText.includes('trade offer') ? 'trademessage' : 'message';
                        const textarea = section.querySelector(`textarea[name="${textareaName}"]`);
                        if (textarea) {
                            textarea.value = label;
                        }
                    });

                    row.appendChild(button);
                }

                buttonContainer.appendChild(row);
            }

            section.parentNode.insertBefore(buttonContainer, section);
        });
    }

    window.addEventListener('load', addButtons);
})();
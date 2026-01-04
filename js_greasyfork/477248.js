// ==UserScript==
// @name         Remove Top Items from Shafa.ua
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove all divs with class "b-tile-item" containing span with the word "Top"
// @author       max5555
// @match        https://shafa.ua/*
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/477248/Remove%20Top%20Items%20from%20Shafaua.user.js
// @updateURL https://update.greasyfork.org/scripts/477248/Remove%20Top%20Items%20from%20Shafaua.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for the slider
    GM_addStyle(`
        #toggleSwitch {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            display: flex;
            align-items: center;
        }

        #toggleCheckbox {
            margin-right: 5px;
        }
    `);

    // Add the slider to the page
    let switchContainer = document.createElement('div');
    switchContainer.id = 'toggleSwitch';

    let toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.id = 'toggleCheckbox';
    toggleCheckbox.checked = true;

    let toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = 'toggleCheckbox';
    toggleLabel.textContent = 'Remove Top Items';

    switchContainer.appendChild(toggleCheckbox);
    switchContainer.appendChild(toggleLabel);

    document.body.appendChild(switchContainer);

    // Function to remove the specified elements
    function removeTopDivs() {
        if (!toggleCheckbox.checked) return;  // Don't execute if the feature is toggled off

        let divs = document.querySelectorAll('div.b-tile-item');
        divs.forEach(div => {
            let spans = div.querySelectorAll('span');
            spans.forEach(span => {
                if (span.textContent.includes('Top')) {
                    div.remove();
                }
            });
        });
    }

    // Call the function on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', removeTopDivs);

    // Check and remove any new divs every 2 seconds
    setInterval(removeTopDivs, 2000);
})();

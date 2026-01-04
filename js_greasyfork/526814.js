// ==UserScript==
// @name         Auto-Remove inactive offers
// @namespace    https://greasyfork.org/users/1434745-r4tr4ce
// @version      1.4
// @description  Deletes inactive offers from your notepad by clicking a button
// @author       r4tr4ce
// @match        https://www.chrono24.*/user/notepad.htm*
// @grant        none
// @icon         https://static.chrono24.com/images/default/favicon/android-chrome-192x192.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526814/Auto-Remove%20inactive%20offers.user.js
// @updateURL https://update.greasyfork.org/scripts/526814/Auto-Remove%20inactive%20offers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSoldItems() {
        let soldItems = document.querySelectorAll('div[data-watch-state="sold"], div[data-watch-state="deactivated"]');
        let index = 0;

        function processNext() {
            if (index < soldItems.length) {
                let div = soldItems[index];
                let button = Array.from(div.getElementsByTagName('button')).find(btn =>
                    btn.getAttribute('aria-label')?.includes('Remove')
                );
                if (button) {
                    button.click();

                    setTimeout(() => {
                        let deleteButton = document.querySelector('.js-confirmation-modal-confirm');
                        if (deleteButton) {
                            console.log('Clicking confirmation delete button:', deleteButton);
                            deleteButton.click();
                        }
                    }, 50);
                }
                index++;
                setTimeout(processNext, 500);
            }
        }

        processNext();
    }

    function createTriggerButton() {
        let button = document.createElement('button');
        button.textContent = 'Remove Sold Items';
        button.style.padding = '10px';
        button.style.backgroundColor = '#FF2400';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.addEventListener('click', removeSoldItems);

        let interval = setInterval(() => {
            let parentContainer = document.querySelector('.d-flex.align-items-center.justify-content-between .d-flex.flex-wrap.notepadfilters-selected');
            if (parentContainer) {
                parentContainer.appendChild(button);
                clearInterval(interval);
            }
        }, 100);
    }

    createTriggerButton();
})();

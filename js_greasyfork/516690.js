// ==UserScript==
// @name         Item Market One-Click Buy (OCB)
// @version      1.0.0
// @namespace    Clyoth Script
// @author       Clyoth
// @license      MIT
// @icon         https://play-lh.googleusercontent.com/BkaIDbibtUpGcziVQsgCya-eC7oxTUHL5G8m8v3XW3S11_-GZEItaxzeXxhKmoAiX8x6
// @description  A script for one-click buying with an enable/disable toggle button
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516690/Item%20Market%20One-Click%20Buy%20%28OCB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/516690/Item%20Market%20One-Click%20Buy%20%28OCB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addToggleButton = () => {
        const categoryGroups = document.querySelector('.categoryGroups___qYbKb');

        if (categoryGroups) {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'Toggle OCB';
            toggleButton.style.padding = '10px';
            toggleButton.style.backgroundColor = '#229c1e';
            toggleButton.style.color = 'white';
            toggleButton.style.border = 'none';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.marginBottom = '10px';

            categoryGroups.parentElement.insertBefore(toggleButton, categoryGroups);

            let isScriptEnabled = true;

            toggleButton.addEventListener('click', () => {
                isScriptEnabled = !isScriptEnabled;
                if (isScriptEnabled) {
                    toggleButton.textContent = 'OCB Enabled';
                    toggleButton.style.backgroundColor = '#229c1e';
                } else {
                    toggleButton.textContent = 'OCB Disabled';
                    toggleButton.style.backgroundColor = '#9c261e';
                }
            });

            document.addEventListener('click', (event) => {
                if (!isScriptEnabled) return;

                const actionButton = event.target.closest('.actionButton___pb_Da');
                if (actionButton) {
                    setTimeout(() => {
                        const confirmButton = document.querySelector('.buyButton___Flkhg');
                        if (confirmButton) {
                            confirmButton.click();
                            setTimeout(() => {
                                const yesButton = document.querySelector('.confirmButton___WoFpj');
                                if (yesButton) {
                                    yesButton.click();
                                }
                            }, 500);
                        } else {
                            console.log("Confirm button not found after 500ms.");
                        }
                    }, 500);
                }
            });

            observer.disconnect();
        } else {
            console.log('.categoryGroups___qYbKb div not found.');
        }
    };

    const observer = new MutationObserver(() => {
        addToggleButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addToggleButton();
})();

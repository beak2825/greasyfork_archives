// ==UserScript==
// @name         Neopets - Wishing Well Auto-Wisher
// @namespace    https://greasyfork.org/en/users/1450608-dogwithglasses
// @version      1.1
// @description  Automatically submits wishes to the wishing well
// @match        *://www.neopets.com/wishing.phtml*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532440/Neopets%20-%20Wishing%20Well%20Auto-Wisher.user.js
// @updateURL https://update.greasyfork.org/scripts/532440/Neopets%20-%20Wishing%20Well%20Auto-Wisher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // adjust items as you like
    const wishItems = [
        "Magical Delivery Aisha Mouth",
        "Anime Valentine Suit Jacket",
        "Orion Stamp",
        "Snowager Stamp",
        "Captain Bloodhook Stamp",
        "Mythical Xweetok Hind",
        "Mythical Xweetok Head",
        "Mythical Xweetok Body",
        "Neopets 25th Birthday Goodie Bag"
    ];

    function main() {
        const isAutoWishing = GM_getValue('auto-wishing', false);
        const wishesSubmitted = GM_getValue('wishes-submitted', 0);

        if (!document.getElementById('auto-wish-button')) {
            addAutoWishButton();
        }

        updateStatusDisplay(wishesSubmitted);
        updateButtonState(wishesSubmitted);

        if (isAutoWishing) {
            if (wishesSubmitted >= 7) {
                GM_setValue('auto-wishing', false);
                GM_setValue('wishes-submitted', wishesSubmitted);
            }
            else {
                makeWish(wishesSubmitted);
            }
        }
    }

    function updateStatusDisplay(wishesSubmitted) {
        const statusDisplay = document.getElementById('wish-status') || createStatusDisplay();
        statusDisplay.textContent = `${wishesSubmitted}/7 wishes submitted`;
    }

    function updateButtonState(wishesSubmitted) {
        const autoWishButton = document.getElementById('auto-wish-button');
        if (autoWishButton) {
            autoWishButton.disabled = wishesSubmitted >= 7;
            if (wishesSubmitted >= 7) {
                autoWishButton.style.opacity = '0.5';
                autoWishButton.style.cursor = 'not-allowed';
            } else {
                autoWishButton.style.opacity = '1';
                autoWishButton.style.cursor = 'pointer';
            }
        }
    }

    function createStatusDisplay() {
        const container = document.createElement('div');
        container.id = 'wish-status';
        container.style.marginTop = '10px';
        container.style.textAlign = 'center';
        container.style.fontWeight = 'bold';
        container.style.padding = '5px';
        container.style.backgroundColor = '#ffffee';
        container.style.border = '1px solid #dddd77';

        const formTable = document.querySelector('form[action="process_wishing.phtml"] table');
        if (formTable) {
            container.style.width = formTable.offsetWidth + 'px';
            container.style.margin = '10px auto';
        }

        const form = document.querySelector('form[action="process_wishing.phtml"]');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(container, form);
        } else {
            document.body.appendChild(container);
        }

        return container;
    }

    function addAutoWishButton() {
        const form = document.querySelector('form[action="process_wishing.phtml"]');
        if (!form) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.textAlign = 'center';

        const autoWishButton = document.createElement('button');
        autoWishButton.id = 'auto-wish-button';
        autoWishButton.textContent = 'Auto-Wish (7 Wishes)';
        autoWishButton.style.backgroundColor = '#dddd77';
        autoWishButton.style.border = '1px solid black';
        autoWishButton.style.padding = '5px 10px';
        autoWishButton.style.cursor = 'pointer';
        autoWishButton.style.fontWeight = 'bold';

        const resetButton = document.createElement('button');
        resetButton.id = 'reset-wish-button';
        resetButton.textContent = 'Reset Wish Count';
        resetButton.style.backgroundColor = '#ffffee';
        resetButton.style.border = '1px solid black';
        resetButton.style.padding = '5px 10px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.marginLeft = '10px';

        autoWishButton.addEventListener('click', function(e) {
            e.preventDefault();
            GM_setValue('auto-wishing', true);
            GM_setValue('wishes-submitted', 0);
            makeWish(0);
        });

        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            GM_setValue('auto-wishing', false);
            GM_setValue('wishes-submitted', 0);
            location.reload();
        });

        buttonContainer.appendChild(autoWishButton);
        buttonContainer.appendChild(resetButton);
        form.parentNode.insertBefore(buttonContainer, form.nextSibling);
    }

    function makeWish(currentWishCount) {
        const donationInput = document.querySelector('input[name="donation"]');
        const wishInput = document.querySelector('input[name="wish"]');
        const submitButton = document.querySelector('input[type="submit"][value="Make a Wish"]');

        if (!donationInput || !wishInput || !submitButton) return;

        donationInput.value = 22; // i know it's supposed to be 21 but...
        wishInput.value = wishItems[Math.floor(Math.random() * wishItems.length)];

        GM_setValue('wishes-submitted', currentWishCount + 1);

        submitButton.click();
    }

    setTimeout(main, Math.floor(Math.random() * 800) + 200);
})();
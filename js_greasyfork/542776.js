// ==UserScript==
// @name           Torn: Gimme Beers, Empty BB, Gas, Bricks, Kitten
// @namespace      lugburz.gimme_beers
// @version        0.1.6
// @description    Gimme Beers, Empty blood bags, Gas and Bricks!
// @author         Lugburz, zstorm [2268511]
// @match          https://www.torn.com/shops.php?step=bitsnbobs*
// @match          https://www.torn.com/shops.php?step=pharmacy*
// @grant          none
// @icon           https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/542776/Torn%3A%20Gimme%20Beers%2C%20Empty%20BB%2C%20Gas%2C%20Bricks%2C%20Kitten.user.js
// @updateURL https://update.greasyfork.org/scripts/542776/Torn%3A%20Gimme%20Beers%2C%20Empty%20BB%2C%20Gas%2C%20Bricks%2C%20Kitten.meta.js
// ==/UserScript==

//====================UPDATE:===============================
// 0.1.5  Added buttons for Kitten as requested by Steven Wallace
// 0.1.5  Added buttons for Gas and Bricks.
// 0.1.4  Added another buttons at Pharmacy to buy Empty Blood Bag.
// 0.1.3  Derived the script from lugburz.gimme_beers.
//========================================================

(function() {
    'use strict';

    // Configuration for all items (ID: Item ID, Area: shoparea value, Name: button text)
    const ITEMS = {
        'bitsnbobs': [
            { id: 180, area: 103, name: 'Beers', elementId: 'buyBeerBtn' },
            { id: 172, area: 103, name: 'Gas', elementId: 'buyGasBtn' },
            { id: 394, area: 103, name: 'Bricks', elementId: 'buyBrickBtn' },
            { id: 215, area: 103, name: 'Kitten', elementId: 'buyCatBtn' }
        ],
        'pharmacy': [
            { id: 731, area: 110, name: 'Empty Blood Bag', elementId: 'buyEBBBtn' }
        ]
    };

    const STATUS_ELEMENT_ID = 'shopResultStatus';

    /**
     * Creates and adds a universal purchase button for a given item configuration.
     * @param {Object} itemConfig - The configuration object for the item.
     */
    function addPurchaseButton(itemConfig) {
        const { id, area, name, elementId } = itemConfig;

        // Only add the button, not a result span
        const buttonHtml = `<button id="${elementId}" style="color: var(--default-blue-color); cursor: pointer; margin-left:5;">${name}</button>`;

        $('div.content-title > h4').append(buttonHtml);

        $(`#${elementId}`).on('click', async () => {
            $(`#${STATUS_ELEMENT_ID}`).text(''); // Clear previous status
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: id,
                    amount: 100,
                    shoparea: area
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        // Update the single shared status element
                        $(`#${STATUS_ELEMENT_ID}`).html(msg.text).css('color', msg.success ? 'green' : 'red');
                    } catch (e) {
                        console.error("Error parsing purchase response:", e, str);
                    }
                }
            });
        });
    }

    // --- Main Execution ---
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl.split('?')[1]);
    const step = urlParams.get('step');
    const headerElement = $('div.content-title > h4');

    if (step && ITEMS[step] && headerElement.length > 0) {
        // 1. Add all buttons for the current shop page
        ITEMS[step].forEach(item => addPurchaseButton(item));

        // 2. Add the single shared status element after all buttons
        const statusHtml = `<span id="${STATUS_ELEMENT_ID}" style="font-size: 12px; font-weight: 100; margin-left: 10px;"></span>`;
        headerElement.append(statusHtml);
    }
})();
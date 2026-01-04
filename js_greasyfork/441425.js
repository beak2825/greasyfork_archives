// ==UserScript==
// @name         Add List Items to Cart
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.4
// @description  Adds a button to saved lists to add all items to cart. Also adds a button in the cart to remove all items from cart.
// @author       James Oltmans
// @match        https://www.walmart.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441425/Add%20List%20Items%20to%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/441425/Add%20List%20Items%20to%20Cart.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Running Add to cart.');

    const SELECTORS = [
        {
            site: 'Walmart',
            urls: ['https://www.walmart.com/lists'],
            selector: 'div.main-content button',
            buttonsText: ['Add to cart', 'Add'],
            loadWait: 2,
            cooldown: 0, // Set to 0 to disable the refresh.
            active: true,
            linkLocationSelector:'h1',
            cartSelector:'h2:contains("Cart")',
            removeSelector:'button:contains("Remove")',
        }
    ];

    /**
     * Inserts a add all to cart button with the count of items it will add.
     * @param {string} buttonId - The Id of the button that will trigger all the other buttons.
     * @param {Object} sel - The selector object.
     */
    function insertAddAllButton(buttonId, sel) {
        let buttons = getFilteredButtonsSelection(buttonId, sel);
        let count = buttons.length;
        let addAllText = `Add all (${count}) to cart`;
        if (count > 0) {
            if ($(`#${buttonId}`).length == 0) {
                $(sel.linkLocationSelector).first().append(` <button id="${buttonId}">${addAllText}</button>`);
            } else {
                $(`#${buttonId}`).text(addAllText);
            }
            $(`#${buttonId}`).off();
            $(`#${buttonId}`).on("click", function() { triggerClicks(buttons); });
            $(`#${buttonId}`).on("mouseover", function() { highlightButtons(buttons); });
        } else {
            $(`#${buttonId}`).remove();
        }
    }

    /**
     * Inserts a remove all from cart button with the count of items it will remove.
     * @param {string} buttonId - The Id of the button that will trigger all the other buttons.
     * @param {Object} sel - The selector object.
     */
    function insertRemoveAllFromCartButton(buttonId, sel) {
        let buttons = getRemoveButtons(buttonId, sel);
        let count = buttons.length;
        let removeText = `Remove all (${count}) from cart`;
        if (count > 0) {
            if ($(`#${buttonId}`).length == 0) {
                $(sel.cartSelector).first().append(` <button id="${buttonId}">${removeText}</button>`);
            } else {
                $(`#${buttonId}`).text(removeText);
            }
            $(`#${buttonId}`).off();
            $(`#${buttonId}`).on("click", function() { triggerClicks(buttons); });
            $(`#${buttonId}`).on("mouseover", function() { highlightButtons(buttons); });
        } else {
            $(`#${buttonId}`).remove();
        }
    }

    /**
     * Get the list of add to cart buttons that match the selector.
     * @param {string} buttonId - The Id of the button that will trigger all the other buttons.
     *                            We have to remove this button from the list to prevent self clicking which will crash or lock up the browser.
     * @param {Object} sel - The selector object. This stores the buttonsText array that we will use to check our list of buttons against.
     *                       Only buttons with children with text that match any of our buttonsText entries will be selected.
     */
    function getFilteredButtonsSelection(buttonId, sel) {
        let buttons = $(sel.selector).filter(function() {
            return sel.buttonsText.indexOf($(this).children().text()) != -1;
        });
        buttons.not(`#${buttonId}`);
        return buttons;
    }

    /**
     * Highlight a list of elements.
     * @param {Object[]} buttons - List of elements to highlight.
     */
    function highlightButtons(buttons) {
        buttons.css("outline", "5px red dotted");
    }

    /**
     * Get the list of remove buttons that match the removeSelector.
     * @param {string} buttonId - The Id of the button that will trigger all the other buttons.
     *                            We have to remove this button from the list to prevent self clicking which will crash or lock up the browser.
     * @param {Object} sel - The selector object. This stores the removeSelector that we will check to grab all the elements we need.
     */
    function getRemoveButtons(buttonId, sel) {
        const buttons = $(sel.removeSelector).not(`#${buttonId}`);
        return buttons;
    }

    /**
     * Trigger a click event on all the elements passed in.
     * @param {Object[]} buttons - List of elements to click.
     */
    function triggerClicks(buttons) {
        let count=buttons.length;
        console.log(`Activating ${count} buttons...`);
        var anyClicked = false;

        // No available buttons.
        if (!count) {
            console.log(`No buttons to click.`);
            return anyClicked;
        }

        buttons.each(function() {
            $(this).trigger("click");
            console.log(`Clicked button.`);
            anyClicked = true;
        });

        return anyClicked;
    }

    /**
     * Finds all Add to Cart buttons for each configured site.
     */
    function findAddButtons() {
        // function main()
        SELECTORS.forEach((sel) => {
            if (sel.active) {
                if ($(sel.linkLocationSelector).length > 0)
                {
                    let buttonId = "AddAllListItemsToCartButton__";
                    insertAddAllButton(buttonId, sel);
                }
            }
        });
    }

    /**
     * Finds all the cart removal buttons for each configured site.
     */
    function findCartRemoveButtons() {
        SELECTORS.forEach((sel) => {
            if (sel.active) {
                if ($(sel.cartSelector).length > 0)
                {
                    let buttonId = "RemoveAllItemsFromCartButton__"
                    insertRemoveAllFromCartButton(buttonId, sel);
                }
            }
        });
    }

    // This function runs periodically to update the add and remove buttons. They are inserted and removed as necessary automatically.
    var pageCheckTimer = setInterval (
    function () {
        findAddButtons();
        findCartRemoveButtons();
    }
        , 222
    );

})();
// ==UserScript==
// @name         Torn Add/Remove All Items (Complete Solution)
// @namespace    http://tampermonkey.net/
// @version      03.28.2025.02.01
// @description  Adds and removes all stackable and non-stackable items correctly in Torn. Authored by KillerCleat [2842410].
// @author       KillerCleat
// @match        https://www.torn.com/displaycase.php*
// @match        https://www.torn.com/trade.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530960/Torn%20AddRemove%20All%20Items%20%28Complete%20Solution%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530960/Torn%20AddRemove%20All%20Items%20%28Complete%20Solution%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getVisibleItems() {
        return Array.from(document.querySelectorAll('ul.items-cont li'))
            .filter(item => item.offsetParent !== null && !item.classList.contains('disabled'));
    }

    // Comprehensive event triggering to ensure Torn UI updates
    function triggerEvents(element) {
        ['input', 'change', 'click'].forEach(eventType => {
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
    }

    // Correctly handles both stackable and non-stackable items
    function setAllItems() {
        const visibleItems = getVisibleItems();
        visibleItems.forEach(item => {
            const qtyDiv = item.querySelector('div.item-amount.qty');
            const qtyInput = item.querySelector('input[name="amount"]:not([type="checkbox"])');
            const checkbox = item.querySelector('input[type="checkbox"][name="amount"]');

            if (qtyDiv && qtyInput) {
                // Stackable item: set quantity directly
                const maxQty = parseInt(qtyDiv.textContent.trim(), 10);
                if (!isNaN(maxQty)) {
                    qtyInput.value = maxQty;
                    triggerEvents(qtyInput);
                }
                if (checkbox) {
                    checkbox.checked = true;
                    triggerEvents(checkbox);
                }
            } else if (checkbox) {
                // Non-stackable item: select checkbox
                checkbox.checked = true;
                triggerEvents(checkbox);
            }
        });
        console.log('✅ Added all visible items (stackable & non-stackable).');
    }

    // Reset all items
    function resetAllItems() {
        const items = getVisibleItems();
        items.forEach(item => {
            const numericInput = item.querySelector('input[type="number"][name="amount"]');
            const checkbox = item.querySelector('input[type="checkbox"][name="amount"]');

            if (numericInput) {
                numericInput.value = 0;
                triggerEvents(numericInput);
            }
            if (checkbox) {
                checkbox.checked = false;
                triggerEvents(checkbox);
            }
        });
        console.log('✅ Removed all visible items.');
    }

    // Create button with specific actions
    function createButton(id, text, bgColor, handler) {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        button.className = 'torn-btn left';
        button.style.marginRight = '10px';
        button.style.backgroundColor = bgColor;
        button.style.fontSize = '1.25em';
        button.onclick = handler;
        return button;
    }

    // Inject buttons into Torn UI correctly
    function injectButtons() {
        const footer = document.querySelector('.items-footer');
        if (!footer || document.getElementById('addAllBtn')) return;

        const addBtn = createButton('addAllBtn', 'Add All Items', '#4CAF50', setAllItems);
        const removeBtn = createButton('removeAllBtn', 'Remove All Items', '#f44336', resetAllItems);
        const clearAll = footer.querySelector('.clear-action');

        footer.insertBefore(removeBtn, clearAll);
        footer.insertBefore(addBtn, removeBtn);
    }

    // Remove buttons when page changes
    function removeButtons() {
        ['addAllBtn', 'removeAllBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.remove();
        });
    }

    // Check page state and initialize
    function init() {
        const url = window.location.href;
        const hash = window.location.hash;

        if ((url.includes('displaycase.php') && hash.includes('add')) ||
            (url.includes('trade.php') && hash.includes('step=add'))) {
            injectButtons();
        } else {
            removeButtons();
        }
    }

    // Wait for page to load items fully
    let interval = setInterval(() => {
        if (document.querySelector('ul.items-cont')) {
            init();
            clearInterval(interval);
        }
    }, 500);

    // Monitor page changes
    window.addEventListener('hashchange', () => setTimeout(init, 500));
})();

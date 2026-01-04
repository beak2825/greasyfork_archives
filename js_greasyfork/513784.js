// ==UserScript==
// @name         Torn Market Item Locker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add lockable quantity controls to market items
// @author       Your name
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @downloadURL https://update.greasyfork.org/scripts/513784/Torn%20Market%20Item%20Locker.user.js
// @updateURL https://update.greasyfork.org/scripts/513784/Torn%20Market%20Item%20Locker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .input-locked {
            pointer-events: none !important;
            opacity: 0.5;
        }
        .lock-icon {
            cursor: pointer;
            margin-left: 5px;
            color: #777;
            position: relative;
            z-index: 1000;
            padding: 5px;
        }
        .lock-icon.locked {
            color: #ff4444;
        }
    `;
    document.head.appendChild(style);

    const STORAGE_KEY = 'torn_market_locked_items';
    let lockedItems = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

    function saveLockedItems() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...lockedItems]));
    }

    function getItemIdentifier(titleElement) {
        const nameElement = titleElement.querySelector('.name___XmQWk');
        return nameElement ? nameElement.textContent.trim() : '';
    }

    function simulateInput(input, value) {
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
    }

    function setRowLockState(itemRow, locked) {
        // Handle quantity input
        const quantityWrapper = itemRow.querySelector('.amountInputWrapper___USwSs');
        if (quantityWrapper) {
            const quantityInput = quantityWrapper.querySelector('input.input-money:not([type="hidden"])');
            quantityWrapper.classList.toggle('input-locked', locked);
            if (locked && quantityInput) {
                simulateInput(quantityInput, '0');
            }
        }

        // Handle price input
        const priceWrapper = itemRow.querySelector('.priceInputWrapper___TBFHl');
        if (priceWrapper) {
            const priceInput = priceWrapper.querySelector('input.input-money:not([type="hidden"])');
            priceWrapper.classList.toggle('input-locked', locked);
            if (locked && priceInput) {
                simulateInput(priceInput, '0');
            }
        }
    }

    function startLockedItemsCheck() {
        setInterval(() => {
            document.querySelectorAll('.lock-icon.locked').forEach(lockIcon => {
                const itemRow = lockIcon.closest('.itemRow___Mf7bO');
                if (itemRow) {
                    // Check and reset quantity
                    const quantityWrapper = itemRow.querySelector('.amountInputWrapper___USwSs');
                    if (quantityWrapper) {
                        const quantityInput = quantityWrapper.querySelector('input.input-money:not([type="hidden"])');
                        if (quantityInput && quantityInput.value !== '0') {
                            simulateInput(quantityInput, '0');
                        }
                    }

                    // Check and reset price
                    const priceWrapper = itemRow.querySelector('.priceInputWrapper___TBFHl');
                    if (priceWrapper) {
                        const priceInput = priceWrapper.querySelector('input.input-money:not([type="hidden"])');
                        if (priceInput && priceInput.value !== '0') {
                            simulateInput(priceInput, '0');
                        }
                    }
                }
            });
        }, 100);
    }

    function processTitle(titleElement) {
        if (titleElement.querySelector('.lock-icon')) return;

        const lockIcon = document.createElement('span');
        lockIcon.innerHTML = '🔓';
        lockIcon.className = 'lock-icon';
        titleElement.appendChild(lockIcon);

        const itemRow = titleElement.closest('.itemRow___Mf7bO');
        const itemId = getItemIdentifier(titleElement);

        if (lockedItems.has(itemId)) {
            lockIcon.innerHTML = '🔒';
            lockIcon.classList.add('locked');
            setRowLockState(itemRow, true);
        }

        lockIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const isLocked = lockIcon.classList.contains('locked');

            if (isLocked) {
                lockIcon.innerHTML = '🔓';
                lockIcon.classList.remove('locked');
                setRowLockState(itemRow, false);
                lockedItems.delete(itemId);
            } else {
                lockIcon.innerHTML = '🔒';
                lockIcon.classList.add('locked');
                setRowLockState(itemRow, true);
                lockedItems.add(itemId);
            }

            saveLockedItems();
            return false;
        }, true);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const titles = node.matches('.title___Xo6Pm') ?
                        [node] :
                        node.querySelectorAll('.title___Xo6Pm');

                    titles.forEach(processTitle);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll('.title___Xo6Pm').forEach(processTitle);
    startLockedItemsCheck();
})();
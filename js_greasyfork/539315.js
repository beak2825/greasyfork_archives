// ==UserScript==
// @name         Torn Userscript - Item Market buy all button
// @version      1.0
// @description  Adds an ALL button to auto-fill max quantity and auto-confirm purchase in one click.
// @author       Canixe
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @namespace    torn.canixe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539315/Torn%20Userscript%20-%20Item%20Market%20buy%20all%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/539315/Torn%20Userscript%20-%20Item%20Market%20buy%20all%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const styledRows = new WeakSet();

    function updateRow(row) {
        if (styledRows.has(row)) return;

        const controls = row.querySelector('.buyControls___MxiIN');
        const buyBtn = row.querySelector('.buyButton___Flkhg');
        const availableText = row.querySelector('.available___xegv_');
        const input = row.querySelector('input.input-money:not([type="hidden"])');

        if (!controls || !buyBtn || !availableText || !input) return;

        // REMOVE BUY ICON
        const buyIcon = buyBtn.querySelector('.icon___nqanu');
        if (buyIcon) buyIcon.remove();

        // Prevent duplicate ALL buttons
        if (controls.querySelector('.all-buy-btn')) return;

        const allBtn = document.createElement('button');
        allBtn.textContent = 'ALL';
        allBtn.className = 'torn-btn all-buy-btn';

        const buttonStyle = {
            fontSize: '10px',
            padding: '0 6px',
            height: '24px',
            lineHeight: '24px',
            textAlign: 'center',
            verticalAlign: 'middle',
            display: 'inline-block',
            marginLeft: '5px',
        };
        Object.assign(buyBtn.style, buttonStyle);
        Object.assign(allBtn.style, buttonStyle);

        allBtn.addEventListener('click', () => {
            const match = availableText.textContent.match(/(\d+)/);
            if (!match) return;
            const qty = parseInt(match[1], 10);

            input.focus();
            input.value = qty;

            // Properly dispatch events to trigger Torn's internal logic
            ['input', 'change', 'blur'].forEach(evt =>
                input.dispatchEvent(new Event(evt, { bubbles: true }))
            );

            // Wait for Torn to enable the BUY button
            setTimeout(() => {
                if (!buyBtn.disabled) {
                    buyBtn.click();

                    // Wait for the confirmation box and click "Yes"
                    const confirmInterval = setInterval(() => {
                        const confirmBtn = document.querySelector('.confirmButton___WoFpj');
                        if (confirmBtn?.textContent.trim() === 'Yes') {
                            confirmBtn.click();
                            clearInterval(confirmInterval);
                            console.log(`[ALL] Purchased ${qty}`);
                        }
                    }, 100);
                } else {
                    console.warn('[ALL] Buy button still disabled');
                }
            }, 150); // Give time for input to register
        });

        controls.appendChild(allBtn);
        styledRows.add(row);
        console.log('[ALL] Button injected');
    }

    // Watch rows every 500ms
    setInterval(() => {
        if (window.location.href.includes('ItemMarket')) {
            document.querySelectorAll('.rowWrapper___me3Ox').forEach(updateRow);
        }
    }, 500);
})();
// ==UserScript==
// @name         Dead Frontier Inventory Counter
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Detects true usable inventory slots (base + backpack)
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534683/Dead%20Frontier%20Inventory%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/534683/Dead%20Frontier%20Inventory%20Counter.meta.js
// ==/UserScript==

window.BrowserImplant_InventoryCounter = true;

(function () {
    'use strict';

    // 🔧 IMPORTANT: Don't run this script inside iframes (fixes level-up loop)
    if (window.top !== window.self) {
        return;
    }

    const INVENTORY_URL = 'https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25';

    function createHiddenIframe(callback) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = INVENTORY_URL;

        iframe.onload = () => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;

                let used = 0;
                let total = 0;

                const allSlots = Array.from(doc.querySelectorAll('td.validSlot[data-slot]'));

                allSlots.forEach(slot => {
                    const inBackpack = slot.closest('#backpackdisplay'); // kept for clarity if you want later use
                    const isImplantOrJunk = slot.closest('#implants') ||
                                            slot.closest('.equipped') ||
                                            slot.closest('.weapon');

                    if (!isImplantOrJunk) {
                        total++;
                        if (slot.querySelector('.item')) used++;
                    }
                });

                callback({ used, total });

            } catch (err) {
                console.error('[DF Inventory Iframe] Access error:', err);
                callback(null);
            } finally {
                // 🧹 Remove the helper iframe so it can't interfere with anything else
                iframe.remove();
            }
        };

        document.body.appendChild(iframe);
    }

    function injectSidebarBox(inventory) {
        const targetTD = Array.from(document.querySelectorAll('td.design2010'))
            .find(td => td.getAttribute('background')?.includes('menu_div6.jpg'));
        if (!targetTD) return;

        const box = document.createElement('div');
        box.style.margin = '4px auto';
        box.style.textAlign = 'center';
        box.style.fontSize = '11px';
        box.style.fontWeight = '600';
        box.style.textShadow = '1px 1px #000';
        box.style.lineHeight = '1.2';

        if (!inventory) {
            box.textContent = 'Inventory: error';
            box.style.color = '#ccc';
        } else {
            const { used, total } = inventory;
            const free = total - used;
            const percent = total > 0 ? Math.round((used / total) * 100) : 0;

            const color =
                percent >= 90 ? '#ff3333' :
                percent >= 50 ? '#ffff33' :
                '#00ff00';

            box.textContent = `Inventory: ${used}/${total} (${free} free)`;
            box.style.color = color;
        }

        targetTD.appendChild(box);
    }

    window.addEventListener('load', () => {
        createHiddenIframe(injectSidebarBox);
    });
})();

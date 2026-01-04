// ==UserScript==
// @name         Auto Click Create Ticket Button with Ticket Limit
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto-clicks 'Create ticket' unless 3 or more ticket channels exist
// @author       Yui
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532848/Auto%20Click%20Create%20Ticket%20Button%20with%20Ticket%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/532848/Auto%20Click%20Create%20Ticket%20Button%20with%20Ticket%20Limit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_TICKET_CHANNELS = 3;
    let stopClicking = false;

    function checkTicketChannelCount() {
        const elements = document.querySelectorAll(".name__2ea32.overflow__82b15");
        let count = 0;

        elements.forEach(el => {
            if (/ticket/i.test(el.textContent)) {
                count++;
            }
        });

        if (count >= MAX_TICKET_CHANNELS) {
            console.log(`[AutoTicket] Found ${count} ticket channels. Stopping click.`);
            stopClicking = true;
        } else {
            stopClicking = false;
        }
    }

    function clickButton() {
        checkTicketChannelCount();
        if (stopClicking) return;

        const button = document.querySelector(".button__201d5.lookFilled__201d5.colorPrimary__201d5.sizeSmall__201d5.grow__201d5");
        if (button) {
            button.click();
            console.log("[AutoTicket] Create Ticket button clicked.");
        } else {
            console.log("[AutoTicket] Button not found.");
        }
    }

    const observer = new MutationObserver(() => clickButton());
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(clickButton, 2000);
})();
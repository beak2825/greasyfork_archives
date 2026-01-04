// ==UserScript==
// @name         Cartel Empire - Supporter Status Ending Warning
// @namespace    baccy.ce
// @version      0.1.2
// @description  Shows a message if your supporter/subscriber status ends within 3 days, or if it has ended.
// @author       Baccy
// @match        https://*.cartelempire.online/*
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535731/Cartel%20Empire%20-%20Supporter%20Status%20Ending%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/535731/Cartel%20Empire%20-%20Supporter%20Status%20Ending%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CHANGE IF YOU WANT THE WARNING EARLIER OR LATER
    const DAYS_REMAINING_FOR_WARNING = 3;

    // CHANGE IF YOU WANT THE DISMISS BUTTON TO REMOVE THE WARNING FOR MORE OR LESS TIME
    const HOURS_BEFORE_WARNING_SHOWS_AGAIN = 1;


    function createMessage(container, text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-4 card border-success statusAlertBox';
        wrapper.style.cssText = 'background: #2b3035;';
        const word = HOURS_BEFORE_WARNING_SHOWS_AGAIN === 1 ? 'HOUR' : 'HOURS';
        wrapper.innerHTML = `
            <div class="card-body text-center" style="background: #2b3035;">
                <p class="card-text fw-bold text-white">${text}</p>
                <button class="btn btn-sm btn-dark" style="border: 1px solid #ccc; color: white;">REMOVE FOR ${HOURS_BEFORE_WARNING_SHOWS_AGAIN} ${word}</button>
            </div>
        `;
        const button = wrapper.querySelector('button');
        button.addEventListener('click', () => {
            localStorage.setItem('CE_supporter_status', Date.now());
            wrapper.remove();
        });
        container.prepend(wrapper);
    }

    function checkIcon() {
        const time = localStorage.getItem('CE_supporter_status') || 0;
        if (parseInt(time) + (HOURS_BEFORE_WARNING_SHOWS_AGAIN * 60 * 60 * 1000) > Date.now()) return;

        const icon = document.querySelector('li.premiumIcon.statusIcon a[data-bs-content]');
        const container = document.querySelector('#mainBackground .container .row');
        if (!container) return;

        if (icon) {
            const content = icon.getAttribute('data-bs-content');
            const match = content.match(/(\d+)\s+days?\s+of\s+(Supporter|Subscriber)/i);
            if (match) {
                const days = parseInt(match[1]);
                const type = match[2];
                if (days <= DAYS_REMAINING_FOR_WARNING) createMessage(container, `You have ${days} days of ${type} status left.`);
            }
        } else createMessage(container, 'You do not have Supporter status.');
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('li.eventIcon.statusIcon')) {
            obs.disconnect();
            checkIcon();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

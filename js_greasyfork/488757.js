// ==UserScript==
// @name         Cheredak fees checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Append a dynamic hyperlink based on RIDEUUID and driverID to check the fees deduction
// @author       Noureddine
// @match        https://cherdak.console3.com/mena/new-order/orders/*
// @icon         https://assets-global.website-files.com/643d3ad915724c257639f659/64709690d3b6b46a21ba91b0_favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488757/Cheredak%20fees%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/488757/Cheredak%20fees%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchRideUUID() {
        const currentUUID = window.location.pathname.split('/').pop();
        const fetchURL = `https://cherdak.console3.com/admin-access/proxy/mena/new-order/v1/orders/${currentUUID}`;

        try {
            const response = await fetch(fetchURL);
            const data = await response.json();
            return data.order && data.order.ride_uuid;
        } catch (error) {
            console.error('Error fetching or parsing response:', error);
            return null;
        }
    }

    async function appendButtonLink() {
        const rideUUID = await fetchRideUUID();
        if (!rideUUID) {
            console.error('RIDEUUID not found');
            return;
        }

        const userLinks = document.querySelectorAll('.styles__UserLink-gSQWOx.kSgELQ');
        userLinks.forEach(userLink => {

            let isContractor = false;
            const parentDiv = userLink.closest('div.styles__UserField-hthJJP.kZrRmT');
            if (parentDiv) {
                const dtElements = parentDiv.querySelectorAll('dt');
                dtElements.forEach(dt => {
                    if (dt.textContent.includes('Contractor')) {
                        isContractor = true;
                    }
                });
            }

            if (!isContractor) {
                return; 
            }

            if (!userLink.nextElementSibling || !userLink.nextElementSibling.classList.contains('user-balance-button')) {
                const driverID = userLink.textContent.trim();
                const newLink = `https://cherdak.console3.com/mena/user-balance/user-balance-transaction?sourceUUID=${rideUUID}&userId=${driverID}`;

                const button = document.createElement('a');
                button.href = newLink;
                button.textContent = 'Check fees';
                button.target = '_blank';
                button.classList.add('user-balance-button');
                button.style = 'display: inline-block; margin-top: 5px; text-decoration: none; background-color: #FF6500; color: white; padding: 5px 10px; border-radius: 4px;';

                userLink.parentNode.insertBefore(button, userLink.nextSibling);
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                appendButtonLink();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    appendButtonLink();
})();

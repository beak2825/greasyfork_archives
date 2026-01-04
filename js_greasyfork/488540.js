// ==UserScript==
// @name         Couriers fee check CIS
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Append a dynamic hyperlink based on deliveryUUID and userId to check the fees deduction
// @author       Ahmed
// @match        https://cherdak.console3.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488540/Couriers%20fee%20check%20CIS.user.js
// @updateURL https://update.greasyfork.org/scripts/488540/Couriers%20fee%20check%20CIS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function fetchData() {
        const currentUUID = window.location.pathname.split('/').pop();
        const fetchURL = `https://cherdak.console3.com/admin-access/proxy/cis/couriers/v1/orders/${currentUUID}`;
        try {
            const response = await fetch(fetchURL);
            const data = await response.json();
            return {
                deliveryUUID: data.order.charges[0].delivery_uuid,
                userId: data.order.contractor.user_id
            };
        } catch (error) {
            console.error('Error fetching or parsing response:', error);
            return null;
        }
    }
    async function appendButtonLink() {
        const data = await fetchData();
        if (!data) {
            console.error('Required data not found');
            return;
        }
        const userIdField = document.querySelector("#single-spa-application\\:\\@cherdak\\/couriers-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(3) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJKrZ > div > div > dt:nth-child(6)");

        if (userIdField && !userIdField.nextElementSibling?.classList.contains('user-balance-button')) {
            const newLink = `https://cherdak.console3.com/cis/user-balance/user-balance-transaction?sourceUUID=${data.deliveryUUID}&userId=${data.userId}`;
            const button = document.createElement('a');
            button.href = newLink;
            button.textContent = 'Check fees';
            button.target = '_blank';
            button.classList.add('user-balance-button');
            button.style = 'display: inline-block; margin-left: 10px; text-decoration: none; background-color: #FF6500; color: white; padding: 5px 10px; border-radius: 4px;';
            userIdField.parentNode.insertBefore(button, userIdField.nextSibling);
        }
    }
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                appendButtonLink();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    appendButtonLink();
})();
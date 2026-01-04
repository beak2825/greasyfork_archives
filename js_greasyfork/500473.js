// ==UserScript==
// @name         Amazon Subscription Canceler
// @namespace    elias.eu.org
// @version      1.0
// @description  Cancel all subscriptions with one button click
// @author       eliasbenb
// @license      MIT
// @match        https://www.amazon.com/auto-deliveries/subscriptionList
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500473/Amazon%20Subscription%20Canceler.user.js
// @updateURL https://update.greasyfork.org/scripts/500473/Amazon%20Subscription%20Canceler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button
    let button = document.createElement('button');
    button.innerHTML = 'Cancel Subscriptions';
    button.style.position = 'fixed';
    button.style.top = '163px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ff9900';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // Append the button to the body
    document.body.appendChild(button);

    // Function to cancel subscriptions
    function cancelSubscriptions() {
        let baseUrl = "https://www.amazon.com/auto-deliveries/ajax/cancelSubscriptionAction?actionType=cancelSubscription&canceledNextDeliveryDate=1730880000000&subscriptionId=";
        let spans = document.querySelectorAll('span[data-action="edit-link-subscription-tablet"]');
        let subscriptionIds = [...spans].map(span => {
            let data = span.getAttribute('data-edit-link-subscription-tablet');
            let match = data.match(/subscriptionId=([^&"]+)/);
            return match ? match[1] : null;
        }).filter(id => id);
        console.log(`Found ${subscriptionIds.length} subscription IDs.`);

        function openNextUrl(index) {
            if (index >= subscriptionIds.length) {
                console.log('All URLs have been opened.');
                return;
            }
            let id = subscriptionIds[index];
            let url = baseUrl + id;
            console.log(`Opening URL: ${url}`);
            let newWindow = window.open(url, '_blank');
            setTimeout(() => {
                openNextUrl(index + 1);
            }, 1000);
        }

        openNextUrl(0);
    }

    // Add click event listener to the button
    button.addEventListener('click', cancelSubscriptions);
})();

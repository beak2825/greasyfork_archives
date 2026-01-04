// ==UserScript==
// @name         Padel Net Cost Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculate and display net cost of padel matches in the header
// @author       You
// @match        *://*.ballejaune.com/account*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532434/Padel%20Net%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/532434/Padel%20Net%20Cost%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to calculate net cost from reservation history
    function calculateNetCost() {
        const rows = document.querySelectorAll('tr[data-rowid]');
        let valid_reservations = 0
        let friends_paied_for = 0
        rows.forEach(row => {
            const badge = row.querySelector('div.badge');
            const originTd = row.querySelector('td:nth-child(3)');
            if (badge && originTd) {
                const text = badge.textContent.trim();
                const match = text.match(/([+-]\s*\d+)/);
                if (match) {
                    const K_str = match[1].replace(/\s+/g, ''); // e.g., "- 1" -> "-1"
                    const K = parseInt(K_str);
                    if (!isNaN(K) && K !== 100) { // Exclude initial +100 purchase
                        const originText = originTd.innerHTML.trim();
                        // Reservation for yourself
                        if (originText.includes('Réservation') && K < 0) {
                            valid_reservations++
                        }
                        // Cancellation
                        else if (originText.includes('Réservation') && K > 0) {
                            valid_reservations--
                        }
                        // Paying for friends
                        else if (originText.includes('Club')) {
                            friends_paied_for -= K
                        }
                    }
                }
            }
        });
        const totalNetCost = valid_reservations * 15 - friends_paied_for * 5
        return totalNetCost

    }

    // Function to inject net cost into the header
    function injectNetCost(netCost) {
        const menu = document.querySelector('ul#widget-menu');
        if (menu) {
            const net_cost_item_refreach = document.querySelector('#widget-netcost span');
            if (net_cost_item_refreach){
                net_cost_item_refreach.textContent = `Net Cost: ${netCost} dt`;
            }else{
                const netCostItem = document.createElement('li');
                netCostItem.className = 'navbar-widget-nav-line';
                netCostItem.id = 'widget-netcost';

                const netCostLink = document.createElement('a');
                netCostLink.className = 'navbar-widget-nav-link';
                netCostLink.href = '#'; // Non-clickable link
                netCostLink.setAttribute('data-container', '#main-tooltips');
                netCostLink.setAttribute('data-placement', 'bottom');
                netCostLink.setAttribute('data-delay', '500');
                netCostLink.setAttribute('title', 'Net Cost');
                netCostLink.style.color = '#fff'; // Match navbar text color
                netCostLink.style.cursor = 'default'; // Indicate non-interactive

                const netCostText = document.createElement('span');
                netCostText.textContent = `Net Cost: ${netCost} dt`;

                netCostLink.appendChild(netCostText);
                netCostItem.appendChild(netCostLink);
                menu.insertBefore(netCostItem, menu.firstChild);
            }
            console.log(netCost);
        } else {
            console.error('Widget menu not found!');
        }
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        setInterval(()=>{
        const netCost = calculateNetCost();
        injectNetCost(netCost)}, 5000)
    });
})();
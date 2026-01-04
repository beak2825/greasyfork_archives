// ==UserScript==
// @name         Calculate Total Pending Rewards
// @namespace    https://example.com/
// @version      1.0
// @description  Calculates the total pending rewards on the page.
// @author       Your Name
// @match        *://https://capitaloneshopping.com/my-rewards/lifetime-savings/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521491/Calculate%20Total%20Pending%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/521491/Calculate%20Total%20Pending%20Rewards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize totalRewards to 0
    let totalRewards = 0;

    // Select all savings trip row bodies
    const tripRows = document.querySelectorAll('.savings-trip-row-body');

    tripRows.forEach(row => {
        // Get the status text
        const status = row.querySelector('.status').textContent.trim();
        
        if (status === 'Pending') {
            // Get the rewards amount text, remove '$' and convert it to a number
            const rewardsAmount = parseFloat(row.querySelector('.rewards-amount').textContent.trim().replace('$', ''));
            
            // Add the rewards amount to totalRewards
            totalRewards += rewardsAmount;
        }
    });

    // Log the total rewards amount
    console.log('Total Pending Rewards:', totalRewards);

    // Optionally display it on the page
    const display = document.createElement('div');
    display.textContent = `Total Pending Rewards: $${totalRewards.toFixed(2)}`;
    display.style.position = 'fixed';
    display.style.bottom = '10px';
    display.style.right = '10px';
    display.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    display.style.color = 'white';
    display.style.padding = '10px';
    display.style.borderRadius = '5px';
    display.style.zIndex = '10000';
    document.body.appendChild(display);
})();

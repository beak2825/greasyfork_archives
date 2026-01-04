// ==UserScript==
// @license MIT 
// @name         RunPod Balance Hours Remaining
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add hours remaining to balance display on RunPod
// @author       You
// @match        https://www.runpod.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526214/RunPod%20Balance%20Hours%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/526214/RunPod%20Balance%20Hours%20Remaining.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatTimeRemaining(hours) {
        if (!isFinite(hours) || isNaN(hours)) return "-- remaining";
        
        const totalHours = Math.floor(hours);
        const minutes = Math.round((hours - totalHours) * 60);

        if (totalHours === 0) {
            return `${minutes}m remaining`;
        } else if (minutes === 0) {
            return `${totalHours}h remaining`;
        } else {
            return `${totalHours}h ${minutes}m remaining`;
        }
    }

    function updateHoursRemaining(balance, spendPerHr) {
        const balanceDiv = document.evaluate(
            '/html/body/div[1]/div[1]/div[2]/div[2]/div/div[2]/div/div/a/button/div/div[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (balanceDiv) {
            // Check if values are valid numbers and spendPerHr is not zero
            if (!isFinite(balance) || !isFinite(spendPerHr) || spendPerHr === 0) {
                console.log('RunPod Hours Script - Invalid values:', {balance, spendPerHr});
                return;
            }

            const hoursRemaining = balance / spendPerHr;
            let hoursDiv = document.getElementById('hours-remaining');

            if (!hoursDiv) {
                hoursDiv = document.createElement('div');
                hoursDiv.id = 'hours-remaining';
                hoursDiv.style.fontSize = '10px';
                hoursDiv.style.color = '#94a3b8';
                hoursDiv.style.fontWeight = '600';
                balanceDiv.after(hoursDiv);
            }

            hoursDiv.textContent = formatTimeRemaining(hoursRemaining);
        }
    }

    // Monitor XHR responses for GraphQL data
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        if (response.url.includes('api.runpod.io/graphql')) {
            response.clone().json().then(data => {
                if (data.data?.myself) {
                    const balance = parseFloat(data.data.myself.clientBalance);
                    const spendPerHr = parseFloat(data.data.myself.currentSpendPerHr);
                    console.log('RunPod Hours Script - Received values:', {balance, spendPerHr});
                    updateHoursRemaining(balance, spendPerHr);
                }
            }).catch(error => {
                console.error('RunPod Hours Script - Error processing response:', error);
            });
        }
        return response;
    };
})();

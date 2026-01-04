// ==UserScript==
// @name         CPX Research Offer Rate Calculator (SplitDrop)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculate hourly rates for CPX Research offers, sort them, and display in a compact table layout
// @author       You
// @match        https://offers.cpx-research.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512029/CPX%20Research%20Offer%20Rate%20Calculator%20%28SplitDrop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512029/CPX%20Research%20Offer%20Rate%20Calculator%20%28SplitDrop%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Change the header backgorund to black
    window.onload = function() {
        const headerElement = document.evaluate('//*[@id="header"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (headerElement) {
            headerElement.style.backgroundColor = 'black';
        }
    };

    // Create a button to trigger rate calculation, sorting, and table conversion
    const button = document.createElement('button');
    button.innerText = 'Calculate Rates';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#28a745';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', calculateAndConvertToTable);

    function calculateAndConvertToTable() {
        const offers = document.querySelectorAll('.point-card');

        // Collect offer data and calculate hourly rate
        let offerData = [];
        offers.forEach(offer => {
            const coins = parseInt(offer.querySelector('#payout_showed').innerText.replace('+', '').trim(), 10);
            const minutes = parseInt(offer.querySelector('.time h5').innerText.replace('~', '').trim(), 10);
            const ratings = offer.querySelector('.right p') ? offer.querySelector('.right p').innerText : '';
            const stars = offer.querySelectorAll('.stars-checked').length; // Count stars

            if (!isNaN(coins) && !isNaN(minutes) && minutes > 0) {
                // Convert coins to dollars (1000 coins = $1)
                const payoutInDollars = coins / 1000;
                const hours = minutes / 60;
                const hourlyRate = payoutInDollars / hours;
                offerData.push({ element: offer, payoutInDollars, minutes, hourlyRate, ratings, stars });
            }
        });

        // Sort offers by highest hourly rate
        offerData.sort((a, b) => b.hourlyRate - a.hourlyRate);

        // Create a table to display the sorted offers
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '20px';
        table.style.fontFamily = 'Arial, sans-serif';
        const header = `
            <thead>
                <tr style="background-color: #f8f9fa;">
                    <th style="border: 1px solid #ccc; padding: 8px;">Reward</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Time (Minutes)</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Hourly Rate</th>
                    <th style="border: 1px solid #ccc; padding: 8px;">Ratings</th>
                </tr>
            </thead>
        `;
        table.innerHTML = header;

        const tbody = document.createElement('tbody');

        offerData.forEach((data, index) => {
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.style.transition = 'background-color 0.3s';
            row.onclick = data.element.onclick;

            // Alternate row colors (even rows light gray, odd rows white)
            row.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : 'white';

            // Add hover effect
            row.onmouseover = function() {
                row.style.backgroundColor = '#e2e6ea';
            };
            row.onmouseout = function() {
                // Restore original color when no longer hovering
                row.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : 'white';
            };

            row.innerHTML = `
                <td style="border: 1px solid #ccc; padding: 8px; background-color: #d4edda;">$${data.payoutInDollars.toFixed(2)}</td>
                <td style="border: 1px solid #ccc; padding: 8px;">${data.minutes}</td>
                <td style="border: 1px solid #ccc; padding: 8px; font-weight: bold; color: ${getColorForRate(data.hourlyRate)}; background-color: silver">$${data.hourlyRate.toFixed(2)}/hr</td>
                <td style="border: 1px solid #ccc; padding: 8px;">
                    ${generateStars(data.stars)}
                    <span style="margin-left: 5px;">${data.ratings}</span>
                </td>
            `;

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Clear the existing offers layout and append the table
        const offerContainer = offers[0].parentElement;
        offerContainer.innerHTML = '';
        offerContainer.appendChild(table);
    }

    // Function to determine color based on hourly rate
    function getColorForRate(rate) {
        const minRate = 5; // Minimum rate for color scaling
        const maxRate = 20; // Maximum rate for color scaling
        const midRate = 10; // Midpoint of the color range

        if (rate <= minRate) return 'red';
        if (rate >= maxRate) return 'green';

        const redToLightYellow = rate <= midRate;
        const scale = redToLightYellow ? (rate - minRate) / (midRate - minRate) : (rate - midRate) / (maxRate - midRate);

        if (redToLightYellow) {
            // Red to light yellow gradient (scale from 0 to 1)
            return `rgb(255, ${Math.round(110 * scale)}, ${Math.round(110 * scale)})`;
        } else {
            // Light yellow to green gradient (scale from 0 to 1)
            return `rgb(${Math.round(230 * (1 - scale))}, 255, ${Math.round(150 * (1 - scale))})`;
        }
    }


    // Function to generate stars based on count
    function generateStars(starCount) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < starCount) {
                stars += `<img src="assets/img/icon-star-checked.png" alt="" style="width:16px; vertical-align: middle;">`;
            } else {
                stars += `<img src="assets/img/icon-star-unchecked.png" alt="" style="width:16px; vertical-align: middle;">`;
            }
        }
        return stars;
    }

})();
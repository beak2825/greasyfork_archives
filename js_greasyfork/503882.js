// ==UserScript==
// @name        show details tracker - bm
// @namespace   Violentmonkey Scripts
// @match       https://in.bookmyshow.com/*
// @grant       none
// @version     1.3
// @description 7/15/2024, 3:48:01 PM
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503882/show%20details%20tracker%20-%20bm.user.js
// @updateURL https://update.greasyfork.org/scripts/503882/show%20details%20tracker%20-%20bm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the Calculate button
    const calculateButton = document.createElement('button');
    calculateButton.textContent = 'Calculate';
    calculateButton.style.position = 'fixed';
    calculateButton.style.top = '10px';
    calculateButton.style.right = '10px';
    calculateButton.style.zIndex = 1000;
    calculateButton.style.backgroundColor = '#007bff';
    calculateButton.style.color = '#fff';
    calculateButton.style.border = 'none';
    calculateButton.style.borderRadius = '5px';
    calculateButton.style.padding = '10px 20px';
    calculateButton.style.cursor = 'pointer';
    calculateButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    calculateButton.style.transition = 'background-color 0.3s ease';

    calculateButton.onmouseover = () => calculateButton.style.backgroundColor = '#0056b3';
    calculateButton.onmouseout = () => calculateButton.style.backgroundColor = '#007bff';

    // Create and style the Count Shows button
    const countShowsButton = document.createElement('button');
    countShowsButton.textContent = 'Count Shows';
    countShowsButton.style.position = 'fixed';
    countShowsButton.style.top = '50px';
    countShowsButton.style.right = '10px';
    countShowsButton.style.zIndex = 1000;
    countShowsButton.style.backgroundColor = '#28a745';
    countShowsButton.style.color = '#fff';
    countShowsButton.style.border = 'none';
    countShowsButton.style.borderRadius = '5px';
    countShowsButton.style.padding = '10px 20px';
    countShowsButton.style.cursor = 'pointer';
    countShowsButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    countShowsButton.style.transition = 'background-color 0.3s ease';

    countShowsButton.onmouseover = () => countShowsButton.style.backgroundColor = '#218838';
    countShowsButton.onmouseout = () => countShowsButton.style.backgroundColor = '#28a745';

    // Create and style the result div
    const resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.top = '100px';
    resultDiv.style.right = '10px';
    resultDiv.style.zIndex = 1000;
    resultDiv.style.backgroundColor = 'white';
    resultDiv.style.border = '1px solid #ddd';
    resultDiv.style.borderRadius = '5px';
    resultDiv.style.padding = '20px';
    resultDiv.style.width = '300px';
    resultDiv.style.maxHeight = '80vh';
    resultDiv.style.overflowY = 'auto';
    resultDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    resultDiv.style.display = 'none';  // Hidden initially

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginBottom = '10px';
    closeButton.style.display = 'block';
    closeButton.style.width = '100%';

    closeButton.onmouseover = () => closeButton.style.backgroundColor = '#c82333';
    closeButton.onmouseout = () => closeButton.style.backgroundColor = '#dc3545';

    closeButton.addEventListener('click', () => {
        resultDiv.style.display = 'none';
    });

    resultDiv.appendChild(closeButton);

    document.body.appendChild(calculateButton);
    document.body.appendChild(countShowsButton);
    document.body.appendChild(resultDiv);

    // Function to parse and extract seat layout information
    function parseSeatLayouts() {
        // Find all elements with the class 'PriceB1'
        const layouts = document.querySelectorAll('td.PriceB1');




const layoutsIfMobile = document.querySelectorAll('.seat-layout .area-line');












        // Initialize totals
        let totalAvailableSeats = 0;
        let totalBlockedSeats = 0;
        let totalSales = 0;

        let resultHTML = '';

        // Extract event name and venue name
        const eventNameElement = document.querySelector('#strEvtName');
        const eventName = eventNameElement ? eventNameElement.textContent.trim() : 'Event name not found';

        const venueNameElement = document.querySelector('#strVenName');
        const venueName = venueNameElement ? venueNameElement.textContent.trim() : 'Venue name not found';

        const strDateeElement = document.querySelector('#strDate');
        const strDate = strDateeElement ? strDateeElement.textContent.trim().replace('Today, ', '').trim() : 'Date not found';

        resultHTML += `<div><strong>${eventName}</strong></div>`;
        resultHTML += `<div><strong>${venueName} ${strDate}</strong></div><hr>`;




      layoutsIfMobile.forEach(layout => {
    const priceText = layout.nextElementSibling; // Assuming the <text> element is a sibling of the <line> element
    if (priceText && priceText.tagName === 'text') {


      const priceContent = priceText.textContent.trim();
        const pricemob = priceContent.replace(/₹/g, '').trim();
       resultHTML += `<div><strong>Pricem: Rs. ${pricemob}</strong></div>`;

    }


        // Find all seats in the current layout

     const seats = row.querySelectorAll('*[class*="blocked"]').length;
 resultHTML += `<div><strong>bookedCounxt. ${seats}</strong></div>`;

});




        // Extract and print each layout, its price, and seat counts
        layouts.forEach(layout => {
            // Extract the price
            const priceDiv = layout.querySelector('div.seatP');
            const priceText = priceDiv ? priceDiv.textContent.trim() : 'Price not found';

            // Extract numerical value from price
            const priceMatch = priceText.match(/Rs\.\s*(\d+)/);
            const priceValue = priceMatch ? parseInt(priceMatch[1], 10) : 0;

            // Find the parent table row
            let parentTr = layout.closest('tr');

            // Find the next sibling rows until the next 'PriceB1' class is found
            const layoutRows = [];
            while (parentTr) {
                layoutRows.push(parentTr);
                parentTr = parentTr.nextElementSibling;
                if (parentTr && parentTr.querySelector('td.PriceB1')) {
                    break;
                }
            }

            // Count available and blocked/sold seats
            let availableSeats = 0;
            let blockedSeats = 0;
            layoutRows.forEach(row => {
                availableSeats += row.querySelectorAll('a._available').length;
                blockedSeats += row.querySelectorAll('a[class*="_blocked"]').length;

            });

            // Calculate sales for the current layout

            const layoutSales = blockedSeats * priceValue;
               const blockedSeatsPC = document.querySelectorAll('a[class*="_blocked"]');
        blockedSeatsPC.forEach(seat => seat.style.border = "1px solid red");

            // Add to totals
            totalAvailableSeats += availableSeats;
            totalBlockedSeats += blockedSeats;
            totalSales += layoutSales;

            // Generate the layout HTML for display
            resultHTML += `<div><strong>Price: Rs. ${priceValue}</strong></div>`;
            resultHTML += `<div>Available/Blocked seats: ${availableSeats}/${blockedSeats} | ${availableSeats + blockedSeats}</div>`;


            resultHTML += `<div>Sales for this layout: Rs. ${layoutSales.toFixed(2)}</div>`;
            resultHTML += '<hr>';  // Separator for readability
        });

        // Add the totals to the result HTML
        resultHTML += `<div><strong>Total available seats: ${totalAvailableSeats}</strong></div>`;
        resultHTML += `<div><strong>Total blocked/sold seats: ${totalBlockedSeats}</strong></div>`;
        resultHTML += `<div><strong>Total seats: ${totalAvailableSeats + totalBlockedSeats}</strong></div>`;
        resultHTML += `<div><strong>Total sales: Rs. ${totalSales.toFixed(2)}</strong></div>`;

        // Display the result
        resultDiv.innerHTML = resultHTML;
        resultDiv.prepend(closeButton);
        resultDiv.style.display = 'block';
    }

    // Add event listener to the Calculate button
    calculateButton.addEventListener('click', parseSeatLayouts);

    // Add event listener to the Count Shows button
    countShowsButton.addEventListener('click', () => {
        const isMobile = window.innerWidth <= 600;
        let showCount = 0;

        if (isMobile) {
            const timeLists = document.querySelectorAll('.time-list');
            timeLists.forEach(timeList => {
                showCount += timeList.querySelectorAll('li').length;
            });
        } else {
            showCount = document.querySelectorAll('.showtime-pill').length;
        }

        // Display the result
        resultDiv.innerHTML = `<div><strong>Total shows: ${showCount}</strong></div>`;
        resultDiv.prepend(closeButton);
        resultDiv.style.display = 'block';
    });
})();

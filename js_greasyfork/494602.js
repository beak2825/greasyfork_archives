// ==UserScript==
// @name        Game-Stats Canvas to CSV
// @namespace   Violentmonkey Scripts
// @match       *://games-stats.com/steam/game/*
// @grant       none
// @version     1.0
// @license     EUPL 1.2
// @author      Dawid Niedźwiedzki ("Tiritto")
// @description 10.05.2024, 22:08:07
// @downloadURL https://update.greasyfork.org/scripts/494602/Game-Stats%20Canvas%20to%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/494602/Game-Stats%20Canvas%20to%20CSV.meta.js
// ==/UserScript==


function canvasToCSV() {
    const revenueCanvas = document.getElementById('revenue-canvas');
    const priceCanvas = document.getElementById('price-canvas');
    const reviewsCanvas = document.getElementById('reviews-canvas');

    if (!revenueCanvas || !priceCanvas || !reviewsCanvas) {
        console.error("Canvas element not found.");
        return;
    }

    const revenueData = JSON.parse(revenueCanvas.getAttribute('data-json'));
    const priceData = JSON.parse(priceCanvas.getAttribute('data-json'));
    const reviewsData = JSON.parse(reviewsCanvas.getAttribute('data-json'));

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Revenue,Standard Price,Discounted Price,Reviews Count\n";

    revenueData.forEach(revenueEntry => {

        // Revenue
        const revenueDate = new Date(revenueEntry.created).toISOString().split('T')[0];
        const revenue = revenueEntry.revenue;

        // Price
        const priceEntry = priceData.find(priceEntry => {
            const priceDate = new Date(priceEntry.created).toISOString().split('T')[0];
            return priceDate === revenueDate;
        });
        const standardPrice = priceEntry ? priceEntry.price_usd : '';
        const discountedPrice = priceEntry ? (priceEntry.price_discount ? priceEntry.price_discount : '') : '';

        // Reviews
        const reviewsEntry = reviewsData.find(reviewsEntry => {
            const reviewsDate = new Date(reviewsEntry.created).toISOString().split('T')[0];
            return reviewsDate === revenueDate;
        });
        const reviewsCount = reviewsEntry ? reviewsEntry.reviews_count_steam_purchased : '';
        csvContent += `${revenueDate},${revenue},${standardPrice},${discountedPrice},${reviewsCount}\n`;

    });


    // Extract game title from URL
    const url = window.location.href;
    const match = url.match(/\/game\/([^/]+)/);
    const gameTitle = match ? match[1] : "unknown";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${gameTitle}.csv`);
    document.body.appendChild(link); // Required for Firefox
    link.click();
}

function addDownloadButton() {
    const button = document.createElement('button');
    button.textContent = 'Download CSV';
    button.addEventListener('click', canvasToCSV);
    button.style.margin = "0 10px"; // Add margin for space
    const h2Elements = document.querySelectorAll('h2');
    h2Elements.forEach(h2 => {
        if (h2.textContent.includes('Historical Charts')) {
            h2.appendChild(button);
        }
    });
}

addDownloadButton();
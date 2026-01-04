// ==UserScript==
// @name         Amazon Reviews Exporter for Multiple ASINs
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Export Amazon reviews for multiple ASINs, sorted by star rating, with automatic pagination
// @author       You
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license MIT
// ==/UserScript==
// @require https://update.greasyfork.org/scripts/490561/1347386/Amazon%20Reviews%20Exporter%20for%20Multiple%20ASINs.js
(function() {
    'use strict';

    let asins = [];
    let currentASINIndex = 0;
    let currentStar = 5;
    let allReviews = [];

    function addStartButton() {
        const button = document.createElement('button');
        button.textContent = 'Start Reviews Export';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.onclick = startReviewsExport;
        document.body.appendChild(button);
    }

    function startReviewsExport() {
        const userInput = prompt("Enter ASINs separated by commas (e.g., ASIN1,ASIN2):");
        if (userInput) {
            asins = userInput.split(',').map(asin => asin.trim());
            currentASINIndex = 0;
            allReviews = [];
            processNextASIN();
        }
    }

    function processNextASIN() {
        if (currentASINIndex < asins.length) {
            currentStar = 5;
            processStarRating(asins[currentASINIndex]);
        } else {
            exportToExcel(allReviews);
        }
    }

    function processStarRating(asin) {
        if (currentStar >= 1) {
            let pageNumber = 1;
            const reviewPageUrl = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_getr_d_paging_btm_next_3?ie=UTF8&reviewerType=all_reviews&sortBy=recent&pageNumber=${pageNumber}&filterByStar=${currentStar}_star`;
            fetchAndProcessReviews(reviewPageUrl, pageNumber, asin);
        } else {
            currentASINIndex++;
            processNextASIN();
        }
    }

    function fetchAndProcessReviews(url, pageNumber, asin) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const reviews = doc.querySelectorAll('.review');
                if (reviews.length > 0) {
                    reviews.forEach(review => {
                        const reviewText = review.querySelector('.review-text').textContent.trim();
                        allReviews.push({ ASIN: asin, star: currentStar, text: reviewText });
                    });
                    pageNumber++;
                    const nextPageUrl = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_getr_d_paging_btm_next_3?ie=UTF8&reviewerType=all_reviews&sortBy=recent&pageNumber=${pageNumber}&filterByStar=${currentStar}_star`;
                    fetchAndProcessReviews(nextPageUrl, pageNumber, asin);
                } else {
                    currentStar--;
                    processStarRating(asin);
                }
            }
        });
    }

    function exportToExcel(reviews) {
        const worksheet = XLSX.utils.json_to_sheet(reviews);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
        XLSX.writeFile(workbook, 'Amazon_Reviews.xlsx');
    }

    addStartButton();
})();

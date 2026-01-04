// ==UserScript==
// @name         测试批量导出评论
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Export Amazon reviews for multiple ASINs, sorted by star rating, with automatic pagination
// @author       You
// @match        https://www.amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/490800/%E6%B5%8B%E8%AF%95%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/490800/%E6%B5%8B%E8%AF%95%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

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
        const userInput = prompt("Enter ASINs separated by commas or spaces (e.g., ASIN1, ASIN2):");
        if (userInput) {
            asins = userInput.split(/[,\s]+/).map(asin => asin.trim());
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
                        const reviewId = review.getAttribute('id'); // Get review ID
                        const reviewText = review.querySelector('.review-text').textContent.trim();
                        // Check if the review with this ID already exists
                        if (!allReviews.some(item => item.reviewId === reviewId)) {
                            allReviews.push({ ASIN: asin, star: currentStar, reviewId: reviewId, text: reviewText });
                        }
                    });
                    pageNumber++;
                    const nextPageUrl = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_getr_d_paging_btm_next_3?ie=UTF8&reviewerType=all_reviews&sortBy=recent&pageNumber=${pageNumber}&filterByStar=${currentStar}_star`;
                    fetchAndProcessReviews(nextPageUrl, pageNumber, asin);
                } else {
                    // No reviews for this star rating, move to the next star
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
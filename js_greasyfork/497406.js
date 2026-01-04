// ==UserScript==
// @name         Booksy Reviews Scraper to JSON
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Scrape Booksy reviews and copy to clipboard in JSON format with UI button(s)
// @author       sharmanhall
// @match        https://booksy.com/en-us/*
// @match        *://booksy.com/en-us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=booksy.com
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497406/Booksy%20Reviews%20Scraper%20to%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/497406/Booksy%20Reviews%20Scraper%20to%20JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function scrapeReviews() {
        return new Promise((resolve) => {
            const reviews = [];
            const reviewsSection = document.querySelector("#reviews-section");

            if (!reviewsSection) {
                console.log("Reviews section not found.");
                resolve(reviews);
                return;
            }

            const reviewItems = reviewsSection.querySelectorAll('[data-testid="review-item"]');

            reviewItems.forEach((reviewElement, index) => {
                try {
                    const reviewerNameElement = reviewElement.querySelector('div[class*="purify_E9KQOPWS1B+V9XvpZovy8A"] span[class*="purify_HRlYZ9s5U73L+xgNWotErg"]');
                    const reviewDateElement = reviewElement.querySelector('div[class*="purify_E9KQOPWS1B+V9XvpZovy8A"] span[class*="purify_VsjLagY8Ojq+9Ze+lWDQGQ"]');
                    const reviewContentElement = reviewElement.querySelector('div[class*="purify_1KV69VGQK1FO5206zDXt6w"] span');
                    const serviceElements = reviewElement.querySelectorAll('[data-testid="review-service"]');
                    const stafferElement = reviewElement.querySelector('[data-testid="review-staffer"]');
                    const starRatingElements = reviewElement.querySelectorAll('div[class*="purify_Qoav5NuXv0ym9cfxyao4Ig"]');
                    const replyElement = reviewElement.querySelector('[data-testid="review-reply"]');
                    const verifiedElement = reviewElement.querySelector('[data-testid="verified-badge"]');

                    if (!reviewerNameElement || !reviewDateElement || !reviewContentElement || !starRatingElements) {
                        console.log(`Missing data in review ${index + 1}`);
                        return;
                    }

                    const reviewerName = reviewerNameElement.innerText.trim().replace(' •', '');
                    const reviewDate = reviewDateElement.innerText.trim();
                    const starRating = starRatingElements.length;
                    const reviewContent = reviewContentElement.innerText.trim();
                    const verified = verifiedElement !== null;

                    let services = [];
                    serviceElements.forEach(serviceElement => {
                        services.push(serviceElement.innerText.trim());
                    });

                    let reply = null;

                    if (replyElement) {
                        const replyDateElement = replyElement.querySelector('span[class*="purify_FD6WbUSz3rkoW+C9e7kZ8A"]');
                        const replyContentElement = replyElement.querySelector('div[class*="purify_XhJpX0ckn22M3YvadX5CmQ"]');
                        const replyFromElement = replyElement.querySelector('div[class*="purify_GPF4-5C5H8PSMkYNQiwwzA"]');

                        if (replyDateElement && replyContentElement && replyFromElement) {
                            const replyDate = replyDateElement.innerText.trim();
                            const replyContent = replyContentElement.innerText.trim();
                            const replyFrom = replyFromElement.innerText.trim();
                            reply = {
                                reply_date: replyDate,
                                reply_content: replyContent,
                                reply_from: replyFrom
                            };
                        } else {
                            console.log(`Missing reply data in review ${index + 1}`);
                        }
                    }

                    const review = {
                        reviewer_name: reviewerName,
                        img_url: "", // Could not find image URL in the given structure
                        review_date: reviewDate,
                        star_rating: starRating,
                        review_url: "", // No review URL in the given structure
                        review_content: reviewContent,
                        services: services.join(', '),
                        staffer: stafferElement ? stafferElement.innerText.trim() : '',
                        verified: verified,
                        reply: reply
                    };

                    reviews.push(review);
                } catch (error) {
                    console.log(`Error processing review ${index + 1}:`, error);
                }
            });

            resolve(reviews);
        });
    }

    async function scrapeAllReviews() {
        let allReviews = [];
        let currentPage = 1;
        let totalPages = document.querySelectorAll('#reviews-section > div.purify_LmECaSkpXh8qi\\+Leh32tdw\\=\\=.purify_JUl\\+sl0GnJSkGuqya\\+I4uQ\\=\\= > ul > li').length - 2; // Subtracting 2 for previous and next buttons

        while (currentPage <= totalPages) {
            const pageReviews = await scrapeReviews();
            allReviews = allReviews.concat(pageReviews);

            if (currentPage < totalPages) {
                const nextPageButton = document.querySelector(`#reviews-section > div.purify_LmECaSkpXh8qi\\+Leh32tdw\\=\\=.purify_JUl\\+sl0GnJSkGuqya\\+I4uQ\\=\\= > ul > li:nth-child(${currentPage + 2})`);
                nextPageButton.click();
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds for the next page to load
            }

            currentPage++;
        }

        const reviewsJson = JSON.stringify({ Reviews: allReviews }, null, 2);
        console.log(reviewsJson);
        displayReviews(reviewsJson);
        copyToClipboard(reviewsJson, allReviews.length);
    }

    function displayReviews(reviewsJson) {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '80px';
        container.style.left = '20px';
        container.style.backgroundColor = '#fff';
        container.style.padding = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        container.style.maxHeight = '50vh';
        container.style.overflowY = 'scroll';
        container.style.zIndex = '1000';
        container.innerText = reviewsJson;
        document.body.appendChild(container);
    }

    function copyToClipboard(text, reviewCount) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert(`${reviewCount} reviews copied to clipboard`);
    }

    function addButton(text, bottom, onClick) {
        const button = document.createElement('button');
        button.innerHTML = `<span style="font-size: 16px; font-weight: bold; color: #fff;">${text}</span>`;
        button.type = 'button';
        button.style.position = 'fixed';
        button.style.bottom = bottom;
        button.style.left = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#00A3AD';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';
        button.onclick = onClick;
        document.body.appendChild(button);
    }

    // Wait for the page to load completely
    window.addEventListener('load', () => {
        console.log("Page loaded. Adding buttons.");
        addButton('Copy Reviews', '50px', async () => {
            const reviews = await scrapeReviews();
            const reviewsJson = JSON.stringify({ Reviews: reviews }, null, 2);
            displayReviews(reviewsJson);
            copyToClipboard(reviewsJson, reviews.length);
        });
        addButton('Copy All Reviews (TODO FIX)', '10px', scrapeAllReviews); // Changed button text to indicate TODO
    });

    // TODO: Fix pagination issue to scrape all pages of reviews correctly.
})();

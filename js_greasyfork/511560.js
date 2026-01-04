// ==UserScript==
// @name         Find Earliest Next Review for Level 8 Kanji and Vocabulary
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Time of Next Master Review
// @author       Matskye
// @match        https://marumori.io/*
// @grant        GM.xmlHttpRequest
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/511560/Find%20Earliest%20Next%20Review%20for%20Level%208%20Kanji%20and%20Vocabulary.user.js
// @updateURL https://update.greasyfork.org/scripts/511560/Find%20Earliest%20Next%20Review%20for%20Level%208%20Kanji%20and%20Vocabulary.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const API_URL = 'https://public-api.marumori.io/srs/reviews';
    const ACCESS_TOKEN = '<your_token_here>'; // Replace with your actual token
    const THROTTLE_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
    const LAST_API_CALL_KEY = 'lastApiCallTimestamp';
    const LAST_REVIEW_DATA_KEY = 'lastReviewData';

    // Time windows for checking nextReview dates (now, 1 - 4 months)
    const timeWindows = [0, 30, 60, 90, 120];

    function getReviews(maxNextReview) {
        return new Promise((resolve, reject) => {
            const url = `${API_URL}?min-level=8&max-level=8&max-nextReview=${maxNextReview}`;
            GM.xmlHttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 400) {
                        const data = JSON.parse(response.responseText);
                        console.log('Filtered API response for level 8:', data);
                        resolve(data.reviews);
                    } else {
                        reject(`Error fetching reviews: ${response.status}`);
                    }
                },
                onerror: function() {
                    reject('Network error');
                }
            });
        });
    }

    async function fetchAllReviews() {
        for (let days of timeWindows) {
            const maxNextReviewDate = new Date();
            maxNextReviewDate.setDate(maxNextReviewDate.getDate() + days);
            console.log(`Fetching reviews with max-nextReview = ${maxNextReviewDate.toISOString()}`);
            const reviews = await getReviews(maxNextReviewDate.toISOString());

            // If we find reviews, return them
            if (reviews && reviews.length > 0) {
                return reviews;
            }
        }

        // No reviews found in any time window
        return [];
    }

function displayReviewTime(reviews) {
    const nowDate = new Date();
    let earliestItem = reviews.reduce((earliest, currentItem) => {
        return (currentItem.progress.nextReview < earliest.progress.nextReview) ? currentItem : earliest;
    }, reviews[0]);

    const nextReviewTime = new Date(earliestItem.progress.nextReview);
    const timeDiff = nextReviewTime - nowDate;

    let timeText = '';
    if (timeDiff <= 0) {
        timeText = 'Master reviews available now!';
    } else {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        timeText = `Next master review in ${days}d ${hours}h ${minutes}m`;
    }

    const targetSelector = '.level h5.svelte-1r9v3rw';

    function tryInsertText() {
        const expertElement = [...document.querySelectorAll(targetSelector)].find(el => el.textContent.trim() === 'expert');

        if (expertElement) {
            const targetContainer = expertElement.parentNode; // Get the parent element of the "expert" header
            const messageElement = document.createElement('p');
            messageElement.textContent = timeText;
            messageElement.style.color = 'green';
            messageElement.style.marginLeft = '10px'; // Adjust the position if needed
            targetContainer.appendChild(messageElement);
            observer.disconnect(); // Stop observing once we have inserted the text
        } else {
            console.error("Target element not found!");
        }
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations, observer) => {
        tryInsertText();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Try inserting immediately in case the element is already available
    tryInsertText();
}

    async function findEarliestReview() {
        try {
            const now = Date.now();
            const lastApiCall = localStorage.getItem(LAST_API_CALL_KEY);
            const lastReviewData = localStorage.getItem(LAST_REVIEW_DATA_KEY);

            // If there's cached data and it's within the throttle interval, display the cached data
            if (lastApiCall && (now - lastApiCall < THROTTLE_INTERVAL) && lastReviewData) {
                console.log('Using cached data for review time.');
                const cachedReviews = JSON.parse(lastReviewData);
                displayReviewTime(cachedReviews);
                return;
            }

            // If enough time has passed, proceed with the API call
            const reviews = await fetchAllReviews();
            if (!reviews || reviews.length === 0) {
                console.error("No level 8 reviews found");
                return;
            }

            localStorage.setItem(LAST_API_CALL_KEY, now); // Store the timestamp of the current API call
            localStorage.setItem(LAST_REVIEW_DATA_KEY, JSON.stringify(reviews)); // Store the reviews in localStorage

            displayReviewTime(reviews);

        } catch (error) {
            console.error(error);
        }
    }

    findEarliestReview();

})();

// ==UserScript==
// @name         Simkl Letterboxd Reviews with Full Review Links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show up to 20 Letterboxd reviews with faster loading and clickable reviewer names that link to full reviews on Letterboxd.com.
// @author       YourName
// @match        https://simkl.com/movies/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/523211/Simkl%20Letterboxd%20Reviews%20with%20Full%20Review%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/523211/Simkl%20Letterboxd%20Reviews%20with%20Full%20Review%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxReviews = 20; // Limit the number of reviews to 20

    function fetchMovieUrlAndReviews(callback) {
        try {
            let tmdbUrlElement = document.querySelector('a[href*="themoviedb.org/movie/"]');

            if (!tmdbUrlElement || !tmdbUrlElement.href) {
                console.log("TMDB URL not found or malformed on Simkl page.");
                return;
            }

            let tmdbUrl = tmdbUrlElement.href;
            let tmdbIdMatch = tmdbUrl.match(/\/movie\/(\d+)/);

            if (!tmdbIdMatch || !tmdbIdMatch[1]) {
                console.log("TMDB ID could not be extracted from URL.");
                return;
            }

            let tmdbId = tmdbIdMatch[1]; // Extract TMDB ID from the URL
            console.log("Extracted TMDB ID: " + tmdbId);

            // 1. Fetch the Letterboxd page URL using TMDB ID
            let letterboxdUrl = `https://letterboxd.com/tmdb/${tmdbId}`;
            console.log("Fetching base Letterboxd URL: " + letterboxdUrl);

            GM_xmlhttpRequest({
                method: "GET",
                url: letterboxdUrl,
                onload: function (response) {
                    console.log("Received response from Letterboxd base URL with status: " + response.status);
                    if (response.status === 200) {
                        let redirectedUrl = response.finalUrl;
                        console.log("Redirected to actual movie page: " + redirectedUrl);

                        callback(redirectedUrl);
                    } else {
                        console.log("Failed to fetch Letterboxd base URL, status code: " + response.status);
                    }
                },
                onerror: function () {
                    console.log("Error while fetching Letterboxd base URL.");
                }
            });
        } catch (error) {
            console.error("An error occurred while processing the script: ", error);
        }
    }

    // Fetch reviews for a specific page asynchronously
    function fetchReviewsFromUrl(reviewsUrl, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: reviewsUrl,
            onload: function (response) {
                console.log("Received response from Letterboxd with status: " + response.status);
                if (response.status === 200) {
                    let parser = new DOMParser();
                    let reviewDoc = parser.parseFromString(response.responseText, "text/html");

                    // Extract reviews, usernames, profile pictures, review URLs, and ratings
                    let reviews = [];
                    let reviewElements = reviewDoc.querySelectorAll('li.film-detail');

                    reviewElements.forEach((reviewEl) => {
                        let reviewParagraphs = reviewEl.querySelectorAll('div.body-text p');
                        let reviewContent = Array.from(reviewParagraphs).map(p => p.textContent.trim()).join(' ');

                        let username = reviewEl.querySelector('a.context strong.name')?.textContent;
                        let profileImageUrl = reviewEl.querySelector('a.avatar img')?.src;
                        let rating = reviewEl.querySelector('span.rating')?.textContent;
                        let reviewUrl = reviewEl.querySelector('a.context')?.getAttribute('href'); // Extract review URL

                        if (reviewContent.trim() && username && profileImageUrl && reviewUrl) {
                            reviews.push({
                                content: reviewContent.trim(),
                                username: username,
                                profileImageUrl: profileImageUrl,
                                rating: rating || 'N/A', // If no rating is found, display 'N/A'
                                reviewUrl: `https://letterboxd.com${reviewUrl}` // Prepend the base Letterboxd URL to the relative path
                            });
                        }
                    });

                    callback(reviews);
                } else {
                    console.log("Failed to fetch reviews from Letterboxd, status code: " + response.status);
                }
            },
            onerror: function () {
                console.log("Error while fetching Letterboxd reviews.");
            }
        });
    }

    // Function to inject reviews into the Simkl page
    function injectReviewsIntoSimkl(reviews) {
        let targetElement = document.querySelector('#tvShowCommentsBlock'); // Target the reactions/comments section

        if (targetElement && reviews.length > 0) {
            let reviewSection = $('#letterboxd-reviews');
            if (!reviewSection.length) {
                reviewSection = $('<div id="letterboxd-reviews"><h3 style="color:white;">Letterboxd Reviews</h3></div>');
                $(targetElement).append(reviewSection);
            }

            reviews.forEach((review) => {
                let reviewHtml = `
                    <div class="review" style="border: 1px solid #444; padding: 10px; margin: 10px 0; border-radius: 5px; background-color: #2e2e2e; color: white;">
                        <div style="display: flex; align-items: center;">
                            <img src="${review.profileImageUrl}" alt="Profile picture" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                            <p><strong><a href="${review.reviewUrl}" target="_blank" style="color:white;">${review.username}</a></strong></p> <!-- Make username clickable with link -->
                        </div>
                        <p>${review.content}</p>
                        <p style="font-weight: bold;">Rating: ${review.rating}</p>
                    </div>
                `;
                reviewSection.append(reviewHtml);
            });
        } else {
            console.log("No reviews to display or target element not found.");
        }
    }

    // Fetch reviews in parallel and inject as they load
    function loadReviewsFaster(baseUrl) {
        const pagesToFetch = Math.ceil(maxReviews / 10);
        let totalReviews = [];

        for (let page = 1; page <= pagesToFetch; page++) {
            const reviewsUrl = `${baseUrl}reviews/by/activity${page > 1 ? `/page/${page}` : ''}`;
            console.log("Fetching reviews from: " + reviewsUrl);

            fetchReviewsFromUrl(reviewsUrl, (reviews) => {
                totalReviews = totalReviews.concat(reviews);
                if (totalReviews.length >= maxReviews) {
                    injectReviewsIntoSimkl(totalReviews.slice(0, maxReviews)); // Ensure no more than 20 reviews
                } else {
                    injectReviewsIntoSimkl(totalReviews); // Inject as soon as some are available
                }
            });
        }
    }

    // Start fetching the movie URL and reviews with faster parallel loading
    fetchMovieUrlAndReviews(loadReviewsFaster);

})();

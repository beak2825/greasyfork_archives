// ==UserScript==
// @name         MAL Enhancements
// @namespace    https://greasyfork.org/en/users/957127-supertouch
// @version      1.4
// @description  Enhancements for MyAnimeList: Restore old rating display, fix reviews, add a toggle for new reviews, and fix event listeners
// @author       SuperTouch
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/reviews*
// @icon         https://cdn.myanimelist.net/images/favicon.ico
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474390/MAL%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/474390/MAL%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isAiring() {
        const statusDivs = Array.from(document.querySelectorAll('.spaceit_pad > span.dark_text')).filter(div => div.textContent.includes('Status:'));

        if (statusDivs.length > 0) {
            const statusText = statusDivs[0].nextSibling.textContent.trim();
            return !statusText.toLowerCase().includes('finished');
        }
    }

    function updateRatingDisplay(reviewEl) {
        const tags = reviewEl.querySelector('.tags');
        const existingRatingElement = tags.querySelector('.floatRightHeader');
        if (!existingRatingElement) {
            const rating = reviewEl.querySelector('.rating > .num').textContent;
            const ratingElement = createRatingElement(rating);
            tags.appendChild(ratingElement);
        }
    }

    function createRatingElement(rating) {
        let html = `<div class="floatRightHeader"><a href="javascript:void(0);">Overall Rating</a>: ${rating}</div>`;
        let template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function attachEventListeners(reviewEl) {
        const readMoreButton = reviewEl.querySelector('.js-readmore');
        const showLessButton = reviewEl.querySelector('.js-showless');
        const popupMenuButton = reviewEl.querySelector('.js-btn-popup');

        const iconReactionPlaceholder = reviewEl.querySelector('.js-icon-reaction');
        // Hide it for now and shift elements
        iconReactionPlaceholder.style.display = "none"
        readMoreButton.parentElement.style.marginLeft = "0";
        showLessButton.parentElement.style.marginLeft = "0";

        const toggleContent = (e) => {
            e.preventDefault();
            const parentElement = e.target.parentElement;
            parentElement.style.display = 'none';
            const reviewElement = e.target.closest('.js-review-element');
            reviewElement.querySelectorAll('.js-hidden, .js-visible').forEach(element => {
                if (element.classList.contains('reaction-box') || element.classList.contains('notice')) {
                    element.style.display = element.style.display === 'none' ? '' : 'none';
                } else {
                    element.style.display = element.style.display === 'none' ? 'inline-block' : 'none';
                }
            });
            const oppositeButtonClass = e.target.classList.contains('js-readmore') ? '.showless' : '.readmore';
            const oppositeButton = reviewElement.querySelector(oppositeButtonClass);
            if (oppositeButton) oppositeButton.style.display = 'inline-block';
        };

        const togglePopupMenu = (e) => {
            e.preventDefault();
            const menuBlock = e.currentTarget.nextElementSibling;
            const isHidden = menuBlock.style.display === 'none';
            document.querySelectorAll('.js-menu-block').forEach(block => {
                block.style.display = 'none';
            });
            menuBlock.style.display = isHidden ? 'block' : 'none';
        };

        const attachEventListenerOnce = (element, eventName, handler) => {
            if (!element.dataset.listenerAttached) {
                element.addEventListener(eventName, handler);
                element.dataset.listenerAttached = 'true';
            }
        };

        if (readMoreButton) {
            attachEventListenerOnce(readMoreButton, 'click', toggleContent);
        }

        if (showLessButton) {
            attachEventListenerOnce(showLessButton, 'click', toggleContent);
        }

        if (popupMenuButton) {
            attachEventListenerOnce(popupMenuButton, 'click', togglePopupMenu);
        }
    }

    const reviews = document.querySelectorAll('.review-element');
    reviews.forEach(updateRatingDisplay);
    console.log("[Mal Enhancements] Added overall ratings")

    const reviewsHeading = document.querySelector('.detail-characters-list ~ h2');
    if (!reviewsHeading) return;

    const toggleHtml = `
        <div class="toggle-container">
            <label for="toggle_new_reviews">Show suggested reviews</label>
            <input type="checkbox" id="toggle_new_reviews" name="toggle_new_reviews">
        </div>`;
    reviewsHeading.style.display = "flex";
    reviewsHeading.style.alignItems = "center";
    reviewsHeading.style.justifyContent = "space-between";
    reviewsHeading.insertAdjacentHTML('beforeend', toggleHtml);

    const toggleNewReviews = document.getElementById('toggle_new_reviews');
    if (!toggleNewReviews) return;

    const savedState = GM_getValue('toggle_new_reviews_state');
    if (savedState !== null) {
        toggleNewReviews.checked = savedState;
    }

    const reviewsHeaderLink = document.querySelector('div[class*="-info-review__header"] > div.right > a');
    console.log("[Mal Enhancements] Found full link for reviews", reviewsHeaderLink)
    if (!reviewsHeaderLink) return;

    const reviewsURL = reviewsHeaderLink.href;
    let originalReviews = [];
    let newReviewsCache = null;

    const updateReviews = async () => {
        if (!newReviewsCache) {
            try {
                const response = await fetch(`${reviewsURL}${isAiring() ? '': '?preliminary=off'}`);
                const responseText = await response.text();
                const parser = new DOMParser();
                const responseDoc = parser.parseFromString(responseText, 'text/html');
                newReviewsCache = responseDoc.querySelectorAll('.review-element');
            } catch (error) {
                console.error('Error fetching reviews:', error);
                return;
            }
        }

        const currentReviews = document.querySelectorAll('.review-element');

        if (toggleNewReviews.checked) {
            originalReviews = Array.from(currentReviews);
            for (let i = 0; i < 3 && i < newReviewsCache.length && i < currentReviews.length; i++) {
                currentReviews[i].replaceWith(newReviewsCache[i]);
                updateRatingDisplay(newReviewsCache[i]);
                attachEventListeners(newReviewsCache[i]);
            }
        } else {
            for (let i = 0; i < 3 && i < originalReviews.length && i < currentReviews.length; i++) {
                currentReviews[i].replaceWith(originalReviews[i]);
                updateRatingDisplay(originalReviews[i]);
            }
        }

        GM_setValue('toggle_new_reviews_state', toggleNewReviews.checked);
    };


    toggleNewReviews.addEventListener('change', updateReviews);

    updateReviews();
})();

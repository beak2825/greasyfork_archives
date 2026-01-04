// ==UserScript==
// @name         Prolific Researcher Rating
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Rate researchers from 1 to 5 stars
// @author       You
// @match        https://app.prolific.com/*
// @grant        MIT
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/543713/Prolific%20Researcher%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/543713/Prolific%20Researcher%20Rating.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create star element with real-time visual feedback
    function createStar(currentRating, starIndex, name, container) {
        const star = document.createElement('span');
        star.textContent = starIndex <= currentRating ? '★' : '☆';
        star.style.cursor = 'pointer';
        star.style.color = starIndex <= currentRating ? 'gold' : 'gray';
        star.style.fontSize = '16px';
        star.style.padding = '0 1px';

        star.addEventListener('click', () => {
            // Save new rating and update stars instantly
            localStorage.setItem('researcher_rating_' + name, starIndex);
            updateStars(container, starIndex, name);
        });

        return star;
    }

    // Update star container
    function updateStars(container, rating, name) {
        container.innerHTML = ''; // Clear existing stars
        for (let i = 1; i <= 5; i++) {
            container.appendChild(createStar(rating, i, name, container));
        }
    }

    // Initialize stars next to each name
    function initStarRatings() {
        const spans = document.querySelectorAll('span[aria-labelledby^="host-name-"]');

        spans.forEach(span => {
            const name = span.textContent.trim().toLowerCase();

            if (span.dataset.starAdded) return; // Avoid duplicates
            span.dataset.starAdded = 'true';

            const savedRating = parseInt(localStorage.getItem('researcher_rating_' + name)) || 0;

            const container = document.createElement('span');
            container.style.marginLeft = '8px';
            container.style.userSelect = 'none';
            updateStars(container, savedRating, name);

            span.insertAdjacentElement('afterend', container);
        });
    }

    // React to dynamic page changes
    function observeDOMChanges() {
        initStarRatings();
        const observer = new MutationObserver(() => {
            initStarRatings();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    observeDOMChanges();
})();

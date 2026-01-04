// ==UserScript==
// @name         RateYourMusic: average track rating
// @namespace    http://tampermonkey.net/
// @version      2025-08-03
// @description  Some fun extra info for album pages.
// @author       You
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543350/RateYourMusic%3A%20average%20track%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/543350/RateYourMusic%3A%20average%20track%20rating.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        console.log("RYM script is running...");

        let lastKnownRatings = [];

        function getCurrentRatings() {
            return Array.from(document.querySelectorAll('.rating_num'))
                .slice(1)
                .map(el => parseFloat(el.textContent.trim()))
                .filter(n => !isNaN(n));
        }

        function ratingsChanged(newRatings) {
            return (newRatings.length !== lastKnownRatings.length ||
                newRatings.some((val, i) => val !== lastKnownRatings[i]));
        }

        function updateAvgRating() {
            const ratings = getCurrentRatings();
            if (!ratingsChanged(ratings))
                return;

            lastKnownRatings = ratings;
            if (ratings.length === 0)
                return;

            const total = ratings.reduce((sum, n) => sum + n, 0);
            const avg = (total / ratings.length).toFixed(2);

            console.log("Updated average rating:", avg);

            const existing = document.getElementById('average-rating-display');
            if (existing)
                existing.remove();

            const display = document.createElement('div');
            display.id = 'average-rating-display';
            display.style.fontWeight = 'bold';
            display.style.fontSize = '1.5em';
            display.style.marginTop = '0.15em';
            display.style.marginBottom = '0.3em';
            display.style.display = 'inherit';
            display.style.maxWidth = '500px';
            display.style.textAlign = "center";

            const label = document.createElement('div');
            label.textContent = "Average Track Rating";
            label.style.textDecoration = "underline";
            display.appendChild(label);

            const scoreLine = document.createElement('div');
            scoreLine.style.marginBottom = '0.3em';
            scoreLine.style.marginTop = '0.6em';

            const avgDisplay = document.createElement("span");
            avgDisplay.textContent = (avg);
            avgDisplay.style.fontSize = '2.5em';
            avgDisplay.style.color = "navy";
            avgDisplay.style.padding = "0 0.35em";
            avgDisplay.style.backgroundColor = "cyan";
            avgDisplay.style.borderRadius = "30% 0";

            scoreLine.appendChild(avgDisplay);
            display.appendChild(scoreLine);

            const tracklist = document.querySelector('#my_track_ratings');
            if (tracklist) {
                tracklist.insertBefore(display, tracklist.firstChild);
            }
        }

        updateAvgRating();

        const ratingsContainer = document.querySelector('#my_track_ratings');

        ratingsContainer.addEventListener("click", (event) => {
            updateAvgRating();
        });
    })
})();
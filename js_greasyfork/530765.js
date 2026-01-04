// ==UserScript==
// @name         F95Zone Hide Low Rated Games
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Hide low-rated games on F95Zone.
// @author       mty
// @match        https://f95zone.to/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530765/F95Zone%20Hide%20Low%20Rated%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/530765/F95Zone%20Hide%20Low%20Rated%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ratingThreshold = 3.5;

    function updateGameVisibility() {
        document.querySelectorAll('.resource-tile').forEach(tile => {
            const ratingElem = tile.querySelector('.resource-tile_info-meta_rating');
            if (ratingElem) {
                const rating = parseFloat(ratingElem.textContent.trim());
                tile.style.display = (!isNaN(rating) && rating < ratingThreshold) ? 'none' : '';
            }
        });
    }

    const observer = new MutationObserver(updateGameVisibility);
    observer.observe(document.body, { childList: true, subtree: true });

    function insertRatingThresholdBlock() {
        if (document.getElementById('filter-block_rating-threshold')) return;
        const dateSlider = document.getElementById('filter-block_date-filter');
        if (!dateSlider) return;

        const block = document.createElement('div');
        block.id = 'filter-block_rating-threshold';
        block.className = 'range-slider_wrap filter-block';
        block.innerHTML = `
            <h4 class="filter-block_title">Rating Threshold</h4>
            <div id="filter-rating_value" class="range-slider_value">${ratingThreshold.toFixed(1)}</div>
            <div id="filter-rating" class="range-slider_bar noUi-target noUi-horizontal"></div>
        `;
        dateSlider.insertAdjacentElement('afterend', block);

        initRatingSlider();
    }

    function initRatingSlider() {
        const sliderElem = document.getElementById('filter-rating');
        if (!sliderElem || sliderElem.noUiSlider || typeof window.noUiSlider === 'undefined') return;

        window.noUiSlider.create(sliderElem, {
            start: [ratingThreshold],
            connect: [true, false],
            range: { min: 0, max: 5 },
            step: 0.1,
            format: {
                to: value => parseFloat(value).toFixed(1),
                from: value => parseFloat(value)
            }
        });

        sliderElem.noUiSlider.on('update', values => {
            ratingThreshold = parseFloat(values[0]);
            document.getElementById('filter-rating_value').textContent = ratingThreshold.toFixed(1);
            updateGameVisibility();
        });
    }

    function initScript() {
        insertRatingThresholdBlock();
        updateGameVisibility();
    }

    setInterval(initScript, 100);

})();

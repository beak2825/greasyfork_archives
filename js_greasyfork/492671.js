// ==UserScript==
// @name         Спойлер для отзывов в LZTMARKET
// @namespace    Wi33y | https://zelenka.guru/p_gr/
// @version      1.0
// @description  Спойлер для отзывов в LZT.MARKET
// @author       Wi33y | https://zelenka.guru/p_gr/
// @match        https://lzt.market/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492671/%D0%A1%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D0%BE%D0%B2%20%D0%B2%20LZTMARKET.user.js
// @updateURL https://update.greasyfork.org/scripts/492671/%D0%A1%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%20%D0%B4%D0%BB%D1%8F%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D0%BE%D0%B2%20%D0%B2%20LZTMARKET.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a function to add spoilers
    function addSpoilers() {
        // Select the reviews section
        var reviewsSection = document.querySelector('.market_block_reviews');

        if (reviewsSection) {
            // localStorage
            var spoilerState = localStorage.getItem('spoilerState');

            // Create a spoiler
            var spoilerContainer = document.createElement('div');
            spoilerContainer.classList.add('spoiler-container');

            // Create a button 
            var spoilerButton = document.createElement('button');
            spoilerButton.classList.add('spoiler-btn', 'button', 'bbCodeSpoilerButton');
            spoilerButton.textContent = spoilerState === 'open' ? 'Скрыть отзывы' : 'Показать отзывы';
            spoilerButton.style.padding = '0 20px 0 12px';
            spoilerButton.style.textAlign = 'inherit';
            spoilerButton.style.width = '100%';
            spoilerButton.style.wordBreak = 'break-all';
            spoilerButton.style.overflow = 'hidden';
            spoilerButton.style.textOverflow = 'ellipsis';
            spoilerButton.style.background = 'rgb(45, 45, 45)';

            spoilerContainer.appendChild(spoilerButton);

            var reviewsContainer = document.createElement('div');
            reviewsContainer.classList.add('reviews-content');
            reviewsContainer.style.overflow = 'hidden';
            reviewsContainer.style.transition = 'max-height 0.5s ease-in-out';
            reviewsContainer.style.maxHeight = spoilerState === 'open' ? 'none' : '0px';
            reviewsContainer.appendChild(reviewsSection.cloneNode(true));
            spoilerContainer.appendChild(reviewsContainer);

            reviewsSection.parentNode.replaceChild(spoilerContainer, reviewsSection);
        }
    }
    addSpoilers();

    document.querySelectorAll('.spoiler-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var reviewsContainer = this.nextElementSibling;
            if (reviewsContainer.style.maxHeight === '0px') {
                reviewsContainer.style.maxHeight = reviewsContainer.scrollHeight + 'px';
                this.textContent = 'Скрыть отзывы';
                localStorage.setItem('spoilerState', 'open');
            } else {
                reviewsContainer.style.maxHeight = '0px';
                this.textContent = 'Показать отзывы';
                localStorage.setItem('spoilerState', 'closed');
            }
        });
    });
})();

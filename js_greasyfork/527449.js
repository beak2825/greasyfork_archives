// ==UserScript==
// @name         SellAsist - Przeniesienie oceny Allegro na karcie zamówienia
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Przenosi pełne pole oceny klienta Allegro pod status zamówienia
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/527449/SellAsist%20-%20Przeniesienie%20oceny%20Allegro%20na%20karcie%20zam%C3%B3wienia.user.js
// @updateURL https://update.greasyfork.org/scripts/527449/SellAsist%20-%20Przeniesienie%20oceny%20Allegro%20na%20karcie%20zam%C3%B3wienia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function moveRating() {
        const ratingButton = Array.from(document.querySelectorAll('.m-panel-section-heading__title')).find(el =>
            el.textContent.trim().includes('Ocena klienta z allegro')
        );
        console.log('Znaleziony przycisk oceny:', ratingButton);
        if (ratingButton) {
            const observer = new MutationObserver((mutations, obs) => {
                const ratingWrapper = document.querySelector('.allegro-rating-rate-wrapper');
                const noRatingContent = document.querySelector('.content p[style*="text-align: center"]');
                console.log('Szukam wrappera oceny lub informacji o braku opinii:', ratingWrapper || noRatingContent);
                if (ratingWrapper || noRatingContent) {
                    const fullRatingSection = (ratingWrapper || noRatingContent).closest('.content');
                    const targetElement = document.querySelector('.m-order-change-status__wrapper');
                    if (fullRatingSection && targetElement) {
                        const newContainer = document.createElement('div');
                        newContainer.style.cssText = `
                            margin-top: 15px;
                            background-color: #ffffff;
                            border-radius: 4px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            width: 100%;
                        `;
                        newContainer.appendChild(fullRatingSection);
                        targetElement.parentNode.insertBefore(newContainer, targetElement.nextSibling);
                        console.log('Panel przeniesiony pomyślnie!');
                        obs.disconnect();
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            ratingButton.click();
        }
    }
    setTimeout(moveRating, 100);
})();
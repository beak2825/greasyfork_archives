// ==UserScript==
// @name         Interfood.hu Kép Megjelenítő
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script beágyazza a képeket az ételek fölé, nem kell már hoverelni hogy lássuk a képet.
// @author       Fábián Tamás
// @match        https://rendel.interfood.hu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538695/Interfoodhu%20K%C3%A9p%20Megjelen%C3%ADt%C5%91.user.js
// @updateURL https://update.greasyfork.org/scripts/538695/Interfoodhu%20K%C3%A9p%20Megjelen%C3%ADt%C5%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addImages() {
        const foodDivs = document.querySelectorAll('.food[data-menu-item-id]');
        foodDivs.forEach(food => {
            const menuId = food.getAttribute('data-menu-item-id');
            if (!menuId) return;

            // Avoid adding duplicate images
            if (food.querySelector('.interfood-image')) return;

            const img = document.createElement('img');
            img.src = `https://ia.interfood.hu/api/v1/i?menu_item_id=${menuId}`;
            img.alt = 'Ételfotó';
            img.className = 'interfood-image';
            img.style.width = '100%';
            img.style.borderRadius = '8px';
            img.style.marginBottom = '5px';

            const topSection = food.querySelector('.food-top');
            if (topSection) {
                topSection.insertAdjacentElement('beforebegin', img);
            }
        });
    }

    // Wait for dynamic content to load
    const observer = new MutationObserver(() => addImages());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    window.addEventListener('load', () => {
        setTimeout(addImages, 1000);
    });
})();
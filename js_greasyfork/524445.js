// ==UserScript==
// @name         Add Virtupets.net Search Icon to Trading Post Items
// @namespace    https://www.grundos.cafe/
// @version      1.1
// @description  Add icons to trading post items that link to Virtupets search pages
// @author       Heda
// @match        https://www.grundos.cafe/island/tradingpost/*
// @icon         https://virtupets.net/assets/images/vp.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524445/Add%20Virtupetsnet%20Search%20Icon%20to%20Trading%20Post%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/524445/Add%20Virtupetsnet%20Search%20Icon%20to%20Trading%20Post%20Items.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addVPIcon() {
        const tpItems = document.querySelectorAll('.trade-item');
        tpItems.forEach(tradeItem => {
            if (tradeItem.querySelector('.vp-icon')) return;
            const itemInfo = tradeItem.querySelector('.item-info span');
            const itemImage = tradeItem.querySelector('a > img');
            if (!itemInfo || !itemImage) return;
            const itemName = itemInfo.textContent.trim();
            const icon = document.createElement('img');
            icon.src = 'https://virtupets.net/assets/images/vp.png';
            icon.alt = 'Search Virtupets';
            icon.style.width = '25px';
            icon.style.height = '25px';
            icon.style.cursor = 'pointer';
            icon.style.marginRight = '8px';
            icon.classList.add('vp-icon');
            icon.addEventListener('click', () => {
                const searchUrl = `https://virtupets.net/search?q=${encodeURIComponent(itemName)}`;
                window.open(searchUrl, '_blank');
            });
            itemImage.parentElement.insertAdjacentElement('beforebegin', icon);
        });
    }
    window.addEventListener('load', addVPIcon);
})();

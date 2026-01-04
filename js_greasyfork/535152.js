// ==UserScript==
// @name         [GC] - Gallery Searcher
// @namespace    https://greasyfork.org/en/users/1186250-ashyash
// @match        https://www.grundos.cafe/*
// @version      3.8
// @license      MIT
// @author       AshyAsh
// @icon         https://img.icons8.com/?size=100&id=3uUsBYyGd39C&format=png&color=000000
// @description  Quickly search galleries. If you have that item in your own gallery, a notification will tell you at the top. From there, you can view your gallery as a visitor or quickly remove it to lend or sell.
// @downloadURL https://update.greasyfork.org/scripts/535152/%5BGC%5D%20-%20Gallery%20Searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/535152/%5BGC%5D%20-%20Gallery%20Searcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const iconUrl = 'https://img.icons8.com/?size=100&id=3uUsBYyGd39C&format=png&color=000000';

    // === 1. Add Market Wizard search icon to item search helpers ===
    document.querySelectorAll('div.searchhelp').forEach(function (div) {
        let item = div.id;
        if (!item || !item.endsWith('-links')) return;

        item = item.trim().replace(/-links$/, '');
        const encodedItem = encodeURIComponent(item).replace(/%20/g, '+');

        const link = document.createElement('a');
        link.href = `https://www.grundos.cafe/market/wizard/?submit=Search&query=${encodedItem}&area=1&search_method=1&min_price=&max_price=`;
        link.target = '_blank';
        link.title = 'Search Advanced Market Wizard';

        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = 'Market Search';
        img.style.cssText = 'width: 20px; height: 20px; margin-left: 4px; vertical-align: middle;';

        link.appendChild(img);
        div.appendChild(link);
    });

    // === 2. Market Wizard page logic ===
    if (window.location.href.includes('/market/wizard/?submit=Search&query=')) {
        window.addEventListener('load', () => {
            const centerDiv = document.querySelector('div.center');
            const galleryKeeper = document.querySelector('#galleryKeeper');
            if (!centerDiv) return;

            // === 2a. Show gallery match messages with two links ===
            const mineBlocks = Array.from(document.querySelectorAll('div.data.sw_mine'));
            if (mineBlocks.length >= 4) {
                const messages = [];
                for (let i = 0; i <= mineBlocks.length - 4; i += 4) {
                    const userLink = mineBlocks[i].querySelector('a');
                    const itemName = mineBlocks[i + 1]?.textContent.trim();
                    const quantity = mineBlocks[i + 2]?.textContent.trim();
                    const galleryName = mineBlocks[i + 3]?.textContent.trim();

                    if (!userLink || !itemName || !quantity || !galleryName) continue;

                    const fullGalleryUrl = userLink.getAttribute('href');
                    const urlObj = new URL(fullGalleryUrl, window.location.origin);
                    const galleryId = urlObj.searchParams.get('gallery_id');
                    const removeUrl = `/gallery/?gallery_id=${galleryId}`;

                    const msg = document.createElement('div');
                    msg.style.cssText = 'margin-top: 1rem; padding: 10px; border: 2px solid #4caf50; border-radius: 6px; background: #e8f5e9; color: #2e7d32; font-size: 16px; text-align: center;';
                    msg.innerHTML = `
                        🌟 <strong>You have ${quantity} <i>${itemName}</i></strong> in your gallery ${galleryName} <p>
                        <a href="${fullGalleryUrl}" style="color: #1b5e20; font-weight: bold;" target="_blank">view gallery</a> |
                        <a href="${removeUrl}" style="color: #b71c1c; font-weight: bold;" target="_blank">remove from gallery</a>
                    `;
                    messages.push(msg);
                }

                if (messages.length) {
                    messages.forEach(msg => centerDiv.parentNode.insertBefore(msg, centerDiv.nextSibling));
                }
            }

            // === 2b. Clone gallery item and show as styled gallery card ===
            const searchTitle = centerDiv.querySelector('p.mt-1 strong');
            const searchedItem = searchTitle?.textContent?.replace('Searching for ... ', '')?.trim() || '';
            if (!searchedItem || !galleryKeeper) return;

            const galleryItems = Array.from(document.querySelectorAll('.gallery_item'));
            const matches = galleryItems.filter(item => {
                const nameEl = item.querySelector('.gallery-item-name');
                return nameEl && nameEl.textContent.trim().toLowerCase() === searchedItem.toLowerCase();
            });

            if (matches.length > 0) {
                const styledCard = document.createElement('div');
                styledCard.style.cssText = `
                    background: #a5d6a7;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    text-align: center;
                `;

                // clone content
                const matchClone = matches[0].cloneNode(true);
                matchClone.style.margin = 'auto';
                styledCard.appendChild(matchClone);

                // Title above
                const title = document.createElement('div');
                title.innerHTML = `<strong style="font-size: 18px;">This item is in your gallery</strong>`;
                title.style.cssText = 'margin-bottom: 10px; font-weight: bold;';
                styledCard.insertBefore(title, matchClone);

                // Insert above galleryKeeper
                galleryKeeper.parentNode.insertBefore(styledCard, galleryKeeper);
            }
        });
    }
})();
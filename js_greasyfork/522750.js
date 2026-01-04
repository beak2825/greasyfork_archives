// ==UserScript==
// @name         FarmRPG - Meal Timers 2.0
// @namespace    duck.wowow
// @version      0.1
// @description  Displays meal timers under the sidebar. Visit the home page after eating meals to get timestamps.
// @author       Odung
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/luxon@3.3.0/build/global/luxon.min.js
// @downloadURL https://update.greasyfork.org/scripts/522750/FarmRPG%20-%20Meal%20Timers%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/522750/FarmRPG%20-%20Meal%20Timers%2020.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const sidebarPages = false; // Change to true have item pages open in the sidebar

    const meals = {
        'Breakfast Boost': {image: 'https://farmrpg.com/img/items/eggsandwich.png', url: 'https://farmrpg.com/item.php?id=661'},
        'Cabbage Stew': {image: 'https://farmrpg.com/img/items/greensoup.png', url: 'https://farmrpg.com/item.php?id=781'},
        "Cat's Meow": {image: 'https://farmrpg.com/img/items/fishessensestew.png', url: 'https://farmrpg.com/item.php?id=643'},
        'Crunchy Omelette': {image: 'https://farmrpg.com/img/items/omelet2.png', url: 'https://farmrpg.com/item.php?id=756'},

        'Happy Cookies': {image: 'https://farmrpg.com/img/items/ccookies.png', url: 'https://farmrpg.com/item.php?id=699'},
        'Hickory Omelette': {image: 'https://farmrpg.com/img/items/omelet1.png', url: 'https://farmrpg.com/item.php?id=755'},
        'Lemon Cream Pie': {image: 'https://farmrpg.com/img/items/lemoncreampie.png', url: 'https://farmrpg.com/item.php?id=778'},
        'Lovely Cookies': {image: 'https://farmrpg.com/img/items/lcookies.png', url: 'https://farmrpg.com/item.php?id=716'},

        'Mushroom Stew': {image: 'https://farmrpg.com/img/items/mushroomstew.png', url: 'https://farmrpg.com/item.php?id=634'},
        'Neigh': {image: 'https://farmrpg.com/img/items/vegsoup4.png', url: 'https://farmrpg.com/item.php?id=654'},
        'Onion Soup': {image: 'https://farmrpg.com/img/items/onionsoup.png', url: 'https://farmrpg.com/item.php?id=635'},
        'Over The Moon': {image: 'https://farmrpg.com/img/items/leekmeatcorn.png', url: 'https://farmrpg.com/item.php?id=647'},

        'Quandary Chowder': {image: 'https://farmrpg.com/img/items/corngreens.png', url: 'https://farmrpg.com/item.php?id=644'},
        'Sea Pincher Special': {image: 'https://farmrpg.com/img/items/crabclawsoup.png', url: 'https://farmrpg.com/item.php?id=645'},
        'Shrimp-a-Plenty': {image: 'https://farmrpg.com/img/items/shrimpgreensmix.png', url: 'https://farmrpg.com/item.php?id=646'},
        'Spooky Cookies': {image: 'https://farmrpg.com/img/items/854.png', url: 'https://farmrpg.com/item.php?id=657'},
    }

    async function extractCountdowns(targetNode) {
        const inventoryLink = targetNode.querySelector('a[href="inventory.php"]');
        if (!inventoryLink) {
            setTimeout(() => extractCountdowns(targetNode), 500);
            return;
        }

        const countdownElements = document.querySelectorAll('[data-countdown-to]');
        let countdowns = {};

        countdownElements.forEach((countdown) => {
            const itemInner = countdown.closest('.item-inner');
            const itemTitleElement = itemInner ? itemInner.querySelector('.item-title strong') : null;
            if (itemTitleElement) {
                const itemName = itemTitleElement.innerText.trim();
                const countdownTo = countdown.getAttribute('data-countdown-to');
                if (itemName && countdownTo) {
                    const { DateTime } = luxon;
                    const centralTime = DateTime.fromISO(countdownTo, { zone: 'America/Chicago' });
                    const utcTime = centralTime.toUTC();
                    const utcTimestamp = utcTime.toMillis();
                    countdowns[itemName] = utcTimestamp;
                }
            }
        });

        localStorage.setItem('mealCountdownTimes', JSON.stringify(countdowns));
    }

    function timeRemaining(timestamp) {
        const remainingTime = timestamp - Date.now();
        if (remainingTime < 1) return;

        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        let timeString = '';
        if (days > 0) timeString += `${days}d `;
        if (days > 0 || hours > 0) timeString += `${hours}h `;
        if (days > 0 || hours > 0 || minutes > 0) timeString += `${minutes}m `;
        timeString += `${seconds}s`;

        return timeString.trim();
    }

    function displayTimers() {
        const countdownData = JSON.parse(localStorage.getItem('mealCountdownTimes'));
        if (!countdownData) return;

        const targetElement = document.querySelector('.page > .page-content > .list-block');

        const existingContainer = document.querySelector('.meal-countdown-odung');
        if (existingContainer) existingContainer.remove();

        const countdownContainer = document.createElement('div');
        countdownContainer.classList.add('meal-countdown-odung');
        countdownContainer.style.padding = '4px';
        countdownContainer.style.borderRadius = '5px';
        countdownContainer.style.gap = '10px';
        countdownContainer.style.display = 'flex';

        const countdownElements = {};

        Object.keys(countdownData).forEach((mealName) => {
            const countdownTime = countdownData[mealName];
            const remainingTime = timeRemaining(countdownTime);

            if (!remainingTime) return;
            if (!meals[mealName]) return;

            const countdownElement = document.createElement('div');
            countdownElement.style.marginBottom = '5px';
            countdownElement.style.color = 'white';
            countdownElement.style.fontSize = '14px';
            countdownElement.style.display = 'block';

            const img = document.createElement('img');
            img.src = meals[mealName].image;
            img.alt = mealName;
            img.style.width = '50px';
            img.style.height = 'auto';
            img.style.display = 'block';

            const link = document.createElement('a');
            link.href = meals[mealName].url;
            if (!sidebarPages) link.setAttribute('data-view', '.view-main');

            const textNode = document.createElement('span');
            textNode.textContent = remainingTime;

            link.appendChild(img);
            countdownElement.appendChild(link);
            countdownElement.appendChild(textNode);

            countdownContainer.appendChild(countdownElement);
            countdownElements[mealName] = { textNode, countdownElement };
        });

        targetElement.setAttribute('style', 'margin: 25px 0px 0px 0px;');
        targetElement.appendChild(countdownContainer);

        setInterval(() => {
            Object.keys(countdownData).forEach((mealName) => {
                const countdownTime = countdownData[mealName];
                const remainingTime = timeRemaining(countdownTime);

                const elementData = countdownElements[mealName];
                if (!remainingTime) {
                    if (elementData && elementData.countdownElement) {
                        elementData.countdownElement.remove();
                        delete countdownElements[mealName];
                    }
                } else if (elementData) {
                    elementData.textNode.textContent = remainingTime;
                }
            });
        }, 1000);
    }

    async function observePage() {
        const targetNode = document.querySelector('#fireworks');
        if (!targetNode) {
            setTimeout(observePage, 500);
            return;
        }

        const observer = new MutationObserver(async (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-page') {
                    const currentPage = mutation.target.getAttribute('data-page');

                    if (currentPage === 'index-1') {
                        await extractCountdowns(targetNode);
                        displayTimers();
                    }
                }
            }
        });

        observer.observe(targetNode, { attributes: true });
    }

    function waitForSidebar() {
        const listBlock = document.querySelector('.page > .page-content > .list-block');
        if (!listBlock) {
            setTimeout(waitForSidebar, 500);
            return
        }

        displayTimers();
    }

    observePage();
    waitForSidebar();
})();
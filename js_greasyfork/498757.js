// ==UserScript==
// @name         Roblox Home Page Cleaner
// @namespace    Roblox Recommended and Sponsored remover
// @version      6.1.6
// @description  Roblox Home Page Cleaner lets you toggle Today's Picks on or off. It also gets rid of the Add Friends button and any other random trash Roblox throws on the homepage!
// @author       Krex
// @match        https://*.roblox.com/home
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498757/Roblox%20Home%20Page%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/498757/Roblox%20Home%20Page%20Cleaner.meta.js
// ==/UserScript==
//Will Roblox ever STOP changing things and breaking every script?????????
//took ONE DAY for roblox to break EVERYTHING AGAIN
(function () {
    'use strict';

    let showTodaysPicks = false;
    let cleanTimeout = null;

    function ToggletodaysPicksButton() {
        const navList = document.querySelector('ul.nav.rbx-navbar');
        if (!navList) {
            setTimeout(ToggletodaysPicksButton, 1000);
            return;
        }
        if (document.getElementById('toggleTodaysPicksBtn')) return;

        const listItem = document.createElement('li');
        listItem.className = 'cursor-pointer';

        const toggleButton = document.createElement('a');
        toggleButton.textContent = "Toggle Today's Picks";
        toggleButton.href = "#";
        toggleButton.className = 'font-header-2 nav-menu-title text-header';
        toggleButton.style.userSelect = 'none';
        toggleButton.id = 'toggleTodaysPicksBtn';

        toggleButton.addEventListener('click', e => {
            e.preventDefault();
            showTodaysPicks = !showTodaysPicks;
            cleanHomePage();
        });

        listItem.appendChild(toggleButton);
        navList.appendChild(listItem);
    }

    function cleanHomePage() {
        if (cleanTimeout) clearTimeout(cleanTimeout);
        cleanTimeout = setTimeout(() => {
            const friendsTile = document.querySelector('.friends-carousel-list-container > div.friends-carousel-tile:nth-of-type(1) > [href*="/users/friends"]');
            if (friendsTile && friendsTile.parentElement) {
                friendsTile.parentElement.remove();
            }

            const todaysPicks = document.querySelector("#HomeContainer > div.place-list-container > div > div > div:nth-child(2)");
            const recommended1 = document.querySelector("#HomeContainer > div.place-list-container > div > div > div:nth-child(4)");
            const recommended2 = document.querySelector("#HomeContainer > div.place-list-container > div > div > div:nth-child(5)");

            if (todaysPicks) todaysPicks.style.display = showTodaysPicks ? '' : 'none';
            if (recommended1) recommended1.style.display = 'none';
            if (recommended2) recommended2.style.display = 'none';
        }, 300);
    }

    function init() {
        ToggletodaysPicksButton();
        cleanHomePage();

        const observer = new MutationObserver(cleanHomePage);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(init, 1000);
    });
})();

// ==UserScript==
// @name         Grundo's Cafe: Stock Market - Update Links
// @namespace    https://www.grundos.cafe
// @version      1.0
// @description  Update stock market navigation links to replace the find stocks to immediately go to all stocks.
// @author       Shalane
// @match        https://www.grundos.cafe/games/stockmarket/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480047/Grundo%27s%20Cafe%3A%20Stock%20Market%20-%20Update%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/480047/Grundo%27s%20Cafe%3A%20Stock%20Market%20-%20Update%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateLinks() {
        var navElement = document.querySelector('nav[aria-label="Stock Links"]');

        if (!navElement) {
            console.log("Navigation element not found on this page.");
            return;
        }

        var links = navElement.querySelectorAll('a');
        links.forEach(function(link) {
            if (link.href === 'https://www.grundos.cafe/games/stockmarket/stocks/') {
                // Update the link for "Find Stocks"
                link.href = 'https://www.grundos.cafe/games/stockmarket/stocks/?view_all=True';
                link.textContent = 'All Stocks';
            }
        });
    }

    window.addEventListener('load', updateLinks);
})();

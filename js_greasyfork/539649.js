// ==UserScript==
// @name         Better ProductHunt
// @namespace    http://tampermonkey.net/
// @version      2025-05-16
// @description  Hide AI and Promoted
// @author       PandaDEV
// @match        https://www.producthunt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=producthunt.com
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/539649/Better%20ProductHunt.user.js
// @updateURL https://update.greasyfork.org/scripts/539649/Better%20ProductHunt.meta.js
// ==/UserScript==

(function() {
    const observer = new MutationObserver(hide);

    function hide() {
        observer.disconnect();

        const productItems = document.querySelectorAll('section[data-sentry-component="Card"]');
        const regex = /(?:^|\s)AI(?=(?:\d|\s|$))/i;

        productItems.forEach((item) => {
            const lower = item.innerText.toLowerCase();

            const sponsor = item.querySelector('a[href="/sponsor"]')

            if (item.innerText.includes("AI") || item.innerText.includes(".ai") || regex.test(lower) || lower.includes("artificial intelligence") || sponsor) {

                item.remove();
            }
        });

        const loadMore = Array.from(document.querySelectorAll("button")).find(button => button.innerText.includes("See all of today's products"))
        if (loadMore) loadMore.click()

        const signups = document.querySelectorAll("section:has([class^='styles_emailInput__'])");
        signups.forEach(signup => signup.remove())

        const ads = document.querySelectorAll('[data-sentry-component="Ad"]');
        ads.forEach(ad => ad.remove())

        const intercomContainer = document.getElementById("intercom-container")
        if (intercomContainer) intercomContainer.remove()

        const products = document.querySelectorAll('[data-test="homepage-section-0"] section[data-sentry-component="Card"]');

        if (products) {
            const productsWithScore = Array.from(products).map(product => {
                return {
                    element: product,
                    score: parseInt(product.querySelector('button[data-test="vote-button"] p').innerText)
                }
            })

            const assignPlaces = (items) => {
                let prevScore = null;
                let prevRank = 0;

                return items.map((item, index) => {
                    let rank;

                    if (prevScore !== null && item.score === prevScore) {
                        rank = prevRank;
                    } else {
                        rank = index + 1;
                        prevRank = rank;
                        prevScore = item.score;
                    }

                    return Object.assign({}, item, { place: rank });
                });
            }

            const rankedProdcts = assignPlaces(productsWithScore);

            rankedProdcts.forEach(product => {
                const title = product.element.querySelector("& > div > a:nth-child(1)");
                let rank = product.element.getAttribute("better-rank");
                if (rank == null) {
                    const curRank = title.innerText.split(". ")[0];
                    product.element.setAttribute("better-rank", curRank);
                    rank = curRank;
                }
                const newTitle = product.place + "/" + rank + ". " + title.innerText.split(". ")[1];
                title.innerText = newTitle;
            })
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    hide();
})();
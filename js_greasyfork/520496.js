// ==UserScript==
// @name         Direct Download Card
// @namespace    SWScripts
// @match        https://www.cgtrader.com/items/*/download-page
// @grant        GM_addStyle
// @version      v1.0
// @license      MIT
// @description  Creates a card top right Corner to Include all Files without timer
// @author       BN_LOS
// @downloadURL https://update.greasyfork.org/scripts/520496/Direct%20Download%20Card.user.js
// @updateURL https://update.greasyfork.org/scripts/520496/Direct%20Download%20Card.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url("https://cdn.jsdelivr.net/npm/daisyui@4.12.19/dist/full.min.css");
    `);
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    const observer = new MutationObserver(() => {
        createDownloadCard();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function createDownloadCard() {
        const cardTitleElement = document.querySelector('.details-box__title');
        if (!cardTitleElement) return;
        const cardTitle = cardTitleElement.textContent.trim();

        const downloadList = document.querySelector('.details-box__list');
        if (!downloadList) return;

        if (document.getElementById('SWDirectDownloadCard')) return;

        const card = document.createElement('div');
        card.id = 'SWDirectDownloadCard';
        card.className = "card bg-base-200 shadow-xl fixed top-10 right-10 w-fit max-w-[300px]";

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";
        card.appendChild(cardBody);

        const titleElement = document.createElement('h3');
        titleElement.className = "card-title text-white";
        titleElement.textContent = `SWCards - ${cardTitle}`;
        cardBody.appendChild(titleElement);

        const listItems = downloadList.querySelectorAll('li');
        listItems.forEach(item => {
            const buttonTitle = item.textContent.trim().replace(/Download$/, "");
            const downloadLink = item.querySelector('a[href*="/free-downloads/"]');

            if (downloadLink) {
                const button = document.createElement('button');
                button.className = "btn btn-outline w-full";
                button.textContent = buttonTitle;
                button.onclick = () => {
                    if (downloadLink.classList.contains('js-auth-control')) {
                        downloadLink.click();
                        return;
                    }
                    window.location.href = downloadLink.href;
                };
                cardBody.appendChild(button);
            }
        });

        document.body.appendChild(card);
    }
})();// ==UserScript==
// @name         Direct Download Card
// @namespace    SWScripts
// @match        https://www.cgtrader.com/items/*
// @grant        GM_addStyle
// @version      0.9
// @description  Create a daisyUI styled card with download buttons and white title
// @author       BN_LOS, Refined by Stack Overflow user
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url("https://cdn.jsdelivr.net/npm/daisyui@4.12.19/dist/full.min.css");
        #SWDirectDownloadCard .card-title { @apply text-white; }
    `);

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    const observer = new MutationObserver(createDownloadCard);
    observer.observe(document.body, { childList: true, subtree: true });

    function createDownloadCard() {
        const cardTitleElement = document.querySelector('.details-box__title');
        if (!cardTitleElement || document.getElementById('SWDirectDownloadCard')) return;
        const cardTitle = cardTitleElement.textContent.trim();
        const downloadList = document.querySelector('.details-box__list');
        if (!downloadList) return;

        const card = document.createElement('div');
        card.id = 'SWDirectDownloadCard';
        card.className = "card bg-base-200 shadow-xl fixed top-10 right-10 w-fit max-w-[300px]";

        const cardBody = document.createElement('div');
        cardBody.className = "card-body";
        card.appendChild(cardBody);

        const titleElement = document.createElement('h3');
        titleElement.className = "card-title";
        titleElement.textContent = `SWCards - ${cardTitle}`;
        cardBody.appendChild(titleElement);

        downloadList.querySelectorAll('li').forEach(item => {
            const buttonTitle = item.textContent.trim().replace(/Download$/, "");
            const downloadLink = item.querySelector('a[href*="/free-downloads/"]');

            if (downloadLink) {
                const button = document.createElement('button');
                button.className = "btn btn-outline w-full";
                button.textContent = buttonTitle;
                button.onclick = () => {
                    if (downloadLink.classList.contains('js-auth-control')) downloadLink.click();
                    else window.location.href = downloadLink.href;
                };
                cardBody.appendChild(button);
            }
        });

        document.body.appendChild(card);
    }
})();
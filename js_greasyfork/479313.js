// ==UserScript==
// @name               Sort TikTok profiles in search results by number of followers
// @namespace          http://tampermonkey.net/
// @version            0.1.1
// @description        Click on the "Accounts" tab header from the TikTok search account page to sort loaded accounts by descending number of followers. Click again to restore the default sort. 
// @match              https://www.tiktok.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/479313/Sort%20TikTok%20profiles%20in%20search%20results%20by%20number%20of%20followers.user.js
// @updateURL https://update.greasyfork.org/scripts/479313/Sort%20TikTok%20profiles%20in%20search%20results%20by%20number%20of%20followers.meta.js
// ==/UserScript==

const multiplierMap = {
    k: 10 ** 3,
    m: 10 ** 6,
    b: 10 ** 9,
}

const sortAccountsByNumberOfFollowers = () => {
    const container = document.querySelector("*[data-e2e='search-user-container'").parentElement;

    container.style.display = "flex";
    container.style.flexDirection = "column";

    const items = Array.from(container.children)
    
    items.forEach(item => {
        // The string that indicates the number of followers is in the form "X
        // Followers" where X is "432" or "12.1K" or "35.3M" etc.

        const nbFollowersString = item.querySelector('[data-e2e="search-follow-count"]').textContent.trim().replace(/([^ ]*) .*/, "$1");

        const multiplier = multiplierMap[nbFollowersString.at(-1).toLowerCase()];

        const numberString = multiplier ?
            nbFollowersString.substring(0, nbFollowersString.length - 1)
            : nbFollowersString;


        item.nbFollowers = parseFloat(numberString) * (multiplier || 1);
    });
    
    const sortedItems = items.toSorted((a, b) => b.nbFollowers - a.nbFollowers);

    const alreadySorted = items.every(item => item.style.order)

    sortedItems.forEach((item, index) => {
        item.style.order = alreadySorted
            ? ''
            : String(index + 1)
    })
}

const sleep = time => new Promise(rs => setTimeout(rs, time))

const main = async () => {
    while (true) {
        await sleep(500);
        const accountsTab = document.evaluate("//div[@data-e2e='tab-item' and contains(., 'Accounts')]", document).iterateNext();

        if (!accountsTab || accountsTab.sortByFollowersListenerAdded) continue;

        accountsTab.addEventListener('click', sortAccountsByNumberOfFollowers)
        accountsTab.title += "Sort by number of followers / Restore default sort"
        accountsTab.sortByFollowersListenerAdded = true;
    }
}
main()
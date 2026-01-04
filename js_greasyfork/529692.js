// ==UserScript==
// @name         Torn Job List Alphabetizer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Alphabetizes the company job listings on the Torn job list page with a delay to handle late loading
// @author       dingus
// @match        https://www.torn.com/joblist.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529692/Torn%20Job%20List%20Alphabetizer.user.js
// @updateURL https://update.greasyfork.org/scripts/529692/Torn%20Job%20List%20Alphabetizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("[Torn Job List Alphabetizer] Script loaded and running at " + new Date().toISOString());
    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function sortJobList() {
        console.log("[Torn Job List Alphabetizer] Attempting to sort job list using XPath...");
        const listingsContainer = getElementByXPath('/html/body/div[6]/div/div[2]/div[3]/div[2]/div/div/div[2]/div[2]/ul[2]');
        if (!listingsContainer) {
            console.log("[Torn Job List Alphabetizer] Job listings container not found at the specified XPath.");
            return false;
        }
        if (!listingsContainer.classList.contains('listings')) {
            console.warn("[Torn Job List Alphabetizer] Element at XPath does not have class='listings'. Found:", listingsContainer);
            return false;
        }
        const jobItems = Array.from(listingsContainer.querySelectorAll('li:not(.clear)'));
        if (jobItems.length === 0) {
            console.log("[Torn Job List Alphabetizer] No job items found to sort in the specified <ul>.");
            return false;
        }
        jobItems.sort((a, b) => {
            const nameA = a.querySelector('span.name')?.textContent.trim().toLowerCase();
            const nameB = b.querySelector('span.name')?.textContent.trim().toLowerCase();
            if (!nameA || !nameB) {
                console.error("[Torn Job List Alphabetizer] Could not find span.name in one of the items:", a, b);
                return 0;
            }
            return nameA.localeCompare(nameB);
        });
        listingsContainer.innerHTML = '';
        jobItems.forEach(item => listingsContainer.appendChild(item));
        const clearItem = document.createElement('li');
        clearItem.className = 'clear';
        listingsContainer.appendChild(clearItem);

        console.log("[Torn Job List Alphabetizer] Company job list sorted alphabetically! Found " + jobItems.length + " items.");
        return true;
    }
    window.sortJobList = sortJobList;
    console.log("[Torn Job List Alphabetizer] Waiting 3 seconds for the job list to load...");
    setTimeout(() => {
        let sorted = sortJobList();
        if (!sorted) {
            console.log("[Torn Job List Alphabetizer] Setting up MutationObserver to watch for the <ul> at the specified XPath...");

            const observer = new MutationObserver((mutations, obs) => {
                const listingsContainer = getElementByXPath('/html/body/div[6]/div/div[2]/div[3]/div[2]/div/div/div[2]/div[2]/ul[2]');
                if (listingsContainer) {
                    console.log("[Torn Job List Alphabetizer] ul.listings detected via MutationObserver at the specified XPath!");
                    const success = sortJobList();
                    if (success) {
                        obs.disconnect();
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        setTimeout(() => {
            const listingsContainer = getElementByXPath('/html/body/div[6]/div/div[2]/div[3]/div[2]/div/div/div[2]/div[2]/ul[2]');
            if (listingsContainer && !listingsContainer.querySelector('li:not(.clear)')) {
                console.log("[Torn Job List Alphabetizer] Fallback: Retrying sort after 8 seconds...");
                sortJobList();
            }
        }, 4000);

    }, 3000);
})();
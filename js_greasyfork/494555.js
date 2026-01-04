// ==UserScript==
// @name         Kijiji: Hide Non-Local Listings
// @description  Removes ads with only "Canada" or provence name listed as location
// @match        https://www.kijiji.ca/b*
// @version      0.1
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494555/Kijiji%3A%20Hide%20Non-Local%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/494555/Kijiji%3A%20Hide%20Non-Local%20Listings.meta.js
// ==/UserScript==

const list = [
    'Canada',
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland',
    'Northwest Territories',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Québec',
    'Saskatchewan',
    'Yukon'
];

const observer = new MutationObserver(() => {
    var elements = document.querySelectorAll('p[data-testid="listing-location"]')
    elements.forEach((element) => {
        if (list.includes(element.innerText)) {
            element.closest('li').style.display = 'none';
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

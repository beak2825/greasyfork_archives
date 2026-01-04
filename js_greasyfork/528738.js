// ==UserScript==
// @name         Google Infinite Scroll 2
// @description  Enables infinite scroll on Google Search
// @match        *://www.google.com/search*
// @run-at       document-end
// @version 0.0.1.20250305073311
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/528738/Google%20Infinite%20Scroll%202.user.js
// @updateURL https://update.greasyfork.org/scripts/528738/Google%20Infinite%20Scroll%202.meta.js
// ==/UserScript==

let pageNumber = 1;
let isLoading = false;
let hasMore = true;

const fetchNextPage = async () => {
    const baseUrl = new URL(window.location.href);
    baseUrl.searchParams.set('start', pageNumber * 10);
    const response = await fetch(baseUrl.toString());
    const text = await response.text();
    const newDoc = new DOMParser().parseFromString(text, 'text/html');

    const container = document.createElement('div');
    container.id = `page-${pageNumber}`;
    container.style.marginTop = '20px';
    newDoc.querySelectorAll('#rso > div').forEach(result => container.appendChild(result.cloneNode(true)));

    const lastAddedPage = document.querySelector(`#page-${pageNumber - 1}`) || document.querySelector('#botstuff');
    lastAddedPage.after(container);

    hasMore = !!newDoc.querySelector('#pnnext');
    if (hasMore) pageNumber++;
};

window.addEventListener('scroll', async () => {
    if (!isLoading && hasMore && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000) {
        isLoading = true;
        await fetchNextPage();
        isLoading = false;
    }
});
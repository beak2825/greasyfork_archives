// ==UserScript==
// @name         MAL PTW Fetch Sort
// @description  This script adds "Fetch Sort" button to the "Plan to watch" page. The button sorts the list by MAL's avg. score
// @namespace    d-s-x
// @version      1.0
// @author       d-s-x
// @match        https://myanimelist.net/animelist/*status=6*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40917/MAL%20PTW%20Fetch%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/40917/MAL%20PTW%20Fetch%20Sort.meta.js
// ==/UserScript==

(function() {

if (document.querySelector('#fetch-sort-button')) return;

const stats = document.querySelector('.stats');
stats.innerHTML = '<a href="javascript: void(0);" id="fetch-sort-button"><i class="fa fa-sort"></i> Fetch Sort</a>' + stats.innerHTML;

document.querySelector('#fetch-sort-button').onclick = () => {
    const titles = Array.from(document.querySelectorAll('.list-item .title a[href^="/anime/"]:not(.icon-watch)'));
    console.log(`titles: ${titles.length}`);

    const retryDelay = 1000; // ms
    const requestDocument = (url, callback) => {
        const request = new XMLHttpRequest();
        request.open('GET', url);
        request.responseType = 'document';
        request.onload = () => {
            if (request.status === 429) {
                setTimeout(requestDocument, retryDelay, url, callback);
            } else {
                callback(request.status === 200 && request.response);
            }
        };
        request.onerror = () => {
            callback();
        };
        request.send();
    }

    let downloaded = 0;
    const parseResponse = (title, page) => {

        const item = title.closest('.list-item');
        if (page) {
            const score = page.querySelector('[itemprop="ratingValue"]');
            //const users = page.querySelector('[itemprop="ratingCount"]');
            item._weigth = score && parseFloat(score.textContent);
        }

        scoreHTML = `<span>${item._weigth && item._weigth.toFixed(2) || 'N/A'}</span>`
        item.querySelector('td.score').innerHTML = scoreHTML;

        if (++downloaded === titles.length) {
            console.log('fetch done');
            const container = title.closest('.list-table');
            const rows = Array.from(container.querySelectorAll('.list-item'));
            rows.sort((a, b) => b._weigth - a._weigth);
            for (let row of rows) {
                container.append(row);
            }
        }
    };

    for (const title of titles) {
        const url = title.href;
        title.closest('.list-item').querySelector('td.score').innerHTML = `<span>...</span>`;
        requestDocument(url, (d) => parseResponse(title, d));
    }
};

})();
// ==UserScript==
// @name         wszystkie oceny
// @namespace    https://biblionetka.pl/
// @version      0.1
// @description  Wyświetlanie wszystkich ocen na jednej stronie.
// @author       yawner
// @match        https://www.biblionetka.pl/user_ratings.aspx?*ratingFilter=all*
// @exclude      https://www.biblionetka.pl/user_ratings.aspx?*ratingFilter=all*p=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410041/wszystkie%20oceny.user.js
// @updateURL https://update.greasyfork.org/scripts/410041/wszystkie%20oceny.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadAllPages() {
        showLoadingMessage();
        Promise.all([getLastPageNumber(document)])
               .then(lastPageNumber => requestPages(lastPageNumber[0]))
               .then(waitForAllPages)
               .then(() => removeLoadingMessage())
               .catch(err => console.log(err));
    }

    function showLoadingMessage() {
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'loading-message';
        loadingMessage.innerHTML = 'Wczytywanie...';
        curRatings.parentNode.insertBefore(loadingMessage, curRatings);
    }

    function removeLoadingMessage() {
        document.querySelector('#loading-message').innerHTML = '';
    }

    function getLastPageNumber(page) {
        const curPageNumber = parseInt(page.querySelector('li.active').innerText);
        // First page is already loaded from the normal page load.
        // Others visited, while looking for last page number, will be saved.
        if (curPageNumber != 1) {
            savePageRatings(curPageNumber - 1, page);
        }

        const pageChanger = page.querySelector('#ctl00_MCP_ratingsPager').firstChild.children;
        if (isLastPage(pageChanger)) {
            return pageChanger[pageChanger.length - 1].innerText;
        } else if (noTenMorePages(pageChanger)) {
            return pageChanger[pageChanger.length - 2].innerText;
        }

        return getParsedPage(curPageNumber + 9).then(getLastPageNumber)
                                               .catch(err => console.log(err));
    }

    function requestPages(lastPageNumber) {
        for (let i = 1; i < lastPageNumber; i++) {
            addPageRatingsContainer(i);
            if (pageContents[i]) {
                updatePageRatingsContainer(i);
            } else {
                const request = getRatingsFromPage(i);
                request.then(() => updatePageRatingsContainer(i))
                    .catch(err => console.log(err));
                ratingRequests.push(request);
            }
        }
    }

    function getRatingsFromPage(pageNumber) {
        return getParsedPage(pageNumber).then(html => savePageRatings(pageNumber, html))
                                        .catch(err => console.log(err));
    }

    function getParsedPage(pageNumber) {
        return getPageText(pageNumber).then(parsePage)
                                      .catch(err => console.log(err));
    }

    function getPageText(pageNumber) {
        return fetchPage(pageNumber).then(response => response.text())
                                    .catch(err => console.log(err));
    }

    function fetchPage(pageNumber) {
        return fetch(pageUrl + '&p=' + pageNumber);
    }

    function waitForAllPages() {
        return Promise.all(ratingRequests);
    }

    function getRatingsHTML(page) {
        const ratings = page.querySelector('.oceny');
        const button = ratings.querySelector('p');
        if (button) {
            button.remove();
        }
        return ratings.innerHTML;
    }

    function savePageRatings(pageNumber, page) {
        pageContents[pageNumber] = createRatingsPageHeader(pageNumber) + getRatingsHTML(page);
    }

    function createRatingsPageHeader(pageNumber) {
        return `
        <div class="row">
            <div class="col-lg-12 pad-left pad-right">
                <h2>Strona ${pageNumber + 1}</h2>
            </div>
        </div>`;
    }

    function parsePage(htmlText) {
        return parser.parseFromString(htmlText, 'text/html');
    }

    function addPageRatingsContainer(pageNumber) {
        const container = document.createElement('div');
        container.id = 'page' + pageNumber;
        curRatings.append(container);
    }

    function updatePageRatingsContainer(pageNumber) {
        const ratingsContainer = curRatings.querySelector('#page' + pageNumber);
        ratingsContainer.innerHTML = pageContents[pageNumber];
    }

    function isLastPage(pager) {
        return pager[pager.length - 1].innerText.indexOf('następna') === -1;
    }

    function noTenMorePages(pager) {
        return pager[pager.length - 2].innerText.indexOf('+') === -1;
    }


    const pageUrl = window.location.href;
    const curRatings = document.querySelector('.oceny');
    const parser = new DOMParser();
    const pageContents = {};
    const ratingRequests = [];

    loadAllPages();
})();
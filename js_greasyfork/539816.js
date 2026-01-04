// ==UserScript==
// @name         StackStorage Random Entry Button
// @namespace    Violentmonkey Scripts
// @match        *://*.stackstorage.com/en/files/*
// @grant        none
// @version      1.4
// @license      MIT
// @author       JasperV
// @description  Add a button to jump to a random file entry
// @downloadURL https://update.greasyfork.org/scripts/539816/StackStorage%20Random%20Entry%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/539816/StackStorage%20Random%20Entry%20Button.meta.js
// ==/UserScript==

const FLAG_NAME = 'randomClick';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function waitForSelector(selector, callback, maxWait = 10000) {
    const start = Date.now();
    const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
            clearInterval(interval);
            callback(el);
        } else if (Date.now() - start > maxWait) {
            clearInterval(interval);
            console.warn(`Timeout waiting for selector: ${selector}`);
        }
    }, 300);
}

function hasRandomClickFlag() {
    return new URLSearchParams(window.location.search).has(FLAG_NAME);
}

function removeFlagFromURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete(FLAG_NAME);
    window.history.replaceState(null, '', url.toString());
}

function clickRandomEntry() {
    waitForSelector('.grid .grid-row', () => {
        const rows = document.querySelectorAll('.grid .grid-row');
        if (rows.length > 0) {
            const randomRow = rows[getRandomInt(0, rows.length - 1)];
            const link = randomRow.querySelector('a');
            if (link) {
                removeFlagFromURL();
                link.click();
            }
        }
    });
}

function getFilelistId() {
    const match = window.location.pathname.match(/\/files\/(\d+)/);
    return match ? match[1] : null;
}

function goToRandomPage() {
    waitForSelector('.grid', () => {
        const pagination = document.querySelector('.pagination');

        // If pagination doesn't exist, only one page — trigger click directly
        if (!pagination) {
            const filelistId = getFilelistId();
            if (filelistId) {
                const url = new URL(window.location.href);
                url.searchParams.set(FLAG_NAME, '1');
                window.history.replaceState(null, '', url.toString());
                clickRandomEntry();
            }
            return;
        }

        // With pagination
        const pageLinks = pagination.querySelectorAll('.page-item a.page-link');
        if (!pageLinks.length) return;

        const lastPageHref = pageLinks[pageLinks.length - 1].getAttribute('href');
        const match = lastPageHref.match(/\/files\/\d+\/(\d+)/);
        if (!match) return;

        const maxPage = parseInt(match[1], 10);
        const filelistId = getFilelistId();
        if (!filelistId) return;

        const currentMatch = window.location.pathname.match(/\/files\/\d+\/(\d+)/);
        const currentPage = currentMatch ? parseInt(currentMatch[1], 10) : 1;

        let randomPage;
        do {
            randomPage = getRandomInt(1, maxPage);
        } while (randomPage === currentPage && maxPage > 1);

        const newUrl = `/en/files/${filelistId}/${randomPage}?${FLAG_NAME}=1`;
        window.location.href = newUrl;
    });
}


function addRandomButton() {
    const buttonsContainer = document.querySelector('.buttons.col-lg-5');
    if (!buttonsContainer) return;

    const button = document.createElement('button');
    button.className = 'btn btn-secondary me-2 my-1';
    button.innerHTML = '🎲 Random Entry';
    button.addEventListener('click', goToRandomPage);

    buttonsContainer.insertBefore(button, buttonsContainer.firstChild);
}

// Add button after DOM loads
waitForSelector('.buttons.col-lg-5', addRandomButton);

// Perform random entry click if flag is set
if (hasRandomClickFlag()) {
    clickRandomEntry();
}

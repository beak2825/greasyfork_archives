// ==UserScript==
// @name         Nhentai Favorites Exporter
// @version      1.0.1
// @description  Scrapes the links of your Nhentai favorites list and saves them as a text file.
// @match        *://nhentai.net/favorites/*
// @author       Adam Jensen
// @namespace https://greasyfork.org/en/scripts/518036-nhentai-favorites-exporter
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518036/Nhentai%20Favorites%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/518036/Nhentai%20Favorites%20Exporter.meta.js
// ==/UserScript==

const sleepInterval = 200;
const loadTimeout = 5000;
let isRunning = false;

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getLocalStorageLinks() {
    try {
        const links = JSON.parse(localStorage.getItem('parser-links')) || [];
        return new Set(links);
    } catch (e) {
        console.error('Error parsing links from localStorage:', e);
        return new Set();
    }
}

function setLocalStorageLinks(links) {
    try {
        localStorage.setItem('parser-links', JSON.stringify([...links]));
    } catch (e) {
        console.error('Error saving links to localStorage:', e);
    }
}

function clearLocalStorageLinks() {
    localStorage.removeItem('parser-links');
}

function getState() {
    return localStorage.getItem('parser-state') || '0';
}

function setState(state) {
    localStorage.setItem('parser-state', state);
}

function updateCounter(count) {
    const counterElement = document.getElementById('scrape-counter');
    if (counterElement) {
        counterElement.textContent = `Links scraped: ${count}`;
    }
}

function createButton(text, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClickHandler;
    button.style.marginRight = '10px';
    return button;
}

function replaceButton(newButtonText, onClickHandler) {
    const buttonContainer = document.querySelector('.menu.right').children[0].children[0];
    if (buttonContainer && buttonContainer.textContent !== newButtonText) {
        const button = createButton(newButtonText, onClickHandler);
        buttonContainer.replaceWith(button);
    }
}

function activateParser() {
    clearLocalStorageLinks();
    setState('1');
    processFavorites();
}

function deactivateParser() {
    const links = getLocalStorageLinks();
    const plainText = [...links].join('\n');
    download('favorites.txt', plainText);
    setState('0');
}

function stopScraping() {
    isRunning = false;
    setState('0');
    replaceButton('Start Scraping', activateParser);
}

async function processFavorites() {
    if (isRunning) return;
    isRunning = true;

    const links = getLocalStorageLinks();
    let count = links.size;

    updateCounter(count);

    async function scrapePage() {
        if (!isRunning) return;
        try {
            Array.from(document.getElementsByClassName('gallery-favorite')).forEach(fav => {
                const link = 'https://nhentai.net/g/' + fav.dataset.id + '/';
                if (!links.has(link)) {
                    links.add(link);
                    count++;
                    updateCounter(count);
                }
            });
            setLocalStorageLinks(links);

            await sleep(sleepInterval);

            const nextButton = document.querySelector('.next');
            if (nextButton) {
                nextButton.click();
                await sleep(loadTimeout);
                scrapePage();
            } else {
                deactivateParser();
                replaceButton('DONE', () => {});
            }
        } catch (e) {
            console.error('Error during scraping:', e);
            deactivateParser();
            replaceButton('ERROR', () => {});
        }
    }

    scrapePage();
}

function init() {
    if (getState() === '0') {
        replaceButton('Start Scraping', activateParser);
    } else {
        replaceButton('Stop and Save', deactivateParser);
        const cancelButton = createButton('Cancel Scraping', stopScraping);
        document.querySelector('.menu.right').children[0].appendChild(cancelButton);

        const counterDiv = document.createElement('div');
        counterDiv.id = 'scrape-counter';
        counterDiv.textContent = 'Links scraped: 0';
        document.querySelector('.menu.right').appendChild(counterDiv);

        processFavorites();
    }
}

init();

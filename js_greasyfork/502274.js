// ==UserScript==
// @name         4chan Catalog Unique Posters Ratio
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Displays unique posters ratio and repeat posters for each thread in 4chan catalog, using full thread data
// @match        https://boards.4chan.org/pol/catalog
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502274/4chan%20Catalog%20Unique%20Posters%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/502274/4chan%20Catalog%20Unique%20Posters%20Ratio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration variables
    const identify1pbtids = false;
    const shownumberofrepeatposters = true;
    const sortbyhighestratiohighestrepeat = true;
    const sortbylowestratioandhighestrepeat = false;
    const sortthreadsbyratio = false;
    const sortthreadsbymostconversation = false;

    let threadRatios = {};
    let threadRepeatPosters = {};

    function fetchCatalogJSON() {
        const boardName = window.location.pathname.split('/')[1];
        const catalogUrl = `https://a.4cdn.org/${boardName}/catalog.json`;
        fetch(catalogUrl)
            .then(response => response.json())
            .then(catalogData => processCatalog(catalogData, boardName))
            .catch(error => console.error('Error fetching catalog JSON:', error));
    }

    function processCatalog(catalogData, boardName) {
        let promises = [];
        catalogData.forEach(page => {
            page.threads.forEach(thread => {
                promises.push(fetchThreadJSON(boardName, thread.no));
            });
        });
Promise.all(promises).then(() => {
    if (sortthreadsbyratio) {
        sortThreads('ratio');
    } else if (sortthreadsbymostconversation) {
        sortThreads('conversation');
    } else if (sortbylowestratioandhighestrepeat) {
        sortThreads('lowestratiohighestrepeat');
    } else if (sortbyhighestratiohighestrepeat) {
        sortThreads('highestratiohighestrepeat');
    }

});
    }

    function fetchThreadJSON(boardName, threadId) {
        const threadUrl = `https://a.4cdn.org/${boardName}/thread/${threadId}.json`;
        return fetch(threadUrl)
            .then(response => response.json())
            .then(threadData => processThread(threadData, threadId))
            .catch(error => console.error(`Error fetching thread ${threadId} JSON:`, error));
    }

    function processThread(threadData, threadId) {
        const { uniquePosters, repeatPosters } = calculatePosterStats(threadData);
        const totalPosts = threadData.posts.length;
        const ratio = uniquePosters / totalPosts;
        threadRatios[threadId] = ratio;
        threadRepeatPosters[threadId] = repeatPosters;
        displayStats(threadId, ratio, repeatPosters);

        if (identify1pbtids) {
            const opId = threadData.posts[0].id;
            const opPostCount = threadData.posts.filter(post => post.id === opId).length;
            if (opPostCount === 1) {
                highlightThread(threadId);
            }
        }
    }

    function calculatePosterStats(threadData) {
        const posterCounts = {};
        threadData.posts.forEach(post => {
            if (post.id) {
                posterCounts[post.id] = (posterCounts[post.id] || 0) + 1;
            }
        });
        const uniquePosters = Object.keys(posterCounts).length;
        const repeatPosters = Object.values(posterCounts).filter(count => count > 1).length;
        return { uniquePosters, repeatPosters };
    }

function displayStats(threadId, ratio, repeatPosters) {
    const metaElement = document.querySelector(`#meta-${threadId}`);
    if (metaElement) {
        const statsSpan = document.createElement('span');
        statsSpan.className = 'unique-poster-stats';
        const uText = document.createElement('span');
        uText.textContent = ' / U: ';
        uText.style.color = '#c5c8c6';
        const ratioText = document.createElement('span');
        ratioText.textContent = ratio.toFixed(2);
        ratioText.style.color = getRatioColor(ratio);
        statsSpan.appendChild(uText);
        statsSpan.appendChild(ratioText);

        if (shownumberofrepeatposters) {
            const repeatText = document.createElement('span');
            const rpText = document.createElement('span');
            rpText.textContent = ' / RP: ';
            rpText.style.color = '#c5c8c6';
            repeatText.textContent = ` ${repeatPosters}`;
            repeatText.style.color = getRepeatPostersColor(repeatPosters);
            statsSpan.appendChild(rpText);
            statsSpan.appendChild(repeatText);
        }

        statsSpan.title = `Unique Posters Ratio: ${ratio.toFixed(2)}, Repeat Posters: ${repeatPosters}`;
        const imageCountElement = metaElement.querySelector('b:nth-of-type(2)');
        if (imageCountElement && imageCountElement.nextSibling) {
            metaElement.insertBefore(statsSpan, imageCountElement.nextSibling);
        } else {
            metaElement.appendChild(statsSpan);
        }
    }
}

function getRepeatPostersColor(repeatPosters) {
    // Assuming a maximum of 50 repeat posters for the gradient
    const maxRepeatPosters = 50;
    const normalizedValue = Math.min(repeatPosters / maxRepeatPosters, 1);

    // Convert hex color #c5c8c6 to RGB
    const endColor = {
        r: 107,
        g: 112,
        b: 255
    };

    // Start color (yellow)
    const startColor = {
        r: 255,
        g: 255,
        b: 0
    };

    // Interpolate between yellow and #c5c8c6
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalizedValue);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalizedValue);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalizedValue);

    return `rgb(${r}, ${g}, ${b})`;
}

    function getRatioColor(ratio) {
        const normalizedRatio = Math.min(Math.max(ratio, 0), 1);
        const red = Math.round(normalizedRatio * 255);
        const green = Math.round((1 - normalizedRatio) * 255);
        return `rgb(${red}, ${green}, 0)`;
    }

    function highlightThread(threadId) {
        const threadElement = document.querySelector(`#thread-${threadId}`);
        if (threadElement) {
            threadElement.style.border = '2px solid red';
        }
    }

function sortThreads(sortType) {
    const threadContainer = document.querySelector('#threads');
    if (!threadContainer) return;

    const threads = Array.from(threadContainer.children);
    threads.sort((a, b) => {
        const aId = a.id.split('-')[1];
        const bId = b.id.split('-')[1];
        if (sortType === 'ratio') {
            return threadRatios[bId] - threadRatios[aId]; // Sort by ratio, highest to lowest
        } else if (sortType === 'conversation') {
            return threadRepeatPosters[bId] - threadRepeatPosters[aId]; // Sort by repeat posters, highest to lowest
        } else if (sortType === 'lowestratiohighestrepeat') {
            // Calculate a score: lower ratio and higher repeat posters result in a higher score
            const aScore = (1 - threadRatios[aId]) * threadRepeatPosters[aId];
            const bScore = (1 - threadRatios[bId]) * threadRepeatPosters[bId];
            return bScore - aScore; // Sort by score, highest to lowest
        } else if (sortType === 'highestratiohighestrepeat') {
            // Calculate a score: higher ratio and higher repeat posters result in a higher score
            const aScore = threadRatios[aId] * threadRepeatPosters[aId];
            const bScore = threadRatios[bId] * threadRepeatPosters[bId];
            return bScore - aScore; // Sort by score, highest to lowest
        }

    });

    threads.forEach(thread => threadContainer.appendChild(thread));
}

    setTimeout(fetchCatalogJSON, 1000);
})();
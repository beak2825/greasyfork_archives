// ==UserScript==
// @name         Filter Search by PCL
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Filters search for PCL cards
// @author       You
// @match        https://waifugame.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waifugame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461385/Filter%20Search%20by%20PCL.user.js
// @updateURL https://update.greasyfork.org/scripts/461385/Filter%20Search%20by%20PCL.meta.js
// ==/UserScript==

const timeBetweenCalls = 1500;
const enableCacheStorage = true;
//7 days
const cacheExpiry = 604800000;
const queriesBetweenSaves = 1;


let cache;
let lastQuery = Date.now();
let saveInterval = 9;
let search;
let filterEnabled = false;
let queue = [];
let blockRequests = false;
stopInfiniteScrolling = true;
let stopInfiniteScrolling2 = false;
let unloadedResults = document.createElement('div');
let counter = 0;
let pageGetPriority = false;
let activeQueue = false;
let noMoreResults = false;

function timer(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function filter(cardInfo) {
    switch (cardInfo.Trait) {
        case 'Charismatic': //Fallthrough
        case 'Perceptive':
        case 'Lucky':
            return false;
        default:
            return true;
    }
}

async function requestInfo(cardID) {
    ($.getJSON('/json/card/' + cardID)).then(
        (value) => {
            value.time = Date.now();
            cache[cardID] = value;
            counter++;
            if (counter === queriesBetweenSaves) {
                counter = 0;
                saveToLocalStorage()
            }
        }
    )
}

function removeCard(cardID) {
    let cardSelector = 'div[data-cardid="' + cardID + '"]'
    let card = document.querySelectorAll(cardSelector)[0];
    if (card) {
        card.parentNode.remove();
        if (queue[0] !== fillCards) {
            queue.unshift(null);
            queue.unshift(fillCards);
        }
    }
}

async function getCards() {
    if (pageGetPriority || blockRequests || (Date.now() - lastQuery < timeBetweenCalls)) {
        await timer(timeBetweenCalls / 3);
    }
    page++;
    pageGetPriority = true;
    blockRequests = true;
    let results = $('<div>').load('?p=' + page + '&q=' + query + ' #searchResults > *', function () {
            results = results[0];
            if (results.children.length === 0) {
                noMoreResults = true;
            }
            transferChildren(unloadedResults, results);
            blockRequests = false;
            lastQuery = Date.now();
        }
    )
    while (!results) {
        await timer(100);
    }
    pageGetPriority = false;
}

function fillCards() {
    const resultCount = search.children.length;
    if (resultCount % 3) {
        if (resultCount % 3 < unloadedResults.children.length) {
            for (let i = 0; i < resultCount % 3; i++) {
                queue.push(unloadedResults.children[0])
                search.appendChild(unloadedResults.children[0])
            }
        } else if (!noMoreResults && queue[0] !== getCards && queue[0] !== fillCards) {
            queue.unshift(null);
            queue.unshift(fillCards);
            queue.unshift(null);
            queue.unshift(getCards);

        }
    }
    $resultCount.text(search.children.length);
}

function loadNextPage() {
    if (noMoreResults) {
        while(unloadedResults.children.length > 0) {
            queue.push(unloadedResults.children[0])
            search.appendChild(unloadedResults.children[0])
        }
        stopInfiniteScrolling2 = true;
        return;
    }
    else if (unloadedResults.children.length < 30) {
        queue.unshift(null);
        queue.unshift(loadNextPage);
        queue.unshift(null);
        queue.unshift(getCards);
        return;
    } else {
        for (let i = 0; i < 30; i++) {
            queue.push(unloadedResults.children[0])
            search.appendChild(unloadedResults.children[0])
        }
    }
    $resultCount.text(search.children.length);
    loadingNext = false;
}

async function processCard(card) {
    //If not (cache exists and cache contains card and cache has not expired)
    if (!(cache && cache[card.dataset.cardid] && (Date.now() - cache[card.dataset.cardid].time < cacheExpiry))) {
        if (loadingNext || pageGetPriority || blockRequests || ((Date.now() - lastQuery) < timeBetweenCalls)) {
            card.style.filter = "blur(3px)";
            await timer(timeBetweenCalls);
            card.style.filter = "";
        }
        blockRequests = true;
        card.style.filter = "blur(3px)";
        requestInfo(card.dataset.cardid).then(() => {
                card.style.filter = "";
                blockRequests = false;
                lastQuery = Date.now();
            }
        );
        while (!cache[card.dataset.cardid]) {
            await timer(200);
        }
    }
    if (filter(cache[card.dataset.cardid])) {
        await removeCard(card.dataset.cardid);
    }
}

async function queueHandler() {
    while (queue) {
        let event = queue.shift();
        switch (typeof (event)) {
            case 'object':
                queue.unshift(event.children[0]);
                queue.unshift(processCard);
                break;
            case 'function':
                let card = queue.shift()
                await event.call(null, card);
                break

        }
        await timer(10);
    }
    activeQueue = false;
}

function transferChildren(to, from) {
    let rows = [...from.children];
    rows.forEach(function (rowWrapper) {
        let row = [...rowWrapper.children];
        row.forEach(function (card) {
            to.appendChild(card);
        });
        rowWrapper.remove();
    })
}

function saveToLocalStorage() {
    //Save cache to local storage
    if (enableCacheStorage) {
        let stringified = JSON.stringify(cache);
        if (stringified) {
            window.localStorage.setItem("infoStorage", stringified);
        }
    }
}

//Converts page to flex wrap
async function setup() {
    search = document.querySelector('div[id="searchResults"]');
    search.style.display = "flex";
    search.style.flexWrap = "wrap";
    search.style.rowGap = "10px";
    let infinites = document.querySelectorAll('div[data-infinitescrollpage]');
    infinites.forEach(function (infinite) {
        [...infinite.children].forEach(function (row) {
            search.appendChild(row)
        })
    })
    transferChildren(search, search);

//Creates a button
    let btn = document.querySelectorAll("a[href='https://waifugame.com/home']")[1];
    let btn2 = btn.cloneNode();
    btn.before(btn2);
    let span = document.createElement('span');
    span.className = "replaceGroupName";
    btn2.innerHTML = "<i class=\"fas fa-filter\"></i>";
    span.textContent = "Filter";
    btn2.style.cursor = "pointer";
    btn2.appendChild(span);
    btn2.removeAttribute("href");
    btn2.onclick = async function () {
        if (!filterEnabled) {
            if (enableCacheStorage) {
                cache = JSON.parse(window.localStorage.getItem("infoStorage"));
            }
            if (!cache) {
                cache = {};
            }
            for (let child of search.children) {
                queue.push(child);
            }
            activeQueue = true;
            await queueHandler();
        }
        filterEnabled = true;
        return false;
    }
    if (search.children.length > 0) {
        $(window).scroll(async function () {
            if (!loadingNext && $(window).scrollTop() >= $(document).height() - $(window).height() - 150) {
                if (!stopInfiniteScrolling2) {
                    loadingNext = true;
                    queue.unshift(null);
                    queue.unshift(loadNextPage);
                    if(!activeQueue) {
                        await queueHandler()
                    }
                }
            }
        });
    }
}

async () => {
    await setup();
}
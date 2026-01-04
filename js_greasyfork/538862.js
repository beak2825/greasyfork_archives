// ==UserScript==
// @name         SteinRankSearch
// @namespace    http://tampermonkey.net/
// @version      2025-06-08
// @description  Search stein rankings by player name(case-sensitive)
// @author       guydude
// @match        https://*.stein.world/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stein.world
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538862/SteinRankSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/538862/SteinRankSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

let searchPlayer;

function search() {
    let ranking = document.getElementById('stein-hub-ranking-detail-container').querySelector(':scope > [style=""]');
    let playerList = Array.from(ranking.querySelectorAll('*')).filter(el => {
        return Array.from(el.classList).some(cls => /stein-hub-ranking.*player/.test(cls));
    })
    for (const player of playerList) {
        if (player.textContent === searchPlayer) {
            player.scrollIntoView({block: 'center'});
            document.getElementById('stein-hub-ranking-detail-container').querySelectorAll('[style*="background-color"]').forEach(el => {
                el.style.backgroundColor = '';
            });
            player.style.backgroundColor = 'yellow';
            return;
        }
    }
    document.getElementById('stein-hub-ranking-page-next').click();
    let page = Array.from(ranking.querySelectorAll('*')).filter(el =>
        /stein-hub-ranking.*table-entries/.test(el.id)
    );
    const pageNums = document.getElementById('stein-hub-ranking-page-display').textContent.trim().split('/');
    if (pageNums[0] !== pageNums[1]) {
        waitForLoad(page[0], search);
    }
}

const searchBar = document.createElement('input');

function searchIsolate(event) {
    event.stopPropagation();
    if (event.key === 'Enter') {
        searchPlayer = searchBar.value;
        goToFirstPage(() => {
            search();
        });
    }
}

function goToFirstPage(callback) {
    let currPage = parseInt(document.getElementById('stein-hub-ranking-page-display').textContent.trim().split('/')[0]);
    if (currPage > 1) {
        document.getElementById('stein-hub-ranking-page-previous').click();
        setTimeout(() => goToFirstPage(callback), 100);
    } else {
        callback();
    }
}

function waitForLoad(page, callback) {
    const observer = new MutationObserver(() => {
        if (page.children.length > 1) {
            observer.disconnect();
            callback();
        }
    });
    observer.observe(page, {
        childList: true,
        subtree: false
    });
}

searchBar.addEventListener('keypress', searchIsolate);
searchBar.addEventListener('keydown', searchIsolate);
searchBar.style.display = 'inline';

const promptText = document.createElement('p');
promptText.textContent = 'Search for player: ';
promptText.style.display = 'inline';

document.getElementById('stein-hub-ranking-header-container').appendChild(promptText);
document.getElementById('stein-hub-ranking-header-container').appendChild(searchBar);
})();
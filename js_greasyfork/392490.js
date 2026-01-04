// ==UserScript==
// @name         Metacritic: Hide games with no Metascore
// @description  When sorting by Newest Releases, games with no Metascore will get hidden. If that ends up being every game on a page, it will skip to the next page
// @version      0.5
// @author       mica
// @namespace    greasyfork.org/users/12559
// @match        https://www.metacritic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392490/Metacritic%3A%20Hide%20games%20with%20no%20Metascore.user.js
// @updateURL https://update.greasyfork.org/scripts/392490/Metacritic%3A%20Hide%20games%20with%20no%20Metascore.meta.js
// ==/UserScript==

let url;
const listGames = () => document.querySelectorAll('.c-finderProductCard-game');

function hideGames() {
    let hidden = 0;
    listGames().forEach(elem => {
        if (!elem.innerText.includes('Metascore')) {
            elem.closest('.c-finderProductCard').remove();
            hidden++;
        }
    })
    if (hidden == 24) {
        document.querySelector('.c-navigationPagination_item--next > span > span').click();
    }    
}

function checkReady() {
    if (listGames().length == 24) {
        hideGames();
    } else {
        setTimeout(checkReady, 100);
    }
}

setInterval(() => {
    if (url != location.href) {
        url = location.href;
        if (location.pathname.match(/browse\/game.*new/)) {
            checkReady();
        }
    }
}, 100);

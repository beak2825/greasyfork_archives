// ==UserScript==
// @name         BGG - Clean
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove advertising from BGG
// @author       jimonthebarn
// @match        https://boardgamegeek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamegeek.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522135/BGG%20-%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/522135/BGG%20-%20Clean.meta.js
// ==/UserScript==

const elements = [
    'gg-leaderboard-ad',
    '.advertisement-leaderboard',
    'gg-leaderboard-lg-ad',
    '.support-drive',
    'marketplace-module'
];

elements.forEach((elementSelector) => {
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        let element = document.querySelector(elementSelector);

        if (element) {
            observer.disconnect();
            element.remove();
        }
    }
});
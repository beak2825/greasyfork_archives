// ==UserScript==
// @name         Duckduckgo quick bang
// @namespace    http://taiho.moe/
// @version      0.1
// @description  Quick jump to startpage & google
// @author       swordfeng
// @match        https://duckduckgo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388460/Duckduckgo%20quick%20bang.user.js
// @updateURL https://update.greasyfork.org/scripts/388460/Duckduckgo%20quick%20bang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchBars = $('ul#duckbar_static');
    if (searchBars) {
        appendToSearchBar(searchBars[0]);
    }
})();

function appendToSearchBar(bar) {
    appendBang(bar, 's');
    appendBang(bar, 'g');
}

function appendBang(bar, bang) {
    const bangLink = document.createElement('a');
    bangLink.className = 'zcm__link';
    bangLink.innerHTML = '!' + bang;
    bangLink.href = '#';
    bangLink.addEventListener('click', () => {
        const search = '!' + bang + ' ' + getSearch();
        window.location.search = '?q=' + encodeURIComponent(search);
    });
    const bangItem = document.createElement('li');
    bangItem.className = 'zcm__item';

    bangItem.appendChild(bangLink);
    bar.appendChild(bangItem);
}

function getSearch() {
    const searchBox = $('input[name="q"]')[0];
    return searchBox.value;
}

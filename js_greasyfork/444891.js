// ==UserScript==
// @name         Scrabble Dictionary Focus
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Focuses the Merriam Scrabble dictionary on page load so you don't need to click to focus each time you want to look up a new word.
// @author       You
// @match        https://scrabble.merriam.com/
// @match        https://scrabble.merriam.com/finder/*
// @grant        none
// @license      GPLv3
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/444891/Scrabble%20Dictionary%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/444891/Scrabble%20Dictionary%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchBox = document.querySelector('.desktop-search-title-container #sbl_search input.sbl_search_inp');
    searchBox.value = '';
    let i = 0;
    while(document.activeElement !== searchBox && i < 100){
        searchBox.focus();
        i++;
    }
})();
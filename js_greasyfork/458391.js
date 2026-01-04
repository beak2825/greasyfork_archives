// ==UserScript==
// @name         Reverso Context forward slash to focus search bar
// @namespace    https://github.com/sahlaysta/
// @version      0.2
// @description  Focuses the search bar when forward slash is pressed, like on most sites
// @author       sahlaysta
// @match        https://context.reverso.net/*
// @icon         https://cdn.reverso.net/context/v62110/images/reverso180.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458391/Reverso%20Context%20forward%20slash%20to%20focus%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/458391/Reverso%20Context%20forward%20slash%20to%20focus%20search%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const searchBar = document.querySelector('#search-input').firstElementChild;
    document.addEventListener('keydown', event => {
       if (!event.altKey && !event.ctrlKey && !event.isComposing && document.activeElement !== searchBar && event.key === '/') {
           searchBar.focus();
           searchBar.setSelectionRange(searchBar.value.length, searchBar.value.length);
           event.preventDefault();
       }
    });
})();

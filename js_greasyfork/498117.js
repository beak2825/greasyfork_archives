// ==UserScript==
// @name         Dropout focus search
// @namespace    http://tampermonkey.net/
// @version      2025-05-11
// @description  When clicking on "search" in dropout.tv, automatically focus the search bar
// @author       Me :)
// @license MIT
// @match        https://watch.dropout.tv/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dropout.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498117/Dropout%20focus%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/498117/Dropout%20focus%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchInputField = document.querySelector("div.Search-module__content-container input");
    const navToggle = document.querySelector("#search-nav-toggle");

    navToggle.addEventListener('click', () => {
        setTimeout(() => searchInputField.focus(), 101); // Dont know why, but just calling focus does not work :(
    });

    const keydownHandler = (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            navToggle.click();
        }
    };

    document.addEventListener('keydown', keydownHandler, false);
})();
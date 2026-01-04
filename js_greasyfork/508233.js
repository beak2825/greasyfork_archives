// ==UserScript==
// @name         Qiita New Arrival Sorter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sort Qiita articles by newest first
// @author       Your Name
// @match        https://qiita.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508233/Qiita%20New%20Arrival%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/508233/Qiita%20New%20Arrival%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sortNewestFirst = () => {
        // Check if the page has articles list
        const listWrapper = document.querySelector('.tr-ItemList');
        if (!listWrapper) {
            return;
        }

        // Find the sort dropdown menu
        const sortDropdown = document.querySelector('.p-Select-sortSelect select');
        if (!sortDropdown) {
            return;
        }

        // Set the sort option to "新着順" (newest first)
        const newItemOption = Array.from(sortDropdown.options).find(option => option.text.includes('新着順'));
        if (newItemOption && sortDropdown.value !== newItemOption.value) {
            sortDropdown.value = newItemOption.value;
            sortDropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };

    // Run the sorter function on page load
    window.addEventListener('load', sortNewestFirst);
})();
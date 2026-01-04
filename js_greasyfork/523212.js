// ==UserScript==
// @name         GitHub: Mark all as viewed button
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Adds a "Mark all as viewed" button to GitHub code reviews
// @author       MarcelBrode
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523212/GitHub%3A%20Mark%20all%20as%20viewed%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/523212/GitHub%3A%20Mark%20all%20as%20viewed%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const diffbar = document.querySelector('.pr-review-tools');
    const afterElement = document.querySelector('span.diffbar-item');

    const checkboxId = 'mark-all-as-viewed';
    const checkAllElement = document.createElement('div');
    checkAllElement.classList.add('diffbar-item');
    checkAllElement.innerHTML = `
        <button aria-label="Mark all as viewed" class="Button--secondary Button--small Button d-inline-flex mr-2">
            Mark all as viewed
        </button>
    `;
    checkAllElement.addEventListener('click', () => document.querySelectorAll('.js-reviewed-checkbox').forEach((input) => input.checked || input.click()));

    diffbar.insertBefore(checkAllElement, afterElement);
})();
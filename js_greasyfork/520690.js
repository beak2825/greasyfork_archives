// ==UserScript==
// @name        Save wanted NPC in local storage
// @namespace   Violentmonkey Scripts
// @match       https://www.dofuspourlesnoobs.com/les-bandits-de-cania.html*
// @grant       none
// @version     1.0
// @author      -
// @description 12/14/2024, 10:27:47 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520690/Save%20wanted%20NPC%20in%20local%20storage.user.js
// @updateURL https://update.greasyfork.org/scripts/520690/Save%20wanted%20NPC%20in%20local%20storage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'checkboxesState';

    function loadState() {
        const savedState = localStorage.getItem(STORAGE_KEY);
        return savedState ? JSON.parse(savedState) : {};
    }

    function saveState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function transformListItems() {
        const checkboxesState = loadState();
        const parentDiv = document.querySelector('li [href="/on-recherche-fouduglen-l-ecureuil.html"]').closest('.wsite-multicol-tr');
        const listItems = parentDiv.querySelectorAll('li');

        listItems.forEach((li) => {
            const text = li.textContent.trim();

            if (li.querySelector('input[type="checkbox"]')) return;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checkboxesState[text] || false;

            checkbox.addEventListener('change', () => {
                checkboxesState[text] = checkbox.checked;
                saveState(checkboxesState);
            });

            li.prepend(checkbox);
        });
    }

    transformListItems();
})();
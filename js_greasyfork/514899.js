// ==UserScript==
// @name         Nexus Search Category Switcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Change default search category from Mods to Games on Nexus Mods
// @author       batka_zver
// @license Допускаются изменения при условии, что вы упомяните меня в списке авторов
// @match        *://www.nexusmods.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514899/Nexus%20Search%20Category%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/514899/Nexus%20Search%20Category%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeCategory() {
        const selectedCategory = document.querySelector('li.rj-search-category-option.category-selected[data-category-value="mods"]');

        if (selectedCategory) {
            selectedCategory.classList.remove('category-selected');

            const gamesCategory = document.querySelector('li.rj-search-category-option[data-category-value="games"]');
            if (gamesCategory) {
                gamesCategory.classList.add('category-selected');

                const hiddenInput = document.querySelector('input[name="category"]');
                if (hiddenInput) {
                    hiddenInput.value = 'games';
                }

                gamesCategory.click();
            }
        }
    }

    window.addEventListener('load', changeCategory);
})();

// ==UserScript==
// @name         Hide alcohol items for Tavriav
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide items with class 'products__item' containing specific words on Tavriav
// @author       max5555
// @match        https://www.tavriav.ua/catalog/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479012/Hide%20alcohol%20items%20for%20Tavriav.user.js
// @updateURL https://update.greasyfork.org/scripts/479012/Hide%20alcohol%20items%20for%20Tavriav.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wordsToHide = [
"Пиво", "бокал", "вішалка", "кревет", "спред", "коньяк", "горілка", "корм", "свіча", "підг", "вермут", "лікер", "ром", "кавовий", "джин", "віскі", "вино", "бренді", "сидр", "настоянка"].map(word => word.toLowerCase());

    function hideItemsBasedOnContent() {
        const items = document.querySelectorAll('.products__item');
        for (let item of items) {
            let itemContent = item.textContent.toLowerCase();
            if (wordsToHide.some(word => itemContent.includes(word))) {
                item.style.display = 'none';
            }
        }
    }

    // Hide items after the page has loaded
    window.addEventListener('load', hideItemsBasedOnContent);

    // Also handle any dynamically added items
    const observer = new MutationObserver(hideItemsBasedOnContent);
    observer.observe(document.body, { childList: true, subtree: true });

})();

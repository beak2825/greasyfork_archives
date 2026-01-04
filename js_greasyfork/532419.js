// ==UserScript==
// @name         ElectricUnicycles.eu Filter Models + Focus
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Filter model cards by name on electricunicycles.eu and focus input automatically
// @author       You
// @match        https://www.electricunicycles.eu/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532419/ElectricUnicycleseu%20Filter%20Models%20%2B%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/532419/ElectricUnicycleseu%20Filter%20Models%20%2B%20Focus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addFilterInput() {
        const sortButton = document.getElementById('button_catalog_sort');
        if (!sortButton) return;

        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Filter models...';
        input.style.marginLeft = '10px';
        input.style.padding = '5px';
        input.style.fontSize = '14px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';

        // Insert the input after the button
        sortButton.parentNode.insertBefore(input, sortButton.nextSibling);

        // Focus the input automatically
        input.focus();

        // Listen to input events
        input.addEventListener('input', function() {
            const filterText = input.value.trim().toLowerCase();
            const modelTitles = document.querySelectorAll('.model-name h4');

            modelTitles.forEach(h4 => {
                const card = h4.closest('.box-store-item');
                if (!card) return;

                const modelName = h4.textContent.trim().toLowerCase();
                if (filterText === '' || modelName.includes(filterText)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        addFilterInput();
    });
})();

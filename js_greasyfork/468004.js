// ==UserScript==
// @name     Grundo's Cafe Cooking Pot Enhancer
// @version  1.0
// @description "Displays your Cooking Pot ingredients on the cooking results page, just like a personal gourmet diary!"
// @author   Thornruler
// @license     MIT License
// @match    https://www.grundos.cafe/island/cookingpot/
// @match    https://grundos.cafe/island/cookingpot/
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1065705
// @downloadURL https://update.greasyfork.org/scripts/468004/Grundo%27s%20Cafe%20Cooking%20Pot%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/468004/Grundo%27s%20Cafe%20Cooking%20Pot%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYS = ['item-1', 'item-2', 'item-3'];

    GM_addStyle(`
        .saved-selections {
            margin-top: 1em;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            width: 95%;
            text-align: center;
            align-items: center;
            background-image: linear-gradient(to right, #000000, #D60000);
            border-radius: 20px;
            border: 8px solid #84BD42;  // Our lovely cauldron rim!
            box-shadow: 0px 8px 15px rgba(0,0,0,0.1);
            padding: 15px;
        }
        .saved-selections div {
            border: 1px solid #deb887;
            padding: 8px;
            background-color: #FFE7B9;
            color: black;
            font-weight: bold;
            border-radius: 5px;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
        }



    `);

    const savedSelections = document.createElement('div');
    savedSelections.className = 'saved-selections';

    const images = Array.from(document.querySelectorAll('.center img'));
    const potImage = images.find(img => img.src.includes('jhuidah_pot.gif'));

    if (potImage) {
        potImage.parentNode.insertBefore(savedSelections, potImage.nextSibling);
    }

    function saveSelection(e) {
        const selectedText = e.target.options[e.target.selectedIndex].text;
        localStorage.setItem(e.target.id, selectedText);
        updateSavedSelectionsDisplay();
        console.log(`Adding ${selectedText} to your recipe... 📝`);
    }

    function updateSavedSelectionsDisplay() {
        savedSelections.innerHTML = KEYS.map(key => {
            const itemText = localStorage.getItem(key);
            return itemText ? `<div>${itemText}</div>` : '';
        }).join('');
    }

    const selectionsCleared = KEYS.every(key => {
        const dropdown = document.getElementById(key);
        return dropdown && dropdown.selectedIndex == 0;
    });

    if (selectionsCleared) {
        KEYS.forEach(key => localStorage.removeItem(key));
        console.log('Preparing your Cooking Pot! 🍲');
    }

    updateSavedSelectionsDisplay();

    KEYS.forEach(key => {
        const dropdown = document.getElementById(key);
        if (dropdown) dropdown.addEventListener('change', saveSelection, false);
    });
})();

// ==UserScript==
// @name         GC Item View Remember Choices
// @namespace    http://devipotato.net/
// @version      3
// @description  Makes the inventory item popup remember the actions you take for each item and auto-selects them at grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/itemview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/488992/GC%20Item%20View%20Remember%20Choices.user.js
// @updateURL https://update.greasyfork.org/scripts/488992/GC%20Item%20View%20Remember%20Choices.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let form = document.querySelector('form');
    let dropdown = document.querySelector('#itemaction_select');
    let itemName = document.querySelector('.flex-column.justify-center span').innerText.replace("Item : ","");
    form.addEventListener("submit", async () => {
        await GM.setValue(itemName, dropdown.value);
        await GM.setValue("lastAction", dropdown.value);
    });

    let previousForItem = await GM.getValue(itemName, null);
    let lastAction = await GM.getValue("lastAction", null);

    let desiredAction = previousForItem?previousForItem:lastAction;
    if(desiredAction) {
        // make sure the option exists in the dropdown first
        for(let i=0; i < dropdown.options.length; i++) {
            if(dropdown.options[i].value == desiredAction) {
                dropdown.value = desiredAction;
            }
        }
    }
})();
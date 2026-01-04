// ==UserScript==
// @name         GC - Remove 1 of each item in SDB
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.1
// @description  Add a button to SDB to mark to remove 1 of each item on the page.
// @author       Twiggies
// @match        https://www.grundos.cafe/safetydeposit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481203/GC%20-%20Remove%201%20of%20each%20item%20in%20SDB.user.js
// @updateURL https://update.greasyfork.org/scripts/481203/GC%20-%20Remove%201%20of%20each%20item%20in%20SDB.meta.js
// ==/UserScript==

function mark1OfEach() {
    const itemGrid = document.querySelectorAll('form div.market_grid div.data');
    let allItems = [];
    //We want to loop every 3rd item starting from 7th item.
    for (let i = 6; i < itemGrid.length; i = i+7) {
        itemGrid[i].firstElementChild.value = 1
    }
}


//add button to page.
let remove1Btn = document.createElement('button');
remove1Btn.innerHTML = 'Mark Remove 1 of Each';
remove1Btn.id = 'remove4Btn';
remove1Btn.type = 'button';
remove1Btn.classList.add('form-control');
remove1Btn.style.display = 'block';
remove1Btn.style.margin = 'auto';
remove1Btn.addEventListener('click', function() {
    mark1OfEach();
});
document.querySelector('div.action > label[class="bold"]').insertAdjacentElement('beforebegin', remove1Btn)
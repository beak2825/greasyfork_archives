// ==UserScript==
// @name         GC - Gallery Item Remover from List
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.3
// @description  Mark items to be removed from gallery via a line separated list.
// @author       Twiggies
// @match        https://www.grundos.cafe/gallery/edit/items/?gallery_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480142/GC%20-%20Gallery%20Item%20Remover%20from%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/480142/GC%20-%20Gallery%20Item%20Remover%20from%20List.meta.js
// ==/UserScript==


let galleryList = [];
//This is a regex to remove any rarity brackets that people may have left in lists. ie (r90) or (super rare - r99)
const regexFilter = /\(.*r\d+\)/gi

function rankingSort(sorterTextArea) {
    //console.log(sorterTextArea)
    //Rejoin the items into an array.
    let itemArray = sorterTextArea.value.split(/\r?\n/);
    itemArray = itemArray.filter(n => n);

    //Now we loop through these items...
    for (let i = itemArray.length-1; i >= 0; i--) {
        //And check if we can find them in the itemlist.
        const itemFound = galleryList.find(item => item.innerText.toUpperCase() === itemArray[i].replace(regexFilter,"").toUpperCase().trim())
        //console.log(itemFound);
        //If we found the item...
        if (itemFound != undefined) {
            //Get the previous element from the item (aka the checkbox div) and tick it.
            itemFound.previousElementSibling.firstElementChild.checked = true;
            //Get the NEXT element from the item (aka the remove box) and set it to 1 so it only removes 1 item instead of all items.
            itemFound.nextElementSibling.firstElementChild.value = 1
            //Then remove this item from the item array.
            itemArray.splice(i, 1)
        }
    }
    //Now we put the item array back together and replace the textbox value with it.
    //The only items in this array should be items that could not be found.
    sorterTextArea.value = itemArray.join("\n")

}

//(function() {
//    'use strict';
    //Build the list  of items.
    const itemGrid = document.querySelectorAll('form div.market_grid div.data');

    //We want to loop every 3rd item starting from 2nd item.
    for (let i = 1; i < itemGrid.length; i = i+3) {
        galleryList.push(itemGrid[i])
    }
    //console.log(galleryList);

    //add textbox to page.
    let sorterDiv = document.createElement("div");
    sorterDiv.innerHTML = "Enter a list of items, one per line. Click button and it will go through the list and tick any of the items to be removed in the removed box and remove it from the list. If an item cannot be found (ie typo, not in gallery) it will remain in the list.";
    sorterDiv.id = "sorterDiv";
    let sorterTextArea = document.createElement("textarea");
    sorterTextArea.id = "sorterList";
    sorterTextArea.style.width = "80%";
    sorterTextArea.style.height = "120px";
    sorterTextArea.style.display = 'block';
    sorterTextArea.style.margin = 'auto';
    sorterDiv.appendChild(sorterTextArea);
    let sorterButton = document.createElement('button');
    sorterButton.innerHTML = 'Set to Remove';
    sorterButton.id = 'sorterButton';
    sorterButton.type = 'button';
    sorterButton.style.display = 'block';
    sorterButton.style.margin = 'auto';
    sorterButton.addEventListener('click', function() {
        rankingSort(sorterTextArea);
    });
    sorterDiv.appendChild(sorterButton);
    document.querySelector('div#page_content > section > form[method="POST"]').insertAdjacentElement('beforeend', sorterDiv)
//})();
// ==UserScript==
// @name         GC - Gallery Remove More than x
// @namespace    https://greasyfork.org/en/users/1202961-13ulbasaur
// @version      0.3
// @description  Mark items to be removed from gallery to be at most x if there is more than x of the item, where x is a number you choose.
// @author       Twiggies
// @match        https://www.grundos.cafe/gallery/edit/items/?gallery_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481202/GC%20-%20Gallery%20Remove%20More%20than%20x.user.js
// @updateURL https://update.greasyfork.org/scripts/481202/GC%20-%20Gallery%20Remove%20More%20than%20x.meta.js
// ==/UserScript==


let galleryList = [];
//This is a regex to remove any rarity brackets that people may have left in lists. ie (r90) or (super rare - r99)
const regexFilter = /\(.*r\d+\)/gi

let savedValue = GM_getValue("removeMoreThanVal");
if (savedValue == null) {
    savedValue = 4;
}

function removeMoreThan4() {
    //Get the entered value
    const removeNum = Number(document.getElementById('removeInput').value.trim());

    if (isNaN(removeNum)) {
    }
    else {
        //Get the list of items
        const itemGrid = document.querySelectorAll('form div.market_grid div.data');

        //We want to loop every 3rd item starting from 3rd item (the quantity).
        for (let i = 2; i < itemGrid.length; i = i+3) {
            //Look for value > 4
            if (itemGrid[i].firstElementChild.value > removeNum) {
                //If the value in the input is >4, then we edit it so it removes enough to equal to 4 after.
                //ie, if the value = 5, then set to 1. If the value = 7, then set to 3.
                itemGrid[i].firstElementChild.value = itemGrid[i].firstElementChild.value-removeNum
                //Get the previous element from the 2nd previous item (aka the checkbox div) and tick it.
                itemGrid[i].previousElementSibling.previousElementSibling.firstElementChild.checked = true;

            }
        }
        GM_setValue("removeMoreThanVal", removeNum)
    }
}


//add button to page.
let remove4Btn = document.createElement('button');
remove4Btn.innerHTML = 'Remove More than:';
remove4Btn.id = 'remove4Btn';
remove4Btn.type = 'button';
remove4Btn.style.display = 'inline-block';
remove4Btn.style.margin = 'auto';
remove4Btn.addEventListener('click', function() {
    removeMoreThan4();
});

let removeInput = document.createElement('input');
removeInput.type = "text";
removeInput.id = 'removeInput';
removeInput.classList.add('form-control');
removeInput.style.display = 'inline-block';
removeInput.style.width = '50px';
removeInput.value = savedValue;

let removeDiv = document.createElement('div');
removeDiv.style.margin = 'auto';
removeDiv.style.marginBottom = '5px';
removeDiv.style.width = 'fit-content';
removeDiv.appendChild(remove4Btn);
removeDiv.appendChild(removeInput);

document.querySelector('div#page_content > section:nth-of-type(2) >  form[method="POST"]').insertAdjacentElement('beforebegin', removeDiv)
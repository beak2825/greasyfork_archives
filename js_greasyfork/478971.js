// ==UserScript==
// @name         GC PB/MP Rainbow Pool Links
// @namespace    github.com/13ulbasaur/
// @version      0.1
// @description  Add link to rainbow pool for relevant pet/colour for paint brush and morphing potions when viewing them in your inventory or in the search details
// @author       You
// @match        *://www.grundos.cafe/inventory/
// @match        *://www.grundos.cafe/search/items/?item_name*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478971/GC%20PBMP%20Rainbow%20Pool%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/478971/GC%20PBMP%20Rainbow%20Pool%20Links.meta.js
// ==/UserScript==


//Some paint brushes have weird names. Here is a filter for some of those (more be added as needed)
const paintBrushUrl = 'https://raw.githubusercontent.com/13ulbasaur/GCStuff/main/paintbrushnames.json';


function addRPLinks(paintBrushList) {
    //Look for each item that has the word 'paint brush' or 'morphing potion' or 'transmogrification potion' in it.
    let itemList;
    if (window.location.href == 'https://www.grundos.cafe/inventory/') {
      itemList = document.querySelectorAll('.item-info span:first-child')
    }
    else if (window.location.href.includes('://www.grundos.cafe/search/items/?item_name')) {
      itemList = [document.querySelector('div.item-search-column > p > strong')]
    }
    let isSpecial = false;
    let specialHTML = '';
    //Loop through each item in the list to look for things that fit what we're looking for.
    for (let i = 0; i < itemList.length; i++) {
        specialHTML = '';
        const itemName = itemList[i].innerText.trim();
        if (itemName.endsWith('Paint Brush') || itemName.endsWith('Morphing Potion') || itemName.endsWith('Transmogrification Potion')) {
            let poolLink = '';
            //CHeck if the name actually ends with 'Petpet Paint Brush' in which case add a different link.
            if (itemName.endsWith('Petpet Paint Brush')) {
                //Extract the colour out of the name.
                //Of note, petpets you want the proper capitalisation. With normal pets you want lowercase.
                poolLink = `https://www.grundos.cafe/rainbowpool/petpetcolours/?colour=${itemName.replace('Petpet Paint Brush','').trim()}`
            }
            //Otherwise...
            else if (itemName.endsWith('Paint Brush')) {
                //Extract the colour out of the name.
                let colour = itemName.replace('Paint Brush','').trim().toLowerCase();
                //If the colour is 'Royal' we do something different.
                if (colour == 'royal') {
                    specialHTML = '<a href="https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=royalboy" target="_blank"><img src="https://i.imgur.com/2hXo4VP.png"></a><a href="https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=royalgirl" target="_blank"><img src="https://i.imgur.com/bHUIvzC.png"></a>'
                }
                else if (colour == 'usuki') {
                    specialHTML = '<a href="https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=usukiboy" target="_blank"><img src="https://i.imgur.com/p4Fz9eV.png"></a><a href="https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=usukigirl" target="_blank"><img src="https://i.imgur.com/UkEU2EP.png"></a><a href="https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=quigukiboy" target="_blank"><img src="https://i.imgur.com/cGQnWPv.png"></a><a href="https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=quigukigirl" target="_blank"><img src="https://i.imgur.com/XSmU5iG.png"></a>'
                    //specialHTML = '<a class="usukiRainbowPool" target="_blank"><img src="https://grundoscafe.b-cdn.net/items/rainbowpntbrsh.gif"></a>'
                }
                //If the colour exists in the paintBrushList, use that object's colour instead.
                const colourObj = paintBrushList.find(o => o.name === colour);
                if (colourObj != undefined) {
                    colour = colourObj.colour;
                }
                poolLink = `https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=${colour}`

            }
            else if (itemName.endsWith('Transmogrification Potion')) {
                //Extract the species out of the name to link to mutant page for that species.
                poolLink = `https://www.grundos.cafe/rainbowpool/neopetcolours/?species=${itemName.replace('Transmogrification Potion','').trim().toLowerCase()}&colour=mutant`
            }
            else if (itemName.endsWith('Morphing Potion')) {
                //This will be a two part name. It will be [Colour] [Species] Morphing Potion.
                //So first we will take away the 'Morphing Potion' part of the name, and then split that resulting string by spaces to get the two parts.
                let nameArray = itemName.replace('Morphing Potion', '').trim().toLowerCase().split(' ');

                //Now we make the link.
                poolLink = `https://www.grundos.cafe/rainbowpool/neopetcolours/?colour=${nameArray[0]}&species=${nameArray[1]}`
            }
            //Now that we have the link, we can add the button.
            const adjacentHTML = (specialHTML != "" ? specialHTML : `<a href="${poolLink}" target="_blank"><img src="https://grundoscafe.b-cdn.net/items/rainbowpntbrsh.gif"></a>` )
            if (window.location.href == 'https://www.grundos.cafe/inventory/') {
                itemList[i].parentElement.nextElementSibling.insertAdjacentHTML('beforeend', adjacentHTML)
            }
            else if (window.location.href.includes('://www.grundos.cafe/search/items/?item_name')) {
                document.querySelector('.searchhelp').insertAdjacentHTML('beforeend', adjacentHTML)
            }
        }
    }
}



async function main() {
    const paintBrushList = await fetch(paintBrushUrl).then(res => res.json())
    addRPLinks(paintBrushList);
}

main();
// ==UserScript==
// @name         Selling Button
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  A button in "Key Items" to just keep a choosen amount of all ores! :)
// @author       Lasse98brus
// @match        http://dh2.diamondhunt.co/DH1/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27330/Selling%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/27330/Selling%20Button.meta.js
// ==/UserScript==

console.log("Selling Button by Lasse Brustad is running!");

var val,
    amount,
    stuff = [
        {
            item : 'stone',
            keep : 1e9 // 1b
        },
        {
            item : 'copper',
            keep : 100e6 // 100m
        },
        {
            item : 'tin',
            keep : 100e6 // 100m
        },
        {
            item : 'iron',
            keep : 80e6 // 80m
        },
        {
            item : 'silver',
            keep : 60e6 // 60m
        },
        {
            item : 'gold',
            keep : 50e6 // 50m
        },
        {
            item : 'quartz',
            keep : 30e6 // 30m
        },
        {
            item : 'flint',
            keep : 20e6 // 20m
        },
        {
            item : 'marble',
            keep : 10e6 // 10m
        },
        {
            item : 'titanium',
            keep : 5e6 // 5m
        },
        {
            item : 'promethium',
            keep : 500e3 // 500k
        },
        {
            item : 'runite',
            keep : 5e3 // 5k
        }
    ];

function sellOre() {
    var logger = "Selling Button! here is the results:";
    var dialogue = "You sold some: ";
    var once = false;
    // An allways up-to-date array to check your resources before selling anything
    val = [stone,copper,tin,iron,silver,gold,quartz,flint,marble,titanium,promethium,runite];

    // The statements
    i = 0;
    while(i < stuff.length) {
        if(val[i] > stuff[i].keep) {
            amount = val[i] - stuff[i].keep;
            sell(stuff[i].item, amount);
            logger = logger + "\n" + amount + " of " + stuff[i].item + " is sold!";
            if(once) {
                dialogue = dialogue + ", " + stuff[i].item;
            } else {
                dialogue = dialogue + stuff[i].item;
                once = true;
            }
        }
        i++;
    }

    if(!once) dialogue = 'You didn\'t sell anything';
    dialogue = dialogue + "!";
    console.log(logger); // Detailed selling info
    openDialogue('Sell Button Used!', dialogue); // Only what ores you sold
}

addSellOresButton();
function addSellOresButton() {
    var keyItemTabNode = document.getElementById("key-items-tab");
    if (keyItemTabNode) {
        var GhostNode = keyItemTabNode.querySelector("[tooltip='Click to see what items you have collected.']");
        if (GhostNode) {
            var newNode = GhostNode.cloneNode(true);
            newNode.setAttribute("tooltip", "Click me to sell ores!");
            newNode.childNodes[0].id = "key-item-sellores-button";
            newNode.childNodes[0].onclick = "";
            newNode.childNodes[0].addEventListener("click", function() {
                sellOre();
            });
            var boxTitleNode = newNode.childNodes[0].querySelector(".item-box-title");
            var boxImageNode = newNode.querySelector("[src]");
            boxTitleNode.innerHTML = "Sell Ores";
            boxImageNode.src = "images/icons/donor-icon.gif";
            newNode.childNodes[0].innerHTML = newNode.childNodes[0].innerHTML.replace("Click to Read", "");
            keyItemTabNode.appendChild(newNode);
        }
    }
}
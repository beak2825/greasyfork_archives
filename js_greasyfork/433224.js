// ==UserScript==
// @name         Inventory Duplicate Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Checks items in your inventory and displays a list of any duplicates (this one's for you, kad invent feeders)
// @author       kat (kathryn), adapted from alexa (plushies) search helper script
// @include      *neopetsclassic.com/inventory/*
// @icon         https://www.google.com/s2/favicons?domain=neopetsclassic.com
// @downloadURL https://update.greasyfork.org/scripts/433224/Inventory%20Duplicate%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/433224/Inventory%20Duplicate%20Checker.meta.js
// ==/UserScript==


    var invItems = window.document.getElementsByClassName("inventoryitem")
    var groupedItems = {}
    var duplicates = `<div id="duplicates" style="position:fixed; left:900px; top:50px;"><b>Duplicate Inventory Items</b><br>`

    if (invItems !== undefined){
        for(var i = 0, invItem; invItem = invItems[i]; i++){
            var invText = invItem.innerText.split("(")[0].trim();

            if (invText in groupedItems) {
                groupedItems[invText]++;
            } else {
                groupedItems[invText] = 1;
            }
        }

        for(var item in groupedItems){
            if(groupedItems[item] > 1){
                duplicates = duplicates + item + `: qty ` + groupedItems[item] + `<br>`
            }
        }

    } else {
        duplicates = duplicates + `you own absolutely nothing. how painstakingly tragic :(<br>`
    }

    duplicates = duplicates + `</div>`
    document.getElementsByTagName("body")[0].insertAdjacentHTML("afterbegin", duplicates)



// ==UserScript==
// @name         SWCombine - Link to Rules Page for Entity from Inventory Table
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  Adds another link to the Options Column to take you directly to that entity's rules page, rather than having to chain to it via 'Show Stats'
// @author       You
// @match        https://www.swcombine.com/members/inventory2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swcombine.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522696/SWCombine%20-%20Link%20to%20Rules%20Page%20for%20Entity%20from%20Inventory%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/522696/SWCombine%20-%20Link%20to%20Rules%20Page%20for%20Entity%20from%20Inventory%20Table.meta.js
// ==/UserScript==

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
}

var entityTypeLookup = {};
entityTypeLookup["2"] = "Ships";
entityTypeLookup["3"] = "Vehicles";
entityTypeLookup["5"] = "Space_Stations";
entityTypeLookup["7"] = "Cities";
entityTypeLookup["4"] = "Facilities";
entityTypeLookup["8"] = "Planets";
entityTypeLookup["12"] = "Items";
entityTypeLookup["10"] = "NPCS";
entityTypeLookup["13"] = "Droids";
entityTypeLookup["11"] = "Creatures";
entityTypeLookup["16"] = "Raw_Materials";

(function() {
    'use strict';

    let table = document.querySelector('.inventory_list_table');

    for (let row of table.children) {
        if(row.querySelector('.inventory_entity_row')) {
            let entityType = document.location.href.split('entityType=')[1].match(/^\d*/);

            let entityID = -1;
            if(row.querySelector('a[href*="images.swcombine"]')) {
                entityID = row.querySelector('a[href*="images.swcombine"]').href.split('/')[5];
            }
            if(row.querySelector('a[href*="custom.swcombine"]')) {
                entityID = row.querySelector('a[href*="custom.swcombine"]').href.split('/')[5];
            }

            if(entityID != -1) {
                let newLink = "/rules/?" + entityTypeLookup[entityType] + "&ID=" + entityID;
                let newElement = createElementFromHTML("<a href='"+newLink+"'>Show Rules Page</a><br />");

                let optionsCol = row.querySelector('.inventoryStatusIcons+td');
                optionsCol.append(newElement);
            }
        }
    }
})();
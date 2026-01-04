// ==UserScript==
// @name         [DEPRECATED] GC - Select Zappable Petpets
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Make the Petpet Lab only show certain Petpets
// @author       mana + z
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://www.grundos.cafe/petpetlab/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540444/%5BDEPRECATED%5D%20GC%20-%20Select%20Zappable%20Petpets.user.js
// @updateURL https://update.greasyfork.org/scripts/540444/%5BDEPRECATED%5D%20GC%20-%20Select%20Zappable%20Petpets.meta.js
// ==/UserScript==

/*
    Put the IDs of the Petpets you WANT TO ZAP here.
    
    To get the Petpet IDs, follow https://imgur.com/a/ARXLOxx (Thank you, Z!)
*/
const petpetsToShow = [
    'petpet_534e73d8-ec67-45ad-a2d0-dd467319bbba', // example
    'ece3d7b6-f726-46a4-bf6d-8d4f4acbe8af', // example
];


/* Add additional CSS style */
$(`<style type='text/css'>
    .selectable-item .flex-column {
        align-items: center;
    }
    .selectable-item {
        justify-content: center;
    }
    .selectable-item .medfont {
    display: block;
    }
    </style>`).appendTo("head");

function showPetpets() {
    'use strict';

    // Hide all P2s first
    $('div.selectable-item').hide();

    for(let i = 0; i < petpetsToShow.length; i++) {
        let petpetId = petpetsToShow[i];
        let petpetLabels = $("label[for*='" + petpetId + "']");
        if(petpetLabels == undefined) continue;

        let petpetLabel = petpetLabels[0];
        let petpetDiv = petpetLabel.parentElement;
        console.log(`Showing petpet ${petpetLabel.innerText} (id ${petpetId})`);
        petpetDiv.style.display = 'inline-grid';
    }
}

showPetpets();
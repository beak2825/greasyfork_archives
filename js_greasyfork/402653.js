// ==UserScript==
// @name         Shadowverse Portal Deck Builder to Decklist
// @namespace    https://shadowverse-portal.com/
// @version      0.1
// @description  Add a button to take you from deck builder page to decklist without saving
// @author       Toka-MK
// @match        https://shadowverse-portal.com/deckbuilder/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402653/Shadowverse%20Portal%20Deck%20Builder%20to%20Decklist.user.js
// @updateURL https://update.greasyfork.org/scripts/402653/Shadowverse%20Portal%20Deck%20Builder%20to%20Decklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var viewButton = document.createElement('div');
    viewButton.innerHTML = '<br><button id="viewButton" class="deckbuilder-deck-save-button">View Decklist</button>'
    document.querySelector("#deckbuilder > div > div.deckbuilder-deck > div > div.deckbuilder-deck-save").appendChild(viewButton);

    document.querySelector("#viewButton").addEventListener("click", ViewDecklist, false);
    function ViewDecklist(event) {
        var hash = window.location.href.split(/hash=|&lang/)[1];
        window.location.href = 'https://shadowverse-portal.com/deck/' + hash;
    }
})();
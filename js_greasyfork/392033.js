// ==UserScript==
// @name         DC - MobileFixes
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Fix player interactions with draggable boxes
// @author       Ajira
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.eu/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392033/DC%20-%20MobileFixes.user.js
// @updateURL https://update.greasyfork.org/scripts/392033/DC%20-%20MobileFixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* TODO ==============================================
       - Should loop on class identified objects like AITL
    =================================================== */

    // Stop event propagation
    function disableEvent(event) {
        event.stopPropagation();
    }

    // Trigger fix only if a dialogbox is popup
    document.getElementById("zone_lightBox").addEventListener('DOMNodeInserted', function() {
        // Check if the dialogbox contains a digicode input
        var digiInput = document.getElementById("lb_textinput_digicode");
        if (digiInput === null) { return; }
        // Search the parent form of the digicode
        var digiForm = digiInput.parentNode.parentNode;
        if (digiForm === null) { return; }
        // Search the dialogbox which contains the form
        var digiBox = digiForm.parentNode.parentNode;
        if (digiBox === null) { return; }
        // Disable draggable event which are in conflict with input click on mobile
        digiBox.removeEventListener("touchstart", disableEvent);
        digiBox.addEventListener("touchstart", disableEvent, true);
    }, false);

    /* === FROM HERE ==========================
       Other experiments
       - Allow scrolling on long AITL offers
       - Allow to enter price in exchanges form
       - Allow to use decks
       - Allow to set price in centrale
    ======================================== */

    // Trigger fix only if a databox is popup
    document.getElementById("zone_dataBox").addEventListener('DOMNodeInserted', function() {
        // Check if the databox contains an aitl offer page
        var aitlPages = document.getElementsByClassName("aitl_page");
        if (aitlPages.length == 0) { return; }
        // Search for the AITL box
        var aitlBox = aitlPages[0].parentNode.parentNode.parentNode.parentNode;
        if (aitlBox === null) { return; }
        // Disable draggable event which are in conflict with scroll
        aitlBox.removeEventListener("touchstart", disableEvent);
        aitlBox.addEventListener("touchstart", disableEvent, true);
    }, false);

    // Trigger fix only if a dialogbox is popup
    document.getElementById("zone_dataBox").addEventListener('DOMNodeInserted', function() {
        // Check if the dialogbox contains a exchange input
        var priceInput = document.getElementById("champ_credits");
        if (priceInput === null) { return; }
        // Search the parent form of the exchange
        var priceForm = priceInput.parentNode.parentNode;
        if (priceForm === null) { return; }
        // Search the dialogbox which contains the form
        var priceBox = priceForm.parentNode;
        if (priceBox === null) { return; }
        // Disable draggable event which are in conflict with input click on mobile
        priceBox.removeEventListener("touchstart", disableEvent);
        priceBox.addEventListener("touchstart", disableEvent, true);
    }, false);

    // Trigger fix only if a dialogbox is popup
    document.getElementById("zone_dataBox").addEventListener('DOMNodeInserted', function() {
        // Check if the databox contains a deck
        var deckFroms = document.getElementsByClassName("deck_main");
        if (deckFroms.length == 0) { return; }
        // Search for the deck screen
        var deckScreen = deckFroms[0].parentNode.parentNode.parentNode;
        if (deckScreen === null) { return; }
        // Disable draggable event which are in conflict with scroll
        deckScreen.removeEventListener("touchstart", disableEvent);
        deckScreen.addEventListener("touchstart", disableEvent, true);
    }, false);

    // Trigger fix only if a dialogbox is popup
    document.getElementById("zone_lightBox").addEventListener('DOMNodeInserted', function() {
        // Check if the dialogbox contains price input
        var centraleForm = document.getElementById("lb_form_centrale_vente_prix");
        if (centraleForm == null) { return; }
        console.info(centraleForm);
        // Centrale form dialogbox
        var centraleBox = centraleForm.parentNode.parentNode.parentNode.parentNode;
        if (centraleBox === null) { return; }
        console.info(centraleBox);
        // Disable draggable event which are in conflict with input click on mobile
        centraleBox.removeEventListener("touchstart", disableEvent);
        centraleBox.addEventListener("touchstart", disableEvent, true);
    }, false);

})();
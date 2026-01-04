// ==UserScript==
// @name         Reaction Scroll Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Raccourcis (scroll bar) pour réaction
// @author       ArtesEveni
// @match        https://www.dreadcast.net/Main
// @match        https://www.dreadcast.eu/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393413/Reaction%20Scroll%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/393413/Reaction%20Scroll%20Bar.meta.js
// ==/UserScript==

// objet all reactions
const optionElts = {
    "": "",
    "Ricane": "/me ricane",
    "Rit": "/me rit",
    "Se marre": "/me se marre",
    "Sourit": "/me sourit",
    "Ecoute": "/me ecoute",
    "Dors": "/me s'endort",
    "Incline la tête": "/me incline la tête de côté",
    "Regarder": "/me les regarde avec attention",
    "Ferme yeux": "/me ferme les yeux",
    "Lancer dés": "/roll"
};


(() => {
    'use strict';
    ///////////////
    /* Variable */
    /////////////
    let formElt = $("#chatForm"),
    inputFormELt = $("form#chatForm input.text_chat"),
    selectElt = $('<select name="reaction" id="reaction" size="1" maxlength="1">');

    // append the elements
    for (const property in optionElts) {
        selectElt.append($(`<option value="${optionElts[property]}">${property}</option>`));
    }
    formElt.prepend(selectElt);
    // add attribue selected on the first option
    $('#chatForm select option:first').attr("selected");

    //////////
    /* CSS */
    ////////
    // set css of the form
    formElt.css({
        "padding": "0",
    });
    // set css of the select element
    $("#chatForm select").css({
        "width": "20px",
        "border": "1px solid #7ec8d8",
        "background-color": "#7ec8d8",
        "padding-bottom": "1px"
    });
    // hover select element
    $("#chatForm select").hover(
        function() {
            $(this).css({
                "background-color": "",
                "border": "1px solid #10426b",
                "color": "#7ec8d8"
            });
        },
        function() {
            $(this).css({
                "border": "1px solid #7ec8d8",
                "background-color": "#7ec8d8",
                "color": "#10426b"
            });
        }
    );
    //set css of the input (form)
    inputFormELt.css({
        "width": "210px"
    });

    ////////////////
    /* Execution */
    //////////////
    // get the selected option value and set it in the input (form)
    selectElt.change( function() {
        inputFormELt.val(this.value);
    });
    console.log("Reaction Scroll Bar is loaded.");
})();
// ==UserScript==
// @name         download deck from duelingnexus.com
// @namespace    http://tampermonkey.net/s
// @version      1.42
// @description  Duelingnexus.com mod for having extension tools ready that you can use including downloading decks.
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @author       stealth_angel
// @match        https://duelingnexus.com/editor/*
// @match        https://duelingnexus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37588/download%20deck%20from%20duelingnexuscom.user.js
// @updateURL https://update.greasyfork.org/scripts/37588/download%20deck%20from%20duelingnexuscom.meta.js
// ==/UserScript==

//NOTE THAT ONLY SAVED DECKS CAN BE DOWNLOADED So if you are building the deck click save and refresh the page; then this code works

if (window.location.href.indexOf('https://duelingnexus.com/editor/') > -1) {
    function download(data, filename, type) {
        var file = new Blob([data], {
            type: type
        });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    /*
     * Make a text line with added \r\n so we have line breaks in notepad
     *
     * @param String value
     * return String
     */
    function textLine(value) {
        return value + "\r\n";
    }

    /*
     * Get the deckname based on the websites deckname
     *
     * return String
     */
    function fileName() {
        filename = document.getElementsByClassName("editor-deck-name")[0].innerHTML;
        return filename + ".ydk";
    }


    /*
     * function for generating text for in text file
     *
     * @param String value
     * return String
     */
    function deckString() {
        //we make a string called deck
        var deck = "";

        /* here we push the retrieved value into the deck variable */

        //here we say created by no one -- can't find a way to retrieve the username
        deck += textLine("#created by ... ");

        //create main deck
        deck += textLine("#main");
        jQuery.each(Deck.main, function(i, val) {
            deck += textLine(val);
        });

        //create extra deck
        deck += textLine("#extra");
        jQuery.each(Deck.extra, function(i, val) {
            deck += textLine(val);
        });

        //create side deck
        deck += textLine("!side");
        jQuery.each(Deck.side, function(i, val) {
            deck += textLine(val);
        });

        //return the string
        return deck;
    }

    $('#editor-menu-content').append(`<button id="downloadDeck" class="engine-button engine-button-navbar engine-button-default" style="width: auto;">Download</button>`);


    $("#downloadDeck").click(function() {
        download(deckString(), fileName(), "");
    });
}
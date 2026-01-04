// ==UserScript==
// @name         Flight Rising - Auction House Keyboard Navigation
// @namespace    https://greasyfork.org/users/547396
// @version      0.1
// @description  Allows user to navigate Auction House results pages using left- and right-arrow buttons.
// @author       Jicky
// @match        https://www1.flightrising.com/auction-house/buy/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426066/Flight%20Rising%20-%20Auction%20House%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/426066/Flight%20Rising%20-%20Auction%20House%20Keyboard%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeydown = function(e) {
        switch(e.which) {
            case 39: // right arrow
                gotoNextPage();
                break;
            case 37: // left arrow
                gotoPrevPage();
                break;
            default: return;
        }
        e.preventDefault();
    };

    function gotoNextPage() {
        var num = parseNextPageNum();
        if (num) { ahNavPage(num); } else { return false; }
    }
    function gotoPrevPage() {
        var num = parsePrevPageNum();
        if (num) { ahNavPage(num); } else { return false; }
    }


    // PARSING
    // ------

    function parseNextPageNum() {
        var btn = document.querySelector('a.common-pagination-arrow-next');
        if (!btn) { return false; }
        var matches = btn.getAttribute('href').match(/\d+/);
        return parseInt(matches[0]);
    }
    function parsePrevPageNum() {
        var btn = document.querySelector('a.common-pagination-arrow-previous');
        if (!btn) { return false; }
        var matches = btn.getAttribute('href').match(/\d+/);
        return parseInt(matches[0]);
    }

})();
// ==UserScript==
// @name         Flight Rising - Market Keyboard Navigation
// @namespace    https://greasyfork.org/users/547396
// @version      0.1
// @description  Allows user to navigate Market pages using left- and right-arrow buttons.
// @author       Jicky
// @match        https://www1.flightrising.com/market*
// @match        https://www1.flightrising.com/market/*
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426663/Flight%20Rising%20-%20Market%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/426663/Flight%20Rising%20-%20Market%20Keyboard%20Navigation.meta.js
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
        let btn = nextButton();
        if (btn) { btn.click(); }
    }
    function gotoPrevPage() {
        let btn = prevButton();
        if (btn) { btn.click(); }
    }


    // PARSING
    // ------

    function nextButton() {
        let btn=document.querySelector('span.common-pagination-arrow-next');
        if (btn.querySelector('img[src="/static/layout/pagination/pagination-next.png"]')) {
            return btn;
        }
    }
    function prevButton() {
        let btn=document.querySelector('span.common-pagination-arrow-previous');
        if (btn.querySelector('img[src="/static/layout/pagination/pagination-previous.png"]')) {
            return btn;
        }
    }

})();
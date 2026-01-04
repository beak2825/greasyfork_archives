// ==UserScript==
// @name         Open Amazon Book in Goodreads
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add a button to the purchase/download section to search the book on Goodreads.
// @author       You
// @match        https://www.amazon.com.au/gp/product/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com.au
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/428164/Open%20Amazon%20Book%20in%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/428164/Open%20Amazon%20Book%20in%20Goodreads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var panel = $('#buyOneClick');
    var button = document.createElement('BUTTON');
    button.innerHTML = "Search on Goodreads";
    button.id = "btnSearchOnGoodreads";
    button.style.display = "flex";
    button.style.margin = "auto";
    button.style.marginBottom = "10%";
    panel.before(button);

    $('#btnSearchOnGoodreads').click(function() {
        window.location.href = "https://www.goodreads.com/search?q=" + document.location.href.split('/')[5].split('?')[0]
    });

})();
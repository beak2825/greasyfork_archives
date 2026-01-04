// ==UserScript==
// @name         Amazon in-stock only
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Conceal 'out of stock' items from Amazon search results
// @author       Matt Miller
// @match        http*://www.amazon.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/417059/Amazon%20in-stock%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/417059/Amazon%20in-stock%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var phantomKiller = function() {
        var items = $('div.a-row.a-size-base.a-color-secondary:contains("Out of Stock")');
        var hiddenItems = 0;
        items.each(function(index, element){
            var itemContainer = $(this).parent().parent().parent().parent().parent().parent();
            if ( $(itemContainer).is( ":visible" ) ) {
                itemContainer.hide();
                hiddenItems = hiddenItems + 1;
                //console.log("out of stock item concealed");
            }
        });
        if (hiddenItems > 0) {
            console.log("" + hiddenItems + " out of stock items concealed");
        }
        setTimeout(phantomKiller, 1000);
    };
    setTimeout(phantomKiller, 100);
})();

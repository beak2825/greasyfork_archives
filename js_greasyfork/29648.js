// ==UserScript==
// @name         MLB The Show Nation - Inventory Expander 17
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2017.6
// @description  Expands inventory screens to include ALL cards, not just a few at a time.  Also provides a DUPES button to only show duplicate cards.
// @author       sreyemnayr
// @match        http://theshownation.com/inventory?*
// @match        http://www.theshownation.com/inventory?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29648/MLB%20The%20Show%20Nation%20-%20Inventory%20Expander%2017.user.js
// @updateURL https://update.greasyfork.org/scripts/29648/MLB%20The%20Show%20Nation%20-%20Inventory%20Expander%2017.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var table = $('.marketplace-search');
    var pagination_links = $('.moreLinks a:not(.next_page)');
    
    $(pagination_links).each(function(i){
        var url = $(this).attr('href');
        $.ajax({url:url, context:this}).done(function(b){ 
            var thisTable = $(b).find('.marketplace-search');

            $(table).append($(thisTable).children());

        });
    });
    var btn = document.createElement('button');
    btn.appendChild(
        document.createTextNode("DUPES")
    );
    btn.className = 'btn btn-xs btn-success';
    $('.title-bar')[0].append(btn);
    
    $(btn).click(function(i){
        $($(table).find('tr')).each(function(i){
            var owned = parseInt($($(this).find('td')[2]).text());
            if(isNaN(owned) || owned <= 1){
                $(this).hide();
            }

        });
        console.log("click");
    });
    
})();
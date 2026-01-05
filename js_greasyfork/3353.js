// ==UserScript==
// @name       SteamEndlessPages
// @namespace  SteamEndlessPages
// @version    0.2
// @match      http://steamcommunity.com/market/search*
// @description Keeps previous pages visible in the steam market.
// @downloadURL https://update.greasyfork.org/scripts/3353/SteamEndlessPages.user.js
// @updateURL https://update.greasyfork.org/scripts/3353/SteamEndlessPages.meta.js
// ==/UserScript==

var $ = $J;
var count = 0;

function changeId(elem) {
    elem.each(function() { this.id = this.id + count; });
}

$J('#searchResultsTable .market_paging_summary').append(' ').append('<a onclick="$J(\'.previousSearchResults\').remove()">(clear previous)</a>');

$('#searchResults_controls > .pagebtn, #searchResults_controls .market_paging_pagelink').click(function() {
    count++;
    var clone = $('#searchResultsTable').clone().addClass('previousSearchResults');
    changeId(clone);
    changeId(clone.find('#searchResultsRows, #searchResults_links, #searchResults_controls, #searchResults_start, #searchResults_end, #searchResults_total'));
    $('#searchResultsTable').before(clone);
});


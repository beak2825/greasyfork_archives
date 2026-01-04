// ==UserScript==
// @name         AO3: [Wrangling] Sort Fandoms by Number of Unwrangled Tags
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @version      3.2
// @description  sort the fandoms on your Wrangling Home by their number of unwrangled tags
// @author       escctrl
// @match        https://*.archiveofourown.org/tag_wranglers/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479452/AO3%3A%20%5BWrangling%5D%20Sort%20Fandoms%20by%20Number%20of%20Unwrangled%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/479452/AO3%3A%20%5BWrangling%5D%20Sort%20Fandoms%20by%20Number%20of%20Unwrangled%20Tags.meta.js
// ==/UserScript==
 
(function($) {
    'use strict';
 
    // set this to true if you want the page to automatically sort fandoms by the total number of unwrangled tags
    const AUTO_SORT_BY_TOTAL = false;
 
    // for each (visible) line sum up the total unwrangleds
    $('.assigned table tbody tr').each( function() {
        let uws = 0;
        $(this).find('td[title*="unwrangled"] a').each( function() {
            uws += parseInt(this.innerText.match(/\d+/)[0]);
        });
        $(this).find('th').append(`<span class="uwtotal" style="display: none;">${uws}</span>`);
    });
 
    // keep a copy of the original order so we don't have to worry about which letter the fandom actually sorts by (e.g. ignoring "The")
    let fandoms_orig = $('.assigned table tbody tr');
 
    // build a button for sorting (by total unwrangleds, by fandom name)
    var char = false, rel = false, ff = false;
    $('.assigned table thead th').each((i, cell) => {

        for (let cnt of $(cell).contents()) {
            if (cnt.nodeType === 3) {
                if (cnt.textContent == "Fandom") $(cnt).wrap(`<a id="sortname" title="Sort fandoms alphabetically" href="javascript:void(0)"></a>`);
                else if (cnt.textContent == "Unwrangled") $(cnt).wrap(`<a id="sortunwrangled" title="Sort by total number of unwrangled tags" href="javascript:void(0)"></a>`);
                else if (cnt.textContent == "Characters") {
                    if (char) $(cnt).wrap(`<a id="sortchars" title="Sort by number of unwrangled character tags" href="javascript:void(0)"></a>`);
                    char = !char; // we don't create the link on the first (Unfilterable), but on the second instance (Unwrangled) of this content
                }
                else if (cnt.textContent == "Relationships") {
                    if (rel) $(cnt).wrap(`<a id="sortrels" title="Sort by number of unwrangled relationship tags" href="javascript:void(0)"></a>`);
                    rel = !rel; // we don't create the link on the first (Unfilterable), but on the second instance (Unwrangled) of this content
                }
                else if (cnt.textContent == "Freeforms") {
                    if (ff) $(cnt).wrap(`<a id="sortff" title="Sort by number of unwrangled freeform tags" href="javascript:void(0)"></a>`);
                    ff = !ff; // we don't create the link on the first (Unfilterable), but on the second instance (Unwrangled) of this content
                }
            }
        }
    });
 
    // add event triggers
    $('.assigned').on("click", '#sortname', resortByName);
    $('.assigned').on("click", '#sortunwrangled, #sortchars, #sortrels, #sortff', resortByColumn);

 
    if (AUTO_SORT_BY_TOTAL) $('#sortunwrangled').trigger('click');
 
    function resortByColumn(e) {
        // define the column to sort by => the selector of where we retrieve the sort number from
        let column = e.target.id == "sortunwrangled" ? 'th[title="fandom"] .uwtotal' : // total UW
                 e.target.id == "sortchars" ? 'td[title*="unwrangled"][title*="char"] a' : // UW chars
                 e.target.id == "sortrels" ? 'td[title*="unwrangled"][title*="rel"] a' : // UW rels
                 'td[title*="unwrangled"][title*="free"] a'; // UW freeforms
 
        let fandoms = $('.assigned table tbody tr').toArray();
 
        // sort them by order (most UWs to least)
        fandoms.sort(function(a, b) {
            let uw_a = $(a).find(column).text() || "0";
                uw_a = parseInt(uw_a.match(/\d+/)[0]);
            let uw_b = $(b).find(column).text() || "0";
                uw_b = parseInt(uw_b.match(/\d+/)[0]);
            return uw_b-uw_a;
        });
 
        // remove current content/order and insert the new sorted order instead
        $('.assigned table tbody tr').remove();
        $('.assigned table tbody').append(fandoms);
    }
 
    function resortByName(e) {
        // remove the current content/order and insert the original order instead
        $('.assigned table tbody tr').remove();
        $('.assigned table tbody').append(fandoms_orig);
    }
 
})(jQuery);
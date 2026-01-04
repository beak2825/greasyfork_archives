// ==UserScript==
// @name         Faithlife Community Forum Search2G
// @namespace    https://github.com/simsrw73/userscripts
// @version      0.7.7
// @description  Send forum searches to Google Search
// @author       Randy W. Sims
// @license      MIT
// @match        https://community.logos.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369856/Faithlife%20Community%20Forum%20Search2G.user.js
// @updateURL https://update.greasyfork.org/scripts/369856/Faithlife%20Community%20Forum%20Search2G.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TODO: More than one search button ID across website
    //       Profile & Favorites page Search btn:  ctl00_bhcr_sr_SearchForm1_ctl00_TitleBarSearchButton

    var searchButtonID = 'ctl00_ctl00_bhcr_sr_sr_ctl00_ctl00_TitleBarSearchButton';
    var SearchInputID = 'ctl00_ctl00_bhcr_sr_sr_ctl00_ctl00_TitleBarSearchText';

    var searchEngine = 'https://www.google.com/search?q=';

    var siteLogosForums  = 'site:community.logos.com';
    var siteLogosWiki    = 'site:wiki.logos.com';
    var siteLogosSupport = 'site:logos.com/support';

    var basicSearch = siteLogosForums;
    var superSearch = '(' + siteLogosSupport + ' OR ' + siteLogosWiki + ' OR ' + siteLogosForums + ')';

    var searchGoogle = function(isSuperSearch) {
        var searchInput = document.getElementById(SearchInputID);
        if (searchInput == null || searchInput.value == '') { return; } /* No search term entered */

        var searchQuery = searchEngine + encodeURI((isSuperSearch ? superSearch : basicSearch) + ' ' + searchInput.value);
        window.location.href = searchQuery;
    }

    var searchButton = document.getElementById(searchButtonID);
    if (searchButton == null) { return; } /* No Searchbar here... nothing to do */

    var searchInput = document.getElementById(SearchInputID);
    if (searchInput != null ) { searchInput.placeholder = 'Search Google...'; }

    searchButton.addEventListener('click', function(e) {
        if (e.shiftKey) {
            return; /* fall through to the default search */
        } else if (e.ctrlKey) {
            e.preventDefault();
            searchGoogle(true);
        } else {
            e.preventDefault();
            searchGoogle(false);
        }
    });

    window.onkeydown = function(e) {
        if (e.keyCode == 13) { /* Enter key */
            if (e.shiftKey) {
                return; /* fall through to the default search */
            } else if (e.ctrlKey) {
                searchGoogle(true);
            } else {
                searchGoogle(false);
            }
        } else if (e.keyCode == 83 && e.altKey) { /* Alt-s shortcut to activate search input */
            var searchInput = document.getElementById(SearchInputID);
            if (searchInput != null) { searchInput.focus(); }
        }
    };

    return;

})();

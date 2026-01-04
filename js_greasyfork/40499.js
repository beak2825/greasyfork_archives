// ==UserScript==
// @name       WaniKani URL Keyword search
// @namespace   irrelephant
// @description Make it possible to search WaniKani by using a URL parameter https://www.wanikani.com/dashboard?q= so that you can register this search in your chrome keyword searches
// @author     irrelephant
// @version    1.0.0
// @include https://www.wanikani.com/dashboard*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40499/WaniKani%20URL%20Keyword%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/40499/WaniKani%20URL%20Keyword%20search.meta.js
// ==/UserScript==


(function () {
    'use strict';
    console.log('#### Starting WaniKani URL Keyword search.... ');
    init();

    function init() {
        var searchTerm = getSearchTerm();
        if (searchTerm) {
            submitSearch(searchTerm);
        }
    }

    function getSearchTerm() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var q = url.searchParams.get('q');
        console.log('Search parameter q was ' + q);
        return q;
    }

    /**
     * Simulate search form submit
     * @param searchTerm
     */
    function submitSearch(searchTerm) {
        var searchField = document.getElementById('query');
        searchField.value = searchTerm;

        var searchForm = document.getElementById('search-form');
        var submitProps = {
            bubbles: true,
            target: searchForm,
            type: 'submit'
        };
        var e = new Event('submit', submitProps);
        searchForm.dispatchEvent(e);
    }
})();
// ==UserScript==
// @name         Startpage.com search term to page title
// @version      1.0
// @description  Adds the Startpage.com search term to page title for making it easier to tell tabs apart
// @author       Lynoure Braakman
// @match        https://startpage.com/sp/search*
// @match        https://startpage.com/do/search*
// @match        https://startpage.com/do/dsearch*
// @match        https://www.startpage.com/sp/search*
// @match        https://www.startpage.com/do/search*
// @match        https://www.startpage.com/do/dsearch*
// @match        https://eu.startpage.com/sp/search*
// @match        https://eu.startpage.com/do/search*
// @match        https://eu.startpage.com/do/dsearch*
// @run-at       document-end
// @license      GPL v3+
// @namespace https://greasyfork.org/users/1497419
// @downloadURL https://update.greasyfork.org/scripts/543363/Startpagecom%20search%20term%20to%20page%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/543363/Startpagecom%20search%20term%20to%20page%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let query;

    function getSearchQuery() {
        const params = new URLSearchParams(window.location.search);
        // Try URL parameter 'q'
        let searchParam = params.get('q');
        if (searchParam) return searchParam;

        const input = document.querySelector('input.search-form-input');
        const searchTerm = input?.value || '';
        return searchTerm;
    }

    query = getSearchQuery();

    if (query) {
        document.title = query + ' - Startpage.com';
    } else {
        document.title = "STARTPAGE.COM SEARCH - TAMPERMONKEY SCRIPT NEEDS UPDATING";
    }
})();
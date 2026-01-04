// ==UserScript==
// @name         KpopTap Query Stays After Searching
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Puts your query back into the search box after you search something on KpopTap so you don't have to retype it just to make a minor change.
// @author       An Orbit
// @match        https://kpoptap.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kpoptap.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470704/KpopTap%20Query%20Stays%20After%20Searching.user.js
// @updateURL https://update.greasyfork.org/scripts/470704/KpopTap%20Query%20Stays%20After%20Searching.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urlParams = new URLSearchParams(window.location.search);

    var query = urlParams.get("s"); //Get last search query

    //If there is a query
    if(query) {
        //On load
        window.addEventListener("load",function() {
            //Find every search box
            var searchBoxes;
            searchBoxes = document.querySelectorAll('.jeg_search_input');
            if(searchBoxes.length == 0) {
                searchBoxes = document.querySelectorAll('[name="s"]')
            };

            //And set its contents to the query
            for(var i = 0; i < searchBoxes.length; i++) {
                searchBoxes[i].value = query
            }
        })
    }

})();
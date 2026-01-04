// ==UserScript==
// @name         KpopJjang/HulNews/HulKpop Query Stays After Searching
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Puts your query back into the search box after you search something on KpopJjang (aka Hulnews aka HULKPOP) so you don't have to retype it just to make a minor change.
// @author       An Orbit
// @match        https://hulnews.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hulnews.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486238/KpopJjangHulNewsHulKpop%20Query%20Stays%20After%20Searching.user.js
// @updateURL https://update.greasyfork.org/scripts/486238/KpopJjangHulNewsHulKpop%20Query%20Stays%20After%20Searching.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urlParams = new URLSearchParams(window.location.search);

    var query = urlParams.get("s"); //Get last search query

    //If there is a query
    if(query) {
        //On load
        window.addEventListener("load",function() {
            //Find the search box
            var searchBox;
            searchBox = document.getElementById("s");
            if(!searchBox) {
                searchBox = document.querySelectorAll('[name="s"]')
            };
            if(!searchBox) {
                searchBox = document.querySelector('[value="Search the site"]')
            };

            //And set its contents to the query
            searchBox.value = query
        })
    }
})();
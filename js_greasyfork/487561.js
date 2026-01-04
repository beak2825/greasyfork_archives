// ==UserScript==
// @name         YouTube Search Middle Click
// @namespace    YSMC
// @version      1.0
// @description  This extension allows you to open a YouTube search on a new tab by middle-clicking the search button.
// @author       Rafael-r15
// @match        https://www.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487561/YouTube%20Search%20Middle%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/487561/YouTube%20Search%20Middle%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var searchIcon = document.getElementById("search-icon-legacy");
    if (searchIcon) {
        searchIcon.addEventListener("mousedown", function(event) {
            event.preventDefault();
            var searchInput = document.getElementsByClassName("ytd-searchbox")[3].value.trim();
            if (event.which === 2 && searchInput) {
                window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(searchInput), "_blank");
            }
        });
    }
})();



// ==UserScript==
// @name         Google Homepage Script - Prompt For Text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show a string in Google below the search bar if "alternate language notice" exists, otherwise: Text in searchbox
// @author       spookyahell
// @match        https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377068/Google%20Homepage%20Script%20-%20Prompt%20For%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/377068/Google%20Homepage%20Script%20-%20Prompt%20For%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.startsWith("https://www.google")) {
    var langdivtag = document.getElementById("gws-output-pages-elements-homepage_additional_languages__als");
    if (langdivtag !== null) {
        langdivtag.innerHTML = prompt("Enter any text here and it will wind up on Google, below the searchbox", "Harry Potter");
                            } else {
                                var x = document.getElementsByName("q")[0];
                                x.setAttribute("placeholder", prompt("Since below searchbox is not available for you, we will set the searchbox hint instead", "Harry Potter"))
                            } }


    // Your code here...
})();
// ==UserScript==
// @name        Itch.io Autoclaim
// @namespace   Wertible@Greasyfork
// @match       *://*.itch.io/*/download/*
// @version     1.0.0
// @author      Wertible
// @description Automatically claims all games from bundles into Itch.io libraries
// @connect     itch.io
// @downloadURL https://update.greasyfork.org/scripts/405532/Itchio%20Autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/405532/Itchio%20Autoclaim.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function handlePage() {
        if (!window.location.toString().includes("/bundle/download")) {
            window.history.back();
        } else if (document.forms.length === 3) {
            var end = /page.*/;
            var digits = /\d+/;
            var location = window.location.toString();
            var locParts = [location.replace(end, ""), location.match(end)[0]];
            var page = parseInt(locParts[1].match(digits)[0]) + 1;
            var newPageLocPart = "page=" + page;
            var newLoc = locParts[0] + newPageLocPart;
            window.location.replace(newLoc);
        } else if (document.forms.length > 3) {
            document.forms[3].children[2].click();
        } else if (document.forms.length < 3) {
            alert("Autoclaiming completed!");
        }
    }
    handlePage();
})();
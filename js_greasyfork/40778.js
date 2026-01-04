// ==UserScript==
// @name        SokBar
// @namespace   com.koster1889.dev
// @description Search bar selection by key shortcut.
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40778/SokBar.user.js
// @updateURL https://update.greasyfork.org/scripts/40778/SokBar.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const L_KEY = 76;

    const currentLocation = new URL(window.location).hostname;

    const searchElementFinders = {
        "sv.wikipedia.org": function() {
            return document.getElementById("searchInput");
        },
        "en.wikipedia.org": function() {
            return document.getElementById("searchInput");
        },
        default: function() {
            return document.getElementsByName("q")[0];
        }
    };

    window.onkeyup = function(e) {
        const key = e.keyCode ? e.keyCode : e.which;
        if (key === L_KEY && e.shiftKey && e.ctrlKey) {
            findElement();
        }
    };

    const finder = searchElementFinders[currentLocation] || searchElementFinders.default;

    function findElement() {
        var searchElement = finder();
        if (searchElement) {
            searchElement.select();
        } else {
            console.debug("Sokbar: No search input found for %s", currentLocation);
        }
    }

})();

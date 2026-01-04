// ==UserScript==
// @name         PoE Trade fuzzy search
// @description  Prepends '~' to all filter searches. Type a space ' ' before a search to use non-fuzzy search.
// @version      1.0
// @namespace    https://greasyfork.org/users/725210
// @match        www.pathofexile.com/trade/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419903/PoE%20Trade%20fuzzy%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/419903/PoE%20Trade%20fuzzy%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("focusin", addFuzzyListener);

    function addFuzzyListener(event)
    {
        if (event.target.classList.contains("multiselect__input"))
        {
            event.target.addEventListener("keyup", fuzzyListener);
        }
    }

    function fuzzyListener(event)
    {
        var element = event.target;
        if (!element.value.startsWith("~") && !element.value.startsWith(" ") && event.keyCode != 8)
        {
            element.value = "~" + element.value;
        }
    }

})();
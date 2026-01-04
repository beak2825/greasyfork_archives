// ==UserScript==
// @name         Ao3 Show Only Crossovers - Unofficial
// @namespace    https://archiveofourown.org
// @version      0.1
// @description  Filter out things that aren't crossovers on Ao3.
// @author       Dino
// @match        https://archiveofourown.org/works/search?*
// @match        https://archiveofourown.org/tags/*/works*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32790/Ao3%20Show%20Only%20Crossovers%20-%20Unofficial.user.js
// @updateURL https://update.greasyfork.org/scripts/32790/Ao3%20Show%20Only%20Crossovers%20-%20Unofficial.meta.js
// ==/UserScript==

javascript: (function() {
    'use strict';

    var search_results = document.getElementsByClassName('work blurb group');
    var invalid_ids = [];

    document.getElementsByClassName('flash')[0].innerHTML = "<b>Show Only Crossovers</b> is turned on.";

    for (var i=0; i < search_results.length; i++) {
        var number_of_fandoms = search_results[i].getElementsByClassName('fandoms heading')[0].getElementsByClassName('tag').length;

        if (number_of_fandoms == 1) {
            invalid_ids.push(search_results[i].id);
        }
    }

    for (var i=0; i < invalid_ids.length; i++) {
        document.getElementById(invalid_ids[i]).remove();
    }

})();
// ==UserScript==
// @name         AO3: Chapter Links Cleaner
// @namespace    AO3-flash
// @version      1.0
// @description  Removes anchors from previous/next button links, so they can show as visited on the full-page chapter index.
// @author       flash
// @match        https://archiveofourown.org/works/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392778/AO3%3A%20Chapter%20Links%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/392778/AO3%3A%20Chapter%20Links%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.querySelectorAll('a[href$="#workskin"]');
    for(var i=0, len=links.length; i<len; i++) {
        links[i].href = links[i].href.replace("#workskin", "");
    }

})();
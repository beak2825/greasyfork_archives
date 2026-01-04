// ==UserScript==
// @name         AO3: Move work tags below stats
// @namespace    https://greasyfork.org/en/users/1506418-ct9633
// @version      0.1
// @description  Moves all the work tags in a blurb below the work stats
// @include      http*://archiveofourown.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546330/AO3%3A%20Move%20work%20tags%20below%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/546330/AO3%3A%20Move%20work%20tags%20below%20stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tags = document.querySelectorAll("ul.tags.commas");
    const stats = document.querySelectorAll("dl.stats");

    for (let i = 0; i < tags.length; i++) {
        stats[i].after(tags[i]);
        tags[i].insertAdjacentHTML("beforebegin", "<br><br><br>");
        tags[i].insertAdjacentHTML("afterend", "<br>");
//        tags[i].before(document.createElement("br"));
//        tags[i].after(document.createElement("br"));
    }
})();
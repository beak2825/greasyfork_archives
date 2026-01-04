// ==UserScript==
// @name         Hacker News add "best" filter
// @namespace    graphen
// @version      0.2.1
// @description  Adds top navigation link to sort by most upvoted news
// @author       Graphen
// @include      /https?:\/\/news\.ycombinator\.com/(?!best)(newest|newcomments|show|ask|jobs)?/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369663/Hacker%20News%20add%20%22best%22%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/369663/Hacker%20News%20add%20%22best%22%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var topNavi = document.querySelector(".pagetop");
    var spacing = document.createTextNode(" | ");
    var bestLink = document.createElement("a");
    var bestLinkText = document.createTextNode("best");

    bestLink.href = "best";
    bestLink.appendChild(bestLinkText);

    topNavi.appendChild(spacing);
    topNavi.appendChild(bestLink);

})();

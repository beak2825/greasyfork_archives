// ==UserScript==
// @name         Add AO3 Mark for Later Button to works list
// @namespace    https://greasyfork.org
// @version      0.1
// @description  Puts the "Marked for Later" button in a fic blurb when browsing AO3.
// @author       JaneBuzJane but indebted to Bat, always
// @match        http://archiveofourown.org/tags*
// @match        https://archiveofourown.org/tags*
// @match        http://archiveofourown.org/works*
// @match        https://archiveofourown.org/works*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @require      https://code.jquery.com/jquery-2.2.4.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432319/Add%20AO3%20Mark%20for%20Later%20Button%20to%20works%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/432319/Add%20AO3%20Mark%20for%20Later%20Button%20to%20works%20list.meta.js
// ==/UserScript==

var $j = jQuery.noConflict();

$j(document).ready(function() {

    for (var i = 0, link, links = $("li[role=article] > .header > .heading:first-child > a[href*='/works']"); i < links.length; i++) {

    (link = $(links[i])).closest(".header")
        .nextAll(".stats")
        .before("<span class=\"actions\" style=\"float: left; clear: right;\"><a href=\"" + link.attr("href") + "/mark_for_later\">Mark For Later</a></span>");
}

});
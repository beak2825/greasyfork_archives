// ==UserScript==
// @name        HighlightMasters
// @namespace   thisisnotavalidnamespace
// @version     2.0.20180115
// @description	Highlights Masters HITs in the color red on search pages. Specifically, the HIT title.
// @match       https://worker.mturk.com/?filters*
// @match       https://worker.mturk.com/projects?*
// @match       https://worker.mturk.com/projects
// @match       https://worker.mturk.com/projects/
// @match       https://worker.mturk.com/projects/?filters*
// @match       https://worker.mturk.com/projects/?page_size=*
// @match       https://worker.mturk.com/requesters/*
// @match       https://worker.mturk.com/?*
// @match       https://worker.mturk.com/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10206/HighlightMasters.user.js
// @updateURL https://update.greasyfork.org/scripts/10206/HighlightMasters.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$().ready(function() {
//alert($("li.hit-set-table-row").html());
$("span.button-text:Contains('Show Details')").click();

    $("li.hit-set-table-row:Contains('Masters has been granted')").each(function(index) {
	$(this).find("span.project-name-column").css('color', '#8B0000');
    });
$("span.button-text:Contains('Hide Details')").click();
    $("td:Contains('Masters')").each(function(index) {
        if ($(this).next().next().is(":Contains('You meet this qualification requirement')")) {
            $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent()
//            .find("[bgcolor*='CCDDE9']").css('background-color', '#FFE0E0');
            .find("[bgcolor*='CCDDE9']").find("a").css('color', '#8B0000');
        }
    });
});
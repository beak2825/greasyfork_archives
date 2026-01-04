// ==UserScript==
// @icon              https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @name              !!![mturk] - Find Tests/Masters
// @namespace         https://greasyfork.org/en/users/155391-lll
// @version           1.1.0
// @description       Turns the hit number green if there is a test, and the title if there's Masters.
// @author            LLL
// @match             https://worker.mturk.com/?filters*
// @match             https://worker.mturk.com/projects?*
// @match             https://worker.mturk.com/projects
// @match             https://worker.mturk.com/projects/?*
// @match             https://worker.mturk.com/requesters/*
// @match             https://worker.mturk.com
// @require           https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/373925/%21%21%21%5Bmturk%5D%20-%20Find%20TestsMasters.user.js
// @updateURL https://update.greasyfork.org/scripts/373925/%21%21%21%5Bmturk%5D%20-%20Find%20TestsMasters.meta.js
// ==/UserScript==

/* global $ */

$().ready(function() {
$("span.button-text:Contains('Show Details')").click();
    $("li.hit-set-table-row:Contains('Take Test')").each(function(index) {
    $(this).find("span.task-column").css('color', 'lime');
    });

    $("li.hit-set-table-row:Contains('Masters has been granted')").each(function(index) {
	$(this).find("span.project-name-column").css('color', 'lime');
    });
$("span.button-text:Contains('Hide Details')").click();

});
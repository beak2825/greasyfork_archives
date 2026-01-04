// ==UserScript==
// @name         AcWing QuickAns
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A simple script
// @author       je5r1ta
// @license      MIT
// @match        https://www.acwing.com/activity/content/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acwing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469911/AcWing%20QuickAns.user.js
// @updateURL https://update.greasyfork.org/scripts/469911/AcWing%20QuickAns.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $(".center-block").show();

        $(".punch-line").each(function() {
            // Get the URL of the problem from the href attribute of the first anchor tag within the div
            var problemURL = $(this).find("a:first").attr("href");
            // Create a new anchor tag with a button icon and the URL of the problem with a '?' appended to it
            var newButton = $("<a>").attr("href", problemURL + "?").attr("target", "_blank").addClass("btn btn-primary btn-xs").append($("<span>").addClass("glyphicon glyphicon-share-alt"));
            // Insert the new button after the first anchor tag within the div
            $(this).find("a:first").after(newButton);
        });
    });

    let url = window.location.href;
	if (url.includes("?")) {
		location.href = $(".label-info").get(0).href;
		return;
	}
})();
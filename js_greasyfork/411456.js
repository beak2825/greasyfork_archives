// ==UserScript==
// @name         Jira comments reverser
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Sctipt that shows what module type the bands are using
// @author       André Sousa
// @match        https://jsw.ibm.com/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411456/Jira%20comments%20reverser.user.js
// @updateURL https://update.greasyfork.org/scripts/411456/Jira%20comments%20reverser.meta.js
// ==/UserScript==

var customStyle = `<style>
.issue-container #issue-comment-add {
padding-bottom: 0px !important;
}
</style>`;

$("head").append(customStyle);

$(document).ready(function(){
	setTimeout(function(){
    	$(".sortwrap .issue-activity-sort-link[data-order='desc']").trigger("click");
    	$("#addcomment").insertBefore("#activitymodule");
    }, 5000);
});
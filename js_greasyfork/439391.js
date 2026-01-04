// ==UserScript==
// @name         Turn Streamate Inbox Links into Actual Links
// @namespace    https://greasyfork.org/en/users/870933
// @version      0.2
// @description  The links in the Streamate inbox don't use the HTML <a> element. They don't work properly, especially if you want to open links in new tabs. This script replaces their fake links with real ones.
// @author       LintillaTaylor
// @match        https://*.streamatemodels.com/smm/email/inbox/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439391/Turn%20Streamate%20Inbox%20Links%20into%20Actual%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/439391/Turn%20Streamate%20Inbox%20Links%20into%20Actual%20Links.meta.js
// ==/UserScript==

var url

$('.inbox_mail_row').each(function(i) {
	$(this).attr("style", "cursor:auto;")
	url = $(this).attr("data-url");
	$('em', this).replaceWith(function(){
		return $("<a />").attr("href", url).append($(this).contents());
	});
});
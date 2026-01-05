// ==UserScript==
// @name        MTurk Add PANDA link to capsule
// @namespace   http://idlewords.net
// @description Adds an auto-accept link to the HIT info capsule, next to "View a HIT in this group"
// @include     https://www.mturk.com/mturk/searchbar*
// @include     https://www.mturk.com/mturk/findhits*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10844/MTurk%20Add%20PANDA%20link%20to%20capsule.user.js
// @updateURL https://update.greasyfork.org/scripts/10844/MTurk%20Add%20PANDA%20link%20to%20capsule.meta.js
// ==/UserScript==

$("span.capsulelink").each(function(index, element) {
	linkHref = $(this).children("a").eq(-1).attr('href');
	linkHref = linkHref.replace('preview', 'previewandaccept') + '&autoAcceptEnabled=true';
	console.log(linkHref);
	$(this).append("&nbsp; | &nbsp;&nbsp;<span class='capsulelink'><a href='" + linkHref + "'>Auto-accept a HIT in this group</a>");
});
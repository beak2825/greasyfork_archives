// ==UserScript==
// @name         twitter conversation opener
// @version      0.2
// @description  expands conversations?
// @author       vG Rejected
// @match        *://twitter.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/9702
// @downloadURL https://update.greasyfork.org/scripts/10928/twitter%20conversation%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/10928/twitter%20conversation%20opener.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", viewConversations, false );

if( document.readyState == "complete" ) {
    conversationInterval = setInterval(viewConversations(), 30000);//30 second refresh rate
}

function viewConversations() {
	$("span.expand-stream-item.js-view-details").click();
}
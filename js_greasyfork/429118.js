// ==UserScript==
// @name         Sort by first message button
// @namespace    incelerated
// @version      0.2
// @description  Adds a "Sort by first message" button to the button group at the top of subforum pages
// @author       incelerated
// @match        https://incels.is/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429118/Sort%20by%20first%20message%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/429118/Sort%20by%20first%20message%20button.meta.js
// ==/UserScript==

$("document").ready(function(){

    var url = window.location.href;
	var forumName = url.split("/")[4];
	var buttonHTML = "";

    //if it's already sorted by first message make the button sort by last message
    if(url.indexOf("order=post_date&direction=desc") != -1){
        buttonHTML = `
			<a href="/forums/` + forumName + `/" class="button--link button"><span class="button-text">
			Sort by last message
			</span></a>
		`;
    }
	else{
		buttonHTML = `
			<a href="/forums/` + forumName + `/?order=post_date&direction=desc" class="button--link button"><span class="button-text">
			Sort by first message
			</span></a>
		`;
	}

	var btn = $(buttonHTML);
	$(".p-body-pageContent .block-outer .buttonGroup").prepend(btn);

});